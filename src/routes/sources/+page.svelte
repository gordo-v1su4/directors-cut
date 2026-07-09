<script lang="ts">
  import { onMount } from 'svelte';
  import { loadPromptCards } from '$lib/data/loader';
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import Badge, { FAMILY_COLORS } from '$lib/components/Badge.svelte';

  let cards: PromptCardIndex[] = $state.raw([]);

  // Aggregate source URLs → cards that cite them.
  const sourceMap = $derived(
    cards
      .flatMap((c) => c.source_urls.map((url) => ({ url, card: c })))
      .reduce<Map<string, PromptCardIndex[]>>(reduceSourceMap, new Map()),
  );

  function reduceSourceMap(acc: Map<string, PromptCardIndex[]>, item: { url: string; card: PromptCardIndex }) {
    const existing = acc.get(item.url) ?? [];
    existing.push(item.card);
    acc.set(item.url, existing);
    return acc;
  }

  const sortedSources = $derived(
    [...sourceMap.entries()].sort((a, b) => b[1].length - a[1].length),
  );

  onMount(async () => {
    cards = await loadPromptCards();
  });
</script>

<div style="padding: 24px; overflow-y: auto; height: 100%;">
  <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 8px; color: var(--dc-text);">Source Map</h1>
  <p style="font-size: 12px; color: var(--dc-text-dim); margin: 0 0 20px;">Where the library came from — each source linked to its citing cards.</p>

  <table class="dc-table" style="max-width: 900px;">
    <thead>
      <tr>
        <th style="min-width: 300px">Source URL</th>
        <th style="min-width: 60px">Cards</th>
        <th style="min-width: 80px">Families</th>
      </tr>
    </thead>
    <tbody>
      {#each sortedSources as [url, citing] (url)}
        <tr>
          <td>
            <a href={url} target="_blank" rel="noopener" style="color: var(--dc-sora); font-size: 12px; text-decoration: none;">{url}</a>
          </td>
          <td style:text-align="right">{citing.length}</td>
          <td>
            <div style="display: flex; gap: 4px; flex-wrap: wrap;">
              {#each [...new Set(citing.map((c) => c.model_family))] as fam}
                <Badge label={fam} color={FAMILY_COLORS[fam] ?? 'var(--dc-general)'} />
              {/each}
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
