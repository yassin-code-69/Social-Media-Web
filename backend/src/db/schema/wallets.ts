import { pgTable, uuid, bigint, varchar, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { profiles } from "./profiles";

export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  balanceMinor: bigint("balance_minor", { mode: "bigint" }).default(sql`0`).notNull(),
  pendingBalanceMinor: bigint("pending_balance_minor", { mode: "bigint" }).default(sql`0`).notNull(),
  bonusBalanceMinor: bigint("bonus_balance_minor", { mode: "bigint" }).default(sql`0`).notNull(),
  totalEarnedMinor: bigint("total_earned_minor", { mode: "bigint" }).default(sql`0`).notNull(),
  totalWithdrawnMinor: bigint("total_withdrawn_minor", { mode: "bigint" }).default(sql`0`).notNull(),
  currency: varchar("currency", { length: 3 }).default("BDT").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;
