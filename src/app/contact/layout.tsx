import type { Metadata } from "next";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";

export const metadata: Metadata = {
  title: "تماس با ما و آدرس کارگاه و فروشگاه | برق و صنعت شیاسی نجف‌آباد",
  description:
    "اطلاعات تماس، شماره تلفن مستقیم (۰۳۱۴۲۶۲۶۱۱۶)، آدرس کارگاه و فروشگاه برق شیاسی در نجف‌آباد اصفهان، لوکیشن مسیریابی و ساعات کاری حضوری.",
  alternates: {
    canonical: `${baseUrl}/contact`,
  },
  openGraph: {
    title: "تماس با ما و آدرس کارگاه و فروشگاه | برق و صنعت شیاسی نجف‌آباد",
    description:
      "اطلاعات تماس، شماره تلفن مستقیم، آدرس کارگاه و فروشگاه برق شیاسی در نجف‌آباد اصفهان، لوکیشن مسیریابی و ساعات کاری حضوری.",
    url: `${baseUrl}/contact`,
    siteName: "فروشگاه و کارگاه برق شیاسی نجف‌آباد",
    locale: "fa_IR",
    type: "website",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
