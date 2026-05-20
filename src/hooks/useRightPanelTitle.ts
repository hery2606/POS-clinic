import type { RightPanelContentType } from '@/features/kasir/context/right-panel-context'

export function useRightPanelTitle(contentType: RightPanelContentType): string {
  const titles: Record<Exclude<RightPanelContentType, null>, string> = {
    'payment': 'Pembayaran',
    'transaction-detail': 'Detail Transaksi',
    'patient-detail': 'Detail Pasien',
    'notification': 'Notifikasi',
    'stock-detail': 'Detail Stok Obat',
  }

  return titles[contentType as Exclude<RightPanelContentType, null>] || ''
}
