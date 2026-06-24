import { aiClient, posClient } from "@/api";
import { 
  type ActivityLogResponse, 
  type SessionResponse, 
  type RevokeSessionResponse,
  type CreateUserRequest,
  type CreateUserResponse
} from "../types/setting.types";

export const settingService = {
  /**
   * Mengambil data log aktivitas admin
   */
  getActivityLogs: async (): Promise<ActivityLogResponse> => {
    const response = await aiClient.get<ActivityLogResponse>("/api/v1/settings/activity-logs");
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
    return response.data;
  },

  /**
   * Menambahkan user baru dengan role tertentu
   */
  createUser: async (payload: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await posClient.post<CreateUserResponse>("/api/auth/create-user", payload);
    return response.data;
  }
};
