"use client";

import { useState } from "react";
import { TransactionFilterBar } from "@/features/analitik/components/transaksi/TransactionFilterBar";
import { TransactionTable } from "@/features/analitik/components/transaksi/TransactionTable";
import { TransactionDetailPanel } from "@/features/analitik/components/transaksi/TransactionDetailPanel";

export const TransaksiPage = () => {
  const [selectedTransactionId, setSelectedTransactionId] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    search: string;
    date: string;
    status: string;
    method: string;
  }>({
    search: "",
    date: "all",
    status: "all",
    method: "all"
  });

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8 space-y-6 ">
      <TransactionFilterBar onFilterChange={setFilters} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Kolom Kiri: Tabel Transaksi */}
        <div className="lg:col-span-8 flex w-full">
          <div className="w-full flex *:w-full *:h-full">
            <TransactionTable 
              filters={filters} 
              onSelectTransaction={setSelectedTransactionId}
              selectedId={selectedTransactionId}
            />
          </div>
        </div>
        
        {/* Kolom Kanan: Detail Transaksi */}
        <div className="lg:col-span-4 flex w-full">
          <div className="w-full flex *:w-full *:h-full *:max-w-none">
            <TransactionDetailPanel 
              transactionId={selectedTransactionId} 
            />
          </div>
        </div>
      </div>

    </div>
  );
};

export default TransaksiPage;