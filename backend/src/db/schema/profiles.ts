import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { userRoleEnum, userStatusEnum } from "./enums";

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(), // Foreign key matching auth.users(id) from Supabase Auth
  displayName: varchar("display_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 32 }).unique(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").default("USER").notNull(),
  status: userStatusEnum("status").default("ACTIVE").notNull(),
  referralCode: varchar("referral_code", { length: 32 }).unique().notNull(),
  referredById: uuid("referred_by_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
