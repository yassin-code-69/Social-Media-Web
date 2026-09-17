import { Hono } from "hono";
import { apiSuccess } from "@/shared/responses/api-response";
import { checkDatabaseConnection } from "@/lib/db";
import { AppEnv } from "@/types/context";

export const healthRouter = new Hono<AppEnv>();

healthRouter.get("/", async (c) => {
  const dbConnected = await checkDatabaseConnection();

  return c.json(
    apiSuccess({
      status: "ok",
      serverTime: new Date().toISOString(),
      database: dbConnected ? "connected" : "disconnected_or_local_pending",
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
    })
  );
});
