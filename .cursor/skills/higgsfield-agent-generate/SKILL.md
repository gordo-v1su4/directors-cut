---
name: higgsfield-agent-generate
description: Generate Sora video or Nano Banana shot grids for an approved Directors Cut concept using the Higgsfield Cursor MCP plugin (preferred) or CLI fallback. Use when the user approved a concept on Projects and wants the agent to generate media, or when the web UI Higgsfield auth fails.
---

# Higgsfield Agent Generation (Directors Cut)

Use this when a concept is **approved** on `/comparisons` and the user wants video or shot grid — especially when the web UI quote button fails on CLI auth.

## Two paths (prefer MCP)

| Path | When |
|------|------|
| **Higgsfield MCP plugin** (preferred) | Plugin shows green dot in Cursor Settings → Tools & MCPs |
| **Bridge + CLI** | User clicks Get live quote in Projects UI; requires `higgsfield auth login` |

This skill covers the **agent MCP path**.

## Prerequisites

1. Run has `answers_collected` and user approved one answer (or approve via bridge `record_concept_decision`).
2. **Higgsfield MCP** authenticated: Cursor Settings → Tools & MCPs → `higgsfield` green dot. If error, user completes plugin auth in Cursor (not terminal CLI).
3. Read run data:
   - `content/comparisons/<run-id>/answers.jsonl`
   - `content/comparisons/<run-id>/concept-decisions.jsonl` (if exists)
   - `public/data/comparisons/<run-id>/decisions.json`

## Step 1 — Resolve approved concept

Find the approved `answer_id`. Use its `structured_prompt.sora_prompt` as the **exact Sora generation prompt** (12s, 16:9).

Example run: `20260818-180320-checkout-teaser` — approved concept **CHECKOUT** (`chatgpt-eed01c2b`).

## Step 2 — Generate via Higgsfield MCP

Call `GetMcpTools` on server `plugin-higgsfield-higgsfield`, then invoke the appropriate tool:

- **Sora video** — use the plugin's video generation tool with the full `sora_prompt` text, 12 seconds, 16:9 landscape.
- **Nano Banana shot grid** — use image/grid tool with a brief derived from the sora prompt (3×3 storyboard).

Poll until complete. Download media to:

```text
content/comparisons/<run-id>/media/
```

## Step 3 — Persist artifacts (required for Projects grid)

Append to `content/comparisons/<run-id>/artifacts.jsonl`:

```jsonl
{"artifact_id":"artifact-sora-<slug>-001","run_id":"<run-id>","answer_id":"<answer-id>","artifact_type":"video_result","provider":"higgsfield","title":"CHECKOUT Sora video (ChatGPT)","prompt_id":"gp-<run>-sora-001","target_model":"sora","media_url":"/data/comparisons/<run-id>/media/checkout-sora-001.mp4","local_path":"media/checkout-sora-001.mp4","created_at":"<iso>","source":"generated","status":"generated"}
```

Append matching row to `prompts.jsonl` linking `answer_id` and `artifact_id`.

For shot grids use `"artifact_type":"shot_grid"` and `"provider":"nano_banana_pro"`.

## Step 4 — Rebuild index

```bash
cd "$DIRECTORS_CUT_PATH" && bun run build:comparisons
```

Refresh Projects — video appears in the **Sora** column; grid in **Shot grid**.

## Step 5 — Confirm with user

Report: run id, answer id, artifact paths, media URL. User reviews in Projects before promoting to Library.

## Do not

- Regenerate without approval on that answer
- Fabricate LLM answers in `answers.jsonl`
- Skip `build:comparisons` after writing artifacts
