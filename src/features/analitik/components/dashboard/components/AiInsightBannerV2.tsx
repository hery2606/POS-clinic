"use client";

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bot, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { chatbotService } from '@/features/analitik/services/chatbot.service';
import { AiInsightDetailModal } from './modal/AiInsightDetailModal';

export const AiInsightBannerV2 = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  // 🎯 SINKRONISASI DATA ANTARMUKA REAL KE BACKEND SERVICE (enabled: hasLoaded agar tidak otomatis)
  const { data: insightsResponse, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['aiInsights'],
    queryFn: () => chatbotService.getAiInsight(),
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: hasLoaded,
  });

  const handleLoad = () => {
    setHasLoaded(true);
    refetch();
  };

  const handleRefetch = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    refetch();
  };

  // Indikator loading gabungan (load awal maupun refetch)
  const showLoading = isLoading || isFetching;
  const insightText = insightsResponse?.insight;

  return (
    <div className="w-full">
      {/* KONDISI NORMAL RUNTIME */}
      <div className="flex flex-col md:flex-row items-center justify-between p-6 bg-white border border-[#DFE6EB] hover:border-[#1B9C90]/30 rounded-[24px] shadow-sm gap-4 transition-all w-full">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#1B9C90] text-white flex items-center justify-center shrink-0">
            {showLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : !hasLoaded ? (
              <Bot className="w-6 h-6 text-white" />
            ) : (
              <Bot className="w-6 h-6 animate-pulse" />
            )}
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-[#13222D] text-lg text-left">Insight AI Cerdas v2</h3>
              
              {/* Tombol refresh data */}
              {hasLoaded && !showLoading && !isError && insightText && (
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={handleRefetch}
                    className="p-1 rounded-full text-[#67737C] hover:text-[#1B9C90] hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Segarkan data dari server"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-sm font-medium text-[#67737C] leading-relaxed max-w-3xl text-left">
              {showLoading 
                ? "Sedang memproses data analitik dan menghasilkan laporan taktis harian..." 
                : isError
                  ? "Gagal memuat data insight dari server. Silakan coba kembali."
                  : !hasLoaded
                    ? "Dapatkan analisis taktis harian untuk optimasi performa klinik Anda berdasarkan data transaksi terbaru."
                    : insightText
                      ? "AI telah mensintesis performa keuangan dan operasional klinik Anda. Tersedia ringkasan dan rekomendasi taktis baru." 
                      : "Seluruh performa keuangan klinik berjalan optimal. Belum ada rekomendasi taktis baru saat ini."
              }
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 flex-wrap w-full md:w-auto justify-end">
          {/* Tombol Muat Pertama Kali */}
          {!hasLoaded && (
            <Button 
              onClick={handleLoad}
              className="rounded-full h-11 px-6 bg-[#1B9C90] hover:bg-[#158076] text-white font-bold text-sm shrink-0 shadow-lg shadow-[#1B9C90]/10 border-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Mulai Analisis
            </Button>
          )}

          {/* Tombol Coba Lagi saat Error */}
          {hasLoaded && isError && (
            <Button 
              onClick={handleLoad}
              className="rounded-full h-11 px-6 bg-[#1B9C90] hover:bg-[#158076] text-white font-bold text-sm shrink-0 shadow-lg shadow-[#1B9C90]/10 border-none transition-all flex items-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Coba Lagi
            </Button>
          )}

          {/* Tombol Detail Modal */}
          {hasLoaded && !showLoading && !isError && insightText && (
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="rounded-full h-11 px-6 bg-[#1B9C90] hover:bg-[#158076] text-white font-bold text-sm shrink-0 shadow-lg shadow-[#1B9C90]/10 border-none disabled:opacity-40 transition-colors cursor-pointer"
            >
              Lihat Laporan Lengkap
            </Button>
          )}
        </div>
      </div>

      {/* 📄 MODAL DETAIL YANG SUDAH TERPISAH DAN FLEXIBLE */}
      <AiInsightDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        insightText={insightText} 
        onRefresh={() => handleRefetch()}
        isLoading={showLoading}
      />
    </div>
  );
};