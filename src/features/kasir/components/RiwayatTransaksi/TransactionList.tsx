import { useState, useMemo } from 'react';
import { 
  SearchIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
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
import { TransactionListSkeleton } from './ui/TransactionListSkeleton';
import { billingService } from '../../services';
import { type Billing } from '../../types/billing.types';

interface Transaction {
  id: string
  time: string
  patient: string
  initial: string
  type: string
  status: string
  total: string
  highlighted?: boolean
  billingData?: Billing
}

const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? parseInt(value) : value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num);
};

const getInitials = (name: string) => {
  return name
    .split(' ')
    .slice(0, 2)
    .map(word => word[0].toUpperCase())
    .join('')
    .slice(0, 2);
};

const mapBillingToTransaction = (billing: Billing): Transaction => {
  const statusMap: Record<string, string> = {
    'LUNAS': 'Lunas',
    'BELUM_LUNAS': 'Menunggu',
    'SEBAGIAN': 'Sebagian',
  };

  const tanggal = new Date(billing.createdAt);
  const time = tanggal.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  return {
    id: billing.noInvoice,
    time,
    patient: billing.janji.pasien.namaLengkap,
    initial: getInitials(billing.janji.pasien.namaLengkap),
    type: 'Pelayanan Medis',
    status: statusMap[billing.status] || billing.status,
    total: formatCurrency(billing.totalBiaya),
    billingData: billing,
  };
};

export const TransactionList = () => {
  const { setContent } = useRightPanel()
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    statuses: [],
    types: [],
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Fetch data dengan React Query
  const { data: billingResponse, isLoading, error } = useQuery({
    queryKey: ['allBillings'],
    queryFn: () => billingService.getAllBilling(1, 1000),
    staleTime: 5 * 60 * 1000, // 5 menit
    gcTime: 10 * 60 * 1000,   // 10 menit
  });

  // Map billing data to transactions
  const transactions = useMemo(() => {
    if (!billingResponse?.data) return []
    return billingResponse.data.map(mapBillingToTransaction)
  }, [billingResponse?.data])

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

    // Filter by status
    if (newFilters.statuses && newFilters.statuses.length > 0) {
      result = result.filter(trx => {
        const statusId = trx.status.toLowerCase()
        return newFilters.statuses.includes(statusId)
      })
    }

    // Filter by type
    if (newFilters.types && newFilters.types.length > 0) {
      result = result.filter(trx => {
        const typeLabel = trx.type
        const typeId = typeLabel === 'Pelayanan Medis' ? 'medis' : 
                       typeLabel === 'Obat Saja' ? 'obat' : 
                       typeLabel === 'Laboratorium' ? 'laboratorium' : ''
        return newFilters.types.includes(typeId)
      })
    }

    return result
  }

  const filteredTransactions = useMemo(() => {
    return applyFilters(filters, searchQuery)
  }, [transactions, filters, searchQuery])

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage) || 1

  const handleTransactionClick = (transaction: Transaction) => {
    const billing = transaction.billingData
    if (!billing) return

    const transactionData = {
      id: transaction.id,
      amount: parseInt(billing.totalBiaya),
      date: `${new Date(billing.createdAt).toLocaleDateString('id-ID')} - ${transaction.time}`,
      status: billing.status === 'LUNAS' ? 'success' : 'pending',
      patientName: billing.janji.pasien.namaLengkap,
      cashierName: 'Andi Pratama',
      paymentMethod: billing.metodePembayaran,
      items: billing.detail.map(item => ({
        name: item.namaLayanan,
        quantity: item.jumlah,
        price: parseInt(item.harga),
      })),
      guaranteeAmount: parseInt(billing.totalBiaya),
    }
    
    setContent('transaction-detail', transactionData)
  }

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const handleDateRangeChange = (dateRange: DateRange) => {
    console.log('Date range selected:', dateRange);
  }

  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  // SKELETON LOADING UI
  if (isLoading) {
    return <TransactionListSkeleton />
  }

  // ERROR UI
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-8 text-center text-red-600 font-semibold">
        Gagal memuat data transaksi: {(error as Error).message}
      </div>
    )
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
            {paginatedTransactions.map((trx) => {
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
          Menampilkan <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> dari <span className="font-bold text-gray-900">{filteredTransactions.length}</span> Transaksi
        </p>
        
        <div className="flex items-center gap-1.5 pr-4">
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-md border-gray-200 text-gray-400 hover:bg-gray-50" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button 
              key={page}
              className={cn(
                "w-8 h-8 rounded-md text-xs font-bold border-none shadow-none",
                currentPage === page 
                  ? "bg-green-600 hover:bg-green-700 text-white" 
                  : "text-gray-400 hover:bg-gray-50 variant-ghost"
              )}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            size="icon" 
            className="w-8 h-8 rounded-md border-gray-200 text-gray-400 hover:bg-gray-50"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

    </div>
  )
};