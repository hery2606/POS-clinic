import axios from "axios";
import { secureStorage } from "@/features/auth/store/authStore";

// ==========================================
// 1. INSTANCE UNTUK REKAM MEDIS (RME)
// ==========================================
// Di production (Vercel), gunakan path /proxy/rme agar Vercel forward ke backend (bypass CORS)
// Di development (localhost), langsung ke URL backend
const getRmeBaseUrl = () => {
  const isDev = import.meta.env.DEV;
  return isDev
    ? import.meta.env.VITE_API_RME_URL
    : '/proxy/rme';
};

export const rmeClient = axios.create({
  baseURL: getRmeBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor khusus RME: Menyisipkan token admin RME dari localStorage
rmeClient.interceptors.request.use(
  (config) => {
    const token = secureStorage.getItem('rmeToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token) {
      console.warn("⚠️ RME token tidak ditemukan di localStorage, request akan dikirim tanpa auth");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mekanisme antrean untuk mencegah multiple login bersamaan
let isRmeRefreshing = false;
let rmeRefreshSubscribers: ((token: string) => void)[] = [];

const subscribeRmeTokenRefresh = (cb: (token: string) => void) => {
  rmeRefreshSubscribers.push(cb);
};

const onRmeRefreshed = (token: string) => {
  rmeRefreshSubscribers.forEach((cb) => cb(token));
  rmeRefreshSubscribers = [];
};

// Interceptor response untuk handle 401 (token expired)
rmeClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (!isRmeRefreshing) {
        isRmeRefreshing = true;
        console.warn("⚠️ RME Token expired atau invalid, mencoba re-autentikasi otomatis...");
        
        // Hapus token lama yang sudah kadaluarsa
        secureStorage.removeItem('rmeToken');
        
        try {
          // Coba login otomatis kembali
          await initializeRmeAuth();
          
          // Ambil token baru dari localStorage
          const newToken = secureStorage.getItem('rmeToken');
          isRmeRefreshing = false;
          
          if (newToken) {
            onRmeRefreshed(newToken);
          } else {
            // Jika login tetap gagal
            onRmeRefreshed('');
          }
        } catch (retryError) {
          isRmeRefreshing = false;
          onRmeRefreshed('');
          console.error("❌ Auto-relogin RME gagal secara permanen.");
        }
      }

      // Semua request yang gagal karena 401 akan menunggu di sini sampai token baru didapatkan
      const retryOriginalRequest = new Promise((resolve, reject) => {
        subscribeRmeTokenRefresh((token: string) => {
          if (token) {
            console.log("🔄 Melanjutkan request yang sempat gagal (Auto-Retry)...");
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(rmeClient(originalRequest));
          } else {
            reject(error);
          }
        });
      });
      
      return retryOriginalRequest;
    }
    
    return Promise.reject(error);
  }
);

// Fungsi Otomatisasi Login Sistem/Admin ke RME
export const initializeRmeAuth = async () => {
  const existingToken = secureStorage.getItem('rmeToken');
  
  // Jika sudah ada token di localStorage, tidak perlu hit API login lagi
  if (existingToken) {
    console.log("✅ Token RME sudah ada di localStorage, skip login");
    return;
  }

  try {
    console.log("🔄 Mencoba mengautentikasi Admin ke RME...");
    
    let response;
    if (import.meta.env.DEV) {
      const baseUrl = getRmeBaseUrl();
      response = await axios.post(`${baseUrl}/api/v1/auth/login`, {
        identifier: import.meta.env.VITE_RME_ADMIN_EMAIL, 
        password: import.meta.env.VITE_RME_ADMIN_PASSWORD,
      });
    } else {
      // Di production, tembak ke Vercel serverless function proxy
      response = await axios.post("/api/rmeLogin");
    }

    // Menyesuaikan dengan Response Body sukses -> response.data.data.accessToken
    const token = response.data?.data?.accessToken;
    
    if (token) {
      secureStorage.setItem('rmeToken', token);
      console.log("✅ Autentikasi RME Berhasil! Token disimpan di localStorage.");
    } else {
      console.warn("⚠️ Respon login sukses, tetapi accessToken tidak ditemukan pada struktur data.");
      console.warn("📋 Response:", response.data);
    }
  } catch (error: any) {
    console.error("❌ Gagal melakukan otomatisasi login admin RME");
    if (error.response) {
      console.error(`Status: ${error.response.status} ${error.response.statusText}`);
      console.error("Detail error:", error.response.data);
    } else if (error.request) {
      console.error("Tidak ada respon dari server:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  }
};