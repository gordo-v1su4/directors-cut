# GPT Image 2 wuxia storyboard prompt structure

Every wuxia storyboard prompt this skill generates follows the same 11-part structure. The structure is adapted from the standard cinematic production-board pattern for the wuxia register, with one critical addition: a verbatim **mode declaration** that appears on the board itself, naming whether the sheet drives a Classical (King Hu) or Deconstructive (Tsui Hark *The Blade*) clip — or a Hinge between them.

## Why this structure

A wuxia production board is fundamentally a **text-dense, multi-zone infographic** with embedded photographic content and a clear directorial register. GPT Image 2's training data has good coverage of pre-production planning sheets and reasonable coverage of wuxia film stills, but it will not reliably reproduce the layout — and will average classical and deconstructive cues into a generic martial-arts collage — unless the prompt names every zone, every label, every photographic insert, and the mode itself, explicitly.

The structure below is the minimum specification that holds the layout AND the mode commitment together. Skipping any section makes the board drift toward a generic "wuxia movie poster" or "kung fu comic strip" look.

## The 11 parts

### 1. Deliverable label

Open with what the image *is*, in language GPT Image 2 recognises:

```
Create a wuxia production board / pre-production planning sheet titled "[PROJECT TITLE]" — a director's visual planning guide for a [format, e.g. "single-sequence wuxia short"] in the [register, e.g. "deconstructive Tsui Hark The Blade"] tradition.
```

Do NOT open with "an artistic illustration of a wuxia planning board" or "a beautiful storyboard". The artifact-spec framing is what triggers the dense-layout mode in GPT Image 2; artistic framing degrades label rendering and the board comes back as a moody collage.

### 2. Mode declaration (on the board itself)

This is the critical wuxia-specific addition. Name the directorial mode in writing on the board, top-right of the header. The exact text appears on the rendered image:

```
MODE DECLARATION (top-right of header bar, white sans-serif on dark navy or red on bone-white depending on style):
"DIRECTORIAL MODE: CLASSICAL (KING HU REGISTER)"
or
"DIRECTORIAL MODE: DECONSTRUCTIVE (TSUI HARK / THE BLADE REGISTER)"
or
"DIRECTORIAL MODE: HINGE — OPENS CLASSICAL, BREAKS AT SHOT [N]"
```

This declaration is load-bearing for two reasons: (a) it forces the prompt-author to commit, and (b) when the board is later passed to Seedance 2 as @Image 1, the on-image mode text gives Seedance an additional cue beyond the visual register. Mode-declared boards produce mode-coherent clips.

### 3. Canvas directive

State the overall layout immediately. The exact wording differs slightly between classical and deconstructive style anchors (see those references), but the structural skeleton is the same:

```
Canvas: landscape 16:9, three horizontal tiers separated by thin [gold / red / ink-black] dividers.
TOP BAND: [classical: ink-on-rice-paper header band with calligraphic title; deconstructive:
mud-toned header band with stencilled title] running full width, ~10% of canvas height,
holding the project title and six metadata blocks across, including the MODE DECLARATION
in the top-right.
TIER 1 (~30% of height): two side-by-side panels — left panel "COMBATANT + WEAPON
REFERENCE" with two combatant rows, right panel "ENVIRONMENT & CHOREOGRAPHY PLAN"
with a location photo and a top-down choreography plan.
TIER 2 (~28% of height): one wide panel "STORYBOARD (8 SHOTS)" with eight equal-width
storyboard frames in a single horizontal strip.
TIER 3 (~22% of height): four side-by-side panels — "LIGHT & MOOD", "MOTIFS &
KEYWORDS", "AUDIO / SCORE", "CINEMATOGRAPHY NOTES".
[Body background and panel borders per the chosen style anchor.]
```

Be this specific. Vague layout directives are the #1 reason these boards come back looking wrong.

### 4. Header bar contents

Verbatim, in this order across the header:

