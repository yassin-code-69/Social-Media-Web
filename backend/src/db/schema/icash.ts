import { pgTable, uuid, bigint, varchar, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { profiles } from "./profiles";
import { icashStatusEnum } from "./enums";

export const icashPlans = pgTable("icash_plans", {
  id: varchar("id", { length: 32 }).primaryKey(), // "1yr", "2yr", "5yr", "10yr"
  title: varchar("title", { length: 100 }).notNull(),
  years: integer("years").notNull(),
  profitPercent: integer("profit_percent").notNull(),
  minDepositMinor: bigint("min_deposit_minor", { mode: "bigint" }).notNull(),
  maxDepositMinor: bigint("max_deposit_minor", { mode: "bigint" }).notNull(),
  popular: varchar("badge", { length: 50 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const icashInvestments = pgTable("icash_investments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  planId: varchar("plan_id", { length: 32 })
    .references(() => icashPlans.id)
    .notNull(),
  investedAmountMinor: bigint("invested_amount_minor", { mode: "bigint" }).notNull(),
  monthlyProfitMinor: bigint("monthly_profit_minor", { mode: "bigint" }).notNull(),
  totalProfitClaimedMinor: bigint("total_profit_claimed_minor", { mode: "bigint" }).default(sql`0`).notNull(),
  status: icashStatusEnum("status").default("ACTIVE").notNull(),
  startDate: timestamp("start_date", { withTimezone: true }).defaultNow().notNull(),
  maturityDate: timestamp("maturity_date", { withTimezone: true }).notNull(),
  lastProfitClaimDate: timestamp("last_profit_claim_date", { withTimezone: true }),
  nextProfitClaimDate: timestamp("next_profit_claim_date", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type IcashPlan = typeof icashPlans.$inferSelect;
export type IcashInvestment = typeof icashInvestments.$inferSelect;
export type NewIcashInvestment = typeof icashInvestments.$inferInsert;
