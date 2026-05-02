# Product Requirements Document: Bible Reader Feature

**Version:** 1.1  
**Date:** May 2, 2026  
**Author:** Development Team  
**Status:** Draft for Review

**Changelog:**
- v1.1: Updated technology stack to Svelte + Bun (from vanilla JS + npm)
- v1.0: Initial PRD

---

## 1. Executive Summary

### 1.1 Overview
Add a Bible reader feature to the existing AI chat application that enables users to upload USFM (Unified Standard Format Markers) Bible translations and read them in a rich, formatted interface. Each Bible translation will be displayed in independent, dockable/floatable panels, allowing users to view and compare multiple translations simultaneously.

### 1.2 Problem Statement
Currently, the application supports AI chat and voice interactions but lacks Scripture reading capabilities. Users who want to reference or study Bible passages alongside AI conversations have no integrated way to do so. This feature will bridge that gap by providing a professional-grade Bible reading experience within the same application.

### 1.3 Goals
- Enable users to upload and read USFM-formatted Bible translations
- Provide a flexible, multi-panel interface for reading multiple translations
- Render Bibles with proper formatting (verses, chapters, poetry, footnotes, etc.)
- Integrate seamlessly with existing chat functionality
- Use official Paranext libraries for USFM parsing to ensure accuracy and standards compliance

---

## 2. User Personas

### 2.1 Primary Persona: Bible Study Enthusiast
- **Name:** Sarah, Seminary Student
- **Age:** 28
- **Technical Skill:** Intermediate
- **Needs:** 
  - Compare multiple Bible translations side-by-side
  - Read formatted Scripture with proper verse structure
  - Quick navigation between books and chapters
  - Ability to reference Scripture while using AI for theological questions

### 2.2 Secondary Persona: Bible Translator
- **Name:** David, Translation Consultant
- **Age:** 45
- **Technical Skill:** Advanced
- **Needs:**
  - Review USFM files in formatted output
  - Validate translation formatting
  - Check poetry, footnotes, and special markers rendering
  - Work with custom or in-progress translations

### 2.3 Tertiary Persona: Casual Reader
- **Name:** Michael, Church Member
- **Age:** 35
- **Technical Skill:** Basic
- **Needs:**
  - Simple Bible reading experience
  - Easy navigation
  - Clean, readable formatting
  - No technical complexity in usage

---

## 3. User Stories

### 3.1 Core User Stories

**US-1: Upload Bible Translation**
- **As a** user
- **I want to** upload a zip file containing USFM Bible files
- **So that** I can read the Bible in the application
- **Acceptance Criteria:**
  - User can click an upload button and select a .zip file
  - System extracts USFM files from the zip
  - System displays success message and list of books found
  - System validates that zip contains valid USFM files

**US-2: Open Bible in Panel**
- **As a** user
- **I want to** open an uploaded Bible in a new panel
- **So that** I can read it alongside other content
- **Acceptance Criteria:**
  - User can select a Bible from uploaded Bibles list
  - New panel opens with Bible content
  - Panel is dockable and floatable
  - Panel can be resized, minimized, maximized, closed

**US-3: Navigate Bible Content**
- **As a** user
- **I want to** navigate to any book and chapter
- **So that** I can read specific passages
- **Acceptance Criteria:**
  - Dropdown/selector for book selection
  - Dropdown/selector for chapter selection
  - Previous/Next chapter navigation buttons
  - Navigation updates the displayed content

**US-4: View Formatted Bible Text**
- **As a** user
- **I want to** see properly formatted Bible text
- **So that** I can read it naturally with proper structure
- **Acceptance Criteria:**
  - Chapters are clearly marked
  - Verses are numbered and distinguishable
  - Poetry is indented appropriately
  - Headings are styled differently from body text
  - Footnotes and cross-references are accessible
  - Paragraphs have proper spacing

