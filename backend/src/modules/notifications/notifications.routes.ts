import { Hono } from "hono";
import { eq, desc, and } from "drizzle-orm";
import { db } from "@/lib/db";
import { notifications } from "@/db/schema";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { BadRequestError } from "@/shared/errors/app-error";
import { AppEnv } from "@/types/context";

export const notificationsRouter = new Hono<AppEnv>();

// GET /api/v1/notifications - Get current user notifications
notificationsRouter.get("/", requireAuth, async (c) => {
  const user = c.get("user")!;

  const userNotifs = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, user.id))
    .orderBy(desc(notifications.createdAt))
    .limit(50);

  const mapped = userNotifs.map((n) => ({
    id: n.id,
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.isRead,
    createdAt: new Date(n.createdAt).toLocaleDateString("bn-BD", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  const unreadCount = mapped.filter((n) => !n.read).length;

  return c.json(
    apiSuccess({
      notifications: mapped,
      unreadCount,
    })
  );
});

// PATCH /api/v1/notifications/:id/read - Mark specific notification as read
notificationsRouter.patch("/:id/read", requireAuth, async (c) => {
  const user = c.get("user")!;
  const notifId = c.req.param("id");

  if (!notifId) {
    throw new BadRequestError("বিজ্ঞপ্তি আইডি আবশ্যক");
  }

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, notifId), eq(notifications.userId, user.id)));

  return c.json(apiSuccess({ success: true, id: notifId }));
});

// POST /api/v1/notifications/read-all - Mark all as read
notificationsRouter.post("/read-all", requireAuth, async (c) => {
  const user = c.get("user")!;

  await db
    .update(notifications)
    .set({ isRead: true })
    .where(eq(notifications.userId, user.id));

  return c.json(apiSuccess({ success: true }));
});
