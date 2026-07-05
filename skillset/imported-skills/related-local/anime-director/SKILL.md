---
name: anime-director
description: Generate a markdown file with two ready-to-paste prompts for anime scene production — (1) a GPT Image 2 prompt for an anime e-conte / production board (a 2K storyboard sheet locking character design, layout, and shot order), and (2) a Seedance 2 R2V prompt that turns that board into a finished anime video clip. Use whenever a user provides an anime story idea, manga panel, light novel passage, scene beat, OVA concept, AMV idea, OP/ED storyboard, or game cutscene plan and wants anime storyboard prompts, anime video prompts, or an Idea→Storyboard→Anime-video workflow. Also trigger on "anime e-conte", "anime production board", "anime storyboard prompt", "Seedance prompt for an anime scene", "turn this into an anime scene", or any mention of anime / shonen / shojo / seinen / mecha / isekai / Ghibli / KyoAni / MAPPA / Shinkai alongside a narrative request for storyboard or video prompts. Always use this skill when the deliverable is in an anime register, even without "e-conte" or "storyboard" said explicitly.
---

# Anime Director — Anime Storyboard & Video Prompt Generator

Turn any anime story idea — a beat, a manga page, a light novel passage, a scene from an OVA pitch, a GDD cutscene, an AMV concept, or a few lines of dialogue — into a coordinated **pair** of ready-to-paste prompts:

1. **A GPT Image 2 prompt** that produces an anime production board / hybrid e-conte sheet — title bar with Japanese + English titles, character + costume reference grid (multi-angle character sheet style), location/set design with top-down camera plan, an 8-shot storyboard strip rendered as authentic e-conte panels (cut number, timing, dialogue column, action notes), lighting and mood guidance, audio/tone, and direction philosophy. The image looks like a real episode director's pre-production guide.
2. **A Seedance 2 R2V prompt** that uses that storyboard image (and optional character/object reference images) to generate the actual short anime video clip, following the e-conte beat-for-beat in a chosen anime visual register.

Together these unlock an **Idea → Story → E-conte → Anime Video** workflow: one input becomes two prompts, two prompts become one image, one image (plus optional refs) becomes one anime clip. The skill's job is to write those two prompts well enough that the chain holds together and the result reads as anime — not as live action with anime filters, and not as generic illustration.

## When to use this skill

Trigger whenever the user provides narrative source material AND an anime register is implied or requested. Source material can be:

- A short anime scene idea or beat ("two students confess on a rooftop at sunset")
- A manga panel or page sequence to adapt as a moving scene
- A passage from a light novel or web novel
- An anime opening / ending storyboard concept
- An AMV beat-sheet or music video concept in anime style
- A GDD cutscene, in-engine cinematic, or visual novel set-piece
- A chapter or scene from prose fiction the user wants rendered as anime
- A doujin / fan-fiction short the user wants to visualise
- A list of beats the user already wrote out as `1) ... 2) ... 3) ...` with anime register implied

The skill is for **prompt generation**, not image or video generation. The deliverable is always a single markdown file containing the two prompts plus brief generation notes.

If the user only wants the storyboard image (no video), still produce both prompts — the video prompt is cheap to generate and useful to have. If they only want the video prompt, ask whether they have an existing storyboard image to reference; if they don't, propose generating both.

If the user has supplied character reference images, location reference images, or prop reference images, note them in the output and wire them into Prompt 2 as `@Image 2`, `@Image 3`, etc. (with `@Image 1` always being the storyboard sheet generated from Prompt 1).

## Workflow

Follow these steps in order. The skill's quality lives or dies on Step 1 (understanding the scene), Step 4 (choosing the right anime register), and Step 6 (writing tight, specific shot descriptions in anime cinematographic vocabulary). Don't shortcut any of them.

### Step 1: Read the source material and extract the scene spine

If the user attached files, read them. If they pasted prose inline, work from that. If they pointed at a prior conversation or reference images, read what you need from them.

Identify and write down (as scratch notes, internally):

