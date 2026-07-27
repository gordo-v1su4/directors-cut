---
name: midjourney-video-asset-prompt
description: Writes Midjourney video prompts from a starting frame to produce asset-ready motion clips—subject, background, and camera movement woven into dense TAG-style lines for pulling stills. Use when the user uploads a character frame, wants Midjourney video prompts, motion reference footage, pose/expression variants, or dynamic assets from a still image.
---

# Midjourney Video Asset Prompts

Turn a **starting frame** (uploaded image or detailed description) into **individual Midjourney video prompts**. Each prompt describes how the subject must move so the clip yields high-quality, pullable still assets.

Works standalone or after a character-sheet image; the starting frame defines look—motion prompts do not require a prior character sheet.

## Prerequisites

If the user has **not** uploaded an image and has **not** described the starting frame with enough detail, reply exactly:

> Thanks for that, I fully understand your request. Please go ahead and upload the starting frame you would like me to use, and I will generate those prompts for you right away.

## Workflow

1. **Analyze the starting frame** — subject, outfit, pose, expression, background, art style, framing.
2. **Collect asset goals** — user may list numbered motion ideas (e.g. "puts on helmet", "winks and sings"). If none provided, invent diverse useful motions (actions, camera orbits, animation cycles, effects matching the design).
3. **Write one prompt per asset goal** — typically 12–15 dense lines each.
4. **Optional follow-up** — after all prompts, offer NEXT IDEAS (same structure as character-sheet skill).

## Prompt structure

Integrate **action and movement lines** with scene detail. Each line alternates between how the frame **starts** and how it **moves** as video progresses.

Rework the template below into information-dense Midjourney-style lines (TAG-like phrases + transition words). Video is more complex than stills—**12–15 lines per prompt** is normal.

### Core template

Open with a variant of:

> Reference footage of [1–3 word character description] striking several [poses/expressions].

Then weave these beats across the prompt:

1. **Starting pose** — describe the basic pose/expression from the uploaded frame.
2. **Asset motion arc** — "moves into several [1–3 word asset descriptions]".
3. **Freeze moments** — "the footage freezes as if pausing at key moments where the [pose/expression] is most picturesque".
4. **Primary motion** — biggest body part, camera, or environmental move from start to end position.
5. **Secondary motion** — smaller supporting move that makes the primary motion natural (e.g. shoulder lean during arm motion).
6. **Additional micro-motions** — any smaller moves worth naming.
7. **Style of motion** — for photoreal or clearly animatable subjects, metaphor is fine; for painted/drawn frames, be precise about line-work, shadows, and color shifts during motion.
8. **Frame composition control** — name edge content and describe what it **does visually** throughout (never just "remain visible"):
   - **Top of frame** — e.g. "the gray hat has a flat top that bounces slightly as his head moves"
   - **Bottom of frame** — e.g. "his tall brown boots cast shadow that moves as he rotates"
   - **Sides of frame** — e.g. "his stubby fingers are casually pointed down, but swing gently with his movement"

Close every prompt with this exact line:

> Clean reference footage, with sharp and character-accurate motion perfectly for pulling assets from.

## Movement layers to include

Sprinkle these throughout each prompt (not as a flat list):

| Layer | What to describe |
|-------|------------------|
| **Subject movement** | Pose changes, gestures, expression shifts, wardrobe/prop interaction |
| **Background movement** | Light shifts, color desaturation, environmental drift |
| **Camera movement** | Dolly, push-in, orbit, semi-circle—whatever keeps subject centered and fully framed |

## Default asset ideas

When the user provides no motion list, pick from:

- Actions the character could take
- Camera orbits around the character
- Classic animation cycles
- Effects that match the character design

## Output format

For each asset goal, output:

```
**Prompt N – [short title of the motion/asset]**

[12–15 line prompt block]

```

After all prompts, optionally append:

```
To take these to the next level, here are some ideas of what you might want to try next.
1. ...
2. ...
3. ...
4. ...
```

## Examples

For four complete prompts (helmet, wink/sing, evil eyes, hair spin) based on a woman in a black suit, see [examples.md](examples.md).
