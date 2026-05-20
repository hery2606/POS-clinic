"use client";

import  { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TransactionFilterBarProps {
  onFilterChange?: (filters: {
    search: string;
    date: string;
    status: string;
    method: string;
  }) => void;
}

export function TransactionFilterBar({ onFilterChange }: TransactionFilterBarProps) {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("all");
  const [status, setStatus] = useState("all");
  const [method, setMethod] = useState("all");

  const handleFilterUpdate = (updates: { search?: string; date?: string; status?: string; method?: string }) => {
    const updatedFilters = {
      search: updates.search ?? search,
      date: updates.date ?? date,
      status: updates.status ?? status,
      method: updates.method ?? method,
    };
    if (onFilterChange) onFilterChange(updatedFilters);
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 shadow-sm flex flex-col md:flex-row items-center gap-3 w-full">
      
      {/* SEARCH INPUT */}
      <div className="relative w-full md:flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#67737C]" />
        <Input
          placeholder="Cari ID Transaksi atau Nama Pasien..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            handleFilterUpdate({ search: e.target.value });
          }}
          className="pl-9 h-11 bg-[#F4F7F9] border-none text-xs rounded-xl focus-visible:ring-1 focus-visible:ring-[#1B9C90] text-[#13222D] placeholder:text-[#67737C]/60 shadow-none w-full"
        />
      </div>

      {/* FILTER DROPDOWNS */}
      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
        
        {/* DATE FILTER */}
        <Select
          value={date}
          onValueChange={(val) => {
            setDate(val);
            handleFilterUpdate({ date: val });
          }}
        >
          <SelectTrigger className="w-full md:w-40 h-11 bg-[#F4F7F9] border-none text-xs font-medium text-[#13222D] rounded-xl focus:ring-1 focus:ring-[#1B9C90] shadow-none px-4">
            <SelectValue placeholder="Semua Tanggal" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#DFE6EB] bg-white text-xs font-medium text-[#13222D]">
            <SelectItem value="all" className="rounded-lg">Semua Tanggal</SelectItem>
            <SelectItem value="today" className="rounded-lg">Hari Ini</SelectItem>
            <SelectItem value="7d" className="rounded-lg">7 Hari Terakhir</SelectItem>
            <SelectItem value="30d" className="rounded-lg">30 Hari Terakhir</SelectItem>
          </SelectContent>
        </Select>

        {/* STATUS FILTER */}
        <Select
          value={status}
          onValueChange={(val) => {
            setStatus(val);
            handleFilterUpdate({ status: val });
          }}
        >
          <SelectTrigger className="w-full md:w-40 h-11 bg-[#F4F7F9] border-none text-xs font-medium text-[#13222D] rounded-xl focus:ring-1 focus:ring-[#1B9C90] shadow-none px-4">
            <SelectValue placeholder="Status: Semua" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#DFE6EB] bg-white text-xs font-medium text-[#13222D]">
            <SelectItem value="all" className="rounded-lg">Status: Semua</SelectItem>
            <SelectItem value="success" className="rounded-lg">Sukses</SelectItem>
            <SelectItem value="pending" className="rounded-lg">Pending</SelectItem>
            <SelectItem value="failed" className="rounded-lg">Gagal</SelectItem>
          </SelectContent>
        </Select>

        {/* METHOD FILTER */}
        <Select
          value={method}
          onValueChange={(val) => {
            setMethod(val);
            handleFilterUpdate({ method: val });
          }}
        >
          <SelectTrigger className="w-full md:w-40 h-11 bg-[#F4F7F9] border-none text-xs font-medium text-[#13222D] rounded-xl focus:ring-1 focus:ring-[#1B9C90] shadow-none px-4">
            <SelectValue placeholder="Metode: Semua" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#DFE6EB] bg-white text-xs font-medium text-[#13222D]">
            <SelectItem value="all" className="rounded-lg">Metode: Semua</SelectItem>
            <SelectItem value="qris" className="rounded-lg">QRIS</SelectItem>
            <SelectItem value="transfer" className="rounded-lg">Transfer Bank</SelectItem>
            <SelectItem value="cash" className="rounded-lg">Tunai</SelectItem>
          </SelectContent>
        </Select>

      </div>
    </div>
  );
}