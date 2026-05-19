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

export interface RevenueTrendResponse {
  status: string;
  data: {
    total_pendapatan_hari_ini: number;
    total_pendapatan_minggu_ini: number;
    total_pendapatan_bulan_ini: number;
    perbandingan_bulan_ini_vs_lalu: ComparisonData;
    grafik_tren_harian: DailyTrendData[];
    grafik_tren_bulanan: MonthlyTrendData[];
  };
}

export interface CashflowSummaryResponse {
  status: string;
  data: {
    kas_masuk_harian: number;
    total_transaksi_lunas_hari_ini: number;
    total_transaksi_pending_hari_ini: number;
    nilai_total_invoice_belum_lunas: number;
  };
}

export interface RevenueChartData {
  week: string;
  current: number;
  previous: number;
}

export interface FinancialSummaryResponse {
  total_revenue: number;
  revenue_growth_percentage: number;
  daily_average_revenue: number;
  total_completed_transactions: number;
}

export interface PaymentMethodData {
  metode: string;
  persentase: number;
  total_nominal: number;
}

export interface TrendMethodData {
  bulan: string;
  qris: number;
  cash: number;
  debit: number;
}

export interface PaymentsAnalyticsResponse {
  status: string;
  data: {
    persentase_metode: PaymentMethodData[];
    tren_metode_favorit: TrendMethodData[];
  };
}