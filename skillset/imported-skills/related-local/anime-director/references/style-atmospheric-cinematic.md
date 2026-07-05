# Style anchor — Atmospheric cinematic (Shinkai / Hosoda / CoMix Wave)

The atmospheric-cinematic register — Makoto Shinkai's hyperreal painterly skies, Mamoru Hosoda's warm cinematic light, CoMix Wave Films' photographic-reference background art, the tradition of anime that treats the location and the light as full characters in the scene. Use this for emotional cinematic moments, weather-as-mood, time-of-day-as-drama, atmospheric establishing sequences, OP/ED-style montages, and any scene where the air itself carries the feeling. This register puts almost as much weight on backgrounds as on characters — Seedance handles it differently.

## The anchor paragraph (paste into every prompt)

> Atmospheric-cinematic anime production board in the Shinkai / Hosoda register. Deep midnight-blue body background (#0F1838) with thin gold (#D9B85A) accent dividers, evoking a film-school cinematography sheet. Header bar in deep prussian blue with title in elegant serif display type, plus a small Japanese subtitle in calligraphic kanji or kana. Panel borders are thin 1px gold. E-conte cells rendered as Shinkai-flavoured cinematic anime frames — anime characters drawn in clean digital style with large emotive eyes, but composited into hyperreal painted backgrounds with photographic depth, dramatic skies, lens flare, atmospheric haze, volumetric god-rays through windows or trees, water reflections, granular cloud detail, time-of-day specificity. Lineart on characters is fine, restrained, with soft cel shading and subtle subsurface tones. Backgrounds dominate the cell composition more than in other registers — characters often occupy 30-40% of the frame with the rest given to environment. Top-down floorplan rendered in cool tonal blue-grey with gold camera markers. Camera position chips are gold rounded squares with deep-blue numbers and small camera-icon arrows. Path-of-action arrows are dashed gold. E-conte cell number badges are gold with deep-blue "CUT N" text. Caption text inside panels is cream in a fine elegant sans-serif. Overall feel: cinematic, atmospheric, emotional, painterly — like a Shinkai pre-production sheet meets a film-school cinematography binder. Subtle film grain throughout. No watermarks, no real studio logos, no flat cel shading without atmospheric integration.

## Default colour-to-role mapping

| Element | Hex | Role |
|---|---|---|
| Midnight blue | #0F1838 | Body background |
| Prussian blue | #1F2D5C | Header bar, panel borders |
| Gold accent | #D9B85A | Path-of-action, badges, dividers |
| Cream | #F0E8D8 | Caption text |
| Coral / sunset | #E07856 | Optional warm accent for sunset / golden-hour scenes |
| Cool steel | #5C6E80 | Floorplan strokes |

## Project palette swatches

Atmospheric-cinematic palettes are time-of-day driven — the time of day IS the palette:

- **Golden hour / sunset** → warm gold, coral, deep burnt orange, dusty pink, indigo (the "Shinkai sunset")
- **Blue hour / dusk** → deep teal, dusty rose horizon, navy, gold lamp glow, charcoal
- **Night / urban** → midnight blue, sodium-lamp orange, cyan signage, blacks, neon accents
- **Rainy / overcast** → cool grey, washed teal, soft white, pale yellow umbrella, slate
- **Snow / winter** → bone white, pale blue, dusty pink dawn, charcoal trees, gold window glow
- **Summer cicada noon** → bleached blue sky, deep green, white concrete, harsh shadow, warm skin

## Studio / director references

Pick one based on the scene's emotional register:

- **Makoto Shinkai (CoMix Wave Films)** — hyperreal painted backgrounds, dramatic skies, lens flare, weather-as-emotion, melancholic romance and longing (Your Name, Weathering With You, Suzume, 5 Centimeters per Second, The Garden of Words)
- **Mamoru Hosoda (Studio Chizu)** — warmer, more grounded, family drama, summer-day feeling, painterly without the lens flares (Wolf Children, Summer Wars, Mirai, The Boy and the Beast)
- **Naoko Yamada (when in atmospheric mode)** — quiet, observed, restrained but emotionally precise, Liz and the Blue Bird-flavoured (A Silent Voice, Liz and the Blue Bird, The Colors Within)
- **Studio Ponoc** — Ghibli-adjacent with modern atmospheric polish (Mary and the Witch's Flower, Modest Heroes)
- **Yuasa Masaaki / Science Saru** — bolder, more abstract atmospheric register, painterly but fluid (Night Is Short Walk On Girl, Ride Your Wave, Devilman Crybaby quiet moments)

## Photographic style note for the e-conte cells

For atmospheric-cinematic register, the e-conte cells should be specified as "Shinkai-flavoured cinematic anime keyframes — clean digital anime characters composited into hyperreal painted backgrounds, with dramatic time-of-day light, atmospheric haze, lens flare on bright sources, volumetric god-rays where appropriate, and granular cloud or weather detail. Backgrounds occupy 60-70% of the frame; characters anchor the composition rather than dominating it."

This is the inverse weighting of shonen-action (where the character's body fills the frame). For atmospheric-cinematic, the *space the character is in* is doing the emotional work.

## Background plate emphasis

In the environment / location section (Section 5 of the storyboard prompt structure), the location plate should be **larger and more detailed** than in other registers — specify it as "a hyperreal painted anime background plate in the Shinkai register, rendered with photographic depth, granular sky detail, atmospheric haze layers, and light handling that establishes the time of day as a character in the scene". This plate is the visual anchor for the entire generation.

## When to use

- Emotional cinematic moments, longing, parting, reunion
- Establishing sequences with time-of-day or weather as mood
- OP / ED style montages and AMV-style atmospheric work
- Music videos that lean cinematic rather than action
- Quiet held moments where the wind / rain / light carries the feeling
- Anything where the user invokes Shinkai, Hosoda, "Your Name", "Weathering With You", "Wolf Children", "5 Centimeters per Second", or "anime sunset"

## When NOT to use

- Combat sequences, sports moments → use shonen-action
- Casual slice-of-life dialogue without strong atmospheric emphasis → use modern-tv-anime
- 90s / period anime with hand-painted feel → use classic-cel
- Comedy or fast-paced dialogue scenes → the atmospheric register fights the energy

## Pacing note

Atmospheric-cinematic cuts run **slower** than other registers. Default cut timings:
- Establishing wide of location: ~2.5-3.5s (held to let the atmosphere land)
- Character beats: ~1.8-2.5s
- Insert / detail: ~1.5-2.0s
- Final held closer: ~3.0-4.0s (often the longest beat)

This means an 8-cut atmospheric sequence usually wants the full 15-second budget; sometimes 8 cuts is too many — consider 6 cuts with longer holds for very atmospheric scenes.

## Seedance handoff note

Atmospheric-cinematic register has reasonable representation in Seedance 2's training (Shinkai is famous enough that the model has decent priors), but the rendering is **harder** than other registers because the character/background integration has to feel seamless. Specific instructions that help:

- **Always specify "anime characters composited into hyperreal painted backgrounds"** explicitly — this is the technical description of what Shinkai does
- **Always name the time of day** ("golden hour", "blue hour", "rainy afternoon") — atmospheric register depends on light specificity
- **Always name lens flare / atmospheric haze / volumetric light** if appropriate — these are the signature texture markers
- **Restrain the camera** — atmospheric register uses held frames and slow gentle movement, not dynamic motion

For weather / particle effects (rain, snow, cherry blossoms), specify them in the Seedance prompt's audio and SFX sections as well as the visual sections — Seedance handles particle motion better when reinforced from multiple angles.
