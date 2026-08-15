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
  renameSync,
} from 'fs';
import { join } from 'path';
import type { ComparisonRun, ModelAnswer, ComparisonArtifact, GenerationPrompt, ConceptDecision } from '../src/lib/types/comparison';

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

  function parseScalar(raw: string): string {
    const value = raw.trim();
    if (value.startsWith('"') && value.endsWith('"')) {
      try {
        return JSON.parse(value) as string;
      } catch {
        return value.slice(1, -1);
      }
    }
    return value;
  }

  const lines = yamlText.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') && currentKey) {
      const value = parseScalar(trimmed.replace(/^- /, ''));
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
      const value = parseScalar(kvMatch[2]);

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

function writeJsonAtomic(path: string, value: unknown): void {
  const temporary = `${path}.tmp-${process.pid}`;
  writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`);
  renameSync(temporary, path);
}

function readJsonLines<T>(path: string, label: string): T[] {
  if (!existsSync(path)) return [];
  const values: T[] = [];
  const text = readFileSync(path, 'utf-8');
  for (const line of text.split('\n')) {
    if (!line.trim()) continue;
    try {
      values.push(JSON.parse(line) as T);
    } catch (error) {
      console.error(`Failed to parse ${label} line in ${path}:`, error);
    }
  }
  return values;
}

function readRunDir(runDir: string): { run: ComparisonRun; answers: ModelAnswer[]; artifacts: ComparisonArtifact[]; prompts: GenerationPrompt[]; decisions: ConceptDecision[] } {
  const runFile = join(runDir, 'comparison-run.md');
  const answersFile = join(runDir, 'answers.jsonl');
  const artifactsFile = join(runDir, 'artifacts.jsonl');
  const promptsFile = join(runDir, 'prompts.jsonl');
  const decisionsFile = join(runDir, 'concept-decisions.jsonl');

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

  const answers = readJsonLines<ModelAnswer>(answersFile, 'answer');
  const artifacts = readJsonLines<ComparisonArtifact>(artifactsFile, 'artifact');
  const prompts = readJsonLines<GenerationPrompt>(promptsFile, 'prompt');
  const decisions = readJsonLines<ConceptDecision>(decisionsFile, 'decision');

  return { run, answers, artifacts, prompts, decisions };
}

function buildComparisonsIndex(): void {
  if (!existsSync(COMPARISONS_DIR)) {
    console.log('No comparisons directory yet; nothing to index.');
    mkdirSync(RUNS_OUTPUT_DIR, { recursive: true });
    writeJsonAtomic(
      join(OUTPUT_DIR, 'comparisons.index.json'),
      { runs: [], expected_models: EXPECTED_MODELS }
    );
    return;
  }

  mkdirSync(RUNS_OUTPUT_DIR, { recursive: true });

  const entries = readdirSync(COMPARISONS_DIR).filter((name) => {
    const full = join(COMPARISONS_DIR, name);
    return statSync(full).isDirectory();
  }).sort();

  const runs: { run: ComparisonRun; summary: unknown }[] = [];

  for (const runId of entries) {
    const runDir = join(COMPARISONS_DIR, runId);
    const { run, answers, artifacts, prompts, decisions } = readRunDir(runDir);

    if (!run.run_id) run.run_id = runId;

    const runOutputDir = join(RUNS_OUTPUT_DIR, runId);
    mkdirSync(runOutputDir, { recursive: true });
    writeJsonAtomic(join(runOutputDir, 'run.json'), run);
    writeJsonAtomic(join(runOutputDir, 'answers.json'), answers);
    writeJsonAtomic(join(runOutputDir, 'artifacts.json'), artifacts);
    writeJsonAtomic(join(runOutputDir, 'prompts.json'), prompts);
    writeJsonAtomic(join(runOutputDir, 'decisions.json'), decisions);

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

    const latestDecisionByAnswer = new Map<string, ConceptDecision>();
    for (const decision of decisions) latestDecisionByAnswer.set(decision.answer_id, decision);
    const currentAnswerByModel = new Map<string, ModelAnswer>();
    for (const answer of answers) {
      const isImagePipeline = answer.model_class === 'image_generator' ||
        answer.target_model.toLowerCase().includes('nano_banana') ||
        answer.model_name.toLowerCase().includes('nano banana');
      if (!isImagePipeline) currentAnswerByModel.set(answer.model_name, answer);
    }
    const approvedConceptCount = [...currentAnswerByModel.values()].filter((answer) => {
      const concept = answer.structured_prompt;
      const eligible = answer.structure_status === 'valid' && concept?.package_type === 'creative_concept_v1';
      return eligible && latestDecisionByAnswer.get(answer.answer_id)?.decision === 'approved';
    }).length;

    const summary = {
      run_id: run.run_id,
      title: run.title,
      status: run.status,
      answer_count: answers.length,
      artifact_count: artifacts.length,
      approved_concept_count: approvedConceptCount,
      model_labels: answers.map((a) => a.model_name),
      created: run.created,
    };

    runs.push({ run, summary });
  }

  writeJsonAtomic(
    join(OUTPUT_DIR, 'comparisons.index.json'),
    {
      runs: runs.map((r) => r.summary),
      expected_models: EXPECTED_MODELS,
    }
  );

  console.log(`Indexed ${runs.length} comparison run(s).`);
}

buildComparisonsIndex();
