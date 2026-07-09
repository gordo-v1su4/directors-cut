<script lang="ts">
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import Badge, { FAMILY_COLORS, CONFIDENCE_COLORS } from './Badge.svelte';

  /**
   * Dense prompt-card table.
   *
   * TanStack Table v9 beta (`constructTable` + feature slots) is still churning;
   * keep this as a thin presentational table so the browser ships. When v9
   * stabilizes, wrap it behind this same component API.
   */
  let {
    data,
    selectedId = null,
    onselect,
  }: {
    data: PromptCardIndex[];
    selectedId?: string | null;
    onselect?: (id: string) => void;
  } = $props();
</script>

<table class="dc-table">
  <thead>
    <tr>
      <th style="min-width: 200px">Title</th>
      <th style="min-width: 90px">Family</th>
      <th style="min-width: 120px">Use Case</th>
      <th style="min-width: 100px">Mode</th>
      <th style="min-width: 60px">Aspect</th>
      <th style="min-width: 55px">Conf</th>
      <th style="min-width: 40px; text-align: right">Src</th>
      <th style="min-width: 55px">Tested</th>
      <th style="min-width: 80px">Updated</th>
    </tr>
  </thead>
  <tbody>
    {#each data as c (c.id)}
      <tr class:selected={c.id === selectedId} onclick={() => onselect?.(c.id)}>
        <td>{c.title}</td>
        <td>
          <Badge label={c.model_family} color={FAMILY_COLORS[c.model_family] ?? 'var(--dc-general)'} active />
        </td>
        <td>{c.use_cases.join(', ')}</td>
        <td>{c.prompt_mode}</td>
        <td>{c.aspect_ratio}</td>
        <td>
          <Badge label={c.confidence} color={CONFIDENCE_COLORS[c.confidence] ?? 'var(--dc-text-dim)'} />
        </td>
        <td style="text-align: right">{c.source_count}</td>
        <td>
          {#if c.tested_by_us}
            <Badge label="✓" color="var(--dc-conf-high)" />
          {:else}
            <span style="color: var(--dc-text-dim)">—</span>
          {/if}
        </td>
        <td style="color: var(--dc-text-dim)">{c.updated.slice(0, 10)}</td>
      </tr>
    {/each}
  </tbody>
</table>
