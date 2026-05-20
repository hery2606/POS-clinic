"use client"

import { useEffect, useState } from 'react'
import { Activity, Pill, Stethoscope, HeartPulse } from "lucide-react"
import {
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { analitikService } from '@/features/analitik/services/analitik.service'

interface ChartItem {
  item: string
  value: number
  count: number
  total: number
  type: "layanan" | "produk" | "laboratorium"
}

export function ChartBarMixed() {
  const [chartData, setChartData] = useState<ChartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await analitikService.getProductAnalytics()
        const data = response.data

        // Combine produk dan layanan data
        const combinedData: ChartItem[] = []

        // Add produk (top 5)
        data.produk_terlaris_top_10.slice(0, 5).forEach((produk) => {
          combinedData.push({
            item: produk.nama_obat,
            value: Math.round((produk.jumlah_terjual / 150) * 100), // Normalize based on max
            count: produk.jumlah_terjual,
            total: 2000,
            type: "produk",
          })
        })

        // Add layanan
        data.pemeriksaan_layanan_terlaris.slice(0, 5).forEach((layanan) => {
          combinedData.push({
            item: layanan.nama_layanan,
            value: Math.round((layanan.jumlah_transaksi / 120) * 100), // Normalize based on max
            count: layanan.jumlah_transaksi,
            total: 2000,
            type: "layanan",
          })
        })

        // Sort by value descending and take top items
        const sortedData = combinedData.sort((a, b) => b.value - a.value).slice(0, 4)
        setChartData(sortedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
        console.error('Error fetching product analytics:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getItemIcon = (type: string) => {
    switch (type) {
      case "layanan":
        return <Stethoscope className="w-4 h-4 text-[#1B9C90]" />
      case "produk":
        return <Pill className="w-4 h-4 text-[#1B9C90]" />
      case "laboratorium":
        return <HeartPulse className="w-4 h-4 text-[#1B9C90]" />
      default:
        return <Activity className="w-4 h-4 text-[#1B9C90]" />
    }
  }

  if (error) {
    return (
      <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden h-full w-full">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DFF6F2] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#1B9C90]" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[#13222D]">
                Produk & Layanan Terlaris
              </CardTitle>
              <CardDescription className="text-xs font-medium text-red-600 mt-0.5">
                Error: {error}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden h-full w-full">
        <CardHeader className="p-6 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DFF6F2] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#1B9C90]" />
            </div>
            <div>
              <CardTitle className="text-base font-bold text-[#13222D]">
                Produk & Layanan Terlaris
              </CardTitle>
              <CardDescription className="text-xs font-medium text-[#67737C] mt-0.5">
                Memuat data...
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-0">
          <div className="space-y-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-2.5 bg-gray-100 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[24px] border border-[#DFE6EB] shadow-sm overflow-hidden h-full w-full">
      {/* HEADER WIDGET */}
      <CardHeader className="p-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#DFF6F2] flex items-center justify-center">
            <Activity className="w-5 h-5 text-[#1B9C90]" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-[#13222D]">
              Produk & Layanan Terlaris
            </CardTitle>
            <CardDescription className="text-xs font-medium text-[#67737C] mt-0.5">
              Berdasarkan total unit dan transaksi bulan ini
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      {/* VISUALIZATION LIST WITH PROGRESS INDICATORS */}
      <CardContent className="p-6 pt-0">
        <div className="space-y-5">
          {chartData.map((data, index) => (
            <div key={index} className="space-y-2 group">
              
              {/* Row Label, Count, and Percentage */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Rank Number Indicator */}
                  <span className="text-xs font-black text-[#67737C]/40 min-w-[16px]">
                    #{index + 1}
                  </span>
                  
                  {/* Custom Minimalist Circle Icon */}
                  <div className="w-8 h-8 rounded-lg bg-[#F9FEFC] border border-[#DFE6EB] flex items-center justify-center shrink-0 shadow-inner group-hover:border-[#1B9C90]/30 transition-colors">
                    {getItemIcon(data.type)}
                  </div>
                  
                  {/* Item Name */}
                  <span className="font-bold text-[#13222D] truncate text-xs sm:text-sm">
                    {data.item}
                  </span>
                </div>

                {/* Performance Metrics */}
                <div className="text-right shrink-0 pl-4">
                  <span className="font-black text-[#13222D] text-xs sm:text-sm">
                    {data.value}%
                  </span>
                  <span className="text-[11px] font-semibold text-[#67737C] ml-1.5">
                    ({data.count.toLocaleString('id-ID')} {data.type === 'produk' ? 'unit' : 'transaksi'})
                  </span>
                </div>
              </div>

              {/* Linear Dynamic Progress Bar */}
              <div className="w-full h-2.5 bg-[#EFF4F8] rounded-full overflow-hidden relative">
                <div 
                  className="h-full bg-[#1B9C90] rounded-full transition-all duration-500 ease-out shadow-sm"
                  style={{ width: `${data.value}%` }}
                />
              </div>

            </div>
          ))}
        </div>
      </CardContent>

      {/* FOOTER WIDGET STATISTICS SUMMARY */}
      <div className="px-6 py-10 bg-[#F9FEFC] border-t border-[#DFE6EB] flex items-center justify-between text-[11px] font-bold text-[#67737C] uppercase tracking-wider">
        <span>Metrik Akumulasi</span>
        <span className="text-[#13222D]">Target: 2.000 Transaksi</span>
      </div>
    </div>
  )
}