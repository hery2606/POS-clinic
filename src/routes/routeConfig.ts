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

export const getRoleRedirectPath = (role: string): string => {
  const roleRoutes: Record<string, string> = {
    SUPER_ADMIN: ROUTES.ADMIN.DASHBOARD,
    admin: ROUTES.ADMIN.DASHBOARD,
    KASIR: ROUTES.KASIR.DASHBOARD,
    kasir: ROUTES.KASIR.DASHBOARD,
    dokter: ROUTES.DOKTER.DASHBOARD,
  };
  return roleRoutes[role] || ROUTES.AUTH.LOGIN;
};
