# 📋 Rules: Implementasi Activity Log

Dokumen ini adalah **aturan wajib** saat menambahkan log aktivitas ke endpoint `POST /api/v1/settings/activity-logs`.

---

## 1. Gunakan Selalu `logActivity()` Utility

**Jangan pernah** memanggil `settingService.createActivityLog()` secara langsung.
Selalu gunakan utility terpusat:

```ts
import { logActivity } from '@/features/analitik/utils/activityLogger';

logActivity({
  action: 'CHANGE_SETTINGS',
  module: 'SETTINGS',
  detail: 'Deskripsi aksi yang dilakukan',
  target_name: 'Nama target',
  target_id: 'uuid-target-jika-ada',   // opsional, harus UUID valid
  status: 'SUCCESS',                    // opsional, default SUCCESS
  error_message: 'pesan error',         // opsional, isi hanya jika FAILED
});
```

> `logActivity()` bersifat **fire-and-forget** — kegagalan log tidak akan mengganggu flow utama aplikasi.

---

## 2. Nilai Enum yang Valid (WAJIB DIPATUHI)

Backend menggunakan tipe ENUM PostgreSQL. Nilai di luar daftar ini akan menyebabkan **error 500**.

### `action` → tipe `action_type`

| Nilai           | Kapan digunakan                                  |
|-----------------|--------------------------------------------------|
| `LOGIN`         | Admin berhasil login                             |
| `LOGOUT`        | Admin logout                                     |
| `EXPORT_PDF`    | Download/export file PDF atau backup             |
| `EXPORT_EXCEL`  | Export data ke format Excel                      |
| `SEND_WA_REMINDER` | Kirim notifikasi WhatsApp                     |
| `CREATE_TRANSACTION` | Buat transaksi baru di kasir                |
| `UPDATE_TRANSACTION` | Edit/update transaksi                       |
| `VOID_TRANSACTION`   | Batalkan transaksi                          |
| `VIEW_REPORT`   | Akses/lihat laporan                              |
| `CHANGE_SETTINGS` | **Semua aksi di modul SETTINGS** (tambah user, hapus user, ubah password, backup, dll.) |

### `module` → tipe `service_module`

| Nilai       | Digunakan untuk                              |
|-------------|----------------------------------------------|
| `AUTH`      | Login, logout                                |
| `SETTINGS`  | Semua aksi di halaman Pengaturan             |
| `KASIR`     | Transaksi kasir / POS                        |
| `LAPORAN`   | Laporan keuangan, export                     |
| `DASHBOARD` | Akses dashboard & analitik                   |
| `PIUTANG`   | Manajemen piutang pasien                     |

### `status` → tipe `log_status`

| Nilai     | Kapan digunakan         |
|-----------|-------------------------|
| `SUCCESS` | Aksi berhasil (default) |
| `FAILED`  | Aksi gagal / error      |
| `PENDING` | Proses sedang berjalan  |

---

## 3. Aturan Field `target_id`

- **Hanya kirim `target_id` jika nilainya adalah UUID valid** (format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
- Jangan kirim ID lokal/mock seperti `USR-001`, `SYS-XXXX`, `CURRENT_USER`, `New`, dsb.
- Jika tidak ada UUID yang valid, **abaikan field ini** (kirim `undefined`).

```ts
// ✅ BENAR — UUID dari API response
target_id: response.user?.id  // e.g., "59dbc975-70a5-48f8-a044-86a062bd5a96"

// ❌ SALAH — ID mock lokal
target_id: 'USR-001'
target_id: 'CURRENT_USER'
target_id: 'SYS-ABC123'
```

---

## 4. Aturan Field `error_message`

- Kirim `null` (bukan string kosong `""`) jika tidak ada pesan error.
- Isi hanya saat `status: 'FAILED'`.

```ts
// ✅ BENAR
error_message: null
error_message: 'Gagal menyimpan data: koneksi timeout'

// ❌ SALAH
error_message: ''
```

---

## 5. Field yang TIDAK Boleh Dikirim dari Frontend

Backend mengatur field-field berikut secara otomatis di server. **Jangan masukkan** ke payload:

| Field        | Keterangan                                  |
|--------------|---------------------------------------------|
| `id`         | Auto-generated UUID oleh database           |
| `created_at` | Auto-generated timestamp oleh database      |

---

## 6. Pola Implementasi: Sukses & Gagal

Selalu log kedua kondisi untuk aksi kritis:

```ts
try {
  const result = await someService.doAction(payload);

  // Log sukses
  logActivity({
    action: 'CHANGE_SETTINGS',
    module: 'SETTINGS',
    detail: `Berhasil melakukan X: ${result.name}`,
    target_name: 'NamaTarget',
    target_id: result.id, // hanya jika UUID valid
  });

} catch (error: any) {
  const msg = error.response?.data?.message || error.message || 'Terjadi kesalahan';

  // Log gagal
  logActivity({
    action: 'CHANGE_SETTINGS',
    module: 'SETTINGS',
    status: 'FAILED',
    detail: `Gagal melakukan X`,
    error_message: msg,
    target_name: 'NamaTarget',
  });

  throw error; // re-throw agar error handling UI tetap berjalan
}
```

---

## 7. Mapping Aksi Pengaturan (Referensi Cepat)

| Aksi UI                  | `action`          | `module`   |
|--------------------------|-------------------|------------|
| Tambah pengguna baru     | `CHANGE_SETTINGS` | `SETTINGS` |
| Hapus pengguna           | `CHANGE_SETTINGS` | `SETTINGS` |
| Ubah status aktif user   | `CHANGE_SETTINGS` | `SETTINGS` |
| Ubah password            | `CHANGE_SETTINGS` | `SETTINGS` |
| Buat backup              | `CHANGE_SETTINGS` | `SETTINGS` |
| Hapus backup             | `CHANGE_SETTINGS` | `SETTINGS` |
| Download/export backup   | `EXPORT_PDF`      | `SETTINGS` |
| Login admin              | `LOGIN`           | `AUTH`     |
| Logout admin             | `LOGOUT`          | `AUTH`     |
| Export laporan PDF       | `EXPORT_PDF`      | `LAPORAN`  |
| Export laporan Excel     | `EXPORT_EXCEL`    | `LAPORAN`  |
| Buat transaksi kasir     | `CREATE_TRANSACTION` | `KASIR` |
| Void transaksi           | `VOID_TRANSACTION` | `KASIR`   |

---

## 8. Lokasi File Penting

| File | Fungsi |
|------|--------|
| `src/features/analitik/utils/activityLogger.ts` | Utility utama, **selalu gunakan ini** |
| `src/features/analitik/services/setting.service.ts` | Service layer (createActivityLog) |
| `src/features/analitik/types/setting.types.ts` | TypeScript interface request/response |

---

> **Catatan:** Jika ingin menambahkan nilai ENUM baru (action/module baru), koordinasikan dengan backend untuk menjalankan migrasi database terlebih dahulu.
