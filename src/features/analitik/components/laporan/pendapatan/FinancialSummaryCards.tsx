"use client";

import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown, Coins, Calendar, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { analitikService } from "../../../services/analitik.service";
import { cn } from "@/lib/utils";

export function FinancialSummaryCards({ period }: { period?: string }) {
  const { data: raw, isLoading, error } = useQuery({ queryKey: ["revenueTrendData"], queryFn: () => analitikService.getRevenueTrend(), staleTime: 300000 });
  const data: any = raw?.data || raw || {};
  
  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const ap = period || todayStr;

  const fmt = (a: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(a || 0);

  if (error) return <div className="w-full space-y-6"><div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold shadow-xs">⚠️ Gagal Memuat Finansial: {error instanceof Error ? error.message : "Error"}</div></div>;
  if (isLoading || !raw) return <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">{[1,2,3].map(i => <Card key={i} className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm"><CardContent className="p-0 space-y-3"><div className="h-4 bg-slate-100 rounded-md animate-pulse w-32" /><div className="h-8 bg-slate-100 rounded-xl animate-pulse w-48" /><div className="h-4 bg-slate-100 rounded-md animate-pulse w-40" /></CardContent></Card>)}</div>;

  const days = (data.tabel_rincian_harian || []).filter((i: any) => i.tanggal?.startsWith(ap));
  const sumMonth = days.reduce((s: number, d: any) => s + (d.total_pendapatan || 0), 0);
  
  let tMonth = 0, tWeek = 0, dAvg = 0, comp = { bln_ini: 0, bln_lalu: 0, pct: 0, st: "Turun" };

  if (days.length > 0 && sumMonth > 0) {
    tMonth = sumMonth; dAvg = tMonth / days.length;
    tWeek = [...days].sort((a, b) => a.tanggal.localeCompare(b.tanggal)).slice(-7).reduce((s, d) => s + (d.total_pendapatan || 0), 0);
    const pStr = (() => { const p = ap.split("-"); return `${p[0]}-${String(Number(p[1]) - 1).padStart(2, "0")}`; })();
    const pRev = (data.tabel_rincian_harian || []).filter((i: any) => i.tanggal?.startsWith(pStr)).reduce((s: number, d: any) => s + (d.total_pendapatan || 0), 0);
    const fPrev = pRev > 0 ? pRev : (data.perbandingan_bulan_ini_vs_lalu?.bulan_lalu || data.target_bulan_lalu || data.targetBulanLalu || 500000);
    const pct = fPrev > 0 ? ((tMonth - fPrev) / fPrev) * 100 : 0;
    comp = { bln_ini: tMonth, bln_lalu: fPrev, pct, st: pct >= 0 ? "Naik" : "Turun" };
  } else if (ap === todayStr) {
    tMonth = data.total_pendapatan_bulan_ini ?? data.totalPendapatanBulanIni ?? 0;
    tWeek = data.total_pendapatan_minggu_ini ?? data.totalPendapatanMingguIni ?? 0;
    dAvg = tMonth / 30;
    const fbComp = data.perbandingan_bulan_ini_vs_lalu || data.perbandinganBulanIniVsLalu || {};
    comp = { bln_ini: tMonth, bln_lalu: fbComp.bulan_lalu ?? data.target_bulan_lalu ?? 0, pct: fbComp.persentase_kenaikan ?? data.persentase_kenaikan_bulanan ?? 0, st: (fbComp.persentase_kenaikan ?? data.persentase_kenaikan_bulanan ?? 0) >= 0 ? "Naik" : "Turun" };
  }

  const isPos = comp.pct >= 0;

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start"><span className="text-xs font-semibold text-[#67737C]">Total Pendapatan Bulan Ini</span><div className="bg-[#F4FBF9] p-1.5 rounded-lg text-[#1B9C90]"><Receipt className="w-4 h-4" /></div></div>
          <h3 className="text-2xl font-black text-[#13222D]">{fmt(tMonth)}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold pt-1">
            <span className={cn("px-2 py-0.5 rounded-md border flex items-center gap-1 uppercase tracking-wide text-[10px] font-black shrink-0", isPos ? "text-[#137333] bg-[#E6F4EA] border-[#CCECD5]" : "text-[#C5221F] bg-[#FCE8E6] border-[#FAD2CF]")}>{isPos ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{Math.abs(comp.pct).toFixed(1)}%</span>
            <span className="text-[#67737C] tracking-tight">vs Bulan Lalu ({fmt(comp.bln_lalu)})</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start"><span className="text-xs font-semibold text-[#67737C]">Rata-rata Pendapatan Harian</span><div className="bg-slate-50 p-1.5 rounded-lg text-slate-500"><Coins className="w-4 h-4" /></div></div>
          <h3 className="text-2xl font-black text-[#13222D]">{fmt(dAvg)}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold pt-1">
            <span className="bg-[#EFF4F8] text-[#67737C] border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wide text-[10px] font-black shrink-0">Estimated</span><span className="text-[#67737C]">Rata-rata per hari bulan ini</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow sm:col-span-2 lg:col-span-1">
        <CardContent className="p-0 space-y-2">
          <div className="flex justify-between items-start"><span className="text-xs font-semibold text-[#67737C]">Total Pendapatan Minggu Ini</span><div className="bg-[#EFF4F8] p-1.5 rounded-lg text-[#67737C]"><Calendar className="w-4 h-4" /></div></div>
          <h3 className="text-2xl font-black text-[#13222D]">{fmt(tWeek)}</h3>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold pt-1">
            <span className="bg-[#DFF6F2] text-[#1B9C90] border border-[#1B9C90]/20 px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wide text-[10px] font-black shrink-0">Current</span><span className="text-[#67737C]">Transaksi minggu berjalan</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}