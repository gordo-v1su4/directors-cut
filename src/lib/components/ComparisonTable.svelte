<script lang="ts">
  import type { ComparisonRow, ComparisonRun, ComparisonRunDetail, GenerationPrompt, ModelAnswer } from '$lib/types/comparison';
  import ModelAnswerCell from './ModelAnswerCell.svelte';
  import VersionedArtifactCell from './VersionedArtifactCell.svelte';
  import ReferenceImageStrip from './ReferenceImageStrip.svelte';

  let { run, rows }: { run: ComparisonRun | ComparisonRunDetail; rows: ComparisonRow[] } = $props();

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
</script>

<div class="dc-comparison-table-wrap" bind:this={scrollContainer}>
  <table class="dc-comparison-table">
    <thead>
      <tr>
        <th style="min-width: 140px; width: 140px;">Model / Answer</th>
        <th style="min-width: 120px; width: 120px;">Shot grid</th>
        <th style="min-width: 120px; width: 120px;">Prompt-only video (Seedance)</th>
        <th style="min-width: 120px; width: 120px;">Prompt-only video (Sora)</th>
        <th style="min-width: 120px; width: 120px;">Reference images</th>
        <th style="min-width: 120px; width: 120px;">Reference-assisted image</th>
        <th style="min-width: 120px; width: 120px;">Ref-assisted video (Seedance)</th>
        <th style="min-width: 120px; width: 120px;">Ref-assisted video (Sora)</th>
        <th style="min-width: 80px; width: 80px;">Vision Score</th>
        <th style="min-width: 100px; width: 100px;">Notes / Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row (row.answer.answer_id)}
        <tr>
          <td>
            <ModelAnswerCell answer={row.answer} />
          </td>
          <td>
            <VersionedArtifactCell slotData={row.promptOnlyImageSlot} label="Shot grid" {promptsMap} {answersMap} />
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
              <textarea
                class="dc-notes-input"
                placeholder="Notes..."
                value={row.notes}
                readonly
                rows={3}
              ></textarea>
              <div class="dc-action-group">
                <button class="dc-action-button" disabled>Keep</button>
                <button class="dc-action-button" disabled>Remix</button>
                <button class="dc-action-button" disabled>Reject</button>
                <button class="dc-action-button" disabled>Resend</button>
              </div>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
