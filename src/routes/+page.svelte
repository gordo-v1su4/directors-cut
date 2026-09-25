<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { resolve } from '$app/paths';
  import { loadComparisonsIndex, loadComparisonRun, loadLatestArtifacts } from '$lib/data/comparisons';
  import type {
    ComparisonArtifact,
    ComparisonRunDetail,
    ComparisonRunSummary,
    CreativeConceptPackage,
  } from '$lib/types/comparison';
  import MediaLightbox from '$lib/components/MediaLightbox.svelte';
  import ArtifactPreview from '$lib/components/ArtifactPreview.svelte';
  import { videoModel } from '$lib/data/version-context';
  import { showTitle } from '$lib/data/titles';

  let projects = $state<ComparisonRunSummary[]>([]);
  let latestMedia = $state<ComparisonArtifact[]>([]);
  let selectedIndex = $state(0);
  let selectedDetail = $state<ComparisonRunDetail | null>(null);
  let lightboxArtifacts = $state<ComparisonArtifact[] | null>(null);
  let lightboxIndex = $state(0);
  let loading = $state(true);
  let heroMuted = $state(true);
  let heroVideo = $state<HTMLVideoElement | null>(null);
  let latestRow = $state<HTMLDivElement | null>(null);

  const selectedProject = $derived(projects[selectedIndex]);
  const selectedMedia = $derived(
    latestMedia.filter((item) => item.run_id === selectedProject?.run_id && (item.media_url || item.thumbnail_url)),
  );
  const projectVersions = $derived(
    selectedDetail?.artifacts
      .filter((item) => isVideo(item) && !!item.media_url)
      .sort((a, b) => a.created_at.localeCompare(b.created_at)) ?? [],
  );
  const heroArtifact = $derived(selectedMedia[0] ?? projectVersions.at(-1));
  const heroTake = $derived(
    Math.max(1, projectVersions.findIndex((v) => v.artifact_id === heroArtifact?.artifact_id) + 1),
  );
  const concept = $derived(
    selectedDetail?.answers.find((answer) => answer.answer_id === heroArtifact?.answer_id)?.structured_prompt ??
      selectedDetail?.answers.find((answer) => answer.structure_status === 'valid')?.structured_prompt,
  );
  const logline = $derived(
    selectedDetail?.logline ||
      (concept && typeof concept === 'object' && 'logline' in concept ? String(concept.logline) : '') ||
      selectedProject?.logline ||
      'Logline not added yet.',
  );

  function isVideo(item: ComparisonArtifact) {
    return item.artifact_type === 'video_result' || item.artifact_type === 'end_video';
  }

  function modelOf(item: ComparisonArtifact | undefined) {
    return item ? videoModel(item) : 'Model not set';
  }

  function plural(count: number, noun: string) {
    return `${count} ${noun}${count === 1 ? '' : 's'}`;
  }

  function statusLabel(status: string | undefined) {
    const text = (status ?? 'active').replace(/_/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function shortDate(value: string | undefined) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value.slice(0, 10)
      : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  function thumbForRun(runId: string) {
    return latestMedia.find((m) => m.run_id === runId && (m.media_url || m.thumbnail_url));
  }

  async function openClip(item: ComparisonArtifact) {
    const detail = await loadComparisonRun(item.run_id);
    lightboxArtifacts = detail.artifacts
      .filter((a) => isVideo(a) && a.media_url)
      .sort((a, b) => a.created_at.localeCompare(b.created_at));
    lightboxIndex = Math.max(0, lightboxArtifacts.findIndex((a) => a.artifact_id === item.artifact_id));
  }

  function openTake(index: number) {
    lightboxArtifacts = projectVersions;
    lightboxIndex = index;
  }

  function scrollRow(row: HTMLElement | null, direction: number) {
    row?.scrollBy({ left: direction * row.clientWidth * 0.85, behavior: 'smooth' });
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
    void selectProject((selectedIndex + direction + projects.length) % projects.length);
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
        const media = await loadLatestArtifacts(100);
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

    // Stop the hero from playing (and draining battery) in a background tab.
    const onVisibility = () => {
      if (document.hidden) heroVideo?.pause();
      else if (heroVideo && !lightboxArtifacts) void heroVideo.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);

    void refresh();
    const interval = setInterval(() => { void refresh(); }, 10000);
    return () => {
      disposed = true;
      clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  });

  // Phones scroll the document itself; hold it still while the player is open.
  $effect(() => {
    if (!lightboxArtifacts) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  });

  // The lightbox plays its own video; keep the hero quiet underneath it.
  $effect(() => {
    if (!heroVideo) return;
    if (lightboxArtifacts) heroVideo.pause();
    else void heroVideo.play().catch(() => {});
  });
</script>

{#if lightboxArtifacts}
  <MediaLightbox artifacts={lightboxArtifacts} activeIndex={lightboxIndex} showDetails={false} onClose={() => (lightboxArtifacts = null)} />
{/if}

<div class="home" class:frozen={!!lightboxArtifacts}>
  {#if loading}
    <div class="home-wrap"><p class="home-state">Loading projects…</p></div>
  {:else if !projects.length}
    <div class="home-wrap">
      <section class="home-state">
        <h1>Nothing in the edit yet</h1>
        <p>Create a project and its renders will show up here.</p>
        <a class="btn btn-solid" href={resolve('/create')}>Create a project</a>
      </section>
    </div>
  {:else}
    <!-- ── Now playing: the video runs edge to edge ──────────────── -->
    <section class="hero" aria-label="Now playing">
      <div class="screen">
        {#if heroArtifact}
          {#key heroArtifact.artifact_id}
            {#if isVideo(heroArtifact) && heroArtifact.media_url}
              <video
                bind:this={heroVideo}
                src={heroArtifact.media_url}
                poster={heroArtifact.thumbnail_url}
                muted={heroMuted}
                autoplay
                loop
                playsinline
                aria-label={heroArtifact.title}
                transition:fade={{ duration: 400 }}
              ></video>
            {:else}
              <ArtifactPreview artifact={heroArtifact} />
            {/if}
          {/key}
        {:else}
          <p class="screen-empty">No render for this project yet</p>
        {/if}
        <div class="screen-scrim" aria-hidden="true"></div>

        {#if heroArtifact && isVideo(heroArtifact)}
          <button
            type="button"
            class="icon-btn screen-sound"
            aria-label={heroMuted ? 'Turn sound on' : 'Turn sound off'}
            aria-pressed={!heroMuted}
            onclick={() => (heroMuted = !heroMuted)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9v6h4l5 4V5L8 9H4z" />
              {#if heroMuted}
                <path d="m17 9 5 5m0-5-5 5" />
              {:else}
                <path d="M17 8.5a5 5 0 0 1 0 7M19.5 6a8.5 8.5 0 0 1 0 12" />
              {/if}
            </svg>
          </button>
        {/if}
      </div>

      {#key selectedProject?.run_id}
        <div class="card" in:fade={{ duration: 350 }}>
          <h1 class="card-title" title={selectedProject?.title}>{showTitle(selectedProject?.title)}</h1>
          <p class="card-logline">{logline}</p>
          <p class="card-facts">
            <span>Take {heroTake} of {projectVersions.length || 1}</span>
            <span>{modelOf(heroArtifact)}</span>
            <span>{statusLabel(selectedProject?.status)}</span>
          </p>
          <div class="card-actions">
            <a class="btn btn-solid" href={`${resolve('/comparisons')}?run=${selectedProject?.run_id}`}>
              Open project
            </a>
            <button
              type="button"
              class="btn"
              onclick={() => openTake(Math.max(0, heroTake - 1))}
              disabled={!projectVersions.length}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5v14l12-7z" /></svg>
              Watch takes
            </button>
            {#if projects.length > 1}
              <div class="card-switch">
                <button type="button" class="icon-btn" aria-label="Previous project" onclick={() => move(-1)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
                </button>
                <span>{selectedIndex + 1} / {projects.length}</span>
                <button type="button" class="icon-btn" aria-label="Next project" onclick={() => move(1)}>
                  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
                </button>
              </div>
            {/if}
          </div>
        </div>
      {/key}
    </section>

    <!-- ── Latest renders: one row, however many clips there are ──── -->
    {#if latestMedia.length}
      <section class="section" aria-labelledby="latest-title">
        <div class="home-wrap row-head">
          <h2 id="latest-title">Latest renders</h2>
          <div class="row-arrows">
            <button type="button" class="icon-btn" aria-label="Scroll latest renders back" onclick={() => scrollRow(latestRow, -1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
            </button>
            <button type="button" class="icon-btn" aria-label="Scroll latest renders forward" onclick={() => scrollRow(latestRow, 1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        <div class="row row-clips" bind:this={latestRow}>
          {#each latestMedia as item (item.artifact_id)}
            {@const project = projects.find((p) => p.run_id === item.run_id)}
            <button type="button" class="clip" onclick={() => openClip(item)}>
              <span class="clip-media">
                <ArtifactPreview artifact={item} />
                {#if item.version_number}<span class="clip-badge">v{item.version_number}</span>{/if}
              </span>
              <span class="clip-title">{showTitle(project?.title ?? item.title)}</span>
              <span class="clip-meta">{modelOf(item)}, {shortDate(item.created_at)}</span>
            </button>
          {/each}
        </div>
      </section>
    {/if}

    <!-- ── Projects row ──────────────────────────────────────────── -->
    <section class="section" aria-labelledby="projects-title">
      <div class="home-wrap row-head">
        <h2 id="projects-title">Projects</h2>
        <a class="row-link" href={resolve('/comparisons')}>See all</a>
      </div>

      <div class="row row-posters">
        {#each projects as project, i (project.run_id)}
          {@const thumb = thumbForRun(project.run_id)}
          <button
            type="button"
            class="poster"
            class:active={i === selectedIndex}
            aria-pressed={i === selectedIndex}
            onclick={() => selectProject(i)}
          >
            <span class="poster-media">{#if thumb}<ArtifactPreview artifact={thumb} />{/if}</span>
            <span class="poster-copy">
              <span class="poster-title" title={project.title}>{showTitle(project.title)}</span>
              <span class="poster-meta">{plural(project.artifact_count, 'render')}, {statusLabel(project.status)}</span>
            </span>
          </button>
        {/each}
      </div>
    </section>
  {/if}
</div>

<style>
  /*
   * Directors Cut home. One layout from phone to widescreen: columns come
   * from minmax/auto-fit and type from clamp(). The hero reads its own width
   * (container query) to decide whether the copy sits over the video or
   * under it. Colour comes from the footage; the chrome stays black/white.
   * Every title is one line.
   */
  .home {
    --pad: var(--dc-gutter-x);
    --max: calc(var(--dc-page-max) + 2 * var(--pad));
    --ink: #e7e5e4;
    --ink-2: #bdb7b1;
    --ink-3: #938d87;
    --line: rgba(255, 255, 255, 0.08);
    --line-2: rgba(255, 255, 255, 0.18);
    --raise: #0e0e0e;

    padding-bottom: clamp(40px, 6vw, 80px);
    overflow-x: clip;
    background: #000;
    color: var(--ink);
  }

  @media (min-width: 861px) {
    .home {
      height: 100%;
      overflow-y: auto;
    }
  }

  /* The player is open: the page underneath holds still. */
  .home.frozen {
    overflow: hidden;
  }

  .home-wrap {
    max-width: var(--max);
    margin: 0 auto;
    padding-right: max(var(--pad), var(--dc-safe-r));
    padding-left: max(var(--pad), var(--dc-safe-l));
  }

  .home-state {
    margin: 40px 0 0;
    color: var(--ink-2);
    font-size: 15px;
  }

  .home-state h1 {
    margin: 0 0 8px;
    color: var(--ink);
    font: 400 40px / 1.1 var(--dc-font-serif);
  }

  .home-state p {
    margin: 0 0 20px;
  }

  svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  /* ── Controls ────────────────────────────────────────────────── */

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 28px;
    padding: 0 16px;
    border: 0;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.14);
    color: var(--ink);
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
    cursor: pointer;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: background 0.15s ease;
  }

  .btn:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.24);
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn svg {
    width: 16px;
    height: 16px;
    fill: currentColor;
    stroke: none;
  }

  .btn-solid {
    background: rgba(255, 255, 255, 0.7);
    color: #000;
  }

  .btn-solid:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.8);
  }

  .icon-btn {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.12);
    color: var(--ink);
    cursor: pointer;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    transition: background 0.15s ease;
  }

  .icon-btn:hover {
    background: rgba(255, 255, 255, 0.24);
  }

  .btn:focus-visible,
  .icon-btn:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 2px;
  }

  /* ── Hero ────────────────────────────────────────────────────── */

  .hero {
    position: relative;
    container-type: inline-size;
  }

  .screen {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    max-height: calc(100dvh - var(--dc-nav-height) - 64px);
    min-height: 210px;
    overflow: hidden;
    background: #000;
  }

  .screen video,
  .screen :global(img),
  .screen :global(video) {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .screen-empty {
    display: grid;
    height: 100%;
    margin: 0;
    place-items: center;
    color: var(--ink-2);
    font-size: 14px;
  }

  .screen-scrim {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0) 26%);
  }

  .screen-sound {
    position: absolute;
    z-index: 2;
    top: 14px;
    right: max(14px, var(--dc-safe-r));
  }

  .card {
    position: relative;
    max-width: var(--max);
    margin: 0 auto;
    padding: 4px var(--pad) 0;
  }

  .card-title {
    max-width: 100%;
    margin: 0;
    overflow: hidden;
    font: 400 clamp(28px, 3.2cqi, 44px) / 1.15 var(--dc-font-serif);
    letter-spacing: -0.01em;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .card-logline {
    display: -webkit-box;
    /* Narrow enough that even a short logline wraps to fill both lines. */
    max-width: 46ch;
    margin: 8px 0 0;
    overflow: hidden;
    color: #d6d3d1;
    font-size: 14px;
    line-height: 1.55;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    /* Always two lines tall, so switching projects never moves the buttons. */
    height: calc(2 * 1.55em);
  }

  .card-facts {
    display: flex;
    flex-wrap: nowrap;
    gap: 4px 18px;
    height: 1.4em;
    margin: 10px 0 0;
    overflow: hidden;
    white-space: nowrap;
    color: var(--ink-2);
    font-size: 12px;
  }

  .card-facts span:first-child {
    color: var(--ink);
    font-weight: 600;
  }

  .card-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: 18px;
  }

  .card-switch {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-left: auto;
    color: var(--ink-2);
    font-size: 13px;
    font-variant-numeric: tabular-nums;
  }

  /* Wide enough to be a screen: the copy sits over the video, lower left. */
  @container (min-width: 760px) {
    .screen-scrim {
      background:
        linear-gradient(to top, #000 0%, rgba(0, 0, 0, 0.35) 24%, rgba(0, 0, 0, 0) 48%),
        linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 45%);
    }

    .card {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      padding-bottom: clamp(20px, 3cqi, 44px);
    }

    .card-title {
      max-width: min(62%, 900px);
    }

    .card-title,
    .card-logline {
      /* The lighter shade leaves the copy to carry its own contrast. */
      text-shadow: 0 1px 12px rgba(0, 0, 0, 0.6);
    }
  }

  /* ── Sections ────────────────────────────────────────────────── */

  .section {
    margin-top: clamp(36px, 4.5vw, 64px);
  }

  /* ── Rows ────────────────────────────────────────────────────── */

  .row-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 12px;
  }

  .row-head h2 {
    margin: 0;
    font: 400 clamp(20px, 1.7vw, 24px) / 1.15 var(--dc-font-serif);
    white-space: nowrap;
  }

  .row-arrows {
    display: flex;
    gap: 8px;
  }

  /* Touch screens swipe; the arrows only earn their space with a mouse. */
  @media (hover: none) {
    .row-arrows {
      display: none;
    }
  }

  .row-link {
    color: var(--ink-2);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
  }

  .row-link:hover {
    color: var(--ink);
  }

  /* Rows sit inside the page margins, flush with the headings and arrows. */
  .row {
    display: grid;
    grid-auto-flow: column;
    gap: 12px;
    max-width: calc(var(--max) - 2 * var(--pad));
    margin: 0 max(var(--pad), calc((100% - var(--max)) / 2 + var(--pad)));
    padding: 4px 0 8px;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .row::-webkit-scrollbar {
    display: none;
  }

  .row-clips {
    grid-auto-columns: clamp(200px, 18vw, 270px);
  }

  .row-posters {
    grid-auto-columns: clamp(240px, 26vw, 380px);
  }

  .clip {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: inherit;
    text-align: left;
    cursor: pointer;
    scroll-snap-align: start;
  }

  .clip-media {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: 4px;
    background: #111;
  }

  .clip-media :global(img),
  .clip-media :global(video),
  .poster-media :global(img),
  .poster-media :global(video) {
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .clip:hover .clip-media :global(img),
  .clip:hover .clip-media :global(video),
  .poster:hover .poster-media :global(img),
  .poster:hover .poster-media :global(video) {
    transform: scale(1.05);
  }

  .clip-badge {
    position: absolute;
    top: 6px;
    left: 6px;
    padding: 2px 6px;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
  }

  .clip-title {
    overflow: hidden;
    font-size: 13px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .clip-meta {
    margin-top: -2px;
    overflow: hidden;
    color: var(--ink-2);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .poster {
    position: relative;
    display: block;
    min-width: 0;
    aspect-ratio: 16 / 9;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 6px;
    background: #111;
    color: var(--ink);
    text-align: left;
    cursor: pointer;
    scroll-snap-align: start;
  }

  .poster-media {
    position: absolute;
    inset: 0;
    filter: brightness(0.7);
    transition: filter 0.2s ease;
  }

  .poster:hover .poster-media,
  .poster.active .poster-media {
    filter: none;
  }

  /* The project on screen gets a bar, not a box. */
  .poster.active::after {
    content: '';
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 3px;
    background: rgba(255, 255, 255, 0.7);
  }

  .poster-copy {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 40px 16px 14px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 25%, transparent);
  }

  .poster-title {
    overflow: hidden;
    font: 400 clamp(18px, 1.5vw, 22px) / 1.2 var(--dc-font-serif);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .poster-meta {
    overflow: hidden;
    color: var(--ink-2);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .clip:focus-visible,
  .poster:focus-visible {
    outline: 2px solid var(--ink);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    .clip-media :global(img),
    .clip-media :global(video),
    .poster-media :global(img),
    .poster-media :global(video) {
      transition: none;
    }
  }
</style>
