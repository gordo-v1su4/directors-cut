# Seedance 2 R2V anime video prompt structure

Every video prompt this skill generates uses Seedance 2's **R2V (Reference-to-Video) mode** with the e-conte storyboard sheet as `@Image 1`. R2V is the right mode here because the e-conte image carries the cut list, character design, location, and visual register — Seedance reads all of that from the image and uses the text prompt to specify pacing, dialogue, and camera dynamics.

## Why R2V (not T2V or I2V)

- **T2V** (text-to-video) ignores the e-conte entirely. Use only when no storyboard exists.
- **I2V** (image-to-video) treats the input image as the *opening frame* of the video and animates outward from it. That's wrong for an e-conte — the e-conte isn't the first frame, it's the entire shot plan.
- **R2V** treats the input image as a **reference asset** for cut order, composition, character design, and visual register. Seedance 2's official launch material uses this pattern explicitly: "Refer to the shooting script in @Image 1, and draw on the storyboard, shot scale, camera movement, visuals and copy in @Image 1."

This skill always generates R2V prompts.

## The 7 parts

### 1. Mode declaration

Open with the standard Seedance R2V opener, anime-flavoured:

```
Refer to the anime e-conte storyboard sheet in @Image 1. Follow the cut order, cut sizes,
camera movement, character positions, dialogue, and visual register shown in the storyboard.
```

This sentence is load-bearing. It tells Seedance to interpret @Image 1 as a *plan* rather than as an opening frame. Drop this line and the model treats the e-conte as the first frame and tries to animate the production-board layout itself, which is a disaster.

The word "register" matters. "Visual style" works too, but "visual register" cues Seedance more strongly toward anime-trained data when paired with the word "anime" earlier in the line.

### 2. Optional reference assets

If the user has separate character, location, or prop reference images, declare them with the @Image syntax. Seedance 2 supports up to 12 reference assets per generation:

```
The character "[Name A]" (Japanese: "[romaji]") is from @Image 2 — preserve hair, eye colour,
hairstyle, uniform, and signature accessories exactly.
The character "[Name B]" is from @Image 3.
The location ([location name]) is from @Image 4 — match the painted anime background-art style
of @Image 4 across all environment shots.
The key prop ([prop name]) is from @Image 5.
```

