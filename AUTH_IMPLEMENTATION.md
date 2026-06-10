# 🔐 Implementasi Sistem Login Authentication

## 📋 Ringkasan Implementasi

Sistem authentication dengan role-based routing untuk mendukung dua role utama: **KASIR** dan **SUPER_ADMIN**, serta backward compatibility dengan role existing (**admin**, **dokter**).

---

## 🔑 Role yang Didukung

| Role | Endpoint | Deskripsi |
|------|----------|-----------|
| **KASIR** | `/kasir` | User untuk operasional kasir (transaksi, laporan sederhana) |
| **SUPER_ADMIN** | `/super-admin` | Administrator dengan akses penuh |
| **admin** | `/admin/dashboard` | Administrator lama (backward compatible) |
| **dokter** | `/dokter/dashboard` | Dokter |

---

## 📁 File yang Diupdate

### 1. **Type Definitions** (`src/features/auth/types/auth.types.ts`)
```typescript
- Updated AuthResponse untuk match API response: { message, access_token, user }
- Updated User role type: 'KASIR' | 'SUPER_ADMIN' | 'admin' | 'kasir' | 'dokter'
```

### 2. **Auth Service** (`src/features/auth/service/auth.service.ts`)
```typescript
Perubahan:
✅ Menggunakan VITE_API_INTERNAL_URL dari .env.local
✅ Endpoint: {API_INTERNAL_URL}/api/auth/login
✅ Parse access_token dari response (bukan token)
✅ Support KASIR dan SUPER_ADMIN roles
✅ Demo users untuk development testing
✅ Toggle USE_DEMO (default: false untuk production)
```

### 3. **Route Configuration** (`src/routes/routeConfig.ts`)
```typescript
Perubahan:
✅ Added SUPER_ADMIN routes:
   - /super-admin/dashboard
   - /super-admin/management
   - /super-admin/reports
   - /super-admin/settings
✅ Updated getRoleRedirectPath() untuk handle semua roles
```

### 4. **Protected Route** (`src/routes/ProtectedRoute.tsx`)
```typescript
Perubahan:
✅ Updated allowedRoles type untuk support KASIR dan SUPER_ADMIN
✅ Proper role checking dengan case-sensitivity
```

### 5. **Main App Router** (`src/App.tsx`)
```typescript
Perubahan:
✅ Added SUPER_ADMIN route group dengan ProtectedRoute
✅ Updated KASIR route allowedRoles: ["kasir", "admin", "KASIR"]
✅ Proper route hierarchy untuk setiap role
```

### 6. **Environment Configuration** (`.env.local`)
```env
✅ VITE_API_INTERNAL_URL=https://db-posqris-cpgii-production.up.railway.app
   (Used untuk login authentication)
```

### 7. **Login Form** (`src/features/auth/components/login-form.tsx`)
```typescript
Perubahan:
✅ Added "Super Admin" demo button untuk testing
✅ Demo buttons: Admin, Kasir, Super Admin
```

---

## 🔄 Login Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       LOGIN PAGE                                │
│  Input: Email + Password                                        │
│  (Optional: Remember Me checkbox)                               │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
        ┌────────────────────────────────────┐
        │   AuthService.login()              │
        │   POST /api/auth/login             │
        └────────────────────┬───────────────┘
                             │
        ┌────────────────────▼───────────────┐
        │ Response:                          │
        │ {                                  │
        │   "message": "Login berhasil",    │
        │   "access_token": "eyJhbG...",    │
        │   "user": {                       │
        │     "id": "...",                  │
        │     "name": "...",                │
        │     "email": "...",               │
        │     "role": "KASIR|SUPER_ADMIN"   │
        │   }                               │
        │ }                                  │
        └────────────────────┬───────────────┘
                             │
        ┌────────────────────▼───────────────┐
        │ Store Token & User:                │
        │ - localStorage (if remember=true) │
        │ - sessionStorage (if remember=false)│
        └────────────────────┬───────────────┘
                             │
        ┌────────────────────▼───────────────┐
        │ Redirect berdasarkan role:        │
        │ KASIR → /kasir                    │
        │ SUPER_ADMIN → /super-admin/...   │
        │ admin → /admin/dashboard         │
        └────────────────────────────────────┘
