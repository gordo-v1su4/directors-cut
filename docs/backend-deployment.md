# Directors Cut backend

The public Svelte app on Vercel reads the live Robyn catalog at
`https://media.v1su4.dev/directors-cut`. Robyn runs in `directors-cut-api` on
app-vm (VM100), with loopback port 18100 and the Docker volume
`directors-cut-data`. SQLite holds text, URLs, version numbers, upload states,
and hashed owner sessions. Videos and thumbnails stay in bucket `directors-cut`.

## Upload flow

Sign in as `gordo` using the shared operator app password, then drop a video
onto the selected project. Public uploads accept up to 95 MB per file (500 MB
per batch), below the edge proxy request limit. Larger uploads need chunking
or a direct multipart storage path. The browser uploads directly to Robyn, avoiding
Vercel's request-body path. Robyn uses the private RustFS gateway `/upload`,
then `/video/jobs`. The existing Stack Structure worker handles the job without
Trigger.dev. Its first scene thumbnail becomes the version preview. The
original video remains the playback source; choose browser-compatible MP4/H.264
for widest playback support. MOV/WebM acceptance does not promise codec conversion.

A version appears after processing completes. SQLite persists upload status and
SHA256 deduplication. Processing failure has a retry button. A gateway restart
can lose its in-memory job; Directors Cut retains the source and allows retry.
No paid generation is submitted by this backend.

## Configuration

Runtime `/opt/directors-cut/runtime.env` is root-owned, mode 0600.
- `MEDIA_GATEWAY_URL`: private RustFS gateway.
- `MEDIA_GATEWAY_TOKEN`: existing RustFS gateway credential, BWS
  `PROXMOX_HOME_HOSTINGER_MEDIA_GATEWAY_TOKEN` (existing local project mirror).
- `DIRECTORS_CUT_OWNER_PASSWORD`: BWS `PROXMOX_HOME_SHARED_OPERATOR_APP_PASSWORD`.
- `ALLOWED_ORIGINS`: exact Vercel origin and authorized local development origin.

The shared storage credential is never exposed to the browser. Owner sessions
expire after 24 hours and are stored as hashes in SQLite. Login is rate limited.
Caddy routes only `/directors-cut/*` to this container; all existing RustFS
routes retain their upstream.

## Container updates

`directors-cut-update.timer` checks public GitHub `main` every two minutes.
`/opt/directors-cut/update.sh` fetches the exact commit and rebuilds only if
`backend/` or `deploy/` changed. Vercel handles frontend-only pushes independently.
The systemd service is root-owned and the API has no Docker socket access.

Before replacement, SQLite's online backup API creates a consistent database
copy in `/opt/directors-cut/backups/<previous-sha>.sqlite`. The update waits for
the container health check and rolls back the image on failure. The persistent
volume is never recreated. Seed JSON imports only missing records, never
replaces server-owned records. Schema changes must remain backward compatible
with the prior release; destructive migrations require a deliberate backup and
migration procedure. Backups currently remain on the same VM; no off-VM backup
policy is configured by this project.

Manual update: `sudo systemctl start directors-cut-update.service`.
Inspect: `sudo journalctl -u directors-cut-update.service` and
`sudo docker logs directors-cut-api`.
Pause deployment: `sudo systemctl stop directors-cut-update.timer`.

Python validation: `uv pip install -r backend/requirements.txt`, then
`python -m unittest discover -s backend`. Frontend: `bun run check`.
