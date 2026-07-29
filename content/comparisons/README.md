# Comparison Runs — Real Answer Capture Required

This directory is intentionally empty until Gordo captures real Raycast/model answers.
Do not fabricate answers, grades, or model output. A comparison run is valid only
when every answer is copied from an actual Raycast/model response.

## Capturing a run

Use a project-specific run ID and save only real prompts, answers, references,
and generated artifacts. Each run should describe its own brief in
`comparison-run.md`; there is no seeded or canonical sample project.

## Models to compare

Capture 3-5 real answers. Prefer the newest/versioned model labels that Raycast exposes in the picker, and record the exact label in `answers.jsonl` (for example, `Grok-4.5 Low` if that is what Raycast shows).

Required minimum set if available:

1. Raycast Auto — baseline for Raycast's routing/default model behavior.
2. OpenAI GPT-5 / current OpenAI reasoning-capable model — strong instruction following and structured prompt writing.
3. xAI Grok — use the newest Grok version exposed by Raycast.
4. One frontier non-US/alternate lab model — use the newest available Kimi, Qwen, or DeepSeek model exposed by Raycast. Prefer Kimi or Qwen if the picker has current versions; use DeepSeek if that is the available option.

Optional 5th answer:

5. Claude Sonnet/Opus or Gemini — use whichever current model Gordo wants as the prose/continuity comparator.

If only three are available, use: Raycast Auto, newest Grok, and newest Kimi/Qwen/DeepSeek.

## Save shape after capture

Create a folder:

```text
content/comparisons/<run-id>/
```

Recommended files:

```text
comparison-run.md   # human-readable brief, models, capture notes, and summary
answers.jsonl       # one real captured model answer per line
grades.jsonl        # optional later; only after human/agent review
```

Each `answers.jsonl` line should follow `schemas/model-answer.schema.json` as closely as
possible. Minimum fields to preserve during capture:

```json
{
  "answer_id": "raycast-auto-001",
  "run_id": "your-project-run-id",
  "model": "Raycast Auto",
  "captured_at": "2026-07-09T00:00:00Z",
  "prompt": "<the exact project prompt>",
  "answer": "<verbatim model output copied from Raycast>",
  "source": "raycast",
  "notes": "Any UI/model-picker details Gordo observed"
}
```

Before committing a run, validate against the current schemas and rebuild any generated
indexes required by the app. If a schema field differs, update the run files to match the
schema rather than weakening provenance.

## Provenance rules

- Do not paraphrase model answers in `answers.jsonl`; copy them verbatim.
- Do not fill missing model answers with synthetic examples.
- If a model refuses, errors, or returns a weak answer, record the real refusal/error.
- Keep screenshots or Raycast chat links outside this repo unless they are safe to commit.
- Promote only strong, reviewed patterns back into `content/cards/` after comparison.
