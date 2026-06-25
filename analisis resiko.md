# Analisis Kerentanan Keamanan Deployment (POS-Clinic)

Analisis ini menyajikan evaluasi menyeluruh mengenai risiko keamanan yang dihadapi oleh sistem frontend **CapstonPos-QrisGII** setelah dideploy ke lingkungan production (misalnya Vercel). Berdasarkan peninjauan struktur kode, konfigurasi environment variables, dan mekanisme otentikasi, ditemukan beberapa celah keamanan kritikal yang perlu segera ditangani sebelum sistem digunakan untuk data riil.

---

## 🚨 Rangkuman Risiko Keamanan

| ID Kerentanan | Deskripsi Celah Keamanan | Tingkat Keparahan | Status | Dampak |
| :--- | :--- | :---: | :---: | :--- |
| **VULN-01** | Eksploitasi Kredensial Admin RME & Warehouse Terbuka di Bundle Frontend | **CRITICAL** | Terbuka | Kendali penuh (Admin) atas server Rekam Medis (RME) & Gudang (WMS) |
| **VULN-02** | *Cryptographic Obfuscation* Lemah pada Penyimpanan Token di LocalStorage | **HIGH** | Terbuka | Token JWT rentan dicuri via XSS dan didekripsi instan oleh penyerang |
| **VULN-03** | Tidak Ada Validasi/Sanitasi Path pada Serverless Proxy (`warehouseProxy.js`) | **MEDIUM** | Terbuka | Potensi bypass routing atau penyalahgunaan serverless endpoint |
| **VULN-04** | Kredensial Akun Demo Terekspos di Layar Login | **LOW-MEDIUM** | Terbuka | Akses tidak sah ke data demo oleh pengguna umum di production |

---

## 🔍 Pembahasan Mendalam Kerentanan

