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


## Version and reference-image comparison UX

Gordo's desired B3b/B3c interaction is not just a static answer table. Each visual slot should behave like a fast version browser.

### Per-cell version dropdown / quick toggle

For every visual result cell — Nano Banana Pro shot grid, still image result, Sora result, Seedance result, or final/end video — the UI should support previous versions:

- compact version dropdown in the cell header, e.g. `v1`, `v2`, `v3`, `latest`
- keyboard/arrow or tiny previous/next controls for rapid toggling
- instant thumbnail/preview swap while toggling
- selected version metadata visible without leaving the table:
  - provider/model
  - created_at
  - prompt/revision id
  - reference image set, if any
  - status: pending / generated / failed / selected / rejected
- do not reload the whole page when switching versions
- preserve the user's selected version in UI state so comparing across columns remains stable

The version browser should feel like scrubbing through creative takes, not opening separate pages.

Suggested in-memory shape for a visual cell:

```ts
type VersionedArtifactSlot = {
  slot_type: 'shot_grid' | 'image_result' | 'video_result' | 'end_video';
  active_artifact_id: string | null;
  versions: ComparisonArtifact[];
};
```

### Column groups: no-reference vs reference-assisted generations

The comparison table should separate prompt-only generations from reference-assisted generations.

Recommended columns:

```text
Model / Answer
Prompt-only image or 3x3 grid
Prompt-only Sora/Seedance video
Reference images used
Reference-assisted image or 3x3 grid
Reference-assisted Sora/Seedance video
Notes / Keep / Remix
```

This lets Gordo compare:

1. the model answer text itself
2. what the prompt produces with no visual references
3. what the same or revised prompt produces with Pinterest/reference images
4. whether references improved style, composition, casting, lighting, or continuity

### Pinterest references vs generic reference images

Use these terms distinctly:

- **Reference image**: any image used to guide the next generation. It can be a screenshot, uploaded image, generated frame, moodboard image, product image, character image, Pinterest image, or prior output.
- **Pinterest reference**: a reference image whose source/provenance is Pinterest or a Pinterest-style moodboard. It is mainly useful for aesthetic direction: composition, palette, wardrobe, interior design, lighting, poster framing, etc.

UI implication:

- Store both under the same `reference_image` artifact type.
- Add `source_platform: 'pinterest' | 'upload' | 'generated' | 'web' | 'manual' | string`.
- Show a Pinterest badge only when the source is Pinterest.
- Do not assume Pinterest references are legally safe production assets; treat them as visual mood/style references unless explicitly cleared.

Suggested reference metadata:

```ts
type ReferenceImageArtifact = ComparisonArtifact & {
  artifact_type: 'reference_image';
  source_platform?: 'pinterest' | 'upload' | 'generated' | 'web' | 'manual' | string;
  reference_role?: 'style' | 'composition' | 'character' | 'product' | 'lighting' | 'environment' | 'mood';
  rights_status?: 'unknown' | 'mood_reference_only' | 'owned' | 'licensed' | 'generated';
};
```

### Fast preview behavior

The UI should optimize for responsiveness:

- show thumbnails/posters first, not many live video elements
- lazy-load full video only when a user opens/plays a specific version
- use poster frames for Sora/Seedance cells
- keep the 3x3 shot-grid as a single preview image or sprite, with optional click-to-expand
- avoid mounting multiple full `<video>` players in the table at once
- preload adjacent versions' thumbnails if cheap

### Revision lineage

Every altered/resubmitted prompt should create a lineage, not overwrite prior work:

```text
answer_id -> revision_id -> artifact versions
```

Example:

```text
Grok-4.5 Low answer
  rev-001 prompt-only
    shot-grid v1
    seedance v1
  rev-002 with Pinterest refs: glass-house-interior, pale-woman-silhouette
    shot-grid v1
    seedance v1
    seedance v2
```

The comparison UI should make this lineage visible through the version dropdown and a detail drawer.

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
- [ ] Each image/video/end-video cell has a version dropdown or fast previous/next toggle with responsive thumbnail previews.
- [ ] It separates prompt-only generations from reference-assisted generations in adjacent columns.
- [ ] It distinguishes Pinterest references from generic reference images using provenance/source badges.
- [ ] It exposes alter/resend/add-reference-image actions, even if initially disabled.
- [ ] It preserves original answers and creates revisions instead of overwriting.
- [ ] It avoids rendering many live video players in the table; use thumbnails/posters and lazy-load playback.
- [ ] `bun run check` passes.
