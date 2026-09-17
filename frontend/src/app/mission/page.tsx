"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Crown,
  Check,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  Calendar,
  Gift,
  X,
  RefreshCw,
} from "lucide-react";
import { useMockStore } from "@/lib/mock-store";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function MissionCenterPage() {
  const router = useRouter();
  const {
    profile,
    dailyCheckIn,
    performDailyCheckIn,
    resetDailyCheckInForTest,
    tasks,
    submissions,
  } = useMockStore();

  const [activeTab, setActiveTab] = useState<"in_progress" | "past">("in_progress");
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [justClaimedDay, setJustClaimedDay] = useState<number | null>(null);

  // Premium status check: User must have an active paid package (not "ফ্রি ট্রায়াল")
  const isPremium =
    Boolean(profile.packageName) &&
    !profile.packageName.includes("ফ্রি") &&
    profile.packageStatus === "ACTIVE";

  const todayStr = new Date().toISOString().split("T")[0];
  const isCheckedInToday = dailyCheckIn.lastCheckInDate === todayStr;
  const isStreakFinished = dailyCheckIn.currentDay > 7 || dailyCheckIn.history.length >= 7;

  const handleCheckInClick = () => {
    if (!isPremium) {
      setShowPremiumModal(true);
      return;
    }

    const currentDayTarget = dailyCheckIn.currentDay;
    const result = performDailyCheckIn();

    if (result.success) {
      setJustClaimedDay(currentDayTarget);
      setFeedbackMsg({
        type: "success",
        text: result.message,
      });
      setTimeout(() => {
        setJustClaimedDay(null);
      }, 3000);
    } else {
      setFeedbackMsg({
        type: "error",
        text: result.message,
      });
    }

    setTimeout(() => {
      setFeedbackMsg(null);
    }, 4000);
  };

  // In-progress tasks from mock store (or empty state)
  const inProgressTasks = tasks.slice(0, 0); // Demonstrating the screenshot's empty state or empty active queue
  // Past tasks from submissions or checkin history
  const pastSubmissions = submissions;

  return (
    <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col items-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-md flex flex-col relative pb-20">
        {/* Top Header - Matching Screenshot with Back Arrow & 'মিশন সেন্টার' */}
        <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-100 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Back"
            className="w-9 h-9 rounded-full flex items-center justify-center text-slate-800 hover:bg-slate-100 active:scale-95 transition-all -ml-1"
          >
            <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
          </button>

          <h1 className="text-lg font-bold text-slate-900 tracking-tight font-bengali">
            মিশন সেন্টার
          </h1>

          {/* Right dummy placeholder to keep title centered */}
          <div className="w-9 h-9" />
        </header>

        {/* Feedback Alert Toast */}
        {feedbackMsg && (
          <div
            className={`mx-4 mt-3 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 ${
              feedbackMsg.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {feedbackMsg.type === "success" ? (
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{feedbackMsg.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setFeedbackMsg(null)}
              className="text-slate-400 hover:text-slate-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Premium Status Pill Bar */}
        <div className="mx-4 mt-3">
          {isPremium ? (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-2.5 px-3 flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-900">
                      {profile.packageName} মেম্বার
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.2 rounded-full">
                      সক্রিয়
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    ৭ দিনের ডেইলি লগইন বোনাস উন্মুক্ত
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-white px-2.5 py-1 rounded-xl shadow-2xs border border-amber-100">
                দিন {Math.min(dailyCheckIn.currentDay, 7)}/৭
              </span>
            </div>
          ) : (
            <div
              onClick={() => setShowPremiumModal(true)}
              className="cursor-pointer bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200/70 rounded-2xl p-2.5 px-3 flex items-center justify-between shadow-xs active:scale-[0.99] transition-transform"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-600">
                  <Crown className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-rose-900">
                      শুধুমাত্র প্রিমিয়াম মেম্বারদের জন্য
                    </span>
                  </div>
                  <p className="text-[11px] text-rose-600">
                    প্যাকেজ কিনে ৭ দিনের দৈনিক বোনাস আনলক করুন
                  </p>
                </div>
              </div>
              <Link
                href="/packages"
                onClick={(e) => e.stopPropagation()}
                className="text-[11px] font-bold text-white bg-[#dc2626] hover:bg-[#b91c1c] px-3 py-1 rounded-full shadow-xs flex items-center gap-1"
              >
                <span>কিনুন</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          )}
        </div>

        {/* Top Check-in Card - EXACT Screenshot Match */}
        <div className="mx-4 mt-3 bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          {/* Card Title with Vertical Pink Accent Bar */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-4.5 bg-[#e11d48] rounded-full inline-block" />
            <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">
              Continuous sign in to receive rewards
            </h2>
          </div>

          {/* 7 Days Circles Row */}
          <div className="grid grid-cols-7 gap-1 sm:gap-1.5 items-center justify-items-center mb-5">
            {dailyCheckIn.rewards.map((amount, idx) => {
              const dayNum = idx + 1;
              const isClaimed = dailyCheckIn.history.includes(dayNum);
              const isCurrentDay = dailyCheckIn.currentDay === dayNum && !isCheckedInToday && isPremium;
              const isClaimedJustNow = justClaimedDay === dayNum;

              return (
                <div key={dayNum} className="flex flex-col items-center group">
                  {/* Circle Badge */}
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-center transition-all duration-300 relative ${
                      isClaimed
                        ? "bg-emerald-500 text-white shadow-sm font-bold scale-100"
                        : isClaimedJustNow
                        ? "bg-rose-500 text-white scale-110 shadow-md ring-4 ring-rose-200 font-bold animate-bounce"
                        : isCurrentDay
                        ? "bg-rose-50 text-[#dc2626] ring-2 ring-[#dc2626] shadow-sm font-bold scale-105"
                        : "bg-[#f1f5f9] text-[#64748b] font-medium"
                    }`}
                  >
                    {isClaimed ? (
                      <Check className="w-5 h-5 stroke-[2.8]" />
                    ) : (
                      <span className="text-xs sm:text-[13px] font-bold">
                        ৳{amount}
                      </span>
                    )}

                    {/* Small pulse dot for today's active day */}
                    {isCurrentDay && (
                      <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600" />
                      </span>
                    )}
                  </div>

                  {/* Day Label (e.g. "১ দিন", "২ দিন") */}
                  <span
                    className={`text-[11px] mt-1.5 tracking-tight font-medium font-bengali ${
                      isClaimed
                        ? "text-emerald-700 font-bold"
                        : isCurrentDay
                        ? "text-[#dc2626] font-bold"
                        : "text-slate-500"
                    }`}
                  >
                    {dayNum} দিন
                  </span>
                </div>
              );
            })}
          </div>

          {/* Check-in Action Button */}
          <div className="flex flex-col items-center justify-center">
            {isCheckedInToday ? (
              <button
                type="button"
                disabled
                className="bg-emerald-600/90 text-white font-semibold text-sm px-8 py-2 rounded-full cursor-not-allowed shadow-sm flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>আজ সম্পন্ন (Checked-in)</span>
              </button>
            ) : isStreakFinished ? (
              <button
                type="button"
                onClick={() => router.push("/packages")}
                className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs px-6 py-2 rounded-full shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span>৭ দিন সম্পন্ন! নতুন প্যাকেজ নিন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheckInClick}
                className="bg-[#dc2626] hover:bg-[#b91c1c] active:scale-95 text-white font-semibold text-sm px-10 py-2 rounded-full shadow-md shadow-rose-200 transition-all cursor-pointer flex items-center justify-center"
              >
                Check-in
              </button>
            )}

            <span className="text-[11px] text-slate-400 mt-2 text-center">
              {isPremium
                ? isCheckedInToday
                  ? "পরবর্তী রিওয়ার্ড আগামীকাল রাত ১২টায় আনলক হবে"
                  : `আজকের রিওয়ার্ড: ৳${
                      dailyCheckIn.rewards[
                        Math.min(dailyCheckIn.currentDay - 1, 6)
                      ]
                    }`
                : "👑 প্রিমিয়াম প্যাকেজ অ্যাক্টিভ থাকলে প্রতিদিন টাকা পাবেন"}
            </span>
          </div>
        </div>

        {/* Pill Tab Switcher: 'In Progress Tasks' vs 'Past Tasks' - Matching Screenshot */}
        <div className="mx-4 mt-4 bg-white border border-slate-100 rounded-full p-1 shadow-xs flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab("in_progress")}
            className={`flex-1 py-2 text-center text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
              activeTab === "in_progress"
                ? "bg-[#ea580c] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            In Progress Tasks
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className={`flex-1 py-2 text-center text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
              activeTab === "past"
                ? "bg-[#ea580c] text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Past Tasks
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
          {activeTab === "in_progress" ? (
            inProgressTasks.length > 0 ? (
              <div className="w-full space-y-3">
                {/* Tasks list if any */}
              </div>
            ) : (
              /* EXACT Empty State Vector Illustration matching Screenshot */
              <div className="flex flex-col items-center justify-center text-center py-6">
                <div className="w-48 h-48 relative flex items-center justify-center mb-1">
                  {/* Subtle Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-b from-rose-100/40 to-purple-100/30 rounded-full filter blur-xl" />

                  <svg
                    viewBox="0 0 200 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-44 h-44 drop-shadow-sm relative z-10"
                  >
                    {/* Shadow oval below gift box */}
                    <ellipse
                      cx="100"
                      cy="154"
                      rx="48"
                      ry="12"
                      fill="#fed7aa"
                      fillOpacity="0.45"
                    />

                    {/* Gift Box Base Back/Interior */}
                    <polygon
                      points="65,116 100,102 135,116 100,130"
                      fill="#cbd5e1"
                    />
                    <polygon
                      points="65,116 100,130 100,152 65,138"
                      fill="#fda4af"
                    />
                    <polygon
                      points="100,130 135,116 135,138 100,152"
                      fill="#f43f5e"
                    />

                    {/* Box Front Walls - Pastel Peach/Pink 3D Box */}
                    <path
                      d="M62 118 L100 132 L138 118 L138 144 L100 158 L62 144 Z"
                      fill="#fecdd3"
                    />
                    <path
                      d="M62 118 L100 132 L100 158 L62 144 Z"
                      fill="#fda4af"
                    />
                    <path
                      d="M100 132 L138 118 L138 144 L100 158 Z"
                      fill="#fb7185"
                    />

                    {/* Box Ribbon */}
                    <polygon
                      points="96,131 104,131 104,157 96,157"
                      fill="#ffffff"
                      fillOpacity="0.75"
                    />

                    {/* Open Box Lid floating left tilted */}
                    <g transform="translate(-8, -12) rotate(-16 80 90)">
                      <polygon
                        points="60,92 100,78 140,92 100,106"
                        fill="#fecdd3"
                      />
                      <polygon
                        points="60,92 100,106 100,114 60,100"
                        fill="#fda4af"
                      />
                      <polygon
                        points="100,106 140,92 140,100 100,114"
                        fill="#f43f5e"
                      />
                      {/* Lid Ribbon Knot */}
                      <circle cx="100" cy="92" r="4.5" fill="#ffffff" />
                    </g>

                    {/* Floating Soft Lilac Question Mark Bubble */}
                    <g className="animate-pulse">
                      <circle
                        cx="106"
                        cy="96"
                        r="16"
                        fill="url(#purpleGlow)"
                        filter="drop-shadow(0 4px 8px rgba(168,85,247,0.25))"
                      />
                      <text
                        x="106"
                        y="103"
                        fill="#ffffff"
                        fontSize="20"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="sans-serif"
                      >
                        ?
                      </text>
                    </g>

                    {/* Floating Sparkles / Stars matching screenshot */}
                    <g fill="#f472b6">
                      {/* Top left sparkle */}
                      <path d="M58 84 Q62 84 62 80 Q62 84 66 84 Q62 84 62 88 Q62 84 58 84 Z" />
                      {/* Top right sparkle */}
                      <path d="M144 76 Q147 76 147 73 Q147 76 150 76 Q147 76 147 79 Q147 76 144 76 Z" />
                      {/* Right mid circle dot */}
                      <circle cx="152" cy="108" r="2" fill="#fb7185" />
                      {/* Left lower dot */}
                      <circle cx="50" cy="132" r="2.5" fill="#f43f5e" />
                      {/* Lower sparkle */}
                      <path d="M136 148 Q139 148 139 145 Q139 148 142 148 Q139 148 139 151 Q139 148 136 148 Z" />
                      {/* Tiny center sparkle */}
                      <circle cx="98" cy="116" r="1.5" fill="#e879f9" />
                    </g>

                    <defs>
                      <linearGradient
                        id="purpleGlow"
                        x1="90"
                        y1="80"
                        x2="122"
                        y2="112"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop stopColor="#c084fc" />
                        <stop offset="1" stopColor="#9333ea" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <p className="text-slate-400 text-sm font-medium tracking-tight mt-1">
                  There are no tasks yet!
                </p>

                {/* Helpful shortcut button to explore other tasks */}
                <Link
                  href="/tasks"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ea580c] hover:underline"
                >
                  <span>টাস্ক বোর্ড দেখুন</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )
          ) : (
            /* Past Tasks Content */
            <div className="w-full flex flex-col gap-3">
              {pastSubmissions.length > 0 || dailyCheckIn.history.length > 0 ? (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs font-bold text-slate-700">
                      অতীত টাস্ক ও রিওয়ার্ড হিস্ট্রি
                    </span>
                    <span className="text-[11px] text-slate-400">
                      সর্বশেষ আপডেট
                    </span>
                  </div>

                  {/* Daily Check-in claims logged */}
                  {dailyCheckIn.history.map((day) => (
                    <div
                      key={`claim_${day}`}
                      className="bg-white rounded-xl p-3 border border-slate-100 flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            মিশন সেন্টার: দিন {day} চেক-ইন সম্পন্ন
                          </h4>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>সফলভাবে জমা হয়েছে</span>
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">
                        +৳{dailyCheckIn.rewards[day - 1]}
                      </span>
                    </div>
                  ))}

                  {/* Submissions list */}
                  {pastSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-white rounded-xl p-3 border border-slate-100 flex items-center justify-between shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs">
                          {sub.platform[0]?.toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            {sub.taskTitle}
                          </h4>
                          <span
                            className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full inline-block mt-0.5 ${
                              sub.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-700"
                                : sub.status === "PENDING"
                                ? "bg-amber-100 text-amber-700"
                                : "bg-rose-100 text-rose-700"
                            }`}
                          >
                            {sub.status === "APPROVED"
                              ? "অনুমোদিত"
                              : sub.status === "PENDING"
                              ? "পেন্ডিং"
                              : "বাতিল"}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        ৳{sub.reward}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm font-medium">
                    There are no past tasks yet!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Developer Test Reset Bar (Allows easily testing the 7-day reward cycle) */}
        <div className="mx-4 mb-4 p-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
            <span>টেস্টিং টুল: চেক-ইন রিসেট</span>
          </div>
          <button
            type="button"
            onClick={() => {
              resetDailyCheckInForTest();
              setFeedbackMsg({
                type: "success",
                text: "ডেইলি চেক-ইন দিন ১ এ রিসেট করা হয়েছে!",
              });
            }}
            className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 bg-white border border-slate-200 px-2.5 py-0.5 rounded-lg active:scale-95 shadow-2xs"
          >
            রিসেট দিন ১
          </button>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>

      {/* Premium Upgrade Modal / Bottom Sheet */}
      {showPremiumModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setShowPremiumModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Crown className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base font-bengali">
                  প্রিমিয়াম মেম্বারশিপ প্রয়োজনীয়
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowPremiumModal(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 font-bengali">
              <p className="text-xs text-slate-600 leading-relaxed">
                মিশন সেন্টারের দৈনিক লগইন বোনাস শুধুমাত্র আমাদের{" "}
                <span className="font-bold text-slate-900">
                  প্রিমিয়াম মেম্বারদের
                </span>{" "}
                জন্য উন্মুক্ত। যেকোনো প্যাকেজ অ্যাক্টিভ করলে টানা{" "}
                <span className="font-bold text-[#dc2626]">৭ দিন পর্যন্ত</span>{" "}
                প্রতিদিন আকর্ষণীয় ক্যাশ রিওয়ার্ড পাবেন:
              </p>

              <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 grid grid-cols-4 gap-2 text-center text-xs">
                <div className="p-1.5 bg-white rounded-xl shadow-2xs">
                  <span className="text-[10px] text-slate-400 block">১ম দিন</span>
                  <span className="font-bold text-slate-900">৳ ৫</span>
                </div>
                <div className="p-1.5 bg-white rounded-xl shadow-2xs">
                  <span className="text-[10px] text-slate-400 block">২য় দিন</span>
                  <span className="font-bold text-slate-900">৳ ৭</span>
                </div>
                <div className="p-1.5 bg-white rounded-xl shadow-2xs">
                  <span className="text-[10px] text-slate-400 block">৩য় দিন</span>
                  <span className="font-bold text-slate-900">৳ ১০</span>
                </div>
                <div className="p-1.5 bg-white rounded-xl shadow-2xs">
                  <span className="text-[10px] text-slate-400 block">৪র্থ দিন</span>
                  <span className="font-bold text-slate-900">৳ ১৫</span>
                </div>
                <div className="p-1.5 bg-white rounded-xl shadow-2xs">
                  <span className="text-[10px] text-slate-400 block">৫ম দিন</span>
                  <span className="font-bold text-slate-900">৳ ২০</span>
                </div>
                <div className="p-1.5 bg-white rounded-xl shadow-2xs">
                  <span className="text-[10px] text-slate-400 block">৬ষ্ঠ দিন</span>
                  <span className="font-bold text-slate-900">৳ ২৫</span>
                </div>
                <div className="p-1.5 bg-white rounded-xl shadow-2xs col-span-2 bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200">
                  <span className="text-[10px] text-rose-600 font-bold block">
                    ৭ম দিন মেগা বোনাস
                  </span>
                  <span className="font-extrabold text-[#dc2626]">৳ ৩০</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800">
                💡 প্যাকেজ কিনলেই সাথে সাথে ৭ দিনের সাইকেল অ্যাক্টিভ হয়ে যাবে এবং প্রতিদিন চেক-ইন করে মোট ৳১১২ অতিরিক্ত বোনাস পাবেন!
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                পরে করব
              </button>
              <Link
                href="/packages"
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
              >
                <span>প্যাকেজ দেখুন</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
