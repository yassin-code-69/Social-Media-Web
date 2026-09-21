import { Hono } from "hono";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  profiles,
  wallets,
  walletTransactions,
  deposits,
  withdrawals,
  tasks,
  taskSubmissions,
  packagePurchases,
  packages,
  userPackages,
  monthlySalaryClaims,
  incentiveClaims,
  contentSubmissions,
  paymentMethods,
  systemSettings,
  giftCodes,
  giftCodeRedemptions,
  icashPlans,
  icashInvestments,
} from "@/db/schema";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { requireAdmin } from "@/middleware/admin";
import { serializeMoney, toMinorUnits } from "@/shared/utils/money";
import { BadRequestError, NotFoundError } from "@/shared/errors/app-error";
import { AppEnv } from "@/types/context";

export const adminRouter = new Hono<AppEnv>();

adminRouter.use("*", requireAuth, requireAdmin);

// 1. Dashboard metrics
adminRouter.get("/stats", async (c) => {
  const [userCount] = await db.select({ count: sql<number>`count(*)::int` }).from(profiles);
  const [subCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(taskSubmissions)
    .where(eq(taskSubmissions.status, "PENDING"));
  const [depCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(deposits)
    .where(eq(deposits.status, "PENDING"));
  const [wthCount] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(withdrawals)
    .where(eq(withdrawals.status, "PENDING"));

  const [totalDep] = await db
    .select({ sum: sql<string>`coalesce(sum(amount_minor), 0)::text` })
    .from(deposits)
    .where(eq(deposits.status, "APPROVED"));

  const [totalWth] = await db
    .select({ sum: sql<string>`coalesce(sum(amount_minor), 0)::text` })
    .from(withdrawals)
    .where(eq(withdrawals.status, "APPROVED"));

  return c.json(
    apiSuccess({
      pendingSubmissions: subCount?.count || 0,
      pendingDeposits: depCount?.count || 0,
      pendingWithdrawals: wthCount?.count || 0,
      totalUsers: userCount?.count || 0,
      totalDeposits: serializeMoney(BigInt(totalDep?.sum || "0")),
      totalWithdrawals: serializeMoney(BigInt(totalWth?.sum || "0")),
    })
  );
});

// 2. Submissions review queue
adminRouter.get("/submissions", async (c) => {
  const list = await db
    .select({
      id: taskSubmissions.id,
      taskId: taskSubmissions.taskId,
      taskTitle: tasks.title,
      userId: taskSubmissions.userId,
      userName: profiles.displayName,
      rewardMinor: taskSubmissions.rewardMinor,
      screenshotUrl: taskSubmissions.screenshotUrl,
      userNote: taskSubmissions.userNote,
      status: taskSubmissions.status,
      submittedAt: taskSubmissions.submittedAt,
    })
    .from(taskSubmissions)
    .innerJoin(tasks, eq(taskSubmissions.taskId, tasks.id))
    .innerJoin(profiles, eq(taskSubmissions.userId, profiles.id))
    .where(eq(taskSubmissions.status, "PENDING"))
    .orderBy(sql`${taskSubmissions.submittedAt} ASC`);

  const formatted = list.map((item) => ({
    ...item,
    reward: serializeMoney(item.rewardMinor),
  }));

  return c.json(apiSuccess(formatted));
});

adminRouter.post("/submissions/:id/approve", async (c) => {
  const id = c.req.param("id");

  const [sub] = await db
    .select()
    .from(taskSubmissions)
    .where(eq(taskSubmissions.id, id))
    .limit(1);

  if (!sub) {
    throw new NotFoundError("টাস্ক সাবমিশন রেকর্ড পাওয়া যায়নি");
  }

  if (sub.status !== "PENDING") {
    throw new BadRequestError("এই সাবমিশনটি ইতোমধ্যে পর্যালোচনা করা হয়েছে");
  }

  // Credit user wallet
  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, sub.userId))
    .limit(1);

  if (wallet) {
    const newBalance = wallet.balanceMinor + sub.rewardMinor;
    const newEarned = wallet.totalEarnedMinor + sub.rewardMinor;

    await db
      .update(wallets)
      .set({
        balanceMinor: newBalance,
        totalEarnedMinor: newEarned,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id));

    await db.insert(walletTransactions).values({
      walletId: wallet.id,
      userId: sub.userId,
      type: "TASK_REWARD",
      direction: "CREDIT",
      amountMinor: sub.rewardMinor,
      balanceAfterMinor: newBalance,
      description: "টাস্ক সম্পন্ন করার রিওয়ার্ড",
      referenceId: sub.id,
    });
  }

  await db
    .update(taskSubmissions)
    .set({
      status: "APPROVED",
      reviewedAt: new Date(),
    })
    .where(eq(taskSubmissions.id, id));

  return c.json(
    apiSuccess({
      submissionId: id,
      status: "APPROVED",
      message: "টাস্ক প্রুফ অনুমোদিত হয়েছে এবং ইউজারের ব্যালেন্সে রিওয়ার্ড ক্রেডিট করা হয়েছে।",
    })
  );
});

const rejectSchema = z.object({
  reason: z.string().min(1, "বাতিলের কারণ উল্লেখ করুন"),
});

adminRouter.post("/submissions/:id/reject", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const validation = rejectSchema.safeParse(body);
  const reason = validation.success ? validation.data.reason : "প্রুফ অসম্পূর্ণ বা ভুল";

  await db
    .update(taskSubmissions)
    .set({
      status: "REJECTED",
      rejectionReason: reason,
      reviewedAt: new Date(),
    })
    .where(eq(taskSubmissions.id, id));

  return c.json(
    apiSuccess({
      submissionId: id,
      status: "REJECTED",
      reason,
      message: "টাস্ক প্রুফ বাতিল করা হয়েছে।",
    })
  );
});

