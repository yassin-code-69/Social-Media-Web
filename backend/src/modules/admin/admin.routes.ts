import { Hono } from "hono";
import { z } from "zod";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { requireAdmin } from "@/middleware/admin";
import { serializeMoney, toMinorUnits } from "@/shared/utils/money";
import { AppEnv } from "@/types/context";

export const adminRouter = new Hono<AppEnv>();

// Enforce authentication & admin authorization on all /admin routes
adminRouter.use("*", requireAuth, requireAdmin);

// 1. Dashboard metrics
adminRouter.get("/stats", async (c) => {
  return c.json(
    apiSuccess({
      pendingSubmissions: 3,
      pendingDeposits: 2,
      pendingWithdrawals: 1,
      totalUsers: 1420,
      activeUsers: 1180,
      totalDeposits: serializeMoney(45200000n), // ৳452,000.00
      totalWithdrawals: serializeMoney(21800000n), // ৳218,000.00
    })
  );
});

// 2. Submissions review queue
adminRouter.get("/submissions", async (c) => {
  const sample = [
    {
      id: "sub_101",
      taskId: "task_yt_1",
      taskTitle: "YouTube ভিডিও দেখুন",
      userId: "user_1024",
      userName: "তামিম ইসলাম",
      reward: serializeMoney(1000n),
      screenshotUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=400&q=80",
      userNote: "২ মিনিট দেখে লাইক দিয়েছি।",
      status: "PENDING",
      submittedAt: new Date().toISOString(),
    },
  ];
  return c.json(apiSuccess(sample));
});

adminRouter.post("/submissions/:id/approve", async (c) => {
  const id = c.req.param("id");
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
  const body = await c.req.json();
  const { reason } = rejectSchema.parse(body);

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
  const sample = [
    {
      id: "dep_901",
      userId: "user_1024",
      userName: "তামিম ইসলাম",
      amount: serializeMoney(100000n),
      paymentMethod: "bKash",
      senderNumber: "01712-345678",
      transactionId: "TRX89712634B",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
  ];
  return c.json(apiSuccess(sample));
});

adminRouter.post("/deposits/:id/approve", async (c) => {
  const id = c.req.param("id");
  return c.json(
    apiSuccess({
      depositId: id,
      status: "APPROVED",
      message: "ডিপোজিট অনুমোদিত হয়েছে এবং ইউজারের অ্যাকাউন্টে ব্যালেন্স যুক্ত হয়েছে।",
    })
  );
});

adminRouter.post("/deposits/:id/reject", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const reason = (body as any)?.reason || "পেমেন্ট পাওয়া যায়নি";

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
  const sample = [
    {
      id: "wth_801",
      userId: "user_1024",
      userName: "তামিম ইসলাম",
      amount: serializeMoney(50000n),
      paymentMethod: "Nagad",
      accountNumber: "01789123456",
      maskedAccount: "01789*****56",
      status: "PENDING",
      createdAt: new Date().toISOString(),
    },
  ];
  return c.json(apiSuccess(sample));
});

adminRouter.post("/withdrawals/:id/approve", async (c) => {
  const id = c.req.param("id");
  return c.json(
    apiSuccess({
      withdrawalId: id,
      status: "APPROVED",
      message: "উইথড্রয়াল সম্পন্ন হয়েছে।",
    })
  );
});

adminRouter.post("/withdrawals/:id/reject", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json().catch(() => ({}));
  const reason = (body as any)?.reason || "অ্যাকাউন্ট তথ্যে ভুল";

  return c.json(
    apiSuccess({
      withdrawalId: id,
      status: "REJECTED",
      reason,
      refunded: true,
      message: "উইথড্রয়াল বাতিল করা হয়েছে এবং কর্তনকৃত টাকা ইউজারের ব্যালেন্সে ফেরত পাঠানো হয়েছে।",
    })
  );
});

// 5. Users management
adminRouter.get("/users", async (c) => {
  const sample = [
    {
      id: "user_1024",
      name: "তামিম ইসলাম",
      email: "tamim@example.com",
      phone: "01789-123456",
      role: "USER",
      status: "ACTIVE",
      balance: serializeMoney(125000n),
      packageName: "Gold",
    },
  ];
  return c.json(apiSuccess(sample));
});

const adjustBalanceSchema = z.object({
  amount: z.coerce.number().positive(),
  direction: z.enum(["CREDIT", "DEBIT"]),
  reason: z.string().min(1),
});

adminRouter.post("/users/:id/adjust-balance", async (c) => {
  const userId = c.req.param("id");
  const body = await c.req.json();
  const data = adjustBalanceSchema.parse(body);

  return c.json(
    apiSuccess({
      userId,
      adjustment: {
        amount: serializeMoney(toMinorUnits(data.amount)),
        direction: data.direction,
        reason: data.reason,
      },
      message: `ব্যালেন্স সফলভাবে ${data.direction === "CREDIT" ? "যোগ" : "কর্তন"} করা হয়েছে।`,
    })
  );
});

// 6. Platform Settings
adminRouter.get("/settings", async (c) => {
  return c.json(
    apiSuccess({
      minWithdrawal: 200,
      maxWithdrawal: 10000,
      referralBonus: 20,
      bkashNumber: "01789-000111",
      nagadNumber: "01889-222333",
      rocketNumber: "01989-444555",
      announcement: "দিগন্তে নতুন ফিচার আপডেট এসেছে! প্রতিদিন নতুন নতুন টাস্ক সম্পন্ন করে বেশি আয় করুন।",
      isWithdrawalEnabled: true,
      isDepositEnabled: true,
    })
  );
});

adminRouter.put("/settings", async (c) => {
  const body = await c.req.json();
  return c.json(
    apiSuccess({
      updatedSettings: body,
      message: "সিস্টেম সেটিংস সফলভাবে সংরক্ষিত হয়েছে।",
    })
  );
});
