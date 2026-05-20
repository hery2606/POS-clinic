"use client";

import { useState } from "react";
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
  selectedPeriod?: string;
  onPeriodChange?: (value: string) => void;
  onDownloadPDF?: () => void;
  onExportExcel?: () => void;
}

const periodOptions = [
  { value: "2026-05", label: "Mei 2026" },
  { value: "2026-04", label: "April 2026" },
  { value: "2026-03", label: "Maret 2026" },
  { value: "2026-02", label: "Februari 2026" },
  { value: "2026-01", label: "Januari 2026" },
  { value: "2025-12", label: "Desember 2025" },
  { value: "2025-11", label: "November 2025" },
  { value: "2025-10", label: "Oktober 2025" },
];

export function FinancialReportHeader({
  selectedPeriod = "2026-05",
  onPeriodChange,
  onDownloadPDF,
  onExportExcel,
}: FinancialReportHeaderProps) {
  const [period, setPeriod] = useState(selectedPeriod);

  const handlePeriodChange = (value: string) => {
    setPeriod(value);
    onPeriodChange?.(value);
  };

  const handleDownloadPDF = () => {
    if (onDownloadPDF) {
      onDownloadPDF();
    } else {
      // Default: create a simple text file
      const element = document.createElement("a");
      const file = new Blob(
        [
          `Laporan Keuangan\n\nPeriode: ${period}\nTanggal Export: ${new Date().toLocaleDateString("id-ID")}`,
        ],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
      element.download = `laporan-keuangan-${period}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleExportExcel = () => {
    if (onExportExcel) {
      onExportExcel();
    } else {
      // Default: show alert
      alert(`Export Excel untuk periode ${period} akan segera dikembangkan`);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#13222D]">
          Laporan Keuangan
        </h2>
        <p className="text-sm font-medium text-[#67737C]">
          Analisa Pendapatan, Pengeluaran, dan Arus Kas - Periode: {
            periodOptions.find((p) => p.value === period)?.label || period
          }
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <Select value={period} onValueChange={handlePeriodChange}>
          <SelectTrigger className="w-full sm:w-auto h-11 bg-[#F4F7F9] border-none text-xs font-medium text-[#13222D] rounded-xl focus:ring-1 focus:ring-[#1B9C90] shadow-none px-4 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-[#67737C]" />
            <SelectValue placeholder="Pilih Periode" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-[#DFE6EB] bg-white text-xs font-medium text-[#13222D]">
            {periodOptions.map((option) => (
              <SelectItem key={option.value} value={option.value} className="rounded-lg">
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          onClick={handleDownloadPDF}
          variant="outline"
          className="w-full sm:w-auto border-[#DFE6EB] text-[#13222D] hover:bg-[#F4F7F9] font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-none text-xs px-4"
        >
          <Download className="w-4 h-4 text-[#67737C]" />
          <span>Unduh PDF</span>
        </Button>

        <Button
          onClick={handleExportExcel}
          className="w-full sm:w-auto bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold h-11 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors border-none shadow-none text-xs"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Excel</span>
        </Button>
      </div>
    </div>
  );
}