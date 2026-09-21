import { Hono } from "hono";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  wallets,
  walletTransactions,
  deposits,
  withdrawals,
  paymentMethods,
} from "@/db/schema";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney, toMinorUnits } from "@/shared/utils/money";
import { BadRequestError, NotFoundError } from "@/shared/errors/app-error";
import { AppEnv } from "@/types/context";

export const walletRouter = new Hono<AppEnv>();

// GET /api/v1/wallet - Current user wallet balance
walletRouter.get("/", requireAuth, async (c) => {
  const user = c.get("user")!;

  let [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, user.id))
    .limit(1);

  if (!wallet) {
    const [created] = await db
      .insert(wallets)
      .values({
        userId: user.id,
        balanceMinor: 0n,
        pendingBalanceMinor: 0n,
        bonusBalanceMinor: 0n,
        totalEarnedMinor: 0n,
        totalWithdrawnMinor: 0n,
      })
      .returning();
    wallet = created;
  }

  return c.json(
    apiSuccess({
      userId: user.id,
      balance: serializeMoney(wallet.balanceMinor),
      pendingBalance: serializeMoney(wallet.pendingBalanceMinor),
      bonusBalance: serializeMoney(wallet.bonusBalanceMinor),
      totalEarned: serializeMoney(wallet.totalEarnedMinor),
      totalWithdrawn: serializeMoney(wallet.totalWithdrawnMinor),
      currency: wallet.currency,
    })
  );
});

// GET /api/v1/wallet/transactions - Wallet transaction logs
walletRouter.get("/transactions", requireAuth, async (c) => {
  const user = c.get("user")!;

  const txList = await db
    .select()
    .from(walletTransactions)
    .where(eq(walletTransactions.userId, user.id))
    .orderBy(sql`${walletTransactions.createdAt} DESC`)
    .limit(50);

  const formatted = txList.map((tx) => ({
    id: tx.id,
    type: tx.type,
    direction: tx.direction,
    amount: serializeMoney(tx.amountMinor),
    balanceAfter: serializeMoney(tx.balanceAfterMinor),
    description: tx.description,
    referenceId: tx.referenceId,
    createdAt: tx.createdAt,
  }));

  return c.json(apiSuccess(formatted));
});

// GET /api/v1/wallet/payment-methods - Active payment channels
walletRouter.get("/payment-methods", async (c) => {
  const methods = await db
    .select()
    .from(paymentMethods)
    .where(eq(paymentMethods.isActive, true));

  return c.json(apiSuccess(methods));
});

const depositSchema = z.object({
  amount: z.coerce.number().min(50, "সর্বনিম্ন ৫০ টাকা ডিপোজিট করা যাবে"),
  paymentMethod: z.string().min(2, "পেমেন্ট মাধ্যম সিলেক্ট করুন"),
  senderNumber: z.string().min(11, "১১ ডিজিটের প্রেরক নম্বর দিন"),
  transactionId: z.string().min(4, "সঠিক ট্রানজেকশন আইডি দিন"),
  screenshotUrl: z.string().url().optional().or(z.literal("")),
});

// POST /api/v1/wallet/deposit - Submit deposit request
walletRouter.post("/deposit", requireAuth, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json().catch(() => ({}));
  const validation = depositSchema.safeParse(body);

  if (!validation.success) {
    const issue = validation.error.issues[0];
    throw new BadRequestError(issue ? issue.message : "ভুল তথ্য প্রদান করা হয়েছে");
  }

  const { amount, paymentMethod, senderNumber, transactionId, screenshotUrl } = validation.data;
  const amountMinor = toMinorUnits(amount);

  const [deposit] = await db
    .insert(deposits)
    .values({
      userId: user.id,
      amountMinor,
      paymentMethod,
      senderNumber: senderNumber.trim(),
      transactionId: transactionId.trim().toUpperCase(),
      screenshotUrl: screenshotUrl || null,
      status: "PENDING",
    })
    .returning();

  return c.json(
    apiSuccess({
      message: "ডিপোজিট অনুরোধ সফলভাবে জমা হয়েছে। অ্যাডমিন পর্যালোচনার পর ব্যালেন্স যুক্ত হবে।",
      deposit: {
        id: deposit.id,
        amount: serializeMoney(deposit.amountMinor),
        paymentMethod: deposit.paymentMethod,
        transactionId: deposit.transactionId,
        status: deposit.status,
        createdAt: deposit.createdAt,
      },
    }),
    201
  );
});

