<script lang="ts">
  import type { ComparisonArtifact, GenerationPrompt, ModelAnswer } from '$lib/types/comparison';
  import { resolve } from '$app/paths';
  import VersionDetails from './VersionDetails.svelte';
  import { videoModel } from '$lib/data/version-context';
  import { showTitle } from '$lib/data/titles';

  let {
    artifacts,
    activeIndex = $bindable(0),
    promptsMap = new Map(),
    answersMap = new Map(),
    onClose,
    showDetails = true,
  }: {
    artifacts: ComparisonArtifact[];
    activeIndex?: number;
    promptsMap?: Map<string, GenerationPrompt>;
    answersMap?: Map<string, ModelAnswer>;
    onClose: () => void;
    /** Prompt and shot grid under the video; Projects shows them, Home does not. */
    showDetails?: boolean;
  } = $props();

  let active = $derived(artifacts[activeIndex] ?? null);
  let isVideo = $derived(active?.artifact_type === 'video_result' || active?.artifact_type === 'end_video');
  let mediaUrl = $derived(active?.media_url ?? active?.thumbnail_url);
  function selectVersion(index: number) {
    activeIndex = index;
  }

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLElement && ['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
    e.stopPropagation();
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft') activeIndex = Math.max(0, activeIndex - 1);
    if (e.key === 'ArrowRight') activeIndex = Math.min(artifacts.length - 1, activeIndex + 1);
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
          <div class="dc-lightbox-title" title={active?.title}>{active ? `${showTitle(active.title)} · v${active.version_number ?? activeIndex + 1}` : 'Preview'}</div>
          <div class="dc-lightbox-subtitle">
            {#if active}
              {isVideo ? videoModel(active) : formatType(active.artifact_type)}
            {/if}
          </div>
        </div>
        <button class="dc-lightbox-close" onclick={onClose} aria-label="Close">×</button>
      </div>
      <div style="margin-top: 8px;">
        <a
          href={`${resolve('/comparisons')}?run=${active?.run_id}`}
          class="dc-lightbox-open"
          onclick={(e: MouseEvent) => { e.stopPropagation(); onClose(); }}
        >
          Open project
        </a>
      </div>
    </div>

    <div class="dc-lightbox-body">
      <div class="dc-lightbox-stage">
        {#if active}
          {#if mediaUrl}
            {#if isVideo}
              <video
                class="dc-lightbox-media"
                src={mediaUrl}
                poster={active.thumbnail_url}
                playsinline
                controls
                autoplay
              >
                <track kind="captions" />
              </video>
            {:else}
              <img class="dc-lightbox-media" src={mediaUrl} alt={active.title} />
            {/if}
          {:else}
            <div class="dc-lightbox-no-preview">No preview available</div>
          {/if}
        {/if}
      </div>

      {#if artifacts.length > 1}
        <div class="dc-lightbox-versions">
          <span class="dc-lightbox-meta-label">Versions</span>
          <div class="dc-lightbox-version-strip">
            {#each artifacts as artifact, i (artifact.artifact_id)}
              <button
                class="dc-lightbox-version-thumb"
                class:dc-lightbox-version-active={i === activeIndex}
                onclick={() => selectVersion(i)}
                aria-label={`Version ${i + 1}`}
              >
                {#if artifact.thumbnail_url}
                  <img src={artifact.thumbnail_url} alt={artifact.title} loading="lazy" />
                {:else if artifact.media_url && (artifact.artifact_type === 'video_result' || artifact.artifact_type === 'end_video')}
                  <video src={`${artifact.media_url}#t=0.5`} preload="metadata" muted playsinline aria-label={artifact.title}></video>
                {:else if artifact.media_url}
                  <img src={artifact.media_url} alt={artifact.title} loading="lazy" />
                {:else}
                  <div class="dc-lightbox-version-placeholder">v{i + 1}</div>
                {/if}
                <span class="dc-lightbox-version-label">v{artifact.version_number ?? i + 1}</span>
              </button>
            {/each}
          </div>
        </div>
      {/if}

      {#if active && isVideo && showDetails}
        {#key active.artifact_id}<VersionDetails artifact={active} {promptsMap} editable={false} />{/key}
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
    max-width: 1120px;
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
    background: #000;
    border: 1px solid var(--dc-border-subtle);
    border-radius: var(--dc-radius);
    flex: 0 0 auto;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-bottom: 1px solid var(--dc-border-subtle);
  }

  .dc-lightbox-media {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    background: #000;
  }

  .dc-lightbox-no-preview {
    display: grid;
    place-items: center;
    width: 100%;
    height: 100%;
    min-height: 120px;
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
    width: 160px;
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
    object-fit: contain;
    display: block;
    background: #000;
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

  .dc-lightbox-version-label {
    /* A small corner chip, not a bar across the frame. */
    position: absolute;
    bottom: 5px;
    left: 5px;
    border-radius: 3px;
    background: rgba(0, 0, 0, 0.45);
    color: rgba(255, 255, 255, 0.8);
    font-size: 11px;
    font-weight: 600;
    padding: 1px 6px;
    text-align: center;
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
      width: 96px;
    }
  }

  /* Glass skin: translucent panel, no rules, no outlined thumbnails. */
  /* The page behind freezes and blurs; the panel stays clear so it shows through. */
  .dc-lightbox-backdrop {
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(16px) saturate(1.1);
    -webkit-backdrop-filter: blur(16px) saturate(1.1);
  }

  .dc-lightbox-panel {
    border: 0;
    border-radius: 12px;
    background: rgba(12, 12, 12, 0.55);
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.45);
  }

  .dc-lightbox-header,
  .dc-lightbox-stage {
    border: 0;
  }

  .dc-lightbox-stage {
    overflow: hidden;
    border-radius: 8px;
  }

  .dc-lightbox-title-line > div {
    min-width: 0;
  }

  .dc-lightbox-title {
    overflow: hidden;
    font: 400 24px / 1.15 var(--dc-font-serif);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dc-lightbox-close {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    color: var(--dc-text);
    font-size: 18px;
  }

  .dc-lightbox-open {
    display: inline-flex;
    align-items: center;
    min-height: 28px;
    padding: 0 12px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    color: var(--dc-text);
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
  }

  .dc-lightbox-open:hover {
    background: rgba(255, 255, 255, 0.18);
  }

  .dc-lightbox-version-thumb {
    border: 0;
    border-radius: 4px;
    opacity: 0.95;
    transition: opacity 0.15s ease;
  }

  .dc-lightbox-version-thumb:hover,
  .dc-lightbox-version-thumb.dc-lightbox-version-active {
    opacity: 1;
  }

  .dc-lightbox-version-thumb.dc-lightbox-version-active {
    box-shadow: inset 0 -3px 0 rgba(255, 255, 255, 0.7);
  }

  .dc-lightbox-meta-label {
    font-size: 13px;
    font-weight: 600;
    color: var(--dc-text);
    letter-spacing: 0;
    text-transform: none;
  }

  /* Whites a step down inside the player. */
  .dc-lightbox-panel {
    color: #d6d3d1;
  }

  .dc-lightbox-title,
  .dc-lightbox-meta-label,
  .dc-lightbox-open,
  .dc-lightbox-close {
    color: #d6d3d1;
  }
</style>
