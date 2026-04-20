# Glossa Phase 1 PRD

**Date:** April 20, 2026  
**Status:** Approved via brainstorming session  
**Timeline:** 15 days to working system  
**Audience:** Engineering team, Malayalam team, stakeholders

---

## Executive Summary

Glossa Phase 1 is an internal proof-of-concept for a collaborative translation workspace. A Malayalam team will use Glossa to adapt three English reference resources (Flora, Fauna, Realia) into Malayalam using AI-assisted drafting, human editing, structural validation, and immediate publication.

**Core promise:** Replace manual collaboration tools (Google Sheets, email) with a reliable system that preserves structural integrity, enforces validation before publication, and provides clear team accountability.

**Success metric:** Malayalam team confirms Glossa is better than their current workflow and produces usable, validated outputs ready for publication.

---

## Problem & Context

Translation teams working with structured biblical content face persistent friction:

- Manual collaboration tools lack workflow visibility and state tracking
- Metadata and structural elements are fragile and easy to corrupt during editing
- Quality checks arrive too late in the process
- Publishing is manual and error-prone
- No audit trail for changes or approval decisions

Phase 1 tests whether Glossa can solve these problems for one focused team, in one language, with three resource domains. If proven, Phase 2 will be a managed service platform for external organizations.

---

## What Glossa Phase 1 Is

**In scope:**
- Resource import (English source material)
- Entry editor with AI-assisted drafting
- Human-editable blocks (translators can restructure as needed)
- Deterministic validation (non-negotiable element checks)
- Bypass recording (all validation exceptions logged and auditable)
- Workflow states (Draft → Ready → Public)
- Public site with localized content (or English fallback for untranslated)
- Reader feedback (ratings, comments, flags)
- RBAC with clear role authorities
- Complete audit trail

**Out of scope (Phase 2+):**
- Multi-language team scaling
- Advanced search and browsing
- BibleBrains API integration
- Analytics dashboards
- Self-serve onboarding
- External organization features

---

## Core Mission & Differentiation

Glossa enables teams to **rapidly produce vernacular biblical resources** by combining:

1. **Grounded source material** — All content derives from vetted English references (UBS Flora/Fauna/Realia, Bible commentaries, etc.), not AI generation
2. **AI-assisted adaptation** — AI drafts are human-steerable at block level; translators retain full control
3. **Structural integrity** — Bible references, cross-references, protected tokens, metadata, and image links are preserved and validated
4. **Explicit collaboration** — Roles, handoffs, and approval authority are visible and auditable
5. **Immediate publication** — Ready entries go live instantly to the public site

---

## Roles & Responsibilities

| Role | Capabilities | Authority |
|------|--------------|-----------|
| **Translator** | Edit entries, save drafts, view validation feedback, request Ready status | Can propose bypass with justification |
| **Reviewer** | Review work, approve/request-changes on bypass requests, approve Ready status | Approves bypass for Ready promotion |
| **Admin** | Manage team, control draft visibility setting, approve publish-level bypasses | Approves bypass for publication; final accountability |
| **Glossa Admin** | System provisioning, backups, resource management | Internal only |
| **Reader (unauthenticated)** | View public site, provide feedback (ratings/comments/flags) | No edit permissions |

---

## Non-Negotiable Elements (Must Be Preserved)

Any entry adapted into Malayalam must preserve these elements exactly:

- **Bible references** — `John 3:16`, `1 Corinthians 13:4-7`, etc. (format-agnostic; any valid format accepted)
- **Cross-references to other entries** — Links to related entries in the resource
- **Protected tokens & markup** — XML structures, semantic tags, formatting directives
- **Essential metadata** — Resource name/version, entry key, original language indicator
- **Image links** — All image URIs must remain valid and properly mapped

**Validation:** Deterministic check ensures all non-negotiables are present and structurally valid before promotion to Ready. Missing elements block promotion (hard gate) unless explicitly bypassed with Admin approval.

