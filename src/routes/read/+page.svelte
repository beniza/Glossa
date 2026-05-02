<script lang="ts">
import ReaderLayout from '$lib/features/reader/components/ReaderLayout.svelte';

/**
 * Bible Reader Page
 * Main entry point for the Bible reading interface
 */
</script>

<svelte:head>
<title>Bible Reader | Glossa</title>
</svelte:head>

<div class="page-container">
<ReaderLayout />
</div>

<style>
.page-container {
width: 100vw;
height: 100vh;
overflow: hidden;
}
</style>