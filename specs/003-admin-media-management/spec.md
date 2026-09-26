# Feature Specification: Admin Media Library & Reusable Picker Architecture

**Feature Branch**: `003-admin-media-management`  
**Created**: 2026-09-26  
**Status**: Draft  
**Parent Feature**: [`001-store-workshop-platform`](../001-store-workshop-platform/spec.md)  
**Input**: User request: "Unified admin media library table view, product image relationship detection, safe deletion guards, and reusable media picker component"

---

## Overview

The **Admin Media Library & Reusable Picker Architecture** establishes a centralized, high-efficiency media management system for the Shiasi Store & Workshop Platform. It equips administrators with complete visibility over all uploaded media assets across the server (`/public/uploads/`, `/public/uploads/products/`, and `/public/uploads/boms/`), introduces dual Grid and Table administrative views, surfaces real-time product linkage to prevent orphaned assets, enforces guarded deletion with 409 Conflict protection, and decouples media selection into a reusable `<MediaPickerModal />` component.

---

## Clarifications

### Session 2026-09-26
- **Q**: When an administrator uploads a new product image, how should the server handle image format optimization and sizing?  
  **A**: **On-Demand Edge & Client Optimization via Next.js**: Uploaded media assets are stored on disk preserving their original format (up to 25MB) without blocking synchronous server compression during upload. Responsive WebP/AVIF generation, sizing, and device-specific caching are handled on-demand by the Next.js `<Image />` optimization pipeline, ensuring instant upload latency and zero risk of upload pipeline memory bottlenecks.
- **Q**: When an administrator selects an image from the Media Picker within the product form, how should the selection affect the product's images?  
  **A**: **Primary Image Replacement with Live Preview**: Selecting an image in the Media Picker immediately sets or replaces the primary product image URL in the product form, updating the inline thumbnail preview instantly. Multi-image gallery additions remain managed in the extended product studio.
- **Q**: How should media assets be paginated and displayed when the server storage grows beyond 100+ files?  
  **A**: **Client-Side Slicing with Fast Global Search**: The media API returns the complete sorted metadata inventory as lightweight JSON (~40KB for 500 files). The administrative UI partitions assets with client-side pagination (24 items per page in Grid, 50 rows in Table) and provides instantaneous real-time filtering across the entire catalog without recurring network roundtrips.

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Admin Media Inventory & Product Association Inspection (Priority: P1)

As a store administrator inspecting server uploads in the admin console, I want to see a unified inventory of all uploaded assets (catalog images, workshop BOMs, and general media) in both visual grid and tabular list formats, along with their connected store products, so that I can audit media storage, identify orphaned files, and prevent accidental deletion of active catalog pictures.

**Why this priority**: Administrators currently cannot tell whether a file on disk is active on the storefront or abandoned, leading to broken images or disk clutter.

**Independent Test**: Can be tested by visiting the media management console (`/admin/uploads`), switching between Grid and Table views, verifying that uploaded product images indicate their connected product title, and verifying file sizes and timestamps.

**Acceptance Scenarios**:
1. **Given** media files reside in multiple server subfolders (`products`, `boms`, `general`), **When** the administrator opens the media console, **Then** all files are retrieved and sorted newest-first with their folder category badges.
2. **Given** an image is assigned to an active product catalog item, **When** displayed in the media table, **Then** the row displays an active badge with the product's title and direct link.
3. **Given** an administrator attempts to delete an image linked to an active product, **When** clicking delete, **Then** deletion is blocked with a 409 Conflict confirmation warning requiring explicit force confirmation to prevent accidental storefront breakage.

---

### User Story 2 - One-Click Media Selection in Product Editing (Priority: P1)

As a catalog manager creating or editing a product, I want to select an existing server image through a visual media picker dialog with instant search, rather than manually uploading duplicates or copying and pasting URL strings.

**Why this priority**: Eliminates duplicate file uploads on disk, avoids path typographical errors, and speeds up product catalog management.

**Independent Test**: In the product editing form, open the media picker dialog, search for an existing image by name, select it with one click, and verify that the product image updates immediately in preview.

**Acceptance Scenarios**:
1. **Given** a product editing form, **When** the user clicks "Select from Media", **Then** an accessible dialog opens displaying available server images with search-by-filename capability.
2. **Given** the media picker dialog is open, **When** typing in the search box, **Then** the list filters instantly without reloading the page.
3. **Given** an image is clicked in the picker, **Then** the modal closes, the selected image URL is applied to the product form as the primary image, and an inline thumbnail preview is shown.
4. **Given** the modal dialog is open, **When** pressing the `Escape` key or clicking outside, **Then** the modal closes without altering existing form values.

---

### User Story 3 - Traversal-Safe Upload & Multi-Format Ingestion (Priority: P2)

As a workshop manager or customer support admin, I want to upload product pictures, technical specification sheets, and BOM inquiry files up to 25MB, with strict format validation and directory traversal protection.

**Why this priority**: Ensures store and workshop documents (PDF, Excel, Word) can be ingested alongside images while securing the server filesystem against arbitrary file overwrites.

