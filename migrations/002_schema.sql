-- MedTrust Maps — Schema (§9 PRD)
-- ============================================================================
-- Trigger helper: mantiene updated_at automáticamente
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- profiles (extiende auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                 UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name          TEXT,
  country_of_origin  TEXT,
  preferred_language TEXT DEFAULT 'es' CHECK (preferred_language IN ('es','en')),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- procedure_categories (catálogo extensible)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.procedure_categories (
  code        TEXT PRIMARY KEY,
  parent_code TEXT REFERENCES public.procedure_categories(code),
  label_es    TEXT NOT NULL,
  label_en    TEXT NOT NULL,
  active      BOOLEAN NOT NULL DEFAULT TRUE
);

-- ============================================================================
-- clinics
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.clinics (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug                      TEXT UNIQUE NOT NULL,
  name                      TEXT NOT NULL,
  description               TEXT,
  country                   TEXT NOT NULL,                        -- ISO 3166-1 alpha-2
  city                      TEXT NOT NULL,
  address                   TEXT,
  location                  GEOGRAPHY(POINT, 4326),
  phone                     TEXT,
  website                   TEXT,
  languages_spoken          TEXT[] NOT NULL DEFAULT '{}',
  year_established          INT,
  certifications            JSONB NOT NULL DEFAULT '[]'::JSONB,
  photos                    TEXT[] NOT NULL DEFAULT '{}',
  trust_score               NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (trust_score BETWEEN 0 AND 100),
  trust_score_updated_at    TIMESTAMPTZ,
  trust_score_breakdown     JSONB,
  status                    TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','active','suspended')),
  created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS clinics_location_gix    ON public.clinics USING GIST (location);
CREATE INDEX IF NOT EXISTS clinics_country_city    ON public.clinics (country, city);
CREATE INDEX IF NOT EXISTS clinics_trust_desc      ON public.clinics (trust_score DESC);
CREATE INDEX IF NOT EXISTS clinics_status          ON public.clinics (status);
DROP TRIGGER IF EXISTS trg_clinics_updated_at ON public.clinics;
CREATE TRIGGER trg_clinics_updated_at BEFORE UPDATE ON public.clinics
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- doctors
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.doctors (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id          UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  full_name          TEXT NOT NULL,
  slug               TEXT UNIQUE NOT NULL,
  title              TEXT,
  bio                TEXT,
  specialties        TEXT[] NOT NULL DEFAULT '{}',
  years_experience   INT,
  license_number     TEXT,
  license_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  education          JSONB NOT NULL DEFAULT '[]'::JSONB,
  photo_url          TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS doctors_clinic_id ON public.doctors (clinic_id);
DROP TRIGGER IF EXISTS trg_doctors_updated_at ON public.doctors;
CREATE TRIGGER trg_doctors_updated_at BEFORE UPDATE ON public.doctors
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- procedures
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.procedures (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id             UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  doctor_id             UUID REFERENCES public.doctors(id) ON DELETE SET NULL,
  category              TEXT NOT NULL REFERENCES public.procedure_categories(code),
  subcategory           TEXT REFERENCES public.procedure_categories(code),
  title                 TEXT NOT NULL,
  description           TEXT,
  base_price_usd        NUMERIC(10,2),
  currency_original     TEXT,
  base_price_local      NUMERIC(12,2),
  recovery_time_days    INT,
  stay_required_nights  INT,
  includes              TEXT[] NOT NULL DEFAULT '{}',
  excludes              TEXT[] NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS procedures_clinic_id ON public.procedures (clinic_id);
CREATE INDEX IF NOT EXISTS procedures_category  ON public.procedures (category);
DROP TRIGGER IF EXISTS trg_procedures_updated_at ON public.procedures;
CREATE TRIGGER trg_procedures_updated_at BEFORE UPDATE ON public.procedures
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- reviews
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  clinic_id                   UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  procedure_id                UUID REFERENCES public.procedures(id) ON DELETE SET NULL,
  rating_overall              INT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  rating_cleanliness          INT CHECK (rating_cleanliness BETWEEN 1 AND 5),
  rating_staff                INT CHECK (rating_staff BETWEEN 1 AND 5),
  rating_result               INT CHECK (rating_result BETWEEN 1 AND 5),
  rating_price_transparency   INT CHECK (rating_price_transparency BETWEEN 1 AND 5),
  title                       TEXT,
  body                        TEXT,
  photos_url                  TEXT[] NOT NULL DEFAULT '{}',
  verified_patient            BOOLEAN NOT NULL DEFAULT FALSE,
  verification_evidence       TEXT,
  status                      TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','flagged')),
  helpful_count               INT NOT NULL DEFAULT 0,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS reviews_clinic_id ON public.reviews (clinic_id);
CREATE INDEX IF NOT EXISTS reviews_user_id   ON public.reviews (user_id);
CREATE INDEX IF NOT EXISTS reviews_status    ON public.reviews (status);
DROP TRIGGER IF EXISTS trg_reviews_updated_at ON public.reviews;
CREATE TRIGGER trg_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================================
-- medical_vault_files
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.medical_vault_files (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  file_type                TEXT NOT NULL CHECK (file_type IN ('xray','ct_scan','lab_report','photo','other')),
  original_filename        TEXT NOT NULL,
  storage_bucket           TEXT NOT NULL DEFAULT 'medical-vault',
  storage_path             TEXT NOT NULL,
  size_bytes               BIGINT,
  mime_type                TEXT,
  sha256                   TEXT,
  status                   TEXT NOT NULL DEFAULT 'uploading' CHECK (status IN ('uploading','available','scanning','rejected')),
  shared_with_clinic_ids   UUID[] NOT NULL DEFAULT '{}',
  uploaded_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at               TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS vault_files_user_id ON public.medical_vault_files (user_id);

-- ============================================================================
-- vault_share_tokens (apoyo para B-04)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.vault_share_tokens (
  token         TEXT PRIMARY KEY,
  file_id       UUID NOT NULL REFERENCES public.medical_vault_files(id) ON DELETE CASCADE,
  clinic_id     UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  issued_by     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  otp_code      TEXT,                             -- OTP enviado a la clínica
  otp_consumed  BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at    TIMESTAMPTZ NOT NULL,
  revoked_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS vault_share_tokens_file    ON public.vault_share_tokens (file_id);
CREATE INDEX IF NOT EXISTS vault_share_tokens_clinic  ON public.vault_share_tokens (clinic_id);

-- ============================================================================
-- vault_access_log (auditoría; escritura solo service role)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.vault_access_log (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_id      UUID REFERENCES public.medical_vault_files(id) ON DELETE SET NULL,
  actor_id     UUID,
  actor_type   TEXT NOT NULL CHECK (actor_type IN ('patient','clinic_staff','system')),
  action       TEXT NOT NULL CHECK (action IN ('upload','view','download','share','revoke')),
  ip_address   INET,
  user_agent   TEXT,
  metadata     JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS vault_log_file    ON public.vault_access_log (file_id);
CREATE INDEX IF NOT EXISTS vault_log_actor   ON public.vault_access_log (actor_id);
CREATE INDEX IF NOT EXISTS vault_log_created ON public.vault_access_log (created_at DESC);

-- ============================================================================
-- city_pricing_benchmarks
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.city_pricing_benchmarks (
  id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country                       TEXT NOT NULL,
  city                          TEXT NOT NULL,
  hotel_avg_usd_per_night       NUMERIC(10,2),
  hotel_lowrange_usd            NUMERIC(10,2),
  hotel_highrange_usd           NUMERIC(10,2),
  meals_avg_usd_per_day         NUMERIC(10,2),
  transport_avg_usd_per_day     NUMERIC(10,2),
  medical_insurance_usd_per_week NUMERIC(10,2),
  source                        TEXT,
  updated_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (country, city)
);
DROP TRIGGER IF EXISTS trg_benchmarks_updated_at ON public.city_pricing_benchmarks;
CREATE TRIGGER trg_benchmarks_updated_at BEFORE UPDATE ON public.city_pricing_benchmarks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
