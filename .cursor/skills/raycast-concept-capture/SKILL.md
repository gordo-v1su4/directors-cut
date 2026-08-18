---
name: raycast-concept-capture
description: Capture a Directors Cut comparison run through Raycast using computer use. Opens Raycast AI chat for Sora 2 - ChatGPT and Sora 2 - Haiku, pastes the canonical brief, copies each answer, and persists via directors-cut-capture-answer.sh. Use when the user asks to capture a concept run, automate Raycast capture, or run computer use for Directors Cut.
---

# Raycast Concept Capture (Computer Use)

Automate the Raycast half of the Directors Cut Create flow. The web app creates the run via bridge `create_comparison_run`; this skill drives Raycast with **computer use** and persists answers with the existing Script Command.

## When to use

- User chose **Automated** on `/create` and a run ID was created
- User says: "capture concept run …", "run computer use for Raycast", "get ChatGPT and Claude answers"
- `content/comparisons/<run-id>/capture-request.json` exists with `"workflow": "computer_use"`

## Prerequisites

- Raycast open on the Mac with agents:
  - **Sora 2 - ChatGPT**
  - **Sora 2 - Haiku** (Claude)
- App name is usually `Raycast` or `Raycast Beta` (script auto-detects)
- **Accessibility** granted to Cursor (or Terminal) in System Settings → Privacy & Security → Accessibility — required for computer-use keystrokes
- `raycast-pro-bridge` Script Commands installed
- `DIRECTORS_CUT_PATH` points at the directors-cut checkout
- Bridge running with `DIRECTORS_CUT_PATH` set

## Inputs

1. **run_id** — from Create automated panel or `capture-request.json`
2. Read run metadata:
   - `content/comparisons/<run-id>/comparison-run.md`
   - `content/comparisons/<run-id>/capture-request.json`

## Build the model prompt

Run the existing prompt packager (do not invent a new brief):

```bash
cd "$DIRECTORS_CUT_PATH/../raycast-pro-bridge/script-commands"
DIRECTORS_CUT_PATH="$DIRECTORS_CUT_PATH" \
DIRECTORS_CUT_CLIPBOARD_FILE="/tmp/dc-prompt.txt" \
./directors-cut-comparison-prompt.sh "<run-id>"
```

Read `/tmp/dc-prompt.txt` — that is the exact text to paste into each Raycast agent.

## Automated path (preferred)

After Create calls `create_comparison_run`, the app chains:

1. `prepare_concept_capture` — prompt on clipboard + active run binding
2. `run_concept_capture` — background AppleScript drives Raycast Beta / Raycast, captures both models, persists answers
3. Poll `get_concept_capture_status` — answers appear in Create UI and Projects

No manual Run ID typing. Do **not** use the legacy **Capture Directors Cut Answer** command for automated runs.

## Manual computer use loop (per model)

For each pending model in `capture-request.json` (`ChatGPT`, then `Claude`):

1. **Open Raycast** (Cmd+Space or click dock icon if needed)
2. **Open the Raycast agent** named in `raycast_agent` (e.g. `Sora 2 - ChatGPT`)
3. **Paste** the full prompt from `/tmp/dc-prompt.txt`
4. **Send** and wait until the complete response is visible (scroll if needed)
5. **Select all + copy** the model's full reply
6. **Persist via Script Command** (preferred over hand-editing JSONL):

```bash
DIRECTORS_CUT_PATH="$DIRECTORS_CUT_PATH" \
  ./directors-cut-capture-answer.sh "<ModelLabel>" "<run-id>" sora-2
```

Use exact labels: `ChatGPT` and `Claude`.

7. Verify capture output reports valid `creative_concept_v1` or explicit invalid structure (never rewrite the answer)

## After both models

```bash
cd "$DIRECTORS_CUT_PATH" && bun run build:comparisons
```

Poll bridge status or open Projects:

```bash
curl -s -H "Authorization: Bearer $RAYCAST_BRIDGE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"run_id":"<run-id>"}' \
  http://127.0.0.1:8787/tools/get_concept_capture_status
```

Success: `captured_valid_count: 2`, `run_status: answers_collected`.

## Rules

- Never fabricate or repair model output
- Run ChatGPT then Claude **serially** (clipboard capture)
- If structure is invalid, leave it invalid; user can recapture
- Do not call billable Sora generation unless the user explicitly asks

## Manual fallback

If computer use fails, tell the user to switch Create to **Manual** and use:

1. **Start Directors Cut Concept Run**
2. **Capture Directors Cut Answer** × 2
