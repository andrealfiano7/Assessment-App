import React, { useState } from 'react';
import {
  Printer,
  FileSpreadsheet,
  Award,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  FileText,
  Calendar,
  Building2,
  ShieldCheck,
  Sparkles,
  Layers,
  ChevronRight,
  TrendingUp,
  Sliders,
  Check,
  FileCheck2
} from 'lucide-react';
import { CompleteAssessmentData, RecommendationItem } from '../types/rmi';
import { CalculationResult } from '../utils/calculator';
import { exportAssessmentToCsv } from '../utils/exportHelper';
import { DIMENSIONS_META } from '../data/rmiCommon';

interface OfficialReportViewProps {
  assessmentData: CompleteAssessmentData;
  calculation: CalculationResult;
  onUpdateRecommendations?: (recommendations: RecommendationItem[]) => void;
}

type SubReportTab = 'va' | 'vb' | 'all';

export const OfficialReportView: React.FC<OfficialReportViewProps> = ({
  assessmentData,
  calculation,
  onUpdateRecommendations
}) => {
  const [activeSubReport, setActiveSubReport] = useState<SubReportTab>('va');
  const [selectedDimFilter, setSelectedDimFilter] = useState<number | 'all'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string | 'all'>('all');

  const { profile, performance } = assessmentData;
  const { maturityPhase } = calculation;
  const recommendations = assessmentData.recommendations || [];

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    exportAssessmentToCsv(assessmentData, calculation);
  };

  const modelLabel =
    profile.model === 'umum'
      ? 'KBUMN – Industri Umum'
      : profile.model === 'perbankan'
      ? 'KBUMN – Industri Perbankan'
      : 'KBUMN – Industri Asuransi';

  const formatTanggal = (dateStr?: string) => {
    if (!dateStr) return '30-11-2023';
    if (/^\d{2}-\d{2}-\d{4}$/.test(dateStr)) return dateStr;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const [y, m, d] = dateStr.split('-');
      return `${d}-${m}-${y}`;
    }
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    } catch {
      return dateStr;
    }
  };

  // Recommendations metrics
  const totalRecs = recommendations.length;
  const countS = recommendations.filter(r => r.status === 'S').length;
  const countBS = recommendations.filter(r => r.status === 'BS').length;
  const countBD = recommendations.filter(r => r.status === 'BD').length;
  const countTDD = recommendations.filter(r => r.status === 'TDD').length;
  const completionRate = totalRecs > 0 ? Math.round((countS / totalRecs) * 100) : 0;

  const handleQuickStatusChange = (id: string, newStatus: 'S' | 'BS' | 'BD' | 'TDD') => {
    if (!onUpdateRecommendations) return;
    const updated = recommendations.map(r => (r.id === id ? { ...r, status: newStatus } : r));
    onUpdateRecommendations(updated);
  };

  const filteredRecommendations = recommendations.filter(r => {
    if (selectedDimFilter !== 'all' && r.dimNum !== selectedDimFilter) return false;
    if (selectedStatusFilter !== 'all' && r.status !== selectedStatusFilter) return false;
    return true;
  });

  const totalParams = calculation.totalParameters || 42;
  const dim5EndParam = totalParams;

  const getStatusBadge = (status: 'S' | 'BS' | 'BD' | 'TDD') => {
    switch (status) {
      case 'S':
        return {
          label: 'S (Sesuai)',
          code: 'S',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-500',
          desc: 'Sesuai dengan Rekomendasi'
        };
      case 'BS':
        return {
          label: 'BS (Belum Sesuai)',
          code: 'BS',
          bg: 'bg-amber-50 text-amber-700 border-amber-200',
          dot: 'bg-amber-500',
          desc: 'Belum Sesuai dengan Rekomendasi'
        };
      case 'BD':
        return {
          label: 'BD (Belum TL)',
          code: 'BD',
          bg: 'bg-rose-50 text-rose-700 border-rose-200',
          dot: 'bg-rose-500',
          desc: 'Rekomendasi Belum Ditindaklanjuti'
        };
      case 'TDD':
        return {
          label: 'TDD (Tidak Dapat)',
          code: 'TDD',
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400',
          desc: 'Rekomendasi Tidak Dapat Ditindaklanjuti'
        };
      default:
        return {
          label: status,
          code: status,
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400',
          desc: '-'
        };
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Floating Action Bar (Hidden in Print) */}
      <div className="print:hidden glass-card p-4 space-y-3.5 border border-white/80 shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6531F7] to-indigo-600 text-white flex items-center justify-center shadow-md shadow-[#6531F7]/25 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Laporan Hasil Penilaian RMI
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-periwinkle-100 text-[#6531F7] text-[10px] font-extrabold border border-periwinkle-200">
                  Format Baku SK-8 (Hal. 188)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {profile.companyName} • Tahun Buku {profile.year} • No. {profile.reportNumber}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="glass-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 hover:text-emerald-800 border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-50 transition-all shadow-xs"
              title="Unduh seluruh tabel dalam format Excel / CSV"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="glass-btn-primary inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-[#6531F7]/20 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>

        {/* Sub-report Tab Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
            <button
              onClick={() => setActiveSubReport('va')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeSubReport === 'va'
                  ? 'bg-[#6531F7] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              📄 Formulir Ringkasan RMI (Hal. 188)
            </button>
            <button
              onClick={() => setActiveSubReport('vb')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeSubReport === 'vb'
                  ? 'bg-[#6531F7] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              📋 Pemantauan Tindak Lanjut (Lamp. V.B)
            </button>
            <button
              onClick={() => setActiveSubReport('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeSubReport === 'all'
                  ? 'bg-[#6531F7] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 inline mr-1" />
              Laporan Lengkap Terpadu
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium">
            Status: <span className="font-bold text-slate-800">Final Terverifikasi</span> •{' '}
            <span className="font-mono font-bold text-[#6531F7]">
              Skor {calculation.finalRmiScore.toFixed(2)} ({maturityPhase.subLevel})
            </span>
          </div>
        </div>
      </div>

      {/* Modern Executive Hero Summary Cards (Screen Only) */}
      <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Total Skor Akhir */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-md transition-all">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
            Total Skor Akhir RMI
          </div>
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-3xl font-black font-mono text-[#6531F7] tracking-tight">
              {calculation.finalRmiScore.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 5.00</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6531F7]/10 text-[#6531F7] border border-[#6531F7]/20">
            <Sparkles className="w-2.5 h-2.5" />
            <span>{maturityPhase.subLevel}</span>
          </div>
          <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Rentang: {maturityPhase.minScore.toFixed(2)} - {maturityPhase.maxScore.toFixed(2)}</span>
            <span className="font-semibold text-slate-700">Tingkat {maturityPhase.level}</span>
          </div>
        </div>

        {/* Card 2: Skor Aspek Dimensi */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-md transition-all">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
            I. Aspek Dimensi
          </div>
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-3xl font-black font-mono text-indigo-700 tracking-tight">
              {calculation.dimensionAspectScore.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-slate-400">/ 5.00</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <span>5 Dimensi • {totalParams} Parameter</span>
          </div>
          <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Metode: Rata-rata</span>
            <span className="font-semibold text-emerald-600">100% Selesai</span>
          </div>
        </div>

        {/* Card 3: Aspek Kinerja & Penyesuaian */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-md transition-all">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
            II. Kinerja & Penyesuaian
          </div>
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-3xl font-black font-mono text-amber-600 tracking-tight">
              {calculation.scoreAdjustment !== 0
                ? (calculation.scoreAdjustment > 0 ? `+${calculation.scoreAdjustment.toFixed(2)}` : calculation.scoreAdjustment.toFixed(2))
                : '0.00'}
            </span>
            <span className="text-xs font-semibold text-slate-400">penyesuaian</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <span>Skor Kinerja: {calculation.totalPerformanceScore.toFixed(1)}</span>
          </div>
          <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Sehat: {performance.healthRating}</span>
            <span>Komposit: P-{performance.compositeRating}</span>
          </div>
        </div>

        {/* Card 4: Capaian Tindak Lanjut */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-md transition-all">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
            Tindak Lanjut (Lamp. V.B)
          </div>
          <div className="flex items-baseline gap-1.5 mb-1.5">
            <span className="text-3xl font-black font-mono text-emerald-600 tracking-tight">
              {completionRate}%
            </span>
            <span className="text-xs font-semibold text-slate-400">
              ({countS}/{totalRecs} Selesai)
            </span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span>{countBS} BS • {countBD} BD</span>
          </div>
          <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <span>Total: {totalRecs} Rekomendasi</span>
            <span className="font-semibold text-slate-700">Triwulanan</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: FORMULIR RINGKASAN HASIL PENILAIAN RMI (FORMAT HALAMAN 188)   */}
      {/* ========================================================================= */}
      {(activeSubReport === 'va' || activeSubReport === 'all') && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-10 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none space-y-7 text-slate-900 font-sans">
          {/* Header Laporan Resmi Eksekutif Perusahaan */}
          <div className="pb-5 border-b-2 border-slate-900 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Building2 className="w-4 h-4 text-[#6531F7]" />
              <span>{profile.companyName}</span>
              <span>•</span>
              <span>TAHUN BUKU {profile.year}</span>
            </div>

            <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-950">
              FORMULIR RINGKASAN HASIL PENILAIAN INDEKS KEMATANGAN RISIKO
              <br />
              <span className="text-[#6531F7] print:text-slate-950">
                (RISK MATURITY INDEX / RMI)
              </span>
            </h1>

            <p className="text-xs text-slate-500 font-serif italic max-w-2xl mx-auto">
              Format Standar Petunjuk Teknis SK Deputi Bidang Keuangan dan Manajemen Risiko Kementerian BUMN
              <br />
              Nomor: <span className="font-semibold not-italic text-slate-800">SK-8/DKU.MBU/12/2023 (Lampiran V.A)</span>
            </p>
          </div>

          {/* Tabel Metadata Laporan (Data Riil yang Sudah Diisi) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Kolom Informasi Penilaian */}
            <div className="md:col-span-2 rounded-2xl bg-slate-50/80 border border-slate-200/80 p-4 space-y-2.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    BUMN
                  </span>
                  <span className="font-black text-slate-900 text-sm uppercase">
                    {profile.companyName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Tahun Penilaian
                  </span>
                  <span className="font-bold font-mono text-slate-900 text-sm">
                    {profile.year}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Nomor Laporan
                  </span>
                  <span className="font-bold font-mono text-slate-800">
                    {profile.reportNumber}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Model Penilaian RMI
                  </span>
                  <span className="font-extrabold text-[#6531F7]">
                    {modelLabel}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Metode & Pelaksana
                  </span>
                  <span className="text-slate-700 font-medium">
                    Penilaian {profile.assessmentType} • {profile.assessorName}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Periode Observasi
                  </span>
                  <span className="text-slate-700 font-medium">
                    {profile.observationPeriod}
                  </span>
                </div>
              </div>
            </div>

            {/* Kotak Highlight Total Skor RMI */}
            <div className="rounded-2xl bg-gradient-to-br from-[#6531F7]/10 via-indigo-50/50 to-white border-2 border-[#6531F7]/30 p-4 flex flex-col justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#6531F7] block">
                  TOTAL SKOR RMI
                </span>
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-4xl font-black font-mono text-[#6531F7]">
                    {calculation.finalRmiScore.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-slate-400">/ 5.00</span>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <div className="px-3 py-1 rounded-xl bg-[#6531F7] text-white text-xs font-extrabold text-center shadow-xs">
                  {maturityPhase.subLevel}
                </div>
                <div className="text-[10px] text-slate-500 text-center">
                  Tingkat {maturityPhase.level} ({maturityPhase.name})
                </div>
              </div>
            </div>
          </div>

          {/* TABEL I: ASPEK DIMENSI (Format Kolom Hal. 188 Juknis) */}
          <div className="space-y-2 break-inside-avoid">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-slate-900 text-white inline-flex items-center justify-center text-xs font-bold">
                  I
                </span>
                <span>ASPEK DIMENSI</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">
                Bobot Dimensi: Rata-rata Skor Parameter
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300 uppercase tracking-wider">
                  <tr>
                    <th className="p-2.5 border-r border-slate-300 text-center w-28">
                      Parameter
                    </th>
                    <th className="p-2.5 border-r border-slate-300 text-center w-16">
                      Dimensi
                    </th>
                    <th className="p-2.5 border-r border-slate-300">
                      Deskripsi Dimensi
                    </th>
                    <th className="p-2.5 border-r border-slate-300 text-center w-28">
                      Skor Dimensi
                    </th>
                    <th className="p-2.5 text-center w-28">
                      Skor
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {/* Dimensi 1 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-mono font-medium border-r border-slate-200">
                      1 s.d. 3
                    </td>
                    <td className="p-2.5 text-center font-bold border-r border-slate-200">
                      <span className="w-6 h-6 rounded-full bg-[#6531F7]/10 text-[#6531F7] inline-flex items-center justify-center font-bold">
                        1
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-900">
                      Budaya dan Kapabilitas Risiko
                    </td>
                    <td className="p-2.5 text-center font-mono font-black text-sm border-r border-slate-200 text-slate-900">
                      {calculation.dimensions[0]?.score.toFixed(2) ?? '-'}
                    </td>
                    <td className="p-2.5 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Dimensi 2 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-mono font-medium border-r border-slate-200">
                      4 s.d. 19
                    </td>
                    <td className="p-2.5 text-center font-bold border-r border-slate-200">
                      <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 inline-flex items-center justify-center font-bold">
                        2
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-900">
                      Organisasi dan Tata Kelola Risiko
                    </td>
                    <td className="p-2.5 text-center font-mono font-black text-sm border-r border-slate-200 text-slate-900">
                      {calculation.dimensions[1]?.score.toFixed(2) ?? '-'}
                    </td>
                    <td className="p-2.5 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Dimensi 3 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-mono font-medium border-r border-slate-200">
                      20 s.d. 33
                    </td>
                    <td className="p-2.5 text-center font-bold border-r border-slate-200">
                      <span className="w-6 h-6 rounded-full bg-blue-50 text-blue-700 inline-flex items-center justify-center font-bold">
                        3
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-900">
                      Kerangka Risiko dan Kepatuhan
                    </td>
                    <td className="p-2.5 text-center font-mono font-black text-sm border-r border-slate-200 text-slate-900">
                      {calculation.dimensions[2]?.score.toFixed(2) ?? '-'}
                    </td>
                    <td className="p-2.5 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Dimensi 4 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-mono font-medium border-r border-slate-200">
                      34 s.d. 39
                    </td>
                    <td className="p-2.5 text-center font-bold border-r border-slate-200">
                      <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-800 inline-flex items-center justify-center font-bold">
                        4
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-900">
                      Proses dan Kontrol Risiko
                    </td>
                    <td className="p-2.5 text-center font-mono font-black text-sm border-r border-slate-200 text-slate-900">
                      {calculation.dimensions[3]?.score.toFixed(2) ?? '-'}
                    </td>
                    <td className="p-2.5 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Dimensi 5 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-mono font-medium border-r border-slate-200">
                      40 s.d. {dim5EndParam}
                    </td>
                    <td className="p-2.5 text-center font-bold border-r border-slate-200">
                      <span className="w-6 h-6 rounded-full bg-purple-50 text-purple-700 inline-flex items-center justify-center font-bold">
                        5
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-900">
                      Model, Data, dan Teknologi Risiko
                    </td>
                    <td className="p-2.5 text-center font-mono font-black text-sm border-r border-slate-200 text-slate-900">
                      {calculation.dimensions[4]?.score.toFixed(2) ?? '-'}
                    </td>
                    <td className="p-2.5 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Baris Total: Skor Aspek Dimensi Sesuai Format Hal. 188 & 192 Juknis */}
                  <tr className="bg-gradient-to-r from-periwinkle-50/90 via-indigo-50/70 to-slate-100 font-black border-t-2 border-slate-900">
                    <td className="p-3 text-center font-mono border-r border-slate-300 text-slate-900 font-bold">
                      1 s.d. {totalParams}
                    </td>
                    <td colSpan={2} className="p-3 border-r border-slate-300 uppercase tracking-wide text-slate-950 font-black">
                      SKOR ASPEK DIMENSI
                    </td>
                    <td className="p-3 border-r border-slate-300 bg-slate-50/60 text-center">
                      {/* Kosong pada kolom Skor Dimensi sesuai Juknis Hal. 188 */}
                    </td>
                    <td className="p-3 text-center font-mono text-base font-black text-[#6531F7]">
                      {calculation.dimensionAspectScore.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL II: ASPEK KINERJA (Format Kolom Hal. 188/189 Juknis) */}
          <div className="space-y-2 break-inside-avoid">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-md bg-slate-900 text-white inline-flex items-center justify-center text-xs font-bold">
                  II
                </span>
                <span>ASPEK KINERJA</span>
              </h3>
              <span className="text-[11px] font-semibold text-slate-500">
                Merujuk Tabel Konversi & Penyesuaian Bab II Juknis RMI
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300 uppercase tracking-wider">
                  <tr>
                    <th className="p-2.5 border-r border-slate-300 text-center w-12">
                      No
                    </th>
                    <th className="p-2.5 border-r border-slate-300">
                      Aspek Kinerja
                    </th>
                    <th className="p-2.5 border-r border-slate-300 text-center w-28">
                      Nilai Aspek
                    </th>
                    <th className="p-2.5 border-r border-slate-300 text-center w-24">
                      Nilai Konversi
                    </th>
                    <th className="p-2.5 border-r border-slate-300 text-center w-20">
                      Bobot
                    </th>
                    <th className="p-2.5 border-r border-slate-300 text-center w-36">
                      Nilai Konversi × Bobot
                    </th>
                    <th className="p-2.5 text-center w-28">
                      Skor
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {/* Baris 1: Tingkat Kesehatan */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-bold border-r border-slate-200">
                      1
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-medium text-slate-900">
                      Tingkat Kesehatan Peringkat Akhir (<em>Final Rating</em>)
                    </td>
                    <td className="p-2.5 text-center border-r border-slate-200">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-xs bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {performance.healthRating}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold border-r border-slate-200 text-slate-800">
                      {calculation.healthConversion}
                    </td>
                    <td className="p-2.5 text-center font-semibold border-r border-slate-200 text-slate-600">
                      50%
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold border-r border-slate-200 text-slate-900">
                      {calculation.healthWeighted.toFixed(2)}
                    </td>
                    <td className="p-2.5 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Baris 2: Peringkat Komposit Risiko */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-bold border-r border-slate-200">
                      2
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-medium text-slate-900">
                      Peringkat Komposit Risiko
                    </td>
                    <td className="p-2.5 text-center border-r border-slate-200">
                      <span className="px-2.5 py-0.5 rounded-full font-bold text-xs bg-blue-50 text-blue-800 border border-blue-200">
                        Peringkat {performance.compositeRating}
                      </span>
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold border-r border-slate-200 text-slate-800">
                      {calculation.compositeConversion}
                    </td>
                    <td className="p-2.5 text-center font-semibold border-r border-slate-200 text-slate-600">
                      50%
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold border-r border-slate-200 text-slate-900">
                      {calculation.compositeWeighted.toFixed(2)}
                    </td>
                    <td className="p-2.5 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Subtotal: Skor Aspek Kinerja */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-300">
                    <td className="p-2.5 text-center font-mono border-r border-slate-300">
                      1 s.d. 2
                    </td>
                    <td colSpan={5} className="p-2.5 border-r border-slate-300 uppercase tracking-wide text-slate-800 font-extrabold">
                      SKOR ASPEK KINERJA
                    </td>
                    <td className="p-2.5 text-center font-mono text-sm font-black text-slate-900">
                      {calculation.totalPerformanceScore.toFixed(2)}
                    </td>
                  </tr>

                  {/* Baris Penyesuaian Skor */}
                  <tr className="border-t border-slate-300 bg-amber-50/40">
                    <td className="p-2.5 border-r border-slate-300"></td>
                    <td colSpan={5} className="p-2.5 border-r border-slate-300 font-bold text-slate-800">
                      PENYESUAIAN SKOR ASPEK DIMENSI
                    </td>
                    <td className="p-2.5 text-center font-mono font-black text-sm text-slate-900">
                      <span
                        className={`px-2.5 py-0.5 rounded-full ${
                          calculation.scoreAdjustment < 0
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {calculation.scoreAdjustment !== 0
                          ? (calculation.scoreAdjustment > 0
                              ? `+${calculation.scoreAdjustment.toFixed(2)}`
                              : calculation.scoreAdjustment.toFixed(2))
                          : '0.00'}
                      </span>
                    </td>
                  </tr>

                  {/* Baris Final: SKOR RMI */}
                  <tr className="bg-slate-950 text-white font-black border-t-2 border-slate-950">
                    <td
                      colSpan={6}
                      className="p-3 text-right text-xs tracking-wider uppercase border-r border-slate-800 font-black"
                    >
                      SKOR RMI (RISK MATURITY INDEX)
                    </td>
                    <td
                      className="p-3 text-center font-mono text-xl text-periwinkle-300 font-black"
                    >
                      {calculation.finalRmiScore.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-[11px] text-slate-500 italic pt-1">
              * Keterangan: Total Skor RMI = Skor Aspek Dimensi ({calculation.dimensionAspectScore.toFixed(2)}) dijumlahkan dengan Penyesuaian Skor ({calculation.scoreAdjustment.toFixed(2)}) merujuk pada Tabel 4 Juknis SK-8 KBUMN.
            </p>
          </div>

          {/* Lembar Pengesahan Laporan Resmi (3 Tanda Tangan) */}
          <div className="pt-6 border-t-2 border-slate-900 space-y-4 break-inside-avoid">
            <div className="text-center space-y-0.5">
              <h4 className="font-black text-xs uppercase tracking-wider text-slate-900">
                LEMBAR PENGESAHAN LAPORAN HASIL PENILAIAN RMI TAHUN BUKU {profile.year}
              </h4>
              <p className="text-[10px] text-slate-500 italic">
                Disahkan di Jakarta, pada tanggal {formatTanggal(profile.assessmentDate)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center text-xs pt-2">
              {/* Pihak 1: Pelaksana Penilai */}
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col justify-between h-44 shadow-xs">
                <div>
                  <span className="font-extrabold text-slate-800 text-[11px] block">
                    Pelaksana Penilaian RMI
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    ({profile.assessorName})
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-32 mx-auto border-b border-slate-400"></div>
                  <div className="font-bold text-[11px] text-slate-900">
                    Ketua Tim Penilai
                  </div>
                  <div className="text-[9px] text-slate-400">Tanda Tangan & Cap</div>
                </div>
              </div>

              {/* Pihak 2: Direksi Pengelola Risiko */}
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col justify-between h-44 shadow-xs">
                <div>
                  <span className="font-extrabold text-slate-800 text-[11px] block">
                    Mengetahui & Menyetujui,
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Direksi Pengelola Risiko
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-32 mx-auto border-b border-slate-400"></div>
                  <div className="font-bold text-[11px] text-slate-900">
                    Direktur Keuangan & MR
                  </div>
                  <div className="text-[9px] text-slate-400">Tanda Tangan & Cap</div>
                </div>
              </div>

              {/* Pihak 3: Dewan Komisaris */}
              <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 flex flex-col justify-between h-44 shadow-xs">
                <div>
                  <span className="font-extrabold text-slate-800 text-[11px] block">
                    Mengetahui,
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Dewan Komisaris / Pengawas
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-32 mx-auto border-b border-slate-400"></div>
                  <div className="font-bold text-[11px] text-slate-900">
                    Ketua Komite Pemantau Risiko
                  </div>
                  <div className="text-[9px] text-slate-400">Tanda Tangan & Cap</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page break separator for print */}
      {activeSubReport === 'all' && (
        <div className="hidden print:block print:h-8 print:break-before-page"></div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: FORMULIR PEMANTAUAN TINDAK LANJUT REKOMENDASI (LAMPIRAN V.B)   */}
      {/* ========================================================================= */}
      {(activeSubReport === 'vb' || activeSubReport === 'all') && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-10 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none space-y-6 text-slate-900 font-sans">
          {/* Header Lampiran V.B */}
          <div className="pb-5 border-b-2 border-slate-900 text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Building2 className="w-4 h-4 text-[#6531F7]" />
              <span>{profile.companyName}</span>
              <span>•</span>
              <span>PEMANTAUAN TRIWULANAN</span>
            </div>

            <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-950">
              FORMULIR PEMANTAUAN TINDAK LANJUT REKOMENDASI RMI
            </h2>

            <p className="text-xs text-slate-500 font-serif italic max-w-2xl mx-auto">
              Format Standar Petunjuk Teknis SK Deputi Bidang Keuangan dan Manajemen Risiko Kementerian BUMN
              <br />
              Nomor: <span className="font-semibold not-italic text-slate-800">SK-8/DKU.MBU/12/2023 (Lampiran V.B)</span>
            </p>
          </div>

          {/* Metadata Lampiran V.B */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">BUMN</span>
              <span className="font-bold text-slate-900 uppercase">{profile.companyName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Tahun</span>
              <span className="font-mono font-bold text-slate-900">{profile.year}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">No. Laporan</span>
              <span className="font-mono font-bold text-slate-900">{profile.reportNumber}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Model RMI</span>
              <span className="font-bold text-[#6531F7]">{modelLabel}</span>
            </div>
          </div>

          {/* Status Breakdown Bar & Filter (Screen Only) */}
          <div className="print:hidden space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'S' ? 'all' : 'S')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all ${
                  selectedStatusFilter === 'S'
                    ? 'ring-2 ring-emerald-500 bg-emerald-50 border-emerald-300'
                    : 'bg-emerald-50/60 border-emerald-200/80 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-900">S (Sesuai)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-2xl font-black font-mono text-emerald-900 mt-1">{countS}</div>
                <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
                  {totalRecs > 0 ? Math.round((countS / totalRecs) * 100) : 0}% dari total
                </div>
              </div>

              <div
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'BS' ? 'all' : 'BS')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all ${
                  selectedStatusFilter === 'BS'
                    ? 'ring-2 ring-amber-500 bg-amber-50 border-amber-300'
                    : 'bg-amber-50/60 border-amber-200/80 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-900">BS (Belum Sesuai)</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-2xl font-black font-mono text-amber-900 mt-1">{countBS}</div>
                <div className="text-[10px] text-amber-700 font-medium mt-0.5">
                  {totalRecs > 0 ? Math.round((countBS / totalRecs) * 100) : 0}% dari total
                </div>
              </div>

              <div
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'BD' ? 'all' : 'BD')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all ${
                  selectedStatusFilter === 'BD'
                    ? 'ring-2 ring-rose-500 bg-rose-50 border-rose-300'
                    : 'bg-rose-50/60 border-rose-200/80 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-900">BD (Belum TL)</span>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-2xl font-black font-mono text-rose-900 mt-1">{countBD}</div>
                <div className="text-[10px] text-rose-700 font-medium mt-0.5">
                  {totalRecs > 0 ? Math.round((countBD / totalRecs) * 100) : 0}% dari total
                </div>
              </div>

              <div
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'TDD' ? 'all' : 'TDD')}
                className={`cursor-pointer p-3 rounded-2xl border transition-all ${
                  selectedStatusFilter === 'TDD'
                    ? 'ring-2 ring-slate-500 bg-slate-100 border-slate-300'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800">TDD (Tidak Dapat)</span>
                  <XCircle className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-2xl font-black font-mono text-slate-900 mt-1">{countTDD}</div>
                <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                  {totalRecs > 0 ? Math.round((countTDD / totalRecs) * 100) : 0}% dari total
                </div>
              </div>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-slate-500 font-semibold mr-1">Filter Dimensi:</span>
                <button
                  onClick={() => setSelectedDimFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    selectedDimFilter === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  Semua
                </button>
                {DIMENSIONS_META.map(d => (
                  <button
                    key={d.dimNum}
                    onClick={() => setSelectedDimFilter(d.dimNum)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all whitespace-nowrap ${
                      selectedDimFilter === d.dimNum
                        ? 'bg-[#6531F7] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    D{d.dimNum}
                  </button>
                ))}
              </div>

              {(selectedDimFilter !== 'all' || selectedStatusFilter !== 'all') && (
                <button
                  onClick={() => {
                    setSelectedDimFilter('all');
                    setSelectedStatusFilter('all');
                  }}
                  className="text-[11px] font-bold text-rose-600 hover:underline"
                >
                  Reset Filter
                </button>
              )}
            </div>
          </div>

          {/* TABEL PEMANTAUAN TINDAK LANJUT REKOMENDASI (Kolom Hal. 190 Juknis) */}
          <div className="space-y-2">
            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 border-r border-slate-300 w-48 text-center">
                      Dimensi
                    </th>
                    <th className="p-3 border-r border-slate-300">
                      Rekomendasi
                    </th>
                    <th className="p-3 border-r border-slate-300 text-center w-36">
                      Target Penyelesaian
                    </th>
                    <th className="p-3 border-r border-slate-300 text-center w-32">
                      Pemberi Target
                    </th>
                    <th className="p-3 text-center w-32">
                      Status Tindak Lanjut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredRecommendations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                        Tidak ada data rekomendasi yang sesuai filter.
                      </td>
                    </tr>
                  ) : (
                    filteredRecommendations.map(rec => {
                      const dimMeta = DIMENSIONS_META.find(d => d.dimNum === rec.dimNum);
                      const badge = getStatusBadge(rec.status);

                      return (
                        <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* Dimensi */}
                          <td className="p-3 align-top border-r border-slate-200 font-semibold text-slate-900">
                            <div className="flex items-start gap-2">
                              <span
                                className="w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px] font-bold text-white shrink-0 mt-0.5"
                                style={{ backgroundColor: dimMeta?.color || '#6531F7' }}
                              >
                                {rec.dimNum}
                              </span>
                              <div>
                                <div className="font-bold text-slate-900 text-xs">
                                  {dimMeta?.name || `Dimensi ${rec.dimNum}`}
                                </div>
                                {rec.paramId && (
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    Parameter P.{rec.paramId}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Rekomendasi */}
                          <td className="p-3 align-top border-r border-slate-200 text-slate-800 leading-relaxed">
                            <p className="text-xs font-medium">{rec.rekomendasi}</p>
                            {rec.aktivitasUtama && (
                              <div className="mt-1.5 text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-200/60 print:hidden">
                                <span className="font-semibold text-slate-700">Aktivitas Utama:</span>{' '}
                                {rec.aktivitasUtama}
                              </div>
                            )}
                          </td>

                          {/* Target Penyelesaian (dd-mm-yyyy) */}
                          <td className="p-3 align-top text-center border-r border-slate-200 font-mono font-bold text-slate-800 whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100/90 text-slate-800 text-xs">
                              <Calendar className="w-3.5 h-3.5 text-slate-500 print:hidden" />
                              <span>{formatTanggal(rec.targetDate)}</span>
                            </div>
                          </td>

                          {/* Pemberi Target */}
                          <td className="p-3 align-top text-center border-r border-slate-200 font-semibold text-slate-800 whitespace-nowrap">
                            <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
                              {rec.pemberiTarget || 'Manajemen'}
                            </span>
                          </td>

                          {/* Status Tindak Lanjut */}
                          <td className="p-3 align-top text-center">
                            {onUpdateRecommendations ? (
                              <select
                                value={rec.status}
                                onChange={e =>
                                  handleQuickStatusChange(
                                    rec.id,
                                    e.target.value as 'S' | 'BS' | 'BD' | 'TDD'
                                  )
                                }
                                className={`text-xs font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${badge.bg} print:appearance-none`}
                              >
                                <option value="S">S (Sesuai)</option>
                                <option value="BS">BS (Belum Sesuai)</option>
                                <option value="BD">BD (Belum TL)</option>
                                <option value="TDD">TDD (Tidak Dapat)</option>
                              </select>
                            ) : (
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold border ${badge.bg}`}
                              >
                                <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                                <span>{badge.label}</span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Keterangan Resmi Kode Status (S, BS, BD, TDD) */}
          <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 space-y-2 text-xs text-slate-700 break-inside-avoid">
            <h4 className="font-extrabold text-slate-900 uppercase tracking-wide text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#6531F7]" />
              <span>Keterangan Status Tindak Lanjut Rekomendasi (Juknis SK-8 Bab V)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px]">
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 font-mono font-bold rounded">
                  S
                </span>
                <span>
                  <strong>S (Sesuai):</strong> Tindak lanjut telah diselesaikan sepenuhnya sesuai rekomendasi.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-mono font-bold rounded">
                  BS
                </span>
                <span>
                  <strong>BS (Belum Sesuai):</strong> Tindak lanjut sedang berjalan namun belum memenuhi target rekomendasi.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-rose-100 text-rose-900 font-mono font-bold rounded">
                  BD
                </span>
                <span>
                  <strong>BD (Belum Ditindaklanjuti):</strong> Belum ada tindakan nyata atas rekomendasi yang diberikan.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-mono font-bold rounded">
                  TDD
                </span>
                <span>
                  <strong>TDD (Tidak Dapat Ditindaklanjuti):</strong> Terkendala regulasi eksternal atau restrukturisasi yang sah.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
