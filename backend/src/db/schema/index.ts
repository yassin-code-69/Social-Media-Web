import { relations } from "drizzle-orm";
import { profiles } from "./profiles";
import { wallets } from "./wallets";
import { walletTransactions } from "./transactions";
import { packages, packagePurchases, userPackages } from "./packages";
import { tasks, taskSubmissions } from "./tasks";
import { paymentMethods, deposits, withdrawals } from "./finances";
import { referrals } from "./referrals";
import { notifications } from "./notifications";
import { systemSettings, auditLogs } from "./settings";
import { icashPlans, icashInvestments } from "./icash";
import { monthlySalaryClaims, incentiveClaims } from "./salary";
import { dailyCheckins, luckySpins, giftCodes, giftCodeRedemptions } from "./missions";
import { contentSubmissions } from "./content";

export * from "./enums";
export * from "./profiles";
export * from "./wallets";
export * from "./transactions";
export * from "./packages";
export * from "./tasks";
export * from "./finances";
export * from "./referrals";
export * from "./notifications";
export * from "./settings";
export * from "./icash";
export * from "./salary";
export * from "./missions";
export * from "./content";

// Drizzle Table Relations
export const profilesRelations = relations(profiles, ({ one, many }) => ({
  wallet: one(wallets, {
    fields: [profiles.id],
    references: [wallets.userId],
  }),
  transactions: many(walletTransactions),
  purchases: many(packagePurchases),
  activePackages: many(userPackages),
  submissions: many(taskSubmissions),
  deposits: many(deposits),
  withdrawals: many(withdrawals),
  notifications: many(notifications),
  referralsMade: many(referrals, { relationName: "referrer" }),
  referredBy: one(referrals, {
    fields: [profiles.id],
    references: [referrals.referredId],
    relationName: "referred",
  }),
}));

export const walletsRelations = relations(wallets, ({ one, many }) => ({
  user: one(profiles, {
    fields: [wallets.userId],
    references: [profiles.id],
  }),
  transactions: many(walletTransactions),
}));

export const walletTransactionsRelations = relations(walletTransactions, ({ one }) => ({
  wallet: one(wallets, {
    fields: [walletTransactions.walletId],
    references: [wallets.id],
  }),
  user: one(profiles, {
    fields: [walletTransactions.userId],
    references: [profiles.id],
  }),
}));

export const packagesRelations = relations(packages, ({ many }) => ({
  purchases: many(packagePurchases),
  userPackages: many(userPackages),
}));

export const tasksRelations = relations(tasks, ({ many }) => ({
  submissions: many(taskSubmissions),
}));

export const taskSubmissionsRelations = relations(taskSubmissions, ({ one }) => ({
  task: one(tasks, {
    fields: [taskSubmissions.taskId],
    references: [tasks.id],
  }),
  user: one(profiles, {
    fields: [taskSubmissions.userId],
    references: [profiles.id],
  }),
}));

export const depositsRelations = relations(deposits, ({ one }) => ({
  user: one(profiles, {
    fields: [deposits.userId],
    references: [profiles.id],
  }),
}));

export const withdrawalsRelations = relations(withdrawals, ({ one }) => ({
  user: one(profiles, {
    fields: [withdrawals.userId],
    references: [profiles.id],
  }),
}));
