# GPT Image 2 anime e-conte storyboard prompt structure

Every e-conte storyboard prompt this skill generates follows the same 10-part structure. The structure is a hybrid of authentic Japanese e-conte conventions (numbered cut cells with timing/dialogue/action columns) and a Western production-board reference grid (multi-angle character turnaround sheet, top-down camera plan, lighting/mood/audio panels). This hybrid is what gives the downstream Seedance video both the shot-by-shot anime intent (from the e-conte strip) AND the rock-solid character/setting consistency (from the reference grid).

## Why this structure

A real anime e-conte sheet is sparse — black ink on white, sometimes coloured, with a ruled three-column layout (image / action / timing). A real Western production board is dense — header, character bible, location plates, mood panels. **Neither alone gives Seedance 2 enough to render anime well.** The e-conte alone leaves character design under-specified; the Western board alone has no anime visual register.

So we hybridise:
- The 8-cut strip is rendered as e-conte cells (authentic anime convention)
- The character grid is a turnaround sheet (anime character-design-document convention, called a *kyara-hyou* / 設定資料)
- The location plate is rendered as anime background art (anime *bijutsu* / *haikei* convention)
- The supporting panels (mood, audio, direction) borrow Western board conventions for clarity

The structure below is the minimum specification that holds the layout together. Skipping any section makes the board drift toward generic AI illustration.

## The 10 parts

### 1. Deliverable label

Open with what the image *is*, in language GPT Image 2 recognises:

```
Create an anime production board / hybrid e-conte planning sheet titled "[PROJECT TITLE]" (Japanese subtitle "[ROMAJI / KANA SUBTITLE]" if applicable) — an episode director's visual planning guide for a [format, e.g. "modern TV anime cut"] in the [register, e.g. "KyoAni-flavoured slice-of-life"] style.
```

Do NOT open with "an artistic anime illustration" or "a beautiful anime poster". The artifact-spec framing is what triggers the dense-layout mode in GPT Image 2; artistic framing degrades label rendering and the board comes back as a moody anime collage.

### 2. Canvas directive

State the overall layout immediately. **Two variants — pick one based on the chosen orientation in Step 5 of the workflow.**

**Landscape variant** (16:9, default for cinematic / TV / OVA):

```
Canvas: landscape 16:9, three horizontal tiers separated by thin coloured dividers in the register's accent colour.
TOP BAND: header bar in the register's primary colour running full width, ~10% of canvas height,
holding the project title in display type and five metadata blocks across.
TIER 1 (~30% of height): two side-by-side panels — left panel "CHARACTER REFERENCE / 設定" with
character turnaround rows, right panel "LOCATION / 背景" with a painted anime background-art plate
and a top-down camera plan.
TIER 2 (~28% of height): one wide panel "E-CONTE / 絵コンテ (8 CUTS)" with eight equal-width
e-conte cells in a single horizontal strip.
TIER 3 (~22% of height): four side-by-side panels — "LIGHTING / 照明", "MOOD / KEYWORDS",
"AUDIO / 音響", "DIRECTION / 演出 NOTES".
Body background and panel borders in the register's secondary palette as specified in the style anchor.
```

**Portrait variant** (9:16, for vertical / TikTok / Reels):

```
Canvas: portrait 9:16, four stacked tiers separated by thin coloured dividers in the register's accent colour.
TOP BAND: header bar in the register's primary colour running full width, ~7% of canvas height,
holding the project title in display type and four metadata blocks stacked.
TIER 1 (~22% of height): "CHARACTER REFERENCE / 設定" panel with character turnaround rows
arranged compactly.
TIER 2 (~14% of height): "LOCATION / 背景" panel with a painted anime background-art plate to the
left and a top-down camera plan to the right.
TIER 3 (~36% of height): "E-CONTE / 絵コンテ (8 CUTS)" panel with eight equal e-conte cells in a
4-by-2 grid (4 across, 2 rows down), read left-to-right then top-to-bottom.
TIER 4 (~21% of height): four small stacked sub-panels — "LIGHTING / 照明", "MOOD / KEYWORDS",
"AUDIO / 音響", "DIRECTION / 演出 NOTES".
Body background and panel borders in the register's secondary palette as specified in the style anchor.
```

**Square variant** (1:1, for Instagram feed AMVs): use the landscape structure but compress the tier 1 character grid to a single row of three angles (front, three-quarter, side) instead of five.

Be this specific. Vague layout directives are the #1 reason these boards come back looking wrong.

### 3. Header bar contents

Verbatim, in this order across the header (landscape) or stacked (portrait):