// 3. Deposits review queue
adminRouter.get("/deposits", async (c) => {
  const list = await db
    .select({
      id: deposits.id,
      userId: deposits.userId,
      userName: profiles.displayName,
      phone: profiles.phone,
      amountMinor: deposits.amountMinor,
      paymentMethod: deposits.paymentMethod,
      senderNumber: deposits.senderNumber,
      transactionId: deposits.transactionId,
      screenshotUrl: deposits.screenshotUrl,
      status: deposits.status,
      createdAt: deposits.createdAt,
    })
    .from(deposits)
    .innerJoin(profiles, eq(deposits.userId, profiles.id))
    .where(eq(deposits.status, "PENDING"))
    .orderBy(sql`${deposits.createdAt} ASC`);

  const formatted = list.map((d) => ({
    ...d,
    amount: serializeMoney(d.amountMinor),
  }));

  return c.json(apiSuccess(formatted));
});

adminRouter.post("/deposits/:id/approve", async (c) => {
  const id = c.req.param("id");

  const [dep] = await db
    .select()
    .from(deposits)
    .where(eq(deposits.id, id))
    .limit(1);

  if (!dep) {
    throw new NotFoundError("ডিপোজিট রেকর্ড পাওয়া যায়নি");
  }

  if (dep.status !== "PENDING") {
    throw new BadRequestError("এই ডিপোজিট অনুরোধটি ইতোমধ্যে প্রক্রিয়াজাত করা হয়েছে");
  }

  // Credit wallet
  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, dep.userId))
    .limit(1);

  if (wallet) {
    const newBalance = wallet.balanceMinor + dep.amountMinor;

    await db
      .update(wallets)
      .set({
        balanceMinor: newBalance,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id));

    await db.insert(walletTransactions).values({
      walletId: wallet.id,
      userId: dep.userId,
      type: "DEPOSIT",
      direction: "CREDIT",
      amountMinor: dep.amountMinor,
      balanceAfterMinor: newBalance,
      description: `${dep.paymentMethod} ডিপোজিট অনুমোদন (TrxID: ${dep.transactionId})`,
      referenceId: dep.id,
    });
  }

  await db
    .update(deposits)
    .set({
      status: "APPROVED",
      reviewedAt: new Date(),
    })
    .where(eq(deposits.id, id));

  return c.json(
    apiSuccess({
      depositId: id,
      status: "APPROVED",
      message: "ডিপোজিট সফলভাবে অনুমোদিত হয়েছে এবং ইউজারের ব্যালেন্সে যুক্ত হয়েছে।",
    })
  );
});

adminRouter.post("/deposits/:id/reject", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const reason = (body as any)?.reason || "পেমেন্ট পাওয়া যায়নি বা ভুয়া ট্রানজেকশন আইডি";

  await db
    .update(deposits)
    .set({
      status: "REJECTED",
      adminNote: reason,
      reviewedAt: new Date(),
    })
    .where(eq(deposits.id, id));

  return c.json(
    apiSuccess({
      depositId: id,
      status: "REJECTED",
      reason,
      message: "ডিপোজিট অনুরোধ বাতিল করা হয়েছে।",
    })
  );
});

// 4. Withdrawals queue
adminRouter.get("/withdrawals", async (c) => {
  const list = await db
    .select({
      id: withdrawals.id,
      userId: withdrawals.userId,
      userName: profiles.displayName,
      phone: profiles.phone,
      amountMinor: withdrawals.amountMinor,
      paymentMethod: withdrawals.paymentMethod,
      accountNumber: withdrawals.accountNumber,
      maskedAccount: withdrawals.maskedAccount,
      status: withdrawals.status,
      createdAt: withdrawals.createdAt,
    })
    .from(withdrawals)
    .innerJoin(profiles, eq(withdrawals.userId, profiles.id))
    .where(eq(withdrawals.status, "PENDING"))
    .orderBy(sql`${withdrawals.createdAt} ASC`);

  const formatted = list.map((w) => ({
    ...w,
    amount: serializeMoney(w.amountMinor),
  }));

  return c.json(apiSuccess(formatted));
});

adminRouter.post("/withdrawals/:id/approve", async (c) => {
  const id = c.req.param("id");

  const [wth] = await db
    .select()
    .from(withdrawals)
    .where(eq(withdrawals.id, id))
    .limit(1);

  if (!wth) {
    throw new NotFoundError("উইথড্রয়াল রেকর্ড পাওয়া যায়নি");
  }

  if (wth.status !== "PENDING") {
    throw new BadRequestError("এই উইথড্রয়াল অনুরোধটি ইতোমধ্যে প্রসেস করা হয়েছে");
  }

  // Deduct from pendingBalance, add to totalWithdrawn
  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, wth.userId))
    .limit(1);

  if (wallet) {
    const newPending = wallet.pendingBalanceMinor >= wth.amountMinor
      ? wallet.pendingBalanceMinor - wth.amountMinor
      : 0n;
    const newWithdrawn = wallet.totalWithdrawnMinor + wth.amountMinor;

    await db
      .update(wallets)
      .set({
        pendingBalanceMinor: newPending,
        totalWithdrawnMinor: newWithdrawn,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id));
  }

  await db
    .update(withdrawals)
    .set({
      status: "APPROVED",
      reviewedAt: new Date(),
    })
    .where(eq(withdrawals.id, id));

  return c.json(
    apiSuccess({
      withdrawalId: id,
      status: "APPROVED",
      message: "উইথড্রয়াল পেমেন্ট সফলভাবে পাঠানো ও অনুমোদিত হয়েছে।",
    })
  );
});

