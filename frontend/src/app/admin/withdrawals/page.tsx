"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api-client";
import {
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Copy,
  Check,
  X,
  AlertTriangle,
  RotateCcw,
  Wallet,
  RefreshCw,
  Clock,
} from "lucide-react";

interface WithdrawalItem {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  amount: { amount: number; formatted: string };
  paymentMethod: string;
  accountNumber: string;
  maskedAccount: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");

  // Rejection modal
  const [rejectModalItem, setRejectModalItem] = useState<WithdrawalItem | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [copiedAcc, setCopiedAcc] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadWithdrawals = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getWithdrawals();
      setWithdrawals(data);
    } catch (err: any) {
      console.error("Failed to load withdrawals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const handleCopy = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAcc(acc);
    setTimeout(() => setCopiedAcc(null), 2000);
  };

  const handleApprove = async (wthId: string, userName: string, amount: number) => {
    try {
      setActionLoading(wthId);
      const res = await adminApi.approveWithdrawal(wthId);
      setSuccessBanner(res.message || `${userName}-এর ৳${amount} উইথড্রয়াল সফলভাবে অনুমোদন করা হয়েছে।`);
      await loadWithdrawals();
    } catch (err: any) {
      alert(err.message || "উইথড্রয়াল অনুমোদন করতে সমস্যা হয়েছে");
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccessBanner(null), 4000);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalItem) return;
    try {
      setActionLoading(rejectModalItem.id);
      const res = await adminApi.rejectWithdrawal(
        rejectModalItem.id,
        rejectNote || "অ্যাকাউন্ট তথ্যে অসঙ্গতি বা সাময়িক টেকনিক্যাল সমস্যা"
      );
      setSuccessBanner(
        res.message ||
        `উইথড্র রিকোয়েস্ট বাতিল করা হয়েছে এবং টাকা ইউজারের ওয়ালেট ব্যালেন্সে রিফান্ড করা হয়েছে!`
      );
      setRejectModalItem(null);
      setRejectNote("");
      await loadWithdrawals();
    } catch (err: any) {
      alert(err.message || "বাতিল করতে ব্যর্থ হয়েছে");
    } finally {
      setActionLoading(null);
      setTimeout(() => setSuccessBanner(null), 4000);
    }
  };

  const filteredWithdrawals = withdrawals.filter((wth) => {
    if (filterStatus !== "ALL" && wth.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        wth.userName.toLowerCase().includes(q) ||
        wth.accountNumber.includes(q) ||
        wth.paymentMethod.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = withdrawals.filter((w) => w.status === "PENDING").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">উইথড্রয়াল প্রসেসিং ও অনুমোদন</h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                {pendingCount}টি পেন্ডিং
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ইউজারদের উত্তোলনের অনুরোধ যাচাই করে পেমেন্ট সম্পন্ন করুন অথবা রিফান্ডসহ সরাসরি ডাটাবেজে বাতিল করুন।
          </p>
        </div>
        <button
          type="button"
          onClick={loadWithdrawals}
          disabled={loading}
          className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1e5eb3]" : ""}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Success Notification */}
      {successBanner && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{successBanner}</span>
          </div>
          <button onClick={() => setSuccessBanner(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter Tabs & Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "PENDING", label: `পেন্ডিং (${pendingCount})` },
            { id: "ALL", label: `সব (${withdrawals.length})` },
            { id: "APPROVED", label: "অনুমোদিত" },
            { id: "REJECTED", label: "বাতিল/রিফান্ডেড" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filterStatus === tab.id
                  ? "bg-white text-[#1e5eb3] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="ইউজার বা অ্যাকাউন্ট নম্বর খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
          />
        </div>
      </div>

      {/* Withdrawal Queue List */}
      {loading && withdrawals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-8 h-8 border-3 border-[#1e5eb3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-bold">উইথড্রয়াল রেকর্ড লোড হচ্ছে...</p>
        </div>
      ) : filteredWithdrawals.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <ArrowUpRight className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">কোনো উইথড্রয়াল অনুরোধ নেই</h3>
          <p className="text-xs text-slate-500 mt-1">অন্যান্য ফিল্টার নির্বাচন করে দেখুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWithdrawals.map((wth) => {
            const isPending = wth.status === "PENDING";
            const isApproved = wth.status === "APPROVED";
            const amtNum = wth.amount?.amount || (wth.amount as any);
            return (
              <div
                key={wth.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isPending ? "bg-amber-400" : isApproved ? "bg-emerald-500" : "bg-rose-400"
                  }`}
                />

                <div className="space-y-3 pt-1">
                  {/* Top user & status */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{wth.userName}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{wth.phone}</p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                        isApproved
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : isPending
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {isApproved && <CheckCircle2 className="w-3 h-3" />}
                      {isPending && <Clock className="w-3 h-3" />}
                      {!isApproved && !isPending && <XCircle className="w-3 h-3" />}
                      {isApproved ? "অনুমোদিত" : isPending ? "অপেক্ষমান" : "বাতিল/রিফান্ড"}
                    </span>
                  </div>

                  {/* Amount card */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">উত্তোলনের পরিমাণ</span>
                      <span className="text-lg font-black text-slate-900 font-sans">
                        ৳ {amtNum}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold block">মাধ্যম</span>
                      <span className="text-xs font-bold text-[#1e5eb3] uppercase px-2 py-0.5 bg-sky-50 rounded-md border border-sky-100">
                        {wth.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Account details */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400">প্রাপক অ্যাকাউন্ট:</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        <span>{wth.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(wth.accountNumber)}
                          className="text-slate-400 hover:text-slate-700 ml-1"
                        >
                          {copiedAcc === wth.accountNumber ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span>অনুরোধের সময়:</span>
                      <span>{new Date(wth.createdAt).toLocaleString("bn-BD")}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                {isPending && (
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={actionLoading === wth.id}
                      onClick={() => setRejectModalItem(wth)}
                      className="flex-1 py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                      বাতিল ও রিফান্ড
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === wth.id}
                      onClick={() => handleApprove(wth.id, wth.userName, amtNum)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                      পেমেন্ট নিশ্চিত করুন
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject & Refund Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-rose-600">
              <AlertTriangle className="w-5 h-5" />
              <h4 className="text-sm font-bold text-slate-900">উইথড্রয়াল বাতিল ও রিফান্ড</h4>
            </div>
            <p className="text-xs text-slate-600">
              বাতিল করলে ব্যবহারকারীর কর্তনকৃত{" "}
              <span className="font-bold text-slate-900">৳{rejectModalItem.amount?.amount || (rejectModalItem.amount as any)}</span>{" "}
              স্বয়ংক্রিয়ভাবে তার ডাটাবেজ ওয়ালেট ব্যালেন্সে ফেরত যুক্ত হয়ে যাবে।
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                বাতিলের কারণ লিখুন:
              </label>
              <textarea
                rows={3}
                placeholder="যেমন: ভুল অ্যাকাউন্ট নম্বর প্রদান করা হয়েছে..."
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-500 bg-slate-50"
              />
            </div>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                ফিরে যান
              </button>
              <button
                type="button"
                disabled={actionLoading === rejectModalItem.id}
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm disabled:opacity-50"
              >
                বাতিল ও ব্যালেন্স রিফান্ড
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
