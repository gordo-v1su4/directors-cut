<script lang="ts">
  import { onMount } from 'svelte';
  import { loadPromptCards } from '$lib/data/loader';
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import DenseTable from '$lib/components/DenseTable.svelte';
  import CardDrawer from '$lib/components/CardDrawer.svelte';

  let allCards: PromptCardIndex[] = $state.raw([]);
  let selectedId = $state<string | null>(null);
  let drawerOpen = $state(false);

  let searchQuery = $state('');
  let familyFilter = $state('');
  let confidenceFilter = $state('');
  let testedFilter = $state('');

  const families = $derived([...new Set(allCards.map((c) => c.model_family))].sort());

  const filtered = $derived(
    allCards.filter((c) => {
      if (familyFilter && c.model_family !== familyFilter) return false;
      if (confidenceFilter && c.confidence !== confidenceFilter) return false;
      if (testedFilter === 'tested' && !c.tested_by_us) return false;
      if (testedFilter === 'untested' && c.tested_by_us) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.tags.some((t) => t.toLowerCase().includes(q)) ||
          c.use_cases.some((u) => u.toLowerCase().includes(q))
        );
      }
      return true;
    }),
  );

  const selectedCard = $derived(
    selectedId ? allCards.find((c) => c.id === selectedId) ?? null : null,
  );

  function selectCard(id: string) {
    selectedId = id;
    drawerOpen = true;
  }

  function closeDrawer() {
    drawerOpen = false;
  }

  onMount(async () => {
    allCards = await loadPromptCards();
  });
</script>

<div class="dc-library-page">
  <div class="dc-library-main">
    <div class="dc-library-filters">
      <input
        type="search"
        class="dc-library-search"
        placeholder="Search cards..."
        bind:value={searchQuery}
      />
      <select class="dc-library-select" bind:value={familyFilter}>
        <option value="">All Families</option>
        {#each families as f}
          <option value={f}>{f}</option>
        {/each}
      </select>
      <select class="dc-library-select" bind:value={confidenceFilter}>
        <option value="">Any Confidence</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select class="dc-library-select" bind:value={testedFilter}>
        <option value="">All</option>
        <option value="tested">Tested</option>
        <option value="untested">Untested</option>
      </select>
      <span class="dc-library-count">{filtered.length} / {allCards.length} cards</span>
    </div>

    <DenseTable data={filtered} {selectedId} onselect={selectCard} />
  </div>

  {#if drawerOpen}
    <button type="button" class="dc-drawer-backdrop" aria-label="Close details" onclick={closeDrawer}></button>
  {/if}

  <CardDrawer card={selectedCard} open={drawerOpen} onclose={closeDrawer} />

  {#if selectedCard && !drawerOpen}
    <button type="button" class="dc-drawer-fab" onclick={() => (drawerOpen = true)}>
      View card
    </button>
  {/if}
</div>
