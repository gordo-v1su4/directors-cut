---
name: stan-strip
description: Generate a markdown file with one ready-to-paste GPT Image 2 prompt per comic page. Each prompt produces a clean panel-based masonry-grid comic page in portrait (1024x1536, social/webtoon) or landscape (1536x1024, print/web), designed to run with reference images for character/location/prop consistency across pages. Use whenever a user provides a story, script, screenplay, prose passage, joke, anecdote, narrative beat, GDD scene, or source material and wants comic strip prompts, comic page prompts, a webcomic, an Instagram carousel comic, or any multi-page comic deliverable. Also trigger on "make a comic from this", "comic strip prompt", "comic page prompt", "GPT Image 2 comic", "stan strip", "turn this into a comic", "webtoon prompts", "comic carousel", "comic adaptation", or any request combining narrative source material with comic/strip/manga/webcomic output. Always use when the deliverable is a coordinated set of one-prompt-per-page comic prompts.
---

# Stan Strip — Multi-Page Comic Prompt Generator

Turn any story — a beat, a script, an anecdote, a chapter, a joke, a screenplay scene — into a coordinated **set** of ready-to-paste GPT Image 2 prompts, one per comic page. Each prompt produces a single comic page laid out as a clean panel-based masonry grid. Run all the prompts back-to-back with the same reference images and you get a complete comic strip with consistent characters, locations, and visual style across pages.

The shape mirrors `gpt-image-story` deliberately: read the source → understand the spine → propose a structure → write specific verbatim-labelled prompts → assemble a single ready-to-share markdown file. The only difference is the output format. Where `gpt-image-story` produces one storyboard image and one paired video prompt, `stan-strip` produces N comic page prompts, no second model.

## When to use this skill

Trigger whenever the user provides narrative source material and wants a comic strip / comic pages / webcomic / webtoon / Instagram comic carousel. Source material can be:

- A short story, joke, or anecdote
- A scene from a screenplay, script, or treatment
- A passage from prose fiction or a chapter of a novel
- A GDD cinematic, cutscene, or in-game vignette
- A list of beats the user wrote out as `1) ... 2) ... 3) ...`
- A conversation in which the story was discussed
- An existing video idea (`gpt-image-story` storyboard, ad concept, etc.) being adapted for comic format
- A real-life event the user wants comic-ified

The skill is for **prompt generation**, not image generation. The deliverable is always a single markdown file containing one fenced prompt per page, plus shared reference-image guidance and generation notes. The output is "complete" — meaning the user runs each prompt in order with the same reference images attached, gets back N images, and has a finished comic.

If the user only wants *one* page (a single self-contained gag or beat), still produce one well-structured page prompt. If they want a long-form sequence (10+ pages), warn them about consistency drift over long runs and recommend stronger anchor references and/or running in batches of 3-5 pages with the previously-generated page added as a "style memory" reference.

## Workflow

Follow these steps in order. Quality lives in Step 1 (understanding the story), Step 3 (the page split — the single biggest creative choice in this skill), and Step 6 (writing per-panel prompts that actually use the GPT Image 2 conventions).

### Step 1: Read the source material and extract the story spine

If the user attached files, read them. If they pasted prose inline, work from that. If they pointed at a prior conversation, read what you need from it.

Identify and write down (as scratch notes):

- **Premise** — one sentence: who, where, what's the friction
- **Characters** — name, age band, single defining physical trait, single defining wardrobe note. Comics handle larger casts than short videos do — 4-5 characters is comfortable across a multi-page strip if each is visually distinct
- **Locations** — comics tolerate location changes much better than short-form video. Multiple locations are fine; just track which appear on which pages
- **Beats** — every beat that needs a panel. Comic pacing is denser than video — each beat usually needs a single panel rather than a multi-shot sequence. Be liberal at this stage; cull during the page split
- **Tone** — comedy, drama, horror, slice-of-life, action, satire, etc. Drives the style anchor choice
- **Format hint** — newspaper Sunday strip, webcomic, Instagram carousel, manga page, graphic novel page, indie zine — affects layout and aspect ratio defaults

Do NOT skip this. Generic understanding produces generic page prompts which produce generic pages.

### Step 2: Ask clarifying questions only when genuinely needed

Use `ask_user_input_v0` only if the source material leaves a load-bearing decision unmade. Common gaps worth asking about:

