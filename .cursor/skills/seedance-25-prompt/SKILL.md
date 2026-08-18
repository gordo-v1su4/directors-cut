---
name: seedance-25-prompt
description: Writes and rewrites Seedance 2.5 video prompts using ByteDance/BytePlus 2.5 rules — @Image/@Video/@Audio roles, unlocked vs locked workflows, integer-second story maps, continuity locks, one camera move per shot, and typed audio syntax. Use when creating, repairing, or reviewing Seedance 2.5 prompts for trailers, auditions, continuity, storyboards, keyframes, first/last frame, edit, or extend jobs.
---

# Seedance 2.5 Prompt Guide

Use this skill for every Seedance 2.5 generation. Older Seedance 2.0 Camera/Light/Style/Acting/Dynamic Description dumps are deprecated. Do not load Seedance 2.0 prompt skills unless the user explicitly asks for 2.0. Project-specific cast, location, and exclusion rules live in the production repo (for example `super-seed2`), not here.

## Limits

One generation:

- 30s max video
- up to 50 total references
- up to 30 images (up to 4K)
- up to 10 videos or 10 audio clips (30s combined for each)
- ratio 0.4–2.5
- 10+ languages

## 1. Core formula

`Subject + Action/Event + Scene & Environment + Visual Style + Camera Movement/Cut + Audio`

Write these four brief blocks first, then the copy-ready prompt:

1. Asset roles
2. One-sentence summary
3. Timeline or shot plan
4. Consistency + exclusions

## 2. Assign reference authority

Tag assets with `@` and give each one job. Number by upload order.

- `@Image 1` defines identity, prop, location, or style
- `@Video 1` defines *only* motion, camera, timing, or cuts
- `@Audio 1` defines *only* voice, dialogue, music, ambience, or effects

Rules:

- One asset = one job
- Reject unwanted attributes (people, clothing, setting, text, style, audio)
- If multiple views show one subject, lock the exact count
- If sources conflict, name priority by attribute

Pattern:

```
@Image 1 defines <subject identity/appearance>.
@Image 2 defines <location/prop/style>.
@Video 1 defines only <motion/camera/timing>; do not inherit <people, setting, text, style, audio>.
@Audio 1 defines only <voice/music/ambience/effects>.
```

## 3. Choose the workflow

State the workflow in the prompt.

**UNLOCKED** — references guide the result (subject, motion, style, audio):

- **Storyboard** — loose plot, shot order, ≤15 panels
- **Keyframes** — close visual alignment, ordered images

**LOCKED** — inputs control timeline or geometry:

- **Edit** — `ratio = adaptive`, `duration = -1`; triggers: `edit / replace / remove`
- **First/last frame** — `ratio = adaptive`; `first_frame / last_frame` roles; match image ratios
- **Extension** — `ratio = adaptive`; set duration; triggers: `extend forward / continue`

## 4. 30-second story map

Stage visible change on consecutive integer-second ranges. One primary state change + one visible end state per stage.

| Range | Job |
|---|---|
| 0–6s | Establish subject, location, situation, direction |
| 6–12s | Trigger changes the situation |
| 12–18s | Reaction, transformation, or maneuver |
| 18–25s | One coherent cause-and-effect exchange |
| 25–30s | Resolution, aftermath, readable final frame |

Shorter clips keep the same rules and compress the map. Do not use fractional seconds (`0:02.7` is illegal).

| Duration | Default stages |
|---|---|
| 8s | `0-4`, `4-8` |
| 9–10s | `0-4`, `4-7`, `7-10` |
| 12–13s | `0-4`, `4-8`, `8-13` |
| 15s | `0-5`, `5-10`, `10-15` or five 3s beats |
| 30s | full five-stage map |

Every new stage begins from the previous stage’s visible end state.

## 5. Continuity locks

Track: exact count, identity, clothing, prop owner + hand, position, screen direction, environment, lighting/weather, damage/state, camera axis, and audio source.

Handoffs use:

`BEFORE -> transfer moment -> AFTER`

Key rule: every new stage must begin from the previous stage’s visible end state.

## 6. Camera + action

- One dominant camera move per shot
- Prefer “slow dolly in at eye level” over “zoom in cinematically”
- Causal action chain: Trigger -> Contact/Evasion -> Reaction -> Recovery -> Next Decision

A storyboard may cut. Each panel still gets one camera move. Do not stack handheld + whip-pan + macro + crash zoom inside one shot.

## 7. Audio syntax

Use these wrappers and nothing else for audio layers:

- `( music )`
- `< effects / ambience >`
- `{ dialogue }`
- `[ subtitles ]`

Assign speaker, language, accent, and delivery. Explicitly reject unwanted reference audio or BGM.

Example:

```
Audio: (warped dreampop over a muted trap pulse) <rain, door chime, fluorescent hum> {Lead, American English, low and exact: "Who turned her?"} [title card only]
```

## 8. Locked-parameter quick rules

- **EDIT:** `ratio = adaptive`, `duration = -1`. Use `edit / replace / remove`.
- **FIRST + LAST FRAME:** `ratio = adaptive`. Use `first_frame / last_frame` roles and match image ratios.
- **EXTEND:** `ratio = adaptive`. Set duration. Use `extend forward / continue`.

## Copy-ready template

Fill this. Do not revert to a 2.0 field dump.

```
@Image 1 defines <subject identity/appearance>.
@Image 2 defines <location/prop/style>.
@Video 1 defines only <motion/camera/timing>; do not inherit <people, setting, text, style, audio>.
@Audio 1 defines only <voice/music/ambience/effects>.

<Subject> performs <one visible event> in <environment>.
0-<time>: <first change and visible end state>.
<time>-<time>: Continue from that state; <second change and final state>.
Camera: <one dominant direction per shot>.
Audio: <assigned dialogue, music, effects, and ambience>.
Keep <identity, count, clothing, ownership, layout, lighting, and direction> consistent.
No <duplicates, extra people, text, logos, unwanted audio, or unexplained cuts>.
```

## Before-generating checklist

Copy and complete:

```
- [ ] Correct locked/unlocked workflow
- [ ] Every asset mapped to one job
- [ ] One state change per stage
- [ ] Consecutive integer-second ranges
- [ ] Exact counts and ownership
- [ ] One camera move per shot
- [ ] Speaker and audio layers assigned
- [ ] Narrow exclusions only
- [ ] Final state is visibly clear
```

Fail any box → rewrite before handing the prompt over.

## Output contract

Return, in this order:

1. **Workflow** — UNLOCKED storyboard/keyframes or LOCKED edit/first-last/extend, plus duration and ratio
2. **Asset roles** — one line per `@` tag
3. **One-sentence summary**
4. **Copy-ready Seedance 2.5 prompt** inside a `text` fence, ready to paste
5. **Checklist** with every box marked

Do not invent generation IDs, media, or reference files. If an asset is missing, write the `@` line as a required attach and stop short of claiming it is uploaded.
