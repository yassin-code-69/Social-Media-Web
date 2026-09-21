import { pgTable, uuid, bigint, varchar, integer, text, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { profiles } from "./profiles";
import { contentTypeEnum, contentStatusEnum } from "./enums";

export const contentSubmissions = pgTable("content_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  type: contentTypeEnum("type").notNull(), // ARTICLE or VIDEO
  title: varchar("title", { length: 255 }).notNull(),
  contentBody: text("content_body"), // Written article text
  mediaUrl: text("media_url"), // Video link (YouTube, Facebook, etc.)
  wordCount: integer("word_count").default(0),
  rewardMinor: bigint("reward_minor", { mode: "bigint" }).default(sql`0`).notNull(),
  status: contentStatusEnum("status").default("PENDING").notNull(),
  adminFeedback: text("admin_feedback"),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

export type ContentSubmission = typeof contentSubmissions.$inferSelect;
export type NewContentSubmission = typeof contentSubmissions.$inferInsert;
