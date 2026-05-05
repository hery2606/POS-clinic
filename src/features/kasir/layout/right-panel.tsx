import { PaymentPanel } from '../components/payment/PaymentPanel'
import { TransactionDetail } from '../components/RiwayatTransaksi/Transactiondetail'
import { PatientDetail } from '../components/dataPasien/PatientDetail'
import { useRightPanel } from '../context/right-panel-context'
import { useRightPanelTitle } from '@/hooks/useRightPanelTitle'

export function RightPanel() {
  const { contentType, data } = useRightPanel()
  const title = useRightPanelTitle(contentType)

  return (
    <aside className="w-100 border-l bg-white flex flex-col h-screen sticky top-0 overflow-hidden animate-in fade-in duration-500">
      {/* Header - Title */}
      {contentType && (
        <div className="px-6 py-4 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h2>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {contentType === 'payment' && (
          <div className="flex-1 overflow-y-auto p-6 space-y-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <PaymentPanel />
          </div>
        )}

        {contentType === 'transaction-detail' && (
          <div className="flex-1 p-6 flex flex-col justify-center overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TransactionDetail transaction={data} />
          </div>
        )}

        {contentType === 'patient-detail' && (
          <div className="flex-1 overflow-y-auto p-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <PatientDetail patient={data} />
          </div>
        )}

        {!contentType && (
          <div className="flex-1 flex items-center justify-center text-center">
            <p className="text-slate-400">Pilih transaksi untuk melihat detail</p>
          </div>
        )}
      </div>
    </aside>
  )
}

