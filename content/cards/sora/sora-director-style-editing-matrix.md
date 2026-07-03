---
id: sora-director-style-editing-matrix
slug: sora-director-style-editing-matrix
title: "Sora Director Style Editing Matrix"
summary: "A Sora prompt card for combining a visual style prompt with an editing style prompt without naming copyrighted scene content."
model_family: sora
model_targets:
  - sora
  - sora-2
prompt_mode: style_matrix
output_shape: prompt_card
use_cases:
  - style-transfer
  - editing-style
  - director-study
  - mood-board
aspect_ratio: "16:9"
runtime_seconds: 12
evidence_type: guide_synthesized
confidence: medium
source_count: 2
library_status: seed_pattern
tested_by_us: false
tags:
  - sora
  - style
  - editing
  - camera
  - aesthetic
created: 2026-07-03
updated: 2026-07-03
created_by: hermes
curator: omp-phase-0
source_urls:
  - https://github.com/xjpp22/awesome--sora-prompts
  - https://github.com/zhangchenchen/awesome_sora2_prompt
source_notes:
  - Visual/editing style split adapted from xjpp22 director prompt catalog.
  - Five Pillars completeness adapted from zhangchenchen/awesome_sora2_prompt.
---
# Sora Director Style Editing Matrix

## When to use
Use this when you want the feel of a cinema reference without copying named characters or specific scenes. It separates what the image looks like from how the edit moves.

## Prompt pattern
```text
A 12-second original scene about [SUBJECT/ACTION] in [ENVIRONMENT]. Visual style: [COMPOSITION], [COLOR PALETTE], [LIGHTING], [TEXTURE/LENS]. Editing style: [PACE], [TRANSITION LOGIC], [SHOT DURATION FEEL], [SOUND DESIGN RHYTHM]. The scene begins with [OPENING IMAGE], develops through [ONE CLEAR TURN], and ends on [FINAL IMAGE]. Camera language includes [SHOT SCALE 1], [MOVEMENT], and [SHOT SCALE 2], with physical continuity preserved across cuts. Audio includes [AMBIENT BED] and [MUSIC OR EFFECT] that supports the edit rhythm.
```

## Fill-in recipe
- `[COMPOSITION]`: symmetrical, claustrophobic, negative space, layered foreground, centered tableau.
- `[COLOR PALETTE]`: pastel hotel tones, sodium amber vs steel blue, desaturated winter, crimson/black contrast.
- `[PACE]`: precise long takes, fast jump-cut montage, dreamy dissolves, steady observational pacing.
- `[TRANSITION LOGIC]`: match cuts on shape, hard cuts on sound hits, slow dissolves between time states.

## Example
```text
A 12-second original scene about a night-shift botanist discovering a glowing seed in an underground greenhouse. Visual style: centered symmetrical compositions, deep emerald and amber palette, soft practical lamps, subtle film grain and shallow depth of field. Editing style: precise long takes interrupted by two hard sound-hit cuts, each shot held long enough for the environment to feel still. The scene begins with the botanist watering dark plants, develops through the seed pulsing beneath the soil, and ends on her gloved hand hovering over the glow. Camera language includes a wide locked tableau, a slow dolly push, and a macro close-up, with physical continuity preserved across cuts. Audio includes low ventilation hum and a glassy pulse that supports the edit rhythm.
```

## Why this works
Sora style prompts become more controllable when visual vocabulary and edit vocabulary are not mashed together. The matrix makes the model simulate a scene, then filters the scene through composition, color, camera, and rhythm.

## Source evidence
- [xjpp22/awesome--sora-prompts](https://github.com/xjpp22/awesome--sora-prompts) — separates visual style prompts and editing style prompts across director-inspired examples.
- [zhangchenchen/awesome_sora2_prompt](https://github.com/zhangchenchen/awesome_sora2_prompt) — Five Pillars: subject/action, environment, cinematic framing, aesthetic/style, and Sora 2 audio.