**US-5: Multiple Bible Panels**
- **As a** user
- **I want to** open multiple Bible translations simultaneously
- **So that** I can compare translations
- **Acceptance Criteria:**
  - Can open 2+ Bibles in separate panels
  - Each panel is independent
  - Can arrange panels side-by-side, stacked, or floating
  - Each panel maintains its own navigation state

**US-6: Panel Layout Persistence**
- **As a** user
- **I want to** have my panel layout saved
- **So that** I don't have to rearrange panels every time
- **Acceptance Criteria:**
  - Panel positions saved to browser storage
  - Layout restored on page reload
  - Option to reset to default layout

### 3.2 Future User Stories (Out of Scope for MVP)

**US-7: Verse Search** - Search for verses across loaded Bibles  
**US-8: Copy Verse** - Copy verse text with reference formatting  
**US-9: Parallel View** - Synchronized scrolling between translations  
**US-10: Bookmarks** - Save favorite passages  
**US-11: Dark Mode** - Toggle dark/light theme for reading  
**US-12: Export Passages** - Export selected passages to PDF/text

---

## 4. Functional Requirements

### 4.1 Bible Upload & Management

**FR-1.1** System shall accept .zip file uploads containing USFM files  
**FR-1.2** System shall extract and parse USFM files from uploaded zip  
**FR-1.3** System shall validate USFM file structure and report errors  
**FR-1.4** System shall store uploaded USFM files (in-memory or temporary storage)  
**FR-1.5** System shall display list of successfully uploaded Bibles with metadata (name, books count)  
**FR-1.6** System shall allow users to remove uploaded Bibles from memory  
**FR-1.7** System shall support standard Paratext USFM folder structure

### 4.2 USFM Conversion

**FR-2.1** System shall convert USFM to USJ (Unified Scripture JSON) using Paranext libraries  
**FR-2.2** System shall convert USJ to formatted HTML for display  
**FR-2.3** Conversion shall happen on-demand (per chapter) for performance  
**FR-2.4** System shall handle all standard USFM markers:
  - Book identification (\id, \toc1, \toc2, \h, \mt)
  - Chapter markers (\c)
  - Verse markers (\v)
  - Paragraph markers (\p, \m, \pmo, \pm, etc.)
  - Poetry markers (\q, \q1, \q2, \q3, \qa, \qm)
  - List markers (\li, \li1, \li2, etc.)
  - Heading markers (\s, \s1, \s2, \ms, \mr, etc.)
  - Footnotes (\f, \fe, \ef)
  - Cross-references (\x, \xo, \xt)
  - Character styling (\nd, \add, \bd, \it, etc.)
  - Special text markers
  
**FR-2.5** System shall preserve USFM formatting in HTML output  
**FR-2.6** System shall handle malformed USFM gracefully with error messages

### 4.3 Panel Management

**FR-3.1** System shall support dockable panels using a JavaScript docking library  
**FR-3.2** Panels shall be draggable to different dock positions  
**FR-3.3** Panels shall be detachable into floating windows  
**FR-3.4** Panels shall be resizable with drag handles  
**FR-3.5** Panels shall support minimize/maximize/close actions  
**FR-3.6** System shall allow multiple panels to be open simultaneously (min 2, recommended up to 4)  
**FR-3.7** Panel layout shall persist to localStorage  
**FR-3.8** System shall provide "Reset Layout" functionality  
**FR-3.9** Each panel shall maintain independent state (Bible selection, book, chapter)

### 4.4 Bible Reader UI

**FR-4.1** Each panel shall display:
  - Bible name/translation identifier
  - Book selector (dropdown or searchable list)
  - Chapter selector (dropdown or number input)
  - Previous/Next chapter navigation buttons
  - Bible content display area
  - Panel controls (minimize, maximize, close)

**FR-4.2** Book selector shall list all 66 books (OT + NT) if available  
**FR-4.3** Chapter selector shall show available chapters for selected book  
**FR-4.4** Navigation shall update URL/state for deep linking (optional for MVP)  
**FR-4.5** Content area shall display formatted Bible text with scrolling  
**FR-4.6** System shall show loading indicator during conversion/fetch

