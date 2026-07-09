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
} from 'fs';
import { join } from 'path';
import type { ComparisonRun, ModelAnswer, ComparisonArtifact } from '../src/lib/types/comparison';

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

  for (const line of yamlText.split('\n')) {
    const trimmed = line.trim();

    if (trimmed.startsWith('- ') && currentKey) {
      const value = trimmed.replace(/^- /, '').replace(/^"(.*)"$/, '$1').trim();
      listItems.push(value);
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
  }

  if (inList && listItems.length > 0) {
    frontmatter[currentKey] = listItems;
  }

  return { frontmatter, body };
}

function readRunDir(runDir: string): { run: ComparisonRun; answers: ModelAnswer[]; artifacts: ComparisonArtifact[] } {
  const runFile = join(runDir, 'comparison-run.md');
  const answersFile = join(runDir, 'answers.jsonl');
  const artifactsFile = join(runDir, 'artifacts.jsonl');

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

  return { run, answers, artifacts };
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
    const { run, answers, artifacts } = readRunDir(runDir);

    if (!run.run_id) run.run_id = runId;

    const runOutputDir = join(RUNS_OUTPUT_DIR, runId);
    mkdirSync(runOutputDir, { recursive: true });
    writeFileSync(join(runOutputDir, 'answers.json'), JSON.stringify(answers, null, 2));
    writeFileSync(join(runOutputDir, 'artifacts.json'), JSON.stringify(artifacts, null, 2));

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

  // If there are no real runs yet, still seed the planned run id so the UI can render
  // an empty-state table with the expected model rows.
  const plannedRunId = '2026-07-netflix-teaser-title-slam-001';
  const hasPlanned = runs.some((r) => r.run.run_id === plannedRunId);
  if (!hasPlanned) {
    const plannedRun: ComparisonRun = {
      run_id: plannedRunId,
      title: 'Netflix Teaser Title Slam — First Raycast Model Comparison',
      question:
        'You are helping build a prompt-card library for AI video generation.\n\n' +
        'Creative brief: Create a Netflix-style supernatural thriller teaser called THE GLASS HOUSE. The teaser should feel premium, cinematic, ominous, and suitable for a streaming series proof-of-concept. Target runtime: ~12 seconds for Sora, ~15 seconds for Seedance.\n\n' +
        'Task: Write the best video-generation prompt for this brief.',
      created: new Date().toISOString(),
      created_by: 'raycast-script-command',
      status: 'running',
      models_requested: EXPECTED_MODELS,
      target_models: ['general_video', 'seedance-2.0'],
      tags: ['netflix_teaser', 'title_slam', 'raycast'],
    };

    const runOutputDir = join(RUNS_OUTPUT_DIR, plannedRunId);
    mkdirSync(runOutputDir, { recursive: true });
    writeFileSync(join(runOutputDir, 'answers.json'), JSON.stringify([], null, 2));
    writeFileSync(join(runOutputDir, 'artifacts.json'), JSON.stringify([], null, 2));

    runs.push({
      run: plannedRun,
      summary: {
        run_id: plannedRun.run_id,
        title: plannedRun.title,
        status: plannedRun.status,
        answer_count: 0,
        artifact_count: 0,
        model_labels: [],
        created: plannedRun.created,
      },
    });
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
