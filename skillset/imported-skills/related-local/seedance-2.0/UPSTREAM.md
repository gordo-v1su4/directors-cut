# Vendored upstream

This directory is a **vendored copy** of [Emily2040/seedance-2.0](https://github.com/Emily2040/seedance-2.0) kept inside `directors-cut`. It is not a nested git repository.

| Field | Value |
|-------|-------|
| Upstream | `https://github.com/Emily2040/seedance-2.0.git` |
| Synced commit | `44b5149` |
| Upstream release | v6.7.0 |
| Synced from | `upstream/main` on 2026-08-16 |

## Refresh

From a machine with the standalone checkout at `~/Documents/Github/seedance-2.0`:

```bash
cd ~/Documents/Github/seedance-2.0
git fetch upstream
git merge --ff-only upstream/main

rsync -a --delete \
  --exclude '.git/' \
  --exclude '.codegraph' \
  --exclude '.omx/' \
  --exclude '.DS_Store' \
  ./ \
  ../directors-cut/skillset/imported-skills/related-local/seedance-2.0/
```

Then update the commit hash in this file.

## Excluded from vendoring

- `.git/` — no nested repo
- `.codegraph` — local symlink to external tooling
- `.omx/` — local agent session state
