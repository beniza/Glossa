# Agent Instructions

**User:** Emisser

## Tools & Commands
- Use `bun` (not npm)
- Use `bunx` (not npx)
- Use `gh` CLI when available (git push/pull: user-only)

## Project Rules
- **Never ask for secrets** - use .env, never commit keys
- **TDD approach** - write tests, implement, verify
- **Minimalist commits** - atomic, descriptive messages
- **Documentation** - doc/ folder for PRD, evaluations, architecture
- **Can't do it? Say so explicitly** - no workarounds that don't work
- **Version selection** - check library website/repo, prefer LTS over latest
- **Compatibility first** - verify library versions work together before installing

## Key References
- PRD: `doc/bible-reader-prd.md` (requirements & POC features)
- Docking eval: `doc/docking-library-evaluation.md`
- USFM eval: `doc/usfm-conversion-evaluation.md`
- Plan: `.copilot/session-state/.../plan.md` (implementation strategy)
- Todos: SQL database (query with `sql` tool)

## Technology Stack
- **Framework:** SvelteKit + TypeScript + Bun
- **Styling:** Tailwind CSS 4 (pure utility, no component library)
- **USFM:** usfm-grammar (tree-sitter parser)
- **Docking:** svelte-golden-layout (MVP), custom Svelte (later)
- **Chat:** OpenAI + Gemini (from POC branch)
- **APIs:** SvelteKit API routes (not Express)

## Branch Strategy
- `main` - Active development (SvelteKit)
- `poc` - Original chat app (reference only, preserved)

## Workflow
1. Check plan.md & query SQL todos before starting work
2. Update todo status (`in_progress` → `done`) as you go
3. Commit atomically with descriptive messages
4. Reference POC (branch `poc`) for chat/voice patterns
