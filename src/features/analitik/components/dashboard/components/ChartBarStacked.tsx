"use client"

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { analitikService } from "@/features/analitik/services/analitik.service"

export const description = "Stacked bar chart untuk Tren Pendapatan dan Kas Masuk"

// Data dummy yang disesuaikan dengan pola visual gambar (10 bar)
const defaultChartData = [
  { day: "01 Mei", pendapatan: 80, kasMasuk: 40, pendapatanCount: 80000, kasMasukCount: 40000, totalCount: 120000 },
  { day: "02 Mei", pendapatan: 150, kasMasuk: 60, pendapatanCount: 150000, kasMasukCount: 60000, totalCount: 210000 },
  { day: "03 Mei", pendapatan: 120, kasMasuk: 50, pendapatanCount: 120000, kasMasukCount: 50000, totalCount: 170000 },
  { day: "04 Mei", pendapatan: 200, kasMasuk: 80, pendapatanCount: 200000, kasMasukCount: 80000, totalCount: 280000 },
  { day: "05 Mei", pendapatan: 140, kasMasuk: 60, pendapatanCount: 140000, kasMasukCount: 60000, totalCount: 200000 },
  { day: "06 Mei", pendapatan: 240, kasMasuk: 100, pendapatanCount: 240000, kasMasukCount: 100000, totalCount: 340000 },
  { day: "07 Mei", pendapatan: 190, kasMasuk: 80, pendapatanCount: 190000, kasMasukCount: 80000, totalCount: 270000 },
  { day: "08 Mei", pendapatan: 260, kasMasuk: 110, pendapatanCount: 260000, kasMasukCount: 110000, totalCount: 370000 },
  { day: "09 Mei", pendapatan: 210, kasMasuk: 90, pendapatanCount: 210000, kasMasukCount: 90000, totalCount: 300000 },
  { day: "10 Mei", pendapatan: 300, kasMasuk: 130, pendapatanCount: 300000, kasMasukCount: 130000, totalCount: 430000 },
]

// Konfigurasi warna hijau sesuai dengan desain UI
const chartConfig = {
  pendapatan: {
    label: "Pendapatan",
    color: "#10b981", // Hijau Emerald Utama
  },
  kasMasuk: {
    label: "Kas Masuk",
    color: "#d1fae5", // Hijau Mint Pastel (Transparan/Light)
  },
} satisfies ChartConfig

const ChartSkeleton = () => (
  <div className="border-none">
    <CardHeader>
      <Skeleton className="h-6 w-64 mb-2" />
      <Skeleton className="h-4 w-80" />
    </CardHeader>
    <CardContent>
      <div className="min-h-75 w-full">
        <Skeleton className="h-full w-full" />
      </div>
    </CardContent>
    <CardFooter className="flex-col items-start gap-2 text-sm pt-4 border-t border-slate-50">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-96" />
    </CardFooter>
  </div>
)

export function ChartBarStacked() {
  const [chartData, setChartData] = useState(defaultChartData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cashflowData, setCashflowData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await analitikService.getCashflowSummary()
        
        if (response.status === 'success' && response.data) {
          const data = response.data
          setCashflowData(data)
          // You can update chart data based on cashflow summary if needed
          setChartData(defaultChartData)
        }
      } catch (err) {
        console.error('Error fetching cashflow data:', err)
        setError('Gagal memuat data kas masuk')
        setCashflowData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  if (isLoading) {
    return <ChartSkeleton />
  }

  if (error) {
    return (
      <div className="border-none">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-800">
            Tren Pendapatan & Kas Masuk
          </CardTitle>
          <CardDescription>Analisis performa keuangan 10 hari terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="min-h-75 w-full flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </div>
    )
  }

  return (
    <div className="border-none">
      <CardHeader>
        <CardTitle className="text-lg font-bold text-slate-800">
          Tren Pendapatan & Kas Masuk
        </CardTitle>
        <CardDescription>
          Kas Masuk Hari Ini: Rp {new Intl.NumberFormat('id-ID').format(cashflowData?.kas_masuk_harian || 0)} | 
          Transaksi Lunas: {cashflowData?.total_transaksi_lunas_hari_ini || 0} | 
          Pending: {cashflowData?.total_transaksi_pending_hari_ini || 0}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-75 w-full">
          <BarChart accessibilityLayer data={chartData} barGap={0}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.4} />
            <XAxis
              dataKey="day"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs text-muted-foreground"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} className="mt-4" />
            
            {/* Bar Pendapatan (Bawah) - Kapsul Bulat Sempurna */}
            <Bar
              dataKey="pendapatan"
              stackId="a"
              fill="var(--color-pendapatan)"
              radius={[10, 10, 10, 10]}
              maxBarSize={45}
            />
            {/* Bar Kas Masuk (Atas) - Kapsul Bulat Sempurna */}
            <Bar
              dataKey="kasMasuk"
              stackId="a"
              fill="var(--color-kasMasuk)"
              radius={[10, 10, 10, 10]}
              maxBarSize={45}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm pt-4 border-t border-slate-50">
        <div className="flex gap-2 leading-none font-medium text-emerald-600">
          Nilai Invoice Belum Lunas: Rp {new Intl.NumberFormat('id-ID').format(cashflowData?.nilai_total_invoice_belum_lunas || 0)} <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Menampilkan akumulasi invoice lunas vs total uang masuk secara harian
        </div>
      </CardFooter>
    </div>
  )
}