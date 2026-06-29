"use client"

import { Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { analitikService } from '../../services/analitik.service';

const fmt = (v: number) => { if (v >= 1e6) return `Rp ${(v / 1e6).toFixed(1)}M`; if (v >= 1e3) return `Rp ${(v / 1e3).toFixed(1)}K`; return `Rp ${v}`; };

export const LoyalPatientCard = () => {
  const { data: res, isPending: load, error: err } = useQuery({ queryKey: ["patientAnalytics"], queryFn: () => analitikService.getPatientAnalytics(), staleTime: 300000 });
  
  const pd = res?.data?.pasien_paling_loyal || [];
  const sp = res?.data?.pasien_spend_tertinggi || [];
  
  const pts = pd.map(p => {
    const s = sp.find(x => x.id_pasien === p.id_pasien);
    return { ...p, init: p.nama_pasien.charAt(0).toUpperCase(), ts: s ? fmt(s.total_spend) : 'Rp 0' };
  });

  if (err) return <div className="w-full flex-1 flex flex-col justify-between overflow-hidden"><div className="flex items-center justify-between mb-6 shrink-0"><div className="flex items-center gap-2"><Award className="w-5 h-5 text-[#1B9C90]" /><h3 className="text-lg font-bold text-[#13222D]">Pasien Loyal (AI Insight)</h3></div><Badge className="bg-[#DFF6F2] text-[#1B9C90] rounded-full px-3 py-1 text-xs font-bold border-none shadow-none">Top 3</Badge></div><div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">Error: {err instanceof Error ? err.message : 'Error'}</div></div>;
  if (load) return <div className="w-full flex-1 flex flex-col justify-between overflow-hidden"><div className="flex items-center justify-between mb-6 shrink-0"><div className="flex items-center gap-2"><Award className="w-5 h-5 text-[#1B9C90]" /><h3 className="text-lg font-bold text-[#13222D]">Pasien Loyal (AI Insight)</h3></div><Badge className="bg-[#DFF6F2] text-[#1B9C90] rounded-full px-3 py-1 text-xs font-bold border-none shadow-none">Top 3</Badge></div><div className="space-y-4 flex-1">{[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-2xl animate-pulse" />)}</div></div>;

  return (
    <div className="w-full flex-1 flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between mb-6 shrink-0"><div className="flex items-center gap-2"><Award className="w-5 h-5 text-[#1B9C90]" /><h3 className="text-lg font-bold text-[#13222D]">Pasien Loyal (AI Insight)</h3></div><Badge className="bg-[#DFF6F2] text-[#1B9C90] rounded-full px-3 py-1 text-xs font-bold border-none shadow-none">Top {pts.length}</Badge></div>
      <div className="space-y-4 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {pts.map(p => (
          <div key={p.id_pasien} className="flex items-center justify-between p-4 bg-white border border-[#DFE6EB] hover:border-[#1B9C90]/30 rounded-2xl transition-all shadow-sm">
            <div className="flex items-center gap-4"><div className="w-11 h-11 rounded-full bg-[#DFF6F2] text-[#1B9C90] flex items-center justify-center font-bold text-base border border-[#DFE6EB]">{p.init}</div><div className="flex flex-col"><span className="font-bold text-[#13222D] text-sm">{p.nama_pasien}</span><span className="text-xs font-medium text-[#67737C]">{p.id_pasien}</span></div></div>
            <div className="text-right"><p className="text-sm font-bold text-[#1B9C90]">{p.kunjungan_terbanyak} Kunjungan</p><p className="text-xs font-medium text-[#67737C]">Total: {p.ts}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};