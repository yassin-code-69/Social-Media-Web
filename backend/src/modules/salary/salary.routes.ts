import { Hono } from "hono";
import { z } from "zod";
import { eq, and, sql, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, monthlySalaryClaims, incentiveClaims } from "@/db/schema";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney } from "@/shared/utils/money";
import { BadRequestError, ConflictError } from "@/shared/errors/app-error";
import { AppEnv } from "@/types/context";

export const salaryRouter = new Hono<AppEnv>();

function getCurrentMonthYear(): string {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${d.getFullYear()}-${month}`;
}

// GET /api/v1/salary/status - Check eligibility and claim status
salaryRouter.get("/status", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const currentMonth = getCurrentMonthYear();

  // 1. Calculate Gen 1 count
  const gen1 = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.referredById, authUser.id));
  const gen1Count = gen1.length;
  const gen1Ids = gen1.map((u) => u.id);

  // 2. Calculate Gen 2 count
  let gen2Count = 0;
  let gen2Ids: string[] = [];
  if (gen1Ids.length > 0) {
    const gen2 = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(inArray(profiles.referredById, gen1Ids));
    gen2Count = gen2.length;
    gen2Ids = gen2.map((u) => u.id);
  }

  // 3. Calculate Gen 3 count
  let gen3Count = 0;
  if (gen2Ids.length > 0) {
    const gen3 = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(inArray(profiles.referredById, gen2Ids));
    gen3Count = gen3.length;
  }

  // 4. Check existing claims for current month
  const claims = await db
    .select()
    .from(monthlySalaryClaims)
    .where(
      and(
        eq(monthlySalaryClaims.userId, authUser.id),
        eq(monthlySalaryClaims.monthYear, currentMonth)
      )
    );

  // 5. Check incentive claim status
  const existingIncentive = await db
    .select()
    .from(incentiveClaims)
    .where(eq(incentiveClaims.userId, authUser.id))
    .limit(1);

  // Determine eligible tier
  let eligibleTier = 0;
  let salaryAmountMinor = 0n;
  if (gen1Count >= 500) {
    eligibleTier = 500;
    salaryAmountMinor = 2000000n; // ৳20,000
  } else if (gen1Count >= 200) {
    eligibleTier = 200;
    salaryAmountMinor = 150000n; // ৳1,500
  } else if (gen1Count >= 100) {
    eligibleTier = 100;
    salaryAmountMinor = 50000n; // ৳500
  }

  const isEligibleForSalary = eligibleTier > 0;
  const hasClaimedThisMonth = claims.length > 0;
  const isEligibleForIphone = gen1Count >= 100 && gen2Count >= 50 && gen3Count >= 20;

  return c.json(
    apiSuccess({
      monthYear: currentMonth,
      teamStats: {
        gen1Count,
        gen2Count,
        gen3Count,
      },
      salaryTiers: [
        {
          tier: 100,
          requiredMembers: 100,
          currentMembers: gen1Count,
          monthlySalary: serializeMoney(50000n), // ৳500
          isEligible: gen1Count >= 100,
          progressPercent: Math.min(100, Math.round((gen1Count / 100) * 100)),
        },
        {
          tier: 200,
          requiredMembers: 200,
          currentMembers: gen1Count,
          monthlySalary: serializeMoney(150000n), // ৳1,500
          isEligible: gen1Count >= 200,
          progressPercent: Math.min(100, Math.round((gen1Count / 200) * 100)),
        },
        {
          tier: 500,
          requiredMembers: 500,
          currentMembers: gen1Count,
          monthlySalary: serializeMoney(2000000n), // ৳20,000
          isEligible: gen1Count >= 500,
          progressPercent: Math.min(100, Math.round((gen1Count / 500) * 100)),
        },
      ],
      currentMonthClaim: claims[0] || null,
      canClaimSalary: isEligibleForSalary && !hasClaimedThisMonth,
      incentive: {
        title: "iPhone 16 Pro",
        required: { gen1: 100, gen2: 50, gen3: 20 },
        current: { gen1: gen1Count, gen2: gen2Count, gen3: gen3Count },
        isEligible: isEligibleForIphone,
        hasClaimed: existingIncentive.length > 0,
        claimDetails: existingIncentive[0] || null,
      },
    })
  );
});

// POST /api/v1/salary/claim - Claim monthly salary
salaryRouter.post("/claim", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const currentMonth = getCurrentMonthYear();

  // Check if already claimed this month
  const existing = await db
    .select()
    .from(monthlySalaryClaims)
    .where(
      and(
        eq(monthlySalaryClaims.userId, authUser.id),
        eq(monthlySalaryClaims.monthYear, currentMonth)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    throw new ConflictError("আপনি চলতি মাসে ইতোমধ্যে স্যালারি ক্লেইম করেছেন");
  }

  // Count Gen 1 referrals
  const gen1 = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.referredById, authUser.id));

  const gen1Count = gen1.length;

  let targetTier = 0;
  let salaryAmountMinor = 0n;

  if (gen1Count >= 500) {
    targetTier = 500;
    salaryAmountMinor = 2000000n; // ৳20,000
  } else if (gen1Count >= 200) {
    targetTier = 200;
    salaryAmountMinor = 150000n; // ৳1,500
  } else if (gen1Count >= 100) {
    targetTier = 100;
    salaryAmountMinor = 50000n; // ৳500
  } else {
    throw new BadRequestError(
      `স্যালারি ক্লেইম করার জন্য ন্যূনতম ১০০ জন ডিরেক্ট রেফারেল প্রয়োজন (আপনার রয়েছে ${gen1Count} জন)`
    );
  }

  const [claim] = await db
    .insert(monthlySalaryClaims)
    .values({
      userId: authUser.id,
      targetTier,
      salaryAmountMinor,
      eligibleMembersCount: gen1Count,
      monthYear: currentMonth,
      status: "PENDING",
    })
    .returning();

  return c.json(
    apiSuccess({
      message: `চলতি মাসের (${currentMonth}) স্যালারি ক্লেইম সফলভাবে জমা হয়েছে! অ্যাডমিন পর্যালোচনার পর ব্যালেন্সে যুক্ত হবে।`,
      claim: {
        id: claim.id,
        targetTier: claim.targetTier,
        salaryAmount: serializeMoney(claim.salaryAmountMinor),
        status: claim.status,
        claimedAt: claim.claimedAt,
      },
    }),
    201
  );
});

const incentiveSchema = z.object({
  recipientName: z.string().min(2, "প্রাপকের নাম দিন"),
  deliveryPhone: z.string().min(11, "১১ ডিজিটের মোবাইল নম্বর দিন"),
  deliveryAddress: z.string().min(10, "সম্পূর্ণ ডেলিভারি ঠিকানা দিন"),
});

// POST /api/v1/salary/incentive/claim - Claim iPhone incentive
salaryRouter.post("/incentive/claim", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const body = await c.req.json().catch(() => ({}));
  const validation = incentiveSchema.safeParse(body);

  if (!validation.success) {
    const issue = validation.error.issues[0];
    throw new BadRequestError(issue ? issue.message : "ভুল ডেলিভারি তথ্য দেওয়া হয়েছে");
  }

  const { recipientName, deliveryPhone, deliveryAddress } = validation.data;

  // Check if already claimed
  const existing = await db
    .select()
    .from(incentiveClaims)
    .where(eq(incentiveClaims.userId, authUser.id))
    .limit(1);

  if (existing.length > 0) {
    throw new ConflictError("আপনি ইতোমধ্যে আপনার ইনসেন্টিভ উপহারের জন্য আবেদন করেছেন");
  }

  // Verify Gen 1, Gen 2, Gen 3 counts
  const gen1 = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.referredById, authUser.id));
  const gen1Ids = gen1.map((u) => u.id);

  let gen2Ids: string[] = [];
  if (gen1Ids.length > 0) {
    const gen2 = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(inArray(profiles.referredById, gen1Ids));
    gen2Ids = gen2.map((u) => u.id);
  }

  let gen3Count = 0;
  if (gen2Ids.length > 0) {
    const gen3 = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(inArray(profiles.referredById, gen2Ids));
    gen3Count = gen3.length;
  }

  if (gen1Ids.length < 100 || gen2Ids.length < 50 || gen3Count < 20) {
    throw new BadRequestError(
      `আইফোন ইনসেন্টিভ যোগ্যতার শর্ত পূরণ হয়নি। প্রয়োজন: ১ম লেভেল ১০০ জন, ২য় লেভেল ৫০ জন, ৩য় লেভেল ২০ জন। আপনার রয়েছে: ${gen1Ids.length}/${gen2Ids.length}/${gen3Count} জন।`
    );
  }

  const [claim] = await db
    .insert(incentiveClaims)
    .values({
      userId: authUser.id,
      rewardTitle: "iPhone 16 Pro",
      gen1Count: gen1Ids.length,
      gen2Count: gen2Ids.length,
      gen3Count,
      recipientName,
      deliveryPhone,
      deliveryAddress,
      status: "PENDING",
    })
    .returning();

  return c.json(
    apiSuccess({
      message: "অভিনন্দন! আপনার iPhone 16 Pro ইনসেন্টিভ আবেদন সফলভাবে গৃহীত হয়েছে। অ্যাডমিন টিম দ্রুত আপনার সাথে যোগাযোগ করবে।",
      claim,
    }),
    201
  );
});