- **Premise** — one sentence: who, where, what's the emotional or dramatic friction
- **Characters** — name, age band, archetype (tsundere, kuudere, genki, stoic, etc. — but only when actually relevant to the scene), single defining hairstyle/silhouette note, single defining costume note. Two characters is the sweet spot for a 12-15 second anime cut; one or three is workable; four+ usually means the scene should be split or the prompt should focus on a smaller group within it
- **Location** — single location is strongly preferred for a short anime cut. Be specific about anime-typical locations (classroom, school rooftop, train station platform, convenience store at night, shrine steps, ramen shop, mecha cockpit, isekai forest clearing) — these have strong visual priors in anime
- **Beats** — the 6-10 cuts (shots) that tell the scene. If the user already gave you beats, use theirs verbatim. If not, infer them
- **Tone** — slice-of-life, romance, comedy, action, melancholy, ecchi (skip — keep it tasteful), horror, mecha, isekai, sports, etc. Tone determines colour palette, lighting, lens choices, and pacing
- **Format hint** — TV episode cut, OVA scene, anime opening, anime ending, music video / AMV style, cinematic film clip (Ghibli / Shinkai), short-form social media. Tells you what the production board's "format" tag should say
- **Anime register hint** — does the source material lean modern-clean (KyoAni / MAPPA), classic-cel (Ghibli / 90s OVA), shonen-action (Demon Slayer / JJK), or atmospheric-cinematic (Shinkai / Mamoru Hosoda)? If the user explicitly named a studio or director, lean that direction. If not, infer from tone or ask in Step 2

Do NOT skip this. Generic understanding produces generic prompts which produce generic boards which produce generic anime that looks like an AI filter. The whole chain compounds.

### Step 2: Ask clarifying questions only when genuinely needed

Use `ask_user_input_v0` only if the source material leaves a load-bearing decision unmade. Common gaps worth asking about:

- **Anime register** if the source material is ambiguous about visual style: `Modern TV anime (KyoAni / MAPPA — clean digital, soft palette)`, `Classic cel / Ghibli (warm paint, grain, hand-drawn feel)`, `Shonen action (Demon Slayer / JJK — bold lines, dynamic effects)`, `Atmospheric cinematic (Shinkai / Hosoda — photo-real backgrounds, lens flare)`
- **Number of cuts** if the user gave a story but no beat structure: `6 cuts (tight)`, `8 cuts (standard)`, `10 cuts (longer arc)`, `You decide based on the scene`
- **Aspect ratio / orientation** if not implied: `Landscape 16:9 (TV / OVA / cinematic — default)`, `Vertical 9:16 (TikTok / Reels / Shorts AMV)`, `Square 1:1 (Instagram feed AMV)`
- **Format** if ambiguous: `Slice-of-life TV cut`, `Action sequence`, `OP / ED montage style`, `Music video / AMV`, `Cinematic film clip`

If the user has already implied or specified any of these in the source material, skip the corresponding question. Do not ask three questions just because the skill mentions four. Ask only what is genuinely undecided.

### Step 3: Choose the e-conte cut list

Before writing prompts, sketch the cut list. A good 8-cut anime scene usually follows one of these rhythms:

**Slice-of-life / dialogue rhythm:**
1. Establishing wide of the location (often empty for a beat — the "anime breath")
2. Wide two-shot — both characters in frame, scene begins
3. Close-up A — first character speaks
4. Close-up B — reaction or counter-line
5. Insert / detail — hand on a textbook, falling cherry blossom, clock, train passing
6. Medium — physical movement, a gesture, a turn
7. Close-up — emotional peak / key line
8. Wide closer — both characters again, the held final beat (anime endings often hold longer than western endings)

**Action rhythm:**
1. Wide environment shot — the field, the alley, the rooftop
2. Hero's eye-line cut — what they see
3. Close-up on hero — resolve, weapon ready
4. Wide action — first clash / movement
5. Speed-line insert — the impact frame
6. Close-up reaction — the cost of the move
7. Wide aftermath — the consequence
8. Hold on hero's silhouette — the final beat

**OP/ED montage rhythm:**
- 8 atmospheric beats, looser narrative, heavier on environment, light play, and held silhouettes. Music does the through-line; the cuts are visual rhymes rather than story beats.

Adapt the rhythm to the scene. A confession scene might need 10 cuts to breathe. A combat exchange might need 6 quick ones. Trust the source material.

### Step 4: Choose the anime register style

Read the relevant style anchor file. **The register choice is the single biggest lever for whether the final video looks like anime or like AI slop.** Pick deliberately, not by default.

