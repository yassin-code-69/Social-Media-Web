"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Briefcase,
  PlusCircle,
  Users,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  Wallet,
  ArrowRight,
  Clock,
  Plus,
  Trash2,
  Eye,
  ShieldCheck,
  X,
  FileText,
} from "lucide-react";
import { useMockStore, TaskItem } from "@/lib/mock-store";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function CreateWorkPage() {
  const router = useRouter();
  const { profile, tasks, createTask, adjustUserWallet } = useMockStore();

  const [activeTab, setActiveTab] = useState<"create" | "my_jobs">("create");

  // Step 1: Category & Platform
  const platforms = [
    {
      id: "facebook",
      name: "Facebook Work",
      minRate: 0.25,
      iconType: "facebook",
      subtypes: [
        "Page Follower By Search",
        "Post Love React & Comment",
        "Group Post / Share",
        "Reels Video 1 Min Watch",
        "Page 5-Star Review",
      ],
    },
    {
      id: "instagram",
      name: "Instagram Work",
      minRate: 0.30,
      iconType: "instagram",
      subtypes: ["Account Follow", "Post Like & Comment", "Reels Watch & Share"],
    },
    {
      id: "youtube",
      name: "YouTube Work",
      minRate: 0.50,
      iconType: "youtube",
      subtypes: [
        "Video Watch 3 Min & Subscribe",
        "Video Like & Positive Comment",
        "Shorts Watch & Share",
      ],
    },
    {
      id: "apps",
      name: "Apps Work",
      minRate: 1.50,
      iconType: "apps",
      subtypes: ["Install & Open 2 Min", "PlayStore 5-Star Review", "App Signup & Test"],
    },
    {
      id: "buysell",
      name: "Buy & Sell",
      minRate: 5.00,
      iconType: "buysell",
      subtypes: ["Gmail Account Buy/Sell", "Facebook Old ID Buy/Sell"],
    },
    {
      id: "tiktok",
      name: "TikTok Work",
      minRate: 0.30,
      iconType: "tiktok",
      subtypes: ["Video Like & Follow", "Video Copy Link & Share"],
    },
    {
      id: "telegram",
      name: "Telegram Work",
      minRate: 0.25,
      iconType: "telegram",
      subtypes: ["Channel Join & Keep Unmuted", "Group Member Add"],
    },
    {
      id: "website",
      name: "Website / Captcha",
      minRate: 0.20,
      iconType: "website",
      subtypes: ["Website 1 Min Visit", "Article Read & Click", "Captcha Entry"],
    },
  ];

  const [selectedPlatform, setSelectedPlatform] = useState(platforms[0]);
  const [selectedSubtype, setSelectedSubtype] = useState(platforms[0].subtypes[0]);

  // Step 2: Details
  const [title, setTitle] = useState("Facebook Page Follower By Search");
  const [targetUrl, setTargetUrl] = useState("https://facebook.com/");
  const [instructions, setInstructions] = useState<string[]>([
    "১. প্রদত্ত লিংকে গিয়ে পেজটি ভিজিট করুন।",
    "২. পেজে Follow এবং Like বাটনে ক্লিক করুন।",
    "৩. Following বাটন স্পষ্ট দেখা যাচ্ছে এমন অবস্থায় স্ক্রিনশট নিন।",
  ]);
  const [newStepText, setNewStepText] = useState("");
  const [requiresScreenshot, setRequiresScreenshot] = useState(true);
  const [requiresNote, setRequiresNote] = useState(true);
  const [proofDescription, setProofDescription] = useState("ফলো করা অবস্থার পরিষ্কার স্ক্রিনশট আপলোড করুন।");

  // Step 3: Budget & Workers
  const [workersCount, setWorkersCount] = useState<number>(20);
  const [rewardPerWorker, setRewardPerWorker] = useState<number>(0.30);
  const [validityDays, setValidityDays] = useState<number>(3);

  // Submitting state
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Calculations
  const totalWorkerCost = Number((workersCount * rewardPerWorker).toFixed(2));
  const platformFee = 0.00; // 0% promotional discount
  const totalCost = Number((totalWorkerCost + platformFee).toFixed(2));
  const hasEnoughBalance = profile.balance >= totalCost;

  // Change platform
  const handleSelectPlatform = (plat: typeof platforms[0]) => {
    setSelectedPlatform(plat);
    setSelectedSubtype(plat.subtypes[0]);
    setTitle(`${plat.name.split(" ")[0]} ${plat.subtypes[0]}`);
    if (rewardPerWorker < plat.minRate) {
      setRewardPerWorker(plat.minRate);
    }
  };

  // Add instruction step
  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepText.trim()) return;
    setInstructions([...instructions, `${instructions.length + 1}. ${newStepText.trim()}`]);
    setNewStepText("");
  };

  // Remove instruction step
  const handleRemoveStep = (idx: number) => {
    setInstructions(instructions.filter((_, i) => i !== idx));
  };

  // Handle Publish
  const handlePublishJob = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !targetUrl.trim()) {
      setFeedback({ type: "error", text: "কাজের শিরোনাম ও লিংক প্রদান করুন!" });
      return;
    }

    if (rewardPerWorker < selectedPlatform.minRate) {
      setFeedback({
        type: "error",
        text: `এই ক্যাটাগরির জন্য সর্বনিম্ন রেট ৳${selectedPlatform.minRate.toFixed(2)} প্রতি কর্মী!`,
      });
      return;
    }

    if (!hasEnoughBalance) {
      setFeedback({
        type: "error",
        text: `আপনার ব্যালেন্সে পর্যাপ্ত টাকা নেই! মোট প্রয়োজন ৳${totalCost.toFixed(2)}। দয়া করে রিচার্জ করুন।`,
      });
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      // 1. Deduct cost from wallet
      adjustUserWallet(totalCost, "DEBIT", `মাইক্রোজব পোস্ট: ${title} (${workersCount} জন কর্মী)`);

      // 2. Create the task in store
      createTask({
        title,
        platform: selectedPlatform.id as any,
        category: selectedPlatform.name,
        reward: rewardPerWorker,
        availableWorks: workersCount,
        action: selectedSubtype,
        description: proofDescription,
        instructions: instructions.length > 0 ? instructions : ["১. নির্দেশিকা অনুযায়ী কাজ সম্পন্ন করুন।"],
        targetUrl,
        requiredPackage: "সকল প্যাকেজ",
        requiresScreenshot,
        creatorId: profile.id,
        completedWorkers: 0,
        status: "ACTIVE",
        createdAt: "এইমাত্র",
      });

      setSubmitting(false);
      setFeedback({
        type: "success",
        text: "অভিনন্দন! আপনার কাজ সফলভাবে পাবলিশ হয়েছে এবং কর্মীরা কাজ শুরু করতে পারবে।",
      });
      setActiveTab("my_jobs");
      setTimeout(() => setFeedback(null), 5000);
    }, 700);
  };

  // Filter jobs created by user
  const userPostedJobs = tasks.filter((t) => t.creatorId === profile.id);

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      {/* Mobile/App Frame Container */}
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        {/* Official Digonto Brand Header */}
        <Header />

        <main className="flex-1 px-2.5 sm:px-3 pt-3 pb-24 flex flex-col gap-3 overflow-y-auto">
          {/* Subheader & Back Button */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              aria-label="Back"
              className="flex items-center gap-1.5 text-xs font-bold text-[#0b2654] hover:text-[#1e5eb3] py-1.5 px-3 rounded-xl bg-white shadow-2xs border border-sky-100 active:scale-95 transition-all font-bengali"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              <span>পেছনে যান</span>
            </button>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 block">আপনার ব্যালেন্স</span>
              <span className="text-xs font-extrabold text-[#0b2654] font-sans">
                ৳ {profile.balance.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Feedback Alert Toast */}
          {feedback && (
            <div
              className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm animate-in fade-in slide-in-from-top-2 ${
                feedback.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}
            >
              <div className="flex items-center gap-2">
                {feedback.type === "success" ? (
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                <span>{feedback.text}</span>
              </div>
              <button type="button" onClick={() => setFeedback(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}

          {/* Page Banner */}
          <div className="bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white p-4 rounded-2xl shadow-sm flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-sky-200 font-medium font-bengali">এমপ্লয়ার / জব পোস্টার হাব</span>
              <h2 className="text-base sm:text-lg font-extrabold text-white font-bengali leading-tight mt-0.5">
                নতুন কাজ পোস্ট করুন (Create Work)
              </h2>
              <span className="text-[11px] text-sky-100 mt-1 font-bengali">
                দ্রুত কর্মী নিয়োগ দিন, সোশ্যাল মিডিয়া ফলোয়ার ও এনগেজমেন্ট বাড়ান
              </span>
            </div>
            <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 flex-shrink-0">
              <PlusCircle className="w-6 h-6" />
            </div>
          </div>

          {/* Tab Switcher: 'নতুন কাজ পোস্ট' vs 'আমার পোস্ট করা কাজ' */}
          <div className="w-full bg-white border border-sky-100 rounded-full p-1 shadow-2xs flex items-center">
            <button
              type="button"
              onClick={() => setActiveTab("create")}
              className={`flex-1 py-2 text-center text-xs sm:text-sm font-bold rounded-full transition-all duration-200 font-bengali ${
                activeTab === "create"
                  ? "bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              নতুন কাজ পোস্ট
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("my_jobs")}
              className={`flex-1 py-2 text-center text-xs sm:text-sm font-bold rounded-full transition-all duration-200 font-bengali flex items-center justify-center gap-1.5 ${
                activeTab === "my_jobs"
                  ? "bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>আমার পোস্ট করা কাজ</span>
              <span className="text-[10px] bg-sky-100 text-[#0b2654] font-bold px-1.5 py-0.2 rounded-full">
                {userPostedJobs.length}
              </span>
            </button>
          </div>

          {/* TAB 1: CREATE JOB FORM */}
          {activeTab === "create" ? (
            <form onSubmit={handlePublishJob} className="flex flex-col gap-3 font-bengali">
              {/* STEP 1: SELECT PLATFORM & CATEGORY */}
              <div className="bg-white rounded-2xl p-4 border border-sky-100/80 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0b2654] text-white text-xs font-bold flex items-center justify-center font-sans">
                      ১
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                      প্ল্যাটফর্ম ও ক্যাটাগরি বেছে নিন
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#0284c7] font-semibold">
                    মিন: ৳{selectedPlatform.minRate.toFixed(2)}/কর্মী
                  </span>
                </div>

                {/* Platform Selection Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {platforms.map((plat) => {
                    const isSelected = selectedPlatform.id === plat.id;
                    return (
                      <button
                        key={plat.id}
                        type="button"
                        onClick={() => handleSelectPlatform(plat)}
                        className={`p-2.5 rounded-xl border text-left flex flex-col items-start gap-1 transition-all ${
                          isSelected
                            ? "bg-sky-50 border-[#1e5eb3] ring-2 ring-sky-300/40 shadow-xs"
                            : "bg-slate-50/70 border-slate-200/80 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs">
                            {plat.iconType === "facebook" && (
                              <div className="w-full h-full bg-[#1877f2] text-white rounded-md flex items-center justify-center font-extrabold">
                                f
                              </div>
                            )}
                            {plat.iconType === "youtube" && (
                              <div className="w-full h-full bg-[#ff0000] text-white rounded-md flex items-center justify-center font-bold">
                                ▶
                              </div>
                            )}
                            {plat.iconType === "instagram" && (
                              <div className="w-full h-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white rounded-md flex items-center justify-center text-[10px]">
                                📷
                              </div>
                            )}
                            {plat.iconType === "apps" && (
                              <div className="w-full h-full bg-sky-500 text-white rounded-md flex items-center justify-center text-[11px]">
                                📱
                              </div>
                            )}
                            {plat.iconType === "buysell" && (
                              <div className="w-full h-full bg-red-600 text-white rounded-md flex items-center justify-center text-[9px] font-bold">
                                Sell
                              </div>
                            )}
                            {plat.iconType === "tiktok" && (
                              <div className="w-full h-full bg-black text-white rounded-md flex items-center justify-center font-bold text-xs">
                                d
                              </div>
                            )}
                            {plat.iconType === "telegram" && (
                              <div className="w-full h-full bg-[#229ed9] text-white rounded-md flex items-center justify-center text-xs">
                                ✈
                              </div>
                            )}
                            {plat.iconType === "website" && (
                              <div className="w-full h-full bg-emerald-600 text-white rounded-md flex items-center justify-center text-xs">
                                🌐
                              </div>
                            )}
                          </div>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-[#1e5eb3]" />}
                        </div>
                        <span className="text-xs font-bold text-slate-900 mt-1 leading-tight">
                          {plat.name}
                        </span>
                        <span className="text-[10px] text-slate-500 font-sans">
                          ৳{plat.minRate.toFixed(2)}+
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Subtype selector */}
                <div className="mt-1">
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    কাজের ধরন (Work Type):
                  </label>
                  <select
                    value={selectedSubtype}
                    onChange={(e) => {
                      setSelectedSubtype(e.target.value);
                      setTitle(`${selectedPlatform.name.split(" ")[0]} ${e.target.value}`);
                    }}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-[#1e5eb3] outline-none"
                  >
                    {selectedPlatform.subtypes.map((sub, i) => (
                      <option key={i} value={sub}>
                        {sub}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* STEP 2: JOB DETAILS & INSTRUCTIONS */}
              <div className="bg-white rounded-2xl p-4 border border-sky-100/80 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0b2654] text-white text-xs font-bold flex items-center justify-center font-sans">
                    ২
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    কাজের বিবরণ ও নির্দেশনা
                  </h3>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    কাজের শিরোনাম (Job Title):
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1e5eb3] outline-none font-sans"
                    placeholder="যেমন: Facebook Page Follower By Search"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    কাজের টার্গেট লিংক (Target URL):
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      required
                      value={targetUrl}
                      onChange={(e) => setTargetUrl(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1e5eb3] outline-none font-sans pr-8"
                      placeholder="https://facebook.com/yourpage"
                    />
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-3" />
                  </div>
                </div>

                {/* Step-by-step Instructions list */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    ধাপ অনুযায়ী কাজের নির্দেশিকা (Step-by-step):
                  </label>
                  <div className="space-y-1.5 mb-2">
                    {instructions.map((step, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-50 border border-slate-150 text-xs text-slate-700"
                      >
                        <span className="truncate">{step}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveStep(idx)}
                          className="text-slate-400 hover:text-rose-600 p-1 flex-shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add step input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newStepText}
                      onChange={(e) => setNewStepText(e.target.value)}
                      placeholder="নতুন ধাপের নির্দেশিকা লিখুন..."
                      className="flex-1 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1e5eb3] outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddStep}
                      className="px-3 py-2 bg-sky-50 text-[#0284c7] hover:bg-sky-100 rounded-xl text-xs font-bold flex items-center gap-1 border border-sky-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>যোগ করুন</span>
                    </button>
                  </div>
                </div>

                {/* Proof Requirements Toggles */}
                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/70 border border-slate-150">
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        স্ক্রিনশট প্রুফ বাধ্যতামূলক
                      </span>
                      <span className="text-[10px] text-slate-500">
                        কর্মী কাজ শেষ করে ছবি আপলোড করবে
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={requiresScreenshot}
                      onChange={(e) => setRequiresScreenshot(e.target.checked)}
                      className="w-4 h-4 text-[#1e5eb3] rounded"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      প্রুফ নির্দেশিকা (কী প্রমাণ দিতে হবে):
                    </label>
                    <input
                      type="text"
                      value={proofDescription}
                      onChange={(e) => setProofDescription(e.target.value)}
                      placeholder="যেমন: ফলো করা অবস্থার স্পষ্ট স্ক্রিনশট দিন।"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1e5eb3] outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* STEP 3: WORKERS & BUDGET CALCULATION */}
              <div className="bg-white rounded-2xl p-4 border border-sky-100/80 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#0b2654] text-white text-xs font-bold flex items-center justify-center font-sans">
                    ৩
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900">
                    কর্মী সংখ্যা ও বাজেট হিসাব
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Workers Count */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      কর্মী সংখ্যা (Workers):
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={5000}
                      value={workersCount}
                      onChange={(e) => setWorkersCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 font-sans font-bold"
                    />
                    {/* Quick Add Pills */}
                    <div className="flex items-center gap-1 mt-1.5">
                      {[10, 25, 50, 100].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setWorkersCount(num)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            workersCount === num
                              ? "bg-[#0b2654] text-white border-[#0b2654]"
                              : "bg-slate-50 text-slate-600 border-slate-200"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Reward per worker */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      প্রতি কর্মীর পেমেন্ট (৳):
                    </label>
                    <input
                      type="number"
                      step={0.05}
                      min={selectedPlatform.minRate}
                      value={rewardPerWorker}
                      onChange={(e) => setRewardPerWorker(parseFloat(e.target.value) || selectedPlatform.minRate)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 font-sans font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      মিনিমাম ৳{selectedPlatform.minRate.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Validity days */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    কাজের মেয়াদ / সময়সীমা:
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 7].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setValidityDays(days)}
                        className={`py-1.5 text-xs font-bold rounded-xl border text-center transition-all ${
                          validityDays === days
                            ? "bg-[#1e5eb3] text-white border-[#1e5eb3] shadow-2xs"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        {days} দিন
                      </button>
                    ))}
                  </div>
                </div>

                {/* Real-time Cost Breakdown Box */}
                <div className="bg-gradient-to-r from-sky-50 to-blue-50 p-3 rounded-2xl border border-sky-150 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>কর্মী পেমেন্ট ({workersCount} × ৳{rewardPerWorker.toFixed(2)}):</span>
                    <span className="font-bold font-sans">৳ {totalWorkerCost.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-700">
                    <span>প্ল্যাটফর্ম সার্ভিস ফি:</span>
                    <span className="text-emerald-700 font-bold">৳ ০.০০ (ফ্রি অফার)</span>
                  </div>
                  <div className="pt-2 border-t border-sky-200/80 flex items-center justify-between text-sm font-extrabold text-[#0b2654]">
                    <span>সর্বমোট খরচ (Total Payable):</span>
                    <span className="font-sans text-base text-[#1e5eb3]">৳ {totalCost.toFixed(2)}</span>
                  </div>

                  {/* Balance indicator */}
                  <div className="pt-1">
                    {hasEnoughBalance ? (
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span>পর্যাপ্ত ব্যালেন্স আছে (বর্তমান: ৳{profile.balance.toFixed(2)})</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between bg-rose-50 p-2 rounded-xl border border-rose-200 text-xs">
                        <span className="text-rose-700 font-bold">
                          ব্যালেন্স কম আছে (ঘাটতি: ৳{(totalCost - profile.balance).toFixed(2)})
                        </span>
                        <Link
                          href="/deposit"
                          className="bg-[#dc2626] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-2xs"
                        >
                          ডিপোজিট করুন
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* STEP 4: LIVE WORKER PREVIEW CARD */}
              <div className="bg-white rounded-2xl p-4 border border-sky-100/80 shadow-sm flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#0284c7]" />
                    <h3 className="text-xs font-bold text-slate-900">
                      লাইভ প্রিভিউ (কর্মীরা যেভাবে দেখবে)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400">রিয়েলটাইম কার্ড</span>
                </div>

                {/* Worker Card Preview */}
                <div className="bg-white rounded-2xl p-3.5 border border-sky-200 shadow-sm flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-11 h-11 rounded-full border-2 border-slate-100 flex items-center justify-center flex-shrink-0 bg-[#1877f2] text-white font-extrabold text-xl">
                      {selectedPlatform.name[0]}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug truncate">
                        {title || "কাজের শিরোনাম"}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-0.5">
                        <Users className="w-3.5 h-3.5" />
                        <span>{workersCount} works available</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold px-2.5 py-1 rounded-xl shadow-2xs font-sans">
                    ৳ {rewardPerWorker.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* SUBMIT BUTTON */}
              <button
                type="submit"
                disabled={submitting || !hasEnoughBalance}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] hover:from-[#081f44] hover:to-[#174b8f] text-white font-extrabold text-sm shadow-md active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <span>জব পাবলিশ হচ্ছে...</span>
                ) : (
                  <>
                    <span>কনফার্ম ও জব পাবলিশ করুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* TAB 2: MY POSTED JOBS */
            <div className="flex flex-col gap-3 font-bengali">
              {userPostedJobs.length > 0 ? (
                <div className="flex flex-col gap-2.5">
                  {userPostedJobs.map((job) => (
                    <div
                      key={job.id}
                      className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm flex flex-col gap-2.5"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-xl bg-sky-50 text-[#0284c7] flex items-center justify-center font-bold text-xs">
                            {job.platform[0]?.toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                              {job.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">
                              পোস্ট করা হয়েছে: {job.createdAt || "আজ"}
                            </span>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-xl">
                          ৳{job.reward.toFixed(2)}/কর্মী
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 pt-1 border-t border-slate-100">
                        <div className="flex items-center justify-between text-[11px] text-slate-600">
                          <span>কর্মী প্রগ্রেস:</span>
                          <span className="font-bold">
                            {job.completedWorkers || 0} / {job.availableWorks || 10} সম্পন্ন
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#1e5eb3] to-[#0284c7] h-full rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                ((job.completedWorkers || 0) / (job.availableWorks || 10)) * 100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] font-bold bg-sky-100 text-[#0b2654] px-2 py-0.5 rounded-full">
                          ● সক্রিয় (Active)
                        </span>
                        <a
                          href={job.targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-[#1e5eb3] hover:underline flex items-center gap-1"
                        >
                          <span>লিংক দেখুন</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-10 border border-sky-100 shadow-sm flex flex-col items-center justify-center text-center my-2">
                  <div className="w-14 h-14 rounded-full bg-sky-50 text-[#0284c7] flex items-center justify-center mb-3">
                    <Briefcase className="w-7 h-7" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    আপনি এখনও কোনো কাজ পোস্ট করেননি
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1 mb-4">
                    নতুন কাজ পোস্ট করে ফেসবুক পেজ, ইউটিউব চ্যানেল ও সোশ্যাল প্রোফাইলে হাজার হাজার কর্মী যুক্ত করুন।
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveTab("create")}
                    className="py-2.5 px-5 bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white rounded-xl text-xs font-bold shadow-sm"
                  >
                    প্রথম কাজ পোস্ট করুন
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Official Digonto Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
