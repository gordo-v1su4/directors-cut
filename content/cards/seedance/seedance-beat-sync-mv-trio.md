---
id: seedance-beat-sync-mv-trio
slug: seedance-beat-sync-mv-trio
title: "Seedance Beat-Sync MV Trio"
summary: "A reusable Seedance music-video structure with 5 micro-beats, contrast cuts, and explicit audio sync."
model_family: seedance
model_targets:
  - seedance-2.0
prompt_mode: timecoded_music_video
output_shape: prompt_card
use_cases:
  - music-video
  - beat-sync
  - short-form
  - style-variants
aspect_ratio: "9:16"
runtime_seconds: 10
evidence_type: community_corroborated
confidence: medium
source_count: 2
library_status: seed_pattern
tested_by_us: false
tags:
  - seedance
  - music-video
  - beat-sync
  - vertical
  - short-form
created: 2026-07-03
updated: 2026-07-03
created_by: hermes
curator: omp-phase-0
source_urls:
  - https://github.com/songguoxs/seedance-prompt-skill
  - https://github.com/HuyLe82US/awesome-seedance-prompts
source_notes:
  - Music beat sync capability adapted from songguoxs/seedance-prompt-skill.
  - Segment durations and high-rewatch MV rhythm adapted from HuyLe82US 10s MV trio example.
---
# Seedance Beat-Sync MV Trio

## When to use
Use this to make a short vertical music-video prompt that can be restyled quickly: K-pop stage, guofeng performance, future-bass street, luxury fashion, or product dance loop.

## Prompt pattern
```text
10-second [STYLE] music video, 9:16, beat-synced cuts, one cohesive color grade. 0-1s: [FORMATION/LOCATION] holds still for one breath as the first beat lands, lights pulse once. 1-3s: medium close-up of [LEAD SUBJECT] performing [ONE GESTURE], camera pushes in on the beat. 3-5s: wide shot of [GROUP OR ENVIRONMENT ACTION], movement hits every kick drum, clothing and props react naturally. 5-7s: insert close-up of [HANDS/PROP/FEET] creating a crisp rhythmic detail, sound effect layered with the track. 7-10s: camera pulls up or back to reveal the full scene, final pose freezes for half a second on the last beat, audio ends with [FINAL SOUND]. No subtitles, no watermark, no extra text.
```

## Fill-in recipe
- `[STYLE]`: future-bass rain street, guofeng flute stage, glossy K-pop studio, retro VHS fitness ad.
- `[FORMATION/LOCATION]`: triangular group formation, lone performer in bamboo forest, product lineup on plinths.
- `[ONE GESTURE]`: hair toss, sleeve sweep, head turn, sneaker stomp, ringed hand snap.
- `[FINAL SOUND]`: bass aftershock, guqin harmonic, crowd clap, synth stab.

## Example
```text
10-second future-bass rain street music video, 9:16, beat-synced cuts, one cohesive cyan-magenta night grade. 0-1s: empty neon crosswalk holds still for one breath as the first beat lands, lights pulse once. 1-3s: medium close-up of a dancer in a transparent rain jacket performing a sharp head turn, camera pushes in on the beat. 3-5s: wide shot of three dancers stepping through shallow puddles, movement hits every kick drum, clothing and water react naturally. 5-7s: insert close-up of sneakers striking the wet street, sound effect layered with the track. 7-10s: camera pulls up to reveal the full crosswalk and rain-lit skyline, final pose freezes for half a second on the last beat, audio ends with a bass aftershock. No subtitles, no watermark, no extra text.
```

## Why this works
Seedance can follow beat-sync instructions if the prompt ties each visual transition to a simple musical event. The five micro-beats keep cuts fast without overloading character continuity.

## Source evidence
- [songguoxs/seedance-prompt-skill](https://github.com/songguoxs/seedance-prompt-skill) — explicit music beat sync capability and audio-reference support.
- [HuyLe82US/awesome-seedance-prompts](https://github.com/HuyLe82US/awesome-seedance-prompts) — 10s MV trio with 0-1s, 2-4s, 5-7s, 8-10s beat-linked segments.
