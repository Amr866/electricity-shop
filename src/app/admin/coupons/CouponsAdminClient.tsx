"use client";

import React, { useState } from "react";
import { formatToman, toPersianDigits } from "@/lib/utils";
import { Tag, Plus, Trash2, CheckCircle2, XCircle, X } from "lucide-react";

interface CouponsAdminClientProps {
  initialCoupons: any[];
}

export function CouponsAdminClient({ initialCoupons }: CouponsAdminClientProps) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [code, setCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState("");

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          discountPercent,
          discountAmount,
          minOrderAmount,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || "خطا در ایجاد کد تخفیف.");
      } else {
        setCoupons([data.coupon, ...coupons]);
        setModalOpen(false);
        setCode("");
        setDiscountPercent("");
        setDiscountAmount("");
        setMinOrderAmount("");
      }
    } catch (e) {
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
        setCoupons(
          coupons.map((c) => (c.id === id ? { ...c, isActive: !currentStatus } : c))
        );
      }
    } catch (e) {
      alert("خطا در تغییر وضعیت.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این کد تخفیف اطمینان دارید؟")) return;

    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setCoupons(coupons.filter((c) => c.id !== id));
      }
    } catch (e) {
      alert("خطای سرور.");
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Tag className="w-5 h-5 text-rose-400" />
            <span>مدیریت کدهای تخفیف و بن‌های خرید</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تعریف کدهای تخفیف جشنواره، کد مخصوص همشهریان اصفهان و تخفیف‌های درصدی
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>تعریف کد تخفیف جدید</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-right text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
              <tr>
                <th className="p-4">کد تخفیف</th>
                <th className="p-4">میزان تخفیف</th>
                <th className="p-4">حداقل خرید</th>
                <th className="p-4 text-center">وضعیت فعال</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-medium">
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-slate-800/40">
                  <td className="p-4 font-mono font-black text-amber-400 text-sm">
                    {coupon.code}
                  </td>
                  <td className="p-4 font-bold text-white">
                    {coupon.discountPercent
                      ? `${toPersianDigits(coupon.discountPercent)}٪ درصدی`
                      : coupon.discountAmount
                      ? formatToman(coupon.discountAmount)
                      : "-"}
                  </td>
                  <td className="p-4">
                    {coupon.minOrderAmount > 0
                      ? formatToman(coupon.minOrderAmount)
                      : "بدون محدودیت"}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                      className={`px-3 py-1 rounded-full text-[11px] font-bold transition-colors ${
                        coupon.isActive
                          ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                          : "bg-slate-800 text-slate-500"
                      }`}
                    >
                      {coupon.isActive ? "فعال" : "غیرفعال"}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleDelete(coupon.id)}
                      className="p-1.5 bg-rose-950/80 hover:bg-rose-900 text-rose-400 rounded-lg transition-colors"
                      title="حذف کد"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Coupon Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                <span>تعریف کد تخفیف جدید</span>
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-950 border border-rose-800 text-rose-300 text-xs p-3 rounded-xl">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-bold mb-1">کد تخفیف (انگلیسی) *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="مثال: ISFAHAN یا NOOR1403"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono uppercase"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">درصد تخفیف (۱ الی ۱۰۰)</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={discountPercent}
                  onChange={(e) => {
                    setDiscountPercent(e.target.value);
                    if (e.target.value) setDiscountAmount("");
                  }}
                  placeholder="مثال: 10"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">یا مبلغ ثابت تخفیف (تومان)</label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) => {
                    setDiscountAmount(e.target.value);
                    if (e.target.value) setDiscountPercent("");
                  }}
                  placeholder="مثال: 50000"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-bold mb-1">حداقل مبلغ سفارش (تومان)</label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  placeholder="مثال: 200000"
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl"
                >
                  {loading ? "در حال ثبت..." : "ذخیره کد تخفیف"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
