// Helpers de lectura pública vía REST de Insforge (SSR-friendly, sin SDK).
import { INSFORGE_URL, INSFORGE_ANON_KEY } from "@/lib/insforge";
import type { Clinic, Doctor, Procedure, Review, CityBenchmark } from "./types";

const PUBLIC_HDRS = {
  Authorization: `Bearer ${INSFORGE_ANON_KEY}`,
};

async function rest<T>(path: string, revalidate = 60): Promise<T> {
  const res = await fetch(`${INSFORGE_URL}/api/database/records/${path}`, {
    headers: PUBLIC_HDRS,
    next: { revalidate },
  });
  if (!res.ok) {
    throw new Error(`rest ${path} failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

export async function listActiveClinics(params: {
  country?: string;
  city?: string;
  minTrust?: number;
  limit?: number;
} = {}): Promise<Clinic[]> {
  const q: string[] = ["status=eq.active"];
  if (params.country) q.push(`country=eq.${params.country}`);
  if (params.city) q.push(`city=eq.${params.city}`);
  if (params.minTrust) q.push(`trust_score=gte.${params.minTrust}`);
  q.push("order=trust_score.desc");
  if (params.limit) q.push(`limit=${params.limit}`);
  return rest<Clinic[]>(`clinics?${q.join("&")}`);
}

export async function getClinicBySlug(slug: string): Promise<Clinic | null> {
  const rows = await rest<Clinic[]>(`clinics?slug=eq.${slug}&status=eq.active`);
  return rows[0] ?? null;
}

export async function getDoctorsByClinic(clinicId: string): Promise<Doctor[]> {
  return rest<Doctor[]>(`doctors?clinic_id=eq.${clinicId}`);
}

export async function getProceduresByClinic(clinicId: string): Promise<Procedure[]> {
  return rest<Procedure[]>(
    `procedures?clinic_id=eq.${clinicId}&order=base_price_usd.asc`
  );
}

export async function getApprovedReviews(clinicId: string): Promise<Review[]> {
  return rest<Review[]>(
    `reviews?clinic_id=eq.${clinicId}&status=eq.approved&order=created_at.desc`
  );
}

export async function getCityBenchmark(
  country: string,
  city: string
): Promise<CityBenchmark | null> {
  const rows = await rest<CityBenchmark[]>(
    `city_pricing_benchmarks?country=eq.${country}&city=eq.${city}`
  );
  return rows[0] ?? null;
}

export async function listCityBenchmarks(): Promise<CityBenchmark[]> {
  return rest<CityBenchmark[]>("city_pricing_benchmarks?order=city.asc");
}
