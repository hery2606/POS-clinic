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
  { week: "M1", current: 28000000, previous: 22000000 },
  { week: "M2", current: 39000000, previous: 24000000 },
  { week: "M3", current: 32000000, previous: 29000000 },
  { week: "M4", current: 42500000, previous: 35600000 },
];

const chartConfig = {
  current: {
    label: "Nov 2023",
    color: "#1B9C90",
  },
  previous: {
    label: "Okt 2023",
    color: "#DFF6F2",
  },
} satisfies ChartConfig;

export function RevenueTrendChart() {
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