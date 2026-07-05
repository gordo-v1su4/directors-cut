---
name: visual-storyline-pipeline
description: "Use when creating visual stories from scratch: storyline → script → character sheets → place backgrounds → scene keyframes with multi-shot cameras. Full pipeline from narrative to consistent AI-generated visual assets using Flux2-Klein ReferenceLatent for character/environment compositing across scenes."
version: 1.1.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [visual-storytelling, character-design, scene-design, keyframe, storyboard, comfyui, ref2img, img2img, scriptwriting, worldbuilding]
    related_skills: [comfyui, claude-design]
---

# Visual Storyline Pipeline

A multi-step pipeline that takes a story concept from narrative text all the way
to consistent, camera-specific keyframe images. Designed for agents, harnesses,
and human creators who want a repeatable workflow for visual story production.

The core principle: **generate character/place reference images ONCE with high
quality, then use Reference2Image (img2img) to create every scene shot from those
references — ensuring style and character consistency across the entire story.**

## When to Use

- User wants to create a visual story, comic, animation storyboard, or film pre-viz
- User has a story idea and wants consistent character art across multiple scenes
- User needs multi-shot camera breakdowns of scenes with consistent style
- User wants to go from "story concept" to "keyframe image gallery"
- User asks for storyboard creation, scene breakdown, or character sheet design

**Do NOT use for:**
- Single standalone images (use comfyui skill directly)
- Video editing or post-production
- Pure text scripts without visual output
- 3D modeling or CAD work

**Do NOT use outdated techniques:**
- ~~img2img~~ — inconsistent character identity across shots
- ~~IP-Adapter~~ — old architecture, poor multi-reference support
- ~~ControlNet alone~~ — structural control only, no identity preservation

Use **Flux2-Klein ReferenceLatent** (local) or **Kling AI Elements** (cloud) instead.

---

## Pipeline Overview

```
PHASE 1: NARRATIVE          PHASE 2: VISUAL DESIGN        PHASE 3: SCENE PRODUCTION
─────────────────────       ──────────────────────        ─────────────────────────
1.1 Storyline               2.1 Character Sheets          3.1 Scene Breakdown
1.2 Character List          2.2 Place/Background Refs     3.2 Keyframe Generation
1.3 Script & Dialogs        2.3 Style Guide               3.3 Multi-Shot Cameras
1.4 Scene Beat Sheet                                3.4 Final Keyframe Gallery
```

Each phase produces deliverables that feed the next. Never skip ahead —
consistency comes from building the reference library before scene production.

---

## PHASE 1: NARRATIVE FOUNDATION

### 1.1 Storyline

Create a structured storyline document:

```yaml
storyline:
  title: "Story Title"
  genre: "genre + subgenre"
  tone: "visual tone (e.g., noir, whimsical, epic)"
  setting:
    era: "time period"
    world: "world type (modern, fantasy, sci-fi, etc.)"
    visual_influences: ["reference film/anime/art", "..."]
  synopsis: "2-3 paragraph summary"
  theme: "core theme or message"
  visual_style: "overall art direction (e.g., cyberpunk anime, watercolor fairy tale)"
```

**Output:** `storyline.md`

### 1.2 Character List

For each character, create a structured profile:

```yaml
character:
  name: "Character Name"
  role: "protagonist / antagonist / supporting / background"
  age_appearance: "how old they LOOK"
  ethnicity: "ethnic background"
  body_type: "build description"
  height: "tall / average / short"
  hair:
    color: "specific color"
    style: "cut and styling"
    length: "length description"
  eyes:
    color: "specific color"
    shape: "shape descriptor"
  skin_tone: "specific tone"
  distinctive_features: ["scar on left cheek", "tattoo on right hand", "..."]
  default_clothing:
    top: "description"
    bottom: "description"
    footwear: "description"
    accessories: ["glasses", "necklace", "..."]
  alternate_outfits:
    - name: "Outfit Name"
      description: "full outfit description"
  personality_visual: "how personality shows in appearance/posture"
  reference_prompt: "full Stable Diffusion / ZIT prompt for this character"
```

**Output:** `characters/character_name.yaml` (one file per character)

### 1.3 Script & Dialogs

Break the story into scenes with dialog:

```yaml
scene:
  id: "S01"
  title: "Scene Title"
  location: "place_name"
  time_of_day: "morning / afternoon / evening / night"
  weather: "clear / rain / fog / snow"
  characters_present: ["character_name_1", "character_name_2"]
  mood: "emotional tone"
  description: "what happens in this scene"
  dialog:
    - speaker: "character_name"
      line: "dialog text"
      action: "(optional) what they're doing while speaking"
  visual_notes: "important visual details for this scene"
  camera_notes: "suggested camera angles"
```

**Output:** `script/scene_XX.yaml` (one file per scene)

### 1.4 Scene Beat Sheet

A summary table linking scenes to characters and places:

```yaml
beat_sheet:
  - scene_id: "S01"
    title: "Opening"
    location: "coffee_shop"
    characters: ["alice", "bob"]
    key_action: "Alice discovers the letter"
    camera_count: 3
    mood: "mysterious"
  - scene_id: "S02"
    ...
```

**Output:** `beat_sheet.yaml`

---

## PHASE 2: VISUAL DESIGN (Reference Library)

This phase creates the visual reference images that ensure consistency
throughout the entire story. These are your "ground truth" images.

**Key Principle (from Kling AI):** Reference images are not just inspiration —
they are **anchored identity sources**. The model extracts facial features,
body types, style, and composition from your references and preserves them
across all generated shots. Use `@element_N` / `@image_N` placeholders in
prompts to bind references to specific slots.

### 2.1 Element Registration (Kling-style Character Management)

Before generating, register each character as a reusable **Element**.
Elements are persistent identity objects that the model remembers.

**Element Registration (Kling API):**
```bash
# Create character element
node kling.mjs element --action create \
  --name "Alice" \
  --description "Young woman, red hair ponytail, green eyes, white blouse" \
  --ref_type image_refer \
  --frontal_image ./references/characters/alice_front.png

# Query creation status
node kling.mjs element --action query --task_id <id>

# List all registered elements
node kling.mjs element --action list
```

**Element Properties:**
- `name`: Human-readable character name (max 20 chars)
- `description`: Visual summary (max 100 chars)
- `ref_type`: `image_refer` (from photos) or `video_refer` (from video)
- `frontal_image`: Clear front-facing photo (REQUIRED for image_refer)
- `refer_images`: Additional angles (1-3 optional)

**Output:** Element IDs saved in `characters/character_name.yaml` as:
```yaml
element_id: "u_123456789012345"  # Kling element ID
```

### 2.2 Character Sheet Images

Generate character reference sheets. Each character gets a **multi-angle reference sheet** showing all views in a single image.

**Multi-Angle Sheet Format (required):**
Each character sheet MUST include 4 views in one image on white background:
1. **Front view** — full body, facing camera
2. **Side view** — full body, profile
3. **Back view** — full body, from behind
4. **Close-up headshot** — face portrait

**Character Sheet Prompt Structure (ZIT):**
```
Character reference sheet, multiple views on white background: 
front view full body, side view full body, back view full body, and close-up headshot portrait. 
[character_description from YAML],
art deco surrealism style, clean white background, high detail, sharp focus, 
professional character design sheet
```

**Resolution:** 1280x720 (landscape, wide enough for 4 views side by side)

**Character Sheet Prompt Structure (Kling Omni):**
```
Character @element_1, full body portrait, front view, neutral pose,
white background, character reference sheet,
high detail, [visual_style from storyline]
```

**Generation Settings (ZIT):**
- Steps: 12, CFG: 1, Sampler: res_multistep
- Resolution: 1280x720 (landscape) or 720x1280 (portrait for full body)
- Use the character's style LoRA if available
- Save as: `references/characters/character_name_sheet.png`

**Generation Settings (Kling Omni):**
```bash
node kling.mjs image \
  --prompt "Character @element_1, full body portrait, front view, neutral pose, white background, high detail" \
  --element_ids <element_id> \
  --resolution 2k \
  --aspect_ratio 9:16 \
  --output_dir ./references/characters
```

**Quality Gate:** Before proceeding, verify:
- [ ] Character matches the YAML description
- [ ] Distinctive features are visible
- [ ] Clothing matches default outfit
- [ ] Art style matches the storyline's visual_style
- [ ] Image is high resolution and sharp

### 2.3 Place/Background Reference Images

Generate background plates for each location in the story.

**Place Prompt Structure (ZIT):**
```
[place_description],
[time_of_day] lighting, [weather] weather,
[era] setting, [world_type] architecture,
environmental details: [specific details],
establishing shot, wide angle,
no people, background plate,
high detail, [visual_style from storyline]
```

