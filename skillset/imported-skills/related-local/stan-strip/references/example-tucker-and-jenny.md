# Worked example — "Tucker & Jenny: Selective Hearing"

This is the full reverse-engineered output file for a two-page slice-of-life comic about a lazy dog with selective hearing — a classic gag premise that tests the skill across two pages with two characters and two locations (living room and kitchen). It shows exactly what a finished output of `stan-strip` should look like end-to-end.

Use this as a reference when in doubt about what level of detail the page prompts need.

---

# Tucker & Jenny: Selective Hearing — Comic Strip Prompts

**Pipeline:** Idea → Page Split → Per-Page Prompts → Comic
**Model:** `gpt-image-2` · Quality `high` · Mode: **Thinking** (recommended for multi-panel layouts)
**Format:** Portrait 2:3 · `1024x1536`
**Style:** Indie zine slice-of-life with one warm spot colour (mustard yellow accent on a cream and black base)
**Pages:** 2

## At a glance

- **Premise:** A lazy dog (Tucker) lying on the couch ignores his frustrated owner (Jenny) who wants him to move so she can vacuum — until she mentions chicken, at which point he becomes instantly attentive.
- **Format:** Portrait 2:3 — designed for Instagram carousel, webtoon scrolling, or mobile-first webcomic
- **Characters:** 2 (Jenny, late 20s human owner; Tucker, a scruffy mid-sized brown dog with attitude)
- **Locations:** 2 (living room, kitchen)
- **Page count:** 2
- **Tone keywords:** Slice-of-life, gentle comedy, relatable, warm, character-driven, observational

---

## Shared style anchor (prepend to every page prompt)

