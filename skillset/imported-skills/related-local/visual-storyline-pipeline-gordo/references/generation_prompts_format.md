# generation_prompts.yaml Format Reference

This file defines ZIT prompts for generating reference images. It uses a **LIST of dicts** format, not a dict of dicts.

## Structure

```yaml
character_sheets:
  - id: "maya"
    name: "Maya Chen"
    type: "character"
    resolution: "720x1280"
    orientation: "portrait"
    save_as: "references/characters/maya_sheet.png"
    prompt: "young Chinese-American woman, 32 years old, slim build, black hair in messy bun, dark brown eyes, wearing cream blouse and dark trousers, carrying leather portfolio, full body portrait, front view, neutral pose, white background, character reference sheet, high detail, art deco surrealism style"

  - id: "concierge"
    name: "The Concierge"
    type: "character"
    resolution: "720x1280"
    orientation: "portrait"
    save_as: "references/characters/concierge_sheet.png"
    prompt: "..."

place_backgrounds:
  - id: "lobby"
    name: "The Grand Lobby"
    type: "place"
    resolution: "1280x720"
    orientation: "landscape"
    save_as: "references/places/lobby.png"
    prompt: "grand art deco hotel lobby, polished marble floors with geometric patterns, brass elevators, crystal chandelier, front desk with brass bell, warm amber lighting, establishing shot, wide angle, no people, background plate, high detail, art deco surrealism style"

  - id: "room_317"
    name: "Room 317"
    type: "place"
    resolution: "1280x720"
    orientation: "landscape"
    save_as: "references/places/room_317.png"
    prompt: "..."

generation_settings:
  model: "ZIT"
  workflow: "flux2_klein_zit_2refs_workflow.json"
  steps: 12
  cfg: 1
  sampler: "res_multistep"
  scheduler: "simple"
```

## Iteration Pattern (Python)

```python
import yaml

with open('references/generation_prompts.yaml', 'r') as f:
    prompts = yaml.safe_load(f)

# Character sheets — LIST of dicts
for item in prompts['character_sheets']:
    name = item['name']
    prompt = item['prompt']
    save_as = item['save_as']
    # ... generate

# Place backgrounds — LIST of dicts
for item in prompts['place_backgrounds']:
    name = item['name']
    prompt = item['prompt']
    save_as = item['save_as']
    # ... generate
```

## Resolution Conventions

| Type | Resolution | Orientation |
|------|-----------|-------------|
| Character sheets | 720x1280 | portrait (9:16) |
| Place backgrounds | 1280x720 | landscape (16:9) |
| Story keyframes | 1280x720 | landscape (16:9) |

## Post-Generation File Handling

ZIT generates files with prompt-derived names (e.g., `Maya Chen_00001_.png`),
not the `save_as` path. After generation:

1. Find the file in ComfyUI output (check `F:\ComfyUI\output\` and subfolders)
2. Move/rename to the `save_as` path
3. Verify the file matches what shot prompts expect

```python
# Example rename mapping
char_map = {
    "characters/maya_sheet.png": "references/characters/maya_sheet.png",
    "characters/concierge_sheet.png": "references/characters/concierge_sheet.png",
    # ...
}
place_map = {
    "places/lobby_bg.png": "references/places/lobby.png",  # remove _bg suffix
    # ...
}
```
