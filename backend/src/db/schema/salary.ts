import { pgTable, uuid, bigint, varchar, integer, timestamp, text } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { claimStatusEnum, incentiveStatusEnum } from "./enums";

export const monthlySalaryClaims = pgTable("monthly_salary_claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  targetTier: integer("target_tier").notNull(), // 100, 200, 500
  salaryAmountMinor: bigint("salary_amount_minor", { mode: "bigint" }).notNull(), // ৳500 = 50000n, ৳1500 = 150000n, ৳20000 = 2000000n
  eligibleMembersCount: integer("eligible_members_count").notNull(),
  monthYear: varchar("month_year", { length: 7 }).notNull(), // "2026-09"
  status: claimStatusEnum("status").default("PENDING").notNull(),
  adminNote: text("admin_note"),
  claimedAt: timestamp("claimed_at", { withTimezone: true }).defaultNow().notNull(),
  approvedAt: timestamp("approved_at", { withTimezone: true }),
});

export const incentiveClaims = pgTable("incentive_claims", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  rewardTitle: varchar("reward_title", { length: 100 }).default("iPhone 16 Pro").notNull(),
  gen1Count: integer("gen1_count").notNull(), // req: 100
  gen2Count: integer("gen2_count").notNull(), // req: 50
  gen3Count: integer("gen3_count").notNull(), // req: 20
  recipientName: varchar("recipient_name", { length: 100 }).notNull(),
  deliveryPhone: varchar("delivery_phone", { length: 32 }).notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  status: incentiveStatusEnum("status").default("PENDING").notNull(),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  adminNote: text("admin_note"),
  claimedAt: timestamp("claimed_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type MonthlySalaryClaim = typeof monthlySalaryClaims.$inferSelect;
export type NewMonthlySalaryClaim = typeof monthlySalaryClaims.$inferInsert;
export type IncentiveClaim = typeof incentiveClaims.$inferSelect;
export type NewIncentiveClaim = typeof incentiveClaims.$inferInsert;
