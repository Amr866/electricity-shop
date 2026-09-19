"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Lock,
  Unlock,
  Trash2,
  Edit2,
  X,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  Shield,
  Layers,
  ShoppingBag,
  Wrench,
  MessageSquare,
} from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

export interface AdminUserItem {
  id: string;
  name: string;
  phone: string;
  role: string;
  isRootOwner: boolean;
  permissions: string[];
  isSuspended: boolean;
  createdAt: string;
}

interface AdminUsersClientProps {
  initialUsers: AdminUserItem[];
}

const MODULE_OPTIONS: { id: string; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "CATALOG", label: "کاتالوگ و محصولات", icon: Layers },
  { id: "ORDERS", label: "سفارش‌ها و فاکتورها", icon: ShoppingBag },
  { id: "REPAIRS", label: "کارگاه و تعمیرات", icon: Wrench },
  { id: "REVIEWS", label: "نظرات مشتریان", icon: MessageSquare },
];

export function AdminUsersClient({ initialUsers }: AdminUsersClientProps) {
  const [users, setUsers] = useState<AdminUserItem[]>(initialUsers);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);

  // Form Fields
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(["CATALOG"]);
  const [rootPassword, setRootPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showRootPassword, setShowRootPassword] = useState(false);

  // Action status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteTarget, setDeleteTarget] = useState<AdminUserItem | null>(null);
  const [deleteRootPassword, setDeleteRootPassword] = useState("");
  const [showDeleteRootPassword, setShowDeleteRootPassword] = useState(false);

  // Suspension confirmation modal state
  const [suspensionTarget, setSuspensionTarget] = useState<AdminUserItem | null>(null);
  const [suspensionRootPassword, setSuspensionRootPassword] = useState("");
  const [showSuspensionRootPassword, setShowSuspensionRootPassword] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (deleteTarget) {
          setDeleteTarget(null);
          setDeleteRootPassword("");
        } else if (suspensionTarget) {
          setSuspensionTarget(null);
          setSuspensionRootPassword("");
        } else if (isModalOpen) {
          closeModal();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen, deleteTarget, suspensionTarget]);

  const openCreateModal = () => {
    setEditingUser(null);
    setPhone("");
    setName("");
    setPassword("");
    setSelectedPermissions(["CATALOG"]);
    setRootPassword("");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const openEditModal = (user: AdminUserItem) => {
    setEditingUser(user);
    setPhone(user.phone);
    setName(user.name);
    setPassword("");
    setSelectedPermissions(user.permissions);
    setRootPassword("");
    setErrorMessage(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setErrorMessage(null);
  };

  const handleTogglePermission = (modId: string) => {
    if (selectedPermissions.includes(modId)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== modId));
    } else {
      setSelectedPermissions([...selectedPermissions, modId]);
    }
  };

  const refreshUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.users) {
        setUsers(data.users);
      }
    } catch {
      // Ignore refresh error
    }
  };

  // Submit Create or Edit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!rootPassword) {
      setErrorMessage("تایید کلمه عبور مدیر ارشد برای انجام این عملیات الزامی است.");
      return;
    }

    if (!editingUser && (!phone || !name || !password)) {
      setErrorMessage("لطفاً کلیه فیلدهای نام، شماره موبایل و کلمه عبور را تکمیل کنید.");
      return;
    }

    if (selectedPermissions.length === 0) {
      setErrorMessage("حداقل یک بخش مجاز باید انتخاب شود.");
      return;
    }

    setLoading(true);

    try {
      if (editingUser) {
        // Edit existing admin
        const payload: Record<string, unknown> = {
          name,
          permissions: selectedPermissions,
          rootPassword,
        };
        if (password) {
          payload.resetPassword = password;
        }

        const res = await fetch(`/api/admin/users/${editingUser.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErrorMessage(data.message || "خطا در ویرایش اطلاعات مدیر.");
        } else {
          setSuccessMessage("اطلاعات حساب مدیر با موفقیت به‌روزرسانی شد.");
          closeModal();
          await refreshUsers();
        }
      } else {
        // Provision new admin
        const res = await fetch("/api/admin/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone,
            name,
            initialPassword: password,
            permissions: selectedPermissions,
            rootPassword,
          }),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setErrorMessage(data.message || "خطا در ایجاد مدیر جدید.");
        } else {
          setSuccessMessage("مدیر جدید با موفقیت ایجاد گردید.");
          closeModal();
          await refreshUsers();
        }
      }
    } catch {
      setErrorMessage("خطای ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  // Open Suspension Confirmation Modal
  const handleToggleSuspension = (user: AdminUserItem) => {
    setSuspensionTarget(user);
    setSuspensionRootPassword("");
    setShowSuspensionRootPassword(false);
    setErrorMessage(null);
  };

  // Submit Suspension Change
  const handleConfirmSuspension = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!suspensionTarget || !suspensionRootPassword) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${suspensionTarget.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isSuspended: !suspensionTarget.isSuspended,
          rootPassword: suspensionRootPassword,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(data.message || "خطا در تغییر وضعیت حساب مدیر.");
      } else {
        setSuccessMessage(
          suspensionTarget.isSuspended
            ? "حساب مدیر از حالت تعلیق خارج و فعال گردید."
            : "حساب مدیر معلق گردید و نشست‌های فعال آن فوراً منقضی شدند."
        );
        setSuspensionTarget(null);
        setSuspensionRootPassword("");
        await refreshUsers();
      }
    } catch {
      setErrorMessage("خطای ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  // Confirm Delete
  const handleDeleteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteTarget || !deleteRootPassword) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch(`/api/admin/users/${deleteTarget.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rootPassword: deleteRootPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErrorMessage(data.message || "خطا در حذف حساب مدیر.");
      } else {
        setSuccessMessage("حساب مدیر با موفقیت حذف گردید.");
        setDeleteTarget(null);
        setDeleteRootPassword("");
        await refreshUsers();
      }
    } catch {
      setErrorMessage("خطای ارتباط با سرور.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl space-y-6 text-right">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>مدیریت مدیران و سطوح دسترسی (مالک سیستم)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            تعریف مدیران ثانویه، تخصیص مجوزهای تفکیک‌شده و تعلیق فوری نشست‌های ناخواسته
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="min-h-[44px] px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-900/40 transition active:scale-95 focus:ring-2 focus:ring-primary-500 focus:outline-none"
        >
          <UserPlus className="w-4 h-4" />
          <span>افزودن مدیر جدید</span>
        </button>
      </div>

      {/* Global Alerts */}
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

      {/* Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 text-xs">
                <th className="p-4 font-bold">نام مدیر</th>
                <th className="p-4 font-bold">شماره موبایل</th>
                <th className="p-4 font-bold">نقش و ماژول‌های مجاز</th>
                <th className="p-4 font-bold">وضعیت حساب</th>
                <th className="p-4 font-bold text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-4 font-bold text-white flex items-center gap-2">
                    {u.isRootOwner ? (
                      <span title="مالک اصلی سیستم">
                        <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                      </span>
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    )}
                    <span>{u.name}</span>
                    {u.isRootOwner && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                        مالک اصلی
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-slate-300">
                    <bdi dir="ltr" className="font-mono text-xs sm:text-sm tracking-wide bg-slate-950/40 px-2 py-1 rounded border border-slate-800">
                      {toPersianDigits(u.phone)}
                    </bdi>
                  </td>

                  <td className="p-4">
                    {u.isRootOwner || u.permissions.includes("ALL") ? (
                      <span className="inline-flex items-center gap-1 text-xs bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-lg border border-purple-500/30">
                        دسترسی نامحدود
                      </span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {u.permissions.map((p) => {
                          const match = MODULE_OPTIONS.find((m) => m.id === p);
                          return (
                            <span
                              key={p}
                              className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700"
                            >
                              {match ? match.label : p}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </td>

                  <td className="p-4">
                    {u.isSuspended ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        <Lock className="w-3.5 h-3.5" />
                        معلق
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <Unlock className="w-3.5 h-3.5" />
                        فعال
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    {u.isRootOwner ? (
                      <span className="text-xs text-slate-500 italic">مصون از تغییر</span>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(u)}
                          className="min-w-[44px] min-h-[44px] p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center justify-center focus:ring-2 focus:ring-primary-500 focus:outline-none"
                          aria-label={`ویرایش مجوزهای ${u.name}`}
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleSuspension(u)}
                          className={`min-w-[44px] min-h-[44px] p-2 rounded-lg transition flex items-center justify-center focus:ring-2 focus:ring-primary-500 focus:outline-none ${
                            u.isSuspended
                              ? "bg-emerald-900/40 hover:bg-emerald-800 text-emerald-300"
                              : "bg-amber-900/40 hover:bg-amber-800 text-amber-300"
                          }`}
                          aria-label={u.isSuspended ? `رفع تعلیق ${u.name}` : `تعلیق حساب ${u.name}`}
                        >
                          {u.isSuspended ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(u)}
                          className="min-w-[44px] min-h-[44px] p-2 rounded-lg bg-rose-950/50 hover:bg-rose-900 text-rose-300 transition flex items-center justify-center focus:ring-2 focus:ring-primary-500 focus:outline-none"
                          aria-label={`حذف حساب ${u.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision / Edit Modal Dialog */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
          <div
            ref={modalRef}
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative text-right max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 id="modal-title" className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-400" />
                <span>{editingUser ? "ویرایش مشخصات و مجوزهای مدیر" : "افزودن مدیر ثانویه جدید"}</span>
              </h2>
              <button
                type="button"
                onClick={closeModal}
                aria-label="بستن پنجره"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMessage && (
              <div role="alert" aria-live="polite" className="p-3 bg-red-950/50 border border-red-500/40 rounded-xl text-red-200 text-xs">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              {/* Phone */}
              <div className="space-y-1">
                <label htmlFor="modal-phone" className="block text-xs font-medium text-slate-300">
                  شماره موبایل مدیر <span className="text-red-400">*</span>
                </label>
                <input
                  id="modal-phone"
                  type="text"
                  value={phone}
                  disabled={Boolean(editingUser)}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0913XXXXXXX"
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white min-h-[44px] focus:ring-2 focus:ring-primary-500 focus:outline-none disabled:opacity-50"
                  dir="ltr"
                  required
                />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <label htmlFor="modal-name" className="block text-xs font-medium text-slate-300">
                  نام و نام خانوادگی <span className="text-red-400">*</span>
                </label>
                <input
                  id="modal-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام کامل مدیر"
                  className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white min-h-[44px] focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label htmlFor="modal-password" className="block text-xs font-medium text-slate-300">
                  {editingUser ? "بازنشانی کلمه عبور (اختیاری)" : "کلمه عبور اولیه"}{" "}
                  {!editingUser && <span className="text-red-400">*</span>}
                </label>
                <div className="relative">
                  <input
                    id="modal-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="حداقل ۸ کاراکتر شامل حروف و ارقام"
                    className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-2.5 pl-12 text-sm text-white min-h-[44px] focus:ring-2 focus:ring-primary-500 focus:outline-none"
                    dir="ltr"
                    required={!editingUser}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "مخفی کردن کلمه عبور" : "نمایش کلمه عبور"}
                    className="absolute left-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Permissions Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="block text-xs font-bold text-slate-200">
                  ماژول‌های عملیاتی مجاز <span className="text-red-400">*</span>:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {MODULE_OPTIONS.map((m) => {
                    const checked = selectedPermissions.includes(m.id);
                    const Icon = m.icon;
                    return (
                      <label
                        key={m.id}
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition min-h-[44px] ${
                          checked
                            ? "bg-purple-950/30 border-purple-500/50 text-white"
                            : "bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleTogglePermission(m.id)}
                          className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700"
                        />
                        <Icon className="w-4 h-4 text-purple-400 shrink-0" />
                        <span className="text-xs font-medium">{m.label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Root Password Confirmation */}
              <div className="space-y-1 pt-3 border-t border-slate-800">
                <label htmlFor="modal-root-password" className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-amber-400" />
                  <span>تایید کلمه عبور مدیر ارشد (شما) <span className="text-red-400">*</span></span>
                </label>
                <div className="relative">
                  <input
                    id="modal-root-password"
                    type={showRootPassword ? "text" : "password"}
                    value={rootPassword}
                    onChange={(e) => setRootPassword(e.target.value)}
                    placeholder="کلمه عبور حساب خود را جهت تایید وارد نمایید"
                    className="w-full bg-slate-950/80 border border-amber-500/40 rounded-xl px-4 py-2.5 pl-12 text-sm text-white min-h-[44px] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRootPassword(!showRootPassword)}
                    aria-label={showRootPassword ? "مخفی کردن گذرواژه ارشد" : "نمایش گذرواژه ارشد"}
                    className="absolute left-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  >
                    {showRootPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{editingUser ? "ذخیره تغییرات" : "ایجاد حساب مدیر"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Suspension Confirmation Modal */}
      {suspensionTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="suspension-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
        >
          <div className="w-full max-w-md bg-slate-900 border border-amber-500/40 rounded-2xl p-6 space-y-5 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 id="suspension-dialog-title" className="text-base font-bold text-amber-400 flex items-center gap-2">
                {suspensionTarget.isSuspended ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-amber-400" />}
                <span>{suspensionTarget.isSuspended ? "فعال‌سازی مجدد حساب مدیر" : "تعلیق دسترسی حساب مدیر"}</span>
              </h2>
              <button
                type="button"
                onClick={() => setSuspensionTarget(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                aria-label="انصراف"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {suspensionTarget.isSuspended ? (
                <>
                  آیا مایل به خروج حساب مدیر <strong className="text-white">{suspensionTarget.name}</strong> از حالت تعلیق هستید؟ پس از فعال‌سازی، دسترسی‌های تعریف‌شده مجدداً برقرار خواهند شد.
                </>
              ) : (
                <>
                  آیا از تعلیق حساب مدیر <strong className="text-white">{suspensionTarget.name}</strong> اطمینان دارید؟ به محض تعلیق، <strong className="text-amber-300">تمامی نشست‌های فعال این مدیر فوراً منقضی</strong> و ورود مجدد وی مسدود می‌گردد.
                </>
              )}
            </p>

            <form onSubmit={handleConfirmSuspension} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="suspension-root-pass" className="block text-xs font-bold text-amber-300">
                  کلمه عبور مدیر ارشد جهت تایید:
                </label>
                <div className="relative">
                  <input
                    id="suspension-root-pass"
                    type={showSuspensionRootPassword ? "text" : "password"}
                    value={suspensionRootPassword}
                    onChange={(e) => setSuspensionRootPassword(e.target.value)}
                    placeholder="کلمه عبور حساب خود را وارد نمایید"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 pl-12 text-sm text-white min-h-[44px] focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowSuspensionRootPassword(!showSuspensionRootPassword)}
                    aria-label={showSuspensionRootPassword ? "مخفی کردن گذرواژه" : "نمایش گذرواژه"}
                    className="absolute left-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  >
                    {showSuspensionRootPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSuspensionTarget(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading || !suspensionRootPassword}
                  className={`min-h-[44px] px-5 py-2 rounded-xl text-white text-xs font-bold transition flex items-center gap-2 disabled:opacity-50 focus:ring-2 focus:outline-none ${
                    suspensionTarget.isSuspended
                      ? "bg-emerald-600 hover:bg-emerald-500 focus:ring-emerald-500"
                      : "bg-amber-600 hover:bg-amber-500 focus:ring-amber-500"
                  }`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : suspensionTarget.isSuspended ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span>{suspensionTarget.isSuspended ? "تایید و فعال‌سازی" : "تایید و تعلیق حساب"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
        >
          <div className="w-full max-w-md bg-slate-900 border border-red-500/40 rounded-2xl p-6 space-y-5 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 id="delete-dialog-title" className="text-base font-bold text-red-400 flex items-center gap-2">
                <Trash2 className="w-5 h-5" />
                <span>تایید حذف حساب مدیر</span>
              </h2>
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                aria-label="انصراف از حذف"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              آیا از حذف دائم حساب مدیر <strong className="text-white">{deleteTarget.name}</strong> با شماره{" "}
              <bdi dir="ltr" className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-amber-300">
                {deleteTarget.phone}
              </bdi>{" "}
              اطمینان دارید؟ تمام دسترسی‌ها فوراً لغو خواهند شد.
            </p>

            <form onSubmit={handleDeleteUser} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="delete-root-pass" className="block text-xs font-bold text-amber-300">
                  کلمه عبور مدیر ارشد برای تایید حذف:
                </label>
                <div className="relative">
                  <input
                    id="delete-root-pass"
                    type={showDeleteRootPassword ? "text" : "password"}
                    value={deleteRootPassword}
                    onChange={(e) => setDeleteRootPassword(e.target.value)}
                    placeholder="کلمه عبور حساب خود را وارد نمایید"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 pl-12 text-sm text-white min-h-[44px] focus:ring-2 focus:ring-red-500 focus:outline-none"
                    dir="ltr"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeleteRootPassword(!showDeleteRootPassword)}
                    aria-label={showDeleteRootPassword ? "مخفی کردن گذرواژه" : "نمایش گذرواژه"}
                    className="absolute left-1 top-1/2 -translate-y-1/2 min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  >
                    {showDeleteRootPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteTarget(null)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={loading || !deleteRootPassword}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition flex items-center gap-2 disabled:opacity-50 focus:ring-2 focus:ring-red-500 focus:outline-none"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  <span>حذف دائم مدیر</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