```
HEADER BAR contents, left to right:
- "PROJECT TITLE:" label (small caps) above "[TITLE]" (large calligraphic-style title)
  and "[SUBTITLE]" (small, e.g. "A WUXIA SHORT")
- "FORMAT:" / "REGISTER:" / "DURATION:" stacked metadata block, e.g.
  "FORMAT: SINGLE-SEQUENCE WUXIA" / "REGISTER: DECONSTRUCTIVE" / "DURATION: ~12-15 SECONDS"
- "COMBATANT CONSTRAINTS" block with three icon+text rows:
  "⚔ [N] COMBATANTS" / "🗡 [WEAPON LIST]" / "🏯 [JIANGHU LOCATION]"
- "PALETTE:" label above five colour swatches in a row (mode-appropriate)
- "PREMISE:" label above two short sentences describing the premise and tonal note
- TOP-RIGHT: the MODE DECLARATION from section 2, set in a contrasting chip
```

### 5. Combatant + weapon reference section (left panel of tier 1)

For each combatant (typically 2), one row containing:

```
COMBATANT ROW for "[NAME]" "([SCHOOL / LINEAGE], [AGE BAND])":
- Left column (~15% of row width): name in calligraphic style, three trait bullets
  ("• [age band, build]" / "• [school or lineage]" / "• [oath or grudge]" / "• [signature trait]")
- Five photo cells in a row showing the same combatant in:
  "FRONT" / "BACK" / "SIDE" / "FIGHTING STANCE (WEAPON DRAWN)" / "DECISIVE-MOMENT CLOSE"
  Each cell is a tight portrait, consistent lighting per mode (soft warm key for classical;
  hard low-key with weather for deconstructive), plain or in-set background, same robe and weapon
- Below the photo row, a thin "WARDROBE / WEAPON / ACCESSORIES" caption with 4-5 small
  flat-lay product photos: outer robe, inner robe, sash, footwear, weapon close-up
  ([JIAN / DAO / SPEAR / STAFF / PAIRED BLADES / WHIP / FLYING-CLAW]), and any signature
  accessory (mask, talisman, scroll, tally)
```

Repeat the row for each combatant. The multi-angle character grid + weapon close-up is what makes this look like a real wuxia character bible — without it, the board reads as a comic strip.

**Critical for combatant consistency:** describe each combatant's robe colour, hair, build, school, and signature weapon verbatim ("Master Bai, late 50s, white robes, grey topknot, straight *jian* with jade pommel" / "Disciple Yan, mid 20s, dark blue training robe, single braid, *dao* sabre with worn leather wrap") and repeat the key descriptors in each storyboard frame's action line later. Otherwise GPT Image 2 will subtly drift the combatant between frames — and crucially, will sometimes drift the *weapon type* (jian becoming dao, dao becoming spear), which is fatal to a wuxia clip.

### 6. Environment + choreography plan section (right panel of tier 1)

Two sub-panels side by side:

```
LEFT SUB-PANEL "[JIANGHU LOCATION]" (e.g. "BAMBOO FOREST AT DUSK", "TEMPLE STEPS AT DAWN",
"MARKETPLACE AT NOON", "REMOTE INN, NIGHT", "SNOWFIELD"):
A single landscape photograph of the set as a hero shot — practical or natural light per
mode, the key features clearly visible (vertical bamboo, stone steps, market stalls, lantern-lit
courtyard, snow drifts), shot from ~waist height. Aspect roughly 4:3.

RIGHT SUB-PANEL "TOP-DOWN CHOREOGRAPHY & CAMERA PLAN":
An architect's top-down floorplan of the same location in mode-appropriate tones
([classical: ink-wash on rice-paper cream; deconstructive: dark mud tones with bone-white
contrast]) showing terrain features from above. Overlaid on the floorplan:
- Eight numbered camera position chips (small dark navy squares with white numbers
  1-8 and small camera-icon arrows showing the lens direction)
- COMBATANT FLOW LINES: dashed RED for attacker path, dashed BLUE for defender path —
  showing where each combatant moves through the space
- "PATH OF BLADE" arcs: thin gold curves showing weapon trajectories at decisive moments
- A vertical legend on the right side of the panel listing each numbered camera
  position with its shot type, e.g.:
  "1  ESTABLISHING WIDE"
  "2  SALUTE / FACE-OFF"             (classical)
  or
  "1  LONG-LENS THROUGH BAMBOO"      (deconstructive)
  "2  HANDHELD, LATE REFRAME"        (deconstructive)
  ...
  "[dashed red] ATTACKER PATH"
  "[dashed blue] DEFENDER PATH"
  "[gold arc] PATH OF BLADE"
```

