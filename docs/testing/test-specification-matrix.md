# Test Specification Matrix

## Purpose

This document defines Glossa test intent independent of framework and implementation details, with two layers:

- Layer 1: compact behavioral contract by risk and test level
- Layer 2: detailed assertion coverage and traceability policy

## Layer 1: Compact Behavioral Matrix

| Spec ID | Domain | Behavior Contract | Test Level | Risk | Expected Result |
|---|---|---|---|---|---|
| TSM-PARSE-001 | Parser | Structured input is parsed into stable entry objects | Unit | High | Required fields and stable key identity are preserved |
| TSM-PARSE-002 | Parser | Content hierarchy and references remain structurally correct | Unit | High | Titles/sections/paragraphs/index links/references are extracted consistently |
| TSM-PARSE-003 | Parser | Round-trip and checksum behavior are deterministic | Unit | Critical | Equivalent source yields equivalent normalized structures and checksums |
| TSM-IMPCON-001 | Import Contract | Import orchestration contract is complete and enforceable | Unit + Integration | High | Required hooks, scoping, and metadata expectations are satisfied |
| TSM-IMPCON-002 | Import Contract | Repeated imports are idempotent and do not duplicate logical entities | Integration | Critical | Re-run behavior updates or no-ops safely |
| TSM-IMPCON-003 | Import Contract | Authorization and scope constraints are enforced | Integration | Critical | Unauthorized or invalid-scope actions are rejected |
| TSM-RISK-001 | Import Risk | Malformed/invalid input classes fail safely and predictably | Unit | Critical | Stable error categories and no unsafe fallback behavior |
| TSM-RISK-002 | Import Risk | Collision and boundary failures are surfaced deterministically | Integration | Critical | Duplicate keys, namespace collisions, timeout/encoding/index-target issues are explicit |
| TSM-SEC-001 | Security | Parser-level exploit vectors are blocked | Unit | Critical | XXE/DOCTYPE/entity expansion, traversal, and deep nesting are rejected |
| TSM-SEC-002 | Security | Surface protections and safe error mapping are enforced | Unit + Integration | High | Rate-limit/RBAC/sanitized error behavior is consistent |
| TSM-BROWSE-001 | Browser Logic | List and pagination normalization are deterministic | Unit | Medium | Entry-card/list shaping is stable for equivalent input |
| TSM-BROWSE-002 | Browser Logic | Status/search/resource URL behavior is canonical and reversible | Unit | High | Status parsing/expansion, query normalization, and URL serialization round-trip |
| TSM-API-001 | API Query | Filter/search/resource query handling maps correctly to backend options | Integration | High | API option shaping and constraints are accurate and stable |
| TSM-API-002 | API Shape | API payload contract remains stable for consumers | Integration | High | Response envelope and key fields are predictable |
| TSM-ROUTE-001 | Route Smoke | Key browsing routes tolerate supported query permutations | E2E Smoke | Medium | Route loads cleanly with expected param combinations |
| TSM-DB-001 | DB Integration | Schema and constraints satisfy persistence contract | Integration (DB) | Critical | Required tables/types/constraints/relations are present |
| TSM-DB-002 | DB Integration | Import persistence preserves fidelity and integrity | Integration (DB) | Critical | Source payload fidelity, FK integrity, and idempotent upsert hold |
| TSM-DB-003 | DB Integration | Multilingual and UTF-8 storage is lossless | Integration (DB) | High | Round-trip storage does not corrupt multilingual content |

## Execution Profiles

- Fast: parser/import-contract/browser unit + non-DB integration checks
- Standard: Fast plus API and route smoke
- Full: Standard plus DB-gated integration suite

## Coverage Rules

- Critical Spec IDs require automated coverage before release
- High Spec IDs require automated coverage unless explicitly waived
- Medium/Low Spec IDs can phase in, but must remain traceable

---

## Layer 2: Detailed Assertions

| Spec ID | Detailed Assertions to Preserve |
|---|---|
| TSM-PARSE-001 | Field extraction includes keys, titles, sections, paragraphs, and entry integrity checks |
| TSM-PARSE-002 | Reference extraction normalization and index-item target association correctness |
| TSM-PARSE-003 | Round-trip equivalence and checksum stability across equivalent source input |
| TSM-IMPCON-001 | Module shape/resource configuration contracts, orchestration entry points |
| TSM-IMPCON-002 | Idempotency, import-lock expectations, and duplicate-prevention behavior |
| TSM-IMPCON-003 | Scoped key enforcement, RBAC checks, and contract-level rejection semantics |
| TSM-RISK-001 | Missing/empty/malformed/schema-invalid XML classes map to explicit structured error outcomes |
| TSM-RISK-002 | Duplicate key, namespace collision, encoding boundary, timeout boundary, and index-target mismatch handling |
| TSM-SEC-001 | XXE/DOCTYPE/entity expansion/path traversal/payload-size/deep-nesting guard behavior |
| TSM-SEC-002 | Rate-limit controls, RBAC guardrails, safe logging, and sanitized error mapping expectations |
| TSM-BROWSE-001 | Pagination defaults, entry-card normalization, list-shaping determinism |
| TSM-BROWSE-002 | Status canonicalization, needs-work expansion, search normalization, reference token generation, reversible URL serialization |
| TSM-API-001 | Status/search/resource filter query-option shaping and invalid-filter policy behavior |
| TSM-API-002 | Stable response envelope and key contract fields for consumer compatibility |
| TSM-ROUTE-001 | Query-param compatibility smoke behavior for browsing route loads |
| TSM-DB-001 | Table presence, type/constraint fidelity, FK and cascade behavior, index/metadata expectations |
| TSM-DB-002 | Source-content preservation and idempotent persistence semantics |
| TSM-DB-003 | UTF-8 and multilingual round-trip storage fidelity |

## Layer 2: Traceability Policy

- Every concrete test added in Glossa must reference at least one Spec ID.
- Every Spec ID in this matrix must be covered by one or more concrete tests.
- Test reports should summarize pass/fail by Spec ID and risk tier.
- Spec IDs are stable identifiers and should not be renamed without an explicit change note.
- When behavior changes, update this matrix before adding or modifying implementation tests.