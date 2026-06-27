import axios from 'axios';
import { secureStorage, useAuthStore } from "@/features/auth/store/authStore";


export const posClient = axios.create({
  // 🌐 Membaca env khusus sesuai request-mu
  baseURL: '/proxy/internal', 
  withCredentials: false, // MUTLAK: Agar session cookie/token aman dari backend ikut terkirim
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor otomatis menyisipkan Token JWT Kasir dari localStorage / authStore
posClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().authToken || secureStorage.getItem('authToken'); // Ambil token dari store atau localStorage
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);