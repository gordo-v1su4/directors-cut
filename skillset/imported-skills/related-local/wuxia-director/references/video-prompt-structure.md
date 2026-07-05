# Seedance 2 R2V wuxia video prompt structure

Every wuxia video prompt this skill generates uses Seedance 2's **R2V (Reference-to-Video) mode** with the storyboard sheet as `@Image 1`. R2V is the right mode here because the storyboard image carries the shot list, combatant look, weapons, set, choreography flow, and mode declaration — Seedance reads all of that from the image and uses the text prompt to specify pacing, dialogue, sound design, and camera dynamics.

## Why R2V (not T2V or I2V)

- **T2V** (text-to-video) ignores the storyboard entirely. Use only when no storyboard exists.
- **I2V** (image-to-video) treats the input image as the *opening frame* of the video and animates outward from it. Disastrously wrong for a wuxia storyboard — the model would try to animate the production-board layout itself.
- **R2V** treats the input image as a **reference asset** for shot order, composition, combatant look, weapon shape, choreography flow, and visual register. This is what Seedance 2's official launch material recommends for shooting-script handoffs.

This skill always generates R2V prompts.

## The 7 parts

### 1. Mode declaration

Open with the standard Seedance R2V opener that names the storyboard explicitly, AND a wuxia-specific second sentence that names the directorial register:

```
Refer to the wuxia storyboard sheet in @Image 1. Follow the shot order, shot sizes,
camera movement, combatant positions, weapon trajectories, dialogue, and visual style
shown in the storyboard.

Render in [CLASSICAL (King Hu register) / DECONSTRUCTIVE (Tsui Hark The Blade register)
/ HINGE — opens classical, breaks at shot N] wuxia register as specified on the
storyboard's MODE DECLARATION.
```

Both sentences are load-bearing. The first puts Seedance into R2V interpretation mode (treating @Image 1 as a plan rather than as an opening frame). The second names the directorial register in text — so even if Seedance reads the on-image MODE DECLARATION imperfectly, the text prompt also names it. Drop either line and the model averages classical and deconstructive cues.

### 2. Optional reference assets

If the user has separate combatant, weapon, or location reference images, declare them with the @Image syntax. Seedance 2 supports up to 12 reference assets per generation:

```
The combatant "[Name A]" is from @Image 2 — preserve robe, hair, build, and facial
structure exactly.
The combatant "[Name B]" is from @Image 3.
The weapon ([jian / dao / spear / staff / etc.]) close-up is from @Image 4 — preserve
blade length, hilt wrap, pommel, and sheath exactly.
The location is from @Image 5.
```

