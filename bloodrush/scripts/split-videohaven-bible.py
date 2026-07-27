from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
src = (ROOT / "alternate" / "source" / "bloodrush-videohaven-bible.md").resolve()
text = src.read_text(encoding="utf-8")
end = text.find("*End of Video Haven Bible.*")
if end != -1:
    text = text[: end + len("*End of Video Haven Bible.*")] + "\n"

out_dir = ROOT / "docs" / "locations" / "video-haven"
out_dir.mkdir(parents=True, exist_ok=True)

status = (
    "> **Status:** Expanded location bible draft (2001-era inventory, David/Linda Santana ownership). "
    "Current series canon uses **fall 2003** and **Rafael \"Rafa\" Santana** as Kai's uncle/employer. "
    "See `docs/series-bible.md`.\n\n"
)

parts = []
current = []
title_block = []
for line in text.splitlines():
    if line.startswith("## ") and not line.startswith("###"):
        if current:
            parts.append("\n".join(current).strip() + "\n")
        current = [line]
    elif not parts and not current and line.strip() and not line.startswith("---"):
        title_block.append(line)
    else:
        current.append(line)
if current:
    parts.append("\n".join(current).strip() + "\n")

mapping = {
    "## 1. THE SANTANA FAMILY": "rafa-and-kai.md",
    "## 2. THE STORE — Full 2001-Era Inventory": "store-inventory.md",
    "## 3. THE BACKSTORY — Mr. Yoshida and Yuki": "yoshida-yuki.md",
    "## 4. THE HIDDEN TUNNEL ACCESS": "tunnel-access.md",
    "## 5. SEVEN KEY SCENES AT VIDEO HAVEN": "scenes-main.md",
    "## 6. TWO SCENES FROM THE OTHER SIDE OF THE BOND": "scenes-bond.md",
}

overview = status + "\n".join(title_block) + "\n\nSee [README.md](README.md) for the full doc map.\n"
(out_dir / "overview.md").write_text(overview, encoding="utf-8")

for part in parts:
    first_line = part.split("\n", 1)[0].strip()
    fname = mapping.get(first_line)
    if not fname:
        continue
    body = part.split("\n", 1)[1] if "\n" in part else ""
    content = f"{status}# {first_line[3:]}\n\n{body}".strip() + "\n"
    (out_dir / fname).write_text(content, encoding="utf-8")

readme = """# Video Haven — Location Docs

Expanded location bible for **Video Haven**, the coven's distribution hub and Kai's workplace (draft canon: 2001, David/Linda Santana).

| File | Contents |
|------|----------|
| [overview.md](overview.md) | Address, establishment, dual status (store + elixir hub) |
| [rafa-and-kai.md](rafa-and-kai.md) | Rafa Santana ownership; Kai's closing shift |
| [store-inventory.md](store-inventory.md) | Exterior, layout, full VHS/DVD inventory, back office, storage |
| [yoshida-yuki.md](yoshida-yuki.md) | Mr. Yoshida and Yuki backstory |
| [tunnel-access.md](tunnel-access.md) | Trapdoor, 47 steps, cave route, who knows |
| [scenes-main.md](scenes-main.md) | Scenes 1–5 at Video Haven (Ep 1, 3, 8, 10, 12) |
| [scenes-bond.md](scenes-bond.md) | Scenes 6–7 — Yuki/tree bond (Ep 5, 11) |

**Canonical production refs:** `output/environments/video-haven/`, `output/continuity/video-haven/`
"""
(out_dir / "README.md").write_text(readme, encoding="utf-8")
print("Wrote", len(list(out_dir.glob("*.md"))), "files — run reconcile-videohaven-canon.py next")
