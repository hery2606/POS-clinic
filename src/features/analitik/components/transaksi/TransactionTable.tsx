"use client";

import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { billingPosService } from "@/features/kasir/services/billing.pos.service";

interface Props { filters: { search: string; date: string; status: string; method: string }; onSelectTransaction: (id: string) => void; selectedId: string | null; }

export function TransactionTable({ filters: f, onSelectTransaction: onSelect, selectedId: selId }: Props) {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError, refetch } = useQuery({ queryKey: ['billingTransactions'], queryFn: () => billingPosService.getAllTransactions() });
  
  useEffect(() => setPage(1), [f]);

  const filtered = useMemo(() => {
    let r = data?.data || [];
    if (f.search) {
      const q = f.search.toLowerCase().trim();
      r = r.filter((t: any) => String(t.id).toLowerCase().includes(q) || t.patient?.name?.toLowerCase().includes(q));
    }
    if (f.status !== 'all') r = r.filter((t: any) => f.status === 'success' ? t.status === 'LUNAS' : f.status === 'pending' ? ['PENDING_PAYMENT', 'PARTIAL'].includes(t.status) : false);
    if (f.method !== 'all') r = r.filter((t: any) => (t.paymentMethod || '').toLowerCase() === f.method || (t.paidMethods || []).some((m: string) => m.toLowerCase() === f.method));
    if (f.date !== 'all') {
      const n = new Date().getTime();
      r = r.filter((t: any) => {
        const diff = Math.ceil(Math.abs(n - new Date(t.createdAt).getTime()) / 86400000);
        return f.date === 'today' ? new Date(t.createdAt).toDateString() === new Date().toDateString() : f.date === '7d' ? diff <= 7 : f.date === '30d' ? diff <= 30 : true;
      });
    }
    return r.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [data?.data, f]);

  useEffect(() => { if (!selId && filtered.length > 0) onSelect(filtered[0].id); }, [filtered, selId, onSelect]);

  const limit = 8;
  const total = filtered.length;
  const pages = Math.ceil(total / limit) || 1;
  const start = (page - 1) * limit;
  const list = filtered.slice(start, start + limit);

  const getSt = (s: string) => s === 'LUNAS' ? { l: 'Sukses', c: 'bg-[#DFF6F2] text-[#1B9C90]' } : s === 'PARTIAL' ? { l: 'Partial', c: 'bg-orange-50 text-orange-500' } : { l: 'Pending', c: 'bg-[#FFF9EB] text-[#F2A618]' };
  const getMet = (m: string, pm?: string[]) => pm?.length && pm.length > 1 ? pm.join(' + ') : m || 'TUNAI';

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full flex flex-col justify-between h-full">
      <div className="w-full">
        <div className="p-6 border-b border-[#DFE6EB] flex items-baseline gap-2"><h3 className="text-base font-bold text-[#13222D]">Daftar Transaksi</h3><span className="text-xs font-medium text-[#67737C]">{isLoading ? "Memuat..." : `Menampilkan ${list.length} dari ${total} data`}</span></div>
        <div className="overflow-x-auto w-full">
          <Table className="w-full min-w-[600px] table-fixed">
            <TableHeader>
              <TableRow className="bg-[#F4F7F9] hover:bg-[#F4F7F9] border-none">
                {['ID TRANSAKSI', 'NAMA PASIEN', 'TANGGAL', 'TOTAL', 'METODE', 'STATUS'].map((h, i) => <TableHead key={i} className={`text-xs font-bold text-[#67737C] h-12 text-left ${i === 0 ? 'pl-6 w-[22%]' : i === 5 ? 'pr-6 w-[10%]' : i === 1 ? 'w-[25%]' : i === 2 ? 'w-[18%]' : i === 3 ? 'w-[15%]' : 'w-[10%]'}`}>{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? Array.from({ length: limit }).map((_, i) => <TableRow key={i} className="border-b border-[#DFE6EB]"><TableCell className="pl-6 py-4"><Skeleton className="h-4 w-5/6" /></TableCell><TableCell className="py-4"><Skeleton className="h-4 w-4/5" /></TableCell><TableCell className="py-4"><Skeleton className="h-4 w-3/4" /></TableCell><TableCell className="py-4"><Skeleton className="h-4 w-1/2" /></TableCell><TableCell className="py-4"><Skeleton className="h-4 w-12" /></TableCell><TableCell className="pr-6 py-4"><Skeleton className="h-5 w-16 rounded-full" /></TableCell></TableRow>)
              : isError ? <TableRow><TableCell colSpan={6} className="text-center py-8 text-red-500 font-semibold">Gagal mengambil data. <button onClick={() => refetch()} className="underline text-[#1B9C90]">Coba lagi</button></TableCell></TableRow>
              : list.length > 0 ? list.map((t: any) => {
                const st = getSt(t.status);
                return (
                  <TableRow key={t.id} onClick={() => onSelect(t.id)} className={`border-b border-[#DFE6EB] cursor-pointer hover:bg-[#F9FEFC] ${selId === t.id ? "bg-[#F9FEFC] font-semibold border-l-4 border-l-[#1B9C90]" : ""}`}>
                    <TableCell className="pl-6 py-4 text-xs font-bold text-[#13222D] truncate" title={String(t.id)}>{String(t.id).slice(0, 8).toUpperCase()}...</TableCell>
                    <TableCell className="py-4 text-sm font-semibold text-[#13222D] truncate">{t.patient?.name || "Pasien Umum"}</TableCell>
                    <TableCell className="py-4 text-xs font-medium text-[#67737C]">{new Date(t.createdAt).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</TableCell>
                    <TableCell className="py-4 text-sm font-bold text-[#13222D]">Rp {Number(t.total || 0).toLocaleString("id-ID")}</TableCell>
                    <TableCell className="py-4 text-xs font-semibold text-[#13222D] uppercase truncate" title={getMet(t.paymentMethod, t.paidMethods)}>{getMet(t.paymentMethod, t.paidMethods)}</TableCell>
                    <TableCell className="pr-6 py-4"><Badge className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold border-none uppercase ${st.c}`}>{st.l}</Badge></TableCell>
                  </TableRow>
                );
              }) : <TableRow><TableCell colSpan={6} className="text-center py-8 text-[#67737C]"><Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />Tidak ada transaksi</TableCell></TableRow>}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-medium text-[#67737C]">Menampilkan <span className="text-[#13222D] font-bold">{total > 0 ? start + 1 : 0} - {Math.min(start + limit, total)}</span> dari <span className="text-[#13222D] font-bold">{total}</span> data</span>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1 || isLoading} className="h-8 w-8 p-0 rounded-lg text-[#67737C] disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></Button>
          {Array.from({ length: pages }).map((_, i) => <Button key={i} variant="outline" onClick={() => setPage(i + 1)} className={`h-8 px-3 rounded-lg text-xs font-bold border-none shadow-none ${page === i + 1 ? "bg-[#13272F]/5 text-[#1B9C90]" : "text-[#67737C] hover:bg-[#F4F7F9]"}`}>{i + 1}</Button>)}
          <Button variant="outline" onClick={() => setPage(p => Math.min(p + 1, pages))} disabled={page === pages || isLoading} className="h-8 w-8 p-0 rounded-lg text-[#67737C] disabled:opacity-40"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
    </div>
  );
}