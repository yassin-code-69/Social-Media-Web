import { pgTable, uuid, bigint, varchar, timestamp } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";

export const wallets = pgTable("wallets", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  balanceMinor: bigint("balance_minor", { mode: "bigint" }).default(0n).notNull(),
  totalEarnedMinor: bigint("total_earned_minor", { mode: "bigint" }).default(0n).notNull(),
  totalWithdrawnMinor: bigint("total_withdrawn_minor", { mode: "bigint" }).default(0n).notNull(),
  currency: varchar("currency", { length: 3 }).default("BDT").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type NewWallet = typeof wallets.$inferInsert;
