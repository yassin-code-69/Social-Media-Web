import { env } from "@/config/env";

export const logger = {
  info: (message: string, meta?: unknown) => {
    if (env.LOG_LEVEL !== "error" && env.LOG_LEVEL !== "warn") {
      console.log(`[INFO] [${new Date().toISOString()}] ${message}`, meta !== undefined ? meta : "");
    }
  },
  warn: (message: string, meta?: unknown) => {
    if (env.LOG_LEVEL !== "error") {
      console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, meta !== undefined ? meta : "");
    }
  },
  error: (message: string, error?: unknown) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error !== undefined ? error : "");
  },
  debug: (message: string, meta?: unknown) => {
    if (env.LOG_LEVEL === "debug") {
      console.debug(`[DEBUG] [${new Date().toISOString()}] ${message}`, meta !== undefined ? meta : "");
    }
  },
};
