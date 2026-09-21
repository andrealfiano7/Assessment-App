import { SurveySubmission, RespondentGroup } from '../types/rmi';

// Fungsi bantuan untuk men-generate skor realistis untuk 42 parameter
function generateAnswers(baseScores: Record<number, number>, variance: number = 0): Record<string, number> {
  const ans: Record<string, number> = {};
  for (let i = 1; i <= 42; i++) {
    const base = baseScores[i] ?? (i <= 3 ? 4 : i <= 19 ? 3 : i <= 33 ? 4 : i <= 39 ? 3 : 3);
    const val = Math.min(5, Math.max(1, base + variance));
    ans[String(i)] = val;
  }
  return ans;
}

// Pola skor dasar PT ABC per parameter
const PT_ABC_BASE_SCORES: Record<number, number> = {
  1: 4, 2: 3, 3: 4, // D1: avg 3.7
  4: 3, 5: 3, 6: 4, 7: 3, 8: 3, 9: 4, 10: 4, 11: 3, 12: 3, 13: 3, 14: 3, 15: 4, 16: 3, 17: 3, 18: 3, 19: 3, // D2: avg 3.2
  20: 4, 21: 4, 22: 3, 23: 4, 24: 4, 25: 4, 26: 3, 27: 4, 28: 4, 29: 3, 30: 3, 31: 4, 32: 4, 33: 4, // D3: avg 3.7
  34: 4, 35: 3, 36: 4, 37: 3, 38: 3, 39: 3, // D4: avg 3.3
  40: 3, 41: 3, 42: 3 // D5: avg 3.0
};

