"use client";

import { useState, useEffect } from "react";

// Types
export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  packageName: string;
  packageStatus: string;
  packageExpiry: string;
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  completedTasksCount: number;
  referralCode: string;
  role: "USER" | "ADMIN";
  status?: "ACTIVE" | "SUSPENDED";
}

export interface AdminSettings {
  minWithdrawal: number;
  maxWithdrawal: number;
  referralBonus: number;
  bkashNumber: string;
  nagadNumber: string;
  rocketNumber: string;
  announcement: string;
  isWithdrawalEnabled: boolean;
  isDepositEnabled: boolean;
}

export interface PackageItem {
  id: string;
  name: string;
  price: number;
  validityDays: number;
  dailyTaskLimit: number;
  dailyRewardLimit: number;
  referralBonus: number;
  color: string;
  isPopular?: boolean;
  features: string[];
}

export interface TaskItem {
  id: string;
  title: string;
  platform: "youtube" | "facebook" | "tiktok" | "website" | "video" | "content" | "captcha" | "instagram" | "apps" | "buysell" | "telegram" | string;
  category?: string;
  reward: number;
  availableWorks?: number;
  action: string;
  description: string;
  instructions: string[];
  targetUrl: string;
  requiredPackage: string;
  requiresScreenshot: boolean;
  creatorId?: string;
  completedWorkers?: number;
  status?: "ACTIVE" | "COMPLETED" | "PAUSED";
  createdAt?: string;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  platform: string;
  reward: number;
  screenshotUrl: string;
  userNote?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  rejectionReason?: string;
  submittedAt: string;
}

export interface DepositItem {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  paymentMethod: string;
  senderNumber: string;
  transactionId: string;
  screenshotUrl?: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string;
  createdAt: string;
}

export interface WithdrawalItem {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  paymentMethod: string;
  accountNumber: string;
  maskedAccount: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  adminNote?: string;
  createdAt: string;
}

export interface TransactionItem {
  id: string;
  type: "TASK_REWARD" | "REFERRAL_REWARD" | "DEPOSIT" | "WITHDRAWAL" | "WITHDRAWAL_REVERSAL" | "PACKAGE_PURCHASE" | "BONUS" | "ADMIN_ADJUSTMENT";
  direction: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  referenceId?: string;
  balanceAfter: number;
  createdAt: string;
}

export interface ReferralItem {
  id: string;
  name: string;
  userId: string;
  joinDate: string;
  status: "ACTIVE" | "INACTIVE";
  reward: number;
  hasPaidPackage: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "TASK" | "FINANCE" | "REFERRAL" | "SYSTEM";
  read: boolean;
  createdAt: string;
}

export interface DailyCheckInState {
  currentDay: number; // 1 to 7
  lastCheckInDate: string | null;
  history: number[]; // array of completed day numbers, e.g. [1, 2]
  rewards: number[]; // [5, 7, 10, 15, 20, 25, 30]
  streakActive: boolean;
}

const initialCheckIn: DailyCheckInState = {
  currentDay: 1,
  lastCheckInDate: null,
  history: [],
  rewards: [5, 7, 10, 15, 20, 25, 30],
  streakActive: true,
};

export interface DailySpinHistoryItem {
  id: string;
  reward: number;
  timestamp: string;
}

export interface DailySpinState {
  spinsRemaining: number;
  totalSpinsDone: number;
  lastSpinDate: string | null;
  history: DailySpinHistoryItem[];
}

const initialSpinState: DailySpinState = {
  spinsRemaining: 3,
  totalSpinsDone: 2,
  lastSpinDate: null,
  history: [
    { id: "spin_seed_1", reward: 15, timestamp: "গতকাল রাত ৮:৩০" },
    { id: "spin_seed_2", reward: 5, timestamp: "২ দিন আগে" },
  ],
};

// Initial Mock Seed
const initialProfile: UserProfile = {
  id: "user_1024",
  name: "তামিম ইসলাম",
  phone: "01789-123456",
  email: "tamim.islam@example.com",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  packageName: "Gold",
  packageStatus: "ACTIVE",
  packageExpiry: "2026-10-15",
  balance: 1250.0,
  totalEarned: 320.0,
  totalWithdrawn: 600.0,
  completedTasksCount: 12,
  referralCode: "DIGON-7842",
  role: "USER",
};

const initialPackages: PackageItem[] = [
  {
    id: "pkg_free",
    name: "ফ্রি ট্রায়াল",
    price: 0,
    validityDays: 7,
    dailyTaskLimit: 2,
    dailyRewardLimit: 20,
    referralBonus: 5,
    color: "from-slate-500 to-slate-700",
    features: ["দৈনিক ২টি টাস্ক", "২৪ ঘণ্টার মধ্যে উইথড্র", "বেসিক সাপোর্ট", "৭ দিন মেয়াদ"],
  },
  {
    id: "pkg_bronze",
    name: "ব্রোঞ্জ প্যাকেজ",
    price: 500,
    validityDays: 30,
    dailyTaskLimit: 5,
    dailyRewardLimit: 60,
    referralBonus: 10,
    color: "from-amber-700 to-amber-900",
    features: ["দৈনিক ৫টি টাস্ক", "দ্রুত সাপোর্ট", "রেফারেল কমিশন", "৩০ দিন মেয়াদ"],
  },
  {
    id: "pkg_silver",
    name: "সিলভার প্যাকেজ",
    price: 1000,
    validityDays: 30,
    dailyTaskLimit: 10,
    dailyRewardLimit: 140,
    referralBonus: 15,
    color: "from-slate-400 to-slate-600",
    features: ["দৈনিক ১০টি টাস্ক", "অগ্রাধিকার উইথড্রয়াল", "উচ্চ আয়ের কাজ", "৩০ দিন মেয়াদ"],
  },
  {
    id: "pkg_gold",
    name: "গোল্ড প্যাকেজ (বর্তমান)",
    price: 2000,
    validityDays: 45,
    dailyTaskLimit: 20,
    dailyRewardLimit: 300,
    referralBonus: 20,
    isPopular: true,
    color: "from-amber-500 to-yellow-600",
    features: ["দৈনিক ২০টি টাস্ক", "ইনস্ট্যান্ট পেমেন্ট রিকোয়েস্ট", "ভিআইপি ব্যাজ ও বোনাস", "৪৫ দিন মেয়াদ"],
  },
  {
    id: "pkg_platinum",
    name: "প্লাটিনাম প্যাকেজ",
    price: 5000,
    validityDays: 60,
    dailyTaskLimit: 45,
    dailyRewardLimit: 750,
    referralBonus: 25,
    color: "from-emerald-600 to-teal-800",
    features: ["দৈনিক ৪৫টি টাস্ক", "প্রিমিয়াম সার্ভে ও ভিডিও", "সর্বোচ্চ রেফারেল বেনিফিট", "৬০ দিন মেয়াদ"],
  },
];

