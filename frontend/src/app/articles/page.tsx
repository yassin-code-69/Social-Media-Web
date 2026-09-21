"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  TrendingUp,
  Laptop,
  HeartPulse,
  GraduationCap,
  Users,
  Leaf,
  Clock,
  Coins,
  Star,
  Search,
  Check,
  ChevronRight,
  Plus,
  History,
  X,
  Sparkles,
  Info,
  Trophy,
  ArrowRight,
  FileText,
  CheckCircle2,
  AlertCircle,
  Share2,
  BookMarked,
  Timer,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { BottomNav } from "@/components/layout/bottom-nav";
import { useMockStore } from "@/lib/mock-store";

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  categorySlug: string;
  categoryColor: string;
  categoryBg: string;
  description: string;
  reward: number;
  readTime: string;
  readTimeMinutes: number;
  thumbnailType: "business" | "cyber" | "health" | "career" | "family";
  contentParagraphs: string[];
}

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  pillBg: string;
  pillColor: string;
}

export default function ArticlesPage() {
  const router = useRouter();
  const { profile, submitContentWritingPost } = useMockStore();

  // Statistics State connected to user profile
  const [totalRewardPool, setTotalRewardPool] = useState("০.০০");
  const [totalArticles, setTotalArticles] = useState(0);
  const [totalEarned, setTotalEarned] = useState(profile.totalEarned || profile.balance || 0);
  const [totalReaders, setTotalReaders] = useState(0);
  const userTier = profile.packageName || "ফ্রি মেম্বার";

  // Filtering & Search
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Reading Modal & Interactive Timer
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const [readingTimer, setReadingTimer] = useState<number>(10); // 10s demo timer for testing
  const [canClaimReward, setCanClaimReward] = useState<boolean>(false);
  const [claimSuccess, setClaimSuccess] = useState<string | null>(null);
  const [readHistory, setReadHistory] = useState<
    { id: string; title: string; reward: number; date: string }[]
  >([]);

  // Modals
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isNewArticleModalOpen, setIsNewArticleModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("ব্যবসা ও উদ্যোক্তা");
  const [newContent, setNewContent] = useState("");
  const [createSuccessMsg, setCreateSuccessMsg] = useState<string | null>(null);

  // 6 Categories matching the mockup
  const categories: CategoryItem[] = [
    {
      id: "cat_biz",
      name: "ব্যবসা ও উদ্যোক্তা",
      slug: "business",
      count: 5,
      icon: TrendingUp,
      iconBg: "bg-[#dcfce7]",
      iconColor: "text-[#15803d]",
      pillBg: "bg-[#ecfdf5]",
      pillColor: "text-[#059669]",
    },
    {
      id: "cat_tech",
      name: "প্রযুক্তি ও ইন্টারনেট",
      slug: "tech",
      count: 4,
      icon: Laptop,
      iconBg: "bg-[#e0f2fe]",
      iconColor: "text-[#0284c7]",
      pillBg: "bg-[#f0f9ff]",
      pillColor: "text-[#0284c7]",
    },
    {
      id: "cat_health",
      name: "স্বাস্থ্য ও জীবনধারা",
      slug: "health",
      count: 4,
      icon: HeartPulse,
      iconBg: "bg-[#ffedd5]",
      iconColor: "text-[#ea580c]",
      pillBg: "bg-[#fff7ed]",
      pillColor: "text-[#ea580c]",
    },
    {
      id: "cat_career",
      name: "শিক্ষা ও ক্যারিয়ার",
      slug: "career",
      count: 3,
      icon: GraduationCap,
      iconBg: "bg-[#f3e8ff]",
      iconColor: "text-[#9333ea]",
      pillBg: "bg-[#faf5ff]",
      pillColor: "text-[#9333ea]",
    },
    {
      id: "cat_family",
      name: "পারিবারিক জীবন",
      slug: "family",
      count: 3,
      icon: Users,
      iconBg: "bg-[#fce7f3]",
      iconColor: "text-[#db2777]",
      pillBg: "bg-[#fdf2f8]",
      pillColor: "text-[#db2777]",
    },
    {
      id: "cat_env",
      name: "পরিবেশ ও সমাজ",
      slug: "env",
      count: 2,
      icon: Leaf,
      iconBg: "bg-[#ccfbf1]",
      iconColor: "text-[#0d9488]",
      pillBg: "bg-[#f0fdfa]",
      pillColor: "text-[#0d9488]",
    },
  ];

  // 5 Articles matching the mockup
  const articles: ArticleItem[] = [
    {
      id: "art_1",
      title: "ছোট ব্যবসা শুরু করার ১০টি গুরুত্বপূর্ণ টিপস",
      category: "ব্যবসা ও উদ্যোক্তা",
      categorySlug: "business",
      categoryColor: "text-[#15803d]",
      categoryBg: "bg-[#dcfce7]",
      description: "কম পুঁজিতে কিভাবে ছোট ব্যবসা শুরু করবেন এবং কিভাবে সফল হবেন, জানুন এই আর্টিকেলে।",
      reward: 15,
      readTime: "পড়ার সময়: ৫ মিনিট",
      readTimeMinutes: 5,
      thumbnailType: "business",
      contentParagraphs: [
        "বর্তমান প্রতিযোগিতাপূর্ণ সময়ে অল্প পুঁজিতে একটি টেকসই ছোট ব্যবসা শুরু করা অত্যন্ত সম্ভাবনাময় একটি পদক্ষেপ। সঠিক পরিকল্পনা ও কৌশল ছাড়া যে কোনো ব্যবসাতেই ঝুঁকির সম্ভাবনা থাকে।",
        "১. বাজারের চাহিদা নির্ধারণ: শুরুতেই আপনার এলাকার মানুষের নিত্যপ্রয়োজনীয় সমস্যা বা চাহিদার ওপর ভিত্তি করে পণ্য নির্বাচন করুন। গ্রাহকের প্রয়োজনীয়তাই ব্যবসার মূল শক্তি।",
        "২. বাজেট ও ক্যাশ ফ্লো নিয়ন্ত্রণ: অপ্রয়োজনীয় ডেকোরেশন বা খরচে টাকা নষ্ট না করে কার্যকরী পণ্য ও অনলাইন মার্কেটিংয়ে মূলধন বিনিয়োগ করুন।",
        "৩. সামাজিক মাধ্যমের সর্বোচ্চ ব্যবহার: ফেসবুক পেজ, ইনস্টাগ্রাম ও টিকটকের মাধ্যমে বিনামূল্যে গ্রাহকদের কাছে পৌঁছান এবং চমৎকার কাস্টমার সার্ভিস নিশ্চিত করুন।",
      ],
    },
    {
      id: "art_2",
      title: "ইন্টারনেটের নিরাপত্তা: যা যা জানা জরুরি",
      category: "প্রযুক্তি ও ইন্টারনেট",
      categorySlug: "tech",
      categoryColor: "text-[#0284c7]",
      categoryBg: "bg-[#e0f2fe]",
      description: "অনলাইন জগতে নিরাপদ থাকতে হলে কী কী বিষয় মেনে চলবেন, এই আর্টিকেলে জানুন।",
      reward: 12,
      readTime: "পড়ার সময়: ৪ মিনিট",
      readTimeMinutes: 4,
      thumbnailType: "cyber",
      contentParagraphs: [
        "ডিজিটাল যুগে আমাদের ব্যক্তিগত ও আর্থিক তথ্যের সিংহভাগই ইন্টারনেটের সঙ্গে যুক্ত। তাই সাইবার সুরক্ষার নিয়মাবলী জানা এখন প্রতিটি সচেতন নাগরিকের মৌলিক দায়িত্ব।",
        "১. টু-ফ্যাক্টর অথেন্টিকেশন (2FA): আপনার জিমেইল, ফেসবুক ও বিকাশ অ্যাকাউন্টে অবশ্যই দ্বি-স্তরবিশিষ্ট নিরাপত্তা চালু রাখুন। এতে কেউ পাসওয়ার্ড জানলেও লগইন করতে পারবে না।",
        "২. সন্দেহজনক ফিশিং লিংক পরিহার: লটারি জিতেছেন বা ফ্রি অফারের লোভনীয় লিংকে কখনো ক্লিক করবেন না কিংবা ওটিপি (OTP) কারো সাথে শেয়ার করবেন না।",
        "৩. শক্তিশালী ও অনন্য পাসওয়ার্ড: প্রতিটি সেবার জন্য আলাদা পাসওয়ার্ড ব্যবহার করুন এবং নিয়মিত আপডেট করুন।",
      ],
    },
    {
      id: "art_3",
      title: "সুস্থ থাকার জন্য ৭টি ভালো অভ্যাস",
      category: "স্বাস্থ্য ও জীবনধারা",
      categorySlug: "health",
      categoryColor: "text-[#ea580c]",
      categoryBg: "bg-[#ffedd5]",
      description: "দৈনন্দিন জীবনে ছোট ছোট কিছু অভ্যাস আপনার স্বাস্থ্যকে আরও ভালো রাখতে পারে।",
      reward: 10,
      readTime: "পড়ার সময়: ৪ মিনিট",
      readTimeMinutes: 4,
      thumbnailType: "health",
      contentParagraphs: [
        "সুস্থ শরীর ও সতেজ মনই মানুষের সবচেয়ে বড় সম্পদ। বড় ধরনের অসুস্থতা প্রতিরোধ করতে প্রতিদিনের ছোট্ট কিছু ইতিবাচক অভ্যাস জাদুকরী ভূমিকা পালন করে।",
        "১. পর্যাপ্ত পানি পান: প্রতিদিন অন্তত আড়াই থেকে তিন লিটার বিশুদ্ধ পানি পান করা শরীরের মেটাবলিজম ও হজমশক্তি সচল রাখে।",
        "২. পুষ্টিকর খাদ্য ও তাজা ফলমূল: প্রক্রিয়াজাত অতিরিক্ত তেলে ভাজা খাবার এড়িয়ে প্রচুর সবুজ শাকসবজি, ফল ও বাদাম ডায়েটে অন্তর্ভুক্ত করুন।",
        "৩. নিয়মিত ঘুম ও হাঁটা: প্রতিদিন অন্তত ৩০ মিনিট মুক্ত বাতাসে দ্রুত হাঁটা এবং ৭-৮ ঘণ্টার গভীর ঘুম নিশ্চিত করা হার্টের জন্য অপরিহার্য।",
      ],
    },
    {
      id: "art_4",
      title: "ক্যারিয়ারে সফল হতে কী করবেন?",
      category: "শিক্ষা ও ক্যারিয়ার",
      categorySlug: "career",
      categoryColor: "text-[#9333ea]",
      categoryBg: "bg-[#f3e8ff]",
      description: "ভালো ক্যারিয়ার গড়ার জন্য প্রয়োজন পরিকল্পনা, দক্ষতা এবং সঠিক দিকনির্দেশনা।",
      reward: 12,
      readTime: "পড়ার সময়: ৫ মিনিট",
      readTimeMinutes: 5,
      thumbnailType: "career",
      contentParagraphs: [
        "একটি সফল ও সম্মানজনক ক্যারিয়ার কোনো আকস্মিক ঘটনা নয়; এটি ধারাবাহিক পরিশ্রম, বাস্তবসম্মত লক্ষ্য এবং আধুনিক দক্ষতার সমন্বিত ফলাফল।",
        "১. প্রতিনিয়ত নতুন স্কিল শেখা: শুধু প্রাতিষ্ঠানিক ডিগ্রির ওপর নির্ভর না করে কমিউনিকেশন, টেকনিক্যাল স্কিল ও প্রবলেম সলভিং সক্ষমতা বৃদ্ধি করুন।",
        "২. প্রফেশনাল নেটওয়ার্কিং: লিংকডইন ও প্রফেশনাল প্ল্যাটফর্মে আপনার ফিল্ডের অভিজ্ঞ ব্যক্তিবর্গের সাথে নিয়মিত যোগাযোগ রাখুন এবং ইতিবাচক সম্পর্ক গড়ে তুলুন।",
        "৩. সময় সচেতনতা ও ধৈর্য: নিজের কাজে সততা ও সময়ানুবর্তিতা বজায় রাখুন, দীর্ঘমেয়াদে আপনিই এগিয়ে থাকবেন।",
      ],
    },
    {
      id: "art_5",
      title: "সুখী পরিবারের জন্য ৫টি পরামর্শ",
      category: "পারিবারিক জীবন",
      categorySlug: "family",
      categoryColor: "text-[#db2777]",
      categoryBg: "bg-[#fce7f3]",
      description: "পরিবারে শান্তি ও সুখ বজায় রাখতে অনুসরণ করুন এই সহজ উপায়গুলো।",
      reward: 10,
      readTime: "পড়ার সময়: ৪ মিনিট",
      readTimeMinutes: 4,
      thumbnailType: "family",
      contentParagraphs: [
        "পরিবার হলো মানুষের জীবনের নিরাপদতম আশ্রয়স্থল। পারস্পরিক ভালোবাসা, শ্রদ্ধা ও বোঝাপড়ার মাধ্যমেই একটি পরিবার সত্যিকার অর্থে শান্তির নীড় হয়ে ওঠে।",
        "১. কোয়ালিটি টাইম কাটানো: সারাদিনের ব্যস্ততা শেষে পরিবারের সবার সাথে বসে অন্তত একবেলা খাবার খান এবং খোলামেলা গল্প করুন।",
        "২. ধৈর্য ও ক্ষমাশীলতা: ছোটখাটো ভুলত্রুটি বড় করে না দেখে পরস্পরকে ক্ষমা করার মানসিকতা চর্চা করুন।",
        "৩. সন্তানদের অনুভূতি শোনা: সন্তানদের উপর অযথা চাপ সৃষ্টি না করে তাদের আগ্রহ ও আবেগকে গুরুত্ব দিন।",
      ],
    },
  ];

  // Filtered list
  const filteredArticles = articles.filter((art) => {
    const matchesCat =
      selectedCategory === "all" || art.categorySlug === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Reading Timer Effect
  useEffect(() => {
    let interval: any = null;
    if (activeArticle && readingTimer > 0) {
      interval = setInterval(() => {
        setReadingTimer((prev) => {
          if (prev <= 1) {
            setCanClaimReward(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeArticle, readingTimer]);

  // Open Reading Modal
  const handleOpenArticle = (article: ArticleItem) => {
    setActiveArticle(article);
    setReadingTimer(10); // 10s interactive timer
    setCanClaimReward(false);
    setClaimSuccess(null);
  };

  // Claim Reward Handler
  const handleClaimReward = () => {
    if (!activeArticle) return;

    submitContentWritingPost({
      taskId: `task_article_${activeArticle.id}`,
      topicTitle: `[আর্টিকেল পড়া] ${activeArticle.title}`,
      postContent: `সম্পূর্ণ আর্টিকেল পড়া হয়েছে। রিওয়ার্ড: ৳${activeArticle.reward}`,
      reward: activeArticle.reward,
    });

    setTotalEarned((prev) => prev + activeArticle.reward);
    setTotalReaders((prev) => prev + 1);

    setReadHistory((prev) => [
      {
        id: `hist_${Date.now()}`,
        title: activeArticle.title,
        reward: activeArticle.reward,
        date: "এইমাত্র",
      },
      ...prev,
    ]);

    setClaimSuccess(
      `অভিনন্দন! আপনি সফলভাবে এই আর্টিকেলটি পড়েছেন এবং ৳${activeArticle.reward} আপনার অ্যাকাউন্টে জমা হয়েছে!`
    );

    setTimeout(() => {
      setActiveArticle(null);
      setClaimSuccess(null);
    }, 1800);
  };

  // Create new article submit
  const handleCreateArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setCreateSuccessMsg("আপনার আর্টিকেলটি পর্যালোচনার জন্য জমা নেওয়া হয়েছে!");
    setTimeout(() => {
      setNewTitle("");
      setNewContent("");
      setCreateSuccessMsg(null);
      setIsNewArticleModalOpen(false);
      setTotalArticles((prev) => prev + 1);
    }, 1500);
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
              SECTION 1: HERO BANNER (আর্টিকেল পড়া)
              ======================================================== */}
          <div className="bg-gradient-to-r from-[#d8f1fe] via-[#ecf8fe] to-[#def2fe] rounded-3xl p-4 shadow-sm border border-sky-200/90 relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-blue-400/15 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-2.5">
              {/* Left Side: Student/Reader Graphic + Title + Description */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Custom SVG: Student reading book with glowing lightbulb */}
                <div className="w-16 h-18 sm:w-20 sm:h-20 flex-shrink-0 relative flex items-center justify-center">
                  <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-sm overflow-visible">
                    {/* Glowing lightbulb above head */}
                    <g transform="translate(62, 4)">
                      {/* Bulb rays */}
                      <path d="M10 -2 L10 -6" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M19 1 L22 -2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M22 10 L26 10" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M-2 10 L2 10" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                      <path d="M1 1 L-2 -2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />

                      {/* Bulb shape */}
                      <path
                        d="M10 2 C6 2 3 5 3 9 C3 12 5 14 6 16 L14 16 C15 14 17 12 17 9 C17 5 14 2 10 2 Z"
                        fill="#fbbf24"
                        stroke="#f59e0b"
                        strokeWidth="0.8"
                      />
                      {/* Bulb base */}
                      <rect x="7" y="16" width="6" height="3" rx="0.8" fill="#cbd5e1" />
                    </g>

                    {/* Reader Boy Illustration */}
                    {/* Head */}
                    <circle cx="42" cy="28" r="11" fill="#fed7aa" />
                    {/* Dark hair */}
                    <path
                      d="M30 26 C30 16 38 14 48 15 C54 16 55 21 54 26 C50 23 44 24 40 26 Z"
                      fill="#0f172a"
                    />
                    {/* Eyes and smile */}
                    <circle cx="39" cy="27" r="1.2" fill="#0f172a" />
                    <circle cx="45" cy="27" r="1.2" fill="#0f172a" />
                    <path
                      d="M40 31 Q42 33 44 31"
                      stroke="#0f172a"
                      strokeWidth="1"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Orange Hoodie / Vest */}
                    <path
                      d="M26 80 L28 48 C28 40 35 39 44 39 C53 39 60 40 60 48 L62 80 Z"
                      fill="#f97316"
                    />

                    {/* Desk */}
                    <rect x="10" y="78" width="80" height="5" rx="2.5" fill="#38bdf8" />

                    {/* Open Blue Book on Desk */}
                    <path
                      d="M32 78 L44 71 L56 78 L68 71 L68 80 L56 86 L44 80 L32 86 Z"
                      fill="#1e40af"
                    />
                    <path
                      d="M34 76 L44 70 L54 76 L54 83 L44 78 L34 83 Z"
                      fill="#ffffff"
                    />
                    <path
                      d="M56 76 L66 70 L76 76 L76 83 L66 78 L56 83 Z"
                      fill="#ffffff"
                    />

                    {/* Small Laptop beside book */}
                    <rect x="14" y="72" width="16" height="10" rx="1.5" fill="#0f172a" />
                    <rect x="16" y="74" width="12" height="7" rx="1" fill="#38bdf8" />
                    <rect x="12" y="81" width="20" height="2" rx="1" fill="#64748b" />
                  </svg>
                </div>

                {/* Title & Slogan */}
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-[#0b2654] leading-tight font-bengali">
                    আর্টিকেল পড়া
                  </h1>
                  <p className="text-xs font-semibold text-slate-800 font-bengali mt-0.5">
                    পড়ুন, শিখুন, উপার্জন করুন
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-slate-600 leading-snug font-bengali mt-0.5 max-w-[170px] sm:max-w-[210px]">
                    বিভিন্ন বিষয়ে তথ্যবহুল আর্টিকেল পড়ে আপনার জ্ঞান বাড়ান এবং প্রতিটি পড়ার জন্য পান নির্ধারিত রিওয়ার্ড।
                  </p>
                </div>
              </div>

              {/* Right Side Card: মোট রিওয়ার্ড + Buttons */}
              <div className="bg-white/95 rounded-2xl p-2.5 shadow-sm border border-sky-200/90 flex flex-col justify-between gap-2 flex-shrink-0 min-w-[125px] sm:min-w-[140px]">
                {/* Top Total Reward */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 font-medium whitespace-nowrap">
                      মোট রিওয়ার্ড
                    </div>
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                      ৳ {totalRewardPool}
                    </div>
                  </div>
                </div>

                {/* 2 Action Buttons */}
                <div className="space-y-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => setIsNewArticleModalOpen(true)}
                    className="w-full py-1.5 px-2 rounded-lg bg-[#059669] hover:bg-[#047857] active:scale-95 text-white text-[10px] sm:text-[11px] font-bold shadow-xs transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>নতুন আর্টিকেল</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsHistoryModalOpen(true)}
                    className="w-full py-1.5 px-2 rounded-lg bg-[#1d4ed8] hover:bg-[#1e40af] active:scale-95 text-white text-[10px] sm:text-[11px] font-bold shadow-xs transition-all flex items-center justify-center gap-1"
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>পড়ার ইতিহাস</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 2: 4 STAT CARDS
              (মোট আর্টিকেল, মোট আয়, মোট পাঠক, আপনার পয়েন্ট)
              ======================================================== */}
          <div className="grid grid-cols-4 gap-2">
            {/* Stat 1: মোট আর্টিকেল */}
            <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200/80 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                <BookOpen className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                {totalArticles}
              </div>
              <div className="text-[9px] text-slate-500 font-medium whitespace-nowrap mt-0.5">
                মোট আর্টিকেল
              </div>
            </div>

            {/* Stat 2: মোট আয় */}
            <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200/80 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-1">
                <Coins className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                ৳ {totalEarned}
              </div>
              <div className="text-[9px] text-slate-500 font-medium whitespace-nowrap mt-0.5">
                মোট আয়
              </div>
            </div>

            {/* Stat 3: মোট পাঠক */}
            <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200/80 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                <Users className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                {totalReaders}
              </div>
              <div className="text-[9px] text-slate-500 font-medium whitespace-nowrap mt-0.5">
                মোট পাঠক
              </div>
            </div>

            {/* Stat 4: আপনার পয়েন্ট */}
            <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-slate-200/80 flex flex-col items-center text-center">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-500 flex items-center justify-center mb-1">
                <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
              </div>
              <div className="text-sm sm:text-base font-extrabold text-amber-700 leading-tight">
                {userTier}
              </div>
              <div className="text-[9px] text-slate-500 font-medium whitespace-nowrap mt-0.5">
                আপনার পয়েন্ট
              </div>
            </div>
          </div>

          {/* ========================================================
              SECTION 3: আর্টিকেল ক্যাটাগরি (6 Grid Cards)
              ======================================================== */}
          <div className="space-y-2.5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#1e5eb3] text-white flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 font-bengali">
                  আর্টিকেল ক্যাটাগরি
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className="text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center gap-0.5 cursor-pointer"
              >
                <span>সব ক্যাটাগরি দেখুন</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* 6 Category Cards Grid (3 cols x 2 rows) */}
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.slug;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setSelectedCategory((prev) =>
                        prev === cat.slug ? "all" : cat.slug
                      )
                    }
                    className={`bg-white rounded-2xl p-2.5 shadow-sm border transition-all flex flex-col items-center text-center group cursor-pointer ${
                      isSelected
                        ? "border-[#1e5eb3] ring-2 ring-[#1e5eb3]/20 bg-blue-50/40"
                        : "border-slate-200/80 hover:border-sky-300"
                    }`}
                  >
                    {/* Round Icon */}
                    <div
                      className={`w-10 h-10 rounded-full ${cat.iconBg} ${cat.iconColor} flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform`}
                    >
                      <IconComponent className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    {/* Title */}
                    <div className="text-[11px] font-bold text-slate-900 leading-tight mb-2 min-h-[28px] flex items-center justify-center">
                      {cat.name}
                    </div>

                    {/* Bottom Pill */}
                    <div
                      className={`w-full py-0.5 px-1.5 rounded-md ${cat.pillBg} ${cat.pillColor} text-[9.5px] font-bold flex items-center justify-center gap-0.5 whitespace-nowrap`}
                    >
                      <span>{cat.count} টি আর্টিকেল</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================
              SECTION 4: সকল আর্টিকেল (All Articles)
              ======================================================== */}
          <div className="space-y-2.5">
            {/* Header with Search Bar */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="w-6 h-6 rounded-lg bg-[#1e5eb3] text-white flex items-center justify-center flex-shrink-0">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 font-bengali">
                  সকল আর্টিকেল
                </h2>
              </div>

              {/* Search Bar Input */}
              <div className="relative flex-1 max-w-[180px] sm:max-w-[210px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="আর্টিকেল খুঁজুন..."
                  className="w-full pl-7 pr-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-slate-800 placeholder-slate-400"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Articles List (5 Cards) */}
            <div className="space-y-2.5">
              {filteredArticles.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 text-center border border-slate-200">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500 font-medium">
                    কোন আর্টিকেল খুঁজে পাওয়া যায়নি।
                  </p>
                </div>
              ) : (
                filteredArticles.map((art) => (
                  <div
                    key={art.id}
                    className="bg-white rounded-2xl p-3 shadow-sm border border-slate-200/80 hover:border-sky-300 transition-all flex items-center justify-between gap-3"
                  >
                    {/* Left: Thumbnail Vector + Content */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Custom Vector Thumbnail */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 relative shadow-2xs border border-slate-200/60">
                        {/* 1. Business Vector */}
                        {art.thumbnailType === "business" && (
                          <div className="w-full h-full bg-gradient-to-br from-[#0284c7] via-[#0369a1] to-[#0f172a] flex items-center justify-center p-1 relative">
                            <svg viewBox="0 0 70 70" className="w-full h-full">
                              {/* Rising Arrow Line */}
                              <path
                                d="M12 55 L32 38 L44 46 L60 22"
                                stroke="#f59e0b"
                                strokeWidth="3.5"
                                fill="none"
                                strokeLinecap="round"
                              />
                              <polygon points="62,18 52,22 62,28" fill="#f59e0b" />
                              {/* Businessman */}
                              <circle cx="28" cy="24" r="7" fill="#fed7aa" />
                              <path d="M23 20 C23 14 33 14 33 20 Z" fill="#0f172a" />
                              <path d="M18 50 L18 36 C18 31 38 31 38 36 L38 50 Z" fill="#1e3a8a" />
                              <polygon points="28,34 30,44 26,44" fill="#f8fafc" />
                              <polygon points="27,37 29,48 28,48" fill="#ef4444" />
                            </svg>
                          </div>
                        )}

                        {/* 2. Cyber Security / Laptop */}
                        {art.thumbnailType === "cyber" && (
                          <div className="w-full h-full bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#38bdf8] flex items-center justify-center p-1 relative">
                            <svg viewBox="0 0 70 70" className="w-full h-full">
                              {/* Laptop */}
                              <rect x="15" y="20" width="40" height="28" rx="2" fill="#0f172a" stroke="#60a5fa" strokeWidth="1" />
                              <rect x="18" y="23" width="34" height="22" rx="1" fill="#0284c7" />
                              {/* Shield with lock */}
                              <path d="M35 28 L43 32 L43 38 C43 43 35 46 35 46 C35 46 27 43 27 38 L27 32 Z" fill="#38bdf8" />
                              <circle cx="35" cy="36" r="2" fill="#0f172a" />
                              {/* Base */}
                              <rect x="10" y="48" width="50" height="4" rx="2" fill="#cbd5e1" />
                            </svg>
                          </div>
                        )}

                        {/* 3. Health & Fruits */}
                        {art.thumbnailType === "health" && (
                          <div className="w-full h-full bg-gradient-to-br from-[#15803d] via-[#16a34a] to-[#84cc16] flex items-center justify-center p-1 relative">
                            <svg viewBox="0 0 70 70" className="w-full h-full">
                              {/* Bowl */}
                              <path d="M15 42 Q35 62 55 42 Z" fill="#ffffff" />
                              {/* Fruits: Apple, Orange, Veggie */}
                              <circle cx="28" cy="38" r="7" fill="#ef4444" />
                              <circle cx="38" cy="36" r="8" fill="#f97316" />
                              <circle cx="46" cy="40" r="6" fill="#84cc16" />
                              {/* Water bottle beside */}
                              <rect x="52" y="26" width="7" height="18" rx="2" fill="#38bdf8" />
                              <rect x="53.5" y="23" width="4" height="3" rx="1" fill="#0284c7" />
                            </svg>
                          </div>
                        )}

                        {/* 4. Career / Graduation */}
                        {art.thumbnailType === "career" && (
                          <div className="w-full h-full bg-gradient-to-br from-[#4c1d95] via-[#6d28d9] to-[#8b5cf6] flex items-center justify-center p-1 relative">
                            <svg viewBox="0 0 70 70" className="w-full h-full">
                              {/* Stack of books */}
                              <rect x="18" y="44" width="34" height="6" rx="1.5" fill="#f43f5e" />
                              <rect x="16" y="38" width="38" height="6" rx="1.5" fill="#0284c7" />
                              <rect x="20" y="32" width="30" height="6" rx="1.5" fill="#10b981" />
                              {/* Graduation Cap */}
                              <polygon points="35,16 54,23 35,30 16,23" fill="#0f172a" />
                              <rect x="28" y="28" width="14" height="4" fill="#0f172a" />
                              {/* Gold tassel */}
                              <path d="M35 23 L48 26 L48 34" stroke="#f59e0b" strokeWidth="1.5" fill="none" />
                              <circle cx="48" cy="34" r="1.5" fill="#f59e0b" />
                            </svg>
                          </div>
                        )}

                        {/* 5. Family */}
                        {art.thumbnailType === "family" && (
                          <div className="w-full h-full bg-gradient-to-br from-[#831843] via-[#be185d] to-[#f472b6] flex items-center justify-center p-1 relative">
                            <svg viewBox="0 0 70 70" className="w-full h-full">
                              {/* Father */}
                              <circle cx="25" cy="24" r="6" fill="#fed7aa" />
                              <path d="M17 48 L17 36 C17 32 33 32 33 36 L33 48 Z" fill="#0284c7" />
                              {/* Mother */}
                              <circle cx="45" cy="26" r="6" fill="#fed7aa" />
                              <path d="M37 48 L37 38 C37 34 53 34 53 38 L53 48 Z" fill="#fb7185" />
                              {/* Child in middle */}
                              <circle cx="35" cy="36" r="4.5" fill="#fed7aa" />
                              <path d="M29 55 L29 46 C29 43 41 43 41 46 L41 55 Z" fill="#facc15" />
                            </svg>
                          </div>
                        )}
                      </div>

                      {/* Content Details */}
                      <div className="min-w-0 flex-1 space-y-1">
                        <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                          {art.title}
                        </h3>

                        <p className="text-[10.5px] text-slate-600 font-bengali leading-snug line-clamp-2">
                          {art.description}
                        </p>

                        {/* Category Tag */}
                        <div>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-full ${art.categoryBg} ${art.categoryColor} text-[9px] font-bold`}
                          >
                            {art.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Reward + Time + "পড়ুন →" Button */}
                    <div className="flex flex-col items-end justify-between flex-shrink-0 space-y-2">
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900">
                            ৳ {art.reward}
                          </span>
                        </div>
                        <div className="text-[9.5px] text-slate-500 flex items-center justify-end gap-1 mt-0.5 whitespace-nowrap">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>{art.readTime}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenArticle(art)}
                        className="px-3.5 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] active:scale-95 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1 whitespace-nowrap"
                      >
                        <span>পড়ুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ========================================================
              SECTION 5: BOTTOM 2 INFO CARDS (SIDE BY SIDE)
              (কিছু গুরুত্বপূর্ণ নিয়ম & আর্টিকেল পড়ে যা পাবেন)
              ======================================================== */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Left Card: কিছু গুরুত্বপূর্ণ নিয়ম */}
            <div className="bg-[#e0f2fe] rounded-3xl p-3.5 border border-sky-200/90 flex flex-col justify-between">
              <div>
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#0284c7] text-white flex items-center justify-center flex-shrink-0">
                    <Info className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-[#0369a1] font-bengali">
                    কিছু গুরুত্বপূর্ণ নিয়ম
                  </h3>
                </div>

                {/* Bullets */}
                <div className="space-y-1.5 pl-1">
                  <div className="flex items-start gap-1.5 text-[10.5px] text-slate-700 font-bengali leading-snug">
                    <span className="text-[#0284c7] font-bold">•</span>
                    <span>প্রতিটি আর্টিকেল একবারই পড়া যাবে।</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10.5px] text-slate-700 font-bengali leading-snug">
                    <span className="text-[#0284c7] font-bold">•</span>
                    <span>নির্ধারিত সময়ের মধ্যে পড়া সম্পন্ন করতে হবে।</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10.5px] text-slate-700 font-bengali leading-snug">
                    <span className="text-[#0284c7] font-bold">•</span>
                    <span>কপি-পেস্ট বা শর্টকাট ব্যবহার করলে রিওয়ার্ড পাবেন না।</span>
                  </div>
                  <div className="flex items-start gap-1.5 text-[10.5px] text-slate-700 font-bengali leading-snug">
                    <span className="text-[#0284c7] font-bold">•</span>
                    <span>আর্টিকেল পড়া শেষে স্বয়ংক্রিয়ভাবে রিওয়ার্ড আপনার একাউন্টে যুক্ত হবে।</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Card: আর্টিকেল পড়ে যা পাবেন */}
            <div className="bg-[#fef9c3] rounded-3xl p-3.5 border border-amber-200/90 relative overflow-hidden flex items-center justify-between">
              <div className="flex-1 pr-1">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-bold text-amber-900 font-bengali">
                    আর্টিকেল পড়ে যা পাবেন
                  </h3>
                </div>

                {/* Checklist */}
                <div className="space-y-1 pl-1">
                  <div className="flex items-center gap-1.5 text-[10.5px] text-slate-800 font-bengali">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>নতুন তথ্য ও জ্ঞান</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10.5px] text-slate-800 font-bengali">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>নির্দিষ্ট রিওয়ার্ড (৳)</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10.5px] text-slate-800 font-bengali">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>আপনার পয়েন্ট</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-[10.5px] text-slate-800 font-bengali">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                    </div>
                    <span>নিজেকে আরও দক্ষ ও স্মার্ট করে তোলা</span>
                  </div>
                </div>
              </div>

              {/* Graphic on Right: Stack of Books with Lightbulb */}
              <div className="w-18 h-20 flex-shrink-0 relative flex items-center justify-center">
                <svg viewBox="0 0 70 80" className="w-full h-full drop-shadow-sm">
                  {/* Glowing Bulb */}
                  <g transform="translate(25, 4)">
                    <circle cx="10" cy="10" r="8" fill="#fbbf24" />
                    <rect x="7" y="18" width="6" height="3" fill="#94a3b8" />
                    {/* Rays */}
                    <line x1="10" y1="0" x2="10" y2="-3" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="18" y1="3" x2="20" y2="1" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                    <line x1="2" y1="3" x2="0" y2="1" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
                  </g>

                  {/* Stack of 4 Books */}
                  <rect x="14" y="32" width="42" height="7" rx="1.5" fill="#3b82f6" />
                  <rect x="10" y="39" width="50" height="7" rx="1.5" fill="#ef4444" />
                  <rect x="8" y="46" width="54" height="7" rx="1.5" fill="#10b981" />
                  <rect x="6" y="53" width="58" height="8" rx="2" fill="#f59e0b" />
                  {/* Spine marks */}
                  <line x1="18" y1="33" x2="18" y2="38" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
                  <line x1="14" y1="40" x2="14" y2="45" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
                  <line x1="12" y1="47" x2="12" y2="52" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            MODAL 1: INTERACTIVE ARTICLE READER MODAL
            ======================================================== */}
        {activeArticle && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setActiveArticle(null)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className={`px-2 py-0.5 rounded-full ${activeArticle.categoryBg} ${activeArticle.categoryColor} text-[10px] font-bold`}
                  >
                    {activeArticle.category}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    রিওয়ার্ড: ৳{activeArticle.reward}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveArticle(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title & Reading Timer Banner */}
              <div className="space-y-2">
                <h2 className="text-base font-bold text-slate-900 leading-snug">
                  {activeArticle.title}
                </h2>

                {/* Interactive Reading Timer Bar */}
                <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Timer
                      className={`w-5 h-5 ${
                        readingTimer > 0
                          ? "text-sky-600 animate-spin"
                          : "text-emerald-600"
                      }`}
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {readingTimer > 0
                          ? `মনোযোগ দিয়ে পড়ুন: ০:${
                              readingTimer < 10
                                ? `০${readingTimer}`
                                : readingTimer
                            } সেকেন্ড বাকি`
                          : "আর্টিকেল পড়া সম্পন্ন হয়েছে!"}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        টাইমার শেষ হলে রিওয়ার্ড ক্লেইম বাটন সক্রিয় হবে
                      </div>
                    </div>
                  </div>

                  {canClaimReward && (
                    <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center animate-bounce">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Success Notification */}
              {claimSuccess && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2 animate-in zoom-in-95">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{claimSuccess}</span>
                </div>
              )}

              {/* Article Content Paragraphs */}
              <div className="space-y-3 text-xs sm:text-[13px] text-slate-700 leading-relaxed font-bengali pt-1">
                {activeArticle.contentParagraphs.map((para, pIdx) => (
                  <p key={pIdx} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {para}
                  </p>
                ))}
              </div>

              {/* Action Button: Claim Reward */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={!canClaimReward || Boolean(claimSuccess)}
                  onClick={handleClaimReward}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 ${
                    canClaimReward && !claimSuccess
                      ? "bg-gradient-to-r from-[#0b2654] via-[#1e5eb3] to-[#0284c7] text-white hover:shadow-lg active:scale-95"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <Coins className="w-4 h-4 text-amber-400" />
                  <span>
                    {canClaimReward
                      ? `রিওয়ার্ড সংগ্রহ করুন (Claim ৳${activeArticle.reward})`
                      : `আর্টিকেলটি পুরো পড়ুন (৳${activeArticle.reward})`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 2: পড়ার ইতিহাস (READING HISTORY MODAL)
            ======================================================== */}
        {isHistoryModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setIsHistoryModalOpen(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <BookMarked className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      পড়ার ইতিহাস
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      আপনার সম্পন্ন করা আর্টিকেলের তালিকা
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsHistoryModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* History List */}
              <div className="space-y-2.5">
                {readHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {item.date}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-extrabold text-xs whitespace-nowrap">
                      + ৳ {item.reward}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL 3: নতুন আর্টিকেল তৈরি (CREATE ARTICLE MODAL)
            ======================================================== */}
        {isNewArticleModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
            onClick={() => setIsNewArticleModalOpen(false)}
          >
            <div
              className="w-full max-w-md bg-white rounded-3xl p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      নতুন আর্টিকেল প্রকাশ করুন
                    </h3>
                    <p className="text-[10px] text-slate-500">
                      আপনার লেখা শেয়ার করে রিওয়ার্ড অর্জন করুন
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNewArticleModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {createSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <span>{createSuccessMsg}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleCreateArticleSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    আর্টিকেলের শিরোনাম:
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="যেমন: সফল ফ্রিল্যান্সার হওয়ার সহজ উপায়..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    ক্যাটাগরি নির্বাচন করুন:
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    আর্টিকেলের মূল বিষয়বস্তু:
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="এখানে আপনার সম্পূর্ণ তথ্যবহুল আর্টিকেলটি লিখুন..."
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  আর্টিকেল জমা দিন
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
