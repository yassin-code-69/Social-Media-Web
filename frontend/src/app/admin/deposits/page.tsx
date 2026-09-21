"use client";

import React, { useEffect, useState } from "react";
import { adminApi } from "@/lib/api-client";
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
  RefreshCw,
} from "lucide-react";

interface DepositItem {
  id: string;
  userId: string;
  userName: string;
  phone: string;
  amount: { amount: number; formatted: string };
  paymentMethod: string;
  senderNumber: string;
  transactionId: string;
  screenshotUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<DepositItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("PENDING");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Rejection modal state
  const [rejectModalItem, setRejectModalItem] = useState<DepositItem | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [copiedTrxId, setCopiedTrxId] = useState<string | null>(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadDeposits = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getDeposits();
      setDeposits(data);
    } catch (err: any) {
      console.error("Failed to fetch deposits", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeposits();
  }, []);

  const handleCopy = (trxId: string) => {
    navigator.clipboard.writeText(trxId);
    setCopiedTrxId(trxId);
    setTimeout(() => setCopiedTrxId(null), 2000);
  };

  const handleApprove = async (depId: string, amount: number) => {
    try {
      setActionLoading(depId);
      const res = await adminApi.approveDeposit(depId);
      setActionSuccessMsg(res.message || `৳${amount} ডিপোজিট সফলভাবে অনুমোদন ও ব্যালেন্সে যোগ করা হয়েছে!`);
      await loadDeposits();
    } catch (err: any) {
      alert(err.message || "ডিপোজিট অনুমোদন করতে ব্যর্থ হয়েছে");
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectModalItem) return;
    try {
      setActionLoading(rejectModalItem.id);
      const res = await adminApi.rejectDeposit(
        rejectModalItem.id,
        rejectReason || "ভুল ট্রানজেকশন তথ্য বা পেমেন্ট পাওয়া যায়নি"
      );
      setActionSuccessMsg(res.message || `ডিপোজিট (${rejectModalItem.transactionId}) বাতিল করা হয়েছে।`);
      setRejectModalItem(null);
      setRejectReason("");
      await loadDeposits();
    } catch (err: any) {
      alert(err.message || "বাতিল করতে ব্যর্থ হয়েছে");
    } finally {
      setActionLoading(null);
      setTimeout(() => setActionSuccessMsg(null), 4000);
    }
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
            ইউজারদের পাঠানো রিচার্জ এবং ডিপোজিট ভেরিফাই করে সরাসরি ডাটাবেজ ব্যালেন্স যুক্ত করুন।
          </p>
        </div>
        <button
          type="button"
          onClick={loadDeposits}
          disabled={loading}
          className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1e5eb3]" : ""}`} />
          <span>রিফ্রেশ</span>
        </button>
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
      {loading && deposits.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
          <div className="w-8 h-8 border-3 border-[#1e5eb3] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-bold">ডিপোজিট রেকর্ড লোড হচ্ছে...</p>
        </div>
      ) : filteredDeposits.length === 0 ? (
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
            const amtNum = dep.amount?.amount || (dep.amount as any);
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

                <div className="space-y-3 pt-1">
                  {/* Top user & status row */}
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{dep.userName}</h3>
                      <p className="text-[11px] text-slate-400 font-mono">{dep.phone}</p>
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
                      {isApproved ? "অনুমোদিত" : isPending ? "অপেক্ষমান" : "বাতিল"}
                    </span>
                  </div>

                  {/* Amount card */}
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-semibold block">ডিপোজিট পরিমাণ</span>
                      <span className="text-lg font-black text-emerald-600 font-sans">
                        ৳ {amtNum}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-semibold block">মাধ্যম</span>
                      <span className="text-xs font-bold text-slate-800 uppercase px-2 py-0.5 bg-white rounded-md border border-slate-200">
                        {dep.paymentMethod}
                      </span>
                    </div>
                  </div>

                  {/* Transaction details */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400">প্রেরক নম্বর:</span>
                      <span className="font-mono font-bold text-slate-800">{dep.senderNumber}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="text-[11px] text-slate-400">TrxID:</span>
                      <div className="flex items-center gap-1 font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                        <span>{dep.transactionId}</span>
                        <button
                          type="button"
                          onClick={() => handleCopy(dep.transactionId)}
                          className="text-slate-400 hover:text-slate-700 ml-1"
                        >
                          {copiedTrxId === dep.transactionId ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 text-[10px]">
                      <span>তারিখ:</span>
                      <span>{new Date(dep.createdAt).toLocaleString("bn-BD")}</span>
                    </div>
                  </div>

                  {/* Screenshot preview button */}
                  {dep.screenshotUrl && (
                    <button
                      type="button"
                      onClick={() => setPreviewImage(dep.screenshotUrl || null)}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>পেমেন্ট স্ক্রিনশট দেখুন</span>
                    </button>
                  )}
                </div>

                {/* Actions */}
                {isPending && (
                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      disabled={actionLoading === dep.id}
                      onClick={() => setRejectModalItem(dep)}
                      className="flex-1 py-2 px-3 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                      বাতিল
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === dep.id}
                      onClick={() => handleApprove(dep.id, amtNum)}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-50"
                    >
                      অনুমোদন করুন
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Screenshot Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-4 relative shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-sm font-bold text-slate-800">পেমেন্ট স্ক্রিনশট</h4>
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="my-3 max-h-[70vh] overflow-auto rounded-xl bg-slate-900 flex items-center justify-center">
              <img
                src={previewImage}
                alt="Deposit Proof"
                className="max-h-[65vh] w-auto object-contain"
                onError={(e) => {
                  (e.target as any).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='400' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModalItem && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 space-y-4 shadow-2xl">
            <div>
              <h4 className="text-sm font-bold text-slate-900">ডিপোজিট বাতিল করার কারণ</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                TrxID: <span className="font-mono font-bold text-slate-700">{rejectModalItem.transactionId}</span>
              </p>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                বাতিলের কারণ (ইউজারের নোটিশে দেখাবে):
              </label>
              <textarea
                rows={3}
                placeholder="যেমন: টাকা একাউন্টে জমা হয়নি বা ট্রানজেকশন আইডি ভুল..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
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
                নিশ্চিত বাতিল করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
