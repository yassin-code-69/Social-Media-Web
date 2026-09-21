import { Hono } from "hono";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  dailyCheckins,
  luckySpins,
  giftCodes,
  giftCodeRedemptions,
  wallets,
  walletTransactions,
} from "@/db/schema";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney } from "@/shared/utils/money";
import { BadRequestError, NotFoundError, ConflictError } from "@/shared/errors/app-error";
import { AppEnv } from "@/types/context";

export const missionsRouter = new Hono<AppEnv>();

function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// GET /api/v1/missions/daily-checkin/status
missionsRouter.get("/daily-checkin/status", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const today = getTodayString();

  const [todayCheckin] = await db
    .select()
    .from(dailyCheckins)
    .where(and(eq(dailyCheckins.userId, authUser.id), eq(dailyCheckins.checkinDate, today)))
    .limit(1);

  // Get recent checkins to calculate streak
  const checkins = await db
    .select()
    .from(dailyCheckins)
    .where(eq(dailyCheckins.userId, authUser.id))
    .orderBy(sql`${dailyCheckins.claimedAt} DESC`)
    .limit(7);

  const streak = checkins.length > 0 ? checkins[0].streakDay : 0;

  return c.json(
    apiSuccess({
      hasClaimedToday: !!todayCheckin,
      checkinDate: today,
      currentStreak: streak,
      rewardMinor: 500n, // ৳5
      reward: serializeMoney(500n),
    })
  );
});

// POST /api/v1/missions/daily-checkin
missionsRouter.post("/daily-checkin", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const today = getTodayString();

  // 1. Check if already claimed today
  const [existing] = await db
    .select()
    .from(dailyCheckins)
    .where(and(eq(dailyCheckins.userId, authUser.id), eq(dailyCheckins.checkinDate, today)))
    .limit(1);

  if (existing) {
    throw new ConflictError("আপনি আজ ইতোমধ্যে দৈনিক বোনাস ক্লেইম করেছেন! আগামীকাল আবার চেষ্টা করুন।");
  }

  // 2. Determine streak
  const [lastCheckin] = await db
    .select()
    .from(dailyCheckins)
    .where(eq(dailyCheckins.userId, authUser.id))
    .orderBy(sql`${dailyCheckins.claimedAt} DESC`)
    .limit(1);

  let newStreak = 1;
  if (lastCheckin) {
    const lastDate = new Date(lastCheckin.checkinDate);
    const currDate = new Date(today);
    const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
    if (diffDays === 1) {
      newStreak = (lastCheckin.streakDay % 7) + 1;
    }
  }

  const rewardAmountMinor = 500n; // ৳5.00

  // 3. Fetch wallet
  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, authUser.id))
    .limit(1);

  if (!wallet) {
    throw new NotFoundError("ওয়ালেট পাওয়া যায়নি");
  }

  const newBalanceMinor = wallet.balanceMinor + rewardAmountMinor;
  const newBonusMinor = wallet.bonusBalanceMinor + rewardAmountMinor;
  const newTotalEarnedMinor = wallet.totalEarnedMinor + rewardAmountMinor;

  // Credit wallet
  await db
    .update(wallets)
    .set({
      balanceMinor: newBalanceMinor,
      bonusBalanceMinor: newBonusMinor,
      totalEarnedMinor: newTotalEarnedMinor,
      updatedAt: new Date(),
    })
    .where(eq(wallets.id, wallet.id));

  // Log transaction
  await db.insert(walletTransactions).values({
    walletId: wallet.id,
    userId: authUser.id,
    type: "DAILY_BONUS",
    direction: "CREDIT",
    amountMinor: rewardAmountMinor,
    balanceAfterMinor: newBalanceMinor,
    description: `দৈনিক চেক-ইন বোনাস (দিন #${newStreak})`,
  });

  // Record checkin
  const [checkin] = await db
    .insert(dailyCheckins)
    .values({
      userId: authUser.id,
      checkinDate: today,
      rewardMinor: rewardAmountMinor,
      streakDay: newStreak,
    })
    .returning();

  return c.json(
    apiSuccess({
      message: `অভিনন্দন! আপনি দৈনিক ৳৫ বোনাস পেয়েছেন (দিন #${newStreak})!`,
      reward: serializeMoney(rewardAmountMinor),
      streakDay: newStreak,
      newBalance: serializeMoney(newBalanceMinor),
    })
  );
});