---

## Validation & Bypass Workflow

### Validation Checks (Phase 1)

Deterministic, rule-based validation:
- Non-negotiable elements present (Bible refs, cross-refs, tokens, metadata, image links)
- XML/structure integrity (parseable, valid)
- Image link validity
- **No LLM-assisted semantic validation in Phase 1**

### Validation Timing

- **On save:** Deterministic check runs; results shown in feedback strip
- **On Ready promotion:** Validation must pass (or be bypassed) before state change
- **No publish step:** Ready status triggers immediate publication; no separate gate

### Bypass Workflow

**Scenario:** Translator saves entry with missing Bible reference; validation reports failure.

1. Translator sees validation error with location guidance
2. Translator can save as Draft (validation failure does NOT block draft saves)
3. When ready to promote to Ready, translator submits bypass request with reason
4. Reviewer approves or requests changes
5. If approved, Reviewer promotes to Ready
6. Entry publishes immediately; bypass is logged

**Bypass logging:**
- Entry ID and affected components
- Reason provided by translator
- Reviewer approval and timestamp
- Visible to Admin in audit trail and final delivery report

**Approval hierarchy:**
- Translator requests bypass with written justification
- Reviewer approves bypass for Ready promotion
- Admin approves bypass for publish-level decisions (deferred entries, etc.)
- **All bypasses remain visible forever for accountability**

---

## Workflow States

### Draft
- Translator is actively working
- AI-generated draft or human edits
- Can be saved multiple times
- Validation runs but does NOT block saves
- Not visible to reviewers unless explicitly shared
- Not published to public site

### Ready
- Translator or Reviewer marks entry as ready
- Validation has passed or been formally bypassed
- **Auto-publishes immediately to public site**
- Visible in public site (Malayalam version for readers)
- Locked for editing (no changes after Ready without status reversion)

### Archived
- Resource version superseded
- Entry no longer active
- Available for historical audit trail only

---

## AI-Assisted Drafting

### Prompt Profiles

Each translator can use a default profile or create custom profiles.

**Default translator profile:**
- Built-in system prompt optimized for resource adaptation
- Focuses on: preserving meaning, adapting for Malayalam audience, maintaining structure

**Custom profiles:**
- Translator-created and saved
- Each profile: name, description, system prompt
- Reusable across entries and sessions

### LLM Configuration

**Admin controls:**
- Provider selector: Gemini, OpenAI-compatible, or other
- Model selector: gpt-4.1-mini, gemini-1.5-pro, etc.
- API base URL
- API key (in-memory, not persisted to database)

### Drafting Workflow

1. Translator opens entry in editor
2. Clicks "Generate Draft" button
3. LLM generates initial draft using configured profile and non-negotiable source material
4. Translator edits freely: modify paragraphs, add sections, merge blocks, reorder, delete
5. Saves changes (preserves edits, does not overwrite)
6. Re-generate on demand (confirmation required if edits exist)

---

## Entry Editor UI

**Layout (responsive):**
- **Desktop:** Left sidebar (entry list) + center (source/target split) + right (metadata/validation)
- **Tablet/Mobile:** Stacked layout, sidebar collapsible

**Components:**
- **Sidebar:** Entry search (by key or title), pinnable
- **Source pane:** Read-only original English content with Bible references highlighted
- **Target pane:** Editable Malayalam draft with block-level controls
- **Metadata panel:** Resource name/version, entry key, word count, last updated, translation status
- **Validation strip:** Shows non-negotiable checks and bypass history

**Actions:**
- "Generate Draft" (LLM) → creates initial draft
- "Save Draft" → persists edits to database, runs validation
- "Request Ready" (Translator) → submits for review/approval
- "Mark Ready" (Reviewer) → promotes to Ready, auto-publishes
- "Revert to Draft" (Admin only) → unpublish if needed for correction

---

## Public Site

### Reader Experience

