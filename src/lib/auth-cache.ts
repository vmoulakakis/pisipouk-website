import type { Session } from "@supabase/supabase-js";

let cachedSession: Session | null = null;

export function primeSessionCache(session: Session | null) {
  cachedSession = session;
}

export function getCachedSession() {
  return cachedSession;
}