adminRouter.post("/withdrawals/:id/reject", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const reason = (body as any)?.reason || "অ্যাকাউন্ট তথ্যে ভুল";

  const [wth] = await db
    .select()
    .from(withdrawals)
    .where(eq(withdrawals.id, id))
    .limit(1);

  if (wth && wth.status === "PENDING") {
    // Refund from pendingBalanceMinor back to balanceMinor
    const [wallet] = await db
      .select()
      .from(wallets)
      .where(eq(wallets.userId, wth.userId))
      .limit(1);

    if (wallet) {
      const newBalance = wallet.balanceMinor + wth.amountMinor;
      const newPending = wallet.pendingBalanceMinor >= wth.amountMinor
        ? wallet.pendingBalanceMinor - wth.amountMinor
        : 0n;

      await db
        .update(wallets)
        .set({
          balanceMinor: newBalance,
          pendingBalanceMinor: newPending,
          updatedAt: new Date(),
        })
        .where(eq(wallets.id, wallet.id));

      await db.insert(walletTransactions).values({
        walletId: wallet.id,
        userId: wth.userId,
        type: "WITHDRAWAL_REVERSAL",
        direction: "CREDIT",
        amountMinor: wth.amountMinor,
        balanceAfterMinor: newBalance,
        description: `উইথড্রয়াল বাতিল রিফান্ড: ${reason}`,
        referenceId: wth.id,
      });
    }

    await db
      .update(withdrawals)
      .set({
        status: "REJECTED",
        adminNote: reason,
        reviewedAt: new Date(),
      })
      .where(eq(withdrawals.id, id));
  }

  return c.json(
    apiSuccess({
      withdrawalId: id,
      status: "REJECTED",
      reason,
      refunded: true,
      message: "উইথড্রয়াল বাতিল করা হয়েছে এবং কর্তনকৃত টাকা ইউজারের ব্যালেন্সে ফেরত পাঠানো হয়েছে।",
    })
  );
});

// 5. Package Purchases Queue
adminRouter.get("/packages/purchases", async (c) => {
  const list = await db
    .select({
      id: packagePurchases.id,
      userId: packagePurchases.userId,
      userName: profiles.displayName,
      phone: profiles.phone,
      packageId: packagePurchases.packageId,
      packageName: packages.name,
      validityDays: packages.validityDays,
      amountMinor: packagePurchases.amountMinor,
      paymentMethod: packagePurchases.paymentMethod,
      senderNumber: packagePurchases.senderNumber,
      transactionId: packagePurchases.transactionId,
      status: packagePurchases.status,
      createdAt: packagePurchases.createdAt,
    })
    .from(packagePurchases)
    .innerJoin(packages, eq(packagePurchases.packageId, packages.id))
    .innerJoin(profiles, eq(packagePurchases.userId, profiles.id))
    .where(eq(packagePurchases.status, "PENDING"))
    .orderBy(sql`${packagePurchases.createdAt} ASC`);

  const formatted = list.map((item) => ({
    ...item,
    amount: serializeMoney(item.amountMinor),
  }));

  return c.json(apiSuccess(formatted));
});

adminRouter.post("/packages/purchases/:id/approve", async (c) => {
  const id = c.req.param("id");

  const [purchase] = await db
    .select()
    .from(packagePurchases)
    .where(eq(packagePurchases.id, id))
    .limit(1);

  if (!purchase) {
    throw new NotFoundError("প্যাকেজ ক্রয়ের রেকর্ড পাওয়া যায়নি");
  }

  const [pkg] = await db
    .select()
    .from(packages)
    .where(eq(packages.id, purchase.packageId))
    .limit(1);

  if (!pkg) {
    throw new NotFoundError("প্যাকেজ পাওয়া যায়নি");
  }

  // Activate package for user
  const now = new Date();
  const expiresAt = new Date(now);
  expiresAt.setDate(expiresAt.getDate() + pkg.validityDays);

  await db.insert(userPackages).values({
    userId: purchase.userId,
    packageId: pkg.id,
    status: "ACTIVE",
    startsAt: now,
    expiresAt,
  });

  await db
    .update(packagePurchases)
    .set({
      status: "APPROVED",
      processedAt: now,
    })
    .where(eq(packagePurchases.id, id));

  return c.json(
    apiSuccess({
      purchaseId: id,
      status: "APPROVED",
      message: `'${pkg.name}' প্যাকেজ সফলভাবে অ্যাক্টিভ করা হয়েছে। মেয়াদ ${pkg.validityDays} দিন।`,
    })
  );
});

adminRouter.post("/packages/purchases/:id/reject", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const reason = (body as any)?.reason || "পেমেন্ট তথ্য যাচাই করা যায়নি বা ভুয়া ট্রানজেকশন আইডি";

  await db
    .update(packagePurchases)
    .set({
      status: "REJECTED",
      adminNote: reason,
      processedAt: new Date(),
    })
    .where(eq(packagePurchases.id, id));

  return c.json(
    apiSuccess({
      purchaseId: id,
      status: "REJECTED",
      reason,
      message: "প্যাকেজ ক্রয়ের আবেদনটি বাতিল করা হয়েছে।",
    })
  );
});

// 6. Users management
adminRouter.get("/users", async (c) => {
  const list = await db
    .select({
      id: profiles.id,
      displayName: profiles.displayName,
      email: profiles.email,
      phone: profiles.phone,
      role: profiles.role,
      status: profiles.status,
      referralCode: profiles.referralCode,
      avatarUrl: profiles.avatarUrl,
      createdAt: profiles.createdAt,
      balanceMinor: wallets.balanceMinor,
      totalEarnedMinor: wallets.totalEarnedMinor,
      totalWithdrawnMinor: wallets.totalWithdrawnMinor,
    })
    .from(profiles)
    .leftJoin(wallets, eq(profiles.id, wallets.userId))
    .orderBy(sql`${profiles.createdAt} DESC`)
    .limit(200);

  const formatted = list.map((u) => ({
    id: u.id,
    name: u.displayName,
    displayName: u.displayName,
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
    referralCode: u.referralCode,
    avatar: u.avatarUrl || "",
    balance: serializeMoney(u.balanceMinor || 0n).amount,
    totalEarned: serializeMoney(u.totalEarnedMinor || 0n).amount,
    totalWithdrawn: serializeMoney(u.totalWithdrawnMinor || 0n).amount,
    createdAt: u.createdAt,
  }));

  return c.json(apiSuccess(formatted));
});

