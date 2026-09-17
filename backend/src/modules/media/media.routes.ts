import { Hono } from "hono";
import { z } from "zod";
import { apiSuccess } from "@/shared/responses/api-response";
import { requireAuth } from "@/middleware/auth";
import { generateCloudinarySignature } from "@/lib/cloudinary";
import { AppEnv } from "@/types/context";

export const mediaRouter = new Hono<AppEnv>();

const signatureRequestSchema = z.object({
  folder: z.string().default("digonto/proofs"),
});

mediaRouter.post("/signature", requireAuth, async (c) => {
  const body = await c.req.json().catch(() => ({}));
  const { folder } = signatureRequestSchema.parse(body);

  const signData = generateCloudinarySignature(folder);

  return c.json(apiSuccess(signData));
});
