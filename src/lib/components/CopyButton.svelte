<script lang="ts">
  let { text, label = 'Copy', size = 12 }: { text: string; label?: string; size?: number } = $props();
  let copied = $state(false);

  async function copy() {
    await navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => (copied = false), 1500);
  }
</script>

<button
  onclick={copy}
  class="dc-copy"
  style:color={copied ? 'var(--dc-conf-high)' : 'var(--dc-text)'}
  style:font-size="{size}px"
>
  {copied ? 'Copied' : label}
</button>

<style>
  /* Filled, never outlined. */
  .dc-copy {
    display: inline-flex;
    align-items: center;
    min-height: 26px;
    padding: 0 10px;
    border: 0;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.1);
    font-weight: 600;
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .dc-copy:hover {
    background: rgba(255, 255, 255, 0.18);
  }
</style>
