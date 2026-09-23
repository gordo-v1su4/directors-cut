> Public uploads now use the Robyn backend on app-vm. See [backend deployment](backend-deployment.md). The instructions below describe the local generation importer and local development workflow.

# Media workflow

Directors Cut keeps its existing project browser and three-column history: prompt source, shot grid, trailer versions. There is no vision judging or reference-assisted comparison table. Generation controls remain collapsed until needed.

## Run locally

Run `bun run dev` and open **http://127.0.0.1:5191**. Use that exact address:
`localhost` is a different browser origin. Development and production both read
projects and versions from `https://media.v1su4.dev/directors-cut`; there is no
repository-data fallback or environment override. The live backend stores uploaded
versions independently of Git. Normal startup runs only Vite, without rebuilding
local indexes or starting the local media importer. Vite fails if port 5191 is
occupied instead of silently switching origins.

Browser uploads also use the live backend; see [backend deployment](backend-deployment.md)
for its upload limits and processing behavior. The local importer commands below
are separate operator tools and are not started by the app.

Drag MP4/MOV/WebM files onto the project's **Drop new versions here** control, or click to choose files. Each batch attaches to the project selected when the upload starts. Keep the tab open until saving completes. Uploads never start paid generations.

## Generated videos

1. Save the project and creative prompt. Model, duration, resolution, aspect ratio and reference selection are separate settings.
2. Obtain and approve the current provider cost before submission.
3. Submit once; keep the returned job ID. Regular Sora 2 is `sora2_video` in completed-job receipts, and `open_sora_video` in the website. During verification on 2026-09-14, CLI model lookup rejected Sora despite successful authentication; the website submission worked. Do not silently substitute Seedance or Sora Pro.
4. The local worker discovers the latest 30 completed video jobs and only auto-attaches an exact prompt match to a single saved concept, created after that concept. Ambiguous or changed prompts require explicit registration:

   `bun run media:track RUN_ID ANSWER_ID JOB_ID`

5. The worker downloads, probes, generates the poster, uploads and verifies storage, records the original submitted prompt and job receipt, then rebuilds the feed. `bun run media:sync` performs one pass; `bun run media:watch` is the standalone polling option when the media server is not running.

If a provider login expires, renew it with `higgsfield auth login`. Existing saved media remains playable. The worker does not submit/retry paid generations. For an older job beyond the discovery window, use explicit registration.

The Last Prescription job `ab29cfc9-341f-46f3-932c-999d538ebd72` completed at 1280×720 and 12 seconds. Its receipt retains the original “Text-only” wording; the editable concept has that prefix removed. No second paid generation was submitted.

## Catalog and recovery

SQLite `.local/directors-cut.sqlite` contains `projects`, `jobs`, `assets` and `uploads`. The job receipt and status are durable locally; assets and uploads use stable IDs/checksums to prevent duplicate imports. Back up SQLite with SQLite's backup command while it is running; never copy only its main file while WAL writes are active. `.local/` is ignored by Git and is not a browser asset.

The existing Markdown/JSONL project files remain the editable creative source, and `public/data/` is the generated browser projection. This is a local ingestion catalog, not a deployed multi-user database. Keep `.local/` and `content/` together in workstation backups. If the worker is interrupted during storage upload, it retries and reuses the same content-addressed object keys. A stale `.local/media-sync.lock` may be removed after confirming no sync process is running.

## RustFS

One dedicated bucket: **directors-cut**. Existing other-app buckets are unchanged. The shared gateway auto-provisions this bucket on the first authenticated upload and uses the same public-read/CORS policy as super-seed2.

```text
directors-cut/
  media-uploads/YYYY/MM_DD/<run-id>/generations/<job-or-artifact-id>/
    original/<sha256>.mp4
    preview/<sha256>.jpg
```

Images retain PNG/JPEG format. The app bucket is sent separately from the object key; it is never duplicated inside the key. The public URL base is `https://s3.v1su4.dev/directors-cut/`. Local originals are retained under each project's `media/` directory. Uploaded source containers are retained privately under `.local/uploads/`.

## Environment and secrets

Local `.env.local` is gitignored, mode 0600. Only the existing media gateway URL/token were copied from super-seed2; project scope is set to `directors-cut`. Unrelated provider/OAuth credentials were not copied. The existing browser bridge configuration is preserved.

Worker variables: `MEDIA_GATEWAY_URL`, `MEDIA_GATEWAY_TOKEN`, `MEDIA_GATEWAY_BUCKET`, `MEDIA_GATEWAY_USER_ID`, `MEDIA_GATEWAY_UPLOAD_PREFIX`, `DIRECTORS_CUT_DATABASE`. The worker deliberately refuses a bucket/user ID other than `directors-cut`. Tokens never use the VITE prefix or enter the generated data. Retrieve the shared gateway credential via the existing BWS mapping in super-seed2's `pipeline/object-storage.md` (`PROXMOX_HOME_HOSTINGER_MEDIA_GATEWAY_TOKEN`); no credential was created or rotated in this change.

Canonical infrastructure layout: `proxmox-home/hostinger-ops/docs/rustfs-object-layout.md`. Obsidian pointer: `hermes-notebook-vault/04-Projects/Directors Cut/Directors Cut Deep-Dive Plan.md`.

## Verification

`bun run test:media`, `bun run check`, `bun run build`. Also verify actual browser playback, full titles, 16:9 preview frames, top-aligned cards, version switching, and duplicate-safe imports. Build success is not a substitute for playback verification.

## Version-specific context

On Projects, select a trailer version and choose **Edit version details**. Save the exact prompt and video model (free text with common-model suggestions), then upload a PNG/JPEG/WebP shot grid up to 10 MB or select an existing project grid. **Save version details** commits the prompt, model and attachment together. Arrows and thumbnails select the entire version context. Missing attachments remain empty; legacy grids are never guessed or automatically paired. The expanded video preview also shows that version's prompt and grid.

The owner-authenticated `POST /versions/:id/details` endpoint stores `version_prompt`, `video_model`, `shot_grid_url`, and `context_revision` in the video's existing SQLite artifact record. Original generation `prompt_text` and provider metadata remain intact. An omitted grid preserves its attachment; null explicitly detaches it. Stale saves return 409 rather than overwriting newer edits. Grid files are content-addressed under `directors-cut/version-assets/<run-id>/<artifact-hash>/shot-grids/<sha>.<ext>`; replacements never overwrite a different version's files. No image model tag or processing job is needed. Local development needs `VITE_MEDIA_API_URL` pointing at the backend for editing; production uses the public API.
