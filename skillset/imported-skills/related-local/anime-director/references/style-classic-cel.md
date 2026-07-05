# Style anchor — Classic cel / Ghibli / 90s OVA / Madhouse

The classic-cel register — Studio Ghibli's hand-painted warmth, 90s OVA Madhouse precision, Production I.G's pre-digital craft, the era when anime was painted on physical cels with brushes and airbrushes. Use this for fantasy, period pieces, slow-paced character drama, melancholy, and any scene where the grain and the brushwork are part of the emotional register. This style trades modern polish for hand-made warmth — and gives Seedance a very different texture to work from.

## The anchor paragraph (paste into every prompt)

> Classic-cel anime production board in the style of a 1990s OVA pre-production sheet. Warm parchment body background (#F0E5CD) with subtle paper grain texture and faint scan-line noise. Header bar in deep maroon (#5A2A2A) or forest green (#2A4A3A) with a hand-lettered display title and small typewriter-style metadata. Panel borders are 2px hand-inked feeling lines, slightly uneven. E-conte cells are rendered as hand-painted anime keyframes with visible cel paint texture — flat painted shadows with hard edges, gouache-style fills, slight registration offsets between paint layers, soft brushwork in the highlights. Lineart is slightly variable in weight, hand-inked feeling. Backgrounds are painted *bijutsu* / *haikei* — gouache and watercolour washes, visible brushstrokes, warm palette, painted detail rather than digital gradients (Ghibli-style or Madhouse-style depending on tone). Top-down floorplan is loose pencil-and-watercolour with handwriting-style camera labels. Camera position chips are circular hand-drawn ink with handwritten numbers. Path-of-action arrows are thick brush-pen strokes in deep red. E-conte cell number badges are deep maroon circles with white inked numbers. Caption text inside panels is dark sepia in a typewriter monospace or soft brush-style serif. Overall feel: warm, hand-made, textured, slightly weathered — like a real 1990s production cel binder. Subtle film grain throughout. No watermarks, no real studio logos, no glossy gradients, no digital sharpness.

## Default colour-to-role mapping

| Element | Hex | Role |
|---|---|---|
| Deep maroon | #5A2A2A | Header bar, badges, accents (warm-tone projects) |
| Forest green | #2A4A3A | Header bar, badges, accents (Ghibli-flavoured projects) |
| Warm parchment | #F0E5CD | Body background |
| Sepia ink | #4A3520 | Caption text, lineart suggestion |
| Brush red | #B33A2A | Path-of-action arrows |
| Soft ochre | #C9A065 | Floorplan furniture and warm accents |

## Project palette swatches

Classic-cel palettes are typically muted, earthy, and limited. Five swatches max:

- **Ghibli pastoral** → moss green, warm cream, soft sky blue, terracotta, oak brown
- **Madhouse 90s urban** → twilight navy, neon magenta, sodium-lamp yellow, charcoal, cream
- **Period drama / fantasy** → forest green, deep maroon, parchment cream, gold leaf, deep brown
- **Melancholy slice-of-life** → muted teal, dusty rose, faded cream, sepia, slate

## Studio / director references

Pick one based on the scene's tone:

- **Studio Ghibli (Miyazaki / Takahata)** — pastoral, warm, painted backgrounds with extraordinary detail, restrained character animation, slow pacing, food and weather as lived-in detail (Totoro, Spirited Away, Whisper of the Heart, Only Yesterday)
- **Madhouse (1990s)** — sharp craft, urban or sci-fi settings, willing to be dark, more dynamic than Ghibli (Perfect Blue, Ninja Scroll, Cardcaptor Sakura, X 1999)
- **Production I.G (1990s pre-digital)** — precise, technical, often near-future or political (Ghost in the Shell 1995, Patlabor 2)
- **Studio Pierrot 80s/90s** — bold colour, expressive character animation (Yuu Yuu Hakusho, Urusei Yatsura)
- **Tokyo Movie Shinsha (TMS)** — classic action and adventure (Akira, Lupin III)
- **Gainax (pre-2000s)** — energetic, willing to break form (FLCL, original Eva, Gunbuster)

## Photographic style note for the e-conte cells

For classic-cel register, the e-conte cells should be specified as "hand-painted cel-style anime keyframes — flat painted shadows with hard edges, gouache fills, slight registration offsets between paint layers, visible brushwork in the highlights, painted background art rather than digital gradient". The character grid CAN remain as cleaner anime character-design-document style, but the e-conte cells themselves should look hand-painted.

This is one of the few registers where the e-conte cells benefit from looking *less* polished than modern register — the texture and warmth come from the painterly imperfection.

## When to use

- Fantasy and isekai with pastoral or magical-realist tone
- Period pieces, historical, mythological
- Melancholy slice-of-life, quiet character drama
- Children's anime or family-audience work
- 90s-flavoured action / OVA / sci-fi
- Anything where the user invokes Ghibli, Miyazaki, Takahata, Kon, Otomo, or "90s anime"

## When NOT to use

- Modern slice-of-life or contemporary romance → use modern-tv-anime
- Heavy combat sakuga sequences → use shonen-action (though Akira / Ninja Scroll are arguable)
- Realistic urban Tokyo with photo-real backgrounds → use atmospheric-cinematic

## Seedance handoff note

Classic-cel register has weaker representation in Seedance 2's training than modern TV anime, so the prompt should be **more aggressive** about naming the studio reference and the painted-texture descriptors. Repeat "hand-painted cel-style", "visible brushwork", "gouache fills", and the studio name in both the e-conte prompt and the Seedance prompt. The grain and texture are easy for Seedance to lose between generations; over-specify rather than under.

For period pieces and fantasy specifically, also name the era ("1990s OVA register", "Ghibli pastoral mid-90s flavour") to anchor the rendering era — Seedance will otherwise drift toward modern digital cel shading even when asked for classic-cel.
