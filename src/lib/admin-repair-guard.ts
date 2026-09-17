import { prisma } from "@/lib/prisma";

export const ACTIVE_REPAIR_STATUSES = [
  "SUBMITTED",
  "RECEIVED",
  "INSPECTING",
  "COST_ESTIMATED",
  "REPAIRING",
  "READY",
] as const;

export const TERMINAL_REPAIR_STATUSES = [
  "DELIVERED",
  "CANCELLED",
  "COMPLETED",
] as const;

export interface RepairGuardResult {
  success: boolean;
  archived: boolean;
  hardDeleted: boolean;
  id: string;
  trackingCode: string;
  message: string;
}

/**
 * Guarded deletion for workshop repairs.
 * Rejects in-progress tickets with safety error.
 * Archives active terminal tickets (DELIVERED, CANCELLED).
 * Hard-deletes already-archived terminal tickets.
 */
export async function guardRepairDeletion(id: string): Promise<RepairGuardResult> {
  const repair = await prisma.repairRequest.findUnique({
    where: { id },
  });

  if (!repair) {
    throw new Error("سفارش تعمیر مورد نظر یافت نشد.");
  }

  if (ACTIVE_REPAIR_STATUSES.includes(repair.status as any)) {
    throw new Error(
      `سفارش تعمیر [${repair.trackingCode}] در جریان (${repair.status}) است و امکان حذف وجود ندارد. ابتدا وضعیت را به تحویل‌شده یا لغوشده تغییر دهید.`
    );
  }

  // If already archived -> Hard Delete / Purge
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

  // If not archived yet -> Soft Archive
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

/**
 * Toggle or explicitly set isArchived for terminal tickets.
 */
export async function toggleArchiveRepair(id: string, targetArchived?: boolean) {
  const repair = await prisma.repairRequest.findUnique({
    where: { id },
  });

  if (!repair) {
    throw new Error("سفارش تعمیر مورد نظر یافت نشد.");
  }

  if (ACTIVE_REPAIR_STATUSES.includes(repair.status as any)) {
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

/**
 * Bulk guarded deletion for repairs.
 */
export async function guardRepairDeletionBulk(ids: string[]) {
  let archivedCount = 0;
  let purgedCount = 0;
  let rejectedCount = 0;
  const results: any[] = [];

  for (const id of ids) {
    try {
      const res = await guardRepairDeletion(id);
      if (res.hardDeleted) purgedCount++;
      if (res.archived) archivedCount++;
      results.push(res);
    } catch (err: any) {
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
