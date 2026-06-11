import axios from 'axios';
import AuthService from "@/features/auth/service/auth.service";


export const posClient = axios.create({
  // 🌐 Membaca env khusus sesuai request-mu
  baseURL: import.meta.env.VITE_API_INTERNAL_URL, 
  withCredentials: false, // MUTLAK: Agar session cookie/token aman dari backend ikut terkirim
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor otomatis menyisipkan Token JWT Kasir dari memori Zustand
posClient.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken(); // Ambil token dari RAM state
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);