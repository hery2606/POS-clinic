"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Info, TrendingUp, Award, ActivitySquare, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { analitikService } from "../../services/analitik.service";

export function PatientAnalysisDashboard() {
  // Fetch patient analytics dari AI endpoint
  const analyticsQuery = useQuery({
    queryKey: ["patientAnalytics"],
    queryFn: () => analitikService.getPatientAnalytics(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Fetch patient stats dari RME endpoint
  const statsQuery = useQuery({
    queryKey: ["patientStats"],
    queryFn: () => analitikService.getPatientStats(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const loading = analyticsQuery.isPending || statsQuery.isPending;
  const error = analyticsQuery.error || statsQuery.error;
  
  const analytics = analyticsQuery.data?.data || null;
  const stats = statsQuery.data || null;

  const totalPasienSegmentasi = useMemo(() => {
    if (!analytics?.segmentasi) return 0;
    return analytics.segmentasi.pasien_lama + analytics.segmentasi.pasien_baru;
  }, [analytics]);

  const totalRme = stats?.total_pasien_rme || totalPasienSegmentasi;

  const totalSegmenRme = useMemo(() => {
    return (stats?.pasien_aktif || 0) + (stats?.pasien_tidak_aktif || 0);
  }, [stats]);

  const persenAktif = useMemo(() => {
    return totalSegmenRme > 0 ? Math.round(((stats?.pasien_aktif || 0) / totalSegmenRme) * 100) : 0;
  }, [stats, totalSegmenRme]);

  const retentionData = useMemo(() => {
    return [
      { name: "Aktif", value: stats?.pasien_aktif || 0, color: "#1B9C90" },
      { name: "Tidak Aktif", value: stats?.pasien_tidak_aktif || 0, color: "#EFF3F6" },
    ];
  }, [stats]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const avgSpend = useMemo(() => {
    if (!analytics?.pasien_spend_tertinggi?.length) return 0;
    return analytics.pasien_spend_tertinggi.reduce((sum: number, p: any) => sum + p.total_spend, 0) / analytics.pasien_spend_tertinggi.length;
  }, [analytics]);

  // ERROR HANDLING UI
  if (error) {
    return (
      <div className="w-full space-y-4">
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center gap-3 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <div>Gagal memuat sinkronisasi database: {error instanceof Error ? error.message : "Sistem Sibuk"}</div>
        </div>
      </div>
    );
  }

  // SKELETON SCREEN LOADING STATE
  if (loading || !analytics) {
    return (
      <div className="w-full space-y-5 animate-in fade-in duration-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white border border-slate-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="h-80 bg-white border border-slate-100 rounded-[24px] animate-pulse" />
          <div className="h-80 bg-white border border-slate-100 rounded-[24px] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      
      {/* ========================================== */}
      {/* PREMIUM BUSINESS HEADER (CLEAN & MINIMALIST) */}
      {/* ========================================== */}
      <div className="bg-white border border-[#DFE6EB] rounded-[24px] p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#F4FBF9] text-[#1B9C90] flex items-center justify-center border border-[#D2EBE7]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-[#13222D] uppercase tracking-wide">Analisis Demografi Pasien</h2>
            <p className="text-xs font-medium text-[#67737C]">Kompilasi intelijen rekam medis elektronik & status retensi klinik</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4FBF9] border border-[#D2EBE7] rounded-xl shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-[#1B9C90] animate-pulse" />
          <span className="text-[10px] font-black text-[#1B9C90] uppercase tracking-wider">Server RME Terkoneksi</span>
        </div>
      </div>

      {/* ========================================== */}
      {/* 1. TOP STATS CARDS: CORPORATE FLAT LOOK    */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: AI Analytics Total */}
        <Card className="bg-white border border-[#DFE6EB] rounded-2xl shadow-xs hover:border-[#1B9C90]/30 transition-colors">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black text-[#67737C] uppercase tracking-widest">AI Analytics</span>
              <ActivitySquare className="w-4 h-4 text-[#1B9C90]" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#13222D]">{(analytics.total_pasien_unik_periode_ini ?? 0).toLocaleString()}</h3>
              <p className="text-[11px] font-semibold text-[#67737C] mt-1">Pasien unik bulan berjalan</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Database Total */}
        <Card className="bg-white border border-[#DFE6EB] rounded-2xl shadow-xs hover:border-[#1B9C90]/30 transition-colors">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black text-[#67737C] uppercase tracking-widest">Registrasi RME</span>
              <Users className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-[#13222D]">{totalRme.toLocaleString()}</h3>
              <p className="text-[11px] font-semibold text-[#67737C] mt-1">Terdaftar di sistem utama</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Pasien Aktif */}
        <Card className="bg-white border border-[#DFE6EB] rounded-2xl shadow-xs hover:border-[#1B9C90]/30 transition-colors">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black text-[#67737C] uppercase tracking-widest">Rasio Pasien Aktif</span>
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-2xl font-black text-[#13222D]">{(stats?.pasien_aktif || 0).toLocaleString()}</h3>
              <div className="w-full bg-slate-100 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-[#1B9C90] rounded-full" style={{ width: `${persenAktif}%` }} />
              </div>
              <p className="text-[10px] font-bold text-emerald-600">{persenAktif}% Rasio Loyalitas</p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Top Spender */}
        <Card className="bg-white border border-[#DFE6EB] rounded-2xl shadow-xs hover:border-[#1B9C90]/30 transition-colors">
          <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
            <div className="flex items-center justify-between w-full">
              <span className="text-[10px] font-black text-[#67737C] uppercase tracking-widest">Kontribusi Tertinggi</span>
              <Award className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#13222D] truncate">
                {analytics.pasien_spend_tertinggi?.[0] ? formatCurrency(analytics.pasien_spend_tertinggi[0].total_spend) : "Rp 0"}
              </h3>
              <p className="text-[11px] font-semibold text-[#67737C] mt-1 truncate">
                👤 {analytics.pasien_spend_tertinggi?.[0]?.nama_pasien || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ========================================== */}
      {/* 2. AREA AKUMULASI GRAFIK & DATA LIST ROW   */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* KANVAS KIRI (5/12): SEGMENTASI DONUT CHART */}
        <Card className="lg:col-span-5 bg-white rounded-[24px] border border-[#DFE6EB] shadow-xs flex flex-col justify-between">
          <CardContent className="p-6 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-xs font-black text-[#13222D] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                📊 Rasio Keaktifan Pasien
              </h3>
              <div className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-medium text-[#67737C] leading-relaxed">
                <Info className="w-4 h-4 text-[#1B9C90] shrink-0 mt-0.5" />
                <p>Status interaksi terhitung dari total akumulasi <span className="text-[#13222D] font-bold">{totalSegmenRme.toLocaleString()}</span> rekam pasien medis terdaftar.</p>
              </div>
            </div>

            {/* AREA UTAMA DONUT CHART */}
            <div className="flex flex-col items-center justify-center flex-1 py-4 relative">
              <div className="relative w-40 h-40">
                <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
                  <PieChart>
                    <Pie
                      data={retentionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                      startAngle={90}
                      endAngle={-270}
                    >
                      {retentionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>

                {/* TEKS DI TENGAH DONUT */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-black text-[#13222D]">{persenAktif}%</span>
                  <span className="text-[9px] font-black text-[#67737C] uppercase tracking-widest mt-0.5">Aktif</span>
                </div>
              </div>
            </div>

            {/* LEGENDA KETERANGAN NOMINAL BAWAH */}
            <div className="grid grid-cols-2 gap-4 border-t border-slate-50 pt-4 w-full">
              <div className="text-center space-y-0.5 border-r border-slate-100 last:border-none">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Pasien Aktif</span>
                <span className="text-base font-black text-[#1B9C90]">{(stats?.pasien_aktif || 0).toLocaleString()}</span>
              </div>
              <div className="text-center space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Tidak Aktif</span>
                <span className="text-base font-black text-slate-500">{(stats?.pasien_tidak_aktif || 0).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* KANVAS KANAN (7/12): LIST TOP SPENDER KASIR CORPORATE STYLE */}
        <Card className="lg:col-span-7 bg-white rounded-[24px] border border-[#DFE6EB] shadow-xs flex flex-col justify-between">
          <CardContent className="p-6 h-full flex flex-col justify-between">
            <h3 className="text-xs font-black text-[#13222D] uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#1B9C90]" /> Peringkat Kontribusi Invoice Pasien
            </h3>

            {/* DAFTAR BARIS TOP SPENDER CLEAN SEGMENT */}
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[260px] pr-1 [scrollbar-width:thin]">
              {(analytics.pasien_spend_tertinggi || []).map((spender, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-[#FAFCFD] border border-slate-100 hover:border-[#1B9C90]/20 flex items-center justify-between gap-4 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {/* Penomoran Flat Minimalis */}
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 font-black text-xs text-slate-500 flex items-center justify-center shrink-0 shadow-2xs">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#13222D] text-xs md:text-sm truncate">
                        {spender.nama_pasien}
                      </p>
                      <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                        Kontribusi Kumulatif Tindakan & Obat
                      </p>
                    </div>
                  </div>
                  
                  {/* Nominal Flat Badge */}
                  <span className="text-xs font-black text-[#1B9C90] bg-white px-2.5 py-1 rounded-lg border border-slate-100 shrink-0">
                    {formatCurrency(spender.total_spend)}
                  </span>
                </div>
              ))}
            </div>

            {/* FOOTER RATA-RATA ACCUMULATION */}
            <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center text-[11px] font-bold text-slate-500">
              <span>Nilai Rata-rata Pembayaran Kontribusi:</span>
              <span className="text-slate-800 font-black">{formatCurrency(avgSpend)}</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}