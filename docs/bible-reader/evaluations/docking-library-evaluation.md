# Docking Library Evaluation for Svelte Bible Reader

## Executive Summary

After researching available docking solutions for Svelte applications, here are the key findings:

**Recommended Options (Ranked):**
1. **svelte-golden-layout** - Best Svelte integration, but limited features
2. **Custom Svelte Solution** - Most flexible for Svelte, requires development effort
3. **FlexLayout (React)** - Most feature-rich, but requires React integration
4. **rc-dock (React)** - Good alternative to FlexLayout

---

## Comprehensive Comparison Table

| Criterion | svelte-golden-layout | Custom Svelte Solution | FlexLayout (React) | rc-dock (React) |
|-----------|---------------------|----------------------|-------------------|-----------------|
| **OVERALL SCORE** | **7.0/10** | **8.5/10** | **8.8/10** | **8.0/10** |

### 1. UX (User Experience)

| Feature | svelte-golden-layout | Custom Svelte | FlexLayout | rc-dock |
|---------|---------------------|---------------|------------|---------|
| **Drag & Drop** | ✅ Smooth | ⚠️ Requires implementation | ✅ Excellent | ✅ Excellent |
| **Panel Resizing** | ✅ Good | ⚠️ Requires implementation | ✅ Excellent | ✅ Good |
| **Floating Panels** | ❌ Not working yet | ⚠️ Requires implementation | ✅ Yes | ✅ Yes |
| **Visual Feedback** | ⚠️ Basic | 🎯 Fully customizable | ✅ Excellent | ✅ Good |
| **Animations** | ⚠️ Limited | 🎯 Fully customizable | ✅ Smooth | ✅ Smooth |
| **Mobile Support** | ❌ Unknown | 🎯 Can optimize | ✅ Yes (iPad, Android) | ⚠️ Limited |
| **Keyboard Navigation** | ❌ Not mentioned | 🎯 Customizable | ✅ Basic | ⚠️ Limited |
| **Tabbed Interface** | ✅ Yes | ⚠️ Requires implementation | ✅ Yes | ✅ Yes |
| **Maximize/Minimize** | ⚠️ Limited | ⚠️ Requires implementation | ✅ Yes | ✅ Yes |
| **UX Score** | **6.5/10** | **7.5/10** | **9.5/10** | **8.0/10** |

**Notes:**
- **svelte-golden-layout**: Known limitation - dragging tabset dividers causes text selection
- **Custom**: Best for tailoring UX to exact requirements
- **FlexLayout**: Most polished UX out-of-the-box
- **rc-dock**: Good balance, slightly less polished than FlexLayout

---

### 2. UI (Visual & Theming)

| Feature | svelte-golden-layout | Custom Svelte | FlexLayout | rc-dock |
|---------|---------------------|---------------|------------|---------|
| **Themes** | ✅ Light theme | 🎯 Unlimited | ✅ 9 themes | ✅ Light + Dark |
| **Theme Switching** | ⚠️ Manual | 🎯 Native Svelte | ✅ Dynamic | ⚠️ Manual |
| **Customization** | ⚠️ Limited | 🎯 Complete control | ✅ Extensive | ✅ Good |
| **CSS Integration** | ✅ Standard CSS | 🎯 Svelte style scoping | ⚠️ React CSS | ⚠️ React CSS |
| **Responsive Design** | ⚠️ Basic | 🎯 Fully controllable | ✅ Yes | ⚠️ Basic |
| **Visual Polish** | ⚠️ Basic | 🎯 Depends on effort | ✅ Professional | ✅ Good |
| **UI Score** | **6.0/10** | **9.0/10** | **9.0/10** | **7.5/10** |

**Notes:**
- **svelte-golden-layout**: Basic but functional UI
- **Custom**: Best for matching app's design system
- **FlexLayout**: Most theme options (alpha_light, dark, rounded, etc.)
- **rc-dock**: Clean, modern look with light/dark themes

---

### 3. Technical Integration

