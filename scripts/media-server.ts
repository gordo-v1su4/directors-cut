#!/usr/bin/env bun
import { mkdirSync, existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { root, safeId, jsonLines, atomic, hash } from './lib/media-catalog';

const port=Number(process.env.DIRECTORS_CUT_MEDIA_PORT || 8788);
let queue:Promise<unknown>=Promise.resolve();
let lastSyncError:string|null=null;
function serialized<T>(work:()=>Promise<T>):Promise<T> {
  const next=queue.then(work);queue=next.catch(()=>{});return next;
}
async function run(argv:string[]) {
  const child=Bun.spawn(argv,{cwd:root,stdout:'pipe',stderr:'pipe'});
  const [stdout,stderr,code]=await Promise.all([new Response(child.stdout).text(),new Response(child.stderr).text(),child.exited]);
  if(code!==0) throw new Error(`${argv[0]} media processing failed`);
  return stdout;
}
async function sync() {
  try {await run(['bun','--env-file=.env.local','scripts/sync-media.ts','sync']);lastSyncError=null;}
  catch {lastSyncError='Storage sync is unavailable; local uploads are saved and will retry.';}
}
async function addVersions(runId:string,files:File[]) {
  const dir=join(root,'content/comparisons',safeId(runId));
  const runFile=join(root,'public/data/comparisons',runId,'run.json');
  if(!existsSync(join(dir,'comparison-run.md')) || !existsSync(runFile)) throw new Error('Project not found');
  const project=JSON.parse(readFileSync(runFile,'utf8'));
  const artifactsFile=join(dir,'artifacts.jsonl');
  const artifacts=jsonLines(artifactsFile);
  const videos=artifacts.filter(a=>['video_result','end_video'].includes(a.artifact_type) && a.media_url);
  let version=Math.max(videos.length,...videos.map(a=>a.version_number || 0));
  const added:any[]=[];
  // Validate the entire batch before publishing any artifact records.
  for(const file of files) {
    if(!/\.(mp4|mov|webm)$/i.test(file.name) || file.size===0 || file.size>512*1024*1024) throw new Error('Use MP4, MOV or WebM videos, up to 512 MB each');
    const data=Buffer.from(await file.arrayBuffer());const sha=hash(data);
    const existing=artifacts.find(a=>(a.upload_sha256===sha || a.media_sha256===sha)) || added.find(a=>a.upload_sha256===sha);
    if(existing) continue;
    const id=`upload-${sha.slice(0,24)}`;
    const mediaDir=join(dir,'media');mkdirSync(mediaDir,{recursive:true});
    const staging=join(root,'.local','uploads',`${id}.${file.name.split('.').pop()!.toLowerCase()}`);mkdirSync(join(root,'.local/uploads'),{recursive:true});
    await Bun.write(staging,data);
    const probe=JSON.parse(await run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',staging]));
    const stream=probe.streams.find((s:any)=>s.codec_type==='video');
    if(!stream || !Number(probe.format.duration)) throw new Error(`${file.name} is not a readable video`);
    const path=join(mediaDir,`${id}.mp4`);
    if(!existsSync(path)) {
      // Normalize uploaded containers/codecs for browser playback; preserve the source in local staging.
      await run(['ffmpeg','-v','error','-y','-i',staging,'-map','0:v:0','-map','0:a?','-c:v','libx264','-preset','fast','-crf','20','-pix_fmt','yuv420p','-vf','scale=trunc(iw/2)*2:trunc(ih/2)*2','-c:a','aac','-movflags','+faststart',path]);
    }
    added.push({artifact_id:id,run_id:runId,answer_id:videos[0]?.answer_id,artifact_type:'video_result',provider:'manual_upload',source:'uploaded',status:'generated',title:`${project.title} — v${++version}`,version_number:version,original_filename:file.name,upload_sha256:sha,created_at:new Date().toISOString(),media_url:`/data/comparisons/${runId}/media/${id}.mp4`,local_path:`media/${id}.mp4`,width:stream.width,height:stream.height,duration_seconds:Number(probe.format.duration)});
  }
  if(added.length) {
    atomic(artifactsFile,[...artifacts,...added].map(a=>JSON.stringify(a)).join('\n')+'\n');
    await run(['bun','scripts/build-video-posters.ts']);
    await run(['bun','scripts/build-comparisons-index.ts']);
    await sync();
  }
  return {added:added.length,versions:added.map(a=>a.version_number),warning:lastSyncError};
}
Bun.serve({hostname:'127.0.0.1',port,maxRequestBodySize:512*1024*1024,idleTimeout:255,async fetch(req) {
  const url=new URL(req.url);
  // Loopback only, plus browser-origin checks: no cross-site upload or credential exposure.
  const origin=req.headers.get('origin');
  if(origin && !/^http:\/\/(127\.0\.0\.1|localhost):(5190|5191|5192)$/.test(origin)) return Response.json({error:'Origin not allowed'},{status:403});
  if(req.method==='GET' && url.pathname==='/api/media/status') return Response.json({ready:true,lastSyncError});
  if(req.method!=='POST' || url.pathname!=='/api/media/versions') return new Response('Not found',{status:404});
  if(!origin) return Response.json({error:'Browser origin required'},{status:403});
  try {
    const form=await req.formData();const runId=String(form.get('run_id') || '');
    const files=form.getAll('files').filter((f):f is File=>f instanceof File);
    if(!files.length || files.length>8) throw new Error('Choose 1–8 videos');
    return Response.json(await serialized(()=>addVersions(runId,files)));
  } catch(error) {return Response.json({error:String(error).replace(/^Error: /,'')},{status:400});}
}});
console.log(`Directors Cut media service on 127.0.0.1:${port}`);
void serialized(sync);
let syncing=false;
setInterval(()=>{if(syncing)return;syncing=true;void serialized(sync).finally(()=>{syncing=false;});},30000);
