"use client";

import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
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

const chartConfig = {
  cashIn: {
    label: "Kas Masuk",
    color: "#1B9C90",
  },
  cashOut: {
    label: "Kas Keluar",
    color: "#E62C2C",
  },
} satisfies ChartConfig;

export function CashFlowChart() {
  // Fetch cashflow summary
  const cashflowQuery = useQuery({
    queryKey: ["cashflowSummary"],
    queryFn: () => analitikService.getCashflowSummary(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  // Fetch revenue trend untuk kombinasi data
  const revenueQuery = useQuery({
    queryKey: ["revenueTrend"],
    queryFn: () => analitikService.getRevenueTrend(),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const loading = cashflowQuery.isPending || revenueQuery.isPending;
  const error = cashflowQuery.error || revenueQuery.error;
  
  const cashflowData = cashflowQuery.data?.data;
  const revenueData = revenueQuery.data?.data;

  // Prepare chart data dari revenue trend
  const chartData = revenueData?.grafik_tren_harian?.map((item: any) => ({
    week: item.tanggal,
    cashIn: item.total || 0,
    cashOut: Math.max(0, (item.total || 0) * 0.4), // Estimasi 40% untuk cashOut
  })) || [];

  if (loading) {
    return (
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-base font-bold text-[#13222D]">
            Arus Kas Masuk vs Keluar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
        <CardHeader className="p-6 pb-0">
          <CardTitle className="text-base font-bold text-[#13222D]">
            Arus Kas Masuk vs Keluar
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-red-600 text-sm">
            Error: {error instanceof Error ? error.message : "Gagal memuat data"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      <CardHeader className="p-6 pb-0">
        <div className="space-y-2">
          <CardTitle className="text-base font-bold text-[#13222D]">
            Arus Kas Masuk vs Keluar
          </CardTitle>
          {cashflowData && (
            <div className="flex gap-4 text-xs">
              <div className="space-y-1">
                <span className="font-semibold text-[#67737C]">Kas Masuk Hari Ini</span>
                <p className="text-lg font-black text-[#1B9C90]">
                  Rp {cashflowData.kas_masuk_harian?.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="h-12 w-[1px] bg-[#DFE6EB]" />
              <div className="space-y-1">
                <span className="font-semibold text-[#67737C]">Invoice Belum Lunas</span>
                <p className="text-lg font-black text-[#E62C2C]">
                  Rp {cashflowData.nilai_total_invoice_belum_lunas?.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="h-12 w-[1px] bg-[#DFE6EB]" />
              <div className="space-y-1">
                <span className="font-semibold text-[#67737C]">Transaksi</span>
                <p className="text-lg font-black text-[#13222D]">
                  {cashflowData.total_transaksi_lunas_hari_ini} Lunas / {cashflowData.total_transaksi_pending_hari_ini} Pending
                </p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="cashInGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1B9C90" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#1B9C90" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="cashOutGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E62C2C" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#E62C2C" stopOpacity={0.0} />
              </linearGradient>
            </defs>
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
              content={
                <ChartTooltipContent
                  className="bg-white border-[#DFE6EB] rounded-xl shadow-lg p-3 text-xs font-semibold"
                  formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`}
                />
              }
            />
            <Area
              type="monotone"
              dataKey="cashIn"
              stroke="#1B9C90"
              strokeWidth={2}
              fill="url(#cashInGlow)"
            />
            <Area
              type="monotone"
              dataKey="cashOut"
              stroke="#E62C2C"
              strokeWidth={2}
              fill="url(#cashOutGlow)"
            />
            <ChartLegend
              content={<ChartLegendContent className="text-xs font-bold text-[#13222D] mt-6 flex justify-end gap-4" />}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}