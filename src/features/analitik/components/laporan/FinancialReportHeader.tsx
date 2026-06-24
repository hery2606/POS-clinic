"use client";

import { Calendar, Download, FileSpreadsheet, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface FinancialReportHeaderProps {
  selectedPeriod?: string;
  onPeriodChange?: (value: string) => void;
  onDownloadPDF?: () => void;
  onExportExcel?: () => void;
}

const generatePeriodOptions = () => {
  const options = [];
  const currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth();
  
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  for (let i = 0; i < 60; i++) {
    const monthStr = String(month + 1).padStart(2, "0");
    options.push({
      value: `${year}-${monthStr}`,
      label: `${monthNames[month]} ${year}`
    });
    
    month--;
    if (month < 0) {
      month = 11;
      year--;
    }
  }
  return options;
};

export const periodOptions = generatePeriodOptions();

export function FinancialReportHeader({
  selectedPeriod,
  onPeriodChange,
  onDownloadPDF,
  onExportExcel,
}: FinancialReportHeaderProps) {
  const today = new Date();
  const defaultYear = String(today.getFullYear());
  const defaultMonth = String(today.getMonth() + 1).padStart(2, "0");

  // Parse current year and month from selectedPeriod prop
  const [currentYear, currentMonth] = (selectedPeriod || "").split("-");
  const activeYear = currentYear || defaultYear;
  const activeMonth = currentMonth || defaultMonth;

  const isCurrentPeriod = activeYear === defaultYear && activeMonth === defaultMonth;

  // Generate 5 years options backwards from current year
  const currentYearInt = today.getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => String(currentYearInt - i));

  const monthOptions = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  const handleYearChange = (newYear: string) => {
    onPeriodChange?.(`${newYear}-${activeMonth}`);
  };

  const handleMonthChange = (newMonth: string) => {
    onPeriodChange?.(`${activeYear}-${newMonth}`);
  };

  const handleResetToToday = () => {
    onPeriodChange?.(`${defaultYear}-${defaultMonth}`);
  };

  const handleDownloadPDF = () => {
    const periodValue = selectedPeriod || `${activeYear}-${activeMonth}`;
    if (onDownloadPDF) {
      onDownloadPDF();
    } else {
      const element = document.createElement("a");
      const file = new Blob(
        [
          `Laporan Keuangan\n\nPeriode: ${periodValue}\nTanggal Export: ${new Date().toLocaleDateString("id-ID")}`,
        ],
        { type: "text/plain" }
      );
      element.href = URL.createObjectURL(file);
      element.download = `laporan-keuangan-${periodValue}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  const handleExportExcel = () => {
    const periodValue = selectedPeriod || `${activeYear}-${activeMonth}`;
    if (onExportExcel) {
      onExportExcel();
    } else {
      alert(`Export Excel untuk periode ${periodValue} akan segera dikembangkan`);
    }
  };

  const activeMonthLabel = monthOptions.find((m) => m.value === activeMonth)?.label || "";

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full">
      <div className="space-y-1">
        <h2 className="text-xl font-bold text-[#13222D]">
          Laporan Keuangan
        </h2>
        <p className="text-sm font-medium text-[#67737C]">
          Analisa Pendapatan, Pengeluaran, dan Arus Kas - Periode: {activeMonthLabel} {activeYear}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full xl:w-auto">
        <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full lg:w-auto">
          {/* Shortcut Button Hari Ini */}
          <Button
            onClick={handleResetToToday}
            variant="outline"
            className={cn(
              "h-11 rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-none text-xs px-2 sm:px-4 font-bold border w-full sm:w-auto",
              isCurrentPeriod
                ? "bg-[#1B9C90] text-white border-transparent hover:bg-[#157A71]"
                : "bg-[#F4F7F9] border-transparent text-[#67737C] hover:bg-[#DFE6EB] hover:text-[#13222D]"
            )}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span className="truncate">Hari Ini</span>
          </Button>

          {/* Dropdown Pilih Bulan */}
          <Select value={activeMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-full sm:w-36 h-11 bg-[#F4F7F9] border-none text-xs font-semibold text-[#13222D] rounded-xl focus:ring-1 focus:ring-[#1B9C90] shadow-none px-2 sm:px-4 flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
              <Calendar className="w-4 h-4 text-[#67737C] shrink-0" />
              <SelectValue placeholder="Bulan" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#DFE6EB] bg-white text-xs font-medium text-[#13222D]">
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-lg">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Dropdown Pilih Tahun */}
          <Select value={activeYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-full sm:w-28 h-11 bg-[#F4F7F9] border-none text-xs font-semibold text-[#13222D] rounded-xl focus:ring-1 focus:ring-[#1B9C90] shadow-none px-2 sm:px-4 flex items-center justify-center sm:justify-start gap-1 sm:gap-2">
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-[#DFE6EB] bg-white text-xs font-medium text-[#13222D]">
              {yearOptions.map((yearOpt) => (
                <SelectItem key={yearOpt} value={yearOpt} className="rounded-lg">
                  {yearOpt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-row items-center gap-2 w-full lg:w-auto">
          <Button
            onClick={handleDownloadPDF}
            variant="outline"
            className="flex-1 lg:flex-none border-[#DFE6EB] text-[#13222D] hover:bg-[#F4F7F9] font-bold h-11 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-none text-xs px-4"
          >
            <Download className="w-4 h-4 text-[#67737C] shrink-0" />
            <span className="truncate">Unduh PDF</span>
          </Button>

          <Button
            onClick={handleExportExcel}
            className="flex-1 lg:flex-none bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold h-11 px-5 rounded-xl flex items-center justify-center gap-2 transition-colors border-none shadow-none text-xs"
          >
            <FileSpreadsheet className="w-4 h-4 shrink-0" />
            <span className="truncate">Export Excel</span>
          </Button>
        </div>
      </div>
    </div>
  );
}