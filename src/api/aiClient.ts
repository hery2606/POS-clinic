import axios from "axios";
import { initializeRmeAuth } from "./rmeClient";
import { useAuthStore } from "@/features/auth/store/authStore";

const getAiBaseUrl = () => {
  const url = import.meta.env.VITE_API_AI_URL || "";
  return url.replace(/\/docs\/?$/, "");
};

export const aiClient = axios.create({
  baseURL: getAiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Add RME token from Zustand store to request headers
aiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().rmeToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
aiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ AI Token (RME) expired atau invalid, melakukan re-login...");
      useAuthStore.getState().setRmeToken(null);
      
      try {
        await initializeRmeAuth();
        // Retry request original dengan token baru
        const originalRequest = error.config;
        const token = useAuthStore.getState().rmeToken;
        if (token) {
          if (!originalRequest.headers) {
            originalRequest.headers = {};
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return aiClient(originalRequest);
        }
      } catch (loginError) {
        console.error("❌ Gagal melakukan re-autentikasi RME untuk AI:", loginError);
      }
    }
    return Promise.reject(error);
  }
);