<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { VersionedArtifactSlot, GenerationPrompt, ModelAnswer } from '$lib/types/comparison';
  import { videoModel } from '$lib/data/version-context';
  import CopyButton from './CopyButton.svelte';
  import PromptModal from './PromptModal.svelte';
  import MediaLightbox from './MediaLightbox.svelte';

  let {
    slotData,
    activeIndex = $bindable(0),
    hidePrompt = false,
    label = 'Artifact',
    promptsMap = new Map(),
    answersMap = new Map(),
    onGenerate,
    generateDisabled = false,
    generateBusy = false,
    generateLabel = 'Generate',
    headerAction,
  }: {
    slotData: VersionedArtifactSlot;
    activeIndex?: number;
    hidePrompt?: boolean;
    label?: string;
    promptsMap?: Map<string, GenerationPrompt>;
    answersMap?: Map<string, ModelAnswer>;
    onGenerate?: () => void | Promise<void>;
    generateDisabled?: boolean;
    generateBusy?: boolean;
    generateLabel?: string;
    /** Extra control shown at the right end of the header row. */
    headerAction?: Snippet;
  } = $props();

  let activePrompt = $state<GenerationPrompt | null>(null);
  let lightboxOpen = $state(false);

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
  const previewUrl = $derived(isVideo ? active?.media_url : active?.thumbnail_url || active?.media_url);

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

</script>

{#if lightboxOpen}
  <MediaLightbox
    artifacts={slotData.versions}
    bind:activeIndex
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
  role="group"
  aria-label={active ? active.title : `No ${label.toLowerCase()} yet`}
>
  <div class="dc-artifact-cell-header">
    <span class="dc-artifact-cell-label">{label}</span>
    <span class="dc-artifact-cell-end">
      {#if slotData.versions.length > 1}
        <!-- The thumbnail strip picks the version; the header just says which. -->
        <span class="dc-version-label">v{activeIndex + 1} of {slotData.versions.length}</span>
      {:else if slotData.versions.length === 1}
        <span class="dc-version-label">v1</span>
      {:else}
        <span class="dc-version-label dc-pending">pending</span>
      {/if}
      {@render headerAction?.()}
    </span>
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
              src={active.media_url}
              poster={active.thumbnail_url}
              playsinline
              preload="metadata"
              muted
              style="width: 100%; height: 100%; object-fit: cover; display: block;"
              onmouseenter={(e) => { void e.currentTarget.play().catch(() => undefined); }}
              onmouseleave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
            ></video>
            <button
              class="dc-slot-expand"
              onclick={openLightbox}
              aria-label="Expand preview"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" /></svg>
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
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg>
            </button>
          </div>
        {/if}
      {:else}
        <div class="dc-slot-placeholder">No preview</div>
      {/if}
    {:else}
      <div class="dc-slot-placeholder">
        <span>No {label.toLowerCase()} yet</span>
        {#if onGenerate}
          <button
            class="dc-action-button"
            disabled={generateDisabled || generateBusy}
            onclick={() => void onGenerate()}
          >
            {generateBusy ? 'Generating…' : generateLabel}
          </button>
        {:else}
          <button class="dc-action-button" disabled>Generate</button>
        {/if}
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
            {#if v.thumbnail_url}
              <img src={v.thumbnail_url} alt={v.title} loading="lazy" />
            {:else if v.artifact_type === 'video_result' || v.artifact_type === 'end_video'}
              <video src={`${v.media_url}#t=0.5`} preload="metadata" muted playsinline aria-label={v.title}></video>
            {:else}
              <img src={v.media_url} alt={v.title} loading="lazy" />
            {/if}
          {:else}
            <div class="dc-artifact-version-placeholder">{i + 1}</div>
          {/if}
        </button>
      {/each}
    </div>
  {/if}

  {#if active}
    <div class="dc-artifact-meta">
      <span>{isVideo ? videoModel(active) : active.provider}</span>
      {#if active.created_at}
        <span>{new Date(active.created_at).toLocaleDateString()}</span>
      {/if}
    </div>
    {#if promptPreview && !hidePrompt}
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
    {:else if active.prompt_text && !hidePrompt}
      <div class="dc-artifact-actions">
        <CopyButton text={active.prompt_text} label="Prompt" size={10} />
      </div>
    {/if}

  {/if}</div>
