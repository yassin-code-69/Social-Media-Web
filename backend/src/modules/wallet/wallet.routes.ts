import { Hono } from "hono";
import { z } from "zod";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney, toMinorUnits } from "@/shared/utils/money";
import { BadRequestError } from "@/shared/errors/app-error";
import { AppEnv } from "@/types/context";

export const walletRouter = new Hono<AppEnv>();

walletRouter.get("/", requireAuth, async (c) => {
  const user = c.get("user")!;

  // Default wallet state
  return c.json(
    apiSuccess({
      userId: user.id,
      balance: serializeMoney(125000n), // ৳1,250.00
      totalEarned: serializeMoney(32000n), // ৳320.00
      totalWithdrawn: serializeMoney(60000n), // ৳600.00
    })
  );
});

walletRouter.get("/transactions", requireAuth, async (c) => {
  const user = c.get("user")!;

  const sampleTransactions = [
    {
      id: "tx_1",
      type: "DEPOSIT",
      direction: "CREDIT",
      amount: serializeMoney(100000n),
      balanceAfter: serializeMoney(100000n),
      description: "bKash ডিপোজিট অনুমোদন",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "tx_2",
      type: "WITHDRAWAL",
      direction: "DEBIT",
      amount: serializeMoney(50000n),
      balanceAfter: serializeMoney(50000n),
      description: "Nagad উইথড্রয়াল প্রসেসড",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: "tx_3",
      type: "TASK_REWARD",
      direction: "CREDIT",
      amount: serializeMoney(1000n),
      balanceAfter: serializeMoney(51000n),
      description: "YouTube টাস্ক রিওয়ার্ড",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
  ];

  return c.json(apiSuccess(sampleTransactions));
});

const depositSchema = z.object({
  amount: z.coerce.number().positive("ডিপোজিট পরিমাণ ১ টাকার বেশি হতে হবে"),
  paymentMethod: z.enum(["bKash", "Nagad", "Rocket", "Bank"]),
  senderNumber: z.string().min(11, "সঠিক প্রেরক নম্বর দিন"),
  transactionId: z.string().min(4, "সঠিক ট্রানজেকশন আইডি দিন"),
  screenshotUrl: z.string().url().optional(),
});

walletRouter.post("/deposit", requireAuth, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();
  const data = depositSchema.parse(body);

  const amountMinor = toMinorUnits(data.amount);

  return c.json(
    apiSuccess(
      {
        depositId: `dep_${Date.now()}`,
        userId: user.id,
        amount: serializeMoney(amountMinor),
        paymentMethod: data.paymentMethod,
        senderNumber: data.senderNumber,
        transactionId: data.transactionId,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        message: "ডিপোজিট অনুরোধ সফলভাবে জমা হয়েছে। অ্যাডমিন অনুমোদনের পর ব্যালেন্স যোগ হবে।",
      },
      { statusCode: 201 }
    ),
    201
  );
});

const withdrawSchema = z.object({
  amount: z.coerce.number().min(200, "সর্বনিম্ন ২০০ টাকা উত্তোলন করা যাবে"),
  paymentMethod: z.enum(["bKash", "Nagad", "Rocket"]),
  accountNumber: z.string().min(11, "সঠিক অ্যাকাউন্ট নম্বর দিন"),
});

walletRouter.post("/withdraw", requireAuth, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();
  const data = withdrawSchema.parse(body);

  // Available balance check (e.g. 1250 BDT)
  const availableBalanceBDT = 1250;
  if (data.amount > availableBalanceBDT) {
    throw new BadRequestError("আপনার ওয়ালেটে পর্যাপ্ত ব্যালেন্স নেই!");
  }

  const amountMinor = toMinorUnits(data.amount);
  const masked = data.accountNumber.slice(0, 4) + "*****" + data.accountNumber.slice(-2);

  return c.json(
    apiSuccess(
      {
        withdrawalId: `wth_${Date.now()}`,
        userId: user.id,
        amount: serializeMoney(amountMinor),
        paymentMethod: data.paymentMethod,
        maskedAccount: masked,
        status: "PENDING",
        createdAt: new Date().toISOString(),
        message: "উইথড্রয়াল অনুরোধ জমা হয়েছে। ব্যালেন্স সাময়িকভাবে হোল্ড করা হয়েছে।",
      },
      { statusCode: 201 }
    ),
    201
  );
});