### 4.5 Bible Formatting & Styling

**FR-5.1** Rendered Bible text shall include:
  - Chapter headings (e.g., "Chapter 3")
  - Section headings from USFM
  - Verse numbers as superscript or styled markers
  - Paragraph breaks
  - Poetry indentation (multiple levels)
  - List indentation (multiple levels)
  - Inline character styling (bold, italic, small caps)
  - Footnote indicators with popover/tooltip content
  - Cross-reference indicators

**FR-5.2** Styling shall be based on Paranext's USJ CSS (usj-nodes.css)  
**FR-5.3** Text shall be readable with appropriate font size and line height  
**FR-5.4** Styling shall support light mode (dark mode is future enhancement)

---

## 5. Non-Functional Requirements

### 5.1 Performance

**NFR-1.1** Zip file upload and extraction shall complete within 5 seconds for files up to 10MB  
**NFR-1.2** USFM-to-HTML conversion shall complete within 500ms per chapter  
**NFR-1.3** Panel operations (open, close, dock, float) shall be responsive (<100ms)  
**NFR-1.4** Application shall support up to 4 simultaneous Bible panels without performance degradation  
**NFR-1.5** Chapter navigation shall feel instant (<200ms)

### 5.2 Usability

**NFR-2.1** Bible reader UI shall be intuitive without requiring documentation  
**NFR-2.2** Error messages shall be clear and actionable  
**NFR-2.3** UI shall be responsive and work on desktop screens (1280px+ width)  
**NFR-2.4** Panel controls shall be discoverable and accessible

### 5.3 Reliability

**NFR-3.1** System shall handle malformed USFM gracefully without crashes  
**NFR-3.2** Panel state persistence shall not fail silently  
**NFR-3.3** Failed uploads shall provide clear error messages  
**NFR-3.4** System shall validate zip contents before processing

### 5.4 Maintainability

**NFR-4.1** Code shall follow existing project conventions  
**NFR-4.2** USFM conversion logic shall be modular and testable  
**NFR-4.3** Panel management shall be decoupled from Bible logic  
**NFR-4.4** Dependencies shall be kept minimal and up-to-date

### 5.5 Compatibility

**NFR-5.1** Shall work in Chrome, Firefox, Edge (latest versions)  
**NFR-5.2** Shall support USFM 3.0 and 3.1 specifications  
**NFR-5.3** Shall integrate with existing Express server architecture  
**NFR-5.4** Shall not break existing chat/voice functionality  
**NFR-5.5** Shall be compatible with Bun runtime and package manager  
**NFR-5.6** Shall leverage SvelteKit's SSR and routing capabilities where beneficial

---

## 6. Technical Architecture

### 6.1 POC Chat Features (To Be Integrated)

The existing POC chat application (preserved in `poc` branch) contains battle-tested chat and voice features that must be integrated into the new Bible Reader application. These features represent solved problems and working implementations.

#### 6.1.1 Multi-Provider Voice Support

**OpenAI Realtime API (WebRTC):**
- ✅ Full-duplex voice conversation using WebRTC `RTCPeerConnection`
- ✅ Server-side VAD (Voice Activity Detection) with 500ms silence threshold
- ✅ Real-time transcription using `gpt-4o-mini-transcribe`
- ✅ Streaming audio output with "marin" voice
- ✅ Interrupt handling (user can speak while assistant is talking)
- ✅ Client-side session token generation via `/api/realtime/token`
- ✅ SDP offer/answer negotiation with OpenAI's realtime endpoint

**Implementation Details:**
```javascript
// Token endpoint (server.js:53-75)
GET /api/realtime/token
- Creates ephemeral OpenAI session token
- Configures realtime session (model, voice, VAD settings)
- Returns client_secret for WebRTC connection

// Client-side WebRTC setup (index.html:335-412)
- RTCPeerConnection with microphone track
- Data channel "oai-events" for control messages
- Handles events: speech_started, speech_stopped, transcription deltas, audio transcript
- Automatic reconnection on failures
```