// Manual balance credit or debit
adminRouter.post("/users/:id/adjust-balance", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const amount = Number(body.amount);
  const direction = (body.direction || "CREDIT").toUpperCase() as "CREDIT" | "DEBIT";
  const reason = body.reason || (direction === "CREDIT" ? "অ্যাডমিন বিশেষ বোনাস" : "পেনাল্টি কর্তন");

  if (!amount || isNaN(amount) || amount <= 0) {
    throw new BadRequestError("সঠিক টাকার পরিমাণ দিন");
  }

  const [userProfile] = await db.select().from(profiles).where(eq(profiles.id, id)).limit(1);
  if (!userProfile) {
    throw new NotFoundError("ইউজার পাওয়া যায়নি");
  }

  const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, id)).limit(1);
  if (!wallet) {
    throw new NotFoundError("ইউজারের ওয়ালেট পাওয়া যায়নি");
  }

  const amountMinor = toMinorUnits(amount);
  let newBalance: bigint;

  if (direction === "CREDIT") {
    newBalance = wallet.balanceMinor + amountMinor;
    const newEarned = wallet.totalEarnedMinor + amountMinor;
    await db
      .update(wallets)
      .set({
        balanceMinor: newBalance,
        totalEarnedMinor: newEarned,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id));
  } else {
    if (wallet.balanceMinor < amountMinor) {
      throw new BadRequestError(`ব্যবহারকারীর পর্যাপ্ত ব্যালেন্স নেই। বর্তমান ব্যালেন্স: ৳${serializeMoney(wallet.balanceMinor).amount}`);
    }
    newBalance = wallet.balanceMinor - amountMinor;
    await db
      .update(wallets)
      .set({
        balanceMinor: newBalance,
        updatedAt: new Date(),
      })
      .where(eq(wallets.id, wallet.id));
  }

  await db.insert(walletTransactions).values({
    walletId: wallet.id,
    userId: id,
    type: "ADMIN_ADJUSTMENT",
    direction,
    amountMinor,
    balanceAfterMinor: newBalance,
    description: `${reason} (অ্যাডমিন সমন্বয়)`,
  });

  return c.json(
    apiSuccess({
      userId: id,
      newBalance: serializeMoney(newBalance).amount,
      message: `ইউজারের ব্যালেন্সে ৳${amount} ${direction === "CREDIT" ? "যোগ" : "কর্তন"} করা হয়েছে। বর্তমান ব্যালেন্স: ৳${serializeMoney(newBalance).amount}`,
    })
  );
});

// Update user status (ACTIVE / SUSPENDED / BLOCKED)
adminRouter.post("/users/:id/status", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const status = body.status as "ACTIVE" | "SUSPENDED" | "BLOCKED";

  if (!["ACTIVE", "SUSPENDED", "BLOCKED"].includes(status)) {
    throw new BadRequestError("অবৈধ স্ট্যাটাস");
  }

  await db.update(profiles).set({ status, updatedAt: new Date() }).where(eq(profiles.id, id));

  return c.json(
    apiSuccess({
      userId: id,
      status,
      message: `ইউজার স্ট্যাটাস পরিবর্তন করে '${status}' করা হয়েছে।`,
    })
  );
});

// Update user role
adminRouter.post("/users/:id/role", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const role = body.role as "USER" | "ADMIN" | "SUPER_ADMIN";

  if (!["USER", "ADMIN", "SUPER_ADMIN"].includes(role)) {
    throw new BadRequestError("অবৈধ রোল");
  }

  await db.update(profiles).set({ role, updatedAt: new Date() }).where(eq(profiles.id, id));

  return c.json(
    apiSuccess({
      userId: id,
      role,
      message: `ইউজার রোল পরিবর্তন করে '${role}' করা হয়েছে।`,
    })
  );
});

// 7. Packages Management
adminRouter.get("/packages", async (c) => {
  const list = await db.select().from(packages).orderBy(sql`${packages.priceMinor} ASC`);
  const formatted = list.map((pkg) => ({
    id: pkg.id,
    name: pkg.name,
    price: serializeMoney(pkg.priceMinor).amount,
    validityDays: pkg.validityDays,
    dailyTaskLimit: pkg.dailyTaskLimit,
    dailyRewardLimit: serializeMoney(pkg.dailyRewardLimitMinor).amount,
    referralBonus: pkg.referralBonusPercent,
    color: pkg.colorGradient || "from-slate-600 to-slate-800",
    isPopular: pkg.isPopular,
    features: pkg.features || [],
    status: pkg.status,
  }));
  return c.json(apiSuccess(formatted));
});

adminRouter.post("/packages", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const name = body.name;
  const price = Number(body.price || 0);
  const validityDays = Number(body.validityDays || 30);
  const dailyTaskLimit = Number(body.dailyTaskLimit || 10);
  const dailyRewardLimit = Number(body.dailyRewardLimit || 100);
  const referralBonusPercent = Number(body.referralBonus || 10);
  const colorGradient = body.color || "from-slate-600 to-slate-800";
  const isPopular = Boolean(body.isPopular);
  const features = Array.isArray(body.features) ? body.features : [];

  if (!name || price <= 0) {
    throw new BadRequestError("প্যাকেজের নাম ও সঠিক মূল্য আবশ্যক");
  }

  const [newPkg] = await db
    .insert(packages)
    .values({
      name,
      priceMinor: toMinorUnits(price),
      validityDays,
      dailyTaskLimit,
      dailyRewardLimitMinor: toMinorUnits(dailyRewardLimit),
      referralBonusPercent,
      colorGradient,
      isPopular,
      features,
      status: "ACTIVE",
    })
    .returning();

  return c.json(
    apiSuccess({
      ...newPkg,
      price,
      dailyRewardLimit,
      message: "নতুন প্যাকেজ সফলভাবে যুক্ত করা হয়েছে।",
    })
  );
});

