"use client";

import React from "react";
import { ArrowRight, CheckCircle2, TrendingUp } from "lucide-react";

export function PromoHeroBanner() {
  return (
    <div className="w-full relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0369a1] via-[#0284c7] to-[#07244c] text-white p-3.5 sm:p-4 shadow-md">
      {/* Background Decorative Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left Side: Avatar Illustration + Headings + CTA */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Illustration Avatar / Character */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center">
            {/* Glow circle behind */}
            <div className="absolute inset-1 rounded-full bg-sky-300/30 blur-sm" />
            {/* SVG Cartoon Character with Laptop & Growth Arrow */}
            <svg
              className="w-full h-full relative z-10 drop-shadow-md"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Plant leaf in background */}
              <ellipse
                cx="30"
                cy="60"
                rx="14"
                ry="24"
                transform="rotate(-25 30 60)"
                fill="#10b981"
                opacity="0.8"
              />
              <ellipse
                cx="35"
                cy="50"
                rx="10"
                ry="18"
                transform="rotate(15 35 50)"
                fill="#059669"
                opacity="0.9"
              />
              {/* Golden Trending Graph / Arrow */}
              <path
                d="M60 70 L75 52 L90 60 L110 32"
                stroke="#fbbf24"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M100 32 L110 32 L110 42"
                stroke="#fbbf24"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Person Body (Orange/Yellow Shirt) */}
              <path
                d="M36 106 C36 88 48 80 62 80 C76 80 88 88 88 106 Z"
                fill="#f59e0b"
              />
              {/* Head */}
              <circle cx="62" cy="56" r="16" fill="#fde68a" />
              {/* Hair */}
              <path
                d="M48 54 C48 40 56 36 68 36 C76 36 78 44 78 50 C74 46 64 48 56 52 Z"
                fill="#1e293b"
              />
              {/* Face details */}
              <circle cx="58" cy="54" r="1.8" fill="#1e293b" />
              <circle cx="68" cy="54" r="1.8" fill="#1e293b" />
              <path
                d="M60 62 Q63 65 67 62"
                stroke="#1e293b"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Laptop */}
              <rect
                x="44"
                y="86"
                width="36"
                height="22"
                rx="3"
                fill="#334155"
              />
              <polygon points="40,108 84,108 80,111 44,111" fill="#64748b" />
              <rect
                x="48"
                y="90"
                width="28"
                height="14"
                rx="1"
                fill="#38bdf8"
                opacity="0.8"
              />
            </svg>
          </div>

          {/* Texts & CTA */}
          <div className="flex flex-col">
            <h3 className="text-base sm:text-lg font-extrabold text-[#fcd34d] leading-tight drop-shadow-sm">
              সহজ কাজ, নিশ্চিত ইনকাম
            </h3>
            <p className="text-xs sm:text-sm text-sky-100 font-medium mt-0.5">
              আপনার সময়কে বানান আয়ের উৎস
            </p>

            <div className="mt-2.5">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-bold text-xs sm:text-sm px-3.5 py-1.5 rounded-full shadow-md active:scale-95 transition-all"
              >
                <span>এখনই কাজ শুরু করুন</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Trust Checklist */}
        <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 sm:gap-2 w-full md:w-auto border-t md:border-t-0 md:border-l border-white/20 pt-2.5 md:pt-0 md:pl-4">
          {[
            "নির্ভরযোগ্য প্ল্যাটফর্ম",
            "সহজ কাজ, নিশ্চিত পেমেন্ট",
            "রিয়েল ইনকাম",
            "২৪/৭ সাপোর্ট",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 stroke-[2.5]" />
              </div>
              <span className="text-[11px] sm:text-xs text-sky-100 font-medium whitespace-nowrap">
                {item}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