// GET /api/v1/missions/lucky-spin/status
missionsRouter.get("/lucky-spin/status", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const today = getTodayString();

  const [todaySpin] = await db
    .select()
    .from(luckySpins)
    .where(and(eq(luckySpins.userId, authUser.id), eq(luckySpins.spinDate, today)))
    .limit(1);

  return c.json(
    apiSuccess({
      hasSpunToday: !!todaySpin,
      todaySpin: todaySpin ? {
        prizeTitle: todaySpin.prizeTitle,
        reward: serializeMoney(todaySpin.rewardMinor),
      } : null,
    })
  );
});

// POST /api/v1/missions/lucky-spin
missionsRouter.post("/lucky-spin", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const today = getTodayString();

  const [existing] = await db
    .select()
    .from(luckySpins)
    .where(and(eq(luckySpins.userId, authUser.id), eq(luckySpins.spinDate, today)))
    .limit(1);

  if (existing) {
    throw new ConflictError("আপনি আজ ইতোমধ্যে লাকি স্পিন খেলেছেন! আগামীকাল আবার স্পিন করুন।");
  }

  // Spin prize wheel logic
  const prizes = [
    { title: "৳২ ক্যাশ", minor: 200n, weight: 35 },
    { title: "৳৫ বোনাস", minor: 500n, weight: 30 },
    { title: "৳১০ স্পেশাল", minor: 1000n, weight: 20 },
    { title: "৳২০ মেগা", minor: 2000n, weight: 10 },
    { title: "৳৫০ জ্যাকপট", minor: 5000n, weight: 5 },
  ];

  const totalWeight = prizes.reduce((acc, p) => acc + p.weight, 0);
  let randomNum = Math.floor(Math.random() * totalWeight);
  let selectedPrize = prizes[0];

  for (const prize of prizes) {
    if (randomNum < prize.weight) {
      selectedPrize = prize;
      break;
    }
    randomNum -= prize.weight;
  }

  // Credit prize to wallet
  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, authUser.id))
    .limit(1);

  if (!wallet) {
    throw new NotFoundError("ওয়ালেট পাওয়া যায়নি");
  }

  const newBalanceMinor = wallet.balanceMinor + selectedPrize.minor;
  const newTotalEarnedMinor = wallet.totalEarnedMinor + selectedPrize.minor;

  await db
    .update(wallets)
    .set({
      balanceMinor: newBalanceMinor,
      totalEarnedMinor: newTotalEarnedMinor,
      updatedAt: new Date(),
    })
    .where(eq(wallets.id, wallet.id));

  await db.insert(walletTransactions).values({
    walletId: wallet.id,
    userId: authUser.id,
    type: "LUCKY_SPIN",
    direction: "CREDIT",
    amountMinor: selectedPrize.minor,
    balanceAfterMinor: newBalanceMinor,
    description: `লাকি স্পিন পুরস্কার: ${selectedPrize.title}`,
  });

  const [spin] = await db
    .insert(luckySpins)
    .values({
      userId: authUser.id,
      prizeTitle: selectedPrize.title,
      rewardMinor: selectedPrize.minor,
      spinDate: today,
    })
    .returning();

  return c.json(
    apiSuccess({
      message: `দারুণ! লাকি স্পিনে আপনি জিতেছেন "${selectedPrize.title}"!`,
      prizeTitle: selectedPrize.title,
      reward: serializeMoney(selectedPrize.minor),
      newBalance: serializeMoney(newBalanceMinor),
    })
  );
});

