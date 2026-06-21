# Klinik Payment (POS & Analytics System)

Sistem Aplikasi Point of Sale (POS) dan Analitik berbasis web yang dirancang khusus untuk operasional Klinik. Aplikasi ini mempermudah pengelolaan transaksi kasir, manajemen stok obat, rekam medis elektronik (RME), hingga analitik performa klinik secara keseluruhan.

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

### 🔌 Integrasi & API
Aplikasi ini mendukung berbagai integrasi layanan melalui arsitektur API modular:
- **POS Client (`posClient`):** Layanan inti untuk pencatatan pembayaran dan transaksi.
- **Warehouse Client (`warehouseClient`):** Sinkronisasi inventaris obat/stok dengan gudang pusat.
- **RME Client (`rmeClient`):** Terhubung dengan sistem Rekam Medis Elektronik untuk pencatatan historis pasien.
- **AI Client (`aiClient`):** Layanan asisten cerdas untuk membantu mempercepat operasional atau analitik (jika tersedia).
- **Pembayaran:** Mendukung berbagai metode termasuk QRIS.

## 🛠️ Tech Stack & Teknologi

Aplikasi ini dibangun menggunakan arsitektur modern Front-End:
- **Core:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite 6](https://vitejs.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching:** [TanStack React Query v5](https://tanstack.com/query/latest) + [Axios](https://axios-http.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) + [Shadcn](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Charts/Visualisasi:** [Recharts](https://recharts.org/)

## 🚀 Panduan Memulai (Development)

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) versi terbaru di sistem Anda.

1. **Clone repositori ini atau buka direktori proyek:**
   ```bash
   cd CapstonPos-QrisGII
   ```

2. **Instal dependensi:**
   Menggunakan NPM:
   ```bash
   npm install
   ```
   Atau menggunakan Yarn:
   ```bash
   yarn install
   ```

3. **Jalankan server pengembangan (Development Server):**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di mode *development*. Buka [http://localhost:5173](http://localhost:5173) di browser Anda.

4. **Build untuk Produksi:**
   ```bash
   npm run build
   ```
   Perintah ini akan melakukan kompilasi TypeScript dan mem-build aplikasi agar siap untuk dideploy (berada di folder `dist`).

## 📁 Struktur Folder Utama

```
src/
├── api/          # Konfigurasi axios dan client services (RME, POS, Warehouse, AI)
├── assets/       # Gambar, icon statis, atau font lokal
├── components/   # Komponen UI global yang dapat digunakan kembali (reusable)
├── features/     # Fitur utama aplikasi berdasarkan domain
│   ├── analitik/ # Halaman & komponen untuk Admin Dashboard
│   ├── auth/     # Halaman login dan otentikasi
│   └── kasir/    # Halaman & komponen untuk Portal Kasir
├── hooks/        # Custom React Hooks
├── lib/          # Utility functions dan konfigurasi eksternal
└── routes/       # Definisi routing, guard, dan integrasi react-router
```

---
*Dokumentasi ini telah diperbarui agar sesuai dengan arsitektur proyek terbaru.*
