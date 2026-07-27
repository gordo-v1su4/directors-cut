"""Reconcile merged Video Haven docs to fall 2003 / Rafa Santana canon."""
from pathlib import Path

VH = Path(__file__).resolve().parents[1] / "docs" / "locations" / "video-haven"

STATUS = (
    "> **Canon:** Fall 2003. Video Haven owned by Rafael \"Rafa\" Santana (Kai's maternal uncle). "
    "Merged from PLEDGE development draft — cast names in scene beats use current bible where noted.\n\n"
)

CAST_MAP = [
    ("Blaise", "Lucian"),
    ("Dare", "Rowan"),
    ("Rourke", "Malachi"),
    ("Sloane", "Malik"),
    ("Vic", "Elias"),
]

REPLACEMENTS = [
    ("David and Linda", "Rafa"),
    ("David & Linda", "Rafa"),
    ("David's", "Rafa's"),
    ("Linda's", "Rafa's"),
    ("Linda ", "Rafa "),
    ("Linda,", "Rafa,"),
    ("Linda.", "Rafa."),
    ("David ", "Rafa "),
    ("David,", "Rafa,"),
    ("David.", "Rafa."),
    ("David:", "Rafa:"),
    ("your parents", "your uncle"),
    ("Your parents", "Your uncle"),
    ("Kai's parents", "Kai's uncle Rafa"),
    ("the Santanas don't know", "Rafa doesn't know"),
    ("Santanas don't know", "Rafa doesn't know"),
    ("2001-Era Inventory", "2003-Era Inventory"),
    ("The year is 2001", "The year is 2003"),
    ("September 2001", "September 2003"),
    ("Fall 2001", "Fall 2003"),
    ("2001,", "2003,"),
    ("2001)", "2003)"),
    ("2001 —", "2003 —"),
    ("2001.", "2003."),
    ("2001-era", "2003-era"),
    ("2001 era", "2003 era"),
    ("set in 2001", "set in 2003"),
    ("THIS FALL 2001", "THIS FALL 2003"),
    ("WELCOME FRESHMEN RUSH 2001", "WELCOME FRESHMEN 2003"),
    ("Dare's brand", "Malachi's brand"),
]

INVENTORY_2003 = """- **Current new releases (September 2003):**
  - *Pirates of the Caribbean: The Curse of the Black Pearl* (2003) — 3 copies, 2 always out
  - *Finding Nemo* (2003) — 2 copies
  - *The Matrix Reloaded* (2003) — 1 copy, perpetually on hold
  - *X2* (2003) — 2 copies
  - *Hulk* (2003) — 1 copy
  - *2 Fast 2 Furious* (2003) — 4 copies, always out
  - *The Italian Job* (2003) — 2 copies
  - *Freddy vs. Jason* (2003) — 1 copy
  - *Terminator 3: Rise of the Machines* (2003) — 2 copies
  - *Scary Movie 3* (2003) — 1 copy"""

for path in VH.glob("*.md"):
    text = path.read_text(encoding="utf-8")
    if text.startswith("> **Status:**") or text.startswith("> **Canon:**"):
        text = text.split("\n\n", 1)[-1]
    for old, new in REPLACEMENTS:
        text = text.replace(old, new)
    for old, new in CAST_MAP:
        text = text.replace(old, new)
    if path.name == "store-inventory.md":
        import re
        text = re.sub(
            r"- \*\*Current new releases \(September 2003\):\*\*.*?(?=\n- \*\*The DVD section\*\*)",
            INVENTORY_2003 + "\n",
            text,
            flags=re.DOTALL,
        )
        text = text.replace(
            "*The Lord of the Rings: The Fellowship of the Ring* (2001)",
            "*The Lord of the Rings: The Return of the King* (2003)",
        )
    path.write_text(STATUS + text.lstrip(), encoding="utf-8")

# Replace santana-family with rafa-and-kai
sf = VH / "santana-family.md"
if sf.exists():
    sf.unlink()

(VH / "rafa-and-kai.md").write_text(
    STATUS
    + """# Rafael "Rafa" Santana and Kai

### Rafael "Rafa" Santana (born ~1958)

Kai's maternal uncle. Practical, tired, decent. Grew up in Veridian and took over Video Haven from his father in the mid-1990s. He gave Kai the closing shift after football collapsed — partly charity, partly trust, partly because Kai is the only employee he believes will actually lock up.

Rafa knows the store has strange customers. He knows some tapes go missing and reappear. He knows the back room sometimes smells wrong. He chalks it up to college kids and old plumbing. He is not curious enough to risk the one stable thing in his nephew's life.

- Runs the front counter some nights; refuses to upgrade the NCR register
- Keeps a framed photo of Kai at 8, holding a stack of movies
- Finds empty amber vials in the return slot; assumes they're from the smoothie shop next door

### Kai "Hoodie" Santana (born 1984)

Works closing — roughly 9 PM to midnight. Rafa trusts him with keys, the alarm, and the security feed. Kai genuinely helps the business while slowly realizing the store is a distribution node for the amber suppressant.

- Notices hollow tape cases, after-hours coven traffic, vials behind dead stock
- Starts collecting vials before he understands what they are
- Uses the rear staff room for crew meetings without Rafa's knowledge

**Rule for production:** Rafa never learns the supernatural truth in season 1. The store stays cover and emotional anchor.
""",
    encoding="utf-8",
)

readme = """# Video Haven — Location Bible

Kai's workplace, the coven's distribution hub, and the trapdoor entrance to the campus tunnel network. Fall 2003.

| File | Contents |
|------|----------|
| [overview.md](overview.md) | Address, establishment, dual status |
| [rafa-and-kai.md](rafa-and-kai.md) | Rafa Santana ownership; Kai's closing shift |
| [store-inventory.md](store-inventory.md) | Exterior, layout, full VHS/DVD inventory, back office |
| [yoshida-yuki.md](yoshida-yuki.md) | Mr. Yoshida and Yuki backstory |
| [tunnel-access.md](tunnel-access.md) | Trapdoor, cave route, who knows |
| [scenes-main.md](scenes-main.md) | Scenes 1–5 at Video Haven (season arc beats) |
| [scenes-bond.md](scenes-bond.md) | Scenes 6–7 — Yuki/tree bond |

**Production refs:** `output/environments/video-haven/`, `output/continuity/video-haven/`
"""
(VH / "README.md").write_text(readme, encoding="utf-8")

overview = STATUS + """# Video Haven — Overview

**Address:** 2147 Veridian Avenue, corner of Palm Drive. Low-slung brick building with a faded red awning, sandwiched between a laundromat and a Thai restaurant that's been "coming soon" since 1997.

**Established:** 1978 — bought by Rafa Santana's father. Rafa took over in the mid-1990s.

**Status:** A legitimate family video store — rentals, candy, community regulars. Also: a neutral-ground distribution hub for the amber suppressant that keeps campus vampires from tearing each other apart. **Rafa does not know the second part.**

**Sign:** Canonical exterior neon reads `VIDEO HAVEN` (red cursive; the **V** flickers in humid weather).

See [README.md](README.md) for the full doc map.
"""
(VH / "overview.md").write_text(overview, encoding="utf-8")
print("Reconciled", len(list(VH.glob("*.md"))), "Video Haven files")
