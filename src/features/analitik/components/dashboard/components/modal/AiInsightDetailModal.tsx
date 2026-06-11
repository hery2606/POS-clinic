"use client";

import { Bot, Info, Lightbulb, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { type AiInsight } from '@/features/analitik/types/ai-insight.types';

interface AiInsightDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  insights: AiInsight[];
  onRefresh?: () => void;
  isLoading?: boolean;
}

export const AiInsightDetailModal = ({ 
  isOpen, 
  onClose, 
  insights,
  onRefresh,
  isLoading
}: AiInsightDetailModalProps) => {
  console.log("DEBUG MODAL - isOpen:", isOpen, "insights:", insights);
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      {/* 🛠️ KAMU BISA CUSTOM UKURAN DI SINI (Contoh: diganti ke sm:max-w-2xl agar lebih lebar & lega) */}
      <DialogContent className="sm:max-w-2xl p-6 rounded-[28px] max-h-[85vh] overflow-y-auto bg-white border-none shadow-2xl animate-in fade-in-50 duration-200">
        <DialogHeader className="flex flex-row gap-4 items-start pb-4 border-b border-slate-100">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#1B9C90] to-[#2cd5c4] text-white flex items-center justify-center shrink-0 shadow-md shadow-[#1B9C90]/10">
            <Bot className="w-6 h-6" />
          </div>
          <div className="space-y-1 flex-1">
            <DialogTitle className="text-xl font-black text-[#13222D] text-left">
              Rekomendasi & Insight AI
            </DialogTitle>
            <DialogDescription className="text-xs font-semibold text-[#67737C] text-left">
              Analisis taktis harian untuk optimasi performa klinik Anda berdasarkan big data RME.
            </DialogDescription>
          </div>
          {onRefresh && (
            <Button
              onClick={onRefresh}
              disabled={isLoading}
              variant="outline"
              className="rounded-full h-9 px-3.5 border border-[#DFE6EB] hover:border-[#1B9C90]/30 text-[#67737C] hover:text-[#1B9C90] font-bold text-xs transition-colors flex items-center gap-1.5 self-center bg-white cursor-pointer"
            >
              <RefreshCw className={cn("w-3.5 h-3.5", isLoading && "animate-spin")} />
              Refresh
            </Button>
          )}
        </DialogHeader>

        {/* List Kategori Item Insight */}
        <div className="space-y-4 py-4 min-h-[120px] flex flex-col justify-center">
          {isLoading ? (
            <div className="space-y-4 w-full">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 rounded-2xl border border-slate-100 flex items-start gap-4 bg-slate-50/50">
                  <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-1/3 rounded-md" />
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-5/6 rounded-md" />
                    <Skeleton className="h-3 w-2/3 rounded-md" />
                  </div>
                </div>
              ))}
            </div>
          ) : insights.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-3 text-slate-400 text-center">
              <Info className="w-8 h-8 text-slate-300 mx-auto" />
              <p className="text-xs font-semibold text-[#67737C] mt-2">Belum ada data insight. Silakan klik tombol Refresh.</p>
            </div>
          ) : (
            insights.map((insight, idx) => {
              const tipe = (insight.tipe || (insight as any).type || '').toLowerCase();
              const judul = insight.judul || (insight as any).title || '';
              const pesanTindakan = insight.pesan_tindakan || (insight as any).pesanTindakan || (insight as any).pesan || (insight as any).message || '';

              const isWarning = tipe === 'warning' || tipe === 'peringatan';
              const isOpportunity = tipe === 'opportunity' || tipe === 'peluang';
              
              let config = {
                bg: 'bg-blue-50/40 border-blue-100/60',
                badgeBg: 'bg-[#E8F0FE] text-[#1A73E8]',
                icon: <Info className="w-5 h-5 text-[#1A73E8]" />,
                label: 'Informasi'
              };

              if (isWarning) {
                config = {
                  bg: 'bg-red-50/40 border-red-100/60',
                  badgeBg: 'bg-[#FCE8E6] text-[#C5221F]',
                  icon: <AlertTriangle className="w-5 h-5 text-[#C5221F]" />,
                  label: 'Peringatan'
                };
              } else if (isOpportunity) {
                config = {
                  bg: 'bg-emerald-50/40 border-emerald-100/60',
                  badgeBg: 'bg-[#E6F4EA] text-[#137333]',
                  icon: <Lightbulb className="w-5 h-5 text-[#1B9C90]" />,
                  label: 'Peluang'
                };
              }

              return (
                <div 
                  key={idx} 
                  className={cn(
                    "p-4 rounded-2xl border flex items-start gap-4 transition-all duration-200 hover:scale-[1.005] hover:shadow-sm", 
                    config.bg
                  )}
                >
                  <div className="mt-0.5 p-2 rounded-xl bg-white shrink-0 border border-slate-100 shadow-xs">
                    {config.icon}
                  </div>
                  <div className="space-y-1.5 flex-1 text-left">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-[#13222D] text-sm">{judul}</h4>
                      <Badge className={cn("border-none shadow-none rounded-full px-2.5 py-0.5 text-[9px] font-bold tracking-wider uppercase", config.badgeBg)}>
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      {pesanTindakan}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};