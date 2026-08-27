import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const data = await req.json();
    const {
      name,
      slug,
      sku,
      shortDesc,
      description,
      price,
      originalPrice,
      discountPercent,
      stock,
      categoryId,
      brand,
      warranty,
      madeIn,
      isFeatured,
      isBestSeller,
      isIsfahanFast,
      imageUrl,
    } = data;

    if (!name || !slug || !price || !categoryId) {
      return NextResponse.json(
        { message: "نام، نامک، قیمت و دسته‌بندی الزامی هستند." },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
        sku: sku || null,
        shortDesc: shortDesc || null,
        description: description || name,
        price: parseInt(price, 10),
        originalPrice: originalPrice ? parseInt(originalPrice, 10) : null,
        discountPercent: discountPercent ? parseInt(discountPercent, 10) : 0,
        stock: parseInt(stock, 10) || 10,
        categoryId,
        brand: brand || null,
        warranty: warranty || "گارانتی اصالت و سلامت فیزیکی",
        madeIn: madeIn || "ایران",
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isIsfahanFast: isIsfahanFast !== undefined ? Boolean(isIsfahanFast) : true,
        images: {
          create: [
            {
              url:
                imageUrl ||
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
              isPrimary: true,
            },
          ],
        },
      },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { message: error.message || "خطا در ایجاد محصول." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "شناسه محصول ارسال نشده است." }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "خطا در حذف محصول." }, { status: 500 });
  }
}
