"use client"

import React, { useEffect, useState } from 'react';
import { X, Sparkles, TrendingUp, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { visumService } from '../../services/visum.service';
import { type VisumReport } from '../../types/visum.types';

export const VisualSummaryModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
  const [md, setMd] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true); setErr(null);
    visumService.generateVisumReport().then((r: VisumReport) => setMd(r?.data?.raw_markdown || ''))
      .catch((e: any) => setErr(e.response?.status === 404 ? 'Endpoint "/api/v1/ai/visum/bisnis" tidak ditemukan.' : e.message || 'Gagal memuat visual summary.'))
      .finally(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    if (isOpen) document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const cln = (t: string) => t.replace(/\*\*(.*?)\*\*/g, '$1');
  const getIcon = (t: string) => t.toLowerCase().includes('ringkasan') || t.toLowerCase().includes('bisnis') ? <TrendingUp className="w-4 h-4 text-[#1B9C90]" /> : t.toLowerCase().includes('insight') ? <Lightbulb className="w-4 h-4 text-amber-500" /> : <CheckCircle2 className="w-4 h-4 text-blue-500" />;

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl h-[80vh] bg-white rounded-3xl border border-[#DFE6EB] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        <div className="flex-shrink-0 p-6 border-b border-[#EFF2F5] flex items-center justify-between bg-gradient-to-r from-white to-[#F4FBF9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1B9C90] to-[#127067] text-white flex items-center justify-center shadow-md shadow-[#1B9C90]/10"><Sparkles className="w-5 h-5" /></div>
            <div><h2 className="text-base font-bold text-[#13222D] tracking-tight">Visual Summary Bisnis AI</h2><p className="text-[11px] font-medium text-[#67737C]">Kompilasi Intelijen & Analisis Data Otomatis RME</p></div>
          </div>
          <button onClick={onClose} className="rounded-xl hover:bg-slate-100 text-[#67737C] h-8 w-8 flex items-center justify-center border border-slate-100 transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto bg-[#FAFCFD] px-8 py-6 [scrollbar-width:thin]">
          {loading ? <div className="space-y-4 py-2">{[1, 2, 3].map(i => <div key={i} className="h-28 bg-white border border-slate-200/60 rounded-2xl animate-pulse" />)}</div>
          : err ? <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-700 text-xs font-bold"><AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /><div><p className="uppercase tracking-wider">Gagal Sinkronisasi AI</p><p className="font-medium text-red-600 mt-1">{err}</p></div></div>
          : md ? <div className="space-y-6">
              {md.split('###').filter(s => s.trim()).map((sec, idx) => {
                const lines = sec.split('\n');
                const title = lines[0].trim();
                const content = lines.slice(1).join('\n').trim();

                return (
                  <div key={idx} className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-xs space-y-3">
                    {title && <h3 className="text-xs font-black text-[#13222D] uppercase tracking-wider flex items-center gap-2 border-b border-slate-50 pb-2">{getIcon(title)}{title}</h3>}
                    <div className="space-y-3">
                      {content.split('\n\n').filter(p => p.trim()).map((p, pIdx) => {
                        if (p.trim().startsWith('*') || /^\d+\./.test(p.trim())) {
                          return (
                            <div key={pIdx} className="grid grid-cols-1 gap-2.5 pt-1">
                              {p.split('\n').filter(l => l.trim()).map((item, itemIdx) => {
                                const [bold, desc] = item.replace(/^[\*\s\d\.\-建设]+/, '').split(':');
                                return (
                                  <div key={itemIdx} className="p-3 bg-[#FAFCFD] rounded-xl border border-slate-100 flex gap-3 items-start hover:border-[#1B9C90]/20 transition-all text-xs">
                                    <div className="w-5 h-5 rounded-md bg-emerald-50 text-[#1B9C90] font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">{itemIdx + 1}</div>
                                    <div className="flex-1"><span className="font-bold text-[#13222D] block sm:inline">{cln(bold)}</span>{desc && <span className="text-[#67737C] font-medium leading-relaxed sm:pl-1">: {cln(desc)}</span>}</div>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                        return <p key={pIdx} className="text-xs font-medium text-[#67737C] leading-relaxed text-justify">{cln(p)}</p>;
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          : <div className="text-center text-xs font-bold text-slate-400 py-10">Tidak ada ringkasan performa klinik yang tersedia saat ini.</div>}
        </div>

        <div className="flex-shrink-0 p-4 border-t border-[#EFF2F5] bg-white flex justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-xl h-10 px-5 text-xs font-bold text-[#67737C] border-slate-200 hover:bg-slate-50 shadow-none">Tutup Dashboard AI</Button>
        </div>
      </div>
    </div>
  );
};