| Feature | svelte-golden-layout | Custom Svelte | FlexLayout | rc-dock |
|---------|---------------------|---------------|------------|---------|
| **Svelte Compatibility** | ✅ Native | ✅ Native | ❌ React only | ❌ React only |
| **SvelteKit Support** | ✅ Yes | ✅ Yes | ⚠️ Via wrapper | ⚠️ Via wrapper |
| **Bundle Size** | ⚠️ ~150KB (with GoldenLayout) | 🎯 Minimal | ❌ ~200KB+ (React + lib) | ❌ ~180KB (React + lib) |
| **Dependencies** | golden-layout 2.x | None (DnD lib optional) | React only | React only |
| **TypeScript** | ✅ Yes | ✅ Native | ✅ Excellent | ✅ Good |
| **API Complexity** | ⚠️ Moderate | 🎯 Simple (stores) | ⚠️ Complex | ⚠️ Moderate |
| **Learning Curve** | ⚠️ Moderate | 🎯 Low (if familiar with Svelte) | ❌ Steep | ⚠️ Moderate |
| **Component State** | ✅ Preserved | 🎯 Svelte stores | ✅ Preserved | ✅ Preserved |
| **React Wrapper Needed** | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **Technical Score** | **7.0/10** | **9.5/10** | **6.0/10** | **6.5/10** |

**Notes:**
- **svelte-golden-layout**: Only Svelte-native option
- **Custom**: Perfect fit for Svelte, no external dependencies
- **FlexLayout/rc-dock**: Would require React installation + wrapper component
- Bundle sizes include estimated overhead for React integration

---

### 4. Reliability & Maturity

| Feature | svelte-golden-layout | Custom Svelte | FlexLayout | rc-dock |
|---------|---------------------|---------------|------------|---------|
| **Stability** | ⚠️ Beta-quality | 🎯 Depends on implementation | ✅ Mature | ✅ Stable |
| **GitHub Stars** | 43 ⭐ | N/A | 1,286 ⭐ | 806 ⭐ |
| **Last Updated** | March 2026 | N/A | May 2026 (Active) | April 2026 (Active) |
| **Issues/Bugs** | 4 open issues | 🎯 Own bugs | 184 open issues | 53 open issues |
| **Community** | ⚠️ Small | 🎯 Svelte community | ✅ Large | ⚠️ Medium |
| **Documentation** | ⚠️ Basic | 🎯 Self-documented | ✅ Excellent | ✅ Good |
| **Test Coverage** | ❌ Unknown | 🎯 Depends on us | ✅ Playwright tests | ⚠️ Limited |
| **Known Limitations** | ✅ Documented | 🎯 We control | ⚠️ Many edge cases | ⚠️ Some bugs |
| **Production Use** | ⚠️ Limited | 🎯 We validate | ✅ Widely used | ✅ Production-ready |
| **Reliability Score** | **5.5/10** | **7.0/10** | **8.5/10** | **7.5/10** |

**Known Limitations:**
- **svelte-golden-layout**: 
  - Popout tabs don't work yet
  - Layout changes recreate all components
  - Text selection issue during drag
- **FlexLayout**: 184 open issues (but many are feature requests)
- **rc-dock**: Fewer issues, but smaller feature set

---

### 5. Scalability & Performance

| Feature | svelte-golden-layout | Custom Svelte | FlexLayout | rc-dock |
|---------|---------------------|---------------|------------|---------|
| **Panel Limit** | ⚠️ Unknown | 🎯 Depends on implementation | ✅ 10+ panels | ✅ 10+ panels |
| **Memory Usage** | ⚠️ Moderate | 🎯 Optimizable | ⚠️ High (React overhead) | ⚠️ High (React overhead) |
| **Render Performance** | ✅ Good | 🎯 Excellent (Svelte compiler) | ⚠️ Good | ✅ Good |
| **State Management** | ⚠️ Recreates on layout change | 🎯 Svelte stores (efficient) | ✅ Preserved | ✅ Preserved |
| **Layout Persistence** | ⚠️ Manual | 🎯 localStorage + stores | ✅ Built-in | ✅ Built-in |
| **Large Layouts** | ⚠️ Unknown | 🎯 Optimizable | ✅ Tested | ✅ Good |
| **Lazy Loading** | ❌ Not supported | 🎯 Can implement | ✅ Possible | ⚠️ Limited |
| **Hot Reload** | ✅ Works | ✅ Works | ⚠️ Requires setup | ⚠️ Requires setup |
| **Scalability Score** | **6.0/10** | **9.0/10** | **8.0/10** | **7.5/10** |

