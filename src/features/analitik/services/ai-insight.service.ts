"use client";

import { aiClient } from "@/api";
import { type AiInsightsResponse } from "../types/ai-insight.types";

/**
 * Service khusus untuk mengelola data intelijen dan wawasan bisnis (AI Insights)
 * Gateway Server: AI Core Engine Services
 */
export const aiInsightService = {
  
  /**
   * Mengambil data wawasan cerdas (AI Insights Summary) untuk dashboard analitik klinik
   * @returns {Promise<AiInsightsResponse>} Data ringkasan kesimpulan dari AI Core
   */
  getInsights: async (): Promise<AiInsightsResponse> => {
    
   const response = await aiClient.get<AiInsightsResponse>("/api/v1/ai/insights");
  console.log("DATA DARI SERVER:", response.data); // 👈 Intip ini di F12 Inspect Element browser
  return response.data;


  },

  /**
   * Tambahan Opsional: Mengambil data wawasan cerdas dengan filter parameter kustom
   * @param {string} period - Rentang waktu analitik (weekly, monthly, yearly)
   */
  getInsightsByPeriod: async (period: string): Promise<AiInsightsResponse> => {
    const response = await aiClient.get<AiInsightsResponse>("/api/v1/ai/insights", {
      params: { period },
    });
    return response.data;
  }
};