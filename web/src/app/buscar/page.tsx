import { listActiveClinics, getCityBenchmark } from "@/lib/data";
import { ClinicCard } from "@/components/ClinicCard";
import { SearchResults } from "@/components/SearchResults";

export const revalidate = 120;

type SP = {
  especialidad?: string;
  pais?: string;
  ciudad?: string;
  min_trust?: string;
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SP;
}) {
  const country = searchParams.pais;
  const city = searchParams.ciudad;
  const minTrust = searchParams.min_trust ? Number(searchParams.min_trust) : undefined;

  const [clinics, benchmark] = await Promise.all([
    listActiveClinics({ country, city, minTrust }),
    country && city ? getCityBenchmark(country, city) : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-fg">
            {country && city ? `${city}, ${country}` : "Todas las ubicaciones"}
          </p>
          <h1 className="mt-1 font-headline text-3xl font-bold">
            {specialtyLabel(searchParams.especialidad)}
          </h1>
          <p className="mt-1 text-sm text-muted-fg">
            {clinics.length} clínicas premium encontradas
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="chip">
            <span className="text-primary">●</span> Filtros
          </span>
          <span className="chip">All-on-4</span>
          <span className="chip">Price: Low–High</span>
        </div>
      </div>

      {clinics.length === 0 ? (
        <div className="card mt-10 p-10 text-center">
          <p className="font-headline text-xl">No hay clínicas aún en este destino.</p>
          <p className="mt-2 text-sm text-muted-fg">
            Estamos incorporando más clínicas activamente — vuelve pronto.
          </p>
        </div>
      ) : (
        <SearchResults
          clinics={clinics.map((c) => ({
            ...c,
            _starting_price_usd: null,
          }))}
          benchmark={benchmark}
        />
      )}
    </div>
  );
}

function specialtyLabel(code?: string) {
  const map: Record<string, string> = {
    dental_implant: "Implantes dentales",
    hair_transplant: "Trasplante capilar",
    bariatric: "Cirugía bariátrica",
    aesthetic: "Cirugía estética",
    orthopedic: "Cirugía ortopédica",
  };
  return code ? map[code] ?? "Procedimientos" : "Clínicas verificadas";
}
