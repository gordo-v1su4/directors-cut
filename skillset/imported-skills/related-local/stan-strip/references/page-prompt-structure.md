# GPT Image 2 comic page prompt structure

Every page prompt this skill generates follows the same 9-part structure. The structure is reverse-engineered from the proven comic-prompt formulas in OpenAI's GPT Image 2 cookbook, the Imagine.art prompt guide, the Morphed prompting guide, and several prompt-library examples (the 6-panel "Stardust" superhero prompt, the 4-panel manga "girl with brass key" prompt, and the 4-panel "indie 2x2" prompt).

## Why this structure

A comic page is a **multi-zone artifact with structured text and strict layout** — it has more in common with a UI mockup or infographic than with a single illustration. GPT Image 2 has strong training coverage for comic pages because they appear throughout its training data, but it won't reliably produce a coherent page unless the prompt names the grid, anchors the characters, and labels every text element by role.

The structure below is the minimum specification that holds the page together. Skipping any section makes the page drift toward "an illustration of a comic" rather than an actual comic.

## The 9 parts

### 1. Deliverable label

Open with what the image *is*, in language GPT Image 2 recognises as comic format:

```
Create a single comic page titled "[PAGE TITLE]" — page [N] of [TOTAL] from "[PROJECT TITLE]". A [N]-panel [STYLE — e.g. "classic American superhero comic"] page in a [GRID SPEC — e.g. "2x3 grid"].
```

Do NOT open with "an artistic illustration of a comic page" or "a beautiful comic". Artifact-spec framing is what triggers the multi-panel layout mode in GPT Image 2; artistic framing degrades panel borders and the page comes back as a single unbordered illustration with comic flourishes.

### 2. Format spec

State the layout precisely:

```
Format: [aspect ratio — "portrait 2:3" or "landscape 3:2" or "square 1:1"] comic page,
[grid spec — "2x3 grid of six equal-sized rectangular panels" / "2x2 grid of four equal panels" /
"3x3 grid of nine equal panels" / "variable masonry: one large splash panel taking the top half,
three smaller equal panels in a row beneath" / etc.],
thin black panel borders [1.5-2px], white gutters [6-10px] between panels,
[N px] outer page margin.
```

Be this specific. Vague layout directives are the #1 reason these pages come back with the wrong panel count or with panels merged together.

**Aspect ratio defaults by use case:**

| Use case | Aspect ratio | Recommended size |
|---|---|---|
| Instagram feed | 1:1 square | 1024x1024 |
| Instagram carousel / webtoon / mobile-first | 2:3 portrait | 1024x1536 |
| Print / web / Sunday strip / graphic novel | 3:2 landscape | 1536x1024 |
| Tall webtoon scroll | 9:16 portrait | 768x1344 (per page) |

**Grid options by panel count:**

| Panels | Grid | Best for |
|---|---|---|
| 4 | 2x2 | Single-gag strips, breathy beats |
| 6 | 2x3 (portrait) or 3x2 (landscape) | Standard density, the workhorse |
| 9 | 3x3 | Dense, rhythmic, Watchmen-style |
| 3-7 mixed | Variable masonry | Cinematic, splash-friendly |

For variable masonry, describe the layout literally — e.g. `one large splash panel taking the top 60% of the page; below it, three smaller equal-width panels in a row`. The model handles literal spatial descriptions much better than named layout types.

### 3. Style anchor reference

```
[Apply shared style anchor.]
```

The output markdown file pastes the full anchor as a blockquote at the top so the user prepends it to each page prompt when running them. Don't inline the full anchor in every page prompt — it bloats the file and makes per-page edits harder.

### 4. Reference image declaration

Use the GPT Image 2 convention of labelling each input by role:

```
Reference images:
@Image 1: [Character A name] — preserve face, hair, and signature wardrobe exactly across all panels of this page.
@Image 2: [Character B name] — preserve face, hair, and signature wardrobe exactly across all panels of this page.
@Image 3: [Location name] — preserve setting layout, key furniture, lighting quality, and colour palette.
@Image 4: [Optional: previous comic page] — match this exact rendering style, line weight, halftone density, and colour palette.
```

If no reference images are available, this section becomes:

```
Reference images: none. Anchor character design from the description below; this is page 1 and establishes the visual identity that subsequent pages will reference.
```

This is the case for the very first page of a series — page 1 *creates* the references that later pages preserve.

### 5. Character anchor (one-time)

Describe each character ONCE, fully, here. Subsequent panels refer to characters by name only.

```
Character anchors:
- "[NAME]": [age band], [build], [skin tone], [hair description], [face description],
  signature wardrobe: [exact clothing items including colours and any logos/patterns],
  signature accessories: [glasses, jewellery, weapons, etc.].
- "[NAME 2]": [...same structure...]
```

This is the **opposite** of the `gpt-image-story` pattern (where I repeated wardrobe every frame). For comics, the consensus across all the prompt guides surveyed is: anchor once at the top, reference by name afterward. Re-describing in every panel actually *reduces* consistency because the model treats each re-description as a fresh interpretation.