> Indie zine / mini-comic art style with a hand-drawn, slightly imperfect quality. Loose confident black ink line with visible variation in pressure and small honest imperfections (no sterile precision). Limited palette — black ink plus mustard yellow (#D9A82A) as the single spot accent colour, applied in flat washes never gradients. Off-white slightly-warm paper background tone (#F5EFE2) inside panels, with a very subtle paper grain texture. Thin black panel borders drawn by hand (slightly uneven, not ruler-perfect, ~2px equivalent). White gutters between panels. Faces are simplified, expressive, character-first — gesture and silhouette carry the emotion rather than detailed rendering. Backgrounds are sparse, often just enough to suggest place. Speech bubbles are hand-drawn ovals with slightly irregular outlines, dialogue in casual hand-lettered-feel mixed-case lettering. Caption boxes are simple thin-bordered rectangles with the same hand-lettered text. Sound effects are restrained, integrated into the line work, often lower-case, never breaking out of the panels. Slight photocopier-feel artefacts welcome. Overall feel: handmade, intimate, character-driven, the visible texture of a real zine made by a real person on a Tuesday afternoon. No watermarks, no real brand logos, no slick digital gradients, no Marvel-style ink flourish, no halftone dots.

---

## Reference image inventory

Attach these reference images to **both** page prompts below in the order specified.

| Slot | Role | Description | Status |
|---|---|---|---|
| `@Image 1` | Character: Jenny | Three-quarter portrait of Jenny — late 20s woman, shoulder-length brown hair tied back loosely, wearing a faded mustard-yellow sweatshirt and dark grey leggings, casual at-home look | User to generate first |
| `@Image 2` | Character: Tucker | Three-quarter portrait of Tucker — a scruffy mid-sized brown dog with floppy ears, expressive eyebrows, slightly grumpy face, sitting | User to generate first |
| `@Image 3` | Location: Living room | Wide shot of a small cozy living room — a blue-grey couch against a wall, a low coffee table, a vacuum cleaner standing nearby, a window with daylight | User to generate first |
| `@Image 4` | Location: Kitchen | Wide shot of a small kitchen — counter with a fridge in view, a Tupperware container visible on the counter | User to generate first |

### Generate references first

Before running the page prompts, generate the four reference images using these prompts:

**Reference 1 — Character: Jenny**

```
Create a clean three-quarter portrait reference image of a fictional character named "JENNY" for a slice-of-life zine comic. Late 20s woman, friendly relatable face, shoulder-length brown hair pulled back in a loose low ponytail, wearing a faded mustard-yellow crewneck sweatshirt over dark grey leggings, casual barefoot at-home look. Slightly tired but warm expression. Drawn in indie zine style — loose confident black ink line with visible pressure variation, flat mustard-yellow spot colour on the sweatshirt, off-white paper background. Three-quarter view facing slightly camera-left. No background, no other characters, no text. Size: 1024x1024, quality high. The character anchor for a recurring slice-of-life series.
```

**Reference 2 — Character: Tucker**

```
Create a clean three-quarter portrait reference image of a fictional dog character named "TUCKER" for a slice-of-life zine comic. A scruffy mid-sized brown mixed-breed dog, floppy ears, expressive eyebrows that suggest both laziness and attitude, slightly grumpy resting expression, short-medium fur, sitting in a relaxed pose. Drawn in indie zine style — loose confident black ink line with visible pressure variation, flat warm brown spot colour on the fur, off-white paper background. Three-quarter view facing slightly camera-left. No background, no humans, no text. Size: 1024x1024, quality high. The character anchor for a recurring slice-of-life series.
```

**Reference 3 — Location: Living room**

```
Create a wide-angle reference image of a small cozy living room interior for a slice-of-life zine comic. A blue-grey two-cushion couch against a beige wall, a low wooden coffee table in front of it with a couple of magazines, a window with daylight on the right, an upright vacuum cleaner standing parked near the couch. Drawn in indie zine style — loose confident black ink line, very limited spot colour (just hints of warm wood and the blue-grey couch), off-white paper background. No characters, no text. Size: 1536x1024, quality high. The location anchor for the comic's main interior.
```

**Reference 4 — Location: Kitchen**

```
Create a wide-angle reference image of a small kitchen interior for a slice-of-life zine comic. A short kitchen counter with a fridge visible at one end, a Tupperware container of leftovers sitting on the counter, simple cabinets above. Warm domestic feel. Drawn in indie zine style — loose confident black ink line, very limited spot colour (just a small mustard-yellow accent on the Tupperware lid), off-white paper background. No characters, no text. Size: 1536x1024, quality high. The location anchor for the comic's secondary interior.
```

Once you have the four reference images, save them and attach them in slots `@Image 1` through `@Image 4` when running each page prompt below.

---

## Page running order

Run the page prompts below in numbered order, attaching the same four reference images to both prompts. For page 2, optionally also attach the generated page 1 as `@Image 5` to compound style consistency.

---

## Page 1 — Setup: The Vacuuming Stalemate

**Meta:** 4 panels · 2x2 grid · portrait 2:3 · ends on Jenny giving up and walking away (turn into the kitchen)

```
Create a single comic page titled "Selective Hearing" — page 1 of 2 from "Tucker & Jenny". A 4-panel indie zine slice-of-life comic page in a 2x2 grid.

Format: portrait 2:3 comic page, 2x2 grid of four equal-sized rectangular panels, hand-drawn thin black panel borders ~2px (slightly uneven, not ruler-perfect), white gutters of 8px between panels, off-white slightly-warm paper background tone (#F5EFE2) inside panels with subtle paper grain texture, 24px outer page margin.

[Apply shared style anchor.]

Reference images:
@Image 1: Jenny — preserve face, hair, and signature mustard-yellow sweatshirt exactly across all panels.
@Image 2: Tucker — preserve dog breed, fur colour, ear shape, and grumpy attitude exactly across all panels.
@Image 3: Living room — preserve setting layout (blue-grey couch, low coffee table, vacuum cleaner, window) and the cosy warmth.

Character anchors:
- "JENNY": late 20s woman, shoulder-length brown hair in a loose low ponytail, faded mustard-yellow crewneck sweatshirt, dark grey leggings, barefoot, slightly tired warm expression.
- "TUCKER": scruffy mid-sized brown mixed-breed dog, floppy ears, expressive eyebrows that read as lazy-with-attitude, sitting or lying in a relaxed grumpy pose.

Panel breakdown (read left-to-right, top-to-bottom):

Panel 1 (medium shot, eye-level, living room): JENNY stands in the living room holding the upright vacuum cleaner. TUCKER is sprawled across the blue-grey couch, eyes half-closed. JENNY looks at TUCKER with a polite-but-tired expression. The vacuum is humming.
  - Speech bubble (tail to JENNY): "Tucker, can you move so I can vacuum?"
  - SFX integrated into panel art: "vrrrrrrr" — small lower-case mustard-yellow letters running along the base of the vacuum, restrained, not breaking the panel.

Panel 2 (silent panel, close-up, eye-level, on TUCKER): tight close-up on TUCKER's face. His eyes are completely closed now, ears slightly back, the picture of deliberate ignoring. No movement.
  - No speech bubble in this panel.
  - Caption box (top-left, thin-bordered rectangle): "Zero interest detected."

Panel 3 (medium shot, eye-level, living room): JENNY has stepped closer to the couch, one hand on her hip, the other still on the vacuum. She is looking down at TUCKER with mild exasperation. TUCKER still has not moved.
  - Speech bubble (tail to JENNY): "Tucker. I said move."
  - Speech bubble (cloud-shape thought bubble, tail to TUCKER): "If I don't look at her, she's not talking to me."
  - SFX integrated into panel art: "tap tap" — small lower-case mustard-yellow letters near where the vacuum nudges the couch base, restrained.

Panel 4 (wide shot, eye-level, living room with kitchen visible through doorway): JENNY has turned away and is walking toward the kitchen doorway, still slightly grumpy. TUCKER is still on the couch in the foreground, eyes still closed. The kitchen is faintly visible beyond.
  - Speech bubble (tail to JENNY, slightly muttering — small dashed border): "Fine. I'll just grab some leftover chicken…"
  - No SFX in this panel.

Lettering across the page:
- Speech bubbles are hand-drawn ovals with slightly irregular outlines and thin black borders, dialogue in casual hand-lettered-feel mixed-case lettering (NOT all-caps).
- Thought bubble (panel 3, Tucker) is a scalloped cloud shape with small trailing bubbles connecting to TUCKER.
- Whisper/muttering bubble (panel 4, Jenny) has a thin dashed border instead of solid.
- Caption box (panel 2) is a simple thin-bordered rectangle with the same hand-lettered text.
- SFX is restrained lower-case integrated into the panel art, mustard-yellow on cream, never breaking out of panel borders.

Quality: high. Use Thinking mode if available — multi-panel layouts benefit significantly from layout planning. Size: 1024x1536.

Maintain character design across all panels — same face, hair, build, and signature wardrobe as @Image 1 and @Image 2. Maintain location design as @Image 3.
Render exactly 4 panels in a 2x2 grid — do not merge, drop, or add panels.
Render all dialogue, captions, and SFX text exactly as quoted, with no paraphrasing.
No watermarks, no real brand logos, no extra speech bubbles, no extra caption boxes, no text outside the specified verbatim lettering. The strip ends on Jenny's muttered "leftover chicken…" — that line MUST appear exactly as quoted because it is the setup for the punchline on page 2.
```

---

## Page 2 — Punchline: The Word "Chicken"

**Meta:** 4 panels · 2x2 grid · portrait 2:3 · ends on Tucker's punchline reaction in the kitchen

```
Create a single comic page titled "Selective Hearing" — page 2 of 2 from "Tucker & Jenny". A 4-panel indie zine slice-of-life comic page in a 2x2 grid. Page 2 is the punchline payoff to page 1.

Format: portrait 2:3 comic page, 2x2 grid of four equal-sized rectangular panels, hand-drawn thin black panel borders ~2px (slightly uneven), white gutters of 8px between panels, off-white slightly-warm paper background tone (#F5EFE2) inside panels with subtle paper grain texture, 24px outer page margin.

[Apply shared style anchor.]

Reference images:
@Image 1: Jenny — preserve face, hair, and signature mustard-yellow sweatshirt exactly across all panels.
@Image 2: Tucker — preserve dog breed, fur colour, ear shape, and expressions exactly across all panels.
@Image 3: Living room — preserve setting (blue-grey couch, low coffee table, vacuum cleaner).
@Image 4: Kitchen — preserve setting (counter, fridge, Tupperware on counter).
@Image 5 (optional): page 1 of this comic — match the exact rendering style, line weight, colour palette, and lettering hand-feel.

Character anchors: same as page 1 — JENNY (late 20s, mustard-yellow sweatshirt) and TUCKER (scruffy brown dog with floppy ears).

Panel breakdown:

Panel 1 (close-up, low angle, on TUCKER): tight close-up on TUCKER's face on the couch — but his eyes have just snapped wide open. Ears perked sharply forward. The exact opposite of his previous expression. The couch and a corner of the living room are visible behind him.
  - No speech bubble in this panel.
  - Speech bubble (tail to TUCKER, bold/emphasised — slightly larger letters with a faint outline): "CHICKEN?!"
  - SFX integrated into panel art: "POP!" — small mustard-yellow lower-case-with-an-exclamation, near TUCKER's shoulder where he has snapped upright. Restrained but emphatic.

Panel 2 (action shot, medium-wide, dynamic angle, transitioning from living room toward kitchen): TUCKER is mid-launch off the couch — back legs still pushing off, body extended forward, ears flapping back, a single line of motion behind him suggesting speed. The couch is visible behind, the kitchen doorway ahead. JENNY is not in this panel.
  - No speech bubble in this panel.
  - SFX integrated into panel art: "thud-thud-thud" — small mustard-yellow lower-case running along the floor in his direction of travel, restrained motion suggestion.

Panel 3 (medium shot, eye-level, kitchen): TUCKER is now sitting perfectly at JENNY's feet in the kitchen. Tail visibly wagging (a small motion arc). Ears forward. The picture of attentiveness. JENNY is holding a Tupperware container, looking down at him with deadpan recognition. The kitchen counter and fridge are visible behind.
  - Speech bubble (tail to JENNY, deadpan — small letters, regular oval): "So you can hear."
  - No SFX in this panel.

Panel 4 (close-up, eye-level, on TUCKER): tight close-up on TUCKER, looking up directly at the camera (or toward where JENNY is standing). Ears still forward, expression earnest, no longer grumpy at all.
  - Speech bubble (tail to TUCKER): "Only when it's important."
  - Caption box (bottom-right, thin-bordered rectangle, the closing button of the strip): "End."

Lettering across the page: same as page 1 — hand-drawn ovals with slightly irregular outlines, mixed-case casual lettering for dialogue, "CHICKEN?!" rendered slightly bolder and larger for emphasis but still in the same hand-lettered register, SFX restrained mustard-yellow lower-case integrated into the panel art.

Quality: high. Use Thinking mode if available. Size: 1024x1536.

Maintain character design across all panels and consistently with page 1 — same JENNY (mustard sweatshirt, brown ponytail) and same TUCKER (scruffy brown dog) as established in @Image 1, @Image 2, and the previous page. Maintain location design as @Image 3 and @Image 4.
Render exactly 4 panels in a 2x2 grid — do not merge, drop, or add panels.
Render all dialogue, captions, and SFX text exactly as quoted, with no paraphrasing. "CHICKEN?!" appears exactly as quoted because it is the punchline payoff.
No watermarks, no real brand logos, no extra speech bubbles, no extra caption boxes, no text outside the specified verbatim lettering.
```

---

## Generation notes

- **The two pages are coupled by the chicken setup.** Jenny's muttered "leftover chicken…" at the end of page 1 sets up Tucker's "CHICKEN?!" eruption at the start of page 2. If page 1's final dialogue gets paraphrased ("some leftovers" instead of "leftover chicken"), the joke breaks. Don't tidy that line.
- **Run page 1 first**, then page 2 with both the four references AND page 1 itself attached as `@Image 5` to compound style consistency.
- **Tucker's expression flip is the visual joke.** On page 1 his expression is consistently lazy-grumpy-eyes-closed. On page 2 panel 1 it MUST snap to wide-open ears-forward. If GPT Image 2 produces a half-asleep Tucker on page 2, regenerate that page with the eyebrow snap described more emphatically ("Tucker's eyes have just snapped fully open from completely closed; ears went from back to sharply forward; visible alertness").
- **The mustard-yellow spot colour is the only colour.** Everything else is black ink on cream. If a generated page comes back with extra colour (red, blue, green), regenerate with the palette restriction strengthened ("ONLY black ink and mustard yellow #D9A82A — no other colours anywhere on the page").
- **Hand-feel is load-bearing.** If pages come back too clean / too digital, regenerate with the imperfection language strengthened ("hand-drawn panel borders are visibly uneven; ink line has clear pressure variation; this is a real zine made by a human, not digital line art").
- **For Instagram carousel distribution**, both pages already render at 1024x1536 portrait — the right shape for carousel slides. For a square-feed version, regenerate at 1024x1024 with the grid kept as 2x2 (the panels become more square and equally weighted).
- **For a single-strip horizontal version** (e.g. a 4-panel daily-strip layout in 1536x512), regenerate with the grid changed to a single horizontal row of four panels and switch the style anchor to newspaper-strip — but the indie-zine register fits this content's slice-of-life tone better than the newspaper register, so the portrait-2x2 default is recommended.
