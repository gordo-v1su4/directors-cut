#!/usr/bin/env bun
/**
 * build-comparisons-index.ts — Parse comparison run Markdown + JSONL and emit
 * a static JSON index for the Svelte visual browser.
 *
 * Usage: bun run scripts/build-comparisons-index.ts
 *
 * Reads:  content/comparisons/<run-id>/comparison-run.md
 *         content/comparisons/<run-id>/answers.jsonl
 * Writes: public/data/comparisons.index.json
 *         public/data/comparisons/<run-id>/answers.json
 *         public/data/comparisons/<run-id>/artifacts.json (empty array if missing)
 */

import {
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  existsSync,
  mkdirSync,
  cpSync,
} from 'fs';
import { join } from 'path';
import type { ComparisonRun, ModelAnswer, ComparisonArtifact, GenerationPrompt } from '../src/lib/types/comparison';

const ROOT = join(import.meta.dir, '..');
const COMPARISONS_DIR = join(ROOT, 'content', 'comparisons');
const OUTPUT_DIR = join(ROOT, 'public', 'data');
const RUNS_OUTPUT_DIR = join(OUTPUT_DIR, 'comparisons');

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

function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };

  const yamlText = match[1];
  const body = match[2];
  const frontmatter: Record<string, unknown> = {};

  let currentKey = '';
  let inList = false;
  let listItems: string[] = [];

  const lines = yamlText.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') && currentKey) {
      const value = trimmed.replace(/^- /, '').replace(/^"(.*)"$/, '$1').trim();
      listItems.push(value);
      i++;
      continue;
    }

    if (inList && listItems.length > 0) {
      frontmatter[currentKey] = listItems;
      listItems = [];
      inList = false;
    }

    const kvMatch = trimmed.match(/^(\w[\w_]*):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const value = kvMatch[2].replace(/^"(.*)"$/, '$1').trim();

      // YAML block scalar indicators: > (folded), |- (literal strip), >- (folded strip), >+, |+
      if (value === '>' || value === '|' || value === '>-' || value === '|-' || value === '>+' || value === '|+') {
        // Collect indented continuation lines as the block content
        const blockLines: string[] = [];
        let j = i + 1;
        while (j < lines.length) {
          const bl = lines[j];
          // Block content must be indented more than the key, or be a blank line within the block
          if (bl.startsWith('  ') || bl.startsWith('\t') || bl.trim() === '') {
            if (bl.trim() === '') {
              blockLines.push('');
            } else {
              blockLines.push(bl.trim());
            }
            j++;
          } else {
            break;
          }
        }
        // For folded (>) scalars, join with spaces; for literal (|) scalars, keep newlines
        const isFolded = value.startsWith('>');
        // Strip trailing blank lines
        while (blockLines.length > 0 && blockLines[blockLines.length - 1] === '') blockLines.pop();
        const blockText = isFolded
          ? blockLines.join(' ').replace(/\s+/g, ' ').trim()
          : blockLines.join('\n').trim();
        frontmatter[currentKey] = blockText;
        i = j;
        continue;
      }

      if (value === '' || value === '[]') {
        inList = true;
        listItems = [];
        if (value === '[]') {
          frontmatter[currentKey] = [];
          inList = false;
        }
      } else if (value === 'null') {
        frontmatter[currentKey] = null;
      } else if (value === 'true') {
        frontmatter[currentKey] = true;
      } else if (value === 'false') {
        frontmatter[currentKey] = false;
      } else if (/^-?\d+(\.\d+)?$/.test(value)) {
        frontmatter[currentKey] = Number(value);
      } else {
        frontmatter[currentKey] = value;
      }
    }
    i++;
  }

  if (inList && listItems.length > 0) {
    frontmatter[currentKey] = listItems;
  }

  return { frontmatter, body };
}

