import React from 'react';
import {
  Printer,
  FileSpreadsheet,
  Award
} from 'lucide-react';
import { CompleteAssessmentData } from '../types/rmi';
import { CalculationResult } from '../utils/calculator';
import { exportAssessmentToCsv } from '../utils/exportHelper';

interface OfficialReportViewProps {
  assessmentData: CompleteAssessmentData;
  calculation: CalculationResult;
}

export const OfficialReportView: React.FC<OfficialReportViewProps> = ({
  assessmentData,
  calculation
}) => {
  const { profile, performance } = assessmentData;
  const { maturityPhase } = calculation;

  const handlePrint = () => {
    window.print();
  };

  const handleExportCsv = () => {
    exportAssessmentToCsv(assessmentData, calculation);
  };

  const modelLabel =
    profile.model === 'umum'
      ? 'KBUMN – Industri Umum'
      : profile.model === 'perbankan'
      ? 'KBUMN – Industri Perbankan'
      : 'KBUMN – Industri Asuransi';

  return (
    <div className="space-y-4">
      {/* Action Bar (hidden when printing) */}
      <div className="print:hidden glass-card p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-periwinkle-100/90 text-periwinkle-600 flex items-center justify-center shadow-xs border border-periwinkle-200/60">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Format Laporan Resmi Hasil Penilaian RMI (Lampiran V.A)
            </h2>
            <p className="text-[11px] text-slate-500">
              Format baku SK Deputi Keuangan & Manajemen Risiko KBUMN No. SK-8/DKU.MBU/12/2023
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            className="glass-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-emerald-700 hover:text-emerald-800 border-emerald-200/60"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Ekspor Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="glass-btn-primary inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="bg-white/90 backdrop-blur-md rounded-2.5xl border border-white/90 shadow-glass p-6 sm:p-10 print:bg-white print:border-none print:shadow-none print:p-0 print:m-0 max-w-4xl mx-auto space-y-6 text-slate-900 font-sans">
        {/* Header */}
        <div className="text-center border-b-2 border-slate-900 pb-4 space-y-0.5">
          <div className="text-[11px] uppercase tracking-widest font-bold text-slate-600">
            KEMENTERIAN BADAN USAHA MILIK NEGARA REPUBLIK INDONESIA
          </div>
          <h1 className="text-base sm:text-lg font-extrabold uppercase tracking-tight text-slate-950">
            FORMULIR RINGKASAN HASIL PENILAIAN INDEKS KEMATANGAN RISIKO
            <br />
            (RISK MATURITY INDEX / RMI)
          </h1>
          <div className="text-[10px] text-slate-500 font-serif italic pt-0.5">
            Lampiran V.A Keputusan Deputi Bidang Keuangan dan Manajemen Risiko Nomor: SK-8/DKU.MBU/12/2023
          </div>
        </div>

        {/* Metadata Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs border border-slate-400">
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="w-1/3 p-2 font-bold bg-slate-100 border-r border-slate-300">
                  Nama BUMN
                </td>
                <td className="p-2 font-bold text-slate-950 uppercase">
                  {profile.companyName}
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-300">
                  Tahun Penilaian
                </td>
                <td className="p-2 font-mono">
                  {profile.year}
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-300">
                  Nomor Laporan
                </td>
                <td className="p-2 font-mono">
                  {profile.reportNumber}
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-300">
                  Model Penilaian RMI
                </td>
                <td className="p-2 font-semibold text-periwinkle-800">
                  {modelLabel}
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-300">
                  Metode & Pelaksana Penilaian
                </td>
                <td className="p-2">
                  Penilaian {profile.assessmentType} • {profile.assessorName}
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="p-2 font-bold bg-slate-100 border-r border-slate-300">
                  Periode Observasi
                </td>
                <td className="p-2">
                  {profile.observationPeriod}
                </td>
              </tr>
              <tr className="bg-periwinkle-50/60 border-b-2 border-slate-900">
                <td className="p-2.5 font-extrabold text-xs text-slate-900 border-r border-slate-300">
                  TOTAL SKOR RMI
                </td>
                <td className="p-2.5">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl font-black font-mono text-periwinkle-700">
                      {calculation.finalRmiScore.toFixed(2)}
                    </span>
                    <span className="text-[11px] px-2.5 py-0.5 bg-periwinkle-500 text-white rounded-full font-bold shadow-xs">
                      {maturityPhase.subLevel}
                    </span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Section 1: ASPEK DIMENSI */}
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">
            I. ASPEK DIMENSI
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-400">
              <thead className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400">
                <tr>
                  <th className="p-2 border-r border-slate-400 text-center w-24">Parameter</th>
                  <th className="p-2 border-r border-slate-400 text-center w-16">Dimensi</th>
                  <th className="p-2 border-r border-slate-400">Deskripsi Dimensi</th>
                  <th className="p-2 border-r border-slate-400 text-center w-24">Skor Dimensi</th>
                  <th className="p-2 text-center w-24">Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr>
                  <td className="p-1.5 text-center font-mono border-r border-slate-300">1 s.d. 3</td>
                  <td className="p-1.5 text-center font-bold border-r border-slate-300">1</td>
                  <td className="p-1.5 border-r border-slate-300 font-medium">Budaya dan Kapabiltas Risiko</td>
                  <td className="p-1.5 text-center font-mono font-bold border-r border-slate-300">
                    {calculation.dimensions[0]?.score.toFixed(2) ?? '-'}
                  </td>
                  <td className="p-1.5 bg-slate-50"></td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center font-mono border-r border-slate-300">4 s.d. 19</td>
                  <td className="p-1.5 text-center font-bold border-r border-slate-300">2</td>
                  <td className="p-1.5 border-r border-slate-300 font-medium">Organisasi dan Tata Kelola Risiko</td>
                  <td className="p-1.5 text-center font-mono font-bold border-r border-slate-300">
                    {calculation.dimensions[1]?.score.toFixed(2) ?? '-'}
                  </td>
                  <td className="p-1.5 bg-slate-50"></td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center font-mono border-r border-slate-300">20 s.d. 33</td>
                  <td className="p-1.5 text-center font-bold border-r border-slate-300">3</td>
                  <td className="p-1.5 border-r border-slate-300 font-medium">Kerangka Risiko dan Kepatuhan</td>
                  <td className="p-1.5 text-center font-mono font-bold border-r border-slate-300">
                    {calculation.dimensions[2]?.score.toFixed(2) ?? '-'}
                  </td>
                  <td className="p-1.5 bg-slate-50"></td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center font-mono border-r border-slate-300">34 s.d. 39</td>
                  <td className="p-1.5 text-center font-bold border-r border-slate-300">4</td>
                  <td className="p-1.5 border-r border-slate-300 font-medium">Proses dan Kontrol Risiko</td>
                  <td className="p-1.5 text-center font-mono font-bold border-r border-slate-300">
                    {calculation.dimensions[3]?.score.toFixed(2) ?? '-'}
                  </td>
                  <td className="p-1.5 bg-slate-50"></td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center font-mono border-r border-slate-300">
                    40 s.d. {calculation.totalParameters}
                  </td>
                  <td className="p-1.5 text-center font-bold border-r border-slate-300">5</td>
                  <td className="p-1.5 border-r border-slate-300 font-medium">Model, Data, dan Teknologi Risiko</td>
                  <td className="p-1.5 text-center font-mono font-bold border-r border-slate-300">
                    {calculation.dimensions[4]?.score.toFixed(2) ?? '-'}
                  </td>
                  <td className="p-1.5 bg-slate-50"></td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                  <td className="p-2 text-center font-mono border-r border-slate-400">
                    1 s.d. {calculation.totalParameters}
                  </td>
                  <td colSpan={2} className="p-2 border-r border-slate-400 uppercase tracking-wide">
                    SKOR ASPEK DIMENSI
                  </td>
                  <td colSpan={2} className="p-2 text-center font-mono text-sm font-extrabold text-periwinkle-700">
                    {calculation.dimensionAspectScore.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 2: ASPEK KINERJA */}
        <div className="space-y-1.5">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-800 border-b border-slate-300 pb-0.5">
            II. ASPEK KINERJA
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border border-slate-400">
              <thead className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400">
                <tr>
                  <th className="p-2 border-r border-slate-400 text-center w-10">No</th>
                  <th className="p-2 border-r border-slate-400">Aspek Kinerja</th>
                  <th className="p-2 border-r border-slate-400 text-center w-20">Nilai Aspek</th>
                  <th className="p-2 border-r border-slate-400 text-center w-20">Konversi</th>
                  <th className="p-2 border-r border-slate-400 text-center w-16">Bobot</th>
                  <th className="p-2 border-r border-slate-400 text-center w-28">Konversi × Bobot</th>
                  <th className="p-2 text-center w-20">Skor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-300">
                <tr>
                  <td className="p-1.5 text-center font-bold border-r border-slate-300">1</td>
                  <td className="p-1.5 border-r border-slate-300">
                    Tingkat Kesehatan Peringkat Akhir (Final Rating)
                  </td>
                  <td className="p-1.5 text-center font-bold border-r border-slate-300">
                    {performance.healthRating}
                  </td>
                  <td className="p-1.5 text-center font-mono border-r border-slate-300">
                    {calculation.healthConversion}
                  </td>
                  <td className="p-1.5 text-center border-r border-slate-300">50%</td>
                  <td className="p-1.5 text-center font-mono border-r border-slate-300">
                    {calculation.healthWeighted.toFixed(2)}
                  </td>
                  <td className="p-1.5 bg-slate-50"></td>
                </tr>
                <tr>
                  <td className="p-1.5 text-center font-bold border-r border-slate-300">2</td>
                  <td className="p-1.5 border-r border-slate-300">
                    Peringkat Komposit Risiko
                  </td>
                  <td className="p-1.5 text-center font-bold border-r border-slate-300">
                    Peringkat {performance.compositeRating}
                  </td>
                  <td className="p-1.5 text-center font-mono border-r border-slate-300">
                    {calculation.compositeConversion}
                  </td>
                  <td className="p-1.5 text-center border-r border-slate-300">50%</td>
                  <td className="p-1.5 text-center font-mono border-r border-slate-300">
                    {calculation.compositeWeighted.toFixed(2)}
                  </td>
                  <td className="p-1.5 bg-slate-50"></td>
                </tr>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                  <td className="p-2 text-center font-mono border-r border-slate-400">1 s.d. 2</td>
                  <td colSpan={4} className="p-2 border-r border-slate-400 uppercase tracking-wide">
                    SKOR ASPEK KINERJA
                  </td>
                  <td colSpan={2} className="p-2 text-center font-mono text-xs font-bold">
                    {calculation.totalPerformanceScore.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-t border-slate-300">
                  <td colSpan={5} className="p-2 text-right font-bold border-r border-slate-400 text-slate-800">
                    PENYESUAIAN SKOR ASPEK DIMENSI
                  </td>
                  <td colSpan={2} className="p-2 text-center font-mono font-bold text-xs text-slate-800">
                    {calculation.scoreAdjustment > 0
                      ? `+${calculation.scoreAdjustment.toFixed(2)}`
                      : calculation.scoreAdjustment.toFixed(2)}
                  </td>
                </tr>
                <tr className="bg-slate-900 text-white font-extrabold border-t-2 border-slate-900">
                  <td colSpan={5} className="p-2.5 text-right text-xs tracking-wider uppercase border-r border-slate-700">
                    SKOR AKHIR RMI (RISK MATURITY INDEX)
                  </td>
                  <td colSpan={2} className="p-2.5 text-center font-mono text-base text-periwinkle-300">
                    {calculation.finalRmiScore.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 3: Lembar Pengesahan */}
        <div className="pt-6 border-t-2 border-slate-900 space-y-4 break-inside-avoid">
          <div className="text-center font-bold text-[11px] uppercase text-slate-800">
            LEMBAR PENGESAHAN LAPORAN HASIL PENILAIAN RMI TAHUN BUKU {profile.year}
          </div>

          <div className="grid grid-cols-3 gap-4 text-center text-xs pt-2">
            <div className="space-y-12">
              <div className="font-semibold text-slate-700 text-[11px]">
                Pelaksana Penilaian RMI
                <br />
                <span className="font-normal text-[10px] text-slate-500">({profile.assessorName})</span>
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-[11px]">
                Ketua Tim Penilai
              </div>
            </div>

            <div className="space-y-12">
              <div className="font-semibold text-slate-700 text-[11px]">
                Mengetahui & Menyetujui,
                <br />
                <span className="font-normal text-[10px] text-slate-500">Direksi Pengelola Risiko</span>
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-[11px]">
                Direktur Keuangan & MR
              </div>
            </div>

            <div className="space-y-12">
              <div className="font-semibold text-slate-700 text-[11px]">
                Mengetahui,
                <br />
                <span className="font-normal text-[10px] text-slate-500">Dewan Komisaris / Pengawas</span>
              </div>
              <div className="border-t border-slate-400 pt-1 font-bold text-[11px]">
                Ketua Komite Pemantau Risiko
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
