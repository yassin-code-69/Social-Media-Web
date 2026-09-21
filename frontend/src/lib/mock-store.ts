"use client";

import { useState, useEffect } from "react";
import { authApi, tasksApi, packagesApi, adminApi, notificationsApi, settingsApi } from "./api-client";

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
  monthlyBonus?: number;
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
  id: "guest",
  name: "অতিথি মেম্বার",
  phone: "",
  email: "",
  avatar: "",
  packageName: "ফ্রি মেম্বার",
  packageStatus: "FREE",
  packageExpiry: "২০২৭",
  balance: 0.0,
  totalEarned: 0.0,
  totalWithdrawn: 0.0,
  completedTasksCount: 0,
  referralCode: "",
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
const initialTasks: TaskItem[] = [];
const initialSubmissions: TaskSubmission[] = [];
const initialDeposits: DepositItem[] = [];
const initialWithdrawals: WithdrawalItem[] = [];
const initialTransactions: TransactionItem[] = [];
const initialReferrals: ReferralItem[] = [];
const initialNotifications: NotificationItem[] = [];
const initialUsers: UserProfile[] = [];

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
  monthlyBonus: 500,
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

  // Initialize from LocalStorage and sync with backend
  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("digonto_profile");
      const savedUser = localStorage.getItem("user_profile");
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);
        // If it contains legacy mock data, purge it completely
        if (
          parsed.id === "usr_mock_123" ||
          parsed.name === "হাসিবুর রহমান" ||
          parsed.packageName === "Gold" ||
          parsed.balance === 350 ||
          parsed.completedTasksCount === 12 ||
          (parsed.avatar && parsed.avatar.includes("1534528741775-53994a69daeb"))
        ) {
          localStorage.removeItem("digonto_profile");
          setProfile(initialProfile);
        } else {
          setProfile(parsed);
        }
      } else if (savedUser) {
        const u = JSON.parse(savedUser);
        setProfile((prev) => ({
          ...prev,
          id: u.referralCode || u.id || "user_new",
          name: u.displayName || u.name || "নতুন সদস্য",
          phone: u.phone || "",
          email: u.email || "",
          avatar: u.avatarUrl || "",
          packageName: "ফ্রি মেম্বার",
          role: u.role || "USER",
          referralCode: u.referralCode || "",
        }));
      }

      // Fetch live user info from backend if token exists
      const token = localStorage.getItem("access_token");
      if (token) {
        authApi.me().then((res) => {
          if (res?.user) {
            const liveProfile: UserProfile = {
              id: res.user.referralCode || res.user.id,
              name: res.user.displayName,
              phone: res.user.phone,
              email: res.user.email,
              avatar: res.user.avatarUrl || "",
              packageName: res.activePackage?.name || "ফ্রি মেম্বার",
              packageStatus: res.activePackage ? "ACTIVE" : "FREE",
              packageExpiry: res.activePackage?.expiresAt ? new Date(res.activePackage.expiresAt).toLocaleDateString("bn-BD") : "২০২৭",
              balance: Number(res.wallet?.balance?.amount || 0),
              totalEarned: Number(res.wallet?.totalEarned?.amount || 0),
              totalWithdrawn: Number(res.wallet?.totalWithdrawn?.amount || 0),
              completedTasksCount: 0,
              referralCode: res.user.referralCode,
              role: res.user.role || "USER",
            };
            setProfile(liveProfile);
            localStorage.setItem("digonto_profile", JSON.stringify(liveProfile));
          }
        }).catch(() => {});
      }

      // Purge legacy mock data from browser localStorage if present
      const legacyMockKeys = [
        "digonto_submissions",
        "digonto_deposits",
        "digonto_withdrawals",
        "digonto_transactions",
        "digonto_referrals",
        "digonto_users",
        "digonto_tasks",
      ];
      for (const k of legacyMockKeys) {
        const item = localStorage.getItem(k);
        if (
          item &&
          (item.includes("task_yt_1") ||
            item.includes("sub_101") ||
            item.includes("dep_901") ||
            item.includes("wth_801") ||
            item.includes("tx_1") ||
            item.includes("user_1025") ||
            item.includes("ref_1"))
        ) {
          localStorage.removeItem(k);
        }
      }

      // Restore notifications from storage
      const savedNotifs = localStorage.getItem("digonto_notifications");
      if (savedNotifs) {
        try {
          const parsed = JSON.parse(savedNotifs);
          if (Array.isArray(parsed)) {
            setNotifications(parsed);
          }
        } catch {}
      }

      // Fetch live notifications from backend
      notificationsApi
        .getAll()
        .then((res: any) => {
          const list = res?.data?.notifications || res?.notifications;
          if (Array.isArray(list)) {
            setNotifications(list);
            localStorage.setItem("digonto_notifications", JSON.stringify(list));
          }
        })
        .catch(() => {});

      // Fetch live tasks from database
      tasksApi
        .getAll()
        .then((data: any) => {
          const realList = Array.isArray(data) ? data : data?.tasks || [];
          if (realList.length > 0) {
            const mapped: TaskItem[] = realList.map((t: any) => ({
              id: t.id,
              title: t.title,
              platform: (t.platform || "website").toLowerCase() as any,
              reward: Number(t.reward?.amount || (t.rewardMinor ? Number(t.rewardMinor) / 100 : 10)),
              action: t.action || "টাস্ক সম্পন্ন করুন",
              description: t.description || "",
              instructions: Array.isArray(t.instructions) ? t.instructions : ["টাস্কের নিয়ম অনুসরণ করে প্রুফ দিন।"],
              targetUrl: t.targetUrl || "#",
              requiredPackage: t.requiredPackage || "সকলের জন্য",
              requiresScreenshot: t.requiresScreenshot !== false,
            }));
            setTasks(mapped);
          }
        })
        .catch(() => {});

      // Fetch live packages from database
      packagesApi
        .getAll()
        .then((data: any) => {
          const realList = Array.isArray(data) ? data : data?.packages || [];
          if (realList.length > 0) {
            const mapped: PackageItem[] = realList.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: Number(p.price?.amount || (p.priceMinor ? Number(p.priceMinor) / 100 : 0)),
              validityDays: p.validityDays || 30,
              dailyTaskLimit: p.dailyTaskLimit || 10,
              dailyRewardLimit: p.dailyRewardLimit || 100,
              referralBonus: p.referralBonus || 10,
              color: "from-blue-600 to-indigo-800",
              features: Array.isArray(p.features) ? p.features : ["দৈনিক টাস্ক", "দ্রুত সাপোর্ট", "রেফারেল কমিশন"],
            }));
            setPackages(mapped);
          }
        })
        .catch(() => {});

      // Fetch live platform settings
      settingsApi
        .getSettings()
        .then((res: any) => {
          const s = res?.data || res;
          if (s && typeof s === "object") {
            setSettings((prev) => ({
              ...prev,
              ...s,
            }));
            localStorage.setItem("digonto_settings", JSON.stringify(s));
          }
        })
        .catch(() => {});

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

  // Sync state changes across all components on the current page
  useEffect(() => {
    const handleSync = (e: any) => {
      const { key, data } = e.detail || {};
      if (key === "digonto_notifications") setNotifications(data);
      if (key === "digonto_profile") setProfile(data);
      if (key === "digonto_submissions") setSubmissions(data);
      if (key === "digonto_deposits") setDeposits(data);
      if (key === "digonto_withdrawals") setWithdrawals(data);
      if (key === "digonto_transactions") setTransactions(data);
      if (key === "digonto_settings") setSettings(data);
      if (key === "digonto_daily_checkin") setDailyCheckIn(data);
      if (key === "digonto_daily_spin") setDailySpin(data);
    };
    if (typeof window !== "undefined") {
      window.addEventListener("digonto_store_sync", handleSync);
      return () => window.removeEventListener("digonto_store_sync", handleSync);
    }
  }, []);

  // Save changes helper with cross-component sync event
  const syncStorage = (key: string, data: any) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("digonto_store_sync", { detail: { key, data } }));
      }
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
      screenshotUrl: screenshotUrl || "",
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
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    syncStorage("digonto_notifications", updatedNotifs);
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
      screenshotUrl: params.screenshotUrl || "",
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
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    syncStorage("digonto_notifications", updatedNotifs);
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

    // Add withdrawal notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: "উইথড্রয়াল অনুরোধ জমা হয়েছে!",
      message: `৳ ${amount} উত্তোলনের অনুরোধ প্রক্রিয়াধীন রয়েছে।`,
      type: "FINANCE",
      read: false,
      createdAt: "এইমাত্র",
    };
    const updatedNotifs = [newNotif, ...notifications];
    setNotifications(updatedNotifs);
    syncStorage("digonto_notifications", updatedNotifs);
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

  const markNotificationAsRead = (id: string) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    setNotifications(updated);
    syncStorage("digonto_notifications", updated);
    notificationsApi.markAsRead(id).catch(() => {});
  };

  const markAllNotificationsAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    syncStorage("digonto_notifications", updated);
    notificationsApi.markAllAsRead().catch(() => {});
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...updates };
      syncStorage("digonto_profile", updated);
      return updated;
    });
  };

  return {
    profile,
    updateProfile,
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    packages,
    tasks,
    submissions,
    deposits,
    withdrawals,
    transactions,
    referrals,
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
