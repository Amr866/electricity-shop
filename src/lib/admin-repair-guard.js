import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const ACTIVE_REPAIR_STATUSES = [
  "SUBMITTED",
  "RECEIVED",
  "INSPECTING",
  "COST_ESTIMATED",
  "REPAIRING",
  "READY",
];

export const TERMINAL_REPAIR_STATUSES = [
  "DELIVERED",
  "CANCELLED",
  "COMPLETED",
];

export async function guardRepairDeletion(id) {
  const repair = await prisma.repairRequest.findUnique({
    where: { id },
  });

  if (!repair) {
    throw new Error("سفارش تعمیر مورد نظر یافت نشد.");
  }

  if (ACTIVE_REPAIR_STATUSES.includes(repair.status)) {
    throw new Error(
      `سفارش تعمیر [${repair.trackingCode}] در جریان (${repair.status}) است و امکان حذف وجود ندارد. ابتدا وضعیت را به تحویل‌شده یا لغوشده تغییر دهید.`
    );
  }

  if (repair.isArchived) {
    await prisma.repairRequest.delete({
      where: { id },
    });

    return {
      success: true,
      archived: false,
      hardDeleted: true,
      id,
      trackingCode: repair.trackingCode,
      message: `سفارش تعمیر ${repair.trackingCode} به طور قطعی از سیستم حذف شد.`,
    };
  }

  await prisma.repairRequest.update({
    where: { id },
    data: { isArchived: true },
  });

  return {
    success: true,
    archived: true,
    hardDeleted: false,
    id,
    trackingCode: repair.trackingCode,
    message: `سفارش تعمیر ${repair.trackingCode} به بایگانی سوابق فنی کارگاه منتقل شد.`,
  };
}

export async function toggleArchiveRepair(id, targetArchived) {
  const repair = await prisma.repairRequest.findUnique({
    where: { id },
  });

  if (!repair) {
    throw new Error("سفارش تعمیر مورد نظر یافت نشد.");
  }

  if (ACTIVE_REPAIR_STATUSES.includes(repair.status)) {
    throw new Error(
      `سفارش تعمیر [${repair.trackingCode}] در جریان است و امکان تغییر وضعیت بایگانی وجود ندارد.`
    );
  }

  const newStatus = targetArchived !== undefined ? targetArchived : !repair.isArchived;

  return await prisma.repairRequest.update({
    where: { id },
    data: { isArchived: newStatus },
  });
}

export async function guardRepairDeletionBulk(ids) {
  let archivedCount = 0;
  let purgedCount = 0;
  let rejectedCount = 0;
  const results = [];

  for (const id of ids) {
    try {
      const res = await guardRepairDeletion(id);
      if (res.hardDeleted) purgedCount++;
      if (res.archived) archivedCount++;
      results.push(res);
    } catch (err) {
      rejectedCount++;
      results.push({
        success: false,
        id,
        error: err.message,
      });
    }
  }

  return {
    success: true,
    total: ids.length,
    archivedCount,
    purgedCount,
    rejectedCount,
    results,
  };
}