```
HEADER BAR contents:
- "PROJECT TITLE:" label (small caps, in the register's body text colour) above the project title
  in display type, all caps, plus a smaller Japanese subtitle in romaji or kana, e.g.
  "ROOFTOP CONFESSION" / "OKUJOU NO KOKUHAKU"
- "FORMAT:" / "GENRE:" / "EPISODE / CUT:" / "DURATION:" stacked metadata block, e.g.
  "FORMAT: TV ANIME CUT" / "GENRE: SLICE-OF-LIFE / ROMANCE" /
  "EPISODE / CUT: EP 7, CUTS 142-149" / "DURATION: ~14 SECONDS"
- "CONSTRAINTS" block with three icon+text rows:
  "□ [N] CUTS" / "👥 [N] CHARACTERS" / "🏠 [N] LOCATION ([NAME])"
- "COLOR PALETTE:" label above five color swatches in a row showing the project's
  signature colors as small rounded rectangles
- "SCENE CONTEXT:" label above two short sentences describing the premise,
  e.g. "[ONE-SENTENCE PREMISE]. [ONE-SENTENCE TONAL NOTE]."
```

Including the Japanese subtitle (kana or romaji) is optional but recommended — it gives GPT Image 2 a strong "this is anime" prior. Skip it if the project is explicitly meant to read as international/Western anime-style.

### 4. Character reference section (turnaround sheet)

For each character (typically 2), one row containing the anime equivalent of a character bible page:

```
CHARACTER ROW for "[CHARACTER NAME]" (Japanese name "[ROMAJI]" if applicable) "([MALE/FEMALE/NB])":
- Left column (~15% of row width): name in display type, archetype tag (e.g. "TYPE: KUUDERE"
  or "TYPE: GENKI"), three trait bullets ("• [age]" / "• [trait]" / "• [trait]"),
  and one signature-line bullet (e.g. "• SIGNATURE: long black hair, red ribbon")
- Five character-sheet cells in a row showing the same character drawn in the register's
  anime style (clean lineart for modern, painted for cel, etc.) in:
  "FRONT" / "THREE-QUARTER" / "SIDE" / "BACK" / "EXPRESSION SHEET"
  The expression sheet cell shows 4 small expression thumbnails — neutral, smile, surprise, key emotion
  Each cell drawn on a plain background, consistent character design, same wardrobe
- Below the row, a thin "WARDROBE / アイテム" caption with 4-5 small flat anime-style item
  callouts: uniform top, uniform skirt/trousers, signature accessory, school bag or weapon, signature prop
```

Repeat the row for each character. The five-angle turnaround grid is what makes this look like a real anime *kyara-hyou* — without it, the board reads as a comic strip.

**Critical for anime character consistency:** describe each character's hair colour, eye colour, hairstyle, and signature wardrobe element verbatim ("long straight black hair, red satin ribbon, large dark brown eyes, navy sailor uniform with red neckerchief" for Yuki) and repeat the key descriptors in each e-conte cell's action line later. Anime characters drift between frames much more aggressively than live-action characters drift in Western storyboards. The repetition is non-negotiable.

### 5. Environment / location section

Two sub-panels side by side (landscape) or stacked (portrait):

```
LEFT SUB-PANEL "LOCATION PLATE / 背景" (or whatever location):
A single landscape painted anime background-art plate of the location (in the register's
background-art style — soft brushwork for cel, clean digital paint for modern, photo-real
matte for atmospheric, dynamic perspective for shonen). The plate shows the key
elements (rooftop railing, sky, distant city, etc.) clearly visible, framed as a
typical anime location establishing shot. No characters in the plate.

RIGHT SUB-PANEL "TOP-DOWN MOVEMENT & CAMERA PLAN":
An overhead floorplan of the same location in soft tonal pencil-and-watercolour
anime-storyboard style with subtle drop shadows, showing key features from above.
Overlaid on the floorplan:
- Eight numbered camera position chips (small rounded squares in the register's accent
  colour with white numbers 1-8 and small camera-icon arrows showing the lens direction)
- Dashed coloured curved arrows showing "PATH OF ACTION / 動線" — the rough flow of
  where the camera moves through the scene
- A vertical legend on the right side of the panel listing each numbered camera
  position with its cut type, e.g.:
  "CUT 1  ESTABLISHING WIDE"
  "CUT 2  TWO-SHOT"
  "CUT 3  [CHARACTER A] CLOSE-UP"
  "CUT 4  [CHARACTER B] CLOSE-UP"
  "CUT 5  INSERT ([PROP / DETAIL])"
  "CUT 6  [TYPE]"
  "CUT 7  [TYPE]"
  "CUT 8  CLOSER"
  "[dashed accent] PATH OF ACTION / 動線"
```

