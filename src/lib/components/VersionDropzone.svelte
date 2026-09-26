<script lang="ts">
  import { mediaApi, ownerToken } from '$lib/data/media-api';
  let { runId, title, onAdded }: {runId:string; title:string; onAdded:()=>void|Promise<void>} = $props();
  let picker: HTMLInputElement;
  let dragging = $state(false);
  let uploading = $state(false);
  let message = $state('');
  let failed = $state(false);
  let showLogin = $state(false);
  let password = $state('');
  let retryId = $state('');
  async function signIn(event: SubmitEvent) {
    event.preventDefault();
    try {
      const response = await fetch(`${mediaApi}/login`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'gordo',password})});
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Sign in failed');
      sessionStorage.setItem('directors-cut-owner',result.token);
      password='';showLogin=false;failed=false;message='Signed in. Choose or drop your videos.';
    } catch(error) { failed=true;message=error instanceof Error ? error.message : 'Sign in failed'; }
  }
  async function waitForUpload(id:string) {
    for(let i=0;i<180;i++) {
      const response=await fetch(`${mediaApi}/uploads/${id}`,{headers:{Authorization:`Bearer ${ownerToken()}`}});
      const result=await response.json();
      if(!response.ok) throw new Error(result.error || 'Unable to check processing');
      if(result.status==='ready') return;
      if(result.status==='failed') { retryId=id;throw new Error(result.error || 'Processing failed'); }
      await new Promise(resolve=>setTimeout(resolve,2000));
    }
    throw new Error('Processing is still running. The video will appear automatically when ready.');
  }
  async function retryProcessing() {
    uploading=true;failed=false;
    try {
      const response=await fetch(`${mediaApi}/uploads/${retryId}/retry`,{method:'POST',headers:{Authorization:`Bearer ${ownerToken()}`}});
      const result=await response.json();
      if(!response.ok) throw new Error(result.error);
      message='Processing video…';await waitForUpload(retryId);retryId='';message='Version ready.';await onAdded();
    } catch(error) { failed=true;message=error instanceof Error ? error.message : 'Retry failed'; }
    finally {uploading=false;}
  }
  /** Lets a drop target elsewhere on the page hand files straight in. */
  export function add(files: File[]) { void upload(files); }
  async function upload(files:File[]) {
    dragging=false;
    if(mediaApi && !ownerToken()) {showLogin=true;message='Sign in before adding videos.';return;}
    if(uploading || !files.length) return;
    if(files.some(f=>! /\.(mp4|mov|webm)$/i.test(f.name) || (mediaApi && f.size>95*1000*1000)) || files.reduce((n,f)=>n+f.size,0)>500*1024*1024) {
      failed=true;message=mediaApi ? 'Choose MP4, MOV or WebM, up to 95 MB per file and 500 MB per batch.' : 'Choose MP4, MOV or WebM videos, up to 500 MB per batch.';return;
    }
    const projectId=runId;
    uploading=true;failed=false;message=`Saving ${files.length === 1 ? 'version' : 'versions'} to ${title}…`;
    try {
      if(mediaApi) {
        const versions:number[]=[];
        for(const file of files) {
          message=`Uploading ${file.name}…`;
          const response=await fetch(`${mediaApi}/versions`,{method:'POST',headers:{Authorization:`Bearer ${ownerToken()}`,'Content-Type':'application/octet-stream','X-Run-Id':projectId,'X-Filename':encodeURIComponent(file.name)},body:file});
          const result=await response.json();
          if(response.status===401) {sessionStorage.removeItem('directors-cut-owner');showLogin=true;}
          if(!response.ok) throw new Error(result.error || 'Upload failed');
          if(result.status==='failed') {retryId=result.upload_id;throw new Error(result.error || 'Previous upload failed');}
          if(result.upload_id && result.status!=='ready') {message=`Creating thumbnail for ${file.name}…`;await waitForUpload(result.upload_id);}
          versions.push(...result.versions);
        }
        message=versions.length ? `Added ${versions.map(v=>`v${v}`).join(', ')}.` : 'These files are already in this project.';
        await onAdded();return;
      }
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
  <input bind:this={picker} type="file" accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" multiple hidden aria-label="Choose takes to import" onchange={(event)=>void upload(Array.from(event.currentTarget.files || []))} />
  <button type="button" class="drop" class:dragging disabled={uploading}
    ondragover={(event)=>{event.preventDefault();dragging=true;}}
    ondragleave={()=>dragging=false}
    ondrop={(event)=>{event.preventDefault();void upload(Array.from(event.dataTransfer?.files || []));}}
    onclick={()=>{if(mediaApi && !ownerToken())showLogin=true;else picker.click();}}>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" /></svg>
    <strong>{uploading ? "Saving takes…" : "Drop cuts here"}</strong>
    <span>{uploading ? "Creating thumbnails and saving video" : "or choose files. MP4, MOV or WebM, each becomes the next take."}</span>
  </button>
  {#if showLogin}
    <form onsubmit={signIn}>
      <input class="sinput" type="password" autocomplete="current-password" bind:value={password} placeholder="Owner password" aria-label="Owner password" required />
      <button type="submit" class="sbtn sbtn-primary">Sign in</button>
    </form>
  {/if}
  {#if retryId && failed}<button type="button" class="sbtn retry" onclick={retryProcessing} disabled={uploading}>Retry processing</button>{/if}
  {#if message}<p class:error={failed} role="status">{message}</p>{/if}
</div>

<style>
  .drop { display:flex; flex-direction:column; align-items:center; gap:6px; width:100%; padding:32px 16px; border:0; border-radius:8px; background:#0e0e0e; color:var(--dc-text-muted); font:inherit; text-align:center; cursor:pointer; transition:background .15s ease; }
  .drop:hover, .drop.dragging { background:#1a1a1a; color:var(--dc-text); }
  .drop:focus-visible { outline:none; box-shadow:0 0 0 3px rgba(231,229,228,.18); }
  .drop:disabled { opacity:.6; cursor:wait; }
  .drop svg { width:20px; height:20px; fill:none; stroke:var(--dc-text); stroke-width:1.8; stroke-linecap:round; stroke-linejoin:round; }
  strong { color:var(--dc-text); font-size:14px; font-weight:600; }
  span, p { font-size:12px; line-height:1.45; }
  form { display:flex; gap:8px; margin-top:12px; }
  .retry { margin-top:10px; }
  p { margin:10px 0 0; color:var(--dc-text-muted); }
  p.error { color:#f0a8a0; }
</style>
