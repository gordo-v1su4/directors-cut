import json
import os
import sys
import time
import uuid
import urllib.parse
import urllib.request
from pathlib import Path

COMFY = "http://127.0.0.1:7821"
REF = Path(r"C:\Users\Gordo\Documents\Github\visual-storyline-pipeline-gordo\outputs\fang_smoke\fang_swarmui_basic_smoke_01.png")
OUTDIR = Path(r"C:\Users\Gordo\Documents\Github\visual-storyline-pipeline-gordo\outputs\qwen2511_workflow")
OUTDIR.mkdir(parents=True, exist_ok=True)

PROMPT = (
    "Preservation-first cinematic image edit. Use the person/character from the input image as the same main character; "
    "keep the exact same face identity, facial structure, expression anchors, hairstyle, hair color, wardrobe silhouette, body proportions, and overall likeness. "
    "Move that same character into a moody underground club / secret lair environment: concrete walls, low ceiling, haze in the air, practical red and violet club lights, "
    "thin shafts of blue backlight, reflections on wet black floor, silhouettes and equipment kept soft in the background. "
    "The character is the clear dominant subject in a cinematic medium shot, looking like a frame from a high-end crime-thriller film. "
    "Improve only photoreal cinematic detail, coherent skin and eyes, integrated lighting on the face and clothing, anamorphic lens texture, subtle film grain, rich contrast, "
    "natural depth of field, highlight rolloff, and atmospheric haze. Keep it looking like the same character from the reference image, not a redesign."
)
NEGATIVE = (
    "different person, redesigned face, changed hairstyle, changed hair color, changed clothing silhouette, extra main character, duplicate face, text, watermark, logo, caption, "
    "cartoon, anime, illustration, plastic skin, over-smoothed skin, deformed face, bad eyes, bad hands, blurry, noisy artifacts, low quality"
)


def request_json(path, data=None, timeout=30):
    url = COMFY + path
    if data is None:
        with urllib.request.urlopen(url, timeout=timeout) as r:
            return json.loads(r.read().decode("utf-8"))
    body = json.dumps(data).encode("utf-8")
    req = urllib.request.Request(url, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read().decode("utf-8"))


def upload_image(path: Path):
    boundary = "----HermesBoundary" + uuid.uuid4().hex
    filename = path.name
    data = path.read_bytes()
    parts = []
    parts.append(f"--{boundary}\r\n".encode())
    parts.append(f'Content-Disposition: form-data; name="image"; filename="{filename}"\r\n'.encode())
    parts.append(b"Content-Type: image/png\r\n\r\n")
    parts.append(data)
    parts.append(b"\r\n")
    parts.append(f"--{boundary}\r\n".encode())
    parts.append(b'Content-Disposition: form-data; name="type"\r\n\r\ninput\r\n')
    parts.append(f"--{boundary}--\r\n".encode())
    body = b"".join(parts)
    req = urllib.request.Request(COMFY + "/upload/image", data=body, headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode("utf-8"))


def build_prompt(image_name):
    # API translation of Comfy's official image_qwen_image_edit_2511 workflow, using the installed 2511 FP8 model
    # and 4-step Lightning LoRA for a fast smoke test.
    return {
        "41": {"class_type": "LoadImage", "inputs": {"image": image_name}},
        "160": {"class_type": "FluxKontextImageScale", "inputs": {"image": ["41", 0]}},
        "161": {"class_type": "UNETLoader", "inputs": {"unet_name": "qwenEdit2511FP8_v10.safetensors", "weight_dtype": "default"}},
        "145": {"class_type": "ModelSamplingAuraFlow", "inputs": {"model": ["161", 0], "shift": 3.1}},
        "152": {"class_type": "CFGNorm", "inputs": {"model": ["145", 0], "strength": 1.0}},
        "153": {"class_type": "LoraLoaderModelOnly", "inputs": {"model": ["152", 0], "lora_name": "Qwen-Image-Edit-2511-Lightning-4steps-V1.0-bf16.safetensors", "strength_model": 1.0}},
        "146": {"class_type": "VAELoader", "inputs": {"vae_name": "qwen_image_vae.safetensors"}},
        "162": {"class_type": "CLIPLoader", "inputs": {"clip_name": "qwen_2.5_vl_7b_fp8_scaled.safetensors", "type": "qwen_image"}},
        "151": {"class_type": "TextEncodeQwenImageEditPlus", "inputs": {"clip": ["162", 0], "vae": ["146", 0], "image1": ["160", 0], "prompt": PROMPT}},
        "149": {"class_type": "TextEncodeQwenImageEditPlus", "inputs": {"clip": ["162", 0], "vae": ["146", 0], "image1": ["160", 0], "prompt": NEGATIVE}},
        "148": {"class_type": "FluxKontextMultiReferenceLatentMethod", "inputs": {"conditioning": ["151", 0], "reference_latents_method": "index_timestep_zero"}},
        "147": {"class_type": "FluxKontextMultiReferenceLatentMethod", "inputs": {"conditioning": ["149", 0], "reference_latents_method": "index_timestep_zero"}},
        "156": {"class_type": "VAEEncode", "inputs": {"pixels": ["160", 0], "vae": ["146", 0]}},
        "169": {"class_type": "KSampler", "inputs": {"model": ["153", 0], "positive": ["148", 0], "negative": ["147", 0], "latent_image": ["156", 0], "seed": 61380601, "steps": 4, "cfg": 1.0, "sampler_name": "euler", "scheduler": "simple", "denoise": 1.0}},
        "158": {"class_type": "VAEDecode", "inputs": {"samples": ["169", 0], "vae": ["146", 0]}},
        "9": {"class_type": "SaveImage", "inputs": {"images": ["158", 0], "filename_prefix": "vsp_qwen2511_underground_club_lora100"}},
    }


def main():
    print("Reference:", REF)
    up = upload_image(REF)
    print("Uploaded:", up)
    image_name = up.get("name") or REF.name
    prompt = build_prompt(image_name)
    client_id = str(uuid.uuid4())
    resp = request_json("/prompt", {"prompt": prompt, "client_id": client_id}, timeout=60)
    print("Queued:", resp)
    pid = resp["prompt_id"]
    started = time.time()
    while True:
        hist = request_json("/history/" + pid, timeout=30)
        if pid in hist:
            item = hist[pid]
            status = item.get("status", {})
            print("Status:", status)
            if not status.get("completed", False):
                raise SystemExit("Prompt returned incomplete history: " + json.dumps(item)[:2000])
            outputs = item.get("outputs", {})
            saved = []
            for node, out in outputs.items():
                for img in out.get("images", []):
                    qs = urllib.parse.urlencode({"filename": img["filename"], "subfolder": img.get("subfolder", ""), "type": img.get("type", "output")})
                    url = COMFY + "/view?" + qs
                    dest = OUTDIR / img["filename"]
                    with urllib.request.urlopen(url, timeout=60) as r:
                        dest.write_bytes(r.read())
                    saved.append(str(dest))
            print(json.dumps({"prompt_id": pid, "elapsed_sec": round(time.time()-started,2), "saved": saved, "prompt": PROMPT, "negative": NEGATIVE}, indent=2))
            return
        if time.time() - started > 900:
            raise SystemExit("Timed out waiting for Comfy prompt " + pid)
        print("Waiting", round(time.time() - started, 1))
        time.sleep(5)

if __name__ == "__main__":
    main()
