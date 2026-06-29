# Lighthouse Audit — Rencana Perbaikan

**URL:** `https://pos-clinic-git-main-heryarista535-3622s-projects.vercel.app/admin/Laporan`  
**Tanggal Audit:** 28 Juni 2026, 12:18 WIB  
**Tool:** Lighthouse 13.2.0 (Emulated Desktop)

---

## Ringkasan Skor

| Kategori | Skor | Status |
|---|---|---|
| Performance | 70 | 🟠 Perlu Perbaikan |
| Accessibility | 90 | 🟢 Baik |
| Best Practices | 100 | 🟢 Sempurna |
| SEO | 45 | 🔴 Kritis |

---

## 1. 🔴 SEO — Skor 45 (Kritis)

SEO adalah area dengan masalah paling serius. Halaman admin ini kemungkinan terblokir dari indexing secara sengaja, namun beberapa poin tetap perlu dibenahi.

### Masalah yang Ditemukan

#### 1.1 Halaman Diblokir dari Indexing
```
Audit: Page is blocked from indexing
```
**Penyebab:** Kemungkinan ada tag `<meta name="robots" content="noindex">` atau header HTTP `X-Robots-Tag: noindex`.

**Solusi:**
- Jika halaman `/admin/*` memang tidak ingin diindex (direkomendasikan untuk halaman admin), ini bisa dibiarkan — tapi pastikan ini **disengaja**.
- Jika ingin diindex, hapus tag `noindex` tersebut.

```html
<!-- Hapus ini jika ingin halaman terindex -->
<meta name="robots" content="noindex, nofollow" />
```

#### 1.2 robots.txt Tidak Valid — 18 Error
```
Audit: robots.txt is not valid — 18 errors found
```
**Solusi:** Perbaiki file `robots.txt` di root domain. Contoh format yang benar:

```
User-agent: *
Disallow: /admin/
Allow: /

Sitemap: https://your-domain.com/sitemap.xml
```

> Setiap baris harus mengikuti format `Direktif: nilai` yang valid. Periksa apakah ada karakter tersembunyi, spasi ekstra, atau direktif yang salah.

#### 1.3 Tidak Ada Meta Description
```
Audit: Document does not have a meta description
```
**Solusi:** Tambahkan meta description di setiap halaman, termasuk halaman admin:

```html
<head>
  <meta name="description" content="Laporan Keuangan Smart Clinic — Pantau pendapatan dan pengeluaran klinik." />
</head>
```

Untuk Next.js / React, gunakan:
```jsx
// Menggunakan Next.js Metadata API
export const metadata = {
  description: 'Laporan Keuangan Smart Clinic',
};
```

---

## 2. 🟠 Performance — Skor 70

### Metrik Saat Ini

| Metrik | Nilai | Target Ideal |
|---|---|---|
| First Contentful Paint (FCP) | 1.5 s | < 1.8 s ✅ |
| Largest Contentful Paint (LCP) | 2.2 s | < 2.5 s ✅ |
| Total Blocking Time (TBT) | 200 ms | < 200 ms ⚠️ |
| Cumulative Layout Shift (CLS) | 0.121 | < 0.1 ❌ |
| Speed Index | 2.3 s | < 3.4 s ✅ |

### Masalah yang Ditemukan

#### 2.1 JavaScript Tidak Digunakan — Potensi Hemat 662 KiB
```
Audit: Reduce unused JavaScript — Est savings of 662 KiB
```
Ini adalah masalah terbesar. Banyak kode JS yang di-load tapi tidak digunakan di halaman ini.

**Solusi:**
- Aktifkan **code splitting** dan **lazy loading** untuk komponen yang tidak langsung dibutuhkan.
- Gunakan dynamic import di React/Next.js:

```jsx
// Sebelum
import HeavyComponent from './HeavyComponent';

// Sesudah
const HeavyComponent = dynamic(() => import('./HeavyComponent'), { ssr: false });
```

- Audit dependencies dengan `npx webpack-bundle-analyzer` atau `next-bundle-analyzer`.
- Pertimbangkan mengganti library besar dengan alternatif yang lebih ringan (contoh: ganti `moment.js` dengan `date-fns`).

#### 2.2 Main Thread Terlalu Sibuk — 3.3 Detik
```
Audit: Minimize main-thread work — 3.3 s
Audit: Avoid long main-thread tasks — 10 long tasks found
```
Ada 10 task panjang yang memblokir browser dari merespons input pengguna.

**Solusi:**
- Pecah task besar menjadi bagian kecil menggunakan `setTimeout` atau `scheduler.yield()`.
- Hindari komputasi berat di komponen React saat render awal — pindahkan ke `useEffect`.
- Gunakan `React.memo` dan `useMemo` untuk mencegah re-render yang tidak perlu.

```jsx
// Gunakan useMemo untuk komputasi berat
const processedData = useMemo(() => {
  return expensiveDataProcessing(rawData);
}, [rawData]);
```

#### 2.3 Render-Blocking Requests — Hemat 300 ms
```
Insight: Render-blocking requests — Est savings of 300 ms
```
Ada resource (CSS/JS) yang memblokir browser merender halaman.

