import { catalogUrl } from './media-api';
import type {
  ComparisonRun,
  ComparisonRunDetail,
  ComparisonRow,
  ComparisonArtifact,
  ReferenceImageArtifact,
  VersionedArtifactSlot,
  ModelAnswer,
  GenerationPrompt,
  ConceptDecision,
  CreativeConceptPackage,
} from '$lib/types/comparison';

const EXPECTED_MODELS = [
  'Raycast Auto',
  'GPT-5.5',
  'Grok-4.5 Low',
  'Gemini Pro 3.5',
  'Claude Opus',
  'Kimi K2.7 Code',
  'Qwen3-32B',
  'DeepSeek',
];

const FALLBACK_RUN_ID = 'unavailable-comparison-run';

interface ComparisonsIndex {
  runs: {
    run_id: string;
    title: string;
    logline?: string;
    preview?: ComparisonArtifact | null;
    status: ComparisonRun['status'];
    answer_count: number;
    artifact_count: number;
    model_labels: string[];
    created: string;
  }[];
  expected_models: string[];
}

export interface ComparisonIndexResult {
  runs: ComparisonsIndex['runs'];
  expected_models: string[];
}

export async function loadComparisonsIndex(): Promise<ComparisonIndexResult> {
  try {
    const res = await fetch(catalogUrl('/data/comparisons.index.json'), { cache: 'no-store' });
    if (!res.ok) return { runs: [], expected_models: EXPECTED_MODELS };
    const data = (await res.json()) as ComparisonsIndex;
    return {
      runs: data.runs ?? [],
      expected_models: data.expected_models ?? EXPECTED_MODELS,
    };
  } catch (e) {
    console.error('Failed to load comparisons index:', e);
    return { runs: [], expected_models: EXPECTED_MODELS };
  }
}

export async function loadComparisonRun(
  runId: string,
  runOverride?: ComparisonRun
): Promise<ComparisonRunDetail> {
  const [run, answers, artifacts, prompts, decisions] = await Promise.all([
    runOverride ?? fetchRun(runId),
    fetchAnswers(runId),
    fetchArtifacts(runId),
    fetchPrompts(runId),
    fetchDecisions(runId),
  ]);

  const rows = buildComparisonRows(run, answers, artifacts, prompts, decisions);

  return {
    ...run,
    answers,
    artifacts,
    prompts,
    decisions,
    rows,
  };
}

export type RunGenerationStatus = 'generated' | 'failed' | 'pending' | 'mixed';

export interface GeneratedMediaSummaryItem {
  artifact_id: string;
  title: string;
  artifact_type: string;
  provider: string;
  media_url?: string;
  thumbnail_url?: string;
  status?: string;
  created_at: string;
}

export function getRunGenerationStatus(artifacts: ComparisonArtifact[]): RunGenerationStatus {
  const statuses = artifacts.map((a) => a.status ?? 'pending');
  const hasGenerated = statuses.includes('generated');
  const hasFailed = statuses.includes('failed');
  const hasPending = statuses.includes('pending');
  if (hasGenerated && (hasFailed || hasPending)) return 'mixed';
  if (hasGenerated) return 'generated';
  if (hasFailed) return 'failed';
  return 'pending';
}

export function getGeneratedMediaSummary(artifacts: ComparisonArtifact[]): GeneratedMediaSummaryItem[] {
  return artifacts
    .filter((a) => a.media_url || a.thumbnail_url)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map((a) => ({
      artifact_id: a.artifact_id,
      title: a.title,
      artifact_type: a.artifact_type,
      provider: a.provider,
      media_url: a.media_url,
      thumbnail_url: a.thumbnail_url,
      status: a.status,
      created_at: a.created_at,
    }));
}

