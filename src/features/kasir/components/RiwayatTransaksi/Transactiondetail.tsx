import { 
  X, 
  CheckCircle2, 
  Printer, 
  Share2,
  AlertCircle,
  CreditCard,
  FileText,
  User,
  Activity
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

// Skema Split Bill terintegrasi
interface SplitPaymentDetail {
  method: string;
  amount: number;
}

interface TransactionData {
  id: string
  amount: number
  date: string
  status: 'success' | 'pending'
  patientName: string
  patientAgeDetails?: string; // Sesuai nota: "21 tahun 336 hari"
  doctorName?: string;        // Sesuai nota: "dr.Theresia Dian"
  cashierName: string
  paymentMethod: string
  items: TransactionItem[]
  guaranteeAmount?: number
  isBpjs?: boolean
  billingStatus?: 'LUNAS' | 'BELUM_LUNAS' | 'SEBAGIAN'
  // Data tambahan untuk sistem split bill
  isSplitBill?: boolean;
  splitDetails?: SplitPaymentDetail[];
  changeAmount?: number;     // Nominal Kembali: Rp0
  discountAmount?: number;   // Diskon: Rp0
}

export const TransactionDetail = ({ transaction }: { transaction?: Partial<TransactionData> }) => {
  const { clearContent, setContent } = useRightPanel()

  // Parsing data dari list/backend dengan fallback data riil dari nota fisik Arda Medical Center
  const data: TransactionData = {
    id: transaction?.id || 'INV020800',
    amount: transaction?.amount || 173000,
    date: transaction?.date || '28-05-2026 22:10',
    status: transaction?.status || 'success',
    patientName: transaction?.patientName || 'HERI ARISTA, SDR (Laki - Laki)',
    patientAgeDetails: transaction?.patientAgeDetails || '21 tahun 336 hari',
    doctorName: transaction?.doctorName || 'dr.Theresia Dian',
    cashierName: transaction?.cashierName || 'Farmasi Klinik Arda',
    paymentMethod: transaction?.paymentMethod || 'EDC MANDIRI',
    items: transaction?.items || [
      { name: 'Embalase Farmasi', quantity: 1, price: 3000 },
      { name: 'Sarana dan Prasarana Poli Umum', quantity: 1, price: 15000 },
      { name: 'Pemeriksaan Dokter Umum Poli', quantity: 1, price: 25000 },
      { name: 'Administrasi Umum M', quantity: 1, price: 35000 },
      { name: 'Grantusif tablet (-)', quantity: 10, price: 700 },
      { name: 'LAMESON 4 MG TAB (4 MG)', quantity: 10, price: 6600 },
      { name: 'Sanmol Forte tab (650 MG)', quantity: 10, price: 1000 },
      { name: 'CAVIPLEX CAP FC (100.00iu/g)', quantity: 10, price: 1200 },
    ],
    guaranteeAmount: transaction?.guaranteeAmount || 0,
    billingStatus: transaction?.billingStatus || 'LUNAS',
    // Simulasi deteksi split bill otomatis jika kasir membagi channel pembayaran
    isSplitBill: transaction?.isSplitBill ?? false, 
    splitDetails: transaction?.splitDetails || [
      { method: 'EDC MANDIRI', amount: 100000 },
      { method: 'TUNAI / CASH', amount: 73000 }
    ],
    discountAmount: transaction?.discountAmount || 0,
    changeAmount: transaction?.changeAmount || 0,
  }

  const canPayment = data.billingStatus === 'BELUM_LUNAS' || data.billingStatus === 'SEBAGIAN';

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const statusConfig = data.status === 'success' || data.billingStatus === 'LUNAS'
    ? { bg: '#E6F4EA', icon: CheckCircle2, text: '#137333', label: 'LUNAS / SELESAI' }
    : { bg: '#FCE8E6', icon: AlertCircle, text: '#C5221F', label: 'BELUM LUNAS' }

  return (
    <div className="space-y-6 w-full max-w-md mx-auto animate-in fade-in slide-in-from-right-4 duration-200 mt-12">
      
      {/* HEADER PANEL CONTROL */}
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-xs font-bold text-[#67737C] uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-[#1B9C90]" /> Kwitansi Kasir Digital
        </h3>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-xl bg-[#EFF4F8] text-[#67737C] h-8 w-8 hover:bg-slate-200"
          onClick={clearContent}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* STATUS BANNER UTAMA */}
      <div className="flex flex-col items-center text-center space-y-3 bg-white rounded-2xl p-5 border border-[#DFE6EB] shadow-xs">
        <div 
          className="w-11 h-11 rounded-xl flex items-center justify-center" 
          style={{ backgroundColor: statusConfig.bg }}
        >
          <statusConfig.icon className="w-6 h-6" style={{ color: statusConfig.text }} />
        </div>
        <div className="space-y-1">
          <Badge 
            className="border-none rounded-md px-2.5 py-0.5 font-bold shadow-none text-[10px] tracking-wider"
            style={{ backgroundColor: statusConfig.bg, color: statusConfig.text }}
          >
            {statusConfig.label}
          </Badge>
          <h1 className="text-2xl font-black text-[#13222D] mt-1">{formatCurrency(data.amount)}</h1>
          <p className="text-[10px] font-medium text-[#67737C]">Klinik Utama Arda Medical Center</p>
        </div>
      </div>

      {/* METADATA NOTA KLINIK (PERSIS STRUKTUR NOTA ARDA) */}
      <div className="bg-[#F4FBF9] rounded-2xl p-4 border border-emerald-100 space-y-2.5 text-xs">
        <div className="grid grid-cols-3 gap-1">
          <span className="font-semibold text-[#67737C]">Cashier</span>
          <span className="col-span-2 font-bold text-[#13222D]">: {data.cashierName}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <span className="font-semibold text-[#67737C]">Pasien</span>
          <span className="col-span-2 font-bold text-[#13222D]">
            : {data.patientName}
            <span className="block text-[11px] text-[#1B9C90] font-medium mt-0.5 pl-2">➔ {data.patientAgeDetails}</span>
          </span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <span className="font-semibold text-[#67737C]">Dokter</span>
          <span className="col-span-2 font-bold text-[#13222D]">: {data.doctorName}</span>
        </div>
        
        <Separator className="bg-[#D2EBE7] border-dashed my-2" />
        
        <div className="grid grid-cols-3 gap-1">
          <span className="font-semibold text-[#67737C]">No Invoice</span>
          <span className="col-span-2 font-mono font-bold text-[#13222D]">: {data.id}</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <span className="font-semibold text-[#67737C]">Tanggal</span>
          <span className="col-span-2 font-medium text-slate-700">: {data.date}</span>
        </div>
      </div>

      {/* RINCIAN ITEM TINDAKAN & FARMASI */}
      <div className="space-y-2">
        <p className="text-[10px] font-black text-[#67737C] uppercase tracking-widest block px-1">
          Rincian Transaksi Tindakan & Obat
        </p>
        <div className="bg-white p-4 rounded-2xl border border-[#DFE6EB] shadow-xs space-y-3 max-h-60 overflow-y-auto">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start text-xs border-b border-slate-50 pb-2 last:border-none last:pb-0">
              <div className="space-y-0.5 max-w-[70%]">
                <p className="font-bold text-[#13222D] leading-tight">{item.name}</p>
                <p className="text-[10px] font-medium text-[#67737C]">
                  {item.quantity} x {formatCurrency(item.price)}
                </p>
              </div>
              <span className="font-bold text-[#13222D] pt-0.5">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SEKSI AKUMULASI BIAYA & LOGIKA SPLIT BILL */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFE6EB] shadow-xs space-y-2.5 text-xs">
        <div className="flex justify-between items-center text-slate-600">
          <span>Harga Kotor Tagihan</span>
          <span className="font-semibold">{formatCurrency(data.amount)}</span>
        </div>
        <div className="flex justify-between items-center text-slate-600">
          <span>Diskon Pasien</span>
          <span className="font-semibold text-red-500">-{formatCurrency(data.discountAmount || 0)}</span>
        </div>

        <Separator className="bg-slate-100" />

        <div className="flex justify-between items-center py-0.5">
          <span className="font-black text-[#13222D]">Total Akhir (Netto)</span>
          <span className="font-black text-[#1B9C90] text-base">{formatCurrency(data.amount)}</span>
        </div>

        {/* 🛑 LOGIKA KONDISIONAL SISTEM SPLIT BILL AUTOMATIC */}
        {data.isSplitBill && data.splitDetails && data.splitDetails.length > 0 ? (
          <div className="mt-2 pt-2 border-t border-dashed border-slate-200 bg-amber-50/40 p-2.5 rounded-xl border border-amber-100/60 animate-in fade-in duration-200">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-600" /> Rincian Metode Split Bill
            </span>
            <div className="space-y-1.5">
              {data.splitDetails.map((split, sIdx) => (
                <div key={sIdx} className="flex justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">➔ via {split.method}</span>
                  <span className="font-bold text-slate-800">{formatCurrency(split.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* TAMPILAN JIKA SATU METODE PEMBAYARAN METODE NORMAL */
          <div className="flex justify-between items-center text-[11px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100">
            <span className="font-medium flex items-center gap-1"><CreditCard className="w-3 h-3" /> Metode Bayar</span>
            <span className="font-bold text-slate-700">{data.paymentMethod}</span>
          </div>
        )}

        <Separator className="bg-slate-100" />

        <div className="flex justify-between items-center text-slate-600">
          <span className="font-semibold">Uang Kembali (Change)</span>
          <span className="font-bold text-slate-800">{formatCurrency(data.changeAmount || 0)}</span>
        </div>
      </div>

      {/* FOOTER ACTIONS - DYNAMIC INTERACTION BUTTON */}
      <div className="space-y-2 pt-2 border-t border-[#DFE6EB]">
        {canPayment ? (
          <Button 
            className="w-full h-11 bg-[#1B9C90] hover:bg-[#15857a] rounded-xl text-white font-bold text-xs shadow-md shadow-[#1B9C90]/10 gap-2 transition-all"
            onClick={() => setContent('payment', { transactionId: data.id, amount: data.amount })}
          >
            <CreditCard className="w-4 h-4" />
            Lanjut Eksekusi Pelunasan
          </Button>
        ) : (
          <div className="bg-emerald-50 text-[#137333] p-3 rounded-xl border border-emerald-100 flex items-center justify-center gap-2 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Kwitansi Ini Sudah Lunas Sepenuhnya
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline"
            className="h-10 rounded-xl border-[#DFE6EB] text-[#13222D] font-bold text-xs bg-[#F9FEFC] hover:bg-[#EFF4F8] gap-1.5 shadow-none"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            Cetak Struk
          </Button>
          <Button 
            variant="outline"
            className="h-10 rounded-xl border-[#DFE6EB] text-[#13222D] font-bold text-xs bg-[#F9FEFC] hover:bg-[#EFF4F8] gap-1.5 shadow-none"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-400" />
            Kirim WhatsApp
          </Button>
        </div>
      </div>

    </div>
  );
};