**What readers see:**
- Entry detail: title, key, resource version, word count, last updated
- Content in target language (Malayalam) if entry marked Ready
- Untranslated entries show English fallback (labeled "Fallback: English")
- Language toggle (Malayalam ↔ English)
- Filter: "Show all" vs. "Localized only"

**Reader feedback:**
- 5-star rating per entry
- Comment submission (optional display name, defaults to Anonymous)
- Flag action for quality concerns
- No CAPTCHA or rate limiting in Phase 1

**Team control:**
- Admin can toggle team-wide setting: show in-progress entries (Draft/Review status) vs. Ready-only
- Applied consistently across all entries

### Publication Mechanism

- **Trigger:** Entry status changes to Ready
- **Timing:** Immediate (no delay, no separate publish step)
- **Scope:** Entry visible on public site in target language
- **Reversion:** Admin can revert Ready → Draft to unpublish (recorded in audit trail)

---

## Authentication & Authorization

### Login

- Email + password (credential-based)
- Session tokens with secure httpOnly cookies
- Can be extended to SSO later

### RBAC Enforcement

- **API level:** Every endpoint checks user role before executing
- **UI level:** Buttons/actions hidden/disabled based on role
- **Audit level:** All user actions logged with role and identity

### Role Assignments

- Admin assigns roles per user
- One user can have multiple roles (e.g., Translator + Reviewer)
- Roles stored in database, checked on every request

---

## Audit Trail & Reporting

### What Gets Logged

- **User actions:** Create, edit, save, validate, bypass request/approval, status change, revert
- **Metadata:** Actor (user ID), role, timestamp, affected entry, action details
- **Bypass events:** Reason, approver, affected components

### Audit Access

- Admin can read full audit trail for troubleshooting and accountability
- Query by entry, by user, by date range
- Exported in delivery report at project close

### Delivery Report

Generated when Phase 1 concludes:
- Entry count by status (Ready, Draft, Archived)
- Validation bypass summary (count by type, approver, reason)
- Timeline of key milestones
- Team participation metrics (edits per user, review count per reviewer)

---

## Data Model (Outline)

### Resources
- resource_id, name (flora/fauna/realia), version, source_language, status

### Entries
- entry_id, resource_id, key, title, source_content (XML), created_at, updated_at

### Translations
- translation_id, entry_id, target_language (ml), target_content (XML), status (draft/ready/archived), translator_id, reviewer_id, ready_at, published_at

### Validations
- validation_id, translation_id, check_type, passed (boolean), details (JSON), timestamp

### Bypasses
- bypass_id, translation_id, validation_id, reason, requested_by, approved_by, approved_at, promotion_stage

### Users
- user_id, email, password_hash, roles (JSON array), created_at

### AuditLog
- log_id, user_id, action, entity_type, entity_id, details (JSON), timestamp

---

## Testing Strategy (Phase 1)

### Deterministic Validation Testing

- Unit tests for each non-negotiable check
- Round-trip test: import → edit → export → diff against canonical source
- CI gate: non-zero exit on round-trip validation failure

### Manual QA

- End-to-end workflow with real Flora/Fauna/Realia entries
- Verify AI drafts are usable (not gibberish)
- Verify validation catches real issues
- Verify bypass logging is accurate
- Public site rendering on multiple browsers
- User acceptance testing with Malayalam team

### Test Coverage Target

- Validation engine: 90%+ unit test coverage
- Critical paths: end-to-end scenario testing
- Bypass audit trail: 100% coverage

**Note:** LLM-assisted semantic validation deferred to Phase 2+.

---

## Success Criteria for Phase 1

Phase 1 is successful if:

1. ✅ Core workflow runs end-to-end without manual workarounds or scripts
2. ✅ Structural validation enforces non-negotiables reliably and catches real issues
3. ✅ AI-assisted drafting produces usable output that translators can improve quickly
4. ✅ Malayalam team explicitly confirms Glossa is better than Google Sheets
5. ✅ Public site displays completed entries correctly with proper fallback behavior
6. ✅ Bypass audit trail is complete and traceable for every exception
7. ✅ Team can explain the workflow and handoff process clearly

