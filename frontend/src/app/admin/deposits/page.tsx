"use client";

import React, { useState } from "react";
import { useMockStore, DepositItem } from "@/lib/mock-store";
import {
  ArrowDownLeft,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  Eye,
  X,
  Copy,
  Check,
  AlertCircle,
  Clock,
  ShieldCheck,
} from "lucide-react";

export default function AdminDepositsPage() {
  const { deposits, approveDeposit, rejectDeposit } = useMockStore();
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Rejection modal state
  const [rejectModalItem, setRejectModalItem] = useState<DepositItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [copiedTrxId, setCopiedTrxId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const handleCopy = (trxId: string) => {
    navigator.clipboard.writeText(trxId);
    setCopiedTrxId(trxId);
    setTimeout(() => setCopiedTrxId(null), 2000);
  };

  const handleApprove = (depId: string, amount: number) => {
    approveDeposit(depId);
    setActionSuccessMsg(`৳${amount} ডিপোজিট সফলভাবে অনুমোদন করা হয়েছে এবং ইউজার ব্যালেন্সে যোগ হয়েছে!`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleConfirmReject = () => {
    if (!rejectModalItem) return;
    rejectDeposit(rejectModalItem.id, rejectReason || "ভুল ট্রানজেকশন তথ্য বা পেমেন্ট পাওয়া যায়নি");
    setActionSuccessMsg(`ডিপোজিট অনুরোধ (${rejectModalItem.transactionId}) বাতিল করা হয়েছে।`);
    setRejectModalItem(null);
    setRejectReason("");
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const filteredDeposits = deposits.filter((dep) => {
    if (filterStatus !== "ALL" && dep.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        dep.transactionId.toLowerCase().includes(q) ||
        dep.senderNumber.includes(q) ||
        dep.userName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const pendingCount = deposits.filter((d) => d.status === "PENDING").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">ডিপোজিট রিকোয়েস্ট অনুমোদন</h1>
            {pendingCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 animate-pulse">
                {pendingCount}টি পেন্ডিং
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            ইউজারদের পাঠানো রিচার্জ এবং ডিপোজিট ভেরিফাই করে ব্যালেন্স যুক্ত করুন।
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold">{actionSuccessMsg}</span>
          </div>
          <button onClick={() => setActionSuccessMsg(null)} className="text-emerald-600 hover:text-emerald-800">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full md:w-auto overflow-x-auto">
          {[
            { id: "PENDING", label: `পেন্ডিং (${pendingCount})` },
            { id: "ALL", label: `সব (${deposits.length})` },
            { id: "APPROVED", label: "অনুমোদিত" },
            { id: "REJECTED", label: "বাতিল" },
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

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="TrxID বা নম্বর খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]/20 focus:border-[#1e5eb3]"
          />
        </div>
      </div>

      {/* Deposits List */}
      {filteredDeposits.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
            <ArrowDownLeft className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">কোনো ডিপোজিট রিকোয়েস্ট পাওয়া যায়নি</h3>
          <p className="text-xs text-slate-500 mt-1">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDeposits.map((dep) => {
            const isPending = dep.status === "PENDING";
            const isApproved = dep.status === "APPROVED";
            return (
              <div
                key={dep.id}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {/* Status indicator bar */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 ${
                    isPending ? "bg-amber-400" : isApproved ? "bg-emerald-500" : "bg-rose-400"
                  }`}
                />

                <div className="space-y-3">
                  {/* Top info: User and Status */}
                  <div className="flex items-start justify-between gap-2 pt-1">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{dep.userName}</h4>
                      <span className="text-[10px] text-slate-400">আইডি: {dep.userId}</span>
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
                      {isPending ? "পেন্ডিং" : isApproved ? "অনুমোদিত" : "বাতিল"}
                    </span>
                  </div>

                  {/* Amount and Method */}
                  <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">জমা পরিমাণ</span>
                      <span className="text-base font-bold text-emerald-600 font-inter">৳{dep.amount}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">পদ্ধতি</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-800">
                        {dep.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Transaction Details */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">প্রেরক নম্বর:</span>
                      <span className="font-mono font-bold text-slate-800">{dep.senderNumber}</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-slate-400">ট্রানজেকশন আইডি:</span>
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-bold text-[#1e5eb3]">{dep.transactionId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(dep.transactionId)}
                          className="p-1 text-slate-400 hover:text-slate-700 rounded"
                          title="কপি করুন"
                        >
                          {copiedTrxId === dep.transactionId ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>সময়:</span>
                      <span>{dep.createdAt}</span>
                    </div>

                    {dep.adminNote && (
                      <div className="text-[11px] text-slate-500 bg-amber-50 p-2 rounded-lg border border-amber-100 mt-2">
                        <span className="font-bold text-amber-900 block">অ্যাডমিন নোট:</span>
                        {dep.adminNote}
                      </div>
                    )}
                  </div>

                  {/* Screenshot Preview */}
                  {dep.screenshotUrl && (
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => setPreviewImage(dep.screenshotUrl!)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-sky-50 text-[#1e5eb3] hover:bg-sky-100 rounded-xl text-xs font-bold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>পেমেন্ট স্ক্রিনশট দেখুন</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Actions (If Pending) */}
                {isPending && (
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 mt-4">
                    <button
                      type="button"
                      onClick={() => setRejectModalItem(dep)}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>বাতিল করুন</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(dep.id, dep.amount)}
                      className="flex items-center justify-center gap-1 py-2 px-3 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>অনুমোদন</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-800">ডিপোজিট বাতিল নিশ্চিতকরণ</h3>
              <button
                onClick={() => setRejectModalItem(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              আপনি কি নিশ্চিত যে <strong>{rejectModalItem.userName}</strong>-এর{" "}
              <strong>৳{rejectModalItem.amount}</strong> ডিপোজিটটি বাতিল করতে চান?
            </p>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700">বাতিলের কারণ / নোট:</label>
              <textarea
                rows={3}
                placeholder="যেমন: ভুল TrxID বা অ্যাকাউন্টে কোনো টাকা আসেনি..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
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
                হ্যাঁ, বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-lg w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl p-2"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={previewImage}
              alt="Deposit Proof"
              className="w-full max-h-[80vh] object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
