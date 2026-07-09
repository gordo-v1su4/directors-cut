<script lang="ts">
  import type { ComparisonRow, ComparisonRun } from '$lib/types/comparison';
  import ModelAnswerCell from './ModelAnswerCell.svelte';
  import VersionedArtifactCell from './VersionedArtifactCell.svelte';
  import ReferenceImageStrip from './ReferenceImageStrip.svelte';

  let { run, rows }: { run: ComparisonRun; rows: ComparisonRow[] } = $props();
</script>

<div class="dc-comparison-table-wrap">
  <table class="dc-comparison-table">
    <thead>
      <tr>
        <th style="min-width: 140px; width: 140px;">Model / Answer</th>
        <th style="min-width: 100px; width: 100px;">Prompt-only image</th>
        <th style="min-width: 100px; width: 100px;">Prompt-only video</th>
        <th style="min-width: 180px; width: 180px;">Reference images</th>
        <th style="min-width: 100px; width: 100px;">Reference-assisted image</th>
        <th style="min-width: 100px; width: 100px;">Reference-assisted video</th>
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
            <VersionedArtifactCell slotData={row.promptOnlyImageSlot} label="Shot grid" />
          </td>
          <td>
            <VersionedArtifactCell slotData={row.promptOnlyVideoSlot} label="Video" />
          </td>
          <td>
            <ReferenceImageStrip images={row.referenceImages} />
          </td>
          <td>
            <VersionedArtifactCell slotData={row.referenceAssistedImageSlot} label="Image" />
          </td>
          <td>
            <VersionedArtifactCell slotData={row.referenceAssistedVideoSlot} label="Video" />
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
