export type CaptureHandoffMode = 'manual' | 'automated';

export interface CreateBriefInput {
  projectTitle: string;
  idea: string;
  format: string;
  duration: string;
  includeAudio: boolean;
  referenceName?: string;
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
      'Two estranged friends at a chaotic electronic-music festival discover a disposable camera showing a crime that has not happened yet. Premium YA thriller tone, friendship, identity, nightlife, sharp twist. One integrated 12-second Sora sizzler.',
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
  const audioRule = input.includeAudio
    ? '\n- Include intentional audio, music, ambience, dialogue, and SFX direction inside the prompt'
    : '';
  const referenceRule = input.referenceName
    ? `- Visual reference selected locally: ${input.referenceName}. Use only its visible composition, character, product, or style cues; do not invent unseen details.`
    : '- No visual reference supplied.';

  return `PROJECT TITLE
${title}

CREATIVE BRIEF
Develop two independent premium ${input.format} concepts from this idea for a young-adult audience. ChatGPT and Claude will each receive the same brief through Raycast.

${input.idea.trim()}

DELIVERY
- Exactly one open-ended, high-paced ${input.duration}-second Sora sizzler prompt per model
- The writing, imagery, action, sound, music, rhythm, and title impact are one integrated video prompt
- World-building may be slightly futuristic, fantasy, period, or pre-AI 2000s when it serves the concept
- Prioritize an immediate hook, emotional discovery, and a sharp plot-turn payoff${audioRule}
- Do not return a shot list, multiple prompt options, or claim a video was generated
${referenceRule}

RAYCAST WORKFLOW
Run “Start Directors Cut Concept Run.” Enter the project title as argument 1 and leave argument 2 blank to use this copied brief. The command saves the project, rebuilds the Projects index, and copies the canonical prompt for ChatGPT; capture ChatGPT, then repeat with Claude.`;
}
