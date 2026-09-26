<script lang="ts">
  import type { Snippet } from 'svelte';
  import Icon from './Icon.svelte';

  let {
    title,
    fullTitle = title,
    width = 600,
    onclose,
    children,
  }: {
    title: string;
    fullTitle?: string;
    width?: number;
    onclose: () => void;
    children: Snippet;
  } = $props();

  function keydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onclose();
    }
  }

  // Hold the page still underneath.
  $effect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  });
</script>

<svelte:window onkeydown={keydown} />

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
<div class="backdrop" onclick={(e) => e.target === e.currentTarget && onclose()}>
  <div class="modal glass-modal" role="dialog" aria-modal="true" aria-label={fullTitle} style:max-width="{width}px">
    <div class="head">
      <h2 class="t-section" title={fullTitle}>{title}</h2>
      <button type="button" class="sbtn sbtn-icon" onclick={onclose} aria-label="Close">
        <Icon name="x" size={16} />
      </button>
    </div>
    {@render children()}
  </div>
</div>

<style>
  .backdrop {
    position: fixed;
    z-index: 90;
    inset: 0;
    display: grid;
    place-items: center;
    padding: 16px;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  .modal {
    box-sizing: border-box;
    width: 100%;
    max-height: calc(100dvh - 32px);
    padding: 22px 24px 24px;
    overflow-y: auto;
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8);
  }

  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-bottom: 16px;
  }

  @media (max-width: 560px) {
    .modal {
      padding: 16px;
    }
  }
</style>
