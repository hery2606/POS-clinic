import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface FilterTransactionProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  dateRange: 'today' | 'week' | 'month' | 'custom';
  status: string[];
  type: string[];
  search?: string;
}

const transactionTypes = [
  { id: 'medis', label: 'Pelayanan Medis' },
  { id: 'obat', label: 'Obat Saja' },
  { id: 'laboratorium', label: 'Laboratorium' },
];

const transactionStatus = [
  { id: 'lunas', label: 'Lunas', color: 'bg-emerald-100', textColor: 'text-emerald-600' },
  { id: 'menunggu', label: 'Menunggu', color: 'bg-orange-100', textColor: 'text-orange-600' },
  { id: 'dibatalkan', label: 'Dibatalkan', color: 'bg-red-100', textColor: 'text-red-600' },
];

const dateRangeOptions = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'week', label: 'Minggu Ini' },
  { value: 'month', label: 'Bulan Ini' },
  { value: 'custom', label: 'Custom' },
];

export const FilterTransaction = ({ onFilterChange }: FilterTransactionProps) => {
  const [filters, setFilters] = useState<FilterState>({
    dateRange: 'today',
    status: [],
    type: [],
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleStatusChange = (statusId: string) => {
    const newFilters: FilterState = {
      ...filters,
      status: filters.status.includes(statusId)
        ? filters.status.filter((s) => s !== statusId)
        : [...filters.status, statusId],
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleTypeChange = (typeId: string) => {
    const newFilters: FilterState = {
      ...filters,
      type: filters.type.includes(typeId)
        ? filters.type.filter((t) => t !== typeId)
        : [...filters.type, typeId],
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleDateRangeChange = (value: string) => {
    const newFilters: FilterState = {
      ...filters,
      dateRange: value as 'today' | 'week' | 'month' | 'custom',
    };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      dateRange: 'today',
      status: [],
      type: [],
    };
    setFilters(resetFilters);
    onFilterChange?.(resetFilters);
  };

  const activeFilterCount = filters.status.length + filters.type.length + (filters.dateRange !== 'today' ? 1 : 0);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "rounded-full h-12 px-6 gap-2 border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-all relative",
            activeFilterCount > 0 && "ring-2 ring-[#29B5A8] ring-offset-2"
          )}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter
          {activeFilterCount > 0 && (
            <Badge className="ml-1 bg-[#29B5A8] text-white text-xs rounded-full">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-0 border-slate-200 rounded-2xl" align="end">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-linear-to-r from-slate-50 to-white">
          <h3 className="text-sm font-bold text-slate-900">Filter Transaksi</h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Date Range Filter */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-xs font-bold text-slate-900 mb-3">Rentang Waktu</div>
          <div className="space-y-1">
            {dateRangeOptions.map((option) => (
              <DropdownMenuCheckboxItem
                key={option.value}
                checked={filters.dateRange === option.value}
                onCheckedChange={() => handleDateRangeChange(option.value)}
                className="text-sm cursor-pointer hover:bg-slate-50 py-2 px-2 rounded-lg transition-colors"
              >
                {option.label}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-xs font-bold text-slate-900 mb-3">Status</div>
          <div className="space-y-1">
            {transactionStatus.map((status) => (
              <DropdownMenuCheckboxItem
                key={status.id}
                checked={filters.status.includes(status.id)}
                onCheckedChange={() => handleStatusChange(status.id)}
                className="text-sm cursor-pointer hover:bg-slate-50 py-2 px-2 rounded-lg transition-colors flex items-center gap-2"
              >
                <Badge
                  className={cn(
                    status.color,
                    status.textColor,
                    'rounded-full font-medium border-none text-xs px-2 py-0.5'
                  )}
                >
                  {status.label}
                </Badge>
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </div>

        {/* Transaction Type Filter */}
        <div className="px-6 py-4 border-b border-slate-100">
          <div className="text-xs font-bold text-slate-900 mb-3">Jenis Transaksi</div>
          <div className="space-y-1">
            {transactionTypes.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.id}
                checked={filters.type.includes(type.id)}
                onCheckedChange={() => handleTypeChange(type.id)}
                className="text-sm cursor-pointer hover:bg-slate-50 py-2 px-2 rounded-lg transition-colors"
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 p-4 border-t border-slate-100 bg-slate-50/50">
          <Button
            variant="outline"
            onClick={handleResetFilters}
            size="sm"
            className="flex-1 h-9 rounded-lg border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 text-xs"
          >
            Reset
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            size="sm"
            className="flex-1 h-9 rounded-lg bg-[#29B5A8] text-white font-semibold hover:bg-[#1e9c95] transition-colors shadow-sm text-xs"
          >
            Terapkan
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

