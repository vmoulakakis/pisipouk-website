import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  clearAuthCache,
  getCachedAdminRole,
  getCachedSession,
  primeAdminRoleCache,
  primeSessionCache,
} from "@/lib/auth-cache";

export type GuardState =
  | { loading: true }
  | { loading: false; authed: false }
  | { loading: false; authed: true; isAdmin: boolean; userId: string };

let cachedState: GuardState | null = null;
const listeners = new Set<(s: GuardState) => void>();

function publish(next: GuardState) {
  cachedState = next;
  listeners.forEach((cb) => cb(next));
}

async function refresh(force = false) {
  const session = await getCachedSession({ force });
  const uid = session?.user.id;

  if (!uid) {
    publish({ loading: false, authed: false });
    return;
  }

  const isAdmin = await getCachedAdminRole(uid, { force });
  publish({ loading: false, authed: true, isAdmin, userId: uid });
}

let initialized = false;
function ensureInit() {
  if (initialized) return;
  initialized = true;
  void refresh();

  supabase.auth.onAuthStateChange((_event, session) => {
    primeSessionCache(session ?? null);

    if (!session?.user?.id) {
      clearAuthCache();
      publish({ loading: false, authed: false });
      return;
    }

    if (cachedState && !cachedState.loading && cachedState.authed && cachedState.userId === session.user.id) {
      primeAdminRoleCache(session.user.id, cachedState.isAdmin);
    }

    void refresh(true);
  });
}

export function useAdminGuard(): GuardState {
  const [state, setState] = useState<GuardState>(cachedState ?? { loading: true });

  useEffect(() => {
    ensureInit();
    if (cachedState) setState(cachedState);

    const cb = (s: GuardState) => setState(s);
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  }, []);

  return state;
}

export function primeAdminGuard(userId: string, isAdmin: boolean) {
  primeAdminRoleCache(userId, isAdmin);
  publish({ loading: false, authed: true, isAdmin, userId });
}

export function refreshAdminGuard() {
  void refresh(true);
}