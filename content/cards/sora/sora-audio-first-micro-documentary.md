---
id: sora-audio-first-micro-documentary
slug: sora-audio-first-micro-documentary
title: "Sora Audio-First Micro Documentary"
summary: "A Sora 2 card that starts from ambient sound and dialogue/narration, then builds the physical scene around those audio cues."
model_family: sora
model_targets:
  - sora-2
prompt_mode: audio_first_documentary
output_shape: prompt_card
use_cases:
  - audio
  - documentary
  - ambient
  - narration
aspect_ratio: "16:9"
runtime_seconds: 15
evidence_type: guide_synthesized
confidence: medium
source_count: 2
library_status: seed_pattern
tested_by_us: false
tags:
  - sora
  - audio
  - documentary
  - ambient
  - voiceover
created: 2026-07-03
updated: 2026-07-03
created_by: hermes
curator: omp-phase-0
source_urls:
  - https://github.com/zhangchenchen/awesome_sora2_prompt
  - https://github.com/songguoxs/awesome-video-prompts
source_notes:
  - Sora 2 synchronized audio and audio keyword guidance adapted from zhangchenchen/awesome_sora2_prompt.
  - JSON/audio block examples and ambient/sfx mix details adapted from songguoxs/awesome-video-prompts.
---
# Sora Audio-First Micro Documentary

## When to use
Use this for a miniature documentary, explainer, or observational scene where sound sells realism: workshops, kitchens, labs, wildlife, sports, weather, machines, or public spaces.

## Prompt pattern
```text
A 15-second documentary-style scene in [PLACE] centered on [SUBJECT]. Audio leads the scene: [AMBIENT BED] is present from the first frame, with [SPECIFIC SOUND 1] and [SPECIFIC SOUND 2] timed to visible actions. The camera starts as [SHOT 1] showing [CONTEXT], then moves to [SHOT 2] as [ACTION] changes the environment, then ends on [SHOT 3] revealing [RESULT]. The world behaves physically: [MATERIAL/OBJECT] responds to [FORCE/CAUSE]. Natural documentary lighting, [COLOR/MOOD], realistic handheld or stabilized camera. Optional narration: [ONE SHORT LINE], spoken calmly without subtitles.
```

## Fill-in recipe
- `[AMBIENT BED]`: ventilation hum, rain on tin roof, insects, city traffic, surf, crowd murmur.
- `[SPECIFIC SOUND]`: knife on board, boot in snow, glass clink, relay click, wings beating, fabric snap.
- `[MATERIAL/OBJECT] responds`: sawdust falls from the blade, fog curls through flashlight beams, wet clay deforms under fingers.

## Example
```text
A 15-second documentary-style scene in a small violin repair workshop centered on a luthier adjusting an old instrument. Audio leads the scene: quiet room tone and distant street rain are present from the first frame, with a tiny peg creak and a single bowed string timed to visible actions. The camera starts as a medium shot showing the cluttered bench, then moves to a close handheld shot as the luthier turns the tuning peg and the string tension changes, then ends on a macro shot revealing rosin dust lifting from the bow hair. The world behaves physically: the wooden body resonates softly when the string vibrates. Natural documentary lighting, warm amber wood tones, realistic stabilized camera. Optional narration: “Every repair starts by listening,” spoken calmly without subtitles.
```

## Why this works
Sora 2 can generate synchronized audio, but the prompt should make sound causal and visible. This card names the ambient layer first, then ties each specific sound to an on-screen material event.

## Source evidence
- [zhangchenchen/awesome_sora2_prompt](https://github.com/zhangchenchen/awesome_sora2_prompt) — Sora 2 synchronized audio, dialogue, sound effects, and Five Pillars prompt structure.
- [songguoxs/awesome-video-prompts](https://github.com/songguoxs/awesome-video-prompts) — examples with JSON-style audio blocks including music, ambient, sound effects, and mix level.
