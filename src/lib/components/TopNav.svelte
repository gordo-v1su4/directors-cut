<script lang="ts">
  import { page } from '$app/stores';
  import { NAV_LINKS } from '$lib/nav';

  let pathname = $derived($page.url.pathname);

  /** Section name shown beside the brand on small screens. */
  let sectionLabel = $derived(
    NAV_LINKS.find((link) => link.match(pathname))?.label ?? '',
  );
</script>

<nav class="dc-top-nav" aria-label="Main">
  <div class="dc-top-nav-bar">
    <a class="dc-brand" href="/">
      <span class="dc-brand-mark">DC</span>
      <span class="dc-brand-text">Directors Cut</span>
    </a>

    {#if sectionLabel}
      <span class="dc-section-crumb" aria-hidden="true">{sectionLabel}</span>
    {/if}

    <div class="dc-nav-links">
      {#each NAV_LINKS as link, index (link.href)}
        <a
          href={link.href}
          class:active={link.match(pathname)}
          class:featured={link.href === '/create'}
          aria-current={link.match(pathname) ? 'page' : undefined}
        >
          <span class="dc-nav-index">0{index + 1}</span>
          {link.label}
        </a>
      {/each}
    </div>
  </div>
</nav>

<style>
  .dc-top-nav {
    position: relative;
    z-index: 50;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(9, 9, 11, 0.82);
    backdrop-filter: blur(16px) saturate(1.1);
    -webkit-backdrop-filter: blur(16px) saturate(1.1);
    padding-top: var(--dc-safe-t);
  }

  .dc-top-nav-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: var(--dc-nav-height);
    padding: 0 max(16px, var(--dc-safe-r)) 0 max(16px, var(--dc-safe-l));
  }

  .dc-brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--dc-text);
    text-decoration: none;
    min-width: 0;
  }

  .dc-brand-mark {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: var(--dc-radius);
    background: rgba(255, 255, 255, 0.04);
    color: var(--dc-text);
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  .dc-brand-text {
    font-size: 15px;
    font-weight: 750;
    letter-spacing: -0.02em;
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
    color: var(--dc-text-dim);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-overflow: ellipsis;
    text-transform: uppercase;
    white-space: nowrap;
  }

  .dc-nav-links {
    display: none;
  }

  @media (min-width: 861px) {
    .dc-top-nav {
      position: sticky;
      top: 0;
    }

    .dc-section-crumb {
      display: none;
    }

    .dc-nav-links {
      display: flex;
      align-items: stretch;
      gap: 2px;
      margin-left: auto;
    }

    .dc-nav-links a {
      display: flex;
      align-items: center;
      gap: 7px;
      min-height: 36px;
      padding: 0 12px;
      border-bottom: 2px solid transparent;
      color: var(--dc-text-dim);
      font-size: 12px;
      text-decoration: none;
      transition: color 0.15s ease, border-color 0.15s ease;
      white-space: nowrap;
    }

    .dc-nav-index {
      color: var(--dc-text-dim);
      font: 9px var(--dc-font-mono);
      letter-spacing: .06em;
    }

    .dc-nav-links a:hover {
      color: var(--dc-text-muted);
    }

    .dc-nav-links a.active {
      border-bottom-color: var(--dc-text);
      color: var(--dc-text);
    }

    .dc-nav-links a.featured {
      color: var(--dc-text);
      font-weight: 600;
    }
  }
</style>
