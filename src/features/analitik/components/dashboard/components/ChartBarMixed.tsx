"use client"

import React from 'react'
import { Activity, Pill, Stethoscope, HeartPulse } from "lucide-react"
import {
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"

const chartData = [
  { item: "Konsultasi Dokter Umum", value: 85, count: 1700, total: 2000, type: "layanan" },
  { item: "Cek Darah Lengkap", value: 55, count: 1100, total: 2000, type: "laboratorium" },
  { item: "Amoxicillin 500mg", value: 45, count: 900, total: 2000, type: "produk" },
  { item: "USG Kehamilan", value: 30, count: 600, total: 2000, type: "layanan" },
]

export function ChartBarMixed() {
  // Fungsi penentu ikon berdasarkan tipe item agar lebih interaktif
  const getItemIcon = (type: string) => {
    switch (type) {
      case "layanan":
        return <Stethoscope className="w-4 h-4 text-[#1B9C90]" />;
      case "produk":
        return <Pill className="w-4 h-4 text-[#1B9C90]" />;
      case "laboratorium":
        return <HeartPulse className="w-4 h-4 text-[#1B9C90]" />;
      default:
        return <Activity className="w-4 h-4 text-[#1B9C90]" />;
    }
  };

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
                    ({data.count.toLocaleString('id-ID')} unit)
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