# Bible Reader Feature

**Merged:** May 2, 2026  
**Status:** In Development (Phase 1: Tests + Documentation)

---

## Overview

Bible Reader is an integrated feature in Glossa that provides a consumer-focused reading interface for USFM Bible translations with AI chat and voice assistance.

---

## Documentation

- **[PRD](./prd.md)** - Product Requirements Document
- **[Architecture](./architecture.md)** - System architecture with Mermaid diagrams
- **[Test Coverage](./test-coverage.md)** - Test strategy and gap analysis
- **[UI Mockup Analysis](./ui-mockup-analysis.md)** - Design specifications from mockups
- **[UI Prompt](./ui-prompt.md)** - Google Stitch design prompt
- **[Project Prompt](./project-prompt.md)** - AI assistant onboarding prompt
- **[Merge Analysis](./merge-analysis.md)** - Why and how we merged with Glossa
- **[AGENT.md](./AGENT.md)** - Original Bible Reader agent instructions

---

## Features

### Core Features
- Upload USFM Bible translations (zip files)
- Display formatted Bible text (chapters, verses, poetry, footnotes)
- Multi-panel comparison (side-by-side translations)
- Dockable/floatable panels
- Navigation (book/chapter selectors, prev/next buttons)

### AI Integration
- Text chat with OpenAI GPT-4o-mini
- Voice chat with OpenAI Realtime API (WebRTC)
- Voice chat with Gemini Live API (WebSocket)
- Context-aware Bible discussions

---

## Tech Stack

- **Framework:** SvelteKit 2.59 + Svelte 5.55
- **Styling:** Tailwind CSS 4.2.4 (pure utility)
- **USFM Parser:** usfm-grammar 3.2.0 (USFM → USJ → HTML)
- **Docking:** svelte-golden-layout 0.1.1 (MVP)
- **Chat/Voice:** OpenAI SDK 6.35.0, WebSocket (ws 8.20.0)
- **Storage:** SQLite (migrated from file system)
- **Testing:** Vitest 4.1.5

---

## File Structure

```
Glossa/
├── docs/bible-reader/           # Documentation (this folder)
├── static/mockups/              # UI mockups (5 images)
└── src/lib/features/reader/     # Bible Reader code
    ├── converter.test.ts        # 70 RED tests (TDD)
    ├── converter.ts             # USFM → HTML converter (to be implemented)
    ├── parser.ts                # usfm-grammar wrapper
    └── components/              # Svelte components (to be implemented)
        ├── BiblePanel.svelte
        ├── ReaderLayout.svelte
        ├── ChatPanel.svelte
        └── UploadModal.svelte
```

---

## Current Status

### ✅ Completed (Phase 1)
- Documentation merged from Bible Reader project
- 70 comprehensive RED tests written (TDD approach)
- UI mockups available (5 PNG files)
- Test coverage analysis complete
- Architecture documented
- Dependencies merged into package.json

### ⏳ In Progress
- None (awaiting Phase 2 start)

### 📋 Pending (Phase 2+)
- Storage adaptation (file system → SQLite)
- Implement converter.ts (GREEN phase - make 70 tests pass)
- Create database schema (bibles, bible_books, rendered_chapters)
- Implement Bible Reader UI components
- Add panel docking system
- Integrate AI chat/voice
- Connect with Glossa workspace (preview mode)

---

## Test Coverage

**Current:** 70 RED tests (all failing - module not found)  
**Target:** 150+ tests, 80%+ coverage

**Test Breakdown:**
- USFM Converter: 70 tests
  - Basic structure (3)
  - Paragraphs (1)
  - Poetry & indentation (2)
  - Headings (2)
  - Footnotes & cross-refs (2)
  - Character styles (8)
  - Special features (5)
  - Introductions (5)
  - Complex footnotes (4)
  - Word-level markup (2)
  - Poetry special markers (2)
  - Alternative numbers (3)
  - Unicode & i18n (7)
  - Edge cases - whitespace (3)
  - Edge cases - markers (8)
  - Edge cases - special content (3)
  - Edge cases - file size (3)
  - Performance (2)

See [test-coverage.md](./test-coverage.md) for full details and gap analysis.

---

## UI Mockups

5 mockups available in `static/mockups/`:
1. `bible_reader_study_view.png` - 3-panel study interface
2. `chat.png` - AI chat integration with voice
3. `dual-panel-parallel-view.png` ⭐ **Primary reference**
4. `no-content-view.png` - Empty states
5. `upload-bible-usfm.png` - Upload modal

See [ui-mockup-analysis.md](./ui-mockup-analysis.md) for detailed analysis.

---

## Development Workflow

### Running Tests

```bash
cd Glossa
bun test                    # Run all tests
bun test:ui                 # Run with UI
bun test src/lib/features/reader/converter.test.ts  # Run only converter tests
```

### Implementation Approach (TDD)

1. **RED:** Tests are written (✅ Done - 70 tests)
2. **GREEN:** Implement converter.ts to make tests pass
3. **REFACTOR:** Clean up implementation
4. **REPEAT:** For each component

### Commit Strategy

- Atomic commits per feature
- Tests committed before implementation
- Follow Glossa's git discipline guidelines

---

## Integration with Glossa Workspace

**Vision:** Unified production-to-consumption pipeline

1. **Translation Team** uses Workspace mode to create/adapt resources
2. **Glossa validates** and publishes content
3. **Public Readers** use Reader mode to consume content
4. **Translators** use Reader mode to review formatted output
5. **Feedback loop:** Issues found in reading inform translation improvements

---

## Performance Targets

- Bible upload: < 5s (10MB zip)
- USFM conversion: < 500ms per chapter
- Chapter navigation: < 200ms (with caching)
- Panel operations: < 100ms
- Voice latency: < 2s (end-to-end)

---

## Next Steps

See [merge-analysis.md](./merge-analysis.md) for 8-week implementation plan.

**Week 2:** Storage adaptation (file → SQLite)  
**Week 3-4:** Reader UI implementation  
**Week 5:** Chat/voice integration  
**Week 6-7:** Workspace integration  
**Week 8:** Polish & production-ready

---

## Contributing

Follow Glossa's AGENTS.md guidelines when working on Bible Reader:
- TDD approach (tests first)
- Depth-first implementation
- Never commit without approval
- Address user as "Emissary"

---

**Last Updated:** May 2, 2026
