# 🔐 AI API JWT Authorization - Quick Reference

## 📋 Summary

API client untuk AI Swagger sekarang otomatis menambahkan JWT token dari login admin ke setiap request.

---

## ✅ What Changed

| File | Change |
|------|--------|
| `aiClient.ts` | Added JWT token to all requests via interceptor |
| `.env.local` | Fixed `API_AI_URL` → `VITE_API_AI_URL` |

---

## 🔄 How It Works

```
User logs in (admin/super admin)
        ↓
JWT token stored in localStorage
        ↓
API call to AI endpoint
        ↓
Request Interceptor runs
        ↓
Adds header: Authorization: Bearer {token}
        ↓
AI Server validates token
        ↓
Return response OR 401 error → Auto logout
```

---

## 📡 Request Format

```
GET {VITE_API_AI_URL}/api/v1/ai/...

Headers:
{
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGc..." ← Auto added ✓
}
```

---

## 🎯 Key Features

✅ **Automatic JWT** - No manual header configuration needed  
✅ **401 Handling** - Auto logout + redirect if token expired  
✅ **VITE Support** - Proper environment variable with VITE_ prefix  
✅ **All Services** - visum.service & analitik.service included  
✅ **Production Ready** - No config needed for developers

---

## 🧪 Verify Implementation

1. **Check env variable:**
   ```
   VITE_API_AI_URL=https://dashboard-ai-9k65.onrender.com ✓
   ```

2. **Check aiClient interceptor:**
   ```typescript
   aiClient.interceptors.request.use((config) => {
     const token = AuthService.getToken();
     if (token) {
       config.headers.Authorization = `Bearer ${token}`;
     }
     return config;
   });
   ```

3. **Check services use aiClient:**
   ```typescript
   import { aiClient } from "@/api";
   const response = await aiClient.get("/api/v1/ai/...");
   ```

---

## 📝 Example Flow

```typescript
// 1. Admin logs in
login({ email: "admin@klinik.com", password: "password123" })
// Token stored in localStorage

// 2. Component calls analytics service
const data = await analitikService.getRevenueTrend();

// 3. Inside service
const response = await aiClient.get("/api/v1/ai/revenue/trend");

// 4. Request interceptor automatically:
//    - Gets token from localStorage
//    - Adds Authorization header
//    - Sends request with token

// 5. AI Server validates token
// 6. Returns data or 401 error

// 7. Response interceptor catches 401
//    - Logs out user
//    - Redirects to /login
```

---

## 🔐 Token Management

```
Flow:
1. Login
   → POST /api/auth/login
   → Receive: access_token
   → Store in localStorage.authToken

2. API Call
   → aiClient interceptor reads: localStorage.authToken
   → Adds to Authorization header
   → Sends request

3. Logout
   → AuthService.logout()
   → Removes localStorage.authToken
   → Removes localStorage.user
   → Redirects to /login
```

---

## 🚨 Error Handling

```
401 Unauthorized
  ↓
Response Interceptor catches it
  ↓
AuthService.logout()
  ↓
window.location.href = "/login"
  ↓
User redirected to login page
```

---

## 📚 Files Reference

- **`src/api/aiClient.ts`** - Axios client with interceptors
- **`.env.local`** - API URLs configuration
- **`src/features/auth/service/auth.service.ts`** - Token management
- **`src/features/analitik/services/analitik.service.ts`** - Uses aiClient
- **`src/features/analitik/services/visum.service.ts`** - Uses aiClient

---

## ✅ Verification Checklist

- [x] Environment variable: `VITE_API_AI_URL` set correctly
- [x] aiClient imports AuthService
- [x] Request interceptor adds JWT token
- [x] Response interceptor handles 401 errors
- [x] All services using aiClient
- [x] Build successful (TypeScript checks pass)
- [x] No manual header configuration needed

---

## 🎓 For Developers

**You don't need to do anything!**

Just use `aiClient` like normal:
```typescript
const response = await aiClient.get("/api/v1/ai/revenue/trend");
// JWT token is automatically added ✓
```

---

**Status:** ✅ Ready for Production  
**Last Updated:** 2024
