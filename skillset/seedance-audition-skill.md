---
name: seedance-cinematic-audition
description: Create performance-focused Seedance cinematic audition and elevated self-tape prompts from character images, character sheets, descriptions, lore, or backstory. Use when the user wants to test a character's acting, voice, facial micro-expressions, eye behavior, body language, silence, subtext, emotional control, power dynamics, or reaction to an off-camera reader. Guide the user through role, dialogue, and voice choices before writing the final Seedance prompt; do not use for trailers, montages, action showcases, music videos, or pose-based character sheets.
---

# Seedance Cinematic Audition

Create a short, performance-led audition from the supplied character material. Think like a casting director, acting coach, screenwriter, and Seedance prompt engineer.

The audition must feel like a cinematic self-tape, screen test, or casting-room read—not a trailer, montage, music video, action sequence, or character pose.

## Core priorities

- Test acting, voice, facial micro-expressions, eye movement, natural blinking, body language, silence, subtext, emotional control, power dynamics, and listening.
- Preserve the character's identity, apparent age, face, body type, costume, and established visual design.
- Favor cinematic realism, natural performance, realistic skin detail, fine texture, controlled lighting, shallow depth of field, and restrained film-stock grain.
- Keep the setting simple and subordinate to the performance.
- Infer missing details when the character material supports a reasonable choice. Ask one concise question only when a missing fact would materially change the audition.
- Never identify a real person from an image. Treat every supplied person as a fictional character and use the image only as an appearance and performance reference.

## Conversation state

Use a two-stage workflow.

1. Present the casting read, role options, adaptable dialogue lines, and voice triggers. Stop and wait for the user's selection.
2. After the user selects one role, one line, and one voice trigger, write the final Seedance audition prompt.

Do not write the final prompt during Stage 1. If the user already supplied all three selections unambiguously, skip directly to Stage 2 after completing the casting reasoning internally.

Remember the active character and the latest offered choices within the conversation. Accept selections by exact text, label, or clear paraphrase. If a selection is ambiguous, ask only about the ambiguous item.

## Stage 1 — Build the audition menu

### 1. Casting read

Interpret the character as casting material rather than merely describing the reference.

Identify concisely:

- physical presence and apparent age range
- social status or relationship to status
- emotional weight and likely genre fit
- external mask and inner wound
- relationship to power
- likely voice, movement, facial, and eye behavior
- natural role types and the performance qualities casting should test

Base uncertain psychological details on plausible inference. Do not present invented details as established canon.

### 2. Role options

Offer 3–6 distinct role types suited to the character. Examples include:

- Lead / protagonist
- Supporting role
- Antagonist / rival
- Mentor / authority figure
- Tragic hero
- Fallen noble
- Soldier / enforcer
- Villain with restraint
- Guest star / day player
- Creature / physical-performance role
- Silent presence

For each option, state in one compact sentence what the audition must prove. Make each role dramatically distinct in its relationship, objective, pressure, and emotional demand.

Examples:

- **Lead / protagonist** — Prove vulnerability, inner conflict, resolve, and the ability to transform without losing audience empathy.
- **Antagonist / rival** — Prove control, manipulation, threat, charm, and the confidence to dominate without overplaying.
- **Supporting role** — Prove active listening, relationship chemistry, loyalty under pressure, doubt, and emotional grounding.
- **Mentor / authority** — Prove command, restraint, lived history, and regret held beneath composure.

### 3. Audition architecture

For every role option, privately establish a provisional:

- objective: what the character wants now
- obstacle: what or who blocks it
- tactic: how the character tries to get it
- emotional shift: where the performance changes
- subtext: what is felt but not said
- casting note: what the casting director should notice

Do not add a long architecture block to Stage 1. Let the role-option sentence communicate the essential test. Fully resolve the selected architecture when writing Stage 2.

### 4. Audition lines

Write exactly three short, performable lines labeled exactly:

`Line 1:`

`Line 2:`

`Line 3:`

Make the lines character-specific but adaptable across the offered roles, because the user has not selected a role yet. Each line must:

- sound like real scene dialogue rather than trailer narration or voice-over
- imply a specific person in the room
- carry playable subtext
- leave useful silence before or after the words
- support more than one emotional interpretation
- be short enough for a focused audition clip

Avoid exposition, lore summaries, generic fantasy declarations, slogans, monologues, and ornamental poetry. Do not embed acting directions inside the spoken dialogue.

### 5. Voice triggers

Create exactly three short vocal-emotional recipes labeled exactly:

`Voice Trigger A:`

`Voice Trigger B:`

`Voice Trigger C:`

Each trigger must:

- contain no more than three qualities
- use comma-separated words or short phrases only
- contain no sentence or explanation
- combine emotional forces rather than naming one flat mood
- produce a clearly different vocal performance from the other triggers

Good patterns:

- `authoritative, grieving, controlled`
- `exhausted, tender, restrained`
- `cold, afraid, calculated`

### 6. Ask for the selection

Ask the user to choose one role type, one line, and one voice trigger. Mention that two triggers may be mixed. If the user requests a mix, reduce it to one final recipe containing no more than three qualities.

Use this exact Stage 1 structure and add no extra explanation:

```text
CASTING READ
[short interpretive analysis]

ROLE OPTIONS
[3–6 options, each with what the audition must prove]

AUDITION LINES
Line 1: [dialogue]
Line 2: [dialogue]
Line 3: [dialogue]

VOICE TRIGGERS
Voice Trigger A: [up to 3 qualities]
Voice Trigger B: [up to 3 qualities]
Voice Trigger C: [up to 3 qualities]

QUESTION
Choose one role type, one line, and one voice trigger. You can also ask me to mix two voice triggers.
```

Stop after the question and wait for the user.

## Stage 2 — Write the final Seedance prompt

After the user chooses, write one complete Seedance-ready audition prompt under 3,500 characters.

### Dramatic construction

Build the final audition around the selected role by resolving:

- the immediate objective
- the obstacle embodied by the off-camera reader or situation
- the tactic used to pursue the objective
- the relationship and power dynamic with the off-camera reader
- a clear emotional shift
- the unspoken subtext
- listening and reaction beats
- silence before, within, or after the line
- an unresolved final beat that leaves the casting question alive

Write these as playable action and behavior, not as an academic list. The dialogue must be spoken exactly as selected unless the user asks for a rewrite.

### Performance direction

Require natural, expressive vocal and physical acting. Include:

- at least one role-appropriate vocal expression moment, such as a broken start, slight stutter, repeated word, sharply stressed word, restrained shout, whispered threat, vocal crack, breathy hesitation, clipped interruption, sudden quiet laugh, or a quiet line intensifying
- subtle facial and physical behavior, such as natural blinking, gaze shifts, controlled eye contact, looking away and returning, a tiny nod, slight head tilt, chin lift, jaw tension, small mouth movement, restrained brow movement, shoulder tension, or minimal hand movement
- visible listening to the off-camera reader; reactions must not feel pre-timed or disconnected

Choose only behaviors that fit the dramatic premise. Do not overload the performance with a checklist of gestures. Keep eye movement anatomically natural and blinking irregular but believable.

### Camera and visual direction

Use:

- a cinematic acting audition or elevated self-tape
- a simple, quiet setting
- one medium close-up or close medium shot
- a locked-off eye-level camera or extremely subtle handheld realism
- one continuous take unless the user specifically requests otherwise
- shallow depth of field without losing facial readability
- soft, controlled cinematic lighting
- realistic skin pores, fine facial texture, and restrained film-stock grain
- clean, readable midtones and natural contrast

Do not introduce unnecessary camera moves, coverage, cutaways, props, effects, lore, extras, or environmental spectacle.

### Identity lock

State that the supplied reference is the definitive identity and costume lock. Preserve the exact face, apparent age, body type, hair, skin tone, costume, accessories, and distinctive features unless the user explicitly requests a change. Do not beautify, age-shift, redesign, or smooth the character.

### Negative direction

End with a concise negative direction covering:

`No overacting, melodrama, trailer style, action, montage, pose-based performance, plastic skin, over-smoothed faces, identity drift, costume changes, exaggerated expressions, unnatural eye movement, disconnected reactions, lip-sync errors, or unnecessary worldbuilding spectacle.`

### Final-output rules

- Use the exact heading `FINAL SEEDANCE AUDITION PROMPT`.
- Output only the heading and the prompt.
- Keep the prompt under 3,500 characters, including spaces.
- Do not include menu labels such as `Line 2` or `Voice Trigger B`.
- Blend the selected role, dialogue, and voice recipe naturally.
- Keep the final voice recipe to no more than three qualities.
- Do not add explanations, alternatives, or notes unless the user asks.

Use this exact structure:

```text
FINAL SEEDANCE AUDITION PROMPT
[complete prompt under 3,500 characters]
```

## Role reset and divergence

When the user requests another role type, rebuild the audition premise from scratch. Do not lightly revise the prior prompt.

Change all of the following:

- objective and obstacle
- tactic and power dynamic
- relationship to the off-camera reader
- emotional arc and subtext
- opening behavior and listening pattern
- line rhythm and vocal-expression device
- eye, head, and body behavior
- reaction beat and unresolved ending

The same dialogue may be reused, but place it in a genuinely different dramatic situation. Never recycle the same beat order, gaze pattern, stress placement, stutter, line split, emotional shift, or ending. A protagonist audition must not feel like an antagonist audition with renamed emotions.

If the user asks for a new role but does not specify whether to keep the chosen line or voice, preserve those selections and rebuild everything else. Offer new lines or triggers only if the user requests them or if the retained choice cannot plausibly support the new role.

## Quality check

Before responding, verify silently:

- Stage 1 and Stage 2 were not collapsed unless the user preselected all required choices.
- Role options are meaningfully different.
- Dialogue sounds spoken and implies a scene partner.
- Voice triggers contain no more than three qualities.
- The final prompt is under 3,500 characters.
- The final prompt contains objective, obstacle, tactic, shift, subtext, reaction, silence, dialogue, voice direction, expressive delivery, subtle behavior, and an unresolved ending.
- The scene remains an audition rather than becoming a trailer, montage, action beat, or character showcase.
- Identity and costume are preserved.
- No extra explanation appears after the required output.
