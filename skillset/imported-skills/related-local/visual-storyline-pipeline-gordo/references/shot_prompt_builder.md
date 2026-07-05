# Shot Prompt Builder — Quick Reference

## Master Prompt Template

### Flux2-Klein (Primary — Multi-Reference)
```
(image 1) [CHARACTER ACTION] in (image 2) [ENVIRONMENT]. [CAMERA SHOT TYPE]
```

### Kling AI (Cloud Alternative)
```
[1. ELEMENT_REF] [2. ACTION/EXPRESSION] [3. IMAGE_REF] [4. CAMERA] [5. LIGHTING] [6. MOOD] [7. STYLE]
```

**Key difference:** Flux2-Klein uses `(image 1)` / `(image 2)` placeholders.
Kling uses `@element_N` / `@image_N` placeholders.

---

## Section Templates

**[1. CHARACTER / IMAGE_REF]** — Reference image holds the identity

**Flux2-Klein:**
```
(image 1) the character is sitting at a table reading a letter
```

**Kling:**
```
Character @element_1
```

**[2. ACTION/EXPRESSION]** — What they're doing right now
```
reading a letter with a surprised expression,
OR: typing furiously on a laptop with intense focus,
OR: standing with arms crossed, looking suspicious
```

**[3. CAMERA]** — Distance + angle + position (ALWAYS include all three)
```
medium close-up shot, eye_level angle, three_quarter view,
```

**[4. ENVIRONMENT]** — Where they are (from place reference)
```
inside a cozy coffee shop with warm wood interior and large windows,
```

**[5. LIGHTING]** — Time + quality + direction
```
warm morning light streaming through windows from the left,
```

**[6. MOOD]** — Emotional atmosphere
```
quiet tension atmosphere,
```

**[7. PROPS]** — Objects in the scene
```
coffee cup on table, letter in hands,
```

**[8. STYLE]** — Consistent suffix (SAME for every prompt in the story)
```
cyberpunk anime style, high detail, sharp focus, cinematic composition
```

---

## Camera Quick Reference

### Distance Keywords
| Distance | Prompt |
|----------|--------|
| Extreme Close-Up | "extreme close-up, only face visible, detailed eyes" |
| Close-Up | "close-up, head and shoulders" |
| Medium Close-Up | "medium close-up, chest and above" |
| Medium | "medium shot, waist up" |
| Medium Long | "medium long shot, knees up" |
| Long | "long shot, full body with environment" |
| Extreme Long | "extreme long shot, figure small in landscape" |

### Angle Keywords
| Angle | Prompt |
|-------|--------|
| Eye Level | "eye level angle" |
| Low | "low angle looking up, dramatic" |
| High | "high angle looking down" |
| Bird's Eye | "overhead bird's eye view" |
| Dutch | "dutch angle, tilted, unsettling" |
| Worm's Eye | "worm's eye view from ground" |

### Position Keywords
| Position | Prompt |
|----------|--------|
| Front | "front view, facing camera" |
| Side | "side profile view" |
| Back | "back view, facing away" |
| Three-Quarter | "three-quarter view" |
| Over-Shoulder | "over-the-shoulder shot from behind [other character]" |

---

## Shot Type Templates (Flux2-Klein)

### Establishing Shot
```
(image 1) the character is standing small in (image 2) the full environment.
Extreme long shot, bird's eye view, establishing shot, [STYLE_SUFFIX]
```

### Master Shot
```
(image 1) the character is [ACTION] in (image 2) the full location with
key landmarks visible. Long shot, eye level angle, front view, [STYLE_SUFFIX]
```

### Over-the-Shoulder (Dialog)
```
(image 1) the character is having a conversation in (image 2) inside the
location. Over the shoulder shot from behind, [STYLE_SUFFIX]
```

### Close-Up (Emotion)
```
(image 1) the character is showing [EMOTION] on their face in (image 2)
the environment. Close-up shot, eye level angle, front view, [STYLE_SUFFIX]
```

### Insert / Detail
```
(image 1) close-up of [OBJECT/HAND/PROP] in (image 2) the environment.
Extreme close-up shot, [STYLE_SUFFIX]
```

### Two-Shot
```
(image 1) the character is side by side with another person in (image 2)
the location. Medium shot, eye level angle, front view, [STYLE_SUFFIX]
```

### POV Shot
```
What the character sees: [detailed scene description] in (image 2) the
environment. First person POV, [STYLE_SUFFIX]
```

---

## Kling AI Full Examples

### Character Sheet (Kling)
```
Character @element_1, full body portrait, front view, neutral pose,
white background, character reference sheet, high detail, cyberpunk anime style
```

### Single Character Shot (Kling)
```
Character @element_1 reading a letter with a surprised expression,
in @image_1 cozy coffee shop interior,
medium close-up shot, eye_level angle, three_quarter view,
morning light streaming through windows,
quiet tension atmosphere,
cyberpunk anime style, high detail
```

