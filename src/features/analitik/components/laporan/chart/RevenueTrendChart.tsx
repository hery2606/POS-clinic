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
import { analitikService } from "../../../services/analitik.service";
import type { RevenueChartData } from "../../../types/analitik.types";

const chartConfig = {
  current: {
    label: "Bulan Ini",
    color: "#1B9C90",
  },
  previous: {
    label: "Bulan Lalu",
    color: "#DFF6F2",
  },
} satisfies ChartConfig;

const fallbackChartData: RevenueChartData[] = [
  { week: "M1", current: 28000000, previous: 22000000 },
  { week: "M2", current: 39000000, previous: 24000000 },
  { week: "M3", current: 32000000, previous: 29000000 },
  { week: "M4", current: 42500000, previous: 35600000 },
];

export function RevenueTrendChart() {
  // Fetch revenue trend data from AI API
  const revenueQuery = useQuery({
    queryKey: ["revenueTrend"],
    queryFn: () => analitikService.getRevenueTrend(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Transform API data to chart format
  const chartData = useMemo(() => {
    if (!revenueQuery.data?.data?.grafik_tren_bulanan) {
      return fallbackChartData;
    }

    const monthlyTrends = revenueQuery.data.data.grafik_tren_bulanan;
    const comparison = revenueQuery.data.data.perbandingan_bulan_ini_vs_lalu;

    // Map monthly data to chart format with comparison values
    return monthlyTrends.map((item: any, index: number) => ({
      week: item.bulan || `M${index + 1}`,
      current: item.total || 0,
      previous: index === monthlyTrends.length - 1 
        ? comparison?.bulan_lalu || 0 
        : (monthlyTrends[index - 1]?.total || 0),
    }));
  }, [revenueQuery.data]);

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-base font-bold text-[#13222D]">
          Grafik Tren Pendapatan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#EFF4F8" />
            <XAxis
              dataKey="week"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              className="text-xs font-bold text-[#67737C]"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              className="text-[10px] font-bold text-[#67737C]"
              tickFormatter={(val) => `Rp ${val / 1000000}M`}
            />
            <ChartTooltip
              cursor={{ fill: "#F4F7F9", opacity: 0.5 }}
              content={
                <ChartTooltipContent
                  className="bg-white border-[#DFE6EB] rounded-xl shadow-lg p-3 text-xs font-semibold"
                  formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`}
                />
              }
            />
            <Bar
              dataKey="previous"
              fill="var(--color-previous)"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="current"
              fill="var(--color-current)"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
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