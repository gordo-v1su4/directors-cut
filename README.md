# Directors Cut

Creative prompt workflows, curated prompt libraries, and a visual prompt browser for video generation models (Seedance, Sora, etc).

## Purpose

- Curated prompt library with evidence grading (community_corroborated, official_docs, etc.)
- Creative prompt workflows and setups for video generation
- Multi-agent/multi-model prompt comparison tables
- Visual prompt browser (Svelte 5 + Skeleton + Bits UI + TanStack Table)

## Architecture

- **Prompt library**: Obsidian vault (synced) — per-card Markdown + YAML frontmatter + JSONL index
- **Workflows/setups**: this repo (versioned, shareable)
- **Visual browser**: Svelte 5 + Skeleton + Bits UI + TanStack Table web app
- **Evidence schema**: evidence_type, library_status, confidence, source_count, tested_by_us
- **Backend**: Hermes (RackNerd5) via HTTP MCP bridge
- **Secrets**: Bitwarden Secrets Manager
- **Shared state**: Obsidian vault (synced across all machines)

## Relationship to raycast-pro-bridge

This repo is the creative consumer. `raycast-pro-bridge` is the Raycast Pro layer (MCP bridge, AI Commands, Agents, Script Commands). Directors-cut consumes Raycast + Hermes as services.

    directors-cut (creative) → consumes → raycast-pro-bridge (Raycast layer) + Hermes (backend)
