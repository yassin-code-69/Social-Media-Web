import { Hono } from "hono";
import { z } from "zod";
import { eq, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { profiles, wallets, referrals, userPackages, packages } from "@/db/schema";
import { supabaseAdmin, supabaseClient } from "@/lib/supabase";
import { apiSuccess } from "@/shared/responses/api-response";
import { BadRequestError, ConflictError, UnauthorizedError, NotFoundError } from "@/shared/errors/app-error";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney } from "@/shared/utils/money";
import { AppEnv } from "@/types/context";
import { logger } from "@/lib/logger";

export const authRouter = new Hono<AppEnv>();

// Generate unique referral code (e.g. DIGI7894)
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "DIGI";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

const registerSchema = z.object({
  displayName: z.string().min(2, "নাম অবশ্যই কমপক্ষে ২ অক্ষরের হতে হবে").max(100),
  phone: z.string().min(11, "সঠিক ১১ ডিজিটের ফোন নম্বর দিন").max(15),
  email: z.string().email("সঠিক ইমেইল ঠিকানা দিন"),
  password: z.string().min(6, "পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে"),
  referralCode: z.string().optional().nullable(),
});

const loginSchema = z.object({
  identifier: z.string().min(3, "ইমেইল বা ফোন নম্বর দিন"),
  password: z.string().min(6, "পাসওয়ার্ড দিন"),
});

// POST /api/v1/auth/register
authRouter.post("/register", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const validation = registerSchema.safeParse(body);

  if (!validation.success) {
    const issue = validation.error.issues[0];
    throw new BadRequestError(issue ? issue.message : "ভুল তথ্য প্রদান করা হয়েছে");
  }

  const { displayName, phone, email, password, referralCode } = validation.data;
  const cleanPhone = phone.trim().replace(/\s+/g, "");
  const cleanEmail = email.trim().toLowerCase();

  // 1. Check if email or phone already exists in DB
  const existingUser = await db
    .select({ id: profiles.id, email: profiles.email, phone: profiles.phone })
    .from(profiles)
    .where(or(eq(profiles.email, cleanEmail), eq(profiles.phone, cleanPhone)))
    .limit(1);

  if (existingUser.length > 0) {
    if (existingUser[0].email === cleanEmail) {
      throw new ConflictError("এই ইমেইল দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে");
    }
    if (existingUser[0].phone === cleanPhone) {
      throw new ConflictError("এই ফোন নম্বর দিয়ে ইতোমধ্যে একটি অ্যাকাউন্ট রয়েছে");
    }
  }

  // 2. Resolve referrer if referral code is provided
  let referrerId: string | null = null;
  if (referralCode && referralCode.trim()) {
    const cleanRefCode = referralCode.trim().toUpperCase();
    const referrer = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.referralCode, cleanRefCode))
      .limit(1);

    if (referrer.length > 0) {
      referrerId = referrer[0].id;
    }
  }

  // 3. Create Supabase Auth user
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: cleanEmail,
    password,
    email_confirm: true,
    user_metadata: {
      display_name: displayName,
      phone: cleanPhone,
      role: "USER",
    },
  });

  if (authError || !authData.user) {
    logger.error("Supabase createUser failed", authError);
    throw new BadRequestError(authError?.message || "ব্যবহারকারী তৈরিতে সমস্যা হয়েছে");
  }

  const authUserId = authData.user.id;

  // 4. Generate unique referral code
  let newReferralCode = generateReferralCode();
  let attempts = 0;
  while (attempts < 5) {
    const codeCheck = await db
      .select({ id: profiles.id })
      .from(profiles)
      .where(eq(profiles.referralCode, newReferralCode))
      .limit(1);
    if (codeCheck.length === 0) break;
    newReferralCode = generateReferralCode();
    attempts++;
  }

  try {
    // 5. Insert profile
    const [newProfile] = await db
      .insert(profiles)
      .values({
        id: authUserId,
        displayName,
        phone: cleanPhone,
        email: cleanEmail,
        role: "USER",
        status: "ACTIVE",
        referralCode: newReferralCode,
        referredById: referrerId,
      })
      .returning();

    // 6. Insert wallet
    const [newWallet] = await db
      .insert(wallets)
      .values({
        userId: authUserId,
        balanceMinor: 0n,
        pendingBalanceMinor: 0n,
        bonusBalanceMinor: 0n,
        totalEarnedMinor: 0n,
        totalWithdrawnMinor: 0n,
        currency: "BDT",
      })
      .returning();

    // 7. Insert referral record if referred
    if (referrerId) {
      await db.insert(referrals).values({
        referrerId,
        referredId: authUserId,
        rewardPaidMinor: 0n,
      });
    }

    // 8. Sign in user to obtain session tokens
    const { data: loginSession, error: loginErr } = await supabaseClient.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    return c.json(
      apiSuccess({
        message: "অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!",
        user: {
          id: newProfile.id,
          displayName: newProfile.displayName,
          email: newProfile.email,
          phone: newProfile.phone,
          role: newProfile.role,
          referralCode: newProfile.referralCode,
        },
        wallet: {
          balance: serializeMoney(newWallet.balanceMinor),
          pendingBalance: serializeMoney(newWallet.pendingBalanceMinor),
          bonusBalance: serializeMoney(newWallet.bonusBalanceMinor),
        },
        session: loginSession?.session || null,
      }),
      201
    );
  } catch (err: any) {
    logger.error("Profile/Wallet creation failed during registration", err);
    // Cleanup auth user on failure
    await supabaseAdmin.auth.admin.deleteUser(authUserId).catch(() => {});
    throw new BadRequestError("অ্যাকাউন্ট সংরক্ষণে সমস্যা হয়েছে, অনুগ্রহ করে পুনরায় চেষ্টা করুন");
  }
});

