"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ListChecks,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  X,
  Sparkles,
  ArrowRight,
  Gift,
  CheckSquare,
  Coins,
  Send,
  Smartphone,
  ShoppingCart,
  Utensils,
  Wallet,
  Smile,
  Star,
  Check,
  Zap,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";

interface SurveyItem {
  id: string;
  title: string;
  badge: "জনপ্রিয়" | "নতুন";
  badgeType: "popular" | "new";
  description: string;
  reward: number;
  timeMinutes: number;
  iconType: "mobile" | "cart" | "food" | "wallet" | "smile";
  questions: {
    question: string;
    options: string[];
  }[];
}

export default function SurveyPage() {
  const router = useRouter();
  const { profile, submitContentWritingPost } = useMockStore();

  // Dynamic statistics state matching mockup
  const [totalSurveys, setTotalSurveys] = useState(8);
  const [completedSurveys, setCompletedSurveys] = useState(4);
  const [totalEarned, setTotalEarned] = useState(60);

  // Selected Survey Modal
  const [selectedSurvey, setSelectedSurvey] = useState<SurveyItem | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [rating, setRating] = useState<number>(5);
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // 5 Survey Items Matching the Screenshot Exactly
  const surveyList: SurveyItem[] = [
    {
      id: "srv_mobile",
      title: "মোবাইল ব্র্যান্ড পছন্দ",
      badge: "জনপ্রিয়",
      badgeType: "popular",
      description: "কোন মোবাইল ব্র্যান্ড আপনার বেশি পছন্দ? আপনার মতামত দিন।",
      reward: 10,
      timeMinutes: 3,
      iconType: "mobile",
      questions: [
        {
          question: "আপনার বর্তমানে ব্যবহৃত স্মার্টফোন ব্র্যান্ড কোনটি?",
          options: ["Samsung", "Apple (iPhone)", "Xiaomi / Redmi", "Realme", "Vivo / Oppo"],
        },
        {
          question: "একটি নতুন মোবাইল কেনার ক্ষেত্রে সবচেয়ে জরুরি বিষয় কোনটি?",
          options: ["ক্যামেরা কোয়ালিটি", "ব্যাটারি লাইফ (৫০০০+ mAh)", "দ্রুত প্রসেসর ও গেমিং", "বাজেট ও কম দাম"],
        },
      ],
    },
    {
      id: "srv_shop",
      title: "অনলাইন শপিং অভ্যাস",
      badge: "নতুন",
      badgeType: "new",
      description: "আপনি কোন সাইটে বেশি শপিং করেন? আপনার মতামত দিন।",
      reward: 8,
      timeMinutes: 2,
      iconType: "cart",
      questions: [
        {
          question: "সাধারণত কোন প্ল্যাটফর্ম থেকে সবচেয়ে বেশি অনলাইন কেনাকাটা করেন?",
          options: ["Daraz", "Facebook Shop / Page", "Pickaboo", "Aarong / দেশীয় ব্র্যান্ড", "AliExpress"],
        },
        {
          question: "অনলাইনে পেমেন্ট করার ক্ষেত্রে কোন পদ্ধতি আপনার বেশি পছন্দ?",
          options: ["ক্যাশ অন ডেলিভারি (COD)", "বিকাশ / নগদ", "ক্রেডিট / ডেবিট কার্ড"],
        },
      ],
    },
    {
      id: "srv_food",
      title: "প্রিয় খাবার",
      badge: "নতুন",
      badgeType: "new",
      description: "আপনার প্রিয় খাবার কোনটি? জরিপে অংশ নিয়ে জানান।",
      reward: 6,
      timeMinutes: 2,
      iconType: "food",
      questions: [
        {
          question: "বাইরে বা রেস্টুরেন্টে গেলে আপনার প্রথম পছন্দ কোন খাবারটি?",
          options: ["কাচ্চি বিরিয়ানি / তেহারি", "বার্গার ও ফ্রাইড চিকেন", "চাইনিজ ও পাস্তা", "দেশি খিচুড়ি ও মাংস"],
        },
        {
          question: "সাপ্তাহে কতবার ফুড ডেলিভারি অ্যাপ (যেমন Foodpanda) ব্যবহার করেন?",
          options: ["প্রতিদিন ১ বার", "সপ্তাহে ১-৩ বার", "মাসে ২-৩ বার", "খুব একটা অর্ডার করি না"],
        },
      ],
    },
    {
      id: "srv_wallet",
      title: "ডিজিটাল ওয়ালেট ব্যবহার",
      badge: "জনপ্রিয়",
      badgeType: "popular",
      description: "আপনি কোন ডিজিটাল ওয়ালেট ব্যবহার করেন? আপনার মতামত দিন।",
      reward: 12,
      timeMinutes: 4,
      iconType: "wallet",
      questions: [
        {
          question: "দৈনন্দিন লেনদেনে কোন এমএফএস (MFS) ওয়ালেট সবচেয়ে বেশি ব্যবহার করেন?",
          options: ["বিকাশ (bKash)", "নগদ (Nagad)", "রকেট (Rocket)", "উপায় (Upay)"],
        },
        {
          question: "ডিজিটাল ওয়ালেটের কোন সুবিধাটি আপনার কাছে সবচেয়ে ভালো লাগে?",
          options: ["সহজে টাকা পাঠানো ও গ্রহণ", "মোবাইল রিচার্জ সুবিধা", "ইউটিলিটি বিল পেমেন্ট", "ক্যাশব্যাক অফার ও রিওয়ার্ড"],
        },
      ],
    },
    {
      id: "srv_app",
      title: "অ্যাপ ব্যবহার অভিজ্ঞতা",
      badge: "নতুন",
      badgeType: "new",
      description: "দিগন্ত অ্যাপ ব্যবহার করে আপনার অভিজ্ঞতা কেমন? জরিপে অংশ নিয়ে জানান।",
      reward: 10,
      timeMinutes: 3,
      iconType: "smile",
      questions: [
        {
          question: "দিগন্ত প্ল্যাটফর্মের কোন ফিচারটি আপনি সবচেয়ে বেশি পছন্দ করেছেন?",
          options: ["দৈনিক লগইন বোনাস ও মিশন", "লাকি স্পিন হুইল", "মাইক্রোজব ও ফেসবুক পোস্ট টাস্ক", "দ্রুত টাকা উত্তোলন ও সাপোর্ট"],
        },
        {
          question: "অ্যাপটির ব্যবহারযোগ্যতা ও স্পিড কেমন মনে হয়েছে?",
          options: ["অসাধারণ ও সুপার ফাস্ট", "খুবই ভালো ও সন্তোষজনক", "মোটামুটি ভালো", "কিছু জায়গায় আরও দ্রুত হওয়া দরকার"],
        },
      ],
    },
  ];

  // Survey Submission Handler
  const handleSurveySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSurvey) return;

    setFormError(null);

    // Validate that all questions are answered
    for (let i = 0; i < selectedSurvey.questions.length; i++) {
      if (!answers[i]) {
        setFormError(`অনুগ্রহ করে প্রশ্ন ${i + 1} এর উত্তর নির্বাচন করুন!`);
        return;
      }
    }

    setSubmitting(true);

    try {
      const summaryText = Object.entries(answers)
        .map(([idx, ans]) => `প্র: ${selectedSurvey.questions[Number(idx)].question}\nউ: ${ans}`)
        .join("\n\n");

      // Record in mock store
      submitContentWritingPost({
        taskId: `task_survey_${selectedSurvey.id}`,
        topicTitle: `[সার্ভে] ${selectedSurvey.title}`,
        postContent: `${summaryText}\n\nরেটিং: ${rating}/5 স্টার`,
        reward: selectedSurvey.reward,
      });

      // Update statistics dynamically
      setCompletedSurveys((prev) => prev + 1);
      setTotalEarned((prev) => prev + selectedSurvey.reward);

      setSubmitSuccess(
        `ধন্যবাদ! আপনার মূল্যবান মতামত গৃহীত হয়েছে এবং ৳${selectedSurvey.reward} আপনার অ্যাকাউন্টে যোগ করা হয়েছে!`
      );

      setTimeout(() => {
        setSubmitting(false);
        setSubmitSuccess(null);
        setSelectedSurvey(null);
        setAnswers({});
      }, 1600);
    } catch (err: any) {
      setFormError(err?.message || "সার্ভে জমা দিতে সমস্যা হয়েছে।");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dff0f8] flex justify-center selection:bg-sky-500 selection:text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-lg bg-[#eaf5fa] min-h-screen shadow-2xl flex flex-col relative pb-24 border-x border-slate-200/60 font-sans">
        {/* Top App Header */}
        <Header />

        {/* Main Body Content */}
        <div className="px-3.5 pt-3.5 pb-6 space-y-3.5">
          {/* ========================================================
              SECTION 1: HERO BANNER (সার্ভে)
              ======================================================== */}
          <div className="bg-gradient-to-r from-[#d8f1fe] via-[#ecf8fe] to-[#def2fe] rounded-3xl p-4 shadow-sm border border-sky-200/90 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2">
              {/* Left Side: Checklist Graphic + Title + Subtitle */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Clipboard with Checklist Vector Graphic */}
                <div className="w-15 h-16 flex-shrink-0 relative flex items-center justify-center">
                  <svg viewBox="0 0 54 58" className="w-full h-full drop-shadow">
                    {/* Blue Clipboard Sheet */}
                    <rect x="6" y="8" width="40" height="46" rx="5" fill="#0284c7" />
                    <rect x="9" y="12" width="34" height="39" rx="3" fill="#ffffff" />
                    {/* Clipboard Top Clip */}
                    <rect x="18" y="5" width="16" height="7" rx="2" fill="#38bdf8" />
                    <circle cx="26" cy="8.5" r="1.5" fill="#ffffff" />
                    
                    {/* Checklist items with green checkmarks */}
                    <circle cx="16" cy="20" r="3" fill="#10b981" />
                    <path d="M14.5 20 L15.5 21 L17.5 19" stroke="white" strokeWidth="1" fill="none" />
                    <line x1="22" y1="20" x2="38" y2="20" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                    <circle cx="16" cy="30" r="3" fill="#10b981" />
                    <path d="M14.5 30 L15.5 31 L17.5 29" stroke="white" strokeWidth="1" fill="none" />
                    <line x1="22" y1="30" x2="35" y2="30" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                    <circle cx="16" cy="40" r="3" fill="#10b981" />
                    <path d="M14.5 40 L15.5 41 L17.5 39" stroke="white" strokeWidth="1" fill="none" />
                    <line x1="22" y1="40" x2="38" y2="40" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>

                {/* Text Content */}
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-[#0b2654] leading-tight font-bengali">
                    সার্ভে
                  </h1>
                  <p className="text-[11px] text-slate-700 leading-snug font-bengali mt-0.5 max-w-[185px] sm:max-w-[220px]">
                    বিভিন্ন বিষয় নিয়ে জরিপে অংশ নিন এবং সহজেই পুরস্কার অর্জন করুন।
                  </p>
                </div>
              </div>

              {/* Right Side: Respondent Character + Speech Bubble with Stars */}
              <div className="w-28 h-20 flex-shrink-0 relative flex items-center justify-end">
                <svg viewBox="0 0 130 95" className="w-full h-full overflow-visible drop-shadow-sm">
                  {/* Speech Bubble Badge at Top-Right */}
                  <g transform="translate(68, 0)">
                    <rect x="0" y="0" width="60" height="28" rx="14" fill="#0b2654" />
                    <text x="30" y="11" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">
                      আপনার মতামত
                    </text>
                    <text x="30" y="21" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                      গুরুত্বপূর্ণ
                    </text>
                  </g>

                  {/* Golden Stars below speech bubble */}
                  <g transform="translate(90, 30)">
                    <text x="0" y="0" fontSize="10" fill="#facc15">★★</text>
                  </g>

                  {/* Character holding tablet */}
                  <g transform="translate(26, 8)">
                    {/* Star sparkle beside head */}
                    <text x="-12" y="22" fontSize="10" fill="#facc15">★</text>

                    {/* Boy Character */}
                    {/* Head */}
                    <circle cx="28" cy="22" r="9" fill="#fed7aa" />
                    {/* Hair */}
                    <path d="M19 20 C19 12 25 10 33 11 C37 12 38 16 37 20 C34 18 30 19 27 20 Z" fill="#0f172a" />
                    {/* Face smile */}
                    <circle cx="25" cy="22" r="1" fill="#0f172a" />
                    <circle cx="30" cy="22" r="1" fill="#0f172a" />
                    <path d="M26 25 Q28 27 30 25" stroke="#0f172a" strokeWidth="0.8" fill="none" strokeLinecap="round" />

                    {/* Neck */}
                    <rect x="25" y="30" width="6" height="5" fill="#fed7aa" />
                    
                    {/* Blue Shirt Body */}
                    <path d="M15 64 L15 42 C15 35 20 34 28 34 C36 34 41 35 41 42 L41 64 Z" fill="#2563eb" />

                    {/* Black Tablet in hands */}
                    <rect x="30" y="40" width="24" height="18" rx="2" fill="#0f172a" transform="rotate(-15 30 40)" />
                    <rect x="32" y="42" width="20" height="14" rx="1" fill="#38bdf8" transform="rotate(-15 30 40)" />
                    {/* Hand gripping tablet */}
                    <circle cx="34" cy="52" r="3" fill="#fed7aa" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 2: 3 STAT CARDS (মোট সার্ভে, সম্পন্ন, মোট আয়)
              ======================================================== */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Stat Card 1: মোট সার্ভে */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Sparkles className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="text-base font-extrabold text-slate-900 leading-none">
                  {totalSurveys}
                </div>
                <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                  মোট সার্ভে
                </div>
              </div>
            </div>

            {/* Stat Card 2: সম্পন্ন */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="text-base font-extrabold text-slate-900 leading-none">
                  {completedSurveys}
                </div>
                <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                  সম্পন্ন
                </div>
              </div>
            </div>

            {/* Stat Card 3: মোট আয় */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Coins className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="text-base font-extrabold text-slate-900 leading-none">
                  ৳ {totalEarned}
                </div>
                <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                  মোট আয়
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 3: সার্ভে তালিকা (Survey Cards List)
              ======================================================== */}
          <div className="space-y-2.5">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1e5eb3] text-white flex items-center justify-center flex-shrink-0">
                  <ListChecks className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 font-bengali">
                  সার্ভে তালিকা
                </h2>
              </div>

              <span className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-0.5 cursor-pointer">
                <span>সব সার্ভে দেখুন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Survey Cards List */}
            <div className="space-y-2.5">
              {surveyList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 hover:border-sky-300 transition-all flex items-center justify-between gap-3"
                >
                  {/* Left Column: Icon + Text */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Circle Icon */}
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-2xs">
                      {item.iconType === "mobile" && (
                        <div className="w-full h-full rounded-full bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
                          <Smartphone className="w-5 h-5" />
                        </div>
                      )}

                      {item.iconType === "cart" && (
                        <div className="w-full h-full rounded-full bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
                          <ShoppingCart className="w-5 h-5" />
                        </div>
                      )}

                      {item.iconType === "food" && (
                        <div className="w-full h-full rounded-full bg-[#f3e8ff] text-[#9333ea] flex items-center justify-center">
                          <Utensils className="w-5 h-5" />
                        </div>
                      )}

                      {item.iconType === "wallet" && (
                        <div className="w-full h-full rounded-full bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
                          <Wallet className="w-5 h-5" />
                        </div>
                      )}

                      {item.iconType === "smile" && (
                        <div className="w-full h-full rounded-full bg-[#e0f2fe] text-[#0284c7] flex items-center justify-center">
                          <Smile className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight whitespace-nowrap">
                          {item.title}
                        </h3>

                        {/* Badge: জনপ্রিয় / নতুন */}
                        {item.badgeType === "popular" ? (
                          <span className="px-2 py-0.5 rounded-full bg-[#dcfce7] text-[#15803d] text-[9px] font-bold whitespace-nowrap">
                            জনপ্রিয়
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-[#e0f2fe] text-[#0284c7] text-[9px] font-bold whitespace-nowrap">
                            নতুন
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-[10.5px] text-slate-600 font-bengali leading-snug">
                        {item.description}
                      </p>

                      {/* Meta: Reward + Time */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-xs border border-emerald-200">
                          ৳ {item.reward}
                        </span>

                        <span className="text-[10px] text-slate-500 flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>সময়: {item.timeMinutes} মিনিট</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: "সার্ভে শুরু →" Blue Action Button */}
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedSurvey(item);
                        setAnswers({});
                        setRating(5);
                        setFormError(null);
                        setSubmitSuccess(null);
                      }}
                      className="px-3.5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 whitespace-nowrap"
                    >
                      <span>সার্ভে শুরু</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              SECTION 4: সার্ভে করার নিয়ম (Rules Card)
              ======================================================== */}
          <div className="bg-[#f0fdf4] rounded-3xl p-4 border border-emerald-200/90 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              {/* Left Side: Gift Icon + Title + 3 Bullet Rules */}
              <div className="flex-1 space-y-2.5 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <Gift className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#065f46] font-bengali">
                    সার্ভে করার নিয়ম
                  </h3>
                </div>

                <div className="space-y-1.5 pl-1">
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-700 font-bengali leading-relaxed">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>সঠিক তথ্য প্রদান করুন।</span>
                  </div>

                  <div className="flex items-start gap-1.5 text-[11px] text-slate-700 font-bengali leading-relaxed">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>একাধিকবার একই সার্ভে করা যাবে না।</span>
                  </div>

                  <div className="flex items-start gap-1.5 text-[11px] text-slate-700 font-bengali leading-relaxed">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>সার্ভে সম্পন্ন হলে নির্ধারিত পরিমাণ টাকা আপনার অ্যাকাউন্টে যোগ হবে।</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Clipboard Checklist + Green Checkmark Badge Illustration */}
              <div className="w-24 h-24 flex-shrink-0 relative flex items-center justify-end">
                <svg viewBox="0 0 110 110" className="w-full h-full overflow-visible drop-shadow-sm">
                  {/* Clipboard Paper */}
                  <rect x="18" y="14" width="56" height="74" rx="6" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
                  <rect x="23" y="20" width="46" height="62" rx="3" fill="#f0fdf4" />
                  
                  {/* Clipboard Top Clip */}
                  <rect x="36" y="10" width="20" height="8" rx="2" fill="#0284c7" />
                  
                  {/* Checklist lines */}
                  <circle cx="31" cy="32" r="3" fill="#10b981" />
                  <path d="M29 32 L30.5 33.5 L33 31" stroke="white" strokeWidth="1" fill="none" />
                  <line x1="39" y1="32" x2="59" y2="32" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                  <circle cx="31" cy="44" r="3" fill="#10b981" />
                  <path d="M29 44 L30.5 45.5 L33 43" stroke="white" strokeWidth="1" fill="none" />
                  <line x1="39" y1="44" x2="55" y2="44" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                  <circle cx="31" cy="56" r="3" fill="#10b981" />
                  <path d="M29 56 L30.5 57.5 L33 55" stroke="white" strokeWidth="1" fill="none" />
                  <line x1="39" y1="56" x2="61" y2="56" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                  {/* Big Green Circle with Checkmark Badge in front */}
                  <g transform="translate(62, 52)">
                    <circle cx="18" cy="18" r="16" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
                    <path
                      d="M12 18 L16 22 L24 14"
                      stroke="white"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            MODAL: SURVEY QUESTIONNAIRE MODAL
            ======================================================== */}
        {selectedSurvey && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setSelectedSurvey(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <ListChecks className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {selectedSurvey.title}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      রিওয়ার্ড: ৳{selectedSurvey.reward} • সময়: {selectedSurvey.timeMinutes} মিনিট
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSurvey(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Feedback Alerts */}
              {submitSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Survey Questions Form */}
              <form onSubmit={handleSurveySubmit} className="space-y-4">
                {selectedSurvey.questions.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                    <label className="text-xs font-bold text-slate-900 block font-bengali">
                      {qIdx + 1}. {q.question}
                    </label>

                    <div className="space-y-1.5">
                      {q.options.map((opt, oIdx) => {
                        const isChecked = answers[qIdx] === opt;
                        return (
                          <label
                            key={oIdx}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                              isChecked
                                ? "bg-blue-50 border-blue-600 text-blue-900 font-bold"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`question_${qIdx}`}
                              value={opt}
                              checked={isChecked}
                              onChange={() =>
                                setAnswers({ ...answers, [qIdx]: opt })
                              }
                              className="w-4 h-4 text-blue-600 accent-blue-600"
                            />
                            <span>{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Rating Input */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <label className="text-xs font-bold text-slate-900 block font-bengali">
                    আপনার সামগ্রিক অভিজ্ঞতা রেটিং দিন:
                  </label>
                  <div className="flex items-center justify-center gap-2 py-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0b2654] via-[#1e5eb3] to-[#0284c7] text-white font-bold text-xs shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>জমা হচ্ছে...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>সার্ভে জমা দিন (Claim ৳{selectedSurvey.reward})</span>
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
