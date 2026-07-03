---
id: seedance-netflix-teaser-title-slam
slug: seedance-netflix-teaser-title-slam
title: "Seedance Netflix Teaser Title Slam"
summary: "A 10-12s trailer-card pattern that builds dread through two image beats, one impact action, and a final streaming-title slam."
model_family: seedance
model_targets:
  - seedance-2.0
prompt_mode: timecoded_montage
output_shape: prompt_card
use_cases:
  - teaser
  - title-card
  - trailer
  - streaming-promo
aspect_ratio: "16:9"
runtime_seconds: 12
evidence_type: community_corroborated
confidence: medium
source_count: 3
library_status: seed_pattern
tested_by_us: false
tags:
  - seedance
  - teaser
  - title-slam
  - trailer
  - audio-hit
created: 2026-07-03
updated: 2026-07-03
created_by: hermes
curator: omp-phase-0
source_urls:
  - https://github.com/songguoxs/seedance-prompt-skill
  - https://github.com/HuyLe82US/awesome-seedance-prompts
  - https://github.com/rich5000/seedance-prompt-guide
source_notes:
  - Seedance timestamp storyboarding and audio cue controls adapted from songguoxs/seedance-prompt-skill.
  - Beat-synced segment structure adapted from HuyLe82US MV and action examples.
  - Material/reference-role discipline adapted from rich5000/seedance-prompt-guide.
---
# Seedance Netflix Teaser Title Slam

## When to use
Use this when you need a short proof-of-concept teaser for a series, film, or fake streaming property: one ominous location beat, one human reaction beat, one symbolic impact, then a hard title card. It is designed for Seedance because Seedance responds well to explicit timestamps, sound events, and simple cause-effect action.

## Prompt pattern
```text
12-second premium streaming teaser, 16:9, cinematic thriller grade. 0-3s: wide locked-off establishing shot of [LOCATION] at [TIME], [ONE ATMOSPHERIC MOTION] moving through frame, distant low-frequency rumble. 3-6s: slow push-in to [SUBJECT] in [WARDROBE/POSE], [ONE MICRO-EXPRESSION], background detail [ONE CLUE] becomes visible. 6-9s: the clue triggers [ONE IMPACT ACTION], light drops or flares on the hit, camera jolts once but stays readable, sound design snaps from silence into a heavy bass impact. 9-12s: smash cut to black title card, [TITLE] appears as large centered text with subtle film grain, one final echoing sound hit, no extra logos, no subtitles, no watermark.
```

## Fill-in recipe
- `[LOCATION]`: one production-ready setting, not a list; e.g. flooded motel corridor, empty suburban pool, mountain road at blue hour.
- `[ONE ATMOSPHERIC MOTION]`: rain crossing headlights, dust under a door, ash drifting upward.
- `[SUBJECT]`: one actor or object only; keep identity stable if using `@image`.
- `[ONE CLUE]`: a prop or environmental anomaly visible before the impact.
- `[ONE IMPACT ACTION]`: door slams, lights cut, VHS tape ejects, title object drops into frame.
- `[TITLE]`: short title, 1-4 words, preferably all caps.

## Example
```text
12-second premium streaming teaser, 16:9, cinematic thriller grade. 0-3s: wide locked-off establishing shot of an empty roadside motel at blue hour, rain crossing the orange vacancy sign, distant low-frequency rumble. 3-6s: slow push-in to a woman in a soaked wool coat standing outside room 12, her jaw tightens as a red glow leaks from beneath the door. 6-9s: the motel sign cuts out and the room door slams open from inside, camera jolts once but stays readable, sound design snaps from silence into a heavy bass impact. 9-12s: smash cut to black title card, NO VACANCY appears as large centered text with subtle film grain, one final echoing sound hit, no extra logos, no subtitles, no watermark.
```

## Why this works
Seedance tends to follow short timestamped storyboards when each segment has one visual job. This card front-loads duration, format, style, and audio, then reserves the last quarter for a title slam rather than asking the model to invent a full trailer arc.

## Source evidence
- [songguoxs/seedance-prompt-skill](https://github.com/songguoxs/seedance-prompt-skill) — timestamp storyboarding, audio/sound control, 4-15s Seedance constraints.
- [HuyLe82US/awesome-seedance-prompts](https://github.com/HuyLe82US/awesome-seedance-prompts) — community examples using 10s MV beat sync and 15s thriller escalation.
- [rich5000/seedance-prompt-guide](https://github.com/rich5000/seedance-prompt-guide) — prompt formula: material role + action/plot + camera language + atmosphere/audio.
