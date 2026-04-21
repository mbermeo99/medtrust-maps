# PRD — MedTrust Maps (MVP)

> **Documento de Requisitos de Producto**
> Versión: 1.1 · Estado: Draft · Última actualización: 2026-04-20
> **Changelog:** v1.1 — Backend migrado de FastAPI + Supabase a **Insforge** (BaaS MCP-native).

---

## Control del Documento

| Campo | Valor |
|---|---|
| Nombre del producto | MedTrust Maps |
| Tipo de producto | Marketplace / SaaS B2B2C |
| Fase | MVP (v0.1) |
| Owner | Product Lead |
| Stakeholders | Product, Tech, Legal, Medical Advisory Board |
| Horizonte del MVP | 5–6 semanas |

---

## 1. Resumen Ejecutivo

**MedTrust Maps** es una plataforma web y mobile-first que funciona como el **"TripAdvisor verificado" del turismo médico**. Resuelve el problema central de la industria —la desconfianza del paciente internacional— combinando tres capas de valor:

1. **Transparencia de costos total** (cirugía + estadía + seguro + traslados).
2. **Trust Score algorítmico** basado en certificaciones verificables, reseñas de pacientes reales y trayectoria del profesional.
3. **Vault médico seguro** para que el paciente comparta estudios (rayos X, exámenes) y obtenga pre-evaluaciones sin exponer su información personal en canales inseguros (WhatsApp, email).

El MVP se enfoca en **un solo vertical** (sugerido: implantología dental) y **uno a tres destinos** (ej. Cancún, Bogotá, San José), para validar hipótesis antes de escalar a cirugía capilar, bariátrica, estética y ortopédica.

---

## 2. Contexto y Problema

### 2.1 La oportunidad

El turismo médico mueve decenas de miles de millones de dólares al año globalmente, con LATAM como receptor clave de pacientes de EE.UU., Canadá y Europa. Sin embargo, el mercado está dominado por intermediarios opacos (agencias y facilitadores) que cobran comisiones sin rendir cuentas de la calidad clínica.

### 2.2 Problemas actuales del paciente

| Problema | Síntoma | Impacto |
|---|---|---|
| **Desconfianza** | No sabe si la clínica es segura o certificada | Decisión postergada o abandonada |
| **Opacidad de costos** | Cotizaciones por WhatsApp, sin desglose | Sorpresas de +30% al llegar al país |
| **Reseñas poco creíbles** | Comentarios de Google posiblemente comprados | Pérdida de confianza |
| **Canal inseguro** | Envía estudios médicos por email/WhatsApp | Exposición de datos sensibles |
| **Sin comparación real** | Cada clínica responde en distinto formato | Difícil tomar decisión informada |

### 2.3 Problemas de la clínica

- Alto costo de adquisición de pacientes internacionales.
- Leads de baja calidad (sin estudios, solo curiosos).
- Competencia desleal por precio sin diferenciación por calidad.

### 2.4 Por qué ahora

- Pacientes internacionales nativos digitales esperan experiencias tipo Booking/Airbnb.
- IA abarata la verificación de documentos y la generación de pre-evaluaciones.
- Post-pandemia, la telemedicina normalizó la consulta remota previa al viaje.

---

## 3. Visión, Misión y Objetivos

### 3.1 Visión

> Ser el estándar global de confianza del turismo médico: que ningún paciente viaje sin haber pasado por MedTrust.

### 3.2 Misión

Reducir la asimetría de información entre pacientes y clínicas mediante **datos verificables, transparencia radical de costos y un canal seguro de información médica**.

### 3.3 Objetivos del MVP (6 semanas)

| Objetivo | Métrica objetivo MVP |
|---|---|
| Validar demanda | ≥ 500 búsquedas únicas |
| Validar confianza | ≥ 50 archivos subidos al Vault |
| Validar conversión | ≥ 30 clics "Contactar clínica" |
| Validar oferta | 50 clínicas cargadas, 10 con Trust Score ≥ 80 |
| Aprendizaje cualitativo | ≥ 15 entrevistas con usuarios que buscaron |

---

## 4. Usuarios Objetivo (Buyer Personas)

### 4.1 Persona primaria — "Carlos el comparador"

- **Edad:** 42–58
- **Ubicación:** EE.UU. (Texas, California, Florida) o Canadá.
- **Contexto:** Sin seguro dental, necesita implantes (~USD 30K en EE.UU.).
- **Comportamiento:** Investiga 2–6 semanas en Google, Reddit, YouTube antes de decidir.
- **Jobs to be done:**
  1. Saber si la clínica extranjera es tan buena como las de su país.
  2. Calcular el costo **total** para comparar con el costo local.
  3. Sentirse seguro compartiendo sus estudios médicos.
- **Frustraciones:** Respuestas vagas por WhatsApp; miedo a estafas; idioma.

### 4.2 Persona secundaria — "Marcela la clínica"

- **Rol:** Dueña o Directora comercial de clínica dental en Cancún con 3 doctores.
- **Jobs to be done:**
  1. Captar leads internacionales cualificados sin pagar Google Ads carísimos.
  2. Diferenciarse por calidad, no por precio.
  3. Recibir estudios del paciente **antes** de la llamada para ahorrar tiempo.

### 4.3 Persona terciaria (futura, no-MVP) — "Luis el facilitador"

- Facilitador/agencia que gestiona paquetes completos. Lo mencionamos para no diseñarnos en una esquina: el MVP no le da herramientas, pero tampoco lo bloquea.

---

## 5. Propuesta de Valor

**Para pacientes internacionales** que no confían en las opciones actuales de turismo médico, **MedTrust Maps** es una plataforma que **verifica clínicas con un Trust Score transparente y calcula el costo total real**, a diferencia de **Google, agencias y grupos de Facebook**, que son opacos, inseguros o sesgados.

### 5.1 Diferenciadores clave

| # | Diferenciador | Por qué importa |
|---|---|---|
| 1 | **Trust Score con fórmula pública** | El paciente entiende *por qué* una clínica tiene 85 y otra 60 |
| 2 | **Costo total, no solo cirugía** | Evita la trampa del "precio gancho" |
| 3 | **Vault con encriptación** | Canal seguro que WhatsApp no puede ofrecer |
| 4 | **Verificación de certificaciones** | Cruzamos con registros oficiales cuando hay API; si no, verificación manual documentada |

---

## 6. Alcance del MVP

### 6.1 In-Scope (sí entra al MVP)

- Búsqueda por especialidad + país/ciudad.
- Vista mapa + lista con Trust Score y costo total estimado.
- Calculadora de costo total (cirugía + hotel + seguro + traslados).
- Perfil de clínica con galería, bio del doctor, certificaciones y reseñas.
- Vault seguro: signup, login, upload de archivos médicos, descarga por parte de la clínica autorizada.
- Algoritmo Trust Score v1.
- Panel admin interno para cargar clínicas y moderar reseñas.

### 6.2 Out-of-Scope (explícitamente NO entra al MVP)

