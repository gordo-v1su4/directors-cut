<script lang="ts">
  let { text }: { text: string } = $props();
  const parts = $derived(text.split(/(sora(?:[ _-]*2(?:[ ._-]*pro)?)?)/gi));
</script>

{#each parts as part, index (index)}{#if index % 2}<s title="Unavailable · legacy source retained" aria-label={`${part} — unavailable, legacy`}>{part}</s>{:else}{part}{/if}{/each}

<style>
  s { text-decoration-color:#ef7373; text-decoration-thickness:2px; }
</style>
