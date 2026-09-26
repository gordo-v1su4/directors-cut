<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { loadPromptCards } from '$lib/data/loader';
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import Select from '$lib/components/Select.svelte';
  import GlassModal from '$lib/components/GlassModal.svelte';
  import Icon from '$lib/components/Icon.svelte';
  import { toneFor } from '$lib/ui/tones';
  import { callBridgeTool } from '$lib/bridge/types';
  import type { GenerateCinematicGridInput, GenerateCinematicGridOutput } from '$lib/bridge/types';

  const BRIDGE_URL = import.meta.env.VITE_RAYCAST_BRIDGE_URL ?? 'http://127.0.0.1:8787';
  const BRIDGE_TOKEN = import.meta.env.VITE_RAYCAST_BRIDGE_TOKEN ?? '';

  let cards: PromptCardIndex[] = $state.raw([]);
  let loaded = $state(false);
  let selectedId = $state<string | null>(null);
  let search = $state('');
  let family = $state('');
  let confidence = $state('');
  let tested = $state('');
  let copiedId = $state('');
  let narrow = $state(false);
  let sheetOpen = $state(false);
  let gridJob = $state<GenerateCinematicGridOutput | null>(null);
  let gridError = $state('');
  let gridBusy = $state(false);

  const families = $derived([...new Set(cards.map((c) => c.model_family))].sort());
  const filtered = $derived(
    cards.filter((c) => {
      if (family && c.model_family !== family) return false;
      if (confidence && c.confidence !== confidence) return false;
      if (tested === 'tested' && !c.tested_by_us) return false;
      if (tested === 'untested' && c.tested_by_us) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)) ||
        c.use_cases.some((u) => u.toLowerCase().includes(q))
      );
    }),
  );
  const active = $derived(filtered.find((c) => c.id === selectedId) ?? filtered[0]);
  const filtering = $derived(!!(search || family || confidence || tested));

  function familyLabel(value: string) {
    if (value === 'general_video') return 'General video';
    if (value === 'cross-model') return 'Cross model';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function promptText(card: PromptCardIndex) {
    return card.prompt_pattern || card.body_excerpt;
  }

  async function copy(card: PromptCardIndex) {
    await navigator.clipboard.writeText(promptText(card));
    copiedId = card.id;
    setTimeout(() => (copiedId = ''), 1500);
  }

  function select(card: PromptCardIndex) {
    selectedId = card.id;
    gridJob = null;
    gridError = '';
    if (narrow) sheetOpen = true;
  }

  function reset() {
    search = '';
    family = '';
    confidence = '';
    tested = '';
  }

  async function generateGrid(card: PromptCardIndex) {
    gridBusy = true;
    gridError = '';
    gridJob = null;
    try {
      gridJob = await callBridgeTool<GenerateCinematicGridInput, GenerateCinematicGridOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'generate_cinematic_grid',
        {
          brief: `Create a ${card.model_family} cinematic image grid based on this prompt card:\nTitle: ${card.title}\nSummary: ${card.summary}\nBody: ${card.body_excerpt}`,
          grid_layout: '3x3',
          aspect_ratio: card.aspect_ratio,
          resolution: '2k',
        },
      );
    } catch (e) {
      gridError = e instanceof Error ? e.message : String(e);
    } finally {
      gridBusy = false;
    }
  }

  onMount(() => {
    void loadPromptCards().then((all) => {
      cards = all;
      loaded = true;
    });
    const query = matchMedia('(max-width: 1000px)');
    const sync = () => (narrow = query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  });
</script>

<svelte:head><title>Prompts · Directors Cut</title></svelte:head>

{#snippet detail(card: PromptCardIndex, inSheet: boolean)}
  <div class="detail-body">
    {#if !inSheet}<h2 class="t-section" title={card.title}>{card.title}</h2>{/if}
    <div class="tags">
      {#each card.model_targets as target (target)}<span class="stag tone-{toneFor(target)}">{target}</span>{/each}
      <span class="stag tone-{card.confidence === 'high' ? 'approved' : card.confidence === 'medium' ? 'review' : 'warm'}">{card.confidence} confidence</span>
      {#if card.tested_by_us}<span class="stag tone-approved">Tested</span>{/if}
    </div>

    <div class="block raised">
      <span class="label">Recipe line</span>
      <p class="block-lead">{card.summary}</p>
    </div>

    <div class="block raised">
      <span class="label">Full model prompt</span>
      <p class="block-text">{promptText(card)}</p>
    </div>

    <div class="specs">
      <div class="spec raised"><span class="label">Frame</span><span>{card.aspect_ratio}{card.runtime_seconds ? ` · ${card.runtime_seconds}s` : ''}</span></div>
      <div class="spec raised"><span class="label">Mode</span><span>{card.prompt_mode.replace(/_/g, ' ')}</span></div>
      <div class="spec raised spec-wide"><span class="label">Use cases</span><span>{card.use_cases.join(', ')}</span></div>
    </div>

    {#if card.source_urls.length}
      <div class="sources">
        <span class="label">Sources</span>
        {#each card.source_urls as url (url)}
          <a href={url} target="_blank" rel="noopener">{url.replace(/^https?:\/\/(www\.)?/, '')} <Icon name="up-right" size={12} /></a>
        {/each}
      </div>
    {/if}

    <div class="detail-actions">
      <button type="button" class="sbtn" onclick={() => copy(card)}>
        <Icon name={copiedId === card.id ? 'check' : 'copy'} /> {copiedId === card.id ? 'Copied' : 'Copy prompt'}
      </button>
      {#if BRIDGE_TOKEN}
        <button type="button" class="sbtn" disabled={gridBusy} onclick={() => generateGrid(card)}>
          <Icon name="sparkles" /> {gridBusy ? 'Generating…' : 'Generate grid'}
        </button>
      {/if}
      <button type="button" class="sbtn sbtn-primary" onclick={() => goto(`/create?recipe=${card.slug}`)}>
        <Icon name="sparkles" /> Use in Create
      </button>
    </div>
    {#if gridJob}<p class="dim note">Grid job {gridJob.job_id}: {gridJob.status}</p>{/if}
    {#if gridError}<p class="error">{gridError}</p>{/if}
  </div>
{/snippet}

<div class="studio-column prompts">
  <header class="head">
    <h1 class="t-page">Prompts</h1>
    <span class="dim head-note">{filtered.length} reusable {filtered.length === 1 ? 'recipe' : 'recipes'}</span>
  </header>

  {#if active}
    <section class="spotlight glass-panel" aria-label="Selected recipe">
      <div class="spotlight-copy">
        <div class="spotlight-tags">
          <span class="label">Recipe line</span>
          <span class="stag tone-{toneFor(active.model_family)}">{familyLabel(active.model_family)}</span>
          <span class="stag">{active.aspect_ratio}</span>
        </div>
        <p class="spotlight-line" title={active.summary}>{active.summary}</p>
      </div>
      <div class="spotlight-actions">
        <button type="button" class="sbtn" onclick={() => copy(active)}>
          <Icon name={copiedId === active.id ? 'check' : 'copy'} /> {copiedId === active.id ? 'Copied' : 'Copy prompt'}
        </button>
        <button type="button" class="sbtn sbtn-primary" onclick={() => goto(`/create?recipe=${active.slug}`)}>
          <Icon name="sparkles" /> Use in Create
        </button>
      </div>
    </section>
  {/if}

  <div class="filters">
    <label class="ssearch search">
      <Icon name="search" />
      <input type="search" placeholder="Search recipes, tags and use cases" aria-label="Search prompts" bind:value={search} />
    </label>
    <div class="dropdowns">
      <Select label="Family" bind:value={family} options={[{ value: '', label: 'All families' }, ...families.map((f) => ({ value: f, label: familyLabel(f) }))]} />
      <Select label="Confidence" bind:value={confidence} options={[{ value: '', label: 'Any confidence' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} />
      <Select label="Tested" bind:value={tested} options={[{ value: '', label: 'Tested or not' }, { value: 'tested', label: 'Tested' }, { value: 'untested', label: 'Untested' }]} />
      {#if filtering}<button type="button" class="sbtn" onclick={reset}>Reset</button>{/if}
    </div>
  </div>

  <div class="library">
    <div class="list" role="listbox" aria-label="Recipes">
      <div class="list-head" aria-hidden="true">
        <span>Recipe</span>
        <span>Recipe line</span>
        <span>Pair</span>
        <span class="num">Sources</span>
      </div>
      {#if !loaded}
        <p class="empty muted"><Icon name="loader" /> Loading recipes…</p>
      {:else if !filtered.length}
        <p class="empty muted">No recipes match. <button type="button" class="sbtn" onclick={reset}>Reset filters</button></p>
      {/if}
      {#each filtered as card (card.id)}
        <button
          type="button"
          role="option"
          class="row"
          class:is-selected={active?.id === card.id}
          aria-selected={active?.id === card.id}
          title={card.title}
          onclick={() => select(card)}
        >
          <span class="t-body">{card.title}</span>
          <span class="row-line">{card.summary}</span>
          <span class="row-tags">
            <span class="stag tone-{toneFor(card.model_family)}">{familyLabel(card.model_family)}</span>
            <span class="stag tone-{card.confidence === 'high' ? 'approved' : card.confidence === 'medium' ? 'review' : 'warm'}">{card.confidence}</span>
          </span>
          <span class="num dim">{card.source_count}</span>
        </button>
      {/each}
    </div>

    {#if active && !narrow}
      <aside class="detail glass-panel" aria-label="Recipe details">
        {@render detail(active, false)}
      </aside>
    {/if}
  </div>
</div>

{#if active && narrow && sheetOpen}
  <GlassModal title={active.title} onclose={() => (sheetOpen = false)}>
    {@render detail(active, true)}
  </GlassModal>
{/if}

<style>
  .prompts {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 20px;
    padding-top: 24px;
    padding-bottom: 64px;
  }

  .head {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }

  .head .t-page {
    width: auto;
  }

  .head-note {
    font-size: 13px;
    white-space: nowrap;
  }

  /* ── Spotlight ────────────────────────────────────────────────── */

  .spotlight {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 16px;
  }

  .spotlight-copy {
    min-width: 0;
  }

  .spotlight-tags {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .spotlight-line {
    margin: 0;
    overflow: hidden;
    color: var(--dc-text);
    font-size: 15px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .spotlight-actions {
    display: flex;
    flex-shrink: 0;
    gap: 8px;
  }

  /* ── Filters ──────────────────────────────────────────────────── */

  .filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
  }

  .search {
    flex: 0 1 340px;
  }

  .dropdowns {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .dropdowns :global(.dc-select) {
    width: 150px;
  }

  /* ── List + detail ────────────────────────────────────────────── */

  .library {
    display: grid;
    grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
    gap: 24px;
    align-items: start;
  }

  .list {
    display: grid;
    gap: 6px;
  }

  .list-head,
  .row {
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 5fr) minmax(0, 3fr) 56px;
    gap: 12px;
    align-items: center;
    padding: 0 14px;
  }

  .list-head {
    height: 28px;
    color: var(--dc-text-dim);
    font-size: 12px;
  }

  .row {
    min-height: 48px;
    padding-block: 10px;
    border: 0;
    border-radius: 6px;
    background: #0e0e0e;
    color: var(--dc-text);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition: background 0.15s ease;
  }

  .row:hover {
    background: #161616;
  }

  .row:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(231, 229, 228, 0.16);
  }

  .row-line {
    overflow: hidden;
    color: var(--dc-text-muted);
    font-size: 13px;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .row-tags {
    display: flex;
    min-width: 0;
    gap: 4px;
    overflow: hidden;
  }

  .num {
    font-size: 13px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  .empty {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 12px 14px;
    font-size: 13px;
  }

  .detail {
    position: sticky;
    top: calc(var(--dc-nav-offset) + 16px);
    padding: 20px;
  }

  .detail-body {
    display: grid;
    gap: 14px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .block {
    display: grid;
    gap: 6px;
    padding: 12px;
  }

  .block p {
    margin: 0;
  }

  .block-lead {
    color: var(--dc-text);
    font-size: 13px;
    line-height: 1.45;
  }

  .block-text {
    color: var(--dc-text-muted);
    font-size: 13px;
    line-height: 1.55;
    white-space: pre-wrap;
  }

  .specs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  .spec {
    display: grid;
    gap: 4px;
    min-width: 0;
    padding: 10px 12px;
    font-size: 13px;
  }

  .spec-wide {
    grid-column: 1 / -1;
  }

  .sources {
    display: grid;
    gap: 6px;
    font-size: 12px;
  }

  .sources a {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    overflow: hidden;
    color: var(--dc-text-muted);
    text-decoration: none;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sources a:hover {
    color: var(--dc-text);
  }

  .detail-actions {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .note,
  .error {
    margin: 0;
    font-size: 12px;
  }

  .error {
    color: #f0a8a0;
  }

  /* ── Tablet and phone ─────────────────────────────────────────── */

  @media (max-width: 1000px) {
    .library {
      grid-template-columns: minmax(0, 1fr);
    }

    .list-head,
    .row {
      grid-template-columns: minmax(0, 2fr) minmax(0, 3fr) auto;
    }

    .list-head .num,
    .row .num {
      display: none;
    }
  }

  @media (max-width: 760px) {
    .spotlight {
      flex-direction: column;
      align-items: stretch;
    }

    .spotlight-actions .sbtn {
      flex: 1;
    }

    .search {
      flex-basis: 100%;
    }

    .dropdowns {
      width: 100%;
      flex-wrap: nowrap;
    }

    .dropdowns :global(.dc-select) {
      flex: 1 1 0;
      width: auto;
      min-width: 0;
    }

    .list-head {
      display: none;
    }

    .row {
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 4px 10px;
    }

    .row-line {
      grid-column: 1 / -1;
      grid-row: 2;
    }

    .row-tags .stag:last-child {
      display: none;
    }
  }
</style>
