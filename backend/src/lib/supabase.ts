import { createClient } from "@supabase/supabase-js";
import { env } from "@/config/env";

// Supabase Admin Client (using service role key for user management and auth verification)
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Standard client for public or token validation
export const supabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_ANON_KEY
);
