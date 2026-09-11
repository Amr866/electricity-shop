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
  neshanUrl: string;
  baladUrl: string;
  phone: string;
  phoneAlt: string;
  mobile: string;
  repairPhone: string;
  rawPhone: string;
  rawPhoneAlt: string;
  rawMobile: string;
  rawRepairPhone: string;
  workingHours: string;
  city: string;
  province: string;
  logoIcon: "zap" | "circuit" | "sun";
  primaryAccent: string; // Hex color
}

export const BRANDS: Record<BrandKey, BrandConfig> = {
  shiasi_appliances: {
    key: "shiasi_appliances",
    nameFa: "فروشگاه شیاسی",
    nameEn: "Shiasi Store",
    badge: "لوازم برقی و خانگی نجف‌آباد",
    tagline: "مرکز پخش، خرید و تعمیرات تخصصی پنکه، موتور کولر آبی، بخاری برقی، آنتن، سیم و کابل",
    address: "اصفهان، نجف‌آباد، ۱۵ خرداد مرکزی، نبش بن‌بست نرگس (فروشگاه شیاسی)",
    googleMapsUrl: "https://maps.app.goo.gl/cXf7MouMBVSPUKDo9",
    neshanUrl: "https://neshan.org/maps/places/vbZnI32x4clP",
    baladUrl: "https://balad.ir/location?latitude=32.6365457&longitude=51.3551911",
    phone: "۰۳۱-۴۲۶۲۶۱۱۶",
    phoneAlt: "۰۳۱-۴۲۶۲۶۱۰۷",
    mobile: "۰۹۱۳۶۲۶۰۰۷۲",
    repairPhone: "۰۹۱۳۶۲۶۰۰۷۲",
    rawPhone: "03142626116",
    rawPhoneAlt: "03142626107",
    rawMobile: "09136260072",
    rawRepairPhone: "09136260072",
    workingHours: "شنبه تا چهارشنبه: ۸:۳۰ الی ۱۳:۰۰ و ۱۶:۳۰ الی ۲۱:۰۰ | پنج‌شنبه: ۸:۳۰ الی ۱۳:۰۰ | جمعه: تعطیل",
    city: "نجف‌آباد",
    province: "اصفهان",
    logoIcon: "zap",
    primaryAccent: "#F59E0B",
  },
  shiasi: {
    key: "shiasi",
    nameFa: "فروشگاه شیاسی",
    nameEn: "Shiasi Store",
    badge: "شعبه نجف‌آباد",
    tagline: "مرکز خرید و تعمیرات تخصصی پنکه، کولر، بخاری، آنتن و تجهیزات برقی",
    address: "اصفهان، نجف‌آباد، ۱۵ خرداد مرکزی، نبش بن‌بست نرگس (فروشگاه شیاسی)",
    googleMapsUrl: "https://maps.app.goo.gl/cXf7MouMBVSPUKDo9",
    neshanUrl: "https://neshan.org/maps/places/vbZnI32x4clP",
    baladUrl: "https://balad.ir/location?latitude=32.6365457&longitude=51.3551911",
    phone: "۰۳۱-۴۲۶۲۶۱۱۶",
    phoneAlt: "۰۳۱-۴۲۶۲۶۱۰۷",
    mobile: "۰۹۱۳۶۲۶۰۰۷۲",
    repairPhone: "۰۹۱۳۶۲۶۰۰۷۲",
    rawPhone: "03142626116",
    rawPhoneAlt: "03142626107",
    rawMobile: "09136260072",
    rawRepairPhone: "09136260072",
    workingHours: "شنبه تا چهارشنبه: ۸:۳۰ الی ۱۳:۰۰ و ۱۶:۳۰ الی ۲۱:۰۰ | پنج‌شنبه: ۸:۳۰ الی ۱۳:۰۰ | جمعه: تعطیل",
    city: "نجف‌آباد",
    province: "اصفهان",
    logoIcon: "zap",
    primaryAccent: "#F5A623",
  },
  shiasi_workshop: {
    key: "shiasi_workshop",
    nameFa: "فروشگاه شیاسی",
    nameEn: "Shiasi Workshop & Services",
    badge: "کارگاه تعمیرات تخصصی",
    tagline: "مرکز عیب‌یابی و تعمیر انواع پنکه، موتور کولر آبی، بخاری برقی و آنتن",
    address: "اصفهان، نجف‌آباد، ۱۵ خرداد مرکزی، نبش بن‌بست نرگس (فروشگاه شیاسی)",
    googleMapsUrl: "https://maps.app.goo.gl/cXf7MouMBVSPUKDo9",
    neshanUrl: "https://neshan.org/maps/places/vbZnI32x4clP",
    baladUrl: "https://balad.ir/location?latitude=32.6365457&longitude=51.3551911",
    phone: "۰۳۱-۴۲۶۲۶۱۱۶",
    phoneAlt: "۰۳۱-۴۲۶۲۶۱۰۷",
    mobile: "۰۹۱۳۶۲۶۰۰۷۲",
    repairPhone: "۰۹۱۳۶۲۶۰۰۷۲",
    rawPhone: "03142626116",
    rawPhoneAlt: "03142626107",
    rawMobile: "09136260072",
    rawRepairPhone: "09136260072",
    workingHours: "شنبه تا چهارشنبه: ۸:۳۰ الی ۱۳:۰۰ و ۱۶:۳۰ الی ۲۱:۰۰ | پنج‌شنبه: ۸:۳۰ الی ۱۳:۰۰ | جمعه: تعطیل",
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
