"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ShieldCheck, KeyRound, Loader2 } from "lucide-react";

export function AdminPasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Live Password Strength calculations
  const hasMinLength = newPassword.length >= 8;
  const hasLetter = /[A-Za-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const isMatch = newPassword.length > 0 && newPassword === confirmPassword;

  const strengthScore = [hasMinLength, hasLetter, hasNumber].filter(Boolean).length;
  const isFormValid = hasMinLength && hasLetter && hasNumber && isMatch && currentPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!currentPassword) {
      setErrorMessage("لطفاً کلمه عبور فعلی خود را وارد کنید.");
      return;
    }

    if (!hasMinLength || !hasLetter || !hasNumber) {
      setErrorMessage("کلمه عبور جدید باید حداقل ۸ کاراکتر و شامل حروف انگلیسی و ارقام باشد.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("کلمه عبور جدید با تکرار آن مطابقت ندارد.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMessage(data.message || "خطایی در به‌روزرسانی کلمه عبور رخ داد.");
      } else {
        setSuccessMessage(data.message || "کلمه عبور با موفقیت به‌روزرسانی شد. نشست‌های سایر دستگاه‌ها منقضی گردیدند.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setErrorMessage("خطای ارتباط با سرور. لطفاً اتصال اینترنت خود را بررسی کنید.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-right">
      <div className="flex items-center gap-3 border-b border-slate-800/80 pb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <KeyRound className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">تغییر کلمه عبور و امنیت حساب</h2>
          <p className="text-xs text-slate-400">
            گذرواژه خود را به‌صورت دوره‌ای تغییر دهید. پس از تغییر، نشست‌های شما روی سایر دستگاه‌ها برای حفظ امنیت به‌طور خودکار بسته می‌شوند.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div
          role="alert"
          aria-live="polite"
          className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-3 text-red-200 text-sm"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          aria-live="polite"
          className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3 text-emerald-200 text-sm"
        >
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{successMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Current Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="current-password"
            className="block text-sm font-medium text-slate-300"
          >
            کلمه عبور فعلی <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              id="current-password"
              type={showCurrent ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="کلمه عبور فعلی خود را وارد کنید"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 pl-12 text-sm text-white placeholder-slate-500 min-h-[44px] focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-transparent transition"
              dir="ltr"
              required
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              aria-label={showCurrent ? "مخفی کردن کلمه عبور فعلی" : "نمایش کلمه عبور فعلی"}
              className="absolute left-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="new-password"
            className="block text-sm font-medium text-slate-300"
          >
            کلمه عبور جدید <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              id="new-password"
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="حداقل ۸ کاراکتر شامل حروف و ارقام"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 pl-12 text-sm text-white placeholder-slate-500 min-h-[44px] focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-transparent transition"
              dir="ltr"
              required
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              aria-label={showNew ? "مخفی کردن کلمه عبور جدید" : "نمایش کلمه عبور جدید"}
              className="absolute left-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Strength Meter */}
          {newPassword.length > 0 && (
            <div className="pt-2 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>قدرت کلمه عبور:</span>
                <span className={strengthScore === 3 ? "text-emerald-400 font-bold" : strengthScore === 2 ? "text-amber-400 font-bold" : "text-rose-400 font-bold"}>
                  {strengthScore === 3 ? "قوی (مورد قبول)" : strengthScore === 2 ? "متوسط" : "ضعیف"}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex gap-1">
                <div
                  className={`h-full flex-1 transition-all rounded-full ${
                    strengthScore >= 1
                      ? strengthScore === 3
                        ? "bg-emerald-500"
                        : strengthScore === 2
                        ? "bg-amber-500"
                        : "bg-rose-500"
                      : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full flex-1 transition-all rounded-full ${
                    strengthScore >= 2
                      ? strengthScore === 3
                        ? "bg-emerald-500"
                        : "bg-amber-500"
                      : "bg-transparent"
                  }`}
                />
                <div
                  className={`h-full flex-1 transition-all rounded-full ${
                    strengthScore === 3 ? "bg-emerald-500" : "bg-transparent"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-xs">
                <span className={`flex items-center gap-1.5 ${hasMinLength ? "text-emerald-400" : "text-slate-500"}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  حداقل ۸ کاراکتر
                </span>
                <span className={`flex items-center gap-1.5 ${hasLetter ? "text-emerald-400" : "text-slate-500"}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  حداقل یک حرف انگلیسی
                </span>
                <span className={`flex items-center gap-1.5 ${hasNumber ? "text-emerald-400" : "text-slate-500"}`}>
                  <ShieldCheck className="w-3.5 h-3.5" />
                  حداقل یک رقم
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-slate-300"
          >
            تکرار کلمه عبور جدید <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              id="confirm-password"
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="تکرار کلمه عبور جدید را وارد کنید"
              className="w-full bg-slate-950/60 border border-slate-700/80 rounded-xl px-4 py-3 pl-12 text-sm text-white placeholder-slate-500 min-h-[44px] focus:ring-2 focus:ring-primary-500 focus:outline-none focus:border-transparent transition"
              dir="ltr"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label={showConfirm ? "مخفی کردن تکرار کلمه عبور" : "نمایش تکرار کلمه عبور"}
              className="absolute left-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
            >
              {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          {confirmPassword.length > 0 && !isMatch && (
            <p className="text-xs text-rose-400 pt-1">کلمه عبور جدید با تکرار آن مطابقت ندارد.</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="min-h-[44px] px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 active:scale-95 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-sm shadow-lg shadow-purple-900/30 flex items-center justify-center gap-2 transition focus:ring-2 focus:ring-primary-500 focus:outline-none"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>در حال ذخیره و به‌روزرسانی نشست...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>تغییر کلمه عبور و ابطال سایر نشست‌ها</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
