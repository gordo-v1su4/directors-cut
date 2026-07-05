---
name: homelab-runtime-check
description: Cross-platform homelab runtime health workflow for `proxmox-home`. Use when running the recurring Homelab Runtime Health automation, checking public/origin/upstream health, selecting Windows PowerShell versus macOS/Linux Bash health scripts, or performing Proxmox-first recovery with Tailscale SSH and `qm guest exec`.
---

# Homelab Runtime Check

Read this whole skill file completely before doing anything else.
Understand the platform split, topology expectations, shell access path, and required output before taking action.

After you have read this entire skill file, read the runtime playbook completely before executing any checks, edits, or recovery work:

- `docs/runtime-health-playbook.md` in `proxmox-home`

Then read the first-read documents named by that playbook before running checks.

## Core Rules

- Start in the primary `proxmox-home` clone, not a tool worktree.
- Detect the local machine and shell first.
- On Windows, prefer PowerShell-native scripts.
- On macOS or Linux, prefer Bash scripts.
- Do one thing at a time.
- If something fails early or the scope becomes unclear, stop and re-read the playbook from the top before trying a new path.
- Do not confuse this workflow with the repo-only daily check.

## Platform Decision

Ask these questions first:

1. Am I on Windows, macOS, or Linux?
2. Am I in the primary `proxmox-home` clone?
3. Which script family matches this platform?
4. Do I need runtime checks only, or shell access too?

Use this split:

- Windows:
  - GitHub root: `%USERPROFILE%\Documents\Github`
  - Health scripts:
    - `.\scripts\check-ingress.ps1 -Mode all`
    - `.\scripts\homelab-healthcheck.ps1`
- macOS/Linux:
  - GitHub root: `~/Documents/Github`
  - Health scripts:
    - `./scripts/check-ingress.sh all`
    - `./scripts/homelab-healthcheck.sh`
    - `./scripts/proxmox-baseline.sh` when host baseline drift matters

## Standard Flow

1. Read the runtime playbook fully.
2. Read the required context files named by that playbook.
3. Refresh `proxmox-home` with `git pull --ff-only`.
4. Run the platform-appropriate health scripts.
5. Identify the failing layer: public, origin, upstream, host, or guest.
6. If shell access is needed, verify Tailscale before trying recovery.
7. Use the documented Proxmox-first recovery path.

## Preferred Shell Access Path

- From the Windows desktop or another automation shell, prefer `tailscale ssh root@pve-node0`.
- If Tailscale is healthy and Proxmox is reachable, use that before plain LAN SSH.
- Once on the Proxmox host, prefer `qm guest exec <vmid> -- <command>` when the guest agent is enabled.
- For `edge-traefik`, the common VM id is `112`.
- Use interactive `ssh root@192.168.50.178` only when you intentionally need the password-auth path.

## Drift And Failure Guardrails

- Public failures do not automatically mean container failures.
- If upstreams are healthy but public is bad, investigate ingress first.
- If `tailscale ssh root@pve-node0` works, use it as the default recovery path instead of rediscovering plain SSH prompt limitations.
- If the healthcheck already shows recovery, verify first before making changes.

## Failure Questions

If anything fails, stop and answer:

1. Did I read the whole skill first?
2. Did I read the whole runtime playbook?
3. Am I in the primary clone and not a worktree?
4. Am I using the right script family for this OS?
5. Am I checking the right layer?
6. If shell access is needed, did I try the Tailscale path first?

If the answer to any of those is "no" or "not sure," correct that first.

## Output

Always report:

- what is healthy
- what is failing
- what changed since the last run if known
- which layer failed
- the single best next step

If you deviated from the playbook, say exactly why.
