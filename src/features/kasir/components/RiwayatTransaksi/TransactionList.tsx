import { 
  SearchIcon
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
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useRightPanel } from '../../context/right-panel-context';
import { FilterTransaction, type FilterState } from './components/FilterTransaction';
import { DateRangeSelector, type DateRange } from './components/DateRangeSelector';

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

  const handleFilterChange = (newFilters: FilterState) => {
    console.log('Filters applied:', newFilters);
  }

  const handleDateRangeChange = (dateRange: DateRange) => {
    console.log('Date range selected:', dateRange);
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      {/* HEADER: SEARCH & FILTERS */}
      <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b">
        <div className="relative w-full md:max-w-md group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
          <Input 
            id="search-invoice"
            name="searchInvoice"
            placeholder="Cari No. Invoice atau Nama Pasien..." 
            className="pl-12 h-11 rounded-md bg-gray-50 border-gray-200 focus-visible:ring-green-600"
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
          <FilterTransaction onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="pl-8 text-gray-700 font-semibold h-12">No. Invoice</TableHead>
            <TableHead className="text-gray-700 font-semibold h-12">Waktu</TableHead>
            <TableHead className="text-gray-700 font-semibold h-12">Pasien / Keterangan</TableHead>
            <TableHead className="text-gray-700 font-semibold h-12">Jenis</TableHead>
            <TableHead className="text-center text-gray-700 font-semibold h-12">Status</TableHead>
            <TableHead className="pr-8 text-right text-gray-700 font-semibold h-12">Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((trx) => (
            <TableRow 
              key={trx.id} 
              className={cn(
                "transition-colors cursor-pointer hover:bg-gray-50 border-b",
                trx.highlighted ? "bg-green-50/50" : ""
              )}
              onClick={() => handleTransactionClick(trx)}
            >
              {/* No Invoice */}
              <TableCell className="pl-8 py-4 font-medium text-gray-900">
                {trx.id}
              </TableCell>

              {/* Waktu */}
              <TableCell className="text-gray-500 py-4">
                {trx.time}
              </TableCell>

              {/* Pasien */}
              <TableCell className="py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[10px] font-bold border border-green-100">
                    {trx.initial}
                  </div>
                  <span className="font-medium text-gray-900">{trx.patient}</span>
                </div>
              </TableCell>

              {/* Jenis */}
              <TableCell className="py-4">
                <Badge variant="secondary" className="rounded-full bg-gray-100 text-gray-600 font-normal hover:bg-gray-100 border-none px-3 py-0.5 text-[10px]">
                  {trx.type}
                </Badge>
              </TableCell>

              {/* Status */}
              <TableCell className="text-center py-4">
                <Badge 
                  className={cn(
                    "rounded-full px-4 py-0.5 text-[10px] font-semibold border-none shadow-none",
                    trx.status === 'Lunas' 
                      ? "bg-green-100 text-green-700 hover:bg-green-100" 
                      : "bg-orange-100 text-orange-700 hover:bg-orange-100"
                  )}
                >
                  {trx.status}
                </Badge>
              </TableCell>

              {/* Total */}
              <TableCell className="pr-8 text-right py-4 font-bold text-gray-900">
                {trx.total}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};