import { createClient } from "@insforge/sdk";

/**
 * Env vars resueltas de forma defensiva: si falta alguna, NO lanzamos en import
 * (para no romper `next build`); en su lugar caemos a strings vacíos y las
 * páginas que consulten data mostrarán estado vacío con fallback gracioso.
 */
export const INSFORGE_URL = process.env.NEXT_PUBLIC_INSFORGE_URL ?? "";
export const INSFORGE_ANON_KEY = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ?? "";
export const INSFORGE_FUNCTIONS_URL =
  process.env.NEXT_PUBLIC_INSFORGE_FUNCTIONS_URL ||
  (INSFORGE_URL
    ? INSFORGE_URL.replace(".us-east.insforge.app", ".functions.insforge.app")
    : "");

if (!INSFORGE_URL || !INSFORGE_ANON_KEY) {
  // Log una sola vez en servidor; el cliente ya se enterará al intentar fetch
  if (typeof window === "undefined") {
    // eslint-disable-next-line no-console
    console.warn(
      "[insforge] Missing NEXT_PUBLIC_INSFORGE_URL or NEXT_PUBLIC_INSFORGE_ANON_KEY — " +
        "las páginas de datos renderizarán vacías hasta que configures las env vars."
    );
  }
}

/**
 * Public client (anon). Seguro para browser y server components.
 * Respeta RLS — sólo ve clínicas active, reviews approved, benchmarks públicos.
 */
export const insforge = createClient({
  baseUrl: INSFORGE_URL || "https://placeholder.invalid",
  anonKey: INSFORGE_ANON_KEY || "placeholder",
});

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
