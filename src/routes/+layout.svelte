<script lang="ts">
  import '../app.css';
  import TopNav from '$lib/components/TopNav.svelte';

  let { children } = $props();
</script>

<TopNav />
<main style="height: calc(100vh - 41px); overflow: hidden;">
  {@render children?.()}
</main>