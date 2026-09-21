"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api-client";
import {
  Users,
  Search,
  SlidersHorizontal,
  UserCheck,
  UserX,
  PlusCircle,
  MinusCircle,
  Coins,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  X,
  Phone,
  Mail,
  Award,
  RefreshCw,
} from "lucide-react";

interface AdminUserItem {
  id: string;
  name: string;
  displayName: string;
  email: string;
  phone: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "SUSPENDED" | "BLOCKED";
  referralCode: string;
  avatar: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");

  // Balance adjustment modal state
  const [adjustModalUser, setAdjustModalUser] = useState<AdminUserItem | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustDirection, setAdjustDirection] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [adjustReason, setAdjustReason] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getUsers();
      setUsers(data);
    } catch (err: any) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleConfirmAdjust = async () => {
    if (!adjustModalUser || adjustAmount <= 0) return;
    try {
      setActionLoading(adjustModalUser.id);
      const res = await adminApi.adjustUserBalance(adjustModalUser.id, {
        amount: adjustAmount,
        direction: adjustDirection,
        reason: adjustReason || (adjustDirection === "CREDIT" ? "বিশেষ বোনাস ক্রেডিট" : "পেনাল্টি কর্তন"),
      });
      setSuccessToast(
        res.message ||
        `${adjustModalUser.name}-এর ব্যালেন্সে ৳${adjustAmount} ${
          adjustDirection === "CREDIT" ? "যোগ" : "কর্তন"
        } করা হয়েছে।`
      );
      setAdjustModalUser(null);
      setAdjustReason("");
      await loadUsers();
    } catch (err: any) {
      alert(err.message || "ব্যালেন্স সমন্বয় করা যায়নি");
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleToggleStatus = async (user: AdminUserItem) => {
    try {
      setActionLoading(user.id);
      const newStatus = user.status === "SUSPENDED" ? "ACTIVE" : "SUSPENDED";
      const res = await adminApi.updateUserStatus(user.id, newStatus);
      const banglaSt = newStatus === "ACTIVE" ? "সক্রিয়" : "স্থগিত";
      setSuccessToast(res.message || `${user.name}-এর অ্যাকাউন্ট ${banglaSt} করা হয়েছে।`);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || "স্ট্যাটাস পরিবর্তন করা যায়নি");
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const handleToggleRole = async (user: AdminUserItem) => {
    try {
      setActionLoading(user.id);
      const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";
      const res = await adminApi.updateUserRole(user.id, newRole);
      setSuccessToast(res.message || `${user.name}-এর রোল ${newRole} করা হয়েছে।`);
      await loadUsers();
    } catch (err: any) {
      alert(err.message || "রোল পরিবর্তন করা যায়নি");
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccessToast(null), 3000);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (statusFilter === "ACTIVE" && u.status === "SUSPENDED") return false;
    if (statusFilter === "SUSPENDED" && u.status !== "SUSPENDED") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.phone?.includes(q) ||
        u.id?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">ব্যবহারকারী ব্যবস্থাপনা</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            প্ল্যাটফর্মের নিবন্ধিত ব্যবহারকারী পর্যবেক্ষণ, রোল ও ব্যালেন্স সরাসরি ডাটাবেজে নিয়ন্ত্রণ করুন।
          </p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1e5eb3]" : ""}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Success Notification */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "ALL", label: `সকল ইউজার (${users.length})` },
            { id: "ACTIVE", label: "সক্রিয়" },
            { id: "SUSPENDED", label: "স্থগিত / ব্যান" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? "bg-white text-[#1e5eb3] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="নাম, ফোন বা ইমেইল দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
          />
        </div>
      </div>

      {/* Users Table / Grid */}
      {loading && users.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-8 h-8 border-3 border-[#1e5eb3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-bold">ইউজার ডেটা লোড হচ্ছে...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <p className="text-xs text-slate-500 font-bold">কোনো ব্যবহারকারী পাওয়া যায়নি।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredUsers.map((user) => {
            const isSuspended = user.status === "SUSPENDED" || user.status === "BLOCKED";
            const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";
            return (
              <div
                key={user.id}
                className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                  isSuspended ? "border-rose-200 bg-rose-50/20" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                        onError={(e) => {
                          (e.target as any).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold text-sm flex-shrink-0">
                        {(user.name || "U").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900">{user.name}</h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isAdmin
                              ? "bg-purple-100 text-purple-800"
                              : isSuspended
                              ? "bg-rose-100 text-rose-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {isAdmin ? "অ্যাডমিন" : isSuspended ? "স্থগিত" : "সক্রিয়"}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        UID: {user.id.slice(0, 8)}... | রেফার কোড: {user.referralCode || "N/A"}
                      </span>
                    </div>
                  </div>

                  {/* Role / Status Toggle buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={actionLoading === user.id}
                      onClick={() => handleToggleRole(user)}
                      title={isAdmin ? "ইউজার বানান" : "অ্যাডমিন বানান"}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-colors ${
                        isAdmin
                          ? "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {isAdmin ? "ADMIN" : "USER"}
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === user.id}
                      onClick={() => handleToggleStatus(user)}
                      className={`p-1.5 rounded-lg transition-colors ${
                        isSuspended
                          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          : "bg-rose-100 text-rose-700 hover:bg-rose-200"
                      }`}
                      title={isSuspended ? "অ্যাকাউন্ট সক্রিয় করুন" : "অ্যাকাউন্ট স্থগিত করুন"}
                    >
                      {isSuspended ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Contact info */}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                    <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="font-mono text-[11px] truncate">{user.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl">
                    <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                    <span className="text-[11px] truncate">{user.email}</span>
                  </div>
                </div>

                {/* Wallet stats row */}
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">ওয়ালেট ব্যালেন্স</span>
                    <span className="text-base font-black text-slate-900 font-sans">
                      ৳ {user.balance?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">মোট আয়</span>
                    <span className="text-xs font-bold text-emerald-600 font-sans">
                      ৳ {user.totalEarned?.toLocaleString() || 0}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-semibold">উত্তোলিত</span>
                    <span className="text-xs font-bold text-rose-600 font-sans">
                      ৳ {user.totalWithdrawn?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>

                {/* Manual balance adjust trigger */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    যোগদান: {new Date(user.createdAt).toLocaleDateString("bn-BD")}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setAdjustModalUser(user);
                      setAdjustAmount(100);
                      setAdjustDirection("CREDIT");
                    }}
                    className="flex items-center gap-1 text-xs font-bold text-[#1e5eb3] hover:text-[#184a8f] px-2.5 py-1 rounded-lg hover:bg-sky-50 transition-colors"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>ব্যালেন্স সমন্বয়</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Manual Balance Adjust Modal */}
      {adjustModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900">ব্যালেন্স সমন্বয় (Manual)</h3>
                <button
                  type="button"
                  onClick={() => setAdjustModalUser(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                ইউজার: <span className="font-bold text-slate-800">{adjustModalUser.name}</span> | বর্তমান: ৳{adjustModalUser.balance}
              </p>
            </div>

            {/* Direction Selection */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustDirection("CREDIT")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  adjustDirection === "CREDIT"
                    ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <PlusCircle className="w-4 h-4 text-emerald-600" />
                <span>টাকা যোগ (Credit)</span>
              </button>
              <button
                type="button"
                onClick={() => setAdjustDirection("DEBIT")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  adjustDirection === "DEBIT"
                    ? "bg-rose-50 border-rose-500 text-rose-700 shadow-sm"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <MinusCircle className="w-4 h-4 text-rose-600" />
                <span>টাকা কর্তন (Debit)</span>
              </button>
            </div>

            {/* Amount input */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                টাকার পরিমাণ (৳):
              </label>
              <input
                type="number"
                min={1}
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Math.max(1, Number(e.target.value)))}
                className="w-full text-base font-bold font-sans p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
              />
            </div>

            {/* Reason */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                কারণ বা রেফারেন্স নোট:
              </label>
              <input
                type="text"
                placeholder={adjustDirection === "CREDIT" ? "যেমন: বিশেষ বোনাস বা রিফান্ড" : "যেমন: পেনাল্টি বা ভুল ক্রেডিট রিভার্স"}
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
              />
            </div>

            {/* Confirm button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={actionLoading === adjustModalUser.id}
                onClick={handleConfirmAdjust}
                className={`w-full py-2.5 rounded-xl text-xs font-bold text-white shadow-sm transition-all active:scale-95 disabled:opacity-50 ${
                  adjustDirection === "CREDIT"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {adjustDirection === "CREDIT"
                  ? `৳${adjustAmount} যোগ নিশ্চিত করুন`
                  : `৳${adjustAmount} কর্তন নিশ্চিত করুন`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
