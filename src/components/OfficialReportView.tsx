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
  TrendingUp,
  Sliders,
  Check,
  ChevronRight,
  Sparkles,
  Layers,
  ArrowUpRight
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

type SubReportTab = 'all' | 'va' | 'vb';
type ViewMode = 'modern' | 'official';

export const OfficialReportView: React.FC<OfficialReportViewProps> = ({
  assessmentData,
  calculation,
  onUpdateRecommendations
}) => {
  const [activeSubReport, setActiveSubReport] = useState<SubReportTab>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('modern');
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

  // Recommendation status counts & calculation
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

  // Filter recommendations
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
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Top Floating Action Bar (Hidden in Print) */}
      <div className="print:hidden glass-card p-4 space-y-3.5 border border-white/80 shadow-glass">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#6531F7] to-indigo-600 text-white flex items-center justify-center shadow-md shadow-[#6531F7]/25 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Laporan Resmi Penilaian RMI
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-periwinkle-100 text-[#6531F7] text-[10px] font-bold border border-periwinkle-200">
                  SK-8/DKU.MBU/12/2023
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Format Baku Lampiran V Kementerian Badan Usaha Milik Negara
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Mode Toggle */}
            <div className="inline-flex bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 text-xs">
              <button
                onClick={() => setViewMode('modern')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'modern'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#6531F7]" />
                Modern Clean
              </button>
              <button
                onClick={() => setViewMode('official')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  viewMode === 'official'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5 inline mr-1 text-slate-600" />
                Lembar Baku Cetak
              </button>
            </div>

            <button
              onClick={handleExportCsv}
              className="glass-btn inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-700 hover:text-emerald-800 border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-50 transition-all shadow-xs"
              title="Unduh format spreadsheet CSV/Excel lengkap"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Ekspor Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="glass-btn-primary inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-[#6531F7]/20 hover:scale-[1.01] active:scale-[0.99] transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / PDF Resmi</span>
            </button>
          </div>
        </div>

        {/* Sub-report Tabs Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200/60 text-xs">
            <button
              onClick={() => setActiveSubReport('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubReport === 'all'
                  ? 'bg-[#6531F7] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 inline mr-1.5" />
              Laporan Lengkap Terpadu (V.A & V.B)
            </button>
            <button
              onClick={() => setActiveSubReport('va')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubReport === 'va'
                  ? 'bg-[#6531F7] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              📑 Lampiran V.A (Ringkasan Skor RMI)
            </button>
            <button
              onClick={() => setActiveSubReport('vb')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeSubReport === 'vb'
                  ? 'bg-[#6531F7] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              📋 Lampiran V.B (Pemantauan Tindak Lanjut)
            </button>
          </div>

          <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
            Status: <span className="font-bold text-slate-800">Final & Terverifikasi</span> •{' '}
            {profile.companyName}
          </div>
        </div>
      </div>

      {/* Executive Hero KPI Cards (Only in Modern View & Screen) */}
      {viewMode === 'modern' && (
        <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Skor RMI */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#6531F7]/15 to-transparent rounded-bl-full pointer-events-none" />
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Total Skor Akhir RMI
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black font-mono text-[#6531F7] tracking-tight">
                {calculation.finalRmiScore.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 5.00</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#6531F7]/10 text-[#6531F7] border border-[#6531F7]/20">
              <Sparkles className="w-3 h-3" />
              <span>{maturityPhase.subLevel}</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>Rentang: {maturityPhase.minScore.toFixed(2)} - {maturityPhase.maxScore.toFixed(2)}</span>
              <span className="font-semibold text-slate-700">Tingkat {maturityPhase.level}</span>
            </div>
          </div>

          {/* Card 2: Skor Aspek Dimensi */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              I. Aspek Dimensi
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black font-mono text-indigo-700 tracking-tight">
                {calculation.dimensionAspectScore.toFixed(2)}
              </span>
              <span className="text-xs font-semibold text-slate-400">/ 5.00</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              <span>5 Dimensi Penilaian</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>Parameter: {totalParams} butir</span>
              <span className="font-semibold text-emerald-600">100% Selesai</span>
            </div>
          </div>

          {/* Card 3: Aspek Kinerja & Penyesuaian */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              II. Kinerja & Penyesuaian
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black font-mono text-amber-600 tracking-tight">
                {calculation.scoreAdjustment !== 0
                  ? calculation.scoreAdjustment.toFixed(2)
                  : '0.00'}
              </span>
              <span className="text-xs font-semibold text-slate-400">penyesuaian</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span>Skor Kinerja: {calculation.totalPerformanceScore.toFixed(1)}</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>Rating: {performance.healthRating}</span>
              <span>Komposit: P-{performance.compositeRating}</span>
            </div>
          </div>

          {/* Card 4: Capaian Tindak Lanjut */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-lg transition-all">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Tindak Lanjut (Lamp. V.B)
            </div>
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-3xl font-black font-mono text-emerald-600 tracking-tight">
                {completionRate}%
              </span>
              <span className="text-xs font-semibold text-slate-400">
                ({countS}/{totalRecs} Selesai)
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span>{countBS} BS • {countBD} BD • {countTDD} TDD</span>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>Total: {totalRecs} Rekomendasi</span>
              <span className="font-semibold text-slate-700">Triwulanan</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: LAMPIRAN V.A - FORMULIR RINGKASAN HASIL PENILAIAN RMI         */}
      {/* ========================================================================= */}
      {(activeSubReport === 'all' || activeSubReport === 'va') && (
        <div
          className={`bg-white rounded-3xl border ${
            viewMode === 'modern'
              ? 'border-slate-200/90 shadow-xl shadow-slate-200/40'
              : 'border-slate-300 shadow-md'
          } p-6 sm:p-12 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none space-y-8`}
        >
          {/* Official Ministry Header */}
          <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-widest border border-slate-200 print:border-slate-400 mb-1">
              <Building2 className="w-3.5 h-3.5 text-slate-800" />
              <span>KEMENTERIAN BADAN USAHA MILIK NEGARA REPUBLIK INDONESIA</span>
            </div>

            <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-slate-950 leading-snug">
              FORMULIR RINGKASAN HASIL PENILAIAN INDEKS KEMATANGAN RISIKO
              <br />
              <span className="text-[#6531F7] print:text-slate-950">
                (RISK MATURITY INDEX / RMI)
              </span>
            </h1>

            <div className="text-xs text-slate-600 font-serif italic max-w-2xl mx-auto pt-1">
              Merujuk pada Lampiran V.A Keputusan Deputi Bidang Keuangan dan Manajemen Risiko
              <br />
              Nomor: <span className="font-semibold not-italic text-slate-900">SK-8/DKU.MBU/12/2023</span> Tanggal 6 Desember 2023
            </div>
          </div>

          {/* Metadata Section */}
          {viewMode === 'modern' ? (
            /* Modern Clean Executive Grid */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Nama BUMN
                  </span>
                  <p className="text-sm font-black text-slate-900 uppercase">
                    {profile.companyName}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Tahun Penilaian
                  </span>
                  <p className="text-sm font-bold font-mono text-slate-900">
                    {profile.year}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Nomor Laporan
                  </span>
                  <p className="text-xs font-bold font-mono text-slate-800">
                    {profile.reportNumber}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Model Penilaian RMI
                  </span>
                  <p className="text-xs font-extrabold text-[#6531F7]">
                    {modelLabel}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Metode & Pelaksana
                  </span>
                  <p className="text-xs text-slate-700 font-medium">
                    Penilaian {profile.assessmentType} • {profile.assessorName}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Periode Observasi
                  </span>
                  <p className="text-xs text-slate-700 font-medium">
                    {profile.observationPeriod}
                  </p>
                </div>
              </div>

              {/* Hero Skor RMI Callout Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#6531F7]/10 via-indigo-50/60 to-white border-2 border-[#6531F7]/25 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#6531F7] mb-1">
                    TOTAL SKOR RMI
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black font-mono text-[#6531F7]">
                      {calculation.finalRmiScore.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-500">/ 5.00</span>
                  </div>
                </div>

                <div className="space-y-2 pt-3">
                  <div className="px-3 py-1 rounded-xl bg-[#6531F7] text-white text-xs font-extrabold shadow-sm text-center">
                    {maturityPhase.subLevel}
                  </div>
                  <p className="text-[10px] text-slate-500 text-center leading-tight">
                    {maturityPhase.description}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Classic Official Formal Metadata Table (Exact Juknis Layout) */
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-900">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="w-1/3 p-2.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                      BUMN
                    </td>
                    <td className="p-2.5 font-bold text-slate-950 uppercase">
                      {profile.companyName}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                      Tahun
                    </td>
                    <td className="p-2.5 font-mono text-slate-900">
                      {profile.year}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                      No. Laporan
                    </td>
                    <td className="p-2.5 font-mono text-slate-900">
                      {profile.reportNumber}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2.5 font-bold bg-slate-100 border-r border-slate-300 text-slate-800">
                      Model Penilaian RMI
                    </td>
                    <td className="p-2.5 font-semibold text-slate-900">
                      {modelLabel}
                    </td>
                  </tr>
                  <tr className="bg-slate-50 border-b-2 border-slate-900">
                    <td className="p-2.5 font-extrabold text-slate-900 border-r border-slate-300">
                      Skor RMI
                    </td>
                    <td className="p-2.5">
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-black font-mono text-slate-950">
                          {calculation.finalRmiScore.toFixed(2)}
                        </span>
                        <span className="text-xs px-2.5 py-0.5 bg-slate-900 text-white rounded-md font-bold">
                          {maturityPhase.subLevel}
                        </span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TABEL I: ASPEK DIMENSI */}
          <div className="space-y-2.5 break-inside-avoid">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
              <h3 className="font-black text-sm uppercase tracking-wide text-slate-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-900 text-white inline-flex items-center justify-center text-xs font-black">
                  I
                </span>
                <span>ASPEK DIMENSI</span>
              </h3>
              <span className="text-xs font-bold text-slate-600">
                Bobot: Rata-rata Skor Seluruh Parameter
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 border-r border-slate-300 text-center w-28">
                      Parameter
                    </th>
                    <th className="p-3 border-r border-slate-300 text-center w-16">
                      Dimensi
                    </th>
                    <th className="p-3 border-r border-slate-300">
                      Deskripsi Dimensi
                    </th>
                    <th className="p-3 border-r border-slate-300 text-center w-28">
                      Skor Dimensi
                    </th>
                    <th className="p-3 text-center w-24">
                      Skor
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* Dimensi 1 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-mono font-medium border-r border-slate-200">
                      1 s.d. 3
                    </td>
                    <td className="p-2.5 text-center font-black border-r border-slate-200">
                      <span className="w-6 h-6 rounded-full bg-[#6531F7]/10 text-[#6531F7] inline-flex items-center justify-center font-bold">
                        1
                      </span>
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-semibold text-slate-900">
                      Budaya dan Kapabiltas Risiko
                    </td>
                    <td className="p-2.5 text-center font-mono font-black text-sm border-r border-slate-200 text-slate-900">
                      {calculation.dimensions[0]?.score.toFixed(2) ?? '-'}
                    </td>
                    <td className="p-2.5 bg-slate-50/50"></td>
                  </tr>

                  {/* Dimensi 2 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-mono font-medium border-r border-slate-200">
                      4 s.d. 19
                    </td>
                    <td className="p-2.5 text-center font-black border-r border-slate-200">
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
                    <td className="p-2.5 bg-slate-50/50"></td>
                  </tr>

                  {/* Dimensi 3 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-mono font-medium border-r border-slate-200">
                      20 s.d. 33
                    </td>
                    <td className="p-2.5 text-center font-black border-r border-slate-200">
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
                    <td className="p-2.5 bg-slate-50/50"></td>
                  </tr>

                  {/* Dimensi 4 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-mono font-medium border-r border-slate-200">
                      34 s.d. 39
                    </td>
                    <td className="p-2.5 text-center font-black border-r border-slate-200">
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
                    <td className="p-2.5 bg-slate-50/50"></td>
                  </tr>

                  {/* Dimensi 5 */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-mono font-medium border-r border-slate-200">
                      40 s.d. {dim5EndParam}
                    </td>
                    <td className="p-2.5 text-center font-black border-r border-slate-200">
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
                    <td className="p-2.5 bg-slate-50/50"></td>
                  </tr>

                  {/* Row Total Aspek Dimensi */}
                  <tr className="bg-gradient-to-r from-periwinkle-50/90 via-indigo-50/70 to-slate-100 font-black border-t-2 border-slate-900">
                    <td className="p-3 text-center font-mono border-r border-slate-300 text-slate-900 font-bold">
                      1 s.d. {totalParams}
                    </td>
                    <td colSpan={2} className="p-3 border-r border-slate-300 uppercase tracking-wider text-slate-950 font-black">
                      SKOR ASPEK DIMENSI
                    </td>
                    <td colSpan={2} className="p-3 text-center font-mono text-base font-black text-[#6531F7]">
                      {calculation.dimensionAspectScore.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* TABEL II: ASPEK KINERJA */}
          <div className="space-y-2.5 break-inside-avoid">
            <div className="flex items-center justify-between border-b-2 border-slate-900 pb-1.5">
              <h3 className="font-black text-sm uppercase tracking-wide text-slate-950 flex items-center gap-2">
                <span className="w-5 h-5 rounded-md bg-slate-900 text-white inline-flex items-center justify-center text-xs font-black">
                  II
                </span>
                <span>ASPEK KINERJA</span>
              </h3>
              <span className="text-xs font-bold text-slate-600">
                Merujuk pada Tabel Konversi & Penyesuaian Bab II Juknis RMI
              </span>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 border-r border-slate-300 text-center w-12">
                      No
                    </th>
                    <th className="p-3 border-r border-slate-300">
                      Aspek Kinerja
                    </th>
                    <th className="p-3 border-r border-slate-300 text-center w-28">
                      Nilai Aspek
                    </th>
                    <th className="p-3 border-r border-slate-300 text-center w-24">
                      Nilai Konversi
                    </th>
                    <th className="p-3 border-r border-slate-300 text-center w-20">
                      Bobot
                    </th>
                    <th className="p-3 border-r border-slate-300 text-center w-36">
                      Nilai Konversi × Bobot
                    </th>
                    <th className="p-3 text-center w-24">
                      Skor
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {/* Row 1: Tingkat Kesehatan */}
                  <tr className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-2.5 text-center font-bold border-r border-slate-200">
                      1
                    </td>
                    <td className="p-2.5 border-r border-slate-200 font-medium text-slate-900">
                      Tingkat Kesehatan Peringkat Akhir (Final Rating)
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
                    <td className="p-2.5 bg-slate-50/50"></td>
                  </tr>

                  {/* Row 2: Peringkat Komposit Risiko */}
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
                    <td className="p-2.5 bg-slate-50/50"></td>
                  </tr>

                  {/* Subtotal Aspek Kinerja */}
                  <tr className="bg-slate-50 font-bold border-t border-slate-300">
                    <td className="p-2.5 text-center font-mono border-r border-slate-300">
                      1 s.d. 2
                    </td>
                    <td colSpan={4} className="p-2.5 border-r border-slate-300 uppercase tracking-wide text-slate-800">
                      SKOR ASPEK KINERJA
                    </td>
                    <td colSpan={2} className="p-2.5 text-center font-mono text-sm font-black text-slate-900">
                      {calculation.totalPerformanceScore.toFixed(2)}
                    </td>
                  </tr>

                  {/* Penyesuaian Skor */}
                  <tr className="border-t border-slate-300 bg-amber-50/40">
                    <td colSpan={5} className="p-2.5 text-right font-bold border-r border-slate-300 text-slate-800">
                      PENYESUAIAN SKOR ASPEK DIMENSI
                    </td>
                    <td colSpan={2} className="p-2.5 text-center font-mono font-black text-sm text-slate-900">
                      <span
                        className={`px-2.5 py-0.5 rounded-full ${
                          calculation.scoreAdjustment < 0
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {calculation.scoreAdjustment !== 0
                          ? calculation.scoreAdjustment.toFixed(2)
                          : '0.00'}
                      </span>
                    </td>
                  </tr>

                  {/* Final Total Skor RMI */}
                  <tr className="bg-slate-950 text-white font-black border-t-2 border-slate-950">
                    <td
                      colSpan={5}
                      className="p-3 text-right text-xs tracking-wider uppercase border-r border-slate-800"
                    >
                      SKOR RMI (RISK MATURITY INDEX)
                    </td>
                    <td
                      colSpan={2}
                      className="p-3 text-center font-mono text-xl text-periwinkle-300 font-black"
                    >
                      {calculation.finalRmiScore.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Explanatory Footnotes from Juknis */}
            <div className="text-[11px] text-slate-500 italic pt-1 space-y-0.5">
              <p>
                * Keterangan: Total Skor RMI diperoleh dari Skor Aspek Dimensi dijumlahkan dengan Penyesuaian Skor Aspek Kinerja (Tabel 4 Juknis SK-8/DKU.MBU/12/2023).
              </p>
            </div>
          </div>

          {/* Lembar Pengesahan Laporan Resmi */}
          <div className="pt-8 border-t-2 border-slate-900 space-y-6 break-inside-avoid">
            <div className="text-center space-y-1">
              <h4 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
                LEMBAR PENGESAHAN LAPORAN HASIL PENILAIAN RMI TAHUN BUKU {profile.year}
              </h4>
              <p className="text-[11px] text-slate-500 italic">
                Disahkan di Jakarta, pada tanggal {formatTanggal(profile.assessmentDate)}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs pt-4">
              {/* Box 1: Pelaksana Penilai */}
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

              {/* Box 2: Direksi Pengelola Risiko */}
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

              {/* Box 3: Dewan Komisaris */}
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

      {/* Page break separator for print between Lampiran V.A and V.B */}
      {activeSubReport === 'all' && (
        <div className="hidden print:block print:h-8 print:break-before-page"></div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: LAMPIRAN V.B - FORMULIR PEMANTAUAN TINDAK LANJUT REKOMENDASI   */}
      {/* ========================================================================= */}
      {(activeSubReport === 'all' || activeSubReport === 'vb') && (
        <div
          className={`bg-white rounded-3xl border ${
            viewMode === 'modern'
              ? 'border-slate-200/90 shadow-xl shadow-slate-200/40'
              : 'border-slate-300 shadow-md'
          } p-6 sm:p-12 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none space-y-8`}
        >
          {/* Header Lampiran V.B */}
          <div className="text-center space-y-2 pb-6 border-b-2 border-slate-900 relative">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-extrabold uppercase tracking-widest border border-slate-200 print:border-slate-400 mb-1">
              <Building2 className="w-3.5 h-3.5 text-slate-800" />
              <span>KEMENTERIAN BADAN USAHA MILIK NEGARA REPUBLIK INDONESIA</span>
            </div>

            <h2 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-slate-950 leading-snug">
              FORMULIR PEMANTAUAN TINDAK LANJUT REKOMENDASI RMI
            </h2>

            <div className="text-xs text-slate-600 font-serif italic max-w-2xl mx-auto pt-1">
              Merujuk pada Lampiran V.B Keputusan Deputi Bidang Keuangan dan Manajemen Risiko
              <br />
              Nomor: <span className="font-semibold not-italic text-slate-900">SK-8/DKU.MBU/12/2023</span> Tanggal 6 Desember 2023
            </div>
          </div>

          {/* Metadata Lampiran V.B */}
          {viewMode === 'modern' ? (
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
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-900">
                <tbody>
                  <tr className="border-b border-slate-300">
                    <td className="w-1/4 p-2 font-bold bg-slate-100 border-r border-slate-300">BUMN</td>
                    <td className="p-2 font-bold text-slate-950 uppercase">{profile.companyName}</td>
                    <td className="w-1/4 p-2 font-bold bg-slate-100 border-r border-slate-300">Tahun</td>
                    <td className="p-2 font-mono text-slate-900">{profile.year}</td>
                  </tr>
                  <tr className="border-b border-slate-300">
                    <td className="p-2 font-bold bg-slate-100 border-r border-slate-300">No. Laporan</td>
                    <td className="p-2 font-mono text-slate-900">{profile.reportNumber}</td>
                    <td className="p-2 font-bold bg-slate-100 border-r border-slate-300">Model Penilaian RMI</td>
                    <td className="p-2 font-semibold text-slate-900">{modelLabel}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Status Breakdown & Filter Bar (Screen Only) */}
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

          {/* TABEL PEMANTAUAN TINDAK LANJUT REKOMENDASI RMI (Baku Lampiran V.B) */}
          <div className="space-y-2.5">
            <div className="overflow-x-auto rounded-xl border border-slate-300">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300 uppercase tracking-wider">
                  <tr>
                    <th className="p-3 border-r border-slate-300 w-52">
                      Dimensi
                    </th>
                    <th className="p-3 border-r border-slate-300">
                      Rekomendasi
                    </th>
                    <th className="p-3 border-r border-slate-300 text-center w-36">
                      Target Penyelesaian
                    </th>
                    <th className="p-3 border-r border-slate-300 text-center w-36">
                      Pemberi Target
                    </th>
                    <th className="p-3 text-center w-36">
                      Status Tindak Lanjut
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredRecommendations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                        Tidak ada data rekomendasi yang sesuai dengan filter.
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
                                    Param P.{rec.paramId}
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Rekomendasi */}
                          <td className="p-3 align-top border-r border-slate-200 font-medium text-slate-800 leading-relaxed">
                            <p className="text-xs">{rec.rekomendasi}</p>
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

          {/* Keterangan Resmi Isian Lampiran V.B (Official Footnotes from Juknis) */}
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
                  <strong>Sesuai:</strong> Tindak lanjut telah diselesaikan sepenuhnya sesuai rekomendasi.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-mono font-bold rounded">
                  BS
                </span>
                <span>
                  <strong>Belum Sesuai:</strong> Tindak lanjut sedang berjalan namun belum memenuhi target rekomendasi.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-rose-100 text-rose-900 font-mono font-bold rounded">
                  BD
                </span>
                <span>
                  <strong>Belum Ditindaklanjuti:</strong> Belum ada tindakan nyata atas rekomendasi yang diberikan.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="px-2 py-0.5 bg-slate-200 text-slate-800 font-mono font-bold rounded">
                  TDD
                </span>
                <span>
                  <strong>Tidak Dapat Ditindaklanjuti:</strong> Kendala regulasi eksternal atau restrukturisasi yang sah.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
