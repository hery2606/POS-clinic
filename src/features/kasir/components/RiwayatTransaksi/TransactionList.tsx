"use client";

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
import { DateRangeSelector, type DateRange as SelectorDateRange } from './components/DateRangeSelector';
import { TransactionListSkeleton } from './ui/TransactionListSkeleton';
import { billingPosService } from '../../services/billing.pos.service';
import { type BillingTransactionItem } from '../../types/billing.types';

interface Transaction {
  id: string
  time: string
  patient: string
  initial: string
  type: string
  status: string
  total: string
  highlighted?: boolean
  billingData?: BillingTransactionItem
}

const formatCurrency = (value: string | number) => {
  const num = typeof value === 'string' ? parseInt(value) : value;
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(num);
};

const mapStatusLabel = (status: string) => {
  switch (status) {
    case 'LUNAS': return 'Sukses';
    case 'PARTIAL': return 'Partial';
    default: return 'Pending';
  }
};

const mapMethodLabel = (method: string, paidMethods?: string[]) => {
  if (paidMethods && paidMethods.length > 1) {
    return paidMethods.join(' + ');
  }
  return method || 'TUNAI';
};

const formatDate = (isoStr: string) => {
  try {
    const date = new Date(isoStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch {
    return isoStr;
  }
};

export default function TransactionList() {
  const { setContent, data: panelData } = useRightPanel();
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const itemsPerPage = 8;

  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    type: 'all'
  });

  const [timeRange, setTimeRange] = useState<SelectorDateRange>('all');
  const [customDates, setCustomDates] = useState({ from: '', to: '' });

  // Ambil data seluruh transaksi kasir untuk tabel sebelah kiri
  const { data: billingResponse, isLoading } = useQuery({
    queryKey: ['billingTransactionsList'],
    queryFn: () => billingPosService.getAllTransactions(),
    staleTime: 1 * 60 * 1000,
  });

  const transactions: Transaction[] = useMemo(() => {
    const rawData = billingResponse?.data || [];
    // Urutkan transaksi terbaru di atas
    const sortedRaw = [...rawData].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return sortedRaw.map((item: any) => {
      const dateObj = new Date(item.createdAt);
      const timeString = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
      
      return {
        id: item.id,
        time: timeString,
        patient: item.patient?.name || 'Pasien Tanpa Nama',
        initial: item.patient?.name?.substring(0, 2).toUpperCase() || 'PS',
        type: item.patient?.insuranceType || 'UMUM',
        status: item.status,
        total: item.total.toString(),
        billingData: item
      };
    });
  }, [billingResponse]);

  const filteredTransactions = useMemo(() => {
    const sekarang = new Date();
    
    return transactions.filter(tx => {
      const matchesSearch = tx.patient.toLowerCase().includes(search.toLowerCase()) || 
                            tx.id.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = filters.status === 'all' || 
                            tx.status.toLowerCase() === filters.status.toLowerCase();
      
      const matchesType = filters.type === 'all' || 
                            tx.type.toLowerCase() === filters.type.toLowerCase();

      let matchesDate = true;
      if (timeRange !== 'all' && tx.billingData?.createdAt) {
        const txDate = new Date(tx.billingData.createdAt);
        const startOfTx = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate()).getTime();
        const hariIniStart = new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate()).getTime();

        if (timeRange === 'today') {
          if (startOfTx !== hariIniStart) matchesDate = false;
        } else if (timeRange === 'week') {
          const tujuhHariLalu = hariIniStart - 7 * 24 * 60 * 60 * 1000;
          if (startOfTx < tujuhHariLalu) matchesDate = false;
        } else if (timeRange === 'month') {
          const awalBulanIni = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1).getTime();
          if (startOfTx < awalBulanIni) matchesDate = false;
        } else if (timeRange === 'custom') {
          if (customDates.from) {
            const fDate = new Date(customDates.from).setHours(0, 0, 0, 0);
            if (startOfTx < fDate) matchesDate = false;
          }
          if (customDates.to) {
            const tDate = new Date(customDates.to).setHours(23, 59, 59, 999);
            if (startOfTx > tDate) matchesDate = false;
          }
        }
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate;
    });
  }, [transactions, search, filters, timeRange, customDates]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredTransactions.slice(start, start + itemsPerPage);
  }, [filteredTransactions, currentPage]);

  if (isLoading) {
    return <TransactionListSkeleton />;
  }

  const totalItems = filteredTransactions.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full flex flex-col justify-between h-full min-h-[600px]">
      <div className="w-full">
        {/* HEADER & FILTERS */}
        <div className="p-5 border-b border-[#DFE6EB] flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0 bg-white">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <SearchIcon className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <Input 
                placeholder="Cari nama pasien atau ID Transaksi..." 
                className="pl-10 h-10 rounded-xl border-gray-200 text-xs focus-visible:ring-[#1B9C90] outline-none"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <FilterTransaction filters={filters} onFilterChange={setFilters} />
          </div>
          
          <div className="flex items-center gap-3">
            <DateRangeSelector 
              onDateRangeChange={(range) => setTimeRange(range)} 
              onCustomDatesChange={(dates) => setCustomDates(dates)}
            />
          </div>
        </div>

        {/* TABLE ELEMENT */}
        <div className="overflow-x-auto w-full">
          <Table className="w-full min-w-[850px] table-fixed">
            <TableHeader>
              <TableRow className="bg-[#F4F7F9] hover:bg-[#F4F7F9] border-none">
                <TableHead className="pl-6 text-xs font-bold text-[#67737C] h-12 w-[22%] text-left">ID TRANSAKSI</TableHead>
                <TableHead className="text-xs font-bold text-[#67737C] h-12 w-[25%] text-left">NAMA PASIEN</TableHead>
                <TableHead className="text-xs font-bold text-[#67737C] h-12 w-[18%] text-left">TANGGAL</TableHead>
                <TableHead className="text-xs font-bold text-[#67737C] h-12 w-[15%] text-left">TOTAL</TableHead>
                <TableHead className="text-xs font-bold text-[#67737C] h-12 w-[10%] text-left">METODE</TableHead>
                <TableHead className="pr-6 text-xs font-bold text-[#67737C] h-12 w-[10%] text-left">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedTransactions.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="h-40 text-center text-xs font-medium text-gray-400">
                    Tidak ada data transaksi yang cocok dengan pencarian atau filter.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedTransactions.map((tx) => {
                  const isSelected = panelData?.transactionId === tx.id || panelData?.id === tx.id;
                  
                  return (
                    <TableRow 
                      key={tx.id}
                      onClick={() => {
                        // 🟢 BYPASS STRICT: Memanggil panel 'detail' kwitansi kasir dengan aman menggunakan Type Casting
                        (setContent as any)('detail', {
                          source: 'kasir',
                          id: tx.id,
                          transactionId: tx.id,
                          amount: parseFloat(tx.total),
                          total: parseFloat(tx.total),
                          patientName: tx.patient,
                          insurance: tx.type,
                          paymentMethod: tx.billingData?.paymentMethod,
                          paidMethods: tx.billingData?.paidMethods
                        });
                      }}
                      className={cn(
                        "border-b border-[#DFE6EB] last:border-none transition-colors hover:bg-[#F9FEFC] cursor-pointer",
                        isSelected && "bg-[#F9FEFC] font-semibold border-l-4 border-l-[#1B9C90]"
                      )}
                    >
                      <TableCell className="pl-6 py-4 text-xs font-bold text-[#13222D] text-left truncate" title={tx.id}>
                        {tx.id.slice(0, 8).toUpperCase()}...
                      </TableCell>
                      <TableCell className="py-4 text-sm font-semibold text-[#13222D] text-left truncate">
                        {tx.patient}
                      </TableCell>
                      <TableCell className="py-4 text-xs font-medium text-[#67737C] text-left">
                        {tx.billingData?.createdAt ? formatDate(tx.billingData.createdAt) : tx.time}
                      </TableCell>
                      <TableCell className="py-4 text-sm font-bold text-[#13222D] text-left">
                        {formatCurrency(tx.total)}
                      </TableCell>
                      <TableCell className="py-4 text-xs font-semibold text-[#13222D] text-left uppercase truncate" title={mapMethodLabel(tx.billingData?.paymentMethod || '', tx.billingData?.paidMethods)}>
                        {mapMethodLabel(tx.billingData?.paymentMethod || '', tx.billingData?.paidMethods)}
                      </TableCell>
                      <TableCell className="pr-6 py-4 text-left">
                        <Badge 
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[10px] font-bold border-none shadow-none inline-flex items-center justify-center uppercase",
                            tx.status === 'LUNAS' && "bg-[#DFF6F2] text-[#1B9C90]",
                            tx.status === 'PENDING_PAYMENT' && "bg-[#FFF9EB] text-[#F2A618]",
                            tx.status === 'PARTIAL' && "bg-orange-50 text-orange-500"
                          )}
                        >
                          {mapStatusLabel(tx.status)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* FOOTER PAGINATION BLOCK */}
      <div className="px-6 py-4 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-medium text-[#67737C]">
          Menampilkan <span className="text-[#13222D] font-bold">{totalItems > 0 ? startIndex + 1 : 0} - {endIndex}</span> dari <span className="text-[#13222D] font-bold">{totalItems}</span> data entri
        </span>
        
        <div className="flex items-center gap-1.5">
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {Array.from({ length: totalPages }).map((_, idx) => (
            <Button 
              key={idx}
              variant="outline" 
              onClick={() => setCurrentPage(idx + 1)}
              className={cn(
                "h-8 px-3 rounded-lg text-xs font-bold border-none shadow-none cursor-pointer",
                currentPage === idx + 1 
                  ? "bg-[#13272F]/5 text-[#1B9C90]" 
                  : "text-[#67737C] hover:bg-[#F4F7F9]"
              )}
            >
              {idx + 1}
            </Button>
          ))}
          
          <Button 
            variant="outline" 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] hover:bg-[#F4F7F9] disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}