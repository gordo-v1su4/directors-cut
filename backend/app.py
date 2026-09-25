"""Directors Cut catalog and upload adapter; all media processing stays in RustFS."""
from contextlib import contextmanager
import base64
import binascii
import hashlib
import hmac
import json
import os
from pathlib import Path
import re
import secrets
import sqlite3
import threading
import time
from urllib.parse import unquote
from datetime import datetime, timezone

import httpx
from robyn import Robyn, Request, Response

DATA = Path(os.getenv('DATA_DIR', '/data'))
DATA.mkdir(parents=True, exist_ok=True)
DB = DATA / 'directors-cut.sqlite'
GATEWAY = os.environ['MEDIA_GATEWAY_URL'].rstrip('/')
TOKEN = os.environ['MEDIA_GATEWAY_TOKEN']
PASSWORD = os.environ['DIRECTORS_CUT_OWNER_PASSWORD']
ORIGINS = set(os.getenv('ALLOWED_ORIGINS', 'https://directors-cut-two.vercel.app,http://127.0.0.1:5191').split(','))
BUCKET = 'directors-cut'
lock = threading.RLock()
app = Robyn(__file__)


@contextmanager
def connect():
    db = sqlite3.connect(DB, timeout=30)
    db.row_factory = sqlite3.Row
    db.execute('PRAGMA foreign_keys=ON')
    try:
        with db:
            yield db
    finally:
        db.close()


def initialize():
    with connect() as db:
        db.executescript('''
        PRAGMA journal_mode=WAL;
        CREATE TABLE IF NOT EXISTS documents (run_id TEXT, kind TEXT, value TEXT NOT NULL, PRIMARY KEY(run_id,kind));
        CREATE TABLE IF NOT EXISTS uploads (id TEXT PRIMARY KEY, run_id TEXT NOT NULL, sha TEXT NOT NULL, version INTEGER NOT NULL, object_key TEXT NOT NULL, media_url TEXT, job_id TEXT, status TEXT NOT NULL, error TEXT, created TEXT NOT NULL, UNIQUE(run_id,sha), UNIQUE(run_id,version));
        CREATE TABLE IF NOT EXISTS sessions (digest TEXT PRIMARY KEY, expires REAL NOT NULL);
        CREATE TABLE IF NOT EXISTS login_attempts (ip TEXT PRIMARY KEY, count INTEGER, until REAL);
        PRAGMA user_version=1;
        ''')
        seed = Path(os.getenv('SEED_DIR', '/app/seed'))
        for folder in seed.glob('*'):
            if not folder.is_dir():
                continue
            for kind in ('run', 'answers', 'artifacts', 'prompts', 'decisions'):
                path = folder / f'{kind}.json'
                if path.exists():
                    # Seeds never overwrite server-owned project data on deploy.
                    db.execute('INSERT OR IGNORE INTO documents VALUES (?,?,?)', (folder.name, kind, path.read_text()))


def document(db, run_id, kind):
    row = db.execute('SELECT value FROM documents WHERE run_id=? AND kind=?', (run_id, kind)).fetchone()
    return json.loads(row['value']) if row else None


