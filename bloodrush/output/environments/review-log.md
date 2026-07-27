# Blood Rush Environment Review Log

## First-pass batch — July 13, 2026

All five master contact sheets and three additional variants completed in the Chrome Nano Banana Pro lane at 16:9, 2K, Unlimited. None is canonical until downloaded and reviewed full size.

| Result | Service state | Local state | Decision |
| --- | --- | --- | --- |
| Video Haven master | complete | downloaded to `video-haven/candidates/contact-sheet-v1-rejected.png` | rejected |
| Video Haven retail-realism variant | complete per user | not yet downloaded | inspect only; cannot auto-promote |
| Video Haven signage-priority variant | complete per user | not yet downloaded | inspect only; cannot auto-promote |
| Campus Bathroom master | complete | not yet downloaded | pending full-size review |
| Campus Bathroom geography-priority variant | complete per user | not yet downloaded | pending full-size review |
| College Quad master | complete | not yet downloaded | pending full-size review |
| Freshman Classroom master | complete | not yet downloaded | pending full-size review |
| Off-Campus House Party master | complete | not yet downloaded | pending full-size review |
| Video Haven character-derived 2x2 grid | complete; inspected full size | not yet downloaded | rejected: Kai appears in only one panel, OPEN signage drifts, and a lounge/couch area is invented |
| Video Haven user round A — character/room 2x2 | complete; inspected full size | `video-haven/candidates/user-round-a-character-room-grid.webp` | useful integration reference only; not an environment master because Kai, NOW OPEN signage, and an invented lounge appear |
| Video Haven user round B — sequence grid | complete; inspected full size | `video-haven/candidates/user-round-b-sequence-grid.webp` | story/grade reference only; not an environment master because it mixes characters, party, exterior, and interior shots |
| Video Haven user round C — empty-store 2x2 | complete; inspected full size | `video-haven/candidates/user-round-c-empty-store-grid.webp` | strongest geography base; use for targeted cleanup, but do not promote until all interior text/signs are removed |
| Video Haven targeted sign-removal edits | two generating plus two queued at 2026-07-13T05:22:44-04:00 | not yet downloaded | compare four results full size; preserve the cool blue fluorescent palette and four camera views while removing people and all text/signs |
| Video Haven blue-relit cleanup samples | complete; inspected in gallery | not yet downloaded | rejected: color-language in the prompt overrode the reference and pushed the room much bluer; future prompts must preserve the reference without restating its grade |
| Video Haven three-wall geography master from sequence shots 5 and 6 | two submissions active by 2026-07-13T05:32:57-04:00 | not yet downloaded | compare as full-frame master candidates; must show at least three walls and readable room geography, not a grid or panorama |
| Video Haven exterior-to-interior fresh branch from sequence shot 3 | user preparing/submitting at 2026-07-13T05:32:57-04:00 | not yet downloaded | keep separate from interior-derived branch until full-size geography review |
| Exterior-first master 01 — empty shelves | complete; reviewed full size | `video-haven/candidates/exterior-first-master-01-empty-shelves-rejected.webp` | rejected: three-wall geometry reads, but nearly all Video Haven inventory and counter identity are lost |
| Exterior-first master 02 — empty shell | complete; reviewed full size | `video-haven/candidates/exterior-first-master-02-empty-shell-rejected.webp` | rejected: readable front wall but not a video store |
| Exterior-first master 03 — convenience store | complete; reviewed full size | `video-haven/candidates/exterior-first-master-03-convenience-store-rejected.webp` | rejected: wrong retail category, excessive convenience-product text, and OPEN sign |
| Exterior-first master 04 — video-store keeper | complete; reviewed full size | `video-haven/candidates/exterior-first-master-04-video-store-keeper.webp` and `.png` | active edit reference: clear entrance, aisles, wall racks, counter, and axis; remove snack racks, soda refrigerators, and convenience-store labels without changing geography |
| Master 04 targeted retail-category correction | four submissions by 2026-07-13T05:51:46-04:00 | not yet downloaded | preserve the keeper exactly; replace only snack/fridge/convenience elements with VHS/DVD rental inventory and period counter props |
| Master 04 correction 01 | complete; reviewed full size | `video-haven/candidates/exterior-first-edit-01-video-store.png` | alternate: coherent three-wall room and clear counter/entrance axis, but period computer clutter and a few concession bags remain |
| Master 04 correction 02 | complete; reviewed full size | `video-haven/candidates/exterior-first-edit-02-video-store.png` | **approved full-frame seed**: same three-wall geography, clean returns counter, video-rental inventory, no people, no store-name or OPEN sign, and no obvious convenience-store fixtures |
| Master 04 correction 03 | complete; reviewed full size | `video-haven/candidates/exterior-first-edit-03-video-store.png` | alternate: geography holds, but the CRT/register cluster and concession bags remain more prominent than correction 02 |
| Master 04 correction 04 | complete; reviewed full size | `video-haven/candidates/exterior-first-edit-04-video-store.png` | rejected: obvious countertop and under-counter concession inventory remains |
| Off-Campus House 3x3 overview with people | complete; inspected full size | `dorm-house-party/candidates/user-house-overview-3x3-with-people.png` | strong whole-house map and shot-number reference; not canonical because people remain in shots 3 and 7 |
| Off-Campus House 3x3 people-removal edit | complete per user | not yet downloaded | strong candidate pending full-size artifact review; derive 2x2 room sheets and full-frame 2K room masters from numbered shots |

