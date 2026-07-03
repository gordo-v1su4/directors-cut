---
id: seedance-product-orbit-disassembly
slug: seedance-product-orbit-disassembly
title: "Seedance Product Orbit Disassembly"
summary: "A compact product-ad pattern for rotating, splitting, showcasing, and reassembling a hero object with clear reference roles."
model_family: seedance
model_targets:
  - seedance-2.0
prompt_mode: reference_product_showcase
output_shape: prompt_card
use_cases:
  - product-ad
  - ecommerce
  - reference-image
  - hero-object
aspect_ratio: "9:16"
runtime_seconds: 10
evidence_type: community_corroborated
confidence: medium
source_count: 3
library_status: seed_pattern
tested_by_us: false
tags:
  - seedance
  - product
  - orbit
  - disassembly
  - ugc-ad
created: 2026-07-03
updated: 2026-07-03
created_by: hermes
curator: omp-phase-0
source_urls:
  - https://github.com/songguoxs/seedance-prompt-skill
  - https://github.com/HuyLe82US/awesome-seedance-prompts
  - https://github.com/rich5000/seedance-prompt-guide
source_notes:
  - Product showcase pattern adapted from songguoxs product ad example.
  - Commercial/product category corroborated by HuyLe82US prompt taxonomy.
  - Reference role syntax adapted from rich5000 material-role table.
---
# Seedance Product Orbit Disassembly

## When to use
Use this for a fast vertical product spot when you have one clean product image and need a dynamic SKU demo: orbit, split, feature reveal, reassembly, hero pose.

## Prompt pattern
```text
@image1 is the exact product identity and material reference. 10-second vertical product commercial, 9:16, premium ecommerce lighting. 0-2s: the product from @image1 rises onto a clean [SURFACE] as the camera pushes in, reflections match the product material. 2-5s: smooth 360-degree orbit around the product, labels and silhouette remain stable and readable. 5-7s: the product separates into [THREE FEATURE LAYERS] without breaking, each layer hovering in alignment while thin light lines call attention to [FEATURES]. 7-9s: the layers rotate back together and lock into one complete product with a crisp magnetic click. 9-10s: final centered hero shot on [BACKGROUND], subtle glow, product fills the frame, no subtitles, no watermark.
```

## Fill-in recipe
- `[SURFACE]`: matte acrylic plinth, wet stone counter, brushed steel slab, soft fabric pedestal.
- `[THREE FEATURE LAYERS]`: cap/body/base, shell/core/display, sole/cushion/upper, lens/body/mount.
- `[FEATURES]`: texture, ingredients, ports, stitching, logo emboss, material layers.
- `[BACKGROUND]`: gradient studio wall, kitchen counter, gym locker room, night street bokeh.

## Example
```text
@image1 is the exact product identity and material reference. 10-second vertical product commercial, 9:16, premium ecommerce lighting. 0-2s: the product from @image1 rises onto a matte black acrylic plinth as the camera pushes in, reflections match the product material. 2-5s: smooth 360-degree orbit around the product, labels and silhouette remain stable and readable. 5-7s: the product separates into cap, body, and base without breaking, each layer hovering in alignment while thin light lines call attention to the texture, embossed logo, and internal core. 7-9s: the layers rotate back together and lock into one complete product with a crisp magnetic click. 9-10s: final centered hero shot on a charcoal gradient studio wall, subtle glow, product fills the frame, no subtitles, no watermark.
```

## Why this works
Seedance product prompts perform best when the reference image has one job: lock product identity. The timeline avoids asking for too many feature demos and keeps the reveal physically legible.

## Source evidence
- [songguoxs/seedance-prompt-skill](https://github.com/songguoxs/seedance-prompt-skill) — product ad example with 360-degree spin, split into parts, and reassembly.
- [HuyLe82US/awesome-seedance-prompts](https://github.com/HuyLe82US/awesome-seedance-prompts) — commercial/product prompt category and proof-oriented curation style.
- [rich5000/seedance-prompt-guide](https://github.com/rich5000/seedance-prompt-guide) — `@image` product/material role assignment and commercial camera display template.
