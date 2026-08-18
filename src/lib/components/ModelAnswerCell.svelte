<script lang="ts">
  import type { ModelAnswer } from '$lib/types/comparison';
  import CopyButton from './CopyButton.svelte';
  import { isCreativeConcept } from '$lib/data/comparisons';

  let { answer }: { answer: ModelAnswer } = $props();

  let expanded = $state(false);

  let isMissing = $derived(answer.ui_status === 'missing' || !answer.answer_text);
  let concept = $derived(isCreativeConcept(answer) ? answer.structured_prompt : null);
  let displayTitle = $derived(concept?.title.trim().replace(/^(?:\*\*|__)([\s\S]*?)(?:\*\*|__)$/, '$1') ?? '');
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

  {#if concept}
    <div class="dc-concept-package">
      <h3>{displayTitle}</h3>
      <p class="dc-concept-logline">{concept.logline}</p>
      <p class="dc-concept-summary">{concept.summary}</p>
      <div class="dc-concept-specs"><span>12 seconds</span><span>16:9 video</span></div>
      <details class="dc-concept-prompt">
        <summary>Sora prompt</summary>
        <pre>{concept.sora_prompt}</pre>
        <CopyButton text={concept.sora_prompt} label="Copy prompt" size={10} />
      </details>
    </div>
  {/if}

  <div class="dc-answer-body" class:dc-answer-missing={isMissing}>
    {#if expanded && !isMissing}
      <pre>{answer.answer_text}</pre>
      <button class="dc-text-toggle" onclick={toggleExpanded}>Show less</button>
    {:else}
      {#if !concept}<p>{excerpt}</p>{/if}
      {#if !isMissing}
        <button class="dc-text-toggle" onclick={toggleExpanded}>Show raw capture</button>
      {/if}
    {/if}
  </div>

  {#if answer.created_at && !isMissing}
    <div class="dc-answer-meta">
      {new Date(answer.created_at).toLocaleString()} · {answer.source}
      {#if answer.skill_id}<span> · {answer.skill_id}</span>{/if}
    </div>
  {/if}
</div>
