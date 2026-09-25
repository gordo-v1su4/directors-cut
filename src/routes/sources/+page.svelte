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

  function repoName(url: string) {
    const parts = url.replace(/^https?:\/\//, '').split('/').filter(Boolean);
    return parts.length >= 3 ? parts[2].replace(/[-_]+/g, ' ') : parts.at(-1) ?? url;
  }

  function hostPath(url: string) {
    return url.replace(/^https?:\/\//, '');
  }

  onMount(async () => {
    cards = await loadPromptCards();
  });
</script>

<div class="dc-room">
  <div class="dc-room-inner">
    <header class="dc-room-head">
      <div>
        <h1 class="dc-room-title">Sources</h1>
        <p class="dc-room-lede">Where the prompt library came from, and how many cards cite each source.</p>
      </div>
    </header>

    <ul class="sources">
      {#each sortedSources as [url, citing] (url)}
        <li>
          <a class="source" href={url} target="_blank" rel="noopener">
            <span class="source-name">
              <strong>{repoName(url)}</strong>
              <span>{hostPath(url)}</span>
            </span>
            <span class="source-families">
              {#each [...new Set(citing.map((c) => c.model_family))] as fam}
                <Badge label={fam} color={FAMILY_COLORS[fam] ?? 'var(--dc-general)'} />
              {/each}
            </span>
            <span class="source-count">{citing.length} {citing.length === 1 ? 'card' : 'cards'}</span>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8" /></svg>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</div>

<style>
  .sources {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .sources li + li {
    border-top: 1px solid rgba(255, 255, 255, 0.06);
  }

  .source {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto 80px 18px;
    align-items: center;
    gap: 20px;
    padding: 16px 0;
    color: var(--dc-text);
    text-decoration: none;
  }

  .source-name {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  .source-name strong {
    overflow: hidden;
    font-size: 16px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-name span {
    overflow: hidden;
    color: var(--dc-text-dim);
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .source-families {
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: 6px;
  }

  .source-count {
    color: var(--dc-text-muted);
    font-size: 14px;
    font-variant-numeric: tabular-nums;
    text-align: right;
  }

  .source svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: var(--dc-text-dim);
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: stroke 0.15s ease, transform 0.15s ease;
  }

  .source:hover strong {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .source:hover svg {
    stroke: var(--dc-text);
    transform: translate(2px, -2px);
  }

  .source:focus-visible {
    outline: 2px solid var(--dc-text);
    outline-offset: 2px;
  }

  @media (max-width: 700px) {
    .source {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px 16px;
    }

    .source-families {
      grid-column: 1;
      justify-content: start;
    }

    .source svg {
      display: none;
    }
  }
</style>
