"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  TrendingUp,
  Plus,
  ArrowDown,
  ArrowUp,
} from "lucide-react";

export default function WalletPage() {
  const { profile, transactions } = useMockStore();
  const [filter, setFilter] = useState<"ALL" | "CREDIT" | "DEBIT">("ALL");

  const filteredTx =
    filter === "ALL"
      ? transactions
      : transactions.filter((t) => t.direction === filter);

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        <Header />

        <main className="flex-1 px-3 pt-3 pb-24 flex flex-col gap-3">
          {/* Main Wallet Summary Card */}
          <div className="bg-gradient-to-br from-[#0b2149] via-[#10346c] to-[#1e5eb3] text-white rounded-2xl p-4 shadow-md flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-sky-200 font-medium">বর্তমান মূল ব্যালেন্স</span>
              <span className="bg-white/10 text-[10px] text-sky-100 font-bold px-2 py-0.5 rounded-full">
                BDT (৳)
              </span>
            </div>

            <div className="text-3xl font-extrabold text-white font-sans mt-1">
              ৳ {profile.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>

            {/* Sub Stats: Total Earned & Withdrawn */}
            <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-white/15">
              <div className="flex flex-col">
                <span className="text-[11px] text-sky-200 font-medium">মোট আয়</span>
                <span className="text-sm font-bold text-emerald-300 font-sans mt-0.5">
                  +৳ {profile.totalEarned.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[11px] text-sky-200 font-medium">মোট উত্তোলন</span>
                <span className="text-sm font-bold text-amber-300 font-sans mt-0.5">
                  -৳ {profile.totalWithdrawn.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-3.5">
              <Link
                href="/deposit"
                className="bg-[#00a86b] hover:bg-[#059669] text-white font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>ডিপোজিট করুন</span>
              </Link>
              <Link
                href="/withdraw"
                className="bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <ArrowUpRight className="w-4 h-4 stroke-[2.5] text-[#1e5eb3]" />
                <span>টাকা উত্তোলন</span>
              </Link>
            </div>
          </div>

          {/* Ledger History Header */}
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-slate-600" />
              <span>লেনদেন ইতিহাস (Ledger)</span>
            </h3>

            {/* Direction Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-200/60 p-0.5 rounded-lg text-[11px] font-bold">
              <button
                type="button"
                onClick={() => setFilter("ALL")}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  filter === "ALL" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
                }`}
              >
                সব
              </button>
              <button
                type="button"
                onClick={() => setFilter("CREDIT")}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  filter === "CREDIT" ? "bg-emerald-600 text-white shadow-sm" : "text-slate-500"
                }`}
              >
                জমা (+)
              </button>
              <button
                type="button"
                onClick={() => setFilter("DEBIT")}
                className={`px-2 py-0.5 rounded-md transition-all ${
                  filter === "DEBIT" ? "bg-red-600 text-white shadow-sm" : "text-slate-500"
                }`}
              >
                খরচ (-)
              </button>
            </div>
          </div>

          {/* Transaction List */}
          <div className="flex flex-col gap-2">
            {filteredTx.map((tx) => {
              const isCredit = tx.direction === "CREDIT";
              return (
                <div
                  key={tx.id}
                  className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isCredit
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {isCredit ? (
                        <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                      ) : (
                        <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                      )}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {tx.description}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        {tx.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end flex-shrink-0">
                    <span
                      className={`text-sm font-black font-sans ${
                        isCredit ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {isCredit ? "+" : "-"}৳ {tx.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans">
                      ব্যালেন্স: ৳ {tx.balanceAfter.toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