function readRunDir(runDir: string): { run: ComparisonRun; answers: ModelAnswer[]; artifacts: ComparisonArtifact[]; prompts: GenerationPrompt[] } {
  const runFile = join(runDir, 'comparison-run.md');
  const answersFile = join(runDir, 'answers.jsonl');
  const artifactsFile = join(runDir, 'artifacts.jsonl');
  const promptsFile = join(runDir, 'prompts.jsonl');

  let run: ComparisonRun = {
    run_id: '',
    title: 'Untitled comparison',
    question: '',
    created: new Date().toISOString(),
    created_by: 'unknown',
    status: 'draft',
    models_requested: [],
    target_models: [],
    tags: [],
  };

  if (existsSync(runFile)) {
    const content = readFileSync(runFile, 'utf-8');
    const { frontmatter } = parseFrontmatter(content);
    run = {
      ...run,
      ...frontmatter,
    } as ComparisonRun;
  }

  const answers: ModelAnswer[] = [];
  if (existsSync(answersFile)) {
    const text = readFileSync(answersFile, 'utf-8');
    for (const line of text.split('\n')) {
      if (line.trim()) {
        try {
          answers.push(JSON.parse(line) as ModelAnswer);
        } catch (e) {
          console.error(`Failed to parse answer line in ${answersFile}:`, e);
        }
      }
    }
  }

  const artifacts: ComparisonArtifact[] = [];
  if (existsSync(artifactsFile)) {
    const text = readFileSync(artifactsFile, 'utf-8');
    for (const line of text.split('\n')) {
      if (line.trim()) {
        try {
          artifacts.push(JSON.parse(line) as ComparisonArtifact);
        } catch (e) {
          console.error(`Failed to parse artifact line in ${artifactsFile}:`, e);
        }
      }
    }
  }

  const prompts: GenerationPrompt[] = [];
  if (existsSync(promptsFile)) {
    const text = readFileSync(promptsFile, 'utf-8');
    for (const line of text.split('\n')) {
      if (line.trim()) {
        try {
          prompts.push(JSON.parse(line) as GenerationPrompt);
        } catch (e) {
          console.error(`Failed to parse prompt line in ${promptsFile}:`, e);
        }
      }
    }
  }

  return { run, answers, artifacts, prompts };
}

function buildComparisonsIndex(): void {
  if (!existsSync(COMPARISONS_DIR)) {
    console.log('No comparisons directory yet; nothing to index.');
    mkdirSync(RUNS_OUTPUT_DIR, { recursive: true });
    writeFileSync(
      join(OUTPUT_DIR, 'comparisons.index.json'),
      JSON.stringify({ runs: [], expected_models: EXPECTED_MODELS }, null, 2)
    );
    return;
  }

  mkdirSync(RUNS_OUTPUT_DIR, { recursive: true });

  const entries = readdirSync(COMPARISONS_DIR).filter((name) => {
    const full = join(COMPARISONS_DIR, name);
    return statSync(full).isDirectory();
  });

  const runs: { run: ComparisonRun; summary: unknown }[] = [];

  for (const runId of entries) {
    const runDir = join(COMPARISONS_DIR, runId);
    const { run, answers, artifacts, prompts } = readRunDir(runDir);

    if (!run.run_id) run.run_id = runId;

    const runOutputDir = join(RUNS_OUTPUT_DIR, runId);
    mkdirSync(runOutputDir, { recursive: true });
    writeFileSync(join(runOutputDir, 'run.json'), JSON.stringify(run, null, 2));
    writeFileSync(join(runOutputDir, 'answers.json'), JSON.stringify(answers, null, 2));
    writeFileSync(join(runOutputDir, 'artifacts.json'), JSON.stringify(artifacts, null, 2));
    writeFileSync(join(runOutputDir, 'prompts.json'), JSON.stringify(prompts, null, 2));

    // Copy media files into the public data dir so static URLs resolve.
    const mediaDir = join(runDir, 'media');
    const mediaOutputDir = join(runOutputDir, 'media');
    if (existsSync(mediaDir)) {
      mkdirSync(mediaOutputDir, { recursive: true });
      for (const entry of readdirSync(mediaDir)) {
        const src = join(mediaDir, entry);
        const stat = statSync(src);
        if (stat.isFile()) {
          cpSync(src, join(mediaOutputDir, entry), { preserveTimestamps: true });
        }
      }
    }

    const summary = {
      run_id: run.run_id,
      title: run.title,
      status: run.status,
      answer_count: answers.length,
      artifact_count: artifacts.length,
      model_labels: answers.map((a) => a.model_name),
      created: run.created,
    };

    runs.push({ run, summary });
  }

  writeFileSync(
    join(OUTPUT_DIR, 'comparisons.index.json'),
    JSON.stringify(
      {
        runs: runs.map((r) => r.summary),
        expected_models: EXPECTED_MODELS,
      },
      null,
      2
    )
  );

  console.log(`Indexed ${runs.length} comparison run(s).`);
}

buildComparisonsIndex();
