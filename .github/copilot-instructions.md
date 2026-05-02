# Glossa — Copilot Instructions

Glossa is a monolithic Svelte 5 + SvelteKit application for AI-assisted Bible translation resource creation (Flora, Fauna, Realia). Package manager: **Bun**. Database: **SQLite**.

---

## Playwright MCP

Playwright MCP is available via `.vscode/settings.json`. Use it to:
- **Navigate a running app** — Open a browser to a live URL and take screenshots
- **Verify page state** — Assert text, buttons, form values before/after actions
- **Author E2E tests** — Copilot can help write Playwright test code based on recorded interactions
- **Debug UI issues** — Inspect visual state, test responsive layouts

Invoke via: `@browse open http://localhost:5173` or `@browse screenshot` during a dev session (`bun run dev` must be running).

---

## Commands

```bash
bun run dev          # Dev server → http://localhost:5173
bun run build        # Production build → dist/
bun test             # Unit tests (Vitest) + E2E (Playwright)
bun run test:unit    # Unit tests only
bun run test:e2e     # E2E only (requires built app)
bun lint             # Prettier check + ESLint
bun run format       # Auto-format
bun run check        # svelte-check type validation
```

**Single test file:**
```bash
bun run test:unit -- src/path/to/file.spec.ts
```

**Watch mode (TDD):**
```bash
bun run test:unit -- --watch
```

**Data scripts (run from repo root, not `Glossa/`):**
```bash
node scripts/validate-roundtrip.js   # Validate DB integrity — run before every data-layer commit
node scripts/import-ubs-xml.js       # Import UBS source data
sqlite3 ./data/glossa.db < ./data/migrations/NNN_name.sql  # Apply a migration
```

---

## Architecture

### Svelte 5 Runes Mode

`svelte.config.js` enforces **runes mode** for all non-`node_modules` files. Use `$state`, `$derived`, `$effect`, `$props` — never legacy `writable`/`derived` stores or lifecycle APIs.

### Two Vitest Projects

`vite.config.ts` defines two test projects:
- **`client`** — Playwright/Chromium browser tests. File pattern: `src/**/*.svelte.{test,spec}.{js,ts}`. For component tests.
- **`server`** — Node environment. File pattern: `src/**/*.{test,spec}.{js,ts}` (excluding `.svelte.` files). For utilities and server logic.

`requireAssertions: true` is enforced globally — every test must assert something.

### Feature-Driven Modules

Business logic lives under `features/`, not inside the SvelteKit `src/` shell:
```
features/
├── flora-editor/
│   ├── AGENTS.md      ← read this before touching the feature
│   ├── src/
│   └── WORKFLOWS.md
├── fauna-editor/
└── ...
```
Always read `features/*/AGENTS.md` before modifying a feature area.

### Data Layer

SQLite is the single source of truth. Flow: raw sources → import scripts → `data/glossa.db` → app.
- `data/schemas/` — XSD/JSON schemas (commit)
- `data/migrations/` — sequential SQL migration files (commit)
- `data/sources/` — raw external XML/JSON (**never commit**)
- `data/manifest.json` — resource versions and import state; update on every import or schema change

### AI Provider Abstraction

AI calls go through a provider abstraction layer. Features express **task intent** (draft, review, validate, analyze) — they do not call provider SDKs directly. Initial adapters: OpenAI and Gemini. Provider-specific logic stays inside adapters; the product layer sees a normalized contract. See `docs/architecture/ai-provider-abstraction.md`.

---

## Conventions

### File Naming
- Svelte components: `PascalCase.svelte`
- Stores: `camelCaseStore.js`
- Utilities: `camelCase.js`
- Test files for components: `ComponentName.svelte.spec.ts` (picked up by `client` project)
- Test files for logic: `name.spec.ts` (picked up by `server` project)

### Component Test Pattern (Svelte 5)
```ts
import { flushSync, mount, unmount } from 'svelte';
// mount → flushSync → assert → unmount → document.body = ''
```

### Git / Commit Rules
- **Never commit without explicit user approval.** Wait for "commit" or "push."
- **Never run `git pull` or `git push`** — hand these to the user (require auth secrets).
- **Never force-push.**
- Do not commit: `.env.local`, `data/sources/*`, runtime `glossa.db`, `dist/`, `.svelte-kit/`
- Always commit: `src/`, `features/`, `data/schemas/`, `data/migrations/`, `bun.lock`, `docs/`

### GitHub Operations
Use `gh` CLI for all GitHub ops:
```bash
gh pr create --title "feat: ..." --body "Closes #N"
gh issue comment N -b "✅ What's done\n🔄 What remains"
gh pr merge --auto
```

### TDD
Red → Green → Refactor. Tests first, always.

### Instruction Precedence
`features/*/AGENTS.md` overrides root `AGENTS.md` which overrides official Svelte/SvelteKit docs.

---

## Environment (`.env.local` — never commit)

```
DATABASE_URL=       # SQLite path
GEMINI_API_KEY=     # LLM features
GEMINI_MODEL=       # Model name
API_URL=            # Backend API (if applicable)
```

---

## Reference Docs

- `docs/PROJECT-STRUCTURE.md` — Folder layout and conventions
- `docs/DATA-HANDLING.md` — Import, validate, sync workflows
- `docs/GIT-DISCIPLINE.md` — Detailed git workflow
- `docs/STACK-CURRENCY.md` — Framework version and override rules
- `docs/architecture/ai-provider-abstraction.md` — AI abstraction design
