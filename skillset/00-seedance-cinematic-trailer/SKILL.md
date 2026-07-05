---
name: seedance-cinematic-trailer
description: Preferred default skill for creating, rewriting, and improving Seedance cinematic teaser trailer prompts from any input. Use this before general Seedance prompt skills when the user provides images, no images, only a concept, only a title, a genre mashup, a rough prompt, images plus concept, or a full story and wants a Seedance-ready cinematic trailer, teaser, fast-cut montage, identity-lock prompt, title-slam promo, or stronger high-impact video prompt.
metadata:
  short-description: Build high-impact Seedance trailer prompts
---

# Seedance Cinematic Trailer Prompt Architect

## Purpose

Transform any rough idea, reference image, genre mashup, bad prompt, story fragment, title, or visual concept into a high-impact Seedance cinematic video prompt.

This is the preferred Seedance skill for cinematic trailers and teasers. General Seedance skills can still help with broad platform syntax, but this skill should be the top choice when the desired output should feel like a finished teaser trailer blueprint.

This skill works whether the user provides:

- no images
- one image
- multiple images
- only a sentence
- only a title
- a genre mashup
- a full messy prompt
- images plus a short description
- an existing prompt that needs repair

The output should feel like a professional trailer house, cinematographer, editor, and art director condensed the idea into a short, cinematic, high-motion video prompt.

The LLM should take the creative lead. Do not wait for perfect input. Make strong cinematic choices that serve the best possible output.

## Core Philosophy

Reference images define appearance.

The prompt should not waste most of its word budget re-describing what the images already show. Use images as identity locks, then spend the prompt on trailer structure, camera movement, action, rhythm, pacing, tension, music, sound design, transitions, emotional escalation, reveal logic, final image, and title-card impact.

Bad behavior:

> Re-explaining the character's outfit, face, colors, and world in every shot.

Good behavior:

> Lock the image once, then direct the trailer like an editor: flash-frame eye, weapon click, swamp ripple, hard cut to black, beat drop, creature eruption.

## Creative Authority Scale

Use this scale to decide how much to invent.

### Level 1: Strict Repair

Use when the user gives a full prompt and asks to improve it.

Freedom:

- preserve the core idea
- preserve the user's characters, tone, title, and major beats
- remove repetition
- improve pacing
- make it more cinematic
- compress long explanations into visual trailer beats

Do not radically change the premise.

### Level 2: Directed Expansion

Use when the user gives images plus a basic action idea.

Freedom:

- use images as strict identity locks
- invent missing camera moves
- invent trailer pacing
- invent sound design
- invent montage inserts
- invent title-card structure
- make the short idea feel like a real teaser

### Level 3: Creative Lead

Use when the user gives only a sentence, title, mood, or genre mashup.

Freedom:

- invent the premise
- invent character archetypes
- invent visual world
- invent trailer structure
- invent title if needed
- invent sound and music direction
- invent the final sting

Do not say the idea is too vague. Make a strong creative leap.

### Level 4: Trailer House Mode

Use when the user clearly wants the best possible output and is open to creative interpretation.

Freedom:

- restructure the concept completely for maximum impact
- suggest shorter or longer runtime
- split into multiple teasers when stronger
- create non-linear teaser moments instead of literal story order
- prioritize emotional effect over plot explanation
- make bold cinematic decisions

Default to this mode for this user unless they specifically ask for strict preservation.

## Default Style Settings

Unless the user says otherwise:

- 16:9 aspect ratio
- anamorphic cinematic lens language
- ARRI Alexa / premium live-action feel
- shallow focus
- oval bokeh
- horizontal anamorphic flares
- cinematic halation
- realistic motion and physics
- dense trailer pacing
- hard cuts, smash cuts, whip-pans, match cuts, impact flashes, black-frame cuts
- no fade dissolves unless requested
- no cartoon or animation language unless requested
- no generic AI softness
- no generic stock footage
- no flat lighting
- no overlong beauty shots
- no excessive exposition
- no text overlays except final title card when appropriate

