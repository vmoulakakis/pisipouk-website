import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const configuredUrl = import.meta.env.VITE_SUPABASE_URL;
const configuredKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = true;

const url =
  configuredUrl ||
  (typeof process !== "undefined" ? process.env.SUPABASE_URL : undefined) ||
  "https://gqpbskssrvpfjtujwezc.supabase.co";

const publishableKey =
  configuredKey ||
  (typeof process !== "undefined"
    ? process.env.SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_ANON_KEY
    : undefined) ||
  "sb_publishable_Kcat2PHVjGn32ubiefotfA_iJjCU-B2";

export const supabase = createClient<Database>(url, publishableKey, {
  auth: {
    persistSession: isSupabaseConfigured,
    autoRefreshToken: isSupabaseConfigured,
    detectSessionInUrl: isSupabaseConfigured,
    storage: isSupabaseConfigured && typeof window !== "undefined" ? window.localStorage : undefined,
  },
});
