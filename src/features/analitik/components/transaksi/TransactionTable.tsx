"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { billingPosService } from "@/features/kasir/services/billing.pos.service";

interface TransactionTableProps {
  filters: {
    search: string;
    date: string;
    status: string;
    method: string;
  };
  onSelectTransaction: (id: string) => void;
  selectedId: string | null;
}

export function TransactionTable({ filters, onSelectTransaction, selectedId }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // 🎯 AMBIL DATA DARI BACKEND DENGAN REACT QUERY
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['billingTransactions'],
    queryFn: () => billingPosService.getAllTransactions(),
  });

  const transactions = data?.data || [];

  // Reset halaman ke 1 jika filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Filter data transaksi secara lokal & robust
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // 1. Filter Cari (ID Transaksi / Nama Pasien)
    if (filters.search) {
      const q = filters.search.toLowerCase().trim();
      result = result.filter(tx => 
        String(tx.id).toLowerCase().includes(q) || 
        (tx.patient?.name && tx.patient.name.toLowerCase().includes(q))
      );
    }

    // 2. Filter Status
    if (filters.status !== 'all') {
      result = result.filter(tx => {
        if (filters.status === 'success') return tx.status === 'LUNAS';
        if (filters.status === 'pending') return tx.status === 'PENDING_PAYMENT' || tx.status === 'PARTIAL';
        return false;
      });
    }

    // 3. Filter Metode Pembayaran
    if (filters.method !== 'all') {
      result = result.filter(tx => {
        const payMethod = (tx.paymentMethod || '').toLowerCase();
        // Cek juga dalam list paidMethods jika split-bill
        const hasMethodInSplits = (tx.paidMethods || []).some(
          m => m.toLowerCase() === filters.method.toLowerCase()
        );
        return payMethod === filters.method.toLowerCase() || hasMethodInSplits;
      });
    }

    // 4. Filter Rentang Waktu (Tanggal)
    if (filters.date !== 'all') {
      const now = new Date();
      result = result.filter(tx => {
        const txDate = new Date(tx.createdAt);
        const diffTime = Math.abs(now.getTime() - txDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (filters.date === 'today') {
          return txDate.toDateString() === now.toDateString();
        }
        if (filters.date === '7d') {
          return diffDays <= 7;
        }
        if (filters.date === '30d') {
          return diffDays <= 30;
        }
        return true;
      });
    }

    // Urutkan transaksi terbaru di atas
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [transactions, filters]);

  // Set transaksi pertama otomatis terpilih setelah load pertama kali
  useEffect(() => {
    if (!selectedId && filteredTransactions.length > 0) {
      onSelectTransaction(filteredTransactions[0].id);
    }
  }, [filteredTransactions, selectedId, onSelectTransaction]);

  // Pagination kalkulasi
  const totalItems = filteredTransactions.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const paginatedTransactions = useMemo(() => {
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, startIndex, endIndex]);

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

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full flex flex-col justify-between h-full">
      <div className="w-full">
        {/* HEADER TABLE SECTION */}
        <div className="p-6 border-b border-[#DFE6EB] flex items-baseline gap-2">
          <h3 className="text-base font-bold text-[#13222D]">
            Daftar Transaksi
          </h3>
          <span className="text-xs font-medium text-[#67737C]">
            {isLoading ? "Memuat..." : `Menampilkan ${paginatedTransactions.length} dari ${totalItems} data`}
          </span>
        </div>

        {/* TABLE ELEMENT */}
        <div className="overflow-x-auto w-full">
          <Table className="w-full min-w-200 table-fixed">
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
              {isLoading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <TableRow key={i} className="border-b border-[#DFE6EB] last:border-none">
                    <TableCell className="pl-6 py-4"><Skeleton className="h-4 w-5/6" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-4/5" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-3/4" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-1/2" /></TableCell>
                    <TableCell className="py-4"><Skeleton className="h-4 w-12" /></TableCell>
                    <TableCell className="pr-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-red-500 font-semibold">
                    Gagal mengambil data transaksi. <button onClick={() => refetch()} className="underline text-[#1B9C90] cursor-pointer">Coba lagi</button>
                  </TableCell>
                </TableRow>
              ) : paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => (
                  <TableRow 
                    key={tx.id} 
                    onClick={() => onSelectTransaction(tx.id)}
                    className={cn(
                      "border-b border-[#DFE6EB] last:border-none transition-colors hover:bg-[#F9FEFC] cursor-pointer",
                      selectedId === tx.id && "bg-[#F9FEFC] font-semibold border-l-4 border-l-[#1B9C90]"
                    )}
                  >
                    <TableCell className="pl-6 py-4 text-xs font-bold text-[#13222D] text-left truncate" title={String(tx.id)}>
                      {String(tx.id).slice(0, 8).toUpperCase()}...
                    </TableCell>
                    <TableCell className="py-4 text-sm font-semibold text-[#13222D] text-left truncate">
                      {tx.patient?.name || "Pasien Umum"}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-medium text-[#67737C] text-left">
                      {formatDate(tx.createdAt)}
                    </TableCell>
                    <TableCell className="py-4 text-sm font-bold text-[#13222D] text-left">
                      Rp {tx.total.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-semibold text-[#13222D] text-left uppercase truncate" title={mapMethodLabel(tx.paymentMethod, tx.paidMethods)}>
                      {mapMethodLabel(tx.paymentMethod, tx.paidMethods)}
                    </TableCell>
                    <TableCell className="pr-6 py-4 text-left">
                      <Badge
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-bold border-none shadow-none inline-flex items-center justify-center uppercase",
                          tx.status === "LUNAS" && "bg-[#DFF6F2] text-[#1B9C90]",
                          tx.status === "PARTIAL" && "bg-orange-50 text-orange-500",
                          tx.status === "PENDING_PAYMENT" && "bg-[#FFF9EB] text-[#F2A618]"
                        )}
                      >
                        {mapStatusLabel(tx.status)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-[#67737C]">
                    <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    Tidak ada transaksi ditemukan
                  </TableCell>
                </TableRow>
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
            disabled={currentPage === 1 || isLoading}
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
            disabled={currentPage === totalPages || isLoading}
            className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] hover:bg-[#F4F7F9] disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}