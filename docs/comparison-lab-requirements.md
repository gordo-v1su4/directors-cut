# Directors Cut Comparison Lab — B3b Requirements

Last updated: 2026-07-09 by Hermes.

Purpose: define the comparison UI Gordo described so B3b does not stop at a text table. The UI must compare the prompt text, model identity, generated visual previews, and iteration actions side-by-side.

## User goal

For each comparison run, Gordo should be able to see:

1. The original creative brief / prompt sent to Raycast models.
2. The exact Raycast model label for every answer, e.g. `Grok-4.5 Low`, `GPT-5.5`, `Gemini Pro 3.5`, `Claude Opus`, `Kimi K2.7 Code`, `Qwen3-32B`, `DeepSeek <version>`.
3. The model's returned video-generation prompt / answer.
4. One or both visual result types attached to that answer:
   - a 3x3 Nano Banana Pro cinematic shot-grid preview of the prompt; and/or
   - a Sora or Seedance video result generated from the prompt.
5. Easy side-by-side comparison across models and across revised prompt attempts.
6. Controls to alter the prompt, resend it, or attach a reference image for the next run.

Do not fabricate answers, shot grids, reference images, or video results. Empty states must say what is missing and how to capture/generate it.

## Screen: Comparison Lab

Suggested route: `/comparisons` with optional detail route `/comparisons/[run_id]`.

### Top-level list

Show comparison runs with:

- run title
- run id
- status: draft / running / answers_collected / media_generated / reviewed / promoted
- number of captured answers
- number of visual artifacts
- model labels included
- created date
- quick action: open run

### Run detail layout

Dense, visual, comparison-first layout:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ THE GLASS HOUSE — Netflix Teaser Title Slam             [Copy prompt] [Edit] │
│ Run: 2026-07-netflix-teaser-title-slam-001    Status: answers_collected      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Brief / prompt sent to every model                                           │
│ [collapsed excerpt with expand/copy]                                         │
├──────────────┬────────────────────┬────────────────────┬────────────────────┤
│ Model        │ Returned prompt     │ 3x3 shot grid       │ Sora/Seedance      │
├──────────────┼────────────────────┼────────────────────┼────────────────────┤
│ Grok-4.5 Low │ text excerpt + copy │ thumbnail grid       │ video card/player  │
│ Kimi K2.7    │ text excerpt + copy │ pending/generate     │ pending/generate   │
│ Qwen3-32B    │ text excerpt + copy │ thumbnail grid       │ failed/retry       │
│ GPT-5.5      │ missing/capture     │ —                    │ —                  │
└──────────────┴────────────────────┴────────────────────┴────────────────────┘
```

Each row represents a captured model answer. Each row should expose:

- exact model label badge
- answer status
- answer text excerpt + detail drawer/full view
- copy answer
- copy extracted/final video prompt
- visual artifacts attached to this answer
- notes/review status
- actions: alter, resend, add reference image, generate shot grid, generate video

## Visual artifact model

A comparison answer can have zero or more visual artifacts. Suggested JSONL/file shape for future schema work:

```ts
type ComparisonArtifact = {
  artifact_id: string;
  run_id: string;
  answer_id: string;
  artifact_type: 'shot_grid' | 'video_result' | 'reference_image' | 'prompt_revision';
  provider: 'nano_banana_pro' | 'sora' | 'seedance' | 'manual_upload' | 'raycast' | string;
  title: string;
  prompt_text?: string;
  media_url?: string;
  local_path?: string;
  thumbnail_url?: string;
  reference_image_ids?: string[];
  created_at: string;
  source: 'generated' | 'uploaded' | 'captured' | 'manual';
  notes?: string;
};
```

Potential files under a run folder:

```text
content/comparisons/<run-id>/
  comparison-run.md
  answers.jsonl
  artifacts.jsonl        # future: visual/generated media metadata
  revisions.jsonl        # future: altered/resubmitted prompts
  references/            # optional safe reference image metadata, not large binaries
```

## Required UI states

For each model answer row:

1. No answer yet
   - Show `Capture real Raycast answer first`.
   - Offer `Copy comparison prompt`.

2. Answer captured, no media yet
   - Show answer text.
   - Offer `Generate 3x3 Nano Banana Pro shot grid`.
   - Offer `Generate Sora/Seedance result`.
   - Offer `Add reference image for next run`.

3. Shot grid generated
   - Show a compact 3x3 thumbnail grid.
   - Click opens larger preview.
   - Include prompt used, provider, and created_at.

4. Video result generated
   - Show video card/player thumbnail.
   - Provider badge: Sora or Seedance.
   - Include duration/aspect ratio if known.

5. Needs revision
   - User can edit/alter prompt in a revision drawer.
   - Resend should create a new revision/answer/artifact, not overwrite the original.

## Iteration actions

The UI should support these actions eventually:

- Copy original comparison prompt.
- Copy a model's returned prompt.
- Mark answer as keep / remix / reject.
- Add a reference image to a next run.
- Create a prompt revision from an answer.
- Resend revised prompt to Raycast or to the bridge.
- Attach generated Nano Banana Pro 3x3 shot grid.
- Attach generated Sora or Seedance result.
- Compare original vs revised output.

Until generation integration exists, these actions can be disabled buttons with clear labels, but the layout should reserve their places so B3b does not need a redesign.

## Table implementation note

Current B3a uses a native Svelte dense table, not TanStack Table. That is acceptable for the 10-card library. For Comparison Lab, TanStack Table is optional, but useful if the UI needs:

- column resizing
- pinned model column
- sorting/filtering large answer/artifact sets
- row expansion for revisions

If TanStack is introduced, isolate it behind a wrapper component so API churn does not leak through the app.

## Acceptance checklist for B3b

- [ ] `/comparisons` route exists.
- [ ] It reads real comparison run folders from `content/comparisons` or generated public data.
- [ ] It displays original prompt/brief, exact model names, answer text, and visual artifact slots.
- [ ] It has empty states for missing answers/media instead of fake placeholders.
- [ ] It can compare at least three model answers side-by-side.
- [ ] It has clear slots for Nano Banana Pro 3x3 shot-grid previews.
- [ ] It has clear slots for Sora/Seedance video results.
- [ ] It exposes alter/resend/add-reference-image actions, even if initially disabled.
- [ ] It preserves original answers and creates revisions instead of overwriting.
- [ ] `bun run check` passes.
