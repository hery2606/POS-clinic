"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionHeaderProps {
  onCreateTransaction?: () => void;
}

export function TransactionHeader({ onCreateTransaction }: TransactionHeaderProps) {
  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#13222D]">
          Transaksi
        </h2>
        <p className="text-sm font-medium text-[#67737C]">
          Daftar Penjualan, Pembayaran, dan Invoice
        </p>
      </div>
      
      <Button
        onClick={onCreateTransaction}
        className="bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold h-11 px-5 rounded-xl flex items-center gap-2 shadow-sm transition-colors border-none"
      >
        <Plus className="w-4 h-4 stroke-[2.5]" />
        <span>Buat Transaksi</span>
      </Button>
    </div>
  );
}