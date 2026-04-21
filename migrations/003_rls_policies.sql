-- MedTrust Maps — RLS Policies (§9.3 PRD)
-- Insforge expone auth.uid() y auth.role(). 'authenticated' = usuario con JWT,
-- 'anon' = anónimo, 'project_admin' = llamadas admin (edge functions con API key).

-- ============================================================================
-- profiles: cada usuario ve/edita solo el suyo
-- ============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS profiles_self_select ON public.profiles;
DROP POLICY IF EXISTS profiles_self_insert ON public.profiles;
DROP POLICY IF EXISTS profiles_self_update ON public.profiles;
DROP POLICY IF EXISTS profiles_service_all ON public.profiles;

CREATE POLICY profiles_self_select ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY profiles_self_insert ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_self_update ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
CREATE POLICY profiles_service_all ON public.profiles
  FOR ALL TO project_admin USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- clinics: SELECT público sólo si status='active'; escritura sólo project_admin
-- ============================================================================
ALTER TABLE public.clinics ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS clinics_public_select ON public.clinics;
DROP POLICY IF EXISTS clinics_service_all ON public.clinics;

CREATE POLICY clinics_public_select ON public.clinics
  FOR SELECT TO anon, authenticated USING (status = 'active');
CREATE POLICY clinics_service_all ON public.clinics
  FOR ALL TO project_admin USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- doctors: público si la clínica está activa
-- ============================================================================
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS doctors_public_select ON public.doctors;
DROP POLICY IF EXISTS doctors_service_all ON public.doctors;

CREATE POLICY doctors_public_select ON public.doctors
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.clinics c WHERE c.id = doctors.clinic_id AND c.status = 'active')
  );
CREATE POLICY doctors_service_all ON public.doctors
  FOR ALL TO project_admin USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- procedures: idem doctors
-- ============================================================================
ALTER TABLE public.procedures ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS procedures_public_select ON public.procedures;
DROP POLICY IF EXISTS procedures_service_all ON public.procedures;

CREATE POLICY procedures_public_select ON public.procedures
  FOR SELECT TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM public.clinics c WHERE c.id = procedures.clinic_id AND c.status = 'active')
  );
CREATE POLICY procedures_service_all ON public.procedures
  FOR ALL TO project_admin USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- procedure_categories: catálogo público de lectura
-- ============================================================================
ALTER TABLE public.procedure_categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS procedure_categories_public_select ON public.procedure_categories;
DROP POLICY IF EXISTS procedure_categories_service_all ON public.procedure_categories;

CREATE POLICY procedure_categories_public_select ON public.procedure_categories
  FOR SELECT TO anon, authenticated USING (active = TRUE);
CREATE POLICY procedure_categories_service_all ON public.procedure_categories
  FOR ALL TO project_admin USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- reviews: SELECT público si approved; INSERT si auth+email verificado; UPDATE/DELETE bloqueados
-- ============================================================================
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS reviews_public_select ON public.reviews;
DROP POLICY IF EXISTS reviews_owner_insert ON public.reviews;
DROP POLICY IF EXISTS reviews_service_all ON public.reviews;

CREATE POLICY reviews_public_select ON public.reviews
  FOR SELECT TO anon, authenticated USING (status = 'approved');
-- Paciente puede insertar SOLO si el email está verificado
CREATE POLICY reviews_owner_insert ON public.reviews
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (SELECT 1 FROM auth.users u WHERE u.id = auth.uid() AND u.email_verified = TRUE)
    AND status = 'pending'  -- nadie auto-aprueba desde el cliente
  );
CREATE POLICY reviews_service_all ON public.reviews
  FOR ALL TO project_admin USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- medical_vault_files: solo el owner ve/modifica; escritura de metadatos server-side
-- ============================================================================
ALTER TABLE public.medical_vault_files ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS vault_files_owner_select ON public.medical_vault_files;
DROP POLICY IF EXISTS vault_files_owner_insert ON public.medical_vault_files;
DROP POLICY IF EXISTS vault_files_owner_update ON public.medical_vault_files;
DROP POLICY IF EXISTS vault_files_owner_delete ON public.medical_vault_files;
DROP POLICY IF EXISTS vault_files_service_all ON public.medical_vault_files;

CREATE POLICY vault_files_owner_select ON public.medical_vault_files
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY vault_files_owner_insert ON public.medical_vault_files
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY vault_files_owner_update ON public.medical_vault_files
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY vault_files_owner_delete ON public.medical_vault_files
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY vault_files_service_all ON public.medical_vault_files
  FOR ALL TO project_admin USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- vault_share_tokens: sólo project_admin (edge functions). El owner lee los suyos.
-- ============================================================================
ALTER TABLE public.vault_share_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS vault_tokens_owner_select ON public.vault_share_tokens;
DROP POLICY IF EXISTS vault_tokens_service_all ON public.vault_share_tokens;

CREATE POLICY vault_tokens_owner_select ON public.vault_share_tokens
  FOR SELECT TO authenticated USING (auth.uid() = issued_by);
CREATE POLICY vault_tokens_service_all ON public.vault_share_tokens
  FOR ALL TO project_admin USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- vault_access_log: sólo project_admin escribe; owner puede leer sus eventos
-- ============================================================================
ALTER TABLE public.vault_access_log ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS vault_log_owner_select ON public.vault_access_log;
DROP POLICY IF EXISTS vault_log_service_all ON public.vault_access_log;

CREATE POLICY vault_log_owner_select ON public.vault_access_log
  FOR SELECT TO authenticated USING (
    actor_id = auth.uid()
    OR EXISTS (SELECT 1 FROM public.medical_vault_files f WHERE f.id = vault_access_log.file_id AND f.user_id = auth.uid())
  );
CREATE POLICY vault_log_service_all ON public.vault_access_log
  FOR ALL TO project_admin USING (TRUE) WITH CHECK (TRUE);

-- ============================================================================
-- city_pricing_benchmarks: lectura pública; escritura project_admin
-- ============================================================================
ALTER TABLE public.city_pricing_benchmarks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS benchmarks_public_select ON public.city_pricing_benchmarks;
DROP POLICY IF EXISTS benchmarks_service_all ON public.city_pricing_benchmarks;

CREATE POLICY benchmarks_public_select ON public.city_pricing_benchmarks
  FOR SELECT TO anon, authenticated USING (TRUE);
CREATE POLICY benchmarks_service_all ON public.city_pricing_benchmarks
  FOR ALL TO project_admin USING (TRUE) WITH CHECK (TRUE);