**Place Prompt Structure (Kling Omni):**
```
[place_description], [time_of_day] lighting, [weather] weather,
establishing shot, wide angle, no people, background plate,
high detail, @image_1 style reference
```

**Generation Settings (ZIT):**
- Steps: 12, CFG: 1, Sampler: res_multistep
- Resolution: 1280x720 (landscape for environments)
- Save as: `references/places/place_name.png`

**Generation Settings (Kling Omni):**
```bash
node kling.mjs image \
  --prompt "Cozy coffee shop interior, morning light, no people, background plate, high detail" \
  --resolution 2k \
  --aspect_ratio 16:9 \
  --output_dir ./references/places
```

**Quality Gate:** Before proceeding, verify:
- [ ] Place matches the YAML description
- [ ] Lighting matches the time_of_day
- [ ] Architectural style matches the world type
- [ ] Empty of characters (background plate)
- [ ] Consistent art style with character sheets

### 2.4 Style Guide

A quick-reference document linking all references:

```yaml
style_guide:
  visual_style: "cyberpunk anime"
  art_direction: "neon-lit, high contrast, detailed"
  color_palette:
    primary: "#FF3366"
    secondary: "#00CCFF"
    accent: "#FFCC00"
    background: "#1A1A2E"
  lighting: "dramatic, neon rim lighting"
  line_weight: "medium-bold outlines"
  references:
    characters:
      - name: "alice"
        file: "references/characters/alice_sheet.png"
        element_id: "u_123456789012345"
      - name: "bob"
        file: "references/characters/bob_sheet.png"
        element_id: "u_987654321098765"
    places:
      - name: "coffee_shop"
        file: "references/places/coffee_shop.png"
        image_slot: 1
```

**Output:** `style_guide.yaml`

---

## PHASE 3: SCENE PRODUCTION (Keyframe Generation)

This is where the Reference2Image method shines. For each scene shot, you
combine the character reference + place reference + camera angle into a
single consistent keyframe.

### 3.1 Scene Breakdown

For each scene from the script, break it into individual SHOTS with camera angles:

```yaml
shot:
  scene_id: "S01"
  shot_id: "S01_01"
  camera:
    angle: "eye_level / low_angle / high_angle / dutch_angle / bird_eye / worm_eye"
    position: "front / side / back / three_quarter / over_shoulder"
    distance: "extreme_close_up / close_up / medium_close_up / medium / medium_long / long / extreme_long"
    movement: "static / pan_left / pan_right / tilt_up / tilt_down / dolly_in / dolly_out"
  characters_in_shot:
    - name: "alice"
      position: "left third"
      action: "reading letter"
      expression: "surprised"
  environment:
    place: "coffee_shop"
    area: "counter near window"
    props: ["coffee cup", "letter", "newspaper"]
  lighting: "warm morning light through window"
  mood: "quiet tension"
  duration: "3 seconds"
  shot_prompt: "full generated prompt for this shot"
```

**Output:** `shots/scene_XX_shot_YY.yaml`

### 3.2 Keyframe Generation (Reference2Image Method)

**Three workflows for different composition needs:**

---

#### Workflow A: Flux2-Klein + ZIT — 2 References (1 Character + 1 Background)

**File:** `ComfyUI Workflows/Flux2_klein-ZIT-2 Refs API.json`

| Stage | Model | Purpose |
|-------|-------|---------|
| Flux2-Klein | flux-2-klein-9b + qwen_3_8b | Compose character into environment |
| ZIT | z_image_turbo_bf16 + qwen_3_4b | Upscale + detail at denoise 0.35 |

**Reference Chain:**
```
Image 1 (character) → ReferenceLatent → conditioning ─┐
                                                        ├─ Flux2-Klein → composited
Image 2 (environment) → ReferenceLatent → conditioning ─┘
```

**Prompt Syntax:**
```
(image 1) the character is [ACTION] in (image 2) [ENVIRONMENT]. [CAMERA SHOT TYPE]
```

**Settings:**
- Flux2-Klein: 8 steps, cfg 1, res_2s sampler, Flux2Scheduler
- ZIT: 8 steps, cfg 1, res_multistep, denoise 0.35, shift 3
- LoRAs: lenovo_flux_klein9b (0.8) → lenovo_z (0.7) + z_skin_detail (-1)

---

#### Workflow B: Flux2-Klein + ZIT — 3 References (1 Background + 2 Characters)

