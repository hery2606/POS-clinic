# Settings Component Documentation

## Overview
Professional settings management section for the Kasir (Cashier) module with comprehensive configuration options.

## Features

### 1. **General Settings (Umum)**
- Clinic information management
- Operating hours configuration
- Time zone selection
- Dark mode toggle
- Notification sound preferences

### 2. **Printer Settings**
- Printer device management
- Connection status monitoring
- Printer model selection
- Default report format configuration
- Printer test functionality

### 3. **Notification Settings**
- Email notifications toggle
- SMS notifications toggle
- Low stock alerts
- Payment confirmation notifications
- Customizable notification preferences

### 4. **Billing & Invoice Settings**
- Company information management
- Address configuration
- Tax ID/NPWP management
- Invoice prefix customization
- Receipt format selection (Thermal or A4)

### 5. **Security Settings**
- Password change functionality
- Two-factor authentication setup
- Account security guidelines

### 6. **User & Access Management**
- User account creation and management
- Role assignment (Admin, Cashier)
- User status management (Active/Inactive)
- User activity monitoring

## Design Characteristics

### Color Scheme
- **Primary Color**: #1B9C90 (Teal)
- **Secondary Colors**: #29B5A8, #13222D, #67737C
- **Background**: #F9FEFC (Light teal)
- **Border**: #DFE6EB (Light gray)
- **Success**: #1B9C90, #3EB268
- **Warning**: #F2A618
- **Error**: #E63946

### Layout Structure
- **Sidebar Navigation**: 64px width, collapsible icons
- **Settings Tabs**: Professional tag-based tabs with descriptions
- **Content Area**: Maximum 2-column layout for readability
- **Input Fields**: Consistent styling with focus states
- **Buttons**: 40-44px height for touch-friendly interface

### Typography
- **Headers**: Bold, 18-24px
- **Labels**: Semibold, 13-14px
- **Body Text**: Medium, 13-14px
- **Helper Text**: 12px, gray color

## Component Structure

```
Settings/
├── Settings.tsx (Main component)
├── GeneralSettings (Sub-component)
├── PrinterSettings (Sub-component)
├── NotificationSettings (Sub-component)
├── BillingSettings (Sub-component)
├── SecuritySettings (Sub-component)
└── UserManagement (Sub-component)
```

## State Management

### Main Settings State
```typescript
interface GeneralSettings {
  clinicName: string;
  operatingHours: { open: string; close: string };
  timezone: string;
  darkMode: boolean;
  soundNotifications: boolean;
}

interface PrinterSettings {
  name: string;
  model: string;
  status: 'connected' | 'disconnected';
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  lowStockAlert: boolean;
  paymentConfirmation: boolean;
}

interface BillingSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  taxId: string;
  invoicePrefix: string;
  receiptFormat: 'thermal' | 'a4';
}
```

## Usage

### Import
```typescript
import { SettingsPage } from '@/features/kasir/pages/Pengaturan';
```

### Integration
Already integrated in the main router and accessible via:
- **Route**: `/kasir/pengaturan`
- **Sidebar Navigation**: "Pengaturan" menu item
- **Keyboard Shortcut**: Can be configured

## Key Features

### 1. Responsive Design
- Sidebar collapses on smaller screens
- Two-column layout adapts to 1-column on mobile
- Touch-friendly button sizes (44px minimum)

### 2. Form Validation
- All input fields have real-time validation
- Visual feedback for errors
- Confirmation dialogs for destructive actions

### 3. Save Functionality
- Debounced save to prevent redundant API calls
- Visual feedback with loading state
- Success notification after save
- Auto-save option available

### 4. Security
- Password strength indicators
- Two-factor authentication support
- Security warning messages
- Session timeout warnings

### 5. Accessibility
- ARIA labels on all form inputs
- Keyboard navigation support
- High contrast mode compatible
- Screen reader friendly

## Styling Details

### Button Styles
- **Primary**: Teal background (#1B9C90), white text
- **Secondary**: Outline style with border
- **Hover States**: Darker shade (#169B8A)
- **Disabled**: 50% opacity

### Toggle Switch
- Custom styled checkboxes
- Smooth transition animation
- Accessible focus states
- Color-coded states

### Card Design
- Light background (#F9FEFC)
- Subtle borders (#DFE6EB)
- 16px border radius
- Consistent padding (24px)

## Performance Optimization

### Lazy Loading
- Settings tabs rendered on demand
- No automatic API calls
- Manual save triggers

### State Management
- Local state for form inputs
- Debounced onChange handlers
- Minimal re-renders

### Bundle Size
- No external UI libraries beyond shadcn/ui
- Minimal icon usage (lucide-react)
- CSS-in-JS optimization

## Future Enhancements

1. **Backup & Restore**
   - System backup scheduling
   - Automatic backup intervals
   - Restore from backup points

2. **Advanced Logging**
   - Activity log viewer
   - System event history
   - Export logs functionality

3. **Integration Management**
   - Third-party API configuration
   - Webhook settings
   - Integration status monitoring

4. **Custom Branding**
   - Logo upload
   - Color scheme customization
   - Header/footer customization

5. **Performance Metrics**
   - System performance dashboard
   - Response time monitoring
   - Cache management

## Troubleshooting

### Common Issues

**Issue**: Settings not saving
- Clear browser cache
- Check network connection
- Verify user permissions

**Issue**: Printer not connecting
- Ensure printer is powered on
- Check USB/Network connection
- Verify driver installation

**Issue**: Notifications not working
- Check notification settings
- Verify email/SMS service status
- Check spam folder for emails

## API Integration

When implementing backend integration, use these endpoints:

```typescript
// Get settings
GET /api/settings

// Update settings
PUT /api/settings

// Get user list
GET /api/users

// Create user
POST /api/users

// Update user
PUT /api/users/:id

// Delete user
DELETE /api/users/:id

// Test printer
POST /api/printer/test

// Change password
POST /api/auth/change-password
```

## Testing Checklist

- [ ] All tabs navigate correctly
- [ ] Form inputs accept and store values
- [ ] Buttons trigger expected actions
- [ ] Save confirmation works
- [ ] Error messages display properly
- [ ] Responsive on mobile devices
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Performance acceptable (< 2s load time)
- [ ] No console errors

## Related Components

- `FilterTransaction.tsx` - Dropdown filter component
- `PatientFilter.tsx` - Patient filtering
- `InventoryFilter.tsx` - Inventory filtering
- `NotificationPanel.tsx` - Notification management
- `Header.tsx` - Main header component

## Version History

- **v1.0.0** (2024-05-12): Initial release
  - 6 settings categories
  - Professional design
  - Full responsive support
  - Save/cancel functionality
