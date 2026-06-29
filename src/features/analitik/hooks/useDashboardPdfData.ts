import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { analitikService } from "../services/analitik.service";

export type DashboardPdfData = {
  // KPI
  pendapatanHariIni: string;
  pendapatanMingguIni: string;
  totalPendapatanBulanan: string;
  trendHarian: string;
  trendMingguan: string;
  statusBulanan: string;

  // Periode
  periodLabel: string;
  tanggalCetak: string;

  // Tabel transaksi
  transaksi: Array<{
    tanggal: string;
    totalTransaksi: number;
    pendapatanLayanan: string;
    pendapatanObat: string;
    totalPendapatan: string;
  }>;

  // Tabel Produk & Layanan Terlaris
  topProducts: Array<{
    item: string;
    count: number;
    value: number;
    type: "produk" | "layanan";
  }>;

  // Analisis Metode Pembayaran
  payments: Array<{
    method: string;
    percentage: number;
    amount: string;
  }>;

  // Status
  isReady: boolean;
};

const formatToRupiah = (value: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value || 0);
};

const formatDateSafe = (dateStr: string): string => {
  if (!dateStr) return "";
  const parts = dateStr.split("T")[0].split("-");
  if (parts.length === 3) {
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    return `${day} ${months[monthIndex]} ${year}`;
  }
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${day} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const useDashboardPdfData = (periodLabel: string, filters?: any): DashboardPdfData => {
  // Query 1: Trend Pendapatan & Rincian Harian
  const { data: response, isLoading: isRevenueLoading } = useQuery({
    queryKey: ["revenueTrend"],
    queryFn: () => analitikService.getRevenueTrend(),
    staleTime: 5 * 60 * 1000,
  });

  // Query 2: Produk & Layanan Terlaris
  const { data: productResponse, isLoading: isProductLoading } = useQuery({
    queryKey: ["productAnalytics"],
    queryFn: () => analitikService.getProductAnalytics(),
    staleTime: 5 * 60 * 1000,
  });

  // Query 3: Payments Analytics
  const { data: paymentsResponse, isLoading: isPaymentsLoading } = useQuery({
    queryKey: ["paymentsAnalytics"],
    queryFn: () => analitikService.getPaymentsAnalytics(),
    staleTime: 5 * 60 * 1000,
  });

  const isLoading = isRevenueLoading || isProductLoading || isPaymentsLoading;

  const formattedData = useMemo<DashboardPdfData>(() => {
    const defaultData: DashboardPdfData = {
      pendapatanHariIni: "Rp 0",
      pendapatanMingguIni: "Rp 0",
      totalPendapatanBulanan: "Rp 0",
      trendHarian: "0.0% vs rata-rata harian",
      trendMingguan: "0.0% vs target omzet",
      statusBulanan: "Status Periode Berjalan Aktif",
      periodLabel: periodLabel || "Dashboard Analitik",
      tanggalCetak: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      transaksi: [],
      topProducts: [],
      payments: [],
      isReady: false,
    };

    const rawData = (response?.data || response) as any;
    const rawProductData = (productResponse?.data || productResponse) as any;
    if (!rawData) return defaultData;

    const selectedPeriod = filters?.selectedPeriod ?? "daily";
    const monthlyYear = filters?.monthlyYear ?? String(new Date().getFullYear());
    const startMonth = filters?.startMonth ?? "3";
    const endMonth = filters?.endMonth ?? "6";
    const startYear = filters?.startYear ?? String(new Date().getFullYear() - 1);
    const endYear = filters?.endYear ?? String(new Date().getFullYear());

    const rincianHarian = rawData.tabel_rincian_harian || [];

    // Filter rincian harian
    const filteredRincian = selectedPeriod === "daily" ? rincianHarian : rincianHarian.filter((item: any) => {
      const itemDate = new Date(item.tanggal);
      if (isNaN(itemDate.getTime())) return false;
      const yr = itemDate.getFullYear();
      const mo = itemDate.getMonth() + 1;
      if (selectedPeriod === "monthly") {
        return yr === Number(monthlyYear) && mo >= Number(startMonth) && mo <= Number(endMonth);
      }
      if (selectedPeriod === "yearly") {
        return yr >= Number(startYear) && yr <= Number(endYear);
      }
      return true;
    });

    const totalRevenue = filteredRincian.reduce((sum: number, item: any) => sum + (item.total_pendapatan || 0), 0);
    const totalTransaksi = filteredRincian.reduce((sum: number, item: any) => sum + (item.total_transaksi || 0), 0);
    const totalLayanan = filteredRincian.reduce((sum: number, item: any) => sum + (item.pendapatan_layanan || 0), 0);
    const totalObat = filteredRincian.reduce((sum: number, item: any) => sum + (item.pendapatan_obat || 0), 0);

    const transaksiMapped = filteredRincian.map((item: any) => ({
      tanggal: formatDateSafe(item.tanggal),
      totalTransaksi: item.total_transaksi || 0,
      pendapatanLayanan: formatToRupiah(item.pendapatan_layanan || 0),
      pendapatanObat: formatToRupiah(item.pendapatan_obat || 0),
      totalPendapatan: formatToRupiah(item.total_pendapatan || 0),
    }));

    // Product Mapping
    let hasActiveData = true;
    if (selectedPeriod === "monthly") {
      hasActiveData = (Number(monthlyYear) === 2026 && Number(startMonth) <= 6 && Number(endMonth) >= 6);
    } else if (selectedPeriod === "yearly") {
      hasActiveData = (Number(startYear) <= 2026 && Number(endYear) >= 2026);
    }

    let topProductsMapped: any[] = [];
    if (rawProductData) {
      const combined = [
        ...(rawProductData.produk_terlaris_top_10 || []).slice(0, 5).map((p: any) => ({
          item: p.nama_obat,
          value: hasActiveData ? Math.round(((p.jumlah_terjual || 0) / 150) * 100) : 0,
          count: hasActiveData ? p.jumlah_terjual || 0 : 0,
          type: "produk" as const,
        })),
        ...(rawProductData.pemeriksaan_layanan_terlaris || []).slice(0, 5).map((l: any) => ({
          item: l.nama_layanan,
          value: hasActiveData ? Math.round(((l.jumlah_transaksi || 0) / 120) * 100) : 0,
          count: hasActiveData ? l.jumlah_transaksi || 0 : 0,
          type: "layanan" as const,
        })),
      ];
      topProductsMapped = combined.sort((a, b) => b.value - a.value).slice(0, 5);
    }

    // KPI values
    let pendapatanHariIni = formatToRupiah(0);
    let pendapatanMingguIni = formatToRupiah(0);
    let totalPendapatanBulanan = formatToRupiah(0);
    let trendHarian = "0.0% vs rata-rata harian";
    let trendMingguan = "0.0% vs target omzet";
    let statusBulanan = "Status Periode Berjalan Aktif";

    if (selectedPeriod === "daily") {
      const hariIni = rawData.total_pendapatan_hari_ini ?? rawData.totalPendapatanHariIni ?? 0;
      const mingguIni = rawData.total_pendapatan_minggu_ini ?? rawData.totalPendapatanMingguIni ?? 0;
      const bulanIni = rawData.total_pendapatan_bulan_ini ?? rawData.totalPendapatanBulanIni ?? 0;

      const avgHarianMingguan = mingguIni / 7;
      const pTrendHariIni = avgHarianMingguan > 0 ? (hariIni / avgHarianMingguan * 100 - 100) : 0;
      trendHarian = `${pTrendHariIni >= 0 ? "+" : ""}${pTrendHariIni.toFixed(1)}% vs rata-rata harian`;

      const avgMingguanBulanan = bulanIni / 4;
      const pTrendMingguIni = avgMingguanBulanan > 0 ? (mingguIni / avgMingguanBulanan * 100 - 100) : 0;
      trendMingguan = `${pTrendMingguIni >= 0 ? "+" : ""}${pTrendMingguIni.toFixed(1)}% vs target omzet`;

      pendapatanHariIni = formatToRupiah(hariIni);
      pendapatanMingguIni = formatToRupiah(mingguIni);
      totalPendapatanBulanan = formatToRupiah(bulanIni);
    } else {
      const activePeriodText = selectedPeriod === "monthly" ? "Bulanan" : "Tahunan";
      pendapatanHariIni = formatToRupiah(totalRevenue);
      pendapatanMingguIni = formatToRupiah(totalLayanan);
      totalPendapatanBulanan = formatToRupiah(totalObat);
      trendHarian = `Total Pendapatan (${activePeriodText})`;
      trendMingguan = `Total Tindakan Medis (${activePeriodText})`;
      statusBulanan = `Total Penjualan Obat (${activePeriodText})`;
    }

    // Payments Mapping
    let paymentsMapped: any[] = [];
    if (paymentsResponse) {
      const data = paymentsResponse.data || (paymentsResponse as any);
      if (data && hasActiveData) {
        let persentaseMetode = data.persentase_metode || [];
        if (persentaseMetode.length === 0 && data.tren_metode_favorit && data.tren_metode_favorit.length > 0) {
          const activeMonth = [...data.tren_metode_favorit].reverse().find(
            (m: any) => (m.qris || 0) + (m.cash || 0) + (m.debit || 0) > 0
          );
          if (activeMonth) {
            const qrisVal = activeMonth.qris || 0;
            const cashVal = activeMonth.cash || 0;
            const debitVal = activeMonth.debit || 0;
            const total = qrisVal + cashVal + debitVal;
            if (total > 0) {
              persentaseMetode = [
                { metode: 'QRIS', persentase: Math.round((qrisVal / total) * 100), total_nominal: qrisVal },
                { metode: 'CASH', persentase: Math.round((cashVal / total) * 100), total_nominal: cashVal },
                { metode: 'DEBIT', persentase: Math.round((debitVal / total) * 100), total_nominal: debitVal }
              ].filter(item => item.total_nominal > 0);
            }
          }
        }
        
        paymentsMapped = persentaseMetode.map((p: any) => ({
          method: p.metode.toUpperCase() === "CASH" || p.metode.toUpperCase() === "TUNAI" ? "Tunai" : p.metode,
          percentage: Math.round(p.persentase),
          amount: formatToRupiah(p.total_nominal)
        }));
      }
    }

    return {
      pendapatanHariIni,
      pendapatanMingguIni,
      totalPendapatanBulanan,
      trendHarian,
      trendMingguan,
      statusBulanan,
      periodLabel: periodLabel || "Dashboard Analitik",
      tanggalCetak: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
      transaksi: transaksiMapped,
      topProducts: topProductsMapped,
      payments: paymentsMapped,
      isReady: true,
    };
  }, [response, productResponse, paymentsResponse, periodLabel, filters]);

  return isLoading ? {
    pendapatanHariIni: "Rp 0",
    pendapatanMingguIni: "Rp 0",
    totalPendapatanBulanan: "Rp 0",
    trendHarian: "0.0% vs rata-rata harian",
    trendMingguan: "0.0% vs target omzet",
    statusBulanan: "Status Periode Berjalan Aktif",
    periodLabel: periodLabel || "Dashboard Analitik",
    tanggalCetak: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    transaksi: [],
    topProducts: [],
    payments: [],
    isReady: false,
  } : formattedData;
};
