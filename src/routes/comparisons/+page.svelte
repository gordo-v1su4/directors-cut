<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import ArtifactPreview from '$lib/components/ArtifactPreview.svelte';
  import VersionDropzone from '$lib/components/VersionDropzone.svelte';
  import { page } from '$app/stores';
  import type { ComparisonRunDetail, ComparisonRun, ComparisonArtifact } from '$lib/types/comparison';
  import { loadComparisonRun, loadComparisonsIndex, getRunGenerationStatus, getGeneratedMediaSummary, type GeneratedMediaSummaryItem } from '$lib/data/comparisons';
  import { parseRunQuestion } from '$lib/data/run-brief';
  import { loadPromptCardBySlug } from '$lib/data/loader';
  import ComparisonTable from '$lib/components/ComparisonTable.svelte';
  import GenerationStatusBanner from '$lib/components/GenerationStatusBanner.svelte';
  import CopyButton from '$lib/components/CopyButton.svelte';

  let runList = $state<{ run_id: string; title: string; logline?: string; preview?: ComparisonArtifact | null; status: string; answer_count: number; artifact_count: number; model_labels: string[]; created: string }[]>([]);
  let selectedRunId = $state('');
  let run = $state<ComparisonRunDetail | null>(null);
  let loading = $state(true);
  let switching = $state(false);
  let error = $state('');
  let promptSlug = $state('');

  let genStatus = $derived(run ? getRunGenerationStatus(run.artifacts) : 'pending');
  let mediaSummary = $derived<GeneratedMediaSummaryItem[]>(run ? getGeneratedMediaSummary(run.artifacts) : []);
  let displayQuestion = $derived(run?.question?.trim() ? run.question : '');
  let parsedRun = $derived(parseRunQuestion(displayQuestion));
  let displayBrief = $derived(run?.brief?.trim() || parsedRun.creativeBrief || 'No creative brief saved for this run.');
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
        const detail = await loadComparisonRun(id);
        if (selectedRunId === id) run = detail;
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

  async function refreshSelectedRun() {
    if (selectedRunId) await loadRun(selectedRunId);
  }

  onMount(() => {
    let busy = false;
    const timer = setInterval(async () => {
      if (busy || !selectedRunId) return;
      busy = true;
      const id = selectedRunId;
      try {
        const detail = await loadComparisonRun(id);
        if (selectedRunId === id && JSON.stringify(detail) !== JSON.stringify(run)) run = detail;
        runList = (await loadComparisonsIndex()).runs.sort((a,b)=>b.created.localeCompare(a.created));
      } finally { busy = false; }
    }, 10000);
    void (async () => {
    promptSlug = $page.url.searchParams.get('prompt') || '';
    const urlRun = $page.url.searchParams.get('run') || '';
    try {
      const idx = await loadComparisonsIndex();
      runList = idx.runs.sort((a,b)=>b.created.localeCompare(a.created));
      const startId = urlRun || (runList[0]?.run_id ?? '');
      selectedRunId = startId;
      if (startId || promptSlug) await loadRun(startId);
    } catch (e) {
      error = e instanceof Error ? e.message : String(e);
    } finally {
      loading = false;
    }
    })();
    return () => clearInterval(timer);
  });
</script>

<svelte:head>
  <title>Projects — Directors Cut</title>
</svelte:head>

