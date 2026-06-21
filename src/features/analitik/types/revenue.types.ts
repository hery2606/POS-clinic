export interface DailyTrendData {
  tanggal: string;
  total: number;
}

export interface MonthlyTrendData {
  bulan: string;
  total: number;
}

export interface ComparisonData {
  bulan_ini: number;
  bulan_lalu: number;
  persentase_kenaikan: number;
  status: string;
}

export interface DailyDetailData {
  tanggal: string;
  total_transaksi: number;
  pendapatan_layanan: number;
  pendapatan_obat: number;
  total_pendapatan: number;
}

export interface RevenueBreakdownData {
  layanan_medis_persen: number;
  farmasi_obat_persen: number;
}

export interface RevenueTrendResponse {
  status: string;
  data: {
    total_pendapatan_hari_ini: number;
    total_pendapatan_minggu_ini: number;
    total_pendapatan_bulan_ini: number;
    perbandingan_bulan_ini_vs_lalu: ComparisonData;
    breakdown_pendapatan: RevenueBreakdownData;
    tabel_rincian_harian: DailyDetailData[];
    grafik_tren_bulanan: MonthlyTrendData[];
    grafik_tren_harian?: DailyTrendData[];
    // Flat alternative schema properties from backend
    total_transaksi?: number;
    target_bulan_lalu?: number;
    persentase_kenaikan_mingguan?: number | null;
    persentase_kenaikan_bulanan?: number;
  };
}
