import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Recomputes the average rating and verified review count for a product
 * based strictly on reviews where `isVerified === true`.
 *
 * @param {string} productId
 * @param {any} [tx] Optional Prisma transaction client
 */
export async function recomputeProductRating(productId, tx = prisma) {
  const verifiedReviews = await tx.review.findMany({
    where: { productId, isVerified: true },
    select: { rating: true }
  });

  const reviewCount = verifiedReviews.length;
  const rating = reviewCount > 0
    ? Number((verifiedReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount).toFixed(1))
    : 5.0;

  const product = await tx.product.update({
    where: { id: productId },
    data: { rating, reviewCount }
  });

  return product;
}

/**
 * Moderates a review (approves or unpublishes) and updates product rating atomically.
 *
 * @param {string} reviewId
 * @param {boolean} isVerified
 */
export async function moderateReview(reviewId, isVerified) {
  return await prisma.$transaction(async (tx) => {
    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: { isVerified: Boolean(isVerified) }
    });

    const updatedProduct = await recomputeProductRating(updatedReview.productId, tx);

    return {
      review: updatedReview,
      product: updatedProduct
    };
  });
}

/**
 * Permanently deletes a review and recomputes the product rating atomically.
 *
 * @param {string} reviewId
 */
export async function deleteReviewWithRecalc(reviewId) {
  return await prisma.$transaction(async (tx) => {
    const review = await tx.review.findUnique({
      where: { id: reviewId },
      select: { id: true, productId: true }
    });

    if (!review) {
      throw new Error('Review not found');
    }

    await tx.review.delete({
      where: { id: reviewId }
    });

    const updatedProduct = await recomputeProductRating(review.productId, tx);

    return {
      success: true,
      product: updatedProduct
    };
  });
}

/**
 * Bulk deletes reviews and recomputes ratings for all affected products.
 *
 * @param {string[]} reviewIds
 */
export async function deleteReviewsBulkWithRecalc(reviewIds) {
  if (!reviewIds || reviewIds.length === 0) {
    return { success: true, deletedCount: 0 };
  }
  return await prisma.$transaction(async (tx) => {
    const reviews = await tx.review.findMany({
      where: { id: { in: reviewIds } },
      select: { id: true, productId: true }
    });

    const productIds = [...new Set(reviews.map(r => r.productId))];

    const deleteResult = await tx.review.deleteMany({
      where: { id: { in: reviewIds } }
    });

    for (const prodId of productIds) {
      await recomputeProductRating(prodId, tx);
    }

    return {
      success: true,
      deletedCount: deleteResult.count
    };
  });
}
