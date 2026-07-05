# Output template — markdown file shape

Every output file this skill produces follows this shape. Replace the placeholders in `[brackets]` and paste the appropriate sections from the chosen style anchor.

```markdown
# [Project Title] — Wuxia Storyboard & Video Prompts

**Pipeline:** Story → Jianghu → Storyboard → Clip
**Storyboard model:** `gpt-image-2` · Size `1536x1024` (or `2560x1440` if calligraphic title and label density runs high) · Quality `high`
**Video model:** `Seedance 2 (seedance-2.0)` · R2V mode · ~12-15 seconds · 16:9
**Directorial mode:** [CLASSICAL (King Hu register) / DECONSTRUCTIVE (Tsui Hark / The Blade register) / HINGE — opens classical, breaks at shot N]
**Style:** [one-line style description, e.g. "Deconstructive wuxia production board with vérité bamboo-forest photography"]

## At a glance

- **Premise:** [one-sentence premise]
- **Format:** [e.g. single-sequence wuxia / wuxia ad / wuxia music video]
- **Combatants:** [N], single jianghu location ([location name])
- **Weapons:** [list, e.g. "jian (Master Bai), dao (Disciple Yan)"]
- **Shots:** [N] (typically 8)
- **Tone keywords:** [3-5 keywords from the storyboard's mood panel]
- **Mode rationale:** [one sentence on why this mode was chosen — e.g. "Deconstructive because the source material describes an ambush of an unsuspecting traveller, with no face-off, no salute, and a survival-not-honour outcome — all classical-code violations."]

---

## Shared style anchor (paste into Prompt 1)

> [Paste the full style anchor paragraph from the relevant style-classical-board.md or style-deconstructive-board.md file here, verbatim. For HINGE mode, paste the classical anchor and add the hinge-mode note from the deconstructive anchor.]

---

## Prompt 1 — GPT Image 2 wuxia storyboard sheet

Paste this prompt into GPT Image 2 (via OpenAI API, fal.ai, Higgsfield, ImagineArt, or any frontend) at size `1536x1024` and quality `high`. The output is a single image of the wuxia production board.

\```
[Full GPT Image 2 storyboard prompt following the 11-part structure
from references/storyboard-prompt-structure.md.

Includes the deliverable label, the on-board MODE DECLARATION, canvas directive,
header bar contents (with palette swatches and mode chip), combatant + weapon
reference rows, environment + top-down choreography plan with combatant flow lines
and path-of-blade arcs, eight-frame storyboard strip with verbatim dialogue and
weapon SFX, four lower panels (light/mood/audio/cinematography),
the [Apply shared style anchor.] reference, the quality directive, and
the hard constraints (including no anachronisms / no firearms) — all in one
continuous prompt.]
\```

**If the calligraphic title or stencil title comes back garbled,** bump to `2560x1440` (still within GPT Image 2's reliable zone).
**If a single frame's dialogue or weapon is wrong,** use `images.edit` with `input_fidelity: "high"` and a single-change instruction ("keep everything; fix only frame 5's caption to read exactly 'the strike happens just outside frame; only the body falling into shot is visible. Mud splash.'") rather than re-rolling the whole board.
**If the MODE DECLARATION chip is missing or paraphrased,** use `images.edit` to add it back to the top-right of the header verbatim.

---

## Prompt 2 — Seedance 2 R2V wuxia video

Once the storyboard image is generated, paste this prompt into Seedance 2 (via fal.ai, Replicate, Morphic, OpenArt, or the official ByteDance API) with the storyboard image attached as the **first reference asset (@Image 1)**.

[List any additional reference images needed:
- @Image 2: dedicated reference of [Combatant A] (recommended for combatant consistency)
- @Image 3: dedicated reference of [Combatant B]
- @Image 4: dedicated weapon close-up — STRONGLY RECOMMENDED for any clip with a distinctive weapon (curved dao, double-blades, flying-claw, three-section-staff, whip). The weapon close-up is the single biggest lever for stopping weapon drift.
- @Image 5: location reference (optional)

Otherwise note: "No additional reference images needed — the storyboard's combatant grid and weapon close-up are sufficient." For wuxia clips with a distinctive weapon, gently push for @Image 4 even if not explicitly requested.]

\```
[Full Seedance 2 R2V prompt following the 7-part structure from
references/video-prompt-structure.md.

Opens with the "Refer to the wuxia storyboard sheet in @Image 1..." mode declaration,
followed by the wuxia-specific "Render in [MODE] wuxia register..." line,
declares any additional reference images,
restates the wuxia spine (location, initiator, weapon, outcome register),
lists the 8 shots with verbatim dialogue and weapon SFX,
sets mode-appropriate camera/pacing direction,
sets audio direction (ambient, score with named instruments, weapon SFX, silence treatment),
closes with the mode-aware style anchor.

Keep under ~220 words.]
\```

**Settings:**
- Aspect ratio: `16:9` (recommended for wuxia — landscape rewards composed framing)
- Duration: `[N] seconds` (default 12-15s for an 8-shot sequence; classical mode often benefits from the upper end of this range, deconstructive mode from the lower)
- Resolution: `720p` (Seedance 2's reliable max; some endpoints offer 1080p)
- Audio: enabled (Seedance 2's native audio handles dialogue, ambient, score, weapon SFX, and silence in one pass — wuxia clips depend on this)

---

## Generation notes

A few patterns worth knowing when you iterate:

- **The two prompts are coupled.** The dialogue, weapon names, and weapon SFX in Prompt 2 must match Prompt 1 word-for-word, including capitalisation and quote style. Seedance lip-syncs from the prompt text and SFX-syncs from quoted sounds; any drift causes desynchronisation.
- **Mode commitment is non-negotiable.** Both prompts state the directorial mode in writing. Don't soften it. If the clip averages classical and deconstructive cues, it's because one or both prompts equivocated on the mode.
- **Run the storyboard first, then the video.** The video prompt depends on having the storyboard image ready as `@Image 1`. Don't try to run them in parallel.
- **Generate dedicated weapon close-up reference if the weapon is distinctive.** This is the single biggest lever for stopping weapon drift in the clip. Worth doing for any wuxia clip with a curved dao, paired blades, flying-claw, three-section-staff, or whip.
- **Iteration beats re-rolling.**
  - For the storyboard: use `images.edit` with `input_fidelity: "high"` and single-change instructions. Common single-change targets: a frame's dialogue or weapon SFX line, the MODE DECLARATION chip, a combatant's robe colour drift.
  - For the video: regenerate with the same storyboard image but a more specific dialogue/camera/weapon line for the shot that's off.
- **Combatant-and-weapon drift across storyboard frames** is the most common wuxia failure mode. If you see weapons changing type between frames (jian becoming dao), regenerate the storyboard with a richer weapon close-up panel and more specific weapon descriptors.
- **If Seedance ignores the storyboard layout** and just animates the production-board image itself, the "Refer to the wuxia storyboard sheet in @Image 1..." opener was weakened. Restore it verbatim.
- **If the clip rescues a deconstructive scene into a clean classical look** (the visual register fights the shot list), the storyboard's visual style was insufficiently deconstructive. Regenerate the storyboard with the full deconstructive-board anchor, ensuring the body is mud-toned and the title is stencilled, not calligraphic.
- **For longer pieces** (>15 seconds), generate Seedance in two halves with the storyboard as @Image 1 in both, then edit them together. The boundary between halves should fall on a clean cut between two shots, not inside a choreographic phrase.
- **No anachronisms.** GPT Image 2 will sometimes interpret "ambush" or "marketplace" with a modern visual register. The hard-constraints line in Prompt 1 names this; if it slips through anyway, use `images.edit` to remove the offending item.

[Add any project-specific notes — e.g. "Frame 6 (the leap) involves fast aerial choreography; if Seedance struggles, regenerate that shot in isolation with a more detailed action description and stitch it in." or "The hinge break at shot 4 is the load-bearing moment of the clip; if the visual register doesn't shift cleanly between shots 3 and 4, regenerate the storyboard with stronger atmospheric load on frames 4-8."]
```