- Modern TV anime (KyoAni / MAPPA / Trigger / WIT — clean digital, soft palette) → `references/style-modern-tv-anime.md`
- Classic cel / Ghibli / 90s OVA (warm paint, grain, hand-drawn) → `references/style-classic-cel.md`
- Shonen action (Demon Slayer / JJK / MHA — bold lines, dynamic effects, sakuga) → `references/style-shonen-action.md`
- Atmospheric cinematic (Shinkai / Hosoda — photo-real backgrounds, lens flare, dramatic skies) → `references/style-atmospheric-cinematic.md`

The user's source material may explicitly invoke a studio or director (e.g. "Ghibli-like", "in the style of Mob Psycho", "Akira-feel"). If so, pick the closest register and note the studio/director reference verbatim in the style anchor section of the output file — this gives Seedance 2 a stronger prior.

### Step 5: Choose orientation and sizing

GPT Image 2 reliably produces 2K-class output at the following sizes. Pick based on the project's distribution channel:

- **Landscape 16:9 cinematic / TV / OVA / film clip** → `1536×1024` baseline; bump to `2560×1440` if the e-conte panel strip looks dense
- **Portrait 9:16 vertical / TikTok / Reels / Shorts AMV / mobile** → `1024×1536` baseline; bump to `1440×2560` for label-heavy boards
- **Square 1:1 Instagram feed AMV** → `1024×1024` baseline; bump to `1440×1440` for label-heavy boards

The aspect ratio of the storyboard image must match the aspect ratio of the final video — otherwise Seedance 2's R2V mode misreads the e-conte panels' framing. State the orientation clearly in the canvas directive (Step 6) and again in the video prompt's pacing line (Step 7).

If portrait was chosen, the layout flips: the three tiers stack into a tall column rather than wide rows, the eight-cut e-conte strip becomes a 4×2 grid (4 across, 2 down) rather than a 1×8 strip, and the lower panels stack rather than sit side by side. The canvas directive in Step 6 needs to spell this out.

### Step 6: Write the GPT Image 2 storyboard prompt

Follow the structure in `references/storyboard-prompt-structure.md`. The prompt has these mandatory sections, in this order:

1. **Deliverable label** — `Create an anime production board / hybrid e-conte planning sheet titled "..."`
2. **Canvas directive** — landscape OR portrait, with explicit tier/grid percentages (the structure file has both layouts)
3. **Header bar contents (verbatim)** — Japanese title (in romaji or kana, optionally), English title, format, genre, episode/cut numbering placeholder, duration, creative constraints, color palette swatches, general context
4. **Character reference section (verbatim)** — anime-style character sheet (turnaround sheet) for each character: name, age, archetype tag, three trait bullets, multi-angle character grid (front, back, side, three-quarter, expression sheet), wardrobe/accessory row drawn as an anime-style item callout
5. **Environment section** — anime background-art style location plate (in the visual style of an anime *bijutsu* / haikei / background-art layout) + top-down camera plan with numbered camera positions and a dashed "path of action" line
6. **E-conte storyboard strip (verbatim, 8 panels)** — each panel rendered as a Japanese-style e-conte cell with: cut number badge, panel image in the chosen anime register, narrow column on the right of the panel (or beneath it in portrait) holding "CUT [N]", "TIMING [seconds]", "ACTION [description]", "DIALOGUE [in double quotes]", "SFX [optional]"
7. **Lower panels (verbatim)** — lighting/mood notes (4 thumbnails with anime-style captions), mood keywords block (icon + label pairs), audio/tone (ambient sound, music style, score reference if any — many anime cuts have a known composer style cue), direction notes (lens analogue, animation movement style, visual philosophy, post-process)
8. **Style anchor reference** — `[Apply shared anime style anchor.]`
9. **Quality directive** — `Quality: high.` (always — production boards are text-dense)
10. **Hard constraints** — `No watermarks, no extra labels, no real anime studio logos, no real character likenesses, no text outside the specified verbatim labels.`

Every label, dialogue line, character name, cut number, timing value, and panel heading goes in **double quotes**. GPT Image 2 paraphrases unquoted text and the e-conte falls apart.

### Step 7: Write the Seedance 2 R2V video prompt

Follow the structure in `references/video-prompt-structure.md`. The prompt has these sections:

