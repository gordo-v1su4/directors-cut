---
title: Cold Open Prep Agent Instructions
project: directors-cut
status: ready-for-project-inputs
created: 2026-07-13
workflow:
  - character-auditions
  - environment-sheets
platform: Jimeng / Seedance 2.0
---

# Cold Open Prep — Character Auditions and Environment Sheets

## Mission

Prepare casting and location-reference assets for the trailer cold open in two phases:

1. Produce one or two Seedance audition videos per character.
2. Produce a multi-panel environment reference sheet for every main cold-open location.

Run all video generations in Jimeng / Seedance 2.0 through the in-app browser or the available native browser automation. The user handles login; the agent drives the interface after login is confirmed.

Platform: <https://higgsfield.ai>

## Project inputs — complete before execution

Do not begin generation until this section is filled in or the required information can be established unambiguously from project materials.

### Characters and reference images

| Character | Reference image or sheet | Notes |
| --- | --- | --- |
| `[Main character]` | `path/to/reference.png` | `[Age, role, or identity-lock notes]` |
| `[Character 2]` | `path/to/reference.png` | `[Notes]` |

### Ordered cold-open beats

1. `[Opening beat]`
2. `[Next beat]`
3. `[Continue as needed]`

### Visual defaults

- Visual tone: `[Example: nostalgic video-store comedy, Pacific Northwest fall]`
- Era: `[Present day, late 1990s, hybrid, etc.]`
- Default aspect ratio: `16:9`
- Default audition duration: `12 seconds`
- Regional or seasonal look: `[If applicable]`
- Other continuity constraints: `[Signage, wardrobe, palette, props, etc.]`

## Required reading

Read these sources before preparing prompts or generating assets.

| Purpose | Repository path |
| --- | --- |
| Audition prompt workflow | `skillset/seedance-audition-skill.md` |
| Character-sheet layout, if sheets are needed | `skillset/cinematic_photoreal_character_sheet_skill.md` |
| Character-sheet layout reference | `skillset/character=sheet-layout-simple.png` |
| Location/place YAML template | `skillset/imported-skills/related-local/visual-storyline-pipeline-gordo/references/place_template.yaml` |
| Seedance `@` syntax and constraints | `skillset/imported-skills/global-agents/seedance-prompt-en/SKILL.md` |
| Cold-open trailer context | `skillset/00-seedance-cinematic-trailer/SKILL.md` |

> Repository note: the current character-sheet reference filename is `character=sheet-layout-simple.png`. Verify the path before execution if that asset is renamed.

Also inspect the project bible, screenplay, storyboard, trailer brief, and other relevant story materials in the repository. Use them to identify additional characters, locations, and continuity requirements.

## Operating rules

### Required

- Use Jimeng / Seedance 2.0 for every video generation.
- Prefer the in-app browser when available; otherwise use the approved native browser automation.
- Wait for explicit user confirmation that the Jimeng session is logged in before submitting a generation.
- Use `Seedance Fast` or the equivalent fast-tier model label.
- Use `Unlimited` quota/billing mode for free, slower-queue generations.
- Confirm `Fast` and `Unlimited` in a snapshot or screenshot before every submission.
- Use multimodal mode whenever a character reference exists.
- Use the character sheet or approved portrait as `@Image1` for identity lock.
- Record each submission and its review result in `output/manifest.md`.

### Prohibited unless the user explicitly overrides

- Do not use xskill MCP.
- Do not use API shortcuts for generation.
- Do not spend paid fast credits.
- Do not switch away from `Unlimited` to shorten the queue.
- Do not submit a generation while logged out.
- Do not poll more frequently than the schedule below.

## Browser workflow for every Seedance video

### Before submission

1. Open <https://higgsfield.ai> in the in-app browser or approved native browser.
2. If login has not already been confirmed during the current session, pause and ask the user to log in.
3. Wait for the user to confirm that login is complete.
4. Navigate to Seedance 2.0 video generation.
5. Select `Seedance Fast` or the current equivalent fast-tier label.
6. Select `Unlimited` quota/billing mode.
7. Capture a snapshot or screenshot that visibly confirms both settings.
8. When reference images exist, enable multimodal mode and attach them using the prompt's declared `@Image` mapping.
9. Set the requested duration and aspect ratio.
10. Paste the complete prompt and perform a final prompt/reference check.
11. Click **Generate**.
12. Immediately record the submission time and settings in `output/manifest.md`.