adminRouter.put("/packages/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const name = body.name;
  const price = Number(body.price || 0);
  const validityDays = Number(body.validityDays || 30);
  const dailyTaskLimit = Number(body.dailyTaskLimit || 10);
  const dailyRewardLimit = Number(body.dailyRewardLimit || 100);
  const referralBonusPercent = Number(body.referralBonus || 10);
  const colorGradient = body.color || "from-slate-600 to-slate-800";
  const isPopular = Boolean(body.isPopular);
  const features = Array.isArray(body.features) ? body.features : [];

  await db
    .update(packages)
    .set({
      name,
      priceMinor: toMinorUnits(price),
      validityDays,
      dailyTaskLimit,
      dailyRewardLimitMinor: toMinorUnits(dailyRewardLimit),
      referralBonusPercent,
      colorGradient,
      isPopular,
      features,
      updatedAt: new Date(),
    })
    .where(eq(packages.id, id));

  return c.json(apiSuccess({ message: "প্যাকেজ সফলভাবে আপডেট করা হয়েছে।" }));
});

adminRouter.delete("/packages/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(packages).where(eq(packages.id, id));
  return c.json(apiSuccess({ message: "প্যাকেজটি মুছে ফেলা হয়েছে।" }));
});

// 8. Tasks Management
adminRouter.get("/tasks", async (c) => {
  const list = await db.select().from(tasks).orderBy(sql`${tasks.createdAt} DESC`);
  const formatted = list.map((t) => ({
    id: t.id,
    title: t.title,
    platform: (t.platform || "other").toLowerCase(),
    reward: serializeMoney(t.rewardMinor).amount,
    action: t.action,
    description: t.description,
    instructions: t.instructions || [],
    targetUrl: t.targetUrl,
    requiredPackage: t.requiredPackage,
    requiresScreenshot: t.requiresScreenshot,
    dailyLimit: t.dailyLimit,
    status: t.status,
  }));
  return c.json(apiSuccess(formatted));
});

adminRouter.post("/tasks", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const title = body.title;
  const platform = (body.platform || "OTHER").toUpperCase();
  const reward = Number(body.reward || 10);
  const action = body.action || "কাজ সম্পন্ন করুন";
  const description = body.description || "";
  const instructions = Array.isArray(body.instructions) ? body.instructions : [];
  const targetUrl = body.targetUrl || "https://google.com";
  const requiredPackage = body.requiredPackage || "ফ্রি / যেকোনো";
  const requiresScreenshot = body.requiresScreenshot !== false;

  if (!title || reward <= 0) {
    throw new BadRequestError("টাস্কের শিরোনাম ও সঠিক রিওয়ার্ড আবশ্যক");
  }

  const validPlatforms = ["FACEBOOK", "YOUTUBE", "TIKTOK", "WEBSITE", "CONTENT", "VIDEO", "CAPTCHA", "OTHER"];
  const safePlatform = validPlatforms.includes(platform) ? platform : "OTHER";

  const [newTask] = await db
    .insert(tasks)
    .values({
      title,
      platform: safePlatform as any,
      rewardMinor: toMinorUnits(reward),
      action,
      description,
      instructions,
      targetUrl,
      requiredPackage,
      requiresScreenshot,
      status: "ACTIVE",
    })
    .returning();

  return c.json(
    apiSuccess({
      ...newTask,
      reward,
      message: "নতুন টাস্ক সফলভাবে তৈরি করা হয়েছে।",
    })
  );
});

adminRouter.put("/tasks/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const title = body.title;
  const platform = (body.platform || "OTHER").toUpperCase();
  const reward = Number(body.reward || 10);
  const action = body.action || "কাজ সম্পন্ন করুন";
  const description = body.description || "";
  const instructions = Array.isArray(body.instructions) ? body.instructions : [];
  const targetUrl = body.targetUrl || "https://google.com";
  const requiredPackage = body.requiredPackage || "ফ্রি / যেকোনো";
  const requiresScreenshot = body.requiresScreenshot !== false;

  const validPlatforms = ["FACEBOOK", "YOUTUBE", "TIKTOK", "WEBSITE", "CONTENT", "VIDEO", "CAPTCHA", "OTHER"];
  const safePlatform = validPlatforms.includes(platform) ? platform : "OTHER";

  await db
    .update(tasks)
    .set({
      title,
      platform: safePlatform as any,
      rewardMinor: toMinorUnits(reward),
      action,
      description,
      instructions,
      targetUrl,
      requiredPackage,
      requiresScreenshot,
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, id));

  return c.json(apiSuccess({ message: "টাস্ক সফলভাবে আপডেট করা হয়েছে।" }));
});

adminRouter.delete("/tasks/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(tasks).where(eq(tasks.id, id));
  return c.json(apiSuccess({ message: "টাস্কটি মুছে ফেলা হয়েছে।" }));
});

// 9. System Settings & Payment Numbers
adminRouter.get("/settings", async (c) => {
  const [settingRow] = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.key, "platform_settings"))
    .limit(1);

  const pmRows = await db.select().from(paymentMethods);
  const bkash = pmRows.find((p) => p.name.toLowerCase() === "bkash");
  const nagad = pmRows.find((p) => p.name.toLowerCase() === "nagad");
  const rocket = pmRows.find((p) => p.name.toLowerCase() === "rocket");

  const val = (settingRow?.value as any) || {};

  return c.json(
    apiSuccess({
      minWithdrawal: val.minWithdrawal ?? 100,
      maxWithdrawal: val.maxWithdrawal ?? 25000,
      referralBonus: val.referralBonus ?? 25,
      announcement: val.announcement || "স্বাগতম দিগন্ত ডিজিটাল আর্নিং প্ল্যাটফর্মে! নিয়ম মেনে কাজ করুন এবং প্রতিদিন পেমেন্ট নিন।",
      isDepositEnabled: val.isDepositEnabled ?? true,
      isWithdrawalEnabled: val.isWithdrawalEnabled ?? true,
      bkashNumber: bkash?.accountNumber || "01755123456",
      nagadNumber: nagad?.accountNumber || "01855123456",
      rocketNumber: rocket?.accountNumber || "019551234567",
    })
  );
});

