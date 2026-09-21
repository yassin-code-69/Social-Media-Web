import { db } from "@/lib/db";
import {
  packages,
  paymentMethods,
  icashPlans,
  giftCodes,
  tasks,
} from "@/db/schema";
import { logger } from "@/lib/logger";

export async function seedDatabase() {
  logger.info("🌱 Starting database seeding...");

  // 1. Seed Packages (দিগন্ত স্তর প্যাকেজসমূহ)
  const existingPackages = await db.select().from(packages);
  if (existingPackages.length === 0) {
    logger.info("📦 Seeding Packages...");
    await db.insert(packages).values([
      {
        name: "ফ্রি মেম্বার (Free)",
        priceMinor: 0n,
        validityDays: 365,
        dailyTaskLimit: 5,
        dailyRewardLimitMinor: 5000n, // ৳50
        referralBonusPercent: 5,
        colorGradient: "from-slate-600 to-slate-800",
        isPopular: false,
        features: ["দৈনিক ৫টি টাস্ক", "স্ট্যান্ডার্ড সাপোর্ট", "ন্যূনতম উত্তোলন ৳১০০"],
        status: "ACTIVE",
      },
      {
        name: "বেসিক প্যাকেজ (Basic)",
        priceMinor: 50000n, // ৳500
        validityDays: 60,
        dailyTaskLimit: 15,
        dailyRewardLimitMinor: 15000n, // ৳150
        referralBonusPercent: 8,
        colorGradient: "from-blue-600 to-cyan-700",
        isPopular: false,
        features: ["দৈনিক ১৫টি টাস্ক", "দ্রুত সাপোর্ট", "ন্যূনতম উত্তোলন ৳৫০", "৮% রেফারেল কমিশন"],
        status: "ACTIVE",
      },
      {
        name: "স্ট্যান্ডার্ড প্যাকেজ (Standard)",
        priceMinor: 120000n, // ৳1,200
        validityDays: 90,
        dailyTaskLimit: 30,
        dailyRewardLimitMinor: 35000n, // ৳350
        referralBonusPercent: 10,
        colorGradient: "from-emerald-600 to-teal-800",
        isPopular: true,
        features: ["দৈনিক ৩০টি টাস্ক", "ভিআইপি টাস্ক অ্যাক্সেস", "১০% রেফারেল কমিশন", "ইনস্ট্যান্ট উইথড্র"],
        status: "ACTIVE",
      },
      {
        name: "প্রিমিয়াম প্যাকেজ (Premium)",
        priceMinor: 300000n, // ৳3,000
        validityDays: 180,
        dailyTaskLimit: 60,
        dailyRewardLimitMinor: 80000n, // ৳800
        referralBonusPercent: 12,
        colorGradient: "from-purple-600 to-indigo-800",
        isPopular: false,
        features: ["দৈনিক ৬০টি টাস্ক", "উচ্চ আয়ের বিশেষ জব", "১২% রেফারেল কমিশন", "মাসিক স্যালারি পাওয়ার যোগ্যতা"],
        status: "ACTIVE",
      },
      {
        name: "ভিআইপি প্যাকেজ (VIP)",
        priceMinor: 600000n, // ৳6,000
        validityDays: 365,
        dailyTaskLimit: 120,
        dailyRewardLimitMinor: 200000n, // ৳2,000
        referralBonusPercent: 15,
        colorGradient: "from-amber-500 to-orange-700",
        isPopular: false,
        features: ["আনলিমিটেড স্পেশাল টাস্ক", "সর্বোচ্চ আয়ের নিশ্চয়তা", "১৫% রেফারেল কমিশন", "ব্যক্তিগত অ্যাকাউন্ট ম্যানেজার"],
        status: "ACTIVE",
      },
    ]);
  }

  // 2. Seed Payment Methods (বিকাশ, নগদ, রকেট)
  const existingPM = await db.select().from(paymentMethods);
  if (existingPM.length === 0) {
    logger.info("💳 Seeding Payment Methods...");
    await db.insert(paymentMethods).values([
      {
        name: "bKash",
        accountType: "Merchant",
        accountNumber: "01755123456",
        isActive: true,
        instructions: "বিকাশ অ্যাপ থেকে 'Make Payment' বা 'Send Money' করুন এবং TrxID নিচে লিখুন।",
      },
      {
        name: "Nagad",
        accountType: "Personal",
        accountNumber: "01855123456",
        isActive: true,
        instructions: "নগদ অ্যাপ বা *167# ডায়াল করে 'Send Money' করুন এবং ট্রানজেকশন আইডি দিন।",
      },
      {
        name: "Rocket",
        accountType: "Personal",
        accountNumber: "019551234567",
        isActive: true,
        instructions: "রকেট একাউন্ট থেকে 'Send Money' করে ১২ ডিজিটের ট্রানজেকশন আইডি লিখুন।",
      },
    ]);
  }

  // 3. Seed I Cash Plans (1, 2, 5, 10 Years)
  const existingIcash = await db.select().from(icashPlans);
  if (existingIcash.length === 0) {
    logger.info("📈 Seeding I Cash Plans...");
    await db.insert(icashPlans).values([
      {
        id: "1yr",
        title: "১ বছর মেয়াদী প্ল্যান",
        years: 1,
        profitPercent: 15,
        minDepositMinor: 50000n, // ৳500
        maxDepositMinor: 5000000n, // ৳50,000
        popular: "জনপ্রিয়",
      },
      {
        id: "2yr",
        title: "২ বছর মেয়াদী প্ল্যান",
        years: 2,
        profitPercent: 20,
        minDepositMinor: 100000n, // ৳1,000
        maxDepositMinor: 10000000n, // ৳1,00,000
        popular: null,
      },
      {
        id: "5yr",
        title: "৫ বছর মেয়াদী প্ল্যান",
        years: 5,
        profitPercent: 25,
        minDepositMinor: 200000n, // ৳2,000
        maxDepositMinor: 20000000n, // ৳2,00,000
        popular: "সেরা মুনাফা",
      },
      {
        id: "10yr",
        title: "১০ বছর মেয়াদী প্ল্যান",
        years: 10,
        profitPercent: 35,
        minDepositMinor: 500000n, // ৳5,000
        maxDepositMinor: 50000000n, // ৳5,00,000
        popular: "দীর্ঘমেয়াদী ডাবল",
      },
    ]);
  }

  // 4. Seed Promo Gift Codes
  const existingCodes = await db.select().from(giftCodes);
  if (existingCodes.length === 0) {
    logger.info("🎁 Seeding Gift Codes...");
    await db.insert(giftCodes).values([
      {
        code: "DIGONTO",
        rewardMinor: 2000n, // ৳20
        maxUses: 5000,
        usedCount: 0,
        isActive: true,
      },
      {
        code: "BONUS20",
        rewardMinor: 2000n, // ৳20
        maxUses: 2000,
        usedCount: 0,
        isActive: true,
      },
      {
        code: "WELCOME",
        rewardMinor: 1000n, // ৳10
        maxUses: 10000,
        usedCount: 0,
        isActive: true,
      },
    ]);
  }

  // 5. Seed Tasks
  const existingTasks = await db.select().from(tasks);
  if (existingTasks.length === 0) {
    logger.info("📋 Seeding Micro Tasks...");
    await db.insert(tasks).values([
      {
        title: "YouTube ভিডিও দেখুন ও সাবস্ক্রাইব করুন",
        description: "ভিডিওটি সম্পূর্ণ দেখে লাইক দিন ও চ্যানেল সাবস্ক্রাইব করে স্ক্রিনশট আপলোড করুন।",
        platform: "YOUTUBE",
        action: "ভিডিও দেখুন ও সাবস্ক্রাইব করুন",
        rewardMinor: 1000n, // ৳10
        targetUrl: "https://youtube.com",
        instructions: [
          "১. ভিডিওটি সম্পূর্ণ ২ মিনিট দেখুন।",
          "২. লাইক ও সাবস্ক্রাইব করুন।",
          "৩. সাবস্ক্রাইব করা অবস্থার স্ক্রিনশট আপলোড করুন।",
        ],
        requiredPackage: "ANY",
        requiresScreenshot: true,
        dailyLimit: 500,
        status: "ACTIVE",
      },
      {
        title: "Facebook পেজ লাইক ও ফলো করুন",
        description: "প্রদত্ত ফেসবুক পেজে যান এবং 'Like' ও 'Follow' বাটনে প্রেস করে স্ক্রিনশট নিন।",
        platform: "FACEBOOK",
        action: "পেজ লাইক ও ফলো",
        rewardMinor: 800n, // ৳8
        targetUrl: "https://facebook.com",
        instructions: [
          "১. লিংকে গিয়ে ফেসবুক পেজ ভিজিট করুন।",
          "২. লাইক ও ফলো দিন।",
          "৩. Following বাটন দেখা যাচ্ছে এমন অবস্থায় স্ক্রিনশট দিন।",
        ],
        requiredPackage: "ANY",
        requiresScreenshot: true,
        dailyLimit: 1000,
        status: "ACTIVE",
      },
      {
        title: "TikTok ভিডিও দেখুন ও লাইক দিন",
        description: "টিকটক ভিডিওটি সম্পূর্ণ দেখে লাইক দিন এবং আইডিতে ফলো দিয়ে স্ক্রিনশট দিন।",
        platform: "TIKTOK",
        action: "ভিডিও লাইক ও ফলো",
        rewardMinor: 1200n, // ৳12
        targetUrl: "https://tiktok.com",
        instructions: [
          "১. ভিডিও সম্পূর্ণ দেখুন।",
          "২. লাইক ও ফলো দিন।",
          "৩. স্ক্রিনশট আপলোড করে টাস্ক জমা দিন।",
        ],
        requiredPackage: "ANY",
        requiresScreenshot: true,
        dailyLimit: 300,
        status: "ACTIVE",
      },
      {
        title: "ওয়েবসাইট ভিজিট ও আর্টিকেল পড়ুন",
        description: "ওয়েবসাইটে গিয়ে ১ মিনিট অবস্থান করুন এবং বিজ্ঞাপনে ক্লিক করে স্ক্রিনশট দিন।",
        platform: "WEBSITE",
        action: "ওয়েবসাইট ভিজিট",
        rewardMinor: 1500n, // ৳15
        targetUrl: "https://google.com",
        instructions: [
          "১. ওয়েবসাইট ওপেন করে ১ মিনিট স্ক্রল করুন।",
          "২. যেকোনো একটি বিজ্ঞাপনে ক্লিক করুন।",
          "৩. ব্রাউজারের ইউআরএল সহ স্ক্রিনশট নিন।",
        ],
        requiredPackage: "ANY",
        requiresScreenshot: true,
        dailyLimit: 400,
        status: "ACTIVE",
      },
    ]);
  }

  logger.info("✅ Database seeding completed successfully!");
}

// Run directly if invoked from CLI
if (import.meta.main) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      logger.error("Seeding failed:", err);
      process.exit(1);
    });
}
