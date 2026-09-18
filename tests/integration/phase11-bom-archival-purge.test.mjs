import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test('Phase 11 Seams 1-3: BOM Archival, Restore, and Permanent Purge with File Unlink', async () => {
  // 1. Create a mock uploaded file in public/uploads/boms/
  const bomsUploadDir = path.join(process.cwd(), 'public', 'uploads', 'boms');
  if (!fs.existsSync(bomsUploadDir)) {
    fs.mkdirSync(bomsUploadDir, { recursive: true });
  }

  const testFileName = `test-bom-${Date.now()}.xlsx`;
  const testFilePath = path.join(bomsUploadDir, testFileName);
  fs.writeFileSync(testFilePath, 'fake excel binary content');
  assert.ok(fs.existsSync(testFilePath), 'Mock BOM file must exist on disk');

  // 2. Create a test BOM record in DB
  const bom = await prisma.bOMSubmission.create({
    data: {
      trackingCode: 'BOM-TEST-' + Date.now(),
      contractorName: 'مهندس احمدی',
      contractorPhone: '09139998877',
      projectCity: 'نجف‌آباد',
      fileUrl: `/uploads/boms/${testFileName}`,
      fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      isArchived: false,
    }
  });

  const { toggleArchiveBom, purgeBomSubmission } = await import('../../src/lib/admin/admin-bom-guard.ts');

  // 3. Test Archive (Seam 1)
  const archiveResult = await toggleArchiveBom(bom.id, true);
  assert.equal(archiveResult.isArchived, true, 'BOM must transition to isArchived: true');
  assert.ok(fs.existsSync(testFilePath), 'File must NOT be deleted during normal archival');

  // 4. Test Restore (Seam 2)
  const restoreResult = await toggleArchiveBom(bom.id, false);
  assert.equal(restoreResult.isArchived, false, 'BOM must transition back to isArchived: false');

  // 5. Test Permanent Purge (Seam 3)
  const purgeResult = await purgeBomSubmission(bom.id);
  assert.equal(purgeResult.success, true, 'Purge must return success');

  // Verify DB record deleted
  const foundInDb = await prisma.bOMSubmission.findUnique({ where: { id: bom.id } });
  assert.equal(foundInDb, null, 'BOM record must be deleted from DB');

  // Verify disk file deleted
  assert.equal(fs.existsSync(testFilePath), false, 'Physical file must be unlinked from disk');
});
