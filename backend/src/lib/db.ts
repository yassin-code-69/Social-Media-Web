import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/config/env";
import * as schema from "@/db/schema";
import { logger } from "@/lib/logger";

// Connection pool configuration
const connectionString = env.DATABASE_URL;

// For queries and transactions
const client = postgres(connectionString, {
  max: env.NODE_ENV === "production" ? 10 : 5,
  idle_timeout: 20,
  connect_timeout: 10,
  onnotice: () => {}, // suppress notice spam
});

export const db = drizzle(client, { schema });

export const checkDatabaseConnection = async (): Promise<boolean> => {
  try {
    await client`SELECT 1`;
    return true;
  } catch (err) {
    logger.warn("Database connection check failed (expected if local DB is not yet running)", err);
    return false;
  }
};
