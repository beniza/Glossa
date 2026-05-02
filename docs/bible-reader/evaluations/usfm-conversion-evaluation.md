# USFM Conversion Library Evaluation

**Created:** 2025  
**Project:** Bible Reader Feature - USFM Conversion Component  
**Evaluation by:** GitHub Copilot CLI

---

## Executive Summary

This document evaluates USFM (Unified Standard Format Markers) conversion libraries to help select the best option for converting USFM-formatted Bible files to HTML for display in a web application. The evaluation covers three primary options:

1. **Paranext Official (UsjReaderWriter)** - Paranext's official implementation from `paranext-core`
2. **usfm-grammar (Bridgeconn)** - Tree-sitter based parser with multiple output formats
3. **Custom Parser (bjfield)** - Simplified regex-based parser for web apps

**Recommendation:** Use **usfm-grammar** for MVP (fastest implementation with comprehensive features), then optionally move to **Paranext Official** if you need tighter integration with Paranext ecosystem or more advanced features.

---

## Comparison Table

| Criteria | Paranext Official | usfm-grammar | bjfield Parser | Custom Build |
|----------|-------------------|--------------|----------------|--------------|
| **Overall Score** | **8.5/10** | **9.0/10** ⭐ | **6.5/10** | **5.0/10** |
| **USFM Compliance** | 9/10 | 9/10 | 5/10 | 3/10 |
| **Output Format** | USJ (JSON) | USJ, USX, CSV, TSV, BibleNLP | HTML | Custom |
| **Feature Completeness** | 9/10 | 9/10 | 6/10 | 3/10 |
| **npm Integration** | 7/10 | 10/10 | N/A | N/A |
| **Bundle Size** | 8/10 (medium) | 7/10 (large with tree-sitter) | 10/10 (tiny) | 10/10 (tiny) |
| **Implementation Time** | 4 days | 1-2 days ⭐ | 3 days | 2-3 weeks |
| **Maintenance** | Active (Paranext) | Active (Bridgeconn) | None | High effort |
| **Documentation** | 8/10 | 8/10 | 2/10 | N/A |
| **Community Support** | Medium (Paranext) | Medium (54⭐) | None | N/A |
| **Reliability** | 9/10 | 8/10 | 6/10 | 4/10 |
| **Styling Support** | Excellent (usj-nodes.css) | Manual | Manual | Manual |

---

## Detailed Evaluation

### 1. Paranext Official (UsjReaderWriter)

**Location:** `paranext/paranext-core` repository  
**Package:** `lib/platform-bible-utils`  
**License:** MIT  
**Maturity:** Production-ready (used in Paranext Platform)

#### Technical Details
- **Language:** TypeScript
- **Approach:** Uses marker maps from USFM specification (from `usfm-tools` repo)
- **Input:** USFM 3.x string
- **Output:** USJ (Unified Scripture JSON)
- **Dependencies:** `@eten-tech-foundation/scripture-utilities` for USJ types
- **Bundle Impact:** ~50-80KB (estimated)

#### Pros
✅ **Official implementation** - maintained by Paranext team  
✅ **Comprehensive** - handles all USFM 3.x markers  
✅ **Well-tested** - used in production Paranext apps  
✅ **Bi-directional** - USFM ↔ USJ conversion  
✅ **Includes styling** - comes with `usj-nodes.css` (38KB of formatting rules)  
✅ **Strongly typed** - full TypeScript support  
✅ **Follows spec** - uses official USFM marker maps  

#### Cons
❌ **Not on npm** - need to extract/adapt code or use as git submodule  
❌ **Complex extraction** - part of larger monorepo, requires selective copying  
❌ **Dependency on scripture-utilities** - need @eten-tech-foundation package  
❌ **USJ → HTML conversion needed** - outputs JSON, not HTML  
❌ **Larger bundle** - includes comprehensive marker handling  
❌ **Learning curve** - need to understand USJ format  

#### Integration Complexity
**Effort:** ~3-4 days

