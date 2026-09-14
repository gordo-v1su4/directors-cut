<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import { loadComparisonsIndex, loadComparisonRun, loadLatestArtifacts } from '$lib/data/comparisons';
  import type { ComparisonArtifact, ComparisonRunDetail, ComparisonRunSummary } from '$lib/types/comparison';
  import MediaLightbox from '$lib/components/MediaLightbox.svelte';
  import ArtifactPreview from '$lib/components/ArtifactPreview.svelte';
  import VersionDropzone from '$lib/components/VersionDropzone.svelte';
  import { videoModel } from '$lib/data/version-context';
  import { isDesktop } from '$lib/viewport.svelte';

  const desktop = isDesktop();
  let projects = $state<ComparisonRunSummary[]>([]);
  let latestMedia = $state<ComparisonArtifact[]>([]);
  let selectedIndex = $state(0);
  let selectedDetail = $state<ComparisonRunDetail | null>(null);
  let lightboxArtifacts = $state<ComparisonArtifact[] | null>(null);
  let lightboxIndex = $state(0);
  let loading = $state(true);
  let heroMuted = $state(true);

  const selectedProject = $derived(projects[selectedIndex]);
  const selectedMedia = $derived(
    latestMedia.filter((item) => item.run_id === selectedProject?.run_id && (item.media_url || item.thumbnail_url)),
  );
  const projectVersions = $derived(selectedDetail?.artifacts.filter((item) => ['video_result', 'end_video'].includes(item.artifact_type) && !!item.media_url) ?? []);
  const heroArtifact = $derived(selectedMedia[0] ?? projectVersions[0]);
  const concept = $derived(selectedDetail?.answers.find((answer) => answer.answer_id === heroArtifact?.answer_id)?.structured_prompt ?? selectedDetail?.answers.find((answer) => answer.structure_status === 'valid')?.structured_prompt);
  const logline = $derived(selectedDetail?.logline || (concept && typeof concept === 'object' && 'logline' in concept ? String(concept.logline) : '') || 'Logline not added yet.');

  function mediaUrl(item: ComparisonArtifact | undefined) {
    return item?.thumbnail_url ?? item?.media_url ?? '';
  }

  function isVideo(item: ComparisonArtifact) {
    return item.artifact_type === 'video_result' || item.artifact_type === 'end_video';
  }

  async function selectProject(index: number) {
    selectedIndex = index;
    selectedDetail = null;
    const project = projects[index];
    if (project) {
      const detail = await loadComparisonRun(project.run_id);
      if (projects[selectedIndex]?.run_id === project.run_id) selectedDetail = detail;
    }
  }

  function move(direction: number) {
    if (!projects.length) return;
    selectedIndex = (selectedIndex + direction + projects.length) % projects.length;
    void selectProject(selectedIndex);
  }

  function openVersions() {
    if (projectVersions.length) {
      lightboxArtifacts = projectVersions;
      lightboxIndex = 0;
    }
  }

  async function refreshVersions() {
    const id = selectedProject?.run_id;
    latestMedia = await loadLatestArtifacts(8);
    if (id) {
      const detail = await loadComparisonRun(id);
      if (selectedProject?.run_id === id) selectedDetail = detail;
    }
  }

  onMount(() => {
    let disposed = false;
    let busy = false;
    let lastIndex = '';
    async function refresh() {
      if (busy) return;
      busy = true;
      try {
        const index = await loadComparisonsIndex();
        const signature = JSON.stringify(index);
        if (disposed || signature === lastIndex) return;
        const selectedId = projects[selectedIndex]?.run_id;
        const media = await loadLatestArtifacts(8);
        if (disposed) return;
        projects = index.runs.filter((run) => run.status !== 'promoted')
          .sort((a, b) => b.created.localeCompare(a.created));
        selectedIndex = Math.max(0, projects.findIndex((project) => project.run_id === selectedId));
        latestMedia = media;
        if (projects.length) {
          const id = projects[selectedIndex].run_id;
          const detail = await loadComparisonRun(id);
          if (!disposed && projects[selectedIndex]?.run_id === id) selectedDetail = detail;
        }
        lastIndex = signature;
      } finally { busy = false; if (!disposed) loading = false; }
    }
    void refresh();
    const interval = setInterval(() => { void refresh(); }, 10000);
    return () => { disposed = true; clearInterval(interval); };
  });
