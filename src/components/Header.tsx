import React, { useRef, useState } from 'react';
import {
  Search,
  X,
  FileSpreadsheet,
  Download,
  Upload,
  RotateCcw,
  Printer,
  Sparkles,
  Menu,
  Cloud,
  Database
} from 'lucide-react';
import { CompleteAssessmentData } from '../types/rmi';
import { CalculationResult } from '../utils/calculator';
import { exportAssessmentToCsv } from '../utils/exportHelper';
import { exportAssessmentToJson, importAssessmentFromJson } from '../utils/storage';
import { isSupabaseConfigured } from '../utils/supabaseClient';
import { getPtAbcSampleData } from '../data/sampleDataPtAbc';

interface HeaderProps {
  assessmentData: CompleteAssessmentData;
  calculation: CalculationResult;
  onOpenProfileModal: () => void;
  onUpdateAssessmentData: (data: CompleteAssessmentData) => void;
  onPrintReport: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  assessmentData,
  calculation,
  onOpenProfileModal,
  onUpdateAssessmentData,
  onPrintReport,
  onToggleMobileSidebar
}) => {
  const [globalSearch, setGlobalSearch] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportCsv = () => {
    exportAssessmentToCsv(assessmentData, calculation);
  };

  const handleExportJson = () => {
    exportAssessmentToJson(assessmentData);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const text = event.target?.result as string;
        const imported = importAssessmentFromJson(text);
        onUpdateAssessmentData(imported);
        alert('Data penilaian RMI berhasil dimuat!');
      } catch (err: any) {
        alert('Gagal mengimpor berkas: ' + err.message);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetToSample = () => {
    if (confirm('Muat ulang data sampel resmi PT ABC (Tahun 2022) dari Juknis KBUMN?')) {
      const sample = getPtAbcSampleData();
      onUpdateAssessmentData(sample);
    }
  };

  const modelBadge =
    assessmentData.profile.model === 'umum'
      ? 'Model Umum'
      : assessmentData.profile.model === 'perbankan'
      ? 'Perbankan'
      : 'Asuransi';

  return (
    <header className="glass-card px-4 py-2.5 shrink-0 flex items-center justify-between gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
      {/* Left: Mobile Toggle & Global Search Pill (From UI Kit) */}
      <div className="flex items-center gap-2.5 flex-1 max-w-md">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden glass-btn p-2 text-slate-700"
            title="Buka Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Capsule Search Input (Exact from UI Kit interactive specs) */}
        <div className="relative w-full">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Cari parameter, juknis, dokumen..."
            value={globalSearch}
            onChange={e => setGlobalSearch(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-md rounded-full pl-9 pr-8 py-1.5 text-xs border border-white/90 shadow-[inset_0_1px_3px_rgba(0,0,0,0.03)] focus:bg-white focus:border-[#6531F7] focus:ring-2 focus:ring-[#6531F7]/20 transition-all outline-none"
          />
          {globalSearch && (
            <button
              onClick={() => setGlobalSearch('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Right Controls: Model Pill & Quick Action Tools */}
      <div className="flex items-center gap-2">
        {/* Model Indicator Chip */}
        <button
          onClick={onOpenProfileModal}
          className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 border border-white/90 text-xs font-semibold hover:bg-white transition cursor-pointer shadow-xs"
          title="Ubah Model & Profil"
        >
          <span className="w-2 h-2 rounded-full bg-[#6531F7] animate-pulse"></span>
          <span className="text-slate-700">{assessmentData.profile.companyName}</span>
          <span className="text-[10px] px-1.5 py-0.2 bg-[#6531F7]/10 text-[#6531F7] rounded-md font-bold">
            {modelBadge}
          </span>
        </button>

        {/* Storage / Cloud Status Indicator */}
        {isSupabaseConfigured ? (
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-700 text-[11px] font-semibold"
            title="Tersinkronisasi otomatis dengan Supabase Cloud Database"
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>Supabase Cloud</span>
          </div>
        ) : (
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-500/10 border border-slate-400/20 text-slate-600 text-[11px] font-medium"
            title="Data tersimpan di Local Storage browser. Tambahkan kredensial Supabase di .env untuk sinkronisasi cloud."
          >
            <Database className="w-3.5 h-3.5 text-slate-500" />
            <span>Local Storage</span>
          </div>
        )}

        {/* Live Score Chip */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-purple-50 to-indigo-50/70 border border-[#6531F7]/25 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#6531F7]" />
          <span className="text-[11px] font-bold text-slate-600">RMI:</span>
          <span className="font-black text-xs text-[#6531F7]">
            {calculation.finalRmiScore.toFixed(2)}
          </span>
        </div>

        {/* Action Icon Tools */}
        <div className="flex items-center space-x-0.5 border-l border-white/80 pl-2">
          <button
            onClick={handleExportCsv}
            className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-white/80 rounded-xl transition cursor-pointer"
            title="Ekspor CSV / Excel"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
          </button>

          <button
            onClick={handleExportJson}
            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-white/80 rounded-xl transition cursor-pointer"
            title="Cadangkan Data (JSON)"
          >
            <Download className="w-4 h-4 text-blue-600" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 text-slate-600 hover:text-amber-700 hover:bg-white/80 rounded-xl transition cursor-pointer"
            title="Pulihkan Cadangan (JSON)"
          >
            <Upload className="w-4 h-4 text-amber-600" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImportJson}
            className="hidden"
          />

          <button
            onClick={handleResetToSample}
            className="p-1.5 text-slate-600 hover:text-[#6531F7] hover:bg-white/80 rounded-xl transition cursor-pointer hidden md:block"
            title="Muat Sampel PT ABC"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onPrintReport}
            className="p-1.5 text-slate-600 hover:text-[#6531F7] hover:bg-white/80 rounded-xl transition cursor-pointer"
            title="Cetak Laporan Resmi (PDF)"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
