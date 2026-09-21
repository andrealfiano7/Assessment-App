import { SurveyQuestion } from '../types/rmi';

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  // DIMENSI 1: Budaya dan Kapabilitas Risiko
  {
    id: 'D1_Q1',
    dimNum: 1,
    dimName: 'Budaya dan Kapabilitas Risiko',
    subtopic: 'Keteladanan Pimpinan (Tone from the Top)',
    question: 'Pimpinan (Dewan Komisaris & Direksi) secara aktif dan konsisten menunjukkan keteladanan serta mengomunikasikan pentingnya manajemen risiko dalam pengambilan keputusan bisnis.'
  },
  {
    id: 'D1_Q2',
    dimNum: 1,
    dimName: 'Budaya dan Kapabilitas Risiko',
    subtopic: 'Kesadaran & Tanggung Jawab Pegawai',
    question: 'Seluruh pegawai di unit kerja saya memiliki kesadaran risiko yang baik dan memahami bahwa pengelolaan risiko merupakan bagian dari tanggung jawab pekerjaannya sehari-hari.'
  },
  {
    id: 'D1_Q3',
    dimNum: 1,
    dimName: 'Budaya dan Kapabilitas Risiko',
    subtopic: 'Program Pelatihan & Sertifikasi',
    question: 'Perusahaan menyediakan program pelatihan, sosialisasi, atau sertifikasi manajemen risiko secara rutin, berkualitas, dan relevan dengan tingkat jabatan/kebutuhan unit kerja.'
  },
  {
    id: 'D1_Q4',
    dimNum: 1,
    dimName: 'Budaya dan Kapabilitas Risiko',
    subtopic: 'Apresiasi & Budaya Keterbukaan',
    question: 'Perusahaan memiliki budaya keterbukaan (open risk culture) dalam melaporkan potensi risiko/kegagalan tanpa takut disalahkan, serta memberikan apresiasi bagi inisiatif pengelolaan risiko yang baik.'
  },

  // DIMENSI 2: Organisasi dan Tata Kelola Risiko
  {
    id: 'D2_Q1',
    dimNum: 2,
    dimName: 'Organisasi dan Tata Kelola Risiko',
    subtopic: 'Penerapan Model Tiga Lini (Three Lines)',
    question: 'Pembagian peran Tiga Lini (Lini 1: Operasional, Lini 2: Risk & Compliance, Lini 3: Audit Internal) telah dipahami dan berjalan efektif tanpa tumpang tindih tanggung jawab.'
  },
  {
    id: 'D2_Q2',
    dimNum: 2,
    dimName: 'Organisasi dan Tata Kelola Risiko',
    subtopic: 'Peran Komite Pengawas Risiko',
    question: 'Komite Pemantau Risiko (Dewan Komisaris) dan Komite Manajemen Risiko (Direksi) secara rutin mengkaji profil risiko dan memberikan rekomendasi strategis yang ditindaklanjuti nyata.'
  },
  {
    id: 'D2_Q3',
    dimNum: 2,
    dimName: 'Organisasi dan Tata Kelola Risiko',
    subtopic: 'Independensi & Wewenang Lini Kedua',
    question: 'Fungsi Manajemen Risiko (Lini 2) memiliki kewenangan, independensi, dan sumber daya personel yang memadai untuk menantang (challenge) keputusan bisnis yang berisiko tinggi.'
  },
  {
    id: 'D2_Q4',
    dimNum: 2,
    dimName: 'Organisasi dan Tata Kelola Risiko',
    subtopic: 'Mekanisme Eskalasi Masalah',
    question: 'Terdapat kriteria dan jalur eskalasi isu risiko yang jelas dan cepat dari tingkat operasional ke Direksi/Komisaris apabila terjadi peristiwa risiko yang melewati ambang batas.'
  },

  // DIMENSI 3: Kerangka Risiko dan Kepatuhan
  {
    id: 'D3_Q1',
    dimNum: 3,
    dimName: 'Kerangka Risiko dan Kepatuhan',
    subtopic: 'Kelengkapan Kebijakan & Pedoman',
    question: 'Pedoman, kebijakan, dan SOP manajemen risiko tersedia lengkap, mudah diakses oleh seluruh pegawai, dan secara berkala dimutakhirkan sesuai perkembangan regulasi.'
  },
  {
    id: 'D3_Q2',
    dimNum: 3,
    dimName: 'Kerangka Risiko dan Kepatuhan',
    subtopic: 'Penerapan Selera Risiko (Risk Appetite)',
    question: 'Pernyataan Selera Risiko (Risk Appetite Statement) dan Batas Toleransi Risiko ditetapkan secara terukur serta dipedomani dalam persetujuan proyek/transaksi penting.'
  },
  {
    id: 'D3_Q3',
    dimNum: 3,
    dimName: 'Kerangka Risiko dan Kepatuhan',
    subtopic: 'Kepatuhan Regulasi & Juknis BUMN',
    question: 'Perusahaan secara disiplin mematuhi seluruh regulasi Kementerian BUMN, peraturan perundang-undangan industri, serta standar tata kelola yang berlaku.'
  },
  {
    id: 'D3_Q4',
    dimNum: 3,
    dimName: 'Kerangka Risiko dan Kepatuhan',
    subtopic: 'Standarisasi Taksonomi Risiko',
    question: 'Perusahaan menggunakan taksonomi, terminologi, dan metodologi penilaian risiko yang baku serta seragam di seluruh divisi dan anak perusahaan.'
  },

  // DIMENSI 4: Proses dan Kontrol Risiko
  {
    id: 'D4_Q1',
    dimNum: 4,
    dimName: 'Proses dan Kontrol Risiko',
    subtopic: 'Identifikasi & Register Risiko Rutin',
    question: 'Proses identifikasi, analisis, dan pembaruan Register Risiko (Risk Register) dilakukan secara rutin dan mendalam, bukan sekadar pemenuhan dokumen administratif.'
  },
  {
    id: 'D4_Q2',
    dimNum: 4,
    dimName: 'Proses dan Kontrol Risiko',
    subtopic: 'Disiplin Rencana Mitigasi (Action Plan)',
    question: 'Rencana aksi mitigasi risiko dilaksanakan secara disiplin dengan penanggung jawab dan batas waktu penyelesaian yang dipantau progresnya secara berkala.'
  },
  {
    id: 'D4_Q3',
    dimNum: 4,
    dimName: 'Proses dan Kontrol Risiko',
    subtopic: 'Pencatatan Insiden & Kerugian Risiko',
    question: 'Setiap insiden operasional, kerugian finansial, atau kegagalan kontrol segera dicatat dalam database insiden (Risk Event / Loss Event Database) dan diinvestigasi akar masalahnya.'
  },
  {
    id: 'D4_Q4',
    dimNum: 4,
    dimName: 'Proses dan Kontrol Risiko',
    subtopic: 'Ketahanan Bisnis (BCP) & Simulasi Krisis',
    question: 'Rencana Kelangsungan Usaha (Business Continuity Plan / BCP) dan kesiapsiagaan darurat telah disimulasikan secara berkala dan siap diaktifkan saat terjadi krisis.'
  },

  // DIMENSI 5: Model, Data, dan Teknologi Risiko
  {
    id: 'D5_Q1',
    dimNum: 5,
    dimName: 'Model, Data, dan Teknologi Risiko',
    subtopic: 'Sistem Informasi & Aplikasi Risiko',
    question: 'Tersedia aplikasi/sistem informasi manajemen risiko yang terintegrasi, andal, dan mempermudah pelaporan profil risiko secara terpusat.'
  },
  {
    id: 'D5_Q2',
    dimNum: 5,
    dimName: 'Model, Data, dan Teknologi Risiko',
    subtopic: 'Kualitas & Integritas Data Risiko',
    question: 'Data profil risiko dan Key Risk Indicators (KRI) yang disajikan akurat, mutakhir, serta dapat diandalkan oleh manajemen untuk pengambilan keputusan.'
  },
  {
    id: 'D5_Q3',
    dimNum: 5,
    dimName: 'Model, Data, dan Teknologi Risiko',
    subtopic: 'Indikator Peringatan Dini (Early Warning)',
    question: 'Perusahaan memiliki sistem indikator peringatan dini (Early Warning System / EWS) yang mampu mendeteksi potensi pemburukan risiko sebelum berdampak fatal.'
  },
  {
    id: 'D5_Q4',
    dimNum: 5,
    dimName: 'Model, Data, dan Teknologi Risiko',
    subtopic: 'Keamanan Data & Tata Kelola IT',
    question: 'Keamanan data risiko, hak akses sistem, dan privasi informasi terlindungi dengan baik dari potensi ancaman siber (cybersecurity) dan kebocoran data.'
  }
];

