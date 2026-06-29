"use client";

import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Info, TrendingUp, Award, ActivitySquare, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { analitikService } from "../../services/analitik.service";

const fmt = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(v);

export function PatientAnalysisDashboard() {
  const { data: a, isPending: la, error: ea } = useQuery({ queryKey: ["patientAnalytics"], queryFn: () => analitikService.getPatientAnalytics(), staleTime: 300000 });
  const { data: s, isPending: ls, error: es } = useQuery({ queryKey: ["patientStats"], queryFn: () => analitikService.getPatientStats(), staleTime: 300000 });

  const loading = la || ls, error = ea || es, analytics = a?.data || null, stats = s || null;

  const totalRme = stats?.total_pasien_rme || ((analytics?.segmentasi?.pasien_lama || 0) + (analytics?.segmentasi?.pasien_baru || 0));
  const tSeg = (stats?.pasien_aktif || 0) + (stats?.pasien_tidak_aktif || 0);
  const pAktif = tSeg > 0 ? Math.round(((stats?.pasien_aktif || 0) / tSeg) * 100) : 0;
  const rData = [{ name: "Aktif", value: stats?.pasien_aktif || 0, color: "#1B9C90" }, { name: "Tidak Aktif", value: stats?.pasien_tidak_aktif || 0, color: "#EFF3F6" }];
  const avgSpend = analytics?.pasien_spend_tertinggi?.length ? analytics.pasien_spend_tertinggi.reduce((acc: number, x: any) => acc + x.total_spend, 0) / analytics.pasien_spend_tertinggi.length : 0;

  if (error) return <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3 text-xs font-bold"><AlertCircle className="w-4 h-4 shrink-0" /><div>Gagal memuat sinkronisasi database: {error instanceof Error ? error.message : "Sistem Sibuk"}</div></div>;

  if (loading || !analytics) return (
    <div className="w-full space-y-6">
      <div className="bg-white border border-[#DFE6EB] rounded-[24px] p-6 shadow-xs flex items-center justify-between"><Skeleton className="h-11 w-64 rounded-xl bg-[#EFF4F8]" /><Skeleton className="w-36 h-7 rounded-xl bg-[#EFF4F8]" /></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <Card key={i} className="bg-white border border-[#DFE6EB] rounded-2xl shadow-xs"><CardContent className="p-5 flex flex-col justify-between h-28"><Skeleton className="h-4 w-24 bg-[#EFF4F8]" /><Skeleton className="h-8 w-16 bg-[#EFF4F8]" /></CardContent></Card>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <Card className="lg:col-span-5 bg-white rounded-[24px] border border-[#DFE6EB] shadow-xs"><CardContent className="p-6 h-full min-h-[360px] flex flex-col justify-between"><Skeleton className="h-6 w-full bg-[#EFF4F8] mb-4" /><Skeleton className="w-36 h-36 rounded-full mx-auto bg-[#EFF4F8]" /><Skeleton className="h-8 w-full mt-4 bg-[#EFF4F8]" /></CardContent></Card>
        <Card className="lg:col-span-7 bg-white rounded-[24px] border border-[#DFE6EB] shadow-xs"><CardContent className="p-6 h-full min-h-[360px]"><Skeleton className="h-6 w-48 mb-4 bg-[#EFF4F8]" />{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12 w-full mb-2 bg-[#EFF4F8] rounded-xl" />)}</CardContent></Card>
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <div className="bg-white border border-[#DFE6EB] rounded-[24px] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5"><div className="w-11 h-11 rounded-xl bg-[#F4FBF9] text-[#1B9C90] flex items-center justify-center border border-[#D2EBE7]"><Users className="w-5 h-5" /></div><div><h2 className="text-base font-black text-[#13222D] uppercase tracking-wide">Analisis Demografi Pasien</h2><p className="text-xs font-medium text-[#67737C]">Kompilasi intelijen rekam medis elektronik & status retensi klinik</p></div></div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4FBF9] border border-[#D2EBE7] rounded-xl shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-[#1B9C90] animate-pulse" /><span className="text-[10px] font-black text-[#1B9C90] uppercase tracking-wider">Server RME Terkoneksi</span></div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "AI Analytics", i: ActivitySquare, v: (analytics.total_pasien_unik_periode_ini ?? 0).toLocaleString(), d: "Pasien unik bulan berjalan", c: "text-[#1B9C90]" },
          { l: "Registrasi RME", i: Users, v: totalRme.toLocaleString(), d: "Terdaftar di sistem utama", c: "text-slate-400" },
          { l: "Rasio Pasien Aktif", i: TrendingUp, v: (stats?.pasien_aktif || 0).toLocaleString(), d: `${pAktif}% Rasio Loyalitas`, c: "text-emerald-500", p: pAktif },
          { l: "Kontribusi Tertinggi", i: Award, v: analytics.pasien_spend_tertinggi?.[0] ? fmt(analytics.pasien_spend_tertinggi[0].total_spend) : "Rp 0", d: `👤 ${analytics.pasien_spend_tertinggi?.[0]?.nama_pasien || "N/A"}`, c: "text-amber-500" }
        ].map((x, i) => (
          <Card key={i} className="bg-white border border-[#DFE6EB] rounded-2xl shadow-xs hover:border-[#1B9C90]/30 transition-colors">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between w-full"><span className="text-[10px] font-black text-[#67737C] uppercase tracking-widest">{x.l}</span><x.i className={`w-4 h-4 ${x.c}`} /></div>
              <div className={x.p !== undefined ? "space-y-1.5" : ""}>
                <h3 className="text-2xl font-black text-[#13222D] truncate">{x.v}</h3>
                {x.p !== undefined && <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden"><div className="h-full bg-[#1B9C90] rounded-full" style={{ width: `${x.p}%` }} /></div>}
                <p className={`text-[11px] font-semibold mt-1 truncate ${x.p !== undefined ? "text-emerald-600 text-[10px]" : "text-[#67737C]"}`}>{x.d}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        <Card className="lg:col-span-5 bg-white rounded-[24px] border border-[#DFE6EB] shadow-xs flex flex-col justify-between">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div><h3 className="text-xs font-black text-[#13222D] uppercase tracking-wider mb-2">📊 Rasio Keaktifan Pasien</h3><div className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-medium text-[#67737C] leading-relaxed"><Info className="w-4 h-4 text-[#1B9C90] shrink-0 mt-0.5" /><p>Status interaksi terhitung dari total akumulasi <span className="text-[#13222D] font-bold">{tSeg.toLocaleString()}</span> rekam pasien medis terdaftar.</p></div></div>
            <div className="flex flex-col items-center justify-center flex-1 py-4 relative"><div className="relative w-40 h-40"><ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}><PieChart><Pie data={rData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" startAngle={90} endAngle={-270}>{rData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}</Pie></PieChart></ResponsiveContainer><div className="absolute inset-0 flex flex-col items-center justify-center"><span className="text-3xl font-black text-[#13222D]">{pAktif}%</span><span className="text-[9px] font-black text-[#67737C] uppercase tracking-widest mt-0.5">Aktif</span></div></div></div>
            <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 w-full"><div className="text-center space-y-0.5 border-r border-slate-100"><span className="text-[10px] font-bold text-slate-400 uppercase block">Pasien Aktif</span><span className="text-base font-black text-[#1B9C90]">{(stats?.pasien_aktif || 0).toLocaleString()}</span></div><div className="text-center space-y-0.5"><span className="text-[10px] font-bold text-slate-400 uppercase block">Tidak Aktif</span><span className="text-base font-black text-slate-500">{(stats?.pasien_tidak_aktif || 0).toLocaleString()}</span></div></div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-7 bg-white rounded-[24px] border border-[#DFE6EB] shadow-xs flex flex-col justify-between">
          <CardContent className="p-6 h-full flex flex-col justify-between">
            <h3 className="text-xs font-black text-[#13222D] uppercase tracking-wider mb-4 flex items-center gap-1.5"><Award className="w-4 h-4 text-[#1B9C90]" /> Peringkat Kontribusi Invoice Pasien</h3>
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[260px] pr-1 [scrollbar-width:thin]">
              {(analytics.pasien_spend_tertinggi || []).map((x: any, i: number) => (
                <div key={i} className="p-3 rounded-xl bg-[#FAFCFD] border border-slate-100 hover:border-[#1B9C90]/20 flex items-center justify-between gap-4 transition-all"><div className="flex items-center gap-3 min-w-0"><div className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-black text-xs text-slate-500 flex items-center justify-center shrink-0 shadow-2xs">{i + 1}</div><div className="min-w-0"><p className="font-bold text-[#13222D] text-xs md:text-sm truncate">{x.nama_pasien}</p><p className="text-[10px] font-medium text-slate-400 mt-0.5">Kontribusi Kumulatif Tindakan & Obat</p></div></div><span className="text-xs font-black text-[#1B9C90] bg-white px-2.5 py-1 rounded-lg border border-slate-100 shrink-0">{fmt(x.total_spend)}</span></div>
              ))}
            </div>
            <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center text-[11px] font-bold text-slate-500"><span>Nilai Rata-rata Pembayaran Kontribusi:</span><span className="text-slate-800 font-black">{fmt(avgSpend)}</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}