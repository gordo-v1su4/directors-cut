/**
 * Directors Cut — bridge contract types (provenance-copied).
 *
 * Canonical source: raycast-pro-bridge/src/contracts/{tools,artifacts,errors}.ts
 * Copied at: 2026-07-09 from commit a3671a8.
 *
 * TODO: replace this copied file with a real import (private package, git dep,
 * or generated types) once raycast-pro-bridge is installable as a dependency.
 * Until then, keep this in sync with the canonical contract by re-copying after
 * any change to the bridge contract.
 *
 * These are TYPE-ONLY exports (no runtime zod dependency) so directors-cut
 * can reference bridge shapes before it has zod installed. When zod arrives
 * (B3 SvelteKit scaffold), switch to importing the real Zod schemas for
 * runtime validation.
 */

// --- Shared enums -----------------------------------------------------------

export type TargetModel =
  | 'seedance'
  | 'sora'
  | 'kling'
  | 'veo'
  | 'raycast'
  | 'general_video';

export type UseCase =
  | 'netflix_teaser'
  | 'music_video'
  | 'product_ad'
  | 'cinematic_character'
  | 'style_reference'
  | 'prompt_library';

export type ResearchDepth = 'quick' | 'standard' | 'deep';

export type JobStatus = 'queued' | 'running' | 'completed' | 'failed';

export type LibraryStatus =
  | 'seed_pattern'
  | 'adapted_template'
  | 'internally_tested'
  | 'promoted'
  | 'deprecated';

export type EvidenceType =
  | 'official'
  | 'prompt_with_output'
  | 'community_corroborated'
  | 'practitioner_claim'
  | 'generic_pattern'
  | 'unknown';

// --- Tool: start_prompt_research -------------------------------------------

export interface StartPromptResearchInput {
  topic: string;
  target_models: TargetModel[];
  use_cases: UseCase[];
  depth?: ResearchDepth;
  source_hints?: string[];
  directors_cut_project_path?: string;
}

export interface StartPromptResearchOutput {
  job_id: string;
  status: JobStatus;
  status_url?: string;
  created_at: string;
  artifact_names?: string[];
}

// --- Tool: get_research_status ---------------------------------------------

export interface GetResearchStatusInput {
  job_id: string;
}

export interface GetResearchStatusOutput {
  job_id: string;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  artifact_names?: string[];
  message?: string;
}

// --- Tool: read_research_artifact ------------------------------------------

export interface ReadResearchArtifactInput {
  job_id: string;
  artifact_name: string;
}

export interface ReadResearchArtifactOutput {
  job_id: string;
  artifact_name: string;
  content: string;
  content_type:
    | 'text/markdown'
    | 'application/jsonl'
    | 'application/json'
    | 'text/plain';
  bytes: number;
}

// --- Tool: search_prompt_library -------------------------------------------

export interface SearchPromptLibraryInput {
  query?: string;
  models?: TargetModel[];
  use_cases?: UseCase[];
  library_status?: LibraryStatus[];
  evidence_type?: EvidenceType[];
  limit?: number;
}

export interface PromptCardRef {
  id: string;
  title: string;
  slug: string;
  model_family: TargetModel;
  use_cases?: UseCase[];
  evidence_type: EvidenceType;
  library_status: LibraryStatus;
  tags?: string[];
  updated: string;
  path: string;
}

export interface SearchPromptLibraryOutput {
  total: number;
  cards: PromptCardRef[];
}

// --- Tool: save_prompt_pack ------------------------------------------------

export interface PromptPackEntry {
  slug: string;
  model_family: TargetModel;
  use_cases?: UseCase[];
  body_markdown: string;
  source_urls?: string[];
  evidence_type?: EvidenceType;
  library_status?: LibraryStatus;
}

export interface SavePromptPackInput {
  pack_name: string;
  entries: PromptPackEntry[];
  directors_cut_project_path?: string;
}

export interface SavePromptPackOutput {
  pack_name: string;
  saved: number;
  paths?: string[];
  status: 'accepted' | 'partial' | 'rejected';
  message?: string;
}

// --- Tool registry ---------------------------------------------------------

export type ToolName =
  | 'start_prompt_research'
  | 'get_research_status'
  | 'read_research_artifact'
  | 'search_prompt_library'
  | 'save_prompt_pack';

export const ALLOWED_TOOLS: readonly ToolName[] = [
  'start_prompt_research',
  'get_research_status',
  'read_research_artifact',
  'search_prompt_library',
  'save_prompt_pack',
];

// --- Artifact handshake shapes ---------------------------------------------

export type ResearchArtifactName = 'sources.md' | 'candidates.jsonl' | 'draft-cards/';

export interface CandidateCard {
  slug: string;
  title: string;
  model_family: string;
  use_cases?: string[];
  evidence_type: string;
  library_status?: string;
  source_urls?: string[];
  body_markdown: string;
}

export interface ComparisonRunFile {
  name: 'comparison-run.md' | 'answers.jsonl' | 'grades.jsonl';
  purpose: string;
}

export interface ComparisonRunLayout {
  run_id: string;
  dir: string;
  files: ComparisonRunFile[];
}

// --- Error envelope --------------------------------------------------------

export type BridgeErrorCode =
  | 'unauthorized'
  | 'unknown_tool'
  | 'invalid_input'
  | 'not_found'
  | 'dispatch_failed'
  | 'rate_limited'
  | 'confirmation_required'
  | 'internal';

export interface BridgeError {
  ok: false;
  code: BridgeErrorCode;
  message: string;
  request_id?: string;
  tool?: string;
}

export type BridgeResponse<T> = { ok: true; result: T } | BridgeError;

// --- Thin client -----------------------------------------------------------

export interface BridgeClientOptions {
  baseUrl: string;
  token: string;
}

export async function callBridgeTool<TInput, TOutput>(
  options: BridgeClientOptions,
  toolName: string,
  input: TInput,
): Promise<TOutput> {
  const response = await fetch(`${options.baseUrl}/tools/${toolName}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${options.token}`,
      'Content-Type': 'application/json',
      'X-Caller': 'directors-cut',
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const err = (await response.json().catch(() => ({}))) as BridgeError;
    throw new Error(
      `Bridge tool ${toolName} failed: ${err.code ?? response.status} — ${err.message ?? response.statusText}`,
    );
  }

  return (await response.json()) as TOutput;
}

export async function bridgeHealth(
  baseUrl: string,
): Promise<boolean> {
  try {
    const r = await fetch(`${baseUrl}/health`);
    const body = (await r.json()) as { ok?: boolean };
    return body.ok === true;
  } catch {
    return false;
  }
}