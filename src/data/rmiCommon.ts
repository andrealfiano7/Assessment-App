import { HealthRating, CompositeRating, MaturitySpectrum, IndustryModel } from '../types/rmi';

export interface DimensionMeta {
  dimNum: number;
  name: string;
  description: string;
  subdimensions: string[];
  color: string;
  badgeBg: string;
  borderLight: string;
  iconName: string;
}

export const DIMENSIONS_META: DimensionMeta[] = [
  {
    dimNum: 1,
    name: 'Budaya dan Kapabilitas Risiko',
    description: 'Internalisasi budaya risiko, kesadaran risiko insan perusahaan, serta program pengembangan kapabilitas dan keahlian risiko.',
    subdimensions: ['a. Budaya Risiko', 'b. Kapabilitas Risiko'],
    color: '#6531F7', // UI Kit Primary Purple
    badgeBg: 'bg-[#6531F7]/10 text-[#6531F7] border-[#6531F7]/25',
    borderLight: 'border-[#6531F7]/25',
    iconName: 'Users'
  },
  {
    dimNum: 2,
    name: 'Organisasi dan Tata Kelola Risiko',
    description: 'Peran Dewan Komisaris, Direksi, Organ Pengelola Risiko, serta penerapan Model Tiga Lini (Three Lines Model) dan pengawasan terintegrasi.',
    subdimensions: ['a. Organ Pengelola Risiko', 'b. Peran dan Tanggung Jawab Organ Pengelola Risiko', 'c. Model Tata Kelola Risiko Tiga Lini dan Tata Kelola Risiko Terintegrasi'],
    color: '#6366F1', // Indigo Accent
    badgeBg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
    borderLight: 'border-indigo-200',
    iconName: 'Building2'
  },
  {
    dimNum: 3,
    name: 'Kerangka Risiko dan Kepatuhan',
    description: 'Strategi risiko, selera risiko (risk appetite), kebijakan, SOP, rencana darurat (contingency plan), stress test, serta efektivitas kepatuhan & SPI.',
    subdimensions: ['a. Strategi Risiko', 'b. Kebijakan dan Prosedur', 'c. Fungsi Kepatuhan', 'd. Efektivitas Manajemen Risiko dan Pengendalian Intern'],
    color: '#3B82F6', // Royal Blue
    badgeBg: 'bg-blue-50 text-blue-900 border-blue-200',
    borderLight: 'border-blue-200',
    iconName: 'ShieldCheck'
  },
  {
    dimNum: 4,
    name: 'Proses dan Kontrol Risiko',
    description: 'Siklus identifikasi risiko utama, pengukuran & pemeringkatan, aktivitas mitigasi/perlakuan risiko, serta pelaporan risiko berkala.',
    subdimensions: ['a. Identifikasi', 'b. Pengukuran dan Prioritisasi Risiko', 'c. Perlakuan Risiko', 'd. Pelaporan Risiko'],
    color: '#F59E0B', // Warm Amber
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    borderLight: 'border-amber-200',
    iconName: 'Activity'
  },
  {
    dimNum: 5,
    name: 'Model, Data, dan Teknologi Risiko',
    description: 'Infrastruktur sistem informasi manajemen risiko terintegrasi (EGRC/SIMR), permodelan risiko, dan tata kelola kualitas data risiko.',
    subdimensions: ['a. Permodelan dan Teknologi Risiko', 'b. Data Risiko'],
    color: '#8B5CF6', // Purple / Violet
    badgeBg: 'bg-purple-50 text-purple-900 border-purple-200',
    borderLight: 'border-purple-200',
    iconName: 'Database'
  }
];

export const HEALTH_RATING_CONVERSION: Record<HealthRating, number> = {
  AAA: 100,
  AA: 90,
  A: 79,
  BBB: 67,
  BB: 56,
  B: 44,
  CCC: 33,
  CC: 21,
  C: 10
};

export const COMPOSITE_RATING_CONVERSION: Record<CompositeRating, number> = {
  1: 100,
  2: 78,
  3: 55,
  4: 33,
  5: 10
};