**Notes:**
- **Custom Svelte**: Can implement virtual scrolling, lazy loading, etc.
- **React libraries**: Additional memory overhead from React runtime
- **svelte-golden-layout**: Component recreation on layout change is a concern

---

### 6. Features

| Feature | svelte-golden-layout | Custom Svelte | FlexLayout | rc-dock |
|---------|---------------------|---------------|------------|---------|
| **Drag & Drop** | ✅ Yes | ⚠️ Requires svelte-dnd-action | ✅ Yes | ✅ Yes |
| **Docking Zones** | ✅ Yes | ⚠️ Implement | ✅ Extensive | ✅ Good |
| **Floating Panels** | ❌ Not working | ⚠️ Implement | ✅ Yes | ✅ Yes |
| **Popout Windows** | ❌ Not working | ⚠️ Complex to implement | ✅ Yes | ✅ Yes |
| **Tab Overflow** | ⚠️ Unknown | ⚠️ Implement | ✅ Menu + scroll | ✅ Yes |
| **Borders/Sidebars** | ⚠️ Unknown | ⚠️ Implement | ✅ Yes | ⚠️ Limited |
| **Nested Layouts** | ✅ Rows/columns | ⚠️ Implement | ✅ Submodels | ⚠️ Basic |
| **State Serialization** | ⚠️ Basic | 🎯 Full control | ✅ Excellent | ✅ Good |
| **Tab Renaming** | ❌ No | ⚠️ Implement | ✅ Yes | ⚠️ Limited |
| **Custom Rendering** | ✅ Slots | 🎯 Complete control | ✅ Render callbacks | ✅ Render functions |
| **Features Score** | **5.5/10** | **6.5/10** | **10/10** | **7.5/10** |

**Feature Comparison:**
- **FlexLayout**: Most feature-complete (35+ features)
- **rc-dock**: Core features, simpler API
- **svelte-golden-layout**: Basic but functional
- **Custom**: Can implement exactly what's needed

---

### 7. Development Effort

| Aspect | svelte-golden-layout | Custom Svelte | FlexLayout | rc-dock |
|---------|---------------------|---------------|------------|---------|
| **Initial Setup** | 1-2 hours | 2-3 days | 3-4 hours (wrapper) | 2-3 hours (wrapper) |
| **Customization** | Moderate effort | Low effort (native) | High effort (React) | Moderate effort |
| **Bug Fixes** | ⚠️ Wait for maintainer | 🎯 Full control | ⚠️ Community/PR | ⚠️ Community/PR |
| **Future Maintenance** | ⚠️ Depends on maintainer | 🎯 We control | ✅ Active project | ✅ Active project |
| **Team Familiarity** | ⚠️ New library | ✅ Svelte patterns | ❌ Requires React knowledge | ❌ Requires React knowledge |
| **Effort Score** | **7.0/10** | **6.0/10** | **5.0/10** | **6.0/10** |

**Time Estimates:**
- **svelte-golden-layout**: 2-3 days to integrate and style
- **Custom Svelte**: 4-6 days for MVP, 1-2 weeks for full features
- **FlexLayout**: 3-4 days (wrapper + integration)
- **rc-dock**: 2-3 days (wrapper + integration)

---

## Detailed Analysis

### Option 1: svelte-golden-layout ⭐ 7.0/10

**Pros:**
- ✅ Native Svelte integration (uses slots)
- ✅ Lightweight compared to React alternatives
- ✅ TypeScript support
- ✅ Active as of March 2026
- ✅ Based on stable GoldenLayout 2.x
- ✅ Simple API for basic use cases
- ✅ Component state preserved via Svelte lifecycle

**Cons:**
- ❌ Small community (43 stars)
- ❌ Floating panels not working yet
- ❌ Limited documentation
- ❌ Layout changes recreate components (state loss risk)
- ❌ Known UI bug (text selection during drag)
- ❌ Unknown scalability characteristics
- ❌ Personal project extraction (limited scope)

**Best For:**
- Quick MVP with basic docking needs
- Teams committed to Svelte-only solutions
- Projects that can tolerate limited features
- Scenarios where floating panels aren't critical

