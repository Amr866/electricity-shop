"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Phone,
  KeyRound,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Zap,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  const [mode, setMode] = useState<"customer" | "admin">("customer");
  const [phone, setPhone] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [devCode, setDevCode] = useState("");
  const [timer, setTimer] = useState(120);

  useEffect(() => {
    let interval: any;
    if (otpStep && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpStep, timer]);

  // Step 1: Request OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !/^09\d{9}$/.test(phone.trim())) {
      setErrorMsg("لطفاً شماره موبایل ۱۱ رقمی معتبر وارد نمایید (مثال: 09131112233)");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOtpStep(true);
        setTimer(120);
        if (data.devCode) {
          setDevCode(data.devCode);
          setOtpCode(data.devCode); // Auto-fill in dev mode
        }
      } else {
        setErrorMsg(data.error || "خطا در ارسال کد تایید");
      }
    } catch (err) {
      setErrorMsg("خطای ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and Sign In
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone: phone.trim(),
        otpCode: otpCode.trim(),
      });

      if (res?.ok) {
        router.push(callbackUrl);
        router.refresh();
      } else {
        setErrorMsg("کد تایید وارد شده نامعتبر یا منقضی شده است.");
      }
    } catch (err) {
      setErrorMsg("خطا در ورود به حساب کاربری.");
    } finally {
      setLoading(false);
    }
  };

  // Admin Password Login
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone: phone.trim(),
        password: password.trim(),
      });

      if (res?.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setErrorMsg("شماره همراه یا کلمه عبور ادمین نادرست است.");
      }
    } catch (err) {
      setErrorMsg("خطا در برقراری ارتباط.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-slate-900 dark:text-white transition-colors duration-200">
      {/* Top Logo & Title */}
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto shadow-md shadow-amber-500/20">
          <Zap className="w-7 h-7 fill-slate-950" />
        </div>
        <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
          ورود و عضویت در فروشگاه شیاسی
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          پیگیری سفارشات، فاکتورها و وضعیت تعمیرات لوازم برقی در نجف‌آباد
        </p>
      </div>

      {/* Tab Switcher: Customer vs Admin */}
      <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold text-slate-600 dark:text-slate-300">
        <button
          onClick={() => {
            setMode("customer");
            setErrorMsg("");
            setOtpStep(false);
          }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            mode === "customer" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          ورود مشتری (کد پیامکی OTP)
        </button>
        <button
          onClick={() => {
            setMode("admin");
            setErrorMsg("");
          }}
          className={`flex-1 py-2 rounded-xl transition-all ${
            mode === "admin" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm" : "hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          ورود مدیریت (ادمین)
        </button>
      </div>

      {errorMsg && (
        <div className="bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-xs p-3 rounded-xl border border-rose-200 dark:border-rose-900">
          {errorMsg}
        </div>
      )}

      {/* Customer Mode: Step 1 Enter Phone */}
      {mode === "customer" && !otpStep && (
        <form onSubmit={handleSendOtp} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              شماره موبایل خود را وارد کنید:
            </label>
            <div className="relative">
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="۰۹۱۳..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-xs text-left font-mono tracking-wider focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{loading ? "در حال ارسال کد..." : "دریافت کد تایید ۵ رقمی"}</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* Customer Mode: Step 2 Enter OTP */}
      {mode === "customer" && otpStep && (
        <form onSubmit={handleVerifyOtp} className="space-y-4 text-xs">
          <div className="bg-amber-50/70 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200/80 dark:border-amber-800 space-y-1 text-slate-700 dark:text-slate-300">
            <div className="flex items-center justify-between">
              <span>کد تایید به شماره <strong>{toPersianDigits(phone)}</strong> ارسال شد.</span>
              <button
                type="button"
                onClick={() => setOtpStep(false)}
                className="text-amber-700 dark:text-amber-400 font-bold hover:underline text-[11px]"
              >
                ویرایش شماره
              </button>
            </div>
            {devCode && (
              <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-bold pt-1">
                کد آزمایشی برای ورود سریع: <strong className="font-mono">{devCode}</strong>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              کد تایید ۵ رقمی:
            </label>
            <input
              type="text"
              required
              maxLength={5}
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              placeholder="۱۲۳۴۵"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-center text-lg font-mono font-bold tracking-widest focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            {timer > 0 ? (
              <span>ارسال مجدد کد پس از: <strong>{toPersianDigits(timer)} ثانیه</strong></span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
              >
                ارسال مجدد کد تایید
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? "در حال تایید..." : "تایید و ورود به حساب"}</span>
          </button>
        </form>
      )}

      {/* Admin Login Mode */}
      {mode === "admin" && (
        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              شماره همراه مدیر:
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="09131112233"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-xs text-left font-mono focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              کلمه عبور مدیریت:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-3 text-xs text-left font-mono focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400">
            پیش‌فرض تست: همراه: <code>09131112233</code> | رمز: <code>admin123</code>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 disabled:opacity-50 text-white dark:text-slate-950 font-black text-xs sm:text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            <Lock className="w-4 h-4" />
            <span>{loading ? "در حال احراز هویت..." : "ورود به پنل مدیریت"}</span>
          </button>
        </form>
      )}

      <div className="pt-2 text-center text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
        با ورود به سایت، شرایط و قوانین فروشگاه تخصصی شیاسی را می‌پذیرید.
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-[80vh] flex items-center justify-center py-12 px-4 transition-colors duration-200">
      <Suspense fallback={<div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