async function fetchRun(runId: string): Promise<ComparisonRun> {
  // Prefer the per-run run.json emitted by the build script (carries the real
  // brief, question, models_requested, target_models, tags from the run md).
  try {
    const res = await fetch(catalogUrl(`/data/comparisons/${runId}/run.json`), { cache: 'no-store' });
    if (res.ok) {
      const run = (await res.json()) as ComparisonRun;
      if (run.run_id) return run;
    }
  } catch (e) {
    console.warn(`run.json fetch failed for ${runId}:`, e);
  }
  // Fallback: reconstruct a minimal run from the comparisons index summary.
  try {
    const res = await fetch(catalogUrl('/data/comparisons.index.json'), { cache: 'no-store' });
    if (!res.ok) throw new Error('index unavailable');
    const data = (await res.json()) as ComparisonsIndex;
    const found = data.runs.find((r) => r.run_id === runId);
    if (!found) throw new Error(`run ${runId} not found in index`);
    return {
      run_id: found.run_id,
      title: found.title,
      question: '',
      created: found.created,
      created_by: 'raycast-script-command',
      status: found.status,
      models_requested: data.expected_models,
      target_models: ['general_video'],
      tags: [],
    };
  } catch (e) {
    console.warn('Could not load comparison run from index, using fallback:', e);
    return fallbackRun(runId);
  }
}