**File:** `ComfyUI Workflows/Flux2Klein _ ZIT - 1BG 2 Character Refs2Img 20260521 (API).json`

**For dialog scenes, confrontations, group shots.**

| Stage | Model | Purpose |
|-------|-------|---------|
| Flux2-Klein | flux-2-klein-9b + qwen_3_8b | Compose 2 characters into environment |
| ZIT | z_image_turbo_bf16 + qwen_3_4b | Upscale + detail at denoise 0.35 |
| RTX Super Resolution | RTX VSR | Final 1.5x upscale |

**Reference Chain (3 ReferenceLatent nodes):**
```
Background → ReferenceLatent → conditioning ─┐
                                              ├─ RefLatent (char A) ─┐
                                                                      ├─ Flux2-Klein → composited
Character A → ReferenceLatent → conditioning ─┘                      ┘
                                              ┌─ RefLatent (char B) ─┐
Character B → ReferenceLatent → conditioning ─┘                      ┘
```

**Prompt Syntax:**
```
(image 1) the character is [ACTION] in (image 2) [ENVIRONMENT]. [CAMERA SHOT TYPE]
```
(Note: (image 1) = background, (image 2) = character A, character B is the third reference)

**Settings:**
- Flux2-Klein: 8 steps, cfg 1, res_2s, Flux2Scheduler
- ZIT: 8 steps, cfg 1, res_multistep, denoise 0.35, shift 3
- Reserved VRAM: 2GB per stage
- Final upscale: RTX VSR 1.5x

---

#### Workflow C: LTX2.3 PromptRelay — Image to Video

**File:** `ComfyUI Workflows/LTX2.3_PromptRelay_VLM Img2Video 20260521 (API).json`

**Converts keyframes into animated video shots with camera motion.**

| Component | Model | Purpose |
|-----------|-------|---------|
| VLM | Qwen3-VL-4B-Instruct-FP8 | Analyzes image, generates motion prompt |
| Video Gen | LTX 2.3 22B + LoRAs | Generates video from keyframe + prompt |
| Audio | LTX Audio VAE | Generates ambient sound |

**Pipeline:**
```
Keyframe → Qwen3-VL (analyze) → PromptRelay (motion prompt) → LTX 2.3 → Video
```

**Settings:**
- Duration: 10 seconds @ 24 FPS = 240 frames
- Sampler: euler_ancestral
- Scheduler: linear_quadratic, 8 steps
- CFG: 1
- LoRAs: ltx-2.3-distilled (0.4) → Crisp_Enhance (0.85) → Licon-VBVR-I2V (1.0)
- Output: H.264 MP4, CRF 19

**⚠️ API Limitation:** This workflow uses `LTX2SamplingPreviewOverride` which requires the ComfyUI server context. Run from the web UI, NOT via API. The Flux2-Klein workflows work fine via API.

**Speech/Dialog in Video Prompts:**
Include character speech directly in the motion prompt using quotation marks.
The VLM (Qwen3-VL) understands dialog and generates lip-sync-appropriate motion.

```
"Maya says 'Where am I?' with a confused expression, then slowly sits up in bed."
"The Concierge smiles and says 'Welcome to Hotel Liminal' while sliding a map across the counter."
"Elena whispers 'Don't go to the garden' and glances nervously down the hallway."
```

**Speech Prompt Rules:**
1. Use exact quotation marks for spoken lines
2. Include the speaker name before the quote
3. Add facial expression/body language after the quote
4. Keep speech lines short (under 15 words for best lip-sync)
5. Mix speech with action — don't just have characters standing and talking
6. For silent shots, omit speech and focus on physical motion

**Motion Prompt Template (with dialog):**
```
[Character name] [action/expression] and says "[dialog line]" [continuing action].
[Camera movement]. [Atmosphere/lighting note].
```

**Examples:**
```
Maya opens her eyes with a confused expression and says "Where am I?" She slowly looks around the dim room. Camera holds steady in medium close-up.
```
```
The Concierge slides a map across the brass counter with deliberate precision and says "Welcome to your stay." His smile is too wide. Camera follows the map in close-up.
```
```
Elena grabs Maya's arm urgently and whispers "The garden is not what it seems." She glances down the hallway. Camera pushes in on their faces in a tight two-shot.
```

