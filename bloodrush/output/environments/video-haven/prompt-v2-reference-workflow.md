# Video Haven — Nano Banana Reference Workflow V2

The first one-pass contact sheet is rejected as a continuity master because of interior neon repetition, inconsistent sign placement, excess white canvas, and a concept-art finish. Use the following stages in order.

## Stage A — canonical three-wall geography master

Attach the strongest existing Video Haven image as `@Image 1`. It controls the store design, lighting, color, materials, shelves, inventory, and 2003 period. Optionally attach a real-estate or retail-interior photograph as `@Image 2`; it controls only the wide-corner composition and must not influence the store design.

Use `@Image 1` as the exact visual reference for the same Video Haven interior. Create one full-frame 16:9 realtor-style master establishing shot from a rear corner that shows at least three walls and makes the room geography immediately clear. Not a panorama and not a grid. Preserve the reference lighting, color, architecture, materials, shelves, inventory, and period exactly. If `@Image 2` is attached, use it only for camera placement and spatial readability; do not copy its decor, color, materials, windows, fixtures, or architecture. Remove all people and all text or signs. No borders, gutters, margins, white space, title, caption, or info card.

Submit this exact reference/prompt combination two to four times. Compare the results full size and approve only the clearest coherent three-wall geography.

### Alternate Stage A — exterior-to-interior fresh branch

If the existing interior chain remains spatially unclear, attach the six-panel Video Haven sequence as `@Image 1` and use only its upper-right exterior panel (shot 3):

> Using `@Image 1`, shot 3, show the interior of the same store from a rear corner in one full-frame 16:9 image. Make the complete room geography clear and show at least three walls. Not a panorama and not a grid. Preserve the storefront's time of night and visual identity. No people, no text or signs, no borders, gutters, margins, or white space.

Treat this as a separate reference branch. Do not mix it into the existing interior-derived chain unless it wins the full-size geography and continuity review.

## Stage B — individual coverage from the approved master

Attach `environment-seed.png` as the sole `@Image 1` reference.

`@Image 1` is `VIDEO_HAVEN_CANON`, the definitive architecture, floor plan, lighting, color, materials, and prop-placement reference. Do not redesign, beautify, expand, restage, or re-light the room. Generate one full-frame 16:9 2K live-action photograph of this exact same empty store at the exact same moment, changing only the requested camera position. No people and no text or signs.

Generate and approve these separately:

1. front-desk view;
2. entrance-facing view;
3. rear-corner view;
4. main-aisle view.

### Ready-to-paste individual prompts

Use the same invariant block at the beginning of every prompt:

> Use `@Image 1` as the exact Video Haven environment master. Preserve the room's architecture, dimensions, shelf style, aisle count and placement, counter placement, entrance, windows, doors, inventory category, floor, ceiling, props, lighting, color, and moment exactly. Change only the camera position. Empty fall-2003 video-rental store, no people. Do not add, remove, redesign, restage, expand, beautify, re-light, or modernize anything. No new signs, text, logos, furniture, fixtures, doors, windows, or products. One full-frame 16:9 cinematic-photoreal 2K image; no grid, borders, gutters, margins, labels, or white space.

Append exactly one camera request per generation:

1. **Front desk** — `Camera is behind the checkout counter at clerk eye level, looking diagonally across the counter toward the glass entrance and the front ends of the aisles. Keep the counter attached to the same wall and preserve the seed's sightlines.`
2. **Entrance-facing** — `Camera is just inside the glass entrance at customer eye level, looking into the store toward the checkout counter, wall racks, and rear of the aisles. Preserve the exact reverse geography of the seed.`
3. **Rear corner** — `Camera returns to the approved seed's rear-corner master position and framing. Reproduce the accepted geography master as closely as possible for a clean continuity duplicate.`
4. **Main aisle** — `Camera is centered at one end of the main aisle at customer eye level, looking straight down that same aisle. The counter, glass entrance, adjacent aisles, and wall racks must remain in their seed-consistent directions.`

Submit each camera request two to four times before moving to the next. Approve and download one full-resolution result per camera; do not combine views until all four have passed individually.

After all four full-frame views are approved, a 2x2 reference sheet may be generated or assembled from them. It must be full bleed with no borders, gutters, margins, white space, title, labels, captions, or info card.

## Stage C — exterior storefront from approved seed

Attach the approved Stage A image as `@Image 1`.

Using `@Image 1` as the interior geography and glass-entry reference, create one full-frame 16:9 live-action exterior establishing photograph of the same VIDEO HAVEN storefront in its worn 1980s college-town strip mall at blue hour in fall 2003. The only branded sign is one exterior red-orange tube-neon sign mounted above the entrance, spelling `VIDEO HAVEN` exactly once in crisp uppercase letters. Through the glass, the left-wall counter and front ends of the four aisles align with the approved interior. Wet asphalt catches restrained reflections. No people, cars, duplicate signs, interior neon, white margin, title, or layout. Practical photographed location, 28mm cinema lens, natural grain and halation, not illustration or architectural rendering.

## Acceptance gate

- single seed fills the frame and looks live action;
- exactly four aisles, counter left, front door visible, rear staff door left;
- no interior neon or brand signage;
- orientation sheet derives from the accepted seed and contains no blank canvas;
- exterior sign appears exactly once and only outside;
- no post-2003 technology;
- no people.
