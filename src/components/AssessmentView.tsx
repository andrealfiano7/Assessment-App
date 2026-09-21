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
  Sparkles,
  Check,
  LayoutGrid,
  List,
  Type
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AssessmentViewProps {
  assessmentData: CompleteAssessmentData;
  onUpdateAssessment: (paramId: number, update: Partial<ParameterAssessment>) => void;
}

interface CriteriaItem {
  type: 'bullet' | 'subbullet' | 'paragraph';
  text: string;
}

const parseCriteriaText = (rawText: string): CriteriaItem[] => {
  if (!rawText) return [];
  // Pastikan bullet yang mungkin tidak sengaja tergabung dalam satu baris terpisah secara bersih
  const normalized = rawText.replace(/([^\n])\s*•\s*/g, '$1\n• ');
  const rawLines = normalized.split('\n');
  const items: CriteriaItem[] = [];
  let currentItem: CriteriaItem | null = null;

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith('•')) {
      if (currentItem) items.push(currentItem);
      currentItem = {
        type: 'bullet',
        text: trimmed.replace(/^•\s*/, '')
      };
    } else if (trimmed.startsWith('o ') || trimmed.startsWith('o\t') || trimmed === 'o') {
      if (currentItem) items.push(currentItem);
      currentItem = {
        type: 'subbullet',
        text: trimmed.replace(/^o\s*/, '')
      };
    } else {
      if (currentItem) {
        if (currentItem.text.endsWith('-')) {
          currentItem.text += trimmed;
        } else {
          currentItem.text += ' ' + trimmed;
        }
      } else {
        currentItem = {
          type: 'paragraph',
          text: trimmed
        };
      }
    }
  }

  if (currentItem) items.push(currentItem);
  return items;
};

interface CriteriaRendererProps {
  rawText: string;
  textClass: string;
  isSelected?: boolean;
  isGrid?: boolean;
}

