# Analisis & Dokumentasi Sistem: Klinik POS-QrisGII

Dokumen ini menyajikan analisis mendalam dan penjelasan komprehensif mengenai arsitektur sistem, struktur direktori, tumpukan teknologi (technology stack), alur data, serta detail implementasi fitur utama dalam proyek **CapstonPos-QrisGII**.

---

## 1. Ringkasan Eksekutif & Tujuan Proyek

Aplikasi **Klinik POS-QrisGII** dirancang untuk memenuhi kebutuhan operasional klinik modern secara menyeluruh. Proyek ini mengintegrasikan dua pilar utama:
1. **Point of Sale (POS) Kasir**: Sistem pencatatan transaksi medis dan penjualan obat yang terintegrasi dengan gateway pembayaran digital (Midtrans QRIS) guna meminimalkan kesalahan administrasi manual.
2. **Dashboard Analitik & Pelaporan (Laporan)**: Panel manajemen keuangan cerdas yang menyajikan metrik penting (KPI), visualisasi grafis tren kunjungan dan pendapatan, pemantauan piutang tak tertagih, penagihan otomatis via integrasi WhatsApp CRM, serta kemampuan ekspor laporan berformat formal (PDF & Excel).

---

## 2. Tumpukan Teknologi (Technology Stack)

Sistem ini dibangun di atas infrastruktur modern dengan kinerja tinggi dan skalabilitas yang baik:

| Kategori | Teknologi Utama | Keterangan |
|---|---|---|
| **Core Framework** | React 19 & TypeScript | Menjamin penulisan kode yang aman tipe (*type-safe*) dan reaktivitas antarmuka yang andal. |
| **Build Tool / Bundler** | Vite 8 | Menyediakan siklus pengembangan instan (*fast-refresh*) dan ukuran bundle production yang teroptimasi. |
| **Styling (CSS)** | Tailwind CSS v4 & Vanilla CSS | Desain premium menggunakan variabel CSS modern dan penataan responsif. |
| **State & Data Fetching** | TanStack Query v5 (React Query) | Caching state server, sinkronisasi otomatis, dan manajemen status query API secara efisien. |
| **Routing** | React Router v6 | Mengatur hierarki rute aplikasi, proteksi halaman, serta penyaluran konteks outlet. |
| **UI Components** | Radix UI Primitives & Shadcn UI | Komponen dasar aksesibel (WAI-ARIA compliant) seperti Dialog, Select, Tabs, dan Sidebar. |
| **Grafik (Charts)** | Recharts | Render visualisasi grafik interaktif (Area, Stacked Bar, Donut) berbasis SVG di peramban. |
| **PDF Generation** | `@react-pdf/renderer` & `html2canvas-pro` | Kompilasi laporan PDF sisi klien (*client-side*) secara instan dengan layout formal. |

---

## 3. Struktur Direktori Proyek (Folder Architecture)

Proyek ini menerapkan pendekatan modular berbasis fitur (**Feature-Sliced Design**) untuk memisahkan domain bisnis agar tidak saling bergantung secara ketat (*loose coupling*):

```
CapstonPos-QrisGII/
├── public/                 # Aset publik statis (favicon, logo, robots.txt)
├── src/
│   ├── api/                # Klien HTTP Axios terkonfigurasi (aiClient, rmeClient)
│   ├── assets/             # Aset gambar, ikon, dan berkas statis lokal
│   ├── components/         # Komponen UI generik (Shared Components / Shadcn UI)
│   ├── features/           # Pembagian modul domain bisnis utama
│   │   ├── auth/           # Manajemen login, token akses, dan konteks otentikasi
│   │   ├── kasir/          # Transaksi POS, riwayat kasir, dan pembayaran Midtrans QRIS
│   │   └── analitik/       # Modul Dashboard, Laporan, Grafik, dan Ekspor PDF
│   │       ├── components/ # Sub-komponen (kpi, chart harian, tabel piutang)
│   │       ├── hooks/      # Custom React hooks (misal: useDashboardPdfData.ts)
│   │       ├── layout/     # Komponen penata halaman (Header, Sidebar, Core Layout)
│   │       ├── pages/      # Halaman utama (DashboardPage, LaporanPage, Settings)
│   │       ├── services/   # Layanan integrasi API backend (analitik.service.ts)
│   │       └── types/      # Definisi TypeScript Interfaces (payments, invoices, dll.)
│   ├── hooks/              # Custom hooks global (misal: usePdfDownload.tsx)
│   ├── lib/                # Konfigurasi utilitas bersama (cn helper)
│   ├── routes/             # Peta rute aplikasi & konfigurasi navigasi
│   ├── App.tsx             # Komponen utama bootstrap aplikasi
│   ├── App.css             # Konfigurasi variabel tema CSS & override kelas Dark Mode
│   └── main.tsx            # Entrypoint utama aplikasi React
├── index.html              # Template HTML utama
├── planning.md             # Dokumen Lighthouse Audit & Rencana Perbaikan
├── package.json            # Daftar dependensi dan script npm
└── tsconfig.json           # Konfigurasi kompilator TypeScript
```

