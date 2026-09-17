"use client";

import React from "react";
import Link from "next/link";
import { useMockStore } from "@/lib/mock-store";
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
} from "lucide-react";

export default function AdminDashboardPage() {
  const { submissions, deposits, withdrawals, profile } = useMockStore();

  const pendingSubmissions = submissions.filter((s) => s.status === "PENDING");
  const pendingDeposits = deposits.filter((d) => d.status === "PENDING");
  const pendingWithdrawals = withdrawals.filter((w) => w.status === "PENDING");

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-black text-slate-900">অ্যাডমিন কন্ট্রোল ড্যাশবোর্ড</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            প্ল্যাটফর্মের দৈনন্দিন রিভিউ এবং আর্থিক লেনদেন পরিচালনা করুন
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            লাইভ সিস্টেম রানিং
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">পেন্ডিং টাস্ক প্রুফ</span>
            <FileCheck className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-sans mt-2">
            {pendingSubmissions.length}
          </span>
          <Link
            href="/admin/submissions"
            className="text-[11px] font-bold text-[#1e5eb3] hover:underline mt-2 flex items-center gap-1"
          >
            রিভিউ কিউ দেখুন <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">পেন্ডিং ডিপোজিট</span>
            <ArrowDownLeft className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-sans mt-2">
            {pendingDeposits.length}
          </span>
          <Link
            href="/admin/deposits"
            className="text-[11px] font-bold text-[#1e5eb3] hover:underline mt-2 flex items-center gap-1"
          >
            ডিপোজিট লিস্ট <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">পেন্ডিং উইথড্রয়াল</span>
            <ArrowUpRight className="w-5 h-5 text-red-500" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-sans mt-2">
            {pendingWithdrawals.length}
          </span>
          <Link
            href="/admin/withdrawals"
            className="text-[11px] font-bold text-[#1e5eb3] hover:underline mt-2 flex items-center gap-1"
          >
            উইথড্রয়াল প্রসেস <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold">মোট ব্যবহারকারী</span>
            <Users className="w-5 h-5 text-[#1e5eb3]" />
          </div>
          <span className="text-2xl font-black text-slate-900 font-sans mt-2">
            1,420
          </span>
          <Link
            href="/admin/users"
            className="text-[11px] font-bold text-[#1e5eb3] hover:underline mt-2 flex items-center gap-1"
          >
            ইউজার ম্যানেজ করুন <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Pending Reviews Preview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Task Submissions Queue */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-500" />
              <span>সাম্প্রতিক টাস্ক প্রুফ কিউ</span>
            </h3>
            <Link
              href="/admin/submissions"
              className="text-xs font-bold text-[#1e5eb3] hover:underline"
            >
              সবগুলো
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {submissions.slice(0, 3).map((sub) => (
              <div
                key={sub.id}
                className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                    <img
                      src={sub.screenshotUrl}
                      alt="Proof"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-800 truncate">
                      {sub.userName} - {sub.taskTitle}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {sub.submittedAt}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs font-bold text-emerald-600 font-sans">
                    ৳ {sub.reward}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      sub.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : sub.status === "PENDING"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {sub.status === "APPROVED"
                      ? "অনুমোদিত"
                      : sub.status === "PENDING"
                      ? "অপেক্ষমান"
                      : "বাতিল"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Financial Actions */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 flex flex-col">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>সাম্প্রতিক ডিপোজিট ও উইথড্রয়াল</span>
            </h3>
            <Link
              href="/admin/deposits"
              className="text-xs font-bold text-[#1e5eb3] hover:underline"
            >
              সবগুলো
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            {[...deposits, ...withdrawals].slice(0, 3).map((item, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 rounded-xl flex items-center justify-between gap-2"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-800">
                    {item.userName} ({item.paymentMethod})
                  </span>
                  <span className="text-[10px] text-slate-400 font-sans">
                    {item.createdAt}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-900 font-sans">
                    ৳ {item.amount}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      item.status === "APPROVED"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
