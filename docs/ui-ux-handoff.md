# Directors Cut Visual Browser — UI/UX Handoff

Last updated: 2026-07-03 by Hermes.

Purpose: give a UI/UX designer or tomorrow's agent enough structure to design the first visual web app without needing the full implementation context.

## 1. Product idea in one sentence

Directors Cut is a visual prompt-library and comparison browser for AI video workflows: it helps Gordo see prompt cards, evidence, model fit, references, and real comparison outputs side-by-side instead of reading scattered markdown files.

## 2. Primary user

Gordo is highly visual. The UI should be dense but not overwhelming: tables, cards, filters, model badges, source links, and side-by-side comparison panels should make the creative library feel browsable and tangible.

Design preference notes:
- Dark, dense, high-signal interface.
- Compact controls/buttons; avoid giant SaaS CTA buttons.
- Visual hierarchy should come from grouping, badges, color, cards, and previews.
- Tables are good, but should be paired with visual cards/detail panels.
- Source links and evidence should be visible/clickable, not hidden.
- Raycast/model outputs must be real captured outputs; do not fake comparison answers.

## 3. Current data available now

The repo currently has Phase 0 data, enough for a static/browser prototype.

Existing generated index:
- `public/data/prompt-cards.index.jsonl`
- 10 prompt cards
- One JSON object per line

Existing source markdown:
- `content/cards/seedance/*.md`
- `content/cards/sora/*.md`
- `content/cards/cross-model/*.md`
- `content/references/repos.md`

Existing schemas:
- `schemas/prompt-card.schema.json`
- `schemas/prompt-pack.schema.json`
- `schemas/comparison-run.schema.json`
- `schemas/model-answer.schema.json`

Current prompt-card index fields:

```ts
type PromptCardIndex = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  model_family: string;        // seedance | sora | cross-model | general_video
  model_targets: string[];     // e.g. seedance-2.0, sora-2, veo, kling
  prompt_mode: string;         // timecoded_montage, structured_json, etc.
  output_shape: string;        // prompt_card, prose, etc.
  use_cases: string[];         // music-video, teaser, product-ad, references...
  aspect_ratio: string;        // 16:9, 9:16, variable, 2.39:1
  runtime_seconds: number | null;
  evidence_type: string;       // guide_synthesized, community_corroborated...
  confidence: string;          // low | medium | high
  source_count: number;
  source_urls: string[];
  source_notes: string[];
  library_status: string;      // seed_pattern, adapted_template...
  tested_by_us: boolean;
  tags: string[];
  created: string;
  updated: string;
  created_by: string;
  curator: string;
  human_rating?: {
    gordo_score: number | null;
    aesthetic_fit: string;
    production_readiness: string;
  };
  file_path: string;
  body_excerpt: string;
};
```

## 4. The information the UI needs to show

### A. Prompt card browsing

Minimum visible information:
- Title
- Summary / body excerpt
- Model family
- Model targets
- Use cases
- Prompt mode
- Aspect ratio
- Runtime seconds
- Confidence
- Evidence type
- Source count
- Tested by us: yes/no
- Tags
- File path
- Clickable source URLs

Useful derived display fields:
- `model_badges`: rendered from `model_targets`
- `format_badge`: `aspect_ratio + runtime_seconds`
- `evidence_badge`: `evidence_type + confidence`
- `source_health`: source_count and whether URLs are present
- `test_status`: tested/not tested + human rating later

### B. Reference/source browsing

Minimum visible information:
- Repo/source name
- URL
- Description
- Which prompt cards came from it
- Source category: Seedance, Sora, cross-model, general video
- Trust/evidence notes

The user specifically wanted source GitHub links clickable in both card frontmatter and visible body/source evidence sections.

### C. Comparison runs — future, not faked yet

When real Raycast/model answers exist, show:
- Creative brief / question
- Models compared
- Each model's answer/prompt
- Scores/ratings
- Notes from Gordo
- Winner / keep / remix / reject state
- Links to generated videos/images, if any
- Which prompt cards were promoted from the run

Important: UI can design the empty state now, but comparison content must not be invented.

### D. Visual workflow / production readiness

