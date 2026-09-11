import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getAllArticles,
  getRelatedArticles,
} from "@/data/articles";
import { ArticleContentRenderer } from "@/components/blog/ArticleContentRenderer";
import {
  Clock,
  Calendar,
  Eye,
  User,
  Tag,
  ArrowRight,
  ArrowLeft,
  Phone,
  MessageCircle,
  Share2,
  ChevronLeft,
  Lightbulb,
  Wrench,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const articles = await getAllArticles();
  return articles.map((a) => ({
    slug: a.slug,
  }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {
      title: "مقاله یافت نشد | فروشگاه شیاسی",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";

  return {
    title: `${article.title} | مجله برق شیاسی نجف‌آباد`,
    description: article.summary,
    keywords: article.tags,
    openGraph: {
      title: article.title,
      description: article.summary,
      url: `${baseUrl}/blog/${article.slug}`,
      type: "article",
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.summary,
      images: [article.image],
    },
  };
}

export default async function SingleArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const relatedArticles = await getRelatedArticles(article.slug, article.category, 3);
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";

  // Structured Schema (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.summary,
    image: article.image,
    datePublished: new Date().toISOString(),
    author: {
      "@type": "Organization",
      name: "فروشگاه و کارگاه شیاسی نجف‌آباد",
      url: baseUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "فروشگاه شیاسی",
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/favicon.svg`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${baseUrl}/blog/${article.slug}`,
    },
  };

  // Determine relevant store destination based on category
  let storeLink = {
    href: "/products?category=lighting-fixtures",
    label: "مشاهده و خرید انواع چراغ سقفی و پنل در فروشگاه",
    icon: Lightbulb,
  };
  if (article.category.includes("لاین")) {
    storeLink = {
      href: "/products?category=lighting-fixtures",
      label: "مشاهده پروفیل‌های لاین نوری و ترانس ۱۲ ولت در فروشگاه",
      icon: Lightbulb,
    };
  } else if (article.category.includes("تعمیر") || article.category.includes("سرویس")) {
    storeLink = {
      href: "/repair-service",
      label: "ثبت درخواست تعمیرات و استعلام هزینه کارگاه شیاسی",
      icon: Wrench,
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8">
        {/* 1. Breadcrumbs */}
        <nav aria-label="راهنمای مسیر" className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto pb-1 scrollbar-none">
          <Link href="/" className="hover:text-amber-500 transition-colors shrink-0">
            خانه
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          <Link href="/blog" className="hover:text-amber-500 transition-colors shrink-0">
            مجله برق و مقالات
          </Link>
          <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
          <span className="text-slate-700 dark:text-slate-300 font-bold shrink-0 truncate max-w-[200px] sm:max-w-xs">
            {article.category}
          </span>
        </nav>

        {/* 2. Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full border shadow-xs ${
                article.badgeColor ||
                "bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border-amber-200"
              }`}
            >
              {article.category}
            </span>

            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>{article.readTime}</span>
            </div>

            <span className="text-xs text-slate-400 dark:text-slate-500">•</span>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{toPersianDigits(article.date)}</span>
            </div>

            {article.views && article.views > 0 && (
              <>
                <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <Eye className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{toPersianDigits(article.views)} بازدید</span>
                </div>
              </>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">
            {article.title}
          </h1>

          {/* Author Badge */}
          <div className="flex items-center justify-between gap-4 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                <User className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  {article.author}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  واحد فنی و کارگاه تخصصی شیاسی نجف‌آباد
                </span>
              </div>
            </div>

            <Link
              href="/blog"
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 group"
            >
              <span>بازگشت به مقالات</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </header>

        {/* 3. Featured Image */}
        <div className="relative aspect-video sm:aspect-21/9 rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 shadow-xl border border-slate-200/80 dark:border-slate-800">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 896px"
            className="object-cover"
          />
        </div>

        {/* 4. Article Lead / Summary Box */}
        <div className="bg-slate-50 dark:bg-slate-850/80 border-r-4 border-amber-500 rounded-2xl p-5 text-sm sm:text-base text-slate-700 dark:text-slate-200 leading-relaxed font-medium shadow-xs">
          <p className="font-semibold">{article.summary}</p>
        </div>

        {/* 5. Main Content Body */}
        <main className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
          <ArticleContentRenderer content={article.content} />
        </main>

        {/* 6. Tags Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-xs font-black text-slate-900 dark:text-white">
            <Tag className="w-4 h-4 text-amber-500" />
            <span>برچسب‌های تخصصی این مقاله:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/blog`}
                className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-amber-950/80 text-slate-700 dark:text-slate-300 hover:text-amber-800 dark:hover:text-amber-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-colors font-medium"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        {/* 7. Store Action / Consultation Card */}
        <section className="rounded-3xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-slate-950 text-white p-6 sm:p-8 border border-amber-500/30 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <Sparkles className="w-4 h-4" />
                <span>مشاوره و خرید مستقیم از فروشگاه شیاسی</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                نیاز به تجهیزات، قطعات یا خدمات کارگاهی دارید؟
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-medium">
                تضمین اصالت کالا، قیمت دست‌اول بازار و تست رایگان در محل فروشگاه نجف‌آباد (۱۵ خرداد مرکزی، نبش بن‌بست نرگس).
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-800">
            <Link
              href={storeLink.href}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
            >
              <storeLink.icon className="w-4 h-4" />
              <span>{storeLink.label}</span>
            </Link>

            <a
              href="tel:03142626116"
              className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 border border-slate-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-emerald-400" />
              <span>تماس مستقیم: ۰۳۱-۴۲۶۲۶۱۱۶</span>
            </a>

            <a
              href="https://wa.me/989136260072"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 shadow-md transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>واتساپ: ۰۹۱۳۶۲۶۰۰۷۲</span>
            </a>
          </div>
        </section>

        {/* 8. Related Articles Section */}
        {relatedArticles.length > 0 && (
          <section className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                سایر مقالات و آموزش‌های پیشنهادی
              </h3>
              <Link
                href="/blog"
                className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>مشاهده همه</span>
                <ArrowLeft className="w-3 h-3" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/blog/${rel.slug}`}
                  className="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden hover:border-amber-400/80 transition-all shadow-xs hover:shadow-md p-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <Image
                        src={rel.image}
                        alt={rel.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 block">
                      {rel.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-amber-600 line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{rel.readTime}</span>
                    <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform text-amber-500" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
