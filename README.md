# Klinik Payment (POS & Analytics System)

Sistem Aplikasi Point of Sale (POS) dan Analitik berbasis web yang dirancang khusus untuk operasional Klinik. Aplikasi ini mempermudah pengelolaan transaksi kasir, manajemen stok obat, rekam medis elektronik (RME), hingga analitik performa klinik secara keseluruhan.

---

## 🌟 Fitur Utama

Aplikasi ini dibagi menjadi 2 portal utama berdasarkan peran pengguna (Role):

### 1. Portal Kasir (Cashier)
Didesain untuk efisiensi transaksi harian di meja kasir.
- **Dashboard Kasir:** Antarmuka utama untuk melakukan transaksi pembayaran pasien/pelanggan.
- **Riwayat Transaksi:** Melacak dan melihat detail dari seluruh transaksi yang telah berhasil maupun dibatalkan.
- **Manajemen Stok:** Memeriksa ketersediaan stok obat dan alat kesehatan secara *real-time*.
- **Pengaturan Kasir:** Konfigurasi khusus untuk perangkat kasir seperti printer struk (Thermal/A4), mode tampilan, dsb.

### 2. Portal Analitik & Admin
Didesain untuk manajemen klinik memantau performa dan laporan operasional.
- **Dashboard Analitik:** Ringkasan visual (grafik/chart) dari pendapatan, jumlah pasien, dan tren performa klinik.
- **Laporan:** Pembuatan dan pencetakan laporan transaksi atau keuangan klinik.
- **Data Pasien:** Manajemen data dasar pasien yang terintegrasi.
- **Manajemen Transaksi Admin:** Melihat keseluruhan transaksi operasional secara lebih detail.
- **Pengaturan Sistem:** Mengatur profil klinik, preferensi keamanan (2FA), manajemen pengguna, dan preferensi notifikasi.

---

## 🛠️ Tech Stack & Teknologi

Aplikasi ini dibangun menggunakan arsitektur modern Front-End dengan spesifikasi sebagai berikut:

| Kategori | Teknologi Utama | Deskripsi |
| :--- | :--- | :--- |
| **Core & Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) | Framework utama untuk membangun antarmuka pengguna secara reaktif dan *type-safe*. |
| **Build Tool** | [Vite 6](https://vitejs.dev/) | Bundler modern yang super cepat untuk lingkungan *development* dan *production*. |
| **State Management** | [Zustand](https://github.com/pmndrs/zustand) | Manajemen *state* global yang ringan dan terukur. |
| **Data Fetching** | [TanStack React Query v5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/) | Manajemen asinkron, *caching*, dan *fetching* API. |
| **Routing** | [React Router v7](https://reactrouter.com/) | Penanganan navigasi dan rute aplikasi berbasis komponen. |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) | Framework CSS berbasis *utility* untuk mempercepat *styling*. |
| **UI Components** | [Radix UI](https://www.radix-ui.com/) + [Shadcn](https://ui.shadcn.com/) | Komponen *headless* yang *accessible* dan komponen visual UI. |
| **Icons & Charts** | [Lucide React](https://lucide.dev/) & [Recharts](https://recharts.org/) | Ikon modern dan pustaka visualisasi data untuk *dashboard* analitik. |

---

## 🔌 Integrasi Layanan Backend (API)

Aplikasi ini menggunakan arsitektur modular yang berkomunikasi dengan 4 backend layanan (Microservices):
- **Backend Internal Login (`VITE_API_INTERNAL_URL`):** Otentikasi dan otorisasi untuk KASIR dan SUPER_ADMIN.
- **Backend RME (`VITE_API_RME_URL`):** Terhubung dengan sistem Rekam Medis Elektronik untuk data pasien dan dokter.
- **Backend Warehouse (`VITE_API_WAREHOUSE_URL`):** Sinkronisasi inventaris obat/stok dengan gudang (WMS).
- **Backend AI (`VITE_API_AI_URL`):** Layanan asisten cerdas untuk operasional.

---

## 🚀 Panduan Memulai (Development)

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) versi terbaru.

### 1. Clone & Instalasi
Clone repositori ini atau buka direktori proyek, lalu instal dependensi:
```bash
cd CapstonPos-QrisGII
npm install
```

### 2. Konfigurasi Environment Variables
Buat file `.env.local` di root proyek dan tambahkan variabel lingkungan berikut. Sesuaikan dengan kredensial API Anda:
```env
# 1. Backend Utama Rekam Medis (RME)
VITE_API_RME_URL=https://<url-backend-rme>

# 2. Backend AI Engineer
VITE_API_AI_URL=https://<url-backend-ai>

# 3. Backend Warehouse / Gudang (WMS)
VITE_API_WAREHOUSE_URL=https://<url-backend-warehouse>

# 4. Backend Internal Login (Kasir & Super Admin)
VITE_API_INTERNAL_URL=https://<url-backend-internal>
```

### 3. Menjalankan Aplikasi
Berikut adalah daftar perintah atau *scripts* yang tersedia:

| Command | Fungsi |
| :--- | :--- |
| `npm run dev` | Menjalankan server pengembangan (Development Server) di `http://localhost:5173` |
| `npm run build` | Mengompilasi TypeScript dan mem-build aplikasi untuk *production* (folder `dist`) |
| `npm run lint` | Menjalankan ESLint untuk memeriksa masalah sintaks atau standar kode |
| `npm run preview` | Menjalankan server lokal untuk melihat hasil *build production* |

---

## 📁 Struktur Folder Utama

```
src/
├── api/          # Konfigurasi axios proxy dan layanan client (RME, POS, Warehouse, AI)
├── assets/       # Aset statis seperti gambar, ikon, atau font lokal
├── components/   # Komponen UI global yang reusable (Button, Input, Layout, dsb)
├── features/     # Fitur utama aplikasi yang dikelompokkan berdasarkan domain (Domain-Driven)
│   ├── analitik/ # Halaman & komponen khusus untuk Dashboard Admin / Analitik
│   ├── auth/     # Halaman login, konteks otentikasi, dan pengaturan *session*
│   └── kasir/    # Halaman & komponen khusus untuk Portal Kasir
├── hooks/        # Custom React Hooks
├── lib/          # Fungsi utilitas pembantu (utils) dan konfigurasi eksternal
└── routes/       # Konfigurasi routing (routeConfig) dan komponen pelindung rute (ProtectedRoute)
```

---

## 🌐 Deployment
Aplikasi ini sudah dikonfigurasi untuk dideploy ke [Vercel](https://vercel.com/) (menggunakan konfigurasi `vercel.json` untuk *rewrite* ke `index.html`).
Untuk men-deploy, Anda hanya perlu mengimpor repositori GitHub ini di Vercel Dashboard dan menambahkan konfigurasi `.env` ke bagian *Environment Variables* di Vercel.
