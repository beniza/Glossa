<script lang="ts">
/**
 * BiblePanel - Individual Bible reading panel
 * 
 * Displays a single Bible translation with book/chapter navigation
 * and rendered USFM content.
 * 
 * Props:
 * - bibleId: ID of the Bible to display (null = no Bible selected)
 * - bookCode: Current book code (e.g., "GEN", "MAT")
 * - chapter: Current chapter number
 */

interface Props {
bibleId?: string | null;
bookCode?: string;
chapter?: number;
}

let { bibleId = null, bookCode = 'GEN', chapter = 1 }: Props = $props();

let htmlContent = $state('');
let loading = $state(false);
let error = $state<string | null>(null);

// Load Bible chapter when params change
$effect(() => {
if (bibleId && bookCode && chapter) {
loadChapter();
}
});

async function loadChapter() {
if (!bibleId) return;

loading = true;
error = null;

try {
const response = await fetch(`/api/bible/convert/${bibleId}/${bookCode}/${chapter}`);

if (!response.ok) {
throw new Error(`Failed to load chapter: ${response.status} ${response.statusText}`);
}

const data = await response.json();
htmlContent = data.html;
} catch (err) {
error = err instanceof Error ? err.message : 'Unknown error loading chapter';
console.error('Error loading chapter:', err);
} finally {
loading = false;
}
}

function previousChapter() {
if (chapter > 1) {
chapter -= 1;
}
// TODO: Navigate to previous book when at chapter 1
}

function nextChapter() {
chapter += 1;
// TODO: Handle max chapters per book
}
</script>

<div class="bible-panel">
<div class="bible-panel-header">
{#if bibleId}
<span class="bible-id">{bibleId}</span>
<span class="reference">{bookCode} {chapter}</span>
<div class="nav-buttons">
<button onclick={previousChapter} disabled={chapter === 1}>←</button>
<button onclick={nextChapter}>→</button>
</div>
{:else}
<span class="no-bible">No Bible selected</span>
{/if}
</div>

<div class="bible-panel-content">
{#if !bibleId}
<div class="empty-state">
<p>Upload a Bible to get started</p>
</div>
{:else if loading}
<div class="loading-state">
<p>Loading {bookCode} {chapter}...</p>
</div>
{:else if error}
<div class="error-state">
<p>Error: {error}</p>
</div>
{:else}
<div class="bible-text">
{@html htmlContent}
</div>
{/if}
</div>
</div>

<style>
.bible-panel {
display: flex;
flex-direction: column;
height: 100%;
overflow: hidden;
}

.bible-panel-header {
display: flex;
align-items: center;
gap: 1rem;
padding: 0.75rem 1rem;
background: var(--color-surface, #f5f5f5);
border-bottom: 1px solid var(--color-border, #e0e0e0);
}

.bible-id {
font-weight: 600;
color: var(--color-primary, #1976d2);
text-transform: uppercase;
font-size: 0.875rem;
}

.reference {
font-weight: 500;
color: var(--color-text-primary, #000);
}

.no-bible {
color: var(--color-text-secondary, #666);
font-style: italic;
}

.nav-buttons {
margin-left: auto;
display: flex;
gap: 0.5rem;
}

.nav-buttons button {
padding: 0.25rem 0.75rem;
background: var(--color-primary, #1976d2);
color: white;
border: none;
border-radius: 4px;
cursor: pointer;
font-size: 1rem;
transition: opacity 0.2s;
}

.nav-buttons button:hover:not(:disabled) {
opacity: 0.8;
}

.nav-buttons button:disabled {
opacity: 0.3;
cursor: not-allowed;
}

.bible-panel-content {
flex: 1;
overflow-y: auto;
padding: 1.5rem;
}

.empty-state,
.loading-state,
.error-state {
display: flex;
align-items: center;
justify-content: center;
height: 100%;
color: var(--color-text-secondary, #666);
font-style: italic;
}

.error-state {
color: var(--color-error, #d32f2f);
}

.bible-text {
max-width: 800px;
margin: 0 auto;
line-height: 1.8;
font-size: 1.125rem;
}

/* USFM content styling */
.bible-text :global(.verse) {
margin-bottom: 0.5rem;
}

.bible-text :global(sup) {
color: var(--color-primary, #1976d2);
font-weight: 600;
margin-right: 0.25rem;
}

.bible-text :global(p) {
margin-bottom: 1rem;
}

.bible-text :global(h1),
.bible-text :global(h2),
.bible-text :global(h3) {
margin: 1.5rem 0 1rem;
color: var(--color-text-primary, #000);
}

.bible-text :global(.poetry) {
margin-left: 2rem;
font-style: italic;
}

.bible-text :global(.footnote) {
color: var(--color-text-secondary, #666);
font-size: 0.875rem;
}
</style>