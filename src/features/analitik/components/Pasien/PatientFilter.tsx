"use client"

import { Filter, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface FilterState {
  status: string[];
  gender: string[];
  hasBpjs: string[];
}

interface PatientFilterProps {
  filters: FilterState;
  onFilterChange: (type: keyof FilterState, value: string) => void;
  onClearAll: () => void;
}

export const PatientFilter = ({
  filters,
  onFilterChange,
  onClearAll,
}: PatientFilterProps) => {
  const isFiltered = filters.status.length > 0 || filters.gender.length > 0 || filters.hasBpjs.length > 0;
  const totalFilters = filters.status.length + filters.gender.length + filters.hasBpjs.length;

  const getFilterLabel = (type: keyof FilterState, value: string) => {
    if (type === 'status') {
      return value;
    } else if (type === 'gender') {
      return value === 'LAKI_LAKI' ? 'Laki-laki' : 'Perempuan';
    } else {
      return value === 'ADA' ? 'Ada BPJS' : 'Tanpa BPJS';
    }
  };

  const getFilterColor = (type: keyof FilterState) => {
    switch (type) {
      case 'status':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'gender':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'hasBpjs':
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full md:w-auto">
      {/* FILTER DROPDOWN BUTTON */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={isFiltered ? "default" : "outline"}
            className={cn(
              "gap-2 h-10 rounded-lg whitespace-nowrap",
              isFiltered && "bg-teal-600 hover:bg-teal-700 border-teal-600"
            )}
          >
            <Filter className="w-4 h-4" />
            Filter
            {isFiltered && (
              <Badge variant="secondary" className="ml-1 bg-white/20 text-white border-0">
                {totalFilters}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* STATUS SECTION */}
          <DropdownMenuLabel className="text-xs font-semibold uppercase">Status Pasien</DropdownMenuLabel>
          {['AKTIF', 'TIDAK AKTIF'].map(status => (
            <DropdownMenuCheckboxItem
              key={status}
              checked={filters.status.includes(status)}
              onCheckedChange={() => onFilterChange('status', status)}
              className="cursor-pointer text-sm"
            >
              {status}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator className="my-2" />

          {/* GENDER SECTION */}
          <DropdownMenuLabel className="text-xs font-semibold uppercase">Jenis Kelamin</DropdownMenuLabel>
          {[
            { value: 'LAKI_LAKI', label: 'Laki-laki' },
            { value: 'PEREMPUAN', label: 'Perempuan' }
          ].map(option => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={filters.gender.includes(option.value)}
              onCheckedChange={() => onFilterChange('gender', option.value)}
              className="cursor-pointer text-sm"
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}

          <DropdownMenuSeparator className="my-2" />

          {/* BPJS SECTION */}
          <DropdownMenuLabel className="text-xs font-semibold uppercase">Asuransi BPJS</DropdownMenuLabel>
          {[
            { value: 'ADA', label: 'Ada BPJS' },
            { value: 'TIDAK_ADA', label: 'Tanpa BPJS' }
          ].map(option => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={filters.hasBpjs.includes(option.value)}
              onCheckedChange={() => onFilterChange('hasBpjs', option.value)}
              className="cursor-pointer text-sm"
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}

          {isFiltered && (
            <>
              <DropdownMenuSeparator className="my-2" />
              <button
                onClick={onClearAll}
                className="w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors"
              >
                Hapus Semua Filter
              </button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* ACTIVE FILTER BADGES */}
      {isFiltered && (
        <div className="flex flex-wrap gap-2">
          {filters.status.map(value => (
            <Badge
              key={`status-${value}`}
              variant="outline"
              className={cn(
                "px-2.5 py-1 text-xs font-medium border cursor-pointer transition-all hover:shadow-md rounded-full",
                getFilterColor('status')
              )}
              onClick={() => onFilterChange('status', value)}
            >
              {getFilterLabel('status', value)}
              <X className="w-3 h-3 ml-1.5" />
            </Badge>
          ))}
          {filters.gender.map(value => (
            <Badge
              key={`gender-${value}`}
              variant="outline"
              className={cn(
                "px-2.5 py-1 text-xs font-medium border cursor-pointer transition-all hover:shadow-md rounded-full",
                getFilterColor('gender')
              )}
              onClick={() => onFilterChange('gender', value)}
            >
              {getFilterLabel('gender', value)}
              <X className="w-3 h-3 ml-1.5" />
            </Badge>
          ))}
          {filters.hasBpjs.map(value => (
            <Badge
              key={`bpjs-${value}`}
              variant="outline"
              className={cn(
                "px-2.5 py-1 text-xs font-medium border cursor-pointer transition-all hover:shadow-md rounded-full",
                getFilterColor('hasBpjs')
              )}
              onClick={() => onFilterChange('hasBpjs', value)}
            >
              {getFilterLabel('hasBpjs', value)}
              <X className="w-3 h-3 ml-1.5" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};
