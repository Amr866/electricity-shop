"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type BrandKey = "shiasi_appliances" | "shiasi" | "shiasi_workshop";

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
  shiasi_appliances: {
    key: "shiasi_appliances",
    nameFa: "فروشگاه شیاسی (لوازم برقی و خانگی)",
    nameEn: "Shiasi Electrical & Home Appliances",
    badge: "نجف‌آباد اصفهان",
    tagline: "فروش تخصصی پنکه، موتور کولر آبی، بخاری برقی، آنتن، سیم و کابل و روشنایی",
    address: "اصفهان، نجف‌آباد، خیابان قدس / شریعتی (فروشگاه شیاسی)",
    googleMapsUrl: "https://maps.app.goo.gl/u9UVuUA5cAyGQMcJ6",
    phone: "۰۳۱-۴۲۶۲۴۵۶۷",
    mobile: "۰۹۱۳۱۱۱۲۲۳۳",
    repairPhone: "۰۹۱۶۲۶۶۵۸۸۴",
    city: "نجف‌آباد",
    province: "اصفهان",
    logoIcon: "zap",
    primaryAccent: "#F59E0B",
  },
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
  shiasi_workshop: {
    key: "shiasi_workshop",
    nameFa: "فروشگاه تخصصی شیاسی (کارگاه فنی و تعمیرات)",
    nameEn: "Shiasi Workshop & Services",
    badge: "خرید و تعمیرات",
    tagline: "جامع‌ترین مرکز پذیرش عیب‌یابی و تعمیر انواع پنکه، موتور کولر، بخاری، آنتن و بردهای الکترونیک",
    address: "اصفهان، نجف‌آباد، خیابان قدس / شریعتی",
    googleMapsUrl: "https://maps.app.goo.gl/u9UVuUA5cAyGQMcJ6",
    phone: "۰۳۱-۴۲۶۲۴۵۶۷",
    mobile: "۰۹۱۶۲۶۶۵۸۸۴",
    repairPhone: "۰۹۱۶۲۶۶۵۸۸۴",
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
  const [brandKey, setBrandKey] = useState<BrandKey>("shiasi_appliances");

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
