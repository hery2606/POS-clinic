# Klinik Payment (POS & Analytics System)

Sistem Aplikasi Point of Sale (POS) dan Analitik berbasis web yang dirancang khusus untuk operasional Klinik. Aplikasi ini mempermudah pengelolaan transaksi kasir, manajemen stok obat, sinkronisasi rekam medis elektronik (RME), hingga analitik performa finansial dan demografi pasien secara real-time.

---

## 🌟 Fitur Utama

Aplikasi ini dibagi menjadi 2 portal utama berdasarkan peran pengguna (Role):

### 1. Portal Kasir (Cashier Portal)
Didesain khusus untuk efisiensi transaksi harian di meja kasir dengan fungsionalitas:
- **Dashboard Kasir:** Antarmuka intuitif untuk memproses transaksi pembayaran pasien.
- **Integrasi Pembayaran QRIS & Tunai:** Didukung oleh payment gateway **Midtrans** (Sandbox/Production) untuk opsi pembayaran non-tunai yang terverifikasi otomatis.
- **Split Bill (Pembayaran Terpisah):** Memungkinkan pasien membagi pembayaran menggunakan kombinasi tunai dan QRIS secara fleksibel.
- **Riwayat Transaksi:** Melacak, memfilter berdasarkan tanggal/status, dan melihat rincian detail dari seluruh transaksi.
- **Pencetakan Struk:** Konfigurasi cetak struk format **Thermal 80mm** (untuk printer kasir portabel) maupun **A4 Portrait** (untuk laporan formal/kwitansi resmi).

### 2. Portal Analitik & Admin
Didesain untuk kebutuhan manajemen dan pemilik klinik guna memantau performa bisnis:
- **Dashboard Analitik:** Ringkasan visual interaktif (grafik/chart Recharts) untuk tren pendapatan harian/bulanan, total transaksi, rata-rata nilai billing, dan status keuangan.
- **Analisis Demografi Pasien:** Visualisasi statistik pasien berdasarkan usia, gender, domisili, dan total kunjungan yang terintegrasi dengan data RME.
- **Manajemen Inventaris Obat (WMS):** Sinkronisasi data obat dari Warehouse Management System, lengkap dengan indikator status stok (**Tersedia**, **Stok Menipis**, atau **Stok Kritis**).
- **Pengaturan Sistem (Settings):** Pusat konfigurasi profil klinik, preferensi cetak struk, opsi notifikasi alert, keamanan akun, dan manajemen akses pengguna (User Management).

---

## 🛠️ Tech Stack & Arsitektur

Aplikasi ini dibangun menggunakan arsitektur modern Front-End yang responsif, interaktif, dan aman:

