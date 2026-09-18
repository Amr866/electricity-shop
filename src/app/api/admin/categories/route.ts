import { NextRequest, NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { checkAdminSession } from "@/lib/adminAuth";

export async function POST(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { name, slug, description, icon, image, sortOrder } = await req.json();

    if (!name || !slug) {
      return NextResponse.json({ message: "نام و نامک دسته‌بندی الزامی هستند." }, { status: 400 });
    }

    const cleanSlug = slug.trim().toLowerCase().replace(/\s+/g, "-");

    const category = await prisma.category.create({
      data: {
        name,
        slug: cleanSlug,
        description: description || null,
        icon: icon || "Zap",
        image: image || null,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder, 10) : 0,
      },
    });

    try {
      revalidateTag("catalog-metadata");
      revalidatePath("/products");
      revalidatePath("/categories");
      revalidatePath(`/categories/${cleanSlug}`);
    } catch (revalErr) {
      console.warn("[Revalidation Warning on Category Create]", revalErr);
    }

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json({ message: error.message || "خطا در ایجاد دسته‌بندی." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { id, name, slug, description, icon, image, sortOrder } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "شناسه دسته‌بندی الزامی است." }, { status: 400 });
    }

    const cleanSlug = slug ? slug.trim().toLowerCase().replace(/\s+/g, "-") : undefined;

    const category = await prisma.category.update({
      where: { id },
      data: {
        name: name !== undefined ? name : undefined,
        slug: cleanSlug,
        description: description !== undefined ? description : undefined,
        icon: icon !== undefined ? icon : undefined,
        image: image !== undefined ? image : undefined,
        sortOrder: sortOrder !== undefined ? parseInt(sortOrder, 10) : undefined,
      },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    try {
      revalidateTag("catalog-metadata");
      revalidatePath("/products");
      revalidatePath("/categories");
      revalidatePath(`/categories/${category.slug}`);
    } catch (revalErr) {
      console.warn("[Revalidation Warning on Category Update]", revalErr);
    }

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("Error updating category:", error);
    return NextResponse.json({ message: error.message || "خطا در به‌روزرسانی دسته‌بندی." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const { isAdmin, response } = await checkAdminSession();
  if (!isAdmin) return response!;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "شناسه دسته‌بندی الزامی است." }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });

    try {
      revalidateTag("catalog-metadata");
      revalidatePath("/products");
      revalidatePath("/categories");
    } catch (revalErr) {
      console.warn("[Revalidation Warning on Category Delete]", revalErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ message: "خطا در حذف دسته‌بندی." }, { status: 500 });
  }
}

