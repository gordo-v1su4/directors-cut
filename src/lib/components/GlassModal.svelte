<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
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

  let dialog = $state<HTMLDivElement | null>(null);

  const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function focusables() {
    return dialog ? [...dialog.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null) : [];
  }

  function keydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onclose();
      return;
    }
    // Keep Tab inside the dialog while it is open.
    if (event.key === 'Tab' && dialog) {
      const items = focusables();
      if (!items.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !dialog.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  // Move focus in on open, and hand it back to the opener on close.
  onMount(() => {
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const target = focusables().find((el) => !el.matches('[aria-label="Close"]')) ?? dialog;
    target?.focus();
    return () => opener?.focus();
  });

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
  <div bind:this={dialog} class="modal glass-modal" role="dialog" aria-modal="true" aria-label={fullTitle} tabindex="-1" style:max-width="{width}px">
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

  .modal:focus {
    outline: none;
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