adminRouter.put("/settings", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const {
    minWithdrawal = 100,
    maxWithdrawal = 25000,
    referralBonus = 25,
    announcement = "",
    isDepositEnabled = true,
    isWithdrawalEnabled = true,
    bkashNumber,
    nagadNumber,
    rocketNumber,
  } = body;

  const [existing] = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.key, "platform_settings"))
    .limit(1);

  const newValues = {
    minWithdrawal: Number(minWithdrawal),
    maxWithdrawal: Number(maxWithdrawal),
    referralBonus: Number(referralBonus),
    announcement: String(announcement),
    isDepositEnabled: Boolean(isDepositEnabled),
    isWithdrawalEnabled: Boolean(isWithdrawalEnabled),
  };

  if (existing) {
    await db
      .update(systemSettings)
      .set({ value: newValues, updatedAt: new Date() })
      .where(eq(systemSettings.id, existing.id));
  } else {
    await db.insert(systemSettings).values({
      key: "platform_settings",
      value: newValues,
      description: "Primary platform financial, security and announcement settings",
    });
  }

  // Update paymentMethods
  if (bkashNumber) {
    await db
      .update(paymentMethods)
      .set({ accountNumber: bkashNumber })
      .where(sql`lower(${paymentMethods.name}) = 'bkash'`);
  }
  if (nagadNumber) {
    await db
      .update(paymentMethods)
      .set({ accountNumber: nagadNumber })
      .where(sql`lower(${paymentMethods.name}) = 'nagad'`);
  }
  if (rocketNumber) {
    await db
      .update(paymentMethods)
      .set({ accountNumber: rocketNumber })
      .where(sql`lower(${paymentMethods.name}) = 'rocket'`);
  }

  return c.json(
    apiSuccess({
      message: "সিস্টেম সেটিংস ও পেমেন্ট নম্বর সফলভাবে হালনাগাদ করা হয়েছে।",
    })
  );
});

// 10. Dashboard Features & Quick Action Grid Control
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

adminRouter.get("/features", async (c) => {
  const [setting] = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.key, "dashboard_features"))
    .limit(1);

  const features = (setting?.value as any) || DEFAULT_FEATURES_LIST;
  return c.json(apiSuccess(features));
});

adminRouter.put("/features", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const features = Array.isArray(body.features) ? body.features : DEFAULT_FEATURES_LIST;

  const [existing] = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.key, "dashboard_features"))
    .limit(1);

  if (existing) {
    await db
      .update(systemSettings)
      .set({ value: features, updatedAt: new Date() })
      .where(eq(systemSettings.id, existing.id));
  } else {
    await db.insert(systemSettings).values({
      key: "dashboard_features",
      value: features,
      description: "Quick Action Grid 15 items dynamic status and badges",
    });
  }

  return c.json(apiSuccess({ message: "কুইক অ্যাকশন গ্রিডের ফিচার সফলভাবে হালনাগাদ করা হয়েছে।" }));
});

// 11. Gift Codes Management
adminRouter.get("/gift-codes", async (c) => {
  const list = await db.select().from(giftCodes).orderBy(sql`${giftCodes.createdAt} DESC`);
  const formatted = list.map((g) => ({
    id: g.id,
    code: g.code,
    reward: serializeMoney(g.rewardMinor).amount,
    maxUses: g.maxUses,
    usedCount: g.usedCount,
    isActive: g.isActive,
    expiresAt: g.expiresAt,
    createdAt: g.createdAt,
  }));
  return c.json(apiSuccess(formatted));
});

adminRouter.post("/gift-codes", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const code = String(body.code || "").trim().toUpperCase();
  const reward = Number(body.reward || 0);
  const maxUses = Number(body.maxUses || 500);
  const expiresAt = body.expiresAt ? new Date(body.expiresAt) : null;

  if (!code || reward <= 0) {
    throw new BadRequestError("সঠিক কোড ও রিওয়ার্ড টাকার পরিমাণ দিন");
  }

  const [existing] = await db.select().from(giftCodes).where(eq(giftCodes.code, code)).limit(1);
  if (existing) {
    throw new BadRequestError("এই কোডটি ইতোমধ্যে তৈরি করা রয়েছে");
  }

  const [created] = await db
    .insert(giftCodes)
    .values({
      code,
      rewardMinor: toMinorUnits(reward),
      maxUses,
      expiresAt,
      isActive: true,
    })
    .returning();

  return c.json(
    apiSuccess({
      ...created,
      reward,
      message: `নতুন গিফট কোড '${code}' (৳${reward}) সফলভাবে তৈরি করা হয়েছে।`,
    })
  );
});

adminRouter.post("/gift-codes/:id/toggle", async (c) => {
  const id = c.req.param("id");
  const [existing] = await db.select().from(giftCodes).where(eq(giftCodes.id, id)).limit(1);
  if (!existing) throw new NotFoundError("গিফট কোড পাওয়া যায়নি");

  const newActive = !existing.isActive;
  await db.update(giftCodes).set({ isActive: newActive }).where(eq(giftCodes.id, id));

  return c.json(
    apiSuccess({
      id,
      isActive: newActive,
      message: `গিফট কোড ${newActive ? "সক্রিয়" : "নিষ্ক্রিয়"} করা হয়েছে।`,
    })
  );
});

adminRouter.delete("/gift-codes/:id", async (c) => {
  const id = c.req.param("id");
  await db.delete(giftCodes).where(eq(giftCodes.id, id));
  return c.json(apiSuccess({ message: "গিফট কোডটি মুছে ফেলা হয়েছে।" }));
});

adminRouter.get("/gift-codes/:id/redemptions", async (c) => {
  const id = c.req.param("id");
  const list = await db
    .select({
      id: giftCodeRedemptions.id,
      userId: giftCodeRedemptions.userId,
      userName: profiles.displayName,
      phone: profiles.phone,
      amountMinor: giftCodeRedemptions.redeemedAmountMinor,
      redeemedAt: giftCodeRedemptions.redeemedAt,
    })
    .from(giftCodeRedemptions)
    .innerJoin(profiles, eq(giftCodeRedemptions.userId, profiles.id))
    .where(eq(giftCodeRedemptions.giftCodeId, id))
    .orderBy(sql`${giftCodeRedemptions.redeemedAt} DESC`);

  const formatted = list.map((item) => ({
    ...item,
    amount: serializeMoney(item.amountMinor).amount,
  }));
  return c.json(apiSuccess(formatted));
});

