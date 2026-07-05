#!/usr/bin/env python3
"""Resize and rename Cursor asset PNGs for Seedance omni_reference image_files order.

Maps to @image_file_1 … @image_file_4 by filename prefix (01…04).

Usage (from repo root):
  uv run --with pillow scripts/export_seedance_refs.py
  uv run --with pillow scripts/export_seedance_refs.py --assets "C:\\path\\to\\assets"
"""

from __future__ import annotations

import argparse
import os
import shutil
import sys
from pathlib import Path

from PIL import Image

MAX_EDGE = 2048
MAX_BYTES = 5 * 1024 * 1024

# Unique substrings from Cursor-export filenames (order = Seedance image_files index).
REF_SPECS: list[tuple[str, str]] = [
    (
        "5811228a-d225-44aa-af3c-42c2f6efa4e9",
        "01_image_file_1_character_design.png",
    ),
    (
        "fcb9b44c-c1d0-4601-a40d-693bbe648437",
        "02_image_file_2_face_knife_closeup.png",
    ),
    (
        "07ed1dbc-3d06-4539-83fd-62c03da4e079-cfcfc857",
        "03_image_file_3_empty_restaurant.png",
    ),
    (
        "4e616ec6-45ca-49cd-ac0d-841404cdc368",
        "04_image_file_4_gang_confrontation.png",
    ),
]


def os_path(p: Path) -> str:
    r"""Windows: extended path for long Cursor filenames."""
    s = str(p.resolve())
    if os.name != "nt" or s.startswith("\\\\?\\"):
        return s
    if len(s) < 220:
        return s
    if s.startswith("\\\\"):
        return "\\\\?\\UNC\\" + s[2:]
    return "\\\\?\\" + s


def find_one(assets: Path, needle: str) -> Path | None:
    matches = [p for p in assets.glob("*.png") if needle in p.name]
    if len(matches) == 1:
        return matches[0]
    if len(matches) > 1:
        matches.sort(key=lambda p: p.stat().st_mtime, reverse=True)
        return matches[0]
    return None


def process_one(src: Path, dest: Path) -> None:
    p_os = os_path(src)
    if not os.path.isfile(p_os):
        raise FileNotFoundError(p_os)
    size = os.path.getsize(p_os)
    with Image.open(p_os) as im:
        im = im.convert("RGBA")
        w, h = im.size
    need_resize = max(w, h) > MAX_EDGE or size > MAX_BYTES
    dest.parent.mkdir(parents=True, exist_ok=True)
    if not need_resize:
        shutil.copy2(p_os, os_path(dest))
        print(f"copy   {dest.name}  {w}x{h}  {size // 1024}KB")
        return
    scale = MAX_EDGE / max(w, h)
    nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
    with Image.open(p_os) as im:
        im = im.convert("RGBA")
        out_im = im.resize((nw, nh), Image.Resampling.LANCZOS)
        out_im.save(os_path(dest), "PNG", optimize=True)
    new_size = dest.stat().st_size
    print(f"resize {dest.name}  {w}x{h} -> {nw}x{nh}  {size // 1024}KB -> {new_size // 1024}KB")


def main() -> int:
    repo = Path(__file__).resolve().parent.parent
    default_assets = Path(
        r"C:\Users\Gordo\.cursor\projects\c-Users-Gordo-Documents-Github-super-seed2\assets"
    )
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument(
        "--assets",
        type=Path,
        default=default_assets,
        help="Cursor workspace assets folder (PNG sources)",
    )
    ap.add_argument(
        "--out",
        type=Path,
        default=repo / "seedance-refs",
        help="Output directory",
    )
    args = ap.parse_args()
    assets: Path = args.assets
    out_dir: Path = args.out
    if not assets.is_dir():
        print(f"Not a directory: {assets}", file=sys.stderr)
        return 1

    for needle, out_name in REF_SPECS:
        src = find_one(assets, needle)
        if src is None:
            print(f"MISSING: no PNG matching substring {needle!r}", file=sys.stderr)
            return 1
        process_one(src, out_dir / out_name)

    print(f"\nDone. image_files order for Seedance: {[t[1] for t in REF_SPECS]}")
    print(f"Folder: {out_dir.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
