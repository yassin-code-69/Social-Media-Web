import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger as honoLogger } from "hono/logger";
import { corsConfig } from "@/config/cors";
import { APP_CONSTANTS } from "@/config/constants";
import { requestIdMiddleware } from "@/middleware/request-id";
import { errorHandler } from "@/middleware/error-handler";

// Route modules
import { healthRouter } from "@/modules/health/health.routes";
import { packagesRouter } from "@/modules/packages/packages.routes";
import { tasksRouter } from "@/modules/tasks/tasks.routes";
import { walletRouter } from "@/modules/wallet/wallet.routes";
import { mediaRouter } from "@/modules/media/media.routes";
import { adminRouter } from "@/modules/admin/admin.routes";
import { AppEnv } from "@/types/context";

export const app = new Hono<AppEnv>();

// Global Middlewares
app.use("*", honoLogger());
app.use("*", cors(corsConfig));
app.use("*", requestIdMiddleware);

// Error Handling
app.onError(errorHandler);

// API v1 Router
const v1 = new Hono<AppEnv>();

v1.route("/health", healthRouter);
v1.route("/packages", packagesRouter);
v1.route("/tasks", tasksRouter);
v1.route("/wallet", walletRouter);
v1.route("/media", mediaRouter);
v1.route("/admin", adminRouter);

// Mount under API prefix (/api/v1)
app.route(APP_CONSTANTS.API_PREFIX, v1);

// Fallback for not found
app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: {
        code: "NOT_FOUND",
        message: `Endpoint ${c.req.path} not found`,
      },
    },
    404
  );
});
