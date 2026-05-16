/**
 * Route Configuration
 * Menampung semua path dan konfigurasi routing aplikasi
 */

export const ROUTES = {
  AUTH: {
    LOGIN: '/login',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    PASIEN: '/admin/Pasien',
    TRANSAKSI: '/admin/Transaksi',
    LAPORAN: '/admin/Laporan',
    SETTINGS: '/admin/settings',
  },
  KASIR: {
    DASHBOARD: '/kasir',
    RIWAYAT: '/kasir/riwayat',
    PASIEN: '/kasir/pasien',
    STOK: '/kasir/stok',
    PENGATURAN: '/kasir/pengaturan',
  },
  DOKTER: {
    DASHBOARD: '/dokter/dashboard',
  },
} as const;

export const getRoleRedirectPath = (role: 'admin' | 'kasir' | 'dokter'): string => {
  const roleRoutes = {
    admin: ROUTES.ADMIN.DASHBOARD,
    kasir: ROUTES.KASIR.DASHBOARD,
    dokter: ROUTES.DOKTER.DASHBOARD,
  };
  return roleRoutes[role];
};
