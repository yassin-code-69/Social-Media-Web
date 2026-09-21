"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import { missionsApi } from "@/lib/api-client";
import {
  Sparkles,
  Trophy,
  Gift,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
  Flame,
  Award,
  ChevronRight,
  HelpCircle,
  TrendingUp,
} from "lucide-react";

// Slices of the Fortune Wheel (8 slices)
interface WheelSlice {
  amount: number;
  label: string;
  subLabel?: string;
  bgGradient: string;
  textColor: string;
  isJackpot?: boolean;
}

const WHEEL_SLICES: WheelSlice[] = [
  {
    amount: 10,
    label: "৳ ১০",
    subLabel: "ক্যাশ রিওয়ার্ড",
    bgGradient: "#0b2654",
    textColor: "#ffffff",
  },
  {
    amount: 2,
    label: "৳ ২",
    subLabel: "বোনাস",
    bgGradient: "#0284c7",
    textColor: "#ffffff",
  },
  {
    amount: 50,
    label: "৳ ৫০",
    subLabel: "মেগা প্রাইজ",
    bgGradient: "#d97706",
    textColor: "#ffffff",
  },
  {
    amount: 5,
    label: "৳ ৫",
    subLabel: "ক্যাশ রিওয়ার্ড",
    bgGradient: "#059669",
    textColor: "#ffffff",
  },
  {
    amount: 20,
    label: "৳ ২০",
    subLabel: "সুপার প্রাইজ",
    bgGradient: "#7c3aed",
    textColor: "#ffffff",
  },
  {
    amount: 1,
    label: "৳ ১",
    subLabel: "লাকি টোকেন",
    bgGradient: "#db2777",
    textColor: "#ffffff",
  },
  {
    amount: 100,
    label: "৳ ১০০",
    subLabel: "👑 জ্যাকপট",
    bgGradient: "#eab308",
    textColor: "#000000",
    isJackpot: true,
  },
  {
    amount: 15,
    label: "৳ ১৫",
    subLabel: "বোনাস",
    bgGradient: "#0d9488",
    textColor: "#ffffff",
  },
];

// Platform winners from activity
const LIVE_WINNERS: { name: string; phone: string; prize: string; time: string; badge: string }[] = [];