The combatant flow lines are wuxia-specific. They make the floorplan read as a real choreography plan rather than a generic camera diagram — the tradition of choreography boards in Hong Kong action cinema (Yuen Woo-ping, Sammo Hung) explicitly includes them.

### 7. Storyboard strip (tier 2)

This is the heart of the board. The strict 8-frame grid + per-frame mode-appropriate captioning is what makes it readable AND mode-coherent:

```
STORYBOARD (8 SHOTS) panel: a single horizontal strip of exactly eight equal-width
storyboard frames, no gaps wider than 4px between frames.

For each frame [N] from 1 to 8:
- A small dark navy badge in the top-left corner with the white number "[N]"
- The frame image itself (~16:9 inside the cell), photographed in the SAME mode-appropriate
  cinematic style as the set photo:
    classical → soft natural light, controlled atmosphere, clean silhouettes against background
    deconstructive → handheld energy, withheld clarity, atmospheric load (wind/rain/dust/mud/fire)
- Below the image, four short caption lines:
  "CAMERA / LENS    [LENS, e.g. 50mm — or 200mm long-lens for deconstructive peek]"
  "SHOT SIZE        [SIZE, e.g. WIDE / TWO-SHOT / CLOSE / INSERT]"
  "MOVEMENT         [MOVEMENT, classical: STATIC / DOLLY-IN / CRANE-UP;
                                deconstructive: HANDHELD / LATE REFRAME / HESITANT ZOOM]"
- A brief italic action description directly below, ~2 lines:
  "[ACTION DESCRIPTION naming the weapon and combatant in shot]. ['DIALOGUE in quotes' or
  'WEAPON SFX in quotes']. [ATMOSPHERIC/MODE NOTE]."
- (HINGE only) A small "MODE BREAK" chip on the shot where the break occurs, in a contrasting colour
```

For each of the 8 frames, write the action description **verbatim** in the prompt. Two example frames in each mode:

**Classical example frames:**

```
Frame 2: lens "50mm", size "TWO-SHOT", movement "STATIC TRIPOD, BOTH COMBATANTS BALANCED".
Action: "Master Bai (white robes, jian) and Disciple Yan (blue training robe, dao) face
each other across the temple courtyard. Salute exchanged, robes settle." Sound: "single
percussion strike, low".

Frame 6: lens "85mm", size "CLOSE", movement "SLOW DOLLY-IN MOTIVATED BY YAN'S LUNGE".
Action: 'Yan: "Master, forgive me" (resolved, low). Blade trajectory legible — the strike
registers cleanly.' Sound: "steel ring on steel, sustained".
```

**Deconstructive example frames:**

```
Frame 2: lens "200mm long-lens", size "WIDE THROUGH OBSTRUCTION",
movement "HANDHELD, PEEKING THROUGH FOREGROUND BAMBOO".
Action: "The bandit (mud-spattered dao) approaches the unsuspecting traveller.
Foreground bamboo cuts the sightline. Wind in the canopy." Sound: "bamboo creak,
wind, distant footfall".

Frame 5: lens "18mm wide", size "CLOSE — VIOLENCE OBSCURED", movement "HANDHELD, LATE
REFRAME". Action: "The strike happens just outside frame; only the body falling into
shot is visible. Mud splash on the ground." Sound: "wet impact, blade clatter, rain
hiss" (no dialogue).
```

