import Link from "next/link";
import { listActiveClinics, listCityBenchmarks } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { HeroSearch } from "@/components/HeroSearch";

export const revalidate = 300;

export default async function HomePage() {
  const [clinics, cities] = await Promise.all([
    listActiveClinics({ limit: 6 }),
    listCityBenchmarks(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
          <svg
            className="absolute inset-0 h-full w-full opacity-30"
            viewBox="0 0 1200 600"
            fill="none"
          >
            <defs>
              <radialGradient id="g" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#6bfb9a" stopOpacity=".25" />
                <stop offset="100%" stopColor="#0e0e0e" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="1200" height="600" fill="url(#g)" />
          </svg>
        </div>

        <div className="mx-auto max-w-6xl px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:px-8">
          <h1 className="mx-auto max-w-4xl text-center font-headline text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
            Compara confianza, costo total y{" "}
            <em className="not-italic text-primary">calidad clínica</em>{" "}
            antes de viajar.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-fg sm:text-lg">
            Conectamos pacientes con proveedores verificados mediante nuestro Trust
            Score público de 0–100 y métricas de seguridad del paciente.
          </p>

          <div className="mt-10">
            <HeroSearch cities={cities} />
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-fg">
            <span className="chip">JCI Acreditadas</span>
            <span className="chip">ISO 9001</span>
            <span className="chip">Pacientes verificados</span>
            <span className="chip">Vault médico seguro</span>
          </div>
        </div>
      </section>

      {/* Featured clinics */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-headline text-3xl font-bold">
              Featured Trusted Clinics
            </h2>
            <p className="mt-2 max-w-xl text-sm text-muted-fg">
              Proveedores vetados por nuestro equipo con Trust Score transparente y
              métricas de seguridad del paciente.
            </p>
          </div>
          <Link
            href="/buscar"
            className="hidden text-sm font-semibold text-primary hover:underline sm:block"
          >
            Ver todas las clínicas →
          </Link>
        </div>

        {clinics.length === 0 ? (
          <p className="mt-8 text-muted-fg">
            Cargando clínicas… En breve mostraremos los destinos disponibles.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {clinics.map((c) => (
              <ClinicCard key={c.id} clinic={c} />
            ))}
          </div>
        )}
      </section>

      {/* Trust score explainer */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="card overflow-hidden">
          <div className="grid gap-0 p-8 sm:grid-cols-[1.2fr_1fr] sm:p-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                Nuestra fórmula pública
              </p>
              <h3 className="mt-3 font-headline text-3xl font-bold">
                ¿Cómo funciona el Trust Score?
              </h3>
              <p className="mt-4 max-w-lg text-muted-fg">
                Combinamos certificaciones verificables (40%), reseñas de pacientes
                reales (30%) y experiencia clínica (30%), con un multiplicador por
                transparencia. Cada número es auditable.
              </p>
              <Link href="/trust-score" className="btn-ghost mt-6 w-fit">
                Ver la fórmula completa
              </Link>
            </div>
            <ul className="space-y-3 text-sm">
              <TrustPill weight="40%" label="Certificaciones verificables (JCI, ISO)" />
              <TrustPill weight="30%" label="Reseñas verificadas de pacientes" />
              <TrustPill weight="30%" label="Experiencia y trayectoria" />
              <TrustPill weight="0.85–1.0×" label="Multiplicador de transparencia" muted />
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

function TrustPill({
  weight,
  label,
  muted,
}: {
  weight: string;
  label: string;
  muted?: boolean;
}) {
  return (
    <li className="flex items-center justify-between rounded-2xl border border-outline-variant/30 bg-surface px-4 py-3">
      <span className={muted ? "text-muted-fg" : "text-foreground"}>{label}</span>
      <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-bold text-primary">
        {weight}
      </span>
    </li>
  );
}
