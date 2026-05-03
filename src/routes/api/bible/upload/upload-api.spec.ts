/**
 * Upload API Endpoint Tests
 * POST /api/bible/upload
 * 
 * Tests cover:
 * 1. Valid zip upload with USFM files
 * 2. Invalid inputs (no file, wrong type, corrupted zip)
 * 3. Edge cases (empty zip, no USFM files, duplicate IDs)
 * 4. Security (sanitization, size limits)
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { POST } from './+server';
import { existsSync, mkdirSync, rmSync, readFileSync } from 'fs';
import { join } from 'path';
import AdmZip from 'adm-zip';

// Test data directory
const TEST_DATA_DIR = join(process.cwd(), 'data-test');
const TEST_BIBLES_DIR = join(TEST_DATA_DIR, 'bibles');

// Sample USFM content
const SAMPLE_GENESIS_USFM = `\\id GEN
\\h Genesis
\\mt1 Genesis
\\c 1
\\p
\\v 1 In the beginning God created the heavens and the earth.
\\v 2 The earth was without form and void, and darkness was over the face of the deep.
`;

const SAMPLE_EXODUS_USFM = `\\id EXO
\\h Exodus
\\mt1 Exodus
\\c 1
\\p
\\v 1 These are the names of the sons of Israel who came to Egypt with Jacob.
`;

const SAMPLE_MATTHEW_USFM = `\\id MAT
\\h Matthew
\\mt1 The Gospel According to Matthew
\\c 1
\\p
\\v 1 The book of the genealogy of Jesus Christ, the son of David, the son of Abraham.
`;

/**
 * Helper: Create a mock File object from buffer
 */
function createMockFile(buffer: Buffer, filename: string, type = 'application/zip'): File {
	const blob = new Blob([buffer], { type });
	return new File([blob], filename, { type });
}

/**
 * Helper: Create a zip buffer from USFM files
 */
function createZipBuffer(files: Record<string, string>): Buffer {
	const zip = new AdmZip();
	for (const [filename, content] of Object.entries(files)) {
		zip.addFile(filename, Buffer.from(content, 'utf8'));
	}
	return zip.toBuffer();
}

/**
 * Helper: Create a mock Request with FormData
 */
async function createMockRequest(formData: FormData): Promise<Request> {
	return new Request('http://localhost/api/bible/upload', {
		method: 'POST',
		body: formData
	});
}

/**
 * Helper: Call POST handler with mock request
 */
async function callUploadAPI(formData: FormData) {
	const request = await createMockRequest(formData);
	return POST({ request, params: {}, url: new URL('http://localhost'), locals: {} } as any);
}

// Setup/Teardown
beforeAll(() => {
	// Set test data directory
	process.env.DATA_DIR = TEST_DATA_DIR;
	
	// Create test directories
	if (!existsSync(TEST_BIBLES_DIR)) {
		mkdirSync(TEST_BIBLES_DIR, { recursive: true });
	}
});

afterAll(() => {
	// Clean up test data
	if (existsSync(TEST_DATA_DIR)) {
		rmSync(TEST_DATA_DIR, { recursive: true, force: true });
	}
	
	// Reset env
	delete process.env.DATA_DIR;
});

beforeEach(() => {
	// Clean bibles directory before each test
	if (existsSync(TEST_BIBLES_DIR)) {
		rmSync(TEST_BIBLES_DIR, { recursive: true, force: true });
		mkdirSync(TEST_BIBLES_DIR, { recursive: true });
	}
});