**Multi-Shot Prompting:**
The PromptRelay node generates 4-shot sequences from a single keyframe:
```
Shot 1: [action + speech + camera motion] |
Shot 2: [action + speech + camera motion] |
Shot 3: [action + speech + camera motion] |
Shot 4: [action + speech + camera motion]
```

---

### 3.3 Complete Pipeline Flow

```
Phase 2: ZIT              Phase 3a: Flux2-Klein + ZIT        Phase 3b: LTX2.3
─────────────             ──────────────────────────         ─────────────────
Character refs ──┐        Keyframe (character + env) ──┐     Keyframe ──┐
                  ├─►      compositing via              ├─►    video    ├─► Video shot
Place refs ──────┘        ReferenceLatent               └─►    gen     └─► with motion
```

**Full generation order:**
1. Generate 4+ reference images via ZIT (characters + places)
2. Generate keyframes via Flux2-Klein + ZIT (Workflow A or B)
3. Export `video_prompts.md` in each scene folder
4. Convert keyframes to video via LTX2.3 (Workflow C)

### 3.4 API Submission Notes

**What works via ComfyUI API:**
- ZIT reference generation ✅
- Flux2-Klein + ZIT 2-ref workflow ✅
- Flux2-Klein + ZIT 3-ref workflow ✅ (but SaveImageExtended output may not appear in history — check filesystem directly)
- LTX2.3 video ✅ (only if LTX2SamplingPreviewOverride node is removed)

**SaveImageExtended output quirk:** When using the 3-ref workflow (1BG 2 Character), the SaveImageExtended node (193) may not return output in the API history. The file IS saved to disk — search the output directory for the filename prefix.

**LTX2.3 API fix:** The original LTX2.3 workflow uses `LTX2SamplingPreviewOverride` which crashes via API (`'NoneType' object has no attribute 'encode'`). Remove this node and connect the model directly to SamplerCustom for API submission.

### 3.5 Workflow Files

Stored in `references/` folder:
- `flux2_klein_zit_2refs_workflow.json` — 1 character + 1 background
- `flux2_klein_zit_1bg_2char_workflow.json` — 1 background + 2 characters
- `ltx23_img2video_workflow.json` — LTX2.3 PromptRelay image-to-video

---

#### Approach B: Kling AI API (Element + Image References)

**Cloud generation with persistent character elements.**

Use Kling's Omni model with `@element_N` and `@image_N` placeholders.

**Reference Slot System (Kling):**
| Slot Type | Syntax | Purpose |
|-----------|--------|---------|
| Element | `@element_1`, `@element_2` | Saved character/subject identity |
| Image | `@image_1`, `@image_2` | Style, composition, or background reference |
| Video | `@video_1` | Motion reference (video only) |

**Max slots:** 10 total (elements + images combined)

**Method B1: Single Character in Environment**
```bash
node kling.mjs image \
  --prompt "Character @element_1 sitting at a table in @image_1, morning light, medium shot, eye level angle" \
  --element_ids <alice_element_id> \
  --image <coffee_shop_reference.png> \
  --resolution 2k \
  --aspect_ratio 16:9 \
  --output_dir ./shots/S01
```

**Method B2: Multi-Character Scene**
```bash
node kling.mjs image \
  --prompt "Character @element_1 and Character @element_2 in @image_1, dialog scene, over-the-shoulder shot" \
  --element_ids <alice_id>,<bob_id> \
  --image <coffee_shop_reference.png> \
  --resolution 2k \
  --aspect_ratio 16:9 \
  --output_dir ./shots/S01
```

**Method B3: Story Mode (Coherent Multi-Shot)**
Generate multiple coherent shots from a single reference:
```bash
node kling.mjs image \
  --prompt "Character @element_1 in @image_1: arriving at the shop, ordering coffee, discovering the letter, reading with surprise, confronting the stranger" \
  --element_ids <alice_id> \
  --image <coffee_shop_reference.png> \
  --resolution 2k \
  --imageCount 5 \
  --story_mode true \
  --output_dir ./shots/S01
```

**Method B4: Style Reference Transfer**
Use a style reference to match a specific art direction:
```bash
node kling.mjs image \
  --prompt "Character @element_1 walking through @image_1, cyberpunk anime style, neon lighting" \
  --element_ids <alice_id> \
  --image <cyberpunk_style_reference.png> \
  --resolution 2k \
  --output_dir ./shots/S01
```

