"use client";

import React, { useState, useMemo } from "react";
import { formatToman, toPersianDigits, formatJalaliDate } from "@/lib/utils";
import {
  Tag,
  Plus,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
  X,
  Copy,
  Check,
  Percent,
  Coins,
  ShieldCheck,
  Sparkles,
  Search,
  Filter,
  CheckCheck,
} from "lucide-react";

export interface AdminCoupon {
  id: string;
  code: string;
  discountPercent?: number | null;
  discountAmount?: number | null;
  minOrderAmount?: number | null;
  isActive: boolean;
  createdAt?: string | Date;
}

interface CouponsAdminClientProps {
  initialCoupons: AdminCoupon[];
}

export function CouponsAdminClient({ initialCoupons }: CouponsAdminClientProps) {
  const [coupons, setCoupons] = useState<AdminCoupon[]>(initialCoupons);
  const [search, setSearch] = useState("");
  const [filterActive, setFilterActive] = useState<string>("ALL");
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AdminCoupon | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "amount">("percent");
  const [discountPercent, setDiscountPercent] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Copy feedback state
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const metrics = useMemo(() => {
    const total = coupons.length;
    const active = coupons.filter((c) => c.isActive).length;
    const percentCount = coupons.filter((c) => c.discountPercent && c.discountPercent > 0).length;
    const fixedCount = coupons.filter((c) => c.discountAmount && c.discountAmount > 0).length;

    return { total, active, percentCount, fixedCount };
  }, [coupons]);

  const openCreateModal = () => {
    setEditingCoupon(null);
    setCode("");
    setDiscountType("percent");
    setDiscountPercent("");
    setDiscountAmount("");
    setMinOrderAmount("");
    setIsActive(true);
    setErrorMsg("");
    setModalOpen(true);
  };

  const openEditModal = (c: AdminCoupon) => {
    setEditingCoupon(c);
    setCode(c.code);
    if (c.discountAmount && c.discountAmount > 0) {
      setDiscountType("amount");
      setDiscountAmount(c.discountAmount.toString());
      setDiscountPercent("");
    } else {
      setDiscountType("percent");
      setDiscountPercent((c.discountPercent || "").toString());
      setDiscountAmount("");
    }
    setMinOrderAmount((c.minOrderAmount || "").toString());
    setIsActive(c.isActive);
    setErrorMsg("");
    setModalOpen(true);
  };

  const handleCopy = (couponCode: string, id: string) => {
    navigator.clipboard.writeText(couponCode);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const isEdit = !!editingCoupon;
    const url = "/api/admin/coupons";
    const method = isEdit ? "PUT" : "POST";
    const payload = {
      ...(isEdit ? { id: editingCoupon.id } : {}),
      code,
      discountPercent: discountType === "percent" ? discountPercent : null,
      discountAmount: discountType === "amount" ? discountAmount : null,
      minOrderAmount,
      isActive,
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "خطا در ذخیره کد تخفیف.");
      } else {
        if (isEdit) {
          setCoupons((prev) =>
            prev.map((c) => (c.id === editingCoupon.id ? { ...c, ...data.coupon } : c))
          );
        } else {
          setCoupons([data.coupon, ...coupons]);
        }
        setModalOpen(false);
      }
    } catch {
      setErrorMsg("خطای سرور.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      if (res.ok) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !currentStatus } : c))
        );
      }
    } catch {
      alert("خطا در تغییر وضعیت.");
    }
  };

  const handleDelete = async (id: string, codeName: string) => {
    if (!confirm(`آیا از حذف کد تخفیف «${codeName}» اطمینان دارید؟`)) return;

    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCoupons((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("خطا در حذف کد تخفیف.");
      }
    } catch {
      alert("خطای سرور.");
    }
  };

  const filteredCoupons = useMemo(() => {
    return coupons.filter((c) => {
      const matchSearch = !search || c.code.toLowerCase().includes(search.toLowerCase());
      let matchActive = true;
      if (filterActive === "ACTIVE") matchActive = c.isActive;
      else if (filterActive === "INACTIVE") matchActive = !c.isActive;
      return matchSearch && matchActive;
    });
  }, [coupons, search, filterActive]);

  return (
    <div className="space-y-6">
      
      {/* 1. Header & Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-rose-400" />
            <span>مدیریت کدهای تخفیف و بن‌های خرید</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            تعریف کدهای تخفیف درصدی و مبلغ ثابت، جشنواره‌های فروش و بن‌های وفاداری نجف‌آباد
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-4 py-2.5 rounded-2xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>تعریف کد تخفیف جدید</span>
        </button>
      </div>

      {/* 2. Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-bold block">کل کدهای ثبت‌شده:</span>
          <p className="text-xl font-black text-white font-mono">{toPersianDigits(metrics.total)} کد</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-bold block">کدهای فعال آماده استفاده:</span>
          <p className="text-xl font-black text-emerald-400 font-mono">{toPersianDigits(metrics.active)} کد</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-bold block">تخفیف‌های درصدی (%):</span>
          <p className="text-xl font-black text-amber-400 font-mono">{toPersianDigits(metrics.percentCount)} کد</p>
        </div>
        <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800 space-y-1">
          <span className="text-[11px] text-slate-400 font-bold block">تخفیف‌های مبلغ ثابت (تومان):</span>
          <p className="text-xl font-black text-blue-400 font-mono">{toPersianDigits(metrics.fixedCount)} کد</p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xl">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="جستجوی کد تخفیف (مثال: REPAIR50, NAJAFABAD)..."
            className="w-full bg-slate-800 border border-slate-700 text-white text-xs rounded-xl pr-9 pl-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {["ALL", "ACTIVE", "INACTIVE"].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterActive(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                filterActive === t
                  ? "bg-amber-500 text-slate-950 shadow-xs"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {t === "ALL" ? "همه" : t === "ACTIVE" ? "فقط فعال" : "غیرفعال"}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Coupons Cards / Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCoupons.length === 0 ? (
          <div className="col-span-full bg-slate-900 rounded-3xl p-8 border border-slate-800 text-center space-y-2">
            <Tag className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">کد تخفیفی با این مشخصات یافت نشد</h3>
          </div>
        ) : (
          filteredCoupons.map((c) => (
            <div
              key={c.id}
              className={`bg-slate-900 rounded-3xl p-5 border space-y-4 shadow-xl transition-all duration-200 animate-in fade-in flex flex-col justify-between ${
                c.isActive ? "border-slate-800 hover:border-slate-700" : "border-slate-850 opacity-70"
              }`}
            >
              
              {/* Top: Code + Copy + Status Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-slate-800/90 border border-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-2">
                    <span className="font-mono font-black text-sm text-amber-400 tracking-wider">
                      {c.code}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(c.code, c.id)}
                      className="text-slate-400 hover:text-white cursor-pointer"
                      title="کپی کد تخفیف"
                    >
                      {copiedCode === c.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Active Toggle Switch */}
                <button
                  type="button"
                  onClick={() => handleToggleActive(c.id, c.isActive)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black border transition-all cursor-pointer flex items-center gap-1 ${
                    c.isActive
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-800 hover:bg-emerald-900"
                      : "bg-rose-950/80 text-rose-300 border-rose-800 hover:bg-rose-900"
                  }`}
                  title="تغییر وضعیت فعال / غیرفعال"
                >
                  {c.isActive ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>فعال</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3 h-3 text-rose-400" />
                      <span>غیرفعال</span>
                    </>
                  )}
                </button>
              </div>

              {/* Discount Value Info */}
              <div className="bg-slate-800/40 p-3 rounded-2xl border border-slate-800 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 text-[11px]">میزان تخفیف:</span>
                  <strong className="text-white font-mono font-bold text-sm">
                    {c.discountPercent
                      ? `${toPersianDigits(c.discountPercent)}٪ درصدی`
                      : c.discountAmount
                      ? `${formatToman(c.discountAmount)} ثابت`
                      : "نامشخص"}
                  </strong>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">حداقل خرید لازم:</span>
                  <span className="text-slate-300 font-mono font-medium">
                    {c.minOrderAmount ? formatToman(c.minOrderAmount) : "بدون محدودیت"}
                  </span>
                </div>
              </div>

              {/* Card Footer: Edit & Delete */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[10px]">
                  {c.createdAt ? `ثبت: ${formatJalaliDate(c.createdAt)}` : "کد سیستمی"}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEditModal(c)}
                    className="px-2.5 py-1.5 bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 rounded-xl border border-amber-500/30 font-bold transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>ویرایش</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(c.id, c.code)}
                    className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-400 rounded-xl border border-rose-900 transition-all cursor-pointer"
                    title="حذف کد تخفیف"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      {/* 5. Create & Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-black text-sm text-white flex items-center gap-2">
                {editingCoupon ? <Edit className="w-4 h-4 text-amber-400" /> : <Plus className="w-4 h-4 text-amber-400" />}
                <span>{editingCoupon ? `ویرایش کد تخفیف «${editingCoupon.code}»` : "تعریف کد تخفیف جدید"}</span>
              </h3>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-950/80 border border-rose-800 text-rose-300 text-xs p-3 rounded-2xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">کد تخفیف (انگلیسی) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="SHIASI1403"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono text-sm tracking-wider focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Type Switch: Percentage vs Fixed Amount */}
              <div>
                <label className="block text-slate-300 font-bold mb-1.5">نوع اعمال تخفیف</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDiscountType("percent")}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
                      discountType === "percent"
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    <Percent className="w-4 h-4" />
                    <span>تخفیف درصدی (%)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDiscountType("amount")}
                    className={`p-2.5 rounded-xl border flex items-center justify-center gap-1.5 font-bold transition-all cursor-pointer ${
                      discountType === "amount"
                        ? "bg-amber-500 text-slate-950 border-amber-500"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    <Coins className="w-4 h-4" />
                    <span>مبلغ ثابت (تومان)</span>
                  </button>
                </div>
              </div>

              {discountType === "percent" ? (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">درصد تخفیف (۱ تا ۱۰۰) *</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(e.target.value)}
                    placeholder="مثال: ۱۵"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-slate-300 font-bold mb-1">مبلغ تخفیف (تومان) *</label>
                  <input
                    type="number"
                    required
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(e.target.value)}
                    placeholder="مثال: ۵۰۰۰۰"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-bold mb-1">حداقل مبلغ سفارش (تومان - اختیاری)</label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  placeholder="مثال: ۳۰۰۰۰۰"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Status Switch */}
              <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-750">
                <span className="text-slate-300 font-bold">وضعیت فعال بودن کد:</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                />
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                >
                  {loading ? "در حال ثبت..." : editingCoupon ? "ذخیره تغییرات" : "ایجاد کد"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
