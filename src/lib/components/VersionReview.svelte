<script lang="ts">
  import type { ComparisonArtifact, GenerationPrompt, ModelAnswer } from '$lib/types/comparison';
  import VersionedArtifactCell from './VersionedArtifactCell.svelte';
  import VersionDetails from './VersionDetails.svelte';
  import { mediaApi } from '$lib/data/media-api';
  let { videos, grids, promptsMap, answersMap, onSaved }: {
    videos: ComparisonArtifact[]; grids: ComparisonArtifact[]; promptsMap: Map<string, GenerationPrompt>;
    answersMap: Map<string, ModelAnswer>; onSaved?: () => void | Promise<void>;
  } = $props();
  let activeIndex = $state(0);
  let active = $derived(videos[activeIndex] ?? videos[0]);
  let details = $state<ReturnType<typeof VersionDetails>>();
</script>

<div class="review">
  <div class="context">
    {#if active}{#key active.artifact_id}<VersionDetails bind:this={details} artifact={active} showHeading={false} {grids} {promptsMap} {onSaved} />{/key}
    {:else}<p>No video versions yet. Add a video below to attach its prompt and shot grid.</p>{/if}
  </div>
  <div class="video">
    <VersionedArtifactCell slotData={{slot_type:'video_result',active_artifact_id:active?.artifact_id ?? null,versions:videos}} label="Trailer versions" bind:activeIndex {promptsMap} {answersMap} hidePrompt>
      {#snippet headerAction()}
        {#if active && mediaApi}<button type="button" class="bar-edit" onclick={() => details?.edit()}>Edit version details</button>{/if}
      {/snippet}
    </VersionedArtifactCell>
  </div>
</div>

<style>
  .bar-edit {height:28px;padding:0 12px;border:0;border-radius:4px;background:rgba(255,255,255,.1);color:var(--dc-text);font-size:13px;font-weight:550;cursor:pointer;transition:background .15s ease;}
  .bar-edit:hover {background:rgba(255,255,255,.18);}
  .review {display:grid;grid-template-columns:minmax(0, 1.25fr) minmax(0, 1fr);gap:28px;align-items:start;margin:20px 0 24px;}
  .context,.video {min-width:0;}
  .review :global(.dc-slot-frame) {width:100%;height:auto;aspect-ratio:16/9;}
  .review :global(.dc-artifact-version-thumb) {width:80px;height:45px;flex:0 0 80px;}
  p {color:var(--dc-text-muted);font-size:13px;}
  @media(max-width:1000px){.review {grid-template-columns:1fr;}.video {grid-row:1;}}
  @media(pointer:coarse){.bar-edit {height:32px;}}
</style>
