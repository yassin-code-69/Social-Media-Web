"use client";

import React, { useState } from "react";
import { useMockStore, UserProfile } from "@/lib/mock-store";
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
} from "lucide-react";

export default function AdminUsersPage() {
  const { users, toggleUserStatus, adjustUserBalance } = useMockStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "SUSPENDED">("ALL");

  // Balance adjustment modal state
  const [adjustModalUser, setAdjustModalUser] = useState<UserProfile | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(100);
  const [adjustDirection, setAdjustDirection] = useState<"CREDIT" | "DEBIT">("CREDIT");
  const [adjustReason, setAdjustReason] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const handleConfirmAdjust = () => {
    if (!adjustModalUser || adjustAmount <= 0) return;
    try {
      adjustUserBalance(
        adjustModalUser.id,
        adjustAmount,
        adjustDirection,
        adjustReason || (adjustDirection === "CREDIT" ? "বিশেষ বোনাস ক্রেডিট" : "পেনাল্টি কর্তন")
      );
      setSuccessToast(
        `${adjustModalUser.name}-এর ব্যালেন্সে ৳${adjustAmount} ${
          adjustDirection === "CREDIT" ? "যোগ" : "কর্তন"
        } করা হয়েছে।`
      );
      setAdjustModalUser(null);
      setAdjustReason("");
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (err: any) {
      alert(err.message || "ব্যালেন্স সমন্বয় করা যায়নি");
    }
  };

  const handleToggleStatus = (user: UserProfile) => {
    toggleUserStatus(user.id);
    const newSt = user.status === "SUSPENDED" ? "সক্রিয়" : "স্থগিত";
    setSuccessToast(`${user.name}-এর অ্যাকাউন্ট ${newSt} করা হয়েছে।`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const filteredUsers = users.filter((u) => {
    if (statusFilter === "ACTIVE" && u.status === "SUSPENDED") return false;
    if (statusFilter === "SUSPENDED" && u.status !== "SUSPENDED") return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.id.toLowerCase().includes(q)
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
            প্ল্যাটফর্মের নিবন্ধিত ব্যবহারকারী পর্যবেক্ষণ, অ্যাকাউন্ট স্ট্যাটাস ও ওয়ালেট নিয়ন্ত্রণ করুন।
          </p>
        </div>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredUsers.map((user) => {
          const isSuspended = user.status === "SUSPENDED";
          return (
            <div
              key={user.id}
              className={`bg-white rounded-2xl p-5 shadow-sm border transition-all ${
                isSuspended ? "border-rose-200 bg-rose-50/20" : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{user.name}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSuspended
                            ? "bg-rose-100 text-rose-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {isSuspended ? "স্থগিত" : "সক্রিয়"}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">আইডি: {user.id}</span>
                  </div>
                </div>

                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {user.packageName}
                </span>
              </div>

              {/* User Meta */}
              <div className="grid grid-cols-2 gap-2 mt-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{user.phone}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                <div className="bg-sky-50/50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">বর্তমান ব্যালেন্স</span>
                  <span className="text-xs sm:text-sm font-bold text-[#1e5eb3] font-inter">
                    ৳{user.balance.toFixed(2)}
                  </span>
                </div>
                <div className="bg-emerald-50/50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">মোট আয়</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-600 font-inter">
                    ৳{user.totalEarned.toFixed(2)}
                  </span>
                </div>
                <div className="bg-purple-50/50 p-2 rounded-xl">
                  <span className="text-[10px] text-slate-400 block">সম্পন্ন কাজ</span>
                  <span className="text-xs sm:text-sm font-bold text-purple-600 font-inter">
                    {user.completedTasksCount}টি
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAdjustModalUser(user)}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-[#1e5eb3] bg-sky-50 hover:bg-sky-100 transition-colors"
                >
                  <Coins className="w-4 h-4" />
                  <span>ব্যালেন্স সমন্বয়</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleStatus(user)}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-colors ${
                    isSuspended
                      ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                      : "text-rose-700 bg-rose-50 hover:bg-rose-100"
                  }`}
                >
                  {isSuspended ? (
                    <>
                      <UserCheck className="w-4 h-4" />
                      <span>সক্রিয় করুন</span>
                    </>
                  ) : (
                    <>
                      <UserX className="w-4 h-4" />
                      <span>স্থগিত করুন</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adjust Balance Modal */}
      {adjustModalUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-[#1e5eb3]">
                <Coins className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-800">ব্যালেন্স সমন্বয়</h3>
              </div>
              <button
                onClick={() => setAdjustModalUser(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-600">ইউজার: <strong>{adjustModalUser.name}</strong></span>
              <span className="text-[#1e5eb3] font-bold">ব্যালেন্স: ৳{adjustModalUser.balance}</span>
            </div>

            {/* Direction Selection */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAdjustDirection("CREDIT")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  adjustDirection === "CREDIT"
                    ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>টাকা যোগ (Credit)</span>
              </button>
              <button
                type="button"
                onClick={() => setAdjustDirection("DEBIT")}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                  adjustDirection === "DEBIT"
                    ? "bg-rose-500 text-white border-rose-500 shadow-sm"
                    : "bg-white text-slate-600 border-slate-200"
                }`}
              >
                <MinusCircle className="w-4 h-4" />
                <span>টাকা কর্তন (Debit)</span>
              </button>
            </div>

            {/* Amount */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">টাকার পরিমাণ (৳):</label>
              <input
                type="number"
                min={1}
                value={adjustAmount}
                onChange={(e) => setAdjustAmount(Number(e.target.value))}
                className="w-full text-sm font-bold p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
              />
            </div>

            {/* Reason */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">কারণ / রেফারেন্স:</label>
              <input
                type="text"
                placeholder="যেমন: রেফারেল স্পেশাল বোনাস..."
                value={adjustReason}
                onChange={(e) => setAdjustReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setAdjustModalUser(null)}
                className="py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleConfirmAdjust}
                className="py-2 rounded-xl text-xs font-bold text-white bg-[#1e5eb3] hover:bg-[#184a8f] shadow"
              >
                সমন্বয় নিশ্চিত করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
