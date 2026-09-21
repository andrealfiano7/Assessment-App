# Sistem Pengukuran Maturitas Risiko (Risk Maturity Index / RMI) BUMN

Aplikasi web interaktif untuk pengukuran, penilaian mandiri (self-assessment), evaluasi kinerja, analisis kesenjangan (gap analysis), penyusunan rekomendasi perbaikan, pemantauan tindak lanjut, serta pelaporan resmi tingkat maturitas risiko Badan Usaha Milik Negara (BUMN) dan anak perusahaannya.

Dasar hukum dan rujukan teknis:
- **Keputusan Deputi Bidang Keuangan dan Manajemen Risiko Kementerian BUMN Nomor: SK-8/DKU.MBU/12/2023** tentang *Petunjuk Teknis Penilaian Indeks Kematangan Risiko (Risk Maturity Index) di Lingkungan Badan Usaha Milik Negara*.
- **Surat Undangan Nomor: UND-55/DKU.MBU/12/2023** tentang *Penyampaian Salinan dan Undangan Sosialisasi Juknis RMI BUMN*.

---

## 🌟 Fitur Utama Aplikasi

### 1. Mendukung 3 Model Sektor Industri (Lampiran II Juknis)
- **KBUMN – Industri Umum**: 42 Parameter untuk BUMN non-keuangan, holding, dan anak perusahaan.
- **KBUMN – Industri Perbankan**: 40 Parameter spesifik perbankan.
- **KBUMN – Industri Asuransi**: 40 Parameter spesifik industri asuransi dan penjaminan.

### 2. Evaluasi 5 Dimensi Maturitas Risiko (Parameter Level 1 s.d. 5)
- **Dimensi 1**: Budaya dan Kapabilitas Risiko
- **Dimensi 2**: Organisasi dan Tata Kelola Risiko
- **Dimensi 3**: Kerangka Risiko dan Kepatuhan
- **Dimensi 4**: Proses dan Kontrol Risiko
- **Dimensi 5**: Model, Data, dan Teknologi Risiko
- Dilengkapi **rubrik kriteria lengkap Level 1 s.d. 5** dan **kertas kerja penilaian (Temuan, Kutipan & Bukti, Sumber Data)** sesuai format Lampiran IV.A Juknis.

### 3. Mesin Kalkulasi Skor Berbasis Kinerja (Bab II Juknis)
- **Skor Aspek Dimensi**: Rata-rata dari seluruh parameter yang dinilai.
- **Aspek Kinerja Korporasi**:
  - Tingkat Kesehatan Peringkat Akhir (Final Rating): AAA (100) s.d. C (10) dengan bobot 50%.
  - Peringkat Komposit Risiko: Peringkat 1 (100) s.d. Peringkat 5 (10) dengan bobot 50%.
- **Penyesuaian Skor Otomatis**:
  - Penyesuaian skor hanya aktif jika Skor Aspek Dimensi $\ge 3,00$ (jika $< 3,00$ penyesuaian otomatis $= 0,00$).
  - Skala penyesuaian: $\le 50$ ($-1,00$), $50 < x \le 65$ ($-0,75$), $65 < x \le 80$ ($-0,50$), $80 < x \le 90$ ($-0,25$), $> 90$ ($0,00$).
- **Klasifikasi Spektrum Kematangan (9 Sub-Tingkat)**:
  - Fase Awal ($1,00 - 1,49$), Fase Awal (+) ($1,50 - 1,89$)
  - Fase Berkembang ($1,90 - 2,49$), Fase Berkembang (+) ($2,50 - 2,89$)
  - Fase Praktik yang Baik ($2,90 - 3,49$), Fase Praktik yang Baik (+) ($3,50 - 3,89$)
  - Fase Praktik yang Lebih Baik ($3,90 - 4,49$), Fase Praktik yang Lebih Baik (+) ($4,50 - 4,89$)
  - Fase Praktik Terbaik ($4,90 - 5,00$).

### 4. Checklist Kebutuhan Data & Dokumen (Lampiran III)
- 168 butir inventaris dokumen dan data rujukan audit.
- Status checklist interaktif (Ada/Tidak) serta kolom catatan nomor SK/lokasi berkas.

### 5. Analisis Celah & Matriks Prioritas Rekomendasi (Lampiran IV.C)
- Analisis kesenjangan (Gap) terhadap target maturitas yang ditetapkan.
- Matriks Prioritas 4 Kuadran (Dampak Tinggi/Rendah vs Kemudahan Mudah/Sulit):
  - **Prioritas 1**: Dampak Tinggi & Mudah (Quick Wins)
  - **Prioritas 2**: Dampak Rendah & Mudah ATAU Dampak Tinggi & Sulit
  - **Prioritas 3**: Dampak Rendah & Sulit

### 6. Pemantauan Tindak Lanjut Triwulanan (Lampiran V.B)
- Pelacakan status tindak lanjut rekomendasi:
  - **S**: Sesuai dengan Rekomendasi
  - **BS**: Belum Sesuai dengan Rekomendasi
  - **BD**: Rekomendasi Belum Ditindaklanjuti
  - **TDD**: Rekomendasi Tidak Dapat Ditindaklanjuti

