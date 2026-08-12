# Directors Cut — Session Status & Handoff

> **Last updated:** 2026-07-03 by Hermes
> **Purpose:** Prevent duplicated agent work and make the Phase 0 handoff explicit.

## Current reality — 2026-07-29

- The Svelte app is built and running at `http://127.0.0.1:5190`; the older Phase 0 notes below are retained as historical context.
- Main navigation: Create, Home, Library, Projects, Techniques, Sources.
- Create accepts an idea, format, duration, model targets, audio direction, and a local image reference. It can produce a copyable prompt-agent request, but no AI prompt service is connected and nothing is persisted as a new project yet.
- Projects currently indexes two real comparison runs. THE PINK ROOM has two ingested Sora videos and a pending Seedance artifact; the older Sora Vice run contains prompt candidates but its attempted media generation was blocked by the configured account's billing limit.
- Project media previews, version UI, reference strips, and the lightbox exist. Vision scoring and keep/remix/reject/resend remain UI-only placeholders.
- The experimental Techniques page lives on `codex/camera-moves-pilot` at `/pilots/camera-moves`. It contains 12 foundational camera-move placeholders and 12 static specialty-shot placeholders, with Seedance and LTX-2.3 positioned as its prompt targets.
- Deferred: Angle Lab / LTX-2.3 CrossView contact-sheet generation. Revisit in late August 2026 after the IC-LoRA workflow matures; see `docs/TODO.md`.
- Best next product milestone: connect Create to a real prompt-generation endpoint, persist its output as a project/run, and make that new run appear in Projects without manual JSONL editing.

## Current state

### Repos created (both private on GitHub)
- `github.com/gordo-v1su4/directors-cut` — creative consumer (prompt library, workflows, Svelte visual browser)
- `github.com/gordo-v1su4/raycast-pro-bridge` — Raycast Pro layer (MCP bridge, AI Commands, Agents, Script Commands)

Notes:
- `directors-cut` is the active repo on this host: `/root/Github/directors-cut`.
- `raycast-pro-bridge` exists on GitHub, but no local checkout was found at `/root/Github/raycast-pro-bridge` during this handoff cleanup. Clone/inspect it tomorrow before assuming any Raycast implementation exists.

### Plan written
- `docs/directors-cut-deep-dive-plan.md` — 1003-line plan authored by Hermes
- Covers: prompt-card schema, Obsidian structure, multi-agent comparison flow, Svelte 5 visual browser, Raycast/Hermes consumption, build phases 0-5
- Current build order: **repo first, Obsidian after milestones**

### Phase 0 status

Phase 0 prompt-library baseline is complete and merged on top of `origin/main`, except for optional/manual Raycast comparison answers.

Delivered in `directors-cut/`:
1. Prompt-card Markdown library under `content/cards/`
   - 3 Seedance cards
   - 4 Sora cards
   - 3 cross-model cards
   - 10 total cards
2. Schema drafts under `schemas/`
   - `prompt-card.schema.json`
   - `prompt-pack.schema.json`
   - `comparison-run.schema.json`
   - `model-answer.schema.json`
3. Bun-native index builder
   - `scripts/build-index.ts`
   - Usage: `bun run scripts/build-index.ts`
   - No npm/package-lock workflow should be introduced unless the repo explicitly changes direction.
4. Generated browser index
   - `public/data/prompt-cards.index.jsonl`
   - Includes card frontmatter, body excerpt, file path, `source_urls`, and `source_notes`
5. GitHub reference index
   - `content/references/repos.md`

Not done / intentionally deferred:
- No Raycast model answers were invented. A comparison run folder should only be created once real Raycast/model answers exist.
- No Svelte app scaffold yet; Phase 1 starts from the real cards and JSONL index.
- No local `raycast-pro-bridge` checkout was present on this host during cleanup; inspect/clone tomorrow.
- Obsidian mirror should be updated after this repo commit/push if a project-map milestone note is desired.

### Verification run

Use Bun only:

```bash
cd /root/Github/directors-cut
bun run scripts/build-index.ts
bun scripts/validate-schemas.ts
for f in schemas/*.json; do bun -e "JSON.parse(await Bun.file('$f').text()); console.log('valid schema json: $f')"; done
find . -maxdepth 3 \( -name package-lock.json -o -name npm-shrinkwrap.json -o -name pnpm-lock.yaml -o -name yarn.lock -o -name package.json \) -print | sort
```

Expected current result:
- 10 prompt cards found
- 10 JSONL index entries written
- schema/card/index validation passes
- all schema JSON files parse successfully
- no npm/yarn/pnpm/package-lock artifacts found

## Key decisions made
1. Two repos, not one: `raycast-pro-bridge` (Raycast layer) + `directors-cut` (creative consumer)
2. No Ollama — user explicitly refused local models
3. No `raycast2api` — ToS violation risk
4. HTTP MCP bridge on RackNerd5 over Tailscale (not stdio)
5. Hybrid storage: Markdown canonical in repo, JSONL index for app
6. Library-first build order: prove creative loop before plumbing
7. Repo-first, Obsidian-after-milestones
8. Svelte 5 with runes preferred for the visual browser
9. TanStack Table v9 Svelte adapter (alpha), isolated behind wrapper component
10. Pindeck-style dark/dense visual tokens (`--dc-*` prefix)
11. Use Bun for JS/TS work here. Do not introduce npm/package-lock unless the repo explicitly requires it.
12. Terminology correction: user meant `cmux`, not `omx`. Use cmux wording/commands unless a file or running process explicitly says OMX/OMP.

## Key files
- Plan: `docs/directors-cut-deep-dive-plan.md`
- Status: `docs/STATUS.md`
- Tomorrow TODO: `docs/TODO.md`
- References: `content/references/repos.md`
- Cards: `content/cards/`
- Schemas: `schemas/`
- Index builder: `scripts/build-index.ts`
- Generated index: `public/data/prompt-cards.index.jsonl`
- Seedance skill (Hermes): `seedance-director`
- Trailer skill (Hermes): `teaser-trailer-screenplay`
- cmux steering skill (Hermes): `cmux-agent-steering`

## If picking up from scratch tomorrow
1. Read `docs/directors-cut-deep-dive-plan.md` for the full roadmap.
2. Read this `STATUS.md` and `docs/TODO.md` for current state.
3. Do **not** ask Kimi/GLM/another agent to redo Phase 0; inspect the current repo first.
4. Run the Bun verification block above.
5. Start Phase 1 only after confirming the real cards render from `public/data/prompt-cards.index.jsonl`.
6. For Raycast work, first clone/inspect `github.com/gordo-v1su4/raycast-pro-bridge`; do not assume the local repo already exists.

## cmux / peer-agent inspection note

If another agent is working in cmux, inspect before steering:

```bash
cmux capture-pane --surface surface:1 | tail -30
# or
cmux capture-pane --surface surface:2 | tail -30
```

To steer/take over, send a concise message into the same surface:

```bash
cmux send --surface surface:1 'HERMES - I am taking over. Stop editing and leave the worktree as-is.'
cmux send-key --surface surface:1 enter
```
