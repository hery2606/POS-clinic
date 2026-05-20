import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface PatientSearchProps {
  activeTab: "medis" | "obat";
  onTabChange: (tab: "medis" | "obat") => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  totalPatientsInQueue?: number;
  filteredCount?: number;
}

export const PatientSearch = ({ 
  activeTab, 
  searchValue = "",
  onSearchChange
}: PatientSearchProps) => {
  return (
    <div className="flex items-center gap-4 w-full">
      {/* 1. SEARCH BAR - Pencarian Nama/No. RM (Hidden when in obat tab) */}
      {activeTab === "medis" && (
        <div className="relative flex-1 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#29B5A8] transition-colors">
            <SearchIcon className="w-5 h-5" />
          </div>
          <Input
            type="text"
            placeholder="Cari Nama / Nomor Rekam Medis..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-12 h-12 bg-white border-slate-200 rounded-4xl text-sm font-medium focus-visible:ring-1 focus-visible:ring-[#29B5A8] focus-visible:border-[#29B5A8] transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
      )}
    </div>
  );
};