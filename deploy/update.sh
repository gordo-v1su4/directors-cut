#!/usr/bin/env bash
set -euo pipefail
exec 9>/opt/trailer-feed/update.lock
flock -n 9 || exit 0
cd /opt/trailer-feed/repo
git fetch --quiet origin main
next=$(git rev-parse origin/main)
previous=$(cat /opt/trailer-feed/release 2>/dev/null || true)
if [[ "$next" == "$previous" ]]; then exit 0; fi
if [[ -n "$previous" ]] && git diff --quiet "$previous" "$next" -- backend deploy; then
  # Frontend-only pushes deploy through Vercel. No database/container restart.
  exit 0
fi
git checkout --quiet --detach "$next"
export RELEASE_SHA="$next"
docker compose -f deploy/compose.yaml build
mkdir -p /opt/trailer-feed/backups
if docker ps --format '{{.Names}}' | grep -qx trailer-feed-api; then
  docker exec trailer-feed-api python -c 'import sqlite3; s=sqlite3.connect("/data/trailer-feed.sqlite"); d=sqlite3.connect("/data/predeploy.sqlite"); s.backup(d); d.close()'
  docker cp trailer-feed-api:/data/predeploy.sqlite "/opt/trailer-feed/backups/$previous.sqlite"
fi
if docker compose -f deploy/compose.yaml up -d --wait --wait-timeout 90; then
  printf '%s\n' "$next" > /opt/trailer-feed/release
  install -m 755 deploy/update.sh /opt/trailer-feed/update.sh
else
  if [[ -n "$previous" ]]; then
    git checkout --quiet --detach "$previous"
    RELEASE_SHA="$previous" docker compose -f deploy/compose.yaml up -d --wait --wait-timeout 90
  fi
  exit 1
fi
