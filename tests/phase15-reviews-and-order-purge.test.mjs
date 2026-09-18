import test from 'node:test';
import assert from 'node:assert/strict';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

test('Phase 15 Seam 1: Product pricing unit (priceUnit) persistence and nullability', async () => {
  const cat = await prisma.category.findFirst();
  assert.ok(cat, 'Category must exist');

  // 1. Create product with priceUnit = 'متر'
  const prod = await prisma.product.create({
    data: {
      name: 'سیم نایلون ۲ در ۰.۷۵ صوتی',
      slug: 'test-wire-price-unit-' + Date.now(),
      description: 'تست فیلد واحد قیمت',
      price: 25000,
      priceUnit: 'متر',
      categoryId: cat.id,
    }
  });

  assert.equal(prod.priceUnit, 'متر', 'Product priceUnit must persist as متر');

  // 2. Update product to different preset unit
  const updated = await prisma.product.update({
    where: { id: prod.id },
    data: { priceUnit: 'کلاف' }
  });
  assert.equal(updated.priceUnit, 'کلاف', 'Product priceUnit must update to کلاف');

  // 3. Clear priceUnit to null (optional)
  const cleared = await prisma.product.update({
    where: { id: prod.id },
    data: { priceUnit: null }
  });
  assert.equal(cleared.priceUnit, null, 'Product priceUnit must be nullable when omitted');

  // Cleanup
  await prisma.product.delete({ where: { id: prod.id } });
});

test('Phase 15 Seam 2: Review moderation updates verified status and recalculates product rating', async () => {
  const cat = await prisma.category.findFirst();
  assert.ok(cat, 'Category must exist');

  // Setup test product
  const prod = await prisma.product.create({
    data: {
      name: 'محصول تست مدیریت نظرات',
      slug: 'test-product-reviews-' + Date.now(),
      description: 'تست نظرات',
      price: 50000,
      rating: 5.0,
      reviewCount: 0,
      categoryId: cat.id,
    }
  });

  // 1. New review created with isVerified: false (Pending)
  const pendingReview = await prisma.review.create({
    data: {
      authorName: 'مشتری آزمایشی',
      city: 'نجف‌آباد',
      rating: 3,
      comment: 'کیفیت معمولی بود و دیر رسید.',
      isVerified: false,
      productId: prod.id,
    }
  });

  assert.equal(pendingReview.isVerified, false, 'New customer review must default to unverified/pending');

  // Import review moderation helper
  const { moderateReview, deleteReviewWithRecalc } = await import('../src/lib/admin-review-moderation.js');

  // 2. Approve review (isVerified: true)
  const approved = await moderateReview(pendingReview.id, true);
  assert.equal(approved.review.isVerified, true, 'Review must be approved');
  assert.equal(approved.product.rating, 3.0, 'Product rating must recalculate to 3.0');
  assert.equal(approved.product.reviewCount, 1, 'Product reviewCount must be 1');

  // 3. Add second approved review (rating 5)
  const review2 = await prisma.review.create({
    data: {
      authorName: 'مشتری دوم',
      city: 'اصفهان',
      rating: 5,
      comment: 'بسیار عالی و باکیفیت',
      isVerified: true,
      productId: prod.id,
    }
  });

  // Recalculate rating with 2 reviews (3 and 5 => avg 4.0)
  const recalc = await moderateReview(review2.id, true);
  assert.equal(recalc.product.rating, 4.0, 'Average of (3 + 5) must be 4.0');
  assert.equal(recalc.product.reviewCount, 2, 'Total verified reviews must be 2');

  // 4. Unpublish first review (isVerified: false)
  const unpublished = await moderateReview(pendingReview.id, false);
  assert.equal(unpublished.review.isVerified, false, 'Review must be unverified');
  assert.equal(unpublished.product.rating, 5.0, 'Rating must return to 5.0 for the remaining verified review');
  assert.equal(unpublished.product.reviewCount, 1, 'Verified count must drop to 1');

  // 5. Delete review permanently
  const deleteResult = await deleteReviewWithRecalc(review2.id);
  assert.equal(deleteResult.success, true, 'Review deletion must succeed');
  assert.equal(deleteResult.product.reviewCount, 0, 'Review count must be 0 after deleting only verified review');

  // Cleanup
  await prisma.product.delete({ where: { id: prod.id } });
});

