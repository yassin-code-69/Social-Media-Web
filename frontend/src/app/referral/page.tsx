"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  UserPlus,
  Wallet,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Crown,
  Target,
  Shield,
  Zap,
  MessageCircle,
  Link2,
  DollarSign,
  BadgeCheck,
  CircleDollarSign,
  Rocket,
} from "lucide-react";

// How it works steps
const STEPS = [
  {
    step: 1,
    title: "লিঙ্ক শেয়ার করুন",
    desc: "আপনার বিশেষ রেফারেল লিঙ্ক বা কোড বন্ধুদের পাঠান।",
    icon: Share2,
    color: "from-[#0b2654] to-[#1e5eb3]",
  },
  {
    step: 2,
    title: "বন্ধু রেজিস্টার করুক",
    desc: "তারা আপনার লিঙ্ক দিয়ে রেজিস্ট্রেশন ও প্যাকেজ কিনুক।",
    icon: UserPlus,
    color: "from-[#1e5eb3] to-[#0284c7]",
  },
  {
    step: 3,
    title: "তাৎক্ষণিক বোনাস পান",
    desc: "তাদের প্যাকেজ কেনার সাথে সাথেই আপনার ওয়ালেটে বোনাস জমা!",
    icon: CircleDollarSign,
    color: "from-[#059669] to-[#10b981]",
  },
];

