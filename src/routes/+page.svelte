<script lang="ts">
  import { onMount } from 'svelte';
  import { loadPromptCards } from '$lib/data/loader';
  import { loadLatestArtifacts } from '$lib/data/comparisons';
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import type { ComparisonArtifact } from '$lib/types/comparison';
  import Badge, { FAMILY_COLORS } from '$lib/components/Badge.svelte';
  import MediaLightbox from '$lib/components/MediaLightbox.svelte';

  let cards: PromptCardIndex[] = $state.raw([]);
  let latestMedia: ComparisonArtifact[] = $state.raw([]);
  let lightboxArtifacts = $state<ComparisonArtifact[] | null>(null);
  let lightboxIndex = $state(0);

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

  const testedCount = $derived(cards.filter((c) => c.tested_by_us).length);
  const sourceCount = $derived(
    cards.reduce((acc, c) => acc + c.source_count, 0),
  );

  const glassHouseMediaCount = $derived(latestMedia.filter((m) => m.run_id === '2026-07-netflix-teaser-title-slam-001').length);

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

  onMount(async () => {
    cards = await loadPromptCards();
    latestMedia = await loadLatestArtifacts();
  });
</script>

{#if lightboxArtifacts}
  <MediaLightbox artifacts={lightboxArtifacts} activeIndex={lightboxIndex} onClose={closeLightbox} />
{/if}

<div style="padding: 24px; overflow-y: auto; height: 100%;">
  <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 20px; color: var(--dc-text);">Dashboard</h1>

  <section style="display: flex; gap: 32px; margin-bottom: 28px;">
    <div>
      <div style="font-size: 28px; font-weight: 700; color: var(--dc-sora);">{cards.length}</div>
      <div style="font-size: 11px; text-transform: uppercase; color: var(--dc-text-dim);">Cards</div>
    </div>
    <div>
      <div style="font-size: 28px; font-weight: 700; color: var(--dc-text);">{sourceCount}</div>
      <div style="font-size: 11px; text-transform: uppercase; color: var(--dc-text-dim);">Sources</div>
    </div>
    <div>
      <div style="font-size: 28px; font-weight: 700; color: var(--dc-conf-medium);">{testedCount}</div>
      <div style="font-size: 11px; text-transform: uppercase; color: var(--dc-text-dim);">Tested</div>
    </div>
  </section>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 800px;">
    <section>
      <h2 style="font-size: 12px; text-transform: uppercase; color: var(--dc-text-dim); margin: 0 0 10px;">Model Families</h2>
      {#each families as [family, count]}
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <Badge label={family} color={FAMILY_COLORS[family] ?? 'var(--dc-general)'} active />
          <div style="flex: 1; min-width: 100px; height: 8px; background: var(--dc-bg-elev-2); border-radius: 4px; overflow: hidden;">
            <div
              style:height="100%"
              style:width="{(count / cards.length) * 100}%"
              style:background={FAMILY_COLORS[family] ?? 'var(--dc-general)'}
            ></div>
          </div>
          <span style="font-size: 12px; color: var(--dc-text-muted); min-width: 20px; text-align: right;">{count}</span>
        </div>
      {/each}
    </section>

    <section>
      <h2 style="font-size: 12px; text-transform: uppercase; color: var(--dc-text-dim); margin: 0 0 10px;">Use Cases</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        {#each useCases as uc}
          <Badge label={uc} />
        {/each}
      </div>
    </section>
  </div>

  <section style="margin-top: 28px; max-width: 800px;">
    <h2 style="font-size: 12px; text-transform: uppercase; color: var(--dc-text-dim); margin: 0 0 10px;">Latest Media</h2>
    {#if latestMedia.length === 0}
      <p style="font-size: 13px; color: var(--dc-text-muted); margin: 0;">No generated media yet. Generate a grid or video to see it here.</p>
    {:else}
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 12px;">
        {#each latestMedia as item, i (item.artifact_id)}
          <button
            class="dc-latest-media-card"
            onclick={() => openLightbox(item, i)}
            style="background: var(--dc-bg-elev); border: 1px solid var(--dc-border); border-radius: var(--dc-radius); overflow: hidden; cursor: pointer; text-align: left; padding: 0; position: relative;"
          >
            <div style="aspect-ratio: 16 / 9; background: var(--dc-bg); overflow: hidden;">
              {#if item.thumbnail_url || item.media_url}
                <img
                  src={item.thumbnail_url ?? item.media_url}
                  alt={item.title}
                  loading="lazy"
                  style="width: 100%; height: 100%; object-fit: cover; display: block;"
                />
              {:else}
                <div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: var(--dc-text-dim); font-size: 11px;">No preview</div>
              {/if}
            </div>
            <div style="padding: 8px;">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                <span
                  style="font-size: 9px; text-transform: uppercase; letter-spacing: 0.04em; padding: 2px 5px; border-radius: 4px; color: var(--dc-bg); font-weight: 600;"
                  style:background={isVideoType(item) ? 'var(--dc-seedance)' : 'var(--dc-sora)'}
                >
                  {isVideoType(item) ? 'Video' : 'Image'}
                </span>
              </div>
              <div style="font-size: 12px; color: var(--dc-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{item.title}</div>
              <div style="font-size: 10px; color: var(--dc-text-dim); margin-top: 2px;">{item.provider} · {item.artifact_type}</div>
            </div>
          </button>
        {/each}
      </div>
    {/if}
  </section>

  <section style="margin-top: 28px; max-width: 800px;">
    <h2 style="font-size: 12px; text-transform: uppercase; color: var(--dc-text-dim); margin: 0 0 10px;">Needs Attention</h2>
    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px;">
      <li style="font-size: 13px; color: var(--dc-text-muted);">○ Untested cards: {cards.length - testedCount}</li>
      <li style="font-size: 13px; color: {glassHouseMediaCount > 0 ? 'var(--dc-sora)' : 'var(--dc-text-muted)'};">
        ○ THE GLASS HOUSE: {glassHouseMediaCount > 0 ? `${glassHouseMediaCount} generated media artifact${glassHouseMediaCount === 1 ? '' : 's'} (generation complete)` : 'waiting for generation'}
      </li>
      <li style="font-size: 13px; color: var(--dc-text-muted);">○ Sora Vice: generation failed (billing_hard_limit_reached) — 2 prompts filed, no media</li>
      <li style="font-size: 13px; color: var(--dc-text-muted);">○ Pink Room: Sora 2 media ingested (2 takes); Seedance Enhanced Fast still needs correct download</li>
      <li style="font-size: 13px; color: var(--dc-text-muted);">○ Dashboard feed shows latest Hermes-generated media</li>
    </ul>
  </section>
</div>
