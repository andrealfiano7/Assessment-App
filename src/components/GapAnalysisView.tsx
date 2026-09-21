import React, { useState } from 'react';
import {
  Target,
  Plus,
  Trash2,
  CheckCircle2,
  X
} from 'lucide-react';
import { CompleteAssessmentData, RecommendationItem } from '../types/rmi';
import { CalculationResult, computeRecommendationPriority } from '../utils/calculator';
import { DIMENSIONS_META } from '../data/rmiCommon';

interface GapAnalysisViewProps {
  assessmentData: CompleteAssessmentData;
  calculation: CalculationResult;
  onUpdateRecommendations: (recommendations: RecommendationItem[]) => void;
}

export const GapAnalysisView: React.FC<GapAnalysisViewProps> = ({
  assessmentData,
  calculation,
  onUpdateRecommendations
}) => {
  const [targetScore, setTargetScore] = useState<number>(4.0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Recommendation Form State
  const [formDimNum, setFormDimNum] = useState<number>(1);
  const [formRekomendasi, setFormRekomendasi] = useState('');
  const [formImpact, setFormImpact] = useState<'Tinggi' | 'Rendah'>('Tinggi');
  const [formEase, setFormEase] = useState<'Mudah' | 'Sulit'>('Mudah');
  const [formTimeframe, setFormTimeframe] = useState<'Jangka Pendek' | 'Jangka Panjang'>('Jangka Pendek');
  const [formAktivitas, setFormAktivitas] = useState('');
  const [formOutput, setFormOutput] = useState('');
  const [formIndikator, setFormIndikator] = useState('');
  const [formUic, setFormUic] = useState('');
  const [formTargetDate, setFormTargetDate] = useState('2024-11-30');
  const [formPemberiTarget, setFormPemberiTarget] = useState('Manajemen');

  const recommendations = assessmentData.recommendations || [];

  const handleAddRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRekomendasi.trim()) {
      alert('Deskripsi rekomendasi wajib diisi.');
      return;
    }

    const priority = computeRecommendationPriority(formImpact, formEase);

    const newItem: RecommendationItem = {
      id: `rec-${Date.now()}`,
      dimNum: formDimNum,
      rekomendasi: formRekomendasi,
      impact: formImpact,
      ease: formEase,
      priority,
      timeframe: formTimeframe,
      aktivitasUtama: formAktivitas,
      output: formOutput,
      indikatorKeberhasilan: formIndikator,
      uic: formUic,
      targetDate: formTargetDate,
      status: 'BD',
      pemberiTarget: formPemberiTarget
    };

    onUpdateRecommendations([...recommendations, newItem]);
    setIsAddModalOpen(false);

    setFormRekomendasi('');
    setFormAktivitas('');
    setFormOutput('');
    setFormIndikator('');
    setFormUic('');
  };

  const handleDeleteRecommendation = (id: string) => {
    if (confirm('Hapus butir rekomendasi ini?')) {
      onUpdateRecommendations(recommendations.filter(r => r.id !== id));
    }
  };

  return (
    <div className="space-y-4">
      {/* Title & Target Bar */}
      <div className="glass-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-periwinkle-100/90 text-periwinkle-600 flex items-center justify-center shadow-xs border border-periwinkle-200/60">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Analisis Kesenjangan (Gap) & Matriks Prioritas Rekomendasi
            </h2>
            <p className="text-[11px] text-slate-500">
              Pemetaan celah kematangan risiko dan prioritas inisiatif (Lampiran IV.C Juknis KBUMN)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/80 px-3 py-1.5 rounded-xl shadow-glass text-xs">
            <span className="text-slate-600 font-medium text-[11px]">Target Acuan:</span>
            <select
              value={targetScore}
              onChange={e => setTargetScore(parseFloat(e.target.value))}
              className="font-bold text-slate-900 border border-slate-200 rounded-lg px-2 py-0.5 bg-white text-xs focus:ring-1 focus:ring-periwinkle-400"
            >
              <option value="3.5">Level 3.5 (Praktik Baik +)</option>
              <option value="4.0">Level 4.0 (Praktik Lebih Baik)</option>
              <option value="4.5">Level 4.5 (Praktik Lebih Baik +)</option>
              <option value="5.0">Level 5.0 (Praktik Terbaik)</option>
            </select>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="glass-btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah</span>
          </button>
        </div>
      </div>

      {/* Compact Gap Table */}
      <div className="glass-card overflow-hidden">
        <div className="p-3 bg-white/40 border-b border-white/70 flex items-center justify-between text-xs backdrop-blur-sm">
          <span className="font-bold text-slate-900">
            Analisa Celah (Gap) Tiap Dimensi vs Target {targetScore.toFixed(1)}
          </span>
          <span className="text-[11px] text-slate-500">
            Celah = Target Skor - Skor Aktual
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/60 text-slate-700 font-bold border-b border-white/80">
              <tr>
                <th className="p-2.5 w-12 text-center">No</th>
                <th className="p-2.5">Dimensi Penilaian RMI</th>
                <th className="p-2.5 text-center w-24">Skor Aktual</th>
                <th className="p-2.5 text-center w-20">Target</th>
                <th className="p-2.5 text-center w-24">Celah (Gap)</th>
                <th className="p-2.5 w-48">Status Capaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {calculation.dimensions.map((dim) => {
                const gap = Number(Math.max(0, targetScore - dim.score).toFixed(2));
                const isMet = dim.score >= targetScore;

                return (
                  <tr key={dim.dimNum} className="hover:bg-white/50 transition">
                    <td className="p-2.5 text-center font-bold text-slate-400 font-mono">
                      D{dim.dimNum}
                    </td>
                    <td className="p-2.5 font-semibold text-slate-900">
                      {dim.dimName}
                    </td>
                    <td className="p-2.5 text-center font-mono font-bold text-periwinkle-700">
                      {dim.score.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center font-mono text-slate-600">
                      {targetScore.toFixed(2)}
                    </td>
                    <td className="p-2.5 text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-full font-mono font-bold text-[11px] ${
                        isMet
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : gap > 1.0
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-periwinkle-50 text-periwinkle-800 border border-periwinkle-200'
                      }`}>
                        {isMet ? 'Tercapai' : `-${gap.toFixed(2)}`}
                      </span>
                    </td>
                    <td className="p-2.5">
                      {isMet ? (
                        <span className="text-emerald-700 font-semibold flex items-center gap-1 text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Memenuhi Target
                        </span>
                      ) : (
                        <span className="text-amber-800 text-[11px] font-medium">
                          Perlu Rekomendasi Perbaikan
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Quadrants Matrix */}
      <div className="glass-card p-4 space-y-3.5">
        <div>
          <h3 className="font-bold text-xs text-slate-900">
            Matriks Prioritas Rekomendasi (Dampak vs Kemudahan)
          </h3>
          <p className="text-[10px] text-slate-500">
            Klasifikasi prioritas inisiatif pemenuhan maturitas risiko (Juknis Bab II Hal 21)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Prioritas 1: Dampak Tinggi & Mudah */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-glass">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black shadow-xs">
                PRIORITAS 1 (Utama)
              </span>
              <span className="text-[11px] font-bold text-amber-950">
                Dampak TINGGI • MUDAH
              </span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {recommendations.filter(r => r.priority === 1).map(r => (
                <div key={r.id} className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl border border-white/90 text-xs shadow-glass flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-amber-700 mr-1.5">[D{r.dimNum}]</span>
                    <span className="text-slate-800">{r.rekomendasi}</span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Target: {r.targetDate} • PIC: {r.uic || '-'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteRecommendation(r.id)}
                    className="text-slate-300 hover:text-red-600 p-1 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {recommendations.filter(r => r.priority === 1).length === 0 && (
                <div className="text-center py-4 text-xs text-amber-800/50 italic">
                  Belum ada rekomendasi Prioritas 1
                </div>
              )}
            </div>
          </div>

          {/* Prioritas 2: Dampak Tinggi & Sulit */}
          <div className="bg-periwinkle-50/60 border border-periwinkle-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-glass">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-periwinkle-500 text-white text-[10px] font-bold shadow-xs">
                PRIORITAS 2 (Strategis)
              </span>
              <span className="text-[11px] font-bold text-periwinkle-950">
                Dampak TINGGI • SULIT
              </span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {recommendations.filter(r => r.priority === 2 && r.impact === 'Tinggi').map(r => (
                <div key={r.id} className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl border border-white/90 text-xs shadow-glass flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-periwinkle-700 mr-1.5">[D{r.dimNum}]</span>
                    <span className="text-slate-800">{r.rekomendasi}</span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Target: {r.targetDate} • PIC: {r.uic || '-'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteRecommendation(r.id)}
                    className="text-slate-300 hover:text-red-600 p-1 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {recommendations.filter(r => r.priority === 2 && r.impact === 'Tinggi').length === 0 && (
                <div className="text-center py-4 text-xs text-periwinkle-700/50 italic">
                  Belum ada rekomendasi Dampak Tinggi & Sulit
                </div>
              )}
            </div>
          </div>

          {/* Prioritas 2: Dampak Rendah & Mudah */}
          <div className="bg-indigo-50/60 border border-indigo-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-glass">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold shadow-xs">
                PRIORITAS 2 (Taktis)
              </span>
              <span className="text-[11px] font-bold text-indigo-950">
                Dampak RENDAH • MUDAH
              </span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {recommendations.filter(r => r.priority === 2 && r.impact === 'Rendah').map(r => (
                <div key={r.id} className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl border border-white/90 text-xs shadow-glass flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-indigo-700 mr-1.5">[D{r.dimNum}]</span>
                    <span className="text-slate-800">{r.rekomendasi}</span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Target: {r.targetDate} • PIC: {r.uic || '-'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteRecommendation(r.id)}
                    className="text-slate-300 hover:text-red-600 p-1 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {recommendations.filter(r => r.priority === 2 && r.impact === 'Rendah').length === 0 && (
                <div className="text-center py-4 text-xs text-indigo-700/50 italic">
                  Belum ada rekomendasi Dampak Rendah & Mudah
                </div>
              )}
            </div>
          </div>

          {/* Prioritas 3: Dampak Rendah & Sulit */}
          <div className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-glass">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-500 text-white text-[10px] font-bold shadow-xs">
                PRIORITAS 3 (Rendah)
              </span>
              <span className="text-[11px] font-bold text-slate-700">
                Dampak RENDAH • SULIT
              </span>
            </div>
            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {recommendations.filter(r => r.priority === 3).map(r => (
                <div key={r.id} className="p-2.5 bg-white/80 backdrop-blur-sm rounded-xl border border-white/90 text-xs shadow-glass flex items-start justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-600 mr-1.5">[D{r.dimNum}]</span>
                    <span className="text-slate-800">{r.rekomendasi}</span>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Target: {r.targetDate} • PIC: {r.uic || '-'}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteRecommendation(r.id)}
                    className="text-slate-300 hover:text-red-600 p-1 transition"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              {recommendations.filter(r => r.priority === 3).length === 0 && (
                <div className="text-center py-4 text-xs text-slate-400 italic">
                  Belum ada rekomendasi Prioritas 3
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 shadow-2xl space-y-4 rounded-3xl border border-white/85 bg-white/90">
            <div className="flex items-center justify-between pb-3 border-b border-white/70">
              <h3 className="font-bold text-sm text-slate-900">
                Tambah Rekomendasi Perbaikan
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddRecommendation} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Dimensi Terkait
                </label>
                <select
                  value={formDimNum}
                  onChange={e => setFormDimNum(parseInt(e.target.value))}
                  className="glass-input w-full p-2"
                >
                  {DIMENSIONS_META.map(d => (
                    <option key={d.dimNum} value={d.dimNum}>
                      Dimensi {d.dimNum}: {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Deskripsi Rekomendasi *
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Rekomendasi perbaikan..."
                  value={formRekomendasi}
                  onChange={e => setFormRekomendasi(e.target.value)}
                  className="glass-input w-full p-2.5 resize-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Dampak</label>
                  <select
                    value={formImpact}
                    onChange={e => setFormImpact(e.target.value as any)}
                    className="glass-input w-full p-2"
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Kemudahan</label>
                  <select
                    value={formEase}
                    onChange={e => setFormEase(e.target.value as any)}
                    className="glass-input w-full p-2"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Jangka</label>
                  <select
                    value={formTimeframe}
                    onChange={e => setFormTimeframe(e.target.value as any)}
                    className="glass-input w-full p-2"
                  >
                    <option value="Jangka Pendek">&lt; 1 Thn</option>
                    <option value="Jangka Panjang">&gt; 1 Thn</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit In Charge (UIC)</label>
                  <input
                    type="text"
                    placeholder="Divisi Risk..."
                    value={formUic}
                    onChange={e => setFormUic(e.target.value)}
                    className="glass-input w-full p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Target Tanggal</label>
                  <input
                    type="date"
                    value={formTargetDate}
                    onChange={e => setFormTargetDate(e.target.value)}
                    className="glass-input w-full p-2"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-3 border-t border-white/70">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="glass-btn px-4 py-2 text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="glass-btn-primary px-5 py-2 font-bold rounded-xl"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
