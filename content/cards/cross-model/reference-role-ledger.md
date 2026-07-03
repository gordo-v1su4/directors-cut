---
id: cross-model-reference-role-ledger
slug: cross-model-reference-role-ledger
title: "Cross-Model Reference Role Ledger"
summary: "A prompt-card pattern for declaring exactly what each image, video, or audio reference controls before writing the generation prompt."
model_family: cross-model
model_targets:
  - seedance-2.0
  - sora-2
  - kling
  - veo
prompt_mode: reference_ledger
output_shape: prompt_card
use_cases:
  - references
  - multimodal
  - identity-lock
  - style-lock
aspect_ratio: "variable"
runtime_seconds: null
evidence_type: cross_repo_synthesized
confidence: medium
source_count: 3
library_status: seed_pattern
tested_by_us: false
tags:
  - cross-model
  - references
  - multimodal
  - identity
  - style
created: 2026-07-03
updated: 2026-07-03
created_by: hermes
curator: omp-phase-0
source_urls:
  - https://github.com/rich5000/seedance-prompt-guide
  - https://github.com/songguoxs/seedance-prompt-skill
  - https://github.com/zhangchenchen/awesome_sora2_prompt
source_notes:
  - Reference-role table adapted from rich5000/seedance-prompt-guide.
  - Multi-modal @ image/video/audio system adapted from songguoxs/seedance-prompt-skill.
  - Sora subject/action/environment/camera/style completeness adapted from zhangchenchen/awesome_sora2_prompt.
---
# Cross-Model Reference Role Ledger

## When to use
Use this before any multimodal generation where several assets could conflict. The ledger prevents the model from guessing whether an image is identity, product, location, style, first frame, last frame, or texture.

## Prompt pattern
```text
Reference ledger:
- @image1 controls [IDENTITY / PRODUCT / LOCATION / STYLE / FIRST FRAME / LAST FRAME / TEXTURE]. Carry only: [SPECIFIC ATTRIBUTES]. Do not infer: [EXCLUDED ATTRIBUTES].
- @image2 controls [ROLE]. Carry only: [SPECIFIC ATTRIBUTES].
- @video1 controls [CAMERA / ACTION / PACING / VFX]. Carry only: [SPECIFIC ATTRIBUTES].
- @audio1 controls [MUSIC / RHYTHM / VOICE TONE / SOUND BED]. Carry only: [SPECIFIC ATTRIBUTES].

Generation prompt:
[MODEL-SPECIFIC PROMPT BODY HERE]
```

## Fill-in recipe
- Identity reference: carry build, wardrobe, hair, silhouette, stable features; avoid opening with face-only demands.
- Product reference: carry silhouette, label geometry, material, color, logo placement.
- Location reference: carry layout, lighting, palette, depth, atmosphere.
- Style reference: carry medium, color grade, texture, composition rules; do not copy subject matter unless intended.
- Video reference: carry camera path, action timing, transition, or VFX behavior, not every object in the clip.
- Audio reference: carry beat grid, tone, rhythm, or sound texture.

## Example
```text
Reference ledger:
- @image1 controls product identity. Carry only: bottle silhouette, label geometry, amber glass, black cap. Do not infer: the table or background.
- @image2 controls location. Carry only: rain-lit convenience store aisle, fluorescent reflections, narrow depth.
- @video1 controls camera and pacing. Carry only: slow push-in, one whip-pan transition, final locked hero shot.
- @audio1 controls rhythm. Carry only: low synth pulse and final bass hit.

Generation prompt:
10-second vertical product teaser in a rain-lit convenience store aisle. The bottle from @image1 sits on the shelf in the location from @image2. Camera follows @video1 pacing: slow push-in, one whip-pan to a hand reaching for the bottle, final locked hero shot. The low synth pulse from @audio1 drives the push-in and the final bass hit lands as condensation rolls down the glass. Premium commercial lighting, readable label, no subtitles, no watermark.
```

## Why this works
Reference inputs are powerful but ambiguous. This ledger makes each asset carry one explicit job, which improves cross-model reproducibility and reduces accidental style/identity/location bleed.

## Source evidence
- [rich5000/seedance-prompt-guide](https://github.com/rich5000/seedance-prompt-guide) — explicit roles for `@image`, `@video`, and `@audio` references.
- [songguoxs/seedance-prompt-skill](https://github.com/songguoxs/seedance-prompt-skill) — multi-modal reference system supporting images, videos, audio, and consistency control.
- [zhangchenchen/awesome_sora2_prompt](https://github.com/zhangchenchen/awesome_sora2_prompt) — prompt completeness across subject, action, environment, camera, style, and audio.
