import fs from 'node:fs';
import path from 'node:path';
import { prisma } from '@/lib/prisma';

export interface GuardedDeleteResult {
  action: 'DELETED' | 'ARCHIVED';
  id: string;
  name: string;
  orderCount?: number;
}

export interface BulkGuardedDeleteResult {
  success: boolean;
  total: number;
  deletedCount: number;
  archivedCount: number;
  summaryMessage: string;
  results: (GuardedDeleteResult | { action: 'ERROR'; id: string; error: string })[];
}

export async function deleteGuardedProduct(productId: string): Promise<GuardedDeleteResult> {
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
    const imagesToClean = product.images.map(img => img.url);

    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId } }),
      prisma.productSpec.deleteMany({ where: { productId } }),
      prisma.review.deleteMany({ where: { productId } }),
      prisma.product.delete({ where: { id: productId } })
    ]);

    for (const imgUrl of imagesToClean) {
      if (imgUrl.startsWith('/uploads/products/')) {
        const filePath = path.join(process.cwd(), 'public', imgUrl);
        const otherUse = await prisma.productImage.findFirst({
          where: { url: imgUrl }
        });
        if (!otherUse && fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch {
            // Ignore file unlink error
          }
        }
      }
    }

    return { action: 'DELETED', id: productId, name: product.name };
  } else {
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

export async function deleteGuardedProductsBulk(productIds: string[]): Promise<BulkGuardedDeleteResult> {
  let deletedCount = 0;
  let archivedCount = 0;
  const results: (GuardedDeleteResult | { action: 'ERROR'; id: string; error: string })[] = [];

  for (const id of productIds) {
    try {
      const res = await deleteGuardedProduct(id);
      results.push(res);
      if (res.action === 'DELETED') deletedCount++;
      if (res.action === 'ARCHIVED') archivedCount++;
    } catch (err: any) {
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