If reference images are attached, the description here can be more concise — the references carry the visual specifics. If no references, this section needs to be more detailed (because it's establishing the canon).

### 6. Panel-by-panel breakdown

The heart of the page. One numbered block per panel, in reading order (left-to-right, top-to-bottom):

```
Panel [N] ([SHOT TYPE], [ANGLE]): [ONE-SENTENCE SCENE/SETTING]. [CHARACTER ACTION/EXPRESSION].
  - Speech bubble (tail to "[SPEAKER NAME]"): "[EXACT DIALOGUE WORDS]"
  - Caption box (top-left / bottom / etc.): "[EXACT NARRATION WORDS]"
  - SFX integrated into panel art: "[EXACT WORD]" in [VISUAL STYLE — e.g. "bold red jagged letters"]
```

Include only the text elements that panel actually has. Most panels have just a speech bubble or two. Action/climax panels often add SFX. Scene-opening or scene-closing panels often add a caption box.

**Shot types** — comics use the same vocabulary as cinema, plus a few comic-specific terms:
- `wide shot`, `medium shot`, `close-up`, `extreme close-up`, `over-the-shoulder`
- `establishing shot` (for first panel of a new scene/location)
- `splash` (the dominant large panel on a page)
- `reaction shot` (close-up of a character reacting to off-panel action)
- `silent panel` (no text — pure visual beat)

**Angles**:
- `eye-level`, `low angle`, `high angle`, `Dutch tilt` (canted), `bird's-eye`, `worm's-eye`
- `POV` (first-person from a character's perspective)

**Worked example — three-panel breakdown from the "Stardust" superhero prompt:**

```
Panel 1 (wide establishing, low angle, dusk): rooftop at dusk overlooking Metro City skyline.
  STARDUST stands heroically at the rooftop edge, cape billowing.
  - Caption box (top-left, yellow): "METRO CITY — DUSK."
  - Speech bubble (tail to STARDUST): "Trouble in the East District… time to fly!"

Panel 2 (medium shot, eye-level, lab interior): PROFESSOR GRIM stands beside a glowing
  doomsday device, hand raised in triumph. Lab has bubbling beakers and glowing wires.
  - Caption box (top-left, yellow): "MEANWHILE…"
  - Speech bubble (tail to PROFESSOR GRIM): "In sixty seconds, this city will BOW to me!"

Panel 3 (action shot, dynamic angle): STARDUST bursts through a tall lab window,
  glass shards flying. Motion lines around her trailing cape.
  - SFX integrated into panel art: "KRA-KOOM!" in large bold red jagged letters across
    the upper portion of the panel.
  - No speech bubble in this panel.
```

Notice: every text element is quoted, every speaker is named, every SFX has a visual style description.

### 7. Lettering directives (page-wide)

A short paragraph at the bottom of the panel breakdown specifying how the lettering should look across the whole page:

```
Lettering across the page:
- Speech bubbles are clean rounded ovals with thin black borders, tails pointing to the
  speaking character, white interiors, dialogue in classic comic-book all-caps lettering.
- Caption boxes are yellow rectangles with black borders, narration in the same comic-book
  all-caps lettering, placed at panel corners (top-left or bottom-left typically).
- SFX is hand-drawn-feeling integrated panel art, not in any bubble — bold, dynamic,
  coloured to match the impact (red for combat, blue for technology, yellow for excitement).
```

Adapt the description to the chosen style — manga lettering is very different from classic American.

### 8. Quality directive

```
Quality: high. Use Thinking mode if available — multi-panel layouts benefit significantly
from layout planning. Size: [exact dimensions matching the aspect ratio and use case].
```

Always `high` for comic pages. They're text-dense, multi-zone, and consistency-sensitive — exactly the case where high quality earns its cost. Thinking mode is specifically called out by the OpenAI cookbook as recommended for multi-panel work.

### 9. Hard constraints

```
Maintain character design across all panels — same face, hair, build, and signature wardrobe
as the reference images and character anchors above.
Render the exact panel count specified — do not merge, drop, or add panels.
Render all dialogue, captions, and SFX text exactly as quoted, with no paraphrasing.
No watermarks, no real brand logos, no extra speech bubbles, no extra caption boxes,
no text outside the specified verbatim lettering.
```

The "no extra speech bubbles" line is critical — without it, GPT Image 2 will sometimes invent additional dialogue to fill quiet panels, which breaks the rhythm and produces dialogue the user didn't write.

## Common failure modes and fixes

**The page has the wrong number of panels.** Section 2 (format spec) didn't pin the grid clearly, or section 9 didn't pin the count. Fix by adding `exactly [N] panels in a [grid spec]` in both sections.

**Characters drift between panels on the same page.** Section 5 (character anchor) was too thin, and no reference images were attached. Fix by attaching references AND making the character anchor more specific (especially face shape and hair).

**Dialogue is paraphrased or replaced with generic comic-book lines.** The dialogue wasn't in double quotes, or the prompt opened with artistic framing. Fix both — quote every line of dialogue/caption/SFX, and use the artifact-spec opener.

**Speech bubbles all look the same regardless of speaker.** No tail directions specified. Fix by adding `tail to [SPEAKER NAME]` to every speech bubble line.

**SFX appears as text inside speech bubbles instead of as graphic art.** Section 7 (lettering directives) wasn't clear about the distinction, or the panel breakdown said "speech bubble: 'KRA-KOOM!'" instead of "SFX integrated into panel art: 'KRA-KOOM!'". Fix the panel breakdown lines.

**The page comes back as a single illustration with comic flourishes rather than as panels.** Section 1 used artistic framing instead of artifact-spec framing. Fix by opening with `Create a single comic page` and naming the grid in the same sentence.

**Captions appear in speech bubbles instead of yellow boxes.** The panel breakdown didn't specify "caption box" vs "speech bubble" cleanly. Fix by always using the exact words "Speech bubble" and "Caption box" — never abbreviate to "bubble" or "box" alone.

**Cross-page drift on multi-page comics.** No reference images were attached, or the reference declaration in section 4 was vague. Fix by always running with character + location reference images attached, AND adding the previous page as `@Image [last]: previous comic page — match the exact rendering style, line weight, and colour palette` for pages 2 onward.

## Full worked example

See `example-tucker-and-jenny.md` for a complete two-page comic prompt set (a slice-of-life comedy about a lazy dog with selective hearing) showing exactly what a finished output file looks like.
