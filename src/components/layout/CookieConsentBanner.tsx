"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, ShieldCheck, X, Check } from "lucide-react";

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't already accepted or dismissed
    try {
      const localConsent = localStorage.getItem("shiasi_cookie_consent");
      const sessionConsent = sessionStorage.getItem("shiasi_cookie_consent");
      const cookieConsent = document.cookie
        .split("; ")
        .find((row) => row.startsWith("shiasi_cookie_consent="));

      if (!localConsent && !sessionConsent && !cookieConsent) {
        // Subtle delay so it doesn't flash on immediate paint
        const timer = setTimeout(() => {
          setVisible(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case storage is blocked by user privacy modes
    }
  }, []);

  const saveConsent = (status: "accepted" | "dismissed") => {
    try {
      localStorage.setItem("shiasi_cookie_consent", status);
      sessionStorage.setItem("shiasi_cookie_consent", status);
      // Persist for 1 year (31536000 seconds)
      document.cookie = `shiasi_cookie_consent=${status}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {}
    setVisible(false);
  };

  const handleAccept = () => {
    saveConsent("accepted");
  };

  const handleDismiss = () => {
    saveConsent("dismissed");
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="اطلاعیه کوکی‌های ضروری"
      className="fixed bottom-20 md:bottom-6 right-4 left-4 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 pointer-events-auto"
    >
      <div className="bg-slate-900/95 dark:bg-slate-900/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-2xl shadow-black/50 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-white">
                کوکی‌های ضروری و امنیت سبد خرید
              </h4>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>فاقد هرگونه ردیابی تبلیغاتی</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDismiss}
            aria-label="بستن موقت اطلاعیه"
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed text-justify font-medium">
          فروشگاه شیاسی برای پایداری اقلام سبد خرید، امنیت ورود با پیامک و عملکرد صحیح سامانه از کوکی‌های فنی استفاده می‌کند.
        </p>

        <div className="flex items-center justify-between gap-3 pt-1 text-xs">
          <Link
            href="/cookies"
            className="text-amber-400 hover:text-amber-300 underline font-medium text-[11px] hover:underline transition-colors"
          >
            مطالعه سیاست کوکی‌ها
          </Link>

          <button
            type="button"
            onClick={handleAccept}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 flex items-center gap-1 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>متوجه شدم</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
