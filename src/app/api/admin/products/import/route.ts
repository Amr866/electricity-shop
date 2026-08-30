import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const body = await req.json();
    const { products } = body;

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json(
        { error: "لیست محصولات برای بارگذاری معتبر نمی‌باشد." },
        { status: 400 }
      );
    }

    let createdCount = 0;
    let updatedCount = 0;

    for (const item of products) {
      if (!item.name || !item.price) continue;

      // Find or create category
      const categorySlug = item.categorySlug || "home-appliances-cooling-heating";
      const categoryName = item.categoryName || "پنکه، کولر و بخاری برقی";

      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: {},
        create: {
          name: categoryName,
          slug: categorySlug,
        },
      });

      // Generate unique slug
      const baseSlug = item.slug || item.name.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\u0600-\u06FFa-z0-9\-]/g, "");
      const productSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

      // Upsert by SKU or Create
      if (item.sku) {
        const existing = await prisma.product.findUnique({
          where: { sku: item.sku },
        });

        if (existing) {
          await prisma.product.update({
            where: { id: existing.id },
            data: {
              name: item.name,
              price: Number(item.price),
              stock: Number(item.stock || 10),
              brand: item.brand || existing.brand,
              shortDesc: item.shortDesc || existing.shortDesc,
            },
          });
          updatedCount++;
          continue;
        }
      }

      await prisma.product.create({
        data: {
          name: item.name,
          slug: productSlug,
          sku: item.sku || `SKU-${Date.now().toString().slice(-6)}`,
          price: Number(item.price),
          originalPrice: item.originalPrice ? Number(item.originalPrice) : null,
          discountPercent: item.discountPercent ? Number(item.discountPercent) : 0,
          stock: Number(item.stock || 10),
          brand: item.brand || "متفرقه",
          madeIn: item.madeIn || "ایران",
          categoryId: category.id,
          shortDesc: item.shortDesc || "عرضه مستقیم با گارانتی و ضمانت اصالت فیزیکی کالا در فروشگاه شیاسی نجف‌آباد.",
          description: item.description || item.shortDesc,
        },
      });

      createdCount++;
    }

    return NextResponse.json({
      success: true,
      message: `${createdCount} کالا با موفقیت ایجاد و ${updatedCount} کالا به‌روزرسانی شدند.`,
      createdCount,
      updatedCount,
    });
  } catch (error: any) {
    console.error("Error importing products bulk:", error);
    return NextResponse.json(
      { error: "خطا در پردازش و ذخیره اطلاعات اکسل در دیتابیس." },
      { status: 500 }
    );
  }
}
