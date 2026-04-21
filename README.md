# MedTrust Maps — Backend (Insforge)

Backend completo del MVP según `PRD_MedTrust_Maps_MVP.md` (Fase 1).

## URLs

- API REST/Auth/Storage: `https://xuksw7xc.us-east.insforge.app`
- Edge Functions:        `https://xuksw7xc.functions.insforge.app`

## Estructura

```
migrations/
  001_extensions.sql     # postgis, pgcrypto, vector
  002_schema.sql         # 10 tablas + índices + triggers updated_at
  003_rls_policies.sql   # RLS policies (§9.3 PRD)
  004_seeds.sql          # benchmarks + categorías + clínica demo
functions/
  compute-trust-score/   # §11 PRD
  get-upload-url/        # B-03
  validate-upload/       # B-03
  create-share-token/    # B-04
  revoke-share-token/    # B-04
  get-shared-file/       # B-04 (clínica canjea token+OTP)
  on-review-approved/    # B-05 hook → recalc Trust Score
```

## Buckets Storage

| Bucket              | Público | Uso                                   |
|---------------------|---------|---------------------------------------|
| `medical-vault`     | NO      | Archivos médicos del paciente (PDF, XR, DICOM) |
| `clinic-photos`     | SÍ      | Galerías y fotos públicas de clínicas |
| `verification-docs` | NO      | Copias de certificaciones (JCI, ISO)  |

## Tablas y RLS

| Tabla                       | SELECT                 | Write                      |
|-----------------------------|------------------------|----------------------------|
| `clinics`                   | público (status=active)| project_admin              |
| `doctors` / `procedures`    | público si clínica activa | project_admin           |
| `procedure_categories`      | público (active=true)  | project_admin              |
| `city_pricing_benchmarks`   | público                | project_admin              |
| `profiles`                  | propio                 | propio                     |
| `reviews`                   | público (approved)     | insert propio + email verif|
| `medical_vault_files`       | propio                 | propio                     |
| `vault_share_tokens`        | propio (issued_by)     | project_admin              |
| `vault_access_log`          | propio o archivo propio| project_admin              |

## Re-ejecutar migraciones

```bash
# Desde Claude Code (MCP)
# Las migraciones son idempotentes (IF NOT EXISTS / ON CONFLICT).
# Basta con volver a invocar run-raw-sql con cada archivo en orden.
```

## Verificación rápida

```bash
# Trust Score de la clínica demo (debe devolver ~86)
curl -sS -X POST https://xuksw7xc.functions.insforge.app/compute-trust-score \
  -H "Content-Type: application/json" \
  -d '{"clinic_id":"11111111-1111-1111-1111-111111111111"}'

# Listar clínicas públicas con anon key
curl -sS "https://xuksw7xc.us-east.insforge.app/api/database/records/clinics?status=eq.active" \
  -H "Authorization: Bearer $NEXT_PUBLIC_INSFORGE_ANON_KEY"
```

## Env vars importantes

Dentro de las edge functions (inyectadas por Insforge):
- `INSFORGE_BASE_URL` — URL pública del backend
- `INSFORGE_INTERNAL_URL` — URL interna (más rápida entre functions)
- `API_KEY` — admin key (bypasea RLS)
- `ANON_KEY` — JWT anon
- `JWT_SECRET`

Para el frontend: ver `.env.local.example`.

## Demo data

- **Clínica:** `11111111-1111-1111-1111-111111111111` — Smile Cancún Dental
- **Doctor:** Dra. Ana María Pérez (licencia verificada)
- **Procedimientos:** Single implant (USD 950) + All-on-4 (USD 7,900)
- **Reseñas:** 3 aprobadas (2 verified_patient)
- **Trust Score:** 86.04 / 100

## Siguiente fase (frontend)

```bash
npx create-next-app@latest medtrust-web --typescript --tailwind --app
cd medtrust-web
npm install @insforge/sdk@latest mapbox-gl
# lockear tailwind a 3.4 (no upgrade a v4)
```

Usar `NEXT_PUBLIC_INSFORGE_URL` + `NEXT_PUBLIC_INSFORGE_ANON_KEY` en el cliente.
El admin key (`INSFORGE_API_KEY`) se usa **solo** en Server Actions / API Routes.
