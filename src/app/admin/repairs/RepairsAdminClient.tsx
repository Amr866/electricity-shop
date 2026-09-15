"use client";

import React, { useState } from "react";
import { formatToman, formatJalaliDate, toPersianDigits } from "@/lib/utils";
import {
  Wrench,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Phone,
  Edit3,
  Check,
  X,
  RefreshCw,
  Eye,
  FileText,
  User,
  MapPin,
  Truck,
  ExternalLink,
} from "lucide-react";

interface RepairRequestRecord {
  id: string;
  trackingCode: string;
  customerName: string;
  customerPhone: string;
  applianceType: string;
  brandModel: string | null;
  issueDesc: string;
  deliveryType: string;
  status: string;
  costApprovalStatus: string | null;
  approvalChannel: string | null;
  approvalTimestamp: Date | null;
  estimatedCost: number | null;
  finalCost: number | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const STAGES = [
  { value: "ALL", label: "همه وضعیت‌ها" },
  { value: "SUBMITTED", label: "ثبت‌شده (در انتظار تحویل)", color: "bg-slate-700 text-slate-200" },
  { value: "RECEIVED", label: "پذیرش‌شده در کارگاه", color: "bg-blue-900/60 text-blue-300" },
  { value: "INSPECTING", label: "در حال عیب‌یابی فنی", color: "bg-purple-900/60 text-purple-300" },
  { value: "COST_ESTIMATED", label: "برآورد هزینه (انتظار تایید)", color: "bg-amber-900/60 text-amber-300" },
  { value: "REPAIRING", label: "در حال تعمیر و سیم‌پیچی", color: "bg-indigo-900/60 text-indigo-300" },
  { value: "READY", label: "تکمیل و آماده تحویل", color: "bg-emerald-900/60 text-emerald-300" },
  { value: "DELIVERED", label: "تحویل مشتری داده شد", color: "bg-teal-900/60 text-teal-300" },
  { value: "CANCELLED", label: "لغو یا انصراف مشتری", color: "bg-rose-900/60 text-rose-300" },
];

export function RepairsAdminClient({ initialRepairs }: { initialRepairs: any[] }) {
  const [repairs, setRepairs] = useState<RepairRequestRecord[]>(initialRepairs);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStage, setSelectedStage] = useState("ALL");
  const [editingRepair, setEditingRepair] = useState<RepairRequestRecord | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit form state
  const [editStatus, setEditStatus] = useState("");
  const [editEstimatedCost, setEditEstimatedCost] = useState("");
  const [editFinalCost, setEditFinalCost] = useState("");
  const [editAdminNotes, setEditAdminNotes] = useState("");
  const [editCostApproval, setEditCostApproval] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredRepairs = repairs.filter((r) => {
    const matchesStage = selectedStage === "ALL" || r.status === selectedStage;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      r.trackingCode.toLowerCase().includes(query) ||
      r.customerPhone.includes(query) ||
      r.customerName.toLowerCase().includes(query) ||
      (r.brandModel && r.brandModel.toLowerCase().includes(query));
    return matchesStage && matchesQuery;
  });

  const openEditModal = (repair: RepairRequestRecord) => {
    setEditingRepair(repair);
    setEditStatus(repair.status);
    setEditEstimatedCost(repair.estimatedCost ? repair.estimatedCost.toString() : "");
    setEditFinalCost(repair.finalCost ? repair.finalCost.toString() : "");
    setEditAdminNotes(repair.adminNotes || "");
    setEditCostApproval(repair.costApprovalStatus || "PENDING");
  };

  const handleSaveEdit = async () => {
    if (!editingRepair) return;
    setIsSaving(true);

    try {
      const res = await fetch("/api/repairs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingRepair.id,
          status: editStatus,
          estimatedCost: editEstimatedCost ? parseInt(editEstimatedCost, 10) : null,
          finalCost: editFinalCost ? parseInt(editFinalCost, 10) : null,
          adminNotes: editAdminNotes,
          costApprovalStatus: editCostApproval,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRepairs((prev) =>
          prev.map((item) => (item.id === editingRepair.id ? data.repair : item))
        );
        showToast("تغییرات با موفقیت ذخیره شد.");
        setEditingRepair(null);
      } else {
        alert(data.error || "خطا در ذخیره تغییرات.");
      }
    } catch (err) {
      alert("خطای ارتباط با سرور.");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhoneApproval = async (repair: RepairRequestRecord) => {
    if (!confirm(`آیا از ثبت تایید تلفنی هزینه برای درخواست ${repair.trackingCode} اطمینان دارید؟`)) {
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/repairs", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: repair.id,
          status: "REPAIRING",
          costApprovalStatus: "APPROVED",
          approvalChannel: "PHONE",
          adminNotes: repair.adminNotes
            ? `${repair.adminNotes}\n[سیستم]: تایید تلفنی مشتری توسط تکنسین ثبت شد و سفارش به فاز تعمیر منتقل شد.`
            : `[سیستم]: تایید تلفنی مشتری توسط تکنسین ثبت شد و سفارش به فاز تعمیر منتقل شد.`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRepairs((prev) =>
          prev.map((item) => (item.id === repair.id ? data.repair : item))
        );
        showToast("تایید تلفنی مشتری با موفقیت ثبت شد.");
      }
    } catch {
      alert("خطای ارتباط با سرور.");
    } finally {
      setIsSaving(false);
    }
  };

  const pendingApprovalCount = repairs.filter(
    (r) => r.status === "COST_ESTIMATED" && r.costApprovalStatus === "PENDING"
  ).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 bg-emerald-600 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-amber-500" />
            <span>میز کار فنی و مدیریت تعمیرات کارگاه نجف‌آباد</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            رهگیری، عیب‌یابی، برآورد هزینه و مدیریت چرخه عمر ۷ مرحله‌ای دستگاه‌های تعمیری
          </p>
        </div>

        {/* Quick Stat Badges */}
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl font-bold text-slate-300">
            کل پذیرش‌ها: <strong className="text-white font-mono">{toPersianDigits(repairs.length)}</strong>
          </span>
          {pendingApprovalCount > 0 && (
            <span className="bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 animate-pulse">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{toPersianDigits(pendingApprovalCount)} در انتظار تایید مشتری</span>
            </span>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجو بر اساس کد رهگیری (REP-...)، شماره موبایل یا نام مشتری..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
          />
        </div>

        <div className="md:col-span-7 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STAGES.map((st) => (
            <button
              key={st.value}
              type="button"
              onClick={() => setSelectedStage(st.value)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedStage === st.value
                  ? "bg-amber-500 text-slate-950 shadow-md font-black"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Repairs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">کد رهگیری</th>
                <th className="p-3.5">مشتری و تماس</th>
                <th className="p-3.5">دستگاه و برند</th>
                <th className="p-3.5">مرحله و وضعیت</th>
                <th className="p-3.5">برآورد / هزینه نهایی</th>
                <th className="p-3.5">وضعیت تایید هزینه</th>
                <th className="p-3.5 text-center">عملیات تکنسین</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRepairs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500 font-medium">
                    هیچ درخواست تعمیری با مشخصات انتخابی یافت نشد.
                  </td>
                </tr>
              ) : (
                filteredRepairs.map((repair) => {
                  const stageObj = STAGES.find((s) => s.value === repair.status) || {
                    label: repair.status,
                    color: "bg-slate-800 text-slate-300",
                  };

                  return (
                    <tr key={repair.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-amber-400 dir-ltr">
                        <bdi dir="ltr">{repair.trackingCode}</bdi>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{repair.customerName}</div>
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 dir-ltr flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <bdi dir="ltr">{repair.customerPhone}</bdi>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-slate-200">{repair.applianceType}</div>
                        <div className="text-[11px] text-slate-400">{repair.brandModel || "سایر / نامشخص"}</div>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold ${stageObj.color}`}>
                          {stageObj.label}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold">
                        {repair.finalCost ? (
                          <span className="text-emerald-400">{formatToman(repair.finalCost)}</span>
                        ) : repair.estimatedCost ? (
                          <span className="text-amber-400">{formatToman(repair.estimatedCost)}</span>
                        ) : (
                          <span className="text-slate-500 font-normal">تعیین نشده</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        {repair.costApprovalStatus === "APPROVED" ? (
                          <span className="bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3" />
                            <span>تایید شده ({repair.approvalChannel === "PHONE" ? "تلفنی" : "پرتال"})</span>
                          </span>
                        ) : repair.costApprovalStatus === "DECLINED" ? (
                          <span className="bg-rose-950/60 border border-rose-800 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-fit">
                            <X className="w-3 h-3" />
                            <span>رد شده</span>
                          </span>
                        ) : repair.status === "COST_ESTIMATED" ? (
                          <span className="bg-amber-950/60 border border-amber-800 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-md animate-pulse flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" />
                            <span>در انتظار تایید</span>
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">مربوط نیست</span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {repair.status === "COST_ESTIMATED" && repair.costApprovalStatus === "PENDING" && (
                            <button
                              type="button"
                              onClick={() => handlePhoneApproval(repair)}
                              title="ثبت تایید تلفنی مشتری"
                              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-xl font-bold text-[10px] flex items-center gap-1 transition-all"
                            >
                              <Phone className="w-3 h-3" />
                              <span>تایید تلفنی</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openEditModal(repair)}
                            className="bg-slate-800 hover:bg-slate-700 text-amber-400 px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all border border-slate-700"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>ویرایش و کارشناسی</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit & Diagnostic Workbench Modal */}
      {editingRepair && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-500" />
                <span>ویرایش وضعیت پرونده: <bdi dir="ltr">{editingRepair.trackingCode}</bdi></span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingRepair(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Summary */}
            <div className="bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">مشتری:</span>
                <span className="font-bold text-white">{editingRepair.customerName} ({editingRepair.customerPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">دستگاه:</span>
                <span className="font-bold text-amber-400">{editingRepair.applianceType} - {editingRepair.brandModel}</span>
              </div>
              <div className="text-slate-400 pt-1">
                <span className="block font-bold text-slate-300 mb-0.5">شرح ایراد توسط مشتری:</span>
                <p className="text-slate-200">{editingRepair.issueDesc}</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">مرحله جاری چرخه عمر تعمیر:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-bold focus:outline-none focus:border-amber-500"
                >
                  {STAGES.filter((s) => s.value !== "ALL").map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">برآورد هزینه (تومان):</label>
                  <input
                    type="number"
                    value={editEstimatedCost}
                    onChange={(e) => setEditEstimatedCost(e.target.value)}
                    placeholder="مثال: 450000"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">هزینه نهایی فاکتور (تومان):</label>
                  <input
                    type="number"
                    value={editFinalCost}
                    onChange={(e) => setEditFinalCost(e.target.value)}
                    placeholder="مثال: 420000"
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">وضعیت تایید هزینه توسط مشتری:</label>
                <select
                  value={editCostApproval}
                  onChange={(e) => setEditCostApproval(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-bold focus:outline-none focus:border-amber-500"
                >
                  <option value="PENDING">در انتظار بررسی / تایید مشتری (PENDING)</option>
                  <option value="APPROVED">تایید شده توسط مشتری (APPROVED)</option>
                  <option value="DECLINED">رد شده / انصراف مشتری (DECLINED)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">یادداشت فنی تکنسین و گزارش عیب‌یابی:</label>
                <textarea
                  rows={3}
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  placeholder="مثال: بلبرینگ تعویض شد، سیم‌پیچی استاتور با سیم لاک الکسی تجدید گردید..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 leading-relaxed focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingRepair(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSaveEdit}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>ذخیره تغییرات</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
