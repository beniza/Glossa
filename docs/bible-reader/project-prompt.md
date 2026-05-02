# Bible Reader Project - AI Assistant Prompt

Use this prompt to onboard AI assistants (Gemini, ChatGPT, Claude, etc.) to the Bible Reader project.

---

## Project Overview Prompt

```
I'm working on a Bible Reader web application with integrated AI chat and voice features. Here's what you need to know:

## Project Name
**Bible Reader with AI Chat & Voice**

## What It Does
A SvelteKit web application that allows users to:
1. Upload USFM (Unified Standard Format Markers) Bible translations as zip files
2. Read and display formatted Bible text in dockable/floatable panels
3. Compare multiple Bible translations side-by-side
4. Chat with AI (OpenAI GPT-4o-mini) about Bible content using text or voice
5. Use multi-provider voice chat (OpenAI Realtime WebRTC + Gemini Live WebSocket)

## Current Status
- ✅ Project initialized with SvelteKit + Bun + TypeScript + Tailwind CSS
- ✅ Documentation complete (PRD, architecture, library evaluations, test coverage)
- ✅ 70 comprehensive RED tests written for USFM converter (TDD approach)
- ⏳ Currently in GREEN phase: implementing USFM converter
- ⏸️ Pending: API routes, components, chat/voice integration, docking system

## Technology Stack

**Frontend:**
- SvelteKit 2.59 (framework)
- Svelte 5.55 (component library with runes)
- TypeScript 6.0
- Tailwind CSS 4.2.4 (pure utility, no component library)
- Vite 8.0 (build tool)

**Backend:**
- Bun 1.3.13 (runtime & package manager)
- SvelteKit API routes (RESTful endpoints)
- WebSocket proxy for Gemini Live

**Bible Processing:**
- usfm-grammar 3.2.0 (USFM → USJ → HTML converter)
- adm-zip 0.5.17 (zip file extraction)
- File system storage (data/bibles/{bibleId}/)

**Chat/Voice:**
- OpenAI SDK 6.35.0 (text chat + Realtime API)
- WebRTC (OpenAI voice - bidirectional audio)
- WebSocket + ws 8.20.0 (Gemini Live voice proxy)
- Web Audio API (audio resampling, playback queue)

**Docking:**
- svelte-golden-layout 0.1.1 (MVP implementation)
- Future: Custom Svelte with svelte-dnd-action

**Testing:**
- Vitest 4.1.5 (test runner)
- @vitest/ui 4.1.5 (test UI)

**Environment:**
- Windows 10.0.26200
- Bun 1.3.13
- Node.js v24.13.0 (for node-gyp only)

## Architecture

**5-Layer Architecture:**
1. **Presentation Layer**: Svelte components (BibleReaderPanel, ChatPanel, DockingLayout)
2. **Business Logic Layer**: Svelte stores + USFM converter + chat utilities
3. **API Layer**: SvelteKit routes (/api/bible/*, /api/chat, /api/realtime/*)
4. **Data Layer**: File system + localStorage + in-memory cache
5. **External Services**: OpenAI API + Gemini API

**Data Flow:**
- Bible Upload: User → Upload zip → Extract USFM → Store files → Parse metadata
- Bible Display: User → Select book/chapter → Read USFM → Convert to HTML → Render
- Text Chat: User → Send message → OpenAI API → Response → Update store
- Voice Chat: User → Toggle voice → WebRTC/WebSocket → Bidirectional audio → Transcripts

**State Management:**
- `bibles.ts` store: Bible metadata, uploaded Bibles list
- `chat.ts` store: Message history, voice connection state
- `panels.ts` store: Panel layout, docking configuration
- `navigation.ts` store: Current book/chapter per panel

## File Structure

```
read/
├── AGENT.md                    # Agent instructions (single source of truth)
├── doc/
│   ├── bible-reader-prd.md              # Product requirements (v1.1)
│   ├── architecture.md                  # System architecture + Mermaid diagrams
│   ├── docking-library-evaluation.md    # Docking solution comparison
│   ├── usfm-conversion-evaluation.md    # USFM parser comparison
│   ├── test-coverage.md                 # Test strategy & gap analysis
│   └── project-prompt.md                # This file
├── src/
│   ├── lib/
│   │   ├── usfm/
│   │   │   ├── converter.ts             # ⏳ USFM → HTML converter (implementing)
│   │   │   ├── converter.test.ts        # ✅ 70 RED tests
│   │   │   └── parser.ts                # usfm-grammar wrapper
│   │   ├── chat/
│   │   │   ├── voice.ts                 # WebRTC/WebSocket helpers
│   │   │   └── audio.ts                 # Audio processing utilities
│   │   ├── stores/
│   │   │   ├── bibles.ts                # Bible metadata store
│   │   │   ├── chat.ts                  # Chat/voice state store
│   │   │   ├── panels.ts                # Panel layout store
│   │   │   └── navigation.ts            # Navigation state store
│   │   └── components/
│   │       ├── BibleReaderPanel.svelte  # Bible display component
│   │       ├── ChatPanel.svelte         # Chat interface component
│   │       └── DockingLayout.svelte     # Panel docking system
│   ├── routes/
│   │   ├── +page.svelte                 # Main app page
│   │   ├── +layout.svelte               # Root layout
│   │   └── api/
│   │       ├── bible/
│   │       │   ├── upload/+server.ts    # POST: Upload Bible zip
│   │       │   ├── list/+server.ts      # GET: List Bibles
│   │       │   └── convert/[bibleId]/[bookId]/[chapter]/+server.ts
│   │       ├── chat/+server.ts          # POST: Text chat
│   │       ├── realtime/token/+server.ts # GET: OpenAI token
│   │       ├── transcribe/+server.ts    # POST: Audio transcription
│   │       └── google-live/+server.ts   # WebSocket: Gemini proxy
│   ├── app.css                          # Tailwind directives
│   └── app.html                         # HTML template
├── static/                              # Static assets
├── data/                                # Bible storage (git-ignored)
│   └── bibles/
│       └── {bibleId}/
│           └── {bookId}.usfm
├── package.json                         # Dependencies & scripts
├── bun.lock                             # Bun lockfile
├── tailwind.config.ts                   # Tailwind configuration
├── vitest.config.ts                     # Test configuration
└── .env                                 # API keys (git-ignored)
```

## Key Features (from PRD)

**Bible Reader:**
- Upload USFM Bible translations (zip file)
- Auto-extract and parse 66 books
- Rich formatting: verses, chapters, poetry, footnotes, cross-references
- Navigation: book/chapter selector, prev/next buttons
- Dockable/floatable panels
- Multi-panel comparison view

**AI Chat:**
- Text chat with OpenAI GPT-4o-mini
- Context-aware Bible discussions
- Message history persistence (localStorage)

**Voice Chat (from POC):**
- **OpenAI Realtime API**: WebRTC bidirectional audio, live transcription
- **Gemini Live API**: WebSocket audio streaming, PCM16 16kHz resampling
- Audio engineering: resampling, playback queue, normalization
- Voice UI: Single toggle button, status indicators (Ready/Listening/Thinking)
- Model selection: OpenAI vs Gemini

## Development Philosophy

**TDD (Test-Driven Development):**
1. **RED**: Write failing tests first
2. **GREEN**: Implement minimum code to pass tests
3. **REFACTOR**: Clean up implementation

**Project Rules:**
- Use `bun` (not npm), `bunx` (not npx)
- Never commit secrets (use .env)
- Minimalist, atomic commits with descriptive messages
- Prefer LTS versions over latest
- Verify library compatibility before installing
- If LLM can't do something, say so explicitly

**Branch Strategy:**
- `main`: Active development (SvelteKit implementation)
- `poc`: Original Express + vanilla JS chat app (reference only, preserved)

## Current Implementation Status

**Completed:**
- ✅ Project initialization (SvelteKit + Bun + dependencies)
- ✅ Tailwind CSS setup (v4.2.4)
- ✅ PRD with POC chat features documented
- ✅ Architecture documentation (9 Mermaid diagrams)
- ✅ Library evaluations (docking, USFM conversion)
- ✅ Test coverage analysis (gaps identified)
- ✅ 70 RED tests for USFM converter
- ✅ AGENT.md (project instructions)

**In Progress:**
- ⏳ USFM converter implementation (GREEN phase)

**Pending (Todo list):**
1. `usfm-converter` - Implement converter.ts (IN PROGRESS)
2. `zip-upload-api` - POST /api/bible/upload endpoint
3. `convert-api` - GET /api/bible/convert endpoint
4. `docking-panels` - Integrate svelte-golden-layout
5. `bible-reader-ui` - BibleReaderPanel component
6. `usj-styling` - Port CSS for USJ elements
7. `integration-test` - End-to-end testing

## Test Coverage

**Current:** 70 tests (all RED), 0% coverage  
**Target:** 150+ tests, 80%+ coverage

**Test Breakdown:**
- USFM Converter: 70 tests (basic structure, character styles, unicode, edge cases, performance)
- API Routes: 0 tests (30+ needed)
- Svelte Stores: 0 tests (25+ needed)
- Components: 0 tests (20+ needed)
- Chat/Voice: 0 tests (15+ needed)
- Integration: 0 tests (10+ scenarios needed)

**Corner Cases Covered:**
- Unicode (Greek, Hebrew, Arabic, Chinese, emoji)
- RTL text handling
- XSS prevention (HTML escaping)
- Edge cases (empty input, unclosed markers, malformed USFM)
- Performance (Psalm 119: 176 verses, Genesis: 50 chapters)
- File size extremes (0 bytes to 10MB+)

## Key Technical Decisions

**USFM Conversion:**
- Chose `usfm-grammar` over Paranext Official (easier install, same quality)
- Pipeline: USFM string → usfm-grammar.toUSJ() → custom HTML renderer
- File format: Paratext structure (data/bibles/{bibleId}/{bookId}.usfm)

**Docking:**
- Phase 1 (MVP): svelte-golden-layout (2-3 days)
- Phase 2 (Production): Custom Svelte solution (1-2 weeks)

**Styling:**
- Pure Tailwind CSS (no shadcn, no component library)
- Full control over design system

**Voice Chat:**
- OpenAI: WebRTC for realtime, REST for chat/transcription
- Gemini: WebSocket proxy, Float32 → PCM16 resampling
- Audio playback queue with timing

## Performance Targets

- Bible upload: < 5s (10MB zip)
- USFM conversion: < 500ms per chapter
- Chapter navigation: < 200ms (with caching)
- Panel operations: < 100ms
- Voice latency: < 2s (end-to-end)

## Security Considerations

- All user content HTML-escaped (XSS prevention)
- API keys in .env (never committed)
- Path traversal protection (file uploads)
- Zip bomb protection (size limits)
- Input validation on all API endpoints

## How to Run

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Run tests
bun test

# Run tests with UI
bun test:ui

# Build for production
bun run build
```

