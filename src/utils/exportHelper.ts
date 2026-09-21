import { CompleteAssessmentData } from '../types/rmi';
import { CalculationResult } from './calculator';
import { getParametersForModel } from './storage';

export function exportAssessmentToCsv(data: CompleteAssessmentData, calc: CalculationResult): void {
  const params = getParametersForModel(data.profile.model);

  const lines: string[] = [];
  
  // Header
  lines.push('FORMULIR RINGKASAN HASIL PENILAIAN INDEKS KEMATANGAN RISIKO (RISK MATURITY INDEX)');
  lines.push('Merujuk pada SK-8/DKU.MBU/12/2023 Kementerian BUMN');
  lines.push('');
  lines.push(`Nama BUMN,"${data.profile.companyName}"`);
  lines.push(`Tahun Penilaian,${data.profile.year}`);
  lines.push(`Nomor Laporan,"${data.profile.reportNumber}"`);
  lines.push(`Model Penilaian RMI,"${data.profile.model.toUpperCase()}"`);
  lines.push(`Tipe Penilaian,"${data.profile.assessmentType}"`);
  lines.push(`Tim Penilai,"${data.profile.assessorName}"`);
  lines.push(`Periode Observasi,"${data.profile.observationPeriod}"`);
  lines.push(`Total Skor RMI,${calc.finalRmiScore}`);
  lines.push(`Fase Kematangan,"${calc.maturityPhase.subLevel}"`);
  lines.push('');

  // Tabel 1: Aspek Dimensi
  lines.push('ASPEK DIMENSI');
  lines.push('Dimensi,Deskripsi Dimensi,Jumlah Parameter,Jumlah Dinilai,Skor Dimensi');
  calc.dimensions.forEach(d => {
    lines.push(`${d.dimNum},"${d.dimName}",${d.paramCount},${d.assessedCount},${d.score}`);
  });
  lines.push(`,"SKOR ASPEK DIMENSI",${calc.totalParameters},${calc.totalAssessed},${calc.dimensionAspectScore}`);
  lines.push('');

  // Tabel 2: Aspek Kinerja
  lines.push('ASPEK KINERJA');
  lines.push('No,Aspek Kinerja,Nilai Aspek,Nilai Konversi,Bobot,Nilai Konversi x Bobot');
  lines.push(`1,Tingkat Kesehatan Peringkat Akhir (Final Rating),"${data.performance.healthRating}",${calc.healthConversion},50%,${calc.healthWeighted}`);
  lines.push(`2,Peringkat Komposit Risiko,"${data.performance.compositeRating}",${calc.compositeConversion},50%,${calc.compositeWeighted}`);
  lines.push(`,"TOTAL SKOR ASPEK KINERJA",,,,"${calc.totalPerformanceScore}"`);
  lines.push(`,"PENYESUAIAN SKOR ASPEK DIMENSI",,,,"${calc.scoreAdjustment}"`);
  lines.push(`,"SKOR AKHIR RMI",,,,"${calc.finalRmiScore}"`);
  lines.push(`,"FASE KEMATANGAN",,,,"${calc.maturityPhase.subLevel}"`);
  lines.push('');

  // Tabel 3: Rincian Seluruh Parameter
  lines.push('RINCIAN PENILAIAN PER PARAMETER');
  lines.push('No,Dimensi,Sub Dimensi,Nama Parameter,Skor Terpilih (1-5),Temuan / Gap Utama,Kutipan & Bukti Penting,Sumber Data');
  params.forEach(p => {
    const a = data.assessments[p.id];
    const score = a?.score ?? 0;
    const findings = (a?.findings ?? '').replace(/"/g, '""');
    const evidence = (a?.evidence ?? '').replace(/"/g, '""');
    const src = (a?.dataSource ?? '').replace(/"/g, '""');
    const title = p.title.replace(/"/g, '""');
    const subdim = p.subdim.replace(/"/g, '""');

    lines.push(`${p.id},"Dimensi ${p.dim_num}","${subdim}","${title}",${score},"${findings}","${evidence}","${src}"`);
  });
  lines.push('');

  // Tabel 4: Rekomendasi & Pemantauan Tindak Lanjut (Lampiran V.B)
  lines.push('REKOMENDASI & PEMANTAUAN TINDAK LANJUT (LAMPIRAN V.B)');
  lines.push('No,Dimensi,Rekomendasi Perbaikan,Prioritas,Dampak,Kemudahan,Jangka Waktu,Aktivitas Utama,Output,Indikator,UIC,Target Selesai,Pemberi Target,Status');
  data.recommendations.forEach((r, idx) => {
    const rek = r.rekomendasi.replace(/"/g, '""');
    const akt = r.aktivitasUtama.replace(/"/g, '""');
    const out = r.output.replace(/"/g, '""');
    const ind = r.indikatorKeberhasilan.replace(/"/g, '""');
    const uic = r.uic.replace(/"/g, '""');
    lines.push(`${idx + 1},"Dimensi ${r.dimNum}","${rek}","Prioritas ${r.priority}","${r.impact}","${r.ease}","${r.timeframe}","${akt}","${out}","${ind}","${uic}","${r.targetDate}","${r.pemberiTarget}","${r.status}"`);
  });

  const csvContent = '\uFEFF' + lines.join('\r\n'); // Add UTF-8 BOM for Excel
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Laporan_RMI_${data.profile.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${data.profile.year}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportLampiranIvToCsv(data: CompleteAssessmentData, calc: CalculationResult): void {
  const params = getParametersForModel(data.profile.model);
  const lines: string[] = [];

  // Header Lampiran IV
  lines.push('LAMPIRAN IV: LEMBAR PENILAIAN INDEKS KEMATANGAN RISIKO (RMI)');
  lines.push('KEPUTUSAN DEPUTI BIDANG KEUANGAN DAN MANAJEMEN RISIKO KEMENTERIAN BUMN');
  lines.push('NOMOR: SK-8/DKU.MBU/12/2023 & UND-55/DKU.MBU/12/2023');
  lines.push('');
  lines.push(`Nama BUMN,"${data.profile.companyName}"`);
  lines.push(`Tahun Buku / Penilaian,${data.profile.year}`);
  lines.push(`Model Industri,"${data.profile.model.toUpperCase()}"`);
  lines.push(`Skor Total Aspek Dimensi,${calc.dimensionAspectScore}`);
  lines.push('');

  // 1. Lampiran IV.A
  lines.push('LAMPIRAN IV.A: LEMBAR PENILAIAN HASIL REVIU DOKUMEN DAN WAWANCARA');
  lines.push('No,Kode Param,Dimensi,Nama Parameter,Skor Terpilih (1-5),Kriteria Resmi,Temuan / Gap Utama (Kolom A),Kutipan & Bukti Penting (Kolom B),Sumber Data (Kolom C)');
  params.forEach(p => {
    const a = data.assessments[p.id];
    const score = a?.score ?? 0;
    const crit = ((p.criteria as any)[score] || '').replace(/"/g, '""');
    const findings = (a?.findings ?? '').replace(/"/g, '""');
    const evidence = (a?.evidence ?? '').replace(/"/g, '""');
    const src = (a?.dataSource ?? '').replace(/"/g, '""');
    const title = p.title.replace(/"/g, '""');

    lines.push(`${p.id},"P-${p.id}","Dimensi ${p.dim_num}","${title}",${score},"${crit}","${findings}","${evidence}","${src}"`);
  });
  lines.push('');

  // 2. Lampiran IV.B
  lines.push('LAMPIRAN IV.B: RINGKASAN PENILAIAN ASPEK DIMENSI');
  lines.push('Dimensi,Nama Dimensi,Skor Dimensi,Kekuatan / Aspek yang Sudah Baik (Strengths),Celah / Area Perbaikan (Gaps),Rekomendasi Jangka Pendek (< 1 Tahun),Rekomendasi Jangka Panjang (> 1 Tahun)');
  calc.dimensions.forEach(d => {
    const summary = data.dimensionSummaries?.[d.dimNum];
    const strengths = (summary?.strengths ?? '').replace(/"/g, '""');
    const gaps = (summary?.gaps ?? '').replace(/"/g, '""');
    const shortRec = (summary?.shortTermRec ?? '').replace(/"/g, '""');
    const longRec = (summary?.longTermRec ?? '').replace(/"/g, '""');

    lines.push(`"Dimensi ${d.dimNum}","${d.dimName}",${d.score},"${strengths}","${gaps}","${shortRec}","${longRec}"`);
  });
  lines.push(`"RATA-RATA","SKOR ASPEK DIMENSI",${calc.dimensionAspectScore},,,,`);
  lines.push('');

  // 3. Lampiran IV.C
  lines.push('LAMPIRAN IV.C: FORMAT BAKU REKOMENDASI HASIL PENILAIAN RMI (9 KOLOM)');
  lines.push('No (a),Rekomendasi (b),Kode Parameter Terkait (c),Jadwal Penyelesaian (d),Aktivitas Utama (e),Output (f),Indikator Keberhasilan (g),Unit In Charge / UIC (h),Penjelasan & Tujuan (i),Prioritas');
  data.recommendations.forEach((r, idx) => {
    const rek = r.rekomendasi.replace(/"/g, '""');
    const paramCode = r.paramId ? `P-${r.paramId}` : `Dimensi ${r.dimNum}`;
    const timeframe = r.timeframe;
    const akt = r.aktivitasUtama.replace(/"/g, '""');
    const out = r.output.replace(/"/g, '""');
    const ind = r.indikatorKeberhasilan.replace(/"/g, '""');
    const uic = r.uic.replace(/"/g, '""');
    const explanation = `Prioritas ${r.priority} (${r.impact} Dampak, ${r.ease} Kemudahan). Target: ${r.targetDate}`;
    lines.push(`${idx + 1},"${rek}","${paramCode}","${timeframe}","${akt}","${out}","${ind}","${uic}","${explanation}","Prioritas ${r.priority}"`);
  });

  const csvContent = '\uFEFF' + lines.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Lampiran_IV_RMI_${data.profile.companyName.replace(/[^a-zA-Z0-9]/g, '_')}_${data.profile.year}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