const redeemSchema = z.object({
  code: z.string().min(3, "সঠিক গিফট কোড দিন"),
});

// POST /api/v1/missions/gift-code/redeem
missionsRouter.post("/gift-code/redeem", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const body = await c.req.json().catch(() => ({}));
  const validation = redeemSchema.safeParse(body);

  if (!validation.success) {
    const issue = validation.error.issues[0];
    throw new BadRequestError(issue ? issue.message : "ভুল কোড প্রদান করা হয়েছে");
  }

  const cleanCode = validation.data.code.trim().toUpperCase();

  // 1. Find active gift code
  const [giftCode] = await db
    .select()
    .from(giftCodes)
    .where(eq(giftCodes.code, cleanCode))
    .limit(1);

  if (!giftCode || !giftCode.isActive) {
    throw new NotFoundError("গিফট কোডটি সঠিক নয় অথবা নিষ্ক্রিয় করা হয়েছে");
  }

  if (giftCode.usedCount >= giftCode.maxUses) {
    throw new BadRequestError("এই গিফট কোডটির সর্বোচ্চ ব্যবহারের সীমা শেষ হয়ে গেছে");
  }

  if (giftCode.expiresAt && new Date() > new Date(giftCode.expiresAt)) {
    throw new BadRequestError("এই গিফট কোডটির মেয়াদ উত্তীর্ণ হয়েছে");
  }

  // 2. Check if user already redeemed
  const [alreadyRedeemed] = await db
    .select()
    .from(giftCodeRedemptions)
    .where(
      and(
        eq(giftCodeRedemptions.giftCodeId, giftCode.id),
        eq(giftCodeRedemptions.userId, authUser.id)
      )
    )
    .limit(1);

  if (alreadyRedeemed) {
    throw new ConflictError("আপনি ইতোমধ্যে এই গিফট কোডটি রিডিম করেছেন!");
  }

  // 3. Credit wallet
  const [wallet] = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, authUser.id))
    .limit(1);

  if (!wallet) {
    throw new NotFoundError("ওয়ালেট পাওয়া যায়নি");
  }

  const newBalanceMinor = wallet.balanceMinor + giftCode.rewardMinor;
  const newBonusMinor = wallet.bonusBalanceMinor + giftCode.rewardMinor;
  const newTotalEarnedMinor = wallet.totalEarnedMinor + giftCode.rewardMinor;

  await db
    .update(wallets)
    .set({
      balanceMinor: newBalanceMinor,
      bonusBalanceMinor: newBonusMinor,
      totalEarnedMinor: newTotalEarnedMinor,
      updatedAt: new Date(),
    })
    .where(eq(wallets.id, wallet.id));

  // Log transaction
  await db.insert(walletTransactions).values({
    walletId: wallet.id,
    userId: authUser.id,
    type: "GIFT_CODE",
    direction: "CREDIT",
    amountMinor: giftCode.rewardMinor,
    balanceAfterMinor: newBalanceMinor,
    description: `গিফট কোড রিডিম: ${giftCode.code}`,
    referenceId: giftCode.id,
  });

  // Record redemption
  await db.insert(giftCodeRedemptions).values({
    giftCodeId: giftCode.id,
    userId: authUser.id,
    redeemedAmountMinor: giftCode.rewardMinor,
  });

  // Increment used count
  await db
    .update(giftCodes)
    .set({
      usedCount: giftCode.usedCount + 1,
    })
    .where(eq(giftCodes.id, giftCode.id));

  return c.json(
    apiSuccess({
      message: `অভিনন্দন! '${giftCode.code}' গিফট কোড রিডিম করে আপনি ${serializeMoney(giftCode.rewardMinor).formatted} বোনাস পেয়েছেন!`,
      reward: serializeMoney(giftCode.rewardMinor),
      newBalance: serializeMoney(newBalanceMinor),
    })
  );
});
