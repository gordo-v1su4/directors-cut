#!/usr/bin/env python3
"""Generate visual-storyline reference assets through SwarmUI's /API wrapper.

This script intentionally talks to SwarmUI, not directly to ComfyUI, because on
DESKTOP-Q20UUVD SwarmUI owns the self-starting Comfy backend.
"""
from __future__ import annotations

import argparse
import json
import os
import shutil
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path
from typing import Any

try:
    import yaml  # type: ignore
except Exception:  # pragma: no cover
    yaml = None

DEFAULT_SETTINGS: dict[str, Any] = {
    "model": "Z_Image_Turbo_BF16",
    "images": 1,
    "steps": 9,
    "cfgscale": 1,
    "sampler": "euler",
    "scheduler": "beta",
    "sigmashift": 7,
    "width": 1280,
    "height": 720,
    "negativeprompt": "blurry, low quality, distorted, watermark, text",
    "automaticvae": "true",
    "preferreddtype": "default",
}

SECTIONS = ("character_sheets", "place_backgrounds", "keyframes")


def post_json(host: str, endpoint: str, payload: dict[str, Any], timeout: int = 60) -> dict[str, Any]:
    url = host.rstrip("/") + endpoint
    body = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"}, method="POST")
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        text = resp.read().decode("utf-8", errors="replace")
    return json.loads(text)


def get_session(host: str) -> str:
    data = post_json(host, "/API/GetNewSession", {}, timeout=30)
    return data["session_id"]


def get_logs(host: str, sid: str) -> dict[str, Any]:
    return post_json(
        host,
        "/API/ListRecentLogMessages",
        {"session_id": sid, "types": ["Error", "Warning", "Info", "Debug", "ComfyUI-0"], "last_sequence_ids": {}},
        timeout=30,
    )


def health(host: str) -> dict[str, Any]:
    sid = get_session(host)
    status = post_json(host, "/API/GetCurrentStatus", {"session_id": sid}, timeout=30)
    backends = post_json(host, "/API/ListBackends", {"session_id": sid, "full_data": True}, timeout=30)
    return {"session_id": sid, "status": status, "backends": backends}