**Google Gemini Live API (WebSocket):**
- ✅ Native audio streaming via WebSocket (no WebRTC needed)
- ✅ Supports multiple Gemini models:
  - `gemini-3.1-flash-live-preview`
  - `gemini-2.5-flash-native-audio-preview-12-2025`
- ✅ Bidirectional streaming (audio in/out simultaneously)
- ✅ Real-time transcription for both user and assistant
- ✅ PCM16 audio resampling (browser sample rate → 16kHz)
- ✅ Audio playback with proper timing synchronization

**Implementation Details:**
```javascript
// WebSocket proxy (server.js:137-217)
GET /api/google-live?model=<model-name>
- Proxies client WebSocket to Google's generative language API
- Handles setup message with model config and system instructions
- Bidirectional message forwarding (client ↔ Google)
- Error handling and connection management

// Client-side audio processing (index.html:527-568)
- MediaStream capture with ScriptProcessor
- Float32 → PCM16 conversion
- Sample rate resampling to 16kHz
- Base64 encoding for WebSocket transmission
- Playback queue with timing management
```

#### 6.1.2 Text Chat API

**Simple Chat Endpoint:**
- ✅ `/api/chat` - Text-based chat using OpenAI `gpt-4o-mini`
- ✅ Stateless single-turn conversation (extendable to multi-turn)
- ✅ Concise system instruction
- ✅ Error handling with descriptive messages

**Implementation:**
```javascript
// server.js:102-130
POST /api/chat
{
  "message": "user message text"
}
→ { "answer": "assistant response" }
```

#### 6.1.3 Audio Transcription Fallback