const initialTasks: TaskItem[] = [
  {
    id: "task_yt_1",
    title: "YouTube ভিডিও দেখুন",
    platform: "youtube",
    reward: 10,
    action: "২ মিনিট দেখুন ও সাবস্ক্রাইব করুন",
    description: "প্রদত্ত লিংকে গিয়ে পুরো ভিডিওটি মনোযোগ সহকারে অন্তত ২ মিনিট দেখুন। এরপর ভিডিওতে লাইক দিয়ে চ্যানেল সাবস্ক্রাইব করুন।",
    instructions: [
      "১. 'টাস্ক লিংকে যান' বাটনে ক্লিক করে ইউটিউব ভিডিও ওপেন করুন।",
      "২. ভিডিওটি ন্যূনতম ২ মিনিট রানিং থাকতে হবে।",
      "৩. লাইক ও চ্যানেল সাবস্ক্রাইব করুন।",
      "৪. সাবস্ক্রাইব করা অবস্থার স্পষ্ট স্ক্রিনশট তুলুন এবং সাবমিট বক্সে আপলোড করুন।",
    ],
    targetUrl: "https://youtube.com",
    requiredPackage: "ফ্রি / যেকোনো",
    requiresScreenshot: true,
  },
  {
    id: "task_fb_1",
    title: "Facebook পেজ লাইক ও ফলো",
    platform: "facebook",
    reward: 8,
    action: "লাইক ও ফলো করে স্ক্রিনশট দিন",
    description: "প্রদত্ত ফেসবুক পেজে যান এবং 'Like' ও 'Follow' বাটনে প্রেস করুন। ফলো সম্পন্ন করার পর একটি স্ক্রিনশট সংগ্রহ করুন।",
    instructions: [
      "১. লিংকে গিয়ে পেজ ভিজিট করুন।",
      "২. Like ও Follow করুন।",
      "৩. Following বাটন দেখা যাচ্ছে এমন অবস্থায় স্ক্রিনশট তুলুন।",
      "৪. স্ক্রিনশট আপলোড করে টাস্ক জমা দিন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "ফ্রি / যেকোনো",
    requiresScreenshot: true,
  },
  {
    id: "task_tt_1",
    title: "TikTok ভিডিও দেখুন ও লাইক দিন",
    platform: "tiktok",
    reward: 12,
    action: "১টি ভিডিও দেখুন ও লাভ রিঅ্যাক্ট দিন",
    description: "টিকটক ভিডিওটি সম্পূর্ণ দেখে লাইক দিন এবং আইডিতে ফলো দিয়ে স্ক্রিনশট আপলোড করুন।",
    instructions: [
      "১. ভিডিও ওপেন করুন এবং সম্পূর্ণ দেখুন।",
      "২. লাইক বাটনে চাপ দিয়ে লাল হার্ট বানান।",
      "৩. প্রোফাইলে ফলো দিন।",
      "৪. প্রুফ স্ক্রিনশট যুক্ত করে সাবমিট করুন।",
    ],
    targetUrl: "https://tiktok.com",
    requiredPackage: "ফ্রি / যেকোনো",
    requiresScreenshot: true,
  },
  {
    id: "task_web_1",
    title: "ওয়েবসাইট ১ মিনিট ভিজিট করুন",
    platform: "website",
    reward: 5,
    action: "আর্টিকেল স্ক্রল করে ১ মিনিট থাকুন",
    description: "ওয়েবসাইটে ভিজিট করে অন্তত ৬০ সেকেন্ড অবস্থান করুন। স্ক্রল করে আর্টিকেলটি শেষ পর্যন্ত পড়ুন।",
    instructions: [
      "১. ওয়েবসাইট লিংকে ক্লিক করুন।",
      "২. পেজের নিচে পর্যন্ত ধীরে ধীরে স্ক্রল করুন।",
      "৩. পেজে ন্যূনতম ৬০ সেকেন্ড অপেক্ষা করুন।",
      "৪. স্ক্রিনের টাইমসহ একটি স্ক্রিনশট জমা দিন।",
    ],
    targetUrl: "https://google.com",
    requiredPackage: "ফ্রি / যেকোনো",
    requiresScreenshot: true,
  },
  {
    id: "task_vid_1",
    title: "দিগন্ত সম্পর্কিত রিভিউ ভিডিও",
    platform: "video",
    reward: 50,
    action: "ফেসবুক/ইউটিউবে ১ মিনিটের রিভিউ শেয়ার",
    description: "দিগন্ত প্ল্যাটফর্ম থেকে আপনি কীভাবে ইনকাম করছেন সে সম্পর্কে ১ মিনিটের একটি ইতিবাচক ভিডিও তৈরি করে সোশ্যাল মিডিয়ায় পোস্ট করুন।",
    instructions: [
      "১. আপনার নিজস্ব ভাষায় ১ মিনিটের ভিডিও বানান।",
      "২. আপনার রেফারেল লিংক ক্যাপশনে দিন।",
      "৩. পোস্টের লিংক এবং ভিউয়ের স্ক্রিনশট সাবমিট করুন।",
    ],
    targetUrl: "#",
    requiredPackage: "Gold / Platinum",
    requiresScreenshot: true,
  },
  {
    id: "task_cap_1",
    title: "সহজ ক্যাপচা এন্ট্রি",
    platform: "captcha",
    reward: 6,
    action: "সঠিক কোড টাইপ করে জমা দিন",
    description: "প্রদত্ত ক্যাপচা ইমেজ বা কোডটি দেখে নির্ভুলভাবে বক্সে টাইপ করুন।",
    instructions: [
      "১. ক্যাপচা ইমেজ দেখুন।",
      "২. টেক্সট বক্সে সঠিক অক্ষর ও সংখ্যা লিখুন।",
      "৩. সাবমিট করুন।",
    ],
    targetUrl: "#",
    requiredPackage: "ফ্রি / যেকোনো",
    requiresScreenshot: false,
  },
  {
    id: "task_fb_follower",
    title: "Facebook Page Follower By Search",
    platform: "facebook",
    category: "Facebook Work",
    reward: 0.25,
    availableWorks: 12,
    action: "সার্চ করে পেজ ফলো দিন",
    description: "সার্চ অপশনে গিয়ে পেজের নাম লিখুন, পেজটি ওপেন করে ফলো দিয়ে স্ক্রিনশট দিন।",
    instructions: [
      "১. ফেসবুকে নির্দিষ্ট পেজের নাম সার্চ করুন।",
      "২. সঠিক পেজটিতে ঢুকে Follow বাটনে ক্লিক করুন।",
      "৩. Following বাটন দেখা যাচ্ছে এমন অবস্থায় স্ক্রিনশট নিন।",
      "৪. স্ক্রিনশট প্রুফ বক্সে আপলোড করে জমা দিন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_fb_love_react",
    title: "FB Post Love React and Comment",
    platform: "facebook",
    category: "Facebook Work",
    reward: 0.30,
    availableWorks: 7,
    action: "পোস্টে লাভ রিঅ্যাক্ট ও পজিটিভ কমেন্ট করুন",
    description: "পোস্টে গিয়ে লাভ রিঅ্যাক্ট দিন এবং কাজ সম্পর্কিত সুন্দর ১ লাইনের কমেন্ট করুন।",
    instructions: [
      "১. পোস্টের লিংকে যান।",
      "২. পোস্টে Love React দিন।",
      "৩. সুন্দর মন্তব্য লিখুন (যেমন: 'অসাধারণ উদ্যোগ!')।",
      "৪. কমেন্টসহ পোস্টের স্ক্রিনশট আপলোড করুন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_fb_id_follower",
    title: "Facebook Id Follower By Search",
    platform: "facebook",
    category: "Facebook Work",
    reward: 0.25,
    availableWorks: 6,
    action: "আইডি সার্চ করে ফলো দিন",
    description: "সার্চ করে নির্দিষ্ট ফেসবুক প্রোফাইল খুঁজে বের করুন এবং ফলো দিন।",
    instructions: [
      "১. ফেসবুক সার্চে প্রোফাইল নাম সার্চ করুন।",
      "২. প্রোফাইলে ঢুকে Follow করুন।",
      "৩. ফলো সম্পন্ন হওয়ার স্ক্রিনশট নিন এবং সাবমিট করুন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_fb_group_post",
    title: "Facebook Group Post",
    platform: "facebook",
    category: "Facebook Work",
    reward: 0.25,
    availableWorks: 6,
    action: "গ্রুপে পোস্ট শেয়ার করুন",
    description: "প্রদত্ত পোস্টটি যেকোনো সক্রিয় গ্রুপে শেয়ার করুন বা পোস্ট করুন।",
    instructions: [
      "১. গ্রুপে টেক্সট ও ইমেজ পোস্ট করুন।",
      "২. পোস্ট পাবলিশ হলে লিংক বা স্ক্রিনশট নিন।",
      "৩. প্রুফ জমা দিন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_fb_share",
    title: "Facebook Post Like , Comment & Share",
    platform: "facebook",
    category: "Facebook Work",
    reward: 0.40,
    availableWorks: 6,
    action: "লাইক, কমেন্ট ও নিজের টাইমলাইনে শেয়ার",
    description: "পোস্টে লাইক দিয়ে কমেন্ট করুন এবং পাবলিকলি নিজের টাইমলাইনে শেয়ার করুন।",
    instructions: [
      "১. পোস্টে লাইক ও কমেন্ট দিন।",
      "২. Share to Feed (Public) করুন।",
      "৩. টাইমলাইনের শেয়ার করা পোস্টের স্ক্রিনশট জমা দিন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_fb_reels",
    title: "Facebook Reels video 1 min watch, like , comment...",
    platform: "facebook",
    category: "Facebook Work",
    reward: 0.50,
    availableWorks: 3,
    action: "রিলস ভিডিও ১ মিনিট দেখে লাইক ও কমেন্ট করুন",
    description: "সম্পূর্ণ ১ মিনিট রিলসটি দেখুন, লাইক দিন এবং রিলেটেড কমেন্ট করুন।",
    instructions: [
      "১. রিলস ভিডিও লিংকে যান।",
      "২. ১ মিনিট মনোযোগ দিয়ে দেখুন।",
      "৩. লাইক ও কমেন্ট করুন।",
      "৪. স্ক্রিনশট জমা দিন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_fb_review",
    title: "Facebook Page Review",
    platform: "facebook",
    category: "Facebook Work",
    reward: 1.50,
    availableWorks: 2,
    action: "ফেসবুক পেজে ৫ স্টার রেটিং ও পজিটিভ রিভিউ দিন",
    description: "পেজের Reviews ট্যাবে যান, 'Do you recommend this Page?' এ 'Yes' চাপুন এবং সুন্দর রিভিউ লিখুন।",
    instructions: [
      "১. পেজের Reviews অপশনে যান।",
      "২. Yes অপশনে ক্লিক করুন।",
      "৩. ৫০ শব্দের ইতিবাচক রিভিউ লিখে পোস্ট করুন।",
      "৪. রিভিউ পোস্টের স্পষ্ট স্ক্রিনশট আপলোড করুন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_insta_follow",
    title: "Instagram Account Follow & 3 Posts Like",
    platform: "instagram",
    category: "Instagram Work",
    reward: 0.35,
    availableWorks: 2,
    action: "ইনস্টাগ্রাম প্রোফাইল ফলো ও পোস্টে লাইক দিন",
    description: "প্রোফাইল ফলো দিয়ে সাম্প্রতিক ৩টি ফটোতে লাভ রিঅ্যাক্ট দিন।",
    instructions: [
      "১. ইনস্টাগ্রাম লিংকে যান।",
      "২. Follow বাটনে ক্লিক করুন।",
      "৩. প্রথম ৩টি পোস্টে হার্ট রিঅ্যাক্ট দিন।",
      "৪. স্ক্রিনশট তুলে জমা দিন।",
    ],
    targetUrl: "https://instagram.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_yt_watch",
    title: "YouTube Video Watch 3 Min & Subscribe",
    platform: "youtube",
    category: "YouTube Work",
    reward: 1.20,
    availableWorks: 11,
    action: "ভিডিও ৩ মিনিট দেখে সাবস্ক্রাইব করুন",
    description: "ইউটিউব ভিডিওটি ৩ মিনিট দেখুন, লাইক দিন এবং চ্যানেল সাবস্ক্রাইব করে বেল আইকন বাজান।",
    instructions: [
      "১. ইউটিউব ভিডিও ওপেন করুন।",
      "২. ন্যূনতম ৩ মিনিট শুনুন ও দেখুন।",
      "৩. লাইক ও সাবস্ক্রাইব করুন।",
      "৪. স্ক্রিনশট তুলে প্রুফ সাবমিট করুন।",
    ],
    targetUrl: "https://youtube.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_app_install",
    title: "Apps Install & Open 2 Min",
    platform: "apps",
    category: "Apps Work",
    reward: 2.50,
    availableWorks: 1,
    action: "প্লেস্টোর থেকে অ্যাপ ইনস্টল করে ২ মিনিট ব্যবহার করুন",
    description: "অ্যাপটি ডাউনলোড ও ইনস্টল করে ২ মিনিট ওপেন রাখুন এবং হোম স্ক্রিনের স্ক্রিনশট নিন।",
    instructions: [
      "১. প্লেস্টোর লিংকে গিয়ে অ্যাপ ইনস্টল করুন।",
      "২. অ্যাপ ওপেন করে ২ মিনিট ব্রাউজ করুন।",
      "৩. ফোনে অ্যাপ ইনস্টল থাকা অবস্থার স্ক্রিনশট দিন।",
    ],
    targetUrl: "https://play.google.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_buysell_gmail",
    title: "Gmail & facebook Buy - Sell",
    platform: "buysell",
    category: "Gmail & facebook Buy - Sell",
    reward: 15.00,
    availableWorks: 2,
    action: "ভেরিফায়েড জিমেইল / ফেসবুক অ্যাকাউন্ট ট্রেড",
    description: "পুরাতন ও সচল অ্যাকাউন্ট যাচাই ও ক্রয়-বিক্রয় সেবা। নির্দেশনা অনুযায়ী তথ্য সাবমিট করুন।",
    instructions: [
      "১. অ্যাকাউন্ট বয়স ন্যূনতম ৬ মাস হতে হবে।",
      "২. টু-ফ্যাক্টর অথেনটিকেশন সক্রিয় থাকতে হবে।",
      "৩. ফর্ম পূরণ করে আইডি জমা দিন।",
    ],
    targetUrl: "#",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_tt_like",
    title: "TikTok Video Like & Share",
    platform: "tiktok",
    category: "TikTok Work",
    reward: 0.30,
    availableWorks: 8,
    action: "ভিডিও লাইক ও কপি লিংক শেয়ার",
    description: "টিকটক ভিডিওতে লাইক দিয়ে শেয়ার অপশন থেকে লিংক কপি করুন।",
    instructions: [
      "১. ভিডিও সম্পূর্ণ দেখুন।",
      "২. লাইক বাটনে চাপ দিন।",
      "৩. স্ক্রিনশট দিন।",
    ],
    targetUrl: "https://tiktok.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_tg_join",
    title: "Telegram Channel Join",
    platform: "telegram",
    category: "Telegram Work",
    reward: 0.25,
    availableWorks: 5,
    action: "টেলিগ্রাম চ্যানেলে জয়েন করুন",
    description: "চ্যানেলে জয়েন করে মিউট না রেখে নোটিফিকেশন অন রাখুন এবং স্ক্রিনশট দিন।",
    instructions: [
      "১. টেলিগ্রাম লিংকে ক্লিক করুন।",
      "২. Join Channel বাটনে চাপুন।",
      "৩. জয়েনড অবস্থার স্ক্রিনশট তুলে সাবমিট করুন।",
    ],
    targetUrl: "https://telegram.org",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_content_fb_income",
    title: "দিগন্ত থেকে অনলাইন ইনকাম করার বাস্তব অভিজ্ঞতা লিখুন",
    platform: "content",
    category: "Facebook Work",
    reward: 20,
    availableWorks: 15,
    action: "ফেসবুক পোস্ট লিখে লিংক ও স্ক্রিনশট দিন",
    description: "দিগন্ত ওয়েবসাইটে আপনার কাজ করার অভিজ্ঞতা, পেমেন্ট পাওয়ার প্রমাণ বা টাস্ক করার নিয়ম নিয়ে ফেসবুকে অন্তত ১০০ শব্দের একটি তথ্যবহুল পোস্ট লিখুন এবং সাবমিট করুন।",
    instructions: [
      "১. ফেসবুক প্রোফাইল বা যেকোনো সক্রিয় আর্নিং/জব গ্রুপে পোস্ট লিখুন।",
      "২. লেখায় দিগন্ত প্ল্যাটফর্মের কাজের নিয়ম ও সুবিধার কথা উল্লেখ করুন।",
      "৩. পোস্টের দৈর্ঘ্য ন্যূনতম ১০০ শব্দ হতে হবে।",
      "৪. পোস্টের লিংক এবং স্ক্রিনশট সাবমিট বক্সে জমা দিন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_content_fb_refer",
    title: "দিগন্তে রেফার করে বেশি ইনকাম করার কৌশল নিয়ে পোস্ট",
    platform: "content",
    category: "Facebook Work",
    reward: 25,
    availableWorks: 10,
    action: "রেফারেল গাইড ও টিপস নিয়ে পোস্ট করুন",
    description: "কীভাবে দিগন্তে রেফার করে আনলিমিটেড ইনকাম করা যায়, সে সম্পর্কে টিপস দিয়ে একটি আকর্ষণীয় ফেসবুক পোস্ট তৈরি করুন।",
    instructions: [
      "১. নিজের রেফার কোডসহ ফেসবুকে পোস্ট তৈরি করুন।",
      "২. বন্ধুদের দিগন্তে জয়েন করার নিয়ম বুঝিয়ে লিখুন।",
      "৩. পোস্টের লিংক ও প্রুফ স্ক্রিনশট সাবমিট করুন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
  {
    id: "task_content_fb_spin",
    title: "দিগন্তের ডেইলি লাকি স্পিন ও বোনাস নিয়ে রিভিউ লিখুন",
    platform: "content",
    category: "Facebook Work",
    reward: 15,
    availableWorks: 20,
    action: "স্পিন ও মিশন বোনাস সম্পর্কে পোস্ট লিখুন",
    description: "দিগন্তের দৈনিক লাকি স্পিন ও ৭ দিনের মিশন বোনাস কীভাবে কাজ করে তা নিয়ে ফেসবুকে বিস্তারিত পোস্ট শেয়ার করুন।",
    instructions: [
      "১. স্পিন বা বোনাস পাওয়ার স্ক্রিনশট যুক্ত করে পোস্ট লিখুন।",
      "২. পোস্ট পাবলিশ করে লিংক ও প্রুফ জমা দিন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "সকল প্যাকেজ",
    requiresScreenshot: true,
  },
];

const initialSubmissions: TaskSubmission[] = [
  {
    id: "sub_101",
    taskId: "task_yt_1",
    taskTitle: "YouTube ভিডিও দেখুন",
    userId: "user_1024",
    userName: "তামিম ইসলাম",
    platform: "youtube",
    reward: 10,
    screenshotUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80",
    userNote: "সম্পূর্ণ ২ মিনিট দেখে লাইক ও সাবস্ক্রাইব করেছি।",
    status: "APPROVED",
    submittedAt: "16 Sep 2026, 04:30 PM",
  },
  {
    id: "sub_102",
    taskId: "task_fb_1",
    taskTitle: "Facebook পেজ লাইক ও ফলো",
    userId: "user_1024",
    userName: "তামিম ইসলাম",
    platform: "facebook",
    reward: 8,
    screenshotUrl: "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=400&q=80",
    userNote: "পেজ ফলো করেছি।",
    status: "PENDING",
    submittedAt: "17 Sep 2026, 11:15 AM",
  },
  {
    id: "sub_cnt_101",
    taskId: "task_content_fb_income",
    taskTitle: "দিগন্ত থেকে অনলাইন ইনকাম করার বাস্তব অভিজ্ঞতা লিখুন",
    userId: "user_1024",
    userName: "তামিম ইসলাম",
    platform: "content",
    reward: 20,
    screenshotUrl: "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=600&q=80",
    userNote: "[লিংক: https://facebook.com/groups/earningbd/posts/10293847]\n\nদিগন্ত ওয়েবসাইটের মাধ্যমে ঘরে বসেই মোবাইল দিয়ে মাইক্রোজব ও ফেসবুক পোস্ট লিখে চমৎকার ইনকাম করা যায়। এডমিনরা অত্যন্ত দ্রুত পেমেন্ট অনুমোদন করেন।",
    status: "APPROVED",
    submittedAt: "18 Sep 2026, 03:40 PM",
  },
];

const initialDeposits: DepositItem[] = [
  {
    id: "dep_901",
    userId: "user_1024",
    userName: "তামিম ইসলাম",
    amount: 1000,
    paymentMethod: "bKash",
    senderNumber: "01712-345678",
    transactionId: "TRX89712634B",
    screenshotUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80",
    status: "APPROVED",
    adminNote: "পেমেন্ট সফলভাবে ভেরিফাই হয়েছে।",
    createdAt: "15 Sep 2026, 02:10 PM",
  },
];

const initialWithdrawals: WithdrawalItem[] = [
  {
    id: "wth_801",
    userId: "user_1024",
    userName: "তামিম ইসলাম",
    amount: 500,
    paymentMethod: "Nagad",
    accountNumber: "01789123456",
    maskedAccount: "01789*****56",
    status: "APPROVED",
    adminNote: "উইথড্র সম্পন্ন হয়েছে।",
    createdAt: "14 Sep 2026, 06:45 PM",
  },
];

const initialTransactions: TransactionItem[] = [
  {
    id: "tx_1",
    type: "DEPOSIT",
    direction: "CREDIT",
    amount: 1000,
    description: "bKash ডিপোজিট অনুমোদন",
    balanceAfter: 1000,
    createdAt: "15 Sep 2026, 02:10 PM",
  },
  {
    id: "tx_2",
    type: "WITHDRAWAL",
    direction: "DEBIT",
    amount: 500,
    description: "Nagad উইথড্রয়াল প্রসেসড",
    balanceAfter: 500,
    createdAt: "14 Sep 2026, 06:45 PM",
  },
  {
    id: "tx_3",
    type: "TASK_REWARD",
    direction: "CREDIT",
    amount: 10,
    description: "YouTube টাস্ক সম্পন্ন করার রিওয়ার্ড",
    balanceAfter: 510,
    createdAt: "16 Sep 2026, 04:30 PM",
  },
  {
    id: "tx_4",
    type: "REFERRAL_REWARD",
    direction: "CREDIT",
    amount: 20,
    description: "বন্ধুর প্যাকেজ পারচেজ বোনাস",
    balanceAfter: 530,
    createdAt: "16 Sep 2026, 08:20 PM",
  },
  {
    id: "tx_5",
    type: "DEPOSIT",
    direction: "CREDIT",
    amount: 720,
    description: "ম্যানুয়াল রিচার্জ ক্রেডিট",
    balanceAfter: 1250,
    createdAt: "17 Sep 2026, 09:00 AM",
  },
];

const initialReferrals: ReferralItem[] = [
  { id: "ref_1", name: "রাকিবুল হাসান", userId: "user_501", joinDate: "12 Sep 2026", status: "ACTIVE", reward: 20, hasPaidPackage: true },
  { id: "ref_2", name: "মেহেদী হাসান", userId: "user_502", joinDate: "14 Sep 2026", status: "ACTIVE", reward: 20, hasPaidPackage: true },
  { id: "ref_3", name: "আরিফ চৌধুরী", userId: "user_503", joinDate: "15 Sep 2026", status: "INACTIVE", reward: 0, hasPaidPackage: false },
  { id: "ref_4", name: "তানভীর আহমেদ", userId: "user_504", joinDate: "16 Sep 2026", status: "ACTIVE", reward: 20, hasPaidPackage: true },
];

const initialNotifications: NotificationItem[] = [
  { id: "notif_1", title: "টাস্ক অনুমোদিত!", message: "আপনার YouTube ভিডিও টাস্কটি অনুমোদিত হয়েছে এবং ৳ ১০ ব্যালেন্সে যুক্ত হয়েছে।", type: "TASK", read: false, createdAt: "১০ মিনিট আগে" },
  { id: "notif_2", title: "রেফারেল রিওয়ার্ড!", message: "আপনার আমন্ত্রণে রাকিবুল হাসান Gold প্যাকেজ কেনায় আপনি ৳ ২০ বোনাস পেয়েছেন।", type: "REFERRAL", read: false, createdAt: "২ ঘণ্টা আগে" },
  { id: "notif_3", title: "ডিপোজিট সফল!", message: "আপনার ৳ ১,০০০ ডিপোজিট অনুরোধ অ্যাডমিন কর্তৃক অনুমোদিত হয়েছে।", type: "FINANCE", read: true, createdAt: "গতকাল" },
];

const initialUsers: UserProfile[] = [
  initialProfile,
  {
    id: "user_1025",
    name: "সাকিব আল হাসান",
    phone: "01812-456789",
    email: "sakib.h@example.com",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
    packageName: "Silver",
    packageStatus: "ACTIVE",
    packageExpiry: "2026-10-01",
    balance: 840.0,
    totalEarned: 1420.0,
    totalWithdrawn: 500.0,
    completedTasksCount: 28,
    referralCode: "DIGON-5521",
    role: "USER",
    status: "ACTIVE",
  },
  {
    id: "user_1026",
    name: "নুসরাত জাহান",
    phone: "01923-887766",
    email: "nusrat.jahan@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    packageName: "Platinum",
    packageStatus: "ACTIVE",
    packageExpiry: "2026-11-20",
    balance: 3450.0,
    totalEarned: 5200.0,
    totalWithdrawn: 2000.0,
    completedTasksCount: 65,
    referralCode: "DIGON-9901",
    role: "USER",
    status: "ACTIVE",
  },
  {
    id: "user_1027",
    name: "মেহেদী হাসান",
    phone: "01633-112233",
    email: "mehedi.h@example.com",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&h=150&q=80",
    packageName: "Bronze",
    packageStatus: "ACTIVE",
    packageExpiry: "2026-09-30",
    balance: 150.0,
    totalEarned: 220.0,
    totalWithdrawn: 0.0,
    completedTasksCount: 6,
    referralCode: "DIGON-3344",
    role: "USER",
    status: "SUSPENDED",
  },
];

const initialSettings: AdminSettings = {
  minWithdrawal: 200,
  maxWithdrawal: 10000,
  referralBonus: 20,
  bkashNumber: "01789-000111",
  nagadNumber: "01889-222333",
  rocketNumber: "01989-444555",
  announcement: "দিগন্তে নতুন ফিচার আপডেট এসেছে! প্রতিদিন নতুন নতুন টাস্ক সম্পন্ন করে বেশি আয় করুন।",
  isWithdrawalEnabled: true,
  isDepositEnabled: true,
};

// In-Memory Global Store Manager with LocalStorage Persistence
export function useMockStore() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [packages, setPackages] = useState<PackageItem[]>(initialPackages);
  const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);
  const [submissions, setSubmissions] = useState<TaskSubmission[]>(initialSubmissions);
  const [deposits, setDeposits] = useState<DepositItem[]>(initialDeposits);
  const [withdrawals, setWithdrawals] = useState<WithdrawalItem[]>(initialWithdrawals);
  const [transactions, setTransactions] = useState<TransactionItem[]>(initialTransactions);
  const [referrals, setReferrals] = useState<ReferralItem[]>(initialReferrals);
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [users, setUsers] = useState<UserProfile[]>(initialUsers);
  const [settings, setSettings] = useState<AdminSettings>(initialSettings);
  const [dailyCheckIn, setDailyCheckIn] = useState<DailyCheckInState>(initialCheckIn);
  const [dailySpin, setDailySpin] = useState<DailySpinState>(initialSpinState);
  const [userSkillLevel, setUserSkillLevel] = useState<number>(1);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("digonto_profile");
      if (savedProfile) setProfile(JSON.parse(savedProfile));
      const savedSubmissions = localStorage.getItem("digonto_submissions");
      if (savedSubmissions) setSubmissions(JSON.parse(savedSubmissions));
      const savedDeposits = localStorage.getItem("digonto_deposits");
      if (savedDeposits) setDeposits(JSON.parse(savedDeposits));
      const savedWithdrawals = localStorage.getItem("digonto_withdrawals");
      if (savedWithdrawals) setWithdrawals(JSON.parse(savedWithdrawals));
      const savedTransactions = localStorage.getItem("digonto_transactions");
      if (savedTransactions) setTransactions(JSON.parse(savedTransactions));
      const savedUsers = localStorage.getItem("digonto_users");
      if (savedUsers) setUsers(JSON.parse(savedUsers));
      const savedSettings = localStorage.getItem("digonto_settings");
      if (savedSettings) setSettings(JSON.parse(savedSettings));
      const savedPackages = localStorage.getItem("digonto_packages");
      if (savedPackages) setPackages(JSON.parse(savedPackages));
      const savedTasks = localStorage.getItem("digonto_tasks");
      if (savedTasks) setTasks(JSON.parse(savedTasks));
      const savedCheckIn = localStorage.getItem("digonto_daily_checkin");
      if (savedCheckIn) setDailyCheckIn(JSON.parse(savedCheckIn));
      const savedSpin = localStorage.getItem("digonto_daily_spin");
      if (savedSpin) setDailySpin(JSON.parse(savedSpin));
      const savedSkill = localStorage.getItem("digonto_user_skill_level");
      if (savedSkill) setUserSkillLevel(JSON.parse(savedSkill));
    } catch {
      // ignore
    }
  }, []);

  // Save changes helper
  const syncStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {}
  };

  // 1. Submit Task Proof
  const submitTaskProof = (taskId: string, screenshotUrl: string, note?: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const newSub: TaskSubmission = {
      id: `sub_${Date.now()}`,
      taskId: task.id,
      taskTitle: task.title,
      userId: profile.id,
      userName: profile.name,
      platform: task.platform,
      reward: task.reward,
      screenshotUrl: screenshotUrl || "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80",
      userNote: note,
      status: "PENDING",
      submittedAt: "এইমাত্র",
    };

    const updated = [newSub, ...submissions];
    setSubmissions(updated);
    syncStorage("digonto_submissions", updated);

    // Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: "টাস্ক জমা হয়েছে!",
      message: `${task.title} প্রুফ জমা হয়েছে। অ্যাডমিন পর্যালোচনার পর রিওয়ার্ড যুক্ত হবে।`,
      type: "TASK",
      read: false,
      createdAt: "এইমাত্র",
    };
    setNotifications([newNotif, ...notifications]);
  };

  // 1b. Submit Content Writing Post
  const submitContentWritingPost = (params: {
    taskId?: string;
    topicTitle: string;
    postContent: string;
    socialUrl?: string;
    screenshotUrl?: string;
    reward?: number;
  }) => {
    const reward = params.reward || 20;
    const newSub: TaskSubmission = {
      id: `sub_cnt_${Date.now()}`,
      taskId: params.taskId || `task_content_${Date.now()}`,
      taskTitle: params.topicTitle,
      userId: profile.id,
      userName: profile.name,
      platform: "content",
      reward: reward,
      screenshotUrl:
        params.screenshotUrl ||
        "https://images.unsplash.com/photo-1542435503-956c469947f6?auto=format&fit=crop&w=600&q=80",
      userNote: `[ফেসবুক পোস্ট লিংক: ${params.socialUrl || "লিংক প্রদান করা হয়নি"}]\n\n${params.postContent}`,
      status: "PENDING",
      submittedAt: "এইমাত্র",
    };

    const updated = [newSub, ...submissions];
    setSubmissions(updated);
    syncStorage("digonto_submissions", updated);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: "কন্টেন্ট রাইটিং জমা হয়েছে!",
      message: `"${params.topicTitle}" সফলভাবে সাবমিট হয়েছে। এডমিন রিভিউ শেষে আপনার একাউন্টে ৳${reward} যোগ হবে।`,
      type: "TASK",
      read: false,
      createdAt: "এইমাত্র",
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    syncStorage("digonto_notifications", updatedNotifs);

    return { success: true, submissionId: newSub.id };
  };

  // 2. Submit Deposit
  const submitDeposit = (amount: number, method: string, senderNumber: string, trxId: string, screenshotUrl?: string) => {
    const newDep: DepositItem = {
      id: `dep_${Date.now()}`,
      userId: profile.id,
      userName: profile.name,
      amount,
      paymentMethod: method,
      senderNumber,
      transactionId: trxId,
      screenshotUrl,
      status: "PENDING",
      createdAt: "এইমাত্র",
    };

    const updated = [newDep, ...deposits];
    setDeposits(updated);
    syncStorage("digonto_deposits", updated);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: "ডিপোজিট রিকোয়েস্ট গৃহীত!",
      message: `৳ ${amount} রিচার্জের অনুরোধ জমা হয়েছে। কিছুক্ষণের মধ্যেই ব্যালেন্সে যোগ হবে।`,
      type: "FINANCE",
      read: false,
      createdAt: "এইমাত্র",
    };
    setNotifications([newNotif, ...notifications]);
  };

  // 3. Submit Withdrawal
  const submitWithdrawal = (amount: number, method: string, accountNumber: string) => {
    if (amount > profile.balance) {
      throw new Error("আপনার ব্যালেন্সে পর্যাপ্ত টাকা নেই!");
    }

    const masked = accountNumber.slice(0, 4) + "*****" + accountNumber.slice(-2);
    const newWth: WithdrawalItem = {
      id: `wth_${Date.now()}`,
      userId: profile.id,
      userName: profile.name,
      amount,
      paymentMethod: method,
      accountNumber,
      maskedAccount: masked,
      status: "PENDING",
      createdAt: "এইমাত্র",
    };

    // Debit-on-request rule: available balance is reserved/debited immediately
    const updatedBalance = profile.balance - amount;
    const updatedProfile = {
      ...profile,
      balance: updatedBalance,
      totalWithdrawn: profile.totalWithdrawn + amount,
    };
    setProfile(updatedProfile);
    syncStorage("digonto_profile", updatedProfile);

    const updatedWth = [newWth, ...withdrawals];
    setWithdrawals(updatedWth);
    syncStorage("digonto_withdrawals", updatedWth);

    // Ledger entry
    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: "WITHDRAWAL",
      direction: "DEBIT",
      amount,
      description: `${method} উইথড্রয়াল অনুরোধ (পেন্ডিং)`,
      balanceAfter: updatedBalance,
      createdAt: "এইমাত্র",
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    syncStorage("digonto_transactions", updatedTx);
  };

  // 4. Admin Approves Task Submission
  const approveSubmission = (subId: string) => {
    const sub = submissions.find((s) => s.id === subId);
    if (!sub || sub.status !== "PENDING") return;

    const updatedSub = submissions.map((s) => (s.id === subId ? { ...s, status: "APPROVED" as const } : s));
    setSubmissions(updatedSub);
    syncStorage("digonto_submissions", updatedSub);

    // Credit user balance
    const updatedBalance = profile.balance + sub.reward;
    const updatedProfile = {
      ...profile,
      balance: updatedBalance,
      totalEarned: profile.totalEarned + sub.reward,
      completedTasksCount: profile.completedTasksCount + 1,
    };
    setProfile(updatedProfile);
    syncStorage("digonto_profile", updatedProfile);

    // Ledger entry
    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: "TASK_REWARD",
      direction: "CREDIT",
      amount: sub.reward,
      description: `${sub.taskTitle} অনুমোদন রিওয়ার্ড`,
      balanceAfter: updatedBalance,
      createdAt: "এইমাত্র",
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    syncStorage("digonto_transactions", updatedTx);
  };

  // 5. Admin Rejects Task Submission
  const rejectSubmission = (subId: string, reason: string) => {
    const updatedSub = submissions.map((s) => (s.id === subId ? { ...s, status: "REJECTED" as const, rejectionReason: reason } : s));
    setSubmissions(updatedSub);
    syncStorage("digonto_submissions", updatedSub);
  };

  // 6. Admin Approves Deposit
  const approveDeposit = (depId: string) => {
    const dep = deposits.find((d) => d.id === depId);
    if (!dep || dep.status !== "PENDING") return;

    const updatedDep = deposits.map((d) => (d.id === depId ? { ...d, status: "APPROVED" as const } : d));
    setDeposits(updatedDep);
    syncStorage("digonto_deposits", updatedDep);

    const updatedBalance = profile.balance + dep.amount;
    const updatedProfile = { ...profile, balance: updatedBalance };
    setProfile(updatedProfile);
    syncStorage("digonto_profile", updatedProfile);

    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: "DEPOSIT",
      direction: "CREDIT",
      amount: dep.amount,
      description: `${dep.paymentMethod} ডিপোজিট অনুমোদন`,
      balanceAfter: updatedBalance,
      createdAt: "এইমাত্র",
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    syncStorage("digonto_transactions", updatedTx);
  };

  // 6b. Admin Rejects Deposit
  const rejectDeposit = (depId: string, note: string) => {
    const updatedDep = deposits.map((d) => (d.id === depId ? { ...d, status: "REJECTED" as const, adminNote: note } : d));
    setDeposits(updatedDep);
    syncStorage("digonto_deposits", updatedDep);
  };

  // 7. Admin Approves Withdrawal
  const approveWithdrawal = (wthId: string) => {
    const updatedWth = withdrawals.map((w) => (w.id === wthId ? { ...w, status: "APPROVED" as const } : w));
    setWithdrawals(updatedWth);
    syncStorage("digonto_withdrawals", updatedWth);
  };

  // 8. Admin Rejects Withdrawal (Reversal-on-reject: refunds debited money)
  const rejectWithdrawal = (wthId: string, note: string) => {
    const wth = withdrawals.find((w) => w.id === wthId);
    if (!wth || wth.status !== "PENDING") return;

    const updatedWth = withdrawals.map((w) => (w.id === wthId ? { ...w, status: "REJECTED" as const, adminNote: note } : w));
    setWithdrawals(updatedWth);
    syncStorage("digonto_withdrawals", updatedWth);

    // Refund reserved balance
    const updatedBalance = profile.balance + wth.amount;
    const updatedProfile = {
      ...profile,
      balance: updatedBalance,
      totalWithdrawn: profile.totalWithdrawn - wth.amount,
    };
    setProfile(updatedProfile);
    syncStorage("digonto_profile", updatedProfile);

    // Reversal transaction
    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: "WITHDRAWAL_REVERSAL",
      direction: "CREDIT",
      amount: wth.amount,
      description: "উইথড্রয়াল রিজেক্ট রিফান্ড",
      balanceAfter: updatedBalance,
      createdAt: "এইমাত্র",
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    syncStorage("digonto_transactions", updatedTx);
  };

  // 9. Admin Wallet Adjustment (current profile)
  const adjustUserWallet = (amount: number, direction: "CREDIT" | "DEBIT", reason: string) => {
    const newBalance = direction === "CREDIT" ? profile.balance + amount : profile.balance - amount;
    if (newBalance < 0) throw new Error("ব্যালেন্স ঋণাত্মক হতে পারবে না!");

    const updatedProfile = { ...profile, balance: newBalance };
    setProfile(updatedProfile);
    syncStorage("digonto_profile", updatedProfile);

    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: "ADMIN_ADJUSTMENT",
      direction,
      amount,
      description: `অ্যাডমিন অ্যাডজাস্টমেন্ট: ${reason}`,
      balanceAfter: newBalance,
      createdAt: "এইমাত্র",
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    syncStorage("digonto_transactions", updatedTx);
  };

  // 9b. Admin User Management
  const toggleUserStatus = (userId: string) => {
    const updatedUsers = users.map((u) => {
      if (u.id === userId) {
        const nextStatus = u.status === "SUSPENDED" ? ("ACTIVE" as const) : ("SUSPENDED" as const);
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updatedUsers);
    syncStorage("digonto_users", updatedUsers);
  };

  const adjustUserBalance = (userId: string, amount: number, direction: "CREDIT" | "DEBIT", reason: string) => {
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const newBal = direction === "CREDIT" ? target.balance + amount : target.balance - amount;
    if (newBal < 0) throw new Error("ব্যালেন্স ঋণাত্মক হতে পারবে না!");

    const updatedUsers = users.map((u) => (u.id === userId ? { ...u, balance: newBal } : u));
    setUsers(updatedUsers);
    syncStorage("digonto_users", updatedUsers);

    if (userId === profile.id) {
      setProfile({ ...profile, balance: newBal });
      syncStorage("digonto_profile", { ...profile, balance: newBal });
    }

    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: "ADMIN_ADJUSTMENT",
      direction,
      amount,
      description: `অ্যাডমিন ব্যালেন্স অ্যাডজাস্ট (${target.name}): ${reason}`,
      balanceAfter: newBal,
      createdAt: "এইমাত্র",
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    syncStorage("digonto_transactions", updatedTx);
  };

  // 10. Purchase Package
  const purchasePackage = (pkg: PackageItem) => {
    const updatedProfile = {
      ...profile,
      packageName: pkg.name,
      packageStatus: "ACTIVE",
    };
    setProfile(updatedProfile);
    syncStorage("digonto_profile", updatedProfile);

    // If purchasing paid package, reset 7-day daily check-in streak
    if (pkg.price > 0 || !pkg.name.includes("ফ্রি")) {
      const resetCheckIn: DailyCheckInState = {
        currentDay: 1,
        lastCheckInDate: null,
        history: [],
        rewards: [5, 7, 10, 15, 20, 25, 30],
        streakActive: true,
      };
      setDailyCheckIn(resetCheckIn);
      syncStorage("digonto_daily_checkin", resetCheckIn);
    }
  };

  // 10b. Perform Daily Check-In (Premium Only, 7 Days)
  const performDailyCheckIn = (): { success: boolean; amount?: number; message: string } => {
    const isPremium =
      Boolean(profile.packageName) &&
      !profile.packageName.includes("ফ্রি") &&
      profile.packageStatus === "ACTIVE";

    if (!isPremium) {
      return {
        success: false,
        message: "এটি শুধুমাত্র প্রিমিয়াম মেম্বারদের জন্য! প্যাকেজ কিনলে ৭ দিন পর্যন্ত দৈনিক লগইন বোনাস পাবেন।",
      };
    }

    const todayStr = new Date().toISOString().split("T")[0];
    if (dailyCheckIn.lastCheckInDate === todayStr) {
      return {
        success: false,
        message: "আপনি আজকের রিওয়ার্ড ইতিমধ্যে গ্রহণ করেছেন! আগামীকাল আবার চেক-ইন করুন।",
      };
    }

    if (dailyCheckIn.currentDay > 7 || dailyCheckIn.history.length >= 7) {
      return {
        success: false,
        message: "আপনার ৭ দিনের দৈনিক বোনাস সাইকেল সম্পন্ন হয়েছে! নতুন প্যাকেজ কিনে আবার ৭ দিনের বোনাস আনলক করুন।",
      };
    }

    const dayIdx = Math.min(dailyCheckIn.currentDay - 1, 6);
    const rewardAmount = dailyCheckIn.rewards[dayIdx] || 5;

    const newBalance = profile.balance + rewardAmount;
    const newTotalEarned = profile.totalEarned + rewardAmount;
    const updatedProfile = {
      ...profile,
      balance: newBalance,
      totalEarned: newTotalEarned,
    };
    setProfile(updatedProfile);
    syncStorage("digonto_profile", updatedProfile);

    const newTx: TransactionItem = {
      id: `tx_${Date.now()}`,
      type: "BONUS",
      direction: "CREDIT",
      amount: rewardAmount,
      description: `মিশন সেন্টার: দৈনিক লগইন বোনাস (দিন ${dailyCheckIn.currentDay})`,
      balanceAfter: newBalance,
      createdAt: "এইমাত্র",
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    syncStorage("digonto_transactions", updatedTx);

    const nextDay = dailyCheckIn.currentDay + 1;
    const updatedCheckIn: DailyCheckInState = {
      ...dailyCheckIn,
      currentDay: nextDay,
      lastCheckInDate: todayStr,
      history: [...dailyCheckIn.history, dailyCheckIn.currentDay],
    };
    setDailyCheckIn(updatedCheckIn);
    syncStorage("digonto_daily_checkin", updatedCheckIn);

    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: "দৈনিক লগইন বোনাস যোগ হয়েছে!",
      message: `অভিনন্দন! মিশন সেন্টারের দিন ${dailyCheckIn.currentDay}-এর ৳${rewardAmount} আপনার মূল ব্যালেন্সে যোগ হয়েছে।`,
      type: "FINANCE",
      read: false,
      createdAt: "এইমাত্র",
    };
    setNotifications([newNotif, ...notifications]);

    return {
      success: true,
      amount: rewardAmount,
      message: `অভিনন্দন! আপনি দিন ${dailyCheckIn.currentDay}-এর ৳${rewardAmount} রিওয়ার্ড পেয়েছেন!`,
    };
  };

  const resetDailyCheckInForTest = () => {
    const resetState: DailyCheckInState = {
      currentDay: 1,
      lastCheckInDate: null,
      history: [],
      rewards: [5, 7, 10, 15, 20, 25, 30],
      streakActive: true,
    };
    setDailyCheckIn(resetState);
    syncStorage("digonto_daily_checkin", resetState);
  };

  // 11. Task Management CRUD
  const createTask = (newTaskData: Omit<TaskItem, "id">) => {
    const newTask: TaskItem = {
      ...newTaskData,
      id: `task_${Date.now()}`,
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    syncStorage("digonto_tasks", updated);
  };

  const updateTask = (updatedTask: TaskItem) => {
    const updated = tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t));
    setTasks(updated);
    syncStorage("digonto_tasks", updated);
  };

  const deleteTask = (taskId: string) => {
    const updated = tasks.filter((t) => t.id !== taskId);
    setTasks(updated);
    syncStorage("digonto_tasks", updated);
  };

  // 12. Package Management CRUD
  const createPackage = (newPkgData: Omit<PackageItem, "id">) => {
    const newPkg: PackageItem = {
      ...newPkgData,
      id: `pkg_${Date.now()}`,
    };
    const updated = [...packages, newPkg];
    setPackages(updated);
    syncStorage("digonto_packages", updated);
  };

  const updatePackage = (updatedPkg: PackageItem) => {
    const updated = packages.map((p) => (p.id === updatedPkg.id ? updatedPkg : p));
    setPackages(updated);
    syncStorage("digonto_packages", updated);
  };

  const deletePackage = (pkgId: string) => {
    const updated = packages.filter((p) => p.id !== pkgId);
    setPackages(updated);
    syncStorage("digonto_packages", updated);
  };

  // 13. Settings Update
  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    syncStorage("digonto_settings", updated);
  };

  // 14. Skill Level
  const unlockNextSkillLevel = () => {
    const next = Math.min(userSkillLevel + 1, 3);
    setUserSkillLevel(next);
    syncStorage("digonto_user_skill_level", next);
  };

  // 15. Daily Lucky Spin Actions
  const performDailySpin = (reward: number): { success: boolean; newBalance: number } => {
    if (dailySpin.spinsRemaining <= 0) {
      return { success: false, newBalance: profile.balance };
    }
    const newBalance = profile.balance + reward;
    const updatedProfile = {
      ...profile,
      balance: newBalance,
      totalEarned: profile.totalEarned + reward,
    };
    setProfile(updatedProfile);
    syncStorage("digonto_profile", updatedProfile);

    const newHistoryItem: DailySpinHistoryItem = {
      id: `spin_${Date.now()}`,
      reward,
      timestamp: "এইমাত্র",
    };

    const updatedSpin: DailySpinState = {
      ...dailySpin,
      spinsRemaining: Math.max(0, dailySpin.spinsRemaining - 1),
      totalSpinsDone: dailySpin.totalSpinsDone + 1,
      lastSpinDate: new Date().toISOString().split("T")[0],
      history: [newHistoryItem, ...dailySpin.history],
    };
    setDailySpin(updatedSpin);
    syncStorage("digonto_daily_spin", updatedSpin);

    // Add transaction
    const newTx: TransactionItem = {
      id: `tx_spin_${Date.now()}`,
      type: "BONUS",
      direction: "CREDIT",
      amount: reward,
      description: `দৈনিক লাকি স্পিন রিওয়ার্ড: ৳${reward}`,
      balanceAfter: newBalance,
      createdAt: "এইমাত্র",
    };
    const updatedTx = [newTx, ...transactions];
    setTransactions(updatedTx);
    syncStorage("digonto_transactions", updatedTx);

    return { success: true, newBalance };
  };

  const resetDailySpinForTest = () => {
    const reset: DailySpinState = {
      spinsRemaining: 3,
      totalSpinsDone: 0,
      lastSpinDate: null,
      history: initialSpinState.history,
    };
    setDailySpin(reset);
    syncStorage("digonto_daily_spin", reset);
  };

  return {
    profile,
    packages,
    tasks,
    submissions,
    deposits,
    withdrawals,
    transactions,
    referrals,
    notifications,
    users,
    settings,
    userSkillLevel,
    unlockNextSkillLevel,
    submitTaskProof,
    submitContentWritingPost,
    submitDeposit,
    submitWithdrawal,
    approveSubmission,
    rejectSubmission,
    approveDeposit,
    rejectDeposit,
    approveWithdrawal,
    rejectWithdrawal,
    adjustUserWallet,
    toggleUserStatus,
    adjustUserBalance,
    purchasePackage,
    createTask,
    updateTask,
    deleteTask,
    dailyCheckIn,
    performDailyCheckIn,
    resetDailyCheckInForTest,
    dailySpin,
    performDailySpin,
    resetDailySpinForTest,
    createPackage,
    updatePackage,
    deletePackage,
    updateSettings,
  };
}
