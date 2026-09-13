<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import type { ComparisonRunDetail, ComparisonRun, ComparisonArtifact } from '$lib/types/comparison';
  import { loadComparisonRun, loadComparisonsIndex, getRunGenerationStatus, getGeneratedMediaSummary, type GeneratedMediaSummaryItem } from '$lib/data/comparisons';
  import { parseRunQuestion } from '$lib/data/run-brief';
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
  let displayQuestion = $derived(run?.question?.trim() ? run.question : '');
  let parsedRun = $derived(parseRunQuestion(displayQuestion));
  let displayBrief = $derived(run?.brief?.trim() || parsedRun.creativeBrief || 'No creative brief saved for this run.');
  let hasRealArtifacts = $derived(mediaSummary.length > 0);
  let currentModelRows = $derived(run?.rows.filter((row) => {
    const label = row.answer.model_name.toLowerCase();
    return row.answer.ui_status !== 'missing'
      && (label.includes('chatgpt') || label.startsWith('gpt-') || label.includes('claude'));
  }) ?? []);
  let readyModelRows = $derived(currentModelRows.filter((row) =>
    [...row.promptOnlyVideoSeedanceSlot.versions, ...row.promptOnlyVideoSoraSlot.versions]
      .some((artifact) => artifact.status === 'generated' && !!artifact.media_url)
  ));
  let judgingUnlocked = $derived(currentModelRows.length === 2 && readyModelRows.length === 2);

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

  async function refreshSelectedRun() {
    if (selectedRunId) await loadRun(selectedRunId);
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

<div class="dc-page dc-page-shell">
  <div class="dc-projects-intro">
    <div><p class="dc-eyebrow">Prompt experiments and output review</p><h1>Projects</h1></div>
    <a class="dc-create-link" href="/create">+ New prompt project</a>
  </div>
  {#if runList.length > 1}
    <div class="dc-run-switcher" aria-label="Projects">
      {#each runList as r, index (r.run_id)}
        <button
          class:dc-run-card-active={r.run_id === selectedRunId}
          class="dc-run-card"
          aria-pressed={r.run_id === selectedRunId}
          onclick={() => selectRun(r.run_id)}
        >
          <span class={`dc-run-card-art art-${(index % 4) + 1}`} aria-hidden="true">
            <span class="dc-run-card-art-index">{String(index + 1).padStart(2, '0')}</span>
            <span class="dc-run-card-art-lines"></span>
            <span class="dc-run-card-art-mark">{r.title.slice(0, 2).toUpperCase()}</span>
          </span>
          <span class="dc-run-card-copy">
            <span class="dc-run-card-kicker">Project {String(index + 1).padStart(2, '0')} / {r.status}</span>
            <strong>{r.title}</strong>
            <span class="dc-run-card-meta">{r.answer_count} answers · {r.artifact_count} artifacts</span>
          </span>
          <span class="dc-run-card-arrow" aria-hidden="true">↗</span>
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
        <div class="dc-brief-label">Creative brief</div>
        <p style="margin: 0; color: var(--dc-text-muted); font-size: 12px; line-height: 1.5; white-space: pre-wrap;">{displayBrief}</p>
      </div>

      {#if displayQuestion}
        <details class="dc-brief-panel">
          <summary class="dc-brief-label" style="cursor: pointer;">Raycast input package (what ChatGPT/Claude received)</summary>
          <pre style="margin-top: 8px;">{displayQuestion}</pre>
        </details>
      {/if}
    </div>

    {#if currentModelRows.length > 0}
      <div class="dc-next-steps">
        <div class="dc-brief-label">What to do next</div>
        <ol>
          <li><strong>Pick a concept</strong> — scroll to the table below and click <strong>Approve idea</strong> on ChatGPT or Claude (pinned right column).</li>
          <li><strong>Generate grid</strong> (optional) — click <strong>Generate grid</strong> in the Shot grid column for a Nano Banana storyboard.</li>
          <li><strong>Generate video</strong> — after approval, use <strong>Get live Higgsfield quote</strong>. The local bridge submits, polls, downloads, records provenance, rebuilds the index, and returns the playable result here.</li>
        </ol>
      </div>
    {/if}

    <GenerationStatusBanner status={genStatus} artifacts={run.artifacts} />

    <div class="dc-review-progress" data-ready={judgingUnlocked}>
      <div><span>Serial video review</span><strong>{readyModelRows.length}/2 videos ready</strong></div>
      <p>{judgingUnlocked ? 'Judging unlocked.' : 'Approve, quote, and generate each model independently. Judging remains locked until both videos are playable.'}</p>
    </div>

    {#if hasRealArtifacts}
      <div class="dc-gen-media-summary" style="margin-bottom: 14px; padding: 14px; border: 1px solid var(--dc-border-subtle); border-radius: var(--dc-radius); background: var(--dc-bg-elev);">
        <div class="dc-brief-label" style="margin-bottom: 8px;">Generated Media ({mediaSummary.length} artifact{mediaSummary.length === 1 ? '' : 's'})</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px;">
          {#each mediaSummary as item (item.artifact_id)}
            <div style="border: 1px solid var(--dc-border-subtle); border-radius: var(--dc-radius); overflow: hidden; background: var(--dc-bg);">
              <div style="aspect-ratio: 16 / 9; overflow: hidden; background: var(--dc-bg-elev-2);">
                {#if item.thumbnail_url || item.media_url}
                  {#if item.artifact_type === 'video_result' || item.artifact_type === 'end_video'}
                    <video src={item.media_url} preload="metadata" muted playsinline style="width:100%;height:100%;object-fit:cover;display:block;"></video>
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

    <p class="dc-table-scroll-hint">Each model below is one card — scroll down through <strong>prompt source</strong>, the generated slots, then <strong>concept gate</strong> to approve.</p>

    <div class="dc-comparison-table-scroll-outer">
      <div class="dc-comparison-table-scroll-inner">
        <ComparisonTable {run} rows={run.rows} ondecision={refreshSelectedRun} onrefresh={refreshSelectedRun} {judgingUnlocked} />
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

<style>
  .dc-run-switcher {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(238px, 1fr));
    gap: 12px;
    margin-bottom: 22px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--dc-border-subtle);
  }

  .dc-run-card {
    position: relative;
    display: grid;
    grid-template-columns: 92px minmax(0, 1fr) 18px;
    min-height: 118px;
    padding: 0;
    overflow: hidden;
    border: 1px solid var(--dc-border);
    border-radius: 10px;
    background: linear-gradient(135deg, var(--dc-bg-elev), #0d0d0f);
    color: var(--dc-text);
    text-align: left;
    cursor: pointer;
    transition: border-color .18s ease, transform .18s ease, background .18s ease;
  }

  .dc-run-card:hover,
  .dc-run-card:focus-visible {
    border-color: var(--dc-text-dim);
    background: var(--dc-bg-elev-2);
    transform: translateY(-2px);
    outline: none;
  }

  .dc-run-card-active {
    border-color: var(--dc-accent);
    box-shadow: inset 0 0 0 1px var(--dc-accent), 0 12px 24px rgba(0,0,0,.18);
  }

  .dc-run-card-art {
    position: relative;
    display: block;
    min-height: 118px;
    overflow: hidden;
    border-right: 1px solid var(--dc-border);
    background: #0a0a0b;
  }

  .dc-run-card-art::before,
  .dc-run-card-art::after {
    content: '';
    position: absolute;
    inset: 18px 10px;
    border: 1px solid rgba(250,250,250,.32);
    transform: rotate(-8deg);
  }

  .dc-run-card-art::after {
    inset: 38px 4px 8px 22px;
    border-color: rgba(199,213,109,.5);
    transform: rotate(12deg);
  }

  .dc-run-card-art.art-2 { background: #11120f; }
  .dc-run-card-art.art-2::after { border-color: rgba(180, 190, 125, .55); transform: rotate(-16deg); }
  .dc-run-card-art.art-3 { background: #101214; }
  .dc-run-card-art.art-3::before { transform: rotate(18deg); }
  .dc-run-card-art.art-3::after { border-color: rgba(151, 170, 190, .55); }
  .dc-run-card-art.art-4 { background: #14110f; }
  .dc-run-card-art.art-4::before { transform: rotate(2deg); }
  .dc-run-card-art.art-4::after { border-color: rgba(205, 157, 108, .5); transform: rotate(-22deg); }

  .dc-run-card-art-lines {
    position: absolute;
    inset: 0;
    background: repeating-linear-gradient(0deg, transparent 0 9px, rgba(255,255,255,.09) 10px 11px);
    opacity: .65;
  }

  .dc-run-card-art-index,
  .dc-run-card-art-mark {
    position: absolute;
    z-index: 1;
    font-family: var(--dc-font-mono);
    color: var(--dc-text);
  }

  .dc-run-card-art-index { top: 9px; left: 10px; font-size: 10px; letter-spacing: .12em; }
  .dc-run-card-art-mark { right: 8px; bottom: 8px; color: var(--dc-accent); font-size: 18px; letter-spacing: -.08em; }

  .dc-run-card-copy {
    display: flex;
    min-width: 0;
    flex-direction: column;
    justify-content: center;
    gap: 7px;
    padding: 14px 12px;
  }

  .dc-run-card-copy strong {
    display: -webkit-box;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.16;
    letter-spacing: -.02em;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }

  .dc-run-card-kicker,
  .dc-run-card-meta {
    color: var(--dc-text-dim);
    font-family: var(--dc-font-mono);
    font-size: 9px;
    letter-spacing: .08em;
    text-transform: uppercase;
  }

  .dc-run-card-meta { letter-spacing: .02em; text-transform: none; }
  .dc-run-card-arrow { align-self: start; padding-top: 12px; color: var(--dc-text-dim); font-size: 16px; }

  @media (max-width: 860px) {
    .dc-run-switcher {
      display: flex;
      gap: 10px;
      margin-inline: calc(var(--dc-page-pad) * -1);
      padding-inline: var(--dc-page-pad);
      overflow-x: auto;
      scroll-snap-type: x proximity;
      scrollbar-width: none;
    }
    .dc-run-switcher::-webkit-scrollbar { display: none; }
    .dc-run-card { flex: 0 0 min(84vw, 320px); scroll-snap-align: start; }
  }
</style>
