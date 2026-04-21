"use client";

import { useMemo, useState } from "react";
import type { CityBenchmark } from "@/lib/types";

export function CostCalculator({
  startingPriceUsd,
  benchmark,
  defaultNights = 7,
}: {
  startingPriceUsd: number | null;
  benchmark: CityBenchmark | null;
  defaultNights?: number;
}) {
  const [nights, setNights] = useState(defaultNights);
  const [hotelTier, setHotelTier] = useState<"3" | "4" | "5">("4");
  const [companion, setCompanion] = useState(false);

  const breakdown = useMemo(() => {
    const surgery = startingPriceUsd ?? 0;
    const hotelPerNight = benchmark
      ? hotelTier === "3"
        ? benchmark.hotel_lowrange_usd
        : hotelTier === "5"
          ? benchmark.hotel_highrange_usd
          : benchmark.hotel_avg_usd_per_night
      : 0;
    const hotel = hotelPerNight * nights;
    const people = companion ? 2 : 1;
    const meals = (benchmark?.meals_avg_usd_per_day ?? 0) * nights * people;
    const transport = (benchmark?.transport_avg_usd_per_day ?? 0) * nights;
    const insurance = (benchmark?.medical_insurance_usd_per_week ?? 0) * Math.ceil(nights / 7);
    const subtotal = surgery + hotel + meals + transport + insurance;
    const contingency = Math.round(subtotal * 0.1);
    const total = subtotal + contingency;
    return { surgery, hotel, meals, transport, insurance, contingency, total };
  }, [startingPriceUsd, benchmark, nights, hotelTier, companion]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <Field label="Noches">
          <input
            type="number"
            min={1}
            max={30}
            value={nights}
            onChange={(e) => setNights(Math.max(1, Math.min(30, Number(e.target.value))))}
            className="w-full bg-transparent text-sm font-semibold focus:outline-none"
          />
        </Field>
        <Field label="Hotel">
          <select
            value={hotelTier}
            onChange={(e) => setHotelTier(e.target.value as "3" | "4" | "5")}
            className="w-full bg-transparent text-sm font-semibold focus:outline-none"
          >
            <option value="3" className="bg-surface">3★</option>
            <option value="4" className="bg-surface">4★</option>
            <option value="5" className="bg-surface">5★</option>
          </select>
        </Field>
      </div>
      <label className="flex items-center gap-3 rounded-xl border border-outline-variant/30 bg-surface px-3 py-2 text-sm">
        <input
          type="checkbox"
          checked={companion}
          onChange={(e) => setCompanion(e.target.checked)}
          className="h-4 w-4 accent-primary"
        />
        <span className="text-muted-fg">Viajaré con acompañante</span>
      </label>

      <div className="rounded-2xl border border-outline-variant/30 bg-surface p-4">
        <Row label="Primary Procedure" value={breakdown.surgery} />
        <Row label={`Hotel (${nights} noches · ${hotelTier}★)`} value={breakdown.hotel} />
        <Row label={`Comidas${companion ? " (x2)" : ""}`} value={breakdown.meals} />
        <Row label="Transporte" value={breakdown.transport} />
        <Row label="Seguro médico" value={breakdown.insurance} />
        <Row label="Contingencia (10%)" value={breakdown.contingency} muted />
        <div className="mt-3 flex items-end justify-between border-t border-outline-variant/20 pt-3">
          <span className="text-xs uppercase tracking-widest text-muted-fg">
            Total estimado
          </span>
          <span className="font-headline text-2xl font-bold text-primary">
            ${breakdown.total.toLocaleString("en-US")}
          </span>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="rounded-xl border border-outline-variant/30 bg-surface px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-fg">
        {label}
      </p>
      {children}
    </label>
  );
}

function Row({ label, value, muted }: { label: string; value: number; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between py-1 text-sm">
      <span className={muted ? "text-muted-fg" : "text-foreground/90"}>{label}</span>
      <span className={muted ? "text-muted-fg" : "font-semibold"}>
        ${Math.round(value).toLocaleString("en-US")}
      </span>
    </div>
  );
}
