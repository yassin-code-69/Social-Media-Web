"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";
import { leaderboardApi } from "@/lib/api-client";
import {
  Trophy,
  Medal,
  Crown,
  Flame,
  TrendingUp,
  Star,
  Users,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Award,
  Target,
  Zap,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

// --- Mock Leaderboard Data ---
interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  phone: string;
  avatar: string;
  packageName: string;
  totalEarned: number;
  completedTasks: number;
  referrals: number;
  badge?: string;
  isCurrentUser?: boolean;
}

// Leaderboard dynamic data mapping


// Period tab configs
const PERIOD_TABS = [
  { key: "daily", label: "আজকে", icon: Flame },
  { key: "weekly", label: "সাপ্তাহিক", icon: TrendingUp },
  { key: "monthly", label: "মাসিক", icon: BarChart3 },
  { key: "alltime", label: "সর্বকালীন", icon: Trophy },
] as const;

// Podium Rank Styling
const getRankStyle = (rank: number) => {
  switch (rank) {
    case 1:
      return {
        ringColor: "ring-amber-400",
        bgGradient: "from-amber-400 via-yellow-300 to-amber-500",
        badgeBg: "bg-amber-500",
        badgeText: "text-white",
        crownColor: "text-amber-400",
        glowShadow: "shadow-[0_0_20px_rgba(245,158,11,0.4)]",
        label: "১ম",
        size: "w-20 h-20",
        rankBadgeSize: "w-7 h-7 text-xs",
      };
    case 2:
      return {
        ringColor: "ring-slate-300",
        bgGradient: "from-slate-300 via-gray-200 to-slate-400",
        badgeBg: "bg-slate-400",
        badgeText: "text-white",
        crownColor: "text-slate-400",
        glowShadow: "shadow-[0_0_15px_rgba(148,163,184,0.3)]",
        label: "২য়",
        size: "w-16 h-16",
        rankBadgeSize: "w-6 h-6 text-[10px]",
      };
    case 3:
      return {
        ringColor: "ring-amber-700",
        bgGradient: "from-amber-700 via-orange-600 to-amber-800",
        badgeBg: "bg-amber-700",
        badgeText: "text-white",
        crownColor: "text-amber-700",
        glowShadow: "shadow-[0_0_15px_rgba(180,83,9,0.3)]",
        label: "৩য়",
        size: "w-16 h-16",
        rankBadgeSize: "w-6 h-6 text-[10px]",
      };
    default:
      return {
        ringColor: "ring-slate-200",
        bgGradient: "from-slate-200 to-slate-300",
        badgeBg: "bg-slate-200",
        badgeText: "text-slate-700",
        crownColor: "text-slate-400",
        glowShadow: "",
        label: `${rank}`,
        size: "w-10 h-10",
        rankBadgeSize: "w-5 h-5 text-[9px]",
      };
  }
};