- Pagos dentro de la plataforma.
- Reserva de vuelos u hoteles directamente.
- Chat en vivo con la clínica (usamos email/deep-link).
- App nativa iOS/Android (solo PWA).
- Más de una especialidad (arrancamos con dental).
- Más de 3 destinos.
- Integración con HIS/EMR de clínicas.
- Programa de afiliados o referidos.
- Panel de analytics para clínicas.
- Multi-idioma más allá de ES/EN.

### 6.3 Supuestos

- Las clínicas aceptarán cargar manualmente sus datos a cambio de visibilidad gratuita durante el MVP.
- La demanda de implantes dentales en Cancún desde EE.UU. es suficiente para generar tráfico orgánico + ads de prueba.
- La validación de certificaciones puede hacerse manualmente para 50 clínicas sin automatización.

---

## 7. Stack Tecnológico

### 7.1 Resumen

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | **Next.js 14 (App Router) + TypeScript + Tailwind CSS** | SEO crítico (búsqueda orgánica es el canal principal), SSR/ISR para perfiles de clínica, Tailwind para velocidad |
| Mapas | **Mapbox GL JS** | Estilización fina, mejor performance mobile que Google Maps, costo predecible |
| **Backend (BaaS)** | **Insforge** (Postgres + Auth + Storage + Edge Functions + Realtime + pgvector + AI Gateway) | Plataforma unificada MCP-native, optimizada para desarrollo agent-driven (Claude Code). Elimina boilerplate de infra y reduce drásticamente el time-to-MVP. Postgres completo (no abstracciones limitantes) con extensiones (PostGIS, pgvector) |
| Lógica de negocio pesada | **Insforge Edge Functions** (TypeScript) | Trust Score, validación de archivos, webhooks. Deploy global sin gestionar servidores |
| Lógica de negocio ligera | **Next.js API Routes / Server Actions** | Proxy seguro a Insforge, cálculos de calculadora con cache, composición de datos para UI |
| Auth | **Insforge Auth** | OAuth (Google) built-in, email+password, JWT, sin setup |
| Storage | **Insforge Cloud Storage** (buckets privados) | Signed URLs nativas, integración directa con políticas de acceso |
| Base de datos | **Insforge Postgres** | Portable (se puede exportar), con PostGIS + pgvector activables |
| Realtime | **Insforge Realtime** | Para futuras features (notificaciones de nuevas reseñas, estado del Vault) |
| AI Gateway | **Insforge AI** | Para v1.1+: detección de reseñas falsas con embeddings, pre-evaluación asistida |
| Búsqueda | **Postgres Full-Text Search** + pgvector (futuro semántico) | Suficiente para MVP |
| Cache | **Redis (Upstash)** | Cache de benchmarks de ciudad y Trust Score (opcional: Edge Functions + KV pueden reemplazarlo en v2) |
| Hosting frontend | **Vercel** | Deploy nativo Next.js, preview branches |
| CDN/Imágenes | `next/image` + Vercel Image Optimization | |
| Email transaccional | **Resend** | DX moderna, buena entregabilidad |
| Analytics | **Plausible** + **PostHog** | Plausible por privacidad/SEO, PostHog por product analytics y funnels |
| Monitoring | **Sentry** + **Better Stack** | Errores y uptime |
| CI/CD | **GitHub Actions** | Estándar |
| **Dev workflow** | **Claude Code + Insforge MCP** | El agente construye DB schema, edge functions y wiring con Next.js directamente vía MCP |

### 7.2 Decisiones clave (y alternativas descartadas)

- **Next.js sobre React puro:** el SEO es la vida o muerte del MVP. La mayoría del tráfico inicial vendrá de búsquedas tipo "implantes dentales Cancún precio".
- **Insforge sobre Supabase / Firebase / AWS:**
  - **MCP-native**: nuestro flujo de desarrollo es agent-driven con Claude Code; Insforge fue diseñado para esto (benchmarks muestran ~1.6× más rápido y ~30% menos tokens que Supabase en tareas MCP).
  - **Todo lo que necesitamos en un solo plano de control**: DB, Auth, Storage, Edge Functions, Realtime, pgvector y AI Gateway.
  - **Postgres portable**: si en el futuro necesitamos migrar, nos llevamos el dump y los schemas.
  - **pgvector + AI Gateway incluidos**: desbloquean roadmap v1.1 (detección de reseñas falsas por embeddings, pre-evaluación médica asistida) sin sumar vendors.
- **Edge Functions sobre un backend monolítico (FastAPI / Node):** elimina un servicio desplegado, acercando la lógica a la data y a los usuarios. Trust Score, validación de uploads y webhooks viven allí.
- **Next.js API Routes como capa delgada:** para agregación, cache de la calculadora, y como proxy cuando no queremos exponer claves al cliente.
- **Mapbox sobre Google Maps:** estilo personalizable y mejor UX mobile.
- **Redis opcional:** Insforge Edge Functions + Postgres son suficientes para el MVP; agregamos Redis solo si la calculadora o el listado muestran latencia > target.

---

## 8. Arquitectura del Sistema

### 8.1 Diagrama lógico (alto nivel)

```
┌────────────────┐      ┌────────────────────────────┐
│  Navegador /   │      │   Next.js (Vercel)         │
│  PWA Móvil     ├─────▶│   - Pages SSR/ISR (SEO)    │
└────────────────┘      │   - API Routes (delgadas)  │
                        │   - Server Actions         │
                        │   - Mapbox GL JS client    │
                        └──────┬─────────────────────┘
                               │ Insforge SDK (JWT)
                               │ + MCP (solo en dev)
                               ▼
        ┌──────────────────────────────────────────────────────────┐
        │                     INSFORGE (BaaS)                      │
        │  ┌─────────────────────────────────────────────────────┐ │
        │  │  Postgres (+ PostGIS, pgvector)                     │ │
        │  │  - clinics / doctors / procedures                   │ │
        │  │  - reviews / profiles                               │ │
        │  │  - medical_vault_files / vault_access_log           │ │
        │  │  - city_pricing_benchmarks                          │ │
        │  └─────────────────────────────────────────────────────┘ │
        │  ┌──────────────┐ ┌───────────────┐ ┌──────────────────┐ │
        │  │ Auth         │ │ Cloud Storage │ │ Edge Functions   │ │
        │  │ - Email+Pass │ │ - vault/*     │ │ - compute-trust  │ │
        │  │ - Google OAuth│ │ - clinic-pics │ │ - validate-upload│ │
        │  │ - JWT        │ │ (signed URLs) │ │ - share-token    │ │
        │  └──────────────┘ └───────────────┘ │ - webhook-review │ │
        │  ┌──────────────┐ ┌───────────────┐ └──────────────────┘ │
        │  │ Realtime     │ │ AI Gateway    │                      │
        │  │ (post-MVP)   │ │ (roadmap v1.1)│                      │
        │  └──────────────┘ └───────────────┘                      │
        └──────────────────────────────────────────────────────────┘
                               │
                               ▼
                     ┌─────────────────┐
                     │ Servicios 3rd   │
                     │  - Mapbox       │
                     │  - Resend       │
                     │  - Sentry       │
                     │  - PostHog      │
                     └─────────────────┘
```