def load_plan(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    if path.suffix.lower() == ".json":
        return json.loads(text)
    if yaml is None:
        raise SystemExit("PyYAML is required for YAML files. Run with: uv run --with pyyaml scripts/swarmui_storyline_generate.py ...")
    data = yaml.safe_load(text)
    if not isinstance(data, dict):
        raise SystemExit(f"Plan must parse to a mapping: {path}")
    return data


def parse_resolution(item: dict[str, Any], settings: dict[str, Any]) -> tuple[int, int]:
    if "width" in item and "height" in item:
        return int(item["width"]), int(item["height"])
    res = item.get("resolution") or settings.get("resolution")
    if isinstance(res, str) and "x" in res.lower():
        left, right = res.lower().split("x", 1)
        return int(left), int(right)
    return int(settings.get("width", DEFAULT_SETTINGS["width"])), int(settings.get("height", DEFAULT_SETTINGS["height"]))


def iter_items(plan: dict[str, Any]):
    for section in SECTIONS:
        for item in plan.get(section, []) or []:
            if not isinstance(item, dict):
                raise SystemExit(f"Every item in {section} must be a mapping")
            yield section, item


def build_payload(sid: str, item: dict[str, Any], settings: dict[str, Any]) -> dict[str, Any]:
    merged = dict(DEFAULT_SETTINGS)
    merged.update(settings or {})
    merged.update({k: v for k, v in item.items() if k in DEFAULT_SETTINGS or k in {"model", "steps", "cfgscale", "sampler", "scheduler", "sigmashift", "negativeprompt", "seed", "presets", "loras", "loraweights"}})
    width, height = parse_resolution(item, merged)
    payload: dict[str, Any] = {
        "session_id": sid,
        "prompt": item["prompt"],
        "images": int(merged.get("images", 1)),
        "width": width,
        "height": height,
    }
    for key, val in merged.items():
        if key in {"width", "height", "resolution"}:
            continue
        payload[key] = val
    if "seed" not in payload:
        payload["seed"] = -1
    if "presets" in item:
        payload["presets"] = item["presets"]
    return payload


def download_swarm_image(host: str, image_ref: str, dest: Path, timeout: int = 90) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    if image_ref.startswith("data:"):
        raise SystemExit("Data-URL image responses are not implemented yet")
    # Swarm returns paths such as
    # View/local/raw/YYYY-MM-DD/0738001-cinematic keyframe, ... .png
    # Encode spaces/commas/etc. but preserve path separators.
    quoted_ref = urllib.parse.quote(image_ref.lstrip("/"), safe="/")
    url = host.rstrip("/") + "/" + quoted_ref
    with urllib.request.urlopen(url, timeout=timeout) as resp, dest.open("wb") as out:
        shutil.copyfileobj(resp, out)
    if dest.stat().st_size <= 0:
        raise RuntimeError(f"Downloaded empty file: {dest}")


def generate(host: str, plan_path: Path, output_root: Path, timeout: int, dry_run: bool = False) -> list[dict[str, Any]]:
    plan = load_plan(plan_path)
    settings = plan.get("generation_settings", {}) or {}
    # Keep dry-runs offline so CI and planning checks do not require a live
    # SwarmUI desktop service. Real generation still obtains a Swarm session.
    sid = "dry-run-session" if dry_run else get_session(host)
    results: list[dict[str, Any]] = []
    for section, item in iter_items(plan):
        if "prompt" not in item:
            raise SystemExit(f"Missing prompt in {section} item: {item.get('id') or item.get('name')}")
        save_as = Path(item.get("save_as") or f"outputs/{section}/{item.get('id') or item.get('name') or int(time.time())}.png")
        if not save_as.is_absolute():
            save_as = output_root / save_as
        payload = build_payload(sid, item, settings)
        record = {"section": section, "id": item.get("id"), "name": item.get("name"), "save_as": str(save_as), "payload": payload}
        if dry_run:
            results.append({**record, "status": "dry-run"})
            continue
        started = time.time()
        try:
            response = post_json(host, "/API/GenerateText2Image", payload, timeout=timeout)
        except TimeoutError:
            logs = get_logs(host, sid)
            raise SystemExit(f"Generation timed out after {timeout}s. Recent logs:\n{json.dumps(logs, indent=2)[:8000]}")
        except urllib.error.URLError as exc:
            logs = get_logs(host, sid)
            raise SystemExit(f"Generation request failed: {exc}. Recent logs:\n{json.dumps(logs, indent=2)[:8000]}")
        if "error" in response:
            raise SystemExit(f"SwarmUI returned error for {item.get('id')}: {response['error']}")
        images = response.get("images") or []
        if not images:
            raise SystemExit(f"SwarmUI returned no images for {item.get('id')}: {response}")
        download_swarm_image(host, images[0], save_as)
        results.append({**record, "status": "generated", "elapsed_sec": round(time.time() - started, 2), "swarm_image": images[0], "bytes": save_as.stat().st_size})
    return results


def list_presets(host: str) -> dict[str, Any]:
    sid = get_session(host)
    data = post_json(host, "/API/GetMyUserData", {"session_id": sid}, timeout=60)
    presets = data.get("presets", [])
    return {"count": len(presets), "presets": [{"title": p.get("title"), "param_map": p.get("param_map")} for p in presets]}


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--host", default=os.environ.get("SWARMUI_HOST", "http://127.0.0.1:7861"))
    sub = parser.add_subparsers(dest="cmd", required=True)
    sub.add_parser("health")
    sub.add_parser("presets")
    gen = sub.add_parser("generate")
    gen.add_argument("plan", type=Path)
    gen.add_argument("--output-root", type=Path, default=Path.cwd())
    gen.add_argument("--timeout", type=int, default=300)
    gen.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.cmd == "health":
        print(json.dumps(health(args.host), indent=2))
    elif args.cmd == "presets":
        print(json.dumps(list_presets(args.host), indent=2))
    elif args.cmd == "generate":
        print(json.dumps(generate(args.host, args.plan, args.output_root, args.timeout, args.dry_run), indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
