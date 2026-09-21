"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Wallet,
  Coins,
  TrendingUp,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowUpRight,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  BarChart2,
  ListFilter,
  Layers,
  Percent,
  Check,
  Send,
  Lock,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import { icashApi } from "@/lib/api-client";

interface InvestmentPlan {
  years: number;
  ratePercent: number;
  color: "blue" | "green" | "orange" | "purple";
  borderColor: string;
  btnColor: string;
  textColor: string;
  iconBg: string;
}

interface ActiveInvestment {
  id: string;
  years: number;
  ratePercent: number;
  principal: number;
  profit: number;
  total: number;
  daysPassed: number;
  daysLeft: number;
  totalDays: number;
  endDate: string;
  endDateBangla: string;
  color: "green" | "orange" | "blue" | "purple";
}

interface HistoryItem {
  id: string;
  date: string;
  years: string;
  principal: number;
  profit: number;
  total: number;
  status: "চলমান" | "উইথড্র";
  statusType: "active" | "withdrawn";
}

export default function ICashPage() {
  const router = useRouter();
  const { profile, adjustUserWallet } = useMockStore();

  // Dynamic I Cash Balances matching mockup
  const [icashBalance, setIcashBalance] = useState<number>(12500.0);
  const [totalInvested, setTotalInvested] = useState<number>(10000.0);
  const [totalProfit, setTotalProfit] = useState<number>(2500.0);

  // 4 Term Plans matching mockup
  const plans: InvestmentPlan[] = [
    {
      years: 1,
      ratePercent: 3,
      color: "blue",
      borderColor: "border-sky-200",
      btnColor: "bg-[#0284c7] hover:bg-[#0369a1]",
      textColor: "text-[#0284c7]",
      iconBg: "bg-sky-50",
    },
    {
      years: 2,
      ratePercent: 5,
      color: "green",
      borderColor: "border-emerald-200",
      btnColor: "bg-[#059669] hover:bg-[#047857]",
      textColor: "text-[#059669]",
      iconBg: "bg-emerald-50",
    },
    {
      years: 5,
      ratePercent: 8,
      color: "orange",
      borderColor: "border-orange-200",
      btnColor: "bg-[#ea580c] hover:bg-[#c2410c]",
      textColor: "text-[#ea580c]",
      iconBg: "bg-orange-50",
    },
    {
      years: 10,
      ratePercent: 10,
      color: "purple",
      borderColor: "border-purple-200",
      btnColor: "bg-[#9333ea] hover:bg-[#7e22ce]",
      textColor: "text-[#9333ea]",
      iconBg: "bg-purple-50",
    },
  ];

  // Active Investments matching mockup
  const [activeInvestments, setActiveInvestments] = useState<ActiveInvestment[]>([
    {
      id: "inv_1",
      years: 2,
      ratePercent: 5,
      principal: 5000,
      profit: 250,
      total: 5250,
      daysPassed: 392,
      daysLeft: 373,
      totalDays: 730,
      endDate: "05-10-2027",
      endDateBangla: "০৫-১০-২০২৭ (প্রায় ১ বছর ১ মাস ৪ দিন বাকি)",
      color: "green",
    },
    {
      id: "inv_2",
      years: 5,
      ratePercent: 8,
      principal: 10000,
      profit: 8000,
      total: 18000,
      daysPassed: 1250,
      daysLeft: 1090,
      totalDays: 1825,
      endDate: "05-10-2029",
      endDateBangla: "০৫-১০-২০২৯ (প্রায় ২ বছর ১১ মাস ১০ দিন বাকি)",
      color: "orange",
    },
  ]);

  // History Items matching mockup
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([
    {
      id: "hist_1",
      date: "05-10-2025",
      years: "2 বছর",
      principal: 5000,
      profit: 250,
      total: 5250,
      status: "চলমান",
      statusType: "active",
    },
    {
      id: "hist_2",
      date: "12-08-2025",
      years: "1 বছর",
      principal: 3000,
      profit: 90,
      total: 3090,
      status: "চলমান",
      statusType: "active",
    },
    {
      id: "hist_3",
      date: "01-06-2025",
      years: "5 বছর",
      principal: 10000,
      profit: 8000,
      total: 18000,
      status: "উইথড্র",
      statusType: "withdrawn",
    },
  ]);

  // Modals state
  const [selectedPlanForInvest, setSelectedPlanForInvest] = useState<InvestmentPlan | null>(null);
  const [investAmount, setInvestAmount] = useState<number>(5000);
  const [investSuccess, setInvestSuccess] = useState<string | null>(null);
  const [investError, setInvestError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Withdrawal modal state
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState<boolean>(false);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(totalProfit);
  const [withdrawMethod, setWithdrawMethod] = useState<"bKash" | "Nagad">("bKash");
  const [withdrawAccount, setWithdrawAccount] = useState<string>("");
  const [withdrawSuccess, setWithdrawSuccess] = useState<string | null>(null);

  // Withdrawal info modal
  const [withdrawInfoModalOpen, setWithdrawInfoModalOpen] = useState<boolean>(false);
  const [selectedInvestmentForInfo, setSelectedInvestmentForInfo] = useState<ActiveInvestment | null>(null);

  // Handle New Investment Submit
  const handleConfirmInvestment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlanForInvest) return;

    if (investAmount < 500) {
      setInvestError("সর্বনিম্ন বিনিয়োগ ৳ ৫০০ টাকা!");
      return;
    }

    if (profile.balance < investAmount) {
      setInvestError(`আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই! বর্তমান ব্যালেন্স: ৳${profile.balance}`);
      return;
    }

    setIsSubmitting(true);
    setInvestError(null);

    const planIdMap: Record<number, string> = {
      1: "1yr",
      2: "2yr",
      5: "5yr",
      10: "10yr",
    };
    const planId = planIdMap[selectedPlanForInvest.years] || "1yr";

    try {
      await icashApi.invest({ planId, amountBDT: investAmount });
      // Deduct from wallet
      adjustUserWallet(investAmount, "DEBIT", `I Cash বিনিয়োগ (${selectedPlanForInvest.years} বছর)`);

      const estimatedProfit = Math.round((investAmount * selectedPlanForInvest.ratePercent) / 100);
      const totalDays = selectedPlanForInvest.years * 365;

      const newInv: ActiveInvestment = {
        id: `inv_${Date.now()}`,
        years: selectedPlanForInvest.years,
        ratePercent: selectedPlanForInvest.ratePercent,
        principal: investAmount,
        profit: estimatedProfit,
        total: investAmount + estimatedProfit,
        daysPassed: 1,
        daysLeft: totalDays - 1,
        totalDays: totalDays,
        endDate: `21-09-${2026 + selectedPlanForInvest.years}`,
        endDateBangla: `২১-০৯-${2026 + selectedPlanForInvest.years} (${selectedPlanForInvest.years} বছর বাকি)`,
        color: selectedPlanForInvest.color,
      };

      setActiveInvestments((prev) => [newInv, ...prev]);
      setIcashBalance((prev) => prev + investAmount);
      setTotalInvested((prev) => prev + investAmount);

      setHistoryItems((prev) => [
        {
          id: `hist_${Date.now()}`,
          date: "আজকে",
          years: `${selectedPlanForInvest.years} বছর`,
          principal: investAmount,
          profit: estimatedProfit,
          total: investAmount + estimatedProfit,
          status: "চলমান",
          statusType: "active",
        },
        ...prev,
      ]);

      setInvestSuccess(`অভিনন্দন! ৳${investAmount.toLocaleString()} টাকার ${selectedPlanForInvest.years} বছর মেয়াদী বিনিয়োগ সফল হয়েছে!`);
      setIsSubmitting(false);

      setTimeout(() => {
        setSelectedPlanForInvest(null);
        setInvestSuccess(null);
      }, 1600);
    } catch (err: any) {
      setInvestError(err.message || "বিনিয়োগ করতে সমস্যা হয়েছে");
      setIsSubmitting(false);
    }
  };

  // Handle Withdraw Profit Submit
  const handleConfirmWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    if (withdrawAmount <= 0) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setTotalProfit((prev) => Math.max(0, prev - withdrawAmount));
      setIcashBalance((prev) => Math.max(0, prev - withdrawAmount));
      adjustUserWallet(withdrawAmount, "CREDIT", `I Cash মুনাফা উইথড্র (${withdrawMethod})`);

      setWithdrawSuccess(`৳${withdrawAmount.toLocaleString()} উইথড্র রিকোয়েস্ট সফল হয়েছে!`);
      setIsSubmitting(false);

      setTimeout(() => {
        setIsWithdrawModalOpen(false);
        setWithdrawSuccess(null);
      }, 1600);
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
              SECTION 1: HERO BANNER (আমার I Cash ব্যালেন্স & মুনাফা)
              ======================================================== */}
          <div className="bg-gradient-to-r from-[#e1f3fd] via-[#eef8fe] to-[#daf0fd] rounded-3xl p-3 sm:p-3.5 shadow-sm border border-sky-200/90 relative overflow-hidden flex items-center justify-between gap-2">
            {/* Left Side: 3D Wallet Icon + Balance Details */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
              {/* Custom SVG 3D Blue Leather Wallet with Coins & Leaves */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 flex-shrink-0 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
                  {/* Sprout leaves from top of wallet */}
                  <path d="M48 28 C40 16 52 8 62 14 C64 24 55 30 48 28 Z" fill="#22c55e" />
                  <path d="M58 24 C54 14 65 10 72 16 C73 24 64 26 58 24 Z" fill="#4ade80" />

                  {/* Gold Coins popping out of wallet top */}
                  <ellipse cx="44" cy="30" rx="14" ry="7" fill="#f59e0b" />
                  <ellipse cx="44" cy="27" rx="14" ry="7" fill="#fbbf24" />
                  <text x="44" y="29" textAnchor="middle" fill="#92400e" fontSize="7" fontWeight="bold">৳</text>

                  {/* Main Blue Leather Wallet Body */}
                  <rect x="18" y="32" width="64" height="48" rx="10" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
                  <path d="M18 36 C24 34 32 34 82 36 L82 72 C82 76 78 80 74 80 L26 80 C22 80 18 76 18 72 Z" fill="#0369a1" />

                  {/* Wallet Flap with Clasp */}
                  <path d="M18 42 L62 42 C70 42 74 48 74 54 C74 60 70 66 62 66 L18 66 Z" fill="#0284c7" stroke="#60a5fa" strokeWidth="1" />
                  <circle cx="62" cy="54" r="6" fill="#f59e0b" />
                  <text x="62" y="56.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">৳</text>

                  {/* Floating Gold Coin Beside Wallet */}
                  <g transform="translate(68, 62)">
                    <circle cx="10" cy="10" r="9" fill="#f59e0b" />
                    <circle cx="10" cy="10" r="7.5" fill="#fde047" />
                    <text x="10" y="13" textAnchor="middle" fill="#92400e" fontSize="9" fontWeight="black">৳</text>
                  </g>
                </svg>
              </div>

              {/* Text Info */}
              <div className="min-w-0">
                <div className="text-xs sm:text-sm font-bold text-[#0b2654] font-bengali leading-tight">
                  আমার I Cash ব্যালেন্স
                </div>
                <div className="text-xl sm:text-[22px] font-black text-[#0b2654] font-sans leading-tight mt-0.5 whitespace-nowrap">
                  ৳ {icashBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-600 font-bengali leading-snug mt-0.5 whitespace-nowrap">
                  মোট বিনিয়োগ: ৳ {totalInvested.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>

            {/* Right Side: Total Profit Card & Withdraw Button */}
            <div className="bg-[#0284c7] text-white rounded-2xl p-2.5 sm:p-3 shadow-sm flex flex-col justify-between min-w-[125px] sm:min-w-[140px] flex-shrink-0">
              {/* Profit details */}
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Coins className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <div className="text-[9px] text-sky-100 font-bengali leading-tight whitespace-nowrap">
                    মোট মুনাফা (এ পর্যন্ত)
                  </div>
                  <div className="text-xs sm:text-sm font-black leading-tight mt-0.5 whitespace-nowrap font-sans">
                    ৳ {totalProfit.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
              </div>

              {/* Withdraw Button */}
              <button
                type="button"
                onClick={() => setIsWithdrawModalOpen(true)}
                className="mt-2 py-1.5 px-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[10px] sm:text-[11px] font-bold flex items-center justify-center gap-1 active:scale-95 transition-all border border-white/20 shadow-2xs whitespace-nowrap cursor-pointer"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>উইথড্র করুন →</span>
              </button>
            </div>
          </div>

          {/* ========================================================
              SECTION 2: বিনিয়োগের মেয়াদ নির্বাচন করুন (4 TERM CARDS)
              ======================================================== */}
          <div className="space-y-2.5">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#1e5eb3] text-white flex items-center justify-center flex-shrink-0">
                  <BarChart2 className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-[#0b2654] font-bengali">
                  বিনিয়োগের মেয়াদ নির্বাচন করুন
                </h2>
              </div>

              <div className="flex items-center gap-1 text-[10px] sm:text-[10.5px] font-bold text-sky-700 font-bengali">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                <span>নিরাপদ বিনিয়োগে বেশি লাভ</span>
              </div>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-4 gap-2">
              {plans.map((p) => (
                <div
                  key={p.years}
                  className={`bg-white rounded-2xl p-2 sm:p-2.5 shadow-xs border ${p.borderColor} flex flex-col items-center text-center justify-between transition-all hover:shadow-sm`}
                >
                  {/* Calendar with number */}
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className={`w-full h-2.5 ${p.btnColor} absolute top-0`} />
                    <span className="text-sm font-black text-slate-800 font-sans mt-1">
                      {p.years}
                    </span>
                  </div>

                  {/* Title & Rate */}
                  <div className="my-1.5 space-y-0.5">
                    <div className="text-xs font-bold text-slate-900 font-bengali leading-tight">
                      {p.years} বছর
                    </div>
                    <div className={`text-[10px] sm:text-[11px] font-bold ${p.textColor} font-bengali leading-tight`}>
                      সুদ: {p.ratePercent}%
                    </div>
                  </div>

                  {/* Invest Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPlanForInvest(p);
                      setInvestAmount(5000);
                      setInvestError(null);
                      setInvestSuccess(null);
                    }}
                    className={`w-full py-1.5 px-1 rounded-lg ${p.btnColor} text-white text-[9.5px] font-bold shadow-2xs active:scale-95 transition-all whitespace-nowrap cursor-pointer`}
                  >
                    বিনিয়োগ করুন
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              SECTION 3: আমার চলমান বিনিয়োগ (ACTIVE INVESTMENTS)
              ======================================================== */}
          <div className="space-y-2.5">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#1e5eb3] text-white flex items-center justify-center flex-shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 font-bengali">
                  আমার চলমান বিনিয়োগ
                </h2>
              </div>

              <span className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 cursor-pointer flex items-center gap-0.5">
                <span>সকল দেখুন</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>

            {/* Active Cards List */}
            <div className="space-y-2.5">
              {activeInvestments.map((inv) => {
                const progressPercent = Math.min(100, Math.round((inv.daysPassed / inv.totalDays) * 100));

                return (
                  <div
                    key={inv.id}
                    className="bg-white rounded-2xl p-3 sm:p-3.5 shadow-sm border border-slate-200/90 space-y-2.5 hover:border-sky-300 transition-all"
                  >
                    {/* Top Row: Icon + Term title + 3 Metrics Columns */}
                    <div className="flex items-center justify-between gap-2">
                      {/* Left: Calendar Icon + Title + Rate pill */}
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`w-11 h-11 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-white font-black text-sm shadow-2xs ${
                            inv.color === "green" ? "bg-[#059669]" : "bg-[#ea580c]"
                          }`}
                        >
                          <span className="text-[9px] font-medium leading-none opacity-80">YEAR</span>
                          <span className="leading-none mt-0.5">{inv.years}</span>
                        </div>

                        <div className="min-w-0">
                          <div className="text-xs sm:text-sm font-bold text-slate-900 font-bengali leading-tight">
                            {inv.years} বছরের মেয়াদ
                          </div>
                          <div className="mt-0.5">
                            <span
                              className={`text-white text-[9.5px] font-bold px-2 py-0.2 rounded-full inline-block font-bengali ${
                                inv.color === "green" ? "bg-[#059669]" : "bg-[#ea580c]"
                              }`}
                            >
                              সুদ: {inv.ratePercent}%
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right 3 Metrics Columns */}
                      <div className="flex items-center gap-2 sm:gap-3 text-right">
                        <div>
                          <div className="text-[9.5px] text-slate-500 font-bengali">মূল টাকা</div>
                          <div className="text-xs sm:text-sm font-extrabold text-slate-900 font-sans">
                            ৳ {inv.principal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </div>
                        </div>

                        <div className="border-x border-slate-100 px-2 sm:px-3">
                          <div className="text-[9.5px] text-slate-500 font-bengali">মুনাফা (আনুমানিক)</div>
                          <div className="text-xs sm:text-sm font-extrabold text-emerald-600 font-sans">
                            ৳ {inv.profit.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </div>
                        </div>

                        <div>
                          <div className="text-[9.5px] text-slate-500 font-bengali">মোট প্রাপ্তি</div>
                          <div className="text-xs sm:text-sm font-black text-slate-900 font-sans">
                            ৳ {inv.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar & Day Labels */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-600 font-bengali">
                        <span>আজ থেকে {inv.daysPassed} দিন অতিক্রান্ত</span>
                        <span className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-sky-600" />
                          <span>আর বাকি {inv.daysLeft} দিন</span>
                        </span>
                      </div>

                      <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            inv.color === "green" ? "bg-[#059669]" : "bg-[#ea580c]"
                          }`}
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom Row: Expiry date label & "উইথড্র তথ্য" button */}
                    <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[10px]">
                      <div className="flex items-center gap-1 text-slate-500 font-bengali truncate">
                        <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>মেয়াদ শেষ হবে: {inv.endDateBangla}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedInvestmentForInfo(inv);
                          setWithdrawInfoModalOpen(true);
                        }}
                        className="py-1 px-2.5 rounded-full border border-sky-300 text-[#0284c7] hover:bg-sky-50 font-bold text-[9.5px] flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                      >
                        <Info className="w-3 h-3" />
                        <span>উইথড্র তথ্য</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              SECTION 4: হিস্টোরি (HISTORY TABLE)
              ======================================================== */}
          <div className="space-y-2.5">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-lg bg-[#1e5eb3] text-white flex items-center justify-center flex-shrink-0">
                  <ListFilter className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-xs sm:text-sm font-bold text-slate-900 font-bengali">
                  হিস্টোরি
                </h2>
              </div>

              <span className="text-[11px] font-semibold text-sky-700 hover:text-sky-900 cursor-pointer flex items-center gap-0.5">
                <span>সকল দেখুন</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bengali text-[10.5px]">
                    <tr>
                      <th className="py-2.5 px-3">তারিখ</th>
                      <th className="py-2.5 px-2">মেয়াদ</th>
                      <th className="py-2.5 px-2">মূল টাকা</th>
                      <th className="py-2.5 px-2">মুনাফা</th>
                      <th className="py-2.5 px-2">মোট প্রাপ্তি</th>
                      <th className="py-2.5 px-3 text-center">অবস্থা</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-[11px]">
                    {historyItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Date with icon */}
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <div
                              className={`w-5 h-5 rounded-full flex items-center justify-center text-white ${
                                item.statusType === "active" ? "bg-emerald-500" : "bg-purple-600"
                              }`}
                            >
                              {item.statusType === "active" ? (
                                <ArrowUpRight className="w-3 h-3" />
                              ) : (
                                <Check className="w-3 h-3" />
                              )}
                            </div>
                            <span className="font-medium text-slate-800">{item.date}</span>
                          </div>
                        </td>

                        {/* Term */}
                        <td className="py-2.5 px-2 font-medium text-slate-700 whitespace-nowrap">
                          {item.years}
                        </td>

                        {/* Principal */}
                        <td className="py-2.5 px-2 font-bold text-slate-900 whitespace-nowrap">
                          ৳ {item.principal.toLocaleString()}
                        </td>

                        {/* Profit */}
                        <td className="py-2.5 px-2 font-bold text-emerald-600 whitespace-nowrap">
                          ৳ {item.profit.toLocaleString()}
                        </td>

                        {/* Total */}
                        <td className="py-2.5 px-2 font-black text-slate-900 whitespace-nowrap">
                          ৳ {item.total.toLocaleString()}
                        </td>

                        {/* Status badge */}
                        <td className="py-2.5 px-3 text-center whitespace-nowrap">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[9.5px] font-bold ${
                              item.statusType === "active"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            MODAL 1: NEW INVESTMENT MODAL
            ======================================================== */}
        {selectedPlanForInvest && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setSelectedPlanForInvest(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-xl ${selectedPlanForInvest.btnColor} text-white flex items-center justify-center font-bold`}>
                    <BarChart2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {selectedPlanForInvest.years} বছর মেয়াদী I Cash বিনিয়োগ
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      মুনাফার হার: {selectedPlanForInvest.ratePercent}% (নিরাপদ রিটার্ন)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPlanForInvest(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Alert */}
              {investSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{investSuccess}</span>
                </div>
              )}

              {investError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <span>{investError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleConfirmInvestment} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    বিনিয়োগের পরিমাণ (টাকা):
                  </label>
                  <input
                    type="number"
                    min="500"
                    step="500"
                    required
                    value={investAmount}
                    onChange={(e) => setInvestAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500 font-sans"
                  />
                  <div className="flex items-center justify-between text-[10.5px] text-slate-500 mt-1">
                    <span>আপনার বর্তমান ব্যালেন্স: ৳ {profile.balance}</span>
                    <span>সর্বনিম্ন: ৳ ৫০০</span>
                  </div>
                </div>

                {/* Return Preview */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>প্রত্যাশিত মুনাফা ({selectedPlanForInvest.ratePercent}%):</span>
                    <span className="font-bold text-emerald-600 font-sans">
                      + ৳ {Math.round((investAmount * selectedPlanForInvest.ratePercent) / 100)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
                    <span>মেয়াদান্তে মোট প্রাপ্তি:</span>
                    <span className="text-sm font-black text-blue-600 font-sans">
                      ৳ {investAmount + Math.round((investAmount * selectedPlanForInvest.ratePercent) / 100)}
                    </span>
                  </div>
                </div>

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
                      <span>৳ {investAmount.toLocaleString()} বিনিয়োগ নিশ্চিত করুন</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 2: WITHDRAWAL MODAL
            ======================================================== */}
        {isWithdrawModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setIsWithdrawModalOpen(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      I Cash মুনাফা উত্তোলন (Withdraw)
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      উত্তোলনযোগ্য মুনাফা: ৳ {totalProfit.toLocaleString()}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsWithdrawModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {withdrawSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{withdrawSuccess}</span>
                </div>
              )}

              <form onSubmit={handleConfirmWithdraw} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    উত্তোলনের পরিমাণ:
                  </label>
                  <input
                    type="number"
                    max={totalProfit}
                    min="100"
                    required
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm font-bold bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    পদ্ধতি:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod("bKash")}
                      className={`p-2 rounded-xl border text-xs font-bold ${
                        withdrawMethod === "bKash"
                          ? "bg-pink-50 border-pink-500 text-pink-700"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      বিকাশ (bKash)
                    </button>
                    <button
                      type="button"
                      onClick={() => setWithdrawMethod("Nagad")}
                      className={`p-2 rounded-xl border text-xs font-bold ${
                        withdrawMethod === "Nagad"
                          ? "bg-orange-50 border-orange-500 text-orange-700"
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      নগদ (Nagad)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    অ্যাকাউন্ট নম্বর:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="017XXXXXXXX"
                    value={withdrawAccount}
                    onChange={(e) => setWithdrawAccount(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || totalProfit <= 0}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-sky-600 text-white font-bold text-xs shadow-md active:scale-95 transition-all"
                >
                  {isSubmitting ? "উত্তোলন হচ্ছে..." : "উইথড্র নিশ্চিত করুন"}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 3: WITHDRAWAL INFO MODAL
            ======================================================== */}
        {withdrawInfoModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setWithdrawInfoModalOpen(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <Info className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">
                    উইথড্র ও মুনাফা উত্তোলনের নিয়মাবলী
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setWithdrawInfoModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2 text-xs text-slate-700 leading-relaxed font-bengali">
                <p>• <strong>মুনাফা উত্তোলন:</strong> বিনিয়োগের অর্জিত মুনাফা প্রতি মাসে যেকোনো সময় উত্তোলন করা যাবে।</p>
                <p>• <strong>মূল টাকা উত্তোলন:</strong> বিনিয়োগের নির্দিষ্ট মেয়াদ (১/২/৫/১০ বছর) শেষ হওয়া মাত্র মূল টাকা স্বয়ংক্রিয়ভাবে আপনার দিগন্ত মেইন ওয়ালেটে ক্রেডিট হয়ে যাবে।</p>
                <p>• <strong>জরুরি উত্তোলন:</strong> জরুরি প্রয়োজনে নির্দিষ্ট মেয়াদের পূর্বে টাকা তুলতে চাইলে দিগন্ত সাপোর্ট সেন্টারে যোগাযোগ করতে হবে।</p>
              </div>

              <button
                type="button"
                onClick={() => setWithdrawInfoModalOpen(false)}
                className="w-full py-2 px-4 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                ঠিক আছে
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