export default function DailySpinPage() {
  const { profile, dailySpin, performDailySpin, resetDailySpinForTest } = useMockStore();

  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winningSlice, setWinningSlice] = useState<WheelSlice | null>(null);
  const [showWinModal, setShowWinModal] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"wheel" | "history" | "rules">("wheel");

  const totalSlices = WHEEL_SLICES.length;
  const sliceAngle = 360 / totalSlices; // 45 degrees

  const handleStartSpin = () => {
    if (isSpinning) return;

    if (dailySpin.spinsRemaining <= 0) {
      setToastMsg("আপনার আজকের স্পিন কোটা শেষ! কাল আবার চেষ্টা করুন অথবা প্যাকেজ আপগ্রেড করুন।");
      setTimeout(() => setToastMsg(null), 3500);
      return;
    }

    setIsSpinning(true);
    setShowWinModal(false);
    setWinningSlice(null);

    // Pick a winning slice randomly with realistic weights
    // (Jackpot ৳100 is rare, ৳5/৳10/৳15 are common)
    const weights = [25, 20, 8, 25, 12, 20, 5, 15]; // weights matching WHEEL_SLICES indices
    const totalWeight = weights.reduce((acc, w) => acc + w, 0);
    let randomNum = Math.random() * totalWeight;
    let selectedIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      if (randomNum < weights[i]) {
        selectedIndex = i;
        break;
      }
      randomNum -= weights[i];
    }

    const selectedSlice = WHEEL_SLICES[selectedIndex];

    // Math calculation:
    // Pointer is fixed at 12 o'clock.
    // In our SVG, slice i midAngle is i * 45 deg from 3 o'clock (0 rad).
    // Let's ensure rotation lands slice selectedIndex directly under the pointer at 12 o'clock!
    // Slice i startAngle: i * 45 - 22.5 deg. midAngle: i * 45 deg.
    // 12 o'clock is 270 deg (or -90 deg).
    // When wheel rotates by R deg, angle becomes (midAngle + R) % 360.
    // We want (midAngle + R) % 360 = 270.
    // Therefore R % 360 = (270 - midAngle + 360) % 360.
    const fullSpins = 6 * 360;
    const midAngle = selectedIndex * 45;
    const targetOffset = (270 - midAngle + 360) % 360;
    const currentModulo = rotation % 360;
    const nextRotation = rotation - currentModulo + fullSpins + targetOffset;

    setRotation(nextRotation);

    // Spin duration is 4.5 seconds
    setTimeout(() => {
      setIsSpinning(false);
      setWinningSlice(selectedSlice);
      // Perform store update
      performDailySpin(selectedSlice.amount);
      missionsApi.luckySpin().catch(() => {});
      setShowWinModal(true);
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#dff0f8] text-slate-800 flex flex-col font-hind selection:bg-[#0284c7] selection:text-white">
      {/* Digonto Top Shell Header */}
      <Header />

      {/* Main Container */}
      <main className="max-w-lg w-full mx-auto bg-[#eaf5fa] min-h-[calc(100vh-64px)] shadow-2xl border-x border-slate-200/50 flex flex-col pb-28">
        
        {/* Toast Notification */}
        {toastMsg && (
          <div className="sticky top-16 z-50 px-4 pt-2">
            <div className="bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-xs animate-in slide-in-from-top-2">
              <Sparkles className="w-4 h-4 shrink-0 text-slate-950" />
              <span>{toastMsg}</span>
            </div>
          </div>
        )}

        {/* Hero Marquee Banner */}
        <section className="bg-gradient-to-b from-[#071b3b] via-[#0b2654] to-[#143e79] text-white p-5 rounded-b-3xl shadow-lg relative overflow-hidden">
          {/* Glowing particle dots */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3 text-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>DIGONTO LUCKY WHEEL</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow">
              দৈনিক লাকি স্পিন
            </h1>
            <p className="text-xs text-sky-100/90 max-w-xs mx-auto leading-relaxed">
              ভাগ্যের চাকা ঘুরিয়ে জিতে নিন আকর্ষণীয় নগদ টাকা! প্রতিদিন নিশ্চিত রিওয়ার্ড।
            </p>

            {/* Quick Status Bar */}
            <div className="grid grid-cols-2 gap-2.5 pt-2 max-w-sm mx-auto">
              {/* Wallet Pill */}
              <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-2.5 text-left flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/20 flex items-center justify-center text-sky-300">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-sky-200 block font-medium">বর্তমান ওয়ালেট</span>
                  <span className="text-sm font-black font-inter text-white">৳ {profile.balance.toFixed(2)}</span>
                </div>
              </div>

              {/* Spins Remaining Pill */}
              <div className="bg-gradient-to-r from-amber-500/20 to-yellow-500/20 backdrop-blur-md border border-amber-400/40 rounded-2xl p-2.5 text-left flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-300">
                  <Flame className="w-4 h-4 animate-bounce" />
                </div>
                <div>
                  <span className="text-[10px] text-amber-200 block font-medium">আজকের স্পিন</span>
                  <span className="text-sm font-black text-amber-300 flex items-center gap-1">
                    {dailySpin.spinsRemaining} টি বাকি
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Tabs */}
        <div className="px-4 mt-3">
          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-2xl shadow-sm border border-slate-200/80">
            <button
              onClick={() => setActiveTab("wheel")}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "wheel"
                  ? "bg-[#0b2654] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>স্পিন হুইল</span>
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "history"
                  ? "bg-[#0b2654] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>উইনার তালিকা</span>
            </button>
            <button
              onClick={() => setActiveTab("rules")}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "rules"
                  ? "bg-[#0b2654] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>নিয়মাবলী</span>
            </button>
          </div>
        </div>

        {/* TAB 1: WHEEL & PLAY */}
        {activeTab === "wheel" && (
          <div className="px-4 py-4 space-y-4">
            
            {/* The Wheel Stage Card */}
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-sky-100 flex flex-col items-center relative overflow-hidden">
              
              {/* Outer Glowing Stage Ring */}
              <div className="relative w-[310px] h-[310px] sm:w-[330px] sm:h-[330px] flex items-center justify-center my-2">
                
                {/* Stopper / Pointer Pin at 12 o'clock */}
                <div className="absolute -top-3 z-30 flex flex-col items-center">
                  {/* Golden Needle with Ruby Tip */}
                  <div className="w-8 h-10 relative drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]">
                    <svg viewBox="0 0 40 50" className="w-full h-full">
                      <defs>
                        <linearGradient id="pinGold" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="50%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#b45309" />
                        </linearGradient>
                      </defs>
                      <polygon points="20,48 5,12 35,12" fill="url(#pinGold)" stroke="#78350f" strokeWidth="1.5" />
                      <circle cx="20" cy="14" r="9" fill="#dc2626" stroke="#fef08a" strokeWidth="2" />
                      <circle cx="20" cy="14" r="4" fill="#ffffff" />
                    </svg>
                  </div>
                </div>

                {/* Outer Ring with Blinking Casino Lights */}
                <div className="absolute inset-0 rounded-full border-[10px] border-[#d97706] shadow-[0_0_25px_rgba(217,119,6,0.3),inset_0_0_15px_rgba(0,0,0,0.3)] bg-[#b45309] flex items-center justify-center">
                  
                  {/* 16 Bulbs around rim */}
                  {Array.from({ length: 16 }).map((_, idx) => {
                    const bulbAngle = (idx * 360) / 16;
                    const rad = (bulbAngle * Math.PI) / 180;
                    // Radius offset inside border
                    const r = 148;
                    const x = Math.sin(rad) * r;
                    const y = -Math.cos(rad) * r;
                    const isEven = idx % 2 === 0;

                    return (
                      <div
                        key={idx}
                        className={`absolute w-2.5 h-2.5 rounded-full border border-black/30 shadow-sm transition-all duration-300 ${
                          isSpinning
                            ? isEven
                              ? "bg-yellow-300 shadow-[0_0_8px_#fde047] scale-110"
                              : "bg-white shadow-[0_0_8px_#ffffff] scale-90"
                            : isEven
                            ? "bg-amber-200"
                            : "bg-white"
                        }`}
                        style={{
                          transform: `translate(${x}px, ${y}px)`,
                        }}
                      />
                    );
                  })}
                </div>

                {/* Rotating Wheel Itself */}
                <div
                  className="w-[280px] h-[280px] sm:w-[300px] sm:h-[300px] rounded-full relative overflow-hidden shadow-inner"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning
                      ? "transform 4.5s cubic-bezier(0.12, 0.82, 0.2, 1.0)"
                      : "none",
                  }}
                >
                  <svg viewBox="0 0 300 300" className="w-full h-full select-none">
                    <defs>
                      <filter id="segmentShadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#000000" floodOpacity="0.25" />
                      </filter>
                    </defs>

                    {/* Render 8 Slices */}
                    {WHEEL_SLICES.map((slice, i) => {
                      // Center is 150, 150. Radius 150.
                      const startAngle = i * 45 - 22.5;
                      const endAngle = (i + 1) * 45 - 22.5;
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;

                      const x1 = 150 + 150 * Math.cos(startRad);
                      const y1 = 150 + 150 * Math.sin(startRad);
                      const x2 = 150 + 150 * Math.cos(endRad);
                      const y2 = 150 + 150 * Math.sin(endRad);

                      const pathData = `M 150 150 L ${x1} ${y1} A 150 150 0 0 1 ${x2} ${y2} Z`;
                      const midAngle = i * 45;

                      return (
                        <g key={i}>
                          {/* Wedge background */}
                          <path
                            d={pathData}
                            fill={slice.bgGradient}
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />

                          {/* Slice Text placed along radial line */}
                          <g transform={`rotate(${midAngle + 90}, 150, 150)`}>
                            <text
                              x="150"
                              y="48"
                              fill={slice.textColor}
                              fontSize="14"
                              fontWeight="900"
                              textAnchor="middle"
                              filter="url(#segmentShadow)"
                              className="font-inter tracking-tight"
                            >
                              {slice.label}
                            </text>
                            <text
                              x="150"
                              y="64"
                              fill={slice.textColor}
                              fontSize="9"
                              fontWeight="700"
                              opacity="0.9"
                              textAnchor="middle"
                            >
                              {slice.subLabel}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Center Golden Hub / 3D Cap */}
                <div className="absolute z-20 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-200 p-1 shadow-[0_4px_12px_rgba(0,0,0,0.35)] flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#0b2654] border-2 border-amber-300 flex flex-col items-center justify-center text-center shadow-inner">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
                    <span className="text-[9px] font-black text-amber-300 tracking-wider">SPIN</span>
                  </div>
                </div>

              </div>

              {/* Action Button & Quota Info */}
              <div className="w-full max-w-sm pt-4 space-y-3 text-center">
                {dailySpin.spinsRemaining > 0 ? (
                  <button
                    type="button"
                    disabled={isSpinning}
                    onClick={handleStartSpin}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-slate-950 font-black text-base shadow-[0_8px_20px_rgba(245,158,11,0.35)] hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                  >
                    <Sparkles className={`w-5 h-5 text-slate-950 ${isSpinning ? "animate-spin" : "group-hover:rotate-12 transition-transform"}`} />
                    <span>{isSpinning ? "ভাগ্যের চাকা ঘুরছে..." : "স্পিন করুন (এখনই ঘুরান!)"}</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled
                      className="w-full py-3.5 px-6 rounded-2xl bg-slate-200 text-slate-500 font-bold text-sm shadow-inner flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>আজকের ফ্রি স্পিন শেষ!</span>
                    </button>
                    <p className="text-[11px] text-slate-500">
                      আগামীকাল রাত ১২:০০ টায় নতুন ফ্রি স্পিন যোগ হবে। অতিরিক্ত স্পিনের জন্য প্যাকেজ আপগ্রেড করুন।
                    </p>
                  </div>
                )}

                {/* Test Mode Quick Refresh Button */}
                <div className="flex items-center justify-between pt-1 px-1">
                  <span className="text-[11px] text-slate-500 font-medium">
                    মোট সম্পন্ন: <strong className="text-slate-800">{dailySpin.totalSpinsDone}</strong> বার
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      resetDailySpinForTest();
                      setToastMsg("টেস্ট মোড: আপনার ৩টি স্পিন সফলভাবে রিলোড করা হয়েছে!");
                      setTimeout(() => setToastMsg(null), 3000);
                    }}
                    className="text-[11px] font-bold text-[#1e5eb3] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>টেস্ট স্পিন রিলোড</span>
                  </button>
                </div>
              </div>

            </div>

            {/* VIP Package Extra Spin Perks Banner */}
            <div className="bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] rounded-2xl p-4 text-white shadow-md flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>ভিআইপি প্যাকেজ বেনিফিট</span>
                </div>
                <h4 className="text-sm font-black text-white">দৈনিক অতিরিক্ত স্পিন আনলক করুন</h4>
                <p className="text-[11px] text-sky-100/90 leading-tight">
                  প্যাকেজ মেম্বাররা প্রতিদিন ৩টি পর্যন্ত ফ্রি স্পিন ও দ্বিগুণ রিওয়ার্ড বোনাস পান।
                </p>
              </div>
              <Link
                href="/packages"
                className="shrink-0 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow transition-colors flex items-center gap-1"
              >
                <span>আপগ্রেড</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Live Winners Feed Ticker */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <h3 className="font-bold text-xs text-slate-800">লাইভ বিজয়ী তালিকা (Live Winners)</h3>
                </div>
                <span className="text-[10px] text-slate-400">রিয়েল-টাইম</span>
              </div>

              <div className="space-y-2">
                {LIVE_WINNERS.slice(0, 3).map((w, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 hover:bg-sky-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#0b2654]/10 text-[#0b2654] flex items-center justify-center font-bold text-xs">
                        {w.name.charAt(0)}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block leading-tight">{w.name}</span>
                        <span className="text-[10px] text-slate-400">{w.phone} • {w.time}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black font-inter text-emerald-600 block">{w.prize}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                        {w.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: HISTORY & WINNERS */}
        {activeTab === "history" && (
          <div className="px-4 py-4 space-y-4">
            {/* My Spin History */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>আমার সাম্প্রতিক স্পিন হিস্ট্রি</span>
                </h3>
                <span className="text-[10px] font-bold text-slate-500">মোট: {dailySpin.history.length} টি</span>
              </div>

              {dailySpin.history.length === 0 ? (
                <div className="text-center py-6 text-slate-400 space-y-2">
                  <RotateCcw className="w-8 h-8 mx-auto opacity-40 animate-spin" style={{ animationDuration: "12s" }} />
                  <p className="text-xs">আপনি এখনও কোনো স্পিন করেননি। এখনই চাকা ঘুরান!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dailySpin.history.map((h) => (
                    <div
                      key={h.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-black text-xs shadow-sm">
                          ৳
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">লাকি স্পিন রিওয়ার্ড</span>
                          <span className="text-[10px] text-slate-400">{h.timestamp}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black font-inter text-emerald-700 block">+৳{h.reward}</span>
                        <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">
                          ব্যালেন্সে যোগ হয়েছে
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Platform Winners Ticker */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-sky-600" />
                  <span>প্ল্যাটফর্মের শীর্ষ উইনার তালিকা</span>
                </h3>
                <span className="text-[10px] text-emerald-600 font-bold">আজকে</span>
              </div>

              <div className="space-y-2">
                {LIVE_WINNERS.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">
                    এখনও কোনো শীর্ষ উইনার তালিকা তৈরি হয়নি। চাকা ঘুরিয়ে আপনিই হোন প্রথম বিজয়ী!
                  </div>
                ) : (
                  LIVE_WINNERS.map((w, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0b2654] to-[#0284c7] text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-800 block">{w.name}</span>
                          <span className="text-[10px] text-slate-400">{w.phone} • {w.time}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black font-inter text-emerald-600">{w.prize}</span>
                        <span className="block text-[9px] text-amber-700 font-semibold">{w.badge}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RULES & FAQ */}
        {activeTab === "rules" && (
          <div className="px-4 py-4 space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200/80 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm text-slate-800">লাকি স্পিনের নিয়ম ও শর্তাবলী</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-800">১. দৈনিক ফ্রি স্পিন:</strong> প্রতিটি রেজিস্টার্ড ব্যবহারকারী প্রতিদিন অন্তত ১টি সম্পূর্ণ ফ্রি স্পিন সুযোগ পাবেন।
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-800">২. প্রিমিয়াম মেম্বারশিপ সুবিধা:</strong> সিলভার, গোল্ড বা প্ল্যাটিনাম প্যাকেজ থাকলে অতিরিক্ত স্পিন স্বয়ংক্রিয়ভাবে আনলক হয়।
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-800">৩. সরাসরি ওয়ালেট ক্রেডিট:</strong> স্পিনে জেতা অর্থ সাথে সাথে আপনার মূল অ্যাকাউন্টের ব্যালেন্সে যোগ হয়ে যায়। কোনো অতিরিক্ত চার্জ নেই।
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-800">৪. ফেয়ার প্লে পলিসি:</strong> চাকার প্রতিটি পুরস্কার র‍্যান্ডম সিড অ্যালগরিদমে সম্পূর্ণ নিরপেক্ষভাবে নির্ধারিত হয়।
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    <strong className="text-slate-800">৫. রিনিউয়াল সময়:</strong> প্রতিদিন বাংলাদেশ সময় রাত ১২:০০ টায় স্পিন কোটা স্বয়ংক্রিয়ভাবে রিসেট হয়।
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("wheel")}
                  className="px-6 py-2.5 rounded-xl bg-[#0b2654] text-white font-bold text-xs shadow hover:bg-[#1e5eb3] transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>এখনই স্পিন করতে যান</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* VICTORY CELEBRATION MODAL */}
      {showWinModal && winningSlice && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl text-center relative overflow-hidden animate-in zoom-in-95 duration-300 border-2 border-amber-400">
            
            {/* Golden Ribbon Glow in Background */}
            <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-amber-300/30 to-transparent pointer-events-none" />

            {/* Trophy Icon */}
            <div className="relative z-10 w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 p-1 shadow-lg flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center shadow-inner">
                <Trophy className="w-10 h-10 text-amber-500 animate-bounce" />
              </div>
            </div>

            {/* Congratulations Text */}
            <div className="relative z-10 space-y-1">
              <span className="text-xs font-extrabold uppercase tracking-wider text-amber-600 block">
                🎉 অভিনন্দন {profile.name}! 🎉
              </span>
              <h3 className="text-xl font-black text-slate-900">
                আপনি জিতে নিয়েছেন!
              </h3>
            </div>

            {/* Winning Amount Badge */}
            <div className="relative z-10 py-3 px-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 rounded-2xl border border-amber-200 shadow-sm">
              <span className="text-4xl font-black font-inter text-[#0b2654] block tracking-tight drop-shadow-sm">
                ৳ {winningSlice.amount}
              </span>
              <span className="text-[11px] font-bold text-emerald-600 block mt-1">
                ✓ সরাসরি ওয়ালেটে যুক্ত হয়েছে
              </span>
            </div>

            {/* Updated Balance Pill */}
            <div className="text-xs text-slate-500 bg-slate-50 py-2 px-3 rounded-xl border border-slate-100 flex items-center justify-between">
              <span>বর্তমান ওয়ালেট ব্যালেন্স:</span>
              <strong className="text-slate-800 font-inter font-bold">৳ {profile.balance.toFixed(2)}</strong>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowWinModal(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white font-black text-sm shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                দারুণ! ধন্যবাদ
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Digonto 7-Tab Bottom Navigation Bar */}
      <BottomNav />
    </div>
  );
}
