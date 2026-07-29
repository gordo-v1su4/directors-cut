<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import type { ComparisonRunDetail, ComparisonRun, ComparisonArtifact } from '$lib/types/comparison';
  import { loadComparisonRun, loadComparisonsIndex, getRunGenerationStatus, getGeneratedMediaSummary, type GeneratedMediaSummaryItem } from '$lib/data/comparisons';
  import { loadPromptCardBySlug } from '$lib/data/loader';
  import ComparisonTable from '$lib/components/ComparisonTable.svelte';
  import GenerationStatusBanner from '$lib/components/GenerationStatusBanner.svelte';
  import CopyButton from '$lib/components/CopyButton.svelte';

  let runList = $state<{ run_id: string; title: string; status: string; answer_count: number; artifact_count: number; model_labels: string[]; created: string }[]>([]);
  let selectedRunId = $state('');
  let run = $state<ComparisonRunDetail | null>(null);
  let loading = $state(true);
  let switching = $state(false);
  let error = $state('');
  let promptSlug = $state('');

  let genStatus = $derived(run ? getRunGenerationStatus(run.artifacts) : 'pending');
  let mediaSummary = $derived<GeneratedMediaSummaryItem[]>(run ? getGeneratedMediaSummary(run.artifacts) : []);
  let displayQuestion = $derived(run?.question?.trim() ? run.question : 'No run-level prompt captured.');
  let hasRealArtifacts = $derived(mediaSummary.length > 0);

  async function loadRun(id: string) {
    switching = true;
    error = '';
    try {
      if (promptSlug) {
        const card = await loadPromptCardBySlug(promptSlug);
        if (card) {
          const runMeta: ComparisonRun = {
            run_id: `prompt-${card.slug}`,
            title: `${card.title} — Model Comparison`,
            brief: card.summary,
            question: card.prompt_pattern || card.body_excerpt,
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
        run = await loadComparisonRun(id);
      }
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      loading = false;
      switching = false;
    }
  }

  function selectRun(id: string) {
    selectedRunId = id;
    promptSlug = '';
    loadRun(id);
  }

  onMount(async () => {
    promptSlug = $page.url.searchParams.get('prompt') || '';
    const urlRun = $page.url.searchParams.get('run') || '';
    try {
      const idx = await loadComparisonsIndex();
      runList = idx.runs;
      const startId = urlRun || (runList[0]?.run_id ?? '');
      selectedRunId = startId;
      if (startId || promptSlug) await loadRun(startId);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      loading = false;
    }
  });
</script>

<svelte:head>
  <title>Projects — Directors Cut</title>
</svelte:head>

<div class="dc-page" style="height: 100%; overflow-y: auto; padding: 16px;">
  <div class="dc-projects-intro">
    <div><p class="dc-eyebrow">Prompt experiments and output review</p><h1>Projects</h1></div>
    <a class="dc-create-link" href="/create">+ New prompt project</a>
  </div>
  {#if runList.length > 1}
    <div class="dc-run-switcher" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--dc-border-subtle);">
      {#each runList as r (r.run_id)}
        <button
          class="dc-badge"
          style="cursor: pointer; padding: 6px 10px; font-size: 11px; border-radius: var(--dc-radius); border: 1px solid {r.run_id === selectedRunId ? 'var(--dc-sora)' : 'var(--dc-border)'}; color: {r.run_id === selectedRunId ? 'var(--dc-sora)' : 'var(--dc-text-muted)'}; background: {r.run_id === selectedRunId ? 'rgba(45,212,191,0.08)' : 'transparent'};"
          onclick={() => selectRun(r.run_id)}
        >
          {r.title}
          <span style="color: var(--dc-text-dim); margin-left: 4px;">({r.answer_count} ans · {r.artifact_count} art)</span>
        </button>
      {/each}
    </div>
  {/if}

  {#if loading}
    <div class="dc-empty-state">Loading comparison run…</div>
  {:else if error}
    <div class="dc-empty-state dc-error">{error}</div>
  {:else if run}
    {#if switching}
      <div class="dc-empty-state" style="opacity: 0.5;">Switching…</div>
    {/if}
    <div class="dc-run-header">
      <div class="dc-run-title-line">
        <h2 style="font-size: 18px; font-weight: 700; margin: 0;">{run.title}</h2>
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
        <span class="dc-badge" style="border-color: var(--dc-border); color: {hasRealArtifacts ? 'var(--dc-sora)' : 'var(--dc-text-dim)'};">
          Generated media: {mediaSummary.length}
        </span>
        <span class="dc-badge" style="border-color: var(--dc-border); color: var(--dc-text-muted);">
          Attempt records: {run.artifacts.length}
        </span>
        {#if promptSlug}
          <span class="dc-badge" style="border-color: var(--dc-border); color: var(--dc-text-muted);">
            From prompt: {promptSlug}
          </span>
        {/if}
      </div>

      <div class="dc-brief-panel">
        <div class="dc-brief-label">Brief</div>
        <p style="margin: 0; color: var(--dc-text-muted); font-size: 12px; line-height: 1.5;">{run.brief || 'No brief.'}</p>
      </div>

      <div class="dc-brief-panel">
        <div class="dc-brief-label">Prompt</div>
        <pre>{displayQuestion}</pre>
      </div>
    </div>

    <GenerationStatusBanner status={genStatus} artifacts={run.artifacts} />

    {#if hasRealArtifacts}
      <div class="dc-gen-media-summary" style="margin-bottom: 14px; padding: 14px; border: 1px solid var(--dc-border-subtle); border-radius: var(--dc-radius); background: var(--dc-bg-elev);">
        <div class="dc-brief-label" style="margin-bottom: 8px;">Generated Media ({mediaSummary.length} artifact{mediaSummary.length === 1 ? '' : 's'})</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
          {#each mediaSummary as item (item.artifact_id)}
            <div style="border: 1px solid var(--dc-border-subtle); border-radius: var(--dc-radius); overflow: hidden; background: var(--dc-bg);">
              <div style="aspect-ratio: 16 / 9; overflow: hidden; background: var(--dc-bg-elev-2);">
                {#if item.thumbnail_url || item.media_url}
                  {#if item.artifact_type === 'video_result' || item.artifact_type === 'end_video'}
                    <video src={item.media_url} poster={item.thumbnail_url} preload="metadata" muted style="width:100%;height:100%;object-fit:cover;display:block;"></video>
                  {:else}
                    <img src={item.thumbnail_url ?? item.media_url} alt={item.title} loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block;" />
                  {/if}
                {/if}
              </div>
              <div style="padding: 6px 8px;">
                <div style="font-size: 11px; color: var(--dc-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">{item.title}</div>
                <div style="font-size: 9px; color: var(--dc-text-dim); margin-top: 2px;">{item.provider} · {item.artifact_type.replace(/_/g, ' ')} · {item.status ?? 'generated'}</div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <div class="dc-comparison-table-scroll-outer">
      <div class="dc-comparison-table-scroll-inner">
        <ComparisonTable {run} rows={run.rows} />
      </div>
      <!-- Edge cue overlay: visible when table is wider than viewport -->
      <div class="dc-table-edge-cue" style="position: absolute; right: 0; top: 0; bottom: 0; width: 32px; pointer-events: none; background: linear-gradient(to left, var(--dc-bg-elev), transparent); display: flex; align-items: center; justify-content: flex-end; padding-right: 4px;">
        <span style="writing-mode: vertical-rl; text-orientation: mixed; font-size: 9px; color: var(--dc-text-dim); pointer-events: auto;">→ more</span>
      </div>
    </div>
  {:else}
    <div class="dc-empty-state">No comparison run selected.</div>
  {/if}
</div>
