import React from 'react';
import {
  TrendingUp,
  Award,
  FileSpreadsheet,
  ArrowRight,
  ShieldCheck,
  Activity,
  HeartPulse,
  Scale,
  Sparkles,
  ChevronRight,
  FileText,
  AlertTriangle
} from 'lucide-react';
import { CompleteAssessmentData } from '../types/rmi';
import { CalculationResult } from '../utils/calculator';
import { DIMENSIONS_META } from '../data/rmiCommon';
import { RadarChart } from './RadarChart';
import { motion } from 'framer-motion';

interface DashboardProps {
  assessmentData: CompleteAssessmentData;
  calculation: CalculationResult;
  onNavigateTab: (tabId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  assessmentData,
  calculation,
  onNavigateTab
}) => {
  const { profile, performance } = assessmentData;
  const { maturityPhase } = calculation;

  return (
    <div className="space-y-4">
      {/* Hero Banner: Soft Frosted Glass with UI Kit Purple Glow */}
      <div className="glass-panel p-6 sm:p-7 relative overflow-hidden border border-white/95 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        {/* Ambient Purple Glow */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-96 h-96 bg-[#6531F7]/12 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-[#AB68FF]/15 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Info & Big Score */}
          <div className="lg:col-span-7 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-[#6531F7] text-white rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-light-default">
                {profile.model === 'umum' ? 'Industri Umum' : profile.model === 'perbankan' ? 'Industri Perbankan' : 'Industri Asuransi'}
              </span>
              <span className="px-2.5 py-0.5 bg-white/80 border border-white/90 text-slate-700 rounded-full text-[11px] font-semibold shadow-xs">
                Tahun Buku {profile.year}
              </span>
              <span className="px-2.5 py-0.5 bg-white/80 border border-white/90 text-slate-700 rounded-full text-[11px] font-semibold shadow-xs">
                No. {profile.reportNumber}
              </span>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
                {profile.companyName}
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
                Pengukuran Indeks Kematangan Risiko (Risk Maturity Index / RMI) Berbasis Kinerja BUMN
              </p>
            </div>

            {/* Score & Phase Badge with Purple Accent */}
            <div className="flex flex-wrap items-baseline gap-3.5 pt-1">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-[#6531F7] drop-shadow-xs">
                  {calculation.finalRmiScore.toFixed(2)}
                </span>
                <span className="text-lg text-slate-400 font-medium">/ 5.00</span>
              </div>

              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#6531F7] text-white font-bold text-xs shadow-light-default">
                  <Sparkles className="w-3.5 h-3.5 text-white animate-pulse" />
                  <span>{maturityPhase.subLevel}</span>
                </div>
                <div className="text-[11px] text-slate-500 pl-1 font-medium">
                  Spektrum: Skala {maturityPhase.minScore.toFixed(1)} - {maturityPhase.maxScore.toFixed(1)}
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed bg-white/70 border border-white/90 rounded-2xl p-3 shadow-xs">
              {maturityPhase.description}
            </p>

            {/* Progress Meter */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-xs text-slate-600 font-medium">
                <span>Kelengkapan Penilaian Parameter:</span>
                <span className="font-bold text-[#6531F7]">
                  {calculation.totalAssessed} / {calculation.totalParameters} ({calculation.completionPercentage}%)
                </span>
              </div>
              <div className="w-full bg-slate-200/80 rounded-full h-2.5 overflow-hidden border border-white shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${calculation.completionPercentage}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="bg-gradient-to-r from-[#AB68FF] to-[#6531F7] h-2.5 rounded-full shadow-xs"
                />
              </div>
            </div>
          </div>

          {/* Right Breakdown Grid */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
            {/* Skor Aspek Dimensi */}
            <motion.div
              whileHover={{ y: -3, scale: 1.015 }}
              className="glass-card p-3.5 space-y-1"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Skor Dimensi</span>
                <ShieldCheck className="w-4 h-4 text-[#6531F7]" />
              </div>
              <div className="text-xl font-bold tracking-tight text-slate-900">
                {calculation.dimensionAspectScore.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Rata-rata 5 Dimensi
              </div>
            </motion.div>

            {/* Penyesuaian Kinerja */}
            <motion.div
              whileHover={{ y: -3, scale: 1.015 }}
              className="glass-card p-3.5 space-y-1"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Penyesuaian</span>
                <Scale className="w-4 h-4 text-amber-500" />
              </div>
              <div className={`text-xl font-bold tracking-tight ${calculation.scoreAdjustment < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                {calculation.scoreAdjustment > 0 ? `+${calculation.scoreAdjustment.toFixed(2)}` : calculation.scoreAdjustment.toFixed(2)}
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                {calculation.isAdjustmentApplicable ? 'Penyesuaian Aktif' : 'N/A (Skor < 3.00)'}
              </div>
            </motion.div>

            {/* Tingkat Kesehatan */}
            <motion.div
              whileHover={{ y: -3, scale: 1.015 }}
              className="glass-card p-3.5 space-y-1"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Kesehatan BUMN</span>
                <HeartPulse className="w-4 h-4 text-rose-500" />
              </div>
              <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>{performance.healthRating}</span>
                <span className="text-[10px] font-normal text-slate-500">({calculation.healthConversion} pts)</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Bobot 50% = {calculation.healthWeighted}
              </div>
            </motion.div>

            {/* Peringkat Komposit */}
            <motion.div
              whileHover={{ y: -3, scale: 1.015 }}
              className="glass-card p-3.5 space-y-1"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Komposit Risiko</span>
                <Activity className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                <span>Pkt {performance.compositeRating}</span>
                <span className="text-[10px] font-normal text-slate-500">({calculation.compositeConversion} pts)</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">
                Bobot 50% = {calculation.compositeWeighted}
              </div>
            </motion.div>

            {/* Total Kinerja Quick Banner */}
            <div className="col-span-2 bg-gradient-to-r from-purple-500/10 via-white/50 to-indigo-500/10 backdrop-blur-md border border-[#6531F7]/25 rounded-2xl p-3 text-xs flex items-center justify-between shadow-2xs">
              <span className="text-slate-800 text-xs font-semibold">
                Total Skor Kinerja: <strong className="text-[#6531F7] font-bold text-sm ml-1">{calculation.totalPerformanceScore}</strong>
              </span>
              <button
                onClick={() => onNavigateTab('kinerja')}
                className="text-[#6531F7] hover:text-[#5624E3] font-bold text-xs underline flex items-center gap-0.5 cursor-pointer"
              >
                Ubah Kinerja &rarr;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Radar Chart + 5 Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Radar Chart (Left) */}
        <div className="lg:col-span-5 glass-card p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">Radar Kematangan Risiko</h3>
                <p className="text-xs text-slate-500">Profil 5 Dimensi vs Target 4.0</p>
              </div>
              <span className="p-2 bg-[#6531F7]/10 text-[#6531F7] rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>

            <div className="py-2 flex justify-center">
              <RadarChart dimensions={calculation.dimensions} targetScore={4.0} size={280} />
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-white/80 flex items-center justify-between text-xs text-slate-500">
            <span>Target: <strong>Level 4.0</strong></span>
            <button
              onClick={() => onNavigateTab('gap')}
              className="text-[#6531F7] hover:text-[#5624E3] font-bold flex items-center gap-1 cursor-pointer"
            >
              Analisis Celah &rarr;
            </button>
          </div>
        </div>

        {/* 5 Dimensions Cards (Right) */}
        <div className="lg:col-span-7 space-y-2.5">
          <div className="flex items-center justify-between pb-0.5">
            <h3 className="text-sm sm:text-base font-bold text-slate-900">Nilai Per Dimensi RMI</h3>
            <button
              onClick={() => onNavigateTab('penilaian')}
              className="text-xs font-bold text-[#6531F7] hover:text-[#5624E3] flex items-center gap-1 cursor-pointer"
            >
              Buka Lembar Penilaian <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {calculation.dimensions.map((dim, idx) => {
            const meta = DIMENSIONS_META[idx];
            const pct = dim.paramCount > 0 ? Math.round((dim.assessedCount / dim.paramCount) * 100) : 0;

            return (
              <motion.div
                key={dim.dimNum}
                whileHover={{ y: -2, scale: 1.008 }}
                whileTap={{ scale: 0.995 }}
                onClick={() => onNavigateTab('penilaian')}
                className="glass-card p-3.5 hover:border-[#6531F7]/40 hover:shadow-[0_6px_20px_rgba(101,49,247,0.1)] transition cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-3">
                    <span
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-xs shadow-xs"
                      style={{ backgroundColor: meta.color }}
                    >
                      D{dim.dimNum}
                    </span>
                    <div>
                      <h4 className="text-xs sm:text-[13px] font-bold text-slate-900 group-hover:text-[#6531F7] transition">
                        {dim.dimName}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {dim.assessedCount} dari {dim.paramCount} parameter dinilai
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-base font-black text-slate-900">
                      {dim.score > 0 ? dim.score.toFixed(2) : '-'}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Skor Dimensi</span>
                  </div>
                </div>

                <div className="w-full bg-slate-200/70 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full transition-all duration-300"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: meta.color
                    }}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick Action Navigation Grid (Matching UI Kit Card Style) */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div
          onClick={() => onNavigateTab('penilaian')}
          className="glass-card p-4 hover:border-[#6531F7]/40 hover:shadow-kit cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-xl bg-[#6531F7]/10 text-[#6531F7] flex items-center justify-center mb-2">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Lembar Penilaian</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Evaluasi kriteria rubrik Level 1 s.d. 5 dan kertas kerja bukti.
            </p>
          </div>
          <span className="text-xs font-bold text-[#6531F7] mt-3 flex items-center gap-0.5">
            Buka Penilaian <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('lampiran4')}
          className="glass-card p-4 hover:border-[#6531F7]/40 hover:shadow-kit cursor-pointer transition flex flex-col justify-between ring-1 ring-[#6531F7]/20"
        >
          <div>
            <div className="w-8 h-8 rounded-xl bg-[#6531F7] text-white flex items-center justify-center mb-2 shadow-light-default">
              <FileText className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Lampiran IV</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Kertas kerja IV.A, ringkasan IV.B, & tabel rekomendasi IV.C.
            </p>
          </div>
          <span className="text-xs font-bold text-[#6531F7] mt-3 flex items-center gap-0.5">
            Buka Lampiran IV <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('kinerja')}
          className="glass-card p-4 hover:border-[#6531F7]/40 hover:shadow-kit cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-2">
              <Scale className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Aspek Kinerja</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Input Peringkat Akhir (TK) dan Peringkat Komposit Risiko.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 mt-3 flex items-center gap-0.5">
            Atur Kinerja <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('gap')}
          className="glass-card p-4 hover:border-[#6531F7]/40 hover:shadow-kit cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-2">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Analisis Celah</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Matriks prioritas dampak vs kemudahan implementasi.
            </p>
          </div>
          <span className="text-xs font-bold text-sky-800 mt-3 flex items-center gap-0.5">
            Lihat Matriks <ChevronRight className="w-3 h-3" />
          </span>
        </div>

        <div
          onClick={() => onNavigateTab('laporan')}
          className="glass-card p-4 hover:border-[#6531F7]/40 hover:shadow-kit cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-[#6531F7] flex items-center justify-center mb-2">
              <Award className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-slate-900">Laporan Resmi</h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Formulir Lampiran V.A, ekspor Excel, & cetak PDF.
            </p>
          </div>
          <span className="text-xs font-bold text-[#6531F7] mt-3 flex items-center gap-0.5">
            Buka Laporan <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
