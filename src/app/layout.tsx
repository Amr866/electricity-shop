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
import { AuthProvider } from "@/components/providers/AuthProvider";

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
  title: "فروشگاه تخصصی شیاسی | خرید و تعمیرات لوازم برقی، پنکه، کولر، بخاری، آنتن و روشنایی در نجف‌آباد",
  description:
    "مرکز پخش، خرید آنلاین و کارگاه تعمیرات تخصصی انواع پنکه، موتور کولر آبی، بخاری برقی، آنتن، سیم و کابل استاندارد تمام مس، پنل‌های روشنایی LED و قطعات الکترونیک در نجف‌آباد و اصفهان.",
  keywords: [
    "فروشگاه شیاسی",
    "تعمیر پنکه نجف آباد",
    "موتور کولر نجف آباد",
    "تعمیر بخاری برقی نجف آباد",
    "کالای برق شیاسی",
    "الکتریکی نجف آباد",
    "تعمیرات لوازم برقی نجف آباد",
    "خرید سیم و کابل",
    "آنتن تلویزیون هانی"
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
        <AuthProvider>
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
        </AuthProvider>
      </body>
    </html>
  );
}
