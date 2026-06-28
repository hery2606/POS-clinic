"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Calendar as CalendarIcon, Sparkles, Download, ChevronDown, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VisualSummaryModal } from "@/features/analitik/components/modals/VisualSummaryModal";
import { periodOptions, monthOptions, yearOptions, type PeriodType } from "./periodOptionsConfig";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { ROUTES } from "@/routes/routeConfig";

interface AnalitikHeaderProps {
  onDownloadPDF?: () => void;
}

export const AnalitikHeader = ({ onDownloadPDF }: AnalitikHeaderProps = {}) => {
  const location = useLocation();
  const isLaporanPage = location.pathname.includes("laporan");
  const isDashboardPage = location.pathname === ROUTES.ADMIN.DASHBOARD;

  const getHeaderInfo = () => {
    const path = location.pathname.toLowerCase();
    
    if (path.includes("dashboard")) {
      return {
        title: "Analitik Klinik",
        subtitle: "Ringkasan Bisnis Real-time"
      };
    }
    if (path.includes("pasien")) {
      return {
        title: "Data Pasien",
        subtitle: "Manajemen data pasien dan rekam medis"
      };
    }
    if (path.includes("transaksi")) {
      return {
        title: "Data Transaksi",
        subtitle: "Catatan transaksi pembayaran dan tagihan"
      };
    }
    if (path.includes("laporan")) {
      return {
        title: "Laporan Keuangan",
        subtitle: "Analisa Pendapatan, Pengeluaran, dan Arus Kas"
      };
    }
    if (path.includes("settings")) {
      return {
        title: "Pengaturan",
        subtitle: "Manajemen pengguna dan konfigurasi sistem"
      };
    }
    
    return {
      title: "Analitik Klinik",
      subtitle: "Ringkasan Bisnis Real-time"
    };
  };

  const { title, subtitle } = getHeaderInfo();

  const currentYearStr = String(new Date().getFullYear());
  const prevYearStr = String(new Date().getFullYear() - 1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isPdfReady, setIsPdfReady] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>("daily");

  const [monthlyYear, setMonthlyYear] = useState(currentYearStr);
  const [startMonth, setStartMonth] = useState("3"); 
  const [endMonth, setEndMonth] = useState("6"); 
  const [startYear, setStartYear] = useState(prevYearStr);
  const [endYear, setEndYear] = useState(currentYearStr);

  const getPeriodLabel = () => {
    if (selectedPeriod === "monthly") {
      const startLabel = monthOptions.find(m => m.value === startMonth)?.label;
      const endLabel = monthOptions.find(m => m.value === endMonth)?.label;
      return `${startLabel} - ${endLabel} ${monthlyYear}`;
    }
    if (selectedPeriod === "yearly") {
      return `${startYear} vs ${endYear}`;
    }
    return periodOptions.find(p => p.id === selectedPeriod)?.label || "Hari Ini (Aktif)";
  };

  useEffect(() => {
    const handleLoading = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsExporting(customEvent.detail?.loading ?? false);
    };
    const handleReady = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsPdfReady(customEvent.detail?.isReady ?? false);
    };

    window.addEventListener("dashboard-pdf-loading", handleLoading);
    window.addEventListener("dashboard-pdf-ready", handleReady);

    return () => {
      window.removeEventListener("dashboard-pdf-loading", handleLoading);
      window.removeEventListener("dashboard-pdf-ready", handleReady);
    };
  }, []);

  const handleDownloadPdf = () => {
    if (onDownloadPDF) {
      onDownloadPDF();
    } else if (isDashboardPage) {
      window.dispatchEvent(
        new CustomEvent("trigger-dashboard-pdf-download", {
          detail: { periodLabel: getPeriodLabel() },
        })
      );
    } else {
      const periodLabel = getPeriodLabel();
      const file = new Blob(
        [
          `Laporan Analitik Klinik\n\nPeriode: ${periodLabel}\nTanggal Export: ${new Date().toLocaleDateString("id-ID")}`,
        ],
        { type: "text/plain" }
      );
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, "_blank");
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 w-full bg-[#F9FEFC] no-print">
        <div className="flex items-center gap-3">
          <SidebarTrigger className="md:hidden border border-[#DFE6EB] hover:bg-[#EFF4F8] text-[#464a4c] p-2 h-10 w-10 shrink-0 flex items-center justify-center rounded-lg [&_svg]:!size-7" />
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-[#13222D] tracking-wide">
              {title}
            </h1>
            <p className="text-xs font-medium text-[#67737C]">
              {subtitle}
            </p>
          </div>
        </div>

        {isDashboardPage && (
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
                  <div className="absolute top-full mt-2 right-0 bg-white rounded-2xl border border-[#DFE6EB] shadow-lg z-50 min-w-[320px] sm:min-w-[360px] p-4 flex flex-col gap-4 absolute-dropdown">
                    <div className="grid grid-cols-3 gap-1 bg-[#F4F7F9] p-1 rounded-xl">
                      {periodOptions.map((option) => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedPeriod(option.id)}
                          className={`py-2 px-1 rounded-lg text-[11px] font-bold transition-all text-center flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            selectedPeriod === option.id ? "bg-white text-[#1B9C90] shadow-sm" : "text-[#67737C] hover:text-[#13222D]"
                          }`}
                        >
                          {option.icon}
                          <span className="flex items-center gap-1">
                            {option.id === "daily" ? "Hari Ini" : option.label}
                            {option.id === "daily" && (
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                            )}
                          </span>
                        </button>
                      ))}
                    </div>

                    {selectedPeriod === "monthly" && (
                      <div className="space-y-3 p-1">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#67737C] uppercase tracking-wide">Pilih Tahun</label>
                          <Select value={monthlyYear} onValueChange={setMonthlyYear}>
                            <SelectTrigger className="h-9 rounded-xl border-[#DFE6EB] text-xs font-semibold text-[#13222D] shadow-none bg-[#F4F7F9]/50"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl border-[#DFE6EB]">
                              {yearOptions.map((year) => <SelectItem key={year} value={year} className="text-xs rounded-lg">{year}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#67737C] uppercase tracking-wide">Dari Bulan</label>
                            <Select value={startMonth} onValueChange={setStartMonth}>
                              <SelectTrigger className="h-9 rounded-xl border-[#DFE6EB] text-xs font-semibold text-[#13222D] shadow-none bg-[#F4F7F9]/50"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-xl border-[#DFE6EB]">
                                {monthOptions.map((m) => <SelectItem key={m.value} value={m.value} className="text-xs rounded-lg">{m.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-[#67737C] uppercase tracking-wide">Sampai Bulan</label>
                            <Select value={endMonth} onValueChange={setEndMonth}>
                              <SelectTrigger className="h-9 rounded-xl border-[#DFE6EB] text-xs font-semibold text-[#13222D] shadow-none bg-[#F4F7F9]/50"><SelectValue /></SelectTrigger>
                              <SelectContent className="rounded-xl border-[#DFE6EB]">
                                {monthOptions.map((m) => (
                                  <SelectItem key={m.value} value={m.value} className="text-xs rounded-lg" disabled={Number(m.value) < Number(startMonth)}>{m.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedPeriod === "yearly" && (
                      <div className="grid grid-cols-2 gap-3 p-1">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#67737C] uppercase tracking-wide">Tahun Basis</label>
                          <Select value={startYear} onValueChange={setStartYear}>
                            <SelectTrigger className="h-9 rounded-xl border-[#DFE6EB] text-xs font-semibold text-[#13222D] shadow-none bg-[#F4F7F9]/50"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl border-[#DFE6EB]">
                              {yearOptions.map((year) => <SelectItem key={year} value={year} className="text-xs rounded-lg">{year}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-[#67737C] uppercase tracking-wide">Pembanding</label>
                          <Select value={endYear} onValueChange={setEndYear}>
                            <SelectTrigger className="h-9 rounded-xl border-[#DFE6EB] text-xs font-semibold text-[#13222D] shadow-none bg-[#F4F7F9]/50"><SelectValue /></SelectTrigger>
                            <SelectContent className="rounded-xl border-[#DFE6EB]">
                              {yearOptions.map((year) => (
                                <SelectItem key={year} value={year} className="text-xs rounded-lg" disabled={Number(year) <= Number(startYear)}>{year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}

                    <Button onClick={() => setIsDropdownOpen(false)} className="w-full h-9 bg-[#1B9C90] hover:bg-[#157A71] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border-none shadow-none mt-1 transition-colors">
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Terapkan Frekuensi</span>
                    </Button>
                  </div>
                </>
              )}
            </div>

            <Button onClick={() => setIsModalOpen(true)} className="rounded-xl h-11 px-4 bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold flex items-center gap-2 shadow-none border-none cursor-pointer transition-colors text-xs">
              <Sparkles className="w-4 h-4" />
              <span>Visual Summary</span>
            </Button>

            {isDashboardPage && (
              <Button onClick={handleDownloadPdf} variant="ghost" size="icon" disabled={isExporting || !isPdfReady} className="rounded-xl h-11 w-11 bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#c9ece6] flex items-center justify-center border-none shadow-none cursor-pointer transition-colors disabled:opacity-50">
                {isExporting ? <Loader2 className="w-4 h-4 animate-spin text-[#1B9C90]" /> : <Download className="w-4 h-4" />}
              </Button>
            )}
          </div>
        )}
      </div>

      <VisualSummaryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

    </>
  );
};