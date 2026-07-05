# Style anchor — classical wuxia production board

The classical style — ink-and-rice-paper with calligraphic title, ceremonial layout, honoured-code panels — for King Hu / *Once Upon a Time in China* / Yuen Woo-ping-lineage clips. It reads as "real wuxia DP's pre-production guide from a Hong Kong action production circa 1985-2005" and is what Seedance 2 has the strongest priors for in the classical register.

## The anchor paragraph (paste into every classical-mode prompt)

> Classical wuxia production-board layout in the style of a Hong Kong action film director's pre-production planning guide. Ink-on-rice-paper header band (#F2EAD4 background, deep ink black calligraphic title in #1A1A1A) with small dark navy sans-serif metadata and a vermillion-red MODE DECLARATION chip in the top-right. Cream-rice-paper body background (#F5EFE2) with thin 1.5px deep-ink-black borders separating panels. Panel headings in small caps deep-ink-black serif with vermillion-red accent rules. Photographic content (set photo, combatant portraits, eight storyboard frames) shot in warm classical wuxia photography style — soft natural light, golden-hour or filtered-bamboo-canopy warmth, controlled atmospheric haze, shallow depth of field, balanced contrast, crisp natural skin tones, controlled wind in robes and hair, slight subtle film grain. Top-down choreography plan in soft ink-wash on rice-paper with pale tan terrain features. Camera position chips are dark navy rounded squares with white numbers and small camera-icon arrows. Combatant flow lines: dashed RED for attacker path, dashed BLUE for defender path. Path-of-blade arcs are thin gold (#C9A848) curves. Storyboard frame number badges are dark navy with white numbers. Caption text inside panels is deep ink black in a clean grotesque sans-serif. Palette swatches in the header use the project's signature wuxia colours. Overall feel: ceremonial, balanced, silhouette-legible, composed — like a real Hong Kong action production board, not a movie poster. No watermarks, no real brand logos, no decorative graphic flourishes, no glossy gradients, no harsh shadows, no anachronistic items.

## Default colour-to-role mapping

| Element | Hex | Role |
|---|---|---|
| Deep ink black | #1A1A1A | Header calligraphic title, panel borders, panel headings, sharpie weapon icons |
| Rice-paper cream | #F5EFE2 | Body background |
| Header rice-paper | #F2EAD4 | Header bar background (slightly warmer than body) |
| Vermillion red | #C8302C | MODE DECLARATION chip, panel-heading accent rules, attacker-path dash |
| Dark navy | #0F1A2C | Camera position chips, frame number badges, caption text |
| White | #FFFFFF | Chip number text, defender-path dash (over dark backgrounds) |
| Defender blue | #1F4C8A | Defender-path dashed line |
| Path-of-blade gold | #C9A848 | Weapon trajectory arcs |
| Ink-wash grey | #6B6B6B | Floorplan terrain shading |
| Tan / soft brown | #C9A878 | Floorplan furniture and warm accents |

## Project palette swatches (header)

The five colour swatches in the header should be derived from the wuxia register's mood:

- **Mountain temple at dawn** → ink black, rice-paper cream, vermillion red, jade green, gold
- **Bamboo forest at noon** → jade green, ink black, rice-paper cream, ochre, soft amber
- **Courtyard at dusk** → cinnabar red, ash white, stone grey, deep navy, gold
- **Riverside reedbed** → reed green, ink black, dawn pink, mist white, deep blue
- **Snowfield** → bone white, ink black, vermillion red, deep blue, charcoal
- **Marketplace at noon** → ochre, vermillion red, sun-bleached cream, ink black, jade green

## Typography

