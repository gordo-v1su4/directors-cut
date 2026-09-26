/**
 * Tag tones: a soft filled tint per writer, video model or status, so a take's
 * provenance reads at a glance without outlines or loud colour.
 */
export type Tone =
  | 'neutral'
  | 'chatgpt'
  | 'claude'
  | 'gemini'
  | 'deepseek'
  | 'kimi'
  | 'glm'
  | 'hermes'
  | 'sora'
  | 'seedance'
  | 'approved'
  | 'review'
  | 'warm';

export function toneFor(value: string | null | undefined): Tone {
  const v = (value ?? '').toLowerCase();
  if (v.includes('chatgpt') || v.includes('gpt')) return 'chatgpt';
  if (v.includes('claude') || v.includes('haiku')) return 'claude';
  if (v.includes('gemini')) return 'gemini';
  if (v.includes('deepseek')) return 'deepseek';
  if (v.includes('kimi')) return 'kimi';
  if (v.includes('glm')) return 'glm';
  if (v.includes('hermes')) return 'hermes';
  if (v.includes('sora')) return 'sora';
  if (v.includes('seedance')) return 'seedance';
  if (v.includes('approved') || v.includes('promoted')) return 'approved';
  if (v.includes('review') || v.includes('ready')) return 'review';
  if (v.includes('partial') || v.includes('cut') || v.includes('import') || v.includes('draft')) return 'warm';
  return 'neutral';
}
