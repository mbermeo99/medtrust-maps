"use client";

import { useEffect, useState } from "react";
import { insforge } from "./insforge";

export type AuthUser = {
  id: string;
  email: string;
  emailVerified: boolean;
  profile?: { name?: string; avatar_url?: string };
};

export function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (!mounted) return;
      setUser((data?.user as AuthUser) ?? null);
      setLoading(false);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { user, loading };
}

export async function getAccessToken(): Promise<string | null> {
  // El SDK guarda el session en storage del browser. Para llamar Edge Functions
  // necesitamos el accessToken actual.
  try {
    // @ts-expect-error private-ish, pero es la forma práctica
    const s = insforge.auth.session?.();
    if (s?.accessToken) return s.accessToken;
  } catch {}
  // Fallback: refrescar
  const { data } = await insforge.auth.getCurrentUser();
  // @ts-expect-error
  return data?.accessToken ?? null;
}
