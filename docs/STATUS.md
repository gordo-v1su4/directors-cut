# Directors Cut — Session Status & Handoff

> **Last updated:** 2026-07-02 by omp (Oh My Pi)
> **Purpose:** If omp's session cuts off, Hermes or the user can pick up from here.

## Current state

### Repos created (both private on GitHub)
- `github.com/gordo-v1su4/directors-cut` — creative consumer (prompt library, workflows, Svelte visual browser)
- `github.com/gordo-v1su4/raycast-pro-bridge` — Raycast Pro layer (MCP bridge, AI Commands, Agents, Script Commands)

### Plan written
- `docs/directors-cut-deep-dive-plan.md` — 1003-line plan authored by Hermes
- Covers: prompt-card schema, Obsidian structure, multi-agent comparison flow, Svelte 5 visual browser, Raycast/Hermes consumption, build phases 0-5
- Hermes updated plan: **repo first, Obsidian after milestones** (not Obsidian first)

### Skills updated
- `~/.codex/skills/svelte-frontend/SKILL.md` — updated with July 2026 cutting-edge Svelte (const tags, SvelteKit config in vite.config, TanStack Table v9, official sveltejs/ai-tools best practices)
- Hermes patched its own skills: `agent-notebook-project-ops` and `obsidian-vault-curator` — repo-first documentation rule

### Hermes state
- Session: 162K/272K context (59% used), ~2h 38m runtime
- Skills loaded: seedance-director, teaser-trailer-screenplay, agent-notebook-project-ops, obsidian-vault-curator
- Idle at prompt, ready for next task

### omp state
- No hard token cap set (uncapped)
- Model: opencode-go/glm-5.2
- Spent: ~553K tokens

## Key decisions made
1. Two repos, not one: `raycast-pro-bridge` (Raycast layer) + `directors-cut` (creative consumer)
2. No Ollama — user explicitly refused local models
3. No `raycast2api` — ToS violation risk
4. HTTP MCP bridge on RackNerd5 over Tailscale (not stdio)
5. Hybrid storage: Markdown canonical in repo, JSONL index for app
6. Library-first build order: prove creative loop before plumbing
7. Repo-first, Obsidian-after-milestones (Hermes updated this mid-session)
8. Svelte 5 with runes preferred for the visual browser
9. TanStack Table v9 Svelte adapter (alpha), isolated behind wrapper component
10. Pindeck-style dark/dense visual tokens (--dc-* prefix)

## Next action: Phase 0

**Goal:** Prove the creative loop before any plumbing. No app, no bridge.

**Deliverables:**
1. Repo folder structure in `directors-cut/` (not Obsidian first)
2. `schemas/prompt-card.schema.json` + `comparison-run.schema.json` + `model-answer.schema.json`
3. 5-10 Markdown prompt cards (3 Seedance, 2 Sora, 1 cross-model Netflix teaser)
4. `scripts/build-index.ts` — parses frontmatter, emits `public/data/prompt-cards.index.jsonl`
5. One comparison run folder with manually collected answers

**Who does what:**
- **Hermes:** research Seedance/Sora Netflix teaser prompt patterns from GitHub + web, write 5-10 draft cards with evidence grading, write schema JSON files. Has seedance-director and teaser-trailer-screenplay skills loaded.
- **omp:** scaffold repo structure (`content/`, `schemas/`, `scripts/`, `public/data/`), write `build-index.ts`, generate first JSONL index, commit and push.
- **After milestone:** update Obsidian with concise project map note pointing to repo.

## Key files
- Plan: `docs/directors-cut-deep-dive-plan.md`
- Obsidian copy: `hermes-notebook-vault/04-Projects/Directors Cut/Directors Cut Deep-Dive Plan.md`
- Pindeck style ref: `~/Documents/Github/pindeck/style.md`
- Seedance skill (omp): `skill://seedance2-director`
- Seedance skill (Hermes): `seedance-director`
- Trailer skill (Hermes): `teaser-trailer-screenplay`
- Svelte skill: `~/.codex/skills/svelte-frontend/SKILL.md`

## If picking up from scratch
1. Read `docs/directors-cut-deep-dive-plan.md` in this repo (the full plan)
2. Read this STATUS.md for where we are
3. Check Hermes pane: `cmux capture-pane --surface surface:2 | tail -30`
4. Phase 0 is the next action — delegate research to Hermes, scaffold repo to omp
