"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  PenTool,
  Settings,
  Star,
  CheckCircle2,
  FileEdit,
  FilePlus,
  UserCheck,
  Coins,
  Laptop,
  Send,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Clock,
  AlertCircle,
  Share2,
  BookOpen,
  Check,
  ThumbsUp,
  MessageSquare,
  Flame,
  ArrowRight,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore, TaskItem } from "@/lib/mock-store";
import { contentApi } from "@/lib/api-client";

export default function ContentWritingPage() {
  const router = useRouter();
  const { tasks, submissions, submitContentWritingPost, profile } = useMockStore();

  // Active Tab: "overview" | "write" | "submissions"
  const [activeTab, setActiveTab] = useState<"overview" | "write" | "submissions">("overview");

  // Writing Form State
  const [selectedTopic, setSelectedTopic] = useState<string>("দিগন্ত থেকে অনলাইন ইনকাম করার বাস্তব অভিজ্ঞতা লিখুন");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Ref to scroll to writer
  const writerSectionRef = useRef<HTMLDivElement>(null);

  // Content writing tasks filter
  const contentTasks = tasks.filter((t) => t.platform === "content");
  // Content submissions filter
  const contentSubmissions = submissions.filter((s) => s.platform === "content");

  // Word count helper
  const wordCount = postContent.trim() ? postContent.trim().split(/\s+/).length : 0;

  const handleStartWritingClick = (topicName?: string) => {
    if (topicName) {
      setSelectedTopic(topicName);
      setPostTitle(topicName);
    }
    setActiveTab("write");
    setTimeout(() => {
      writerSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSubmitContent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!selectedTopic) {
      setFormError("অনুগ্রহ করে একটি লেখার বিষয় নির্বাচন করুন!");
      return;
    }
    if (!postTitle.trim()) {
      setFormError("পোস্টের একটি উপযুক্ত শিরোনাম লিখুন!");
      return;
    }
    if (wordCount < 30) {
      setFormError("পোস্টের লেখাটি খুবই সংক্ষিপ্ত! অন্তত ৩০ শব্দ লিখুন (অনুরোধকৃত: ১০০ শব্দ)।");
      return;
    }

    setSubmitting(true);

    try {
      const matchedTask = contentTasks.find((t) => t.title === selectedTopic);
      const reward = matchedTask?.reward || 20;

      // Submit to live backend API
      contentApi
        .submit({
          type: "ARTICLE",
          title: postTitle.trim(),
          contentBody: postContent.trim(),
        })
        .catch(() => {});

      submitContentWritingPost({
        taskId: matchedTask?.id || `task_content_${Date.now()}`,
        topicTitle: postTitle.trim(),
        postContent: postContent.trim(),
        socialUrl: facebookUrl.trim(),
        screenshotUrl: screenshotUrl,
        reward: reward,
      });

      setSubmitSuccess(`আপনার লেখা সফলভাবে জমা হয়েছে! এডমিন রিভিউ শেষে আপনার ব্যালেন্সে ৳${reward} যুক্ত করা হবে।`);
      setPostTitle("");
      setPostContent("");
      setFacebookUrl("");

      setTimeout(() => {
        setActiveTab("submissions");
      }, 1500);
    } catch (err: any) {
      setFormError(err?.message || "সাবমিট করার সময় একটি ত্রুটি ঘটেছে।");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#dff0f8] flex justify-center selection:bg-sky-500 selection:text-white">
      {/* Mobile Frame Container */}
      <div className="w-full max-w-lg bg-[#eaf5fa] min-h-screen shadow-2xl flex flex-col relative pb-24 border-x border-slate-200/60 font-sans">
        {/* Top App Header */}
        <Header />

        {/* ========================================================
            HERO HEADER BANNER (Matching uploaded reference screenshot)
            ======================================================== */}
        <div className="relative bg-gradient-to-r from-[#071b3b] via-[#0b2654] to-[#1e5eb3] text-white px-3.5 pt-3.5 pb-5 shadow-md overflow-hidden rounded-b-[28px]">
          {/* Subtle Ambient Decorative Glows */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl pointer-events-none" />

          {/* Top Bar with Back Arrow + Left Pen Badge + Title + Right Illustration */}
          <div className="flex items-center justify-between relative z-10">
            {/* Left Side: Back Arrow + Nib Badge + Title Text */}
            <div className="flex items-center gap-2.5 min-w-0">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 flex items-center justify-center transition-all text-white backdrop-blur-sm flex-shrink-0"
                aria-label="Back"
              >
                <ArrowLeft className="w-4.5 h-4.5" />
              </button>

              {/* Nib / Pen Rounded Icon Box */}
              <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 flex items-center justify-center shadow-inner flex-shrink-0">
                <svg
                  viewBox="0 0 48 48"
                  className="w-6 h-6 text-white drop-shadow"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M38 10L14 34L10 38L14 34" stroke="#7dd3fc" />
                  <path d="M10 38L12 30L30 12C32 10 36 10 38 12C40 14 40 18 38 20L20 38L10 38Z" fill="white" fillOpacity="0.25" />
                  <circle cx="20" cy="28" r="2" fill="#38bdf8" />
                  <path d="M30 12L36 18" stroke="#38bdf8" />
                </svg>
              </div>

              {/* Title & Subtitle */}
              <div className="min-w-0">
                <h1 className="text-xl font-bold tracking-tight text-white leading-tight font-bengali truncate">
                  কন্টেন্ট রাইটিং
                </h1>
                <p className="text-xs font-medium text-sky-200 mt-0.5 flex items-center gap-1.5">
                  <span>লিখে আয় করুন</span>
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </p>
              </div>
            </div>

            {/* Right Side: Visual SVG Illustration (Notebook, Pen, Facebook Badge, Like) */}
            <div className="relative w-20 h-16 flex-shrink-0 flex items-center justify-end">
              <svg viewBox="0 0 110 90" className="w-full h-full drop-shadow-md overflow-visible">
                {/* Desk Base */}
                <rect x="10" y="78" width="90" height="4" rx="2" fill="#38bdf8" fillOpacity="0.4" />
                
                {/* Open Notebook / Tablet Sheet */}
                <rect x="22" y="16" width="60" height="60" rx="6" fill="#ffffff" />
                <rect x="26" y="20" width="52" height="52" rx="4" fill="#f0f7ff" />
                
                {/* Text lines on paper */}
                <line x1="32" y1="30" x2="62" y2="30" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" />
                <line x1="32" y1="38" x2="70" y2="38" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="32" y1="46" x2="66" y2="46" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="32" y1="54" x2="58" y2="54" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />
                <line x1="32" y1="62" x2="68" y2="62" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" />

                {/* Blue Writing Pen */}
                <g transform="translate(60, 16) rotate(35)">
                  <rect x="0" y="0" width="6" height="34" rx="2" fill="#2563eb" />
                  <polygon points="0,34 6,34 3,42" fill="#f59e0b" />
                  <rect x="0" y="2" width="6" height="3.5" fill="#93c5fd" />
                </g>

                {/* Facebook Blue Circular Badge */}
                <g transform="translate(76, 8)">
                  <circle cx="11" cy="11" r="10" fill="#1877f2" />
                  <path
                    d="M13 7h-2a2.8 2.8 0 0 0-2.8 2.8v2H6.5v2.8h1.7v6.5h2.8v-6.5h2.3l.4-2.8h-2.7v-1.4c0-.5.3-.9.9-.9h1.4V7z"
                    fill="white"
                  />
                </g>

                {/* Like / Thumb Up Bubble */}
                <g transform="translate(6, 42)">
                  <circle cx="10" cy="10" r="10" fill="#8b5cf6" />
                  <path
                    d="M8.5 14v-4.5h-1.8v4.5h1.8zm6.5-4c.2 0 .4-.2.4-.4 0-.4-.3-1-.7-1.3l-1.9-1.6c-.3-.2-.4-.5-.4-.9v-1.8c0-.4-.3-.6-.7-.6-.3 0-.6.2-.6.6v1.6l-1.2 1.3v7.4h5.6c.5 0 .9-.3 1.1-.9l.4-2.2c.1-.3 0-.7-.4-1.2z"
                    fill="white"
                  />
                </g>

                {/* Little Plant Pot */}
                <g transform="translate(6, 64)">
                  <polygon points="2,13 13,13 11,2 4,2" fill="#f59e0b" />
                  <path d="M7 2 C7 -2, 3 -2, 3 2 Z" fill="#10b981" />
                  <path d="M7 2 C7 -2, 12 -2, 12 2 Z" fill="#059669" />
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Content Tabs Navigation */}
        <div className="px-4 -mt-2 z-20">
          <div className="bg-white/95 backdrop-blur-md p-1 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
                activeTab === "overview"
                  ? "bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 flex-shrink-0" />
              <span>কাজের গাইড</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("write")}
              className={`flex-1 py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 whitespace-nowrap ${
                activeTab === "write"
                  ? "bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <PenTool className="w-3.5 h-3.5 flex-shrink-0" />
              <span>পোস্ট লিখুন</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("submissions")}
              className={`flex-1 py-2 px-1 text-[11px] sm:text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 whitespace-nowrap relative ${
                activeTab === "submissions"
                  ? "bg-gradient-to-r from-[#0b2654] to-[#1e5eb3] text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <FileEdit className="w-3.5 h-3.5 flex-shrink-0" />
              <span>আমার পোস্ট</span>
              {contentSubmissions.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {contentSubmissions.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="px-3.5 pt-3.5 pb-6 space-y-3.5">
          {/* ========================================================
              TAB 1: OVERVIEW & STEP GUIDELINE (Matches Screenshot)
              ======================================================== */}
          {activeTab === "overview" && (
            <div className="space-y-3.5 animate-in fade-in duration-200">
              {/* SECTION 1: কাজের বিবরণ (Job Description Card) */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-sky-100/90 hover:border-sky-200 transition-colors relative overflow-hidden">
                <div className="flex items-start gap-3">
                  {/* Left Side: Document & Pen Vector Illustration */}
                  <div className="w-20 h-24 sm:w-24 sm:h-28 flex-shrink-0 relative flex items-center justify-center pl-1">
                    <svg viewBox="-8 0 126 120" className="w-full h-full drop-shadow-sm overflow-visible">
                      {/* Document Sheet */}
                      <rect x="18" y="14" width="58" height="80" rx="7" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
                      <rect x="23" y="20" width="48" height="66" rx="4" fill="#f8fafc" />
                      {/* Ruled Blue Lines */}
                      <line x1="30" y1="32" x2="60" y2="32" stroke="#93c5fd" strokeWidth="2.8" strokeLinecap="round" />
                      <line x1="30" y1="42" x2="64" y2="42" stroke="#cbd5e1" strokeWidth="2.2" strokeLinecap="round" />
                      <line x1="30" y1="52" x2="56" y2="52" stroke="#cbd5e1" strokeWidth="2.2" strokeLinecap="round" />
                      <line x1="30" y1="62" x2="62" y2="62" stroke="#cbd5e1" strokeWidth="2.2" strokeLinecap="round" />
                      <line x1="30" y1="72" x2="52" y2="72" stroke="#cbd5e1" strokeWidth="2.2" strokeLinecap="round" />

                      {/* Blue Writing Pen */}
                      <g transform="translate(68, 24) rotate(32)">
                        <rect x="0" y="0" width="7" height="48" rx="2.5" fill="#1e5eb3" />
                        <rect x="0" y="3" width="7" height="5" fill="#60a5fa" />
                        <polygon points="0,48 7,48 3.5,58" fill="#f59e0b" />
                        <circle cx="3.5" cy="56" r="1.2" fill="#0b2654" />
                      </g>

                      {/* Facebook Logo Badge */}
                      <g transform="translate(6, 62)">
                        <circle cx="13" cy="13" r="12" fill="#1877f2" stroke="#ffffff" strokeWidth="2" />
                        <path
                          d="M15 8.5h-2a2.8 2.8 0 0 0-2.8 2.8v2H8v2.8h2.2v7h2.8v-7h2.5l.4-2.8h-2.9v-1.6c0-.6.4-.9 1-.9h1.9V8.5z"
                          fill="white"
                        />
                      </g>

                      {/* Like / Thumb Bubble */}
                      <g transform="translate(64, 62)">
                        <circle cx="12" cy="12" r="11" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
                        <path
                          d="M10 17v-5h-2v5h2zm7.5-4.5c.2 0 .5-.2.5-.5 0-.5-.4-1.1-.8-1.4l-2.2-1.8c-.3-.2-.5-.5-.5-1v-2c0-.4-.4-.7-.8-.7-.4 0-.7.3-.7.7v1.8l-1.3 1.5v8.5h6.5c.6 0 1.1-.4 1.3-1l.5-2.5c.1-.4 0-.8-.4-1.3z"
                          fill="white"
                        />
                      </g>

                      {/* Floating dots / sparkles */}
                      <circle cx="12" cy="26" r="2" fill="#38bdf8" />
                      <circle cx="8" cy="42" r="2.5" fill="#818cf8" />
                      <circle cx="86" cy="14" r="2" fill="#38bdf8" />
                    </svg>
                  </div>

                  {/* Right Side: Description Text */}
                  <div className="flex-1 space-y-2 text-left min-w-0">
                    <div className="border-l-4 border-[#1e5eb3] pl-2.5">
                      <h2 className="text-base font-bold text-slate-900 font-bengali">
                        কাজের বিবরণ
                      </h2>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-bengali">
                      মেম্বাররা ফেসবুক পোস্টের জন্য বিভিন্ন বিষয় নিয়ে লিখবে এবং সাবমিট করবে। এডমিন এপ্রুভ করলে টাকা পাবে।
                    </p>
                    <p className="text-xs text-slate-700 leading-relaxed font-bengali">
                      মেম্বাররা ওয়েবসাইটে আরো বেশি ইনকাম এবং বিভিন্ন কাজ সম্পর্কে ধারণা দিতে পারবে। এমন সব নির্দেশনা লিখে ইনকাম করতে পারবে।
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 2: কিভাবে কাজ করবেন ? (5-step Visual Flow Matching Reference Image) */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3.5">
                {/* Section Title with Gear Icon */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0">
                    <Settings className="w-4 h-4" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 font-bengali">
                    কিভাবে কাজ করবেন ?
                  </h2>
                </div>

                {/* 5 Sequential Steps Flow (Scrollable Row with Arrows, Exactly Matching Screenshot) */}
                <div className="relative">
                  <div className="flex items-stretch gap-2 overflow-x-auto pb-2 scrollbar-none snap-x -mx-1 px-1">
                    {/* Step 1 */}
                    <div className="min-w-[135px] flex-1 snap-start p-3 rounded-2xl bg-gradient-to-b from-purple-50/80 to-white border border-purple-100 flex flex-col items-center text-center relative group">
                      <div className="w-6 h-6 rounded-full bg-[#8b5cf6] text-white text-xs font-bold flex items-center justify-center shadow-xs mb-2">
                        ১
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-purple-100 text-[#8b5cf6] flex items-center justify-center mb-2">
                        <FileEdit className="w-5 h-5" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 font-bengali leading-tight mb-1">
                        বিষয় নির্বাচন করুন
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bengali leading-snug">
                        ফেসবুক পোস্টের জন্য বিভিন্ন বিষয় বেছে নিন।
                      </p>
                    </div>

                    {/* Arrow 1 */}
                    <div className="flex items-center justify-center text-sky-400 flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>

                    {/* Step 2 */}
                    <div className="min-w-[135px] flex-1 snap-start p-3 rounded-2xl bg-gradient-to-b from-blue-50/80 to-white border border-blue-100 flex flex-col items-center text-center relative group">
                      <div className="w-6 h-6 rounded-full bg-[#2563eb] text-white text-xs font-bold flex items-center justify-center shadow-xs mb-2">
                        ২
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#2563eb] flex items-center justify-center mb-2">
                        <FilePlus className="w-5 h-5" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 font-bengali leading-tight mb-1">
                        লিখে সাবমিট করুন
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bengali leading-snug">
                        নির্দেশনা অনুযায়ী পোস্ট লিখে জমা দিন।
                      </p>
                    </div>

                    {/* Arrow 2 */}
                    <div className="flex items-center justify-center text-sky-400 flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>

                    {/* Step 3 */}
                    <div className="min-w-[135px] flex-1 snap-start p-3 rounded-2xl bg-gradient-to-b from-emerald-50/80 to-white border border-emerald-100 flex flex-col items-center text-center relative group">
                      <div className="w-6 h-6 rounded-full bg-[#10b981] text-white text-xs font-bold flex items-center justify-center shadow-xs mb-2">
                        ৩
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#10b981] flex items-center justify-center mb-2">
                        <UserCheck className="w-5 h-5" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 font-bengali leading-tight mb-1">
                        এডমিন রিভিউ করবে
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bengali leading-snug">
                        এডমিন আপনার লেখা পরীক্ষা করে অনুমোদন দেবেন।
                      </p>
                    </div>

                    {/* Arrow 3 */}
                    <div className="flex items-center justify-center text-sky-400 flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>

                    {/* Step 4 */}
                    <div className="min-w-[135px] flex-1 snap-start p-3 rounded-2xl bg-gradient-to-b from-amber-50/80 to-white border border-amber-100 flex flex-col items-center text-center relative group">
                      <div className="w-6 h-6 rounded-full bg-[#f59e0b] text-white text-xs font-bold flex items-center justify-center shadow-xs mb-2">
                        ৪
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#f59e0b] flex items-center justify-center mb-2">
                        <Coins className="w-5 h-5" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 font-bengali leading-tight mb-1">
                        টাকা পাবেন
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bengali leading-snug">
                        এপ্রুভ হলে আপনার একাউন্টে টাকা যোগ হবে।
                      </p>
                    </div>

                    {/* Arrow 4 */}
                    <div className="flex items-center justify-center text-sky-400 flex-shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>

                    {/* Step 5 */}
                    <div className="min-w-[145px] flex-1 snap-start p-3 rounded-2xl bg-gradient-to-b from-rose-50/80 to-white border border-rose-100 flex flex-col items-center text-center relative group">
                      <div className="w-6 h-6 rounded-full bg-[#f43f5e] text-white text-xs font-bold flex items-center justify-center shadow-xs mb-2">
                        ৫
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-rose-100 text-[#f43f5e] flex items-center justify-center mb-2">
                        <Laptop className="w-5 h-5" />
                      </div>
                      <h3 className="text-xs font-bold text-slate-900 font-bengali leading-tight mb-1">
                        ওয়েবসাইটে আরো ইনকাম
                      </h3>
                      <p className="text-[10px] text-slate-500 font-bengali leading-snug">
                        বিভিন্ন কাজের টিপস ও নির্দেশনা দিয়ে অতিরিক্ত ইনকাম করার সুযোগ পাবেন।
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION 3: কেন করবেন ? (Benefits & Laptop Graphics Matching Screenshot) */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 relative overflow-hidden">
                {/* Section Title with Green Star */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
                    <Star className="w-4 h-4 fill-white text-white" />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 font-bengali">
                    কেন করবেন ?
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* Left Side: 4 Checklist Bullet Points */}
                  <div className="flex-1 space-y-2.5 min-w-0">
                    <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">সহজ কাজ, ঘরে বসে করুন।</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">নিজের দক্ষতা কাজে লাগিয়ে ইনকাম করুন।</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">নতুন নতুন সুযোগ ও কাজ সম্পর্কে জানার সুযোগ পাবেন।</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-medium text-slate-800">
                      <div className="w-4.5 h-4.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                      <span className="leading-snug">নিয়মিত কাজ করলে আপনার আয় বাড়বে।</span>
                    </div>
                  </div>

                  {/* Right Side: Vector Graphics of Laptop, Coins, Facebook & Decorative Typography */}
                  <div className="w-28 sm:w-36 flex-shrink-0 flex flex-col items-center justify-center">
                    <div className="relative w-28 h-24 flex items-center justify-center">
                      <svg viewBox="0 0 130 95" className="w-full h-full drop-shadow-sm">
                        {/* Laptop Base */}
                        <polygon points="12,80 118,80 108,86 22,86" fill="#94a3b8" />
                        <rect x="22" y="22" width="86" height="58" rx="6" fill="#0f172a" />
                        <rect x="25" y="25" width="80" height="50" rx="4" fill="#1e293b" />
                        
                        {/* Laptop Screen Document */}
                        <rect x="30" y="30" width="44" height="40" rx="3" fill="#ffffff" />
                        <line x1="34" y1="36" x2="64" y2="36" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
                        <line x1="34" y1="42" x2="70" y2="42" stroke="#94a3b8" strokeWidth="1.6" strokeLinecap="round" />
                        <line x1="34" y1="48" x2="66" y2="48" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
                        <line x1="34" y1="54" x2="58" y2="54" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />
                        <line x1="34" y1="60" x2="68" y2="60" stroke="#cbd5e1" strokeWidth="1.6" strokeLinecap="round" />

                        {/* Facebook Bubble on Screen */}
                        <circle cx="90" cy="38" r="9" fill="#1877f2" />
                        <path d="M91 32h-1.6a2.2 2.2 0 0 0-2.2 2.2v1.6H85v2.2h2.2v5.5h2.4v-5.5h2l.3-2.2h-2.3v-1.2c0-.5.3-.7.8-.7h1.2V32z" fill="white" />

                        {/* Stack of Taka Coins */}
                        <g transform="translate(76, 54)">
                          <ellipse cx="14" cy="18" rx="11" ry="4" fill="#b45309" />
                          <rect x="3" y="14" width="22" height="4" fill="#d97706" />
                          <ellipse cx="14" cy="14" rx="11" ry="4" fill="#f59e0b" />
                          
                          <ellipse cx="14" cy="10.5" rx="11" ry="4" fill="#b45309" />
                          <rect x="3" y="6.5" width="22" height="4" fill="#d97706" />
                          <ellipse cx="14" cy="6.5" rx="11" ry="4" fill="#fbbf24" />
                          <text x="14" y="9" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#78350f">৳</text>
                        </g>

                        {/* Chat Bubble */}
                        <circle cx="102" cy="50" r="5" fill="#0284c7" />
                        <path d="M100 49h4M100 51h2" stroke="white" strokeWidth="1" strokeLinecap="round" />

                        {/* Plant Pot */}
                        <g transform="translate(4, 58)">
                          <polygon points="3,20 13,20 11,10 5,10" fill="#f59e0b" />
                          <path d="M8 10 C8 5, 3 5, 3 10 Z" fill="#10b981" />
                          <path d="M8 10 C8 5, 13 5, 13 10 Z" fill="#059669" />
                        </g>
                      </svg>
                    </div>

                    {/* Stylized Bengali Decorative Banner: লিখুন শিখুন আয় করুন */}
                    <div className="text-center font-bengali -mt-2">
                      <div className="text-[#1e5eb3] font-black text-xs tracking-wide transform -rotate-3 hover:rotate-0 transition-transform">
                        লিখুন
                      </div>
                      <div className="text-[#0b2654] font-black text-sm tracking-wider transform rotate-2">
                        শিখুন
                      </div>
                      <div className="text-[#059669] font-black text-base tracking-widest transform -rotate-1 drop-shadow-xs">
                        আয় করুন
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRIMARY CTA BUTTON (Matching Screenshot) */}
              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => handleStartWritingClick()}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#1e5eb3] via-[#0b2654] to-[#1e5eb3] text-white font-bold text-sm md:text-base shadow-lg shadow-blue-900/20 hover:shadow-xl active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
                >
                  <PenTool className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                  <span className="font-bengali">এখনই কাজ শুরু করুন</span>
                </button>
              </div>

              {/* AVAILABLE TOPICS PREVIEW LIST */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 font-bengali flex items-center gap-2">
                    <Flame className="w-4 h-4 text-amber-500" />
                    <span>চলমান লেখার বিষয়সমূহ ({contentTasks.length})</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                    প্রতিটি পোস্টে ৳১৫ - ৳২৫
                  </span>
                </div>

                <div className="space-y-2">
                  {contentTasks.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl border border-slate-200/90 hover:border-blue-400 bg-slate-50/50 hover:bg-sky-50/40 transition-all flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                            রিওয়ার্ড: ৳{item.reward}
                          </span>
                          <span>•</span>
                          <span>{item.action}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartWritingClick(item.title)}
                        className="px-3 py-1.5 rounded-xl bg-[#0b2654] hover:bg-[#1e5eb3] text-white text-xs font-bold transition-colors flex-shrink-0"
                      >
                        লিখুন
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 2: WRITE POST FORM (Interactive Writing Studio)
              ======================================================== */}
          {activeTab === "write" && (
            <div ref={writerSectionRef} className="space-y-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-4 md:p-5 shadow-sm border border-slate-200/80 space-y-4">
                {/* Header */}
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 font-bengali">
                      <PenTool className="w-4 h-4 text-blue-600" />
                      <span>পোস্ট লিখুন ও জমা দিন</span>
                    </h2>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                      রিওয়ার্ড: ৳২০.০০
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    ফেসবুক পোস্টের জন্য সুন্দর লেখা তৈরি করুন এবং সাবমিট করে টাকা আয় করুন।
                  </p>
                </div>

                {/* Form Alerts */}
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

                <form onSubmit={handleSubmitContent} className="space-y-4">
                  {/* Topic Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>লেখার বিষয় নির্বাচন করুন *</span>
                      <span className="text-[11px] font-normal text-slate-500">ধাপ ১</span>
                    </label>
                    <select
                      value={selectedTopic}
                      onChange={(e) => {
                        setSelectedTopic(e.target.value);
                        if (!postTitle) setPostTitle(e.target.value);
                      }}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-600 transition-colors"
                    >
                      {contentTasks.map((t) => (
                        <option key={t.id} value={t.title}>
                          {t.title} (৳{t.reward})
                        </option>
                      ))}
                      <option value="অন্যান্য বিষয়: দিগন্তে আমার কাজের অভিজ্ঞতা">অন্যান্য বিষয়: দিগন্তে আমার কাজের অভিজ্ঞতা</option>
                    </select>
                  </div>

                  {/* Post Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      পোস্টের শিরোনাম *
                    </label>
                    <input
                      type="text"
                      placeholder="আকর্ষণীয় একটি শিরোনাম লিখুন..."
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                      required
                    />
                  </div>

                  {/* Post Content Textarea */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <label className="font-bold text-slate-800">
                        পোস্টের মূল লেখা (Content) *
                      </label>
                      <span className={`font-medium ${wordCount >= 30 ? "text-emerald-600" : "text-amber-600"}`}>
                        শব্দ সংখ্যা: {wordCount} (কমপক্ষে ৩০ শব্দ)
                      </span>
                    </div>
                    <textarea
                      rows={6}
                      placeholder="এখানে আপনার ফেসবুক পোস্টের বিস্তারিত লেখা লিখুন... (যেমন: দিগন্ত ওয়েবসাইটের সুবিধা, কীভাবে কাজ করতে হয়, টাকা পাওয়ার অভিজ্ঞতা ইত্যাদি)"
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors font-bengali leading-relaxed"
                      required
                    />
                  </div>

                  {/* Facebook Post Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>ফেসবুক পোস্ট বা গ্রুপের লিংক (ঐচ্ছিক)</span>
                      <span className="text-[11px] text-slate-500">লিংক বা ইউজারনেম</span>
                    </label>
                    <input
                      type="url"
                      placeholder="https://facebook.com/groups/.../posts/..."
                      value={facebookUrl}
                      onChange={(e) => setFacebookUrl(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 transition-colors"
                    />
                  </div>

                  {/* Screenshot Proof Preview */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-800">
                      পোস্টের স্ক্রিনশট / প্রমাণ
                    </label>
                    <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <img
                        src={screenshotUrl}
                        alt="Screenshot Preview"
                        className="w-14 h-14 rounded-lg object-cover border border-slate-300 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-slate-700">ডিফল্ট ভেরিফিকেশন প্রুফ সংযুক্ত</p>
                        <p className="text-[10px] text-slate-500 truncate">প্রয়োজনে লিংক পরিবর্তন করতে পারেন</p>
                      </div>
                    </div>
                  </div>

                  {/* Form Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#0b2654] via-[#1e5eb3] to-[#0284c7] text-white font-bold text-xs md:text-sm shadow-md hover:shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>জমা হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-400" />
                        <span>লেখা জমা দিন (Submit Post)</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ========================================================
              TAB 3: MY SUBMISSIONS (Post Review Status)
              ======================================================== */}
          {activeTab === "submissions" && (
            <div className="space-y-3 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/80">
                <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2.5">
                  <h3 className="text-sm font-bold text-slate-900 font-bengali flex items-center gap-2">
                    <FileEdit className="w-4 h-4 text-blue-600" />
                    <span>আমার জমা দেওয়া পোস্টসমূহ</span>
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    মোট: {contentSubmissions.length}টি
                  </span>
                </div>

                {contentSubmissions.length === 0 ? (
                  <div className="text-center py-8 space-y-2">
                    <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <FileEdit className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-700">এখনো কোনো পোস্ট জমা দেওয়া হয়নি!</p>
                    <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                      &quot;পোস্ট লিখুন&quot; ট্যাবে গিয়ে ফেসবুক পোস্ট লিখে সাবমিট করুন এবং এডমিন অনুমোদনে টাকা আয় করুন।
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("write")}
                      className="mt-2 px-4 py-2 rounded-xl bg-[#0b2654] text-white text-xs font-bold hover:bg-[#1e5eb3] transition-colors"
                    >
                      এখনই প্রথম পোস্ট লিখুন
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {contentSubmissions.map((sub) => (
                      <div
                        key={sub.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-colors space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-slate-900 leading-snug flex-1">
                            {sub.taskTitle}
                          </h4>
                          {sub.status === "APPROVED" && (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              অনুমোদিত
                            </span>
                          )}
                          {sub.status === "PENDING" && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              রিভিউ চলছে
                            </span>
                          )}
                          {sub.status === "REJECTED" && (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-[10px] font-bold">
                              বাতিল
                            </span>
                          )}
                        </div>

                        {sub.userNote && (
                          <p className="text-[11px] text-slate-600 line-clamp-2 bg-white p-2 rounded-lg border border-slate-100 font-bengali">
                            {sub.userNote}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                          <span className="font-bold text-emerald-700">
                            রিওয়ার্ড: ৳{sub.reward}
                          </span>
                          <span>{sub.submittedAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
  );
}
