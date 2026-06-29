import { chatbotClient, askChatbot } from "@/api/chatbotCient";
import type {
  PaymentMethodsAnalyticsResponse,
  RevenueAnalyticsResponse,
  SummaryAnalyticsResponse,
  TopSpendAnalyticsResponse,
  TopItemsAnalyticsResponse,
  AiInsightAnalyticsResponse
} from "../types/chatbot.types";

export const chatbotService = {
  // ---------------------------------------------------------------------------
  // ANALYTICS ENDPOINTS
  // ---------------------------------------------------------------------------

  // GET /api/v1/analytics/payment-methods (Metode Pembayaran / Split Bill)
  getPaymentMethods: async (): Promise<PaymentMethodsAnalyticsResponse> => {
    const response = await chatbotClient.get("/api/v1/analytics/payment-methods");
    return response.data;
  },

  // GET /api/v1/analytics/revenue (Tren Revenue Finansial)
  getRevenue: async (): Promise<RevenueAnalyticsResponse> => {
    const response = await chatbotClient.get("/api/v1/analytics/revenue");
    return response.data;
  },

  // GET /api/v1/analytics/summary (Ringkasan Analitik Dashboard)
  getSummary: async (): Promise<SummaryAnalyticsResponse> => {
    const response = await chatbotClient.get("/api/v1/analytics/summary");
    return response.data;
  },

  // POST /api/v1/analytics/etl/trigger (Picu Sinkronisasi ETL Manual)
  triggerEtl: async () => {
    const response = await chatbotClient.post("/api/v1/analytics/etl/trigger");
    return response.data;
  },

  // GET /api/v1/analytics/etl/status (Cek Status Sinkronisasi ETL)
  getEtlStatus: async () => {
    const response = await chatbotClient.get("/api/v1/analytics/etl/status");
    return response.data;
  },

  // GET /api/v1/analytics/top-spend (Analisis Top Spend)
  getTopSpend: async (): Promise<TopSpendAnalyticsResponse> => {
    const response = await chatbotClient.get("/api/v1/analytics/top-spend");
    return response.data;
  },

  // GET /api/v1/analytics/top-items (Obat & Layanan Terlaris)
  getTopItems: async (): Promise<TopItemsAnalyticsResponse> => {
    const response = await chatbotClient.get("/api/v1/analytics/top-items");
    return response.data;
  },

  // GET /api/v1/analytics/ai-insight (Analisis AI Insight Keuangan & Operasional)
  getAiInsight: async (): Promise<AiInsightAnalyticsResponse> => {
    const response = await chatbotClient.get("/api/v1/analytics/ai-insight");
    return response.data;
  },

  // ---------------------------------------------------------------------------
  // CHATBOT ENDPOINTS
  // ---------------------------------------------------------------------------

  // POST /api/v1/chatbot/ask (Tanya Asisten AI Analitik)
  askChatbot: async (question: string, history: any[] = []) => {
    // Kita gunakan fungsi yang sama dari chatbotCient yang sudah menyisipkan rute frontend
    return await askChatbot(question, history);
  },

  // ---------------------------------------------------------------------------
  // HEALTH CHECK
  // ---------------------------------------------------------------------------

  // GET /health (Health Check)
  getHealth: async () => {
    const response = await chatbotClient.get("/health");
    return response.data;
  }
};
