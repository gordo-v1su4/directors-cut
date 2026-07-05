# Kling AI Reference Guide — Visual Storyline Pipeline

## Overview

Kling AI provides a professional API for image and video generation with
built-in character consistency through **Elements** and **Reference Images**.

This guide covers the key concepts for using Kling in the storyline pipeline.

## Models

| Model | Type | Best For |
|-------|------|----------|
| `kling-v3` | Basic | Standard text-to-image, image-to-image |
| `kling-v3-omni` | Omni | Multi-reference, elements, 4K, story mode |
| `kling-image-o1` | Omni | Advanced image generation |

**Default:** `kling-v3-omni` for all reference-based generation.

## Element System (Character Consistency)

Elements are **persistent character/subject objects** that Kling remembers
across generations. Once created, you reference them by ID in any prompt.

### Creating Elements

```bash
# From a front-facing photo
node kling.mjs element --action create \
  --name "Alice" \
  --description "Young woman, red hair ponytail, green eyes, white blouse" \
  --ref_type image_refer \
  --frontal_image ./alice_front.jpg

# From a video clip
node kling.mjs element --action create \
  --name "Alice" \
  --description "Young woman, red hair ponytail" \
  --ref_type video_refer \
  --video "https://example.com/alice_clip.mp4"
```

### Element Best Practices

1. **Front-facing photo is critical** — The model extracts facial features
   from the frontal image. Use a clear, well-lit, straight-on photo.

2. **Description matters** — Keep under 100 chars. Include:
   - Gender/age appearance
   - Hair color + style
   - Eye color
   - Key distinctive features
   - Default clothing

3. **Multiple angles optional** — Add 1-3 reference images for different
   angles if available. Improves consistency across camera positions.

4. **Name is permanent** — Choose carefully. Max 20 chars.

### Managing Elements

```bash
# List all elements
node kling.mjs element --action list

# Query specific element
node kling.mjs element --action query --task_id <creation_task_id>

# Delete element
node kling.mjs element --action delete --element_id <id>
```

## Reference Image Slots

Kling Omni supports up to **10 reference slots** (elements + images combined).

| Slot | Prompt Syntax | Use For |
|------|---------------|---------|
| Element | `@element_1`, `@element_2`, ... | Character identity |
| Image | `@image_1`, `@image_2`, ... | Style, background, composition |
| Video | `@video_1` | Motion reference (video only) |

**Example prompt:**
```
Character @element_1 and Character @element_2 sitting in @image_1,
morning light streaming through windows, medium shot, eye level angle,
cyberpunk anime style
```

## Image Generation API

### Basic (no references)
```bash
node kling.mjs image \
  --prompt "A cozy coffee shop interior, morning light" \
  --resolution 2k \
  --aspect_ratio 16:9
```

### With Element Reference
```bash
node kling.mjs image \
  --prompt "Character @element_1 walking through @image_1, medium shot" \
  --element_ids <element_id> \
  --image ./coffee_shop.png
```

### Story Mode (Coherent Series)
```bash
node kling.mjs image \
  --prompt "Character @element_1 in @image_1: arriving, ordering, reading, reacting, leaving" \
  --element_ids <element_id> \
  --image ./shop.png \
  --imageCount 5 \
  --story_mode true
```

## Parameters Reference

| Parameter | Values | Default | Notes |
|-----------|--------|---------|-------|
| `--resolution` | 1k, 2k, 4k | 1k | 4k requires VIP |
| `--aspect_ratio` | 16:9, 9:16, 1:1, auto | auto (v3) | auto not for O1 |
| `--imageCount` | 1-9 | 1 | With story_mode |
| `--story_mode` | true/false | false | Coherent multi-image |
| `--n` | 1-9 | 1 | Independent variations |

## Prompt Structure for Storyline Pipeline

### Character Sheet
```
Character @element_1, full body portrait, front view, neutral pose,
white background, character reference sheet, high detail
```

### Scene Shot
```
Character @element_1 [action/expression] in @image_1 [location details],
[camera_distance] shot, [camera_angle] angle, [camera_position] view,
[lighting], [mood] atmosphere, [props],
[visual_style], high detail, sharp focus
```

### Multi-Character Shot
```
Character @element_1 and Character @element_2 [actions] in @image_1,
[camera setup], [lighting], [mood],
[visual_style], high detail
```

### Environment-Only (No Characters)
```
[place_description], [time_of_day] lighting, [weather],
establishing shot, wide angle, no people, background plate,
high detail, [visual_style]
```

## Common Pitfalls

1. **Overfilling reference slots** — 10 max. For stories with many
   characters, prioritize the ones appearing in each specific shot.

2. **Weak frontal photos** — Blurry, angled, or dark frontal images
   produce inconsistent character results. Invest in good reference photos.

3. **Prompt too long** — Omni limit is 2000 chars. Keep prompts focused.
   Reference placeholders + action + camera + style = ~100-150 words.

4. **Mixing story_mode with independent generation** — story_mode produces
   coherent sequences. Don't mix with --n (independent variations).

5. **Forgetting element_ids** — If you use @element_1 in prompt but don't
   pass --element_ids, the tag is ignored and character identity is lost.

6. **Not saving element IDs** — After creating elements, ALWAYS save the
   element_id to the character YAML file. You'll need it for every shot.

7. **LTX2.3 preview override crash** — The `LTX2SamplingPreviewOverride`
   node causes `NoneType has no attribute encode` when submitting via API.
   Remove node 588 before API submission, or run from web UI only.

8. **SaveImageExtended silent failure** — Node 193 in 3-ref workflow may
   not output via API. Check for files in subfolders like
   `hermes/storyline-Klein_ZAnime/` not just `hermes/storyline/`.

9. **execute_code timeout** — 300s limit kills multi-video batches.
   Generate one video per execute_code call, not loops.

10. **ComfyUI output subfolders** — Files with prefix `hermes/storyline/`
    may save to `F:\ComfyUI\output\hermes\storyline\` or
    `F:\ComfyUI\output\hermes\storyline-Klein_ZAnime\` depending on
    which save node is used. Always search both.

## Cost Considerations

- Image generation: ~1 credit per image (varies by resolution)
- Element creation: ~2 credits
- Story mode: Same as imageCount credits
- 4K resolution: Premium pricing

**Optimization:** Use story_mode for sequences to maintain coherence
while generating multiple shots efficiently.
