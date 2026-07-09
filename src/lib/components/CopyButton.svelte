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
  class="dc-badge"
  style:color={copied ? 'var(--dc-conf-high)' : 'var(--dc-text-muted)'}
  style:border-color="var(--dc-border)"
  style:font-size="{size}px"
>
  {copied ? 'Copied' : label}
</button>