export const MATURITY_SPECTRUM: MaturitySpectrum[] = [
  {
    level: 1,
    name: 'Fase Awal',
    subLevel: 'Fase Awal',
    minScore: 1.0,
    maxScore: 1.499,
    color: '#EF4444',
    badgeBg: 'bg-red-50 border-red-200 text-red-800',
    badgeText: 'Fase Awal (Initial Phase)',
    description: 'Manajemen Risiko hanya dilaksanakan secara ad hoc berbasis pemahaman individu tertentu. Budaya risiko dan kesadaran risiko masih rendah.'
  },
  {
    level: 1.5,
    name: 'Fase Awal (+)',
    subLevel: 'Fase Awal (+)',
    minScore: 1.5,
    maxScore: 1.899,
    color: '#F97316',
    badgeBg: 'bg-orange-50 border-orange-200 text-orange-800',
    badgeText: 'Fase Awal (+) (Initial Phase +)',
    description: 'Praktik Manajemen Risiko melampaui fase awal dan sedang dalam proses transisi menuju fase berkembang.'
  },
  {
    level: 2,
    name: 'Fase Berkembang',
    subLevel: 'Fase Berkembang',
    minScore: 1.9,
    maxScore: 2.499,
    color: '#EAB308',
    badgeBg: 'bg-amber-50 border-amber-300 text-amber-900',
    badgeText: 'Fase Berkembang (Emerging Phase)',
    description: 'Menerapkan seluruh Dimensi praktik Manajemen Risiko untuk memenuhi persyaratan peraturan minimum. Budaya risiko mulai diperkenalkan.'
  },
  {
    level: 2.5,
    name: 'Fase Berkembang (+)',
    subLevel: 'Fase Berkembang (+)',
    minScore: 2.5,
    maxScore: 2.899,
    color: '#D97706',
    badgeBg: 'bg-amber-100 border-amber-400 text-amber-950',
    badgeText: 'Fase Berkembang (+) (Emerging Phase +)',
    description: 'Praktik Manajemen Risiko melampaui fase berkembang dan sedang dalam proses transisi menuju fase praktik yang baik.'
  },
  {
    level: 3,
    name: 'Fase Praktik yang Baik',
    subLevel: 'Fase Praktik yang Baik',
    minScore: 2.9,
    maxScore: 3.499,
    color: '#2563EB',
    badgeBg: 'bg-blue-50 border-blue-300 text-blue-900',
    badgeText: 'Fase Praktik yang Baik (Good Practice Phase)',
    description: 'Menerapkan seluruh Dimensi praktik Manajemen Risiko yang rata-rata mendekati atau sejalan dengan standar industrinya. Budaya risiko mulai diterapkan.'
  },
  {
    level: 3.5,
    name: 'Fase Praktik yang Baik (+)',
    subLevel: 'Fase Praktik yang Baik (+)',
    minScore: 3.5,
    maxScore: 3.899,
    color: '#1D4ED8',
    badgeBg: 'bg-blue-100 border-blue-400 text-blue-950',
    badgeText: 'Fase Praktik yang Baik (+) (Good Practice +)',
    description: 'Praktik Manajemen Risiko melampaui praktik yang baik dan sedang dalam transisi menuju fase praktik yang lebih baik.'
  },
  {
    level: 4,
    name: 'Fase Praktik yang Lebih Baik',
    subLevel: 'Fase Praktik yang Lebih Baik',
    minScore: 3.9,
    maxScore: 4.499,
    color: '#0F3B68',
    badgeBg: 'bg-slate-100 border-blue-600 text-blue-950',
    badgeText: 'Fase Praktik yang Lebih Baik (Strong Practice Phase)',
    description: 'Praktik Manajemen Risiko yang kuat sejalan standar global industri. Seluruh pegawai sadar risiko, didukung sistem informasi yang memadai.'
  },
  {
    level: 4.5,
    name: 'Fase Praktik yang Lebih Baik (+)',
    subLevel: 'Fase Praktik yang Lebih Baik (+)',
    minScore: 4.5,
    maxScore: 4.899,
    color: '#0A2540',
    badgeBg: 'bg-amber-50 border-amber-500 text-blue-950',
    badgeText: 'Fase Praktik yang Lebih Baik (+) (Strong Practice +)',
    description: 'Praktik melampaui praktik yang lebih baik dan sedang dalam proses transisi menuju fase praktik terbaik (best practice).'
  },
  {
    level: 5,
    name: 'Fase Praktik Terbaik',
    subLevel: 'Fase Praktik Terbaik',
    minScore: 4.9,
    maxScore: 5.0,
    color: '#F59E0B',
    badgeBg: 'bg-gradient-to-r from-amber-100 to-yellow-100 border-amber-400 text-blue-950 font-bold',
    badgeText: 'Fase Praktik Terbaik (Best Practice Phase)',
    description: 'Menerapkan praktik-praktik terbaik Manajemen Risiko standar global tertinggi. Budaya risiko sepenuhnya tertanam dan menjadi pendorong nilai tambah perusahaan.'
  }
];

export const INDUSTRY_MODELS: { id: IndustryModel; label: string; subLabel: string; paramCount: number }[] = [
  {
    id: 'umum',
    label: 'KBUMN – Industri Umum',
    subLabel: 'Untuk BUMN sektor Non-Keuangan / Holding & Anak Usaha',
    paramCount: 42
  },
  {
    id: 'perbankan',
    label: 'KBUMN – Industri Perbankan',
    subLabel: 'Untuk BUMN sektor Perbankan',
    paramCount: 40
  },
  {
    id: 'asuransi',
    label: 'KBUMN – Industri Asuransi',
    subLabel: 'Untuk BUMN sektor Asuransi & Penjaminan',
    paramCount: 40
  }
];

export const STATUS_TINDAK_LANJUT_MAP = {
  S: { code: 'S', label: 'Sesuai dengan Rekomendasi', color: 'bg-emerald-50 text-emerald-800 border-emerald-300' },
  BS: { code: 'BS', label: 'Belum Sesuai dengan Rekomendasi', color: 'bg-amber-50 text-amber-800 border-amber-300' },
  BD: { code: 'BD', label: 'Rekomendasi Belum Ditindaklanjuti', color: 'bg-rose-50 text-rose-800 border-rose-300' },
  TDD: { code: 'TDD', label: 'Rekomendasi Tidak Dapat Ditindaklanjuti', color: 'bg-slate-100 text-slate-700 border-slate-300' }
};