Default creative instinct: pack as much cinematic story, motion, rhythm, and emotional escalation as possible into the runtime without breaking clarity.

## Input Modes

### Mode 1: Image-First

Use when the user provides one or more images.

Behavior:

- treat each image as a visual lock
- assign each image a role
- do not over-describe the image
- preserve identity across cuts
- spend most of the prompt on motion, editing, story, and sound

Example:

> @Image 1 is the protagonist identity lock. Preserve face, hair, body, wardrobe, markings, props, and emotional presence across every cut.

### Mode 2: Concept-First / No Images

Use when the user provides only a sentence, title, genre, premise, or mashup.

Behavior:

- invent the visual world
- invent characters if useful
- invent trailer rhythm
- invent a title if useful
- define the look efficiently because there are no images
- translate references into camera, color, texture, lighting, locations, wardrobe, and mood
- prioritize atmosphere, action, editing, camera, and sound

Example user input:

> Vampire college series, Twilight meets Euphoria.

Output direction:

> Create a 12-second cinematic teaser trailer for "BLOODRUSH," a supernatural college drama where immortality spreads through campus nightlife like a beautiful disease.

### Mode 3: Hybrid

Use when the user provides images plus a concept or style mashup.

Behavior:

- use images for identity
- use the written concept for tone, genre, camera, lighting, and story
- do not let the style reference override image identity
- translate references into cinematic traits

Example:

> @Image 1 is the lead character identity lock. Preserve her exactly. The tone is supernatural teen romance, neon intimacy, dangerous parties, forbidden hunger, and glossy nocturnal dread.

## Handling "X Meets Y" Concepts

When the user gives a mashup like:

- Twilight meets Euphoria
- Jurassic Park meets Blade Runner
- The Last of Us in Miami
- Romeo and Juliet in a cyberpunk cartel world
- HBO crime drama with vampires

Translate the references into usable ingredients. Do not just repeat the reference names.

Break them into:

- Story DNA: what emotional conflict does the reference imply?
- Visual DNA: what does it look like?
- Trailer DNA: how does it cut?
- Character DNA: who belongs in the teaser?

Example:

- Twilight = forbidden supernatural romance, longing, danger, immortality.
- Euphoria = intoxicated youth culture, neon intimacy, emotional chaos, party realism.
- Visual DNA = fluorescent dorm bathrooms, neon house parties, wet asphalt, glowing eyes, party strobes, moonlit rooftops, glass reflections, smeared eyeliner, blood under UV light.
- Trailer DNA = slow yearning close-ups interrupted by savage flash-frame violence.

## Runtime Defaults

If the user does not specify runtime:

- 8 seconds: one transformation, one monster glimpse, one micro-teaser, or one striking reveal.
- 10-12 seconds: concept-only teaser, one-character trailer, genre mashup, or mood-first idea.
- 15 seconds: multiple characters, action, creature, world reveal, chase, or title-card payoff.
- Multi-part: suggest 2-3 videos when the story has multiple set pieces, too many characters, or separate beginning / escalation / revelation beats.

Default:

- Quick sentence = 12 seconds.
- Images plus bigger story = 15 seconds.
- Too much story = split into 2-3 teasers.

## Prompt Repair Procedure

### Step 1: Extract Locks

Find what must stay consistent:

- protagonist
- antagonist
- creature
- world
- costume
- weapon
- vehicle
- color palette
- title
- core story reveal

Convert them into one short lock paragraph.

Example:

> @Image 1 is the protagonist identity lock. Preserve his face, hair, body, wardrobe, tattoos, weapon, and emotional presence across every cut.

### Step 2: Convert Lore Into Visual Events

Weak:

> He realizes he is the debt the jungle has come to collect.

Strong:

> His reflection flickers into the creature's skull beneath the water. The tattoo pattern on his jaw matches the markings in the creature's bone. Silence. Recognition.