async function fetchAnswers(runId: string): Promise<ModelAnswer[]> {
  try {
    const res = await fetch(catalogUrl(`/data/comparisons/${runId}/answers.json`), { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as ModelAnswer[];
  } catch (e) {
    console.error(`Failed to load answers for ${runId}:`, e);
    return [];
  }
}

/** One run's artifacts alone: a cheap way to notice edited version details. */
export function loadRunArtifacts(runId: string): Promise<ComparisonArtifact[]> {
  return fetchArtifacts(runId);
}

async function fetchArtifacts(runId: string): Promise<ComparisonArtifact[]> {
  try {
    const res = await fetch(catalogUrl(`/data/comparisons/${runId}/artifacts.json`), { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as ComparisonArtifact[];
  } catch (e) {
    console.error(`Failed to load artifacts for ${runId}:`, e);
    return [];
  }
}

async function fetchPrompts(runId: string): Promise<GenerationPrompt[]> {
  try {
    const res = await fetch(catalogUrl(`/data/comparisons/${runId}/prompts.json`), { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as GenerationPrompt[];
  } catch (e) {
    console.warn(`Failed to load prompts for ${runId}:`, e);
    return [];
  }
}

async function fetchDecisions(runId: string): Promise<ConceptDecision[]> {
  try {
    const res = await fetch(catalogUrl(`/data/comparisons/${runId}/decisions.json`), { cache: 'no-store' });
    if (!res.ok) return [];
    return (await res.json()) as ConceptDecision[];
  } catch (e) {
    console.warn(`Failed to load concept decisions for ${runId}:`, e);
    return [];
  }
}

export function isCreativeConcept(answer: ModelAnswer): answer is ModelAnswer & { structured_prompt: CreativeConceptPackage } {
  const value = answer.structured_prompt;
  return answer.structure_status === 'valid' && !!value && typeof value === 'object' && !Array.isArray(value) &&
    value.package_type === 'creative_concept_v1' && value.runtime_seconds === 12 && value.prompt_count === 1 &&
    [value.title, value.logline, value.summary, value.sora_prompt].every((field) => typeof field === 'string' && field.trim().length > 0);
}

function fallbackRun(runId: string): ComparisonRun {
  return {
    run_id: runId || FALLBACK_RUN_ID,
    title: 'Unavailable comparison run',
    question: '',
    created: new Date().toISOString(),
    created_by: 'raycast-script-command',
    status: 'running',
    models_requested: EXPECTED_MODELS,
    target_models: ['general_video', 'seedance-2.0'],
    tags: ['netflix_teaser', 'title_slam', 'raycast'],
  };
}

export function buildComparisonRows(
  run: ComparisonRun,
  answers: ModelAnswer[],
  artifacts: ComparisonArtifact[],
  prompts: GenerationPrompt[] = [],
  decisions: ConceptDecision[] = []
): ComparisonRow[] {
  const isImagePipelineAnswer = (answer: ModelAnswer) =>
    answer.model_class === 'image_generator' ||
    answer.target_model.toLowerCase().includes('nano_banana') ||
    answer.model_name.toLowerCase().includes('nano banana');

  const answerByModel = new Map<string, ModelAnswer>();
  for (const a of answers) {
    if (!isImagePipelineAnswer(a)) answerByModel.set(a.model_name, a);
  }

  const requestedModels = run.models_requested?.length ? run.models_requested : EXPECTED_MODELS;
  const answeredModels = new Set(
    answers.filter((answer) => !isImagePipelineAnswer(answer)).map((answer) => answer.model_name)
  );
  const models = [...new Set([...requestedModels, ...answeredModels])];
  const sharedShotGrids = artifacts.filter((artifact) => artifact.artifact_type === 'shot_grid');
  const latestDecisionByAnswer = new Map<string, ConceptDecision>();
  for (const decision of decisions) latestDecisionByAnswer.set(decision.answer_id, decision);

  const rows = models.map((modelName) => {
    const answer = answerByModel.get(modelName) ?? makePendingAnswer(modelName, run.run_id);

    return makeComparisonRow(run.run_id, answer, artifacts, prompts, sharedShotGrids, latestDecisionByAnswer.get(answer.answer_id));
  });

  // Sort rows: rows containing real artifacts first, then rows with real
  // answer text, then fully-empty pending rows last. This makes generated
  // media visible immediately on initial load without scrolling past empty
  // provider placeholders.
  function rowHasArtifacts(row: ComparisonRow): boolean {
    return (
      row.promptOnlyImageSlot.versions.length > 0 ||
      row.promptOnlyVideoSeedanceSlot.versions.length > 0 ||
      row.promptOnlyVideoSoraSlot.versions.length > 0 ||
      row.referenceAssistedImageSlot.versions.length > 0 ||
      row.referenceAssistedVideoSeedanceSlot.versions.length > 0 ||
      row.referenceAssistedVideoSoraSlot.versions.length > 0 ||
      row.referenceImages.length > 0
    );
  }

  return rows.sort((a, b) => {
    const aHas = rowHasArtifacts(a);
    const bHas = rowHasArtifacts(b);
    if (aHas && !bHas) return -1;
    if (!aHas && bHas) return 1;
    // Within same group, keep rows with real answer text above pending ones
    const aHasAnswer = !!(a.answer.answer_text && a.answer.answer_text.trim());
    const bHasAnswer = !!(b.answer.answer_text && b.answer.answer_text.trim());
    if (aHasAnswer && !bHasAnswer) return -1;
    if (!aHasAnswer && bHasAnswer) return 1;
    return 0;
  });
}

function makePendingAnswer(modelName: string, runId: string): ModelAnswer {
  return {
    answer_id: `${slugify(modelName)}-pending`,
    run_id: runId,
    agent_name: 'Raycast',
    model_name: modelName,
    model_class: 'raycast_ai',
    target_model: 'general_video',
    prompt_mode: 'comparison_question',
    answer_text: '',
    structured_prompt: null,
    created_at: new Date().toISOString(),
    tokens_estimated: null,
    source: 'pending',
    ui_status: 'missing',
  };
}

export function makeComparisonRow(
  runId: string,
  answer: ModelAnswer,
  artifacts: ComparisonArtifact[] = [],
  prompts: GenerationPrompt[] = [],
  sharedShotGrids: ComparisonArtifact[] = [],
  conceptDecision?: ConceptDecision
): ComparisonRow {
  const isPending = answer.ui_status === 'missing' || !answer.answer_text;

  const promptsById = new Map<string, GenerationPrompt>();
  for (const p of prompts) {
    promptsById.set(p.prompt_id, p);
  }

  const answerArtifacts = artifacts.filter((a) => a.answer_id === answer.answer_id);

  const promptOnlyImages = answerArtifacts.filter(
    (a) => a.artifact_type === 'image_result' && !a.reference_image_ids?.length
  );
  const promptOnlyVideos = answerArtifacts.filter(
    (a) => (a.artifact_type === 'video_result' || a.artifact_type === 'end_video') && !a.reference_image_ids?.length
  );
  const referenceImages = answerArtifacts.filter(
    (a) => a.artifact_type === 'reference_image'
  ) as ReferenceImageArtifact[];
  const referenceAssistedImages = answerArtifacts.filter(
    (a) => a.artifact_type === 'image_result' && a.reference_image_ids?.length
  );
  const referenceAssistedVideos = answerArtifacts.filter(
    (a) => (a.artifact_type === 'video_result' || a.artifact_type === 'end_video') && a.reference_image_ids?.length
  );

  const shotGrids = answerArtifacts.filter(
    (a) => a.artifact_type === 'shot_grid'
  );

  // Shot grids are a shared Nano Banana Pro pipeline stage, not a competing
  // model answer. Show that common visual plan in every comparison row.
  const effectivePromptOnlyImages = sharedShotGrids.length
    ? sharedShotGrids
    : promptOnlyImages.length
      ? promptOnlyImages
      : shotGrids;

  function videoSlotFor(video: ComparisonArtifact): 'seedance' | 'sora' | 'other' {
    const prompt = video.prompt_id ? promptsById.get(video.prompt_id) : null;
    const model = video.target_model ?? prompt?.model ?? '';
    if (model.toLowerCase().includes('seedance')) return 'seedance';
    if (model.toLowerCase().includes('sora')) return 'sora';
    return 'other';
  }

  const promptOnlyVideoSeedance = promptOnlyVideos.filter((v) => videoSlotFor(v) === 'seedance');
  const promptOnlyVideoSora = promptOnlyVideos.filter((v) => videoSlotFor(v) === 'sora');
  const promptOnlyVideoOther = promptOnlyVideos.filter((v) => videoSlotFor(v) === 'other');

  // Fallback: if a video has no target model and there is only one video, put it in Seedance slot as the default.
  const effectivePromptOnlyVideoSeedance = promptOnlyVideoSeedance.length ? promptOnlyVideoSeedance : promptOnlyVideoOther;

  const referenceAssistedVideoSeedance = referenceAssistedVideos.filter((v) => videoSlotFor(v) === 'seedance');
  const referenceAssistedVideoSora = referenceAssistedVideos.filter((v) => videoSlotFor(v) === 'sora');
  const referenceAssistedVideoOther = referenceAssistedVideos.filter((v) => videoSlotFor(v) === 'other');
  const effectiveReferenceAssistedVideoSeedance = referenceAssistedVideoSeedance.length ? referenceAssistedVideoSeedance : referenceAssistedVideoOther;

  return {
    run_id: runId,
    answer,
    promptOnlyImageSlot: makeSlot('image_result', effectivePromptOnlyImages),
    promptOnlyVideoSeedanceSlot: makeSlot('video_result', effectivePromptOnlyVideoSeedance),
    promptOnlyVideoSoraSlot: makeSlot('video_result', promptOnlyVideoSora),
    referenceImages,
    referenceAssistedImageSlot: makeSlot('image_result', referenceAssistedImages),
    referenceAssistedVideoSeedanceSlot: makeSlot('video_result', effectiveReferenceAssistedVideoSeedance),
    referenceAssistedVideoSoraSlot: makeSlot('video_result', referenceAssistedVideoSora),
    notes: '',
    conceptDecision,
    reviewStatus: conceptDecision?.decision ?? 'pending',
    canApprove: !isPending && isCreativeConcept(answer),
    canGenerate: !isPending && isCreativeConcept(answer) && conceptDecision?.decision === 'approved',
    visionScores: [],
  };
}

function makeSlot(slotType: VersionedArtifactSlot['slot_type'], artifacts: ComparisonArtifact[]): VersionedArtifactSlot {
  return {
    slot_type: slotType,
    active_artifact_id: artifacts.length ? artifacts[0].artifact_id : null,
    versions: artifacts,
  };
}

export async function loadLatestArtifacts(limit = 6): Promise<ComparisonArtifact[]> {
  const index = await loadComparisonsIndex();
  const items: ComparisonArtifact[] = [];

  for (const run of index.runs) {
    try {
      const res = await fetch(catalogUrl(`/data/comparisons/${run.run_id}/artifacts.json`), { cache: 'no-store' });
      if (!res.ok) continue;
      const artifacts = (await res.json()) as ComparisonArtifact[];
      for (const a of artifacts) {
        if (['video_result', 'end_video'].includes(a.artifact_type) && ['generated', 'selected'].includes(a.status ?? '') && a.media_url) {
          items.push(a);
        }
      }
    } catch (e) {
      console.error(`Failed to load artifacts for ${run.run_id}:`, e);
    }
  }

  return items
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
