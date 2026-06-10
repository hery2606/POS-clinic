# 🔐 Logout Confirmation Dialog

## 📋 Fitur yang Diimplementasikan

Setiap kali user ingin logout, akan tampil dialog konfirmasi terlebih dahulu sebelum benar-benar keluar dari sistem.

---

## 🎯 Behavior

### Sebelum Logout Confirmation
```
┌────────────────┐
│  User Sidebar  │
├────────────────┤
│ [Logout Button]│ ← User click
└────────────────┘
```

### Saat Dialog Muncul
```
┌─────────────────────────────────────┐
│     Konfirmasi Logout               │
├─────────────────────────────────────┤
│ Apakah Anda yakin ingin keluar      │
│ dari sistem? Session Anda akan      │
│ ditutup dan JWT login akan dihapus. │
├─────────────────────────────────────┤
│  [Batal]              [Ya, Logout]  │
└─────────────────────────────────────┘
```

### User Action
- **Klik "Batal"** → Dialog close, tetap login
- **Klik "Ya, Logout"** → Logout & redirect ke `/login`

---

## 📁 File yang Diupdate

### `src/features/kasir/layout/sidebar/nav-user.tsx`

**Perubahan:**
- Add `useState` untuk manage dialog state
- Add Dialog component dari shadcn/ui
- Add `handleLogoutClick()` untuk trigger dialog
- Add `handleConfirmLogout()` untuk confirm logout
- Add `handleCancelLogout()` untuk cancel
- Dialog tampil dengan custom styling

**Dialog Structure:**
```tsx
<Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
  <DialogContent> {/* Modal dialog */}
    <DialogHeader> {/* Title & Description */}
    <DialogFooter> {/* Action buttons: Cancel & Confirm */}
  </DialogContent>
</Dialog>
```

---

## 🔄 Logout Flow

```
1. User clicks "Logout" button in sidebar
                  ↓
2. Dialog confirmation appears
                  ↓
   ┌─────────────┬──────────────┐
   │             │              │
   ↓             ↓              ↓
User clicks   User clicks    (Auto close)
"Batal"       "Ya, Logout"   after 30s
   │             │
   ↓             ↓
Stay in      Logout called
  App        (clear token)
                  ↓
             Navigate to /login
                  ↓
             Redirect to login page
```

---

## 🛠️ Implementation Details

### State Management
```typescript
const [showLogoutDialog, setShowLogoutDialog] = useState(false)
```

### Dialog State Control
```typescript
// Open dialog
handleLogoutClick() → setShowLogoutDialog(true)

// Close & Logout
handleConfirmLogout() → 
  logout() + 
  navigate("/login")

// Close dialog
handleCancelLogout() → setShowLogoutDialog(false)
```

### Dialog Styling
- Border: `border-[#DFE6EB]`
- Background: `bg-white`
- Title color: `text-[#13222D]`
- Description color: `text-[#67737C]`
- Cancel button: Gray background
- Logout button: Red background (`bg-[#FF6B6B]`)

---

## 💾 Logout Handler Logic

```typescript
const handleConfirmLogout = () => {
  // 1. Call auth logout (clears JWT & user data)
  logout()
  
  // 2. Close dialog
  setShowLogoutDialog(false)
  
  // 3. Redirect to login
  navigate("/login")
}
```

**Logout Process (from auth context):**
1. Remove `authToken` from localStorage
2. Remove `user` from localStorage
3. Remove `authToken` from sessionStorage
4. Remove `user` from sessionStorage
5. Set `user` to null in context
6. Set `isAuthenticated` to false

---

## 🎨 UI Components Used

| Component | From | Purpose |
|-----------|------|---------|
| `Dialog` | `@/components/ui/dialog` | Modal dialog container |
| `DialogContent` | `@/components/ui/dialog` | Dialog content wrapper |
| `DialogHeader` | `@/components/ui/dialog` | Dialog header |
| `DialogTitle` | `@/components/ui/dialog` | Dialog title |
| `DialogDescription` | `@/components/ui/dialog` | Dialog description |
| `DialogFooter` | `@/components/ui/dialog` | Dialog actions footer |
| `Button` | `@/components/ui/button` | Action buttons |
| `useAuth` | `@/features/auth` | Logout hook |
| `useNavigate` | `react-router-dom` | Navigate to login |

---

## ✅ Features

✅ **Dialog Confirmation** - User diminta konfirmasi sebelum logout  
✅ **Visual Feedback** - Dialog dengan styling yang jelas  
✅ **Cancel Option** - User bisa batalkan logout  
✅ **Confirm Option** - User bisa confirm logout  
✅ **Complete Cleanup** - JWT & user data dihapus  
✅ **Auto Redirect** - Redirect ke login setelah logout  
✅ **State Management** - Dialog state properly managed  
✅ **Responsive** - Dialog responsive di semua device  

---

## 🧪 Testing Scenarios

### Scenario 1: User clicks Logout then Cancel
1. Click "Logout" button
2. Dialog appears
3. Click "Batal"
4. Dialog closes
5. User still logged in
6. Can access dashboard normally

### Scenario 2: User clicks Logout then Confirm
1. Click "Logout" button
2. Dialog appears
3. Click "Ya, Logout"
4. Logout function executes
5. JWT & user data cleared
6. Redirect to `/login`
7. Cannot access protected routes

### Scenario 3: Dialog persists on navigation
1. Click "Logout" button
2. Dialog appears
3. Navigate away (click elsewhere)
4. Dialog should close on navigation

---

## 🔐 Security Notes

1. **Token Cleanup** - Logout clears all token storage (localStorage & sessionStorage)
2. **Context Reset** - User context set to null after logout
3. **Navigation** - Automatic redirect to login page
4. **Protected Routes** - Protected routes check auth state and redirect if needed

---

## 📝 Usage

The component is already integrated in the navbar. Users will automatically see the confirmation dialog when clicking the logout button in the sidebar.

No additional configuration needed.

---

## 🚀 Future Enhancements

1. **Timeout Confirmation** - Auto-logout after timeout
2. **Activity Monitoring** - Detect inactive sessions
3. **Device Management** - Show active sessions
4. **Multi-device Logout** - Logout from other devices
5. **Logout Reason** - Track why user logged out
6. **Audit Logging** - Log logout events

---

**Last Updated:** 2024  
**Status:** ✅ Production Ready
