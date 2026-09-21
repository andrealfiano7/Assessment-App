import React, { useState, useMemo, useEffect } from 'react';
import {
  RmiParameter,
  ParameterAssessment,
  CompleteAssessmentData
} from '../types/rmi';
import { DIMENSIONS_META } from '../data/rmiCommon';
import { getParametersForModel } from '../utils/storage';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Search,
  FileText,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface AssessmentViewProps {
  assessmentData: CompleteAssessmentData;
  onUpdateAssessment: (paramId: number, update: Partial<ParameterAssessment>) => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  assessmentData,
  onUpdateAssessment
}) => {
  const [activeDimNum, setActiveDimNum] = useState<number>(1);
  const [selectedParamId, setSelectedParamId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unassessed' | 'assessed'>('all');
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  const allParameters = useMemo(() => {
    return getParametersForModel(assessmentData.profile.model) as RmiParameter[];
  }, [assessmentData.profile.model]);

  const dimParameters = useMemo(() => {
    return allParameters.filter(p => p.dim_num === activeDimNum);
  }, [allParameters, activeDimNum]);

  const filteredParameters = useMemo(() => {
    return dimParameters.filter(p => {
      const assessment = assessmentData.assessments[p.id];
      const isAssessed = (assessment?.score ?? 0) > 0;

      if (filterStatus === 'unassessed' && isAssessed) return false;
      if (filterStatus === 'assessed' && !isAssessed) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesSubdim = p.subdim.toLowerCase().includes(q);
        if (!matchesTitle && !matchesSubdim) return false;
      }

      return true;
    });
  }, [dimParameters, assessmentData.assessments, filterStatus, searchQuery]);

  useEffect(() => {
    if (dimParameters.length > 0) {
      const isCurrentInDim = dimParameters.some(p => p.id === selectedParamId);
      if (!isCurrentInDim) {
        setSelectedParamId(dimParameters[0].id);
      }
    }
  }, [activeDimNum, dimParameters]);

  const activeParam = useMemo(() => {
    return allParameters.find(p => p.id === selectedParamId) || allParameters[0];
  }, [allParameters, selectedParamId]);

  const currentAssessment = assessmentData.assessments[activeParam?.id] || {
    paramId: activeParam?.id,
    score: 0,
    findings: '',
    evidence: '',
    dataSource: ''
  };

  const activeDimMeta = DIMENSIONS_META.find(d => d.dimNum === activeDimNum) || DIMENSIONS_META[0];

  const handleSelectScore = (score: number) => {
    if (!activeParam) return;
    onUpdateAssessment(activeParam.id, { score });

    if (autoAdvance) {
      const currentIndex = allParameters.findIndex(p => p.id === activeParam.id);
      if (currentIndex >= 0 && currentIndex < allParameters.length - 1) {
        const nextParam = allParameters[currentIndex + 1];
        if (nextParam.dim_num !== activeDimNum) {
          setActiveDimNum(nextParam.dim_num);
        }
        setSelectedParamId(nextParam.id);
      }
    }
  };

  const handlePrev = () => {
    const currentIndex = allParameters.findIndex(p => p.id === activeParam.id);
    if (currentIndex > 0) {
      const prevParam = allParameters[currentIndex - 1];
      if (prevParam.dim_num !== activeDimNum) {
        setActiveDimNum(prevParam.dim_num);
      }
      setSelectedParamId(prevParam.id);
    }
  };

  const handleNext = () => {
    const currentIndex = allParameters.findIndex(p => p.id === activeParam.id);
    if (currentIndex < allParameters.length - 1) {
      const nextParam = allParameters[currentIndex + 1];
      if (nextParam.dim_num !== activeDimNum) {
        setActiveDimNum(nextParam.dim_num);
      }
      setSelectedParamId(nextParam.id);
    }
  };

  const dimStats = useMemo(() => {
    const assessed = dimParameters.filter(p => (assessmentData.assessments[p.id]?.score ?? 0) > 0);
    const totalScore = assessed.reduce((acc, p) => acc + assessmentData.assessments[p.id].score, 0);
    const avgScore = assessed.length > 0 ? (totalScore / assessed.length).toFixed(2) : '0.00';
    return {
      total: dimParameters.length,
      assessed: assessed.length,
      avgScore
    };
  }, [dimParameters, assessmentData.assessments]);

  // Level rubric configurations in Soft Glassmorphic Theme
  const levelConfigs = [
    { lvl: 1, name: 'Level 1: Fase Awal', selectedBg: 'bg-rose-50/90 border-rose-400 ring-2 ring-rose-200 shadow-glass' },
    { lvl: 2, name: 'Level 2: Fase Berkembang', selectedBg: 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-200 shadow-glass' },
    { lvl: 3, name: 'Level 3: Praktik Baik', selectedBg: 'bg-periwinkle-50/90 border-periwinkle-400 ring-2 ring-periwinkle-200 shadow-glass' },
    { lvl: 4, name: 'Level 4: Lebih Baik', selectedBg: 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-200 shadow-glass' },
    { lvl: 5, name: 'Level 5: Praktik Terbaik', selectedBg: 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-200 shadow-glass' }
  ];

  return (
    <div className="space-y-3 max-h-[calc(100vh-140px)] flex flex-col">
      {/* 1. Dimension Tabs Bar (5 Columns Grid, No Horizontal Scroll) */}
      <div className="glass-card p-1.5 shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {DIMENSIONS_META.map(dim => {
            const isActive = dim.dimNum === activeDimNum;
            const paramsInDim = allParameters.filter(p => p.dim_num === dim.dimNum);
            const assessedCount = paramsInDim.filter(p => (assessmentData.assessments[p.id]?.score ?? 0) > 0).length;
            const isCompleted = assessedCount === paramsInDim.length && paramsInDim.length > 0;

            return (
              <button
                key={dim.dimNum}
                onClick={() => setActiveDimNum(dim.dimNum)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition duration-200 border ${
                  isActive
                    ? 'bg-periwinkle-500 text-white border-periwinkle-400 shadow-periwinkle-glow font-bold'
                    : 'bg-white/50 border-white/60 hover:bg-white/80 text-slate-700'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md font-mono ${
                      isActive ? 'bg-white/20 text-white backdrop-blur-sm' : 'bg-slate-100/80 text-slate-600'
                    }`}>
                      D{dim.dimNum}
                    </span>
                    <span className="text-xs truncate">
                      {dim.name}
                    </span>
                  </div>
                  <div className={`text-[10px] mt-0.5 ${isActive ? 'text-periwinkle-100' : 'text-slate-500'}`}>
                    {assessedCount}/{paramsInDim.length} dinilai
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {isCompleted ? (
                    <CheckCircle2 className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                  ) : (
                    <span className={`text-[10px] font-bold font-mono ${isActive ? 'text-white' : 'text-slate-500'}`}>
                      {paramsInDim.length > 0 ? Math.round((assessedCount / paramsInDim.length) * 100) : 0}%
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Split Workspace: Master List (Left) + Detail Assessment (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left Column: Parameter List */}
        <div className="lg:col-span-4 glass-card flex flex-col overflow-hidden max-h-[calc(100vh-215px)]">
          {/* Master List Header */}
          <div className="p-3 border-b border-white/70 bg-white/40 backdrop-blur-md space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  D{activeDimMeta.dimNum}: {activeDimMeta.name}
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Rata-rata: <strong className="text-periwinkle-600 font-mono">{dimStats.avgScore}</strong> • Progres: {dimStats.assessed}/{dimStats.total}
                </span>
              </div>
              <label className="flex items-center gap-1.5 text-[10px] text-slate-600 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={e => setAutoAdvance(e.target.checked)}
                  className="rounded text-periwinkle-500 focus:ring-periwinkle-400 w-3.5 h-3.5 border-slate-300"
                />
                <span className="font-medium">Auto Next</span>
              </label>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari parameter..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="glass-input w-full pl-8 pr-2.5 py-1.5 text-[11px]"
                />
              </div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="glass-input text-[11px] px-2 py-1.5 shrink-0"
              >
                <option value="all">Semua</option>
                <option value="unassessed">Belum</option>
                <option value="assessed">Sudah</option>
              </select>
            </div>
          </div>

          {/* Parameter List Items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100/60 no-scrollbar">
            {filteredParameters.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                Tidak ada parameter ditemukan
              </div>
            ) : (
              filteredParameters.map(p => {
                const a = assessmentData.assessments[p.id];
                const score = a?.score ?? 0;
                const isSelected = p.id === activeParam?.id;

                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedParamId(p.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition duration-150 flex items-start justify-between gap-2 pt-2.5 ${
                      isSelected
                        ? 'bg-periwinkle-50/90 border border-periwinkle-300 shadow-glass'
                        : 'hover:bg-white/60 border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md ${
                          isSelected ? 'bg-periwinkle-500 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                        }`}>
                          P.{p.id}
                        </span>
                        <span className="text-[10px] text-periwinkle-600 font-semibold truncate">
                          {p.subdim}
                        </span>
                      </div>
                      <div className={`text-xs font-semibold leading-snug mt-1 line-clamp-2 ${
                        isSelected ? 'text-slate-900 font-bold' : 'text-slate-700'
                      }`}>
                        {p.title}
                      </div>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {score > 0 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-periwinkle-500 text-white font-black text-xs font-mono shadow-periwinkle-glow">
                          {score}
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-400 font-medium">
                          Belum
                        </span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Parameter Workspace */}
        <div className="lg:col-span-8 glass-card flex flex-col overflow-hidden max-h-[calc(100vh-215px)]">
          {activeParam ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Parameter Toolbar */}
              <div className="p-3.5 border-b border-white/70 bg-white/40 backdrop-blur-md flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-periwinkle-500 text-white rounded-lg text-xs font-mono font-bold shadow-xs">
                      Parameter {activeParam.id}
                    </span>
                    <span className="text-xs font-semibold text-periwinkle-700 truncate">
                      {activeParam.subdim}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-1" title={activeParam.title}>
                    {activeParam.title}
                  </h3>
                </div>

                {/* Score Selector & Navigation */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1 bg-white/70 backdrop-blur-sm p-1 rounded-xl border border-white/80 shadow-glass">
                    <span className="text-[10px] font-bold text-slate-500 px-1">Skor:</span>
                    {[1, 2, 3, 4, 5].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => handleSelectScore(lvl)}
                        className={`w-7 h-7 rounded-lg font-bold text-xs transition flex items-center justify-center ${
                          currentAssessment.score === lvl
                            ? 'bg-periwinkle-500 text-white shadow-periwinkle-glow font-mono scale-105 ring-1 ring-periwinkle-300'
                            : 'text-slate-700 hover:bg-periwinkle-50 font-mono'
                        }`}
                        title={`Pilih Skor Level ${lvl}`}
                      >
                        {lvl}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={handlePrev}
                      className="glass-btn p-1.5 text-slate-600 hover:text-slate-900"
                      title="Parameter Sebelumnya"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="glass-btn p-1.5 text-slate-600 hover:text-slate-900"
                      title="Parameter Selanjutnya"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Center Content: 5 Rubric Criteria Cards + Workpaper */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-3 no-scrollbar">
                {/* 5 Levels Rubric Cards */}
                <div>
                  <div className="flex items-center justify-between mb-2 text-xs">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-periwinkle-600" />
                      Rubrik Kriteria Spektrum Pemenuhan (Klik kartu untuk memilih skor):
                    </span>
                    {currentAssessment.score > 0 && (
                      <span className="text-[11px] font-bold text-periwinkle-700 bg-periwinkle-100 border border-periwinkle-200 px-2.5 py-0.5 rounded-full shadow-xs">
                        Skor Saat Ini: Level {currentAssessment.score}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    {levelConfigs.map(cfg => {
                      const isSelected = currentAssessment.score === cfg.lvl;
                      const text = activeParam.criteria[cfg.lvl as 1|2|3|4|5] || '(Mengacu pada ketentuan juknis)';

                      return (
                        <div
                          key={cfg.lvl}
                          onClick={() => handleSelectScore(cfg.lvl)}
                          className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex flex-col justify-between ${
                            isSelected
                              ? cfg.selectedBg
                              : 'border-white/80 bg-white/60 hover:bg-white/90 text-slate-700 hover:shadow-xs'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between font-bold pb-1 mb-1.5 border-b border-slate-200/60">
                              <span className={isSelected ? 'text-slate-950 font-black' : 'text-slate-800'}>
                                Level {cfg.lvl}
                              </span>
                              {isSelected && (
                                <span className="text-[9px] px-1.5 py-0.5 bg-periwinkle-500 text-white rounded-full font-bold shadow-xs">
                                  Aktif
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] leading-relaxed text-slate-600 whitespace-pre-line">
                              {text}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Workpaper Form (Lampiran IV.A) */}
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-3.5 border border-white/80 space-y-2.5 shadow-glass">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-periwinkle-600" />
                      Kertas Kerja Penilaian & Bukti Temuan (Lampiran IV.A)
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Tersimpan otomatis
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                    <div>
                      <label className="font-semibold text-slate-700 block text-[11px] mb-1">
                        Temuan / Gap Utama (Bagian A)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Catat kondisi aktual atau gap temuan..."
                        value={currentAssessment.findings || ''}
                        onChange={e => onUpdateAssessment(activeParam.id, { findings: e.target.value })}
                        className="glass-input w-full text-xs p-2.5 rounded-xl border border-slate-200/80 resize-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block text-[11px] mb-1">
                        Kutipan & Bukti Penting (Bagian B)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Pasal SOP, SK Direksi, risalah..."
                        value={currentAssessment.evidence || ''}
                        onChange={e => onUpdateAssessment(activeParam.id, { evidence: e.target.value })}
                        className="glass-input w-full text-xs p-2.5 rounded-xl border border-slate-200/80 resize-none"
                      ></textarea>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 block text-[11px] mb-1">
                        Sumber Data (Bagian C)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Dokumen / wawancara fungsi..."
                        value={currentAssessment.dataSource || ''}
                        onChange={e => onUpdateAssessment(activeParam.id, { dataSource: e.target.value })}
                        className="glass-input w-full text-xs p-2.5 rounded-xl border border-slate-200/80 resize-none"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Pilih parameter di panel kiri untuk memulai evaluasi.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
