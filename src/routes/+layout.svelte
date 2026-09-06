<script lang="ts">
  import '../app.css';
  import TopNav from '$lib/components/TopNav.svelte';
  import MobileTabBar from '$lib/components/MobileTabBar.svelte';

  let { children } = $props();
</script>

<TopNav />
<main class="dc-app-main">
  {@render children?.()}
</main>
<MobileTabBar />
