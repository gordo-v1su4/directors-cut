# Skill: Cinematic Photoreal Character Sheet From Any Reference Image

## Purpose

Turn any supplied image of a person, creature, mascot, avatar, or fictional subject into a clean premium **cinematic photorealistic character sheet** using a white studio background, multi-panel layout, full-body turnarounds, close-up portraits, detail panels, and a small info card with fictional character stats.

The result should feel like a high-end live-action film production board, casting reference sheet, or character design sheet — not a cartoon, not a messy concept sketch, not a dark fantasy poster.

---

## Core Behavior

When given a random image, treat it as the **visual identity lock** for a fictional character.

Do not identify real people.  
Do not describe the uploaded image literally unless asked.  
Instead, infer a believable fictional character from the image and preserve the visible design traits.

The generated sheet should include:

1. Full-body front view
2. Full-body side or 3/4 view
3. Full-body back view
4. Four cinematic head-and-shoulders portrait panels
5. Two or three close-up detail panels
6. One small clean info card with fictional name and basic stats

---

## Hard Style Rules

- Always use **16:9 landscape aspect ratio**
- Always use a **clean white studio background**
- Use crisp black or dark-gray panel dividers
- Make the sheet look organized, readable, and professional
- Use cinematic photorealism, not illustration or cartoon styling
- Use clean studio lighting with cinematic realism
- Avoid crushed blacks, messy textures, excessive grunge, or noisy detail
- Keep the character consistent across every panel
- Preserve identity traits from the reference image
- Preserve body type, face shape, hairstyle, skin tone, tattoos, scars, accessories, wardrobe energy, and expression attitude where visible
- If the user gives wardrobe changes, follow those exactly
- If no wardrobe is specified, invent wardrobe that fits the character but stays grounded and cinematic
- No square format
- No busy graphic-design clutter
- No random fantasy armor unless requested
- No exaggerated AI-model beauty smoothing
- No extra unrelated characters

---

## Layout Requirements

Create a clean multi-panel character-sheet layout inspired by premium production boards.

### Top / Main Row

Three large vertical panels:

- Full-body front view
- Full-body side or 3/4 view
- Full-body back view

The character should stand naturally in each view, studio-lit, full figure visible from head to shoes.

### Portrait Grid

Four medium close-up panels:

- Neutral expression
- Serious / focused expression
- Slightly intense expression
- Thoughtful or guarded expression

All portraits should match the same face, same hairstyle, same skin tone, same grooming, and same wardrobe.

For supernatural or transformation-based characters, vary the portraits progressively:

1. Normal human appearance
2. Heightened or suspicious expression
3. Eyes changed or partially transformed
4. Full supernatural or creature expression

### Detail Row

Two or three detail panels, depending on the character:

- Eye / face detail
- Hand / tattoo / accessory detail
- Fabric / prop / scar / jewelry / weapon detail

Only include details that make sense from the source image or the requested character direction.

### Info Card

Add one small clean info card, usually in the lower-left or lower-right corner.

The info card should look like a minimal film production ID card, not a trading card.

Include:

- Fictional name
- Age
- Role / occupation
- Height
- Build
- Key traits
- Wardrobe note
- Signature detail

Keep the text short and readable.

Example info card format:

```text
NAME: Mateo Cruz
AGE: 38
ROLE: Ex-con private security fixer
HEIGHT: 6'1"
BUILD: Muscular / compact
TRAITS: Controlled, watchful, hard to read
WARDROBE: Fitted black tee, dark work pants, boots
SIGNATURE: Tattooed arms, close-cropped hair, guarded stare
```

---

## Identity Preservation Rules

Use the reference image as the identity anchor.

Preserve:

- Face shape
- Eyes
- Nose
- Mouth
- Jawline
- Skin tone
- Hairline and hairstyle
- Facial hair
- Body type
- Tattoos or markings
- Accessories
- General attitude
- Age range

Do not randomly change ethnicity, gender presentation, body type, or age unless the user asks.