## Video Haven rejection

- interior neon is repeated and changes scale and placement;
- excessive unused white canvas makes the layout inefficient;
- overall finish reads as polished concept art rather than a photographed live-action set;
- the sign, not the fixed architecture, becomes the continuity anchor;
- one generation was asked to invent too many independent views at once.

This file is retained only as provenance and must not be attached to continuity video work.

The later character-derived 2x2 grid was also rejected. Its bottom-left empty aisle view is a useful visual direction, but the full grid cannot be an environment master because it mixes a character-containing panel with three different interpretations of the room, changes signage, and invents a lounge area.

The user-round C empty-store grid is the active Video Haven base. Its four panels agree well enough to support a cleanup pass, and its cool blue fluorescent night grade should remain stable. Interior store-name signage is not a continuity anchor: remove every store-name sign, shelf-header logo, OPEN/NOW OPEN sign, and reversed reflection. The single exterior `VIDEO HAVEN` storefront sign will be created as a separate asset.

Prompt wording must not restate the reference grade. The phrase `cool blue fluorescent` produced an unwanted re-lighting pass, so reference-led edits now say to preserve the attached image's lighting and color exactly. A canonical location must begin with one full-frame, rear-corner, three-wall geography master; all desk, entrance, aisle, and back-corner coverage is derived from that accepted master one shot at a time.

The Off-Campus House 3x3 overview is retained as a numbered location map: shots are numbered left-to-right and top-to-bottom. A 3x3 map may guide room selection, but production continuity should use a cleaner 2x2 room sheet or an extracted full-frame 2K room master.

## Replacement workflow

- Shared workflow: `../../docs/nano-banana-reference-workflow.md`
- Video Haven: `video-haven/prompt-v2-reference-workflow.md`
- Campus Bathroom: `campus-bathroom/prompt-v2-reference-workflow.md`
- College Quad: `college-quad/prompt-v2-reference-workflow.md`
- Freshman Classroom: `freshman-classroom/prompt-v2-reference-workflow.md`
- Off-Campus House Party: `dorm-house-party/prompt-v2-reference-workflow.md`

For each location: create one accepted full-frame seed, re-upload it as a named environment reference, derive the orientation views, and promote only a downloaded, full-size, reviewed result.

Video Haven correction 02 is promoted to `video-haven/environment-seed.png`. It is now the sole reference for one-at-a-time derived views; the final multi-view sheet remains pending until those views pass geography review.

## Reference-led extraction batch — July 13, 2026

The Chrome workflow was corrected so every extraction has exactly one visible reference thumbnail and uses the short numbered-shot instruction preferred by the user. Nano Banana Pro, 16:9, 2K, and Unlimited were confirmed before submission.

