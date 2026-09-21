"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMockStore } from "@/lib/mock-store";
import {
  CalendarCheck2,
  CheckCircle,
  Briefcase,
  Disc,
  Trophy,
  CalendarDays,
  Crown,
  Users,
  Wallet,
  Gift,
  PenTool,
  Video,
  FileCheck,
  BookOpen,
  ScanLine,
  X,
  Sparkles,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface ActionItem {
  id: string;
  title: string;
  subtitle: string;
  badge?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  href?: string;
  onClick?: () => void;
}

export function QuickActionGrid() {
  const router = useRouter();
  const { adjustUserWallet } = useMockStore();

  // Modals state
  const [dailyBonusClaimed, setDailyBonusClaimed] = useState(false);
  const [dailyBonusMsg, setDailyBonusMsg] = useState<string | null>(null);

  const [giftModalOpen, setGiftModalOpen] = useState(false);
  const [giftCodeInput, setGiftCodeInput] = useState("");
  const [giftError, setGiftError] = useState("");
  const [giftSuccess, setGiftSuccess] = useState<string | null>(null);

  const [upcomingModalOpen, setUpcomingModalOpen] = useState(false);

  const handleDailyBonus = () => {
    if (dailyBonusClaimed) {
      setDailyBonusMsg("আজকের ডেইলি বোনাস ইতোমধ্যে ক্লেইম করা হয়েছে!");
    } else {
      adjustUserWallet(5, "CREDIT", "ডেইলি লগইন রিওয়ার্ড");
      setDailyBonusClaimed(true);
      setDailyBonusMsg("অভিনন্দন! আপনি আজকের ৳ ৫ ডেইলি বোনাস পেয়েছেন।");
    }
    setTimeout(() => setDailyBonusMsg(null), 3500);
  };

  const handleGiftCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = giftCodeInput.trim().toUpperCase();
    if (code === "DIGONTO" || code === "BONUS20" || code === "GIFT2026") {
      adjustUserWallet(20, "CREDIT", `গিফট কোড রিডিম: ${code}`);
      setGiftSuccess(`অভিনন্দন! "${code}" কোডটি ব্যবহার করে আপনি ৳ ২০ উপহার পেয়েছেন!`);
      setGiftCodeInput("");
      setGiftError("");
    } else {
      setGiftError("ভুল কোড! সঠিক কোড দিন (ট্রাই করুন: DIGONTO)");
    }
  };

  const actions: ActionItem[] = [
    {
      id: "daily-bonus",
      title: "ডেইলি লগইন বোনাস",
      subtitle: "মিশন সেন্টার ও রিওয়ার্ড",
      icon: CalendarCheck2,
      color: "text-[#ea580c] bg-[#fff7ed]",
      href: "/mission",
    },
    {
      id: "free-task",
      title: "ফ্রি টাস্ক",
      subtitle: "সহজ কাজ করুন",
      icon: CheckCircle,
      color: "text-[#16a34a] bg-[#f0fdf4]",
      href: "/tasks",
    },
    {
      id: "job-post",
      title: "জব পোস্ট",
      subtitle: "নতুন কাজ দিন ও কর্মী নিন",
      icon: Briefcase,
      color: "text-[#0284c7] bg-[#f0f9ff]",
      href: "/create",
    },
    {
      id: "lucky-spin",
      title: "লাকি স্পিন",
      subtitle: "চাকা ঘুরিয়ে জিতে নিন",
      icon: Disc,
      color: "text-[#db2777] bg-[#fdf2f8]",
      href: "/spin",
    },
    {
      id: "leadership",
      title: "লিডারবোর্ড",
      subtitle: "টপ মেম্বারদের তালিকা",
      icon: Trophy,
      color: "text-[#7c3aed] bg-[#f5f3ff]",
      href: "/leaderboard",
    },
    {
      id: "monthly-bonus",
      title: "মাসিক বোনাস",
      subtitle: "অতিরিক্ত ইনকাম",
      icon: CalendarDays,
      color: "text-[#ec4899] bg-[#fdf2f8]",
      href: "/monthly-salary",
    },
    {
      id: "digonto-level",
      title: "দিগন্ত স্তর",
      subtitle: "সুবিধাজনক প্ল্যান",
      icon: Crown,
      color: "text-[#d97706] bg-[#fffbeb]",
      href: "/packages",
    },
    {
      id: "referral",
      title: "রেফারেল",
      subtitle: "বন্ধুদের আমন্ত্রণ",
      icon: Users,
      color: "text-[#ea580c] bg-[#fff7ed]",
      href: "/referral",
    },
    {
      id: "icash",
      title: "I Cash",
      subtitle: "সহজ পেমেন্ট সল্যুশন",
      icon: Wallet,
      color: "text-[#2563eb] bg-[#eff6ff]",
      href: "/icash",
    },
    {
      id: "gift-code",
      title: "গিফট কোড",
      subtitle: "কোড ব্যবহার করুন",
      icon: Gift,
      color: "text-[#059669] bg-[#ecfdf5]",
      onClick: () => {
        setGiftSuccess(null);
        setGiftError("");
        setGiftModalOpen(true);
      },
    },
    {
      id: "content-writing",
      title: "কন্টেন্ট রাইটিং",
      subtitle: "লিখে আয় করুন",
      icon: PenTool,
      color: "text-[#8b5cf6] bg-[#f5f3ff]",
      href: "/content-writing",
    },
    {
      id: "video-content",
      title: "ভিডিও কনটেন্ট",
      subtitle: "দিগন্তের জন্য ভিডিও বানিয়ে আয়",
      icon: Video,
      color: "text-[#dc2626] bg-[#fef2f2]",
      href: "/video-content",
    },
    {
      id: "offerwall",
      title: "অফারওয়াল ও সার্ভে",
      subtitle: "বেশি কাজ, বেশি আয়",
      icon: FileCheck,
      color: "text-[#059669] bg-[#ecfdf5]",
      href: "/offerwall",
    },
    {
      id: "article-reading",
      title: "আর্টিকেল পড়া",
      subtitle: "পড়ে আয় করুন",
      icon: BookOpen,
      color: "text-[#0284c7] bg-[#f0f9ff]",
      href: "/articles",
    },
    {
      id: "captcha",
      title: "ক্যাপচা সলভিং",
      subtitle: "Upcoming",
      badge: "Upcoming",
      icon: ScanLine,
      color: "text-[#e11d48] bg-[#fff1f2]",
      onClick: () => setUpcomingModalOpen(true),
    },
  ];

  return (
    <div className="w-full relative">
      {/* Toast feedback for daily bonus */}
      {dailyBonusMsg && (
        <div className="mb-3 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-2xl flex items-center justify-between text-xs font-bold shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{dailyBonusMsg}</span>
          </div>
          <button onClick={() => setDailyBonusMsg(null)}>
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 5 Column Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 sm:gap-2">
        {actions.map((item) => {
          const IconComp = item.icon;

          if (item.href) {
            return (
              <Link
                key={item.id}
                href={item.href}
                className="bg-white rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-md hover:border-slate-200 active:scale-95 transition-all group min-h-[92px] relative overflow-hidden"
              >
                {item.badge && (
                  <span className="absolute top-1 right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[7.5px] font-black px-1.5 py-0.2 rounded-full shadow-xs tracking-tight">
                    {item.badge}
                  </span>
                )}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 ${item.color}`}
                >
                  <IconComp className="w-5 h-5 stroke-[2.2]" />
                </div>
                <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight line-clamp-1">
                  {item.title}
                </span>
                <span className="text-[9px] sm:text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                  {item.subtitle}
                </span>
              </Link>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              onClick={item.onClick}
              className="bg-white rounded-xl p-2 flex flex-col items-center justify-center text-center shadow-[0_1px_4px_rgba(0,0,0,0.03)] border border-slate-100 hover:shadow-md hover:border-slate-200 active:scale-95 transition-all group min-h-[92px] relative overflow-hidden cursor-pointer"
            >
              {item.badge && (
                <span className="absolute top-1 right-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[7.5px] font-black px-1.5 py-0.2 rounded-full shadow-xs tracking-tight">
                  {item.badge}
                </span>
              )}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105 ${item.color}`}
              >
                <IconComp className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-800 leading-tight line-clamp-1">
                {item.title}
              </span>
              <span className="text-[9px] sm:text-[10px] text-rose-500 font-bold leading-tight mt-0.5 line-clamp-1">
                {item.subtitle}
              </span>
            </button>
          );
        })}
      </div>

      {/* Upcoming Feature Modal */}
      {upcomingModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setUpcomingModalOpen(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl animate-in zoom-in-95 border border-slate-100 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setUpcomingModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Glowing Icon */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-100 to-pink-50 text-rose-600 flex items-center justify-center mx-auto shadow-inner border border-rose-200">
              <ScanLine className="w-8 h-8 stroke-[2.2] animate-pulse" />
            </div>

            {/* Content */}
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 border border-rose-200 px-3 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide">
                <Clock className="w-3.5 h-3.5" />
                <span>Upcoming</span>
              </div>
              <h3 className="text-lg font-black text-slate-900 font-bengali">
                ক্যাপচা সলভিং
              </h3>
              <p className="text-xs text-slate-600 font-bengali leading-relaxed pt-1">
                এই ফিচারটি বর্তমানে ডেভেলপমেন্টে রয়েছে। খুব শীঘ্রই এটি সবার কাজের সুবিধার জন্য উন্মুক্ত করা হবে!
              </p>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setUpcomingModalOpen(false)}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-xs shadow-md hover:shadow-rose-500/25 active:scale-98 transition-all cursor-pointer"
              >
                ঠিক আছে
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gift Code Modal */}
      {giftModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-3 text-slate-800">
              <div className="flex items-center gap-2">
                <Gift className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-sm">গিফট কোড ব্যবহার করুন</h3>
              </div>
              <button
                onClick={() => setGiftModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {giftSuccess ? (
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-800">{giftSuccess}</p>
                <button
                  type="button"
                  onClick={() => setGiftModalOpen(false)}
                  className="w-full py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl mt-2"
                >
                  ঠিক আছে
                </button>
              </div>
            ) : (
              <form onSubmit={handleGiftCodeSubmit} className="space-y-3">
                <p className="text-xs text-slate-600">
                  দিগন্ত প্রমো কোড বা ভাউচার লিখে রিডিম বাটনে চাপ দিন। (ট্রাই করুন: <strong>DIGONTO</strong>)
                </p>

                <input
                  type="text"
                  required
                  placeholder="যেমন: DIGONTO"
                  value={giftCodeInput}
                  onChange={(e) => setGiftCodeInput(e.target.value)}
                  className="w-full p-2.5 text-xs font-mono uppercase font-bold rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />

                {giftError && <p className="text-[11px] text-rose-600 font-bold">{giftError}</p>}

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setGiftModalOpen(false)}
                    className="py-2.5 rounded-xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow"
                  >
                    রিডিম করুন
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
