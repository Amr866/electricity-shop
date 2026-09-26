# Implementation Plan: Admin Media Library & Reusable Picker Architecture

**Branch**: `003-admin-media-management` | **Date**: 2026-09-26 | **Spec**: [spec.md](./spec.md)  
**Parent Feature**: [001-store-workshop-platform](../001-store-workshop-platform/spec.md)

---

## Summary

This plan details the technical architecture, deep-module boundaries, and "Code Judo" refactoring for the **Admin Media Library & Reusable Picker Architecture**. It resolves the giant file bloat in `ProductsAdminClient.tsx`, eliminates duplicated file/byte utilities, encapsulates media operations into a deep server-side `MediaService`, and exposes a reusable `<MediaPickerModal />` for catalog and studio management.

---

## Technical Context

- **Language/Version**: TypeScript 5.7.2, Node.js v20+ / v22+
- **Primary Dependencies**: Next.js 15.5.24 (App Router), React 19.0.0, Tailwind CSS 3.4.16, Prisma ORM 6.19.3, NextAuth.js 4.24.15, Lucide React 1.46.0
- **Storage**: PostgreSQL 16 (Prisma `ProductImage` relations) & Local Filesystem (`public/uploads`)
- **Testing**: `tsx --test tests/integration/*.test.mjs`, `tsc --noEmit`
- **Architectural Paradigms**: Deep Modules, Thin Adapters, BiDi Text Isolation (`<bdi dir="ltr">`), Zero-Crash Fallbacks

---

## Constitution Check

| Principle / Gate | Status | Architectural Verification |
|---|:---:|---|
| **I. Brand & Local Identity** | **PASS** | Najafabad store assets, Persian RTL UI, product image integrity preserved. |
| **II. Zero-Crash Fallback** | **PASS** | File listing and deletion handle missing directories and stale DB references gracefully. |
| **III. Server-Authoritative** | **PASS** | Server-side directory traversal sanitization, whitelist validation, and 409 Conflict delete protection. |
| **IV. Persian RTL & BiDi** | **PASS** | All file paths, URLs, and sizes wrapped in `<bdi dir="ltr">` with monospace font. |
| **VI. Technology Stack** | **PASS** | Next.js 15 App Router, React 19, Prisma ORM 6.19.3. |
| **VII. Structured Logging** | **PASS** | No sensitive data logged; file actions logged with level-appropriate structured traces. |
| **VIII. Quality Gates** | **PASS** | Zero TypeScript compilation errors (`tsc --noEmit`), automated integration tests pass 100%. |

---

## Architecture & Deep Module Refactoring ("Code Judo")

### 1. Canonical Media Domain Utility (`src/lib/utils/media.ts`)
- **Interface**:
  - `formatBytes(bytes: number): string`
  - `getFileType(filename: string): "image" | "document" | "spreadsheet" | "other"`
  - `normalizeUploadPath(target: string): string`
  - Types: `MediaFile`, `FileType`, `MediaFolder`
- **Benefit**: Single source of truth. Eliminates duplicated byte formatters and file-type regexes across admin views.

### 2. Deep Server-Side Media Service (`src/lib/services/mediaService.ts`)
- **Interface**:
  - `listUploadedMedia(): Promise<MediaFile[]>`
  - `saveUploadedFile(file: File, folder?: string): Promise<MediaFile>`
  - `deleteUploadedFile(target: string, force?: boolean): Promise<{ success: boolean; conflict?: { isUsedInProduct: boolean; productName: string } }>`
- **Seam**: Separates Node filesystem (`fs/promises`), traversal security checks, and Prisma database queries from HTTP request handling.
- **Benefit**: Turns `src/app/api/admin/upload/route.ts` into a 35-line HTTP adapter. Enables reuse in CLI tools, background scripts, or server actions.

### 3. Decoupled Reusable UI Component (`src/components/admin/MediaPickerModal.tsx`)
- **Interface**:
  - `isOpen: boolean`
  - `onClose: () => void`
  - `onSelect: (url: string) => void`
  - `currentUrl?: string`
- **Benefit**:
  - Cuts ~140 lines of JSX and 4 state variables out of `ProductsAdminClient.tsx`, bringing it down under strict maintainability limits.
  - Gives immediate leverage to other admin forms (`/admin/articles`, `/admin/categories`).

---

## Verification Plan

- `npm run typecheck` (`tsc --noEmit`)
- `npx tsx --test tests/integration/phase9-media-migration.test.mjs`
- `npx tsx --test tests/integration/phase19-admin-governance.test.mjs`
- `npm run build`