The "anime *haikei* / background-art style" specification is critical — without it, GPT Image 2 renders a generic photo of the location, which then fights with the anime-rendered characters in the e-conte cells.

### 6. E-conte storyboard strip (the heart of the board)

This is the most important section. The strict 8-cell grid is what makes it readable as an e-conte rather than a moody illustration:

**Landscape:**
```
E-CONTE / 絵コンテ (8 CUTS) panel: a single horizontal strip of exactly eight equal-width
e-conte cells, no gaps wider than 4px between cells.
```

**Portrait:**
```
E-CONTE / 絵コンテ (8 CUTS) panel: a 4-by-2 grid of exactly eight equal e-conte cells
(4 across, 2 rows down), read left-to-right then top-to-bottom, no gaps wider than 4px.
```

**For each cell [N] from 1 to 8:**

```
- A small badge in the top-left corner of the cell in the register's accent colour
  with the white text "CUT [N]"
- The cell image itself (~16:9 inside the cell), drawn in the chosen anime register's
  style (clean digital lineart for modern TV, hand-painted with grain for cel, bold
  inked outlines for shonen, photo-real with anime characters for atmospheric),
  showing the action described
- Below the image (or to the right, in landscape): four short caption lines in a
  monospace or compressed sans-serif:
  "TIMING       [seconds, e.g. 1.5s]"
  "SHOT SIZE    [e.g. WIDE / MEDIUM / CLOSE-UP / INSERT]"
  "CAMERA       [e.g. STATIC / PAN / SLOW ZOOM / HANDHELD / IMPACT]"
  "SFX          [optional, e.g. WIND, FOOTSTEPS, IMPACT]"
- A brief italic action description directly below, ~2 lines:
  "[ACTION DESCRIPTION]. [DIALOGUE in quotes if applicable] ([TONE / EXPRESSION NOTE])"
```

For each of the 8 cells, write the action description **verbatim** in the prompt. Example:

```
Cut 1: timing "2.0s", size "WIDE", camera "STATIC", sfx "WIND, DISTANT TRAIN".
Action: "Empty rooftop at golden hour. Wind teases the chain-link fence."

Cut 2: timing "1.5s", size "MEDIUM TWO-SHOT", camera "STATIC", sfx "FOOTSTEPS".
Action: "Yuki (long black hair, red ribbon, navy sailor uniform) and Haruto
(short brown hair, gakuran) face each other at the railing."

Cut 3: timing "1.5s", size "CLOSE-UP", camera "SLOW ZOOM IN", sfx "—".
Action: 'Yuki: "ano, senpai..." (hesitant, pink across nose bridge)'

[... etc through Cut 8]
```

**Wardrobe and hair-colour reminder in each cell:** include a brief reminder of each character's hair and signature wardrobe in any cell where they appear, e.g. "Yuki (long black hair, red ribbon) lowers her gaze". This is the single biggest lever for stopping anime character drift across cells.

### 7. Lower panels

Four side-by-side panels (landscape) or four stacked sub-panels (portrait) with explicit contents:

```
PANEL "LIGHTING / 照明":
Four small thumbnail anime-style frames in a row connected by small right-pointing arrows,
each with a caption beneath:
- "[STAGE 1, e.g. GOLDEN HOUR] / [one-line description, e.g. low warm sun, long shadows]"
- "[STAGE 2, e.g. RIM LIGHT] / [one-line description, e.g. backlight on hair edges]"
- "[STAGE 3, e.g. KEY LIGHT] / [one-line description, e.g. soft front fill on faces]"
- "[STAGE 4, e.g. ATMOSPHERIC HAZE] / [one-line description, e.g. cherry blossom particles in the air]"

PANEL "MOOD / KEYWORDS":
Four to six icon+label pairs in a 2x2 or 2x3 grid using simple anime-style line icons:
- [emoji/icon] "[KEYWORD 1, e.g. KIRAKIRA / SPARKLE]"
- [emoji/icon] "[KEYWORD 2, e.g. SETSUNAI / WISTFUL]"
- [emoji/icon] "[KEYWORD 3, e.g. SEISHUN / YOUTH]"
- [emoji/icon] "[KEYWORD 4, e.g. KOKORO / HEART]"
(Japanese mood words give GPT Image 2 a stronger anime prior — include 1-2 if appropriate)

PANEL "AUDIO / 音響":
Four labeled sub-blocks:
- "AMBIENT:" / "[description, e.g. Distant city hum, train passing, wind through fence.]"
- "MUSIC:" / "[description, e.g. Soft piano + strings, KyoAni-flavoured slice-of-life bed.]"
  (with a small audio waveform graphic to the right)
- "DIALOGUE LANG:" / "[description, e.g. Japanese, soft conversational delivery.]"
- "SFX:" / "[description, e.g. Wind, footsteps, single fence-rattle on the impact frame.]"

PANEL "DIRECTION / 演出 NOTES":
Four labeled sub-blocks (with a small camera body or pencil-and-clapboard icon in the corner):
- "LENS ANALOGUE:" / "[list, e.g. wide (rooftop), medium (two-shot), close-up (faces), insert macro (hand on railing)]"
- "MOVEMENT STYLE:" / "[description, e.g. Mostly held frames with one slow zoom (Cut 3) and one slight pan (Cut 7). KyoAni-typical restraint.]"
- "VISUAL PHILOSOPHY:" / "[description, e.g. Quiet held beats. Let the wind and the silence do the work.]"
- "POST-PROCESS:" / "[description, e.g. Soft pastel grade, slight bloom on highlights, subtle film grain.]"
```

