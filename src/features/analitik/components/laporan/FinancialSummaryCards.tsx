"use client";

import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { analitikService } from "../../services/analitik.service";
import { type RevenueTrendResponse } from "../../types/analitik.types";

interface FinancialSummaryCardsProps {
  period?: string;
}

export function FinancialSummaryCards({ period = "2023-11" }: FinancialSummaryCardsProps) {
  const [data, setData] = useState<RevenueTrendResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRevenueTrend = async () => {
      try {
        setLoading(true);
        const response = await analitikService.getRevenueTrend();
        setData(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch revenue data");
        console.error("Error fetching revenue trend:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueTrend();
  }, [period]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (error) {
    return (
      <div className="w-full space-y-6">
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          Error: {error}
        </div>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="w-full space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
              <CardContent className="p-0 space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse w-24"></div>
                <div className="h-8 bg-gray-100 rounded animate-pulse w-40"></div>
                <div className="h-4 bg-gray-100 rounded animate-pulse w-32"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const totalRevenueThisMonth = data.total_pendapatan_bulan_ini;
  const comparison = data.perbandingan_bulan_ini_vs_lalu;
  const dailyAverage = totalRevenueThisMonth / 30; // Approximate daily average

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Total Pendapatan */}
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
          <CardContent className="p-0 space-y-2">
            <span className="text-xs font-semibold text-[#67737C]">
              Total Pendapatan Bulan Ini
            </span>
            <h3 className="text-2xl font-bold text-[#13222D]">
              {formatCurrency(totalRevenueThisMonth)}
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className={`${
                comparison.persentase_kenaikan >= 0 
                  ? "bg-[#DFF6F2] text-[#1B9C90]" 
                  : "bg-red-50 text-[#E62C2C]"
              } px-2 py-0.5 rounded-full flex items-center gap-1`}>
                {comparison.persentase_kenaikan >= 0 ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                {Math.abs(comparison.persentase_kenaikan).toFixed(1)}%
              </span>
              <span className="text-[#67737C]">
                vs Bulan Lalu ({formatCurrency(comparison.bulan_lalu)})
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Rata-rata Pendapatan Harian */}
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
          <CardContent className="p-0 space-y-2">
            <span className="text-xs font-semibold text-[#67737C]">
              Rata-rata Pendapatan Harian
            </span>
            <h3 className="text-2xl font-bold text-[#13222D]">
              {formatCurrency(dailyAverage)}
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="bg-[#DFF6F2] text-[#1B9C90] px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Estimated
              </span>
              <span className="text-[#67737C]">Rata-rata per hari</span>
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Pendapatan Minggu Ini */}
        <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-6 shadow-sm">
          <CardContent className="p-0 space-y-2">
            <span className="text-xs font-semibold text-[#67737C]">
              Total Pendapatan Minggu Ini
            </span>
            <h3 className="text-2xl font-bold text-[#13222D]">
              {formatCurrency(data.total_pendapatan_minggu_ini)}
            </h3>
            <div className="flex items-center gap-2 text-xs font-semibold">
              <span className="bg-[#DFF6F2] text-[#1B9C90] px-2 py-0.5 rounded-full flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Current
              </span>
              <span className="text-[#67737C]">Minggu ini</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}