### 8.2 Principios arquitectónicos

- **BaaS-first, lógica en los bordes.** Toda lógica pesada (Trust Score, validación de Vault, share tokens) vive en Insforge Edge Functions; Next.js solo hace render + composición.
- **Stateless.** Sin sesiones en memoria; todo el estado en Postgres/JWT.
- **Policies sobre RLS.** Cada usuario solo accede a su Vault vía políticas de autorización de Insforge sobre Postgres.
- **Signed URLs** para todo acceso a archivos médicos (TTL corto, ej. 15 min), emitidas por Edge Function `share-token`.
- **Server-side rendering** para páginas de clínica y resultados; **Client-side** para calculadora y mapa interactivo.
- **Separación dominio ↔ infraestructura** en Edge Functions (hexagonal light): `domain/trust-score.ts` puro, `handlers/*` solo I/O.
- **Secrets** en Vercel (frontend) y en Insforge project settings (funciones); nunca en el cliente ni en el repo.

---

## 9. Modelo de Datos

### 9.1 Entidades

#### 9.1.1 `clinics`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID PK | |
| `slug` | TEXT UNIQUE | Para URLs SEO (`/clinica/smile-cancun`) |
| `name` | TEXT NOT NULL | |
| `description` | TEXT | Markdown permitido |
| `country` | TEXT NOT NULL | ISO 3166-1 alpha-2 |
| `city` | TEXT NOT NULL | |
| `address` | TEXT | |
| `location` | GEOGRAPHY(POINT, 4326) | PostGIS para radio-queries |
| `phone` | TEXT | |
| `website` | TEXT | |
| `languages_spoken` | TEXT[] | `['es','en']` |
| `year_established` | INT | |
| `certifications` | JSONB | `[{"name":"JCI","verified":true,"valid_until":"2027-01-01","doc_url":"..."}]` |
| `photos` | TEXT[] | URLs en Insforge Storage |
| `trust_score` | NUMERIC(5,2) | 0–100, calculado |
| `trust_score_updated_at` | TIMESTAMPTZ | |
| `trust_score_breakdown` | JSONB | Desglose transparente |
| `status` | TEXT | `draft` \| `active` \| `suspended` |
| `created_at`, `updated_at` | TIMESTAMPTZ | |

**Índices:** `location` (GIST), `slug` (UNIQUE), `country+city`, `trust_score DESC`.

#### 9.1.2 `doctors`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID PK | |
| `clinic_id` | UUID FK → clinics | |
| `full_name` | TEXT | |
| `slug` | TEXT UNIQUE | |
| `title` | TEXT | Ej. "DDS, MSc" |
| `bio` | TEXT | Markdown |
| `specialties` | TEXT[] | |
| `years_experience` | INT | |
| `license_number` | TEXT | |
| `license_verified` | BOOLEAN | |
| `education` | JSONB | `[{"institution":"UNAM","degree":"DDS","year":2005}]` |
| `photo_url` | TEXT | |
| `created_at`, `updated_at` | TIMESTAMPTZ | |

#### 9.1.3 `procedures`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID PK | |
| `clinic_id` | UUID FK → clinics | |
| `doctor_id` | UUID FK → doctors NULLABLE | |
| `category` | TEXT | `dental_implant` \| `hair_transplant` \| ... (enum controlado) |
| `subcategory` | TEXT | `single_implant` \| `all_on_4` |
| `title` | TEXT | |
| `description` | TEXT | |
| `base_price_usd` | NUMERIC(10,2) | Precio base quirúrgico |
| `currency_original` | TEXT | MXN, USD, etc. |
| `base_price_local` | NUMERIC(12,2) | |
| `recovery_time_days` | INT | |
| `stay_required_nights` | INT | Noches mínimas sugeridas |
| `includes` | TEXT[] | `['anesthesia','materials','followup']` |
| `excludes` | TEXT[] | |
| `created_at`, `updated_at` | TIMESTAMPTZ | |

#### 9.1.4 `users`

Gestionado por Insforge Auth; extendemos con tabla `profiles`:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID PK = auth.users.id | |
| `full_name` | TEXT | |
| `country_of_origin` | TEXT | ISO |
| `preferred_language` | TEXT | `es` \| `en` |
| `created_at` | TIMESTAMPTZ | |

#### 9.1.5 `reviews`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK → profiles | |
| `clinic_id` | UUID FK → clinics | |
| `procedure_id` | UUID FK → procedures NULLABLE | |
| `rating_overall` | INT CHECK 1..5 | |
| `rating_cleanliness` | INT 1..5 | |
| `rating_staff` | INT 1..5 | |
| `rating_result` | INT 1..5 | |
| `rating_price_transparency` | INT 1..5 | |
| `title` | TEXT | |
| `body` | TEXT | |
| `photos_url` | TEXT[] | |
| `verified_patient` | BOOLEAN DEFAULT false | true si subió factura/documento |
| `verification_evidence` | TEXT | URL en Vault |
| `status` | TEXT | `pending` \| `approved` \| `flagged` |
| `helpful_count` | INT DEFAULT 0 | |
| `created_at`, `updated_at` | TIMESTAMPTZ | |

#### 9.1.6 `medical_vault_files`

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID PK | |
| `user_id` | UUID FK → profiles | |
| `file_type` | TEXT | `xray` \| `ct_scan` \| `lab_report` \| `photo` \| `other` |
| `original_filename` | TEXT | |
| `storage_path` | TEXT | Ruta en bucket privado |
| `size_bytes` | BIGINT | |
| `mime_type` | TEXT | |
| `sha256` | TEXT | Hash para integridad |
| `shared_with_clinic_ids` | UUID[] | Autorizaciones explícitas |
| `uploaded_at` | TIMESTAMPTZ | |
| `expires_at` | TIMESTAMPTZ NULLABLE | TTL opcional (ej. 90 días) |

#### 9.1.7 `vault_access_log`

Auditoría crítica para compliance:

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID PK | |
| `file_id` | UUID FK | |
| `actor_id` | UUID | Usuario o clínica que accedió |
| `actor_type` | TEXT | `patient` \| `clinic_staff` \| `system` |
| `action` | TEXT | `upload` \| `view` \| `download` \| `share` \| `revoke` |
| `ip_address` | INET | |
| `user_agent` | TEXT | |
| `created_at` | TIMESTAMPTZ | |

#### 9.1.8 `city_pricing_benchmarks` (para la calculadora)

| Campo | Tipo | Notas |
|---|---|---|
| `id` | UUID PK | |
| `country` | TEXT | |
| `city` | TEXT | |
| `hotel_avg_usd_per_night` | NUMERIC | 3★, actualizado mensualmente |
| `hotel_lowrange_usd` | NUMERIC | |
| `hotel_highrange_usd` | NUMERIC | |
| `meals_avg_usd_per_day` | NUMERIC | |
| `transport_avg_usd_per_day` | NUMERIC | |
| `medical_insurance_usd_per_week` | NUMERIC | |
| `source` | TEXT | Fuente del dato |
| `updated_at` | TIMESTAMPTZ | |

