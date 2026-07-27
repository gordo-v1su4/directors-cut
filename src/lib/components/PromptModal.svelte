<script lang="ts">
  import type { GenerationPrompt } from '$lib/types/comparison';
  import CopyButton from './CopyButton.svelte';

  let {
    prompt,
    images = [],
    onClose,
  }: {
    prompt: GenerationPrompt | { prompt_text: string; model?: string; provider?: string; created_at?: string; slot_type?: string; notes?: string };
    images?: { url?: string; title?: string }[];
    onClose: () => void;
  } = $props();

  function handleBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="dc-modal-backdrop" onclick={handleBackdrop} onkeydown={handleKeydown} tabindex="-1" role="button" aria-label="Close prompt modal">
  <div class="dc-modal-panel" role="dialog" aria-modal="true" aria-label="Generated prompt">
    <div class="dc-modal-header">
      <div class="dc-modal-title-line">
        <h3 class="dc-modal-title">Prompt</h3>
        <button class="dc-modal-close" onclick={onClose} aria-label="Close">×</button>
      </div>
      <div class="dc-modal-meta">
        {#if prompt.model}
          <span class="dc-modal-meta-item">
            <span class="dc-modal-meta-label">Model</span>
            <span>{prompt.model}</span>
          </span>
        {/if}
        {#if prompt.provider}
          <span class="dc-modal-meta-item">
            <span class="dc-modal-meta-label">Provider</span>
            <span>{prompt.provider}</span>
          </span>
        {/if}
        {#if prompt.slot_type}
          <span class="dc-modal-meta-item">
            <span class="dc-modal-meta-label">Slot</span>
            <span>{prompt.slot_type}</span>
          </span>
        {/if}
        {#if prompt.created_at}
          <span class="dc-modal-meta-item">
            <span class="dc-modal-meta-label">Created</span>
            <span>{new Date(prompt.created_at).toLocaleString()}</span>
          </span>
        {/if}
      </div>
    </div>

    <div class="dc-modal-body">
      <div class="dc-modal-prompt-wrap">
        <pre class="dc-modal-prompt">{prompt.prompt_text}</pre>
        <div class="dc-modal-prompt-actions">
          <CopyButton text={prompt.prompt_text} label="Copy prompt" size={12} />
        </div>
      </div>

      {#if prompt.notes}
        <div class="dc-modal-notes">
          <span class="dc-modal-meta-label">Notes</span>
          <p>{prompt.notes}</p>
        </div>
      {/if}

      {#if images.length > 0}
        <div class="dc-modal-images">
          <span class="dc-modal-meta-label">Generated media</span>
          <div class="dc-modal-image-grid">
            {#each images as img (img.url)}
              {#if img.url}
                <div class="dc-modal-image-frame">
                  <img src={img.url} alt={img.title ?? 'Generated media'} loading="lazy" />
                  {#if img.title}
                    <span class="dc-modal-image-title">{img.title}</span>
                  {/if}
                </div>
              {/if}
            {/each}
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .dc-modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
  }

  .dc-modal-panel {
    background: var(--dc-bg-elev);
    border: 1px solid var(--dc-border);
    border-radius: var(--dc-radius);
    width: 100%;
    max-width: 720px;
    max-height: calc(100vh - 48px);
    display: flex;
    flex-direction: column;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .dc-modal-header {
    padding: 16px 16px 12px;
    border-bottom: 1px solid var(--dc-border-subtle);
  }

  .dc-modal-title-line {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .dc-modal-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--dc-text);
  }

  .dc-modal-close {
    background: transparent;
    border: none;
    color: var(--dc-text-dim);
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: var(--dc-radius);
  }

  .dc-modal-close:hover {
    color: var(--dc-text);
    background: var(--dc-bg-elev-2);
  }

  .dc-modal-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 12px;
    color: var(--dc-text-muted);
  }

  .dc-modal-meta-item {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  .dc-modal-meta-label {
    color: var(--dc-text-dim);
    text-transform: uppercase;
    font-size: 10px;
    letter-spacing: 0.05em;
  }

  .dc-modal-body {
    padding: 16px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .dc-modal-prompt-wrap {
    position: relative;
    background: var(--dc-bg);
    border: 1px solid var(--dc-border-subtle);
    border-radius: var(--dc-radius);
    padding: 12px;
  }

  .dc-modal-prompt {
    margin: 0;
    font-family: var(--dc-font-mono);
    font-size: 12px;
    line-height: 1.6;
    color: var(--dc-text);
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 360px;
    overflow: auto;
    padding-right: 8px;
  }

  .dc-modal-prompt-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
  }

  .dc-modal-notes {
    font-size: 12px;
    color: var(--dc-text-muted);
  }

  .dc-modal-notes p {
    margin: 6px 0 0;
  }

  .dc-modal-images {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .dc-modal-image-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 8px;
  }

  .dc-modal-image-frame {
    background: var(--dc-bg);
    border: 1px solid var(--dc-border-subtle);
    border-radius: var(--dc-radius);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .dc-modal-image-frame img {
    width: 100%;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;
  }

  .dc-modal-image-title {
    font-size: 10px;
    color: var(--dc-text-dim);
    padding: 4px 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
