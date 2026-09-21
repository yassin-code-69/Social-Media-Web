import { pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["USER", "ADMIN", "SUPER_ADMIN"]);

export const userStatusEnum = pgEnum("user_status", ["ACTIVE", "SUSPENDED", "BLOCKED"]);

export const reviewStatusEnum = pgEnum("review_status", ["PENDING", "APPROVED", "REJECTED"]);

export const packageStatusEnum = pgEnum("package_status", ["ACTIVE", "INACTIVE", "ARCHIVED"]);

export const userPackageStatusEnum = pgEnum("user_package_status", ["ACTIVE", "EXPIRED", "CANCELLED"]);

export const taskStatusEnum = pgEnum("task_status", ["ACTIVE", "INACTIVE", "ARCHIVED"]);

export const taskTypeEnum = pgEnum("task_type", [
  "FACEBOOK",
  "YOUTUBE",
  "TIKTOK",
  "WEBSITE",
  "CONTENT",
  "VIDEO",
  "CAPTCHA",
  "OTHER",
]);

export const transactionDirectionEnum = pgEnum("transaction_direction", ["CREDIT", "DEBIT"]);

export const walletTransactionTypeEnum = pgEnum("wallet_transaction_type", [
  "TASK_REWARD",
  "REFERRAL_REWARD",
  "DEPOSIT",
  "WITHDRAWAL",
  "WITHDRAWAL_REVERSAL",
  "PACKAGE_PURCHASE",
  "BONUS",
  "DAILY_BONUS",
  "LUCKY_SPIN",
  "GIFT_CODE",
  "MONTHLY_SALARY",
  "INCENTIVE_BONUS",
  "ICASH_INVESTMENT",
  "ICASH_PROFIT",
  "ADMIN_ADJUSTMENT",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "TASK_APPROVED",
  "TASK_REJECTED",
  "DEPOSIT_APPROVED",
  "DEPOSIT_REJECTED",
  "WITHDRAWAL_APPROVED",
  "WITHDRAWAL_REJECTED",
  "PACKAGE_APPROVED",
  "PACKAGE_REJECTED",
  "REFERRAL_REWARD",
  "MONTHLY_SALARY_APPROVED",
  "INCENTIVE_APPROVED",
  "ICASH_PROFIT_CREDITED",
  "ADMIN_ANNOUNCEMENT",
  "SYSTEM",
]);

export const icashStatusEnum = pgEnum("icash_status", ["ACTIVE", "MATURED", "CANCELLED"]);

export const claimStatusEnum = pgEnum("claim_status", ["PENDING", "APPROVED", "PAID", "REJECTED"]);

export const incentiveStatusEnum = pgEnum("incentive_status", [
  "PENDING",
  "APPROVED",
  "DISPATCHED",
  "DELIVERED",
  "REJECTED",
]);

export const contentTypeEnum = pgEnum("content_type", ["ARTICLE", "VIDEO"]);

export const contentStatusEnum = pgEnum("content_status", ["PENDING", "APPROVED", "REJECTED"]);

