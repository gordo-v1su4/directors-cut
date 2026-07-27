---
name: teaser-series-package
description: >-
  Builds the standard Concept Package after a Netflix/TV series idea or logline
  is accepted in directors-cut/hype-slate. Use when the user accepts an idea,
  asks for the package, wants Stage 3 expansion, or says to lock a series before
  trailers. Produces folder + series card + teaser rules. Does NOT generate image
  grids or Seedance/Sora trailer prompts unless the user explicitly starts Stage 4.
---

# Teaser Series Package

## Purpose

After ideation and picking, turn an accepted series idea into a **repeatable Concept Package** — the same set of docs every time — so Stage 4 (image grids + video trailers) has a locked brief.

This skill owns **Stages 2–3** of the hype-slate pipeline. It does **not** own Seedance/Sora prompting (use `00-seedance-cinematic-trailer` / `01-sora-cinematic-teaser` only after the user calls Stage 4).

## When to use

- User accepts a logline / title from a slate or pick board
- User says “package this,” “expand this,” “Stage 3,” or “lock the concept”
- User wants the standard folder before any generation

## When NOT to use

- Still brainstorming a big slate (Stage 1)
- User only wants a pick board update (Stage 2) with no accept yet
- User asked for Seedance/Sora/image grids without an accepted package (push them to accept first, unless they explicitly override)

## Pipeline (do not skip)

0. **Taste lock** — confirm / restate the user’s taste bullets for this run  
1. **Slate** — already exists or generate options  
2. **Pick** — update `hype-slate/PICK-BOARD.md`  
3. **Accept → Concept Package** ← **this skill**  
4. **Teaser submissions** — image grids + Seedance/Sora — **only on explicit user go**

## Stage 3 — Concept Package (always the same)

Create:

```
hype-slate/<slug>/
  README.md           # what it is / is not, tone, tagline, file map
  series-card.md      # full package (template below)
  trailers/           # folder exists; Stage 4 files wait here
    .gitkeep          # or omit until Stage 4
```

Optional at Stage 3 (only if user already dictated structure, e.g. ChatGPT shot list):

```
  trailers/shot-list.md   # structure + dialogue locks ONLY — not Seedance prompts
```

### Do not create at Stage 3

- `part-01-*.md` / `part-02-*.md` Seedance prompts
- Nano Banana / grid image prompts
- Character sheets, environment seeds, contact sheets

Unless the user explicitly says **Stage 4** / “write the trailer prompts” / “make the grids.”

## series-card.md template (required sections)

Use this exact section set every time:

```markdown
# <TITLE>

## Logline
One sentence.

## Tagline
Short poster line.

## Pertains to brief
Bullets mapping this idea to the user’s stated taste (Breaking Bad / Shonda / Vice / Gen Z / etc.).

## What this is NOT
Anti-premises. Kill the wrong movie in the reader’s head.

## What this IS
The real engine in plain language.

## Pilot engine
The episode-1 machine (e.g. not criminals yet; legal gray zone; accidental discovery).

## Tone
Early → later progression. Keywords.

## Characters
2–5 names/roles with one-line function each.

## World
Place, aesthetic, subculture injection.

## Shonda hook
Misdirect → floor drop (pilot or episode 1 end).

## Breaking Bad pivot
Who becomes the unexpected criminal competence — and why it’s not cartoon evil.

## Season engine
What renews episode to episode (escalation rule).

## Teaser rules
What Part 1 may show / must NOT show. Fame vs guns order, etc.

## Trailer campaign (outline only)
Part titles + emotional jobs. No full shot lists unless user supplied them.

## Status
Stage 3 locked / waiting on pick / ready for Stage 4.
```

## README.md rules

- Lead with the **edit** (NOT vs IS) if the idea is easy to misread as generic crime
- Include tagline, tone table, character locks, world, file map
- Point to `series-card.md`
- State clearly: Stage 4 not started

## Writing standards

- Prefer accidental / entrepreneurial / seductive crime over “dealers from beat one”
- Keep Gen Z surfaces concrete (apps, soft launches, vapes, livestreams, clubs) without turning the package into a PSA
- Vice injection = specific subculture room the audience is dropped into
- Shonda hook must be a **turn**, not a vibe
- Breaking Bad pivot must be a **person + competence + moral math**, not “and then cartel”
- If user pasted a ChatGPT structure, preserve their beats/lines; refine clarity; don’t flatten the engine

## Stage 2 helper (narrowing)

When asked to narrow before accept:

1. Prefer titles that match taste lock over market-wide spectacle
2. Put the strongest 8–12 on `hype-slate/PICK-BOARD.md`
3. Mark any already-expanded title as Stage 3 example
4. Ask user to mark LOVE / MAYBE / PASS — do not invent their picks

## Stage 4 handoff (write this into series-card Status when user is ready)

When user says go:

1. Lock / refine `trailers/shot-list.md`
2. Write Seedance prompts via `00-seedance-cinematic-trailer`
3. Optional Sora pass via `01-sora-cinematic-teaser`
4. Image grid prompts for: product, apartment lab / world, two leads, nightlife, virality UI inserts
5. Keep identity locks consistent across stills → video

## Worked example

`hype-slate/tiktok-drug-dynasty/` — accidental attention-economy narcotic; Part 1 discovery / Part 2 virus; fame before cartel.
