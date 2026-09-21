import React, { useState } from 'react';
import { Building, RotateCcw, X } from 'lucide-react';
import { AssessmentProfile, CompleteAssessmentData, IndustryModel } from '../types/rmi';
import { INDUSTRY_MODELS } from '../data/rmiCommon';
import { createNewAssessment } from '../utils/storage';
import { getPtAbcSampleData } from '../data/sampleDataPtAbc';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: AssessmentProfile;
  onSaveProfile: (profile: AssessmentProfile) => void;
  onNewAssessment: (data: CompleteAssessmentData) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
  onNewAssessment
}) => {
  if (!isOpen) return null;

  const [companyName, setCompanyName] = useState(currentProfile.companyName);
  const [year, setYear] = useState(currentProfile.year);
  const [reportNumber, setReportNumber] = useState(currentProfile.reportNumber);
  const [model, setModel] = useState<IndustryModel>(currentProfile.model);
  const [assessmentType, setAssessmentType] = useState<'Internal' | 'Independen'>(currentProfile.assessmentType);
  const [assessorName, setAssessorName] = useState(currentProfile.assessorName);
  const [observationPeriod, setObservationPeriod] = useState(currentProfile.observationPeriod);
  const [assessmentDate, setAssessmentDate] = useState(currentProfile.assessmentDate);

  const [activeTab, setActiveTab] = useState<'edit' | 'new'>('edit');

  const [newCompanyName, setNewCompanyName] = useState('');
  const [newYear, setNewYear] = useState(new Date().getFullYear());
  const [newModel, setNewModel] = useState<IndustryModel>('umum');
  const [newType, setNewType] = useState<'Internal' | 'Independen'>('Internal');

  const handleSaveCurrent = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...currentProfile,
      companyName,
      year,
      reportNumber,
      model,
      assessmentType,
      assessorName,
      observationPeriod,
      assessmentDate,
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompanyName.trim()) {
      alert('Nama BUMN wajib diisi.');
      return;
    }
    const newData = createNewAssessment(newCompanyName, newYear, newModel, newType);
    onNewAssessment(newData);
    onClose();
  };

  const handleLoadSample = () => {
    if (confirm('Muat data contoh resmi PT ABC Tahun 2022 dari Juknis KBUMN?')) {
      onNewAssessment(getPtAbcSampleData());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="glass-panel max-w-lg w-full p-6 shadow-2xl space-y-4 my-8 rounded-3xl border border-white/85 bg-white/95">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-periwinkle-100/90 text-periwinkle-600 flex items-center justify-center shadow-xs border border-periwinkle-200/60">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">
                Pengaturan Penilaian & Profil BUMN
              </h3>
              <p className="text-[10px] text-slate-500">
                Konfigurasi profil korporasi dan pemilihan model industri
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex rounded-2xl bg-white/60 p-1 border border-white/80 shadow-glass text-xs">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex-1 py-1.5 rounded-xl font-bold transition duration-150 ${
              activeTab === 'edit'
                ? 'bg-periwinkle-500 text-white shadow-periwinkle-glow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ubah Penilaian Aktif
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`flex-1 py-1.5 rounded-xl font-bold transition duration-150 ${
              activeTab === 'new'
                ? 'bg-periwinkle-500 text-white shadow-periwinkle-glow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Buat Penilaian Baru
          </button>
        </div>

        {/* Tab 1: Edit Profile */}
        {activeTab === 'edit' ? (
          <form onSubmit={handleSaveCurrent} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nama BUMN *
              </label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                className="glass-input w-full p-2.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tahun Penilaian *
                </label>
                <input
                  type="number"
                  required
                  value={year}
                  onChange={e => setYear(parseInt(e.target.value))}
                  className="glass-input w-full p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nomor Laporan
                </label>
                <input
                  type="text"
                  value={reportNumber}
                  onChange={e => setReportNumber(e.target.value)}
                  className="glass-input w-full p-2.5 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Model Penilaian RMI (Sektor Industri) *
              </label>
              <div className="space-y-2">
                {INDUSTRY_MODELS.map(m => (
                  <label
                    key={m.id}
                    className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition duration-150 ${
                      model === m.id
                        ? 'bg-periwinkle-50/90 border-periwinkle-400 ring-2 ring-periwinkle-200 shadow-glass'
                        : 'bg-white/60 border-white/80 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="model"
                      value={m.id}
                      checked={model === m.id}
                      onChange={() => setModel(m.id)}
                      className="mt-0.5 text-periwinkle-600 focus:ring-periwinkle-400"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        {m.label} ({m.paramCount} Parameter)
                      </div>
                      <div className="text-[10px] text-slate-500">{m.subLabel}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Metode Penilaian
                </label>
                <select
                  value={assessmentType}
                  onChange={e => setAssessmentType(e.target.value as any)}
                  className="glass-input w-full p-2.5"
                >
                  <option value="Internal">Penilaian Internal</option>
                  <option value="Independen">Penilai Independen</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Pelaksana / Tim
                </label>
                <input
                  type="text"
                  value={assessorName}
                  onChange={e => setAssessorName(e.target.value)}
                  className="glass-input w-full p-2.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Periode Observasi
                </label>
                <input
                  type="text"
                  value={observationPeriod}
                  onChange={e => setObservationPeriod(e.target.value)}
                  className="glass-input w-full p-2.5"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tanggal Laporan
                </label>
                <input
                  type="date"
                  value={assessmentDate}
                  onChange={e => setAssessmentDate(e.target.value)}
                  className="glass-input w-full p-2.5"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/70">
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-periwinkle-600 hover:text-periwinkle-800 flex items-center gap-1.5 text-[11px] font-semibold transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset ke PT ABC</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="glass-btn px-4 py-2 text-slate-600 hover:text-slate-900 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="glass-btn-primary px-5 py-2 font-bold rounded-xl"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleCreateNew} className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Nama BUMN Baru *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: PT Kereta Api Indonesia (Persero)"
                value={newCompanyName}
                onChange={e => setNewCompanyName(e.target.value)}
                className="glass-input w-full p-2.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Tahun Penilaian *
                </label>
                <input
                  type="number"
                  required
                  value={newYear}
                  onChange={e => setNewYear(parseInt(e.target.value))}
                  className="glass-input w-full p-2.5 font-mono"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Metode Penilaian
                </label>
                <select
                  value={newType}
                  onChange={e => setNewType(e.target.value as any)}
                  className="glass-input w-full p-2.5"
                >
                  <option value="Internal">Penilaian Internal</option>
                  <option value="Independen">Penilai Independen</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Pilih Model Industri *
              </label>
              <div className="space-y-2">
                {INDUSTRY_MODELS.map(m => (
                  <label
                    key={m.id}
                    className={`flex items-start gap-2.5 p-3 rounded-2xl border cursor-pointer transition duration-150 ${
                      newModel === m.id
                        ? 'bg-periwinkle-50/90 border-periwinkle-400 ring-2 ring-periwinkle-200 shadow-glass'
                        : 'bg-white/60 border-white/80 hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="newModel"
                      value={m.id}
                      checked={newModel === m.id}
                      onChange={() => setNewModel(m.id)}
                      className="mt-0.5 text-periwinkle-600 focus:ring-periwinkle-400"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">
                        {m.label} ({m.paramCount} Parameter)
                      </div>
                      <div className="text-[10px] text-slate-500">{m.subLabel}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-white/70">
              <button
                type="button"
                onClick={onClose}
                className="glass-btn px-4 py-2 text-slate-600 hover:text-slate-900 rounded-xl"
              >
                Batal
              </button>
              <button
                type="submit"
                className="glass-btn-primary px-5 py-2 font-bold rounded-xl"
              >
                Buat Penilaian
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
