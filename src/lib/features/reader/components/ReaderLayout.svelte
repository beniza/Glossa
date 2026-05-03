<script lang="ts">
import GoldenLayout from 'svelte-golden-layout';
import type { LayoutConfig } from 'golden-layout';
import 'svelte-golden-layout/css/themes/goldenlayout-light-theme.css';
import BiblePanel from './BiblePanel.svelte';

/**
 * ReaderLayout - Dockable panel container for Bible reading
 * 
 * Features:
 * - Multi-panel Bible comparison (side-by-side)
 * - Drag & drop panel rearrangement
 * - Resizable panels
 * - Tab-based interface
 * 
 * Usage:
 * <ReaderLayout />
 */

// Component registry for golden-layout
const components: Record<string, any> = {
BiblePanel
};

// Default layout configuration - 2 Bible panels side-by-side
let layout: LayoutConfig = {
root: {
type: 'row',
content: [
{
type: 'component',
componentType: 'BiblePanel',
title: 'Malayalam OV 1910 - Genesis',
componentState: {
bibleId: 'malov1910',
bookCode: 'GEN',
chapter: 1
}
},
{
type: 'component',
componentType: 'BiblePanel',
title: 'Malayalam OV 1910 - Exodus',
componentState: {
bibleId: 'malov1910',
bookCode: 'EXO',
chapter: 1
}
}
]
}
};

/**
 * Add a new Bible panel to the layout
 */
export function addPanel(bibleId: string | null = null, bookCode: string = 'GEN', chapter: number = 1) {
// TODO: Implement dynamic panel addition
// Note: svelte-golden-layout recreates the whole layout when config changes
console.log('Adding panel:', { bibleId, bookCode, chapter });
}
</script>

<div class="reader-layout-container">
<GoldenLayout config={layout} let:componentType let:componentState>
{#if components[componentType]}
{@const Component = components[componentType]}
{@const state = componentState as Record<string, any>}
<Component {...state} />
{/if}
</GoldenLayout>
</div>

<style>
.reader-layout-container {
width: 100%;
height: 100%;
overflow: hidden;
}

/* Override golden-layout theme for better integration */
:global(.lm_goldenlayout) {
background: var(--color-background, #ffffff);
}

:global(.lm_header) {
background: var(--color-surface, #f5f5f5);
border-bottom: 1px solid var(--color-border, #e0e0e0);
}

:global(.lm_tab) {
background: transparent;
color: var(--color-text-secondary, #666);
}

:global(.lm_tab.lm_active) {
background: var(--color-background, #ffffff);
color: var(--color-text-primary, #000);
}

:global(.lm_content) {
background: var(--color-background, #ffffff);
}
</style>