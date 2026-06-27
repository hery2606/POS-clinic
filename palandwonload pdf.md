# 📄 Planning Final — Fitur Download PDF Laporan Dashboard

> Aplikasi: React + Vite + TypeScript  
> Halaman target: `features/analitik/pages/Dashboard/index.tsx`  
> Strategi: **Hybrid** — `@react-pdf/renderer` untuk layout PDF formal + `html2canvas` khusus capture chart

---

## 🧱 Struktur File yang Akan Dibuat / Diubah

```
src/features/analitik/components/
└── 📁 print/
    ├── print-formal-report-template.tsx   ← EDIT (sudah ada, isi dengan real data)
    ├── pdfConfig.ts                       ← BARU: konstanta, info klinik, penandatangan
    └── 📁 pdf-sections/
        ├── PdfCoverHeader.tsx             ← BARU: header klinik + tanggal cetak
        ├── PdfKpiSection.tsx              ← BARU: 3 KPI cards dalam tabel PDF
        ├── PdfChartSection.tsx            ← BARU: wrapper <Image> untuk 3 chart
        ├── PdfRevenueTable.tsx            ← BARU: tabel transaksi detail
        └── PdfSignatureFooter.tsx         ← BARU: tanda tangan + disclaimer

src/features/analitik/hooks/
└── useDashboardPdfData.ts                 ← BARU: ambil + format semua data untuk PDF

src/hooks/
└── usePdfDownload.ts                      ← BARU: orchestrator capture chart + generate PDF
```

---

## 📦 Install

```bash
npm install @react-pdf/renderer html2canvas
npm install -D @types/html2canvas
```

### Wajib: update `vite.config.ts`

```ts
export default defineConfig({
  optimizeDeps: {
    exclude: ['@react-pdf/renderer'],
  },
})
```

> Tanpa ini, Vite akan error saat development karena `@react-pdf/renderer` menggunakan
> modul Node.js yang tidak kompatibel dengan Vite's optimizer.

---

## 🔄 Alur Lengkap Saat Tombol Download Diklik

```
User klik tombol "Download Laporan"
          │
          ▼
[1] useDashboardPdfData
    └── ambil data KPI dari React Query cache
    └── ambil data tabel transaksi (sudah real)
    └── ambil filter periode aktif dari state dashboard
    └── format semua angka ke Rupiah (Intl.NumberFormat)
    └── format semua tanggal ke "DD MMM YYYY"
          │
          ▼
[2] captureCharts() — html2canvas, berurutan
    ├── capture ref ChartAreaInteractive  → base64 PNG
    ├── capture ref ChartBarMixed         → base64 PNG
    └── capture ref ChartBarStacked       → base64 PNG
          │
          ▼
[3] Semua data + 3 base64 image siap
    └── pass sebagai props ke print-formal-report-template.tsx
          │
          ▼
[4] @react-pdf/renderer render <Document>
    ├── Halaman 1
    │   ├── PdfCoverHeader
    │   ├── PdfKpiSection
    │   └── PdfChartSection (3 chart sebagai <Image>)
    └── Halaman 2+ (auto jika konten meluap)
        ├── PdfRevenueTable (tabel transaksi, auto-wrap antar halaman)
        └── PdfSignatureFooter (selalu di akhir)
          │
          ▼
[5] pdf.toBlob() → buat URL → trigger download
    └── nama file: laporan-dashboard-2026-06-27.pdf
          │
          ▼
[6] Loading state selesai, tombol kembali aktif
```

---

## 📋 Detail Tiap Phase

### Phase 1 — Install & Config
**File yang disentuh:** `vite.config.ts`, `package.json`

- [ ] Install `@react-pdf/renderer` dan `html2canvas`
- [ ] Update `vite.config.ts` dengan `optimizeDeps.exclude`
- [ ] Pastikan build tidak error dengan `npm run dev`

---

### Phase 2 — `pdfConfig.ts`
**File baru:** `src/features/analitik/components/print/pdfConfig.ts`

Isi konstanta yang akan dipakai di seluruh template:

```ts
export const PDF_CONFIG = {
  pageSize: 'A4',
  margin: { top: 40, right: 40, bottom: 40, left: 40 },
}

export const KLINIK_INFO = {
  nama: 'SmartClinik Indonesia',             // ganti sesuai data asli
  alamat: 'Jl. Prof. DR. Soepomo SH No.23, Warungboto, Yogyakarta',
  labelDokumen: 'DOKUMEN EKSEKUTIF',
}

export const PENANDATANGAN = {
  jabatan: 'Direktur Operasional',
  nama: 'Super Admin, S.Kom',                // hardcoded, disambung ke authStore nanti
  nip: '17811099432',
  disclaimer: 'Dokumen sah diterbitkan otomatis digital melalui sistem SmartClinik RME.',
}
```

