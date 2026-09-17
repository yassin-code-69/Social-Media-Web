"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import {
  History as HistoryIcon,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowDown,
  ArrowUp,
  Image as ImageIcon,
} from "lucide-react";

export default function HistoryPage() {
  const { submissions, deposits, withdrawals, transactions, referrals } =
    useMockStore();

  const [activeTab, setActiveTab] = useState<
    "all" | "tasks" | "deposits" | "withdrawals" | "wallet" | "referrals"
  >("all");

  const tabs = [
    { id: "all", label: "সব" },
    { id: "tasks", label: "টাস্ক প্রুফ" },
    { id: "deposits", label: "ডিপোজিট" },
    { id: "withdrawals", label: "উইথড্রয়াল" },
    { id: "wallet", label: "লেজার" },
    { id: "referrals", label: "রেফারেল" },
  ];

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        <Header />

        <main className="flex-1 px-3 pt-3 pb-24 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
              <HistoryIcon className="w-4 h-4 text-[#1e5eb3]" />
              <span>কার্যক্রম ইতিহাস (Activity History)</span>
            </h2>
            <span className="text-xs text-slate-500">সকল হিস্ট্রি এক নজরে</span>
          </div>

          {/* Horizontally scrollable Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-[#1e5eb3] text-white shadow-sm"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content List */}
          <div className="flex flex-col gap-2.5 mt-1">
            {/* 1. Tasks Submissions Tab */}
            {(activeTab === "all" || activeTab === "tasks") && (
              <div className="flex flex-col gap-2">
                {activeTab === "all" && (
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    টাস্ক জমা
                  </span>
                )}
                {submissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-200 flex-shrink-0 bg-slate-100">
                        <img
                          src={sub.screenshotUrl}
                          alt="Proof"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {sub.taskTitle}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {sub.submittedAt}
                        </span>
                        {sub.rejectionReason && (
                          <span className="text-[10px] text-red-600 font-semibold mt-0.5">
                            কারণ: {sub.rejectionReason}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className="text-xs font-bold text-[#1e5eb3] font-sans">
                        ৳ {sub.reward}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-1 flex items-center gap-0.5 ${
                          sub.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : sub.status === "PENDING"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {sub.status === "APPROVED" && <CheckCircle2 className="w-2.5 h-2.5" />}
                        {sub.status === "PENDING" && <Clock className="w-2.5 h-2.5" />}
                        {sub.status === "REJECTED" && <XCircle className="w-2.5 h-2.5" />}
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
            )}

            {/* 2. Deposits Tab */}
            {(activeTab === "all" || activeTab === "deposits") && (
              <div className="flex flex-col gap-2 mt-2">
                {activeTab === "all" && (
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    ডিপোজিট
                  </span>
                )}
                {deposits.map((dep) => (
                  <div
                    key={dep.id}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">
                        {dep.paymentMethod} রিচার্জ - ৳ {dep.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans mt-0.5">
                        TrxID: {dep.transactionId} • {dep.createdAt}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          dep.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {dep.status === "APPROVED" ? "সফল" : "অপেক্ষমান"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 3. Withdrawals Tab */}
            {(activeTab === "all" || activeTab === "withdrawals") && (
              <div className="flex flex-col gap-2 mt-2">
                {activeTab === "all" && (
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    উইথড্রয়াল
                  </span>
                )}
                {withdrawals.map((wth) => (
                  <div
                    key={wth.id}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">
                        {wth.paymentMethod} উত্তোলন - ৳ {wth.amount.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-slate-400 font-sans mt-0.5">
                        অ্যাকাউন্ট: {wth.maskedAccount} • {wth.createdAt}
                      </span>
                    </div>
                    <div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          wth.status === "APPROVED"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {wth.status === "APPROVED" ? "সম্পন্ন" : "প্রক্রিয়াধীন"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4. Wallet Ledger Tab */}
            {activeTab === "wallet" && (
              <div className="flex flex-col gap-2">
                {transactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center justify-between"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800">
                        {tx.description}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {tx.createdAt}
                      </span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-xs font-black font-sans ${
                          tx.direction === "CREDIT"
                            ? "text-emerald-600"
                            : "text-red-600"
                        }`}
                      >
                        {tx.direction === "CREDIT" ? "+" : "-"}৳ {tx.amount}
                      </span>
                      <span className="text-[9px] text-slate-400 font-sans">
                        ব্যালেন্স: ৳ {tx.balanceAfter}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
