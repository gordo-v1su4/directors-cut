<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import type { ComparisonRow, ComparisonRun, ComparisonRunDetail, GenerationPrompt, ModelAnswer } from '$lib/types/comparison';
  import VersionReview from './VersionReview.svelte';
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
  }: {
    run: ComparisonRun | ComparisonRunDetail;
    rows: ComparisonRow[];
    ondecision?: () => Promise<void> | void;
    onrefresh?: () => Promise<void> | void;
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
      if (!['sora2_video', 'open_sora_video', 'sora_2', 'sora-2'].includes(quote.model)) {
        throw new Error(`Regular Sora 2 was requested, but the service returned ${quote.model}. No generation was submitted.`);
      }
      updateGeneration(row.answer.answer_id, { quote });
    } catch (error) {
      updateGeneration(row.answer.answer_id, { error: error instanceof Error ? error.message : String(error) });
    } finally {
      updateGeneration(row.answer.answer_id, { busy: false });
    }
  }

  async function confirmGeneration(row: ComparisonRow) {
    const quote = generationByAnswer[row.answer.answer_id]?.quote;
    if (!quote || quote.quote_status !== 'quoted' || !['sora2_video', 'open_sora_video', 'sora_2', 'sora-2'].includes(quote.model)) return;
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

{#if 'artifacts' in run}
  {#key run.run_id}
    <VersionReview videos={run.artifacts.filter(a => a.media_url && ['video_result','end_video'].includes(a.artifact_type)).sort((a,b)=>a.created_at.localeCompare(b.created_at))} grids={run.artifacts.filter(a=>a.media_url && ['shot_grid','image_result'].includes(a.artifact_type))} {promptsMap} {answersMap} onSaved={onrefresh} />
  {/key}
{/if}

{#if rows.some((row) => row.answer.ui_status !== 'missing')}
  <details class="dc-concept-gate-strip">
    <summary>Generate another take</summary>
    <div class="dc-brief-label">Choose a prompt and confirm the generation cost</div>
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
            <details><summary>Generate shot grid</summary>
              <button class="dc-action-button" disabled={!soraPromptForRow(row) || !BRIDGE_TOKEN || gridByAnswer[row.answer.answer_id]?.busy} onclick={()=>requestGridQuote(row)}>Get image quote</button>
              {#if gridByAnswer[row.answer.answer_id]?.quote && !gridByAnswer[row.answer.answer_id]?.submission}<button class="dc-action-button" disabled={gridByAnswer[row.answer.answer_id]?.busy} onclick={()=>confirmGridGeneration(row)}>Confirm {gridByAnswer[row.answer.answer_id]?.quote?.credit_cost_total} credits</button>{/if}
              {#if gridByAnswer[row.answer.answer_id]?.error}<p class="dc-decision-error">{gridByAnswer[row.answer.answer_id]?.error}</p>{/if}
            </details>
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
  </details>
{/if}
