"""Word timestamps + energy peaks for a Seedance chunk MP4."""
import argparse
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from faster_whisper import WhisperModel
from scipy.io import wavfile
from scipy.signal import find_peaks


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("mp4", type=Path)
    args = parser.parse_args()

    wav_path = Path(tempfile.gettempdir()) / f"{args.mp4.stem}_analyze.wav"
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(args.mp4), "-vn", "-ac", "1", "-ar", "22050", str(wav_path)],
        check=True,
        capture_output=True,
    )

    sr, audio = wavfile.read(wav_path)
    audio = audio.astype(np.float32) / np.iinfo(audio.dtype).max
    duration = len(audio) / sr

    hop = 512
    frame = sr // 20
    rms = []
    for i in range(0, len(audio) - frame, hop):
        chunk = audio[i : i + frame]
        rms.append(np.sqrt(np.mean(chunk**2)))
    rms = np.array(rms)
    times = np.arange(len(rms)) * hop / sr
    peaks, _ = find_peaks(rms, height=np.percentile(rms, 70), distance=int(0.35 * sr / hop))
    peak_times = [round(float(times[p]), 2) for p in peaks]

    print(f"duration_sec={duration:.3f}")
    print(f"energy_peaks={peak_times}")

    model = WhisperModel("base", device="cpu", compute_type="int8")
    segments, info = model.transcribe(str(args.mp4), word_timestamps=True, language="en")
    print(f"whisper_duration={info.duration:.3f}")
    print("words:")
    for seg in segments:
        if seg.words:
            for w in seg.words:
                print(f"  {w.start:6.2f}-{w.end:6.2f}  {w.word.strip()!r}")
        elif seg.text.strip():
            print(f"  {seg.start:6.2f}-{seg.end:6.2f}  {seg.text.strip()!r}")


if __name__ == "__main__":
    main()
