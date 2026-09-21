import { Hono } from "hono";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { packages, packagePurchases } from "@/db/schema";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney } from "@/shared/utils/money";
import { BadRequestError, NotFoundError } from "@/shared/errors/app-error";
import { AppEnv } from "@/types/context";

export const packagesRouter = new Hono<AppEnv>();

// GET /api/v1/packages - Fetch all active packages from DB
packagesRouter.get("/", async (c) => {
  const allPackages = await db
    .select()
    .from(packages)
    .where(eq(packages.status, "ACTIVE"))
    .orderBy(packages.priceMinor);

  const formatted = allPackages.map((p) => ({
    id: p.id,
    name: p.name,
    priceMinor: p.priceMinor.toString(),
    price: serializeMoney(p.priceMinor),
    validityDays: p.validityDays,
    dailyTaskLimit: p.dailyTaskLimit,
    dailyRewardLimitMinor: p.dailyRewardLimitMinor.toString(),
    dailyRewardLimit: serializeMoney(p.dailyRewardLimitMinor),
    referralBonusPercent: p.referralBonusPercent,
    colorGradient: p.colorGradient,
    isPopular: p.isPopular,
    features: p.features,
    status: p.status,
  }));

  return c.json(apiSuccess(formatted));
});

// GET /api/v1/packages/:id - Get package by ID
packagesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  if (!id) {
    throw new BadRequestError("প্যাকেজ আইডি আবশ্যক");
  }

  const [pkg] = await db
    .select()
    .from(packages)
    .where(eq(packages.id, id))
    .limit(1);

  if (!pkg) {
    throw new NotFoundError("প্যাকেজটি খুঁজে পাওয়া যায়নি");
  }

  return c.json(
    apiSuccess({
      id: pkg.id,
      name: pkg.name,
      priceMinor: pkg.priceMinor.toString(),
      price: serializeMoney(pkg.priceMinor),
      validityDays: pkg.validityDays,
      dailyTaskLimit: pkg.dailyTaskLimit,
      dailyRewardLimitMinor: pkg.dailyRewardLimitMinor.toString(),
      dailyRewardLimit: serializeMoney(pkg.dailyRewardLimitMinor),
      referralBonusPercent: pkg.referralBonusPercent,
      colorGradient: pkg.colorGradient,
      isPopular: pkg.isPopular,
      features: pkg.features,
      status: pkg.status,
    })
  );
});

const purchaseSchema = z.object({
  packageId: z.string().uuid("সঠিক প্যাকেজ নির্বাচন করুন"),
  paymentMethod: z.string().min(2, "পেমেন্ট মাধ্যম নির্বাচন করুন"),
  senderNumber: z.string().min(11, "১১ ডিজিটের সেন্ডার নম্বর দিন"),
  transactionId: z.string().min(4, "ট্রানজেকশন আইডি দিন"),
});

// POST /api/v1/packages/purchase - Submit package purchase request
packagesRouter.post("/purchase", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const body = await c.req.json().catch(() => ({}));
  const validation = purchaseSchema.safeParse(body);

  if (!validation.success) {
    const issue = validation.error.issues[0];
    throw new BadRequestError(issue ? issue.message : "ভুল তথ্য প্রদান করা হয়েছে");
  }

  const { packageId, paymentMethod, senderNumber, transactionId } = validation.data;

  // 1. Fetch package
  const [pkg] = await db
    .select()
    .from(packages)
    .where(eq(packages.id, packageId))
    .limit(1);

  if (!pkg) {
    throw new NotFoundError("নির্বাচিত প্যাকেজটি পাওয়া যায়নি");
  }

  // 2. Insert into package_purchases
  const [purchase] = await db
    .insert(packagePurchases)
    .values({
      userId: authUser.id,
      packageId: pkg.id,
      amountMinor: pkg.priceMinor,
      paymentMethod,
      senderNumber: senderNumber.trim(),
      transactionId: transactionId.trim().toUpperCase(),
      status: "PENDING",
    })
    .returning();

  return c.json(
    apiSuccess({
      message: `'${pkg.name}' প্যাকেজ কেনার অনুরোধ সফলভাবে গৃহীত হয়েছে! অ্যাডমিন ট্রানজেকশন যাচাই করে দ্রুত আপনার প্যাকেজটি সক্রিয় করবেন।`,
      purchase: {
        id: purchase.id,
        packageName: pkg.name,
        amount: serializeMoney(purchase.amountMinor),
        paymentMethod: purchase.paymentMethod,
        transactionId: purchase.transactionId,
        status: purchase.status,
        createdAt: purchase.createdAt,
      },
    }),
    201
  );
});