**Kling Omni Prompt Rules:**
1. Always start with character/subject description via `@element_N`
2. Place environment references via `@image_N` after the action
3. Add camera/shot type AFTER the reference placeholders
4. End with style/mood keywords
5. Keep prompts under 2000 chars (Omni limit)

### 3.3 Shot Prompt Construction

Every shot prompt follows this template:

```
[character description from reference],
[action/expression from shot yaml],
[camera distance] shot,
[camera angle] angle,
[camera position] view,
[environment/place description],
[time_of_day] lighting,
[mood] atmosphere,
[props description],
[visual_style from style_guide],
high detail, sharp focus, cinematic composition
```

**Example:**
```
Alice, young woman with red hair in a ponytail, green eyes, wearing white blouse and dark jeans,
reading a letter with a surprised expression,
medium close-up shot,
eye_level angle,
three_quarter view,
inside a cozy coffee shop with warm wood interior and large windows,
morning light streaming through windows,
quiet tension atmosphere,
coffee cup and newspaper on counter,
cyberpunk anime style,
high detail, sharp focus, cinematic composition
```

### 3.4 Multi-Shot Camera Vocabulary

Standard camera setups for each scene type:

| Shot Type | When to Use | Camera Notes |
|-----------|-------------|--------------|
| **Establishing** | Scene opener | Extreme long, bird's eye or wide. Shows full location. |
| **Master** | Main action area | Long or medium long. Shows all characters in space. |
| **OTS (Over Shoulder)** | Dialog | Medium. Camera behind one character, focused on other. |
| **Close-Up (CU)** | Emotion/reaction | Face fills frame. Eyes visible. |
| **ECU (Extreme Close-Up)** | Detail/object | Eyes, hands, letter, phone. Very tight. |
| **Two-Shot** | Two characters together | Medium. Both in frame, side by side or facing. |
| **POV** | Character's perspective | What they see. First person. |
| **Insert** | Object detail | Cutaway to prop or detail. |
| **Tracking** | Movement | Camera follows character. Note direction. |
| **Dutch Angle** | Tension/unrest | Camera tilted 15-30 degrees. Uneasy feeling. |

### 3.5 Video Prompt Documentation

**After generating videos, ALWAYS export motion prompts as `video_prompts.md` in each scene folder.** This lets the user review and iterate on prompts without digging through code.

**File format per scene:**
```markdown
# Scene XX — Title (Location)

## SXX-YY
**Duration:** 10s @ 24fps
**Keyframe:** SXX-YY.png
**Video:** SXX-YY_video.mp4
**Prompt:** [full motion prompt text]

## SXX-YY
...
```

**Output path:** `shots/scene_XX/video_prompts.md`

### 3.6 Final Keyframe Gallery

Collect all generated keyframes into an ordered gallery:

```
outputs/storyline/
├── storyline.md
├── characters/
│   ├── alice_sheet.png
│   └── bob_sheet.png
├── places/
│   ├── coffee_shop.png
│   └── office.png
├── shots/
│   ├── S01_01_establishing.png
│   ├── S01_02_master.png
│   ├── S01_03_cu_alice.png
│   ├── S01_04_ots_bob.png
│   └── ...
└── gallery.md        ← ordered list with shot descriptions
```

---

## Complete Workflow Example

```
1. User says: "Create a visual story about a detective investigating
   a mysterious disappearance in a cyberpunk city"

2. Agent creates storyline.md (genre: cyberpunk noir, tone: dark rainy)

3. Agent creates characters:
   - detective.yaml (middle-aged man, trench coat, scar)
   - suspect.yaml (young woman, neon hair, hacker)
   - victim.yaml (missing person, described but never shown)

4. Agent creates places:
   - rainy_street.yaml (neon-lit alley, rain, puddles)
   - office.yaml (cluttered detective office, dim)

5. Agent generates reference images:
   - references/characters/detective_sheet.png (ZIT, full body, front)
   - references/characters/suspect_sheet.png (ZIT, full body, front)
   - references/places/rainy_street.png (ZIT, wide establishing)
   - references/places/office.png (ZIT, wide establishing)

6. Agent creates script: 5 scenes, 3-5 shots each = 15-25 keyframes

7. Agent generates keyframes:
   For each shot:
   a. Write shot YAML (camera, characters, action, mood)
   b. Compose Flux2-Klein prompt: (image 1) [action] in (image 2) [env]. [camera]
   c. Select reference images (character + place)
   d. Submit Flux2-Klein + ZIT workflow via API
   e. Quality check against character/place references
   f. Save to shots/ folder

8. Agent outputs final gallery.md with all keyframes in order
```

