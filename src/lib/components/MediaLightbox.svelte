<script lang="ts">
  import type { ComparisonArtifact, GenerationPrompt, ModelAnswer } from '$lib/types/comparison';
  import CopyButton from './CopyButton.svelte';

  let {
    artifacts,
    activeIndex = 0,
    promptsMap = new Map(),
    answersMap = new Map(),
    onClose,
  }: {
    artifacts: ComparisonArtifact[];
    activeIndex?: number;
    promptsMap?: Map<string, GenerationPrompt>;
    answersMap?: Map<string, ModelAnswer>;
    onClose: () => void;
  } = $props();

  let selectedIndex = $state(0);
  let promptExpanded = $state(false);

  $effect(() => {
    selectedIndex = activeIndex;
  });
  let active = $derived(artifacts[selectedIndex] ?? null);
  let activePrompt = $derived(active?.prompt_id ? promptsMap.get(active.prompt_id) : null);
  let promptAuthor = $derived(activePrompt?.answer_id ? answersMap.get(activePrompt.answer_id) : null);
  let isVideo = $derived(active?.artifact_type === 'video_result' || active?.artifact_type === 'end_video');
  let mediaUrl = $derived(active?.media_url ?? active?.thumbnail_url);
  function selectVersion(index: number) {
    selectedIndex = index;
    promptExpanded = false;
  }

  function togglePrompt() {
    promptExpanded = !promptExpanded;
  }

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') selectedIndex = Math.max(0, selectedIndex - 1);
    if (e.key === 'ArrowRight') selectedIndex = Math.min(artifacts.length - 1, selectedIndex + 1);
  }

  function formatType(type: string) {
    return type.replace(/_/g, ' ');
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="dc-lightbox-backdrop" onclick={handleBackdrop} onkeydown={handleKeydown} role="dialog" aria-modal="true" aria-label="Media preview" tabindex="-1">
  <div class="dc-lightbox-panel" role="dialog" aria-modal="true" aria-label="Media preview">
    <div class="dc-lightbox-header">
      <div class="dc-lightbox-title-line">
        <div>
          <div class="dc-lightbox-title">{active?.title ?? 'Preview'}</div>
          <div class="dc-lightbox-subtitle">
            {#if active}
              {formatType(active.artifact_type)} · {active.provider}
              {#if active.target_model} · {active.target_model}{/if}
            {/if}
          </div>
        </div>
        <button class="dc-lightbox-close" onclick={onClose} aria-label="Close">×</button>
      </div>
      <div style="margin-top: 8px;">
        <a
          href={`/comparisons?run=${active?.run_id}`}
          style="font-size: 11px; color: var(--dc-sora); text-decoration: none;"
          onclick={(e: MouseEvent) => { e.stopPropagation(); onClose(); }}
        >
          Open project →
        </a>
      </div>
    </div>

    <div class="dc-lightbox-body">
      <div class="dc-lightbox-stage">
        {#if active}
          {#if mediaUrl}
            {#if isVideo}
              <video
                src={mediaUrl}
                poster={active.thumbnail_url}
                playsinline
                controls
                autoplay
                style="width: 100%; max-height: 56vh; border-radius: var(--dc-radius); display: block;"

              >
                <track kind="captions" />
              </video>
            {:else}
              <img
                src={mediaUrl}
                alt={active.title}
                style="width: 100%; max-height: 56vh; object-fit: contain; border-radius: var(--dc-radius); display: block;"
              />
            {/if}
          {:else}
            <div class="dc-lightbox-no-preview">No preview available</div>
          {/if}
        {/if}
      </div>

      {#if artifacts.length > 1}
        <div class="dc-lightbox-versions">
          <span class="dc-lightbox-meta-label">Versions ({artifacts.length})</span>
          <div class="dc-lightbox-version-strip">
            {#each artifacts as artifact, i (artifact.artifact_id)}
              <button
                class="dc-lightbox-version-thumb"
                class:dc-lightbox-version-active={i === selectedIndex}
                onclick={() => selectVersion(i)}
                aria-label={`Version ${i + 1}`}
              >
                {#if artifact.thumbnail_url || artifact.media_url}
                  {#if artifact.artifact_type === 'video_result' || artifact.artifact_type === 'end_video'}
                    <video src={artifact.media_url} preload="metadata" muted playsinline aria-label={artifact.title}></video>
                  {:else}
                    <img src={artifact.thumbnail_url ?? artifact.media_url} alt={artifact.title} loading="lazy" />
                  {/if}
                {:else}
                  <div class="dc-lightbox-version-placeholder">v{i + 1}</div>
                {/if}
                {#if artifact.artifact_type === 'video_result' || artifact.artifact_type === 'end_video'}
                  <span class="dc-lightbox-version-typebadge">VIDEO</span>
                {/if}
                <span class="dc-lightbox-version-label">v{i + 1}</span>
              </button>
            {/each}
          </div>
        </div>
      {/if}

      {#if activePrompt}
        <div class="dc-lightbox-prompt">
          <div class="dc-lightbox-prompt-header">
            <span class="dc-lightbox-meta-label">Generation prompt</span>
            <div class="dc-lightbox-prompt-meta">
              {#if promptAuthor}
                <span class="dc-lightbox-prompt-author">By {promptAuthor.model_name} ({promptAuthor.agent_name})</span>
              {/if}
              <span>{activePrompt.model} · {activePrompt.provider}</span>
            </div>
          </div>
          <pre class="dc-lightbox-prompt-text" class:dc-prompt-expanded={promptExpanded}>{activePrompt.prompt_text}</pre>
          <div class="dc-lightbox-prompt-actions">
            <button class="dc-lightbox-prompt-toggle" onclick={togglePrompt}>{promptExpanded ? 'Collapse ↑' : 'Show full ↓'}</button>
            <CopyButton text={activePrompt.prompt_text} label="Copy prompt" size={12} />
          </div>
        </div>
      {:else if active?.prompt_text}
        <div class="dc-lightbox-prompt">
          <div class="dc-lightbox-prompt-header">
            <span class="dc-lightbox-meta-label">Prompt text</span>
          </div>
          <pre class="dc-lightbox-prompt-text" class:dc-prompt-expanded={promptExpanded}>{active.prompt_text}</pre>
          <div class="dc-lightbox-prompt-actions">
            <button class="dc-lightbox-prompt-toggle" onclick={togglePrompt}>{promptExpanded ? 'Collapse ↑' : 'Show full ↓'}</button>
            <CopyButton text={active.prompt_text} label="Copy prompt" size={12} />
          </div>
        </div>
      {/if}

      {#if active?.notes}
        <div class="dc-lightbox-notes">
          <span class="dc-lightbox-meta-label">Notes</span>
          <p>{active.notes}</p>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .dc-lightbox-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.85);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .dc-lightbox-panel {
    background: var(--dc-bg-elev);
    border: 1px solid var(--dc-border);
    border-radius: var(--dc-radius);
    overflow: hidden;
    min-height: 0;
    width: 100%;
    max-width: 900px;
    max-height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .dc-lightbox-header {
    padding: 16px 16px 12px;
    border-bottom: 1px solid var(--dc-border-subtle);
  }

  .dc-lightbox-title-line {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
  }

  .dc-lightbox-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--dc-text);
    margin: 0;
  }

  .dc-lightbox-subtitle {
    font-size: 12px;
    color: var(--dc-text-muted);
    margin-top: 4px;
    text-transform: capitalize;
  }

  .dc-lightbox-close {
    background: transparent;
    border: none;
    color: var(--dc-text-dim);
    font-size: 24px;
    line-height: 1;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: var(--dc-radius);
  }

  .dc-lightbox-close:hover {
    color: var(--dc-text);
    background: var(--dc-bg-elev-2);
  }

  .dc-lightbox-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
  }

  .dc-lightbox-stage {
    background: var(--dc-bg);
    border: 1px solid var(--dc-border-subtle);
    border-radius: var(--dc-radius);
    padding: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    /* Bounded, self-scrolling media viewport so tall media scrolls inside the
       stage instead of pushing the whole body. Keeps the version strip and
       prompt clearly below the video, never overlapping native controls. */
    flex: 0 0 auto;
    min-height: 120px;
    max-height: 58vh;
    overflow: auto;
    border-bottom: 1px solid var(--dc-border-subtle);
  }

  .dc-lightbox-stage :global(video),
  .dc-lightbox-stage :global(img) {
    max-width: 100%;
    max-height: calc(58vh - 24px);
  }

  .dc-lightbox-no-preview {
    color: var(--dc-text-dim);
    font-size: 14px;
  }

  .dc-lightbox-versions {
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .dc-lightbox-version-strip {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .dc-lightbox-version-thumb {
    flex: 0 0 auto;
    width: 80px;
    background: var(--dc-bg);
    border: 1px solid var(--dc-border-subtle);
    border-radius: var(--dc-radius);
    overflow: hidden;
    cursor: pointer;
    padding: 0;
    position: relative;
  }

  .dc-lightbox-version-thumb.dc-lightbox-version-active {
    border-color: var(--dc-sora);
    box-shadow: 0 0 0 2px rgba(45, 212, 191, 0.2);
  }

  .dc-lightbox-version-thumb img,
  .dc-lightbox-version-thumb video {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
  }

  .dc-lightbox-version-placeholder {
    width: 100%;
    aspect-ratio: 16 / 9;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--dc-text-dim);
    font-size: 12px;
  }

  .dc-lightbox-version-typebadge {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(45, 212, 191, 0.85);
    color: var(--dc-bg);
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 0.05em;
    padding: 1px 4px;
    border-bottom-right-radius: var(--dc-radius);
  }

  .dc-lightbox-version-label {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.6);
    color: var(--dc-text);
    font-size: 10px;
    padding: 2px 4px;
    text-align: center;
  }

  .dc-lightbox-prompt {
    background: var(--dc-bg);
    border: 1px solid var(--dc-border-subtle);
    border-radius: var(--dc-radius);
    padding: 12px;
  }

  .dc-lightbox-prompt-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;
    flex-wrap: wrap;
  }

  .dc-lightbox-prompt-meta {
    display: flex;
    gap: 12px;
    font-size: 12px;
    color: var(--dc-text-muted);
  }

  .dc-lightbox-prompt-author {
    color: var(--dc-sora);
  }

  .dc-lightbox-prompt-text {
    margin: 0;
    font-family: var(--dc-font-mono);
    font-size: 12px;
    line-height: 1.6;
    color: var(--dc-text);
    white-space: pre-wrap;
    word-break: break-word;
    /* Use a collapsible area: collapsed shows ~6 lines with a fade, expanded shows all.
       Internal scrollbar kicks in only when expanded content is very long. */
    max-height: var(--dc-prompt-collapsed, 160px);
    overflow: auto;
    transition: max-height 0.2s ease;
  }
  .dc-lightbox-prompt-text.dc-prompt-expanded {
    max-height: 420px;
  }
  .dc-lightbox-prompt-toggle {
    background: none;
    border: none;
    color: var(--dc-sora);
    font-size: 11px;
    cursor: pointer;
    padding: 4px 0 0;
    text-align: left;
  }

  .dc-lightbox-prompt-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .dc-lightbox-meta-label {
    color: var(--dc-text-dim);
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.05em;
  }

  .dc-lightbox-notes {
    font-size: 12px;
    color: var(--dc-text-muted);
    overflow-wrap: anywhere;
    word-break: break-all;
  }

  .dc-lightbox-notes p {
    margin: 6px 0 0;
    overflow-wrap: anywhere;
    word-break: break-all;
  }

  @media (max-width: 640px) {
    .dc-lightbox-backdrop {
      padding: max(10px, env(safe-area-inset-top)) max(10px, env(safe-area-inset-right)) max(10px, env(safe-area-inset-bottom)) max(10px, env(safe-area-inset-left));
      align-items: flex-end;
    }

    .dc-lightbox-panel {
      max-height: calc(100dvh - 20px);
      border-radius: var(--dc-radius) var(--dc-radius) 0 0;
    }

    .dc-lightbox-close {
      min-width: 44px;
      min-height: 44px;
    }

    .dc-lightbox-stage {
      max-height: 42vh;
    }

    .dc-lightbox-version-thumb {
      width: 68px;
    }
  }
</style>
