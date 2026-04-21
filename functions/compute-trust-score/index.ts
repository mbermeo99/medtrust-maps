// Edge Function: compute-trust-score
// Recalcula el Trust Score v1 de una clínica (§11 del PRD).
// Input:  { clinic_id: string }
// Output: { score, breakdown }

// ----------------------------------------------------------------------------
// Admin DB helper: PostgREST-style a través de /api/database/records/:table
// con Bearer = API_KEY (bypasea RLS).
// ----------------------------------------------------------------------------
// @ts-ignore deno
const BASE = Deno.env.get('INSFORGE_BASE_URL');
// @ts-ignore deno
const KEY = Deno.env.get('API_KEY');
const HDRS = { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' };

async function dbSelect(table: string, query: string): Promise<any[]> {
  const res = await fetch(`${BASE}/api/database/records/${table}?${query}`, { headers: HDRS });
  if (!res.ok) throw new Error(`select ${table} failed: ${res.status} ${await res.text()}`);
  return await res.json();
}
async function dbUpdate(table: string, query: string, body: any): Promise<void> {
  const res = await fetch(`${BASE}/api/database/records/${table}?${query}`, {
    method: 'PATCH',
    headers: HDRS,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`update ${table} failed: ${res.status} ${await res.text()}`);
}

// ----------------------------------------------------------------------------
// Domain (puro)
// ----------------------------------------------------------------------------
type Clinic = {
  id: string;
  year_established: number | null;
  certifications: Array<{ name: string; verified: boolean }> | null;
  photos: string[] | null;
};
type Doctor = { years_experience: number | null; license_verified: boolean; bio: string | null };
type Review = {
  rating_overall: number;
  rating_cleanliness: number | null;
  rating_staff: number | null;
  rating_result: number | null;
  rating_price_transparency: number | null;
  verified_patient: boolean;
};

export function computeCertificationsScore(certs: Clinic['certifications'], doctors: Doctor[]): number {
  const pts: Record<string, number> = { JCI: 50, ISO_9001: 20, ISO9001: 20, NATIONAL: 25, INSURANCE: 10 };
  let total = 0;
  for (const c of certs || []) {
    if (!c.verified) continue;
    const key = (c.name || '').toUpperCase().replace(/[^A-Z0-9]/g, '_');
    if (pts[key]) total += pts[key];
  }
  if (doctors.some((d) => d.license_verified)) total += 20;
  return Math.min(100, total);
}

export function computeReviewsScore(reviews: Review[]): number {
  if (!reviews || reviews.length === 0) return 0;
  const w = { overall: 0.4, result: 0.25, price: 0.15, staff: 0.1, cleanliness: 0.1 };
  const avg =
    reviews.reduce((acc, r) => {
      const o = r.rating_overall;
      return (
        acc +
        w.overall * o +
        w.result * (r.rating_result ?? o) +
        w.price * (r.rating_price_transparency ?? o) +
        w.staff * (r.rating_staff ?? o) +
        w.cleanliness * (r.rating_cleanliness ?? o)
      );
    }, 0) / reviews.length;

  const verifiedPct = reviews.filter((r) => r.verified_patient).length / reviews.length;
  let bonus = 1.0;
  if (verifiedPct >= 0.7) bonus = 1.15;
  else if (verifiedPct >= 0.3) bonus = 1.0 + ((verifiedPct - 0.3) / 0.4) * 0.15;

  const n = reviews.length;
  const volume = n >= 20 ? 1.0 : n >= 5 ? 0.8 : n >= 1 ? 0.5 : 0;

  return Math.max(0, Math.min(100, avg * 20 * bonus * volume));
}

export function computeExperienceScore(clinic: Clinic, doctors: Doctor[]): number {
  const years = clinic.year_established
    ? Math.max(0, new Date().getUTCFullYear() - clinic.year_established)
    : 0;
  const docYears =
    doctors.length > 0
      ? doctors.reduce((a, d) => a + (d.years_experience || 0), 0) / doctors.length
      : 0;
  return Math.max(0, Math.min(100, years * 3 + docYears * 4));
}

export function computeTransparencyMultiplier(
  clinic: Clinic,
  hasPrice: boolean,
  doctors: Doctor[]
): number {
  let m = 1.0;
  if (!hasPrice) m -= 0.05;
  if (!clinic.photos || clinic.photos.length < 5) m -= 0.03;
  if (!doctors.some((d) => (d.bio || '').length > 60)) m -= 0.04;
  return Math.max(0.85, m);
}

export function assembleScore(p: { cert: number; rev: number; exp: number; mult: number }): number {
  const raw = 0.4 * p.cert + 0.3 * p.rev + 0.3 * p.exp;
  return Math.max(0, Math.min(100, Math.round(raw * p.mult * 100) / 100));
}

// ----------------------------------------------------------------------------
// Handler
// ----------------------------------------------------------------------------
export default async function (req: Request): Promise<Response> {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Content-Type': 'application/json',
  };
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  if (req.method !== 'POST')
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), { status: 405, headers: cors });

  let body: { clinic_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid_json' }), { status: 400, headers: cors });
  }
  if (!body.clinic_id)
    return new Response(JSON.stringify({ error: 'clinic_id_required' }), { status: 400, headers: cors });

  try {
    const clinicRows = await dbSelect('clinics', `id=eq.${body.clinic_id}`);
    if (!clinicRows.length)
      return new Response(JSON.stringify({ error: 'clinic_not_found' }), { status: 404, headers: cors });
    const clinic = clinicRows[0] as Clinic;

    const [doctors, reviews, procedures] = await Promise.all([
      dbSelect('doctors', `clinic_id=eq.${body.clinic_id}`),
      dbSelect('reviews', `clinic_id=eq.${body.clinic_id}&status=eq.approved`),
      dbSelect('procedures', `clinic_id=eq.${body.clinic_id}&select=base_price_usd`),
    ]);

    const hasPrice = (procedures as any[]).some((p) => p.base_price_usd != null);

    const cert = computeCertificationsScore(clinic.certifications, doctors as Doctor[]);
    const rev = computeReviewsScore(reviews as Review[]);
    const exp = computeExperienceScore(clinic, doctors as Doctor[]);
    const mult = computeTransparencyMultiplier(clinic, hasPrice, doctors as Doctor[]);
    const score = assembleScore({ cert, rev, exp, mult });
    const breakdown = { certifications: cert, reviews: rev, experience: exp, transparency_multiplier: mult };

    await dbUpdate('clinics', `id=eq.${body.clinic_id}`, {
      trust_score: score,
      trust_score_breakdown: breakdown,
      trust_score_updated_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ score, breakdown }), { status: 200, headers: cors });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'internal', detail: e.message }), { status: 500, headers: cors });
  }
}
