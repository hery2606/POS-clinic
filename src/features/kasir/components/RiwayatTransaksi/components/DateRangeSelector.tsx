import { useState } from 'react';
import { CalendarIcon, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface DateRangeSelectorProps {
  onDateRangeChange?: (range: DateRange) => void;
}

export type DateRange = 'today' | 'week' | 'month' | 'custom';

interface DateRangeOption {
  value: DateRange;
  label: string;
  description: string;
}

const dateRangeOptions: DateRangeOption[] = [
  { 
    value: 'today', 
    label: 'Hari Ini', 
    description: 'Data dari hari ini' 
  },
  { 
    value: 'week', 
    label: 'Minggu Ini', 
    description: 'Data 7 hari terakhir' 
  },
  { 
    value: 'month', 
    label: 'Bulan Ini', 
    description: 'Data bulan ini' 
  },
  { 
    value: 'custom', 
    label: 'Custom', 
    description: 'Pilih rentang custom' 
  },
];

const getDateRangeLabel = (range: DateRange): string => {
  const option = dateRangeOptions.find(opt => opt.value === range);
  return option?.label || 'Hari Ini';
};

export const DateRangeSelector = ({ onDateRangeChange }: DateRangeSelectorProps) => {
  const [selectedRange, setSelectedRange] = useState<DateRange>('today');
  const [isOpen, setIsOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const handleRangeChange = (range: DateRange) => {
    setSelectedRange(range);
    if (range === 'custom') {
      setShowCustom(true);
    } else {
      setShowCustom(false);
      onDateRangeChange?.(range);
      setIsOpen(false);
    }
  };

  const handleCustomDateApply = () => {
    onDateRangeChange?.('custom');
    setShowCustom(false);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "rounded-full h-12 px-6 gap-2 border-slate-200 font-bold text-slate-700 hover:bg-slate-50 transition-all",
            "focus-visible:ring-[#29B5A8]"
          )}
        >
          <CalendarIcon className="w-4 h-4" />
          {getDateRangeLabel(selectedRange)}
          <span className="ml-1 text-[10px]">▼</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-80 p-0 border-slate-200 rounded-2xl" align="start">
        {!showCustom ? (
          <>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
              <h3 className="text-sm font-bold text-slate-900">Pilih Rentang Waktu</h3>
            </div>

            {/* Date Range Options */}
            <div className="max-h-96 overflow-y-auto">
              {dateRangeOptions.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleRangeChange(option.value)}
                  className={cn(
                    "px-6 py-3 border-b border-slate-100 cursor-pointer transition-all hover:bg-slate-50",
                    selectedRange === option.value && 'bg-emerald-50/40 border-b-[#29B5A8]/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-4 h-4 rounded border-2 transition-all",
                      selectedRange === option.value
                        ? 'border-[#29B5A8] bg-[#29B5A8]'
                        : 'border-slate-300'
                    )}>
                      {selectedRange === option.value && (
                        <svg className="w-full h-full text-white" viewBox="0 0 16 16" fill="currentColor">
                          <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 11-1.06-1.06l7.25-7.25a.75.75 0 011.06 0z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900">
                        {option.label}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {option.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Custom Date Range Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Rentang Custom</h3>
              <button
                onClick={() => setShowCustom(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Custom Date Range Picker */}
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900">Tanggal Mulai</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#29B5A8] focus:ring-1 focus:ring-[#29B5A8] text-sm text-slate-900"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900">Tanggal Akhir</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-[#29B5A8] focus:ring-1 focus:ring-[#29B5A8] text-sm text-slate-900"
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustom(false)}
                  className="flex-1 h-9 rounded-lg border-slate-200 font-semibold text-slate-700 hover:bg-slate-100 text-xs"
                >
                  Batal
                </Button>
                <Button
                  size="sm"
                  onClick={handleCustomDateApply}
                  className="flex-1 h-9 rounded-lg bg-[#29B5A8] text-white font-semibold hover:bg-[#1e9c95] transition-colors shadow-sm text-xs"
                >
                  Terapkan
                </Button>
              </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
