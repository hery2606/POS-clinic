"use client";

import { TransactionFilterBar } from "@/features/analitik/components/transaksi/TransactionFilterBar";
import { TransactionHeader } from "@/features/analitik/components/transaksi/TransactionHeader";
import { TransactionTable } from "@/features/analitik/components/transaksi/TransactionTable";
import { TransactionDetailPanel } from "@/features/analitik/components/transaksi/TransactionDetailPanel";

export const TransaksiPage = () => {
  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8 space-y-6 ">
      <TransactionHeader />
      <TransactionFilterBar />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Kolom Kiri: Tabel Transaksi */}
        <div className="lg:col-span-8 flex w-full">
          <div className="w-full flex *:w-full *:h-full">
            <TransactionTable />
          </div>
        </div>
        
        {/* Kolom Kanan: Detail Transaksi */}
        <div className="lg:col-span-4 flex w-full">
          <div className="w-full flex *:w-full *:h-full *:max-w-none">
            <TransactionDetailPanel />
          </div>
        </div>
      </div>

    </div>
  );
};

export default TransaksiPage;