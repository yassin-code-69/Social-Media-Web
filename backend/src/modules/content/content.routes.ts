import { Hono } from "hono";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { contentSubmissions } from "@/db/schema";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney } from "@/shared/utils/money";
import { BadRequestError } from "@/shared/errors/app-error";
import { AppEnv } from "@/types/context";

export const contentRouter = new Hono<AppEnv>();

const submitContentSchema = z.object({
  type: z.enum(["ARTICLE", "VIDEO"]),
  title: z.string().min(5, "শিরোনাম অন্তত ৫ অক্ষরের হতে হবে").max(255),
  contentBody: z.string().optional(),
  mediaUrl: z.string().url("সঠিক ভিডিও ইউআরএল দিন").optional().or(z.literal("")),
});

// GET /api/v1/content/guidelines - Content rules and rewards
contentRouter.get("/guidelines", async (c) => {
  return c.json(
    apiSuccess({
      article: {
        minWords: 300,
        rewardRange: "৳৫০ - ৳৫০০",
        rules: [
          "আর্টিকেল সম্পূর্ণ মৌলিক হতে হবে, কোনো কপি-পেস্ট গ্রহণযোগ্য নয়।",
          "সোশ্যাল মিডিয়া আর্নিং, অনলাইন ক্যারিয়ার বা তথ্যপ্রযুক্তি সম্পর্কিত হতে হবে।",
          "বানান ও ব্যাকরণ নির্ভুল হতে হবে।",
        ],
      },
      video: {
        platforms: ["YouTube", "Facebook", "TikTok"],
        rewardRange: "৳১০০ - ৳২,০০০",
        rules: [
          "আমাদের প্ল্যাটফর্ম ও কাজের বিবরণ সুন্দরভাবে ভিডিওতে উপস্থাপন করতে হবে।",
          "ভিডিওর ডেসক্রিপশনে আপনার রেফারেল লিংক যুক্ত থাকতে হবে।",
          "ভিডিও অবশ্যই পাবলিক মোডে থাকতে হবে।",
        ],
      },
    })
  );
});

// GET /api/v1/content/my-submissions - User's submission history
contentRouter.get("/my-submissions", requireAuth, async (c) => {
  const authUser = c.get("user")!;

  const submissions = await db
    .select()
    .from(contentSubmissions)
    .where(eq(contentSubmissions.userId, authUser.id))
    .orderBy(sql`${contentSubmissions.submittedAt} DESC`);

  const formatted = submissions.map((sub) => ({
    id: sub.id,
    type: sub.type,
    title: sub.title,
    wordCount: sub.wordCount,
    mediaUrl: sub.mediaUrl,
    reward: serializeMoney(sub.rewardMinor),
    status: sub.status,
    adminFeedback: sub.adminFeedback,
    submittedAt: sub.submittedAt,
    reviewedAt: sub.reviewedAt,
  }));

  return c.json(apiSuccess(formatted));
});

// POST /api/v1/content/submit - Submit article or video
contentRouter.post("/submit", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const body = await c.req.json().catch(() => ({}));
  const validation = submitContentSchema.safeParse(body);

  if (!validation.success) {
    const issue = validation.error.issues[0];
    throw new BadRequestError(issue ? issue.message : "ভুল তথ্য প্রদান করা হয়েছে");
  }

  const { type, title, contentBody, mediaUrl } = validation.data;

  let wordCount = 0;
  if (type === "ARTICLE") {
    if (!contentBody || contentBody.trim().length < 100) {
      throw new BadRequestError("আর্টিকেলের মূল বক্তব্য কমপক্ষে ১০০ অক্ষরের হতে হবে");
    }
    wordCount = contentBody.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < 50) {
      throw new BadRequestError("আর্টিকেলে ন্যূনতম ৫০টি শব্দ থাকতে হবে");
    }
  } else if (type === "VIDEO") {
    if (!mediaUrl || !mediaUrl.trim()) {
      throw new BadRequestError("ভিডিও লিংক দেওয়া আবশ্যক");
    }
  }

  const [submission] = await db
    .insert(contentSubmissions)
    .values({
      userId: authUser.id,
      type,
      title: title.trim(),
      contentBody: contentBody || null,
      mediaUrl: mediaUrl || null,
      wordCount,
      rewardMinor: 0n,
      status: "PENDING",
    })
    .returning();

  return c.json(
    apiSuccess({
      message: `${type === "ARTICLE" ? "আর্টিকেল" : "ভিডিও"} সফলভাবে পর্যালোচনার জন্য জমা দেওয়া হয়েছে! অ্যাডমিন অনুমোদন করার পর রিওয়ার্ড আপনার ওয়ালেটে জমা হবে।`,
      submission: {
        id: submission.id,
        title: submission.title,
        type: submission.type,
        status: submission.status,
        submittedAt: submission.submittedAt,
      },
    }),
    201
  );
});
