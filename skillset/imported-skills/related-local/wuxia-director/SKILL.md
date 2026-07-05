---
name: wuxia-director
description: Generate a markdown file with two ready-to-paste prompts — (1) a GPT Image 2 prompt for a wuxia production board (in the Classical King-Hu or Deconstructive Tsui-Hark / The Blade register), and (2) a Seedance 2 R2V prompt that turns that board into a short wuxia clip. Use whenever a user provides a wuxia story idea, fight beat, jianghu vignette, swordplay sequence, bamboo-forest set piece, courtyard duel, or marketplace ambush and wants storyboard or video prompts. Also trigger on "wuxia storyboard", "make a wuxia scene", "Tsui Hark style storyboard", "King Hu style production board", "bamboo forest fight prompt", "jianghu scene prompts", "deconstructive wuxia clip", "Seedance prompt for a wuxia scene", or any mention of GPT Image 2 / Seedance alongside wuxia, xia, jianghu, swordplay, or martial-arts material. Always use when the deliverable is a coordinated pair of image+video prompts in a wuxia register, even when the user does not say "storyboard" explicitly.
---

# Wuxia Director — Storyboard & Video Prompt Generator

Turn any wuxia story idea — a duel beat, a temple ambush, a bamboo-forest pursuit, a jianghu vignette, a fight from a screenplay, a chapter from a martial-arts novel, or just a few lines of conversation about a sword and a grudge — into a coordinated **pair** of ready-to-paste prompts:

1. **A GPT Image 2 prompt** that produces a wuxia production board / director's planning sheet — title bar in calligraphic ink-on-paper style, character + weapon reference (multi-angle), set design with top-down choreography plan and combatant flow lines, an 8-shot storyboard with camera/lens/movement notes, lighting and mood guidance, audio/score philosophy, and a directorial-mode declaration (Classical or Deconstructive). The image looks like a real wuxia DP's pre-production guide.
2. **A Seedance 2 R2V prompt** that uses that storyboard image (and optional character/weapon reference images) to generate the actual short wuxia clip, following the storyboard beat-for-beat in the chosen mode.

Together these unlock a **Story → Jianghu → Storyboard → Clip** workflow: one input becomes two prompts, two prompts become one image, one image becomes one video. The skill's job is to write those two prompts well enough that the chain holds together — and to make a deliberate, defensible choice between Classical and Deconstructive wuxia style, since that single decision drives almost every other choice on the board.

## When to use this skill

Trigger whenever the user provides wuxia-flavoured narrative source material and wants storyboard or video prompts. Source material can be:

- A wuxia story beat ("the master ambushes the apprentice in a bamboo grove at dusk")
- A fight scene from a screenplay or treatment
- A passage from a wuxia novel (Jin Yong, Gu Long, Liang Yusheng, etc.) or fanfic
- A duel concept, ambush concept, or vignette set in the jianghu
- A chapter or beat from prose fiction with a martial-arts register
- A GDD cinematic, cutscene, or in-game vignette for a wuxia-styled game
- A conversation in which a wuxia scene was discussed
- A character sheet for a *xia* (sword saint, errant nun, blade-master, blind swordsman, etc.) the user wants to dramatise
- A beat list the user already wrote out as `1) ... 2) ... 3) ...` in a wuxia register

The skill is for **prompt generation**, not image or video generation. The deliverable is always a single markdown file containing the two prompts plus brief generation notes.

If the user only wants the storyboard image (no video), still produce both prompts — the video prompt is cheap to generate and useful to have. If they only want the video prompt, ask whether they have an existing storyboard image to reference; if they don't, propose generating both.

## The two directorial modes — the load-bearing decision

Wuxia cinema operates along a spectrum between two formally rigorous poles. Every storyboard this skill produces commits to one of them. The choice is not stylistic decoration; it determines camera support, framing, clarity, choreography legibility, atmospheric content, editing rhythm, and even the moral universe of the clip.

**Classical mode** (King Hu *Dragon Inn* / *A Touch of Zen* / Tsui Hark *Once Upon a Time in China*): camera as proscenium, motivated movement only, silhouette discipline, symmetrical composition, choreographed grace, honoured combat, clean atmospheric surface. The frame is a display case. Mistakes are hidden. The fantasy must not be punctured.

**Deconstructive mode** (Tsui Hark *The Blade*): vérité documentary inside the wuxia world, handheld and long-lens alternation, withheld clarity (violence outside frame or obscured), operator-visible camerawork, double-cuts and withholdings, atmospheric frame-filling (wind, rain, fire, dust, mud), violated chivalric code, flawed and isolated heroes who fight for survival rather than honour.