**Solusi:**
- Tambahkan atribut `defer` atau `async` pada script tag:
```html
<script src="script.js" defer></script>
```
- Untuk CSS yang tidak kritis, gunakan `preload` dengan `media` trick:
```html
<link rel="preload" href="non-critical.css" as="style" onload="this.rel='stylesheet'">
```

#### 2.4 Cumulative Layout Shift (CLS) — 0.121 (Target < 0.1)
```
Insight: Layout shift culprits
```
Elemen di halaman bergeser posisinya saat loading, mengganggu pengalaman pengguna.

**Solusi:**
- Selalu tentukan ukuran (`width` dan `height`) pada elemen gambar:
```html
<img src="logo.png" width="200" height="50" alt="Logo" />
```
- Reservasi ruang untuk konten yang di-load secara async (tabel, grafik) dengan skeleton loader atau CSS `min-height`.
- Hindari menyisipkan konten di atas konten yang sudah ada.

#### 2.5 JavaScript Belum Diminifikasi — Hemat 36 KiB
```
Audit: Minify JavaScript — Est savings of 36 KiB
```
**Solusi:** Pastikan build production mengaktifkan minifikasi. Untuk Next.js, ini otomatis aktif saat `next build`. Periksa apakah ada file JS yang di-serve tanpa minifikasi.

#### 2.6 IndexedDB Memengaruhi Skor
```
Warning: There may be stored data affecting loading performance (IndexedDB)
```
**Catatan:** Jalankan audit ulang di **jendela incognito** untuk mendapatkan skor yang lebih akurat dan tidak terpengaruh data tersimpan.

---

## 3. 🟡 Accessibility — Skor 90

### Masalah yang Ditemukan

#### 3.1 Tombol Tanpa Nama Aksesibel
```
Audit: Buttons do not have an accessible name
```
Tombol (misalnya tombol ikon) tidak memiliki label yang dapat dibaca screen reader.

**Solusi:** Tambahkan `aria-label` pada tombol yang hanya menggunakan ikon:

```jsx
// Sebelum
<button onClick={handleExport}>
  <DownloadIcon />
</button>

// Sesudah
<button onClick={handleExport} aria-label="Export laporan ke Excel">
  <DownloadIcon />
</button>
```

#### 3.2 Kontras Warna Tidak Cukup
```
Audit: Background and foreground colors do not have a sufficient contrast ratio
```
Beberapa teks tidak memiliki kontras yang cukup dengan background-nya (rasio minimum WCAG AA: 4.5:1 untuk teks normal).

**Solusi:**
- Gunakan tool seperti [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) untuk mengecek pasangan warna.
- Pada dark theme (seperti yang terlihat di screenshot), perhatikan teks abu-abu muda di atas background gelap.

```css
/* Contoh: Tingkatkan kontras teks muted */
.text-muted {
  color: #9ca3af; /* Ganti dengan */
  color: #d1d5db; /* Lebih terang untuk dark background */
}
```

---

## 4. ✅ Best Practices — Skor 100

Selamat! Semua audit Best Practices telah lulus. Namun ada beberapa item informatif:

- **CSP, COOP, XFO, Trusted Types** — Ini tidak mempengaruhi skor, namun bisa diimplementasikan untuk keamanan yang lebih baik di masa depan.
- **Missing source maps** — Tambahkan source maps untuk memudahkan debugging di production (pastikan tidak terekspos secara publik).

---

## Prioritas Perbaikan & Status Implementasi

| Prioritas | Item | Dampak | Usaha | Status | Keterangan |
|---|---|---|---|---|---|
| 🔴 1 | Perbaiki `robots.txt` | SEO +20 | Rendah | 🟢 **Selesai** | Membuat file `public/robots.txt` yang valid. |
| 🔴 2 | Tambah meta description | SEO +15 | Rendah | 🟢 **Selesai** | Menambahkan meta description tag di `index.html`. |
| 🟠 3 | Kurangi unused JavaScript | Performance +10 | Tinggi | 🟡 **Dalam Proses** | Memulai optimasi bundle size & lazy loading. |
| 🟠 4 | Perbaiki CLS (layout shift) | Performance +5 | Sedang | 🟡 **Dalam Proses** | Penataan kerangka layout statis. |
| 🟡 5 | Tambahkan aria-label pada tombol | Accessibility +5 | Rendah | 🟢 **Selesai** | Menambahkan `aria-label` di SidebarTrigger, Dark Mode Toggle, dan Tombol Download. |
| 🟡 6 | Perbaiki kontras warna | Accessibility +3 | Sedang | 🟢 **Selesai** | Ditambahkan CSS global dark-mode override di `App.css` untuk kontras warna optimal. |
| 🟢 7 | Minimasi main-thread work | Performance +5 | Tinggi | 🟡 **Dalam Proses** | Optimalisasi re-render dan caching data API. |

---

## Catatan Tambahan

- **Halaman `/admin`** wajar untuk di-noindex karena bukan halaman publik. Fokus SEO sebaiknya di halaman-halaman publik.
- **Audit ulang di Incognito** setelah setiap perbaikan untuk hasil yang akurat.
- Gunakan **Lighthouse CI** di pipeline GitHub Actions agar skor tidak turun setelah setiap deploy.

---

*Dibuat berdasarkan Lighthouse 13.2.0 — 28 Juni 2026*