const withdrawSchema = z.object({
  amount: z.coerce.number().min(100, "সর্বনিম্ন ১০০ টাকা উত্তোলন করা যাবে"),
  paymentMethod: z.string().min(2, "পেমেন্ট মাধ্যম সিলেক্ট করুন"),
  accountNumber: z.string().min(11, "সঠিক অ্যাকাউন্ট নম্বর দিন"),
});

// POST /api/v1/wallet/withdraw - Submit withdrawal request
walletRouter.post("/withdraw", requireAuth, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json().catch(() => ({}));
  const validation = withdrawSchema.safeParse(body);

  if (!validation.success) {
    const issue = validation.error.issues[0];
    throw new BadRequestError(issue ? issue.message : "ভুল তথ্য প্রদান করা হয়েছে");
  }

  const { amount, paymentMethod, accountNumber } = validation.data;
  const amountMinor = toMinorUnits(amount);

  // Check wallet balance
  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, user.id))
    .limit(1);

  if (!wallet || wallet.balanceMinor < amountMinor) {
    throw new BadRequestError("আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই!");
  }

  const masked = accountNumber.slice(0, 4) + "*****" + accountNumber.slice(-2);

  // Deduct from balance, put in pendingBalance
  const newBalanceMinor = wallet.balanceMinor - amountMinor;
  const newPendingMinor = wallet.pendingBalanceMinor + amountMinor;

  await db
    .update(wallets)
    .set({
      balanceMinor: newBalanceMinor,
      pendingBalanceMinor: newPendingMinor,
      updatedAt: new Date(),
    })
    .where(eq(wallets.id, wallet.id));

  // Log transaction
  await db.insert(walletTransactions).values({
    walletId: wallet.id,
    userId: user.id,
    type: "WITHDRAWAL",
    direction: "DEBIT",
    amountMinor,
    balanceAfterMinor: newBalanceMinor,
    description: `${paymentMethod} উত্তোলন অনুরোধ (${masked})`,
  });

  // Create withdrawal record
  const [withdrawal] = await db
    .insert(withdrawals)
    .values({
      userId: user.id,
      amountMinor,
      paymentMethod,
      accountNumber: accountNumber.trim(),
      maskedAccount: masked,
      status: "PENDING",
    })
    .returning();

  return c.json(
    apiSuccess({
      message: "উইথড্রয়াল অনুরোধ জমা হয়েছে। ব্যালেন্স সাময়িকভাবে হোল্ড করা হয়েছে এবং অ্যাডমিন যাচাই করে পেমেন্ট পাঠিয়ে দেবে।",
      withdrawal: {
        id: withdrawal.id,
        amount: serializeMoney(withdrawal.amountMinor),
        paymentMethod: withdrawal.paymentMethod,
        maskedAccount: masked,
        status: withdrawal.status,
        createdAt: withdrawal.createdAt,
      },
    }),
    201
  );
});

// GET /api/v1/wallet/my-requests - History of deposits and withdrawals
walletRouter.get("/my-requests", requireAuth, async (c) => {
  const user = c.get("user")!;

  const userDeposits = await db
    .select()
    .from(deposits)
    .where(eq(deposits.userId, user.id))
    .orderBy(sql`${deposits.createdAt} DESC`);

  const userWithdrawals = await db
    .select()
    .from(withdrawals)
    .where(eq(withdrawals.userId, user.id))
    .orderBy(sql`${withdrawals.createdAt} DESC`);

  return c.json(
    apiSuccess({
      deposits: userDeposits.map((d) => ({
        id: d.id,
        amount: serializeMoney(d.amountMinor),
        paymentMethod: d.paymentMethod,
        transactionId: d.transactionId,
        status: d.status,
        createdAt: d.createdAt,
        reviewedAt: d.reviewedAt,
      })),
      withdrawals: userWithdrawals.map((w) => ({
        id: w.id,
        amount: serializeMoney(w.amountMinor),
        paymentMethod: w.paymentMethod,
        maskedAccount: w.maskedAccount,
        status: w.status,
        createdAt: w.createdAt,
        reviewedAt: w.reviewedAt,
      })),
    })
  );
});
