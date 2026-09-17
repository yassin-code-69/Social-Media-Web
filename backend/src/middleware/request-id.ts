import { Context, Next } from "hono";

export const requestIdMiddleware = async (c: Context, next: Next) => {
  const incomingId = c.req.header("X-Request-Id");
  const requestId = incomingId || crypto.randomUUID();

  c.set("requestId", requestId);
  c.header("X-Request-Id", requestId);

  await next();
};
