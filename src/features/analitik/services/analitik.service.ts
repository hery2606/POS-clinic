import { apiClient } from "@/api/client";
import { type RevenueTrendResponse, type CashflowSummaryResponse, type PaymentsAnalyticsResponse, type RevenueChartData, type FinancialSummaryResponse } from "../types/analitik.types.ts";

export const analitikService = {
  // Ambil data tren pendapatan (revenue trend)
  getRevenueTrend: async (): Promise<RevenueTrendResponse> => {
    const response = await apiClient.get<RevenueTrendResponse>("/api/v1/ai/revenue/trend");
    return response.data;
  },

  // Ambil data cashflow summary
  getCashflowSummary: async (): Promise<CashflowSummaryResponse> => {
    const response = await apiClient.get<CashflowSummaryResponse>("/api/v1/ai/cashflow/summary");
    return response.data;
  },

  // Ambil data payments analytics
  getPaymentsAnalytics: async (): Promise<PaymentsAnalyticsResponse> => {
    const response = await apiClient.get<PaymentsAnalyticsResponse>("/api/v1/ai/payments/analytics");
    return response.data;
  },

  // Contoh: Ambil data tren pendapatan bulanan/mingguan (fallback)
  getRevenueChartData: async (period: string): Promise<RevenueChartData[]> => {
    const response = await apiClient.get<RevenueChartData[]>("/analytics/revenue-trend", {
      params: { period },
    });
    return response.data;
  },

  // Contoh: Ambil ringkasan kartu KPI finansial (fallback)
  getFinancialSummary: async (monthYear: string): Promise<FinancialSummaryResponse> => {
    const response = await apiClient.get<FinancialSummaryResponse>("/analytics/summary", {
      params: { period: monthYear },
    });
    return response.data;
  },
};