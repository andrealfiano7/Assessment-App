import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { CompleteAssessmentData } from '../types/rmi';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.trim() !== '' &&
  supabaseAnonKey.trim() !== '' &&
  !supabaseUrl.includes('your-project-ref')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

/**
 * Simpan asesmen ke Supabase Cloud Database (Tabel assessments)
 */
export async function saveAssessmentToSupabase(
  data: CompleteAssessmentData,
  finalScore?: number,
  maturityPhase?: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Supabase belum dikonfigurasi (VITE_SUPABASE_URL & ANON_KEY belum disetel)' };
  }

  try {
    const payload = {
      id: data.profile.id,
      company_name: data.profile.companyName,
      year: data.profile.year,
      model: data.profile.model,
      report_number: data.profile.reportNumber,
      assessment_type: data.profile.assessmentType,
      final_score: finalScore ?? 0.0,
      maturity_phase: maturityPhase ?? '',
      data: data,
      updated_at: new Date().toISOString()
    };

    const { error } = await supabase
      .from('assessments')
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    console.error('Error saving to Supabase:', err);
    return { success: false, error: err.message || 'Gagal menyimpan ke Supabase' };
  }
}

/**
 * Ambil asesmen spesifik dari Supabase Cloud Database
 */
export async function loadAssessmentFromSupabase(
  id: string
): Promise<{ data?: CompleteAssessmentData; error?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: 'Supabase belum dikonfigurasi' };
  }

  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('data')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Supabase fetch error:', error);
      return { error: error.message };
    }

    return { data: data?.data as CompleteAssessmentData };
  } catch (err: any) {
    console.error('Error loading from Supabase:', err);
    return { error: err.message || 'Gagal memuat dari Supabase' };
  }
}

/**
 * Ambil daftar profil asesmen yang tersimpan di Supabase Cloud
 */
export async function fetchSupabaseAssessmentsList(): Promise<Array<{
  id: string;
  company_name: string;
  year: number;
  model: string;
  report_number: string;
  final_score: number;
  maturity_phase: string;
  updated_at: string;
}>> {
  if (!isSupabaseConfigured || !supabase) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('id, company_name, year, model, report_number, final_score, maturity_phase, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Supabase list error:', error);
      return [];
    }

    return (data || []) as any;
  } catch (err) {
    console.error('Error fetching Supabase list:', err);
    return [];
  }
}
