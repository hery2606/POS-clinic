"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, ShieldCheck, ShieldAlert, TrendingUp } from "lucide-react";
import { analitikService } from "@/features/analitik/services/analitik.service";

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
  }).format(amount || 0);
};

export function PiutangSummaryCards({
  totalPiutang,
  totalPendingTransactions,
  averageDelayDays,
  piutangRatioPercentage,
}: PiutangSummaryCardsProps) {
  // Query cashflow summary untuk diintegrasikan secara real-time ke kartu dashboard
  const cashflowQuery = useQuery({
    queryKey: ["cashflowSummary"],
    queryFn: () => analitikService.getCashflowSummary(),
    staleTime: 5 * 60 * 1000,
  });

  // Query pending invoices summary dari API invoices/pending secara global (tidak terikat filter)
  // Gunakan cache key yang SAMA dengan Dashboard agar data instan tersedia
  const pendingInvoicesQuery = useQuery({
    queryKey: ["pendingInvoices"],
    queryFn: () => analitikService.getPendingInvoices(),
    staleTime: 5 * 60 * 1000,
  });

  const rawCashflow = cashflowQuery.data;
  const cashflow = (rawCashflow && "data" in rawCashflow ? rawCashflow.data : rawCashflow) as any;
  const invoiceBelumLunas = cashflow?.nilai_total_invoice_belum_lunas ?? cashflow?.nilaiTotalInvoiceBelumLunas;
  const pendingHariIni = cashflow?.total_transaksi_pending_hari_ini ?? cashflow?.totalTransaksiPendingHariIni ?? 0;

  const rawPending: any = pendingInvoicesQuery.data;
  const pendingSummary = rawPending?.ringkasan_atas || rawPending?.data?.ringkasan_atas;

  // Ekstrak secara paksa dari API jika tersedia, baru jatuh ke fallback
  const displayTotalPiutang = pendingSummary?.total_nilai_piutang !== undefined && pendingSummary?.total_nilai_piutang !== null
    ? pendingSummary.total_nilai_piutang 
    : (invoiceBelumLunas ?? totalPiutang);

  const displayPendingTransactions = pendingSummary?.total_transaksi_pending !== undefined && pendingSummary?.total_transaksi_pending !== null
    ? pendingSummary.total_transaksi_pending 
    : totalPendingTransactions;

  const displayAverageDelayDays = pendingSummary?.rata_rata_umur_piutang_hari !== undefined && pendingSummary?.rata_rata_umur_piutang_hari !== null
    ? pendingSummary.rata_rata_umur_piutang_hari 
    : averageDelayDays;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
      {/* Kartu 1: Total Piutang Keseluruhan */}
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#67737C]">
              Total Piutang Keseluruhan
            </span>
            <div className="bg-[#EFF4F8] p-1.5 rounded-lg text-[#67737C]">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#13222D]">
            {formatCurrency(displayTotalPiutang)}
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
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#67737C]">
              Transaksi Pending
            </span>
            <div className="bg-[#EFF4F8] p-1.5 rounded-lg text-[#67737C]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-[#13222D]">
            {displayPendingTransactions} Transaksi
          </h3>
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold mt-1">
            <span className="bg-[#FFF8E6] text-[#F2A618] px-2 py-0.5 rounded-full">
              Tindakan Diperlukan
            </span>
            {cashflow !== undefined && (
              <span className="bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF] px-2 py-0.5 rounded-md text-[10px] font-black shadow-none uppercase">
                Pending Hari Ini: {pendingHariIni}
              </span>
            )}
            <span className="text-[#67737C] block w-full mt-1.5 border-t border-slate-100 pt-1 font-medium">
              menunggu pelunasan kasir
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Kartu 3: Rata-rata Umur Piutang */}
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start">
            <span className="text-xs font-semibold text-[#67737C]">
              Rata-rata Keterlambatan
            </span>
            {displayAverageDelayDays <= 3 ? (
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
          <h3 className="text-2xl font-black text-[#13222D]">
            {displayAverageDelayDays} Hari
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