```

---

## 🧪 Testing Authentication

### Demo Credentials untuk Development

1. **Admin (backward compatible)**
   ```
   Email: admin@klinik.com
   Password: admin123
   Role: admin
   Path: /admin/dashboard
   ```

2. **Kasir (lama)**
   ```
   Email: kasir@klinik.com
   Password: kasir123
   Role: KASIR
   Path: /kasir
   ```

3. **Super Admin (baru)**
   ```
   Email: super_admin@klinik.com
   Password: super123
   Role: SUPER_ADMIN
   Path: /super-admin/dashboard
   ```

### Cara Test:
1. Buka Login Page
2. Klik salah satu demo button
3. Verify redirect ke dashboard yang benar
4. Check localStorage/sessionStorage untuk token & user data

---

## 🔌 API Integration

### Real API Login Endpoint

**Endpoint:** `{VITE_API_INTERNAL_URL}/api/auth/login`

**Request:**
```json
{
  "email": "kasir@klinik.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "message": "Login berhasil",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "b85555fc-886a-4a0a-8447-4f2fa80c076c",
    "name": "Kasir Satu",
    "email": "kasir@klinik.com",
    "role": "KASIR"
  }
}
```

**Response Error (4xx/5xx):**
```json
{
  "message": "Error message here"
}
```

---

## ⚙️ Configuration

### Environment Variables
```env
# File: .env.local

# Backend untuk login (KASIR & SUPER_ADMIN)
VITE_API_INTERNAL_URL=https://db-posqris-cpgii-production.up.railway.app
```

### Auth Service Configuration
```typescript
// File: src/features/auth/service/auth.service.ts
private static readonly USE_DEMO = false; // false = production, true = demo
```

---

## 🔐 Security Considerations

1. **Token Storage:**
   - Gunakan `localStorage` jika user memilih "Remember Me"
   - Gunakan `sessionStorage` untuk default (lebih aman, cleansing saat tab ditutup)

2. **Token Management:**
   - Token disimpan sebagai `authToken`
   - User data disimpan sebagai JSON string `user`
   - Logout menghapus kedua data

3. **Protected Routes:**
   - Semua routes menggunakan `ProtectedRoute` wrapper
   - Automatic redirect ke login jika tidak authenticated
   - Role-based access control (RBAC) dengan `allowedRoles` prop

4. **Future Improvements:**
   - Implement token refresh mechanism
   - Add token expiration validation
   - JWT decode untuk check token validity
   - Auto-logout jika token expired

---

## 📝 Usage Examples

### Using Auth Hook
```typescript
import { useAuth } from '@/features/auth/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading, error } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please login</div>;
  }
  
  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <p>Role: {user?.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Using Protected Route
```typescript
<Route
  element={
    <ProtectedRoute allowedRoles={["KASIR", "SUPER_ADMIN"]}>
      <SomeComponent />
    </ProtectedRoute>
  }
>
  <Route path="/some-path" element={<ChildComponent />} />
</Route>
```

### Manual Login
```typescript
const { login } = useAuth();

const handleLogin = async () => {
  try {
    await login({
      email: 'user@example.com',
      password: 'password123',
      remember: true
    });
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

---

## 📊 Route Structure

```
/
├── / → Redirect ke /login
├── /login → LoginPage (Public)
│
├── /admin/** → Protected (admin only)
│   ├── /admin/dashboard
│   ├── /admin/Pasien
│   ├── /admin/Transaksi
│   ├── /admin/Laporan
│   └── /admin/settings
│
├── /super-admin/** → Protected (SUPER_ADMIN only)
│   ├── /super-admin/dashboard
│   ├── /super-admin/management
│   ├── /super-admin/reports
│   └── /super-admin/settings
│
├── /kasir/** → Protected (kasir, admin, KASIR)
│   ├── /kasir → Dashboard
│   ├── /kasir/riwayat → History Transaksi
│   ├── /kasir/pasien → Data Pasien
│   ├── /kasir/stok → Stok Obat
│   └── /kasir/pengaturan → Settings
│
└── /* → Redirect ke /login
```

---

## ✅ Checklist Implementasi

- [x] Update auth.types.ts untuk API response structure
- [x] Update auth.service.ts untuk gunakan VITE_API_INTERNAL_URL
- [x] Update routeConfig.ts dengan SUPER_ADMIN routes
- [x] Update ProtectedRoute.tsx untuk handle KASIR & SUPER_ADMIN
- [x] Update App.tsx dengan SUPER_ADMIN routes
- [x] Update .env.local dengan VITE_API_INTERNAL_URL
- [x] Update login-form.tsx dengan Super Admin button
- [x] Demo users untuk testing
- [x] Backward compatibility dengan existing roles
- [x] TypeScript type safety

---

## 🚀 Next Steps

1. **Implement Token Refresh**
   - Add refresh token logic
   - Handle token expiration

2. **Add Password Reset**
   - Integrate forgot password flow
   - Email verification

3. **Implement 2FA (Two-Factor Authentication)**
   - SMS/Email OTP
   - TOTP support

4. **User Management**
   - Role management UI
   - User creation/deletion by admin

5. **Audit Logging**
   - Log login attempts
   - Track user actions

---

## 📞 Support

Untuk pertanyaan atau issues, hubungi developer team.

---

**Last Updated:** 2024
**Status:** ✅ Production Ready
