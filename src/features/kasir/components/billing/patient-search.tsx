import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PatientSearchProps {
  activeTab: "medis" | "obat";
  onTabChange: (tab: "medis" | "obat") => void;
}

export const PatientSearch = ({ activeTab, onTabChange }: PatientSearchProps) => {
  return (
    <div className="flex items-center gap-4 w-full">
      {/* 1. SEARCH BAR - Pencarian Nama/No. RM */}
      <div className="relative flex-1 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#29B5A8] transition-colors">
          <SearchIcon className="w-5 h-5" />
        </div>
        <Input
          type="text"
          placeholder="Cari Nama / Nomor Rekam Medis..."
          className="pl-12 h-12 bg-white border-slate-200 rounded-full text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#29B5A8] focus-visible:border-[#29B5A8] transition-all placeholder:text-slate-400 shadow-sm"
        />
      </div>

      {/* 2. TOGGLE SELECTOR - Pelayanan Medis / Obat Saja */}
      <div className="bg-white border border-slate-200 p-1 rounded-full flex items-center shadow-sm">
        <button
          onClick={() => onTabChange("medis")}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-bold transition-all duration-200",
            activeTab === "medis"
              ? "bg-[#29B5A8] text-white shadow-md shadow-emerald-100"
              : "bg-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          Pelayanan Medis
        </button>
        <button
          onClick={() => onTabChange("obat")}
          className={cn(
            "px-6 py-2 rounded-full text-sm font-bold transition-all duration-200",
            activeTab === "obat"
              ? "bg-[#29B5A8] text-white shadow-md shadow-emerald-100"
              : "bg-transparent text-slate-600 hover:text-slate-900"
          )}
        >
          Obat Saja
        </button>
      </div>
    </div>
  );
};