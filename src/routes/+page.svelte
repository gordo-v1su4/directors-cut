<script lang="ts">
  import { onMount } from 'svelte';
  import { loadPromptCards } from '$lib/data/loader';
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import Badge, { FAMILY_COLORS } from '$lib/components/Badge.svelte';

  let cards: PromptCardIndex[] = $state.raw([]);

  const families = $derived(
    Object.entries(
      cards.reduce<Record<string, number>>((acc, c) => {
        acc[c.model_family] = (acc[c.model_family] ?? 0) + 1;
        return acc;
      }, {}),
    ).sort((a, b) => b[1] - a[1]),
  );

  const useCases = $derived(
    [...new Set(cards.flatMap((c) => c.use_cases))].sort(),
  );

  const testedCount = $derived(cards.filter((c) => c.tested_by_us).length);
  const sourceCount = $derived(
    cards.reduce((acc, c) => acc + c.source_count, 0),
  );

  onMount(async () => {
    cards = await loadPromptCards();
  });
</script>

<div style="padding: 24px; overflow-y: auto; height: 100%;">
  <h1 style="font-size: 18px; font-weight: 600; margin: 0 0 20px; color: var(--dc-text);">Dashboard</h1>

  <section style="display: flex; gap: 32px; margin-bottom: 28px;">
    <div>
      <div style="font-size: 28px; font-weight: 700; color: var(--dc-sora);">{cards.length}</div>
      <div style="font-size: 11px; text-transform: uppercase; color: var(--dc-text-dim);">Cards</div>
    </div>
    <div>
      <div style="font-size: 28px; font-weight: 700; color: var(--dc-text);">{sourceCount}</div>
      <div style="font-size: 11px; text-transform: uppercase; color: var(--dc-text-dim);">Sources</div>
    </div>
    <div>
      <div style="font-size: 28px; font-weight: 700; color: var(--dc-conf-medium);">{testedCount}</div>
      <div style="font-size: 11px; text-transform: uppercase; color: var(--dc-text-dim);">Tested</div>
    </div>
  </section>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 800px;">
    <section>
      <h2 style="font-size: 12px; text-transform: uppercase; color: var(--dc-text-dim); margin: 0 0 10px;">Model Families</h2>
      {#each families as [family, count]}
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
          <Badge label={family} color={FAMILY_COLORS[family] ?? 'var(--dc-general)'} active />
          <div style="flex: 1; min-width: 100px; height: 8px; background: var(--dc-bg-elev-2); border-radius: 4px; overflow: hidden;">
            <div
              style:height="100%"
              style:width="{(count / cards.length) * 100}%"
              style:background={FAMILY_COLORS[family] ?? 'var(--dc-general)'}
            ></div>
          </div>
          <span style="font-size: 12px; color: var(--dc-text-muted); min-width: 20px; text-align: right;">{count}</span>
        </div>
      {/each}
    </section>

    <section>
      <h2 style="font-size: 12px; text-transform: uppercase; color: var(--dc-text-dim); margin: 0 0 10px;">Use Cases</h2>
      <div style="display: flex; flex-wrap: wrap; gap: 6px;">
        {#each useCases as uc}
          <Badge label={uc} />
        {/each}
      </div>
    </section>
  </div>

  <section style="margin-top: 28px; max-width: 800px;">
    <h2 style="font-size: 12px; text-transform: uppercase; color: var(--dc-text-dim); margin: 0 0 10px;">Needs Attention</h2>
    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 6px;">
      <li style="font-size: 13px; color: var(--dc-text-muted);">○ Untested cards: {cards.length - testedCount}</li>
      <li style="font-size: 13px; color: var(--dc-text-muted);">○ Missing real comparison runs (blocked on Gordo)</li>
      <li style="font-size: 13px; color: var(--dc-text-muted);">○ Raycast bridge not yet wired to live Hermes</li>
    </ul>
  </section>
</div>
