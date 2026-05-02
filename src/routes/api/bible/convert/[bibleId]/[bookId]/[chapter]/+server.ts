/**
 * Bible Conversion API Endpoint
 * GET /api/bible/convert/:bibleId/:bookId/:chapter
 * 
 * Converts a specific chapter from USFM to HTML on-demand.
 * This is used by the Bible Reader panels to display formatted Bible text.
 */

import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { convertUSFMToHTML } from '$lib/features/reader/converter';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';

/**
 * GET handler for Bible chapter conversion
 * 
 * @param params.bibleId - Unique identifier for the Bible translation (e.g., "web-2025")
 * @param params.bookId - Book code (e.g., "GEN", "MAT", "PSA")
 * @param params.chapter - Chapter number (e.g., "1", "119")
 * 
 * @returns JSON response with HTML and metadata
 * 
 * Example response:
 * {
 *   "html": "<div class=\"usfm-content\">...</div>",
 *   "metadata": {
 *     "book": "GEN",
 *     "chapter": 1,
 *     "verses": 31,
 *     "bibleId": "web-2025"
 *   }
 * }
 */
export const GET: RequestHandler = async ({ params }) => {
const { bibleId, bookId, chapter } = params;

// Validate parameters
if (!bibleId || !bookId || !chapter) {
throw error(400, 'Missing required parameters: bibleId, bookId, or chapter');
}

// Validate chapter is a positive number
const chapterNum = parseInt(chapter, 10);
if (isNaN(chapterNum) || chapterNum < 1) {
throw error(400, `Invalid chapter number: ${chapter}. Must be a positive integer.`);
}

// Sanitize parameters to prevent path traversal
const sanitizedBibleId = bibleId.replace(/[^a-zA-Z0-9_-]/g, '');
const upperBookId = bookId.toUpperCase();
const sanitizedBookId = upperBookId.replace(/[^A-Z0-9]/g, '');

// Check for path traversal attempts in bibleId
if (sanitizedBibleId !== bibleId) {
throw error(400, 'Invalid bibleId or bookId format');
}

// bookId can be lowercase, but must be alphanumeric after normalization
if (sanitizedBookId !== upperBookId) {
throw error(400, 'Invalid bibleId or bookId format');
}

try {
// TODO: Replace with database query when storage is migrated to SQLite
// For now, read from file system (data/bibles/{bibleId}/{bookId}.usfm)
const dataDir = process.env.DATA_DIR || 'data';
const usfmPath = join(process.cwd(), dataDir, 'bibles', sanitizedBibleId, `${sanitizedBookId}.usfm`);

// Check if file exists
if (!existsSync(usfmPath)) {
throw error(404, `Bible not found: ${bibleId}/${bookId}`);
}

// Read USFM file
const usfmContent = await readFile(usfmPath, 'utf-8');

if (!usfmContent || !usfmContent.trim()) {
throw error(404, `Empty or invalid USFM file: ${bookId}`);
}

// Filter to requested chapter only
// This is a simple approach - extract the specific chapter
const chapterUSFM = extractChapter(usfmContent, chapterNum);

if (!chapterUSFM) {
throw error(404, `Chapter ${chapter} not found in ${bookId}`);
}

// Convert USFM to HTML
const html = convertUSFMToHTML(chapterUSFM);

if (!html) {
throw error(500, 'Failed to convert USFM to HTML');
}

// Count verses in the chapter (simple regex count)
const verseCount = countVerses(chapterUSFM);

// Return successful response
return json({
html,
metadata: {
book: sanitizedBookId,
chapter: chapterNum,
verses: verseCount,
bibleId: sanitizedBibleId
}
});
} catch (err) {
// Handle file system errors
if ((err as any).code === 'ENOENT') {
throw error(404, `Bible file not found: ${bibleId}/${bookId}`);
}

// Re-throw HTTP errors
if ((err as any).status) {
throw err;
}

// Log unexpected errors
console.error('Error converting USFM:', err);
throw error(500, 'Internal server error during USFM conversion');
}
};

/**
 * Extract a specific chapter from full USFM content
 * Includes book metadata (id, headers) + the requested chapter
 */
function extractChapter(usfmContent: string, chapterNum: number): string | null {
const lines = usfmContent.split(/\r?\n/);
const output: string[] = [];
let inChapter = false;
let foundChapter = false;
let chapterStarted = false;

for (const line of lines) {
const trimmed = line.trim();

// Always include book-level markers
if (
trimmed.startsWith('\\id ') ||
trimmed.startsWith('\\ide ') ||
trimmed.startsWith('\\h ') ||
trimmed.startsWith('\\toc') ||
trimmed.startsWith('\\mt')
) {
output.push(line);
continue;
}

// Check for chapter marker
if (trimmed.startsWith('\\c ')) {
const currentChapter = parseInt(trimmed.substring(3).trim(), 10);

if (currentChapter === chapterNum) {
inChapter = true;
foundChapter = true;
chapterStarted = true;
output.push(line);
} else if (inChapter && currentChapter > chapterNum) {
// We've passed the requested chapter
break;
} else {
inChapter = false;
}
continue;
}

// Include lines that are part of the requested chapter
if (inChapter || (foundChapter && !chapterStarted)) {
output.push(line);
}
}

if (!foundChapter) {
return null;
}

return output.join('\n');
}

/**
 * Count the number of verses in a USFM string
 */
function countVerses(usfm: string): number {
const verseMatches = usfm.match(/\\v\s+\d+/g);
return verseMatches ? verseMatches.length : 0;
}