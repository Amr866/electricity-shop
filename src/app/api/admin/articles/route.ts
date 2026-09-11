import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "عدم دسترسی مجاز" }, { status: 401 });
    }

    const articles = await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json(
      { error: "خطا در دریافت مقالات" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "عدم دسترسی مجاز" }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      slug,
      summary,
      content,
      category,
      tags,
      readTime,
      image,
      authorName,
      isPublished,
    } = body;

    if (!title || !slug || !content || !category) {
      return NextResponse.json(
        { error: "عنوان، نامک (اسلاگ)، دسته‌بندی و متن مقاله الزامی هستند." },
        { status: 400 }
      );
    }

    // Clean and validate slug
    const cleanSlug = slug
      .trim()
      .toLowerCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^\w\u0600-\u06FF-]+/g, "");

    const existing = await prisma.article.findUnique({
      where: { slug: cleanSlug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "این نامک (Slug) قبلاً استفاده شده است. لطفاً نامک دیگری انتخاب کنید." },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title: title.trim(),
        slug: cleanSlug,
        summary: summary ? summary.trim() : title.trim(),
        content: content.trim(),
        category: category.trim(),
        tags: Array.isArray(tags) ? tags.join(", ") : (tags || "").trim(),
        readTime: readTime ? readTime.trim() : "۵ دقیقه مطالعه",
        image: image
          ? image.trim()
          : "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80",
        authorName: authorName ? authorName.trim() : "کارشناس فنی فروشگاه شیاسی",
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    });

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: "خطا در ایجاد مقاله" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "عدم دسترسی مجاز" }, { status: 401 });
    }

    const body = await req.json();
    const {
      id,
      title,
      slug,
      summary,
      content,
      category,
      tags,
      readTime,
      image,
      authorName,
      isPublished,
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: "شناسه مقاله الزامی است." },
        { status: 400 }
      );
    }

    // Clean slug
    const cleanSlug = slug
      ? slug
          .trim()
          .toLowerCase()
          .replace(/[\s_]+/g, "-")
          .replace(/[^\w\u0600-\u06FF-]+/g, "")
      : undefined;

    // Check if new slug conflicts with another article
    if (cleanSlug) {
      const existing = await prisma.article.findFirst({
        where: {
          slug: cleanSlug,
          NOT: { id },
        },
      });

      if (existing) {
        return NextResponse.json(
          { error: "این نامک (Slug) توسط مقاله دیگری در حال استفاده است." },
          { status: 400 }
        );
      }
    }

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title && { title: title.trim() }),
        ...(cleanSlug && { slug: cleanSlug }),
        ...(summary !== undefined && { summary: summary.trim() }),
        ...(content && { content: content.trim() }),
        ...(category && { category: category.trim() }),
        ...(tags !== undefined && {
          tags: Array.isArray(tags) ? tags.join(", ") : tags.trim(),
        }),
        ...(readTime && { readTime: readTime.trim() }),
        ...(image && { image: image.trim() }),
        ...(authorName && { authorName: authorName.trim() }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "خطا در ویرایش مقاله" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "عدم دسترسی مجاز" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "شناسه مقاله الزامی است." },
        { status: 400 }
      );
    }

    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "خطا در حذف مقاله" },
      { status: 500 }
    );
  }
}
