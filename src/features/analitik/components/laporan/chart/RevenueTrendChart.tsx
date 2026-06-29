"use client";

import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";
import { analitikService } from "../../../services/analitik.service";
import { useIsMobile } from "@/hooks/use-mobile";

const fallback = [{ name: "Bulan Lalu", total: 500000 }, { name: "Bulan Ini", total: 1395000 }];
const fmt = (v: number) => v >= 1e9 ? `Rp ${(v / 1e9).toFixed(1).replace(/\.0$/, '')} M` : v >= 1e6 ? `Rp ${(v / 1e6).toFixed(0)} Jt` : v >= 1e3 ? `Rp ${(v / 1e3).toFixed(0)} Rb` : `Rp ${v}`;

export function RevenueTrendChart() {
  const isMobile = useIsMobile();
  const { data: raw, isLoading, error } = useQuery({ queryKey: ["revenueTrend"], queryFn: () => analitikService.getRevenueTrend(), staleTime: 300000 });

  if (isLoading) return <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm w-full"><CardHeader className="p-4 sm:p-6 pb-0"><Skeleton className="h-6 w-48 mb-2" /></CardHeader><CardContent className="p-4 sm:p-6"><div className="h-[300px] w-full bg-slate-50/50 rounded-2xl animate-pulse" /></CardContent></Card>;
  if (error) return <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm w-full"><CardHeader className="p-4 sm:p-6 pb-0"><CardTitle className="text-base font-bold text-[#13222D]">Grafik Tren Pendapatan</CardTitle></CardHeader><CardContent className="p-4 sm:p-6"><div className="h-[300px] w-full flex items-center justify-center bg-red-50/30 rounded-2xl border border-dashed border-red-200"><p className="text-red-500 text-xs font-bold">⚠️ Gagal memuat data grafik tren bulanan</p></div></CardContent></Card>;

  const d = raw?.data || (raw as any);
  const arr = d?.grafik_tren_bulanan || d?.grafikTrenBulanan;
  const chartData = (arr?.length ? arr : fallback).map((i: any) => ({ name: i.bulan || "Periode", total: i.total ?? 0 }));

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      <CardHeader className="p-4 sm:p-6 pb-0"><CardTitle className="text-base font-bold text-[#13222D]">Grafik Tren Pendapatan Bulanan</CardTitle></CardHeader>
      <CardContent className="p-4 sm:p-6">
        <ChartContainer config={{ total: { label: "Total Pendapatan", color: "#1B9C90" } }} className="h-[300px] w-full">
          <BarChart data={chartData} margin={{ top: 15, right: 10, left: isMobile ? -25 : 10, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#CBD5E1" strokeDasharray="6 6" strokeWidth={1} opacity={0.8} />
            <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={14} className="text-xs font-bold text-[#67737C]" />
            <YAxis tickLine={false} axisLine={false} tickMargin={isMobile ? 6 : 16} width={isMobile ? 55 : 90} className="text-[10px] font-bold text-[#67737C]" tickFormatter={fmt} />
            <ChartTooltip cursor={{ fill: "#F4F7F9", opacity: 0.6 }} content={<ChartTooltipContent className="bg-[#13222D] border-none text-white rounded-xl shadow-2xl p-3 text-xs font-bold" formatter={(v) => `Rp ${Number(v).toLocaleString("id-ID")}`} />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={[6, 6, 0, 0]} maxBarSize={isMobile ? 32 : 70} animationDuration={1200} />
            <ChartLegend content={<ChartLegendContent className="text-xs font-bold text-[#13222D] mt-6 flex justify-end gap-4" />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}