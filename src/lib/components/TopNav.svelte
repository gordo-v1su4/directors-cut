<script lang="ts">
  import { page } from '$app/stores';

  let menuOpen = $state(false);

  const links = [
    {
      href: '/create',
      label: 'Create',
      hint: 'Start a new prompt project',
      featured: true,
      match: (p: string) => p.startsWith('/create'),
      icon: 'create',
    },
    {
      href: '/',
      label: 'Home',
      hint: 'Dashboard and latest media',
      match: (p: string) => p === '/',
      icon: 'home',
    },
    {
      href: '/prompts',
      label: 'Library',
      hint: 'Browse prompt cards',
      match: (p: string) => p.startsWith('/prompts'),
      icon: 'library',
    },
    {
      href: '/comparisons',
      label: 'Projects',
      hint: 'Compare runs and outputs',
      match: (p: string) => p.startsWith('/comparisons'),
      icon: 'projects',
    },
    {
      href: '/pilots/camera-moves',
      label: 'Techniques',
      hint: 'Camera moves and shots',
      match: (p: string) => p.startsWith('/pilots/camera-moves'),
      icon: 'techniques',
    },
    {
      href: '/sources',
      label: 'Sources',
      hint: 'Reference repos and links',
      match: (p: string) => p === '/sources',
      icon: 'sources',
    },
  ] as const;

  function closeMenu() {
    menuOpen = false;
  }

  function toggleMenu() {
    menuOpen = !menuOpen;
  }

  $effect(() => {
    if (typeof document === 'undefined') return;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  });
</script>

