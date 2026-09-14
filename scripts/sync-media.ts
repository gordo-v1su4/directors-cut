#!/usr/bin/env bun
/** Register once with `track RUN ANSWER JOB`, then `sync` or `watch`. Never submits a paid generation. */
import { readdirSync, existsSync, readFileSync, mkdirSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { catalog, root, safeId, hash, jsonLines, atomic, upload, objectFolder } from './lib/media-catalog';

const db = catalog();
const content = join(root, 'content/comparisons');
const args = process.argv.slice(2);
function command(argv: string[]) {
  const result = Bun.spawnSync(argv, {cwd:root, stdout:'pipe', stderr:'pipe'});
  if (result.exitCode !== 0) throw new Error(`${argv[0]} failed; check local authentication or media tooling`);
  return result.stdout.toString();
}
async function importJob(row: any) {
  const job = JSON.parse(command(['higgsfield','--json','generate','get',row.job_id]));
  if (job.id !== row.job_id) throw new Error('Provider returned the wrong job');
  if (job.status !== 'completed') {
    db.query('UPDATE jobs SET status=?,updated_at=? WHERE job_id=?').run(['failed','cancelled','canceled'].includes(job.status) ? 'failed' : 'pending',new Date().toISOString(),row.job_id);
    return;
  }
  if (job.params?.prompt !== row.prompt) throw new Error('Submitted prompt does not match the registered job');
  const runDir = join(content, safeId(row.run_id));
  const local = join(runDir, 'media', `${safeId(row.job_id)}.mp4`);
  mkdirSync(join(runDir,'media'), {recursive:true});
  if (!existsSync(local)) {
    const url = new URL(job.result_url);
    if (url.protocol !== 'https:' || !url.hostname.endsWith('.cloudfront.net')) throw new Error('Unexpected provider result host');
    const res = await fetch(url, {signal:AbortSignal.timeout(180000)});
    if (!res.ok) throw new Error(`Video download failed (HTTP ${res.status})`);
    await Bun.write(`${local}.tmp`, res);
    const { renameSync } = await import('node:fs'); renameSync(`${local}.tmp`,local);
  }
  const probe = JSON.parse(command(['ffprobe','-v','error','-show_streams','-show_format','-of','json',local]));
  const video = probe.streams.find((s:any)=>s.codec_type==='video');
  if (!video || !Number(probe.format.duration)) throw new Error('Downloaded result is not playable video');
  if (job.job_set_type === 'sora2_video' && (video.width !== 1280 || video.height !== 720 || Math.abs(Number(probe.format.duration)-12) > .2)) throw new Error('Sora video does not match 720p / 12-second settings');
  const artifactsPath = join(runDir,'artifacts.jsonl');
  const artifacts = jsonLines(artifactsPath);
  const artifactId = `higgsfield-${row.job_id}`;
  if (!artifacts.some(a=>a.artifact_id===artifactId)) {
    artifacts.push({artifact_id:artifactId, run_id:row.run_id, answer_id:row.answer_id, artifact_type:'video_result', provider:'higgsfield', target_model:job.job_set_type === 'sora2_video' ? 'sora-2' : job.job_set_type, title:JSON.parse(readFileSync(join(root,'public/data/comparisons',row.run_id,'run.json'),'utf8')).title,
      prompt_text:row.prompt, prompt_sha256:hash(row.prompt), created_at:new Date(job.created_at*1000).toISOString(), source:'generated',status:'generated',job_id:row.job_id,
      media_url:`/data/comparisons/${row.run_id}/media/${row.job_id}.mp4`,local_path:`media/${row.job_id}.mp4`,result_url:job.result_url,width:video.width,height:video.height,duration_seconds:Number(probe.format.duration),aspect_ratio:job.params.aspect_ratio});
    atomic(artifactsPath,artifacts.map(a=>JSON.stringify(a)).join('\n')+'\n');
  }
  // Preserve the exact submitted prompt, even when the editable concept changes later.
  db.query('UPDATE jobs SET receipt_json=?,status=?,error=NULL,updated_at=? WHERE job_id=?').run(JSON.stringify(job),'downloaded',new Date().toISOString(),row.job_id);
}
async function discover() {
  const candidates: {runId:string; answerId:string; prompt:string; created:number}[] = [];
  for (const runId of readdirSync(content)) {
    for (const answer of jsonLines(join(content,runId,'answers.jsonl'))) {
      if (answer.structured_prompt?.package_type !== 'creative_concept_v1') continue;
      candidates.push({runId,answerId:answer.answer_id,prompt:answer.structured_prompt.sora_prompt,created:new Date(answer.created_at).getTime()});
    }
  }
  const jobs = JSON.parse(command(['higgsfield','--json','generate','list','--video','--size','30']));
  if (!Array.isArray(jobs)) throw new Error('Unexpected provider job list');
  for (const job of jobs) {
    if (db.query('SELECT job_id FROM jobs WHERE job_id=?').get(job.id)) continue;
    const matches=candidates.filter(c=>c.prompt===job.params?.prompt && job.created_at*1000 >= c.created);
    if (matches.length!==1) continue;
    const match=matches[0];
    db.query('INSERT OR IGNORE INTO jobs(job_id,run_id,answer_id,prompt,updated_at) VALUES (?,?,?,?,?)').run(job.id,match.runId,match.answerId,match.prompt,new Date().toISOString());
  }
}
async function sync() {
  try { await discover(); } catch { console.error('Provider discovery unavailable; registered jobs and local media will still sync.'); }
  for (const job of db.query("SELECT * FROM jobs WHERE status IN ('pending','downloaded')").all()) {
    try { await importJob(job); } catch(error) {
      db.query('UPDATE jobs SET error=?,updated_at=? WHERE job_id=?').run(String(error),new Date().toISOString(),(job as any).job_id);
      console.error(`Job ${(job as any).job_id}: ${String(error)}`);
    }
  }
  command(['bun','scripts/build-video-posters.ts']);
  let changed = false;
  for (const runId of readdirSync(content)) {
    const dir = join(content,runId);
    if (!existsSync(join(dir,'comparison-run.md'))) continue;
    const artifacts = jsonLines(join(dir,'artifacts.jsonl'));
    let dirty = false;
    for (const a of artifacts) {
      if (!a.media_url || !['generated','selected'].includes(a.status)) continue;
      const localPrefix = `/data/comparisons/${runId}/`;
      const relative = a.media_url.startsWith(localPrefix) ? a.media_url.slice(localPrefix.length) : (a.local_path || '').replace(`content/comparisons/${runId}/`, '');
      if (!/^media\/[a-zA-Z0-9_.-]+$/.test(relative)) continue;
      const local = join(dir,relative);
      if (!existsSync(local)) continue;
      const folder = objectFolder(runId,a.job_id || a.artifact_id,a.created_at);
      const isVideo = ['video_result','end_video'].includes(a.artifact_type);
      const media = await upload(db,local,`${folder}/original`,isVideo ? 'video/mp4' : local.endsWith('.png') ? 'image/png':'image/jpeg');
      const poster = isVideo ? await upload(db,`${local}.jpg`,`${folder}/preview`,'image/jpeg') : media;
      if (a.media_url !== media.url || a.thumbnail_url !== poster.url) {
        Object.assign(a,{media_url:media.url,thumbnail_url:poster.url,local_path:relative,storage_bucket:'directors-cut',object_key:media.objectKey,thumbnail_key:poster.objectKey,media_sha256:media.sha256}); dirty=true;
      }
      db.query('INSERT OR REPLACE INTO assets VALUES (?,?,?)').run(a.artifact_id,runId,JSON.stringify(a));
      if (a.job_id) db.query("UPDATE jobs SET status='imported',error=NULL,updated_at=? WHERE job_id=?").run(new Date().toISOString(),a.job_id);
    }
    if (dirty) { atomic(join(dir,'artifacts.jsonl'),artifacts.map(a=>JSON.stringify(a)).join('\n')+'\n'); changed=true; }
    if (artifacts.some(a=>a.status==='generated') && db.query("SELECT job_id FROM jobs WHERE run_id=? AND status='imported'").get(runId)) {
      const file = join(dir,'comparison-run.md'); const before = readFileSync(file,'utf8'); const after = before.replace(/^status:.*$/m,'status: ready_for_review');
      if (before!==after) { atomic(file,after); changed=true; }
    }
  }
  if (changed || args[0] !== 'watch') command(['bun','scripts/build-comparisons-index.ts']);
  for (const runId of readdirSync(content)) {
    const file = join(root,'public/data/comparisons',runId,'run.json');
    if (existsSync(file)) {const r=JSON.parse(readFileSync(file,'utf8'));db.query('INSERT OR REPLACE INTO projects VALUES (?,?,?)').run(runId,r.title,JSON.stringify(r));}
  }
  console.log(JSON.stringify({projects:(db.query('SELECT COUNT(*) AS n FROM projects').get() as any).n, assets:(db.query('SELECT COUNT(*) AS n FROM assets').get() as any).n,jobs:db.query('SELECT job_id,status,error FROM jobs').all()}));
}
try {
  if (args[0]==='track') {
    const [runId,answerId,jobId] = args.slice(1).map(safeId);
    if (!runId || !answerId || !jobId) throw new Error('Usage: track RUN ANSWER JOB');
    if (!jsonLines(join(content,runId,'answers.jsonl')).some(a=>a.answer_id===answerId)) throw new Error('Answer not found in project');
    const job=JSON.parse(command(['higgsfield','--json','generate','get',jobId]));
    if (job.id!==jobId || typeof job.params?.prompt !== 'string') throw new Error('Invalid job receipt');
    const existing=db.query('SELECT run_id,answer_id FROM jobs WHERE job_id=?').get(jobId) as any;
    if(existing && (existing.run_id!==runId || existing.answer_id!==answerId)) throw new Error('Job already belongs to another project');
    db.query('INSERT OR IGNORE INTO jobs(job_id,run_id,answer_id,prompt,updated_at) VALUES (?,?,?,?,?)').run(jobId,runId,answerId,job.params.prompt,new Date().toISOString());
    console.log(`Registered ${jobId} for ${runId}`);
  } else if (args[0]==='sync' || args[0]==='watch') {
    const lock=join(root,'.local/media-sync.lock'); mkdirSync(join(root,'.local'),{recursive:true});
    const {openSync,closeSync}=await import('node:fs'); let fd:number;
    try {fd=openSync(lock,'wx');} catch {throw new Error('Media sync is already running; if it crashed, remove .local/media-sync.lock before restarting');}
    const cleanup=()=>{closeSync(fd);unlinkSync(lock);db.close();};
    process.on('SIGINT',()=>{cleanup();process.exit(0);}); process.on('SIGTERM',()=>{cleanup();process.exit(0);});
    try {do {try { await sync(); } catch (error) { if(args[0]!=='watch') throw error; console.error(String(error)); } if(args[0]==='watch') await Bun.sleep(30000);} while(args[0]==='watch');} finally {cleanup();}
  } else throw new Error('Usage: sync-media.ts track RUN ANSWER JOB | sync | watch');
} catch(error) {console.error(String(error));process.exitCode=1;}
