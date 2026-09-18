import type { Metadata } from "next";
import React from "react";
import { JsonLd, buildFaqPageSchema } from "@/components/seo/JsonLd";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";

export const metadata: Metadata = {
  title: "خدمات تخصصی تعمیرات و سیم‌پیچی الکتروموتور و پنکه | کارگاه شیاسی نجف‌آباد",
  description:
    "کارگاه تخصصی تعمیرات و سیم‌پیچی انواع موتور کولر موتوژن و الکتروژن، پنکه، بخاری برقی و پمپ آب در نجف‌آباد با مهلت تست و قطعات فابریک شرکتی.",
  alternates: {
    canonical: `${baseUrl}/repair-service`,
  },
  openGraph: {
    title: "خدمات تخصصی تعمیرات و سیم‌پیچی الکتروموتور و پنکه | کارگاه شیاسی",
    description:
      "کارگاه تخصصی تعمیرات و سیم‌پیچی انواع موتور کولر موتوژن و الکتروژن، پنکه، بخاری برقی و پمپ آب در نجف‌آباد با مهلت تست و قطعات فابریک شرکتی.",
    url: `${baseUrl}/repair-service`,
    siteName: "فروشگاه و کارگاه برق شیاسی نجف‌آباد",
    locale: "fa_IR",
    type: "website",
  },
};

const repairFaqSchema = buildFaqPageSchema([
  {
    question: "شرایط و مهلت تست خدمات تعمیرات و سیم‌پیچی کارگاه شیاسی نجف‌آباد چگونه است؟",
    answer:
      "کلیه خدمات تعمیراتی شامل تعویض بوش، بلبرینگ، شفت، خازن راه‌انداز و سیم‌پیچی تمام‌مس موتور کولر و پنکه دارای ۷ روز مهلت تست فنی و ضمانت کارکرد می‌باشند.",
  },
  {
    question: "آیا هزینه تعمیر موتور کولر یا پنکه قبل از شروع کار اعلام می‌شود؟",
    answer:
      "بله، پس از پذیرش و عیب‌یابی دقیق در کارگاه مرکزی نجف‌آباد، کارشناس فنی هزینه قطعات یدکی و اجرت را اعلام کرده و تعمیر فقط پس از تأیید شما شروع می‌شود.",
  },
  {
    question: "آیا امکان ارسال دستگاه تعمیری از شهرهای اصفهان یا حومه وجود دارد؟",
    answer:
      "بله، مشتریان گرامی از اصفهان، تیران، خمینی‌شهر و سراسر استان می‌توانند دستگاه را از طریق اسنپ‌باکس، تیپاکس یا باربری به نشانی کارگاه ارسال نمایند.",
  },
]);

export default function RepairServiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <JsonLd data={repairFaqSchema} />
      {children}
    </>
  );
}
