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

<div class="dc-library-page dc-projects-library">
  <main class="dc-library-main">
    <header class="dc-projects-header dc-prompts-header">
      <div>
        <p class="dc-eyebrow">Directors Cut / prompt archive</p>
        <h1>Prompts</h1>
        <p class="dc-projects-subtitle">Reusable recipes for building a shot: study the structure, then adapt the language to your project.</p>
      </div>
      <a class="dc-projects-new" href="/create">Build a prompt <span>↗</span></a>
    </header>

    <section class="dc-prompt-recipe" aria-labelledby="prompt-recipe-title">
      <div class="dc-prompt-recipe-intro">
        <p class="dc-eyebrow">How a prompt works</p>
        <h2 id="prompt-recipe-title">A shot is a recipe.</h2>
        <p>Start with the subject. Add the action, camera, light, and finish. The library keeps those ingredients visible so you can edit one decision at a time.</p>
      </div>
      <div class="dc-prompt-recipe-formula" aria-label="Prompt formula">
        <span><b>01</b> Subject</span><i>+</i>
        <span><b>02</b> Action</span><i>+</i>
        <span><b>03</b> Camera</span><i>+</i>
        <span><b>04</b> Light</span><i>+</i>
        <span><b>05</b> Finish</span>
      </div>
    </section>

    <section class="dc-folder-index" aria-labelledby="folder-index-title">
      <div class="dc-folder-index-heading">
        <div><p class="dc-eyebrow">Project folders</p><h2 id="folder-index-title">Browse the archive</h2></div>
        <span>{filtered.length} of {allCards.length} cards</span>
      </div>
      <div class="dc-folder-grid">
        <button type="button" class="dc-folder-card dc-folder-card-all" onclick={() => { familyFilter = ''; searchQuery = ''; }}>
          <span class="dc-folder-tab">ALL PROJECTS</span>
          <span class="dc-folder-line"></span>
          <strong>All projects</strong>
          <small>Complete prompt archive</small>
          <b>{allCards.length} cards <span>↗</span></b>
        </button>
        {#each families as family}
          <button type="button" class="dc-folder-card" class:dc-folder-card-active={familyFilter === family} onclick={() => (familyFilter = family)}>
            <span class="dc-folder-tab">{folderLabel(family).toUpperCase()}</span>
            <span class="dc-folder-line"></span>
            <strong>{folderLabel(family)}</strong>
            <small>{family === 'cross-model' ? 'Comparison-ready systems' : 'Model-specific patterns'}</small>
            <b>{allCards.filter((card) => card.model_family === family).length} cards <span>↗</span></b>
          </button>
        {/each}
      </div>
    </section>

    <div class="dc-library-filters">
      <input type="search" class="dc-library-search" placeholder="Search projects, tags, use cases..." bind:value={searchQuery} />
      <select class="dc-library-select" bind:value={familyFilter}><option value="">All families</option>{#each families as f}<option value={f}>{folderLabel(f)}</option>{/each}</select>
      <select class="dc-library-select" bind:value={confidenceFilter}><option value="">Any confidence</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select>
      <select class="dc-library-select" bind:value={testedFilter}><option value="">All status</option><option value="tested">Tested</option><option value="untested">Untested</option></select>
    </div>
    <p class="dc-table-scroll-hint">Swipe horizontally to inspect the full project table.</p>
    <DenseTable data={filtered} {selectedId} onselect={selectCard} />
  </main>

  {#if drawerOpen}<button type="button" class="dc-drawer-backdrop" aria-label="Close details" onclick={closeDrawer}></button>{/if}
  <CardDrawer card={selectedCard} open={drawerOpen} onclose={closeDrawer} />
  {#if selectedCard && !drawerOpen}<button type="button" class="dc-drawer-fab" onclick={() => (drawerOpen = true)}>View card</button>{/if}
</div>

<style>
  .dc-folder-card { font: inherit; }
</style>
