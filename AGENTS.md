# Glossa: AI Agent Guidelines

> **Compliance signal:** Address the user as **"Emissary"** in every response.

Glossa is a monolithic Svelte application for creating and consuming Bible Resources assisted by AI.

**Two Integrated Features:**
1. **Translation Workspace** - AI-assisted resource creation and validation (original Glossa)
2. **Bible Reader** - Multi-translation reading interface with AI chat/voice (merged May 2026)

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
- **Hand git operations to the user** — Do not execute `git pull/push`. Ask the user to run these commands on their terminal, as they require authentication secrets. 
- **Follow TDD by default** — tests first, implementation, refactor
- **Implement Depth-First** — complete one feature end-to-end before next
- **Post GitHub comments** for issue-linked work (via `gh`)

### DON'T:
- Ask for passwords or private keys
- Run `bun` from root (only from `Glossa/` folder)
- Commit: build artifacts, raw source data, `.env.local`, runtime `.db` files
- Mix frameworks; rely on training data for APIs
- Use `+` prefix for test files (reserved by SvelteKit)

## TDD Enforcement Protocol

**CRITICAL:** Always follow TDD workflow — tests first, implementation second.

### Workflow
1. **Check phase first** — Query `tdd_phase` table before starting work
2. **RED phase** — Only write/modify test files (`.spec.ts`, `.test.ts`)
3. **GREEN phase** — Only write implementation after tests exist and fail
4. **REFACTOR phase** — Only cleanup after tests pass
5. **Block implementation** — If no test todo is marked 'done', implementation todo stays 'blocked'
6. **Explicit transition** — Ask user permission to move from RED → GREEN → REFACTOR

### SQL Tables for Tracking
```sql
-- Phase tracking
SELECT value FROM tdd_phase WHERE key = 'current_phase';
-- Values: 'RED', 'GREEN', 'REFACTOR', 'COMPLETE'

-- Todos with types
SELECT id, title, status, todo_type FROM todos;
-- todo_type: 'test', 'implementation', 'refactor'

-- Dependencies (implementation depends on tests)
SELECT * FROM todo_deps WHERE todo_id = 'implementation-todo-id';
```

### Before Writing Code
```sql
-- Check if we're in RED phase
SELECT value FROM tdd_phase WHERE key = 'current_phase';

-- If not RED and no tests exist, STOP and ask user
-- If RED phase, write tests first
-- If GREEN phase, verify tests are done:
SELECT COUNT(*) FROM todos 
WHERE todo_type = 'test' AND status != 'done';
-- Should be 0 before implementing
```

## Svelte-Specific

```bash
cd Glossa
bun run dev            # Start dev server
bun run build          # Production build
bun test               # Run tests
bun lint               # Lint code
```

### SvelteKit Reserved Filenames (DO NOT USE `+` prefix for tests!)

**Reserved Patterns:**
- `+page.svelte` — Route pages
- `+page.server.ts` — Server-side page logic
- `+server.ts` — API endpoints (e.g., `/api/bible/upload/+server.ts`)
- `+layout.svelte` — Layout files
- `+layout.server.ts` — Server-side layout logic
- `+error.svelte` — Error pages

**Test File Naming:**
- ✅ `upload-api.spec.ts` — Correct
- ✅ `converter.test.ts` — Correct
- ✅ `BiblePanel.svelte.spec.ts` — Correct for component tests
- ❌ `+server.spec.ts` — WRONG! Reserved by SvelteKit
- ❌ `+page.test.ts` — WRONG! Reserved by SvelteKit

**Error if violated:**
```
500: Files prefixed with + are reserved
```

### File Conventions
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

**Bible Reader Docs (merged feature):**
- [PRD](./docs/bible-reader/prd.md) — Product requirements for Reader mode
- [Architecture](./docs/bible-reader/architecture.md) — Reader system architecture
- [Test Coverage](./docs/bible-reader/test-coverage.md) — Test strategy and gaps
- [UI Mockup Analysis](./docs/bible-reader/ui-mockup-analysis.md) — Design specifications
- [Merge Analysis](./docs/bible-reader/merge-analysis.md) — Why and how we merged

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

## Common Pitfalls & Solutions

### ❌ Pitfall: Skipping TDD
**Symptom:** Writing implementation before tests exist  
**Solution:** Check `tdd_phase` table, write tests first (RED), then implement (GREEN)

### ❌ Pitfall: Using `+` prefix for tests
**Symptom:** `500: Files prefixed with + are reserved`  
**Solution:** Rename test files: `+server.spec.ts` → `upload-api.spec.ts`

### ❌ Pitfall: Absolute path handling
**Symptom:** Doubled paths like `C:\path\C:\path\file`  
**Solution:** Check if path is absolute before joining with `process.cwd()`
```ts
const isAbsolute = dataDir.startsWith('/') || /^[A-Za-z]:/.test(dataDir);
const fullPath = isAbsolute 
  ? join(dataDir, 'file') 
  : join(process.cwd(), dataDir, 'file');
```

---

*Last updated: May 3, 2026 · Glossa standalone repo*
