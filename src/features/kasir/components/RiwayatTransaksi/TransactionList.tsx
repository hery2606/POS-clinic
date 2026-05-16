import { useState } from 'react';
import { 
  SearchIcon,
  ChevronLeft,
  ChevronRight
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
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    statuses: [],
    types: [],
  })
  const [filteredTransactions, setFilteredTransactions] = useState(transactions)

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

  const applyFilters = (newFilters: FilterState, search: string) => {
    let result = transactions

    // Filter by search
    if (search.trim()) {
      const query = search.toLowerCase()
      result = result.filter(trx =>
        trx.id.toLowerCase().includes(query) ||
        trx.patient.toLowerCase().includes(query)
      )
    }

    // Filter by status - map status text to filter id
    if (newFilters.statuses && newFilters.statuses.length > 0) {
      result = result.filter(trx => {
        const statusId = trx.status.toLowerCase()
        return newFilters.statuses.includes(statusId)
      })
    }

    // Filter by type - map type text to filter id
    if (newFilters.types && newFilters.types.length > 0) {
      result = result.filter(trx => {
        const typeLabel = trx.type
        const typeId = typeLabel === 'Pelayanan Medis' ? 'medis' : 
                       typeLabel === 'Obat Saja' ? 'obat' : 
                       typeLabel === 'Laboratorium' ? 'laboratorium' : ''
        return newFilters.types.includes(typeId)
      })
    }

    setFilteredTransactions(result)
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    applyFilters(newFilters, searchQuery)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    applyFilters(filters, value)
  }

  const handleDateRangeChange = (dateRange: DateRange) => {
    console.log('Date range selected:', dateRange);
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden w-full">
      {/* HEADER: SEARCH & FILTERS */}
      <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-gray-100">
        <div className="relative w-full md:max-w-md group">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-green-600 transition-colors" />
          <Input 
            id="search-invoice"
            name="searchInvoice"
            placeholder="Cari No. Invoice atau Nama Pasien..." 
            className="pl-12 h-11 rounded-md bg-gray-50 border-gray-200 focus-visible:ring-green-600 font-medium text-gray-900"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <DateRangeSelector onDateRangeChange={handleDateRangeChange} />
          <FilterTransaction onFilterChange={handleFilterChange} />
        </div>
      </div>

      {/* TRANSACTION TABLE */}
      <div className="overflow-x-auto w-full">
        <Table className="w-full table-fixed min-w-[850px]">
          <TableHeader>
            <TableRow className="bg-gray-50 hover:bg-gray-50 border-none">
              <TableHead className="pl-8 text-gray-700 font-bold h-12 text-left w-[20%]">No. Invoice</TableHead>
              <TableHead className="text-gray-700 font-bold h-12 text-left w-[10%]">Waktu</TableHead>
              <TableHead className="text-gray-700 font-bold h-12 text-left w-[27%]">Pasien / Keterangan</TableHead>
              <TableHead className="text-gray-700 font-bold h-12 text-left w-[15%]">Jenis</TableHead>
              <TableHead className="text-center text-gray-700 font-bold h-12 w-[13%]">Status</TableHead>
              <TableHead className="pr-8 text-right text-gray-700 font-bold h-12 w-[15%]">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.map((trx) => {
              const isActive = trx.highlighted;
              return (
                <TableRow 
                  key={trx.id} 
                  className={cn(
                    "border-b border-gray-100 transition-colors cursor-pointer hover:bg-gray-50/80",
                    isActive ? "bg-green-50/50 hover:bg-green-50/60" : ""
                  )}
                  onClick={() => handleTransactionClick(trx)}
                >
                  <TableCell className="pl-8 py-4 font-medium text-gray-900 text-sm text-left">
                    {trx.id}
                  </TableCell>

                  <TableCell className="text-gray-500 font-medium text-sm text-left">
                    {trx.time}
                  </TableCell>

                  <TableCell className="text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-[10px] font-bold border border-green-100 shrink-0">
                        {trx.initial}
                      </div>
                      <span className="font-medium text-gray-900 truncate">{trx.patient}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-left">
                    <Badge variant="secondary" className="rounded-full bg-gray-100 text-gray-600 font-bold hover:bg-gray-100 border-none px-3 py-0.5 text-[10px]">
                      {trx.type}
                    </Badge>
                  </TableCell>

                  <TableCell className="text-center">
                    <Badge 
                      className={cn(
                        "rounded-full px-3 py-0.5 text-[10px] font-bold border-none shadow-none inline-flex items-center justify-center",
                        trx.status === 'Lunas' 
                          ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-50" 
                          : "bg-orange-50 text-orange-700 border-orange-100 hover:bg-orange-50"
                      )}
                    >
                      {trx.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="pr-8 text-right font-bold text-gray-900 text-sm">
                    {trx.total}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION FOOTER */}
      <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-white text-sm shrink-0">
        <p className="text-xs font-medium text-gray-400 pl-4">
          Menampilkan <span className="font-bold text-gray-900">1-{Math.min(5, filteredTransactions.length)}</span> dari <span className="font-bold text-gray-900">{filteredTransactions.length}</span> Transaksi
        </p>
        
        <div className="flex items-center gap-1.5 pr-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-md border-gray-200 text-gray-400 hover:bg-gray-50" 
            disabled
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button 
            className="w-8 h-8 rounded-md bg-green-600 hover:bg-green-700 text-white font-bold text-xs border-none shadow-none"
          >
            1
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-8 h-8 rounded-md text-gray-400 font-bold text-xs hover:bg-gray-50"
          >
            2
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-8 h-8 rounded-md text-gray-400 font-bold text-xs hover:bg-gray-50"
          >
            3
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-md border-gray-200 text-gray-400 hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

    </div>
  );
};