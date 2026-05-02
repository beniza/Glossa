# Bible Reader → Glossa Merge Handoff

**Date:** May 2, 2026 17:22 IST  
**Branch:** `feature/merge-bible-reader`  
**Commit:** `e0a47ca` - "Merge Bible Reader feature into Glossa"  
**Status:** ✅ Merge complete, ready for implementation

---

## 🎯 What Just Happened

Successfully merged the **Bible Reader** project into **Glossa** monolith. Bible Reader is a web app for reading/studying Bible translations with AI chat/voice features. It started as a POC (Node.js + vanilla JS) and is being rebuilt with SvelteKit + TDD.

**Why merge?**
- Same tech stack (SvelteKit + Bun + Tailwind + Vitest)
- Complementary features: Glossa creates resources, Bible Reader consumes them
- Shared infrastructure: database, validation, AI integration
- Creates complete production-to-consumption ecosystem
- 30-40% dev time savings from unified codebase

---

## ✅ What Was Merged

### 📚 Documentation (13 files, ~130KB)
Location: `docs/bible-reader/`

**Core Documents:**
- **prd.md** (31KB) - Complete product requirements
  - Section 6.1: POC chat/voice implementation details
  - OpenAI Realtime (WebRTC) and Gemini Live (WebSocket) patterns
- **architecture.md** (20KB) - System design with 9+ Mermaid diagrams
  - Module architecture, data flows, user journeys, component structure
- **test-coverage.md** (21KB) - Test strategy and gap analysis
  - 70 current tests documented
  - 150+ tests needed for full coverage
  - 100+ corner cases across 16 categories

**Design Documents:**
- **ui-mockup-analysis.md** (20KB) - Design system extracted from 5 mockups
  - Primary reference: `dual-panel-parallel-view.png`
  - Colors, typography, spacing specs ready for Tailwind
- **ui-prompt.md** (16KB) - Google Stitch UI design prompt

**Project Context:**
- **merge-analysis.md** (17KB) - Why we merged + 8-week migration plan
- **project-prompt.md** (13KB) - AI assistant onboarding prompt
- **AGENT.md** - Original Bible Reader project instructions
- **README.md** - Feature overview and navigation

**Library Evaluations:**
- `evaluations/docking-library-evaluation.md` (18KB)
  - Compared 4 options: golden-layout, rc-dock, FlexLayout, custom
  - Recommended: svelte-golden-layout for MVP → custom later
- `evaluations/usfm-conversion-evaluation.md` (18KB)
  - Compared 4 parsers: usfm-grammar, Paranext, bjfield, custom
  - Chosen: **usfm-grammar@3.2.0** (score 9.0/10)

### 🧪 Tests (70 RED tests - TDD approach)
Location: `src/lib/features/reader/converter.test.ts` (657 lines)

**Test Coverage:**
- ✅ Basic USFM structures (paragraphs, poetry, headings)
- ✅ Character styles (bold, italic, superscript, etc.)
- ✅ Special features (footnotes, cross-refs, introductions)
- ✅ Unicode/RTL, edge cases, performance tests
- ❌ All tests failing: `Cannot find module './converter'` ← **Expected RED phase**

**Next Step:** Implement `converter.ts` to make tests pass (GREEN phase)

### 🎨 UI Mockups (5 PNG files, 4.2 MB)
Location: `static/mockups/`

- **dual-panel-parallel-view.png** ⭐ PRIMARY REFERENCE
  - Shows exact vision: sidebar + multi-panel comparison
  - Layout, colors, typography extracted in ui-mockup-analysis.md
- bible_reader_study_view.png
- chat.png
- no-content-view.png
- upload-bible-usfm.png

### 📦 Dependencies Added
Merged into `package.json`:

**Core Libraries:**
- `usfm-grammar@3.2.0` - USFM → USJ → HTML conversion
- `adm-zip@0.5.17` - Zip file extraction
- `svelte-golden-layout@0.1.1` - Panel docking (MVP)

**AI Integration:**
- `openai@6.35.0` - Chat + Realtime API
- `ws@8.20.0` - WebSocket for Gemini Live

**Dev Tools:**
- `@vitest/ui@4.1.5` - Test UI
- `autoprefixer@10.5.0`, `postcss@8.5.13` - Tailwind CSS support

**Status:** ✅ All installed (264 packages, 227.28s)

### 📝 Configuration Updates

**AGENTS.md:**
- Added Bible Reader feature description
- Linked to docs/bible-reader/ documentation
- Integrated into Glossa workflow

---

## 🏗️ Technical Architecture

### Storage Strategy (Updated for Glossa)
**Pre-merge (Bible Reader standalone):**
- USFM files: File system (data/bibles/{bibleId}/)
- Panel layouts: localStorage
- Chat history: localStorage or in-memory
- NO SQL database

**Post-merge (Glossa integration):**
- Migrating to **SQLite database**
- Tables: `bibles`, `bible_books`, `rendered_chapters`
- Reasoning: Better persistence, validation, integration with workspace

