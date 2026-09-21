import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),

  // Database
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/digonto"),

  // Supabase
  SUPABASE_URL: z.string().default("https://placeholder.supabase.co"),
  SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().default("placeholder_anon_key"),
  SUPABASE_SECRET_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default("placeholder_service_role_key"),
  SUPABASE_JWKS_URL: z.string().optional(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().default("placeholder_cloud_name"),
  CLOUDINARY_API_KEY: z.string().default("placeholder_api_key"),
  CLOUDINARY_API_SECRET: z.string().default("placeholder_api_secret"),

  // Frontend URL for CORS
  FRONTEND_URL: z.string().default("http://localhost:3000"),

  // Logging
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

const parseEnv = () => {
  const rawEnv = {
    ...process.env,
    SUPABASE_ANON_KEY:
      process.env.SUPABASE_ANON_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      "placeholder_anon_key",
    SUPABASE_SERVICE_ROLE_KEY:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_SECRET_KEY ||
      "placeholder_service_role_key",
  };

  const result = envSchema.safeParse(rawEnv);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
  return result.success ? result.data : envSchema.parse({});
};

export const env = parseEnv();
export type Env = z.infer<typeof envSchema>;