---

### Phase 3 — `useDashboardPdfData.ts`
**File baru:** `src/features/analitik/hooks/useDashboardPdfData.ts`

Hook ini mengambil semua data yang dibutuhkan PDF dari React Query cache dan state lokal.

**Output yang dihasilkan hook:**

```ts
type DashboardPdfData = {
  // KPI
  pendapatanHariIni: string        // "Rp 4.950.000"
  pendapatanMingguIni: string      // "Rp 34.500.000"
  totalPendapatanBulanan: string   // "Rp 148.500.000"
  trendHarian: string              // "+3.4% vs rata-rata harian"
  trendMingguan: string            // "+4.13% vs target omzet"
  statusBulanan: string            // "Status Periode Berjalan Aktif"

  // Periode
  periodLabel: string              // "Dashboard Analitik (Mingguan)"
  tanggalCetak: string             // "27 Juni 2026"

  // Tabel transaksi
  transaksi: Array<{
    tanggal: string                // "15 Nov 2023"
    totalTransaksi: number         // 42
    pendapatanLayanan: string      // "Rp 2.800.000"
    pendapatanObat: string         // "Rp 1.450.000"
    totalPendapatan: string        // "Rp 4.250.000"
  }>

  // Status
  isReady: boolean
}
```

---

### Phase 4 — PDF Section Components
**Folder baru:** `src/features/analitik/components/print/pdf-sections/`

Semua komponen menggunakan primitif dari `@react-pdf/renderer`:  
`View`, `Text`, `Image`, `StyleSheet` — **bukan** komponen HTML/React biasa.

#### `PdfCoverHeader.tsx`
- Logo placeholder (inisial "S" dalam kotak teal)
- Nama klinik (bold, besar)
- Alamat klinik (abu-abu)
- Label "DOKUMEN EKSEKUTIF" (kanan atas, teal)
- Tanggal cetak (kanan, abu-abu)
- Garis separator bawah (teal)

#### `PdfKpiSection.tsx`
- Judul section: "LAPORAN EKSEKUTIF ANALITIK & PENDAPATAN"
- Subtitle: "Periode Frekuensi Analisis: [periodLabel]"
- 3 card KPI dalam row:
  - Pendapatan Hari Ini + trend harian
  - Pendapatan Minggu Ini + trend mingguan
  - Total Pendapatan Bulanan + status

#### `PdfChartSection.tsx`
- Terima props: `{ chartAreaBase64, chartBarMixedBase64, chartBarStackedBase64 }`
- Render tiap chart dengan `<Image src={base64} />` dari `@react-pdf/renderer`
- Judul di atas tiap chart (bold, kecil)
- Prop `wrap={false}` pada tiap chart agar tidak terpotong di tengah halaman

#### `PdfRevenueTable.tsx`
- Judul section: "I. RINCIAN LAPORAN RINGKASAN"
- Kolom: Tanggal | Total Transaksi | Pendapatan Layanan | Pendapatan Obat | Total Pendapatan
- Header kolom: background abu-abu gelap, teks putih
- Baris data: alternating background (putih / abu-abu sangat terang)
- Kolom "Total Pendapatan": teks teal, bold
- **Auto-wrap otomatis** — `@react-pdf/renderer` handle multi-page sendiri

#### `PdfSignatureFooter.tsx`
- Area tanda tangan kanan bawah
- Jabatan, nama (underline), NIP
- Disclaimer legal (italic, kecil) di pojok kiri bawah

---

### Phase 5 — `usePdfDownload.ts`
**File baru:** `src/hooks/usePdfDownload.ts`

Orchestrator utama, menggabungkan html2canvas + @react-pdf/renderer.

**Fungsi utama:**

```ts
const { downloadPdf, isLoading } = usePdfDownload({
  chartRefs: {
    chartArea: refChartArea,       // React.RefObject<HTMLDivElement>
    chartBarMixed: refBarMixed,
    chartBarStacked: refBarStacked,
  },
  data: dashboardPdfData,
})
```

**Langkah internal:**
1. Set `isLoading = true`
2. Jalankan `html2canvas` pada tiap chart ref secara berurutan (bukan parallel, untuk stabilitas)
3. Convert tiap canvas ke `base64` dengan `.toDataURL('image/png')`
4. Panggil `pdf(<PrintFormalReportTemplate ... />).toBlob()`
5. Buat object URL dari blob → trigger download → revoke URL
6. Set `isLoading = false`
7. Wrap seluruhnya dalam `try/catch` — jika gagal, tampilkan toast error

---