---

## Technical Stack (Phase 1)

- **Frontend:** Svelte 5 + SvelteKit
- **Backend:** Node.js (SvelteKit API routes)
- **Database:** SQLite (local, central)
- **LLM Integration:** SDK abstraction layer (provider-agnostic)
- **Hosting:** Self-hosted
- **CI/CD:** GitHub Actions (basic: build, test, deploy on push to main)
- **Build:** Bun

---

## Constraints & Assumptions

**Constraints:**
- 15 days to working system (tight timeline)
- One team, one language (Malayalam)
- Three resource domains (Flora, Fauna, Realia)
- Internal-only (no external onboarding complexity)

**Assumptions:**
- English source resources are available and stable
- LLM API (Gemini/OpenAI) is accessible and reliable
- Malayalam team has 2-5 active translators during Phase 1
- Hosting infrastructure is provisioned (self-hosted server, domain, SSL)

---

## Phase 2 Vision (Future, Not This Timeline)

After Phase 1 proves the model:

- **Multi-language support** — Scale to other languages/teams
- **Advanced search** — Full-text search, Bible reference search, filtering
- **BibleBrains integration** — Live Bible verse lookup and cross-referencing
- **Managed service platform** — External organizations onboard and create their own projects
- **Analytics & reporting** — Dashboards, progress tracking, quality metrics
- **Semantic validation** — LLM-assisted theological and consistency checks

---

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **AI drafts unusable** | Translators reject tool | Test with real resource samples; iterate on prompts quickly |
| **Validation too strict** | Bypass fatigue, low adoption | Keep rules simple in Phase 1; refine based on team feedback |
| **Data loss / corruption** | Trust breach | Backup strategy, test data integrity on imports |
| **LLM API downtime** | Blocking translators | Graceful degradation; translators can write manually if needed |
| **Timeline slip** | Phase 1 extends beyond 15 days | Scope ruthlessly; defer Phase 2 features strictly |

---

## Key Decisions & Rationale

1. **Grounded content, not AI generation**
   - Rationale: Authoritative resources require vetted sources; AI is adaptation tool, not truth source
   - Impact: Higher trust in output, clearer liability, stronger community acceptance

2. **Immediate publication on Ready**
   - Rationale: Simplifies workflow; Ready = publishable; no separate gate
   - Impact: Faster time-to-value; requires rigorous validation before Ready

3. **Bypass always auditable**
   - Rationale: Exceptional cases must be traceable for accountability
   - Impact: Slightly higher implementation cost; essential for trust

4. **Deterministic validation only (Phase 1)**
   - Rationale: Rule-based checks are fast, predictable, testable; LLM checks are slower and less reliable
   - Impact: Some issues slip through; semantic validation deferred to Phase 2

5. **Admin approval required for all bypasses**
   - Rationale: Strongest accountability gate; prevents inconsistent exceptions
   - Impact: Slightly slower workflow; necessary for organizational trust

---

## Done Criteria

Phase 1 is done when:

- [ ] All code merged to main branch
- [ ] All non-negotiable validation passes
- [ ] Bypass audit trail complete and tested
- [ ] Public site renders correctly (Ready entries + fallback)
- [ ] Malayalam team completes end-to-end workflow with real entries
- [ ] Delivery report generated and reviewed
- [ ] Team sign-off: "Glossa is better than Google Sheets"

---

## Approval & Sign-Off

**Brainstorming Session:** April 20, 2026  
**Spec Created:** April 20, 2026  
**Status:** Ready for implementation planning

**Next Step:** Invoke writing-plans skill to create detailed 15-day implementation plan.

---

*This PRD was created through structured brainstorming with clear vision, humble experimental focus, and strict Phase 1 scope boundaries. All decisions prioritize delivery speed while maintaining structural integrity and team accountability.*
