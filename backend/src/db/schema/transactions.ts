import { pgTable, uuid, bigint, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { wallets } from "./wallets";
import { profiles } from "./profiles";
import { walletTransactionTypeEnum, transactionDirectionEnum } from "./enums";

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").primaryKey().defaultRandom(),
  walletId: uuid("wallet_id")
    .references(() => wallets.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  type: walletTransactionTypeEnum("type").notNull(),
  direction: transactionDirectionEnum("direction").notNull(),
  amountMinor: bigint("amount_minor", { mode: "bigint" }).notNull(),
  balanceAfterMinor: bigint("balance_after_minor", { mode: "bigint" }).notNull(),
  description: text("description").notNull(),
  referenceId: varchar("reference_id", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type WalletTransaction = typeof walletTransactions.$inferSelect;
export type NewWalletTransaction = typeof walletTransactions.$inferInsert;
