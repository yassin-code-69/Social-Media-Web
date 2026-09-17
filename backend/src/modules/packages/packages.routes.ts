import { Hono } from "hono";
import { z } from "zod";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney } from "@/shared/utils/money";
import { AppEnv } from "@/types/context";

export const packagesRouter = new Hono<AppEnv>();

// Static fallback seed for local development / initial state
const defaultPackages = [
  {
    id: "pkg_free",
    name: "ফ্রি ট্রায়াল",
    priceMinor: 0n,
    validityDays: 7,
    dailyTaskLimit: 2,
    dailyRewardLimitMinor: 2000n, // ৳20.00
    referralBonusPercent: 5,
    colorGradient: "from-slate-500 to-slate-700",
    features: ["দৈনিক ২টি টাস্ক", "২৪ ঘণ্টার মধ্যে উইথড্র", "বেসিক সাপোর্ট", "৭ দিন মেয়াদ"],
  },
  {
    id: "pkg_bronze",
    name: "ব্রোঞ্জ প্যাকেজ",
    priceMinor: 50000n, // ৳500.00
    validityDays: 30,
    dailyTaskLimit: 5,
    dailyRewardLimitMinor: 6000n, // ৳60.00
    referralBonusPercent: 10,
    colorGradient: "from-amber-700 to-amber-900",
    features: ["দৈনিক ৫টি টাস্ক", "দ্রুত সাপোর্ট", "রেফারেল কমিশন", "৩০ দিন মেয়াদ"],
  },
  {
    id: "pkg_silver",
    name: "সিলভার প্যাকেজ",
    priceMinor: 100000n, // ৳1,000.00
    validityDays: 30,
    dailyTaskLimit: 10,
    dailyRewardLimitMinor: 14000n, // ৳140.00
    referralBonusPercent: 15,
    colorGradient: "from-slate-400 to-slate-600",
    features: ["দৈনিক ১০টি টাস্ক", "অগ্রাধিকার উইথড্রয়াল", "উচ্চ আয়ের কাজ", "৩০ দিন মেয়াদ"],
  },
  {
    id: "pkg_gold",
    name: "গোল্ড প্যাকেজ",
    priceMinor: 200000n, // ৳2,000.00
    validityDays: 45,
    dailyTaskLimit: 20,
    dailyRewardLimitMinor: 30000n, // ৳300.00
    referralBonusPercent: 20,
    isPopular: true,
    colorGradient: "from-amber-500 to-yellow-600",
    features: ["দৈনিক ২০টি টাস্ক", "ইনস্ট্যান্ট পেমেন্ট রিকোয়েস্ট", "ভিআইপি ব্যাজ ও বোনাস", "৪৫ দিন মেয়াদ"],
  },
  {
    id: "pkg_platinum",
    name: "প্লাটিনাম প্যাকেজ",
    priceMinor: 500000n, // ৳5,000.00
    validityDays: 60,
    dailyTaskLimit: 45,
    dailyRewardLimitMinor: 75000n, // ৳750.00
    referralBonusPercent: 25,
    colorGradient: "from-emerald-600 to-teal-800",
    features: ["দৈনিক ৪৫টি টাস্ক", "প্রিমিয়াম সার্ভে ও ভিডিও", "সর্বোচ্চ রেফারেল বেনিফিট", "৬০ দিন মেয়াদ"],
  },
];

packagesRouter.get("/", async (c) => {
  const formatted = defaultPackages.map((p) => ({
    ...p,
    price: serializeMoney(p.priceMinor),
    dailyRewardLimit: serializeMoney(p.dailyRewardLimitMinor),
  }));

  return c.json(apiSuccess(formatted));
});

packagesRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const pkg = defaultPackages.find((p) => p.id === id) || defaultPackages[0];

  return c.json(
    apiSuccess({
      ...pkg,
      price: serializeMoney(pkg.priceMinor),
      dailyRewardLimit: serializeMoney(pkg.dailyRewardLimitMinor),
    })
  );
});

const purchaseSchema = z.object({
  packageId: z.string().min(1),
  paymentMethod: z.enum(["bKash", "Nagad", "Rocket"]),
  senderNumber: z.string().min(11),
  transactionId: z.string().min(4),
});

packagesRouter.post("/purchase", requireAuth, async (c) => {
  const user = c.get("user")!;
  const body = await c.req.json();
  const data = purchaseSchema.parse(body);

  const pkg = defaultPackages.find((p) => p.id === data.packageId);

  return c.json(
    apiSuccess(
      {
        purchaseId: `pur_${Date.now()}`,
        userId: user.id,
        packageName: pkg?.name || data.packageId,
        paymentMethod: data.paymentMethod,
        transactionId: data.transactionId,
        status: "PENDING",
        message: "প্যাকেজ কেনার অনুরোধ গৃহীত হয়েছে, যাচাইয়ের পর সক্রিয় হবে।",
      },
      { statusCode: 201 }
    ),
    201
  );
});
