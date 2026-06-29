"use client";

import { useMemo } from "react";
import { Pie, PieChart, Label } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const d = [
  { s: "konsultasi", v: 450, fill: "#10b981" },
  { s: "laboratorium", v: 280, fill: "#34d399" },
  { s: "tindakan", v: 180, fill: "#6ee7b7" },
  { s: "radiologi", v: 95, fill: "#a7f3d0" },
  { s: "lainnya", v: 50, fill: "#f1f5f9" },
];

const c = {
  value: { label: "Total" },
  konsultasi: { label: "Konsultasi Umum" },
  laboratorium: { label: "Cek Darah & Lab" },
  tindakan: { label: "Tindakan Medis" },
  radiologi: { label: "USG & Radiologi" },
  lainnya: { label: "Layanan Lainnya" },
};

export const ChartDonutService = () => (
  <Card className="border-none shadow-sm flex flex-col">
    <CardHeader className="items-start pb-0"><CardTitle className="text-lg font-bold text-slate-800">Distribusi Layanan</CardTitle><CardDescription>Porsi transaksi berdasarkan kategori tindakan</CardDescription></CardHeader>
    <CardContent className="flex-1 pb-0">
      <ChartContainer config={c} className="mx-auto aspect-square max-h-62.5">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Pie data={d} dataKey="v" nameKey="s" innerRadius={60} outerRadius={80} strokeWidth={5} stroke="#ffffff">
            <Label content={({ viewBox: b }: any) => b?.cx ? (
              <text x={b.cx} y={b.cy} textAnchor="middle" dominantBaseline="middle">
                <tspan x={b.cx} y={b.cy} className="fill-slate-800 text-3xl font-extrabold">{d.reduce((a, c) => a + c.v, 0).toLocaleString()}</tspan>
                <tspan x={b.cx} y={b.cy + 24} className="fill-muted-foreground text-xs uppercase tracking-wider">Transaksi</tspan>
              </text>
            ) : null} />
          </Pie>
        </PieChart>
      </ChartContainer>
    </CardContent>
  </Card>
);