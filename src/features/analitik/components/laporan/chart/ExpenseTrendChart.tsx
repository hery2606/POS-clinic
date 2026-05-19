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
  { week: "M1", operasional: 12000000, medis: 15000000 },
  { week: "M2", operasional: 14000000, medis: 18000000 },
  { week: "M3", operasional: 11000000, medis: 12000000 },
  { week: "M4", operasional: 16000000, medis: 22000000 },
];

const chartConfig = {
  medis: {
    label: "Alkes & Obat",
    color: "#4F46E5",
  },
  operasional: {
    label: "Operasional",
    color: "#E0E7FF",
  },
} satisfies ChartConfig;

export function ExpenseTrendChart() {
  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-base font-bold text-[#13222D]">
          Grafik Analisa Pengeluaran
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
              dataKey="operasional"
              stackId="a"
              fill="var(--color-operasional)"
              radius={[0, 0, 0, 0]}
              maxBarSize={32}
            />
            <Bar
              dataKey="medis"
              stackId="a"
              fill="var(--color-medis)"
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