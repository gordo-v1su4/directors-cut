/*
 * Prompt card index types — derived from docs/ui-ux-handoff.md and
 * the actual JSONL emitted by scripts/build-index.ts.
 * These are type-only; runtime validation can come later via Zod.
 */

export interface PromptCardHumanRating {
  gordo_score: number | null;
  aesthetic_fit: string;
  production_readiness: string;
}

export interface PromptCardIndex {
  id: string;
  slug: string;
  title: string;
  summary: string;
  model_family: string; // seedance | sora | cross-model | general_video
  model_targets: string[]; // e.g. seedance-2.0, sora-2, veo, kling
  prompt_mode: string; // timecoded_montage, structured_json, etc.
  output_shape: string; // prompt_card, prose, etc.
  use_cases: string[]; // teaser, music-video, product-ad, references...
  aspect_ratio: string; // 16:9, 9:16, variable, 2.39:1
  runtime_seconds: number | null;
  evidence_type: string;
  confidence: string; // low | medium | high
  source_count: number;
  source_urls: string[];
  source_notes: string[];
  library_status: string; // seed_pattern, adapted_template...
  tested_by_us: boolean;
  tags: string[];
  created: string;
  updated: string;
  created_by: string;
  curator: string;
  human_rating?: PromptCardHumanRating;
  file_path: string;
  body_excerpt: string;
  prompt_pattern?: string;
}

export type Confidence = 'low' | 'medium' | 'high';

export type ModelFamily = 'seedance' | 'sora' | 'cross-model' | 'general_video';