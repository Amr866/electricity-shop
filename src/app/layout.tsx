import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "الکتریک نقش جهان اصفهان | فروشگاه تخصصی کالای برق، روشنایی و الکترونیک",
  description:
    "مرکز پخش و فروش عمده و خرد انواع سیم و کابل استاندارد ساختمانی تمام مس، پنل‌های ال‌ای‌دی، تجهیزات برق صنعتی، تابلو برق و قطعات الکترونیک و آردوینو در اصفهان با ارسال فوری.",
  keywords: [
    "الکتریکی اصفهان",
    "کالای برق اصفهان",
    "خرید سیم و کابل در اصفهان",
    "فروشگاه الکترونیک اصفهان",
    "کلید و پریز اصفهان",
    "برق صنعتی اصفهان",
    "قطعات آردوینو اصفهان",
    "الکتریک خیابان فردوسی اصفهان"
  ],
  authors: [{ name: "فروشگاه الکتریک نقش جهان" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazirmatn.variable}
      suppressHydrationWarning
    >
      <body
        className={`${vazirmatn.className} antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans`}
        suppressHydrationWarning
      >
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
