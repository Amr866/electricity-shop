import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";

export interface CachedCategoryWithCount {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  icon: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
  _count: {
    products: number;
  };
}

export interface CatalogMetadata {
  categories: CachedCategoryWithCount[];
  brands: string[];
}

/**
 * Direct database fetcher for active categories with product counts and distinct brands.
 */
export async function fetchCatalogMetadata(): Promise<CatalogMetadata> {
  const [categories, brandRows] = await Promise.all([
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: {
        _count: { select: { products: { where: { isArchived: false } } } },
      },
    }),
    prisma.product.findMany({
      where: { isArchived: false, brand: { not: null } },
      select: { brand: true },
      distinct: ["brand"],
    }),
  ]);

  const brands = brandRows
    .map((p) => p.brand)
    .filter((b): b is string => Boolean(b && b.trim().length > 0));

  return { categories, brands };
}

const cachedFn = unstable_cache(
  fetchCatalogMetadata,
  ["catalog-metadata-cache"],
  {
    tags: ["catalog-metadata"],
    revalidate: 3600, // 1 hour TTL fallback if not invalidated on-demand
  }
);

/**
 * Retrieves cached categories and brands with on-demand tag revalidation support.
 * Gracefully falls back to direct database query if called outside Next.js incrementalCache context.
 */
export async function getCachedCatalogMetadata(): Promise<CatalogMetadata> {
  try {
    return await cachedFn();
  } catch (err: any) {
    if (err?.message?.includes("incrementalCache missing")) {
      return await fetchCatalogMetadata();
    }
    throw err;
  }
}