### 9.2 Relaciones (resumen)

```
profiles 1──* reviews *──1 clinics 1──* doctors
                          1──* procedures
profiles 1──* medical_vault_files *──* clinics (autorización)
clinics *──1 city_pricing_benchmarks (join por country+city)
```

### 9.3 Políticas de autorización (Insforge / Postgres RLS)

Insforge expone políticas a nivel de fila sobre Postgres. Definimos al menos:

- `medical_vault_files`: solo el `user_id` propietario puede `SELECT`/`DELETE`. Las clínicas autorizadas acceden vía Edge Function `get-shared-file` (`SECURITY DEFINER`) que valida `shared_with_clinic_ids` y emite signed URL.
- `reviews`:
  - `INSERT` solo si `auth.uid() = user_id` y el usuario tiene email verificado.
  - `SELECT` público únicamente cuando `status = 'approved'`.
  - `UPDATE`/`DELETE` bloqueados para el cliente; se manejan vía Edge Functions administrativas.
- `profiles`: cada usuario ve/edita solo el suyo (`auth.uid() = id`).
- `clinics`, `doctors`, `procedures`: `SELECT` público si `status = 'active'`; escritura únicamente vía rol admin.
- `vault_access_log`: `INSERT` solo desde Edge Functions (rol de servicio); nunca desde cliente. Lectura restringida al propio `actor_id` o rol admin.

---

## 10. Requisitos Funcionales

### 10.1 Frontend — User Stories

#### F-01 · Buscador inteligente

- **Como** paciente que explora opciones,
  **quiero** buscar por especialidad y país/ciudad destino,
  **para** ver clínicas relevantes ordenadas por confianza.
- **Criterios de aceptación:**
  - Autocompletado de especialidades (ej. "imp…" → "Implantes Dentales").
  - País obligatorio; ciudad opcional.
  - Filtros secundarios: rango de precio, idioma hablado, Trust Score mínimo.
  - URL stateful (`/buscar?especialidad=dental_implant&pais=MX&ciudad=Cancun`) para SEO e intercambio.
  - Tiempo de respuesta p95 < 500 ms.

#### F-02 · Vista de mapa interactivo

- **Como** paciente que compara ubicaciones,
  **quiero** ver las clínicas en un mapa con precio y Trust Score,
  **para** decidir según ubicación + calidad + precio.
- **Criterios de aceptación:**
  - Pines muestran: `USD {precio_total_estimado} · ⭐ {trust_score}`.
  - Clustering cuando hay > 20 pines visibles.
  - Click en pin abre card lateral (desktop) o bottom-sheet (mobile).
  - Switch Lista ↔ Mapa siempre visible.
  - Funciona con teclado (accesibilidad).

#### F-03 · Calculadora de costo total

- **Como** paciente comparando países,
  **quiero** ver el costo **total** del viaje médico, no solo la cirugía,
  **para** comparar honestamente con mi costo local.
- **Criterios de aceptación:**
  - Inputs: procedimiento, noches de estadía, acompañante (sí/no), categoría de hotel (3/4/5★), seguro médico de viaje.
  - Salida: breakdown visual (barras o donut): Cirugía / Hotel / Comidas / Transporte / Seguro / Margen de contingencia 10%.
  - Guarda snapshot del cálculo (útil para métricas).
  - Exportable a PDF (nice-to-have MVP).

#### F-04 · Perfil de clínica

- **Como** paciente validando una opción,
  **quiero** ver toda la información de la clínica y del doctor,
  **para** decidir si avanzo.
- **Criterios de aceptación:**
  - Hero con nombre, Trust Score, ubicación, idiomas.
  - Desglose del Trust Score (sección "¿Por qué 87?").
  - Galería de fotos (mínimo 5, máximo 30).
  - Bio del/los doctor(es) con credenciales verificables.
  - Lista de procedimientos con precios.
  - Reseñas paginadas con badge "Paciente verificado".
  - CTA persistente: **"Subir estudios para cotización"** y **"Contactar clínica"**.
  - Schema.org `MedicalBusiness` + `Review` para SEO.

#### F-05 · Vault — Subir estudios

- **Como** paciente interesado en una cotización real,
  **quiero** subir mis rayos X / exámenes de forma segura,
  **para** recibir una pre-evaluación sin usar WhatsApp.
- **Criterios de aceptación:**
  - Signup/login con email o Google.
  - Drag & drop; formatos aceptados: PDF, JPG, PNG, DICOM (nice-to-have).
  - Tamaño máximo 50 MB por archivo.
  - Muestra estado: uploaded / shared / viewed by clinic.
  - Paciente puede **revocar acceso** en cualquier momento.
  - Confirmación por email de cada upload y cada vista por parte de la clínica.

#### F-06 · Autenticación

- Registro con email+password y con Google OAuth.
- Verificación de email obligatoria antes de subir al Vault.
- Recuperación de contraseña estándar.
- Logout cierra todos los dispositivos (opción).

### 10.2 Backend — Reglas de negocio

#### B-01 · Trust Score v1

Descrito en detalle en §11.

#### B-02 · Cálculo de costo total

Endpoint `/api/v1/calc/total-cost` recibe procedimiento y parámetros, responde breakdown. Usa `city_pricing_benchmarks` con cache Redis (TTL 24 h).

#### B-03 · Subida al Vault

- Pre-firma de URL desde el backend (no exponer credenciales al cliente).
- Validación server-side de MIME type real (no solo extensión).
- Scan antivirus (ClamAV como servicio) antes de marcar como `available`.
- Hash SHA-256 calculado y almacenado.

#### B-04 · Autorización de acceso clínica ↔ paciente

- Paciente genera un **share token** con TTL (ej. 7 días) vinculado a una clínica.
- Clínica recibe email con link de acceso; al abrirlo, se autentica con código OTP enviado al correo registrado de la clínica.
- Todo acceso queda en `vault_access_log`.

#### B-05 · Moderación de reseñas

- Toda reseña entra como `pending`.
- Auto-aprobación si: usuario tiene email verificado + subió evidencia al Vault + no contiene palabras prohibidas (lista).
- Caso contrario: cola manual.

---

## 11. Algoritmo de Trust Score (v1)

### 11.1 Fórmula

```
TrustScore = (
    0.40 × CertificationsScore +
    0.30 × ReviewsScore +
    0.30 × ExperienceScore
) × TransparencyMultiplier
```

Rango final normalizado: **0–100**.

### 11.2 Componentes

#### CertificationsScore (0–100)

