# Test Coverage & Strategy

**Version:** 1.0  
**Date:** May 2, 2026  
**Author:** Development Team  
**Status:** Living Document

---

## Table of Contents
1. [Overview](#overview)
2. [Current Test Coverage](#current-test-coverage)
3. [Coverage Gaps](#coverage-gaps)
4. [Corner Cases & Edge Cases](#corner-cases--edge-cases)
5. [Test Strategy by Module](#test-strategy-by-module)
6. [Integration Test Plan](#integration-test-plan)
7. [Testing Principles](#testing-principles)
8. [Test Metrics](#test-metrics)

---

## Overview

This document tracks test coverage across the Bible Reader application, identifies gaps, documents corner cases, and provides a comprehensive testing strategy.

### Testing Philosophy
- **TDD Approach**: Write tests before implementation (RED → GREEN → REFACTOR)
- **Comprehensive Coverage**: Unit, integration, and E2E tests
- **Corner Case Focus**: Explicit testing of edge cases and error conditions
- **Continuous Verification**: Tests run in CI/CD pipeline

---

## Current Test Coverage

### ✅ USFM Converter (src/lib/usfm/converter.test.ts)

**Status:** 18 RED tests written (not yet implemented)

#### Test Suite Breakdown:

**1. Basic Structure Tests (3 tests)**
```typescript
✅ should convert simple book with one chapter and verse
✅ should handle multiple verses in a chapter
✅ should handle multiple chapters
```
**Coverage:**
- Single verse rendering
- Multiple verses rendering
- Multiple chapters rendering
- Verse numbering
- Chapter headings
- HTML structure presence

**2. Paragraph Markers (1 test)**
```typescript
✅ should handle paragraph markers (\p)
```
**Coverage:**
- Paragraph break handling
- Content preservation with markers

**3. Poetry and Indentation (2 tests)**
```typescript
✅ should handle poetry markers (\q, \q1, \q2)
✅ should handle list markers (\li1, \li2)
```
**Coverage:**
- Poetry formatting (q1, q2)
- Indentation levels
- List items with nesting

**4. Headings (2 tests)**
```typescript
✅ should handle section headings (\s, \s1)
✅ should handle major title (\mt1)
```
**Coverage:**
- Section headings (h3)
- Major titles (h1)
- Heading hierarchy

**5. Footnotes and Cross-references (2 tests)**
```typescript
✅ should handle footnotes (\f...\f*)
✅ should handle cross-references (\x...\x*)
```
**Coverage:**
- Footnote markers and content
- Cross-reference markers and content
- Inline annotations

**6. Error Handling (3 tests)**
```typescript
✅ should handle empty USFM
✅ should handle malformed USFM gracefully
✅ should handle verses without chapter
```
**Coverage:**
- Empty input
- Malformed input
- Missing chapter markers
- Graceful degradation

**7. Book Metadata (1 test)**
```typescript
✅ should extract book ID
```
**Coverage:**
- Book ID extraction (\id)
- Book name handling

**8. Output Structure (1 test)**
```typescript
✅ should return HTML with proper structure
```
**Coverage:**
- Div containers
- Proper nesting
- Valid HTML

---

## Coverage Gaps

### ❌ Missing Test Coverage (Critical)

#### **1. USFM Converter - Advanced Markers**
```typescript
❌ Character styles (\add, \bd, \it, \nd, \sc, \sup, \tl)
❌ Special features (\bk, \pn, \qt, \sig, \wj)
❌ Introductions (\imt, \is, \ip, \iot, \io)
❌ Complex footnotes with nested markers
❌ Word-level markup (\w...\w* with attributes)
❌ Selah markers (\qs...\qs*)
❌ Acrostic headers (\qa)
❌ Chapter labels (\cl)
❌ Alternative chapter/verse numbers (\ca, \va)
❌ Figures/illustrations (\fig...\fig*)
```

#### **2. USFM Converter - Unicode & Internationalization**
```typescript
❌ Right-to-left scripts (Hebrew, Arabic)
❌ Non-Latin character sets (Greek, Cyrillic, Chinese, etc.)
❌ Unicode normalization (NFC vs NFD)
❌ Zero-width characters
❌ Combining diacritics
❌ Emoji and special Unicode ranges
```

#### **3. USFM Converter - Large Files**
```typescript
❌ Performance with full Bible books (50+ chapters)
❌ Memory usage with large USFM files (>1MB)
❌ Psalm 119 (176 verses, complex poetry)
❌ Genesis (50 chapters)
```

#### **4. API Routes**
```typescript
❌ POST /api/bible/upload - zip upload handling
❌ GET /api/bible/list - Bible list retrieval
❌ GET /api/bible/convert/:id/:book/:chapter - conversion endpoint
❌ POST /api/chat - chat message handling
❌ GET /api/realtime/token - OpenAI token generation
❌ POST /api/transcribe - audio transcription
❌ WebSocket /api/google-live - Gemini voice proxy
```

#### **5. Svelte Stores**
```typescript
❌ bibles.ts - Bible metadata management
❌ chat.ts - Message history and voice state
❌ panels.ts - Panel layout persistence
❌ navigation.ts - Book/chapter navigation state
```

#### **6. Components**
```typescript
❌ BibleReaderPanel.svelte - Bible display
❌ ChatPanel.svelte - Chat interface
❌ DockingLayout.svelte - Panel management
❌ Navigation controls
❌ Voice controls (OpenAI/Gemini toggle)
```

#### **7. Chat/Voice Integration**
```typescript
❌ OpenAI Realtime WebRTC connection
❌ Gemini WebSocket connection
❌ Audio resampling (Float32 → PCM16)
❌ Audio playback queue
❌ Partial message streaming
❌ Voice status transitions
❌ Error recovery (connection drops)
```

#### **8. File System Operations**
```typescript
❌ Zip file extraction (adm-zip)
❌ USFM file reading
❌ File system structure creation
❌ Metadata file parsing
❌ Invalid zip handling
❌ Disk space errors
❌ File permissions
```

#### **9. Docking System**
```typescript
❌ Panel creation/deletion
❌ Panel drag & drop
❌ Panel resize
❌ Panel float/dock
❌ Layout persistence (localStorage)
❌ Multiple panels of same Bible
❌ Panel focus management
```

#### **10. Integration Flows**
```typescript
❌ Full Bible upload → display flow
❌ Multi-panel comparison workflow
❌ Chat + Bible reference workflow
❌ Voice + Bible reading workflow
❌ Panel state restoration on reload
```

---

## Corner Cases & Edge Cases

### 🔥 Critical Corner Cases

#### **USFM Parsing**

**1. Empty and Whitespace**
```typescript
☑️ Empty string → Return empty HTML (covered)
❌ Only whitespace → Return empty HTML
❌ Only newlines → Return empty HTML
❌ Mixed whitespace (tabs, spaces, CRLF, LF) → Normalize
```

**2. Marker Edge Cases**
```typescript
☑️ Missing \id marker → Still render content (covered)
☑️ Missing \c marker → Graceful handling (covered)
❌ Duplicate \id markers → Use first
❌ Duplicate chapter numbers → Handle gracefully
❌ Non-sequential verse numbers → Display as-is
❌ Verse 0 → Handle correctly
❌ Chapter without verses → Empty chapter display
❌ Verse spanning multiple lines → Preserve linebreaks
❌ Unclosed footnote (\f without \f*) → Error recovery
❌ Nested footnotes (invalid USFM) → Flatten or error
```

**3. Unicode Edge Cases**
```typescript
❌ RTL text (Hebrew Psalms) → Proper direction
❌ Mixed LTR/RTL (English + Hebrew) → Bidirectional
❌ Greek with diacritics (Matt 1:1) → Preserve
❌ Emoji in verse text → Render correctly
❌ Zero-width joiner/non-joiner → Preserve
❌ Combining characters → Normalize
❌ Invalid UTF-8 sequences → Handle gracefully
```

**4. File Size Edge Cases**
```typescript
❌ Empty file (0 bytes) → Error message
❌ Tiny file (< 10 bytes) → Invalid USFM error
❌ Huge file (>10MB single book) → Memory management
❌ Malformed UTF-8 → Detect and report
```

**5. Special Content**
```typescript
❌ HTML-like content (<tag>) → Escape properly
❌ JavaScript in content → Sanitize
❌ SQL injection patterns → No database anyway, but sanitize
❌ XSS vectors → Escape all user content
❌ NULL bytes → Remove
❌ Control characters → Strip or escape
```

#### **API Edge Cases**

**6. Upload Edge Cases**
```typescript
❌ Zip file > 50MB → Reject with clear message
❌ Zip with 0 USFM files → Clear error
❌ Zip with non-USFM files → Ignore non-USFM
❌ Zip with nested folders → Flatten or handle
❌ Corrupted zip → Error with recovery steps
❌ Zip bomb (massive decompression) → Size limits
❌ Empty zip → Clear error message
❌ Password-protected zip → Error message
❌ Zip with duplicate filenames → Handle collision
```

**7. File System Edge Cases**
```typescript
❌ Disk full → Clear error, cleanup partial files
❌ Permission denied → User-friendly error
❌ File name collision → Unique ID generation
❌ Path traversal attack (../../etc/passwd) → Sanitize
❌ Special characters in filenames → Sanitize
❌ Very long filenames (>255 chars) → Truncate
```

**8. API Request Edge Cases**
```typescript
❌ Missing required fields → 400 with clear message
❌ Invalid Content-Type → 415 Unsupported Media Type
❌ Request body too large → 413 Payload Too Large
❌ Malformed JSON → 400 with parse error
❌ Invalid bibleId (SQL injection) → Sanitize and validate
❌ Invalid bookId (non-existent book) → 404
❌ Invalid chapter (negative, zero, > max) → 400
```

#### **Chat/Voice Edge Cases**

**9. WebRTC Connection**
```typescript
❌ Token expiration during session → Refresh
❌ Connection drop mid-conversation → Reconnect
❌ No microphone permission → Clear error
❌ No speaker → Handle silently
❌ Multiple tabs with same session → Session conflict
❌ Browser not supporting WebRTC → Fallback UI
```

**10. Audio Processing**
```typescript
❌ Microphone input = 0 samples → Handle gracefully
❌ Audio clipping (> 0 dB) → Normalize
❌ Sample rate mismatch → Resample correctly
❌ Mono vs stereo → Handle both
❌ Very long silence → Timeout detection
❌ Very loud input → Normalize
```

**11. Gemini WebSocket**
```typescript
❌ WebSocket connection fails → Clear error
❌ Connection drops mid-conversation → Reconnect
❌ Invalid audio format sent → Error handling
❌ Server closes connection → Graceful handling
❌ Ping/pong timeout → Reconnect
```

#### **Panel/Docking Edge Cases**

**12. Panel Management**
```typescript
❌ Open 20+ panels → Performance/memory limit
❌ Close all panels → Empty state handling
❌ Resize panel to 0x0 → Minimum size enforcement
❌ Drag panel outside viewport → Return to bounds
❌ Two panels with same content → Independent state
❌ localStorage full → Fallback to in-memory
❌ localStorage disabled (privacy mode) → In-memory only
```

**13. Navigation Edge Cases**
```typescript
❌ Navigate to non-existent book → Error message
❌ Navigate to chapter > max → Redirect to last chapter
❌ Navigate to chapter 0 → Redirect to chapter 1
❌ Navigate backward from Gen 1 → Disable button
❌ Navigate forward from Rev 22 → Disable button
❌ Rapid navigation clicks → Debounce/throttle
```

#### **State Management Edge Cases**

**14. localStorage**
```typescript
❌ localStorage quota exceeded → Clear old data
❌ localStorage disabled → In-memory fallback
❌ Corrupted localStorage data → Reset to defaults
❌ Migration from old schema → Version handling
❌ Simultaneous writes (race condition) → Last write wins
```

**15. Store Synchronization**
```typescript
❌ Two stores update same state → Conflict resolution
❌ Store update during component unmount → Ignore
❌ Rapid store updates → Debounce rendering
❌ Circular dependency → Prevent
```

#### **Browser Compatibility Edge Cases**

**16. Browser Features**
```typescript
❌ No localStorage → In-memory only
❌ No WebRTC → Disable voice mode
❌ No WebSockets → Disable Gemini voice
❌ Old browser (no ES6) → Polyfills or error
❌ No Web Audio API → Disable voice
```

---

## Test Strategy by Module

### 1. USFM Converter (converter.ts)

**Unit Tests:**
- ✅ Current 18 tests (basic structure, poetry, headings, footnotes, errors)
- ❌ **Add 30+ tests for:**
  - All USFM 3.0 marker types (paragraphs, poetry, titles, lists)
  - Character styles (\add, \bd, \it, \nd, \sc, \sup, \tl)
  - Special features (\bk, \pn, \qt, \sig, \wj)
  - Word-level markup with attributes
  - Introductions (\imt, \is, \ip)
  - Unicode edge cases (RTL, Greek, emoji)
  - Performance tests (Psalm 119, Genesis)
  - HTML escaping (XSS prevention)

**Property-Based Tests:**
```typescript
❌ Fuzz testing with random USFM input
❌ Round-trip testing (if possible)
❌ Invariant: Always return valid HTML
❌ Invariant: Never lose verse content
```

### 2. API Routes

**Unit Tests:**
```typescript
❌ POST /api/bible/upload
  - Valid zip → Success
  - Invalid zip → 400
  - Missing file → 400
  - Zip bomb → 413
  - Disk full → 500
  
❌ GET /api/bible/convert/:id/:book/:chapter
  - Valid params → HTML
  - Invalid bibleId → 404
  - Invalid book → 404
  - Invalid chapter → 400
  - Malformed params → 400

❌ POST /api/chat
  - Valid message → Response
  - Empty message → 400
  - OpenAI error → 500
  
❌ GET /api/realtime/token
  - Success → Token
  - OpenAI down → 503
  
❌ WebSocket /api/google-live
  - Connection → Success
  - Invalid auth → 401
  - Gemini down → 503
```

### 3. Svelte Stores

**Unit Tests:**
```typescript
❌ bibles.ts
  - Add Bible → Updates list
  - Remove Bible → Updates list
  - Get Bible by ID → Returns correct Bible
  - Empty state → []
  
❌ chat.ts
  - Add message → Appends to history
  - Clear history → Empty array
  - Set voice state → Updates reactive state
  - localStorage persistence → Saves/loads
  
❌ panels.ts
  - Add panel → Updates list
  - Remove panel → Updates list
  - Update layout → Persists to localStorage
  - Restore layout → Loads from localStorage
  
❌ navigation.ts
  - Set navigation → Updates map
  - Get navigation → Returns correct state
  - Clear navigation → Removes entry
```

### 4. Components (Svelte Testing Library)

**Component Tests:**
```typescript
❌ BibleReaderPanel.svelte
  - Renders Bible content
  - Navigation controls work
  - Chapter changes update display
  - Loading state displays
  - Error state displays
  
❌ ChatPanel.svelte
  - Renders messages
  - Send message works
  - Voice toggle works
  - Voice status updates
  - Scroll to bottom on new message
  
❌ DockingLayout.svelte
  - Renders panels
  - Drag and drop works
  - Resize works
  - Float/dock works
  - Layout persists
```

### 5. Chat/Voice Libraries

**Unit Tests:**
```typescript
❌ voice.ts
  - Setup WebRTC → Returns connection
  - Handle SDP offer/answer → Success
  - Close connection → Cleanup
  - Error handling → Throws/catches
  
❌ audio.ts
  - Resample audio → Correct sample rate
  - Float32 to PCM16 → Correct conversion
  - Playback queue → FIFO order
  - Audio normalization → Clipping prevention
```

### 6. File System Operations

**Unit Tests:**
```typescript
❌ Zip extraction
  - Valid zip → Extracts files
  - Nested folders → Handles correctly
  - Duplicate names → Resolves collision
  - Corrupted zip → Error
  
❌ USFM file reading
  - Valid file → Returns content
  - Missing file → Error
  - Permission denied → Error
  - Large file → Streams correctly
```

---

## Integration Test Plan

### Integration Test Scenarios

#### **Scenario 1: Full Bible Upload Flow**
```typescript
❌ Test: Upload → Extract → Display
  1. User uploads WEB.zip (World English Bible)
  2. System extracts 66 USFM files
  3. System parses metadata.json
  4. User opens Genesis in panel
  5. System converts Gen 1 USFM → HTML
  6. Panel displays formatted text
  7. User navigates to Gen 2
  8. Panel updates with Gen 2 content
```

#### **Scenario 2: Multi-Panel Comparison**
```typescript
❌ Test: Multiple Bibles Side-by-Side
  1. User uploads ESV.zip and NIV.zip
  2. User opens ESV Genesis 1 in Panel A
  3. User opens NIV Genesis 1 in Panel B
  4. Both panels display independently
  5. User navigates ESV to Gen 2
  6. NIV panel stays on Gen 1 (independent)
  7. User resizes panels
  8. Layout persists on page reload
```

#### **Scenario 3: Chat + Bible Workflow**
```typescript
❌ Test: AI Chat with Bible Reference
  1. User uploads Bible
  2. User asks chat "Explain John 3:16"
  3. User opens John 3 in panel
  4. User reads context
  5. User asks follow-up question
  6. Chat maintains context
```

#### **Scenario 4: Voice + Bible Workflow**
```typescript
❌ Test: Voice Chat While Reading
  1. User opens Bible panel
  2. User clicks Voice button
  3. WebRTC connects (OpenAI)
  4. User asks "Read Psalm 23"
  5. AI responds with voice
  6. User navigates to Psalm 23
  7. Reads along with voice answer
```

#### **Scenario 5: Error Recovery**
```typescript
❌ Test: Handle Upload Errors
  1. User uploads invalid.zip (not USFM)
  2. System shows error: "No USFM files found"
  3. User uploads valid Bible
  4. System succeeds
  
❌ Test: Handle API Errors
  1. User navigates to non-existent chapter
  2. System shows error: "Chapter not found"
  3. User navigates back to valid chapter
  4. System displays content
  
❌ Test: Handle Connection Errors
  1. User starts voice chat
  2. Network drops
  3. System shows "Reconnecting..."
  4. Network returns
  5. Voice chat resumes
```

#### **Scenario 6: Performance Testing**
```typescript
❌ Test: Large Bible Handling
  1. Upload 50MB full Bible (66 books)
  2. Measure: Upload time < 5s
  3. Measure: Extraction time < 2s
  4. Open Psalm 119 (176 verses)
  5. Measure: Conversion time < 500ms
  6. Navigate through 10 chapters rapidly
  7. Measure: Each navigation < 200ms
```

---

## Testing Principles

### Test-Driven Development (TDD)

**Process:**
1. **RED**: Write failing test first
2. **GREEN**: Implement minimum code to pass
3. **REFACTOR**: Clean up implementation

**Example:**
```typescript
// 1. RED: Write test (fails)
it('should convert poetry with indentation', () => {
  const usfm = '\\q1 Line 1\\n\\q2 Line 2';
  const html = convertUSFMToHTML(usfm);
  expect(html).toContain('class="q1"');
  expect(html).toContain('class="q2"');
});

// 2. GREEN: Implement (test passes)
function convertUSFMToHTML(usfm) {
  // ... implementation
}

// 3. REFACTOR: Clean up
function convertUSFMToHTML(usfm) {
  // ... cleaner implementation
}
```

### Test Isolation

**Principles:**
- Each test is independent
- Tests don't rely on execution order
- Tests clean up after themselves
- Mock external dependencies (API calls, file system)

### Test Naming Convention

**Format:** `should [expected behavior] when [condition]`

**Examples:**
```typescript
✅ should return empty HTML when given empty USFM
✅ should handle footnotes when footnote markers present
✅ should throw error when file not found
```

### Code Coverage Targets

**Goals:**
- **Unit Test Coverage:** > 80%
- **Integration Test Coverage:** > 60%
- **Critical Paths:** 100% (converter, API, stores)

**Measure with:**
```bash
bun test --coverage
```

---

## Test Metrics

### Current Metrics (May 2, 2026)

| Module | Tests Written | Tests Passing | Coverage | Status |
|--------|---------------|---------------|----------|--------|
| USFM Converter | 18 | 0 | 0% | 🔴 RED |
| API Routes | 0 | 0 | 0% | ⚫ Not Started |
| Svelte Stores | 0 | 0 | 0% | ⚫ Not Started |
| Components | 0 | 0 | 0% | ⚫ Not Started |
| Chat/Voice | 0 | 0 | 0% | ⚫ Not Started |
| Integration | 0 | 0 | 0% | ⚫ Not Started |

**Overall:** 18 tests, 0 passing, 0% coverage

### Target Metrics (Project Complete)

| Module | Target Tests | Target Coverage | Priority |
|--------|--------------|-----------------|----------|
| USFM Converter | 50+ | 90% | 🔥 Critical |
| API Routes | 30+ | 80% | 🔥 Critical |
| Svelte Stores | 25+ | 85% | 🟡 High |
| Components | 20+ | 70% | 🟡 High |
| Chat/Voice | 15+ | 75% | 🟡 High |
| Integration | 10+ | 60% | 🟢 Medium |

**Target Overall:** 150+ tests, 80%+ coverage

---

## Test Execution Commands

```bash
# Run all tests
bun test

# Run specific test file
bun test src/lib/usfm/converter.test.ts

# Run with coverage
bun test --coverage

# Run with UI
bun test:ui

# Run in watch mode
bun test --watch

# Run single test by name
bun test -t "should convert simple book"
```

---

## Next Steps

### Immediate (GREEN Phase)
1. ✅ Implement `converter.ts` to pass 18 RED tests
2. ✅ Achieve 80%+ coverage on converter

### Short-Term (Phase 1-2)
1. ❌ Add 30+ advanced converter tests
2. ❌ Write API route tests (30+ tests)
3. ❌ Write Svelte store tests (25+ tests)
4. ❌ Add Unicode/RTL tests

### Medium-Term (Phase 3-4)
1. ❌ Write component tests (20+ tests)
2. ❌ Write chat/voice tests (15+ tests)
3. ❌ Integration tests (10+ scenarios)

### Long-Term (Phase 5)
1. ❌ Performance testing
2. ❌ Load testing
3. ❌ Security testing
4. ❌ Browser compatibility testing

---

## Glossary

- **TDD**: Test-Driven Development
- **RED**: Failing test state
- **GREEN**: Passing test state
- **REFACTOR**: Code cleanup phase
- **Coverage**: Percentage of code executed by tests
- **Edge Case**: Unusual or extreme input scenario
- **Corner Case**: Multiple edge cases occurring simultaneously
- **Integration Test**: Test of multiple modules working together
- **E2E Test**: End-to-end test simulating user workflows

---

**Document History:**
- v1.0 (May 2, 2026): Initial test coverage analysis
