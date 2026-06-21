import axios from "axios";
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

// Add Internal JWT (authToken) from Zustand store to request headers
aiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().authToken; 
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
    const originalRequest = error.config;
    if (originalRequest && error.response?.status === 401 && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      console.warn("⚠️ AI Token (Auth JWT) expired atau invalid.");
      
      // Karena kita menggunakan JWT Login Utama, jika token mati/invalid, 
      // kita cukup menghapus token agar user diarahkan kembali ke halaman Login.
      useAuthStore.getState().clearTokens();
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);