import React, { useState, useMemo } from 'react';
import {
  FileCheck2,
  Search,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { CompleteAssessmentData, DocumentChecklistItem } from '../types/rmi';

interface DocumentChecklistProps {
  assessmentData: CompleteAssessmentData;
  onUpdateChecklist: (checklist: DocumentChecklistItem[]) => void;
}

export const DocumentChecklist: React.FC<DocumentChecklistProps> = ({
  assessmentData,
  onUpdateChecklist
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'missing'>('all');

  const checklist = assessmentData.documentChecklist || [];

  const handleToggleAvailable = (id: number) => {
    const updated = checklist.map(item => {
      if (item.id === id) {
        return { ...item, tersedia: !item.tersedia };
      }
      return item;
    });
    onUpdateChecklist(updated);
  };

  const handleUpdateNotes = (id: number, catatan: string) => {
    const updated = checklist.map(item => {
      if (item.id === id) {
        return { ...item, catatan };
      }
      return item;
    });
    onUpdateChecklist(updated);
  };

  const filteredItems = useMemo(() => {
    return checklist.filter(item => {
      if (filterStatus === 'available' && !item.tersedia) return false;
      if (filterStatus === 'missing' && item.tersedia) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesData = item.kebutuhan_data.toLowerCase().includes(q);
        const matchesDoc = item.dokumen_sumber.toLowerCase().includes(q);
        const matchesNotes = item.catatan?.toLowerCase().includes(q);
        if (!matchesData && !matchesDoc && !matchesNotes) return false;
      }

      return true;
    });
  }, [checklist, filterStatus, searchQuery]);

  const total = checklist.length;
  const availableCount = checklist.filter(i => i.tersedia).length;
  const percentage = total > 0 ? Math.round((availableCount / total) * 100) : 0;

  return (
    <div className="space-y-3 flex flex-col max-h-[calc(100vh-140px)]">
      {/* Header & Controls Bar */}
      <div className="glass-card p-3.5 shrink-0 space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-periwinkle-100/90 text-periwinkle-600 flex items-center justify-center shadow-xs border border-periwinkle-200/60">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Checklist Kebutuhan Data & Dokumen (Lampiran III)
              </h2>
              <p className="text-[11px] text-slate-500">
                Verifikasi 168 berkas dan data rujukan asesmen tingkat kematangan risiko
              </p>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-sm border border-white/80 px-3.5 py-1.5 rounded-xl shadow-glass shrink-0">
            <span className="text-xs text-slate-700 font-semibold">Tersedia:</span>
            <span className="font-mono font-bold text-xs text-periwinkle-700">
              {availableCount} / {total} ({percentage}%)
            </span>
            <div className="w-24 bg-slate-200/70 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-periwinkle-400 to-periwinkle-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2 pt-1 border-t border-white/60">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Cari kebutuhan data atau berkas dokumen..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="glass-input w-full pl-8 pr-3 py-1.5 text-xs"
            />
          </div>

          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as any)}
            className="glass-input text-xs px-3 py-1.5 shrink-0"
          >
            <option value="all">Semua ({total})</option>
            <option value="available">Tersedia ({availableCount})</option>
            <option value="missing">Belum Ada ({total - availableCount})</option>
          </select>
        </div>
      </div>

      {/* Internal Scrollable Table */}
      <div className="glass-card overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-y-auto flex-1 no-scrollbar">
          <table className="w-full text-xs text-left">
            <thead className="bg-white/70 backdrop-blur-md text-slate-700 font-bold border-b border-white/80 sticky top-0 z-10">
              <tr>
                <th className="p-3 w-12 text-center">No</th>
                <th className="p-3 w-24 text-center">Status</th>
                <th className="p-3 w-2/5">Input / Data yang Dibutuhkan</th>
                <th className="p-3 w-1/3">Nama / Dokumen yang Memuat Data</th>
                <th className="p-3">Keterangan / Nomor Berkas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/70">
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 text-xs">
                    Tidak ada dokumen yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr
                    key={item.id}
                    className={`transition duration-150 ${
                      item.tersedia ? 'bg-periwinkle-50/30' : 'hover:bg-white/50'
                    }`}
                  >
                    <td className="p-2.5 text-center font-bold text-slate-400 font-mono">
                      {item.id}
                    </td>
                    <td className="p-2.5 text-center">
                      <button
                        onClick={() => handleToggleAvailable(item.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition duration-150 ${
                          item.tersedia
                            ? 'bg-periwinkle-500 text-white shadow-periwinkle-glow'
                            : 'bg-white/70 text-slate-600 hover:bg-white border border-white/80 shadow-xs'
                        }`}
                      >
                        {item.tersedia ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-white" />
                            <span>Ada</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-slate-400" />
                            <span>Tidak</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-2.5 font-medium text-slate-800 leading-snug">
                      {item.kebutuhan_data}
                    </td>
                    <td className="p-2.5 text-slate-600 leading-snug">
                      {item.dokumen_sumber}
                    </td>
                    <td className="p-2.5">
                      <input
                        type="text"
                        placeholder="Catatan berkas..."
                        value={item.catatan || ''}
                        onChange={e => handleUpdateNotes(item.id, e.target.value)}
                        className="glass-input w-full text-xs px-2.5 py-1"
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
