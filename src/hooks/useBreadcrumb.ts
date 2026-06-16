import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

/**
 * Hook untuk generate breadcrumb navigation berdasarkan URL path saat ini.
 * 
 * Contoh output:
 * - Halaman /kasir: [Dashboard]
 * - Halaman /riwayat: [Dashboard > Riwayat Transaksi]
 * - Halaman /pasien: [Dashboard > Data Pasien]
 * 
 * Untuk menambah halaman baru:
 * Tambahkan entry baru di pathMap object dengan format { '/path': 'Label Halaman' }
 */
export function useBreadcrumb(): BreadcrumbItem[] {
  const location = useLocation()

  return useMemo(() => {
    const path = location.pathname
    const breadcrumbs: BreadcrumbItem[] = [
      {
        label: 'Kasir',
        href: '/kasir',
        isActive: path === '/kasir',
      },
    ]

    const pathMap: Record<string, string> = {
      'kasir': 'Kasir',
      'riwayat': 'Riwayat Transaksi',
      'pasien': 'Data Pasien',
      'stok': 'Stok Obat',
      'pengaturan': 'Pengaturan',
    }

    const cleanPath = path.startsWith('/') ? path.substring(1) : path;

    if (path !== '/kasir') {
      const label = pathMap[cleanPath] || cleanPath
      breadcrumbs.push({
        label,
        isActive: true,
      })
    }

    return breadcrumbs
  }, [location.pathname])
}