**Steps:**
1. Clone `paranext-core` repo
2. Extract `UsjReaderWriter` class and dependencies
3. Install `@eten-tech-foundation/scripture-utilities`
4. Create USJ → HTML renderer
5. Port `usj-nodes.css` styling
6. Test with sample USFM files

#### Reliability: 9/10
- ✅ Production-tested in Paranext platform
- ✅ Handles edge cases comprehensively
- ✅ Regular updates from Paranext team
- ⚠️ Not published as standalone npm package

#### Scalability: 9/10
- ✅ Designed for large Bible translations
- ✅ Streaming support possible with modifications
- ✅ Efficient USJ intermediate format
- ⚠️ Client-side bundle size may be concern for web

---

### 2. usfm-grammar (Bridgeconn)

**Repository:** `https://github.com/Bridgeconn/usfm-grammar`  
**npm Package:** `usfm-grammar`  
**Version:** 3.2.0 (latest)  
**License:** MIT  
**Stars:** 54  
**Last Updated:** May 2026

#### Technical Details
- **Language:** JavaScript/Python (multi-platform)
- **Approach:** Tree-sitter GLR parser (formal grammar-based)
- **Input:** USFM 3.x string
- **Output:** USJ, USX (XML), CSV, TSV, BibleNLP format
- **Platforms:** Node.js, Python, Web (WASM)
- **Bundle Impact:** ~200-300KB (includes tree-sitter runtime)

#### Pros
✅ **npm package available** - `npm install usfm-grammar` (easiest install) ⭐  
✅ **Multiple output formats** - USJ, USX, CSV, TSV, BibleNLP  
✅ **Formal grammar** - tree-sitter GLR parser (robust)  
✅ **Well-documented** - comprehensive README with examples  
✅ **Actively maintained** - Bridgeconn (Bible translation tech org)  
✅ **Multi-platform** - works in Node, Python, browser (WASM)  
✅ **Validation** - can validate USFM structure  
✅ **Fastest to integrate** - ready-to-use npm package  

#### Cons
❌ **Larger bundle** - includes tree-sitter parser (~200KB+ gzipped)  
❌ **USJ → HTML needed** - outputs JSON, not HTML  
❌ **No styling included** - need to create CSS separately  
❌ **Learning curve** - tree-sitter concepts if debugging  
❌ **Overkill for simple use cases** - grammar parsing is heavyweight  

#### Integration Complexity
**Effort:** ~1-2 days ⭐

