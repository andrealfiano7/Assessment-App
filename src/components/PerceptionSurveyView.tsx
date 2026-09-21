import React, { useState, useMemo } from 'react';
import {
  CompleteAssessmentData,
  SurveySubmission,
  RespondentGroup,
  PerceptionSurveyData
} from '../types/rmi';
import { CalculationResult } from '../utils/calculator';
import {
  SURVEY_QUESTIONS,
  RESPONDENT_GROUPS,
  LIKERT_OPTIONS
} from '../data/perceptionSurveyQuestions';
import { SAMPLE_SURVEY_SUBMISSIONS } from '../data/samplePerceptionData';
import {
  MessageSquareQuote,
  CheckCircle2,
  Users,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Send,
  Sparkles,
  Download,
  RotateCcw,
  Plus,
  ShieldCheck,
  Check,
  ChevronRight,
  UserCheck,
  Building2,
  FileSpreadsheet,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PerceptionSurveyViewProps {
  assessmentData: CompleteAssessmentData;
  calculation: CalculationResult;
  onUpdatePerceptionSurvey: (data: PerceptionSurveyData) => void;
}

export const PerceptionSurveyView: React.FC<PerceptionSurveyViewProps> = ({
  assessmentData,
  calculation,
  onUpdatePerceptionSurvey
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'form' | 'recap'>('recap');

  // Form State
  const [selectedGroup, setSelectedGroup] = useState<RespondentGroup>('lini1');
  const [respondentName, setRespondentName] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [surveyNotes, setSurveyNotes] = useState<string>('');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState<boolean>(false);
  const [filterGroup, setFilterGroup] = useState<string>('all');

  // Submissions list
  const submissions = useMemo(() => {
    return assessmentData.perceptionSurvey?.submissions || SAMPLE_SURVEY_SUBMISSIONS;
  }, [assessmentData.perceptionSurvey?.submissions]);

  // Handle select answer
  const handleSelectScore = (questionId: string, score: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / SURVEY_QUESTIONS.length) * 100);

  // Submit form
  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (answeredCount < SURVEY_QUESTIONS.length) {
      alert(`Mohon jawab seluruh ${SURVEY_QUESTIONS.length} pertanyaan kuesioner sebelum mengirimkan.`);
      return;
    }

    const newSubmission: SurveySubmission = {
      id: `sub-${Date.now()}`,
      respondentName: respondentName.trim() || 'Anonim',
      respondentGroup: selectedGroup,
      department: department.trim() || 'Unit Kerja Umum',
      answers: { ...answers },
      notes: surveyNotes.trim(),
      submittedAt: new Date().toISOString()
    };

    const updatedSubmissions = [newSubmission, ...submissions];
    onUpdatePerceptionSurvey({ submissions: updatedSubmissions });

    setIsSubmittedSuccess(true);
    // Reset form after short delay
    setTimeout(() => {
      setAnswers({});
      setRespondentName('');
      setDepartment('');
      setSurveyNotes('');
      setIsSubmittedSuccess(false);
      setActiveSubTab('recap');
    }, 1800);
  };

  // Reset to default sample
  const handleResetSample = () => {
    if (confirm('Apakah Anda yakin ingin mengatur ulang data kuesioner ke 22 responden sampel PT ABC?')) {
      onUpdatePerceptionSurvey({ submissions: SAMPLE_SURVEY_SUBMISSIONS });
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Nama Responden', 'Kelompok Responden', 'Unit/Departemen', 'Tanggal Kirim', 'Skor Rata-rata'];
    const rows = submissions.map(s => {
      const vals = Object.values(s.answers);
      const avg = vals.length > 0 ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(2) : '0.00';
      const groupLabel = RESPONDENT_GROUPS.find(g => g.id === s.respondentGroup)?.shortLabel || s.respondentGroup;
      return [
        s.id,
        `"${s.respondentName || 'Anonim'}"`,
        `"${groupLabel}"`,
        `"${s.department}"`,
        s.submittedAt.split('T')[0],
        avg
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekapitulasi_Survei_Persepsi_${assessmentData.profile.companyName}_${assessmentData.profile.year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ANALYTICS CALCULATIONS
  const stats = useMemo(() => {
    if (submissions.length === 0) {
      return {
        total: 0,
        overallAvg: 0,
        dimAverages: [0, 0, 0, 0, 0],
        groupAverages: {} as Record<RespondentGroup, number>,
        groupCounts: {} as Record<RespondentGroup, number>
      };
    }

    // Per Dimension averages
    const dimTotals = [0, 0, 0, 0, 0];
    const dimCounts = [0, 0, 0, 0, 0];

    // Group breakdown
    const groupScoreTotals: Record<string, number> = {};
    const groupAnswerCounts: Record<string, number> = {};
    const groupRespondents: Record<string, number> = {
      dekom: 0,
      direksi: 0,
      lini1: 0,
      lini2: 0,
      lini3: 0
    };

    submissions.forEach(sub => {
      groupRespondents[sub.respondentGroup] = (groupRespondents[sub.respondentGroup] || 0) + 1;

      Object.entries(sub.answers).forEach(([qId, val]) => {
        const question = SURVEY_QUESTIONS.find(q => q.id === qId);
        if (question) {
          const dIdx = question.dimNum - 1;
          dimTotals[dIdx] += val;
          dimCounts[dIdx] += 1;

          groupScoreTotals[sub.respondentGroup] = (groupScoreTotals[sub.respondentGroup] || 0) + val;
          groupAnswerCounts[sub.respondentGroup] = (groupAnswerCounts[sub.respondentGroup] || 0) + 1;
        }
      });
    });

    const dimAverages = dimTotals.map((tot, idx) => {
      return dimCounts[idx] > 0 ? parseFloat((tot / dimCounts[idx]).toFixed(2)) : 0;
    });

    const totalAllScores = dimTotals.reduce((a, b) => a + b, 0);
    const totalAllCount = dimCounts.reduce((a, b) => a + b, 0);
    const overallAvg = totalAllCount > 0 ? parseFloat((totalAllScores / totalAllCount).toFixed(2)) : 0;

    const groupAverages: Record<string, number> = {};
    Object.keys(groupRespondents).forEach(grp => {
      const count = groupAnswerCounts[grp] || 0;
      groupAverages[grp] = count > 0 ? parseFloat((groupScoreTotals[grp] / count).toFixed(2)) : 0;
    });

    return {
      total: submissions.length,
      overallAvg,
      dimAverages,
      groupAverages: groupAverages as Record<RespondentGroup, number>,
      groupCounts: groupRespondents as Record<RespondentGroup, number>
    };
  }, [submissions]);

  // Dimension details for comparison with document assessment
  const dimensionComparisons = useMemo(() => {
    const names = [
      'Budaya dan Kapabilitas Risiko',
      'Organisasi dan Tata Kelola Risiko',
      'Kerangka Risiko dan Kepatuhan',
      'Proses dan Kontrol Risiko',
      'Model, Data, dan Teknologi Risiko'
    ];

    return names.map((name, idx) => {
      const dimNum = idx + 1;
      const perceptionScore = stats.dimAverages[idx] || 0;
      const assessorScore = calculation.dimensions[idx]?.score || 0;
      const gap = parseFloat((perceptionScore - assessorScore).toFixed(2));

      let interpretation = 'Selaras dengan Bukti Dokumen';
      let tagColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
      if (gap > 0.35) {
        interpretation = 'Persepsi Lebih Optimis dari Dokumen (Blindspot Potensial)';
        tagColor = 'bg-amber-100 text-amber-800 border-amber-300';
      } else if (gap < -0.35) {
        interpretation = 'Persepsi Lebih Kritis dari Dokumen (Perlu Sosialisasi)';
        tagColor = 'bg-blue-100 text-blue-800 border-blue-300';
      }

      return {
        dimNum,
        name,
        perceptionScore,
        assessorScore,
        gap,
        interpretation,
        tagColor
      };
    });
  }, [stats, calculation]);

  // Filtered submissions list for table
  const filteredSubmissions = useMemo(() => {
    if (filterGroup === 'all') return submissions;
    return submissions.filter(s => s.respondentGroup === filterGroup);
  }, [submissions, filterGroup]);

  return (
    <div className="space-y-4 max-w-[1400px] mx-auto pb-10">
      {/* 1. Header & Tab Navigation Bar */}
      <div className="glass-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-periwinkle-500 to-indigo-600 text-white flex items-center justify-center shadow-periwinkle-glow shrink-0">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Survei Persepsi Maturitas Risiko (RMI)
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-periwinkle-100 text-periwinkle-700 font-bold text-xs border border-periwinkle-300">
                Juknis KBUMN SK-8
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Instrumen pengujian silang (cross-check) persepsi 5 Dimensi antara Dewan Komisaris, Direksi, dan Lini 1, 2, 3.
            </p>
          </div>
        </div>

        {/* Tab Switcher & Quick Tools */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-white/80 p-1 rounded-xl border border-slate-200/80 shadow-2xs">
            <button
              onClick={() => setActiveSubTab('recap')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'recap'
                  ? 'bg-periwinkle-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>Rekapitulasi & Analisis Gap</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeSubTab === 'recap' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {submissions.length}
              </span>
            </button>

            <button
              onClick={() => setActiveSubTab('form')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeSubTab === 'form'
                  ? 'bg-periwinkle-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Formulir Kuesioner Baru</span>
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="glass-btn px-3 py-1.5 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
            title="Download Rekap Kuesioner ke format CSV / Excel"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Ekspor CSV</span>
          </button>

          <button
            onClick={handleResetSample}
            className="glass-btn px-3 py-1.5 text-xs font-semibold text-slate-700 flex items-center gap-1.5"
            title="Reset ke data sampel 22 responden PT ABC"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Sampel</span>
          </button>
        </div>
      </div>

      {/* 2. TAB 1: FORMULIR PENGISIAN KUESIONER (UNTUK RESPONDEN) */}
      {activeSubTab === 'form' && (
        <form onSubmit={handleSubmitSurvey} className="space-y-4">
          {/* Form Respondent Identity Card */}
          <div className="glass-card p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/70">
              <UserCheck className="w-5 h-5 text-periwinkle-600" />
              <h3 className="text-sm font-bold text-slate-900">
                Identitas Responden (Anonimitas Terjamin)
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Kelompok Responden */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kelompok Responden (Sesuai Juknis KBUMN) *
                </label>
                <select
                  value={selectedGroup}
                  onChange={e => setSelectedGroup(e.target.value as RespondentGroup)}
                  className="glass-input w-full p-2.5 text-xs font-medium rounded-xl border border-slate-300"
                >
                  {RESPONDENT_GROUPS.map(g => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Pilih organ pengawasan / lini kerja Anda saat ini.
                </span>
              </div>

              {/* Unit Kerja / Departemen */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Unit Kerja / Divisi / Departemen *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Divisi Operasional / Pemasaran / HR"
                  value={department}
                  onChange={e => setDepartment(e.target.value)}
                  className="glass-input w-full p-2.5 text-xs rounded-xl border border-slate-300"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Departemen tempat Anda bertugas di BUMN.
                </span>
              </div>

              {/* Nama Responden (Opsional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Nama Responden (Opsional / Boleh Dikosongkan)
                </label>
                <input
                  type="text"
                  placeholder="Dapat dikosongkan untuk survei anonim"
                  value={respondentName}
                  onChange={e => setRespondentName(e.target.value)}
                  className="glass-input w-full p-2.5 text-xs rounded-xl border border-slate-300"
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Hasil pengisian digunakan untuk analisis agregat institusional.
                </span>
              </div>
            </div>
          </div>

          {/* Sticky Progress Bar */}
          <div className="glass-card p-3 sticky top-3 z-20 flex items-center justify-between gap-4 bg-white/90 backdrop-blur-md shadow-glass">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-800">
                Progres Pengisian:
              </span>
              <span className="text-xs font-mono font-bold text-periwinkle-700 bg-periwinkle-100 px-2 py-0.5 rounded-md">
                {answeredCount} / {SURVEY_QUESTIONS.length} Pertanyaan ({progressPercent}%)
              </span>
            </div>

            <div className="flex-1 max-w-xs h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-periwinkle-500 to-indigo-600 transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <button
              type="submit"
              disabled={answeredCount < SURVEY_QUESTIONS.length}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-periwinkle-500 text-white font-bold text-xs hover:bg-periwinkle-600 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-periwinkle-glow cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Jawaban Survei</span>
            </button>
          </div>

          {/* Success Banner */}
          {isSubmittedSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-2xl bg-emerald-500 text-white flex items-center gap-3 shadow-lg"
            >
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <div>
                <strong className="block text-sm font-bold">Terima Kasih! Jawaban Kuesioner Berhasil Disimpan.</strong>
                <span className="text-xs text-emerald-100">Data survei persepsi Anda telah ditambahkan ke dalam database evaluasi.</span>
              </div>
            </motion.div>
          )}

          {/* Questions Grouped by Dimension */}
          {[1, 2, 3, 4, 5].map(dimNum => {
            const dimQuestions = SURVEY_QUESTIONS.filter(q => q.dimNum === dimNum);
            const dimName = dimQuestions[0]?.dimName || `Dimensi ${dimNum}`;

            return (
              <div key={dimNum} className="glass-card p-4 sm:p-5 space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-200/70">
                  <span className="w-7 h-7 rounded-lg bg-periwinkle-500 text-white font-bold text-xs flex items-center justify-center font-mono">
                    D{dimNum}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    {dimName}
                  </h3>
                </div>

                <div className="space-y-4">
                  {dimQuestions.map((q, qIndex) => {
                    const selectedVal = answers[q.id];

                    return (
                      <div
                        key={q.id}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition ${
                          selectedVal
                            ? 'bg-periwinkle-50/50 border-periwinkle-200'
                            : 'bg-white/60 border-slate-200/80 hover:bg-white/80'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2.5">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[11px] font-mono font-bold text-periwinkle-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                                Butir {q.id}
                              </span>
                              <span className="text-xs font-semibold text-slate-600">
                                {q.subtopic}
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                              {q.question}
                            </p>
                          </div>
                        </div>

                        {/* Likert 5 Options (Big Tactile Buttons for Seniors) */}
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 mt-3 pt-2 border-t border-slate-100">
                          {LIKERT_OPTIONS.map(opt => {
                            const isChosen = selectedVal === opt.value;

                            return (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => handleSelectScore(q.id, opt.value)}
                                className={`p-2.5 rounded-xl border text-left flex items-center sm:flex-col sm:items-center sm:text-center justify-between sm:justify-center gap-2 transition cursor-pointer ${
                                  isChosen
                                    ? 'bg-periwinkle-500 text-white border-periwinkle-400 shadow-periwinkle-glow font-bold scale-[1.02]'
                                    : 'bg-white/90 border-slate-200 text-slate-700 hover:bg-periwinkle-50/60 hover:border-periwinkle-300'
                                }`}
                              >
                                <span className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                                  isChosen ? 'bg-white text-periwinkle-600' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {opt.value}
                                </span>
                                <span className="text-xs font-semibold">
                                  {opt.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Form Footer / Submit */}
          <div className="glass-card p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-600">
              Pastikan seluruh <strong>{SURVEY_QUESTIONS.length} butir pertanyaan</strong> telah terisi sebelum menekan tombol kirim.
            </div>

            <button
              type="submit"
              disabled={answeredCount < SURVEY_QUESTIONS.length}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-periwinkle-500 text-white font-bold text-sm hover:bg-periwinkle-600 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-periwinkle-glow cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Kirim Jawaban Kuesioner Persepsi</span>
            </button>
          </div>
        </form>
      )}

      {/* 3. TAB 2: REKAPITULASI & ANALISIS GAP (UNTUK ASESOR & DIREKSI) */}
      {activeSubTab === 'recap' && (
        <div className="space-y-4">
          {/* Top 4 KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* Card 1: Total Responden */}
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Total Responden</span>
                <span className="p-2 rounded-xl bg-periwinkle-100 text-periwinkle-600">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-slate-900 mt-2 font-mono">
                {stats.total} <span className="text-xs font-sans text-slate-500 font-semibold">Orang</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Dekom: {stats.groupCounts.dekom || 0} • Dir: {stats.groupCounts.direksi || 0} • L1: {stats.groupCounts.lini1 || 0} • L2: {stats.groupCounts.lini2 || 0} • L3: {stats.groupCounts.lini3 || 0}
              </div>
            </div>

            {/* Card 2: Rata-rata Skor Persepsi Pegawai */}
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Rata-rata Skor Persepsi</span>
                <span className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                  <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-emerald-600 mt-2 font-mono">
                {stats.overallAvg.toFixed(2)} <span className="text-xs font-sans text-slate-500 font-semibold">/ 5.00</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                Fase: {stats.overallAvg >= 4 ? 'Level 4 (Lebih Baik)' : stats.overallAvg >= 3 ? 'Level 3 (Praktik Baik)' : 'Level 2 (Berkembang)'}
              </div>
            </div>

            {/* Card 3: Skor Evaluasi Asesor (Bukti Dokumen) */}
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Skor Asesmen Dokumen (Asesor)</span>
                <span className="p-2 rounded-xl bg-indigo-100 text-indigo-600">
                  <ShieldCheck className="w-4 h-4" />
                </span>
              </div>
              <div className="text-2xl font-black text-indigo-600 mt-2 font-mono">
                {calculation.finalRmiScore.toFixed(2)} <span className="text-xs font-sans text-slate-500 font-semibold">/ 5.00</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Hasil evaluasi 42 parameter formal KBUMN
              </div>
            </div>

            {/* Card 4: Indeks Celah Persepsi (Gap Analysis) */}
            <div className="glass-card p-4 relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">Celah Persepsi vs Realita</span>
                <span className="p-2 rounded-xl bg-amber-100 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </span>
              </div>
              {(() => {
                const diff = parseFloat((stats.overallAvg - calculation.finalRmiScore).toFixed(2));
                return (
                  <>
                    <div className={`text-2xl font-black mt-2 font-mono ${diff > 0 ? 'text-amber-600' : 'text-blue-600'}`}>
                      {diff > 0 ? `+${diff.toFixed(2)}` : diff.toFixed(2)}
                    </div>
                    <div className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                      {diff > 0.3
                        ? '⚠️ Persepsi cenderung lebih optimis'
                        : diff < -0.3
                        ? '🔍 Persepsi lebih kritis dari bukti'
                        : '✓ Sangat selaras dengan bukti'}
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* 5-Dimension Perception vs Assessor Comparison Table */}
          <div className="glass-card p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-periwinkle-600" />
                  Matriks Perbandingan: Persepsi Responden vs Asesmen Bukti Dokumen
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Identifikasi potensi blindspot atau kesenjangan pemahaman antara kebijakan formal dan persepsi operasional di lapangan.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-700">
                    <th className="p-3 font-bold">Dimensi RMI KBUMN</th>
                    <th className="p-3 font-bold text-center">Skor Persepsi (Survei)</th>
                    <th className="p-3 font-bold text-center">Skor Asesor (Dokumen)</th>
                    <th className="p-3 font-bold text-center">Selisih (Gap)</th>
                    <th className="p-3 font-bold">Analisis & Interpretasi Juknis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {dimensionComparisons.map(comp => (
                    <tr key={comp.dimNum} className="hover:bg-white/60 transition">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-md bg-periwinkle-100 text-periwinkle-700 font-mono font-bold text-[11px] flex items-center justify-center">
                            D{comp.dimNum}
                          </span>
                          <span className="font-bold text-slate-800">{comp.name}</span>
                        </div>
                      </td>

                      {/* Skor Persepsi */}
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-mono font-bold text-xs border border-emerald-200">
                          {comp.perceptionScore.toFixed(2)}
                        </span>
                      </td>

                      {/* Skor Asesor */}
                      <td className="p-3 text-center">
                        <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-mono font-bold text-xs border border-indigo-200">
                          {comp.assessorScore.toFixed(2)}
                        </span>
                      </td>

                      {/* Gap */}
                      <td className="p-3 text-center">
                        <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-md font-mono font-bold text-xs ${
                          comp.gap > 0 ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {comp.gap > 0 ? `+${comp.gap.toFixed(2)}` : comp.gap.toFixed(2)}
                        </span>
                      </td>

                      {/* Interpretasi */}
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${comp.tagColor}`}>
                          {comp.interpretation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Breakdown per Respondent Group (Three Lines Comparison) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Per Group Average Bar Visual */}
            <div className="glass-card p-4 sm:p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-periwinkle-600" />
                Rata-rata Persepsi Berdasarkan Organ / Kelompok Lini
              </h3>
              <p className="text-xs text-slate-500">
                Membandingkan tingkat optimisme pengelolaan risiko antar lini kerja.
              </p>

              <div className="space-y-3 pt-2">
                {RESPONDENT_GROUPS.map(grp => {
                  const avg = stats.groupAverages[grp.id] || 0;
                  const count = stats.groupCounts[grp.id] || 0;
                  const pct = (avg / 5) * 100;

                  return (
                    <div key={grp.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-800">
                          {grp.label} ({count} resp.)
                        </span>
                        <span className="font-mono font-bold text-periwinkle-700">
                          {avg.toFixed(2)} / 5.00
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
                        <div
                          className="h-full bg-gradient-to-r from-periwinkle-500 to-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Key Insight & Recommendation for Interview */}
            <div className="glass-card p-4 sm:p-5 space-y-3 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-periwinkle-600" />
                  Rekomendasi Pendalaman Tahap Wawancara (Juknis Hal. 13-14)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Panduan bagi Tim Penilai untuk memverifikasi area dengan kesenjangan persepsi tertinggi saat wawancara mendalam.
                </p>

                <div className="mt-3 space-y-2.5">
                  <div className="p-3 rounded-xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 space-y-1">
                    <strong className="block font-bold">1. Pendalaman Lini Pertama (Unit Bisnis):</strong>
                    <span>Lini 1 cenderung menilai proses mitigasi dan sistem data lebih rendah. Gali kendala penginputan data risiko operasional di lapangan.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-blue-50/90 border border-blue-200 text-xs text-blue-900 space-y-1">
                    <strong className="block font-bold">2. Uji Efektivitas Tiga Lini (Three Lines Model):</strong>
                    <span>Konfirmasi apakah Lini 2 (Risk Officer) telah diberi wewenang yang cukup untuk memberikan second opinion independen dalam persetujuan proyek.</span>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-50/90 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                    <strong className="block font-bold">3. Kesiapan Sistem IT & Data Risiko:</strong>
                    <span>Pastikan dashboard risiko terintegrasi dan Early Warning System (EWS) telah memiliki batas ambang (threshold) yang terukur.</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/70 text-[11px] text-slate-500 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-periwinkle-500 shrink-0" />
                <span>Hasil kuesioner ini otomatis menjadi bukti dukung (sumber data) Lampiran IV.A Kertas Kerja Penilaian.</span>
              </div>
            </div>
          </div>

          {/* Submissions List Table */}
          <div className="glass-card p-4 sm:p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Daftar Responden & Lembar Jawaban Masuk ({filteredSubmissions.length})
                </h3>
                <span className="text-xs text-slate-500">
                  Riwayat pengisian kuesioner survei persepsi individual.
                </span>
              </div>

              {/* Filter by Group */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-600">Filter Lini:</span>
                <select
                  value={filterGroup}
                  onChange={e => setFilterGroup(e.target.value)}
                  className="glass-input text-xs px-2.5 py-1.5 rounded-lg border border-slate-300"
                >
                  <option value="all">Semua Kelompok</option>
                  <option value="dekom">Dewan Komisaris / KPR</option>
                  <option value="direksi">Direksi</option>
                  <option value="lini1">Lini 1 (Bisnis / Operasional)</option>
                  <option value="lini2">Lini 2 (Risk & Compliance)</option>
                  <option value="lini3">Lini 3 (SPI / Audit)</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/60 text-slate-700">
                    <th className="p-2.5 font-bold">Responden</th>
                    <th className="p-2.5 font-bold">Kelompok Lini</th>
                    <th className="p-2.5 font-bold">Unit Kerja</th>
                    <th className="p-2.5 font-bold text-center">Rata-rata Skor</th>
                    <th className="p-2.5 font-bold">Catatan / Masukan</th>
                    <th className="p-2.5 font-bold">Waktu Pengisian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSubmissions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-slate-400 text-xs">
                        Tidak ada data responden untuk filter ini.
                      </td>
                    </tr>
                  ) : (
                    filteredSubmissions.map(sub => {
                      const groupMeta = RESPONDENT_GROUPS.find(g => g.id === sub.respondentGroup);
                      const scores = Object.values(sub.answers);
                      const avg = scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2) : '0.00';

                      return (
                        <tr key={sub.id} className="hover:bg-white/60 transition">
                          <td className="p-2.5 font-bold text-slate-900">
                            {sub.respondentName || 'Anonim'}
                          </td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded-md font-semibold text-[11px] border ${groupMeta?.badgeColor || 'bg-slate-100 text-slate-700'}`}>
                              {groupMeta?.shortLabel || sub.respondentGroup}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-700">
                            {sub.department}
                          </td>
                          <td className="p-2.5 text-center font-mono font-bold text-periwinkle-700">
                            {avg}
                          </td>
                          <td className="p-2.5 text-slate-600 max-w-xs truncate" title={sub.notes || '-'}>
                            {sub.notes || '-'}
                          </td>
                          <td className="p-2.5 text-slate-500 text-[11px]">
                            {sub.submittedAt.split('T')[0]}
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
      )}
    </div>
  );
};
