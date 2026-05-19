"use client";

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

const chartData = [
  { week: "M1", cashIn: 32000000, cashOut: 20000000 },
  { week: "M2", cashIn: 45000000, cashOut: 22000000 },
  { week: "M3", cashIn: 38000000, cashOut: 25000000 },
  { week: "M4", cashIn: 51000000, cashOut: 31000000 },
];

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
  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      <CardHeader className="p-6 pb-0">
        <CardTitle className="text-base font-bold text-[#13222D]">
          Arus Kas Masuk vs Keluar
        </CardTitle>
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