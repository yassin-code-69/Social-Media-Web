import { Hono } from "hono";
import { z } from "zod";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { tasks, taskSubmissions } from "@/db/schema";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { serializeMoney } from "@/shared/utils/money";
import { BadRequestError, NotFoundError } from "@/shared/errors/app-error";
import { AppEnv } from "@/types/context";

export const tasksRouter = new Hono<AppEnv>();

// GET /api/v1/tasks - Get all active tasks
tasksRouter.get("/", async (c) => {
  const platform = c.req.query("platform");

  const query = db
    .select()
    .from(tasks)
    .where(eq(tasks.status, "ACTIVE"));

  const allTasks = await query;

  let filtered = allTasks;
  if (platform && platform !== "ALL") {
    filtered = allTasks.filter((t) => t.platform.toUpperCase() === platform.toUpperCase());
  }

  const formatted = filtered.map((t) => ({
    id: t.id,
    title: t.title,
    platform: t.platform,
    rewardMinor: t.rewardMinor.toString(),
    reward: serializeMoney(t.rewardMinor),
    action: t.action,
    description: t.description,
    instructions: t.instructions,
    targetUrl: t.targetUrl,
    requiredPackage: t.requiredPackage,
    requiresScreenshot: t.requiresScreenshot,
    dailyLimit: t.dailyLimit,
    status: t.status,
  }));

  return c.json(apiSuccess(formatted));
});

// GET /api/v1/tasks/my-submissions - User's task submissions history
tasksRouter.get("/my-submissions", requireAuth, async (c) => {
  const authUser = c.get("user")!;

  const submissions = await db
    .select({
      id: taskSubmissions.id,
      taskId: taskSubmissions.taskId,
      taskTitle: tasks.title,
      platform: tasks.platform,
      rewardMinor: taskSubmissions.rewardMinor,
      screenshotUrl: taskSubmissions.screenshotUrl,
      userNote: taskSubmissions.userNote,
      status: taskSubmissions.status,
      rejectionReason: taskSubmissions.rejectionReason,
      submittedAt: taskSubmissions.submittedAt,
      reviewedAt: taskSubmissions.reviewedAt,
    })
    .from(taskSubmissions)
    .innerJoin(tasks, eq(taskSubmissions.taskId, tasks.id))
    .where(eq(taskSubmissions.userId, authUser.id))
    .orderBy(sql`${taskSubmissions.submittedAt} DESC`);

  const formatted = submissions.map((s) => ({
    ...s,
    reward: serializeMoney(s.rewardMinor),
  }));

  return c.json(apiSuccess(formatted));
});

// GET /api/v1/tasks/:id - Get task detail
tasksRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const [task] = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, id))
    .limit(1);

  if (!task) {
    throw new NotFoundError("টাস্কটি খুঁজে পাওয়া যায়নি");
  }

  return c.json(
    apiSuccess({
      id: task.id,
      title: task.title,
      platform: task.platform,
      rewardMinor: task.rewardMinor.toString(),
      reward: serializeMoney(task.rewardMinor),
      action: task.action,
      description: task.description,
      instructions: task.instructions,
      targetUrl: task.targetUrl,
      requiredPackage: task.requiredPackage,
      requiresScreenshot: task.requiresScreenshot,
      dailyLimit: task.dailyLimit,
      status: task.status,
    })
  );
});

const submissionSchema = z.object({
  screenshotUrl: z.string().url("সঠিক ইমেজ ইউআরএল প্রদান করুন"),
  userNote: z.string().optional(),
});

// POST /api/v1/tasks/:id/submit - Submit task proof
tasksRouter.post("/:id/submit", requireAuth, async (c) => {
  const authUser = c.get("user")!;
  const taskId = c.req.param("id");
  if (!taskId) {
    throw new BadRequestError("টাস্ক আইডি আবশ্যক");
  }
  const body = await c.req.json().catch(() => ({}));
  const validation = submissionSchema.safeParse(body);

  if (!validation.success) {
    const issue = validation.error.issues[0];
    throw new BadRequestError(issue ? issue.message : "ভুল প্রুফ তথ্য দেওয়া হয়েছে");
  }

  const { screenshotUrl, userNote } = validation.data;

  // 1. Fetch task
  const [task] = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, taskId))
    .limit(1);

  if (!task) {
    throw new NotFoundError("টাস্কটি খুঁজে পাওয়া যায়নি");
  }

  if (task.status !== "ACTIVE") {
    throw new BadRequestError("এই টাস্কটি বর্তমানে সক্রিয় নয়");
  }

  // 2. Insert submission
  const [submission] = await db
    .insert(taskSubmissions)
    .values({
      taskId: task.id,
      userId: authUser.id,
      rewardMinor: task.rewardMinor,
      screenshotUrl,
      userNote,
      status: "PENDING",
    })
    .returning();

  return c.json(
    apiSuccess({
      message: "টাস্ক প্রুফ সফলভাবে জমা হয়েছে। অ্যাডমিন পর্যালোচনার পর রিওয়ার্ড যুক্ত হবে।",
      submission: {
        id: submission.id,
        taskId: task.id,
        taskTitle: task.title,
        reward: serializeMoney(task.rewardMinor),
        screenshotUrl: submission.screenshotUrl,
        status: submission.status,
        submittedAt: submission.submittedAt,
      },
    }),
    201
  );
});