### VULN-01: Eksploitasi Kredensial Admin RME & Warehouse Terbuka di Bundle Frontend
> [!IMPORTANT]
> **Tingkat Keparahan: CRITICAL**
>
> **Lokasi File:** 
> * [src/api/warehouseClient.ts](file:///d:/SEMESTER%206/Capstone%20Project/DEPLOY/CapstonPos-QrisGII/src/api/warehouseClient.ts#L100-L156)
> * [src/api/rmeClient.ts](file:///d:/SEMESTER%206/Capstone%20Project/DEPLOY/CapstonPos-QrisGII/src/api/rmeClient.ts#L107-L147)
> * [src/features/auth/store/authStore.ts](file:///d:/SEMESTER%206/Capstone%20Project/DEPLOY/CapstonPos-QrisGII/src/features/auth/store/authStore.ts)

#### Deskripsi Masalah:
Aplikasi menggunakan environment variables yang diawali dengan prefiks `VITE_` untuk menyimpan kredensial admin sistem eksternal:
* `VITE_RME_ADMIN_EMAIL` & `VITE_RME_ADMIN_PASSWORD`
* `VITE_WAREHOUSE_ADMIN_EMAIL` & `VITE_WAREHOUSE_ADMIN_PASSWORD`

Dalam ekosistem Vite, semua variabel env berkode `VITE_*` akan **diinjeksi dan dikompilasi langsung** ke dalam bundle file JavaScript client-side (static assets) saat proses `npm run build`. 

#### Cara Penyerangan (Exploitation Scenario):
1. Penyerang membuka aplikasi POS-Clinic di production.
2. Membuka Chrome Developer Tools -> Network Tab atau Sources.
3. Mencari string `"@smartclinic"` atau memeriksa file JS hasil build (`assets/index-*.js`).
4. Menemukan teks email dan password admin yang dikompilasi secara *plain text*.
5. Menembak langsung API eksternal (Render API RME & WMS) menggunakan kredensial tersebut menggunakan tools seperti Postman. Penyerang kini memiliki hak akses Administrator penuh atas sistem inventori dan rekam medis pasien.

---

### VULN-02: Cryptographic Obfuscation Lemah pada Penyimpanan Token
> [!WARNING]
> **Tingkat Keparahan: HIGH**
>
> **Lokasi File:** 
> * [src/features/auth/store/authStore.ts](file:///d:/SEMESTER%206/Capstone%20Project/DEPLOY/CapstonPos-QrisGII/src/features/auth/store/authStore.ts#L4-L42)

#### Deskripsi Masalah:
Aplikasi mengimplementasikan helper `secureStorage` menggunakan operasi XOR sederhana dan Base64 encoding untuk "mengamankan" JWT tokens:
```typescript
const STORAGE_KEY_SALT = "klinik-pos-qris-secure-salt-2026";
```

Ini adalah bentuk **Security by Obscurity**. Kunci XOR (`STORAGE_KEY_SALT`) bersifat statik dan berada di kode JavaScript yang sama. Siapa pun (atau script berbahaya mana pun) dapat membaca algoritma tersebut dan mendekripsi isinya dengan sangat mudah.

#### Dampak:
Jika aplikasi terkena serangan *Cross-Site Scripting* (XSS) melalui library pihak ketiga yang disusupi atau celah input, script XSS dapat membaca LocalStorage/SessionStorage, mengekstrak token terenkripsi, mendekripsinya menggunakan algoritma XOR di atas, lalu mengirimkannya ke server penyerang.

---

### VULN-03: Tidak Ada Validasi/Sanitasi Path pada Serverless Proxy
> [!NOTE]
> **Tingkat Keparahan: MEDIUM**
>
> **Lokasi File:** 
> * [api/warehouseProxy.js](file:///d:/SEMESTER%206/Capstone%20Project/DEPLOY/CapstonPos-QrisGII/api/warehouseProxy.js#L1-L18)

#### Deskripsi Masalah:
Fungsi proxy `/api/warehouseProxy` secara mentah menerima query string `targetPath` dan menggabungkannya ke target API:
```javascript
const targetPath = req.query.targetPath || '';
const target = `https://system-inventory-management.onrender.com/${targetPath}`;
```

Tidak ada proses pembersihan (sanitasi) terhadap parameter `targetPath`. Penyerang bisa bereksperimen dengan melakukan manipulasi parameter seperti memasukkan karakter khusus atau melakukan path traversal (`../../`) guna mengakses endpoint internal backend yang tidak seharusnya diekspos melalui proxy.

---

### VULN-04: Kredensial Akun Demo Terekspos di Layar Login
> [!NOTE]
> **Tingkat Keparahan: LOW-MEDIUM**
>
> **Lokasi File:** 
> * [src/features/auth/components/login-form.tsx](file:///d:/SEMESTER%206/Capstone%20Project/DEPLOY/CapstonPos-QrisGII/src/features/auth/components/login-form.tsx#L230-L233)

#### Deskripsi Masalah:
Tombol pintas demo credentials (`admin@klinik.com`, `kasir@klinik.com`) diletakkan di komponen login form utama tanpa filter mode environment (`import.meta.env.DEV`).

#### Dampak:
Ketika dideploy ke production, pengguna publik atau pasien yang tidak sengaja menemukan halaman login POS dapat masuk ke sistem kasir/admin demo, melihat data simulasi transaksi, atau berpotensi melakukan tindakan merusak (spamming/DDOS) pada database demo yang tersambung.

---

## 🛠️ Langkah-Langkah Rekomendasi Perbaikan (Remediation Roadmap)

Untuk mengatasi celah keamanan di atas secara efektif, berikut langkah yang direkomendasikan dibagi berdasarkan tingkat urgensi:

### 1. Perbaikan Segera (Urgensi: Sangat Tinggi)

* **Hapus Akun Demo di Production**:
  Batasi rendering tombol kredensial demo di `login-form.tsx` hanya saat environment development:
  ```tsx
  {import.meta.env.DEV && (
    <div className="mt-5 flex flex-wrap justify-center gap-1.5">
       <button onClick={() => handleDemoCredentialClick('admin@klinik.com', 'password123')} ...>Admin</button>
       <button onClick={() => handleDemoCredentialClick('kasir@klinik.com', 'password123')} ...>Kasir</button>
    </div>
  )}
  ```

* **Migrasikan Kredensial Admin ke Server-Side (Vercel Serverless Function)**:
  Jangan pernah melakukan *hardcoded login* admin eksternal di sisi client. Konfigurasikan Serverless Functions di bawah direktori `/api` untuk menangani otentikasi ke RME dan Warehouse.
  * Hapus prefiks `VITE_` dari variabel sensitif di `.env` (menjadi `RME_ADMIN_EMAIL`, `WAREHOUSE_ADMIN_EMAIL`, dll). Variabel tanpa prefiks `VITE_` **tidak akan diinjeksi** ke bundle client.
  * Buat endpoint proxy serverless khusus untuk handling otentikasi (contoh: `/api/auth/warehouse-login`). Serverless function ini berjalan di sisi server (Node.js) sehingga dapat membaca environment variables rahasia secara aman, melakukan hit ke endpoint backend eksternal, dan meneruskan tokennya kembali ke client dalam format aman.