**Steps:**
1. `npm install usfm-grammar`
2. Import and call parser API
3. Create USJ → HTML renderer (can reuse Paranext's CSS)
4. Test with sample USFM files

**Example Usage:**
```javascript
import { USFMParser } from 'usfm-grammar';

const parser = new USFMParser();
const usfmText = '\\id GEN\n\\c 1\n\\v 1 In the beginning...';
const usj = parser.toUSJ(usfmText);

// Then render USJ to HTML
const html = usjToHTML(usj);
```

#### Reliability: 8/10
- ✅ Tree-sitter grammar ensures correctness
- ✅ Used by Bridgeconn in Bible translation workflows
- ✅ Comprehensive test suite
- ⚠️ Smaller community (54 stars)
- ⚠️ WASM/tree-sitter adds complexity if issues arise

#### Scalability: 8/10
- ✅ Efficient tree-sitter parser
- ✅ Can handle large Bible books
- ✅ Streaming possible with modifications
- ⚠️ Bundle size may be concern for web
- ⚠️ WASM runtime overhead in browser

---

### 3. Custom Parser (bjfield/pilgrim-reader)

**Repository:** `https://github.com/bjfield/pilgrim-reader`  
**Package:** N/A (code reference only)  
**License:** Unknown  
**Approach:** Simplified regex-based parser

#### Technical Details
- **Language:** JavaScript (ES6)
- **Approach:** Regex-based line-by-line parsing
- **Input:** USFM string
- **Output:** HTML string (direct)
- **Dependencies:** None
- **Bundle Impact:** ~5-8KB (minimal)

#### Pros
✅ **Tiny bundle** - single ~200-line file, ~8KB  
✅ **Direct HTML output** - no intermediate format  
✅ **Simple to understand** - regex patterns, no dependencies  
✅ **Easy to customize** - modify output HTML structure as needed  
✅ **Fast execution** - no parsing overhead  
✅ **No external dependencies** - copy-paste and go  

#### Cons
❌ **Limited marker support** - only handles common markers (\\c, \\v, \\p, \\s, \\q, \\li)  
❌ **Strips footnotes** - removes \\f...\\f* entirely  
❌ **Strips references** - removes \\r markers  
❌ **Not USFM 3.x compliant** - misses many markers  
❌ **No validation** - doesn't check USFM structure  
❌ **No maintenance** - example code, not a library  
❌ **Hard to extend** - regex approach breaks down with complex markers  
❌ **No tests** - quality unknown  

#### Integration Complexity
**Effort:** ~2-3 days

**Steps:**
1. Copy `usfm-parser.mjs` from pilgrim-reader repo
2. Test with sample USFM files
3. Add missing marker support (footnotes, cross-refs, etc.)
4. Create CSS styling for HTML output
5. Handle edge cases (nested markers, special characters)

#### Reliability: 6/10
- ⚠️ Regex-based parsing is fragile
- ⚠️ Doesn't handle nested or complex markers
- ⚠️ Strips important content (footnotes, references)
- ✅ Works well for basic verse/chapter display
- ❌ No test coverage

#### Scalability: 7/10
- ✅ Very fast (simple regex)
- ✅ Minimal memory footprint
- ⚠️ Limited to markers it recognizes
- ❌ Hard to extend for new USFM features

---

### 4. Custom Build (From Scratch)

**Approach:** Build a USFM parser from specification

#### Technical Details
- **Effort:** 2-3 weeks full-time
- **Approach:** Parse USFM spec → tokenizer → AST → HTML renderer
- **Maintenance:** Ongoing

#### Pros
✅ **Full control** - customize every aspect  
✅ **Optimized for use case** - only what you need  
✅ **No dependencies** - pure code  
✅ **Learning experience** - deep USFM understanding  

#### Cons
❌ **Time-consuming** - 2-3 weeks minimum  
❌ **Complex** - USFM spec is large (100+ markers)  
❌ **Bug-prone** - edge cases, nested markers, special characters  
❌ **Ongoing maintenance** - you own all bugs  
❌ **No testing** - need to create comprehensive test suite  
❌ **Reinventing wheel** - existing solutions work well  

#### Integration Complexity
**Effort:** ~2-3 weeks

**Steps:**
1. Study USFM 3.x specification (~100 pages)
2. Design tokenizer (marker recognition)
3. Build parser (structure handling)
4. Create HTML renderer
5. Write test suite (50+ test cases)
6. Debug edge cases
7. Style output with CSS

#### Reliability: 4/10
- ❌ Untested in production
- ❌ Likely missing edge cases
- ❌ No community validation
- ⚠️ Depends on your implementation quality

#### Scalability: 6/10
- ✅ Can optimize for your exact needs
- ⚠️ Performance depends on implementation
- ❌ May miss performance optimizations from mature libraries

---

## Feature Comparison

### USFM Marker Coverage

| Marker Category | Paranext | usfm-grammar | bjfield | Custom |
|-----------------|----------|--------------|---------|--------|
| **Book/Chapter/Verse** | ✅ All | ✅ All | ✅ Basic | ❓ Depends |
| **Paragraphs** (\\p, \\m, \\pi, etc.) | ✅ All | ✅ All | ⚠️ Some | ❓ Depends |
| **Poetry** (\\q, \\q1, \\q2, etc.) | ✅ All | ✅ All | ⚠️ Basic | ❓ Depends |
| **Lists** (\\li, \\li1, etc.) | ✅ All | ✅ All | ⚠️ Basic | ❓ Depends |
| **Headings** (\\s, \\s1, \\mt, etc.) | ✅ All | ✅ All | ⚠️ Some | ❓ Depends |
| **Footnotes** (\\f...\\f*) | ✅ Full | ✅ Full | ❌ Stripped | ❓ Depends |
| **Cross-references** (\\x...\\x*) | ✅ Full | ✅ Full | ❌ Stripped | ❓ Depends |
| **Character styles** (\\add, \\nd, etc.) | ✅ All | ✅ All | ❌ None | ❓ Depends |
| **Tables** (\\tr, \\tc, etc.) | ✅ All | ✅ All | ❌ None | ❓ Depends |
| **Special features** | ✅ All | ✅ All | ❌ None | ❓ Depends |

### Output Formats

| Format | Paranext | usfm-grammar | bjfield | Custom |
|--------|----------|--------------|---------|--------|
| **USJ (JSON)** | ✅ Primary | ✅ Yes | ❌ No | ❓ Depends |
| **USX (XML)** | ❌ No | ✅ Yes | ❌ No | ❓ Depends |
| **HTML** | ⚠️ Manual | ⚠️ Manual | ✅ Direct | ✅ Direct |
| **CSV** | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **TSV** | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **BibleNLP** | ❌ No | ✅ Yes | ❌ No | ❌ No |

### Platform Support

| Platform | Paranext | usfm-grammar | bjfield | Custom |
|----------|----------|--------------|---------|--------|
| **Node.js** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Browser** | ✅ Yes | ✅ Yes (WASM) | ✅ Yes | ✅ Yes |
| **Python** | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **Bundle Size** | ~50-80KB | ~200-300KB | ~8KB | ~10-50KB |

---

## Use Case Recommendations

### ✅ Recommended: usfm-grammar (Bridgeconn)

**Best for:**
- ✅ **MVP development** - fastest time to market (1-2 days)
- ✅ **Comprehensive USFM support** - handles all USFM 3.x markers
- ✅ **Multiple output needs** - want USJ, USX, CSV, etc.
- ✅ **Production reliability** - tree-sitter parser is robust
- ✅ **npm ecosystem** - want easy package management

**Implementation approach:**
```bash
npm install usfm-grammar
```

```javascript
import { USFMParser } from 'usfm-grammar';
const parser = new USFMParser();
const usj = parser.toUSJ(usfmText);
const html = renderUSJToHTML(usj); // Create simple renderer
```

**Estimated timeline:**
- Day 1: Install package, create USJ → HTML renderer
- Day 2: Add styling (use Paranext's usj-nodes.css as reference), test

---

### ⭐ Alternative: Paranext Official (UsjReaderWriter)

**Best for:**
- ✅ **Paranext ecosystem integration** - want compatibility with Paranext Platform
- ✅ **Official blessing** - prefer officially maintained code
- ✅ **TypeScript projects** - want strong typing
- ✅ **Bi-directional conversion** - need HTML → USJ → USFM round-trip
- ✅ **Access to Paranext styling** - want their official CSS

**Implementation approach:**
```bash
# Clone paranext-core
git clone https://github.com/paranext/paranext-core
cd paranext-core

# Extract needed files
cp lib/platform-bible-utils/src/scripture/usj-reader-writer.ts ./your-project/lib/
cp extensions/src/platform-scripture-editor/src/assets/usj-nodes.css ./your-project/assets/

# Install dependencies
npm install @eten-tech-foundation/scripture-utilities
```

**Estimated timeline:**
- Day 1: Extract UsjReaderWriter class and dependencies
- Day 2: Set up USJ types and test USFM → USJ conversion
- Day 3: Create USJ → HTML renderer
- Day 4: Port usj-nodes.css styling, integrate and test

---

### 🚫 Not Recommended: bjfield Parser

**Only use if:**
- ❌ Bundle size is **critical** (< 10KB)
- ❌ You only need **basic** chapter/verse display
- ❌ Footnotes and cross-references are **not needed**
- ❌ You have time to **extend** the parser significantly

**Why not:**
- Strips important content (footnotes, cross-refs)
- Limited marker support
- No maintenance or support
- Hard to extend reliably

---

### 🚫 Not Recommended: Custom Build

**Only use if:**
- ❌ You have **2-3 weeks** available
- ❌ You need **extremely specific** USFM handling
- ❌ Existing libraries **don't meet** requirements (unlikely)
- ❌ You want **zero dependencies** (extreme constraint)

**Why not:**
- Reinventing the wheel
- High development cost
- Ongoing maintenance burden
- Bug-prone without extensive testing

---

## Final Recommendation

### 🏆 Two-Phase Approach

**Phase 1: MVP (Week 1-2)**
Use **usfm-grammar** for fastest implementation:

```
Timeline: 1-2 days
Effort: Low
Quality: High (production-ready parser)
Risk: Low
```

**Rationale:**
- npm package install - zero extraction work
- Tree-sitter parser - robust and tested
- Multiple output formats - future-proof
- Active maintenance - Bridgeconn is reputable
- Fastest path to working prototype

**Implementation:**
1. `bun install usfm-grammar`
2. Create simple USJ → HTML renderer (~100 lines)
3. Use Paranext's `usj-nodes.css` for styling (reference)
4. Test with sample USFM files
5. Ship MVP

---

**Phase 2: Production (Optional, Month 2-3)**
Evaluate migration to **Paranext Official** if:
- You need Paranext Platform integration
- You want official blessing/support
- TypeScript strong typing is valuable
- Bi-directional conversion (HTML → USJ → USFM) is needed

**Migration effort:** 3-4 days  
**Benefit:** Official implementation, comprehensive marker handling, included styling

---

## Decision Matrix

| If you need... | Use this |
|----------------|----------|
| **Fastest MVP** | usfm-grammar ⭐ |
| **Paranext integration** | Paranext Official |
| **Smallest bundle** | bjfield (⚠️ limited) |
| **Multiple output formats** | usfm-grammar |
| **Official support** | Paranext Official |
| **Zero extraction work** | usfm-grammar |
| **Strong TypeScript types** | Paranext Official |
| **Lowest risk** | usfm-grammar |

---

## Implementation Checklist

### Using usfm-grammar (Recommended)

- [ ] Install package: `bun install usfm-grammar`
- [ ] Create USJ → HTML renderer module
- [ ] Adapt Paranext's `usj-nodes.css` for styling
- [ ] Test with Genesis 1-3 (sample)
- [ ] Test with Psalms (poetry)
- [ ] Test with Luke (gospels with footnotes)
- [ ] Add error handling for malformed USFM
- [ ] Add chapter navigation
- [ ] Optimize HTML rendering performance
- [ ] Document API for team

**Total Estimated Time:** 1-2 days

---

## Questions & Answers

**Q: Why not use Paranext Official from the start?**  
A: It requires extraction from monorepo and doesn't provide HTML output directly. usfm-grammar is npm-ready and faster to integrate. However, Paranext Official is excellent if you have time for proper extraction.

**Q: What about bundle size with usfm-grammar?**  
A: ~200-300KB with tree-sitter. For web apps, consider server-side conversion (recommended in PRD) to keep client bundle small.

**Q: Can I switch from usfm-grammar to Paranext Official later?**  
A: Yes! Both output USJ format. You'd only need to swap the USFM → USJ converter, not the USJ → HTML renderer or styling.

**Q: What about performance?**  
A: Both Paranext Official and usfm-grammar are fast enough for real-time conversion (< 500ms per chapter). bjfield is fastest but least capable.

**Q: Should conversion happen server-side or client-side?**  
A: Server-side recommended for MVP (keeps client bundle small, faster initial load). Move to client-side only if you need offline support.

---

## Conclusion

**Go with usfm-grammar for your Bible reader MVP.** It's the fastest path to a working, reliable USFM converter with comprehensive marker support. The npm package integration is seamless, and you can create a simple USJ → HTML renderer in a day.

If you later need Paranext Platform integration or want the "official" implementation, you can migrate to Paranext's UsjReaderWriter with minimal effort (both use USJ as intermediate format).

**Estimated total implementation time with usfm-grammar: 1-2 days** ⚡

---

**Next Steps:**
1. Install usfm-grammar: `bun install usfm-grammar`
2. Create USJ → HTML renderer (see PRD Section 6.3)
3. Test with sample USFM files
4. Integrate with svelte-golden-layout panels
5. Add navigation and styling

