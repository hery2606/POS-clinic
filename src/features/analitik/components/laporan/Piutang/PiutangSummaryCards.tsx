"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, ShieldCheck, ShieldAlert, TrendingUp } from "lucide-react";
import { analitikService } from "@/features/analitik/services/analitik.service";

export function PiutangSummaryCards({ totalPiutang, totalPendingTransactions, averageDelayDays, piutangRatioPercentage }: { totalPiutang: number; totalPendingTransactions: number; averageDelayDays: number; piutangRatioPercentage: number; }) {
  const { data: cData } = useQuery({ queryKey: ["cashflowSummary"], queryFn: () => analitikService.getCashflowSummary(), staleTime: 300000 });
  const { data: pData } = useQuery({ queryKey: ["pendingInvoices"], queryFn: () => analitikService.getPendingInvoices(), staleTime: 300000 });

  const c = (cData as any)?.data || cData || {};
  const ps = (pData as any)?.ringkasan_atas || (pData as any)?.data?.ringkasan_atas || {};

  const tPiut = ps.total_nilai_piutang ?? c.nilai_total_invoice_belum_lunas ?? c.nilaiTotalInvoiceBelumLunas ?? totalPiutang;
  const tPend = ps.total_transaksi_pending ?? totalPendingTransactions;
  const tDays = ps.rata_rata_umur_piutang_hari ?? averageDelayDays;
  const pHari = c.total_transaksi_pending_hari_ini ?? c.totalTransaksiPendingHariIni ?? 0;
  
  const fmt = (a: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(a || 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start"><span className="text-xs font-semibold text-[#67737C]">Total Piutang Keseluruhan</span><div className="bg-[#EFF4F8] p-1.5 rounded-lg text-[#67737C]"><Clock className="w-4 h-4" /></div></div>
          <h3 className="text-2xl font-black text-[#13222D]">{fmt(tPiut)}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold mt-1"><span className="bg-[#DFF6F2] text-[#1B9C90] px-2 py-0.5 rounded-full flex items-center gap-1 shrink-0"><TrendingUp className="w-3 h-3" />{piutangRatioPercentage}%</span><span className="text-[#67737C]">porsi dari pendapatan</span></div>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start"><span className="text-xs font-semibold text-[#67737C]">Transaksi Pending</span><div className="bg-[#EFF4F8] p-1.5 rounded-lg text-[#67737C]"><Users className="w-4 h-4" /></div></div>
          <h3 className="text-2xl font-black text-[#13222D]">{tPend} Transaksi</h3>
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold mt-1"><span className="bg-[#FFF8E6] text-[#F2A618] px-2 py-0.5 rounded-full shrink-0">Tindakan Diperlukan</span>{cData && <span className="bg-[#FCE8E6] text-[#C5221F] border border-[#FAD2CF] px-2 py-0.5 rounded-md text-[10px] font-black uppercase shrink-0">Pending: {pHari}</span>}<span className="text-[#67737C] block w-full mt-1.5 border-t border-slate-100 pt-1 font-medium">menunggu pelunasan kasir</span></div>
        </CardContent>
      </Card>
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start"><span className="text-xs font-semibold text-[#67737C]">Rata-rata Keterlambatan</span>{tDays <= 3 ? <div className="bg-[#DFF6F2] text-[#1B9C90] p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-bold"><ShieldCheck className="w-3.5 h-3.5" />AMAN</div> : <div className="bg-red-50 text-[#E62C2C] p-1.5 rounded-lg flex items-center gap-1 text-[10px] font-bold"><ShieldAlert className="w-3.5 h-3.5" />KRITIS</div>}</div>
          <h3 className="text-2xl font-black text-[#13222D]">{tDays} Hari</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold mt-1"><span className="text-[#67737C]">Batas toleransi penundaan: <span className="font-bold text-[#13222D]">3 Hari</span></span></div>
        </CardContent>
      </Card>
    </div>
  );
}