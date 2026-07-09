<script lang="ts">
  import { page } from '$app/stores';
</script>

<nav
  style:display="flex"
  style:align-items="center"
  style:gap="16px"
  style:padding="8px 16px"
  style:border-bottom="1px solid var(--dc-border)"
  style:background="var(--dc-bg-elev)"
>
  <span style:font-weight="700; font-size: 14px; color: var(--dc-sora);">Directors Cut</span>
  <a href="/" class:active={$page.url.pathname === '/'} style="font-size: 12px; color: var(--dc-text-muted); text-decoration: none;">Dashboard</a>
  <a href="/prompts" class:active={$page.url.pathname.startsWith('/prompts')} style="font-size: 12px; color: var(--dc-text-muted); text-decoration: none;">Prompts</a>
  <a href="/comparisons" class:active={$page.url.pathname.startsWith('/comparisons')} style="font-size: 12px; color: var(--dc-text-muted); text-decoration: none;">Comparisons</a>
  <a href="/sources" class:active={$page.url.pathname === '/sources'} style="font-size: 12px; color: var(--dc-text-muted); text-decoration: none;">Sources</a>
</nav>