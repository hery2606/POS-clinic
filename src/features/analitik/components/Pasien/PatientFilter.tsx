"use client"

import { Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface FilterState { status: string[]; gender: string[]; hasBpjs: string[]; }

export const PatientFilter = ({ filters: f, onFilterChange: chg, onClearAll: clr }: { filters: FilterState; onFilterChange: (t: keyof FilterState, v: string) => void; onClearAll: () => void; }) => {
  const iF = f.status.length > 0 || f.gender.length > 0 || f.hasBpjs.length > 0, tF = f.status.length + f.gender.length + f.hasBpjs.length;
  const c = { status: 'bg-green-100 text-green-700 border-green-300', gender: 'bg-yellow-100 text-yellow-700 border-yellow-300', hasBpjs: 'bg-blue-100 text-blue-700 border-blue-300' };

  return (
    <div className="flex flex-col gap-3 w-full md:w-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={iF ? "default" : "outline"} className={cn("gap-2 h-10 rounded-lg whitespace-nowrap", iF && "bg-teal-600 hover:bg-teal-700 border-teal-600")}><Filter className="w-4 h-4" />Filter {iF && <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-0">{tF}</Badge>}</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-xs font-semibold uppercase">Status Pasien</DropdownMenuLabel>
          {['AKTIF', 'TIDAK AKTIF'].map(s => <DropdownMenuCheckboxItem key={s} checked={f.status.includes(s)} onCheckedChange={() => chg('status', s)} className="cursor-pointer text-sm">{s}</DropdownMenuCheckboxItem>)}
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuLabel className="text-xs font-semibold uppercase">Jenis Kelamin</DropdownMenuLabel>
          {[{ v: 'LAKI_LAKI', l: 'Laki-laki' }, { v: 'PEREMPUAN', l: 'Perempuan' }].map(x => <DropdownMenuCheckboxItem key={x.v} checked={f.gender.includes(x.v)} onCheckedChange={() => chg('gender', x.v)} className="cursor-pointer text-sm">{x.l}</DropdownMenuCheckboxItem>)}
          <DropdownMenuSeparator className="my-2" />
          <DropdownMenuLabel className="text-xs font-semibold uppercase">Asuransi BPJS</DropdownMenuLabel>
          {[{ v: 'ADA', l: 'Ada BPJS' }, { v: 'TIDAK_ADA', l: 'Tanpa BPJS' }].map(x => <DropdownMenuCheckboxItem key={x.v} checked={f.hasBpjs.includes(x.v)} onCheckedChange={() => chg('hasBpjs', x.v)} className="cursor-pointer text-sm">{x.l}</DropdownMenuCheckboxItem>)}
          {iF && <><DropdownMenuSeparator className="my-2" /><button onClick={clr} className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors">Hapus Semua Filter</button></>}
        </DropdownMenuContent>
      </DropdownMenu>

      {iF && (
        <div className="flex flex-wrap gap-2">
          {f.status.map(v => <Badge key={`s-${v}`} variant="outline" className={`px-2.5 py-1 text-xs font-medium border cursor-pointer transition-all hover:shadow-md rounded-full ${c.status}`} onClick={() => chg('status', v)}>{v} <X className="w-3 h-3 ml-1.5" /></Badge>)}
          {f.gender.map(v => <Badge key={`g-${v}`} variant="outline" className={`px-2.5 py-1 text-xs font-medium border cursor-pointer transition-all hover:shadow-md rounded-full ${c.gender}`} onClick={() => chg('gender', v)}>{v === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan'} <X className="w-3 h-3 ml-1.5" /></Badge>)}
          {f.hasBpjs.map(v => <Badge key={`b-${v}`} variant="outline" className={`px-2.5 py-1 text-xs font-medium border cursor-pointer transition-all hover:shadow-md rounded-full ${c.hasBpjs}`} onClick={() => chg('hasBpjs', v)}>{v === 'ADA' ? 'Ada BPJS' : 'Tanpa BPJS'} <X className="w-3 h-3 ml-1.5" /></Badge>)}
        </div>
      )}
    </div>
  );
};
