# Style anchor — deconstructive wuxia production board

The deconstructive style — mud-and-blood-toned with stencilled title, broken-grid layout, vérité panels — for Tsui Hark *The Blade* / *Ashes of Time*-era / fragmented-jianghu clips. It reads as "real production board for a Hong Kong action film that is being deliberately stripped of its genre comforts" and is the right register when Seedance 2 needs to inherit handheld energy, withheld clarity, and atmospheric load.

## The anchor paragraph (paste into every deconstructive-mode prompt)

> Deconstructive wuxia production-board layout in the style of Tsui Hark's *The Blade* pre-production aesthetic — vérité, mud-and-blood-toned, deliberately stripped of genre polish. Header band in storm-grey (#3A3A36) with stencilled bone-white title (#E8DFCB), small bone-white sans-serif metadata, and a vermillion-red MODE DECLARATION chip in the top-right reading "DIRECTORIAL MODE: DECONSTRUCTIVE (TSUI HARK / THE BLADE REGISTER)". Bone-white-with-grime body background (#E8DFCB with subtle dirt/spatter texture) with thin 2px charcoal-black borders separating panels — borders deliberately slightly uneven, as if printed on a press that needs servicing. Panel headings in stencil-style sans-serif, charcoal black, with thin vermillion-red accent rules. Photographic content (set photo, combatant portraits, eight storyboard frames) shot in deconstructive wuxia photography style — handheld energy, hard low-key lighting, atmospheric load (wind/rain/dust/mud/smoke visible in nearly every frame), high contrast, deep blacks, mud and blood accents, foreground occlusion welcomed (bamboo, hanging cloth, crowds, animals), heavy film grain. Top-down choreography plan in stark charcoal-on-bone-white architectural-blueprint style with mud-tone fills. Camera position chips are bold black squares with bone-white sans-serif numbers. Combatant flow lines: dashed VERMILLION RED for attacker path, dashed STEEL BLUE for defender path. Path-of-blade arcs are thin BLOOD RED (#8B1A1A) curves rather than gold. Storyboard frame number badges are charcoal-black with bone-white numbers. Caption text inside panels is charcoal in a slightly weathered grotesque sans-serif. Palette swatches in the header are muted, mud-toned, deliberately unappealing — no jewel tones. Overall feel: vérité, raw, survivalist, atmospheric, fragmented — like a real production board for a film about the genre's collapse, not a celebration of it. No watermarks, no real brand logos, no decorative graphic flourishes, no glossy gradients, no jewel-tone calligraphy, no anachronistic items, no firearms.

## Default colour-to-role mapping

| Element | Hex | Role |
|---|---|---|
| Charcoal black | #1A1A1A | Panel borders, panel headings, frame number badges |
| Storm grey | #3A3A36 | Header bar background |
| Bone white | #E8DFCB | Header title text (stencilled), body background base |
| Mud brown | #6B4F3A | Floorplan terrain shading, palette swatch dominant |
| Blood red | #8B1A1A | Path-of-blade arcs, panel-heading accent rules |
| Vermillion red | #C8302C | MODE DECLARATION chip, attacker-path dashed line |
| Steel blue | #3A5A7A | Defender-path dashed line |
| Spatter accent | varies | Subtle blood/mud spatter texture on body background |

## Project palette swatches (header)

For deconstructive wuxia, the palette swatches should be muted and deliberately unappealing — no jewel tones, no gold, no jade. Three to four colours, all earth-toned:

- **Bamboo forest at dusk (deconstructive)** → mud brown, storm grey, bone white, blood red
- **Marketplace ambush** → ochre, dust grey, mud brown, blood red, charcoal
- **Riverside reedbed in storm** → reed green-grey, storm grey, mud brown, bone white
- **Derelict shrine, night** → ash black, lantern amber (single source), mud brown, bone white
- **Snowfield, winter dusk** → ice grey, bone white, mud brown, blood red, deep grey-blue
- **Remote inn, lantern-lit** → smoke grey, lantern amber, mud brown, charcoal, blood red

The palette swatches matter — they signal to GPT Image 2 (and to anyone reading the board) that this is *not* a celebration palette. Resist the urge to "rescue" the palette with a jewel tone.

## Typography

- **Project title in header**: stencilled-style sans-serif (think industrial stamp or military stencil), all caps, bone white on storm grey, ~3x larger than other header text — NOT calligraphic. The stencilled register is part of the mode statement.
- **MODE DECLARATION chip (top-right)**: small caps sans-serif, bone white on vermillion red, ~10pt equivalent
- **Header metadata labels**: small caps sans-serif, bone white, ~10pt equivalent
- **Header metadata values**: regular sans-serif, bone white, ~12pt equivalent
- **Panel headings** ("COMBATANT + WEAPON REFERENCE", etc.): stencil-style sans-serif, charcoal, ~14pt equivalent, with a thin blood-red rule beneath
- **Caption text inside panels**: regular slightly-weathered grotesque sans-serif, charcoal, ~10pt equivalent
- **Italic action descriptions under storyboard frames**: italic sans-serif, charcoal, ~9pt equivalent
- **MODE BREAK chips (hinge sequences only)**: bold sans-serif, bone white on charcoal, ~9pt equivalent

