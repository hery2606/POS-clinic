"use client";

import { useState, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Compressed mock data (April 1 to June 30, 2024)
const md = [222,150,97,180,167,120,242,260,373,290,301,340,245,180,409,320,59,110,261,190,327,350,292,210,342,380,137,220,120,170,138,190,446,360,364,410,243,180,89,150,137,200,224,170,138,230,387,290,215,250,75,130,383,420,122,180,315,240,454,380,165,220,293,310,247,190,385,420,481,390,498,520,388,300,149,210,227,180,293,330,335,270,197,240,197,160,448,490,473,380,338,400,499,420,315,350,235,180,177,230,82,140,81,120,252,290,294,220,201,250,213,170,420,460,233,190,78,130,340,280,178,230,178,200,470,410,103,160,439,380,88,140,294,250,323,370,385,320,438,480,155,200,92,150,492,420,81,130,426,380,307,350,371,310,475,520,107,170,341,290,408,450,169,210,317,270,480,530,132,180,141,190,434,380,448,490,149,200,103,160,446,400];
const cd = Array.from({ length: 91 }, (_, i) => { const d = new Date(2024, 3, 1 + i); return { date: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`, desktop: md[i * 2], mobile: md[i * 2 + 1] }; });

const cfg = { visitors: { label: "Total Kunjungan" }, desktop: { label: "Layanan Medis", color: "#1B9C90" }, mobile: { label: "Farmasi & Obat", color: "#4F46E5" } };

export const ChartAreaInteractive = ({ filters: f = { selectedPeriod: "daily", monthlyYear: "2026", startMonth: "3", endMonth: "6", startYear: "2025", endYear: "2026" } }: any) => {
  const [tr, setTr] = useState("90d");

  const fd = useMemo(() => {
    if (f.selectedPeriod === "daily") {
      const p = tr === "30d" ? 30 : tr === "7d" ? 7 : 90;
      return cd.filter(i => new Date(i.date) >= new Date(new Date("2024-06-30").setDate(new Date("2024-06-30").getDate() - p)));
    }
    if (f.selectedPeriod === "monthly") {
      if (f.monthlyYear === "2024") return cd.filter(i => { const m = new Date(i.date).getMonth() + 1; return m >= +f.startMonth && m <= +f.endMonth; });
      return Array.from({ length: (+f.endMonth - +f.startMonth + 1) * 10 }, (_, i) => { const m = +f.startMonth + Math.floor(i / 10), d = (i % 10) * 3 + 1; return { date: `${f.monthlyYear}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`, desktop: 0, mobile: 0 }; });
    }
    if (f.selectedPeriod === "yearly") {
      const res: any[] = [];
      for (let y = +f.startYear; y <= +f.endYear; y++) y === 2024 ? res.push(...cd) : Array.from({ length: 4 }).forEach((_, i) => res.push({ date: `${y}-${String(i * 3 + 1).padStart(2, '0')}-01`, desktop: 0, mobile: 0 }));
      return res.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return [];
  }, [tr, f]);

  return (
    <Card className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden w-full">
      <CardHeader className="flex flex-col items-start gap-4 space-y-0 border-b border-[#DFE6EB] p-6 sm:flex-row sm:items-center">
        <div className="grid flex-1 gap-1"><CardTitle className="text-base font-bold text-[#13222D]">Tren Analitik Kunjungan</CardTitle><CardDescription className="text-xs font-medium text-[#67737C]">Komparasi volume transaksi tindakan medis dan penebusan obat</CardDescription></div>
        <Select value={tr} onValueChange={setTr}>
          <SelectTrigger className="w-[160px] h-10 rounded-md border-[#DFE6EB] text-xs font-bold text-[#13222D] bg-[#F9FEFC] sm:ml-auto"><SelectValue placeholder="3 Bulan Terakhir" /></SelectTrigger>
          <SelectContent className="rounded-xl border-[#DFE6EB] bg-white text-xs font-semibold text-[#13222D]"><SelectItem value="90d">3 Bulan Terakhir</SelectItem><SelectItem value="30d">30 Hari Terakhir</SelectItem><SelectItem value="7d">7 Hari Terakhir</SelectItem></SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-6 sm:px-6">
        <ChartContainer config={cfg} className="aspect-auto h-[280px] w-full">
          <AreaChart data={fd} margin={{ left: -15, right: 10, top: 10, bottom: 5 }}>
            <defs>
              <linearGradient id="fd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#1B9C90" stopOpacity={0.2} /><stop offset="95%" stopColor="#1B9C90" stopOpacity={0} /></linearGradient>
              <linearGradient id="fm" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2} /><stop offset="95%" stopColor="#4F46E5" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#CBD5E1" strokeDasharray="6 6" strokeWidth={1} opacity={0.8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={12} className="text-[10px] font-bold text-[#67737C]" />
            <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={12} minTickGap={40} className="text-[11px] font-bold text-[#67737C]" tickFormatter={v => new Date(v).toLocaleDateString("id-ID", { month: "short", day: "numeric" })} />
            <ChartTooltip cursor={{ stroke: '#DFE6EB', strokeWidth: 1 }} content={<ChartTooltipContent className="bg-white border-[#DFE6EB] rounded-xl shadow-lg p-3 text-xs font-semibold" labelFormatter={v => new Date(v).toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} indicator="dot" />} />
            <Area dataKey="mobile" type="monotone" fill="url(#fm)" stroke="#4F46E5" strokeWidth={2} stackId="a" />
            <Area dataKey="desktop" type="monotone" fill="url(#fd)" stroke="#1B9C90" strokeWidth={2} stackId="a" />
            <ChartLegend content={<ChartLegendContent className="text-xs font-bold text-[#13222D] mt-6" />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};