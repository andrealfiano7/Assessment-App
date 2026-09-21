export type IndustryModel = 'umum' | 'perbankan' | 'asuransi';

export interface ParameterCriteria {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
}

export interface RmiParameter {
  id: number;
  dim_num: number;
  dim_name: string;
  subdim: string;
  title: string;
  criteria: ParameterCriteria;
  page?: number;
}

export interface ParameterAssessment {
  paramId: number;
  score: number; // 0 (belum diisi) atau 1, 2, 3, 4, 5
  findings?: string; // Temuan / gap utama
  evidence?: string; // Kutipan dan bukti penting
  dataSource?: string; // Sumber data / dokumen / wawancara
}

export interface DimensionSummary {
  dimNum: number;
  dimName: string;
  paramCount: number;
  assessedCount: number;
  score: number; // Rata-rata skor parameter dalam dimensi ini
}

export type HealthRating = 'AAA' | 'AA' | 'A' | 'BBB' | 'BB' | 'B' | 'CCC' | 'CC' | 'C';
export type CompositeRating = 1 | 2 | 3 | 4 | 5;

export interface PerformanceAspect {
  healthRating: HealthRating;
  compositeRating: CompositeRating;
}

export interface MaturitySpectrum {
  level: number;
  name: string;
  subLevel: string;
  minScore: number;
  maxScore: number;
  color: string;
  badgeBg: string;
  badgeText: string;
  description: string;
}

export interface DocumentChecklistItem {
  id: number;
  kebutuhan_data: string;
  dokumen_sumber: string;
  tersedia: boolean;
  catatan: string;
}

export interface RecommendationItem {
  id: string;
  dimNum: number;
  paramId?: number;
  rekomendasi: string;
  impact: 'Tinggi' | 'Rendah';
  ease: 'Mudah' | 'Sulit';
  priority: 1 | 2 | 3;
  timeframe: 'Jangka Pendek' | 'Jangka Panjang'; // < 1 tahun vs > 1 tahun
  aktivitasUtama: string;
  output: string;
  indikatorKeberhasilan: string;
  uic: string; // Unit in Charge
  targetDate: string; // dd-mm-yyyy
  status: 'S' | 'BS' | 'BD' | 'TDD'; // Sesuai, Belum Sesuai, Belum Ditindaklanjuti, Tidak Dapat Ditindaklanjuti
  pemberiTarget: string;
}

export interface AssessmentProfile {
  id: string;
  companyName: string;
  year: number;
  reportNumber: string;
  model: IndustryModel;
  assessmentType: 'Internal' | 'Independen';
  assessorName: string;
  observationPeriod: string;
  assessmentDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface DimensionSummaryDetail {
  dimNum: number;
  strengths: string;
  gaps: string;
  shortTermRec: string;
  longTermRec: string;
}

export interface CompleteAssessmentData {
  profile: AssessmentProfile;
  assessments: Record<number, ParameterAssessment>;
  performance: PerformanceAspect;
  documentChecklist: DocumentChecklistItem[];
  recommendations: RecommendationItem[];
  dimensionSummaries?: Record<number, DimensionSummaryDetail>;
  perceptionSurvey?: PerceptionSurveyData;
}

export interface SurveyQuestion {
  id: string;
  dimNum: number;
  dimName: string;
  subtopic: string;
  question: string;
}

export type RespondentGroup =
  | 'dekom'      // Dewan Komisaris / Dewan Pengawas / KPR
  | 'direksi'    // Direksi
  | 'lini1'      // Unit Bisnis / Operasional
  | 'lini2'      // Unit Manajemen Risiko / Kepatuhan
  | 'lini3';     // Internal Audit

export interface SurveySubmission {
  id: string;
  respondentName?: string;
  respondentGroup: RespondentGroup;
  department: string;
  answers: Record<string, number>; // questionId -> score (1..5)
  notes?: string;
  submittedAt: string;
}

export interface PerceptionSurveyData {
  submissions: SurveySubmission[];
}


