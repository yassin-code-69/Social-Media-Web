"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Crown,
  Coins,
  Zap,
  CalendarCheck,
  AlertCircle,
  TrendingUp,
  Percent,
  Calendar,
  ChevronRight,
  MousePointerClick,
  CheckCircle2,
  Copy,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Wallet,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore, PackageItem } from "@/lib/mock-store";

export default function PackagesPage() {
  const router = useRouter();
  const { packages, profile, purchasePackage, adjustUserWallet } = useMockStore();

  // Selected package for purchase modal
  const [selectedPackage, setSelectedPackage] = useState<PackageItem | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "bKash" | "Nagad">("wallet");
  const [trxId, setTrxId] = useState("");
  const [copied, setCopied] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 6 Tier rows matching the screenshot
  const tierRows = [
    {
      range: "৳ 500 – ৳ 1,000",
      rate: "2%",
      tasks: "1 – 5 টি",
      pillColor: "bg-emerald-500",
      textColor: "text-emerald-700",
      bgBadge: "bg-emerald-50/60",
    },
    {
      range: "৳ 1,001 – ৳ 5,000",
      rate: "2.5%",
      tasks: "5 – 10 টি",
      pillColor: "bg-blue-600",
      textColor: "text-blue-700",
      bgBadge: "bg-blue-50/60",
    },
    {
      range: "৳ 5,001 – ৳ 10,000",
      rate: "3%",
      tasks: "10 – 15 টি",
      pillColor: "bg-purple-600",
      textColor: "text-purple-700",
      bgBadge: "bg-purple-50/60",
    },
    {
      range: "৳ 10,001 – ৳ 25,000",
      rate: "3.5%",
      tasks: "15 – 25 টি",
      pillColor: "bg-orange-500",
      textColor: "text-orange-700",
      bgBadge: "bg-orange-50/60",
    },
    {
      range: "৳ 25,001 – ৳ 50,000",
      rate: "4%",
      tasks: "25 – 40 টি",
      pillColor: "bg-rose-500",
      textColor: "text-rose-700",
      bgBadge: "bg-rose-50/60",
    },
    {
      range: "৳ 50,001+",
      rate: "5%",
      tasks: "40+ টি",
      pillColor: "bg-pink-600",
      textColor: "text-pink-700",
      bgBadge: "bg-pink-50/60",
    },
  ];

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenPurchase = (price: number, name: string) => {
    const existing = packages.find((p) => p.price === price) || {
      id: `pkg_${price}`,
      name: name,
      price: price,
      validityDays: 30,
      dailyTaskLimit: price === 500 ? 5 : 10,
      dailyRewardLimit: price === 500 ? 25 : 50,
      referralBonus: price === 500 ? 50 : 100,
      color: price === 500 ? "green" : "blue",
      features: ["দৈনিক টাস্ক", "দিগন্ত স্তর কমিশন", "ভিআইপি সাপোর্ট"],
    };
    setSelectedPackage(existing);
    setPurchaseError(null);
    setPurchaseSuccess(null);
  };

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage) return;

    setIsSubmitting(true);
    setPurchaseError(null);

    try {
      if (paymentMethod === "wallet") {
        if (profile.balance < selectedPackage.price) {
          throw new Error(
            `আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই! বর্তমান ব্যালেন্স: ৳${profile.balance}, প্রয়োজন: ৳${selectedPackage.price}`
          );
        }
      }

      purchasePackage(selectedPackage);
      setPurchaseSuccess(
        `অভিনন্দন! আপনার ${selectedPackage.name} সফলভাবে সক্রিয় করা হয়েছে!`
      );

      setTimeout(() => {
        setIsSubmitting(false);
        setPurchaseSuccess(null);
        setSelectedPackage(null);
        setTrxId("");
      }, 1600);
    } catch (err: any) {
      setPurchaseError(err?.message || "প্যাকেজ ক্রয় করতে সমস্যা হয়েছে।");
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
        <div className="px-3 pt-3 pb-6 space-y-3.5">
          {/* ========================================================
              SECTION 1: HERO BANNER (দিগন্ত স্তর)
              ======================================================== */}
          <div className="bg-gradient-to-r from-[#d9f2fe] via-[#ebf7fe] to-[#ccecfc] rounded-3xl p-3.5 sm:p-4 shadow-sm border border-sky-300 relative overflow-hidden">
            {/* Ambient Sunshine Glow */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-300/25 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2 relative z-10">
              {/* Left Side: Crown Shield Emblem + Title + Slogan + Desc */}
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                {/* Crown Shield SVG Emblem */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 relative flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
                    {/* Golden Laurel Wreath / Ring */}
                    <circle
                      cx="50"
                      cy="50"
                      r="44"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="3.5"
                      strokeDasharray="6 3"
                    />

                    {/* Shield Outer Border */}
                    <path
                      d="M50 14 L78 24 L78 52 C78 72 50 86 50 86 C50 86 22 72 22 52 L22 24 Z"
                      fill="#0b2654"
                      stroke="#fbbf24"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />

                    {/* Inner Shield Glow */}
                    <path
                      d="M50 20 L72 28 L72 52 C72 68 50 80 50 80 C50 80 28 68 28 52 L28 28 Z"
                      fill="#1e5eb3"
                    />

                    {/* 3-Point Golden Crown */}
                    <path
                      d="M34 54 L38 38 L45 46 L50 36 L55 46 L62 38 L66 54 Z"
                      fill="#fbbf24"
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                    <rect x="34" y="54" width="32" height="6" rx="2" fill="#f59e0b" />

                    {/* Jewels / Stars on Crown Peaks */}
                    <circle cx="38" cy="36" r="2.5" fill="#fef08a" />
                    <circle cx="50" cy="34" r="3" fill="#fef08a" />
                    <circle cx="62" cy="36" r="2.5" fill="#fef08a" />
                  </svg>
                </div>

                {/* Title & Description */}
                <div className="min-w-0">
                  <h1 className="text-2xl sm:text-[26px] font-extrabold text-[#0b2654] leading-tight font-bengali">
                    দিগন্ত স্তর
                  </h1>

                  {/* Slogan Pill */}
                  <div className="inline-block mt-0.5">
                    <span className="bg-[#fde047] text-[#854d0e] font-extrabold text-[11px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-2xs font-bengali">
                      ছোট বিনিয়োগ, বড় সুযোগ
                    </span>
                  </div>

                  {/* Subtitle description */}
                  <p className="text-[10px] sm:text-[11px] text-slate-700 font-bengali leading-snug mt-1 max-w-[170px] sm:max-w-[215px]">
                    আপনার প্যাকেজ অনুযায়ী প্রতিদিন টাস্কের মাধ্যমে নিয়মিত আয় করুন দিগন্ত স্তরের ব্যালেন্স থেকে।
                  </p>
                </div>
              </div>

              {/* Right Side: Mountaineer Summit Silhouette & Floating Badge */}
              <div className="flex-shrink-0 flex flex-col items-center justify-between relative min-w-[110px] sm:min-w-[125px]">
                {/* Motivational Navy Stamp Badge at top */}
                <div className="bg-[#0b2654] text-white rounded-2xl p-2 text-center shadow-md border border-sky-400/40 w-full mb-1">
                  <div className="text-[9.5px] text-sky-200 font-bold font-bengali leading-tight">
                    আজকের
                  </div>
                  <div className="text-[11px] text-white font-extrabold font-bengali leading-tight">
                    সঠিক সিদ্ধান্ত
                  </div>
                  <div className="text-[9.5px] text-sky-200 font-bold font-bengali leading-tight">
                    আপনার
                  </div>
                  <div className="text-[11px] text-amber-300 font-black font-bengali leading-tight flex items-center justify-center gap-1 mt-0.5">
                    <span>সফলতার পথে</span>
                    <TrendingUp className="w-3 h-3 text-amber-300 inline" />
                  </div>
                </div>

                {/* Mountain Summit with Climber Illustration */}
                <div className="w-24 h-16 relative">
                  <svg viewBox="0 0 100 70" className="w-full h-full overflow-visible drop-shadow-sm">
                    {/* Mountain Ridge */}
                    <polygon points="10,70 50,25 90,70" fill="#1e3a8a" opacity="0.8" />
                    <polygon points="35,70 65,30 95,70" fill="#0f172a" />
                    <polygon points="45,35 50,25 55,35 60,45 50,40 40,45" fill="#bae6fd" />

                    {/* Flagpole & Flag */}
                    <line x1="72" y1="12" x2="72" y2="40" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" />
                    <polygon points="72,12 92,18 72,25" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />

                    {/* Mountaineer Character */}
                    {/* Head */}
                    <circle cx="62" cy="24" r="3.5" fill="#fed7aa" />
                    <path d="M59 23 C59 19 65 19 65 23 Z" fill="#0f172a" />
                    {/* Body & backpack */}
                    <path d="M57 28 L67 28 L65 44 L59 44 Z" fill="#2563eb" />
                    <rect x="54" y="30" width="4" height="9" rx="1.5" fill="#f59e0b" />
                    {/* Legs */}
                    <line x1="60" y1="44" x2="57" y2="54" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="64" y1="44" x2="68" y2="54" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" />
                    {/* Arm raising to flag */}
                    <line x1="65" y1="30" x2="72" y2="24" stroke="#fed7aa" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 2: প্যাকেজ অনুযায়ী দৈনিক ইনকাম (SHOWCASE CARDS)
              ======================================================== */}
          <div className="space-y-2.5">
            {/* Header row with Left title and Right yellow pill */}
            <div className="flex items-center justify-between gap-1.5 flex-wrap">
              {/* Left Pill */}
              <div className="bg-[#0b2654] text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold font-bengali">
                  প্যাকেজ অনুযায়ী দৈনিক ইনকাম
                </span>
              </div>

              {/* Right Alert Pill */}
              <div className="bg-[#fef9c3] border border-amber-300 text-[#854d0e] px-2.5 py-1 rounded-full flex items-center gap-1 text-[9px] sm:text-[10px] font-bold font-bengali">
                <Zap className="w-3 h-3 text-amber-600 fill-amber-500 flex-shrink-0" />
                <span>আপনার দিগন্ত স্তর ব্যালেন্সের উপর প্রতিদিন নির্দিষ্ট শতাংশ ইনকাম পাবেন!</span>
              </div>
            </div>

            {/* Package Card 1: 500 টাকার প্যাকেজ */}
            <div
              onClick={() => handleOpenPurchase(500, "500 টাকার প্যাকেজ")}
              className="bg-white rounded-2xl p-3 shadow-sm border border-emerald-200 hover:border-emerald-400 transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
            >
              {/* Left 3D Isometric Green Cube */}
              <div className="w-15 h-15 sm:w-16 sm:h-16 flex-shrink-0 relative flex items-center justify-center">
                <svg viewBox="0 0 70 70" className="w-full h-full drop-shadow-sm group-hover:scale-105 transition-transform">
                  {/* Top Face */}
                  <polygon points="35,10 58,22 35,34 12,22" fill="#34d399" />
                  {/* Left Face */}
                  <polygon points="12,22 35,34 35,60 12,48" fill="#059669" />
                  {/* Right Face */}
                  <polygon points="35,34 58,22 58,48 35,60" fill="#047857" />
                  {/* Text on cube */}
                  <text x="35" y="44" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                    প্যাকেজ
                  </text>
                  <text x="35" y="54" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="black" fontFamily="sans-serif">
                    ৳ 500
                  </text>
                </svg>
              </div>

              {/* Middle Details */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-bengali">
                  500 টাকার প্যাকেজ ক্রয় করলে
                </h3>
                <div>
                  <span className="bg-[#059669] text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full inline-block shadow-2xs font-bengali">
                    প্রতিদিন 2%
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 font-bengali leading-snug">
                  টাস্কের কাজ পাবেন এবং ইনকাম পাবেন (দিগন্ত স্তরের ব্যালেন্সের উপর)
                </p>
              </div>

              {/* Right Side: Daily Tasks Box */}
              <div className="flex flex-col items-center justify-center text-center pl-2 border-l border-slate-100 min-w-[85px] sm:min-w-[95px] flex-shrink-0">
                <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                  <CalendarCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="text-[9.5px] font-medium text-slate-500 font-bengali">
                  দৈনিক টাস্ক সংখ্যা
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-900 font-bengali leading-tight mt-0.5">
                  1 - 5 টি
                </div>
                <div className="text-[9px] text-slate-400 font-bengali">
                  (2% এর জন্য)
                </div>
              </div>
            </div>

            {/* Package Card 2: 1,000 টাকার প্যাকেজ */}
            <div
              onClick={() => handleOpenPurchase(1000, "1,000 টাকার প্যাকেজ")}
              className="bg-white rounded-2xl p-3 shadow-sm border border-blue-200 hover:border-blue-400 transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
            >
              {/* Left 3D Isometric Blue Cube */}
              <div className="w-15 h-15 sm:w-16 sm:h-16 flex-shrink-0 relative flex items-center justify-center">
                <svg viewBox="0 0 70 70" className="w-full h-full drop-shadow-sm group-hover:scale-105 transition-transform">
                  {/* Top Face */}
                  <polygon points="35,10 58,22 35,34 12,22" fill="#60a5fa" />
                  {/* Left Face */}
                  <polygon points="12,22 35,34 35,60 12,48" fill="#2563eb" />
                  {/* Right Face */}
                  <polygon points="35,34 58,22 58,48 35,60" fill="#1d4ed8" />
                  {/* Text on cube */}
                  <text x="35" y="44" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                    প্যাকেজ
                  </text>
                  <text x="35" y="54" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="black" fontFamily="sans-serif">
                    ৳ 1,000
                  </text>
                </svg>
              </div>

              {/* Middle Details */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 font-bengali">
                  1,000 টাকার প্যাকেজ ক্রয় করলে
                </h3>
                <div>
                  <span className="bg-[#1d4ed8] text-white font-extrabold text-xs px-2.5 py-0.5 rounded-full inline-block shadow-2xs font-bengali">
                    প্রতিদিন 2.5%
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 font-bengali leading-snug">
                  টাস্কের কাজ পাবেন এবং ইনকাম পাবেন (দিগন্ত স্তরের ব্যালেন্সের উপর)
                </p>
              </div>

              {/* Right Side: Daily Tasks Box */}
              <div className="flex flex-col items-center justify-center text-center pl-2 border-l border-slate-100 min-w-[85px] sm:min-w-[95px] flex-shrink-0">
                <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                  <CalendarCheck className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div className="text-[9.5px] font-medium text-slate-500 font-bengali">
                  দৈনিক টাস্ক সংখ্যা
                </div>
                <div className="text-xs sm:text-sm font-black text-slate-900 font-bengali leading-tight mt-0.5">
                  5 - 10 টি
                </div>
                <div className="text-[9px] text-slate-400 font-bengali">
                  (2.5% এর জন্য)
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 3: গুরুত্বপূর্ণ তথ্য (ALERT CARD)
              ======================================================== */}
          <div className="bg-[#fff1f2] border border-rose-200 rounded-2xl p-3 shadow-xs flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="font-black text-sm leading-none">!</span>
            </div>

            <div className="space-y-1 flex-1">
              <h4 className="text-xs font-bold text-[#e11d48] font-bengali">
                গুরুত্বপূর্ণ তথ্য :
              </h4>
              <ul className="space-y-0.5 text-[10.5px] text-slate-700 font-bengali">
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-black">•</span>
                  <span>যত বেশি দিগন্ত স্তরের ব্যালেন্স থাকবে, তত বেশি শতাংশে ইনকাম পাবেন।</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-rose-500 font-black">•</span>
                  <span>দৈনিক টাস্কের পরিমাণ প্রতিটি শতাংশের উপর নির্ভর করবে।</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ========================================================
              SECTION 4: দিগন্ত স্তরের ইনকামের শতাংশ (TIER TABLE)
              ======================================================== */}
          <div className="space-y-2.5">
            {/* Header row */}
            <div className="flex items-center justify-between">
              {/* Left Pill */}
              <div className="bg-[#1e5eb3] text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 text-sky-200" />
                <span className="text-xs font-bold font-bengali">
                  দিগন্ত স্তরের ইনকামের শতাংশ (উদাহরণ)
                </span>
              </div>

              {/* Right Stamp Badge */}
              <div className="bg-[#1d4ed8] text-white px-3 py-1 rounded-full text-xs font-black shadow-xs -rotate-2 border border-dashed border-white/60">
                বেশি ব্যালেন্স বেশি ইনকাম
              </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Table Column Headers */}
              <div className="grid grid-cols-3 text-white text-center font-bengali font-bold text-[11px] sm:text-xs">
                {/* Col 1 */}
                <div className="bg-[#0f766e] p-2.5 flex items-center justify-center gap-1">
                  <Coins className="w-3.5 h-3.5" />
                  <span>দিগন্ত স্তরের ব্যালেন্স</span>
                </div>

                {/* Col 2 */}
                <div className="bg-[#059669] p-2.5 flex items-center justify-center gap-1 border-x border-white/20">
                  <Percent className="w-3.5 h-3.5" />
                  <span>দৈনিক ইনকামের হার (প্রতিদিন)</span>
                </div>

                {/* Col 3 */}
                <div className="bg-[#1d4ed8] p-2.5 flex items-center justify-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>দৈনিক টাস্কের পরিমাণ (আনুমানিক)</span>
                </div>
              </div>

              {/* Table Rows (6 Tiers) */}
              <div className="divide-y divide-slate-100 text-center text-xs font-medium">
                {tierRows.map((row, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-3 items-center py-2.5 px-2 hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Range with colored indicator */}
                    <div className="flex items-center justify-start pl-1 sm:pl-3 gap-1.5 font-bold text-slate-800 text-[11px] sm:text-xs">
                      <span className={`w-2 h-4 rounded-full ${row.pillColor} inline-block flex-shrink-0`} />
                      <span className="whitespace-nowrap">{row.range}</span>
                    </div>

                    {/* Rate */}
                    <div className="flex items-center justify-center">
                      <span
                        className={`px-2.5 py-0.5 rounded-full ${row.bgBadge} ${row.textColor} font-black text-[11px] sm:text-xs`}
                      >
                        {row.rate}
                      </span>
                    </div>

                    {/* Tasks */}
                    <div className="font-bold text-slate-800 text-[11px] sm:text-xs">
                      {row.tasks}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 5: CALL TO ACTION (কাজ শুরু করুন বাটন)
              ======================================================== */}
          <div className="p-1 rounded-2xl bg-white border border-blue-400 shadow-sm">
            <button
              type="button"
              onClick={() => router.push("/tasks")}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#1d4ed8] via-[#2563eb] to-[#1e5eb3] hover:from-[#1e40af] hover:to-[#1d4ed8] text-white flex items-center justify-between shadow-md active:scale-98 transition-all group cursor-pointer"
            >
              {/* Left Clicking Hand Icon */}
              <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                <MousePointerClick className="w-5 h-5" />
              </div>

              {/* Center Text */}
              <div className="text-center flex-1 px-2">
                <div className="text-sm sm:text-base font-extrabold font-bengali leading-tight">
                  দিগন্ত স্তরের কাজ শুরু করুন
                </div>
                <div className="text-[10px] text-sky-200 font-medium font-bengali mt-0.5">
                  এখনই ক্লিক করুন এবং টাস্ক সম্পাদন করে ইনকাম করুন
                </div>
              </div>

              {/* Right Chevron Arrow */}
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 group-hover:translate-x-1 transition-transform">
                <ChevronRight className="w-4 h-4 stroke-[3]" />
              </div>
            </button>
          </div>
        </div>

        {/* ========================================================
            MODAL: PACKAGE PURCHASE / ACTIVATION MODAL
            ======================================================== */}
        {selectedPackage && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setSelectedPackage(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {selectedPackage.name} সক্রিয়করণ
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      মূল্য: ৳ {selectedPackage.price.toLocaleString()} • মেয়াদ: ৩০ দিন
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPackage(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Notifications */}
              {purchaseSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{purchaseSuccess}</span>
                </div>
              )}

              {purchaseError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <span>{purchaseError}</span>
                </div>
              )}

              <form onSubmit={handleConfirmPurchase} className="space-y-4">
                {/* Method selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-800 block">
                    পেমেন্ট পদ্ধতি নির্বাচন করুন:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("wallet")}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === "wallet"
                          ? "bg-blue-50 border-blue-600 text-blue-800 ring-1 ring-blue-500"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      <Wallet className="w-4 h-4 text-blue-600" />
                      <span>ওয়ালেট ব্যালেন্স</span>
                      <span className="text-[9.5px] text-slate-400 font-normal">
                        (৳ {profile.balance})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("bKash")}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === "bKash"
                          ? "bg-pink-50 border-pink-600 text-pink-800 ring-1 ring-pink-500"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      <span className="text-pink-600 font-extrabold text-sm">bKash</span>
                      <span>বিকাশ সেন্ড মানি</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod("Nagad")}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                        paymentMethod === "Nagad"
                          ? "bg-orange-50 border-orange-600 text-orange-800 ring-1 ring-orange-500"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      <span className="text-orange-600 font-extrabold text-sm">Nagad</span>
                      <span>নগদ সেন্ড মানি</span>
                    </button>
                  </div>
                </div>

                {/* External payment details */}
                {paymentMethod !== "wallet" && (
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-600">
                        {paymentMethod === "bKash" ? "বিকাশ নম্বর" : "নগদ নম্বর"}:
                      </span>
                      <div className="flex items-center gap-1 font-mono font-bold text-slate-900">
                        <span>01889983939</span>
                        <button
                          type="button"
                          onClick={() => handleCopyNumber("01889983939")}
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                      </div>
                    </div>
                    {copied && (
                      <p className="text-[10px] text-emerald-600 font-medium text-right">
                        নম্বর কপি করা হয়েছে!
                      </p>
                    )}

                    <div className="pt-1">
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">
                        ট্রানজেকশন আইডি (TrxID) দিন:
                      </label>
                      <input
                        type="text"
                        required
                        value={trxId}
                        onChange={(e) => setTrxId(e.target.value)}
                        placeholder="যেমন: 9X7Y6Z8A"
                        className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {/* Confirm Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0b2654] via-[#1e5eb3] to-[#0284c7] text-white font-bold text-xs shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>প্রক্রিয়াধীন...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      <span>
                        ৳ {selectedPackage.price.toLocaleString()} দিয়ে প্যাকেজ কিনুন
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