A deliberate **hinge** between the two is also possible — staging a beat in classical grammar precisely so the model can break it (a ceremonial face-off that ends with a dishonourable cut, a daydream shot classical that hard-cuts to vérité reality). When a hinge is intended, both modes inform the prompts; the storyboard captions name where the break occurs.

Read `references/directorial-modes.md` before drafting either prompt. It is the most important reference in the skill.

## Workflow

Follow these steps in order. The skill's quality lives or dies on Step 1 (extracting the wuxia spine), Step 4 (committing to a mode), and Step 6 (writing tight, mode-aware shot descriptions). Don't shortcut any of them.

### Step 1: Read the source material and extract the wuxia spine

If the user attached files, read them. If they pasted prose inline, work from that. If they pointed at a prior conversation, read what you need from it.

Identify and write down (as scratch notes, internally):

- **Premise** — one sentence: who, where in the jianghu, what's the friction, who has the blade
- **Characters** — name, age band, single defining trait, single defining wuxia detail (signature weapon, school, robe colour, mask, tally of kills, oath sworn). Two combatants is the sweet spot for a wuxia short; one (with environmental opposition) or three (with a witness) also works; four+ usually means the sequence should be split
- **Location** — single jianghu location is strongly preferred for a short. Common choices: bamboo forest, courtyard at dusk, mountain temple steps, riverside reeds, marketplace at noon, remote inn, snowfield, derelict shrine. If the user implies multiple, gently push back unless they're insistent
- **Beats** — the 6-10 shots that tell the duel/scene. If the user already gave you beats, use theirs verbatim. If not, infer them from the wuxia template rhythm (see Step 5)
- **Tone** — graceful (classical), brutal (deconstructive), elegiac, ceremonial, vengeful, tragic, comedic, mythic. Tone is the second strongest cue (after explicit mode requests) for choosing Classical vs Deconstructive
- **Code stance** — does the chivalric code hold (classical territory) or is it being violated (deconstructive territory)? An ambush of a monk, a master who runs, a coward hero, a duel without face-off — these are deconstructive flags. A salute before drawing, a vow honoured, a hero who prevails — classical flags

Do NOT skip this. Generic understanding produces generic prompts which produce generic boards which produce generic clips. The wuxia register punishes vagueness more than most because the genre's pleasures are specific (silhouette legibility, weapon discipline, code rituals, jianghu iconography).

### Step 2: Ask clarifying questions only when genuinely needed

Use `ask_user_input_v0` only if the source material leaves a load-bearing decision unmade. Common gaps worth asking about:

- **Directorial mode** if the source material is genuinely ambiguous: `Classical (King Hu / Once Upon a Time in China — composed, graceful, honoured combat)`, `Deconstructive (Tsui Hark The Blade — handheld, withheld clarity, brutal survival)`, `Hinge (start classical, break into deconstructive)`, `You decide based on the story`
- **Number of shots** if the user gave a story but no beat structure: `6 shots (tight duel)`, `8 shots (standard sequence)`, `10 shots (longer arc)`, `You decide`
- **Aspect ratio** if not implied: `Landscape 16:9 (cinematic)`, `Vertical 9:16 (vertical short)`, `Square 1:1 (social feed)`. Wuxia rewards landscape — only go vertical if the user is targeting TikTok/Reels distribution

If the user has already implied or specified any of these in the source material, skip the corresponding question. Tone words like "graceful" or "elegant" imply classical; words like "brutal", "muddy", "vérité", "raw" imply deconstructive. Don't ask three questions just because the skill mentions three.

### Step 3: Choose the storyboard slices

Before writing prompts, sketch the shot list. The shot rhythm depends on the directorial mode.

**Classical 8-shot rhythm** (graceful duel, ceremonial structure):

1. **Establishing wide** — locks the geography of the jianghu space (courtyard, bamboo grove, temple steps). Both combatants in frame, the architecture is visible.
2. **Salute / face-off** — both combatants face each other, weapons addressed but not yet drawn. The chivalric code is visible.
3. **First exchange wide** — the first phrase of choreography reads as a complete movement, both silhouettes legible.
4. **Mid-shot reaction** — the disadvantaged combatant resets stance.
5. **Insert / weapon detail** — sword tip, hilt grip, falling petal, robe flutter — a grounding detail.
6. **Second exchange wide** — the harder phrase, often involving a leap, parry, or signature move; silhouettes still legible.
7. **Decisive moment close** — the moment of resolution registered on a face.
8. **Wide closer** — the consequence: a body falls, the victor stands, the camera releases the audience.

