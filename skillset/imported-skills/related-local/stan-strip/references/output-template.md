# Output template — markdown file shape

Every output file this skill produces follows this shape. Replace the placeholders in `[brackets]` and paste the appropriate sections from the chosen style anchor.

```markdown
# [Project Title] — Comic Strip Prompts

**Pipeline:** Idea → Page Split → Per-Page Prompts → Comic
**Model:** `gpt-image-2` · Quality `high` · Mode: **Thinking** (recommended for multi-panel layouts)
**Format:** [Portrait 2:3 / Landscape 3:2 / Square 1:1] · `[1024x1536 / 1536x1024 / 1024x1024]`
**Style:** [one-line style description, e.g. "Classic American comic with bold inks and halftone shading"]
**Pages:** [N total]

## At a glance

- **Premise:** [one-sentence premise]
- **Format:** [portrait/landscape and aspect ratio + intended distribution]
- **Characters:** [N total — name them]
- **Locations:** [N total — name them]
- **Page count:** [N pages]
- **Tone keywords:** [3-5 keywords]

---

## Shared style anchor (prepend to every page prompt)

> [Paste the full style anchor paragraph from the relevant style-*.md file here, verbatim.]

---

## Reference image inventory

For consistency across pages, attach these reference images to **every** page prompt below in the order specified. The same `@Image N` slots are used identically across all pages.

| Slot | Role | Description | Status |
|---|---|---|---|
| `@Image 1` | Character: [Name A] | [Brief description of what this image should show] | [User to provide / Generate first / Already attached] |
| `@Image 2` | Character: [Name B] | [...] | [...] |
| `@Image 3` | Location: [Name] | [...] | [...] |
| `@Image 4` | Style reference (optional) | [...] | [...] |

[If references not yet generated, include this block:]

### Generate references first

Before running the page prompts, generate the reference images using these prompts. Each produces a clean reference asset that the page prompts will preserve.

**Reference 1 — Character: [Name A]**

\```
[GPT Image 2 prompt for a clean three-quarter portrait of Character A showing face, hair, signature wardrobe.
1024x1024 size, quality high, neutral background, neutral expression. Specifies all the canon details
in this single anchor image so subsequent pages can preserve them.]
\```

**Reference 2 — Character: [Name B]** [...etc...]

**Reference 3 — Location: [Name]** [...etc...]

Once you have the reference images, save them and attach them in the matching slots when running each page prompt below.

---

## Page running order

Run the page prompts below **in numbered order**, attaching the same reference images to every prompt. For pages 2 onwards, optionally also attach the most recently generated page as `@Image [last+1]: previous comic page — match the exact rendering style, line weight, and colour palette` to compound consistency.

---

## Page 1 — [Page title / scene name]

**Meta:** [N] panels · [grid spec, e.g. "2x3 grid"] · [aspect ratio] · ends on [final-panel beat type — gag / reveal / cliffhanger / emotional landing / etc.]

\```
[Full GPT Image 2 page prompt following the 9-part structure from
references/page-prompt-structure.md.

Includes the deliverable label, format spec, [Apply shared style anchor.] reference,
reference image declaration, character anchor (one-time), panel-by-panel breakdown
(numbered, with shot type, scene description, character action, speech bubbles with
tail directions, caption boxes with placement, SFX with visual style), lettering directives,
quality directive, and hard constraints — all in one continuous prompt.]
\```

---

## Page 2 — [Page title / scene name]

**Meta:** [N] panels · [grid spec] · [aspect ratio] · ends on [final-panel beat type]

\```
[Full GPT Image 2 page prompt for page 2. Same structure as page 1.
Reference declaration includes @Image [last+1]: previous page. Character anchor can be
slightly more concise on pages 2+ since references carry the visual specifics.]
\```

---

[... continue for all pages ...]

---

## Generation notes

A few patterns worth knowing when you run this:

- **Always attach the reference images.** Running these prompts without `@Image` references will produce a series of unrelated illustrations, not a coherent strip. The same `@Image N` slots map to the same characters/locations across every page.
- **Use Thinking mode if your endpoint exposes it.** Multi-panel comic layouts benefit significantly from layout planning. The OpenAI cookbook explicitly recommends Thinking mode for comic pages and other multi-zone work.
- **Run pages in order.** For pages 2+, attaching the previously-generated page as an additional reference (`@Image [last+1]: previous comic page — match the exact rendering style`) compounds consistency much better than relying on character/location refs alone.
- **Iteration beats re-rolling.**
  - For a single bad panel: use `images.edit` with `input_fidelity: "high"` and a single-change instruction (`"keep everything; fix only panel 4 to show [correct action]"`).
  - For a whole bad page: regenerate just that page; don't re-run earlier pages.
  - For cross-page drift: regenerate the drifting page with the previous page added as a style reference.
- **Common failure modes for this story specifically:**
  - [Insert story-specific notes here — e.g. "[Character X]'s glasses are easy to drop; if missing, regenerate that panel only with the glasses called out specifically."]
  - [E.g. "Page 3 panel 5 has the climactic SFX 'KRA-KOOM' — if it lands as text in a speech bubble instead of as integrated panel art, regenerate with the SFX line strengthened."]
- **For long runs (5+ pages),** consider running in batches of 3-5 with the last page of the previous batch as an anchor for the next batch's first page.
- **For multilingual / international distribution,** generate the page once with English text, then use `images.edit` to swap the lettering — preserving the art and panel layout while changing only the dialogue/captions/SFX. This is dramatically more reliable than re-rolling the whole page in a different language.

[Add any project-specific notes — e.g. "Page 4 contains the climactic action sequence with multiple SFX; if the layout comes back muddy, regenerate that page in isolation with the variable masonry layout described more emphatically."]
```

## Filename convention

Write the file to:

```
/mnt/user-data/outputs/[project-slug]-comic-prompts.md
```

Where `[project-slug]` is derived from the project title:
- Lowercase
- Hyphens instead of spaces
- No special characters other than hyphen
- Reasonably short (aim for under 40 chars)

Examples:
- "Tucker and Jenny" → `tucker-and-jenny-comic-prompts.md`
- "The Last Croissant" → `last-croissant-comic-prompts.md`
- "Scuffed Epoch Origin Story" → `scuffed-epoch-origin-comic-prompts.md`

If the user didn't give the project a title, infer one from the premise.

## Section structure rules

- **One fenced code block per page prompt**, in numbered order, ready to copy.
- Style anchor appears ONCE at the top as a blockquote, not repeated in each prompt body.
- Reference image inventory appears ONCE at the top as a clear table — every page prompt declares the same `@Image N` mapping.
- "Generate references first" section is included whenever the user hasn't provided references — it's the on-ramp to actually using the file.
- Generation notes section is mandatory and includes story-specific failure-mode warnings, not just generic ones.
- The "At a glance" block near the top is the human-readable summary; everything else is for copy-paste into model frontends.

## Page count guidance

- **1 page (single-strip output)**: Treat as one fenced prompt, skip the "running order" section, simplified header.
- **2-5 pages**: Standard format, one section per page with full prompt.
- **6-10 pages**: Standard format. Add a recommendation in generation notes to run in batches of 3-5.
- **10+ pages**: Same format but warn explicitly about consistency drift over long runs and propose strategies (stronger anchor references, running in batches, generating intermediate "style memory" pages to use as references for later batches).
