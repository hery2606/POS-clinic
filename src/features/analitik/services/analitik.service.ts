import { aiClient, rmeClient } from "@/api";
import { type RevenueTrendResponse, type CashflowSummaryResponse, type PaymentsAnalyticsResponse, type RevenueChartData, type FinancialSummaryResponse, type PatientAnalyticsResponse } from "../types/analitik.types.ts";
import { type ProductAnalyticsResponse } from "../types/produk.types.ts";
import { type PendingInvoicesResponse } from "../types/invoices.types.ts";
import { type VisumGenerateResponse } from "../types/visum.types.ts";
import { type PatientListResponse } from "../types/patient.types.ts";

export const analitikService = {
  // Ambil data tren pendapatan (revenue trend)
  getRevenueTrend: async (): Promise<RevenueTrendResponse> => {
    const response = await aiClient.get<RevenueTrendResponse>("/api/v1/ai/revenue/trend");
    return response.data;
  },

  // Ambil data cashflow summary
  getCashflowSummary: async (): Promise<CashflowSummaryResponse> => {
    const response = await aiClient.get<CashflowSummaryResponse>("/api/v1/ai/cashflow/summary");
    return response.data;
  },

  // Ambil data payments analytics
  getPaymentsAnalytics: async (): Promise<PaymentsAnalyticsResponse> => {
    const response = await aiClient.get<PaymentsAnalyticsResponse>("/api/v1/ai/payments/analytics");
    return response.data;
  },

  // Ambil data patient analytics
  getPatientAnalytics: async (): Promise<PatientAnalyticsResponse> => {
    const response = await aiClient.get<PatientAnalyticsResponse>("/api/v1/ai/patients/analytics");
    return response.data;
  },

  // Ambil data product analytics
  getProductAnalytics: async (): Promise<ProductAnalyticsResponse> => {
    const response = await aiClient.get<ProductAnalyticsResponse>("/api/v1/ai/products/analytics");
    return response.data;
  },

  // Ambil data pending invoices
  getPendingInvoices: async (): Promise<PendingInvoicesResponse> => {
    const response = await aiClient.get<PendingInvoicesResponse>("/api/v1/ai/invoices/pending");
    return response.data;
  },

  // Generate visum report
  generateVisumReport: async (): Promise<VisumGenerateResponse> => {
    const response = await aiClient.post<VisumGenerateResponse>("/api/v1/ai/visum/generate");
    return response.data;
  },

  // Ambil daftar semua pasien dari RME
  getAllPatients: async (): Promise<PatientListResponse> => {
  try {
    const response = await rmeClient.get<PatientListResponse>("/api/v1/patients", {
      params: {
        page: 1,
        limit: 1000
      }
    });
    console.log("✅ Pasien berhasil diambil dari RME");
    return response.data;
  } catch (error: any) {
    console.error("❌ Gagal mengambil data pasien dari RME");
    if (error.response?.status === 401) {
      console.error("🔐 Kesalahan Autentikasi: Token tidak valid atau expired");
    } else if (error.response?.data) {
      console.error("📋 Detail error:", error.response.data);
    } else if (error.message) {
      console.error("⚠️ Error:", error.message);
    }
    throw error;
  }
},

// Ambil ringkasan statistik total pasien dari database RME
getPatientStats: async (): Promise<{ total_pasien_rme: number; pasien_aktif: number; pasien_tidak_aktif: number }> => {
  try {
    const response = await rmeClient.get<PatientListResponse>("/api/v1/patients", {
      params: { page: 1, limit: 1 }
    });

    const totalPasien = response.data?.data?.meta?.total || 0;
    const arrayPasien = response.data?.data?.data || [];
    
    const pasienAktif = arrayPasien.filter(p => p.isActive).length;
    console.log(`✅ Statistik pasien berhasil diambil: Total=${totalPasien}, Aktif=${pasienAktif}`);

    return {
      total_pasien_rme: totalPasien,
      pasien_aktif: pasienAktif,
      pasien_tidak_aktif: totalPasien - pasienAktif
    };
  } catch (error: any) {
    console.error("❌ Gagal memuat statistik pasien dari RME");
    if (error.response?.status === 401) {
      console.error("🔐 Kesalahan Autentikasi: Token tidak valid atau expired");
    } else if (error.message) {
      console.error("⚠️ Error:", error.message);
    }
    return { total_pasien_rme: 0, pasien_aktif: 0, pasien_tidak_aktif: 0 };
  }
},

  // Contoh: Ambil data tren pendapatan bulanan/mingguan (fallback)
  getRevenueChartData: async (period: string): Promise<RevenueChartData[]> => {
    const response = await aiClient.get<RevenueChartData[]>("/analytics/revenue-trend", {
      params: { period },
    });
    return response.data;
  },

  // Contoh: Ambil ringkasan kartu KPI finansial (fallback)
  getFinancialSummary: async (monthYear: string): Promise<FinancialSummaryResponse> => {
    const response = await aiClient.get<FinancialSummaryResponse>("/analytics/summary", {
      params: { period: monthYear },
    });
    return response.data;
  },
};