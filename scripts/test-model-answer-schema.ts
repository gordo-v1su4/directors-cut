#!/usr/bin/env bun

import { readFileSync } from "fs";
import { join } from "path";
import Ajv2020 from "ajv/dist/2020";

const root = join(import.meta.dir, "..");
const schema = JSON.parse(readFileSync(join(root, "schemas", "model-answer.schema.json"), "utf-8"));
const validate = new Ajv2020({ allErrors: true, allowUnionTypes: true }).compile(schema);

const baseAnswer = {
  answer_id: "answer-test-001",
  run_id: "run-test-001",
  agent_name: "Raycast Capture",
  model_name: "ChatGPT",
  model_class: null,
  target_model: "sora-2",
  prompt_mode: "creative-concept",
  answer_text: "Verbatim model output",
  created_at: "2026-08-14T00:00:00Z",
  source: "raycast",
};

const validPackage = {
  package_type: "creative_concept_v1",
  title: "Midnight Harvest",
  logline: "A festival weekend becomes an uncanny reckoning.",
  summary: "A high-paced young-adult sizzler with a sharp final reversal.",
  sora_prompt: "Create a fast, open-ended 12-second cinematic sizzler...",
  runtime_seconds: 12,
  prompt_count: 1,
};

const cases: Array<{ name: string; value: unknown; expected: boolean }> = [
  {
    name: "accepts a valid creative concept package",
    value: { ...baseAnswer, structured_prompt: validPackage, structure_status: "valid" },
    expected: true,
  },
  {
    name: "rejects a creative concept package missing its Sora prompt",
    value: {
      ...baseAnswer,
      structured_prompt: { ...validPackage, sora_prompt: undefined },
      structure_status: "valid",
    },
    expected: false,
  },
  {
    name: "rejects a non-12-second creative concept package",
    value: {
      ...baseAnswer,
      structured_prompt: { ...validPackage, runtime_seconds: 15 },
      structure_status: "valid",
    },
    expected: false,
  },
  {
    name: "rejects a creative concept package with multiple prompts",
    value: {
      ...baseAnswer,
      structured_prompt: { ...validPackage, prompt_count: 2 },
      structure_status: "valid",
    },
    expected: false,
  },
  {
    name: "accepts existing legacy structured prompts",
    value: {
      ...baseAnswer,
      structured_prompt: { title: "Legacy prompt", runtime_seconds: 12, sections: [] },
    },
    expected: true,
  },
  {
    name: "accepts preserved raw output after parsing failure",
    value: {
      ...baseAnswer,
      structured_prompt: null,
      structure_status: "invalid",
    },
    expected: true,
  },
  {
    name: "rejects valid status with a null structured prompt",
    value: { ...baseAnswer, structured_prompt: null, structure_status: "valid" },
    expected: false,
  },
  {
    name: "rejects invalid status with a non-null structured prompt",
    value: { ...baseAnswer, structured_prompt: validPackage, structure_status: "invalid" },
    expected: false,
  },
  {
    name: "rejects a creative concept package without structure status",
    value: { ...baseAnswer, structured_prompt: validPackage },
    expected: false,
  },
  {
    name: "rejects whitespace-only creative concept fields",
    value: {
      ...baseAnswer,
      structured_prompt: { ...validPackage, title: "   " },
      structure_status: "valid",
    },
    expected: false,
  },
  {
    name: "retains backward compatibility with legacy primitive prompts",
    value: { ...baseAnswer, structured_prompt: "legacy prompt text" },
    expected: true,
  },
  {
    name: "retains backward compatibility with legacy array prompts",
    value: { ...baseAnswer, structured_prompt: ["first", 2, true] },
    expected: true,
  },
];

let failures = 0;
for (const testCase of cases) {
  const actual = validate(testCase.value);
  if (actual === testCase.expected) {
    console.log(`PASS ${testCase.name}`);
  } else {
    failures++;
    console.error(`FAIL ${testCase.name}`);
    console.error(validate.errors);
  }
}

console.log(`\n${cases.length - failures} passed, ${failures} failed`);
process.exit(failures ? 1 : 0);