## Photographic style note

Deconstructive mode photography is the load-bearing visual signature. Specify in the prompt:

> All photographic content (set photo, combatant grid portraits, eight storyboard frames) shot in the same deconstructive wuxia photography style — handheld energy, hard low-key key light from a single practical source (lantern, fire, sky-through-clouds), heavy atmospheric load (wind visible in cloth, rain in sheets, dust raked by light, fire smoke trails, mud splash), foreground occlusion in most frames (bamboo, hanging cloth, crowds, animals breaking up sightlines), high contrast, deep blacks, mud and blood accents, heavy film grain. Same dirty, weather-laden colour grading throughout. Violence is withheld — outside frame, obscured, or so close to lens it cannot resolve.

If the prompt doesn't say this, the storyboard frames often come back looking like stock kung-fu stills with weather added on top, which is the wrong mode. The atmosphere has to look *baked into* the frame, not painted over it.

## Stencil title note

The stencilled title is the most distinctive element of the deconstructive board, and contrasts deliberately with the classical board's calligraphic title. To get it to render well:

- Specify "stencilled-style sans-serif title, like an industrial stamp or military stencil"
- Avoid the words "calligraphy", "brush-script", "elegant" anywhere in the title spec
- Bone-white-on-storm-grey is the right contrast; do not invert (storm-grey-on-bone-white renders as too gentle)
- The title can be slightly broken or distressed at the edges — this is appropriate to the mode

## Hinge-mode note

When the directorial mode is HINGE (opens classical, breaks at shot N), use the **classical** anchor for the board base — the header is calligraphic, the body is rice-paper cream, the path-of-blade arcs are gold. Then add a clear inset:

- The MODE DECLARATION chip in the top-right reads `"DIRECTORIAL MODE: HINGE — OPENS CLASSICAL, BREAKS AT SHOT [N]"` and is split-coloured (left half vermillion, right half storm grey)
- A `MODE BREAK` chip appears on shot [N]'s caption block in bone-white on charcoal
- The atmospheric content of the storyboard frames progressively shifts from classical-clean (shots 1 to N-1) to deconstructive-loaded (shots N to 8)
- The lighting/cinematography panels in tier 3 carry both registers, with arrows noting the transition

Do not use this anchor (the deconstructive one) for hinge sequences — the hinge requires the classical visual base in order for the break to read as a break.

## When to use this anchor

Use the deconstructive anchor when:

- The mode declaration says DECONSTRUCTIVE (Tsui Hark / The Blade register)
- The user references Tsui Hark *The Blade*, *Ashes of Time*, or asks for "brutal", "muddy", "vérité", "raw", "survivalist", "fragmented" wuxia
- The story features an ambush, a flawed hero, a violated chivalric code, a coward master, or a survival-not-honour outcome
- The setting is a derelict shrine, a marketplace at dusk, a remote inn at night, a riverside in storm, or any jianghu location described with weather and grime

## When NOT to use this anchor

- The mode declaration says CLASSICAL — use the classical anchor instead
- The mode declaration says HINGE — use the classical anchor as the base, with the additions noted above
- The user explicitly requested "elegant" or "graceful" or "ceremonial" wuxia — those are classical flags, and the deconstructive anchor will fight against them

## Why this style works for the Seedance handoff

Seedance 2 reads the storyboard image as visual reference. A cleanly-laid-out deconstructive wuxia board in this style gives Seedance:

- Clear combatant look from the portrait grid (in the right register) → handheld-energy combatant rendering in the clip
- Clear weapon shape from the weapon close-up (smeared, dirtied) → the weapon does not get "rescued" into a clean classical look
- Clear shot composition from the storyboard frames (with violence withheld and foreground occlusion) → Seedance can match the vérité framing
- Clear lighting/colour mood from the deconstructive photography → the clip inherits the same cold high-contrast grade with mud and blood accents
- Clear atmospheric instruction from the storyboard's per-frame weather notes → wind, rain, dust, mud, fire are baked into the clip rather than added as post-effect
- Clear mode commitment from the MODE DECLARATION chip → Seedance does not average classical and deconstructive cues, and does not "rescue" the clip into a cleaner classical look

A board that is "deconstructive in concept but classical in visual style" (clean rice-paper background, gold accents, calligraphic title) will fight against the deconstructive shot list — Seedance will read the visual register and ignore the textual one. Commit fully to the mud-and-blood register on the board itself.
