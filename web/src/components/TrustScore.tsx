import clsx from "clsx";

export function TrustScore({
  score,
  size = "md",
}: {
  score: number;
  size?: "sm" | "md" | "lg";
}) {
  const color =
    score >= 85
      ? "text-primary"
      : score >= 70
        ? "text-accent"
        : "text-muted-fg";
  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-lg px-4 py-2",
  } as const;
  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1 rounded-full bg-primary/10 font-bold",
        color,
        sizes[size]
      )}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2l3 7h7l-5.5 4.5 2 7.5L12 17l-6.5 4 2-7.5L2 9h7z" />
      </svg>
      {score.toFixed(1)}
    </span>
  );
}

export function TrustBreakdownCard({
  score,
  breakdown,
}: {
  score: number;
  breakdown: {
    certifications: number;
    reviews: number;
    experience: number;
    transparency_multiplier: number;
  } | null;
}) {
  if (!breakdown) {
    return (
      <div className="card p-6">
        <p className="text-sm text-muted-fg">
          El desglose del Trust Score aún no se ha calculado.
        </p>
      </div>
    );
  }
  const items = [
    { label: "Certificaciones", value: breakdown.certifications, weight: "40%" },
    { label: "Reseñas", value: breakdown.reviews, weight: "30%" },
    { label: "Experiencia", value: breakdown.experience, weight: "30%" },
  ];
  return (
    <div className="card p-6">
      <div className="flex items-baseline justify-between">
        <h3 className="font-headline text-2xl font-bold">Trust Score</h3>
        <span className="font-headline text-4xl font-bold text-primary">
          {score.toFixed(1)}
          <span className="text-base text-muted-fg">/100</span>
        </span>
      </div>
      <div className="mt-6 space-y-4">
        {items.map((it) => (
          <div key={it.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="text-muted-fg">
                {it.label}{" "}
                <span className="text-xs">(peso {it.weight})</span>
              </span>
              <span className="font-semibold">{it.value.toFixed(0)}/100</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-high">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.min(100, Math.max(0, it.value))}%` }}
              />
            </div>
          </div>
        ))}
        <div className="border-t border-outline-variant/20 pt-4 text-xs text-muted-fg">
          Multiplicador de transparencia:{" "}
          <span className="text-foreground">
            {breakdown.transparency_multiplier.toFixed(2)}×
          </span>
        </div>
      </div>
    </div>
  );
}
