<script lang="ts">
  import type { ComparisonRow, ComparisonRun, ComparisonRunDetail, GenerationPrompt, ModelAnswer } from '$lib/types/comparison';
  import ModelAnswerCell from './ModelAnswerCell.svelte';
  import VersionedArtifactCell from './VersionedArtifactCell.svelte';
  import ReferenceImageStrip from './ReferenceImageStrip.svelte';
  import { callBridgeTool } from '$lib/bridge/types';
  import type { RecordConceptDecisionInput, RecordConceptDecisionOutput } from '$lib/bridge/types';

  let { run, rows, ondecision }: { run: ComparisonRun | ComparisonRunDetail; rows: ComparisonRow[]; ondecision?: () => Promise<void> | void } = $props();

  const BRIDGE_URL = import.meta.env.VITE_RAYCAST_BRIDGE_URL ?? 'http://127.0.0.1:8787';
  const BRIDGE_TOKEN = import.meta.env.VITE_RAYCAST_BRIDGE_TOKEN ?? '';
  let decisionNotes = $state<Record<string, string>>({});
  let savingAnswerId = $state('');
  let decisionError = $state<Record<string, string>>({});

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
      await ondecision?.();
    } catch (error) {
      decisionError = { ...decisionError, [row.answer.answer_id]: error instanceof Error ? error.message : String(error) };
    } finally {
      savingAnswerId = '';
    }
  }
</script>

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
        <tr>
          <td>
            <ModelAnswerCell answer={row.answer} />
          </td>
          <td>
            <VersionedArtifactCell slotData={row.promptOnlyImageSlot} label="Shared grid" {promptsMap} {answersMap} />
          </td>
          <td>
            <VersionedArtifactCell slotData={row.promptOnlyVideoSeedanceSlot} label="Seedance" {promptsMap} {answersMap} />
          </td>
          <td>
            <VersionedArtifactCell slotData={row.promptOnlyVideoSoraSlot} label="Sora" {promptsMap} {answersMap} />
          </td>
          <td>
            <ReferenceImageStrip images={row.referenceImages} />
          </td>
          <td>
            <VersionedArtifactCell slotData={row.referenceAssistedImageSlot} label="Image" {promptsMap} {answersMap} />
          </td>
          <td>
            <VersionedArtifactCell slotData={row.referenceAssistedVideoSeedanceSlot} label="Seedance" {promptsMap} {answersMap} />
          </td>
          <td>
            <VersionedArtifactCell slotData={row.referenceAssistedVideoSoraSlot} label="Sora" {promptsMap} {answersMap} />
          </td>
          <td>
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
                  <button class="dc-action-button" disabled>Score with vision model</button>
                </div>
              {/if}
            </div>
          </td>
          <td>
            <div class="dc-row-actions">
              <div class="dc-decision-status" data-status={row.reviewStatus ?? 'pending'}>
                {row.reviewStatus === 'approved' ? 'Approved' : row.reviewStatus === 'rejected' ? 'Rejected' : 'Pending'}
              </div>
              <textarea
                class="dc-notes-input"
                placeholder="Optional decision note"
                value={decisionNotes[row.answer.answer_id] ?? row.conceptDecision?.note ?? ''}
                oninput={(event) => decisionNotes = { ...decisionNotes, [row.answer.answer_id]: event.currentTarget.value }}
                rows={3}
              ></textarea>
              <div class="dc-action-group">
                <button class="dc-action-button dc-approve-button" disabled={!row.canApprove || savingAnswerId === row.answer.answer_id} onclick={() => recordDecision(row, 'approved')}>Approve</button>
                <button class="dc-action-button dc-reject-button" disabled={row.answer.ui_status === 'missing' || savingAnswerId === row.answer.answer_id} onclick={() => recordDecision(row, 'rejected')}>Reject</button>
              </div>
              {#if !row.canApprove && row.answer.ui_status !== 'missing'}
                <p class="dc-decision-help">Only a valid creative_concept_v1 package can be approved.</p>
              {:else if row.reviewStatus === 'rejected'}
                <p class="dc-decision-help">Recapture this model to create a new pending answer.</p>
              {:else if row.canGenerate}
                <p class="dc-decision-help">Eligible for a 12-second, 16:9 generation quote.</p>
              {/if}
              {#if savingAnswerId === row.answer.answer_id}<p class="dc-decision-help">Saving decision…</p>{/if}
              {#if decisionError[row.answer.answer_id]}<p class="dc-decision-error">{decisionError[row.answer.answer_id]}</p>{/if}
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
