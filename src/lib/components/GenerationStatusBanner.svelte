<script lang="ts">
  import type { ComparisonArtifact } from '$lib/types/comparison';
  import type { RunGenerationStatus } from '$lib/data/comparisons';

  let { status, artifacts }: { status: RunGenerationStatus; artifacts: ComparisonArtifact[] } = $props();

  let bannerText = $derived.by(() => {
    const generated = artifacts.filter((a) => a.status === 'generated');
    const failed = artifacts.filter((a) => a.status === 'failed');
    const pending = artifacts.filter((a) => a.status === 'pending');

    if (status === 'generated') {
      return {
        label: 'Generation complete',
        detail: `${generated.length} real artifact${generated.length === 1 ? '' : 's'} generated. Click a media cell to preview.`,
        color: 'var(--dc-conf-high)',
      };
    }
    if (status === 'failed') {
      const reasons = failed.map((a) => a.notes).filter(Boolean);
      return {
        label: 'Generation failed',
        detail: reasons.length
          ? reasons[0]
          : 'All generation attempts failed. No media was produced.',
        color: 'var(--dc-conf-low)',
      };
    }
    if (status === 'mixed') {
      const genCount = generated.length;
      const failedCount = failed.length;
      const pendingCount = pending.length;
      const parts: string[] = [];
      if (genCount) parts.push(`${genCount} generated`);
      if (failedCount) parts.push(`${failedCount} failed`);
      if (pendingCount) parts.push(`${pendingCount} pending`);
      return {
        label: 'Mixed generation status',
        detail: `${parts.join(', ')}. Some media is available; some artifacts are still blocked or pending.`,
        color: 'var(--dc-conf-medium)',
      };
    }
    return {
      label: 'No media generated yet',
      detail: `${pending.length} prompt${pending.length === 1 ? '' : 's'} entered; generation is pending or unavailable. No video/image media exists for this run.`,
      color: 'var(--dc-conf-medium)',
    };
  });

  let iconColor = $derived(bannerText.color);
</script>

<div
  class="dc-gen-banner"
  style="border-left-color: {iconColor};"
>
  <div class="dc-gen-banner-icon" style="color: {iconColor};">
    {#if status === 'generated'}✓{:else if status === 'failed'}✕{:else}⏳{/if}
  </div>
  <div>
    <div class="dc-gen-banner-label" style="color: {iconColor};">{bannerText.label}</div>
    <div class="dc-gen-banner-detail">{bannerText.detail}</div>
    {#if status === 'failed' || status === 'pending'}
      <div class="dc-gen-banner-hint">
        Captured answers/prompts are real database entries; no media has been fabricated.
      </div>
    {/if}
  </div>
</div>

<style>
  .dc-gen-banner {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 10px 14px;
    border-radius: var(--dc-radius);
    border: 1px solid var(--dc-border-subtle);
    border-left: 3px solid;
    background: var(--dc-bg-elev);
    margin-bottom: 14px;
  }

  .dc-gen-banner-icon {
    font-size: 16px;
    font-weight: 700;
    line-height: 1.4;
    flex-shrink: 0;
  }

  .dc-gen-banner-label {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }

  .dc-gen-banner-detail {
    font-size: 12px;
    color: var(--dc-text-muted);
    margin-top: 2px;
    line-height: 1.5;
  }

  .dc-gen-banner-hint {
    font-size: 10px;
    color: var(--dc-text-dim);
    margin-top: 4px;
    font-style: italic;
  }
</style>