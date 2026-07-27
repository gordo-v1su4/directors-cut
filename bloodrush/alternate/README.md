# Blood Rush — Alternate / Source Archive

The **PLEDGE (2001)** development dump was merged into the fall **2003** canon in July 2026.

| Merged into | From PLEDGE draft |
|-------------|-------------------|
| `docs/season-1-outline.md` | 12-ep RUSH/BLEED/BELONG, Council, amber tree arc |
| `docs/locations/video-haven/` | Store inventory, tunnel, Yoshida/Yuki, scene beats (reconciled to Rafa / 2003) |
| `docs/characters.md` | Yoshida, Yuki, Council |
| `docs/series-bible.md` | Owl's Nest, Underneath, Sigma Phi basement |
| `prompts/marketing/` | Key art poster prompts |
| `prompts/trailers/cold-open-neon-gothic/` | Optional montage teaser |

**Raw source files:** [`source/`](source/) — unedited `doc.md` and `bloodrush-videohaven-bible.md` from the original dump.

Re-split / reconcile after editing sources:

```powershell
uv run python bloodrush/scripts/split-videohaven-bible.py
uv run python bloodrush/scripts/split-doc-dump.py
uv run python bloodrush/scripts/reconcile-videohaven-canon.py
```
