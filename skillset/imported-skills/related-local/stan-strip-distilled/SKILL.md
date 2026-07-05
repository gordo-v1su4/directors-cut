# Stan Strip — Standalone Skill (Single-File Edition)

> A self-contained instruction set for any LLM (GPT-4, Gemini, open-source models, etc.) to take a story and produce a complete set of GPT Image 2 prompts for a multi-page comic strip. Drop this whole file into your system prompt or context.

---

## What you do

When the user gives you a story — a beat, a script, an anecdote, a chapter, a joke, a screenplay scene — you turn it into a coordinated **set** of ready-to-paste GPT Image 2 prompts, one per comic page. Each prompt produces a single comic page laid out as a clean panel-based masonry grid. The user runs the prompts back-to-back with the same reference images attached and gets a complete comic strip with consistent characters, locations, and visual style across pages.

You produce the **prompts**, not the images. Your output is a single markdown response containing all the page prompts ready to copy and paste.

---

## When to activate

Activate whenever the user provides narrative source material and wants a comic strip / comic pages / webcomic / webtoon / Instagram comic carousel. Source material can be a short story, a joke, a screenplay scene, a passage from prose fiction, a list of beats, a conversation, or any narrative input. Trigger phrases include "make a comic from this", "comic strip prompt", "comic page prompt", "GPT Image 2 comic", "stan strip", "turn this into a comic", "webtoon prompts", "comic carousel", "comic adaptation", or any request that combines narrative source material with comic / strip / manga / webcomic output.

If the user only wants a single page (a self-contained gag), produce one page prompt. If they want a long-form sequence (10+ pages), warn them about consistency drift over long runs and recommend running in batches of 3-5 pages with the previously-generated page added as a "style memory" reference.

---

## Workflow (8 steps)

Follow these steps in order. Quality lives in Step 1 (understanding the story), Step 3 (the page split — the single biggest creative choice), and Step 6 (writing per-panel prompts that actually use GPT Image 2 conventions).

### Step 1: Read the source material and extract the story spine

Identify (as scratch notes, internally):

- **Premise** — one sentence: who, where, what's the friction
- **Characters** — name, age band, single defining physical trait, single defining wardrobe note. Comics handle larger casts than short videos do — 4-5 characters is comfortable across a multi-page strip if each is visually distinct
- **Locations** — comics tolerate location changes well. Multiple locations are fine; track which appear on which pages
- **Beats** — every beat that needs a panel. Comic pacing is denser than video — each beat usually needs a single panel rather than a multi-shot sequence. Be liberal at this stage; cull during the page split
- **Tone** — comedy, drama, horror, slice-of-life, action, satire. Drives the style choice
- **Format hint** — newspaper Sunday strip, webcomic, Instagram carousel, manga page, graphic novel page, indie zine. Affects layout and aspect ratio defaults

Do NOT skip this. Generic understanding produces generic page prompts which produce generic pages.

### Step 2: Ask clarifying questions only when genuinely needed

Ask only if the source material leaves a load-bearing decision unmade. Common gaps worth asking about:

- **Aspect ratio / format** if not implied — portrait 2:3 (webtoon, Instagram, mobile-first) / square 1:1 (Instagram feed, classic comic) / landscape 3:2 (print/web, Sunday strip, graphic novel)
- **Style register** if the source is ambiguous — classic American (bold inks, halftone, Stan Lee energy) / manga / webtoon / ligne claire (Tintin) / indie zine / newspaper strip
- **Page count** if the story length is genuinely unclear after Step 1

Skip any of these if the user has already implied a choice. Don't ask three questions just because three are listed.

### Step 3: Split the story into pages

This is the single most creative choice you make. Get it wrong and even great per-panel prompts produce a poorly-paced comic.

**Panel-density grammar:**

| Panels | Grid | Best for |
|---|---|---|
| 4 | 2×2 | Single-gag strips, breathy beats. One beat per panel. |
| 6 | 2×3 (portrait) or 3×2 (landscape) | Standard density. The workhorse. |
| 9 | 3×3 | Dense, rhythmic, Watchmen-style. Use sparingly — readers slow down. |
| 3-7 mixed | Variable masonry | Cinematic, splash-friendly. One panel becomes a "splash" taking ~half the page. |

**Page-break logic:**

- A page should resolve on a meaningful beat — a punchline, a reveal, a cliffhanger, an emotional landing
- The last panel of a page is the one the reader holds longest before turning — don't waste it on transit
- Avoid splitting tight back-and-forth dialogue across a page break unless the break is itself a deliberate beat

**Worked examples:**

