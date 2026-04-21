"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import type { Clinic } from "@/lib/types";
import Link from "next/link";

export function ClinicMap({ clinics }: { clinics: Clinic[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
    if (!token) return;
    mapboxgl.accessToken = token;

    const withLoc = clinics.filter((c) => c.lat != null && c.lon != null) as (Clinic & {
      lat: number;
      lon: number;
    })[];
    const center: [number, number] = withLoc[0]
      ? [withLoc[0].lon, withLoc[0].lat]
      : [-86.8316, 21.1619];

    const map = new mapboxgl.Map({
      container: ref.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom: 11,
    });
    mapRef.current = map;

    withLoc.forEach((c) => {
      const el = document.createElement("div");
      el.className =
        "flex items-center gap-1 rounded-full border border-primary/60 bg-surface px-2 py-1 text-xs font-bold text-primary shadow-glow";
      el.innerText = `⭐ ${c.trust_score.toFixed(0)}`;
      new mapboxgl.Marker(el)
        .setLngLat([c.lon, c.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 16, closeButton: false }).setHTML(
            `<div style="font-family:Inter;color:#e5e2e1;background:#131313;padding:10px 14px;border-radius:12px;min-width:200px;border:1px solid rgba(107,251,154,.3)">
              <div style="font-weight:700;font-size:14px">${escapeHtml(c.name)}</div>
              <div style="color:#bccabb;font-size:12px;margin-top:2px">${escapeHtml(c.city)}, ${escapeHtml(c.country)}</div>
              <a href="/clinica/${c.slug}" style="color:#6bfb9a;font-size:12px;margin-top:8px;display:inline-block">Ver clínica →</a>
            </div>`
          )
        )
        .addTo(map);
    });

    if (withLoc.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      withLoc.forEach((c) => bounds.extend([c.lon, c.lat]));
      map.fitBounds(bounds, { padding: 60, maxZoom: 13 });
    }

    return () => {
      map.remove();
    };
  }, [clinics]);

  return <div ref={ref} className="h-[600px] w-full overflow-hidden rounded-2xl border border-outline-variant/30" />;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
