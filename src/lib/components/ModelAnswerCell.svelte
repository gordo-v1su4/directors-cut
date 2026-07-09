<script lang="ts">
  import type { ModelAnswer } from '$lib/types/comparison';
  import CopyButton from './CopyButton.svelte';

  let { answer }: { answer: ModelAnswer } = $props();

  let expanded = $state(false);

  let isMissing = $derived(answer.ui_status === 'missing' || !answer.answer_text);
  let excerpt = $derived(
    isMissing
      ? 'No answer captured yet. Use Capture Directors Cut Answer in Raycast after running the prompt.'
      : answer.answer_text.length > 220
        ? answer.answer_text.slice(0, 220) + '…'
        : answer.answer_text
  );

  function toggleExpanded() {
    expanded = !expanded;
  }
</script>

<div class="dc-answer-cell">
  <div class="dc-answer-cell-header">
    <span class="dc-answer-model">{answer.model_name}</span>
    {#if !isMissing}
      <CopyButton text={answer.answer_text} label="Copy" size={10} />
    {/if}
  </div>

  <div class="dc-answer-body" class:dc-answer-missing={isMissing}>
    {#if expanded && !isMissing}
      <pre>{answer.answer_text}</pre>
      <button class="dc-text-toggle" onclick={toggleExpanded}>Show less</button>
    {:else}
      <p>{excerpt}</p>
      {#if !isMissing && answer.answer_text.length > 220}
        <button class="dc-text-toggle" onclick={toggleExpanded}>Show more</button>
      {/if}
    {/if}
  </div>

  {#if answer.created_at && !isMissing}
    <div class="dc-answer-meta">
      {new Date(answer.created_at).toLocaleString()} · {answer.source}
    </div>
  {/if}
</div>
