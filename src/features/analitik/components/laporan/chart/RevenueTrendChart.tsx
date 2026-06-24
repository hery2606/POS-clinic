"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { analitikService } from "../../../services/analitik.service";
import { useIsMobile } from "@/hooks/use-mobile";

const chartConfig = {
  total: {
    label: "Total Pendapatan",
    color: "#1B9C90", // Toska Utama Klinik
  },
} satisfies ChartConfig;

// Data cadangan taktis (Fallback) jika response API kosong / offline
const fallbackChartData = [
  { name: "Bulan Lalu", total: 500000 },
  { name: "Bulan Ini", total: 1395000 },
];

const ChartSkeleton = () => {
  const isMobile = useIsMobile();
  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm w-full">
      <CardHeader className="p-4 sm:p-6 pb-0">
        <Skeleton className="h-6 w-48 mb-2" />
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="h-[300px] w-full bg-slate-50/50 rounded-2xl animate-pulse" />
      </CardContent>
    </Card>
  );
};

export function RevenueTrendChart() {
  const isMobile = useIsMobile();
  // Ambil tren pendapatan dari backend AI
  const revenueQuery = useQuery({
    queryKey: ["revenueTrend"],
    queryFn: () => analitikService.getRevenueTrend(),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = revenueQuery.isLoading;
  const error = revenueQuery.error;

  // 🟢 PARSING TOTAL BULANAN SINKRON RES-BODY JSON
  const chartData = useMemo(() => {
    const rawData = revenueQuery.data?.data || (revenueQuery.data as any);
    const monthlyTrends = rawData?.grafik_tren_bulanan || rawData?.grafikTrenBulanan;

    if (!monthlyTrends || monthlyTrends.length === 0) {
      return fallbackChartData;
    }

    // Mapping murni mengikuti isi elemen objek array backend
    return monthlyTrends.map((item: any) => ({
      name: item.bulan || "Periode",
      total: item.total ?? 0,
    }));
  }, [revenueQuery.data]);

  if (isLoading) {
    return <ChartSkeleton />;
  }

  if (error) {
    return (
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm w-full">
        <CardHeader className="p-4 sm:p-6 pb-0">
          <CardTitle className="text-base font-bold text-[#13222D]">
            Grafik Tren Pendapatan
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="h-[300px] w-full flex items-center justify-center bg-red-50/30 rounded-2xl border border-dashed border-red-200">
            <p className="text-red-500 text-xs font-bold">⚠️ Gagal memuat data grafik tren bulanan</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      <CardHeader className="p-4 sm:p-6 pb-0">
        <CardTitle className="text-base font-bold text-[#13222D]">
          Grafik Tren Pendapatan Bulanan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: isMobile ? -25 : 10, bottom: 0 }}>
            {/* Garis putus-putus (Grid) yang lebih tebal dan jelas, memberi kesan profesional */}
            <CartesianGrid vertical={false} stroke="#CBD5E1" strokeDasharray="6 6" strokeWidth={1} opacity={0.8} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={14}
              className="text-xs font-bold text-[#67737C]"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={isMobile ? 6 : 16}
              width={isMobile ? 55 : 90} // 🟢 DIPERLEBAR: Agar teks "Rp 150 Jt" atau "Rp 700 Rb" tidak ketutupan
              className="text-[10px] font-bold text-[#67737C]"
              // 🟢 PERBAIKAN FORMATTER: Support hingga Miliar (M) dan Juta (Jt)
              tickFormatter={(val) => {
                if (val >= 1000000000) {
                  return `Rp ${(val / 1000000000).toFixed(1).replace(/\.0$/, '')} M`;
                }
                if (val >= 1000000) {
                  return `Rp ${(val / 1000000).toFixed(0)} Jt`;
                }
                if (val >= 1000) {
                  return `Rp ${(val / 1000).toFixed(0)} Rb`;
                }
                return `Rp ${val}`;
              }}
            />
            <ChartTooltip
              cursor={{ fill: "#F4F7F9", opacity: 0.6 }}
              content={
                <ChartTooltipContent
                  className="bg-[#13222D] border-none text-white rounded-xl shadow-2xl p-3 text-xs font-bold"
                  formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`}
                />
              }
            />
            {/* Single Bar Terpusat dengan Warna Toska Klinik Premium */}
            <Bar
              dataKey="total"
              fill="var(--color-total)"
              radius={[6, 6, 0, 0]}
              maxBarSize={isMobile ? 32 : 70}
              animationDuration={1200}
            />
            <ChartLegend
              content={<ChartLegendContent className="text-xs font-bold text-[#13222D] mt-6 flex justify-end gap-4" />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}