- **Project title in header**: bold calligraphic-style serif (or stylised brush-script), all caps or title case, deep ink black on rice-paper cream, ~3x larger than other header text
- **MODE DECLARATION chip (top-right)**: small caps sans-serif, white on vermillion red, ~10pt equivalent
- **Header metadata labels** ("FORMAT:", "REGISTER:", etc.): small caps sans-serif, dark navy, ~10pt equivalent
- **Header metadata values**: regular sans-serif, dark navy, ~12pt equivalent
- **Panel headings** ("COMBATANT + WEAPON REFERENCE", etc.): small caps serif, deep ink black, ~14pt equivalent, with a thin vermillion-red rule beneath
- **Caption text inside panels**: regular sans-serif, deep ink black, ~10pt equivalent
- **Italic action descriptions under storyboard frames**: italic sans-serif, deep ink black, ~9pt equivalent
- **Combatant names in character bible**: stylised serif (echoing the calligraphic title at smaller scale), dark navy

## Photographic style note

The single biggest lever for making the classical board feel cohesive is photographic style consistency across the set photo, the combatant portraits, and the eight storyboard frames. All photographic content should look like it was shot by the same DP with the same lens kit on the same day. Specify in the prompt:

> All photographic content (set photo, combatant grid portraits, eight storyboard frames) shot in the same warm classical wuxia photography style — soft natural light, filtered atmospheric haze, controlled wind in robes, shallow depth of field, balanced exposure, natural skin tones, slight subtle grain. Same colour grading throughout. Silhouettes always legible against background.

If the prompt doesn't say this, the storyboard frames often come back looking like stock kung-fu photography while the combatant grid looks like portrait photography, and the board reads as collage rather than as a unified plan.

## Calligraphic title note

The calligraphic-style title is the most distinctive element of the classical board. To get it to render well:

- Specify "deep-ink-black calligraphic-style serif title or stylised brush-script" — both phrases together usually produce the right register
- For project titles in English, GPT Image 2 will render English in calligraphic-style serif; for Chinese characters, specify "Chinese characters in seal-script (zhuanshu) or running-script (xingshu) style"
- If a title in Chinese is requested, also provide the pinyin/English transliteration in small caps below it
- Avoid asking for "actual calligraphy" — GPT Image 2 will sometimes interpret this as needing real Chinese characters and fail; the phrase "calligraphic-style" sets the right expectation

## When to use this anchor

Use the classical anchor when:

- The mode declaration says CLASSICAL (King Hu register)
- The mode declaration says HINGE — opens classical, breaks at shot N (use this anchor for the early-shot panels and add the deconstructive anchor's atmosphere notes for the later shots)
- The user references King Hu, *Dragon Inn*, *A Touch of Zen*, *Crouching Tiger Hidden Dragon*, *House of Flying Daggers* (composed register), Yuen Woo-ping classical work, or asks for "graceful", "elegant", "ceremonial", "honoured", "legendary", or "mythic" wuxia

## When NOT to use this anchor

- The mode declaration says DECONSTRUCTIVE — use the deconstructive anchor instead
- The user references Tsui Hark *The Blade*, *Ashes of Time*, or asks for "brutal", "muddy", "vérité", "raw", "survivalist", "fragmented" wuxia
- Mood-piece work or fashion-film work — wuxia is not the right register for those (consider redirecting to gpt-image-story instead)

## Why this style works for the Seedance handoff

Seedance 2 reads the storyboard image as visual reference. A cleanly-laid-out classical wuxia board in this style gives Seedance:

- Clear combatant look from the portrait grid → strong combatant consistency in the clip
- Clear weapon shape from the weapon close-up → weapon consistency across shots (the most common wuxia failure mode)
- Clear shot composition from the storyboard frames → Seedance can match each shot's framing and silhouette discipline
- Clear lighting/colour mood from the warm classical photography → the clip inherits the same warm balanced grade
- Clear camera movement intent from the top-down choreography plan with combatant flow lines → Seedance picks up on the implied motivated movement vocabulary
- Clear mode commitment from the MODE DECLARATION chip → Seedance does not average classical and deconstructive cues

A more decorative or stylised wuxia board (cartoon-style, comic-book-style, animation-style) would give Seedance weaker cues for live-action wuxia video. Save those styles for boards that drive animated or stylised video models.
