import type { Metadata } from "next";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";

export const metadata: Metadata = {
  title: "استعلام قیمت، ارسال صورت لوازم و پیش‌فاکتور (BOM) | برق شیاسی",
  description:
    "ارسال آسان لیست اقلام برق ساختمانی و صنعتی، فایل اکسل BOM یا تصویر دست‌نویس جهت صدور سریع پیش‌فاکتور با تخفیف ویژه همکار در فروشگاه شیاسی.",
  alternates: {
    canonical: `${baseUrl}/bom-upload`,
  },
  openGraph: {
    title: "استعلام قیمت، ارسال صورت لوازم و پیش‌فاکتور (BOM) | برق شیاسی",
    description:
      "ارسال آسان لیست اقلام برق ساختمانی و صنعتی، فایل اکسل BOM یا تصویر دست‌نویس جهت صدور سریع پیش‌فاکتور با تخفیف ویژه همکار در فروشگاه شیاسی.",
    url: `${baseUrl}/bom-upload`,
    siteName: "فروشگاه و کارگاه برق شیاسی نجف‌آباد",
    locale: "fa_IR",
    type: "website",
  },
};

export default function BomUploadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
