<script lang="ts">
  import type { ModelAnswer } from '$lib/types/comparison';
  import CopyButton from './CopyButton.svelte';
  import { isCreativeConcept } from '$lib/data/comparisons';

  let { answer }: { answer: ModelAnswer } = $props();

  let showMeta = $state(false);

  let isMissing = $derived(answer.ui_status === 'missing' || !answer.answer_text);
  let concept = $derived(isCreativeConcept(answer) ? answer.structured_prompt : null);
  let displayTitle = $derived(concept?.title.trim().replace(/^(?:\*\*|__)([\s\S]*?)(?:\*\*|__)$/, '$1') ?? answer.model_name);
</script>

<div class="dc-answer-cell">
  <div class="dc-answer-cell-header">
    <span class="dc-answer-model">{answer.model_name}</span>
    {#if concept?.sora_prompt}
      <CopyButton text={concept.sora_prompt} label="Copy Sora prompt" size={10} />
    {:else if !isMissing}
      <CopyButton text={answer.answer_text} label="Copy" size={10} />
    {/if}
  </div>

  {#if concept}
    <div class="dc-concept-package">
      <h3>{displayTitle}</h3>
      <p class="dc-concept-logline">{concept.logline}</p>
      <details class="dc-concept-meta">
        <summary>Prompt & hook</summary>
        <pre class="dc-sora-prompt-primary">{concept.sora_prompt}</pre>
        <p class="dc-concept-summary">{concept.summary}</p>
      </details>
      <details class="dc-concept-meta">
        <summary>Original source</summary>
        <pre>{answer.answer_text}</pre>
      </details>
    </div>
  {:else if isMissing}
    <p class="dc-answer-missing">No answer captured yet. Run Raycast capture for this model.</p>
  {:else}
    <pre class="dc-sora-prompt-primary">{answer.answer_text}</pre>
  {/if}

  {#if answer.created_at && !isMissing}
    <button class="dc-text-toggle" onclick={() => (showMeta = !showMeta)}>
      {showMeta ? 'Hide capture info' : 'Capture info'}
    </button>
    {#if showMeta}
      <div class="dc-answer-meta">
        {new Date(answer.created_at).toLocaleString()} · {answer.source}
        {#if answer.skill_id}<span> · {answer.skill_id}</span>{/if}
      </div>
    {/if}
  {/if}
</div>
