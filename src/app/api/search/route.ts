import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function cleanPersianTokens(query: string): string[] {
  if (!query) return [];
  return query
    .replace(/[\u200C\u200B\u200E\u200F]/g, " ")
    .replace(/[ي]/g, "ی")
    .replace(/[ك]/g, "ک")
    .replace(/[ة]/g, "ه")
    .split(/[\s,،\-–_+*]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ products: [], categories: [] });
    }

    const tokens = cleanPersianTokens(query);
    if (tokens.length === 0) {
      return NextResponse.json({ products: [], categories: [] });
    }

    // Every token must match somewhere in the product (AND across tokens, OR across fields)
    const productWhere: any = {
      AND: tokens.map((token) => ({
        OR: [
          { name: { contains: token, mode: "insensitive" } },
          { brand: { contains: token, mode: "insensitive" } },
          { shortDesc: { contains: token, mode: "insensitive" } },
          { description: { contains: token, mode: "insensitive" } },
          { sku: { contains: token, mode: "insensitive" } },
          { category: { name: { contains: token, mode: "insensitive" } } },
        ],
      })),
    };

    const categoryWhere: any = {
      OR: tokens.map((token) => ({
        OR: [
          { name: { contains: token, mode: "insensitive" } },
          { description: { contains: token, mode: "insensitive" } },
          { slug: { contains: token, mode: "insensitive" } },
        ],
      })),
    };

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: productWhere,
        take: 8,
        include: {
          category: true,
          images: true,
        },
      }),
      prisma.category.findMany({
        where: categoryWhere,
        take: 4,
      }),
    ]);

    return NextResponse.json({
      products: products.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        originalPrice: p.originalPrice,
        brand: p.brand,
        categoryName: p.category?.name,
        categorySlug: p.category?.slug,
        image:
          p.images.find((img) => img.isPrimary)?.url ||
          p.images[0]?.url ||
          "/images/products/wal_172619-fans-7995865_1920.jpg",
      })),
      categories,
    });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ products: [], categories: [] });
  }
}
