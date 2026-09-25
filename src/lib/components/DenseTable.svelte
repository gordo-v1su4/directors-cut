<script lang="ts">
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import Badge, { FAMILY_COLORS, CONFIDENCE_COLORS } from './Badge.svelte';
  import PromptModal from './PromptModal.svelte';

  /**
   * Dense prompt-card table.
   *
   * TanStack Table v9 beta (`constructTable` + feature slots) is still churning;
   * keep this as a thin presentational table so the browser ships. When v9
   * stabilizes, wrap it behind this same component API.
   */
  let {
    data,
    selectedId = null,
    onselect,
  }: {
    data: PromptCardIndex[];
    selectedId?: string | null;
    onselect?: (id: string) => void;
  } = $props();

  let activePrompt = $state<
    | { prompt_text: string; model?: string; provider?: string; created_at?: string; slot_type?: string; notes?: string }
    | null
  >(null);

  function firstPrompt(card: PromptCardIndex) {
    const ref = card.generation_prompts?.[0];
    if (ref) {
      return {
        prompt_text: `Generation prompt for ${ref.slot_type ?? card.title} (${ref.model} / ${ref.provider})`,
        model: ref.model,
        provider: ref.provider,
        created_at: ref.created_at,
        slot_type: ref.slot_type,
      };
    }
    if (card.prompt_pattern) {
      return {
        prompt_text: card.prompt_pattern,
        model: card.model_targets.join(', '),
        provider: card.model_family,
        slot_type: 'prompt_pattern',
        notes: 'Template prompt pattern from the card body.',
      };
    }
    return null;
  }

  function openPrompt(card: PromptCardIndex) {
    const prompt = firstPrompt(card);
    if (prompt) activePrompt = prompt;
  }

  function closePrompt() {
    activePrompt = null;
  }
</script>

{#if activePrompt}
  <PromptModal prompt={activePrompt} onClose={closePrompt} />
{/if}

<!--
  Mobile: a tappable card per card-record. Ten columns of metadata never fit a
  phone, so the card leads with the title and keeps only the signal a browsing
  user acts on — family, confidence, use cases, and the prompt itself.
-->
<div class="dc-card-list">
  {#each data as c (c.id)}
    <div class="dc-list-card" class:selected={c.id === selectedId}>
      <button
        class="dc-list-card-hit"
        onclick={() => onselect?.(c.id)}
        aria-label={`Open ${c.title}`}
      >
        <span class="dc-list-card-title">{c.title}</span>
        <span class="dc-list-card-meta">
          <Badge label={c.model_family} color={FAMILY_COLORS[c.model_family] ?? 'var(--dc-general)'} />
          <Badge label={c.confidence} color={CONFIDENCE_COLORS[c.confidence] ?? 'var(--dc-text-dim)'} />
          {#if c.tested_by_us}<Badge label="✓ tested" color="var(--dc-conf-high)" />{/if}
        </span>
        {#if c.use_cases.length}
          <span class="dc-list-card-sub">{c.use_cases.map((u) => u.replace(/[-_]/g, ' ')).join(', ')}</span>
        {/if}
      </button>
      <div class="dc-list-card-foot">
        <span>{c.prompt_mode.replace(/_/g, ' ')}, {c.aspect_ratio}, {c.source_count} sources</span>
        {#if c.generation_prompts?.length || c.prompt_pattern}
          <button class="dc-list-card-action" onclick={() => openPrompt(c)}>
            {c.generation_prompts?.length
              ? `${c.generation_prompts.length} prompt${c.generation_prompts.length === 1 ? '' : 's'}`
              : 'View prompt'}
          </button>
        {/if}
      </div>
    </div>
  {/each}
</div>

<div class="dc-table-frame dc-desk-table">
<table class="dc-table">
  <thead>
    <tr>
      <th>Title</th>
      <th>Family</th>
      <th>Use case</th>
      <th>Confidence</th>
      <th><span class="visually-hidden">Prompt</span></th>
    </tr>
  </thead>
  <tbody>
    {#each data as c (c.id)}
      <tr class:selected={c.id === selectedId} onclick={() => onselect?.(c.id)}>
        <td class="dc-table-title">{c.title}</td>
        <td>
          <Badge label={c.model_family} color={FAMILY_COLORS[c.model_family] ?? 'var(--dc-general)'} />
        </td>
        <td class="dc-table-muted">{c.use_cases.map((u) => u.replace(/[-_]/g, ' ')).join(', ')}</td>
        <td>
          <Badge label={c.confidence} color={CONFIDENCE_COLORS[c.confidence] ?? 'var(--dc-text-dim)'} />
        </td>
        <td class="dc-table-action">
          {#if c.generation_prompts?.length || c.prompt_pattern}
            <button class="dc-badge" onclick={(e) => { e.stopPropagation(); openPrompt(c); }}>
              {c.generation_prompts?.length
                ? `${c.generation_prompts.length} prompt${c.generation_prompts.length === 1 ? '' : 's'}`
                : 'View prompt'}
            </button>
          {/if}
        </td>
      </tr>
    {/each}
  </tbody>
</table>
</div>

<style>
  /* The whole card body is one tap target; the footer action sits outside it
     so a nested button never swallows the row tap. */
  .dc-list-card-hit {
    display: block;
    width: 100%;
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    text-align: left;
    cursor: pointer;
  }

  .dc-list-card-hit .dc-list-card-title,
  .dc-list-card-hit .dc-list-card-sub {
    display: block;
  }

  .dc-list-card-hit .dc-list-card-meta {
    display: flex;
  }
</style>
