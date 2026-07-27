# Blood Rush — Chrome Nano Banana Operator Handoff

## Mission

Use the already-open Chrome Higgsfield Image tab and its signed-in Nano Banana Pro account to finish production-ready environment references while the native-browser Seedance audition queue runs separately.

Do not open a new Chrome profile, sign out, switch accounts, close the existing Higgsfield tab, or touch the native in-app video browser.

## Locked settings

- Model: Nano Banana Pro
- Quality: 2K
- Aspect ratio: 16:9
- Mode: Unlimited
- Outputs per submission: one unless a deliberate comparison needs more
- Maximum active image jobs: five

## Continuity rule

Nano Banana is being used as an image-editing and reference-continuity model. Reference accepted images directly instead of redescribing their lighting, color, layout, or mood. Descriptive restyling terms can cause visual drift.

Every derived view must preserve the accepted reference's architecture, fixtures, materials, inventory, lighting, color, and period details. Change only the requested camera view or explicitly named correction.

## Video Haven source of truth

Use only:

`bloodrush/output/environments/video-haven/environment-seed.png`

The approved seed already establishes:

- one coherent 2003 video-rental store
- centered glass entrance on the front wall
- wall-mounted VHS/DVD inventory
- center rental aisles
- a returns/check-out counter
- cool ordinary fluorescent retail lighting
- readable three-wall geography

Do not use rejected contact sheets as continuity anchors.

## Required Video Haven views

Generate each view separately from the approved seed:

1. Front-desk view
2. Entrance-facing view that defines the remaining wall
3. Rear-corner view
4. Main-aisle view

For each view, create two to four variants when useful, inspect them full-size, and keep only variants that clearly belong to the same physical store.

## Base edit language

Use `@Image 1` exactly as the location reference. Preserve the same store architecture, entrance, counter, walls, ceiling, fluorescent fixtures, shelves, rental inventory, flooring, proportions, lighting, color, and 2003 period realism. Change only the camera position to the requested view. Show one wide realtor-style composition that clearly relates at least three walls and the major fixtures. No people. No interior store-name sign, OPEN sign, neon, logos, snack racks, soda refrigerators, convenience-store products, modern devices, labels, borders, gutters, or blank white space. Cinematic photorealism, 16:9, full-frame image.

## View prompts

### Front desk

From `@Image 1`, move the camera behind and slightly to one side of the existing returns/check-out counter, looking across the same store toward the entrance and main aisles. Preserve everything else exactly.

### Entrance-facing / missing wall

From `@Image 1`, place the camera deep inside the same store and look toward the centered glass entrance so the front wall, counter relationship, and aisle orientation are unambiguous. Preserve everything else exactly.

### Rear corner

From `@Image 1`, place the camera in the rear corner and show the same store's entrance, counter, wall racks, and center aisles in one wide composition. Preserve everything else exactly.

### Main aisle

From `@Image 1`, place the camera at adult eye level inside the main rental aisle, with the existing counter and entrance still visible enough to confirm geography. Preserve everything else exactly.

## Correction language

When a candidate is close, select that candidate as the sole reference and request only the needed edit. Examples:

- Remove every person while leaving the entire location unchanged.
- Remove the interior sign and do not replace it with any text, logo, neon, or blank panel.
- Replace convenience-store goods with period VHS and DVD rental inventory matching the existing shelves.
- Keep the composition unchanged; correct only the reversed or misspelled exterior sign.
- Remove all borders, gutters, labels, and white space; keep the four images unchanged.

## Final sheet

After four matching views pass, assemble a 2x2 16:9 environment sheet from those accepted images. Use no borders, gutters, labels, captions, or white space. The four panels must read as one internally consistent store, not four interpretations.

Save the approved full-resolution result as:

`bloodrush/output/environments/video-haven/environment-sheet.png`

Record candidates and decisions in:

`bloodrush/output/environments/review-log.md`

## Stop conditions

Reject and do not propagate an image if it contains people, inconsistent room geography, modern retail technology, convenience-store inventory, extra text/signage, non-photorealistic rendering, large blank areas, borders, or a camera view that cannot be reconciled with the approved seed.
