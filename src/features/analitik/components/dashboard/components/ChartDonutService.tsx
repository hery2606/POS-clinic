"use client"

import * as React from "react"
import { Pie, PieChart, Label } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "Donut chart untuk Distribusi Layanan Klinik"

// Data distribusi layanan berdasarkan transaksi
const chartData = [
  { service: "konsultasi", value: 450, fill: "#10b981" }, // Hijau Emerald (Dominan)
  { service: "laboratorium", value: 280, fill: "#34d399" }, // Hijau Medium
  { service: "tindakan", value: 180, fill: "#6ee7b7" },     // Hijau Medium-Light
  { service: "radiologi", value: 95, fill: "#a7f3d0" },     // Hijau Light
  { service: "lainnya", value: 50, fill: "#f1f5f9" },       // Abu-abu terang
]

const chartConfig = {
  value: {
    label: "Total",
  },
  konsultasi: {
    label: "Konsultasi Umum",
  },
  laboratorium: {
    label: "Cek Darah & Lab",
  },
  tindakan: {
    label: "Tindakan Medis",
  },
  radiologi: {
    label: "USG & Radiologi",
  },
  lainnya: {
    label: "Layanan Lainnya",
  },
} satisfies ChartConfig

export function ChartDonutService() {
  // Menghitung total seluruh layanan untuk ditampilkan di tengah lingkaran
  const totalLayanan = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.value, 0)
  }, [])

  return (
    <Card className="border-none shadow-sm flex flex-col">
      <CardHeader className="items-start pb-0">
        <CardTitle className="text-lg font-bold text-slate-800">
          Distribusi Layanan
        </CardTitle>
        <CardDescription>Porsi transaksi berdasarkan kategori tindakan</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="service"
              innerRadius={60} 
              outerRadius={80}
              strokeWidth={5}
              stroke="#ffffff" 
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-slate-800 text-3xl font-extrabold"
                        >
                          {totalLayanan.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-xs uppercase tracking-wider"
                        >
                          Transaksi
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}