## `POST` in src/app/api/bom/parse/route.ts (L10-L131)

**Purpose:** Receives uploaded contractor Bill of Materials (BOM) spreadsheets via multipart form data or base64 JSON, validates file size (max 10MB) and extensions (`.xlsx`, `.xls`, `.csv`), performs anti-smuggling preflight checks against embedded HTML/SVG scripting, parses line items via SheetJS (`xlsx`), scores and matches each item against the active product catalog, persists the file to `/public/uploads/boms/`, and returns quotation summaries.

**Inputs & Assumptions:**
- `file` (multipart/form-data) or `body.base64` / `body.fileName` (application/json): uploaded spreadsheet bytes. Trust: **untrusted**.
- Implicit: Local filesystem path `/public/uploads/boms/`, database table `Product` (queried by `parseAndMatchContractorBom`).
- Preconditions:
  - File buffer is non-empty.
  - File extension is strictly within allowlist `[".xlsx", ".xls", ".csv"]` (L44-L51).
  - File buffer size is <= 10MB (L54-L60).
  - First 1KB prefix does not contain `<script`, `<html`, `<!doctype`, `<svg`, or `javascript:` (L63-L77).

**Outputs & Effects:**
- Returns JSON `{ success: true, fileName, fileUrl, fileType, ...quotation }` on 200, or error JSON with status 400 or 422.
- State write: writes uploaded file to disk at `public/uploads/boms/bom_<timestamp>_<rand>_<cleanName>.ext` (L102-L105).
- Database read: full product catalog query via `prisma.product.findMany` inside `parseAndMatchContractorBom`.

**Block-by-Block:**

```typescript
// L44-L60
const ALLOWED_BOM_EXTENSIONS = [".xlsx", ".xls", ".csv"];
const rawExt = path.extname(fileName).toLowerCase();
if (rawExt && !ALLOWED_BOM_EXTENSIONS.includes(rawExt)) {
  return NextResponse.json({ error: "..." }, { status: 400 });
}
const MAX_BOM_BYTES = 10 * 1024 * 1024;
if (fileBuffer.length > MAX_BOM_BYTES) {
  return NextResponse.json({ error: "..." }, { status: 400 });
}
```
- **What:** Rejects unsupported file extensions and caps buffer size at 10MB.
- **Why here:** Basic boundary constraints mitigating file-type confusion and memory exhaustion attacks.
- **Assumes:** Safe extensions are limited to Excel and CSV formats.
- **Establishes:** Buffer is at most 10MB and file extension matches allowlist.
- **Depended on by:** Parser and file write logic below.

```typescript
// L62-L77
const bufferPrefix = fileBuffer.subarray(0, 1024).toString("utf8").toLowerCase();
if (
  bufferPrefix.includes("<script") ||
  bufferPrefix.includes("<html") ||
  bufferPrefix.includes("<!doctype html") ||
  bufferPrefix.includes("<svg") ||
  bufferPrefix.includes("javascript:")
) {
  return NextResponse.json({ error: "..." }, { status: 400 });
}
```
- **What:** Preflights the initial 1024 bytes of the uploaded file for HTML, SVG, or script smuggling signatures.
- **Why here:** Prevents polyglot or disguised HTML files from being served as executable payloads if uploaded with an allowed extension.
- **Assumes:** Active script or HTML smuggling payloads manifest within the first 1KB prefix.
- **Establishes:** Buffer prefix is free of common HTML/script tags.
- **Depended on by:** SheetJS parser execution at L88.

```typescript
// L88
const quotation = await parseAndMatchContractorBom(fileBuffer);
```
- **What:** Ingests buffer into SheetJS workbook, identifies column mappings, iterates rows, and scores matches against active products.
- **Why here:** Core domain processing extracting actionable commercial quotes from unstructured contractor sheets.
- **Assumes:** SheetJS (`XLSX.read`) safely handles malformed XML/ZIP structures without buffer overflow.
- **Assumes:** The total number of rows in the workbook does not exhaust Node.js CPU/memory during in-memory matching against all active products. Established by: `nothing found` (no explicit row count limit in `parseBomWorkbook`).
- **Establishes:** Structured `BomQuotationSummary` containing matches, scores, and estimated line totals.
- **Depended on by:** Response payload at L114-L120.

```typescript
// L93-L112
const bomsDir = path.resolve(process.cwd(), "public", "uploads", "boms");
await mkdir(bomsDir, { recursive: true });
const ext = ALLOWED_BOM_EXTENSIONS.includes(rawExt) ? rawExt : ".xlsx";
const cleanBase = path.basename(fileName, ext).replace(/[^a-zA-Z0-9_\-\u0600-\u06FF]/g, "_").slice(0, 35);
const uniqueSuffix = crypto.randomBytes(4).toString("hex");
const safeName = `bom_${Date.now()}_${uniqueSuffix}_${cleanBase}${ext}`;
const destPath = path.join(bomsDir, safeName);
await writeFile(destPath, fileBuffer);
```
- **What:** Writes spreadsheet to disk with sanitized filename, timestamp, and random hex entropy.
- **Why here:** Retains uploaded contractor file for subsequent administrative review or quotation audit.
- **Assumes:** `bomsDir` is within the application root and writable by the process.
- **Establishes:** Persisted file path with collision-resistant name.
- **Depended on by:** Response `fileUrl` (`/uploads/boms/${safeName}`).

**Cross-Function Dependencies:**
- Callee `parseAndMatchContractorBom`: domain parser in `@/lib/bomParser`.
- Callee `XLSX.read`: SheetJS library.
- Callers: Frontend contractor inquiry page (`/contractor-bom` or `/bom`).
- Shared state: Filesystem `/public/uploads/boms/` (managed by `MediaService.listUploadedMedia()` and `MediaService.deleteUploadedFile()`).
- Invariant couplings:
  - Files saved to `/uploads/boms/` can be queried in admin uploads dashboard via `folder === 'boms'`.

**Open Questions:**
- Unclear; what cleanup policy governs `/public/uploads/boms/`? Is there an automated cron or lifecycle TTL that purges abandoned BOM spreadsheets after 30 or 90 days, or do files accumulate indefinitely until manually pruned?
- Unclear; why does the endpoint return 422 rather than 400 on parsing errors? (L128). This matches RFC 4918 Unprocessable Entity for semantic spreadsheet validation failures.
