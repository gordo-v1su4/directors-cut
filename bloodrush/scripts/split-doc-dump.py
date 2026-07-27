from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
src = (ROOT / "alternate" / "source" / "doc.md").resolve()
text = src.read_text(encoding="utf-8")
lines = text.splitlines()

CANON_NOTE = (
    "> **Status:** Extracted from development dump. Dating says **2001** — align to **2003** "
    "and current cast in `docs/series-bible.md` where applicable.\n\n"
)


def find_line(*, startswith: str | None = None, contains: str | None = None) -> int:
    for i, line in enumerate(lines):
        if startswith is not None and line.startswith(startswith):
            return i
        if contains is not None and contains in line:
            return i
    raise ValueError(f"Line not found: startswith={startswith!r} contains={contains!r}")


def save_json_line(path: Path, raw: str) -> dict | None:
    try:
        obj = json.loads(raw)
        path.write_text(json.dumps(obj, indent=2), encoding="utf-8")
        return obj
    except json.JSONDecodeError:
        path.with_suffix(".raw.json").write_text(raw, encoding="utf-8")
        return None


# --- Marketing posters ---
poster_v1_start = find_line(startswith="MAIN KEY ART POSTER")
poster_v2_start = find_line(startswith="VERTICAL MOVIE POSTER")
poster_end = find_line(contains="I've loaded both skills")

marketing_dir = ROOT / "prompts" / "marketing"
marketing_dir.mkdir(parents=True, exist_ok=True)

v1 = "\n".join(lines[poster_v1_start:poster_v2_start]).strip()
v2 = "\n".join(lines[poster_v2_start:poster_end]).strip()

for name, body, title in [
    ("key-art-poster-v1-teal.md", v1, "Variant A — Cool teal-blue base"),
    ("key-art-poster-v2-crimson.md", v2, "Variant B — Crimson/black, walking toward camera"),
]:
    (marketing_dir / name).write_text(
        f"# BLOODRUSH — Key Art Poster Prompts\n\n{CANON_NOTE}## {title}\n\n```text\n{body}\n```\n",
        encoding="utf-8",
    )

(marketing_dir / "README.md").write_text(
    """# Marketing Prompts

| File | Description |
|------|-------------|
| [key-art-poster-v1-teal.md](key-art-poster-v1-teal.md) | Tight medium three-shot, teal moodboard |
| [key-art-poster-v2-crimson.md](key-art-poster-v2-crimson.md) | Walking-toward-camera, blood moon, A24/NEON logos |
| [key-art-poster.md](key-art-poster.md) | Combined reference (legacy) |
""",
    encoding="utf-8",
)

# --- Neon Gothic teaser ---
teaser_dir = ROOT / "prompts" / "trailers" / "cold-open-neon-gothic"
pipeline_dir = teaser_dir / "pipeline"
pipeline_dir.mkdir(parents=True, exist_ok=True)

dramaturg_line = lines[find_line(startswith='{"mode_recommendation"')]
save_json_line(pipeline_dir / "dramaturg-analysis.json", dramaturg_line)

director_line = lines[find_line(contains='"treatment_locked"')]
director = save_json_line(pipeline_dir / "director-treatment.json", director_line)

style_text = ""
shot_plan_lines: list[str] = []
for i, line in enumerate(lines):
    if line.startswith("Visual Style:"):
        style_text = line.replace("Visual Style:", "").strip()
    if line.startswith("Shot Plan (4 clips"):
        j = i + 1
        while j < len(lines) and lines[j].strip() and not lines[j].startswith("1 answer"):
            shot_plan_lines.append(lines[j])
            j += 1

(teaser_dir / "visual-style-lock.md").write_text(
    f"""# Neon Gothic — Visual Style Lock

{CANON_NOTE}{style_text}

## Approved parameters

- Aspect: 2.39:1 anamorphic
- Grade: bruised magentas, cyan/morgue-blue shadows, sodium-amber pockets
- Camera: erratic handheld → dead-still final stare
- Faces: lit from below or behind — never safely
- Motif: molten-gold eyes + black tear; flicker/buzz → silence contrast
- Controlling idea: belonging as contagious gaze — panic becomes craving
""",
    encoding="utf-8",
)

