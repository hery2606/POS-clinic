"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardTitle } from "@/components/ui/card";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent, 
  type ChartConfig 
} from "@/components/ui/chart";

const agingChartConfig = {
  amount: {
    label: "Nilai Piutang",
    color: "#1B9C90",
  },
} satisfies ChartConfig;

interface AgingDataItem {
  name: string;
  amount: number;
}

interface PiutangAgingChartProps {
  agingData: AgingDataItem[];
}

export function PiutangAgingChart({ agingData }: PiutangAgingChartProps) {
  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden lg:col-span-8 flex flex-col justify-between p-6">
      <div>
        <CardTitle className="text-base font-bold text-[#13222D]">
          Grafik Umur Piutang (Aging Schedule)
        </CardTitle>
        <p className="text-xs font-medium text-[#67737C] mt-1">
          Distribusi jumlah dana piutang tertahan berdasarkan durasi keterlambatan
        </p>
      </div>
      <div className="mt-6 flex-1 min-h-[260px]">
        <ChartContainer config={agingChartConfig} className="h-64 w-full">
          <BarChart data={agingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="#EFF4F8" />
            <XAxis
              dataKey="name"
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
              tickFormatter={(val) => `Rp ${val.toLocaleString("id-ID")}`}
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
              dataKey="amount"
              fill="var(--color-amount)"
              radius={[8, 8, 0, 0]}
              maxBarSize={48}
            />
          </BarChart>
        </ChartContainer>
      </div>
    </Card>
  );
}
