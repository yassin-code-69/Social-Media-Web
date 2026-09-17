import { pgTable, uuid, bigint, varchar, text, boolean, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { taskStatusEnum, taskTypeEnum, reviewStatusEnum } from "./enums";

export const tasks = pgTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  platform: taskTypeEnum("platform").notNull(),
  rewardMinor: bigint("reward_minor", { mode: "bigint" }).notNull(),
  action: text("action").notNull(),
  description: text("description").notNull(),
  instructions: jsonb("instructions").$type<string[]>().default([]).notNull(),
  targetUrl: text("target_url").notNull(),
  requiredPackage: varchar("required_package", { length: 100 }).default("ANY").notNull(),
  requiresScreenshot: boolean("requires_screenshot").default(true).notNull(),
  dailyLimit: integer("daily_limit").default(1000).notNull(),
  status: taskStatusEnum("status").default("ACTIVE").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const taskSubmissions = pgTable("task_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  taskId: uuid("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  rewardMinor: bigint("reward_minor", { mode: "bigint" }).notNull(),
  screenshotUrl: text("screenshot_url").notNull(),
  userNote: text("user_note"),
  status: reviewStatusEnum("status").default("PENDING").notNull(),
  rejectionReason: text("rejection_reason"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

export type Task = typeof tasks.$inferSelect;
export type NewTask = typeof tasks.$inferInsert;
export type TaskSubmission = typeof taskSubmissions.$inferSelect;
export type NewTaskSubmission = typeof taskSubmissions.$inferInsert;
