import { env } from "./env";

export const corsConfig = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    env.FRONTEND_URL,
  ].filter(Boolean),
  allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
  exposeHeaders: ["X-Request-Id", "Content-Length"],
  maxAge: 86400,
  credentials: true,
};
