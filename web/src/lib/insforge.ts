import { createClient } from "@insforge/sdk";

/**
 * Public client (anon). Seguro para el browser y server components.
 * Respeta RLS — sólo ve clínicas active, reviews approved, benchmarks públicos.
 */
export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
});

export const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL!;
export const INSFORGE_FUNCTIONS_URL =
  process.env.NEXT_PUBLIC_INSFORGE_FUNCTIONS_URL ||
  process.env.NEXT_PUBLIC_INSFORGE_URL!.replace(
    ".us-east.insforge.app",
    ".functions.insforge.app"
  );
export const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!;

/**
 * Admin fetch para Server Actions / API Routes. Nunca usar en el browser.
 * Bypasea RLS.
 */
export async function adminFetch(path: string, init?: RequestInit) {
  const key = process.env.INSFORGE_API_KEY;
  if (!key) throw new Error("INSFORGE_API_KEY missing (server only)");
  const res = await fetch(`${INSFORGE_URL}${path}`, {
    ...init,
    headers: {
      ...(init?.headers || {}),
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Insforge admin ${res.status}: ${await res.text()}`);
  return res;
}
