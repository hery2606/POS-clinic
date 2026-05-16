import { Calendar, Sparkles, Download, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { VisualSummaryModal } from '@/features/analitik/ui/VisualSummaryModal';

type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface PeriodOption {
  id: PeriodType;
  label: string;
  icon: string;
}

const periodOptions: PeriodOption[] = [
  { id: 'daily', label: 'Harian', icon: '📅' },
  { id: 'weekly', label: 'Mingguan', icon: '📆' },
  { id: 'monthly', label: 'Bulanan', icon: '📊' },
  { id: 'yearly', label: 'Tahunan', icon: '📈' },
];

export const AnalitikHeader = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodType>('weekly');

  const currentPeriod = periodOptions.find(p => p.id === selectedPeriod);

  const handleDownload = () => {
    // Create a simple text file as PDF simulation
    const element = document.createElement('a');
    const periodLabel = currentPeriod?.label || 'Mingguan';
    const file = new Blob([
      `Dashboard Analytics Report\n\nPeriode: ${periodLabel}\nTanggal: ${new Date().toLocaleDateString('id-ID')}`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `analytics-report-${selectedPeriod}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsDropdownOpen(false);
    }
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 w-full bg-[#F9FEFC]">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#13222D] tracking-tight">
            Analitik Klinik
          </h1>
          <p className="text-sm font-medium text-[#67737C]">
            Ringkasan Bisnis Real-time
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto relative">
          {/* Period Dropdown */}
          <div className="relative">
            <Button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="rounded-full h-11 px-5 border-[#DFE6EB] text-[#13222D] font-bold bg-white hover:bg-[#EFF4F8] flex items-center gap-2 shadow-sm border cursor-pointer transition-all"
            >
              <Calendar className="w-4 h-4 text-[#67737C]" />
              <span className="text-sm">{currentPeriod?.label}</span>
              <ChevronDown className={`w-4 h-4 text-[#67737C] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <>
                {/* Backdrop */}
                <div 
                  onClick={handleBackdropClick}
                  className="fixed inset-0 z-10"
                />
                {/* Menu */}
                <div className="absolute top-full mt-2 left-0 bg-white rounded-[16px] border border-[#DFE6EB] shadow-lg overflow-hidden z-50 min-w-48">
                  {periodOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => {
                        setSelectedPeriod(option.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 flex items-center gap-3 text-left transition-colors ${
                        selectedPeriod === option.id
                          ? 'bg-[#DFF6F2] text-[#1B9C90] font-semibold'
                          : 'text-[#13222D] hover:bg-[#F5F7FA]'
                      }`}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm font-medium">{option.label}</span>
                      {selectedPeriod === option.id && (
                        <div className="ml-auto w-2 h-2 rounded-full bg-[#1B9C90]" />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <Button 
            onClick={() => setIsModalOpen(true)}
            className="rounded-full h-11 px-5 bg-[#1B9C90] hover:opacity-90 text-white font-bold flex items-center gap-2 shadow-lg shadow-[#1B9C90]/10 border-none cursor-pointer transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Visual Summary</span>
          </Button>

          <Button 
            onClick={handleDownload}
            variant="ghost" 
            size="icon" 
            className="rounded-full h-11 w-11 bg-[#DFF6F2] hover:opacity-90 text-[#1B9C90] flex items-center justify-center border-none shadow-sm cursor-pointer transition-all"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <VisualSummaryModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};