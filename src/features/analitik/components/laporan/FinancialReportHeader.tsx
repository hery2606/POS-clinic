"use client";

import { Calendar, Download, FileSpreadsheet, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { logActivity } from '@/features/analitik/utils/activityLogger';

interface Props { selectedPeriod?: string; onPeriodChange?: (v: string) => void; onDownloadPDF?: () => void; onExportExcel?: () => void; }

export const periodOptions = Array.from({ length: 60 }).map((_, i) => {
  const d = new Date(); d.setMonth(d.getMonth() - i);
  return { value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`, label: `${["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"][d.getMonth()]} ${d.getFullYear()}` };
});

export function FinancialReportHeader({ selectedPeriod, onPeriodChange, onDownloadPDF, onExportExcel }: Props) {
  const t = new Date();
  const dY = String(t.getFullYear());
  const dM = String(t.getMonth() + 1).padStart(2, "0");
  const [cY, cM] = (selectedPeriod || "").split("-");
  const aY = cY || dY, aM = cM || dM;

  const mOpts = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"].map((m, i) => ({ v: String(i + 1).padStart(2, "0"), l: m }));
  const aMLabel = mOpts.find(m => m.v === aM)?.l || "";

  const handlePdf = () => {
    logActivity({ action: 'EXPORT_PDF', module: 'LAPORAN', detail: `Export PDF laporan keuangan: ${aMLabel} ${aY}`, target_name: 'Laporan Keuangan' });
    setTimeout(() => {
      if (onDownloadPDF) return onDownloadPDF();
      const u = URL.createObjectURL(new Blob([`Laporan Keuangan\nPeriode: ${aY}-${aM}\nTanggal: ${t.toLocaleDateString("id-ID")}`], { type: "text/plain" }));
      const f = document.createElement("iframe");
      Object.assign(f.style, { position: "fixed", width: "0", height: "0", border: "none" });
      f.src = u; document.body.appendChild(f);
      f.onload = () => { try { f.contentWindow?.print(); } catch { window.open(u); } setTimeout(() => { document.body.removeChild(f); URL.revokeObjectURL(u); }, 3000); };
    }, 300);
  };

  const handleExcel = () => {
    logActivity({ action: 'EXPORT_EXCEL', module: 'LAPORAN', detail: `Export Excel laporan keuangan: ${aMLabel} ${aY}`, target_name: 'Laporan Keuangan' });
    setTimeout(() => onExportExcel ? onExportExcel() : alert(`Export Excel periode ${aY}-${aM} segera hadir.`), 300);
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm flex flex-col xl:flex-row xl:items-center justify-between gap-4 w-full">
      <div className="space-y-1"><h2 className="text-xl font-bold text-[#13222D]">Laporan Keuangan</h2><p className="text-sm font-medium text-[#67737C]">Analisa Pendapatan, Pengeluaran, Arus Kas - Periode: {aMLabel} {aY}</p></div>
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 w-full xl:w-auto">
        <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full lg:w-auto">
          <Button onClick={() => onPeriodChange?.(`${dY}-${dM}`)} variant="outline" className={cn("h-11 rounded-xl flex items-center justify-center gap-1.5 shadow-none text-xs px-2 sm:px-4 font-bold border", aY === dY && aM === dM ? "bg-[#1B9C90] text-white hover:bg-[#157A71]" : "bg-[#F4F7F9] text-[#67737C] hover:bg-[#DFE6EB]")}><Clock className="w-4 h-4" /><span className="truncate">Hari Ini</span></Button>
          <Select value={aM} onValueChange={v => onPeriodChange?.(`${aY}-${v}`)}><SelectTrigger className="w-full sm:w-36 h-11 bg-[#F4F7F9] border-none text-xs font-semibold rounded-xl px-2 sm:px-4"><Calendar className="w-4 h-4" /><SelectValue placeholder="Bulan" /></SelectTrigger><SelectContent className="rounded-xl border-[#DFE6EB] bg-white text-xs">{mOpts.map(o => <SelectItem key={o.v} value={o.v} className="rounded-lg">{o.l}</SelectItem>)}</SelectContent></Select>
          <Select value={aY} onValueChange={v => onPeriodChange?.(`${v}-${aM}`)}><SelectTrigger className="w-full sm:w-28 h-11 bg-[#F4F7F9] border-none text-xs font-semibold rounded-xl px-2 sm:px-4"><SelectValue placeholder="Tahun" /></SelectTrigger><SelectContent className="rounded-xl border-[#DFE6EB] bg-white text-xs">{Array.from({ length: 5 }, (_, i) => String(t.getFullYear() - i)).map(y => <SelectItem key={y} value={y} className="rounded-lg">{y}</SelectItem>)}</SelectContent></Select>
        </div>
        <div className="flex flex-row items-center gap-2 w-full lg:w-auto">
          <Button onClick={handlePdf} variant="outline" className="flex-1 lg:flex-none border-[#DFE6EB] text-[#13222D] hover:bg-[#F4F7F9] font-bold h-11 rounded-xl gap-2 shadow-none text-xs px-4"><Download className="w-4 h-4" /><span className="truncate">Unduh PDF</span></Button>
          <Button onClick={handleExcel} className="flex-1 lg:flex-none bg-[#1B9C90] hover:bg-[#157A71] text-white font-bold h-11 px-5 rounded-xl gap-2 border-none shadow-none text-xs"><FileSpreadsheet className="w-4 h-4" /><span className="truncate">Export Excel</span></Button>
        </div>
      </div>
    </div>
  );
}