- A 6-beat anecdote → 1 page, 6 panels (2×3 grid)
- A 12-beat short story → 2 pages, 6 panels each, page 1 ending on a turn
- A 4-beat gag → 1 page, 4 panels (2×2 grid)
- A multi-scene mini-story → 4-6 pages, each ending on its own beat

After splitting, write down for each page: `Page N — [setting] — [N panels] — [grid spec] — [beats covered] — [final-panel beat]`. This is the scratch outline you'll turn into prompts in Step 6.

### Step 4: Choose the comic style

Default to **classic American comic** — bold inks, halftone shading, dramatic compositions. It's the style GPT Image 2 has the strongest training priors for and the one most readers parse as "comic" without explanation.

Alternates (full anchor paragraphs in the "Style anchors" section below):

- **Ligne claire** — Tintin / Hergé tradition, uniform line weight, flat colour, restrained
- **Manga / webtoon** — clean ink + screentone (mono) or cel-shaded soft palette (webtoon), expressive faces
- **Indie zine** — loose hand-line, limited spot-colour palette, photocopier feel
- **Newspaper strip** — simple, daily-paper, ~4-panel gag

Adapt the colour palette to the story's mood — a horror strip in classic-American style still uses bold inks but shifts to deep purples and blood reds; a slice-of-life manga uses pastels rather than saturated primaries.

### Step 5: Inventory the reference images

Comics live or die on cross-page consistency. Reference images are the single biggest lever.

For each page prompt, the user will attach the same set of reference images. Your job is to tell them clearly which ones to attach:

- **Character references** — one per major character. Ideally a clean three-quarter view showing face, hair, signature wardrobe.
- **Location references** — one per recurring location. Wide shot showing the layout, lighting, key furniture.
- **Prop references** — only when a specific object recurs and matters visually.
- **Style reference (optional)** — an existing comic page or illustration whose visual style should be matched.

Inside each per-page prompt, declare these references using GPT Image 2's labelling convention:

```
Reference images:
@Image 1: [Character A] — preserve face, hair, and wardrobe exactly
@Image 2: [Character B] — preserve face, hair, and wardrobe exactly
@Image 3: [Location] — preserve setting layout, lighting, and key elements
@Image 4: [optional style reference] — match the visual style and colour palette
```

If the user doesn't have reference images yet, the output's first section should be a "Generate references first" block with a short GPT Image 2 prompt for producing each reference asset before running the page prompts.

### Step 6: Write the GPT Image 2 page prompts

Each page prompt has these 9 sections, in this order:

1. **Deliverable label** — `Create a single comic page titled "[PAGE TITLE]" — page [N] of [TOTAL] from "[PROJECT TITLE]". A [N]-panel [STYLE] page in a [GRID SPEC].`
2. **Format spec** — aspect ratio, grid, panel borders, gutter width, outer margin
3. **Style anchor reference** — `[Apply shared style anchor.]` (the anchor itself sits at the top of the output file once)
4. **Reference image declaration** — `@Image 1: ..., @Image 2: ...`
5. **Character anchor (one-time)** — describe each character ONCE here with full physical traits and signature wardrobe; subsequent panels reference by name only. **This is critical**: re-describing in every panel actually *reduces* consistency because the model treats each re-description as a fresh interpretation. Anchor once, reference by name afterward.
6. **Panel-by-panel breakdown** — one numbered block per panel, in reading order
7. **Lettering directives (page-wide)** — how speech bubbles, captions, and SFX should look across the page
8. **Quality directive** — `Quality: high. Use Thinking mode if available. Size: [exact dimensions].`
9. **Hard constraints** — character consistency, exact panel count, exact text rendering, no extras

The panel-by-panel breakdown uses this format for each panel:

```
Panel [N] ([SHOT TYPE], [ANGLE]): [SCENE DESCRIPTION]. [CHARACTER ACTION/EXPRESSION].
  - Speech bubble (tail to "[SPEAKER NAME]"): "[EXACT DIALOGUE]"
  - Caption box (top-left / bottom / etc.): "[EXACT NARRATION]"
  - SFX integrated into panel art: "[EXACT WORD]" in [VISUAL STYLE]
```

Include only the text elements that panel actually has. Most panels have just a speech bubble or two. Action panels often add SFX. Scene-opening or scene-closing panels often add a caption box.

### Step 7: Assemble the output as a single markdown response

Your response is the deliverable. Structure it as:

- Header block with project title, format, page count, model (`gpt-image-2`), recommended size, quality, style summary
- "At a glance" block (premise, characters, locations, page count, tone keywords)
- Shared style anchor as a blockquote at the top (visible, copy-pasteable, used by every page prompt)
- Reference image inventory (a clear table mapping `@Image N` slots to their roles)
- (If needed) "Generate references first" section with prompts for producing each reference asset
- One section per page, in order, with `## Page N — [title]`, a meta line, and the full page prompt in a fenced code block
- Generation notes (cross-page consistency tips, iteration strategy, common failure modes for *this specific story*)

