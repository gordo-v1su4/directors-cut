<script lang="ts">
  import type { ReferenceImageArtifact } from '$lib/types/comparison';

  let { images }: { images: ReferenceImageArtifact[] } = $props();

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
  {#if images.length === 0}
    <div class="dc-empty-reference">
      <span>No reference images</span>
      <button class="dc-action-button" disabled>Add reference</button>
    </div>
  {:else}
    <div class="dc-reference-list">
      {#each images as img (img.artifact_id)}
        <div class="dc-reference-thumb" title={img.title}>
          {#if img.thumbnail_url || img.media_url}
            <img src={img.thumbnail_url || img.media_url} alt={img.title} loading="lazy" />
          {:else}
            <div class="dc-reference-no-img">
              {img.reference_role?.slice(0, 1).toUpperCase() || 'R'}
            </div>
          {/if}
          <div class="dc-reference-badges">
            <span class="dc-reference-badge" style:color={badgeColor(img.source_platform)}>
              {img.source_platform}
            </span>
            <span class="dc-reference-badge">{img.reference_role}</span>
            <span class="dc-reference-badge dc-reference-rights">{img.rights_status}</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
