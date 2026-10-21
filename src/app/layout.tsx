import type { Metadata, Viewport } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CookieConsentBanner } from "@/components/layout/CookieConsentBanner";
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

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://shiasi-electric.ir";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "فروشگاه شیاسی نجف‌آباد | کالای برق و کارگاه تعمیرات",
    template: "%s | فروشگاه شیاسی",
  },
  description:
    "فروشگاه و کارگاه شیاسی نجف‌آباد؛ مرکز خرید انواع موتور کولر، پنکه، بخاری برقی، سیم و کابل استاندارد مس، آنتن و خدمات تعمیرات تخصصی لوازم برقی.",
  keywords: [
    "فروشگاه شیاسی",
    "کالای برق نجف آباد",
    "تعمیر پنکه نجف آباد",
    "موتور کولر نجف آباد",
    "تعمیر بخاری برقی نجف آباد",
    "الکتریکی نجف آباد",
    "خرید سیم و کابل مس",
    "آنتن تلویزیون هانی"
  ],
  authors: [{ name: "فروشگاه شیاسی (کالای برق و کارگاه فنی)" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "فروشگاه شیاسی نجف‌آباد | کالای برق و کارگاه تعمیرات",
    description:
      "فروشگاه و کارگاه شیاسی نجف‌آباد؛ مرکز خرید انواع موتور کولر، پنکه، بخاری برقی، سیم و کابل استاندارد مس، آنتن و خدمات تعمیرات تخصصی لوازم برقی.",
    url: baseUrl,
    siteName: "فروشگاه و کارگاه شیاسی",
    locale: "fa_IR",
    type: "website",
    images: [
      {
        url: "/favicon.svg",
        width: 512,
        height: 512,
        alt: "نشان تجاری فروشگاه و کارگاه شیاسی نجف‌آباد",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "فروشگاه شیاسی نجف‌آباد | کالای برق و کارگاه تعمیرات",
    description:
      "مرکز خرید آنلاین و کارگاه تخصصی تعمیرات لوازم برقی و الکتریکی در نجف‌آباد و اصفهان.",
    images: ["/favicon.svg"],
  },
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
        className={`${vazirmatn.className} antialiased bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen flex flex-col font-sans pb-20 md:pb-0 transition-colors duration-200`}
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
                <CookieConsentBanner />
              </CartProvider>
            </WishlistProvider>
          </BrandProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
