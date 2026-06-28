'use client';

import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  icon: React.ComponentType<any>;
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value || 0);
};

const KPISkeleton = ({ className }: { className?: string }) => (
  <Card className={cn("bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-5 flex flex-col justify-between min-h-[145px]", className)}>
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

interface KPICardsProps {
  filters: {
    selectedPeriod: string;
    monthlyYear: string;
    startMonth: string;
    endMonth: string;
    startYear: string;
    endYear: string;
  };
}

export const KpiCards = ({ filters }: KPICardsProps) => {
  // 🟢 OPTIMALISASI SENIOR: Konsumsi shared-cache dari TanStack Query tanpa memicu request API ganda
  const { data: response, isLoading, error } = useQuery({
    queryKey: ['revenueTrend'],
    queryFn: () => analitikService.getRevenueTrend(),
    staleTime: 5 * 60 * 1000,
  });

  const kpiData = useMemo<KPIData[]>(() => {
    const rawData = (response?.data || response) as any;
    if (!rawData) return [];

    const { selectedPeriod, monthlyYear, startMonth, endMonth, startYear, endYear } = filters;
    const rincianHarian = rawData.tabel_rincian_harian || rawData.tabelRincianHarian || [];

    if (selectedPeriod === "daily") {
      const hariIni = rawData.total_pendapatan_hari_ini ?? rawData.totalPendapatanHariIni ?? 0;
      const mingguIni = rawData.total_pendapatan_minggu_ini ?? rawData.totalPendapatanMingguIni ?? 0;
      const bulanIni = rawData.total_pendapatan_bulan_ini ?? rawData.totalPendapatanBulanIni ?? 0;

      const comparison = rawData.perbandingan_bulan_ini_vs_lalu || rawData.perbandinganBulanIniVsLalu || {
        bulan_ini: bulanIni,
        bulan_lalu: rawData.target_bulan_lalu ?? 0,
        persentase_kenaikan: 0,
        status: "Stabil"
      };

      const totalTransaksi = typeof rawData.total_transaksi === 'number'
        ? rawData.total_transaksi
        : (rawData.totalTransaksi ?? rincianHarian.reduce((sum: number, item: any) => sum + (item.total_transaksi || 0), 0));

      const avgHarianMingguan = mingguIni / 7;
      const trendHariIniText = avgHarianMingguan > 0 
        ? `${(hariIni / avgHarianMingguan * 100 - 100).toFixed(1)}% vs rata-rata`
        : "0.0% vs rata-rata";

      const avgMingguanBulanan = bulanIni / 4;
      const trendMingguIniText = avgMingguanBulanan > 0
        ? `${(mingguIni / avgMingguanBulanan * 100 - 100).toFixed(1)}% vs rata-rata`
        : "0.0% vs rata-rata";

      const pKenaikan = comparison.persentase_kenaikan ?? comparison.persentaseKenaikan ?? 0;
      const isBulanIniNaik = comparison.status === 'Naik' || pKenaikan >= 0;

      return [
        {
          title: "Pendapatan Hari Ini",
          value: formatCurrency(hariIni),
          trend: trendHariIniText,
          isPositive: hariIni >= avgHarianMingguan,
          icon: Coins
        },
        {
          title: "Pendapatan Minggu Ini",
          value: formatCurrency(mingguIni),
          trend: trendMingguIniText,
          isPositive: mingguIni >= avgMingguanBulanan,
          icon: Calendar
        },
        {
          title: "Pendapatan Bulan Ini",
          value: formatCurrency(bulanIni),
          trend: `${pKenaikan >= 0 ? '+' : ''}${pKenaikan.toFixed(0)}% vs bulan lalu`,
          isPositive: isBulanIniNaik,
          icon: Receipt
        },
        {
          title: "Total Transaksi",
          value: `${totalTransaksi} Nota`,
          trend: "Periode riwayat berjalan aktif",
          isPositive: true,
          icon: Users
        },
        {
          title: "Target Bulan Lalu",
          value: formatCurrency(comparison.bulan_lalu || comparison.bulanLalu || 0),
          trend: `Status Target: ${comparison.status || 'Stabil'}`,
          isPositive: isBulanIniNaik,
          icon: Clock
        }
      ];
    }

    // 🟢 Filter rincian harian berdasarkan tahun & bulan yang dipilih
    const filtered = rincianHarian.filter((item: any) => {
      const itemDate = new Date(item.tanggal);
      if (isNaN(itemDate.getTime())) return false;
      const yr = itemDate.getFullYear();
      const mo = itemDate.getMonth() + 1; // 1-indexed

      if (selectedPeriod === "monthly") {
        return yr === Number(monthlyYear) && mo >= Number(startMonth) && mo <= Number(endMonth);
      }
      if (selectedPeriod === "yearly") {
        return yr >= Number(startYear) && yr <= Number(endYear);
      }
      return true;
    });

    const totalRevenue = filtered.reduce((sum: number, item: any) => sum + (item.total_pendapatan || 0), 0);
    const totalTransaksi = filtered.reduce((sum: number, item: any) => sum + (item.total_transaksi || 0), 0);
    const totalLayanan = filtered.reduce((sum: number, item: any) => sum + (item.pendapatan_layanan || 0), 0);
    const totalObat = filtered.reduce((sum: number, item: any) => sum + (item.pendapatan_obat || 0), 0);

    if (selectedPeriod === "monthly") {
      const activeMonthsCount = Number(endMonth) - Number(startMonth) + 1;
      const avgMonthly = totalRevenue / Math.max(activeMonthsCount, 1);
      const isPositive = totalRevenue > 0;

      return [
        {
          title: "Total Pendapatan",
          value: formatCurrency(totalRevenue),
          trend: "Periode terpilih",
          isPositive,
          icon: Coins
        },
        {
          title: "Pendapatan Layanan",
          value: formatCurrency(totalLayanan),
          trend: "Total tindakan medis",
          isPositive,
          icon: Calendar
        },
        {
          title: "Farmasi & Obat",
          value: formatCurrency(totalObat),
          trend: "Total penjualan obat",
          isPositive,
          icon: Receipt
        },
        {
          title: "Total Transaksi",
          value: `${totalTransaksi} Nota`,
          trend: `${filtered.length} Hari aktif`,
          isPositive: true,
          icon: Users
        },
        {
          title: "Rata-rata Bulanan",
          value: formatCurrency(avgMonthly),
          trend: `Rentang ${activeMonthsCount} Bulan`,
          isPositive,
          icon: Clock
        }
      ];
    }

    if (selectedPeriod === "yearly") {
      const activeYearsCount = Number(endYear) - Number(startYear) + 1;
      const avgYearly = totalRevenue / Math.max(activeYearsCount, 1);
      const isPositive = totalRevenue > 0;

      return [
        {
          title: "Total Pendapatan",
          value: formatCurrency(totalRevenue),
          trend: "Kolektif tahunan",
          isPositive,
          icon: Coins
        },
        {
          title: "Pendapatan Layanan",
          value: formatCurrency(totalLayanan),
          trend: "Total tindakan medis",
          isPositive,
          icon: Calendar
        },
        {
          title: "Farmasi & Obat",
          value: formatCurrency(totalObat),
          trend: "Total penjualan obat",
          isPositive,
          icon: Receipt
        },
        {
          title: "Total Transaksi",
          value: `${totalTransaksi} Nota`,
          trend: `Tahun ${startYear} - ${endYear}`,
          isPositive: true,
          icon: Users
        },
        {
          title: "Rata-rata Tahunan",
          value: formatCurrency(avgYearly),
          trend: `Rentang ${activeYearsCount} Tahun`,
          isPositive,
          icon: Clock
        }
      ];
    }

    return [];
  }, [response, filters]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
        {[1, 2, 3, 4].map((idx) => (
          <KPISkeleton key={idx} />
        ))}
        <KPISkeleton className="sm:col-span-2 md:col-span-1 xl:col-span-1" />
      </div>
    );
  }

  if (error || kpiData.length === 0) {
    return (
      <div className="col-span-full w-full text-center py-5 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-semibold">
        ⚠️ Gagal menyinkronkan ringkasan metrik finansial eksekutif.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4 w-full">
      {kpiData.map((data, index) => {
        const Icon = data.icon;
        return (
          <Card 
            key={index} 
            className={cn(
              "bg-white rounded-[24px] border border-[#DFE6EB] p-4 sm:p-5 shadow-none flex flex-col justify-between hover:shadow-sm hover:border-[#1B9C90]/30 transition-all duration-150 min-h-[145px]",
              index === 4 && "sm:col-span-2 md:col-span-1 xl:col-span-1"
            )}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#1B9C90] bg-[#F4FBF9] p-0.5 rounded-md shrink-0" />
                <span className="text-[11px] font-bold text-[#67737C] tracking-tight uppercase">
                  {data.title}
                </span>
              </div>
              <h3 className="text-xl font-bold text-[#13222D] tracking-tight">
                {data.value}
              </h3>
            </div>
            
            <div className="mt-2">
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-md border tracking-wide uppercase inline-flex items-center break-words whitespace-normal max-w-full text-left",
                data.isPositive 
                  ? "text-[#137333] bg-[#E6F4EA] border-[#CCECD5]" 
                  : "text-[#C5221F] bg-[#FCE8E6] border-[#FAD2CF]"
              )}>
                {data.trend}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};