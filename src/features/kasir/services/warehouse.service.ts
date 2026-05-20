import { warehouseClient } from "@/api";
import { type WarehouseMedicineResponse, type WarehouseMedicineStats } from "../types/warehouse.types";

export const warehouseService = {
  /**
   * Mengambil daftar seluruh obat dan alat kesehatan dari server Warehouse (WMS)
   */
  getMedicinesList: async (): Promise<WarehouseMedicineResponse> => {
    const response = await warehouseClient.get<WarehouseMedicineResponse>("/api/v1/obat");
    return response.data;
  },

  /**
   * Mengambil ringkasan data statistik stok obat (Total, Aman, Menipis, Kritis)
   */
  getMedicineStats: async (): Promise<WarehouseMedicineStats> => {
    const response = await warehouseClient.get<WarehouseMedicineStats>("/api/v1/obat/stats");
    return response.data; // Mengembalikan objek flat { total, aman, menipis, kritis } langsung
  },

  /**
   * Contoh fungsi masa depan: Mengambil detail spesifik satu obat jika dibutuhkan
   */
  getMedicineById: async (id: string): Promise<{ data: any }> => {
    const response = await warehouseClient.get(`/api/v1/obat/${id}`);
    return response.data;
  }
};