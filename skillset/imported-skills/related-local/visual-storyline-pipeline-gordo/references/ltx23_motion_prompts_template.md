# LTX2.3 Motion Prompt Template

Use this format for LTX2.3 image-to-video motion prompts.

## Structure

```
[Character action/movement]. [Environment detail]. [Camera movement]. [Mood/atmosphere].
```

## Examples by Shot Type

### Character Close-Up
```
Maya's eyes slowly flutter open. She blinks several times, confused. 
Her head turns slightly as she takes in the surroundings. 
Camera holds steady, capturing her growing unease.
```

### Character Movement
```
Maya walks barefoot across the cold floor toward the window. 
Her reflection appears briefly in a mirror. 
She reaches the curtains and hesitates. 
Camera follows her movement in a smooth tracking shot.
```

### Object Detail
```
Close-up of a vintage brass clock. The hands spin backward then forward. 
The second hand ticks erratically, skipping beats. 
Camera holds tight on the clock face, shallow depth of field.
```

### POV / Environment
```
Point of view through the window. An impossible landscape unfolds — 
city streets looping, buildings at wrong angles. 
Camera slowly pans across the surreal vista.
```

### Two-Shot (Dialog)
```
Two-shot of Maya and the Concierge. He smiles — too wide, too warm. 
Maya takes a half-step back. 
They face each other across the brass counter. 
Camera holds at eye level.
```

### Reveal / Discovery
```
Maya pulls open the heavy door. The hallway stretches impossibly far. 
She steps out cautiously. 
Camera positioned in hallway looking toward her as she emerges.
```

## Duration Settings

| Duration | Node | Use For |
|----------|------|---------|
| 5s @ 24fps | `615` = 5 | Quick actions, reactions, object details |
| 10s @ 24fps | `615` = 10 | Standard shots, character movement |
| 15s @ 24fps | `615` = 15 | Complex scenes, multiple actions |

## Key Rules

1. **Describe motion, not static details** — the model animates what you describe
2. **Include camera movement** — "camera holds", "camera tracks", "camera pushes in"
3. **Keep prompts under 200 words** — focused motion description
4. **Match the keyframe** — motion should start from what the image shows
5. **Specify character expression changes** — "expression shifts from X to Y"
