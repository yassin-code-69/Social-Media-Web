import { Hono } from "hono";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { icashPlans, icashInvestments, wallets, walletTransactions } from "@/db/schema";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney, toMinorUnits } from "@/shared/utils/money";
import { BadRequestError, NotFoundError } from "@/shared/errors/app-error";
import { AppEnv } from "@/types/context";

export const icashRouter = new Hono<AppEnv>();

// GET /api/v1/icash/plans - List all investment plans
icashRouter.get("/plans", async (c) => {
  const plans = await db.select().from(icashPlans).orderBy(icashPlans.years);

  const formattedPlans = plans.map((p) => ({
    id: p.id,
    title: p.title,
    years: p.years,
    profitPercent: p.profitPercent,
    minDeposit: serializeMoney(p.minDepositMinor),
    maxDeposit: serializeMoney(p.maxDepositMinor),
    popular: p.popular,
  }));

  return c.json(apiSuccess(formattedPlans));
});

// GET /api/v1/icash/my-investments - List user's investments
icashRouter.get("/my-investments", requireAuth, async (c) => {
  const authUser = c.get("user")!;

  const investments = await db
    .select({
      id: icashInvestments.id,
      planId: icashInvestments.planId,
      planTitle: icashPlans.title,
      profitPercent: icashPlans.profitPercent,
      investedAmountMinor: icashInvestments.investedAmountMinor,
      monthlyProfitMinor: icashInvestments.monthlyProfitMinor,
      totalProfitClaimedMinor: icashInvestments.totalProfitClaimedMinor,
      status: icashInvestments.status,
      startDate: icashInvestments.startDate,
      maturityDate: icashInvestments.maturityDate,
      lastProfitClaimDate: icashInvestments.lastProfitClaimDate,
      nextProfitClaimDate: icashInvestments.nextProfitClaimDate,
    })
    .from(icashInvestments)
    .innerJoin(icashPlans, eq(icashInvestments.planId, icashPlans.id))
    .where(eq(icashInvestments.userId, authUser.id))
    .orderBy(sql`${icashInvestments.createdAt} DESC`);

  const now = new Date();
  const formatted = investments.map((inv) => {
    const isClaimable = now >= new Date(inv.nextProfitClaimDate) && inv.status === "ACTIVE";
    return {
      id: inv.id,
      planTitle: inv.planTitle,
      profitPercent: inv.profitPercent,
      investedAmount: serializeMoney(inv.investedAmountMinor),
      monthlyProfit: serializeMoney(inv.monthlyProfitMinor),
      totalProfitClaimed: serializeMoney(inv.totalProfitClaimedMinor),
      status: inv.status,
      startDate: inv.startDate,
      maturityDate: inv.maturityDate,
      nextProfitClaimDate: inv.nextProfitClaimDate,
      isClaimable,
    };
  });

  return c.json(apiSuccess(formatted));
});

const investSchema = z.object({
  planId: z.string().min(1, "প্ল্যান সিলেক্ট করুন"),
  amountBDT: z.number().positive("বিনিয়োগের পরিমাণ ধনাত্মক হতে হবে"),
});

// POST /api/v1/icash/invest - Create investment
icashRouter.post("/invest", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const body = await c.req.json().catch(() => ({}));
  const validation = investSchema.safeParse(body);

  if (!validation.success) {
    const issue = validation.error.issues[0];
    throw new BadRequestError(issue ? issue.message : "ভুল বিনিয়োগ তথ্য দেওয়া হয়েছে");
  }

  const { planId, amountBDT } = validation.data;
  const amountMinor = toMinorUnits(amountBDT);

  // 1. Fetch plan
  const [plan] = await db
    .select()
    .from(icashPlans)
    .where(eq(icashPlans.id, planId))
    .limit(1);

  if (!plan) {
    throw new NotFoundError("কাঙ্ক্ষিত আই ক্যাশ প্ল্যানটি পাওয়া যায়নি");
  }

  // 2. Validate amount limits
  if (amountMinor < plan.minDepositMinor) {
    throw new BadRequestError(`এই প্ল্যানের সর্বনিম্ন বিনিয়োগ ${serializeMoney(plan.minDepositMinor).formatted}`);
  }
  if (amountMinor > plan.maxDepositMinor) {
    throw new BadRequestError(`এই প্ল্যানের সর্বোচ্চ বিনিয়োগ ${serializeMoney(plan.maxDepositMinor).formatted}`);
  }

  // 3. Check wallet balance
  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, authUser.id))
    .limit(1);

  if (!wallet || wallet.balanceMinor < amountMinor) {
    throw new BadRequestError("আপনার মেইন ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই। অনুগ্রহ করে প্রথমে ডিপোজিট করুন।");
  }

  // 4. Calculate dates & profit
  const now = new Date();
  const maturityDate = new Date(now);
  maturityDate.setFullYear(maturityDate.getFullYear() + plan.years);

  const nextClaimDate = new Date(now);
  nextClaimDate.setDate(nextClaimDate.getDate() + 30);

  // Annual profit = amount * profitPercent / 100. Monthly = Annual / 12.
  const annualProfitMinor = (amountMinor * BigInt(plan.profitPercent)) / 100n;
  const monthlyProfitMinor = annualProfitMinor / 12n;

  // 5. Atomic transaction execution
  const newBalanceMinor = wallet.balanceMinor - amountMinor;

  // Update wallet
  await db
    .update(wallets)
    .set({
      balanceMinor: newBalanceMinor,
      updatedAt: now,
    })
    .where(eq(wallets.id, wallet.id));

  // Log transaction
  await db.insert(walletTransactions).values({
    walletId: wallet.id,
    userId: authUser.id,
    type: "ICASH_INVESTMENT",
    direction: "DEBIT",
    amountMinor,
    balanceAfterMinor: newBalanceMinor,
    description: `I Cash ${plan.title} (${plan.profitPercent}% বাৎসরিক মুনাফা) এ বিনিয়োগ`,
    referenceId: plan.id,
  });

  // Create investment
  const [created] = await db
    .insert(icashInvestments)
    .values({
      userId: authUser.id,
      planId: plan.id,
      investedAmountMinor: amountMinor,
      monthlyProfitMinor,
      totalProfitClaimedMinor: 0n,
      status: "ACTIVE",
      startDate: now,
      maturityDate,
      nextProfitClaimDate: nextClaimDate,
    })
    .returning();

  return c.json(
    apiSuccess({
      message: `আই ক্যাশ ${plan.title} এ আপনার বিনিয়োগ সফল হয়েছে! প্রতি ৩০ দিন পরপর আপনি ৳${(Number(monthlyProfitMinor) / 100).toFixed(2)} মুনাফা ক্লেইম করতে পারবেন।`,
      investment: {
        id: created.id,
        planTitle: plan.title,
        investedAmount: serializeMoney(created.investedAmountMinor),
        monthlyProfit: serializeMoney(created.monthlyProfitMinor),
        maturityDate: created.maturityDate,
        nextProfitClaimDate: created.nextProfitClaimDate,
      },
    }),
    201
  );
});