---

## Prompt Engineering Tips

### Consistency Tricks

1. **Anchor the character description** — Always start prompts with the
   EXACT character description from the reference sheet. Same words, same order.

2. **Use the same style suffix** — Every prompt should end with the same
   style/quality tags from your style_guide.yaml.

3. **Low denoise on ZIT pass** — The single most important parameter.
   Keep at 0.35. Going higher breaks the composition from Flux2-Klein.

4. **Consistent references** — Always use the SAME character reference image
   across all shots. Don't swap between different photos of the same person.

5. **Environment plate reuse** — Once you have a good environment reference,
   use it for ALL shots in that location.

### Camera Prompt Words

| Distance | Prompt Keywords |
|----------|----------------|
| Extreme Close-Up | "extreme close-up, only face visible, eyes and nose" |
| Close-Up | "close-up, head and shoulders" |
| Medium Close-Up | "medium close-up, chest up" |
| Medium | "medium shot, waist up" |
| Medium Long | "medium long shot, knees up" |
| Long | "long shot, full body visible with environment" |
| Extreme Long | "extreme long shot, tiny figure in large environment" |

| Angle | Prompt Keywords |
|-------|----------------|
| Eye Level | "eye level angle" |
| Low Angle | "low angle looking up, imposing" |
| High Angle | "high angle looking down, vulnerable" |
| Bird's Eye | "bird's eye view, directly overhead" |
| Dutch Angle | "dutch angle, tilted, unsettling" |
| Worm's Eye | "worm's eye view, from ground looking up" |

---

## Common Pitfalls

1. **Skipping reference generation.** If you jump straight to scene shots
   without creating character/place references, consistency falls apart.
   Always build the reference library first.

2. **Using outdated techniques (img2img/IP-Adapter).** These are outdated and
   produce inconsistent results. Use Flux2-Klein ReferenceLatent or
   Kling AI elements instead.

3. **Too-high denoise on ZIT pass.** Setting denoise above 0.45 on the
   ZIT upscale stage breaks the composition from Flux2-Klein. Keep at 0.35.

4. **Inconsistent style tags.** If your establishing shot uses "cyberpunk
   anime" but your close-ups use "photorealistic", the gallery will look
   disjointed. Pick one style and stick to it across ALL prompts.

5. **Forgetting camera in prompts.** A "medium shot" prompt without camera
   angle/distance will default to whatever the model prefers. Always specify.

6. **Not enough variety in shots.** A scene with only close-ups feels
   claustrophobic. Alternate between establishing, master, CU, and insert
   shots for rhythm.

7. **Generating too many characters per image.** Flux2-Klein works best
   with 1-2 references. For group scenes with 3+ characters, generate
   separately and composite, or use 2-character compositions.

8. **Ignoring lighting consistency.** If a scene is set at night, every
   shot in that scene must have night lighting. Missing this breaks immersion.

9. **Mixing resolution ratios.** Keep consistent aspect ratios within a
   scene. Don't mix 16:9 landscapes with 9:16 portraits in the same sequence.

10. **Not saving seeds.** When a keyframe looks good, SAVE THE SEED. You
    may need to regenerate variations or use it as a base for nearby shots.

11. **LTX2.3 API submission fails.** The `LTX2SamplingPreviewOverride` node
    requires server context not available via API. Remove this node before
    API submission, or run LTX2.3 from the ComfyUI web UI only.

12. **SaveImageExtended node silent failure.** The 3-ref workflow uses
    SaveImageExtended which may not output via API. Fall back to 2-ref
    workflow for shots that don't strictly need 3 references.

13. **execute_code timeout.** Batch video generation in single-shot calls.
    The 300s timeout kills multi-video batches. Generate one video per call
    or use background processes for long batches.

