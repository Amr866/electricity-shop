"use client";

import React, { useState } from "react";
import { Settings, Save, CheckCircle2, Building, CreditCard, Phone, Clock } from "lucide-react";

interface SettingsAdminClientProps {
  initialSettings: Record<string, string>;
}

export function SettingsAdminClient({ initialSettings }: SettingsAdminClientProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
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
        setTimeout(() => setSuccess(false), 3000);
      } else {
        alert("خطا در ذخیره تنظیمات.");
      }
    } catch (e) {
      alert("خطای سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      
      <div>
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-purple-400" />
          <span>تنظیمات فروشگاه و اطلاعات بانکی</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          ویرایش آدرس شعبه اصفهان، شماره‌های تماس، ساعات کاری و شماره حساب جهت کارت‌به‌کارت
        </p>
      </div>

      {success && (
        <div className="bg-emerald-950 border border-emerald-800 text-emerald-300 text-xs p-4 rounded-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>تنظیمات فروشگاه با موفقیت در دیتابیس PostgreSQL ذخیره شد.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Store Info Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
          <h2 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Building className="w-4 h-4 text-amber-400" />
            <span>مشخصات عمومی فروشگاه</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5">نام فروشگاه</label>
              <input
                type="text"
                value={settings["store_name"] || ""}
                onChange={(e) => handleChange("store_name", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">شعار تبلیغاتی</label>
              <input
                type="text"
                value={settings["store_slogan"] || ""}
                onChange={(e) => handleChange("store_slogan", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-400 font-bold mb-1.5">آدرس فروشگاه در اصفهان</label>
              <input
                type="text"
                value={settings["store_address"] || ""}
                onChange={(e) => handleChange("store_address", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Contact Numbers Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
          <h2 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>شماره‌های تماس و پیام‌رسان‌ها</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5">تلفن ثابت اصفهان</label>
              <input
                type="text"
                value={settings["store_phone"] || ""}
                onChange={(e) => handleChange("store_phone", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">شماره همراه و واتساپ</label>
              <input
                type="text"
                value={settings["store_mobile"] || ""}
                onChange={(e) => handleChange("store_mobile", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">آیدی کانال ایتا</label>
              <input
                type="text"
                value={settings["store_eitaa"] || ""}
                onChange={(e) => handleChange("store_eitaa", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-left"
              />
            </div>
          </div>
        </div>

        {/* Bank & Payment Card */}
        <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 space-y-4">
          <h2 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <CreditCard className="w-4 h-4 text-blue-400" />
            <span>اطلاعات کارت جهت واریز کارت به کارت</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 font-bold mb-1.5">شماره کارت ۱۶ رقمی</label>
              <input
                type="text"
                value={settings["card_number"] || ""}
                onChange={(e) => handleChange("card_number", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-left"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">نام صاحب حساب</label>
              <input
                type="text"
                value={settings["card_holder"] || ""}
                onChange={(e) => handleChange("card_holder", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-bold mb-1.5">نام بانک و شعبه</label>
              <input
                type="text"
                value={settings["bank_name"] || ""}
                onChange={(e) => handleChange("bank_name", e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
        </button>

      </form>
    </div>
  );
}
