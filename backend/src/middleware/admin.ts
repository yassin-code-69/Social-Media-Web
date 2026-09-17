import { Context, Next } from "hono";
import { ForbiddenError } from "@/shared/errors/app-error";
import { AuthenticatedUser } from "./auth";

export const requireAdmin = async (c: Context, next: Next) => {
  const user = c.get("user") as AuthenticatedUser | undefined;

  if (!user || (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")) {
    throw new ForbiddenError("কেবলমাত্র অ্যাডমিনের এই অ্যাকশনটি সম্পন্ন করার অনুমতি রয়েছে");
  }

  await next();
};
