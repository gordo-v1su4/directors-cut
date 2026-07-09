import type {
  ComparisonRun,
  ComparisonRunDetail,
  ComparisonRow,
  ComparisonArtifact,
  ReferenceImageArtifact,
  VersionedArtifactSlot,
  ModelAnswer,
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

const PLANNED_RUN_ID = '2026-07-netflix-teaser-title-slam-001';

const PLANNED_QUESTION = `You are helping build a prompt-card library for AI video generation.

Creative brief: Create a 10-12 second Netflix-style supernatural thriller teaser called THE GLASS HOUSE. The teaser should feel premium, cinematic, ominous, and suitable for a streaming series proof-of-concept. It should include: one eerie location beat, one human reaction beat, one symbolic impact/action beat, and a final hard title-card/title-slam moment.

Task: Write the best video-generation prompt for this brief. Make it practical for an AI video model to follow. Include timing or shot structure if that helps. Include camera, lighting, motion, audio/SFX, and title reveal details. Avoid copyrighted characters, real show names, or protected IP beyond the generic phrase "Netflix-style" as a quality/aesthetic shorthand.

Output only:
1. A final prompt ready to paste into an AI video generator.
2. A short note naming which model or style of model this prompt is optimized for, and why.`;

interface ComparisonsIndex {
  runs: {
    run_id: string;
    title: string;
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
    const res = await fetch('/data/comparisons.index.json');
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

export async function loadComparisonRun(runId: string): Promise<ComparisonRunDetail> {
  const run = await fetchRun(runId);
  const answers = await fetchAnswers(runId);
  const artifacts = await fetchArtifacts(runId);

  const rows = buildComparisonRows(run, answers, artifacts);

  return {
    ...run,
    answers,
    artifacts,
    rows,
  };
}

async function fetchRun(runId: string): Promise<ComparisonRun> {
  try {
    const res = await fetch('/data/comparisons.index.json');
    if (!res.ok) throw new Error('index unavailable');
    const data = (await res.json()) as ComparisonsIndex;
    const found = data.runs.find((r) => r.run_id === runId);
    if (!found) throw new Error(`run ${runId} not found in index`);
    return {
      run_id: found.run_id,
      title: found.title,
      question: PLANNED_QUESTION,
      created: found.created,
      created_by: 'raycast-script-command',
      status: found.status,
      models_requested: data.expected_models,
      target_models: ['general_video', 'seedance-2.0'],
      tags: ['netflix_teaser', 'title_slam', 'raycast'],
    };
  } catch (e) {
    console.warn('Could not load comparison run from index, using fallback:', e);
    return fallbackRun(runId);
  }
}

async function fetchAnswers(runId: string): Promise<ModelAnswer[]> {
  try {
    const res = await fetch(`/data/comparisons/${runId}/answers.json`);
    if (!res.ok) return [];
    return (await res.json()) as ModelAnswer[];
  } catch (e) {
    console.error(`Failed to load answers for ${runId}:`, e);
    return [];
  }
}

async function fetchArtifacts(runId: string): Promise<ComparisonArtifact[]> {
  try {
    const res = await fetch(`/data/comparisons/${runId}/artifacts.json`);
    if (!res.ok) return [];
    return (await res.json()) as ComparisonArtifact[];
  } catch (e) {
    console.error(`Failed to load artifacts for ${runId}:`, e);
    return [];
  }
}

function fallbackRun(runId: string): ComparisonRun {
  return {
    run_id: runId || PLANNED_RUN_ID,
    title: 'Netflix Teaser Title Slam — First Raycast Model Comparison',
    question: PLANNED_QUESTION,
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
  artifacts: ComparisonArtifact[]
): ComparisonRow[] {
  const byAnswer = new Map<string, ComparisonArtifact[]>();
  for (const a of artifacts) {
    if (!a.answer_id) continue;
    const list = byAnswer.get(a.answer_id) ?? [];
    list.push(a);
    byAnswer.set(a.answer_id, list);
  }

  const answerByModel = new Map<string, ModelAnswer>();
  for (const a of answers) {
    answerByModel.set(a.model_name, a);
  }

  const models = run.models_requested?.length
    ? run.models_requested
    : EXPECTED_MODELS;

  return models.map((modelName) => {
    const answer = answerByModel.get(modelName) ?? makePendingAnswer(modelName, run.run_id);
    const answerArtifacts = byAnswer.get(answer.answer_id) ?? [];

    return makeComparisonRow(run.run_id, answer, answerArtifacts);
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
  artifacts: ComparisonArtifact[] = []
): ComparisonRow {
  const isPending = answer.ui_status === 'missing' || !answer.answer_text;

  const promptOnlyImages = artifacts.filter(
    (a) => a.answer_id === answer.answer_id && a.artifact_type === 'image_result' && !a.reference_image_ids?.length
  );
  const promptOnlyVideos = artifacts.filter(
    (a) => a.answer_id === answer.answer_id && (a.artifact_type === 'video_result' || a.artifact_type === 'end_video') && !a.reference_image_ids?.length
  );
  const referenceImages = artifacts.filter(
    (a) => a.artifact_type === 'reference_image'
  ) as ReferenceImageArtifact[];
  const referenceAssistedImages = artifacts.filter(
    (a) => a.answer_id === answer.answer_id && a.artifact_type === 'image_result' && a.reference_image_ids?.length
  );
  const referenceAssistedVideos = artifacts.filter(
    (a) => a.answer_id === answer.answer_id && (a.artifact_type === 'video_result' || a.artifact_type === 'end_video') && a.reference_image_ids?.length
  );

  const shotGrids = artifacts.filter(
    (a) => a.answer_id === answer.answer_id && a.artifact_type === 'shot_grid'
  );

  // If no image_result exists but a shot_grid exists, treat the shot grid as the prompt-only image slot.
  const effectivePromptOnlyImages = promptOnlyImages.length ? promptOnlyImages : shotGrids;

  return {
    run_id: runId,
    answer,
    promptOnlyImageSlot: makeSlot('image_result', effectivePromptOnlyImages),
    promptOnlyVideoSlot: makeSlot('video_result', promptOnlyVideos),
    referenceImages,
    referenceAssistedImageSlot: makeSlot('image_result', referenceAssistedImages),
    referenceAssistedVideoSlot: makeSlot('video_result', referenceAssistedVideos),
    notes: '',
    reviewStatus: isPending ? 'pending' : 'pending',
  };
}

function makeSlot(slotType: VersionedArtifactSlot['slot_type'], artifacts: ComparisonArtifact[]): VersionedArtifactSlot {
  return {
    slot_type: slotType,
    active_artifact_id: artifacts.length ? artifacts[0].artifact_id : null,
    versions: artifacts,
  };
}

function slugify(label: string): string {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
