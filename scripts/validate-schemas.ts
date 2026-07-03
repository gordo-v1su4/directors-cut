#!/usr/bin/env bun
/**
 * validate-schemas.ts — Validate prompt cards and comparison runs against JSON schemas.
 *
 * Usage: bun run scripts/validate-schemas.ts
 */

import { readFileSync, existsSync, readdirSync, statSync } from "fs";
import { join } from "path";
import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import * as yaml from "js-yaml";

const ROOT = join(import.meta.dir, "..");
const ajv = new Ajv2020({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

const promptCardSchema = JSON.parse(readFileSync(join(ROOT, "schemas", "prompt-card.schema.json"), "utf-8"));
const comparisonRunSchema = JSON.parse(readFileSync(join(ROOT, "schemas", "comparison-run.schema.json"), "utf-8"));
const modelAnswerSchema = JSON.parse(readFileSync(join(ROOT, "schemas", "model-answer.schema.json"), "utf-8"));

const validatePromptCard = ajv.compile(promptCardSchema);
const validateComparisonRun = ajv.compile(comparisonRunSchema);
const validateModelAnswer = ajv.compile(modelAnswerSchema);

let errors = 0;
let ok = 0;

function parseFrontmatter(content: string): { frontmatter: Record<string, unknown>; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { frontmatter: {}, body: content };
  return { frontmatter: yaml.load(match[1]) as Record<string, unknown>, body: match[2] };
}

function findMarkdownFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const results: string[] = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.endsWith(".md")) {
      results.push(fullPath);
    }
  }
  return results;
}

// Validate prompt cards
for (const filePath of findMarkdownFiles(join(ROOT, "content", "cards"))) {
  const content = readFileSync(filePath, "utf-8");
  const { frontmatter } = parseFrontmatter(content);
  const valid = validatePromptCard(frontmatter);
  if (valid) {
    console.log(`OK   card: ${filePath.replace(`${ROOT}/`, "")}`);
    ok++;
  } else {
    console.log(`FAIL card: ${filePath.replace(`${ROOT}/`, "")}`);
    for (const err of validatePromptCard.errors || []) {
      console.log(`     ${err.instancePath || "/"}: ${err.message}`);
    }
    errors++;
  }
}

// Validate comparison runs
for (const filePath of findMarkdownFiles(join(ROOT, "content", "comparisons"))) {
  const content = readFileSync(filePath, "utf-8");
  const { frontmatter } = parseFrontmatter(content);
  const valid = validateComparisonRun(frontmatter);
  if (valid) {
    console.log(`OK   run:  ${filePath.replace(`${ROOT}/`, "")}`);
    ok++;
  } else {
    console.log(`FAIL run:  ${filePath.replace(`${ROOT}/`, "")}`);
    for (const err of validateComparisonRun.errors || []) {
      console.log(`     ${err.instancePath || "/"}: ${err.message}`);
    }
    errors++;
  }
}

console.log(`\n${ok} OK, ${errors} errors`);
process.exit(errors ? 1 : 0);
