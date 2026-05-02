# Convert API Testing Guide

The convert API endpoint is located at:
```
src/routes/api/bible/convert/[bibleId]/[bookId]/[chapter]/+server.ts
```

## Endpoint Spec
- **Route**: `GET /api/bible/convert/:bibleId/:bookId/:chapter`
- **Returns**: JSON with HTML and metadata
- **Example**: `/api/bible/convert/web-2025/GEN/1`

## Manual Testing

1. **Start dev server**:
   ```bash
   bun run dev
   ```

2. **Prepare test data** - Create a sample USFM file:
   ```bash
   mkdir -p data/bibles/test-bible
   ```

   Create `data/bibles/test-bible/GEN.usfm`:
   ```usfm
   \id GEN
   \h Genesis
   \mt1 Genesis
   \c 1
   \p
   \v 1 In the beginning God created the heavens and the earth.
   \v 2 The earth was without form and void.
   ```

3. **Test the endpoint**:
   ```bash
   # Using curl
   curl http://localhost:5173/api/bible/convert/test-bible/GEN/1

   # Using browser
   # Open: http://localhost:5173/api/bible/convert/test-bible/GEN/1
   ```

## Expected Response

```json
{
  "html": "<div class=\"usfm-content\">...</div>",
  "metadata": {
    "book": "GEN",
    "chapter": 1,
    "verses": 2,
    "bibleId": "test-bible"
  }
}
```

## Error Cases

| Case | Expected | Test URL |
|------|----------|----------|
| Missing Bible | 404 "Bible not found" | `/api/bible/convert/nonexistent/GEN/1` |
| Missing Chapter | 404 "Chapter N not found" | `/api/bible/convert/test-bible/GEN/999` |
| Invalid chapter | 400 "Invalid chapter number" | `/api/bible/convert/test-bible/GEN/abc` |
| Path traversal | 400 "Invalid bibleId or bookId format" | `/api/bible/convert/../../../etc/GEN/1` |

## Integration Testing

Integration tests should be added once the Reader UI is implemented. They will:
- Test the full flow: Upload → Store → Convert → Display
- Verify UI components correctly call the API
- Test error handling in the UI layer
- Verify proper HTML rendering in the browser

For now, manual testing is sufficient to verify the endpoint works correctly.

## Implementation Notes

- **File system storage**: Currently reads from `data/bibles/{bibleId}/{bookId}.usfm`
- **TODO**: Migrate to SQLite storage later (see HANDOFF.md)
- **Chapter extraction**: Uses helper function to extract only requested chapter
- **Security**: Sanitizes bibleId and bookId to prevent path traversal
- **Performance**: Should meet <500ms requirement per PRD (relies on converter performance)
