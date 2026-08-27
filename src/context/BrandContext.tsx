"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type BrandKey = "shiasi" | "naghshejahan" | "shiasi_isfahan";

export interface BrandConfig {
  key: BrandKey;
  nameFa: string;
  nameEn: string;
  badge: string;
  tagline: string;
  address: string;
  googleMapsUrl: string;
  phone: string;
  mobile: string;
  repairPhone: string;
  city: string;
  province: string;
  logoIcon: "zap" | "circuit" | "sun";
  primaryAccent: string; // Hex color
}

export const BRANDS: Record<BrandKey, BrandConfig> = {
  shiasi: {
    key: "shiasi",
    nameFa: "فروشگاه تخصصی شیاسی",
    nameEn: "Shiasi Store",
    badge: "نجف‌آباد اصفهان",
    tagline: "مرکز خرید و تعمیرات تخصصی پنکه، کولر، بخاری، آنتن، لوازم برقی و قطعات الکترونیک",
    address: "اصفهان، نجف‌آباد، خیابان قدس / شریعتی (فروشگاه شیاسی)",
    googleMapsUrl: "https://maps.app.goo.gl/u9UVuUA5cAyGQMcJ6",
    phone: "۰۳۱-۴۲۶۲۴۵۶۷",
    mobile: "۰۹۱۳۱۱۱۲۲۳۳",
    repairPhone: "۰۹۱۶۲۶۶۵۸۸۴",
    city: "نجف‌آباد",
    province: "اصفهان",
    logoIcon: "zap",
    primaryAccent: "#F5A623",
  },
  naghshejahan: {
    key: "naghshejahan",
    nameFa: "الکتریک نقش جهان اصفهان",
    nameEn: "Naghsh-e Jahan Electric",
    badge: "شعبه اصفهان",
    tagline: "تامین‌کننده تخصصی صنعت برق، روشنایی و ساختمان در نصف جهان",
    address: "اصفهان، خیابان فردوسی، پلاک ۱۲۸",
    googleMapsUrl: "https://maps.app.goo.gl/u9UVuUA5cAyGQMcJ6",
    phone: "۰۳۱-۳۲۲۰۴۵۶۷",
    mobile: "۰۹۱۳۱۱۱۲۲۳۳",
    repairPhone: "۰۹۱۶۲۶۶۵۸۸۴",
    city: "اصفهان",
    province: "اصفهان",
    logoIcon: "circuit",
    primaryAccent: "#F59E0B",
  },
  shiasi_isfahan: {
    key: "shiasi_isfahan",
    nameFa: "کالای برق و الکترونیک شیاسی نجف‌آباد",
    nameEn: "Shiasi Electric & Appliances",
    badge: "خرید و تعمیرات",
    tagline: "جامع‌ترین مرکز لوازم برقی خانگی، سیم‌پیچی موتور کولر، پنکه و قطعات الکترونیک",
    address: "اصفهان، نجف‌آباد، خیابان قدس / شریعتی",
    googleMapsUrl: "https://maps.app.goo.gl/u9UVuUA5cAyGQMcJ6",
    phone: "۰۳۱-۴۲۶۲۴۵۶۷",
    mobile: "۰۹۱۶۲۶۶۵۸۸۴",
    repairPhone: "۰۹۱6۲۶۶۵۸۸۴",
    city: "نجف‌آباد",
    province: "اصفهان",
    logoIcon: "zap",
    primaryAccent: "#F5A623",
  },
};

interface BrandContextType {
  brand: BrandConfig;
  brandKey: BrandKey;
  setBrandKey: (key: BrandKey) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brandKey, setBrandKey] = useState<BrandKey>("shiasi");

  useEffect(() => {
    const saved = localStorage.getItem("shiasi_selected_brand") as BrandKey;
    if (saved && BRANDS[saved]) {
      setBrandKey(saved);
    }
  }, []);

  const changeBrand = (key: BrandKey) => {
    setBrandKey(key);
    localStorage.setItem("shiasi_selected_brand", key);
  };

  return (
    <BrandContext.Provider
      value={{
        brand: BRANDS[brandKey],
        brandKey,
        setBrandKey: changeBrand,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
}
