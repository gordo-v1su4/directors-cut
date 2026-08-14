# Directors Cut Raycast → Sora Vertical Slice Plan

> **For Hermes:** Execute with `subagent-driven-development`: implementer → spec review → quality review for each task.

**Goal:** Turn one brief into two real Raycast concept packages (ChatGPT and Claude), persist them as repo-backed artifacts, submit one 12-second Sora prompt per model, and review the resulting videos in Directors Cut.

**Architecture:** Directors Cut remains the canonical artifact store and visual review app. Raycast Pro is the first model surface; Script Commands capture real outputs without token replay or pretending Raycast is an API. The existing `raycast-pro-bridge` and Hermes automate persistence/indexing and optional generation handoff. Markdown/JSONL are canonical; `public/data` is generated.

**Stack:** SvelteKit/Svelte 5, TypeScript, Bun, Raycast Script Commands, Hono/Zod bridge, Hermes, Sora via the existing Higgsfield workflow with manual fallback.

---

## Confirmed decisions

- Priority A: **Create → prompt generation → saved project → visible in Projects**.
- Then D: attach real Sora artifacts and review them.
- First model pair: **ChatGPT + Claude through Raycast**.
- Each model returns: title, one-sentence logline, 1–2 sentence hook/summary, and exactly one open-ended high-paced **12-second Sora prompt**.
- Generate both videos; review the videos rather than selecting a text winner first.
- Persist to Markdown/JSONL and rebuild indexes automatically.
- First creative lane: young adults 18–28; festival season, drugs, friendship/identity, plot twists, true-event/crime-story texture, life before AI/2000s, with slight future/fantasy/period freedom.
- Prompt should define dramatic engine, sensory world, pace, sound/music and a few essential moments without rigidly enumerating every shot.
- Creative profile begins compact: Creative Director; Story Producer; integrated Writer/Prompt/Sound-Music Designer; Brutal Review Critic. No editor role in v1—the video is the submission.

## Constraints

- Bun only; no npm/pnpm/yarn.
- Never fabricate model answers, media, URLs, labels, or provenance.
- No Raycast bearer-token replay/API spoofing.
- Ask Gordo before billable generation.
- No secrets in browser bundles or repo.
- No unexplained redesign.
- Browser QA required.

---

# Pre-flight gates

## Gate 0A — Protect Directors Cut work

Repo: `/Users/robertspaniolo/Documents/Github/directors-cut`

Current branch: `codex/camera-moves-pilot`.

Observed dirty files include `src/app.css`, `src/app.html`, `CardDrawer.svelte`, `HoverVideoPreview.svelte`, `MediaLightbox.svelte`, `TopNav.svelte`, layout, comparisons, create, and prompts routes—about 1,460 additions. Do not reset, overwrite, or auto-format these changes.

Before implementation:

1. Identify ownership and review the current app.
2. Commit/stash only with owner approval, or select an explicit clean base.
3. Create an isolated branch/worktree such as `feat/raycast-sora-vertical-slice`.

## Gate 0B — Protect bridge work

Repo: `/Users/robertspaniolo/Documents/Github/raycast-pro-bridge`.

It is ahead of origin and contains modified/untracked image-grid and Hermes-dispatch work. Preserve it. Commit or branch it intact before changes.

## Gate 0C — Owner-writable execution

The remote macOS account `hermes` can read the repos but cannot write or run Svelte checks that create temporary files. Use an owner-writable local worker/worktree or a narrow approved collaboration mechanism. Never silently change ownership of the user’s checkout.

---

# Milestone 1 — Artifact contract and validation

## Task 1: Type the creative concept package

**Files**
- Modify `src/lib/types/comparison.ts`
- Modify `schemas/model-answer.schema.json`
- Create `scripts/test-creative-concept-package.ts`

Add:

```ts
interface CreativeConceptPackage {
  title: string;
  logline: string;
  summary: string;
  sora_prompt: string;
  runtime_seconds: 12;
  prompt_count: 1;
}
```

Persist under `ModelAnswer.structured_prompt`, preserving the verbatim response in `answer_text`.

