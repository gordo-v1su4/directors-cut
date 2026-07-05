# Style anchor — Modern TV anime (KyoAni / MAPPA / Trigger / WIT)

The default register for clean, contemporary TV anime — Kyoto Animation's slice-of-life sheen, MAPPA's polished prestige look, Trigger's snappy energy, WIT's clean digital craft. Use this for school-life, romance, slice-of-life, dialogue-driven drama, and modern action that isn't shonen-stylised. This is the most common register for an anime cut and the one Seedance 2 handles best.

## The anchor paragraph (paste into every prompt)

> Modern TV anime production board in clean digital style. Soft pastel body background (#F4EDE3 or pale lavender #EAE6F0) with thin coloured panel dividers. Header bar in muted slate-blue (#3B4D63) or warm taupe with display-style title and small white sans-serif metadata. Panel headings in small caps slate or charcoal. Photographic e-conte cells rendered in clean digital anime style — large expressive eyes with multi-layer iris highlights, soft cel shading with one or two highlight tones, smooth lineart with controlled line weight, subtle subsurface skin tones, KyoAni-flavoured warm light or MAPPA-flavoured cool light depending on tone. Backgrounds rendered as anime *haikei* / background-art — soft digital paint, subtle gradients, light bloom on highlights, occasional bokeh. Top-down floorplan in soft tonal pencil-and-watercolour style with thin pen overlays. Camera position chips are slate-blue rounded squares with white numbers and small camera-icon arrows. Path-of-action arrows are dashed coral or teal. E-conte cell number badges are slate-blue with white "CUT N" text. Caption text inside panels is charcoal in a clean grotesque sans-serif. Color palette swatches in the header use the project's signature tones. Overall feel: clean, contemporary, restrained, character-focused — like a real KyoAni / MAPPA / WIT pre-production sheet, polished but not glossy. No watermarks, no real studio logos, no decorative graphic flourishes, no harsh shadows, no over-saturation.

## Default colour-to-role mapping

| Element | Hex | Role |
|---|---|---|
| Slate blue | #3B4D63 | Header bar, panel borders, camera chips, badges |
| Warm taupe | #8E7A66 | Alt header / accents for warm-tone projects |
| Pale cream | #F4EDE3 | Body background (warm-tone projects) |
| Pale lavender | #EAE6F0 | Body background (cool-tone projects) |
| White | #FFFFFF | Header metadata text, chip number text |
| Coral / teal | #E07856 / #4FA89A | Path-of-action arrows, accent strokes |

## Project palette swatches

The five colour swatches in the header should be derived from the scene's mood. Modern TV anime palettes tend toward muted, layered colour with one accent:

- **Slice-of-life / school day (warm)** → warm taupe, soft cream, faded denim, dusty rose, sage green
- **Romance / confession (golden)** → golden ochre, warm cream, blush pink, deep brown, slate
- **Modern action (cool)** → steel blue, charcoal, ice white, accent red, gunmetal
- **Mystery / drama (twilight)** → deep navy, dusty purple, bone white, rust orange, charcoal

## Studio / director references

Naming a specific studio or director in the prompt's style anchor pulls Seedance much harder toward anime-trained data than generic descriptors. Pick one based on the scene's tone:

- **Kyoto Animation (KyoAni)** — slice-of-life, romance, dialogue, soft warm light, restrained camera, exquisite detail in mundane gestures (K-On!, Hyouka, Liz and the Blue Bird)
- **MAPPA** — prestige TV, clean polish, more dramatic lighting, willing to go dark (Jujutsu Kaisen non-action moments, Chainsaw Man slice scenes, Yuri on Ice)
- **Trigger** — snappy, expressive, willing to break model for comedy or impact (Kill la Kill, SSSS.Gridman, Cyberpunk Edgerunners)
- **WIT Studio** — clean modern craft, dynamic when it needs to be (Spy×Family, early Attack on Titan, Vinland Saga)
- **A-1 Pictures** — competent contemporary TV polish, broad audience (Kaguya-sama, Sword Art Online, Aldnoah Zero)
- **CloverWorks** — emotionally rich modern slice-of-life and romance (Horimiya, Bocchi the Rock!, Wonder Egg Priority)

## Photographic style note for the e-conte cells

In modern TV anime register, e-conte cells are typically drawn as **clean digital anime keyframes** — not as sketched storyboard panels. The prompt should specify "each cell rendered as a clean digital anime keyframe in the modern TV anime register, with full cel shading, controlled lineart, and finished background painting". This makes the e-conte cells useful as Seedance reference for both composition AND visual style — they look like the actual anime, not like a planning sketch.

## When to use

- School-life, slice-of-life, dialogue-driven scenes
- Modern romance, confession, friendship beats
- Contemporary urban settings (city, train, café, bedroom)
- Modern action that's grounded rather than super-powered
- Music videos and AMVs that lean clean rather than saturated

## When NOT to use

- Heavy combat sequences with sakuga / impact frames → use shonen-action
- Period / fantasy with painterly textures → use classic-cel
- Photo-realistic backgrounds with anime characters → use atmospheric-cinematic

## Why this style works for the Seedance handoff

Modern TV anime is the most heavily represented anime style in Seedance 2's training data. A clean modern-register e-conte gives Seedance:

- Clear character design from the turnaround grid → strong consistency in the video
- Clean lineart and cel shading from the cells → Seedance can match the rendering style
- KyoAni / MAPPA studio reference → strong anime-specific priors
- Restrained camera vocabulary → Seedance produces controlled movement rather than over-animated chaos

This is the safest default register if the user hasn't specified a strong stylistic direction.
