"use client";

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

const chartData = [
  { period: "Sep", aset: 450000000, liabilitas: 150000000 },
  { period: "Okt", aset: 490000000, liabilitas: 130000000 },
  { period: "Nov", aset: 540000000, liabilitas: 120000000 },
];

const chartConfig = {
  aset: {
    label: "Total Aset",
    color: "#1B9C90",
  },
  liabilitas: {
    label: "Kewajiban & Utang",
    color: "#F2A618",
  },
} satisfies ChartConfig;

export function BalanceSheetChart() {
  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-base font-bold text-[#13222D]">
          Ikhtisar Neraca Keuangan
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#EFF4F8" />
            <XAxis
              dataKey="period"
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
            <Bar dataKey="aset" fill="var(--color-aset)" radius={[6, 6, 0, 0]} maxBarSize={40} />
            <Bar dataKey="liabilitas" fill="var(--color-liabilitas)" radius={[6, 6, 0, 0]} maxBarSize={40} />
            <ChartLegend
              content={<ChartLegendContent className="text-xs font-bold text-[#13222D] mt-6 flex justify-end gap-4" />}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}