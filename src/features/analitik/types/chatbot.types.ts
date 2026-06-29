// Tipe data berdasarkan response API Analytics Backend

export interface PaymentMethodsAnalyticsResponse {
  meta: {
    date_from: string;
    date_to: string;
    total_transactions: number;
    total_revenue: number;
  };
  data: {
    by_primary_method: Array<{
      method: string;
      count: number;
      total_amount: number;
      percentage: number;
      patient_names: string[];
    }>;
    split_bill_analysis: {
      total_split_transactions: number;
      common_combinations: Array<{
        combo: string[];
        count: number;
      }>;
    };
    bpjs_vs_umum: {
      bpjs: {
        count: number;
        total_bpjs_amount: number;
        total_non_bpjs_amount: number;
        patient_names: string[];
      };
      umum: {
        count: number;
        total_amount: number;
        patient_names: string[];
      };
    };
    trend_weekly: Array<{
      week: string;
      [method: string]: string | number; // QRIS, CASH, dll.
    }>;
  };
}

export interface RevenueAnalyticsResponse {
  meta: {
    date_from: string;
    date_to: string;
  };
  data: {
    total_revenue: number;
    total_billed: number;
    outstanding: {
      count: number;
      total_remaining: number;
    };
    avg_transaction_value: number;
    by_status: Record<string, {
      count: number;
      amount: number;
    }>; // e.g. "LUNAS", "PARTIAL", "PENDING_PAYMENT"
    trend_daily: Array<{
      date: string;
      revenue: number;
      transactions: number;
    }>;
  };
}

export interface SummaryAnalyticsResponse {
  period: string;
  generated_at: string;
  data: {
    total_revenue: number;
    total_billed: number;
    total_transactions: number;
    avg_transaction_value: number;
    outstanding_amount: number;
    outstanding_count: number;
    top_payment_method: string;
    bpjs_coverage_pct: number;
    split_bill_pct: number;
    revenue_by_method: Record<string, number>;
    status_breakdown: Record<string, number>;
  };
}

export interface TopSpendAnalyticsResponse {
  meta: {
    date_from: string;
    date_to: string;
    total_transactions: number;
    total_spend: number;
  };
  data: {
    top_by_insurance_type: Array<{
      type: string; // e.g. "UMUM", "BPJS"
      total_spend: number;
      count: number;
    }>;
    top_by_payment_method: Array<{
      method: string;
      total_paid: number;
      count: number;
    }>;
    value_distribution: Array<{
      range: string;
      count: number;
    }>;
    top_transactions: Array<{
      transaction_id: string;
      patient_name: string;
      total: number;
      paid_amount: number;
      payment_method: string;
      insurance_type: string;
      status: string;
      created_at: string;
    }>;
  };
}

export interface TopItemsAnalyticsResponse {
  meta: {
    date_from: string;
    date_to: string;
    total_items_sold: number;
    total_items_revenue: number;
    unique_items: number;
  };
  data: {
    top_by_quantity: Array<{
      item_name: string;
      item_type: string; // e.g. "OBAT"
      total_quantity: number;
      total_revenue: number;
      transaction_count: number;
      avg_price: number;
    }>;
    top_by_revenue: Array<{
      item_name: string;
      item_type: string;
      total_quantity: number;
      total_revenue: number;
      transaction_count: number;
      avg_price: number;
    }>;
    by_type: Array<{
      item_type: string;
      total_quantity: number;
      total_revenue: number;
      unique_items_count: number;
    }>;
    by_insurance: Record<string, {
      total_quantity: number;
      total_revenue: number;
    }>; // e.g. "BPJS": { total_quantity: ..., total_revenue: ... }
  };
}

export interface AiInsightAnalyticsResponse {
  insight: string;
  date_from: string;
  date_to: string;
  model: string;
  generated_at: string;
}
