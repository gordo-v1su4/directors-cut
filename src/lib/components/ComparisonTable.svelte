<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { ComparisonRow, ComparisonRun, ComparisonRunDetail, GenerationPrompt, ModelAnswer } from '$lib/types/comparison';
  import ModelAnswerCell from './ModelAnswerCell.svelte';
  import VersionedArtifactCell from './VersionedArtifactCell.svelte';
  import ReferenceImageStrip from './ReferenceImageStrip.svelte';
  import { callBridgeTool } from '$lib/bridge/types';
  import type {
    GetImageGenerationStatusInput,
    GetImageGenerationStatusOutput,
    GetVideoGenerationStatusInput,
    GetVideoGenerationStatusOutput,
    QuoteImageGenerationInput,
    QuoteImageGenerationOutput,
    QuoteVideoGenerationInput,
    QuoteVideoGenerationOutput,
    RecordConceptDecisionInput,
    RecordConceptDecisionOutput,
    SubmitImageGenerationInput,
    SubmitImageGenerationOutput,
    SubmitVideoGenerationInput,
    SubmitVideoGenerationOutput,
  } from '$lib/bridge/types';

  let {
    run,
    rows,
    ondecision,
    onrefresh,
    judgingUnlocked = false,
  }: {
    run: ComparisonRun | ComparisonRunDetail;
    rows: ComparisonRow[];
    ondecision?: () => Promise<void> | void;
    onrefresh?: () => Promise<void> | void;
    judgingUnlocked?: boolean;
  } = $props();

  const BRIDGE_URL = import.meta.env.VITE_RAYCAST_BRIDGE_URL ?? 'http://127.0.0.1:8787';
  const BRIDGE_TOKEN = import.meta.env.VITE_RAYCAST_BRIDGE_TOKEN ?? '';
  let decisionNotes = $state<Record<string, string>>({});
  let savingAnswerId = $state('');
  let decisionError = $state<Record<string, string>>({});

  interface RowGenerationState {
    quote?: QuoteVideoGenerationOutput;
    submission?: SubmitVideoGenerationOutput | GetVideoGenerationStatusOutput;
    busy?: boolean;
    error?: string;
  }

  interface RowGridGenerationState {
    quote?: QuoteImageGenerationOutput;
    submission?: SubmitImageGenerationOutput | GetImageGenerationStatusOutput;
    busy?: boolean;
    error?: string;
  }

  let generationByAnswer = $state<Record<string, RowGenerationState>>({});
  let gridByAnswer = $state<Record<string, RowGridGenerationState>>({});
  const pollTimers = new Map<string, ReturnType<typeof setTimeout>>();
  const pollFailures = new Map<string, number>();
  const gridPollTimers = new Map<string, ReturnType<typeof setTimeout>>();
  const gridPollFailures = new Map<string, number>();

  let promptsMap = $derived(
    new Map<string, GenerationPrompt>(
      ('prompts' in run ? run.prompts : []).map((p) => [p.prompt_id, p])
    )
  );

  let answersMap = $derived(
    new Map<string, ModelAnswer>(
      ('answers' in run ? run.answers : []).map((a) => [a.answer_id, a])
    )
  );

  let scrollContainer: HTMLElement | null = $state(null);
  let showEdgeCue = $state(false);

  $effect(() => {
    if (!scrollContainer) return;
    function onScroll() {
      if (!scrollContainer) return;
      // Show edge cue when there's more content to the right
      showEdgeCue = scrollContainer.scrollLeft + scrollContainer.clientWidth < scrollContainer.scrollWidth - 4;
    }
    scrollContainer.addEventListener('scroll', onScroll);
    onScroll();
    return () => scrollContainer?.removeEventListener('scroll', onScroll);
  });

  function scrollRight() {
    scrollContainer?.scrollBy({ left: 300, behavior: 'smooth' });
  }

  async function recordDecision(row: ComparisonRow, decision: 'approved' | 'rejected') {
    if (!BRIDGE_TOKEN) {
      decisionError = { ...decisionError, [row.answer.answer_id]: 'Bridge token is not configured for this local UI session.' };
      return;
    }
    savingAnswerId = row.answer.answer_id;
    decisionError = { ...decisionError, [row.answer.answer_id]: '' };
    try {
      await callBridgeTool<RecordConceptDecisionInput, RecordConceptDecisionOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'record_concept_decision',
        {
          run_id: run.run_id,
          answer_id: row.answer.answer_id,
          decision,
          note: decisionNotes[row.answer.answer_id]?.trim() || undefined,
        },
      );
      generationByAnswer = { ...generationByAnswer, [row.answer.answer_id]: {} };
      await ondecision?.();
    } catch (error) {
      decisionError = { ...decisionError, [row.answer.answer_id]: error instanceof Error ? error.message : String(error) };
    } finally {
      savingAnswerId = '';
    }
  }

  function updateGeneration(answerId: string, patch: Partial<RowGenerationState>) {
    generationByAnswer = {
      ...generationByAnswer,
      [answerId]: { ...generationByAnswer[answerId], ...patch },
    };
  }

  function hasReadyVideo(row: ComparisonRow): boolean {
    return [...row.promptOnlyVideoSeedanceSlot.versions, ...row.promptOnlyVideoSoraSlot.versions]
      .some((artifact) => artifact.status === 'generated' && !!artifact.media_url);
  }

  function rowGenerationStatus(row: ComparisonRow): 'Pending' | 'Approved' | 'Quoted' | 'Generating' | 'Ready' | 'Failed' {
    if (hasReadyVideo(row)) return 'Ready';
    const state = generationByAnswer[row.answer.answer_id];
    const job = state?.submission?.jobs.find((candidate) => candidate.answer_id === row.answer.answer_id);
    if (job?.status === 'completed') return 'Ready';
    if (job?.status === 'failed' || state?.submission?.status === 'failed') return 'Failed';
    if (state?.submission) return 'Generating';
    if (state?.quote) return 'Quoted';
    if (row.canGenerate) return 'Approved';
    return 'Pending';
  }

  function storageKey(answerId: string): string {
    return `directors-cut:generation:${run.run_id}:${answerId}`;
  }

  function soraPromptForRow(row: ComparisonRow): string | null {
    const pkg = row.answer.structured_prompt;
    if (pkg && typeof pkg === 'object' && 'sora_prompt' in pkg && typeof pkg.sora_prompt === 'string' && pkg.sora_prompt.trim()) {
      return pkg.sora_prompt.trim();
    }
    return null;
  }

  function gridStorageKey(answerId: string): string {
    return `directors-cut:grid-generation:${run.run_id}:${answerId}`;
  }

  function updateGrid(answerId: string, patch: Partial<RowGridGenerationState>) {
    gridByAnswer = {
      ...gridByAnswer,
      [answerId]: { ...gridByAnswer[answerId], ...patch },
    };
  }

  async function requestGridQuote(row: ComparisonRow) {
    if (!soraPromptForRow(row) || !BRIDGE_TOKEN) {
      updateGrid(row.answer.answer_id, { error: BRIDGE_TOKEN ? 'This row needs a valid concept prompt.' : 'Bridge token is not configured for this local UI session.' });
      return;
    }
    updateGrid(row.answer.answer_id, { busy: true, error: '', quote: undefined, submission: undefined });
    try {
      const quote = await callBridgeTool<QuoteImageGenerationInput, QuoteImageGenerationOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'quote_image_generation',
        { run_id: run.run_id, answer_id: row.answer.answer_id },
      );
      updateGrid(row.answer.answer_id, { quote });
    } catch (error) {
      updateGrid(row.answer.answer_id, { error: error instanceof Error ? error.message : String(error) });
    } finally {
      updateGrid(row.answer.answer_id, { busy: false });
    }
  }

  async function confirmGridGeneration(row: ComparisonRow) {
    const quote = gridByAnswer[row.answer.answer_id]?.quote;
    if (!quote) return;
    updateGrid(row.answer.answer_id, { busy: true, error: '' });
    try {
      const submission = await callBridgeTool<SubmitImageGenerationInput, SubmitImageGenerationOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'submit_image_generation',
        { quote_id: quote.quote_id, confirmed: true },
      );
      updateGrid(row.answer.answer_id, { submission });
      localStorage.setItem(gridStorageKey(row.answer.answer_id), submission.generation_id);
      scheduleGridPoll(row, submission.generation_id, 1200);
    } catch (error) {
      updateGrid(row.answer.answer_id, { error: error instanceof Error ? error.message : String(error) });
    } finally {
      updateGrid(row.answer.answer_id, { busy: false });
    }
  }

  function scheduleGridPoll(row: ComparisonRow, generationId: string, delay = 5000) {
    const existing = gridPollTimers.get(row.answer.answer_id);
    if (existing) clearTimeout(existing);
    gridPollTimers.set(row.answer.answer_id, setTimeout(() => pollGridGeneration(row, generationId), delay));
  }

  async function pollGridGeneration(row: ComparisonRow, generationId: string) {
    try {
      const submission = await callBridgeTool<GetImageGenerationStatusInput, GetImageGenerationStatusOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'get_image_generation_status',
        { generation_id: generationId },
      );
      updateGrid(row.answer.answer_id, { submission, error: '' });
      gridPollFailures.delete(row.answer.answer_id);
      await onrefresh?.();
      if (!['ready_for_review', 'failed'].includes(submission.status)) {
        scheduleGridPoll(row, generationId);
      } else {
        localStorage.removeItem(gridStorageKey(row.answer.answer_id));
      }
    } catch (error) {
      updateGrid(row.answer.answer_id, { error: error instanceof Error ? error.message : String(error) });
      const failures = (gridPollFailures.get(row.answer.answer_id) ?? 0) + 1;
      gridPollFailures.set(row.answer.answer_id, failures);
      scheduleGridPoll(row, generationId, Math.min(30_000, 2_000 * (2 ** Math.min(failures - 1, 4))));
    }
  }

  async function requestQuote(row: ComparisonRow) {
    if (!row.canGenerate || !BRIDGE_TOKEN) {
      updateGeneration(row.answer.answer_id, { error: BRIDGE_TOKEN ? 'Approve this exact idea before requesting a quote.' : 'Bridge token is not configured for this local UI session.' });
      return;
    }
    updateGeneration(row.answer.answer_id, { busy: true, error: '', quote: undefined, submission: undefined });
    try {
      const quote = await callBridgeTool<QuoteVideoGenerationInput, QuoteVideoGenerationOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'quote_video_generation',
        { run_id: run.run_id, answer_ids: [row.answer.answer_id], provider: 'higgsfield' },
      );
      updateGeneration(row.answer.answer_id, { quote });
    } catch (error) {
      updateGeneration(row.answer.answer_id, { error: error instanceof Error ? error.message : String(error) });
    } finally {
      updateGeneration(row.answer.answer_id, { busy: false });
    }
  }

  async function confirmGeneration(row: ComparisonRow) {
    const quote = generationByAnswer[row.answer.answer_id]?.quote;
    if (!quote || quote.quote_status !== 'quoted') return;
    updateGeneration(row.answer.answer_id, { busy: true, error: '' });
    try {
      const submission = await callBridgeTool<SubmitVideoGenerationInput, SubmitVideoGenerationOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'submit_video_generation',
        { quote_id: quote.quote_id, confirmed: true },
      );
      updateGeneration(row.answer.answer_id, { submission });
      localStorage.setItem(storageKey(row.answer.answer_id), submission.generation_id);
      schedulePoll(row, submission.generation_id, 1200);
    } catch (error) {
      updateGeneration(row.answer.answer_id, { error: error instanceof Error ? error.message : String(error) });
    } finally {
      updateGeneration(row.answer.answer_id, { busy: false });
    }
  }

  function schedulePoll(row: ComparisonRow, generationId: string, delay = 5000) {
    const existing = pollTimers.get(row.answer.answer_id);
    if (existing) clearTimeout(existing);
    pollTimers.set(row.answer.answer_id, setTimeout(() => pollGeneration(row, generationId), delay));
  }

  async function pollGeneration(row: ComparisonRow, generationId: string) {
    try {
      const submission = await callBridgeTool<GetVideoGenerationStatusInput, GetVideoGenerationStatusOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'get_video_generation_status',
        { generation_id: generationId },
      );
      updateGeneration(row.answer.answer_id, { submission, error: '' });
      pollFailures.delete(row.answer.answer_id);
      await onrefresh?.();
      if (!['ready_for_review', 'failed'].includes(submission.status)) {
        schedulePoll(row, generationId);
      } else {
        localStorage.removeItem(storageKey(row.answer.answer_id));
      }
    } catch (error) {
      updateGeneration(row.answer.answer_id, { error: error instanceof Error ? error.message : String(error) });
      const failures = (pollFailures.get(row.answer.answer_id) ?? 0) + 1;
      pollFailures.set(row.answer.answer_id, failures);
      schedulePoll(row, generationId, Math.min(30_000, 2_000 * (2 ** Math.min(failures - 1, 4))));
    }
  }

  onMount(() => {
    if (!BRIDGE_TOKEN) return;
    for (const row of rows) {
      const generationId = localStorage.getItem(storageKey(row.answer.answer_id));
      if (generationId) schedulePoll(row, generationId, 50);
      const gridGenerationId = localStorage.getItem(gridStorageKey(row.answer.answer_id));
      if (gridGenerationId) scheduleGridPoll(row, gridGenerationId, 50);
    }
  });

  onDestroy(() => {
    for (const timer of pollTimers.values()) clearTimeout(timer);
    for (const timer of gridPollTimers.values()) clearTimeout(timer);
  });
