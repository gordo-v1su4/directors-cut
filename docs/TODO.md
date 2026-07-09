# Directors Cut — TODO / Tomorrow Pickup

Last updated: 2026-07-09 by omp.

## Milestone status (2026-07-09)

- [x] **B1** — Phase 0 data gap closed (731267e, 6d38545, c2c082c). 10 cards, 10 JSONL entries, schemas valid; comparison run README proposes the first run, blocked on Gordo capturing real Raycast answers.
- [x] **B2** — Thin typed bridge client + artifact handshake doc (731267e). `src/lib/bridge/types.ts` provenance-copied from raycast-pro-bridge `a3671a8`; `docs/bridge-artifact-handshake.md` is the single source both sides cite.
- [x] **B3a** — Phase 1 Svelte 5 visual browser. SvelteKit + Tailwind `--dc-*` tokens; `/` dashboard, `/prompts` table+filters+drawer+copy, `/sources` map. `bun run check` clean; verified 10 cards at http://127.0.0.1:5190.
- [ ] **B3b** — Phase 2 comparison UI (after first real comparison JSONL exists). Capture Script Commands ready in raycast-pro-bridge (`directors-cut-comparison-prompt.sh` + `directors-cut-capture-answer.sh`); waiting on Gordo for real answers. UI requirement captured in `docs/comparison-lab-requirements.md`: compare prompt text, exact model labels, returned answers, Nano Banana Pro 3x3 shot-grid previews, and Sora/Seedance video results, with alter/resend/reference-image next-run actions.

## Ground rules

- User correction: this is `cmux`, not `omx`. Use cmux terminology and cmux capture/send commands when steering peer agents.
- Use Bun for JS/TS in this repo. Do not introduce npm, package-lock, pnpm, or yarn unless the repo explicitly changes direction.
- Do not fabricate Raycast/model comparison answers. Only create comparison runs from real captured answers.
- Repo first; Obsidian after milestones.

## Clean start checklist

1. Inspect repo state:
   ```bash
   cd /root/Github/directors-cut
   git status --short --branch --untracked-files=all
   git pull --ff-only
   ```
2. Verify Phase 0 artifacts:
   ```bash
   bun run scripts/build-index.ts
   bun scripts/validate-schemas.ts
   for f in schemas/*.json; do bun -e "JSON.parse(await Bun.file('$f').text()); console.log('valid schema json: $f')"; done
   find . -maxdepth 3 \( -name package-lock.json -o -name npm-shrinkwrap.json -o -name pnpm-lock.yaml -o -name yarn.lock -o -name package.json \) -print | sort
   ```
3. Confirm the generated index has 10 entries:
   ```bash
   wc -l public/data/prompt-cards.index.jsonl
   ```

## Next work items

### 1. Phase 1 visual browser
- Start from `docs/ui-ux-handoff.md` for the UI/UX schema, information architecture, component inventory, and ASCII wireframes.
- Scaffold the Svelte visual browser only after confirming the 10-card JSONL index is valid.
- Build a simple card table/grid that reads `public/data/prompt-cards.index.jsonl`.
- Add a selected-card detail drawer/panel so the table is visual, not just spreadsheet-like.
- Add a Source Map view from `content/references/repos.md` or a generated source index.
- Add a Comparison Lab empty state, but do not fabricate Raycast/model answers.
- Keep Pindeck-style dark/dense tokens with `--dc-*` variables.
- If using TanStack Table v9 alpha, isolate it behind a wrapper so alpha API churn is contained.

### 2. Raycast bridge follow-up
- `github.com/gordo-v1su4/raycast-pro-bridge` exists on GitHub.
- No local checkout was found at `/root/Github/raycast-pro-bridge` during cleanup.
- Tomorrow: clone or locate it, inspect status, and write a minimal README/status before implementation.
- Do not use `raycast2api`; previous decision was no because of ToS risk.
- Target direction remains: Raycast Pro as creative UI/LLM layer, HTTP MCP bridge over Tailscale, no Ollama/local Mac LLMs.

### 3. Real comparison runs
- Capture real Raycast/model answers for the same creative brief.
- Save them under `content/comparisons/<run-id>/` only after real outputs exist.
- Use `schemas/comparison-run.schema.json` and `schemas/model-answer.schema.json` as the starting shapes.
- Promote only strong answers back into `content/cards/` after review.

### 4. Obsidian milestone note
- After the repo state is pushed and verified, optionally update the Obsidian project map with a concise pointer to:
  - `/root/Github/directors-cut/docs/STATUS.md`
  - `/root/Github/directors-cut/docs/TODO.md`
  - `/root/Github/directors-cut/public/data/prompt-cards.index.jsonl`

## Current Phase 0 artifact inventory

- Cards: 10 Markdown prompt cards under `content/cards/`.
- Schemas: 4 JSON schemas under `schemas/`.
- References: `content/references/repos.md`.
- Index builder: `scripts/build-index.ts`.
- Validation helper: `scripts/validate-schemas.ts`.
- Generated index: `public/data/prompt-cards.index.jsonl`.
