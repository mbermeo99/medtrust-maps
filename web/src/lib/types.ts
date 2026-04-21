export type ClinicStatus = "draft" | "active" | "suspended";

export type Certification = {
  name: string;
  verified: boolean;
  valid_until?: string;
  doc_url?: string;
};

export type TrustBreakdown = {
  certifications: number;
  reviews: number;
  experience: number;
  transparency_multiplier: number;
};

export type Clinic = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  country: string;
  city: string;
  address?: string | null;
  location?: string | null; // PostGIS WKB hex, no lo consumimos directo
  lat?: number | null;
  lon?: number | null;
  phone?: string | null;
  website?: string | null;
  languages_spoken: string[];
  year_established?: number | null;
  certifications: Certification[];
  photos: string[];
  trust_score: number;
  trust_score_updated_at?: string | null;
  trust_score_breakdown?: TrustBreakdown | null;
  status: ClinicStatus;
};

export type Doctor = {
  id: string;
  clinic_id: string;
  full_name: string;
  slug: string;
  title?: string | null;
  bio?: string | null;
  specialties: string[];
  years_experience?: number | null;
  license_number?: string | null;
  license_verified: boolean;
  education: unknown[];
  photo_url?: string | null;
};

export type Procedure = {
  id: string;
  clinic_id: string;
  doctor_id?: string | null;
  category: string;
  subcategory?: string | null;
  title: string;
  description?: string | null;
  base_price_usd?: number | null;
  recovery_time_days?: number | null;
  stay_required_nights?: number | null;
  includes: string[];
  excludes: string[];
};

export type Review = {
  id: string;
  user_id: string;
  clinic_id: string;
  rating_overall: number;
  rating_cleanliness?: number | null;
  rating_staff?: number | null;
  rating_result?: number | null;
  rating_price_transparency?: number | null;
  title?: string | null;
  body?: string | null;
  verified_patient: boolean;
  status: "pending" | "approved" | "flagged";
  created_at: string;
};

export type CityBenchmark = {
  country: string;
  city: string;
  hotel_avg_usd_per_night: number;
  hotel_lowrange_usd: number;
  hotel_highrange_usd: number;
  meals_avg_usd_per_day: number;
  transport_avg_usd_per_day: number;
  medical_insurance_usd_per_week: number;
};

export type VaultFile = {
  id: string;
  user_id: string;
  file_type: "xray" | "ct_scan" | "lab_report" | "photo" | "other";
  original_filename: string;
  storage_bucket: string;
  storage_path: string;
  size_bytes: number;
  mime_type: string;
  sha256?: string | null;
  status: "uploading" | "available" | "scanning" | "rejected";
  shared_with_clinic_ids: string[];
  uploaded_at: string;
  expires_at?: string | null;
};