| Certificación | Puntos | Requisito |
|---|---|---|
| JCI (Joint Commission Int'l) | 50 | Vigente y verificable |
| ISO 9001 clínica | 20 | Vigente |
| Certificación nacional (ej. CSG en México) | 25 | Vigente |
| Especialidad del doctor verificada en colegio profesional | 20 | Número de cédula verificado |
| Seguro de responsabilidad civil vigente | 10 | Póliza subida |

- Capado a 100.
- Si ninguna certificación se pudo verificar: componente = 0 (no un valor default amistoso).

#### ReviewsScore (0–100)

```
ReviewsScore = (
    AvgRating_weighted × 20
) × VerifiedPatientBonus × VolumeFactor
```

- `AvgRating_weighted`: promedio ponderado de los 5 criterios (overall 40%, result 25%, price_transparency 15%, staff 10%, cleanliness 10%).
- `VerifiedPatientBonus`: 1.0 si <30% reseñas son `verified_patient`, hasta 1.15 si ≥70% lo son.
- `VolumeFactor`:
  - 0 reseñas → 0.0 (score = 0, honesto)
  - 1–4 → 0.5
  - 5–19 → 0.8
  - 20+ → 1.0
- Detección de anomalías básica v1: si >40% de reseñas vienen de cuentas creadas <7 días antes de la reseña → flag manual.

#### ExperienceScore (0–100)

```
ExperienceScore = min(100, (
    YearsOperating × 3 +
    DoctorsAvgExperience × 4 +
    ProceduresPerformed_log_scaled × 20
))
```

- `YearsOperating`: años desde `year_established`.
- `DoctorsAvgExperience`: promedio de `years_experience` entre doctores activos.
- `ProceduresPerformed_log_scaled`: `log10(1 + N) × 20`, donde N es el número auto-reportado y muestreado en reseñas verificadas.

#### TransparencyMultiplier (0.85–1.0)

Penaliza opacidad:

| Falta | Penalización |
|---|---|
| No publica precio base | −0.05 |
| No tiene al menos 5 fotos | −0.03 |
| No tiene bio del doctor completa | −0.04 |
| No responde a reseñas negativas | −0.03 |

Mínimo: 0.85.

### 11.3 Transparencia del score

- En el perfil público se muestra el desglose:
  > **87/100**
  > - Certificaciones: 92/100 (peso 40%)
  > - Reseñas: 81/100 (peso 30%)
  > - Experiencia: 85/100 (peso 30%)
  > - Multiplicador de transparencia: 1.0
- Tooltip explica cada componente.

### 11.4 Recálculo

- Recalcular cuando: se crea/aprueba una reseña, se actualiza certificación, se edita doctor, se cambia `year_established`.
- Job nocturno de consistencia.

---

## 12. API Spec (resumen)

Base URL: `https://api.medtrust.maps/v1` (proxy Next.js) + `https://{project}.insforge.app` (directo a Insforge cuando aplique). Autenticación: Bearer JWT emitido por Insforge Auth. Versionado en URL.

**Mapeo de implementación:**

| Tipo de operación | Dónde vive | Ejemplo |
|---|---|---|
| CRUD simple autenticado (reseñas del usuario, archivos del Vault) | **Insforge SDK directo desde Next.js** (server side o client side según caso) | `GET /vault/files` |
| Lectura pública con ISR | **Next.js Server Components + Insforge SDK** | `GET /clinics/{slug}` |
| Lógica de dominio (Trust Score, validación, shares) | **Insforge Edge Function** | `POST /edge/compute-trust-score` |
| Agregación y cache (calculadora, benchmarks) | **Next.js API Route** con cache | `POST /api/calc/total-cost` |
| Webhooks entrantes (pagos futuros, email bounces) | **Insforge Edge Function** | `POST /edge/webhooks/resend` |

### 12.1 Pública (sin auth)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/clinics` | Lista con filtros: `country`, `city`, `specialty`, `min_trust_score`, `max_price`, `page`, `limit` |
| GET | `/clinics/{slug}` | Detalle de clínica |
| GET | `/clinics/{slug}/reviews` | Reseñas paginadas |
| GET | `/procedures/categories` | Catálogo de especialidades |
| POST | `/calc/total-cost` | Calcula costo total |
| GET | `/cities/{country}/{city}/benchmarks` | Benchmarks de precio para una ciudad |

### 12.2 Autenticada (paciente)

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/auth/signup` / `/auth/login` | Vía Insforge Auth SDK (client-side) |
| GET | `/me` | Perfil (Insforge SDK) |
| POST | `/vault/files/upload-url` | Edge Function: emite signed URL de Insforge Storage |
| POST | `/vault/files/{id}/complete` | Edge Function: valida MIME real, hashea, dispara scan |
| GET | `/vault/files` | Lista archivos del usuario (SDK + RLS policy) |
| DELETE | `/vault/files/{id}` | SDK + RLS policy |
| POST | `/vault/files/{id}/share` | Edge Function: genera share token con TTL |
| POST | `/vault/files/{id}/revoke` | Edge Function: invalida token y registra en `vault_access_log` |
| POST | `/reviews` | SDK con validación por Edge Function (auto-aprobación o pending) |

### 12.3 Autenticada (clínica)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/clinic/vault-shares` | Shares recibidos |
| GET | `/clinic/vault-shares/{token}` | Accede a archivos (OTP flow) |

### 12.4 Admin

| Método | Endpoint | Descripción |
|---|---|---|
| POST/PATCH/DELETE | `/admin/clinics` | CRUD clínicas |
| POST | `/admin/reviews/{id}/approve` | Aprueba reseña pendiente |
| POST | `/admin/trust-score/recompute` | Fuerza recálculo |

### 12.5 Convenciones

- Errores en formato Problem Details (RFC 7807).
- Paginación `page`+`limit`, con headers `X-Total-Count` y `X-Total-Pages`.
- Rate limit: 60 rpm no-auth, 600 rpm auth.

---

## 13. Requisitos No Funcionales

### 13.1 Performance

| Métrica | Target MVP |
|---|---|
| LCP (home y resultados) | < 2.5 s (p75, 4G) |
| INP | < 200 ms |
| CLS | < 0.1 |
| TTFB API p95 | < 400 ms |
| Carga de mapa con 100 pines | < 3 s |

### 13.2 Seguridad

- **Todo sobre HTTPS** (HSTS, TLS 1.2+).
- **Encriptación at-rest** en Insforge (AES-256) y en tránsito para Vault.
- **Rate limiting** en Next.js API Routes (middleware) y en Edge Functions.
- **CSRF protection** en endpoints no-idempotentes (Server Actions ya lo incluyen por default en Next.js 14).
- **CSP estricto** en el frontend (`next.config.js`).
- **Secrets** vía env de Vercel + secrets de Insforge; nunca en el repo ni en el cliente.
- **Auditoría** completa en `vault_access_log` vía Edge Functions (únicas con permiso de escritura).
- **JWT** gestionado por Insforge Auth; refresh token rotation activado.
- **Pen-test** ligero antes de GA, con foco en: bypass de políticas RLS, IDOR en Vault, forjado de share tokens.

### 13.3 Privacidad y Compliance

- **GDPR** aplicable a pacientes europeos: consentimiento explícito, derecho a borrar.
- **HIPAA** NO aplica directamente (no somos proveedor de salud en EE.UU.), pero **adoptamos prácticas equivalentes** como estándar interno porque el paciente lo esperará. Banner claro: "No somos entidad cubierta por HIPAA; seguimos prácticas equivalentes".
- **LGPD** (Brasil), **Ley 19.628** (Chile) y leyes locales de datos personales del país donde operen las clínicas: DPIA antes del lanzamiento.
- **ToS y Privacy Policy** redactados por legal antes del lanzamiento público.
- **Consent log**: cada share al Vault guarda el texto exacto del consentimiento que firmó el usuario.

### 13.4 Accesibilidad

- WCAG 2.1 AA como target.
- Soporte lector de pantalla en mapa (alternativa lista siempre disponible).
- Contraste ≥ 4.5:1.
- Navegación por teclado completa.

### 13.5 SEO

- SSR/ISR en todas las páginas públicas.
- Sitemap dinámico.
- Schema.org `MedicalBusiness`, `Physician`, `MedicalProcedure`, `Review`.
- Open Graph + Twitter Cards.
- Slugs legibles y persistentes.
- hreflang para ES/EN.

### 13.6 Internacionalización

- ES como idioma default; EN disponible.
- Precios en USD por default (convertibles a MXN/COP/CRC).
- Fechas según locale.

### 13.7 Observabilidad

- Logs estructurados (JSON) con `trace_id` en Next.js y en cada Edge Function.
- Métricas RED (Rate, Errors, Duration) expuestas a Sentry + PostHog.
- Dashboards: uptime, error rate, Vault uploads, conversiones.
- Alertas: error rate >2% en 5 min, latencia p95 >1s en 5 min, Vault upload fail >5% en 15 min.
- **Insforge Alerts**: aprovechar notificaciones nativas del backend para fallos de DB/functions.

### 13.8 Disponibilidad

- SLA interno MVP: 99.0%.
- Backups diarios de Insforge Postgres + exportación semanal a almacenamiento externo (seguro ante lock-in).
- Runbook mínimo documentado.

---

## 14. User Journey — Detalle

### 14.1 Flujo "Carlos" (paciente)

```
 1. Descubrimiento
    └─ Busca en Google: "implantes dentales cancun confiables"
    └─ Llega a /buscar o a /clinica/[slug] (SEO-SSR)

 2. Exploración
    └─ Usa filtros de Trust Score y precio
    └─ Alterna entre lista y mapa
    └─ Abre 2–3 clínicas en pestañas

 3. Comparación
    └─ Para cada clínica, abre la calculadora
    └─ Ajusta: noches, hotel 4★, con acompañante
    └─ Copia breakdown (o exporta PDF)

 4. Validación
    └─ Revisa sección "¿Por qué Trust Score 87?"
    └─ Lee reseñas verificadas
    └─ Mira bio del doctor y sus certificaciones

 5. Commit
    └─ Click en "Subir estudios para cotización"
    └─ Signup (email o Google)
    └─ Sube panorámica dental + TAC
    └─ Autoriza compartir con la clínica seleccionada (consent explícito)
    └─ Recibe email de confirmación

 6. Respuesta (fuera del MVP pero con hook)
    └─ Clínica recibe email, accede con OTP al Vault
    └─ Clínica contesta por email con pre-evaluación + cotización firme
    └─ Paciente deja reseña post-tratamiento (6–12 meses después)
```

### 14.2 Flujo "Marcela" (clínica)

```
 1. Onboarding manual MVP
    └─ Equipo de MedTrust la contacta y carga su info
    └─ Marcela envía certificaciones → verificación manual
    └─ Clínica queda listada con Trust Score inicial

 2. Recepción de lead
    └─ Email con notificación de share del Vault
    └─ Click → OTP → accede a archivos
    └─ Descarga radiografías
    └─ Envía cotización por email al paciente

 3. Feedback
    └─ Recibe reseña del paciente
    └─ Responde públicamente si es negativa
```

---

## 15. Wireframes / Descripción UI

> (El PRD no reemplaza Figma, pero documenta la intención.)

### 15.1 Home (`/`)

- Hero con buscador centrado (especialidad + destino).
- Carrusel de ciudades destacadas con "desde USD X".
- Sección "¿Cómo funciona el Trust Score?" con diagrama.
- Testimonios (3) + logos de certificaciones reconocidas.
- Footer con compliance, legal, blog.

### 15.2 Resultados (`/buscar`)

- Barra superior: chips de filtros activos.
- Sidebar izquierdo (desktop) / Drawer (mobile): filtros.
- Área principal: toggle Lista ↔ Mapa.
  - Lista: cards con foto, nombre, Trust Score circular, precio total estimado, CTAs.
  - Mapa: Mapbox con pines personalizados; hover muestra mini-card.

### 15.3 Perfil de clínica (`/clinica/[slug]`)

- Hero: foto grande, nombre, Trust Score visual prominente, ubicación, idiomas.
- Tabs: Resumen · Doctores · Precios · Reseñas · Ubicación.
- Calculadora flotante (sticky en desktop, drawer en mobile).
- CTAs fijos abajo en mobile: "Contactar" / "Subir estudios".

### 15.4 Vault (`/mi-cuenta/vault`)

- Lista de archivos con status, tamaño, fecha.
- Botón "Subir archivo".
- Por archivo: acciones Ver, Compartir, Revocar, Borrar.
- Historial de accesos visible ("Smile Cancún vio este archivo el 15 de mayo, 14:23").

---

## 16. Roadmap de Implementación

### Fase 0 — Preparación (Semana 0)

- [ ] Set up del monorepo Next.js (Turborepo opcional si sumamos apps futuras).
- [ ] Cuenta **Insforge**: `npx @insforge/cli create medtrust-maps`.
- [ ] Conectar **Insforge MCP a Claude Code** para desarrollo agent-driven.
- [ ] Cuentas: Vercel, Mapbox, Resend, Sentry, PostHog.
- [ ] CI: lint + typecheck + tests en PR (GitHub Actions).
- [ ] Design tokens + componentes base (shadcn/ui).
- [ ] Legal: draft inicial de ToS y Privacy.

### Fase 1 — Estructura y Data (Semanas 1–2)

- [ ] Esquema Postgres en Insforge + migraciones (vía MCP o SQL directo).
- [ ] Habilitar extensiones: PostGIS (geolocalización) y pgvector (roadmap).
- [ ] Políticas RLS para Vault, reviews, profiles.
- [ ] Edge Functions: `compute-trust-score`, `validate-upload`, `create-share-token`, `revoke-share-token`.
- [ ] Carga manual de 50 clínicas dentales en Cancún (CSV → script de import vía SDK).
- [ ] Verificación manual de certificaciones (checklist + docs en Insforge Storage).
- [ ] Seed de `city_pricing_benchmarks` para 3 ciudades.
- [ ] Tests unitarios del Trust Score (fixture + snapshots).

### Fase 2 — Frontend (Semanas 3–4)

- [ ] Home con buscador.
- [ ] Página de resultados (lista + mapa Mapbox).
- [ ] Perfil de clínica con todos los tabs (Server Components + Insforge SDK).
- [ ] Calculadora funcional (API Route con cache).
- [ ] Signup/login con **Insforge Auth** (email+pass y Google OAuth) con verificación de email.
- [ ] Diseño responsive y PWA básica.
- [ ] Pruebas en dispositivos reales (iOS Safari, Android Chrome).

### Fase 3 — Vault y Seguridad (Semana 5)

- [ ] Bucket privado en **Insforge Storage** + políticas + signed URLs.
- [ ] Edge Function `upload-url` + `validate-upload` (MIME real, hash, scan).
- [ ] Flujo de share con OTP para clínicas (Edge Function + Resend).
- [ ] Auditoría completa en `vault_access_log` (escritura solo vía Edge Functions).
- [ ] Plantillas de email transaccional (Resend).
- [ ] Pen-test ligero interno con foco en IDOR y policies.

### Fase 4 — Lanzamiento suave (Semana 6)

- [ ] Analytics + funnels en PostHog.
- [ ] Dashboards operativos.
- [ ] Legal: ToS y Privacy finales.
- [ ] Ronda de 15 entrevistas con pacientes del funnel.
- [ ] Hotfix window de 2 semanas.

### Post-MVP (meses 2–6) — visión

- Agregar vertical: cirugía capilar.
- **Detección de reseñas falsas con pgvector + AI Gateway de Insforge** (embeddings + clustering).
- **Pre-evaluación automatizada con IA** sobre radiografías (usando AI Gateway, con advisory médico obligatorio).
- Panel de analytics para clínicas (leads, tasa de respuesta) con **Insforge Realtime**.
- Programa de reseñas verificadas con recompensa.
- App nativa.
- Modo facilitador/agencia.

---

## 17. Métricas de Éxito (KPIs)

### 17.1 North Star

**"Archivos médicos compartidos con clínica en los últimos 7 días"** — proxy de confianza máxima, porque es el paso más costoso emocionalmente.

### 17.2 Métricas de adopción

| KPI | Definición | Target MVP (sem 6) |
|---|---|---|
| Visitantes únicos | GA/Plausible | 5.000 |
| Búsquedas | Eventos de `/buscar` | 1.500 |
| Clics en clínica | Tarjeta clicada | 800 |
| Signups | Cuentas creadas | 150 |
| Vault uploads | Archivos subidos | 50 |
| Vault shares | Archivos compartidos con clínica | 25 |

### 17.3 Métricas de calidad

| KPI | Target |
|---|---|
| CTR "Contactar clínica" vs visitas perfil | > 8% |
| CTR "Subir estudios" vs visitas perfil | > 4% |
| Tiempo promedio en calculadora | > 45 s |
| Bounce rate en resultados | < 55% |
| Reseñas `verified_patient` / total | > 40% |

### 17.4 Métricas de confianza

| KPI | Target |
|---|---|
| NPS post-upload | > 40 |
| Tasa de revocación de shares | < 10% (indicador saludable) |
| Tasa de respuesta de clínicas en 48h | > 70% |

### 17.5 Métricas técnicas

| KPI | Target |
|---|---|
| Uptime | ≥ 99.0% |
| Error rate API | < 1% |
| LCP p75 | < 2.5 s |

---

## 18. Riesgos y Mitigaciones

| # | Riesgo | Impacto | Prob. | Mitigación |
|---|---|---|---|---|
| R1 | Clínicas no quieren ser rankeadas objetivamente | Alto | Media | Onboarding gratuito en MVP; Trust Score transparente que la clínica puede mejorar |
| R2 | Reseñas falsas masivas (astroturfing) | Alto | Alta | Verified patient flag + detección de cuentas nuevas + moderación manual MVP |
| R3 | Brecha de seguridad en Vault | Crítico | Baja | RLS + signed URLs + audit log + pen-test + seguro cibernético |
| R4 | Incumplimiento de ley de datos local | Alto | Media | Asesoría legal por jurisdicción antes de lanzar, DPIA documentado |
| R5 | No conseguir tráfico orgánico a tiempo | Alto | Alta | SEO desde día 1 + compra limitada de Google Ads + alianzas con creadores |
| R6 | Trust Score injusto daña a clínica buena con pocas reseñas | Medio | Alta | VolumeFactor honesto (score 0 si no hay data) + comunicación clara |
| R7 | Clínicas responden fuera de la plataforma y no capturamos conversión | Medio | Alta | Tracking de "share → response" por email con ids únicos |
| R8 | Errores médicos derivados de pre-evaluación | Crítico | Baja | MVP no da pre-evaluación automática; deja disclaimer legal fuerte |
| R9 | Costos de Mapbox o Insforge explotan con tráfico | Medio | Media | Cuotas/alertas; plan de migración a tier superior; Postgres portable por si hay que salir de Insforge |
| R10 | El vertical elegido (dental) no engancha | Alto | Media | Validar señales a la semana 4; pivot a capilar listo |
| R11 | Lock-in con Insforge (producto joven, backed por YC) | Medio | Media | Postgres portable (dump + migraciones); Edge Functions en TS estándar (portables a Vercel/Cloudflare si hace falta); export semanal de Storage |

---

## 19. Dependencias

### 19.1 Externas

- **Insforge** (Postgres + Auth + Storage + Edge Functions + Realtime + AI Gateway).
- Mapbox (tiles + geocoding).
- Resend (emails).
- Sentry, PostHog, Plausible.
- Proveedor de scan antivirus (ClamAV en Edge Function o API externa tipo VirusTotal para MVP).

### 19.2 De equipo

- Advisory médico (pagado por hora) para revisar flujos y copy.
- Legal para ToS, Privacy, disclaimers.
- Diseñador UI/UX senior.

### 19.3 De contenido

- 50 clínicas cargadas con información completa.
- 10+ reseñas sembradas por clínica (reales, con permiso).

---

## 20. Equipo y Roles (propuesta mínima)

| Rol | Dedicación | Responsabilidad |
|---|---|---|
| Product Lead | 100% | Visión, priorización, métricas |
| Tech Lead / Full-stack | 100% | Arquitectura, backend, DB |
| Front-end Engineer | 100% | Next.js, Mapbox, calculadora |
| Diseñador UX/UI | 50% | Figma, design system |
| Ops / Data | 30% | Carga de clínicas, benchmarks, verificaciones |
| Advisory médico | 10% | Revisión de copy y flujos |
| Legal | 10% | ToS, Privacy, compliance |

---

## 21. Presupuesto alto nivel (MVP, 6 semanas)

> Estimación orientativa; ajustar a contexto local.

| Ítem | Costo USD |
|---|---|
| Infra (Vercel + Insforge + Mapbox + Resend + Sentry) | 200–450 |
| Dominio + SSL | 50 |
| Legal (ToS, Privacy, DPIA ligero) | 1.500–3.000 |
| Advisory médico (40 h) | 2.000 |
| Diseño UI (20–40 h) | 2.000–4.000 |
| Ads de prueba | 1.000 |
| Pen-test ligero | 1.500 |
| **Total no-salarios** | **8.250–12.000** |

Salarios del equipo no incluidos (dependen de estructura).

> **Nota sobre costos de infra:** al eliminar Railway/Fly.io (backend propio), Insforge consolida lo que antes costaban Supabase + hosting backend en un solo pricing. Validar en https://insforge.dev/pricing según volumen estimado.

---

## 22. Open Questions

1. ¿Arrancamos con **una sola ciudad** (Cancún) o con tres desde el día uno? Trade-off: foco vs señales comparativas.
2. ¿El share al Vault debe requerir **OTP del paciente** cada vez que la clínica accede, o solo la primera vez?
3. ¿Monetización desde el MVP (fee por lead) o completamente gratuito para validar? Recomendación: gratuito.
4. ¿Qué pasa cuando una clínica pide remover una reseña negativa verificada? → Política editorial escrita.
5. ¿Integramos un **disclaimer médico obligatorio** antes del signup o solo antes del primer upload?

---

## 23. Glosario

| Término | Definición |
|---|---|
| **Trust Score** | Puntaje 0–100 algorítmico que resume confiabilidad de una clínica. |
| **Vault** | Bucket seguro donde el paciente sube sus documentos médicos. |
| **Verified Patient** | Usuario que subió evidencia de haber sido paciente (factura, informe). |
| **Share Token** | Token único con TTL que autoriza a una clínica a acceder a archivos. |
| **Transparency Multiplier** | Factor de la fórmula de Trust Score que penaliza opacidad. |
| **JCI** | Joint Commission International, acreditadora global de calidad sanitaria. |
| **ISR** | Incremental Static Regeneration (Next.js). |
| **RLS** | Row-Level Security (PostgreSQL). |
| **BaaS** | Backend-as-a-Service. |
| **Insforge** | BaaS MCP-native elegido como backend: Postgres + Auth + Storage + Edge Functions + Realtime + AI Gateway. |
| **Edge Function** | Código backend deployado globalmente por Insforge sin gestionar servidores. |
| **MCP** | Model Context Protocol — estándar que permite a agentes de IA (Claude Code, Cursor) interactuar con Insforge directamente durante el desarrollo. |
| **pgvector** | Extensión de Postgres para búsqueda vectorial (embeddings). |
| **DICOM** | Formato estándar para imágenes médicas. |
| **DPIA** | Data Protection Impact Assessment. |

---

## 24. Anexos

### Anexo A — Esquema SQL resumido (ver §9 para modelo completo)

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326),
  certifications JSONB DEFAULT '[]'::jsonb,
  trust_score NUMERIC(5,2) DEFAULT 0,
  trust_score_breakdown JSONB,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX clinics_location_gix ON clinics USING GIST (location);
