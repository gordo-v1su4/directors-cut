<script lang="ts">
  /** Stroke icons (lucide geometry) used across the studio kit. */
  let { name, size = 14, filled = false }: { name: string; size?: number; filled?: boolean } = $props();
</script>

<svg
  viewBox="0 0 24 24"
  width={size}
  height={size}
  aria-hidden="true"
  fill={filled ? 'currentColor' : 'none'}
  stroke="currentColor"
  stroke-width="1.9"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  {#if name === 'play'}
    <path d="M7 4.5v15l12-7.5z" />
  {:else if name === 'pause'}
    <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" />
  {:else if name === 'volume'}
    <path d="M11 5 6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
  {:else if name === 'mute'}
    <path d="M11 5 6 9H3v6h3l5 4z" /><path d="m22 9-6 6M16 9l6 6" />
  {:else if name === 'left'}
    <path d="m15 18-6-6 6-6" />
  {:else if name === 'right'}
    <path d="m9 18 6-6-6-6" />
  {:else if name === 'down'}
    <path d="m6 9 6 6 6-6" />
  {:else if name === 'up-right'}
    <path d="M7 17 17 7M8 7h9v9" />
  {:else if name === 'sparkles'}
    <path d="M12 3 13.9 8.1 19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M5 3v4M3 5h4M19 17v4M17 19h4" />
  {:else if name === 'upload'}
    <path d="M12 16V4M7 9l5-5 5 5M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
  {:else if name === 'check'}
    <path d="m5 12 5 5 9-10" />
  {:else if name === 'edit'}
    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" />
  {:else if name === 'film'}
    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M7 3v18M17 3v18M3 7.5h4M3 12h18M3 16.5h4M17 7.5h4M17 16.5h4" />
  {:else if name === 'copy'}
    <rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
  {:else if name === 'plus'}
    <path d="M12 5v14M5 12h14" />
  {:else if name === 'search'}
    <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
  {:else if name === 'x'}
    <path d="M18 6 6 18M6 6l12 12" />
  {:else if name === 'clapper'}
    <path d="M20.2 6 3 11l-.9-2.4a2 2 0 0 1 1.3-2.5l13.5-4a2 2 0 0 1 2.5 1.3zM6.2 5.3l3.1 3.9M12.4 3.4l3.1 4" /><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  {:else if name === 'sliders'}
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
  {:else if name === 'loader'}
    <path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8" />
  {:else if name === 'link'}
    <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
  {/if}
</svg>
