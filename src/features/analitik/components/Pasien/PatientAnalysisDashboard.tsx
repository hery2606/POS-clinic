"use client";

import { useQuery } from "@tanstack/react-query";
import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { analitikService } from "../../services/analitik.service";

export function PatientAnalysisDashboard() {
  // Fetch patient analytics dari AI endpoint
  const analyticsQuery = useQuery({
    queryKey: ["patientAnalytics"],
    queryFn: () => analitikService.getPatientAnalytics(),
    staleTime: 5 * 60 * 1000, // Cache selama 5 menit
    gcTime: 10 * 60 * 1000, // Keep cache selama 10 menit
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

  if (error) {
    return (
      <div className="w-full space-y-6">
        <h2 className="text-xl font-bold text-[#13222D] px-1">
          Analisis Pasien
        </h2>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          Error: {error instanceof Error ? error.message : "Failed to fetch data"}
        </div>
      </div>
    );
  }

  if (loading || !analytics) {
    return (
      <div className="w-full space-y-6 animate-in fade-in duration-300">
        <h2 className="text-xl font-bold text-[#13222D] px-1">
          Analisis Pasien
        </h2>
        <div className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  const totalPasienSegmentasi =
    analytics.segmentasi.pasien_lama + analytics.segmentasi.pasien_baru;
  const totalRme = stats?.total_pasien_rme || totalPasienSegmentasi;


  const totalSegmenRme =
    (stats?.pasien_aktif || 0) + (stats?.pasien_tidak_aktif || 0);
  const persenAktif =
    totalSegmenRme > 0
      ? Math.round(((stats?.pasien_aktif || 0) / totalSegmenRme) * 100)
      : 0;
  const persenTidakAktif =
    totalSegmenRme > 0
      ? Math.round(((stats?.pasien_tidak_aktif || 0) / totalSegmenRme) * 100)
      : 0;

  const retentionData = [
    { name: "Aktif", value: stats?.pasien_aktif || 0, color: "#1B9C90" },
    {
      name: "Tidak Aktif",
      value: stats?.pasien_tidak_aktif || 0,
      color: "#DFF6F2",
    },
  ];

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) return `Rp ${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `Rp ${(amount / 1000).toFixed(1)}K`;
    return `Rp ${amount}`;
  };

  const formatInitial = (name: string) => {
    return name ? name.split(" ")[0].charAt(0).toUpperCase() : "P";
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      <h2 className="text-xl font-bold text-[#13222D] px-1">Analisis Pasien</h2>

      {/* 1. TOP CARD: TOTAL PASIEN UNIK AI VS REAL DATABASE RME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#F0FAF8] border border-[#DFF6F2] rounded-[24px] shadow-sm overflow-hidden">
          <CardContent className="p-6 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-[#67737C] tracking-wide block">
                Total Pasien Unik (AI Analytics)
              </span>
              <span className="text-3xl font-bold text-[#13222D] tracking-tight block">
                {analytics.total_pasien_unik_periode_ini.toLocaleString()}
              </span>
              <span className="text-xs text-[#1B9C90] font-semibold mt-2 block">
                Berdasarkan analisis tren transaksi bulan ini
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-[#DFE6EB] text-[#1B9C90] shadow-sm">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#FFF7F0] border border-[#FFE8DB] rounded-[24px] shadow-sm overflow-hidden">
          <CardContent className="p-6 space-y-3">
            <div>
              <span className="text-xs font-bold text-[#67737C] tracking-wide block">
                Total Pasien Terdaftar (RME Database)
              </span>
              <span className="text-3xl font-bold text-[#13222D] tracking-tight block">
                {totalRme.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-[#67737C] font-medium">
              Data riil sinkron dengan nomor rekam medis terbitan klinik
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. RETENTION GRAPH VS TOP SPENDER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#13222D] mb-2">
              Segmen Pasien Baru vs Lama
            </h3>

            <div className="flex items-center gap-2 mb-4 p-3 bg-slate-50 rounded-xl border border-[#DFE6EB]/50">
              <Info className="w-4 h-4 text-[#1B9C90] shrink-0" />
              <span className="text-xs font-medium text-[#67737C]">
                Persentase dihitung dari total{" "}
                <span className="text-[#13222D] font-bold">
                  {totalSegmenRme} pasien
                </span>{" "}
                berdasarkan status aktif dari RME Database.
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center flex-1 py-4">
            <div className="relative w-36 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={retentionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={48}
                    outerRadius={58}
                    paddingAngle={0}
                    dataKey="value"
                    startAngle={90}
                    endAngle={-270}
                  >
                    {retentionData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-[#1B9C90]">
                  {persenAktif}%
                </span>
                <span className="text-[10px] font-bold text-[#67737C] uppercase tracking-wider">
                  Aktif
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-8 mt-6 w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#1B9C90]" />
                <div>
                  <span className="text-xs font-bold text-[#13222D] block">
                    Pasien Aktif
                  </span>
                  <span className="text-[11px] text-[#67737C] font-medium">
                    {stats?.pasien_aktif || 0} Jiwa ({persenAktif}%)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-3 h-3 rounded-full bg-[#DFF6F2] border border-[#1B9C90]/20" />
                <div>
                  <span className="text-xs font-bold text-[#13222D] block">
                    Tidak Aktif
                  </span>
                  <span className="text-[11px] text-[#67737C] font-medium">
                    {stats?.pasien_tidak_aktif || 0} Jiwa ({persenTidakAktif}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* TOP SPENDER BLOCK */}
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm flex flex-col justify-between">
          <h3 className="text-sm font-bold text-[#13222D] mb-4">
            Top Spender Pasien
          </h3>

          <div className="flex-1 flex flex-col justify-center space-y-4">
            {analytics.pasien_spend_tertinggi.map((spender, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl bg-[#F9FEFC] border border-[#DFE6EB]/50 hover:border-[#1B9C90]/30 transition-all group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-[#EFF4F8] text-[#67737C] font-bold text-sm flex items-center justify-center border border-[#DFE6EB] shrink-0 group-hover:bg-[#DFF6F2] group-hover:text-[#1B9C90] transition-colors">
                    {formatInitial(spender.nama_pasien)}
                  </div>
                  <span className="font-bold text-[#13222D] text-sm truncate">
                    {spender.nama_pasien}
                  </span>
                </div>
                <span className="font-bold text-[#13222D] text-sm pl-4 shrink-0">
                  {formatCurrency(spender.total_spend)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
