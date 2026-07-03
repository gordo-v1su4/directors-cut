# GitHub Prompt Repository References

> Curated list of GitHub repos mined for Seedance/Sora prompt patterns.
> Each card in `content/cards/` should link back to the repo(s) it was adapted from.
> The visual browser will display these as clickable references.

## Seedance Prompt Repos

| Stars | Repo | Description |
|-------|------|-------------|
| 2135 | [songguoxs/seedance-prompt-skill](https://github.com/songguoxs/seedance-prompt-skill) | Seedance 2.0 prompt skill — generates Seedance 2.0 video prompts. Most starred. |
| 53 | [HuyLe82US/awesome-seedance-prompts](https://github.com/HuyLe82US/awesome-seedance-prompts) | Seedance 2.0 prompt vault & resource hub for high-fidelity AI video generation. Curated, proven templates. |
| 21 | [marsoyang1/awesome-seedance-prompts](https://github.com/marsoyang1/awesome-seedance-prompts) | 20+ curated templates, complete shot scripts, GitHub preview. Seedance 2.0 creator resource. |
| 16 | [rich5000/seedance-prompt-guide](https://github.com/rich5000/seedance-prompt-guide) | Comprehensive prompt engineering guide for ByteDance Seedance 2.0. |
| 6 | [seedanceprompts/seedance-prompts](https://github.com/seedanceprompts/seedance-prompts) | Curated Seedance 2.0 prompt resources — repos, galleries, tools, guides, and creators. |
| 3 | [thoxakihiko/seedance-prompt-forge](https://github.com/thoxakihiko/seedance-prompt-forge) | Build structured video prompts for Seedance and other text-to-video models (Kling, Runway, Veo). |
| 3 | [xigua0626/tiktok-ugc-seedance](https://github.com/xigua0626/tiktok-ugc-seedance) | Ecommerce products + TikTok reference → UGC scripts + Seedance prompts. |
| 0 | [gptimage2prompts/seedance-prompt-documentation](https://github.com/gptimage2prompts/seedance-prompt-documentation) | High-performing Seedance prompts for cinematic videos, ads, UGC, and storytelling. |

## Sora Prompt Repos

| Stars | Repo | Description |
|-------|------|-------------|
| 223 | [zhangchenchen/awesome_sora2_prompt](https://github.com/zhangchenchen/awesome_sora2_prompt) | Awesome Sora 2 prompts. Most starred Sora-specific prompt repo. |
| 100 | [xjpp22/awesome--sora-prompts](https://github.com/xjpp22/awesome--sora-prompts) | Visual Style Prompt and Editing Style Prompt for Sora AI. |
| 28 | [hr98w/awesome-sora-prompts](https://github.com/hr98w/awesome-sora-prompts) | Curated prompts aimed at maximizing Sora effectiveness for video generation. |
| 22 | [awesome-sora/awesome-sora](https://github.com/awesome-sora/awesome-sora) | Awesome list of interesting topics on Sora. |
| 18 | [awesome-sora/awesome-sora-zh](https://github.com/awesome-sora/awesome-sora-zh) | Sora Chinese guide — prompting, application development, curated resources. |
| 17 | [ZeroLu/awesome-sora2](https://github.com/ZeroLu/awesome-sora2) | Best prompts, guides and resources for Sora 2. |
| 9 | [LinkedSea/Awesome-Sora2](https://github.com/LinkedSea/Awesome-Sora2) | Curated Sora 2 AI video content — tutorials, prompt engineering, style demos, business insights. |

## General Video Prompt Repos (cross-model)

| Stars | Repo | Description |
|-------|------|-------------|
| 557 | [songguoxs/awesome-video-prompts](https://github.com/songguoxs/awesome-video-prompts) | Awesome Veo3/Veo3.1/Kling/Hailuo video prompts. Same author as seedance-prompt-skill. |
| 133 | [ilkerzg/awesome-video-prompts](https://github.com/ilkerzg/awesome-video-prompts) | General video prompt collection. |
| 12 | [Semonxue/awesome-video-prompts](https://github.com/Semonxue/awesome-video-prompts) | Video prompt collection. |
| 5 | [khanof89/awesome-video-prompts](https://github.com/khanof89/awesome-video-prompts) | Curated prompts for Runway Gen-2, Pika Labs, and other text-to-video models. |
| 38 | [bleedline/Awesome-Sora-Wrappers](https://github.com/bleedline/Awesome-Sora-Wrappers) | Awesome AI-wrapper ecosystem around Sora. |

## Priority for Phase 0 Mining

1. **songguoxs/seedance-prompt-skill** (2135★) — highest signal Seedance repo
2. **songguoxs/awesome-video-prompts** (557★) — cross-model, same trusted author
3. **zhangchenchen/awesome_sora2_prompt** (223★) — highest signal Sora repo
4. **HuyLe82US/awesome-seedance-prompts** (53★) — curated proven templates
5. **xjpp22/awesome--sora-prompts** (100★) — visual + editing style prompts
6. **rich5000/seedance-prompt-guide** (16★) — comprehensive engineering guide

## How cards should reference these

In each prompt card YAML frontmatter:
```yaml
source_urls:
  - https://github.com/songguoxs/seedance-prompt-skill
  - https://github.com/HuyLe82US/awesome-seedance-prompts
source_notes:
  - Camera push pattern adapted from songguoxs/seedance-prompt-skill template #3
  - Evidence structure matches HuyLe82US community-corroborated format
```

In each card body Source evidence section:
```markdown
## Source evidence
- [seedance-prompt-skill](https://github.com/songguoxs/seedance-prompt-skill) — template #3, camera push pattern
- [awesome-seedance-prompts](https://github.com/HuyLe82US/awesome-seedance-prompts) — community-corroborated format
```