### USFM Conversion Pipeline
```
USFM string → usfm-grammar.toUSJ() → custom HTML renderer → Styled HTML
```

**Why usfm-grammar?**
- Official USFM 3.0 spec implementation
- Easier npm install than Paranext Official
- More features than bjfield parser
- Score: 9.0/10 for balance of features + speed

### Docking Strategy (Two-phase)
**Phase 1 (MVP):** svelte-golden-layout@0.1.1
- Fast implementation: 2-3 days
- Get parallel view working quickly

**Phase 2 (Production):** Custom Svelte implementation
- Full control over behavior
- Better Svelte integration
- Timeline: 1-2 weeks

### Chat/Voice Integration
**OpenAI:**
- Chat: REST API (chat completions)
- Voice: Realtime API with WebRTC
- Audio: Float32 → PCM16 conversion

**Gemini:**
- Voice: Live API with WebSocket proxy
- Audio resampling: 48kHz → 16kHz PCM16
- Playback queue with timing

---

## 📊 Current Status

### ✅ Completed (Phase 1: Merge)
- [x] Analyzed both projects for synergies
- [x] Created feature/merge-bible-reader branch
- [x] Copied all documentation (13 files)
- [x] Copied all tests (70 RED tests)
- [x] Copied all UI mockups (5 files)
- [x] Merged dependencies into package.json
- [x] Updated AGENTS.md with context
- [x] Committed merge (e0a47ca)
- [x] Installed dependencies (264 packages)
- [x] Verified tests run (all RED as expected)

### 🚧 In Progress
**Current Todo:** `usfm-converter` (status: in_progress)
- 70 RED tests written in converter.test.ts
- Need to implement converter.ts to go GREEN
- Pipeline: USFM → USJ → HTML

### 📋 Pending Todos (6 remaining)
1. **zip-upload-api** - Create POST /api/bible/upload endpoint
2. **convert-api** - Create GET /api/bible/convert/:bibleId/:book/:chapter
3. **docking-panels** - Integrate svelte-golden-layout
4. **bible-reader-ui** - Build reader component with book/chapter selector
5. **usj-styling** - Port usj-nodes.css from paranext-core
6. **integration-test** - End-to-end flow testing

---

## 🎯 Next Steps (GREEN Phase)

### Immediate: Implement USFM Converter
**File to create:** `src/lib/features/reader/converter.ts`

**Required exports (from test file):**
```typescript
export function convertUsfmToHtml(usfm: string): string;
export function convertBookToHtml(usfm: string, bookCode: string): string;
export function convertChapterToHtml(usfm: string, bookCode: string, chapter: number): string;
```

**Implementation approach:**
1. Use usfm-grammar to convert USFM → USJ
   ```typescript
   import { USFMParser } from 'usfm-grammar';
   const parser = new USFMParser();
   const usj = parser.toUSJ(usfmString);
   ```

2. Create HTML renderer for USJ nodes
   - Map USJ markers to HTML elements
   - Handle character styles (bold, italic, etc.)
   - Handle structural elements (paragraphs, poetry, headings)
   - Handle special features (footnotes, cross-refs, introductions)

3. Add error handling & edge cases
   - Empty input, malformed USFM, missing markers
   - Unicode/RTL text, special characters
   - Performance for large books

**Test command:**
```bash
cd Glossa
bun test src/lib/features/reader/converter.test.ts
```

### Week 2-4: Core Features
1. **Storage Adaptation** (Week 2)
   - Create SQLite schema (bibles, bible_books, rendered_chapters)
   - Implement database service: src/lib/db/bible.service.ts
   - Update converter tests for database
   - Migrate upload logic

2. **Reader UI** (Week 3-4)
   - Route structure: /read, /read/[bibleId], /read/compare
   - Components: ReaderLayout, BiblePanel, BibleList, UploadModal
   - Integrate svelte-golden-layout for panel docking

3. **Chat Integration** (Week 5)
   - Unified AI service layer
   - ChatPanel and VoiceControls components
   - WebRTC for OpenAI Realtime
   - WebSocket for Gemini Live

### Week 5-8: Integration & Polish
- Week 6-7: Workspace integration (Preview button, feedback loop)
- Week 8: Integration tests, performance, production deployment

---

## 🔗 Key Files to Review

**Before starting implementation:**
1. Read `docs/bible-reader/prd.md` - Understand requirements
2. Read `docs/bible-reader/architecture.md` - Understand design
3. Review `src/lib/features/reader/converter.test.ts` - Understand behavior
4. Review `docs/bible-reader/test-coverage.md` - Understand test strategy
5. Check `static/mockups/dual-panel-parallel-view.png` - Understand UI vision

**Reference during implementation:**
- `docs/bible-reader/evaluations/usfm-conversion-evaluation.md` - Library details
- `docs/bible-reader/ui-mockup-analysis.md` - Design system specs
- `docs/bible-reader/prd.md` Section 6.1 - POC chat/voice patterns

---

## 🎓 Context for AI Assistants

