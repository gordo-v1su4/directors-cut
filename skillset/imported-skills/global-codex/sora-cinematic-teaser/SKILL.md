---
name: sora-cinematic-teaser
description: Preferred Sora companion skill for converting concepts, image sets, rough trailer prompts, or Seedance-style prompts into Sora-ready cinematic teaser prompts. Use when the user wants stronger visual continuity, cinematic breathing room, clearer geography, controlled acceleration, premium film language, emotionally readable action, or a Sora version of a dense Seedance trailer prompt.
metadata:
  short-description: Build Sora-ready cinematic teaser prompts
---

# Sora Cinematic Teaser Prompt Architect

## Purpose

Convert any concept, image set, rough trailer prompt, or Seedance-style video prompt into a Sora-ready cinematic teaser prompt.

This skill is designed for prompts that need:

- stronger visual continuity
- cinematic breathing room
- fewer over-crammed micro-cuts
- clearer scene geography
- premium film language
- controlled ramp-up
- emotionally readable action

Sora prompts should still feel dynamic, but they should not be so over-edited that the model has no time to establish the world.

## Core Difference From Seedance

Seedance can respond well to dense, aggressive trailer-montage language.

Sora usually benefits from:

- a clearer opening image
- fewer total shots
- longer readable beats
- smoother escalation
- strong continuity between moments
- cinematic scene progression
- less 0.2-second flash-frame overload
- more emphasis on what the camera sees and how the motion flows

The goal is not slower. The goal is controlled acceleration.

## Default Sora Runtime Logic

If the user asks for a teaser:

- 8 seconds: use for one image, one transformation, or one strong reveal.
- 10-12 seconds: use for a compact cinematic teaser with a beginning, escalation, and title hit.
- 15 seconds: use only when there are several characters, a creature, a world reveal, and a twist.

For Sora, 12 seconds is often better than 15 when the idea should feel sharp but not chaotic.

## Creative Authority Scale

### Level 1: Strict Conversion

Use when the user gives a Seedance prompt and wants the same idea adapted to Sora.

Preserve:

- title
- characters
- references
- core action
- tone
- final reveal

Change:

- pacing
- density
- wording
- shot rhythm
- clarity
- transition logic

### Level 2: Cinematic Rebuild

Use when the user says the old prompt was too fast, too messy, or not dynamic enough.

The LLM may:

- reduce shot count
- stretch the opening
- combine several beats into one stronger shot
- replace flash-frame overload with clearer trailer images
- add a stronger emotional arc

### Level 3: Sora Trailer House Mode

Use when the user wants the best possible Sora result.

The LLM may:

- restructure the whole trailer
- choose a better runtime
- split into parts
- rewrite the teaser as a professional trailer sequence
- prioritize cinematic continuity over literal prompt completeness

Default to Level 2 or 3 unless the user asks for strict preservation.

## Input Modes

### Image Set

Use when the user provides one or more images.

- Assign each image a role.
- Preserve identity, wardrobe, props, environment, palette, and atmosphere.
- Avoid repeatedly describing the same image.
- Let the first beat establish the strongest readable image before escalation.

### Concept Only

Use when the user gives no images.

- Invent the visual world and central cinematic action.
- Keep the prompt coherent enough that Sora can maintain geography and continuity.
- Use fewer, more readable trailer beats than the Seedance version.
- Translate style references into camera, light, texture, location, wardrobe, and mood.

### Seedance-To-Sora Conversion

Use when adapting an existing dense Seedance prompt.

- Keep the identity locks and core trailer engine.
- Reduce micro-cut overload.
- Turn flash-frame lists into fewer readable impact images.
- Replace frantic montage wording with controlled acceleration.
- Preserve the final reveal or title sting when it is strong.

## Sora Prompt Structure

Use this format when references are attached:

```text
Create a [runtime]-second cinematic teaser trailer for "[TITLE]" using the attached references as strict visual identity locks.

@Image 1 = [role].
@Image 2 = [role].
@Image 3 = [role].
@Image 4 = [role].

Do not redesign them. Preserve faces, bodies, wardrobe, props, creature anatomy, color palette, environment, and atmosphere across the entire video.

Format: 16:9 anamorphic cinematic trailer, premium live-action, ARRI Alexa-style, Cooke anamorphic lens feel, shallow focus, oval bokeh, realistic motion, realistic physics, rich film texture.

Pacing: controlled acceleration. Begin with a readable cinematic hold, then build into faster trailer cuts. Avoid chaotic over-editing. The first third breathes, the middle accelerates, the final third becomes intense and mythic.

[0:00-0:03.5 - OPENING IMAGE]
A clear, cinematic establishing moment. Let the world breathe. Minimal cuts.

[0:03.5-0:07 - ESCALATION]
The threat appears. Faster cuts begin, but each image remains readable.

[0:07-0:10 - DETONATION]
The main action beat. One hero slow-motion moment allowed, then return to real speed.

[0:10-0:11.2 - REVELATION]
Sudden quiet. One emotionally clear reveal.

[0:11.2-0:12 - TITLE / FINAL STING]
Title card or final impact image. Hard blackout.

Audio direction: [score, rhythm, bass, silence, impacts, atmosphere].

Rules: maintain identity consistency, no face drift, no extra main characters, no scene drift, no generic redesigns, no cartoon motion, no excessive flash frames, no slow fades unless requested, no exposition.
```

Use this format when no images are attached:

```text
Create a [runtime]-second cinematic teaser trailer for "[TITLE]," a [genre / premise].

Concept: [one-sentence hook].

Visual style: [camera, color, texture, lighting, locations, wardrobe, mood]. 16:9 anamorphic, premium live-action, ARRI Alexa-style, Cooke anamorphic lens feel, shallow focus, oval bokeh, realistic motion, realistic physics, rich film texture.

Pacing: controlled acceleration. Begin with one clear cinematic image, then build into stronger trailer movement. Avoid chaotic over-editing. Let the world breathe before the impact.

[0:00-0:03.5 - OPENING IMAGE]
One readable image establishes world, character, tone, and geography.

[0:03.5-0:07 - ESCALATION]
The emotional or physical threat appears. Movement increases, but each beat remains legible.

[0:07-0:10 - DETONATION]
The main action, reveal, chase, transformation, betrayal, or supernatural turn.

[0:10-0:11.2 - REVELATION]
Near silence. One image clarifies the emotional truth.

[0:11.2-0:12 - TITLE / FINAL STING]
Title card or final image. Hard blackout.

Audio direction: [score, rhythm, bass, silence, impacts, atmosphere].

Rules: no exposition, no generic stock footage, no flat lighting, no disconnected scenes, no excessive flash frames, no slow fades unless requested. Every beat should connect to the same world and emotional arc.
```

## Final Behavior Rule

Always give the user a usable Sora-ready prompt. Do not over-ask for clarification.

When the user gives a Seedance-style prompt, do not merely change the model name. Rebuild the rhythm for Sora: fewer shots, clearer motion, stronger continuity, and a controlled ramp from readable opening image to final sting.

