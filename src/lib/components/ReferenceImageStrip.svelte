<script lang="ts">
  import type { ReferenceImageArtifact } from '$lib/types/comparison';

  let { images }: { images: ReferenceImageArtifact[] } = $props();

  const placeholders = $derived(Math.max(3 - images.length, 0));
  const displayImages = $derived(images.slice(0, 3));

  function badgeColor(platform: string): string {
    switch (platform) {
      case 'pinterest':
        return '#e60023';
      case 'generated':
        return 'var(--dc-sora)';
      case 'upload':
        return 'var(--dc-seedance)';
      case 'web':
        return 'var(--dc-cross)';
      default:
        return 'var(--dc-general)';
    }
  }
</script>

<div class="dc-reference-strip">
  <div class="dc-slot-frame dc-reference-frame">
    <div class="dc-reference-segments">
      {#each displayImages as img, i (img.artifact_id)}
        <div class="dc-reference-segment" role="img" aria-label={img.title}>
          {#if img.thumbnail_url || img.media_url}
            <div class="dc-reference-segment-media">
              <img src={img.thumbnail_url || img.media_url} alt={img.title} loading="lazy" />
            </div>
          {:else}
            <div class="dc-reference-segment-placeholder">
              {img.reference_role?.slice(0, 1).toUpperCase() || 'R'}
            </div>
          {/if}
        </div>
      {/each}

      {#each Array.from({ length: placeholders }) as _, i (i)}
        <div class="dc-reference-segment dc-reference-segment-empty" role="img" aria-label="Reference image placeholder">
          <div class="dc-reference-segment-placeholder">
            <span class="dc-ref-num">Ref {images.length + i + 1}</span>
            <button class="dc-ref-add" disabled>+</button>
          </div>
        </div>
      {/each}
    </div>
  </div>

  {#if displayImages.length > 0}
    <div class="dc-reference-badges">
      {#each displayImages as img (img.artifact_id)}
        <span class="dc-reference-badge" style:color={badgeColor(img.source_platform)}>
          {img.source_platform}
        </span>
      {/each}
      {#each displayImages as img (img.artifact_id)}
        <span class="dc-reference-badge">{img.reference_role}</span>
      {/each}
      {#each displayImages as img (img.artifact_id)}
        <span class="dc-reference-badge dc-reference-rights">{img.rights_status}</span>
      {/each}
    </div>
  {/if}
</div>
