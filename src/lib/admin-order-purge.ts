import { prisma } from "@/lib/prisma";

export interface OrderPurgeResult {
  success: boolean;
  deletedCount: number;
  itemsDeleted: number;
}

/**
 * Permanently deletes orders and their associated order items in an atomic transaction.
 *
 * @param {string[] | null} [orderIds] Specific order IDs to delete, or null/empty to purge all orders
 */
export async function purgeAllOrdersCascade(orderIds: string[] | null = null): Promise<OrderPurgeResult> {
  return await prisma.$transaction(async (tx: any) => {
    let targetIds: string[] = orderIds && orderIds.length > 0 ? orderIds : [];

    if (targetIds.length === 0) {
      const allOrders = await tx.order.findMany({ select: { id: true } });
      targetIds = allOrders.map((o: { id: string }) => o.id);
    }

    if (targetIds.length === 0) {
      return { success: true, deletedCount: 0, itemsDeleted: 0 };
    }

    // 1. Delete all associated order items first
    const deletedItems = await tx.orderItem.deleteMany({
      where: { orderId: { in: targetIds } },
    });

    // 2. Delete all target orders
    const deletedOrders = await tx.order.deleteMany({
      where: { id: { in: targetIds } },
    });

    return {
      success: true,
      deletedCount: deletedOrders.count,
      itemsDeleted: deletedItems.count,
    };
  });
}
