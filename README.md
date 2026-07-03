# Directors Cut

Prompt workflows, setups, and curated prompt libraries for video generation models (Seedance, Sora, etc).

## Purpose

- Creative prompt workflows and automation setups
- Curated prompt library with evidence grading
- Multi-agent/multi-model prompt comparison tables
- Visual prompt browser (Svelte 5 + TanStack Table)

## Architecture

- **Prompt library**: Obsidian vault (synced) — per-card Markdown + YAML frontmatter + JSONL index
- **Workflows/setups**: this repo (versioned, shareable)
- **Visual browser**: Svelte 5 + Skeleton + Bits UI + TanStack Table web app
- **Backend**: Hermes (RackNerd5) via HTTP MCP bridge
- **Secrets**: Bitwarden Secrets Manager
- **Shared state**: Obsidian vault (synced across all machines)

## Related

- Raycast Pro = creative control room (AI Commands, Agents, @-mentions)
- Hermes = durable research + tool backend
- omp = orchestrator between user, Raycast, and Hermes