**Wardrobe + weapon consistency note in each frame:** include a brief reminder of the combatant's robe and weapon in any frame where they appear, e.g. "Bai (white robes, jian)". This is the single biggest lever for stopping combatant-and-weapon drift across frames.

### 8. Lower panels (tier 3)

Four side-by-side panels with explicit contents, all mode-aware:

```
PANEL "LIGHT & MOOD":
Four small thumbnail photos in a row connected by small right-pointing arrows,
each with a caption beneath:
- "[STAGE 1, e.g. classical: GOLDEN-HOUR SIDELIGHT; deconstructive: STORM-GREY KEY] /
  [one-line description]"
- "[STAGE 2, e.g. classical: SOFT FILL; deconstructive: PRACTICAL LANTERN ONLY] /
  [one-line description]"
- "[STAGE 3, e.g. classical: COMPOSED ATMOSPHERIC HAZE; deconstructive: WEATHER LAYER
  (RAIN/DUST/SMOKE)] / [one-line description]"
- "[STAGE 4, e.g. classical: BALANCED CONTRAST; deconstructive: HIGH CONTRAST + DEEP
  BLACKS, MUD AND BLOOD ACCENTS] / [one-line description]"

PANEL "MOTIFS & KEYWORDS":
Four icon+label pairs in a 2x2 grid using simple line icons (mode-appropriate):
- [icon] "[MOTIF/KEYWORD 1, e.g. classical: SALUTE; deconstructive: AMBUSH]"
- [icon] "[MOTIF/KEYWORD 2, e.g. classical: HONOUR; deconstructive: SURVIVAL]"
- [icon] "[MOTIF/KEYWORD 3, e.g. classical: SILHOUETTE; deconstructive: WITHHELD CLARITY]"
- [icon] "[MOTIF/KEYWORD 4, e.g. classical: PHRASE; deconstructive: AFTERMATH]"

PANEL "AUDIO / SCORE":
Three labeled sub-blocks:
- "AMBIENT:" / "[description, e.g. classical: 'Bamboo creak, distant temple bell, breath';
  deconstructive: 'Rain on stone, wind, distant crowd, blade scrape']"
- "SCORE:" / "[description, e.g. classical: 'Solo erhu over guzheng; long silences punctuated
  by single percussion strikes'; deconstructive: 'Score interrupted, fragmented, or absent —
  weather audio fills the bed']"
  (with a small audio waveform graphic to the right)
- "WEAPON SFX:" / "[description, e.g. 'Steel ring sustained, blade whisper, fabric snap,
  foot scuff on stone']"

PANEL "CINEMATOGRAPHY NOTES":
Four labeled sub-blocks:
- "LENS CHOICE:" / "[mode-appropriate, e.g. classical: '24mm wide / 50mm two-shot /
  85mm decisive close'; deconstructive: '200mm long-lens / 18mm handheld wide /
  50mm late reframe']"
- "MOVEMENT STYLE:" / "[e.g. classical: 'Motivated movement only — every move has a
  named cause. Composed, silhouette-legible.'; deconstructive: 'Handheld and long-lens
  alternation. Late reframes, hesitant zooms, lateral attention shifts.']"
- "FRAMING PRINCIPLE:" / "[e.g. classical: 'Silhouette readable against background.
  Architecture exploited for symmetry.'; deconstructive: 'Withheld clarity. Foreground
  occlusion welcomed. Violence outside frame, obscured, or smeared.']"
- "POST-PROCESS:" / "[e.g. classical: 'Warm balanced grade, ink-wash atmospheric haze,
  crisp skin tones, slight grain.'; deconstructive: 'Cold high-contrast grade, deep blacks,
  mud and blood accents, heavy grain, weather layer baked in.']"
(with a small camera body graphic in the corner)
```

### 9. Style anchor reference

Close the body of the prompt with the placeholder:

```
[Apply shared style anchor.]
```

