# Hype Slate Pipeline

How we go from “ChatGPT brainstorm energy” → accepted series idea → teaser package.

**Stop line for this phase:** Stages 0–3 only.  
Do **not** generate image grids or Seedance/Sora trailer prompts until the user explicitly says to start Stage 4.

---

## Stage 0 — Taste lock

Capture what the user actually wants (not the whole market).

Example lock from this chat:

- Netflix series (not films / commercials)
- Gen Z surface + Vice subculture injection
- Breaking Bad moral engines (ordinary competence → impossible underground)
- Shonda hooks (misdirect → floor drop)
- Music / nightlife / high society / war-on-drugs grit welcome
- Accidental / entrepreneurial crime > “we’re drug dealers” from minute one
- Revivals / time-passed scenes OK
- Vampires already covered elsewhere → skip unless asked

**Output:** short taste bullet list in the pick board or skill run notes.

---

## Stage 1 — Slate

Generate a pile of options against the taste lock (+ optional market signals).

**Output:** `concepts/*.md` slate files.

Current slates:

- `concepts/00-INDEX.md` — original wide 40 (parked)
- `concepts/series-gen-z-vice.md` — active Gen Z / Vice / Netflix pass (20)

---

## Stage 2 — Narrow / pick

Cut to a board the user can actually choose from.

**Output:** [`PICK-BOARD.md`](PICK-BOARD.md)

User marks: `LOVE` / `MAYBE` / `PASS`  
Target: **1–3 LOVE** (or a top 10 if still exploring).

---

## Stage 3 — Accept → Concept Package

When the user accepts a logline / idea, run the **teaser-series-package** skill.

**Output folder:** `hype-slate/<slug>/`

Always includes the same package (see skill). Expand the idea, show how it pertains to the brief, lock teaser rules — **no generation prompts yet**.

Worked example in progress: [`tiktok-drug-dynasty/`](tiktok-drug-dynasty/)

---

## Stage 4 — Teaser submissions *(later — do not start yet)*

Only after Concept Package is accepted:

1. Image creation grids (look / characters / product / world)
2. Seedance (and optional Sora) trailer prompts from locked shot list
3. Review / selects / revisions

Uses existing skills:

- `skillset/00-seedance-cinematic-trailer`
- `skillset/01-sora-cinematic-teaser`
- visual-storyline / nano-banana workflows as needed

---

## One-line summary

**Slate → Pick → Package → (later) Grids + Trailers.**
