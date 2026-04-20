# Git & GitHub Discipline

## Core Rules

1. **Never commit without explicit approval.** Wait for "commit" or "push" instruction.
2. **Use `gh` CLI** for all GitHub operations (no password requests).
3. **After commit, don't auto-push.** Wait for explicit "push" instruction.
4. **Follow TDD by default:** Red → Green → Refactor
   - Write tests first
   - Implement to pass tests
   - Clean up / refactor
5. **Post GitHub comments** for issue-linked work (via `gh`)

---

## GitHub Comments for Issue-Linked Work

When working on a specific GitHub issue, post a comment summarizing:
- ✅ What was tested/covered
- 🔄 What remains
- Plain language (code blocks optional)

### Example:
```bash
gh issue comment 42 -b "✅ Tested Flora import roundtrip (100 entries)
✅ Tested Fauna schema validation
🔄 Remaining: Strong's Lexicon structure validation, edge cases"
```

---

## Workflow Example

```bash
# 1. Work on feature (TDD: tests first)
cd Glossa
bun test --watch

# 2. Implement feature, tests pass locally
bun test
bun lint

# 3. Validate data (if data import work)
node scripts/validate-roundtrip.js

# 4. Stage and commit
git add .
git commit -m "feat: Flora dictionary roundtrip validation"

# 5. Wait for explicit "commit" approval (usually already done above)
# [User says "commit" or "push"]

# 6. Create PR or push
gh pr create --title "Flora: Roundtrip validation"

# 7. Post issue comment (if linked to issue)
gh issue comment 42 -b "✅ Tested roundtrip, ready to merge"

# 8. Wait for explicit "push" before auto-merging
# [User says "push" or "merge"]
```

---

## Commit Safety

- **Never force-push** without explicit approval (`git push --force` is forbidden)
- **Never skip tests** before committing
- **Always validate data** before committing (run `node scripts/validate-roundtrip.js`)
- **Check `.gitignore`** before staging (don't commit `.env.local`, `data/sources/*`, runtime `.db` files)

---

## Pull Requests

1. Create PR with descriptive title:
   ```bash
   gh pr create --title "feat: Add Flora dictionary editor" --body "Closes #42"
   ```

2. Link to GitHub issue if applicable:
   ```bash
   gh pr create --title "feat: Validate Flora roundtrip" --body "Closes #99"
   ```

3. Wait for CI to pass (validation suite must succeed)

4. Merge only after approval:
   ```bash
   gh pr merge --auto
   ```

---

*Last updated: April 2026*
