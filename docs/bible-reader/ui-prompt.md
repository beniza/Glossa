# Bible Reader UI Design Prompt for Google Stitch

Use this prompt with Google Stitch (stitch.withgoogle.com) to generate UI mockups for the Bible Reader application.

---

## Design Brief

Create a modern, clean web application interface for a Bible Reader with integrated AI chat and voice features. The app should feel professional yet approachable, optimized for long reading sessions with excellent typography and spacing.

---

## Application Overview

**Name:** Bible Reader with AI Chat  
**Purpose:** Read multiple Bible translations side-by-side in dockable panels while chatting with AI  
**Target Users:** Seminary students, Bible translators, church members, theologians  
**Key Activities:** Reading Scripture, comparing translations, AI-assisted Bible study  
**Platform:** Desktop web application (responsive design)

---

## Overall Layout Structure

### Main Application Frame

**Layout Type:** Multi-panel docking interface with fixed sidebar and flexible content area

**Key Areas:**
1. **Left Sidebar** (280px fixed width)
   - App branding at top
   - Bible library section
   - Chat interface section
   - Collapsible panels
   
2. **Main Content Area** (flexible width)
   - Dockable Bible reader panels
   - Drag-and-drop panel management
   - Resizable panels
   - Tab bar for multiple panels
   
3. **No Header/Footer** - Maximize reading space

