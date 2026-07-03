---
id: cross-model-modular-json-shot-spec
slug: cross-model-modular-json-shot-spec
title: "Cross-Model Modular JSON Shot Spec"
summary: "A structured JSON prompt-card format that can be converted to prose for Sora/Seedance or kept as blocks for models that accept rich structured input."
model_family: cross-model
model_targets:
  - seedance-2.0
  - sora-2
  - veo
  - kling
prompt_mode: structured_json
output_shape: prompt_card
use_cases:
  - json
  - shot-spec
  - multi-model
  - prompt-portability
aspect_ratio: "16:9"
runtime_seconds: 10
evidence_type: cross_repo_synthesized
confidence: medium
source_count: 3
library_status: seed_pattern
tested_by_us: false
tags:
  - cross-model
  - json
  - schema-adjacent
  - shot-spec
  - portable
created: 2026-07-03
updated: 2026-07-03
created_by: hermes
curator: omp-phase-0
source_urls:
  - https://github.com/songguoxs/awesome-video-prompts
  - https://github.com/rich5000/seedance-prompt-guide
  - https://github.com/zhangchenchen/awesome_sora2_prompt
source_notes:
  - JSON block organization adapted from songguoxs/awesome-video-prompts examples.
  - Seedance role/action/camera/audio formula adapted from rich5000/seedance-prompt-guide.
  - Sora Five Pillars coverage adapted from zhangchenchen/awesome_sora2_prompt.
---
# Cross-Model Modular JSON Shot Spec

## When to use
Use this when a prompt needs to survive multiple engines. Keep it as JSON for tooling, or flatten it into prose for Seedance/Sora. This is deliberately schema-adjacent but not placed under `schemas/`.

## Prompt pattern
```json
{
  "duration_seconds": 10,
  "aspect_ratio": "16:9",
  "intent": "one-sentence creative goal",
  "references": [
    { "id": "@image1", "role": "identity/product/location/style lock" }
  ],
  "shot": {
    "composition": "shot size and framing",
    "lens": "focal length or lens feel",
    "camera_movement": "one camera behavior",
    "frame_rate": "normal, slow motion, or ramp note"
  },
  "subject": {
    "description": "who or what is on screen",
    "action": "one clear visible action",
    "wardrobe_or_material": "stable visual/material attributes"
  },
  "scene": {
    "location": "where",
    "time_of_day": "when",
    "environment": "weather, atmosphere, surrounding objects"
  },
  "visual_details": {
    "effects": "visible VFX or physical event",
    "motion_physics": "how cloth, water, dust, light, or objects react"
  },
  "cinematography": {
    "lighting": "lighting source and quality",
    "color_palette": "primary color contrast",
    "tone": "genre mood"
  },
  "audio": {
    "ambient": "base sound bed",
    "sound_effects": "specific on-screen sounds",
    "music": "optional music cue",
    "dialogue": "optional spoken line"
  }
}
```

## Engine conversion notes
- Seedance: convert `references`, `subject.action`, `shot.camera_movement`, and `audio` into a single timeline with timestamps if the scene has more than one beat.
- Sora: convert `subject`, `scene`, `visual_details.motion_physics`, `cinematography`, and `audio` into a world-simulator paragraph with clear physical causes.
- Kling/Veo-style tools: keep the first frame/reference roles explicit and avoid overstuffed multi-action shots.

## Example use
Use this as the intermediate card after research, before writing model-specific prompt variants. It keeps source references, camera, subject, physics, and audio separable for comparison tables.

## Why this works
Prompt repos increasingly mix JSON blocks, prose, and timestamped storyboards. A modular spec lets a director card stay portable without forcing every engine to accept the same syntax.

## Source evidence
- [songguoxs/awesome-video-prompts](https://github.com/songguoxs/awesome-video-prompts) — multiple examples use JSON sections for shot, subject, scene, visual details, cinematography, audio, and dialogue.
- [rich5000/seedance-prompt-guide](https://github.com/rich5000/seedance-prompt-guide) — core Seedance formula: material role + plot/action + camera language + mood/audio.
- [zhangchenchen/awesome_sora2_prompt](https://github.com/zhangchenchen/awesome_sora2_prompt) — Five Pillars coverage needed for Sora prompt completeness.
