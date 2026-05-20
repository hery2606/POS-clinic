import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { warehouseService } from '../../services/warehouse.service';

export interface FilterState {
  categories: string[];
  statuses: string[];
  types: string[];
}

interface InventoryFilterProps {
  onFilterChange?: (filters: FilterState) => void;
}

export const InventoryFilter: React.FC<InventoryFilterProps> = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState<FilterState>({
    categories: [],
    statuses: [],
    types: [],
  });

  // FETCH MEDICINES DATA TO EXTRACT DYNAMIC FILTER OPTIONS
  const { data: medicinesResponse } = useQuery({
    queryKey: ['warehouseMedicines'],
    queryFn: () => warehouseService.getMedicinesList(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const medicines = medicinesResponse?.data || [];

  // EXTRACT UNIQUE FILTER OPTIONS DYNAMICALLY FROM DATA
  const filterOptions = useMemo(() => {
    // Extract unique categories
    const uniqueCategories = Array.from(
      new Set(medicines.map(m => m.kategori).filter(Boolean))
    ).sort();

    // Map category display names
    const categoryDisplay: Record<string, string> = {
      'obat_bebas': 'Obat Bebas',
      'obat_keras': 'Obat Keras',
      'alkes': 'Alkes (Alat Kesehatan)',
    };

    const categoriesOptions = uniqueCategories.map(cat => 
      categoryDisplay[cat] || cat.charAt(0).toUpperCase() + cat.slice(1)
    );

    // Extract unique satuan (units) for "Bentuk Sediaan"
    const uniqueUnits = Array.from(
      new Set(medicines.map(m => m.satuan).filter(Boolean))
    ).sort();

    // Extract unique storage types from lokasiGudang
    const uniqueTypes = Array.from(
      new Set(
        medicines
          .map(m => m.lokasiGudang?.tipe)
          .filter((t): t is string => Boolean(t))
      )
    ).sort();

    // Status options include all three statuses now
    const statusesOptions = ['Tersedia', 'Stok Menipis', 'Stok Kritis'];

    return {
      categoriesOptions,
      statusesOptions,
      typesOptions: uniqueTypes.length > 0 ? uniqueTypes : ['A', 'B', 'C'],
      unitsOptions: uniqueUnits,
      categoryMap: uniqueCategories, // Keep original values for filtering
    };
  }, [medicines]);

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
    const cleared = { categories: [], statuses: [], types: [] };
    setSelectedFilters(cleared);
    if (onFilterChange) onFilterChange(cleared);
  };

  // Menghitung total filter yang sedang aktif
  const activeCount = 
    selectedFilters.categories.length + 
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
          <h4 className="text-sm font-bold text-[#13222D]">Pengaturan Filter</h4>
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
          <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider block">Status Stok</span>
          <div className="flex flex-wrap gap-2">
            {filterOptions.statusesOptions.map((status) => {
              const isSelected = selectedFilters.statuses.includes(status);
              return (
                <button
                  key={status}
                  onClick={() => toggleFilter('statuses', status)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1",
                    isSelected 
                      ? "bg-[#1B9C90] border-none text-white font-bold" 
                      : "bg-white border-[#DFE6EB] text-[#67737C] hover:border-[#67737C]"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  {status}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 2: KATEGORI */}
        <div className="space-y-2.5">
          <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider block">Kategori Obat</span>
          <div className="flex flex-wrap gap-2">
            {filterOptions.categoriesOptions.map((categoryDisplay, idx) => {
              const categoryKey = filterOptions.categoryMap[idx];
              const isSelected = selectedFilters.categories.includes(categoryKey);
              return (
                <button
                  key={categoryKey}
                  onClick={() => toggleFilter('categories', categoryKey)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1",
                    isSelected 
                      ? "bg-[#1B9C90] border-none text-white font-bold" 
                      : "bg-white border-[#DFE6EB] text-[#67737C] hover:border-[#67737C]"
                  )}
                >
                  {isSelected && <Check className="w-3 h-3 shrink-0" />}
                  {categoryDisplay}
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: LOKASI/TIPE GUDANG */}
        {filterOptions.typesOptions.length > 0 && (
          <div className="space-y-2.5">
            <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider block">Lokasi Gudang</span>
            <div className="flex flex-wrap gap-2">
              {filterOptions.typesOptions.map((type) => {
                const isSelected = selectedFilters.types.includes(type);
                return (
                  <button
                    key={type}
                    onClick={() => toggleFilter('types', type)}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-1",
                      isSelected 
                        ? "bg-[#1B9C90] border-none text-white font-bold" 
                        : "bg-white border-[#DFE6EB] text-[#67737C] hover:border-[#67737C]"
                    )}
                  >
                    {isSelected && <Check className="w-3 h-3 shrink-0" />}
                    Tipe {type}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};