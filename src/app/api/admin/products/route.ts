import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/adminAuth";
import { deleteGuardedProduct, deleteGuardedProductsBulk } from "@/lib/admin-product-guard";

const LOCAL_FALLBACK_IMAGE = "/uploads/products/wal_172619-fans-7995865_1920.jpg";

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
      priceUnit,
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
        priceUnit: priceUnit ? String(priceUnit).trim() : null,
        isFeatured: Boolean(isFeatured),
        isBestSeller: Boolean(isBestSeller),
        isIsfahanFast: isIsfahanFast !== undefined ? Boolean(isIsfahanFast) : true,
        images: {
          create: [
            {
              url: imageUrl || LOCAL_FALLBACK_IMAGE,
              isPrimary: true,
            },
          ],
        },
      },
      include: {
        category: true,
        images: true,
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

export async function PUT(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const data = await req.json();
    const {
      id,
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
      priceUnit,
    } = data;

    if (!id) {
      return NextResponse.json(
        { message: "شناسه محصول الزامی است." },
        { status: 400 }
      );
    }

    // Prepare update data object
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (slug !== undefined) updateData.slug = slug.trim().toLowerCase().replace(/\s+/g, "-");
    if (sku !== undefined) updateData.sku = sku || null;
    if (shortDesc !== undefined) updateData.shortDesc = shortDesc || null;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseInt(price, 10);
    if (originalPrice !== undefined) {
      updateData.originalPrice = originalPrice ? parseInt(originalPrice, 10) : null;
    }
    if (discountPercent !== undefined) {
      updateData.discountPercent = discountPercent ? parseInt(discountPercent, 10) : 0;
    }
    if (stock !== undefined) updateData.stock = parseInt(stock, 10);
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (brand !== undefined) updateData.brand = brand || null;
    if (warranty !== undefined) updateData.warranty = warranty || "گارانتی اصالت و سلامت فیزیکی";
    if (madeIn !== undefined) updateData.madeIn = madeIn || "ایران";
    if (priceUnit !== undefined) updateData.priceUnit = priceUnit ? String(priceUnit).trim() : null;
    if (isFeatured !== undefined) updateData.isFeatured = Boolean(isFeatured);
    if (isBestSeller !== undefined) updateData.isBestSeller = Boolean(isBestSeller);
    if (isIsfahanFast !== undefined) updateData.isIsfahanFast = Boolean(isIsfahanFast);

    // Update product in DB
    const product = await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        images: true,
      },
    });

    // If imageUrl is provided, update or create the primary image
    if (imageUrl) {
      const primaryImage = product.images.find((img) => img.isPrimary) || product.images[0];
      if (primaryImage) {
        await prisma.productImage.update({
          where: { id: primaryImage.id },
          data: { url: imageUrl },
        });
      } else {
        await prisma.productImage.create({
          data: {
            url: imageUrl,
            isPrimary: true,
            productId: id,
          },
        });
      }
    }

    const updatedProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: error.message || "خطا در ویرایش محصول." },
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

    // Check if JSON body provided for bulk deletion
    let body: any = null;
    try {
      body = await req.json();
    } catch {
      // Body not JSON or empty
    }

    if (body?.ids && Array.isArray(body.ids)) {
      const result = await deleteGuardedProductsBulk(body.ids);
      return NextResponse.json(result);
    }

    const targetId = id || body?.id;
    if (!targetId) {
      return NextResponse.json({ message: "شناسه محصول ارسال نشده است." }, { status: 400 });
    }

    const result = await deleteGuardedProduct(targetId);
    return NextResponse.json({
      success: true,
      ...result,
      message:
        result.action === "DELETED"
          ? "کالا به همراه تصاویر با موفقیت به طور کامل حذف شد."
          : "کالا به دلیل داشتن سابقه فاکتور خرید به بایگانی منتقل شد و از ویترین عمومی حذف گردید."
    });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: error.message || "خطا در حذف محصول." }, { status: 500 });
  }
}
