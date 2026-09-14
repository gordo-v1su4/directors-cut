#!/usr/bin/env bash
set -euo pipefail
exec 9>/opt/directors-cut/update.lock
flock -n 9 || exit 0
cd /opt/directors-cut/repo
git fetch --quiet origin main
next=$(git rev-parse origin/main)
previous=$(cat /opt/directors-cut/release 2>/dev/null || true)
if [[ "$next" == "$previous" ]]; then exit 0; fi
if [[ -n "$previous" ]] && git diff --quiet "$previous" "$next" -- backend deploy; then
  # Frontend-only pushes deploy through Vercel. No database/container restart.
  exit 0
fi
git checkout --quiet --detach "$next"
export RELEASE_SHA="$next"
docker compose -f deploy/compose.yaml build
mkdir -p /opt/directors-cut/backups
if docker ps --format '{{.Names}}' | grep -qx directors-cut-api; then
  docker exec directors-cut-api python -c 'import sqlite3; s=sqlite3.connect("/data/directors-cut.sqlite"); d=sqlite3.connect("/data/predeploy.sqlite"); s.backup(d); d.close()'
  docker cp directors-cut-api:/data/predeploy.sqlite "/opt/directors-cut/backups/$previous.sqlite"
fi
if docker compose -f deploy/compose.yaml up -d --wait --wait-timeout 90; then
  printf '%s\n' "$next" > /opt/directors-cut/release
  install -m 755 deploy/update.sh /opt/directors-cut/update.sh
else
  if [[ -n "$previous" ]]; then
    git checkout --quiet --detach "$previous"
    RELEASE_SHA="$previous" docker compose -f deploy/compose.yaml up -d --wait --wait-timeout 90
  fi
  exit 1
fi
