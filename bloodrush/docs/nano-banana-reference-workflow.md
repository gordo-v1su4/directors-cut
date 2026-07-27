# Blood Rush Nano Banana Reference Workflow

This workflow replaces the rejected one-pass contact-sheet method. Nano Banana is treated primarily as an image-editing model: references establish the visual truth, and prompts request the smallest useful change. A single prompt should not invent a hero view, reverse angles, continuity details, signage, and a finished layout at the same time. Blood Rush environments are built as an image-to-image ladder.

## Why this workflow

Google's current Gemini Image guidance recommends detailed photographic direction, iterative refinement, and reusing previously generated images for new angles. It also recommends clear reference images with distinct names, and explicitly supports using one reference to create a multi-image story.

- Prompt guide: <https://deepmind.google/models/gemini-image/prompt-guide/>
- Gemini image-generation guide: <https://ai.google.dev/gemini-api/docs/generate-content/image-generation>
- Nano Banana consistency and iterative editing: <https://blog.google/products-and-platforms/products/gemini/nano-banana-tips/>
- Nano Banana Pro reference and multi-image capabilities: <https://deepmind.google/models/gemini-image/pro/>

## Reference ladder

### 1. Reference roles

Use named references with one job each:

- `@Image 1` controls the actual Blood Rush location design, lighting, color, materials, period, and props.
- Optional `@Image 2` controls composition only, such as a real-estate photograph taken from a rear corner that clearly shows three walls.

Never describe a color or lighting effect that is already visible in `@Image 1`; unnecessary prose can re-light or redesign the reference. When using a composition reference, explicitly say not to copy its decor, materials, color, or architecture.

### 2. Canonical geography master

Generate one full-frame, live-action cinematic photograph of the empty location. The camera should behave like a careful real-estate photographer standing well back in a corner: one wide 16:9 frame should show at least three walls and make doors, counters, furniture, aisles, and room connections immediately legible. This is not a stitched panorama. Do not request a grid, info card, labels, borders, or multiple angles. Solve geography first.

The seed must:

- fill the entire 16:9 frame;
- look like a real photographed physical set, not concept art;
- establish at least three walls, the fixed floor plan, and the camera axis;
- contain no people;
- contain no text or signage unless it is unavoidable and already approved;
- pass the location-specific continuity checklist.

If an exterior already establishes the storefront more clearly than the existing interiors, use it as a fresh reference branch: identify the exact numbered exterior panel and ask for one interior of the same store. This can break an unhelpful inherited interior layout. The resulting interior still must pass the three-wall geography gate before promotion.

### 3. Derive coverage one shot at a time

Upload the accepted master as `@Image 1` and name it, for example `VIDEO_HAVEN_CANON`. Request one new full-frame 2K view at a time: front desk, entrance, back corner, aisle, mirror wall, or other story position. This is an edit or reframing of the accepted room, not a new room generation.

If a broader 3x3 sheet is useful, treat it only as a numbered location map. Number panels left-to-right and top-to-bottom. Extract an approved panel into its own full-frame 2K master before using it for character or video continuity.

After four individual views are approved, they may be assembled or requested as a full-bleed 2x2 reference sheet. Use no borders, gutters, margins, white space, title, captions, or info card. The four views must already derive from the same master; never ask the model to invent four unrelated views at once.

### 4. Targeted correction

If one architectural element is wrong, feed the accepted seed or orientation sheet back and change only that element. Do not regenerate the entire design while fixing one detail.

### 5. Character-plus-location shot sequence

Upload exactly two approved references:

- `@Image 1` = named character identity and wardrobe lock;
- `@Image 2` = named environment and geography lock.

Ask for a full-bleed 3x3 photographic shot sequence. Each cell is a different beat and camera setup inside the same room. The character must not duplicate within a cell. Architecture, prop placement, costume, apparent age, and lighting direction remain fixed.

### 6. Promote only approved references

Only an accepted seed, orientation sheet, character sheet, or reviewed audition can become a downstream reference. Rejected contact sheets remain in `candidates/` with rejection notes and must not be used as continuity anchors.

## Photoreal contract

Every prompt must positively request:

- a live-action production still photographed on a practical set;
- physically plausible materials, wear, exposure, reflections, and shadows;
- natural 24mm, 28mm, 35mm, or 50mm cinema-lens perspective as specified;
- restrained film grain and practical-light halation;
- era-correct 2003 production design;
- full-frame composition with no unused layout space.

Every prompt must reject:

- illustration, concept art, painterly rendering, matte painting, 3D visualization, architectural rendering, game art, or synthetic showroom polish;
- white margins, blank canvas, info cards, captions, poster layouts, or decorative borders unless a deliverable explicitly requires them;
- unstable architecture, duplicated objects, impossible reflections, or changed prop positions;
- post-2003 technology or styling.

## Signage rule

`VIDEO HAVEN` is exterior storefront signage only. It may appear above the exterior entrance in the dedicated exterior photograph. There is no neon logo or duplicate brand sign inside the store. Interior orientation views prioritize architecture, shelves, counter, doors, and period props.

## Batch and review rule

Use the Chrome image account only. Keep Nano Banana Pro, 16:9, 2K, and Unlimited visible. Five to eight active jobs are acceptable when the service permits it. For a promising edit, submit two to four generations with the same reference and prompt before rewriting it. Change only one instruction at a time. If repeated edits keep inheriting unwanted structure, start a fresh reference chain from the best accepted image. Open every result at full size, download it, inspect it locally, and record a pass or rejection before promoting it.

## File naming

- Canonical seed: `environment-seed.png`
- Orientation sheet: `environment-orientation-2x2.png`
- Exterior storefront: `environment-exterior.png`
- Rejected result: `candidates/<descriptive-name>-rejected.png`
- Character/location sequence: `shot-sequence-3x3.png`