const CriteriaRenderer: React.FC<CriteriaRendererProps> = ({
  rawText,
  textClass,
  isSelected = false,
  isGrid = false
}) => {
  const items = useMemo(() => parseCriteriaText(rawText), [rawText]);

  if (items.length === 0) {
    return <div className={`${textClass} text-slate-400 italic`}>(Mengacu pada ketentuan juknis)</div>;
  }

  if (items.length === 1 && items[0].type === 'paragraph') {
    return <div className={`${textClass} leading-relaxed text-slate-800`}>{items[0].text}</div>;
  }

  return (
    <div className={isGrid ? 'space-y-1.5' : 'space-y-2'}>
      {items.map((item, idx) => {
        if (item.type === 'subbullet') {
          return (
            <div
              key={idx}
              className={`flex items-start ${
                isGrid ? 'gap-1.5 ml-2.5 pl-1.5' : 'gap-2.5 ml-4 sm:ml-5 pl-2.5'
              } border-l-2 ${isSelected ? 'border-periwinkle-400' : 'border-slate-200/90'}`}
            >
              <span
                className={`rounded-full border-2 shrink-0 ${
                  isGrid ? 'w-1.5 h-1.5 mt-1' : 'w-2 h-2 mt-1.5'
                } ${isSelected ? 'border-periwinkle-600 bg-white' : 'border-slate-400 bg-white'}`}
              />
              <span className={`${textClass} text-slate-700 leading-relaxed`}>
                {item.text}
              </span>
            </div>
          );
        }

        if (item.type === 'paragraph') {
          return (
            <div key={idx} className={`${textClass} font-semibold text-slate-800 leading-relaxed mb-0.5`}>
              {item.text}
            </div>
          );
        }

        return (
          <div key={idx} className={`flex items-start ${isGrid ? 'gap-1.5' : 'gap-2.5 sm:gap-3'}`}>
            <span
              className={`rounded-full shrink-0 ${
                isGrid ? 'w-1.5 h-1.5 mt-1.5' : 'w-2 sm:w-2.5 h-2 sm:h-2.5 mt-1.5'
              } ${isSelected ? 'bg-periwinkle-600 shadow-xs ring-2 ring-periwinkle-300' : 'bg-slate-400'}`}
            />
            <span className={`${textClass} text-slate-800 leading-relaxed`}>
              {item.text}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  assessmentData,
  onUpdateAssessment
}) => {
  const [activeDimNum, setActiveDimNum] = useState<number>(1);
  const [selectedParamId, setSelectedParamId] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unassessed' | 'assessed'>('all');
  const [autoAdvance, setAutoAdvance] = useState<boolean>(true);

  // Aksesibilitas Lansia: Skala Ukuran Font & Mode Tampilan Rubrik
  const [fontScale, setFontScale] = useState<'normal' | 'large' | 'xlarge'>('large');
  const [rubricViewMode, setRubricViewMode] = useState<'vertical' | 'grid'>('vertical');

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

  // Level rubric configurations with high contrast & clear visual cues for seniors
  const levelConfigs = [
    {
      lvl: 1,
      name: 'Level 1: Fase Awal',
      shortName: 'Fase Awal',
      badgeClass: 'bg-rose-500 text-white',
      borderSelected: 'border-rose-500 ring-2 ring-rose-300/80 bg-rose-50/90 shadow-md',
      borderIdle: 'border-rose-200/80 bg-white/70 hover:border-rose-300 hover:bg-rose-50/40'
    },
    {
      lvl: 2,
      name: 'Level 2: Fase Berkembang',
      shortName: 'Fase Berkembang',
      badgeClass: 'bg-amber-500 text-white',
      borderSelected: 'border-amber-500 ring-2 ring-amber-300/80 bg-amber-50/90 shadow-md',
      borderIdle: 'border-amber-200/80 bg-white/70 hover:border-amber-300 hover:bg-amber-50/40'
    },
    {
      lvl: 3,
      name: 'Level 3: Praktik Baik',
      shortName: 'Praktik Baik',
      badgeClass: 'bg-periwinkle-500 text-white',
      borderSelected: 'border-periwinkle-500 ring-2 ring-periwinkle-300/80 bg-periwinkle-50/90 shadow-md',
      borderIdle: 'border-periwinkle-200/80 bg-white/70 hover:border-periwinkle-300 hover:bg-periwinkle-50/40'
    },
    {
      lvl: 4,
      name: 'Level 4: Lebih Baik',
      shortName: 'Lebih Baik',
      badgeClass: 'bg-indigo-600 text-white',
      borderSelected: 'border-indigo-500 ring-2 ring-indigo-300/80 bg-indigo-50/90 shadow-md',
      borderIdle: 'border-indigo-200/80 bg-white/70 hover:border-indigo-300 hover:bg-indigo-50/40'
    },
    {
      lvl: 5,
      name: 'Level 5: Praktik Terbaik',
      shortName: 'Praktik Terbaik',
      badgeClass: 'bg-emerald-600 text-white',
      borderSelected: 'border-emerald-500 ring-2 ring-emerald-300/80 bg-emerald-50/90 shadow-md',
      borderIdle: 'border-emerald-200/80 bg-white/70 hover:border-emerald-300 hover:bg-emerald-50/40'
    }
  ];

  // Dynamic Typography Scale for High Readability
  const textScale = useMemo(() => {
    switch (fontScale) {
      case 'xlarge':
        return {
          criteria: 'text-base sm:text-[16px] leading-relaxed text-slate-900 font-medium',
          criteriaTitle: 'text-base font-extrabold text-slate-950',
          paramTitle: 'text-base sm:text-lg font-extrabold text-slate-950',
          subdim: 'text-xs sm:text-sm font-semibold text-periwinkle-700',
          workpaperLabel: 'text-xs sm:text-sm font-bold text-slate-800',
          workpaperInput: 'text-sm sm:text-base p-3'
        };
      case 'large':
        return {
          criteria: 'text-sm sm:text-[14px] leading-relaxed text-slate-800 font-normal',
          criteriaTitle: 'text-sm font-bold text-slate-900',
          paramTitle: 'text-sm sm:text-base font-bold text-slate-900',
          subdim: 'text-xs font-semibold text-periwinkle-700',
          workpaperLabel: 'text-xs font-bold text-slate-800',
          workpaperInput: 'text-xs sm:text-sm p-2.5'
        };
      case 'normal':
      default:
        return {
          criteria: 'text-xs sm:text-[12.5px] leading-relaxed text-slate-700',
          criteriaTitle: 'text-xs font-bold text-slate-800',
          paramTitle: 'text-xs sm:text-sm font-bold text-slate-900',
          subdim: 'text-[11px] font-semibold text-periwinkle-700',
          workpaperLabel: 'text-[11px] font-semibold text-slate-700',
          workpaperInput: 'text-xs p-2'
        };
    }
  }, [fontScale]);

  return (
    <div className="space-y-3 max-h-[calc(100vh-130px)] flex flex-col">
      {/* 1. Dimension Tabs Bar (5 Columns Grid) */}
      <div className="glass-card p-1.5 shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {DIMENSIONS_META.map(dim => {
            const isActive = dim.dimNum === activeDimNum;
            const paramsInDim = allParameters.filter(p => p.dim_num === dim.dimNum);
            const assessedCount = paramsInDim.filter(p => (assessmentData.assessments[p.id]?.score ?? 0) > 0).length;
            const isCompleted = assessedCount === paramsInDim.length && paramsInDim.length > 0;

            return (
              <motion.button
                key={dim.dimNum}
                whileHover={{ y: -1.5, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveDimNum(dim.dimNum)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-left transition duration-200 border cursor-pointer ${
                  isActive
                    ? 'bg-periwinkle-500 text-white border-periwinkle-400 shadow-periwinkle-glow font-bold'
                    : 'bg-white/50 border-white/60 hover:bg-white/80 text-slate-700'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
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
                    <span className={`text-[10px] font-bold ${isActive ? 'text-white' : 'text-slate-500'}`}>
                      {paramsInDim.length > 0 ? Math.round((assessedCount / paramsInDim.length) * 100) : 0}%
                    </span>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. Split Workspace: Master List (Left) + Detail Assessment (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-0">
        {/* Left Column: Parameter List */}
        <div className="lg:col-span-4 glass-card flex flex-col overflow-hidden max-h-[calc(100vh-210px)]">
          {/* Master List Header */}
          <div className="p-3 border-b border-white/70 bg-white/40 backdrop-blur-md space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-900">
                  D{activeDimMeta.dimNum}: {activeDimMeta.name}
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Rata-rata: <strong className="text-periwinkle-600 font-mono">{dimStats.avgScore}</strong> • Progres: {dimStats.assessed}/{dimStats.total}
                </span>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none bg-white/60 px-2 py-1 rounded-lg border border-slate-200/60 shadow-2xs">
                <input
                  type="checkbox"
                  checked={autoAdvance}
                  onChange={e => setAutoAdvance(e.target.checked)}
                  className="rounded text-periwinkle-500 focus:ring-periwinkle-400 w-3.5 h-3.5 border-slate-300"
                />
                <span className="font-semibold text-[11px]">Auto Lanjut</span>
              </label>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex gap-1.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari nama / nomor parameter..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="glass-input w-full pl-8 pr-2.5 py-1.5 text-xs"
                />
              </div>
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value as any)}
                className="glass-input text-xs px-2 py-1.5 shrink-0 font-medium"
              >
                <option value="all">Semua Status</option>
                <option value="unassessed">Belum Dinilai</option>
                <option value="assessed">Sudah Dinilai</option>
              </select>
            </div>
          </div>

          {/* Parameter List Items */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 divide-y divide-slate-100/60">
            {filteredParameters.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400">
                Tidak ada parameter yang sesuai
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
                    className={`w-full text-left p-2.5 rounded-xl transition duration-150 flex items-start justify-between gap-2.5 pt-2.5 ${
                      isSelected
                        ? 'bg-periwinkle-50/90 border-2 border-periwinkle-400 shadow-glass'
                        : 'hover:bg-white/60 border border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md ${
                          isSelected ? 'bg-periwinkle-500 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                        }`}>
                          P.{p.id}
                        </span>
                        <span className="text-[11px] text-periwinkle-700 font-bold truncate">
                          {p.subdim}
                        </span>
                      </div>
                      <div className={`text-xs sm:text-[13px] leading-snug line-clamp-2 ${
                        isSelected ? 'text-slate-950 font-bold' : 'text-slate-700 font-medium'
                      }`}>
                        {p.title}
                      </div>
                    </div>

                    <div className="shrink-0 mt-0.5">
                      {score > 0 ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-periwinkle-500 text-white font-black text-xs font-mono shadow-periwinkle-glow">
                          {score}
                        </span>
                      ) : (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 text-slate-500 font-medium">
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
        <div className="lg:col-span-8 glass-card flex flex-col overflow-hidden max-h-[calc(100vh-210px)]">
          {activeParam ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Parameter Toolbar (Header Atas Ramah Penglihatan) */}
              <div className="p-3.5 border-b border-white/70 bg-white/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="min-w-0 flex-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-periwinkle-500 text-white rounded-lg text-xs font-mono font-bold shadow-xs">
                      Parameter {activeParam.id} dari {allParameters.length}
                    </span>
                    <span className={textScale.subdim}>
                      {activeParam.subdim}
                    </span>
                  </div>
                  <h3 className={`${textScale.paramTitle} mt-1`} title={activeParam.title}>
                    {activeParam.title}
                  </h3>
                </div>

                {/* Score Selector & Fast Navigation */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 bg-white/80 backdrop-blur-sm p-1.5 rounded-xl border border-white/90 shadow-glass">
                    <span className="text-xs font-bold text-slate-600 px-1">Skor:</span>
                    {[1, 2, 3, 4, 5].map(lvl => (
                      <button
                        key={lvl}
                        onClick={() => handleSelectScore(lvl)}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl font-extrabold text-sm sm:text-base transition flex items-center justify-center cursor-pointer ${
                          currentAssessment.score === lvl
                            ? 'bg-periwinkle-600 text-white shadow-periwinkle-glow font-mono scale-105 ring-2 ring-periwinkle-400'
                            : 'text-slate-700 bg-white hover:bg-periwinkle-50 border border-slate-200 font-mono'
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
                      disabled={allParameters.findIndex(p => p.id === activeParam.id) === 0}
                      className="glass-btn p-2 text-slate-700 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Parameter Sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={allParameters.findIndex(p => p.id === activeParam.id) === allParameters.length - 1}
                      className="glass-btn p-2 text-slate-700 hover:text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Parameter Selanjutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Center Content: Rubrics + Workpaper + Bottom Nav */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-4 pr-2">
                {/* Rubric Section Toolbar: Title, View Switcher, Font Zoomer */}
                <div className="bg-white/60 backdrop-blur-sm p-2.5 rounded-2xl border border-white/80 shadow-xs flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-periwinkle-600 shrink-0" />
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      Rubrik Kriteria Pemenuhan:
                    </span>
                    {currentAssessment.score > 0 ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full shadow-2xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" /> Level {currentAssessment.score} Terpilih
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                        Klik kartu untuk memilih
                      </span>
                    )}
                  </div>

                  {/* Accessibility Controls: Font Size & View Mode */}
                  <div className="flex items-center gap-2">
                    {/* Font Size Adjuster (A- / A / A+) */}
                    <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                      <span className="text-[11px] font-bold text-slate-500 pl-1.5 pr-1 flex items-center gap-0.5">
                        <Type className="w-3 h-3" /> Teks:
                      </span>
                      <button
                        type="button"
                        onClick={() => setFontScale('normal')}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                          fontScale === 'normal'
                            ? 'bg-periwinkle-500 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Ukuran Standar"
                      >
                        A-
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontScale('large')}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                          fontScale === 'large'
                            ? 'bg-periwinkle-500 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Ukuran Sedang (Nyaman)"
                      >
                        A
                      </button>
                      <button
                        type="button"
                        onClick={() => setFontScale('xlarge')}
                        className={`px-2 py-1 rounded-lg text-xs font-bold transition ${
                          fontScale === 'xlarge'
                            ? 'bg-periwinkle-500 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Ukuran Besar (Ramah Lansia)"
                      >
                        A+
                      </button>
                    </div>

                    {/* View Mode Toggle: Mode Lega (Vertikal) vs 5 Kolom (Tabel) */}
                    <div className="flex items-center gap-1 bg-white/90 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setRubricViewMode('vertical')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                          rubricViewMode === 'vertical'
                            ? 'bg-periwinkle-500 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Tampilan Kartu Vertikal Penuh (Teks Sangat Mudah Dibaca)"
                      >
                        <List className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Mode Lega</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRubricViewMode('grid')}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                          rubricViewMode === 'grid'
                            ? 'bg-periwinkle-500 text-white shadow-xs'
                            : 'text-slate-600 hover:bg-slate-100'
                        }`}
                        title="Tampilan Matriks 5 Kolom"
                      >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">5 Kolom</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Rubric Criteria: Vertical Lega (Default) vs Grid 5-Kolom */}
                {rubricViewMode === 'vertical' ? (
                  /* MODE LEGA / RAMAH LANSIA (Vertikal Bertingkat Full-Width) */
                  <div className="space-y-2.5">
                    {levelConfigs.map(cfg => {
                      const isSelected = currentAssessment.score === cfg.lvl;
                      const text = activeParam.criteria[cfg.lvl as 1 | 2 | 3 | 4 | 5] || '(Mengacu pada ketentuan juknis)';

                      return (
                        <motion.div
                          key={cfg.lvl}
                          whileHover={{ scale: 1.006 }}
                          whileTap={{ scale: 0.994 }}
                          onClick={() => handleSelectScore(cfg.lvl)}
                          className={`p-3.5 sm:p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150 ${
                            isSelected ? cfg.borderSelected : cfg.borderIdle
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 mb-2 pb-1.5 border-b border-slate-200/60">
                            <div className="flex items-center gap-2.5">
                              <span className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-sm shadow-xs ${cfg.badgeClass}`}>
                                {cfg.lvl}
                              </span>
                              <div>
                                <span className={`font-bold text-sm sm:text-base ${isSelected ? 'text-slate-950 font-extrabold' : 'text-slate-800'}`}>
                                  {cfg.name}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isSelected ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-xs shadow-sm">
                                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                                  <span>Terpilih</span>
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="px-3 py-1 rounded-full bg-white/95 border border-slate-300 text-slate-700 font-bold text-xs hover:bg-periwinkle-50 hover:border-periwinkle-400 hover:text-periwinkle-700 transition shadow-2xs"
                                >
                                  Pilih Skor {cfg.lvl}
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="pl-1 sm:pl-2">
                            <CriteriaRenderer
                              rawText={text}
                              textClass={textScale.criteria}
                              isSelected={isSelected}
                              isGrid={false}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  /* MODE 5 KOLOM (Tampilan Tabel Grid Ringkas) */
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
                    {levelConfigs.map(cfg => {
                      const isSelected = currentAssessment.score === cfg.lvl;
                      const text = activeParam.criteria[cfg.lvl as 1 | 2 | 3 | 4 | 5] || '(Mengacu pada ketentuan juknis)';

                      return (
                        <motion.div
                          key={cfg.lvl}
                          whileHover={{ y: -2, scale: 1.015 }}
                          whileTap={{ scale: 0.985 }}
                          onClick={() => handleSelectScore(cfg.lvl)}
                          className={`p-3 rounded-xl border-2 text-xs cursor-pointer transition flex flex-col justify-between ${
                            isSelected ? cfg.borderSelected : cfg.borderIdle
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between font-bold pb-1.5 mb-1.5 border-b border-slate-200/60">
                              <span className={isSelected ? 'text-slate-950 font-black' : 'text-slate-800'}>
                                Level {cfg.lvl}
                              </span>
                              {isSelected ? (
                                <span className="text-[10px] px-1.5 py-0.5 bg-emerald-600 text-white rounded-full font-bold shadow-xs">
                                  ✓ Aktif
                                </span>
                              ) : (
                                <span className="text-[10px] text-slate-500 font-medium truncate max-w-[70px]">
                                  {cfg.shortName}
                                </span>
                              )}
                            </div>
                            <div className="mt-1">
                              <CriteriaRenderer
                                rawText={text}
                                textClass={textScale.criteria}
                                isSelected={isSelected}
                                isGrid={true}
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Workpaper Form (Lampiran IV.A) - Lapang & Jelas */}
                <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 border border-white/80 space-y-3 shadow-glass">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-2 text-xs sm:text-sm">
                      <FileText className="w-4 h-4 text-periwinkle-600" />
                      Kertas Kerja Penilaian & Bukti Temuan (Lampiran IV.A)
                    </span>
                    <span className="text-xs text-slate-500 font-medium bg-white/90 px-2.5 py-1 rounded-md border border-slate-200/70 shadow-2xs">
                      💾 Tersimpan otomatis
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className={`${textScale.workpaperLabel} block mb-1.5`}>
                        Temuan / Gap Utama (Bagian A)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Catat kondisi aktual atau temuan gap di lapangan..."
                        value={currentAssessment.findings || ''}
                        onChange={e => onUpdateAssessment(activeParam.id, { findings: e.target.value })}
                        className={`glass-input w-full rounded-xl border border-slate-200/90 resize-none ${textScale.workpaperInput}`}
                      ></textarea>
                    </div>

                    <div>
                      <label className={`${textScale.workpaperLabel} block mb-1.5`}>
                        Kutipan & Bukti Penting (Bagian B)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Contoh: SK Direksi No..., SOP Bab 3, Risalah Rapat..."
                        value={currentAssessment.evidence || ''}
                        onChange={e => onUpdateAssessment(activeParam.id, { evidence: e.target.value })}
                        className={`glass-input w-full rounded-xl border border-slate-200/90 resize-none ${textScale.workpaperInput}`}
                      ></textarea>
                    </div>

                    <div>
                      <label className={`${textScale.workpaperLabel} block mb-1.5`}>
                        Sumber Data (Bagian C)
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Dokumen fungsi MR, wawancara VP / Direktur..."
                        value={currentAssessment.dataSource || ''}
                        onChange={e => onUpdateAssessment(activeParam.id, { dataSource: e.target.value })}
                        className={`glass-input w-full rounded-xl border border-slate-200/90 resize-none ${textScale.workpaperInput}`}
                      ></textarea>
                    </div>
                  </div>
                </div>

                {/* Bottom Sticky Navigation Bar: Sangat Membantu Lansia Setelah Membaca */}
                <div className="p-3.5 bg-white/70 backdrop-blur-md rounded-2xl border border-white/80 flex items-center justify-between gap-3 shadow-glass">
                  <button
                    onClick={handlePrev}
                    disabled={allParameters.findIndex(p => p.id === activeParam.id) === 0}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/90 border border-slate-200 text-slate-700 font-bold text-xs sm:text-sm hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Parameter Sebelumnya</span>
                  </button>

                  <div className="text-center hidden sm:block">
                    <span className="text-xs font-semibold text-slate-600 block">
                      Parameter <strong className="text-slate-900 font-bold">{activeParam.id}</strong> dari <strong className="text-slate-900 font-bold">{allParameters.length}</strong>
                    </span>
                    {currentAssessment.score > 0 ? (
                      <span className="text-xs font-bold text-emerald-600">
                        ✓ Sudah Dinilai: Level {currentAssessment.score}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium">
                        Belum ada skor yang dipilih
                      </span>
                    )}
                  </div>

                  <button
                    onClick={handleNext}
                    disabled={allParameters.findIndex(p => p.id === activeParam.id) === allParameters.length - 1}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-periwinkle-500 text-white font-bold text-xs sm:text-sm hover:bg-periwinkle-600 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-periwinkle-glow cursor-pointer"
                  >
                    <span>Parameter Selanjutnya</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
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
