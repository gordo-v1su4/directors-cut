# Style anchor — Shonen action (Demon Slayer / JJK / MHA / Bleach / Naruto)

The shonen-action register — bold inked outlines, heavy speed lines, dynamic camera, sakuga combat, impact frames, sweat and dust particles, the over-the-top expressive register that makes shonen feel like shonen. Use this for combat scenes, sports anime, super-power sequences, transformation moments, and any cut where the action *is* the point. This register trades restraint for impact, and gives Seedance very different cues than the calmer slice-of-life anime registers.

## The anchor paragraph (paste into every prompt)

> Shonen-action anime production board with bold dynamic energy. Dark charcoal body background (#1A1A22) with thin bright accent dividers in red (#D93030) or gold (#E0B14A). Header bar in solid black with title in bold inked display type, slightly stylised, plus a small Japanese subtitle in stencil katakana. Panel borders are thick 3px solid black with sharp corners. E-conte cells rendered as bold inked anime keyframes in shonen-action style — heavy black lineart with strong line-weight variation, dramatic chiaroscuro cel shading with hard shadows and bright highlights, dynamic foreshortening, exaggerated perspective, motion blur and speed lines on action cuts, sweat drops and dust particles where appropriate, impact frames as stark high-contrast single-tone stills with white outline figures on coloured radial backgrounds. Backgrounds rendered with strong perspective and depth — clean digital but bolder than slice-of-life, often with the horizon dropped low for dynamic framing. Top-down floorplan rendered in dark blueprint style — white lines on charcoal with red action arrows. Camera position chips are red squares with white numbers and bold camera-icon arrows. Path-of-action arrows are thick red brush strokes with energy. E-conte cell number badges are red with white "CUT N" text. Caption text inside panels is white in a bold compressed sans-serif. Overall feel: kinetic, intense, dramatic, willing to break realism for impact — like a real Demon Slayer / JJK / MHA pre-production sheet. No watermarks, no real studio logos, no over-saturation, no soft pastel.

## Default colour-to-role mapping

| Element | Hex | Role |
|---|---|---|
| Bold red | #D93030 | Accent, badges, path-of-action arrows |
| Gold | #E0B14A | Alt accent for "hero" energy projects |
| Charcoal | #1A1A22 | Body background |
| Solid black | #000000 | Header, panel borders, lineart suggestion |
| White | #FFFFFF | Caption text, chip number text |
| Electric blue | #2050D9 | Optional secondary accent (energy effects) |

## Project palette swatches

Shonen-action palettes are bold, contrasty, with one or two signature colours that match the protagonist's element / power / costume:

- **Fire / sword shonen** (Demon Slayer / Bleach) → black, white, deep red, gold, ember orange
- **Energy / curse shonen** (JJK / Mob Psycho) → black, charcoal, neon purple, cold cyan, blood red
- **Hero / power shonen** (MHA / One Punch Man) → bold red, royal blue, gold, white, charcoal
- **Ninja / movement shonen** (Naruto / Boruto) → orange, deep green, charcoal, sand tan, sky blue
- **Sports shonen** (Haikyuu / Kuroko / Blue Lock) → team colours plus charcoal, white, accent red

## Studio / director references

Pick one based on the action's flavour:

- **ufotable** — gold-standard sakuga, particle effects, photo-real backgrounds with anime characters, signature compositing (Demon Slayer, Fate/Zero, Fate/stay night UBW)
- **MAPPA action** — prestige TV combat, willing to be dark, polished sakuga (Jujutsu Kaisen, Chainsaw Man, Attack on Titan final seasons, Hell's Paradise)
- **Bones** — clean dynamic combat, expressive characters, willing to go super-saturated (My Hero Academia, Mob Psycho 100, Soul Eater, Bungo Stray Dogs)
- **Studio Pierrot** — classic shonen TV (Naruto, Bleach, Black Clover)
- **Production I.G action** — technical precision (Haikyuu, Kuroko's Basketball, Psycho-Pass action scenes)
- **Trigger** — explosive expressive combat, willing to break model entirely for impact (Kill la Kill, Promare, SSSS.Gridman)
- **WIT (early Attack on Titan)** — kinetic three-dimensional combat, dynamic camera

## Photographic style note for the e-conte cells

For shonen-action register, e-conte cells should be specified as "bold inked shonen-action keyframes — heavy lineart with strong weight variation, dynamic foreshortening, dramatic perspective, hard cel shadows, motion blur on movement cuts, speed lines on impact cuts". For impact-frame cuts specifically, add: "Impact frame: stark high-contrast still with white outline figure on a radial coloured background, single sound-effect text in stencil katakana".

The exaggerated perspective and dynamic foreshortening are non-negotiable for shonen — without explicit instruction, GPT Image 2 will default to flatter, more polite framing and the cells lose their shonen energy.

## When to use

- Combat scenes, weapon fights, super-power exchanges
- Sports anime — game moments, training breakthroughs
- Transformation / power-up sequences
- Mecha cockpit moments and battle (with caveats — Trigger-style mecha specifically)
- Any cut where the user invokes Demon Slayer, JJK, MHA, Bleach, Naruto, Dragon Ball, One Piece, ufotable, MAPPA action, Bones, or "sakuga"

## When NOT to use

- Quiet dialogue, slice-of-life, romance → use modern-tv-anime
- Pastoral fantasy, period drama → use classic-cel
- Atmospheric-cinematic moods → use atmospheric-cinematic
- Anything where the bold register would fight the emotional content

## Pacing note

Shonen-action cuts run **faster** than other registers. Default cut timings should be:
- Establishing wide: ~1.5s (held just long enough)
- Action exchanges: ~0.8-1.2s each
- Impact frame: ~0.3-0.5s (a beat)
- Reaction close-up: ~1.0-1.5s
- Held aftermath: ~2.0-3.0s (the held breath after the action)

This means an 8-cut shonen sequence runs ~10-12 seconds rather than the 14-second default — within Seedance 2's 4-15s budget. Don't fight the faster pace; lean into it.

## Seedance handoff note

Shonen-action register has good representation in Seedance 2's training (especially MAPPA / ufotable references), so prompts can be slightly less aggressive than classic-cel about naming the studio. However:

- **Always specify "speed lines and motion blur on action cuts"** explicitly in the Seedance prompt, or Seedance produces smoother but less anime-feeling motion
- **Always name impact frames specifically** — "impact frame, ~0.4s, white-outline figure on radial red background, stencil SFX text" — Seedance otherwise tries to interpolate them as continuous motion and the punctuation of the action is lost
- **Always name a specific studio** (ufotable, MAPPA, Bones, Trigger) — generic "shonen anime" is too weak a prior

For longer combat sequences, generate in two halves with the e-conte as @Image 1 in both, then edit together — the 15-second cap is more frequently hit in shonen-action than in slower registers.