export default function LeaderboardPage() {
  const { profile } = useMockStore();
  const [activePeriod, setActivePeriod] = useState<string>("weekly");
  const [liveUsers, setLiveUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    leaderboardApi
      .getLeaderboard()
      .then((res: any) => {
        const data = Array.isArray(res) ? res : res?.data || [];
        if (Array.isArray(data)) {
          const mapped: LeaderboardEntry[] = data.map((u: any, idx: number) => ({
            id: u.id || `lb_${idx}`,
            rank: idx + 1,
            name: u.name || "মেম্বার",
            phone: u.phone || "017********",
            avatar: u.avatar || "",
            packageName: u.packageName || "সদস্য",
            totalEarned: Number(u.totalEarned || 0),
            completedTasks: Number(u.completedTasks || 0),
            referrals: Number(u.referrals || 0),
            badge: idx === 0 ? "🏆 চ্যাম্পিয়ন" : idx === 1 ? "🥈 রানার-আপ" : idx === 2 ? "🥉 ৩য় স্থান" : undefined,
            isCurrentUser: (profile?.phone && u.phone && u.phone.replace(/\*/g, "") === (profile.phone.slice(0, 5) + profile.phone.slice(-2))) || (profile?.id && u.id === profile.id),
          }));
          setLiveUsers(mapped);
        }
      })
      .catch((err) => console.error("Failed to load leaderboard:", err))
      .finally(() => setLoading(false));
  }, [profile]);

  const leaderboard = useMemo(() => {
    if (liveUsers.length > 0) return liveUsers;
    if (profile?.name) {
      return [
        {
          id: profile.id || "me",
          rank: 1,
          name: profile.name,
          phone: profile.phone ? `${profile.phone.slice(0, 5)}***${profile.phone.slice(-2)}` : "017********",
          avatar: profile.avatar || "",
          packageName: profile.packageName || "সদস্য",
          totalEarned: profile.totalEarned || profile.balance || 0,
          completedTasks: profile.completedTasksCount || 0,
          referrals: 0,
          badge: "🏆 লিডার",
          isCurrentUser: true,
        },
      ];
    }
    return [];
  }, [liveUsers, profile]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);
  const currentUserEntry = leaderboard.find((e) => e.isCurrentUser);

  // Stats for header
  const totalEarnings = leaderboard.reduce((sum, e) => sum + e.totalEarned, 0);
  const totalTasks = leaderboard.reduce((sum, e) => sum + e.completedTasks, 0);

  return (
    <div className="min-h-screen bg-[#dff0f8] text-slate-800 flex flex-col font-hind selection:bg-[#0284c7] selection:text-white">
      <Header />

      <main className="max-w-lg w-full mx-auto bg-[#eaf5fa] min-h-[calc(100vh-64px)] shadow-2xl border-x border-slate-200/50 flex flex-col pb-28">

        {/* Hero Section — Deep Navy Gradient */}
        <section className="bg-gradient-to-b from-[#071b3b] via-[#0b2654] to-[#143e79] text-white px-5 pt-5 pb-8 rounded-b-3xl shadow-lg relative overflow-hidden">
          {/* Decorative Glows */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-amber-400/8 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-36 h-36 bg-sky-400/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4 text-center">
            {/* Tag Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-bold tracking-wide">
              <Trophy className="w-3.5 h-3.5 text-amber-400" />
              <span>DIGONTO LEADERBOARD</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow">
              লিডারবোর্ড
            </h1>
            <p className="text-xs text-sky-100/80 max-w-xs mx-auto leading-relaxed">
              দিগন্তের সেরা আর্নারদের তালিকা। টপে উঠুন, ব্যাজ জিতুন!
            </p>

            {/* Period Filter Tabs */}
            <div className="grid grid-cols-4 gap-1 bg-white/10 backdrop-blur-sm p-1 rounded-2xl border border-white/10 max-w-sm mx-auto">
              {PERIOD_TABS.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActivePeriod(tab.key)}
                    className={`py-2 text-[11px] font-bold rounded-xl transition-all flex flex-col items-center gap-0.5 cursor-pointer ${
                      activePeriod === tab.key
                        ? "bg-white text-[#0b2654] shadow-md"
                        : "text-sky-200 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* ─── TOP 3 PODIUM ─── */}
            <div className="flex items-end justify-center gap-3 pt-4 pb-2">
              {/* 2nd Place (Left, Shorter) */}
              <div className="flex flex-col items-center gap-1.5 -mb-1">
                <div className={`relative ${getRankStyle(2).size} rounded-full ring-[3px] ${getRankStyle(2).ringColor} ${getRankStyle(2).glowShadow} overflow-hidden`}>
                  <img
                    src={top3[1]?.avatar}
                    alt={top3[1]?.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 ${getRankStyle(2).rankBadgeSize} rounded-full ${getRankStyle(2).badgeBg} ${getRankStyle(2).badgeText} font-black flex items-center justify-center shadow`}>
                    ২
                  </div>
                </div>
                <span className="text-[11px] font-bold text-sky-100 max-w-[70px] truncate text-center">{top3[1]?.name}</span>
                <span className="text-[10px] font-black text-amber-300">৳ {top3[1]?.totalEarned.toFixed(0)}</span>
                <div className="w-14 h-16 bg-gradient-to-t from-slate-400/40 to-slate-300/20 rounded-t-lg border border-white/10 flex items-center justify-center">
                  <Medal className="w-5 h-5 text-slate-300" />
                </div>
              </div>

              {/* 1st Place (Center, Tallest) */}
              <div className="flex flex-col items-center gap-1.5 -mb-1 z-10">
                <Crown className="w-6 h-6 text-amber-400 animate-pulse -mb-1" />
                <div className={`relative ${getRankStyle(1).size} rounded-full ring-[4px] ${getRankStyle(1).ringColor} ${getRankStyle(1).glowShadow} overflow-hidden`}>
                  <img
                    src={top3[0]?.avatar}
                    alt={top3[0]?.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 ${getRankStyle(1).rankBadgeSize} rounded-full ${getRankStyle(1).badgeBg} ${getRankStyle(1).badgeText} font-black flex items-center justify-center shadow-lg`}>
                    ১
                  </div>
                </div>
                <span className="text-xs font-bold text-white max-w-[80px] truncate text-center">{top3[0]?.name}</span>
                <span className="text-xs font-black text-amber-300">৳ {top3[0]?.totalEarned.toFixed(0)}</span>
                <div className="w-16 h-24 bg-gradient-to-t from-amber-500/40 to-amber-400/15 rounded-t-lg border border-amber-400/30 flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-amber-400" />
                </div>
              </div>

              {/* 3rd Place (Right, Shortest) */}
              <div className="flex flex-col items-center gap-1.5 -mb-1">
                <div className={`relative ${getRankStyle(3).size} rounded-full ring-[3px] ${getRankStyle(3).ringColor} ${getRankStyle(3).glowShadow} overflow-hidden`}>
                  <img
                    src={top3[2]?.avatar}
                    alt={top3[2]?.name}
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 ${getRankStyle(3).rankBadgeSize} rounded-full ${getRankStyle(3).badgeBg} ${getRankStyle(3).badgeText} font-black flex items-center justify-center shadow`}>
                    ৩
                  </div>
                </div>
                <span className="text-[11px] font-bold text-sky-100 max-w-[70px] truncate text-center">{top3[2]?.name}</span>
                <span className="text-[10px] font-black text-amber-300">৳ {top3[2]?.totalEarned.toFixed(0)}</span>
                <div className="w-14 h-12 bg-gradient-to-t from-amber-700/30 to-amber-600/10 rounded-t-lg border border-amber-700/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Stats Strip */}
        <div className="px-4 -mt-4 relative z-20">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 p-3 grid grid-cols-3 gap-2">
            <div className="text-center">
              <span className="text-lg font-black font-inter text-[#0b2654] block">{leaderboard.length}</span>
              <span className="text-[10px] text-slate-500 font-medium">মোট সদস্য</span>
            </div>
            <div className="text-center border-x border-slate-100">
              <span className="text-lg font-black font-inter text-emerald-600 block">৳ {totalEarnings.toFixed(0)}</span>
              <span className="text-[10px] text-slate-500 font-medium">মোট আয়</span>
            </div>
            <div className="text-center">
              <span className="text-lg font-black font-inter text-[#1e5eb3] block">{totalTasks}</span>
              <span className="text-[10px] text-slate-500 font-medium">সম্পন্ন কাজ</span>
            </div>
          </div>
        </div>

        {/* ─── YOUR RANK HIGHLIGHT ─── */}
        {currentUserEntry && (
          <div className="px-4 mt-3">
            <div className="bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] rounded-2xl p-3.5 shadow-md flex items-center justify-between gap-3 border border-sky-400/20">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full ring-2 ring-amber-400 overflow-hidden shrink-0 bg-[#0b2654] flex items-center justify-center text-white font-bold text-sm">
                  {currentUserEntry.avatar ? (
                    <img
                      src={currentUserEntry.avatar}
                      alt={currentUserEntry.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{(currentUserEntry.name || "U").charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="text-white">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black">{currentUserEntry.name}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">আপনি</span>
                  </div>
                  <span className="text-[11px] text-sky-200 font-medium">
                    {currentUserEntry.packageName} • {currentUserEntry.completedTasks} টাস্ক সম্পন্ন
                  </span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className="w-10 h-10 rounded-xl bg-amber-400/20 border border-amber-400/40 flex flex-col items-center justify-center">
                  <span className="text-xs font-black text-amber-300">#{currentUserEntry.rank}</span>
                  <span className="text-[8px] text-sky-200 font-bold">র‍্যাংক</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── FULL RANKED LIST ─── */}
        <div className="px-4 mt-4 space-y-2 pb-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-[#1e5eb3]" />
              <span>সম্পূর্ণ লিডারবোর্ড</span>
            </h2>
            <span className="text-[10px] text-slate-400 font-medium">
              {activePeriod === "daily" ? "আজকে" : activePeriod === "weekly" ? "এই সপ্তাহ" : activePeriod === "monthly" ? "এই মাস" : "সর্বকালীন"}
            </span>
          </div>

          {leaderboard.map((entry) => {
            const isTop3 = entry.rank <= 3;
            const isMe = entry.isCurrentUser;

            return (
              <div
                key={entry.id}
                className={`flex items-center gap-3 p-3 rounded-2xl border transition-all ${
                  isMe
                    ? "bg-sky-50 border-sky-200 ring-1 ring-sky-300/50 shadow-sm"
                    : isTop3
                    ? "bg-white border-amber-100 shadow-sm"
                    : "bg-white border-slate-100 hover:border-slate-200"
                }`}
              >
                {/* Rank Number */}
                <div
                  className={`shrink-0 flex items-center justify-center rounded-xl font-black ${
                    entry.rank === 1
                      ? "w-9 h-9 bg-gradient-to-br from-amber-400 to-yellow-500 text-white text-sm shadow-md"
                      : entry.rank === 2
                      ? "w-9 h-9 bg-gradient-to-br from-slate-300 to-slate-400 text-white text-sm shadow"
                      : entry.rank === 3
                      ? "w-9 h-9 bg-gradient-to-br from-amber-600 to-orange-700 text-white text-sm shadow"
                      : "w-8 h-8 bg-slate-100 text-slate-600 text-xs"
                  }`}
                >
                  {entry.rank}
                </div>

                <div className={`relative shrink-0 w-10 h-10 rounded-full overflow-hidden ring-2 bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs ${
                  isTop3 ? "ring-amber-300" : isMe ? "ring-sky-400" : "ring-slate-200"
                }`}>
                  {entry.avatar ? (
                    <img
                      src={entry.avatar}
                      alt={entry.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{(entry.name || "U").charAt(0).toUpperCase()}</span>
                  )}
                  {isMe && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-sky-500 border-2 border-white flex items-center justify-center">
                      <Star className="w-2 h-2 text-white fill-white" />
                    </div>
                  )}
                </div>

                {/* Name + Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold truncate ${isMe ? "text-sky-800" : "text-slate-800"}`}>
                      {entry.name}
                    </span>
                    {isMe && (
                      <span className="text-[8px] font-black px-1 py-0.5 rounded bg-sky-100 text-sky-700 border border-sky-200 shrink-0">
                        আপনি
                      </span>
                    )}
                    {entry.badge && (
                      <span className="text-[9px] shrink-0">{entry.badge.split(" ")[0]}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                      <Target className="w-3 h-3" />
                      {entry.completedTasks} কাজ
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-0.5">
                      <Users className="w-3 h-3" />
                      {entry.referrals} রেফ.
                    </span>
                    <span className="text-[9px] text-slate-400 bg-slate-50 px-1 py-0.5 rounded font-medium">
                      {entry.packageName}
                    </span>
                  </div>
                </div>

                {/* Total Earnings */}
                <div className="text-right shrink-0">
                  <span className={`text-sm font-black font-inter block ${
                    entry.rank === 1
                      ? "text-amber-600"
                      : isMe
                      ? "text-sky-700"
                      : "text-emerald-600"
                  }`}>
                    ৳ {entry.totalEarned.toFixed(0)}
                  </span>
                  <span className="text-[9px] text-slate-400 font-medium">মোট আয়</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* How to Climb the Leaderboard Banner */}
        <div className="px-4 mt-3 pb-4">
          <div className="bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] rounded-2xl p-4 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-black text-sm text-white">লিডারবোর্ডে উপরে উঠতে চান?</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 flex items-start gap-2">
                <Zap className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-white block">বেশি টাস্ক করুন</span>
                  <span className="text-[10px] text-sky-200 leading-tight">প্রতিদিন সর্বোচ্চ কাজ সম্পন্ন করুন</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 flex items-start gap-2">
                <Users className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-white block">রেফারেল আনুন</span>
                  <span className="text-[10px] text-sky-200 leading-tight">বন্ধুদের আমন্ত্রণ জানিয়ে বোনাস পান</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 flex items-start gap-2">
                <Crown className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-white block">প্যাকেজ আপগ্রেড</span>
                  <span className="text-[10px] text-sky-200 leading-tight">উচ্চ প্যাকেজে বেশি আয়ের সুযোগ</span>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2.5 border border-white/10 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] font-bold text-white block">ধারাবাহিক থাকুন</span>
                  <span className="text-[10px] text-sky-200 leading-tight">প্রতিদিন লগইন ও স্পিন করুন</span>
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-2 pt-1">
              <Link
                href="/tasks"
                className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow flex items-center gap-1 transition-colors"
              >
                <Target className="w-3.5 h-3.5" />
                <span>টাস্ক শুরু করুন</span>
              </Link>
              <Link
                href="/packages"
                className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/20 text-white font-bold text-xs shadow border border-white/20 flex items-center gap-1 transition-colors"
              >
                <span>প্যাকেজ দেখুন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </main>

      <BottomNav />
    </div>
  );
}
