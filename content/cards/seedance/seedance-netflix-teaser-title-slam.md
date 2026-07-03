---
id: seedance-netflix-teaser-title-slam
slug: seedance-netflix-teaser-title-slam
title: Netflix Teaser Title Slam — Seedance
summary: High-impact title-card teaser built for Seedance 2.0 — rhythmic text reveal, graphic slash, and a final emblem lockup.
repo_scope: directors-cut
card_type: prompt_card
created: 2026-07-02
updated: 2026-07-02
created_by: kimi
curator: Gordo
model_family: seedance
model_targets:
  - Seedance 2.0
prompt_mode: seedance_director
output_shape: prose
use_cases:
  - netflix_teaser
  - trailer
  - title_card
aspect_ratio: 2.39:1
runtime_seconds: 12
evidence_type: community_corroborated
confidence: medium
source_count: 3
source_urls:
  - https://github.com/songguoxs/seedance-prompt-skill
  - https://github.com/HuyLe82US/awesome-seedance-prompts
  - https://github.com/rich5000/seedance-prompt-guide
source_notes:
  - Title-slam structure appears across multiple Seedance prompt repos with "rhythmic text reveal" and "graphic slash" keywords.
  - HuyLe82US templates call out explicit duration (10-15s) and wide aspect ratio for cinematic trailers.
  - rich5000/seedance-prompt-guide recommends front-loading typography motion and ending on a logo lockup.
library_status: adapted_template
tested_by_us: false
test_runs:
  - run_id: hf-2026-07-02-001
    model: Seedance 2.0
    status: queued
    output_url:
    notes: Needs first internal render.
human_rating:
  gordo_score: null
  aesthetic_fit: unrated
  production_readiness: draft
  notes: ""
tags:
  - seedance
  - netflix_teaser
  - trailer
  - title_card
  - typography
  - rhythmic
---

# Netflix Teaser Title Slam — Seedance

## At a glance
Use this card when you need a fast, Netflix-style teaser opener: title words slam into frame against a dark environment, a graphic slash or light flare cuts through, and the title resolves into a final emblem or lockup. Designed for Seedance 2.0's motion and typography strengths.

## Reusable template

```
Title-slam teaser for [PROJECT TITLE].

Shot structure: 1 shot / 12 seconds / 2.39:1.

Camera: slow push-in on a [TEXTURE / ENVIRONMENT], tilting slightly to reveal [KEY SUBJECT]. At second [N], the frame flashes with a [LIGHT / SLASH COLOR] slash and the words [WORD 1] [WORD 2] slam into frame with [TYPOGRAPHY MOTION — e.g., scale pop, horizontal slice, kinetic blur]. The letters [DETAIL — e.g., disintegrate into particles, weld from sparks, fold from cloth]. At second [N], the camera pulls back to a [FINAL FRAME] and the title resolves into [EMBLEM / LOCKUP] centered on screen.

Environment: [describe dark, dense, cinematic setting; include material palette and key light source].

Action: [subject movement, if any, plus the typography reveal sequence].

Style: [cinematic look — e.g., anamorphic lens flare, film grain, desaturated palette, high contrast].

Mood: [mood keywords].

Total: 12s / 1 shot / 2.39:1.
```

## Variables

- `PROJECT_TITLE`: The title or brand name at the end.
- `TEXTURE / ENVIRONMENT`: e.g., wet asphalt, obsidian glass, worn leather, rusted metal.
- `KEY SUBJECT`: e.g., a silhouetted figure, a glowing artifact, a cracked emblem.
- `LIGHT / SLASH COLOR`: e.g., cold white, sodium amber, crimson, cyan.
- `TYPOGRAPHY MOTION`: e.g., scale pop from 0%, horizontal slice reveal, kinetic motion blur, hard slam with impact frames.
- `DETAIL`: How the letters behave when they appear.
- `FINAL FRAME`: Wide shot composition that holds the lockup.
- `EMBLEM / LOCKUP`: The final title treatment.
- `MOOD`: e.g., ominous, epic, romantic, suspenseful.

## Example prompt

```
Title-slam teaser for ASHES OF EMPIRE.

Shot structure: 1 shot / 12 seconds / 2.39:1.

Camera: slow push-in over a rain-soaked obsidian floor, tilting up to reveal a cracked crown half-submerged in a gutter. At second 3, the frame flashes with a cold white slash and the words ASHES OF EMPIRE slam into frame with a horizontal slice reveal, each letter welding from molten sparks. At second 9, the camera pulls back to a wide tableau of a burning throne room silhouette and the title resolves into a metallic emblem centered on screen.

Environment: A rain-soaked obsidian courtyard at night, distant firelight reflecting in puddles, steam rising from the ground, a single cold overhead source backlighting the crown.

Action: Water drips from the crown; the slash flares across the frame; letters slice in and weld from sparks; the camera pulls back to reveal the throne room.

Style: Anamorphic lens flare, heavy film grain, desaturated teal and ember palette, high contrast, shallow depth of field on the title.

Mood: Ominous, epic, post-imperial decay.

Total: 12s / 1 shot / 2.39:1.
```

## Model-specific notes

### Seedance
- Keep the title text literal and capitalized so Seedance reads it as on-screen typography rather than a scene description.
- Use "slam into frame," "weld from sparks," or "slice reveal" to trigger kinetic motion in the typography.
- End with a centered emblem/lockup and a wide camera pullback for strong composition.
- Avoid negative prompts; instead describe what should be in frame.

### Sora
- Sora often interprets text more fluidly. For a Sora adaptation, replace the literal title with a vivid scene description of the same visual beat (e.g., "title-shaped sparks coalesce into a metallic emblem") because Sora may not render readable text as reliably.

## Why this pattern may work
The title-slam is a proven trailer opener: it front-loads motion, gives the viewer a readable title, and ends on a wide establishing composition. The Seedance prompt repos repeatedly pair "rhythmic text reveal" with "graphic slash" and "logo lockup" as a high-impact combination for 10-15 second clips.

## Source evidence

- [songguoxs/seedance-prompt-skill](https://github.com/songguoxs/seedance-prompt-skill) — title/typography motion templates and kinetic reveal patterns.
- [HuyLe82US/awesome-seedance-prompts](https://github.com/HuyLe82US/awesome-seedance-prompts) — 10-15s cinematic trailer templates with wide aspect ratio and explicit duration.
- [rich5000/seedance-prompt-guide](https://github.com/rich5000/seedance-prompt-guide) — prompt engineering guide emphasizing typography-forward opens and logo lockups.

## Test history

- *2026-07-02 — Queued for first Seedance 2.0 render.*

## Gordo notes

- *Awaiting human taste check.*
