<script lang="ts">
  import { onMount } from 'svelte';
  import { beforeNavigate } from '$app/navigation';
  import { resolve } from '$app/paths';
  import Icon from './Icon.svelte';
  import { ownerToken } from '$lib/data/media-api';
  import { signInOwner, SignInRequired } from '$lib/data/titles';
  import { createUploadProject, saveUploadVideo, validateVideos, type UploadVideo } from '$lib/create/upload';
  import { studio } from '$lib/ui/studio.svelte';

  let title = $state('');
  let logline = $state('');
  let format = $state('');
  let tagText = $state('');
  let videos = $state<UploadVideo[]>([]);
  let picker: HTMLInputElement;
  let dragging = $state(false);
  let busy = $state(false);
  let error = $state('');
  let signedIn = $state(false);
  let password = $state('');
  let requestId = '';
  let runId = $state('');
  let creationInput = $state<Parameters<typeof createUploadProject>[0]>();
  const tags = $derived([...new Set(tagText.split(',').map(tag => tag.trim()).filter(Boolean))]);
  const complete = $derived(!!runId && videos.length > 0 && videos.every(video => video.done));
  const totalSize = $derived(videos.reduce((sum, video) => sum + video.file.size, 0));
  const finished = $derived(videos.filter(video => video.done).length);

  onMount(() => { signedIn = !!ownerToken(); });
  beforeNavigate(({ cancel }) => { if (busy) cancel(); });

  function choose(files: File[]) {
    dragging = false;
    if (busy || runId) return;
    const unique = files.filter(file => !videos.some(video => video.file.name === file.name && video.file.size === file.size && video.file.lastModified === file.lastModified));
    error = validateVideos([...videos.map(video => video.file), ...unique]);
    if (error) return;
    videos = [...videos, ...unique.map(file => ({ key: crypto.randomUUID(), file, model: '', prompt: '', status: 'Ready to upload' }))];
    if (!title && videos[0]) title = videos[0].file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' ').slice(0, 120);
  }

  async function submit(event: SubmitEvent) {
    event.preventDefault();
    if (busy || complete || !videos.length || !title.trim()) return;
    error = validateVideos(videos.map(video => video.file));
    if (!error && (tags.length > 20 || tags.some(tag => tag.length > 40))) error = 'Use up to 20 tags, each no longer than 40 characters.';
    if (error) return;
    busy = true;
    try {
      if (!ownerToken()) {
        if (!password) { signedIn = false; throw new SignInRequired('Enter your project access password to create the project.'); }
        await signInOwner(password);
        password = '';
        signedIn = true;
      }
      requestId ||= crypto.randomUUID().replaceAll('-', '');
      creationInput ??= { request_id: requestId, title: title.trim(), logline, format, tags };
      if (!runId) runId = await createUploadProject(creationInput);
      for (const video of videos) {
        try { await saveUploadVideo(runId, video); }
        catch (caught) { video.status = 'Needs attention'; throw caught; }
      }
      await studio.refresh(true);
    } catch (caught) {
      if (caught instanceof SignInRequired) signedIn = false;
      error = caught instanceof Error ? caught.message : 'Could not save your project. Please retry.';
    } finally { busy = false; }
  }
</script>