### Multi-Character Dialog (Kling)
```
Character @element_1 and Character @element_2 having a conversation
in @image_1, Character @element_1 leaning forward with intensity,
Character @element_2 leaning back defensively,
over-the-shoulder shot from behind @element_2,
morning light, tense atmosphere,
cyberpunk anime style, high detail
```

### Environment Establishing (Kling)
```
@image_1 cyberpunk alley at night, neon signs reflecting in puddles,
rain falling, extreme long shot, bird's eye view,
moody blue and pink lighting,
no people, establishing shot,
cyberpunk anime style, high detail
```

### Story Mode Sequence (Kling)
```
Character @element_1 in @image_1:
1. arriving at the coffee shop entrance
2. ordering at the counter with a smile
3. sitting down and opening a mysterious letter
4. reading with a shocked expression
5. looking around nervously to check if anyone is watching
```

---

## Flux2-Klein Full Examples

### Single Character in Environment
```
(image 1) the character is sitting at a table reading a letter in (image 2) inside the cozy coffee shop. Medium close-up shot
```

### Character with Emotion
```
(image 1) the character is standing with a surprised expression looking at a letter in (image 2) on the rainy neon street. Close-up shot
```

### Two Characters Dialog
```
(image 1) the character is having an intense conversation with another person in (image 2) inside the dim office. Over the shoulder shot
```

### Character Action
```
(image 1) the character is walking through the market stalls looking at items in (image 2) on the bustling street market. Wide shot
```

### Environmental Focus
```
(image 1) the character is standing alone in (image 2) the empty warehouse with dramatic lighting. Extreme long shot
```

---

## Flux2-Klein vs Kling Comparison

| Aspect | Flux2-Klein | Kling AI |
|--------|-------------|----------|
| Reference syntax | `(image 1)`, `(image 2)` | `@element_1`, `@image_1` |
| Character persistence | Same image per session | Persistent element IDs |
| Max references | 2-3 images | 10 slots |
| Best for | Quick scene composition | Multi-character series |
| Quality | High (with ZIT upscale) | High (native) |
| Offline capable | Yes (local GPU) | No (API required) |

---

## Kling Prompt Rules

1. **Always reference elements first** — `@element_N` comes before action
2. **Image references after action** — `@image_N` comes before camera
3. **Camera type after references** — "medium shot, eye level angle"
4. **Style last** — End with art direction keywords
5. **Max 2000 chars** — Keep focused, ~100-150 words ideal
6. **Use @element_N for characters** — NOT @image_N (elements preserve identity better)

---

## Flux2-Klein Prompt Rules

1. **Use (image 1) and (image 2) placeholders** — These map to your reference slots
2. **Character first** — `(image 1)` should be the character/subject reference
3. **Environment second** — `(image 2)` should be the environment/background
4. **Action in middle** — Describe what the character is doing
5. **Camera last** — End with shot type (close-up, medium shot, etc.)
6. **Keep it simple** — Flux2-Klein understands natural language, no need for complex tags

**Example:**
```
(image 1) the character is sitting at a table reading a letter in (image 2) inside the cozy coffee shop. Medium close-up shot
```

---

## LTX2.3 Video Motion Prompt Rules

Motion prompts drive camera movement, character action, and now **speech/dialog**.

### Prompt Structure
```
[Character] [action/expression] and says "[dialog]" [continuing action].
[Camera movement]. [Atmosphere/lighting].
```

### Dialog Format
- Use quotation marks for spoken lines
- Include speaker name before the quote
- Add expression/body language after the quote
- Keep lines under 15 words for best lip-sync

### Examples

**With Dialog:**
```
Maya opens her eyes with a confused expression and says "Where am I?" She slowly looks around the dim room. Camera holds steady in medium close-up.
```

```
The Concierge slides a map across the brass counter and says "Welcome to your stay." His smile is too wide. Camera follows the map in close-up.
```

```
Elena grabs Maya's arm urgently and whispers "Don't go to the garden." She glances nervously down the hallway. Camera pushes in on their faces.
```

**Without Dialog (silent shot):**
```
Maya walks barefoot across cold marble floor toward the window. Her reflection appears briefly in a dark mirror. Camera follows her movement in a smooth tracking shot.
```

### Key Rules
1. Mix speech with action — don't have characters standing still while talking
2. For silent shots, focus entirely on physical motion and camera
3. Whispered/shouted lines: use "whispers" or "says urgently" to set tone
4. Multiple characters: describe each person's action separately
5. Reaction shots: describe the listener's expression after the speaker's line

## Quality Check After Each Generation

- [ ] Character matches reference (hair, eyes, clothing, features)?
- [ ] Camera matches intended distance/angle?
- [ ] Lighting consistent with scene time_of_day?
- [ ] Environment matches place reference?
- [ ] Style matches STYLE_SUFFIX?
- [ ] Mood matches scene mood?
- [ ] No extra characters or objects appeared?
- [ ] Resolution and aspect ratio correct?
