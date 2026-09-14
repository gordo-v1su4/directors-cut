import type { ComparisonArtifact, GenerationPrompt } from '$lib/types/comparison';

export function versionPrompt(artifact: ComparisonArtifact, prompts = new Map<string, GenerationPrompt>()) {
  return artifact.version_prompt ?? artifact.prompt_text ?? (artifact.prompt_id ? prompts.get(artifact.prompt_id)?.prompt_text : '') ?? '';
}

export function videoModel(artifact: ComparisonArtifact) {
  if (artifact.video_model !== undefined) return artifact.video_model || 'Model not set';
  const model = artifact.model || artifact.target_model;
  if (!model || model === 'manual') return 'Model not set';
  const normalized = model.toLowerCase().replace(/_/g, '-');
  const labels: Record<string,string> = {'sora-2':'Sora 2','sora-2-pro':'Sora 2 Pro','seedance-2-0':'Seedance 2.0','seedance-2.0':'Seedance 2.0'};
  return labels[normalized] || model.replace(/_/g, ' ');
}
