import { aiClient, posClient } from "@/api";
import { logActivity } from "@/features/analitik/utils/activityLogger";
import { 
  type ActivityLogResponse, 
  type SessionResponse, 
  type RevokeSessionResponse,
  type CreateUserRequest,
  type CreateUserResponse,
  type CreateActivityLogRequest,
  type CreateActivityLogResponse
} from "../types/setting.types";

export const settingService = {
  /**
   * Mengambil data log aktivitas admin (Dibatasi 100 data terbaru agar performa tetap cepat)
   */
  getActivityLogs: async (limit: number = 100): Promise<ActivityLogResponse> => {
    const response = await aiClient.get<ActivityLogResponse>(`/api/v1/settings/activity-logs?limit=${limit}&page=1`);
    return response.data;
  },

  /**
   * Mengambil sesi login aktif dan pelacakan IP
   */
  getSessions: async (): Promise<SessionResponse> => {
    const response = await aiClient.get<SessionResponse>("/api/v1/settings/sessions");
    return response.data;
  },

  /**
   * Menghentikan paksa sesi login tertentu (force logout)
   */
  revokeSession: async (idSesi: string): Promise<RevokeSessionResponse> => {
    const response = await aiClient.post<RevokeSessionResponse>(`/api/v1/settings/sessions/${idSesi}/revoke`);
    logActivity({
      action: 'REVOKE_SESSION',
      module: 'AUTH',
      target_name: 'Session',
      target_id: idSesi,
      detail: `Mencabut sesi ${idSesi}`
    });
    return response.data;
  },

  /**
   * Menambahkan user baru dengan role tertentu
   */
  createUser: async (payload: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await posClient.post<CreateUserResponse>("/api/auth/create-user", payload);
    logActivity({
      action: 'CREATE_USER',
      module: 'AUTH',
      target_name: 'User',
      target_id: response.data.user?.id || 'New',
      detail: `Membuat user baru: ${payload.email}`
    });
    return response.data;
  },

  /**
   * Catat Log Aktivitas Baru
   */
  createActivityLog: async (payload: CreateActivityLogRequest): Promise<CreateActivityLogResponse> => {
    try {
      const response = await aiClient.post<CreateActivityLogResponse>("/api/v1/settings/activity-logs", payload);
      return response.data;
    } catch (error) {
      console.error("Gagal catat log:", error);
      throw error;
    }
  }
};
