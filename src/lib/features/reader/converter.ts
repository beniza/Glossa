/**
 * USFM to HTML Converter
 * Converts USFM (Unified Standard Format Markers) to HTML for display
 * 
 * NOTE: Currently using regex-based parser instead of usfm-grammar due to
 * tree-sitter native module compatibility issues with Bun runtime.
 * TODO: Switch to usfm-grammar when Bun supports tree-sitter native bindings.
 */

// HTML escape utility
function escapeHtml(text: string): string {
	const map: Record<string, string> = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Remove control characters (NULL, etc.)
function sanitizeText(text: string): string {
	// Remove control characters except newline and tab
	return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

// Process text content: escape HTML, sanitize, preserve Unicode
function processText(text: string): string {
	if (!text) return '';
	return escapeHtml(sanitizeText(text));
}

/**
 * Regex-based USFM parser (fallback until tree-sitter works with Bun)
 */
function parseUSFM(usfm: string): string {
	const parts: string[] = [];
	let currentChapter = 0;
	
	// Split by lines and process
	const lines = usfm.split(/\r?\n/);
	let inFootnote = false;
	let inXref = false;
	let footnoteBuild = '';
	let xrefBuild = '';
	
	for (let i = 0; i < lines.length; i++) {
		let line = lines[i].trim();
		if (!line) continue;
		
		// Book ID
		if (line.startsWith('\\id ')) {
			const text = line.substring(4).trim();
			if (text) {
				parts.push(`<div class="book-id">${processText(text)}</div>`);
			}
			continue;
		}
		
		// Major title
		if (line.startsWith('\\mt1 ') || line.startsWith('\\mt ')) {
			const marker = line.match(/^\\(mt1?)\s+/)?.[1] || 'mt';
			const text = line.replace(/^\\mt1?\s+/, '');
			parts.push(`<h1 class="major-title ${marker}">${processText(text)}</h1>`);
			continue;
		}
		
		if (line.startsWith('\\mt2 ')) {
			const text = line.substring(5);
			parts.push(`<h1 class="major-title mt2">${processText(text)}</h1>`);
			continue;
		}
		
		// Section headings
		if (line.startsWith('\\s1 ') || line.startsWith('\\s ')) {
			const marker = line.match(/^\\(s1?)\s+/)?.[1] || 's';
			const text = line.replace(/^\\s1?\s+/, '');
			parts.push(`<h3 class="section-heading ${marker}">${processText(text)}</h3>`);
			continue;
		}
		
		// Introduction titles
		if (line.startsWith('\\imt')) {
			const marker = line.match(/^\\(imt\d?)\s+/)?.[1] || 'imt';
			const text = line.replace(/^\\imt\d?\s+/, '');
			parts.push(`<h2 class="intro-title ${marker}">${processText(text)}</h2>`);
			continue;
		}
		
		// Introduction section
		if (line.startsWith('\\is')) {
			const marker = line.match(/^\\(is\d?)\s+/)?.[1] || 'is';
			const text = line.replace(/^\\is\d?\s+/, '');
			parts.push(`<h3 class="intro-section ${marker}">${processText(text)}</h3>`);
			continue;
		}
		
		// Introduction outline title
		if (line.startsWith('\\iot ')) {
			const text = line.substring(5);
			parts.push(`<h3 class="intro-outline-title">${processText(text)}</h3>`);
			continue;
		}
		
		// Introduction outline entries
		if (line.startsWith('\\io1 ') || line.startsWith('\\io2 ')) {
			const marker = line.match(/^\\(io\d)\s+/)?.[1] || 'io1';
			const text = line.replace(/^\\io\d\s+/, '');
			parts.push(`<li class="${marker} intro-outline">${processText(text)}</li>`);
			continue;
		}
		
		// Introduction paragraph
		if (line.startsWith('\\ip ')) {
			const text = line.substring(4);
			parts.push(`<p class="ip intro">${processText(text)}</p>`);
			continue;
		}
		
		// Chapter
		if (line.startsWith('\\c ')) {
			currentChapter = parseInt(line.substring(3));
			parts.push(`<h2 class="chapter">Chapter ${currentChapter}</h2>`);
			continue;
		}
		
		// Chapter label
		if (line.startsWith('\\cl ')) {
			const text = line.substring(4);
			parts.push(`<h2 class="chapter">${processText(text)}</h2>`);
			continue;
		}
		
		// Alternative chapter number (skip for now)
		if (line.startsWith('\\ca ')) {
			continue;
		}
		
		// Paragraph marker (just marker, content follows)
		if (line === '\\p' || line === '\\pi' || line === '\\pm' || line === '\\pmo') {
			continue;
		}
		
		// Process line with verses and inline markers
		const processedLine = processLineContent(line);
		if (processedLine) {
			parts.push(processedLine);
		}
	}
	
	return parts.join('');
}

function processLineContent(line: string): string {
	// Skip marker-only lines
	if (line === '\\p' || line === '\\pi' || line.match(/^\\[a-z0-9]+$/)) {
		return '';
	}
	
	// Poetry markers
	if (line.startsWith('\\q1 ') || line.startsWith('\\q2 ') || line.startsWith('\\q ')) {
		const marker = line.match(/^\\(q\d?)\s+/)?.[1] || 'q';
		let content = line.replace(/^\\q\d?\s+/, '');
		content = processInlineMarkers(content);
		return `<p class="${marker}">${content}</p>`;
	}
	
	// List markers
	if (line.startsWith('\\li1 ') || line.startsWith('\\li2 ')) {
		const marker = line.match(/^\\(li\d)\s+/)?.[1] || 'li1';
		let content = line.replace(/^\\li\d\s+/, '');
		content = processInlineMarkers(content);
		return `<li class="${marker}">${content}</li>`;
	}
	
	// Acrostic heading
	if (line.startsWith('\\qa ')) {
		const content = line.substring(4);
		return `<span class="acrostic">${processText(content)}</span>`;
	}
	
	// Verses
	if (line.includes('\\v ')) {
		return processVerses(line);
	}
	
	// Alternative verse number (standalone)
	if (line.startsWith('\\va ')) {
		return '';
	}
	
	// Default: treat as text with inline markers
	const processed = processInlineMarkers(line);
	if (processed.trim()) {
		return `<p class="p">${processed}</p>`;
	}
	
	return '';
}

function processVerses(line: string): string {
	const verses: string[] = [];
	
	// Split by verse markers
	const parts = line.split(/\\v\s+/);
	
	for (let i = 0; i < parts.length; i++) {
		if (i === 0 && parts[i].trim()) {
			// Text before first verse
			const processed = processInlineMarkers(parts[i]);
			if (processed.trim()) {
				verses.push(processText(processed));
			}
			continue;
		}
		
		if (!parts[i].trim()) continue;
		
		// Extract verse number and content
		const match = parts[i].match(/^(\d+)\s+([\s\S]*)/);
		if (match) {
			const verseNum = match[1];
			let content = match[2];
			
			// Process inline markers
			content = processInlineMarkers(content);
			
			verses.push(`<span class="verse" data-verse="${verseNum}"><sup class="verse-number">${verseNum}</sup>${content}</span>`);
		}
	}
	
	return verses.join(' ');
}

function processInlineMarkers(text: string): string {
	if (!text) return '';
	
	// IMPORTANT: We need to process text in stages:
	// 1. First, identify and protect marker positions
	// 2. Escape the non-marker text
	// 3. Apply marker replacements
	
	// Character styles with closing markers
	// Bold
	text = text.replace(/\\bd\s+(.+?)\\bd\*/g, (match, content) => {
		return `<strong class="bd">${escapeHtml(sanitizeText(content))}</strong>`;
	});
	
	// Italic
	text = text.replace(/\\it\s+(.+?)\\it\*/g, (match, content) => {
		return `<em class="it">${escapeHtml(sanitizeText(content))}</em>`;
	});
	
	// Small caps / divine name
	text = text.replace(/\\sc\s+(.+?)\\sc\*/g, (match, content) => {
		return `<span class="sc">${escapeHtml(sanitizeText(content))}</span>`;
	});
	text = text.replace(/\\nd\s+(.+?)\\nd\*/g, (match, content) => {
		return `<span class="nd">${escapeHtml(sanitizeText(content))}</span>`;
	});
	
	// Added text
	text = text.replace(/\\add\s+(.+?)\\add\*/g, (match, content) => {
		return `<span class="add">${escapeHtml(sanitizeText(content))}</span>`;
	});
	
	// Superscript
	text = text.replace(/\\sup\s+(.+?)\\sup\*/g, (match, content) => {
		return `<sup>${escapeHtml(sanitizeText(content))}</sup>`;
	});
	
	// Transliterated
	text = text.replace(/\\tl\s+(.+?)\\tl\*/g, (match, content) => {
		return `<span class="tl">${escapeHtml(sanitizeText(content))}</span>`;
	});
	
	// Book names
	text = text.replace(/\\bk\s+(.+?)\\bk\*/g, (match, content) => {
		return `<span class="bk">${escapeHtml(sanitizeText(content))}</span>`;
	});
	
	// Proper names
	text = text.replace(/\\pn\s+(.+?)\\pn\*/g, (match, content) => {
		return `<span class="pn">${escapeHtml(sanitizeText(content))}</span>`;
	});
	
	// Quoted text
	text = text.replace(/\\qt\s+(.+?)\\qt\*/g, (match, content) => {
		return `<span class="qt">${escapeHtml(sanitizeText(content))}</span>`;
	});
	
	// Signature
	text = text.replace(/\\sig\s+(.+?)\\sig\*/g, (match, content) => {
		return `<span class="sig">${escapeHtml(sanitizeText(content))}</span>`;
	});
	
	// Words of Jesus
	text = text.replace(/\\wj\s+(.+?)\\wj\*/g, (match, content) => {
		return `<span class="wj">${escapeHtml(sanitizeText(content))}</span>`;
	});
	
	// Selah
	text = text.replace(/\\qs\s+(.+?)\\qs\*/g, (match, content) => {
		return `<span class="selah">${escapeHtml(sanitizeText(content))}</span>`;
	});
	
	// Word markup with attributes
	text = text.replace(/\\w\s+(.+?)\|[^\\]*\\w\*/g, (match, content) => {
		return `<span class="word">${escapeHtml(sanitizeText(content))}</span>`;
	});
	
	// Footnotes (complex)
	text = text.replace(/\\f\s+\+\s+(.*?)\\f\*/g, (match, content) => {
		// Remove internal markers and escape
		const cleaned = content.replace(/\\f[trqv]\s+/g, '');
		return `<sup class="footnote-caller">+</sup><span class="footnote">${escapeHtml(sanitizeText(cleaned))}</span>`;
	});
	
	// Cross-references
	text = text.replace(/\\x\s+\+\s+(.*?)\\x\*/g, (match, content) => {
		// Remove internal markers and escape
		const cleaned = content.replace(/\\x[ot]\s+/g, '');
		return `<sup class="xref-caller">x</sup><span class="xref">${escapeHtml(sanitizeText(cleaned))}</span>`;
	});
	
	// Handle unclosed markers (error recovery)
	text = text.replace(/\\(bd|it|sc|nd|add|tl|bk|pn|qt|sig|wj)\s+([^\\]+)$/g, (match, marker, content) => {
		return `<span class="${marker}">${escapeHtml(sanitizeText(content))}</span>`;
	});
	text = text.replace(/\\f\s+\+\s+(.+)$/g, (match, content) => {
		return `<sup class="footnote-caller">+</sup><span class="footnote">${escapeHtml(sanitizeText(content))}</span>`;
	});
	
	// Now escape any remaining plain text (text not within our generated HTML tags)
	// This is tricky - we need to escape text outside tags but not the tags themselves
	// Improved approach: use a more specific tag pattern that matches our generated tags only
	const tagPattern = /(<(?:\/)?(?:strong|em|span|sup|li|p|h[1-6]|div)[^>]*>)/g;
	const parts = text.split(tagPattern);
	const result = parts.map((part) => {
		// Check if this part is an HTML tag we generated
		if (tagPattern.test(part)) {
			tagPattern.lastIndex = 0; // Reset regex state
			return part; // Keep our HTML tags as-is
		} else {
			return escapeHtml(sanitizeText(part)); // Escape plain text
		}
	}).join('');
	
	return result;
}

/**
 * Convert USFM to HTML
 * @param usfm - USFM formatted text
 * @returns HTML string
 */
export function convertUSFMToHTML(usfm: string): string {
	// Handle empty or whitespace-only input
	if (!usfm || !usfm.trim()) {
		return '';
	}

	try {
		// Parse USFM using regex-based parser
		const html = parseUSFM(usfm);

		// Wrap in container div
		if (!html) return '';
		return `<div class="usfm-content">${html}</div>`;
	} catch (error) {
		// Error recovery: return minimal HTML with error message
		console.error('USFM conversion error:', error);

		// Try to extract any text content for graceful degradation
		const textOnly = usfm.replace(/\\[a-z0-9*]+\s*/gi, ' ').trim();
		if (textOnly) {
			return `<div class="usfm-content"><p class="error">${processText(textOnly)}</p></div>`;
		}

		return '';
	}
}

/**
 * Convert a specific book from USFM to HTML
 * @param usfm - USFM formatted text
 * @param bookCode - Book code (e.g., "GEN", "MAT")
 * @returns HTML string
 */
export function convertBookToHtml(usfm: string, bookCode: string): string {
	// For now, this is the same as convertUSFMToHTML
	// In the future, could filter by book code
	return convertUSFMToHTML(usfm);
}

/**
 * Convert a specific chapter from USFM to HTML
 * @param usfm - USFM formatted text
 * @param bookCode - Book code (e.g., "GEN", "MAT")
 * @param chapter - Chapter number
 * @returns HTML string
 */
export function convertChapterToHtml(usfm: string, bookCode: string, chapter: number): string {
	// For now, this is the same as convertUSFMToHTML
	// In the future, could filter by chapter number
	return convertUSFMToHTML(usfm);
}
