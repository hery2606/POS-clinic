# 🎯 Auth Implementation Quick Reference

## 📱 Login Response Structure
```json
{
  "message": "Login berhasil",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "b85555fc-886a-4a0a-8447-4f2fa80c076c",
    "name": "Kasir Satu",
    "email": "kasir@klinik.com",
    "role": "KASIR"  // atau "SUPER_ADMIN"
  }
}
```

## 🔐 Role-Based Routing

| Role | Login Path | Redirect Path | Layout |
|------|-----------|--------------|--------|
| **KASIR** | `/login` | `/kasir` | DashboardLayout |
| **SUPER_ADMIN** | `/login` | `/super-admin/dashboard` | DashboardLayout |
| **admin** | `/login` | `/admin/dashboard` | AnalitikLayout |
| **dokter** | `/login` | `/dokter/dashboard` | - |

## 📝 Demo Login Buttons

```
┌─────────────────────────────────────────────┐
│  [Admin]  [Kasir]  [Super Admin]           │
└─────────────────────────────────────────────┘
```

**Admin:**
- Email: `admin@klinik.com`
- Password: `admin123`

**Kasir:**
- Email: `kasir@klinik.com`
- Password: `kasir123`

**Super Admin:**
- Email: `super_admin@klinik.com`
- Password: `super123`

## 🔌 API Endpoint

```
POST {VITE_API_INTERNAL_URL}/api/auth/login

From .env.local:
VITE_API_INTERNAL_URL=https://db-posqris-cpgii-production.up.railway.app
```

## 💾 Token Storage

**Remember Me = TRUE:**
```javascript
localStorage.setItem('authToken', access_token)
localStorage.setItem('user', JSON.stringify(user))
```

**Remember Me = FALSE:**
```javascript
sessionStorage.setItem('authToken', access_token)
sessionStorage.setItem('user', JSON.stringify(user))
```

## 🛡️ Protected Routes

### KASIR Routes
```typescript
allowedRoles={["kasir", "admin", "KASIR"]}
→ /kasir/**
```

### SUPER_ADMIN Routes
```typescript
allowedRoles={["SUPER_ADMIN"]}
→ /super-admin/**
```

### ADMIN Routes (old)
```typescript
allowedRoles={["admin"]}
→ /admin/**
```

## 🔄 Login Flow

```
1. User masuk email & password
2. POST request ke /api/auth/login
3. Response dengan access_token & user data
4. Store token + user di localStorage/sessionStorage
5. Redirect ke dashboard berdasarkan role
6. Protected routes check token + role
```

## 🚨 Error Handling

```typescript
// Jika tidak login → redirect ke /login
// Jika role tidak sesuai → redirect ke /login
// Jika token invalid → redirect ke /login
```

## 📂 Key Files

| File | Fungsi |
|------|--------|
| `auth.types.ts` | Type definitions |
| `auth.service.ts` | API integration & token management |
| `auth-context.tsx` | Context provider & state |
| `auth.hooks.ts` | useAuth hook |
| `routeConfig.ts` | Route paths & role redirects |
| `ProtectedRoute.tsx` | Route protection wrapper |
| `App.tsx` | Route definitions |
| `.env.local` | API URL configuration |

## ⚡ Quick Start

### Login dengan demo:
1. Klik "Super Admin" button
2. Lihat redirect ke `/super-admin/dashboard`
3. Check localStorage: `authToken` & `user`

### Login dengan API real:
1. Pastikan `VITE_API_INTERNAL_URL` di .env.local sudah benar
2. Auth service akan otomatis kirim request ke API
3. Jika response sesuai format, login berhasil

### Logout:
```typescript
const { logout } = useAuth();
logout(); // Clear token & redirect
```

## 🎨 Component Usage

```typescript
// Check if user is logged in
function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) return <div>Not logged in</div>;
  
  return <div>Welcome {user?.name} ({user?.role})</div>;
}

// Wrap protected component
<ProtectedRoute allowedRoles={["KASIR", "SUPER_ADMIN"]}>
  <YourComponent />
</ProtectedRoute>
```

---

**Status:** ✅ Ready for testing  
**API Mode:** ${USE_DEMO ? 'Demo' : 'Production'}
