"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Play,
  PlaySquare,
  Search,
  SlidersHorizontal,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MoreVertical,
  ChevronRight,
  UserPlus,
  CircleDollarSign,
  ClipboardList,
  Wallet,
  LayoutGrid,
  Crown,
  Users,
  Gift,
  HelpCircle,
  BookOpen,
  Settings,
  Upload,
  ShieldCheck,
  Coins,
  Send,
  ExternalLink,
  X,
  Sparkles,
  ArrowUpRight,
  Filter,
  Check,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";

// Video Item Interface
interface VideoProjectItem {
  id: string;
  title: string;
  category: string;
  reward: number;
  duration: string;
  status: "APPROVED" | "PENDING" | "UNDER_REVIEW" | "REJECTED";
  statusText: string;
  statusColor: string;
  videoUrl?: string;
  description: string;
  thumbnailType:
    | "registration"
    | "deposit"
    | "work"
    | "withdraw"
    | "overview"
    | "level"
    | "referral"
    | "gift"
    | "troubleshoot"
    | "guide";
}

export default function VideoContentPage() {
  const router = useRouter();
  const { profile, submissions, submitContentWritingPost } = useMockStore();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Video Submission Modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("একাউন্ট রেজিস্ট্রেশন");
  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [uploadDuration, setUploadDuration] = useState("08:00");
  const [uploadNotes, setUploadNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Video Preview Modal
  const [activeVideo, setActiveVideo] = useState<VideoProjectItem | null>(null);

  // 10 Video Categories Matching Screenshot Exactly
  const categories = [
    {
      id: "cat_1",
      name: "একাউন্ট রেজিস্ট্রেশন",
      count: "১ টি ভিডিও",
      reward: "৳10",
      numericReward: 10,
      icon: UserPlus,
      bgColor: "bg-[#eaf5ff]",
      borderColor: "border-[#bde0fe]",
      iconBg: "bg-[#2563eb]",
      iconColor: "text-white",
    },
    {
      id: "cat_2",
      name: "ডিপোজিট ভিডিও",
      count: "১ টি ভিডিও",
      reward: "৳10",
      numericReward: 10,
      icon: CircleDollarSign,
      bgColor: "bg-[#ecfdf5]",
      borderColor: "border-[#a7f3d0]",
      iconBg: "bg-[#059669]",
      iconColor: "text-white",
    },
    {
      id: "cat_3",
      name: "কাজের ভিডিও",
      count: "১ টি ভিডিও",
      reward: "৳15",
      numericReward: 15,
      icon: ClipboardList,
      bgColor: "bg-[#fffbeb]",
      borderColor: "border-[#fde68a]",
      iconBg: "bg-[#d97706]",
      iconColor: "text-white",
    },
    {
      id: "cat_4",
      name: "উইথড্র ভিডিও",
      count: "১ টি ভিডিও",
      reward: "৳15",
      numericReward: 15,
      icon: Wallet,
      bgColor: "bg-[#fbf5ff]",
      borderColor: "border-[#e9d5ff]",
      iconBg: "bg-[#9333ea]",
      iconColor: "text-white",
    },
    {
      id: "cat_5",
      name: "সম্পূর্ণ অ্যাপ ধারণা",
      count: "১ টি ভিডিও",
      reward: "৳30",
      numericReward: 30,
      icon: LayoutGrid,
      bgColor: "bg-[#fff1f2]",
      borderColor: "border-[#fecdd3]",
      iconBg: "bg-[#e11d48]",
      iconColor: "text-white",
    },
    {
      id: "cat_6",
      name: "দিগন্ত স্তর ভিডিও",
      count: "১ টি ভিডিও",
      reward: "৳15",
      numericReward: 15,
      icon: Crown,
      bgColor: "bg-[#f0fdf4]",
      borderColor: "border-[#bbf7d0]",
      iconBg: "bg-[#16a34a]",
      iconColor: "text-white",
    },
    {
      id: "cat_7",
      name: "রেফারেল ভিডিও",
      count: "১ টি ভিডিও",
      reward: "৳10",
      numericReward: 10,
      icon: Users,
      bgColor: "bg-[#fdf2f8]",
      borderColor: "border-[#fbcfe8]",
      iconBg: "bg-[#db2777]",
      iconColor: "text-white",
    },
    {
      id: "cat_8",
      name: "বোনাস ও গিফট কোড",
      count: "১ টি ভিডিও",
      reward: "৳10",
      numericReward: 10,
      icon: Gift,
      bgColor: "bg-[#f0f9ff]",
      borderColor: "border-[#bae6fd]",
      iconBg: "bg-[#0284c7]",
      iconColor: "text-white",
    },
    {
      id: "cat_9",
      name: "সমস্যা সমাধান ভিডিও",
      count: "১ টি ভিডিও",
      reward: "৳15",
      numericReward: 15,
      icon: HelpCircle,
      bgColor: "bg-[#f5f3ff]",
      borderColor: "border-[#ddd6fe]",
      iconBg: "bg-[#7c3aed]",
      iconColor: "text-white",
    },
    {
      id: "cat_10",
      name: "সম্পূর্ণ গাইড ভিডিও",
      count: "১ টি ভিডিও",
      reward: "৳30",
      numericReward: 30,
      icon: BookOpen,
      bgColor: "bg-[#f0f9ff]",
      borderColor: "border-[#e0f2fe]",
      iconBg: "bg-[#0369a1]",
      iconColor: "text-white",
    },
  ];

  // 10 Video Items Matching Screenshot Exactly
  const [videoList, setVideoList] = useState<VideoProjectItem[]>([
    {
      id: "vid_1",
      title: "একাউন্ট রেজিস্ট্রেশন কিভাবে করবেন?",
      category: "একাউন্ট রেজিস্ট্রেশন",
      reward: 10,
      duration: "08:45",
      status: "APPROVED",
      statusText: "অনুমোদিত",
      statusColor: "bg-emerald-100 text-emerald-700",
      thumbnailType: "registration",
      description: "দিগন্ত ওয়েবসাইটে নতুন একাউন্ট খোলার নিয়ম ও প্রোফাইল সেটআপের পূর্ণাঙ্গ টিউটোরিয়াল।",
    },
    {
      id: "vid_2",
      title: "ডিপোজিট করার সম্পূর্ণ পদ্ধতি",
      category: "ডিপোজিট",
      reward: 10,
      duration: "07:32",
      status: "APPROVED",
      statusText: "অনুমোদিত",
      statusColor: "bg-emerald-100 text-emerald-700",
      thumbnailType: "deposit",
      description: "বিকাশ ও নগদের মাধ্যমে খুব সহজে কিভাবে টাকা রিচার্জ করবেন তার স্পষ্ট স্ক্রিন রেকর্ডিং।",
    },
    {
      id: "vid_3",
      title: "কাজ করার নিয়ম ও কাজ জমা দেওয়া",
      category: "কাজের ভিডিও",
      reward: 15,
      duration: "12:18",
      status: "PENDING",
      statusText: "পেন্ডিং",
      statusColor: "bg-amber-100 text-amber-800",
      thumbnailType: "work",
      description: "ফেসবুক, ইউটিউব ও মাইক্রোজব টাস্ক সঠিকভাবে সম্পন্ন করে স্ক্রিনশট সাবমিট করার পদ্ধতি।",
    },
    {
      id: "vid_4",
      title: "উইথড্র করার সম্পূর্ণ নিয়ম",
      category: "উইথড্র",
      reward: 15,
      duration: "10:21",
      status: "APPROVED",
      statusText: "অনুমোদিত",
      statusColor: "bg-emerald-100 text-emerald-700",
      thumbnailType: "withdraw",
      description: "অর্জিত টাকা নিজের বিকাশ/নগদে উত্তোলন করার নিয়ম ও প্রমাণ।",
    },
    {
      id: "vid_5",
      title: "পুরো সদস্যপদ সম্পূর্ণ ধারণা",
      category: "সম্পূর্ণ অ্যাপ ধারণা",
      reward: 30,
      duration: "15:40",
      status: "APPROVED",
      statusText: "অনুমোদিত",
      statusColor: "bg-emerald-100 text-emerald-700",
      thumbnailType: "overview",
      description: "দিগন্ত প্ল্যাটফর্মের সব অপশন, বোনাস ও ইনকাম ফিচার নিয়ে ৩০ মিনিটের মাস্টারক্লাস ভিডিও।",
    },
    {
      id: "vid_6",
      title: "দিগন্ত স্তর কী এবং কিভাবে অ্যাক্টিভ করবেন",
      category: "দিগন্ত স্তর",
      reward: 15,
      duration: "09:12",
      status: "PENDING",
      statusText: "পেন্ডিং",
      statusColor: "bg-amber-100 text-amber-800",
      thumbnailType: "level",
      description: "ব্রোঞ্জ, সিলভার ও গোল্ড প্যাকেজের সুযোগ-সুবিধা এবং অ্যাক্টিভেশন নিয়ম।",
    },
    {
      id: "vid_7",
      title: "রেফারেল করার সহজ উপায়",
      category: "রেফারেল",
      reward: 10,
      duration: "07:50",
      status: "APPROVED",
      statusText: "অনুমোদিত",
      statusColor: "bg-emerald-100 text-emerald-700",
      thumbnailType: "referral",
      description: "বন্ধুদের মাঝে রেফারেল কোড শেয়ার করে টিম গঠন ও আনলিমিটেড বোনাস আয়ের উপায়।",
    },
    {
      id: "vid_8",
      title: "বোনাস ও গিফট কোড কিভাবে ব্যবহার করবেন",
      category: "বোনাস",
      reward: 10,
      duration: "08:30",
      status: "UNDER_REVIEW",
      statusText: "রিভিউ চলছে",
      statusColor: "bg-sky-100 text-sky-800",
      thumbnailType: "gift",
      description: "দৈনিক লগইন মিশন, লাকি স্পিন ও প্রোমো গিফট কোড রিডিম করার টিপস।",
    },
    {
      id: "vid_9",
      title: "লগইন সমস্যা সমাধান",
      category: "সমস্যা সমাধান",
      reward: 15,
      duration: "11:25",
      status: "REJECTED",
      statusText: "বাতিল",
      statusColor: "bg-rose-100 text-rose-700",
      thumbnailType: "troubleshoot",
      description: "পাসওয়ার্ড ভুলে যাওয়া বা অ্যাকাউন্টে প্রবেশের কোনো সমস্যার সহজ সমাধান।",
    },
    {
      id: "vid_10",
      title: "নতুন সদস্যর জন্য সম্পূর্ণ গাইড",
      category: "সম্পূর্ণ গাইড",
      reward: 30,
      duration: "18:45",
      status: "APPROVED",
      statusText: "অনুমোদিত",
      statusColor: "bg-emerald-100 text-emerald-700",
      thumbnailType: "guide",
      description: "প্রথম দিন থেকেই দিগন্ত প্ল্যাটফর্মে সফলভাবে কাজ শুরু করার ধারাবাহিক নির্দেশনা।",
    },
  ]);

  // Filtered Video Items
  const filteredVideos = videoList.filter((vid) => {
    const matchesQuery =
      searchQuery.trim() === "" ||
      vid.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vid.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      !selectedCategory ||
      vid.category.includes(selectedCategory) ||
      selectedCategory.includes(vid.category);

    const matchesStatus =
      selectedStatus === "ALL" || vid.status === selectedStatus;

    return matchesQuery && matchesCategory && matchesStatus;
  });

  // Handle Video Upload Form Submission
  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!uploadTitle.trim()) {
      setFormError("ভিডিওর একটি উপযুক্ত শিরোনাম প্রদান করুন!");
      return;
    }
    if (!uploadUrl.trim()) {
      setFormError("ভিডিও লিংক (ইউটিউব/ফেসবুক/ড্রাইভ) প্রদান করুন!");
      return;
    }

    setSubmitting(true);

    try {
      const matchedCat = categories.find((c) => c.name === uploadCategory);
      const rewardVal = matchedCat?.numericReward || 15;

      const newVideo: VideoProjectItem = {
        id: `vid_${Date.now()}`,
        title: uploadTitle.trim(),
        category: uploadCategory,
        reward: rewardVal,
        duration: uploadDuration || "08:00",
        status: "PENDING",
        statusText: "পেন্ডিং",
        statusColor: "bg-amber-100 text-amber-800",
        videoUrl: uploadUrl.trim(),
        description: uploadNotes.trim() || "ইউজার সাবমিট করা ভিডিও প্রজেক্ট।",
        thumbnailType: "overview",
      };

      setVideoList([newVideo, ...videoList]);

      // Submit proof to mock store
      submitContentWritingPost({
        taskId: `task_vid_${Date.now()}`,
        topicTitle: `[ভিডিও প্রজেক্ট] ${uploadTitle.trim()}`,
        postContent: `ক্যাটাগরি: ${uploadCategory}\nভিডিও লিংক: ${uploadUrl}\nডিউরেশন: ${uploadDuration}\nনোট: ${uploadNotes}`,
        socialUrl: uploadUrl.trim(),
        reward: rewardVal,
      });

      setSubmitSuccess("আপনার ভিডিও সফলভাবে সাবমিট হয়েছে! অ্যাডমিন পর্যালোচনার পর ব্যালেন্সে টাকা যুক্ত হবে।");
      setUploadTitle("");
      setUploadUrl("");
      setUploadNotes("");

      setTimeout(() => {
        setUploadModalOpen(false);
        setSubmitSuccess(null);
      }, 1800);
    } catch (err: any) {
      setFormError(err?.message || "সাবমিট করতে সমস্যা হয়েছে।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dff0f8] flex justify-center selection:bg-sky-500 selection:text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-lg bg-[#eaf5fa] min-h-screen shadow-2xl flex flex-col relative pb-24 border-x border-slate-200/60 font-sans">
        {/* Top Header */}
        <Header />

        {/* Main Page Body */}
        <div className="px-3.5 pt-3.5 pb-6 space-y-4">
          {/* ========================================================
              SECTION 1: HERO BANNER (ভিডিও কনটেন্ট প্রজেক্ট)
              ======================================================== */}
          <div className="bg-gradient-to-br from-[#e0f2fe] via-[#f0f9ff] to-[#e6f4fe] rounded-3xl p-4 shadow-sm border border-sky-200/80 relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute -top-10 -right-10 w-36 h-36 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

            {/* Top Row: Clapperboard Icon Box + Title + Top-Right CTA Button */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5">
                {/* Clapperboard Icon with Red Play Inside */}
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1e5eb3] to-[#0284c7] p-2 flex items-center justify-center shadow-md flex-shrink-0">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <svg viewBox="0 0 32 32" className="w-full h-full text-white" fill="none">
                      {/* Clapperboard top bars */}
                      <path d="M4 8L8 4H14L10 8H4Z" fill="white" />
                      <path d="M13 8L17 4H23L19 8H13Z" fill="white" />
                      <path d="M22 8L26 4H28L28 8H22Z" fill="white" />
                      <rect x="4" y="9" width="24" height="17" rx="3" fill="#ffffff" fillOpacity="0.2" stroke="white" strokeWidth="1.5" />
                      {/* Red YouTube-style play badge */}
                      <rect x="8" y="13" width="16" height="10" rx="2.5" fill="#ef4444" />
                      <polygon points="14,15.5 19,18 14,20.5" fill="white" />
                    </svg>
                  </div>
                </div>

                <div>
                  <h1 className="text-lg md:text-xl font-bold text-[#0b2654] leading-tight font-bengali">
                    ভিডিও কনটেন্ট প্রজেক্ট
                  </h1>
                </div>
              </div>

              {/* Top-Right Badge Button: "ভিডিও বানান আয় করুন ↗" */}
              <button
                type="button"
                onClick={() => {
                  setFormError(null);
                  setSubmitSuccess(null);
                  setUploadModalOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] hover:from-[#174b8f] hover:to-[#0369a1] text-white text-[11px] font-bold shadow-sm active:scale-95 transition-all flex items-center gap-1 flex-shrink-0 text-right"
              >
                <span className="leading-tight">ভিডিও বানান<br />আয় করুন</span>
                <ArrowUpRight className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              </button>
            </div>

            {/* Middle Row: Bengali Description + Creator Vector Art */}
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs text-slate-700 leading-relaxed font-bengali max-w-[210px] sm:max-w-[260px]">
                আপনি “দিগন্ত” অ্যাপ নিয়ে ভিডিও তৈরি করুন, অ্যাপে আপলোড করুন, অ্যাডমিন অনুমোদন দিলে আপনার আয় যোগ হবে।
              </p>

              {/* Creator Illustration (Guy at Desk with Laptop, DSLR on Tripod, Monitor, Plant) */}
              <div className="w-36 h-28 flex-shrink-0 relative flex items-center justify-end">
                <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-sm overflow-visible">
                  {/* Desk Surface */}
                  <rect x="10" y="94" width="145" height="5" rx="2" fill="#94a3b8" />

                  {/* Tripod Stand with DSLR Camera */}
                  <line x1="28" y1="94" x2="35" y2="48" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="42" y1="94" x2="35" y2="48" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="35" y1="94" x2="35" y2="48" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Camera Body */}
                  <rect x="25" y="36" width="20" height="14" rx="3" fill="#0f172a" />
                  <circle cx="35" cy="43" r="5" fill="#38bdf8" stroke="#64748b" strokeWidth="1.5" />
                  {/* Shotgun Mic on Camera */}
                  <rect x="28" y="28" width="14" height="5" rx="2" fill="#475569" />
                  <line x1="42" y1="30.5" x2="48" y2="30.5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />

                  {/* Creator Guy Character */}
                  {/* Body / Blue Hoodie */}
                  <path d="M70 94 L70 70 C70 60 76 54 86 54 C96 54 102 60 102 70 L102 94 Z" fill="#2563eb" />
                  {/* Neck */}
                  <rect x="82" y="46" width="8" height="10" fill="#fcd34d" />
                  {/* Head */}
                  <circle cx="86" cy="38" r="11" fill="#fcd34d" />
                  {/* Hair */}
                  <path d="M75 35 C75 25 82 23 92 24 C97 25 99 30 98 35 C94 33 88 34 85 36 Z" fill="#0f172a" />
                  {/* Eyes & Smile */}
                  <circle cx="83" cy="38" r="1" fill="#0f172a" />
                  <circle cx="88" cy="38" r="1" fill="#0f172a" />
                  <path d="M84 42 Q86 44 88 42" stroke="#0f172a" strokeWidth="1" fill="none" strokeLinecap="round" />

                  {/* Laptop in front of Creator */}
                  <polygon points="90,94 130,94 125,97 95,97" fill="#64748b" />
                  <polygon points="94,72 126,72 128,94 92,94" fill="#0f172a" />
                  <rect x="96" y="74" width="28" height="17" rx="1.5" fill="#e0f2fe" />
                  {/* Digonto Sun Logo on Laptop */}
                  <circle cx="110" cy="81" r="3" fill="#f59e0b" />
                  <path d="M104 85 Q110 83 116 85" stroke="#0284c7" strokeWidth="1.5" fill="none" />

                  {/* Second Monitor with YouTube Play */}
                  <rect x="130" y="55" width="26" height="20" rx="3" fill="#1e293b" />
                  <rect x="132" y="57" width="22" height="16" rx="1.5" fill="#f8fafc" />
                  <rect x="137" y="61" width="12" height="8" rx="2" fill="#ef4444" />
                  <polygon points="142,63.5 146,65 142,66.5" fill="white" />
                  <line x1="143" y1="75" x2="143" y2="85" stroke="#334155" strokeWidth="2" />
                  <line x1="138" y1="85" x2="148" y2="85" stroke="#334155" strokeWidth="2" strokeLinecap="round" />

                  {/* Potted Plant on Desk */}
                  <g transform="translate(148, 70)">
                    <polygon points="2,24 10,24 9,14 3,14" fill="#f59e0b" />
                    <path d="M6 14 C6 7, 2 7, 2 14 Z" fill="#10b981" />
                    <path d="M6 14 C6 7, 10 7, 10 14 Z" fill="#059669" />
                  </g>
                </svg>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 2: ভিডিও ক্যাটাগরি (10 Categories Grid)
              ======================================================== */}
          <div className="space-y-2.5">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1e5eb3] text-white flex items-center justify-center flex-shrink-0">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 font-bengali">
                  ভিডিও ক্যাটাগরি
                </h2>
              </div>

              {selectedCategory ? (
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className="text-xs font-semibold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <span>সব দেখুন</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <span className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-0.5 cursor-pointer">
                  <span>সব ক্যাটাগরি দেখুন</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              )}
            </div>

            {/* 10 Category Cards Grid (2 rows x 5 items matching mockup) */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.name;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategory(isSelected ? null : cat.name)
                    }
                    className={`p-2.5 rounded-2xl border text-left transition-all relative flex flex-col justify-between active:scale-95 group ${
                      cat.bgColor
                    } ${cat.borderColor} ${
                      isSelected
                        ? "ring-2 ring-[#0b2654] shadow-md scale-[1.02]"
                        : "hover:shadow-sm"
                    }`}
                  >
                    {/* Top Row: Icon + Right Chevron */}
                    <div className="flex items-center justify-between mb-1.5">
                      <div
                        className={`w-7 h-7 rounded-xl ${cat.iconBg} ${cat.iconColor} flex items-center justify-center flex-shrink-0 shadow-xs`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>

                    {/* Category Title */}
                    <h3 className="text-xs font-bold text-slate-900 leading-tight font-bengali mb-1">
                      {cat.name}
                    </h3>

                    {/* Subtext: 1টি ভিডিও ও ৳10/৳15/৳30 */}
                    <div className="flex items-center justify-between text-[10px] text-slate-600 font-medium">
                      <span>{cat.count}</span>
                      <span className="font-bold text-slate-900">{cat.reward}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              SECTION 3: কিভাবে কাজ করবেন? (4-Step Sequential Flow)
              ======================================================== */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
            {/* Header with Gear */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-[#1e5eb3] text-white flex items-center justify-center flex-shrink-0">
                <Settings className="w-3.5 h-3.5" />
              </div>
              <h2 className="text-base font-bold text-slate-900 font-bengali">
                কিভাবে কাজ করবেন?
              </h2>
            </div>

            {/* 4 Steps Row with Connecting Carets `>` */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-none">
              {/* Step 1 */}
              <div className="flex-1 min-w-[75px] flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center shadow-xs mb-1.5">
                  <PlaySquare className="w-5 h-5 fill-red-600 text-white" />
                </div>
                <h3 className="text-[11px] font-bold text-slate-900 leading-tight font-bengali">
                  ১. ভিডিও তৈরি করুন
                </h3>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-tight font-bengali">
                  আপনার মোবাইলে ভিডিও বানান
                </p>
              </div>

              {/* Arrow 1 */}
              <ChevronRight className="w-4 h-4 text-sky-400 flex-shrink-0 -mt-4" />

              {/* Step 2 */}
              <div className="flex-1 min-w-[75px] flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center shadow-xs mb-1.5">
                  <Upload className="w-5 h-5" />
                </div>
                <h3 className="text-[11px] font-bold text-slate-900 leading-tight font-bengali">
                  ২. ভিডিও আপলোড করুন
                </h3>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-tight font-bengali">
                  ভিডিও কন্টেন্ট আপলোড করুন
                </p>
              </div>

              {/* Arrow 2 */}
              <ChevronRight className="w-4 h-4 text-sky-400 flex-shrink-0 -mt-4" />

              {/* Step 3 */}
              <div className="flex-1 min-w-[75px] flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-xs mb-1.5">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-[11px] font-bold text-slate-900 leading-tight font-bengali">
                  ৩. অ্যাডমিন রিভিউ
                </h3>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-tight font-bengali">
                  অ্যাডমিন যাচাই করে অনুমোদন দেবেন
                </p>
              </div>

              {/* Arrow 3 */}
              <ChevronRight className="w-4 h-4 text-sky-400 flex-shrink-0 -mt-4" />

              {/* Step 4 */}
              <div className="flex-1 min-w-[75px] flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shadow-xs mb-1.5">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="text-[11px] font-bold text-slate-900 leading-tight font-bengali">
                  ৪. আয় যোগ হবে
                </h3>
                <p className="text-[9px] text-slate-500 mt-0.5 leading-tight font-bengali">
                  অনুমোদন হলে ব্যালেন্সে টাকা যোগ হবে
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 4: ভিডিও কনটেন্ট তালিকা (Cards Grid)
              ======================================================== */}
          <div className="space-y-3">
            {/* Header + Search Bar + Filter Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              {/* Title */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#1e5eb3] text-white flex items-center justify-center flex-shrink-0">
                  <Play className="w-3 h-3 fill-white text-white ml-0.5" />
                </div>
                <h2 className="text-base font-bold text-slate-900 font-bengali">
                  ভিডিও কনটেন্ট তালিকা
                </h2>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {filteredVideos.length}
                </span>
              </div>

              {/* Search & Filter Buttons */}
              <div className="flex items-center gap-2">
                {/* Search Input Box */}
                <div className="relative flex-1 sm:w-44">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="ভিডিও খুঁজুন..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 bg-white"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Filter Button */}
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(true)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors shadow-2xs ${
                    selectedStatus !== "ALL"
                      ? "bg-[#0b2654] text-white"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>ফিল্টার</span>
                </button>
              </div>
            </div>

            {/* Video Cards Grid (2 Columns, Matching Mockup Exactly) */}
            <div className="grid grid-cols-2 gap-2.5">
              {filteredVideos.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveVideo(item)}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group active:scale-[0.99]"
                >
                  {/* Video Thumbnail with Play Button & Duration Badge */}
                  <div className="relative w-full aspect-video bg-slate-900 overflow-hidden flex items-center justify-center">
                    {/* SVG Rendered Dynamic Thumbnail Graphics Matching Each Card */}
                    {item.thumbnailType === "registration" && (
                      <div className="w-full h-full bg-gradient-to-tr from-[#0284c7] via-[#0b2654] to-[#1e5eb3] p-2 flex items-center justify-between">
                        <div className="w-8 h-12 bg-white rounded-md p-1 shadow-md flex flex-col justify-between">
                          <div className="w-full h-1.5 bg-blue-500 rounded" />
                          <div className="w-3/4 h-1 bg-slate-300 rounded" />
                          <div className="w-full h-2 bg-emerald-500 rounded-xs" />
                        </div>
                        <div className="text-right">
                          <div className="text-[9px] font-bold text-white">দিগন্ত</div>
                          <div className="text-[7px] text-sky-200">সাইন আপ</div>
                        </div>
                      </div>
                    )}

                    {item.thumbnailType === "deposit" && (
                      <div className="w-full h-full bg-gradient-to-tr from-[#065f46] via-[#047857] to-[#10b981] p-2 flex items-center justify-around">
                        <div className="w-8 h-12 bg-white rounded-md p-1 shadow-md flex flex-col items-center justify-center">
                          <span className="text-[10px] font-black text-emerald-600">৳</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-bold text-[10px] flex items-center justify-center">
                            ৳
                          </div>
                          <span className="text-[8px] font-bold text-white mt-1">ডিপোজিট</span>
                        </div>
                      </div>
                    )}

                    {item.thumbnailType === "work" && (
                      <div className="w-full h-full bg-gradient-to-tr from-[#1e3a8a] via-[#1d4ed8] to-[#3b82f6] p-2 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <span className="text-[8px] font-bold text-amber-300 bg-black/40 px-1 py-0.5 rounded">কাজ করুন</span>
                          <div className="text-[9px] font-black text-white">আয় করুন</div>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-amber-500 flex items-center justify-center text-white text-[10px] font-bold">
                          ✓
                        </div>
                      </div>
                    )}

                    {item.thumbnailType === "withdraw" && (
                      <div className="w-full h-full bg-gradient-to-tr from-[#581c87] via-[#7e22ce] to-[#a855f7] p-2 flex items-center justify-around">
                        <div className="w-10 h-8 rounded-lg bg-emerald-600 p-1 flex items-center justify-center shadow-md">
                          <span className="text-[10px] font-bold text-white">উইথড্র</span>
                        </div>
                        <div className="text-amber-300 font-bold text-lg">?</div>
                      </div>
                    )}

                    {item.thumbnailType === "overview" && (
                      <div className="w-full h-full bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#0284c7] p-2 flex items-center justify-between">
                        <div className="w-8 h-12 bg-white rounded-md p-0.5 shadow-md flex flex-col items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-[7px]">☀️</div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-extrabold text-white">দিগন্ত</div>
                          <div className="text-[7px] text-sky-300">অ্যাপ ধারণা</div>
                        </div>
                      </div>
                    )}

                    {item.thumbnailType === "level" && (
                      <div className="w-full h-full bg-gradient-to-tr from-[#14532d] via-[#15803d] to-[#22c55e] p-2 flex items-center justify-between">
                        <div className="space-y-0.5">
                          <div className="text-[9px] font-black text-amber-300 flex items-center gap-1">
                            <span>👑</span>
                            <span>দিগন্ত স্তর</span>
                          </div>
                          <span className="text-[7px] text-white bg-black/30 px-1 py-0.5 rounded">প্যাকেজ</span>
                        </div>
                        <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-900 font-bold text-[10px] flex items-center justify-center">
                          ★
                        </div>
                      </div>
                    )}

                    {item.thumbnailType === "referral" && (
                      <div className="w-full h-full bg-gradient-to-tr from-[#831843] via-[#be185d] to-[#f43f5e] p-2 flex items-center justify-around">
                        <div className="flex items-center gap-1">
                          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[7px]">👤</div>
                          <div className="w-5 h-5 rounded-full bg-amber-300 flex items-center justify-center text-[8px]">👤</div>
                          <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center text-[7px]">👤</div>
                        </div>
                        <span className="text-[8px] font-bold text-white">রেফারেল</span>
                      </div>
                    )}

                    {item.thumbnailType === "gift" && (
                      <div className="w-full h-full bg-gradient-to-tr from-[#0369a1] via-[#0284c7] to-[#38bdf8] p-2 flex items-center justify-around">
                        <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-amber-300 text-base shadow-md">
                          🎁
                        </div>
                        <span className="text-[8px] font-bold text-white">গিফট কোড</span>
                      </div>
                    )}

                    {item.thumbnailType === "troubleshoot" && (
                      <div className="w-full h-full bg-gradient-to-tr from-[#3b0764] via-[#581c87] to-[#7c3aed] p-2 flex items-center justify-around">
                        <div className="text-xl font-bold text-white flex items-center gap-1">
                          <span>?</span>
                          <span className="text-rose-400">?</span>
                        </div>
                        <span className="text-[8px] font-bold text-white">সমাধান</span>
                      </div>
                    )}

                    {item.thumbnailType === "guide" && (
                      <div className="w-full h-full bg-gradient-to-tr from-[#0284c7] via-[#0b2654] to-[#047857] p-2 flex items-center justify-between">
                        <div className="w-8 h-12 bg-white rounded-md p-1 shadow-md flex flex-col justify-between">
                          <div className="w-full h-2 bg-blue-600 rounded-xs" />
                          <div className="w-full h-1 bg-slate-200 rounded" />
                          <div className="w-full h-1 bg-slate-200 rounded" />
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-amber-300">দিগন্ত</div>
                          <div className="text-[7px] text-white">সম্পূর্ণ গাইড</div>
                        </div>
                      </div>
                    )}

                    {/* Red Play Button Center Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                        <Play className="w-3.5 h-3.5 fill-white text-white ml-0.5" />
                      </div>
                    </div>

                    {/* Duration Badge Bottom Right */}
                    <div className="absolute bottom-1 right-1.5 bg-black/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded">
                      {item.duration}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-2.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Title */}
                      <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 font-bengali">
                        {item.title}
                      </h3>

                      {/* Category Pill */}
                      <div className="mt-1">
                        <span className="text-[9px] font-semibold text-sky-700 bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200/80 inline-block truncate max-w-full">
                          {item.category}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Row: Reward + Status Badge + 3-dots */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                      {/* Reward */}
                      <span className="font-extrabold text-slate-900">
                        ৳{item.reward}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 ${item.statusColor}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        <span>{item.statusText}</span>
                      </span>

                      {/* Options Icon */}
                      <MoreVertical className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredVideos.length === 0 && (
              <div className="text-center py-10 bg-white rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-700">কোনো ভিডিও পাওয়া যায়নি!</p>
                <p className="text-[11px] text-slate-500 mt-1">অন্য কোনো শব্দ বা ক্যাটাগরি দিয়ে চেষ্টা করুন।</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory(null);
                    setSelectedStatus("ALL");
                  }}
                  className="mt-3 px-3 py-1.5 rounded-xl bg-[#0b2654] text-white text-xs font-bold"
                >
                  সব ফিল্টার মুছুন
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ========================================================
            MODAL 1: VIDEO UPLOAD MODAL ("ভিডিও বানান আয় করুন ↗")
            ======================================================== */}
        {uploadModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setUploadModalOpen(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 font-bengali">
                      ভিডিও কনটেন্ট জমা দিন
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      ভিডিও অনুমোদন হলে ব্যালেন্সে টাকা যুক্ত হবে
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form Feedback Alerts */}
              {submitSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{submitSuccess}</span>
                </div>
              )}

              {formError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleUploadSubmit} className="space-y-3.5">
                {/* Category Select */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    ভিডিওর ক্যাটাগরি নির্বাচন করুন *
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name} ({c.reward} রিওয়ার্ড)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Video Title */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    ভিডিওর শিরোনাম *
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: একাউন্ট রেজিস্ট্রেশন কিভাবে করবেন?"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                {/* Video URL */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span>ভিডিওর লিংক (YouTube / Facebook / Drive) *</span>
                    <span className="text-[10px] text-slate-500">পাবলিক লিংক</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://youtube.com/watch?v=... বা https://fb.watch/..."
                    value={uploadUrl}
                    onChange={(e) => setUploadUrl(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                    required
                  />
                </div>

                {/* Duration */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    ভিডিওর দৈর্ঘ্য (মিনিট:সেকেন্ড)
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: 08:30"
                    value={uploadDuration}
                    onChange={(e) => setUploadDuration(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-800">
                    অতিরিক্ত নোট বা বিবরণ (ঐচ্ছিক)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ভিডিও সম্পর্কে সংক্ষেপে কিছু লিখুন..."
                    value={uploadNotes}
                    onChange={(e) => setUploadNotes(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 font-bengali"
                  />
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
                      <span>ভিডিও সাবমিট করুন</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 2: FILTER MODAL
            ======================================================== */}
        {filterModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setFilterModalOpen(false)}
          >
            <div
              className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900 font-bengali flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  <span>স্ট্যাটাস অনুযায়ী ফিল্টার করুন</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                {[
                  { key: "ALL", label: "সব ভিডিও (All)" },
                  { key: "APPROVED", label: "অনুমোদিত (Approved)" },
                  { key: "PENDING", label: "পেন্ডিং (Pending)" },
                  { key: "UNDER_REVIEW", label: "রিভিউ চলছে (Under Review)" },
                  { key: "REJECTED", label: "বাতিল (Rejected)" },
                ].map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => {
                      setSelectedStatus(item.key);
                      setFilterModalOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                      selectedStatus === item.key
                        ? "bg-[#0b2654] text-white"
                        : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {selectedStatus === item.key && (
                      <Check className="w-4 h-4 text-amber-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 3: VIDEO DETAIL & PLAYER PREVIEW MODAL
            ======================================================== */}
        {activeVideo && (
          <div
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setActiveVideo(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl space-y-3"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Player Mockup */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl animate-pulse">
                  <Play className="w-7 h-7 fill-white text-white ml-1" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                  {activeVideo.duration}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Video Details */}
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug font-bengali">
                    {activeVideo.title}
                  </h3>
                  <span className="text-sm font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 flex-shrink-0">
                    ৳{activeVideo.reward}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded font-semibold border border-sky-200">
                    {activeVideo.category}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${activeVideo.statusColor}`}
                  >
                    {activeVideo.statusText}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-bengali bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {activeVideo.description}
                </p>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadCategory(activeVideo.category);
                      setUploadTitle(`আমার ভিডিও: ${activeVideo.title}`);
                      setActiveVideo(null);
                      setUploadModalOpen(true);
                    }}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white text-xs font-bold shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-1.5"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-400" />
                    <span>এই বিষয়ের ওপর ভিডিও বানান</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveVideo(null)}
                    className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
