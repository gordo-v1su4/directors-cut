# Worked example — "The Bamboo Ambush" (deconstructive wuxia short)

This is a complete worked example output for a deconstructive-mode wuxia ambush in a bamboo forest at dusk. It shows exactly what a finished output of this skill should look like end-to-end.

Use this as a reference when in doubt about what level of detail the prompts need. If your output looks substantially thinner than this, push more specificity into the prompts (verbatim labels, robe and weapon descriptors, dialogue and weapon-SFX in quotes, mode-appropriate camera vocabulary, atmospheric load in every deconstructive frame).

---

# The Bamboo Ambush — Wuxia Storyboard & Video Prompts

**Pipeline:** Story → Jianghu → Storyboard → Clip
**Storyboard model:** `gpt-image-2` · Size `1536x1024` · Quality `high`
**Video model:** `Seedance 2 (seedance-2.0)` · R2V mode · ~13 seconds · 16:9
**Directorial mode:** DECONSTRUCTIVE (Tsui Hark / The Blade register)
**Style:** Deconstructive wuxia production board with vérité bamboo-forest photography (mud-and-blood register)

## At a glance

- **Premise:** At dusk in a bamboo forest, a mud-spattered bandit ambushes an unsuspecting traveller; the strike happens just outside frame, and the bandit walks out as wind carries the sound of distant crows.
- **Format:** Single-sequence wuxia short
- **Combatants:** 2 (the Bandit, mid-30s, mud-spattered dao; the Traveller, late 20s, scholar's robe, unarmed), single jianghu location (bamboo forest at dusk, in storm)
- **Weapons:** mud-spattered dao (bandit) — the traveller is unarmed (this is part of the code violation)
- **Shots:** 8
- **Tone keywords:** Ambush, withheld clarity, survival, atmospheric load, dishonour, aftermath
- **Mode rationale:** Deconstructive because the source material describes an ambush of an unarmed unsuspecting traveller, with no face-off, no salute, the strike held outside frame, and a survival-not-honour outcome — all classical-code violations specific to the Tsui Hark *The Blade* register.

---

## Shared style anchor (paste into Prompt 1)

> Deconstructive wuxia production-board layout in the style of Tsui Hark's *The Blade* pre-production aesthetic — vérité, mud-and-blood-toned, deliberately stripped of genre polish. Header band in storm-grey (#3A3A36) with stencilled bone-white title (#E8DFCB), small bone-white sans-serif metadata, and a vermillion-red MODE DECLARATION chip in the top-right reading "DIRECTORIAL MODE: DECONSTRUCTIVE (TSUI HARK / THE BLADE REGISTER)". Bone-white-with-grime body background (#E8DFCB with subtle dirt/spatter texture) with thin 2px charcoal-black borders separating panels — borders deliberately slightly uneven, as if printed on a press that needs servicing. Panel headings in stencil-style sans-serif, charcoal black, with thin vermillion-red accent rules. Photographic content (set photo, combatant portraits, eight storyboard frames) shot in deconstructive wuxia photography style — handheld energy, hard low-key lighting, atmospheric load (wind/rain/dust/mud/smoke visible in nearly every frame), high contrast, deep blacks, mud and blood accents, foreground occlusion welcomed (bamboo, hanging cloth, crowds, animals), heavy film grain. Top-down choreography plan in stark charcoal-on-bone-white architectural-blueprint style with mud-tone fills. Camera position chips are bold black squares with bone-white sans-serif numbers. Combatant flow lines: dashed VERMILLION RED for attacker path, dashed STEEL BLUE for defender path. Path-of-blade arcs are thin BLOOD RED (#8B1A1A) curves rather than gold. Storyboard frame number badges are charcoal-black with bone-white numbers. Caption text inside panels is charcoal in a slightly weathered grotesque sans-serif. Palette swatches in the header are muted, mud-toned, deliberately unappealing — no jewel tones. Overall feel: vérité, raw, survivalist, atmospheric, fragmented — like a real production board for a film about the genre's collapse, not a celebration of it. No watermarks, no real brand logos, no decorative graphic flourishes, no glossy gradients, no jewel-tone calligraphy, no anachronistic items, no firearms.

---

## Prompt 1 — GPT Image 2 wuxia storyboard sheet

Paste this into GPT Image 2 at size `1536x1024`, quality `high`.

```
Create a wuxia production board / pre-production planning sheet titled "THE BAMBOO AMBUSH" — a director's visual planning guide for a single-sequence wuxia short in the deconstructive Tsui Hark / The Blade tradition.

Render a verbatim MODE DECLARATION chip in the top-right of the header bar, white sans-serif on vermillion red, reading exactly: "DIRECTORIAL MODE: DECONSTRUCTIVE (TSUI HARK / THE BLADE REGISTER)".

Canvas: landscape 16:9, three horizontal tiers separated by thin charcoal-black dividers. TOP BAND: storm-grey (#3A3A36) header bar running full width, ~10% of canvas height, holding the project title in stencilled bone-white type and six metadata blocks across, including the MODE DECLARATION in the top-right. TIER 1 (~30% of height): two side-by-side panels — left panel "COMBATANT + WEAPON REFERENCE" with two combatant rows, right panel "ENVIRONMENT & CHOREOGRAPHY PLAN" with a location photo and a top-down choreography plan. TIER 2 (~28% of height): one wide panel "STORYBOARD (8 SHOTS)" with eight equal-width storyboard frames in a single horizontal strip. TIER 3 (~22% of height): four side-by-side panels — "LIGHT & MOOD", "MOTIFS & KEYWORDS", "AUDIO / SCORE", "CINEMATOGRAPHY NOTES". Bone-white-with-grime body background (#E8DFCB) with thin 2px charcoal-black borders, deliberately slightly uneven.

HEADER BAR contents, left to right: "PROJECT TITLE:" label above "THE BAMBOO AMBUSH" (large stencilled bone-white) and "A WUXIA SHORT" (small bone-white). "FORMAT: SINGLE-SEQUENCE WUXIA" / "REGISTER: DECONSTRUCTIVE" / "DURATION: ~13 SECONDS" stacked metadata. "COMBATANT CONSTRAINTS" block with three icon+text rows: "⚔ 2 COMBATANTS" / "🗡 1 DAO (BANDIT) / UNARMED (TRAVELLER)" / "🏯 BAMBOO FOREST AT DUSK". "PALETTE:" label above five colour swatches: mud brown, storm grey, bone white, blood red, charcoal — muted, deliberately unappealing. "PREMISE:" label above two short sentences reading exactly: "At dusk in a bamboo forest, a mud-spattered bandit ambushes an unarmed traveller. The strike happens just outside frame; the bandit walks out as wind carries distant crows." TOP-RIGHT: the MODE DECLARATION chip from above.

LEFT PANEL "COMBATANT + WEAPON REFERENCE":
COMBATANT ROW for "THE BANDIT" "(LAWLESS, MID-30S)": three trait bullets "• mid-30s, broad build, weather-worn" / "• no school, no oath, lawless" / "• mud-spattered dark robe, leather wrap fraying". Five photo cells: "FRONT" / "BACK" / "SIDE" / "FIGHTING STANCE (DAO DRAWN)" / "DECISIVE-MOMENT CLOSE". Below the row, "WARDROBE / WEAPON / ACCESSORIES" caption with flat-lays: dark outer robe (mud-spattered), dark inner robe, leather sash, worn boots, weapon close-up of the dao (single-edged curved sabre, leather wrap dark with old blood, plain hilt, no pommel jewel).
COMBATANT ROW for "THE TRAVELLER" "(UNARMED SCHOLAR, LATE 20S)": three trait bullets "• late 20s, slight build, pale" / "• scholar register, unarmed" / "• plain pale-grey robe, satchel". Five photo cells in the same five poses (FIGHTING STANCE for an unarmed combatant: defensive guard, hands open). Wardrobe row: pale-grey outer robe, plain inner robe, satchel with scrolls, sandals, no weapon.

RIGHT PANEL "ENVIRONMENT & CHOREOGRAPHY PLAN":
LEFT SUB-PANEL "BAMBOO FOREST AT DUSK, IN STORM": single landscape photograph of dense bamboo at dusk in storm — vertical bamboo, low light, wind visible in canopy, mud at the roots, mist in the middle distance, deep shadow. Aspect roughly 4:3. Photographic style: deconstructive wuxia.
RIGHT SUB-PANEL "TOP-DOWN CHOREOGRAPHY & CAMERA PLAN": top-down floorplan of the bamboo grove in stark charcoal-on-bone-white architectural style with mud-tone fills, showing bamboo clusters from above, a winding mud path, eight numbered camera position chips (bold black squares with bone-white numbers 1-8), dashed VERMILLION RED line showing the bandit's attacker path approaching from the south, dashed STEEL BLUE line showing the traveller's defender path along the path heading north, thin BLOOD RED arc showing path-of-blade at shot 3. Vertical legend on the right side reading: "1  LONG-LENS THROUGH BAMBOO" / "2  HANDHELD, LATE REFRAME" / "3  VIOLENCE WITHHELD" / "4  OBSCURED MID-SHOT" / "5  LATERAL ATTENTION SHIFT (CROW)" / "6  FRAME-FILLING WEATHER" / "7  OPERATOR-VISIBLE REFRAME" / "8  AFTERMATH, NOT CLOSER" / "[dashed red] ATTACKER PATH" / "[dashed blue] DEFENDER PATH" / "[blood red arc] PATH OF BLADE".

STORYBOARD (8 SHOTS) panel: a single horizontal strip of exactly eight equal-width storyboard frames, no gaps wider than 4px between frames. For each frame, a small charcoal-black badge in the top-left corner with the bone-white number, the frame image (~16:9 inside the cell) photographed in deconstructive wuxia style — handheld energy, hard low-key light, heavy atmospheric load (wind/rain/dust/mud visible in nearly every frame), high contrast, foreground occlusion welcomed.

Frame 1: lens "200mm long-lens", size "WIDE THROUGH OBSTRUCTION", movement "HANDHELD, PEEKING THROUGH FOREGROUND BAMBOO". Action: "The Bandit (mud-spattered dark robe, dao at side, leather wrap dark with blood) approaches from south through bamboo. Foreground bamboo cuts the sightline. Wind in the canopy." Sound: "bamboo creak, wind, distant crow".

Frame 2: lens "18mm wide", size "CLOSE", movement "HANDHELD, LATE REFRAME". Action: "The Traveller (pale-grey robe, satchel, unarmed) walks the mud path, unaware. Operator finds the Traveller already turning, a beat too late." Sound: "footfall in mud, wind".

Frame 3: lens "50mm", size "WIDE — VIOLENCE OBSCURED", movement "HANDHELD, FOREGROUND BAMBOO IN FRAME". Action: "The Bandit (dark robe, dao raised) strikes — but the strike happens just outside frame; only the Traveller's body falling into shot is visible. Mud splash on the ground." Sound: "wet impact, off-screen; blade clatter; rain hiss".

Frame 4: lens "85mm", size "MID-SHOT — OBSCURED", movement "HANDHELD, FOREGROUND BAMBOO CLUMP CUTTING SIGHTLINE". Action: "Combat continues but a foreground clump of bamboo cuts the sightline. Wind raked through dust. The Bandit (dark robe, dao) seen only in fragments." (No dialogue.)

Frame 5: lens "200mm long-lens", size "INSERT — LATERAL", movement "CAMERA LOOKS AWAY MID-ACTION TO CROW". Action: "Camera looks away to a watching crow on a bamboo branch mid-strike. Distant rain through the canopy." Sound: "wet impact off-screen, crow caw".

Frame 6: lens "24mm wide", size "WIDE — FRAME-FILLING WEATHER", movement "HANDHELD, MIST AND WIND DOMINATE". Action: "Mist and wind dominate the frame; the Bandit (mud-spattered, dao) is glimpsed within it, walking forward toward the body." Sound: "wind sustained, rain hiss".

Frame 7: lens "100mm macro", size "INSERT — CLOSE ON DAO", movement "HESITANT ZOOM IN, OPERATOR-VISIBLE LATE REFRAME". Action: "Hesitant zoom on the dao, blood-flecked, dripping. Lens reframes a beat late. No combatant face visible." (No dialogue.)

Frame 8: lens "35mm", size "WIDE — AFTERMATH", movement "HANDHELD, HOLD ON EMPTY FRAME". Action: "The Bandit walks out of frame to the south. The camera holds on the bamboo grove emptied of figures, the Traveller's body in the mud at the bottom of frame." Sound: "wind, distant crow, no music".

Wardrobe + weapon consistency note: in every frame where the Bandit appears, repeat "(mud-spattered dark robe, dao)"; in every frame where the Traveller appears, repeat "(pale-grey robe, unarmed)".

PANEL "LIGHT & MOOD": four small thumbnail photos in a row with arrows: "STORM-GREY KEY (overcast dusk light through canopy)" / "PRACTICAL LANTERN ABSENT (no warm light source — the scene is grim)" / "WEATHER LAYER (rain hiss, mist, wind in cloth)" / "HIGH CONTRAST + DEEP BLACKS (mud and blood accents in shadow)".

PANEL "MOTIFS & KEYWORDS": four icon+label pairs in a 2x2 grid: "[ambush icon] AMBUSH" / "[blade icon] WITHHELD CLARITY" / "[footprint icon] SURVIVAL" / "[crow icon] AFTERMATH".

PANEL "AUDIO / SCORE": three labeled sub-blocks. "AMBIENT:" / "Bamboo creak, sustained wind, rain hiss, footfall in mud, distant crow." "SCORE:" / "Score absent for the body of the sequence. Single low pipa note at shot 7 (the dao close)." (with a small audio waveform graphic). "WEAPON SFX:" / "Wet impact at shot 3 (off-screen), blade clatter at shot 3, blood drip at shot 7. No steel ring — the strike does not register classically."

PANEL "CINEMATOGRAPHY NOTES": four labeled sub-blocks. "LENS CHOICE:" / "200mm long-lens for peeking shots (1, 5, 7), 18mm/24mm handheld wide for close-quarters (2, 6), 50mm-85mm for late reframes (3, 4), 35mm for the aftermath (8)." "MOVEMENT STYLE:" / "Handheld and long-lens alternation. Late reframes, hesitant zoom, lateral attention shift to the crow. No tripod, no dolly, no crane." "FRAMING PRINCIPLE:" / "Withheld clarity — violence outside frame (3), obscured (4, 6), or smeared (7). Foreground occlusion in 1, 4, 5. The act reconstructed from sound and aftermath." "POST-PROCESS:" / "Cold high-contrast grade, deep blacks, mud and blood accents, weather layer (rain/wind/dust) baked in throughout, heavy film grain." (with a small camera body graphic).

[Apply shared style anchor.]

Quality: high. Text must render verbatim as specified. Size: 1536x1024.

No watermarks, no extra labels, no real brand logos, no real production-company names, no anachronistic items (no firearms, no modern uniforms, no contemporary architecture, no modern lighting fixtures, no wristwatches, no eyeglasses), no text outside the specified verbatim labels. All combatant names, weapon names, dialogue, sounds, and panel headings render exactly as quoted. The eight storyboard frames are equal-width and in the specified order; do not merge, drop, or reorder them. The MODE DECLARATION in the top-right of the header renders verbatim.
```

**If the stencilled title comes back garbled,** bump to `2560x1440`.
**If the MODE DECLARATION chip is missing,** use `images.edit` with `input_fidelity: "high"` to add it back: "keep everything; add a vermillion-red chip in the top-right of the header reading exactly 'DIRECTORIAL MODE: DECONSTRUCTIVE (TSUI HARK / THE BLADE REGISTER)' in white sans-serif".
**If the dao type drifts to a jian (straight sword) in any frame,** regenerate with a stronger weapon close-up in the bandit's wardrobe row.

---

## Prompt 2 — Seedance 2 R2V wuxia video

Once the storyboard image is generated, paste this prompt into Seedance 2 with the storyboard image attached as the **first reference asset (@Image 1)**. Strongly recommended: also attach a dedicated weapon close-up of the dao as @Image 2 — the curved blade is distinctive and benefits from a dedicated reference.

- @Image 1: the storyboard sheet (required)
- @Image 2: dedicated dao close-up — preserve curved blade length, leather wrap dark with old blood, plain hilt (recommended)
- @Image 3: optional bamboo-forest-at-dusk-in-storm location reference

```
Refer to the wuxia storyboard sheet in @Image 1. Follow the shot order, shot sizes, camera movement, combatant positions, weapon trajectories, and visual style shown in the storyboard.

Render in DECONSTRUCTIVE wuxia register (Tsui Hark / The Blade) as specified on the storyboard's MODE DECLARATION.

The dao close-up is from @Image 2 — preserve curved blade length, leather wrap dark with old blood, plain hilt.

Story: At dusk in a bamboo forest in storm, a mud-spattered bandit ambushes an unarmed traveller; the strike happens just outside frame; the bandit walks out as wind carries distant crows.

Shot list (follow in order, each shot ~1.5-2 seconds):
  1. Long-lens through bamboo — Bandit (mud-spattered dark robe, dao) approaches from south. Foreground bamboo cuts the sightline. Sound: "bamboo creak, wind, distant crow".
  2. Handheld close, late reframe — Traveller (pale-grey robe, unarmed) walks the mud path. Sound: "footfall in mud, wind".
  3. Wide, violence withheld — Bandit strikes outside frame; only the Traveller's body falling into shot is visible. Sound: "wet impact, off-screen; blade clatter; rain hiss".
  4. Mid-shot, obscured — combat continues, foreground bamboo cuts the sightline.
  5. Long-lens insert — camera looks away to a watching crow mid-strike. Sound: "wet impact off-screen, crow caw".
  6. Wide, frame-filling weather — mist and wind dominate; Bandit glimpsed within it.
  7. Macro insert — hesitant zoom on the dao, blood-flecked, dripping. No dialogue.
  8. Wide aftermath — Bandit walks out of frame; camera holds on emptied bamboo grove, Traveller's body in mud. Sound: "wind, distant crow, no music".

Camera: handheld and long-lens (200mm) alternation. Late reframes, hesitant zoom, lateral attention shift. Match storyboard's lens choices. Foreground occlusion welcomed (bamboo). Violence withheld — outside frame, obscured, or smeared. No camera gear visible. Duration: ~13 seconds total.

Audio: ambient bamboo creak, sustained wind, rain hiss, footfall in mud, distant crow throughout. Score absent except a single low pipa note at shot 7. Weapon SFX: wet impact at shot 3, blade clatter at shot 3, blood drip at shot 7 — no steel ring. Silence treatment: weather audio continuous, no sustained score.

Style: cold high-contrast cinematic grade with deep blacks, mud and blood accents, heavy weather layer (rain/wind/dust/mud baked in), heavy grain — the same look as the storyboard sheet's MODE: DECONSTRUCTIVE (TSUI HARK / THE BLADE REGISTER). Handheld energy, withheld clarity, foreground occlusion in most frames. No anachronisms — pre-modern wuxia register only.
```

That's ~215 words including formatting — within the 220-word target.

**Settings:** Aspect 16:9, duration 13 seconds, resolution 720p, audio enabled.

---

## Generation notes

- **The two prompts are coupled.** Match the dao references, the weapon SFX, and the dialogue (or its absence — this clip is largely silent except for environmental and weapon sound) word-for-word between Prompt 1 and Prompt 2.
- **Mode commitment.** Both prompts state DECONSTRUCTIVE in writing. If the clip "rescues" itself toward a cleaner classical look, the storyboard's body went too cream and not mud-toned enough — regenerate the storyboard with stronger atmospheric load and dirtier palette swatches.
- **Run the storyboard first.** Don't try to generate the video before the storyboard image exists.
- **Generate a dedicated dao close-up as @Image 2.** Wuxia weapon drift is the most common failure mode; a curved dao becoming a straight jian is a mode-breaking error. The dedicated reference fixes this reliably.
- **Iteration beats re-rolling.**
  - For the storyboard: `images.edit` with `input_fidelity: "high"` and single-change instructions. The mode chip, the weapon type, and individual frame captions are the most common targets.
  - For the video: regenerate with a more specific dialogue/SFX/camera line for the off shot; keep the storyboard as @Image 1.
- **Combatant drift across frames.** If the Bandit's robe colour drifts between frames (mud-spattered vs clean), or the Traveller picks up a weapon they shouldn't have, regenerate with stronger wardrobe + weapon descriptors.
- **If Seedance ignores the layout** and animates the production-board sheet itself, the "Refer to the wuxia storyboard sheet in @Image 1..." opener was weakened. Restore it verbatim.
- **The withheld strike at shot 3.** This is the load-bearing deconstructive moment. If Seedance shows the strike instead of withholding it, regenerate that shot with stronger language: "the strike is NOT visible in frame; only the Traveller's body falling into shot, the wet impact heard off-screen".
- **No anachronisms.** A modern hat, a glass lens, a wristwatch — if any slips through, use `images.edit` to remove.
