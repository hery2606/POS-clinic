"use client";

import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Bot, Loader2, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { aiInsightService } from '@/features/analitik/services/ai-insight.service';
import { AiInsightDetailModal } from './modal/AiInsightDetailModal';
import { type AiInsight } from '@/features/analitik/types/ai-insight.types';

// Helper function to robustly extract insights array from any nested structure
const extractInsights = (data: any): AiInsight[] => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  
  // Check common wrappers
  if (data.data) {
    if (Array.isArray(data.data)) return data.data;
    if (data.data.data && Array.isArray(data.data.data)) return data.data.data;
    if (data.data.insights && Array.isArray(data.data.insights)) return data.data.insights;
  }
  if (data.insights && Array.isArray(data.insights)) return data.insights;
  
  // Recursively search for any array in the object properties
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
      if (typeof data[key] === 'object' && data[key] !== null) {
        const nested = extractInsights(data[key]);
        if (nested.length > 0) return nested;
      }
    }
  }
  
  return [];
};

export const AiInsightBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 🎯 SINKRONISASI DATA ANTARMUKA REAL KE BACKEND SERVICE (enabled: hasLoaded agar tidak otomatis)
  const { data: insightsResponse, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['aiInsights'],
    queryFn: () => aiInsightService.getInsights(),
    staleTime: 0,
    refetchOnWindowFocus: false,
    retry: 2,
    enabled: hasLoaded,
  });

  // 🛠️ FIX UTAMA DI SINI: Ekstraksi array yang super robust dan antisipasi casing property
  const insights = useMemo(() => {
    const res = extractInsights(insightsResponse);
    return res;
  }, [insightsResponse]);

  const handleLoad = () => {
    setHasLoaded(true);
    refetch();
  };

  const handleRefetch = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    refetch().then(() => {
      setCurrentIndex(0);
    });
  };

  const handleNextInsight = () => {
    if (insights.length > 1) {
      setCurrentIndex((prev) => (prev + 1) % insights.length);
    }
  };

  // Indikator loading gabungan (load awal maupun refetch)
  const showLoading = isLoading || isFetching;

  return (
    <div className="w-full">
      {/* 2. KONDISI NORMAL RUNTIME */}
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
              <h3 className="font-bold text-[#13222D] text-lg text-left">Insight AI Cerdas</h3>
              
              {/* Badge info jumlah insight dan tombol refresh data */}
              {hasLoaded && !showLoading && !isError && insights.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <Badge className="bg-[#DFF6F2] text-[#1B9C90] hover:bg-[#DFF6F2] rounded-full px-3 py-0.5 text-[10px] font-bold border-none shadow-none">
                    Insight {currentIndex + 1} dari {insights.length}
                  </Badge>
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
                ? "Sedang membaca data invoice dan tren kunjungan klinik..." 
                : isError
                  ? "Gagal memuat data insight dari server. Silakan coba kembali."
                  : !hasLoaded
                    ? "Dapatkan analisis taktis harian untuk optimasi performa klinik Anda berdasarkan data transaksi terbaru."
                    : insights.length > 0 
                      ? (insights[currentIndex].pesan_tindakan || (insights[currentIndex] as any).pesanTindakan || (insights[currentIndex] as any).pesan || (insights[currentIndex] as any).message) 
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

          {/* Tombol Siklus Insight & Detail Modal */}
          {hasLoaded && !showLoading && !isError && insights.length > 0 && (
            <>
              {insights.length > 1 && (
                <Button 
                  onClick={handleNextInsight}
                  variant="outline"
                  className="rounded-full h-11 px-4 border border-[#DFE6EB] hover:border-[#1B9C90]/30 text-[#67737C] hover:text-[#1B9C90] font-bold text-sm transition-all flex items-center gap-2 bg-white cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  Insight Lainnya
                </Button>
              )}

              <Button 
                onClick={() => setIsModalOpen(true)}
                disabled={insights.length === 0}
                className="rounded-full h-11 px-6 bg-[#1B9C90] hover:bg-[#158076] text-white font-bold text-sm shrink-0 shadow-lg shadow-[#1B9C90]/10 border-none disabled:opacity-40 transition-colors cursor-pointer"
              >
                Lihat Detail Insight
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 📄 MODAL DETAIL YANG SUDAH TERPISAH DAN FLEXIBLE */}
      <AiInsightDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        insights={insights} 
        onRefresh={() => handleRefetch()}
        isLoading={showLoading}
      />
    </div>
  );
};