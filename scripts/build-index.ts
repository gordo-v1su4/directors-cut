#!/usr/bin/env bun
/**
 * build-index.ts — Parse Markdown prompt cards, extract YAML frontmatter,
 * and emit JSONL indexes for the Svelte visual browser.
 *
 * Usage: bun run scripts/build-index.ts
 *
 * Reads:  Markdown files under content/cards/
 * Writes: public/data/prompt-cards.index.jsonl
 *
 * Each JSONL line = one card's frontmatter + file path + body excerpt.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync, mkdirSync } from "fs";
import { join, relative, extname } from "path";

const ROOT = join(import.meta.dir, "..");
const CARDS_DIR = join(ROOT, "content", "cards");
const COMPARISONS_DIR = join(ROOT, "content", "comparisons");
const OUTPUT_DIR = join(ROOT, "public", "data");

interface PromptCardIndex {
  id: string;
  slug: string;
  title: string;
  summary: string;
  model_family: string;
  model_targets: string[];
  prompt_mode: string;
  output_shape: string;
  use_cases: string[];
  aspect_ratio: string;
  runtime_seconds: number | null;
  evidence_type: string;
  confidence: string;
  source_count: number;
  source_urls: string[];
  source_notes: string[];
  library_status: string;
  tested_by_us: boolean;
  tags: string[];
  created: string;
  updated: string;
  created_by: string;
  curator: string;
  human_rating?: {
    gordo_score: number | null;
    aesthetic_fit: string;
    production_readiness: string;
  };
  file_path: string;
  body_excerpt: string;
  prompt_pattern?: string;
  generation_prompts?: { prompt_id: string; model: string; provider: string; slot_type?: string; created_at: string }[];
}

/** Extract the first ```text``` block under a "## Prompt pattern" section. */
function extractPromptPattern(body: string): string | undefined {
  const match = body.match(/##\s*Prompt\s*pattern[\s\S]*?```text\n([\s\S]*?)\n```/);
  return match ? match[1].trim() : undefined;
}
/** Extract YAML frontmatter from Markdown. Returns { frontmatter, body }. */
function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const yamlText = match[1];
  const body = match[2];
  const frontmatter: Record<string, unknown> = {};

  // Minimal YAML parser for flat key: value and key: [list] and nested key:\n  - item
  let currentKey = "";
  let inList = false;
  let listItems: string[] = [];
  let nestedItems: string[] = [];

  for (const line of yamlText.split("\n")) {
    const trimmed = line.trim();

    // List item under a key
    if (trimmed.startsWith("- ") && currentKey) {
      const value = trimmed.replace(/^- /, "").replace(/^"(.*)"$/, "$1").trim();
      if (inList) {
        listItems.push(value);
      } else {
        nestedItems.push(value);
      }
      continue;
    }

    // Save previous list
    if (inList && listItems.length > 0) {
      frontmatter[currentKey] = listItems;
      listItems = [];
      inList = false;
    }
    if (nestedItems.length > 0 && currentKey) {
      frontmatter[currentKey] = nestedItems;
      nestedItems = [];
    }

    // Key: value
    const kvMatch = trimmed.match(/^(\w[\w_]*):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].replace(/^"(.*)"$/, "$1").trim();

      if (value === "" || value === "[]") {
        inList = true;
        listItems = [];
        if (value === "[]") {
          frontmatter[currentKey] = [];
          inList = false;
        }
      } else {
        // Try to parse as number, boolean, null
        if (value === "null") {
          frontmatter[currentKey] = null;
        } else if (value === "true") {
          frontmatter[currentKey] = true;
        } else if (value === "false") {
          frontmatter[currentKey] = false;
        } else if (/^-?\d+(\.\d+)?$/.test(value)) {
          frontmatter[currentKey] = Number(value);
        } else {
          frontmatter[currentKey] = value;
        }
      }
    }
  }

  // Save final list
  if (inList && listItems.length > 0) {
    frontmatter[currentKey] = listItems;
  }
  if (nestedItems.length > 0 && currentKey) {
    frontmatter[currentKey] = nestedItems;
  }

  return { frontmatter, body };
}

/** Recursively find all .md files in a directory. */
function findMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];

  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (extname(entry) === ".md") {
      results.push(fullPath);
    }
  }
  return results;
}

/** Extract first paragraph of body as excerpt. */
function extractExcerpt(body: string, maxLen = 200): string {
  // Skip markdown headers, find first content paragraph
  const lines = body.split("\n");
  let excerpt = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("#")) continue;
    if (trimmed.startsWith("```")) continue;
    if (trimmed === "") continue;
    if (trimmed.startsWith("-")) continue;

    excerpt = trimmed;
    break;
  }

  if (excerpt.length > maxLen) {
    excerpt = excerpt.slice(0, maxLen) + "…";
  }
  return excerpt;
}

/** Build prompt-cards.index.jsonl from Markdown files under content/cards. */
function buildPromptCardsIndex(): void {
  const files = findMarkdownFiles(CARDS_DIR);
  console.log(`Found ${files.length} prompt card(s)`);

  const entries: PromptCardIndex[] = [];

  for (const filePath of files) {
    const content = readFileSync(filePath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(content);
    const relPath = relative(ROOT, filePath);

    entries.push({
      id: (frontmatter.id as string) || relPath,
      slug: (frontmatter.slug as string) || (frontmatter.id as string) || relPath,
      title: (frontmatter.title as string) || "Untitled",
      summary: (frontmatter.summary as string) || "",
      model_family: (frontmatter.model_family as string) || "unknown",
      model_targets: (frontmatter.model_targets as string[]) || [],
      prompt_mode: (frontmatter.prompt_mode as string) || "unknown",
      output_shape: (frontmatter.output_shape as string) || "prose",
      use_cases: (frontmatter.use_cases as string[]) || [],
      aspect_ratio: (frontmatter.aspect_ratio as string) || "",
      runtime_seconds: (frontmatter.runtime_seconds as number) || null,
      evidence_type: (frontmatter.evidence_type as string) || "unknown",
      confidence: (frontmatter.confidence as string) || "low",
      source_count: (frontmatter.source_count as number) || 0,
      source_urls: (frontmatter.source_urls as string[]) || [],
      source_notes: (frontmatter.source_notes as string[]) || [],
      library_status: (frontmatter.library_status as string) || "seed_pattern",
      tested_by_us: (frontmatter.tested_by_us as boolean) || false,
      tags: (frontmatter.tags as string[]) || [],
      created: (frontmatter.created as string) || "",
      updated: (frontmatter.updated as string) || "",
      created_by: (frontmatter.created_by as string) || "unknown",
      curator: (frontmatter.curator as string) || "",
      human_rating: frontmatter.human_rating as PromptCardIndex["human_rating"],
      file_path: relPath,
      body_excerpt: extractExcerpt(body),
      prompt_pattern: extractPromptPattern(body),
      generation_prompts: (frontmatter.generation_prompts as PromptCardIndex["generation_prompts"]) ?? [],
    });
  }

  // Sort by updated desc
  entries.sort((a, b) => (b.updated || "").localeCompare(a.updated || ""));

  const jsonl = entries.map((e) => JSON.stringify(e)).join("\n");
  const outputPath = join(OUTPUT_DIR, "prompt-cards.index.jsonl");

  if (!existsSync(OUTPUT_DIR)) {
    mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  writeFileSync(outputPath, jsonl + (jsonl ? "\n" : ""));
  console.log(`Wrote ${entries.length} entries to ${outputPath}`);
}

// Main
console.log("Building prompt-cards index...");
buildPromptCardsIndex();
console.log("Done.");