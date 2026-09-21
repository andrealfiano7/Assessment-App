import React from 'react';
import {
  ListChecks,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { CompleteAssessmentData, RecommendationItem } from '../types/rmi';
import { STATUS_TINDAK_LANJUT_MAP, DIMENSIONS_META } from '../data/rmiCommon';

interface FollowUpMonitoringProps {
  assessmentData: CompleteAssessmentData;
  onUpdateRecommendations: (recommendations: RecommendationItem[]) => void;
}

export const FollowUpMonitoring: React.FC<FollowUpMonitoringProps> = ({
  assessmentData,
  onUpdateRecommendations
}) => {
  const recommendations = assessmentData.recommendations || [];

  const handleUpdateStatus = (id: string, newStatus: 'S' | 'BS' | 'BD' | 'TDD') => {
    const updated = recommendations.map(r => {
      if (r.id === id) {
        return { ...r, status: newStatus };
      }
      return r;
    });
    onUpdateRecommendations(updated);
  };

  const handleUpdateField = (id: string, field: keyof RecommendationItem, value: any) => {
    const updated = recommendations.map(r => {
      if (r.id === id) {
        return { ...r, [field]: value };
      }
      return r;
    });
    onUpdateRecommendations(updated);
  };

  const total = recommendations.length;
  const countS = recommendations.filter(r => r.status === 'S').length;
  const countBS = recommendations.filter(r => r.status === 'BS').length;
  const countBD = recommendations.filter(r => r.status === 'BD').length;
  const countTDD = recommendations.filter(r => r.status === 'TDD').length;
  const completionRate = total > 0 ? Math.round((countS / total) * 100) : 0;

  return (
    <div className="space-y-3 flex flex-col max-h-[calc(100vh-140px)]">
      {/* Header & Status Bar */}
      <div className="glass-card p-3.5 shrink-0 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-periwinkle-100/90 text-periwinkle-600 flex items-center justify-center shadow-xs border border-periwinkle-200/60">
              <ListChecks className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Pemantauan Tindak Lanjut Rekomendasi RMI (Lampiran V.B)
              </h2>
              <p className="text-[11px] text-slate-500">
                Monitoring pelaksanaan tindak lanjut triwulanan atas hasil asesmen RMI
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-sm border border-white/80 px-3.5 py-1.5 rounded-xl shadow-glass shrink-0">
            <span className="text-[11px] text-slate-600 font-semibold">Tingkat Capaian (S):</span>
            <span className="font-mono font-bold text-xs text-periwinkle-700">
              {completionRate}% ({countS}/{total})
            </span>
          </div>
        </div>

        {/* 4 Status Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
          <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between shadow-glass">
            <span className="text-[10px] font-bold text-emerald-800">S (Sesuai)</span>
            <span className="text-sm font-black font-mono text-emerald-900">{countS}</span>
          </div>
          <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between shadow-glass">
            <span className="text-[10px] font-bold text-amber-800">BS (Belum Sesuai)</span>
            <span className="text-sm font-black font-mono text-amber-900">{countBS}</span>
          </div>
          <div className="p-2.5 bg-rose-50/70 border border-rose-200/80 rounded-xl flex items-center justify-between shadow-glass">
            <span className="text-[10px] font-bold text-rose-800">BD (Belum TL)</span>
            <span className="text-sm font-black font-mono text-rose-900">{countBD}</span>
          </div>
          <div className="p-2.5 bg-slate-100/80 border border-slate-200/80 rounded-xl flex items-center justify-between shadow-glass">
            <span className="text-[10px] font-bold text-slate-700">TDD (Tidak Dapat TL)</span>
            <span className="text-sm font-black font-mono text-slate-800">{countTDD}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Monitoring Table */}
      <div className="glass-card overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-y-auto flex-1 no-scrollbar">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/70 backdrop-blur-md text-slate-700 font-bold border-b border-white/80 sticky top-0 z-10">
              <tr>
                <th className="p-3 w-10 text-center">No</th>
                <th className="p-3 w-40">Dimensi</th>
                <th className="p-3">Rekomendasi</th>
                <th className="p-3 w-32">Target Tanggal</th>
                <th className="p-3 w-32">Pemberi Target</th>
                <th className="p-3 w-36 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {recommendations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    Belum ada butir rekomendasi. Anda dapat menambahkannya pada tab <strong>Celah & Prioritas</strong>.
                  </td>
                </tr>
              ) : (
                recommendations.map((rec, idx) => {
                  const dimMeta = DIMENSIONS_META.find(d => d.dimNum === rec.dimNum);
                  const statusInfo = STATUS_TINDAK_LANJUT_MAP[rec.status];

                  return (
                    <tr key={rec.id} className="hover:bg-white/50 transition">
                      <td className="p-2.5 text-center font-bold text-slate-400 font-mono">
                        {idx + 1}
                      </td>
                      <td className="p-2.5">
                        <span className="font-bold text-slate-900 block text-[11px]">
                          Dimensi {rec.dimNum}
                        </span>
                        <span className="text-[10px] text-slate-500 truncate block">
                          {dimMeta?.name}
                        </span>
                      </td>
                      <td className="p-2.5">
                        <div className="font-medium text-slate-800 leading-snug">
                          {rec.rekomendasi}
                        </div>
                      </td>
                      <td className="p-2.5">
                        <input
                          type="date"
                          value={rec.targetDate || '2024-11-30'}
                          onChange={e => handleUpdateField(rec.id, 'targetDate', e.target.value)}
                          className="glass-input w-full text-xs px-2 py-1 font-mono"
                        />
                      </td>
                      <td className="p-2.5">
                        <input
                          type="text"
                          value={rec.pemberiTarget || 'Manajemen'}
                          onChange={e => handleUpdateField(rec.id, 'pemberiTarget', e.target.value)}
                          className="glass-input w-full text-xs px-2 py-1"
                        />
                      </td>
                      <td className="p-2.5 text-center">
                        <select
                          value={rec.status}
                          onChange={e => handleUpdateStatus(rec.id, e.target.value as any)}
                          className={`text-xs font-bold rounded-xl border px-2.5 py-1 focus:outline-none focus:ring-1 focus:ring-periwinkle-400 shadow-xs ${statusInfo.color}`}
                        >
                          <option value="S">S - Sesuai</option>
                          <option value="BS">BS - Belum Sesuai</option>
                          <option value="BD">BD - Belum TL</option>
                          <option value="TDD">TDD - Tidak Dapat</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
