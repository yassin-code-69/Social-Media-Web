"use client";

import React, { useState, useEffect } from "react";
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
  Banknote,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import { salaryApi } from "@/lib/api-client";

export default function MonthlySalaryPage() {
  const router = useRouter();
  const { profile, adjustUserWallet } = useMockStore();

  // Real Team Referral Progress from backend
  const [totalPremiumReferrals, setTotalPremiumReferrals] = useState(0);
  const [gen1Count, setGen1Count] = useState(0);
  const [gen2Count, setGen2Count] = useState(0);
  const [gen3Count, setGen3Count] = useState(0);
  const [hasClaimedSalary, setHasClaimedSalary] = useState(false);

  // Incentive delivery form
  const [recipientName, setRecipientName] = useState("");
  const [deliveryPhone, setDeliveryPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");

  useEffect(() => {
    salaryApi
      .getStatus()
      .then((res) => {
        if (res?.teamStats) {
          setGen1Count(res.teamStats.gen1Count || 0);
          setGen2Count(res.teamStats.gen2Count || 0);
          setGen3Count(res.teamStats.gen3Count || 0);
          setTotalPremiumReferrals(res.teamStats.gen1Count || 0);
        }
        if (res?.currentMonthClaim) {
          setHasClaimedSalary(true);
        }
      })
      .catch(() => {});
  }, []);

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
      rewardIconType: "cash",
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
      rewardIconType: "coins",
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
      rewardIconType: "coins",
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

  const handleConfirmClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    if (!selectedPlan.isEligible) {
      setClaimErrorMsg(
        `আপনার টিমে এখনো ${selectedPlan.target} জন প্রিমিয়াম মেম্বার পূর্ণ হয়নি! বর্তমান সংখ্যা: ${totalPremiumReferrals} জন।`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await salaryApi.claim();
      setClaimSuccessMsg(res?.message || `অভিনন্দন! আপনার মাসিক স্যালারি ক্লেইম সফলভাবে জমা হয়েছে!`);
      setHasClaimedSalary(true);
      setTimeout(() => {
        setSelectedPlan(null);
        setClaimSuccessMsg(null);
      }, 2500);
    } catch (err: any) {
      setClaimErrorMsg(err.message || "ক্লেইম করতে সমস্যা হয়েছে");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dff0f8] flex justify-center selection:bg-sky-500 selection:text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-lg bg-[#eaf5fa] min-h-screen shadow-2xl flex flex-col relative pb-24 border-x border-slate-200/60 font-sans">
        {/* Top App Header */}
        <Header />

        {/* Main Body Content */}
        <div className="px-3.5 pt-3 pb-6 space-y-3.5">
          {/* ========================================================
              SECTION 1: HERO BANNER (আপনার টিম বড় করুন)
              ======================================================== */}
          <div className="bg-gradient-to-r from-[#dff2fd] via-[#eef8fe] to-[#d2edfd] rounded-3xl p-3 sm:p-3.5 shadow-sm border border-sky-300/90 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -left-12 w-44 h-44 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between gap-1.5 sm:gap-2 relative z-10">
              {/* Left Side: 3D Blue Money Bag with Coins & Plant */}
              <div className="w-[74px] h-[78px] sm:w-[84px] sm:h-[86px] flex-shrink-0 relative flex items-center justify-center">
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
                    <ellipse cx="14" cy="22" rx="11" ry="4.5" fill="#f59e0b" />
                    <rect x="3" y="16" width="22" height="6" fill="#d97706" />
                    <ellipse cx="14" cy="16" rx="11" ry="4.5" fill="#fbbf24" />
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
              <div className="min-w-0 flex-1 px-0.5">
                <h1 className="text-[17px] sm:text-[20px] font-extrabold text-[#0b2654] leading-tight font-bengali whitespace-nowrap">
                  আপনার টিম বড় করুন
                </h1>

                {/* Slogan Pill */}
                <div className="my-1">
                  <span className="bg-[#fde047] text-[#854d0e] font-extrabold text-[10.5px] sm:text-[11.5px] px-2.5 py-0.5 rounded-full shadow-2xs font-bengali inline-block">
                    মাসে মাসে পান আকর্ষণীয় স্যালারি
                  </span>
                </div>

                <p className="text-[10px] sm:text-[10.5px] text-slate-700 font-bengali leading-snug">
                  প্রিমিয়াম মেম্বার রেফার করুন এবং নিয়মিত পেয়ে যান মাসিক স্যালারি
                </p>
              </div>

              {/* Right Side: Textured Royal Blue Brush Stamp Badge (বড় টিম বড় আয়) */}
              <div className="flex-shrink-0 w-[74px] sm:w-[82px] relative flex items-center justify-center">
                <div className="bg-gradient-to-b from-[#1b52bc] via-[#16439c] to-[#0c2b66] text-white p-2 rounded-2xl shadow-md border-2 border-sky-300 text-center w-full relative overflow-hidden -rotate-1 hover:rotate-0 transition-transform">
                  {/* Ambient starburst glow */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />

                  {/* Golden Crown on top */}
                  <div className="flex justify-center mb-0.5">
                    <Crown className="w-4 h-4 text-amber-300 fill-amber-300" />
                  </div>

                  {/* White text: বড় টিম */}
                  <div className="text-[11px] sm:text-xs font-black text-white leading-tight font-bengali">
                    বড় টিম
                  </div>

                  {/* Yellow text: বড় আয় */}
                  <div className="text-[11px] sm:text-xs font-black text-[#fde047] leading-tight font-bengali mt-0.5">
                    বড় আয়
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 2: MONTHLY SALARY PLAN (3 CARDS GRID)
              ======================================================== */}
          <div className="space-y-2">
            {/* Section Header */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
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
              {salaryPlans.map((plan) => (
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
                      {plan.rewardIconType === "cash" ? (
                        <div className="w-3.5 h-3.5 flex items-center justify-center">
                          <Banknote className="w-3.5 h-3.5 text-emerald-200" />
                        </div>
                      ) : (
                        <Coins className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      )}
                      <span>৳ {plan.salary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              SECTION 3: INCENTIVE BONUS (বিশেষ প্রণোদনা - iPHONE)
              ======================================================== */}
          <div className="bg-gradient-to-b from-[#0a1a3a] via-[#0b2654] to-[#071530] rounded-3xl p-3 sm:p-3.5 text-white border border-blue-500/30 shadow-xl relative overflow-hidden space-y-3">
            {/* Top Header Row */}
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              {/* Left Title */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#eab308] text-slate-950 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Gift className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#fde047] leading-tight">
                    Incentive Bonus
                  </h3>
                  <div className="text-[10px] sm:text-[11px] font-semibold text-sky-200 font-bengali">
                    বিশেষ প্রণোদনা
                  </div>
                </div>
              </div>

              {/* Right Notice Pill */}
              <div className="bg-[#122e60]/90 border border-blue-400/30 rounded-2xl px-2.5 py-1 text-[9px] sm:text-[9.5px] text-slate-200 font-bengali leading-tight max-w-[210px] text-center">
                আপনার টিমের নির্দিষ্ট জেনারেশনে প্রিমিয়াম মেম্বার রেফার করলেই পেয়ে যাবেন{" "}
                <span className="text-[#fde047] font-black underline">
                  একটি iPhone গিফট!
                </span>
              </div>
            </div>

            {/* Workflow & Reward Showcase */}
            <div className="flex items-center justify-between gap-1 sm:gap-1.5 pt-0.5">
              {/* Left Side: 3 Generation Cards with Carets */}
              <div className="w-[63%] sm:w-[65%] shrink-0 flex items-center justify-between gap-0.5 sm:gap-1">
                {/* 1st Generation */}
                <div className="flex-1 min-w-0 bg-white rounded-xl overflow-hidden shadow-sm flex flex-col text-center border border-emerald-300">
                  <div className="bg-[#059669] text-white text-[7px] sm:text-[7.5px] font-bold py-1 px-0.5 whitespace-nowrap tracking-tight leading-none">
                    1st Generation
                  </div>
                  <div className="p-1 space-y-0.5">
                    <div className="flex justify-center text-emerald-600">
                      <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div className="text-[11px] sm:text-xs font-black text-slate-900 font-bengali leading-none py-0.5">
                      100 জন
                    </div>
                    <div className="bg-[#059669] text-white text-[6px] sm:text-[6.5px] font-bold py-0.5 px-0.5 rounded-full whitespace-nowrap tracking-tight leading-none inline-block">
                      প্রিমিয়াম মেম্বার
                    </div>
                  </div>
                </div>

                {/* Arrow 1 */}
                <span className="text-white/80 font-black text-xs shrink-0 px-0.5">→</span>

                {/* 2nd Generation */}
                <div className="flex-1 min-w-0 bg-white rounded-xl overflow-hidden shadow-sm flex flex-col text-center border border-blue-300">
                  <div className="bg-[#2563eb] text-white text-[7px] sm:text-[7.5px] font-bold py-1 px-0.5 whitespace-nowrap tracking-tight leading-none">
                    2nd Generation
                  </div>
                  <div className="p-1 space-y-0.5">
                    <div className="flex justify-center text-blue-600">
                      <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div className="text-[11px] sm:text-xs font-black text-slate-900 font-bengali leading-none py-0.5">
                      50 জন
                    </div>
                    <div className="bg-[#2563eb] text-white text-[6px] sm:text-[6.5px] font-bold py-0.5 px-0.5 rounded-full whitespace-nowrap tracking-tight leading-none inline-block">
                      প্রিমিয়াম মেম্বার
                    </div>
                  </div>
                </div>

                {/* Arrow 2 */}
                <span className="text-white/80 font-black text-xs shrink-0 px-0.5">→</span>

                {/* 3rd Generation */}
                <div className="flex-1 min-w-0 bg-white rounded-xl overflow-hidden shadow-sm flex flex-col text-center border border-purple-300">
                  <div className="bg-[#9333ea] text-white text-[7px] sm:text-[7.5px] font-bold py-1 px-0.5 whitespace-nowrap tracking-tight leading-none">
                    3rd Generation
                  </div>
                  <div className="p-1 space-y-0.5">
                    <div className="flex justify-center text-purple-600">
                      <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                    </div>
                    <div className="text-[11px] sm:text-xs font-black text-slate-900 font-bengali leading-none py-0.5">
                      20 জন
                    </div>
                    <div className="bg-[#9333ea] text-white text-[6px] sm:text-[6.5px] font-bold py-0.5 px-0.5 rounded-full whitespace-nowrap tracking-tight leading-none inline-block">
                      প্রিমিয়াম মেম্বার
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Realistic Dual iPhone on Golden Pedestal with Ribbon & Starburst Gift Badge */}
              <div className="w-[35%] sm:w-[33%] shrink-0 h-32 sm:h-34 relative flex items-center justify-center">
                <svg viewBox="0 0 115 115" className="w-full h-full max-h-34 overflow-visible drop-shadow-xl">
                  {/* Golden circular glow */}
                  <circle cx="55" cy="58" r="48" fill="#f59e0b" opacity="0.18" />

                  {/* Golden Pedestal / Podium */}
                  <ellipse cx="52" cy="102" rx="42" ry="10" fill="#b45309" />
                  <ellipse cx="52" cy="98" rx="40" ry="9" fill="#d97706" />
                  <ellipse cx="52" cy="94" rx="36" ry="7.5" fill="#fbbf24" />
                  <ellipse cx="52" cy="91" rx="32" ry="6.5" fill="#fef08a" />

                  {/* Confetti & Sparkles around phone */}
                  <text x="4" y="38" fontSize="10" fill="#fde047">✦</text>
                  <text x="14" y="20" fontSize="8" fill="#fde047">★</text>
                  <text x="88" y="22" fontSize="10" fill="#fde047">✦</text>
                  <text x="96" y="48" fontSize="7.5" fill="#fde047">★</text>
                  <circle cx="8" cy="58" r="1.5" fill="#fbbf24" />
                  <circle cx="94" cy="68" r="1.5" fill="#fbbf24" />

                  {/* Back Phone (Angled Titanium Grey / Dark Blue) */}
                  <g transform="translate(-2, 0) rotate(-6 42 46)">
                    <rect x="24" y="14" width="34" height="66" rx="7" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                    {/* Dual Camera Bump on Back Phone */}
                    <rect x="27" y="17" width="13" height="22" rx="3.5" fill="#1e293b" />
                    <circle cx="33.5" cy="23" r="3.2" fill="#0284c7" stroke="#334155" strokeWidth="1" />
                    <circle cx="33.5" cy="33.5" r="3.2" fill="#0284c7" stroke="#334155" strokeWidth="1" />
                  </g>

                  {/* Front Phone (Sleek Glass Display Facing User) */}
                  <g transform="translate(6, 4)">
                    {/* Phone Outer Chassis */}
                    <rect x="24" y="12" width="36" height="70" rx="7.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.6" />
                    {/* Inner OLED Screen */}
                    <rect x="26" y="14" width="32" height="66" rx="5.5" fill="#090d16" />

                    {/* Glossy Cosmic Screen Wallpaper */}
                    <path d="M26 34 C34 28 44 48 58 38 L58 80 L26 80 Z" fill="#6366f1" opacity="0.8" />
                    <path d="M26 50 C38 42 46 62 58 56 L58 80 L26 80 Z" fill="#ec4899" opacity="0.65" />
                    <circle cx="42" cy="48" r="10" fill="#38bdf8" opacity="0.4" />

                    {/* Dynamic Island / Notch */}
                    <rect x="36.5" y="16" width="11" height="2.8" rx="1.4" fill="#000000" stroke="#1e293b" strokeWidth="0.5" />

                    {/* Screen Glass Reflection */}
                    <path d="M26 14 L54 14 L36 64 L26 64 Z" fill="#ffffff" opacity="0.08" />

                    {/* Golden Satin Ribbon wrapped horizontally around Front Phone */}
                    <rect x="24" y="46" width="36" height="6.5" fill="#f59e0b" stroke="#fbbf24" strokeWidth="0.5" />
                    {/* Ribbon 3D Bow Knot */}
                    <polygon points="42,49 34,40 40,41" fill="#fde047" />
                    <polygon points="42,49 50,40 44,41" fill="#fde047" />
                    <circle cx="42" cy="49" r="3" fill="#d97706" />
                    <circle cx="42" cy="49" r="1.8" fill="#fbbf24" />
                  </g>

                  {/* Golden Scalloped Starburst Gift Badge (iPhone গিফট 🎁) in Front */}
                  <g transform="translate(62, 50)">
                    {/* Golden Starburst Shadow */}
                    <circle cx="21" cy="21" r="19" fill="#b45309" opacity="0.4" />
                    {/* Main Starburst Yellow Disc */}
                    <circle cx="20" cy="20" r="18" fill="#fbbf24" stroke="#d97706" strokeWidth="1.8" />
                    <circle cx="20" cy="20" r="15" fill="none" stroke="#fef08a" strokeWidth="1" strokeDasharray="2.5 1.2" />

                    {/* Crown on top of badge */}
                    <path d="M14 10 L17 13 L20 9.5 L23 13 L26 10 L26 14.5 L14 14.5 Z" fill="#78350f" />

                    {/* Text: iPhone */}
                    <text x="20" y="21" textAnchor="middle" fill="#78350f" fontSize="7.5" fontWeight="900" fontFamily="sans-serif">
                      iPhone
                    </text>

                    {/* Text: গিফট */}
                    <text x="20" y="27.5" textAnchor="middle" fill="#78350f" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
                      গিফট
                    </text>

                    {/* Gift Icon Emoji */}
                    <text x="20" y="33.5" textAnchor="middle" fontSize="6">🎁</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* Bottom Golden Incentive CTA Button */}
            <div className="pt-0.5">
              <button
                type="button"
                onClick={() => setIsIncentiveModalOpen(true)}
                className="w-full py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-[#fbbf24] via-[#f59e0b] to-[#eab308] text-slate-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-amber-500/25 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Gift className="w-4 h-4 stroke-[2.5]" />
                <span>ইনসেনটিভ বোনাস →</span>
              </button>

              <div className="text-center text-[10px] sm:text-[11px] text-sky-200 font-bengali tracking-wide mt-1.5">
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
                      ? "bg-gradient-to-r from-[#0b2654] via-[#1e5eb3] to-[#0284c7] text-white hover:shadow-lg active:scale-95 cursor-pointer"
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
                    <span className="font-bold text-emerald-900">১ম জেনারেশন (1st Generation):</span>
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
                    <span className="font-bold text-blue-900">২য় জেনারেশন (2nd Generation):</span>
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
                    <span className="font-bold text-purple-900">৩য় জেনারেশন (3rd Generation):</span>
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
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0b2654] via-[#1e5eb3] to-[#0284c7] text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
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
