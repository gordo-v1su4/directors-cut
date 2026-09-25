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
  import { renameProject, showTitle, signInOwner, SignInRequired } from '$lib/data/titles';

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
  function formatDate(value: string | undefined) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value.slice(0, 10) : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  let editingTitle = $state(false);
  let titleDraft = $state('');
  let renameBusy = $state(false);
  let renameError = $state('');
  let needSignIn = $state(false);
  let password = $state('');

  function startRename() {
    titleDraft = run?.title ?? '';
    renameError = '';
    editingTitle = true;
  }

  function cancelRename() {
    editingTitle = false;
    renameError = '';
    password = '';
  }

  async function saveTitle(event: SubmitEvent) {
    event.preventDefault();
    if (!run || !titleDraft.trim()) return;
    const runId = run.run_id;
    renameBusy = true;
    renameError = '';
    try {
      if (needSignIn) {
        await signInOwner(password);
        password = '';
        needSignIn = false;
      }
      const title = await renameProject(runId, titleDraft.trim());
      if (run?.run_id === runId) run = { ...run, title };
      runList = runList.map((r) => (r.run_id === runId ? { ...r, title } : r));
      editingTitle = false;
    } catch (error) {
      if (error instanceof SignInRequired) needSignIn = true;
      renameError = error instanceof Error ? error.message : 'Rename failed';
    } finally {
      renameBusy = false;
    }
  }

  function statusLabel(status: string | undefined) {
    const text = (status ?? 'active').replace(/_/g, ' ');
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

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

<div class="dc-room">
  <div class="dc-room-inner">
    <header class="dc-room-head">
      <div>
        <h1 class="dc-room-title">Projects</h1>
        <p class="dc-room-lede">Read what each model wrote, watch every take side by side, and decide what gets cut next.</p>
      </div>
    </header>

    {#if runList.length > 1}
      <div class="posters" role="group" aria-label="Projects">
        {#each runList as r (r.run_id)}
          <button
            class="poster"
            class:active={r.run_id === selectedRunId}
            aria-pressed={r.run_id === selectedRunId}
            onclick={() => selectRun(r.run_id)}
          >
            <span class="poster-art">
              {#if r.preview}<ArtifactPreview artifact={r.preview} />{:else}<span class="poster-empty">No render yet</span>{/if}
            </span>
            <span class="poster-copy">
              <span class="poster-title" title={r.title}>{showTitle(r.title)}</span>
              <span class="poster-meta">{r.artifact_count} {r.artifact_count === 1 ? 'render' : 'renders'}, {formatDate(r.created)}</span>
            </span>
          </button>
        {/each}
      </div>
    {/if}

    {#if loading}
      <p class="room-note">Loading project…</p>
    {:else if error}
      <p class="room-note room-error" role="alert">{error}</p>
    {:else if run}
      <section class="run" aria-labelledby="run-title" class:switching>
        <header class="run-head">
          {#if editingTitle}
            <form class="rename" onsubmit={saveTitle}>
              <input
                class="rename-input"
                bind:value={titleDraft}
                maxlength="120"
                aria-label="Project title"
                disabled={renameBusy}
              />
              {#if needSignIn}
                <input
                  class="rename-input rename-password"
                  type="password"
                  bind:value={password}
                  placeholder="Owner password"
                  autocomplete="current-password"
                  aria-label="Owner password"
                  disabled={renameBusy}
                />
              {/if}
              <button type="submit" class="dc-room-btn dc-room-btn-solid" disabled={renameBusy || !titleDraft.trim() || (needSignIn && !password)}>
                {renameBusy ? 'Saving…' : 'Save'}
              </button>
              <button type="button" class="dc-room-btn" onclick={cancelRename} disabled={renameBusy}>Cancel</button>
            </form>
            {#if renameError}<p class="rename-error" role="alert">{renameError}</p>{/if}
          {:else}
            <div class="run-title-row">
              <h2 id="run-title" class="dc-room-h2" title={run.title}>{showTitle(run.title)}</h2>
              <button type="button" class="rename-btn" onclick={startRename} aria-label="Rename project" title="Rename project">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4" /></svg>
              </button>
            </div>
          {/if}
          <div class="run-head-body">
            {#if run.logline}<p class="run-logline" title={run.logline}>{run.logline}</p>{/if}
            <dl class="run-facts">
              <div><dt>Status</dt><dd>{statusLabel(run.status)}</dd></div>
              <div><dt>Answers</dt><dd>{run.answers?.length ?? 0}</dd></div>
              <div><dt>Renders</dt><dd>{mediaSummary.length}</dd></div>
              <div><dt>Started</dt><dd>{formatDate(run.created)}</dd></div>
            </dl>
          </div>
        </header>

        <ComparisonTable {run} rows={run.rows} ondecision={refreshSelectedRun} onrefresh={refreshSelectedRun} />

        <div class="run-add">
          {#key run.run_id}<VersionDropzone runId={run.run_id} title={run.title} onAdded={refreshSelectedRun} />{/key}
          <p class="room-note">Add a video, then use Edit version details to attach its shot grid, prompt and video model.</p>
        </div>

        {#if displayQuestion}
          <details class="source">
            <summary>
              <span>Project source</span>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg>
            </summary>
            <div class="source-page">
              <p class="source-brief">{displayBrief}</p>
              <pre>{displayQuestion}</pre>
            </div>
          </details>
        {/if}
      </section>
    {:else}
      <p class="room-note">No project selected.</p>
    {/if}
  </div>
</div>

<style>
  .room-note {
    margin: 0;
    color: var(--dc-text-muted);
    font-size: 14px;
    line-height: 1.5;
  }

  .room-error {
    color: #fca5a5;
  }

  /* ── Posters ──────────────────────────────────────────────────── */

  .posters {
    display: grid;
    grid-auto-columns: minmax(220px, 1fr);
    grid-auto-flow: column;
    gap: 14px;
    margin: 0 calc(-1 * var(--room-pad)) 20px;
    padding: 4px var(--room-pad) 8px;
    overflow-x: auto;
    scroll-padding-inline: var(--room-pad);
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
  }

  .posters::-webkit-scrollbar {
    display: none;
  }

  .poster {
    position: relative;
    display: block;
    min-width: 0;
    aspect-ratio: 16 / 9;
    padding: 0;
    overflow: hidden;
    border: 0;
    border-radius: 6px;
    background: #111;
    color: var(--dc-text);
    text-align: left;
    cursor: pointer;
    scroll-snap-align: start;
    outline: 0;
  }

  .poster.active {
    outline: 0;
    box-shadow: inset 0 -3px 0 rgba(255, 255, 255, 0.7);
  }

  .poster:focus-visible {
    outline: 2px solid var(--dc-text);
    outline-offset: 3px;
  }

  .poster-art {
    position: absolute;
    inset: 0;
  }

  .poster-art :global(img),
  .poster-art :global(video) {
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .poster:hover .poster-art :global(img),
  .poster:hover .poster-art :global(video) {
    transform: scale(1.04);
  }

  .poster-empty {
    display: grid;
    height: 100%;
    place-items: center;
    color: var(--dc-text-dim);
    font-size: 13px;
  }

  .poster-copy {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 48px 16px 14px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.9) 20%, transparent);
  }

  .poster-title {
    display: -webkit-box;
    overflow: hidden;
    font: 400 clamp(18px, 1.5vw, 22px) / 1.2 var(--dc-font-serif);
    line-clamp: 1;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .poster-meta {
    color: var(--dc-text-muted);
    font-size: 12px;
  }

  /* ── Selected project ─────────────────────────────────────────── */

  .run {
    transition: opacity 0.2s ease;
  }

  .run.switching {
    opacity: 0.55;
  }

  .run-head {
    padding-bottom: 20px;
  }

  .run-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
  }

  .rename-btn {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 28px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--dc-text-dim);
    cursor: pointer;
    transition: background 0.15s ease, color 0.15s ease;
  }

  .rename-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--dc-text);
  }

  .rename-btn svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .rename {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }

  .rename-input {
    flex: 0 1 480px;
    min-width: 0;
    height: 36px;
    padding: 0 12px;
    border: 0;
    border-radius: 4px;
    background: #161616;
    color: var(--dc-text);
    font: 400 20px var(--dc-font-serif);
    outline: none;
  }

  /* Save and Cancel match the field so the row reads as one control. */
  .rename :global(.dc-room-btn) {
    height: 36px;
    min-height: 36px;
  }

  .rename-password {
    flex: 0 1 200px;
    font: 14px var(--dc-font-sans);
  }

  .rename-error {
    margin: 8px 0 0;
    color: #fca5a5;
    font-size: 13px;
  }

  /* One column: title, a two-line logline, then the facts right under it. */
  .run-head-body {
    display: grid;
    gap: 14px;
    margin-top: 8px;
  }

  .run-logline {
    display: -webkit-box;
    max-width: 80ch;
    margin: 0;
    overflow: hidden;
    color: #d6d3d1;
    font-size: 14px;
    line-height: 1.6;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .run-facts {
    display: grid;
    grid-template-columns: repeat(4, auto);
    justify-content: start;
    gap: 12px 32px;
    margin: 0;
  }

  @media (max-width: 520px) {
    .run-facts {
      grid-template-columns: repeat(2, auto);
    }
  }

  .run-facts dt {
    color: var(--dc-text-dim);
    font-size: 12px;
  }

  .run-facts dd {
    margin: 3px 0 0;
    font-size: 14px;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }

  .run-add {
    display: grid;
    gap: 10px;
    margin-top: 28px;
  }

  /* ── Project source ───────────────────────────────────────────── */

  .source {
    margin-top: 24px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .source summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 52px;
    color: var(--dc-text);
    font: 400 20px / 1 var(--dc-font-serif);
    list-style: none;
    cursor: pointer;
  }

  .source summary::-webkit-details-marker {
    display: none;
  }

  .source summary svg {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.75;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.2s ease;
  }

  .source[open] summary svg {
    transform: rotate(180deg);
  }

  .source summary:focus-visible {
    outline: 2px solid var(--dc-text);
    outline-offset: 3px;
  }

  .source-page {
    padding: clamp(20px, 2.6vw, 32px);
    border: 0;
    border-radius: 6px;
    background: #0e0e0e;
    font-family: var(--dc-font-sans);
  }

  .source-brief {
    max-width: 70ch;
    margin: 0 0 18px;
    color: var(--dc-text);
    font-size: 14px;
    line-height: 1.7;
  }

  .source pre {
    max-height: 420px;
    margin: 0;
    overflow: auto;
    color: #d6d3d1;
    font: 13px / 1.65 var(--dc-font-sans);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
</style>
