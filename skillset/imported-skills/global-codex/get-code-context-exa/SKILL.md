---
name: get-code-context-exa
description: Code context using Exa. Finds real snippets and docs from GitHub, StackOverflow, and technical docs. Use when searching for code examples, API syntax, library documentation, configuration patterns, or debugging help that needs authoritative snippets.
context: fork
---

# Code Context (Exa)

Use this skill for programming questions that need current code examples or docs.

## Tool Restriction

Only use `get_code_context_exa`.
Do not use other Exa tools while this skill is active.

## Token Isolation

Never run Exa in main context.
Always fork a subagent to do the search work so the main thread stays clean.

Subagent workflow:

1. Call `get_code_context_exa`.
2. Extract the minimum viable snippet or doc excerpt.
3. Deduplicate mirrors, forks, and repeated answers.
4. Return only the best copyable snippet, the constraints, and the sources.

## When To Use

Use this skill for:

- API usage and syntax
- SDK and library examples
- config and setup patterns
- framework how-to questions
- debugging that needs authoritative snippets

## Inputs

`get_code_context_exa` supports:

- `query` as a required string
- `tokensNum` as an optional number

## Query Writing

Write high-signal queries:

- always include the programming language
- include framework and version when relevant
- include exact identifiers, config keys, or error messages when available

Examples:

- `TypeScript OpenAI Responses API tool calling`
- `Python 3.12 FastAPI dependency override testing`
- `Next.js 14 app router middleware matcher config`

## Token Guidance

- focused snippet: `tokensNum` 1000-3000
- most tasks: `tokensNum` 5000
- complex integration: `tokensNum` 10000-20000
- go higher only when necessary

## Output

Return:

1. the best minimal working snippet
2. version notes, constraints, and gotchas
3. source URLs when present

Before returning, deduplicate similar results and keep one representative snippet per approach.
