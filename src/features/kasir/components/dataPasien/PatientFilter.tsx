import React, { useState } from 'react';
import { Filter, X, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from "@/lib/utils";

export interface FilterState {
  genders: string[];
  insurances: string[];
  visits: string[];
}

interface PatientFilterProps {
  onFilterChange?: (filters: FilterState) => void;
}

const genderOptions = [
  { value: 'LAKI_LAKI', label: 'Laki-laki' },
  { value: 'PEREMPUAN', label: 'Perempuan' },
];

const insuranceOptions = [
  { value: 'BPJS', label: 'BPJS Kesehatan' },
  { value: 'Mandiri', label: 'Asuransi Mandiri' },
  { value: 'Astra', label: 'Asuransi Astra' },
];

const visitOptions = [
  { value: 'week', label: 'Minggu ini' },
  { value: 'month', label: 'Bulan ini' },
  { value: 'quarter', label: '3 bulan terakhir' },
  { value: 'year', label: '1 tahun terakhir' },
];

export const PatientFilter: React.FC<PatientFilterProps> = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    genders: [],
    insurances: [],
    visits: [],
  });

  const toggleFilter = (type: keyof FilterState, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[type];
      const updated = current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
      
      const newFilters = { ...prev, [type]: updated };
      if (onFilterChange) onFilterChange(newFilters);
      return newFilters;
    });
  };

  const resetFilters = () => {
    const cleared = { genders: [], insurances: [], visits: [] };
    setSelectedFilters(cleared);
    if (onFilterChange) onFilterChange(cleared);
  };

  const activeCount = 
    selectedFilters.genders.length + 
    selectedFilters.insurances.length + 
    selectedFilters.visits.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={cn(
            "h-11 px-4 gap-2 border-[#DFE6EB] font-bold text-[#13222D] rounded-md transition-all",
            activeCount > 0 ? "bg-[#DFF6F2] border-[#1B9C90]/30 text-[#1B9C90] hover:bg-[#DFF6F2]/80" : "hover:bg-[#EFF4F8]"
          )}
        >
          <Filter className={cn("w-4 h-4", activeCount > 0 ? "text-[#1B9C90]" : "text-[#67737C]")} />
          <span>Filter</span>
          {activeCount > 0 && (
            <Badge className="ml-1 bg-[#1B9C90] text-white hover:bg-[#1B9C90] h-5 min-w-5 px-1 rounded-full flex items-center justify-center text-[10px] font-extrabold border-none shadow-none">
              {activeCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 bg-white rounded-[20px] border border-[#DFE6EB] p-5 shadow-xl space-y-5 z-50" align="end">
        {/* HEADER MINI */}
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-[#13222D]">Filter Pasien</h4>
          {activeCount > 0 && (
            <Button 
              variant="ghost" 
              onClick={resetFilters}
              className="h-auto p-0 text-xs font-bold text-red-500 hover:text-red-600 hover:bg-transparent flex items-center gap-1"
            >
              <X className="w-3 h-3" />
              Atur Ulang
            </Button>
          )}
        </div>

        <Separator className="bg-[#EFF4F8]" />

        {/* SECTION 1: GENDER */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider block">Jenis Kelamin</span>
          <div className="flex flex-wrap gap-2">
            {genderOptions.map((gender) => {
              const isSelected = selectedFilters.genders.includes(gender.value);
              return (
                <button
                  key={gender.value}
                  onClick={() => toggleFilter('genders', gender.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1",
                    isSelected 
                      ? "bg-[#1B9C90] border-none text-white font-bold" 
                      : "bg-white border-[#DFE6EB] text-[#67737C] hover:border-[#67737C]"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  {gender.label}
                </button>
              );
            })}
          </div>
        </div>

        <Separator className="bg-[#EFF4F8]" />

        {/* SECTION 2: INSURANCE */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider block">Jenis Penjamin</span>
          <div className="flex flex-wrap gap-2">
            {insuranceOptions.map((insurance) => {
              const isSelected = selectedFilters.insurances.includes(insurance.value);
              return (
                <button
                  key={insurance.value}
                  onClick={() => toggleFilter('insurances', insurance.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1",
                    isSelected 
                      ? "bg-[#1B9C90] border-none text-white font-bold" 
                      : "bg-white border-[#DFE6EB] text-[#67737C] hover:border-[#67737C]"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  {insurance.label}
                </button>
              );
            })}
          </div>
        </div>

        <Separator className="bg-[#EFF4F8]" />

        {/* SECTION 3: LAST VISIT */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider block">Kunjungan Terakhir</span>
          <div className="flex flex-wrap gap-2">
            {visitOptions.map((visit) => {
              const isSelected = selectedFilters.visits.includes(visit.value);
              return (
                <button
                  key={visit.value}
                  onClick={() => toggleFilter('visits', visit.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1",
                    isSelected 
                      ? "bg-[#1B9C90] border-none text-white font-bold" 
                      : "bg-white border-[#DFE6EB] text-[#67737C] hover:border-[#67737C]"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  {visit.label}
                </button>
              );
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
