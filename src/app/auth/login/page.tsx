"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
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
  Eye,
  EyeOff,
  Loader2,
  Wrench,
  FileText,
  Truck,
  RotateCcw,
  Check,
  Users,
  Scale,
  X,
  ExternalLink,
  MessageCircle,
  UserCheck,
} from "lucide-react";
import { toPersianDigits, toAsciiDigits, normalizeIranianPhone } from "@/lib/utils";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/account";

  // Unified auth steps: "phone" -> "password" or "otp"
  const [step, setStep] = useState<"phone" | "password" | "otp">("phone");
  const [phone, setPhone] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [userRole, setUserRole] = useState<string>("CUSTOMER");

  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [devCode, setDevCode] = useState("");
  const [timer, setTimer] = useState(120);
  const [termsModalOpen, setTermsModalOpen] = useState(false);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // 120s Countdown Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Focus first OTP input when step changes to OTP
  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 100);
    }
  }, [step]);

  // Step 1: Send OTP helper
  const triggerOtpSend = async (targetPhone: string) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: targetPhone }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStep("otp");
        setTimer(120);
        setOtpDigits(["", "", "", "", ""]);
        if (data.devCode) {
          setDevCode(data.devCode);
          setOtpDigits(data.devCode.split("").slice(0, 5));
        }
      } else {
        setErrorMsg(data.error || "خطا در ارسال کد تایید.");
      }
    } catch {
      setErrorMsg("خطای سرور در ارسال پیامک.");
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Handle Phone Submit & Route by Capability
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = normalizeIranianPhone(phone);

    if (!cleanPhone || !/^09\d{9}$/.test(cleanPhone)) {
      setErrorMsg("لطفاً شماره موبایل ۱۱ رقمی معتبر وارد نمایید (مثال: 09132456789)");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const checkRes = await fetch("/api/auth/check-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: cleanPhone }),
      });

      const checkData = await checkRes.json();
      if (!checkRes.ok) {
        setErrorMsg(checkData.error || "خطا در بررسی حساب کاربری.");
        setLoading(false);
        return;
      }

      setIsNewUser(!checkData.exists);
      setHasPassword(Boolean(checkData.hasPassword));
      setUserRole(checkData.role || "CUSTOMER");
      if (checkData.name) {
        setCustomerName(checkData.name);
      }

      if (checkData.hasPassword) {
        // Admin or account with password configured
        setStep("password");
        setLoading(false);
      } else {
        // Customer or account without password -> send SMS OTP
        await triggerOtpSend(cleanPhone);
      }
    } catch {
      setErrorMsg("خطای سرور در برقراری ارتباط.");
      setLoading(false);
    }
  };

  // Switch from Password to OTP option
  const handleSwitchToOtp = async () => {
    const cleanPhone = normalizeIranianPhone(phone);
    if (!cleanPhone) return;
    await triggerOtpSend(cleanPhone);
  };

  // Handle Admin / Password Login
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = normalizeIranianPhone(phone);
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone: cleanPhone,
        password: password.trim(),
      });

      if (res?.ok) {
        const dest =
          callbackUrl !== "/account"
            ? callbackUrl
            : userRole === "ADMIN"
            ? "/admin"
            : "/account";
        router.push(dest);
        router.refresh();
      } else {
        setErrorMsg("شماره همراه یا کلمه عبور وارد شده نادرست است.");
      }
    } catch {
      setErrorMsg("خطا در برقراری ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join("");
    const cleanCode = toAsciiDigits(code.trim());

    if (cleanCode.length !== 5) {
      setErrorMsg("لطفاً کد تایید ۵ رقمی را کامل وارد نمایید.");
      return;
    }

    const cleanPhone = normalizeIranianPhone(phone);
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone: cleanPhone,
        otpCode: cleanCode,
        name: customerName.trim() || undefined,
      });

      if (res?.ok) {
        const dest =
          callbackUrl !== "/account"
            ? callbackUrl
            : userRole === "ADMIN"
            ? "/admin"
            : "/account";
        router.push(dest);
        router.refresh();
      } else {
        setErrorMsg("کد تایید وارد شده نامعتبر یا منقضی شده است.");
      }
    } catch {
      setErrorMsg("خطا در ورود به حساب کاربری.");
    } finally {
      setLoading(false);
    }
  };

  // OTP Digits Handling with Auto-Advance & Paste
  const handleDigitChange = (index: number, val: string) => {
    const ascii = toAsciiDigits(val).replace(/\D/g, "");
    if (!ascii) {
      const newDigits = [...otpDigits];
      newDigits[index] = "";
      setOtpDigits(newDigits);
      return;
    }

    const lastChar = ascii.slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = lastChar;
    setOtpDigits(newDigits);

    if (index < 4) {
      otpInputsRef.current[index + 1]?.focus();
    } else {
      const fullCode = newDigits.join("");
      if (fullCode.length === 5) {
        // Auto-submit immediately if user is known or already filled their name
        if (!isNewUser || customerName.trim()) {
          handleVerifyOtp(fullCode);
        }
      }
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = toAsciiDigits(e.clipboardData.getData("text")).replace(/\D/g, "").slice(0, 5);
    if (pasteData.length > 0) {
      const newDigits = ["", "", "", "", ""];
      for (let i = 0; i < pasteData.length; i++) {
        newDigits[i] = pasteData[i];
      }
      setOtpDigits(newDigits);

      if (pasteData.length === 5) {
        otpInputsRef.current[4]?.focus();
        if (!isNewUser || customerName.trim()) {
          handleVerifyOtp(pasteData);
        }
      } else {
        otpInputsRef.current[pasteData.length]?.focus();
      }
    }
  };

  return (
    <div className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 transition-all duration-300">
      
      {/* Right Column (Desktop): Brand Identity & Trust Panel */}
      <div className="lg:col-span-5 bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 text-slate-950 p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
        
        {/* Ambient Glow & Lightning watermark */}
        <div className="absolute -left-10 -bottom-10 opacity-15 pointer-events-none">
          <Zap className="w-64 h-64 fill-slate-950" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-11 h-11 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-black shadow-lg">
              <Zap className="w-6 h-6 fill-amber-400" />
            </div>
            <div>
              <h2 className="font-black text-base text-slate-950 leading-tight">فروشگاه و کارگاه شیاسی</h2>
              <span className="text-[11px] font-bold text-slate-900/80">مرکز تخصصی برق و تعمیرات نجف‌آباد</span>
            </div>
          </div>

          <p className="text-xs text-slate-900/90 leading-relaxed font-medium pt-2">
            با ورود به سامانه، از خدمات تخصصی، گارانتی قطعات و پیگیری زنده سفارش‌های خود بهره‌مند شوید.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="relative z-10 space-y-3 my-6 text-xs font-bold text-slate-950">
          <div className="flex items-center gap-2.5 bg-slate-950/10 backdrop-blur-xs p-3 rounded-2xl border border-slate-950/15">
            <div className="w-7 h-7 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
              <Wrench className="w-3.5 h-3.5" />
            </div>
            <span>پیگیری آنلاین وضعیت تعمیرات کارگاه (کولر، پنکه، بخاری)</span>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-950/10 backdrop-blur-xs p-3 rounded-2xl border border-slate-950/15">
            <div className="w-7 h-7 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
              <FileText className="w-3.5 h-3.5" />
            </div>
            <span>صدور و دانلود پیش‌فاکتور رسمی و سوابق خرید</span>
          </div>

          <div className="flex items-center gap-2.5 bg-slate-950/10 backdrop-blur-xs p-3 rounded-2xl border border-slate-950/15">
            <div className="w-7 h-7 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center shrink-0">
              <Truck className="w-3.5 h-3.5" />
            </div>
            <span>ارسال فوری با پیک در نجف‌آباد و سراسر اصفهان</span>
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 pt-2 border-t border-slate-950/20 text-[11px] text-slate-900/80 font-medium flex items-center justify-between">
          <div>
            <span>پشتیبانی: </span>
            <bdi dir="ltr" className="font-mono font-bold">۰۳۱-۴۲۶۲۶۱۱۶</bdi>
          </div>
          <span>شعبه ۱۵ خرداد مرکزی نجف‌آباد</span>
        </div>

      </div>

      {/* Left Column: Unified Form & Interaction */}
      <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
        
        <div className="space-y-5">
          
          {/* Header Title */}
          <div>
            <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {step === "phone"
                ? "ورود یا ثبت‌نام در فروشگاه شیاسی"
                : step === "password"
                ? "ورود با کلمه عبور مدیریت"
                : isNewUser
                ? "تکمیل ثبت‌نام و تایید حساب"
                : "تایید کد پیامکی ورود"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {step === "phone"
                ? "شماره تلفن همراه خود را وارد کنید تا به صورت خودکار به حساب خود هدایت شوید."
                : step === "password"
                ? `کلمه عبور حساب مدیریت مربوط به شماره ${toPersianDigits(phone)} را وارد کنید.`
                : `کد ۵ رقمی ارسال شده به شماره ${toPersianDigits(phone)} را وارد کنید.`}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 text-xs p-3.5 rounded-2xl border border-rose-200 dark:border-rose-900 font-medium animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* Step 1: Unified Single Phone Number Entry */}
          {step === "phone" && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  شماره تلفن همراه شما:
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    dir="ltr"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="۰۹۱۳۲۴۵۶۷۸۹"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl p-3 pr-4 pl-10 text-sm text-left font-mono tracking-wider focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 transition-colors"
                  />
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                </div>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1.5 block">
                  ورود مشتریان، پرسنل و مدیران از طریق همین فرم انجام می‌پذیرد.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال بررسی حساب...</span>
                  </>
                ) : (
                  <>
                    <span>ادامه</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2A: Password Entry for Admins */}
          {step === "password" && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
              <div className="bg-slate-100 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-500" />
                  <span>حساب مدیریت: <strong>{toPersianDigits(phone)}</strong></span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setPassword("");
                    setErrorMsg("");
                  }}
                  className="text-amber-700 dark:text-amber-400 font-bold hover:underline text-[11px] cursor-pointer"
                >
                  تغییر شماره
                </button>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  کلمه عبور مدیریت:
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-2xl p-3 pr-4 pl-10 text-sm text-left font-mono focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 dark:bg-amber-500 dark:hover:bg-amber-400 disabled:opacity-50 text-white dark:text-slate-950 font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال احراز هویت...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>ورود با رمز عبور</span>
                  </>
                )}
              </button>

              {/* Prominent Instant Toggle to SMS OTP */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSwitchToOtp}
                  className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all border border-slate-200 dark:border-slate-700 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span>ورود با کد یکبار مصرف پیامکی (OTP)</span>
                </button>
              </div>
            </form>
          )}

          {/* Step 2B: 5-Digit Segmented OTP for Customers & Admins via SMS */}
          {step === "otp" && (
            <div className="space-y-5 text-xs">
              
              <div className="bg-amber-50 dark:bg-amber-950/40 p-3 rounded-2xl border border-amber-200 dark:border-amber-900 flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>کد تایید به شماره <strong>{toPersianDigits(phone)}</strong> پیامک شد.</span>
                <button
                  type="button"
                  onClick={() => {
                    setStep("phone");
                    setErrorMsg("");
                  }}
                  className="text-amber-700 dark:text-amber-400 font-bold hover:underline text-[11px] cursor-pointer"
                >
                  ویرایش شماره
                </button>
              </div>

              {devCode && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-bold flex items-center justify-between">
                  <span>کد آزمایشی برای ورود سریع:</span>
                  <span className="font-mono text-sm tracking-widest text-emerald-600 dark:text-emerald-400">{devCode}</span>
                </div>
              )}

              {/* Inline Name Prompt for New Accounts */}
              {isNewUser && (
                <div className="bg-blue-50/70 dark:bg-blue-950/40 p-3.5 rounded-2xl border border-blue-200 dark:border-blue-900/80 space-y-1.5 animate-in fade-in">
                  <label className="block font-bold text-slate-800 dark:text-slate-200 text-xs">
                    نام و نام خانوادگی خریدار (اختیاری):
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="مثال: علیرضا شیاسی"
                    className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block">
                    جهت درج رسمی بر روی فاکتور و برچسب بسته‌بندی مرسوله.
                  </span>
                </div>
              )}

              {/* 5 Segmented Boxes */}
              <div className="space-y-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 text-center mb-1">
                  کد تایید ۵ رقمی را وارد کنید:
                </label>

                <div className="flex items-center justify-center gap-2.5 sm:gap-3" dir="ltr" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleDigitKeyDown(idx, e)}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-black font-mono bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:border-amber-500 focus:bg-white dark:focus:bg-slate-850 focus:ring-4 focus:ring-amber-500/20 text-slate-900 dark:text-white transition-all transform active:scale-95"
                    />
                  ))}
                </div>
              </div>

              {/* Countdown Timer & Resend */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
                {timer > 0 ? (
                  <span>ارسال مجدد کد پس از: <strong className="font-mono text-amber-600 dark:text-amber-400">{toPersianDigits(timer)} ثانیه</strong></span>
                ) : (
                  <button
                    type="button"
                    onClick={() => triggerOtpSend(normalizeIranianPhone(phone))}
                    className="text-amber-600 dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ارسال مجدد کد تایید</span>
                  </button>
                )}

                {hasPassword && (
                  <button
                    type="button"
                    onClick={() => {
                      setStep("password");
                      setErrorMsg("");
                    }}
                    className="text-slate-500 hover:text-amber-500 underline text-[11px] cursor-pointer"
                  >
                    ورود با رمز عبور
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => handleVerifyOtp()}
                disabled={loading || otpDigits.join("").length !== 5}
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs sm:text-sm rounded-2xl transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 active:scale-95 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>در حال بررسی و ورود...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isNewUser ? "تکمیل ثبت‌نام و ورود" : "تایید و ورود به حساب کاربری"}</span>
                  </>
                )}
              </button>
            </div>
          )}

        </div>

        {/* Footer Legal Terms with Popup Trigger */}
        <div className="pt-4 text-center text-[11px] text-slate-400 dark:text-slate-500 border-t border-slate-100 dark:border-slate-800">
          با ورود به سیستم،{" "}
          <button
            type="button"
            onClick={() => setTermsModalOpen(true)}
            className="text-amber-600 dark:text-amber-400 font-bold underline hover:text-amber-500 cursor-pointer inline-flex items-center gap-0.5"
          >
            <span>قوانین و حریم خصوصی</span>
          </button>{" "}
          فروشگاه شیاسی را می‌پذیرید.
        </div>

      </div>

      {/* Interactive Terms & Privacy Modal Popup */}
      {termsModalOpen && (
        <div
          onClick={() => setTermsModalOpen(false)}
          className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-2xl max-h-[85vh] rounded-3xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between space-y-4 animate-in zoom-in-95"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm sm:text-base text-slate-900 dark:text-white">
                    شرایط، قوانین و حریم خصوصی فروشگاه شیاسی
                  </h3>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block mt-0.5">
                    خلاصه ضوابط خرید، گارانتی و خدمات کارگاه نجف‌آباد
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setTermsModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto pr-1 space-y-3.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-[50vh]">
              
              <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <strong className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                  <span>۱. احراز هویت پیامکی و حساب کاربری:</span>
                </strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  ورود مشتریان با کد تایید یکبار مصرف (OTP) انجام می‌شود. حفظ اطلاعات خط تلفن همراه بر عهده خریدار است.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <strong className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>۲. اصالت ۱۰۰٪ مس سیم و کابل استاندارد:</span>
                </strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  کلیه سیم‌ها و کابل‌های ساختمانی و صنعتی از مس خالص آنیل‌شده و دارای تاییدیه استاندارد ملی و توانیر می‌باشند.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <strong className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500" />
                  <span>۳. هفت روز مهلت تست تعمیرات کارگاه نجف‌آباد:</span>
                </strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  سیم‌پیچی و تعمیرات تخصصی انواع پنکه، موتور کولر و بخاری برقی دارای ۷ روز مهلت تست فنی و گارانتی کارکرد می‌باشند.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <strong className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  <span>۴. رویه ارسال و ضمانت ۷ روزه عودت وجه:</span>
                </strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  ارسال سریع با پیک در نجف‌آباد و سراسر کشور. در صورت نقص فنی، امکان بازگشت کالا و عودت وجه ظرف ۷ روز وجود دارد.
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-850 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1">
                <strong className="font-black text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>۵. حفظ حریم خصوصی و درگاه امن شاپرک:</span>
                </strong>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  اطلاعات هویتی و شماره تماس شما محرمانه باقی مانده و پرداخت‌ها در بستر شبکه امن شاپرک انجام می‌پذیرد.
                </p>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
              <Link
                href="/terms"
                target="_blank"
                className="text-[11px] text-slate-500 dark:text-slate-400 hover:text-amber-500 flex items-center gap-1 font-bold order-2 sm:order-1"
              >
                <span>مطالعه نسخه کامل در صفحه مجزا</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <button
                type="button"
                onClick={() => setTermsModalOpen(false)}
                className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shadow-amber-500/20 cursor-pointer active:scale-95 order-1 sm:order-2"
              >
                متوجه شدم و می‌پذیرم
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-[85vh] flex items-center justify-center py-12 px-4 transition-colors duration-200 relative overflow-hidden">
      
      {/* Ambient Electric Background Blur Highlights */}
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <Suspense fallback={<div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
