<script lang="ts">
  import type { VersionedArtifactSlot, ComparisonArtifact } from '$lib/types/comparison';
  import CopyButton from './CopyButton.svelte';

  let {
    slotData,
    label = 'Artifact',
  }: {
    slotData: VersionedArtifactSlot;
    label?: string;
  } = $props();

  let activeIndex = $state(0);
  let active = $derived(
    slotData.versions.length > 0 ? slotData.versions[activeIndex] : null
  );

  function setActive(index: number) {
    if (index < 0) index = slotData.versions.length - 1;
    if (index >= slotData.versions.length) index = 0;
    activeIndex = index;
  }
</script>

<div class="dc-artifact-cell">
  <div class="dc-artifact-cell-header">
    <span class="dc-artifact-cell-label">{label}</span>
    {#if slotData.versions.length > 1}
      <div class="dc-version-controls">
        <button class="dc-version-arrow" onclick={() => setActive(activeIndex - 1)} aria-label="Previous version">
          ‹
        </button>
        <select
          class="dc-version-select"
          value={activeIndex}
          onchange={(e) => setActive(Number((e.currentTarget as HTMLSelectElement).value))}
        >
          {#each slotData.versions as v, i (v.artifact_id)}
            <option value={i}>v{i + 1} {v.status ? `(${v.status})` : ''}</option>
          {/each}
        </select>
        <button class="dc-version-arrow" onclick={() => setActive(activeIndex + 1)} aria-label="Next version">
          ›
        </button>
      </div>
    {:else if slotData.versions.length === 1}
      <span class="dc-version-label">v1</span>
    {:else}
      <span class="dc-version-label dc-pending">pending</span>
    {/if}
  </div>

  <div class="dc-artifact-cell-body">
    {#if active}
      <div class="dc-artifact-preview">
        {#if active.thumbnail_url || active.media_url}
          {#if active.artifact_type === 'video_result' || active.artifact_type === 'end_video'}
            <div class="dc-video-poster">
              <img
                src={active.thumbnail_url || active.media_url}
                alt={active.title}
                loading="lazy"
              />
              <div class="dc-play-overlay">▶</div>
            </div>
          {:else}
            <img
              src={active.thumbnail_url || active.media_url}
              alt={active.title}
              loading="lazy"
            />
          {/if}
        {:else}
          <div class="dc-empty-preview">No preview</div>
        {/if}
      </div>
      <div class="dc-artifact-meta">
        <span>{active.provider}</span>
        {#if active.created_at}
          <span>{new Date(active.created_at).toLocaleDateString()}</span>
        {/if}
      </div>
      {#if active.prompt_text}
        <div class="dc-artifact-actions">
          <CopyButton text={active.prompt_text} label="Prompt" size={10} />
        </div>
      {/if}
    {:else}
      <div class="dc-empty-artifact">
        <span>No {label.toLowerCase()} yet</span>
        <button class="dc-action-button" disabled>Generate {label}</button>
      </div>
    {/if}
  </div>
</div>
