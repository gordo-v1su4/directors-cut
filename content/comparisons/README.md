# Comparison Runs — Real Answer Capture Required

This directory is intentionally empty until Gordo captures real Raycast/model answers.
Do not fabricate answers, grades, or model output. A comparison run is valid only
when every answer is copied from an actual Raycast/model response.

## First run to capture

Run ID suggestion: `2026-07-netflix-teaser-title-slam-001`

Purpose: test whether the current Directors Cut prompt-card library produces useful,
model-specific video prompts for a Netflix-style teaser/title-slam brief.

## Exact prompt for Gordo to run

Paste the same prompt into each model/Raycast chat being compared:

```text
You are helping build a prompt-card library for AI video generation.

Creative brief: Create a 10-12 second Netflix-style supernatural thriller teaser called THE GLASS HOUSE. The teaser should feel premium, cinematic, ominous, and suitable for a streaming series proof-of-concept. It should include: one eerie location beat, one human reaction beat, one symbolic impact/action beat, and a final hard title-card/title-slam moment.

Task: Write the best video-generation prompt for this brief. Make it practical for an AI video model to follow. Include timing or shot structure if that helps. Include camera, lighting, motion, audio/SFX, and title reveal details. Avoid copyrighted characters, real show names, or protected IP beyond the generic phrase "Netflix-style" as a quality/aesthetic shorthand.

Output only:
1. A final prompt ready to paste into an AI video generator.
2. A short note naming which model or style of model this prompt is optimized for, and why.
```

## Models to compare

Capture 3-5 real answers. Preferred set:

1. Raycast Auto — baseline for Raycast's routing/default model behavior.
2. GPT-5 / OpenAI reasoning-capable model — strong instruction following and structured prompt writing.
3. Claude Sonnet / Claude Opus — strong cinematic prose and continuity.
4. Gemini / Google model — alternative multimodal/video-prompt style.
5. Optional: any Raycast-available video-specialist or creative model Gordo wants to test.

If only three are available, use: Raycast Auto, GPT-5/OpenAI, Claude.

## Save shape after capture

Create a folder:

```text
content/comparisons/2026-07-netflix-teaser-title-slam-001/
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
  "run_id": "2026-07-netflix-teaser-title-slam-001",
  "model": "Raycast Auto",
  "captured_at": "2026-07-09T00:00:00Z",
  "prompt": "<the exact prompt above>",
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
