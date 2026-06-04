import { rmeClient } from "@/api";
import { type BillingResponse, type BillingPaginatedResponse, type Billing } from "../types/billing.types";

export const billingService = {
  /**
   * Mengambil daftar billing dengan status filter
   */
  getBillingByStatus: async (status: string): Promise<BillingResponse> => {
    const response = await rmeClient.get<BillingResponse>("/api/v1/billing", {
      params: { status }
    });
    return response.data;
  },

  /**
   * Mengambil semua billing dengan pagination
   */
  getAllBilling: async (page: number = 1, limit: number = 10): Promise<BillingPaginatedResponse> => {
    const response = await rmeClient.get<BillingPaginatedResponse>("/api/v1/billing", {
      params: { page, limit }
    });
    return response.data;
  },

  /**
   * Mengambil detail billing berdasarkan ID
   */
  getBillingById: async (id: string): Promise<{ success: boolean; data: Billing }> => {
    const response = await rmeClient.get(`/api/v1/billing/${id}`);
    return response.data;
  },

  /**
   * Mengambil billing berdasarkan invoice number
   */
  getBillingByInvoice: async (noInvoice: string): Promise<BillingResponse> => {
    const response = await rmeClient.get<BillingResponse>("/api/v1/billing/invoice", {
      params: { noInvoice }
    });
    return response.data;
  },

  /**
   * Mengambil billing berdasarkan pasien ID
   */
  getBillingByPasien: async (pasienId: string): Promise<BillingResponse> => {
    const response = await rmeClient.get<BillingResponse>("/api/v1/billing/pasien", {
      params: { pasienId }
    });
    return response.data;
  },

  /**
   * Mengambil billing berdasarkan janji ID
   */
  getBillingByJanji: async (janjiId: string): Promise<{ success: boolean; data: Billing }> => {
    const response = await rmeClient.get(`/api/v1/billing/janji/${janjiId}`);
    return response.data;
  },

  /**
   * Membuat billing baru
   */
  createBilling: async (payload: any): Promise<{ success: boolean; data: Billing }> => {
    const response = await rmeClient.post("/api/v1/billing", payload);
    return response.data;
  },

  /**
   * Update status billing
   */
  updateBillingStatus: async (id: string, status: string): Promise<{ success: boolean; data: Billing }> => {
    const response = await rmeClient.patch(`/api/v1/billing/${id}/status`, { status });
    return response.data;
  },

  /**
   * Registrasi pembayaran billing
   */
  registerPayment: async (id: string, payload: any): Promise<{ success: boolean; data: Billing }> => {
    const response = await rmeClient.post(`/api/v1/billing/${id}/payment`, payload);
    return response.data;
  }
};