// POST /api/v1/icash/claim-profit/:id - Claim monthly profit
icashRouter.post("/claim-profit/:id", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const investmentId = c.req.param("id");
  if (!investmentId) {
    throw new BadRequestError("বিনিয়োগ আইডি আবশ্যক");
  }

  const [investment] = await db
    .select()
    .from(icashInvestments)
    .where(
      and(
        eq(icashInvestments.id, investmentId),
        eq(icashInvestments.userId, authUser.id)
      )
    )
    .limit(1);

  if (!investment) {
    throw new NotFoundError("বিনিয়োগ রেকর্ড খুঁজে পাওয়া যায়নি");
  }

  if (investment.status !== "ACTIVE") {
    throw new BadRequestError("এই বিনিয়োগটি সক্রিয় নেই");
  }

  const now = new Date();
  if (now < new Date(investment.nextProfitClaimDate)) {
    const diffMs = new Date(investment.nextProfitClaimDate).getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    throw new BadRequestError(`মুনাফা ক্লেইম করার পরবর্তী তারিখ এখনো আসেনি (${daysLeft} দিন বাকি)`);
  }

  // Fetch wallet
  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, authUser.id))
    .limit(1);

  if (!wallet) {
    throw new NotFoundError("ওয়ালেট পাওয়া যায়নি");
  }

  const profitAmountMinor = investment.monthlyProfitMinor;
  const newBalanceMinor = wallet.balanceMinor + profitAmountMinor;
  const newTotalEarnedMinor = wallet.totalEarnedMinor + profitAmountMinor;

  // Credit wallet
  await db
    .update(wallets)
    .set({
      balanceMinor: newBalanceMinor,
      totalEarnedMinor: newTotalEarnedMinor,
      updatedAt: now,
    })
    .where(eq(wallets.id, wallet.id));

  // Log transaction
  await db.insert(walletTransactions).values({
    walletId: wallet.id,
    userId: authUser.id,
    type: "ICASH_PROFIT",
    direction: "CREDIT",
    amountMinor: profitAmountMinor,
    balanceAfterMinor: newBalanceMinor,
    description: `I Cash মাসিক মুনাফা ক্রেডিট`,
    referenceId: investment.id,
  });

  // Calculate next claim date
  const nextClaimDate = new Date(now);
  nextClaimDate.setDate(nextClaimDate.getDate() + 30);

  // Check if matured
  const isMatured = now >= new Date(investment.maturityDate);

  await db
    .update(icashInvestments)
    .set({
      totalProfitClaimedMinor: investment.totalProfitClaimedMinor + profitAmountMinor,
      lastProfitClaimDate: now,
      nextProfitClaimDate: nextClaimDate,
      status: isMatured ? "MATURED" : "ACTIVE",
    })
    .where(eq(icashInvestments.id, investment.id));

  return c.json(
    apiSuccess({
      message: `অভিনন্দন! আপনার ওয়ালেটে ${serializeMoney(profitAmountMinor).formatted} মাসিক মুনাফা যুক্ত করা হয়েছে।`,
      creditedAmount: serializeMoney(profitAmountMinor),
      newBalance: serializeMoney(newBalanceMinor),
      nextClaimDate,
    })
  );
});
