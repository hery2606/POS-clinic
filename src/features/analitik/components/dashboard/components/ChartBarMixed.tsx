"use client"

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pill, Stethoscope, HeartPulse, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { analitikService } from '@/features/analitik/services/analitik.service'

interface ChartItem {
  item: string
  value: number
  count: number
  type: "layanan" | "produk" | "laboratorium"
}

const typeConfig = {
  layanan:      { icon: Stethoscope, color: '#1B9C90', bg: '#DFF6F2', label: 'Layanan' },
  produk:       { icon: Pill,        color: '#8E59FF', bg: '#F0EBFF', label: 'Produk'  },
  laboratorium: { icon: HeartPulse,  color: '#F2A618', bg: '#FFF9EB', label: 'Lab'     },
}

const barGradients = [
  'linear-gradient(90deg, #1B9C90, #84DFD4)',
  'linear-gradient(90deg, #8E59FF, #C4AEFF)',
  'linear-gradient(90deg, #F2A618, #FFD580)',
  'linear-gradient(90deg, #2297eb, #84C8FF)',
  'linear-gradient(90deg, #E62C2C, #FF9595)',
]

interface ChartBarMixedProps {
  filters: {
    selectedPeriod: string;
    monthlyYear: string;
    startMonth: string;
    endMonth: string;
    startYear: string;
    endYear: string;
  };
}

export function ChartBarMixed({ filters }: ChartBarMixedProps) {
  const { data: response, isLoading: loading, error } = useQuery({
    queryKey: ["productAnalytics"],
    queryFn: () => analitikService.getProductAnalytics(),
    staleTime: 5 * 60 * 1000,
  });

  const chartData = useMemo<ChartItem[]>(() => {
    const rawData = response?.data || (response as any);
    if (!rawData) return [];

    const { selectedPeriod, monthlyYear, startMonth, endMonth, startYear, endYear } = filters;

    let hasActiveData = true;
    if (selectedPeriod === "monthly") {
      const yr = Number(monthlyYear);
      const startM = Number(startMonth);
      const endM = Number(endMonth);
      hasActiveData = (yr === 2026 && startM <= 6 && endM >= 6);
    } else if (selectedPeriod === "yearly") {
      const startY = Number(startYear);
      const endY = Number(endYear);
      hasActiveData = (startY <= 2026 && endY >= 2026);
    }

    const combined: ChartItem[] = [
      ...(rawData.produk_terlaris_top_10 || []).slice(0, 5).map((p: any) => ({
        item: p.nama_obat,
        value: hasActiveData ? Math.round((p.jumlah_terjual / 150) * 100) : 0,
        count: hasActiveData ? p.jumlah_terjual : 0,
        type: "produk" as const,
      })),
      ...(rawData.pemeriksaan_layanan_terlaris || []).slice(0, 5).map((l: any) => ({
        item: l.nama_layanan,
        value: hasActiveData ? Math.round((l.jumlah_transaksi / 120) * 100) : 0,
        count: hasActiveData ? l.jumlah_transaksi : 0,
        type: "layanan" as const,
      })),
    ]

    return combined.sort((a, b) => b.value - a.value).slice(0, 5)
  }, [response, filters]);

  if (loading) {
    return (
      <div className="w-full h-full">
        <div className="flex items-center gap-3 mb-6">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
        <div className="space-y-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3.5 w-16" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full flex items-center justify-center h-40 text-xs text-red-500 font-bold">
        ⚠️ {error instanceof Error ? error.message : 'Gagal memuat data'}
      </div>
    )
  }

  const topItem = chartData[0]

  return (
    <div className="w-full h-full flex flex-col">
      {/* HEADER */}
      <div className="flex items-start gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#DFF6F2] flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-[#1B9C90]" />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#13222D]">Produk & Layanan Terlaris</h3>
          <p className="text-xs font-medium text-[#67737C] mt-0.5">
            {topItem
              ? `#1 — ${topItem.item} · ${topItem.count.toLocaleString('id-ID')} ${topItem.type === 'produk' ? 'unit' : 'transaksi'}`
              : 'Berdasarkan akumulasi bulan ini'}
          </p>
        </div>
      </div>

      {/* PROGRESS LIST */}
      <div className="space-y-4 flex-1">
        {chartData.map((data, index) => {
          const cfg = typeConfig[data.type] ?? typeConfig.layanan
          const Icon = cfg.icon
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-[10px] font-black text-slate-300 w-4 shrink-0">#{index + 1}</span>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: cfg.bg }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                  </div>
                  <span className="font-semibold text-[#13222D] truncate text-xs">{data.item}</span>
                  <Badge
                    className="text-[9px] font-bold border-none shadow-none uppercase px-1.5 py-0 shrink-0 hidden sm:inline-flex"
                    style={{ backgroundColor: cfg.bg, color: cfg.color }}
                  >
                    {cfg.label}
                  </Badge>
                </div>
                <div className="text-right shrink-0 pl-3">
                  <span className="font-black text-[#13222D] text-xs">{data.value}%</span>
                  <span className="text-[10px] font-medium text-[#67737C] ml-1">({data.count.toLocaleString('id-ID')})</span>
                </div>
              </div>

              {/* Gradient Progress Bar */}
              <div className="w-full h-3.5 bg-[#F4F7F9] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${Math.min(data.value, 100)}%`, background: barGradients[index] }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* FOOTER */}
      <div className="mt-6 pt-4 border-t border-[#F4F7F9] flex items-center justify-between text-[10px] font-bold text-[#67737C] uppercase tracking-wider">
        <span>Top {chartData.length} Item</span>
        <span className="text-[#1B9C90]">Akumulasi Bulan Ini</span>
      </div>
    </div>
  )
}