Validation:
- all four text fields non-empty
- `runtime_seconds === 12`
- `prompt_count === 1`
- parse failure preserves raw output and marks structure repair required

TDD:

```bash
bun scripts/test-creative-concept-package.ts
bun scripts/validate-schemas.ts
bun run check
```

## Task 2: Validate JSONL rows

**Files**
- Modify `scripts/validate-schemas.ts`
- Create `scripts/test-validate-comparison-jsonl.ts`

The current validator compiles `model-answer.schema.json` but never validates `answers.jsonl`. Add line-by-line validation with file/line errors. Add prompt/artifact validation when schemas are available.

---

# Milestone 2 — First canonical run brief

## Task 3: Create the run

Create under `content/comparisons/<run-id>/`:

```text
comparison-run.md
answers.jsonl
prompts.jsonl
artifacts.jsonl
media/
```

Canonical brief:

> Create an original streaming-series concept for viewers 18–28: a plot-twist-driven, music-forward crime/slice-of-life adventure around festival season, drugs, friendship, identity, and life before AI. Favor the 2000s, but allow a slight future, fantasy, or period inflection if it creates a stronger world. Feel culturally current without copying an existing show, person, scandal, or protected IP. The deliverable is one high-paced 12-second Sora sizzler that grabs immediately and suggests a longer teaser or series.

Model output contract:

```text
TITLE
...

LOGLINE
...

HOOK
...

SORA PROMPT — 12 SECONDS
<exactly one prompt>
```

Record ChatGPT and Claude as requested models before capture.

---

# Milestone 3 — Raycast capture loop

## Task 4: Generalize the prompt Script Command

**Repo:** `raycast-pro-bridge`

**Files**
- Modify `script-commands/directors-cut-comparison-prompt.sh`
- Create/modify Script Command tests
- Update README/STATUS

Replace hard-coded `THE GLASS HOUSE` text with run-aware behavior:
1. choose/accept a run ID
2. read `comparison-run.md`
3. copy its canonical question
4. print requested model pair and next step

Raycast command: **Directors Cut — Copy Current Brief**.

## Task 5: Capture and structure each answer

**Files**
- Modify `script-commands/directors-cut-capture-answer.sh`
- Create `scripts/parse-concept-package.ts`
- Add tests

Behavior:
1. accept exact model label + run ID
2. read clipboard
3. preserve verbatim `answer_text`
4. parse sections into `structured_prompt`
5. append atomically
6. prevent duplicate same run/model/content captures
7. mark run `answers_collected` when both models exist
8. trigger or clearly request deterministic index rebuild

Initial legitimate Raycast workflow:
1. Copy Current Brief
2. choose ChatGPT, paste/send, copy response, Capture Answer
3. choose Claude, paste/send, copy response, Capture Answer

Assign optional hotkeys after manual success. Avoid fragile GUI automation first.

---

# Milestone 4 — Create → persistence → Projects

## Task 6: Add a server-side run-creation boundary

The app currently uses `adapter-static`; never place bridge tokens in client code. Preferred v1: a narrow localhost bridge tool `create_comparison_run`. Alternative: a SvelteKit server route only if deployment intentionally stops being static.

Likely files:
- `raycast-pro-bridge/src/contracts/tools.ts`
- `raycast-pro-bridge/src/server.ts`
- `raycast-pro-bridge/src/dispatch/hermes.ts`
- canonical contract sync into `directors-cut/src/lib/bridge/types.ts`
- `directors-cut/src/routes/create/+page.svelte`

Input: brief, requested models, target, runtime, format. Output: run ID + saved paths. The browser must not supply arbitrary filesystem paths.

## Task 7: Show the run in Projects automatically

**Files**
- `src/routes/create/+page.svelte`
- `src/lib/data/comparisons.ts`
- `scripts/build-comparisons-index.ts`
- Create `scripts/test-build-comparisons-index.ts`

Flow:
1. Create returns run ID.
2. Index rebuild completes.
3. Navigate to `/comparisons?run=<run-id>` or detail route.
4. Show pending ChatGPT/Claude rows.
5. After capture/rebuild, show both real packages.

No manual editing of `public/data`.

---

# Milestone 5 — Two Sora submissions

## Task 8: Generation-readiness gate

