import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Permanently deletes orders and their associated order items in an atomic transaction.
 *
 * @param {string[]} [orderIds] Specific order IDs to delete, or null/empty to purge all orders
 */
export async function purgeAllOrdersCascade(orderIds = null, txClient = null) {
  const runner = async (tx) => {
    if (orderIds !== null && Array.isArray(orderIds)) {
      if (orderIds.length === 0) {
        return { success: true, deletedCount: 0, itemsDeleted: 0 };
      }
      const targetIds = orderIds;

      await tx.paymentTransactionLog.deleteMany({
        where: { orderId: { in: targetIds } }
      });

      const deletedItems = await tx.orderItem.deleteMany({
        where: { orderId: { in: targetIds } }
      });

      const deletedOrders = await tx.order.deleteMany({
        where: { id: { in: targetIds } }
      });

      return {
        success: true,
        deletedCount: deletedOrders.count,
        itemsDeleted: deletedItems.count
      };
    }

    const allOrders = await tx.order.findMany({ select: { id: true } });
    const targetIds = allOrders.map(o => o.id);

    if (targetIds.length === 0) {
      return { success: true, deletedCount: 0, itemsDeleted: 0 };
    }

    await tx.paymentTransactionLog.deleteMany({
      where: { orderId: { in: targetIds } }
    });

    const deletedItems = await tx.orderItem.deleteMany({
      where: { orderId: { in: targetIds } }
    });

    const deletedOrders = await tx.order.deleteMany({
      where: { id: { in: targetIds } }
    });

    return {
      success: true,
      deletedCount: deletedOrders.count,
      itemsDeleted: deletedItems.count
    };
  };

  if (txClient) {
    return await runner(txClient);
  }
  return await prisma.$transaction(runner);
}
