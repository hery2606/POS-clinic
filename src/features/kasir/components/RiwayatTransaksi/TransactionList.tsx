import { 
  SearchIcon, 
  CalendarIcon, 
  FilterIcon 
} from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRightPanel } from '../../context/right-panel-context';

interface Transaction {
  id: string
  time: string
  patient: string
  initial: string
  type: string
  status: string
  total: string
  highlighted?: boolean
}

const transactions: Transaction[] = [
  { 
    id: 'INV-230814-001', 
    time: '14:30', 
    patient: 'Budi Santoso', 
    initial: 'BU', 
    type: 'Pelayanan Medis', 
    status: 'Lunas', 
    total: 'Rp 220.000', 
    highlighted: true 
  },
  { 
    id: 'INV-230814-002', 
    time: '14:15', 
    patient: 'Umum (Obat Saja)', 
    initial: 'UM', 
    type: 'Obat Saja', 
    status: 'Lunas', 
    total: 'Rp 75.000' 
  },
  { 
    id: 'INV-230814-003', 
    time: '13:45', 
    patient: 'Siti Aminah', 
    initial: 'SI', 
    type: 'Pelayanan Medis', 
    status: 'Menunggu', 
    total: 'Rp 150.000' 
  },
  { 
    id: 'INV-230814-004', 
    time: '13:10', 
    patient: 'Agus Pratama', 
    initial: 'AG', 
    type: 'Pelayanan Medis', 
    status: 'Lunas', 
    total: 'Rp 350.000' 
  },
  { 
    id: 'INV-230814-005', 
    time: '12:05', 
    patient: 'Umum (Obat Saja)', 
    initial: 'UM', 
    type: 'Obat Saja', 
    status: 'Lunas', 
    total: 'Rp 12.000' 
  },
];

export const TransactionList = () => {
  const { setContent } = useRightPanel()

  const handleTransactionClick = (transaction: Transaction) => {
    const transactionData = {
      id: transaction.id,
      amount: parseInt(transaction.total.replace(/\D/g, '')) * 1000,
      date: `${new Date().toLocaleDateString('id-ID')} - ${transaction.time}`,
      status: transaction.status === 'Lunas' ? 'success' : 'pending',
      patientName: transaction.patient,
      cashierName: 'Andi Pratama',
      paymentMethod: 'BPJS Kesehatan',
      items: [
        { name: 'Konsultasi Dokter', quantity: 1, price: 150000 },
        { name: 'Obat-obatan (Resep)', quantity: 1, price: 70000 },
      ],
      guaranteeAmount: parseInt(transaction.total.replace(/\D/g, '')) * 1000,
    }
    
    setContent('transaction-detail', transactionData)
  }

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
      {/* HEADER: SEARCH & FILTERS */}
      <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#29B5A8] transition-colors" />
          <Input 
            id="search-invoice"
            name="searchInvoice"
            placeholder="Cari No. Invoice atau Nama Pasien..." 
            className="pl-12 h-12 rounded-full bg-slate-50/50 border-slate-200 focus-visible:ring-[#29B5A8]"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <Button variant="outline" className="rounded-full h-12 px-6 gap-2 border-slate-200 font-bold text-slate-700">
            <CalendarIcon className="w-4 h-4" />
            Hari Ini
            <span className="ml-1 text-[10px]">▼</span>
          </Button>
          <Button variant="outline" className="rounded-full h-12 px-6 gap-2 border-slate-200 font-bold text-slate-700">
            <FilterIcon className="w-4 h-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="px-2 pb-6">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-none">
              <TableHead className="pl-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">No. Invoice</TableHead>
              <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Waktu</TableHead>
              <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Pasien / Keterangan</TableHead>
              <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Jenis</TableHead>
              <TableHead className="text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">Status</TableHead>
              <TableHead className="pr-8 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((trx) => (
              <TableRow 
                key={trx.id} 
                className={cn(
                  "border-none transition-colors group cursor-pointer hover:bg-emerald-50/40 rounded-2xl",
                  trx.highlighted ? "bg-emerald-50/40 rounded-2xl" : ""
                )}
                onClick={() => handleTransactionClick(trx)}
              >
                {/* No Invoice */}
                <TableCell className="pl-8 py-5 font-bold text-slate-900 text-sm">
                  {trx.id}
                </TableCell>

                {/* Waktu */}
                <TableCell className="text-slate-500 font-medium">
                  {trx.time}
                </TableCell>

                {/* Pasien */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-50 text-[#29B5A8] flex items-center justify-center text-[10px] font-black border border-emerald-100">
                      {trx.initial}
                    </div>
                    <span className="font-bold text-slate-900">{trx.patient}</span>
                  </div>
                </TableCell>

                {/* Jenis */}
                <TableCell>
                  <Badge variant="secondary" className="rounded-full bg-slate-100 text-slate-500 font-medium hover:bg-slate-100 border-none px-3 py-1 text-[10px]">
                    {trx.type}
                  </Badge>
                </TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  <Badge 
                    className={cn(
                      "rounded-full px-4 py-1 text-[11px] font-bold border-none shadow-none",
                      trx.status === 'Lunas' 
                        ? "bg-emerald-100 text-[#29B5A8] hover:bg-emerald-100" 
                        : "bg-orange-100 text-orange-600 hover:bg-orange-100"
                    )}
                  >
                    {trx.status}
                  </Badge>
                </TableCell>

                {/* Total */}
                <TableCell className="pr-8 text-right font-bold text-slate-900 text-base">
                  {trx.total}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
