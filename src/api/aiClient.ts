import axios from "axios";
import AuthService from "@/features/auth/service/auth.service";

export const aiClient = axios.create({
  baseURL: import.meta.env.VITE_API_AI_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token from auth to request headers
aiClient.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
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
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      AuthService.logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);