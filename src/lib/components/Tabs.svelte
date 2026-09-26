<script lang="ts" generics="T extends string">
  let { id, label, items, value = $bindable() }: {
    id: string;
    label: string;
    items: { value: T; label: string }[];
    value: T;
  } = $props();

  function navigate(event: KeyboardEvent) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const current = items.findIndex(item => item.value === value);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
      : (current + (event.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
    value = items[next].value;
    document.getElementById(`${id}-${value}-tab`)?.focus();
  }
</script>

<div class="tabs" role="tablist" aria-label={label}>
  {#each items as item (item.value)}
    <button type="button" id={`${id}-${item.value}-tab`} role="tab"
      aria-selected={value === item.value} aria-controls={`${id}-${item.value}-panel`}
      tabindex={value === item.value ? 0 : -1} onclick={() => value = item.value} onkeydown={navigate}>
      {item.label}
    </button>
  {/each}
</div>

<style>
  .tabs { display:flex; gap:2px; margin-bottom:12px; overflow-x:auto; scrollbar-width:none; }
  button { flex-shrink:0; height:28px; padding:0 12px; border:0; border-radius:4px; background:transparent; color:var(--dc-text-muted); font:13px var(--dc-font-sans); cursor:pointer; transition:background 150ms ease,color 150ms ease; }
  button:hover { background:#0e0e0e; color:var(--dc-text); }
  button[aria-selected='true'] { background:#1f1f1f; color:var(--dc-text); }
  button:focus-visible { outline:2px solid var(--dc-text); outline-offset:-2px; }
  @media(prefers-reduced-motion:reduce) { button { transition:none; } }
</style>