| Kategori | Teknologi Utama | Deskripsi |
| :--- | :--- | :--- |
| **Core & Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Framework utama untuk UI reaktif, terstruktur, dan tipe data aman (*type-safe*). |
| **Build Tool** | [Vite 6](https://vitejs.dev/) | Bundler modern super cepat untuk performa HMR lokal yang instan. |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | Manajemen status global yang ringan, modular, dan cepat. |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/) | Penanganan asinkronus, caching pintar, dan auto-retry request API. |
| **Routing** | [React Router v7](https://reactrouter.com/) | Sistem routing dinamis dengan penanganan proteksi rute akses. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Utilitas CSS modern dengan dukungan performa rendering optimal. |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [Shadcn UI](https://ui.shadcn.com/) | Komponen visual UI bertema minimalis, modern, dan aksesibel. |
| **Visualisasi Data** | [Recharts](https://recharts.org/) | Pustaka chart interaktif untuk visualisasi grafik analitik yang responsif. |

---

## 🔒 Sistem Keamanan & Integrasi API

Aplikasi ini mengintegrasikan mikroservis dari 4 backend eksternal secara aman:
1. **POS Internal Backend (`VITE_API_INTERNAL_URL`):** Manajemen login staf (Kasir, Admin, Super Admin) dan pencatatan riwayat transaksi kasir.
2. **RME Backend (`VITE_API_RME_URL`):** Pengambilan data rekam medis elektronik pasien, antrean berobat, serta histori tindakan medis.
3. **Warehouse/WMS Backend (`VITE_API_WAREHOUSE_URL`):** Sinkronisasi inventaris obat, status stok minimum, dan detail harga obat.
4. **AI Backend (`VITE_API_AI_URL`):** Layanan kecerdasan buatan untuk analisis prediktif performa klinik.

### 🛡️ Implementasi Keamanan Tambahan
- **Enkripsi/Obfuskasi Frontend (`secureStorage`):** Token sensitif (`authToken`, `rmeToken`, dan `warehouse_auth_token`) disimpan di browser secara terenkripsi menggunakan helper custom `secureStorage` (menggunakan algoritma XOR + salt + Base64) untuk mencegah eksploitasi visual sederhana (*shoulder surfing*) dan *data sniffing* via inspect element.
- **Pencegahan CORS via Local Proxy (`vite.config.ts`):** Mengatasi isu CORS di lingkungan pengembangan lokal dengan memetakan request `/proxy/*` langsung ke server backend target, selaras dengan konfigurasi Vercel Rewrite (`vercel.json`) di lingkungan produksi.
- **Otomatisasi Re-login Interceptor:** Interceptor request/response Axios dikonfigurasi untuk mendeteksi ketiadaan token atau token kedaluwarsa (401), secara otomatis melakukan otentikasi ulang menggunakan kredensial sistem secara senyap (*silent re-login*), lalu mengulangi kembali request awal tanpa mengganggu pengalaman pengguna.

---

## 🚀 Panduan Memulai (Development)

### 1. Prasyarat
Pastikan Anda sudah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas disarankan) dan npm di perangkat Anda.

### 2. Instalasi Dependensi
Clone repositori ini, masuk ke direktori proyek, lalu jalankan instalasi:
```bash
git clone https://github.com/hery2606/POS-clinic.git
cd POS-clinic
npm install
```

### 3. Konfigurasi Environment Variables
Buat file bernama `.env.local` di folder root proyek dan lengkapi variabel berikut:
```env
# 1. Backend Utama Rekam Medis (RME)
VITE_API_RME_URL=https://smartclinic-rekam-medis.onrender.com


# 2. Backend Warehouse / Gudang (WMS)
VITE_API_WAREHOUSE_URL=https://system-inventory-management.onrender.com


# 3. Backend AI Engineer
VITE_API_AI_URL=https://dashboard-ai-9k65.onrender.com/docs

# 4. Backend Internal Login
VITE_API_INTERNAL_URL=https://db-posqris-cpgii-production.up.railway.app

# 5. Kunci Klien Midtrans (Opsional - Untuk hilangkan warning SDK)
VITE_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx

# 6. Server-Side Credentials (untuk serverless dev lokal)
RME_ADMIN_EMAIL=
RME_ADMIN_PASSWORD=
WAREHOUSE_ADMIN_EMAIL=
WAREHOUSE_ADMIN_PASSWORD=
```

### 4. Menjalankan Server Lokal
Jalankan perintah berikut untuk memulai server pengembangan:
```bash
npm run dev
```
Aplikasi akan berjalan di `http://localhost:5174` (atau port default lainnya yang tertera di konsol).

### 5. Skrip Build & Produksi
- `npm run build` : Mengompilasi TypeScript dan mem-build berkas produksi ke folder `/dist`.
- `npm run preview` : Menjalankan server lokal untuk meninjau hasil build produksi.

---

## 📁 Struktur Folder Utama

```
src/
├── api/                  # Klien Axios & inisialisasi otentikasi (RME, Warehouse, POS, AI)
├── components/           # Komponen UI global (Button, Input, Table, Sidebar, dll)
├── features/             # Fitur utama berbasis domain-driven
│   ├── analitik/         # Komponen dashboard analitik, chart, laporan keuangan, & data pasien
│   ├── auth/             # Formulir login, provider otentikasi, & logika session
│   └── kasir/            # Komponen transaksi kasir, riwayat pembayaran, & stok obat
├── hooks/                # Custom React Hooks reusable
├── lib/                  # Fungsi utilitas penunjang (cn, format uang, secureStorage)
└── routes/               # Konfigurasi rute halaman dan filter ProtectedRoute
```

---

## ⚙️ Komponen Pengaturan (Settings Guide)

Menu Pengaturan menyediakan opsi kustomisasi lengkap bagi administrator klinik yang terbagi menjadi beberapa tab navigasi:

1. **Umum (General):** Mengonfigurasi nama klinik, alamat, jam operasional, zona waktu, serta sakelar tampilan mode gelap (Dark Mode) dan suara efek notifikasi.
2. **Printer:** Konfigurasi koneksi printer struk kasir, pilihan model printer (Thermal 80mm vs Standard A4), dan tombol uji coba print struk.
3. **Notifikasi:** Pengaturan penerimaan notifikasi via Email atau SMS, serta pengaturan ambang batas peringatan stok obat menipis (*Low Stock Alert*).
4. **Billing & Invoice:** Pengaturan detail identitas perusahaan (Nama, NPWP, NIK, No. Telepon), format nomor faktur (Prefix Invoice), dan template default kwitansi.
5. **Keamanan (Security):** Opsi pergantian password akun staf dan konfigurasi Autentikasi Dua Faktor (2FA) untuk meningkatkan perlindungan data medis.
6. **Pengguna & Akses (User Management):** Mengelola daftar staf klinik, menambahkan pengguna baru, menentukan peran (*Admin*, *Doctor*, atau *Cashier*), serta menonaktifkan akun staf.

---

## 🌐 Panduan Deployment

Aplikasi ini siap dideploy langsung ke **Vercel**:
1. Repositori ini sudah dilengkapi dengan file `vercel.json` yang berisi aturan rewrite rute halaman SPA ke `index.html` dan proxy backend untuk production.
2. Hubungkan repositori GitHub Anda ke Vercel Dashboard.
3. Masukkan seluruh konfigurasi variabel lingkungan (Environment Variables) dari file `.env.local` Anda ke pengaturan Vercel project.
4. Klik **Deploy** dan verifikasi URL produksi Anda.
