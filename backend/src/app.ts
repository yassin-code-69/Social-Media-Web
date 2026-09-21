import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { corsConfig } from "@/config/cors";
import { APP_CONSTANTS } from "@/config/constants";
import { requestIdMiddleware } from "@/middleware/request-id";
import { errorHandler } from "@/middleware/error-handler";

// Route modules
import { healthRouter } from "@/modules/health/health.routes";
import { authRouter } from "@/modules/auth/auth.routes";
import { packagesRouter } from "@/modules/packages/packages.routes";
import { tasksRouter } from "@/modules/tasks/tasks.routes";
import { walletRouter } from "@/modules/wallet/wallet.routes";
import { referralsRouter } from "@/modules/referrals/referrals.routes";
import { salaryRouter } from "@/modules/salary/salary.routes";
import { icashRouter } from "@/modules/icash/icash.routes";
import { missionsRouter } from "@/modules/missions/missions.routes";
import { contentRouter } from "@/modules/content/content.routes";
import { mediaRouter } from "@/modules/media/media.routes";
import { notificationsRouter } from "@/modules/notifications/notifications.routes";
import { adminRouter } from "@/modules/admin/admin.routes";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { systemSettings, profiles, wallets } from "@/db/schema";
import { apiSuccess } from "@/shared/responses/api-response";
import { AppEnv } from "@/types/context";

export const app = new Hono<AppEnv>();

// Global Middlewares
app.use("*", honoLogger());
app.use("*", cors(corsConfig));
app.use("*", requestIdMiddleware);

// Error Handling
app.onError(errorHandler);

// API v1 Router
const v1 = new Hono<AppEnv>();

v1.route("/health", healthRouter);
v1.route("/auth", authRouter);
v1.route("/packages", packagesRouter);
v1.route("/tasks", tasksRouter);
v1.route("/wallet", walletRouter);
v1.route("/referrals", referralsRouter);
v1.route("/salary", salaryRouter);
v1.route("/icash", icashRouter);
v1.route("/missions", missionsRouter);
v1.route("/content", contentRouter);
v1.route("/media", mediaRouter);
v1.route("/notifications", notificationsRouter);
v1.route("/admin", adminRouter);

// Public features configuration for Quick Action Grid
v1.get("/features", async (c) => {
  const [setting] = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.key, "dashboard_features"))
    .limit(1);

  const DEFAULT_FEATURES_LIST = [
    { id: "daily-bonus", title: "ডেইলি লগইন..", subtitle: "মিশন সেন্টার ও রিওয়ার্ড", status: "ACTIVE", badge: "" },
    { id: "free-task", title: "ফ্রি টাস্ক", subtitle: "সহজ কাজ করুন", status: "ACTIVE", badge: "" },
    { id: "job-post", title: "জব পোস্ট", subtitle: "নতুন কাজ দিন ও কর্মী নিন", status: "ACTIVE", badge: "" },
    { id: "lucky-spin", title: "লাকি স্পিন", subtitle: "চাকা ঘুরিয়ে জিতে নিন", status: "ACTIVE", badge: "" },
    { id: "leadership", title: "লিডারবোর্ড", subtitle: "টপ মেম্বারদের তালিকা", status: "ACTIVE", badge: "" },
    { id: "monthly-bonus", title: "মাসিক বোনাস", subtitle: "অতিরিক্ত ইনকাম", status: "ACTIVE", badge: "" },
    { id: "digonto-level", title: "দিগন্ত স্তর", subtitle: "সুবিধাজনক প্ল্যান", status: "ACTIVE", badge: "" },
    { id: "referral", title: "রেফারেল", subtitle: "বন্ধুদের আমন্ত্রণ", status: "ACTIVE", badge: "" },
    { id: "icash", title: "I Cash", subtitle: "সহজ পেমেন্ট সল্যুশন", status: "ACTIVE", badge: "" },
    { id: "gift-code", title: "গিফট কোড", subtitle: "কোড ব্যবহার করুন", status: "ACTIVE", badge: "" },
    { id: "content-writing", title: "কন্টেন্ট রাইটিং", subtitle: "লিখে আয় করুন", status: "ACTIVE", badge: "" },
    { id: "video-content", title: "ভিডিও কনটেন্ট", subtitle: "দিগন্তের জন্য ভিডিও বানিয়ে আয়", status: "ACTIVE", badge: "" },
    { id: "offerwall", title: "অফারওয়াল ও সার্ভে", subtitle: "বেশি কাজ, বেশি আয়", status: "ACTIVE", badge: "" },
    { id: "article-reading", title: "আর্টিকেল পড়া", subtitle: "পড়ে আয় করুন", status: "ACTIVE", badge: "" },
    { id: "captcha", title: "ক্যাপচা সলভিং", subtitle: "Upcoming", status: "UPCOMING", badge: "Upcoming" },
  ];

  return c.json(apiSuccess((setting?.value as any) || DEFAULT_FEATURES_LIST));
});

// Public platform settings for referral bonus & announcements
v1.get("/settings", async (c) => {
  const [setting] = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.key, "platform_settings"))
    .limit(1);

  const val = (setting?.value as any) || {};
  return c.json(
    apiSuccess({
      minWithdrawal: val.minWithdrawal ?? 200,
      maxWithdrawal: val.maxWithdrawal ?? 10000,
      referralBonus: val.referralBonus ?? 20,
      monthlyBonus: val.monthlyBonus ?? 500,
      announcement: val.announcement || "",
      isWithdrawalEnabled: val.isWithdrawalEnabled ?? true,
      isDepositEnabled: val.isDepositEnabled ?? true,
      bkashNumber: val.bkashNumber || "01789-000111",
      nagadNumber: val.nagadNumber || "01889-222333",
      rocketNumber: val.rocketNumber || "01989-444555",
    })
  );
});

// Dynamic Leaderboard from live DB profiles
v1.get("/leaderboard", async (c) => {
  const usersWithWallets = await db
    .select({
      id: profiles.id,
      displayName: profiles.displayName,
      phone: profiles.phone,
      avatarUrl: profiles.avatarUrl,
      role: profiles.role,
      balance: wallets.balanceMinor,
      totalEarned: wallets.totalEarnedMinor,
    })
    .from(profiles)
    .leftJoin(wallets, eq(profiles.id, wallets.userId))
    .where(eq(profiles.status, "ACTIVE"))
    .limit(50);

  const formatted = usersWithWallets.map((u, idx) => ({
    id: u.id,
    name: u.displayName,
    phone: u.phone ? `${u.phone.slice(0, 5)}***${u.phone.slice(-2)}` : "017********",
    avatar: u.avatarUrl || "",
    packageName: u.role === "ADMIN" || u.role === "SUPER_ADMIN" ? "অ্যাডমিন" : "সদস্য",
    totalEarned: Number(u.totalEarned || 0) / 100,
    completedTasks: 0,
    referrals: 0,
    rank: idx + 1,
  }));

  return c.json(apiSuccess(formatted));
});

// Mount under API prefix (/api/v1) and (/api) for compatibility
app.route(APP_CONSTANTS.API_PREFIX, v1);
app.route("/api", v1);

// Fallback for not found
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Endpoint ${c.req.path} not found`,
      },
    },
    404
  );
});
