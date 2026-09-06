<script lang="ts">
  /** Shared 24×24 stroke icons for both nav surfaces. */
  let { name }: { name: string } = $props();
</script>

{#if name === 'create'}
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
{:else if name === 'home'}
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" /></svg>
{:else if name === 'library'}
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h6v16H5V4Zm8 0h6v16h-6V4Z" /></svg>
{:else if name === 'projects'}
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" /></svg>
{:else if name === 'techniques'}
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18V6l8-3 8 3v12l-8 3-8-3Z" /></svg>
{:else if name === 'more'}
  <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="5" cy="12" r="1.4" /><circle cx="12" cy="12" r="1.4" /><circle cx="19" cy="12" r="1.4" /></svg>
{:else}
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5h12v14H6V5Zm2 2v10h8V7H8Z" /></svg>
{/if}
