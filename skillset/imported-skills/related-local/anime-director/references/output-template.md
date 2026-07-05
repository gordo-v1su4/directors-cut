# Output template — markdown file shape

Every output file this skill produces follows this shape. Replace the placeholders in `[brackets]` and paste the appropriate sections from the chosen anime register style anchor.

```markdown
# [Project Title] — Anime E-conte & Video Prompts

**Pipeline:** Idea → E-conte → Anime Video
**Storyboard model:** `gpt-image-2` · Size `[W×H from Step 5, e.g. 1536×1024 landscape]` · Quality `high`
**Video model:** `Seedance 2 (seedance-2.0)` · R2V mode · ~[N] seconds · [aspect ratio]
**Anime register:** [register name + studio reference, e.g. "Modern TV anime — KyoAni-flavoured slice-of-life"]
**Orientation:** [Landscape 16:9 / Portrait 9:16 / Square 1:1]

## At a glance

- **Premise:** [one-sentence premise]
- **Format:** [e.g. TV anime cut / OVA scene / OP-style montage / AMV / cinematic film clip]
- **Characters:** [N] named ([brief tags]), single location ([location name])
- **Cuts:** [N] (typically 8)
- **Tone keywords:** [3-5 keywords from the e-conte's mood panel — Japanese terms welcome]
- **Total duration:** ~[N] seconds

---

## Shared anime style anchor (paste into Prompt 1)

> [Paste the full style anchor paragraph from the relevant style-*.md file here, verbatim.]

---

## Prompt 1 — GPT Image 2 e-conte storyboard sheet

Paste this prompt into GPT Image 2 (via OpenAI API, fal.ai, Higgsfield, ImagineArt, or any frontend) at size `[W×H]` and quality `high`. The output is a single image of the anime production board.

\```
[Full GPT Image 2 e-conte prompt following the 10-part structure
from references/storyboard-prompt-structure.md.

Includes the deliverable label, canvas directive (landscape OR portrait variant),
header bar contents (with optional Japanese subtitle), character turnaround grid
section, location plate + floorplan, eight-cell e-conte strip with verbatim
dialogue and timing, four lower panels (lighting/mood/audio/direction),
the [Apply shared anime style anchor.] reference, the quality directive, and
the hard constraints — all in one continuous prompt.]
\```

**If the labels come back garbled,** bump to `2560×1440` landscape (or `1440×2560` portrait — both still within GPT Image 2's reliable zone).
**If a single cell's dialogue is wrong,** use `images.edit` with `input_fidelity: "high"` and a single-change instruction ("keep everything; fix only Cut 3's caption to read exactly 'Yuki: \"ano, senpai...\"'") rather than re-rolling the whole board.
**If a character's hair colour or uniform drifts between cells,** the wardrobe/hair descriptor wasn't repeated aggressively enough — regenerate with the descriptor in EVERY cell's action line.

---

## Prompt 2 — Seedance 2 R2V anime video

Once the e-conte storyboard image is generated, paste this prompt into Seedance 2 (via fal.ai, Replicate, Morphic, OpenArt, or the official ByteDance API) with the e-conte image attached as the **first reference asset (@Image 1)**.

[If applicable, list any additional reference images the user has supplied:
- @Image 2: dedicated reference of [Character A] (preserve hair colour, eye colour, uniform exactly)
- @Image 3: dedicated reference of [Character B]
- @Image 4: location reference (match background-art style)
- @Image 5: prop reference
- ...
Otherwise note: "No additional reference images needed — the e-conte's character grid is sufficient."]

\```
[Full Seedance 2 R2V prompt following the 7-part structure from
references/video-prompt-structure.md.

Opens with the "Refer to the anime e-conte storyboard sheet in @Image 1..." mode declaration,
declares any additional reference images with their purpose,
restates the scene spine, lists the 8 cuts with timing in parentheses and
verbatim dialogue, sets camera/pacing direction with anime-specific vocabulary,
sets audio direction (with music genre tag), closes with the style anchor
naming the studio/director reference.

Keep under ~220 words.]
\```

**Settings:**
- Aspect ratio: `[16:9 / 9:16 / 1:1]` — must match the e-conte's orientation
- Duration: `[N] seconds` (default 12-15s for slice-of-life / cinematic; 10-12s for shonen action)
- Resolution: `720p` (Seedance 2's reliable max; some endpoints offer 1080p)
- Audio: enabled (Seedance 2's native audio handles dialogue, ambient, music, and SFX in one pass)

---

## Generation notes

A few patterns worth knowing when you iterate:

- **The two prompts are coupled.** The dialogue in Prompt 2 must match the dialogue in Prompt 1 word-for-word, including capitalisation, romanisation system, and quote style. Seedance lip-syncs from the prompt text, and any drift causes the actor's mouth to say something different from what the e-conte shows. Anime mouth shapes are stylised and small dialogue mismatches are more visible than in live-action.
- **Run the e-conte first, then the video.** The video prompt depends on having the e-conte image ready as `@Image 1`. Don't try to run them in parallel.
- **Iteration beats re-rolling.**
  - For the e-conte: use `images.edit` with `input_fidelity: "high"` and single-change instructions.
  - For the video: regenerate with the same e-conte image but a more specific dialogue/expression line for the cut that's off.
- **Anime character drift across cells is the most common failure.** If you see hair colour, eye colour, or uniform drift, regenerate the e-conte with the descriptor repeated in every cell's action line — not just the character reference grid.
- **Dead eyes / dead expressions** mean the action lines didn't specify the expression. Regenerate the affected cut with explicit expression direction ("wide-eyed surprise, slight blush across nose bridge", "narrowed eyes, gritted teeth", "downcast gaze, lips parted").
- **If Seedance ignores the e-conte layout** and just animates the production-board image itself, the "Refer to the anime e-conte storyboard sheet in @Image 1..." opener was weakened. Restore it verbatim.
- **If the result looks like Western illustration with anime filters rather than actual anime,** the studio/director reference in the style anchor wasn't strong enough. Re-state it in both prompts and consider switching registers if the source register doesn't match the scene's tone.
- **For longer pieces** (>15 seconds), generate Seedance in halves with the e-conte as @Image 1 in both, then edit them together. Seedance 2 caps at 15 seconds per generation.
- **Default to Japanese for dialogue** unless the user specified English. Anime in Japanese hits Seedance's anime-trained data harder than English-dialogue anime.

[Add any project-specific notes — e.g. "Cut 5 (railing grip insert) involves macro hand detail; if Seedance struggles, regenerate that cut in isolation with a more specific action line and stitch it in via editing."]
```

