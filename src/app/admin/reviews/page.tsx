import React from "react";
import { prisma } from "@/lib/prisma";
import { ReviewsAdminClient, type AdminReviewItem } from "./ReviewsAdminClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت نظرات خریداران | پنل مدیریت فروشگاه شیاسی",
};

interface AdminReviewsPageProps {
  searchParams: Promise<{
    productId?: string;
    status?: string;
  }>;
}

export default async function AdminReviewsPage({ searchParams }: AdminReviewsPageProps) {
  const resolvedParams = await searchParams;
  const productId = resolvedParams.productId;

  const baseFilter = productId ? { productId } : {};

  const [reviews, total, pending, verified] = await Promise.all([
    prisma.review.findMany({
      where: baseFilter,
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            rating: true,
            reviewCount: true,
            images: {
              where: { isPrimary: true },
              take: 1,
              select: { url: true },
            },
          },
        },
      },
    }),
    prisma.review.count({ where: baseFilter }),
    prisma.review.count({ where: { ...baseFilter, isVerified: false } }),
    prisma.review.count({ where: { ...baseFilter, isVerified: true } }),
  ]);

  return (
    <ReviewsAdminClient
      initialReviews={reviews as unknown as AdminReviewItem[]}
      initialStats={{
        total,
        pending,
        verified,
      }}
      initialProductId={productId}
    />
  );
}
