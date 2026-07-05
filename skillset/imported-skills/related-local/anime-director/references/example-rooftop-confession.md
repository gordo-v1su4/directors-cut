# Worked example — "Rooftop Confession" (modern TV anime cut)

This is the full reverse-engineered output file for a rooftop confession scene rendered in modern TV anime register (KyoAni-flavoured slice-of-life / romance). It shows exactly what a finished output of this skill should look like end-to-end.

Use this as a reference when in doubt about what level of detail the prompts need. If your output looks substantially thinner than this, push more specificity into the prompts (verbatim labels, hair/wardrobe descriptors in every cell, dialogue in quotes, layout percentages, studio reference repeated in both prompts).

---

# Rooftop Confession — Anime E-conte & Video Prompts

**Pipeline:** Idea → E-conte → Anime Video
**Storyboard model:** `gpt-image-2` · Size `1536×1024` (landscape) · Quality `high`
**Video model:** `Seedance 2 (seedance-2.0)` · R2V mode · ~14 seconds · 16:9
**Anime register:** Modern TV anime — KyoAni-flavoured slice-of-life / romance
**Orientation:** Landscape 16:9

## At a glance

- **Premise:** A first-year girl meets her senpai on the school rooftop at sunset and finally confesses, the wind teasing her hair as she forces the words out.
- **Format:** TV anime cut (single scene)
- **Characters:** 2 (Yuki, female, 16; Haruto, male, 18), single location (school rooftop at golden hour)
- **Cuts:** 8
- **Tone keywords:** Setsunai (wistful), seishun (youth), kirakira (sparkle), kokoro (heart), kaze (wind), yuugure (twilight)
- **Total duration:** ~14 seconds

---

## Shared anime style anchor (paste into Prompt 1)

