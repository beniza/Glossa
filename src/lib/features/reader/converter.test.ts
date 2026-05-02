import { describe, it, expect } from 'vitest';
import { convertUSFMToHTML } from './converter';

describe('USFM Converter', () => {
	describe('Basic Structure', () => {
		it('should convert simple book with one chapter and verse', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 In the beginning God created the heavens and the earth.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('<h2');
			expect(html).toContain('Chapter 1');
			expect(html).toContain('In the beginning');
			expect(html).toContain('class="verse"');
		});

		it('should handle multiple verses in a chapter', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 First verse.
\\v 2 Second verse.
\\v 3 Third verse.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('First verse');
			expect(html).toContain('Second verse');
			expect(html).toContain('Third verse');
			expect((html.match(/class="verse"/g) || []).length).toBe(3);
		});

		it('should handle multiple chapters', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Chapter one verse one.
\\c 2
\\v 1 Chapter two verse one.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Chapter 1');
			expect(html).toContain('Chapter 2');
			expect(html).toContain('Chapter one verse one');
			expect(html).toContain('Chapter two verse one');
		});
	});

	describe('Paragraph Markers', () => {
		it('should handle paragraph markers (\\p)', () => {
			const usfm = `\\id GEN
\\c 1
\\p
\\v 1 First verse.
\\p
\\v 2 Second verse.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('First verse');
			expect(html).toContain('Second verse');
		});
	});

	describe('Poetry and Indentation', () => {
		it('should handle poetry markers (\\q, \\q1, \\q2)', () => {
			const usfm = `\\id PSA
\\c 1
\\q1 Blessed is the one
\\q2 who does not walk in step with the wicked`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Blessed is the one');
			expect(html).toContain('who does not walk');
			expect(html).toContain('q1');
			expect(html).toContain('q2');
		});

		it('should handle list markers (\\li1, \\li2)', () => {
			const usfm = `\\id GEN
\\c 1
\\li1 First level item
\\li2 Second level item`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('First level item');
			expect(html).toContain('Second level item');
			expect(html).toContain('li1');
			expect(html).toContain('li2');
		});
	});

	describe('Headings', () => {
		it('should handle section headings (\\s, \\s1)', () => {
			const usfm = `\\id GEN
\\s1 The Creation
\\c 1
\\v 1 In the beginning...`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('The Creation');
			expect(html).toContain('<h3');
		});

		it('should handle major title (\\mt1)', () => {
			const usfm = `\\id GEN
\\mt1 Genesis
\\c 1
\\v 1 In the beginning...`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Genesis');
			expect(html).toContain('<h1');
		});
	});

	describe('Footnotes and Cross-references', () => {
		it('should handle footnotes (\\f...\\f*)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 In the beginning\\f + \\ft A footnote text\\f* God created.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('In the beginning');
			expect(html).toContain('God created');
			expect(html).toContain('footnote');
		});

		it('should handle cross-references (\\x...\\x*)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 In the beginning\\x + \\xo 1:1 \\xt John 1:1\\x* God created.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('In the beginning');
			expect(html).toContain('God created');
		});
	});

	describe('Error Handling', () => {
		it('should handle empty USFM', () => {
			const html = convertUSFMToHTML('');
			expect(html).toBeDefined();
			expect(html).toBe('');
		});

		it('should handle malformed USFM gracefully', () => {
			const usfm = `\\c 1
\\v 1 Missing book ID`;

			const html = convertUSFMToHTML(usfm);
			expect(html).toBeDefined();
			expect(html).toContain('Missing book ID');
		});

		it('should handle verses without chapter', () => {
			const usfm = `\\id GEN
\\v 1 Verse without chapter`;

			const html = convertUSFMToHTML(usfm);
			expect(html).toBeDefined();
			expect(html).toContain('Verse without chapter');
		});
	});

	describe('Book Metadata', () => {
		it('should extract book ID', () => {
			const usfm = `\\id GEN Genesis
\\c 1
\\v 1 Text`;

			const result = convertUSFMToHTML(usfm);
			expect(result).toContain('Genesis');
		});
	});

	describe('Output Structure', () => {
		it('should return HTML with proper structure', () => {
			const usfm = `\\id GEN
\\mt1 Genesis
\\c 1
\\v 1 In the beginning God created the heavens and the earth.`;

			const html = convertUSFMToHTML(usfm);

			// Should have div containers
			expect(html).toContain('<div');
			expect(html).toContain('</div>');

			// Should have proper nesting
			expect(html.indexOf('<div')).toBeLessThan(html.indexOf('</div>'));
		});
	});

	describe('Character Styles', () => {
		it('should handle bold text (\\bd)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 This is \\bd bold text\\bd* in verse.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('bold text');
			expect(html).toMatch(/<(strong|b|span)/);
		});

		it('should handle italic text (\\it)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 This is \\it italic text\\it* in verse.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('italic text');
			expect(html).toMatch(/<(em|i|span)/);
		});

		it('should handle small caps (\\sc)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 The \\sc Lord\\sc* spoke.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Lord');
			expect(html).toContain('sc');
		});

		it('should handle added text (\\add)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Text \\add added by translators\\add* here.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('added by translators');
			expect(html).toContain('add');
		});

		it('should handle divine name (\\nd)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 The \\nd Lord\\nd* God.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Lord');
			expect(html).toContain('nd');
		});

		it('should handle superscript (\\sup)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Text with\\sup 1\\sup* superscript.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('1');
			expect(html).toMatch(/<sup>/);
		});

		it('should handle transliterated words (\\tl)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 The word \\tl Elohim\\tl* means God.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Elohim');
			expect(html).toContain('tl');
		});

		it('should handle nested character styles', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Text with \\bd bold \\it and italic\\it*\\bd* together.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('bold');
			expect(html).toContain('and italic');
		});
	});

	describe('Special Features', () => {
		it('should handle book names (\\bk)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 As written in \\bk Genesis\\bk* chapter 1.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Genesis');
			expect(html).toContain('bk');
		});

		it('should handle proper names (\\pn)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 \\pn Abraham\\pn* was a man of faith.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Abraham');
			expect(html).toContain('pn');
		});

		it('should handle quoted text (\\qt)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 He said \\qt Let there be light\\qt* and there was.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Let there be light');
			expect(html).toContain('qt');
		});

		it('should handle signature (\\sig)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Letter ends with \\sig Paul\\sig*.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Paul');
			expect(html).toContain('sig');
		});

		it('should handle words of Jesus (\\wj)', () => {
			const usfm = `\\id MAT
\\c 1
\\v 1 Jesus said \\wj I am the way\\wj* to them.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('I am the way');
			expect(html).toContain('wj');
		});
	});

	describe('Introductions', () => {
		it('should handle introduction major title (\\imt)', () => {
			const usfm = `\\id GEN
\\imt Introduction to Genesis
\\c 1
\\v 1 Text`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Introduction to Genesis');
			expect(html).toMatch(/<h[1-3]/);
		});

		it('should handle introduction section (\\is)', () => {
			const usfm = `\\id GEN
\\is Background
\\ip Introduction paragraph text.
\\c 1
\\v 1 Text`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Background');
			expect(html).toContain('Introduction paragraph text');
		});

		it('should handle introduction paragraph (\\ip)', () => {
			const usfm = `\\id GEN
\\ip This book tells the story of creation.
\\c 1
\\v 1 Text`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('This book tells the story of creation');
		});

		it('should handle introduction outline title (\\iot)', () => {
			const usfm = `\\id GEN
\\iot Outline of Genesis
\\io1 I. Creation (1-2)
\\io1 II. Fall (3-4)
\\c 1
\\v 1 Text`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Outline of Genesis');
			expect(html).toContain('Creation');
			expect(html).toContain('Fall');
		});

		it('should handle introduction outline entries (\\io1, \\io2)', () => {
			const usfm = `\\id GEN
\\io1 First level outline
\\io2 Second level outline
\\c 1
\\v 1 Text`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('First level outline');
			expect(html).toContain('Second level outline');
		});
	});

	describe('Complex Footnotes', () => {
		it('should handle footnote with caller (\\f + \\fr \\ft)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Text\\f + \\fr 1:1 \\ft Explanatory note\\f* here.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Text');
			expect(html).toContain('here');
			expect(html).toContain('footnote');
		});

		it('should handle multiple footnotes in one verse', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 First\\f + \\ft Note 1\\f* and second\\f + \\ft Note 2\\f* words.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('First');
			expect(html).toContain('second');
			expect((html.match(/footnote/gi) || []).length).toBeGreaterThanOrEqual(2);
		});

		it('should handle footnote with quotation (\\fq)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Text\\f + \\ft Greek: \\fq other text\\f* here.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Text');
			expect(html).toContain('here');
		});

		it('should handle footnote with verse reference (\\fv)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Text\\f + \\fr 1:1 \\ft See also \\fv 2:3\\f* here.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Text');
			expect(html).toContain('here');
		});
	});

	describe('Word-Level Markup', () => {
		it('should handle word markup with attributes (\\w)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 In the \\w beginning|strong="H7225"\\w* God created.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('beginning');
			expect(html).toContain('God created');
		});

		it('should handle multiple word markups', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 \\w In|x-occurrence="1"\\w* the \\w beginning|strong="H7225"\\w* God.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('In');
			expect(html).toContain('beginning');
			expect(html).toContain('God');
		});
	});

	describe('Poetry Special Markers', () => {
		it('should handle selah (\\qs)', () => {
			const usfm = `\\id PSA
\\c 1
\\q1 Blessed is the one
\\qs Selah\\qs*`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Blessed is the one');
			expect(html).toContain('Selah');
		});

		it('should handle acrostic heading (\\qa)', () => {
			const usfm = `\\id PSA
\\c 119
\\qa Aleph
\\q1 Blessed are those`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Aleph');
			expect(html).toContain('Blessed are those');
		});
	});

	describe('Alternative Numbers', () => {
		it('should handle chapter label (\\cl)', () => {
			const usfm = `\\id PSA
\\c 1
\\cl Psalm 1
\\v 1 Text`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Psalm 1');
		});

		it('should handle alternate chapter number (\\ca)', () => {
			const usfm = `\\id PSA
\\c 3
\\ca 2\\ca*
\\v 1 Text`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toBeDefined();
		});

		it('should handle alternate verse number (\\va)', () => {
			const usfm = `\\id PSA
\\c 1
\\v 1 Text
\\va 2\\va*`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toBeDefined();
		});
	});

	describe('Unicode and Internationalization', () => {
		it('should handle Greek text (UTF-8)', () => {
			const usfm = `\\id MAT
\\c 1
\\v 1 Ἐν ἀρχῇ ἦν ὁ λόγος`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Ἐν ἀρχῇ');
			expect(html).toContain('λόγος');
		});

		it('should handle Hebrew text (RTL)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 בְּרֵאשִׁית בָּרָא אֱלֹהִים`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('בְּרֵאשִׁית');
			expect(html).toContain('אֱלֹהִים');
		});

		it('should handle Arabic text (RTL)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 في البدء خلق الله`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('في البدء');
			expect(html).toContain('الله');
		});

		it('should handle Chinese text', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 起初，神创造天地。`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('起初');
			expect(html).toContain('神创造天地');
		});

		it('should handle emoji in text', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 God created the earth 🌍 and heavens ⭐`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('🌍');
			expect(html).toContain('⭐');
		});

		it('should handle combining diacritics', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Café and naïve words`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Café');
			expect(html).toContain('naïve');
		});

		it('should handle zero-width characters', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Word\u200Bwith\u200Bzero-width`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toBeDefined();
			expect(html).toContain('zero-width');
		});
	});

	describe('Edge Cases - Whitespace', () => {
		it('should handle only whitespace', () => {
			const html = convertUSFMToHTML('   \n\t  ');
			expect(html).toBe('');
		});

		it('should handle only newlines', () => {
			const html = convertUSFMToHTML('\n\n\n');
			expect(html).toBe('');
		});

		it('should handle mixed whitespace (tabs, spaces, CRLF)', () => {
			const usfm = `\\id GEN\r\n\\c 1\r\n\t\\v 1 Text`;
			const html = convertUSFMToHTML(usfm);
			expect(html).toContain('Text');
		});
	});

	describe('Edge Cases - Markers', () => {
		it('should handle duplicate book IDs (use first)', () => {
			const usfm = `\\id GEN
\\id EXO
\\c 1
\\v 1 Text`;

			const html = convertUSFMToHTML(usfm);
			expect(html).toContain('Text');
		});

		it('should handle duplicate chapter numbers', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 First chapter one
\\c 1
\\v 1 Second chapter one`;

			const html = convertUSFMToHTML(usfm);
			expect(html).toContain('First chapter one');
			expect(html).toContain('Second chapter one');
		});

		it('should handle non-sequential verse numbers', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Verse one
\\v 3 Verse three (skipped 2)
\\v 2 Verse two (out of order)`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Verse one');
			expect(html).toContain('Verse three');
			expect(html).toContain('Verse two');
		});

		it('should handle verse 0', () => {
			const usfm = `\\id GEN
\\c 1
\\v 0 Verse zero
\\v 1 Verse one`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Verse zero');
			expect(html).toContain('Verse one');
		});

		it('should handle chapter without verses', () => {
			const usfm = `\\id GEN
\\c 1
\\c 2
\\v 1 Text in chapter 2`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Chapter 1');
			expect(html).toContain('Chapter 2');
			expect(html).toContain('Text in chapter 2');
		});

		it('should handle verse spanning multiple lines', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 This verse
spans multiple
lines of text.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('This verse');
			expect(html).toContain('spans multiple');
			expect(html).toContain('lines of text');
		});

		it('should handle unclosed footnote (error recovery)', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Text with \\f + \\ft unclosed footnote and more text.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Text with');
			expect(html).toContain('and more text');
		});

		it('should handle unclosed character style', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Text with \\bd unclosed bold and more text.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Text with');
			expect(html).toContain('unclosed bold');
			expect(html).toContain('and more text');
		});
	});

	describe('Edge Cases - Special Content', () => {
		it('should escape HTML-like content', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Text with <script>alert('xss')</script> content.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).not.toContain('<script>');
			expect(html).toContain('&lt;script&gt;');
		});

		it('should escape HTML entities', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Text with & < > " ' special chars.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('&amp;');
			expect(html).toContain('&lt;');
			expect(html).toContain('&gt;');
		});

		it('should handle control characters', () => {
			const usfm = `\\id GEN
\\c 1
\\v 1 Text with \x00 null \x01 control \x1F chars.`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toBeDefined();
			expect(html).not.toContain('\x00');
		});
	});

	describe('Edge Cases - File Size', () => {
		it('should handle very long verses (1000+ chars)', () => {
			const longText = 'word '.repeat(200); // 1000 chars
			const usfm = `\\id GEN
\\c 1
\\v 1 ${longText}`;

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('word');
			expect(html.length).toBeGreaterThan(1000);
		});

		it('should handle many verses (176 verses like Psalm 119)', () => {
			let usfm = `\\id PSA\n\\c 119\n`;
			for (let i = 1; i <= 176; i++) {
				usfm += `\\v ${i} Verse ${i} text.\n`;
			}

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Verse 1');
			expect(html).toContain('Verse 176');
			expect((html.match(/class="verse"/g) || []).length).toBe(176);
		});

		it('should handle many chapters (50 chapters like Genesis)', () => {
			let usfm = `\\id GEN\n`;
			for (let i = 1; i <= 50; i++) {
				usfm += `\\c ${i}\n\\v 1 Chapter ${i} verse 1.\n`;
			}

			const html = convertUSFMToHTML(usfm);

			expect(html).toContain('Chapter 1');
			expect(html).toContain('Chapter 50');
			expect((html.match(/Chapter \d+/g) || []).length).toBeGreaterThanOrEqual(50);
		});
	});

	describe('Performance', () => {
		it('should convert Psalm 119 in reasonable time', () => {
			let usfm = `\\id PSA\n\\c 119\n`;
			for (let i = 1; i <= 176; i++) {
				usfm += `\\v ${i} Blessed are those whose ways are blameless, who walk according to the law of the LORD.\n`;
			}

			const start = Date.now();
			const html = convertUSFMToHTML(usfm);
			const duration = Date.now() - start;

			expect(html).toBeDefined();
			expect(duration).toBeLessThan(500); // Should be < 500ms
		});

		it('should convert full Genesis in reasonable time', () => {
			let usfm = `\\id GEN\n\\mt1 Genesis\n`;
			for (let ch = 1; ch <= 50; ch++) {
				usfm += `\\c ${ch}\n`;
				const verseCount = ch === 1 ? 31 : 20; // Simplified
				for (let v = 1; v <= verseCount; v++) {
					usfm += `\\v ${v} This is chapter ${ch} verse ${v} with some text content.\n`;
				}
			}

			const start = Date.now();
			const html = convertUSFMToHTML(usfm);
			const duration = Date.now() - start;

			expect(html).toBeDefined();
			expect(duration).toBeLessThan(1000); // Should be < 1s
		});
	});
});