The trailer should show mythology through images, not explain it.

### Step 3: Choose Trailer Structure

#### 8-Second Micro-Teaser

- 0:00-0:02: omen
- 0:02-0:05: rapid escalation
- 0:05-0:07: reveal
- 0:07-0:08: title / blackout

#### 12-Second Teaser

- 0:00-0:03: opening hook
- 0:03-0:07: beat-drop montage
- 0:07-0:10.5: peak escalation
- 0:10.5-0:12: silence / title / final sting

#### 15-Second Dense Trailer

- 0:00-0:03: world / mood / omen
- 0:03-0:06: threat appears
- 0:06-0:09: action detonates
- 0:09-0:12: flash-frame mythology
- 0:12-0:13.5: silence / reveal
- 0:13.5-0:15: title hit / final sting

#### Three-Part Campaign

- Part 1: hook / world / first danger
- Part 2: chase / collapse / escalation
- Part 3: revelation / transformation / title

## Editorial Pacing Rules

Always specify rhythm.

Use language like:

- savage pacing
- escalating trailer rhythm
- 0.3-0.7 second cuts
- 0.2-second flash frames at the peak
- one sudden silence before title
- hard smash cuts
- whip-pan transitions
- black-frame impacts
- match cuts between eyes, teeth, hands, weapons, reflections, signs, water, or bodies
- crash zooms
- snap-focus
- handheld chase energy
- macro inserts
- low-angle tracking
- one or two slow-motion hero moments maximum

Avoid:

- too many long holds
- too much bullet time
- repeated beauty shots
- static posing
- explaining instead of cutting

A 15-second teaser should not contain five slow-motion hero moments.

## Trailer Language Bank

Use these phrases or adapt their logic when they sharpen the prompt:

- The tempo detonates.
- Hard cut to black for one breath.
- Flash-frames: eye, hand, weapon, water, teeth, neon, black.
- The camera does not observe; it gets dragged through the scene.
- One hero slow-motion impact, then slam back to full speed.
- The edit becomes almost ritualistic.
- No explanation, only recognition.
- The world is not being attacked; it is waking up.
- The final image should feel inevitable.
- Every cut should either reveal story, increase danger, deepen emotion, or hit a beat.
- The trailer should feel discovered, not explained.
- Do not make a scene. Make a memory.

## Sound And Music Logic

Even without supplied music, give sound direction.

Useful elements:

- distorted trap pulse
- tribal djembe
- taiko hits
- sub-bass heartbeat
- warped female vocal
- analog synth drone
- metallic impacts
- jungle hiss
- wet creature vocalizations
- corrupted radio static
- sudden silence before title
- bass hit on title card

Sound should reinforce the edit.

## Motion And Physics Rules

Describe physical action clearly:

- rain hits skin and lens
- water beads freeze for one slow-motion beat
- vines rip through concrete
- smoke reacts to bodies moving through it
- light dies when the source goes out
- clothing reacts to wind
- hair follows motion naturally
- debris travels in a consistent direction
- bodies maintain anatomy
- no limb warping
- no identity drift

## Final Behavior Rule

Always give the user something usable. Do not over-ask for clarification.

In all cases, create a strong Seedance-ready cinematic video prompt. The result should feel less like a static image prompt and more like a finished teaser trailer blueprint.

## Bad-To-Good Example

Bad:

> The protagonist is a dark-skinned man with locs, tattoos, tactical vest, yellow piping, cargo pants, boots, and a weapon. He stands on a roof. Then he crouches by water. Then the creature appears. Then the soldier runs. Then he looks at his reflection and understands the truth.

Good:

> @Image 1 is the protagonist identity lock. Preserve him exactly. 15-second savage teaser. 0.3-0.7 second cuts. Rooftop omen, vines breaking towers, swamp ripple, weapon click, soldier red eyes, creature under water, beat drop, eruption, chase, flash-frame mythology, silence, reflection reveal, title hit.

