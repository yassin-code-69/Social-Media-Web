import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(4000),

  // Database
  DATABASE_URL: z.string().default("postgresql://postgres:postgres@localhost:5432/digonto"),

  // Supabase
  SUPABASE_URL: z.string().default("https://placeholder.supabase.co"),
  SUPABASE_ANON_KEY: z.string().default("placeholder_anon_key"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().default("placeholder_service_role_key"),

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
  const result = envSchema.safeParse(process.env);
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
