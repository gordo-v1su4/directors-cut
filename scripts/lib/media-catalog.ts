import { Database } from 'bun:sqlite';
import { mkdirSync, readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';

export const root = resolve(import.meta.dir, '../..');
export const hash = (data: string | Buffer) => createHash('sha256').update(data).digest('hex');
export function safeId(value: string) {
  if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]*$/.test(value)) throw new Error('Invalid project, answer or job ID');
  return value;
}
export function jsonLines(path: string): any[] {
  return existsSync(path) ? readFileSync(path, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)) : [];
}
export function atomic(path: string, value: string) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(`${path}.tmp`, value);
  renameSync(`${path}.tmp`, path);
}
export function catalog(path = process.env.DIRECTORS_CUT_DATABASE || resolve(root, '.local/directors-cut.sqlite')) {
  mkdirSync(dirname(resolve(path)), { recursive: true, mode: 0o700 });
  const db = new Database(path, { create: true });
  db.exec(`PRAGMA journal_mode=WAL; PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS projects (run_id TEXT PRIMARY KEY, title TEXT NOT NULL, metadata_json TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS jobs (job_id TEXT PRIMARY KEY, run_id TEXT NOT NULL, answer_id TEXT NOT NULL,
      prompt TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', receipt_json TEXT, error TEXT, updated_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS assets (artifact_id TEXT PRIMARY KEY, run_id TEXT NOT NULL, metadata_json TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS uploads (sha256 TEXT NOT NULL, object_key TEXT NOT NULL, url TEXT NOT NULL,
      PRIMARY KEY(sha256, object_key));`);
  return db;
}
export function objectFolder(runId: string, generationId: string, created: string) {
  const date = new Date(created);
  if (!Number.isFinite(date.getTime())) throw new Error('Invalid asset date');
  return `media-uploads/${date.getUTCFullYear()}/${String(date.getUTCMonth()+1).padStart(2,'0')}_${String(date.getUTCDate()).padStart(2,'0')}/${safeId(runId)}/generations/${safeId(generationId)}`;
}
export async function upload(db: Database, file: string, folder: string, mime: string) {
  const bucket = process.env.MEDIA_GATEWAY_BUCKET;
  if (bucket !== 'directors-cut' || process.env.MEDIA_GATEWAY_USER_ID !== bucket) throw new Error('Storage scope must be directors-cut');
  const gateway = process.env.MEDIA_GATEWAY_URL;
  const token = process.env.MEDIA_GATEWAY_TOKEN;
  if (!gateway || !token) throw new Error('Media gateway environment is not configured');
  const data = readFileSync(file);
  const sha256 = hash(data);
  const filename = `${sha256}.${mime === 'video/mp4' ? 'mp4' : mime === 'image/png' ? 'png' : 'jpg'}`;
  const objectKey = `${folder}/${filename}`;
  const previous = db.query('SELECT url FROM uploads WHERE sha256=? AND object_key=?').get(sha256, objectKey) as {url:string}|null;
  if (previous) return { url: previous.url, objectKey, sha256 };
  const form = new FormData();
  form.set('userId', bucket); form.set('bucket', bucket); form.set('folder', folder);
  form.set('preserveFilename', 'true'); form.set('file', new Blob([data], {type:mime}), filename);
  const response = await fetch(`${gateway.replace(/\/$/,'')}/upload`, {method:'POST', headers:{Authorization:`Bearer ${token}`}, body:form, signal:AbortSignal.timeout(180000)});
  if (!response.ok) throw new Error(`Media upload failed (HTTP ${response.status})`);
  const result = await response.json() as {bucket:string;objectKey:string;publicUrl:string};
  if (result.bucket !== bucket || result.objectKey !== objectKey) throw new Error('Gateway returned an unexpected storage location');
  const verify = await fetch(result.publicUrl, {method:'HEAD', signal:AbortSignal.timeout(30000)});
  if (!verify.ok || Number(verify.headers.get('content-length')) !== data.length) throw new Error('Stored object verification failed');
  db.query('INSERT OR REPLACE INTO uploads VALUES (?,?,?)').run(sha256, objectKey, result.publicUrl);
  return {url:result.publicUrl, objectKey, sha256};
}
