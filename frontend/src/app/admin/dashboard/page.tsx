"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { adminApi } from "@/lib/api-client";
import {
  Users,
  FileCheck,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Wallet,
} from "lucide-react";

interface AdminStats {
  pendingSubmissions: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  totalUsers: number;
  totalDeposits: { amount: number; formatted: string };
  totalWithdrawals: { amount: number; formatted: string };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    pendingSubmissions: 0,
    pendingDeposits: 0,
    pendingWithdrawals: 0,
    totalUsers: 0,
    totalDeposits: { amount: 0, formatted: "৳ 0" },
    totalWithdrawals: { amount: 0, formatted: "৳ 0" },
  });

  const [recentSubmissions, setRecentSubmissions] = useState<any[]>([]);
  const [recentDeposits, setRecentDeposits] = useState<any[]>([]);
  const [recentWithdrawals, setRecentWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [sData, subData, depData, wthData] = await Promise.allSettled([
        adminApi.getStats(),
        adminApi.getSubmissions(),
        adminApi.getDeposits(),
        adminApi.getWithdrawals(),
      ]);

      if (sData.status === "fulfilled") setStats(sData.value);
      if (subData.status === "fulfilled") setRecentSubmissions(subData.value.slice(0, 4));
      if (depData.status === "fulfilled") setRecentDeposits(depData.value.slice(0, 3));
      if (wthData.status === "fulfilled") setRecentWithdrawals(wthData.value.slice(0, 3));
    } catch (err) {
      console.error("Failed to load admin stats", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-black text-slate-900">অ্যাডমিন কন্ট্রোল ড্যাশবোর্ড</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            প্ল্যাটফর্মের দৈনন্দিন রিভিউ এবং রিয়েল-টাইম আর্থিক লেনদেন নিয়ন্ত্রণ করুন
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="inline-flex items-center gap-1.5 bg-white text-slate-700 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-[#1e5eb3]" : ""}`} />
            <span>রিফ্রেশ</span>
          </button>
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            লাইভ ডেটাবেজ কানেক্টেড
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">পেন্ডিং টাস্ক প্রুফ</span>
            <FileCheck className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-sans mt-2">
            {stats.pendingSubmissions}
          </span>
          <Link
            href="/admin/submissions"
            className="text-[11px] font-bold text-[#1e5eb3] hover:underline mt-2 flex items-center gap-1"
          >
            রিভিউ কিউ দেখুন <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">পেন্ডিং ডিপোজিট</span>
            <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-sans mt-2">
            {stats.pendingDeposits}
          </span>
          <Link
            href="/admin/deposits"
            className="text-[11px] font-bold text-[#1e5eb3] hover:underline mt-2 flex items-center gap-1"
          >
            ডিপোজিট লিস্ট <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">পেন্ডিং উইথড্রয়াল</span>
            <ArrowUpRight className="w-5 h-5 text-red-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-sans mt-2">
            {stats.pendingWithdrawals}
          </span>
          <Link
            href="/admin/withdrawals"
            className="text-[11px] font-bold text-[#1e5eb3] hover:underline mt-2 flex items-center gap-1"
          >
            উইথড্রয়াল প্রসেস <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">নিবন্ধিত ব্যবহারকারী</span>
            <Users className="w-5 h-5 text-[#1e5eb3]" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-sans mt-2">
            {stats.totalUsers}
          </span>
          <Link
            href="/admin/users"
            className="text-[11px] font-bold text-[#1e5eb3] hover:underline mt-2 flex items-center gap-1"
          >
            ইউজার ম্যানেজ করুন <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-emerald-100 block">মোট অনুমোদিত ডিপোজিট</span>
            <span className="text-2xl font-black font-sans mt-1 block">
              ৳ {stats.totalDeposits?.amount?.toLocaleString() || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6 text-emerald-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-600 to-red-800 text-white p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-medium text-rose-100 block">মোট অনুমোদিত উইথড্রয়াল</span>
            <span className="text-2xl font-black font-sans mt-1 block">
              ৳ {stats.totalWithdrawals?.amount?.toLocaleString() || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
            <ArrowUpRight className="w-6 h-6 text-rose-200" />
          </div>
        </div>
      </div>

      {/* Pending Reviews Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Task Submissions Queue */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-500" />
              <span>পেন্ডিং টাস্ক প্রুফ কিউ</span>
            </h3>
            <Link
              href="/admin/submissions"
              className="text-xs font-bold text-[#1e5eb3] hover:underline"
            >
              সবগুলো
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {recentSubmissions.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                কোনো পেন্ডিং টাস্ক প্রুফ নেই
              </div>
            ) : (
              recentSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-2 border border-slate-100"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-200">
                      <img
                        src={sub.screenshotUrl}
                        alt="Proof"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as any).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect width='18' height='18' x='3' y='3' rx='2' ry='2'/%3E%3Ccircle cx='9' cy='9' r='2'/%3E%3Cpath d='m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21'/%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {sub.userName} - {sub.taskTitle}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(sub.submittedAt).toLocaleString("bn-BD")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-bold text-emerald-600 font-sans">
                      ৳ {sub.reward?.amount || sub.reward}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      অপেক্ষমান
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pending Financial Actions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>সাম্প্রতিক পেন্ডিং লেনদেন</span>
            </h3>
            <Link
              href="/admin/deposits"
              className="text-xs font-bold text-[#1e5eb3] hover:underline"
            >
              ডিপোজিট দেখুন
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {[...recentDeposits, ...recentWithdrawals].length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs font-medium">
                কোনো পেন্ডিং আর্থিক লেনদেন নেই
              </div>
            ) : (
              [...recentDeposits, ...recentWithdrawals].slice(0, 4).map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-2 border border-slate-100"
                >
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {item.userName} ({item.paymentMethod})
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      {item.transactionId || item.accountNumber || "পেন্ডিং লেনদেন"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs font-black text-slate-900 font-sans">
                      ৳ {item.amount?.amount || item.amount}
                    </span>
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                      পেন্ডিং
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
