import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface OrderPurgeResult {
  success: boolean;
  deletedCount: number;
  itemsDeleted: number;
}

/**
 * Permanently deletes orders and their associated order items and payment logs in an atomic transaction.
 *
 * @param {string[] | null} [orderIds] Specific order IDs to delete, or null to purge all orders.
 * Note: If an empty array `[]` is provided, 0 orders are deleted (prevents accidental full-db purge).
 */
export async function purgeAllOrdersCascade(
  orderIds: string[] | null = null,
  txClient?: Prisma.TransactionClient
): Promise<OrderPurgeResult> {
  const runner = async (tx: Prisma.TransactionClient) => {
    // If orderIds is an array (even empty), we only delete what is explicitly requested.
    if (orderIds !== null && Array.isArray(orderIds)) {
      if (orderIds.length === 0) {
        return { success: true, deletedCount: 0, itemsDeleted: 0 };
      }
      const targetIds = orderIds;

      // 1. Delete associated payment transaction logs
      await tx.paymentTransactionLog.deleteMany({
        where: { orderId: { in: targetIds } },
      });

      // 2. Delete all associated order items
      const deletedItems = await tx.orderItem.deleteMany({
        where: { orderId: { in: targetIds } },
      });

      // 3. Delete target orders
      const deletedOrders = await tx.order.deleteMany({
        where: { id: { in: targetIds } },
      });

      return {
        success: true,
        deletedCount: deletedOrders.count,
        itemsDeleted: deletedItems.count,
      };
    }

    // When orderIds is null, purge all orders in database
    const allOrders = await tx.order.findMany({ select: { id: true } });
    const targetIds = allOrders.map((o) => o.id);

    if (targetIds.length === 0) {
      return { success: true, deletedCount: 0, itemsDeleted: 0 };
    }

    // 1. Delete associated payment transaction logs
    await tx.paymentTransactionLog.deleteMany({
      where: { orderId: { in: targetIds } },
    });

    // 2. Delete all associated order items
    const deletedItems = await tx.orderItem.deleteMany({
      where: { orderId: { in: targetIds } },
    });

    // 3. Delete all target orders
    const deletedOrders = await tx.order.deleteMany({
      where: { id: { in: targetIds } },
    });

    return {
      success: true,
      deletedCount: deletedOrders.count,
      itemsDeleted: deletedItems.count,
    };
  };

  if (txClient) {
    return await runner(txClient);
  }
  return await prisma.$transaction(runner);
}
