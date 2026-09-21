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
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Info
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
  const [showColumnReference, setShowColumnReference] = useState<boolean>(false);
  const [showExecutiveCards, setShowExecutiveCards] = useState<boolean>(true);
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
          label: 'S',
          fullLabel: 'S (Sesuai)',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-500',
          desc: 'Sesuai dengan Rekomendasi'
        };
      case 'BS':
        return {
          label: 'BS',
          fullLabel: 'BS (Belum Sesuai)',
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          dot: 'bg-amber-500',
          desc: 'Belum Sesuai dengan Rekomendasi'
        };
      case 'BD':
        return {
          label: 'BD',
          fullLabel: 'BD (Belum TL)',
          bg: 'bg-rose-50 text-rose-800 border-rose-300',
          dot: 'bg-rose-500',
          desc: 'Rekomendasi Belum Ditindaklanjuti'
        };
      case 'TDD':
        return {
          label: 'TDD',
          fullLabel: 'TDD (Tidak Dapat)',
          bg: 'bg-slate-100 text-slate-800 border-slate-300',
          dot: 'bg-slate-400',
          desc: 'Rekomendasi Tidak Dapat Ditindaklanjuti'
        };
      default:
        return {
          label: status,
          fullLabel: status,
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          dot: 'bg-slate-400',
          desc: '-'
        };
    }
  };

  // Clean formatting helper for scores (matching Juknis comma style e.g. 3,7 or 2,9)
  const formatScore = (num: number, decimals: number = 2) => {
    return num.toFixed(decimals).replace('.', ',');
  };

  return (
    <div className="space-y-5 max-w-5xl mx-auto pb-16">
      {/* Top Floating Action Bar (Hidden in Print) */}
      <div className="print:hidden glass-card p-4 space-y-3 border border-white/80 shadow-glass">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#088395] to-[#0a6c7c] text-white flex items-center justify-center shadow-md shadow-[#088395]/25 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Format Baku Laporan RMI (Juknis SK-8 Hal. 188)
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-50 text-[#088395] text-[10px] font-extrabold border border-teal-200">
                  Lampiran V
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Format resmi SK-8/DKU.MBU/12/2023 • Kementerian Badan Usaha Milik Negara
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowExecutiveCards(!showExecutiveCards)}
              className="glass-btn px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 border-slate-200"
              title="Sembunyikan/Tampilkan Kartu Metrik Eksekutif di Atas"
            >
              <Sparkles className="w-3.5 h-3.5 inline mr-1 text-[#088395]" />
              {showExecutiveCards ? 'Sembunyikan Ringkasan' : 'Tampilkan Ringkasan'}
            </button>

            <button
              onClick={handleExportCsv}
              className="glass-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 hover:text-emerald-800 border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-50 transition-all shadow-xs"
              title="Unduh format spreadsheet CSV/Excel lengkap"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Ekspor Excel</span>
            </button>

            <button
              onClick={handlePrint}
              className="glass-btn-primary inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-[#088395]/20 bg-[#088395] hover:bg-[#066c7b] transition-all text-white"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF Resmi</span>
            </button>
          </div>
        </div>

        {/* Sub-report Tabs Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/70">
            <button
              onClick={() => setActiveSubReport('va')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeSubReport === 'va'
                  ? 'bg-[#088395] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              📄 Formulir Ringkasan RMI (Hal. 188)
            </button>
            <button
              onClick={() => setActiveSubReport('vb')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeSubReport === 'vb'
                  ? 'bg-[#088395] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              📋 Pemantauan Tindak Lanjut (Lamp. V.B)
            </button>
            <button
              onClick={() => setActiveSubReport('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all ${
                activeSubReport === 'all'
                  ? 'bg-[#088395] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Layers className="w-3.5 h-3.5 inline mr-1" />
              Laporan Lengkap Terpadu
            </button>
          </div>

          <button
            onClick={() => setShowColumnReference(!showColumnReference)}
            className="text-[11px] font-bold text-[#088395] hover:underline inline-flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{showColumnReference ? 'Tutup Keterangan Kolom a-s' : 'Keterangan Kolom a-s'}</span>
          </button>
        </div>
      </div>

      {/* Executive Hero KPI Cards (Optional Screen Summary) */}
      {showExecutiveCards && (
        <div className="print:hidden grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Total Skor RMI */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-md transition-all">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
              Total Skor Akhir RMI
            </div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-2xl font-black font-mono text-[#088395] tracking-tight">
                {calculation.finalRmiScore.toFixed(2)}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">/ 5.00</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#088395]/10 text-[#088395] border border-[#088395]/20">
              <Sparkles className="w-2.5 h-2.5" />
              <span>{maturityPhase.subLevel}</span>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>Rentang: {maturityPhase.minScore.toFixed(2)} - {maturityPhase.maxScore.toFixed(2)}</span>
              <span className="font-semibold text-slate-700">Tingkat {maturityPhase.level}</span>
            </div>
          </div>

          {/* Card 2: Skor Aspek Dimensi */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-md transition-all">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
              I. Aspek Dimensi
            </div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-2xl font-black font-mono text-teal-800 tracking-tight">
                {calculation.dimensionAspectScore.toFixed(2)}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">/ 5.00</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
              <span>5 Dimensi • {totalParams} Parameter</span>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>Bobot Dimensi: Rata-rata</span>
              <span className="font-semibold text-emerald-600">100% Selesai</span>
            </div>
          </div>

          {/* Card 3: Aspek Kinerja & Penyesuaian */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-md transition-all">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
              II. Kinerja & Penyesuaian
            </div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-2xl font-black font-mono text-amber-600 tracking-tight">
                {calculation.scoreAdjustment !== 0
                  ? (calculation.scoreAdjustment > 0 ? `+${calculation.scoreAdjustment.toFixed(2)}` : calculation.scoreAdjustment.toFixed(2))
                  : '0.00'}
              </span>
              <span className="text-[11px] font-semibold text-slate-400">penyesuaian</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              <span>Skor Kinerja: {calculation.totalPerformanceScore.toFixed(1)}</span>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>Sehat: {performance.healthRating}</span>
              <span>Komposit: P-{performance.compositeRating}</span>
            </div>
          </div>

          {/* Card 4: Capaian Tindak Lanjut */}
          <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3.5 border border-white/90 shadow-glass relative overflow-hidden group hover:shadow-md transition-all">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">
              Tindak Lanjut (Lamp. V.B)
            </div>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="text-2xl font-black font-mono text-emerald-600 tracking-tight">
                {completionRate}%
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                ({countS}/{totalRecs} Selesai)
              </span>
            </div>
            <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <span>{countBS} BS • {countBD} BD</span>
            </div>
            <div className="mt-2.5 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span>Total Rekomendasi: {totalRecs}</span>
              <span className="font-semibold text-slate-700">Triwulanan</span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 1: LAMPIRAN V.A - PERSIS HALAMAN 188 JUKNIS SK-8                 */}
      {/* ========================================================================= */}
      {(activeSubReport === 'va' || activeSubReport === 'all') && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-10 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none space-y-6 text-slate-900 font-sans">
          {/* 1. KOP KEMENTERIAN BUMN (Sesuai Hal. 188 Juknis) */}
          <div className="pb-3 border-b-2 border-slate-800 space-y-3">
            <div className="flex items-center gap-4">
              {/* Garuda Pancasila SVG Emblem */}
              <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-14 h-14" fill="none">
                  {/* Stylized Official Coat of Arms Garuda */}
                  <circle cx="50" cy="50" r="46" fill="#FBFBFB" stroke="#DAA520" strokeWidth="2.5" />
                  <path d="M50 14 L55 28 L70 28 L58 37 L62 51 L50 42 L38 51 L42 37 L30 28 L45 28 Z" fill="#D4AF37" stroke="#8B6508" strokeWidth="0.8" />
                  {/* Shield */}
                  <path d="M38 42 H62 V64 C62 74 50 82 50 82 C50 82 38 74 38 64 Z" fill="#B22222" stroke="#111" strokeWidth="1.2" />
                  <path d="M50 42 V82" stroke="#FFF" strokeWidth="1.5" />
                  <path d="M38 56 H62" stroke="#FFF" strokeWidth="1.5" />
                  <circle cx="50" cy="56" r="3.5" fill="#DAA520" stroke="#000" strokeWidth="0.8" />
                  <path d="M34 82 C44 86 56 86 66 82" stroke="#DAA520" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* BUMN Logo Typography Emblem */}
              <div className="w-14 h-10 shrink-0 flex items-center justify-center border-l-2 border-slate-200 pl-3">
                <div className="flex items-center font-black tracking-tighter text-2xl text-[#088395]">
                  <span className="text-[#088395]">B</span>
                  <span className="text-[#088395]">U</span>
                  <span className="text-[#088395]">M</span>
                  <span className="text-[#088395]">N</span>
                </div>
              </div>

              {/* Ministry Address Header */}
              <div className="text-left pl-2">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                  KEMENTERIAN BADAN USAHA MILIK NEGARA REPUBLIK INDONESIA
                </h2>
                <p className="text-[10px] text-slate-600 font-medium leading-tight">
                  Jl. Medan Merdeka Selatan No. 13 Jakarta 10110 Indonesia
                  <br />
                  Telp. 021-29935678 | Fax. 021-29935740 | www.bumn.go.id
                </p>
              </div>
            </div>
          </div>

          {/* 2. KOTAK KEPUTUSAN DEPUTI (Rata Kanan Sesuai Hal. 188) */}
          <div className="flex justify-end pt-1">
            <div className="text-[11px] leading-tight text-slate-800 space-y-1 max-w-md">
              <div className="font-extrabold uppercase tracking-wide">
                LAMPIRAN V
              </div>
              <div className="font-bold">
                KEPUTUSAN DEPUTI BIDANG KEUANGAN DAN MANAJEMEN RISIKO
              </div>
              <table className="text-[10.5px] leading-tight mt-0.5">
                <tbody>
                  <tr>
                    <td className="font-semibold pr-2 align-top whitespace-nowrap">NOMOR</td>
                    <td className="align-top pr-1">:</td>
                    <td className="align-top font-bold">SK-8/DKU.MBU/12/2023</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-2 align-top whitespace-nowrap">TANGGAL</td>
                    <td className="align-top pr-1">:</td>
                    <td className="align-top">6 Desember 2023</td>
                  </tr>
                  <tr>
                    <td className="font-semibold pr-2 align-top whitespace-nowrap">TENTANG</td>
                    <td className="align-top pr-1">:</td>
                    <td className="align-top font-medium text-slate-700">
                      PETUNJUK TEKNIS PENILAIAN INDEKS KEMATANGAN RISIKO (RISK MATURITY INDEX) DI LINGKUNGAN BADAN USAHA MILIK NEGARA
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 3. JUDUL UTAMA DOKUMEN (Tengah & Bold Sesuai Hal. 188) */}
          <div className="text-center pt-2 pb-1 space-y-1">
            <h1 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-950">
              FORMAT PELAPORAN HASIL PENILAIAN INDEKS KEMATANGAN RISIKO
            </h1>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 text-left pt-2">
              A. Bentuk Formulir Ringkasan Hasil Penilaian RMI
            </div>
          </div>

          {/* 4. TABEL IDENTITAS BUMN (Format Hal. 188 dengan Header Teal #088395) */}
          <div className="overflow-x-auto">
            <table className="w-full sm:w-3/5 text-xs border border-slate-400">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-44 p-2 font-bold bg-[#088395] text-white border-r border-slate-300 tracking-wide">
                    BUMN
                  </td>
                  <td className="p-2 font-bold text-slate-950 uppercase bg-white">
                    {profile.companyName}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-[#088395] text-white border-r border-slate-300 tracking-wide">
                    Tahun
                  </td>
                  <td className="p-2 font-mono font-bold text-slate-900 bg-white">
                    {profile.year}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-[#088395] text-white border-r border-slate-300 tracking-wide">
                    No. Laporan
                  </td>
                  <td className="p-2 font-mono font-bold text-slate-900 bg-white">
                    {profile.reportNumber}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-[#088395] text-white border-r border-slate-300 tracking-wide">
                    Model Penilaian RMI
                  </td>
                  <td className="p-2 font-bold text-[#088395] bg-white">
                    {modelLabel}
                  </td>
                </tr>
                <tr className="border-b border-slate-400 bg-teal-50/40">
                  <td className="p-2 font-extrabold bg-[#088395] text-white border-r border-slate-300 tracking-wide">
                    Skor RMI
                  </td>
                  <td className="p-2 bg-white">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base font-black font-mono text-[#088395]">
                        {formatScore(calculation.finalRmiScore, 2)}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-[#088395] text-white rounded-md font-bold shadow-xs">
                        {maturityPhase.subLevel}
                      </span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 5. TABEL I: ASPEK DIMENSI (Persis Format & Kolom Hal. 188) */}
          <div className="space-y-1 break-inside-avoid">
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-400">
                {/* Header Teal #088395 Sesuai Hal. 188 */}
                <thead className="bg-[#088395] text-white font-bold border-b border-slate-400">
                  <tr>
                    <th className="p-2 border-r border-slate-300 text-center w-28 uppercase">
                      Parameter
                    </th>
                    <th className="p-2 border-r border-slate-300 text-center w-16 uppercase">
                      Dimensi
                    </th>
                    <th className="p-2 border-r border-slate-300 text-center uppercase">
                      Deskripsi
                    </th>
                    <th className="p-2 border-r border-slate-300 text-center w-28 uppercase">
                      Skor Dimensi
                    </th>
                    <th className="p-2 text-center w-24 uppercase">
                      Skor
                    </th>
                  </tr>
                  {/* Baris Kode Kolom (f, g, h, i, -) */}
                  <tr className="bg-[#066e7d] text-white/90 text-[10px] font-mono border-t border-[#0a9ab0]">
                    <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">f</th>
                    <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">g</th>
                    <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">h</th>
                    <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">i</th>
                    <th className="py-0.5 text-center font-normal"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 bg-white">
                  {/* Dimensi 1 */}
                  <tr className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-2 text-center font-bold font-mono border-r border-slate-300">
                      1 s.d. 3
                    </td>
                    <td className="p-2 text-center font-bold border-r border-slate-300">
                      1
                    </td>
                    <td className="p-2 border-r border-slate-300 font-medium text-slate-900">
                      Budaya dan Kapabiltas Risiko
                    </td>
                    <td className="p-2 text-center font-mono font-bold text-sm border-r border-slate-300 text-slate-900">
                      {formatScore(calculation.dimensions[0]?.score ?? 0, 2)}
                    </td>
                    <td className="p-2 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Dimensi 2 */}
                  <tr className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-2 text-center font-bold font-mono border-r border-slate-300">
                      4 s.d. 19
                    </td>
                    <td className="p-2 text-center font-bold border-r border-slate-300">
                      2
                    </td>
                    <td className="p-2 border-r border-slate-300 font-medium text-slate-900">
                      Organisasi dan Tata Kelola Risiko
                    </td>
                    <td className="p-2 text-center font-mono font-bold text-sm border-r border-slate-300 text-slate-900">
                      {formatScore(calculation.dimensions[1]?.score ?? 0, 2)}
                    </td>
                    <td className="p-2 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Dimensi 3 */}
                  <tr className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-2 text-center font-bold font-mono border-r border-slate-300">
                      20 s.d. 33
                    </td>
                    <td className="p-2 text-center font-bold border-r border-slate-300">
                      3
                    </td>
                    <td className="p-2 border-r border-slate-300 font-medium text-slate-900">
                      Kerangka Risiko dan Kepatuhan
                    </td>
                    <td className="p-2 text-center font-mono font-bold text-sm border-r border-slate-300 text-slate-900">
                      {formatScore(calculation.dimensions[2]?.score ?? 0, 2)}
                    </td>
                    <td className="p-2 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Dimensi 4 */}
                  <tr className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-2 text-center font-bold font-mono border-r border-slate-300">
                      34 s.d. 39
                    </td>
                    <td className="p-2 text-center font-bold border-r border-slate-300">
                      4
                    </td>
                    <td className="p-2 border-r border-slate-300 font-medium text-slate-900">
                      Proses dan Kontrol Risiko
                    </td>
                    <td className="p-2 text-center font-mono font-bold text-sm border-r border-slate-300 text-slate-900">
                      {formatScore(calculation.dimensions[3]?.score ?? 0, 2)}
                    </td>
                    <td className="p-2 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Dimensi 5 */}
                  <tr className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-2 text-center font-bold font-mono border-r border-slate-300">
                      40 s.d. {dim5EndParam}
                    </td>
                    <td className="p-2 text-center font-bold border-r border-slate-300">
                      5
                    </td>
                    <td className="p-2 border-r border-slate-300 font-medium text-slate-900">
                      Model, Data, dan Teknologi Risiko
                    </td>
                    <td className="p-2 text-center font-mono font-bold text-sm border-r border-slate-300 text-slate-900">
                      {formatScore(calculation.dimensions[4]?.score ?? 0, 2)}
                    </td>
                    <td className="p-2 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Baris Total Skor Aspek Dimensi (Sesuai Hal. 188 & 192 Juknis) */}
                  <tr className="bg-slate-100 font-black border-t-2 border-slate-400">
                    <td className="p-2 text-center font-mono border-r border-slate-300 font-bold">
                      1 s.d. {totalParams}
                    </td>
                    <td colSpan={2} className="p-2 border-r border-slate-300 uppercase tracking-wide font-extrabold text-slate-950">
                      Skor Aspek Dimensi
                    </td>
                    <td className="p-2 border-r border-slate-300 bg-slate-50/70 text-center">
                      {/* Kosong pada kolom Skor Dimensi sesuai Juknis Hal. 188/192 */}
                    </td>
                    <td className="p-2 text-center font-mono text-sm font-black text-[#088395]">
                      {/* Nilai Skor Aspek Dimensi di kolom Skor (kolom j) */}
                      {formatScore(calculation.dimensionAspectScore, 2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. TABEL II: ASPEK KINERJA (Persis Format & Kolom Hal. 188/189) */}
          <div className="space-y-1 break-inside-avoid">
            {/* Banner Pemisah ASPEK KINERJA */}
            <div className="bg-slate-200/90 text-slate-950 font-black text-xs uppercase tracking-wider py-1.5 px-3 text-center border-x border-t border-slate-400">
              ASPEK KINERJA
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-400">
                {/* Header Teal #088395 Sesuai Hal. 189 */}
                <thead className="bg-[#088395] text-white font-bold border-b border-slate-400">
                  <tr>
                    <th className="p-2 border-r border-slate-300 text-center w-12 uppercase">
                      No
                    </th>
                    <th className="p-2 border-r border-slate-300 text-center uppercase">
                      Aspek
                    </th>
                    <th className="p-2 border-r border-slate-300 text-center w-28 uppercase">
                      Nilai Aspek
                    </th>
                    <th className="p-2 border-r border-slate-300 text-center w-24 uppercase">
                      Nilai Konversi
                    </th>
                    <th className="p-2 border-r border-slate-300 text-center w-20 uppercase">
                      Bobot
                    </th>
                    <th className="p-2 border-r border-slate-300 text-center w-36 uppercase">
                      Nilai Konversi x Bobot
                    </th>
                    <th className="p-2 text-center w-24 uppercase">
                      Skor
                    </th>
                  </tr>
                  {/* Baris Kode Kolom (k, l, m, n, o, p, -) */}
                  <tr className="bg-[#066e7d] text-white/90 text-[10px] font-mono border-t border-[#0a9ab0]">
                    <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">k</th>
                    <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">l</th>
                    <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">m</th>
                    <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">n</th>
                    <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">o</th>
                    <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">p</th>
                    <th className="py-0.5 text-center font-normal"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300 bg-white">
                  {/* Baris 1: Tingkat Kesehatan */}
                  <tr className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-2 text-center font-bold border-r border-slate-300">
                      1
                    </td>
                    <td className="p-2 border-r border-slate-300 font-medium text-slate-900">
                      Tingkat Kesehatan Peringkat Akhir (<em>Final Rating</em>)
                    </td>
                    <td className="p-2 text-center border-r border-slate-300 font-bold">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        {performance.healthRating}
                      </span>
                    </td>
                    <td className="p-2 text-center font-mono font-bold border-r border-slate-300 text-slate-800">
                      {calculation.healthConversion}
                    </td>
                    <td className="p-2 text-center font-semibold border-r border-slate-300 text-slate-700">
                      50%
                    </td>
                    <td className="p-2 text-center font-mono font-bold border-r border-slate-300 text-slate-900">
                      {formatScore(calculation.healthWeighted, 1)}
                    </td>
                    <td className="p-2 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Baris 2: Peringkat Komposit Risiko */}
                  <tr className="hover:bg-teal-50/30 transition-colors">
                    <td className="p-2 text-center font-bold border-r border-slate-300">
                      2
                    </td>
                    <td className="p-2 border-r border-slate-300 font-medium text-slate-900">
                      Peringkat Komposit Risiko
                    </td>
                    <td className="p-2 text-center border-r border-slate-300 font-bold">
                      <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold">
                        {performance.compositeRating}
                      </span>
                    </td>
                    <td className="p-2 text-center font-mono font-bold border-r border-slate-300 text-slate-800">
                      {calculation.compositeConversion}
                    </td>
                    <td className="p-2 text-center font-semibold border-r border-slate-300 text-slate-700">
                      50%
                    </td>
                    <td className="p-2 text-center font-mono font-bold border-r border-slate-300 text-slate-900">
                      {formatScore(calculation.compositeWeighted, 1)}
                    </td>
                    <td className="p-2 bg-slate-50/40 text-center"></td>
                  </tr>

                  {/* Baris 3: Skor Aspek Kinerja (q) */}
                  <tr className="bg-slate-100 font-bold border-t border-slate-300">
                    <td className="p-2 text-center font-mono border-r border-slate-300">
                      1 s.d. 2
                    </td>
                    <td colSpan={5} className="p-2 border-r border-slate-300 uppercase tracking-wide text-slate-900 font-extrabold">
                      Skor Aspek Kinerja
                    </td>
                    <td className="p-2 text-center font-mono text-xs font-black text-slate-950">
                      {formatScore(calculation.totalPerformanceScore, 1)}
                    </td>
                  </tr>

                  {/* Baris 4: Penyesuaian Skor (r) */}
                  <tr className="border-t border-slate-300 bg-amber-50/40">
                    <td className="p-2 border-r border-slate-300"></td>
                    <td colSpan={5} className="p-2 border-r border-slate-300 font-bold text-slate-900">
                      Penyesuaian Skor
                    </td>
                    <td className="p-2 text-center font-mono font-black text-xs text-slate-950">
                      <span
                        className={`px-2 py-0.5 rounded ${
                          calculation.scoreAdjustment < 0
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {calculation.scoreAdjustment !== 0
                          ? formatScore(calculation.scoreAdjustment, 1)
                          : '0,0'}
                      </span>
                    </td>
                  </tr>

                  {/* Baris 5: SKOR RMI (s) - Highlight Abu-abu / Gelap Baku Hal. 189 */}
                  <tr className="bg-slate-200 text-slate-950 font-black border-t-2 border-slate-400">
                    <td
                      colSpan={6}
                      className="p-2.5 text-center text-xs tracking-wider uppercase border-r border-slate-300 font-black"
                    >
                      SKOR RMI
                    </td>
                    <td
                      className="p-2.5 text-center font-mono text-base text-[#088395] font-black"
                    >
                      {formatScore(calculation.finalRmiScore, 2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* 7. KETERANGAN KOLOM PELAPORAN PENILAIAN RMI (Hal. 189 Juknis) */}
          {(showColumnReference || activeSubReport === 'all') && (
            <div className="pt-2 space-y-2 break-inside-avoid">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                Keterangan masing-masing kolom pelaporan Penilaian RMI:
              </div>
              <div className="overflow-x-auto rounded-lg border border-slate-300 text-xs">
                <table className="w-full text-left">
                  <thead className="bg-[#088395] text-white font-bold">
                    <tr>
                      <th className="p-2 border-r border-slate-300 text-center w-12">No.</th>
                      <th className="p-2 border-r border-slate-300 w-44">Nama Kolom</th>
                      <th className="p-2">Keterangan Isian</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white text-[11px]">
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">a</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">BUMN</td>
                      <td className="p-1.5">Diisi nama BUMN lengkap</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">b</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Tahun</td>
                      <td className="p-1.5">Diisi tahun penilaian RMI diterbitkan.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">c</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">No. Laporan</td>
                      <td className="p-1.5">Diisi menggunakan nomor laporan penilaian RMI</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">d</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Model Penilaian RMI</td>
                      <td className="p-1.5">Diisi menggunakan salah satu model: 1. KBUMN – Industri Umum; 2. KBUMN – Industri Perbankan; 3. KBUMN – Industri Asuransi.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">e</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Skor RMI</td>
                      <td className="p-1.5">Diisi skor total RMI yang merupakan skor aspek Dimensi dijumlahkan dengan skor aspek kinerja dan dikurangi dengan penyesuaian skor.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">f</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Parameter</td>
                      <td className="p-1.5">Diisi nomor Parameter sesuai dengan jumlah Parameter untuk masing-masing industri.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">g</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Dimensi</td>
                      <td className="p-1.5">Diisi nomor Dimensi Penilaian RMI.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">h</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Deskripsi</td>
                      <td className="p-1.5">Diisi deskripsi atau nama Dimensi Penilaian RMI.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">i</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Skor Dimensi</td>
                      <td className="p-1.5">Diisi skor Dimensi yang diperoleh dari rata-rata skor Parameter pada Dimensi tersebut.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">j</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Skor Aspek Dimensi</td>
                      <td className="p-1.5">Diisi skor aspek Dimensi yang diperoleh dari rata-rata skor seluruh Parameter.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">k</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Nomor</td>
                      <td className="p-1.5">Diisi nomor urut Aspek Kinerja.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">l</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Aspek</td>
                      <td className="p-1.5">Diisi nama Aspek Kinerja dalam Penilaian RMI.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">m</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Nilai Aspek</td>
                      <td className="p-1.5">Diisi nilai dari masing-masing Aspek Kinerja.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">n</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Konversi</td>
                      <td className="p-1.5">Diisi konversi atas nilai per Aspek Kinerja merujuk pada tabel konversi Bab II.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">o</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Bobot</td>
                      <td className="p-1.5">Diisi bobot per Aspek Kinerja (50%).</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">p</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Konversi x Bobot</td>
                      <td className="p-1.5">Diisi hasil perkalian antara konversi dan bobot.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">q</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Skor Aspek Kinerja</td>
                      <td className="p-1.5">Diisi skor Aspek Kinerja yang merupakan penjumlahan konversi x bobot.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">r</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Penyesuaian Skor</td>
                      <td className="p-1.5">Diisi penyesuaian skor merujuk pada tabel penyesuaian Bab II.</td>
                    </tr>
                    <tr>
                      <td className="p-1.5 text-center font-bold font-mono border-r border-slate-200">s</td>
                      <td className="p-1.5 font-semibold border-r border-slate-200">Skor RMI</td>
                      <td className="p-1.5">Diisi skor total RMI yang merupakan skor aspek Dimensi dijumlahkan dengan penyesuaian skor aspek kinerja.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. LEMBAR PENGESAHAN LAPORAN RESMI (3 Tanda Tangan) */}
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
              {/* Pihak 1 */}
              <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 flex flex-col justify-between h-40 shadow-xs">
                <div>
                  <span className="font-extrabold text-slate-800 text-[11px] block">
                    Pelaksana Penilaian RMI
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    ({profile.assessorName})
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-28 mx-auto border-b border-slate-400"></div>
                  <div className="font-bold text-[11px] text-slate-900">
                    Ketua Tim Penilai
                  </div>
                  <div className="text-[9px] text-slate-400">Tanda Tangan & Cap</div>
                </div>
              </div>

              {/* Pihak 2 */}
              <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 flex flex-col justify-between h-40 shadow-xs">
                <div>
                  <span className="font-extrabold text-slate-800 text-[11px] block">
                    Mengetahui & Menyetujui,
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Direksi Pengelola Risiko
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-28 mx-auto border-b border-slate-400"></div>
                  <div className="font-bold text-[11px] text-slate-900">
                    Direktur Keuangan & MR
                  </div>
                  <div className="text-[9px] text-slate-400">Tanda Tangan & Cap</div>
                </div>
              </div>

              {/* Pihak 3 */}
              <div className="p-3.5 rounded-xl bg-slate-50/90 border border-slate-200/80 flex flex-col justify-between h-40 shadow-xs">
                <div>
                  <span className="font-extrabold text-slate-800 text-[11px] block">
                    Mengetahui,
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Dewan Komisaris / Pengawas
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="w-28 mx-auto border-b border-slate-400"></div>
                  <div className="font-bold text-[11px] text-slate-900">
                    Ketua Komite Pemantau Risiko
                  </div>
                  <div className="text-[9px] text-slate-400">Tanda Tangan & Cap</div>
                </div>
              </div>
            </div>
          </div>

          {/* 9. FOOTER AKHLAK KEMENTERIAN BUMN (Sesuai Hal. 188) */}
          <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-sans tracking-wide">
            <div className="font-medium">
              AKHLAK - Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif
            </div>
            <div className="font-mono text-slate-400 mt-1 sm:mt-0">
              Lampiran V.A • Halaman 177 / 188 SK-8/DKU.MBU/12/2023
            </div>
          </div>
        </div>
      )}

      {/* Page break separator for print */}
      {activeSubReport === 'all' && (
        <div className="hidden print:block print:h-8 print:break-before-page"></div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: LAMPIRAN V.B - PEMANTAUAN TINDAK LANJUT REKOMENDASI (Hal. 190) */}
      {/* ========================================================================= */}
      {(activeSubReport === 'vb' || activeSubReport === 'all') && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl shadow-slate-200/50 p-6 sm:p-10 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none space-y-6 text-slate-900 font-sans">
          {/* Kop Kementerian BUMN */}
          <div className="pb-3 border-b-2 border-slate-800 space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-14 h-14" fill="none">
                  <circle cx="50" cy="50" r="46" fill="#FBFBFB" stroke="#DAA520" strokeWidth="2.5" />
                  <path d="M50 14 L55 28 L70 28 L58 37 L62 51 L50 42 L38 51 L42 37 L30 28 L45 28 Z" fill="#D4AF37" stroke="#8B6508" strokeWidth="0.8" />
                  <path d="M38 42 H62 V64 C62 74 50 82 50 82 C50 82 38 74 38 64 Z" fill="#B22222" stroke="#111" strokeWidth="1.2" />
                  <path d="M50 42 V82" stroke="#FFF" strokeWidth="1.5" />
                  <path d="M38 56 H62" stroke="#FFF" strokeWidth="1.5" />
                  <circle cx="50" cy="56" r="3.5" fill="#DAA520" stroke="#000" strokeWidth="0.8" />
                  <path d="M34 82 C44 86 56 86 66 82" stroke="#DAA520" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              <div className="w-14 h-10 shrink-0 flex items-center justify-center border-l-2 border-slate-200 pl-3">
                <div className="flex items-center font-black tracking-tighter text-2xl text-[#088395]">
                  <span>B</span>
                  <span>U</span>
                  <span>M</span>
                  <span>N</span>
                </div>
              </div>

              <div className="text-left pl-2">
                <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
                  KEMENTERIAN BADAN USAHA MILIK NEGARA REPUBLIK INDONESIA
                </h2>
                <p className="text-[10px] text-slate-600 font-medium leading-tight">
                  Jl. Medan Merdeka Selatan No. 13 Jakarta 10110 Indonesia
                  <br />
                  Telp. 021-29935678 | Fax. 021-29935740 | www.bumn.go.id
                </p>
              </div>
            </div>
          </div>

          {/* Judul Lampiran V.B */}
          <div className="text-left pt-2 pb-1 space-y-1">
            <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-slate-950">
              B. Bentuk Formulir Pemantauan Tindak Lanjut Rekomendasi RMI
            </h2>
            <div className="text-xs text-slate-500 italic">
              Lampiran V.B SK-8/DKU.MBU/12/2023 Halaman 190 & Contoh Halaman 192
            </div>
          </div>

          {/* Metadata Lampiran V.B (Teal Header) */}
          <div className="overflow-x-auto">
            <table className="w-full sm:w-3/5 text-xs border border-slate-400">
              <tbody>
                <tr className="border-b border-slate-300">
                  <td className="w-44 p-2 font-bold bg-[#088395] text-white border-r border-slate-300">
                    BUMN
                  </td>
                  <td className="p-2 font-bold text-slate-950 uppercase bg-white">
                    {profile.companyName}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-[#088395] text-white border-r border-slate-300">
                    Tahun
                  </td>
                  <td className="p-2 font-mono font-bold text-slate-900 bg-white">
                    {profile.year}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-[#088395] text-white border-r border-slate-300">
                    No. Laporan
                  </td>
                  <td className="p-2 font-mono font-bold text-slate-900 bg-white">
                    {profile.reportNumber}
                  </td>
                </tr>
                <tr className="border-b border-slate-300">
                  <td className="p-2 font-bold bg-[#088395] text-white border-r border-slate-300">
                    Model Penilaian RMI
                  </td>
                  <td className="p-2 font-bold text-[#088395] bg-white">
                    {modelLabel}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Status Breakdown Bar (Screen Only) */}
          <div className="print:hidden space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'S' ? 'all' : 'S')}
                className={`cursor-pointer p-2.5 rounded-xl border transition-all ${
                  selectedStatusFilter === 'S'
                    ? 'ring-2 ring-emerald-500 bg-emerald-50 border-emerald-300'
                    : 'bg-emerald-50/60 border-emerald-200/80 hover:bg-emerald-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-900">S (Sesuai)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-xl font-black font-mono text-emerald-900 mt-1">{countS}</div>
                <div className="text-[10px] text-emerald-700 font-medium">
                  {totalRecs > 0 ? Math.round((countS / totalRecs) * 100) : 0}% dari total
                </div>
              </div>

              <div
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'BS' ? 'all' : 'BS')}
                className={`cursor-pointer p-2.5 rounded-xl border transition-all ${
                  selectedStatusFilter === 'BS'
                    ? 'ring-2 ring-amber-500 bg-amber-50 border-amber-300'
                    : 'bg-amber-50/60 border-amber-200/80 hover:bg-amber-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-amber-900">BS (Belum Sesuai)</span>
                  <Clock className="w-4 h-4 text-amber-600" />
                </div>
                <div className="text-xl font-black font-mono text-amber-900 mt-1">{countBS}</div>
                <div className="text-[10px] text-amber-700 font-medium">
                  {totalRecs > 0 ? Math.round((countBS / totalRecs) * 100) : 0}% dari total
                </div>
              </div>

              <div
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'BD' ? 'all' : 'BD')}
                className={`cursor-pointer p-2.5 rounded-xl border transition-all ${
                  selectedStatusFilter === 'BD'
                    ? 'ring-2 ring-rose-500 bg-rose-50 border-rose-300'
                    : 'bg-rose-50/60 border-rose-200/80 hover:bg-rose-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-rose-900">BD (Belum TL)</span>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="text-xl font-black font-mono text-rose-900 mt-1">{countBD}</div>
                <div className="text-[10px] text-rose-700 font-medium">
                  {totalRecs > 0 ? Math.round((countBD / totalRecs) * 100) : 0}% dari total
                </div>
              </div>

              <div
                onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'TDD' ? 'all' : 'TDD')}
                className={`cursor-pointer p-2.5 rounded-xl border transition-all ${
                  selectedStatusFilter === 'TDD'
                    ? 'ring-2 ring-slate-500 bg-slate-100 border-slate-300'
                    : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-800">TDD (Tidak Dapat)</span>
                  <XCircle className="w-4 h-4 text-slate-500" />
                </div>
                <div className="text-xl font-black font-mono text-slate-900 mt-1">{countTDD}</div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {totalRecs > 0 ? Math.round((countTDD / totalRecs) * 100) : 0}% dari total
                </div>
              </div>
            </div>
          </div>

          {/* TABEL PEMANTAUAN TINDAK LANJUT REKOMENDASI RMI (Persis Kolom Hal. 190) */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-400">
              <thead className="bg-[#088395] text-white font-bold border-b border-slate-400">
                <tr>
                  <th className="p-2.5 border-r border-slate-300 w-48 text-center uppercase">
                    Dimensi
                  </th>
                  <th className="p-2.5 border-r border-slate-300 text-center uppercase">
                    Rekomendasi
                  </th>
                  <th className="p-2.5 border-r border-slate-300 text-center w-36 uppercase">
                    Target Penyelesaian
                  </th>
                  <th className="p-2.5 border-r border-slate-300 text-center w-32 uppercase">
                    Pemberi Target
                  </th>
                  <th className="p-2.5 text-center w-32 uppercase">
                    Status Tindak Lanjut
                  </th>
                </tr>
                {/* Baris Kode Kolom (e, f, g, h, i) */}
                <tr className="bg-[#066e7d] text-white/90 text-[10px] font-mono border-t border-[#0a9ab0]">
                  <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">e</th>
                  <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">f</th>
                  <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">g</th>
                  <th className="py-0.5 border-r border-slate-300/60 text-center font-normal">h</th>
                  <th className="py-0.5 text-center font-normal">i</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300 bg-white">
                {filteredRecommendations.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                      Tidak ada rekomendasi yang sesuai filter.
                    </td>
                  </tr>
                ) : (
                  filteredRecommendations.map(rec => {
                    const dimMeta = DIMENSIONS_META.find(d => d.dimNum === rec.dimNum);
                    const badge = getStatusBadge(rec.status);

                    return (
                      <tr key={rec.id} className="hover:bg-teal-50/20 transition-colors">
                        {/* Dimensi */}
                        <td className="p-2.5 align-top border-r border-slate-300 font-bold text-slate-900">
                          {dimMeta?.name || `Dimensi ${rec.dimNum}`}
                        </td>

                        {/* Rekomendasi */}
                        <td className="p-2.5 align-top border-r border-slate-300 text-slate-800 leading-relaxed font-normal">
                          {rec.rekomendasi}
                        </td>

                        {/* Target Penyelesaian (dd-mm-yyyy) */}
                        <td className="p-2.5 align-top text-center border-r border-slate-300 font-mono font-bold text-slate-900 whitespace-nowrap">
                          {formatTanggal(rec.targetDate)}
                        </td>

                        {/* Pemberi Target */}
                        <td className="p-2.5 align-top text-center border-r border-slate-300 font-semibold text-slate-800 whitespace-nowrap">
                          {rec.pemberiTarget || 'Manajemen'}
                        </td>

                        {/* Status Tindak Lanjut */}
                        <td className="p-2.5 align-top text-center font-bold">
                          {onUpdateRecommendations ? (
                            <select
                              value={rec.status}
                              onChange={e =>
                                handleQuickStatusChange(
                                  rec.id,
                                  e.target.value as 'S' | 'BS' | 'BD' | 'TDD'
                                )
                              }
                              className={`text-xs font-bold px-2 py-1 rounded border cursor-pointer ${badge.bg} print:appearance-none`}
                            >
                              <option value="S">S</option>
                              <option value="BS">BS</option>
                              <option value="BD">BD</option>
                              <option value="TDD">TDD</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${badge.bg}`}
                            >
                              {badge.label}
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

          {/* Keterangan Status Tindak Lanjut (S, BS, BD, TDD) */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-1.5 break-inside-avoid">
            <div className="font-extrabold text-slate-900 uppercase tracking-wide text-[11px]">
              Keterangan Status Tindak Lanjut (SK-8 Halaman 191):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
              <div><strong>1. S:</strong> Sesuai dengan Rekomendasi.</div>
              <div><strong>2. BS:</strong> Belum Sesuai dengan Rekomendasi.</div>
              <div><strong>3. BD:</strong> Rekomendasi Belum Ditindaklanjuti.</div>
              <div><strong>4. TDD:</strong> Rekomendasi Tidak Dapat Ditindaklanjuti.</div>
            </div>
          </div>

          {/* Footer AKHLAK */}
          <div className="pt-4 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-sans tracking-wide">
            <div className="font-medium">
              AKHLAK - Amanah, Kompeten, Harmonis, Loyal, Adaptif, Kolaboratif
            </div>
            <div className="font-mono text-slate-400 mt-1 sm:mt-0">
              Lampiran V.B • Halaman 180 / 190 SK-8/DKU.MBU/12/2023
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