**Project Name:** Glossa (with Bible Reader feature)
**Tech Stack:** SvelteKit 2.59 + Svelte 5.55 + Bun 1.3.13 + Tailwind CSS 4.2.4 + Vitest 4.1.5
**Database:** SQLite (migrating from file system)
**Testing:** TDD approach (RED → GREEN → REFACTOR)

**Development Philosophy:**
- TDD: Write tests first, then implement
- Minimal dependencies: Choose libraries carefully
- LTS versions preferred: Stability over bleeding edge
- Tailwind-first: Pure utility CSS, no component libraries

**Current Phase:** GREEN phase of TDD
- We have 70 RED tests
- Need to implement converter.ts to make them pass
- Follow test requirements exactly

**AGENTS.md Instructions:**
- Main instructions: `Glossa/AGENTS.md`
- Bible Reader context: `docs/bible-reader/AGENT.md`
- Precedence: Glossa AGENTS.md > bible-reader/AGENT.md

---

## 📝 SQL Todo Tracking

The project uses SQL for todo tracking:

```sql
-- View current status
SELECT id, title, status FROM todos 
WHERE status IN ('in_progress', 'pending')
ORDER BY CASE status WHEN 'in_progress' THEN 0 ELSE 1 END;

-- Update todo status
UPDATE todos SET status = 'in_progress' WHERE id = 'usfm-converter';
UPDATE todos SET status = 'done' WHERE id = 'usfm-converter';

-- View dependencies
SELECT t.id, t.title, GROUP_CONCAT(td.depends_on) as dependencies
FROM todos t
LEFT JOIN todo_deps td ON t.id = td.todo_id
GROUP BY t.id;
```

**Current Status:**
- ✅ Done (3): research-docking, research-usfm, install-dependencies
- 🚧 In Progress (1): usfm-converter
- ⏳ Pending (6): zip-upload-api, convert-api, docking-panels, bible-reader-ui, usj-styling, integration-test

---

## 🚀 Quick Start Commands

```bash
# Navigate to Glossa
cd Glossa

# Verify installation
bun --version  # Should be 1.3.13+

# Run converter tests (should see 70 RED tests)
bun test src/lib/features/reader/converter.test.ts

# Run test UI (interactive)
bun test:ui

# Run all tests
bun test

# Start dev server (when ready)
bun run dev

# Check git status
git status
git log --oneline -5
```

**Expected test output (before implementation):**
```
error: Cannot find module './converter' from 'converter.test.ts'
0 pass, 1 fail, 1 error
```

---

## 🎯 Success Criteria

**Phase 2 Complete (Week 2):**
- [ ] All 70 converter tests pass (GREEN)
- [ ] SQLite schema created
- [ ] Database service implemented
- [ ] Upload logic migrated

**Phase 3 Complete (Week 3-4):**
- [ ] /read routes working
- [ ] Can upload Bible zip
- [ ] Can view Bible in panels
- [ ] Panel docking functional

**Phase 4 Complete (Week 5):**
- [ ] Chat panel functional
- [ ] Voice controls working
- [ ] OpenAI/Gemini integration complete

**Phase 5 Complete (Week 6-7):**
- [ ] Preview button in workspace
- [ ] Draft content flows to reader
- [ ] Feedback loop functional

**Phase 6 Complete (Week 8):**
- [ ] 80%+ test coverage
- [ ] Integration tests pass
- [ ] Production-ready performance
- [ ] Deployed and working

---

## 💡 Important Notes

1. **No data loss:** All Bible Reader work is preserved in commit e0a47ca
2. **Parallel workstream:** Bible Reader implementation doesn't block Glossa Phase 1 (Malayalam POC)
3. **TDD discipline:** Stay in RED → GREEN → REFACTOR cycle
4. **Test first:** Don't implement features without tests
5. **Unified vision:** Bible Reader is now a feature of Glossa, not a separate app

---

## 📞 Original Context

This merge came from a standalone Bible Reader project that started as:
1. POC chat app (Node.js + Express + vanilla JS)
2. Decision to rebuild with SvelteKit + Bun + TDD
3. Extensive planning: PRD, architecture, library evaluations
4. 70 RED tests written for USFM converter
5. Discovery of Glossa symlink → merge decision
6. Complete merge into Glossa monolith

**Original Bible Reader branch:** `poc` (preserved for reference)
**Original location:** `C:\Users\BCS_Support\Documents\dev\experiments\the.bible\read`

---

## ✨ Ready to Code!

You're all set to continue! Open Glossa workspace and:

1. **Review the docs** (especially prd.md, architecture.md, converter.test.ts)
2. **Start GREEN phase**: Implement `src/lib/features/reader/converter.ts`
3. **Make tests pass**: One category at a time (basic → styles → features → edge cases)
4. **Stay disciplined**: TDD cycle, no shortcuts

**First command to run:**
```bash
cd Glossa
bun test src/lib/features/reader/converter.test.ts --watch
```

This will run tests in watch mode, showing failures as you implement.

---

**Good luck! The foundation is solid. Time to build. 🚀**