1. **Mode declaration** — `Refer to the anime e-conte storyboard sheet in @Image 1. Follow the cut order, cut sizes, camera movement, character positions, dialogue, and visual style shown in the storyboard.` (R2V opener, anime-flavoured)
2. **Optional reference assets** — character / location / prop references as `@Image 2`, `@Image 3`, etc., each with explicit purpose
3. **Scene spine in one sentence** — restates the premise so the model has the through-line in text as well as in the image
4. **Numbered cut list** — the same 1-8 beats from the e-conte, each with cut size, timing, and dialogue in double quotes (Seedance lip-syncs from quoted dialogue; anime mouths still need word-matching)
5. **Camera and pacing direction** — anime cinematographic vocabulary (`pan across`, `slow zoom`, `held frame`, `quick cut`, `speed lines`, `impact frame`), aspect ratio reminder, total duration
6. **Audio direction** — ambient sound, music bed (often genre-tagged like "J-pop OP", "city pop slice-of-life", "shonen orchestral hit"), dialogue treatment (Japanese language is the safest default for anime register; English dub voice tag if the user explicitly wants English), SFX cues
7. **Style anchor** — one or two sentences pinning the anime register back to the storyboard's look (e.g. "modern TV anime: clean digital lineart, soft pastel palette, KyoAni-flavoured warm light, the same look as the storyboard sheet")

Keep the video prompt under ~220 words — Seedance 2 handles concise structured prompts noticeably better than dense ones. Anime prompts can run slightly longer than live-action because anime cinematographic vocabulary is denser.

### Step 8: Assemble the markdown file

Use `references/output-template.md` as the file shape. Write to `/mnt/user-data/outputs/[project-slug]-anime-storyboard-prompts.md` and call `present_files` on it.

The output file must contain:

- Header block: project title (with optional Japanese subtitle), format, models used (`gpt-image-2` for image, `Seedance 2 / seedance-2.0` for video), recommended size and orientation, anime register, total duration
- Shared anime style anchor as a blockquote (visible, copy-pasteable)
- **Prompt 1: E-conte storyboard sheet** — the full GPT Image 2 prompt in a fenced code block, ready to paste
- **Prompt 2: Anime video** — the full Seedance 2 R2V prompt in a fenced code block, ready to paste, with a note about which reference images to attach in which slot (storyboard sheet always `@Image 1`; user-supplied references after that)
- Generation notes: anime-specific iteration tips, failure modes (off-model character drift, dead eyes, mouth-shape mismatch), when to bump quality / size / duration

### Step 9: Summarise and hand off

After presenting the file, give the user a 5-10 line summary covering:

- The premise in one sentence and why you chose this cut rhythm
- Which anime register you picked and why (mention the studio/director reference if the user invoked one)
- Which orientation/size you chose and why
- How to feed the output into a real workflow: "Paste Prompt 1 into GPT Image 2 → take the resulting e-conte sheet → paste Prompt 2 into Seedance 2 with the e-conte as @Image 1 (plus any character/location refs as @Image 2, @Image 3...)"
- Any deliberate omissions (e.g. "I dropped the fourth character — three is the comfortable ceiling for a 14-second anime cut")
- A reminder that the e-conte image is load-bearing — the video prompt's quality depends on the e-conte rendering cleanly first, especially the character grid for character consistency

## Critical patterns

These patterns come from OpenAI's GPT Image 2 cookbook, ByteDance's Seedance 2 R2V documentation, and the structural conventions of real Japanese e-conte sheets used in TV anime production. Skipping them produces a worse chain.

**Verbatim labels in double quotes.** GPT Image 2 locks spelling and spacing when copy is in quotes. Every project title (including any Japanese title romaji), character name, dialogue line, cut number, timing value, panel heading, and keyword on the production board must be in quotes in the prompt. Unquoted text gets paraphrased, and the e-conte becomes useless as a Seedance reference.

**The 8-cut strip is a strict grid.** Don't ask GPT Image 2 for "a series of e-conte panels" — that produces a vague illustration. Specify "horizontal strip of exactly eight equal-width e-conte cells" (landscape) or "4-by-2 grid of exactly eight equal e-conte cells, read left-to-right then top-to-bottom" (portrait), each with a cut-number badge in the top-left, a thin caption block beneath/beside, and the layout holds.

