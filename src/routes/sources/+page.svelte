<script lang="ts">
  import { onMount } from 'svelte';
  import { loadPromptCards } from '$lib/data/loader';
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import Select from '$lib/components/Select.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { studio } from '$lib/ui/studio.svelte';
  import { toneFor } from '$lib/ui/tones';

  interface Source {
    url: string;
    name: string;
    path: string;
    host: string;
    cards: PromptCardIndex[];
    families: string[];
  }

  let cards: PromptCardIndex[] = $state.raw([]);
  let search = $state('');
  let family = $state('');

  // Every source URL, with the cards that cite it, most-cited first.
  const sources = $derived.by(() => {
    const byUrl = new Map<string, PromptCardIndex[]>();
    for (const card of cards) for (const url of card.source_urls) byUrl.set(url, [...(byUrl.get(url) ?? []), card]);
    return [...byUrl.entries()]
      .map(([url, citing]): Source => {
        const path = url.replace(/^https?:\/\/(www\.)?/, '');
        const parts = path.split('/').filter(Boolean);
        return {
          url,
          name: (parts.length >= 3 ? parts[2] : parts.at(-1) ?? path).replace(/[-_]+/g, ' '),
          path,
          host: parts[0] ?? '',
          cards: citing,
          families: [...new Set(citing.map((c) => c.model_family))],
        };
      })
      .sort((a, b) => b.cards.length - a.cards.length);
  });
  const families = $derived([...new Set(sources.flatMap((s) => s.families))].sort());
  const filtered = $derived(
    sources.filter((s) => {
      if (family && !s.families.includes(family)) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.path.toLowerCase().includes(q) || s.families.some((f) => f.includes(q));
    }),
  );

  function familyLabel(value: string) {
    if (value === 'general_video') return 'General video';
    if (value === 'cross-model') return 'Cross model';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  onMount(async () => {
    cards = await loadPromptCards();
  });
</script>

<svelte:head><title>Sources · Directors Cut</title></svelte:head>

{#snippet toggle(on: boolean, label: string, hint: string, flip: () => void)}
  <button type="button" class="pref raised" role="switch" aria-checked={on} onclick={flip}>
    <span class="pref-copy">
      <span class="t-body">{label}</span>
      <span class="dim pref-hint">{hint}</span>
    </span>
    <span class="switch" class:on aria-hidden="true"><span></span></span>
  </button>
{/snippet}

<div class="studio-column sources-page">
  <header class="head">
    <div class="head-title">
      <h1 class="t-page">Sources</h1>
      <span class="dim head-note">{filtered.length} repositories behind {cards.length} prompt cards</span>
    </div>
    <div class="head-tools">
      <label class="ssearch search">
        <Icon name="search" />
        <input type="search" placeholder="Filter repositories or families" aria-label="Filter sources" bind:value={search} />
      </label>
      <Select label="Type" bind:value={family} options={[{ value: '', label: 'All families' }, ...families.map((f) => ({ value: f, label: familyLabel(f) }))]} />
    </div>
  </header>

  <div class="grid">
    {#each filtered as source (source.url)}
      <article class="repo glass-panel">
        <div class="repo-top">
          <div class="repo-name">
            <h2 class="t-card" title={source.name}>{source.name}</h2>
            <span class="dim repo-path" title={source.path}>{source.path}</span>
          </div>
        </div>
        <div class="tags">
          {#each source.families as fam (fam)}<span class="stag tone-{toneFor(fam)}">{familyLabel(fam)}</span>{/each}
        </div>
        <p class="repo-cites muted">
          Cited by {source.cards.map((c) => c.title).join(', ')}.
        </p>
        <div class="metrics">
          <div class="metric raised"><span class="label">Cards</span><span class="metric-big">{source.cards.length}</span></div>
          <div class="metric raised"><span class="label">Families</span><span class="metric-big">{source.families.length}</span></div>
          <div class="metric raised"><span class="label">Host</span><span class="metric-value">{source.host}</span></div>
        </div>
        <div class="repo-foot">
          <span class="stag">{source.cards.some((c) => c.tested_by_us) ? 'Tested by us' : 'Untested'}</span>
          <a class="sbtn" href={source.url} target="_blank" rel="noopener">Browse <Icon name="up-right" /></a>
        </div>
      </article>
    {:else}
      <p class="muted empty">{cards.length ? 'No sources match.' : 'Loading sources…'}</p>
    {/each}
  </div>

  <section class="prefs glass-panel" aria-labelledby="prefs-title">
    <div class="prefs-head">
      <h2 id="prefs-title" class="t-section">Screening room behavior</h2>
      <span class="dim prefs-note">Saved on this device</span>
    </div>
    <div class="pref-grid">
      {@render toggle(studio.heroAutoRotate, 'Rotate the home hero', 'Move to the next project every 9 seconds instead of waiting for the arrows.', () => studio.setPref('heroAutoRotate', !studio.heroAutoRotate))}
      {@render toggle(studio.playOnHover, 'Play takes on hover', 'Clip cards start playing, muted, when the pointer rests on them.', () => studio.setPref('playOnHover', !studio.playOnHover))}
    </div>
  </section>
</div>

<style>
  .sources-page {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    padding-top: 24px;
    padding-bottom: 64px;
  }

  .head {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 12px 16px;
  }

  .head-title,
  .prefs-head {
    display: flex;
    min-width: 0;
    align-items: baseline;
    gap: 12px;
  }

  .head-title .t-page,
  .prefs-head .t-section {
    flex-shrink: 0;
    width: auto;
  }

  .head-note,
  .prefs-note {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .head-tools {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search {
    width: 260px;
  }

  .head-tools :global(.dc-select) {
    width: 150px;
  }

  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 340px), 1fr));
    gap: 16px;
  }

  .repo {
    display: grid;
    align-content: start;
    gap: 14px;
    padding: 20px;
  }

  .repo-name {
    display: grid;
    gap: 2px;
    min-width: 0;
  }

  .repo-name .t-card {
    text-transform: capitalize;
  }

  .repo-path {
    overflow: hidden;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .repo-cites {
    display: -webkit-box;
    margin: 0;
    overflow: hidden;
    font-size: 13px;
    line-height: 1.45;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .metrics {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
  }

  .metric {
    display: grid;
    gap: 4px;
    min-width: 0;
    padding: 10px 12px;
  }

  .metric-big {
    font: 400 22px / 1 var(--dc-font-serif);
  }

  .metric-value {
    overflow: hidden;
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .repo-foot {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .empty {
    margin: 0;
    font-size: 14px;
  }

  .prefs {
    display: grid;
    gap: 16px;
    padding: 20px;
  }

  .pref-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }

  .pref {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px;
    border: 0;
    color: var(--dc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .pref:hover {
    background: #161616;
  }

  .pref:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(231, 229, 228, 0.16);
  }

  .pref-copy {
    display: grid;
    gap: 4px;
    min-width: 0;
  }

  .pref-hint {
    font-size: 12px;
    line-height: 1.4;
  }

  .switch {
    position: relative;
    flex-shrink: 0;
    width: 34px;
    height: 20px;
    border-radius: 10px;
    background: #262626;
    transition: background 0.15s ease;
  }

  .switch span {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: var(--dc-text-muted);
    transition: transform 0.15s ease, background 0.15s ease;
  }

  .switch.on {
    background: rgba(255, 255, 255, 0.7);
  }

  .switch.on span {
    background: #000;
    transform: translateX(14px);
  }

  @media (max-width: 760px) {
    .head-note,
    .prefs-note {
      display: none;
    }

    .head-tools {
      width: 100%;
    }

    .search {
      flex: 1;
      width: auto;
    }

    .pref-grid {
      grid-template-columns: minmax(0, 1fr);
    }

    .repo,
    .prefs {
      padding: 16px;
    }
  }
</style>