</script>

{#if rows.some((row) => row.answer.ui_status !== 'missing')}
  <div class="dc-concept-gate-strip">
    <div class="dc-brief-label">Step 1 — Approve one concept to generate Sora video</div>
    <div class="dc-concept-gate-cards">
      {#each rows as row (row.answer.answer_id)}
        {#if row.answer.ui_status !== 'missing'}
          {@const generation = generationByAnswer[row.answer.answer_id]}
          {@const generationStatus = rowGenerationStatus(row)}
          {@const title = row.answer.structured_prompt && typeof row.answer.structured_prompt === 'object' && 'title' in row.answer.structured_prompt
            ? String(row.answer.structured_prompt.title)
            : row.answer.model_name}
          <div class="dc-concept-gate-card">
            <div class="dc-concept-gate-card-head">
              <strong>{row.answer.model_name}</strong>
              <span class="dc-decision-status" data-status={generationStatus.toLowerCase()}>{generationStatus}</span>
            </div>
            <div class="dc-concept-gate-card-title">{title}</div>
            <div class="dc-action-group">
              <button class="dc-action-button dc-approve-button" disabled={!row.canApprove || savingAnswerId === row.answer.answer_id} onclick={() => recordDecision(row, 'approved')}>Approve idea</button>
              <button class="dc-action-button dc-reject-button" disabled={savingAnswerId === row.answer.answer_id} onclick={() => recordDecision(row, 'rejected')}>Reject</button>
            </div>
            {#if row.canGenerate && generationStatus !== 'Ready'}
              <button class="dc-action-button dc-row-quote-button" disabled={generation?.busy || !!generation?.submission} onclick={() => requestQuote(row)}>Get live Higgsfield quote</button>
            {/if}
            {#if generation?.quote?.quote_status === 'quoted' && !generation.submission}
              <button class="dc-action-button dc-confirm-generation" disabled={generation.busy} onclick={() => confirmGeneration(row)}>Confirm {generation.quote.credit_cost_total} credits and generate</button>
            {/if}
            {#if decisionError[row.answer.answer_id]}<p class="dc-decision-error">{decisionError[row.answer.answer_id]}</p>{/if}
            {#if generation?.error}<p class="dc-decision-error">{generation.error}</p>{/if}
          </div>
        {/if}
      {/each}
    </div>
  </div>
{/if}

<div class="dc-comparison-table-wrap" bind:this={scrollContainer}>
  <table class="dc-comparison-table">
    <thead>
      <tr>
        <th class="dc-col-prompt"><span class="dc-column-kicker">Input</span><span class="dc-column-title">Prompt source</span></th>
        <th class="dc-column-shared dc-col-media"><span class="dc-column-kicker">Shared visual plan</span><span class="dc-column-title">Shot grid</span><span class="dc-column-model">Nano Banana Pro</span></th>
        <th class="dc-col-media"><span class="dc-column-kicker">Prompt only</span><span class="dc-column-title">Video</span><span class="dc-column-model">Seedance</span></th>
        <th class="dc-col-media"><span class="dc-column-kicker">Prompt only</span><span class="dc-column-title">Video</span><span class="dc-column-model">Sora</span></th>
        <th class="dc-col-references"><span class="dc-column-kicker">Reference workflow</span><span class="dc-column-title">Visual inputs</span></th>
        <th class="dc-col-media"><span class="dc-column-kicker">Reference assisted</span><span class="dc-column-title">Image</span><span class="dc-column-model">Nano Banana Pro</span></th>
        <th class="dc-col-media"><span class="dc-column-kicker">Reference assisted</span><span class="dc-column-title">Video</span><span class="dc-column-model">Seedance</span></th>
        <th class="dc-col-media"><span class="dc-column-kicker">Reference assisted</span><span class="dc-column-title">Video</span><span class="dc-column-model">Sora</span></th>
        <th class="dc-col-evaluation"><span class="dc-column-kicker">Evaluation</span><span class="dc-column-title">Vision review</span></th>
        <th class="dc-col-review"><span class="dc-column-kicker">Concept gate</span><span class="dc-column-title">Approval</span></th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row (row.answer.answer_id)}
        {@const generation = generationByAnswer[row.answer.answer_id]}
        {@const gridGeneration = gridByAnswer[row.answer.answer_id]}
        {@const generationStatus = rowGenerationStatus(row)}
        <tr>
          <td data-label="Prompt source">
            <ModelAnswerCell answer={row.answer} />
          </td>
          <td data-label="Shot grid · Nano Banana Pro">
            <VersionedArtifactCell
              slotData={row.promptOnlyImageSlot}
              label="Shared grid"
              {promptsMap}
              {answersMap}
            />
            <button class="dc-action-button" disabled={!soraPromptForRow(row) || !BRIDGE_TOKEN || gridGeneration?.busy || !!gridGeneration?.submission} onclick={() => requestGridQuote(row)}>
              {gridGeneration?.busy ? 'Checking…' : 'Optional · Get Nano Banana Pro quote'}
            </button>
            {#if gridGeneration?.quote && !gridGeneration.submission}
              <div class="dc-row-quote">
                <span>Nano Banana Pro · 3×3 · 2K · edge-to-edge</span>
                <strong>{gridGeneration.quote.credit_cost_total} credits</strong>
              </div>
              <button class="dc-action-button dc-confirm-generation" disabled={gridGeneration.busy} onclick={() => confirmGridGeneration(row)}>
                Confirm {gridGeneration.quote.credit_cost_total} credits and generate grid
              </button>
            {/if}
            {#if gridGeneration?.submission}
              <p class="dc-decision-help" style="margin-top: 6px;">
                Nano Banana Pro {gridGeneration.submission.job.job_id ?? 'submitting'} · {gridGeneration.submission.status}
              </p>
            {/if}
            {#if gridGeneration?.error}
              <p class="dc-decision-error">{gridGeneration.error}</p>
            {/if}
          </td>
          <td data-label="Prompt only · Seedance">
            <VersionedArtifactCell slotData={row.promptOnlyVideoSeedanceSlot} label="Seedance" {promptsMap} {answersMap} />
          </td>
          <td data-label="Prompt only · Sora">
            <VersionedArtifactCell slotData={row.promptOnlyVideoSoraSlot} label="Sora" {promptsMap} {answersMap} />
          </td>
          <td data-label="Visual inputs">
            <ReferenceImageStrip images={row.referenceImages} />
          </td>
          <td data-label="Reference assisted · Image">
            <VersionedArtifactCell slotData={row.referenceAssistedImageSlot} label="Image" {promptsMap} {answersMap} />
          </td>
          <td data-label="Reference assisted · Seedance">
            <VersionedArtifactCell slotData={row.referenceAssistedVideoSeedanceSlot} label="Seedance" {promptsMap} {answersMap} />
          </td>
          <td data-label="Reference assisted · Sora">
            <VersionedArtifactCell slotData={row.referenceAssistedVideoSoraSlot} label="Sora" {promptsMap} {answersMap} />
          </td>
          <td data-label="Vision review">
            <div class="dc-vision-score-cell">
              {#if row.visionScores?.length}
                <div class="dc-vision-score-list">
                  {#each row.visionScores as score (score.model)}
                    <div class="dc-vision-score-row">
                      <span class="dc-vision-score-model">{score.model}</span>
                      {#if score.score !== null && score.score !== undefined}
                        <span class="dc-vision-score-badge" style:color={score.score >= 80 ? 'var(--dc-conf-high)' : score.score >= 50 ? 'var(--dc-conf-medium)' : 'var(--dc-conf-low)'}>
                          {score.score}
                        </span>
                      {:else}
                        <span class="dc-vision-score-pending">pending</span>
                      {/if}
                    </div>
                    {#if score.note}
                      <div class="dc-vision-score-note">{score.note}</div>
                    {/if}
                  {/each}
                </div>
              {:else}
                <div class="dc-empty-vision-score">
                  <span>No vision scores yet</span>
                  <span class="dc-vision-score-hint">Gemini Pro / Qwen VL can judge the final videos.</span>
                  <button class="dc-action-button" disabled={!judgingUnlocked || !hasReadyVideo(row)}>Score with vision model</button>
                  {#if !judgingUnlocked}<span class="dc-vision-score-hint">Judging unlocks when both model videos are ready.</span>{/if}
                </div>
              {/if}
            </div>
          </td>
          <td data-label="Concept gate">
            <div class="dc-row-actions">
              <div class="dc-row-status-line">
                <div class="dc-decision-status" data-status={generationStatus.toLowerCase()}>{generationStatus}</div>
                {#if row.reviewStatus === 'rejected'}<span class="dc-rejected-label">Rejected</span>{/if}
              </div>
              <textarea
                class="dc-notes-input"
                name={`decision-note-${row.answer.answer_id}`}
                aria-label={`Optional decision note for ${row.answer.model_name}`}
                placeholder="Optional decision note"
                value={decisionNotes[row.answer.answer_id] ?? row.conceptDecision?.note ?? ''}
                oninput={(event) => decisionNotes = { ...decisionNotes, [row.answer.answer_id]: event.currentTarget.value }}
                rows={3}
              ></textarea>
              <div class="dc-action-group">
                <button class="dc-action-button dc-approve-button" disabled={!row.canApprove || savingAnswerId === row.answer.answer_id} onclick={() => recordDecision(row, 'approved')}>Approve idea</button>
                <button class="dc-action-button dc-reject-button" disabled={row.answer.ui_status === 'missing' || savingAnswerId === row.answer.answer_id} onclick={() => recordDecision(row, 'rejected')}>Reject</button>
              </div>
              {#if !row.canApprove && row.answer.ui_status !== 'missing'}
                <p class="dc-decision-help">Only a valid creative_concept_v1 package can be approved.</p>
              {:else if row.reviewStatus === 'rejected'}
                <p class="dc-decision-help">Recapture this model to create a new pending answer.</p>
              {:else if row.canGenerate && generationStatus !== 'Ready'}
                <button class="dc-action-button dc-row-quote-button" disabled={generation?.busy || !!generation?.submission} onclick={() => requestQuote(row)}>Get live quote</button>
              {/if}
              {#if generation?.quote}
                <div class="dc-row-quote">
                  <span>{generation.quote.model} · 12s · 16:9</span>
                  <strong>{generation.quote.credit_cost_total ?? 'No'} credits</strong>
                  <span>Expires {new Date(generation.quote.expires_at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</span>
                </div>
                {#if generation.quote.quote_status === 'quoted' && !generation.submission}
                  <button class="dc-action-button dc-confirm-generation" disabled={generation.busy} onclick={() => confirmGeneration(row)}>Confirm {generation.quote.credit_cost_total} credits and generate</button>
                {/if}
              {/if}
              {#if generation?.submission}
                <div class="dc-generation-status-list">
                  {#each generation.submission.jobs as job (job.answer_id)}
                    <span>{job.status}{job.message ? ` · ${job.message}` : ''}</span>
                  {/each}
                </div>
              {/if}
              {#if generation?.busy}<p class="dc-decision-help">Working…</p>{/if}
              {#if savingAnswerId === row.answer.answer_id}<p class="dc-decision-help">Saving decision…</p>{/if}
              {#if decisionError[row.answer.answer_id]}<p class="dc-decision-error">{decisionError[row.answer.answer_id]}</p>{/if}
              {#if generation?.error}<p class="dc-decision-error">{generation.error}</p>{/if}
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
