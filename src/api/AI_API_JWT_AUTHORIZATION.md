# 🔐 AI API Client - JWT Authorization Integration

## 📋 Overview

Implementasi JWT authorization untuk AI API client. Setiap request ke AI API akan otomatis menambahkan JWT token dari login admin/super admin di header Authorization.

---

## 🎯 Implementation Details

### 1. **aiClient.ts** - Axios Client dengan JWT Interceptor

**Sebelum:**
```typescript
export const aiClient = axios.create({
  baseURL: import.meta.env.API_AI_URL,  // ← Typo: missing VITE_
  headers: {
    "Content-Type": "application/json",
  },
});
// Tanpa JWT token ❌
```

**Sesudah:**
```typescript
export const aiClient = axios.create({
  baseURL: import.meta.env.VITE_API_AI_URL,  // ← Fixed: VITE_ prefix ✓
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Add JWT Token ✓
aiClient.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();  // Get from localStorage/sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 Errors ✓
aiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      AuthService.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

### 2. **.env.local** - Environment Configuration

**Sebelum:**
```env
# Typo: Missing VITE_ prefix
API_AI_URL= https://dashboard-ai-9k65.onrender.com
```

**Sesudah:**
```env
# Correct: With VITE_ prefix for Vite bundler
VITE_API_AI_URL=https://dashboard-ai-9k65.onrender.com
```

---

## 🔄 Request Flow with JWT Authorization

```
┌──────────────────────────────────────────────────────┐
│             Frontend AI API Call                     │
│   analitikService.getRevenueTrend()                  │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │ aiClient.get(endpoint)     │
        └────────────────────┬───────┘
                             │
        ┌────────────────────▼──────────────────┐
        │   Request Interceptor Triggered      │
        ├──────────────────────────────────────┤
        │ 1. Get token from AuthService        │
        │    token = localStorage.authToken    │
        │                                      │
        │ 2. Add to Authorization header       │
        │    Authorization: Bearer {token}     │
        │                                      │
        │ 3. Proceed with request              │
        └────────────────────┬─────────────────┘
                             │
        ┌────────────────────▼──────────────────┐
        │ HTTP Request to AI Server            │
        ├──────────────────────────────────────┤
        │ POST {VITE_API_AI_URL}/api/v1/ai/*   │
        │ Headers:                             │
        │ - Content-Type: application/json     │
        │ - Authorization: Bearer eyJ...       │ ← JWT Token
        └────────────────────┬─────────────────┘
                             │
        ┌────────────────────▼──────────────────┐
        │ AI Server Response                   │
        └────────────────────┬─────────────────┘
                             │
           ┌─────────────────┴──────────────────┐
           │                                    │
        ✅ 200 OK              ❌ 401 Unauthorized
           │                                    │
           ▼                                    ▼
      Return data              Response Interceptor
      to service               → AuthService.logout()
                               → Redirect to /login
```

---

## 🔐 Security Flow

```
1. User Login (Admin/Super Admin)
   │
   ├─ POST /api/auth/login
   ├─ Response: access_token
   ├─ Store in localStorage.authToken
   │
   ▼
2. User navigates to AI Analytics Page
   │
   ├─ Component calls analitikService.getRevenueTrend()
   ├─ Which calls aiClient.get()
   │
   ▼
3. Request Interceptor Executes
   │
   ├─ Reads token from localStorage
   ├─ Sets Authorization header: Bearer {token}
   ├─ Sends request to AI API
   │
   ▼
4. AI Server Validates Token
   │
   ├─ Verifies JWT signature
   ├─ Checks token expiration
   ├─ Checks user role (admin/SUPER_ADMIN)
   │
   ▼
5. Response Handling
   │
   ├─ 200: Return data to frontend
   ├─ 401: Token invalid/expired
   │   └─ Response Interceptor catches error
   │   └─ Logs out user
   │   └─ Redirects to /login
   └─ 403: Access Denied
       └─ Show error message
```

---

## 📁 Files Modified

### 1. `aiClient.ts` ✅
- Added AuthService import
- Changed baseURL: `API_AI_URL` → `VITE_API_AI_URL`
- Added request interceptor for JWT token
- Added response interceptor for 401 handling

### 2. `.env.local` ✅
- Changed: `API_AI_URL` → `VITE_API_AI_URL`
- Removed unused: `API_INTERNAL_URL` (legacy)
- Updated comment: "Tanpa Auth" → "JWT Authorization diperlukan"

---

## 🎯 Integration Points

### Services Using aiClient

**1. visum.service.ts**
```typescript
generateVisumReport: async (): Promise<VisumReport> => {
  const response = await aiClient.get<VisumReport>(
    "/api/v1/ai/visum/bisnis"
  );
  return response.data;
};
```

**2. analitik.service.ts**
```typescript
getRevenueTrend: async (): Promise<RevenueTrendResponse> => {
  const response = await aiClient.get<RevenueTrendResponse>(
    "/api/v1/ai/revenue/trend"
  );
  return response.data;
};

getCashflowSummary: async (): Promise<CashflowSummaryResponse> => {
  const response = await aiClient.get<CashflowSummaryResponse>(
    "/api/v1/ai/cashflow/summary"
  );
  return response.data;
};

// ... more endpoints
```

All these services automatically get JWT authorization! ✓

---

## 🧪 Testing Workflow

### Test 1: Verify Token is Sent
1. Login as admin/super admin
2. Open DevTools → Network tab
3. Navigate to Analytics page
4. Check API request to AI endpoint
5. Verify in Headers:
   ```
   Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
   ```

### Test 2: Token Expiration Handling
1. Login with admin
2. Manually delete `localStorage.authToken`
3. Try to access analytics page
4. Verify error handling:
   - Should get 401 error
   - Should logout user
   - Should redirect to /login

### Test 3: Valid Token Access
1. Login as admin
2. Access analytics pages
3. Verify data loads correctly
4. Check network requests show:
   - Authorization header present
   - Response 200 OK
   - Data returned

---

## 📋 Configuration Summary

| Config | Old | New | Status |
|--------|-----|-----|--------|
| API_AI_URL | `API_AI_URL` | `VITE_API_AI_URL` | ✅ Fixed |
| JWT Auth | None | Request Interceptor | ✅ Added |
| 401 Handling | None | Response Interceptor | ✅ Added |
| Token Source | N/A | localStorage/sessionStorage | ✅ Integrated |

---

## 🔐 Authorization Header Format

```
Authorization: Bearer <JWT_TOKEN>

Example:
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiODU1NTVmYy04ODZhLTRhMGEtODQ0Ny00ZjJmYTgwYzA3NmMiLCJlbWFpbCI6ImFkbWluQGtsaW5pay5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3ODEwOTkxODIsImV4cCI6MTc4MTE4NTU4Mn0.UO-jE_4FlHtysAnFVL-VscuoFLN4dTH96sQh1NO42vk
```

---

## 🚀 Usage Example

```typescript
import { aiClient } from "@/api";

// All requests automatically include JWT token ✓
const response = await aiClient.get("/api/v1/ai/revenue/trend");

// If token is invalid (401):
// 1. Response interceptor catches error
// 2. Calls AuthService.logout()
// 3. Redirects to /login
```

---

## ✅ Checklist

- [x] Changed environment variable to `VITE_API_AI_URL`
- [x] Added JWT token extraction from AuthService
- [x] Implemented request interceptor for Authorization header
- [x] Implemented response interceptor for 401 errors
- [x] Removed legacy API_INTERNAL_URL from .env.local
- [x] Updated environment file comments
- [x] Services already using aiClient (automatic JWT)
- [x] TypeScript build successful
- [x] No breaking changes

---

## 📝 Related Endpoints

All endpoints now require Authorization header:

```
GET /api/v1/ai/revenue/trend
GET /api/v1/ai/cashflow/summary
GET /api/v1/ai/payments/analytics
GET /api/v1/ai/visum/bisnis
POST /api/v1/ai/* (other endpoints)
```

---

## 🔗 Related Files

- `src/api/aiClient.ts` - Axios client configuration
- `.env.local` - Environment variables
- `src/features/auth/service/auth.service.ts` - Token management
- `src/features/analitik/services/analitik.service.ts` - Analytics service
- `src/features/analitik/services/visum.service.ts` - Visum service

---

## 🎓 How It Works

1. **User logs in** → JWT token stored in localStorage
2. **API call made** → Request interceptor runs automatically
3. **Token extracted** → `AuthService.getToken()` retrieves token
4. **Header added** → `Authorization: Bearer {token}` added to request
5. **AI Server validates** → Checks token validity & user role
6. **Response received** → Response interceptor checks for errors
7. **401 Error?** → Logout user & redirect to /login

Everything is **automatic and secure**! ✓

---

**Last Updated:** 2024  
**Status:** ✅ Production Ready