### Generation polling

| Checkpoint | Action |
| --- | --- |
| Immediately after submission | Record the job start time. Do not poll for 15–20 minutes. |
| First poll | At approximately 15–20 minutes, refresh or open generation history and check once. |
| Still processing | Poll once every 5 minutes; never more frequently. |
| Completed | Save the result immediately and log its filename, source URL when available, and completion timestamp. |
| Failed | Capture the error, record the settings, revise the prompt, and resubmit once. Escalate if the second attempt fails. |

Use the waiting period to prepare other prompts, location YAML, environment-sheet briefs, or manifest entries. Do not repeatedly refresh the generation UI.

## Phase 1 — Character audition tapes

### Goal

Produce one or two performance-focused audition clips per character. Test acting, voice, micro-expression, listening, and identity lock before generating the cold open itself.

### Character inventory

Before writing prompts:

1. Inventory every named cold-open character.
2. Locate the best available reference image or character sheet for each character.
3. Record missing or ambiguous references in the manifest.
4. Stop and ask the user if a named character has no usable reference image. Do not invent a definitive identity reference.

### Per-character workflow

#### A. Prepare the casting read

Read `skillset/seedance-audition-skill.md` and interpret the character as casting material. Address:

- Physical presence and apparent age range.
- Social status and emotional weight.
- Public mask versus private wound.
- Relationship to power.
- Performance qualities required by the cold open.

#### B. Build and select from the audition menu

Use autonomous batch mode for the audition skill's Stage 1:

1. Build the full Stage 1 menu:
   - Casting read.
   - Three to six role options.
   - Three dialogue lines.
   - Three voice triggers.
2. Select combinations for one or two auditions:
   - **Audition 1:** choose the role, line, and voice trigger that best fit the cold-open tone.
   - **Audition 2, preferred:** choose a meaningfully different role, line, or voice trigger that tests another performance quality.
3. Record the full menu and every selected combination in the character's prompt file and the master manifest.

Do not pause for user selection during normal Stage 1 batch work. Infer missing lore from the reference and cold-open context. Ask one concise question only when the missing fact would materially change the performance test.

#### C. Write the final audition prompt

Write one `FINAL SEEDANCE AUDITION PROMPT` per selected combination, following Stage 2 of `skillset/seedance-audition-skill.md`.

Each prompt must:

- Stay under 3,500 characters.
- Use a medium close-up or close-medium framing.
- Use a simple audition setting.
- Describe one continuous take.
- Lock identity to the supplied character reference.
- Direct listening, silence, subtext, and subtle facial and body behavior.
- Use exactly one vocal-expression device unless the audition skill explicitly requires otherwise.
- End with the required negative-direction block.
- Avoid trailer montage language, glamour posing, and unnecessary camera spectacle.

Save each prompt before generation:

```text
output/auditions/{character-slug}/prompts/audition-01.md
output/auditions/{character-slug}/prompts/audition-02.md
```

Each prompt file must include:

- Character name and reference path.
- Casting read.
- Full Stage 1 menu.
- Selected role, line, and voice trigger.
- Final generation prompt.
- Duration, aspect ratio, and reference mapping.

#### D. Generate the audition

For each final prompt:

1. Follow the mandatory browser workflow.
2. Attach the character reference as `@Image1`.
3. Paste the complete audition prompt.
4. Use `12 seconds` by default; use 10–15 seconds only when the line's pacing requires it.
5. Use `16:9` unless the project inputs specify another default.
6. Submit and follow the polling schedule.
7. Save the completed clip as:

```text
output/auditions/{character-slug}/audition-{01|02}-{role-slug}.mp4
```

#### E. Apply the review gate

Review each completed clip against all of the following:

- Face, costume, and apparent age match the reference without identity drift.
- The performance reads as a self-tape rather than a trailer or pose showcase.
- Dialogue is intelligible.
- Lip sync is acceptable.
- Skin retains natural texture and is not plastic or over-smoothed.
- Listening, silence, subtext, and micro-expression are visible.
- The clip tests the intended performance quality.