Future panels should support:
- Prompt-card maturity: seed pattern → tested → approved → production-ready
- Media shape: 9:16 / 16:9 / 2.39:1
- Creative use case: music video, product ad, teaser, documentary, style transfer
- Model fit: Seedance vs Sora vs Kling vs Veo
- Evidence confidence
- Gordo human rating

## 5. Suggested IA / screens

### Screen 1 — Library Dashboard

Goal: quick visual overview of the whole library.

Components:
- Top summary stats: total cards, models, sources, tested count
- Model-family distribution
- Use-case cloud/chips
- Recently updated cards
- High-confidence cards
- Untested cards needing real generation

ASCII sketch:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Directors Cut                                       [Search prompt cards...] │
├──────────────────────────────────────────────────────────────────────────────┤
│  Cards 10   Sources 8   Tested 0   Seedance 3   Sora 4   Cross-model 3       │
├───────────────────────┬───────────────────────┬──────────────────────────────┤
│ Model Families         │ Use Cases             │ Needs Attention              │
│ ┌───────────────────┐  │ [teaser] [music]      │ ○ Untested cards: 10         │
│ │ Seedance ███      │  │ [product] [audio]     │ ○ Missing real comparisons   │
│ │ Sora     ████     │  │ [references] [json]   │ ○ Raycast bridge not checked │
│ │ Cross    ███      │  │                       │                              │
│ └───────────────────┘  │                       │                              │
├───────────────────────┴───────────────────────┴──────────────────────────────┤
│ Featured cards                                                               │
│ [Seedance Netflix Teaser] [Sora Audio-First Doc] [Reference Role Ledger]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Screen 2 — Prompt Card Table + Visual Cards

Goal: browse/filter/sort all cards.

Table columns:
- Title
- Family
- Targets
- Use cases
- Prompt mode
- Aspect/runtime
- Confidence
- Sources
- Tested
- Updated

Recommended layout: table on left/top, detail drawer on right/bottom.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Prompt Library                                                               │
│ [family:v] [target:v] [use case:v] [confidence:v] [tested:v] [search...]     │
├──────────────────────────────────────────────────────────────────────────────┤
│ Title                         Family      Use case       Conf   Sources Test │
│ Seedance Netflix Teaser       seedance    teaser         med    3       no   │
│ Sora Audio-First Documentary  sora        audio/doc      med    2       no   │
│ Reference Role Ledger         cross       references     med    3       no   │
│ Modular JSON Shot Spec        cross       json/spec      med    3       no   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Selected card detail                                                         │
│ ┌────────────────────────────────────┬─────────────────────────────────────┐ │
│ │ Summary / excerpt                  │ Evidence + sources                  │ │
│ │ Model targets as badges            │ clickable GitHub links              │ │
│ │ Aspect/runtime badge               │ source notes                         │ │
│ │ Tags/use cases                     │ file path                            │ │
│ └────────────────────────────────────┴─────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Screen 3 — Card Detail Page

Goal: make one prompt card feel like a visual recipe.

Sections:
- Header: title, family, target badges, status, confidence
- What it is for: summary + use cases
- Prompt anatomy: prompt mode, output shape, aspect ratio, runtime
- Evidence: source URLs + source notes
- Body excerpt / full markdown render
- Future: examples, generated outputs, Gordo rating

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Seedance Netflix Teaser Title Slam        [seedance-2.0] [12s] [16:9] [med] │
├──────────────────────────────────────────────────────────────────────────────┤
│ Short proof-of-concept teaser: ominous location → reaction → impact → title. │
├──────────────────────────────┬───────────────────────────────────────────────┤
│ Prompt anatomy               │ Evidence                                      │
│ Mode: timecoded_montage      │ 1. songguoxs/seedance-prompt-skill ↗          │
│ Shape: prompt_card           │ 2. HuyLe82US/awesome-seedance-prompts ↗       │
│ Use: teaser, title-card      │ 3. rich5000/seedance-prompt-guide ↗           │
│ Tags: trailer, audio-hit     │ Notes: timestamp storyboarding + audio cues   │
├──────────────────────────────┴───────────────────────────────────────────────┤
│ Full card markdown / prompt recipe                                           │
│ ...                                                                          │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Screen 4 — Source Map

