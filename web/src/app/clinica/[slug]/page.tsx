import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getClinicBySlug,
  getDoctorsByClinic,
  getProceduresByClinic,
  getApprovedReviews,
  getCityBenchmark,
} from "@/lib/data";
import { TrustBreakdownCard, TrustScore } from "@/components/TrustScore";
import { CostCalculator } from "@/components/CostCalculator";
import type { Metadata } from "next";

export const revalidate = 120;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const clinic = await getClinicBySlug(params.slug);
  if (!clinic) return { title: "Clínica no encontrada" };
  return {
    title: `${clinic.name} — Trust Score ${clinic.trust_score.toFixed(0)} | MedTrust`,
    description: clinic.description?.slice(0, 160) ?? undefined,
  };
}

export default async function ClinicPage({
  params,
}: {
  params: { slug: string };
}) {
  const clinic = await getClinicBySlug(params.slug);
  if (!clinic) notFound();

  const [doctors, procedures, reviews, benchmark] = await Promise.all([
    getDoctorsByClinic(clinic.id),
    getProceduresByClinic(clinic.id),
    getApprovedReviews(clinic.id),
    getCityBenchmark(clinic.country, clinic.city),
  ]);

  const startingPrice = procedures
    .map((p) => p.base_price_usd)
    .filter((n): n is number => n != null)
    .sort((a, b) => a - b)[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/buscar" className="text-sm text-muted-fg hover:text-primary">
        ← Volver a resultados
      </Link>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        {/* Main col */}
        <div>
          {/* Hero */}
          <div className="card overflow-hidden">
            <div
              className="relative aspect-[16/9] w-full"
              style={
                clinic.photos[0]
                  ? {
                      backgroundImage: `linear-gradient(to top, rgba(19,19,19,.95) 0%, rgba(19,19,19,.1) 60%), url(${clinic.photos[0]})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }
                  : { background: "linear-gradient(135deg,#1c1b1b,#2a2a2a)" }
              }
            >
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                  Verified Excellence
                </p>
                <h1 className="mt-2 font-headline text-3xl font-bold sm:text-4xl">
                  {clinic.name}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-fg">
                  <TrustScore score={clinic.trust_score} size="lg" />
                  <span>·</span>
                  <span>{clinic.city}, {clinic.country}</span>
                  {clinic.year_established && (
                    <>
                      <span>·</span>
                      <span>Desde {clinic.year_established}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* About */}
          {clinic.description && (
            <section className="mt-8">
              <h2 className="font-headline text-2xl font-bold">Sobre la clínica</h2>
              <p className="mt-3 whitespace-pre-wrap text-muted-fg">{clinic.description}</p>
              <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <Stat label="Idiomas" value={clinic.languages_spoken.join(", ").toUpperCase() || "—"} />
                <Stat label="Fundación" value={clinic.year_established?.toString() ?? "—"} />
                <Stat label="Doctores" value={doctors.length.toString()} />
                <Stat label="Procedimientos" value={procedures.length.toString()} />
              </div>
            </section>
          )}

          {/* Doctors */}
          {doctors.length > 0 && (
            <section className="mt-10">
              <h2 className="font-headline text-2xl font-bold">Especialistas</h2>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {doctors.map((d) => (
                  <div key={d.id} className="card p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/15 font-bold text-primary">
                        {d.full_name
                          .split(" ")
                          .map((w) => w[0])
                          .slice(0, 2)
                          .join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold">{d.full_name}</h3>
                        {d.title && <p className="text-xs text-muted-fg">{d.title}</p>}
                        {d.years_experience && (
                          <p className="mt-1 text-xs text-muted-fg">
                            {d.years_experience} años de experiencia
                          </p>
                        )}
                        {d.license_verified && (
                          <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                            ✓ Licencia verificada
                          </span>
                        )}
                      </div>
                    </div>
                    {d.bio && (
                      <p className="mt-4 line-clamp-3 text-sm text-muted-fg">{d.bio}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Procedures */}
          {procedures.length > 0 && (
            <section className="mt-10">
              <h2 className="font-headline text-2xl font-bold">Procedimientos y precios</h2>
              <div className="mt-5 grid gap-3">
                {procedures.map((p) => (
                  <div
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-outline-variant/30 bg-surface-low p-5"
                  >
                    <div>
                      <h3 className="font-semibold">{p.title}</h3>
                      {p.description && (
                        <p className="mt-1 max-w-xl text-sm text-muted-fg">
                          {p.description}
                        </p>
                      )}
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {p.includes.map((i) => (
                          <span key={i} className="chip text-[10px]">
                            {i.replace(/_/g, " ")}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-headline text-2xl font-bold text-primary">
                        {p.base_price_usd
                          ? `$${p.base_price_usd.toLocaleString("en-US")}`
                          : "—"}
                      </p>
                      <p className="text-xs text-muted-fg">
                        {p.stay_required_nights
                          ? `${p.stay_required_nights} noches`
                          : "Consultar"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Reviews */}
          <section className="mt-10">
            <h2 className="font-headline text-2xl font-bold">
              Reseñas verificadas ({reviews.length})
            </h2>
            {reviews.length === 0 ? (
              <p className="mt-3 text-sm text-muted-fg">
                Aún no hay reseñas aprobadas para esta clínica.
              </p>
            ) : (
              <div className="mt-5 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="card p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-primary">{r.rating_overall}.0</span>
                        <span aria-hidden>⭐</span>
                        {r.verified_patient && (
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary">
                            Paciente verificado
                          </span>
                        )}
                      </div>
                      <time className="text-xs text-muted-fg">
                        {new Date(r.created_at).toLocaleDateString()}
                      </time>
                    </div>
                    {r.title && <h3 className="mt-2 font-semibold">{r.title}</h3>}
                    {r.body && <p className="mt-1 text-sm text-muted-fg">{r.body}</p>}
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sticky side */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="card p-6">
            <h3 className="font-headline text-xl font-bold">Package Estimate</h3>
            <p className="mt-1 text-xs text-muted-fg">
              Cirugía + hotel + comidas + seguro + contingencia (10%)
            </p>
            <div className="mt-4">
              <CostCalculator
                startingPriceUsd={startingPrice ?? null}
                benchmark={benchmark}
                defaultNights={7}
              />
            </div>
            <div className="mt-5 flex flex-col gap-2">
              <Link href="/mi-cuenta/vault" className="btn-primary w-full">
                Subir estudios para cotización
              </Link>
              <a href={clinic.website ?? "#"} target="_blank" rel="noreferrer" className="btn-ghost w-full">
                Contactar clínica
              </a>
            </div>
          </div>

          <TrustBreakdownCard
            score={clinic.trust_score}
            breakdown={clinic.trust_score_breakdown ?? null}
          />

          {clinic.certifications.length > 0 && (
            <div className="card p-6">
              <h3 className="font-headline text-lg font-bold">Certificaciones</h3>
              <ul className="mt-4 space-y-2 text-sm">
                {clinic.certifications.map((c) => (
                  <li key={c.name} className="flex items-center justify-between">
                    <span className="font-medium">{c.name}</span>
                    {c.verified ? (
                      <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary">
                        ✓ Verificada
                      </span>
                    ) : (
                      <span className="text-xs text-muted-fg">No verificada</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-outline-variant/30 bg-surface-low p-4">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-fg">
        {label}
      </p>
      <p className="mt-1 font-headline text-lg font-bold">{value}</p>
    </div>
  );
}
