"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  Layers,
  Award,
  CheckCircle2,
  Lock,
  Briefcase,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  PlusCircle,
  MessageCircle,
  X,
  ExternalLink,
  UploadCloud,
  Sparkles,
  Trophy,
  ArrowRight,
  ArrowLeft,
  Crown,
  PenTool,
} from "lucide-react";
import { useMockStore, TaskItem, TaskSubmission } from "@/lib/mock-store";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";

export default function TasksPage() {
  const router = useRouter();
  const {
    tasks,
    submissions,
    profile,
    submitTaskProof,
    userSkillLevel,
    unlockNextSkillLevel,
    createTask,
    adjustUserWallet,
  } = useMockStore();

  // Navigation Views: "categories" | "category_tasks" | "my_submissions"
  const [currentView, setCurrentView] = useState<"categories" | "category_tasks" | "my_submissions">("categories");
  const [selectedCategoryKey, setSelectedCategoryKey] = useState<string>("facebook");

  // Submissions Tab Filter: "pending" | "approved" | "rejected"
  const [submissionFilter, setSubmissionFilter] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");

  // Modals
  const [activeWorksModalOpen, setActiveWorksModalOpen] = useState(false);
  const [skillModalOpen, setSkillModalOpen] = useState(false);
  const [skillQuizAnswer, setSkillQuizAnswer] = useState<string | null>(null);
  const [skillSuccess, setSkillSuccess] = useState(false);

  const [createWorkModalOpen, setCreateWorkModalOpen] = useState(false);
  const [newWorkTitle, setNewWorkTitle] = useState("");
  const [newWorkCategory, setNewWorkCategory] = useState("facebook");
  const [newWorkReward, setNewWorkReward] = useState("0.50");
  const [newWorkWorkers, setNewWorkWorkers] = useState("10");
  const [newWorkUrl, setNewWorkUrl] = useState("");
  const [newWorkInstructions, setNewWorkInstructions] = useState("");

  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [userNote, setUserNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  const [challengeModalOpen, setChallengeModalOpen] = useState(false);

  // Categories config matching Next IT Doctor system
  const categoriesList = [
    {
      key: "facebook",
      name: "Facebook Work",
      iconType: "facebook",
      availableCount: tasks.filter((t) => t.platform === "facebook").length || 45,
    },
    {
      key: "instagram",
      name: "instagram Work",
      iconType: "instagram",
      availableCount: tasks.filter((t) => t.platform === "instagram").length || 2,
    },
    {
      key: "youtube",
      name: "YouTube Work",
      iconType: "youtube",
      availableCount: tasks.filter((t) => t.platform === "youtube").length || 11,
    },
    {
      key: "apps",
      name: "Apps Work",
      iconType: "apps",
      availableCount: tasks.filter((t) => t.platform === "apps").length || 1,
    },
    {
      key: "buysell",
      name: "Gmail & facebook Buy - Sell",
      iconType: "buysell",
      availableCount: tasks.filter((t) => t.platform === "buysell").length || 2,
    },
    {
      key: "tiktok",
      name: "TikTok Work",
      iconType: "tiktok",
      availableCount: tasks.filter((t) => t.platform === "tiktok").length || 8,
    },
    {
      key: "telegram",
      name: "Telegram Work",
      iconType: "telegram",
      availableCount: tasks.filter((t) => t.platform === "telegram").length || 5,
    },
    {
      key: "content",
      name: "Content Writing Work (লিখে আয়)",
      iconType: "content",
      availableCount: tasks.filter((t) => t.platform === "content").length || 3,
      route: "/content-writing",
    },
  ];

  const openCategory = (key: string) => {
    const found = categoriesList.find((c) => c.key === key);
    if ((found as any)?.route) {
      router.push((found as any).route);
      return;
    }
    setSelectedCategoryKey(key);
    setCurrentView("category_tasks");
  };

  const currentCategoryObj = categoriesList.find((c) => c.key === selectedCategoryKey) || categoriesList[0];
  const currentCategoryTasks = tasks.filter(
    (t) => t.platform.toLowerCase() === selectedCategoryKey.toLowerCase()
  );

  const handleOpenSubmitModal = (task: TaskItem) => {
    setSelectedTask(task);
    setUserNote("");
    setSubmitModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setScreenshotPreview(url);
    }
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask || !screenshotPreview) return;

    setSubmitting(true);
    setTimeout(() => {
      submitTaskProof(selectedTask.id, screenshotPreview, userNote);
      setSubmitting(false);
      setSubmitModalOpen(false);
      setSubmitSuccessMsg(`কাজ '${selectedTask.title}' সফলভাবে জমা দেওয়া হয়েছে!`);
      setTimeout(() => setSubmitSuccessMsg(null), 4000);
    }, 600);
  };

  const handleCreateWorkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rewardNum = parseFloat(newWorkReward) || 0.5;
    const workersNum = parseInt(newWorkWorkers, 10) || 10;
    const totalCost = rewardNum * workersNum;

    if (profile.balance < totalCost) {
      alert(`পর্যাপ্ত ব্যালেন্স নেই! মোট খরচ হবে ৳${totalCost.toFixed(2)}`);
      return;
    }

    adjustUserWallet(totalCost, "DEBIT", `নতুন কাজ পোস্ট: ${newWorkTitle}`);

    createTask({
      title: newWorkTitle,
      platform: newWorkCategory as any,
      reward: rewardNum,
      availableWorks: workersNum,
      action: "নির্দেশনা মেনে কাজ সম্পন্ন করুন",
      description: newWorkInstructions || "কাজের নির্দেশনা সম্পূর্ণ অনুসরণ করে স্ক্রিনশট দিন।",
      instructions: [
        "১. প্রদত্ত লিংকে যান।",
        "২. সঠিকভাবে কাজ সম্পন্ন করুন।",
        "৩. স্ক্রিনশট তুলে প্রমাণ জমা দিন।",
      ],
      targetUrl: newWorkUrl || "https://facebook.com",
      requiredPackage: "সকল প্যাকেজ",
      requiresScreenshot: true,
    });

    setCreateWorkModalOpen(false);
    setNewWorkTitle("");
    setNewWorkUrl("");
    setNewWorkInstructions("");
    setSubmitSuccessMsg("আপনার জব সফলভাবে পোস্ট করা হয়েছে!");
    setTimeout(() => setSubmitSuccessMsg(null), 3500);
  };

  const filteredSubmissions = submissions.filter((s) => s.status === submissionFilter);
  const pendingCount = submissions.filter((s) => s.status === "PENDING").length;
  const approvedCount = submissions.filter((s) => s.status === "APPROVED").length;
  const rejectedCount = submissions.filter((s) => s.status === "REJECTED").length;

  return (
    <div className="w-full min-h-screen bg-[#dff0f8] flex flex-col">
      {/* Mobile/App Frame Container matching Digonto theme */}
      <div className="w-full max-w-lg mx-auto bg-[#eaf5fa] min-h-screen shadow-xl flex flex-col relative border-x border-slate-200/50">
        {/* Official Digonto Header */}
        <Header />

        <main className="flex-1 px-2.5 sm:px-3 pt-3 pb-24 flex flex-col gap-3 overflow-y-auto">
          {/* Subheader Title & Action Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white flex items-center justify-center font-bold text-xs shadow-xs font-bengali">
                টাস্ক
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 font-bengali leading-tight">
                  টাস্ক ও মাইক্রোজব সেন্টার
                </h2>
                <span className="text-[11px] text-slate-500 font-medium">
                  ক্যাটাগরি বেছে নিন এবং সহজ কাজ করে আয় করুন
                </span>
              </div>
            </div>

            {/* Create Work Button */}
            <Link
              href="/create"
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#1e5eb3] to-[#0284c7] hover:from-[#174b8f] hover:to-[#0369a1] text-white text-xs font-bold py-1.5 px-3 rounded-xl shadow-xs active:scale-95 transition-all font-bengali"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>কাজ দিন</span>
            </Link>
          </div>

          {/* Global Toast Success Message */}
          {submitSuccessMsg && (
            <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-sm animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{submitSuccessMsg}</span>
              </div>
              <button type="button" onClick={() => setSubmitSuccessMsg(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 1: CATEGORIES HUB (Next IT Doctor Architecture in Digonto Colors) */}
          {/* ========================================================================= */}
          {currentView === "categories" && (
            <div className="flex flex-col gap-3">
              {/* Top Dual Action Buttons: "My Active Works" & "My Submissions" */}
              <div className="grid grid-cols-2 gap-2.5">
                {/* Left: My Active Works in Digonto Navy */}
                <button
                  type="button"
                  onClick={() => setActiveWorksModalOpen(true)}
                  className="bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] hover:from-[#081f44] hover:to-[#174b8f] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm active:scale-98 transition-all text-left border border-sky-900/20"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-tight">My Active Works</span>
                    <span className="text-[10px] text-sky-200 mt-0.5 font-medium">Started or accepted</span>
                  </div>
                  <div className="bg-amber-400 text-slate-950 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-2xs">
                    0/3
                  </div>
                </button>

                {/* Right: My Submissions in Digonto Royal/Sky Blue */}
                <button
                  type="button"
                  onClick={() => setCurrentView("my_submissions")}
                  className="bg-gradient-to-r from-[#1e5eb3] to-[#0284c7] hover:from-[#174b8f] hover:to-[#0369a1] text-white p-3.5 rounded-2xl flex items-center justify-between shadow-sm active:scale-98 transition-all text-left border border-sky-700/20 group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-bold tracking-tight">My Submissions</span>
                    <span className="text-[10px] text-sky-100 mt-0.5 font-medium">View submitted works</span>
                  </div>
                  <div className="text-white group-hover:translate-x-0.5 transition-transform">
                    <ChevronRight className="w-5 h-5 stroke-[2.5]" />
                  </div>
                </button>
              </div>

              {/* Work Skill Assessment Card */}
              <div
                onClick={() => setSkillModalOpen(true)}
                className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm hover:shadow-md cursor-pointer transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 flex items-center justify-center text-[#1e5eb3]">
                    <Layers className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-xs sm:text-[13px] font-bold text-slate-900 font-bengali">
                    কাজের দক্ষতা যাচাই (Work Skill Assessment)
                  </h3>
                </div>

                {/* Stepper Level Indicators */}
                <div className="flex items-center justify-between px-2 pt-1">
                  {/* Level 1 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shadow-2xs">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-1">Level 1</span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  </div>

                  {/* Dashed Line */}
                  <div className="flex-1 border-t-2 border-dashed border-sky-200 mx-2 -mt-5" />

                  {/* Level 2 */}
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-2xs ${
                        userSkillLevel >= 2
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-1">Level 2</span>
                    <span
                      className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                        userSkillLevel >= 2 ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {userSkillLevel >= 2 ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Unlocked</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Dashed Line */}
                  <div className="flex-1 border-t-2 border-dashed border-sky-200 mx-2 -mt-5" />

                  {/* Level 3 */}
                  <div className="flex flex-col items-center text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center shadow-2xs ${
                        userSkillLevel >= 3
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                          : "bg-slate-100 text-slate-400 border border-slate-200"
                      }`}
                    >
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-800 mt-1">Level 3</span>
                    <span
                      className={`text-[10px] font-semibold flex items-center gap-0.5 ${
                        userSkillLevel >= 3 ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {userSkillLevel >= 3 ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Unlocked</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category Header Card */}
              <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-sky-50 text-[#0284c7] flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-sm font-bold text-[#0b2654] font-bengali leading-tight">
                      আপনার কাজের ক্যাটাগরি নির্ধারণ...
                    </h3>
                    <span className="text-[11px] text-slate-700 font-semibold font-bengali mt-0.5">
                      কোন অংশে কাজ করতে চান
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Choose a category to start earning.
                    </span>
                  </div>
                </div>

                {/* Clipboard Graphic */}
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-11 h-11">
                    <rect x="8" y="10" width="28" height="34" rx="4" fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
                    <rect x="16" y="6" width="12" height="6" rx="2" fill="#3b82f6" />
                    <circle cx="22" cy="9" r="1.5" fill="white" />
                    <path d="M14 19 L18 23 L26 15" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    <line x1="14" y1="28" x2="30" y2="28" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
                    <line x1="14" y1="34" x2="26" y2="34" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" />
                    <rect x="26" y="28" width="14" height="11" rx="2" fill="#0284c7" />
                    <path d="M30 28 V26 C30 25 31 24 32 24 H34 C35 24 36 25 36 26 V28" stroke="#0284c7" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>

              {/* Platform Categories List */}
              <div className="flex flex-col gap-2.5">
                {categoriesList.map((cat) => (
                  <div
                    key={cat.key}
                    onClick={() => openCategory(cat.key)}
                    className="bg-white rounded-2xl p-3.5 border border-sky-100/70 hover:border-sky-300 shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      {/* Platform Icon */}
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-2xs overflow-hidden flex-shrink-0">
                        {cat.iconType === "facebook" && (
                          <div className="w-full h-full bg-[#1877f2] flex items-center justify-center text-white font-extrabold text-2xl font-sans">
                            f
                          </div>
                        )}
                        {cat.iconType === "instagram" && (
                          <div className="w-full h-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white p-2.5">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
                              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                            </svg>
                          </div>
                        )}
                        {cat.iconType === "youtube" && (
                          <div className="w-full h-full bg-[#212121] flex items-center justify-center p-2">
                            <div className="w-8 h-6 bg-[#ff0000] rounded-md flex items-center justify-center">
                              <div className="w-0 h-0 border-y-[4px] border-y-transparent border-l-[7px] border-l-white ml-0.5" />
                            </div>
                          </div>
                        )}
                        {cat.iconType === "apps" && (
                          <div className="w-full h-full bg-gradient-to-b from-sky-400 to-[#1e5eb3] flex items-center justify-center p-2 text-white">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                              <path d="M12 18h.01" />
                            </svg>
                          </div>
                        )}
                        {cat.iconType === "buysell" && (
                          <div className="w-full h-full bg-[#dc2626] rounded-full flex items-center justify-center text-white font-extrabold text-[11px] shadow-xs">
                            Sell!
                          </div>
                        )}
                        {cat.iconType === "tiktok" && (
                          <div className="w-full h-full bg-black flex items-center justify-center text-white font-bold text-lg">
                            d
                          </div>
                        )}
                        {cat.iconType === "telegram" && (
                          <div className="w-full h-full bg-[#229ed9] flex items-center justify-center text-white font-bold">
                            ✈
                          </div>
                        )}
                        {cat.iconType === "content" && (
                          <div className="w-full h-full bg-gradient-to-tr from-[#8b5cf6] to-[#3b82f6] flex items-center justify-center text-white">
                            <PenTool className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Category Title & Count */}
                      <div className="flex flex-col">
                        <h4 className="text-sm font-bold text-slate-900 tracking-tight">
                          {cat.name}
                        </h4>
                        <span className="text-xs text-slate-400 font-medium mt-0.5">
                          {cat.availableCount} works available
                        </span>
                      </div>
                    </div>

                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: CATEGORY TASKS LIST */}
          {/* ========================================================================= */}
          {currentView === "category_tasks" && (
            <div className="flex flex-col gap-3">
              {/* Breadcrumb Navigation: ক্যাটাগরি > Category Name */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setCurrentView("categories")}
                  className="font-bold text-[#1e5eb3] hover:underline font-bengali flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>ক্যাটাগরি সমূহ</span>
                </button>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-semibold text-slate-900">{currentCategoryObj.name}</span>
              </div>

              {/* Category Title & Subtext */}
              <div className="bg-white rounded-2xl p-4 border border-sky-100 shadow-sm flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                    {currentCategoryObj.name}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Choose a work type, then open a specific work
                  </p>
                </div>
                <div className="bg-sky-50 text-[#0284c7] font-bold text-xs px-3 py-1 rounded-xl">
                  {currentCategoryTasks.length} টি কাজ
                </div>
              </div>

              {/* Task Cards List */}
              <div className="flex flex-col gap-2.5">
                {currentCategoryTasks.length > 0 ? (
                  currentCategoryTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleOpenSubmitModal(task)}
                      className="bg-white rounded-2xl p-3.5 border border-sky-100/70 hover:border-sky-300 shadow-sm hover:shadow-md active:scale-[0.99] transition-all cursor-pointer flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Platform Icon */}
                        <div className="w-11 h-11 rounded-full border-2 border-slate-100 flex items-center justify-center flex-shrink-0 overflow-hidden shadow-2xs">
                          {currentCategoryObj.iconType === "facebook" ? (
                            <div className="w-full h-full bg-[#1877f2] flex items-center justify-center text-white font-extrabold text-xl font-sans">
                              f
                            </div>
                          ) : currentCategoryObj.iconType === "youtube" ? (
                            <div className="w-full h-full bg-[#ff0000] flex items-center justify-center text-white font-bold text-xs">
                              ▶
                            </div>
                          ) : currentCategoryObj.iconType === "instagram" ? (
                            <div className="w-full h-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white text-xs font-bold">
                              📷
                            </div>
                          ) : (
                            <div className="w-full h-full bg-[#1e5eb3] flex items-center justify-center text-white font-bold text-xs">
                              ★
                            </div>
                          )}
                        </div>

                        {/* Task Info */}
                        <div className="flex flex-col min-w-0">
                          <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug truncate">
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold mt-0.5">
                            <Users className="w-3.5 h-3.5 stroke-[2.2]" />
                            <span>{task.availableWorks || 10} works available</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Green Reward Badge & Chevron */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold px-2.5 py-1 rounded-xl shadow-2xs font-sans">
                          ৳ {task.reward.toFixed(2)}
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white rounded-2xl p-10 text-center text-slate-400 border border-sky-100 shadow-sm">
                    <p className="text-xs">এই ক্যাটাগরিতে বর্তমানে কোনো কাজ নেই।</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: MY SUBMISSIONS */}
          {/* ========================================================================= */}
          {currentView === "my_submissions" && (
            <div className="flex flex-col gap-3">
              {/* Back Bar */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentView("categories")}
                  className="flex items-center gap-1 text-xs font-bold text-[#0b2654] hover:text-[#1e5eb3] bg-white py-1.5 px-3 rounded-xl shadow-2xs border border-sky-100 font-bengali"
                >
                  <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                  <span>ক্যাটাগরি হাব</span>
                </button>
                <h2 className="text-sm font-bold text-slate-900">
                  My Submissions
                </h2>
              </div>

              {/* Challenge Banner in Digonto Royal Navy / Gold Gradient */}
              <div className="bg-gradient-to-r from-[#0b2654] via-[#1e5eb3] to-[#0284c7] text-white p-4 rounded-2xl flex items-center justify-between shadow-sm border border-sky-900/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-amber-300">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <h4 className="text-xs sm:text-sm font-bold tracking-tight">
                      My Challenge Work
                    </h4>
                    <span className="text-[10px] text-sky-100 font-medium">
                      View your challenge submissions
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setChallengeModalOpen(true)}
                  className="bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold px-3.5 py-1.5 rounded-full shadow-2xs active:scale-95 transition-all flex items-center gap-1"
                >
                  <span>View</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Status Filter Pills: Pending, Approved, Rejected */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                {/* Pending */}
                <button
                  type="button"
                  onClick={() => setSubmissionFilter("PENDING")}
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs whitespace-nowrap ${
                    submissionFilter === "PENDING"
                      ? "bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white font-bold"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Pending ({pendingCount})</span>
                </button>

                {/* Approved */}
                <button
                  type="button"
                  onClick={() => setSubmissionFilter("APPROVED")}
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs whitespace-nowrap ${
                    submissionFilter === "APPROVED"
                      ? "bg-emerald-600 text-white font-bold"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Approved ({approvedCount})</span>
                </button>

                {/* Rejected */}
                <button
                  type="button"
                  onClick={() => setSubmissionFilter("REJECTED")}
                  className={`flex-1 py-2 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs whitespace-nowrap ${
                    submissionFilter === "REJECTED"
                      ? "bg-rose-600 text-white font-bold"
                      : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Rejected ({rejectedCount})</span>
                </button>
              </div>

              {/* Submissions List or Empty State */}
              {filteredSubmissions.length > 0 ? (
                <div className="flex flex-col gap-2.5">
                  {filteredSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="bg-white rounded-2xl p-3.5 border border-sky-100 shadow-sm flex flex-col gap-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs uppercase text-slate-700">
                            {sub.platform[0]}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 leading-tight">
                              {sub.taskTitle}
                            </h4>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">
                              {sub.submittedAt}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs font-extrabold text-emerald-600 font-sans">
                          ৳ {sub.reward.toFixed(2)}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            sub.status === "APPROVED"
                              ? "bg-emerald-100 text-emerald-800"
                              : sub.status === "PENDING"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800"
                          }`}
                        >
                          {sub.status === "APPROVED"
                            ? "অনুমোদিত ✓"
                            : sub.status === "PENDING"
                            ? "পর্যালোচনাধীন (Pending)"
                            : "বাতিল (Rejected)"}
                        </span>
                        {sub.userNote && (
                          <span className="text-[10px] text-slate-400 italic truncate max-w-[160px]">
                            নোট: {sub.userNote}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-10 border border-sky-100 shadow-sm flex flex-col items-center justify-center text-center my-2">
                  <div className="w-14 h-14 rounded-full border-2 border-slate-400 flex items-center justify-center text-slate-500 mb-3">
                    <Clock className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                    No {submissionFilter.toLowerCase()} submissions
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    You have no {submissionFilter.toLowerCase()} works right now.
                  </p>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Floating Support Button in Digonto Navy/Sky Gradient */}
        <div className="fixed bottom-20 right-4 sm:right-[calc(50%-220px)] z-40">
          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            title="লাইভ সাপোর্ট"
            className="w-12 h-12 rounded-full bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] hover:from-[#081f44] hover:to-[#174b8f] text-white flex items-center justify-center shadow-lg shadow-sky-950/30 active:scale-95 transition-all"
          >
            <MessageCircle className="w-6 h-6 fill-white/20" />
          </a>
        </div>

        {/* Official Digonto 7-Tab Bottom Navigation */}
        <BottomNav />
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: TASK SUBMISSION & PROOF */}
      {/* ========================================================================= */}
      {submitModalOpen && selectedTask && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setSubmitModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom duration-200 max-h-[88vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-sm">
                  ৳
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">
                    {selectedTask.title}
                  </h3>
                  <span className="text-xs font-bold text-emerald-600">
                    রিওয়ার্ড: ৳ {selectedTask.reward.toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSubmitModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Instructions */}
            <div className="py-3 space-y-2.5 font-bengali">
              <div className="bg-sky-50/50 p-3 rounded-xl border border-sky-100">
                <h4 className="text-xs font-bold text-slate-800 mb-1.5">
                  কাজের নিয়ম ও নির্দেশনা:
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 leading-relaxed list-disc list-inside">
                  {selectedTask.instructions.map((inst, i) => (
                    <li key={i}>{inst}</li>
                  ))}
                </ul>
              </div>

              {/* Target Link */}
              <a
                href={selectedTask.targetUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-[#0284c7] text-xs font-bold flex items-center justify-center gap-1.5 border border-sky-200 transition-all active:scale-98"
              >
                <span>কাজের লিংকে যান (Open Link)</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {/* Screenshot Upload Form */}
              <form onSubmit={handleSubmitProof} className="space-y-3 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    প্রুফ স্ক্রিনশট আপলোড করুন:
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center bg-slate-50 hover:bg-slate-100 transition-colors">
                    {screenshotPreview ? (
                      <div className="relative group">
                        <img
                          src={screenshotPreview}
                          alt="Proof Preview"
                          className="w-full h-32 object-cover rounded-lg shadow-2xs"
                        />
                        <label className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg cursor-pointer text-xs font-bold">
                          ছবি পরিবর্তন করুন
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center cursor-pointer py-2">
                        <UploadCloud className="w-7 h-7 text-slate-400 mb-1" />
                        <span className="text-xs font-bold text-slate-600">
                          স্ক্রিনশট নির্বাচন করুন
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    ইউজার নোট (প্রযোজ্য ক্ষেত্রে):
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: আপনার প্রোফাইল নাম বা কমেন্ট..."
                    value={userNote}
                    onChange={(e) => setUserNote(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1e5eb3]"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all disabled:opacity-50"
                  >
                    {submitting ? "জমা হচ্ছে..." : "কাজ জমা দিন (Submit)"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: WORK SKILL ASSESSMENT QUIZ */}
      {/* ========================================================================= */}
      {skillModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSkillModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 font-bengali"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#1e5eb3]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  দক্ষতা যাচাই টেস্ট (Skill Level {userSkillLevel + 1})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSkillModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {skillSuccess ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-bold text-slate-900 text-base">
                  অভিনন্দন! দক্ষতা যাচাই সম্পন্ন হয়েছে!
                </h4>
                <p className="text-xs text-slate-500">
                  আপনি সফলভাবে পরবর্তী লেভেল আনলক করেছেন। এখন থেকে আরও বেশি রিওয়ার্ডের প্রিমিয়াম কাজ করতে পারবেন।
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSkillSuccess(false);
                    setSkillModalOpen(false);
                  }}
                  className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-sm"
                >
                  ধন্যবাদ
                </button>
              </div>
            ) : userSkillLevel >= 3 ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  আপনি সর্বোচ্চ লেভেল ৩ এ আছেন!
                </h4>
                <p className="text-xs text-slate-500">
                  আপনার অ্যাকাউন্টের সকল ক্যাটাগরির সর্বোচ্চ রেটের টাস্ক উন্মুক্ত রয়েছে।
                </p>
              </div>
            ) : (
              <div className="py-4 space-y-3">
                <p className="text-xs text-slate-600 font-medium">
                  প্রশ্ন: ফেসবুকে কোনো পেজ ফলো করার পর সঠিক প্রুফ হিসেবে কী জমা দিতে হয়?
                </p>
                <div className="space-y-2">
                  {[
                    "১. পেজের হোম স্ক্রিন যেখানে 'Following' বাটন স্পষ্ট দেখা যায়",
                    "২. নিজের ফেসবুক প্রোফাইলের ছবি",
                    "৩. কেবল পেজের লিংক কপি করে দেওয়া",
                  ].map((opt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSkillQuizAnswer(opt)}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                        skillQuizAnswer === opt
                          ? "bg-sky-50 border-[#1e5eb3] text-[#1e5eb3] font-bold"
                          : "border-slate-200 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={!skillQuizAnswer}
                  onClick={() => {
                    if (skillQuizAnswer?.startsWith("১")) {
                      unlockNextSkillLevel();
                      setSkillSuccess(true);
                    } else {
                      alert("সঠিক উত্তর নির্বাচন করুন!");
                    }
                  }}
                  className="w-full py-2.5 mt-2 bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white rounded-xl text-xs font-bold shadow-sm disabled:opacity-40"
                >
                  উত্তর সাবমিট করুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CREATE WORK */}
      {/* ========================================================================= */}
      {createWorkModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
          onClick={() => setCreateWorkModalOpen(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl animate-in slide-in-from-bottom font-bengali max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#1e5eb3]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  নতুন কাজ পোস্ট করুন (Create Work)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setCreateWorkModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateWorkSubmit} className="py-3 space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  কাজের শিরোনাম (Title):
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Facebook Page Follow & Like"
                  value={newWorkTitle}
                  onChange={(e) => setNewWorkTitle(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#1e5eb3] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    ক্যাটাগরি:
                  </label>
                  <select
                    value={newWorkCategory}
                    onChange={(e) => setNewWorkCategory(e.target.value)}
                    className="w-full text-xs px-2.5 py-2 rounded-xl border border-slate-200 bg-white"
                  >
                    <option value="facebook">Facebook</option>
                    <option value="youtube">YouTube</option>
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="apps">Apps</option>
                    <option value="telegram">Telegram</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    প্রতি কর্মীর রিওয়ার্ড (৳):
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.10"
                    required
                    value={newWorkReward}
                    onChange={(e) => setNewWorkReward(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  কতজন কর্মী প্রয়োজন (Workers):
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newWorkWorkers}
                  onChange={(e) => setNewWorkWorkers(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  কাজের টার্গেট লিংক (URL):
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://facebook.com/yourpage"
                  value={newWorkUrl}
                  onChange={(e) => setNewWorkUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  কাজের সংক্ষিপ্ত নির্দেশনা:
                </label>
                <textarea
                  rows={2}
                  placeholder="যেমন: পেজে গিয়ে ফলো করুন এবং স্ক্রিনশট দিন।"
                  value={newWorkInstructions}
                  onChange={(e) => setNewWorkInstructions(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="bg-sky-50 p-2.5 rounded-xl border border-sky-100 flex items-center justify-between text-xs font-bold text-[#0b2654]">
                <span>মোট খরচ:</span>
                <span>
                  ৳ {(parseFloat(newWorkReward || "0") * parseInt(newWorkWorkers || "0", 10)).toFixed(2)}
                </span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setCreateWorkModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white text-xs font-bold shadow-md active:scale-95"
                >
                  জব পাবলিশ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: ACTIVE WORKS */}
      {/* ========================================================================= */}
      {activeWorksModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setActiveWorksModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 font-bengali text-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-sky-100 text-[#0b2654] rounded-full flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              আপনার সক্রিয় কাজের তালিকা (Active Works: 0/3)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              বর্তমানে আপনার কোনো কাজ পেন্ডিং এক্সেপ্টেড অবস্থায় নেই। যেকোনো ক্যাটাগরি থেকে পছন্দের কাজ ওপেন করে কাজ জমা দিন।
            </p>
            <button
              type="button"
              onClick={() => setActiveWorksModalOpen(false)}
              className="w-full py-2.5 bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white rounded-xl text-xs font-bold shadow-sm"
            >
              ঠিক আছে
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: MY CHALLENGE WORK */}
      {/* ========================================================================= */}
      {challengeModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setChallengeModalOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl animate-in zoom-in-95 font-bengali text-center space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">
              মাই চ্যালেঞ্জ ওয়ার্ক (Challenge Work)
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              প্রতি সপ্তাহে নির্ধারিত চ্যালেঞ্জ টাস্ক সম্পন্ন করে স্পেশাল মেগা বোনাস জিতুন! এই সপ্তাহের চ্যালেঞ্জ শীঘ্রই প্রকাশ করা হবে।
            </p>
            <button
              type="button"
              onClick={() => setChallengeModalOpen(false)}
              className="w-full py-2.5 bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white rounded-xl text-xs font-bold shadow-sm"
            >
              বুঝেছি
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
