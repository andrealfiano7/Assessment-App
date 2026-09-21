import { SurveyQuestion, IndustryModel, RmiParameter } from '../types/rmi';
import { getParametersForModel } from '../utils/storage';

// Peta Authoritative Kalimat Pertanyaan Kuesioner untuk Tiap Parameter (P.1 s.d. P.42)
const PARAMETER_QUESTION_MAP: Record<string, string> = {
  // DIMENSI 1: Budaya dan Kapabilitas Risiko
  'Internalisasi budaya Risiko dalam budaya perusahaan':
    'Sejauh mana budaya risiko telah diinternalisasikan dan ditanamkan ke dalam perilaku serta kegiatan operasional sehari-hari seluruh pegawai perusahaan?',
  'Peran Penilaian RMI dalam upaya peningkatan praktik Manajemen Risiko':
    'Bagaimana efektivitas dan keberlanjutan pelaksanaan Penilaian RMI dalam mendorong perbaikan nyata praktik manajemen risiko perusahaan?',
  'Program peningkatan keahlian Risiko':
    'Apakah program peningkatan keahlian dan pelatihan manajemen risiko telah diselenggarakan secara rutin, komprehensif, dan menjangkau seluruh tingkatan pegawai?',

  // DIMENSI 2: Organisasi dan Tata Kelola Risiko
  'Efektivitas fungsi pengelola risiko':
    'Seberapa efektif fungsi pengelola risiko dalam mengoordinasikan, memfasilitasi, dan mengawasi pelaksanaan manajemen risiko di seluruh unit kerja perusahaan?',
  'Tingkat kematangan organ pengelola Risiko':
    'Apakah kelengkapan struktur, fungsi, dan wewenang organ pengelola risiko telah memenuhi ketentuan regulasi serta klasifikasi risiko perusahaan?',
  'Akuntabilitas organ pengelola risiko':
    'Bagaimana kejelasan akuntabilitas, pembagian tugas, dan tanggung jawab jajaran organ pengelola risiko dalam struktur organisasi perusahaan?',
  'Keterlibatan aktif Dewan Komisaris/ Dewan Pengawas dalam pengelolaan Risiko':
    'Bagaimana keterlibatan aktif Dewan Komisaris / Dewan Pengawas dalam mengawasi dan memberikan arahan strategis terhadap pengelolaan risiko perusahaan?',
  'Keterlibatan aktif Dewan Komisaris dalam pengelolaan Risiko':
    'Bagaimana keterlibatan aktif Dewan Komisaris dalam mengawasi dan memberikan arahan strategis terhadap pengelolaan risiko perusahaan?',
  'Eskalasi permasalahan kepada Dewan Komisaris/Dewa n Pengawas':
    'Apakah mekanisme dan kriteria eskalasi permasalahan risiko kritikal kepada Dewan Komisaris / Dewan Pengawas telah berjalan cepat, transparan, dan terukur?',
  'Eskalasi permasalahan kepada Dewan Komisaris':
    'Apakah mekanisme dan kriteria eskalasi permasalahan risiko kritikal kepada Dewan Komisaris telah berjalan cepat, transparan, dan terukur?',
  'Tingkat pemahaman Risiko di jajaran Dewan Komisaris/ Dewan Pengawas':
    'Bagaimana tingkat pemahaman dan penguasaan teknis jajaran Dewan Komisaris / Dewan Pengawas terhadap profil risiko utama dan dinamika industri perusahaan?',
  'Tingkat pemahaman Risiko di jajaran Dewan Komisaris':
    'Bagaimana tingkat pemahaman dan penguasaan teknis jajaran Dewan Komisaris terhadap profil risiko utama dan dinamika industri perusahaan?',
  'Peran komite- komite di bawah Dewan Komisaris/ Dewan Pengawas':
    'Sejauh mana Komite Pemantau Risiko (KPR) dan komite pengawas lainnya aktif mengkaji kecukupan manajemen risiko dan memberikan rekomendasi berkala?',
  'Peran komite- komite di bawah Dewan Komisaris':
    'Sejauh mana Komite Pemantau Risiko (KPR) dan komite pengawas lainnya aktif mengkaji kecukupan manajemen risiko dan memberikan rekomendasi berkala?',
  'Pengurusan aktif Direksi dalam pengelolaan Risiko':
    'Bagaimana kepemimpinan dan komitmen aktif jajaran Direksi dalam memastikan pengelolaan risiko terintegrasi dalam setiap pengambilan keputusan bisnis?',
  'Mandat, wewenang, dan independensi fungsi Manajemen Risiko untuk memantau semua Risiko':
    'Apakah fungsi Manajemen Risiko memiliki mandat formal, independensi, dan wewenang yang memadai untuk memantau serta menantang (challenge) seluruh eksposur risiko?',
  'Mandat, wewenang, dan independensi fungsi Manajemen':
    'Apakah fungsi Manajemen Risiko memiliki mandat formal, independensi, dan wewenang yang memadai untuk memantau serta menantang (challenge) seluruh eksposur risiko?',
  'Efektivitas fungsi pengelola risiko dalam menjalankan tugasnya':
    'Bagaimana kinerja dan kapabilitas fungsi pengelola risiko dalam mengidentifikasi, mengukur, memitigasi, serta melaporkan eksposur risiko secara konsisten?',
  'Penerapan Model Tata Kelola Risiko Tiga Lini':
    'Seberapa baik penerapan Model Tata Kelola Tiga Lini (Three Lines Model) berjalan efektif tanpa tumpang tindih peran dan tanggung jawab antar-lini?',
  'Model Tata Kelola Risiko Tiga Lini':
    'Seberapa baik penerapan Model Tata Kelola Tiga Lini (Three Lines Model) berjalan efektif tanpa tumpang tindih peran dan tanggung jawab antar-lini?',
  'Peran dan fungsi Lini Pertama':
    'Apakah Lini Pertama (Unit Bisnis / Operasional) telah menjalankan perannya sebagai pemilik risiko (risk owner) dengan mengidentifikasi dan mengontrol risiko secara mandiri?',
  'Peran dan fungsi Lini Kedua':
    'Bagaimana efektivitas Lini Kedua (Fungsi Manajemen Risiko & Kepatuhan) dalam menyusun metodologi, kebijakan, serta memfasilitasi pengelolaan risiko korporasi?',
  'Peran dan fungsi Lini Ketiga':
    'Sejauh mana Lini Ketiga (Satuan Pengawas Intern / Audit) memberikan asurans independen dan objektif terhadap kecukupan tata kelola dan pengendalian risiko?',
  'Interaksi antara fungsi Risiko dan Assurance (kepatuhan, legal, audit)':
    'Bagaimana kualitas sinergi, koordinasi, dan pertukaran informasi (assurance integration) antara fungsi Manajemen Risiko, Kepatuhan, Legal, dan Internal Audit?',
  'Peran dan fungsi Tata Kelola Risiko Terintegrasi':
    'Apakah kerangka Tata Kelola Risiko Terintegrasi telah berfungsi optimal dalam menyelaraskan profil dan selera risiko antara entitas induk dan anak perusahaan?',
  'Monitoring risiko entitas induk sampai ke entitas anak':
    'Bagaimana efektivitas pemantauan, konsolidasi, dan pengawasan profil risiko anak perusahaan / entitas afiliasi oleh entitas induk secara berkala?',

  // DIMENSI 3: Kerangka Risiko dan Kepatuhan
  'Peningkatan kualitas kerangka':
    'Apakah kerangka kerja manajemen risiko (Risk Framework) secara berkala dievaluasi dan ditingkatkan kualitasnya sesuai standar praktik terbaik industri?',
  'Peningkatan kualitas kerangka Manajemen Risiko':
    'Apakah kerangka kerja manajemen risiko (Risk Framework) secara berkala dievaluasi dan ditingkatkan kualitasnya sesuai standar praktik terbaik industri?',
  'Rencana transformasi Enterprise Risk Management':
    'Sejauh mana peta jalan (roadmap) dan rencana transformasi Enterprise Risk Management (ERM) diimplementasikan secara terstruktur dan terukur?',
  'Rencana transformasi Enterprise Risk Management (ERM)':
    'Sejauh mana peta jalan (roadmap) dan rencana transformasi Enterprise Risk Management (ERM) diimplementasikan secara terstruktur dan terukur?',
  'Peran Manajemen Risiko dalam penyusunan rencana strategis':
    'Apakah analisis dan kajian profil risiko telah diintegrasikan secara formal dalam proses penyusunan Rencana Jangka Panjang Perusahaan (RJPP)?',
  'Hubungan peran Manajemen Risiko terhadap pencapaian target strategis RKAP':
    'Bagaimana keterlibatan fungsi manajemen risiko dalam memastikan target strategis Rencana Kerja dan Anggaran Perusahaan (RKAP) dapat dicapai dengan mitigasi yang memadai?',
  'Kapasitas risiko':
    'Apakah perusahaan telah menetapkan batas maksimum kapasitas risiko (Risk Capacity) yang mampu ditanggung berdasarkan ketahanan modal dan likuiditas?',
  'Selera Risiko':
    'Sejauh mana Pernyataan Selera Risiko (Risk Appetite Statement) dan Batas Toleransi Risiko dipedomani secara konsisten dalam keputusan bisnis sehari-hari?',
  'Komunikasi selera Risiko kepada pemangku kepentingan eksternal':
    'Apakah kebijakan dan selera risiko perusahaan telah dikomunikasikan secara transparan kepada pemangku kepentingan eksternal terkait (regulator, investor, kreditur)?',
  'Kebijakan Risiko':
    'Apakah kebijakan manajemen risiko perusahaan telah disahkan secara formal, memadai, dan mencakup seluruh jenis risiko yang dihadapi perusahaan?',
  'Prosedur risiko':
    'Seberapa jelas, praktis, dan mutakhir standar operasional prosedur (SOP) manajemen risiko dalam memandu pelaksanaan teknis mitigasi di setiap unit kerja?',
  'Kebijakan dan/atau prosedur untuk mitigasi peristiwa penting terkait kerahasiaan data':
    'Apakah kebijakan dan prosedur mitigasi risiko kerahasiaan, privasi data, dan keamanan informasi telah diimplementasikan secara ketat?',
  'Rencana darurat (contingency plan)':
    'Apakah perusahaan telah menyusun dan memutakhirkan rencana darurat (Contingency Plan) untuk mengantisipasi skenario krisis operasional dan finansial?',
  'Reviu dan Stress test terhadap prosedur dan SOP':
    'Seberapa rutin reviu berkala dan pengujian ketahanan (Stress Testing) dilakukan terhadap keandalan prosedur dan SOP operasional perusahaan?',
  'Organ fungsi kepatuhan dan perannya':
    'Bagaimana efektivitas fungsi kepatuhan dalam memastikan kepatuhan terhadap seluruh peraturan perundang-undangan dan meminimalkan risiko sanksi hukum?',
  'Penerapan Kerangka Integrated Enterprise Risk Management (ERM)':
    'Apakah kerangka kerja Integrated Enterprise Risk Management (ERM) telah diterapkan secara menyeluruh dan terhubung di setiap proses bisnis perusahaan?',
  'Efektivitas Pengendalian Intern':
    'Bagaimana keandalan dan efektivitas sistem pengendalian intern (Internal Control) dalam mencegah terjadinya penyimpangan, kecurangan, dan inefisiensi proses?',
  'Efektivitas praktik Manajemen Risiko':
    'Bagaimana efektivitas dan kualitas implementasi praktik manajemen risiko secara menyeluruh dalam mendukung stabilitas bisnis perusahaan?',

  // DIMENSI 4: Proses dan Kontrol Risiko
  'Identifikasi Risiko utama':
    'Apakah proses identifikasi risiko-risiko utama (Top Risks) dilakukan secara komprehensif, berkala, dan melibatkan seluruh unit kerja terkait?',
  'Pengukuran Risiko':
    'Seberapa andal metodologi pengukuran risiko (kualitatif maupun kuantitatif) dalam menilai tingkat kemungkinan terjadinya dan keparahan dampak risiko?',
  'Kerangka proses pengukuran Risiko untuk prioritisasi Risiko':
    'Apakah kerangka pengukuran risiko telah berjalan efektif untuk memprioritaskan alokasi sumber daya mitigasi pada risiko-risiko berkategori tinggi?',
  'Integrasi atas seluruh Risiko utama':
    'Bagaimana proses integrasi dan agregasi profil seluruh risiko utama di tingkat korporasi untuk memberikan gambaran eksposur menyeluruh bagi Direksi?',
  'Aktivitas perlakuan terhadap Risiko utama':
    'Apakah rencana aksi mitigasi risiko (Risk Treatment Action Plan) telah dilaksanakan secara disiplin dengan penanggung jawab dan batas waktu yang jelas?',
  'Identifikasi dan pengelolaan eksposur Risiko yang berada diatas selera risiko':
    'Bagaimana efektivitas penanganan dan tindakan korektif terhadap eksposur risiko yang teridentifikasi melampaui batas toleransi atau selera risiko perusahaan?',

  // DIMENSI 5: Model, Data, dan Teknologi Risiko
  'Pelaporan Risiko melaporkan Risiko secara real-time':
    'Apakah sistem pelaporan risiko mampu menyajikan laporan profil risiko secara tepat waktu (real-time), akurat, dan mudah dipahami oleh manajemen puncak?',
  'Permodelan dan Teknologi Risiko':
    'Sejauh mana pemanfaatan teknologi informasi, aplikasi manajemen risiko, atau pemodelan analitik dalam mendukung otomatisasi pemantauan risiko?',
  'Model / alat pemantauan untuk menunjang proses Manajemen Risiko dan pengambilan keputusan':
    'Sejauh mana keandalan model dan instrumen pemantauan risiko dalam menunjang pengambilan keputusan bisnis serta pemenuhan regulasi industri?',
  'Sistem informasi Manajemen Risiko':
    'Bagaimana keandalan, integrasi, dan kemudahan akses Sistem Informasi Manajemen Risiko (SIMR) dalam mendukung pelaporan profil risiko korporat?',
  'Data Risiko':
    'Bagaimana keakuratan, kelengkapan, dan ketersediaan basis data risiko historis (termasuk Key Risk Indicators dan Loss Event Database) di perusahaan?',
  'Cakupan dan kualitas data Risiko':
    'Apakah cakupan, integritas, dan validasi kualitas data risiko telah memenuhi standar ketat pengawasan regulator industri finansial?'
};

