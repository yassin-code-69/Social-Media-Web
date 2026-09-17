// Enable native BigInt JSON serialization
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./lib/logger";

logger.info(`🚀 Starting Digonto Backend API on port ${env.PORT} [${env.NODE_ENV}]...`);

export default {
  port: env.PORT,
  fetch: app.fetch,
};
