"use client";

import React, { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  Building,
  CreditCard,
  Phone,
  Clock,
  Truck,
  MapPin,
  MessageCircle,
  Copy,
  Check,
  Zap,
  Sparkles,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { formatToman, toPersianDigits } from "@/lib/utils";

interface SettingsAdminClientProps {
  initialSettings: Record<string, string>;
}

export function SettingsAdminClient({ initialSettings }: SettingsAdminClientProps) {
  const [settings, setSettings] = useState<Record<string, string>>({
    store_name: "فروشگاه شیاسی",
    store_slogan: "مرکز خرید و تعمیرات تخصصی لوازم برقی خانگی، صنعتی، پنکه، کولر، بخاری و سیم‌کشی",
    store_address: "اصفهان، نجف‌آباد، ۱۵ خرداد مرکزی، نبش بن‌بست نرگس (فروشگاه شیاسی)",
    store_phone: "03142626116",
    store_mobile: "09136260072",
    store_eitaa: "@shiasi_electric",
    store_hours: "شنبه تا چهارشنبه: ۸:۳۰ الی ۱۳:۰۰ و ۱۶:۳۰ الی ۲۱:۰۰ | پنج‌شنبه‌ها: ۸:۳۰ الی ۱۳:۰۰ | جمعه‌ها: تعطیل",
    store_card_number: "6037997512345678",
    store_card_owner: "فروشگاه تخصصی برق شیاسی",
    store_card_bank: "بانک ملی ایران - شعبه مرکزی نجف‌آباد",
    store_iban: "IR120170000000123456789012",
    shipping_peyk_price: "45000",
    shipping_tipax_price: "65000",
    free_shipping_threshold: "2000000",
    store_map_link: "https://neshan.org/maps/places/vbZnI32x4clP",
    ...initialSettings,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(id);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3500);
      } else {
        alert("خطا در ذخیره تنظیمات.");
      }
    } catch {
      alert("خطای سرور در برقراری ارتباط.");
    } finally {
      setLoading(false);
    }
  };

  // Format 16-digit card number in 4 groups of 4
  const rawCard = (settings["store_card_number"] || "").replace(/\D/g, "");
  const formattedCard = rawCard.replace(/(\d{4})(?=\d)/g, "$1 - ");

  return (
    <div className="max-w-5xl space-y-6">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Settings className="w-5 h-5 text-purple-400" />
            <span>تنظیمات فروشگاه، لجستیک و اطلاعات بانکی</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            پیکربندی آدرس شعبه نجف‌آباد، شماره‌های تماس کارگاه، حساب کارت‌به‌کارت و نرخ‌های ارسال
          </p>
        </div>
      </div>

      {success && (
        <div className="bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs p-4 rounded-2xl flex items-center gap-2.5 shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="font-bold">تنظیمات فروشگاه با موفقیت در دیتابیس PostgreSQL ذخیره و همگام شد.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* 2. Interactive Shetab Bank Card 3D Visualizer */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Bank Card Form Fields */}
          <div className="lg:col-span-7 bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
            <h2 className="font-black text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
              <CreditCard className="w-4 h-4 text-amber-400" />
              <span>اطلاعات حساب و کارت جهت واریز کارت‌به‌کارت</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">شماره کارت ۱۶ رقمی شتاب</label>
                <input
                  type="text"
                  maxLength={19}
                  value={settings["store_card_number"] || ""}
                  onChange={(e) => handleChange("store_card_number", e.target.value)}
                  placeholder="6037-9975-1234-5678"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-sm tracking-widest focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">نام صاحب حساب</label>
                  <input
                    type="text"
                    value={settings["store_card_owner"] || ""}
                    onChange={(e) => handleChange("store_card_owner", e.target.value)}
                    placeholder="فروشگاه تخصصی برق شیاسی"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-bold mb-1">نام بانک و شعبه</label>
                  <input
                    type="text"
                    value={settings["store_card_bank"] || ""}
                    onChange={(e) => handleChange("store_card_bank", e.target.value)}
                    placeholder="بانک ملی - شعبه مرکزی نجف‌آباد"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">شماره شبا (IBAN با پیشوند IR جهت پایا/ساتنا)</label>
                <input
                  type="text"
                  value={settings["store_iban"] || ""}
                  onChange={(e) => handleChange("store_iban", e.target.value.toUpperCase())}
                  placeholder="IR120170000000123456789012"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-xs tracking-wider focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Live Shetab Graphic Card Preview */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 rounded-3xl p-6 border border-slate-800 shadow-2xl flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold">
              <span>پیش‌نمایش کارت شتاب در درگاه خرید:</span>
              <span className="bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded-md text-[10px]">عضو شبکه شتاب</span>
            </div>

            {/* Realistic Bank Card */}
            <div className="w-full aspect-[1.58/1] rounded-2xl p-5 bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-slate-950 shadow-2xl relative overflow-hidden flex flex-col justify-between border border-amber-300/40">
              
              {/* Metallic Sheen Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 pointer-events-none" />

              {/* Card Top: Chip & Bank Name */}
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 to-yellow-600 border border-yellow-700/60 shadow-xs flex items-center justify-center">
                    <div className="w-6 h-4 border-t border-b border-amber-900/40" />
                  </div>
                  <span className="text-[10px] font-black text-slate-950/80">SHETAB</span>
                </div>
                <strong className="text-xs font-black">{settings["store_card_bank"] || "بانک ملی ایران"}</strong>
              </div>

              {/* Card Center: 16-Digit Number */}
              <div className="relative z-10 py-1 text-center">
                <p className="font-mono font-black text-base sm:text-lg tracking-widest text-slate-950 drop-shadow-xs" dir="ltr">
                  {toPersianDigits(formattedCard || "۶۰۳۷ - ۹۹۷۵ - ۱۲۳۴ - ۵۶۷۸")}
                </p>
              </div>

              {/* Card Bottom: Holder Name & IBAN */}
              <div className="relative z-10 flex items-end justify-between text-xs">
                <div>
                  <span className="text-[9px] block text-slate-900/80 font-bold">صاحب کارت:</span>
                  <strong className="text-xs font-black block">{settings["store_card_owner"] || "فروشگاه شیاسی"}</strong>
                </div>

                <div className="text-left font-mono text-[9px] font-bold text-slate-900/80">
                  <span>{settings["store_iban"] ? settings["store_iban"].slice(0, 16) + "..." : "IR12017..."}</span>
                </div>
              </div>

            </div>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              این اطلاعات در مرحله تسویه حساب و پرداخت کارت‌به‌کارت به مشتریان نمایش داده می‌شود.
            </p>
          </div>

        </div>

        {/* 3. Store Identity & Work Hours Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="font-black text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-amber-400" />
            <span>مشخصات و نشانی فروشگاه و کارگاه نجف‌آباد</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">نام فروشگاه و برند</label>
              <input
                type="text"
                value={settings["store_name"] || ""}
                onChange={(e) => handleChange("store_name", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500 font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">شعار تبلیغاتی</label>
              <input
                type="text"
                value={settings["store_slogan"] || ""}
                onChange={(e) => handleChange("store_slogan", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-bold mb-1">آدرس دقیق فروشگاه و کارگاه مرکزی</label>
              <input
                type="text"
                value={settings["store_address"] || ""}
                onChange={(e) => handleChange("store_address", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">ساعات کاری و پذیرش کارگاه</label>
              <input
                type="text"
                value={settings["store_hours"] || ""}
                onChange={(e) => handleChange("store_hours", e.target.value)}
                placeholder="۸:۳۰ الی ۱۳:۳۰ و ۱۶:۳۰ الی ۲۱:۰۰"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">لینک لوکیشن نقشه (نشان / بلد / گوگل مپ)</label>
              <input
                type="text"
                value={settings["store_map_link"] || ""}
                onChange={(e) => handleChange("store_map_link", e.target.value)}
                placeholder="https://nshn.ir/..."
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 4. Contact & Messengers Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="font-black text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>شماره‌های تماس و راه‌های ارتباطی مشتریان</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">تلفن ثابت شعبه نجف‌آباد</label>
              <input
                type="text"
                value={settings["store_phone"] || ""}
                onChange={(e) => handleChange("store_phone", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">شماره همراه و پشتیبانی واتساپ</label>
              <input
                type="text"
                value={settings["store_mobile"] || ""}
                onChange={(e) => handleChange("store_mobile", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">آیدی کانال ایتا فروشگاه</label>
              <input
                type="text"
                value={settings["store_eitaa"] || ""}
                onChange={(e) => handleChange("store_eitaa", e.target.value)}
                placeholder="@shiasi_electric"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 5. Shipping Rates & Free Shipping Logistics */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="font-black text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Truck className="w-4 h-4 text-blue-400" />
            <span>تنظیمات لجستیک و هزینه‌های ارسال</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1">هزینه پیک اختصاصی نجف‌آباد و اصفهان (تومان)</label>
              <input
                type="number"
                value={settings["shipping_peyk_price"] || ""}
                onChange={(e) => handleChange("shipping_peyk_price", e.target.value)}
                placeholder="45000"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">هزینه پیش‌فرض تیپاکس و پست (تومان)</label>
              <input
                type="number"
                value={settings["shipping_tipax_price"] || ""}
                onChange={(e) => handleChange("shipping_tipax_price", e.target.value)}
                placeholder="65000"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1">آستانه ارسال رایگان فاکتور (تومان)</label>
              <input
                type="number"
                value={settings["free_shipping_threshold"] || ""}
                onChange={(e) => handleChange("free_shipping_threshold", e.target.value)}
                placeholder="2000000"
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        {/* 6. Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-8 py-3 rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>در حال ذخیره تنظیمات...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>ذخیره کلیه تنظیمات فروشگاه</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
}
