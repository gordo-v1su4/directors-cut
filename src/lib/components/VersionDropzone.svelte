<script lang="ts">
  let { runId, title, onAdded }: {runId:string; title:string; onAdded:()=>void|Promise<void>} = $props();
  let picker: HTMLInputElement;
  let dragging = $state(false);
  let uploading = $state(false);
  let message = $state('');
  let failed = $state(false);
  async function upload(files:File[]) {
    dragging=false;
    if(uploading || !files.length) return;
    if(files.some(f=>! /\.(mp4|mov|webm)$/i.test(f.name)) || files.reduce((n,f)=>n+f.size,0)>500*1024*1024) {
      failed=true;message='Choose MP4, MOV or WebM videos, up to 500 MB per batch.';return;
    }
    const projectId=runId;
    uploading=true;failed=false;message=`Saving ${files.length === 1 ? 'version' : 'versions'} to ${title}…`;
    try {
      const body=new FormData();body.set('run_id',projectId);files.forEach(file=>body.append('files',file));
      const response=await fetch('/api/media/versions',{method:'POST',body});
      if(!response.headers.get('content-type')?.includes('application/json')) throw new Error('Start bun run dev to enable version uploads.');
      const result=await response.json();
      if(!response.ok) throw new Error(result.error || 'Upload failed');
      message=result.added ? `Added ${result.versions.map((v:number)=>`v${v}`).join(', ')}.${result.warning ? ` ${result.warning}` : ''}` : 'These files are already in this project.';
      await onAdded();
    } catch(error) { failed=true;message=error instanceof Error ? error.message : 'Upload failed. Try again.'; }
    finally {uploading=false;if(picker)picker.value='';}
  }
</script>

<div class="version-upload">
  <input bind:this={picker} type="file" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" multiple hidden aria-label="Choose trailer versions" onchange={(event)=>void upload(Array.from(event.currentTarget.files || []))} />
  <button type="button" class:dragging disabled={uploading}
    ondragover={(event)=>{event.preventDefault();dragging=true;}}
    ondragleave={()=>dragging=false}
    ondrop={(event)=>{event.preventDefault();void upload(Array.from(event.dataTransfer?.files || []));}}
    onclick={()=>picker.click()}>
    <strong>{uploading ? 'Saving versions…' : 'Drop new versions here'}</strong>
    <span>{uploading ? 'Creating thumbnails and saving video' : 'or choose files · v2, v3…'}</span>
  </button>
  {#if message}<p class:error={failed} role="status">{message}</p>{/if}
</div>

<style>
  .version-upload { margin-top:14px; }
  button { display:flex; flex-direction:column; align-items:center; gap:4px; width:100%; padding:16px 12px; border:1px dashed var(--dc-border); background:transparent; color:var(--dc-text-muted); cursor:pointer; }
  button:hover, button.dragging, button:focus-visible { border-color:var(--dc-text); background:var(--dc-bg); outline:none; }
  button:disabled { opacity:.6;cursor:wait; }
  strong { font-size:12px; font-weight:500; }
  span, p { font-size:11px;line-height:1.4; }
  p { margin:8px 0 0;color:var(--dc-text-muted); }
  p.error { color:#f59b9b; }
</style>
