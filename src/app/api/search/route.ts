import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    if (!query.trim()) {
      return NextResponse.json({ products: [], categories: [] });
    }

    const cleanQuery = query.trim();

    const [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: cleanQuery, mode: "insensitive" } },
            { brand: { contains: cleanQuery, mode: "insensitive" } },
            { description: { contains: cleanQuery, mode: "insensitive" } },
            { shortDesc: { contains: cleanQuery, mode: "insensitive" } },
          ],
        },
        take: 6,
        include: {
          category: true,
          images: true,
        },
      }),
      prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: cleanQuery, mode: "insensitive" } },
            { description: { contains: cleanQuery, mode: "insensitive" } },
          ],
        },
        take: 3,
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
        categoryName: p.category.name,
        categorySlug: p.category.slug,
        image:
          p.images.find((img) => img.isPrimary)?.url ||
          p.images[0]?.url ||
          "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      })),
      categories,
    });
  } catch (error: any) {
    console.error("Search API error:", error);
    return NextResponse.json({ products: [], categories: [] });
  }
}
