<script lang="ts" module>
  // Map model family → accent CSS var.
  export const FAMILY_COLORS: Record<string, string> = {
    seedance: 'var(--dc-seedance)',
    sora: 'var(--dc-sora)',
    'cross-model': 'var(--dc-cross)',
    general_video: 'var(--dc-general)',
  };

  export const EVIDENCE_COLORS: Record<string, string> = {
    official: 'var(--dc-evidence-official)',
    prompt_with_output: 'var(--dc-evidence-official)',
    community_corroborated: 'var(--dc-evidence-corroborated)',
    practitioner_claim: 'var(--dc-evidence-claim)',
    generic_pattern: 'var(--dc-evidence-claim)',
    unknown: 'var(--dc-evidence-unknown)',
    guide_synthesized: 'var(--dc-evidence-corroborated)',
  };

  export const CONFIDENCE_COLORS: Record<string, string> = {
    high: 'var(--dc-conf-high)',
    medium: 'var(--dc-conf-medium)',
    low: 'var(--dc-conf-low)',
  };
</script>

<script lang="ts">
  let { label, color = 'var(--dc-text-muted)', active = false }: { label: string; color?: string; active?: boolean } = $props();
</script>

<span
  class="dc-badge"
  style:color={active ? 'var(--dc-bg)' : color}
  style:background={active ? color : 'transparent'}
  style:border-color={color}
>
  {label}
</span>