Record `PASS` or `FAIL` with concise evidence in the manifest. If the clip fails, revise it using the audition skill's role-reset rules and regenerate once. Escalate after a second failed generation for the same intended audition.

## Phase 2 — Cold-open environment sheets

### Goal

Create production-ready location reference sheets that lock geography, lighting, signage, palette, and art direction for storyboards and subsequent Seedance shots.

Environment sheets are the primary deliverable. Motion tests are optional and require user approval.

### Environment inventory

Start with these minimum locations, then add every other location found in the ordered cold-open beats or story materials.

| Location | Starting brief |
| --- | --- |
| Video Haven | Primary branded video destination or hub. Warm retail-media space, curated shelves, screen glow, nostalgic-meets-modern video culture, and readable, consistent brand signage. |
| Video Books | Hybrid bookstore/media shop with packed shelves, display tables, mixed fluorescent and window light, and a college-town commercial-strip feel. |
| Video rental store | Main character's workplace and most important interior. Late-1990s/early-2000s video-rental DNA updated for the show's present day. Show the counter, returns bin, aisle endcaps, and staff back room while keeping geography legible. |
| College campus | Quad, walkways, brick or modern campus architecture, and bulletin boards. Students may be implied through environmental traces but must not appear. Follow the project bible's regional look; use golden hour or overcast light when appropriate. |
| Additional cold-open locations | Include every other opening set piece, such as a parking lot, break room, campus media lab, or street outside the rental store. Base the list on the actual beats. |

If the cold-open beat list remains ambiguous after inspecting project materials, stop and ask the user only when the ambiguity would materially change the environment list.

### Place definition

Create one `place.yaml` per environment using:

```text
skillset/imported-skills/related-local/visual-storyline-pipeline-gordo/references/place_template.yaml
```

Define at least:

- Place type and narrative function.
- Architecture and spatial layout.
- Materials and surface wear.
- Era and regional character.
- Lighting and practical sources.
- Color palette and grade.
- Signature props and signage.
- Continuity requirements across angles.

Save each place definition as:

```text
output/environments/{location-slug}/place.yaml
```

### Environment-sheet specification

Create one cinematic-photoreal, `16:9` landscape contact sheet per location with:

| Panel | Required view |
| --- | --- |
| 1 | Wide establishing view: exterior or master interior. |
| 2 | Medium hero angle: the location's postcard view. |
| 3 | Alternate angle: approximately 90 degrees or reverse, sufficient to establish geography. |
| 4 | Detail insert: signage, shelving, period props, branded elements, or other continuity anchors. |
| 5 | Lighting/mood variant: the same space under a different time of day or practical-light setup. |
| Info card | Location name, interior/exterior, era, palette, key props, and one-sentence cold-open narrative function. |

Hard requirements:

- No people. Treat every panel as a clean background plate.
- Use one consistent color grade across the location's panels, except for the intentional lighting variant.
- Preserve architecture, prop placement, and geography across angles.
- Spell and render branded signage consistently in every panel.
- Use cinematic photorealism, not illustration.
- Make panel boundaries and the info card legible without allowing the sheet design to overpower the location imagery.

Save each completed sheet as:

```text
output/environments/{location-slug}/environment-sheet.png
```

### Environment prompt baseline

Build the final still-image prompt from the location's `place.yaml`. Use this only as a structural baseline; replace bracketed fields with specific project details:

```text
[place type and specific description],
[architectural style and spatial layout],
[materials and surface wear],
[lighting and practical sources],
[color palette and grade],
[signature props and exact signage],
cinematic photoreal environment reference,
16:9 landscape multi-panel contact sheet,
five views of one consistent location:
wide establishing, medium hero angle, reverse or 90-degree geography angle,
detail insert, and lighting mood variant,
clean background plates, no people,
consistent architecture, prop placement, signage, and color grade,
high detail, production design reference
```

Use still-image generation in the active Jimeng browser session unless the user directs otherwise.

### Optional establishing motion tests

Only produce motion tests if the user explicitly asks for them. If approved:

- Create one 4–6 second clip per selected location.
- Use a locked-off camera or slow push-in.
- Follow the mandatory Seedance browser workflow, including `Fast` and `Unlimited` confirmation.
- Save the clip as:

