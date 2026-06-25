import axios from "axios";
import { secureStorage } from "@/features/auth/store/authStore";

const getAiBaseUrl = () => {
  return '/proxy/ai';
};

export const aiClient = axios.create({
  baseURL: getAiBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Internal JWT (authToken) from localStorage via secureStorage
aiClient.interceptors.request.use(
  (config) => {
    const token = secureStorage.getItem('authToken');
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
      
      // Hapus token dari localStorage agar user diarahkan kembali ke halaman Login.
      secureStorage.removeItem('authToken');
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);