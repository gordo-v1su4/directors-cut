import { seedanceLabel, seedanceWorkingCopy, type SeedanceModel } from './models';

export type CaptureHandoffMode = 'manual' | 'automated';

export interface CreateBriefInput {
  projectTitle: string;
  idea: string;
  format: string;
  duration: string;
  includeAudio: boolean;
  referenceName?: string;
  videoModel?: SeedanceModel;
}

const FORMAT_SUFFIX: Record<string, string> = {
  trailer: 'Teaser',
  'music video': 'Music Video',
  commercial: 'Commercial',
  'short film scene': 'Scene',
  'visual concept': 'Visual Concept',
};

const BOILERPLATE_PREFIX = /^(create an original|create a|develop a|write a|make a)\b/i;

export interface QuickStartPreset {
  id: string;
  label: string;
  format: string;
  duration: string;
  title: string;
  idea: string;
}

export const QUICK_START_PRESETS: QuickStartPreset[] = [
  {
    id: 'suspense-trailer-build',
    label: 'Pacing formula',
    format: 'trailer',
    duration: '12',
    title: 'Suspense trailer build',
    idea: `Create a 12-second suspense teaser using this reusable trailer formula. Build around my premise if I provide one; otherwise propose an original suspense premise with one central character, one familiar setting, and one unanswered question.

CORE PRINCIPLE
Withhold information while compressing time. This is a question for the audience, not a plot summary.

STRUCTURE
Hook → Setup → Disruption → Accelerating escalation → Peak → Brake → Title + Stinger.

12-SECOND TIMING GUIDE
0:00–0:01 — Hook: one arresting image or short line, with no explanation. Silence or a single tone.
0:01–0:03.5 — Setup: establish the person and a calm, ordinary world long enough to feel safe. Low drone or sparse piano.
0:03.5–0:05 — Disruption: violate that safety. Show a disturbing effect and plant the central question. First riser or strings.
0:05–0:08 — Escalation: increasingly short glimpses, fragments of dialogue, and accumulating consequences. Stack sound layers and tighten the cutting.
0:08–0:09 — Peak: the fastest cuts and the single largest image. One decisive bass impact.
0:09–0:10 — Brake: cut abruptly to silence. Hold a breath, an image, or one very short line.
0:10–0:11 — Title: a clean title reveal with a signature sting.
0:11–0:12 — Stinger: one final unsettling button that reopens the question without answering it.

EDITING AND SUSPENSE RULES
- Shorten average shot length through the escalation, not through every beat. A longer trailer might build from 3s to 2s to 1s to 0.5s to 0.25s; scale that curve to this runtime. Avoid an even cutting rhythm through the build, and preserve the held brake.
- Let the music drive the edit: use downbeats, risers, a sustained tone, one major bass hit, then sudden silence. Sound and negative space carry the tension.
- Show the threat's effects rather than a complete reveal. Withhold the answer and the outcome.
- Use one recurring image three times: plant it, escalate its meaning, then subvert it at the peak.
- If dialogue is used, limit it to a character line, a threat line, or a question line. Keep it speakable within the runtime; remove plot explanation.
- Reserve the biggest image for the peak. Do not spend it in the opening hook.
- Keep the setup calm enough to establish trust. For a dread-led variation, add a brief earlier brake and restart the build, while retaining the held breath before the title.
- For a longer edit, expand the calm setup and escalation rather than stretching every beat equally. Preserve the contrast between speed and stillness.`,
  },
  {
    id: 'netflix-teaser',
    label: 'Netflix teaser',
    format: 'trailer',
    duration: '12',
    title: 'Coastal Hotel — Teaser',
    idea:
      'Create a 12-second supernatural-thriller teaser set in a luxury coastal hotel during a hurricane evacuation. A night concierge sees the same unknown guest on every security monitor. Elevator doors open onto black ocean water. End on a hard title reveal: CHECKOUT.',
  },
  {
    id: 'series-sizzle',
    label: 'Series sizzle',
    format: 'trailer',
    duration: '12',
    title: 'Festival After Midnight — Teaser',
    idea:
      'Two estranged friends at a chaotic electronic-music festival discover a disposable camera showing a crime that has not happened yet. Premium YA thriller tone, friendship, identity, nightlife, sharp twist. One integrated 12-second Seedance sizzler.',
  },
  {
    id: 'commercial',
    label: 'Commercial spot',
    format: 'commercial',
    duration: '12',
    title: 'Product Orbit — Spot',
    idea:
      'A premium 12-second product spot: one hero object on a rotating plinth, tactile macro details, controlled studio light, single emotional payoff beat, hard logo or product name sting at the end. No clutter, no shot list.',
  },
];

