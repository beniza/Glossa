/**
 * Bible Upload API Endpoint
 * POST /api/bible/upload
 * 
 * Accepts a zip file containing USFM Bible books and extracts them to the file system.
 * Each USFM file should be named with the book code (e.g., GEN.usfm, MAT.usfm).
 */

import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import AdmZip from 'adm-zip';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';

/**
 * POST handler for Bible zip file upload
 * 
 * Request body (multipart/form-data):
 * - file: Zip file containing USFM books
 * - bibleId: Optional custom Bible ID (generated if not provided)
 * - bibleName: Optional human-readable Bible name
 * 
 * Response:
 * {
 *   "success": true,
 *   "bibleId": "web-2025",
 *   "bibleName": "World English Bible",
 *   "books": ["GEN", "EXO", "MAT"],
 *   "bookCount": 3
 * }
 */
export const POST: RequestHandler = async ({ request }) => {
try {
// Parse multipart form data
const formData = await request.formData();
const file = formData.get('file') as File | null;
let bibleId = (formData.get('bibleId') as string) || null;
const bibleName = (formData.get('bibleName') as string) || 'Untitled Bible';

// Validate file exists
if (!file) {
throw error(400, 'No file provided. Please upload a zip file.');
}

// Validate file type
if (!file.name.endsWith('.zip')) {
throw error(400, 'Invalid file type. Please upload a .zip file.');
}

// Generate bibleId if not provided
if (!bibleId) {
bibleId = generateBibleId(file.name);
}

// Sanitize bibleId
const sanitizedBibleId = bibleId.replace(/[^a-zA-Z0-9_-]/g, '');
if (sanitizedBibleId !== bibleId) {
throw error(400, 'Invalid bibleId. Only alphanumeric, hyphens, and underscores allowed.');
}

// Check if Bible already exists
const dataDir = process.env.DATA_DIR || 'data';
// Handle both absolute and relative paths
const bibleDir = dataDir.startsWith('/') || /^[A-Za-z]:/.test(dataDir)
? join(dataDir, 'bibles', sanitizedBibleId)  // Absolute path
: join(process.cwd(), dataDir, 'bibles', sanitizedBibleId);  // Relative path

if (existsSync(bibleDir)) {
throw error(409, `Bible with ID "${sanitizedBibleId}" already exists. Please use a different ID or delete the existing Bible first.`);
}

// Read file buffer
const arrayBuffer = await file.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

// Extract and validate zip
let zip: AdmZip;
try {
zip = new AdmZip(buffer);
} catch (err) {
throw error(400, 'Invalid zip file. The file may be corrupted.');
}

const zipEntries = zip.getEntries();

if (zipEntries.length === 0) {
throw error(400, 'Empty zip file. Please upload a zip containing USFM files.');
}

// Filter for USFM files
const usfmFiles = zipEntries.filter(entry => {
return !entry.isDirectory && 
       (entry.entryName.endsWith('.usfm') || entry.entryName.endsWith('.USFM'));
});

if (usfmFiles.length === 0) {
throw error(400, 'No USFM files found in zip. Please ensure files have .usfm extension.');
}

// Validate and extract USFM files
const books: string[] = [];
const validatedFiles: { bookCode: string; content: string }[] = [];

for (const entry of usfmFiles) {
// Get filename without path
const filename = entry.entryName.split('/').pop() || entry.entryName;
const bookCode = filename.replace(/\.(usfm|USFM)$/, '').toUpperCase();

// Read content
const content = entry.getData().toString('utf8');

// Validate USFM: must have \id marker
if (!content.trim().startsWith('\\id ')) {
console.warn(`Skipping ${filename}: Missing \\id marker`);
continue;
}

// Extract book ID from \id marker
const idMatch = content.match(/^\\id\s+([A-Z0-9]{3})/m);
if (!idMatch) {
console.warn(`Skipping ${filename}: Invalid \\id marker format`);
continue;
}

const bookIdFromContent = idMatch[1];

// Use book ID from content if different from filename
const finalBookCode = bookIdFromContent || bookCode;

books.push(finalBookCode);
validatedFiles.push({ bookCode: finalBookCode, content });
}

if (validatedFiles.length === 0) {
throw error(400, 'No valid USFM files found. Files must start with \\id marker.');
}

// Create Bible directory
mkdirSync(bibleDir, { recursive: true });

// Write USFM files
for (const { bookCode, content } of validatedFiles) {
const filePath = join(bibleDir, `${bookCode}.usfm`);
writeFileSync(filePath, content, 'utf8');
}

// Create metadata file
const metadata = {
id: sanitizedBibleId,
name: bibleName,
uploadedAt: new Date().toISOString(),
bookCount: books.length,
books: books.sort()
};

writeFileSync(
join(bibleDir, 'metadata.json'),
JSON.stringify(metadata, null, 2),
'utf8'
);

// Return success response
return json({
success: true,
bibleId: sanitizedBibleId,
bibleName,
books: books.sort(),
bookCount: books.length
});

} catch (err) {
// Re-throw HTTP errors
if ((err as any).status) {
throw err;
}

// Log unexpected errors
console.error('Error uploading Bible:', err);
throw error(500, 'Internal server error during Bible upload');
}
};

/**
 * Generate a Bible ID from filename
 * Example: "web-2025.zip" -> "web-2025"
 */
function generateBibleId(filename: string): string {
// Remove .zip extension
let id = filename.replace(/\.zip$/i, '');

// Replace spaces and special chars with hyphens
id = id.replace(/[^a-zA-Z0-9]+/g, '-');

// Remove leading/trailing hyphens
id = id.replace(/^-+|-+$/g, '');

// Lowercase
id = id.toLowerCase();

// If empty or too short, add random suffix
if (id.length < 3) {
id = `bible-${randomBytes(4).toString('hex')}`;
}

return id;
}