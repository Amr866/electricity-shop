"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/context/CartContext";
import {
  formatToman,
  toPersianDigits,
  toAsciiDigits,
  SHIPPING_METHODS,
  PAYMENT_METHODS,
  ISFAHAN_DISTRICTS,
} from "@/lib/utils";
import {
  MapPin,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Building,
  Phone,
  FileText,
  ShieldCheck,
  Zap,
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const { items, itemCount, subtotal, discount, total, clearCart } = useCart();

  // Form states
  const [customerName, setCustomerName] = useState(session?.user?.name || "");
  const [customerPhone, setCustomerPhone] = useState((session?.user as any)?.phone || "");
  const [customerEmail, setCustomerEmail] = useState("");
  const [province, setProvince] = useState("اصفهان");
  const [city, setCity] = useState("نجف‌آباد");
  const [district, setDistrict] = useState("نجف‌آباد - مرکز");
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [notes, setNotes] = useState("");

  // Corporate Invoice States
  const [isCorporate, setIsCorporate] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [economicCode, setEconomicCode] = useState("");

  const [selectedShipping, setSelectedShipping] = useState("isfahan_express");
  const [selectedPayment, setSelectedPayment] = useState("zarinpal");
  const [cardReceiptProof, setCardReceiptProof] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Sync session user details when loaded
  React.useEffect(() => {
    if (session?.user) {
      if (session.user.name && !customerName) setCustomerName(session.user.name);
      if (session.user.phone && !customerPhone) setCustomerPhone(session.user.phone);
    }
  }, [session]);

  // Calculate final shipping cost and grand total
  const shippingMethod =
    SHIPPING_METHODS.find((s) => s.id === selectedShipping) || SHIPPING_METHODS[0];
  const shippingCost = shippingMethod.cost;
  const grandTotal = total + shippingCost;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    // 1. Basic validation
    if (!customerName.trim() || !customerPhone.trim() || !address.trim()) {
      setErrorMsg("لطفاً نام، شماره همراه و آدرس دقیق را وارد نمایید.");
      return;
    }

    // 2. Phone validation (Iranian 11 digits: 09xxxxxxxxx)
    const cleanPhone = toAsciiDigits(customerPhone).replace(/\D/g, "");
    if (cleanPhone.length !== 11 || !cleanPhone.startsWith("09")) {
      setErrorMsg("شماره همراه باید ۱۱ رقم بوده و با ۰۹ شروع شود (مانند ۰۹۱۳۱۱۱۲۲۳۳).");
      return;
    }

    // 3. Postal Code validation (Strictly required for Post/Tipax and 10 digits)
    const cleanPostal = toAsciiDigits(postalCode).replace(/\D/g, "");
    if (selectedShipping === "post_pishtaz" || selectedShipping === "tipax") {
      if (!cleanPostal || cleanPostal.length !== 10) {
        setErrorMsg("برای ارسال با پست پیشتاز یا تیپاکس، وارد کردن کد پستی ۱۰ رقمی الزامی است.");
        return;
      }
    } else if (cleanPostal && cleanPostal.length !== 10) {
      setErrorMsg("کد پستی باید دقیقاً ۱۰ رقم باشد.");
      return;
    }

    // 4. Corporate fields validation
    if (isCorporate && (!companyName.trim() || !nationalCode.trim())) {
      setErrorMsg("برای صدور فاکتور رسمی حقوقی، وارد کردن نام شرکت و شناسه ملی الزامی است.");
      return;
    }

    setSubmitting(true);

    const fullAddress = `${province}، ${city} - ${address}`;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          customerPhone: cleanPhone,
          customerEmail,
          userId: (session?.user as any)?.id || null,
          province,
          city,
          postalCode: cleanPostal || null,
          address: fullAddress,
          isCorporate,
          companyName: isCorporate ? companyName : null,
          nationalCode: isCorporate ? nationalCode : null,
          economicCode: isCorporate ? economicCode : null,
          shippingMethod: selectedShipping,
          shippingCost,
          paymentMethod: selectedPayment,
          receiptImage: cardReceiptProof || null,
          notes,
          items,
          subtotal,
          discount,
          totalAmount: grandTotal,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "خطا در ایجاد سفارش.");
        setSubmitting(false);
      } else {
        clearCart();
        router.push(data.redirectUrl);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("خطای ارتباط با سرور. لطفاً دوباره تلاش کنید.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 transition-colors duration-200">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="font-extrabold text-base text-slate-900 dark:text-white">سبد خرید شما خالی است!</h2>
            <Link
              href="/products"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
            >
              بازگشت به کاتالوگ فروشگاه
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Title */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>ثبت نهایی سفارش و اطلاعات ارسال (فروشگاه شیاسی)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            تحویل اختصاصی در نجف‌آباد، ویلاشهر، گلدشت و اصفهان (اسنپ‌باکس)، یا تیپاکس سراسر ایران
          </p>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Col: Customer Info, Shipping & Payment Selection */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* 1. Customer Information & Address */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
                <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <span>اطلاعات تحویل‌گیرنده و نشانی دقیق</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      نام و نام خانوادگی <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="مثال: علیرضا شیاسی"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      شماره همراه (۱۱ رقم) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="۰۹۱۳۱۱۱۲۲۳۳"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      استان <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    >
                      <option value="اصفهان">اصفهان</option>
                      <option value="تهران">تهران</option>
                      <option value="فارس">فارس</option>
                      <option value="چهارمحال و بختیاری">چهارمحال و بختیاری</option>
                      <option value="یزد">یزد</option>
                      <option value="سایر استان‌ها">سایر استان‌ها</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      شهر / منطقه <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="مثال: نجف‌آباد"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    نشانی دقیق خیابان، کوچه، پلاک و واحد <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="مثال: نجف‌آباد، خیابان امام شرقی، کوچه بهار، پلاک ۲۴"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      کد پستی ۱۰ رقمی{" "}
                      {selectedShipping === "post_pishtaz" || selectedShipping === "tipax" ? (
                        <span className="text-rose-500 font-bold">(الزامی برای ارسال پستی)</span>
                      ) : (
                        <span className="text-slate-400 font-normal">(اختیاری)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="کد پستی ۱۰ رقمی"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      توضیحات و یادداشت برای انباردار
                    </label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="مثال: تحویل عصر"
                      className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Corporate / Official Invoice Checkbox */}
                <div className="pt-2 border-t border-slate-100 space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800">
                    <input
                      type="checkbox"
                      checked={isCorporate}
                      onChange={(e) => setIsCorporate(e.target.checked)}
                      className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500"
                    />
                    <span>درخواست صدور فاکتور رسمی / حقوقی (دارای شناسه ملی و کد اقتصادی)</span>
                  </label>

                  {isCorporate && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-amber-50/50 p-3.5 rounded-2xl border border-amber-200 animate-in fade-in">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          نام رسمی شرکت / ارگان: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required={isCorporate}
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          placeholder="نام شرکت"
                          className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          شناسه / کد ملی: <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required={isCorporate}
                          value={nationalCode}
                          onChange={(e) => setNationalCode(e.target.value)}
                          placeholder="شناسه ملی ۱۱ رقمی"
                          className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2 font-mono text-left"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          کد اقتصادی ۱۲ رقمی:
                        </label>
                        <input
                          type="text"
                          value={economicCode}
                          onChange={(e) => setEconomicCode(e.target.value)}
                          placeholder="کد اقتصادی"
                          className="w-full bg-white border border-slate-200 text-xs rounded-xl p-2 font-mono text-left"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 2. Shipping Method Selection */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>انتخاب شیوه ارسال مرسوله</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {SHIPPING_METHODS.map((method) => (
                    <label
                      key={method.id}
                      onClick={() => setSelectedShipping(method.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col justify-between ${
                        selectedShipping === method.id
                          ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-900">{method.title}</span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              method.isLocal
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {method.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 leading-snug">
                          {method.description}
                        </p>
                      </div>

                      <div className="pt-3 mt-2 border-t border-slate-100/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[10px]">{method.estimatedDays}</span>
                        <span className="font-extrabold text-slate-900">
                          {method.cost === 0 ? "رایگان" : formatToman(method.cost)}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Payment Method Selection */}
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h2 className="font-extrabold text-sm text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>انتخاب شیوه پرداخت</span>
                </h2>

                <div className="space-y-3">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.id}
                      onClick={() => setSelectedPayment(method.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all flex items-start justify-between gap-3 ${
                        selectedPayment === method.id
                          ? "border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center shrink-0 border ${
                            selectedPayment === method.id
                              ? "border-amber-600 bg-amber-500"
                              : "border-slate-300"
                          }`}
                        >
                          {selectedPayment === method.id && (
                            <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-900">{method.title}</span>
                            <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                              {method.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Conditional Card-to-Card Info Box */}
                {selectedPayment === "card_to_card" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2 text-xs text-blue-950">
                    <span className="font-bold block">اطلاعات حساب فروشگاه شیاسی (نجف‌آباد):</span>
                    <p>شماره کارت بانک ملی: <strong className="font-mono text-blue-900">۶۰۳۷-۹۹۷۵-۱۲۳۴-۵۶۷۸</strong></p>
                    <p>به نام: <strong>فروشگاه شیاسی</strong></p>
                    <div className="pt-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        شماره پیگیری واریز یا ۴ رقم آخر کارت شما:
                      </label>
                      <input
                        type="text"
                        value={cardReceiptProof}
                        onChange={(e) => setCardReceiptProof(e.target.value)}
                        placeholder="مثال: پیگیری ۹۸۲۳۴۱"
                        className="w-full bg-white border border-blue-300 text-xs rounded-xl px-3 py-2 text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Col: Order Summary & Pay Button */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5 sticky top-24">
                <h3 className="font-extrabold text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span>اقلام سفارش</span>
                  <span className="text-xs text-slate-500">{toPersianDigits(itemCount)} کالا</span>
                </h3>

                {/* Items preview list */}
                <div className="space-y-3 max-h-48 overflow-y-auto pr-1 text-xs">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 truncate">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-8 h-8 rounded-lg object-contain bg-slate-50 p-0.5 border border-slate-100 shrink-0"
                        />
                        <span className="text-slate-700 truncate">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-900 shrink-0">
                        {toPersianDigits(item.quantity)} × {formatToman(item.price)}
                      </span>
                    </div>
                  ))}
                </div>

                <hr className="border-slate-100" />

                {/* Financial breakdown */}
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>جمع اقلام:</span>
                    <span className="font-bold text-slate-900">{formatToman(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex items-center justify-between text-rose-600 font-bold">
                      <span>تخفیف:</span>
                      <span>- {formatToman(discount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span>هزینه ارسال ({shippingMethod.badge}):</span>
                    <span className="font-bold text-slate-900">
                      {shippingCost === 0 ? "رایگان" : formatToman(shippingCost)}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-baseline justify-between">
                    <span className="font-black text-sm text-slate-900">مجموع نهایی:</span>
                    <span className="font-black text-xl text-slate-950">
                      {formatToman(grandTotal)}
                    </span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-md shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <span>در حال پردازش سفارش...</span>
                  ) : selectedPayment === "zarinpal" ? (
                    <>
                      <span>پرداخت آنلاین با درگاه بانکی</span>
                      <ArrowLeft className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>ثبت و نهایی‌سازی سفارش</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-1 text-center">
                  <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    پرداخت امن و تضمین تحویل توسط فروشگاه شیاسی
                  </p>
                </div>
              </div>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
}
