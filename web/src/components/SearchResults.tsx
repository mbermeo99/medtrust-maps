"use client";

import { useState } from "react";
import type { Clinic, CityBenchmark } from "@/lib/types";
import dynamic from "next/dynamic";
import { ClinicCard } from "./ClinicCard";

const ClinicMap = dynamic(() => import("./ClinicMap").then((m) => m.ClinicMap), {
  ssr: false,
  loading: () => (
    <div className="card flex h-[600px] items-center justify-center text-muted-fg">
      Cargando mapa…
    </div>
  ),
});

type ClinicWithPrice = Clinic & { _starting_price_usd?: number | null };

export function SearchResults({
  clinics,
  benchmark,
}: {
  clinics: ClinicWithPrice[];
  benchmark: CityBenchmark | null;
}) {
  const [view, setView] = useState<"list" | "map">("list");
  const hasMapbox = !!process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  return (
    <div className="mt-6">
      <div className="flex items-center gap-2">
        <button
          className={tab(view === "list")}
          onClick={() => setView("list")}
          aria-pressed={view === "list"}
        >
          Lista
        </button>
        <button
          className={tab(view === "map")}
          onClick={() => setView("map")}
          aria-pressed={view === "map"}
        >
          Mapa
        </button>
        {benchmark && (
          <span className="chip ml-auto">
            Hotel promedio {benchmark.city}: ${benchmark.hotel_avg_usd_per_night}/noche
          </span>
        )}
      </div>

      {view === "list" ? (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {clinics.map((c) => (
            <ClinicCard key={c.id} clinic={c} startingPriceUsd={c._starting_price_usd} />
          ))}
        </div>
      ) : (
        <div className="mt-6">
          {hasMapbox ? (
            <ClinicMap clinics={clinics} />
          ) : (
            <div className="card p-8 text-center">
              <h3 className="font-headline text-xl font-bold">Mapa no disponible</h3>
              <p className="mt-2 text-sm text-muted-fg">
                Configura <code className="text-primary">NEXT_PUBLIC_MAPBOX_TOKEN</code> en
                tu <code>.env.local</code> para ver el mapa interactivo.
              </p>
              <div className="mt-6 grid gap-2 text-left">
                {clinics.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl border border-outline-variant/30 bg-surface-low px-4 py-3"
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-muted-fg">
                      {c.lat && c.lon
                        ? `${c.lat.toFixed(3)}, ${c.lon.toFixed(3)}`
                        : "Sin coordenadas"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function tab(active: boolean) {
  return [
    "rounded-full px-5 py-2 text-sm font-semibold transition",
    active
      ? "bg-primary text-on-primary shadow-glow"
      : "border border-outline-variant text-muted-fg hover:text-foreground",
  ].join(" ");
}
