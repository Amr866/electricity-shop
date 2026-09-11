import React from "react";
import { Metadata } from "next";
import { getAllArticles, getAllCategories } from "@/data/articles";
import { BlogClient } from "./BlogClient";

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: "مجله تخصصی برق، روشنایی و تعمیرات | فروشگاه شیاسی نجف‌آباد",
  description:
    "مجموعه مقالات آموزشی و تخصصی درباره انتخاب چراغ سقفی مدرن، طراحی لاین نوری، عیب‌یابی و سرویس الکتروموتور و پمپ کولر آبی، استاندارد کابل و کاهش مصرف برق.",
  keywords: [
    "وبلاگ برق",
    "چراغ سقفی مدرن",
    "لاین نوری",
    "سرویس موتور کولر",
    "فروشگاه شیاسی",
    "برق ساختمان نجف‌آباد",
    "تعمیرات الکتروموتور اصفهان",
  ],
  openGraph: {
    title: "مجله تخصصی برق و روشنایی | فروشگاه شیاسی نجف‌آباد",
    description:
      "مقالات تخصصی نورپردازی، طراحی لاین نوری و عیب‌یابی الکتروموتور و پمپ کولر در کارگاه شیاسی نجف‌آباد.",
    type: "website",
  },
};

export default async function BlogPage() {
  const articles = await getAllArticles();
  const categories = getAllCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <BlogClient initialArticles={articles} categories={categories} />
    </div>
  );
}
