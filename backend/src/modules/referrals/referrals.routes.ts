import { Hono } from "hono";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, referrals, walletTransactions, userPackages, packages } from "@/db/schema";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney } from "@/shared/utils/money";
import { NotFoundError } from "@/shared/errors/app-error";
import { AppEnv } from "@/types/context";

export const referralsRouter = new Hono<AppEnv>();

// GET /api/v1/referrals/summary - 3-generation network summary
referralsRouter.get("/summary", requireAuth, async (c) => {
  const authUser = c.get("user")!;

  const [currentUser] = await db
    .select({
      id: profiles.id,
      referralCode: profiles.referralCode,
    })
    .from(profiles)
    .where(eq(profiles.id, authUser.id))
    .limit(1);

  if (!currentUser) {
    throw new NotFoundError("প্রোফাইল খুঁজে পাওয়া যায়নি");
  }

  // 1. Generation 1 (Direct referrals)
  const gen1 = await db
    .select({ id: profiles.id })
    .from(profiles)
    .where(eq(profiles.referredById, currentUser.id));

  const gen1Ids = gen1.map((u) => u.id);

  // 2. Generation 2
  let gen2Ids: string[] = [];
  if (gen1Ids.length > 0) {
    const gen2 = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(inArray(profiles.referredById, gen1Ids));
    gen2Ids = gen2.map((u) => u.id);
  }

  // 3. Generation 3
  let gen3Ids: string[] = [];
  if (gen2Ids.length > 0) {
    const gen3 = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(inArray(profiles.referredById, gen2Ids));
    gen3Ids = gen3.map((u) => u.id);
  }

  // 4. Calculate total referral rewards earned
  const rewardSum = await db
    .select({ total: sql<string>`coalesce(sum(amount_minor), 0)::text` })
    .from(walletTransactions)
    .where(
      sql`${walletTransactions.userId} = ${currentUser.id} AND ${walletTransactions.type} = 'REFERRAL_REWARD'`
    );

  const totalRewardsMinor = BigInt(rewardSum[0]?.total || "0");

  return c.json(
    apiSuccess({
      referralCode: currentUser.referralCode,
      referralLink: `https://digonto.com/register?ref=${currentUser.referralCode}`,
      teamStats: {
        totalTeam: gen1Ids.length + gen2Ids.length + gen3Ids.length,
        gen1Count: gen1Ids.length,
        gen2Count: gen2Ids.length,
        gen3Count: gen3Ids.length,
      },
      commissions: {
        gen1Percent: 10,
        gen2Percent: 5,
        gen3Percent: 2,
        totalEarned: serializeMoney(totalRewardsMinor),
      },
    })
  );
});

// GET /api/v1/referrals/list - Direct referrals list
referralsRouter.get("/list", requireAuth, async (c) => {
  const authUser = c.get("user")!;

  const directList = await db
    .select({
      id: profiles.id,
      displayName: profiles.displayName,
      phone: profiles.phone,
      status: profiles.status,
      createdAt: profiles.createdAt,
    })
    .from(profiles)
    .where(eq(profiles.referredById, authUser.id))
    .orderBy(sql`${profiles.createdAt} DESC`)
    .limit(50);

  // Mask phone numbers (e.g. 017****1234)
  const maskedList = directList.map((item) => {
    let maskedPhone = item.phone || "";
    if (maskedPhone.length >= 8) {
      maskedPhone = `${maskedPhone.slice(0, 3)}****${maskedPhone.slice(-4)}`;
    }
    return {
      id: item.id,
      displayName: item.displayName,
      phone: maskedPhone,
      status: item.status,
      joinedAt: item.createdAt,
    };
  });

  return c.json(apiSuccess(maskedList));
});