### 8. Style anchor reference

Close the body of the prompt with the placeholder:

```
[Apply shared anime style anchor.]
```

The output markdown file pastes the full anchor as a blockquote at the top so the user can prepend it to the prompt when running it. Don't inline the full anchor in every prompt — it makes the file harder to read.

### 9. Quality directive

```
Quality: high. Text must render verbatim as specified. Size: [chosen size from Step 5, e.g. 1536x1024 landscape, 1024x1536 portrait, 1024x1024 square] (or bump to 2K-class — 2560x1440 landscape, 1440x2560 portrait — if label density runs high).
```

Always `high` for production boards. They are by definition the most text-dense thing GPT Image 2 will be asked to produce in this skill, and `medium` causes the cut-number badges to garble and the timing values to drift.

### 10. Hard constraints

```
No watermarks, no extra labels, no real anime studio logos, no real anime character likenesses,
no real voice-actor names, no text outside the specified verbatim labels.
All character names, dialogue, panel headings, cut numbers, and timing values render exactly
as quoted. The eight e-conte cells are equal in size and in the specified order;
do not merge, drop, or reorder them. Do not add extra cells, do not collapse cells.
```

The "do not merge, drop, or reorder" line is critical — without it, GPT Image 2 will sometimes give you 6 or 9 cells instead of 8, or rearrange them, or merge two into a wider panel. This is even more common with anime-style prompts than with the original Western board.

## Common failure modes and fixes

**The eight-cell strip has the wrong number of cells.** Section 6 doesn't say "exactly eight" loudly enough, or section 10 doesn't pin the count. Fix by adding `exactly eight equal-width cells` (or `4-by-2 grid of exactly eight`) in both sections.

**Character drift between e-conte cells (different hair colour, eye colour, or hairstyle cut to cut).** Section 4 (character reference) describes hair/wardrobe but section 6 (cell-by-cell action) doesn't repeat them. Fix by adding a brief hair+wardrobe reminder in every cell's action line.

**Dialogue is paraphrased, romanised wrong, or replaced with generic lines.** The dialogue lines weren't in double quotes, or the prompt opened with artistic framing in section 1. Fix both — quote every line and use the artifact-spec opener.

**Layout drifts away from the e-conte strip into a more decorative anime collage.** The canvas directive in section 2 was too vague. Fix by stating the percentage heights of each tier and the exact panel-width ratios within each tier.

**Camera position chips on the floorplan don't have numbers, or there are six instead of eight.** The floorplan sub-section (in section 5) didn't specify the chip count. Fix by saying "exactly eight numbered camera position chips" explicitly.

**Background plate looks like a photograph rather than anime *haikei*.** Section 5 didn't specify "painted anime background-art style". Fix by adding that phrase, plus the register-specific detail (e.g. "soft brushwork for classic cel" or "clean digital paint with subtle gradients for modern TV").

**Characters in the e-conte cells look more like Western illustration than anime.** The register style anchor isn't doing its job, or it's not being referenced strongly enough. Fix by ensuring section 8's `[Apply shared anime style anchor.]` is present, and the anchor itself names the studio/director references and the rendering style ("clean digital anime lineart, soft cel shading, large expressive eyes, KyoAni-flavoured character design").

**Dead eyes, dead expressions in the e-conte cells.** Action lines in section 6 didn't specify expression. Fix by naming the expression for each cell ("wide-eyed surprise, slight blush", "narrowed eyes, gritted teeth", "downcast gaze, lips parted").

## Full worked example

See `example-rooftop-confession.md` for a complete reverse-engineered prompt that produces a full anime e-conte board for a rooftop confession scene in modern TV anime register.
