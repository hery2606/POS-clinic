# 🎯 Logout Confirmation - Visual Diagram

## 📊 Component Structure

```
NavUser Component
├── User Profile Section
│   ├── Avatar
│   ├── Name
│   └── Email
│
└── Logout Button
    └── onClick: handleLogoutClick()
        └── setShowLogoutDialog(true)
            └── Dialog Component Opens
                ├── Dialog Title: "Konfirmasi Logout"
                ├── Dialog Description: "Apakah Anda yakin..."
                └── Dialog Footer
                    ├── Button: "Batal" 
                    │   └── handleCancelLogout()
                    │       └── setShowLogoutDialog(false)
                    └── Button: "Ya, Logout"
                        └── handleConfirmLogout()
                            ├── logout()
                            ├── setShowLogoutDialog(false)
                            └── navigate("/login")
```

---

## 🔄 User Interaction Flow

```
┌─────────────────────────────────────────┐
│          INITIAL STATE                  │
│  User logged in, viewing dashboard      │
│  Dialog: hidden                         │
└──────────────┬──────────────────────────┘
               │
               │ User clicks "Logout" button
               ▼
┌─────────────────────────────────────────┐
│      DIALOG SHOWN STATE                 │
│  ┌─────────────────────────────────────┐│
│  │  Konfirmasi Logout                  ││
│  │  ─────────────────────────────────  ││
│  │  Apakah Anda yakin ingin keluar     ││
│  │  dari sistem? Session Anda akan     ││
│  │  ditutup dan JWT login akan         ││
│  │  dihapus.                           ││
│  │  ─────────────────────────────────  ││
│  │  [Batal]        [Ya, Logout]        ││
│  └─────────────────────────────────────┘│
└──────────┬─────────────────┬─────────────┘
           │                 │
           │                 │
User clicks │                 │ User clicks
"Batal"     │                 │ "Ya, Logout"
           │                 │
           ▼                 ▼
┌──────────────────┐   ┌──────────────────────────┐
│  DIALOG CLOSED   │   │  LOGOUT EXECUTED        │
│  User stays in   │   │ 1. Call logout()        │
│  dashboard       │   │ 2. Clear JWT token      │
│  (No action)     │   │ 3. Clear user data      │
└──────────────────┘   │ 4. Set isAuth = false   │
                       │ 5. Navigate to /login   │
                       └──────────┬───────────────┘
                                  │
                                  ▼
                       ┌──────────────────────┐
                       │  REDIRECT TO LOGIN   │
                       │  New session         │
                       │  (User logged out)   │
                       └──────────────────────┘
```

---

## 💾 Data Flow During Logout

```
┌────────────────────────────────┐
│   handleConfirmLogout()        │
│   (Button click handler)       │
└────────────┬───────────────────┘
             │
             ├─ Step 1: logout()
             │  └─ AuthService.logout()
             │     ├─ localStorage.removeItem('authToken')
             │     ├─ localStorage.removeItem('user')
             │     ├─ sessionStorage.removeItem('authToken')
             │     ├─ sessionStorage.removeItem('user')
             │     ├─ setUser(null)
             │     └─ setIsAuthenticated(false)
             │
             ├─ Step 2: setShowLogoutDialog(false)
             │  └─ Dialog closes
             │
             └─ Step 3: navigate("/login")
                └─ Redirect to login page
                   └─ Protected routes check
                      └─ isAuthenticated = false
                         └─ Force redirect to /login
```

---

## 🎨 Dialog UI Breakdown

```
┌─────────────────────────────────────────────┐
│ ✖                                            │ ← Close button (auto on outside click)
├─────────────────────────────────────────────┤
│ Konfirmasi Logout                           │ ← Title
├─────────────────────────────────────────────┤
│                                             │
│ Apakah Anda yakin ingin keluar dari sistem? │ ← Description
│ Session Anda akan ditutup dan JWT login     │
│ akan dihapus.                               │
│                                             │
├─────────────────────────────────────────────┤
│              [Batal] [Ya, Logout]           │ ← Footer with buttons
├─────────────────────────────────────────────┤
```