test('Phase 15 Seam 3: Total order purge cascade deletes all order items and orders cleanly', async () => {
  const cat = await prisma.category.findFirst();
  const prod = await prisma.product.create({
    data: {
      name: 'محصول تست حذف سفارشات',
      slug: 'test-order-product-' + Date.now(),
      description: 'محصول موقت',
      price: 80000,
      categoryId: cat.id,
    }
  });

  // Create two sample orders with order items
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'SH-TEST-001-' + Date.now(),
      customerName: 'کاربر تستی ۱',
      customerPhone: '09131112233',
      address: 'خیابان شریعتی نجف آباد',
      shippingMethod: 'courier_najafabad',
      paymentMethod: 'cod',
      subtotal: 80000,
      totalAmount: 80000,
      items: {
        create: [
          {
            productId: prod.id,
            productName: prod.name,
            price: 80000,
            quantity: 1,
            total: 80000,
          }
        ]
      }
    }
  });

  const order2 = await prisma.order.create({
    data: {
      orderNumber: 'SH-TEST-002-' + Date.now(),
      customerName: 'کاربر تستی ۲',
      customerPhone: '09134445566',
      address: 'خیابان میرداماد اصفهان',
      shippingMethod: 'snapp_isfahan',
      paymentMethod: 'card_to_card',
      subtotal: 160000,
      totalAmount: 160000,
      items: {
        create: [
          {
            productId: prod.id,
            productName: prod.name,
            price: 80000,
            quantity: 2,
            total: 160000,
          }
        ]
      }
    }
  });

  // Import order purge helper
  const { purgeAllOrdersCascade } = await import('../src/lib/admin-order-purge.js');

  // Execute purge of these specific test order IDs
  const purgeResult = await purgeAllOrdersCascade([order1.id, order2.id]);
  assert.equal(purgeResult.deletedCount, 2, 'Should have purged 2 orders');

  // Verify orders and order items no longer exist
  const remainingOrder1 = await prisma.order.findUnique({ where: { id: order1.id } });
  const remainingOrder2 = await prisma.order.findUnique({ where: { id: order2.id } });
  assert.equal(remainingOrder1, null, 'Order 1 must be deleted');
  assert.equal(remainingOrder2, null, 'Order 2 must be deleted');

  const items = await prisma.orderItem.findMany({
    where: { orderId: { in: [order1.id, order2.id] } }
  });
  assert.equal(items.length, 0, 'All order items must be cascade deleted');

  // Cleanup
  await prisma.product.delete({ where: { id: prod.id } });
});

test('Phase 15 Seam 4: Bulk reviews deletion recalculates ratings accurately for multiple products', async () => {
  const cat = await prisma.category.findFirst();
  const prodA = await prisma.product.create({
    data: {
      name: 'محصول الف تست حذف گروهی',
      slug: 'test-bulk-a-' + Date.now(),
      description: 'تست',
      price: 10000,
      categoryId: cat.id,
    }
  });
  const prodB = await prisma.product.create({
    data: {
      name: 'محصول ب تست حذف گروهی',
      slug: 'test-bulk-b-' + Date.now(),
      description: 'تست',
      price: 20000,
      categoryId: cat.id,
    }
  });

  const revA1 = await prisma.review.create({
    data: { authorName: 'کاربر ۱', productId: prodA.id, rating: 5, comment: 'عالی', isVerified: true }
  });
  const revA2 = await prisma.review.create({
    data: { authorName: 'کاربر ۲', productId: prodA.id, rating: 3, comment: 'متوسط', isVerified: true }
  });
  const revB1 = await prisma.review.create({
    data: { authorName: 'کاربر ۳', productId: prodB.id, rating: 2, comment: 'ضعیف', isVerified: true }
  });

  const { deleteReviewsBulkWithRecalc, recomputeProductRating } = await import('../src/lib/admin-review-moderation.js');

  await recomputeProductRating(prodA.id);
  await recomputeProductRating(prodB.id);

  const beforeA = await prisma.product.findUnique({ where: { id: prodA.id } });
  assert.equal(beforeA.reviewCount, 2);
  assert.equal(beforeA.rating, 4.0);

  // Bulk delete revA2 and revB1
  const bulkRes = await deleteReviewsBulkWithRecalc([revA2.id, revB1.id]);
  assert.equal(bulkRes.deletedCount, 2);

  const afterA = await prisma.product.findUnique({ where: { id: prodA.id } });
  assert.equal(afterA.reviewCount, 1);
  assert.equal(afterA.rating, 5.0);

  const afterB = await prisma.product.findUnique({ where: { id: prodB.id } });
  assert.equal(afterB.reviewCount, 0);
  assert.equal(afterB.rating, 5.0); // Defaults to 5.0 when 0 reviews

  // Cleanup
  await prisma.product.delete({ where: { id: prodA.id } });
  await prisma.product.delete({ where: { id: prodB.id } });
});

test('Phase 15 Seam 5: Empty array safeguard prevents accidental total order purge', async () => {
  const { purgeAllOrdersCascade } = await import('../src/lib/admin-order-purge.js');

  const cat = await prisma.category.findFirst();
  const prod = await prisma.product.create({
    data: {
      name: 'محصول موقت تست گارد آرایه خالی',
      slug: 'test-guard-prod-' + Date.now(),
      description: 'تست گارد حذف سفارشات',
      price: 10000,
      categoryId: cat.id,
    }
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: 'SH-KEEP-' + Date.now(),
      customerName: 'کاربر محافظت‌شده',
      customerPhone: '09139998877',
      address: 'خیابان امام خمینی اصفهان',
      shippingMethod: 'courier_najafabad',
      paymentMethod: 'cod',
      subtotal: 10000,
      totalAmount: 10000,
      items: {
        create: [
          {
            productId: prod.id,
            productName: prod.name,
            price: 10000,
            quantity: 1,
            total: 10000,
          }
        ]
      }
    }
  });

  // Call purgeAllOrdersCascade with empty array []
  const safeRes = await purgeAllOrdersCascade([]);
  assert.equal(safeRes.deletedCount, 0, 'Passing empty array must delete 0 orders');
  assert.equal(safeRes.itemsDeleted, 0, 'Passing empty array must delete 0 items');

  // Verify order still exists
  const existingOrder = await prisma.order.findUnique({ where: { id: order.id } });
  assert.ok(existingOrder, 'Order must not be purged when empty array is passed');

  // Specific ID purge works
  const specificRes = await purgeAllOrdersCascade([order.id]);
  assert.equal(specificRes.deletedCount, 1, 'Targeted purge must delete exactly 1 order');

  // Cleanup
  await prisma.product.delete({ where: { id: prod.id } });
});
