import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  Download,
  Filter,
  Search,
  CheckCircle2,
  AlertCircle,
  Clock,
  Calendar,
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  X,
  Save,
  FileText,
  Quote,
  FolderOpen,
  LayoutGrid,
  Table as TableIcon,
  Tag,
  Building2,
  CheckSquare,
  ArrowRight,
  ChevronRight,
  Award
} from 'lucide-react';
import {
  CompleteAssessmentData,
  RmiParameter,
  RecommendationItem,
  ParameterAssessment,
  DimensionSummaryDetail
} from '../types/rmi';
import { CalculationResult } from '../utils/calculator';
import { exportLampiranIvToCsv } from '../utils/exportHelper';

interface LampiranIvViewProps {
  assessmentData: CompleteAssessmentData;
  parameters: RmiParameter[];
  calculation: CalculationResult;
  onUpdateAssessment: (paramId: number, update: Partial<ParameterAssessment>) => void;
  onUpdateRecommendations: (recommendations: RecommendationItem[]) => void;
  onUpdateDimensionSummary?: (dimNum: number, summary: DimensionSummaryDetail) => void;
  onNavigateToParam?: (paramId: number) => void;
}

export function LampiranIvView({
  assessmentData,
  parameters,
  calculation,
  onUpdateAssessment,
  onUpdateRecommendations,
  onUpdateDimensionSummary,
  onNavigateToParam
}: LampiranIvViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'iva' | 'ivb' | 'ivc'>('iva');

  // Sub-tab IV.A: View mode (cards vs table)
  const [viewModeIva, setViewModeIva] = useState<'cards' | 'table'>('cards');
  const [selectedDim, setSelectedDim] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCompleteness, setFilterCompleteness] = useState<'all' | 'complete' | 'incomplete'>('all');

  // Sub-tab IV.C: View mode (cards vs table)
  const [viewModeIvc, setViewModeIvc] = useState<'cards' | 'table'>('cards');
  const [filterPriority, setFilterPriority] = useState<number | 'all'>('all');
  const [filterTimeframe, setFilterTimeframe] = useState<string>('all');

  // Edit Workpaper Modal (IV.A)
  const [editingParam, setEditingParam] = useState<RmiParameter | null>(null);
  const [workpaperForm, setWorkpaperForm] = useState<{
    findings: string;
    evidence: string;
    dataSource: string;
  }>({ findings: '', evidence: '', dataSource: '' });

  // Edit Dimension Summary Modal (IV.B)
  const [editingDimSummary, setEditingDimSummary] = useState<DimensionSummaryDetail | null>(null);

  // Edit / Add Recommendation Modal (IV.C)
  const [isRecModalOpen, setIsRecModalOpen] = useState(false);
  const [recEditingId, setRecEditingId] = useState<string | null>(null);
  const [recForm, setRecForm] = useState<Partial<RecommendationItem>>({
    dimNum: 1,
    paramId: undefined,
    rekomendasi: '',
    impact: 'Tinggi',
    ease: 'Mudah',
    priority: 1,
    timeframe: 'Jangka Pendek',
    aktivitasUtama: '',
    output: '',
    indikatorKeberhasilan: '',
    uic: '',
    targetDate: new Date().toISOString().split('T')[0],
    status: 'BS',
    pemberiTarget: 'Manajemen'
  });

  // Filtered parameters for IV.A
  const filteredParams = useMemo(() => {
    return parameters.filter(p => {
      if (selectedDim !== 'all' && p.dim_num !== selectedDim) return false;
      const a = assessmentData.assessments[p.id];
      const hasWorkpaper = Boolean(a?.findings || a?.evidence || a?.dataSource);
      if (filterCompleteness === 'complete' && !hasWorkpaper) return false;
      if (filterCompleteness === 'incomplete' && hasWorkpaper) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inTitle = p.title.toLowerCase().includes(q);
        const inSubdim = p.subdim.toLowerCase().includes(q);
        const inFindings = (a?.findings || '').toLowerCase().includes(q);
        const inEvidence = (a?.evidence || '').toLowerCase().includes(q);
        if (!inTitle && !inSubdim && !inFindings && !inEvidence) return false;
      }
      return true;
    });
  }, [parameters, selectedDim, filterCompleteness, searchQuery, assessmentData.assessments]);

  // Stats for IV.A
  const workpaperStats = useMemo(() => {
    let completed = 0;
    parameters.forEach(p => {
      const a = assessmentData.assessments[p.id];
      if (a?.findings && a?.evidence && a?.dataSource) {
        completed++;
      }
    });
    return {
      total: parameters.length,
      completed,
      pending: parameters.length - completed,
      percentage: Math.round((completed / (parameters.length || 1)) * 100)
    };
  }, [parameters, assessmentData.assessments]);

  // Filtered recommendations for IV.C
  const filteredRecommendations = useMemo(() => {
    return assessmentData.recommendations.filter(r => {
      if (filterPriority !== 'all' && r.priority !== filterPriority) return false;
      if (filterTimeframe !== 'all' && r.timeframe !== filterTimeframe) return false;
      return true;
    });
  }, [assessmentData.recommendations, filterPriority, filterTimeframe]);

  // Open Edit Workpaper
  const handleOpenEditWorkpaper = (param: RmiParameter) => {
    const a = assessmentData.assessments[param.id];
    setEditingParam(param);
    setWorkpaperForm({
      findings: a?.findings || '',
      evidence: a?.evidence || '',
      dataSource: a?.dataSource || ''
    });
  };

  const handleSaveWorkpaper = () => {
    if (!editingParam) return;
    onUpdateAssessment(editingParam.id, {
      findings: workpaperForm.findings,
      evidence: workpaperForm.evidence,
      dataSource: workpaperForm.dataSource
    });
    setEditingParam(null);
  };

  // Save Dimension Summary
  const handleSaveDimSummary = () => {
    if (!editingDimSummary || !onUpdateDimensionSummary) return;
    onUpdateDimensionSummary(editingDimSummary.dimNum, editingDimSummary);
    setEditingDimSummary(null);
  };

  // Save Recommendation
  const handleSaveRecommendation = () => {
    if (!recForm.rekomendasi?.trim()) return;

    let autoPriority: 1 | 2 | 3 = 2;
    if (recForm.impact === 'Tinggi' && recForm.ease === 'Mudah') {
      autoPriority = 1;
    } else if (recForm.impact === 'Rendah' && recForm.ease === 'Sulit') {
      autoPriority = 3;
    } else {
      autoPriority = 2;
    }

    const newRecItem: RecommendationItem = {
      id: recEditingId || `rec-${Date.now()}`,
      dimNum: Number(recForm.dimNum) || 1,
      paramId: recForm.paramId ? Number(recForm.paramId) : undefined,
      rekomendasi: recForm.rekomendasi || '',
      impact: recForm.impact || 'Tinggi',
      ease: recForm.ease || 'Mudah',
      priority: autoPriority,
      timeframe: recForm.timeframe || 'Jangka Pendek',
      aktivitasUtama: recForm.aktivitasUtama || '',
      output: recForm.output || '',
      indikatorKeberhasilan: recForm.indikatorKeberhasilan || '',
      uic: recForm.uic || '',
      targetDate: recForm.targetDate || new Date().toISOString().split('T')[0],
      status: recForm.status || 'BS',
      pemberiTarget: recForm.pemberiTarget || 'Manajemen'
    };

    if (recEditingId) {
      onUpdateRecommendations(
        assessmentData.recommendations.map(r => (r.id === recEditingId ? newRecItem : r))
      );
    } else {
      onUpdateRecommendations([...assessmentData.recommendations, newRecItem]);
    }

    setIsRecModalOpen(false);
    setRecEditingId(null);
  };

  const handleDeleteRecommendation = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus rekomendasi ini?')) {
      onUpdateRecommendations(assessmentData.recommendations.filter(r => r.id !== id));
    }
  };

  const handleEditRecommendation = (item: RecommendationItem) => {
    setRecEditingId(item.id);
    setRecForm({ ...item });
    setIsRecModalOpen(true);
  };

  const handleAddNewRecommendation = () => {
    setRecEditingId(null);
    setRecForm({
      dimNum: 1,
      paramId: undefined,
      rekomendasi: '',
      impact: 'Tinggi',
      ease: 'Mudah',
      priority: 1,
      timeframe: 'Jangka Pendek',
      aktivitasUtama: '',
      output: '',
      indikatorKeberhasilan: '',
      uic: '',
      targetDate: new Date().toISOString().split('T')[0],
      status: 'BS',
      pemberiTarget: 'Manajemen'
    });
    setIsRecModalOpen(true);
  };

  return (
    <div className="space-y-5 pb-10">
      {/* 1. Header Banner Lampiran IV (Soft Frosted Glass with UI Kit Styling) */}
      <div className="glass-card p-6 sm:p-7 relative overflow-hidden border border-white/90 shadow-glass-default rounded-3xl">
        {/* Subtle Purple Glow */}
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-[#6531F7]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-[#6531F7] border border-[#6531F7]/20 text-[11px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#6531F7]" />
              Format Resmi SK-8/DKU.MBU/12/2023 & UND-55/DKU.MBU/12/2023
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6531F7] text-white flex items-center justify-center shadow-light-default shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              LAMPIRAN IV: Lembar Penilaian Indeks Kematangan Risiko (RMI)
            </h1>
            <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed font-medium">
              Mencakup kertas kerja evaluasi dokumen & wawancara (<strong>IV.A</strong>), ringkasan kekuatan & celah dimensi (<strong>IV.B</strong>), serta format baku rekomendasi 9 kolom dan prioritisasi inisiatif (<strong>IV.C</strong>).
            </p>
          </div>

          <div className="shrink-0 self-start md:self-center">
            <button
              onClick={() => exportLampiranIvToCsv(assessmentData, calculation)}
              className="glass-btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold shadow-light-default rounded-xl"
            >
              <Download className="w-4 h-4" />
              Ekspor Lampiran IV (.CSV)
            </button>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Switcher (Segmented Glass Pill Bar - Clean Floating Design) */}
      <div className="glass-card p-1.5 rounded-2xl border border-white/80 shadow-light-default bg-white/70 backdrop-blur-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1.5">
          <button
            onClick={() => setActiveSubTab('iva')}
            className={`flex items-center justify-center gap-3 py-3 px-4 rounded-xl transition cursor-pointer ${
              activeSubTab === 'iva'
                ? 'bg-white text-slate-950 shadow-light-default border border-white/95 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 tracking-tight ${
              activeSubTab === 'iva' ? 'bg-[#6531F7] text-white shadow-light-default' : 'bg-slate-100 text-slate-600 border border-slate-200/60'
            }`}>
              IV.A
            </div>
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-bold leading-tight">Lembar Penilaian & Kertas Kerja</span>
              <span className="text-[11px] block font-normal text-slate-400 mt-0.5">
                Kajian Dokumen & Wawancara (Kolom A-D)
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveSubTab('ivb')}
            className={`flex items-center justify-center gap-3 py-3 px-4 rounded-xl transition cursor-pointer ${
              activeSubTab === 'ivb'
                ? 'bg-white text-slate-950 shadow-light-default border border-white/95 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 tracking-tight ${
              activeSubTab === 'ivb' ? 'bg-[#6531F7] text-white shadow-light-default' : 'bg-slate-100 text-slate-600 border border-slate-200/60'
            }`}>
              IV.B
            </div>
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-bold leading-tight">Ringkasan Aspek Dimensi</span>
              <span className="text-[11px] block font-normal text-slate-400 mt-0.5">
                Kekuatan (Strengths) & Celah (Gaps) 5 Dimensi
              </span>
            </div>
          </button>

          <button
            onClick={() => setActiveSubTab('ivc')}
            className={`flex items-center justify-center gap-3 py-3 px-4 rounded-xl transition cursor-pointer ${
              activeSubTab === 'ivc'
                ? 'bg-white text-slate-950 shadow-light-default border border-white/95 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 font-medium'
            }`}
          >
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 tracking-tight ${
              activeSubTab === 'ivc' ? 'bg-[#6531F7] text-white shadow-light-default' : 'bg-slate-100 text-slate-600 border border-slate-200/60'
            }`}>
              IV.C
            </div>
            <div className="text-left">
              <span className="block text-xs sm:text-sm font-bold leading-tight">Tabel Rekomendasi 9 Kolom</span>
              <span className="text-[11px] block font-normal text-slate-400 mt-0.5">
                Format Baku Juknis & Matriks Prioritas I-III
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB IV.A: LEMBAR PENILAIAN & KERTAS KERJA                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'iva' && (
        <div className="space-y-4">
          {/* Summary KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: Total Parameter */}
            <div className="glass-card p-5 sm:p-6 flex items-center justify-between border border-white/90 shadow-glass-default hover:shadow-glass-hover transition-all">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">Total Parameter</span>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 block">
                  {workpaperStats.total}
                </span>
                <span className="text-[11px] font-medium text-slate-400 block">Model Sektor Terpilih</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#6531F7]/10 text-[#6531F7] flex items-center justify-center shrink-0 shadow-2xs">
                <FileText className="w-5 h-5" />
              </div>
            </div>

            {/* Card 2: Kertas Kerja Lengkap */}
            <div className="glass-card p-5 sm:p-6 flex items-center justify-between border border-white/90 shadow-glass-default hover:shadow-glass-hover transition-all">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">Kertas Kerja Lengkap</span>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600 block">
                  {workpaperStats.completed}
                </span>
                <span className="text-[11px] font-semibold text-emerald-600 block">
                  {workpaperStats.percentage}% telah terisi
                </span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            {/* Card 3: Perlu Dilengkapi */}
            <div className="glass-card p-5 sm:p-6 flex items-center justify-between border border-white/90 shadow-glass-default hover:shadow-glass-hover transition-all">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">Perlu Dilengkapi</span>
                <span className={`text-2xl sm:text-3xl font-bold tracking-tight block ${workpaperStats.pending === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {workpaperStats.pending}
                </span>
                <span className={`text-[11px] font-semibold block ${workpaperStats.pending === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {workpaperStats.pending === 0 ? '100% Terisi Lengkap' : 'Temuan / bukti belum terisi'}
                </span>
              </div>
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs ${workpaperStats.pending === 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {workpaperStats.pending === 0 ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
              </div>
            </div>

            {/* Card 4: Skor Aspek Dimensi */}
            <div className="glass-card p-5 sm:p-6 flex items-center justify-between border border-white/90 shadow-glass-default hover:shadow-glass-hover transition-all">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-slate-500 block">Skor Aspek Dimensi</span>
                <span className="text-2xl sm:text-3xl font-bold tracking-tight text-[#6531F7] block">
                  {calculation.dimensionAspectScore.toFixed(2)}
                </span>
                <span className="text-[11px] font-medium text-[#6531F7] block">Rata-rata 5 Dimensi</span>
              </div>
              <div className="w-11 h-11 rounded-2xl bg-[#6531F7]/10 text-[#6531F7] flex items-center justify-center shrink-0 shadow-2xs">
                <Award className="w-5 h-5 text-[#6531F7]" />
              </div>
            </div>
          </div>

          {/* Filter, Search & View Mode Switcher */}
          <div className="glass-card p-4 sm:p-5 space-y-3.5">
            <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
              {/* Dimension Filters (Pill Style Chips) */}
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-xs font-bold text-slate-700 mr-1 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5 text-[#6531F7]" /> Dimensi:
                </span>
                <button
                  onClick={() => setSelectedDim('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    selectedDim === 'all'
                      ? 'bg-[#6531F7] text-white shadow-light-default'
                      : 'glass-btn text-slate-700'
                  }`}
                >
                  Semua ({parameters.length})
                </button>
                {[1, 2, 3, 4, 5].map(dim => {
                  const count = parameters.filter(p => p.dim_num === dim).length;
                  return (
                    <button
                      key={dim}
                      onClick={() => setSelectedDim(dim)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        selectedDim === dim
                          ? 'bg-[#6531F7] text-white shadow-light-default'
                          : 'glass-btn text-slate-700'
                      }`}
                    >
                      D{dim} ({count})
                    </button>
                  );
                })}
              </div>

              {/* View Mode Toggle: Cards vs Table */}
              <div className="flex items-center gap-2 self-end lg:self-center">
                <span className="text-xs font-medium text-slate-500">Tampilan:</span>
                <div className="bg-slate-100/80 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 shadow-2xs">
                  <button
                    onClick={() => setViewModeIva('cards')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      viewModeIva === 'cards'
                        ? 'bg-white text-slate-900 shadow-light-default border border-slate-100'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Kartu Lega
                  </button>
                  <button
                    onClick={() => setViewModeIva('table')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                      viewModeIva === 'table'
                        ? 'bg-white text-slate-900 shadow-light-default border border-slate-100'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                    Tabel Matriks
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Completeness Filter */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2 border-t border-slate-100 items-center justify-between">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nomor parameter, judul, temuan, bukti..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs glass-input"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={filterCompleteness}
                  onChange={e => setFilterCompleteness(e.target.value as any)}
                  className="text-xs glass-input px-3 py-2 font-medium w-full sm:w-auto"
                >
                  <option value="all">Semua Status Kertas Kerja</option>
                  <option value="complete">Hanya Kertas Kerja Lengkap</option>
                  <option value="incomplete">Hanya Perlu Dilengkapi</option>
                </select>

                <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
                  {filteredParams.length} parameter ditemukan
                </span>
              </div>
            </div>
          </div>

          {/* MODE 1: KARTU LEGA (Expanded Card View - DEFAULT, Soft Glassmorphism) */}
          {viewModeIva === 'cards' && (
            <div className="space-y-4">
              {filteredParams.length === 0 ? (
                <div className="glass-card p-12 text-center">
                  <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                  <p className="text-slate-500 font-medium text-sm">Tidak ada parameter yang sesuai dengan filter.</p>
                </div>
              ) : (
                filteredParams.map(param => {
                  const a = assessmentData.assessments[param.id];
                  const score = a?.score ?? 0;
                  const hasWorkpaper = Boolean(a?.findings || a?.evidence || a?.dataSource);

                  return (
                    <div
                      key={param.id}
                      className="glass-card p-5 space-y-4 hover:border-[#6531F7]/40 hover:shadow-kit transition"
                    >
                      {/* Top Header of Card */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/80">
                        <div className="flex items-start gap-3">
                          <span className="px-2.5 py-1 rounded-xl bg-[#6531F7]/10 text-[#6531F7] border border-[#6531F7]/25 font-bold text-xs shrink-0 mt-0.5">
                            P-{param.id}
                          </span>
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className="text-[11px] font-bold text-[#6531F7] bg-[#6531F7]/10 px-2.5 py-0.5 rounded-full border border-[#6531F7]/20">
                                Dimensi {param.dim_num}: {param.dim_name}
                              </span>
                              <span className="text-[11px] font-medium text-slate-500 bg-white/80 px-2.5 py-0.5 rounded-full border border-white/90">
                                {param.subdim}
                              </span>
                            </div>
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                              {param.title}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                          {score > 0 ? (
                            <span className="px-3 py-1.5 rounded-xl bg-[#6531F7]/10 text-[#6531F7] font-black text-xs border border-[#6531F7]/30 flex items-center gap-1.5 shadow-2xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#6531F7]" />
                              Level {score}
                            </span>
                          ) : (
                            <span className="px-2.5 py-1.5 rounded-xl bg-slate-100 text-slate-500 text-xs font-medium">
                              Belum Dinilai
                            </span>
                          )}

                          <button
                            onClick={() => handleOpenEditWorkpaper(param)}
                            className="glass-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 text-[#6531F7] hover:text-[#5624E3] text-xs font-bold"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            Edit Kertas Kerja
                          </button>
                        </div>
                      </div>

                      {/* 3 Spacious Columns (Kolom A, Kolom B, Kolom C) */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                        {/* Box Kolom A: Temuan / Gap Utama */}
                        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-4 border border-white/80 shadow-2xs flex flex-col justify-between">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                              <AlertCircle className="w-3.5 h-3.5 text-[#6531F7] shrink-0" />
                              Temuan / Gap Utama (Kolom A)
                            </span>
                            {a?.findings ? (
                              <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                                {a.findings}
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400 italic">
                                Belum ada catatan temuan faktual atau gap perbaikan.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Box Kolom B: Kutipan & Bukti Penting */}
                        <div className="bg-[#6531F7]/8 backdrop-blur-md rounded-2xl p-4 border-l-4 border-[#6531F7] border border-[#6531F7]/20 shadow-2xs flex flex-col justify-between">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-[#6531F7] flex items-center gap-1.5 mb-2">
                              <Quote className="w-3.5 h-3.5 text-[#6531F7] shrink-0" />
                              Kutipan & Bukti Penting (Kolom B)
                            </span>
                            {a?.evidence ? (
                              <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                                {a.evidence}
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400 italic">
                                Belum ada kutipan pasal, SK Direksi, atau hasil wawancara.
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Box Kolom C: Sumber Data */}
                        <div className="bg-white/40 backdrop-blur-md rounded-2xl p-4 border border-white/70 shadow-2xs flex flex-col justify-between">
                          <div>
                            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5 mb-2">
                              <FolderOpen className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                              Sumber Data / Lokasi Berkas (Kolom C)
                            </span>
                            {a?.dataSource ? (
                              <p className="text-xs sm:text-[13px] font-semibold text-slate-800 leading-relaxed">
                                {a.dataSource}
                              </p>
                            ) : (
                              <p className="text-xs text-slate-400 italic">
                                Belum ada nama dokumen rujukan atau narasumber.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* MODE 2: TABEL MATRIKS (Spacious Table View with Min-Width) */}
          {viewModeIva === 'table' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 divide-x divide-slate-200">
                      <th className="py-3 px-3 w-16 text-center">No</th>
                      <th className="py-3 px-4 w-64">Parameter & Dimensi</th>
                      <th className="py-3 px-3 w-28 text-center">Skor (Kolom D)</th>
                      <th className="py-3 px-4 min-w-[260px]">Temuan / Gap Utama (Kolom A)</th>
                      <th className="py-3 px-4 min-w-[260px]">Kutipan & Bukti Penting (Kolom B)</th>
                      <th className="py-3 px-4 min-w-[200px]">Sumber Data (Kolom C)</th>
                      <th className="py-3 px-3 w-24 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredParams.map(param => {
                      const a = assessmentData.assessments[param.id];
                      const score = a?.score ?? 0;

                      return (
                        <tr key={param.id} className="hover:bg-purple-50/20 transition divide-x divide-slate-100">
                          <td className="py-3 px-3 text-center font-bold text-slate-700 bg-slate-50/50">
                            P-{param.id}
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-[10px] font-bold text-[#6531F7] bg-purple-50 border border-[#6531F7]/20 px-2 py-0.5 rounded-full mr-1">
                              D{param.dim_num}
                            </span>
                            <span className="font-bold text-slate-900 block mt-1 leading-snug">
                              {param.title}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {param.subdim}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {score > 0 ? (
                              <span className="inline-flex px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-[#6531F7] border border-[#6531F7]/25">
                                Level {score}
                              </span>
                            ) : (
                              <span className="text-[11px] text-slate-400 font-medium">Belum</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-slate-800 leading-relaxed text-xs">
                            {a?.findings || <span className="text-slate-400 italic">Belum diisi</span>}
                          </td>
                          <td className="py-3 px-4 text-slate-800 leading-relaxed text-xs">
                            {a?.evidence || <span className="text-slate-400 italic">Belum diisi</span>}
                          </td>
                          <td className="py-3 px-4 text-slate-800 font-medium text-xs">
                            {a?.dataSource || <span className="text-slate-400 italic">Belum diisi</span>}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <button
                              onClick={() => handleOpenEditWorkpaper(param)}
                              className="glass-btn inline-flex items-center px-3 py-1 text-xs font-bold text-[#6531F7] hover:text-[#5624E3]"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB IV.B: RINGKASAN PENILAIAN ASPEK DIMENSI                           */}
      {/* ========================================================================= */}
      {activeSubTab === 'ivb' && (
        <div className="space-y-4">
          <div className="glass-panel p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Lampiran IV.B: Ringkasan Penilaian Aspek Dimensi
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
                Memetakan Kekuatan / Aspek yang Sudah Baik, Celah / Area Perbaikan, serta Rekomendasi Jangka Pendek vs Panjang untuk masing-masing Dimensi.
              </p>
            </div>
            <div className="bg-[#6531F7]/10 border border-[#6531F7]/25 px-4 py-2 rounded-2xl text-xs font-bold text-slate-900 flex items-center gap-2 shrink-0">
              <span className="text-slate-600">Rata-rata Skor:</span>
              <span className="text-xl font-bold text-[#6531F7]">
                {calculation.dimensionAspectScore.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Cards for D1 s.d. D5 */}
          <div className="space-y-4">
            {calculation.dimensions.map(dim => {
              const summary = assessmentData.dimensionSummaries?.[dim.dimNum] || {
                dimNum: dim.dimNum,
                strengths: 'Belum diisi kekuatan utama dimensi.',
                gaps: 'Belum diisi celah utama perbaikan.',
                shortTermRec: 'Belum diisi rekomendasi jangka pendek.',
                longTermRec: 'Belum diisi rekomendasi jangka panjang.'
              };

              return (
                <div
                  key={dim.dimNum}
                  className="glass-card p-0 overflow-hidden hover:border-[#6531F7]/40 hover:shadow-kit transition"
                >
                  {/* Header Dimensi */}
                  <div className="p-4 sm:p-5 bg-white/70 backdrop-blur-md border-b border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#6531F7] to-[#AB68FF] text-white font-bold flex items-center justify-center text-sm shadow-light-default shrink-0">
                        D{dim.dimNum}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">
                          {dim.dimName}
                        </h3>
                        <span className="text-xs text-slate-500">
                          {dim.assessedCount} dari {dim.paramCount} parameter dinilai
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Skor Dimensi</span>
                        <span className="text-lg font-bold text-[#6531F7]">
                          {dim.score.toFixed(2)}
                        </span>
                      </div>

                      <button
                        onClick={() => setEditingDimSummary(summary)}
                        className="glass-btn inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#6531F7] hover:text-[#5624E3]"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit Ringkasan
                      </button>
                    </div>
                  </div>

                  {/* 4 Box Grid (Strengths, Gaps, Short-Term, Long-Term) */}
                  <div className="p-5 space-y-4">
                    {/* Row 1: Strengths & Gaps */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-emerald-50/60 backdrop-blur-md rounded-2xl p-4 border border-emerald-200/70 shadow-2xs">
                        <div className="flex items-center gap-2 text-emerald-950 font-bold text-xs uppercase tracking-wider mb-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Kekuatan / Aspek yang Sudah Baik (Strengths)</span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                          {summary.strengths}
                        </p>
                      </div>

                      <div className="bg-amber-50/60 backdrop-blur-md rounded-2xl p-4 border border-amber-200/70 shadow-2xs">
                        <div className="flex items-center gap-2 text-amber-950 font-bold text-xs uppercase tracking-wider mb-2">
                          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>Celah / Kekurangan / Area Perbaikan (Gaps)</span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                          {summary.gaps}
                        </p>
                      </div>
                    </div>

                    {/* Row 2: Short-Term vs Long-Term Recommendations */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="bg-purple-50/60 backdrop-blur-md rounded-2xl p-4 border border-[#6531F7]/25 shadow-2xs">
                        <div className="flex items-center gap-2 text-[#6531F7] font-bold text-xs uppercase tracking-wider mb-2">
                          <Clock className="w-4 h-4 text-[#6531F7] shrink-0" />
                          <span>Rekomendasi Jangka Pendek (&lt; 1 Tahun)</span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                          {summary.shortTermRec}
                        </p>
                      </div>

                      <div className="bg-indigo-50/60 backdrop-blur-md rounded-2xl p-4 border border-indigo-200/70 shadow-2xs">
                        <div className="flex items-center gap-2 text-indigo-950 font-bold text-xs uppercase tracking-wider mb-2">
                          <Calendar className="w-4 h-4 text-indigo-700 shrink-0" />
                          <span>Rekomendasi Jangka Panjang (&gt; 1 Tahun)</span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed whitespace-pre-line font-medium">
                          {summary.longTermRec}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB IV.C: FORMAT BAKU REKOMENDASI 9 KOLOM                             */}
      {/* ========================================================================= */}
      {activeSubTab === 'ivc' && (
        <div className="space-y-4">
          {/* Header & Action Bar */}
          <div className="glass-panel p-5 sm:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Lampiran IV.C: Format Baku Rekomendasi Hasil Penilaian RMI
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
                Format 9 kolom baku (Halaman 186 Juknis) lengkap dengan prioritisasi inisiatif berbasis Dampak & Kemudahan.
              </p>
            </div>

            <div className="flex items-center gap-2.5 self-start md:self-center">
              {/* View mode toggle */}
              <div className="bg-slate-100/80 p-1 rounded-xl flex items-center gap-1 border border-slate-200/60 shadow-2xs">
                <button
                  onClick={() => setViewModeIvc('cards')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewModeIvc === 'cards'
                      ? 'bg-white text-slate-900 shadow-light-default border border-slate-100'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Kartu Aksi
                </button>
                <button
                  onClick={() => setViewModeIvc('table')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    viewModeIvc === 'table'
                      ? 'bg-white text-slate-900 shadow-light-default border border-slate-100'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                  Tabel 9 Kolom
                </button>
              </div>

              <button
                onClick={handleAddNewRecommendation}
                className="glass-btn-primary inline-flex items-center gap-2 px-4 py-2 text-xs font-bold shadow-light-default shrink-0 rounded-xl"
              >
                <Plus className="w-4 h-4" />
                Tambah Rekomendasi
              </button>
            </div>
          </div>

          {/* Priority Explanation Banner (Chips from Reference) */}
          <div className="glass-card p-4 text-xs text-slate-600 flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-900">Matriks Prioritas:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200/70 font-bold">
              Prioritas 1: Dampak Tinggi & Mudah
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/70 font-bold">
              Prioritas 2: Dampak Rendah & Mudah / Dampak Tinggi & Sulit
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70 font-bold">
              Prioritas 3: Dampak Rendah & Sulit
            </span>
          </div>

          {/* MODE 1: KARTU RENCANA AKSI (Lega, Bersih, Enak Dibaca) */}
          {viewModeIvc === 'cards' && (
            <div className="space-y-4">
              {filteredRecommendations.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
                  <p className="text-slate-500 font-medium text-sm">Belum ada rekomendasi yang terdaftar.</p>
                </div>
              ) : (
                filteredRecommendations.map((rec, idx) => (
                  <div
                    key={rec.id}
                    className="glass-card p-5 space-y-4 hover:border-[#6531F7]/40 hover:shadow-kit transition-all duration-200 rounded-2xl"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3 border-b border-slate-100">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200/60">
                            #{idx + 1}
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            rec.priority === 1
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : rec.priority === 2
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}>
                            Prioritas {rec.priority} ({rec.impact} / {rec.ease})
                          </span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                            rec.timeframe === 'Jangka Pendek'
                              ? 'bg-purple-50 text-[#6531F7] border border-[#6531F7]/20'
                              : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                          }`}>
                            {rec.timeframe}
                          </span>
                          <span className="text-xs font-bold text-[#6531F7] bg-purple-50 px-2.5 py-0.5 rounded-full border border-[#6531F7]/20">
                            {rec.paramId ? `P-${rec.paramId}` : `Dimensi ${rec.dimNum}`}
                          </span>
                        </div>

                        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug pt-1">
                          {rec.rekomendasi}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-start">
                        <button
                          onClick={() => handleEditRecommendation(rec)}
                          className="glass-btn inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-[#6531F7] hover:text-[#5624E3]"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteRecommendation(rec.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 3 Detail Columns: Aktivitas, Output, Indikator */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                      <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/80 shadow-2xs">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                          Aktivitas Utama (Kolom e)
                        </span>
                        <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed">
                          {rec.aktivitasUtama || '-'}
                        </p>
                      </div>

                      <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/80 shadow-2xs">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                          Output yang Diharapkan (Kolom f)
                        </span>
                        <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed">
                          {rec.output || '-'}
                        </p>
                      </div>

                      <div className="bg-slate-50/90 rounded-xl p-3.5 border border-slate-200/80 shadow-2xs">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1.5">
                          Indikator Keberhasilan (Kolom g)
                        </span>
                        <p className="text-xs sm:text-[13px] text-slate-800 leading-relaxed">
                          {rec.indikatorKeberhasilan || '-'}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Meta Bar: UIC & Target Date */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#6531F7]" />
                        <span>Unit In Charge (UIC): <strong>{rec.uic || '-'}</strong></span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span>Target: <strong>{rec.targetDate}</strong></span>
                        <span className="text-slate-300">•</span>
                        <span>Status: <strong className="text-[#6531F7]">{rec.status}</strong></span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MODE 2: TABEL 9 KOLOM RESMI */}
          {viewModeIvc === 'table' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[1250px]">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 divide-x divide-slate-200">
                      <th className="py-3 px-3 w-12 text-center">No (a)</th>
                      <th className="py-3 px-4 min-w-[260px]">Rekomendasi (b)</th>
                      <th className="py-3 px-3 w-28 text-center">Kode (c)</th>
                      <th className="py-3 px-3 w-28 text-center">Jadwal (d)</th>
                      <th className="py-3 px-4 min-w-[220px]">Aktivitas Utama (e)</th>
                      <th className="py-3 px-4 min-w-[200px]">Output (f)</th>
                      <th className="py-3 px-4 min-w-[200px]">Indikator (g)</th>
                      <th className="py-3 px-3 w-32">UIC (h)</th>
                      <th className="py-3 px-3 w-28 text-center">Prioritas</th>
                      <th className="py-3 px-3 w-20 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecommendations.map((rec, idx) => (
                      <tr key={rec.id} className="hover:bg-blue-50/40 transition divide-x divide-slate-100">
                        <td className="py-3 px-3 text-center font-bold text-slate-600 bg-slate-50/50">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4 text-slate-900 font-medium leading-relaxed">
                          {rec.rekomendasi}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-bold bg-blue-50 text-blue-900">
                            {rec.paramId ? `P-${rec.paramId}` : `Dimensi ${rec.dimNum}`}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.timeframe === 'Jangka Pendek'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-indigo-100 text-indigo-900'
                          }`}>
                            {rec.timeframe}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-800 leading-relaxed text-xs">
                          {rec.aktivitasUtama || '-'}
                        </td>
                        <td className="py-3 px-4 text-slate-800 leading-relaxed text-xs">
                          {rec.output || '-'}
                        </td>
                        <td className="py-3 px-4 text-slate-800 leading-relaxed text-xs">
                          {rec.indikatorKeberhasilan || '-'}
                        </td>
                        <td className="py-3 px-3 text-slate-900 font-semibold text-xs">
                          {rec.uic || '-'}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.priority === 1
                              ? 'bg-red-100 text-red-800'
                              : rec.priority === 2
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            P{rec.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleEditRecommendation(rec)}
                              className="p-1 rounded text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition cursor-pointer"
                              title="Edit"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteRecommendation(rec.id)}
                              className="p-1 rounded text-slate-600 hover:text-red-700 hover:bg-red-50 transition cursor-pointer"
                              title="Hapus"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT WORKPAPER (IV.A)                                              */}
      {/* ========================================================================= */}
      {editingParam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-r from-[#6531F7] to-[#AB68FF] text-white flex items-center justify-between">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  Kertas Kerja Lampiran IV.A
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  <span>P-{editingParam.id}:</span> {editingParam.title}
                </h3>
              </div>
              <button
                onClick={() => setEditingParam(null)}
                className="text-white/80 hover:text-white p-1 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Temuan / Gap Utama (Kolom A) *
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Catat kondisi aktual atau kelemahan/celah yang ditemukan dari kajian berkas atau wawancara.
                </p>
                <textarea
                  rows={4}
                  value={workpaperForm.findings}
                  onChange={e => setWorkpaperForm({ ...workpaperForm, findings: e.target.value })}
                  placeholder="Deskripsikan kondisi faktual temuan..."
                  className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6531F7] bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Kutipan & Bukti Penting (Kolom B)
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Nomor surat, pasal SOP/SK, risalah rapat, atau pernyataan kunci wawancara.
                </p>
                <textarea
                  rows={3}
                  value={workpaperForm.evidence}
                  onChange={e => setWorkpaperForm({ ...workpaperForm, evidence: e.target.value })}
                  placeholder="Contoh: SK Direksi No. 12 Tahun 2022 Pasal 5 ayat 2..."
                  className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3.5 focus:outline-none focus:ring-2 focus:ring-[#6531F7] bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Sumber Data & Lokasi File (Kolom C)
                </label>
                <p className="text-[11px] text-slate-500 mb-2">
                  Nama file dokumen, folder rujukan, atau narasumber yang diwawancarai.
                </p>
                <input
                  type="text"
                  value={workpaperForm.dataSource}
                  onChange={e => setWorkpaperForm({ ...workpaperForm, dataSource: e.target.value })}
                  placeholder="Contoh: Dokumen Pedoman MR 2022 / Wawancara VP Risk Management"
                  className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6531F7] bg-white"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                onClick={() => setEditingParam(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveWorkpaper}
                className="glass-btn-primary inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold shadow-light-default rounded-xl"
              >
                <Save className="w-4 h-4" />
                Simpan Kertas Kerja
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT DIMENSION SUMMARY (IV.B)                                      */}
      {/* ========================================================================= */}
      {editingDimSummary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-r from-[#6531F7] to-[#AB68FF] text-white flex items-center justify-between">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  Ringkasan Dimensi Lampiran IV.B
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Edit Ringkasan Dimensi {editingDimSummary.dimNum}
                </h3>
              </div>
              <button
                onClick={() => setEditingDimSummary(null)}
                className="text-white/80 hover:text-white p-1 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Kekuatan / Aspek yang Sudah Baik (Strengths)
                </label>
                <textarea
                  rows={3}
                  value={editingDimSummary.strengths}
                  onChange={e => setEditingDimSummary({ ...editingDimSummary, strengths: e.target.value })}
                  className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6531F7] bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Celah / Kekurangan / Area Perbaikan (Gaps)
                </label>
                <textarea
                  rows={3}
                  value={editingDimSummary.gaps}
                  onChange={e => setEditingDimSummary({ ...editingDimSummary, gaps: e.target.value })}
                  className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6531F7] bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Rekomendasi Jangka Pendek (&lt; 1 Tahun)
                </label>
                <textarea
                  rows={2}
                  value={editingDimSummary.shortTermRec}
                  onChange={e => setEditingDimSummary({ ...editingDimSummary, shortTermRec: e.target.value })}
                  className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6531F7] bg-white leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Rekomendasi Jangka Panjang (&gt; 1 Tahun)
                </label>
                <textarea
                  rows={2}
                  value={editingDimSummary.longTermRec}
                  onChange={e => setEditingDimSummary({ ...editingDimSummary, longTermRec: e.target.value })}
                  className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#6531F7] bg-white leading-relaxed"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                onClick={() => setEditingDimSummary(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveDimSummary}
                className="glass-btn-primary inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold shadow-light-default rounded-xl"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD / EDIT RECOMMENDATION (IV.C)                                   */}
      {/* ========================================================================= */}
      {isRecModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-r from-[#6531F7] to-[#AB68FF] text-white flex items-center justify-between">
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                  Format Baku Lampiran IV.C (9 Kolom)
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {recEditingId ? 'Edit Rekomendasi' : 'Tambah Rekomendasi Baru'}
                </h3>
              </div>
              <button
                onClick={() => setIsRecModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-xl hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Dimensi RMI
                  </label>
                  <select
                    value={recForm.dimNum}
                    onChange={e => setRecForm({ ...recForm, dimNum: Number(e.target.value) })}
                    className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    {[1, 2, 3, 4, 5].map(d => (
                      <option key={d} value={d}>
                        Dimensi {d}: {calculation.dimensions.find(x => x.dimNum === d)?.dimName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Jadwal Waktu Penyelesaian (Kolom d)
                  </label>
                  <select
                    value={recForm.timeframe}
                    onChange={e => setRecForm({ ...recForm, timeframe: e.target.value as any })}
                    className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 bg-white focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="Jangka Pendek">Jangka Pendek (&lt; 1 Tahun)</option>
                    <option value="Jangka Panjang">Jangka Panjang (&gt; 1 Tahun)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Rekomendasi Perbaikan (Kolom b) *
                </label>
                <textarea
                  rows={3}
                  required
                  value={recForm.rekomendasi}
                  onChange={e => setRecForm({ ...recForm, rekomendasi: e.target.value })}
                  placeholder="Uraikan rekomendasi perbaikan secara jelas..."
                  className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3.5 focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Dampak Rekomendasi
                  </label>
                  <select
                    value={recForm.impact}
                    onChange={e => setRecForm({ ...recForm, impact: e.target.value as any })}
                    className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 bg-white font-medium"
                  >
                    <option value="Tinggi">Tinggi</option>
                    <option value="Rendah">Rendah</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Tingkat Kemudahan Eksekusi
                  </label>
                  <select
                    value={recForm.ease}
                    onChange={e => setRecForm({ ...recForm, ease: e.target.value as any })}
                    className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 bg-white font-medium"
                  >
                    <option value="Mudah">Mudah</option>
                    <option value="Sulit">Sulit</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Aktivitas Utama (Kolom e)
                </label>
                <textarea
                  rows={2}
                  value={recForm.aktivitasUtama}
                  onChange={e => setRecForm({ ...recForm, aktivitasUtama: e.target.value })}
                  placeholder="Langkah-langkah tindakan praktis..."
                  className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 bg-white leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Output yang Diharapkan (Kolom f)
                  </label>
                  <input
                    type="text"
                    value={recForm.output}
                    onChange={e => setRecForm({ ...recForm, output: e.target.value })}
                    placeholder="Contoh: Dokumen SOP / Dashboard KRI"
                    className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Unit In Charge / UIC (Kolom h)
                  </label>
                  <input
                    type="text"
                    value={recForm.uic}
                    onChange={e => setRecForm({ ...recForm, uic: e.target.value })}
                    placeholder="Contoh: Divisi Manajemen Risiko"
                    className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Indikator Keberhasilan (Kolom g)
                </label>
                <input
                  type="text"
                  value={recForm.indikatorKeberhasilan}
                  onChange={e => setRecForm({ ...recForm, indikatorKeberhasilan: e.target.value })}
                  placeholder="Ukuran penilaian keberhasilan..."
                  className="w-full text-xs sm:text-[13px] border border-slate-300 rounded-xl p-3 bg-white"
                />
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2.5">
              <button
                onClick={() => setIsRecModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleSaveRecommendation}
                className="glass-btn-primary inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold shadow-light-default rounded-xl"
              >
                <Save className="w-4 h-4" />
                Simpan Rekomendasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