<div class="dc-page dc-page-shell">
  <div class="dc-projects-intro">
    <div><p class="dc-eyebrow">Prompt experiments and output review</p><h1>Projects</h1></div>
    <a class="dc-create-link" href={resolve('/create')}>+ New prompt project</a>
  </div>
  {#if runList.length > 1}
    <div class="dc-run-switcher" aria-label="Projects">
      {#each runList as r, index (r.run_id)}
        <button
          class:dc-run-card-active={r.run_id === selectedRunId}
          class="dc-run-card"
          aria-pressed={r.run_id === selectedRunId}
          aria-describedby={`logline-${r.run_id}`}
          onclick={() => selectRun(r.run_id)}
        >
          <span class="dc-run-card-art">
            {#if r.preview}<ArtifactPreview artifact={r.preview} />{:else}<span class="dc-run-card-empty">No generated media yet</span>{/if}
            <span class="dc-run-card-meta" id={`logline-${r.run_id}`}>{r.logline || 'Logline not added yet.'}</span>
          </span>
          <span class="dc-run-card-copy">
            <strong>{r.title}</strong>
          </span>
          <span class="dc-run-card-arrow" aria-hidden="true">↗</span>
        </button>
      {/each}
    </div>
  {/if}

  {#if loading}
    <div class="dc-empty-state">Loading project…</div>
  {:else if error}
    <div class="dc-empty-state dc-error">{error}</div>
  {:else if run}
    {#if switching}
      <div class="dc-empty-state" style="opacity: 0.5;">Switching…</div>
    {/if}
    <div class="dc-run-header">
      <h2 style="font-size:20px;margin:0;">{run.title}</h2>
      {#if run.logline}<p style="color:var(--dc-text-muted);font-size:13px;line-height:1.6;margin:8px 0 0;">{run.logline}</p>{/if}
    </div>
    <ComparisonTable {run} rows={run.rows} ondecision={refreshSelectedRun} onrefresh={refreshSelectedRun} />
    {#key run.run_id}<VersionDropzone runId={run.run_id} title={run.title} onAdded={refreshSelectedRun} />{/key}
    <p style="color:var(--dc-text-muted);font-size:12px;">Add a video, then use Edit version details to attach its shot grid, prompt and video model.</p>
    {#if displayQuestion}
      <details class="project-source">
        <summary>Project source</summary>
        <p>{displayBrief}</p>
        <pre>{displayQuestion}</pre>
      </details>
    {/if}

  {:else}
    <div class="dc-empty-state">No project selected.</div>
  {/if}
</div>

<style>
  .project-source {margin-top:24px;color:var(--dc-text-muted);font-size:12px;}
  .project-source summary {cursor:pointer;}
  .project-source pre {white-space:pre-wrap;overflow-wrap:anywhere;max-height:320px;overflow:auto;line-height:1.7;}

  .dc-run-switcher { display:grid;grid-template-columns:repeat(auto-fit,minmax(238px,1fr));gap:12px;margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid var(--dc-border-subtle); }
  .dc-run-card { display:flex;flex-direction:column;justify-content:flex-start;min-width:0;padding:0;overflow:hidden;border:1px solid var(--dc-border);border-radius:10px;background:var(--dc-bg-elev);color:var(--dc-text);text-align:left;cursor:pointer; }
  .dc-run-card:hover,.dc-run-card:focus-visible {border-color:var(--dc-text-dim);outline:none;}
  .dc-run-card-active {border-color:var(--dc-accent);}
  .dc-run-card-art {position:relative;display:block;width:100%;aspect-ratio:16/9;overflow:hidden;background:#0a0a0b;}
  .dc-run-card-empty {display:grid;place-items:center;height:100%;padding:12px;color:var(--dc-text-dim);font-size:10px;}
  .dc-run-card-copy {display:flex;flex-direction:column;gap:7px;padding:14px 12px;}
  .dc-run-card-copy strong {font-size:14px;line-height:1.25;}
  .dc-run-card-meta {position:absolute;inset:0;display:flex;align-items:center;padding:18px;background:rgba(8,8,10,.92);color:var(--dc-text);font-size:12px;line-height:1.5;opacity:0;transition:opacity .15s ease;overflow:auto;}
  .dc-run-card:hover .dc-run-card-meta,.dc-run-card:focus-visible .dc-run-card-meta {opacity:1;}
  @media(prefers-reduced-motion:reduce) {.dc-run-card-meta {transition:none;}}
  .dc-run-card-arrow {display:none;}
  @media(max-width:860px) {.dc-run-switcher {display:flex;overflow-x:auto;} .dc-run-card {flex:0 0 280px;}}
</style>