The output should be **complete** — the user copies prompts directly into their GPT Image 2 frontend without further editing.

### Step 8: Summarise and hand off

After the markdown output, give the user a 6-12 line summary covering:

- The premise in one sentence and why you chose this page split
- Which style you picked and why
- The reference-image plan: which references they need, whether they have them or need to generate them first
- The running order: paste prompt 1 with refs → get page 1 → paste prompt 2 with the SAME refs → get page 2 → and so on
- The most likely failure mode for this specific story (character drift, location drift, dialogue paraphrase, panel count error) and the fix
- A reminder that consistency is reference-driven — running pages without the references attached produces a series of unrelated images, not a strip

---

## Critical patterns

These are the load-bearing patterns. Skipping them produces worse output.

**The N-panel grid is a strict layout, not a suggestion.** Don't ask GPT Image 2 for "a comic page with several panels" — that produces vague illustration. Specify the exact grid (`2x3 grid of six equal-sized rectangular panels`) and the exact gutter (`white gutters of 8px between panels`). For variable masonry, name the layout precisely (`one large splash panel taking the top half, three smaller equal panels in a row beneath`).

**Anchor characters once at the top of the page prompt, then refer by name.** This is the OpenAI cookbook recommendation for multi-panel comic work. Comics operate on visual repetition — re-describing in every panel actually *reduces* consistency. Anchor once, reference by name afterward, and trust the reference image to do the rest.

**Reference images are not optional for multi-page work.** A single page can sometimes hold consistency from prompt text alone. Two or more pages without reference images almost always drift — different face shapes, different wardrobe, different room layouts. Always include the reference inventory section, even if the user hasn't provided references yet (in that case, propose generating them first).

**The three text types must be specified distinctly.**
- **Speech bubbles** are rounded with tails — for dialogue: `Speech bubble (tail to [SPEAKER]): "[EXACT WORDS]"`
- **Caption boxes** are rectangular and often coloured (yellow in classic American style) — for narration: `Caption box (top-left): "[EXACT WORDS]"`
- **SFX** are integrated graphic onomatopoeia, NOT in any bubble — for sounds: `SFX integrated into panel art: "[EXACT WORD]" in [STYLE]`

Mixing these into one bag means the model picks one and ignores the others, or worse, draws all three identically. Spell each out separately, every time.

**Quote every line of text that needs to render.** GPT Image 2's text rendering only works reliably when the exact string is in quotes and labelled by role. `"Not on my watch!" — speech bubble, tail to STARDUST` is correct; `Stardust shouts something defiant` is paraphrase-bait.

**Use Thinking mode for multi-panel pages.** The OpenAI cookbook and multiple third-party guides confirm Thinking mode noticeably improves layout planning, panel-count accuracy, and text placement on multi-panel work. It costs more and takes longer; it's worth it for comics. Mention this in every output's generation notes.

**Iteration beats re-rolling.** If page 3's panel 4 is wrong, use `images.edit` with `input_fidelity: "high"` and a single-change instruction (`"keep everything; fix only panel 4 to show STARDUST punching the villain"`). If the whole page is off, regenerate that page only — don't re-run earlier pages just because a later one failed.

**For long runs (5+ pages), use the previous page as a style-memory reference.** Add the most recently generated page as `@Image [N+1]: previous comic page from the same series — match this exact rendering style, line weight, and colour palette` to the next page prompt. This compounds consistency across long sequences much better than relying on character/location refs alone.

---

## Aspect ratio reference

| Use case | Aspect ratio | Recommended size |
|---|---|---|
| Instagram feed | 1:1 square | 1024x1024 |
| Instagram carousel / webtoon / mobile-first | 2:3 portrait | 1024x1536 |
| Print / web / Sunday strip / graphic novel | 3:2 landscape | 1536x1024 |
| Tall webtoon scroll | 9:16 portrait | 768x1344 (per page) |
| Newspaper daily strip | 3:1 horizontal row | 1536x512 |

---

## Style anchors

Pick ONE per project and paste the full anchor paragraph as a blockquote at the top of the output file.

### Classic American (DEFAULT)

