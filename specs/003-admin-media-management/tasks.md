# Tasks: Admin Media Library & Reusable Picker Architecture

**Feature Branch**: `003-admin-media-management`  
**Input Specifications**: [`spec.md`](./spec.md) | [`plan.md`](./plan.md)  
**Parent Feature**: [001-store-workshop-platform](../001-store-workshop-platform/tasks.md)

---

## Task List

### Phase 1: Shared Utilities & Canonical Types
- [x] T001 [P] Create `src/lib/utils/media.ts` defining canonical types (`MediaFile`, `FileType`, `MediaFolder`), `formatBytes`, `getFileType`, and `normalizeUploadPath`

### Phase 2: Deep Server Media Service
- [x] T002 Create `src/lib/services/mediaService.ts` encapsulating filesystem scanning, traversal security validation, product usage joins, and atomic file/record deletions
- [x] T003 Refactor `src/app/api/admin/upload/route.ts` into a lean HTTP adapter delegating to `mediaService`

### Phase 3: Decoupled UI Component & Client Refactoring
- [x] T004 Build reusable `src/components/admin/MediaPickerModal.tsx` supporting search, responsive thumbnails, active selection highlight, and keyboard dismiss (`Escape`)
- [x] T005 Refactor `src/app/admin/products/ProductsAdminClient.tsx` to replace inline modal markup and duplicate state with `<MediaPickerModal />`
- [x] T006 Refactor `src/app/admin/uploads/UploadsAdminClient.tsx` to use shared utilities from `src/lib/utils/media.ts`

### Phase 4: Verification & Quality Gates
- [x] T007 Run quality gates (`npm run typecheck`, `npm run test:integration`, and `npm run build`)

### Phase 5: Convergence
- [x] T008 Add client-side pagination (24 items in Grid, 50 rows in Table) with responsive page controls to `src/app/admin/uploads/UploadsAdminClient.tsx` per FR-002
- [x] T009 Add "articles" folder filter tab and article badge to `src/app/admin/uploads/UploadsAdminClient.tsx` per FR-001, FR-002
- [x] T010 Wrap all alphanumeric filenames, URLs, and byte counters in `<bdi dir="ltr">` in `src/app/admin/uploads/UploadsAdminClient.tsx` per Constitution IV

### Phase 6: Code Judo, Isomorphic Media & Deep Standardization
- [x] T011 [P] Make `src/lib/utils/media.ts` 100% isomorphic by removing Node.js `path` dependency and exporting canonical predicates (`isImageMedia`, `isPdfMedia`, `isExcelMedia`, `isDocMedia`) and `uploadMediaFile`
- [x] T012 Update `src/components/admin/MediaPickerModal.tsx` to strictly use `isImageMedia(f)`, preventing non-image media files from crashing `<Image />` renderers
- [x] T013 Update `src/app/admin/uploads/UploadsAdminClient.tsx` to use canonical media predicates, dynamic folder counts, and interactive 409 Conflict force-retry prompt
- [x] T014 Deduplicate upload pipelines in `ArticlesAdminClient.tsx` and `ProductEditModal.tsx` via `uploadMediaFile`
- [x] T015 Enforce structured logging in `src/app/api/admin/upload/route.ts` and verify with TDD suite `tests/unit/codeJudoDesign.test.ts`

