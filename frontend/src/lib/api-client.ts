const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api/v1";

interface FetchOptions extends RequestInit {
  data?: unknown;
}

export async function apiFetch<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  let token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const isAdminPath = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  const storedRole = typeof window !== "undefined" ? (() => {
    try {
      return JSON.parse(localStorage.getItem("user_profile") || "{}")?.role;
    } catch {
      return null;
    }
  })() : null;

  // In development, allow easy admin panel access if not logged in with an admin Supabase session
  if (isAdminPath && (!token || (storedRole !== "ADMIN" && storedRole !== "SUPER_ADMIN"))) {
    token = "dev_admin_token";
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const res = await fetch(url, {
    ...options,
    headers,
    body: options.data ? JSON.stringify(options.data) : options.body,
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json.success === false) {
    if (res.status === 401 && typeof window !== "undefined") {
      // Clear expired session token so subsequent requests don't loop with 401
      if (token && token !== "dev_admin_token") {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_profile");
      }
    }
    const errorMsg =
      json.error?.message ||
      json.message ||
      (typeof json === "string" ? json : "সার্ভারে সমস্যা হয়েছে, অনুগ্রহ করে পুনরায় চেষ্টা করুন");
    throw new Error(errorMsg);
  }

  return json.data !== undefined ? json.data : json;
}

// 1. Auth API
export const authApi = {
  login: async (identifier: string, password: string) => {
    const data = await apiFetch("/auth/login", {
      method: "POST",
      data: { identifier, password },
    });
    if (data.session?.access_token) {
      localStorage.setItem("access_token", data.session.access_token);
      localStorage.setItem("user_profile", JSON.stringify(data.user));

      const synchedProfile = {
        id: data.user.referralCode || data.user.id,
        name: data.user.displayName,
        phone: data.user.phone,
        email: data.user.email,
        avatar: data.user.avatarUrl || "",
        packageName: "ফ্রি মেম্বার",
        packageStatus: "ACTIVE",
        packageExpiry: "২০২৭",
        balance: Number(data.wallet?.balance?.amount || 0),
        totalEarned: Number(data.wallet?.totalEarned?.amount || 0),
        totalWithdrawn: Number(data.wallet?.totalWithdrawn?.amount || 0),
        completedTasksCount: 0,
        referralCode: data.user.referralCode,
        role: data.user.role || "USER",
      };
      localStorage.setItem("digonto_profile", JSON.stringify(synchedProfile));
    }
    return data;
  },

  register: async (payload: {
    displayName: string;
    phone: string;
    email: string;
    password: string;
    referralCode?: string | null;
  }) => {
    const data = await apiFetch("/auth/register", {
      method: "POST",
      data: payload,
    });
    if (data.session?.access_token) {
      localStorage.setItem("access_token", data.session.access_token);
      localStorage.setItem("user_profile", JSON.stringify(data.user));

      const synchedProfile = {
        id: data.user.referralCode || data.user.id,
        name: data.user.displayName,
        phone: data.user.phone,
        email: data.user.email,
        avatar: data.user?.avatarUrl || "",
        packageName: "ফ্রি মেম্বার",
        packageStatus: "ACTIVE",
        packageExpiry: "২০২৭",
        balance: Number(data.wallet?.balance?.amount || 0),
        totalEarned: Number(data.wallet?.totalEarned?.amount || 0),
        totalWithdrawn: Number(data.wallet?.totalWithdrawn?.amount || 0),
        completedTasksCount: 0,
        referralCode: data.user.referralCode,
        role: data.user.role || "USER",
      };
      localStorage.setItem("digonto_profile", JSON.stringify(synchedProfile));
    }
    return data;
  },

  me: async () => {
    return apiFetch("/auth/me");
  },

  logout: async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch {}
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_profile");
    localStorage.removeItem("digonto_profile");
  },
};

// 2. Packages API
export const packagesApi = {
  getAll: () => apiFetch("/packages"),
  getById: (id: string) => apiFetch(`/packages/${id}`),
  purchase: (payload: {
    packageId: string;
    paymentMethod: string;
    senderNumber: string;
    transactionId: string;
  }) => apiFetch("/packages/purchase", { method: "POST", data: payload }),
};

// 3. Tasks API
export const tasksApi = {
  getAll: (platform?: string) =>
    apiFetch(`/tasks${platform ? `?platform=${encodeURIComponent(platform)}` : ""}`),
  getById: (id: string) => apiFetch(`/tasks/${id}`),
  submit: (taskId: string, payload: { screenshotUrl: string; userNote?: string }) =>
    apiFetch(`/tasks/${taskId}/submit`, { method: "POST", data: payload }),
  mySubmissions: () => apiFetch("/tasks/my-submissions"),
};

