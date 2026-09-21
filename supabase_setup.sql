-- ==============================================================================
-- SKEMA DATABASE SUPABASE: SISTEM PENGUKURAN MATURITAS RISIKO (RMI) BUMN
-- Berbasis Keputusan Deputi Bidang Keuangan & Manajemen Risiko KBUMN
-- No. SK-8/DKU.MBU/12/2023 & Surat UND-55/DKU.MBU/12/2023
-- ==============================================================================
--
-- PANDUAN PENYIAPAN SUPABASE:
-- 1. Buka dashboard proyek Supabase Anda: https://supabase.com/dashboard
-- 2. Klik menu "SQL Editor" di bilah sisi kiri.
-- 3. Klik "New Query", salin seluruh isi skrip ini, lalu klik tombol "Run".
-- 4. Buka Project Settings > API, salin "Project URL" dan "anon / public Key".
-- 5. Masukkan ke file .env atau Environment Variables di Vercel Dashboard:
--      VITE_SUPABASE_URL=https://xxxx.supabase.co
--      VITE_SUPABASE_ANON_KEY=eyJh...
-- ==============================================================================

-- 1. Buat Tabel Asesmen Utama (Menampung Data Lengkap & Kertas Kerja Lampiran IV)
CREATE TABLE IF NOT EXISTS public.assessments (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  year INTEGER NOT NULL,
  model TEXT NOT NULL DEFAULT 'umum' CHECK (model IN ('umum', 'perbankan', 'asuransi')),
  report_number TEXT,
  assessment_type TEXT DEFAULT 'Internal',
  final_score NUMERIC(4, 2) DEFAULT 0.00,
  maturity_phase TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Index untuk Pencarian Cepat
CREATE INDEX IF NOT EXISTS idx_assessments_company ON public.assessments (company_name);
CREATE INDEX IF NOT EXISTS idx_assessments_year ON public.assessments (year);
CREATE INDEX IF NOT EXISTS idx_assessments_updated ON public.assessments (updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_assessments_model ON public.assessments (model);

-- 3. Fungsi & Trigger Otomatis Update Kolom updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at ON public.assessments;
CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON public.assessments
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- 4. Aktifkan Row Level Security (RLS)
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- 5. Kebijakan Keamanan (RLS Policies): Akses Baca & Tulis Publik / Klien Anonim
DROP POLICY IF EXISTS "Public can view assessments" ON public.assessments;
CREATE POLICY "Public can view assessments"
ON public.assessments FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Public can insert assessments" ON public.assessments;
CREATE POLICY "Public can insert assessments"
ON public.assessments FOR INSERT
WITH CHECK (true);

DROP POLICY IF EXISTS "Public can update assessments" ON public.assessments;
CREATE POLICY "Public can update assessments"
ON public.assessments FOR UPDATE
USING (true);

DROP POLICY IF EXISTS "Public can delete assessments" ON public.assessments;
CREATE POLICY "Public can delete assessments"
ON public.assessments FOR DELETE
USING (true);
