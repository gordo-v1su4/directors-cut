# Hermes generation handoff — image grid → video → directors-cut

**Context:** The `directors-cut` UI now has a place for generation prompts (`GenerationPrompt`) and links each image/video artifact to the prompt that produced it. This doc tells Hermes how to produce the first real set of images and video and wire them into the comparison run.

## What we need

For the existing comparison run `2026-07-netflix-teaser-title-slam-001` (or a new run you create), produce **one image grid and two videos per LLM answer**:

1. A **cinematic image grid** (collage) from the LLM's prompt, using the `generate_cinematic_grid` bridge tool.
2. A **Seedance video** from that LLM's prompt.
3. A **Sora video** from that LLM's prompt (same prompt adapted for Sora if needed).
4. The **actual prompts** sent to each generator.
5. The **media files** saved locally and referenced with URLs.

The goal is to judge **which LLM wrote the best prompt**, not to judge the video generators. Seedance and Sora are just the two output columns.

## Where to put things

All files go under:

```text
directors-cut/content/comparisons/<run-id>/
```

For the current run use:

```text
directors-cut/content/comparisons/2026-07-netflix-teaser-title-slam-001/
```

### Files to create

| File | Purpose | Format |
|---|---|---|
| `answers.jsonl` | **LLM/chat-model answers only** — one row per LLM (Raycast Auto, GPT-5.5, Grok-4.5, etc.). Captured by Raycast Script Command. | JSONL |
| `artifacts.jsonl` | One row per generated image/video. Each row must point to the LLM answer that produced it and declare its target model (`seedance` or `sora`). | JSONL |
| `prompts.jsonl` | One row per concrete prompt. Each row must point to the LLM answer it came from. | JSONL |
| `media/` | Local directory for downloaded images and videos. | Files |

## Step-by-step

### 1. Pick the brief and card

