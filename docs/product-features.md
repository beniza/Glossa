# Product Features

## Phase 1 Focus (Current)

Phase 1 prioritizes core workflow end-to-end: resource import, entry editing with AI assistance, validation, workflow states, and publication. Features are listed below with Phase 1 status noted.

## Phase 2+ Vision (Future)

Phase 2 and beyond will expand platform capabilities based on Phase 1 learnings. See sections marked **(Phase 2+)** below.

---

**Key principle:** All resource references in URLs, filters, API parameters, and state must accurately identify both resource name and version (e.g., `?resource=fauna&version=1.0`). This ensures correct disambiguation when multiple versions coexist.

---

## 1. Resource Import and Integrity

**Phase 1:** ✅ In scope

- Import structured XML resources (initially UBS FAUNA, FLORA, REALIA dictionaries)
- Idempotent upsert-based import: running import multiple times produces the same final state; no duplicates created
  - Uniqueness constraint: entry key + resource version
  - Re-runs update existing entries or no-op
- Preserve protected content: Bible references, structural attributes, element order, image links
- Per-run import manifest: entry count, skipped count, error count, elapsed time
- Round-trip validation: import → export → canonical XML diff
- CI gate: non-zero exit on round-trip validation failure

---

## 2. Entry Editor & AI-Assisted Drafting

**Phase 1:** ✅ In scope

- Editor UI with source (read-only) and target draft side-by-side (responsive mobile/desktop)
- Sidebar entry list with search by key or title
- Entry metadata display (resource, version, key, word count)
- AI-assisted draft generation via configurable LLM prompts
- Human-editable blocks (add, merge, delete, reorder paragraphs/sections freely)
- Save draft action (does not publish)
- Validation feedback strip (shows missing non-negotiables)
- Status controls: Request Ready (when validation passed or bypassed)

**Prompt profiles:**
- Default built-in translator profile
- Custom profiles (user-created, saved for reuse)
- Each profile includes: name, description, system prompt

**LLM configuration (admin):**
- Provider selector (Gemini, OpenAI-compatible)
- Model selector
- API base URL and key (in-memory, not persisted)

---

## 3. Validation & Bypass Recording

**Phase 1:** ✅ In scope

**Validation checks:**
- Non-negotiable elements present (Bible refs, cross-refs, protected tokens, metadata, image links)
- XML/structure integrity (parseable, valid)
- Image link validity
- Deterministic only (no LLM-assisted validation in Phase 1)

**Bypass workflow:**
- Translator requests bypass with justification
- Reviewer approves/requests-changes
- Admin approves for publish-level bypass
- All bypasses logged: entry, reason, approver, timestamp

---

## 4. Workflow States & Publication

**Phase 1:** ✅ In scope

- **Draft** — Translator working, not ready for review
- **Ready** — Validation passed or formally bypassed; **publishes immediately to public site**
- **Archived** — Resource version superseded

**No separate publish step.** Ready status triggers immediate publication.

---

## 5. Authentication & RBAC

**Phase 1:** ✅ In scope

- Credential-based login (email + password)
- Roles: Translator, Reviewer, Admin, Glossa Admin, Reader (unauthenticated)
- RBAC enforced at API and UI layers
- Session management with secure cookies

---

## 6. Public Site & Reader Experience

**Phase 1:** ✅ In scope

- Entry detail view showing: title, key, resource version, word count, last updated
- Entries marked Ready display in target language (Malayalam)
- Untranslated entries show English fallback (labeled "Fallback: English")
- Language toggle (Malayalam ↔ English)
- Filter: "Show all" vs. "Localized only"
- Reader feedback: 5-star rating, comment submission (optional display name), flag action
- Admin team setting: show in-progress entries vs. Ready-only

---

## 7. Audit Trail & Reporting

**Phase 1:** ✅ In scope

- All user actions logged (edit, save, validation, bypass, status change)
- Logs include: actor, role, action, timestamp, affected entry
- Delivery report: entry count by status, bypass summary, timeline

---

## 8. Resource Browser

**(Phase 2+)** Deferred

- Paginated entry list with infinite scroll
- Entry cards showing: key, title, resource badge, version, word count, translation status, last updated
- Filter by resource and version (All / Fauna / Flora / Realia)
- Filter by category
- Filter by translation status (untranslated / draft / ready for review / approved)
- "Needs Work" quick filter combining untranslated + draft
- All filter state reflected in URL query parameters
- Clear filters action
- Entry count display
- Default sort: resource priority then alphabetical title

