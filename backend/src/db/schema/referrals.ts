import { pgTable, uuid, bigint, timestamp } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),
  referrerId: uuid("referrer_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  referredId: uuid("referred_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  rewardPaidMinor: bigint("reward_paid_minor", { mode: "bigint" }).default(0n).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;