## Filename convention

Write the file to:

```
/mnt/user-data/outputs/[project-slug]-anime-storyboard-prompts.md
```

Where `[project-slug]` is derived from the project title:
- Lowercase
- Hyphens instead of spaces
- No special characters other than hyphen
- Reasonably short (aim for under 40 chars)
- Romanised for Japanese titles (use Hepburn)

Examples:
- "Rooftop Confession" → `rooftop-confession-anime-storyboard-prompts.md`
- "Okujou no Kokuhaku" → `okujou-no-kokuhaku-anime-storyboard-prompts.md`
- "The Last Train Home" → `last-train-home-anime-storyboard-prompts.md`
- "Mecha Pilot Awakening" → `mecha-pilot-awakening-anime-storyboard-prompts.md`

If the user didn't give the project a title, infer one from the premise (e.g. a confession scene → "Rooftop Confession" or "Okujou no Kokuhaku") and use it.

## Section structure rules

- Two prompts only — Prompt 1 (e-conte) and Prompt 2 (video). Always in that order.
- Each prompt in its own fenced code block, ready to copy.
- Anime style anchor appears ONCE at the top as a blockquote, not repeated in each prompt body.
- Both prompts reference the anchor — Prompt 1 with `[Apply shared anime style anchor.]`, Prompt 2 by visual restatement at the end.
- The studio/director reference name (KyoAni, Ghibli, ufotable, Shinkai, etc.) MUST appear in both prompts. This is a non-negotiable anti-AI-slop measure.
- Generation notes section is mandatory — it's where the user learns to iterate rather than re-roll.
- The "At a glance" block near the top is the human-readable summary; everything else is for copy-paste into model frontends.
