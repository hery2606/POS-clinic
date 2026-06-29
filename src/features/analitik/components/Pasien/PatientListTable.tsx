"use client";

import { useMemo, useState } from 'react';
import { Search, Phone, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { analitikService } from '../../services/analitik.service';
import { useQuery } from '@tanstack/react-query';
import { PatientDetailModal } from './PatientDetailModal';
import { PatientFilter, type FilterState } from './PatientFilter';

export const PatientListTable = () => {
  const [s, setS] = useState(''), [p, setP] = useState(1), [sel, setSel] = useState<any>(null), [m, setM] = useState(false);
  const [f, setF] = useState<FilterState>({ status: [], gender: [], hasBpjs: [] });
  const lim = 10;

  const { data: res, isLoading: load, error: err, isFetching: fetch } = useQuery({ queryKey: ['patients', p, s, f], queryFn: async () => (await analitikService.getAllPatients({ page: p, limit: lim, search: s.trim() || undefined, status: f.status.join(',') || undefined, gender: f.gender.join(',') || undefined, hasBpjs: f.hasBpjs.join(',') || undefined })).data, staleTime: 30000 });

  const pd = res?.data || [], tp = res?.meta?.totalPages || 1, tt = res?.meta?.total || pd.length;

  const cp = useMemo(() => pd.map((x: any) => ({ ...x, namaLengkap: x.namaLengkap || "N/A", initial: (x.namaLengkap || "N").charAt(0).toUpperCase(), phone: x.telepon || '-' })), [pd]);

  const chg = (k: keyof FilterState, v: string) => { setF(x => ({ ...x, [k]: x[k].includes(v) ? x[k].filter(i => i !== v) : [...x[k], v] })); setP(1); };

  if (err) return <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm w-full"><div className="p-8 text-center text-red-600 font-semibold">Gagal Memuat Data Pasien.</div></div>;

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full relative">
      <div className="p-6 flex flex-col gap-4 border-b border-[#DFE6EB]">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="relative w-full md:max-w-md group"><Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#67737C] group-focus-within:text-[#1B9C90] transition-colors" /><Input placeholder="Cari nama pasien atau nomor RM..." value={s} onChange={(e) => { setS(e.target.value); setP(1); }} className="pl-12 h-11 rounded-xl bg-[#F4F7F9] border-none focus-visible:ring-1 focus-visible:ring-[#1B9C90] text-sm font-medium text-[#13222D]" /></div>
          <PatientFilter filters={f} onFilterChange={chg} onClearAll={() => { setF({ status: [], gender: [], hasBpjs: [] }); setP(1); }} />
        </div>
      </div>
      <div className="overflow-x-auto min-h-[200px] relative">
        {fetch && !load && <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center z-10 transition-all"><Loader2 className="w-8 h-8 text-[#1B9C90] animate-spin" /></div>}
        <Table>
          <TableHeader><TableRow className="bg-[#EFF4F8] hover:bg-[#EFF4F8] border-none"><TableHead className="pl-8 text-[#67737C] font-bold h-12 text-left text-xs uppercase tracking-wider">Nama Pasien</TableHead><TableHead className="text-[#67737C] font-bold h-12 text-left text-xs uppercase tracking-wider">No RM</TableHead><TableHead className="text-[#67737C] font-bold h-12 text-left text-xs uppercase tracking-wider">Telepon</TableHead><TableHead className="text-center text-[#67737C] font-bold h-12 text-xs uppercase tracking-wider">Status</TableHead><TableHead className="pr-8 text-center text-[#67737C] font-bold h-12 text-xs uppercase tracking-wider">Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
            {load ? Array.from({ length: 5 }).map((_, i) => <TableRow key={i} className="border-b border-[#DFE6EB]"><TableCell className="pl-8 py-4"><div className="flex gap-3"><Skeleton className="w-9 h-9 rounded-full shrink-0" /><Skeleton className="h-4 w-32 mt-2" /></div></TableCell><TableCell className="py-4"><Skeleton className="h-4 w-24" /></TableCell><TableCell className="py-4"><Skeleton className="h-4 w-28" /></TableCell><TableCell className="text-center py-4"><Skeleton className="h-5 w-16 mx-auto rounded-full" /></TableCell><TableCell className="pr-8 text-center py-4"><Skeleton className="h-8 w-16 mx-auto rounded-xl" /></TableCell></TableRow>) : !cp.length ? <TableRow><TableCell colSpan={5} className="text-center py-10 text-xs font-bold text-[#67737C]">Tidak ada data pasien ditemukan.</TableCell></TableRow> : cp.map((x) => (
              <TableRow key={x.id} className="border-b border-[#DFE6EB] transition-colors hover:bg-[#F9FEFC]">
                <TableCell className="pl-8 py-4"><div className="flex items-center gap-3"><div className="w-9 h-9 rounded-full bg-[#DFF6F2] text-[#00736A] flex items-center justify-center font-bold text-sm border border-[#DFE6EB]">{x.initial}</div><span className="font-bold text-[#13222D] text-sm">{x.namaLengkap}</span></div></TableCell>
                <TableCell className="text-[#13222D] font-medium text-sm py-4">{x.noRm}</TableCell>
                <TableCell className="text-[#67737C] font-medium text-sm py-4"><div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{x.phone}</div></TableCell>
                <TableCell className="text-center py-4"><Badge className={cn("rounded-full px-3 py-0.5 text-[10px] font-bold border-none shadow-none uppercase tracking-wider", x.isActive ? "bg-[#DFF6F2] text-[#1B9C90]" : "bg-[#EFF4F8] text-[#67737C]")}>{x.isActive ? 'AKTIF' : 'TIDAK AKTIF'}</Badge></TableCell>
                <TableCell className="pr-8 text-center py-4"><Button onClick={() => { setSel(x); setM(true); }} className="h-8 rounded-xl px-5 text-xs font-bold bg-[#1B9C90] hover:bg-[#157A71] text-white border-none shadow-none">Lihat</Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="px-6 py-4 border-t border-[#DFE6EB] flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#F9FEFC]/30">
        <span className="text-xs font-medium text-[#67737C]">Menampilkan <span className="text-[#13222D] font-bold">{tt ? (p - 1) * lim + 1 : 0} - {Math.min(p * lim, tt)}</span> dari <span className="text-[#13222D] font-bold">{tt}</span> entri</span>
        <div className="flex gap-1.5">
          <Button variant="outline" disabled={p === 1} onClick={() => p > 1 && setP(p - 1)} className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] shadow-none hover:bg-slate-50"><ChevronLeft className="w-4 h-4" /></Button>
          {Array.from({ length: Math.min(5, tp) }, (_, i) => { const n = p > 3 ? Math.min(tp - 4, p - 2) + i : i + 1; return <Button key={n} variant="outline" onClick={() => setP(n)} className={cn("h-8 px-3 rounded-lg text-xs font-bold border-none shadow-none", p === n ? "bg-[#13272F]/5 text-[#1B9C90]" : "text-[#67737C] hover:bg-[#F4F7F9]")}>{n}</Button>; })}
          <Button variant="outline" disabled={p === tp || !cp.length} onClick={() => p < tp && setP(p + 1)} className="h-8 w-8 p-0 rounded-lg border-[#DFE6EB] text-[#67737C] shadow-none hover:bg-[#F4F7F9]"><ChevronRight className="w-4 h-4" /></Button>
        </div>
      </div>
      <PatientDetailModal isOpen={m} onClose={() => { setM(false); setSel(null); }} patient={sel} patientId={sel?.id} />
    </div>
  );
};