import { aiClient } from "@/api";
// Import tipe data baru yang memuat skema raw_markdown
import { type VisumReport } from "../types/visum.types.ts";

export const visumService = {
  /**
   * Mengambil analisis ringkasan bisnis otomatis dari Engine AI Klinik
   * Method diubah menjadi GET dan diarahkan ke endpoint /bisnis yang riil
   */
  generateVisumReport: async (): Promise<VisumReport> => {
    const response = await aiClient.get<VisumReport>("/api/v1/ai/visum/bisnis");
    return response.data;
  },
};