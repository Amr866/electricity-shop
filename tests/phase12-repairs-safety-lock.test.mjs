import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test('Phase 12: Workshop Repairs Safety-Locked Archival and Purge', async () => {
  const { guardRepairDeletion, toggleArchiveRepair } = await import('../src/lib/admin-repair-guard.js');

  const activeTracking = 'REP-TEST-ACT-' + Date.now().toString().slice(-6);
  const terminalTracking = 'REP-TEST-TRM-' + Date.now().toString().slice(-6);

  // 1. Create an active repair in status INSPECTING
  const activeRepair = await prisma.repairRequest.create({
    data: {
      trackingCode: activeTracking,
      customerName: 'علی رضایی',
      customerPhone: '09131112233',
      applianceType: 'الکتروموتور تک‌فاز',
      issueDesc: 'سوختگی سیم‌پیچ اصلی',
      status: 'INSPECTING',
      isArchived: false,
    }
  });

  // 2. Safety Lock Check: Attempt deleting/archiving active repair must fail
  await assert.rejects(
    async () => {
      await guardRepairDeletion(activeRepair.id);
    },
    (err) => {
      assert.match(err.message, /در جریان|امکان حذف وجود ندارد/);
      return true;
    },
    'Active repair must be safety-locked from deletion'
  );

  // 3. Create a terminal repair in status DELIVERED
  const terminalRepair = await prisma.repairRequest.create({
    data: {
      trackingCode: terminalTracking,
      customerName: 'حسین نادری',
      customerPhone: '09134445566',
      applianceType: 'پمپ آب بشقابی',
      issueDesc: 'تعویض بلبرینگ و کاسه‌نمد',
      status: 'DELIVERED',
      isArchived: false,
    }
  });

  // 4. Stage 1: Soft-archive terminal repair
  const archiveResult = await guardRepairDeletion(terminalRepair.id);
  assert.equal(archiveResult.archived, true, 'Terminal repair must transition to isArchived: true');
  
  const archivedInDb = await prisma.repairRequest.findUnique({ where: { id: terminalRepair.id } });
  assert.ok(archivedInDb, 'Archived repair must still exist in DB');
  assert.equal(archivedInDb.isArchived, true, 'isArchived must be true');

  // 5. Toggle Restore Check: can restore archived repair back to active workshop records
  const restored = await toggleArchiveRepair(terminalRepair.id, false);
  assert.equal(restored.isArchived, false, 'Repair should be restored to active list');

  // Archive it again for purge test
  await toggleArchiveRepair(terminalRepair.id, true);

  // 6. Stage 2: Purge from archive (permanent delete)
  const purgeResult = await guardRepairDeletion(terminalRepair.id);
  assert.equal(purgeResult.hardDeleted, true, 'Archived terminal repair must be permanently purged');

  const purgedInDb = await prisma.repairRequest.findUnique({ where: { id: terminalRepair.id } });
  assert.equal(purgedInDb, null, 'Purged repair must be removed from DB');

  // Cleanup active test repair
  await prisma.repairRequest.delete({ where: { id: activeRepair.id } });
});