> Classic American comic-book art style in the bold-ink Marvel/DC tradition. Strong confident black ink outlines of varying weight (heavier on outer silhouettes, lighter on interior detail). Flat saturated primary and secondary colours — reds, blues, yellows, greens — with Ben-Day-style halftone dot shading for shadow areas and skin tones. Slightly aged off-white paper background tone (#FBF6E8) inside panels. Thin black panel borders (1.5-2px) with clean white gutters between panels. Classic comic-book all-caps hand-lettered-feel typography for dialogue and captions. Speech bubbles are clean rounded ovals with thin black outlines and tails pointing to speakers. Caption boxes are yellow (#FFE066) rectangles with black borders, used for narration and time/location titles. Sound effects are bold hand-drawn integrated panel art with dynamic shapes — jagged for impacts, bouncy for comedic, swooping for motion — coloured for impact (red for combat, yellow for excitement, blue for technology, green for energy). Compositions are dynamic with strong foreshortening, dramatic angles, expressive faces, and clear visual hierarchy. Overall feel: vibrant, kinetic, heroic, immediately readable as a Western comic page from the 1980s-2000s tradition. No watermarks, no real brand logos, no glossy gradients, no soft photographic blur.

**Lettering specifics:** dialogue is classic comic-book all-caps with slight bounce / hand-lettered irregularity. Bold dialogue (emphasis) uses the same lettering rendered bold with a slight outline. Whisper dialogue is smaller with a dashed bubble outline. Thought is a scalloped/cloud-shape bubble with a chain of small bubbles trailing to the thinker. Caption boxes use the same all-caps lettering on yellow background. SFX is dramatic display lettering integrated into the panel art, not bubbled — hand-feel, dynamic, coloured for impact, can break panel borders for emphasis.

### Ligne claire (Tintin / Hergé)

> Ligne claire European comic-book style in the Hergé / Tintin tradition. Uniform-weight clean black ink lines (no varying line weight, no inking flourishes) defining all forms with calm precision. Flat solid colours, no halftone, no gradients — areas of pure colour bounded crisply by the line work. Slightly muted, harmonious palette favouring earth tones, sage greens, dusty blues, warm reds, ochre yellows, cream backgrounds (#F2EBD7). Thin black panel borders (1.5px) with clean white gutters. Compositions are balanced, often symmetrical, with deep clear backgrounds rendered in the same uniform line weight as foreground subjects (no atmospheric blur, everything in focus). Faces are simplified, expressive through clear gesture and brow rather than detailed rendering. Speech bubbles are clean rounded ovals with thin black borders, dialogue in clean readable lettering (less hand-feel than American comics, more typeset feel). Caption boxes are thin yellow or cream rectangles. Sound effects are restrained — small, integrated, lower-case-friendly, never breaking the panel borders. Overall feel: calm, balanced, beautifully composed, classical European comics craft. No watermarks, no real brand logos, no halftone dots, no dramatic ink shadows, no Ben-Day shading, no kinetic motion-line excess.

**Use for:** adventure stories with restraint, European-inflected work, children's comics where bold-ink violence would feel wrong, period pieces, anything valuing clarity and craftsmanship over kinetic energy.

### Manga / Webtoon (monochrome manga variant)

> Black-and-white manga art style in the contemporary shōnen/seinen tradition. Clean confident black ink line work with controlled line-weight variation (heavier on character silhouettes, lighter on background detail). Black-and-white only — NO colour anywhere on the page. Tonal shading rendered as classic manga screentone (regular dot patterns at varying densities) for skin tones, hair, clothing, and atmospheric depth — never as halftone or grey gradients. Cream-white panel interiors (#FCFAF5), pure white gutters (#FFFFFF), thin black panel borders (1.5px). Faces are stylised with expressive large eyes, simplified noses, and emotive mouth shapes; emotion conveyed through canonical manga symbols (sweat drops, vein-pop marks, blush hatching, sparkle eyes when relevant). Compositions use dynamic angles, dramatic foreshortening, and bold motion lines (hand-drawn straight or speed lines) for action and emphasis. Speech bubbles are clean ovals with sharp tails; dialogue lettering reads as Latin-alphabet adaptation of manga lettering — clean readable sans-serif, mixed case (NOT all-caps like American comics). Sound effects are dramatic large-scale graphic onomatopoeia integrated into panel art, often diagonal, often broken-shape, in the same black ink as everything else. Reading order is left-to-right, top-to-bottom; panels can vary in size with one or two splashes per page. Overall feel: clean, kinetic, emotionally legible, immediately reading as manga to anyone familiar with the form. No watermarks, no real brand logos, no colour, no Ben-Day dots, no Western comic conventions.

### Manga / Webtoon (full-colour webtoon variant)

> Full-colour Korean webtoon art style in the contemporary tradition. Clean digital line work with controlled weight variation. Soft-but-saturated colour palette — slightly desaturated compared to American comics, with focus on atmosphere through colour temperature shifts. Cel-shaded rendering with two-to-three tone steps (base colour, mid-shadow, deep-shadow) and occasional soft blooms of light. Backgrounds often use photographic textures lightly painted over, or atmospheric gradient washes. Panel borders may be thin or absent (webtoon often uses borderless panels or rounded-corner panels). Faces are stylised with expressive large eyes (often coloured with multiple gradient layers), simplified noses, emotive mouth shapes. Speech bubbles are clean ovals; lettering reads as readable sans-serif mixed-case. Sound effects are graphic onomatopoeia, often coloured, integrated into the panel. For vertical-scroll webtoon, panels stack with intentional vertical white space between beats to control reading pace. Overall feel: clean, atmospheric, emotionally rich, immediately reading as a contemporary webtoon. No watermarks, no real brand logos, no halftone dots, no American comic ink-flourish.

**Manga symbols (use sparingly when they fit):** sweat drop (anxiety/awkwardness), vein pop / cross-shape on forehead (anger), crosshatch blush (embarrassment/attraction), sparkle eyes (admiration/awe), ellipsis bubble — just `...` (silence/awkwardness), background flash lines (sudden realisation).

### Indie zine

> Indie zine / mini-comic art style with a hand-drawn, slightly imperfect quality. Loose confident black ink line with visible variation in pressure and small honest imperfections (no sterile precision). Limited palette — typically black ink plus one or two flat spot colours (rust red, mustard yellow, sage green, dusty pink, or muted blue) applied in flat washes, never gradients. Off-white slightly-warm paper background tone (#F5EFE2) inside panels, with a very subtle paper grain texture. Thin black panel borders drawn by hand (slightly uneven, not ruler-perfect, ~2px equivalent). White gutters between panels. Faces are simplified, expressive, character-first — gesture and silhouette carry the emotion rather than detailed rendering. Backgrounds are sparse, often just enough to suggest place. Speech bubbles are hand-drawn ovals with slightly irregular outlines, dialogue in casual hand-lettered-feel mixed-case lettering. Caption boxes are simple thin-bordered rectangles with the same hand-lettered text. Sound effects are restrained, integrated into the line work, often lower-case, never breaking out of the panels. Slight photocopier-feel artefacts — a tiny bit of edge softness, an occasional thin line break — are welcome. Overall feel: handmade, intimate, character-driven, the visible texture of a real zine made by a real person on a Tuesday afternoon. No watermarks, no real brand logos, no slick digital gradients, no Marvel-style ink flourish, no halftone dots.

**Pick ONE spot colour for the project** (occasionally two if they harmonise) and use it consistently — that restraint is the style.

**Use for:** slice-of-life, memoir/autobiographical, character studies, awkward comedy, anything where the handmade feel is part of the meaning.

### Newspaper strip

> Newspaper comic strip art style in the daily-paper tradition. Simple confident black ink line work with consistent moderate weight. Either monochrome black-on-cream or limited Sunday-strip colour palette (3-4 flat spot colours, no gradients, no halftone). Very simple backgrounds — often just a horizon line, a single piece of furniture, or a flat colour wash. Faces are highly stylised and simplified — character is read entirely from silhouette, hairstyle, and a few key features. Body proportions are often slightly cartoony (larger heads, simpler hands). Thin black panel borders, classic horizontal-strip layout (typically 3 or 4 equal-width panels in a single row), with classic newspaper-strip proportions. Speech bubbles are clean simple ovals with thin tails; dialogue lettering is clean hand-lettered-feel mixed-case or all-caps depending on the property's tradition. No SFX flourish — sound effects, when present, are tiny and integrated. Overall feel: economical, instantly readable at small print size, single-gag-per-strip rhythm, the comfortable familiarity of a daily newspaper page. No watermarks, no real brand logos, no halftone dots, no Marvel-style inking, no detailed backgrounds, no overcomplicated compositions.

**Layout note:** this style favours single-page output. Multi-page newspaper strips are uncommon (each strip is its own complete page). If the user wants a multi-strip series, treat each strip as a single page and run them in order. Use 3:1 horizontal aspect ratio (1536x512) for daily strips; 3:2 landscape (1536x1024) for full Sunday-page format.

---

## Output template

This is the shape of the markdown response you produce. Replace `[bracketed placeholders]` with project-specific content.

````markdown
# [Project Title] — Comic Strip Prompts

**Pipeline:** Idea → Page Split → Per-Page Prompts → Comic
**Model:** `gpt-image-2` · Quality `high` · Mode: **Thinking** (recommended for multi-panel layouts)
**Format:** [Portrait 2:3 / Landscape 3:2 / Square 1:1] · `[1024x1536 / 1536x1024 / 1024x1024]`
**Style:** [one-line style description]
**Pages:** [N total]

## At a glance

- **Premise:** [one-sentence premise]
- **Format:** [aspect ratio + intended distribution]
- **Characters:** [N total — name them]
- **Locations:** [N total — name them]
- **Page count:** [N pages]
- **Tone keywords:** [3-5 keywords]

---

## Shared style anchor (prepend to every page prompt)

> [Paste the full style anchor paragraph from the chosen anchor verbatim.]

---

## Reference image inventory

Attach these reference images to **every** page prompt below in the order specified. The same `@Image N` slots are used identically across all pages.

| Slot | Role | Description | Status |
|---|---|---|---|
| `@Image 1` | Character: [Name A] | [Brief description] | [User to provide / Generate first / Already attached] |
| `@Image 2` | Character: [Name B] | [...] | [...] |
| `@Image 3` | Location: [Name] | [...] | [...] |

[If references not yet generated, include a "Generate references first" section with one GPT Image 2 prompt per reference asset.]

---

## Page running order

Run the page prompts below **in numbered order**, attaching the same reference images to every prompt. For pages 2 onwards, optionally also attach the most recently generated page as `@Image [last+1]: previous comic page — match this exact rendering style, line weight, and colour palette`.

---

## Page 1 — [Page title / scene name]

**Meta:** [N] panels · [grid spec] · [aspect ratio] · ends on [final-panel beat type]

```
[Full GPT Image 2 page prompt — see "Page prompt template" below.]
```

---

## Page 2 — [Page title / scene name]

[Same shape, repeated for each page.]

---

## Generation notes

[Story-specific failure modes, iteration tips, batch-running guidance, multilingual swap notes if relevant.]
````

---

## Page prompt template

Each page prompt has this exact 9-section structure. Use it verbatim, filling in the bracketed values.

```
Create a single comic page titled "[PAGE TITLE]" — page [N] of [TOTAL] from "[PROJECT TITLE]". A [N]-panel [STYLE — e.g. "classic American superhero comic"] page in a [GRID SPEC — e.g. "2x3 grid"].

Format: [aspect ratio — "portrait 2:3" / "landscape 3:2" / "square 1:1"] comic page, [grid spec — exact panel count and arrangement], thin black panel borders [1.5-2px], white gutters of [6-10]px between panels, [N]px outer page margin.

[Apply shared style anchor.]

Reference images:
@Image 1: [Character A name] — preserve face, hair, and signature wardrobe exactly across all panels of this page.
@Image 2: [Character B name] — preserve face, hair, and signature wardrobe exactly across all panels of this page.
@Image 3: [Location name] — preserve setting layout, key furniture, lighting quality, and colour palette.
[@Image 4: previous comic page from this series — match this exact rendering style, line weight, halftone density, and colour palette. (For pages 2+ only.)]

Character anchors:
- "[NAME A]": [age band], [build], [skin tone], [hair description], [face description], signature wardrobe: [exact clothing including colours and patterns], signature accessories: [glasses, jewellery, etc.].
- "[NAME B]": [...same structure...]

Panel breakdown (read left-to-right, top-to-bottom):

Panel 1 ([SHOT TYPE], [ANGLE]): [SCENE/SETTING in one sentence]. [CHARACTER ACTION/EXPRESSION].
  - Speech bubble (tail to "[SPEAKER NAME]"): "[EXACT DIALOGUE]"
  - Caption box ([POSITION]): "[EXACT NARRATION]"
  - SFX integrated into panel art: "[EXACT WORD]" in [VISUAL STYLE — e.g. "bold red jagged letters"]

Panel 2 ([SHOT TYPE], [ANGLE]): [SCENE]. [ACTION].
  - [text elements as above, only those that apply]

[... continue for every panel ...]

Lettering across the page:
- Speech bubbles are [shape] with [border style], tails pointing to the speaking character, [interior style], dialogue in [lettering register].
- Caption boxes are [shape and colour] with [border style], narration in the same lettering register, placed at panel corners.
- SFX is hand-drawn integrated panel art (not in any bubble) — [style description], coloured to match impact.

Quality: high. Use Thinking mode if available — multi-panel layouts benefit significantly from layout planning. Size: [exact dimensions].

Maintain character design across all panels — same face, hair, build, and signature wardrobe as the reference images and character anchors above.
Render exactly [N] panels in a [GRID SPEC] — do not merge, drop, or add panels.
Render all dialogue, captions, and SFX text exactly as quoted, with no paraphrasing.
No watermarks, no real brand logos, no extra speech bubbles, no extra caption boxes, no text outside the specified verbatim lettering.
```

**Shot type vocabulary** (use any that fit): `wide shot`, `medium shot`, `close-up`, `extreme close-up`, `over-the-shoulder`, `establishing shot`, `splash` (the dominant large panel on a page), `reaction shot`, `silent panel`.

**Angle vocabulary**: `eye-level`, `low angle`, `high angle`, `Dutch tilt`, `bird's-eye`, `worm's-eye`, `POV`.

---

## Worked example (compressed)

The kind of output you should produce. This is a single page from a two-page slice-of-life comedy ("Tucker & Jenny: Selective Hearing" — a lazy dog with selective hearing ignores his owner until she mentions chicken).

````markdown
# Tucker & Jenny: Selective Hearing — Comic Strip Prompts

**Model:** `gpt-image-2` · Quality `high` · Mode: **Thinking**
**Format:** Portrait 2:3 · `1024x1536`
**Style:** Indie zine slice-of-life with mustard yellow accent
**Pages:** 2

## Shared style anchor (prepend to every page prompt)

> Indie zine / mini-comic art style with a hand-drawn, slightly imperfect quality. Loose confident black ink line with visible variation in pressure. Limited palette — black ink plus mustard yellow (#D9A82A) as the single spot accent colour, applied in flat washes. Off-white slightly-warm paper background tone (#F5EFE2) inside panels with subtle paper grain. Thin black panel borders drawn by hand (slightly uneven, ~2px), white gutters. Faces simplified and expressive, gesture-driven. Speech bubbles are hand-drawn ovals with slightly irregular outlines, dialogue in casual hand-lettered-feel mixed-case lettering. Caption boxes are simple thin-bordered rectangles. Sound effects restrained, integrated into the line work, often lower-case. Overall feel: handmade, intimate, character-driven. No watermarks, no slick digital gradients, no halftone dots.

## Reference image inventory

| Slot | Role | Description |
|---|---|---|
| `@Image 1` | Character: Jenny | Late 20s woman, brown ponytail, mustard sweatshirt |
| `@Image 2` | Character: Tucker | Scruffy mid-sized brown dog, floppy ears, grumpy |
| `@Image 3` | Location: Living room | Blue-grey couch, low table, vacuum, window |
| `@Image 4` | Location: Kitchen | Counter with fridge, Tupperware on counter |

---

## Page 1 — Setup: The Vacuuming Stalemate

**Meta:** 4 panels · 2x2 grid · portrait 2:3 · ends on Jenny giving up and walking to the kitchen

```
Create a single comic page titled "Selective Hearing" — page 1 of 2 from "Tucker & Jenny". A 4-panel indie zine slice-of-life comic page in a 2x2 grid.

Format: portrait 2:3 comic page, 2x2 grid of four equal-sized rectangular panels, hand-drawn thin black panel borders ~2px (slightly uneven), white gutters of 8px between panels, off-white paper tone (#F5EFE2) inside panels with subtle grain.

[Apply shared style anchor.]

Reference images:
@Image 1: Jenny — preserve face, hair, and signature mustard-yellow sweatshirt exactly across all panels.
@Image 2: Tucker — preserve dog breed, fur colour, ear shape, and grumpy attitude exactly across all panels.
@Image 3: Living room — preserve setting layout (blue-grey couch, low coffee table, vacuum cleaner, window).

Character anchors:
- "JENNY": late 20s woman, shoulder-length brown hair in a loose low ponytail, faded mustard-yellow crewneck sweatshirt, dark grey leggings, barefoot, tired warm expression.
- "TUCKER": scruffy mid-sized brown mixed-breed dog, floppy ears, expressive eyebrows that read as lazy-with-attitude.

Panel breakdown:

Panel 1 (medium shot, eye-level, living room): JENNY stands holding the upright vacuum. TUCKER is sprawled across the blue-grey couch, eyes half-closed. JENNY looks at TUCKER with polite-but-tired expression.
  - Speech bubble (tail to JENNY): "Tucker, can you move so I can vacuum?"
  - SFX integrated into panel art: "vrrrrrrr" — small lower-case mustard-yellow letters along the base of the vacuum.

Panel 2 (silent panel, close-up, on TUCKER): tight close-up on TUCKER's face. Eyes completely closed now, ears slightly back, the picture of deliberate ignoring.
  - Caption box (top-left): "Zero interest detected."

Panel 3 (medium shot, eye-level, living room): JENNY has stepped closer, one hand on her hip. She looks down at TUCKER with mild exasperation. TUCKER still hasn't moved.
  - Speech bubble (tail to JENNY): "Tucker. I said move."
  - Speech bubble (cloud-shape thought bubble, tail to TUCKER): "If I don't look at her, she's not talking to me."
  - SFX integrated into panel art: "tap tap" — small lower-case mustard-yellow letters near where the vacuum nudges the couch base.

Panel 4 (wide shot, eye-level, living room with kitchen visible through doorway): JENNY has turned away, walking toward the kitchen doorway, slightly grumpy. TUCKER still on the couch in the foreground, eyes still closed.
  - Speech bubble (tail to JENNY, slightly muttering — small dashed border): "Fine. I'll just grab some leftover chicken…"

Lettering across the page:
- Speech bubbles are hand-drawn ovals with slightly irregular outlines and thin black borders, dialogue in casual hand-lettered-feel mixed-case lettering (NOT all-caps).
- Thought bubble (panel 3, Tucker) is a scalloped cloud shape with small trailing bubbles connecting to TUCKER.
- Whisper bubble (panel 4, Jenny) has a thin dashed border.
- Caption box (panel 2) is a thin-bordered rectangle.
- SFX is restrained lower-case mustard-yellow integrated into panel art, never breaking borders.

Quality: high. Use Thinking mode if available. Size: 1024x1536.

Maintain character design across all panels — same JENNY and TUCKER as @Image 1 and @Image 2. Maintain location as @Image 3.
Render exactly 4 panels in a 2x2 grid — do not merge, drop, or add panels.
Render all dialogue, captions, and SFX text exactly as quoted. The strip ends on Jenny's muttered "leftover chicken…" — that line MUST appear exactly because it is the setup for the punchline on page 2.
No watermarks, no real brand logos, no extra speech bubbles, no extra caption boxes, no text outside the specified verbatim lettering.
```

[Page 2 follows the same structure, ending on Tucker's "CHICKEN?!" eruption and "Only when it's important." button.]

## Generation notes

- The two pages are coupled by the chicken setup. Jenny's muttered "leftover chicken…" sets up Tucker's "CHICKEN?!" payoff. Don't tidy that line.
- The mustard-yellow spot colour is the only colour. If extra colours appear, regenerate with the palette restriction strengthened.
- Hand-feel is load-bearing. If pages come back too clean, strengthen the imperfection language.
````

---

## Common failure modes and fixes

**Page has the wrong number of panels.** Format spec or hard constraints didn't pin the grid clearly. Fix: add `exactly [N] panels in a [GRID SPEC]` in both sections.

**Characters drift between panels on the same page.** Character anchor was thin and no reference images attached. Fix: attach references AND make the anchor more specific (especially face shape and hair).

**Dialogue is paraphrased.** Dialogue wasn't in double quotes, or the prompt opened with artistic framing. Fix: quote every line, use the artifact-spec opener (`Create a single comic page...`) not artistic framing (`a beautiful illustration of a comic`).

**Speech bubbles all look the same regardless of speaker.** No tail directions specified. Fix: add `tail to [SPEAKER NAME]` to every speech bubble line.

**SFX appears as text inside speech bubbles instead of as graphic art.** Panel breakdown said "speech bubble: 'KRA-KOOM!'" instead of "SFX integrated into panel art: 'KRA-KOOM!'". Fix the panel breakdown lines.

**Page comes back as a single illustration with comic flourishes rather than as panels.** Used artistic framing instead of artifact-spec framing. Fix: open with `Create a single comic page` and name the grid in the same sentence.

**Captions appear in speech bubbles instead of yellow boxes.** Panel breakdown didn't distinguish "Speech bubble" vs "Caption box" cleanly. Fix: always use the exact words "Speech bubble" and "Caption box" — never abbreviate.

**Cross-page drift on multi-page comics.** No reference images attached, or vague reference declaration. Fix: always run with character + location reference images attached, AND add the previous page as `@Image [last]: previous comic page — match the exact rendering style` for pages 2 onward.

---

## Important reminders

- You produce **prompts**, not images. Your output is markdown.
- Always include a reference image inventory section, even if the user hasn't provided refs yet — in that case, include "Generate references first" prompts.
- The shared style anchor sits ONCE at the top of the output as a blockquote — don't repeat the full anchor in each page prompt body. The page prompts use the placeholder `[Apply shared style anchor.]`.
- Quote every line of dialogue, narration, and SFX exactly — never paraphrase.
- Speech bubbles, caption boxes, and SFX are three distinct text types — name each correctly every time.
- Anchor characters once at the top of each page prompt; reference by name afterward.
- Recommend Thinking mode in every output's generation notes.
- For pages 2+, recommend attaching the previous page as an additional `@Image` reference for style memory.

---

*Single-file edition — distilled from the full `stan-strip` skill. For the full progressive-disclosure version designed for Claude, see [github.com/MushroomFleet/stan-strip-skill](https://github.com/MushroomFleet/stan-strip-skill).*