**Color Scheme:**
- Background: Clean white (#FFFFFF) or soft gray (#F9FAFB)
- Sidebar: Slightly darker gray (#F3F4F6)
- Panel borders: Light gray (#E5E7EB)
- Accent: Blue (#3B82F6) for interactive elements
- Text: Dark gray (#111827) for readability
- Muted text: Medium gray (#6B7280)

---

## Component Details

### 1. Left Sidebar (280px)

**Top Section: App Branding (60px height)**
- App icon (Bible + chat bubble combination)
- App name "Bible Reader"
- Clean, minimal design

**Middle Section: Bible Library**
- Section header "Bibles" with (+) icon button
- Scrollable list of uploaded Bibles:
  - Each item shows:
    - Bible name (e.g., "ESV - English Standard Version")
    - Small metadata (e.g., "66 books")
    - Small icon button to open in new panel
    - Delete icon (hover to show)
  - Hover state: Light blue background
  - Active/selected state: Blue background, white text
- Empty state: 
  - Icon (upload cloud)
  - "No Bibles uploaded"
  - "Click + to upload" helper text

**Bottom Section: Chat Interface (collapsible)**
- Section header "AI Chat" with collapse icon
- When expanded (400px height):
  - Message list area (scrollable):
    - User messages: Right-aligned, blue bubble
    - AI messages: Left-aligned, gray bubble
    - Timestamp below each message
    - Clean, spacious chat bubbles
  - Input area at bottom:
    - Text input field with placeholder "Ask about Scripture..."
    - Send button (paper plane icon)
    - Voice button (microphone icon) with toggle state
    - Voice status indicator ("Ready" / "Listening..." / "Thinking...")
  - Model selector dropdown: "OpenAI" / "Gemini"
  
**Dimensions:**
- Total sidebar width: 280px
- Padding: 16px
- Component spacing: 12px

---

### 2. Main Content Area - Bible Reader Panel

**Panel Structure:**
Each panel is a floating/dockable card with:

**Panel Header (48px height)**
- Tab design with:
  - Bible name (bold, e.g., "ESV")
  - Current location (e.g., "Genesis 1")
  - Close button (×) on far right
  - Drag handle (subtle grip icon)
- Background: White with subtle bottom border
- Hover: Slight shadow to indicate interactivity

**Navigation Bar (56px height)**
- Book selector dropdown:
  - Shows current book (e.g., "Genesis")
  - Dropdown with all 66 books grouped (OT/NT)
  - Search/filter capability
- Chapter selector dropdown:
  - Shows current chapter (e.g., "1")
  - Dropdown with chapter numbers (1-50)
  - Shows total chapters for context
- Navigation buttons:
  - Previous chapter (← icon)
  - Next chapter (→ icon)
  - Disabled state when at boundaries
- Right-aligned: Settings icon (optional features)

**Content Area (flexible height, scrollable)**
- Bible text display:
  - **Chapter Heading:** 
    - Large, centered text (e.g., "Chapter 1")
    - Styled as h2, dark gray
    - 32px margin above, 24px below
  
  - **Section Headings:**
    - Bold, slightly larger text
    - Red or dark blue color
    - 24px margin above, 12px below
    - Examples: "The Creation", "The Fall"
  
  - **Verses:**
    - Verse number: Small, superscript-style, muted color (#6B7280)
    - Verse text: Body text, easy to read (16px)
    - Line height: 1.8 for comfortable reading
    - Paragraph spacing: 12px between paragraphs
  
  - **Poetry/Psalms:**
    - Indented text (24px, 48px for nested)
    - Italic style for poetic lines
    - Smaller line height (1.6)
  
  - **Footnotes:**
    - Small superscript marker in text (¹, ², ³)
    - Hover shows tooltip with footnote content
    - Click opens modal with full footnote
  
  - **Cross-references:**
    - Small superscript link (ᵃ, ᵇ, ᶜ)
    - Hover shows reference (e.g., "John 1:1")
    - Click navigates to reference (future feature)

**Typography:**
- Font family: System font stack (Inter, -apple-system, BlinkMacSystemFont)
- Chapter heading: 28px, bold
- Section heading: 20px, semi-bold
- Body text: 16px, regular
- Verse numbers: 12px, medium weight
- Line height: 1.8 (body), 1.4 (headings)
- Max content width: 680px (centered in panel for optimal reading)

**Panel States:**
- Default: White background, subtle shadow
- Active/focused: Blue border (2px)
- Dragging: Increased shadow, slight opacity
- Loading: Skeleton UI with shimmer effect

---

### 3. Panel Docking Behavior (Visual Indicators)

**Docking Zones:**
When dragging a panel, show drop zones:
- Left half: Blue overlay on left 50%
- Right half: Blue overlay on right 50%
- Top half: Blue overlay on top 50%
- Bottom half: Blue overlay on bottom 50%
- Center: Stack as tabs

**Empty State (No Panels):**
- Large centered illustration (Bible book icon)
- "No Bible Open"
- "Select a Bible from the sidebar to start reading"
- Subtle border with dashed line

**Multi-Panel Layout Examples:**
1. **2-Panel Compare:**
   - 50/50 split vertically
   - Subtle divider with drag handle
   - Synchronized scroll (optional)

2. **3-Panel Layout:**
   - Top: 100% width
   - Bottom: 50/50 split
   - Grid-style arrangement

3. **Floating Panel:**
   - Positioned above main grid
   - Drag-to-move handle
   - Resize handles on corners
   - Shadow to show elevation

---

### 4. Upload Bible Modal

**Trigger:** Click (+) button in sidebar

**Modal Design:**
- Centered overlay (500px width)
- Semi-transparent backdrop (#00000066)
- White modal card with shadow
- Close button (×) top-right

**Content:**
- Modal title: "Upload Bible"
- Instruction text: "Select a .zip file containing USFM Bible files"
- Upload area:
  - Dashed border box (200px height)
  - Upload cloud icon
  - "Drag & drop or click to browse"
  - File type hint: ".zip files only"
  - Drag-over state: Blue border, blue background tint
- Action buttons:
  - Cancel (secondary, gray)
  - Upload (primary, blue, disabled until file selected)

**After Upload (Success State):**
- Progress indicator during upload
- Success checkmark
- "3 books found" summary
- "Open in panel" button

**Error State:**
- Error icon (red)
- Error message: "Invalid Bible file. Please ensure the zip contains valid USFM files."
- Try again button

---

### 5. Chat Interface (Expanded State)

**Chat Message Design:**

**User Messages (Right-aligned):**
- Blue background (#3B82F6)
- White text
- Rounded corners (12px, sharp corner bottom-right)
- Max width: 70%
- Padding: 12px 16px
- Timestamp below (right-aligned, small, muted)

**AI Messages (Left-aligned):**
- Light gray background (#F3F4F6)
- Dark text (#111827)
- Rounded corners (12px, sharp corner bottom-left)
- Max width: 70%
- Padding: 12px 16px
- Timestamp below (left-aligned, small, muted)

**Voice Status Indicator:**
- Small pill badge below voice button
- States:
  - "Ready" (gray background, gray text)
  - "Listening..." (blue background, white text, pulsing animation)
  - "Thinking..." (purple background, white text, typing dots animation)
  - "Speaking..." (green background, white text, sound wave animation)

**Voice Button States:**
- Default: Microphone icon, blue border
- Active (listening): Red background, white microphone icon, "End" label
- Disabled: Gray, semi-transparent

**Model Selector:**
- Small dropdown above input
- Options: "OpenAI" | "Gemini"
- Shows current model with small icon
- Clean, minimal design

---

### 6. Visual Hierarchy & Spacing

**Spacing Scale (Tailwind-inspired):**
- xs: 4px
- sm: 8px
- md: 12px
- lg: 16px
- xl: 24px
- 2xl: 32px
- 3xl: 48px

**Component Margins:**
- Between sidebar sections: 24px
- Between Bible list items: 4px
- Between chat messages: 8px
- Between panels: 16px
- Panel padding: 16px

**Z-index Layers:**
1. Background: 0
2. Panels: 10
3. Floating panels: 20
4. Sidebar: 30
5. Modal backdrop: 40
6. Modal: 50

---

### 7. Responsive Behavior

**Desktop (1280px+):**
- Full multi-panel layout
- Sidebar visible
- Multiple Bible panels side-by-side

**Tablet (768px - 1279px):**
- Collapsible sidebar (hamburger menu)
- Single panel view with tabs
- Chat as bottom sheet

**Mobile (< 768px):**
- Full-screen single panel
- Bottom navigation bar
- Sidebar as slide-out drawer
- Chat as modal overlay

---

### 8. Interactive States

**Buttons:**
- Default: Blue background, white text
- Hover: Darker blue (#2563EB)
- Active: Even darker (#1D4ED8)
- Disabled: Gray, semi-transparent, no pointer

**Inputs:**
- Default: Gray border, white background
- Focus: Blue border, blue ring
- Error: Red border, red ring
- Disabled: Gray background

**Dropdowns:**
- Default: Gray border, white background
- Open: Blue border, dropdown list with shadow
- Items hover: Light blue background

**Panels:**
- Default: White, subtle shadow
- Hover (on header): Cursor changes to grab
- Active/dragging: Increased shadow, slight scale
- Focus: Blue border

---

### 9. Loading & Empty States

**Panel Loading:**
- Skeleton UI with shimmer animation
- Gray blocks representing:
  - Chapter heading placeholder
  - 3-4 verse placeholders
  - Proper spacing maintained

**Empty Bible Library:**
- Icon: Upload cloud (large, gray)
- Message: "No Bibles uploaded yet"
- Subtext: "Click the + button to upload your first Bible"
- Center-aligned in sidebar section

**Empty Chat:**
- Icon: Chat bubble (large, gray)
- Message: "Start a conversation"
- Subtext: "Ask questions about Scripture"
- Center-aligned in chat area

---

### 10. Accessibility Features

**Visual:**
- High contrast text (AAA standard)
- Focus indicators on all interactive elements
- Keyboard navigation support
- Resize text without breaking layout

**Icons:**
- All icons have text labels (visible or aria-label)
- Icon size: 20px (standard), 24px (large)
- Consistent icon family (Lucide or Heroicons)

---

## Key User Flows to Design

### Flow 1: Upload and Open Bible
1. Empty sidebar state
2. Click (+) button
3. Upload modal appears
4. Drag file or browse
5. Upload progress
6. Success state with "Open" button
7. Bible appears in sidebar
8. Click Bible name
9. Panel opens with Genesis 1
10. User reads content

### Flow 2: Compare Two Translations
1. Two Bibles in sidebar (ESV, NIV)
2. Click ESV → Opens in left panel
3. Click NIV → Opens in right panel
4. Both show Genesis 1
5. User scrolls one panel
6. (Optional) Synchronized scroll in other panel
7. User navigates ESV to Genesis 2
8. NIV stays on Genesis 1 (independent)

### Flow 3: Chat While Reading
1. Bible open in main panel (Genesis 1)
2. User clicks chat section to expand
3. Types: "Explain Genesis 1:1"
4. AI responds with explanation
5. User clicks verse reference in chat
6. (Future) Panel scrolls to verse

### Flow 4: Voice Chat
1. User clicks microphone button in chat
2. Browser prompts for microphone permission
3. User grants permission
4. Status changes to "Listening..."
5. User speaks: "Read Psalm 23"
6. Status changes to "Thinking..."
7. AI responds with voice
8. Transcript appears as chat message
9. User clicks "End" to stop

---

## Design Inspiration & Style

**Similar Apps for Reference:**
- Notion (clean panels, docking)
- Obsidian (multi-pane layout)
- VS Code (panel management)
- Bible Gateway (Bible text formatting)
- ChatGPT (chat interface)

**Design Style:**
- Modern and minimal
- Professional but approachable
- Optimized for long reading sessions
- Clean typography with excellent hierarchy
- Subtle shadows and borders
- Smooth animations (250ms transitions)
- No clutter, maximum content focus

**Mood:**
- Calm and focused (for Bible reading)
- Efficient and professional (for comparison work)
- Friendly and helpful (for chat interface)

---

## Technical Notes for Stitch

- Use components that map to Tailwind CSS classes
- Design for SvelteKit/Svelte component structure
- Keep spacing consistent (multiples of 4px)
- Use SVG icons (outline style)
- Consider dark mode variant (future)
- Export components as reusable elements

---

## Mockup Priorities

**Must Have (Priority 1):**
1. ✅ Main layout with sidebar + panel area
2. ✅ Single Bible reader panel with Genesis 1 content
3. ✅ Bible list in sidebar (3 Bibles shown)
4. ✅ Chat interface (collapsed and expanded states)
5. ✅ Upload modal

**Nice to Have (Priority 2):**
6. ✅ 2-panel comparison layout
7. ✅ Voice chat active state
8. ✅ Panel dragging indicators
9. ✅ Empty states
10. ✅ Loading states

**Future (Priority 3):**
11. Dark mode variant
12. Mobile responsive views
13. Settings modal
14. Search interface

---

## Output Format Requests

**From Google Stitch:**
1. **Main Dashboard View** - Full application with sidebar + single panel
2. **Comparison View** - Two panels side-by-side
3. **Chat Expanded View** - Showing active chat conversation
4. **Upload Modal** - Bible upload flow
5. **Empty State** - No Bibles uploaded
6. **Component Library** - Individual components (buttons, inputs, panels)

**Export As:**
- Figma-compatible design file
- PNG mockups (1920x1080)
- Component specs (CSS/Tailwind)

---

## Example Prompts for Stitch

**Prompt 1 (Main View):**
```
Design a Bible reader web app main screen. Left sidebar (280px, gray background) contains "Bible Reader" title at top, a list of 3 Bible translations (ESV, NIV, KJV) with small icons, and a collapsed "AI Chat" section at bottom. Main area shows a single white panel with navigation bar (book/chapter dropdowns, prev/next buttons) and Bible text content (Genesis 1 formatted with verse numbers, proper typography). Clean, modern, minimal design. Use blue accent color.
```

**Prompt 2 (Comparison View):**
```
Same Bible reader app, but now showing two panels side-by-side (50/50 split). Left panel shows ESV Genesis 1, right panel shows NIV Genesis 1. Both panels have their own navigation bars. Subtle vertical divider between panels. Professional typography, excellent readability.
```

**Prompt 3 (Chat Expanded):**
```
Focus on the chat section of the Bible reader app. Expanded chat interface (400px height) showing conversation. User message (right-aligned, blue bubble): "Explain Genesis 1:1". AI message (left-aligned, gray bubble): "Genesis 1:1 describes..." Below is input field with Send button and Voice button (microphone icon). Voice status indicator shows "Ready". Model selector dropdown shows "OpenAI".
```

---

Ready to paste into Google Stitch!
