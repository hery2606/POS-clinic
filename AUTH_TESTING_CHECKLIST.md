# ✅ Authentication Testing Checklist

## 🧪 Lokal Development Testing

### Setup
- [ ] Copy `.env.local` configuration
- [ ] Verify `VITE_API_INTERNAL_URL` is set
- [ ] `npm install` to ensure dependencies
- [ ] `npm run dev` to start dev server

### Demo Mode Testing (USE_DEMO = true)

#### Admin Role
- [ ] Click "Admin" demo button
- [ ] Email auto-filled: `admin@klinik.com`
- [ ] Password auto-filled: `admin123`
- [ ] Click "Masuk ke Dashboard"
- [ ] Verify redirect to `/admin/dashboard`
- [ ] Check localStorage has `authToken` and `user`
- [ ] Verify user role in localStorage is "admin"

#### Kasir Role  
- [ ] Click "Kasir" demo button
- [ ] Email auto-filled: `kasir@klinik.com`
- [ ] Password auto-filled: `kasir123`
- [ ] Click "Masuk ke Dashboard"
- [ ] Verify redirect to `/kasir`
- [ ] Check localStorage has `authToken` and `user`
- [ ] Verify user role in localStorage is "KASIR"

#### Super Admin Role
- [ ] Click "Super Admin" demo button
- [ ] Email auto-filled: `super_admin@klinik.com`
- [ ] Password auto-filled: `super123`
- [ ] Click "Masuk ke Dashboard"
- [ ] Verify redirect to `/super-admin/dashboard`
- [ ] Check localStorage has `authToken` and `user`
- [ ] Verify user role in localStorage is "SUPER_ADMIN"

### Form Validation Testing

#### Email Validation
- [ ] Submit empty email → Show error "Email atau Username wajib diisi"
- [ ] Enter invalid email format → Allow submit (backend will validate)

#### Password Validation
- [ ] Submit empty password → Show error "Password wajib diisi"
- [ ] Enter password < 6 chars → Show error "Password minimal 6 karakter"
- [ ] Enter password >= 6 chars → Allow submit

#### Remember Me Checkbox
- [ ] Check "Ingat Saya" → Token stored in localStorage
- [ ] Uncheck "Ingat Saya" → Token stored in sessionStorage
- [ ] Refresh page with localStorage → Still logged in
- [ ] Refresh page with sessionStorage → Still logged in
- [ ] Close browser tab → sessionStorage cleared, localStorage persists

### Error Handling

#### Invalid Credentials (Demo Mode)
- [ ] Enter wrong email → Show error "Email atau Username tidak terdaftar"
- [ ] Enter correct email, wrong password → Show error "Password salah"

#### Error Display
- [ ] Error message appears in red box
- [ ] Error message has pulsing indicator dot
- [ ] Error clears when user starts typing

### Protected Routes Testing

#### Unauthenticated User
- [ ] Direct URL to `/kasir` → Redirect to `/login`
- [ ] Direct URL to `/admin/dashboard` → Redirect to `/login`
- [ ] Direct URL to `/super-admin/dashboard` → Redirect to `/login`
- [ ] Direct URL to unknown route → Redirect to `/login`

#### Role-Based Access Control
- [ ] Login as KASIR, try access `/admin/dashboard` → Redirect to `/login`
- [ ] Login as KASIR, try access `/super-admin/dashboard` → Redirect to `/login`
- [ ] Login as admin, access `/admin/dashboard` → Allow
- [ ] Login as SUPER_ADMIN, access `/super-admin/dashboard` → Allow
- [ ] Login as KASIR, access `/kasir` → Allow
- [ ] Login as admin, access `/kasir` → Allow (admin can access kasir routes)

### Logout Testing

#### Logout Functionality
- [ ] Login successfully
- [ ] Click logout button
- [ ] Verify redirect to `/login`
- [ ] Check localStorage/sessionStorage cleared
- [ ] Try refresh page → Stay on login
- [ ] Try direct URL to protected route → Redirect to login

### Token Management

#### Token Storage
- [ ] Login with "Remember Me" → Check localStorage.authToken exists
- [ ] Login without "Remember Me" → Check sessionStorage.authToken exists
- [ ] Logout → Check localStorage.authToken removed
- [ ] Logout → Check sessionStorage.authToken removed
- [ ] Logout → Check localStorage.user removed
- [ ] Logout → Check sessionStorage.user removed

#### User Data Storage
- [ ] Login → Check localStorage/sessionStorage has user JSON
- [ ] Parse stored user → Verify structure matches response
- [ ] Check user has id, email, name, role fields

---

## 🔌 Production API Testing

### Setup
- [ ] Set `USE_DEMO = false` in auth.service.ts
- [ ] Verify backend API is running
- [ ] Verify `VITE_API_INTERNAL_URL` is correct
- [ ] Backend endpoint returns proper response format

### Valid Credentials Test
- [ ] Use real KASIR credentials from backend
- [ ] Enter email and password
- [ ] Submit login form
- [ ] Verify response contains access_token
- [ ] Verify response contains user with role "KASIR" or "SUPER_ADMIN"
- [ ] Verify redirect to correct dashboard