### Phase 6 — Integrasi ke Dashboard
**File yang disentuh:** `src/features/analitik/pages/Dashboard/index.tsx`

**Yang perlu ditambahkan:**

```tsx
// 1. Tambahkan ref ke tiap chart
const refChartArea = useRef<HTMLDivElement>(null)
const refBarMixed = useRef<HTMLDivElement>(null)
const refBarStacked = useRef<HTMLDivElement>(null)

// 2. Wrap tiap komponen chart dengan div ref
<div ref={refChartArea}><ChartAreaInteractive /></div>
<div ref={refBarMixed}><ChartBarMixed /></div>
<div ref={refBarStacked}><ChartBarStacked /></div>

// 3. Ambil data PDF
const dashboardPdfData = useDashboardPdfData()

// 4. Hook download
const { downloadPdf, isLoading } = usePdfDownload({
  chartRefs: { chartArea: refChartArea, chartBarMixed: refBarMixed, chartBarStacked: refBarStacked },
  data: dashboardPdfData,
})

// 5. Tombol download (pasang di header dashboard)
<Button
  onClick={downloadPdf}
  disabled={isLoading || !dashboardPdfData.isReady}
>
  {isLoading ? 'Menyiapkan PDF...' : 'Download Laporan'}
</Button>
```

---

## ⚠️ Edge Cases yang Sudah Dihandle

| Skenario | Solusi |
|---|---|
| Tabel transaksi > 1 halaman | `@react-pdf/renderer` auto-wrap, tidak perlu kode tambahan |
| Chart terpotong antar halaman | `wrap={false}` pada `<View>` wrapper tiap chart |
| Chart belum render saat capture | Tombol disabled sampai `dashboardPdfData.isReady === true` |
| UI freeze saat generate PDF | Render PDF di web worker (bawaan `@react-pdf/renderer`) |
| html2canvas capture gagal | try/catch per chart, skip chart yang gagal + log warning |
| Data KPI belum ada di cache | `isReady` false → tombol tetap disabled |
| Filter periode berubah setelah download | Data diambil saat klik → selalu snapshot terkini |

---

## 📄 Struktur PDF Output (Layout A4)

```
┌─────────────────────────────────────────────────┐
│  [S] SMARTCLINIK INDONESIA        DOKUMEN       │  ← PdfCoverHeader
│      Alamat klinik                EKSEKUTIF     │
│                              Dicetak: 27 Jun 2026│
│  ─────────────────────────────────────────────  │
│                                                 │
│     LAPORAN EKSEKUTIF ANALITIK & PENDAPATAN     │  ← Judul
│     Periode: Dashboard Analitik (Mingguan)      │
│                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  ← PdfKpiSection
│  │Pend. Hari│  │Pend.Minggu│  │Total Bulanan │  │
│  │Rp 4.95jt │  │Rp 34.5jt │  │Rp 148.5jt    │  │
│  │+3.4% ... │  │+4.13%... │  │Status Aktif  │  │
│  └──────────┘  └──────────┘  └──────────────┘  │
│                                                 │
│  [Chart Area Interactive — gambar PNG]          │  ← PdfChartSection
│  [Chart Bar Mixed — gambar PNG]                 │
│  [Chart Bar Stacked — gambar PNG]               │
│                                                 │
├─────────────────────────────────────────────────┤  ← halaman baru jika perlu
│  I. RINCIAN LAPORAN RINGKASAN                   │  ← PdfRevenueTable
│  ┌──────────┬───────┬──────────┬───────┬──────┐ │
│  │ Tanggal  │ Trans │ Layanan  │ Obat  │Total │ │
│  ├──────────┼───────┼──────────┼───────┼──────┤ │
│  │15 Nov '23│  42   │Rp 2.8jt  │Rp 1.4│Rp 4.2│ │
│  │  ...     │  ...  │  ...     │  ...  │  ... │ │
│  └──────────┴───────┴──────────┴───────┴──────┘ │
│                                                 │
│  Dokumen sah diterbitkan otomatis...            │  ← PdfSignatureFooter
│                          Direktur Operasional,  │
│                          Super Admin, S.Kom     │
│                          NIP. 17811099432       │
└─────────────────────────────────────────────────┘
```

---

## 🔮 Yang Bisa Disambung Nanti (Future)

- **Info klinik** → ambil dari API settings saat sudah dibuat
- **Penandatangan** → ambil dari `authStore.ts` (nama + jabatan user login)
- **Chart alternatif** → jika mau chart lebih tajam, bisa ekspor SVG string dan convert ke PNG server-side
- **Halaman lain** → `usePdfDownload` dibuat generic, bisa dipakai untuk halaman Laporan dan Pasien juga