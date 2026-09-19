"use client";

import React, { useState } from "react";
import { KeyRound, Store, Shield } from "lucide-react";
import { AdminPasswordSection } from "./AdminPasswordSection";
import { SettingsAdminClient } from "./SettingsAdminClient";

interface AdminSettingsClientProps {
  initialSettings: Record<string, string>;
}

export function AdminSettingsClient({ initialSettings }: AdminSettingsClientProps) {
  const [activeTab, setActiveTab] = useState<"security" | "store">("security");

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header and Tab Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Shield className="w-6 h-6 text-purple-400" />
            <span>تنظیمات مدیریت و امنیت حساب</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            مدیریت کلمه عبور اختصاصی، نشست‌های فعال و تنظیمات فنی فروشگاه شیاسی
          </p>
        </div>

        {/* Accessible Tabs */}
        <div className="flex items-center gap-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "security"}
            onClick={() => setActiveTab("security")}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition focus:ring-2 focus:ring-primary-500 focus:outline-none ${
              activeTab === "security"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>امنیت و کلمه عبور</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "store"}
            onClick={() => setActiveTab("store")}
            className={`min-h-[44px] px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition focus:ring-2 focus:ring-primary-500 focus:outline-none ${
              activeTab === "store"
                ? "bg-purple-600 text-white shadow-md shadow-purple-900/40"
                : "text-slate-400 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Store className="w-4 h-4" />
            <span>اطلاعات و لجستیک فروشگاه</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "security" && (
        <div role="tabpanel" aria-label="امنیت و کلمه عبور">
          <AdminPasswordSection />
        </div>
      )}

      {activeTab === "store" && (
        <div role="tabpanel" aria-label="اطلاعات و لجستیک فروشگاه">
          <SettingsAdminClient initialSettings={initialSettings} />
        </div>
      )}
    </div>
  );
}
