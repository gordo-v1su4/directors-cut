import { expect, test } from 'bun:test';
import { buildCanonicalConceptBrief, QUICK_START_PRESETS } from '../src/lib/create/brief';
import { seedanceCreateUrl, seedanceWorkingCopy } from '../src/lib/create/models';

test('adapts legacy model instructions without modifying the source recipe', () => {
  const source = { prompt: 'Sora 2 Pro: a woman waits in a flooded hotel. Sora_2 keeps the camera still.' };
  const original = source.prompt;
  const copy = seedanceWorkingCopy(source.prompt, 'seedance-2.5');
  expect(copy).toBe('Seedance 2.5: a woman waits in a flooded hotel. Seedance 2.5 keeps the camera still.');
  expect(source.prompt).toBe(original);
  expect(seedanceWorkingCopy(copy, 'seedance-2.0')).toBe(copy.replaceAll('Seedance 2.5', 'Seedance 2.0'));
});

test('source links retain identities and the selected Seedance target', () => {
  const url = new URL(seedanceCreateUrl({ run: 'project / one', take: 'take&two' }, 'seedance-2.0'), 'https://example.test');
  expect(url.pathname).toBe('/create');
  expect(Object.fromEntries(url.searchParams)).toEqual({ run: 'project / one', take: 'take&two', model: 'seedance-2.0' });
});

test('suspense brief preserves the calm setup and brake for both Seedance targets', () => {
  const preset = QUICK_START_PRESETS.find(item => item.id === 'suspense-trailer-build')!;
  for (const videoModel of ['seedance-2.5', 'seedance-2.0'] as const) {
    const brief = buildCanonicalConceptBrief({ projectTitle: preset.title, idea: preset.idea, format: preset.format, duration: preset.duration, includeAudio: true, videoModel });
    expect(brief).toContain(preset.idea);
    expect(brief).toContain(`TARGET MODEL\nSeedance ${videoModel.endsWith('2.5') ? '2.5' : '2.0'}`);
    expect(brief).toContain('Follow any explicit pacing curve and beat timings');
    expect(brief).toContain('calm setup and held pauses');
    expect(brief).toContain('This brief does not submit a generation job.');
    expect(brief).not.toMatch(/Sora|Raycast|compare ChatGPT/i);
  }
});

test('picture-only brief keeps silence explicit when adapting an archived title', () => {
  const brief = buildCanonicalConceptBrief({ projectTitle: 'Sora 2 test', idea: 'A candle flickers.', format: 'trailer', duration: '8', includeAudio: false });
  expect(brief).toContain('PROJECT TITLE\nSeedance 2.5 test');
  expect(brief).toContain('Picture only: no dialogue, music, or sound effects');
});
