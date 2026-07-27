---
name: midjourney-video-prompt
description: Writes Midjourney video prompts from a starting frame to produce asset-ready motion clips with subject, background, and camera movement. Use when the user uploads a character frame, wants Midjourney video prompts, motion reference footage, or dynamic poses to pull stills from.
---

# Midjourney Video Prompts

Because Midjourney released their video model, this workflow is more involved than still-image prompts.

Including everything you know about order of information, detail of prompts, and word choice: write prompts that follow best practices to turn the starting frame the user uploaded into an AI video that includes frames useful as stand-alone assets. Include all the normal information, but also add lines that describe subject movement, background movement, and camera movement.

Integrate these action and movement lines sprinkled in with the existing way you describe details of a scene. Each line should go back and forth with references of how the frame starts and how the frame moves as the video progresses. Video is almost always more complex than images, so 12–15 lines will likely be necessary.

## Prompt template

Rework this into information-dense Midjourney-style lines (tags and transition words as needed):

> "Reference footage of" [1–3 word description of the character] "striking several" [poses/expressions]. The character starts by [describe the basic pose or expression from the starting frame uploaded]. Then "moves into several" [1–3 basic description of the assets needed from this video] "the footage freezes as if pausing at key moments where the" [pose/expression] "is most picturesque"

Then continue with:

- Describe the biggest motion, and how it is depicted, as it moves from the starting frame to the required position. (A motion could be a body part needing to move from one place to another, a camera move, etc.)
- Describe another less prominent but still important motion that might be necessary to create the asset from this prompt. (If the first motion was arms moving in a certain way, this second may be a lean of the shoulders that makes that arm motion more natural.)
- ...and new lines that list any smaller motions that are worth mentioning...
- Explain how the motion looks in style. This can be somewhat metaphorical for photorealistic or clearly animatable characters, but if the uploaded frame is painted or drawn you should be more precise about how the line-work, shadows, and color are affected by the motion.

## Framing control

Control the contents framing (i.e., the composition) so the frame captures the entire asset needed. Describing the background in context is not sufficient—it is also important to give details on every element that needs to stay in the frame. To prevent zooming in or things getting cut off during motion, name the contents likely to be near the edges of the frame and describe what they will look like:

- Describe what will likely remain at the **top** of the frame (eg: the gray hat has a flat top that bounces slightly as his head moves)
- Describe what will likely remain at the **bottom** of the frame (eg: his tall brown boots cast shadow that moves as he rotates)
- Describe what will likely be visible on the **sides** of the frame (eg: His stubby fingers are casually pointed down, but swing gently with his movement)

By naming this content and specifically describing what they are doing throughout the video, it is likely to stay prevalent in the eyes of the video model, and thus remain visible. But be sure to describe them in terms of a visual action, never just "remain visible".

End the prompt with:

> Clean reference footage, with sharp and character-accurate motion perfectly for pulling assets from.

## Goal

Use the uploaded image as a starting point for how the subject looks, then use videos to move the subject into more dynamic poses to pull stills from. Write individual prompts describing how the starting frame would need to move (subject movement and camera movement) to keep the frame steady, fully capture the subject, and get the highest quality assets.

The user may provide numbered asset goals, for example:

1. she puts on a all black motorcycle helmet
2. she winks at camera and sings
3. he has evil red glowing eyes, and mouthing the word "DIE"
4. she spins around quick transforming her hair into a high blonde ponytail

## Fallbacks

If the user did not enter an idea into any slot, come up with a diverse way the starting frame could move to create useful assets. If you need ideas, try picking from: actions the character could take, camera orbits around the character, classic animation cycles, and effects that match the character design.

If the user did not upload an image or describe one with enough detail to work with, reply exactly:

> Thanks for that, I fully understand your request. Please go ahead and upload the starting frame you would like me to use, and I will generate those prompts for you right away.

## Example response

Understood — we'll now base the motion prompts entirely on your uploaded frame: the poised woman in a fitted black suit, sleek black boots, sharp bob haircut, and metallic makeup, standing against a pale, almost mint background. I'll keep the same structure as before, but tuned to her new outfit, stance, and full-body framing so the Midjourney video model produces high-quality, asset-ready clips.

**Prompt 1 – She puts on an all-black motorcycle helmet**

```
Reference footage of a sharply dressed woman in a tailored black suit and knee-high heeled boots striking several poised, confident poses. The footage begins with her standing tall against a pale mint backdrop, sleek black bob framing her metallic-painted face.
She starts in a statuesque stance, arms relaxed at her sides, chin slightly lifted, boots planted firmly on the floor.
She moves into several deliberate motions of lifting a matte black motorcycle helmet from just out of frame, raising it above her head.
The footage freezes at moments where her intense gaze meets the camera from beneath the helmet rim.
Her elbows rise outward in a smooth arc, the fitted suit jacket shifting with subtle folds as she lifts.
Her shoulders ease back to steady her stance, boots shifting fractionally but staying planted.
The helmet surface mirrors faint reflections of the mint background, warping them in its curvature.
A single strand of her bob brushes forward before vanishing beneath the helmet's edge.
The camera executes a slow dolly in, drawing focus toward her head as the visor lowers.
Background light subtly intensifies, casting pale glows across the helmet shell.
At the top of the frame, the helmet's dome curves in crisp profile as her head tilts.
At the bottom, her pointed boots gleam softly, shadows stretching forward as she adjusts her footing.
On the sides, her bent elbows rise gracefully, black suit sleeves stretching as she completes the motion.
Clean reference footage, with sharp and character-accurate motion perfectly for pulling assets from.
```