Require:
- two requested/captured models
- one structured Sora prompt per answer
- exactly 12 seconds
- non-empty title/logline/hook
- explicit approval before billable submission

Add badges: `Ready for Sora`, `Needs structure repair`, `Submitted`.

## Task 9: Discover and use existing Sora/Higgsfield path

1. Inspect actual tool surface/credentials without exposing secrets.
2. Run a non-billable health/capability check.
3. If configured, present two pending submissions and request approval.
4. Otherwise provide **Copy Sora Prompt** and **Open Submission Workflow**.
5. Do not silently substitute another video model.

Persist exact submitted prompts in `prompts.jsonl`, linked to each `answer_id`.

## Task 10: Ingest real videos

Add real files under `content/comparisons/<run-id>/media/` and rows to `artifacts.jsonl` with truthful provider, `answer_id`, `prompt_id`, paths, and status.

Verify:

```bash
bun run build:comparisons
bun scripts/validate-schemas.ts
bun run check
bun run build
```

---

# Milestone 6 — Video-only review

## Task 11: Focused two-video review mode

Likely files:
- `src/routes/comparisons/+page.svelte`
- `src/lib/components/ComparisonTable.svelte`
- `src/lib/components/MediaLightbox.svelte`
- Create `src/lib/components/VideoIdeaReview.svelte`

Controls:
- Keep
- Iterate
- Extend into longer teaser
- Reject
- note: what surprising idea should be developed?

Do not add an editor timeline. Persist review state as repo-backed data. Show provenance but keep the videos primary. Load poster/thumbnail first and only one active video player.

---

# Milestone 7 — Creative team profile

## Task 12: Create a Directors Cut creative profile after the vertical slice works

Possible profile name: `directors-cut` or `creative-room`.

Roles:
1. Creative Director — premise, tone, visual world, cultural hook
2. Story Producer — title, logline, plot engine, stakes, twists
3. Integrated Writer / Sora Prompt / Sound-Music Designer — writes the one final 12-second artifact as image+motion+pacing+sound+music+title
4. Brutal Review Critic — keep/iterate/extend/kill; no flattery

Model routing:
- Raycast Pro where legitimately useful
- ChatGPT and Claude as primary concept models
- direct Kimi/HyperCute/OpenCode Zen/free-credit routes for added exploration
- paid OpenCode Go only if free/direct routes are unsuitable

Artifacts:
- profile `SOUL.md`
- project-context pointer to Directors Cut
- focused creative/video/music/critique skills
- wake phrase only after default profile switching is stable

---

# Release gates

**Data:** every answer is verbatim; every structured package traces to raw answer; every video traces to one answer + exact prompt; rebuild deterministic.

**Security:** no client secrets; no arbitrary file-write API; no token replay; no secret logging.

**Cost:** capability check; explicit approval immediately before Sora submission; maximum two initial submissions unless scope expands.

**Quality:** validators, `bun run check`, `bun run build`, real-browser desktop/mobile QA, spec review before quality review.

**Git:** isolated branch/worktree; no dirty work overwritten; small task commits; review before push/merge.

---

# Recommended execution order

1. Protect both dirty worktrees.
2. Add concept type and JSONL validation.
3. Create first canonical run brief.
4. Generalize Raycast copy/capture commands.
5. Capture real ChatGPT + Claude packages.
6. Rebuild and display them in Projects.
7. Connect `/create` to safe run creation.
8. Check Sora/Higgsfield capability; ask approval.
9. Generate or manually submit both prompts.
10. Ingest both real videos.
11. Add Keep/Iterate/Extend/Reject review.
12. Build the compact creative-team profile.
13. Final integration review, browser QA, then commit/push with approval.

# Definition of done

- One brief creates a canonical run.
- Same brief reaches ChatGPT and Claude through Raycast.
- Both responses are captured verbatim and structured.
- Run appears in Projects without manual `public/data` edits.
- One 12-second prompt per model is submitted to Sora.
- Two real videos attach to the correct answers.
- Gordo can Keep, Iterate, Extend, or Reject each with a note.
- Tests/check/build/browser QA pass.
- No dirty work lost; no fabricated output.