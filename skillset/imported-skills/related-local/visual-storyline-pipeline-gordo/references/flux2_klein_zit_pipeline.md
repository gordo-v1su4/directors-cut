# Flux2-Klein + ZIT Two-Stage Pipeline

## Overview

The primary local generation pipeline for compositing characters into environments.

## Stage 1: Flux2-Klein (Composition)

**Model:** `flux-2-klein-9b.safetensors`
**CLIP:** `qwen_3_8b.safetensors` (type: flux2)
**VAE:** `flux2-vae.safetensors`
**LoRA:** `lenovo_flux_klein9b.safetensors` (strength 0.8)
**Settings:** 8 steps, cfg 1, res_2s sampler, Flux2Scheduler

### Reference Injection
Uses `ReferenceLatent` nodes to inject reference images into the latent space:
```
Image 1 (character) → VAEEncode → ReferenceLatent → conditioning
Image 2 (environment) → VAEEncode → ReferenceLatent → conditioning
```

### Prompt Syntax
```
(image 1) [character action] in (image 2) [environment]. [camera shot type]
```

## Stage 2: ZIT (Detail + Upscale)

**Model:** `z_image_turbo_bf16.safetensors`
**CLIP:** `qwen_3_4b.safetensors` (type: lumina2)
**VAE:** `ae.safetensors`
**LoRAs:** `lenovo_z.safetensors` (0.7) + `z_skin_detail.safetensors` (-1)
**Settings:** 8 steps, cfg 1, res_multistep, denoise 0.35, shift 3
**Prompt:** `ultra high detail, 8K, UHD`

### Critical: Denoise = 0.35
Higher denoise breaks the composition from Flux2-Klein. Keep at 0.35.

## Two Workflow Variants

| Variant | File | References | Use For |
|---------|------|------------|---------|
| 2-ref | `flux2_klein_zit_2refs_workflow.json` | 1 character + 1 background | Single character shots |
| 3-ref | `flux2_klein_zit_1bg_2char_workflow.json` | 1 background + 2 characters | Dialog, group shots |

## API Notes

- Both workflows work via ComfyUI API submission
- Output saves to `hermes/<project>/` subfolder in ComfyUI output
- Search subfolders when looking for generated files
- 3-ref workflow uses `SaveImageExtended` which may not return output in API history — file IS saved to disk