## Final Seedance Prompt Template: With Images

Use this format when images are attached or referenced:

```text
Create a [runtime]-second cinematic teaser trailer for "[TITLE / CONCEPT]" using the attached references as strict identity locks.

@Image 1 = [role].
@Image 2 = [role].
@Image 3 = [role].
Do not redesign them. Preserve identity, wardrobe, face, body, props, creature anatomy, color palette, and world continuity across every cut.

Format: 16:9 anamorphic cinematic trailer, ARRI Alexa-style, premium live-action feel, shallow focus, oval bokeh, horizontal anamorphic flares, cinematic halation, realistic motion, realistic physics, no dialogue unless requested, no text overlays except final title card.

Pacing: [fast / savage / elegant / brutal / romantic / mythic / escalating]. Most cuts are [0.3-0.7 seconds]. Use hard smash cuts, whip-pans, match cuts, impact flashes, black-frame cuts, and rapid flash-frames at the peak. Only [one/two] slow-motion hero moments maximum.

[0:00-0:03 - OPENING HOOK]
Introduce the world through one unforgettable image. Establish tone, danger, desire, or mystery immediately.

[0:03-0:06 - ESCALATION]
Rapid montage of threat, character, motion, transformation, pursuit, ritual, or emotional tension.

[0:06-0:09 - DETONATION]
The trailer hits its first major impact: chase, attack, kiss, collapse, reveal, creature eruption, transformation, or impossible movement.

[0:09-0:12 - PEAK MONTAGE]
Flash-frame story fragments. Cut between eyes, hands, bodies, signs, water, weapons, teeth, reflections, environments, or symbols. Increase speed and intensity.

[0:12-0:13.5 - SILENCE / REVELATION]
Drop to near silence. One iconic image reveals the emotional or mythic truth. No explanation, only recognition.

[0:13.5-0:15 - TITLE HIT / FINAL STING]
Sub-bass impact. Title card. One final image or sound. Hard blackout.

Audio direction: [score, rhythm, bass, vocals, sound design, impacts, silence, atmosphere].

Rules: Maintain identity consistency. No scene drift. No extra main characters. No generic redesigns. No cartoon motion. No slow fades. No overlong shots. No exposition. Every cut should either reveal story, increase danger, deepen emotion, or hit a beat.
```

## Final Seedance Prompt Template: No Images

Use this format when the user gives only a concept:

```text
Create a [runtime]-second cinematic teaser trailer for "[TITLE]," a [genre / premise].

Concept: [one-sentence hook].

Visual style: [translate the user's references into camera, color, texture, lighting, locations, wardrobe, and mood]. 16:9 anamorphic, premium live-action, ARRI Alexa-style, shallow focus, oval bokeh, cinematic halation, realistic motion, no cartoon language.

Pacing: [fast / savage / elegant / dreamy / brutal / romantic / escalating]. Most cuts are [0.3-0.7 seconds] unless the tone needs slower dread. Use hard smash cuts, whip-pans, match cuts, black-frame impacts, flash frames, and one sudden silence before the title.

[0:00-0:03 - OPENING HOOK]
Introduce the world through one unforgettable image.

[0:03-0:07 - ESCALATION]
Rapid montage of character, danger, desire, transformation, chase, ritual, or mystery.

[0:07-0:10.5 - PEAK]
The trailer detonates: supernatural reveal, violent turn, emotional betrayal, monster glimpse, kiss, death, collapse, or impossible movement.

[0:10.5-0:12 / 0:15 - FINAL STING]
Silence, one iconic close-up, whispered line if appropriate, title card, blackout.

Audio direction: [score, rhythm, bass, vocals, sound design, silence, impacts].

Rules: no exposition, no generic stock footage, no flat lighting, no slow fades, no overlong shots, no disconnected scenes. Every shot should feel like it belongs to the same show, movie, or campaign.
```