export const SAMPLE_SURVEY_SUBMISSIONS: SurveySubmission[] = [
  // 1. Dewan Komisaris / KPR (2 responden)
  {
    id: 'sub-dekom-01',
    respondentName: 'Dr. H. Bambang S., M.Sc.',
    respondentGroup: 'dekom',
    department: 'Komite Pemantau Risiko (KPR)',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    notes: 'Dewan Komisaris mengapresiasi peningkatan disiplin pelaporan risiko triwulanan.',
    submittedAt: '2026-03-05T09:30:00.000Z'
  },
  {
    id: 'sub-dekom-02',
    respondentName: 'Ir. Hendro Wijaya, MBA',
    respondentGroup: 'dekom',
    department: 'Dewan Pengawas / Komisaris Independen',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    notes: 'Perlu penguatan EWS dan simulasi BCP berkala pada unit logistik.',
    submittedAt: '2026-03-06T14:15:00.000Z'
  },

  // 2. Direksi (3 responden - Cenderung Lebih Optimis)
  {
    id: 'sub-dir-01',
    respondentName: 'Ir. Ahmad Zulkarnain, MM',
    respondentGroup: 'direksi',
    department: 'Direktur Utama',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 1),
    notes: 'Direksi berkomitmen penuh menjadikan risk culture sebagai DNA perusahaan.',
    submittedAt: '2026-03-08T10:00:00.000Z'
  },
  {
    id: 'sub-dir-02',
    respondentName: 'Siti Rahmawati, SE, Ak.',
    respondentGroup: 'direksi',
    department: 'Direktur Keuangan & Manajemen Risiko',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 1),
    notes: 'Kepatuhan terhadap batas selera risiko keuangan dipantau mingguan.',
    submittedAt: '2026-03-08T11:45:00.000Z'
  },
  {
    id: 'sub-dir-03',
    respondentName: 'Budi Santoso, ST',
    respondentGroup: 'direksi',
    department: 'Direktur Operasional & Teknik',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    notes: 'Aplikasi MR di unit operasional lapangan perlu dibuat lebih ramah pengguna.',
    submittedAt: '2026-03-09T08:20:00.000Z'
  },

  // 3. Lini Kedua: Fungsi Manajemen Risiko & Kepatuhan (4 responden)
  {
    id: 'sub-lini2-01',
    respondentName: 'Dimas Prasetyo, CRM',
    respondentGroup: 'lini2',
    department: 'Divisi Manajemen Risiko Korporat',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    notes: 'Lini 1 masih sering terlambat menginput loss event register.',
    submittedAt: '2026-03-10T13:00:00.000Z'
  },
  {
    id: 'sub-lini2-02',
    respondentName: 'Maya Indah, SH, MH',
    respondentGroup: 'lini2',
    department: 'Divisi Kepatuhan & Legal',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    notes: 'Kepatuhan terhadap regulasi KBUMN SK-8 sudah sangat baik.',
    submittedAt: '2026-03-10T14:30:00.000Z'
  },
  {
    id: 'sub-lini2-03',
    respondentName: 'Rian Kurniawan, ERMCP',
    respondentGroup: 'lini2',
    department: 'Risk Officer Unit Finansial',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    submittedAt: '2026-03-11T09:15:00.000Z'
  },
  {
    id: 'sub-lini2-04',
    respondentName: 'Dina Anggraini, S.Kom',
    respondentGroup: 'lini2',
    department: 'Risk Technology & Analytics',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    submittedAt: '2026-03-11T16:00:00.000Z'
  },

  // 4. Lini Ketiga: Internal Audit / SPI (3 responden - Lebih Kritis)
  {
    id: 'sub-lini3-01',
    respondentName: 'Kusuma Wardhana, CIA, CISA',
    respondentGroup: 'lini3',
    department: 'Kepala Satuan Pengawas Intern (SPI)',
    answers: generateAnswers(PT_ABC_BASE_SCORES, -1),
    notes: 'Audit berbasis risiko (RBIA) perlu didukung data KRI yang lebih tepat waktu.',
    submittedAt: '2026-03-12T11:00:00.000Z'
  },
  {
    id: 'sub-lini3-02',
    respondentName: 'Ferry Ardiansyah, QIA',
    respondentGroup: 'lini3',
    department: 'Auditor Senior Pengawasan Operasi',
    answers: generateAnswers(PT_ABC_BASE_SCORES, -1),
    submittedAt: '2026-03-12T15:20:00.000Z'
  },
  {
    id: 'sub-lini3-03',
    respondentName: 'Dewi Lestari, Ak, CA',
    respondentGroup: 'lini3',
    department: 'Auditor Keuangan & IT',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    submittedAt: '2026-03-13T09:40:00.000Z'
  },

  // 5. Lini Pertama: Unit Bisnis & Operasional (10 responden)
  {
    id: 'sub-lini1-01',
    respondentName: 'Agus Priyono',
    respondentGroup: 'lini1',
    department: 'Divisi Pemasaran & Penjualan',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    notes: 'Perlu sosialisasi selera risiko yang lebih sederhana untuk tim sales.',
    submittedAt: '2026-03-14T10:15:00.000Z'
  },
  {
    id: 'sub-lini1-02',
    respondentName: 'Eko Wahyudi',
    respondentGroup: 'lini1',
    department: 'Divisi Produksi & Pabrik',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    submittedAt: '2026-03-14T14:00:00.000Z'
  },
  {
    id: 'sub-lini1-03',
    respondentName: 'Ratna Sari',
    respondentGroup: 'lini1',
    department: 'Divisi Pengadaan & Logistik',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    submittedAt: '2026-03-15T09:00:00.000Z'
  },
  {
    id: 'sub-lini1-04',
    respondentName: 'Hendra Gunawan',
    respondentGroup: 'lini1',
    department: 'Divisi SDM & Human Capital',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    submittedAt: '2026-03-15T11:30:00.000Z'
  },
  {
    id: 'sub-lini1-05',
    respondentName: 'Wahyu Hidayat',
    respondentGroup: 'lini1',
    department: 'Divisi Teknologi Informasi',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    submittedAt: '2026-03-16T13:45:00.000Z'
  },
  {
    id: 'sub-lini1-06',
    respondentName: 'Anisa Putri',
    respondentGroup: 'lini1',
    department: 'Divisi Keuangan & Akuntansi',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    submittedAt: '2026-03-16T15:10:00.000Z'
  },
  {
    id: 'sub-lini1-07',
    respondentName: 'Doni Pratama',
    respondentGroup: 'lini1',
    department: 'Divisi Corporate Secretary & Humas',
    answers: generateAnswers(PT_ABC_BASE_SCORES, -1),
    submittedAt: '2026-03-17T09:20:00.000Z'
  },
  {
    id: 'sub-lini1-08',
    respondentName: 'Tri Haryanto',
    respondentGroup: 'lini1',
    department: 'Unit Proyek Strategis',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    submittedAt: '2026-03-17T14:50:00.000Z'
  },
  {
    id: 'sub-lini1-09',
    respondentName: 'Nurul Hidayati',
    respondentGroup: 'lini1',
    department: 'Unit Manajemen Mutu & K3L',
    answers: generateAnswers(PT_ABC_BASE_SCORES, 0),
    submittedAt: '2026-03-18T10:30:00.000Z'
  },
  {
    id: 'sub-lini1-10',
    respondentName: 'Bambang Irawan',
    respondentGroup: 'lini1',
    department: 'Cabang Regional Jawa Barat',
    answers: generateAnswers(PT_ABC_BASE_SCORES, -1),
    notes: 'Pelatihan risiko untuk personil cabang masih sangat minim.',
    submittedAt: '2026-03-18T16:00:00.000Z'
  }
];
