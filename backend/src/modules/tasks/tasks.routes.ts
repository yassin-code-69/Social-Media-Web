import { Hono } from "hono";
import { z } from "zod";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney } from "@/shared/utils/money";
import { AppEnv } from "@/types/context";

export const tasksRouter = new Hono<AppEnv>();

const defaultTasks = [
  {
    id: "task_yt_1",
    title: "YouTube ভিডিও দেখুন",
    platform: "YOUTUBE",
    rewardMinor: 1000n, // ৳10.00
    action: "২ মিনিট দেখুন ও সাবস্ক্রাইব করুন",
    description: "ভিডিওটি সম্পূর্ণ দেখে লাইক দিন ও চ্যানেল সাবস্ক্রাইব করে স্ক্রিনশট দিন।",
    instructions: [
      "১. 'টাস্ক লিংকে যান' বাটনে ক্লিক করে ইউটিউব ভিডিও ওপেন করুন।",
      "২. ভিডিওটি ন্যূনতম ২ মিনিট রানিং থাকতে হবে।",
      "৩. লাইক ও চ্যানেল সাবস্ক্রাইব করুন।",
      "৪. সাবস্ক্রাইব করা অবস্থার স্পষ্ট স্ক্রিনশট আপলোড করুন।",
    ],
    targetUrl: "https://youtube.com",
    requiredPackage: "ফ্রি / যেকোনো",
    requiresScreenshot: true,
  },
  {
    id: "task_fb_1",
    title: "Facebook পেজ লাইক ও ফলো",
    platform: "FACEBOOK",
    rewardMinor: 800n, // ৳8.00
    action: "লাইক ও ফলো করে স্ক্রিনশট দিন",
    description: "প্রদত্ত ফেসবুক পেজে যান এবং 'Like' ও 'Follow' বাটনে প্রেস করুন।",
    instructions: [
      "১. লিংকে গিয়ে পেজ ভিজিট করুন।",
      "২. Like ও Follow করুন।",
      "৩. Following বাটন দেখা যাচ্ছে এমন অবস্থায় স্ক্রিনশট তুলুন।",
      "৪. স্ক্রিনশট আপলোড করে টাস্ক জমা দিন।",
    ],
    targetUrl: "https://facebook.com",
    requiredPackage: "ফ্রি / যেকোনো",
    requiresScreenshot: true,
  },
  {
    id: "task_tt_1",
    title: "TikTok ভিডিও দেখুন ও লাইক দিন",
    platform: "TIKTOK",
    rewardMinor: 1200n, // ৳12.00
    action: "১টি ভিডিও দেখুন ও লাভ রিঅ্যাক্ট দিন",
    description: "টিকটক ভিডিওটি সম্পূর্ণ দেখে লাইক দিন এবং আইডিতে ফলো দিয়ে স্ক্রিনশট আপলোড করুন।",
    instructions: [
      "১. ভিডিও ওপেন করুন এবং সম্পূর্ণ দেখুন।",
      "২. লাইক বাটনে চাপ দিন।",
      "৩. ফলো দিয়ে প্রুফ স্ক্রিনশট যুক্ত করুন।",
    ],
    targetUrl: "https://tiktok.com",
    requiredPackage: "ফ্রি / যেকোনো",
    requiresScreenshot: true,
  },
  {
    id: "task_web_1",
    title: "ওয়েবসাইট ১ মিনিট ভিজিট করুন",
    platform: "WEBSITE",
    rewardMinor: 500n, // ৳5.00
    action: "আর্টিকেল স্ক্রল করে ১ মিনিট থাকুন",
    description: "ওয়েবসাইটে ভিজিট করে অন্তত ৬০ সেকেন্ড অবস্থান করুন।",
    instructions: [
      "১. ওয়েবসাইট লিংকে ক্লিক করুন।",
      "২. পেজে ন্যূনতম ৬০ সেকেন্ড অপেক্ষা করুন।",
      "৩. স্ক্রিনের টাইমসহ একটি স্ক্রিনশট জমা দিন।",
    ],
    targetUrl: "https://google.com",
    requiredPackage: "ফ্রি / যেকোনো",
    requiresScreenshot: true,
  },
];

tasksRouter.get("/", async (c) => {
  const platform = c.req.query("platform");

  let list = defaultTasks;
  if (platform && platform !== "ALL") {
    list = list.filter((t) => t.platform.toLowerCase() === platform.toLowerCase());
  }

  const formatted = list.map((t) => ({
    ...t,
    reward: serializeMoney(t.rewardMinor),
  }));

  return c.json(apiSuccess(formatted));
});

tasksRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const task = defaultTasks.find((t) => t.id === id) || defaultTasks[0];

  return c.json(
    apiSuccess({
      ...task,
      reward: serializeMoney(task.rewardMinor),
    })
  );
});

const submissionSchema = z.object({
  screenshotUrl: z.string().url("সঠিক ইমেজ ইউআরএল প্রদান করুন"),
  userNote: z.string().optional(),
});

tasksRouter.post("/:id/submit", requireAuth, async (c) => {
  const user = c.get("user")!;
  const taskId = c.req.param("id");
  const body = await c.req.json();
  const data = submissionSchema.parse(body);

  const task = defaultTasks.find((t) => t.id === taskId);

  return c.json(
    apiSuccess(
      {
        submissionId: `sub_${Date.now()}`,
        taskId,
        taskTitle: task?.title || taskId,
        userId: user.id,
        reward: task ? serializeMoney(task.rewardMinor) : null,
        screenshotUrl: data.screenshotUrl,
        userNote: data.userNote,
        status: "PENDING",
        submittedAt: new Date().toISOString(),
        message: "টাস্ক প্রুফ সফলভাবে জমা হয়েছে। অ্যাডমিন পর্যালোচনার পর রিওয়ার্ড যুক্ত হবে।",
      },
      { statusCode: 201 }
    ),
    201
  );
});
