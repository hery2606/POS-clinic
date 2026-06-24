"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown, Coins, Calendar, Receipt } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { analitikService } from "../../../services/analitik.service";
import { type RevenueTrendResponse } from "../../../types/revenue.types";
import { cn } from "@/lib/utils";

interface FinancialSummaryCardsProps {
  period?: string;
}

export function FinancialSummaryCards({ period }: FinancialSummaryCardsProps) {
  const [data, setData] = useState<RevenueTrendResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const activePeriod = period || todayStr;

  useEffect(() => {
    const fetchRevenueTrend = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: any = await analitikService.getRevenueTrend();
        
        // 🟢 DEFENSIVE PARSING: Mengamankan ekstraksi data mentah dari API
        const rawData = response?.data || response;
        if (rawData) {
          setData(rawData);
        } else {
          setError("Format response body tidak valid");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch revenue data");
        console.error("Error fetching revenue trend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueTrend();
  }, [activePeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getPreviousMonthStr = (periodStr: string) => {
    const parts = periodStr.split("-");
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    if (isNaN(y) || isNaN(m)) return "";
    const date = new Date(y, m - 1 - 1, 1);
    const prevYear = date.getFullYear();
    const prevMonth = String(date.getMonth() + 1).padStart(2, "0");
    return `${prevYear}-${prevMonth}`;
  };

  if (error) {
    return (
      <div className="w-full space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold shadow-xs">
          ⚠️ Gagal Memuat Finansial: {error}
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((i) => (
            <Card key={i} className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm">
              <CardContent className="p-0 space-y-3">
                <div className="h-4 bg-slate-100 rounded-md animate-pulse w-32"></div>
                <div className="h-8 bg-slate-100 rounded-xl animate-pulse w-48"></div>
                <div className="h-4 bg-slate-100 rounded-md animate-pulse w-40"></div>
              </CardContent>
            </Card>
          ))}
          <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-1">
            <CardContent className="p-0 space-y-3">
              <div className="h-4 bg-slate-100 rounded-md animate-pulse w-32"></div>
              <div className="h-8 bg-slate-100 rounded-xl animate-pulse w-48"></div>
              <div className="h-4 bg-slate-100 rounded-md animate-pulse w-40"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    );  
  }

  // Calculate dynamic metrics if data matching activePeriod exists in tabel_rincian_harian
  const rincianHarian = data.tabel_rincian_harian || [];
  const matchedDays = rincianHarian.filter(
    (item) => item.tanggal && item.tanggal.startsWith(activePeriod)
  );

  let totalRevenueThisMonth = 0;
  let totalRevenueThisWeek = 0;
  let dailyAverage = 0;
  let comparison = {
    bulan_ini: 0,
    bulan_lalu: 0,
    persentase_kenaikan: 0,
    status: "Naik"
  };

  const tempSumMonth = matchedDays.reduce((sum, d) => sum + (d.total_pendapatan || 0), 0);

  // Jika ada data di rincian harian untuk bulan yang dipilih DAN total sum > 0
  if (matchedDays.length > 0 && tempSumMonth > 0) {
    totalRevenueThisMonth = tempSumMonth;
    dailyAverage = totalRevenueThisMonth / matchedDays.length;

    // Chronological order for weekly slice
    const sortedMatchedDays = [...matchedDays].sort((a, b) => a.tanggal.localeCompare(b.tanggal));
    const last7Days = sortedMatchedDays.slice(-7);
    totalRevenueThisWeek = last7Days.reduce((sum, d) => sum + (d.total_pendapatan || 0), 0);

    // Previous month comparison
    const prevPeriod = getPreviousMonthStr(activePeriod);
    const prevMatchedDays = rincianHarian.filter(
      (item) => item.tanggal && item.tanggal.startsWith(prevPeriod)
    );
    const prevRevenue = prevMatchedDays.reduce((sum, d) => sum + (d.total_pendapatan || 0), 0);

    // Default comparison fallback if no data in list
    const fallbackPrevRevenue = data.perbandingan_bulan_ini_vs_lalu?.bulan_lalu || data.target_bulan_lalu || (data as any).targetBulanLalu || 500000;
    const finalPrevRevenue = prevRevenue > 0 ? prevRevenue : fallbackPrevRevenue;
    const changePercent = finalPrevRevenue > 0 ? ((totalRevenueThisMonth - finalPrevRevenue) / finalPrevRevenue) * 100 : 0;

    comparison = {
      bulan_ini: totalRevenueThisMonth,
      bulan_lalu: finalPrevRevenue,
      persentase_kenaikan: changePercent,
      status: changePercent >= 0 ? "Naik" : "Turun"
    };
  } else {
    // JIKA TIDAK ADA DATA:
    // Cek apakah bulan yang dipilih adalah bulan INI secara real-time.
    // Jika YA, gunakan summary dari API (kalau ada).
    // Jika BUKAN bulan ini (contoh: masa lalu/masa depan), paksa semuanya jadi 0.
    if (activePeriod === todayStr) {
      totalRevenueThisMonth = data.total_pendapatan_bulan_ini ?? (data as any).totalPendapatanBulanIni ?? 0;
      totalRevenueThisWeek = data.total_pendapatan_minggu_ini ?? (data as any).totalPendapatanMingguIni ?? 0;
      dailyAverage = totalRevenueThisMonth / 30;

      comparison = data.perbandingan_bulan_ini_vs_lalu || (data as any).perbandinganBulanIniVsLalu || {
        bulan_ini: totalRevenueThisMonth,
        bulan_lalu: data.target_bulan_lalu ?? (data as any).targetBulanLalu ?? 0,
        persentase_kenaikan: data.persentase_kenaikan_bulanan ?? (data as any).persentaseKenaikanBulanan ?? 0,
        status: (data.persentase_kenaikan_bulanan ?? (data as any).persentaseKenaikanBulanan ?? 0) >= 0 ? 'Naik' : 'Turun'
      };
    } else {
      // SET KE NOL KARENA PERIODE TIDAK MEMILIKI DATA
      totalRevenueThisMonth = 0;
      totalRevenueThisWeek = 0;
      dailyAverage = 0;
      comparison = {
        bulan_ini: 0,
        bulan_lalu: 0,
        persentase_kenaikan: 0,
        status: 'Turun'
      };
    }
  }

  const isPositiveTrend = (comparison.persentase_kenaikan ?? 0) >= 0;

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: Total Pendapatan */}
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-0 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-[#67737C]">
                Total Pendapatan Bulan Ini
              </span>
              <div className="bg-[#F4FBF9] p-1.5 rounded-lg text-[#1B9C90]">
                <Receipt className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-[#13222D]">
              {formatCurrency(totalRevenueThisMonth)}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold pt-1">
              <span className={cn(
                "px-2 py-0.5 rounded-md border flex items-center gap-1 uppercase tracking-wide text-[10px] font-black shadow-none shrink-0",
                isPositiveTrend 
                  ? "text-[#137333] bg-[#E6F4EA] border-[#CCECD5]" 
                  : "text-[#C5221F] bg-[#FCE8E6] border-[#FAD2CF]"
              )}>
                {isPositiveTrend ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(comparison.persentase_kenaikan).toFixed(1)}%
              </span>
              <span className="text-[#67737C] tracking-tight">
                vs Bulan Lalu ({formatCurrency(comparison.bulan_lalu)})
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Rata-rata Pendapatan Harian */}
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-0 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-[#67737C]">
                Rata-rata Pendapatan Harian
              </span>
              <div className="bg-slate-50 p-1.5 rounded-lg text-slate-500">
                <Coins className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-[#13222D]">
              {formatCurrency(dailyAverage)}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold pt-1">
              <span className="bg-[#EFF4F8] text-[#67737C] border border-slate-200 px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wide text-[10px] font-black shadow-none shrink-0">
                Estimated
              </span>
              <span className="text-[#67737C]">Rata-rata per hari bulan ini</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Pendapatan Minggu Ini */}
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-200 sm:col-span-2 lg:col-span-1">
          <CardContent className="p-0 space-y-2">
            <div className="flex justify-between items-start">
              <span className="text-xs font-semibold text-[#67737C]">
                Total Pendapatan Minggu Ini
              </span>
              <div className="bg-[#EFF4F8] p-1.5 rounded-lg text-[#67737C]">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-[#13222D]">
              {formatCurrency(totalRevenueThisWeek)}
            </h3>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold pt-1">
              <span className="bg-[#DFF6F2] text-[#1B9C90] border border-[#1B9C90]/20 px-2 py-0.5 rounded-md flex items-center gap-1 uppercase tracking-wide text-[10px] font-black shadow-none shrink-0">
                Current
              </span>
              <span className="text-[#67737C]">Transaksi minggu berjalan</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}