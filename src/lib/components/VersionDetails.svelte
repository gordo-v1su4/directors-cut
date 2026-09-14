<script lang="ts">
  import type { ComparisonArtifact, GenerationPrompt } from '$lib/types/comparison';
  import { mediaApi, ownerToken } from '$lib/data/media-api';
  import { versionPrompt, videoModel } from '$lib/data/version-context';
  import CopyButton from './CopyButton.svelte';
  let { artifact, editable = true, grids = [], promptsMap = new Map(), onSaved }: {
    artifact: ComparisonArtifact; editable?: boolean; grids?: ComparisonArtifact[];
    promptsMap?: Map<string, GenerationPrompt>; onSaved?: () => void | Promise<void>;
  } = $props();
  let editing = $state(false);
  let prompt = $state('');
  let model = $state('');
  let gridChoice = $state('keep');
  let file = $state<File | null>(null);
  let busy = $state(false);
  let message = $state('');
  let password = $state('');
  let login = $state(false);
  let picker = $state<HTMLInputElement>();
  const savedPrompt = $derived(versionPrompt(artifact, promptsMap));
  function edit() {
    prompt = savedPrompt;
    model = videoModel(artifact) === 'Model not set' ? '' : videoModel(artifact);
    gridChoice = 'keep'; file = null; message = ''; editing = true;
    login = !ownerToken();
  }
  function choose(files: File[]) {
    const chosen = files[0];
    if (!chosen) return;
    if (files.length !== 1 || !/\.(png|jpe?g|webp)$/i.test(chosen.name) || chosen.size > 10_000_000) {
      message = 'Choose one PNG, JPEG or WebP image, up to 10 MB.'; return;
    }
    file = chosen; gridChoice = 'upload'; message = '';
  }
  async function save(event: SubmitEvent) {
    event.preventDefault(); busy = true; message = '';
    try {
      if (login) {
        const response = await fetch(`${mediaApi}/login`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'gordo',password})});
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Sign in failed');
        sessionStorage.setItem('directors-cut-owner',result.token); password=''; login=false;
      }
      const payload: Record<string, unknown> = {run_id:artifact.run_id, prompt, video_model:model, revision:artifact.context_revision ?? 0};
      if (gridChoice === 'remove') payload.grid = null;
      else if (gridChoice === 'upload' && file) {
        const data = await new Promise<string>((resolve,reject)=>{
          const reader = new FileReader(); reader.onload=()=>resolve(String(reader.result).split(',')[1]); reader.onerror=()=>reject(new Error('Could not read image')); reader.readAsDataURL(file!);
        });
        payload.grid = {data};
      } else if (gridChoice !== 'keep') payload.grid = {artifact_id:gridChoice};
      const response = await fetch(`${mediaApi}/versions/${encodeURIComponent(artifact.artifact_id)}/details`, {method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${ownerToken()}`},body:JSON.stringify(payload)});
      const result = await response.json();
      if (response.status === 401) { sessionStorage.removeItem('directors-cut-owner'); login=true; }
      if (!response.ok) throw new Error(result.error || 'Save failed');
      await onSaved?.(); editing=false; message='Version details saved.';
    } catch(error) { message=error instanceof Error ? error.message : 'Save failed'; }
    finally { busy=false; }
  }
</script>

<section class="version-details" aria-label="Version details">
  <div class="heading"><span class="model">{videoModel(artifact)}</span>{#if mediaApi && editable}<button class="edit" onclick={edit}>Edit version details</button>{/if}</div>
  {#if editing}
    <form onsubmit={save}>
      <label>Video model<input bind:value={model} list="video-models" placeholder="e.g. Sora 2" maxlength="100" disabled={busy} /></label>
      <datalist id="video-models"><option>Sora 2</option><option>Sora 2 Pro</option><option>Seedance 2.0</option><option>Veo 3.1</option><option>Kling</option><option>Other / edited</option></datalist>
      <label>Prompt for this version<textarea bind:value={prompt} rows="9" maxlength="100000" placeholder="Paste the exact prompt used for this video…" disabled={busy}></textarea></label>
      <label>Shot grid<select bind:value={gridChoice} disabled={busy}>
        <option value="keep">{artifact.shot_grid_url ? 'Keep attached grid' : 'No grid attached'}</option>
        {#each grids as grid (grid.artifact_id)}<option value={grid.artifact_id}>{grid.title}</option>{/each}
        {#if file}<option value="upload">{file.name}</option>{/if}
        {#if artifact.shot_grid_url}<option value="remove">Remove attachment</option>{/if}
      </select></label>
      <input bind:this={picker} hidden type="file" accept="image/png,image/jpeg,image/webp" aria-label="Choose shot grid" onchange={(e)=>choose(Array.from(e.currentTarget.files || []))} />
      <button type="button" class="drop" disabled={busy} onclick={()=>picker?.click()} ondragover={(e)=>e.preventDefault()} ondrop={(e)=>{e.preventDefault();if(!busy)choose(Array.from(e.dataTransfer?.files || []));}}>{file ? file.name : 'Drop shot grid here or choose image'}<small>PNG, JPEG or WebP · up to 10 MB</small></button>
      {#if login}<label>Owner password<input type="password" bind:value={password} autocomplete="current-password" required disabled={busy} /></label>{/if}
      <div class="actions"><button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save version details'}</button><button type="button" disabled={busy} onclick={()=>{editing=false;message='';}}>Cancel</button></div>
    </form>
  {:else}
    <div class="context-grid">
      <div><div class="heading"><h3>Prompt</h3>{#if savedPrompt}<CopyButton text={savedPrompt} label="Copy" />{/if}</div>
        {#if savedPrompt}<p class="prompt">{savedPrompt}</p>{:else}<p class="empty">No prompt saved for this version.</p>{/if}
      </div>
      <div><h3>Shot grid</h3>{#if artifact.shot_grid_url}<a href={artifact.shot_grid_url} target="_blank" rel="noreferrer" aria-label="Open shot grid"><img src={artifact.shot_grid_url} alt="Shot grid for this video version" /></a>{:else}<div class="empty-grid">No shot grid attached to this version.</div>{/if}</div>
    </div>
  {/if}
  {#if message}<p role="status">{message}</p>{/if}
</section>

<style>
  .version-details {min-width:0; color:var(--dc-text);}
  .heading,.actions {display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:12px;}
  .model {font-size:11px;padding:4px 8px;border:1px solid var(--dc-border);border-radius:var(--dc-radius);}
  h3 {margin:0 0 12px;font-size:11px;font-weight:500;color:var(--dc-text-muted);text-transform:uppercase;letter-spacing:.06em;}
  .heading h3 {margin:0;}
  .context-grid {display:grid;grid-template-columns:1fr 1fr;gap:24px;}
  .context-grid > div {min-width:0;}
  .prompt {white-space:pre-wrap;overflow-wrap:anywhere;font-size:13px;line-height:1.7;margin:0;max-height:330px;overflow:auto;}
  img {width:100%;aspect-ratio:16/9;object-fit:contain;object-position:top;background:var(--dc-bg);display:block;}
  .empty,.empty-grid {font-size:12px;line-height:1.6;color:var(--dc-text-muted);}
  .empty-grid {aspect-ratio:16/9;border:1px dashed var(--dc-border);display:grid;place-items:center;text-align:center;padding:12px;box-sizing:border-box;}
  form {display:flex;flex-direction:column;gap:14px;}
  label {font-size:12px;display:flex;flex-direction:column;gap:6px;}
  input,textarea,select {box-sizing:border-box;width:100%;padding:10px;background:var(--dc-bg);color:var(--dc-text);border:1px solid var(--dc-border);border-radius:var(--dc-radius);font:inherit;}
  textarea {resize:vertical;line-height:1.6;}
  button {padding:8px 12px;background:var(--dc-bg);color:var(--dc-text);border:1px solid var(--dc-border);border-radius:var(--dc-radius);cursor:pointer;font-size:12px;}
  button:disabled {opacity:.5;cursor:wait;}
  .drop {padding:22px;border-style:dashed;}
  small {display:block;margin-top:6px;color:var(--dc-text-muted);}
  .actions {justify-content:flex-start;margin:0;}
  @media(max-width:700px){.context-grid {grid-template-columns:1fr;}}
</style>