The output markdown file pastes the full anchor as a blockquote at the top so the user can prepend it to the prompt when running it. Don't inline the full anchor in every prompt — it makes the file harder to read. Use the classical-board style anchor for classical mode, the deconstructive-board style anchor for deconstructive mode, and for hinge sequences, use the classical anchor and add a note in the prompt that frames N+ adopt the deconstructive register named in the deconstructive anchor.

### 10. Quality directive

```
Quality: high. Text must render verbatim as specified. Size: 1536x1024 (or 2560x1440 if calligraphic title and label density runs high).
```

Always `high` for wuxia production boards. They are text-dense, weapon-dense, and (for classical mode) calligraphy-dense. `medium` causes the calligraphic title to garble, weapon names to drift between *jian* and *dao*, and combatant-flow line legends to lose their colour-coding.

### 11. Hard constraints

```
No watermarks, no extra labels, no real brand logos, no real production-company names,
no anachronistic items (no firearms, no modern uniforms, no contemporary architecture,
no modern lighting fixtures, no wristwatches, no eyeglasses), no text outside the
specified verbatim labels. All combatant names, weapon names, dialogue, sounds, and
panel headings render exactly as quoted. The eight storyboard frames are equal-width
and in the specified order; do not merge, drop, or reorder them. The MODE DECLARATION
in the top-right of the header renders verbatim.
```

The "no anachronisms" line is wuxia-specific and load-bearing — without it, GPT Image 2 will sometimes interpret "marketplace ambush" with a 19th-century or modern visual register, especially when the prompt says "vérité" or "documentary".

## Common failure modes and fixes

**The board doesn't commit to a mode — composed framing on some frames, vérité smear on others.** Section 2's mode declaration was vague or missing from the header. Fix by ensuring the verbatim mode text appears in the prompt for the top-right of the header, and the frame captions in section 7 use mode-appropriate camera vocabulary throughout.

**The eight-frame strip has the wrong number of frames.** Section 7 doesn't say "exactly eight" loudly enough, or section 11 doesn't pin the count. Fix by adding `exactly eight equal-width frames` in both sections.

**Combatant-and-weapon drift between storyboard frames.** Section 5 (combatant reference) describes robe and weapon but section 7 (frame-by-frame action) doesn't repeat them. Fix by adding a brief robe + weapon reminder in every frame's action line.

**Weapon type drifts (jian becoming dao, dao becoming spear).** Section 5 mentioned the weapon once but didn't describe it specifically (length, hilt, pommel, sheath). Fix by adding 1-2 distinguishing descriptors and repeating the weapon name in each frame.

**Classical board reads as deconstructive (or vice versa).** Section 8 (lower panels) used mode-mixed vocabulary. Fix by ensuring the LIGHT & MOOD, MOTIFS, AUDIO, and CINEMATOGRAPHY panels all use vocabulary from the same mode column in `directorial-modes.md`.

**Dialogue or weapon SFX is paraphrased or replaced with generic lines.** The lines weren't in double quotes, or the prompt opened with artistic framing in section 1. Fix both — quote every line and every named sound, and use the artifact-spec opener.

**Layout drifts away from the three-tier grid.** Section 3's canvas directive was too vague. Fix by stating the percentage heights of each tier and the exact panel-width ratios within each tier.

**Anachronisms creep in (a wristwatch, a modern hat, a glass window).** Section 11's hard constraints didn't list the specific anachronism. Fix by extending the no-anachronism list to cover the specific item that drifted.

**The combatant-flow lines on the floorplan are missing or uncoloured.** Section 6 didn't specify the dashed-red-and-blue flow lines clearly. Fix by saying "dashed RED for attacker path, dashed BLUE for defender path" explicitly, and adding the legend entries.

**The top-down floorplan is missing the gold weapon-trajectory arcs.** Section 6's "PATH OF BLADE" specification was weak. Fix by stating "thin gold curves showing weapon trajectories at decisive moments (typically shots 3, 6, and 7)" and noting which shots they correspond to.

## Full worked example

See `example-bamboo-ambush.md` for a complete reverse-engineered prompt that produces a deconstructive-mode board for a bamboo-forest ambush sequence.
