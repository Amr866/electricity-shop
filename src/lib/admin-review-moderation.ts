import { prisma } from "@/lib/prisma";

export interface ModerateReviewResult {
  review: {
    id: string;
    authorName: string;
    isVerified: boolean;
    rating: number;
    comment: string;
    productId: string;
  };
  product: {
    id: string;
    name: string;
    rating: number;
    reviewCount: number;
  };
}

export interface DeleteReviewResult {
  success: boolean;
  product: {
    id: string;
    rating: number;
    reviewCount: number;
  };
}

export interface BulkDeleteReviewsResult {
  success: boolean;
  deletedCount: number;
}

/**
 * Recomputes the average rating and verified review count for a product
 * based strictly on reviews where `isVerified === true`.
 */
export async function recomputeProductRating(productId: string, tx: any = prisma) {
  const verifiedReviews = await tx.review.findMany({
    where: { productId, isVerified: true },
    select: { rating: true },
  });

  const reviewCount = verifiedReviews.length;
  const rating =
    reviewCount > 0
      ? Number((verifiedReviews.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0) / reviewCount).toFixed(1))
      : 5.0;

  const product = await tx.product.update({
    where: { id: productId },
    data: { rating, reviewCount },
  });

  return product;
}

/**
 * Moderates a review (approves or unpublishes) and updates product rating atomically.
 */
export async function moderateReview(reviewId: string, isVerified: boolean): Promise<ModerateReviewResult> {
  return await prisma.$transaction(async (tx: any) => {
    const updatedReview = await tx.review.update({
      where: { id: reviewId },
      data: { isVerified: Boolean(isVerified) },
      select: {
        id: true,
        authorName: true,
        isVerified: true,
        rating: true,
        comment: true,
        productId: true,
      },
    });

    const updatedProduct = await recomputeProductRating(updatedReview.productId, tx);

    return {
      review: updatedReview,
      product: updatedProduct,
    };
  });
}

/**
 * Permanently deletes a review and recomputes the product rating atomically.
 */
export async function deleteReviewWithRecalc(reviewId: string): Promise<DeleteReviewResult> {
  return await prisma.$transaction(async (tx: any) => {
    const review = await tx.review.findUnique({
      where: { id: reviewId },
      select: { id: true, productId: true },
    });

    if (!review) {
      throw new Error("نظر مورد نظر یافت نشد.");
    }

    await tx.review.delete({
      where: { id: reviewId },
    });

    const updatedProduct = await recomputeProductRating(review.productId, tx);

    return {
      success: true,
      product: updatedProduct,
    };
  });
}

/**
 * Bulk deletes reviews and recomputes ratings for all affected products.
 */
export async function deleteReviewsBulkWithRecalc(reviewIds: string[]): Promise<BulkDeleteReviewsResult> {
  return await prisma.$transaction(async (tx: any) => {
    const reviews = await tx.review.findMany({
      where: { id: { in: reviewIds } },
      select: { id: true, productId: true },
    });

    const productIds: string[] = Array.from(new Set(reviews.map((r: { productId: string }) => r.productId)));

    const deleteResult = await tx.review.deleteMany({
      where: { id: { in: reviewIds } },
    });

    for (const prodId of productIds) {
      await recomputeProductRating(prodId, tx);
    }

    return {
      success: true,
      deletedCount: deleteResult.count,
    };
  });
}
