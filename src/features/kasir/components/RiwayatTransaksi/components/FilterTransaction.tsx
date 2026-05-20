import { useState } from 'react';
import { Filter, X, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface FilterTransactionProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  statuses: string[];
  types: string[];
}

const transactionTypes = [
  { id: 'medis', label: 'Pelayanan Medis' },
  { id: 'obat', label: 'Obat Saja' },
  { id: 'laboratorium', label: 'Laboratorium' },
];

const transactionStatus = [
  { id: 'lunas', label: 'Lunas' },
  { id: 'menunggu', label: 'Menunggu' },
  { id: 'dibatalkan', label: 'Dibatalkan' },
];

export const FilterTransaction = ({ onFilterChange }: FilterTransactionProps) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    statuses: [],
    types: [],
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
    const cleared = { statuses: [], types: [] };
    setSelectedFilters(cleared);
    if (onFilterChange) onFilterChange(cleared);
  };

  const activeCount = 
    selectedFilters.statuses.length + 
    selectedFilters.types.length;

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
          <h4 className="text-sm font-bold text-[#13222D]">Filter Transaksi</h4>
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

        {/* SECTION 1: STATUS */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider block">Status Transaksi</span>
          <div className="flex flex-wrap gap-2">
            {transactionStatus.map((status) => {
              const isSelected = selectedFilters.statuses.includes(status.id);
              return (
                <button
                  key={status.id}
                  onClick={() => toggleFilter('statuses', status.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1",
                    isSelected 
                      ? "bg-[#1B9C90] border-none text-white font-bold" 
                      : "bg-white border-[#DFE6EB] text-[#67737C] hover:border-[#67737C]"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  {status.label}
                </button>
              );
            })}
          </div>
        </div>

        <Separator className="bg-[#EFF4F8]" />

        {/* SECTION 2: TRANSACTION TYPE */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider block">Jenis Transaksi</span>
          <div className="flex flex-wrap gap-2">
            {transactionTypes.map((type) => {
              const isSelected = selectedFilters.types.includes(type.id);
              return (
                <button
                  key={type.id}
                  onClick={() => toggleFilter('types', type.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1",
                    isSelected 
                      ? "bg-[#1B9C90] border-none text-white font-bold" 
                      : "bg-white border-[#DFE6EB] text-[#67737C] hover:border-[#67737C]"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  {type.label}
                </button>
              );
            })}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

