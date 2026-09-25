<script lang="ts">
  import type { ComparisonArtifact } from '$lib/types/comparison';
  let { artifact }: { artifact: ComparisonArtifact } = $props();
  let failedUrl = $state<string | undefined>();
  const video = $derived(['video_result', 'end_video'].includes(artifact.artifact_type));
  const imageUrl = $derived(artifact.thumbnail_url || (!video ? artifact.media_url : undefined));
</script>

{#key artifact.artifact_id}
  {#if imageUrl && failedUrl !== imageUrl}
    <img src={imageUrl} alt={artifact.title} loading="lazy" onerror={() => failedUrl = imageUrl} />
  {:else if video && artifact.media_url}
    <video src={`${artifact.media_url}#t=0.5`} preload="metadata" muted playsinline aria-label={artifact.title}></video>
  {:else}
    <span>No preview available</span>
  {/if}
{/key}

<style>
  img, video { display: block; width: 100%; height: 100%; object-fit: contain; background: #000; }
</style>
