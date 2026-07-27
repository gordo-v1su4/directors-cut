<script lang="ts">
  import type { VersionedArtifactSlot, GenerationPrompt, ModelAnswer } from '$lib/types/comparison';
  import CopyButton from './CopyButton.svelte';
  import PromptModal from './PromptModal.svelte';
  import MediaLightbox from './MediaLightbox.svelte';

  let {
    slotData,
    label = 'Artifact',
    promptsMap = new Map(),
    answersMap = new Map(),
  }: {
    slotData: VersionedArtifactSlot;
    label?: string;
    promptsMap?: Map<string, GenerationPrompt>;
    answersMap?: Map<string, ModelAnswer>;
  } = $props();

  let activePrompt = $state<GenerationPrompt | null>(null);
  let lightboxOpen = $state(false);

  let activeIndex = $state(0);
  let hovering = $state(false);
  let hoverPos = $state({ x: 0, y: 0 });
  let active = $derived(
    slotData.versions.length > 0 ? slotData.versions[activeIndex] : null
  );
  let activePromptRef = $derived(active?.prompt_id ? promptsMap.get(active.prompt_id) : null);
  let promptAuthor = $derived(
    activePromptRef?.answer_id ? answersMap.get(activePromptRef.answer_id) : null
  );
  let promptPreview = $derived(
    activePromptRef
      ? promptAuthor
        ? `${promptAuthor.model_name} · ${activePromptRef.model}`
        : `${activePromptRef.model} · ${activePromptRef.provider}`
      : active?.prompt_text
        ? 'View prompt'
        : null
  );
  const isVideo = $derived(
    active?.artifact_type === 'video_result' || active?.artifact_type === 'end_video'
  );
  const previewUrl = $derived(active?.thumbnail_url || active?.media_url);

  function openPrompt(e: MouseEvent) {
    e.stopPropagation();
    if (activePromptRef) {
      activePrompt = {
        ...activePromptRef,
        notes: promptAuthor
          ? `Prompt by ${promptAuthor.model_name} (${promptAuthor.agent_name})`
          : activePromptRef.notes,
      };
    } else if (active?.prompt_text) {
      activePrompt = {
        prompt_id: `inline-${active.artifact_id}`,
        run_id: active.run_id,
        slot_type: active.artifact_type,
        prompt_text: active.prompt_text,
        model: active.provider,
        provider: active.provider,
        created_at: active.created_at,
        source: 'generated',
      };
    }
  }

  function closePrompt() {
    activePrompt = null;
  }

  function openLightbox(e: MouseEvent) {
    e.stopPropagation();
    lightboxOpen = true;
  }

  function closeLightbox() {
    lightboxOpen = false;
  }

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

{#if lightboxOpen}
  <MediaLightbox
    artifacts={slotData.versions}
    activeIndex={activeIndex}
    {promptsMap}
    {answersMap}
    onClose={closeLightbox}
  />
{/if}

{#if activePrompt}
  <PromptModal
    prompt={activePrompt}
    images={active ? [{ url: active.media_url ?? active.thumbnail_url, title: active.title }] : []}
    onClose={closePrompt}
  />
{/if}

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

  <div
    class="dc-slot-frame"
    class:dc-slot-frame-video={isVideo}
    class:dc-slot-frame-empty={!active}
  >
    {#if active}
      {#if previewUrl}
        {#if isVideo}
          <div class="dc-slot-media" style="position: relative;">
            <video
              src={previewUrl}
              poster={active.thumbnail_url}
              preload="metadata"
              muted
              style="width: 100%; height: 100%; object-fit: cover; display: block;"
              onmouseenter={(e) => e.currentTarget.play()}
              onmouseleave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
            ></video>
            <button
              class="dc-slot-expand"
              onclick={openLightbox}
              aria-label="Expand preview"
            >
              ▶
            </button>
          </div>
        {:else}
          <div class="dc-slot-media" style="position: relative;">
            <img src={previewUrl} alt={active.title} loading="lazy" />
            <button
              class="dc-slot-expand"
              onclick={openLightbox}
              aria-label="Expand preview"
            >
              ⛶
            </button>
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

  {#if active && slotData.versions.length > 1}
    <div class="dc-artifact-version-strip">
      {#each slotData.versions as v, i (v.artifact_id)}
        <button
          class="dc-artifact-version-thumb"
          class:dc-artifact-version-active={i === activeIndex}
          onclick={(e) => { e.stopPropagation(); setActive(i); }}
          aria-label={`Version ${i + 1}`}
        >
          {#if v.thumbnail_url || v.media_url}
            <img src={v.thumbnail_url ?? v.media_url} alt={v.title} loading="lazy" />
          {:else}
            <div class="dc-artifact-version-placeholder">{i + 1}</div>
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  {#if active}
    <div class="dc-artifact-meta">
      <span>{active.provider}</span>
      {#if active.created_at}
        <span>{new Date(active.created_at).toLocaleDateString()}</span>
      {/if}
    </div>
    {#if promptPreview}
      <div class="dc-artifact-prompt-badge">
        <button
          class="dc-badge"
          style:color="var(--dc-text)"
          style:border-color="var(--dc-border)"
          style:font-size="10px"
          onclick={openPrompt}
        >
          {promptPreview}
        </button>
      </div>
    {:else if active.prompt_text}
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
  {/if}</div>
