<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import type { ComparisonRunDetail, ComparisonRun } from '$lib/types/comparison';
  import { loadComparisonRun } from '$lib/data/comparisons';
  import { loadPromptCardBySlug } from '$lib/data/loader';
  import ComparisonTable from '$lib/components/ComparisonTable.svelte';
  import CopyButton from '$lib/components/CopyButton.svelte';

  const PLANNED_RUN_ID = '2026-07-netflix-teaser-title-slam-001';

  let run = $state<ComparisonRunDetail | null>(null);
  let loading = $state(true);
  let error = $state('');
  let promptSlug = $state('');

  onMount(async () => {
    promptSlug = $page.url.searchParams.get('prompt') || '';

    try {
      if (promptSlug) {
        const card = await loadPromptCardBySlug(promptSlug);
        if (card) {
          const runMeta: ComparisonRun = {
            run_id: `prompt-${card.slug}`,
            title: `${card.title} — Model Comparison`,
            question: card.body_excerpt,
            created: card.created,
            created_by: 'prompt-card',
            status: 'running',
            models_requested: [],
            target_models: card.model_targets,
            tags: card.tags,
          };
          run = await loadComparisonRun(runMeta.run_id, runMeta);
        } else {
          error = `Prompt card "${promptSlug}" not found.`;
        }
      } else {
        run = await loadComparisonRun(PLANNED_RUN_ID);
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Comparison Lab — Directors Cut</title>
</svelte:head>

<div class="dc-page" style="height: 100%; overflow-y: auto; padding: 16px;">
  {#if loading}
    <div class="dc-empty-state">Loading comparison run…</div>
  {:else if error}
    <div class="dc-empty-state dc-error">{error}</div>
  {:else if run}
    <div class="dc-run-header">
      <div class="dc-run-title-line">
        <h1 style="font-size: 18px; font-weight: 700; margin: 0;">{run.title}</h1>
        <div class="dc-run-actions">
          <CopyButton text={run.question} label="Copy prompt" size={11} />
          <button class="dc-action-button" disabled>Edit run</button>
        </div>
      </div>
      <div class="dc-run-meta">
        <span class="dc-badge" style="border-color: var(--dc-border); color: var(--dc-text-muted);">
          Run: {run.run_id}
        </span>
        <span class="dc-badge" style="border-color: var(--dc-border); color: var(--dc-text-muted);">
          Status: {run.status}
        </span>
        <span class="dc-badge" style="border-color: var(--dc-border); color: var(--dc-text-muted);">
          Answers: {run.answers.length}
        </span>
        {#if promptSlug}
          <span class="dc-badge" style="border-color: var(--dc-border); color: var(--dc-text-muted);">
            From prompt: {promptSlug}
          </span>
        {/if}
      </div>

      <div class="dc-brief-panel">
        <div class="dc-brief-label">Brief / prompt</div>
        <pre>{run.question}</pre>
      </div>
    </div>

    <div class="dc-comparison-table-outer">
      <ComparisonTable {run} rows={run.rows} />
    </div>
  {:else}
    <div class="dc-empty-state">No comparison run selected.</div>
  {/if}
</div>
