import { pgTable, uuid, bigint, varchar, integer, boolean, jsonb, timestamp, text } from "drizzle-orm/pg-core";
import { profiles } from "./profiles";
import { packageStatusEnum, userPackageStatusEnum, reviewStatusEnum } from "./enums";

export const packages = pgTable("packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  priceMinor: bigint("price_minor", { mode: "bigint" }).notNull(),
  validityDays: integer("validity_days").notNull(),
  dailyTaskLimit: integer("daily_task_limit").notNull(),
  dailyRewardLimitMinor: bigint("daily_reward_limit_minor", { mode: "bigint" }).notNull(),
  referralBonusPercent: integer("referral_bonus_percent").default(10).notNull(),
  colorGradient: varchar("color_gradient", { length: 100 }).default("from-slate-600 to-slate-800"),
  isPopular: boolean("is_popular").default(false),
  features: jsonb("features").$type<string[]>().default([]).notNull(),
  status: packageStatusEnum("status").default("ACTIVE").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const packagePurchases = pgTable("package_purchases", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  packageId: uuid("package_id")
    .references(() => packages.id, { onDelete: "cascade" })
    .notNull(),
  amountMinor: bigint("amount_minor", { mode: "bigint" }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
  senderNumber: varchar("sender_number", { length: 50 }).notNull(),
  transactionId: varchar("transaction_id", { length: 100 }).notNull(),
  status: reviewStatusEnum("status").default("PENDING").notNull(),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  processedAt: timestamp("processed_at", { withTimezone: true }),
});

export const userPackages = pgTable("user_packages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => profiles.id, { onDelete: "cascade" })
    .notNull(),
  packageId: uuid("package_id")
    .references(() => packages.id, { onDelete: "cascade" })
    .notNull(),
  status: userPackageStatusEnum("status").default("ACTIVE").notNull(),
  startsAt: timestamp("starts_at", { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Package = typeof packages.$inferSelect;
export type NewPackage = typeof packages.$inferInsert;
export type PackagePurchase = typeof packagePurchases.$inferSelect;
export type UserPackage = typeof userPackages.$inferSelect;