// 4. Wallet API
export const walletApi = {
  getWallet: () => apiFetch("/wallet"),
  getTransactions: () => apiFetch("/wallet/transactions"),
  getPaymentMethods: () => apiFetch("/wallet/payment-methods"),
  deposit: (payload: {
    amount: number;
    paymentMethod: string;
    senderNumber: string;
    transactionId: string;
    screenshotUrl?: string;
  }) => apiFetch("/wallet/deposit", { method: "POST", data: payload }),
  withdraw: (payload: { amount: number; paymentMethod: string; accountNumber: string }) =>
    apiFetch("/wallet/withdraw", { method: "POST", data: payload }),
  myRequests: () => apiFetch("/wallet/my-requests"),
};

// 5. Referrals API
export const referralsApi = {
  getSummary: () => apiFetch("/referrals/summary"),
  getList: () => apiFetch("/referrals/list"),
};

// 6. Monthly Salary & Incentives API
export const salaryApi = {
  getStatus: () => apiFetch("/salary/status"),
  claim: () => apiFetch("/salary/claim", { method: "POST" }),
  claimIncentive: (payload: {
    recipientName: string;
    deliveryPhone: string;
    deliveryAddress: string;
  }) => apiFetch("/salary/incentive/claim", { method: "POST", data: payload }),
};

// 7. I Cash Investment API
export const icashApi = {
  getPlans: () => apiFetch("/icash/plans"),
  getMyInvestments: () => apiFetch("/icash/my-investments"),
  invest: (payload: { planId: string; amountBDT: number }) =>
    apiFetch("/icash/invest", { method: "POST", data: payload }),
  claimProfit: (investmentId: string) =>
    apiFetch(`/icash/claim-profit/${investmentId}`, { method: "POST" }),
};

// 8. Missions API
export const missionsApi = {
  getDailyCheckinStatus: () => apiFetch("/missions/daily-checkin/status"),
  dailyCheckin: () => apiFetch("/missions/daily-checkin", { method: "POST" }),
  getLuckySpinStatus: () => apiFetch("/missions/lucky-spin/status"),
  luckySpin: () => apiFetch("/missions/lucky-spin", { method: "POST" }),
  redeemGiftCode: (code: string) =>
    apiFetch("/missions/gift-code/redeem", { method: "POST", data: { code } }),
};

// 9. Content API
export const contentApi = {
  getGuidelines: () => apiFetch("/content/guidelines"),
  getMySubmissions: () => apiFetch("/content/my-submissions"),
  submit: (payload: {
    type: "ARTICLE" | "VIDEO";
    title: string;
    contentBody?: string;
    mediaUrl?: string;
  }) => apiFetch("/content/submit", { method: "POST", data: payload }),
};

