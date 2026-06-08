'use client';

import { useEffect, useState } from 'react';
import { 
  Coins, 
  Calendar, 
  Receipt, 
  Users, 
  Clock 
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

// Pasang isi skeleton pas 5 buah agar simetris saat loading screen berjalan
const KPISkeleton = () => (
  <Card className="bg-white rounded-[24px] border border-[#DFE6EB] p-5 shadow-xs flex flex-col justify-between h-[130px]">
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-4 h-4 rounded-md" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-7 w-28 rounded-md" />
    </div>
    <Skeleton className="h-3 w-24 rounded-md mt-2" />
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
              value: `${data.grafik_tren_harian.length.toString()} Nota`,
              trend: `Periode riwayat berjalan aktif`,
              isPositive: true,
              icon: Users
            },
            {
              title: "Target Bulan Lalu",
              value: formatCurrency(comparison.bulan_lalu),
              trend: `Status Grafik: ${comparison.status}`,
              isPositive: comparison.status === 'Naik',
              icon: Clock
            }
          ];
          
          setKpiData(kpiItems);
        }
      } catch (err) {
        console.error('Error fetching KPI data:', err);
        setError('Gagal memuat ringkasan kartu KPI keuangan.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchKpiData();
  }, []);

  return (
    /* 🟢 KUNCI UTAMA: Mengunci grid di ukuran 5 kolom pas berdampingan */
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
      {isLoading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <KPISkeleton key={index} />
        ))
      ) : error ? (
        <div className="col-span-full text-center py-6 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold">
          ⚠️ {error}
        </div>
      ) : (
        kpiData.map((data, index) => {
          const Icon = data.icon;
          return (
            <Card 
              key={index} 
              className="bg-white rounded-[24px] border border-[#DFE6EB] p-5 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#1B9C90]/20 transition-all duration-200 h-[130px]"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {/* Mewarnai ikon dengan warna toska khas tema klinik agar seirama */}
                  <Icon className="w-4 h-4 text-[#1B9C90] bg-[#F4FBF9] p-0.5 rounded-md" />
                  <span className="text-[11px] font-black text-[#67737C] tracking-tight uppercase">
                    {data.title}
                  </span>
                </div>
                <h3 className="text-xl font-black text-[#13222D] tracking-tight">
                  {data.value}
                </h3>
              </div>
              
              <div className="mt-1">
                <span className={cn(
                  "text-[10px] font-black px-2 py-0.5 rounded-md border shadow-none uppercase tracking-wide",
                  data.isPositive 
                    ? "text-[#137333] bg-[#E6F4EA] border-[#CCECD5]" 
                    : "text-[#C5221F] bg-[#FCE8E6] border-[#FAD2CF]"
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