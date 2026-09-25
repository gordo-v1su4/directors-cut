<script lang="ts">
  import { onMount } from 'svelte';
  import { loadPromptCards } from '$lib/data/loader';
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import DenseTable from '$lib/components/DenseTable.svelte';
  import CardDrawer from '$lib/components/CardDrawer.svelte';
  import Select from '$lib/components/Select.svelte';

  let allCards: PromptCardIndex[] = $state.raw([]);
  let selectedId = $state<string | null>(null);
  let drawerOpen = $state(false);
  let searchQuery = $state('');
  let familyFilter = $state('');
  let confidenceFilter = $state('');
  let testedFilter = $state('');

  const families = $derived([...new Set(allCards.map((c) => c.model_family))].sort());
  const filtered = $derived(allCards.filter((c) => {
    if (familyFilter && c.model_family !== familyFilter) return false;
    if (confidenceFilter && c.confidence !== confidenceFilter) return false;
    if (testedFilter === 'tested' && !c.tested_by_us) return false;
    if (testedFilter === 'untested' && c.tested_by_us) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.title.toLowerCase().includes(q) || c.tags.some((t) => t.toLowerCase().includes(q)) || c.use_cases.some((u) => u.toLowerCase().includes(q));
  }));
  const selectedCard = $derived(selectedId ? allCards.find((c) => c.id === selectedId) ?? null : null);

  function selectCard(id: string) { selectedId = id; drawerOpen = true; }
  function closeDrawer() { drawerOpen = false; }
  function folderLabel(family: string) {
    return family.replace('general_video', 'general video').replace('cross-model', 'cross model');
  }

  onMount(async () => { allCards = await loadPromptCards(); });
</script>

<svelte:head><title>Prompts — Directors Cut</title></svelte:head>
<svelte:window onkeydown={(e) => { if (e.key === 'Escape' && drawerOpen) closeDrawer(); }} />

<div class="dc-library-page dc-projects-library prompts-page">
  <main class="dc-room">
    <div class="dc-room-inner">
      <header class="dc-room-head">
        <div>
          <h1 class="dc-room-title">Prompts</h1>
          <p class="dc-room-lede">Reusable recipes for a shot. Study the structure, then adapt the language to your project.</p>
        </div>
      </header>

      <div class="recipe">
        <p class="recipe-flow" aria-label="How a prompt is built">
          {#each ['Subject', 'Action', 'Camera', 'Light', 'Finish'] as part, i (part)}
            {#if i}<span class="recipe-plus" aria-hidden="true">+</span>{/if}
            <span class="recipe-part">{part}</span>
          {/each}
        </p>
        <span class="recipe-note">Every card keeps these ingredients visible so you can change one decision at a time.</span>
      </div>

      <div class="filters">
        <label class="search">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
          <input type="search" placeholder="Search titles, tags and use cases" aria-label="Search prompts" bind:value={searchQuery} />
        </label>
        <Select label="Family" bind:value={familyFilter} options={[{ value: '', label: 'All families' }, ...families.map((f) => ({ value: f, label: folderLabel(f) }))]} />
        <Select label="Confidence" bind:value={confidenceFilter} options={[{ value: '', label: 'Any confidence' }, { value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} />
        <Select label="Tested" bind:value={testedFilter} options={[{ value: '', label: 'Tested or not' }, { value: 'tested', label: 'Tested' }, { value: 'untested', label: 'Untested' }]} />
        <span class="count">{filtered.length} of {allCards.length}</span>
      </div>

      <DenseTable data={filtered} {selectedId} onselect={selectCard} />
    </div>
  </main>

  {#if drawerOpen}<button type="button" class="dc-drawer-backdrop" aria-label="Close details" onclick={closeDrawer}></button>{/if}
  <CardDrawer card={selectedCard} open={drawerOpen} onclose={closeDrawer} />
  {#if selectedCard && !drawerOpen}<button type="button" class="dc-drawer-fab" onclick={() => (drawerOpen = true)}>View card</button>{/if}
</div>

<style>
  .dc-room {
    flex: 1;
    min-width: 0;
  }

  .recipe {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 10px;
    margin: 0 0 20px;
  }

  .recipe-flow {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: 8px;
    margin: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .recipe-flow::-webkit-scrollbar {
    display: none;
  }

  .recipe-part {
    flex-shrink: 0;
    padding: 4px 10px;
    border-radius: 4px;
    background: #141414;
    font-size: 13px;
    font-weight: 600;
  }

  .recipe-plus {
    color: var(--dc-text-dim);
  }

  .recipe-note {
    margin-left: 6px;
    color: var(--dc-text-muted);
    font-size: 13px;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  .search {
    display: flex;
    flex: 1 1 280px;
    align-items: center;
    gap: 8px;
    min-height: 28px;
    padding: 0 10px;
    border-radius: 4px;
    background: #141414;
    color: var(--dc-text-muted);
  }

  .search:focus-within {
    background: #1c1c1c;
    color: var(--dc-text);
  }

  .search svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
  }

  .search input {
    width: 100%;
    min-width: 0;
    border: 0;
    background: transparent;
    color: var(--dc-text);
    font: 13px var(--dc-font-sans);
    outline: none;
  }

  .search input::placeholder {
    color: var(--dc-text-dim);
  }

  /* One width for every dropdown so the row reads as a set. */
  .filters :global(.dc-select) {
    width: 150px;
  }

  .count {
    margin-left: auto;
    color: var(--dc-text-muted);
    font-size: 13px;
    white-space: nowrap;
  }

  @media (max-width: 860px) {
    .search input {
      font-size: 16px;
    }

    /* Phones: search on its own line, the three filters share the next. */
    .search {
      flex-basis: 100%;
    }

    .filters :global(.dc-select) {
      flex: 1 1 0;
      width: auto;
      min-width: 0;
    }

    .filters :global(.dc-select-trigger) {
      padding: 0 8px;
    }

    .count {
      display: none;
    }

    .recipe-note {
      margin-left: 0;
      flex-basis: 100%;
    }

    .recipe-flow {
      gap: 5px;
    }

    .recipe-part {
      padding: 3px 8px;
      font-size: 12px;
    }
  }
</style>
