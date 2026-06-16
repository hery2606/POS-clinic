"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, ShieldCheck, ShieldAlert, TrendingUp } from "lucide-react";

interface PiutangSummaryCardsProps {
  totalPiutang: number;
  totalPendingTransactions: number;
  averageDelayDays: number;
  piutangRatioPercentage: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export function PiutangSummaryCards({
  totalPiutang,
  totalPendingTransactions,
  averageDelayDays,
  piutangRatioPercentage,
}: PiutangSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Kartu 1: Total Piutang */}
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#67737C]">
              Total Piutang (Bulan Ini)
            </span>
            <div className="bg-[#EFF4F8] p-1.5 rounded-lg text-[#67737C]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#13222D]">
            {formatCurrency(totalPiutang)}
          </h3>
          <div className="flex items-center gap-2 text-xs font-semibold mt-1">
            <span className="bg-[#DFF6F2] text-[#1B9C90] px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {piutangRatioPercentage}%
            </span>
            <span className="text-[#67737C]">
              porsi dari total pendapatan klinik
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Kartu 2: Transaksi Pending */}
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#67737C]">
              Transaksi Pending
            </span>
            <div className="bg-[#EFF4F8] p-1.5 rounded-lg text-[#67737C]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-[#13222D]">
            {totalPendingTransactions} Transaksi
          </h3>
          <div className="flex items-center gap-2 text-xs font-semibold mt-1">
            <span className="bg-[#FFF8E6] text-[#F2A618] px-2 py-0.5 rounded-full">
              Tindakan Diperlukan
            </span>
            <span className="text-[#67737C]">
              menunggu pelunasan kasir
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Kartu 3: Rata-rata Umur Piutang */}
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#67737C]">
              Rata-rata Keterlambatan
            </span>
            {averageDelayDays <= 3 ? (
              <div className="bg-[#DFF6F2] text-[#1B9C90] p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                AMAN
              </div>
            ) : (
              <div className="bg-red-50 text-[#E62C2C] p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                KRITIS
              </div>
            )}
          </div>
          <h3 className="text-2xl font-bold text-[#13222D]">
            {averageDelayDays} Hari
          </h3>
          <div className="flex items-center gap-2 text-xs font-semibold mt-1">
            <span className="text-[#67737C]">
              Batas toleransi penundaan: <span className="font-bold text-[#13222D]">3 Hari</span>
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