**Character consistency across cuts is the hardest part of anime generation.** Anime characters drift hair colour, eye colour, hairstyle, and uniform between frames more aggressively than live-action characters drift in Western storyboards. Specify each character's hair colour and style, eye colour, and signature wardrobe element verbatim in the character reference section AND repeat the key descriptors briefly in each e-conte cell's action description. Otherwise GPT Image 2 will subtly drift the character between cells. The character turnaround sheet (front / back / three-quarter / side / expression sheet) is the most important section in the whole board for downstream consistency.

**Match dialogue word-for-word between the two prompts.** If the e-conte panel says `Yuki: "ne, senpai..."`, the Seedance prompt must also say `Yuki: "ne, senpai..."` — exact same words, exact same quote style, same language. Seedance lip-syncs from the dialogue text in the prompt, and any drift between the storyboard's dialogue and the video prompt's dialogue causes the actor's mouth to say something different from what the board shows. This is more pronounced in anime than live-action because anime mouth shapes are stylised and the model has to align quoted text to a small set of mouth poses.

**Default to Japanese for dialogue unless the user asks for English.** Anime is in Japanese. Seedance 2's anime-trained data mostly has Japanese voicing. If the user wrote dialogue in English, you can offer to keep it as-is OR provide a romanised Japanese translation alongside; default to the user's language but mention the option.

**Choose the anime register deliberately and re-state it in both prompts.** The single most common failure of anime-style AI video is "AI anime" — slightly off-model character faces, slightly wrong eye-shape, dead expressions. The fix is to pick a specific register (modern TV / classic cel / shonen action / atmospheric cinematic), name a studio or director as a stylistic anchor (the style anchor file does this), and repeat that anchor verbatim in the e-conte prompt and the Seedance prompt.

**Keep the video prompt concise.** Seedance 2's docs are explicit that under ~200 words is the sweet spot; anime cuts can run to ~220 because anime cinematographic vocabulary is denser. The storyboard image is doing most of the heavy lifting — the text prompt mostly needs to point at it, list the cuts with timing, and give pacing/audio direction.

**`Quality: high` for the storyboard, always.** Production boards are text-dense by definition. `medium` causes labels to garble, character names to drift, and the cut-number badges to lose their numbers — and on anime sheets, character faces in the turnaround grid lose consistency.

**Iteration beats re-rolling for both.** For the e-conte, if a panel comes back wrong, use GPT Image 2's `images.edit` with `input_fidelity: "high"` and a single-change instruction. For the video, if a cut is off, regenerate with the same e-conte image but a more specific dialogue/camera line for that cut. Re-rolling the whole thing wastes credits and rarely fixes the specific issue.

**Anime-typical failure modes to watch for:**
- *Dead eyes / dead expression* — under-specified character expression in the panel action line. Fix: name the expression explicitly ("wide-eyed surprise, slight blush across nose bridge", "narrowed eyes, gritted teeth, gekiga lighting on the brow")
- *Mouth shape doesn't match dialogue* — dialogue text drifted between Prompt 1 and Prompt 2. Fix: copy-paste verbatim
- *Hair colour shifts cut to cut* — hair colour wasn't repeated in each cell's action line. Fix: include `Yuki (long black hair, red ribbon)` at the start of every action line where she appears
- *Background looks like a photo with anime characters pasted on it* — the location plate wasn't specified as anime *haikei* (background-art) style. Fix: add `painted anime background-art style, soft brush texture, slightly desaturated, in the manner of a TV anime location plate` to the environment section

## Reference files

- `references/storyboard-prompt-structure.md` — the 10-part structure for the GPT Image 2 e-conte prompt, with both landscape and portrait layout variants and a full reverse-engineered example
- `references/video-prompt-structure.md` — the 7-part structure for the Seedance 2 R2V prompt, with anime-specific cinematographic vocabulary and dialogue-quoting conventions
- `references/style-modern-tv-anime.md` — KyoAni / MAPPA / Trigger / WIT modern-clean register
- `references/style-classic-cel.md` — Ghibli / 90s OVA / Madhouse classic-cel register
- `references/style-shonen-action.md` — Demon Slayer / JJK / MHA shonen-action register
- `references/style-atmospheric-cinematic.md` — Shinkai / Hosoda atmospheric-cinematic register
- `references/output-template.md` — the shape of the final markdown file
- `references/example-rooftop-confession.md` — a full worked example (a rooftop confession scene in modern TV anime register) showing exactly what a finished output file looks like