**Styling Details:**
- Border: `#DFE6EB` (light gray)
- Background: white
- Max width: sm (smaller modal)
- Title color: `#13222D` (dark blue)
- Description color: `#67737C` (medium gray)
- Cancel button: Gray background
- Logout button: Red background (`#FF6B6B`)

---

## 🔐 JWT Cleanup Process

```
Before Logout:
┌─────────────────────┐
│   localStorage      │
├─────────────────────┤
│ authToken: "eyJ..." │ ← JWT Token
│ user: {...}         │ ← User object
└─────────────────────┘

        │
        │ logout() called
        ▼

After Logout:
┌─────────────────────┐
│   localStorage      │
├─────────────────────┤
│ (empty)             │ ← Cleared!
└─────────────────────┘

Similarly for sessionStorage:
┌──────────────────────┐      ┌──────────────────────┐
│  sessionStorage      │      │  sessionStorage      │
├──────────────────────┤      ├──────────────────────┤
│ authToken: "eyJ..."  │ ──→  │ (empty)              │
│ user: {...}          │      └──────────────────────┘
└──────────────────────┘
```

---

## 📋 Code Implementation Summary

### 1. State Management
```typescript
const [showLogoutDialog, setShowLogoutDialog] = useState(false)
```

### 2. Event Handlers
```typescript
handleLogoutClick()      → Show dialog
handleCancelLogout()     → Hide dialog (no action)
handleConfirmLogout()    → Logout + redirect
```

### 3. Components Used
```typescript
<Dialog>              → Modal dialog
<DialogContent>      → Dialog container
<DialogHeader>       → Title area
<DialogDescription>  → Description text
<DialogFooter>       → Action buttons
<Button>             → Cancel/Confirm buttons
```

---

## ✅ Security Checklist

- ✅ JWT token cleared from localStorage
- ✅ JWT token cleared from sessionStorage
- ✅ User data cleared from both storages
- ✅ Auth context reset (user = null)
- ✅ Protected routes redirect to login
- ✅ Dialog requires explicit confirmation
- ✅ No token exposed in logs
- ✅ Automatic redirect prevents accidental re-login

---

## 🧪 Test Cases

### Test 1: Dialog appears on logout click
```
1. Click "Logout" button
2. Verify: Dialog appears
3. Verify: Dialog title = "Konfirmasi Logout"
4. Verify: Dialog has 2 buttons: "Batal" and "Ya, Logout"
```

### Test 2: Cancel logout
```
1. Click "Logout" button
2. Click "Batal" button
3. Verify: Dialog closes
4. Verify: localStorage still has authToken
5. Verify: User still logged in
6. Verify: Can access protected routes
```

### Test 3: Confirm logout
```
1. Click "Logout" button
2. Click "Ya, Logout" button
3. Verify: Dialog closes
4. Verify: localStorage.authToken removed
5. Verify: localStorage.user removed
6. Verify: Redirected to /login
7. Verify: Cannot access protected routes
8. Verify: localStorage is empty
```

### Test 4: Dialog styling
```
1. Click "Logout" button
2. Verify: Dialog background is white
3. Verify: Title color is dark blue
4. Verify: Description text is readable
5. Verify: Buttons are properly styled
6. Verify: Dialog is centered on screen
```

---

## 🔗 Related Components

| Component | Purpose |
|-----------|---------|
| `useAuth` | Provides logout function |
| `useNavigate` | Navigate to /login |
| `Dialog` | Modal dialog UI |
| `Button` | Action buttons |
| `AuthService` | Handles token cleanup |

---

## 📝 Files Modified

```
src/features/kasir/layout/sidebar/nav-user.tsx
├── Added: useState for dialog state
├── Added: handleLogoutClick handler
├── Added: handleConfirmLogout handler
├── Added: handleCancelLogout handler
├── Added: Dialog component with confirmation
└── Modified: Logout button onClick
```

---

**Last Updated:** 2024  
**Version:** 1.0  
**Status:** ✅ Ready for Testing
