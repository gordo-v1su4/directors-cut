#!/usr/bin/env python3
"""Chunk a song into 10–15s Seedance-ready black-screen MP4s with lyric labels.

Uses Whisper phrase boundaries + RMS energy dips to avoid cutting mid-vocal.
Usage:
  uv run --with faster-whisper --with numpy --with scipy scripts/prepare_song_for_seedance.py \\
    "/path/to/song.wav" --out-dir "./my-song-seedance"
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from dataclasses import asdict, dataclass
from pathlib import Path

import numpy as np
from scipy.signal import argrelmin

MIN_CHUNK = 10.0
MAX_CHUNK = 15.0
TARGET_CHUNK = 14.5
VIDEO_SIZE = "1920x1080"
VIDEO_FPS = 30


@dataclass
class Chunk:
    index: int
    start: float
    end: float
    label: str
    filename: str

    @property
    def duration(self) -> float:
        return self.end - self.start


def slugify(text: str, max_len: int = 48) -> str:
    text = text.lower().strip()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text).strip("-")
    if not text:
        return "instrumental"
    return text[:max_len].rstrip("-")


def load_mono_audio(path: Path) -> tuple[np.ndarray, int]:
    proc = subprocess.run(
        ["ffmpeg", "-i", str(path), "-ac", "1", "-f", "f32le", "-"],
        capture_output=True,
        check=True,
    )
    audio = np.frombuffer(proc.stdout, dtype=np.float32)
    sr = 48000
    return audio, sr


def energy_dips(audio: np.ndarray, sr: int) -> list[tuple[float, float]]:
    hop = int(0.05 * sr)
    frame = int(0.1 * sr)
    rms: list[float] = []
    times: list[float] = []
    for i in range(0, len(audio) - frame, hop):
        chunk = audio[i : i + frame]
        rms.append(float(np.sqrt(np.mean(chunk**2))))
        times.append(i / sr)
    rms_arr = np.array(rms)
    kernel = np.ones(5) / 5
    rms_s = np.convolve(rms_arr, kernel, mode="same")
    mins = argrelmin(rms_s, order=20)[0]
    return [(times[m], float(rms_s[m])) for m in mins if times[m] > 0.5]


def transcribe(path: Path) -> tuple[float, list[dict]]:
    from faster_whisper import WhisperModel

    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, info = model.transcribe(str(path), word_timestamps=True)
    out: list[dict] = []
    for seg in segments:
        words = []
        if seg.words:
            for w in seg.words:
                words.append({"word": w.word.strip(), "start": w.start, "end": w.end})
        out.append(
            {
                "start": seg.start,
                "end": seg.end,
                "text": seg.text.strip(),
                "words": words,
            }
        )
    return float(info.duration), out


def build_cut_candidates(
    duration: float,
    segments: list[dict],
    dips: list[tuple[float, float]],
) -> dict[float, float]:
    """Map time -> score (higher = better cut point)."""
    scores: dict[float, float] = {}

    def add(t: float, score: float) -> None:
        t = round(t, 2)
        if 0.5 <= t <= duration - 0.5:
            scores[t] = scores.get(t, 0.0) + score

    for seg in segments:
        add(seg["end"], 12.0)
        add(seg["start"], 4.0)
        for w in seg.get("words", []):
            add(w["end"], 6.0)

    if dips:
        max_rms = max(r for _, r in dips) or 1.0
        for t, r in dips:
            depth = 1.0 - (r / max_rms)
            add(t, 3.0 + depth * 5.0)

    return scores


def words_in_range(segments: list[dict], start: float, end: float) -> str:
    parts: list[str] = []
    for seg in segments:
        if seg["end"] <= start or seg["start"] >= end:
            continue
        if seg["text"]:
            parts.append(seg["text"])
    if parts:
        return " ".join(parts)
    return "instrumental"


def is_mid_word(t: float, segments: list[dict]) -> bool:
    for seg in segments:
        for w in seg.get("words", []):
            if w["start"] + 0.05 < t < w["end"] - 0.05:
                return True
    return False


def plan_chunks(
    duration: float,
    segments: list[dict],
    cut_scores: dict[float, float],
    *,
    min_chunk: float = MIN_CHUNK,
    max_chunk: float = MAX_CHUNK,
    target_chunk: float = TARGET_CHUNK,
) -> list[tuple[float, float]]:
    spans: list[tuple[float, float]] = []
    start = 0.0

    while start < duration - 0.05:
        remaining = duration - start
        if remaining <= max_chunk + 0.01:
            spans.append((start, duration))
            break

        lo = start + min_chunk
        hi = min(start + max_chunk, duration)
        target = start + target_chunk

        best_t = hi
        best_score = -1e9
        for t, base in cut_scores.items():
            if t < lo or t > hi:
                continue
            if is_mid_word(t, segments):
                continue
            proximity = -abs(t - target) * 2.0
            score = base + proximity
            if score > best_score:
                best_score = score
                best_t = t

        if best_score <= -1e8:
            best_t = min(start + target_chunk, duration)

        spans.append((start, best_t))
        start = best_t

    # Merge trailing chunk if too short
    if len(spans) >= 2 and spans[-1][1] - spans[-1][0] < min_chunk:
        prev_start, _ = spans[-2]
        last_end = spans[-1][1]
        spans = spans[:-2] + [(prev_start, last_end)]

    return spans


def render_chunk(
    src: Path,
    out: Path,
    start: float,
    duration: float,
) -> None:
    out.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        "ffmpeg",
        "-y",
        "-ss",
        f"{start:.3f}",
        "-i",
        str(src),
        "-f",
        "lavfi",
        "-i",
        f"color=c=black:s={VIDEO_SIZE}:r={VIDEO_FPS}:d={duration:.3f}",
        "-map",
        "1:v:0",
        "-map",
        "0:a:0",
        "-t",
        f"{duration:.3f}",
        "-c:v",
        "libx264",
        "-pix_fmt",
        "yuv420p",
        "-r",
        str(VIDEO_FPS),
        "-c:a",
        "aac",
        "-b:a",
        "192k",
        "-ar",
        "44100",
        "-movflags",
        "+faststart",
        str(out),
    ]
    subprocess.run(cmd, check=True, capture_output=True)


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("audio", type=Path, help="Input audio file (wav/mp3/flac)")
    ap.add_argument(
        "--out-dir",
        type=Path,
        default=None,
        help="Output folder (default: <repo>/<stem>-seedance-chunks)",
    )
    ap.add_argument("--min", type=float, default=MIN_CHUNK, help="Min chunk seconds")
    ap.add_argument("--max", type=float, default=MAX_CHUNK, help="Max chunk seconds")
    ap.add_argument("--target", type=float, default=TARGET_CHUNK, help="Target chunk seconds")
    ap.add_argument("--no-transcribe", action="store_true", help="Skip Whisper (energy cuts only)")
    args = ap.parse_args()

    min_chunk, max_chunk, target_chunk = args.min, args.max, args.target

    src = args.audio.expanduser().resolve()
    if not src.is_file():
        print(f"Missing audio: {src}", file=sys.stderr)
        return 1

    repo = Path(__file__).resolve().parents[1]
    out_dir = args.out_dir or repo / f"{src.stem.lower().replace(' ', '-')}-seedance-chunks"
    out_dir = out_dir.resolve()
    out_dir.mkdir(parents=True, exist_ok=True)

    print(f"Analyzing {src.name} …")
    audio, sr = load_mono_audio(src)
    duration = len(audio) / sr
    dips = energy_dips(audio, sr)

    segments: list[dict] = []
    if not args.no_transcribe:
        print("Transcribing (Whisper base) …")
        duration, segments = transcribe(src)

    cut_scores = build_cut_candidates(duration, segments, dips)
    spans = plan_chunks(
        duration,
        segments,
        cut_scores,
        min_chunk=min_chunk,
        max_chunk=max_chunk,
        target_chunk=target_chunk,
    )

    chunks: list[Chunk] = []
    used_names: set[str] = set()
    for i, (start, end) in enumerate(spans, start=1):
        label = words_in_range(segments, start, end)
        slug = slugify(label)
        base = f"{i:02d}-{slug}"
        name = base
        n = 2
        while name in used_names:
            name = f"{base}-{n}"
            n += 1
        used_names.add(name)
        chunks.append(
            Chunk(index=i, start=start, end=end, label=label, filename=f"{name}.mp4")
        )

    manifest = {
        "source": str(src),
        "duration": duration,
        "min_chunk": min_chunk,
        "max_chunk": max_chunk,
        "target_chunk": target_chunk,
        "chunk_count": len(chunks),
        "chunks": [asdict(c) | {"duration": c.duration} for c in chunks],
        "transcript_segments": segments,
    }
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print(f"Rendering {len(chunks)} chunks → {out_dir}")
    for c in chunks:
        out_path = out_dir / c.filename
        print(f"  [{c.index:02d}] {c.start:6.2f}–{c.end:6.2f}s ({c.duration:5.2f}s)  {c.label[:60]}")
        render_chunk(src, out_path, c.start, c.duration)

    print(f"\nDone: {len(chunks)} MP4s in {out_dir}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
