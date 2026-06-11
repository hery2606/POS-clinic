"use client";

import { Filter, X, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// 🟢 Sesuaikan dengan struktur FilterState yang dikirim oleh TransactionList.tsx
export interface FilterState {
  status: string;
  type: string;
}

interface FilterTransactionProps {
  filters: FilterState; // 🟢 Menerima state filters dari parent
  onFilterChange: (filters: FilterState) => void; // 🟢 Fungsi updater dari parent
}

// Menyelaraskan ID dengan skema asuransi/tipe pasien di database kasir kamu
const transactionTypes = [
  { id: 'all', label: 'Semua Jenis' },
  { id: 'umum', label: 'Pasien UMUM' },
  { id: 'bpjs', label: 'Pasien BPJS' },
];

// Menyelaraskan ID dengan data status pembayaran riil dari server Railway
const transactionStatus = [
  { id: 'all', label: 'Semua Status' },
  { id: 'lunas', label: 'Lunas' },
  { id: 'pending_payment', label: 'Pending Payment' },
  { id: 'partial', label: 'Partial / Dicicil' },
];

export const FilterTransaction = ({ filters, onFilterChange }: FilterTransactionProps) => {

  const handleSelectFilter = (category: 'status' | 'type', value: string) => {
    // Karena di tabel kita menggunakan sistem single-select per kategori, langsung override nilainya
    const newFilters = {
      ...filters,
      [category]: value
    };
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    // Kembalikan ke setelan default 'all' agar seluruh baris tabel muncul kembali
    onFilterChange({ status: 'all', type: 'all' });
  };

  // Menghitung filter yang aktif (jika nilainya bukan 'all')
  const activeCount = 
    (filters.status !== 'all' ? 1 : 0) + 
    (filters.type !== 'all' ? 1 : 0);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "h-11 px-4 gap-2 border-[#DFE6EB] font-bold text-[#13222D] rounded-md transition-all shadow-none",
            activeCount > 0 ? "bg-[#DFF6F2] border-[#1B9C90]/30 text-[#1B9C90] hover:bg-[#DFF6F2]/80" : "hover:bg-[#EFF4F8]"
          )}
        >
          <Filter className={cn("w-4 h-4", activeCount > 0 ? "text-[#1B9C90]" : "text-[#67737C]")} />
          <span className="text-xs">Filter</span>
          {activeCount > 0 && (
            <Badge className="ml-1 bg-[#1B9C90] text-white hover:bg-[#1B9C90] h-5 min-w-5 px-1 rounded-full flex items-center justify-center text-[10px] font-extrabold border-none shadow-none">
              {activeCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 bg-white rounded-[20px] border border-[#DFE6EB] p-5 shadow-xl space-y-5 z-50" align="end">
        {/* HEADER MINI */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#13222D]">Filter Transaksi</h4>
          {activeCount > 0 && (
            <Button 
              variant="ghost" 
              onClick={resetFilters}
              className="h-auto p-0 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-transparent flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Atur Ulang
            </Button>
          )}
        </div>

        <Separator className="bg-[#EFF4F8]" />

        {/* SECTION 1: STATUS */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider block">Status Transaksi</span>
          <div className="flex flex-wrap gap-2">
            {transactionStatus.map((status) => {
              const isSelected = filters.status === status.id;
              return (
                <button
                  type="button"
                  key={status.id}
                  onClick={() => handleSelectFilter('status', status.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer outline-none",
                    isSelected 
                      ? "bg-[#1B9C90] border-transparent text-white font-bold" 
                      : "bg-white border-[#DFE6EB] text-[#67737C] hover:border-[#67737C]"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>

        <Separator className="bg-[#EFF4F8]" />

        {/* SECTION 2: TRANSACTION TYPE */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider block">Jenis Kontrak Pasien</span>
          <div className="flex flex-wrap gap-2">
            {transactionTypes.map((type) => {
              const isSelected = filters.type === type.id;
              return (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => handleSelectFilter('type', type.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1 cursor-pointer outline-none",
                    isSelected 
                      ? "bg-[#1B9C90] border-transparent text-white font-bold" 
                      : "bg-white border-[#DFE6EB] text-[#67737C] hover:border-[#67737C]"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};