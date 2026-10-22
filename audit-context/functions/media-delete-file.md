## `deleteUploadedFile` in src/lib/services/mediaService.ts (L190-L241)

**Purpose:** Deletes an uploaded file from disk within the `/public/uploads` directory boundary, verifying path safety (path traversal prevention), cross-referencing against product image usage in the database, blocking deletion if actively used unless explicitly forced, and optionally cascading database record removal.

**Inputs & Assumptions:**
- `target` (string): Filename or URL path of the target file (`/uploads/products/xyz.webp` or `xyz.webp`). Trust: **untrusted** (supplied by API callers).
- `force` (boolean, default `false`): Flag requesting unconditional deletion even if connected to products.
- Implicit: Filesystem root `/public/uploads`, database table `ProductImage`.
- Precondition: `target` is a non-empty string (L194-L196).
- Precondition: Resolved target path must reside strictly underneath `uploadsBase` (path traversal guard at L202-L206).

**Outputs & Effects:**
- Returns `{ success: true }` upon file unlink, or `{ success: false, conflict: { isUsedInProduct: true, productName } }` if file is locked by product without force.
- Throws Error if path is invalid or attempts directory traversal.
- State write: unlinks file from disk via `unlink(targetFilePath)` (L229).
- State write: if `force === true` and usage exists, deletes rows from `ProductImage` via `prisma.productImage.deleteMany` (L233-L237).

**Block-by-Block:**

```typescript
// L198-L206
const { cleanRelPath, possibleUrls } = normalizeUploadPath(target);
const uploadsBase = path.resolve(this.getUploadsBase());
const targetFilePath = path.resolve(uploadsBase, cleanRelPath);
const rel = path.relative(uploadsBase, targetFilePath);
if (rel.startsWith("..") || path.isAbsolute(rel)) {
  throw new Error("مسیر فایل نامعتبر است.");
}
```
- **What:** Normalizes target path, resolves absolute paths, and checks that `targetFilePath` sits strictly inside `uploadsBase`.
- **Why here:** Immediate boundary defense against arbitrary file deletion (`/etc/passwd`, source code, database files).
- **Assumes:** `uploadsBase` is an absolute canonical path.
- **Assumes:** `path.relative` starting with `..` or absolute indicates escaping the root.
- **Establishes:** Invariant that `targetFilePath` is within `/public/uploads/`.
- **Depended on by:** Database usage check and `unlink` call below.

```typescript
// L208-L226
const connectedUsage = await prisma.productImage.findFirst({
  where: { url: { in: possibleUrls } },
  include: { product: { select: { name: true } } },
});
if (connectedUsage && !force) {
  return {
    success: false,
    conflict: { isUsedInProduct: true, productName: connectedUsage.product?.name || "کالای فروشگاه" },
  };
}
```
- **What:** Queries `ProductImage` for references to any possible URL format of this file; returns conflict status if found without `force: true`.
- **Why here:** Safeguard preventing accidental deletion of live catalog imagery.
- **Assumes:** Only `ProductImage` records reference files in `uploadsBase`. Established by: `nothing found` (Articles, repair requests, and reviews also store upload URLs, but are not checked here before deletion).
- **Establishes:** Deletion is either permitted (unused) or caller explicitly specified `force: true`.
- **Depended on by:** Unlink execution below.

```typescript
// L228-L238
await unlink(targetFilePath);
if (connectedUsage && force) {
  await prisma.productImage.deleteMany({
    where: { url: { in: possibleUrls } },
  });
}
```
- **What:** Removes the file from the filesystem and prunes corresponding `ProductImage` records if forced.
- **Why here:** Physical resource deletion and referential integrity cleanup.
- **Assumes:** The process has OS permissions to delete the file.
- **Establishes:** File ceases to exist on disk; dangling `ProductImage` rows removed.
- **Depended on by:** Admin media manager UI refresh.

**Cross-Function Dependencies:**
- Callee `normalizeUploadPath`: internal helper in `@/lib/utils/media`.
- Callee `unlink` from `fs/promises`.
- Callee `prisma.productImage.findFirst`, `deleteMany`.
- Callers: Admin uploads API route (`DELETE /api/admin/upload`).
- Shared state: Filesystem `/public/uploads` and `ProductImage` table.
- Invariant couplings:
  - If a file is deleted with `force: false`, active products will not lose their primary or gallery images.

**Open Questions:**
- Unclear; what happens if an article references an image in `/uploads/articles/` and an admin deletes it? Because `connectedUsage` only checks `prisma.productImage`, article images can be deleted without warning or conflict error, resulting in broken image links on blog/article pages.
- Unclear; what happens if `unlink(targetFilePath)` succeeds but `prisma.productImage.deleteMany` fails? The operation is not transactional across disk and database.
