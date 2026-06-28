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

---

## 6. Detail Endpoint API & Autentikasi Backend

Aplikasi berkomunikasi dengan berbagai layanan mikro (*microservices*) melalui HTTP Client Axios yang dikonfigurasi secara modular. Semua request menyisipkan token JWT Bearer pada header `Authorization`.

### 6.1. Rekam Medis Elektronik (RME) API
* **Base URL**: `/proxy/rme` (Prod) / `https://smartclinic-rekam-medis.onrender.com` (Dev)
* **Autentikasi**: JWT Bearer Token (`rmeToken` di localStorage). Sistem melakukan otomatisasi login admin pada saat startup jika token belum tersedia.
* **Endpoint Penting**:
  * `POST /api/v1/auth/login` — Login admin RME.
  * `GET /api/v1/patients` — Mengambil daftar data pasien dengan filter pencarian dan paginasi.
* **Struktur Response**:
  ```json
  {
    "status": "success",
    "data": {
      "data": [
        {
          "id": "patient-uuid",
          "namaLengkap": "Pasien",
          "isActive": true
        }
      ],
      "meta": { "total": 100, "page": 1 }
    }
  }
  ```

### 6.2. AI Analytics & CRM API
* **Base URL**: `/proxy/ai` (Prod) / `https://dashboard-ai-9k65.onrender.com` (Dev)
* **Autentikasi**: JWT Bearer Token (`authToken` di localStorage).
* **Endpoint Penting**:
  * `GET /api/v1/ai/revenue/trend` — Data historis tren pendapatan.
  * `GET /api/v1/ai/payments/analytics` — Persentase dan tren penggunaan metode pembayaran.
  * `GET /api/v1/ai/products/analytics` — Produk dan layanan kesehatan terlaris.
  * `POST /api/v1/ai/invoice/send-wa` — Mengirim pengingat tagihan piutang via WhatsApp.

### 6.3. Internal Core POS API
* **Base URL**: `/proxy/internal` (Prod) / `https://db-posqris-cpgii-production.up.railway.app` (Dev)
* **Autentikasi**: JWT Bearer Token (`authToken` di localStorage).
* **Endpoint Penting**:
  * `POST /api/payment/tokenizer` — Membuat token Snap Midtrans untuk transaksi kasir.
  * `GET /api/payment/status/{transactionId}` — Cek status pembayaran Midtrans.
  * `GET /api/billing/{transactionId}/payments` — Histori split-bill kasir.

### 6.4. Warehouse Management System (WMS) API
* **Base URL**: `/proxy/warehouse` (Prod)
* **Autentikasi**: JWT Bearer Token (`warehouse_auth_token` di localStorage).

---

## 7. Integrasi Gateway Pembayaran Midtrans

Sistem pembayaran digital kasir menggunakan solusi **Midtrans Snap SDK** dalam lingkungan **Sandbox** untuk mempermudah simulasi transaksi:

* **SDK Integration**: Skrip Snap UI dimuat secara dinamis dari `https://app.sandbox.midtrans.com/snap/snap.js`.
* **Alur Polling Status**:
  1. Kasir memicu pembayaran QRIS, aplikasi meminta `snapToken` melalui API `/api/payment/tokenizer`.
  2. Modal Snap UI (`QrisPaymentModal`) terbuka menampilkan jendela melayang berisi kode QR.
  3. Aplikasi mengaktifkan **Background Polling** (`setInterval` setiap 3 detik) ke endpoint status backend `/api/payment/status/{transactionId}`.
  4. Begitu status berubah menjadi `settlement` atau `lunas` di server backend, polling mendeteksi perubahan tersebut, menutup Pop-up Snap secara otomatis, dan langsung mencatat transaksi sebagai lunas tanpa memerlukan interaksi tambahan dari kasir.

---

## 8. Integrasi WhatsApp CRM & Penagihan Piutang

Fitur pengingat otomatis pembayaran piutang (`PiutangActionTable`) terhubung dengan layanan pengiriman pesan WhatsApp terautomatisasi:
* **Mekanisme**: Permintaan pengiriman dikirim melalui POST ke endpoint `/api/v1/ai/invoice/send-wa`.
* **Payload Request**:
  ```json
  {
    "target": "628123456789",
    "nama_pasien": "Ahmad Kurniawan",
    "attachment_url": "https://invoice-pdf-link...",
    "filename": "invoice_Klinik.pdf",
    "status_pembayaran": "PIUTANG"
  }
  ```
* **Engine WhatsApp**: API backend bertindak sebagai jembatan ke provider gateway WhatsApp untuk meneruskan template pesan penagihan formal beserta lampiran PDF invoice langsung ke nomor pasien.

---

## 9. Konfigurasi Deployment & Environment

### 9.1. Deployment Platform: Vercel
* Konfigurasi routing CORS dilakukan melalui berkas `vercel.json` dengan menyematkan aturan rewrite rute `/proxy/*` menuju masing-masing API Server backend guna menghindari kendala *Cross-Origin Resource Sharing* di sisi klien.

### 9.2. Environment Variables (.env)
Aplikasi memanfaatkan konfigurasi environment berikut:
* `VITE_API_RME_URL`: Endpoint API Rekam Medis Elektronik.
* `VITE_API_AI_URL`: Endpoint API AI Analytics.
* `VITE_API_WAREHOUSE_URL`: Endpoint API Gudang Farmasi.
* `VITE_API_INTERNAL_URL`: Base URL database core POS kasir.
* `VITE_MIDTRANS_CLIENT_KEY`: Kunci klien Midtrans Sandbox.
* `RME_ADMIN_EMAIL` / `RME_ADMIN_PASSWORD`: Akun sistem admin RME.
* `WAREHOUSE_ADMIN_EMAIL` / `WAREHOUSE_ADMIN_PASSWORD`: Akun sistem apoteker.

### 9.3. Versi Node.js & Package Manager
* **Node.js**: Direkomendasikan versi **v18+** atau **v20+** (LTS).
* **Package Manager**: **npm** (dengan dependensi terikat di `package-lock.json`).
