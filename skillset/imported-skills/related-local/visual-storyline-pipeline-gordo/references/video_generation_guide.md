# Video Generation Reference — Visual Storyline Pipeline

## LTX2.3 PromptRelay Workflow

Converts keyframes into 10-second animated video shots with camera motion
and ambient sound generation.

**File:** `ComfyUI Workflows/LTX2.3_PromptRelay_VLM Img2Video 20260521 (API).json`

### Pipeline
```
Keyframe → Qwen3-VL (analyze) → PromptRelay (motion prompt) → LTX 2.3 → Video
```

### Settings
| Parameter | Value |
|-----------|-------|
| Duration | 10 seconds |
| FPS | 24 |
| Total frames | 240 |
| Sampler | euler_ancestral |
| Scheduler | linear_quadratic |
| Steps | 8 |
| CFG | 1 |
| Output | H.264 MP4, CRF 19 |

### LoRA Chain
1. `ltx-2.3-22b-distilled-lora-384.safetensors` (0.4)
2. `LTX2.3_Crisp_Enhance.safetensors` (0.85)
3. `Ltx2.3-Licon-VBVR-I2V-390K-R32.safetensors` (1.0)

### API Submission
1. Upload keyframe to ComfyUI input
2. Set `584.inputs.image` = keyframe filename
3. Set `621.inputs.value` = motion prompt (story idea)
4. Set `561.inputs.noise_seed` = random
5. Set `604.inputs.filename_prefix` = output path
6. Submit to `/api/prompt`

### Motion Prompt Format
The VLM generates 4-shot sequences from a single keyframe:
```
Shot 1: [action + camera motion] |
Shot 2: [action + camera motion] |
Shot 3: [action + camera motion] |
Shot 4: [action + camera motion]
```

### API Limitation
The `LTX2SamplingPreviewOverride` node (588) requires ComfyUI server
context not available via API. Remove this node before API submission.
The workflow provided by the user has this node already removed.

## Video Prompt Templates

### Establishing Shot
```
Camera slowly pushes forward through fog toward the house. Trees sway
gently in wind. Atmosphere thickens as we approach.
```

### Character Walking
```
The character walks forward slowly, camera follows with slight handheld
motion. She looks around cautiously, grip tightening on her bag.
```

### Door Discovery
```
Camera slides right as the cabinet moves, revealing the sealed door.
The character freezes. Camera holds on the door.
```

### Horror Reveal
```
Camera holds steady on the mirror. A shadow appears in the reflection
that does not match. The character spins around — nothing there.
```

### Spirit Manifestation
```
The spirit stands unnaturally still in the corner. Head tilts slowly
to the wrong angle. Mouth widens into an impossible smile.
```

### Terror Reaction
```
Camera jerks with the character as she spins. Flashlight beam swings
wildly. She backs against the wall, phone light casting horror shadows.
```

## Generation Strategy

### Batch Approach
Generate videos one at a time (execute_code 300s timeout kills batches):
```python
# Single video generation
for shot in remaining_shots:
    gen_video(shot_id, scene, prompt)  # One call per video
```

### Prompt Writing
- Keep prompts under 50 words
- Focus on camera motion + character action
- Match the mood of the scene
- Use present tense ("walks" not "walked")
- Include camera movement keywords ("pushes in", "pans", "holds steady")

### Output Location
Videos save to: `F:\ComfyUI\output\hermes\storyline\{filename}_video.mp4`
Copy to workspace: `shots/{scene}/{shot_id}_video.mp4`
