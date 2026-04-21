-- MedTrust Maps — Seeds MVP
-- ============================================================================
-- Catálogo de categorías de procedimientos
-- ============================================================================
INSERT INTO public.procedure_categories (code, parent_code, label_es, label_en) VALUES
  ('dental_implant',     NULL,             'Implantes dentales',  'Dental Implants'),
  ('single_implant',     'dental_implant', 'Implante unitario',   'Single Implant'),
  ('all_on_4',           'dental_implant', 'All-on-4',            'All-on-4'),
  ('all_on_6',           'dental_implant', 'All-on-6',            'All-on-6'),
  ('hair_transplant',    NULL,             'Trasplante capilar',  'Hair Transplant'),
  ('bariatric',          NULL,             'Cirugía bariátrica',  'Bariatric Surgery'),
  ('aesthetic',          NULL,             'Cirugía estética',    'Aesthetic Surgery'),
  ('orthopedic',         NULL,             'Cirugía ortopédica',  'Orthopedic Surgery')
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- City pricing benchmarks (3 destinos MVP)
-- ============================================================================
INSERT INTO public.city_pricing_benchmarks
  (country, city, hotel_avg_usd_per_night, hotel_lowrange_usd, hotel_highrange_usd,
   meals_avg_usd_per_day, transport_avg_usd_per_day, medical_insurance_usd_per_week, source)
VALUES
  ('MX', 'Cancun',    95, 55, 180, 40, 25, 60, 'Manual MVP'),
  ('CO', 'Bogota',    75, 45, 150, 30, 20, 55, 'Manual MVP'),
  ('CR', 'San Jose',  85, 55, 170, 38, 22, 65, 'Manual MVP')
ON CONFLICT (country, city) DO UPDATE SET
  hotel_avg_usd_per_night = EXCLUDED.hotel_avg_usd_per_night,
  hotel_lowrange_usd      = EXCLUDED.hotel_lowrange_usd,
  hotel_highrange_usd     = EXCLUDED.hotel_highrange_usd,
  meals_avg_usd_per_day   = EXCLUDED.meals_avg_usd_per_day,
  transport_avg_usd_per_day = EXCLUDED.transport_avg_usd_per_day,
  medical_insurance_usd_per_week = EXCLUDED.medical_insurance_usd_per_week;

-- ============================================================================
-- Demo clinic + doctor + procedures + reviews (para validar Trust Score)
-- ============================================================================
INSERT INTO public.clinics (
  id, slug, name, description, country, city, address, location, phone, website,
  languages_spoken, year_established, certifications, photos, status
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'smile-cancun',
  'Smile Cancún Dental',
  'Clínica dental especializada en implantología con pacientes internacionales. Inglés, español y francés.',
  'MX', 'Cancun', 'Av. Bonampak 120, SM 10',
  ST_SetSRID(ST_MakePoint(-86.8316, 21.1619), 4326)::geography,
  '+52 998 123 4567',
  'https://smilecancun.example.mx',
  ARRAY['es','en','fr'],
  2012,
  '[
    {"name":"JCI","verified":true,"valid_until":"2028-01-01"},
    {"name":"ISO_9001","verified":true,"valid_until":"2027-06-01"},
    {"name":"NATIONAL","verified":true,"valid_until":"2028-12-01"}
  ]'::JSONB,
  ARRAY[
    'https://clinic-photos.example/1.jpg',
    'https://clinic-photos.example/2.jpg',
    'https://clinic-photos.example/3.jpg',
    'https://clinic-photos.example/4.jpg',
    'https://clinic-photos.example/5.jpg',
    'https://clinic-photos.example/6.jpg'
  ],
  'active'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.doctors (
  id, clinic_id, full_name, slug, title, bio, specialties,
  years_experience, license_number, license_verified
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  'Dra. Ana María Pérez',
  'ana-maria-perez',
  'DDS, MSc Implantología',
  'Más de 15 años en implantología. Formada en UNAM y New York University. Habla español, inglés y francés con pacientes internacionales desde 2010.',
  ARRAY['dental_implant','aesthetic'],
  15, 'CED-UNAM-0042', TRUE
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.procedures (
  id, clinic_id, doctor_id, category, subcategory, title, description,
  base_price_usd, currency_original, base_price_local,
  recovery_time_days, stay_required_nights, includes, excludes
) VALUES
  ('33333333-3333-3333-3333-333333333331',
   '11111111-1111-1111-1111-111111111111',
   '22222222-2222-2222-2222-222222222222',
   'dental_implant', 'single_implant',
   'Implante unitario con corona de porcelana',
   'Incluye el implante de titanio, pilar y corona final. Evaluación 3D previa.',
   950, 'MXN', 17500, 7, 6,
   ARRAY['anesthesia','materials','followup','3d_scan'],
   ARRAY['hotel','transport']),
  ('33333333-3333-3333-3333-333333333332',
   '11111111-1111-1111-1111-111111111111',
   '22222222-2222-2222-2222-222222222222',
   'dental_implant', 'all_on_4',
   'All-on-4 — Arcada completa sobre 4 implantes',
   'Rehabilitación completa de una arcada con 4 implantes y prótesis fija.',
   7900, 'MXN', 145000, 10, 9,
   ARRAY['anesthesia','materials','followup','3d_scan','temp_prosthesis'],
   ARRAY['hotel','transport','final_prosthesis_optional'])
ON CONFLICT (id) DO NOTHING;
