<script lang="ts">
  import { onMount } from 'svelte';
  import { loadPromptCards } from '$lib/data/loader';
  import { loadLatestArtifacts } from '$lib/data/comparisons';
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import type { ComparisonArtifact } from '$lib/types/comparison';
  import MediaLightbox from '$lib/components/MediaLightbox.svelte';
  import HoverVideoPreview from '$lib/components/HoverVideoPreview.svelte';

  let cards: PromptCardIndex[] = $state.raw([]);
  let latestMedia: ComparisonArtifact[] = $state.raw([]);
  let lightboxArtifacts = $state<ComparisonArtifact[] | null>(null);
  let lightboxIndex = $state(0);
  let hoverVideo = $state<ComparisonArtifact | null>(null);

  const families = $derived(
    Object.entries(
      cards.reduce<Record<string, number>>((acc, c) => {
        acc[c.model_family] = (acc[c.model_family] ?? 0) + 1;
        return acc;
      }, {}),
    ).sort((a, b) => b[1] - a[1]),
  );

  const useCases = $derived(
    [...new Set(cards.flatMap((c) => c.use_cases))].sort(),
  );
  const featuredUseCases = $derived(useCases.slice(0, 8));

  const testedCount = $derived(cards.filter((c) => c.tested_by_us).length);
  const sourceCount = $derived(
    cards.reduce((acc, c) => acc + c.source_count, 0),
  );

  const latestVideos = $derived(latestMedia.filter(isVideoType));

  function openLightbox(item: ComparisonArtifact, index: number) {
    lightboxArtifacts = latestMedia;
    lightboxIndex = index;
  }

  function closeLightbox() {
    lightboxArtifacts = null;
  }

  function isVideoType(item: ComparisonArtifact) {
    return item.artifact_type === 'video_result' || item.artifact_type === 'end_video';
  }

  function playPreview(event: MouseEvent | FocusEvent) {
    const video = (event.currentTarget as HTMLElement).querySelector('video');
    if (video) void video.play().catch(() => {});
  }

  function resetPreview(event: MouseEvent | FocusEvent) {
    const video = (event.currentTarget as HTMLElement).querySelector('video');
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  }

  onMount(async () => {
    cards = await loadPromptCards();
    latestMedia = await loadLatestArtifacts();
  });
</script>

{#if lightboxArtifacts}
  <MediaLightbox artifacts={lightboxArtifacts} activeIndex={lightboxIndex} onClose={closeLightbox} />
{/if}
{#if hoverVideo}
  <HoverVideoPreview artifact={hoverVideo} onClose={() => hoverVideo = null} />
{/if}

<div class="dc-dashboard">
  <div class="dc-dashboard-inner">
    <header class="dc-dashboard-header">
      <div><p class="dc-eyebrow">Creative intelligence library</p><h1>Dashboard</h1></div>
      <p class="dc-dashboard-intro">Prompt research, model comparisons, and generated media in one focused workspace.</p>
    </header>
    <section class="dc-stat-grid" aria-label="Library totals">
      <div class="dc-stat"><span class="dc-stat-value">{cards.length}</span><span class="dc-stat-label">Cards</span></div>
      <div class="dc-stat"><span class="dc-stat-value">{sourceCount}</span><span class="dc-stat-label">Sources</span></div>
      <div class="dc-stat"><span class="dc-stat-value">{testedCount}</span><span class="dc-stat-label">Tested</span></div>
    </section>

    <div class="dc-dashboard-grid">
      <section class="dc-section">
        <div class="dc-section-heading"><h2 class="dc-section-title">Model families</h2><span class="dc-section-note">{cards.length} cards total</span></div>
      {#each families as [family, count]}
        <div class="dc-family-row">
          <span class="dc-family-name">{family.replace(/[_-]/g, ' ')}</span>
          <div class="dc-family-track"><div class="dc-family-fill" style:width="{(count / cards.length) * 100}%"></div></div>
          <span class="dc-family-count">{count}</span>
        </div>
      {/each}
      </section>
      <section class="dc-section">
        <div class="dc-section-heading"><h2 class="dc-section-title">Use cases</h2><span class="dc-section-note">Top themes</span></div>
        <div class="dc-use-case-summary"><div class="dc-use-case-list">{#each featuredUseCases as uc}<span class="dc-use-case-chip">{uc.replace(/[_-]/g, ' ')}</span>{/each}</div><span class="dc-use-case-more">+{Math.max(0, useCases.length - featuredUseCases.length)} more across the library</span></div>
      </section>
    </div>

  <section class="dc-media-section">
    <div class="dc-section-heading"><h2 class="dc-section-title">Latest media</h2><span class="dc-section-note">Hover videos to preview · click for sound</span></div>
    {#if latestVideos.length === 0}
      <p style="font-size: 13px; color: var(--dc-text-muted); margin: 0;">No generated videos yet.</p>
    {:else}
      <div class="dc-media-grid">
        {#each latestVideos as item (item.artifact_id)}
          <button
            class="dc-media-card"
            onclick={() => hoverVideo = item}
            onmouseenter={(event) => { playPreview(event); hoverVideo = item; }}
            onmouseleave={resetPreview}
            onfocus={playPreview}
            onblur={resetPreview}
          >
            <div class="dc-media-frame">
              {#if item.thumbnail_url || item.media_url}
                {#if isVideoType(item)}
                  <video src={item.media_url} preload="metadata" muted playsinline aria-label={item.title}></video>
                {:else}
                  <img src={item.thumbnail_url ?? item.media_url} alt={item.title} loading="lazy" />
                {/if}
              {:else}
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--dc-text-dim); font-size: 11px;">No preview</div>
              {/if}
              <span class="dc-media-overlay">▶ Preview</span>
            </div>
            <div class="dc-media-copy"><div class="dc-media-title">{item.title}</div><div class="dc-media-meta">{item.provider.replace(/_/g, ' ')} · {item.artifact_type.replace(/_/g, ' ')}</div></div>
          </button>
        {/each}
      </div>
    {/if}
  </section>

  <section class="dc-attention">
    <div class="dc-section-heading"><h2 class="dc-section-title">Needs attention</h2></div>
    <ul class="dc-attention-list">
      <li>Untested cards: {cards.length - testedCount}</li>
      <li>Sora Vice: generation blocked by billing limit</li>
      <li>Pink Room: two Sora takes ingested; Seedance download pending</li>
    </ul>
  </section>
  </div>
</div>