Goal: show where the library came from.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Source Map                                                                   │
├───────────────────────┬──────────────────────────────┬───────────────────────┤
│ GitHub repo            │ What it contributes           │ Cards using it         │
│ seedance-prompt-skill  │ Seedance timing/audio refs    │ 3 cards               │
│ awesome_sora2_prompt   │ Sora five pillars/audio       │ 4 cards               │
│ awesome-video-prompts  │ JSON prompt blocks            │ 2 cards               │
└───────────────────────┴──────────────────────────────┴───────────────────────┘
```

Nice visual idea: a node map where repos connect to cards.

```text
[seedance-prompt-skill] ─┬─> [Seedance Netflix Teaser]
                         ├─> [Seedance Product Orbit]
                         └─> [Beat-Sync MV Trio]

[awesome_sora2_prompt] ──┬─> [Sora Audio-First Doc]
                         ├─> [Sora Physics Loop]
                         └─> [Reference Role Ledger]
```

### Screen 5 — Comparison Lab Empty State

Goal: prepare for Raycast/model comparison once real outputs exist.

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Comparison Lab                                                               │
├──────────────────────────────────────────────────────────────────────────────┤
│ No real comparison runs captured yet.                                        │
│                                                                              │
│ Next step: capture the same creative brief from Raycast / selected models.   │
│ Do not create fake answers.                                                  │
│                                                                              │
│ [Create comparison from real captured answers]                               │
├──────────────────────────────────────────────────────────────────────────────┤
│ Future layout                                                                │
│ ┌────────────── Creative Brief ───────────────┐                              │
│ ├───────────────┬───────────────┬─────────────┤                              │
│ │ Seedance      │ Sora          │ Kimi/Raycast│                              │
│ │ answer        │ answer        │ answer      │                              │
│ ├───────────────┴───────────────┴─────────────┤                              │
│ │ Gordo notes / ratings / winner / promote    │                              │
│ └─────────────────────────────────────────────┘                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 6. Core component inventory

Recommended components:

```text
AppShell
  SidebarNav
  TopSearchBar
  DashboardStats
  FilterBar
  PromptCardTable
  PromptCardGrid
  PromptCardDetailDrawer
  ModelBadge
  UseCaseChip
  EvidenceBadge
  SourceLinksList
  SourceMapTable
  ComparisonEmptyState
  ComparisonRunViewer        future
  RatingPanel                future
```

Compact styling rules:
- Buttons: small/pill, text-xs or compact text-sm.
- Badges: family color + target text.
- Tables: dense rows, sticky header, sort/filter affordances.
- Detail drawer: rich visual summary so table rows are not overloaded.
- Do not duplicate navigation inside page headers if the sidebar already has it.

## 7. First build scope for tomorrow

Build only what the current data supports:

1. Create Svelte app scaffold in `directors-cut`.
2. Load `public/data/prompt-cards.index.jsonl`.
3. Render dashboard stats.
4. Render filterable/sortable prompt-card table.
5. Render selected-card detail drawer.
6. Render Source Map from `content/references/repos.md` or a generated source index.
7. Add Comparison Lab empty state.
8. Verify with Bun only.

Avoid tomorrow:
- Do not build fake Raycast/model answer content.
- Do not introduce npm/package-lock.
- Do not overbuild auth, database, backend, or cloud deploy yet.

## 8. Questions for Gordo / designer

Open design questions:
- Should the main view feel more like Airtable, Linear, Pindeck, or a trading-card collection?
- Should detail open as right drawer, full page, or bottom panel?
- Should the Source Map be a table first, graph first, or both?
- What rating vocabulary should Gordo use: score 1-10, keep/remix/reject, vibe fit, production-ready?
- Which comparison models should be first-class in the UI: Raycast, Seedance, Sora, Kling, Veo, Kimi?

## 9. One-line handoff to designer

Design a dark, compact, visual command-center for browsing AI video prompt cards: table-first for scanning, card/detail panels for visual comprehension, source-map for trust, and comparison-lab scaffolding for future real Raycast/model outputs.