**Prompt 2 – She winks at camera and sings**

```
Reference footage of a sleek woman in a fitted black suit and tall black boots striking several elegant yet playful poses. The opening frame captures her standing tall against a pale mint backdrop, bobbed hair framing her metallic features.
She begins in a poised stance, hands at her sides, jacket fitted neatly over her shoulders.
She moves into several expressive moments: a slow, deliberate wink with her right eye, then parting her lips to sing.
The footage freezes at moments when her mouth shapes vowels, glossy red lips catching soft studio light.
Her head tilts slightly forward with the wink, casting delicate shadows across her cheekbones.
Her left hip shifts subtly, giving a hint of sway that brings movement into the tailored trousers.
Tiny flicks of her bob catch faint glints of light as she leans subtly toward the camera.
Her singing mouth forms precise shapes as though performing on a minimalist stage.
The camera glides in a gentle semi-circle, revealing shifting facial angles.
Subtle light blooms sweep across her face in rhythm with the camera's movement.
At the top of the frame, her sharp bob edge stays in crisp silhouette against the pale background.
At the bottom, the pointed toes of her boots remain angled outward, catching faint floor reflections.
On the sides, the drape of her tailored sleeves sways gently with her upper body's micro-movements.
Clean reference footage, with sharp and character-accurate motion perfectly for pulling assets from.
```

**Prompt 3 – He has evil red glowing eyes, mouthing the word "DIE"**

```
Reference footage of a striking, androgynous figure in a sharp black suit and tall black boots, metallic-painted face catching cold studio light, standing against a pale mint backdrop. The eyes now emit a fierce, pulsing crimson glow.
They start in a frozen, confrontational stance, gaze locked on the camera, boots set wide.
They move into several intense expressions: brows lowering, lips curling in restrained fury.
The footage freezes at moments when the glow from the eyes flares brightest, crimson light bleeding across sculpted cheekbones.
Their jaw flexes as they mouth the word "DIE" with slow, deliberate precision.
The neck tenses, subtle shadows forming along the high collar of the jacket.
A single lock of bobbed hair sways forward, briefly softening the sharp profile before sliding back.
The jacket's lapels catch intermittent glints of red light from the eyes.
The camera advances in a slow, creeping push, amplifying the menace of the glare.
The mint background subtly desaturates, deepening in tone as the eyes glow brighter.
At the top of the frame, the straight cut of the bob stays sharply outlined against the backdrop.
At the bottom, the polished boots throw faint red-tinted shadows on the floor as they shift slightly.
On the sides, the crisp line of the suit sleeves frames the torso, narrowing with the push-in shot.
Clean reference footage, with sharp and character-accurate motion perfectly for pulling assets from.
```

**Prompt 4 – She spins around, transforming hair into a high blonde ponytail**

```
Reference footage of a sleek woman in a fitted black suit and tall black boots striking several fluid, dramatic poses. The scene opens on her full-body stance, hands relaxed, bobbed hair in perfect shape, pale mint backdrop glowing softly.
She starts with a still, centered posture, head slightly tilted toward the camera.
She moves into several energetic spins, her short black bob flaring outward with centrifugal force.
The footage freezes at moments when her body is in mid-turn, suit fabric twisting elegantly.
As the spin peaks, her hair lengthens and lightens, seamlessly transforming into a high blonde ponytail.
Her shoulders roll back as she completes the turn, the ponytail sweeping in a wide golden arc.
Individual strands catch flashes of white light, creating a halo effect.
Her boots pivot smoothly, heels clicking softly against the floor with each turn.
The camera executes a smooth orbit, matching her spin to keep her perfectly centered.
Flares of reflected light sweep down the polished boots in sync with her movement.
At the top of the frame, the swinging blonde ponytail arcs high and remains fully visible.
At the bottom, the glossy black boots flare outward at the spin's peak, the floor reflection elongating briefly.
On the sides, the drape of the suit jacket flutters open before settling as the spin concludes.
Clean reference footage, with sharp and character-accurate motion perfectly for pulling assets from.
```

To take these to the next level, here are some ideas of what you might want to try next.

1. Introduce dynamic wind effects to add drama to hair and jacket movement.
2. Use a rapid camera zoom paired with a subject freeze for striking stills mid-action.
3. Incorporate reflective floor surfaces for enhanced light play under boots.
4. Try a wardrobe transformation mid-spin to switch from black suit to gold sequins.