| Location / view | Local file | Decision |
| --- | --- | --- |
| Off-Campus House living-room master, source shot 2 | `dorm-house-party/house-living-room-master.png` | **approved room master**: full-frame 2752x1536, no people or borders, ordinary worn 2003 student living room with CRT television, fall daylight, period furniture, and coherent single-room perspective |
| Off-Campus House bathroom, source shot 5 | `dorm-house-party/house-bathroom.png` | approved supporting room: full-frame 2752x1536 and visibly continuous with the overview sheet |
| Off-Campus House desk detail, source shot 9 | `dorm-house-party/house-desk-detail.png` | approved supporting insert: full-frame 2752x1536 with corded phone, CD, books, mug, and early-2000s desk props |
| Off-Campus House four-view orientation | `dorm-house-party/house-orientation-sheet.png` | **approved environment sheet**: four related views, 2752x1536, no people, readable living-room/front-door/stair relationship |
| Campus Bathroom master, source shot 1 | `campus-bathroom/campus-bathroom-shot-01.png` | **approved room master**: full-frame 2752x1536, empty institutional bathroom, sinks/mirror/stalls and center tiled bench preserved |
| Campus Bathroom reverse, source shot 3 | `campus-bathroom/campus-bathroom-shot-03.png` | approved reverse: full-frame 2752x1536, same materials, fixtures, and stall/sink relationship |
| College Quad master and reverse | service jobs active | submitted from the prior approved sheet using `Extract shot 1 from Image 1.` and `Extract shot 3 from Image 1.` |
| Freshman Classroom master and reverse | service jobs active | submitted from the prior approved sheet using `Extract shot 1 from Image 1.` and `Extract shot 3 from Image 1.` |

## Campus visual-direction reset — July 13, 2026

The campus canon is now a well-funded coastal California private Catholic college. The previous campus-bathroom and freshman-classroom extractions are superseded as visual-direction references even where their basic geography remains useful.

| Existing asset | Revised decision |
| --- | --- |
| `campus-bathroom/campus-bathroom-shot-01.png` | **superseded**: graffiti, broken mirror, stained ceiling, dirty grout, and vandalized stalls make the school look neglected; retain only as loose fixture-count/geography evidence |
| `campus-bathroom/campus-bathroom-shot-03.png` | **superseded** under the same campus reset; do not use as a final aesthetic or material reference |
| `freshman-classroom/freshman-classroom-shot-03.png` | **superseded**: reads too strongly as a municipal high-school classroom; retain only as loose 2003 technology reference |
| existing college-quad service outputs | must be re-reviewed against the private Catholic college canon before promotion; reject state-campus/brutalist/high-school readings |
| `dorm-house-party/house-living-room-master.png` | geography remains useful; future polish should remove dumpy or nicotine-stained cues while preserving ordinary 2003 student-rental character |
| `video-haven/environment-seed.png` | remains approved; off-campus retail wear is intentional and does not define the college |

All replacement seeds use the active V2 workflows and `../../docs/location-visual-canon.md`: full-frame 16:9 2K, protected for a 2.39:1 crop, restrained 40mm anamorphic character, no fake letterbox bars, and practical-location photorealism.

### Private-college anamorphic replacement results

All four selected masters were generated in the Codex in-app Higgsfield browser with Nano Banana Pro, 16:9, 2K, Unlimited, one image per prompt, then downloaded from the original CloudFront PNG rather than a scaled preview.

| Location | Local select | Decision |
| --- | --- | --- |
| College quad | `college-quad/environment-seed.png` | **approved canonical seed**: 2752×1536, Spanish Colonial Revival arcade, maintained private Catholic college, chapel tower, clean adult-campus scale, period pay phone and bicycles, practical-location photorealism |
| Freshman seminar room | `freshman-classroom/environment-seed.png` | **approved canonical seed**: 2752×1536, U-shaped oak seminar tables, adult chairs, period teaching technology, tall windows, restrained crucifix, no high-school desk rows |
| Campus bathroom | `campus-bathroom/environment-seed.png` | **approved canonical seed**: 2752×1536, clean intact mirror, two basins, maintained tile and ceiling, blue-gray stalls, dark oak, no vandalism or grime |
| Off-campus party house | `dorm-house-party/environment-seed.png` | **approved direction and geography seed**: 2752×1536, clean safe 2003 student rental, intact furniture, readable stairs/fireplace/kitchen axis; simplify the duplicated beige computer towers in a later targeted edit |