// Fungsi pembuat kalimat pertanyaan yang selalu menghasilkan pertanyaan bahasa Indonesia yang valid
export function createQuestionSentenceForParameter(paramId: number, title: string): string {
  // Cek kecocokan langsung
  const cleanTitle = title.split('(')[0].trim();
  if (PARAMETER_QUESTION_MAP[title]) {
    return PARAMETER_QUESTION_MAP[title];
  }
  if (PARAMETER_QUESTION_MAP[cleanTitle]) {
    return PARAMETER_QUESTION_MAP[cleanTitle];
  }

  // Cek kecocokan sebagian
  for (const [key, qText] of Object.entries(PARAMETER_QUESTION_MAP)) {
    if (cleanTitle.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(cleanTitle.toLowerCase())) {
      return qText;
    }
  }

  // Fallback kalimat tanya terstruktur
  return `Bagaimana efektivitas penerapan, kecukupan kebijakan, dan pengawasan terkait ${cleanTitle.toLowerCase()} di lingkungan perusahaan?`;
}

// Menghasilkan daftar pertanyaan kuesioner yang 100% PERSIS sejumlah parameter (42 untuk Umum, 40 untuk Finansial)
export function getSurveyQuestionsForModel(model: IndustryModel): SurveyQuestion[] {
  const params = getParametersForModel(model) as RmiParameter[];

  return params.map(p => {
    const questionSentence = createQuestionSentenceForParameter(p.id, p.title);

    return {
      id: String(p.id),
      paramId: p.id,
      dimNum: p.dim_num,
      dimName: p.dim_name,
      subdim: p.subdim,
      paramTitle: p.title,
      question: questionSentence
    };
  });
}

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
  { value: 1, label: 'Sangat Kurang / Belum Ada', shortLabel: '1 - Sangat Kurang', color: 'rose' },
  { value: 2, label: 'Kurang / Sebagian Kecil', shortLabel: '2 - Kurang', color: 'amber' },
  { value: 3, label: 'Cukup / Standar', shortLabel: '3 - Cukup', color: 'blue' },
  { value: 4, label: 'Baik / Sesuai Praktik', shortLabel: '4 - Baik', color: 'indigo' },
  { value: 5, label: 'Sangat Baik / Praktik Terbaik', shortLabel: '5 - Sangat Baik', color: 'emerald' }
];
