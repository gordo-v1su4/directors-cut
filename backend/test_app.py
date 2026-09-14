import json
import os
from pathlib import Path
import tempfile
import unittest
from unittest.mock import Mock, patch

TEMP=tempfile.TemporaryDirectory()
os.environ.update(DATA_DIR=TEMP.name,SEED_DIR=str((Path(__file__).resolve().parents[1]/'public/data/comparisons') if (Path(__file__).resolve().parents[1]/'public/data/comparisons').exists() else Path('/app/seed')),MEDIA_GATEWAY_URL='http://invalid',MEDIA_GATEWAY_TOKEN='test',DIRECTORS_CUT_OWNER_PASSWORD='test')
import app


def request(body=b'',headers=None,params=None):
    return Mock(body=body,headers=headers or {},path_params=params or {})


class CatalogTests(unittest.TestCase):
    def setUp(self):
        app.initialize()

    def test_seed_is_not_overwritten_on_restart(self):
        with app.connect() as db:
            db.execute("INSERT OR REPLACE INTO documents VALUES ('custom','run','{\"title\":\"persisted\"}')")
        app.initialize()
        with app.connect() as db:
            self.assertEqual(app.document(db,'custom','run')['title'],'persisted')

    def test_authentication_and_origin(self):
        denied=app.upload(request(b'video'))
        self.assertEqual(denied.status_code,401)
        login=app.login(request(json.dumps({'username':'gordo','password':'test'}),{'origin':'https://directors-cut-two.vercel.app'}))
        token=json.loads(login.description)['token']
        self.assertTrue(app.authorized(request(headers={'authorization':'Bearer '+token})))
        self.assertFalse(app.authorized(request(headers={'authorization':'Bearer '+token,'origin':'https://evil.example'})))

    def test_unknown_project_never_calls_storage(self):
        with patch.object(app,'authorized',return_value=True),patch.object(app.httpx,'Client') as client:
            result=app.upload(request(b'bytes',{'x-run-id':'../other','x-filename':'test.mp4'}))
        self.assertEqual(result.status_code,404)
        client.assert_not_called()

    def test_completed_job_publishes_exactly_once(self):
        run='20260914-the-last-prescription'
        with app.connect() as db:
            db.execute("INSERT OR REPLACE INTO uploads VALUES ('test-job',?,'sha',99,'media-uploads/test.mp4','https://s3.v1su4.dev/directors-cut/test.mp4','job','processing',NULL,'2026-09-14')",(run,))
        status=Mock(status_code=200);status.json.return_value={'job':{'status':'completed'}}
        result=Mock(status_code=200);result.json.return_value={'segments':[{'thumbnail_url':'https://s3.v1su4.dev/directors-cut/test.jpg'}],'duration_seconds':1}
        client=Mock();client.get.side_effect=[status,result]
        with patch.object(app.httpx,'Client') as factory:
            factory.return_value.__enter__.return_value=client
            app.process_once();app.process_once()
        with app.connect() as db:
            artifacts=app.document(db,run,'artifacts')
            self.assertEqual(sum(a['artifact_id']=='test-job' for a in artifacts),1)
            self.assertEqual(db.execute("SELECT status FROM uploads WHERE id='test-job'").fetchone()[0],'ready')

class VersionDetailsTests(unittest.TestCase):
    def setUp(self):
        app.initialize()
        self.videos=[{'artifact_id':'v1','artifact_type':'video_result','prompt_text':'original generation prompt'}, {'artifact_id':'v2','artifact_type':'video_result'}, {'artifact_id':'grid1','artifact_type':'shot_grid','media_url':'https://example.test/grid.png'}]
        with app.connect() as db:
            db.execute('INSERT OR REPLACE INTO documents VALUES (?,?,?)',('details-qa','artifacts',json.dumps(self.videos)))

    def save(self, **overrides):
        payload={'run_id':'details-qa','prompt':'revised take','video_model':'Sora 2','grid':{'artifact_id':'grid1'}, **overrides}
        return app.version_details(request(json.dumps(payload),params={'id':'v1'}))

    def test_version_pairing_persists_without_changing_other_versions_or_provenance(self):
        with patch.object(app,'authorized',return_value=True):
            self.assertEqual(self.save().status_code,200)
        app.initialize()
        with app.connect() as db:
            values=app.document(db,'details-qa','artifacts')
        self.assertEqual(values[0]['version_prompt'],'revised take')
        self.assertEqual(values[0]['prompt_text'],'original generation prompt')
        self.assertEqual(values[0]['video_model'],'Sora 2')
        self.assertEqual(values[0]['shot_grid_url'],'https://example.test/grid.png')
        self.assertEqual(values[1:],self.videos[1:])

    def test_explicit_removal_and_stale_edit_conflict(self):
        with patch.object(app,'authorized',return_value=True):
            self.save()
            self.assertEqual(self.save().status_code,409)
            response=self.save(revision=1,grid=None,prompt='')
        self.assertEqual(response.status_code,200)
        artifact=json.loads(response.description)['artifact']
        self.assertIsNone(artifact['shot_grid_url'])
        self.assertEqual(artifact['version_prompt'],'')

    def test_auth_and_invalid_attachment_do_not_touch_storage(self):
        self.assertEqual(self.save().status_code,401)
        with patch.object(app,'authorized',return_value=True),patch.object(app.httpx,'Client') as client:
            self.assertEqual(self.save(grid={'artifact_id':'other-project-grid'}).status_code,400)
            self.assertEqual(self.save(grid={'data':'invalid base64'}).status_code,400)
            self.assertEqual(self.save(grid={'data':'PHN2Zz4='}).status_code,400)
        client.assert_not_called()

    def test_grid_upload_failure_does_not_save_partial_details(self):
        import base64
        with patch.object(app,'authorized',return_value=True),patch.object(app.httpx,'Client') as factory:
            factory.return_value.__enter__.return_value.post.side_effect=app.httpx.ConnectError('test')
            response=self.save(grid={'data':base64.b64encode(b'\x89PNG\r\n\x1a\ncontent').decode()})
        self.assertEqual(response.status_code,502)
        with app.connect() as db:
            self.assertEqual(app.document(db,'details-qa','artifacts'),self.videos)

if __name__=='__main__': unittest.main()