If no separate references exist (the e-conte's character grid is the only reference), skip this section. The character turnaround grid embedded in the e-conte image is usually enough for character consistency, but anime characters drift more aggressively than live-action, so dedicated character reference images help noticeably more here than they do for live-action work.

When references *are* provided, always specify their *purpose* — Seedance 2's docs are explicit that vague references degrade quality. "@Image 2 for character" is worse than `The character "Yuki" is from @Image 2; preserve hair colour (long black with red ribbon), eye colour (dark brown), hairstyle, and navy sailor uniform exactly across all cuts.`

### 3. Scene spine in one sentence

Repeat the premise as a single sentence so the model has the through-line in text as well as in the image:

```
Scene: [premise in one sentence, e.g. "A first-year girl meets a third-year boy on the
school rooftop at sunset and finally confesses, the wind teasing her hair as she
forces the words out."]
```

Seedance 2 handles the scene spine better when it's restated in plain text. The e-conte tells the model *what each cut looks like*; the spine tells the model *what the through-line is*. For anime, the spine is also where the emotional register lives (confession / reunion / battle / parting / quiet moment) — use that vocabulary.

### 4. Numbered cut list

Repeat the eight beats from the e-conte, each with cut size, timing, and dialogue in double quotes. Use the exact same wording as the e-conte's cell captions — Seedance lip-syncs from the dialogue text in the prompt, and any drift between the e-conte's quoted dialogue and the video prompt's dialogue causes the actor's mouth to say something different from what the board shows. This is more pronounced in anime than live-action because anime mouth shapes are stylised and the model has to align quoted text to a small set of mouth poses.

```
Cut list (follow in order, total ~14 seconds):
  1. (2.0s) Wide static establishing — empty rooftop at golden hour, wind teasing
     the chain-link fence. Distant city. SFX: wind, distant train.
  2. (1.5s) Medium two-shot — Yuki (long black hair, red ribbon, navy sailor
     uniform) and Haruto (short brown hair, gakuran) face each other at the railing.
  3. (1.5s) Close-up on Yuki, slow zoom in — hesitant, pink across nose bridge:
     "ano, senpai..."
  4. (1.5s) Close-up on Haruto, static — surprised, eyes slightly widened: "Yuki...?"
  5. (1.0s) Insert macro — Yuki's hand grips the railing tighter, knuckles paling.
  6. (2.0s) Medium on Yuki, slight push-in — eyes shut, brow tense, voice cracking:
     "zutto, suki deshita."
  7. (2.0s) Close-up on Haruto, held — wide-eyed, breath caught, golden-hour
     light across his face.
  8. (2.5s) Wide held closer — both at the railing, Haruto stepping a half-step closer.
     Wind rises. Held final beat.
```

Match the e-conte's dialogue **word for word, romanisation and all**. If the e-conte has `Yuki: "zutto, suki deshita."` (lowercase, comma, period), the video prompt also has `"zutto, suki deshita."` Do not "clean up" the dialogue or convert romanisation systems.

**Default to Japanese for dialogue unless the user explicitly wrote English.** Anime is in Japanese. Seedance 2's anime-trained data mostly has Japanese voicing, and English in an anime register often produces uncanny dub-mismatch. If the user wrote dialogue in English, you can keep it as-is; if you romanise to Japanese, do it accurately and stick to one romanisation system (Hepburn is safest).

### 5. Camera and pacing direction

A single line for camera language, a single line for aspect ratio, and a single line for pacing/duration:

```
Camera: cuts and movements as marked in the e-conte (held frames default; slow zoom on Cut 3;
slight push-in on Cut 6). Anime-style restrained camera — no whip pans, no shaky cam,
no camera gear visible. Smooth cuts between shots.
Aspect ratio: 16:9 (or 9:16 / 1:1 — match the e-conte's orientation).
Duration: approximately [N] seconds total ([per-cut breakdown if helpful]).
```

Seedance 2 understands cinematographic vocabulary directly. For anime register, prefer **anime-typical camera language**:

- `held frame` (anime defaults to held frames; restate this for slice-of-life and atmospheric registers)
- `slow zoom in` / `slow zoom out`
- `slight push-in` / `slight pull-out`
- `pan across` (often used for environment establishing)
- `tilt up to sky` (very common anime cliche, but powerful)
- `whip pan` (only for shonen action register)
- `impact frame` (shonen action — single still frame with speed lines, then resume motion)
- `dolly along railing` (atmospheric / Shinkai-style)
- `tracking shot` (combat sequences)

Avoid generic "dynamic camera movement" — anime uses restraint by default. Over-stating movement is a top failure mode for anime-style AI video.

For duration, default to **12-15 seconds for an 8-cut anime sequence** (~1.5-2s per cut, with one or two longer held beats). Slice-of-life can run slightly longer per cut (1.8-2.5s); shonen action runs faster (0.8-1.2s). Seedance 2 supports 4-15 second durations; longer than 15 requires multiple generations stitched.

### 6. Audio direction

Four short lines covering ambient, music, dialogue treatment, and SFX:

```
Audio:
- Ambient: [from e-conte's audio panel, e.g. "wind through chain-link fence, distant train,
  faint city hum"]
- Music: [from e-conte, e.g. "soft piano with strings, slice-of-life slow-tempo bed,
  rising slightly across Cut 6 to Cut 8 — KyoAni-flavoured emotional restraint"]
- Dialogue: characters speak the quoted lines in [language, e.g. "Japanese, soft
  conversational delivery"], lip-synced to the on-screen action.
- SFX: [if applicable, e.g. "single fence-rattle on Cut 5 hand grip, soft footstep on Cut 8"]
```

Seedance 2's native audio is one of its main features — it generates synchronised dialogue, ambient sound, music, and SFX in one pass. Use this. Don't strip the audio direction to save prompt length.

For anime music direction, **genre tags help**: `J-pop OP`, `slice-of-life piano bed`, `shonen orchestral hit`, `Shinkai-flavoured strings`, `city pop`, `lo-fi anime bed`, `mecha electronic`, `enka`. These tags pull Seedance toward the right musical register more reliably than generic descriptors.

### 7. Style anchor

One short sentence pinning the visual register back to the e-conte's mood, repeating the key descriptors from the e-conte's lighting and post-process panels and naming the studio/director reference:

```
Style: [one or two sentences naming the anime register and the studio/director reference,
e.g. "Modern TV anime register: clean digital lineart, soft cel shading, large expressive
eyes, KyoAni-flavoured character design and golden-hour palette, slight bloom on highlights,
subtle film grain — the same look as the e-conte storyboard sheet."]
```

The phrase "the same look as the e-conte storyboard sheet" is helpful — it explicitly tells Seedance to match the storyboard's visual register, not just its layout.

**Always name a studio or director.** "Anime style" is too vague. "KyoAni-flavoured", "Ghibli-flavoured", "Shinkai-flavoured", "MAPPA-flavoured", "ufotable-flavoured", "Trigger-flavoured" all give Seedance much stronger priors than generic "anime".

## Length budget

Keep the whole video prompt **under ~220 words**. Seedance 2's documentation says under 200 is the sweet spot — anime cuts can run slightly longer because anime cinematographic vocabulary is denser, but resist creep beyond 220.

If the prompt exceeds 220 words, the most likely culprits are:
- Section 4 (cut list) over-describing each cut — keep each beat to one line
- Section 7 (style anchor) repeating things already in the e-conte — trim it to one sentence
- Section 2 (reference assets) over-explaining purpose — one short phrase per reference is enough

## Full worked example

This is the full Seedance 2 R2V prompt for a rooftop confession scene in modern TV anime register:

```
Refer to the anime e-conte storyboard sheet in @Image 1. Follow the cut order, cut sizes,
camera movement, character positions, dialogue, and visual register shown in the storyboard.

Scene: A first-year girl meets a third-year boy on the school rooftop at sunset and
finally confesses, the wind teasing her hair as she forces the words out.

Cut list (follow in order, total ~14 seconds):
  1. (2.0s) Wide static establishing — empty rooftop at golden hour, wind teasing the
     fence. SFX: wind, distant train.
  2. (1.5s) Medium two-shot — Yuki (long black hair, red ribbon, navy sailor uniform)
     and Haruto (short brown hair, gakuran) face each other at the railing.
  3. (1.5s) Close-up on Yuki, slow zoom in — pink nose bridge: "ano, senpai..."
  4. (1.5s) Close-up on Haruto, static — surprised: "Yuki...?"
  5. (1.0s) Insert macro — Yuki's hand grips the railing, knuckles paling.
  6. (2.0s) Medium on Yuki, slight push-in — eyes shut: "zutto, suki deshita."
  7. (2.0s) Close-up on Haruto, held — wide-eyed, breath caught.
  8. (2.5s) Wide held closer — Haruto steps half-closer. Wind rises. Held final beat.

Camera: held frames default; slow zoom Cut 3; slight push-in Cut 6. Anime-restrained
camera, no whip pans, no shaky cam. Smooth cuts.
Aspect ratio: 16:9. Duration: ~14 seconds total.

Audio:
- Ambient: wind through chain-link fence, distant train, faint city hum
- Music: soft piano + strings, slice-of-life bed, KyoAni-flavoured restraint
- Dialogue: Japanese, soft conversational delivery, lip-synced
- SFX: single fence-rattle on Cut 5, soft footstep on Cut 8

Style: Modern TV anime register: clean digital lineart, soft cel shading, large expressive
eyes, KyoAni-flavoured character design and golden-hour palette, slight bloom, subtle
grain — the same look as the e-conte storyboard sheet.
```

That's ~245 words including formatting and code-block decoration — slightly above target but readable; Seedance handles it. Trim by collapsing the audio bullets into one line if needed.

## Common failure modes and fixes

**Seedance animates the e-conte layout itself instead of the cuts within it.** Section 1's "refer to" opener is missing or weakened. Fix by keeping the exact opener verbatim — it's the load-bearing instruction that puts Seedance into R2V interpretation mode.

**Characters look slightly off-model from the e-conte's character grid.** No separate character reference images were provided AND the e-conte's character grid wasn't strong enough. Anime drift is worse than live-action drift. Fix by either (a) generating dedicated character reference images first and adding them as @Image 2, @Image 3 with explicit "preserve hair colour, hairstyle, eye colour, and uniform" notes, or (b) regenerating the e-conte with a richer character turnaround panel and more aggressive hair+wardrobe repetition in every cut's action line.

**Dead eyes / lifeless expressions.** Section 4's cut list under-described expressions. Fix by naming the expression for each cut ("wide-eyed surprise", "narrowed eyes, gritted teeth", "soft smile, downcast gaze").

**Lip-sync says different words than the dialogue in the e-conte.** Section 4's dialogue lines drifted from the e-conte's quoted dialogue. Fix by copy-pasting the dialogue verbatim from the storyboard prompt to the video prompt — never retype.

**Pacing is off — cuts are all the same length and the emotional timing dies.** Section 4 didn't specify per-cut timing. Fix by including the per-cut second values in parentheses at the start of each cut, as in the worked example above.

**Audio is muddy or generic, or music sounds wrong-genre.** Section 6 was too short or used a generic descriptor. Fix by being specific about the music genre tag (`KyoAni-flavoured slice-of-life piano`, `shonen orchestral hit`, `Shinkai-flavoured emotional strings`) — these tags pull Seedance toward anime-trained musical priors.

**Result looks like Western illustration with anime filters, not actual anime.** The style anchor in section 7 didn't name a studio/director, or named one too generically. Fix by naming a specific reference (KyoAni / MAPPA / ufotable / Ghibli / Shinkai / Hosoda / Trigger / WIT / Madhouse) — Seedance's training has stronger associations with named studios than with descriptive terms.

**Video is shorter or longer than expected.** Seedance 2 caps at 15 seconds per generation. For longer pieces, generate in halves with the e-conte as reference for both, then edit together.