### Invalid Credentials Test
- [ ] Use non-existent email
- [ ] Verify error message from backend displays
- [ ] Use correct email, wrong password
- [ ] Verify error message displays
- [ ] Check error is handled gracefully

### Network Error Test
- [ ] Disconnect internet
- [ ] Try to login
- [ ] Verify error is caught and displayed
- [ ] Reconnect internet, try again

### API Response Format Test
- [ ] Check response includes "message" field
- [ ] Check response includes "access_token" field
- [ ] Check response includes "user" object
- [ ] Check user has "id", "email", "name", "role" fields
- [ ] Verify token format is JWT (starts with "eyJ")

---

## 🔐 Security Testing

### Token Security
- [ ] Token is stored in localStorage (with Remember Me)
- [ ] Token is not exposed in URL
- [ ] Token is not logged in console
- [ ] Token is included in Authorization header (if needed for future APIs)

### Session Security
- [ ] sessionStorage token is cleared on tab close
- [ ] localStorage token persists across sessions
- [ ] logout() clears both storage types

### Password Security
- [ ] Password field shows dots/asterisks (not plain text)
- [ ] Password is not logged or transmitted in URLs
- [ ] Password validation works client-side

### CSRF Protection
- [ ] Verify backend implements CSRF protection if needed
- [ ] Check Content-Type header is application/json

---

## 🎨 UI/UX Testing

### Login Form Design
- [ ] Left side branding displays correctly
- [ ] Right side form displays correctly
- [ ] Form is responsive on mobile
- [ ] Form is responsive on tablet
- [ ] Form is responsive on desktop

### Button States
- [ ] Submit button is enabled initially
- [ ] Submit button is disabled during loading
- [ ] Submit button shows "Memproses..." during loading
- [ ] Arrow icon hidden during loading
- [ ] Submit button re-enabled after success
- [ ] Submit button re-enabled after error

### Input Interactions
- [ ] Email input has User icon
- [ ] Password input has Lock icon
- [ ] Show/hide password toggle works
- [ ] All fields are keyboard accessible
- [ ] Tab navigation works correctly

### Demo Buttons
- [ ] "Admin" button is clickable
- [ ] "Kasir" button is clickable
- [ ] "Super Admin" button is clickable
- [ ] Click fills email and password correctly
- [ ] Buttons have hover effect

### Error Display
- [ ] Error message appears in colored box
- [ ] Error message is readable
- [ ] Error message clears on input

---

## 📊 Cross-Browser Testing

- [ ] Chrome - Login flow works
- [ ] Firefox - Login flow works
- [ ] Safari - Login flow works
- [ ] Edge - Login flow works

---

## 📱 Responsive Testing

- [ ] Mobile (320px) - Login page responsive
- [ ] Mobile (375px) - Login page responsive
- [ ] Mobile (480px) - Login page responsive
- [ ] Tablet (768px) - Login page responsive
- [ ] Desktop (1024px+) - Login page responsive
- [ ] Large desktop (1920px+) - Login page responsive

---

## 🔗 Integration Testing

### Dashboard Integration
- [ ] Logged in user can access dashboard
- [ ] User info displays correctly on dashboard
- [ ] Logout button works from dashboard
- [ ] Navigation between pages works
- [ ] Page refresh maintains login state

### API Integration (if using real backend)
- [ ] Login endpoint is accessible
- [ ] Response matches expected format
- [ ] Error handling works
- [ ] Token can be used for subsequent API calls

---

## 📋 Accessibility Testing

- [ ] Form labels are associated with inputs
- [ ] Error messages are announced
- [ ] Keyboard navigation works
- [ ] Color contrast is sufficient
- [ ] Icons have alt text or aria-labels
- [ ] Tab order is logical
- [ ] Form can be submitted with Enter key

---

## ✅ Final Verification

Before deploying to production:

- [ ] All tests above passed
- [ ] No console errors
- [ ] No console warnings (auth-related)
- [ ] Build succeeds without auth errors
- [ ] Linting passes for auth files
- [ ] No TypeScript errors in auth code
- [ ] Demo mode works correctly
- [ ] Production API mode works correctly
- [ ] Role-based routing works for all roles
- [ ] Logout clears all data
- [ ] Token is properly managed
- [ ] Session security is correct

---

## 📝 Test Results Log

| Test Case | Status | Notes | Date |
|-----------|--------|-------|------|
| Admin login (demo) | ⬜ | | |
| Kasir login (demo) | ⬜ | | |
| Super Admin login (demo) | ⬜ | | |
| Invalid credentials | ⬜ | | |
| Form validation | ⬜ | | |
| Protected routes | ⬜ | | |
| Logout functionality | ⬜ | | |
| Token storage | ⬜ | | |
| Responsive design | ⬜ | | |
| Cross-browser | ⬜ | | |

*Status: ⬜ (Not tested), 🔵 (In progress), ✅ (Passed), ❌ (Failed)*

---

**Last Updated:** 2024
**Version:** 1.0
