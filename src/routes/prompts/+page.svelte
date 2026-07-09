<script lang="ts">
  import { onMount } from 'svelte';
  import { loadPromptCards } from '$lib/data/loader';
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import DenseTable from '$lib/components/DenseTable.svelte';
  import CardDrawer from '$lib/components/CardDrawer.svelte';

  let allCards: PromptCardIndex[] = $state.raw([]);
  let selectedId = $state<string | null>(null);

  // Filters
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

  onMount(async () => {
    allCards = await loadPromptCards();
  });
</script>

<div style="display: flex; height: 100%; overflow: hidden;">
  <!-- Table + filters -->
  <div style="flex: 1; overflow: auto; padding: 12px;">
    <!-- Filter bar -->
    <div style="display: flex; gap: 8px; margin-bottom: 10px; align-items: center; flex-wrap: wrap;">
      <input
        type="text"
        placeholder="Search cards..."
        bind:value={searchQuery}
        style="background: var(--dc-bg-elev); border: 1px solid var(--dc-border); border-radius: var(--dc-radius); padding: 5px 10px; color: var(--dc-text); font-size: 12px; width: 220px;"
      />
      <select bind:value={familyFilter} style="background: var(--dc-bg-elev); border: 1px solid var(--dc-border); border-radius: var(--dc-radius); padding: 5px 8px; color: var(--dc-text); font-size: 12px;">
        <option value="">All Families</option>
        {#each families as f}
          <option value={f}>{f}</option>
        {/each}
      </select>
      <select bind:value={confidenceFilter} style="background: var(--dc-bg-elev); border: 1px solid var(--dc-border); border-radius: var(--dc-radius); padding: 5px 8px; color: var(--dc-text); font-size: 12px;">
        <option value="">Any Confidence</option>
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
      <select bind:value={testedFilter} style="background: var(--dc-bg-elev); border: 1px solid var(--dc-border); border-radius: var(--dc-radius); padding: 5px 8px; color: var(--dc-text); font-size: 12px;">
        <option value="">All</option>
        <option value="tested">Tested</option>
        <option value="untested">Untested</option>
      </select>
      <span style="font-size: 11px; color: var(--dc-text-dim); margin-left: auto;">{filtered.length} / {allCards.length} cards</span>
    </div>

    <DenseTable data={filtered} {selectedId} onselect={(id) => (selectedId = id)} />
  </div>

  <!-- Detail drawer -->
  <CardDrawer card={selectedCard} />
</div>