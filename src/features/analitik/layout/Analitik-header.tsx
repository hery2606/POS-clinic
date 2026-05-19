"use client";

import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Calendar as CalendarIcon, Sparkles, Download, ChevronDown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VisualSummaryModal } from "@/features/analitik/ui/VisualSummaryModal";
import { periodOptions, monthOptions, yearOptions, type PeriodType } from "./periodOptionsConfig";

export const AnalitikHeader = () => {
  const location = useLocation();
  const isLaporanPage = location.pathname.includes("laporan");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("weekly");

  // State parameter frekuensi perbandingan kustom
  const [monthlyYear, setMonthlyYear] = useState("2026");
  const [startMonth, setStartMonth] = useState("3"); // Maret
  const [endMonth, setEndMonth] = useState("6"); // Juni
  const [startYear, setStartYear] = useState("2025");
  const [endYear, setEndYear] = useState("2026");

  // Label display dinamis di tombol utama picker
  const getPeriodLabel = () => {
    if (selectedPeriod === "monthly") {
      const startLabel = monthOptions.find(m => m.value === startMonth)?.label;
      const endLabel = monthOptions.find(m => m.value === endMonth)?.label;
      return `${startLabel} - ${endLabel} ${monthlyYear}`;
    }
    if (selectedPeriod === "yearly") {
      return `${startYear} vs ${endYear}`;
    }
    return periodOptions.find(p => p.id === selectedPeriod)?.label || "Mingguan";
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([
      `Dashboard Analytics Report\n\nPeriode: ${getPeriodLabel()}\nTanggal: ${new Date().toLocaleDateString("id-ID")}`
    ], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `analytics-report-${selectedPeriod}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 w-full bg-[#F9FEFC]">
        <div className="space-y-1">
          <h1 className="text-xl font-bold text-[#13222D] tracking-wide">
            {isLaporanPage ? "Laporan Keuangan" : "Analitik Klinik"}
          </h1>
          <p className="text-xs font-medium text-[#67737C]">
            {isLaporanPage ? "Analisa Pendapatan, Pengeluaran, dan Arus Kas" : "Ringkasan Bisnis Real-time"}
          </p>
        </div>

        {!isLaporanPage && (
          <div className="flex items-center gap-3 w-full sm:w-auto relative">
            <div className="relative">
              <Button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="rounded-xl h-11 px-4 border-[#DFE6EB] text-[#13222D] font-bold bg-white hover:bg-[#EFF4F8] flex items-center gap-2 shadow-none border cursor-pointer transition-all text-xs"
              >
                <CalendarIcon className="w-4 h-4 text-[#67737C]" />
                <span>{getPeriodLabel()}</span>
                <ChevronDown className={`w-4 h-4 text-[#67737C] transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
              </Button>

              {isDropdownOpen && (
                <>
                  <div onClick={() => setIsDropdownOpen(false)} className="fixed inset-0 z-10" />
                  
                  {/* PANEL UTAMA EXPANDED FILTER DROPDOWN */}
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl border border-[#DFE6EB] shadow-lg z-50 min-w-[320px] sm:min-w-[360px] p-4 flex flex-col gap-4 animate-in fade-in-50 zoom-in-95 duration-150">
                    
                    {/* Daftar Tipe Tab Frekuensi Utama */}
                    <div className="grid grid-cols-4 gap-1 bg-[#F4F7F9] p-1 rounded-xl">
                      {periodOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedPeriod(option.id)}
                          className={`py-2 px-1 rounded-lg text-[11px] font-bold transition-all text-center flex flex-col items-center gap-1 ${
                            selectedPeriod === option.id
                              ? "bg-white text-[#1B9C90] shadow-sm"
                              : "text-[#67737C] hover:text-[#13222D]"
                          }`}
                        >
                          {option.icon}
                          <span>{option.label.split(" ")[0]}</span>
                        </button>
                      ))}
                    </div>

                    {/* SUB-PANEL KONDISIONAL BERDASARKAN PARAMETER FILTER AKTIF */}
                    {selectedPeriod === "monthly" && (
                      <div className="space-y-3 p-1 animate-in fade-in duration-200">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#67737C] uppercase tracking-wide">Pilih Tahun</label>
                          <Select value={monthlyYear} onValueChange={setMonthlyYear}>
                            <SelectTrigger className="h-9 rounded-xl border-[#DFE6EB] text-xs font-semibold text-[#13222D] shadow-none bg-[#F4F7F9]/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-[#DFE6EB]">
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year} className="text-xs rounded-lg">{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#67737C] uppercase tracking-wide">Dari Bulan</label>
                            <Select value={startMonth} onValueChange={setStartMonth}>
                              <SelectTrigger className="h-9 rounded-xl border-[#DFE6EB] text-xs font-semibold text-[#13222D] shadow-none bg-[#F4F7F9]/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-[#DFE6EB]">
                                {monthOptions.map((m) => (
                                  <SelectItem key={m.value} value={m.value} className="text-xs rounded-lg">{m.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#67737C] uppercase tracking-wide">Sampai Bulan</label>
                            <Select value={endMonth} onValueChange={setEndMonth}>
                              <SelectTrigger className="h-9 rounded-xl border-[#DFE6EB] text-xs font-semibold text-[#13222D] shadow-none bg-[#F4F7F9]/50">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border-[#DFE6EB]">
                                {monthOptions.map((m) => (
                                  <SelectItem key={m.value} value={m.value} className="text-xs rounded-lg" disabled={Number(m.value) < Number(startMonth)}>
                                    {m.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPeriod === "yearly" && (
                      <div className="grid grid-cols-2 gap-3 p-1 animate-in fade-in duration-200">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#67737C] uppercase tracking-wide">Tahun Basis</label>
                          <Select value={startYear} onValueChange={setStartYear}>
                            <SelectTrigger className="h-9 rounded-xl border-[#DFE6EB] text-xs font-semibold text-[#13222D] shadow-none bg-[#F4F7F9]/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-[#DFE6EB]">
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year} className="text-xs rounded-lg">{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#67737C] uppercase tracking-wide">Pembanding</label>
                          <Select value={endYear} onValueChange={setEndYear}>
                            <SelectTrigger className="h-9 rounded-xl border-[#DFE6EB] text-xs font-semibold text-[#13222D] shadow-none bg-[#F4F7F9]/50">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-[#DFE6EB]">
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year} className="text-xs rounded-lg" disabled={Number(year) <= Number(startYear)}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    {/* Tombol aksi konfirmasi apply filter */}
                    <Button
                      onClick={() => setIsDropdownOpen(false)}
                      className="w-full h-9 bg-[#1B9C90] hover:bg-[#157A71] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border-none shadow-none mt-1 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Terapkan Frekuensi</span>
                    </Button>
                  </div>
                </>
              )}
            </div>

            <Button 
              onClick={() => setIsModalOpen(true)}
              className="rounded-xl h-11 px-4 bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold flex items-center gap-2 shadow-none border-none cursor-pointer transition-colors text-xs"
            >
              <Sparkles className="w-4 h-4" />
              <span>Visual Summary</span>
            </Button>

            <Button 
              onClick={handleDownload}
              variant="ghost" 
              size="icon" 
              className="rounded-xl h-11 w-11 bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#c9ece6] flex items-center justify-center border-none shadow-none cursor-pointer transition-colors"
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      <VisualSummaryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};