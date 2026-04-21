# MedTrust Maps — Frontend (Next.js 14)

## Stack

- Next.js 14 App Router + TypeScript
- Tailwind 3.4 con tema **Midnight Mint** (palette `#6bfb9a` sobre fondos `#0e0e0e/#131313`)
- `@insforge/sdk` para auth + DB + functions
- Mapbox GL JS (lazy-loaded en vista mapa)

## Rutas

| Ruta | Tipo | Descripción |
|---|---|---|
| `/` | ISR 300s | Home con hero + featured clinics |
| `/buscar` | SSR | Lista + mapa de clínicas (query filters) |
| `/clinica/[slug]` | ISR 120s | Perfil: hero, doctores, procedures, reviews, Trust Score, calculadora |
| `/mi-cuenta/login` | Client | Signup/login email+pass o Google OAuth |
| `/mi-cuenta/verify` | Client | Verificación de email con OTP 6 dígitos |
| `/mi-cuenta/vault` | Client (auth) | Upload / compartir / revocar archivos médicos |

## Dev

```bash
cp .env.local.example .env.local     # rellenar con el anon key + api key
npm install
npm run dev                          # http://localhost:3000
```

## Build

```bash
npm run build && npm start
```

## Deploy en Vercel

1. Push de la carpeta `web/` a un repo Git.
2. Vercel → New Project → importar el repo.
3. **Root Directory** = `web`.
4. Environment variables (Production + Preview):
   - `NEXT_PUBLIC_INSFORGE_URL`
   - `NEXT_PUBLIC_INSFORGE_ANON_KEY`
   - `NEXT_PUBLIC_INSFORGE_FUNCTIONS_URL`
   - `INSFORGE_API_KEY` (secret)
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
5. En **Insforge Dashboard → Auth → Allowed redirect URLs** añadir:
   - `https://<dominio>.vercel.app/mi-cuenta/vault`
   - `https://<dominio>.vercel.app/mi-cuenta/verify`
   - `https://<dominio>.vercel.app/mi-cuenta/login`
6. Deploy. `vercel.json` ya define headers básicos de seguridad.

## Arquitectura de datos

- **Lecturas públicas** (clínicas, doctores, procedures, reviews `approved`, benchmarks) — anon key vía `fetch` a `/api/database/records/…`, respetando RLS.
- **Operaciones del paciente** (vault) — JWT del usuario vía `@insforge/sdk` con RLS `user_id = auth.uid()`.
- **Operaciones de dominio** (Trust Score, upload URL, share token) — Edge Functions, invocadas con `fetch(FUNCTIONS_URL/<slug>)` + JWT.
- **Admin API key** — reservado para Server Actions admin futuros.

## Estructura

```
src/
├── app/
│   ├── buscar/page.tsx
│   ├── clinica/[slug]/page.tsx
│   ├── mi-cuenta/{login,verify,vault}/page.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx, Footer.tsx
│   ├── HeroSearch.tsx, ClinicCard.tsx, ClinicMap.tsx, SearchResults.tsx
│   ├── CostCalculator.tsx, TrustScore.tsx
└── lib/
    ├── insforge.ts       # SDK + helpers
    ├── data.ts           # fetchers REST públicos
    ├── auth-hooks.ts     # useCurrentUser, getAccessToken
    └── types.ts
```

## TODO siguiente

- Persistir snapshots de la calculadora (métricas F-03).
- Panel admin `/admin/*` para moderación manual.
- i18n ES/EN (next-intl) + hreflang.
- Schema.org JSON-LD en `/clinica/[slug]`.
- Realtime hook sobre `vault_access_log`.
