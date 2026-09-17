"use client";

import React, { useState } from "react";
import { useMockStore, WithdrawalItem } from "@/lib/mock-store";
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
} from "lucide-react";

export default function AdminWithdrawalsPage() {
  const { withdrawals, approveWithdrawal, rejectWithdrawal } = useMockStore();
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");

  // Rejection modal
  const [rejectModalItem, setRejectModalItem] = useState<WithdrawalItem | null>(null);
  const [rejectNote, setRejectNote] = useState("");
  const [copiedAcc, setCopiedAcc] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleCopy = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAcc(acc);
    setTimeout(() => setCopiedAcc(null), 2000);
  };

  const handleApprove = (wthId: string, userName: string, amount: number) => {
    approveWithdrawal(wthId);
    setSuccessBanner(`${userName}-এর ৳${amount} উইথড্রয়াল অনুমোদন করা হয়েছে।`);
    setTimeout(() => setSuccessBanner(null), 4000);
  };

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    rejectWithdrawal(rejectModalItem.id, rejectNote || "অ্যাকাউন্ট তথ্যে অসঙ্গতি বা সাময়িক টেকনিক্যাল সমস্যা");
    setSuccessBanner(
      `উইথড্র রিকোয়েস্ট বাতিল করা হয়েছে এবং ৳${rejectModalItem.amount} ইউজারের মূল ব্যালেন্সে রিফান্ড করা হয়েছে!`
    );
    setRejectModalItem(null);
    setRejectNote("");
    setTimeout(() => setSuccessBanner(null), 4000);
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
            ইউজারদের উত্তোলনের অনুরোধ যাচাই করে পেমেন্ট সম্পন্ন করুন অথবা রিফান্ডসহ বাতিল করুন।
          </p>
        </div>
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
      {filteredWithdrawals.length === 0 ? (
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
                  {/* Top user row */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{wth.userName}</h4>
                      <span className="text-[10px] text-slate-400">আইডি: {wth.userId}</span>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isPending
                          ? "bg-amber-100 text-amber-800"
                          : isApproved
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-rose-100 text-rose-800"
                      }`}
                    >
                      {isPending ? "পেন্ডিং" : isApproved ? "সম্পন্ন" : "বাতিল/রিফান্ড"}
                    </span>
                  </div>

                  {/* Amount and Method */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">উত্তোলনের পরিমাণ</span>
                      <span className="text-base font-bold text-rose-600 font-inter">৳{wth.amount}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">উইথড্র মাধ্যম</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                        {wth.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">অ্যাকাউন্ট নম্বর:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-slate-800">{wth.accountNumber}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(wth.accountNumber)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          title="নম্বর কপি করুন"
                        >
                          {copiedAcc === wth.accountNumber ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>অনুরোধের সময়:</span>
                      <span>{wth.createdAt}</span>
                    </div>

                    {wth.adminNote && (
                      <div className="text-[11px] text-slate-500 bg-amber-50 p-2 rounded-lg border border-amber-100 mt-2">
                        <span className="font-bold text-amber-900 block">অ্যাডমিন নোট:</span>
                        {wth.adminNote}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                {isPending && (
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => setRejectModalItem(wth)}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>বাতিল ও রিফান্ড</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(wth.id, wth.userName, wth.amount)}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>পেমেন্ট অনুমোদন</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Rejection & Auto-Refund Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-800">উইথড্র বাতিল ও ব্যালেন্স রিফান্ড</h3>
              </div>
              <button
                onClick={() => setRejectModalItem(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800 space-y-1">
              <p className="font-bold flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5" />
                অটো রিভার্সাল পলিসি:
              </p>
              <p>
                বাতিল করলে কর্তনকৃত <strong>৳{rejectModalItem.amount}</strong> তাৎক্ষণিকভাবে{" "}
                <strong>{rejectModalItem.userName}</strong>-এর ব্যালেন্সে রিফান্ড ক্রেডিট হিসেবে ফেরত যাবে।
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">বাতিলের কারণ / ইউজার মেসেজ:</label>
              <textarea
                rows={3}
                placeholder="যেমন: প্রদানকৃত bKash অ্যাকাউন্টটি সক্রিয় নয়..."
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRejectModalItem(null)}
                className="py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
              >
                ফিরে যান
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow"
              >
                বাতিল ও রিফান্ড করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
