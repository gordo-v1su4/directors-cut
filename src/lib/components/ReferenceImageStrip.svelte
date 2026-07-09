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
  <div class="dc-reference-grid">
    {#each displayImages as img (img.artifact_id)}
      <div class="dc-reference-cell" role="img" aria-label={img.title}>
        <div class="dc-slot-frame">
          {#if img.thumbnail_url || img.media_url}
            <div class="dc-slot-media">
              <img src={img.thumbnail_url || img.media_url} alt={img.title} loading="lazy" />
            </div>
          {:else}
            <div class="dc-slot-placeholder">
              {img.reference_role?.slice(0, 1).toUpperCase() || 'R'}
            </div>
          {/if}
        </div>
        <div class="dc-reference-badges">
          <span class="dc-reference-badge" style:color={badgeColor(img.source_platform)}>
            {img.source_platform}
          </span>
          <span class="dc-reference-badge">{img.reference_role}</span>
          <span class="dc-reference-badge dc-reference-rights">{img.rights_status}</span>
        </div>
      </div>
    {/each}

    {#each Array.from({ length: placeholders }) as _, i (i)}
      <div class="dc-reference-cell dc-reference-empty" role="img" aria-label="Reference image placeholder">
        <div class="dc-slot-frame dc-slot-frame-empty">
          <div class="dc-slot-placeholder">
            <span>Ref {images.length + i + 1}</span>
            <button class="dc-action-button" disabled>Add</button>
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