---

## 4. Analisis Detail Modul & Fitur Utama

### 4.1. Point of Sale (POS) & Pembayaran QRIS (`src/features/kasir`)
* **Pencatatan Billing**: Alur kasir mengumpulkan entri tindakan medis dan obat pasien langsung dari database Rekam Medis Elektronik (RME).
* **Integrasi Midtrans QRIS**:
  * Mengintegrasikan API pembayaran QRIS dinamis menggunakan modal dialog Shadcn.
  * Status transaksi dipantau secara real-time melalui *polling* backend untuk memastikan status sukses/gagal langsung diperbarui di layar kasir secara akurat.

### 4.2. Dashboard Analitik Utama (`src/features/analitik`)
* **Modul KPI Finansial (`KPICards.tsx`)**: Menyajikan metrik ringkasan pendapatan, volume transaksi harian, serta distribusi kontribusi medis.
* **Grafik Interaktif**:
  * **Tren Kunjungan (`ChartAreaInteractive.tsx`)**: Grafik area interaktif yang menunjukkan kepadatan kunjungan pasien harian.
  * **Cashflow Stacked (`ChartBarStacked.tsx`)**: Menampilkan perbandingan perputaran kas masuk berdasarkan tipe layanan.
  * **Kontribusi Produk & Layanan (`ChartBarMixed.tsx`)**: Menampilkan performa item terlaris.
* **Filter Waktu Dinamis**: Filter header tunggal tanpa perbandingan komparasi (sesuai kebutuhan YAGNI) yang memudahkan pemantauan harian, bulanan, maupun tahunan.

### 4.3. Manajemen Piutang & Whatsapp Auto-Reminder
* **Tabel Penagihan (`PiutangActionTable.tsx`)**: Melacak sisa tagihan pasien beserta jumlah hari keterlambatan pelunasan.
* **Integrasi WhatsApp CRM**:
  * Memungkinkan staf administrasi mengirim pesan penagihan formal otomatis berisi URL invoice berformat PDF hanya dengan satu kali klik.
  * Dilengkapi monitor aktivitas sistem (`PiutangAutoReminderMonitor.tsx`) yang didesain secara profesional mirip log aktivitas korporat yang bersih.

### 4.4. Generator Laporan Cetak PDF Cerdas
* **Generator Sisi Klien**:
  * Menggunakan `@react-pdf/renderer` untuk membuat berkas PDF berkualitas tinggi langsung di memori peramban tanpa membebani server.
  * **Optimasi Kecepatan**: Menggantikan tangkapan layar donat metode pembayaran yang lambat dengan tabel data terstruktur (`payments`) berbasis teks yang tajam dan hemat memori.
  * Struktur PDF dipecah secara modular (`pdf-sections/`) untuk mempermudah perawatan kode (*maintainability*).

### 4.5. Sistem Tema Dinamis (Light / Dark Mode)
* **Default Light Mode**: Inisialisasi awal aplikasi diatur ke Light Mode agar ramah di lingkungan bercahaya terang (klinik).
* **Toggle Fleksibel**: Disematkan tombol toggle estetis pada header analitik. 
* **Global CSS Overrides (`App.css`)**: Menggunakan kelas khusus `.dark` di root elemen (`html`) untuk mengontrol dan menyesuaikan variabel CSS warna latar belakang, batas (*border*), serta teks dari komponen dengan kelas warna *hardcoded* (seperti `bg-white` dan `text-slate-900`) secara otomatis.

---

## 5. Ringkasan Optimasi Lighthouse (Kinerja & Aksesibilitas)

Sebagai tindak lanjut dari *Lighthouse Audit* (yang terdokumentasi di `planning.md`), beberapa optimasi penting berikut telah diintegrasikan ke dalam basis kode:
1. **SEO**:
   * Menambahkan file `public/robots.txt` yang valid untuk membatasi indeksasi mesin pencari pada halaman panel admin.
   * Menambahkan deskripsi meta di `index.html`.
2. **Aksesibilitas (A11y)**:
   * Menyematkan atribut `aria-label` yang informatif pada tombol-tombol berbasis ikon saja (tanpa teks deskripsi) seperti pemicu bilah samping, tombol unduh PDF, dan tombol toggle tema untuk membantu pengguna pembaca layar (*screen-reader*).
3. **Kontras Warna**:
   * Melakukan kalibrasi warna latar belakang gelap di mode malam menggunakan warna kontras tinggi (#081015 & #111e29) untuk memenuhi standar rasio kontras WCAG AA.
