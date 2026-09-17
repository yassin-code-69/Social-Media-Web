"use client";

import React, { useState } from "react";
import { Eye, EyeOff, Plus, ArrowUpRight, Crown } from "lucide-react";

export function ProfileWalletCard() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 w-full">
      {/* Left Card: User Welcome */}
      <div className="sm:col-span-5 bg-white rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center gap-3">
        {/* User Avatar */}
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-400 p-0.5 shadow-sm flex-shrink-0 bg-slate-100">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
            alt="তামিম ইসলাম"
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-slate-500 leading-tight">
            স্বাগতম!
          </span>
          <h2 className="text-base font-bold text-slate-900 truncate leading-snug">
            তামিম ইসলাম
          </h2>
          {/* Gold Member Badge */}
          <div className="mt-1 inline-flex items-center gap-1 bg-[#0b2149] text-[#fbbf24] px-2 py-0.5 rounded-full text-[11px] font-semibold w-max shadow-sm">
            <Crown className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
            <span>Gold মেম্বার</span>
          </div>
        </div>
      </div>

      {/* Right Card: Wallet Balance & Actions */}
      <div className="sm:col-span-7 bg-white rounded-2xl p-3 shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-slate-100 flex items-center justify-between gap-2">
        {/* Wallet Balance Info */}
        <div className="flex items-center gap-2.5 min-w-0">
          {/* Green Wallet Icon SVG */}
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
            <svg
              className="w-7 h-7"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5 text-slate-500">
              <span className="text-xs font-medium">মোট ব্যালেন্স</span>
              <button
                type="button"
                onClick={() => setShowBalance(!showBalance)}
                aria-label={showBalance ? "Hide balance" : "Show balance"}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showBalance ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <div className="text-lg font-bold text-slate-900 tracking-tight font-sans mt-0.5">
              {showBalance ? "৳ 1,250.00" : "৳ ••••••"}
            </div>
          </div>
        </div>

        {/* Buttons: Deposit and Withdraw */}
        <div className="flex flex-col gap-1.5 flex-shrink-0">
          <button
            type="button"
            className="flex items-center justify-center gap-1 bg-[#00a86b] hover:bg-[#059669] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>ডিপোজিট</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-1 bg-[#1e5eb3] hover:bg-[#154286] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm active:scale-95 transition-all"
          >
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>উইথড্র করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