// 12. Monthly Salary & Physical Incentive Claims Queue
adminRouter.get("/salary-claims", async (c) => {
  const list = await db
    .select({
      id: monthlySalaryClaims.id,
      userId: monthlySalaryClaims.userId,
      userName: profiles.displayName,
      phone: profiles.phone,
      targetTier: monthlySalaryClaims.targetTier,
      salaryAmountMinor: monthlySalaryClaims.salaryAmountMinor,
      eligibleMembersCount: monthlySalaryClaims.eligibleMembersCount,
      monthYear: monthlySalaryClaims.monthYear,
      status: monthlySalaryClaims.status,
      adminNote: monthlySalaryClaims.adminNote,
      claimedAt: monthlySalaryClaims.claimedAt,
      approvedAt: monthlySalaryClaims.approvedAt,
    })
    .from(monthlySalaryClaims)
    .innerJoin(profiles, eq(monthlySalaryClaims.userId, profiles.id))
    .orderBy(sql`${monthlySalaryClaims.claimedAt} DESC`);

  const formatted = list.map((item) => ({
    ...item,
    amount: serializeMoney(item.salaryAmountMinor).amount,
  }));
  return c.json(apiSuccess(formatted));
});

adminRouter.post("/salary-claims/:id/approve", async (c) => {
  const id = c.req.param("id");
  const [claim] = await db.select().from(monthlySalaryClaims).where(eq(monthlySalaryClaims.id, id)).limit(1);
  if (!claim) throw new NotFoundError("আবেদন রেকর্ড পাওয়া যায়নি");
  if (claim.status !== "PENDING") throw new BadRequestError("এই আবেদন ইতোমধ্যে নিষ্পত্তি করা হয়েছে");

  // Credit wallet
  const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, claim.userId)).limit(1);
  if (wallet) {
    const newBalance = wallet.balanceMinor + claim.salaryAmountMinor;
    const newEarned = wallet.totalEarnedMinor + claim.salaryAmountMinor;

    await db
      .update(wallets)
      .set({ balanceMinor: newBalance, totalEarnedMinor: newEarned, updatedAt: new Date() })
      .where(eq(wallets.id, wallet.id));

    await db.insert(walletTransactions).values({
      walletId: wallet.id,
      userId: claim.userId,
      type: "MONTHLY_SALARY",
      direction: "CREDIT",
      amountMinor: claim.salaryAmountMinor,
      balanceAfterMinor: newBalance,
      description: `মাসিক স্যালারি অনুমোদন (${claim.monthYear} - Tier ${claim.targetTier})`,
      referenceId: claim.id,
    });
  }

  await db
    .update(monthlySalaryClaims)
    .set({ status: "APPROVED", approvedAt: new Date() })
    .where(eq(monthlySalaryClaims.id, id));

  return c.json(apiSuccess({ message: "মাসিক স্যালারি সফলভাবে অনুমোদিত ও ওয়ালেটে ক্রেডিট হয়েছে।" }));
});

adminRouter.post("/salary-claims/:id/reject", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const reason = (body as any)?.reason || "শর্ত অপূর্ণ বা সদস্য সংখ্যা পর্যাপ্ত নয়";

  await db
    .update(monthlySalaryClaims)
    .set({ status: "REJECTED", adminNote: reason })
    .where(eq(monthlySalaryClaims.id, id));

  return c.json(apiSuccess({ message: "মাসিক স্যালারি আবেদন বাতিল করা হয়েছে।" }));
});

// Incentive Claims
adminRouter.get("/incentive-claims", async (c) => {
  const list = await db
    .select({
      id: incentiveClaims.id,
      userId: incentiveClaims.userId,
      userName: profiles.displayName,
      phone: profiles.phone,
      rewardTitle: incentiveClaims.rewardTitle,
      gen1Count: incentiveClaims.gen1Count,
      gen2Count: incentiveClaims.gen2Count,
      gen3Count: incentiveClaims.gen3Count,
      recipientName: incentiveClaims.recipientName,
      deliveryPhone: incentiveClaims.deliveryPhone,
      deliveryAddress: incentiveClaims.deliveryAddress,
      status: incentiveClaims.status,
      trackingNumber: incentiveClaims.trackingNumber,
      adminNote: incentiveClaims.adminNote,
      claimedAt: incentiveClaims.claimedAt,
      updatedAt: incentiveClaims.updatedAt,
    })
    .from(incentiveClaims)
    .innerJoin(profiles, eq(incentiveClaims.userId, profiles.id))
    .orderBy(sql`${incentiveClaims.claimedAt} DESC`);

  return c.json(apiSuccess(list));
});

adminRouter.post("/incentive-claims/:id/approve", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const trackingNumber = (body as any)?.trackingNumber || "";
  const status = (body as any)?.status || (trackingNumber ? "DISPATCHED" : "APPROVED");

  await db
    .update(incentiveClaims)
    .set({ status, trackingNumber, updatedAt: new Date() })
    .where(eq(incentiveClaims.id, id));

  return c.json(apiSuccess({ message: `ইনসেন্টিভ পুরস্কার '${status}' হিসেবে আপডেট করা হয়েছে।` }));
});

adminRouter.post("/incentive-claims/:id/reject", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const reason = (body as any)?.reason || "রেফারেল রিকোয়ারমেন্ট যাচাইয়ে অসঙ্গতি";

  await db
    .update(incentiveClaims)
    .set({ status: "REJECTED", adminNote: reason, updatedAt: new Date() })
    .where(eq(incentiveClaims.id, id));

  return c.json(apiSuccess({ message: "ইনসেন্টিভ আবেদন বাতিল করা হয়েছে।" }));
});

