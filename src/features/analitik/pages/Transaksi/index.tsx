"use client";

import React, { useState } from "react";
import { TransactionFilterBar } from "@/features/analitik/components/transaksi/TransactionFilterBar";
import { TransactionTable } from "@/features/analitik/components/transaksi/TransactionTable";
import { TransactionDetailPanel } from "@/features/analitik/components/transaksi/TransactionDetailPanel";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Card className="bg-red-50 rounded-[24px] border border-red-200 p-6 shadow-sm w-full h-full flex flex-col justify-center items-center text-center gap-3">
          <AlertTriangle className="w-10 h-10 text-red-500" />
          <h4 className="font-bold text-red-700 text-sm">Gagal Menampilkan Rincian</h4>
          <p className="text-xs text-red-600 max-w-xs leading-relaxed">
            Terjadi kesalahan pada komponen detail transaksi. <br/>
            <span className="font-mono text-[10px] mt-2 block">{this.state.error?.message}</span>
          </p>
        </Card>
      );
    }
    return this.props.children;
  }
}

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
    <div className="min-h-screen p-4 sm:p-6 lg:p-8 space-y-6">
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
            <ErrorBoundary>
              <TransactionDetailPanel 
                transactionId={selectedTransactionId} 
              />
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransaksiPage;