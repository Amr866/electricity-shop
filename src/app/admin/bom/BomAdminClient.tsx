"use client";

import React, { useState } from "react";
import { formatJalaliDate, toPersianDigits } from "@/lib/utils";
import {
  FileSpreadsheet,
  Search,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle2,
  FileText,
  Building,
  Edit3,
  Check,
  X,
  RefreshCw,
  ExternalLink,
  Download,
} from "lucide-react";

interface BOMRecord {
  id: string;
  trackingCode: string;
  contractorName: string;
  contractorPhone: string;
  projectCity: string | null;
  companyName: string | null;
  content: string | null;
  fileUrl: string | null;
  fileType: string | null;
  status: string;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const STATUSES = [
  { value: "ALL", label: "همه استعلام‌ها" },
  { value: "PENDING", label: "در انتظار بررسی و قیمت‌گذاری", color: "bg-amber-900/60 text-amber-300" },
  { value: "QUOTED", label: "پیش‌فاکتور ارسال شد", color: "bg-blue-900/60 text-blue-300" },
  { value: "CONTACTED", label: "مذاکره تلفنی انجام شد", color: "bg-indigo-900/60 text-indigo-300" },
  { value: "ARCHIVED", label: "بایگانی شده", color: "bg-slate-800 text-slate-400" },
];

export function BomAdminClient({ initialSubmissions }: { initialSubmissions: any[] }) {
  const [submissions, setSubmissions] = useState<BOMRecord[]>(initialSubmissions);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [editingItem, setEditingItem] = useState<BOMRecord | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const filtered = submissions.filter((s) => {
    const matchesStatus = selectedStatus === "ALL" || s.status === selectedStatus;
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !query ||
      s.trackingCode.toLowerCase().includes(query) ||
      s.contractorPhone.includes(query) ||
      s.contractorName.toLowerCase().includes(query) ||
      (s.companyName && s.companyName.toLowerCase().includes(query));
    return matchesStatus && matchesQuery;
  });

  const openEdit = (sub: BOMRecord) => {
    setEditingItem(sub);
    setEditStatus(sub.status);
    setEditNotes(sub.adminNotes || "");
  };

  const handleSave = async () => {
    if (!editingItem) return;
    setIsSaving(true);
    try {
      const res = await fetch("/api/bom", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingItem.id,
          status: editStatus,
          adminNotes: editNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmissions((prev) =>
          prev.map((it) => (it.id === editingItem.id ? data.submission : it))
        );
        setEditingItem(null);
      } else {
        alert(data.error || "خطا در ذخیره.");
      }
    } catch {
      alert("خطای ارتباط با سرور.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2.5">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
            <span>مدیریت و قیمت‌گذاری صورت اقلام پیمانکاران (BOM)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            بررسی استعلام‌های پروژه‌ای، فایل‌های اکسل ضمیمه و صدور پیش‌فاکتور همکار
          </p>
        </div>

        <div className="bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300">
          کل استعلام‌ها: <strong className="text-white font-mono">{toPersianDigits(submissions.length)}</strong>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="جستجو بر اساس کد BOM، نام پیمانکار یا شماره تماس..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-10 pl-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-medium"
          />
        </div>

        <div className="md:col-span-7 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STATUSES.map((st) => (
            <button
              key={st.value}
              type="button"
              onClick={() => setSelectedStatus(st.value)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedStatus === st.value
                  ? "bg-cyan-500 text-slate-950 font-black shadow-md"
                  : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead className="bg-slate-950/60 text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="p-3.5">کد استعلام</th>
                <th className="p-3.5">پیمانکار / شرکت</th>
                <th className="p-3.5">شهر پروژه</th>
                <th className="p-3.5">فایل / متن اقلام</th>
                <th className="p-3.5">وضعیت</th>
                <th className="p-3.5 text-center">پاسخ و هماهنگی</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500 font-medium">
                    هیچ استعلام اقلامی با مشخصات انتخابی یافت نشد.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => {
                  const statusObj = STATUSES.find((s) => s.value === sub.status) || {
                    label: sub.status,
                    color: "bg-slate-800 text-slate-300",
                  };
                  const waNumber = `98${sub.contractorPhone.replace(/^0/, "")}`;
                  const waText = encodeURIComponent(
                    `سلام جناب ${sub.contractorName}، استعلام اقلام الکتریکی شما با کد ${sub.trackingCode} در فروشگاه شیاسی بررسی شد.`
                  );

                  return (
                    <tr key={sub.id} className="hover:bg-slate-850/50 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-cyan-400 dir-ltr">
                        <bdi dir="ltr">{sub.trackingCode}</bdi>
                      </td>
                      <td className="p-3.5">
                        <div className="font-bold text-white">{sub.contractorName}</div>
                        {sub.companyName && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building className="w-3 h-3 text-slate-500" />
                            <span>{sub.companyName}</span>
                          </div>
                        )}
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5 dir-ltr flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <bdi dir="ltr">{sub.contractorPhone}</bdi>
                        </div>
                      </td>
                      <td className="p-3.5 text-slate-300 font-medium">{sub.projectCity || "نامشخص"}</td>
                      <td className="p-3.5">
                        {sub.fileUrl ? (
                          <a
                            href={sub.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-cyan-400 hover:underline font-bold text-[11px]"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>دانلود فایل ضمیمه</span>
                          </a>
                        ) : sub.content ? (
                          <p className="text-[11px] text-slate-300 max-w-xs truncate" title={sub.content}>
                            {sub.content}
                          </p>
                        ) : (
                          <span className="text-slate-500">بدون شرح</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold ${statusObj.color}`}>
                          {statusObj.label}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <a
                            href={`https://wa.me/${waNumber}?text=${waText}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1.5 rounded-xl font-bold text-[10px] flex items-center gap-1 transition-all"
                            title="ارسال پیش‌فاکتور در واتساپ"
                          >
                            <MessageCircle className="w-3 h-3" />
                            <span>واتساپ</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => openEdit(sub)}
                            className="bg-slate-800 hover:bg-slate-700 text-cyan-400 px-2.5 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all border border-slate-700"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>وضعیت و یادداشت</span>
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

      {/* Edit Status Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
                <span>بررسی استعلام: <bdi dir="ltr">{editingItem.trackingCode}</bdi></span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">تغییر وضعیت استعلام:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 font-bold focus:outline-none focus:border-cyan-500"
                >
                  {STATUSES.filter((s) => s.value !== "ALL").map((st) => (
                    <option key={st.value} value={st.value}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">یادداشت داخلی میز فروش عمده:</label>
                <textarea
                  rows={4}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="مثال: پیش‌فاکتور با ۱۰٪ تخفیف ارسال شد، منتظر تایید لیست کابل‌ها هستند..."
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-2.5 leading-relaxed focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-bold"
              >
                انصراف
              </button>
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSave}
                className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                <span>ذخیره وضعیت</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
