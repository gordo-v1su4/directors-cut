<script lang="ts">
  import { page } from '$app/stores';
  import { NAV_LINKS } from '$lib/nav';

  let pathname = $derived($page.url.pathname);

  /** Section name shown beside the brand on small screens. */
  let sectionLabel = $derived(
    NAV_LINKS.find((link) => link.match(pathname))?.label ?? '',
  );

  const browseLinks = NAV_LINKS.filter((link) => link.href !== '/create');
  const createLink = NAV_LINKS.find((link) => link.href === '/create');
</script>

<nav class="dc-top-nav" aria-label="Main">
  <div class="dc-top-nav-bar">
    <a class="dc-brand" href="/">Directors Cut</a>

    {#if sectionLabel}
      <span class="dc-section-crumb" aria-hidden="true">{sectionLabel}</span>
    {/if}

    <div class="dc-nav-links">
      {#each browseLinks as link (link.href)}
        <a
          href={link.href}
          class:active={link.match(pathname)}
          aria-current={link.match(pathname) ? 'page' : undefined}
        >
          {link.label}
        </a>
      {/each}
    </div>

    {#if createLink}
      <a
        class="dc-nav-create"
        href={createLink.href}
        aria-current={createLink.match(pathname) ? 'page' : undefined}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        New project
      </a>
    {/if}
  </div>
</nav>

<style>
  .dc-top-nav {
    position: relative;
    z-index: 50;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(0, 0, 0, 0.88);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    padding-top: var(--dc-safe-t);
  }

  .dc-top-nav-bar {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: var(--dc-nav-height);
    max-width: calc(var(--dc-page-max) + 2 * var(--dc-gutter-x));
    margin: 0 auto;
    padding: 0 max(var(--dc-gutter-x), var(--dc-safe-r)) 0 max(var(--dc-gutter-x), var(--dc-safe-l));
  }

  .dc-brand {
    color: var(--dc-text);
    font: 400 22px / 1 var(--dc-font-serif);
    letter-spacing: -0.005em;
    text-decoration: none;
    white-space: nowrap;
  }

  /*
   * Mobile: the bottom tab bar owns navigation, so the top bar is reduced to
   * identity plus the current section. It scrolls away with the page, which
   * hands the full viewport back to the video.
   */
  .dc-section-crumb {
    margin-left: auto;
    overflow: hidden;
    color: var(--dc-text-muted);
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dc-nav-links,
  .dc-nav-create {
    display: none;
  }

  @media (min-width: 861px) {
    .dc-section-crumb {
      display: none;
    }

    .dc-nav-links {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 28px;
    }

    .dc-nav-links a {
      display: inline-flex;
      align-items: center;
      min-height: 36px;
      padding: 0 12px;
      color: var(--dc-text-muted);
      font-size: 13px;
      text-decoration: none;
      transition: color 0.15s ease;
      white-space: nowrap;
    }

    .dc-nav-links a:hover {
      color: var(--dc-text);
    }

    .dc-nav-links a.active {
      color: var(--dc-text);
      font-weight: 600;
    }

    .dc-nav-create {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      min-height: 28px;
      margin-left: auto;
      padding: 0 14px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.7);
      color: #000;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      white-space: nowrap;
      transition: background 0.15s ease;
    }

    .dc-nav-create:hover {
      background: rgba(255, 255, 255, 0.8);
    }

    .dc-nav-create svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
    }

    .dc-brand:focus-visible,
    .dc-nav-links a:focus-visible,
    .dc-nav-create:focus-visible {
      outline: 2px solid var(--dc-text);
      outline-offset: 3px;
    }
  }
</style>
