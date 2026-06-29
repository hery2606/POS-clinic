"use client"

import { TrendingUp, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { analitikService } from '../../services/analitik.service';

const fmt = (v: number) => { if (v >= 1e6) return `Rp ${(v / 1e6).toFixed(1)}M`; if (v >= 1e3) return `Rp ${(v / 1e3).toFixed(1)}K`; return `Rp ${v}`; };

export const TopSpendingPatients = () => {
  const { data: res, isPending: load, error: err } = useQuery({ queryKey: ["patientAnalytics"], queryFn: () => analitikService.getPatientAnalytics(), staleTime: 300000 });
  const pts = res?.data?.pasien_spend_tertinggi || [];
  const mx = Math.max(...pts.map(p => p.total_spend), 1);

  if (err) return <div className="w-full flex-1 flex flex-col justify-between overflow-hidden"><div className="flex items-center justify-between mb-8 shrink-0"><div className="flex items-center gap-2.5"><div className="w-10 h-10 rounded-full bg-[#FFF9EB] flex items-center justify-center border border-[#FFE6A8]"><TrendingUp className="w-5 h-5 text-[#F2A618]" /></div><div><h3 className="text-lg font-bold text-[#13222D]">Pasien Spend Tertinggi</h3><p className="text-xs font-medium text-[#67737C]">Berdasarkan akumulasi transaksi billing</p></div></div></div><div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">Error: {err instanceof Error ? err.message : 'Error'}</div></div>;
  if (load) return <div className="w-full flex-1 flex flex-col justify-between overflow-hidden"><div className="flex items-center justify-between mb-8 shrink-0"><div className="flex items-center gap-2.5"><div className="w-10 h-10 rounded-full bg-[#FFF9EB] flex items-center justify-center border border-[#FFE6A8]"><TrendingUp className="w-5 h-5 text-[#F2A618]" /></div><div><h3 className="text-lg font-bold text-[#13222D]">Pasien Spend Tertinggi</h3><p className="text-xs font-medium text-[#67737C]">Berdasarkan akumulasi transaksi billing</p></div></div></div><div className="space-y-5 flex-1">{[1, 2, 3, 4].map(i => <div key={i} className="space-y-1.5"><div className="h-4 bg-gray-100 rounded animate-pulse" /><div className="h-2.5 bg-gray-100 rounded animate-pulse" /></div>)}</div></div>;

  return (
    <div className="w-full flex-1 flex flex-col justify-between overflow-hidden">
      <div className="flex items-center justify-between mb-8 shrink-0"><div className="flex items-center gap-2.5"><div className="w-10 h-10 rounded-full bg-[#FFF9EB] flex items-center justify-center border border-[#FFE6A8]"><TrendingUp className="w-5 h-5 text-[#F2A618]" /></div><div><h3 className="text-lg font-bold text-[#13222D]">Pasien Spend Tertinggi</h3><p className="text-xs font-medium text-[#67737C]">Berdasarkan akumulasi transaksi billing</p></div></div></div>
      <div className="space-y-5 flex-1 overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {pts.map((p, i) => (
          <div key={p.id_pasien} className="space-y-1.5">
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="text-xs font-bold text-[#67737C] min-w-[16px]">#{i + 1}</span><div className="flex flex-col"><div className="flex items-center gap-1.5"><span className="font-bold text-[#13222D] text-xs">{p.nama_pasien}</span>{!i && <Trophy className="w-3.5 h-3.5 text-[#F2A618]" />}</div><span className="text-[10px] font-medium text-[#67737C]">{p.id_pasien}</span></div></div><div className="text-right"><span className="font-bold text-[#13222D] text-xs">{fmt(p.total_spend)}</span></div></div>
            <div className="w-full h-2.5 bg-[#EFF4F8] rounded-full overflow-hidden"><div className="h-full bg-[#F2A618] rounded-full transition-all duration-500 ease-out" style={{ width: `${(p.total_spend / mx) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
};