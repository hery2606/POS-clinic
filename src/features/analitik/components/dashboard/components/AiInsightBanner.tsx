import { Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const AiInsightBanner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-white border border-[#DFE6EB] hover:border-[#1B9C90]/30 rounded-[24px] shadow-sm gap-4 transition-all w-full">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#1B9C90] text-white flex items-center justify-center shrink-0">
          <Bot className="w-6 h-6" />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#13222D] text-lg">Insight AI Cerdas</h3>
            <Badge className="bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#DFF6F2] rounded-full px-3 py-0.5 text-[10px] font-bold border-none shadow-none">
              Baru
            </Badge>
          </div>
          <p className="text-sm font-medium text-[#67737C] leading-relaxed max-w-3xl">
            Pendapatan naik 12% didorong oleh layanan Konsultasi. Segera kirim reminder untuk 3 invoice jatuh tempo senilai Rp 15M.
          </p>
        </div>
      </div>

      <Button className="rounded-full h-11 px-6 bg-[#1B9C90] hover:opacity-90 text-white font-bold text-sm shrink-0 shadow-lg shadow-[#1B9C90]/10 border-none">
        Lihat Detail Insight
      </Button>
    </div>
  );
};