CREATE INDEX clinics_country_city ON clinics (country, city);
CREATE INDEX clinics_trust_desc ON clinics (trust_score DESC);

-- (resto de tablas análogo; ver §9)
```

### Anexo B — Pseudocódigo Trust Score (Insforge Edge Function, TypeScript)

```typescript
// /functions/compute-trust-score/index.ts
import { createInsforgeClient } from '@insforge/sdk';

type TrustBreakdown = {
  score: number;
  breakdown: {
    certifications: number;
    reviews: number;
    experience: number;
    transparency_multiplier: number;
  };
};

export async function computeTrustScore(clinicId: string): Promise<TrustBreakdown> {
  const ins = createInsforgeClient();

  const [clinic, doctors, reviews] = await Promise.all([
    ins.from('clinics').select('*').eq('id', clinicId).single(),
    ins.from('doctors').select('*').eq('clinic_id', clinicId),
    ins.from('reviews').select('*').eq('clinic_id', clinicId).eq('status', 'approved'),
  ]);

  const cert = computeCertificationsScore(clinic.data.certifications, doctors.data);
  const rev  = computeReviewsScore(reviews.data);
  const exp  = computeExperienceScore(clinic.data, doctors.data);
  const mult = computeTransparencyMultiplier(clinic.data);

  const raw = 0.40 * cert + 0.30 * rev + 0.30 * exp;
  const final = Math.max(0, Math.min(100, Math.round(raw * mult * 100) / 100));

  // Persistir breakdown para UI transparente
  await ins.from('clinics').update({
    trust_score: final,
    trust_score_breakdown: { certifications: cert, reviews: rev, experience: exp, transparency_multiplier: mult },
    trust_score_updated_at: new Date().toISOString(),
  }).eq('id', clinicId);

  return {
    score: final,
    breakdown: {
      certifications: cert,
      reviews: rev,
      experience: exp,
      transparency_multiplier: mult,
    },
  };
}
```

**Triggers de recálculo:**
- Edge Function `on-review-approved` → invoca `compute-trust-score`.
- Edge Function `on-certification-updated` → invoca `compute-trust-score`.
- Cron de Insforge (nocturno) → recalcula clínicas con `trust_score_updated_at > 7 días`.

### Anexo C — IA post-MVP (Insforge AI Gateway + pgvector)

Todas estas integraciones corren sobre los primitivos ya disponibles en Insforge, sin sumar vendors:

- **Clasificación de reseña sospechosa** (detección de astroturfing): generar embedding de la reseña con AI Gateway, compararlo con centroides de reseñas conocidas como falsas (clustering en pgvector).
- **Extracción de entidades médicas en radiografías** (OCR + modelo especializado): llamada al AI Gateway desde una Edge Function, con disclaimer y revisión humana obligatoria.
- **Normalización de certificaciones** cargadas por clínicas: prompt estructurado (AI Gateway) para mapear strings libres a un catálogo canónico (`JCI`, `ISO_9001`, etc.).
- **Búsqueda semántica** de clínicas: embedding de descripción + búsqueda vectorial en pgvector ("dentista que hable inglés y acepte pacientes con ansiedad dental").

### Anexo D — Setup inicial con Claude Code + Insforge MCP

```bash
# 1. Crear proyecto Next.js
npx create-next-app@latest medtrust-maps --typescript --tailwind --app

# 2. Crear proyecto Insforge
npx @insforge/cli create medtrust-maps

# 3. Conectar MCP a Claude Code (ver docs.insforge.dev/mcp-setup#claude-code)
#    Esto permite que Claude Code cree schemas, edge functions y wiring
#    directamente contra el proyecto de Insforge durante el desarrollo.

# 4. Instalar SDK en el frontend
cd medtrust-maps
npm install @insforge/sdk
```

**Flujo recomendado con Claude Code:**
1. Pasarle este PRD como contexto (`@PRD_MedTrust_Maps_MVP.md`).
2. Pedirle que implemente Fase 1 entidad por entidad.
3. Claude Code crea tablas, policies y edge functions vía MCP.
4. Revisión humana por PR antes de merge.

---

**Fin del PRD v1.0**
