# 📋 Dokumentasi Routing Sistem

## Overview
Sistem routing telah diorganisir secara rapi dengan fitur auto-redirect berdasarkan role pengguna setelah login.

## Struktur Routing

```
KLINIK-PAYMENT/
├── /login                       → Halaman login
├── /admin/
│   ├── dashboard               → Dashboard admin
│   ├── analytics               → Analytics dashboard (default untuk admin)
│   └── settings                → Pengaturan admin
├── /kasir/
│   ├── dashboard (default)     → Dashboard kasir
│   ├── riwayat                 → Riwayat transaksi
│   ├── pasien                  → Data pasien
│   ├── stok                    → Stok obat
│   └── pengaturan              → Pengaturan kasir
└── /dokter/
    └── dashboard               → Dashboard dokter
```

## Fitur Auto-Redirect

Setelah login, user akan diarahkan otomatis sesuai role:

| Role | Redirect Destination |
|------|----------------------|
| **admin** | `/admin/analytics` |
| **kasir** | `/kasir` |
| **dokter** | `/dokter/dashboard` |

## File Routing

### 1. `src/routes/routeConfig.ts`
- **Fungsi**: Menampung konfigurasi semua route
- **Isi**: Konstanta `ROUTES` dan fungsi `getRoleRedirectPath()`
- **Keuntungan**: Centralized, mudah maintenance

```typescript
// Contoh penggunaan
import { ROUTES } from '@/routes/routeConfig';

// Navigate ke route yang spesifik
navigate(ROUTES.KASIR.RIWAYAT);

// Dapatkan redirect path berdasarkan role
const path = getRoleRedirectPath(user.role);
```

### 2. `src/routes/ProtectedRoute.tsx`
- **Fungsi**: Component untuk melindungi route yang butuh autentikasi
- **Fitur**: Validasi role pengguna
- **Keuntungan**: Reusable, aman

```typescript
// Contoh penggunaan
<Route
  element={
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
/>
```

### 3. `src/App.tsx` (Main Router)
- **Update**: Routes sekarang terorganisir per role
- **Security**: Setiap route dilindungi dengan `ProtectedRoute`
- **Readability**: Dikelompokkan logis (AUTH, KASIR, ADMIN, dll)

### 4. `src/features/auth/page/login.tsx`
- **Update**: Menggunakan `getRoleRedirectPath()` untuk redirect yang benar
- **Logic**: User diarahkan ke route sesuai rolenya

## Cara Kerja

### Flow Login
```
1. User masuk kredensial di LoginPage
2. LoginForm memanggil onSubmit(credentials)
3. AuthProvider melakukan login melalui AuthService
4. LoginPage mendeteksi isAuthenticated = true
5. LoginPage mendapat user role
6. getRoleRedirectPath(role) menentukan destination
7. User di-redirect ke dashboard yang sesuai
```

### Flow Protected Route
```
1. User mencoba akses route terproteksi
2. ProtectedRoute check isAuthenticated
   ├─ Jika false → redirect ke /login
   └─ Jika true → check allowedRoles
      ├─ Jika role tidak cocok → redirect ke /login
      └─ Jika role cocok → render component
```

## Contoh Penggunaan di Komponen

### Redirect Manual
```typescript
import { ROUTES } from '@/routes/routeConfig';
import { useNavigate } from 'react-router-dom';

export const MyComponent = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    navigate(ROUTES.AUTH.LOGIN);
  };
  
  return <button onClick={handleLogout}>Logout</button>;
};
```

### Cek Role Pengguna
```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

export const MyComponent = () => {
  const { user } = useAuth();
  
  if (user?.role === 'admin') {
    return <AdminPanel />;
  }
  
  return <UserPanel />;
};
```

## Menambah Route Baru

### 1. Tambah ke `routeConfig.ts`
```typescript
export const ROUTES = {
  // ... existing routes
  CUSTOM: {
    HALAMAN_BARU: '/custom/halaman-baru',
  },
};
```

### 2. Tambah ke `App.tsx`
```typescript
<Route
  path={ROUTES.CUSTOM.HALAMAN_BARU}
  element={
    <ProtectedRoute allowedRoles={["admin", "kasir"]}>
      <HalamanBaru />
    </ProtectedRoute>
  }
/>
```

## Best Practices

✅ **Do's**
- Gunakan `ROUTES.X.Y` untuk semua navigasi
- Selalu gunakan `ProtectedRoute` untuk route yang butuh login
- Specify `allowedRoles` untuk pembatasan akses
- Keep routes organized by feature/role

❌ **Don'ts**
- Jangan hardcode path string (`'/kasir'`)
- Jangan skip `ProtectedRoute` protection
- Jangan lupa update `allowedRoles` saat menambah akses

## Testing

Test script untuk verifikasi routing:

```bash
# Build project
npm run build

# Test login sebagai different roles
# Admin: email = 'admin@klinik.com', password = 'admin123'
# Kasir: email = 'kasir@klinik.com', password = 'kasir123'
# Dokter: email = 'dokter@klinik.com', password = 'dokter123'
```

---

**Last Updated**: May 10, 2026  
**Created by**: GitHub Copilot CLI
