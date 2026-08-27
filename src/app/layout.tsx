import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { BrandDemoFloatingPill } from "@/components/brand/BrandDemoFloatingPill";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { BrandProvider } from "@/context/BrandContext";

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
  title: "فروشگاه تخصصی شیاسی | مرجع کالای برق، روشنایی، اتوماسیون و الکترونیک",
  description:
    "مرکز پخش و فروش عمده و خرد انواع سیم و کابل استاندارد ساختمانی، پنل‌های روشنایی LED، پروژکتورهای خورشیدی، تجهیزات برق صنعتی و قطعات الکترونیک و آردوینو.",
  keywords: [
    "فروشگاه شیاسی",
    "شیاسی استور",
    "کالای برق شیاسی",
    "الکتریکی اصفهان",
    "ادیسون کالا",
    "خرید سیم و کابل",
    "قطعات الکترونیک و آردوینو",
    "پروژکتور خورشیدی",
    "کلید و پریز"
  ],
  authors: [{ name: "فروشگاه تخصصی شیاسی" }],
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
        className={`${vazirmatn.className} antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans pb-16 md:pb-0`}
        suppressHydrationWarning
      >
        <BrandProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <MobileBottomNav />
              <BrandDemoFloatingPill />
            </CartProvider>
          </WishlistProvider>
        </BrandProvider>
      </body>
    </html>
  );
}
