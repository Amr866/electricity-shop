import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test('Phase 10 Seam 1: Product with zero orders is hard-deleted', async () => {
  // Setup: create temporary product with 0 orders
  const cat = await prisma.category.findFirst();
  assert.ok(cat, 'Category must exist');

  const zeroProd = await prisma.product.create({
    data: {
      name: 'کالای تستی بدون سفارش جهت حذف',
      slug: 'test-zero-order-delete-' + Date.now(),
      description: 'تست حذف سخت',
      price: 100000,
      stock: 5,
      categoryId: cat.id,
    }
  });

  // Call the guarded deletion logic
  const { deleteGuardedProduct } = await import('../src/lib/admin-product-guard.js');
  const result = await deleteGuardedProduct(zeroProd.id);

  assert.equal(result.action, 'DELETED', 'Zero-order product must be DELETED');

  const found = await prisma.product.findUnique({ where: { id: zeroProd.id } });
  assert.equal(found, null, 'Product must be hard-deleted from database');
});

test('Phase 10 Seam 2: Product with existing orders transitions to isArchived: true', async () => {
  const cat = await prisma.category.findFirst();
  assert.ok(cat, 'Category must exist');

  const orderedProd = await prisma.product.create({
    data: {
      name: 'کالای دارای سابقه فاکتور جهت تست آرشیو',
      slug: 'test-ordered-archive-' + Date.now(),
      description: 'تست آرشیو به جای حذف',
      price: 250000,
      stock: 12,
      categoryId: cat.id,
    }
  });

  // Create an order referencing this product
  const order = await prisma.order.create({
    data: {
      orderNumber: 'SH-TEST-' + Date.now(),
      customerName: 'مشتری تستی',
      customerPhone: '09131112233',
      address: 'اصفهان، نجف‌آباد',
      shippingMethod: 'najafabad_pickup',
      paymentMethod: 'cod_isfahan',
      subtotal: 250000,
      totalAmount: 250000,
      items: {
        create: {
          productId: orderedProd.id,
          productName: orderedProd.name,
          price: orderedProd.price,
          quantity: 1,
          total: orderedProd.price
        }
      }
    }
  });

  const { deleteGuardedProduct } = await import('../src/lib/admin-product-guard.js');
  const result = await deleteGuardedProduct(orderedProd.id);

  assert.equal(result.action, 'ARCHIVED', 'Ordered product must be ARCHIVED, not hard-deleted');

  const found = await prisma.product.findUnique({ where: { id: orderedProd.id } });
  assert.ok(found, 'Product must still exist in database');
  assert.equal(found.isArchived, true, 'Product isArchived must be true');
  assert.equal(found.stock, 0, 'Product stock must be set to 0');

  // Clean up order
  await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
  await prisma.order.delete({ where: { id: order.id } });
  await prisma.product.delete({ where: { id: orderedProd.id } });
});
