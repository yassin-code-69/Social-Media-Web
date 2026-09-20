"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users,
  Gift,
  Crown,
  TrendingUp,
  Coins,
  ChevronRight,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Smartphone,
  Award,
  Wallet,
  Check,
  UserCheck,
  Info,
  DollarSign,
  Share2,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";

export default function MonthlySalaryPage() {
  const router = useRouter();
  const { profile, referrals, adjustUserWallet } = useMockStore();

  // Simulated Team Referral Progress
  const [totalPremiumReferrals, setTotalPremiumReferrals] = useState(115);
  const [gen1Count, setGen1Count] = useState(105);
  const [gen2Count, setGen2Count] = useState(52);
  const [gen3Count, setGen3Count] = useState(24);

  // Claim Modals State
  const [selectedPlan, setSelectedPlan] = useState<{
    target: number;
    salary: number;
    color: string;
    isEligible: boolean;
  } | null>(null);

  const [isIncentiveModalOpen, setIsIncentiveModalOpen] = useState(false);
  const [claimSuccessMsg, setClaimSuccessMsg] = useState<string | null>(null);
  const [claimErrorMsg, setClaimErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3 Monthly Salary Plans matching the screenshot
  const salaryPlans = [
    {
      id: "plan_100",
      target: 100,
      salary: 500,
      borderColor: "border-[#86efac]",
      iconColor: "text-[#059669]",
      numColor: "text-[#047857]",
      bannerBg: "bg-[#047857]",
      subColor: "text-emerald-100",
      type: "green",
    },
    {
      id: "plan_200",
      target: 200,
      salary: 1500,
      borderColor: "border-[#93c5fd]",
      iconColor: "text-[#2563eb]",
      numColor: "text-[#1d4ed8]",
      bannerBg: "bg-[#1d4ed8]",
      subColor: "text-blue-100",
      type: "blue",
    },
    {
      id: "plan_500",
      target: 500,
      salary: 20000,
      borderColor: "border-[#d8b4fe]",
      iconColor: "text-[#9333ea]",
      numColor: "text-[#7e22ce]",
      bannerBg: "bg-[#6b21a8]",
      subColor: "text-purple-100",
      type: "purple",
    },
  ];

  // Claim monthly salary handler
  const handleClaimSalary = (plan: (typeof salaryPlans)[0]) => {
    const isEligible = totalPremiumReferrals >= plan.target;
    setSelectedPlan({
      target: plan.target,
      salary: plan.salary,
      color: plan.type,
      isEligible,
    });
    setClaimSuccessMsg(null);
    setClaimErrorMsg(null);
  };

  const handleConfirmClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    if (!selectedPlan.isEligible) {
      setClaimErrorMsg(
        `আপনার টিমে এখনো ${selectedPlan.target} জন প্রিমিয়াম মেম্বার পূর্ণ হয়নি! বর্তমান সংখ্যা: ${totalPremiumReferrals} জন।`
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      adjustUserWallet(selectedPlan.salary, "CREDIT", `মাসিক স্যালারি: ${selectedPlan.target} জন মেম্বার রেফার`);
      setClaimSuccessMsg(
        `অভিনন্দন! আপনার মাসিক স্যালারি ৳${selectedPlan.salary.toLocaleString()} সফলভাবে ওয়ালেটে যুক্ত হয়েছে!`
      );
      setIsSubmitting(false);

      setTimeout(() => {
        setSelectedPlan(null);
        setClaimSuccessMsg(null);
      }, 1800);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#dff0f8] flex justify-center selection:bg-sky-500 selection:text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-lg bg-[#eaf5fa] min-h-screen shadow-2xl flex flex-col relative pb-24 border-x border-slate-200/60 font-sans">
        {/* Top App Header */}
        <Header />

        {/* Main Body Content */}
        <div className="px-3 pt-3 pb-6 space-y-3.5">
          {/* ========================================================
              SECTION 1: HERO BANNER (আপনার টিম বড় করুন)
              ======================================================== */}
          <div className="bg-gradient-to-r from-[#dff2fd] via-[#eef8fe] to-[#d2edfd] rounded-3xl p-3.5 sm:p-4 shadow-sm border border-sky-300/90 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -left-12 w-44 h-44 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2 relative z-10">
              {/* Left Side: 3D Blue Money Bag with Coins & Plant */}
              <div className="w-18 h-20 sm:w-22 sm:h-24 flex-shrink-0 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
                  {/* Upward Growth Arrow in Background */}
                  <path
                    d="M32 75 L52 50 L64 58 L85 28"
                    stroke="#10b981"
                    strokeWidth="5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <polygon points="88,24 76,28 85,37" fill="#10b981" />

                  {/* Green Plant Leaves behind bag */}
                  <path d="M22 60 C14 50 16 35 26 36 C28 46 25 56 22 60 Z" fill="#22c55e" />
                  <path d="M25 52 C20 44 24 32 32 35 C33 42 29 48 25 52 Z" fill="#4ade80" />

                  {/* 3D Money Bag Body (Royal Blue) */}
                  {/* Top tied ruffles */}
                  <path
                    d="M40 28 C36 20 42 16 48 18 C50 14 56 14 58 18 C64 16 70 20 66 28 Z"
                    fill="#1d4ed8"
                  />
                  {/* Golden rope tie */}
                  <ellipse cx="53" cy="29" rx="14" ry="3.5" fill="#f59e0b" />

                  {/* Main Sack */}
                  <path
                    d="M35 30 C20 40 22 75 35 84 C45 90 61 90 71 84 C84 75 86 40 71 30 Z"
                    fill="url(#blueBagGrad)"
                  />

                  {/* Bengali Taka Symbol '৳' on sack */}
                  <text
                    x="53"
                    y="63"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="22"
                    fontWeight="bold"
                    fontFamily="sans-serif"
                  >
                    ৳
                  </text>

                  {/* Stack of Gold Coins on Left & Front */}
                  <g transform="translate(18, 58)">
                    {/* Coin 1 */}
                    <ellipse cx="14" cy="22" rx="11" ry="4.5" fill="#f59e0b" />
                    <rect x="3" y="16" width="22" height="6" fill="#d97706" />
                    <ellipse cx="14" cy="16" rx="11" ry="4.5" fill="#fbbf24" />
                    {/* Coin 2 */}
                    <ellipse cx="14" cy="11" rx="11" ry="4.5" fill="#f59e0b" />
                    <rect x="3" y="5" width="22" height="6" fill="#d97706" />
                    <ellipse cx="14" cy="5" rx="11" ry="4.5" fill="#fde047" />
                    <text x="14" y="7" textAnchor="middle" fill="#92400e" fontSize="5" fontWeight="bold">৳</text>
                  </g>

                  {/* Stack of Gold Coins on Right */}
                  <g transform="translate(56, 52)">
                    <ellipse cx="14" cy="26" rx="12" ry="5" fill="#f59e0b" />
                    <rect x="2" y="20" width="24" height="6" fill="#d97706" />
                    <ellipse cx="14" cy="20" rx="12" ry="5" fill="#fbbf24" />
                    <ellipse cx="14" cy="14" rx="12" ry="5" fill="#f59e0b" />
                    <rect x="2" y="8" width="24" height="6" fill="#d97706" />
                    <ellipse cx="14" cy="8" rx="12" ry="5" fill="#fde047" />
                    <text x="14" y="10" textAnchor="middle" fill="#92400e" fontSize="5.5" fontWeight="bold">৳</text>
                  </g>

                  <defs>
                    <linearGradient id="blueBagGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="50%" stopColor="#1d4ed8" />
                      <stop offset="100%" stopColor="#1e3a8a" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Middle Title & Description */}
              <div className="min-w-0 flex-1 px-1">
                <h1 className="text-xl sm:text-[23px] font-extrabold text-[#0b2654] leading-tight font-bengali">
                  আপনার টিম বড় করুন
                </h1>

                {/* Slogan Pill */}
                <div className="my-1">
                  <span className="bg-[#fde047] text-[#854d0e] font-extrabold text-[11px] sm:text-xs px-3 py-0.5 rounded-full shadow-2xs font-bengali inline-block">
                    মাসে মাসে পান আকর্ষণীয় স্যালারি
                  </span>
                </div>

                <p className="text-[10.5px] sm:text-[11.5px] text-slate-700 font-bengali leading-snug">
                  প্রিমিয়াম মেম্বার রেফার করুন এবং নিয়মিত পেয়ে যান মাসিক স্যালারি
                </p>
              </div>

              {/* Right Side: Brush Splash / Stamp Badge (বড় টিম বড় আয়) */}
              <div className="flex-shrink-0 w-20 sm:w-24 relative flex items-center justify-center">
                <div className="bg-gradient-to-br from-[#1d4ed8] via-[#1e40af] to-[#0b2654] text-white p-2.5 rounded-2xl shadow-md border-2 border-sky-300 text-center w-full relative overflow-hidden -rotate-2 hover:rotate-0 transition-transform">
                  {/* Ambient starburst glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                  {/* Golden Crown on top */}
                  <div className="flex justify-center mb-0.5">
                    <Crown className="w-4 h-4 text-amber-400 fill-amber-400" />
                  </div>

                  {/* White text: বড় টিম */}
                  <div className="text-xs sm:text-sm font-extrabold text-white leading-tight font-bengali">
                    বড় টিম
                  </div>

                  {/* Yellow text: বড় আয় */}
                  <div className="text-xs sm:text-sm font-black text-[#fde047] leading-tight font-bengali mt-0.5">
                    বড় আয়
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 2: MONTHLY SALARY PLAN (3 CARDS GRID)
              ======================================================== */}
          <div className="space-y-2.5">
            {/* Section Header */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                  Monthly Salary Plan
                </h2>
                <p className="text-[10px] sm:text-[11px] text-slate-500 font-bengali">
                  প্রিমিয়াম মেম্বার রেফার অনুযায়ী মাসিক স্যালারি
                </p>
              </div>
            </div>

            {/* 3 Salary Cards Grid */}
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {salaryPlans.map((plan) => {
                const isEligible = totalPremiumReferrals >= plan.target;

                return (
                  <div
                    key={plan.id}
                    onClick={() => handleClaimSalary(plan)}
                    className={`bg-white rounded-2xl border-2 ${plan.borderColor} shadow-xs flex flex-col justify-between overflow-hidden text-center cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all group relative`}
                  >
                    {/* Top Body */}
                    <div className="p-2 sm:p-2.5 space-y-1">
                      {/* Group of 3 People Icon */}
                      <div className="flex justify-center pt-0.5">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${plan.iconColor} bg-slate-50 group-hover:scale-110 transition-transform`}>
                          <Users className="w-5 h-5 stroke-[2.5]" />
                        </div>
                      </div>

                      {/* Number Target */}
                      <div className={`text-base sm:text-lg font-black ${plan.numColor} font-bengali leading-tight`}>
                        {plan.target} জন
                      </div>

                      {/* Label */}
                      <div className="text-[9px] sm:text-[10px] text-slate-600 font-bengali leading-tight">
                        প্রিমিয়াম মেম্বার রেফার
                      </div>
                    </div>

                    {/* Bottom Colored Banner */}
                    <div className={`${plan.bannerBg} text-white p-2 rounded-b-xl space-y-0.5 shadow-inner`}>
                      <div className={`text-[8.5px] sm:text-[9px] ${plan.subColor} font-bengali`}>
                        প্রতি মাসে স্যালারি
                      </div>
                      <div className="text-xs sm:text-sm font-black font-bengali leading-tight flex items-center justify-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                        <span>৳ {plan.salary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              SECTION 3: INCENTIVE BONUS (বিশেষ প্রণোদনা - iPHONE)
              ======================================================== */}
          <div className="bg-gradient-to-b from-[#0a1a3a] via-[#0b2654] to-[#071530] rounded-3xl p-3.5 sm:p-4 text-white border border-blue-500/30 shadow-xl relative overflow-hidden space-y-3.5">
            {/* Top Header Row */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              {/* Left Title */}
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#eab308] text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Gift className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#fde047] leading-tight">
                    Incentive Bonus
                  </h3>
                  <div className="text-[11px] font-semibold text-sky-200 font-bengali">
                    বিশেষ প্রণোদনা
                  </div>
                </div>
              </div>

              {/* Right Notice Pill */}
              <div className="bg-white/10 border border-white/15 rounded-2xl px-2.5 py-1.5 text-[9.5px] sm:text-[10px] text-slate-200 font-bengali leading-tight max-w-[210px]">
                আপনার টিমের নির্দিষ্ট জেনারেশনে প্রিমিয়াম মেম্বার রেফার করলেই পেয়ে যাবেন{" "}
                <span className="text-[#fde047] font-black underline">
                  একটি iPhone গিফট!
                </span>
              </div>
            </div>

            {/* Workflow & Reward Showcase */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2 pt-1">
              {/* Left Side: 3 Generation Cards with Carets */}
              <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                {/* 1st Generation */}
                <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-sm flex flex-col text-center border border-emerald-300">
                  <div className="bg-[#0f766e] text-white text-[8px] sm:text-[9px] font-bold py-1 px-1">
                    1st Gen
                  </div>
                  <div className="p-1 sm:p-1.5 space-y-0.5">
                    <div className="flex justify-center text-emerald-600">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 font-bengali">
                      100 জন
                    </div>
                    <div className="bg-[#059669] text-white text-[7.5px] sm:text-[8px] font-bold py-0.5 px-1 rounded-md">
                      প্রিমিয়াম
                    </div>
                  </div>
                </div>

                {/* Arrow 1 */}
                <span className="text-white/60 font-black text-xs sm:text-sm">→</span>

                {/* 2nd Generation */}
                <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-sm flex flex-col text-center border border-blue-300">
                  <div className="bg-[#2563eb] text-white text-[8px] sm:text-[9px] font-bold py-1 px-1">
                    2nd Gen
                  </div>
                  <div className="p-1 sm:p-1.5 space-y-0.5">
                    <div className="flex justify-center text-blue-600">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 font-bengali">
                      50 জন
                    </div>
                    <div className="bg-[#2563eb] text-white text-[7.5px] sm:text-[8px] font-bold py-0.5 px-1 rounded-md">
                      প্রিমিয়াম
                    </div>
                  </div>
                </div>

                {/* Arrow 2 */}
                <span className="text-white/60 font-black text-xs sm:text-sm">→</span>

                {/* 3rd Generation */}
                <div className="flex-1 bg-white rounded-xl overflow-hidden shadow-sm flex flex-col text-center border border-purple-300">
                  <div className="bg-[#9333ea] text-white text-[8px] sm:text-[9px] font-bold py-1 px-1">
                    3rd Gen
                  </div>
                  <div className="p-1 sm:p-1.5 space-y-0.5">
                    <div className="flex justify-center text-purple-600">
                      <Users className="w-3.5 h-3.5" />
                    </div>
                    <div className="text-xs sm:text-sm font-black text-slate-900 font-bengali">
                      20 জন
                    </div>
                    <div className="bg-[#9333ea] text-white text-[7.5px] sm:text-[8px] font-bold py-0.5 px-1 rounded-md">
                      প্রিমিয়াম
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: iPhone on Golden Pedestal with Ribbon & Starburst Gift Badge */}
              <div className="w-24 sm:w-28 flex-shrink-0 relative flex items-center justify-center pl-1">
                <svg viewBox="0 0 110 110" className="w-full h-full overflow-visible drop-shadow-lg">
                  {/* Golden circular glow */}
                  <circle cx="55" cy="55" r="45" fill="#f59e0b" opacity="0.15" />

                  {/* Golden Pedestal / Podium */}
                  <ellipse cx="55" cy="94" rx="42" ry="10" fill="#d97706" />
                  <ellipse cx="55" cy="90" rx="40" ry="9" fill="#fbbf24" />
                  <ellipse cx="55" cy="88" rx="36" ry="7" fill="#fef08a" />

                  {/* Sparkles around phone */}
                  <text x="12" y="38" fontSize="10" fill="#fde047">✦</text>
                  <text x="24" y="20" fontSize="8" fill="#fde047">★</text>
                  <text x="86" y="24" fontSize="10" fill="#fde047">✦</text>

                  {/* iPhone Body */}
                  {/* Outer edge */}
                  <rect x="34" y="16" width="38" height="70" rx="8" fill="#0f172a" stroke="#64748b" strokeWidth="1.5" />
                  {/* Inner Screen */}
                  <rect x="36" y="18" width="34" height="66" rx="6" fill="#1e293b" />
                  {/* Screen wallpaper gradient (Cosmic/Purple & Sky) */}
                  <path d="M36 40 C45 35 55 50 70 45 L70 84 L36 84 Z" fill="#6366f1" opacity="0.6" />
                  <path d="M36 60 C50 50 58 70 70 65 L70 84 L36 84 Z" fill="#ec4899" opacity="0.5" />

                  {/* Dynamic Island / Notch */}
                  <rect x="47" y="20" width="12" height="3" rx="1.5" fill="#000000" />

                  {/* Golden Ribbon Bow wrapped around iPhone */}
                  <rect x="34" y="52" width="38" height="6" fill="#f59e0b" />
                  <polygon points="50,55 42,46 48,46" fill="#fbbf24" />
                  <polygon points="56,55 64,46 58,46" fill="#fbbf24" />
                  <circle cx="53" cy="55" r="3" fill="#d97706" />

                  {/* Golden Scalloped Starburst Badge (iPhone গিফট 🎁) */}
                  <g transform="translate(62, 54)">
                    <circle cx="20" cy="20" r="18" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
                    {/* Crown on badge */}
                    <path d="M16 10 L18 13 L20 10 L22 13 L24 10 L24 14 L16 14 Z" fill="#78350f" />
                    <text x="20" y="21" textAnchor="middle" fill="#78350f" fontSize="7" fontWeight="900" fontFamily="sans-serif">
                      iPhone
                    </text>
                    <text x="20" y="28" textAnchor="middle" fill="#78350f" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
                      গিফট
                    </text>
                    <text x="20" y="34" textAnchor="middle" fontSize="6">🎁</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Bottom Golden Incentive CTA Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setIsIncentiveModalOpen(true)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#eab308] text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4 stroke-[2.5]" />
                <span>ইনসেনটিভ বোনাস →</span>
              </button>

              <div className="text-center text-[10px] sm:text-[11px] text-sky-200 font-bengali tracking-wide mt-2">
                — আপনার টিমের পারফরম্যান্স বাড়ান, জিতুন iPhone! —
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            MODAL 1: MONTHLY SALARY CLAIM MODAL
            ======================================================== */}
        {selectedPlan && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setSelectedPlan(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      মাসিক স্যালারি ক্লেইম (৳{selectedPlan.salary.toLocaleString()})
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      টার্গেট: {selectedPlan.target} জন প্রিমিয়াম মেম্বার রেফার
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Alert */}
              {claimSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{claimSuccessMsg}</span>
                </div>
              )}

              {claimErrorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <span>{claimErrorMsg}</span>
                </div>
              )}

              {/* Referral Progress Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">আপনার বর্তমান প্রিমিয়াম টিম:</span>
                  <span className="font-bold text-slate-900">{totalPremiumReferrals} জন</span>
                </div>

                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (totalPremiumReferrals / selectedPlan.target) * 100)}%`,
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span>০ জন</span>
                  <span>টার্গেট: {selectedPlan.target} জন</span>
                </div>
              </div>

              {/* Claim Action */}
              <form onSubmit={handleConfirmClaim} className="space-y-3">
                <div className="text-[11px] text-slate-600 leading-relaxed font-bengali bg-sky-50 p-3 rounded-xl border border-sky-100">
                  ℹ️ স্যালারি ক্লেইম বাটনে ক্লিক করলে নির্ধারিত ৳{selectedPlan.salary.toLocaleString()} টাকা সরাসরি আপনার দিগন্ত মেইন ওয়ালেটে যোগ হয়ে যাবে।
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedPlan.isEligible}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                    selectedPlan.isEligible
                      ? "bg-gradient-to-r from-[#0b2654] via-[#1e5eb3] to-[#0284c7] text-white hover:shadow-lg active:scale-95"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <DollarSign className="w-4 h-4 text-amber-400" />
                  <span>
                    {isSubmitting
                      ? "স্যালারি যুক্ত হচ্ছে..."
                      : selectedPlan.isEligible
                      ? `মাসিক স্যালারি সংগ্রহ করুন (৳${selectedPlan.salary.toLocaleString()})`
                      : `টার্গেট বাকি রয়েছে (${selectedPlan.target - totalPremiumReferrals} জন)`}
                  </span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 2: INCENTIVE BONUS DETAILS MODAL (iPHONE)
            ======================================================== */}
        {isIncentiveModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setIsIncentiveModalOpen(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                    <Gift className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      ইনসেনটিভ বোনাস: iPhone গিফট
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      ৩ জেনারেশন টার্গেট পূরণ করলেই মেগা গিফট
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsIncentiveModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Criteria Progress */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-900">
                  আপনার বর্তমান জেনারেশন প্রগ্রেস:
                </h4>

                {/* Gen 1 */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-900">১ম জেনারেশন (1st Gen):</span>
                    <span className="font-bold text-emerald-700">{gen1Count} / ১০০ জন</span>
                  </div>
                  <div className="w-full bg-emerald-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, (gen1Count / 100) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Gen 2 */}
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-blue-900">২য় জেনারেশন (2nd Gen):</span>
                    <span className="font-bold text-blue-700">{gen2Count} / ৫০ জন</span>
                  </div>
                  <div className="w-full bg-blue-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, (gen2Count / 50) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Gen 3 */}
                <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-900">৩য় জেনারেশন (3rd Gen):</span>
                    <span className="font-bold text-purple-700">{gen3Count} / ২০ জন</span>
                  </div>
                  <div className="w-full bg-purple-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full"
                      style={{ width: `${Math.min(100, (gen3Count / 20) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Submission Notice */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 text-[11px] text-amber-900 leading-relaxed font-bengali space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>গিফট গ্রহণের নিয়মাবলী:</span>
                </div>
                <p>
                  ৩টি জেনারেশনের টার্গেট একযোগে সম্পন্ন হলে আপনি অফিসিয়াল দিগন্ত কাস্টমার সার্ভিসের মাধ্যমে সরাসরি ব্র‍্যান্ড নিউ iPhone হ্যান্ডওভার বা সমমূল্যের ক্যাশ গ্রহণ করতে পারবেন।
                </p>
              </div>

              {/* Action */}
              <button
                type="button"
                onClick={() => router.push("/referral")}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0b2654] via-[#1e5eb3] to-[#0284c7] text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4 text-amber-400" />
                <span>রেফারেল লিংক শেয়ার করে টিম বাড়ান</span>
              </button>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
