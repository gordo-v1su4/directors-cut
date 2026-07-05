# Style anchor — newspaper strip

The daily-paper tradition — Calvin and Hobbes, Peanuts, Garfield, The Far Side, Doonesbury, Bloom County. Simple, immediately-readable, ~3-4 panels per strip, often in monochrome or limited colour, designed to land a single gag or beat in a tiny horizontal space.

## The anchor paragraph (paste into every page prompt)

> Newspaper comic strip art style in the daily-paper tradition. Simple confident black ink line work with consistent moderate weight. Either monochrome black-on-cream or limited Sunday-strip colour palette (3-4 flat spot colours, no gradients, no halftone). Very simple backgrounds — often just a horizon line, a single piece of furniture, or a flat colour wash. Faces are highly stylised and simplified — character is read entirely from silhouette, hairstyle, and a few key features. Body proportions are often slightly cartoony (larger heads, simpler hands). Thin black panel borders, classic horizontal-strip layout (typically 3 or 4 equal-width panels in a single row), with classic newspaper-strip proportions. Speech bubbles are clean simple ovals with thin tails; dialogue lettering is clean hand-lettered-feel mixed-case or all-caps depending on the property's tradition. No SFX flourish — sound effects, when present, are tiny and integrated. Overall feel: economical, instantly readable at small print size, single-gag-per-strip rhythm, the comfortable familiarity of a daily newspaper page. No watermarks, no real brand logos, no halftone dots, no Marvel-style inking, no detailed backgrounds, no overcomplicated compositions.

## Default colour-to-role mapping (Sunday-strip colour mode)

| Element | Hex | Role |
|---|---|---|
| Black | #1A1A1A | Line work, lettering |
| Newsprint cream | #F2EBD7 | Page/panel background base |
| Strip red | #C8423A | Spot accent (often the protagonist's signature colour) |
| Strip blue | #4A7BB5 | Sky, denim, secondary accent |
| Strip yellow | #F0C84A | Highlights, hair |
| Strip green | #6E9D5E | Grass, foliage |

For monochrome daily-strip mode, use only black on newsprint cream — no spot colours at all.

## Layout conventions

- **Daily strip**: 3 or 4 panels, single horizontal row, ~3:1 aspect ratio overall. Panel 1 sets up; panel 2 develops; panel 3 (or 3+4) lands the gag.
- **Sunday strip**: traditionally 6-12 panels in a flexible layout, full Sunday-paper page width, can include a "throwaway panel" header. For modern reproduction, 6-8 panels in 2 rows is comfortable.

This format favours **single-page output** — multi-page newspaper strips are uncommon (each strip is its own complete page). If the user wants a multi-strip series, treat each strip as a single page in the output file and run them in order.

## When to use

- Single-gag jokes or anecdotes
- Adaptations of existing newspaper-strip properties
- Daily comic projects (one-strip-per-day Instagram or webcomic format)
- Anything where simplicity and instant readability matter more than visual richness
- Stories that work on a setup-development-punchline rhythm

## When NOT to use

- Action sequences needing visual energy
- Long-form narrative — the strip format is too compressed
- Anything requiring detailed backgrounds or atmospheric work
- Manga / superhero adaptations

## Aspect ratio note

Newspaper strips don't fit cleanly into the standard portrait/landscape options. The recommended sizes for this style:

- **Daily strip**: 1536x512 (3:1 landscape) — pure horizontal row
- **Daily strip alt**: 1024x512 if 1536x512 unavailable — square-ish but stretches well
- **Sunday strip**: 1536x1024 (3:2 landscape) — full-page format with multiple rows

Specify the unusual aspect ratio explicitly in the page prompt's format spec section.
