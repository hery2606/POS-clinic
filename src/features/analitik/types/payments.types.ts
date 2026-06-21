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