def reply(request, body, status=200):
    headers = {'Content-Type': 'application/json', 'Cache-Control': 'no-store'}
    origin = request.headers.get('origin')
    if origin in ORIGINS:
        headers.update({'Access-Control-Allow-Origin': origin, 'Vary': 'Origin', 'Access-Control-Allow-Headers': 'Authorization, Content-Type, X-Filename, X-Run-Id', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'})
    return Response(status_code=status, headers=headers, description=json.dumps(body))


def authorized(request):
    origin = request.headers.get('origin')
    if origin and origin not in ORIGINS:
        return False
    token = request.headers.get('authorization') or ''
    if not token.startswith('Bearer '):
        return False
    digest = hashlib.sha256(token[7:].encode()).hexdigest()
    with connect() as db:
        return db.execute('SELECT 1 FROM sessions WHERE digest=? AND expires>?', (digest, time.time())).fetchone() is not None


@app.get('/health')
def health(request: Request):
    with connect() as db:
        count = db.execute("SELECT count(*) FROM documents WHERE kind='run'").fetchone()[0]
    return reply(request, {'ok': True, 'service': 'directors-cut-api', 'projects': count, 'revision': os.getenv('RELEASE_SHA', 'local')})


@app.options('/*path')
def options(request: Request):
    return reply(request, {})


@app.post('/login')
def login(request: Request):
    # Caddy replaces this header with the direct client IP; never trust a caller's value.
    ip = request.headers.get('x-real-ip') or 'local'
    with lock, connect() as db:
        attempt = db.execute('SELECT * FROM login_attempts WHERE ip=?', (ip,)).fetchone()
        if attempt and attempt['until'] > time.time() and attempt['count'] >= 10:
            return reply(request, {'error': 'Too many attempts. Try again in 15 minutes.'}, 429)
        try:
            payload = json.loads(request.body)
        except (ValueError, TypeError):
            return reply(request, {'error': 'Invalid request'}, 400)
        if request.headers.get('origin') not in ORIGINS or not hmac.compare_digest(str(payload.get('password', '')), PASSWORD) or payload.get('username') != 'gordo':
            count = attempt['count'] + 1 if attempt and attempt['until'] > time.time() else 1
            db.execute('INSERT OR REPLACE INTO login_attempts VALUES (?,?,?)', (ip, count, time.time()+900))
            return reply(request, {'error': 'Incorrect username or password'}, 401)
        token = secrets.token_urlsafe(32)
        db.execute('DELETE FROM sessions WHERE expires<?', (time.time(),))
        db.execute('INSERT INTO sessions VALUES (?,?)', (hashlib.sha256(token.encode()).hexdigest(), time.time()+86400))
        db.execute('DELETE FROM login_attempts WHERE ip=?', (ip,))
    return reply(request, {'token': token})


@app.get('/data/comparisons.index.json')
def index(request: Request):
    with connect() as db:
        runs = []
        for row in db.execute("SELECT run_id,value FROM documents WHERE kind='run'"):
            run = json.loads(row['value'])
            artifacts = document(db, row['run_id'], 'artifacts') or []
            ready = [a for a in artifacts if a.get('media_url')]
            preview = sorted(ready, key=lambda a:a.get('created_at',''))[-1] if ready else None
            runs.append({**run, 'preview': preview, 'artifact_count': len(artifacts), 'answer_count': len(document(db,row['run_id'],'answers') or []), 'model_labels': run.get('models_requested',[])})
    return reply(request, {'runs': runs, 'expected_models': []})


@app.get('/data/comparisons/:run_id/:file')
def get_document(request: Request):
    kind = request.path_params['file'].removesuffix('.json')
    if kind not in ('run','answers','artifacts','prompts','decisions'):
        return reply(request, {'error':'Not found'}, 404)
    with connect() as db:
        value = document(db, request.path_params['run_id'], kind)
    return reply(request, value, 200 if value is not None else 404)


@app.post('/versions')
def upload(request: Request):
    if not authorized(request):
        return reply(request, {'error': 'Sign in to upload', 'login_required': True}, 401)
    run_id = request.headers.get('x-run-id') or ''
    filename = unquote(request.headers.get('x-filename') or '')
    extension = Path(filename).suffix.lower()
    body = request.body
    if isinstance(body, str):
        return reply(request, {'error':'Upload binary video data'}, 400)
    if extension not in ('.mp4','.mov','.webm') or not body or len(body)>95*1000*1000:
        return reply(request, {'error':'Choose MP4, MOV or WebM, up to 95 MB'}, 400)
    sha = hashlib.sha256(body).hexdigest()
    with lock, connect() as db:
        run = document(db,run_id,'run')
        if not run:
            return reply(request, {'error':'Project not found'},404)
        artifacts = document(db,run_id,'artifacts') or []
        existing = db.execute('SELECT * FROM uploads WHERE run_id=? AND sha=?',(run_id,sha)).fetchone()
        if existing and existing['status']=='failed' and not existing['media_url']:
            db.execute('DELETE FROM uploads WHERE id=?',(existing['id'],))
            existing=None
        if existing:
            return reply(request, {'added':0,'versions':[], 'status':existing['status'], 'upload_id':existing['id'], 'error':existing['error']})
        if any(a.get('media_sha256')==sha or a.get('upload_sha256')==sha for a in artifacts):
            return reply(request, {'added':0,'versions':[],'status':'ready'})
        videos = [a for a in artifacts if a.get('artifact_type') in ('video_result','video')]
        highest = max([int(a.get('version_number',i+1)) for i,a in enumerate(videos)]+[0])
        queued = db.execute('SELECT max(version) FROM uploads WHERE run_id=?',(run_id,)).fetchone()[0] or 0
        version = max(highest,queued)+1
        uid = secrets.token_hex(16)
        now = datetime.now(timezone.utc)
        key = f'media-uploads/{now:%Y/%m_%d}/{run_id}/versions/v{version}/{sha}{extension}'
        db.execute('INSERT INTO uploads (id,run_id,sha,version,object_key,status,created) VALUES (?,?,?,?,?,?,?)',(uid,run_id,sha,version,key,'uploading',now.isoformat()))
    try:
        with httpx.Client(timeout=600) as client:
            response = client.post(GATEWAY+'/upload',headers={'Authorization':f'Bearer {TOKEN}'},data={'bucket':BUCKET,'userId':BUCKET,'folder':key.rsplit('/',1)[0],'preserveFilename':'true'},files={'file':(key.rsplit('/',1)[1],body,'application/octet-stream')})
            response.raise_for_status()
            media = response.json()
            if media.get('bucket') != BUCKET or media.get('objectKey') != key:
                raise ValueError('Unexpected storage destination')
        with connect() as db:
            db.execute("UPDATE uploads SET status='queued',media_url=? WHERE id=?",(media.get('publicUrl') or media['mediaUrl'],uid))
        return reply(request, {'added':1,'versions':[version],'upload_id':uid,'status':'queued'},202)
    except Exception:
        with connect() as db:
            db.execute("UPDATE uploads SET status='failed',error='Storage upload failed' WHERE id=?",(uid,))
        return reply(request, {'error':'Storage upload failed. Retry this upload.','upload_id':uid},502)


@app.post('/versions/:id/details')
def version_details(request: Request):
    if not authorized(request):
        return reply(request, {'error': 'Sign in to edit this version'}, 401)
    try:
        if len(request.body) > 15*1000*1000:
            raise ValueError()
        payload = json.loads(request.body)
        run_id = payload['run_id']
        prompt = payload['prompt']
        model = payload['video_model']
        if not isinstance(prompt, str) or len(prompt)>100000 or not isinstance(model,str) or len(model)>100:
            raise ValueError()
        grid = payload.get('grid')
        image = None
        if isinstance(grid, dict) and 'data' in grid:
            image = base64.b64decode(grid['data'], validate=True)
            if not image or len(image)>10*1000*1000:
                raise ValueError()
            if image.startswith(b'\x89PNG\r\n\x1a\n'):
                extension, mime = 'png', 'image/png'
            elif image.startswith(b'\xff\xd8\xff'):
                extension, mime = 'jpg', 'image/jpeg'
            elif image.startswith(b'RIFF') and image[8:12]==b'WEBP':
                extension, mime = 'webp', 'image/webp'
            else:
                raise ValueError()
        elif grid is not None and (not isinstance(grid,dict) or not isinstance(grid.get('artifact_id'),str)):
            raise ValueError()
    except (ValueError, KeyError, TypeError, binascii.Error):
        return reply(request, {'error':'Provide a prompt, video model and a PNG, JPEG or WebP grid up to 10 MB'},400)
    artifact_id = request.path_params['id']
    with lock, connect() as db:
        artifacts = document(db,run_id,'artifacts') or []
        target = next((a for a in artifacts if a['artifact_id']==artifact_id and a['artifact_type'] in ('video_result','end_video')),None)
        if not target:
            return reply(request, {'error':'Video version not found'},404)
        if payload.get('revision',0) != target.get('context_revision',0):
            return reply(request, {'error':'This version changed. Reload the project before editing.'},409)
        linked = None
        if grid and image is None:
            linked = next((a for a in artifacts if a['artifact_id']==grid['artifact_id'] and a['artifact_type'] in ('shot_grid','image_result') and a.get('media_url')),None)
            if not linked:
                return reply(request, {'error':'Shot grid not found in this project'},400)
    grid_url = linked['media_url'] if linked else None
    grid_key = None
    if image is not None:
        # Content-addressed keys keep replacement grids and other versions intact.
        safe_id = hashlib.sha256(artifact_id.encode()).hexdigest()[:24]
        key = f'version-assets/{run_id}/{safe_id}/shot-grids/{hashlib.sha256(image).hexdigest()}.{extension}'
        try:
            with httpx.Client(timeout=120) as client:
                response = client.post(GATEWAY+'/upload',headers={'Authorization':f'Bearer {TOKEN}'},data={'bucket':BUCKET,'userId':BUCKET,'folder':key.rsplit('/',1)[0],'preserveFilename':'true'},files={'file':(key.rsplit('/',1)[1],image,mime)})
                response.raise_for_status()
                media = response.json()
                if media.get('bucket')!=BUCKET or media.get('objectKey')!=key:
                    raise ValueError()
                grid_url = media.get('publicUrl') or media['mediaUrl']
                grid_key = key
        except (httpx.HTTPError,ValueError,KeyError):
            return reply(request, {'error':'Grid upload failed. Your version was not changed.'},502)
    with lock, connect() as db:
        artifacts = document(db,run_id,'artifacts') or []
        target = next((a for a in artifacts if a['artifact_id']==artifact_id),None)
        if not target or payload.get('revision',0)!=target.get('context_revision',0):
            return reply(request, {'error':'This version changed. Reload the project before editing.'},409)
        target.update(version_prompt=prompt,video_model=model.strip(),context_revision=target.get('context_revision',0)+1)
        # Omitted grid preserves the existing attachment; null explicitly removes it.
        if 'grid' in payload:
            target.update(shot_grid_url=grid_url,shot_grid_object_key=grid_key,shot_grid_artifact_id=linked['artifact_id'] if linked else None)
        db.execute("UPDATE documents SET value=? WHERE run_id=? AND kind='artifacts'",(json.dumps(artifacts),run_id))
    return reply(request, {'artifact':target})


@app.post('/runs/:run_id')
def run_details(request: Request):
    """Rename a project or rewrite its logline after the fact."""
    if not authorized(request):
        return reply(request, {'error': 'Sign in to edit this project'}, 401)
    try:
        payload = json.loads(request.body)
        changes = {}
        if 'title' in payload:
            title = payload['title']
            if not isinstance(title, str) or not title.strip() or len(title.strip()) > 120:
                raise ValueError()
            changes['title'] = title.strip()
        if 'logline' in payload:
            logline = payload['logline']
            if not isinstance(logline, str) or len(logline) > 600:
                raise ValueError()
            changes['logline'] = logline.strip()
        if not changes:
            raise ValueError()
    except (ValueError, TypeError):
        return reply(request, {'error': 'Provide a title up to 120 characters or a logline up to 600'}, 400)
    run_id = request.path_params['run_id']
    with lock, connect() as db:
        run = document(db, run_id, 'run')
        if run is None:
            return reply(request, {'error': 'Project not found'}, 404)
        run.update(changes)
        db.execute("UPDATE documents SET value=? WHERE run_id=? AND kind='run'", (json.dumps(run), run_id))
    return reply(request, {'run': run})


@app.get('/uploads/:id')
def upload_status(request: Request):
    if not authorized(request):
        return reply(request, {'error':'Sign in to view upload status'},401)
    with connect() as db:
        row=db.execute('SELECT id,status,error,version FROM uploads WHERE id=?',(request.path_params['id'],)).fetchone()
    return reply(request,dict(row) if row else {'error':'Not found'},200 if row else 404)


def process_once():
    with connect() as db:
        pending=[dict(r) for r in db.execute("SELECT * FROM uploads WHERE status IN ('queued','processing')")]
    with httpx.Client(timeout=30,headers={'Authorization':f'Bearer {TOKEN}'}) as client:
        for item in pending:
            try:
                if not item['job_id']:
                    result=client.post(GATEWAY+'/video/jobs',json={'bucket':BUCKET,'objectKey':item['object_key'],'metadata':{'project':'directors-cut','upload_id':item['id']}})
                    result.raise_for_status()
                    job=result.json().get('job',result.json())
                    with connect() as db:
                        db.execute("UPDATE uploads SET job_id=?,status='processing' WHERE id=?",(job['job_id'],item['id']))
                    continue
                result=client.get(GATEWAY+'/video/jobs/'+item['job_id'])
                if result.status_code==404:
                    with connect() as db:
                        db.execute("UPDATE uploads SET status='failed',error='Processing job expired. Retry processing.' WHERE id=?",(item['id'],))
                    continue
                result.raise_for_status()
                job=result.json().get('job',result.json())
                if job['status']=='failed':
                    with connect() as db:
                        db.execute("UPDATE uploads SET status='failed',error='Video processing failed. Retry processing.' WHERE id=?",(item['id'],))
                elif job['status']=='completed':
                    result=client.get(GATEWAY+'/video/jobs/'+item['job_id']+'/result')
                    result.raise_for_status()
                    payload=result.json()
                    manifest=payload.get('manifest',payload)
                    segments=manifest.get('segments',[])
                    if not segments or not segments[0].get('thumbnail_url'):
                        raise ValueError('Missing thumbnail')
                    with lock, connect() as db:
                        run=document(db,item['run_id'],'run')
                        artifacts=document(db,item['run_id'],'artifacts') or []
                        answers=document(db,item['run_id'],'answers') or []
                        artifact={'artifact_id':item['id'],'run_id':item['run_id'],'answer_id':next((a.get('answer_id') for a in artifacts if a.get('artifact_type')=='video_result'), answers[0].get('answer_id') if answers else None),'artifact_type':'video_result','provider':'manual_upload','target_model':'manual','title':f"{run['title']} — v{item['version']}",'version_number':item['version'],'source':'uploaded','status':'generated','created_at':item['created'],'media_url':item['media_url'],'thumbnail_url':segments[0]['thumbnail_url'],'storage_bucket':BUCKET,'object_key':item['object_key'],'media_sha256':item['sha'],'duration_seconds':manifest.get('duration_seconds'),'job_id':item['job_id']}
                        if not any(a['artifact_id']==item['id'] for a in artifacts):
                            artifacts.append(artifact)
                            db.execute("UPDATE documents SET value=? WHERE run_id=? AND kind='artifacts'",(json.dumps(artifacts),item['run_id']))
                        db.execute("UPDATE uploads SET status='ready',error=NULL WHERE id=?",(item['id'],))
            except (ValueError,KeyError):
                with connect() as db:
                    db.execute("UPDATE uploads SET status='failed',error='Processing result incomplete. Retry processing.' WHERE id=?",(item['id'],))
            except httpx.HTTPError:
                continue


@app.post('/uploads/:id/retry')
def retry(request: Request):
    if not authorized(request):
        return reply(request,{'error':'Sign in to retry'},401)
    with lock,connect() as db:
        row=db.execute('SELECT * FROM uploads WHERE id=?',(request.path_params['id'],)).fetchone()
        if not row or row['status']!='failed' or not row['media_url']:
            return reply(request,{'error':'Choose the file again to retry the upload'},409)
        db.execute("UPDATE uploads SET status='queued',job_id=NULL,error=NULL WHERE id=?",(row['id'],))
    return reply(request,{'ok':True})


def worker():
    while True:
        try:
            process_once()
        except Exception:
            print('Upload reconciliation failed; will retry',flush=True)
        time.sleep(5)


if __name__=='__main__':
    initialize()
    with connect() as db:
        db.execute("UPDATE uploads SET status='failed',error='Upload interrupted. Choose the file again.' WHERE status='uploading'")
    threading.Thread(target=worker,daemon=True).start()
    app.start(host='0.0.0.0',port=int(os.getenv('PORT','18100')))