// 13. Content Submissions Review (Articles & Videos)
adminRouter.get("/content-submissions", async (c) => {
  const list = await db
    .select({
      id: contentSubmissions.id,
      userId: contentSubmissions.userId,
      userName: profiles.displayName,
      phone: profiles.phone,
      type: contentSubmissions.type,
      title: contentSubmissions.title,
      contentBody: contentSubmissions.contentBody,
      mediaUrl: contentSubmissions.mediaUrl,
      wordCount: contentSubmissions.wordCount,
      rewardMinor: contentSubmissions.rewardMinor,
      status: contentSubmissions.status,
      adminFeedback: contentSubmissions.adminFeedback,
      submittedAt: contentSubmissions.submittedAt,
      reviewedAt: contentSubmissions.reviewedAt,
    })
    .from(contentSubmissions)
    .innerJoin(profiles, eq(contentSubmissions.userId, profiles.id))
    .orderBy(sql`${contentSubmissions.submittedAt} DESC`);

  const formatted = list.map((item) => ({
    ...item,
    reward: serializeMoney(item.rewardMinor).amount,
  }));
  return c.json(apiSuccess(formatted));
});

adminRouter.post("/content-submissions/:id/approve", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const rewardBDT = Number(body.reward || 50);
  const feedback = body.feedback || "চমৎকার কন্টেন্ট! রিওয়ার্ড ক্রেডিট করা হয়েছে।";

  const [sub] = await db.select().from(contentSubmissions).where(eq(contentSubmissions.id, id)).limit(1);
  if (!sub) throw new NotFoundError("কন্টেন্ট সাবমিশন পাওয়া যায়নি");

  const rewardMinor = toMinorUnits(rewardBDT);

  // Credit user wallet
  const [wallet] = await db.select().from(wallets).where(eq(wallets.userId, sub.userId)).limit(1);
  if (wallet && rewardMinor > 0n) {
    const newBalance = wallet.balanceMinor + rewardMinor;
    const newEarned = wallet.totalEarnedMinor + rewardMinor;

    await db
      .update(wallets)
      .set({ balanceMinor: newBalance, totalEarnedMinor: newEarned, updatedAt: new Date() })
      .where(eq(wallets.id, wallet.id));

    await db.insert(walletTransactions).values({
      walletId: wallet.id,
      userId: sub.userId,
      type: "BONUS",
      direction: "CREDIT",
      amountMinor: rewardMinor,
      balanceAfterMinor: newBalance,
      description: `কন্টেন্ট রিওয়ার্ড: ${sub.title}`,
      referenceId: sub.id,
    });
  }

  await db
    .update(contentSubmissions)
    .set({
      status: "APPROVED",
      rewardMinor,
      adminFeedback: feedback,
      reviewedAt: new Date(),
    })
    .where(eq(contentSubmissions.id, id));

  return c.json(apiSuccess({ message: `কন্টেন্ট অনুমোদিত এবং ৳${rewardBDT} ইউজারের ব্যালেন্সে ক্রেডিট হয়েছে।` }));
});

adminRouter.post("/content-submissions/:id/reject", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const reason = (body as any)?.reason || "মানসম্মত নয় অথবা কপিরাইট নীতি লঙ্ঘন করেছে";

  await db
    .update(contentSubmissions)
    .set({
      status: "REJECTED",
      adminFeedback: reason,
      reviewedAt: new Date(),
    })
    .where(eq(contentSubmissions.id, id));

  return c.json(apiSuccess({ message: "কন্টেন্ট সাবমিশনটি বাতিল করা হয়েছে।" }));
});

// 14. I Cash Plans & User Investments
adminRouter.get("/icash/plans", async (c) => {
  const plans = await db.select().from(icashPlans).orderBy(sql`${icashPlans.years} ASC`);
  const formatted = plans.map((p) => ({
    id: p.id,
    title: p.title,
    years: p.years,
    profitPercent: p.profitPercent,
    minDeposit: serializeMoney(p.minDepositMinor).amount,
    maxDeposit: serializeMoney(p.maxDepositMinor).amount,
    popular: p.popular,
  }));
  return c.json(apiSuccess(formatted));
});

adminRouter.put("/icash/plans/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const profitPercent = Number(body.profitPercent);
  const minDeposit = Number(body.minDeposit);
  const maxDeposit = Number(body.maxDeposit);

  await db
    .update(icashPlans)
    .set({
      profitPercent,
      minDepositMinor: toMinorUnits(minDeposit),
      maxDepositMinor: toMinorUnits(maxDeposit),
    })
    .where(eq(icashPlans.id, id));

  return c.json(apiSuccess({ message: "I Cash প্ল্যান সফলভাবে আপডেট করা হয়েছে।" }));
});

adminRouter.get("/icash/investments", async (c) => {
  const list = await db
    .select({
      id: icashInvestments.id,
      userId: icashInvestments.userId,
      userName: profiles.displayName,
      phone: profiles.phone,
      planId: icashInvestments.planId,
      planTitle: icashPlans.title,
      investedAmountMinor: icashInvestments.investedAmountMinor,
      monthlyProfitMinor: icashInvestments.monthlyProfitMinor,
      totalProfitClaimedMinor: icashInvestments.totalProfitClaimedMinor,
      status: icashInvestments.status,
      startDate: icashInvestments.startDate,
      maturityDate: icashInvestments.maturityDate,
      nextProfitClaimDate: icashInvestments.nextProfitClaimDate,
    })
    .from(icashInvestments)
    .innerJoin(profiles, eq(icashInvestments.userId, profiles.id))
    .innerJoin(icashPlans, eq(icashInvestments.planId, icashPlans.id))
    .orderBy(sql`${icashInvestments.startDate} DESC`);

  const formatted = list.map((item) => ({
    ...item,
    investedAmount: serializeMoney(item.investedAmountMinor).amount,
    monthlyProfit: serializeMoney(item.monthlyProfitMinor).amount,
    totalProfitClaimed: serializeMoney(item.totalProfitClaimedMinor).amount,
  }));
  return c.json(apiSuccess(formatted));
});
