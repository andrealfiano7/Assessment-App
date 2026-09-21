import React from 'react';
import {
  HeartPulse,
  Activity,
  Scale,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { CompleteAssessmentData, HealthRating, CompositeRating } from '../types/rmi';
import { CalculationResult } from '../utils/calculator';
import { HEALTH_RATING_CONVERSION, COMPOSITE_RATING_CONVERSION } from '../data/rmiCommon';

interface PerformanceViewProps {
  assessmentData: CompleteAssessmentData;
  calculation: CalculationResult;
  onUpdatePerformance: (healthRating: HealthRating, compositeRating: CompositeRating) => void;
}

export const PerformanceView: React.FC<PerformanceViewProps> = ({
  assessmentData,
  calculation,
  onUpdatePerformance
}) => {
  const { performance } = assessmentData;

  const healthRatings: HealthRating[] = ['AAA', 'AA', 'A', 'BBB', 'BB', 'B', 'CCC', 'CC', 'C'];
  const compositeRatings: CompositeRating[] = [1, 2, 3, 4, 5];

  return (
    <div className="space-y-4">
      {/* Title & Status Banner */}
      <div className="glass-card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-periwinkle-100/90 text-periwinkle-600 flex items-center justify-center shadow-xs border border-periwinkle-200/60">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Penilaian Aspek Kinerja BUMN
              </h2>
              <p className="text-[11px] text-slate-500">
                Penyelarasan penerapan Manajemen Risiko dengan kinerja korporasi (Bab II Petunjuk Teknis)
              </p>
            </div>
          </div>

          <div className={`px-3.5 py-1.5 rounded-full text-xs font-bold border flex items-center gap-2 shadow-xs ${
            calculation.isAdjustmentApplicable
              ? 'bg-periwinkle-50/90 border-periwinkle-300 text-periwinkle-800'
              : 'bg-slate-100/80 border-slate-200 text-slate-500'
          }`}>
            {calculation.isAdjustmentApplicable ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-periwinkle-600" />
                <span>Penyesuaian Skor Aktif (Skor Dimensi ≥ 3.00)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Penyesuaian Tidak Berlaku (Skor Dimensi &lt; 3.00)</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Grid 2 Columns: Rating Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Component 1: Tingkat Kesehatan */}
        <div className="glass-card p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/70">
            <div className="flex items-center gap-2.5">
              <HeartPulse className="w-4 h-4 text-periwinkle-600" />
              <div>
                <h3 className="font-bold text-xs text-slate-900">
                  Tingkat Kesehatan Peringkat Akhir (Final Rating)
                </h3>
                <p className="text-[10px] text-slate-500">Bobot 50% • Sumber: Lembaga Pemeringkat</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 bg-periwinkle-100 text-periwinkle-700 text-[10px] font-bold rounded-lg border border-periwinkle-200/60">
              50%
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="grid grid-cols-3 gap-1.5">
              {healthRatings.map(rating => {
                const isSelected = performance.healthRating === rating;
                const scoreVal = HEALTH_RATING_CONVERSION[rating];
                return (
                  <button
                    key={rating}
                    onClick={() => onUpdatePerformance(rating, performance.compositeRating)}
                    className={`p-2.5 rounded-xl border text-left transition duration-150 ${
                      isSelected
                        ? 'bg-periwinkle-500 text-white border-periwinkle-400 shadow-periwinkle-glow font-bold'
                        : 'bg-white/60 border-white/80 hover:bg-white text-slate-700 hover:shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>{rating}</span>
                      <span className={`text-[10px] font-mono ${isSelected ? 'text-periwinkle-100' : 'text-slate-500'}`}>{scoreVal} pts</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80 flex items-center justify-between text-xs shadow-glass">
            <span className="text-slate-600 text-[11px]">Nilai Konversi ({calculation.healthConversion}) × 50%:</span>
            <span className="text-sm font-bold font-mono text-periwinkle-700">
              {calculation.healthWeighted.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Component 2: Peringkat Komposit Risiko */}
        <div className="glass-card p-4 space-y-3.5">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/70">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-periwinkle-600" />
              <div>
                <h3 className="font-bold text-xs text-slate-900">
                  Peringkat Komposit Risiko
                </h3>
                <p className="text-[10px] text-slate-500">Bobot 50% • Sumber: Reviu SPI</p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 bg-periwinkle-100 text-periwinkle-700 text-[10px] font-bold rounded-lg border border-periwinkle-200/60">
              50%
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="grid grid-cols-5 gap-1.5">
              {compositeRatings.map(rating => {
                const isSelected = performance.compositeRating === rating;
                const scoreVal = COMPOSITE_RATING_CONVERSION[rating];
                return (
                  <button
                    key={rating}
                    onClick={() => onUpdatePerformance(performance.healthRating, rating)}
                    className={`p-2.5 rounded-xl border text-center transition duration-150 ${
                      isSelected
                        ? 'bg-periwinkle-500 text-white border-periwinkle-400 shadow-periwinkle-glow font-bold'
                        : 'bg-white/60 border-white/80 hover:bg-white text-slate-700 hover:shadow-xs'
                    }`}
                  >
                    <div className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>Pkt {rating}</div>
                    <div className={`text-[10px] font-mono mt-0.5 ${isSelected ? 'text-periwinkle-100' : 'text-slate-500'}`}>{scoreVal} pts</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/80 flex items-center justify-between text-xs shadow-glass">
            <span className="text-slate-600 text-[11px]">Nilai Konversi ({calculation.compositeConversion}) × 50%:</span>
            <span className="text-sm font-bold font-mono text-periwinkle-700">
              {calculation.compositeWeighted.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Summary Matrix Card (Tabel 4) */}
      <div className="glass-card p-4 space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 className="text-xs font-bold text-slate-900">
            Kalkulasi & Matriks Penyesuaian Skor (Tabel 4 Petunjuk Teknis)
          </h3>
          <span className="text-[11px] text-slate-500">
            Rumus: Skor Akhir RMI = Skor Dimensi + Penyesuaian Skor
          </span>
        </div>

        {/* 4 Score Summary Blocks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-2xl bg-white/60 border border-white/80 shadow-glass space-y-1">
            <div className="text-[10px] text-slate-500">Skor Aspek Dimensi</div>
            <div className="text-lg font-black font-mono text-slate-900">
              {calculation.dimensionAspectScore.toFixed(2)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/60 border border-white/80 shadow-glass space-y-1">
            <div className="text-[10px] text-slate-500">Total Skor Kinerja</div>
            <div className="text-lg font-black font-mono text-periwinkle-600">
              {calculation.totalPerformanceScore.toFixed(2)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/60 border border-white/80 shadow-glass space-y-1">
            <div className="text-[10px] text-slate-500">Penyesuaian Skor</div>
            <div className="text-lg font-black font-mono text-slate-900">
              {calculation.scoreAdjustment > 0 ? `+${calculation.scoreAdjustment.toFixed(2)}` : calculation.scoreAdjustment.toFixed(2)}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-gradient-to-br from-periwinkle-500 to-periwinkle-600 text-white border border-periwinkle-400 shadow-periwinkle-glow space-y-1">
            <div className="text-[10px] text-periwinkle-100">Skor Akhir RMI</div>
            <div className="text-lg font-black font-mono text-white">
              {calculation.finalRmiScore.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Compact Table 4 */}
        <div className="overflow-x-auto pt-1">
          <table className="w-full text-[11px] text-left border border-white/80 rounded-2xl overflow-hidden bg-white/40 shadow-glass">
            <thead className="bg-white/60 text-slate-700 font-bold border-b border-white/80">
              <tr>
                <th className="p-2.5">Rentang Total Skor Kinerja</th>
                <th className="p-2.5">Penyesuaian Skor</th>
                <th className="p-2.5">Status Saat Ini</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {[
                { range: '≤ 50', adj: '-1,00', match: calculation.isAdjustmentApplicable && calculation.totalPerformanceScore <= 50 },
                { range: '50 < x ≤ 65', adj: '-0,75', match: calculation.isAdjustmentApplicable && calculation.totalPerformanceScore > 50 && calculation.totalPerformanceScore <= 65 },
                { range: '65 < x ≤ 80', adj: '-0,50', match: calculation.isAdjustmentApplicable && calculation.totalPerformanceScore > 65 && calculation.totalPerformanceScore <= 80 },
                { range: '80 < x ≤ 90', adj: '-0,25', match: calculation.isAdjustmentApplicable && calculation.totalPerformanceScore > 80 && calculation.totalPerformanceScore <= 90 },
                { range: '> 90', adj: '0,00', match: calculation.isAdjustmentApplicable && calculation.totalPerformanceScore > 90 }
              ].map((row, i) => (
                <tr
                  key={i}
                  className={row.match ? 'bg-periwinkle-50/90 font-bold text-slate-900' : 'hover:bg-white/50 text-slate-700 transition'}
                >
                  <td className="p-2.5">{row.range}</td>
                  <td className="p-2.5 font-mono">{row.adj}</td>
                  <td className="p-2.5">
                    {row.match ? (
                      <span className="text-periwinkle-700 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-periwinkle-500" /> Posisi Kinerja BUMN
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
