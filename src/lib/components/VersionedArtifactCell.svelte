<script lang="ts">
  import type { VersionedArtifactSlot } from '$lib/types/comparison';
  import CopyButton from './CopyButton.svelte';

  let {
    slotData,
    label = 'Artifact',
  }: {
    slotData: VersionedArtifactSlot;
    label?: string;
  } = $props();

  let activeIndex = $state(0);
  let hovering = $state(false);
  let hoverPos = $state({ x: 0, y: 0 });
  let active = $derived(
    slotData.versions.length > 0 ? slotData.versions[activeIndex] : null
  );
  const isVideo = $derived(
    active?.artifact_type === 'video_result' || active?.artifact_type === 'end_video'
  );
  const previewUrl = $derived(active?.thumbnail_url || active?.media_url);

  function setActive(index: number) {
    if (index < 0) index = slotData.versions.length - 1;
    if (index >= slotData.versions.length) index = 0;
    activeIndex = index;
  }

  function onHoverEnter(e: MouseEvent) {
    hovering = true;
    updateHoverPos(e);
  }

  function onHoverMove(e: MouseEvent) {
    updateHoverPos(e);
  }

  function onHoverLeave() {
    hovering = false;
  }

  function updateHoverPos(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    hoverPos = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }
</script>

<div class="dc-artifact-cell"
  role="img"
  aria-label={active ? active.title : `No ${label.toLowerCase()} yet`}
  onmouseenter={onHoverEnter}
  onmousemove={onHoverMove}
  onmouseleave={onHoverLeave}
>
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

  <div class="dc-slot-frame"
    class:dc-slot-frame-video={isVideo}
    class:dc-slot-frame-empty={!active}
  >
    {#if active}
      {#if previewUrl}
        {#if isVideo}
          <div class="dc-slot-media">
            <img src={previewUrl} alt={active.title} loading="lazy" />
            <div class="dc-play-overlay">▶</div>
          </div>
        {:else}
          <div class="dc-slot-media">
            <img src={previewUrl} alt={active.title} loading="lazy" />
          </div>
        {/if}
      {:else}
        <div class="dc-slot-placeholder">No preview</div>
      {/if}
    {:else}
      <div class="dc-slot-placeholder">
        <span>No {label.toLowerCase()} yet</span>
        <button class="dc-action-button" disabled>Generate</button>
      </div>
    {/if}
  </div>

  {#if active}
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

    {#if hovering && previewUrl}
      <div
        class="dc-hover-preview"
        style:left="{Math.min(hoverPos.x + 12, 220)}px"
        style:top="{Math.min(hoverPos.y + 12, 120)}px"
      >
        {#if isVideo}
          <div class="dc-hover-video">
            <img src={previewUrl} alt={active.title} />
            <div class="dc-hover-play">▶ click to play</div>
          </div>
        {:else}
          <img src={previewUrl} alt={active.title} />
        {/if}
        <div class="dc-hover-meta">
          <span>{active.title}</span>
          <span>{active.provider}</span>
        </div>
      </div>
    {/if}
  {/if}
</div>
