export const SEEDANCE_MODELS = [
  { value: 'seedance-2.5', label: 'Seedance 2.5' },
  { value: 'seedance-2.0', label: 'Seedance 2.0' },
] as const;
export type SeedanceModel = (typeof SEEDANCE_MODELS)[number]['value'];
export function seedanceModel(value: string | null | undefined): SeedanceModel {
  return value === 'seedance-2.0' ? value : 'seedance-2.5';
}
export function seedanceLabel(value: SeedanceModel) {
  return SEEDANCE_MODELS.find(model => model.value === value)!.label;
}
export function isLegacySora(value: string) { return /sora/i.test(value); }

/** Adapt a working copy only. Library recipes and historical artifacts stay intact. */
export function seedanceWorkingCopy(text: string, model: SeedanceModel): string {
  return text.replace(/\b(?:sora(?:[ _-]*2(?:[ ._-]*pro)?)?|seedance[ _-]*2[._-][05])\b/gi, seedanceLabel(model));
}

export function seedanceCreateUrl(source: Record<string, string>, model: SeedanceModel = 'seedance-2.5'): `/create?${string}` {
  return `/create?${new URLSearchParams({ ...source, model })}`;
}
