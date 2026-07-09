import type { PromptCardIndex } from '$lib/types/prompt-card';

/**
 * Load and parse the prompt-card index JSONL.
 * In dev the file lives in /static-ish public/ and is served at /data/...
 *
 * The adapter-static build copies `public/` to the output root, so
 * `/data/prompt-cards.index.jsonl` resolves at runtime.
 */
export async function loadPromptCards(): Promise<PromptCardIndex[]> {
  const res = await fetch('/data/prompt-cards.index.jsonl');
  if (!res.ok) {
    console.error('Failed to load prompt-cards.index.jsonl:', res.status);
    return [];
  }
  const text = await res.text();
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as PromptCardIndex);
}

export async function loadPromptCardBySlug(slug: string): Promise<PromptCardIndex | null> {
  const cards = await loadPromptCards();
  return cards.find((c) => c.slug === slug) ?? null;
}

/** Parse a JSONL string into typed rows (testable, no fetch). */
export function parsePromptCardsJsonl(text: string): PromptCardIndex[] {
  return text
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as PromptCardIndex);
}