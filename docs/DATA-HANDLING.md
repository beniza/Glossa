# Data Handling: Import, Validate, Sync

## Central Architecture

Glossa uses **SQLite** as a single source of truth for all resources (Flora, Fauna, Realia, UBS semantic domains, Strong's Lexicon).

### Folder Structure

```
data/
├── schemas/           # COMMIT: XSD, JSON schemas
├── sources/           # DO NOT COMMIT: raw XML/JSON from external sources
├── migrations/        # COMMIT: SQL migration files
├── glossa.db          # COMMIT: empty + migrations; ignore runtime
└── manifest.json      # COMMIT: resource metadata
```

---

## Import Workflow

### Step 1: Add Source Data
Place raw XML/JSON in `data/sources/`:
```
data/sources/
├── ubs/
│   ├── flora.xml
│   └── fauna.xml
├── unfoldingword/
│   └── dictionary.json
└── strongs/
    └── lexicon.json
```

### Step 2: Create Import Script
Add script to `../scripts/` (root scripts folder):
```javascript
// scripts/import-flora.js
import Database from 'better-sqlite3';
import fs from 'fs';
import xml2js from 'xml2js';

const db = new Database('./Glossa/data/glossa.db');

// Parse XML from data/sources/ubs/flora.xml
const xmlParser = new xml2js.Parser();
const rawXml = fs.readFileSync('./Glossa/data/sources/ubs/flora.xml');
const parsed = await xmlParser.parseStringPromise(rawXml);

// Transform & insert into DB
parsed.flora.entry.forEach(entry => {
  db.prepare(`
    INSERT INTO flora (id, term, definition, source)
    VALUES (?, ?, ?, ?)
  `).run(entry.$.id, entry.term[0], entry.def[0], 'UBS');
});

db.close();
console.log('✅ Flora import complete');
```

### Step 3: Local Validation
```bash
node scripts/validate-roundtrip.js
```

Checks:
- ✅ Schema compliance (matches XSD/JSON schema)
- ✅ No data loss (export from DB == original import)
- ✅ Referential integrity (no broken links)
- ✅ Entry counts match manifest.json
- ✅ All required fields populated

### Step 4: CI Validation
Push to PR → GitHub Actions runs full validation → blocks merge if it fails.

---

## Validation Rules (Hybrid)

| Stage | Who | Tool | Gate | Action |
|-------|-----|------|------|--------|
| Local (pre-commit) | Developer | `node scripts/validate-roundtrip.js` | Soft (warning) | LLM warns if skipped |
| CI (pre-merge) | GitHub Actions | Full validation suite | Hard (blocks merge) | Automated check |

**LLM Responsibility:** 
- Warn if developer skips local validation
- Don't auto-fix; let developer see the error
- Suggest running validation, never assume it passed

---

## Updating `manifest.json`

Track resource versions and import state:
```json
{
  "resources": [
    {
      "name": "Flora",
      "source": "UBS",
      "version": "1.2.0",
      "lastImported": "2026-04-20T14:30:00Z",
      "entryCount": 5000,
      "language": "en",
      "schema": "flora.xsd"
    },
    {
      "name": "Fauna",
      "source": "UBS",
      "version": "1.0.0",
      "lastImported": "2026-04-15T09:00:00Z",
      "entryCount": 3200,
      "language": "en",
      "schema": "fauna.xsd"
    }
  ]
}
```

**Update this whenever:**
- A new resource is imported
- A resource version is updated
- Schema changes

---

## Regenerating Database (Schema Changes)

If `flora.xsd` or database schema changes:

### Step 1: Create Migration
```sql
-- data/migrations/003_add_semantic_domain.sql
ALTER TABLE flora ADD COLUMN semantic_domain TEXT;
ALTER TABLE flora ADD COLUMN example_context TEXT;
```

### Step 2: Run Migration
```bash
sqlite3 ./data/glossa.db < ./data/migrations/003_add_semantic_domain.sql
```

### Step 3: Re-import Data
```bash
node scripts/import-flora.js
```

### Step 4: Validate
```bash
node scripts/validate-roundtrip.js
```

Expected output:
```
✅ Schema validation passed
✅ Roundtrip validation passed (5000 entries)
✅ Referential integrity OK
```

### Step 5: Commit
```bash
git add data/migrations/ glossa.db manifest.json
git commit -m "schema: add semantic_domain to flora table"
```

---

## Data Export (for round-trip testing)

When validating, Glossa exports the DB back to XML/JSON to verify no data loss:

```bash
node scripts/export-flora.js
# Generates: data/export/flora-latest.xml

# Compare with original source
diff data/sources/ubs/flora.xml data/export/flora-latest.xml
```

If differences exist, the validator flags them.

---

## Common Issues

### Issue: "Import failed: Schema mismatch"
**Solution:** Check XSD schema in `data/schemas/` matches source format.

### Issue: "Roundtrip validation failed: Entry count mismatch"
**Cause:** Some entries were dropped during import.
**Solution:** Review import script logic, check for NULL values or skipped entries.

### Issue: "CI validation blocked merge"
**Action:** Run local `validate-roundtrip.js`, fix errors locally, push again.

---

*Last updated: April 2026*
