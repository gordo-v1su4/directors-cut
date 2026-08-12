<script lang="ts">
  import { page } from '$app/stores';
</script>

<nav class="dc-top-nav">
  <a class="dc-brand" href="/">Directors Cut</a>
  <div class="dc-nav-links">
    <a href="/create" class:active={$page.url.pathname.startsWith('/create')}><span class="dc-nav-plus">+</span> Create</a>
    <a href="/" class:active={$page.url.pathname === '/'}>Home</a>
    <a href="/prompts" class:active={$page.url.pathname.startsWith('/prompts')}>Library</a>
    <a href="/comparisons" class:active={$page.url.pathname.startsWith('/comparisons')}>Projects</a>
    <a href="/pilots/camera-moves" class:active={$page.url.pathname.startsWith('/pilots/camera-moves')}>Techniques</a>
    <a href="/sources" class:active={$page.url.pathname === '/sources'}>Sources</a>
  </div>
</nav>

<style>
  .dc-top-nav { display: flex; align-items: center; gap: 26px; height: 42px; padding: 0 16px; border-bottom: 1px solid var(--dc-border); background: rgba(17,17,19,.96); }
  .dc-brand { color: var(--dc-text); font-size: 13px; font-weight: 750; letter-spacing: -.02em; text-decoration: none; }
  .dc-nav-links { display: flex; align-items: stretch; align-self: stretch; gap: 4px; }
  .dc-nav-links a { display: flex; align-items: center; gap: 5px; padding: 0 10px; border-bottom: 1px solid transparent; color: var(--dc-text-dim); font-size: 11px; text-decoration: none; transition: color .15s ease, border-color .15s ease; }
  .dc-nav-links a:hover { color: var(--dc-text-muted); }
  .dc-nav-links a.active { border-bottom-color: var(--dc-text); color: var(--dc-text); }
  .dc-nav-links a:first-child { margin-right: 6px; color: var(--dc-text); }
  .dc-nav-plus { font-size: 15px; font-weight: 400; line-height: 1; }
</style>
