import Link from "next/link";
import type { Clinic } from "@/lib/types";
import { TrustScore } from "./TrustScore";

export function ClinicCard({
  clinic,
  startingPriceUsd,
}: {
  clinic: Clinic;
  startingPriceUsd?: number | null;
}) {
  return (
    <Link
      href={`/clinica/${clinic.slug}`}
      className="card group relative overflow-hidden transition hover:border-primary/50 hover:shadow-glow"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-surface-high to-surface-low transition group-hover:scale-105"
          style={
            clinic.photos?.[0]
              ? {
                  backgroundImage: `linear-gradient(to top, rgba(19,19,19,.9), rgba(19,19,19,.2)), url(${clinic.photos[0]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : undefined
          }
        />
        <div className="absolute right-3 top-3">
          <TrustScore score={clinic.trust_score} size="md" />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-xs uppercase tracking-widest text-muted-fg">
            {clinic.city}, {clinic.country}
          </p>
          <h3 className="mt-1 font-headline text-lg font-bold leading-tight">
            {clinic.name}
          </h3>
        </div>
      </div>
      <div className="flex items-end justify-between px-4 py-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-fg">
            Total package
          </p>
          <p className="font-headline text-xl font-bold text-primary">
            {startingPriceUsd
              ? `desde $${startingPriceUsd.toLocaleString("en-US")}`
              : "Consultar"}
          </p>
        </div>
        <div className="flex gap-1.5 opacity-80">
          {clinic.languages_spoken.slice(0, 3).map((l) => (
            <span key={l} className="chip text-[10px]">
              {l.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