If the reference is low quality, infer the character while keeping the broad identity readable.

---

## Cinematic Photorealism Rules

Use this language in the final image prompt:

- cinematic photorealistic character sheet
- premium live-action film production board
- clean white seamless studio background
- sharp studio key light with soft fill
- realistic skin texture
- realistic fabric texture
- consistent face across all panels
- subtle cinematic depth
- professional character turnaround layout
- crisp panel dividers
- high-resolution editorial realism

Avoid:

- anime
- cartoon
- comic book
- painterly concept art
- plastic skin
- messy AI texture
- over-sharpened HDR
- dark gray background unless requested
- dramatic colored lighting unless requested

---

## Output Format

When the user asks for the skill to generate a sheet, output one complete image prompt.

Do not over-explain.  
Do not include multiple options unless requested.  
Do not make the sheet square.

---

## Master Prompt Template

Create a **16:9 cinematic photorealistic character sheet** using the supplied image as the definitive identity reference for a fictional character. Preserve the character’s face, skin tone, age range, body type, hairstyle, grooming, expression attitude, tattoos, scars, accessories, and visible design traits. The character must remain consistent across every panel.

Use a clean **white seamless studio background** across the entire sheet with crisp black panel dividers. The layout should feel like a premium live-action film production board or professional casting/character reference sheet, highly organized and readable.

The sheet layout should include three large full-body turnaround panels on the left and center: front view, 3/4 or side view, and back view. The character stands naturally in each view, full figure visible from head to shoes, studio-lit, with realistic anatomy and consistent wardrobe.

On the right side, include four cinematic head-and-shoulders portrait panels showing subtle expression variations: neutral, serious, focused, and slightly intense. Keep the face identical across all portraits, with realistic skin texture, natural eyes, accurate grooming, and premium cinematic portrait lighting.

For supernatural or transformation characters, make the four portraits progress clearly from normal to transformed:

1. Normal appearance
2. Heightened intensity
3. Eyes changed or partial transformation
4. Full transformed appearance with appropriate creature details

Along the bottom row, include two or three close-up detail panels inspired by the character’s visible traits: eye detail, hand detail, tattoo detail, accessory detail, fabric detail, scar detail, jewelry detail, or prop detail. Only include details that make sense for the character.

Add one small clean info card integrated into the layout, styled like a minimal film production ID card. The info card should contain short readable text:

```text
NAME: [invent believable fictional name]
AGE: [invent age]
ROLE: [invent role or occupation]
HEIGHT: [invent height]
BUILD: [describe build]
TRAITS: [3 short personality traits]
WARDROBE: [brief wardrobe description]
SIGNATURE: [one iconic visual detail]
```

Wardrobe: [use the wardrobe from the reference image unless the user specifies a change]. If the user specifies wardrobe, follow it exactly.

Overall look: cinematic photorealism, sharp studio lighting, soft fill, clean white background, realistic fabric, realistic skin, consistent identity, premium editorial quality, organized multi-panel sheet, modern live-action film character design board.

Negative prompt: cartoon, anime, illustration, painterly, comic book, plastic skin, fake muscles, inconsistent face, changing hairstyle, changing age, extra characters, messy background, dark gray background, low resolution, warped hands, unreadable text, cluttered layout, square image, over-contrasty lighting, crushed shadows, noisy texture, random props, fantasy costume unless requested.

---

## Quick User-Facing Version

Use the supplied image as the identity lock for a fictional character and create a clean 16:9 cinematic photorealistic character sheet on a white studio background. Follow a premium live-action production-board layout: full-body front view, 3/4 side view, back view, four close-up portrait expressions, two or three detail panels, and one small info card with fictional name, age, role, height, build, traits, wardrobe, and signature detail. Keep the same face, body type, skin tone, hairstyle, grooming, tattoos, accessories, and attitude consistent across every panel. Use crisp black panel dividers, realistic studio lighting, clean cinematic quality, and no messy textures or dark background.
