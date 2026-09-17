"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import {
  Users,
  Copy,
  Share2,
  Gift,
  Award,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";

export default function ReferralPage() {
  const { profile, referrals } = useMockStore();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const referralLink = `https://digonto.com/register?ref=${profile.referralCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(profile.referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        <Header />

        <main className="flex-1 px-3 pt-3 pb-24 flex flex-col gap-3">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-[#064e3b] via-[#065f46] to-[#047857] text-white p-4 rounded-2xl shadow-sm flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-200 font-bold uppercase tracking-wider">
                রেফার করুন ও ইনকাম করুন
              </span>
              <Gift className="w-6 h-6 text-amber-300" />
            </div>

            <h2 className="text-lg font-bold text-white mt-1">
              প্রতি রেফারেলে পান <span className="text-amber-300">৳ ২০</span> পর্যন্ত বোনাস!
            </h2>
            <p className="text-xs text-emerald-100 font-medium mt-0.5">
              আপনার বন্ধুদের দিগন্তে আমন্ত্রণ জানান এবং তাদের প্রতি কাজের কমিশন উপভোগ করুন।
            </p>

            {/* Referral Code & Link Box */}
            <div className="mt-3.5 bg-black/25 p-3 rounded-xl flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] text-emerald-200 font-medium">আপনার রেফার কোড</span>
                  <span className="text-base font-black text-amber-300 font-sans tracking-widest">
                    {profile.referralCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedCode ? "কপি হয়েছে!" : "কোড কপি"}</span>
                </button>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-emerald-100 font-sans truncate max-w-[200px]">
                  {referralLink}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="bg-[#fde047] hover:bg-[#facc15] text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? "লিংক কপি!" : "লিংক শেয়ার"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <Users className="w-5 h-5 text-[#1e5eb3] mb-1" />
              <span className="text-base font-black text-slate-900 font-sans leading-none">
                {referrals.length}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                মোট রেফারেল
              </span>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mb-1" />
              <span className="text-base font-black text-slate-900 font-sans leading-none">
                {referrals.filter((r) => r.status === "ACTIVE").length}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                সক্রিয় সদস্য
              </span>
            </div>

            <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex flex-col items-center text-center">
              <Award className="w-5 h-5 text-amber-500 mb-1" />
              <span className="text-base font-black text-slate-900 font-sans leading-none">
                ৳ {referrals.reduce((acc, r) => acc + r.reward, 0)}
              </span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">
                রেফার আয়
              </span>
            </div>
          </div>

          {/* Referral Team List */}
          <div className="flex items-center justify-between mt-1">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-600" />
              <span>আমন্ত্রিত সদস্যদের তালিকা</span>
            </h3>
            <span className="text-xs text-slate-400">{referrals.length} জন</span>
          </div>

          <div className="flex flex-col gap-2">
            {referrals.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                    {item.name.slice(0, 1)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-sans mt-0.5">
                      যোগদান: {item.joinDate}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-emerald-600 font-sans">
                    +৳ {item.reward}
                  </span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${
                      item.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.status === "ACTIVE" ? "সক্রিয়" : "অপেক্ষমান"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>

        <BottomNav />
      </div>
    </div>
  );
}
