<script lang="ts">
  import type { ReferenceImageArtifact } from '$lib/types/comparison';
  import MediaLightbox from './MediaLightbox.svelte';

  let { images }: { images: ReferenceImageArtifact[] } = $props();

  let activeIndex = $state(0);
  let lightboxOpen = $state(false);
  let active = $derived(images[activeIndex] ?? null);

  function setActive(index: number) {
    if (!images.length) return;
    if (index < 0) index = images.length - 1;
    if (index >= images.length) index = 0;
    activeIndex = index;
  }
</script>

{#if lightboxOpen}
  <MediaLightbox artifacts={images} {activeIndex} onClose={() => lightboxOpen = false} />
{/if}

<div class="dc-reference-strip">
  <div class="dc-artifact-cell-header">
    <span class="dc-artifact-cell-label">References</span>
    {#if images.length > 1}
      <div class="dc-version-controls">
        <button class="dc-version-arrow" onclick={() => setActive(activeIndex - 1)} aria-label="Previous reference">‹</button>
        <span class="dc-version-label">{activeIndex + 1} / {images.length}</span>
        <button class="dc-version-arrow" onclick={() => setActive(activeIndex + 1)} aria-label="Next reference">›</button>
      </div>
    {:else}
      <span class="dc-version-label">{images.length ? '1 / 1' : 'empty'}</span>
    {/if}
  </div>

  <div class="dc-slot-frame dc-reference-frame" class:dc-slot-frame-empty={!active}>
    {#if active && (active.thumbnail_url || active.media_url)}
      <div class="dc-slot-media">
        <img src={active.thumbnail_url || active.media_url} alt={active.title} loading="lazy" />
        <button class="dc-slot-expand" onclick={() => lightboxOpen = true} aria-label="Expand reference">⛶</button>
      </div>
    {:else if active}
      <div class="dc-slot-placeholder">No preview for this reference</div>
    {:else}
      <div class="dc-slot-placeholder"><span>No references attached</span><button class="dc-action-button" disabled>Add reference</button></div>
    {/if}
  </div>

  {#if images.length > 1}
    <div class="dc-artifact-version-strip" aria-label="Reference thumbnails">
      {#each images as image, index (image.artifact_id)}
        <button
          class="dc-artifact-version-thumb dc-reference-thumb"
          class:dc-artifact-version-active={index === activeIndex}
          onclick={() => setActive(index)}
          aria-label={`Reference ${index + 1}: ${image.title}`}
        >
          {#if image.thumbnail_url || image.media_url}
            <img src={image.thumbnail_url || image.media_url} alt="" loading="lazy" />
          {:else}
            <span>{index + 1}</span>
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  {#if active}
    <div class="dc-reference-caption">
      <span>{active.reference_role}</span>
      <span>{active.source_platform}</span>
    </div>
  {/if}
</div>
