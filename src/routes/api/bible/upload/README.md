# Bible Upload API Testing Guide

The upload API endpoint is located at:
```
src/routes/api/bible/upload/+server.ts
```

## Endpoint Spec
- **Route**: `POST /api/bible/upload`
- **Content-Type**: `multipart/form-data`
- **Returns**: JSON with upload status and book list

## Request Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | File | Yes | Zip file containing USFM books |
| `bibleId` | String | No | Custom Bible ID (generated if omitted) |
| `bibleName` | String | No | Human-readable name (defaults to "Untitled Bible") |

## Response Format

```json
{
  "success": true,
  "bibleId": "web-2025",
  "bibleName": "World English Bible",
  "books": ["GEN", "EXO", "LEV", "MAT", "REV"],
  "bookCount": 5
}
```

## Manual Testing

### 1. Prepare Test Data

Create a sample USFM file (`GEN.usfm`):
```usfm
\id GEN
\h Genesis
\mt1 Genesis
\c 1
\p
\v 1 In the beginning God created the heavens and the earth.
\v 2 The earth was without form and void.
```

Create a zip file:
```bash
# Windows
Compress-Archive -Path GEN.usfm,EXO.usfm -DestinationPath test-bible.zip

# Linux/Mac
zip test-bible.zip GEN.usfm EXO.usfm
```

### 2. Start Dev Server

```bash
bun run dev
```

### 3. Test with curl

```bash
# Upload with auto-generated ID
curl -X POST http://localhost:5173/api/bible/upload \
  -F "file=@test-bible.zip" \
  -F "bibleName=Test Bible"

# Upload with custom ID
curl -X POST http://localhost:5173/api/bible/upload \
  -F "file=@test-bible.zip" \
  -F "bibleId=my-bible-v1" \
  -F "bibleName=My Custom Bible"
```

### 4. Test with Postman/Insomnia

1. Create a new POST request to `http://localhost:5173/api/bible/upload`
2. Set body type to `form-data`
3. Add fields:
   - `file`: Select your zip file
   - `bibleId`: (optional) e.g., "web-2025"
   - `bibleName`: (optional) e.g., "World English Bible"
4. Send request

### 5. Verify Upload

Check that files were created:
```bash
# Windows
Get-ChildItem -Recurse data\bibles\web-2025

# Linux/Mac
ls -R data/bibles/web-2025/
```

Expected structure:
```
data/bibles/web-2025/
├── GEN.usfm
├── EXO.usfm
└── metadata.json
```

Check metadata:
```bash
cat data/bibles/web-2025/metadata.json
```

## Error Cases

| Scenario | Expected Response | HTTP Status |
|----------|-------------------|-------------|
| No file uploaded | `"No file provided. Please upload a zip file."` | 400 |
| Non-zip file | `"Invalid file type. Please upload a .zip file."` | 400 |
| Empty zip | `"Empty zip file. Please upload a zip containing USFM files."` | 400 |
| No USFM files | `"No USFM files found in zip."` | 400 |
| Invalid USFM | `"No valid USFM files found. Files must start with \\id marker."` | 400 |
| Corrupted zip | `"Invalid zip file. The file may be corrupted."` | 400 |
| Duplicate Bible ID | `"Bible with ID 'X' already exists."` | 409 |
| Invalid Bible ID | `"Invalid bibleId. Only alphanumeric, hyphens, and underscores allowed."` | 400 |

## Implementation Details

### Validation Rules
1. **File format**: Must be `.zip` extension
2. **USFM validation**: Each file must start with `\id` marker
3. **Book ID extraction**: Uses `\id` marker content (e.g., `\id GEN`)
4. **Bible ID generation**: Auto-generated from filename if not provided
   - Example: `"web 2025.zip"` → `"web-2025"`
5. **Security**: Sanitizes bibleId to prevent path traversal

### Extraction Logic
1. Read zip buffer from multipart form data
2. Extract using adm-zip library
3. Filter for `.usfm` or `.USFM` files
4. Validate each file has valid `\id` marker
5. Extract book code from `\id` marker
6. Write files to `data/bibles/{bibleId}/`
7. Create `metadata.json` with upload info

### Error Handling
- **400**: Client errors (invalid input, validation failures)
- **409**: Conflict (Bible ID already exists)
- **500**: Server errors (file system errors, unexpected exceptions)

## Integration with Convert API

After successful upload, files are ready for the convert API:
```bash
# Upload Bible
curl -X POST http://localhost:5173/api/bible/upload \
  -F "file=@web-2025.zip" \
  -F "bibleId=web-2025"

# Convert a chapter
curl http://localhost:5173/api/bible/convert/web-2025/GEN/1
```

## Performance Target

**NFR-1.1**: Zip file upload and extraction shall complete within 5 seconds for files up to 10MB.

## TODO: Future Enhancements

- [ ] Migrate to SQLite storage (currently using file system)
- [ ] Add progress tracking for large uploads
- [ ] Add Bible update/overwrite endpoint
- [ ] Add Bible deletion endpoint
- [ ] Add Bible listing endpoint (GET /api/bible/list)
- [ ] Add file size validation (reject > 50MB)
- [ ] Add MIME type validation (check zip magic bytes)
- [ ] Add integration tests with real USFM samples
- [ ] Add upload UI component in Reader

## Related Files

- Upload endpoint: `src/routes/api/bible/upload/+server.ts`
- Convert endpoint: `src/routes/api/bible/convert/[bibleId]/[bookId]/[chapter]/+server.ts`
- Converter logic: `src/lib/features/reader/converter.ts`
- PRD requirements: `docs/bible-reader/prd.md` (Section 4.1, FR-1.1 to FR-1.4)