---

## 9. Search

**(Phase 2+)** Deferred

- **Single unified search box** covering: entry key, title, content snippets, Bible references
- Auto-detection of input format:
  - Human-readable Bible reference format: `John 3:16` or `1 Corinthians 13:4-7`
  - USFM format: `JHN 3:16`
  - Mnemonic numeric format: 14-digit code (book 3 digits + chapter 3 digits + verse 3 digits + word position 5 digits, e.g., `00404003016001000`)
- Debounced query (300ms, no search triggered per keystroke)
- Ranked results: exact key → exact title → prefix title → exact reference → content snippet → resource priority → alpha title
- Match-type badge on each result card (key / title / content / reference)
- Empty state with clear filters and scope-switch actions
- Search scope respects selected resource and version filters

---

## 10. Target Language & View Mode Toggle

**(Phase 2+)** Deferred

- Source / Target view toggle in browser
- Target language selector (persistent across sessions to user profile)
- Language preference resolution order: user preference → org default → project fallback
- Language preference stored to user profile in database

---

## 11. Bible Reference Viewer

**(Phase 2+)** Deferred

- Inline Bible reference chips on entry detail
- Click chip to open Bible Viewer panel showing reference context
- Multi-version display (user-selected versions)
- Bible versions settings panel (select which versions to display)
- **Data sources:**
  - BibleBrains API integration for popular English translations
  - Local Bible database for vernacular and custom Bibles (stored as USFM files)
- USFM reference parser (book/chapter/verse extraction)
- Phase 1: mock display; Phase 2: live via BibleBrains and local database

---

## 12. Browser State Preservation

**(Phase 2+)** Deferred

- Back navigation restores: search query, scope (resource/version), status filter, language, sort order, scroll position, selected entry
- Full state reflected in URL for bookmarking and sharing
- Client-side routing (no full page reload on entry open/back)

---

## 13. Community Feedback (Extended)

**(Phase 2+)** Deferred

- CAPTCHA verification for unauthenticated submissions
- Rate limiting per IP and per entry
- Feedback analysis and trending
- Flag workflow and moderation

---

## 14. Advanced Features (Phase 2+)

- Batch operations and bulk editing
- Export workflows (JSON, XML, custom formats)
- Analytics dashboards
- Automated quality reports
- Multi-language team scaling features
- Self-serve onboarding
- External organization platform features
  - Reviewer profile (assists with review and validation)
  - Additional profiles TBD
- Profiles can be personal or shared within organization

---

## 12. Authentication and Roles

- SvelteKit/Svelte-native authentication (not NextAuth)
- Four roles: Admin, Reviewer, Translator, Reader
- Public read access for browser and entry detail
- Workbench access requires authentication (Translator, Reviewer, Admin only)
- Session-aware preference and profile loading

---

## 13. Feature Flags

- URL-queryable feature flags (`?ff_flagName=1`) for controlled rollout
- Flags for: Bible Viewer, Bible catalog fetch, Bible text fetch, additional experimental features as needed

---

## 14. Theme

- Dark theme (default) and Light theme
- User theme preference persisted to session/profile

---

## 15. Resource and Version Identification

**Cross-cutting principle:** All public URLs, filter tags, API parameters, and internal state must accurately identify both resource name and version number.

Examples:
- URL: `/browser?resource=fauna&version=1.0&scope=selected`
- API: `GET /api/resources/entries?resource=fauna&version=1.0`
- Filter state: includes resource slug + version together
- Entry detail link: includes resource and version context
- Workbench entry: displays both resource name and version

---

## 16. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Initial page load (entry list, 4G) | ≤ 2s LCP |
| Search response time (client, debounced) | ≤ 500ms after input stops |
| Entry detail open time (mobile) | ≤ 300ms perceived (optimistic render) |
| Entry list capacity | 10,000+ entries without degradation |
| WCAG accessibility | 2.1 AA |
| Mobile breakpoint | 320px minimum supported width |
| Browser support | Last 2 major versions of Chrome, Safari, Firefox, Samsung Internet |
| Theme support | Dark (default) + Light themes; persisted to user session |
| Security | Public read access for browser; privileged actions require auth; CAPTCHA + rate limiting for unauth feedback |

---

## 17. Frontend Stack Principles

- Built with SvelteKit (not Next.js)
- Tailwind CSS v4 with dark/light theme support
- SvelteKit-native authentication
- Client-side routing, no full page reloads
- Optimistic rendering for perceived performance
