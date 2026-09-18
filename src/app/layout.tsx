import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { BrandProvider } from "@/context/BrandContext";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { JsonLd, buildElectronicsStoreSchema } from "@/components/seo/JsonLd";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "فروشگاه شیاسی (لوازم برقی و خانگی) | خرید و تعمیرات پنکه، کولر، بخاری، آنتن و روشنایی در نجف‌آباد",
  description:
    "مرکز پخش، خرید آنلاین و کارگاه تعمیرات تخصصی انواع پنکه، موتور کولر آبی، بخاری برقی، آنتن، سیم و کابل استاندارد تمام مس و روشنایی در نجف‌آباد و اصفهان.",
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
  authors: [{ name: "فروشگاه شیاسی (لوازم برقی و خانگی)" }],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";
  const storeSchema = buildElectronicsStoreSchema(baseUrl);

  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazirmatn.variable}
      suppressHydrationWarning
    >
      <body
        className={`${vazirmatn.className} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans pb-16 md:pb-0 transition-colors duration-200`}
        suppressHydrationWarning
      >
        <JsonLd data={storeSchema} />
        <AuthProvider>
          <BrandProvider>
            <WishlistProvider>
              <CartProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <MobileBottomNav />
                <CartDrawer />
              </CartProvider>
            </WishlistProvider>
          </BrandProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
