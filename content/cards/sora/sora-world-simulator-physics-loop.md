---
id: sora-world-simulator-physics-loop
slug: sora-world-simulator-physics-loop
title: "Sora World-Simulator Physics Loop"
summary: "A Sora card for physically coherent micro-worlds where material properties drive the motion instead of a disconnected visual list."
model_family: sora
model_targets:
  - sora
  - sora-2
prompt_mode: world_simulator
output_shape: prompt_card
use_cases:
  - physics
  - micro-world
  - loop
  - realism
aspect_ratio: "16:9"
runtime_seconds: 8
evidence_type: guide_synthesized
confidence: high
source_count: 2
library_status: seed_pattern
tested_by_us: false
tags:
  - sora
  - world-simulator
  - physics
  - materials
  - loop
created: 2026-07-03
updated: 2026-07-03
created_by: hermes
curator: omp-phase-0
source_urls:
  - https://github.com/zhangchenchen/awesome_sora2_prompt
  - https://github.com/xjpp22/awesome--sora-prompts
source_notes:
  - World simulator and Five Pillars structure adapted from zhangchenchen/awesome_sora2_prompt guides.
  - Camera/detail strategy adapted from xjpp22/awesome--sora-prompts.
---
# Sora World-Simulator Physics Loop

## When to use
Use this when the idea is simple but needs believable motion: steam, liquid, cloth, dust, snow, floating particles, reflections, food, small animals, or tabletop product worlds.

## Prompt pattern
```text
An 8-second physically coherent scene in [LOCATION]. [SUBJECT] begins in [INITIAL STATE]. Because [MATERIAL/ENVIRONMENTAL CAUSE], [VISIBLE MOTION] happens continuously: [DETAIL 1], [DETAIL 2], and [DETAIL 3]. The camera [CAMERA MOVE] from [SHOT SCALE] to [SHOT SCALE], keeping [FOCUS TARGET] sharp while [BACKGROUND BEHAVIOR] responds naturally. [LIGHTING/TIME] defines the color and shadows. The last second returns to a near-match of the first frame for a seamless loop. [STYLE]. Natural ambient audio: [SOUND BED] and [SPECIFIC SOUND EFFECT].
```

## Fill-in recipe
- `[MATERIAL/ENVIRONMENTAL CAUSE]`: heat, wind, gravity, water pressure, magnetism, vibration, melting, condensation.
- `[VISIBLE MOTION]`: steam curls, fabric lifts, powder falls, syrup stretches, frost creeps, ripples expand.
- `[CAMERA MOVE]`: slow push, lateral track, top-down descend, macro rack focus.
- `[STYLE]`: photorealistic 35mm macro, clean commercial tabletop, handheld documentary, soft stop-motion.

## Example
```text
An 8-second physically coherent scene in a sunlit kitchen. A cracked ceramic mug begins on a wooden table filled with black coffee. Because the coffee is hot and the morning air is cool, steam rises continuously: thin white curls twist through a shaft of sunlight, tiny droplets gather on the mug rim, and faint ripples spread each time the table vibrates. The camera slowly pushes from a medium tabletop shot to a macro close-up, keeping the rim sharp while the window and plants blur naturally. Warm morning light defines the color and shadows. The last second returns to a near-match of the first frame for a seamless loop. Photorealistic 35mm macro style. Natural ambient audio: quiet room tone and a soft ceramic tick.
```

## Why this works
Sora is strongest when the prompt defines a small world with internal causes. This pattern gives the model initial conditions, material behavior, camera movement, and loop logic rather than isolated keywords.

## Source evidence
- [zhangchenchen/awesome_sora2_prompt](https://github.com/zhangchenchen/awesome_sora2_prompt) — Sora as a world simulator, Five Pillars, physics/material interactions, Sora 2 audio keywords.
- [xjpp22/awesome--sora-prompts](https://github.com/xjpp22/awesome--sora-prompts) — motion + sensory detail + camera movement + significant details as core text-to-video strategies.
