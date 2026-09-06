<script lang="ts">
  import { page } from '$app/stores';
  import { TAB_LINKS, MORE_LINKS, isMoreActive } from '$lib/nav';
  import NavIcon from './NavIcon.svelte';

  let sheetOpen = $state(false);

  let pathname = $derived($page.url.pathname);
  let moreActive = $derived(isMoreActive(pathname));

  function closeSheet() {
    sheetOpen = false;
  }

  // Lock the page behind the sheet so only the sheet scrolls.
  $effect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = sheetOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') closeSheet();
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if sheetOpen}
  <button type="button" class="dc-sheet-scrim" aria-label="Close menu" onclick={closeSheet}></button>

  <div class="dc-sheet" role="dialog" aria-modal="true" aria-label="More destinations">
    <div class="dc-sheet-handle" aria-hidden="true"></div>
    {#each MORE_LINKS as link (link.href)}
      <a
        class="dc-sheet-item"
        href={link.href}
        aria-current={link.match(pathname) ? 'page' : undefined}
        onclick={closeSheet}
      >
        <span class="dc-sheet-icon" aria-hidden="true"><NavIcon name={link.icon} /></span>
        <span>
          <span class="dc-sheet-label">{link.label}</span>
          <span class="dc-sheet-hint">{link.hint}</span>
        </span>
        <span class="dc-sheet-chevron" aria-hidden="true">→</span>
      </a>
    {/each}
  </div>
{/if}

<nav class="dc-tabbar" aria-label="Primary">
  {#each TAB_LINKS as link (link.href)}
    <a
      class="dc-tab"
      class:dc-tab-primary={link.href === '/create'}
      href={link.href}
      aria-current={link.match(pathname) ? 'page' : undefined}
      onclick={closeSheet}
    >
      <span class="dc-tab-icon" aria-hidden="true"><NavIcon name={link.icon} /></span>
      <span>{link.short ?? link.label}</span>
    </a>
  {/each}

  <button
    type="button"
    class="dc-tab"
    class:dc-tab-open={sheetOpen || moreActive}
    aria-expanded={sheetOpen}
    aria-haspopup="dialog"
    onclick={() => (sheetOpen = !sheetOpen)}
  >
    <span class="dc-tab-icon" aria-hidden="true"><NavIcon name="more" /></span>
    <span>More</span>
  </button>
</nav>