export const RESPONDENT_GROUPS = [
  {
    id: 'dekom' as const,
    label: 'Dewan Komisaris / Dewan Pengawas / KPR',
    shortLabel: 'Dekom / KPR',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-300'
  },
  {
    id: 'direksi' as const,
    label: 'Direksi (Board of Directors)',
    shortLabel: 'Direksi',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-300'
  },
  {
    id: 'lini1' as const,
    label: 'Lini Pertama (Unit Bisnis & Operasional)',
    shortLabel: 'Lini 1 (Bisnis)',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-300'
  },
  {
    id: 'lini2' as const,
    label: 'Lini Kedua (Fungsi Manajemen Risiko & Kepatuhan)',
    shortLabel: 'Lini 2 (Risk/Legal)',
    badgeColor: 'bg-emerald-100 text-emerald-700 border-emerald-300'
  },
  {
    id: 'lini3' as const,
    label: 'Lini Ketiga (Satuan Pengawas Intern / Audit)',
    shortLabel: 'Lini 3 (SPI / Audit)',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-300'
  }
];

export const LIKERT_OPTIONS = [
  { value: 1, label: 'Sangat Kurang / Tidak Sesuai', shortLabel: '1 - Sangat Kurang', color: 'rose' },
  { value: 2, label: 'Kurang / Belum Memadai', shortLabel: '2 - Kurang', color: 'amber' },
  { value: 3, label: 'Cukup / Sebagian Memenuhi', shortLabel: '3 - Cukup', color: 'blue' },
  { value: 4, label: 'Baik / Sesuai Praktik', shortLabel: '4 - Baik', color: 'indigo' },
  { value: 5, label: 'Sangat Baik / Praktik Terbaik', shortLabel: '5 - Sangat Baik', color: 'emerald' }
];