If no separate references exist (the storyboard's combatant grid + weapon close-up is the only reference), skip this section. The grid embedded in the storyboard image is usually enough — but for wuxia, **a dedicated weapon close-up as @Image 4 noticeably improves weapon consistency** in the clip. Recommend it whenever the weapon is a distinctive design (curved dao, double-blades, flying-claw, three-section-staff, whip).

When references *are* provided, always specify their *purpose* and what to preserve. Vague references degrade quality.

### 3. Story spine in one sentence

Repeat the premise as a single sentence so the model has the through-line in text as well as in the image:

```
Story: [premise in one sentence, e.g. "At dusk in a bamboo forest, a mud-spattered
bandit ambushes an unsuspecting traveller, the strike happens just outside frame, and
the traveller's body falls into the mud as the wind carries the sound of distant
crows."]
```

For wuxia, the spine should explicitly name (a) the jianghu location, (b) the combatant who initiates, (c) the weapon engaged, and (d) the outcome register (decisive duel for classical, ambush/aftermath for deconstructive). Seedance handles the through-line better when these four are restated in plain text alongside the image.

### 4. Numbered shot list

Repeat the eight beats from the storyboard, each with shot size, weapon in frame, and dialogue/sound in double quotes. Use the exact same wording as the storyboard's frame captions — Seedance lip-syncs from quoted dialogue and SFX-syncs from quoted sounds, and any drift between the storyboard's quoted lines and the video prompt's quoted lines causes desynchronisation between mouth and audio.

**Classical example shot list:**

```
Shot list (follow in order, each shot ~1.5-2 seconds):
  1. Wide establishing — temple courtyard at dawn. Master Bai (white robes, jian)
     and Disciple Yan (blue training robe, dao) at opposite ends. Stone steps,
     filtered light.
  2. Two-shot close — both face each other, salute exchanged. Sound: "single
     percussion strike, low".
  3. Wide first exchange — first choreographic phrase, both silhouettes legible.
     Yan: "Master, I must" (resolved).
  4. Mid-shot reaction — Yan resets stance. Robes settle.
  5. Insert close — Bai's grip tightens on jian hilt; jade pommel catches the light.
  6. Wide second exchange — leap and parry, Yan airborne, silhouette against sky.
  7. Decisive close — Bai. Sound: "steel ring, sustained". Yan: "forgive me".
  8. Wide closer — Yan stands, blade lowered. Bai's robes settle. Camera releases
     on the salute repeated.
```

**Deconstructive example shot list:**

```
Shot list (follow in order, each shot ~1.5-2 seconds):
  1. Long-lens through bamboo — the bandit (mud-spattered, dao) approaches the
     unsuspecting traveller. Foreground bamboo cuts the sightline. Wind in the canopy.
  2. Handheld close, late reframe — operator finds the traveller already turning,
     a beat too late. Sound: "bamboo creak, footfall in mud".
  3. Violence withheld — the strike happens just outside frame; only the body
     falling into shot is visible. Mud splash.
  4. Obscured mid-shot — combat continues but a foreground clump of bamboo cuts
     the sightline. Wind, dust raked through air.
  5. Lateral attention shift — camera looks away to a watching crow on a branch
     mid-action. Sound: "wet impact, off-screen".
  6. Frame-filling weather — mist and wind dominate; the bandit is glimpsed within
     it, walking forward.
  7. Operator-visible reframe — hesitant zoom in on the dao, blood-flecked, dripping.
     No dialogue.
  8. Aftermath, not closer — the bandit walks out of frame; the camera holds on the
     mud-and-bamboo emptied of figures. Sound: "wind, distant crows".
```

Match the storyboard's dialogue and weapon-SFX **word for word, quote style and all**. If the storyboard has `Yan: "forgive me"` (lowercase), the video prompt also has `"forgive me"`. Do not "clean up" the lines.

### 5. Camera and pacing direction

A single line for camera language and a single line for pacing/duration. The vocabulary differs sharply between modes:

**Classical camera direction:**

```
Camera: composed motivated movement only — tripod, dolly, low- and high-angle crane.
Match the storyboard's lens choices (24mm wide for establishing, 50mm two-shot, 85mm
decisive close). Silhouettes always readable against background; both combatants
balanced in frame on wides; architecture (columns, doorways, stone steps) exploited
for symmetry. Cuts at the natural punctuation between choreographic phrases, never
inside a phrase. No camera gear visible. Duration: approximately [N] seconds total.
```

**Deconstructive camera direction:**

```
Camera: handheld and long-lens (200mm) alternation. Late reframes, hesitant zooms,
focus pulls arriving late, lateral attention shifts. Match the storyboard's lens
choices (200mm long-lens for peeking shots, 18mm handheld wide for close-quarters,
50mm for late reframes). Foreground occlusion welcomed (bamboo, hanging cloth,
crowds, animals). Violence withheld — outside frame, obscured, or so close to lens
it cannot resolve. Double-cuts at scene seams, holds past the expected cut point.
No camera gear visible. Duration: approximately [N] seconds total.
```

Seedance 2 understands cinematographic vocabulary directly — `dolly`, `pan`, `tilt`, `tracking shot`, `rack focus`, `whip pan`, `handheld`, `static`, `push-in`, `crane up`, `long lens through obstruction`, `late reframe`, `hesitant zoom`. Use real terms from the storyboard's movement column rather than generic "camera moves".

For duration, default to 12-15 seconds for an 8-shot wuxia sequence (~1.5-2 sec per shot). Classical mode often benefits from slightly longer per-shot durations (longer holds on phrases) — push toward 14-15s. Deconstructive mode often benefits from a slightly punchier rhythm — 12-13s is fine. Seedance 2 supports 4-15 second durations; longer than 15 requires multiple generations stitched.

### 6. Audio direction

Four short lines covering ambient, score, weapon SFX, and silence treatment:

```
Audio:
- Ambient: [from storyboard's audio panel, e.g. classical: "bamboo creak, distant
  temple bell, breath"; deconstructive: "rain on stone, wind, distant crowd, blade
  scrape, mud squelch"]
- Score: [from storyboard, e.g. classical: "solo erhu over guzheng, long silences
  punctuated by single percussion strikes (taiko, woodblock)"; deconstructive:
  "score interrupted, fragmented, or absent — weather audio fills the bed; brief
  pipa sting at shot N if the moment calls for it"]
- Weapon SFX: [e.g. "steel ring sustained on the decisive strike (shot 7), blade
  whisper on the unsheathe (shot 5), fabric snap on the leap (shot 6), foot scuff
  on stone throughout"]
- Silence treatment: [classical: "long silences in shots 1, 4, and 8 — let the
  ambient breathe"; deconstructive: "weather audio continuous; silence used
  sparingly, only after shot 5's lateral shift"]
- Dialogue: combatants speak the quoted lines in [tone, e.g. classical: "low,
  resolved"; deconstructive: "sparse, almost absent"] voices, lip-synced to the
  on-screen action.
```

Seedance 2's native audio is one of its main features — it generates synchronised dialogue, ambient sound, score, and SFX in one pass. For wuxia, the **weapon SFX and silence treatment are as load-bearing as the dialogue**. Don't strip them to save prompt length.

The traditional wuxia score instruments (erhu, pipa, dizi, guzheng, yangqin, taiko-like percussion) are well-recognised by Seedance. Name specific instruments rather than "Chinese music".

### 7. Style anchor

One or two sentences pinning the visual look back to the storyboard's mood and mode, repeating the key descriptors from the storyboard's lighting and post-process panels:

**Classical style anchor (example):**

```
Style: warm balanced cinematic grade with golden-hour sidelight, ink-wash atmospheric
haze, controlled wind in robes, crisp skin tones, slight subtle grain — the same look
as the storyboard sheet's MODE: CLASSICAL (KING HU REGISTER). Composed framing,
silhouettes legible against the background, motivated camera movement only.
```

**Deconstructive style anchor (example):**

```
Style: cold high-contrast cinematic grade with deep blacks, mud and blood accents,
heavy weather layer (rain/wind/dust/mud baked in), heavy grain — the same look as
the storyboard sheet's MODE: DECONSTRUCTIVE (TSUI HARK / THE BLADE REGISTER). Handheld
energy, withheld clarity, foreground occlusion in most frames.
```

The phrase "the same look as the storyboard sheet's MODE: [...]" is helpful — it explicitly tells Seedance to match the storyboard's visual register, not just its layout, and it reinforces the mode declaration from section 1.

## Length budget

Keep the whole video prompt **under 220 words** (slightly looser than the cinematic-storyboard skill's 200-word target, because wuxia prompts carry an extra mode-declaration line and dedicated weapon-SFX direction). Seedance 2's documentation is explicit that concise structured prompts outperform dense ones. The storyboard image is doing 80% of the work; the text prompt mostly needs to point at it, name the mode, list the beats with weapons and quoted sounds, and direct pacing.

If the prompt exceeds 220 words, the most likely culprits are:
- Section 4 (shot list) over-describing each shot — keep each beat to one or two short lines
- Section 5 (camera direction) restating things already in the storyboard frame captions — trim to a single sentence per direction
- Section 6 (audio) fully specifying every shot — collapse to summary unless a specific shot needs a unique sound

## Common failure modes and fixes

**Seedance animates the storyboard layout itself instead of the shots within it.** Section 1's "Refer to the wuxia storyboard sheet in @Image 1..." opener is missing or weakened. Fix by keeping the exact opener verbatim — it's the load-bearing instruction that puts Seedance into R2V interpretation mode.

**The clip averages classical and deconstructive cues.** Section 1's second sentence (the directorial-register declaration) was vague or missing. Fix by stating the mode in writing: `Render in DECONSTRUCTIVE wuxia register as specified on the storyboard's MODE DECLARATION.`

**Combatants look different from the storyboard's combatant grid.** No separate combatant reference images were provided AND the storyboard's combatant grid wasn't strong enough. Fix by either (a) generating dedicated combatant reference images first and adding them as @Image 2, @Image 3 with explicit "preserve robe, hair, build, and facial structure" notes, or (b) regenerating the storyboard with a richer combatant reference panel.

**Weapon type drifts (jian becoming dao, dao becoming spear) across shots.** No dedicated weapon reference image was provided AND the storyboard's weapon close-up wasn't strong enough. Fix by adding @Image 4 as a dedicated weapon close-up with explicit "preserve blade length, hilt wrap, pommel, and sheath" preservation notes. This is wuxia-specific and worth doing for any clip with a distinctive weapon.

**Lip-sync says different words than the dialogue in the storyboard.** Section 4's dialogue lines drifted from the storyboard's quoted dialogue. Fix by copy-pasting the dialogue verbatim from the storyboard prompt to the video prompt — never retype.

**Weapon SFX is generic ("sword sound") instead of specific.** Section 6's weapon SFX line was thin. Fix by specifying the exact sound for the exact shot ("steel ring sustained on the decisive strike (shot 7), blade whisper on the unsheathe (shot 5), fabric snap on the leap (shot 6)") — Seedance 2 SFX-syncs from these specific quoted phrases.

**Pacing is off — shots are all the same length and the choreographic phrasing dies (classical) or the ambush rhythm dies (deconstructive).** Section 4 didn't specify per-shot duration cues. Fix by adding rough timing hints in the shot list: classical mode "(hold)" / "(phrase)" / "(release)" hints; deconstructive mode "(quick)" / "(sudden)" / "(beat after)" hints.

**Audio is muddy or generic — no traditional wuxia instruments.** Section 6 used "Chinese music" instead of named instruments. Fix by naming `erhu`, `pipa`, `dizi`, `guzheng`, `yangqin`, `taiko-like percussion` directly.

**Anachronisms creep in (a wristwatch, a glass window, a modern lamp).** The storyboard's hard-constraints line wasn't strong, and the video prompt didn't reinforce it. Fix by adding to section 7: `No anachronisms — pre-modern wuxia register only, no firearms, no modern items.`

**Video is shorter or longer than expected.** Seedance 2 caps at 15 seconds per generation. For longer wuxia sequences, generate in halves with the storyboard as @Image 1 in both, then edit together. The boundary between halves should fall on a clean cut between two shots, not inside a choreographic phrase.

## Full worked example

See `example-bamboo-ambush.md` for a complete reverse-engineered prompt set (storyboard + video) for a deconstructive bamboo-forest ambush sequence.
