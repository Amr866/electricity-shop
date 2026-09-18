import type { Metadata } from "next";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";

export const metadata: Metadata = {
  title: "لیست قیمت سیم، کابل، موتور کولر و تجهیزات برق صنعتی | فروشگاه شیاسی",
  description:
    "مشاهده و دانلود آخرین لیست قیمت روز انواع سیم و کابل افشان مس، موتور کولر آبی، کلید و پریز و تجهیزات روشنایی در فروشگاه شیاسی نجف‌آباد.",
  alternates: {
    canonical: `${baseUrl}/price-lists`,
  },
  openGraph: {
    title: "لیست قیمت سیم، کابل، موتور کولر و تجهیزات برق صنعتی | فروشگاه شیاسی",
    description:
      "مشاهده و دانلود آخرین لیست قیمت روز انواع سیم و کابل افشان مس، موتور کولر آبی، کلید و پریز و تجهیزات روشنایی در فروشگاه شیاسی نجف‌آباد.",
    url: `${baseUrl}/price-lists`,
    siteName: "فروشگاه و کارگاه برق شیاسی نجف‌آباد",
    locale: "fa_IR",
    type: "website",
  },
};

export default function PriceListsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