export function formatSuffix(format: string): string {
  return FORMAT_SUFFIX[format] ?? 'Concept';
}

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function shortDateLabel(): string {
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
  }).format(new Date());
}

function substantiveLines(idea: string): string[] {
  return idea
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 24 && !BOILERPLATE_PREFIX.test(line));
}

function hookFromSentence(sentence: string): string {
  const cleaned = sentence.replace(/^a\s+|^an\s+|^the\s+/i, '').trim();
  const words = cleaned.split(/\s+/).slice(0, 4).join(' ');
  return titleCase(words.replace(/[,.;:!?]+$/, ''));
}

export function suggestTitleOptions(idea: string, format: string, sampleSource = ''): string[] {
  const suffix = formatSuffix(format);
  const options: string[] = [];
  const trimmed = idea.trim();

  if (sampleSource.trim()) {
    options.push(`${sampleSource.replace(/\s*pattern$/i, '').trim()} — ${suffix}`);
  }

  const titleReveal =
    trimmed.match(/title reveal:\s*([A-Z0-9][A-Z0-9\s—–-]{1,40})/i)?.[1]?.trim() ??
    trimmed.match(/title (?:slam|impact|sting):\s*([A-Z0-9][A-Z0-9\s—–-]{1,40})/i)?.[1]?.trim();
  if (titleReveal) options.push(`${titleCase(titleReveal.replace(/[,.;:!?]+$/, ''))} — ${suffix}`);

  for (const match of trimmed.matchAll(/\b([A-Z][A-Z0-9]{1,}(?:\s+[A-Z][A-Z0-9]{1,}){0,2})\b/g)) {
    const phrase = match[1]?.trim();
    if (phrase && phrase.length <= 32) options.push(`${titleCase(phrase)} — ${suffix}`);
  }

  for (const line of substantiveLines(trimmed)) {
    const sentence = line.split(/[.!?]/)[0]?.trim() ?? line;
    if (sentence.length > 20) options.push(`${hookFromSentence(sentence)} — ${suffix}`);
  }

  options.push(`${suffix} · ${shortDateLabel()}`);

  const seen = new Set<string>();
  return options.filter((option) => {
    const key = option.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 4);
}

export function resolveProjectTitle(projectTitle: string, idea: string, format: string, sampleSource = ''): string {
  const trimmed = projectTitle.trim();
  if (trimmed) return trimmed;
  return suggestTitleOptions(idea, format, sampleSource)[0] ?? `${formatSuffix(format)} · ${shortDateLabel()}`;
}

export function buildCanonicalConceptBrief(input: CreateBriefInput): string {
  const title = resolveProjectTitle(input.projectTitle, input.idea, input.format);
  const model = input.videoModel ?? 'seedance-2.5';
  const audioRule = input.includeAudio
    ? '\n- Include intentional audio, music, ambience, dialogue, and SFX direction inside the prompt'
    : '\n- Picture only: no dialogue, music, or sound effects; express rhythm through the edit';
  const referenceRule = input.referenceName
    ? `- Visual reference selected locally: ${input.referenceName}. Use only its visible composition, character, product, or style cues; do not invent unseen details.`
    : '- No visual reference supplied.';

  return `PROJECT TITLE
${seedanceWorkingCopy(title, model)}

TARGET MODEL
${seedanceLabel(model)}

CREATIVE BRIEF
Write one cinematic ${input.format} prompt for ${seedanceLabel(model)} using the idea below. Preserve its characters, story, visual identity, and intended suspense structure.

${seedanceWorkingCopy(input.idea.trim(), model)}

DELIVERY
- Exactly one ${input.duration}-second prompt: concept and identity locks, visual style, timestamped action beats, editing rhythm, and a concise closing rules section
- Follow any explicit pacing curve and beat timings in the creative brief, including calm setup and held pauses. Otherwise use a fast teaser build: 0.3–0.7s cuts, 0.2s flash-frames at peak, one silence beat before title, one impact on title
- Integrate palette, camera movement, physically clear action, editing, and continuity rules into the Seedance prompt
- Adapt inherited model-specific instructions to ${seedanceLabel(model)}; do not assume that an archived recipe's technical limits or syntax apply unchanged
- Prioritize immediate hook, emotional discovery, and sharp plot-turn payoff${audioRule}
- Do not return multiple prompt options or claim a video was generated
${referenceRule}

WORKFLOW
Use this brief with your preferred prompt writer. Review the resulting prompt, then render it with ${seedanceLabel(model)} in your video tool. Upload the finished video into Trailer Feed and attach the prompt and model to its take. This brief does not submit a generation job.`;
}