<nav class="dc-top-nav" aria-label="Main">
  <div class="dc-top-nav-bar">
    <a class="dc-brand" href="/" onclick={closeMenu}>
      <span class="dc-brand-mark">DC</span>
      <span class="dc-brand-text">Directors Cut</span>
    </a>

    <div class="dc-nav-links">
      {#each links as link}
        <a
          href={link.href}
          class:active={link.match($page.url.pathname)}
          class:featured={'featured' in link}
        >
          {link.label}
        </a>
      {/each}
    </div>

    <button
      type="button"
      class="dc-nav-toggle"
      aria-expanded={menuOpen}
      aria-controls="dc-mobile-drawer"
      onclick={toggleMenu}
    >
      <span class="sr-only">{menuOpen ? 'Close menu' : 'Open menu'}</span>
      <span class="dc-nav-toggle-icon" class:open={menuOpen}></span>
    </button>
  </div>

  {#if menuOpen}
    <button type="button" class="dc-nav-scrim" aria-label="Close menu" onclick={closeMenu}></button>

    <aside id="dc-mobile-drawer" class="dc-mobile-drawer open" aria-label="Mobile navigation">
      <div class="dc-mobile-drawer-glow" aria-hidden="true"></div>

      <header class="dc-mobile-drawer-header">
        <div>
          <p class="dc-mobile-drawer-kicker">Navigate</p>
          <p class="dc-mobile-drawer-title">Directors Cut</p>
        </div>
        <button type="button" class="dc-mobile-drawer-close" aria-label="Close menu" onclick={closeMenu}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
      </header>

      <div class="dc-mobile-drawer-links">
        {#each links as link, i}
          <a
            href={link.href}
            class="dc-mobile-nav-item"
            class:active={link.match($page.url.pathname)}
            class:featured={'featured' in link}
            style={`--delay: ${i * 45}ms`}
            onclick={closeMenu}
          >
            <span class="dc-mobile-nav-icon" aria-hidden="true">
              {#if link.icon === 'create'}
                <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
              {:else if link.icon === 'home'}
                <svg viewBox="0 0 24 24"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" /></svg>
              {:else if link.icon === 'library'}
                <svg viewBox="0 0 24 24"><path d="M5 4h6v16H5V4Zm8 0h6v16h-6V4Z" /></svg>
              {:else if link.icon === 'projects'}
                <svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
              {:else if link.icon === 'techniques'}
                <svg viewBox="0 0 24 24"><path d="M4 18V6l8-3 8 3v12l-8 3-8-3Z" /></svg>
              {:else}
                <svg viewBox="0 0 24 24"><path d="M6 5h12v14H6V5Zm2 2v10h8V7H8Z" /></svg>
              {/if}
            </span>
            <span class="dc-mobile-nav-copy">
              <span class="dc-mobile-nav-label">{link.label}</span>
              <span class="dc-mobile-nav-hint">{link.hint}</span>
            </span>
            <span class="dc-mobile-nav-chevron" aria-hidden="true">→</span>
          </a>
        {/each}
      </div>

      <footer class="dc-mobile-drawer-footer">
        <span>Prompt research · model comparisons · generated media</span>
      </footer>
    </aside>
  {/if}
</nav>

<style>
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .dc-top-nav {
    position: relative;
    z-index: 50;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(9, 9, 11, 0.82);
    backdrop-filter: blur(16px) saturate(1.1);
    -webkit-backdrop-filter: blur(16px) saturate(1.1);
  }

  .dc-top-nav-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: var(--dc-nav-height);
    padding: 0 max(16px, env(safe-area-inset-right)) 0 max(16px, env(safe-area-inset-left));
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
    font-size: 14px;
    font-weight: 750;
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  .dc-nav-links {
    display: flex;
    align-items: stretch;
    gap: 2px;
  }

  .dc-nav-links a {
    display: flex;
    align-items: center;
    min-height: 36px;
    padding: 0 12px;
    border-bottom: 2px solid transparent;
    color: var(--dc-text-dim);
    font-size: 12px;
    text-decoration: none;
    transition: color 0.15s ease, border-color 0.15s ease;
    white-space: nowrap;
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

  .dc-nav-toggle,
  .dc-nav-scrim,
  .dc-mobile-drawer {
    display: none;
  }

  .dc-nav-toggle {
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: var(--dc-radius);
    background: rgba(255, 255, 255, 0.03);
    color: var(--dc-text);
    cursor: pointer;
  }

  .dc-nav-toggle-icon,
  .dc-nav-toggle-icon::before,
  .dc-nav-toggle-icon::after {
    display: block;
    width: 15px;
    height: 1.5px;
    background: currentColor;
    transition: transform 0.22s ease, opacity 0.22s ease;
  }

  .dc-nav-toggle-icon {
    position: relative;
  }

  .dc-nav-toggle-icon::before,
  .dc-nav-toggle-icon::after {
    content: '';
    position: absolute;
    left: 0;
  }

  .dc-nav-toggle-icon::before {
    top: -5px;
  }

  .dc-nav-toggle-icon::after {
    top: 5px;
  }

  .dc-nav-toggle-icon.open {
    background: transparent;
  }

  .dc-nav-toggle-icon.open::before {
    top: 0;
    transform: rotate(45deg);
  }

  .dc-nav-toggle-icon.open::after {
    top: 0;
    transform: rotate(-45deg);
  }

  @media (max-width: 860px) {
    .dc-nav-links {
      display: none;
    }

    .dc-nav-toggle {
      display: inline-flex;
    }

    .dc-nav-scrim {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 55;
      border: 0;
      background: rgba(0, 0, 0, 0.22);
      backdrop-filter: blur(1px);
      -webkit-backdrop-filter: blur(1px);
      animation: scrim-in 0.28s ease;
      cursor: pointer;
    }

    .dc-mobile-drawer {
      display: flex;
      flex-direction: column;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 60;
      width: 50vw;
      max-width: 100%;
      padding-top: env(safe-area-inset-top);
      padding-bottom: env(safe-area-inset-bottom);
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(9, 9, 11, 0.52);
      backdrop-filter: blur(20px) saturate(1.1);
      -webkit-backdrop-filter: blur(20px) saturate(1.1);
      box-shadow: 12px 0 40px rgba(0, 0, 0, 0.18);
      animation: drawer-in 0.32s cubic-bezier(0.22, 1, 0.36, 1);
      overflow: hidden;
    }

    .dc-mobile-drawer-glow {
      position: absolute;
      top: -20%;
      left: -30%;
      width: 180px;
      height: 180px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.08), transparent 70%);
      pointer-events: none;
    }

    .dc-mobile-drawer-header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 18px 16px 14px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .dc-mobile-drawer-kicker {
      margin: 0;
      color: var(--dc-text-dim);
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .dc-mobile-drawer-title {
      margin: 4px 0 0;
      color: var(--dc-text);
      font-size: 15px;
      font-weight: 650;
      letter-spacing: -0.02em;
    }

    .dc-mobile-drawer-close {
      display: grid;
      place-items: center;
      width: 36px;
      height: 36px;
      padding: 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--dc-radius);
      background: rgba(255, 255, 255, 0.04);
      color: var(--dc-text-muted);
      cursor: pointer;
    }

    .dc-mobile-drawer-close svg {
      width: 14px;
      height: 14px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.8;
      stroke-linecap: round;
    }

    .dc-mobile-drawer-links {
      position: relative;
      flex: 1;
      overflow-y: auto;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .dc-mobile-nav-item {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 12px;
      min-height: 56px;
      padding: 10px 16px;
      border: 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 0;
      background: transparent;
      color: inherit;
      text-decoration: none;
      opacity: 0;
      transform: translateX(-16px);
      animation: item-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      animation-delay: var(--delay, 0ms);
      transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
    }

    .dc-mobile-nav-item:active {
      transform: translateX(-2px) scale(0.99);
    }

    .dc-mobile-nav-item.active {
      background: rgba(255, 255, 255, 0.05);
      box-shadow: inset 3px 0 0 #fafafa;
    }

    .dc-mobile-nav-item.featured {
      background: rgba(255, 255, 255, 0.04);
    }

    .dc-mobile-nav-icon {
      display: grid;
      place-items: center;
      width: 32px;
      height: 32px;
      border-radius: var(--dc-radius);
      background: rgba(0, 0, 0, 0.22);
      border: 1px solid rgba(255, 255, 255, 0.06);
      color: var(--dc-text);
    }

    .dc-mobile-nav-icon svg {
      width: 16px;
      height: 16px;
      fill: none;
      stroke: currentColor;
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-linejoin: round;
    }

    .dc-mobile-nav-copy {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
    }

    .dc-mobile-nav-label {
      color: var(--dc-text);
      font-size: 14px;
      font-weight: 650;
      letter-spacing: -0.01em;
    }

    .dc-mobile-nav-hint {
      color: var(--dc-text-dim);
      font-size: 11px;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dc-mobile-nav-chevron {
      color: var(--dc-text-dim);
      font-size: 14px;
      opacity: 0.7;
    }

    .dc-mobile-drawer-footer {
      padding: 14px 16px 18px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      color: var(--dc-text-dim);
      font-size: 10px;
      line-height: 1.45;
    }
  }

  @keyframes scrim-in {
    from {
      opacity: 0;
    }
  }

  @keyframes drawer-in {
    from {
      transform: translateX(-100%);
    }
  }

  @keyframes item-in {
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
