import axios from 'axios';
import { secureStorage } from "@/features/auth/store/authStore";


export const posClient = axios.create({
  // 🌐 Membaca env khusus sesuai request-mu
  baseURL: import.meta.env.VITE_API_INTERNAL_URL, 
  withCredentials: false, // MUTLAK: Agar session cookie/token aman dari backend ikut terkirim
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor otomatis menyisipkan Token JWT Kasir dari localStorage
posClient.interceptors.request.use(
  (config) => {
    const token = secureStorage.getItem('authToken'); // Ambil token dari localStorage
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);