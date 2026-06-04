"use client"

import React, { useEffect, useState } from 'react';
import { 
  X,
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { visumService } from '../../services/visum.service';
// Import interface terupdate yang baru saja kita buat[cite: 9]
import { type VisumReport } from '../../types/visum.types';

interface VisualSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisualSummaryModal: React.FC<VisualSummaryModalProps> = ({ isOpen, onClose }) => {
  const [markdownText, setMarkdownText] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Memanggil service dengan endpoint /bisnis[cite: 9]
        // Response di-typing ketat menggunakan model interface VisumReport[cite: 9]
        const response: VisumReport = await visumService.generateVisumReport();
        
        // Integrasi Tipe Data Baru: Mengambil data dari properti raw_markdown[cite: 9]
        if (response?.data?.raw_markdown) {
          setMarkdownText(response.data.raw_markdown);
        } else {
          setMarkdownText('');
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setError('Endpoint "/api/v1/ai/visum/bisnis" tidak ditemukan di server. Periksa routing backend[cite: 9].');
        } else {
          setError(err.message || 'Gagal memuat visual summary AI klinik[cite: 9].');
        }
        console.error('Error generating visum report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Helper pembersih tag bold (**text**) dari response markdown backend AI[cite: 9]
  const cleanBoldText = (text: string) => text.replace(/\*\*(.*?)\*\*/g, '$1');

  // Menentukan ikon indikator visual dashboard berdasarkan judul sub-bab[cite: 9]
  const getSectionHeaderIcon = (title: string) => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('ringkasan') || lowerTitle.includes('bisnis')) {
      return <TrendingUp className="w-4 h-4 text-[#1B9C90]" />;
    }
    if (lowerTitle.includes('insight')) {
      return <Lightbulb className="w-4 h-4 text-amber-500" />;
    }
    return <CheckCircle2 className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div 
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-3xl border border-[#DFE6EB] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="flex-shrink-0 p-6 border-b border-[#EFF2F5] flex items-center justify-between bg-gradient-to-r from-white to-[#F4FBF9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B9C90] to-[#127067] text-white flex items-center justify-center shadow-md shadow-[#1B9C90]/10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#13222D] tracking-tight">Visual Summary Bisnis AI</h2>
              <p className="text-[11px] font-medium text-[#67737C]">Kompilasi Intelijen & Analisis Data Otomatis RME[cite: 9]</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl hover:bg-slate-100 text-[#67737C] h-8 w-8 flex items-center justify-center border border-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* MODAL BODY CONTENT */}
        <div className="flex-1 overflow-y-auto bg-[#FAFCFD] px-8 py-6 [scrollbar-width:thin]">
          {loading ? (
            <div className="space-y-4 py-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-28 bg-white border border-slate-200/60 rounded-2xl animate-pulse[cite: 9]"></div>
              ))}
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-xs font-bold[cite: 9]">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="uppercase tracking-wider">Gagal Sinkronisasi AI</p>
                <p className="font-medium text-red-600 mt-1">{error}</p>
              </div>
            </div>
          ) : markdownText ? (
            <div className="space-y-6">
              {/* Memecah text markdown berdasarkan tag seksi H3 (###) bawaan AI[cite: 9] */}
              {markdownText.split('###').map((section, idx) => {
                if (!section.trim()) return null;

                const lines = section.split('\n');
                const title = lines[0].trim();
                const contentLines = lines.slice(1).join('\n').trim();

                return (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3[cite: 9]">
                    {title && (
                      <h3 className="text-xs font-black text-[#13222D] uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-2">
                        {getSectionHeaderIcon(title)}
                        {title}
                      </h3>
                    )}

                    <div className="space-y-3">
                      {contentLines.split('\n\n').map((paragraph, pIdx) => {
                        if (!paragraph.trim()) return null;

                        // Deteksi Otomatis Jika Isi Paragraf Berupa List/Poin Rekomendasi (* atau Angka)[cite: 9]
                        if (paragraph.trim().startsWith('*') || /^\d+\./.test(paragraph.trim())) {
                          const listItems = paragraph.split('\n').filter(line => line.trim());
                          
                          return (
                            <div key={pIdx} className="grid grid-cols-1 gap-2.5 pt-1">
                              {listItems.map((item, itemIdx) => {
                                const cleanItem = item.replace(/^[\*\s\d\.\-建设]+/, '');
                                const [boldTitle, description] = cleanItem.split(':');

                                return (
                                  <div key={itemIdx} className="p-3 bg-[#FAFCFD] rounded-xl border border-slate-100 flex gap-3 items-start hover:border-[#1B9C90]/20 transition-all text-xs[cite: 9]">
                                    <div className="w-5 h-5 rounded-md bg-emerald-50 text-[#1B9C90] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                                      {itemIdx + 1}
                                    </div>
                                    <div className="flex-1">
                                      <span className="font-bold text-[#13222D] block sm:inline">
                                        {cleanBoldText(boldTitle)}
                                      </span>
                                      {description && (
                                        <span className="text-[#67737C] font-medium leading-relaxed sm:pl-1">
                                          : {cleanBoldText(description)}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }

                        // Render Paragraf Deskripsi Normal[cite: 9]
                        return (
                          <p key={pIdx} className="text-xs font-medium text-[#67737C] leading-relaxed text-justify[cite: 9]">
                            {cleanBoldText(paragraph)}
                          </p>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-xs font-bold text-slate-400 py-10[cite: 9]">
              Tidak ada ringkasan performa klinik yang tersedia saat ini.
            </div>
          )}
        </div>

        {/* MODAL FOOTER ACTION */}
        <div className="flex-shrink-0 p-4 border-t border-[#EFF2F5] bg-white flex justify-end[cite: 9]">
          <Button 
            variant="outline" 
            onClick={onClose} 
            className="rounded-xl h-10 px-5 text-xs font-bold text-[#67737C] border-slate-200 hover:bg-slate-50 shadow-none[cite: 9]"
          >
            Tutup Dashboard AI
          </Button>
        </div>

      </div>
    </div>
  );
};