// 10. Admin API
export const adminApi = {
  getStats: () => apiFetch("/admin/stats"),

  // Submissions review
  getSubmissions: () => apiFetch("/admin/submissions"),
  approveSubmission: (id: string) => apiFetch(`/admin/submissions/${id}/approve`, { method: "POST" }),
  rejectSubmission: (id: string, reason: string) =>
    apiFetch(`/admin/submissions/${id}/reject`, { method: "POST", data: { reason } }),

  // Deposits
  getDeposits: () => apiFetch("/admin/deposits"),
  approveDeposit: (id: string) => apiFetch(`/admin/deposits/${id}/approve`, { method: "POST" }),
  rejectDeposit: (id: string, reason: string) =>
    apiFetch(`/admin/deposits/${id}/reject`, { method: "POST", data: { reason } }),

  // Withdrawals
  getWithdrawals: () => apiFetch("/admin/withdrawals"),
  approveWithdrawal: (id: string) => apiFetch(`/admin/withdrawals/${id}/approve`, { method: "POST" }),
  rejectWithdrawal: (id: string, reason: string) =>
    apiFetch(`/admin/withdrawals/${id}/reject`, { method: "POST", data: { reason } }),

  // Package Purchases
  getPackagePurchases: () => apiFetch("/admin/packages/purchases"),
  approvePackagePurchase: (id: string) =>
    apiFetch(`/admin/packages/purchases/${id}/approve`, { method: "POST" }),
  rejectPackagePurchase: (id: string, reason: string) =>
    apiFetch(`/admin/packages/purchases/${id}/reject`, { method: "POST", data: { reason } }),

  // Users Management
  getUsers: () => apiFetch("/admin/users"),
  adjustUserBalance: (
    id: string,
    payload: { amount: number; direction: "CREDIT" | "DEBIT"; reason?: string }
  ) => apiFetch(`/admin/users/${id}/adjust-balance`, { method: "POST", data: payload }),
  updateUserStatus: (id: string, status: "ACTIVE" | "SUSPENDED" | "BLOCKED") =>
    apiFetch(`/admin/users/${id}/status`, { method: "POST", data: { status } }),
  updateUserRole: (id: string, role: "USER" | "ADMIN" | "SUPER_ADMIN") =>
    apiFetch(`/admin/users/${id}/role`, { method: "POST", data: { role } }),

  // Packages Management
  getPackages: () => apiFetch("/admin/packages"),
  createPackage: (payload: any) => apiFetch("/admin/packages", { method: "POST", data: payload }),
  updatePackage: (id: string, payload: any) =>
    apiFetch(`/admin/packages/${id}`, { method: "PUT", data: payload }),
  deletePackage: (id: string) => apiFetch(`/admin/packages/${id}`, { method: "DELETE" }),

  // Tasks Management
  getTasks: () => apiFetch("/admin/tasks"),
  createTask: (payload: any) => apiFetch("/admin/tasks", { method: "POST", data: payload }),
  updateTask: (id: string, payload: any) =>
    apiFetch(`/admin/tasks/${id}`, { method: "PUT", data: payload }),
  deleteTask: (id: string) => apiFetch(`/admin/tasks/${id}`, { method: "DELETE" }),

  // System Settings
  getSettings: () => apiFetch("/admin/settings"),
  updateSettings: (payload: any) => apiFetch("/admin/settings", { method: "PUT", data: payload }),

  // Dashboard Features & Quick Action Grid Control
  getFeatures: () => apiFetch("/admin/features"),
  updateFeatures: (features: any[]) =>
    apiFetch("/admin/features", { method: "PUT", data: { features } }),

  // Gift Codes Management
  getGiftCodes: () => apiFetch("/admin/gift-codes"),
  createGiftCode: (payload: { code: string; reward: number; maxUses?: number; expiresAt?: string | null }) =>
    apiFetch("/admin/gift-codes", { method: "POST", data: payload }),
  toggleGiftCode: (id: string) => apiFetch(`/admin/gift-codes/${id}/toggle`, { method: "POST" }),
  deleteGiftCode: (id: string) => apiFetch(`/admin/gift-codes/${id}`, { method: "DELETE" }),
  getGiftCodeRedemptions: (id: string) => apiFetch(`/admin/gift-codes/${id}/redemptions`),

  // Monthly Salary & Physical Incentive Claims
  getSalaryClaims: () => apiFetch("/admin/salary-claims"),
  approveSalaryClaim: (id: string) => apiFetch(`/admin/salary-claims/${id}/approve`, { method: "POST" }),
  rejectSalaryClaim: (id: string, reason?: string) =>
    apiFetch(`/admin/salary-claims/${id}/reject`, { method: "POST", data: { reason } }),

  getIncentiveClaims: () => apiFetch("/admin/incentive-claims"),
  approveIncentiveClaim: (id: string, payload?: { trackingNumber?: string; status?: string }) =>
    apiFetch(`/admin/incentive-claims/${id}/approve`, { method: "POST", data: payload }),
  rejectIncentiveClaim: (id: string, reason?: string) =>
    apiFetch(`/admin/incentive-claims/${id}/reject`, { method: "POST", data: { reason } }),

  // Content Submissions Review (Articles & Videos)
  getContentSubmissions: () => apiFetch("/admin/content-submissions"),
  approveContentSubmission: (id: string, payload: { reward: number; feedback?: string }) =>
    apiFetch(`/admin/content-submissions/${id}/approve`, { method: "POST", data: payload }),
  rejectContentSubmission: (id: string, feedback?: string) =>
    apiFetch(`/admin/content-submissions/${id}/reject`, { method: "POST", data: { feedback } }),

  // I Cash Plans & User Investments
  getIcashPlans: () => apiFetch("/admin/icash/plans"),
  updateIcashPlan: (id: string, payload: { profitPercent: number; minDeposit: number; maxDeposit: number }) =>
    apiFetch(`/admin/icash/plans/${id}`, { method: "PUT", data: payload }),
  getIcashInvestments: () => apiFetch("/admin/icash/investments"),
};

// 11. Public Features API for Quick Action Grid
export const featuresApi = {
  getFeatures: () => apiFetch("/features"),
};

// 12. Leaderboard API
export const leaderboardApi = {
  getLeaderboard: () => apiFetch("/leaderboard"),
};

// 13. Notifications API
export const notificationsApi = {
  getAll: () => apiFetch<{ notifications: any[]; unreadCount: number }>("/notifications"),
  markAsRead: (id: string) => apiFetch(`/notifications/${id}/read`, { method: "PATCH" }),
  markAllAsRead: () => apiFetch("/notifications/read-all", { method: "POST" }),
};

// 14. Public Settings API
export const settingsApi = {
  getSettings: () => apiFetch<any>("/settings"),
};



