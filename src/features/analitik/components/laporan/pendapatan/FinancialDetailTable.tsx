"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BreakdownTabType } from "../../laporan/pendapatan/FinancialBreakdownCard";
import { analitikService } from "../../../services/analitik.service";

export const tableConfigs: Record<BreakdownTabType, { title: string; headers: string[]; w: string[] }> = {
  Pendapatan: { title: "Rincian Pendapatan Harian", headers: ["TANGGAL", "TOTAL TRANSAKSI", "PENDAPATAN LAYANAN", "PENDAPATAN OBAT", "TOTAL PENDAPATAN"], w: ["w-[20%]", "w-[15%]", "w-[22%]", "w-[22%]", "w-[21%]"] },
  Pengeluaran: { title: "Rincian Pengeluaran Klinis", headers: ["TANGGAL", "KATEGORI", "KETERANGAN", "METODE", "TOTAL PENGELUARAN"], w: ["w-[20%]", "w-[20%]", "w-[25%]", "w-[15%]", "w-[20%]"] },
  "Laba Rugi": { title: "Ikhtisar Performa Laba Rugi", headers: ["PERIODE", "TOTAL PENDAPATAN", "TOTAL PENGELUARAN", "LABA BERSIH", "MARGIN"], w: ["w-[20%]", "w-[22%]", "w-[22%]", "w-[21%]", "w-[15%]"] },
  Neraca: { title: "Daftar Saldo Akun Neraca", headers: ["KODE AKUN", "NAMA AKUN", "KATEGORI", "SALDO AWAL", "SALDO AKHIR"], w: ["w-[15%]", "w-[25%]", "w-[20%]", "w-[20%]", "w-[20%]"] },
  "Arus Kas": { title: "Buku Jurnal Arus Kas (Cash Flow)", headers: ["TANGGAL", "KETERANGAN", "KAS MASUK", "KAS KELUAR", "SALDO AKHIR"], w: ["w-[20%]", "w-[25%]", "w-[18%]", "w-[18%]", "w-[19%]"] }
};

export const dummyTableData: Record<string, any[]> = {
  Pendapatan: [],
  Pengeluaran: [],
  "Laba Rugi": [],
  Neraca: [],
  "Arus Kas": []
};
const fmt = (a: number) => a >= 1e6 ? `Rp ${(a / 1e6).toFixed(1)}M` : a >= 1e3 ? `Rp ${(a / 1e3).toFixed(1)}K` : `Rp ${a}`;
const fmtFull = (a: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(a);
const tdStr = () => { const d = new Date(); return `${d.getDate()} ${["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"][d.getMonth()]} ${d.getFullYear()}`; };

export function FinancialDetailTable({ activeTab: t, onViewAllClick, period }: { activeTab: BreakdownTabType; onViewAllClick?: () => void; period?: string }) {
  const qCash = useQuery({ queryKey: ["cashflowSummary"], queryFn: () => analitikService.getCashflowSummary(), staleTime: 300000, enabled: t === "Arus Kas" });
  const qRev = useQuery({ queryKey: ["revenueTrendData"], queryFn: () => analitikService.getRevenueTrend(), staleTime: 300000, enabled: t === "Pendapatan" });

  const ap = period || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;

  const rows: any[] = useMemo(() => {
    if (t === "Arus Kas") {
      if (!qCash.data?.data) return [];
      const c = qCash.data.data, out = Math.max(0, c.kas_masuk_harian * 0.4);
      return [{ c1: tdStr(), c2: `${c.total_transaksi_lunas_hari_ini || 0} Transaksi Lunas`, c3: fmt(c.kas_masuk_harian), c4: fmt(out), c5: fmt(c.kas_masuk_harian + (c.nilai_total_invoice_belum_lunas || 0)), hi: true }, { c1: tdStr(), c2: `${c.total_transaksi_pending_hari_ini || 0} Transaksi Pending`, c3: "Rp 0", c4: fmt(c.nilai_total_invoice_belum_lunas || 0), c5: fmt(c.nilai_total_invoice_belum_lunas || 0) }];
    }
    if (t === "Pendapatan") {
      const ms = (qRev.data?.data?.tabel_rincian_harian || []).filter((i: any) => i.tanggal?.startsWith(ap));
      if (!ms.length) return [];
      return ms.sort((a, b) => b.tanggal.localeCompare(a.tanggal)).map((m: any, i: number) => ({ c1: new Date(m.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }), c2: m.total_transaksi || 0, c3: fmtFull(m.pendapatan_layanan || 0), c4: fmtFull(m.pendapatan_obat || 0), c5: fmtFull(m.total_pendapatan || 0), hi: i === 0 }));
    }
    return [];
  }, [t, ap, qCash.data, qRev.data]);

  const cfg = tableConfigs[t] || tableConfigs.Pendapatan;

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full flex flex-col justify-between">
      <div className="p-4 sm:p-6 border-b border-[#DFE6EB] flex items-center justify-between"><h3 className="text-base font-bold text-[#13222D]">{cfg.title}</h3><Button onClick={onViewAllClick} variant="ghost" className="text-xs font-bold text-[#1B9C90] hover:text-[#157A71] hover:bg-[#F9FEFC] px-3 h-8 rounded-lg transition-colors">Lihat Selengkapnya</Button></div>
      <div className="overflow-x-auto w-full">
        <Table className="w-full min-w-[800px] table-fixed">
          <TableHeader><TableRow className="bg-[#F4F7F9] hover:bg-[#F4F7F9] border-none">{cfg.headers.map((h, i) => <TableHead key={i} className={cn("text-xs font-bold text-[#67737C] h-12 text-left", i === 0 && "pl-4 sm:pl-6", i === cfg.headers.length - 1 && "pr-4 sm:pr-6", cfg.w[i])}>{h}</TableHead>)}</TableRow></TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i} className="border-b border-[#DFE6EB] last:border-none hover:bg-[#F9FEFC]">
                <TableCell className="pl-4 sm:pl-6 py-4 text-xs font-bold text-[#13222D] text-left">{r.c1}</TableCell>
                <TableCell className="py-4 text-sm font-medium text-[#67737C] text-left truncate">{r.c2}</TableCell>
                <TableCell className="py-4 text-sm font-medium text-[#67737C] text-left">{r.c3}</TableCell>
                <TableCell className="py-4 text-sm font-medium text-[#67737C] text-left">{r.c4}</TableCell>
                <TableCell className={cn("py-4 text-sm text-left", i === 0 && "pr-4 sm:pr-6")}>{r.bdg ? <Badge className="bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#DFF6F2] font-bold border-none shadow-none rounded-full px-2.5 py-0.5 text-xs">{r.c5}</Badge> : <span className={cn("font-bold", r.hi || t === "Pendapatan" || t === "Laba Rugi" ? "text-[#1B9C90]" : "text-[#13222D]")}>{r.c5}</span>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="px-4 py-4 sm:px-6 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-medium text-[#67737C]">Menampilkan <span className="text-[#13222D] font-bold">1 - {rows.length}</span> dari <span className="text-[#13222D] font-bold">48</span> data entri</span>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" disabled className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></Button>
          <Button variant="outline" className="h-8 px-3 rounded-lg text-xs font-bold bg-[#13272F]/5 border-none text-[#1B9C90] shadow-none">1</Button>
          <Button variant="outline" className="h-8 px-3 rounded-lg text-xs font-bold border-none text-[#67737C] hover:bg-[#F4F7F9] shadow-none">2</Button>
          <Button variant="outline" className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] hover:bg-[#F4F7F9]"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}