> Modern TV anime production board in clean digital style. Soft pastel body background (#F4EDE3 warm cream) with thin coloured panel dividers. Header bar in muted slate-blue (#3B4D63) with display-style title and small white sans-serif metadata. Panel headings in small caps slate or charcoal. Photographic e-conte cells rendered in clean digital anime style — large expressive eyes with multi-layer iris highlights, soft cel shading with one or two highlight tones, smooth lineart with controlled line weight, subtle subsurface skin tones, KyoAni-flavoured warm golden-hour light. Backgrounds rendered as anime *haikei* / background-art — soft digital paint, subtle gradients, light bloom on highlights, occasional bokeh. Top-down floorplan in soft tonal pencil-and-watercolour style with thin pen overlays. Camera position chips are slate-blue rounded squares with white numbers and small camera-icon arrows. Path-of-action arrows are dashed coral. E-conte cell number badges are slate-blue with white "CUT N" text. Caption text inside panels is charcoal in a clean grotesque sans-serif. Color palette swatches in the header use the project's signature tones. Overall feel: clean, contemporary, restrained, character-focused — like a real KyoAni / WIT pre-production sheet, polished but not glossy. No watermarks, no real studio logos, no decorative graphic flourishes, no harsh shadows, no over-saturation.

---

## Prompt 1 — GPT Image 2 e-conte storyboard sheet

Paste this into GPT Image 2 at size `1536×1024`, quality `high`.

```
Create an anime production board / hybrid e-conte planning sheet titled "ROOFTOP CONFESSION" (Japanese subtitle "OKUJOU NO KOKUHAKU") — an episode director's visual planning guide for a modern TV anime cut in the KyoAni-flavoured slice-of-life / romance register.

Canvas: landscape 16:9, three horizontal tiers separated by thin coral dividers. TOP BAND: header bar in slate-blue (#3B4D63) running full width, ~10% of canvas height, holding the project title in display type and five metadata blocks across. TIER 1 (~30% of height): two side-by-side panels — left panel "CHARACTER REFERENCE / 設定" with two character turnaround rows, right panel "LOCATION / 背景" with a painted anime background-art plate of the school rooftop and a top-down camera plan. TIER 2 (~28% of height): one wide panel "E-CONTE / 絵コンテ (8 CUTS)" with eight equal-width e-conte cells in a single horizontal strip. TIER 3 (~22% of height): four side-by-side panels — "LIGHTING / 照明", "MOOD / KEYWORDS", "AUDIO / 音響", "DIRECTION / 演出 NOTES". Soft pastel cream body background (#F4EDE3) with thin 1.5px slate-blue borders on every panel.

HEADER BAR contents, left to right:
- "PROJECT TITLE:" label (small caps white) above "ROOFTOP CONFESSION" (display type, all caps, white) and "OKUJOU NO KOKUHAKU" (small white serif)
- Stacked metadata block: "FORMAT: TV ANIME CUT" / "GENRE: SLICE-OF-LIFE / ROMANCE" / "EPISODE / CUT: EP 7, CUTS 142-149" / "DURATION: ~14 SECONDS"
- "CONSTRAINTS" block with three icon+text rows: "□ 8 CUTS" / "👥 2 CHARACTERS" / "🏠 1 LOCATION (SCHOOL ROOFTOP)"
- "COLOR PALETTE:" label above five color swatches: slate blue (#3B4D63), warm cream (#F4EDE3), golden ochre (#D9A862), coral (#E07856), dusty rose (#C28B95)
- "SCENE CONTEXT:" label above two short sentences: "A first-year girl finally confesses to her senpai at golden hour." and "Quiet held beats; the wind and the silence carry the emotion."

CHARACTER REFERENCE / 設定 panel — two character rows:

Row 1 — "YUKI" (Japanese: "ユキ") "(FEMALE)": left column shows the name in display type, "TYPE: SHY HONEST" tag, and bullets "• Age 16 (1st year)" / "• Hesitant but determined" / "• Earnest" / "• SIGNATURE: long straight black hair, red satin ribbon, dark brown eyes, navy sailor uniform with red neckerchief". Five character-sheet cells in a row drawn in clean digital anime style labeled "FRONT", "THREE-QUARTER", "SIDE", "BACK", "EXPRESSION SHEET" — same character in each: 16-year-old girl, long straight black hair below shoulders, red satin ribbon at the back of the head, large dark brown eyes, navy sailor uniform top with red neckerchief, navy pleated skirt, white knee socks, brown loafers. The "EXPRESSION SHEET" cell shows four small thumbnails — neutral, gentle smile, surprised wide-eyes, blushing-determined. Plain pale background. Beneath the row, "WARDROBE / アイテム" caption with five small flat anime-style item callouts: navy sailor uniform top with red neckerchief, navy pleated skirt, red satin ribbon, brown leather loafers, school bag in faded canvas tan.

Row 2 — "HARUTO" (Japanese: "ハルト") "(MALE)": left column shows the name in display type, "TYPE: KIND SENPAI" tag, and bullets "• Age 18 (3rd year)" / "• Calm, observant" / "• Kindly direct" / "• SIGNATURE: short messy chestnut-brown hair, hazel eyes, black gakuran uniform". Five character-sheet cells in a row drawn in clean digital anime style labeled "FRONT", "THREE-QUARTER", "SIDE", "BACK", "EXPRESSION SHEET" — same character in each: 18-year-old boy, short messy chestnut-brown hair, hazel eyes, slightly taller, black gakuran uniform with high collar, dark trousers, dark dress shoes. The "EXPRESSION SHEET" cell shows four small thumbnails — neutral, soft smile, surprised eyes-widened, breath-caught wonder. Plain pale background. Beneath the row, "WARDROBE / アイテム" caption with five small flat anime-style item callouts: black gakuran uniform top, dark trousers, dark dress shoes, simple wristwatch, school satchel.

LOCATION / 背景 panel — two sub-panels side by side:

LEFT SUB-PANEL "ROOFTOP PLATE / 屋上": a single landscape painted anime background-art plate of a Japanese high-school rooftop at golden hour — chain-link fence along the front edge, distant city skyline through the haze, warm golden-orange sky with scattered cirrus, dusty pink horizon, soft volumetric haze, slight lens-flare on the setting sun off-frame, rendered in KyoAni-flavoured soft digital paint with subtle gradients and gentle bloom. No characters in the plate.

RIGHT SUB-PANEL "TOP-DOWN MOVEMENT & CAMERA PLAN": overhead floorplan of the rooftop in soft pencil-and-watercolour style — fence along the front, AC units to the side, water tower in one corner, stairwell housing at the back, all rendered with thin pencil lines and soft watercolour wash. Overlaid: exactly eight numbered camera position chips (small slate-blue rounded squares with white numbers 1-8 and small camera-icon arrows), positioned around the railing area where the two characters will meet. Dashed coral curved arrows showing "PATH OF ACTION / 動線". Vertical legend on the right side listing: "CUT 1  ESTABLISHING WIDE" / "CUT 2  MEDIUM TWO-SHOT" / "CUT 3  YUKI CLOSE-UP" / "CUT 4  HARUTO CLOSE-UP" / "CUT 5  INSERT (HAND ON RAILING)" / "CUT 6  MEDIUM ON YUKI" / "CUT 7  HARUTO CLOSE-UP" / "CUT 8  WIDE HELD CLOSER" / "[dashed coral] PATH OF ACTION / 動線".

E-CONTE / 絵コンテ (8 CUTS) panel: a single horizontal strip of exactly eight equal-width e-conte cells, no gaps wider than 4px between cells. Each cell has a small slate-blue badge in the top-left corner with white "CUT N" text. Each cell is drawn as a clean digital KyoAni-flavoured anime keyframe with full cel shading.

Cell 1 — image: wide static shot of an empty school rooftop at golden hour, wind teasing the chain-link fence, distant city skyline through haze, warm orange sky. Captions beneath: "TIMING  2.0s" / "SHOT SIZE  WIDE" / "CAMERA  STATIC" / "SFX  WIND, DISTANT TRAIN". Italic action: "Empty rooftop at golden hour. Wind teases the chain-link fence. Anime breath beat."

Cell 2 — image: medium two-shot of Yuki (long black hair, red ribbon, navy sailor uniform) and Haruto (short chestnut hair, gakuran) facing each other at the railing, the warm sky behind them. Captions: "TIMING  1.5s" / "SHOT SIZE  MEDIUM TWO-SHOT" / "CAMERA  STATIC" / "SFX  FOOTSTEPS". Italic action: "Yuki and Haruto face each other at the railing. Wind catches her ribbon."

Cell 3 — image: close-up on Yuki, slow zoom in suggested by composition — her long black hair drifting slightly, red ribbon visible, hesitant expression with pink across her nose bridge, eyes downcast. Captions: "TIMING  1.5s" / "SHOT SIZE  CLOSE-UP" / "CAMERA  SLOW ZOOM IN" / "SFX  —". Italic action: 'Yuki (long black hair, red ribbon): "ano, senpai..." (hesitant, pink nose bridge)'.

Cell 4 — image: close-up on Haruto, static — short chestnut hair, hazel eyes slightly widened in surprise, gakuran collar visible. Captions: "TIMING  1.5s" / "SHOT SIZE  CLOSE-UP" / "CAMERA  STATIC" / "SFX  —". Italic action: 'Haruto (short chestnut hair): "Yuki...?" (surprised, eyes widened)'.

Cell 5 — image: macro insert of Yuki's hand (navy uniform sleeve visible) gripping the chain-link railing tightly, knuckles paling. Captions: "TIMING  1.0s" / "SHOT SIZE  INSERT MACRO" / "CAMERA  PUSH-IN" / "SFX  FENCE RATTLE". Italic action: "Yuki's hand grips the railing, knuckles paling."

Cell 6 — image: medium on Yuki, slight push-in suggested — eyes shut, brow tense, head slightly bowed, voice cracking. Captions: "TIMING  2.0s" / "SHOT SIZE  MEDIUM" / "CAMERA  SLIGHT PUSH-IN" / "SFX  —". Italic action: 'Yuki (long black hair, red ribbon, eyes shut): "zutto, suki deshita." (voice cracking, brow tense)'.

Cell 7 — image: close-up on Haruto, held — wide-eyed, breath caught, golden-hour light across his face, a single highlight catching his hazel iris. Captions: "TIMING  2.0s" / "SHOT SIZE  CLOSE-UP" / "CAMERA  HELD STATIC" / "SFX  WIND". Italic action: 'Haruto (short chestnut hair, hazel eyes, golden light): wide-eyed, breath caught, no dialogue.'

Cell 8 — image: wide held closer — both characters at the railing, Haruto stepping a half-step closer to Yuki, wind rising, golden hour deepening to dusty orange. Captions: "TIMING  2.5s" / "SHOT SIZE  WIDE" / "CAMERA  STATIC HELD" / "SFX  WIND RISES". Italic action: "Haruto steps half-closer. Wind rises. Held final beat under setting sun."

LIGHTING / 照明 panel: four small thumbnail anime-style frames in a row connected by small right-pointing arrows, each with a caption beneath:
- thumbnail of warm golden-orange sky over rooftop, caption: "GOLDEN HOUR / Low warm sun, long shadows."
- thumbnail of Yuki's hair backlit with rim light, caption: "RIM LIGHT / Backlight on hair edges."
- thumbnail of Haruto's face with soft warm key light, caption: "KEY LIGHT / Soft front fill on faces."
- thumbnail of dusty haze with light particles, caption: "ATMOSPHERIC HAZE / Distant city haze, light bloom."

MOOD / KEYWORDS panel: six icon+label pairs in a 3x2 grid using simple anime-style line icons:
- sparkle icon: "KIRAKIRA / SPARKLE"
- wind icon: "KAZE / WIND"
- youth icon: "SEISHUN / YOUTH"
- heart icon: "KOKORO / HEART"
- sunset icon: "YUUGURE / TWILIGHT"
- tear icon: "SETSUNAI / WISTFUL"

AUDIO / 音響 panel: four labeled sub-blocks:
- "AMBIENT:" / "Wind through chain-link fence, distant train, faint city hum."
- "MUSIC:" / "Soft piano with strings, slice-of-life slow-tempo bed, KyoAni-flavoured restraint, rising slightly across Cuts 6-8." (with a small audio waveform graphic to the right)
- "DIALOGUE LANG:" / "Japanese, soft conversational delivery."
- "SFX:" / "Single fence-rattle on Cut 5; rising wind on Cut 8."

DIRECTION / 演出 NOTES panel: four labeled sub-blocks (with a small camera and pencil icon in the corner):
- "LENS ANALOGUE:" / "Wide (rooftop establish), medium (two-shot), close-up (faces), insert macro (hand on railing)."
- "MOVEMENT STYLE:" / "Mostly held frames; slow zoom on Cut 3; slight push-in on Cut 6. KyoAni-typical restraint — no whip pans."
- "VISUAL PHILOSOPHY:" / "Quiet held beats. Let the wind, the silence, and the light do the emotional work."
- "POST-PROCESS:" / "Soft pastel grade, slight bloom on highlights, subtle film grain, KyoAni warmth."

[Apply shared anime style anchor.]

Quality: high. Text must render verbatim as specified. Size: 1536x1024.

No watermarks, no extra labels, no real anime studio logos, no real anime character likenesses, no real voice-actor names, no text outside the specified verbatim labels. All character names, dialogue, panel headings, cut numbers, and timing values render exactly as quoted. The eight e-conte cells are equal-width and in the specified order; do not merge, drop, or reorder them. Do not add extra cells, do not collapse cells.
```

---

## Prompt 2 — Seedance 2 R2V anime video

Once the e-conte storyboard image is generated, paste this into Seedance 2 with the e-conte image attached as **@Image 1**. No additional reference images needed — the e-conte's character grid is sufficient for Yuki and Haruto consistency.

```
Refer to the anime e-conte storyboard sheet in @Image 1. Follow the cut order, cut sizes, camera movement, character positions, dialogue, and visual register shown in the storyboard.

Scene: A first-year girl meets her senpai on the school rooftop at sunset and finally confesses, the wind teasing her hair as she forces the words out.

Cut list (follow in order, total ~14 seconds):
  1. (2.0s) Wide static establishing — empty rooftop at golden hour, wind teasing the fence. SFX: wind, distant train.
  2. (1.5s) Medium two-shot — Yuki (long black hair, red ribbon, navy sailor uniform) and Haruto (short chestnut hair, gakuran) face each other at the railing.
  3. (1.5s) Close-up on Yuki, slow zoom in — pink across nose bridge: "ano, senpai..."
  4. (1.5s) Close-up on Haruto, static — surprised, eyes widened: "Yuki...?"
  5. (1.0s) Insert macro — Yuki's hand grips the railing, knuckles paling. SFX: fence rattle.
  6. (2.0s) Medium on Yuki, slight push-in — eyes shut, brow tense: "zutto, suki deshita."
  7. (2.0s) Close-up on Haruto, held — wide-eyed, breath caught, golden light across his face.
  8. (2.5s) Wide held closer — Haruto steps half-closer. Wind rises. Held final beat.

Camera: held frames default; slow zoom on Cut 3; slight push-in on Cut 6. Anime-restrained camera, no whip pans, no shaky cam, no camera gear visible. Smooth cuts.
Aspect ratio: 16:9. Duration: ~14 seconds total.

Audio:
- Ambient: wind through chain-link fence, distant train, faint city hum
- Music: soft piano + strings, slice-of-life bed, KyoAni-flavoured restraint, rising Cuts 6-8
- Dialogue: Japanese, soft conversational delivery, lip-synced
- SFX: fence rattle on Cut 5, rising wind on Cut 8

Style: Modern TV anime register: clean digital lineart, soft cel shading, large expressive eyes with multi-layer iris highlights, KyoAni-flavoured character design and golden-hour palette, slight bloom, subtle grain — the same look as the e-conte storyboard sheet.
```

**Settings:**
- Aspect ratio: `16:9`
- Duration: `14 seconds`
- Resolution: `720p`
- Audio: enabled

---

## Generation notes

- **The two prompts are coupled.** Yuki's "ano, senpai..." and "zutto, suki deshita.", Haruto's "Yuki...?" — these dialogue strings are identical between Prompt 1 and Prompt 2 on purpose, including the romanisation (Hepburn) and lowercase. Don't "tidy" them or convert romanisation systems; Seedance lip-syncs from the prompt text and any drift causes the actor's mouth to say something different from what the e-conte shows.
- **Run Prompt 1 first.** Wait for the e-conte image, then attach it as `@Image 1` for Prompt 2.
- **If Yuki's hair drifts** (length, ribbon position, or colour) between cells, regenerate the e-conte with `(long black hair, red ribbon)` repeated in EVERY cell's action line — not just the character reference grid.
- **If Haruto's expression on Cut 7 reads as flat or dead**, regenerate the cut with a more specific expression line ("wide-eyed wonder, lips slightly parted, single golden highlight catching his iris, breath caught").
- **If the rooftop background looks like a photograph** rather than anime *haikei*, the location plate descriptor in the e-conte prompt was too weak. Regenerate the e-conte with the location plate explicitly described as "KyoAni-flavoured soft digital paint with subtle gradients and gentle bloom, anime *haikei* / background-art style — not photographic".
- **For TikTok / vertical distribution**, regenerate the e-conte with the portrait canvas variant (1024×1536, 4×2 cell grid) and run Seedance at `9:16` aspect ratio.
- **For an English-language version**, replace the Japanese dialogue with English equivalents in BOTH prompts — keep them word-identical between the two. Note that English in an anime register sometimes produces uncanny dub-mismatch; Japanese is the safer default.
- **If you want a slightly longer hold on Cut 8**, bump its timing to 3.0s and trim Cut 1 to 1.5s — the total stays under 15 seconds and the final beat lands harder.
