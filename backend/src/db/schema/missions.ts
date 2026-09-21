import { pgTable, uuid, bigint, varchar, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { profiles } from "./profiles";

export const dailyCheckins = pgTable("daily_checkins", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  checkinDate: varchar("checkin_date", { length: 10 }).notNull(), // "2026-09-21"
  rewardMinor: bigint("reward_minor", { mode: "bigint" }).default(sql`500`).notNull(), // ৳5
  streakDay: integer("streak_day").default(1).notNull(),
  claimedAt: timestamp("claimed_at", { withTimezone: true }).defaultNow().notNull(),
});

export const luckySpins = pgTable("lucky_spins", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  prizeTitle: varchar("prize_title", { length: 100 }).notNull(),
  rewardMinor: bigint("reward_minor", { mode: "bigint" }).notNull(),
  spinDate: varchar("spin_date", { length: 10 }).notNull(), // "2026-09-21"
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const giftCodes = pgTable("gift_codes", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 32 }).unique().notNull(), // e.g. "DIGONTO"
  rewardMinor: bigint("reward_minor", { mode: "bigint" }).notNull(),
  maxUses: integer("max_uses").default(1000).notNull(),
  usedCount: integer("used_count").default(0).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const giftCodeRedemptions = pgTable("gift_code_redemptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  giftCodeId: uuid("gift_code_id")
    .references(() => giftCodes.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  redeemedAmountMinor: bigint("redeemed_amount_minor", { mode: "bigint" }).notNull(),
  redeemedAt: timestamp("redeemed_at", { withTimezone: true }).defaultNow().notNull(),
});

export type DailyCheckin = typeof dailyCheckins.$inferSelect;
export type LuckySpin = typeof luckySpins.$inferSelect;
export type GiftCode = typeof giftCodes.$inferSelect;
export type GiftCodeRedemption = typeof giftCodeRedemptions.$inferSelect;
