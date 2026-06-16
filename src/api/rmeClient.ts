import axios from "axios";
import { useAuthStore } from "@/features/auth/store/authStore";

// ==========================================
// 1. INSTANCE UNTUK REKAM MEDIS (RME)
// ==========================================
export const rmeClient = axios.create({
  baseURL: import.meta.env.VITE_API_RME_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor khusus RME: Menyisipkan token admin RME dari Zustand Store
rmeClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().rmeToken; 
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token) {
      console.warn("⚠️ RME token tidak ditemukan di store, request akan dikirim tanpa auth");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response untuk handle 401 (token expired)
rmeClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ RME Token expired atau invalid, menghapus dari store");
      useAuthStore.getState().setRmeToken(null);
      // Jangan redirect ke login, cukup clear token
      // Component akan trigger ulang initializeRmeAuth saat melakukan request berikutnya
    }
    return Promise.reject(error);
  }
);

// Fungsi Otomatisasi Login Sistem/Admin ke RME
export const initializeRmeAuth = async () => {
  const existingToken = useAuthStore.getState().rmeToken;
  
  // Jika sudah ada token di store, tidak perlu hit API login lagi
  if (existingToken) {
    console.log("✅ Token RME sudah ada di store, skip login");
    return;
  }

  try {
    console.log("🔄 Mencoba mengautentikasi Admin ke RME...");
    
    // PERBAIKAN UTAMA: Mengubah properti 'email' menjadi 'identifier' sesuai request backend
    const response = await axios.post(`${import.meta.env.VITE_API_RME_URL}/api/v1/auth/login`, {
      identifier: import.meta.env.VITE_RME_ADMIN_EMAIL, 
      password: import.meta.env.VITE_RME_ADMIN_PASSWORD,
    });

    // Menyesuaikan dengan Response Body sukses -> response.data.data.accessToken
    const token = response.data?.data?.accessToken;
    
    if (token) {
      useAuthStore.getState().setRmeToken(token);
      console.log("✅ Autentikasi RME Berhasil! Token disimpan di store.");
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