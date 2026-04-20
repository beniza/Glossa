# Stack Currency & Documentation Strategy

## Always Consult Official Docs First

Before implementing any feature, pull **current** documentation:
- [Svelte 5](https://svelte.dev) — Components, reactivity, lifecycle
- [SvelteKit](https://kit.svelte.dev) — Routing, load functions, form actions
- [Bun](https://bun.sh) — Package management, scripts, testing

**Do not rely on training data.** Check for deprecations, new patterns, API changes every time.

---

## Custom Instructions Override Official Docs

If this repo's `AGENTS.md` or feature `AGENTS.md` specifies a rule that differs from official 
documentation, follow the local rule.

**The LLM may warn if overriding official best practices**, but custom instructions are law.

### Example:
- Official: "Use SvelteKit's `+server.js` for API routes"
- Local AGENTS.md: "Use `/api/` folder structure instead"
→ Follow local rule. LLM can note the deviation but must comply.

---

## When in Doubt (Decision Tree)

1. **Check local docs/**
   - AGENTS.md, PROJECT-STRUCTURE.md, STACK-CURRENCY.md, etc.
   
2. **Check feature-specific AGENTS.md**
   - `features/flora-editor/AGENTS.md` has Flora-specific rules
   
3. **Check official documentation**
   - Svelte, SvelteKit, Bun docs (most authoritative for standard patterns)
   
4. **Ask the user for clarification**
   - If conflicting guidance or unclear precedence

---

## Version Tracking

Keep `package.json` and `bun.lock` in sync with latest stable versions:
```bash
bun install --latest
bun update
```

Check lock file to verify current versions being used:
```bash
cat bun.lock | grep -A2 "svelte\|sveltekit"
```

---

*Last updated: April 2026*
