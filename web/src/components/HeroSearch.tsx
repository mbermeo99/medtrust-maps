"use client";

import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import type { CityBenchmark } from "@/lib/types";

const SPECIALTIES = [
  { code: "dental_implant", label: "Implantes dentales" },
  { code: "hair_transplant", label: "Trasplante capilar" },
  { code: "bariatric", label: "Cirugía bariátrica" },
  { code: "aesthetic", label: "Cirugía estética" },
  { code: "orthopedic", label: "Cirugía ortopédica" },
];

export function HeroSearch({ cities }: { cities: CityBenchmark[] }) {
  const router = useRouter();
  const [specialty, setSpecialty] = useState("dental_implant");
  const [cityKey, setCityKey] = useState(
    cities[0] ? `${cities[0].country}|${cities[0].city}` : "MX|Cancun"
  );

  const destinations = useMemo(
    () => cities.map((c) => ({ key: `${c.country}|${c.city}`, label: `${c.city}, ${c.country}` })),
    [cities]
  );

  const onSearch = () => {
    const [country, city] = cityKey.split("|");
    const q = new URLSearchParams({
      especialidad: specialty,
      pais: country,
      ciudad: city,
    });
    router.push(`/buscar?${q.toString()}`);
  };

  return (
    <div className="card mx-auto flex max-w-3xl flex-col gap-3 p-3 sm:flex-row sm:items-center sm:gap-0 sm:p-2">
      <SelectBlock
        label="Especialidad"
        icon="🩺"
        value={specialty}
        onChange={setSpecialty}
        options={SPECIALTIES.map((s) => ({ value: s.code, label: s.label }))}
      />
      <div className="hidden h-10 w-px bg-outline-variant/20 sm:block" />
      <SelectBlock
        label="Destino"
        icon="📍"
        value={cityKey}
        onChange={setCityKey}
        options={
          destinations.length > 0
            ? destinations.map((d) => ({ value: d.key, label: d.label }))
            : [{ value: "MX|Cancun", label: "Cancún, MX" }]
        }
      />
      <button onClick={onSearch} className="btn-primary sm:ml-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        Find My Map
      </button>
    </div>
  );
}

function SelectBlock({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string;
  icon: string;
  value: string;
  onChange: (v: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="flex flex-1 items-center gap-3 rounded-2xl px-4 py-3 hover:bg-surface/60">
      <span aria-hidden className="text-lg">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-fg">
          {label}
        </p>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full truncate bg-transparent text-sm font-semibold text-foreground focus:outline-none"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-surface text-foreground">
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </label>
  );
}
