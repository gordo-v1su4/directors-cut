# Style anchor — classic American comic (default)

This is the default style — the bold-inks, halftone-shading, dramatic-composition look that defines the Western superhero/adventure comic tradition (Stan Lee, Jack Kirby, Steve Ditko era and forward). It's the style GPT Image 2 has the strongest training priors for, and the one most readers parse as "comic" without explanation.

## The anchor paragraph (paste into every page prompt)

> Classic American comic-book art style in the bold-ink Marvel/DC tradition. Strong confident black ink outlines of varying weight (heavier on outer silhouettes, lighter on interior detail). Flat saturated primary and secondary colours — reds, blues, yellows, greens — with Ben-Day-style halftone dot shading for shadow areas and skin tones. Slightly aged off-white paper background tone (#FBF6E8) inside panels. Thin black panel borders (1.5-2px) with clean white gutters between panels. Classic comic-book all-caps hand-lettered-feel typography for dialogue and captions. Speech bubbles are clean rounded ovals with thin black outlines and tails pointing to speakers. Caption boxes are yellow (#FFE066) rectangles with black borders, used for narration and time/location titles. Sound effects are bold hand-drawn integrated panel art with dynamic shapes — jagged for impacts, bouncy for comedic, swooping for motion — coloured for impact (red for combat, yellow for excitement, blue for technology, green for energy). Compositions are dynamic with strong foreshortening, dramatic angles, expressive faces, and clear visual hierarchy. Overall feel: vibrant, kinetic, heroic, immediately readable as a Western comic page from the 1980s-2000s tradition. No watermarks, no real brand logos, no glossy gradients, no soft photographic blur.

## Default colour-to-role mapping

| Element | Hex | Role |
|---|---|---|
| Black | #1A1A1A | Ink outlines, panel borders, lettering |
| Bone / aged paper | #FBF6E8 | Panel interior background tone |
| Pure white | #FFFFFF | Gutters between panels, speech bubble interiors |
| Caption yellow | #FFE066 | Caption box background |
| Hero red | #E63946 | Hero costumes, impact SFX, strong accents |
| Hero blue | #2A6FB5 | Hero costumes, sky, technology accents |
| Hero yellow | #F4C430 | Hero costumes, energy, excitement SFX |
| Halftone dot density | varies | Shadows, skin tones, atmospheric depth |

## Project palette adaptation

The default uses the Stan Lee era's signature primary palette. Adapt by mood:

- **Comedy / gag strip** → keep primaries bright; lean into yellow and orange; halftone density low
- **Drama / character piece** → desaturate slightly; lean into blues and purples; halftone density moderate
- **Horror / thriller** → shift palette to deep purples, blood reds, sickly greens, near-blacks; halftone density high; heavier inks
- **Sci-fi** → cooler palette overall; metallic blues and steel greys with energy-green or cyan accents
- **Slice-of-life / wholesome** → softer primaries; pastel-leaning; halftone density very low or absent

## Lettering specifics

- **Dialogue**: classic comic-book all-caps, slight bounce / hand-lettered irregularity (NOT a sterile geometric font), black on white speech-bubble interior
- **Bold dialogue** (emphasis): same lettering rendered bold, often with slight outline
- **Whisper dialogue**: smaller lettering, dashed speech bubble outline
- **Thought**: scalloped/cloud-shape bubble with chain of small bubbles trailing to the thinker
- **Caption boxes**: same all-caps lettering, on yellow background, narrative voice (third person past tense traditionally, present tense for modern)
- **SFX**: dramatic display lettering integrated INTO the panel art, not bubbled — hand-feel, dynamic, coloured for impact, can break out of panel borders for emphasis

## Panel-edge conventions

- **Standard panel**: thin black border, hard rectangular edges
- **Bleed panel**: art extends to or beyond the panel border for emphasis (often used for splash panels)
- **Borderless panel**: no border at all, used for memory/dream sequences or emotional climaxes
- **Jagged-edge panel**: lightning-bolt or torn-paper edges for sudden action / time jumps

The default for `stan-strip` is standard rectangular panels with thin black borders. Use bleed/borderless/jagged sparingly and always specify when used.

## Example panel render mental model

When the model gets this style anchor right, a single panel looks like:

> A medium shot of a hero in a red and blue costume bursting through a lab window. Confident black ink outlines define the figure clearly. The cape has a few inked motion lines trailing it. Skin tones are filled flat with light Ben-Day halftone dots in the shadow areas under the jaw and on the side of the face away from the light. The lab background is rendered with simpler line work — quick angular suggestions of equipment, halftone dots filling the deeper shadows. The panel border is a thin clean black line. A bold red jagged-letter SFX "KRA-KOOM!" cuts diagonally across the top portion of the panel, red with a black drop-edge, partially overlapping the broken window glass. A speech bubble at the bottom right reads "NOT ON MY WATCH, PROFESSOR!" — clean rounded oval, thin border, all-caps comic lettering, tail pointing to the hero. The page background between panels is pure white. The interior panel has a slightly warm aged-paper tint.

If the model produces something that matches this mental model — bold inks, halftone shading, integrated SFX, clean lettering, vibrant primaries — it's hitting the anchor.

## When to use this anchor

- Action / superhero comics (its native register)
- Comedy strips with dynamic visual jokes
- Gag strips that want bold visual energy
- Adaptations of stories with strong action or emotional beats
- Anything where "Western comic-book" is the recognisable visual idiom the user wants

## When NOT to use this anchor

- Quiet character-driven work that wants restraint → use **ligne claire** (Tintin) or **indie zine**
- Manga / anime adaptations → use **manga**
- Newspaper-strip humour → use **newspaper**
- Anything where bold inks and saturated primaries would feel wrong for the tone

## Why this style works as the default

Three reasons:
1. **Strongest training priors** — GPT Image 2 has seen vast quantities of Marvel/DC-style comic pages in training, and its layout/lettering/inking heuristics are best-tuned for this style
2. **Reader recognition** — anyone in the West parses this as "a comic" instantly, without context
3. **Reference-image robustness** — bold ink outlines and flat colours hold character consistency across pages better than soft-focus or photorealistic styles
