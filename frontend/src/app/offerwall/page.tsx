"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  ExternalLink,
  X,
  Sparkles,
  ArrowRight,
  Info,
  Gift,
  CheckSquare,
  Coins,
  Send,
  Download,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";

interface OfferItem {
  id: string;
  name: string;
  title: string;
  badge: "হট অফার" | "নতুন";
  badgeType: "hot" | "new";
  description: string;
  reward: number;
  timeMinutes: number;
  iconType: "googleplay" | "facebook" | "shopee" | "tiktok" | "binance";
  targetUrl: string;
  instructions: string[];
}

export default function OfferwallPage() {
  const router = useRouter();
  const { profile, submissions, submitContentWritingPost } = useMockStore();

  // Dynamic state for statistics
  const [totalOffers, setTotalOffers] = useState(12);
  const [completedOffers, setCompletedOffers] = useState(6);
  const [totalEarned, setTotalEarned] = useState(85);

  // Selected Offer Modal
  const [selectedOffer, setSelectedOffer] = useState<OfferItem | null>(null);
  const [userProofNote, setUserProofNote] = useState("");
  const [proofScreenshot, setProofScreenshot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // 5 Popular Offers Matching the Screenshot
  const offersList: OfferItem[] = [
    {
      id: "off_gplay",
      name: "Google Play",
      title: "Google Play",
      badge: "হট অফার",
      badgeType: "hot",
      description: "অ্যাপ ইনস্টল করুন এবং খুলুন",
      reward: 20,
      timeMinutes: 2,
      iconType: "googleplay",
      targetUrl: "https://play.google.com",
      instructions: [
        "১. 'অফার লিংকে যান' বাটনে ক্লিক করে গুগল প্লে স্টোর থেকে অ্যাপটি ইনস্টল করুন।",
        "২. অ্যাপটি ওপেন করে অন্তত ২ মিনিট ব্যবহার করুন।",
        "৩. ইনস্টল ও ওপেন করা স্ক্রিনশট তুলে সাবমিট করুন।",
      ],
    },
    {
      id: "off_fb",
      name: "Facebook",
      title: "Facebook",
      badge: "হট অফার",
      badgeType: "hot",
      description: "পেজ লাইক করুন",
      reward: 10,
      timeMinutes: 1,
      iconType: "facebook",
      targetUrl: "https://facebook.com",
      instructions: [
        "১. ফেসবুক পেজে প্রবেশ করুন।",
        "২. পেজে Like এবং Follow দিন।",
        "৩. Following করা অবস্থার স্ক্রিনশট সাবমিট করুন।",
      ],
    },
    {
      id: "off_shopee",
      name: "Shopee",
      title: "Shopee",
      badge: "নতুন",
      badgeType: "new",
      description: "অ্যাপ ইনস্টল করুন এবং রেজিস্ট্রেশন করুন",
      reward: 25,
      timeMinutes: 3,
      iconType: "shopee",
      targetUrl: "https://shopee.com",
      instructions: [
        "১. শপী অ্যাপটি ডাউনলোড করে ইনস্টল করুন।",
        "২. নতুন একাউন্ট খুলে প্রোফাইল সম্পন্ন করুন।",
        "৩. আপনার প্রোফাইল পেজের স্ক্রিনশট জমা দিন।",
      ],
    },
    {
      id: "off_tiktok",
      name: "TikTok",
      title: "TikTok",
      badge: "নতুন",
      badgeType: "new",
      description: "অ্যাপ ইনস্টল করুন এবং অ্যাকাউন্ট খুলুন",
      reward: 15,
      timeMinutes: 2,
      iconType: "tiktok",
      targetUrl: "https://tiktok.com",
      instructions: [
        "১. টিকটক অ্যাপ ডাউনলোড করুন।",
        "২. জিমেইল বা ফোন নম্বর দিয়ে অ্যাকাউন্ট সাইন-আপ করুন।",
        "৩. হোম পেজের স্ক্রিনশট নিয়ে এখানে জমা দিন।",
      ],
    },
    {
      id: "off_binance",
      name: "Binance",
      title: "Binance",
      badge: "হট অফার",
      badgeType: "hot",
      description: "অ্যাকাউন্ট খুলুন এবং KYC সম্পন্ন করুন",
      reward: 30,
      timeMinutes: 5,
      iconType: "binance",
      targetUrl: "https://binance.com",
      instructions: [
        "১. বাইনান্স অ্যাপে অ্যাকাউন্ট তৈরি করুন।",
        "২. বেসিক ভেরিফিকেশন সম্পন্ন করুন।",
        "৩. ভেরিফায়েড প্রোফাইলের স্ক্রিনশট আপলোড করুন।",
      ],
    },
  ];

  // Completed Offer Submission Handler
  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOffer) return;

    setFormError(null);
    if (!userProofNote.trim()) {
      setFormError("অনুগ্রহ করে আপনার ইউজারনেম বা আইডি নম্বর লিখুন!");
      return;
    }

    setSubmitting(true);

    try {
      // Submit proof through mock store
      submitContentWritingPost({
        taskId: `task_offer_${selectedOffer.id}`,
        topicTitle: `[অফারওয়াল] ${selectedOffer.name} - ${selectedOffer.description}`,
        postContent: `অফার: ${selectedOffer.name}\nইউজার প্রমাণ: ${userProofNote}\nরিওয়ার্ড: ৳${selectedOffer.reward}`,
        reward: selectedOffer.reward,
      });

      // Update statistics dynamically
      setCompletedOffers((prev) => prev + 1);
      setTotalEarned((prev) => prev + selectedOffer.reward);

      setSubmitSuccess(
        `অফার সফলভাবে জমা হয়েছে! অ্যাডমিন যাচাইয়ের পর ৳${selectedOffer.reward} ব্যালেন্সে যুক্ত করা হবে।`
      );

      setTimeout(() => {
        setSubmitting(false);
        setSubmitSuccess(null);
        setSelectedOffer(null);
        setUserProofNote("");
      }, 1600);
    } catch (err: any) {
      setFormError(err?.message || "সাবমিট করতে সমস্যা হয়েছে।");
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dff0f8] flex justify-center selection:bg-sky-500 selection:text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-lg bg-[#eaf5fa] min-h-screen shadow-2xl flex flex-col relative pb-24 border-x border-slate-200/60 font-sans">
        {/* Top Header */}
        <Header />

        {/* Main Body Content */}
        <div className="px-3.5 pt-3.5 pb-6 space-y-3.5">
          {/* ========================================================
              SECTION 1: HERO BANNER (অফারওয়াল)
              ======================================================== */}
          <div className="bg-gradient-to-r from-[#d8f1fe] via-[#ecf8fe] to-[#def2fe] rounded-3xl p-4 shadow-sm border border-sky-200/90 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2">
              {/* Left Side: Gift Icon with FREE Tag + Title + Subtitle */}
              <div className="flex items-center gap-3 min-w-0">
                {/* 3D Gift Box Graphic with • FREE Tag */}
                <div className="relative w-16 h-16 flex-shrink-0 flex items-center justify-center">
                  {/* Cyan / Blue Circular Backdrop */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#0284c7] to-[#38bdf8] flex items-center justify-center shadow-md">
                    {/* Gift Box Vector */}
                    <svg viewBox="0 0 48 48" className="w-9 h-9 drop-shadow">
                      {/* Box Base */}
                      <rect x="8" y="18" width="32" height="22" rx="4" fill="#0284c7" />
                      <rect x="6" y="14" width="36" height="8" rx="2.5" fill="#38bdf8" />
                      {/* Yellow Ribbons */}
                      <rect x="21" y="14" width="6" height="26" fill="#facc15" />
                      <rect x="6" y="16.5" width="36" height="4" fill="#facc15" />
                      {/* Ribbon Bows */}
                      <path d="M21 14 C16 8, 12 12, 21 14 Z" fill="#facc15" />
                      <path d="M27 14 C32 8, 36 12, 27 14 Z" fill="#facc15" />
                    </svg>
                  </div>

                  {/* Red Attached • FREE Slanted Tag */}
                  <div className="absolute -bottom-1 -left-1 bg-[#ef4444] text-white text-[9px] font-black px-1.5 py-0.5 rounded-md shadow-xs transform -rotate-12 border border-white tracking-wider flex items-center gap-0.5">
                    <span className="w-1 h-1 rounded-full bg-white animate-ping" />
                    <span>FREE</span>
                  </div>
                </div>

                {/* Text Content */}
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-[#0b2654] leading-tight font-bengali">
                    অফারওয়াল
                  </h1>
                  <p className="text-[11px] text-slate-700 leading-snug font-bengali mt-0.5 max-w-[185px] sm:max-w-[220px]">
                    বিভিন্ন কোম্পানির অফার সম্পন্ন করুন এবং সহজেই টাকা উপার্জন করুন।
                  </p>
                </div>
              </div>

              {/* Right Side: Megaphone + Banknotes + "আজ করুন / আয় করুন" Badge */}
              <div className="w-24 h-20 flex-shrink-0 relative flex items-center justify-end">
                <svg viewBox="0 0 120 100" className="w-full h-full overflow-visible drop-shadow-sm">
                  {/* Top-Right Circular Badge Stamp: আজ করুন / আয় করুন */}
                  <g transform="translate(68, 0)">
                    <rect x="0" y="0" width="54" height="28" rx="14" fill="#0b2654" />
                    <text x="27" y="12" textAnchor="middle" fill="#38bdf8" fontSize="7.5" fontWeight="bold" fontFamily="sans-serif">
                      আজ করুন
                    </text>
                    <text x="27" y="22" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold" fontFamily="sans-serif">
                      আয় করুন
                    </text>
                  </g>

                  {/* Megaphone / Loudspeaker Graphic */}
                  <g transform="translate(18, 22)">
                    {/* Sound Rays */}
                    <line x1="6" y1="8" x2="0" y2="4" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                    <line x1="8" y1="2" x2="6" y2="-4" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                    <line x1="14" y1="0" x2="16" y2="-6" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />

                    {/* Megaphone Cone */}
                    <polygon points="12,18 42,6 42,32 12,20" fill="#f59e0b" />
                    <ellipse cx="12" cy="19" rx="3" ry="8" fill="#facc15" />
                    {/* Blue Rear Speaker Body */}
                    <rect x="42" y="10" width="12" height="18" rx="4" fill="#0284c7" />
                    {/* Hand / Handle */}
                    <rect x="44" y="28" width="6" height="14" rx="2" fill="#f97316" />
                    {/* Hand gripping handle */}
                    <rect x="41" y="32" width="12" height="10" rx="3" fill="#2563eb" />
                  </g>

                  {/* Green Banknote / Taka Notes Graphic */}
                  <g transform="translate(62, 48) rotate(-6)">
                    <rect x="0" y="0" width="46" height="26" rx="3" fill="#10b981" stroke="#047857" strokeWidth="1.5" />
                    <rect x="3" y="3" width="40" height="20" rx="2" fill="#34d399" />
                    <circle cx="23" cy="13" r="6" fill="#facc15" />
                    <text x="23" y="16" textAnchor="middle" fill="#065f46" fontSize="9" fontWeight="bold">৳</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 2: 3 STAT CARDS (মোট অফার, সম্পন্ন, মোট আয়)
              ======================================================== */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Stat Card 1: মোট অফার */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <Download className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="text-base font-extrabold text-slate-900 leading-none">
                  {totalOffers}
                </div>
                <div className="text-[9.5px] sm:text-[10px] font-medium text-slate-500 mt-1 whitespace-nowrap">
                  মোট অফার
                </div>
              </div>
            </div>

            {/* Stat Card 2: সম্পন্ন */}
            <div className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 shadow-2xs">
                <CheckSquare className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="min-w-0">
                <div className="text-base font-extrabold text-slate-900 leading-none">
                  {completedOffers}
                </div>
                <div className="text-[10px] font-medium text-slate-500 mt-1 truncate">
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
                <div className="text-[10px] font-medium text-slate-500 mt-1 truncate">
                  মোট আয়
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 3: জনপ্রিয় অফার (Popular Offers List)
              ======================================================== */}
          <div className="space-y-2.5">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center flex-shrink-0">
                  <Flame className="w-3.5 h-3.5 fill-white" />
                </div>
                <h2 className="text-base font-bold text-slate-900 font-bengali">
                  জনপ্রিয় অফার
                </h2>
              </div>

              <span className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-0.5 cursor-pointer">
                <span>সব অফার দেখুন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

            {/* Offers Cards List */}
            <div className="space-y-2.5">
              {offersList.map((offer) => (
                <div
                  key={offer.id}
                  className="bg-white rounded-2xl p-3.5 shadow-sm border border-slate-200/80 hover:border-sky-300 transition-all flex items-center justify-between gap-3"
                >
                  {/* Left Column: Brand Icon */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Brand Icon Render */}
                    <div className="w-13 h-13 rounded-2xl flex flex-col items-center justify-center flex-shrink-0 overflow-hidden shadow-2xs">
                      {offer.iconType === "googleplay" && (
                        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex flex-col items-center justify-center">
                          <svg viewBox="0 0 48 48" className="w-6 h-6">
                            <path d="M8 6L28 24L8 42Z" fill="#3b82f6" />
                            <path d="M28 24L8 6L36 18Z" fill="#10b981" />
                            <path d="M28 24L36 30L8 42Z" fill="#ef4444" />
                            <path d="M28 24L36 18L42 24L36 30Z" fill="#f59e0b" />
                          </svg>
                          <span className="text-[7px] text-slate-500 font-medium leading-none mt-0.5">Google Play</span>
                        </div>
                      )}

                      {offer.iconType === "facebook" && (
                        <div className="w-12 h-12 rounded-xl bg-[#1877f2] flex items-center justify-center text-white font-extrabold text-2xl font-sans shadow-xs">
                          f
                        </div>
                      )}

                      {offer.iconType === "shopee" && (
                        <div className="w-12 h-12 rounded-xl bg-[#ee4d2d] flex items-center justify-center text-white shadow-xs p-2">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
                            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <path d="M16 10a4 4 0 0 1-8 0" />
                          </svg>
                        </div>
                      )}

                      {offer.iconType === "tiktok" && (
                        <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center text-white shadow-xs p-1.5">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-sky-400">
                            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.46V11.2a8.27 8.27 0 0 0 5.77 2.19V9.94a4.85 4.85 0 0 1-2.45-3.25h2.45z" />
                          </svg>
                        </div>
                      )}

                      {offer.iconType === "binance" && (
                        <div className="w-12 h-12 rounded-xl bg-[#181a20] flex items-center justify-center text-amber-400 shadow-xs p-2">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path d="M12 2L8.5 5.5L12 9L15.5 5.5L12 2ZM5.5 8.5L2 12L5.5 15.5L9 12L5.5 8.5ZM18.5 8.5L15 12L18.5 15.5L22 12L18.5 8.5ZM12 15L8.5 18.5L12 22L15.5 18.5L12 15ZM12 10.5L10.5 12L12 13.5L13.5 12L12 10.5Z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Offer Title + Description + Meta */}
                    <div className="min-w-0 flex-1 space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight whitespace-nowrap">
                          {offer.title}
                        </h3>

                        {/* Top-Right Badge: হট অফার / নতুন */}
                        {offer.badgeType === "hot" ? (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#ef4444] text-white text-[9px] font-bold whitespace-nowrap">
                            হট অফার
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-full bg-[#e0f2fe] text-[#0284c7] text-[9px] font-bold whitespace-nowrap">
                            নতুন
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-[10.5px] text-slate-600 font-bengali leading-snug">
                        {offer.description}
                      </p>

                      {/* Meta: Reward + Time */}
                      <div className="flex items-center gap-2 pt-0.5">
                        <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-extrabold text-[11px] border border-emerald-200">
                          ৳ {offer.reward}
                        </span>

                        <span className="text-[10px] text-slate-500 flex items-center gap-1 whitespace-nowrap">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>সময়: {offer.timeMinutes} মিনিট</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: "অফার সম্পন্ন করুন →" Blue Action Button */}
                  <div className="flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedOffer(offer);
                        setFormError(null);
                        setSubmitSuccess(null);
                        setUserProofNote("");
                      }}
                      className="px-2.5 py-2 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white text-[11px] sm:text-xs font-bold shadow-xs transition-all flex items-center gap-1 whitespace-nowrap"
                    >
                      <span>অফার সম্পন্ন করুন</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================
              SECTION 4: অফারওয়াল এর নিয়মাবলি (Rules & Guidelines)
              ======================================================== */}
          <div className="bg-[#eef8fe] rounded-3xl p-4 border border-sky-200/90 relative overflow-hidden">
            <div className="flex items-start justify-between gap-3">
              {/* Left Side: Info Icon + Title + 3 Bullet Rules */}
              <div className="flex-1 space-y-2.5 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-[#0284c7] text-white flex items-center justify-center flex-shrink-0">
                    <Info className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0b2654] font-bengali">
                    অফারওয়াল এর নিয়মাবলি
                  </h3>
                </div>

                <div className="space-y-1.5 pl-1">
                  <div className="flex items-start gap-1.5 text-[11px] text-slate-700 font-bengali leading-relaxed">
                    <span className="text-[#0284c7] font-bold">•</span>
                    <span>প্রতিটি অফার সম্পন্ন করতে নির্ধারিত সময় লাগবে।</span>
                  </div>

                  <div className="flex items-start gap-1.5 text-[11px] text-slate-700 font-bengali leading-relaxed">
                    <span className="text-[#0284c7] font-bold">•</span>
                    <span>একই অফার বারবার করলে পেমেন্ট হবে না।</span>
                  </div>

                  <div className="flex items-start gap-1.5 text-[11px] text-slate-700 font-bengali leading-relaxed">
                    <span className="text-[#0284c7] font-bold">•</span>
                    <span>অফার সম্পন্ন করার পর অ্যাডমিন যাচাই করে টাকা যোগ করবেন।</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Clipboard Checklist + Gift Box Vector Illustration */}
              <div className="w-24 h-24 flex-shrink-0 relative flex items-center justify-end">
                <svg viewBox="0 0 110 110" className="w-full h-full overflow-visible drop-shadow-sm">
                  {/* Clipboard Paper */}
                  <rect x="15" y="12" width="56" height="74" rx="6" fill="#ffffff" stroke="#93c5fd" strokeWidth="2" />
                  <rect x="20" y="18" width="46" height="62" rx="3" fill="#f0f9ff" />
                  
                  {/* Clipboard Clip Top */}
                  <rect x="33" y="8" width="20" height="8" rx="2" fill="#0284c7" />
                  
                  {/* Checklist lines */}
                  <circle cx="28" cy="30" r="3" fill="#3b82f6" />
                  <path d="M26 30 L27.5 31.5 L30 29" stroke="white" strokeWidth="1" fill="none" />
                  <line x1="36" y1="30" x2="56" y2="30" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                  <circle cx="28" cy="42" r="3" fill="#3b82f6" />
                  <path d="M26 42 L27.5 43.5 L30 41" stroke="white" strokeWidth="1" fill="none" />
                  <line x1="36" y1="42" x2="52" y2="42" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                  <circle cx="28" cy="54" r="3" fill="#3b82f6" />
                  <path d="M26 54 L27.5 55.5 L30 53" stroke="white" strokeWidth="1" fill="none" />
                  <line x1="36" y1="54" x2="58" y2="54" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

                  {/* 3D Gift Box in front */}
                  <g transform="translate(52, 54)">
                    <rect x="6" y="14" width="30" height="24" rx="3" fill="#e11d48" />
                    <rect x="4" y="10" width="34" height="6" rx="1.5" fill="#f43f5e" />
                    {/* Yellow ribbons */}
                    <rect x="18" y="10" width="5" height="28" fill="#facc15" />
                    <rect x="4" y="19" width="34" height="4" fill="#facc15" />
                    {/* Bow */}
                    <path d="M18 10 C14 4, 10 8, 18 10 Z" fill="#facc15" />
                    <path d="M23 10 C27 4, 31 8, 23 10 Z" fill="#facc15" />
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            MODAL: OFFER COMPLETION / SUBMISSION
            ======================================================== */}
        {selectedOffer && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setSelectedOffer(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {selectedOffer.title} অফার সম্পন্ন করুন
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      রিওয়ার্ড: ৳{selectedOffer.reward} • সময়: {selectedOffer.timeMinutes} মিনিট
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedOffer(null)}
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

              {/* Instructions */}
              <div className="bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100 space-y-1.5">
                <h4 className="text-xs font-bold text-slate-900 font-bengali">
                  কাজের নির্দেশনা:
                </h4>
                {selectedOffer.instructions.map((inst, idx) => (
                  <p key={idx} className="text-[11px] text-slate-700 font-bengali leading-snug">
                    {inst}
                  </p>
                ))}
              </div>

              {/* Step 1: External Link Button */}
              <div>
                <a
                  href={selectedOffer.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <span>ধাপ ১: {selectedOffer.name} অফার পেজে যান</span>
                  <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
                </a>
              </div>

              {/* Step 2: Proof Form */}
              <form onSubmit={handleOfferSubmit} className="space-y-3 pt-1">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    ধাপ ২: আপনার ইউজারনেম / আইডি নম্বর লিখুন *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: username_123 বা নিবন্ধিত ইমেইল..."
                    value={userProofNote}
                    onChange={(e) => setUserProofNote(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                {/* Screenshot Preview */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    প্রমাণ স্ক্রিনশট (স্বয়ংক্রিয়ভাবে সংগৃহীত)
                  </label>
                  <div className="flex items-center gap-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                    <img
                      src={proofScreenshot}
                      alt="Proof Preview"
                      className="w-12 h-12 rounded-lg object-cover border border-slate-300 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-[11px] text-slate-600">
                      <p className="font-semibold text-slate-800">ভেরিফিকেশন স্ক্রিনশট সংযুক্ত</p>
                      <p className="text-[10px] text-slate-500">অ্যাডমিন রিভিউয়ের জন্য প্রস্তুত</p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0b2654] via-[#1e5eb3] to-[#0284c7] text-white font-bold text-xs shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <span>যাচাই হচ্ছে...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-amber-400" />
                      <span>অফার জমা দিন (Claim ৳{selectedOffer.reward})</span>
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