Use the existing `THE GLASS HOUSE` brief from `content/comparisons/2026-07-netflix-teaser-title-slam-001/comparison-run.md` (or create the run if it doesn't exist). Pick a matching prompt card from `content/cards/`, e.g.:

- `content/cards/seedance/seedance-netflix-teaser-title-slam.md`
- `content/cards/sora/sora-netflix-teaser-cinematic-continuity.md`

### 2. Generate the image grid

Call the Raycast bridge tool from the Mac side (or instruct omp to run it). The tool is `generate_cinematic_grid`.

Example input:

```json
{
  "brief": "THE GLASS HOUSE — Netflix-style supernatural thriller teaser. Premium, cinematic, ominous. ~12s for Sora, ~15s for Seedance. One eerie location beat, one human reaction beat, one symbolic impact/action beat, final hard title-slam.",
  "grid_layout": "3x3",
  "aspect_ratio": "16:9",
  "resolution": "2k",
  "model": "nano_banana_2"
}
```

Use the bridge URL `http://127.0.0.1:8787` (or the Tailscale VPS URL if running from RackNerd5). Get a real `job_id` back.

Poll `get_research_status` and `read_research_artifact` for:

- `prompt.md` — the actual prompt sent to the image model.
- `results.json` — the image URLs/captions.

### 3. Download the grid images

Download the images from `results.json` and put them in:

```text
directors-cut/content/comparisons/2026-07-netflix-teaser-title-slam-001/media/
```

Name them clearly, e.g.:

- `grid-3x3-001.png`
- `video-001.mp4`

You can also use the original remote URLs if they are persistent. For local-first storage, download and use a relative `local_path` plus `media_url` pointing to the public data path.

### 4. Generate the video

Use the image grid as reference (image-to-video) or use the best prompt from the grid. Target Seedance 2.0. Save the video the same way.

Capture the exact prompt text sent to the video model.

### 5. Write `prompts.jsonl`

One `GenerationPrompt` per line. **Critical:** `answer_id` must point to the LLM answer that produced this prompt, so the UI knows which LLM to credit.

Example for an LLM answer with `answer_id: "gpt-5.5-001"`:

```jsonl
{"prompt_id":"gp-2026-07-09-glasshouse-gpt-grid-001","run_id":"2026-07-netflix-teaser-title-slam-001","answer_id":"gpt-5.5-001","slot_type":"shot_grid","prompt_text":"THE GLASS HOUSE — one 16:9 cinematic image containing a clean 3x3 semantic storyboard...","model":"nano_banana_2","provider":"nano_banana_2","created_at":"2026-07-09T18:00:00Z","source":"generated","artifact_ids":["artifact-grid-001"],"notes":"Grid prompt generated from GPT-5.5's answer."}
{"prompt_id":"gp-2026-07-09-glasshouse-gpt-seedance-001","run_id":"2026-07-netflix-teaser-title-slam-001","answer_id":"gpt-5.5-001","slot_type":"video_result","prompt_text":"12-second Seedance 2.0 image-to-video premium streaming teaser...","model":"seedance-2.0","provider":"seedance","created_at":"2026-07-09T18:05:00Z","source":"generated","artifact_ids":["artifact-video-seedance-001"],"notes":"Seedance video prompt generated from GPT-5.5's answer."}
{"prompt_id":"gp-2026-07-09-glasshouse-gpt-sora-001","run_id":"2026-07-netflix-teaser-title-slam-001","answer_id":"gpt-5.5-001","slot_type":"video_result","prompt_text":"Sora 2 natural-language premium streaming teaser...","model":"sora-2","provider":"sora","created_at":"2026-07-09T18:10:00Z","source":"generated","artifact_ids":["artifact-video-sora-001"],"notes":"Sora video prompt generated from GPT-5.5's answer."}
```

### 6. Write `artifacts.jsonl`

One `ComparisonArtifact` per line. Link each artifact to its `prompt_id` and the LLM `answer_id`. Set `target_model` to `seedance` or `sora` so the UI routes it to the right column.

```jsonl
{"artifact_id":"artifact-grid-001","run_id":"2026-07-netflix-teaser-title-slam-001","answer_id":"gpt-5.5-001","artifact_type":"shot_grid","provider":"nano_banana_pro","title":"THE GLASS HOUSE 3x3 image grid (GPT-5.5)","prompt_id":"gp-2026-07-09-glasshouse-gpt-grid-001","prompt_text":"...","target_model":"nano_banana_2","media_url":"/data/comparisons/2026-07-netflix-teaser-title-slam-001/media/grid-gpt-001.png","local_path":"media/grid-gpt-001.png","thumbnail_url":"/data/comparisons/2026-07-netflix-teaser-title-slam-001/media/grid-gpt-001.png","created_at":"2026-07-09T18:00:00Z","source":"generated","status":"generated"}
{"artifact_id":"artifact-video-seedance-001","run_id":"2026-07-netflix-teaser-title-slam-001","answer_id":"gpt-5.5-001","artifact_type":"video_result","provider":"seedance","title":"THE GLASS HOUSE Seedance video (GPT-5.5)","prompt_id":"gp-2026-07-09-glasshouse-gpt-seedance-001","prompt_text":"...","target_model":"seedance","media_url":"/data/comparisons/2026-07-netflix-teaser-title-slam-001/media/video-gpt-seedance-001.mp4","local_path":"media/video-gpt-seedance-001.mp4","thumbnail_url":"/data/comparisons/2026-07-netflix-teaser-title-slam-001/media/grid-gpt-001.png","created_at":"2026-07-09T18:05:00Z","source":"generated","status":"generated"}
{"artifact_id":"artifact-video-sora-001","run_id":"2026-07-netflix-teaser-title-slam-001","answer_id":"gpt-5.5-001","artifact_type":"video_result","provider":"sora","title":"THE GLASS HOUSE Sora video (GPT-5.5)","prompt_id":"gp-2026-07-09-glasshouse-gpt-sora-001","prompt_text":"...","target_model":"sora","media_url":"/data/comparisons/2026-07-netflix-teaser-title-slam-001/media/video-gpt-sora-001.mp4","local_path":"media/video-gpt-sora-001.mp4","thumbnail_url":"/data/comparisons/2026-07-netflix-teaser-title-slam-001/media/grid-gpt-001.png","created_at":"2026-07-09T18:10:00Z","source":"generated","status":"generated"}
```

### 7. Rebuild the public data index

From the `directors-cut` repo root:

```bash
bun scripts/build-comparisons-index.ts
bun scripts/validate-schemas.ts
bun run check
```

This emits:

- `public/data/comparisons/2026-07-netflix-teaser-title-slam-001/answers.json`
- `public/data/comparisons/2026-07-netflix-teaser-title-slam-001/artifacts.json`
- `public/data/comparisons/2026-07-netflix-teaser-title-slam-001/prompts.json`

### 8. Commit

Commit the new `content/comparisons/...` files and the rebuilt `public/data/...` files. Do not fabricate answers; only commit the real grid/video/prompts you generated.

## Schema reference

- `src/lib/types/comparison.ts` — canonical `GenerationPrompt`, `ComparisonArtifact`, `ComparisonRunDetail` types.
- `schemas/generation-prompt.schema.json` — JSON schema for one `prompts.jsonl` row.
- `schemas/comparison-run.schema.json` — JSON schema for run frontmatter.

## UI behavior once data exists

- The `/comparisons` table has **one row per LLM** (Raycast Auto, GPT-5.5, Grok-4.5, etc.).
- Columns are: **Shot grid**, **Prompt-only video (Seedance)**, **Prompt-only video (Sora)**, **Reference images**, **Reference-assisted image**, **Ref-assisted video (Seedance)**, **Ref-assisted video (Sora)**.
- Each image/video slot shows a prompt badge with the LLM name and target model (e.g. `GPT-5.5 · seedance-2.0`).
- Clicking the badge opens a modal with the full prompt + the LLM that wrote it + the generated media.
- The `/dashboard` shows a **Latest Media** feed of the most recent grid/video generations.

## Constraints

- **Do not fabricate** LLM answers or media. Only commit real outputs.
- **Ask Gordo before running billable video generation** (per `SECURITY.md`).
- `answers.jsonl` must contain only LLM/chat-model answers, not video-generator rows.
- Every artifact must have a valid `answer_id` matching an LLM answer and `target_model` set to `seedance` or `sora` so it lands in the right column.
