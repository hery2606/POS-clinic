'use client';

import { useEffect, useState } from 'react';
import { 
  Coins, 
  Calendar, 
  Receipt, 
  Users, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from "@/lib/utils";
import { analitikService } from '../../services/analitik.service';

interface KPIData {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: any;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

const KPISkeleton = () => (
  <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-5 shadow-sm flex flex-col justify-between">
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-8 w-32" />
    </div>
    <div className="mt-2">
      <Skeleton className="h-3 w-20" />
    </div>
  </Card>
);

export const KpiCards = () => {
  const [kpiData, setKpiData] = useState<KPIData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await analitikService.getRevenueTrend();
        
        if (response.status === 'success' && response.data) {
          const data = response.data;
          const comparison = data.perbandingan_bulan_ini_vs_lalu;
          
          const kpiItems: KPIData[] = [
            {
              title: "Pendapatan Hari Ini",
              value: formatCurrency(data.total_pendapatan_hari_ini),
              trend: `+${((data.total_pendapatan_hari_ini / (data.total_pendapatan_minggu_ini / 7)) * 100 - 100).toFixed(1)}% vs rata-rata`,
              isPositive: true,
              icon: Coins
            },
            {
              title: "Pendapatan Minggu Ini",
              value: formatCurrency(data.total_pendapatan_minggu_ini),
              trend: `+${((data.total_pendapatan_minggu_ini / (data.total_pendapatan_bulan_ini / 4)) * 100 - 100).toFixed(1)}% vs rata-rata`,
              isPositive: true,
              icon: Calendar
            },
            {
              title: "Pendapatan Bulan Ini",
              value: formatCurrency(data.total_pendapatan_bulan_ini),
              trend: `+${comparison.persentase_kenaikan.toFixed(2)}% vs bulan lalu`,
              isPositive: comparison.status === 'Naik',
              icon: Receipt
            },
            {
              title: "Total Transaksi",
              value: data.grafik_tren_harian.length.toString(),
              trend: `Periode: ${data.grafik_tren_harian[0]?.tanggal} - ${data.grafik_tren_harian[data.grafik_tren_harian.length - 1]?.tanggal}`,
              isPositive: true,
              icon: Users
            },
            {
              title: "Bulan Lalu",
              value: formatCurrency(comparison.bulan_lalu),
              trend: `${comparison.status}`,
              isPositive: comparison.status === 'Naik',
              icon: Clock
            },
            {
              title: "Bulan Ini",
              value: formatCurrency(comparison.bulan_ini),
              trend: `vs Rp ${(comparison.bulan_ini - comparison.bulan_lalu >= 0 ? '+' : '')} ${formatCurrency(comparison.bulan_ini - comparison.bulan_lalu)}`,
              isPositive: comparison.bulan_ini >= comparison.bulan_lalu,
              icon: AlertCircle
            }
          ];
          
          setKpiData(kpiItems);
        }
      } catch (err) {
        console.error('Error fetching KPI data:', err);
        setError('Gagal memuat data KPI');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKpiData();
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 w-full">
      {isLoading ? (
        // Skeleton loading state
        Array.from({ length: 6 }).map((_, index) => (
          <KPISkeleton key={index} />
        ))
      ) : error ? (
        // Error state
        <div className="col-span-full text-center py-8 text-red-500">
          {error}
        </div>
      ) : (
        // Loaded state
        kpiData.map((data, index) => {
          const Icon = data.icon;
          return (
            <Card 
              key={index} 
              className="bg-white rounded-[24px] border border-[#DFE6EB] p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-[#67737C]" />
                  <span className="text-xs font-semibold text-[#67737C] tracking-tight">
                    {data.title}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-[#13222D] tracking-tight">
                  {data.value}
                </h3>
              </div>
              
              <div className="mt-2">
                <span className={cn(
                  "text-xs font-bold",
                  data.isPositive ? "text-[#3EB268]" : "text-[#E62C2C]"
                )}>
                  {data.trend}
                </span>
              </div>
            </Card>
          );
        })
      )}
    </div>
  );
};