import { pgTable, uuid, bigint, varchar, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { reviewStatusEnum } from "./enums";

export const paymentMethods = pgTable("payment_methods", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 50 }).notNull(), // e.g., bKash, Nagad, Rocket
  accountType: varchar("account_type", { length: 50 }).default("Personal").notNull(),
  accountNumber: varchar("account_number", { length: 50 }).notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  instructions: text("instructions"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const deposits = pgTable("deposits", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  amountMinor: bigint("amount_minor", { mode: "bigint" }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  senderNumber: varchar("sender_number", { length: 50 }).notNull(),
  transactionId: varchar("transaction_id", { length: 100 }).notNull(),
  screenshotUrl: text("screenshot_url"),
  status: reviewStatusEnum("status").default("PENDING").notNull(),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

export const withdrawals = pgTable("withdrawals", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  amountMinor: bigint("amount_minor", { mode: "bigint" }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  accountNumber: varchar("account_number", { length: 50 }).notNull(),
  maskedAccount: varchar("masked_account", { length: 50 }).notNull(),
  status: reviewStatusEnum("status").default("PENDING").notNull(),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
});

export type PaymentMethod = typeof paymentMethods.$inferSelect;
export type Deposit = typeof deposits.$inferSelect;
export type NewDeposit = typeof deposits.$inferInsert;
export type Withdrawal = typeof withdrawals.$inferSelect;
export type NewWithdrawal = typeof withdrawals.$inferInsert;