</script>

{#if lightboxArtifacts}
  <MediaLightbox artifacts={lightboxArtifacts} activeIndex={lightboxIndex} onClose={() => lightboxArtifacts = null} />
{/if}

<main class="dc-dashboard">
  <div class="dc-dashboard-inner">
    <header class="dc-dashboard-header">
      <div><p class="dc-eyebrow">Directors Cut / workspace</p><h1>Works in progress</h1></div>
      <p class="dc-dashboard-intro">Follow active concepts from first answer to final frame. Select a project to inspect its versions and see how it developed.</p>
    </header>

    {#if loading}
      <div class="dc-project-loading">Loading active projects…</div>
    {:else if !projects.length}
      <section class="dc-empty-work"><p class="dc-eyebrow">No active work</p><h2>Start a project to see it here.</h2><a href={resolve('/create')}>Create a prompt project</a></section>
    {:else}
      <section class="dc-workstage" aria-label="Active projects">
        <div class="dc-workstage-heading">
          <div><p class="dc-eyebrow">Active project {selectedIndex + 1} / {projects.length}</p><h2>{selectedProject?.title}</h2></div>
          <div class="dc-carousel-controls">
            <button type="button" aria-label="Previous project" onclick={() => move(-1)}>←</button>
            <button type="button" aria-label="Next project" onclick={() => move(1)}>→</button>
          </div>
        </div>

        <div class="dc-hero-layout">
          <div class="dc-key-art" class:has-art={!!heroArtifact}>
            {#if heroArtifact}
              {#if isVideo(heroArtifact)}
                <video src={heroArtifact.media_url} poster={heroArtifact.thumbnail_url} muted={heroMuted} autoplay loop playsinline aria-label={heroArtifact.title}></video>
                <button type="button" class="dc-hero-volume" aria-label={heroMuted ? 'Unmute key art video' : 'Mute key art video'} onclick={() => (heroMuted = !heroMuted)}>{heroMuted ? 'VOL 0' : 'VOL 1'}</button>
              {:else}<img src={mediaUrl(heroArtifact)} alt={heroArtifact.title} />{/if}
              <span class="dc-art-label">{videoModel(heroArtifact)}</span>
            {:else}
              <div class="dc-art-empty"><span>KEY ART</span><small>Awaiting generated media</small></div>
            {/if}
          </div>
          <div class="dc-project-panel">
            <p class="dc-project-question">{logline}</p>
            <div class="dc-version-strip">
              {#each projectVersions.slice(0, 4) as version, i (version.artifact_id)}
                <button type="button" class="dc-version-thumb" aria-label="Open version {i + 1}" onclick={() => { lightboxArtifacts = projectVersions; lightboxIndex = i; }}>
                  <ArtifactPreview artifact={version} /><span class="dc-version-label">{version.version_number ? `v${version.version_number}` : `v${i + 1}`}</span>
                </button>
              {:else}<span class="dc-no-versions">Versions will appear here as media lands.</span>{/each}
            </div>
            {#if selectedProject}{#key selectedProject.run_id}<VersionDropzone runId={selectedProject.run_id} title={selectedProject.title} onAdded={refreshVersions} />{/key}{/if}
            <div class="dc-project-actions">
              <a class="dc-primary-action" href={`${resolve('/comparisons')}?run=${selectedProject?.run_id}`}>Open project</a>
              <button class="dc-secondary-action" type="button" onclick={openVersions} disabled={!projectVersions.length}>View all versions</button>
            </div>
          </div>
        </div>
        <div class="dc-carousel-dots" aria-label="Choose project">
          {#each projects as project, i (project.run_id)}<button class:active={i === selectedIndex} type="button" aria-label="Show {project.title}" onclick={() => selectProject(i)}></button>{/each}
        </div>
      </section>
    {/if}

    <section class="dc-media-section">
      <div class="dc-section-heading"><h2 class="dc-section-title">Latest media feed</h2><span class="dc-section-note">Recent trailer versions</span></div>
      <div class="dc-media-feed">
        {#each latestMedia.slice(0, 6) as item (item.artifact_id)}
          <button type="button" class="dc-feed-card" onclick={async () => { const detail = await loadComparisonRun(item.run_id); lightboxArtifacts = detail.artifacts.filter(a => isVideo(a) && a.media_url).sort((a,b)=>a.created_at.localeCompare(b.created_at)); lightboxIndex = Math.max(0, lightboxArtifacts.findIndex(a => a.artifact_id === item.artifact_id)); }}>
            <div class="dc-feed-frame"><ArtifactPreview artifact={item} /></div>
            <div class="dc-feed-copy"><strong>{projects.find((project) => project.run_id === item.run_id)?.title ?? item.title}</strong><small>{projects.find((project) => project.run_id === item.run_id)?.logline || 'Logline not added yet.'}</small></div>
          </button>
        {:else}<p class="dc-no-versions">No generated media yet.</p>{/each}
      </div>
    </section>
  </div>
</main>

<style>
  .dc-workstage { border-top: 1px solid var(--dc-border); padding-top: 18px; }
  .dc-workstage-heading { display:flex; justify-content:space-between; align-items:end; gap:18px; margin-bottom:14px; }
  .dc-workstage-heading > div:first-child { flex:1; min-width:0; }
  .dc-workstage-heading h2 { margin:0; overflow-wrap:anywhere; font-size:clamp(21px, 3vw, 32px); letter-spacing:-.04em; line-height:1.05; white-space:normal; }
  .dc-carousel-controls { display:flex; flex:0 0 auto; gap:6px; }
  .dc-carousel-controls button { width:38px; height:38px; border:1px solid var(--dc-border); background:var(--dc-bg-elev); color:var(--dc-text); cursor:pointer; }
  .dc-hero-layout { display:grid; grid-template-columns:minmax(0, 1.6fr) minmax(280px, .8fr); align-items:start; border:1px solid var(--dc-border); background:var(--dc-bg-elev); }
  .dc-key-art { position:relative; width:100%; aspect-ratio:16/9; min-height:0; background:linear-gradient(135deg, #151518, #09090b); overflow:hidden; }
  .dc-key-art img, .dc-key-art video { width:100%; height:100%; object-fit:cover; display:block; }
  .dc-key-art:not(.has-art) { display:grid; place-items:center; }
  .dc-art-empty { display:flex; flex-direction:column; align-items:center; gap:8px; color:var(--dc-text-dim); letter-spacing:.18em; font-size:11px; font-family:var(--dc-font-sans); text-transform:uppercase; }
  .dc-art-empty small { letter-spacing:0; font-size:10px; text-transform:none; }
  .dc-art-label { position:absolute; left:12px; bottom:12px; padding:5px 8px; background:rgba(0,0,0,.72); color:var(--dc-text-muted); font-size:10px; text-transform:capitalize; }
  .dc-hero-volume { position:absolute; right:12px; bottom:12px; min-width:50px; min-height:30px; padding:0 8px; border:1px solid rgba(255,255,255,.24); background:rgba(0,0,0,.72); color:var(--dc-text); font:10px var(--dc-font-mono); cursor:pointer; }
  .dc-hero-volume:hover, .dc-hero-volume:focus-visible { border-color:var(--dc-text); outline:none; }
  .dc-project-panel { display:flex; align-self:stretch; min-height:0; flex-direction:column; padding:24px; border-left:1px solid var(--dc-border); }
  .dc-project-question { display:-webkit-box; margin:0 0 20px; overflow:hidden; color:var(--dc-text); font-size:17px; line-height:1.35; line-clamp:5; -webkit-box-orient:vertical; -webkit-line-clamp:5; }
  .dc-version-strip { display:flex; gap:7px; min-height:54px; overflow-x:auto; padding-bottom:4px; }
  .dc-version-thumb { position:relative; flex:0 0 72px; aspect-ratio:16/9; align-self:flex-start; padding:0; overflow:hidden; border:1px solid var(--dc-border); background:var(--dc-bg); cursor:pointer; }
  .dc-version-label { position:absolute;right:2px;bottom:2px;padding:1px 4px;background:#000b;color:white;font-size:9px; }
  .dc-no-versions { color:var(--dc-text-dim); font-size:11px; }
  .dc-project-actions { display:flex; flex-direction:row; gap:8px; margin-top:auto; padding-top:18px; }
  .dc-primary-action, .dc-secondary-action { min-height:34px; flex:1; display:inline-flex; justify-content:center; align-items:center; padding:0 10px; border:1px solid var(--dc-border); font-size:10px; text-decoration:none; cursor:pointer; }
  .dc-primary-action { background:var(--dc-text); color:var(--dc-bg); font-weight:700; }
  .dc-secondary-action { background:transparent; color:var(--dc-text-muted); }
  .dc-secondary-action:disabled { opacity:.45; cursor:not-allowed; }
  .dc-carousel-dots { display:flex; justify-content:center; gap:6px; padding:14px 0 0; }
  .dc-carousel-dots button { width:20px; height:3px; border:0; padding:0; background:var(--dc-border); cursor:pointer; }
  .dc-carousel-dots button.active { background:var(--dc-text); }
  .dc-media-section { margin-top:38px; }
  .dc-media-feed { display:grid; grid-template-columns:repeat(4, minmax(0, 1fr)); gap:10px; }
  .dc-feed-card { display:flex; flex-direction:column; justify-content:flex-start; align-items:stretch; min-width:0; padding:0; border:1px solid var(--dc-border); background:var(--dc-bg-elev); color:inherit; text-align:left; cursor:pointer; }
  .dc-feed-frame { width:100%; flex:none; aspect-ratio:16/9; background:var(--dc-bg); overflow:hidden; display:grid; place-items:center; color:var(--dc-text-dim); font-size:10px; }
  .dc-feed-copy { display:flex; flex-direction:column; gap:4px; padding:9px; }
  .dc-feed-copy strong { overflow-wrap:anywhere; white-space:normal; font-size:11px; font-weight:600; }
  .dc-feed-copy small { color:var(--dc-text-dim); font-size:11px; line-height:1.4; text-transform:none; }
  .dc-project-loading, .dc-empty-work { padding:72px 24px; border:1px solid var(--dc-border); color:var(--dc-text-muted); }
  .dc-empty-work h2 { margin:8px 0 18px; color:var(--dc-text); }
  .dc-empty-work a { color:var(--dc-text); font-size:12px; }
  @media (max-width:860px) {
    .dc-hero-layout { grid-template-columns:1fr; height:auto; }
    .dc-key-art { min-height:0; aspect-ratio:16/9; }
    .dc-key-art img, .dc-key-art video { min-height:0; aspect-ratio:16/9; }
    .dc-project-panel { min-height:340px; border-left:0; border-top:1px solid var(--dc-border); padding:18px; }
    .dc-project-question { margin-top:20px; font-size:16px; }
    .dc-media-feed { display:flex; overflow-x:auto; scroll-snap-type:x mandatory; padding-bottom:6px; }
    .dc-feed-card { flex:0 0 72vw; scroll-snap-align:start; }
  }
  @media (max-width:520px) {
    .dc-workstage-heading { align-items:start; }

    .dc-carousel-controls button { width:40px; height:40px; }
    .dc-project-actions { padding-top:18px; }
  }
</style>