**Independent Test**: Upload an allowed PDF or Excel BOM document and verify it is saved in the proper subfolder and given a download/preview link, while attempting invalid extensions or path traversal is rejected with localized error messaging.

**Acceptance Scenarios**:
1. **Given** an administrator uploads an image (`.webp`, `.jpg`, `.png`) or document (`.pdf`, `.xlsx`, `.docx`), **When** file size is under 25MB, **Then** the file is saved to the designated category folder and a public URL is returned without blocking synchronous image compression.
2. **Given** an upload exceeding 25MB or an unauthorized file extension, **When** submitted, **Then** the system rejects the file with HTTP 400 and a localized Persian error message.
3. **Given** a deletion request containing path traversal characters (`../`), **When** submitted, **Then** the system strictly confines operations to the authorized upload directory and returns HTTP 400.

---

### Edge Cases

- **File Discrepancy on Disk vs Database**: If a database record references a missing disk file, the system displays a graceful placeholder rather than throwing an unhandled exception or breaking the table render.
- **Concurrent Deletion**: If a file is deleted while another administrator is browsing the media picker, selection fails gracefully with an actionable alert rather than a fatal crash.
- **RTL & Long Filenames**: Long Latin or Persian filenames and URLs are rendered in `<bdi dir="ltr">` with text truncation and tooltip hover, preventing layout distortion in RTL dashboards.
- **Force Deletion of In-Use Image**: When an administrator explicitly forces deletion of a product image, all database references linking that image to products are cleaned up atomically to prevent 404 image errors on the storefront.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The media management system MUST scan and enumerate files across all designated upload categories (`uploads/`, `uploads/products/`, and `uploads/boms/`), returning a unified JSON metadata payload sorted newest-first (file name, relative path, public URL, file size in human-readable units, upload timestamp, folder category, and product linkage).
- **FR-002**: The media management interface MUST support dynamic view switching between a visual Grid View and a detailed Table View. The UI MUST provide responsive client-side pagination (defaulting to 24 items per page in Grid and 50 rows in Table) and instant global filtering by filename, folder category, and file type across all loaded assets without repeating network roundtrips.
- **FR-003**: The media management system MUST identify active database associations between media files and products. Media items linked to one or more catalog products MUST display the connected product name.
- **FR-004**: The system MUST implement guarded deletion for media assets. Deleting a file currently associated with an active product MUST be rejected with HTTP 409 unless an explicit `force=true` flag is supplied. When force deletion is confirmed, the file MUST be removed from disk and its database references cleanly removed.
- **FR-005**: The platform MUST provide a decoupled, reusable Media Picker modal dialog (`MediaPickerModal`) that can be embedded into any administrative form. The picker MUST support live search filtering by filename, display responsive image thumbnails, highlight currently selected assets, support keyboard dismissal (`Escape`), and upon selection, immediately set or replace the target form's primary image URL with an instant thumbnail preview.
- **FR-006**: The upload subsystem MUST validate file formats against an explicit whitelist of images (`JPG`, `PNG`, `WEBP`, `SVG`, `AVIF`) and documents (`PDF`, `XLSX`, `XLS`, `CSV`, `DOC`, `DOCX`, `TXT`), enforce a maximum size limit of 25MB, and protect against directory traversal attacks on both upload and deletion paths. Uploaded media assets MUST be persisted in their native format without synchronous CPU-blocking compression; image responsive delivery, WebP/AVIF conversion, and viewport-specific sizing are delegated to on-demand Next.js image optimization.

---

## Success Criteria *(measurable, technology-agnostic)*

1. **Media Discovery**: 100% of uploaded physical assets across root and product directories are discoverable and displayable in the media console without requiring manual database synchronization.
2. **Product Asset Safety**: Zero accidental orphaned product images: attempting to delete an in-use catalog image requires explicit secondary confirmation.
3. **Catalog Workflow Efficiency**: Administrators can assign an existing media asset to a product in under 3 clicks without typing or copying file paths.
4. **Security & Validation**: 100% of path traversal attempts (`../`) are intercepted and rejected before accessing the host filesystem.
5. **Responsive Performance**: Media grid and table views load and filter up to 500 assets with sub-second responsiveness on desktop and mobile viewports, maintaining smooth 60fps scrolling via client-side pagination.

---

## Key Entities & Data Schema

- **MediaFile (Virtual Domain Entity)**:
  - `name`: string (filename on disk)
  - `relativePath`: string (path relative to uploads root)
  - `url`: string (public HTTP URL path)
  - `folder`: `"products"` | `"boms"` | `"general"`
  - `fileType`: `"image"` | `"document"` | `"spreadsheet"` | `"other"`
  - `size`: number (file size in bytes)
  - `createdAt`: Date / ISO timestamp
  - `isUsedInProduct`: boolean
  - `productName`: string | null (name of primary connected product)

- **ProductImage (Database Relationship)**:
  - `id`: identifier
  - `productId`: foreign key linking to Product
  - `url`: string matching `MediaFile.url`
  - `isPrimary`: boolean
