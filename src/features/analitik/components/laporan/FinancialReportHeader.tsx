"use client";

import { Calendar, Download, FileSpreadsheet } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FinancialReportHeaderProps {
  onPeriodChange?: (value: string) => void;
  onDownloadPDF?: () => void;
  onExportExcel?: () => void;
}

export function FinancialReportHeader({
  onPeriodChange,
  onDownloadPDF,
  onExportExcel,
}: FinancialReportHeaderProps) {
  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#13222D]">
          Laporan Keuangan
        </h2>
        <p className="text-sm font-medium text-[#67737C]">
          Analisa Pendapatan, Pengeluaran, dan Arus Kas
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <Select defaultValue="2023-11" onValueChange={onPeriodChange}>
          <SelectTrigger className="w-full sm:w-45 h-11 bg-[#F4F7F9] border-none text-xs font-medium text-[#13222D] rounded-xl focus:ring-1 focus:ring-[#1B9C90] shadow-none px-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#67737C]" />
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#DFE6EB] bg-white text-xs font-medium text-[#13222D]">
            <SelectItem value="2023-11" className="rounded-lg">November 2023</SelectItem>
            <SelectItem value="2023-10" className="rounded-lg">Oktober 2023</SelectItem>
            <SelectItem value="2023-09" className="rounded-lg">September 2023</SelectItem>
          </SelectContent>
        </Select>

        <Button
          onClick={onDownloadPDF}
          variant="outline"
          className="w-full sm:w-auto border-[#DFE6EB] text-[#13222D] hover:bg-[#F4F7F9] font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-none text-xs px-4"
        >
          <Download className="w-4 h-4 text-[#67737C]" />
          <span>Unduh PDF</span>
        </Button>

        <Button
          onClick={onExportExcel}
          className="w-full sm:w-auto bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold h-11 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors border-none shadow-none text-xs"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Excel</span>
        </Button>
      </div>

    </div>
  );
}