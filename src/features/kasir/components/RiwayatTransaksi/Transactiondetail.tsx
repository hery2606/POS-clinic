import { 
  X, 
  CheckCircle2, 
  Printer, 
  Share2 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useRightPanel } from '../../context/right-panel-context';

interface TransactionItem {
  name: string
  quantity: number
  price: number
}

interface TransactionData {
  id: string
  amount: number
  date: string
  status: 'success' | 'pending'
  patientName: string
  cashierName: string
  paymentMethod: string
  items: TransactionItem[]
  guaranteeAmount?: number
}

export const TransactionDetail = ({ transaction }: { transaction?: Partial<TransactionData> }) => {
  const { clearContent, setContent } = useRightPanel()

  // Default data untuk demo/fallback
  const data: TransactionData = {
    id: transaction?.id || 'INV-230814-001',
    amount: transaction?.amount || 220000,
    date: transaction?.date || 'Senin, 14 Ags 2023 - 14:30',
    status: transaction?.status || 'success',
    patientName: transaction?.patientName || 'Budi Santoso',
    cashierName: transaction?.cashierName || 'Andi Pratama',
    paymentMethod: transaction?.paymentMethod || 'BPJS Kesehatan',
    items: transaction?.items || [
      { name: 'Konsultasi Dokter', quantity: 1, price: 150000 },
      { name: 'Obat-obatan (Resep)', quantity: 1, price: 70000 },
    ],
    guaranteeAmount: transaction?.guaranteeAmount,
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const statusColor = data.status === 'success' 
    ? { bg: '#DFF6F2', icon: '#1B9C90', text: '#1B9C90' }
    : { bg: '#FFF4E6', icon: '#F59E0B', text: '#F59E0B' }

  return (
    <div className="space-y-5  w-full max-w-md mx-auto">
      {/* HEADER - Close Button Only */}
      <div className="flex justify-end mb-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full bg-[#EFF4F8] text-[#67737C]"
          onClick={clearContent}
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* STATUS PEMBAYARAN */}
      <div className="flex flex-col items-center text-center space-y-4 bg-linear-to-br from-white to-slate-50 rounded-xl p-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: statusColor.bg }}>
          <CheckCircle2 className="w-10 h-10" style={{ color: statusColor.icon }} />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: statusColor.text }}>
            {data.status === 'success' ? 'Pembayaran Berhasil' : 'Pembayaran Menunggu'}
          </p>
          <h1 className="text-3xl font-bold text-[#13222D]">{formatCurrency(data.amount)}</h1>
          <p className="text-sm font-medium text-[#67737C]">{data.date}</p>
        </div>
      </div>

      {/* INFORMASI TRANSAKSI */}
      <div className="bg-[#F9FEFC] rounded-[16px] p-5 border border-[#DFE6EB] space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#67737C]">No. Invoice</span>
          <span className="text-sm font-medium text-[#13222D]">{data.id}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#67737C]">Pasien</span>
          <span className="text-sm font-medium text-[#13222D]">{data.patientName}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#67737C]">Kasir</span>
          <span className="text-sm font-medium text-[#13222D]">{data.cashierName}</span>
        </div>
        <Separator className="bg-[#DFE6EB]" />
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-[#67737C]">Metode</span>
          <Badge className="bg-[#DFF6F2] text-[#1B9C90] border-none rounded-full px-3 py-1 flex gap-2 font-bold shadow-none hover:bg-[#DFF6F2] text-xs">
            <CheckCircle2 className="w-3 h-3" />
            {data.paymentMethod}
          </Badge>
        </div>
      </div>

      {/* RINCIAN ITEM */}
      <div className="space-y-3">
        <p className="text-[10px] font-black text-[#67737C] uppercase tracking-widest">
          Rincian Item
        </p>
        <div className="space-y-4">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start">
              <div>
                <p className="text-sm font-bold text-[#13222D]">{item.name}</p>
                <p className="text-xs font-medium text-[#67737C]">{item.quantity} x {formatCurrency(item.price)}</p>
              </div>
              <span className="text-sm font-bold text-[#13222D]">{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          
          <Separator className="bg-[#DFE6EB]" />
          
          {/* TOTAL & PENJAMIN */}
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-[#13222D]">Total Tagihan</span>
              <span className="text-base font-bold text-[#13222D]">{formatCurrency(data.amount)}</span>
            </div>
            {data.guaranteeAmount && (
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-[#1B9C90]">Ditanggung Penjamin</span>
                <span className="text-base font-bold text-[#1B9C90]">-{formatCurrency(data.guaranteeAmount)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER ACTIONS */}
      <div className="space-y-2 pt-4 border-t border-[#DFE6EB]">
        <Button 
          className="w-full h-12 bg-[#1B9C90] hover:bg-[#15857a] rounded-full text-white font-black text-sm shadow-lg shadow-[#1B9C90]/20 gap-2"
          onClick={() => setContent('payment', { transactionId: data.id, amount: data.amount })}
        >
          <Printer className="w-4 h-4" />
          Lanjut Pembayaran
        </Button>
        <Button 
          variant="outline"
          className="w-full h-12 rounded-full border-[#DFE6EB] text-[#13222D] font-black text-sm bg-[#F9FEFC] hover:bg-[#EFF4F8] gap-2"
        >
          <Printer className="w-4 h-4" />
          Cetak Struk
        </Button>
        <Button 
          variant="outline"
          className="w-full h-12 rounded-full border-[#DFE6EB] text-[#13222D] font-black text-sm bg-[#F9FEFC] hover:bg-[#EFF4F8] gap-2"
        >
          <Share2 className="w-4 h-4" />
          Kirim via WhatsApp
        </Button>
      </div>
    </div>
  );
};
