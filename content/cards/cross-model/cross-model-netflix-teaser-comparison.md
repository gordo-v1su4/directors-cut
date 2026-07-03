---
id: cross-model-netflix-teaser-comparison
slug: cross-model-netflix-teaser-comparison
title: Netflix Teaser — Seedance vs Sora Comparison
summary: Side-by-side comparison question that asks the same creative brief of both Seedance and Sora, producing one adapted prompt per model.
repo_scope: directors-cut
card_type: comparison_result
created: 2026-07-02
updated: 2026-07-02
created_by: kimi
curator: Gordo
model_family: general_video
model_targets:
  - Seedance 2.0
  - Sora
prompt_mode: comparison_question
output_shape: prose
use_cases:
  - netflix_teaser
  - model_comparison
  - trailer
aspect_ratio: 2.39:1
runtime_seconds: 12
evidence_type: generic_pattern
confidence: medium
source_count: 2
source_urls:
  - https://github.com/songguoxs/seedance-prompt-skill
  - https://github.com/zhangchenchen/awesome_sora2_prompt
source_notes:
  - "Comparison question is repo-native to Directors Cut. Pattern adapts the single-model templates from the source repos into a cross-model evaluation prompt."
  - "Seedance and Sora prompts differ structurally: Seedance prefers title-slam prose with explicit shot structure; Sora prefers continuous scene description with embedded title reveal."
library_status: adapted_template
tested_by_us: false
test_runs:
  - run_id: dc-compare-2026-07-02-001
    model: Seedance 2.0
    status: queued
    output_url:
    notes: Needs first comparison render.
  - run_id: dc-compare-2026-07-02-001
    model: Sora
    status: queued
    output_url:
    notes: Needs first comparison render.
human_rating:
  gordo_score: null
  aesthetic_fit: unrated
  production_readiness: draft
  notes: ""
tags:
  - cross-model
  - netflix_teaser
  - comparison
  - seedance
  - sora
---

# Netflix Teaser — Seedance vs Sora Comparison

## At a glance
This card is a comparison question, not a single prompt. It is designed to be fed to the Directors Cut multi-agent comparison flow so that both Seedance and Sora produce a Netflix-style teaser for the same concept, and the results can be graded side-by-side.

## Comparison question

> Create a 12-second Netflix-style teaser trailer for an original series called `[PROJECT TITLE]`. The story is `[ONE-Sentence LOGLINE]`. The tone is `[MOOD]`. Give me two outputs:
> 1. A **Seedance 2.0** prompt optimized for title-slam typography, explicit shot structure, and a centered emblem lockup.
> 2. A **Sora** prompt optimized for continuous cinematic movement, environmental storytelling, and a title that materializes naturally from the world.
> Both should be 2.39:1, 12 seconds, and share the same core visual concept.

## Variables

- `PROJECT_TITLE`: e.g., ASHES OF EMPIRE.
- `LOGLINE`: e.g., "After the fall of an imperial dynasty, a disgraced crown guard hunts the embers of a throne across a drowned city."
- `MOOD`: e.g., ominous, epic, elegiac, post-imperial decay.
- `CORE VISUAL CONCEPT`: e.g., a cracked crown in a rain-soaked obsidian courtyard with a burning throne room in the distance.

## Expected answer shapes

### Seedance answer
- English prose, 1-shot, explicit `Total: 12s / 1 shot / 2.39:1` close.
- Title-slam structure: slow push-in, slash/light flare, title slams into frame, pullback to emblem lockup.
- No negative prompts; camera/action/environment/style ordering.

### Sora answer
- Continuous prose description, no hard shot list.
- Camera drifts through the environment, reveals story details, ends on wide tableau.
- Title materializes from smoke/fire/water/light rather than as overlaid text.

## Grading rubric for this comparison

| Metric | Seedance target | Sora target |
|--------|-----------------|-------------|
| `model_fit` | Uses title-slam mechanics, explicit shot structure, typographic lockup. | Uses continuous scene description, natural title reveal, coherent physics. |
| `visual_specificity` | Concrete camera, lighting, subject, typography motion. | Concrete camera movement, environment, lighting, final image. |
| `temporal_control` | 12s, 1 shot, clear beats. | 12s continuous movement with clear emotional arc. |
| `copy_paste_readiness` | Ready to paste into Seedance with minimal edits. | Ready to paste into Sora with minimal edits. |
| `novelty` | Avoids generic trailer tropes; uses specific world details. | Avoids generic trailer tropes; uses specific world details. |
| `gordo_aesthetic_guess` | Dark, dense, cinematic, high contrast. | Dark, dense, cinematic, high contrast. |
| `evidence_alignment` | Follows Seedance title-slam patterns from source repos. | Follows Sora continuity patterns from source repos. |

## Why this comparison is useful
Seedance and Sora have different strengths: Seedance is good at kinetic typography and title-slam mechanics; Sora is good at continuous cinematic movement and environmental storytelling. Running the same brief through both reveals which model better serves the specific creative beat, and the winning answer can be promoted to a promoted prompt card.

## Source evidence

- [songguoxs/seedance-prompt-skill](https://github.com/songguoxs/seedance-prompt-skill) — Seedance title-slam / typography motion patterns.
- [zhangchenchen/awesome_sora2_prompt](https://github.com/zhangchenchen/awesome_sora2_prompt) — Sora cinematic continuity and environmental storytelling patterns.

## Test history

- *2026-07-02 — Comparison run queued.*

## Gordo notes

- *Awaiting human taste check.*
