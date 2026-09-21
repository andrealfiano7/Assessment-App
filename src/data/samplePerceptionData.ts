import { SurveySubmission } from '../types/rmi';

export const SAMPLE_SURVEY_SUBMISSIONS: SurveySubmission[] = [
  // 1. Dewan Komisaris / KPR (2 responden)
  {
    id: 'sub-dekom-01',
    respondentName: 'Dr. H. Bambang S., M.Sc.',
    respondentGroup: 'dekom',
    department: 'Komite Pemantau Risiko (KPR)',
    answers: {
      D1_Q1: 4, D1_Q2: 4, D1_Q3: 4, D1_Q4: 3,
      D2_Q1: 4, D2_Q2: 5, D2_Q3: 4, D2_Q4: 4,
      D3_Q1: 4, D3_Q2: 4, D3_Q3: 5, D3_Q4: 4,
      D4_Q1: 4, D4_Q2: 4, D4_Q3: 3, D4_Q4: 4,
      D5_Q1: 4, D5_Q2: 3, D5_Q3: 3, D5_Q4: 4
    },
    notes: 'Dewan Komisaris mengapresiasi peningkatan disiplin pelaporan risiko triwulanan.',
    submittedAt: '2026-03-05T09:30:00.000Z'
  },
  {
    id: 'sub-dekom-02',
    respondentName: 'Ir. Hendro Wijaya, MBA',
    respondentGroup: 'dekom',
    department: 'Dewan Pengawas / Komisaris Independen',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 4, D1_Q4: 3,
      D2_Q1: 4, D2_Q2: 4, D2_Q3: 4, D2_Q4: 3,
      D3_Q1: 5, D3_Q2: 4, D3_Q3: 4, D3_Q4: 4,
      D4_Q1: 3, D4_Q2: 4, D4_Q3: 3, D4_Q4: 3,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 3, D5_Q4: 4
    },
    notes: 'Perlu penguatan EWS dan simulasi BCP berkala pada unit logistik.',
    submittedAt: '2026-03-06T14:15:00.000Z'
  },

  // 2. Direksi (3 responden)
  {
    id: 'sub-dir-01',
    respondentName: 'Ir. Ahmad Zulkarnain, MM',
    respondentGroup: 'direksi',
    department: 'Direktur Utama',
    answers: {
      D1_Q1: 5, D1_Q2: 4, D1_Q3: 4, D1_Q4: 4,
      D2_Q1: 5, D2_Q2: 4, D2_Q3: 5, D2_Q4: 4,
      D3_Q1: 5, D3_Q2: 5, D3_Q3: 5, D3_Q4: 4,
      D4_Q1: 4, D4_Q2: 4, D4_Q3: 4, D4_Q4: 4,
      D5_Q1: 4, D5_Q2: 4, D5_Q3: 4, D5_Q4: 4
    },
    notes: 'Direksi berkomitmen penuh menjadikan risk culture sebagai DNA perusahaan.',
    submittedAt: '2026-03-08T10:00:00.000Z'
  },
  {
    id: 'sub-dir-02',
    respondentName: 'Siti Rahmawati, SE, Ak.',
    respondentGroup: 'direksi',
    department: 'Direktur Keuangan & Manajemen Risiko',
    answers: {
      D1_Q1: 5, D1_Q2: 4, D1_Q3: 5, D1_Q4: 4,
      D2_Q1: 4, D2_Q2: 5, D2_Q3: 5, D2_Q4: 4,
      D3_Q1: 5, D3_Q2: 5, D3_Q3: 5, D3_Q4: 5,
      D4_Q1: 4, D4_Q2: 4, D4_Q3: 4, D4_Q4: 4,
      D5_Q1: 4, D5_Q2: 4, D5_Q3: 4, D5_Q4: 4
    },
    notes: 'Kepatuhan terhadap batas selera risiko keuangan dipantau mingguan.',
    submittedAt: '2026-03-08T11:45:00.000Z'
  },
  {
    id: 'sub-dir-03',
    respondentName: 'Budi Santoso, ST',
    respondentGroup: 'direksi',
    department: 'Direktur Operasional & Teknik',
    answers: {
      D1_Q1: 4, D1_Q2: 4, D1_Q3: 4, D1_Q4: 3,
      D2_Q1: 4, D2_Q2: 4, D2_Q3: 4, D2_Q4: 4,
      D3_Q1: 4, D3_Q2: 4, D3_Q3: 5, D3_Q4: 4,
      D4_Q1: 4, D4_Q2: 4, D4_Q3: 3, D4_Q4: 4,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 3, D5_Q4: 4
    },
    notes: 'Aplikasi MR di unit operasional lapangan perlu dibuat lebih ramah pengguna.',
    submittedAt: '2026-03-09T08:20:00.000Z'
  },

  // 3. Lini Kedua: Fungsi Manajemen Risiko & Kepatuhan (4 responden)
  {
    id: 'sub-lini2-01',
    respondentName: 'Dimas Prasetyo, CRM',
    respondentGroup: 'lini2',
    department: 'Divisi Manajemen Risiko Korporat',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 4, D1_Q4: 3,
      D2_Q1: 4, D2_Q2: 4, D2_Q3: 4, D2_Q4: 4,
      D3_Q1: 5, D3_Q2: 4, D3_Q3: 5, D3_Q4: 4,
      D4_Q1: 4, D4_Q2: 3, D4_Q3: 3, D4_Q4: 4,
      D5_Q1: 4, D5_Q2: 3, D5_Q3: 3, D5_Q4: 4
    },
    notes: 'Lini 1 masih sering terlambat menginput loss event register.',
    submittedAt: '2026-03-10T13:00:00.000Z'
  },
  {
    id: 'sub-lini2-02',
    respondentName: 'Maya Indah, SH, MH',
    respondentGroup: 'lini2',
    department: 'Divisi Kepatuhan & Legal',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 4, D1_Q4: 3,
      D2_Q1: 4, D2_Q2: 4, D2_Q3: 4, D2_Q4: 4,
      D3_Q1: 5, D3_Q2: 4, D3_Q3: 5, D3_Q4: 4,
      D4_Q1: 4, D4_Q2: 4, D4_Q3: 4, D4_Q4: 3,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 3, D5_Q4: 4
    },
    notes: 'Kepatuhan terhadap regulasi KBUMN SK-8 sudah sangat baik.',
    submittedAt: '2026-03-10T14:30:00.000Z'
  },
  {
    id: 'sub-lini2-03',
    respondentName: 'Rian Kurniawan, ERMCP',
    respondentGroup: 'lini2',
    department: 'Risk Officer Unit Finansial',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 4, D1_Q4: 3,
      D2_Q1: 4, D2_Q2: 4, D2_Q3: 4, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 4, D3_Q3: 4, D3_Q4: 4,
      D4_Q1: 4, D4_Q2: 3, D4_Q3: 3, D4_Q4: 4,
      D5_Q1: 4, D5_Q2: 3, D5_Q3: 3, D5_Q4: 4
    },
    submittedAt: '2026-03-11T09:15:00.000Z'
  },
  {
    id: 'sub-lini2-04',
    respondentName: 'Dina Anggraini, S.Kom',
    respondentGroup: 'lini2',
    department: 'Risk Technology & Analytics',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 4, D1_Q4: 3,
      D2_Q1: 4, D2_Q2: 4, D2_Q3: 4, D2_Q4: 4,
      D3_Q1: 4, D3_Q2: 4, D3_Q3: 5, D3_Q4: 4,
      D4_Q1: 4, D4_Q2: 4, D4_Q3: 3, D4_Q4: 4,
      D5_Q1: 4, D5_Q2: 4, D5_Q3: 4, D5_Q4: 5
    },
    submittedAt: '2026-03-11T16:00:00.000Z'
  },

  // 4. Lini Ketiga: Internal Audit / SPI (3 responden)
  {
    id: 'sub-lini3-01',
    respondentName: 'Kusuma Wardhana, CIA, CISA',
    respondentGroup: 'lini3',
    department: 'Kepala Satuan Pengawas Intern (SPI)',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 3, D1_Q4: 2,
      D2_Q1: 4, D2_Q2: 4, D2_Q3: 4, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 3, D3_Q3: 4, D3_Q4: 3,
      D4_Q1: 3, D4_Q2: 3, D4_Q3: 3, D4_Q4: 3,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 2, D5_Q4: 4
    },
    notes: 'Audit berbasis risiko (Risk Based Internal Audit) perlu didukung data KRI yang lebih tepat waktu.',
    submittedAt: '2026-03-12T11:00:00.000Z'
  },
  {
    id: 'sub-lini3-02',
    respondentName: 'Ferry Ardiansyah, QIA',
    respondentGroup: 'lini3',
    department: 'Auditor Senior Pengawasan Operasi',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 3, D1_Q4: 3,
      D2_Q1: 3, D2_Q2: 4, D2_Q3: 4, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 3, D3_Q3: 4, D3_Q4: 3,
      D4_Q1: 3, D4_Q2: 3, D4_Q3: 3, D4_Q4: 3,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 2, D5_Q4: 3
    },
    submittedAt: '2026-03-12T15:20:00.000Z'
  },
  {
    id: 'sub-lini3-03',
    respondentName: 'Dewi Lestari, Ak, CA',
    respondentGroup: 'lini3',
    department: 'Auditor Keuangan & IT',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 3, D1_Q4: 2,
      D2_Q1: 4, D2_Q2: 3, D2_Q3: 4, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 3, D3_Q3: 4, D3_Q4: 3,
      D4_Q1: 3, D4_Q2: 3, D4_Q3: 3, D4_Q4: 3,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 3, D5_Q4: 4
    },
    submittedAt: '2026-03-13T09:40:00.000Z'
  },

  // 5. Lini Pertama: Unit Bisnis & Operasional (10 responden)
  {
    id: 'sub-lini1-01',
    respondentName: 'Agus Priyono',
    respondentGroup: 'lini1',
    department: 'Divisi Pemasaran & Penjualan',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 3, D1_Q4: 2,
      D2_Q1: 3, D2_Q2: 3, D2_Q3: 3, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 3, D3_Q3: 4, D3_Q4: 3,
      D4_Q1: 3, D4_Q2: 3, D4_Q3: 3, D4_Q4: 3,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 2, D5_Q4: 3
    },
    notes: 'Perlu sosialisasi selera risiko yang lebih sederhana untuk tim sales.',
    submittedAt: '2026-03-14T10:15:00.000Z'
  },
  {
    id: 'sub-lini1-02',
    respondentName: 'Eko Wahyudi',
    respondentGroup: 'lini1',
    department: 'Divisi Produksi & Pabrik',
    answers: {
      D1_Q1: 3, D1_Q2: 3, D1_Q3: 3, D1_Q4: 3,
      D2_Q1: 3, D2_Q2: 3, D2_Q3: 3, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 3, D3_Q3: 4, D3_Q4: 3,
      D4_Q1: 3, D4_Q2: 3, D4_Q3: 3, D4_Q4: 4,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 3, D5_Q4: 3
    },
    submittedAt: '2026-03-14T14:00:00.000Z'
  },
  {
    id: 'sub-lini1-03',
    respondentName: 'Ratna Sari',
    respondentGroup: 'lini1',
    department: 'Divisi Pengadaan & Logistik',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 3, D1_Q4: 2,
      D2_Q1: 3, D2_Q2: 3, D2_Q3: 3, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 3, D3_Q3: 4, D3_Q4: 3,
      D4_Q1: 3, D4_Q2: 3, D4_Q3: 3, D4_Q4: 3,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 2, D5_Q4: 3
    },
    submittedAt: '2026-03-15T09:00:00.000Z'
  },
  {
    id: 'sub-lini1-04',
    respondentName: 'Hendra Gunawan',
    respondentGroup: 'lini1',
    department: 'Divisi SDM & Human Capital',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 4, D1_Q4: 3,
      D2_Q1: 4, D2_Q2: 3, D2_Q3: 3, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 3, D3_Q3: 4, D3_Q4: 3,
      D4_Q1: 3, D4_Q2: 3, D4_Q3: 3, D4_Q4: 3,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 3, D5_Q4: 4
    },
    submittedAt: '2026-03-15T11:30:00.000Z'
  },
  {
    id: 'sub-lini1-05',
    respondentName: 'Wahyu Hidayat',
    respondentGroup: 'lini1',
    department: 'Divisi Teknologi Informasi',
    answers: {
      D1_Q1: 4, D1_Q2: 4, D1_Q3: 3, D1_Q4: 3,
      D2_Q1: 4, D2_Q2: 3, D2_Q3: 4, D2_Q4: 4,
      D3_Q1: 4, D3_Q2: 3, D3_Q3: 4, D3_Q4: 4,
      D4_Q1: 4, D4_Q2: 3, D4_Q3: 3, D4_Q4: 4,
      D5_Q1: 4, D5_Q2: 4, D5_Q3: 3, D5_Q4: 4
    },
    submittedAt: '2026-03-16T13:45:00.000Z'
  },
  {
    id: 'sub-lini1-06',
    respondentName: 'Anisa Putri',
    respondentGroup: 'lini1',
    department: 'Divisi Keuangan & Akuntansi',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 3, D1_Q4: 3,
      D2_Q1: 4, D2_Q2: 3, D2_Q3: 3, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 4, D3_Q3: 5, D3_Q4: 4,
      D4_Q1: 3, D4_Q2: 3, D4_Q3: 3, D4_Q4: 3,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 3, D5_Q4: 4
    },
    submittedAt: '2026-03-16T15:10:00.000Z'
  },
  {
    id: 'sub-lini1-07',
    respondentName: 'Doni Pratama',
    respondentGroup: 'lini1',
    department: 'Divisi Corporate Secretary & Humas',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 3, D1_Q4: 2,
      D2_Q1: 3, D2_Q2: 3, D2_Q3: 3, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 3, D3_Q3: 4, D3_Q4: 3,
      D4_Q1: 3, D4_Q2: 3, D4_Q3: 3, D4_Q4: 3,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 2, D5_Q4: 3
    },
    submittedAt: '2026-03-17T09:20:00.000Z'
  },
  {
    id: 'sub-lini1-08',
    respondentName: 'Tri Haryanto',
    respondentGroup: 'lini1',
    department: 'Unit Proyek Strategis',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 3, D1_Q4: 2,
      D2_Q1: 3, D2_Q2: 3, D2_Q3: 3, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 3, D3_Q3: 4, D3_Q4: 3,
      D4_Q1: 3, D4_Q2: 3, D4_Q3: 3, D4_Q4: 3,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 2, D5_Q4: 3
    },
    submittedAt: '2026-03-17T14:50:00.000Z'
  },
  {
    id: 'sub-lini1-09',
    respondentName: 'Nurul Hidayati',
    respondentGroup: 'lini1',
    department: 'Unit Manajemen Mutu & K3L',
    answers: {
      D1_Q1: 4, D1_Q2: 3, D1_Q3: 3, D1_Q4: 3,
      D2_Q1: 4, D2_Q2: 3, D2_Q3: 3, D2_Q4: 3,
      D3_Q1: 4, D3_Q2: 3, D3_Q3: 4, D3_Q4: 3,
      D4_Q1: 4, D4_Q2: 4, D4_Q3: 3, D4_Q4: 4,
      D5_Q1: 3, D5_Q2: 3, D5_Q3: 3, D5_Q4: 3
    },
    submittedAt: '2026-03-18T10:30:00.000Z'
  },
  {
    id: 'sub-lini1-10',
    respondentName: 'Bambang Irawan',
    respondentGroup: 'lini1',
    department: 'Cabang Regional Jawa Barat',
    answers: {
      D1_Q1: 3, D1_Q2: 3, D1_Q3: 2, D1_Q4: 2,
      D2_Q1: 3, D2_Q2: 3, D2_Q3: 3, D2_Q4: 3,
      D3_Q1: 3, D3_Q2: 3, D3_Q3: 4, D3_Q4: 3,
      D4_Q1: 3, D4_Q2: 3, D4_Q3: 2, D4_Q4: 3,
      D5_Q1: 2, D5_Q2: 2, D5_Q3: 2, D5_Q4: 3
    },
    notes: 'Pelatihan risiko untuk personil cabang masih sangat minim.',
    submittedAt: '2026-03-18T16:00:00.000Z'
  }
];