**Deconstructive 8-shot rhythm** (vérité ambush, broken code):

1. **Long-lens through obstruction** — peeking through bamboo, doorway, hanging cloth at the unsuspecting target.
2. **Handheld close, late reframe** — the camera catches up to the scene already in motion.
3. **Violence withheld** — the strike happens just outside frame; only the aftermath is visible (a body falls into shot, blood flecks the wall, a sword drips).
4. **Obscured mid-shot** — combat continues but a foreground figure or weather (dust, rain) cuts the sightline.
5. **Lateral attention shift** — the camera looks away to a witness, an animal, an unrelated detail, mid-action.
6. **Frame-filling weather** — wind, dust, mud, fire, or rain dominates; combat is glimpsed within it.
7. **Operator-visible reframe** — a zoom or focus pull that arrives a beat late, finding the action after it has begun.
8. **Aftermath, not closer** — no triumphal wide. A muddy survival exit, an ambiguous tableau, the hero walking away.

**Hinge rhythm** — start with classical shots 1-3 staged composed, then break into deconstructive at the moment the code is violated (often shot 4 or 5). The board explicitly labels which shot is the hinge.

Adapt the rhythm to the story. Trust the source material.

### Step 4: Commit to a directorial mode and choose the production board style

Read `references/directorial-modes.md` for the full mode comparison. Decide between:

- Default classical → `references/style-classical-board.md` (ink-and-rice-paper aesthetic, ceremonial layout, honoured-code panels)
- Default deconstructive → `references/style-deconstructive-board.md` (mud-and-blood aesthetic, broken-grid layout, vérité panels)
- Hinge → use `style-classical-board.md` for the early-shot panels and add a "MODE BREAK" overlay declaring which shot inverts which classical signature

Adapt the colour palette to the wuxia register's mood — a dawn duel in a bamboo grove uses jade greens and ink black; a dusk ambush in a marketplace uses sodium yellow, blood red, and brown mud; a temple-steps confrontation uses cinnabar red, ash white, and stone grey.

### Step 5: Choose camera and choreography vocabulary

Before writing the storyboard prompt, pick the camera vocabulary appropriate to the mode. This goes into the cinematography panel and into each frame's caption.

**Classical camera vocabulary** (use these terms verbatim):

- Mounts: tripod, dolly track, low-angle crane, high-angle crane
- Lenses: 24mm wide for establishing, 35mm for two-shots, 50mm for masters, 85mm for the decisive close
- Movement: static, slow dolly-in, parallel tracking matching the combatant's path, controlled crane up
- Framing principles: silhouette readable against background, both combatants balanced in frame, architecture exploited (doorways, columns, gateways) for symmetry
- Choreography legibility: the camera holds long enough to see each phrase as a phrase, cuts come at natural punctuation between phrases not inside them

**Deconstructive camera vocabulary** (use these terms verbatim):

- Mounts: handheld shoulder, long-lens (200mm+) on tripod or monopod, foreground-occluded
- Lenses: 200mm long-lens for peeking shots, 18mm wide for handheld close-quarters, 50mm for late reframes
- Movement: late reframe, lateral attention shift, hesitant zoom, focus pull arriving late, sudden tilt to weather
- Framing principles: violence outside frame, within frame but obscured, or so close the lens cannot resolve it. Foreground occlusion welcomed (bamboo, hanging cloth, crowds, animals).
- Atmospheric load: wind, rain, fire, dust, mud structurally present in most frames — not decorative

Both modes should specify the **weapon in the frame** explicitly: the *jian* (straight sword), *dao* (sabre), spear, staff, double-blades, daggers, flying-claw, whip — name the weapon every time it is in shot.

### Step 6: Write the GPT Image 2 storyboard prompt

Follow the structure in `references/storyboard-prompt-structure.md`. The prompt has these mandatory sections, in this order:

1. **Deliverable label** — `Create a wuxia production board / pre-production planning sheet titled "..."`
2. **Mode declaration** — `DIRECTORIAL MODE: CLASSICAL (King Hu register)` or `DIRECTORIAL MODE: DECONSTRUCTIVE (Tsui Hark The Blade register)` or `DIRECTORIAL MODE: HINGE — opens classical, breaks at shot [N]`. This text appears verbatim on the board itself, at the top right of the header, so the artifact declares its own register.
3. **Canvas directive** — full layout spec including header band, three tiers, panel positions and proportions
4. **Header bar contents (verbatim)** — project title in calligraphic style, format/genre/duration/mode/jianghu-location, weapon and combatant counts, palette swatches, premise sentence
5. **Character + weapon reference section (verbatim)** — for each combatant: name, age band, school/lineage, three trait bullets, multi-angle photo grid (front, back, side, fighting stance, drawn-weapon close), weapon close-up, robe/accessory row
6. **Environment + choreography plan section** — set photo + top-down choreography plan with numbered camera positions, dashed combatant-flow lines (red for attacker path, blue for defender path), and "PATH OF BLADE" arcs showing weapon trajectories
7. **Storyboard strip (verbatim, 8 frames)** — each frame with: number badge, image, camera/lens label, shot size, movement, action description, dialogue or sound (in double quotes), and a small mode tag if hinge
8. **Lower panels (verbatim)** — lighting/mood notes (4 thumbnails), mood keywords block, audio/score (ambient, score style, weapon SFX, silence/percussion treatment), cinematography notes (lens choice, movement style, framing principle, post-process)
9. **Style anchor reference** — `[Apply shared style anchor.]`
10. **Quality directive** — `Quality: high.` (always)
11. **Hard constraints** — including `No watermarks, no extra labels, no real brand logos, no anachronistic items, no text outside the specified verbatim labels, no firearms.`

Every label, dialogue line, character name, school name, weapon name, camera spec, and panel heading goes in **double quotes**. GPT Image 2 paraphrases unquoted text and the board falls apart.

### Step 7: Write the Seedance 2 R2V video prompt

Follow the structure in `references/video-prompt-structure.md`. The prompt has these sections:

1. **Mode declaration** — the standard Seedance R2V opener naming the storyboard, plus an explicit directorial mode line: `Render in [CLASSICAL / DECONSTRUCTIVE / HINGE] wuxia register as specified on the storyboard.`
2. **Optional reference assets** — character portraits, weapon close-ups, location reference, declared with @Image syntax
3. **Story spine in one sentence** — restates the wuxia premise
4. **Numbered shot list** — the exact same 1-8 beats from the storyboard, each with shot size, weapon in frame, and dialogue/sound in double quotes (Seedance lip-syncs from quoted dialogue and SFX-syncs from quoted sounds)
5. **Camera and pacing direction** — appropriate to the mode (classical: composed, motivated, silhouette-legible; deconstructive: handheld, late reframes, withheld clarity)
6. **Audio direction** — ambient, score (erhu, pipa, dizi, guzheng, percussion, or modern hybrid), weapon SFX (steel ring, blade whisper, fabric snap, foot scuff), and silence treatment (classical mode often uses long silences punctuated by single percussion strikes; deconstructive mode fills with weather audio)
7. **Style anchor** — one or two sentences pinning the visual look back to the storyboard's mood and mode

Keep the video prompt under ~200 words.

### Step 8: Assemble the markdown file

Use `references/output-template.md` as the file shape. Write to `/mnt/user-data/outputs/[project-slug]-wuxia-prompts.md` and call `present_files` on it.

The output file must contain:

- Header block: project title, format, models used, recommended sizes/durations, **directorial mode** explicitly named, style anchor summary
- Shared style anchor as a blockquote (visible, copy-pasteable)
- **Prompt 1: Storyboard sheet** — the full GPT Image 2 prompt in a fenced code block, ready to paste
- **Prompt 2: Video** — the full Seedance 2 R2V prompt in a fenced code block, ready to paste, with a note about which reference images to attach in which slot
- Generation notes: iteration tips, mode-specific failure modes, when to bump quality / size / duration

### Step 9: Summarise and hand off

After presenting the file, give the user a 5-10 line summary covering:

- The premise in one sentence
- **Which directorial mode you chose and why** — this is the most important thing to surface, since it drives every downstream choice
- The shot rhythm you picked and why it suits the mode
- Which storyboard style you applied
- How to feed the output into a real workflow: "Paste Prompt 1 into GPT Image 2 → take the resulting board image → paste Prompt 2 into Seedance 2 with that image as @Image 1 (plus any character refs as @Image 2, @Image 3...)"
- Any deliberate omissions (e.g. "I cut the temple steps location — single jianghu location reads stronger in a 2-minute piece")
- A reminder that the storyboard image is load-bearing — the video prompt's quality depends on the storyboard rendering cleanly first

## Critical patterns

