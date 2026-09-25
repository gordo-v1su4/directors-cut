<script lang="ts" generics="T extends string | number">
  /**
   * Dark dropdown that replaces the native <select>, whose option list the OS
   * draws in white with a blue highlight. Keyboard: arrows move, Enter or
   * Space picks, Escape closes. Clicking outside closes it.
   */
  let {
    value = $bindable(),
    options,
    label,
    onchange,
  }: {
    value: T;
    options: { value: T; label: string }[];
    label: string;
    onchange?: (value: T) => void;
  } = $props();

  let open = $state(false);
  let highlighted = $state(0);
  let root = $state<HTMLDivElement | null>(null);
  const id = `select-${Math.random().toString(36).slice(2, 9)}`;

  const current = $derived(options.find((o) => o.value === value) ?? options[0]);

  function show() {
    highlighted = Math.max(0, options.findIndex((o) => o.value === value));
    open = true;
  }

  function pick(index: number) {
    const option = options[index];
    if (!option) return;
    value = option.value;
    onchange?.(option.value);
    open = false;
  }

  function onkeydown(event: KeyboardEvent) {
    if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      event.preventDefault();
      show();
      return;
    }
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      open = false;
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      highlighted = (highlighted + 1) % options.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      highlighted = (highlighted - 1 + options.length) % options.length;
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      pick(highlighted);
    } else if (event.key === 'Tab') {
      open = false;
    }
  }

  function onWindowPointer(event: PointerEvent) {
    if (open && root && !root.contains(event.target as Node)) open = false;
  }
</script>

<svelte:window onpointerdown={onWindowPointer} />

<div class="dc-select" bind:this={root}>
  <button
    type="button"
    class="dc-select-trigger"
    aria-haspopup="listbox"
    aria-expanded={open}
    aria-controls={id}
    aria-label={`${label}: ${current?.label ?? ''}`}
    onclick={() => (open ? (open = false) : show())}
    {onkeydown}
  >
    <span>{current?.label}</span>
    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" /></svg>
  </button>

  {#if open}
    <ul class="dc-select-list" role="listbox" {id} aria-label={label}>
      {#each options as option, i (option.value)}
        <li
          role="option"
          aria-selected={option.value === value}
          class:highlighted={i === highlighted}
          onpointerenter={() => (highlighted = i)}
          onpointerdown={(e) => { e.preventDefault(); pick(i); }}
        >
          {option.label}
          {#if option.value === value}
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12 5 5 9-10" /></svg>
          {/if}
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
  .dc-select {
    position: relative;
    display: inline-block;
    min-width: 0;
  }

  .dc-select-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    width: 100%;
    height: 28px;
    padding: 0 10px 0 12px;
    border: 0;
    border-radius: 4px;
    background: #141414;
    color: var(--dc-text);
    font: 500 13px var(--dc-font-sans);
    white-space: nowrap;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .dc-select-trigger span {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dc-select-trigger:hover,
  .dc-select-trigger[aria-expanded='true'] {
    background: #1f1f1f;
  }

  svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .dc-select-trigger svg {
    color: var(--dc-text-muted);
  }

  .dc-select-list {
    position: absolute;
    z-index: 60;
    top: calc(100% + 6px);
    left: 0;
    min-width: 100%;
    margin: 0;
    padding: 6px;
    list-style: none;
    border-radius: 8px;
    background: rgba(24, 24, 24, 0.82);
    backdrop-filter: blur(24px) saturate(1.2);
    -webkit-backdrop-filter: blur(24px) saturate(1.2);
    box-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);
  }

  li {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 8px 10px;
    border-radius: 4px;
    color: var(--dc-text-muted);
    font-size: 13px;
    white-space: nowrap;
    cursor: pointer;
  }

  li.highlighted {
    background: rgba(255, 255, 255, 0.1);
    color: var(--dc-text);
  }

  li[aria-selected='true'] {
    color: var(--dc-text);
    font-weight: 600;
  }
</style>