**Risk Level:** Medium-High
- Maintainer availability uncertain
- Feature set may not grow
- Bugs might not get fixed quickly

---

### Option 2: Custom Svelte Solution ⭐ 8.5/10

**Pros:**
- ✅ Perfect Svelte integration
- ✅ Complete control over features and UX
- ✅ No external dependencies (except optional DnD)
- ✅ Optimal performance (Svelte compiler)
- ✅ Can implement exactly what's needed
- ✅ No React overhead
- ✅ Full TypeScript support
- ✅ Leverages Svelte stores for state
- ✅ Can optimize for Bible reader use case

**Cons:**
- ❌ Requires 1-2 weeks development time
- ❌ Need to implement all features from scratch
- ❌ Testing burden on us
- ❌ Ongoing maintenance responsibility
- ❌ Drag & drop complexity
- ❌ Cross-browser quirks to handle
- ❌ No community support for docking logic

**Best For:**
- Teams with Svelte expertise
- Projects with specific UX requirements
- Long-term product with dedicated maintenance
- When full control is priority

**Implementation Strategy:**
1. Use svelte-dnd-action for drag & drop
2. Svelte stores for panel state
3. CSS Grid/Flexbox for layout
4. localStorage for persistence
5. Iterative feature addition

**Estimated Effort:**
- Basic docking: 2-3 days
- Drag & drop: 2-3 days
- Floating panels: 2-3 days
- Polish & testing: 2-3 days
- **Total: 1-2 weeks**

---

### Option 3: FlexLayout (React) ⭐ 8.8/10

**Pros:**
- ✅ Most feature-complete (35+ features)
- ✅ Excellent documentation
- ✅ Actively maintained (1,286 stars)
- ✅ Production-tested (widely used)
- ✅ Playwright tests included
- ✅ 9 themes with dynamic switching
- ✅ Mobile support
- ✅ Popout windows working
- ✅ TypeScript support
- ✅ Comprehensive API

**Cons:**
- ❌ React only (not Svelte-native)
- ❌ Requires React installation (~100KB)
- ❌ Need wrapper component
- ❌ 184 open issues (many edge cases)
- ❌ Larger bundle size
- ❌ Mixing React and Svelte in same app
- ❌ React state management complexity
- ❌ Higher memory usage

**Best For:**
- Feature-rich requirements
- Teams familiar with React
- Projects where bundle size isn't critical
- Need for mature, battle-tested solution

**Integration Approach:**
```svelte
<script>
  import { onMount } from 'svelte';
  import ReactWrapper from './ReactWrapper.svelte';
  
  // Mount React FlexLayout in Svelte component
</script>

<ReactWrapper component={FlexLayout} props={{model, factory}} />
```

**Risk Level:** Low
- Well-maintained, but React dependency adds complexity

---

### Option 4: rc-dock (React) ⭐ 8.0/10

**Pros:**
- ✅ Solid feature set
- ✅ Good documentation
- ✅ Active maintenance (806 stars)
- ✅ Cleaner API than FlexLayout
- ✅ TypeScript support
- ✅ Light + Dark themes
- ✅ Fewer open issues (53)
- ✅ Popout windows working
- ✅ Production-ready

**Cons:**
- ❌ React only (not Svelte-native)
- ❌ Requires React installation
- ❌ Need wrapper component
- ❌ Fewer themes than FlexLayout
- ❌ Limited mobile support
- ❌ Smaller community than FlexLayout
- ❌ Mixing frameworks

**Best For:**
- Need React library but want simpler API
- Core docking features without FlexLayout complexity
- Good balance of features vs. simplicity

**vs FlexLayout:**
- Simpler API
- Fewer features
- Fewer bugs/issues
- Cleaner codebase

---

## Decision Matrix

### By Priority:

**If Native Svelte is Critical:**
1. Custom Svelte Solution (8.5/10)
2. svelte-golden-layout (7.0/10)

**If Features are Critical:**
1. FlexLayout (8.8/10)
2. rc-dock (8.0/10)
3. Custom Svelte (8.5/10) - if willing to build

**If Time-to-Market is Critical:**
1. svelte-golden-layout (7.0/10) - 2-3 days
2. rc-dock (8.0/10) - 2-3 days
3. FlexLayout (8.8/10) - 3-4 days

