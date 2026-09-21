"use client";

import React from "react";
import Link from "next/link";
import { Trophy, Users, ArrowRight, Share2 } from "lucide-react";

export function PromoCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full">
      {/* Left Card: Monthly Bonus */}
      <Link
        href="/monthly-salary"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#fed7aa] via-[#fde047] to-[#f59e0b] p-3.5 shadow-sm border border-amber-200 flex flex-col justify-between min-h-[118px] group hover:shadow-md transition-all block"
      >
        {/* Top Content */}
        <div className="flex items-start justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-600/15 flex items-center justify-center text-amber-900 flex-shrink-0">
              <Trophy className="w-5 h-5 text-amber-900 fill-amber-700/30" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-slate-900 leading-tight">
                মাসিক বোনাস
              </h4>
              <p className="text-[11px] text-slate-700 font-medium leading-tight mt-0.5 max-w-[160px]">
                এই মাসে বেশি কাজ করে বিশেষ বোনাস ও পুরষ্কার
              </p>
            </div>
          </div>

          {/* Reward Tag */}
          <div className="bg-[#a855f7] text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
            ৳ 50
          </div>
        </div>

        {/* Bottom Link & Gift Illustration */}
        <div className="flex items-end justify-between z-10 mt-2">
          <div className="text-xs font-bold text-slate-900 inline-flex items-center gap-1 group-hover:underline">
            <span>বিস্তারিত দেখুন</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>

          {/* Gift Box Graphic */}
          <div className="relative w-14 h-12 flex-shrink-0 -mb-1">
            <svg
              className="w-full h-full drop-shadow-md"
              viewBox="0 0 80 70"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Blue Gift Box */}
              <rect x="5" y="24" width="36" height="36" rx="4" fill="#3b82f6" />
              <rect x="3" y="18" width="40" height="9" rx="2" fill="#2563eb" />
              <rect x="21" y="18" width="5" height="42" fill="#fbbf24" />
              {/* Red Ribbon on Blue Box */}
              <circle cx="23" cy="16" r="4" fill="#fbbf24" />

              {/* Purple/Red Gift Box */}
              <rect x="34" y="15" width="40" height="45" rx="5" fill="#a855f7" />
              <rect x="32" y="8" width="44" height="10" rx="3" fill="#9333ea" />
              <rect x="51" y="8" width="6" height="52" fill="#ef4444" />
              <circle cx="54" cy="6" r="5" fill="#ef4444" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Right Card: Refer a Friend */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#047857] text-white p-3.5 shadow-sm border border-emerald-800 flex flex-col justify-between min-h-[118px]">
        {/* Top Row: Info + Share Button */}
        <div className="flex items-start justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-200 flex-shrink-0">
              <Users className="w-5 h-5 text-emerald-300" />
            </div>
            <div className="flex flex-col">
              <h4 className="text-sm font-bold text-white leading-tight">
                বন্ধুকে রেফার করুন
              </h4>
              <p className="text-[11px] text-amber-300 font-bold leading-tight mt-0.5">
                প্রতি রেফারেলে পান ৳ 20
              </p>
              <p className="text-[10px] text-emerald-100 font-normal leading-tight">
                বেশি রেফার, বেশি ইনকাম
              </p>
            </div>
          </div>

          {/* Share Action Icon */}
          <button
            type="button"
            aria-label="Share"
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center text-white active:scale-90 transition-all"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom CTA Button */}
        <div className="mt-2.5 z-10">
          <button
            type="button"
            className="w-full bg-[#fde047] hover:bg-[#facc15] text-slate-950 font-bold text-xs py-1.5 px-3 rounded-full flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
          >
            <span>এখনই রেফার করুন</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
}