(teaser_dir / "shot-plan.md").write_text(
    """# Neon Gothic Cold Open — Shot Plan (~40s)

| Clip | Duration | Function |
|------|----------|----------|
| 1 | 8s | Cold open + infection trigger — quad silhouettes → ECU molten-gold eye |
| 2 | 9s | Bathroom panic — mirror lag → black tear |
| 3 | 13s | Coven beat-drop montage — bar, motel, party, rooftop leap |
| 4 | 10s | Ritual surge + silence stare + title |

"""
    + "\n".join(f"- {l.strip()}" for l in shot_plan_lines if l.strip())
    + "\n",
    encoding="utf-8",
)

clip_names = {
    1: "clip-01-infection",
    2: "clip-02-bathroom",
    3: "clip-03-coven",
    4: "clip-04-ritual-title",
}

for i, line in enumerate(lines):
    if not line.startswith('{"clip_n":'):
        continue
    clip = json.loads(line)
    n = clip["clip_n"]
    stem = clip_names[n]
    (teaser_dir / f"{stem}.json").write_text(json.dumps(clip, indent=2), encoding="utf-8")
    (teaser_dir / f"{stem}.md").write_text(
        f"""# Clip {n} — {clip.get('function', clip_names[n])}

**Duration:** {clip['duration']}s  
**Closing shot:** {clip.get('closing_shot', '—')}

## Seedance prompt (copy-paste)

```text
{clip['prompt_text']}
```
""",
        encoding="utf-8",
    )

if director:
    treatment = director["treatments"][0]
    (teaser_dir / "director-treatment.md").write_text(
        f"""# Director Treatment — {treatment['title']}

{CANON_NOTE}**Logline:** {treatment['logline']}

**POV:** {treatment['pov_strategy']}

**Ending stance:** {treatment['ending_stance']}

**Motif:** {treatment['motif']}

**Bold image:** {treatment['bold_image']}

## User-facing pitch

{treatment['user_facing']}
""",
        encoding="utf-8",
    )

# --- Season archive (skip if merged outline exists) ---
merged_outline = ROOT / "docs" / "season-1-outline.md"
if not merged_outline.exists():
    season_start = find_line(startswith="BLOODRUSH — Season 1: PLEDGE")
    season_text = "\n".join(lines[season_start:]).strip()
    merged_outline.write_text(
        f"""# BLOODRUSH — Season 1: PLEDGE (Draft Outline)

{CANON_NOTE}Partially superseded by `docs/series-bible.md` (2003, Rafa Santana, revised cast).

{season_text}
""",
        encoding="utf-8",
    )

(teaser_dir / "README.md").write_text(
    """# Cold Open — Neon Gothic Teaser

> Alternate montage-style teaser (~40s). Current recommended pilot opening: rooftop → Video Haven in `docs/cold-open-tests.md`.

## Creative

| File | Contents |
|------|----------|
| [creative-brief.md](creative-brief.md) | Beat-by-beat treatment (original 12s structure, expanded to ~40s) |
| [visual-style-lock.md](visual-style-lock.md) | Approved Neon Gothic look |
| [shot-plan.md](shot-plan.md) | 4-clip breakdown |
| [director-treatment.md](director-treatment.md) | Locked treatment "Freshman Infection" |

## Seedance clips (copy-paste prompts)

| File | Duration |
|------|----------|
| [clip-01-infection.md](clip-01-infection.md) | 8s |
| [clip-02-bathroom.md](clip-02-bathroom.md) | 9s |
| [clip-03-coven.md](clip-03-coven.md) | 13s |
| [clip-04-ritual-title.md](clip-04-ritual-title.md) | 10s |

Machine-readable: `clip-0N-*.json` alongside each `.md`.

## Pipeline artifacts

| File | Contents |
|------|----------|
| [pipeline/dramaturg-analysis.json](pipeline/dramaturg-analysis.json) | Characters, locations, arc structure (or `.raw.json` if unparseable) |
| [pipeline/director-treatment.json](pipeline/director-treatment.json) | Locked treatment metadata |
| [seedance-production-pack.md](seedance-production-pack.md) | Legacy combined pack |
""",
    encoding="utf-8",
)

print("doc.md split complete — run reconcile-videohaven-canon.py if Video Haven sources changed")
