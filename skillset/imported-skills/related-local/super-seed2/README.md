# super-seed2

Notes and assets for **Seedance 2.0** on [xskill.ai](https://www.xskill.ai) (`st-ai/super-seed2`). The detailed API, MCP behavior, moderation, and examples live in **`seedance-super-seed2-api-guide.md`** — read that for anything non-trivial.

---

## For Cursor agents (next time)

**Start with [`AGENTS.md`](AGENTS.md)** — MCP workflow (`generate` / `get_result`), **`image_files`** pitfalls (private GitHub vs public raw URLs, **`functionMode`**), and a JSON **`generate`** template. Full schema and moderation: **`seedance-super-seed2-api-guide.md`**.

Briefly: MCP server **`user-xskill-ai`** (**`generate`**, **`get_result`**, **`search_models`**, **`guide`**). Repo **`transfer_url`** may not appear in your Cursor MCP tool list — use durable public **`image_files`** URLs.

---

## Getting started (humans)

1. **API key:** [xskill API keys](https://www.xskill.ai/#/v2/api-keys). Put it in **`.env`** as `XSKILL_API_KEY=...` (gitignored). Template: **`.env.exaample`** (filename as in repo).
2. **MCP in Cursor:** `mcp-config.json` uses `${XSKILL_API_KEY}`. On macOS/Linux you can expand it with `./generate-mcp-config.sh` and merge into your Cursor MCP config; on Windows, substitute the key manually or use WSL for the script.
3. **Model id for video:** `st-ai/super-seed2`. **Inner** speed tier inside **`options` / `params`:** `"model": "seedance_2.0"` for **Standard** (recommended); omitting often yields **Fast**.

---

## Reference images and uploads

- The API accepts **public HTTPS URLs** only — no local file paths in JSON. Upload elsewhere (temporary host, R2, Litterbox, etc.), or use MCP **`transfer_url`** if you already have a reachable URL to mirror.
- **`image_files`** order must match the prompt: first URL = **`@image_file_1`**, second = **`@image_file_2`**, and so on (up to 9).
- **Resize** large plates before upload: longest edge **≤ ~2048 px**, PNG **well under ~5 MB** when possible. From repo root (uses **uv**):

  ```bash
  uv run --with pillow scripts/resize_ref_images.py "<folder-of-pngs>" "./refs-resized"
  ```

- **`scripts/export_seedance_refs.py`** — copy/export Cursor asset PNGs into ordered filenames under **`seedance-refs/`** (that folder is gitignored by default). Upload those files to get URLs, then paste URLs into **`options.image_files`** in array order.

Heavy violence / blood / weapons in refs often triggers **Dreamina `status=fail`**; the guide has fallback ideas.

---

## Prompts and formatting

- **`exxample-prompts/`** — copy-paste style prompts (e.g. **`diner-fight-seedance-prompt.txt`** has Chinese + English blocks). Use **`@image_file_N`** tags that match your **`image_files`** order.
- **REST** `POST .../tasks/create`: body must nest fields under **`params`** (flat top-level returns **422**). See the guide for a minimal JSON example.
- **Omni reference (default):** you usually **do not** need **`functionMode": "omni_reference"`** if you pass **`image_files`**. Set **`first_last_frames`** only when using **`filePaths`** for first/last frame or text-only flows.

---

## Repo layout

| Path | Purpose |
|------|---------|
| `AGENTS.md` | Cursor/agent runbook: successful submit recipe, MCP, templates |
| `seedance-super-seed2-api-guide.md` | Source of truth: schema, MCP, REST, moderation, audio limits |
| `exxample-prompts/` | Example prompts |
| `scripts/resize_ref_images.py` | Downscale PNG refs |
| `scripts/export_seedance_refs.py` | Export ordered ref PNGs for Seedance |
| `mcp-config.json` | MCP server URL template |
