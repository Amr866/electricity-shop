import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
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
        sortOrder: sortOrder ? parseInt(sortOrder, 10) : 0,
      },
    });

    return NextResponse.json({ success: true, category });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json({ message: error.message || "خطا در ایجاد دسته‌بندی." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "شناسه دسته‌بندی الزامی است." }, { status: 400 });
    }

    await prisma.category.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return NextResponse.json({ message: "خطا در حذف دسته‌بندی." }, { status: 500 });
  }
}
