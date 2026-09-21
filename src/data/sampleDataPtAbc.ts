import { CompleteAssessmentData, ParameterAssessment, RecommendationItem } from '../types/rmi';
import rmiUmumData from './rmiUmum.json';
import checklistData from './checklistDokumen.json';
import { SAMPLE_SURVEY_SUBMISSIONS } from './samplePerceptionData';

// Generate simulated scores reflecting PT ABC (Average D1=3.7, D2=3.0, D3=3.8, D4=3.2, D5=3.0 -> total ~3.4)
export function getPtAbcSampleData(): CompleteAssessmentData {
  const assessments: Record<number, ParameterAssessment> = {};

  // D1: Budaya dan Kapabilitas Risiko (Target avg ~3.7) -> scores: 4, 3, 4
  const d1Scores = [4, 3, 4];
  // D2: Organisasi & Tata Kelola (Target avg ~3.0) -> scores alternating 3, 3, 4, 2, 3, etc.
  const d2Scores = [3, 3, 4, 3, 2, 3, 4, 3, 3, 3, 2, 3, 3, 3, 3, 3];
  // D3: Kerangka Risiko & Kepatuhan (Target avg ~3.8) -> scores 4, 4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 4
  const d3Scores = [4, 4, 3, 4, 4, 3, 4, 4, 4, 3, 4, 4, 4, 4];
  // D4: Proses dan Kontrol (Target avg ~3.2) -> scores 3, 3, 4, 3, 3, 3
  const d4Scores = [3, 3, 4, 3, 3, 3];
  // D5: Model, Data, Teknologi (Target avg ~3.0) -> scores 3, 3, 3
  const d5Scores = [3, 3, 3];

  let pIndex = 1;
  const assignGroup = (scores: number[]) => {
    scores.forEach(s => {
      assessments[pIndex] = {
        paramId: pIndex,
        score: s,
        findings: s < 4 ? 'Perlu penguatan dokumentasi formal dan pemantauan berkala.' : 'Telah diimplementasikan secara terstruktur di seluruh divisi.',
        evidence: 'SK Direksi, Notulen Rapat Manajemen Risiko, Laporan Tahunan 2022',
        dataSource: 'Reviu Dokumen Kebijakan & Wawancara Risk Management Division'
      };
      pIndex++;
    });
  };

  assignGroup(d1Scores);
  assignGroup(d2Scores);
  assignGroup(d3Scores);
  assignGroup(d4Scores);
  assignGroup(d5Scores);

  const recommendations: RecommendationItem[] = [
    {
      id: 'rec-1',
      dimNum: 1,
      paramId: 3,
      rekomendasi: 'Terdapat potensi yang dapat ditingkatkan dengan menambah personil untuk mengelola manajemen risiko pada sub-holding.',
      impact: 'Tinggi',
      ease: 'Mudah',
      priority: 1,
      timeframe: 'Jangka Pendek',
      aktivitasUtama: 'Analisis beban kerja tim manajemen risiko dan rekrutmen/mutasi personil kompeten bersertifikasi.',
      output: 'SK Penempatan Personil Risk Management Sub-Holding',
      indikatorKeberhasilan: 'Terpenuhinya rasio personil risiko di setiap entitas anak/sub-holding.',
      uic: 'Divisi Human Capital & Manajemen Risiko',
      targetDate: '2024-05-08',
      status: 'BD',
      pemberiTarget: 'Manajemen'
    },
    {
      id: 'rec-2',
      dimNum: 2,
      paramId: 7,
      rekomendasi: 'Dibutuhkan pengembangan kriteria yang lebih jelas untuk isu risiko yang dieskalasi ke Dewan Komisaris.',
      impact: 'Tinggi',
      ease: 'Mudah',
      priority: 1,
      timeframe: 'Jangka Pendek',
      aktivitasUtama: 'Penyusunan matriks batas eskalasi risiko (escalation trigger & threshold) dan sosialisasi ke organ pengawas.',
      output: 'SOP Mekanisme Eskalasi Risiko ke Dewan Komisaris',
      indikatorKeberhasilan: 'Seluruh insiden risiko di atas batas toleransi dilaporkan maksimal 3 hari kerja ke Dekom.',
      uic: 'Divisi Manajemen Risiko & Sekretariat Perusahaan',
      targetDate: '2024-05-08',
      status: 'BS',
      pemberiTarget: 'Manajemen'
    },
    {
      id: 'rec-3',
      dimNum: 3,
      paramId: 20,
      rekomendasi: 'Potensi dalam mengembangkan kerangka yang sistematis untuk mengidentifikasi dan menilai risiko yang mungkin timbul dalam profiling risiko.',
      impact: 'Tinggi',
      ease: 'Sulit',
      priority: 2,
      timeframe: 'Jangka Pendek',
      aktivitasUtama: 'Harmonisasi taksonomi risiko dan implementasi pedoman risk profiling komprehensif.',
      output: 'Buku Pedoman Profil Risiko Terintegrasi',
      indikatorKeberhasilan: 'Tersedianya Risk Register komprehensif di seluruh fungsi bisnis.',
      uic: 'Divisi Manajemen Risiko',
      targetDate: '2024-05-08',
      status: 'S',
      pemberiTarget: 'Manajemen'
    },
    {
      id: 'rec-4',
      dimNum: 4,
      paramId: 35,
      rekomendasi: 'Perlu mengembangkan sistem stress testing manajemen risiko dan instrumen pendukungnya.',
      impact: 'Tinggi',
      ease: 'Sulit',
      priority: 2,
      timeframe: 'Jangka Panjang',
      aktivitasUtama: 'Pengembangan metodologi stress testing kuantitatif berbasis skenario krisis makro ekonomi.',
      output: 'Laporan Kajian Stress Testing Berkala',
      indikatorKeberhasilan: 'Uji ketahanan modal dan likuiditas dijalankan minimal 1 kali per semester.',
      uic: 'Divisi Keuangan & Manajemen Risiko',
      targetDate: '2024-11-30',
      status: 'BS',
      pemberiTarget: 'Kementerian BUMN'
    },
    {
      id: 'rec-5',
      dimNum: 5,
      paramId: 41,
      rekomendasi: 'Integrasi sistem informasi manajemen risiko (SIMR / EGRC) dengan sistem ERP korporasi.',
      impact: 'Tinggi',
      ease: 'Sulit',
      priority: 2,
      timeframe: 'Jangka Panjang',
      aktivitasUtama: 'Pengadaan dan kustomisasi platform EGRC terpusat terhubung dengan database SAP.',
      output: 'Dashboard EGRC Terintegrasi Live',
      indikatorKeberhasilan: 'Data profil risiko diperbarui otomatis secara real-time.',
      uic: 'Divisi TI & Manajemen Risiko',
      targetDate: '2025-06-30',
      status: 'BD',
      pemberiTarget: 'Direksi'
    }
  ];

  return {
    profile: {
      id: 'profile-pt-abc-2022',
      companyName: 'PT ABC (Persero)',
      year: 2022,
      reportNumber: '01/II/RMI/2023',
      model: 'umum',
      assessmentType: 'Independen',
      assessorName: 'Kantor Jasa Penilai / Konsultan Independen Manajemen Risiko',
      observationPeriod: '1 Januari s.d. 31 Desember 2022',
      assessmentDate: '2023-02-28',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    assessments,
    performance: {
      healthRating: 'A',
      compositeRating: 2
    },
    documentChecklist: (checklistData as any[]).map(item => ({
      ...item,
      tersedia: item.id <= 20, // simulate first 20 available
      catatan: item.id <= 20 ? 'Telah diverifikasi oleh tim penilai.' : ''
    })),
    recommendations,
    dimensionSummaries: {
      1: {
        dimNum: 1,
        strengths: 'Kebijakan Manajemen Risiko dan Risk Appetite Statement telah ditetapkan secara formal oleh Direksi dan disetujui Dewan Komisaris. Struktur Three Lines Model telah terdefinisi dalam bagan organisasi.',
        gaps: 'Pemantauan kepatuhan limit risiko operasional di entitas anak perusahaan dan afiliasi belum diselaraskan secara komprehensif dengan batas toleransi risiko holding.',
        shortTermRec: 'Harmonisasi kebijakan Risk Appetite & Tolerance holding ke seluruh anak perusahaan (target 6 bulan).',
        longTermRec: 'Penyusunan Risk Governance Charter terpadu di tingkat grup BUMN termasuk evaluasi efektivitas komite pemantau risiko.'
      },
      2: {
        dimNum: 2,
        strengths: 'Proses identifikasi, asesmen, dan perlakuan risiko rutin terdokumentasi dalam Risk Register tahunan korporasi dengan matriks 5x5 yang terstandar.',
        gaps: 'Analisis korelasi antar-risiko strategis terhadap likuiditas serta agregasi risiko lintas divisi belum didukung metodologi kuantitatif yang memadai.',
        shortTermRec: 'Penyusunan Key Risk Indicators (KRI) untuk 10 risiko utama korporat dengan batas ambang peringatan dini (early warning threshold).',
        longTermRec: 'Penerapan metodologi kuantitatif mitigasi risiko berbasis skenario dan agregasi eksposur risiko secara otomatis.'
      },
      3: {
        dimNum: 3,
        strengths: 'Kajian risiko (Risk Assessment) telah dipersyaratkan dalam pengajuan proposal investasi modal (Capex) bernilai signifikan dan transaksi strategis.',
        gaps: 'Profil risiko belum sepenuhnya diintegrasikan dalam penetapan target Key Performance Indicators (KPI) unit bisnis dan insentif manajemen berbasis risiko.',
        shortTermRec: 'Penyusunan pedoman integrasi Risk-Adjusted Return on Capital (RAROC) dalam seleksi portofolio investasi.',
        longTermRec: 'Penyelarasan penuh Risk Appetite Framework ke dalam Rencana Jangka Panjang Perusahaan (RJPP) dan Rencana Kerja dan Anggaran Perusahaan (RKAP).'
      },
      4: {
        dimNum: 4,
        strengths: 'Program sosialisasi dan edukasi dasar manajemen risiko telah dilaksanakan bagi manajemen lini pertama dan terdapat unit kerja manajemen risiko yang berdedikasi.',
        gaps: 'Sertifikasi kompetensi manajemen risiko (QRMO/CRMO) bagi personil lini pertama (First Line of Defense) masih terbatas dan belum merata di unit operasional lapangan.',
        shortTermRec: 'Pelaksanaan program sertifikasi kompetensi manajemen risiko bersertifikat bagi PIC Risiko unit kerja operasional.',
        longTermRec: 'Pembentukan kurikulum Risk Academy internal BUMN dan penguatan reward & recognition atas pelaporan risiko yang transparan.'
      },
      5: {
        dimNum: 5,
        strengths: 'Telah dimulai pencatatan basis data historis insiden dan kerugian risiko operasional (Loss Event Database) pada divisi operasional utama.',
        gaps: 'Sistem Informasi Manajemen Risiko (SIMR) belum terintegrasi secara otomatis dengan sistem Enterprise Resource Planning (ERP/SAP) dan masih mengandalkan rekonsiliasi manual.',
        shortTermRec: 'Standardisasi format pelaporan data insiden kerugian dan pelacakan status mitigasi risiko secara digital.',
        longTermRec: 'Implementasi platform Enterprise Governance, Risk, and Compliance (EGRC) terpadu yang terkoneksi langsung dengan sistem core transactional database korporasi.'
      }
    },
    perceptionSurvey: {
      submissions: SAMPLE_SURVEY_SUBMISSIONS
    }
  };
}
