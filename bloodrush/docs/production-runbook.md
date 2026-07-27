# Blood Rush — Production Runbook

## Governing sources

1. `../../docs/cold-open-prep-agent-instructions.md`
2. `../../skillset/seedance-audition-skill.md`

This file supplies Blood Rush-specific canon and execution order. It does not replace the general identity, review, polling, or failure rules in the governing sources.

## Browser lanes

- Video: Higgsfield native in-app browser, `/ai/video`, using the dedicated account whose video composer visibly says `Unlimited` and `Generate Unlimited`
- Images: Higgsfield in Chrome, `/ai/image?model=nano-banana-pro`, using the separate account whose Nano Banana image composer visibly says `Unlimited`

Never cross the account or browser lanes. An `Unlimited` label in the wrong product is not sufficient evidence: videos must be confirmed in the native video composer, and images must be confirmed in the Chrome Nano Banana composer.

### Native-browser character upload

The native browser accepts a character sheet when the PNG itself is copied and pasted into the prompt composer. After paste, wait for the media thumbnail to finish verification and appear in the active asset row. The sole attached character sheet for an audition becomes `@Image 1`. Preloaded recent assets may be selected later, but attach only the current character to the current audition.

## Video settings

- Model: Enhanced Seedance 2.0 Fast
- Quota: Unlimited
- Elements: On
- Duration: 15 seconds
- Ratio: 16:9
- Resolution: 720p
- Bitrate: High

Submit one video job at a time. Record the submission timestamp. Do not check for 15–20 minutes. If it is still processing, check every five minutes. Download and review before starting the next character.

## Image settings

- Model: Nano Banana Pro
- Resolution: 2K
- Quota: Unlimited
- Aspect ratio: 16:9
- Batch: five to eight active submissions when the service permits it; stop when Higgsfield refuses another job

Campus visual canon: `location-visual-canon.md`. Campus seeds must read as a maintained private Catholic college in coastal California, never a public high school or neglected state institution. Deliver full-frame 16:9 2K images composed for a 2.39:1 extraction with a restrained 40mm anamorphic cinema-lens look and no baked letterbox bars.

Pause naturally between uploads and Generate clicks. Confirm that each upload is visibly accepted. Retry a transient CDN-processing failure once; do not repeat an explicit safety rejection.

Use the staged reference workflow in `docs/nano-banana-reference-workflow.md`:

1. Generate one full-frame canonical seed photograph.
2. Approve and re-upload that exact seed as a named environment reference.
3. Generate north/south/east/west or four-camera orientation views from the accepted seed.
4. Make targeted edits from the accepted reference instead of rebuilding the room.
5. Combine one approved character reference with one approved environment reference for a full-bleed 3x3 shot sequence.

Do not ask the initial text prompt to invent several independent panels of the same room. Do not use white canvas, info cards, captions, or decorative borders in continuity references. Open every result at full size and download it before review.

## Canonical character references

| Character | Path |
| --- | --- |
| Kai Santana | `assets/characters/kai-santana/kai-santana-character-sheet.png` |
| Mara Voss | `assets/characters/mara-voss/mara-voss-character-sheet.png` |
| Elias Mercer | `assets/characters/elias-mercer/elias-mercer-character-sheet.png` |
| Rowan Mercer | `assets/characters/rowan-mercer/rowan-mercer-character-sheet.png` |
| Lucian Vale | `assets/characters/lucian-vale/lucian-vale-character-sheet.png` |
| Malachi Jackson | `assets/characters/malachi-jackson/malachi-jackson-character-sheet.png` |
| Malik Vale | `assets/characters/malik-vale/malik-vale-character-sheet.png` |

## Audition order

1. Kai Santana
2. Mara Voss
3. Elias Mercer
4. Rowan Mercer
5. Lucian Vale
6. Malachi Jackson
7. Malik Vale

## Image work during video waits

1. Video Haven interior
2. campus bathroom
3. college quad/walkway
4. freshman classroom
5. dorm/off-campus party

## Review gates

### Audition

- identity, age, hair, skin tone, build, costume, and accessories match the canonical sheet
- ordinary 2003 student appearance unless a vampire reveal is motivated
- dialogue is intelligible and lip sync is usable as a future voice reference
- performance includes listening, subtext, silence, and one meaningful emotional shift
- no plastic skin, trailer montage, posing, or uncontrolled supernatural spectacle

### Environment

- no people in the final plate
- geography is legible across views
- architecture, props, signage, and grade remain consistent
- all technology, products, furniture, and signage fit 2003
- campus locations read as a maintained, well-funded private Catholic college for adult students
- no high-school lockers, juvenile posters, undersized desks, graffiti, broken fixtures, water damage, filthy grout, or abandoned-building decay
- imagery reads as a photographed practical location with physically plausible materials, reflections, shadows, scale, and exposure
- 40mm anamorphic character is restrained and the 16:9 frame remains clean for a later 2.39:1 extraction; no baked black bars
- Video Haven uses exactly `VIDEO HAVEN` on its canonical neon sign

### Continuity clip

- every asset role is declared at the beginning of the prompt
- character sheet controls face/body/costume
- audition video controls voice/performance
- environment plate controls location/lighting
- previous clip controls immediate temporal and spatial continuity