// Referral Tier Levels
const REFERRAL_TIERS = [
  {
    level: 1,
    name: "স্টার্টার",
    minRefs: 0,
    maxRefs: 4,
    bonus: "৳২০",
    perRef: "৳২০/জন",
    color: "from-slate-400 to-slate-500",
    textColor: "text-slate-600",
    bgLight: "bg-slate-50",
    borderColor: "border-slate-200",
  },
  {
    level: 2,
    name: "ব্রোঞ্জ",
    minRefs: 5,
    maxRefs: 14,
    bonus: "৳২৫",
    perRef: "৳২৫/জন",
    color: "from-amber-700 to-amber-800",
    textColor: "text-amber-700",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  {
    level: 3,
    name: "সিলভার",
    minRefs: 15,
    maxRefs: 29,
    bonus: "৳৩৫",
    perRef: "৳৩৫/জন",
    color: "from-slate-300 to-slate-500",
    textColor: "text-slate-500",
    bgLight: "bg-slate-50",
    borderColor: "border-slate-300",
  },
  {
    level: 4,
    name: "গোল্ড",
    minRefs: 30,
    maxRefs: 49,
    bonus: "৳৫০",
    perRef: "৳৫০/জন",
    color: "from-amber-500 to-yellow-500",
    textColor: "text-amber-600",
    bgLight: "bg-amber-50",
    borderColor: "border-amber-300",
  },
  {
    level: 5,
    name: "ডায়মন্ড",
    minRefs: 50,
    maxRefs: Infinity,
    bonus: "৳১০০",
    perRef: "৳১০০/জন",
    color: "from-sky-400 to-cyan-500",
    textColor: "text-sky-600",
    bgLight: "bg-sky-50",
    borderColor: "border-sky-300",
  },
];

export default function ReferralPage() {
  const { profile, referrals } = useMockStore();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "team" | "tiers">("overview");

  const referralLink = `https://digonto.com/register?ref=${profile.referralCode}`;
  const activeRefs = referrals.filter((r) => r.status === "ACTIVE");
  const totalEarned = referrals.reduce((acc, r) => acc + r.reward, 0);
  const paidRefs = referrals.filter((r) => r.hasPaidPackage);

  // Current tier
  const currentTier = REFERRAL_TIERS.find(
    (t) => referrals.length >= t.minRefs && referrals.length <= t.maxRefs
  ) || REFERRAL_TIERS[0];
  const nextTier = REFERRAL_TIERS.find((t) => t.level === currentTier.level + 1);
  const progressToNext = nextTier
    ? Math.min(100, ((referrals.length - currentTier.minRefs) / (nextTier.minRefs - currentTier.minRefs)) * 100)
    : 100;

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

  const handleShareWhatsApp = () => {
    const msg = encodeURIComponent(
      `🌟 দিগন্তে যোগ দিন এবং ঘরে বসেই আয় করুন!\n\nআমার রেফারেল কোড: ${profile.referralCode}\n\n👉 রেজিস্টার করুন: ${referralLink}`
    );
    window.open(`https://wa.me/?text=${msg}`, "_blank");
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#dff0f8] text-slate-800 flex flex-col font-hind selection:bg-[#0284c7] selection:text-white">
      <Header />

      <main className="max-w-lg w-full mx-auto bg-[#eaf5fa] min-h-[calc(100vh-64px)] shadow-2xl border-x border-slate-200/50 flex flex-col pb-28">

        {/* ─── HERO SECTION ─── */}
        <section className="bg-gradient-to-b from-[#071b3b] via-[#0b2654] to-[#143e79] text-white px-5 pt-5 pb-6 rounded-b-3xl shadow-lg relative overflow-hidden">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 space-y-3 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold tracking-wide">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>REFER & EARN</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow">
              রেফার করুন, আয় করুন
            </h1>
            <p className="text-xs text-sky-100/80 max-w-xs mx-auto leading-relaxed">
              বন্ধুদের আমন্ত্রণ জানান, তারা প্যাকেজ কিনলে আপনি পান <span className="text-amber-300 font-black">৳২০ থেকে ৳১০০</span> পর্যন্ত বোনাস!
            </p>

            {/* ── REFERRAL CODE CARD ── */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 space-y-3 text-left max-w-sm mx-auto">
              {/* Code Row */}
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-sky-200 font-medium block">আপনার রেফারেল কোড</span>
                  <span className="text-xl font-black text-amber-300 font-inter tracking-[0.25em]">
                    {profile.referralCode}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
                    copiedCode
                      ? "bg-emerald-500 text-white"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                >
                  {copiedCode ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? "কপি হয়েছে!" : "কোড কপি"}</span>
                </button>
              </div>

              {/* Link Row */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <Link2 className="w-3.5 h-3.5 text-sky-300 shrink-0" />
                  <span className="text-[11px] text-sky-100 truncate font-mono">{referralLink}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                    copiedLink
                      ? "bg-emerald-500 text-white"
                      : "bg-amber-400 hover:bg-amber-300 text-slate-950"
                  }`}
                >
                  {copiedLink ? <CheckCircle2 className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
                  <span>{copiedLink ? "কপি!" : "লিঙ্ক কপি"}</span>
                </button>
              </div>

              {/* Share Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="py-2.5 rounded-xl bg-[#25D366] hover:bg-[#22c55e] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp এ শেয়ার</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareFacebook}
                  className="py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#166fe5] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Facebook এ শেয়ার</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ─── STATS CARDS ─── */}
        <div className="px-4 -mt-4 relative z-20">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-[#0b2654]/10 flex items-center justify-center mb-1.5">
                <Users className="w-4.5 h-4.5 text-[#0b2654]" />
              </div>
              <span className="text-lg font-black font-inter text-[#0b2654] leading-none">{referrals.length}</span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">মোট রেফারেল</span>
            </div>

            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center mb-1.5">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
              </div>
              <span className="text-lg font-black font-inter text-emerald-600 leading-none">{activeRefs.length}</span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">সক্রিয় সদস্য</span>
            </div>

            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 flex flex-col items-center text-center">
              <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center mb-1.5">
                <DollarSign className="w-4.5 h-4.5 text-amber-600" />
              </div>
              <span className="text-lg font-black font-inter text-amber-600 leading-none">৳{totalEarned}</span>
              <span className="text-[10px] text-slate-400 font-medium mt-1">রেফার আয়</span>
            </div>
          </div>
        </div>

        {/* ─── NAVIGATION TABS ─── */}
        <div className="px-4 mt-3">
          <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-2xl shadow-sm border border-slate-200/80">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "overview"
                  ? "bg-[#0b2654] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>ওভারভিউ</span>
            </button>
            <button
              onClick={() => setActiveTab("team")}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "team"
                  ? "bg-[#0b2654] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>আমার টিম ({referrals.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("tiers")}
              className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "tiers"
                  ? "bg-[#0b2654] text-white shadow-md"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>টিয়ার লেভেল</span>
            </button>
          </div>
        </div>

        {/* ═══ TAB 1: OVERVIEW ═══ */}
        {activeTab === "overview" && (
          <div className="px-4 py-4 space-y-4">

            {/* Current Tier Progress Card */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentTier.color} flex items-center justify-center shadow`}>
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-800 block">বর্তমান টিয়ার: {currentTier.name}</span>
                    <span className="text-[10px] text-slate-400">প্রতি রেফারেলে {currentTier.perRef}</span>
                  </div>
                </div>
                <span className={`text-xs font-black px-2 py-1 rounded-lg ${currentTier.bgLight} ${currentTier.textColor} border ${currentTier.borderColor}`}>
                  লেভেল {currentTier.level}
                </span>
              </div>

              {nextTier && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">
                      পরবর্তী: <strong className="text-slate-800">{nextTier.name}</strong> ({nextTier.perRef})
                    </span>
                    <span className="text-slate-500 font-mono">
                      {referrals.length}/{nextTier.minRefs} জন
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${currentTier.color} transition-all duration-500`}
                      style={{ width: `${progressToNext}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400">
                    আরো {nextTier.minRefs - referrals.length} জন রেফার করলে {nextTier.name} লেভেলে আপগ্রেড হবেন
                  </span>
                </div>
              )}
            </div>

            {/* HOW IT WORKS */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Target className="w-4.5 h-4.5 text-[#1e5eb3]" />
                <h3 className="font-bold text-xs text-slate-800">কীভাবে কাজ করে?</h3>
              </div>

              <div className="space-y-3">
                {STEPS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.step} className="flex items-start gap-3">
                      <div className={`shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="pt-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400">ধাপ {s.step}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 leading-tight">{s.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Earning Breakdown */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
                <h3 className="font-bold text-xs text-slate-800">আয়ের বিস্তারিত</h3>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 bg-emerald-50/60 rounded-xl border border-emerald-100">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-medium text-slate-700">পেইড রেফারেল বোনাস</span>
                  </div>
                  <span className="text-sm font-black font-inter text-emerald-700">৳{paidRefs.reduce((a, r) => a + r.reward, 0)}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-sky-50/60 rounded-xl border border-sky-100">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-medium text-slate-700">পেইড প্যাকেজ সদস্য</span>
                  </div>
                  <span className="text-sm font-black font-inter text-sky-700">{paidRefs.length} জন</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-medium text-slate-700">অপেক্ষমাণ (ফ্রি ইউজার)</span>
                  </div>
                  <span className="text-sm font-black font-inter text-amber-700">{referrals.length - paidRefs.length} জন</span>
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] rounded-2xl p-4 text-white shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-sm">আরও বেশি আয় করুন!</h3>
              </div>
              <p className="text-[11px] text-sky-100/90 leading-relaxed mb-3">
                আপনার রেফারেল লিঙ্ক যত বেশি শেয়ার করবেন, তত বেশি প্যাসিভ ইনকাম আসবে। প্রতি পেইড রেফারেলে গ্যারান্টেড ক্যাশ বোনাস!
              </p>
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>এখনই বন্ধুদের আমন্ত্রণ জানান</span>
              </button>
            </div>
          </div>
        )}

        {/* ═══ TAB 2: MY TEAM ═══ */}
        {activeTab === "team" && (
          <div className="px-4 py-4 space-y-3">
            {/* Team Header */}
            <div className="flex items-center justify-between px-1">
              <h2 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#1e5eb3]" />
                <span>আমন্ত্রিত সদস্যদের তালিকা</span>
              </h2>
              <span className="text-[10px] text-slate-400 font-medium">{referrals.length} জন</span>
            </div>

            {referrals.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200/80 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-sky-50 mx-auto flex items-center justify-center">
                  <UserPlus className="w-8 h-8 text-sky-300" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">এখনও কোনো রেফারেল নেই</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  আপনার রেফারেল লিঙ্ক শেয়ার করে প্রথম রেফারেল আনুন এবং বোনাস জিতে নিন!
                </p>
                <button
                  type="button"
                  onClick={handleShareWhatsApp}
                  className="mx-auto px-5 py-2 rounded-xl bg-[#0b2654] text-white font-bold text-xs shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>এখনই শেয়ার করুন</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {referrals.map((item, idx) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-100 flex items-center justify-between hover:border-slate-200 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Numbered Avatar */}
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm ${
                          item.hasPaidPackage
                            ? "bg-gradient-to-br from-[#0b2654] to-[#1e5eb3] text-white"
                            : "bg-slate-100 text-slate-500"
                        }`}>
                          {item.name.slice(0, 1)}
                        </div>
                        {item.hasPaidPackage && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-slate-800">{item.name}</span>
                          {item.hasPaidPackage && (
                            <span className="text-[8px] font-bold px-1 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              পেইড
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                          যোগদান: {item.joinDate}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      {item.reward > 0 ? (
                        <span className="text-sm font-black font-inter text-emerald-600">+৳{item.reward}</span>
                      ) : (
                        <span className="text-xs font-bold text-slate-400">৳০</span>
                      )}
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${
                          item.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        {item.status === "ACTIVE" ? "● সক্রিয়" : "○ অপেক্ষমান"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Invite More CTA */}
            <div className="bg-sky-50 rounded-2xl p-4 border border-sky-100 flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-800">আরো বন্ধুদের আমন্ত্রণ জানান</h4>
                <p className="text-[10px] text-slate-500">প্রতি পেইড রেফারেলে ক্যাশ বোনাস নিশ্চিত</p>
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className="shrink-0 px-3 py-2 rounded-xl bg-[#0b2654] text-white font-bold text-xs shadow flex items-center gap-1 cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>লিঙ্ক কপি</span>
              </button>
            </div>
          </div>
        )}

        {/* ═══ TAB 3: TIERS ═══ */}
        {activeTab === "tiers" && (
          <div className="px-4 py-4 space-y-4">
            {/* Tiers Header */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <Crown className="w-4.5 h-4.5 text-amber-500" />
                <h3 className="font-bold text-xs text-slate-800">রেফারেল টিয়ার সিস্টেম</h3>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                বেশি রেফার করলে আপনার টিয়ার লেভেল বাড়বে এবং প্রতি রেফারেলে আরো বেশি বোনাস পাবেন!
              </p>
            </div>

            {/* Tier Cards */}
            <div className="space-y-2.5">
              {REFERRAL_TIERS.map((tier) => {
                const isCurrent = tier.level === currentTier.level;
                const isLocked = tier.level > currentTier.level;

                return (
                  <div
                    key={tier.level}
                    className={`rounded-2xl p-4 border transition-all ${
                      isCurrent
                        ? `bg-gradient-to-r ${tier.color} text-white shadow-md border-transparent`
                        : isLocked
                        ? "bg-white border-slate-100 opacity-70"
                        : "bg-white border-emerald-200 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ${
                          isCurrent
                            ? "bg-white/20"
                            : isLocked
                            ? "bg-slate-100"
                            : `bg-gradient-to-br ${tier.color}`
                        }`}>
                          {isLocked ? (
                            <Shield className="w-5 h-5 text-slate-400" />
                          ) : (
                            <Crown className={`w-5 h-5 ${isCurrent ? "text-white" : "text-white"}`} />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className={`text-sm font-black ${isCurrent ? "text-white" : isLocked ? "text-slate-600" : "text-slate-800"}`}>
                              {tier.name}
                            </span>
                            {isCurrent && (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-white/30 text-white">
                                বর্তমান
                              </span>
                            )}
                            {!isCurrent && !isLocked && (
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                                ✓ অর্জিত
                              </span>
                            )}
                          </div>
                          <span className={`text-[11px] font-medium ${isCurrent ? "text-white/80" : "text-slate-400"}`}>
                            {tier.minRefs === 0 ? "০" : tier.minRefs}+ রেফারেল প্রয়োজন
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-lg font-black font-inter block ${
                          isCurrent ? "text-white" : isLocked ? "text-slate-500" : "text-emerald-600"
                        }`}>
                          {tier.bonus}
                        </span>
                        <span className={`text-[10px] font-medium ${isCurrent ? "text-white/70" : "text-slate-400"}`}>
                          প্রতি রেফারেল
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Motivation CTA */}
            <div className="bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] rounded-2xl p-4 text-white shadow-md text-center space-y-2">
              <Award className="w-8 h-8 text-amber-400 mx-auto" />
              <h3 className="font-black text-sm">ডায়মন্ড লেভেলে পৌঁছান!</h3>
              <p className="text-[11px] text-sky-100/90 max-w-xs mx-auto leading-relaxed">
                ৫০+ রেফারেল আনলে প্রতি রেফারেলে <strong className="text-amber-300">৳১০০</strong> বোনাস পাবেন — এটাই সর্বোচ্চ টিয়ার!
              </p>
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className="mx-auto px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>এখনই শুরু করুন</span>
              </button>
            </div>
          </div>
        )}

      </main>

      <BottomNav />
    </div>
  );
}
