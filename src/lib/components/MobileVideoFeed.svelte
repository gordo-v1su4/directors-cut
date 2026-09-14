<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import type { ComparisonArtifact, ComparisonRunSummary } from '$lib/types/comparison';
  import { videoModel } from '$lib/data/version-context';

  let { items, projects, suspended = false, onVersions }: {
    items: ComparisonArtifact[]; projects: ComparisonRunSummary[]; suspended?: boolean;
    onVersions: (item: ComparisonArtifact) => void | Promise<void>;
  } = $props();
  const videos = new Map<string, HTMLVideoElement>();
  let playingId = $state('');
  let audibleId = $state('');
  let manualPause = '';
  let activeId = '';
  let frame = 0;
  let reducedMotion: MediaQueryList | undefined;

  function pauseOthers(id = '') {
    for (const [key, video] of videos) if (key !== id) video.pause();
  }
  function chooseVisible() {
    frame = 0;
    if (suspended || document.hidden) { pauseOthers(); return; }
    const candidates = [...videos].map(([id, video]) => {
      const box = video.getBoundingClientRect();
      const visible = Math.max(0, Math.min(box.bottom, innerHeight - 80) - Math.max(box.top, 60));
      return { id, video, ratio: visible / Math.max(box.height, 1), distance: Math.abs((box.top + box.bottom) / 2 - innerHeight * .35) };
    }).filter(item => item.ratio >= .65).sort((a,b) => b.ratio - a.ratio || a.distance - b.distance);
    const candidate = candidates[0];
    if (!candidate) { pauseOthers(); activeId = ''; audibleId = ''; return; }
    if (activeId !== candidate.id) { activeId = candidate.id; audibleId = ''; }
    pauseOthers(candidate.id);
    const saveData = (navigator as Navigator & {connection?: {saveData?: boolean}}).connection?.saveData;
    if (!reducedMotion?.matches && !saveData && manualPause !== candidate.id && candidate.video.paused) {
      void candidate.video.play().catch(() => { /* The visible Play button remains available when autoplay is blocked. */ });
    }
  }
  function visibilityChanged() { cancelAnimationFrame(frame); chooseVisible(); }
  function preferenceChanged() { pauseOthers(); schedule(); }
  function schedule() { if (!frame) frame = requestAnimationFrame(chooseVisible); }
  function observeVideo(node: HTMLVideoElement, options: {id: string; suspended: boolean}) {
    const id = options.id;
    videos.set(id, node);
    const observer = new IntersectionObserver(schedule, {threshold: [0, .25, .5, .65, .8, 1]});
    observer.observe(node);
    schedule();
    return {
      update() { schedule(); },
      destroy() { observer.disconnect(); node.pause(); videos.delete(id); },
    };
  }
  function togglePlay(id: string) {
    const video = videos.get(id);
    if (!video) return;
    if (!video.paused) { manualPause = id; video.pause(); }
    else { manualPause = ''; activeId = id; pauseOthers(id); void video.play().catch(() => undefined); }
  }
  function toggleSound(id: string) {
    const video = videos.get(id);
    if (!video) return;
    audibleId = audibleId === id ? '' : id;
    video.muted = audibleId !== id;
    if (audibleId === id) { manualPause = ''; activeId = id; pauseOthers(id); void video.play().catch(() => undefined); }
  }
  onMount(() => {
    reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    addEventListener('scroll', schedule, {passive: true});
    addEventListener('resize', schedule);
    document.addEventListener('visibilitychange', visibilityChanged);
    reducedMotion.addEventListener('change', preferenceChanged);
    schedule();
    return () => {
      removeEventListener('scroll', schedule); removeEventListener('resize', schedule);
      document.removeEventListener('visibilitychange', visibilityChanged);
      reducedMotion?.removeEventListener('change', preferenceChanged);
      cancelAnimationFrame(frame); pauseOthers();
    };
  });
</script>

<section class="mobile-feed" aria-label="Trailer feed">
  {#each items as item (item.artifact_id)}
    {@const project = projects.find(project => project.run_id === item.run_id)}
    <article class="feed-item" aria-label={project?.title ?? item.title}>
      <div class="frame">
        <video use:observeVideo={{id:item.artifact_id, suspended}} src={item.media_url} poster={item.thumbnail_url}
          muted={audibleId !== item.artifact_id} loop playsinline preload="none" aria-label={item.title}
          onplay={()=>playingId=item.artifact_id} onpause={()=>{if(playingId===item.artifact_id)playingId='';}}>
          <track kind="captions" />
        </video>
        <div class="playback-controls">
          <button type="button" onclick={()=>togglePlay(item.artifact_id)} aria-label={playingId===item.artifact_id ? 'Pause video' : 'Play video'}>{playingId===item.artifact_id ? 'Pause' : 'Play'}</button>
          <button type="button" onclick={()=>toggleSound(item.artifact_id)} aria-label={audibleId===item.artifact_id ? 'Mute video' : 'Unmute video'}>{audibleId===item.artifact_id ? 'Sound on' : 'Sound off'}</button>
        </div>
      </div>
      <div class="copy">
        <div class="metadata"><span>{videoModel(item)}</span>{#if item.version_number}<span>v{item.version_number}</span>{/if}</div>
        <h2>{project?.title ?? item.title}</h2>
        {#if project?.logline}<p>{project.logline}</p>{/if}
        <div class="actions">
          <a href={`${resolve('/comparisons')}?run=${item.run_id}`}>Open project</a>
          <button type="button" onclick={()=>onVersions(item)}>View versions</button>
        </div>
      </div>
    </article>
  {:else}<p class="empty">Your videos will appear here when ready.</p>{/each}
</section>

<style>
  .mobile-feed {display:flex;flex-direction:column;gap:24px;padding-bottom:16px;}
  .feed-item {min-width:0;border:1px solid var(--dc-border);border-radius:12px;overflow:hidden;background:var(--dc-bg-elev);}
  .frame {position:relative;aspect-ratio:16/9;background:var(--dc-bg);}
  video {display:block;width:100%;height:100%;object-fit:contain;}
  .playback-controls {position:absolute;inset:auto 8px 8px;display:flex;justify-content:space-between;gap:12px;}
  button,a {min-height:44px;padding:0 14px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--dc-border);border-radius:8px;background:var(--dc-bg);color:var(--dc-text);font:500 13px var(--dc-font-sans);text-decoration:none;cursor:pointer;}
  .playback-controls button {background:rgba(0,0,0,.75);border-color:rgba(255,255,255,.3);color:white;}
  button:focus-visible,a:focus-visible {outline:2px solid var(--dc-text);outline-offset:2px;}
  .copy {padding:16px;}
  .metadata {display:flex;gap:10px;color:var(--dc-text-muted);font-size:11px;margin-bottom:8px;}
  h2 {font-size:19px;line-height:1.25;letter-spacing:-.025em;margin:0;overflow-wrap:anywhere;}
  p {font-size:13px;line-height:1.6;color:var(--dc-text-muted);margin:10px 0 0;}
  .actions {display:flex;gap:10px;margin-top:16px;}
  .actions > * {flex:1;}
  .empty {padding:32px 16px;}
</style>