### 7. Laporan Resmi KBUMN (Lampiran V.A) & Fitur Ekspor
- Tampilan Formulir Ringkasan Hasil Penilaian RMI baku sesuai format resmi Kementerian BUMN.
- Lembar pengesahan tanda tangan (Tim Penilai, Direksi, Dewan Komisaris).
- Ekspor ke Excel (.csv) dengan format rapi dan UTF-8 BOM.
### 8. Desain Modern Liquid Glass & Cloud Database Ready
- Antarmuka modern **Liquid Glass Translucent** dengan dynamic blur, specular rim highlight, dan sticky dock side menu.
- **Dukungan Supabase Cloud Database**: Sinkronisasi data real-time ke PostgreSQL Supabase dengan fallback aman otomatis ke Local Storage browser.
- **Siap Launch di Vercel**: Konfigurasi routing SPA (`vercel.json`) dan variabel lingkungan terintegrasi.

---

## 🗄️ Konfigurasi Supabase Cloud Database

Aplikasi ini telah dilengkapi skema database SQL siap pakai:
1. Buka dashboard [Supabase](https://supabase.com) dan buat proyek baru (gratis).
2. Masuk ke menu **SQL Editor** di sidebar Supabase.
3. Buka berkas `supabase_setup.sql` (atau `supabase/schema.sql`) di proyek ini, salin seluruh isinya, lalu klik **Run**.
4. Masuk ke **Project Settings -> API**, salin `Project URL` dan `anon / public key`.
5. Buat berkas `.env` (atau set di Vercel Environment Variables):
   ```env
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJh......
   ```
*(Catatan: Tanpa Supabase pun aplikasi tetap berjalan 100% normal dan menyimpan otomatis ke Local Storage browser).*

---

## 🚀 Cara Menjalankan Aplikasi & Deploy

### Persyaratan Sistem
- Node.js (versi 18+)
- Web Browser modern (Chrome, Edge, Firefox, Safari)

### Langkah Menjalankan Lokal
1. Masuk ke direktori proyek:
   ```bash
   cd e:\Apps\RMI
   ```
2. Jalankan development server:
   ```bash
   npm run dev
   ```
   atau di Windows PowerShell:
   ```powershell
   npm.cmd run dev
   ```
3. Buka URL yang muncul di terminal (misal `http://localhost:5175`).

### Deploy ke Vercel (1 Klik)
1. Import repositori GitHub `Assessment-App` ke [Vercel](https://vercel.com).
2. Pada **Environment Variables**, tambahkan:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Klik **Deploy**. Aplikasi langsung live dengan HTTPS dan global CDN!

---

## 📂 Struktur Berkas Proyek

```
e:\Apps\RMI\
├── package.json               # Konfigurasi dependensi dan skrip proyek
├── vite.config.ts             # Konfigurasi Vite bundler
├── tsconfig.json              # Konfigurasi TypeScript
├── tailwind.config.js         # Konfigurasi Tailwind CSS
├── index.html                 # Entry point HTML
├── src/
│   ├── main.tsx               # Bootstrapping React DOM
│   ├── App.tsx                # Komponen utama navigasi tab & state
│   ├── index.css              # Styling global & optimasi cetak (@media print)
│   ├── types/
│   │   └── rmi.ts             # TypeScript interfaces & types
│   ├── data/
│   │   ├── rmiCommon.ts       # Definisi 5 dimensi, skala spektrum, konversi rating
│   │   ├── rmiUmum.json       # Dataset 42 parameter Industri Umum & kriteria
│   │   ├── rmiPerbankan.json  # Dataset 40 parameter Industri Perbankan
│   │   ├── rmiAsuransi.json   # Dataset 40 parameter Industri Asuransi
│   │   ├── checklistDokumen.json # 168 data checklist dokumen Lampiran III
│   │   └── sampleDataPtAbc.ts # Data awal contoh resmi PT ABC Tahun 2022
│   ├── utils/
│   │   ├── calculator.ts      # Mesin kalkulasi formula baku Bab II
│   │   ├── exportHelper.ts    # Generator ekspor Excel/CSV & cetak
│   │   └── storage.ts         # Penyimpanan lokal multi-asesmen
│   └── components/
│       ├── Header.tsx         # Top bar, profil aktif, aksi ekspor/impor
│       ├── Dashboard.tsx      # Executive dashboard, gauge meter, radar chart
│       ├── RadarChart.tsx     # Komponen Radar/Spider Chart 5 Dimensi (SVG)
│       ├── AssessmentView.tsx # Lembar kuesioner penilaian rubrik level 1-5
│       ├── PerformanceView.tsx# Kalkulator aspek kinerja & matriks penyesuaian
│       ├── DocumentChecklist.tsx # Checklist inventaris dokumen Lampiran III
│       ├── GapAnalysisView.tsx# Matriks kesenjangan & prioritas rekomendasi
│       ├── FollowUpMonitoring.tsx # Pemantauan tindak lanjut Lampiran V.B
│       ├── OfficialReportView.tsx # Format Formulir Ringkasan Lampiran V.A
│       └── ProfileModal.tsx   # Modal pemilihan industri & identitas BUMN
```
