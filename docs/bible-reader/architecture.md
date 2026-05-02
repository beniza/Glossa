# Bible Reader Application Architecture

**Version:** 1.0  
**Date:** May 2, 2026  
**Framework:** SvelteKit + TypeScript + Bun

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Module Architecture](#module-architecture)
3. [Data Flow](#data-flow)
4. [User Journeys](#user-journeys)
5. [Component Hierarchy](#component-hierarchy)
6. [API Architecture](#api-architecture)

---

## System Overview

```mermaid
graph TB
    subgraph Client["Browser (SvelteKit Client)"]
        UI[User Interface]
        Stores[Svelte Stores]
        Components[Svelte Components]
    end
    
    subgraph Server["SvelteKit Server"]
        API[API Routes]
        USFM[USFM Converter]
        FS[File System]
    end
    
    subgraph External["External Services"]
        OpenAI[OpenAI API]
        Gemini[Google Gemini API]
    end
    
    UI --> Stores
    Stores --> Components
    Components --> API
    API --> USFM
    API --> FS
    API --> OpenAI
    API --> Gemini
    
    style Client fill:#e1f5fe
    style Server fill:#f3e5f5
    style External fill:#fff3e0
```

**Key Technologies:**
- **Frontend:** Svelte 5, TypeScript, svelte-golden-layout
- **Backend:** SvelteKit API routes (Node.js runtime)
- **USFM:** usfm-grammar (tree-sitter parser)
- **Storage:** File system (USFM files), localStorage (UI state)
- **Chat:** OpenAI (text + realtime voice), Google Gemini (live voice)

---

## Module Architecture

### Layer Diagram

```mermaid
graph TB
    subgraph Presentation["Presentation Layer"]
        Pages["+page.svelte"]
        Layout["+layout.svelte"]
        Components[Svelte Components]
    end
    
    subgraph Business["Business Logic Layer"]
        Stores[Svelte Stores]
        USFMLib[USFM Library]
        ChatLib[Chat Library]
    end
    
    subgraph API["API Layer"]
        BibleAPI[Bible API Routes]
        ChatAPI[Chat API Routes]
        VoiceAPI[Voice API Routes]
    end
    
    subgraph Data["Data Layer"]
        FileSystem[File System]
        LocalStorage[localStorage]
        Memory[In-Memory Cache]
    end
    
    subgraph External["External Services"]
        OpenAIService[OpenAI API]
        GeminiService[Gemini API]
    end
    
    Pages --> Layout
    Layout --> Components
    Components --> Stores
    Stores --> USFMLib
    Stores --> ChatLib
    
    Components --> BibleAPI
    Components --> ChatAPI
    Components --> VoiceAPI
    
    BibleAPI --> USFMLib
    BibleAPI --> FileSystem
    
    ChatAPI --> OpenAIService
    VoiceAPI --> OpenAIService
    VoiceAPI --> GeminiService
    
    Stores --> LocalStorage
    BibleAPI --> Memory
    
    style Presentation fill:#e8f5e9
    style Business fill:#fff3e0
    style API fill:#e1f5fe
    style Data fill:#f3e5f5
    style External fill:#ffebee
```

### Module Breakdown

**Presentation Layer:**
- `src/routes/+page.svelte` - Main application page
- `src/routes/+layout.svelte` - Root layout wrapper
- `src/lib/components/` - Reusable Svelte components
  - `ChatPanel.svelte` - Chat interface
  - `BiblePanelManager.svelte` - Bible panel orchestrator
  - `BibleReaderPanel.svelte` - Individual Bible viewer
  - `DockingLayout.svelte` - Panel docking system

**Business Logic Layer:**
- `src/lib/stores/` - Reactive state management
  - `chat.ts` - Chat messages, voice state
  - `bibles.ts` - Uploaded Bibles metadata
  - `panels.ts` - Panel layout/state
  - `navigation.ts` - Current book/chapter per panel
- `src/lib/usfm/` - USFM processing
  - `converter.ts` - USFM → HTML converter
  - `parser.ts` - USFM → USJ wrapper
- `src/lib/chat/` - Chat utilities
  - `voice.ts` - WebRTC/WebSocket helpers
  - `audio.ts` - Audio processing utilities

**API Layer:**
- `src/routes/api/bible/` - Bible management
  - `upload/+server.ts` - POST upload endpoint
  - `list/+server.ts` - GET list endpoint
  - `convert/[bibleId]/[bookId]/[chapter]/+server.ts` - GET convert
- `src/routes/api/chat/+server.ts` - POST text chat
- `src/routes/api/realtime/token/+server.ts` - GET OpenAI token
- `src/routes/api/transcribe/+server.ts` - POST audio transcription
- `src/routes/api/google-live/+server.ts` - WebSocket proxy

**Data Layer:**
- File System: `data/bibles/{bibleId}/{bookId}.usfm`
- localStorage: Panel layouts, UI preferences
- In-Memory: Session cache (converted chapters)

---

## Data Flow

### 1. Bible Upload & Display Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as UI Component
    participant API as API Route
    participant USFM as USFM Converter
    participant FS as File System
    participant Store as Svelte Store
    
    User->>UI: Upload zip file
    UI->>API: POST /api/bible/upload
    API->>API: Extract zip (adm-zip)
    API->>FS: Save USFM files
    API->>API: Parse metadata
    API-->>UI: Return {bibleId, name, books[]}
    UI->>Store: Add Bible to store
    Store->>UI: Update Bible list
    
    User->>UI: Click "Open Bible"
    UI->>API: GET /api/bible/convert/{id}/{book}/{ch}
    API->>FS: Read USFM file
    FS-->>API: USFM string
    API->>USFM: convertUSFMToHTML(usfm)
    USFM->>USFM: Parse USFM → USJ
    USFM->>USFM: Render USJ → HTML
    USFM-->>API: HTML string
    API-->>UI: Return {html, metadata}
    UI->>UI: Render in panel
```

### 2. Chat & Voice Flow

```mermaid
sequenceDiagram
    actor User
    participant UI as Chat UI
    participant Store as Chat Store
    participant API as Chat API
    participant OpenAI as OpenAI
    participant Gemini as Gemini
    
    rect rgb(230, 245, 230)
    note right of User: Text Chat Flow
    User->>UI: Type message
    UI->>API: POST /api/chat {message}
    API->>OpenAI: Chat Completion (gpt-4o-mini)
    OpenAI-->>API: Response
    API-->>UI: {answer}
    UI->>Store: Add messages
    Store->>UI: Update UI
    end
    
    rect rgb(255, 243, 224)
    note right of User: OpenAI Voice Flow
    User->>UI: Click "Voice"
    UI->>API: GET /api/realtime/token
    API->>OpenAI: Create session
    OpenAI-->>API: Ephemeral token
    API-->>UI: {value: token}
    UI->>UI: Setup WebRTC
    UI->>OpenAI: SDP offer (WebRTC)
    OpenAI-->>UI: SDP answer
    Note over UI,OpenAI: Bidirectional audio stream (WebRTC)
    OpenAI-->>UI: Transcripts (events)
    UI->>Store: Update messages
    end
    
    rect rgb(255, 235, 238)
    note right of User: Gemini Voice Flow
    User->>UI: Select Gemini model
    UI->>API: WebSocket /api/google-live
    API->>Gemini: WebSocket connect
    API-->>UI: Connection ready
    UI->>UI: Capture microphone
    UI->>UI: Resample to 16kHz PCM16
    UI->>API: Send audio (WebSocket)
    API->>Gemini: Forward audio
    Gemini-->>API: Audio + transcript
    API-->>UI: Forward response
    UI->>UI: Play audio
    UI->>Store: Update messages
    end
```

### 3. Panel Management Flow

```mermaid
graph LR
    User[User Action] --> Action{Action Type}
    
    Action -->|Open Bible| Create[Create Panel]
    Action -->|Close Panel| Remove[Remove Panel]
    Action -->|Resize| Update[Update Layout]
    Action -->|Navigate| Navigate[Change Chapter]
    
    Create --> Store[panels Store]
    Remove --> Store
    Update --> Store
    Navigate --> NavStore[navigation Store]
    
    Store --> Layout[DockingLayout]
    NavStore --> Panel[BibleReaderPanel]
    
    Layout --> LS[localStorage]
    
    Panel --> API[API: Convert Chapter]
    API --> Render[Render HTML]
    
    style User fill:#e8f5e9
    style Store fill:#fff3e0
    style Layout fill:#e1f5fe
    style API fill:#f3e5f5
```

---

## User Journeys

### Journey 1: Upload and Read Bible

```mermaid
journey
    title Upload and Read Bible Journey
    section Upload Bible
      Click Upload: 5: User
      Select zip file: 4: User
      Wait for upload: 3: User, System
      See Bible in list: 5: User
    section Open Bible
      Click Open Bible: 5: User
      Panel appears: 5: User, System
      Bible loads: 4: System
      Read content: 5: User
    section Navigate
      Select book: 5: User
      Select chapter: 5: User
      Read verses: 5: User
      Navigate prev/next: 4: User
```

**Steps:**
1. User clicks "Upload Bible" button
2. User selects `.zip` file containing USFM files
3. System extracts and stores USFM files
4. System displays Bible name in sidebar
5. User clicks Bible name to open
6. System creates new panel with Bible reader
7. User selects book from dropdown (e.g., "Genesis")
8. User selects chapter (e.g., "1")
9. System converts USFM to HTML and displays
10. User reads formatted Bible text
11. User navigates using prev/next or dropdowns

**Success Criteria:**
- Bible uploads in < 5 seconds
- Chapter loads in < 500ms
- Text is properly formatted (verses, poetry, footnotes)
- Navigation is smooth and responsive

---

### Journey 2: Chat with AI Assistant

```mermaid
journey
    title Chat with AI Journey
    section Text Chat
      Type question: 5: User
      Click Send: 5: User
      Wait for response: 3: User, System
      Read answer: 5: User
    section Voice Chat
      Click Voice button: 5: User
      Grant microphone: 4: User
      Connection establishes: 4: System
      Speak question: 5: User
      Hear response: 5: User
      See transcript: 4: User
      Click End: 5: User
```

**Steps (Text):**
1. User types question in chat input
2. User clicks "Send" or presses Enter
3. System sends to OpenAI API
4. System displays assistant response
5. User reads answer

**Steps (Voice - OpenAI):**
1. User clicks "Voice" button
2. Browser requests microphone permission
3. User grants permission
4. System establishes WebRTC connection
5. User speaks naturally
6. System transcribes speech (displays)
7. Assistant responds with voice (auto-plays)
8. System shows transcript
9. User can interrupt or continue
10. User clicks "End" to stop

**Steps (Voice - Gemini):**
1. User selects Gemini model from dropdown
2. User clicks "Voice" button
3. System establishes WebSocket connection
4. User speaks naturally
5. System resamples audio to 16kHz PCM16
6. System streams audio to Gemini
7. Gemini responds with audio + transcript
8. System plays audio and displays transcript
9. User clicks "End" to stop

---

### Journey 3: Compare Multiple Translations

```mermaid
journey
    title Compare Translations Journey
    section Setup
      Upload ESV Bible: 5: User
      Upload NIV Bible: 5: User
      Upload KJV Bible: 5: User
    section Open Panels
      Open ESV (Genesis 1): 5: User
      Open NIV (Genesis 1): 5: User
      Open KJV (Genesis 1): 5: User
    section Arrange
      Drag panels side-by-side: 4: User
      Resize to fit screen: 4: User
    section Compare
      Read verse 1 across: 5: User
      Scroll to verse 5: 5: User
      Compare wording: 5: User
      Take notes: 4: User
```

**Steps:**
1. User uploads 3 Bible translations (ESV, NIV, KJV)
2. User opens ESV in panel 1 (Genesis 1)
3. User opens NIV in panel 2 (Genesis 1)
4. User opens KJV in panel 3 (Genesis 1)
5. System arranges panels side-by-side
6. User resizes panels to optimal width
7. User reads verse 1 across all three
8. User scrolls synchronously (optional feature)
9. User compares translation differences
10. User navigates to other chapters/books

---

## Component Hierarchy

```mermaid
graph TB
    Root["+layout.svelte"]
    
    Root --> Header["Header.svelte"]
    Root --> Main["MainLayout.svelte"]
    
    Header --> AppTitle["AppTitle"]
    Header --> Status["StatusIndicator"]
    Header --> Settings["SettingsMenu"]
    
    Main --> Chat["ChatPanel.svelte"]
    Main --> Bible["BiblePanelManager.svelte"]
    
    Chat --> ChatHeader["ChatHeader"]
    Chat --> Messages["MessageList"]
    Chat --> Input["ChatInput"]
    
    Messages --> Message["Message.svelte (N)"]
    
    Input --> TextInput["TextInput"]
    Input --> ModelSelect["VoiceModelSelector"]
    Input --> VoiceBtn["VoiceButton"]
    Input --> SendBtn["SendButton"]
    
    Bible --> Upload["BibleUploadButton"]
    Bible --> List["BibleList"]
    Bible --> Docking["DockingLayout"]
    
    Docking --> Panel1["BibleReaderPanel (1)"]
    Docking --> Panel2["BibleReaderPanel (2)"]
    Docking --> PanelN["BibleReaderPanel (N)"]
    
    Panel1 --> PanelHeader["BibleHeader"]
    Panel1 --> Nav["NavigationControls"]
    Panel1 --> Content["BibleContentDisplay"]
    
    Nav --> BookSelect["BookSelector"]
    Nav --> ChapterSelect["ChapterSelector"]
    Nav --> PrevNext["PrevNextButtons"]
    
    style Root fill:#e8f5e9
    style Chat fill:#fff3e0
    style Bible fill:#e1f5fe
    style Panel1 fill:#f3e5f5
```

---

## API Architecture

### API Routes Structure

```
src/routes/api/
├── bible/
│   ├── upload/
│   │   └── +server.ts          POST - Upload Bible zip
│   ├── list/
│   │   └── +server.ts          GET  - List uploaded Bibles
│   └── convert/
│       └── [bibleId]/
│           └── [bookId]/
│               └── [chapter]/
│                   └── +server.ts  GET - Convert chapter to HTML
├── chat/
│   └── +server.ts              POST - Text chat
├── realtime/
│   └── token/
│       └── +server.ts          GET  - OpenAI session token
├── transcribe/
│   └── +server.ts              POST - Audio transcription
└── google-live/
    └── +server.ts              WebSocket - Gemini proxy
```

### API Endpoint Details

```mermaid
graph TB
    subgraph Bible["Bible API"]
        Upload["POST /api/bible/upload"]
        List["GET /api/bible/list"]
        Convert["GET /api/bible/convert/:id/:book/:ch"]
    end
    
    subgraph Chat["Chat API"]
        TextChat["POST /api/chat"]
        RealtimeToken["GET /api/realtime/token"]
        Transcribe["POST /api/transcribe"]
        GeminiWS["WebSocket /api/google-live"]
    end
    
    Upload --> Multer[Multer Upload]
    Upload --> AdmZip[adm-zip Extract]
    Upload --> FSWrite[File System Write]
    
    Convert --> FSRead[File System Read]
    Convert --> USFMConvert[usfm-grammar Parse]
    Convert --> HTMLRender[HTML Render]
    
    TextChat --> OpenAI1[OpenAI Chat API]
    RealtimeToken --> OpenAI2[OpenAI Realtime API]
    Transcribe --> OpenAI3[OpenAI Whisper API]
    GeminiWS --> Gemini[Google Gemini API]
    
    style Bible fill:#e8f5e9
    style Chat fill:#fff3e0
```

---

## State Management

### Svelte Stores Architecture

```mermaid
graph TB
    subgraph Stores["Svelte Stores (Reactive)"]
        Chat[chat.ts]
        Bibles[bibles.ts]
        Panels[panels.ts]
        Nav[navigation.ts]
    end
    
    subgraph ChatStore["chat Store"]
        Messages["messages: Message array"]
        VoiceState["voiceState: connected, model, status"]
        VoiceConn["voiceConnection: WebRTC/WebSocket"]
    end
    
    subgraph BiblesStore["bibles Store"]
        BibleList["bibles: Bible array"]
        BibleMeta["metadata: id, name, books"]
    end
    
    subgraph PanelsStore["panels Store"]
        PanelList["panels: Panel array"]
        Layout["layout: LayoutConfig"]
    end
    
    subgraph NavStore["navigation Store"]
        NavMap["navigation: Map of panelId to book/chapter"]
    end
    
    Chat --> ChatStore
    Bibles --> BiblesStore
    Panels --> PanelsStore
    Nav --> NavStore
    
    ChatStore --> LS1[localStorage: chatHistory]
    PanelsStore --> LS2[localStorage: panelLayout]
    
    style Stores fill:#e8f5e9
    style ChatStore fill:#fff3e0
    style BiblesStore fill:#e1f5fe
    style PanelsStore fill:#f3e5f5
    style NavStore fill:#ffebee
```

**Store Responsibilities:**

**chat.ts**
- Manage chat message history
- Track voice connection state (OpenAI/Gemini)
- Handle WebRTC/WebSocket instances
- Persist to localStorage

**bibles.ts**
- Store list of uploaded Bibles
- Cache Bible metadata (books, chapters)
- Provide lookup by bibleId

**panels.ts**
- Manage open Bible panels
- Store panel layout configuration
- Persist layout to localStorage
- Handle panel creation/removal

**navigation.ts**
- Track current book/chapter per panel
- Handle navigation history
- Provide navigation utilities (prev/next)

---

## File System Structure

```
read/
├── data/                        # USFM storage (server-side)
│   └── bibles/
│       ├── {bibleId-1}/
│       │   ├── 01GEN.usfm
│       │   ├── 02EXO.usfm
│       │   └── ...
│       └── {bibleId-2}/
│           └── ...
├── doc/                         # Documentation
│   ├── bible-reader-prd.md
│   ├── docking-library-evaluation.md
│   ├── usfm-conversion-evaluation.md
│   └── architecture.md (this file)
├── src/
│   ├── lib/
│   │   ├── components/          # Svelte components
│   │   │   ├── chat/
│   │   │   └── bible/
│   │   ├── stores/              # State management
│   │   │   ├── chat.ts
│   │   │   ├── bibles.ts
│   │   │   ├── panels.ts
│   │   │   └── navigation.ts
│   │   ├── usfm/                # USFM processing
│   │   │   ├── converter.ts
│   │   │   ├── converter.test.ts
│   │   │   └── parser.ts
│   │   └── chat/                # Chat utilities
│   │       ├── voice.ts
│   │       └── audio.ts
│   └── routes/
│       ├── +layout.svelte
│       ├── +page.svelte
│       └── api/                 # API routes
│           ├── bible/
│           ├── chat/
│           ├── realtime/
│           ├── transcribe/
│           └── google-live/
├── static/                      # Static assets
├── .env                         # Environment variables
├── package.json
└── vitest.config.ts
```

---

## Security Considerations

```mermaid
graph TB
    User[User] --> Browser[Browser]
    Browser --> Server[SvelteKit Server]
    Server --> EnvVars[.env Variables]
    
    subgraph Security["Security Measures"]
        NoSecrets[No API keys in client]
        TokenGen[Ephemeral tokens only]
        FileVal[Zip validation]
        PathCheck[Path traversal prevention]
    end
    
    Browser -.->|❌ Never exposed| EnvVars
    Server --> TokenGen
    Server --> FileVal
    Server --> PathCheck
    
    Server --> OpenAI[OpenAI API]
    Server --> Gemini[Gemini API]
    
    style Security fill:#ffebee
    style NoSecrets fill:#ffcdd2
```

**Security Rules:**
1. **API Keys:** Never expose in client code, always server-side
2. **Token Generation:** Create ephemeral tokens for OpenAI Realtime
3. **File Uploads:** Validate zip structure, limit size (50MB), check MIME types
4. **Path Safety:** Prevent path traversal in file operations
5. **CORS:** Configure properly for production deployment

---

## Performance Targets

| Operation | Target | Notes |
|-----------|--------|-------|
| **Bible Upload** | < 5s | 10MB zip file |
| **USFM Conversion** | < 500ms | Per chapter |
| **Chapter Navigation** | < 200ms | With caching |
| **Panel Operations** | < 100ms | Create/resize/close |
| **Voice Latency** | < 2s | End-to-end (speech → response) |
| **Chat Response** | < 3s | OpenAI text chat |
| **Initial Load** | < 2s | App ready (no Bibles) |

---

## Future Enhancements

```mermaid
mindmap
  root((Bible Reader
    v2.0))
    Search
      Full-text search
      Cross-reference search
      Verse lookup
    Annotations
      Highlights
      Notes
      Bookmarks
    Export
      PDF export
      Copy with reference
      Share verses
    Sync
      Cloud storage
      Multi-device sync
      User accounts
    Advanced Docking
      Custom Svelte solution
      Floating panels
      Tabbed panels
    Mobile
      Responsive design
      Touch gestures
      Offline mode
```

---

## Glossary

- **USFM:** Unified Standard Format Markers (Bible markup language)
- **USJ:** Unified Scripture JSON (intermediate JSON format)
- **usfm-grammar:** Tree-sitter based USFM parser library
- **WebRTC:** Real-time communication (OpenAI voice)
- **WebSocket:** Bidirectional streaming (Gemini voice)
- **Ephemeral Token:** Short-lived session token (OpenAI)
- **VAD:** Voice Activity Detection (speech detection)
- **PCM16:** 16-bit PCM audio format
- **Resampling:** Converting audio sample rate (e.g., 48kHz → 16kHz)

---

**Document Version:** 1.0  
**Last Updated:** May 2, 2026  
**Status:** Living Document (updated as implementation progresses)