- **Aspect ratio / format** if not implied: `Portrait 2:3 (webtoon, Instagram, mobile-first)`, `Square 1:1 (Instagram feed, classic comic)`, `Landscape 3:2 (print/web, Sunday strip, graphic novel)`, `You decide based on the story`
- **Style register** if the source is ambiguous: `Classic American comic (bold inks, halftone, Stan Lee energy)`, `Manga / webtoon (clean line, screentone, expressive eyes)`, `Ligne claire (Tintin, clean line, flat colour)`, `Indie / zine (loose line, limited palette, hand-feel)`, `Newspaper strip (simple, daily-paper, four-panel gag)`
- **Page count / panel density** if the story length is genuinely unclear after Step 1: `Single page (4-6 panels, one gag)`, `Short strip (2-3 pages, one scene)`, `Mini-arc (4-6 pages, full mini-story)`, `You decide based on the story`

Skip any of these if the user has already implied a choice. Don't ask three questions just because three are listed.

### Step 3: Split the story into pages

This is the single most creative choice the skill makes. Get it wrong and even great per-panel prompts produce a poorly-paced comic.

**Default panel-density grammar:**

- **4 panels per page (2×2 grid)** — light, breathy. One beat per panel. Best for single-gag strips, simple jokes, slice-of-life moments. Pages should generally end on a punchline or visual hold.
- **6 panels per page (2×3 or 3×2 grid)** — standard. The workhorse density. Good for narrative beats with conversation, action sequences with reaction shots, anything moderately paced.
- **9 panels per page (3×3 grid)** — dense, rhythmic, Watchmen-style. Best for character-driven scenes where the rhythm of repeated panel sizes is part of the storytelling. Use sparingly — readers slow down on 9-panel pages.
- **Variable masonry (3-7 panels with mixed sizes)** — cinematic, splash-friendly. One panel becomes a "splash" (large hero panel taking ~half the page) and the others slot around it. Best for story climaxes, reveals, or scenes that need a single dominant image.

**Page-break logic:**

- A page should resolve on a meaningful beat — a punchline, a reveal, a cliffhanger, an emotional landing
- The last panel of a page is the one the reader holds longest before turning — don't waste it on transit
- Avoid splitting tight back-and-forth dialogue across a page break unless the break is itself a deliberate beat
- For Instagram/webtoon vertical scrolls, page breaks matter less — but the *swipe* break does, so the same logic applies to "what does the reader see at the end of each card before swiping"

**Worked examples:**

- A 6-beat anecdote → 1 page, 6 panels (2×3 grid)
- A 12-beat short story → 2 pages, 6 panels each, page 1 ending on a turn
- A 4-beat gag → 1 page, 4 panels (2×2 grid)
- A multi-scene mini-story → 4-6 pages, each ending on its own beat
- A long-form chapter → split by scene / location change, one page per scene minimum

After splitting, write down for each page: `Page N — [setting] — [N panels] — [grid spec] — [the beats covered] — [the final-panel beat]`. This is the scratch outline you'll turn into prompts in Step 6.

### Step 4: Choose the comic style

Default to **classic American comic** (the "Stan Strip" namesake — bold inks, expressive faces, dramatic compositions, halftone or flat colour, sound-effect graphics). It's the style GPT Image 2 has the strongest priors for and the one most readers parse as "comic" without explanation.

Read the relevant style anchor:

- Classic American comic (default) → `references/style-classic-american.md`
- Ligne claire (Tintin/Hergé, clean line, flat colour) → `references/style-ligne-claire.md`
- Manga / webtoon (clean ink, screentone, expressive eyes) → `references/style-manga.md`
- Indie / zine (loose line, limited palette, hand-feel) → `references/style-indie-zine.md`
- Newspaper strip (simple, daily, ~4-panel gag, often grayscale or limited colour) → `references/style-newspaper.md`

Adapt the colour palette to the story's mood — a horror strip in classic-American style still uses bold inks but shifts to deep purples and blood reds; a slice-of-life manga uses pastels rather than saturated primaries.

### Step 5: Inventory and brief the reference images

Comics live or die on cross-page consistency. Reference images are the single biggest lever.

For each page prompt, the user will attach the same set of reference images. The skill's job is to tell them clearly which ones to attach and how to brief each:

