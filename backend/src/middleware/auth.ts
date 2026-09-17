import { Context, Next } from "hono";
import { UnauthorizedError } from "@/shared/errors/app-error";
import { supabaseAdmin } from "@/lib/supabase";
import { env } from "@/config/env";
import { logger } from "@/lib/logger";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  displayName?: string;
}

export const requireAuth = async (c: Context, next: Next) => {
  const authHeader = c.req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("লগইন টোকেন অনুপস্থিত বা অবৈধ");
  }

  const token = authHeader.replace("Bearer ", "").trim();

  // Development mock bypass if token starts with "mock_" or "test_"
  if (env.NODE_ENV === "development" && (token.startsWith("mock_") || token === "dev_admin_token")) {
    const isMockAdmin = token === "dev_admin_token";
    const mockUser: AuthenticatedUser = {
      id: "11111111-1111-1111-1111-111111111111",
      email: isMockAdmin ? "admin@digonto.com" : "tamim@example.com",
      role: isMockAdmin ? "ADMIN" : "USER",
      displayName: isMockAdmin ? "দিগন্ত অ্যাডমিন" : "তামিম ইসলাম",
    };
    c.set("user", mockUser);
    return await next();
  }

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedError("লগইন সেশনের মেয়াদ শেষ হয়েছে, পুনরায় লগইন করুন");
    }

    const user: AuthenticatedUser = {
      id: data.user.id,
      email: data.user.email || "",
      role: (data.user.user_metadata?.role as any) || "USER",
      displayName: data.user.user_metadata?.display_name || data.user.email,
    };

    c.set("user", user);
    await next();
  } catch (err) {
    if (err instanceof UnauthorizedError) throw err;
    logger.warn("Auth token validation error", err);
    throw new UnauthorizedError("লগইন যাচাইকরণ ব্যর্থ হয়েছে");
  }
};