## Filename convention

Write the file to:

```
/mnt/user-data/outputs/[project-slug]-wuxia-prompts.md
```

Where `[project-slug]` is derived from the project title:
- Lowercase
- Hyphens instead of spaces
- No special characters other than hyphen
- Reasonably short (aim for under 40 chars)

Examples:
- "The Bamboo Ambush" → `bamboo-ambush-wuxia-prompts.md`
- "Master Bai's Last Lesson" → `master-bai-last-lesson-wuxia-prompts.md`
- "The Forgemaster's Daughter" → `forgemasters-daughter-wuxia-prompts.md`

If the user didn't give the project a title, infer one from the premise (e.g. an ambush in a bamboo grove → "The Bamboo Ambush" or "Dusk Through Bamboo") and use it.

## Section structure rules

- Two prompts only — Prompt 1 (storyboard) and Prompt 2 (video). Always in that order.
- Each prompt in its own fenced code block, ready to copy.
- The directorial mode is named explicitly in the header block AND inside both prompts. The "At a glance" block carries a mode-rationale sentence.
- Style anchor appears ONCE at the top as a blockquote, not repeated in each prompt body.
- Both prompts reference the anchor with `[Apply shared style anchor.]` (Prompt 1) or by visual restatement at the end (Prompt 2).
- Generation notes section is mandatory — it's where the user learns to iterate rather than re-roll, and where the mode-specific failure modes are surfaced.
- The "At a glance" block near the top is the human-readable summary; everything else is for copy-paste into model frontends.