- **Character references** — one per major character. Ideally a clean three-quarter view showing face, hair, signature wardrobe. If the user hasn't provided these, propose generating them first (either with GPT Image 2 itself using a character-sheet prompt, or with whatever portrait pipeline they prefer)
- **Location references** — one per recurring location. Wide shot showing the layout, lighting, key furniture
- **Prop / object references** — only when a specific object recurs and matters visually (a hero's sword, a brand product, a unique costume piece)
- **Style reference (optional)** — an existing comic page or illustration whose visual style should be matched

Inside each per-page prompt, declare these references using the GPT Image 2 convention:

```
Reference images:
@Image 1: [Character A] — preserve face, hair, and wardrobe exactly
@Image 2: [Character B] — preserve face, hair, and wardrobe exactly
@Image 3: [Location] — preserve setting layout, lighting, and key elements
@Image 4: [optional style reference] — match the visual style and colour palette
```

If the user doesn't have reference images yet, the output file's first section should be a "Generate references first" block with a short GPT Image 2 prompt for producing each reference asset before running the page prompts.

### Step 6: Write the GPT Image 2 page prompts

Follow the structure in `references/page-prompt-structure.md`. Each page prompt has these mandatory sections, in this order:

1. **Deliverable label** — `Create a single comic page titled "[PAGE TITLE]" — page [N] of [TOTAL] from "[PROJECT TITLE]".`
2. **Format spec** — `Format: [aspect ratio] comic page, [grid spec, e.g. "2x3 grid of six equal panels"], [thin black panel borders, white gutters of [N]px between panels].`
3. **Style anchor reference** — `[Apply shared style anchor.]`
4. **Reference image declaration** — `@Image 1: ..., @Image 2: ...` etc.
5. **Character anchor (one-time)** — describe each character ONCE with their physical traits and signature wardrobe; subsequent panels reference them by name only. This is the opposite of `gpt-image-story`'s pattern (where wardrobe is repeated every frame) — for comics, GPT Image 2's training data favours one-time anchoring
6. **Panel-by-panel breakdown** — for each panel: `Panel [N] ([SHOT TYPE], [ANGLE]): [SCENE DESCRIPTION]. [CHARACTER ACTION/EXPRESSION]. [Speech bubble: "EXACT DIALOGUE" — speaker name]. [Caption box: "EXACT NARRATION"]. [SFX: "WORD" — graphic style]`
7. **Lettering directives** — speech bubbles with tails pointing at the speaker, caption boxes for narration (typically yellow rectangles in classic style), SFX as graphic onomatopoeia integrated into the panel art
8. **Quality directive** — `Quality: high. Use Thinking mode if available. Size: [exact dimensions].`
9. **Hard constraints** — `Maintain character design across all panels. No watermarks, no real brand logos, no extra speech bubbles, no extra text outside the specified verbatim dialogue, captions, and SFX. Render all dialogue, captions, and SFX text exactly as quoted.`

**The three text types in comics are distinct and must be prompted distinctly:**

- **Speech bubbles** (rounded, with tail) — for dialogue. Always: `Speech bubble (tail to [SPEAKER]): "[EXACT WORDS]"`
- **Caption boxes** (rectangular, often yellow) — for narration, scene-setting, time-of-day labels. Always: `Caption box (top-left/bottom): "[EXACT WORDS]"`
- **SFX** (sound effects as graphic onomatopoeia, integrated into the art, not in a bubble) — for sounds and impacts. Always: `SFX integrated into panel art: "[EXACT WORD]" in [STYLE — e.g. "bold red jagged letters"]`

Quote every text element. Don't quote scene descriptions or character actions — those are prose direction for the model.

### Step 7: Assemble the markdown file

Use `references/output-template.md` as the file shape. Write to `/mnt/user-data/outputs/[project-slug]-comic-prompts.md` and call `present_files` on it.

The output file must contain:

- Header block: project title, format (portrait/landscape), total page count, model (`gpt-image-2`), recommended size, quality (`high`), style anchor summary
- Shared style anchor as a blockquote at the top (visible, copy-pasteable, used by every page prompt)
- Reference image inventory: one row per reference image, clearly numbered, with a brief description of what it should depict and what the user should attach in that slot
- (If references not yet generated) A "Generate references first" section with a short GPT Image 2 prompt for producing each reference asset
- **One section per page**, in order, each containing:
  - Page header: `## Page [N] — [Page title / scene name]`
  - Page meta line: `[N] panels · [grid spec] · [aspect ratio] · ends on [final-panel beat type]`
  - The full page prompt in a fenced code block, ready to paste
- Generation notes: cross-page consistency tips, iteration strategy, when to regenerate vs. edit, batch-running guidance

### Step 8: Summarise and hand off

After presenting the file, give the user a 6-12 line summary covering:

- The premise in one sentence and why you chose this page split
- Which style you picked and why
- The reference-image plan: which references they need, whether they already have them or need to generate them first
- The running order: paste prompt 1 with refs → get page 1 → paste prompt 2 with the SAME refs → get page 2 → and so on
- The most likely failure mode for this specific story (character drift, location drift, dialogue paraphrase, panel count error) and the fix
- A reminder that consistency is reference-driven — running pages without the references attached will produce a series of unrelated images, not a strip

## Critical patterns

These patterns come from OpenAI's GPT Image 2 cookbook, the Imagine.art and fal.ai prompting guides, and the structural conventions of Western comics. Skipping them produces worse output.

**The N-panel grid is a strict layout, not a suggestion.** Don't ask GPT Image 2 for "a comic page with several panels" — that produces vague illustration. Specify the exact grid (`2x3 grid of six equal-sized rectangular panels`) and the exact gutter (`white gutters of 8px between panels`). For variable masonry, name the layout precisely (`one large splash panel taking the top half, three smaller equal panels in a row beneath`).

**Anchor characters once at the top of the page prompt, then refer by name.** Comics work on visual repetition — GPT Image 2's training data has the character described in detail in a model sheet or first-appearance panel, then referenced as "the character" or by name in subsequent panels. This is the *opposite* of the `gpt-image-story` pattern (where I repeat wardrobe every frame). For comics, anchor once and trust the reference image to do the rest.

**Reference images are not optional for multi-page work.** A single page can sometimes hold consistency from prompt text alone. Two or more pages without reference images almost always drift — different face shapes, different wardrobe, different room layouts. Always include the reference inventory section, even if the user hasn't provided references yet (in that case, propose generating them first).

**The three text types must be specified distinctly.** Mixing "speech bubbles" and "captions" and "SFX" into one bag means the model picks one and ignores the others, or worse, draws all three identically. Speech bubbles are rounded with tails; caption boxes are rectangular and often coloured (yellow in classic American style); SFX are integrated graphic onomatopoeia, not lettered in bubbles. Spell each out separately, every time.

**Quote every line of text that needs to render.** GPT Image 2's text rendering is one of its biggest strengths but it only works reliably when the exact string is in quotes and labelled by role. `"Not on my watch!" — speech bubble, tail to STARDUST` is correct; `Stardust shouts something defiant` is paraphrase-bait.

**Use Thinking mode for multi-panel pages.** The OpenAI cookbook and multiple third-party guides confirm Thinking mode noticeably improves layout planning, panel-count accuracy, and text placement on multi-panel work. It costs more and takes longer; it's worth it for comics. Mention this in every output's generation notes.

**Iteration beats re-rolling.** If page 3's panel 4 is wrong, use `images.edit` with `input_fidelity: "high"` and a single-change instruction (`"keep everything; fix only panel 4 to show STARDUST punching the villain rather than the villain punching her"`). If the whole page is off, regenerate that page only — don't re-run earlier pages just because a later one failed.

**For long runs (5+ pages), use the previous page as a style-memory reference.** Add the most recently generated page as `@Image [N+1]: previous comic page from the same series — match this exact rendering style, line weight, and colour palette` to the next page prompt. This compounds consistency across long sequences much better than relying on character/location refs alone.

## Reference files

- `references/page-prompt-structure.md` — the 9-part structure for each page prompt, with a worked example
- `references/style-classic-american.md` — default style anchor (Stan Lee energy, bold inks, halftone, dramatic compositions)
- `references/style-ligne-claire.md` — alternate (Tintin, clean line, flat colour, restrained)
- `references/style-manga.md` — alternate (clean ink, screentone, expressive eyes, panel rhythm)
- `references/style-indie-zine.md` — alternate (loose hand-line, limited palette, photocopier feel)
- `references/style-newspaper.md` — alternate (simple, daily-paper, ~4-panel gag, sparse colour)
- `references/output-template.md` — the shape of the final markdown file
- `references/example-tucker-and-jenny.md` — a full worked example (a 2-page slice-of-life comic) showing exactly what a finished output file looks like