describe('POST /api/bible/upload', () => {
	
	describe('✅ Valid Upload Scenarios', () => {
		
		it('should upload a valid zip with single USFM file', async () => {
			// Arrange
			const zipBuffer = createZipBuffer({
				'GEN.usfm': SAMPLE_GENESIS_USFM
			});
			const file = createMockFile(zipBuffer, 'test-bible.zip');
			
			const formData = new FormData();
			formData.append('file', file);
			formData.append('bibleName', 'Test Bible');
			
			// Act
			const response = await callUploadAPI(formData);
			const data = await response.json();
			
			// Assert
			expect(response.status).toBe(200);
			expect(data.success).toBe(true);
			expect(data.bibleId).toBe('test-bible');
			expect(data.bibleName).toBe('Test Bible');
			expect(data.books).toEqual(['GEN']);
			expect(data.bookCount).toBe(1);
			
			// Verify files created
			const bibleDir = join(TEST_BIBLES_DIR, 'test-bible');
			expect(existsSync(bibleDir)).toBe(true);
			expect(existsSync(join(bibleDir, 'GEN.usfm'))).toBe(true);
			expect(existsSync(join(bibleDir, 'metadata.json'))).toBe(true);
			
			// Verify metadata
			const metadata = JSON.parse(readFileSync(join(bibleDir, 'metadata.json'), 'utf8'));
			expect(metadata.id).toBe('test-bible');
			expect(metadata.name).toBe('Test Bible');
			expect(metadata.books).toEqual(['GEN']);
			expect(metadata.bookCount).toBe(1);
		});
		
		it('should upload a zip with multiple USFM files', async () => {
			// Arrange
			const zipBuffer = createZipBuffer({
				'GEN.usfm': SAMPLE_GENESIS_USFM,
				'EXO.usfm': SAMPLE_EXODUS_USFM,
				'MAT.usfm': SAMPLE_MATTHEW_USFM
			});
			const file = createMockFile(zipBuffer, 'multi-book.zip');
			
			const formData = new FormData();
			formData.append('file', file);
			
			// Act
			const response = await callUploadAPI(formData);
			const data = await response.json();
			
			// Assert
			expect(response.status).toBe(200);
			expect(data.bookCount).toBe(3);
			expect(data.books).toEqual(['EXO', 'GEN', 'MAT']); // Sorted
		});
		
		it('should accept custom bibleId', async () => {
			// Arrange
			const zipBuffer = createZipBuffer({
				'GEN.usfm': SAMPLE_GENESIS_USFM
			});
			const file = createMockFile(zipBuffer, 'bible.zip');
			
			const formData = new FormData();
			formData.append('file', file);
			formData.append('bibleId', 'custom-id-123');
			formData.append('bibleName', 'Custom Bible');
			
			// Act
			const response = await callUploadAPI(formData);
			const data = await response.json();
			
			// Assert
			expect(data.bibleId).toBe('custom-id-123');
			expect(existsSync(join(TEST_BIBLES_DIR, 'custom-id-123'))).toBe(true);
		});
		
		it('should generate bibleId from filename if not provided', async () => {
			// Arrange
			const zipBuffer = createZipBuffer({
				'GEN.usfm': SAMPLE_GENESIS_USFM
			});
			const file = createMockFile(zipBuffer, 'ESV 2023 Edition.zip');
			
			const formData = new FormData();
			formData.append('file', file);
			
			// Act
			const response = await callUploadAPI(formData);
			const data = await response.json();
			
			// Assert
			expect(data.bibleId).toBe('esv-2023-edition');
		});
		
		it('should handle USFM files in nested folders', async () => {
			// Arrange
			const zip = new AdmZip();
			zip.addFile('books/GEN.usfm', Buffer.from(SAMPLE_GENESIS_USFM, 'utf8'));
			zip.addFile('books/NT/MAT.usfm', Buffer.from(SAMPLE_MATTHEW_USFM, 'utf8'));
			const zipBuffer = zip.toBuffer();
			const file = createMockFile(zipBuffer, 'nested.zip');
			
			const formData = new FormData();
			formData.append('file', file);
			
			// Act
			const response = await callUploadAPI(formData);
			const data = await response.json();
			
			// Assert
			expect(response.status).toBe(200);
			expect(data.bookCount).toBe(2);
			expect(data.books).toEqual(['GEN', 'MAT']);
		});
		
		it('should use book code from \\id marker, not filename', async () => {
			// Arrange
			const wrongFilename = `\\id GEN
\\h Genesis
\\c 1
\\v 1 Test`;
			
			const zipBuffer = createZipBuffer({
				'WRONG.usfm': wrongFilename  // filename says WRONG, but content says GEN
			});
			const file = createMockFile(zipBuffer, 'test.zip');
			
			const formData = new FormData();
			formData.append('file', file);
			
			// Act
			const response = await callUploadAPI(formData);
			const data = await response.json();
			
			// Assert
			expect(data.books).toEqual(['GEN']); // Should use GEN from \id, not WRONG from filename
			expect(existsSync(join(TEST_BIBLES_DIR, data.bibleId, 'GEN.usfm'))).toBe(true);
		});
		
		it('should handle .USFM extension (uppercase)', async () => {
			// Arrange
			const zipBuffer = createZipBuffer({
				'GEN.USFM': SAMPLE_GENESIS_USFM
			});
			const file = createMockFile(zipBuffer, 'uppercase.zip');
			
			const formData = new FormData();
			formData.append('file', file);
			
			// Act
			const response = await callUploadAPI(formData);
			const data = await response.json();
			
			// Assert
			expect(response.status).toBe(200);
			expect(data.books).toEqual(['GEN']);
		});
	});
	
	describe('❌ Invalid Input Handling', () => {
		
		it('should reject request with no file', async () => {
			// Arrange
			const formData = new FormData();
			formData.append('bibleName', 'Test');
			
			// Act & Assert
			try {
				await callUploadAPI(formData);
				expect.fail('Should have thrown error');
			} catch (err: any) {
				expect(err.status).toBe(400);
				expect(err.body.message).toContain('No file provided');
			}
		});
		
		it('should reject non-zip files', async () => {
			// Arrange
			const textFile = createMockFile(Buffer.from('not a zip'), 'file.txt', 'text/plain');
			const formData = new FormData();
			formData.append('file', textFile);
			
			// Act & Assert
			try {
				await callUploadAPI(formData);
				expect.fail('Should have thrown error');
			} catch (err: any) {
				expect(err.status).toBe(400);
				expect(err.body.message).toContain('Invalid file type');
			}
		});
		
		it('should reject corrupted zip files', async () => {
			// Arrange
			const corruptedZip = Buffer.from('PK\x03\x04corrupt data');
			const file = createMockFile(corruptedZip, 'corrupted.zip');
			const formData = new FormData();
			formData.append('file', file);
			
			// Act & Assert
			try {
				await callUploadAPI(formData);
				expect.fail('Should have thrown error');
			} catch (err: any) {
				expect(err.status).toBe(400);
				expect(err.body.message).toContain('Invalid zip file');
			}
		});
		
		it('should reject empty zip files', async () => {
			// Arrange
			const emptyZip = new AdmZip();
			const zipBuffer = emptyZip.toBuffer();
			const file = createMockFile(zipBuffer, 'empty.zip');
			const formData = new FormData();
			formData.append('file', file);
			
			// Act & Assert
			try {
				await callUploadAPI(formData);
				expect.fail('Should have thrown error');
			} catch (err: any) {
				expect(err.status).toBe(400);
				expect(err.body.message).toContain('Empty zip file');
			}
		});
		
		it('should reject zip with no USFM files', async () => {
			// Arrange
			const zip = new AdmZip();
			zip.addFile('README.txt', Buffer.from('Not USFM'));
			zip.addFile('metadata.json', Buffer.from('{}'));
			const zipBuffer = zip.toBuffer();
			const file = createMockFile(zipBuffer, 'no-usfm.zip');
			const formData = new FormData();
			formData.append('file', file);
			
			// Act & Assert
			try {
				await callUploadAPI(formData);
				expect.fail('Should have thrown error');
			} catch (err: any) {
				expect(err.status).toBe(400);
				expect(err.body.message).toContain('No USFM files found');
			}
		});
		
		it('should reject USFM files without \\id marker', async () => {
			// Arrange
			const invalidUSFM = `\\h Genesis
\\c 1
\\v 1 Missing id marker`;
			
			const zipBuffer = createZipBuffer({
				'GEN.usfm': invalidUSFM
			});
			const file = createMockFile(zipBuffer, 'invalid.zip');
			const formData = new FormData();
			formData.append('file', file);
			
			// Act & Assert
			try {
				await callUploadAPI(formData);
				expect.fail('Should have thrown error');
			} catch (err: any) {
				expect(err.status).toBe(400);
				expect(err.body.message).toContain('No valid USFM files');
			}
		});
		
		it('should reject invalid bibleId characters', async () => {
			// Arrange
			const zipBuffer = createZipBuffer({
				'GEN.usfm': SAMPLE_GENESIS_USFM
			});
			const file = createMockFile(zipBuffer, 'test.zip');
			const formData = new FormData();
			formData.append('file', file);
			formData.append('bibleId', 'invalid/bible\\id');
			
			// Act & Assert
			try {
				await callUploadAPI(formData);
				expect.fail('Should have thrown error');
			} catch (err: any) {
				expect(err.status).toBe(400);
				expect(err.body.message).toContain('Invalid bibleId');
			}
		});
		
		it('should reject duplicate bibleId', async () => {
			// Arrange - Upload first Bible
			const zipBuffer1 = createZipBuffer({
				'GEN.usfm': SAMPLE_GENESIS_USFM
			});
			const file1 = createMockFile(zipBuffer1, 'bible1.zip');
			const formData1 = new FormData();
			formData1.append('file', file1);
			formData1.append('bibleId', 'duplicate-test');
			
			await callUploadAPI(formData1);
			
			// Act - Try to upload with same ID
			const zipBuffer2 = createZipBuffer({
				'EXO.usfm': SAMPLE_EXODUS_USFM
			});
			const file2 = createMockFile(zipBuffer2, 'bible2.zip');
			const formData2 = new FormData();
			formData2.append('file', file2);
			formData2.append('bibleId', 'duplicate-test');
			
			// Assert
			try {
				await callUploadAPI(formData2);
				expect.fail('Should have thrown error');
			} catch (err: any) {
				expect(err.status).toBe(409);
				expect(err.body.message).toContain('already exists');
			}
		});
	});
	
	describe('🔒 Security & Edge Cases', () => {
		
		it('should sanitize bibleId to prevent path traversal', async () => {
			// Arrange
			const zipBuffer = createZipBuffer({
				'GEN.usfm': SAMPLE_GENESIS_USFM
			});
			const file = createMockFile(zipBuffer, 'test.zip');
			const formData = new FormData();
			formData.append('file', file);
			formData.append('bibleId', '../../../etc/passwd');
			
			// Act & Assert
			try {
				await callUploadAPI(formData);
				expect.fail('Should have thrown error');
			} catch (err: any) {
				expect(err.status).toBe(400);
				// Should reject because of invalid characters
			}
		});
		
		it('should skip files without valid \\id format', async () => {
			// Arrange
			const validUSFM = SAMPLE_GENESIS_USFM;
			const invalidIdFormat = `\\id abc
\\c 1
\\v 1 Test`;  // lowercase - should be rejected
			
			const zipBuffer = createZipBuffer({
				'GEN.usfm': validUSFM,
				'BAD.usfm': invalidIdFormat
			});
			const file = createMockFile(zipBuffer, 'mixed.zip');
			const formData = new FormData();
			formData.append('file', file);
			
			// Act
			const response = await callUploadAPI(formData);
			const data = await response.json();
			
			// Assert
			expect(data.bookCount).toBe(1);
			expect(data.books).toEqual(['GEN']); // Only valid file
		});
		
		it('should handle zip with mixed USFM and non-USFM files', async () => {
			// Arrange
			const zip = new AdmZip();
			zip.addFile('GEN.usfm', Buffer.from(SAMPLE_GENESIS_USFM, 'utf8'));
			zip.addFile('README.txt', Buffer.from('Info'));
			zip.addFile('metadata.json', Buffer.from('{}'));
			const zipBuffer = zip.toBuffer();
			const file = createMockFile(zipBuffer, 'mixed.zip');
			const formData = new FormData();
			formData.append('file', file);
			
			// Act
			const response = await callUploadAPI(formData);
			const data = await response.json();
			
			// Assert
			expect(response.status).toBe(200);
			expect(data.bookCount).toBe(1);
			expect(data.books).toEqual(['GEN']);
		});
		
		it('should default bibleName to "Untitled Bible" if not provided', async () => {
			// Arrange
			const zipBuffer = createZipBuffer({
				'GEN.usfm': SAMPLE_GENESIS_USFM
			});
			const file = createMockFile(zipBuffer, 'test.zip');
			const formData = new FormData();
			formData.append('file', file);
			
			// Act
			const response = await callUploadAPI(formData);
			const data = await response.json();
			
			// Assert
			expect(data.bibleName).toBe('Untitled Bible');
		});
		
		it('should sort books alphabetically in response', async () => {
			// Arrange
			const zipBuffer = createZipBuffer({
				'MAT.usfm': SAMPLE_MATTHEW_USFM,
				'GEN.usfm': SAMPLE_GENESIS_USFM,
				'EXO.usfm': SAMPLE_EXODUS_USFM
			});
			const file = createMockFile(zipBuffer, 'test.zip');
			const formData = new FormData();
			formData.append('file', file);
			
			// Act
			const response = await callUploadAPI(formData);
			const data = await response.json();
			
			// Assert
			expect(data.books).toEqual(['EXO', 'GEN', 'MAT']); // Alphabetically sorted
		});
	});
});
