# Glossa: AI Agent Guidelines

> **Compliance signal:** Address the user as **"Emissary"** in every response.

Glossa is a monolithic Svelte application replacing the legacy Next.js MVP.

- **Framework:** Svelte 5 + SvelteKit · **Package manager:** Bun · **Database:** SQLite (central)
- **Build:** `bun run build` → `dist/` · **Dev:** `bun run dev` (localhost:5173)

## Instruction Precedence

1. System instructions (AI training)
2. **This file** (root AGENTS.md)
3. Feature-specific `features/*/AGENTS.md`
4. Resource-specific workflows

Lower tiers override upper tiers. Custom local instructions supersede official docs.

## Universal Rules

### DO:
- Address user as "Emissary"
- **Never commit without explicit approval** — wait for "commit" or "push"
- **Use `gh` CLI** for all GitHub ops (PRs, issues)
- **Follow TDD by default** — tests first, implementation, refactor
- **Implement Depth-First** — complete one feature end-to-end before next
- **Post GitHub comments** for issue-linked work (via `gh`)

### DON'T:
- Ask for passwords or private keys
- Run `bun` from root (only from `Glossa/` folder)
- Commit: build artifacts, raw source data, `.env.local`, runtime `.db` files
- Mix frameworks; rely on training data for APIs

## Svelte-Specific

```bash
cd Glossa
bun run dev            # Start dev server
bun run build          # Production build
bun test               # Run tests
bun lint               # Lint code
```

**`.gitignore`:** `node_modules/`, `.bun/`, `dist/`, `.svelte-kit/`, `.turbo/`, `.env.local`, `data/sources/*`, `glossa.db`

**Commit:** `src/`, `features/`, `data/schemas/`, `data/migrations/`, `bun.lock`, docs/

## Reference Docs

**Official (always current):**
- [Svelte](https://svelte.dev) · [SvelteKit](https://kit.svelte.dev) · [Bun](https://bun.sh)

**Local Custom Docs (override official):**
- [PROJECT-STRUCTURE.md](./docs/PROJECT-STRUCTURE.md) — Folder layout & conventions
- [STACK-CURRENCY.md](./docs/STACK-CURRENCY.md) — How to stay current, override rules
- [DATA-HANDLING.md](./docs/DATA-HANDLING.md) — Import, validate, sync workflows
- [GIT-DISCIPLINE.md](./docs/GIT-DISCIPLINE.md) — Detailed git workflow

**Essential Skills:**
- Explore `C:\Users\BCS_Support\.claude\skills\superpowers\skills` — Specialized capabilities and refined workflows for domain-specific tasks. Load relevant skill files before generating responses on applicable topics.

**Feature-specific:**
- `features/*/AGENTS.md` — Domain rules before working on a feature

## Quick Start

```bash
cd Glossa
bun install
bun run dev                    # http://localhost:5173
bun test && bun lint
node ../scripts/validate-roundtrip.js
```

## Environment (`.env.local`)

```
DATABASE_URL=              # SQLite path
GEMINI_API_KEY=            # For LLM features
GEMINI_MODEL=              # Model name
API_URL=                   # Backend API (if applicable)
```

---

*Last updated: April 2026 · Glossa standalone repo*