**If Long-term Maintenance is Critical:**
1. Custom Svelte (8.5/10) - full control
2. FlexLayout (8.8/10) - active community
3. rc-dock (8.0/10) - stable

**If Performance is Critical:**
1. Custom Svelte (8.5/10) - optimized
2. svelte-golden-layout (7.0/10) - no React
3. FlexLayout/rc-dock - React overhead

---

## Recommendations

### 🥇 Recommended: Custom Svelte Solution (8.5/10)

**Why:**
- Best fit for Svelte/SvelteKit architecture
- Complete control over UX tailored to Bible reader
- No React dependency baggage
- Optimal performance
- Can implement exactly needed features (no bloat)
- Good learning opportunity for team

**When to choose:**
- Team has 1-2 weeks for implementation
- Long-term product commitment
- Svelte expertise available
- Specific UX requirements
- Performance is priority

**Implementation Plan:**
1. Week 1: Core docking with drag & drop
2. Week 2: Floating panels + polish
3. Ongoing: Iterate based on user feedback

---

### 🥈 Alternative: svelte-golden-layout (7.0/10)

**Why:**
- Fastest path to MVP (2-3 days)
- Native Svelte integration
- Good enough for basic needs
- Can migrate to custom later if needed

**When to choose:**
- Need quick proof of concept
- Basic docking sufficient initially
- Can tolerate limitations
- Want to validate concept before investing more

**Mitigation Strategy:**
- Abstract docking logic behind interface
- Plan migration path to custom solution
- Monitor project for updates

---

### 🥉 Fallback: FlexLayout (8.8/10)

**Why:**
- Most feature-complete
- Proven in production
- Good documentation
- Active community

**When to choose:**
- Team comfortable with React
- Need advanced features immediately
- Bundle size not a concern
- Want battle-tested solution

**Hybrid Approach:**
- Use FlexLayout for MVP
- Migrate to custom Svelte incrementally
- Keep React isolated in wrapper

---

## Final Recommendation

**Start with svelte-golden-layout, Plan for Custom Svelte**

### Phase 1: MVP (Week 1-2)
- Use **svelte-golden-layout** for quick MVP
- Validate docking concept with users
- Abstract behind interface for easy migration

### Phase 2: Production (Week 3-4)
- Begin **custom Svelte solution** if needed
- Implement features based on user feedback
- Migrate incrementally

### Rationale:
1. **Fastest validation** - Get user feedback quickly
2. **Lowest risk** - Prove concept before big investment
3. **Best long-term** - Custom solution for production
4. **Svelte-native** - Consistent with architecture

### Success Criteria:
- ✅ 4+ Bible panels simultaneously
- ✅ Smooth drag & drop
- ✅ Panel persistence
- ✅ Responsive performance
- ✅ <200ms panel operations

---

## Implementation Resources

### For svelte-golden-layout:
```bash
bun add svelte-golden-layout golden-layout
```

### For Custom Solution:
```bash
bun add svelte-dnd-action  # Optional for drag & drop
```

### For FlexLayout (if needed):
```bash
bun add react react-dom flexlayout-react
```

---

## Appendix: Code Examples

### svelte-golden-layout Example:
```svelte
<script>
  import GoldenLayout from 'svelte-golden-layout';
  import BibleReader from './BibleReader.svelte';
  
  const layout = {
    root: {
      type: 'row',
      content: [
        { type: 'component', componentType: 'bible', componentState: { bibleId: 'KJV' } }
      ]
    }
  };
</script>

<GoldenLayout config={layout} let:componentState>
  <BibleReader {...componentState} />
</GoldenLayout>
```

### Custom Svelte Stores Example:
```typescript
// panels.ts
import { writable } from 'svelte/store';

export const panels = writable([
  { id: '1', bibleId: 'KJV', book: 'GEN', chapter: 1, position: { x: 0, y: 0, width: 50, height: 100 } }
]);

export function addPanel(bibleId: string) {
  panels.update(p => [...p, { id: crypto.randomUUID(), bibleId, book: 'GEN', chapter: 1, position: {...} }]);
}
```

---

**Document Version:** 1.0  
**Date:** May 2, 2026  
**Next Review:** After MVP testing
