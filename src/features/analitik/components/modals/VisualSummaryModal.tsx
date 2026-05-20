"use client"

import React, { useEffect, useState } from 'react';
import { 
  X,
  Sparkles, 
  Bell, 
  Download 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { analitikService } from '../../services/analitik.service';
import { type VisumReport } from '../../types/visum.types';

interface VisualSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VisualSummaryModal: React.FC<VisualSummaryModalProps> = ({ isOpen, onClose }) => {
  const [report, setReport] = useState<VisumReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await analitikService.generateVisumReport();
        setReport(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate report');
        console.error('Error generating visum report:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDownloadPDF = () => {
    if (report?.pdf_download_url) {
      window.open(report.pdf_download_url, '_blank');
    }
  };

  return (
    <div 
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      {/* Modal Content - Mengunci tinggi maksimal modal di layar */}
      <div className="w-full max-w-6xl h-[85vh] bg-white rounded-[32px] border border-[#DFE6EB] shadow-xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex-shrink-0 p-6 border-b border-[#DFE6EB] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1B9C90] text-white flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#13222D]">Visual Summary AI</h2>
              <p className="text-xs font-medium text-[#67737C]">Analisis Otomatis Kinerja Klinik Anda</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full hover:bg-[#EFF4F8] text-[#67737C] h-9 w-9 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* BODY - PERBAIKAN UTAMA: Mengunci tinggi area scrollbox agar scrollbar aktif */}
        <div className="flex-1 overflow-y-auto bg-[#F9FEFC] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          {loading ? (
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-gray-50 border border-slate-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-semibold">
                Error: {error}
              </div>
            </div>
          ) : report ? (
            <div className="p-8 space-y-8">
              {/* Render Narasi dengan cerdas */}
              {report.narasi_laporan.split('\n\n').map((section, sectionIdx) => {
                if (!section.trim()) return null;

                const headerMatch = section.match(/^\*\*(.+?)\*\*\s*\n={5,}/m);
                const isHeader = headerMatch !== null;
                const header = headerMatch ? headerMatch[1] : '';

                if (isHeader) {
                  const content = section.replace(/^\*\*(.+?)\*\*\s*\n={5_}\s*\n?/, '');
                  return (
                    <div key={sectionIdx} className="space-y-4">
                      <h3 className="text-xl font-bold text-[#13222D]">{header}</h3>
                      {content.trim() && (
                        <p className="text-sm md:text-md font-medium text-[#67737C] leading-relaxed">
                          {content.replace(/\*\*(.+?)\*\*/g, '$1')}
                        </p>
                      )}
                    </div>
                  );
                }

                if (section.includes('* ')) {
                  const items = section.split('\n').filter(line => line.trim().startsWith('* '));
                  return (
                    <div key={sectionIdx} className="space-y-3">
                      {items.map((item, idx) => {
                        const cleanContent = item.replace(/^\*\s+/, '').replace(/\*\*(.+?)\*\*/g, '$1');
                        const [title, desc] = cleanContent.split(':');
                        return (
                          <div key={idx} className="p-4 bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm flex gap-3 items-start hover:border-[#1B9C90]/30 transition-colors">
                            <div className="w-8 h-8 rounded-full bg-[#FFF9EB] text-[#F2A618] flex items-center justify-center shrink-0">
                              <Bell className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-bold text-[#13222D]">{title?.trim()}</p>
                              {desc && (
                                <p className="text-xs font-medium text-[#67737C] mt-1 leading-relaxed">{desc.trim()}</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                }

                return (
                  <div key={sectionIdx} className="space-y-3">
                    <p className="text-sm md:text-md font-medium text-[#67737C] leading-relaxed">
                      {section.replace(/\*\*(.+?)\*\*/g, '$1')}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-sm font-bold text-[#67737C]">
              No report data available
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex-shrink-0 p-6 border-t border-[#DFE6EB] bg-white flex justify-end gap-3">
          <Button 
            variant="ghost" 
            onClick={onClose} 
            className="rounded-full h-11 px-6 font-bold text-[#67737C] hover:bg-[#EFF4F8]"
          >
            Tutup
          </Button>
          <Button 
            onClick={handleDownloadPDF}
            disabled={loading || !report}
            className="rounded-full h-11 px-6 bg-[#1B9C90] hover:bg-[#157A71] font-bold text-white flex items-center gap-2 border-none shadow-lg shadow-[#1B9C90]/10 disabled:opacity-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Unduh PDF
          </Button>
        </div>

      </div>
    </div>
  );
};