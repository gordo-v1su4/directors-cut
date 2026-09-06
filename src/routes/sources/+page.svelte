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

<div class="dc-page-shell">
  <h1 class="dc-sources-title">Source Map</h1>
  <p class="dc-sources-intro">Where the library came from — each source linked to its citing cards.</p>

  <!-- Mobile: one card per source. A three-column URL table cannot survive 375px. -->
  <div class="dc-card-list">
    {#each sortedSources as [url, citing] (url)}
      <a class="dc-list-card dc-source-card" href={url} target="_blank" rel="noopener">
        <span class="dc-list-card-title dc-source-url">{url}</span>
        <span class="dc-list-card-meta">
          {#each [...new Set(citing.map((c) => c.model_family))] as fam}
            <Badge label={fam} color={FAMILY_COLORS[fam] ?? 'var(--dc-general)'} />
          {/each}
        </span>
        <span class="dc-list-card-foot">
          <span>{citing.length} card{citing.length === 1 ? '' : 's'} cite this</span>
          <span aria-hidden="true">↗</span>
        </span>
      </a>
    {/each}
  </div>

  <table class="dc-table dc-desk-table" style="max-width: 900px;">
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

<style>
  .dc-sources-title {
    margin: 0 0 8px;
    color: var(--dc-text);
    font-size: 26px;
    font-weight: 650;
    letter-spacing: -0.035em;
  }

  .dc-sources-intro {
    margin: 0 0 20px;
    color: var(--dc-text-dim);
    font-size: 13px;
  }

  .dc-source-card {
    text-decoration: none;
  }

  /* Long URLs must wrap rather than widen the card past the viewport. */
  .dc-source-url {
    display: block;
    color: var(--dc-sora);
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    overflow-wrap: anywhere;
  }

  .dc-source-card .dc-list-card-meta { display: flex; }
  .dc-source-card .dc-list-card-foot { display: flex; }

  @media (min-width: 861px) {
    .dc-sources-title { font-size: 18px; font-weight: 600; }
    .dc-sources-intro { font-size: 12px; }
  }
</style>
