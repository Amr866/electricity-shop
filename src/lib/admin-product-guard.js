import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Smart Guarded Deletion for Products:
 * - If orderItemCount == 0: Hard delete product, its specs/reviews/images, and attempt file cleanup
 * - If orderItemCount >= 1: Transition to isArchived: true, stock: 0 to protect invoice history
 */
export async function deleteGuardedProduct(productId) {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: true,
      _count: {
        select: { orderItems: true }
      }
    }
  });

  if (!product) {
    throw new Error(`Product with ID ${productId} not found`);
  }

  const orderCount = product._count.orderItems;

  if (orderCount === 0) {
    // Collect image URLs for possible file unlink
    const imagesToClean = product.images.map(img => img.url);

    // Hard delete related data and product
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId } }),
      prisma.productSpec.deleteMany({ where: { productId } }),
      prisma.review.deleteMany({ where: { productId } }),
      prisma.product.delete({ where: { id: productId } })
    ]);

    // Cleanup images from public/uploads/products if not shared
    for (const imgUrl of imagesToClean) {
      if (imgUrl.startsWith('/uploads/products/')) {
        const filePath = path.join(process.cwd(), 'public', imgUrl);
        // Check if other product uses it
        const otherUse = await prisma.productImage.findFirst({
          where: { url: imgUrl }
        });
        if (!otherUse && fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            // Ignore file unlink error
          }
        }
      }
    }

    return { action: 'DELETED', id: productId, name: product.name };
  } else {
    // Preserve financial and invoice history by archiving
    await prisma.product.update({
      where: { id: productId },
      data: {
        isArchived: true,
        stock: 0
      }
    });

    return { action: 'ARCHIVED', id: productId, name: product.name, orderCount };
  }
}

/**
 * Bulk delete guarded products
 */
export async function deleteGuardedProductsBulk(productIds) {
  let deletedCount = 0;
  let archivedCount = 0;
  const results = [];

  for (const id of productIds) {
    try {
      const res = await deleteGuardedProduct(id);
      results.push(res);
      if (res.action === 'DELETED') deletedCount++;
      if (res.action === 'ARCHIVED') archivedCount++;
    } catch (err) {
      results.push({ action: 'ERROR', id, error: err.message });
    }
  }

  return {
    success: true,
    total: productIds.length,
    deletedCount,
    archivedCount,
    summaryMessage: `${deletedCount} کالا به طور کامل حذف شد و ${archivedCount} کالا به دلیل داشتن سابقه فاکتور به بایگانی منتقل شد.`,
    results
  };
}
