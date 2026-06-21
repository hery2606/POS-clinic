export * from "./revenue.types";

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

export * from "./payments.types";

export interface PasienLoyalData {
  id_pasien: string;
  nama_pasien: string;
  kunjungan_terbanyak: number;
}

export interface PasienSpendData {
  id_pasien: string;
  nama_pasien: string;
  total_spend: number;
}

export interface PatientAnalyticsResponse {
  status: string;
  data: {
    total_pasien_unik_periode_ini: number;
    segmentasi: {
      pasien_baru: number;
      pasien_lama: number;
    };
    pasien_paling_loyal: PasienLoyalData[];
    pasien_spend_tertinggi: PasienSpendData[];
  };
}