// POST /api/v1/auth/login
authRouter.post("/login", async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const validation = loginSchema.safeParse(body);

  if (!validation.success) {
    const issue = validation.error.issues[0];
    throw new BadRequestError(issue ? issue.message : "ভুল তথ্য প্রদান করা হয়েছে");
  }

  const { identifier, password } = validation.data;
  let targetEmail = identifier.trim().toLowerCase();

  // If not email format, search by phone
  if (!targetEmail.includes("@")) {
    const cleanPhone = identifier.trim().replace(/\s+/g, "");
    const userByPhone = await db
      .select({ email: profiles.email })
      .from(profiles)
      .where(eq(profiles.phone, cleanPhone))
      .limit(1);

    if (userByPhone.length === 0) {
      throw new UnauthorizedError("ফোন নম্বর বা পাসওয়ার্ড সঠিক নয়");
    }
    targetEmail = userByPhone[0].email;
  }

  // Sign in via Supabase Auth
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: targetEmail,
    password,
  });

  if (error || !data.user || !data.session) {
    logger.warn("Login authentication failed", error);
    throw new UnauthorizedError("ইমেইল/ফোন অথবা পাসওয়ার্ড সঠিক নয়");
  }

  // Fetch profile
  const userProfile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, data.user.id))
    .limit(1);

  if (userProfile.length === 0) {
    throw new NotFoundError("ব্যবহারকারীর প্রোফাইল খুঁজে পাওয়া যায়নি");
  }

  const profile = userProfile[0];
  if (profile.status === "BLOCKED" || profile.status === "SUSPENDED") {
    throw new UnauthorizedError("আপনার অ্যাকাউন্ট সাময়িকভাবে স্থগিত বা বন্ধ রয়েছে। সাপোর্টে যোগাযোগ করুন।");
  }

  // Fetch or create wallet
  let userWallet = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, profile.id))
    .limit(1);

  if (userWallet.length === 0) {
    const [createdWallet] = await db
      .insert(wallets)
      .values({
        userId: profile.id,
        balanceMinor: 0n,
        pendingBalanceMinor: 0n,
        bonusBalanceMinor: 0n,
      })
      .returning();
    userWallet = [createdWallet];
  }

  const currentWallet = userWallet[0];

  return c.json(
    apiSuccess({
      message: "লগইন সফল হয়েছে!",
      user: {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        avatarUrl: profile.avatarUrl,
        referralCode: profile.referralCode,
      },
      wallet: {
        balance: serializeMoney(currentWallet.balanceMinor),
        pendingBalance: serializeMoney(currentWallet.pendingBalanceMinor),
        bonusBalance: serializeMoney(currentWallet.bonusBalanceMinor),
        totalEarned: serializeMoney(currentWallet.totalEarnedMinor),
        totalWithdrawn: serializeMoney(currentWallet.totalWithdrawnMinor),
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
        token_type: data.session.token_type,
      },
    })
  );
});

// GET /api/v1/auth/me
authRouter.get("/me", requireAuth, async (c) => {
  const authUser = c.get("user")!;

  const userProfile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, authUser.id))
    .limit(1);

  if (userProfile.length === 0) {
    throw new NotFoundError("প্রোফাইল খুঁজে পাওয়া যায়নি");
  }

  const profile = userProfile[0];

  // Fetch wallet
  let userWallet = await db
    .select()
    .from(wallets)
    .where(eq(wallets.userId, profile.id))
    .limit(1);

  let wallet = userWallet[0];
  if (!wallet) {
    const [created] = await db
      .insert(wallets)
      .values({ userId: profile.id })
      .returning();
    wallet = created;
  }

  // Fetch active package if any
  const activePkg = await db
    .select({
      id: packages.id,
      name: packages.name,
      dailyTaskLimit: packages.dailyTaskLimit,
      dailyRewardLimitMinor: packages.dailyRewardLimitMinor,
      referralBonusPercent: packages.referralBonusPercent,
      expiresAt: userPackages.expiresAt,
    })
    .from(userPackages)
    .innerJoin(packages, eq(userPackages.packageId, packages.id))
    .where(eq(userPackages.userId, profile.id))
    .limit(1);

  // Count direct referrals
  const directRefs = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(referrals)
    .where(eq(referrals.referrerId, profile.id));

  const totalReferrals = directRefs[0]?.count || 0;

  return c.json(
    apiSuccess({
      user: {
        id: profile.id,
        displayName: profile.displayName,
        email: profile.email,
        phone: profile.phone,
        role: profile.role,
        avatarUrl: profile.avatarUrl,
        referralCode: profile.referralCode,
        createdAt: profile.createdAt,
      },
      wallet: {
        balance: serializeMoney(wallet.balanceMinor),
        pendingBalance: serializeMoney(wallet.pendingBalanceMinor),
        bonusBalance: serializeMoney(wallet.bonusBalanceMinor),
        totalEarned: serializeMoney(wallet.totalEarnedMinor),
        totalWithdrawn: serializeMoney(wallet.totalWithdrawnMinor),
      },
      activePackage: activePkg.length > 0 ? {
        ...activePkg[0],
        dailyRewardLimit: serializeMoney(activePkg[0].dailyRewardLimitMinor),
      } : null,
      team: {
        directReferrals: totalReferrals,
      },
    })
  );
});

// POST /api/v1/auth/logout
authRouter.post("/logout", async (c) => {
  const authHeader = c.req.header("Authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    // Revoke Supabase token
    await supabaseAdmin.auth.admin.signOut(token).catch(() => {});
  }
  return c.json(apiSuccess({ message: "লগআউট সফল হয়েছে" }));
});