These patterns come from OpenAI's GPT Image 2 cookbook, ByteDance's Seedance 2 R2V documentation, the wuxia directorial grounding (King Hu, Tsui Hark, Yuen Woo-ping lineage), and the structure of real wuxia DP planning sheets. Skipping them produces a worse chain.

**Mode commitment is non-negotiable.** Every prompt names its directorial mode in writing on the board itself. Without this, GPT Image 2 averages classical and deconstructive cues into a generic martial-arts collage, and Seedance inherits that ambiguity into the clip. If a hinge is intended, name where it breaks ("MODE BREAK at shot 5: classical face-off → deconstructive ambush").

**Verbatim labels in double quotes.** GPT Image 2 locks spelling and spacing when copy is in quotes. Every project title, character name, school name, weapon name, dialogue line, camera spec, panel heading, and keyword on the production board must be in quotes in the prompt. Unquoted text gets paraphrased, and the storyboard becomes useless as a Seedance reference.

**The 8-frame strip is a strict grid.** Don't ask GPT Image 2 for "a series of storyboard panels" — that produces a vague illustration. Specify "horizontal strip of exactly eight equal-width frames, each with a number badge in the top-left, a thin caption block beneath" and the layout holds.

**Character and weapon consistency across frames is the hardest part.** Specify each character's wardrobe, physical traits, and weapon in the character reference section AND repeat the key descriptors briefly in each storyboard frame's action description. GPT Image 2 will otherwise drift hair length, robe colour, weapon type, and facial structure between frames. The weapon is as load-bearing as the face — name it every frame.

**Match dialogue and weapon-SFX word-for-word between the two prompts.** If the storyboard frame says `Master: "draw the blade"` and the soundscape says `"steel ring on steel"`, the Seedance prompt must contain both lines in identical form. Seedance lip-syncs from quoted dialogue and SFX-syncs from quoted sounds.

**Silhouette discipline (classical) and withheld clarity (deconstructive) are mutually exclusive within a single shot.** Don't ask the same frame for both. Pick one per shot. Hinge sequences alternate cleanly between them on a per-shot basis, never within a frame.

**Atmospheric content is structural in deconstructive mode, decorative in classical mode.** In a deconstructive prompt, every storyboard frame caption should mention at least one of: wind, rain, fire, dust, mud, smoke, foreground occlusion. In a classical prompt, atmosphere is named in the mood panel and applied lightly to all frames.

**`Quality: high` for the storyboard, always.** Wuxia production boards are text-dense and weapon-dense. `medium` causes calligraphic titles to garble, weapon names to drift, and floorplan combatant-flow lines to lose their numbers.

**Iteration beats re-rolling for both.** For the storyboard, if a frame comes back wrong, use GPT Image 2's `images.edit` with `input_fidelity: "high"` and a single-change instruction. For the video, if a shot is off, regenerate with the same storyboard image but a more specific dialogue/camera/weapon line for that shot. Re-rolling the whole thing wastes credits and rarely fixes the specific issue. Mention this in the generation notes section of every output.

**No firearms, no anachronisms.** The wuxia register is pre-modern. Even in deconstructive mode, the genre's vocabulary excludes guns, modern uniforms, contemporary architecture, and modern lighting fixtures. The hard-constraints line in the prompt names this explicitly because GPT Image 2 will otherwise sometimes interpret "ambush" or "marketplace" with modern visual cues.

## Reference files

- `references/directorial-modes.md` — the load-bearing reference: full comparison of Classical (King Hu) vs Deconstructive (Tsui Hark *The Blade*) modes across all dimensions, with the hinge pattern. Read this before drafting either prompt.
- `references/storyboard-prompt-structure.md` — the 11-part structure for the GPT Image 2 wuxia storyboard prompt, with mode-specific guidance for each section
- `references/video-prompt-structure.md` — the 7-part structure for the Seedance 2 R2V wuxia video prompt, with the @Image reference syntax, dialogue and weapon-SFX quoting conventions, and mode-specific camera vocabulary
- `references/style-classical-board.md` — the classical-mode style anchor (ink-and-rice-paper, ceremonial layout, honoured-code panels)
- `references/style-deconstructive-board.md` — the deconstructive-mode style anchor (mud-and-blood, broken-grid layout, vérité panels)
- `references/wuxia-iconography.md` — recurring wuxia visual motifs (bamboo forest, marketplace, temple steps, remote inn, the blade itself) treated for both modes, with prompt-ready phrasings
- `references/output-template.md` — the shape of the final markdown file
- `references/example-bamboo-ambush.md` — a full worked example (a deconstructive-mode bamboo-forest ambush) showing exactly what a finished output file looks like