<form class="upload-desk" onsubmit={submit}>
  <section class="videos glass-panel" aria-label="Your videos">
    <div class="section-heading">
      <div><h2 class="t-section">Bring your own videos</h2><p class="muted">Each video becomes a take in your new project.</p></div>
      {#if videos.length}<span class="stag">{videos.length} {videos.length === 1 ? 'video' : 'videos'}</span>{/if}
    </div>
    <input bind:this={picker} type="file" multiple accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm" hidden aria-label="Choose videos for new project" onchange={(event) => { choose(Array.from(event.currentTarget.files ?? [])); event.currentTarget.value = ''; }} />
    {#if !runId}
      <button type="button" class="drop" class:dragging disabled={busy}
        ondragover={(event) => { event.preventDefault(); if (!busy) dragging = true; }}
        ondragleave={() => dragging = false}
        ondrop={(event) => { event.preventDefault(); choose(Array.from(event.dataTransfer?.files ?? [])); }}
        onclick={() => picker.click()}>
        <Icon name="upload" size={24} />
        <strong>{videos.length ? 'Add more videos' : 'Drop your videos here'}</strong>
        <span>or choose files</span>
        <small>MP4, MOV or WebM · Up to 95 MB each, 500 MB total</small>
      </button>
    {/if}
    {#each videos as video, index (video.key)}
      <article class="video-row">
        <div class="video-heading">
          <span class="stag">v{index + 1}</span>
          <div class="filename"><strong>{video.file.name}</strong><span class="muted">{(video.file.size / 1_000_000).toFixed(1)} MB · {video.status}</span></div>
          {#if !runId}<button type="button" class="sbtn" disabled={busy} aria-label={`Remove ${video.file.name}`} onclick={() => videos = videos.filter(item => item.key !== video.key)}><Icon name="x" /></button>{/if}
          {#if video.done}<Icon name="check" />{/if}
        </div>
        <details>
          <summary>Video details <span class="dim">Optional</span></summary>
          <div class="video-details">
            <label>Video model or source<input class="sinput" bind:value={video.model} maxlength="100" placeholder="Seedance 2.5, Seedance 2.0, camera footage…" disabled={busy || video.done} /></label>
            <label>Prompt used<textarea class="stextarea" bind:value={video.prompt} maxlength="100000" rows="4" placeholder="Paste the prompt, if there was one" disabled={busy || video.done}></textarea></label>
          </div>
        </details>
      </article>
    {/each}
    {#if !videos.length}<p class="hint">Already edited, generated elsewhere, or straight from your camera. No prompt needed.</p>{/if}
  </section>

  <aside class="project glass-panel" aria-label="New project details">
    <h2 class="t-section">Project details</h2>
    <fieldset disabled={busy || !!creationInput}>
      <label>Project name<input class="sinput" bind:value={title} required maxlength="120" placeholder="Name your project" /></label>
      <label>Description <span class="dim">Optional</span><textarea class="stextarea" bind:value={logline} maxlength="600" rows="3" placeholder="What is this project about?"></textarea></label>
      <label>Format <span class="dim">Optional</span>
        <select class="sinput" bind:value={format}>
          <option value="">Choose a format</option><option value="trailer">Trailer or teaser</option><option value="music video">Music video</option><option value="commercial">Commercial</option><option value="short film scene">Short film scene</option><option value="visual concept">Visual concept</option><option value="other">Other</option>
        </select>
      </label>
      <label>Tags <span class="dim">Optional</span><input class="sinput" bind:value={tagText} placeholder="Thriller, neon, first cut" /><span class="hint">Separate tags with commas.</span></label>
      {#if tags.length}<div class="tags">{#each tags as tag (tag)}<span class="stag">{tag}</span>{/each}</div>{/if}
    </fieldset>
    {#if !signedIn && !complete}
      <label>Project access password<input class="sinput" type="password" autocomplete="current-password" bind:value={password} disabled={busy} placeholder="Sign in to save your project" /><span class="hint">The same app password used to import cuts and edit project details.</span></label>
    {/if}
    <div class="save-area">
      {#if complete}
        <p class="success" role="status"><Icon name="check" /> Project created. {finished} {finished === 1 ? 'take is' : 'takes are'} ready.</p>
        <a class="sbtn sbtn-primary" href={resolve(`/comparisons?run=${encodeURIComponent(runId)}`)}>Open project <Icon name="up-right" /></a>
      {:else}
        <p class="hint" role="status">{busy ? `${finished} of ${videos.length} videos ready. Keep this page open while we save your videos.` : videos.length ? `${videos.length} ${videos.length === 1 ? 'video' : 'videos'} · ${(totalSize / 1_000_000).toFixed(1)} MB` : 'Choose at least one video to create your project.'}</p>
        <button class="sbtn sbtn-primary create-button" type="submit" disabled={busy || !videos.length || !title.trim()}><Icon name="upload" />{busy ? 'Saving project…' : runId ? 'Continue upload' : 'Create project & upload'}</button>
      {/if}
      {#if error}<p class="error" role="alert">{error}</p>{/if}
      {#if runId && !complete && !busy}<a class="project-link" href={resolve(`/comparisons?run=${encodeURIComponent(runId)}`)}>Open saved project</a>{/if}
    </div>
  </aside>
</form>

<style>
  .upload-desk { display:grid; grid-template-columns:minmax(0,7fr) minmax(0,5fr); gap:24px; align-items:start; }
  .videos, .project { display:grid; gap:20px; padding:24px; min-width:0; }
  .project { position:sticky; top:calc(var(--dc-nav-offset) + 16px); }
  .section-heading, .video-heading { display:flex; align-items:center; justify-content:space-between; gap:12px; min-width:0; }
  .section-heading p { margin:6px 0 0; font-size:13px; }
  .drop { display:flex; flex-direction:column; align-items:center; gap:9px; width:100%; min-height:235px; padding:30px 16px; justify-content:center; border:1px dashed #484440; border-radius:8px; background:#0a0a0a; color:var(--dc-text-muted); font:inherit; cursor:pointer; }
  .drop:hover, .drop.dragging { background:#171717; border-color:var(--dc-text); }
  .drop strong { color:var(--dc-text); font-size:18px; font-weight:500; }
  .drop span { font-size:14px; }
  .drop small { margin-top:12px; color:var(--dc-text-dim); font-size:12px; }
  .drop:focus-visible, summary:focus-visible { outline:2px solid var(--dc-text); outline-offset:4px; }
  .video-row { border-top:1px solid var(--dc-border); padding-top:16px; min-width:0; }
  .filename { display:grid; gap:4px; min-width:0; flex:1; }
  .filename strong { overflow-wrap:anywhere; font-size:14px; font-weight:500; }
  .filename span, summary { font-size:12px; }
  details { margin-top:12px; }
  summary { cursor:pointer; color:var(--dc-text-muted); }
  summary span { margin-left:8px; }
  .video-details, fieldset { display:grid; gap:16px; }
  .video-details { margin-top:16px; }
  fieldset { border:0; padding:0; margin:0; min-width:0; }
  label { display:flex; flex-wrap:wrap; gap:6px; color:var(--dc-text-muted); font-size:13px; }
  label input, label textarea, label select { width:100%; }
  select { color-scheme:dark; }
  label > .dim { margin-left:auto; font-size:12px; }
  .tags { display:flex; flex-wrap:wrap; gap:6px; }
  .tags .stag { max-width:100%; white-space:normal; overflow-wrap:anywhere; }
  .save-area { display:grid; gap:12px; border-top:1px solid var(--dc-border); padding-top:20px; }
  .create-button { width:100%; min-height:38px; }
  .hint, .error, .success, .project-link { margin:0; font-size:12px; line-height:1.5; }
  .hint { color:var(--dc-text-dim); }
  .error { color:#f0a8a0; }
  .success { display:flex; gap:8px; align-items:center; color:#9fd4a8; }
  .project-link { color:var(--dc-text); text-decoration:underline; }
  @media(max-width:900px) { .upload-desk { grid-template-columns:minmax(0,1fr); } .project { position:static; } }
  @media(max-width:560px) { .videos, .project { padding:16px; } .drop { min-height:200px; } }
</style>