```text
output/environments/{location-slug}/establishing-test.mp4
```

## Output structure

```text
output/
├── auditions/
│   └── {character-slug}/
│       ├── audition-01-{role-slug}.mp4
│       ├── audition-02-{role-slug}.mp4
│       └── prompts/
│           ├── audition-01.md
│           └── audition-02.md
├── environments/
│   ├── video-haven/
│   │   ├── environment-sheet.png
│   │   └── place.yaml
│   ├── video-books/
│   │   ├── environment-sheet.png
│   │   └── place.yaml
│   ├── video-rental-store/
│   │   ├── environment-sheet.png
│   │   └── place.yaml
│   ├── college-campus/
│   │   ├── environment-sheet.png
│   │   └── place.yaml
│   └── {additional-location-slug}/
│       ├── environment-sheet.png
│       └── place.yaml
└── manifest.md
```

## Manifest requirements

Maintain `output/manifest.md` throughout execution rather than reconstructing it at the end.

### Audition entry template

```markdown
## Audition — [Character] / [01 or 02]

- Reference image: `path/to/reference.png`
- Role: [Selected role]
- Line: [Selected line]
- Voice trigger: [Selected voice trigger]
- Performance quality tested: [One sentence]
- Prompt: `output/auditions/.../prompts/audition-01.md`
- Model/speed confirmed: Seedance Fast — [yes/no]
- Quota mode confirmed: Unlimited — [yes/no]
- Submitted: [ISO 8601 timestamp]
- First polled: [ISO 8601 timestamp]
- Completed: [ISO 8601 timestamp]
- Source URL: [URL if available]
- Output: `output/auditions/.../audition-01-role.mp4`
- Review: [PASS/FAIL]
- Review notes: [Identity, performance, dialogue, lip sync, texture]
- Retry count: [0 or 1]
```

### Environment entry template

```markdown
## Environment — [Location]

- Narrative function: [One sentence]
- Place definition: `output/environments/.../place.yaml`
- Sheet: `output/environments/.../environment-sheet.png`
- Establishing motion test: [path or not requested]
- Grade: [Continuity description]
- Signage: [Exact approved spelling and treatment]
- Geography/continuity notes: [Key anchors]
- Review: [PASS/FAIL]
- Review notes: [Legibility, consistency, artifacts, required corrections]
```

## Execution order

1. Read every required skill and project-story source.
2. Complete the project inputs.
3. Inventory all cold-open characters and reference images; list gaps.
4. Inventory all cold-open environments and add locations found in story materials.
5. Prepare Stage 1 audition menus and final prompts.
6. Generate auditions one character at a time, respecting the polling schedule.
7. During audition queue waits, prepare place YAML files and environment-sheet prompts.
8. Generate and review all environment sheets.
9. Complete `output/manifest.md` and verify every referenced file exists.
10. Give the user a concise completion report covering passes, retakes, missing assets, and unresolved questions.

## Human checkpoints and escalation

Stop and ask the user when any of the following occurs:

- A named character has no usable reference image.
- Login expires, the session is logged out, or a captcha blocks automation.
- The same intended generation fails twice after one revision/resubmission.
- The cold-open beat list is ambiguous enough to materially change the environment list.
- The platform's `Fast` or `Unlimited` controls cannot be confidently identified after inspecting the UI. Capture a snapshot before asking.
- A requested action would spend paid credits or use a prohibited generation path.

Do not stop merely to request Stage 1 audition selections; use the autonomous selection rules above.

## Completion criteria

The mission is complete only when:

- [ ] Every listed character has at least one usable audition clip; two are preferred.
- [ ] Every listed cold-open environment has a reviewed multi-panel environment sheet.
- [ ] Every video was generated through Jimeng with `Seedance Fast` and `Unlimited` visibly confirmed.
- [ ] The initial 15–20 minute wait and subsequent 5-minute polling interval were respected.
- [ ] All identity, geography, lighting, signage, and prop-continuity checks pass or are clearly logged as requiring a retake.
- [ ] `output/manifest.md` contains paths, timings, settings, selections, and review notes for every deliverable.
- [ ] Every path recorded in the manifest exists.
- [ ] The final user report states what passed, what needs a retake, what is missing, and what questions remain.

