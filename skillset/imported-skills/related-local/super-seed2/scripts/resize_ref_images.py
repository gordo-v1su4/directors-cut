#!/usr/bin/env python3
"""Resize reference PNGs for Seedance / xskill image_urls when oversized.

Resizes when longest edge > MAX_EDGE or file size > MAX_BYTES; otherwise copies as-is.
Usage:
  uv run --with pillow scripts/resize_ref_images.py <src_dir> <out_dir>
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


def os_path(p: Path) -> str:
    r"""Windows: use \\?\ extended path so long Cursor asset names work."""
    s = str(p.resolve())
    if os.name != "nt" or s.startswith("\\\\?\\"):
        return s
    if len(s) < 220:
        return s
    if s.startswith("\\\\"):
        return "\\\\?\\UNC\\" + s[2:]
    return "\\\\?\\" + s


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("src_dir", type=Path, help="Folder of input PNGs")
    ap.add_argument("out_dir", type=Path, help="Output folder (created if missing)")
    args = ap.parse_args()
    src_dir: Path = args.src_dir
    out_dir: Path = args.out_dir
    if not src_dir.is_dir():
        print(f"Not a directory: {src_dir}", file=sys.stderr)
        return 1
    out_dir.mkdir(parents=True, exist_ok=True)
    pngs = sorted(src_dir.glob("*.png"))
    if not pngs:
        print(f"No PNG files in {src_dir}")
        return 0
    for p in pngs:
        p_os = os_path(p)
        if not os.path.isfile(p_os):
            print(f"skip (missing) {p.name}", file=sys.stderr)
            continue
        try:
            size = os.path.getsize(p_os)
        except OSError as e:
            print(f"skip {p.name}: {e}", file=sys.stderr)
            continue
        with Image.open(p_os) as im:
            im = im.convert("RGBA")
            w, h = im.size
        need_resize = max(w, h) > MAX_EDGE or size > MAX_BYTES
        dest = out_dir / p.name
        if not need_resize:
            shutil.copy2(p_os, os_path(dest))
            print(f"copy  {p.name}  {w}x{h}  {size // 1024}KB")
            continue
        scale = MAX_EDGE / max(w, h)
        nw, nh = max(1, int(w * scale)), max(1, int(h * scale))
        with Image.open(p_os) as im:
            im = im.convert("RGBA")
            out_im = im.resize((nw, nh), Image.Resampling.LANCZOS)
            out_im.save(os_path(dest), "PNG", optimize=True)
        new_size = dest.stat().st_size
        print(f"resize {p.name}  {w}x{h} -> {nw}x{nh}  {size // 1024}KB -> {new_size // 1024}KB")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
