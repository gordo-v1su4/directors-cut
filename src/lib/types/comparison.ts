/*
 * Directors Cut comparison lab types.
 *
 * Aligned with schemas/model-answer.schema.json and schemas/comparison-run.schema.json,
 * plus the artifact/versioning UX described in docs/comparison-lab-requirements.md.
 */

export interface ComparisonRun {
  run_id: string;
  title: string;
  brief?: string;
  question: string;
  created: string;
  created_by: string;
  status:
    | 'draft'
    | 'running'
    | 'answers_partial'
    | 'answers_collected'
    | 'generation_partial'
    | 'partially_generated'
    | 'ready_for_review'
    | 'graded'
    | 'promoted';
  models_requested?: string[];
  target_models?: string[];
  source_refs?: Record<string, unknown>[];
  tags?: string[];
}

export interface CreativeConceptPackage {
  package_type: 'creative_concept_v1';
  title: string;
  logline: string;
  summary: string;
  sora_prompt: string;
  runtime_seconds: 12;
  prompt_count: 1;
}

export type LegacyStructuredPrompt =
  | string
  | number
  | boolean
  | null
  | LegacyStructuredPrompt[]
  | { [key: string]: LegacyStructuredPrompt };

export interface ModelAnswer {
  answer_id: string;
  run_id: string;
  agent_name: string;
  model_name: string;
  model_class: string | null;
  target_model: string;
  prompt_mode: string | null;
  answer_text: string;
  structured_prompt?: CreativeConceptPackage | LegacyStructuredPrompt;
  structure_status?: 'valid' | 'invalid' | 'unparsed';
  created_at: string;
  tokens_estimated?: number | null;
  source: string;
  // Runtime UI status, not persisted in schema
  ui_status?: 'captured' | 'pending' | 'missing';
}

export type ArtifactType =
  | 'shot_grid'
  | 'image_result'
  | 'video_result'
  | 'end_video'
  | 'reference_image'
  | 'prompt_revision';

export type ArtifactProvider =
  | 'nano_banana_pro'
  | 'sora'
  | 'seedance'
  | 'manual_upload'
  | 'raycast'
  | 'unknown';

export type ArtifactSource = 'generated' | 'uploaded' | 'captured' | 'manual';

export type ReferencePlatform = 'pinterest' | 'upload' | 'generated' | 'web' | 'manual';
export type ReferenceRole = 'style' | 'composition' | 'character' | 'product' | 'lighting' | 'environment' | 'mood';
export type RightsStatus = 'unknown' | 'mood_reference_only' | 'owned' | 'licensed' | 'generated';
export type ArtifactStatus = 'pending' | 'generated' | 'failed' | 'selected' | 'rejected';

export interface GenerationPrompt {
  prompt_id: string;
  run_id: string;
  answer_id?: string;
  slot_type: ArtifactType;
  prompt_text: string;
  model: string;
  provider: ArtifactProvider;
  created_at: string;
  source: ArtifactSource;
  artifact_ids?: string[];
  notes?: string;
}

export interface ComparisonArtifact {
  artifact_id: string;
  run_id: string;
  answer_id?: string;
  revision_id?: string;
  prompt_id?: string;
  artifact_type: ArtifactType;
  provider: ArtifactProvider;
  title: string;
  target_model?: string;
  prompt_text?: string;
  media_url?: string;
  local_path?: string;
  thumbnail_url?: string;
  reference_image_ids?: string[];
  created_at: string;
  source: ArtifactSource;
  status?: ArtifactStatus;
  notes?: string;
}

export interface ReferenceImageArtifact extends ComparisonArtifact {
  artifact_type: 'reference_image';
  source_platform: ReferencePlatform;
  reference_role: ReferenceRole;
  rights_status: RightsStatus;
}

export interface VersionedArtifactSlot {
  slot_type: ArtifactType;
  active_artifact_id: string | null;
  versions: ComparisonArtifact[];
}

export interface ComparisonRow {
  run_id: string;
  answer: ModelAnswer;
  promptOnlyImageSlot: VersionedArtifactSlot;
  promptOnlyVideoSeedanceSlot: VersionedArtifactSlot;
  promptOnlyVideoSoraSlot: VersionedArtifactSlot;
  referenceImages: ReferenceImageArtifact[];
  referenceAssistedImageSlot: VersionedArtifactSlot;
  referenceAssistedVideoSeedanceSlot: VersionedArtifactSlot;
  referenceAssistedVideoSoraSlot: VersionedArtifactSlot;
  notes?: string;
  reviewStatus?: 'keep' | 'remix' | 'reject' | 'pending';
  visionScores?: { model: string; score: number | null; note?: string }[];
}

export interface VisionScore {
  model: string;
  score: number | null;
  note?: string;
  scored_at?: string;
}

export interface ComparisonRunDetail extends ComparisonRun {
  answers: ModelAnswer[];
  artifacts: ComparisonArtifact[];
  prompts: GenerationPrompt[];
  rows: ComparisonRow[];
}

export interface ComparisonRunSummary {
  run_id: string;
  title: string;
  status: ComparisonRun['status'];
  answer_count: number;
  artifact_count: number;
  model_labels: string[];
  created: string;
}
