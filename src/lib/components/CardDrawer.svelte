<script lang="ts">
  import Badge, { FAMILY_COLORS, EVIDENCE_COLORS, CONFIDENCE_COLORS } from './Badge.svelte';
  import CopyButton from './CopyButton.svelte';
  import type { PromptCardIndex } from '$lib/types/prompt-card';
  import { callBridgeTool } from '$lib/bridge/types';
  import type { GenerateCinematicGridInput, GenerateCinematicGridOutput } from '$lib/bridge/types';

  let { card }: { card: PromptCardIndex | null } = $props();

  let gridJob = $state<GenerateCinematicGridOutput | null>(null);
  let gridError = $state('');
  let gridLoading = $state(false);

  const BRIDGE_URL = import.meta.env.VITE_RAYCAST_BRIDGE_URL ?? 'http://127.0.0.1:8787';
  const BRIDGE_TOKEN = import.meta.env.VITE_RAYCAST_BRIDGE_TOKEN ?? 'test-local-001';

  async function generateGrid() {
    if (!card) return;
    gridLoading = true;
    gridError = '';
    gridJob = null;
    try {
      const input: GenerateCinematicGridInput = {
        brief: `Create a ${card.model_family} cinematic image grid based on this prompt card:\nTitle: ${card.title}\nSummary: ${card.summary}\nBody: ${card.body_excerpt}`,
        grid_layout: '3x3',
        aspect_ratio: card.aspect_ratio,
        resolution: '2k',
      };
      gridJob = await callBridgeTool<GenerateCinematicGridInput, GenerateCinematicGridOutput>(
        { baseUrl: BRIDGE_URL, token: BRIDGE_TOKEN },
        'generate_cinematic_grid',
        input,
      );
    } catch (e) {
      gridError = e instanceof Error ? e.message : String(e);
    } finally {
      gridLoading = false;
    }
  }
</script>

{#if card}
  <aside class="dc-drawer" style="padding: 16px; min-width: 340px; max-width: 420px;">
    <div style="display:flex; align-items:start; justify-content:space-between; margin-bottom: 12px;">
      <div style="display: flex; flex-direction: column; gap: 6px;">
        <h2 style="font-size: 15px; font-weight: 600; margin: 0; color: var(--dc-text);">{card.title}</h2>
        <div style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
          <a
            href="/comparisons?prompt={card.slug}"
            class="dc-badge"
            style="color: var(--dc-text-muted); border-color: var(--dc-border); text-decoration: none; align-self: flex-start;"
          >
            Compare →
          </a>
          <button
            onclick={generateGrid}
            disabled={gridLoading}
            style="background: var(--dc-bg-elev); border: 1px solid var(--dc-border); border-radius: var(--dc-radius); color: var(--dc-text); font-size: 12px; padding: 4px 10px; cursor: pointer; align-self: flex-start;"
          >
            {gridLoading ? 'Generating…' : 'Generate Grid'}
          </button>
        </div>
      </div>
      <CopyButton text={card.file_path} label="Path" />
    </div>

    <p style="color: var(--dc-text-muted); font-size: 12px; margin: 0 0 12px;">{card.summary}</p>

    {#if gridJob}
      <div style="background: var(--dc-bg-elev); border: 1px solid var(--dc-border); border-radius: var(--dc-radius); padding: 10px; margin-bottom: 12px;">
        <p style="font-size: 12px; margin: 0 0 4px; color: var(--dc-text);">Grid job started: <code style="font-family: var(--dc-font-mono);">{gridJob.job_id}</code></p>
        <p style="font-size: 12px; margin: 0; color: var(--dc-text-muted);">Status: {gridJob.status}</p>
      </div>
    {/if}
    {#if gridError}
      <p style="color: #f87171; font-size: 12px; margin: 0 0 12px;">{gridError}</p>
    {/if}

    <div style="display:flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px;">
      <Badge label={card.model_family} color={FAMILY_COLORS[card.model_family] ?? 'var(--dc-general)'} active />
      {#each card.model_targets as target}
        <Badge label={target} color={FAMILY_COLORS[card.model_family] ?? 'var(--dc-general)'} />
      {/each}
      <Badge label={`${card.aspect_ratio}${card.runtime_seconds ? ` ${card.runtime_seconds}s` : ''}`} />
      <Badge label={card.evidence_type} color={EVIDENCE_COLORS[card.evidence_type] ?? 'var(--dc-evidence-unknown)'} />
      <Badge label={card.confidence} color={CONFIDENCE_COLORS[card.confidence] ?? 'var(--dc-text-dim)'} />
      {#if card.tested_by_us}
        <Badge label="tested" color="var(--dc-conf-high)" />
      {/if}
    </div>

    <section style="margin-bottom: 14px;">
      <h3 style="font-size: 11px; text-transform: uppercase; color: var(--dc-text-dim); margin: 0 0 6px;">Prompt Anatomy</h3>
      <dl style="display:grid; grid-template-columns: 100px 1fr; gap: 4px 8px; font-size: 12px; margin: 0;">
        <dt style="color: var(--dc-text-muted)">Mode</dt><dd style="margin:0">{card.prompt_mode}</dd>
        <dt style="color: var(--dc-text-muted)">Shape</dt><dd style="margin:0">{card.output_shape}</dd>
        <dt style="color: var(--dc-text-muted)">Use cases</dt><dd style="margin:0">{card.use_cases.join(', ')}</dd>
        <dt style="color: var(--dc-text-muted)">Tags</dt><dd style="margin:0">{card.tags.join(', ') || '—'}</dd>
        <dt style="color: var(--dc-text-muted)">Status</dt><dd style="margin:0">{card.library_status}</dd>
      </dl>
    </section>

    <section style="margin-bottom: 14px;">
      <h3 style="font-size: 11px; text-transform: uppercase; color: var(--dc-text-dim); margin: 0 0 6px;">Sources ({card.source_count})</h3>
      <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 4px;">
        {#each card.source_urls as url}
          <li>
            <a href={url} target="_blank" rel="noopener" style="color: var(--dc-sora); font-size: 12px; text-decoration: none;">{url}</a>
          </li>
        {/each}
      </ul>
      {#if card.source_notes.length > 0}
        <p style="font-size: 11px; color: var(--dc-text-dim); margin: 6px 0 0;">{card.source_notes.join(' · ')}</p>
      {/if}
    </section>

    <section>
      <h3 style="font-size: 11px; text-transform: uppercase; color: var(--dc-text-dim); margin: 0 0 6px;">Body Excerpt</h3>
      <pre style="font-size: 11px; line-height: 1.5; color: var(--dc-text-muted); white-space: pre-wrap; max-height: 260px; overflow-y: auto; margin: 0; font-family: var(--dc-font-mono);">{card.body_excerpt}</pre>
    </section>
  </aside>
{:else}
  <aside class="dc-drawer" style="padding: 24px; min-width: 260px; display: flex; align-items: center; justify-content: center; color: var(--dc-text-dim); font-size: 12px;">
    Select a card to view details
  </aside>
{/if}