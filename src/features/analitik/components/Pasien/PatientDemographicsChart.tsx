"use client"

import { useMemo } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { analitikService } from '../../services/analitik.service';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';

const cats = [{ l: 'Balita', m: 0, x: 5 }, { l: 'Anak-anak', m: 6, x: 11 }, { l: 'Remaja', m: 12, x: 17 }, { l: 'Dewasa', m: 18, x: 55 }, { l: 'Lansia', m: 56, x: 150 }];

export const PatientDemographicsChart = () => {
  const { data: d = [], isLoading: load, error: err } = useQuery({ queryKey: ['patients'], queryFn: async () => (await analitikService.getAllPatients({ page: 1, limit: 1000 })).data?.data || [], staleTime: 300000 });

  const { ageGroups: aG, genderData: gD, totalPatients: t } = useMemo(() => {
    let mc = 0, fc = 0, ac = Object.fromEntries(cats.map(c => [c.l, 0]));
    d.forEach((p: any) => {
      try {
        const b = new Date(p.tanggalLahir), n = new Date();
        let a = n.getFullYear() - b.getFullYear();
        if (n.getMonth() < b.getMonth() || (n.getMonth() === b.getMonth() && n.getDate() < b.getDate())) a--;
        a = Math.max(0, a);
        const c = cats.find(x => a >= x.m && a <= x.x);
        if (c) ac[c.l]++;
        if (p.jenisKelamin === 'LAKI_LAKI') mc++; else if (p.jenisKelamin === 'PEREMPUAN') fc++;
      } catch (e) {}
    });
    const tl = d.length;
    return {
      ageGroups: cats.map(c => ({ l: c.l, m: c.m, x: c.x, c: ac[c.l], p: tl ? Math.round((ac[c.l] / tl) * 100) : 0 })),
      genderData: [{ n: 'Perempuan', v: tl ? Math.round((fc / tl) * 100) : 0, c: '#1B9C90' }, { n: 'Laki-laki', v: tl ? Math.round((mc / tl) * 100) : 0, c: '#DFF6F2' }],
      totalPatients: tl
    };
  }, [d]);

  if (load) return <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-3xl"><div className="h-40 bg-gray-100 rounded-lg animate-pulse" /></Card>;
  if (err || !t) return <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-3xl"><p className="text-red-600 text-sm">Gagal memuat demografi.</p></Card>;

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm w-full max-w-3xl">
      <div><h3 className="text-lg font-bold text-[#13222D]">Demografi Pasien (Usia & Gender)</h3><p className="text-xs font-medium text-[#67737C] mt-1">Total Basis Data: <span className="text-[#13222D] font-bold">{t.toLocaleString('id-ID')} Pasien</span> dari RME Database</p></div>
      <div className="flex flex-col md:flex-row gap-8 items-center justify-between mt-8">
        <div className="space-y-4 flex-1 w-full">
          {aG.map(i => (
            <div key={i.l} className="flex items-center gap-3">
              <div className="w-24 flex flex-col justify-center shrink-0"><span className="text-sm font-bold text-[#13222D] leading-tight">{i.l}</span><span className="text-[11px] font-medium text-[#67737C] leading-none mt-0.5">{i.l === 'Lansia' ? `> ${i.m} tahun` : `${i.m} - ${i.x} thn`}</span></div>
              <div className="flex-1 h-4 bg-[#EFF4F8] rounded-full overflow-hidden shadow-sm self-center"><div className="h-full bg-linear-to-r from-[#1B9C90] to-[#16a395] rounded-full" style={{ width: `${i.p}%` }} /></div>
              <span className="text-lg font-black text-[#1B9C90] text-right min-w-12.5 self-center">{i.p}%</span>
              <span className="text-sm font-bold text-[#67737C] text-right min-w-10 self-center">({i.c})</span>
            </div>
          ))}
        </div>
        <div className="hidden md:block w-px h-40 bg-[#DFE6EB] self-center mx-2" />
        <div className="flex flex-col items-center justify-center shrink-0 min-w-50 w-full md:w-auto">
          <div className="relative w-28 h-28 shrink-0 mb-4">
            <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={gD} cx="50%" cy="50%" innerRadius={36} outerRadius={46} paddingAngle={2} dataKey="v">{gD.map((e, i) => <Cell key={i} fill={e.c} />)}</Pie></PieChart></ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center"><Users className="w-5 h-5 text-[#67737C]" /></div>
          </div>
          <div className="flex items-center justify-center gap-6 w-full text-left">
            {gD.map((g, i) => (
              <div key={g.n} className="flex flex-col">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#13222D]"><div className={cn("w-2.5 h-2.5 rounded-full shrink-0", !i ? "bg-[#1B9C90]" : "bg-[#DFF6F2] border border-[#DFE6EB]")} />{g.n}</div>
                <span className="text-xs font-bold text-[#13222D] pl-4 mt-0.5 whitespace-nowrap">{g.v}% <span className="text-[10px] font-medium text-[#67737C]">({Math.round((g.v / 100) * t)})</span></span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};