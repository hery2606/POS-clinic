"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TransactionFilterBarProps {
  onFilterChange?: (filters: { search: string; date: string; status: string; method: string }) => void;
}

export function TransactionFilterBar({ onFilterChange }: TransactionFilterBarProps) {
  const [f, setF] = useState({ search: "", date: "all", status: "all", method: "all" });

  const updateF = (updates: Partial<typeof f>) => {
    const newF = { ...f, ...updates };
    setF(newF);
    onFilterChange?.(newF);
  };

  const filters = [
    { key: "date" as const, placeholder: "Semua Tanggal", opts: [{ v: "all", l: "Semua Tanggal" }, { v: "today", l: "Hari Ini" }, { v: "7d", l: "7 Hari Terakhir" }, { v: "30d", l: "30 Hari Terakhir" }] },
    { key: "status" as const, placeholder: "Status: Semua", opts: [{ v: "all", l: "Status: Semua" }, { v: "success", l: "Sukses" }, { v: "pending", l: "Pending" }, { v: "failed", l: "Gagal" }] },
    { key: "method" as const, placeholder: "Metode: Semua", opts: [{ v: "all", l: "Metode: Semua" }, { v: "qris", l: "QRIS" }, { v: "transfer", l: "Transfer Bank" }, { v: "cash", l: "Tunai" }] }
  ];

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 shadow-sm flex flex-col md:flex-row items-center gap-3 w-full">
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#67737C]" />
        <Input placeholder="Cari ID Transaksi atau Nama Pasien..." value={f.search} onChange={e => updateF({ search: e.target.value })} className="pl-9 h-11 bg-[#F4F7F9] border-none text-xs rounded-xl focus-visible:ring-1 focus-visible:ring-[#1B9C90] shadow-none w-full" />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        {filters.map(filter => (
          <Select key={filter.key} value={f[filter.key]} onValueChange={v => updateF({ [filter.key]: v })}>
            <SelectTrigger className="w-full md:w-40 h-11 bg-[#F4F7F9] border-none text-xs font-medium text-[#13222D] rounded-xl focus:ring-1 focus:ring-[#1B9C90] shadow-none px-4">
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#DFE6EB] bg-white text-xs font-medium text-[#13222D]">
              {filter.opts.map(o => <SelectItem key={o.v} value={o.v} className="rounded-lg">{o.l}</SelectItem>)}
            </SelectContent>
          </Select>
        ))}
      </div>
    </div>
  );
}