## Environment Variables Required

```env
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
```

## Documentation References

Read these files for complete context:
1. `AGENT.md` - Project instructions and rules
2. `doc/bible-reader-prd.md` - Product requirements (31KB)
3. `doc/architecture.md` - System architecture (20KB, 9 diagrams)
4. `doc/test-coverage.md` - Test strategy (21KB)
5. `doc/docking-library-evaluation.md` - Docking comparison (18KB)
6. `doc/usfm-conversion-evaluation.md` - USFM parser comparison (18KB)

## POC Reference (Branch: poc)

The `poc` branch contains the original Express + vanilla JS implementation:
- `server.js` (221 lines): OpenAI + Gemini endpoints
- `public/index.html` (568 lines): Chat UI with WebRTC/WebSocket voice

**Key patterns to migrate:**
- OpenAI Realtime: Ephemeral token → WebRTC → bidirectional audio
- Gemini Live: WebSocket proxy → Float32 → PCM16 → base64
- Audio resampling: Browser rate → 16kHz
- Voice UI: Toggle button, status indicators
- Partial message streaming

## Next Steps

1. **Immediate**: Implement converter.ts to pass 70 RED tests
2. **Short-term**: Build API routes and Svelte stores
3. **Medium-term**: Create components and integrate docking
4. **Long-term**: Port chat/voice features from POC, add integration tests

## Questions to Ask Me

If you need clarification:
- "What specific USFM markers should the converter handle?"
- "How should the docking panels persist state?"
- "What's the expected behavior for [specific feature]?"
- "Should I reference the POC implementation for [chat/voice feature]?"
- "What edge cases should I prioritize for [module]?"

## What NOT to Do

- Don't use npm/npx (use bun/bunx)
- Don't commit API keys or secrets
- Don't install libraries without checking LTS versions
- Don't skip writing tests (TDD approach required)
- Don't modify POC branch (reference only)
- Don't use shadcn or component libraries (pure Tailwind)

---

**Ready to help!** Tell me what you need assistance with.
```

---

## Usage

Copy the prompt above and paste it into:
- **Google Gemini** (gemini.google.com)
- **ChatGPT** (chat.openai.com)
- **Claude** (claude.ai)
- **Any AI assistant**

Then ask your specific questions or request help with implementation.

## Example Follow-up Questions

After providing the prompt, you can ask:
- "Help me implement the convertUSFMToHTML function to pass all 70 tests"
- "Design the API endpoint for Bible upload"
- "Create the BibleReaderPanel Svelte component"
- "Explain how to integrate svelte-golden-layout"
- "Write tests for the bibles.ts Svelte store"