14. **ComfyUI output subfolder.** Videos with `hermes/lose-in-place/` or
    `hermes/storyline/` prefix save to `F:\ComfyUI\output\hermes\<project>\`,
    NOT the default output root. Always check subfolders when looking for
    generated files. After generation, search `hermes/<project>/` first.

15. **Reference filename mismatch.** Shot breakdowns may reference filenames
    that don't match the actual generated files (e.g., `mayu_sheet.png` vs
    `maya_sheet.png`). After generating references, verify filenames match
    what shot prompts expect. Either rename files or update shot prompts.

16. **Character sheet format.** User requires multi-angle sheets (front, side,
    back, close-up) in a single image, NOT single front-view portraits.
    Always generate landscape 1280x720 sheets with 4 views.

17. **Video prompt documentation.** Always export `video_prompts.md` in each
    scene folder after generating videos. User needs to review prompts
    without reading code or workflow JSONs.

18. **LTX2.3 duration setting.** Default is 10s @ 24fps. User may request
    shorter clips (5s) for specific shots. Set node `615` value to desired
    seconds before submission.

11. **Windows workspace path split.** On this machine, `~/.hermes/workspace`
    and `~/AppData/Local/hermes/workspace` are DIFFERENT paths. Files saved
    via `~` (skill_manage, terminal) land in `C:\Users\benja\.hermes\workspace`.
    The user's visible workspace is at `C:\Users\benja\AppData\Local\hermes\workspace`.
    After creating project folders, ALWAYS copy to the AppData location so
    the user can see them in File Explorer.

16. **ZIT output naming.** ZIT generates files with prompt-derived names
    (e.g., `Maya Chen_00001_.png`), not the save_as path from the YAML.
    After generation, move/rename files from ComfyUI output to match the
    filenames that shot prompts expect (e.g., `maya_sheet.png`).

17. **generation_prompts.yaml format.** The file uses a LIST of dicts, not
    a dict of dicts. Each item has keys: id, name, type, resolution,
    orientation, save_as, prompt. Iterate with `for item in prompts['character_sheets']`,
    NOT `for name, data in prompts['character_sheets'].items()`.

18. **Large project delegation.** For stories with 20+ scenes, use
    delegate_task to create Phase 1 files in parallel (characters, places,
    scripts in separate subagents). This reduces wall-clock time from
    10+ minutes to ~2 minutes.

---

## Directory Structure Convention

```
project_name/
├── storyline.md              # Phase 1.1
├── characters/               # Phase 1.2
│   ├── alice.yaml
│   ├── bob.yaml
│   └── charlie.yaml
├── script/                   # Phase 1.3
│   ├── scene_01.yaml
│   ├── scene_02.yaml
│   └── scene_03.yaml
├── beat_sheet.yaml           # Phase 1.4
├── style_guide.yaml          # Phase 2.3
├── references/               # Phase 2.1 & 2.2
│   ├── characters/
│   │   ├── alice_sheet.png   # Multi-angle: front, side, back, close-up
│   │   ├── bob_sheet.png
│   │   └── charlie_sheet.png
│   ├── places/
│   │   ├── coffee_shop.png
│   │   └── office.png
│   └── generation_prompts.yaml
├── shots/                    # Phase 3
│   ├── scene_01/
│   │   ├── shots.yaml        # Shot breakdowns with Flux2 prompts
│   │   ├── S01_01.png        # Keyframe
│   │   ├── S01_01_video.mp4  # Video
│   │   └── video_prompts.md  # Motion prompts for review
│   └── scene_02/
│       └── ...
├── gallery.md                # Phase 3.5 - final ordered index
└── ComfyUI Workflows/        # Workflow JSON files
    ├── flux2_klein_zit_2refs_workflow.json
    ├── flux2_klein_zit_1bg_2char_workflow.json
    └── ltx23_img2video_workflow.json
```

---

## Verification Checklist

- [ ] storyline.md exists with genre, tone, visual_style, synopsis
- [ ] One YAML file per character with full visual description + reference_prompt
- [ ] One YAML file per place with full environment description
- [ ] Script broken into scenes with dialog and visual_notes
- [ ] beat_sheet.yaml links scenes → characters → places
- [ ] Character reference sheets generated (multi-angle: front, side, back, close-up)
- [ ] Place background plates generated and quality-checked
- [ ] style_guide.yaml defines consistent art direction
- [ ] Each shot has a YAML file with camera, characters, action, prompt
- [ ] Keyframes generated using ReferenceLatent (Flux2-Klein) or Kling elements
- [ ] ZIT denoise set to 0.35 (not higher)
- [ ] All prompts include camera distance + angle + position
- [ ] All prompts end with same style suffix
- [ ] video_prompts.md exported in each scene folder
- [ ] All videos generated with correct duration
- [ ] gallery.md lists all keyframes in narrative order
- [ ] Character descriptions are consistent across all prompts
- [ ] Lighting is consistent within each scene
- [ ] Reference filenames match shot prompt expectations