**Standalone Transcription:**
- ✅ `/api/transcribe` - Convert recorded audio to text
- ✅ Accepts audio/* MIME types (WebM, MP3, WAV, etc.)
- ✅ 25MB file size limit
- ✅ Uses OpenAI's `gpt-4o-mini-transcribe` model
- ✅ Returns plain text transcription

**Use Case:** Backup option if real-time voice fails, or for batch transcription

#### 6.1.4 UI/UX Patterns

**Voice Session Management:**
- ✅ Single "Voice" button toggles connection (Voice/End)
- ✅ Visual state indicators:
  - `Ready` - idle
  - `Connecting voice...` - establishing connection
  - `Listening...` - waiting for user speech
  - `Thinking...` - processing user input
  - `Voice connected` - session active
  - `Microphone blocked` - permission denied
- ✅ Model selector dropdown (OpenAI/Gemini 3.1/Gemini 2.5)
- ✅ Disable controls during operations to prevent double-clicks

**Message Display:**
- ✅ Partial/incremental message updates (streaming transcripts)
- ✅ Separate bubbles for user/assistant with visual distinction
- ✅ Auto-scroll to latest message
- ✅ Message cleanup on completion (partial → final)

**Browser Compatibility Detection:**
- ✅ Checks for `getUserMedia`, `RTCPeerConnection`, `WebSocket`, `AudioContext`
- ✅ Disables voice button if unsupported
- ✅ Descriptive error messages for missing features

#### 6.1.5 Audio Engineering Solutions

**Resampling Algorithm:**
- ✅ Linear interpolation for sample rate conversion (browser rate → 16kHz)
- ✅ Efficient Float32 → PCM16 conversion with proper clipping

**Playback Synchronization:**
- ✅ Timing queue to prevent audio overlap
- ✅ Tracks `playbackTime` across chunks
- ✅ Smooth concatenation of audio segments

**Error Recovery:**
- ✅ Graceful session cleanup on disconnect
- ✅ Media track cleanup (prevent microphone leaks)
- ✅ AudioContext cleanup (prevent memory leaks)

#### 6.1.6 Multi-Language Support

**Built-in Prompts:**
- ✅ System instruction: "Reply in the same language the user is speaking when you can infer it"
- ✅ Both OpenAI and Gemini use this instruction
- ✅ Tested with multiple languages (implicit from prompt)

#### 6.1.7 Environment Configuration

**Required API Keys:**
```env
OPENAI_API_KEY=sk-...
GOOGLE_API_KEY=AIza...
PORT=3000
```

**Security:**
- ✅ Server-side API key management (never exposed to client)
- ✅ Ephemeral session tokens for OpenAI (short-lived)
- ✅ WebSocket authentication via query parameters for Gemini

#### 6.1.8 Dependencies (POC)

```json
{
  "express": "^4.19.2",
  "dotenv": "^16.4.5",
  "openai": "^4.68.1",
  "ws": "^8.20.0"
}
```

### 6.2 Technology Stack (New Bible Reader App)

**Framework & Build Tools:**
- SvelteKit (full-stack framework with SSR + routing)
- TypeScript (type safety)
- Bun (package manager and build tool)
- Vite (bundler, built into SvelteKit)

**Backend (SvelteKit API Routes):**
- SvelteKit API routes (replaces Express endpoints)
- Multer or native SvelteKit form handling (file uploads)
- adm-zip (zip extraction)
- usfm-grammar (USFM → USJ conversion)
- openai (chat and voice APIs, from POC)
- ws (WebSocket for Gemini proxy, from POC)

**Frontend:**
- Svelte 5 components
- TypeScript (for type safety)
- Svelte stores (for state management)
- svelte-golden-layout (docking, Phase 1)
- Custom Svelte docking (Phase 2, optional)

**Storage:**
- File system for uploaded USFM files (persistent)
- localStorage for panel layout persistence (client-side)
- Svelte stores for reactive client-side state management

**Chat Integration:**
- Migrate POC chat endpoints to SvelteKit API routes
- Integrate chat UI into Bible Reader layout (panel or sidebar)
- Reuse POC voice implementation (OpenAI + Gemini)
- Keep multi-provider support and all POC features

### 6.3 API Endpoints

**Bible Management:**

**POST /api/bible/upload**
- Accepts: multipart/form-data (zip file)
- Returns: { bibleId, name, books: [{ bookId, name }] }
- Stores USFM files on file system with unique bibleId

**GET /api/bible/list**
- Returns: [{ bibleId, name, books: [...] }]
- Lists all currently uploaded Bibles

**GET /api/bible/convert/:bibleId/:bookId/:chapter**
- Returns: { html, metadata: { book, chapter, verses } }
- Converts specified chapter from USFM to HTML on-demand

**DELETE /api/bible/:bibleId**
- Removes Bible from file system
- Returns: { success: true }

**Chat & Voice (migrated from POC):**

**POST /api/chat**
- Accepts: { message: string }
- Returns: { answer: string }
- Simple text-based chat using OpenAI `gpt-4o-mini`

**GET /api/realtime/token**
- Returns: { value: string } (ephemeral OpenAI session token)
- Creates WebRTC session token for OpenAI Realtime API
- Configures voice settings (VAD, transcription, voice model)

**POST /api/transcribe**
- Accepts: audio/* binary (WebM, MP3, WAV, etc., up to 25MB)
- Returns: { text: string }
- Transcribes audio to text using `gpt-4o-mini-transcribe`

**WebSocket /api/google-live?model=<model-name>**
- Bidirectional audio streaming for Google Gemini Live API
- Proxies WebSocket connection to Google's generative language API
- Handles setup, audio transmission, and transcription

### 6.4 Data Flow

**Bible Reading Flow:**
```
1. User uploads zip file
   ↓
2. Server extracts USFM files
   ↓
3. Server stores on file system with unique ID
   ↓
4. Server returns metadata to client
   ↓
5. User opens Bible in panel
   ↓
6. Client requests chapter conversion
   ↓
7. Server converts USFM → USJ → HTML
   ↓
8. Client receives and displays HTML
```

**Voice Conversation Flow (OpenAI):**
```
1. User clicks "Voice" button
   ↓
2. Client requests ephemeral token (/api/realtime/token)
   ↓
3. Client establishes WebRTC connection with OpenAI
   ↓
4. Bidirectional audio streaming begins
   ↓
5. Real-time transcription + VAD + audio output
   ↓
6. User clicks "End" to stop session
```

**Voice Conversation Flow (Gemini):**
```
1. User selects Gemini model and clicks "Voice"
   ↓
2. Client connects WebSocket to /api/google-live
   ↓
3. Server proxies to Google's WebSocket API
   ↓
4. Client captures microphone → resamples to 16kHz PCM16
   ↓
5. Streams audio to server → Google
   ↓
6. Receives audio + transcription from Google
   ↓
7. Plays audio with synchronized timing
```

### 6.5 USFM Conversion Pipeline

```
USFM File (from zip)
  ↓
usfm-grammar parser (tree-sitter GLR)
  ↓
USJ (Unified Scripture JSON)
  ↓
UsjHtmlRenderer (custom, ~100 lines)
  ↓
Formatted HTML with USJ-based CSS classes
  ↓
Browser Display
```

### 6.6 Component Architecture (Svelte)

```
App Root (+layout.svelte)
├── Header.svelte
│   ├── AppTitle
│   ├── StatusIndicator (voice connection status)
│   └── SettingsMenu
├── MainLayout.svelte
│   ├── ChatPanel.svelte (from POC, integrated)
│   │   ├── ChatHeader.svelte
│   │   ├── MessageList.svelte
│   │   │   └── Message.svelte (user/assistant bubbles)
│   │   └── ChatInput.svelte
│   │       ├── TextInput
│   │       ├── VoiceModelSelector (OpenAI/Gemini dropdown)
│   │       ├── VoiceButton (toggles Voice/End)
│   │       └── SendButton
│   └── BiblePanelManager.svelte
│       ├── BibleUploadButton.svelte
│       ├── BibleList.svelte
│       └── DockingLayout.svelte
│           └── BibleReaderPanel.svelte (0-N instances)
│               ├── BibleHeader.svelte
│               ├── NavigationControls.svelte
│               │   ├── BookSelector.svelte
│               │   ├── ChapterSelector.svelte
│               │   └── PrevNextButtons.svelte
│               └── BibleContentDisplay.svelte

Svelte Stores:
├── chat.ts
│   ├── messages (chat history: [{role, text, id}])
│   ├── voiceState ({ connected, model, status })
│   └── voiceConnection (WebRTC/WebSocket instances)
├── bibles.ts (uploaded Bibles state)
├── panels.ts (panel layout and state)
└── navigation.ts (current book/chapter per panel)
```

---

## 7. UI/UX Requirements

### 7.1 Bible Upload Interface

**Location:** Top toolbar or sidebar  
**Elements:**
- "Upload Bible" button (icon: book with plus sign)
- File input dialog for .zip selection
- Upload progress indicator
- Success/error notification
- List of uploaded Bibles (expandable panel or modal)

**UX Flow:**
1. Click "Upload Bible"
2. Select zip file
3. See progress spinner
4. See success message with Bible name
5. Bible appears in Bibles list

### 7.2 Bible Panel

**Header:**
- Bible name (left)
- Panel controls: minimize, maximize, close (right)

**Navigation Bar:**
- Book dropdown (width: ~200px)
- Chapter dropdown/input (width: ~80px)
- ← Prev button | Next → button

**Content Area:**
- Scrollable Bible text
- Styled according to USJ CSS
- Chapter heading at top
- Verses clearly numbered
- Proper indentation and spacing

**Panel Appearance:**
- Border to distinguish from other content
- Title bar for dragging
- Resize handles on edges
- Shadow when floating

### 7.3 Docking Behavior

**Dock Zones:**
- Left half
- Right half
- Top half
- Bottom half
- Quadrants (TL, TR, BL, BR)
- Tabbed (stack multiple panels)

**Visual Feedback:**
- Highlight drop zones during drag
- Show preview of panel placement
- Smooth animations

### 7.4 Responsive Considerations

**Minimum Screen Width:** 1280px  
**Recommended:** 1920px or larger for multiple panels  

**Behavior:**
- On smaller screens, recommend single panel or tabbed view
- Maintain readability at all supported sizes

---

## 8. Success Metrics

### 8.1 Functional Success
- [ ] User can successfully upload a USFM Bible zip
- [ ] User can open and read any book/chapter
- [ ] User can open 2+ Bibles in separate panels
- [ ] Panels can be docked, floated, and resized
- [ ] All USFM markers render correctly
- [ ] No crashes or data loss during normal operation

### 8.2 Performance Metrics
- Upload and extraction < 5 seconds (10MB file)
- Chapter conversion < 500ms
- Panel operations < 100ms response time
- Supports 4+ simultaneous panels

### 8.3 User Experience Metrics
- Users can complete first Bible upload in < 1 minute (no documentation)
- Users can navigate to specific passage in < 15 seconds
- No confusion about panel operations (via user testing)

---

## 9. Development Milestones

### Phase 1: Foundation (MVP)
**Duration:** 1-2 weeks

**Milestone 1.1: Backend Setup** (2-3 days)
- [ ] Zip upload endpoint
- [ ] USFM extraction and storage
- [ ] USFM to USJ converter
- [ ] USJ to HTML renderer
- [ ] Chapter conversion endpoint

**Milestone 1.2: Frontend - Docking System** (2-3 days)
- [ ] Set up SvelteKit project structure
- [ ] Evaluate and choose Svelte-compatible docking solution
- [ ] Integrate docking system with Svelte components
- [ ] Create basic Svelte panel component
- [ ] Implement panel persistence with Svelte stores + localStorage

**Milestone 1.3: Bible Reader UI** (3-4 days)
- [ ] Create Svelte components for Bible reader
- [ ] Implement upload interface with reactive state
- [ ] Build Bible panel Svelte component
- [ ] Create navigation control components (Book/Chapter selectors)
- [ ] Implement content display with USJ styling
- [ ] Set up API integration using SvelteKit load functions or client-side fetch
- [ ] Configure Svelte stores for state management

**Milestone 1.4: Testing & Polish** (2-3 days)
- [ ] End-to-end testing
- [ ] USFM compatibility testing
- [ ] UI/UX refinements
- [ ] Bug fixes

### Phase 2: Enhancements (Post-MVP)
**Features:**
- Verse search
- Copy verse with reference
- Parallel synchronized scrolling
- Bookmarks
- Dark mode
- Export functionality

---

## 10. Risks & Mitigation

### 10.1 Technical Risks

**Risk:** Paranext libraries not easily extractable/usable
- **Impact:** High
- **Probability:** Medium
- **Mitigation:** Have bjfield parser as backup; abstract parser interface

**Risk:** Svelte-compatible docking library may not exist or have limited options
- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:** Prepare to build custom docking solution using Svelte's reactive primitives; use svelte-dnd-action for drag & drop; Svelte's reactivity makes custom solution feasible

**Risk:** Bun compatibility issues with npm packages
- **Impact:** Medium
- **Probability:** Low
- **Mitigation:** Bun has excellent npm compatibility; fallback to npm/pnpm if specific packages fail

**Risk:** Large USFM files cause memory issues
- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:** Implement streaming if needed; set file size limits; lazy loading

**Risk:** USFM variations not handled correctly
- **Impact:** Medium
- **Probability:** Medium
- **Mitigation:** Test with multiple Bible sources; implement robust error handling

### 10.2 UX Risks

**Risk:** Panel management too complex for users
- **Impact:** High
- **Probability:** Low
- **Mitigation:** Intuitive defaults; user testing; help documentation

**Risk:** Mobile/tablet unusable
- **Impact:** Low (desktop-first app)
- **Probability:** High
- **Mitigation:** Document as desktop-only for now; plan mobile iteration

---

## 11. Technical Decisions

### 11.1 Resolved Decisions

**USFM Conversion Library:** ✅ **usfm-grammar** (Bridgeconn)
- npm package ready: `bun install usfm-grammar`
- Tree-sitter based parser with comprehensive USFM 3.x support
- Outputs USJ (Unified Scripture JSON) which we'll render to HTML
- Implementation time: 1-2 days
- See: `doc/usfm-conversion-evaluation.md` for full comparison

**Docking Library:** ✅ **Two-phase approach**
- Phase 1 (MVP): svelte-golden-layout - Fast implementation (2-3 days)
- Phase 2 (Production): Custom Svelte solution for full control (1-2 weeks)
- See: `doc/docking-library-evaluation.md` for full comparison

**USFM Storage:** ✅ **File system**
- Store uploaded USFM files on server file system
- Persistent across server restarts
- Simpler than in-memory for production use

**Directory Structure:** ✅ **Paratext structure, but flexible**
- Expect standard Paratext format (41MATENG.SFM, etc.)
- Gracefully handle variations (different naming, subdirectories)
- Validate structure and provide clear error messages

**Framework:** ✅ **SvelteKit**
- Full-stack framework with integrated routing and API routes
- Server-side and client-side capabilities
- Better DX than Svelte + Vite alone

### 11.2 Open Questions

1. **Server vs Client Conversion:** Where should USFM conversion happen?
   - Recommendation: Server-side for MVP (easier debugging, consistent results)
   - Future: Could move to client-side for offline support using Bun's WebAssembly capabilities

2. **Panel Limit:** Maximum number of simultaneous panels?
   - Recommendation: Soft limit of 4, hard limit of 8
   - UI should guide users to reasonable limits

3. **Bun Integration:** How deeply should we integrate Bun?
   - Use Bun as package manager only, or also as runtime?
   - Recommendation: Use Bun for package management, consider Bun runtime for server if compatible with all dependencies

---

## 12. Out of Scope (For MVP)

The following features are explicitly **not** included in the MVP:

- Verse search functionality
- Copy verse with reference formatting
- Synchronized parallel scrolling
- Bookmarks and highlights
- Note-taking on passages
- Dark mode / theme switching
- Export to PDF/Word
- Printing formatted Bible
- Mobile responsive design
- Touch/gesture controls
- Offline support
- Cloud storage of Bibles
- Sharing Bibles between users
- Editing USFM content
- Version control of translations
- Cross-references as clickable links
- Interlinear text support
- Right-to-left language support
- Audio Bible integration
- Biblical language tools (Greek, Hebrew)

These may be considered for future iterations based on user feedback and priorities.

---

## 13. Appendix

### 13.1 USFM Resources
- [USFM Specification](https://docs.usfm.bible/)
- [Paranext Core Repository](https://github.com/paranext/paranext-core)
- [USFM Tools Repository](https://github.com/paranext/usfm-tools)
- [USJ Specification](https://github.com/usfm-bible/tcdocs/blob/main/grammar/usj.grammar.md)

### 13.2 Sample Test Bibles
- WEB (World English Bible) - Public domain, full coverage
- BSB (Berean Study Bible) - Available in USFM format
- Test Bibles from paranext-core repository

### 13.3 Glossary
- **USFM:** Unified Standard Format Markers - text-based Bible format
- **USJ:** Unified Scripture JSON - JSON representation of Scripture
- **USX:** Unified Scripture XML - XML representation of Scripture
- **Paranext:** Platform.Bible translation software project
- **Docking:** UI pattern for arranging multiple panels/windows
- **Marker:** USFM annotation (e.g., \v for verse, \c for chapter)
- **Svelte:** Modern reactive JavaScript framework for building UIs
- **SvelteKit:** Full-stack framework built on Svelte with routing and SSR
- **Bun:** Modern JavaScript runtime and package manager (faster alternative to npm)
- **Svelte Stores:** Svelte's built-in state management system

---

**Document End**

**Next Steps:** Review PRD → Approve → Begin Implementation Phase 1
