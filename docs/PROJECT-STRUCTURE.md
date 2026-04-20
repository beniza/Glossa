# Glossa Project Structure

This document describes the folder layout to maintain institutional memory across sessions.

## Root Level

```
Glossa/
├── src/                  # Svelte application source
├── features/             # Feature-specific modules
├── data/                 # Data, schemas, migrations
├── scripts/              # Build & import scripts (outside src/)
├── docs/                 # Documentation & guides
├── public/               # Static assets
├── package.json          # Bun package config
├── bun.lock              # Bun lock file
├── svelte.config.js      # SvelteKit config
├── vite.config.js        # Vite config
├── .env.local            # Local environment (DO NOT COMMIT)
├── .gitignore
└── AGENTS.md             # AI agent guidelines
```

## Key Folders

### `src/`
Main Svelte application entry point.
```
src/
├── routes/               # SvelteKit page routes
│   ├── +page.svelte
│   └── +layout.svelte
├── lib/
│   ├── components/       # Reusable Svelte components
│   ├── stores/           # Svelte stores (global state)
│   └── utils/            # Utility functions
└── app.css
```

### `features/`
Feature-driven architecture. Each feature is independent.
```
features/
├── bible-reader/
│   ├── AGENTS.md         # Bible-reader-specific rules
│   ├── src/              # Feature components & logic
│   └── WORKFLOWS.md      # Bible reader workflows
├── flora-editor/
│   ├── AGENTS.md
│   ├── src/
│   └── WORKFLOWS.md
├── fauna-editor/
│   ├── AGENTS.md
│   ├── src/
│   └── WORKFLOWS.md
├── dictionary-browser/
│   ├── AGENTS.md
│   ├── src/
│   └── WORKFLOWS.md
└── [more features]
```

Each feature has its own `AGENTS.md` defining domain-specific rules (e.g., Flora entry validation).

### `data/`
Central data and database management.
```
data/
├── schemas/              # XSD, JSON schemas (COMMIT)
│   ├── flora.xsd
│   ├── fauna.xsd
│   └── manifest.schema.json
├── sources/              # Raw XML/JSON (DO NOT COMMIT)
│   ├── ubs/
│   └── unfoldingword/
├── migrations/           # SQL migrations (COMMIT)
│   ├── 001_initial.sql
│   └── 002_add_flora.sql
├── glossa.db             # SQLite database (COMMIT empty, ignore runtime)
└── manifest.json         # Resource metadata (COMMIT)
```

### `scripts/`
Data processing and build utilities (run from root).
```
scripts/
├── import-ubs-xml.js      # Transform UBS → glossa.db
├── import-unfoldingword.js
├── validate-roundtrip.js   # Verify data integrity
└── sync-db.js              # Regenerate DB from sources
```

Usage:
```bash
node scripts/import-ubs-xml.js
node scripts/validate-roundtrip.js
```

### `docs/`
Project documentation and guides.
```
docs/
├── AGENTS.md              # This file's parent (root instructions)
├── PROJECT-STRUCTURE.md   # This file
├── DATA-HANDLING.md       # Import/validation workflows
├── STACK-CURRENCY.md      # Svelte/SvelteKit/Bun notes (custom)
├── GIT-DISCIPLINE.md      # Detailed git workflow
└── [feature workflows]
```

---

## File Naming Conventions

- **Svelte components:** PascalCase (`Flora.svelte`, `DictEntry.svelte`)
- **Stores:** camelCase with `store` suffix (`dictionaryStore.js`)
- **Utilities:** camelCase (`parseXml.js`, `validateEntry.js`)
- **Routes:** kebab-case (`+page.svelte`, `+layout.svelte`)
- **Documentation:** UPPERCASE_SNAKE_CASE (`PROJECT_STRUCTURE.md`, `DATA_HANDLING.md`)

---

## Build Artifacts & .gitignore

**Never commit:**
- `node_modules/` — Bun dependencies
- `.bun/` — Bun cache
- `dist/` — Production build output
- `.svelte-kit/` — SvelteKit build cache
- `.turbo/` — Turbo cache (if monorepo)
- `.env.local` — Local secrets
- `glossa.db` (runtime changes) — Commit schema only
- `data/sources/*` — Raw external data

**Always commit:**
- `src/`, `features/`, `data/schemas/`, `data/migrations/`
- `bun.lock` — Lock file for reproducible installs
- `AGENTS.md`, `README.md`, `docs/`

---

## Development Workflow

1. **Setup:**
   ```bash
   cd Glossa
   bun install
   bun run dev
   ```

2. **Before commit:**
   ```bash
   bun test
   bun lint
   node scripts/validate-roundtrip.js
   ```

3. **Commit & push:**
   ```bash
   gh pr create --title "Feature: ..."
   gh pr merge --auto
   ```

See [AGENTS.md](../AGENTS.md) for full Git discipline rules.

---

*This document is maintained to preserve institutional memory across AI sessions.*
