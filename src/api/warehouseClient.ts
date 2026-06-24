import axios from "axios";

// Di production (Vercel), gunakan path /proxy/* agar Vercel yang forward ke backend (bypass CORS)
// Di development (localhost), langsung ke URL backend via vite proxy
const getWarehouseBaseUrl = () => {
  const isDev = import.meta.env.DEV;
  return isDev
    ? import.meta.env.VITE_API_WAREHOUSE_URL
    : '/proxy/warehouse';
};

export const warehouseClient = axios.create({
  baseURL: getWarehouseBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor khusus Warehouse: Menempelkan token WMS otomatis jika ada
warehouseClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("warehouse_auth_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (!token) {
      console.warn("⚠️ Warehouse token tidak ditemukan di localStorage");
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mekanisme antrean untuk mencegah multiple login bersamaan
let isWarehouseRefreshing = false;
let warehouseRefreshSubscribers: ((token: string) => void)[] = [];

const subscribeWarehouseTokenRefresh = (cb: (token: string) => void) => {
  warehouseRefreshSubscribers.push(cb);
};

const onWarehouseRefreshed = (token: string) => {
  warehouseRefreshSubscribers.forEach((cb) => cb(token));
  warehouseRefreshSubscribers = [];
};

// Interceptor response untuk handle 401 (token expired)
warehouseClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (!isWarehouseRefreshing) {
        isWarehouseRefreshing = true;
        console.warn("⚠️ Warehouse Token expired atau invalid, melakukan re-login...");
        localStorage.removeItem("warehouse_auth_token");
        
        try {
          await initializeWarehouseAuth();
          
          const token = localStorage.getItem("warehouse_auth_token");
          isWarehouseRefreshing = false;
          
          if (token) {
            onWarehouseRefreshed(token);
          } else {
            // Jika login tetap gagal
            onWarehouseRefreshed('');
          }
        } catch (loginError) {
          isWarehouseRefreshing = false;
          onWarehouseRefreshed('');
          console.error("❌ Failed to re-authenticate warehouse:", loginError);
        }
      }

      // Semua request yang gagal karena 401 akan menunggu di sini sampai token baru didapatkan
      const retryOriginalRequest = new Promise((resolve, reject) => {
        subscribeWarehouseTokenRefresh((token: string) => {
          if (token) {
            console.log("🔄 Melanjutkan request Warehouse yang sempat gagal (Auto-Retry)...");
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(warehouseClient(originalRequest));
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

// Fungsi Axios murni untuk menembak login (akan dipanggil oleh React Query)
export const loginWarehouseAdmin = async () => {
  console.log("Mencoba mengautentikasi sistem ke server Warehouse...");
  const baseUrl = getWarehouseBaseUrl();
  const response = await axios.post(`${baseUrl}/api/v1/auth/login`, {
    email: import.meta.env.VITE_WAREHOUSE_ADMIN_EMAIL,
    password: import.meta.env.VITE_WAREHOUSE_ADMIN_PASSWORD,
  });
  
  /// PERBAIKAN: Langsung tembak ke response.data.accessToken sesuai dengan JSON body terlampir
  const token = response.data?.accessToken;
  
  if (token) {
    return token;
  } else {
    console.warn("Autentikasi Warehouse sukses, tetapi properti accessToken kosong.");
    return null;
  }
};

// Fungsi Otomatisasi Login Sistem/Admin ke Warehouse
export const initializeWarehouseAuth = async () => {
  const existingToken = localStorage.getItem("warehouse_auth_token");
  
  // Jika sudah ada token di browser, tidak perlu hit API login lagi
  if (existingToken) {
    console.log("✅ Token Warehouse sudah ada di localStorage, skip login");
    return;
  }

  try {
    console.log("🔄 Mencoba mengautentikasi Admin ke Warehouse...");
    const baseUrl = getWarehouseBaseUrl();
    const response = await axios.post(`${baseUrl}/api/v1/auth/login`, {
      email: import.meta.env.VITE_WAREHOUSE_ADMIN_EMAIL,
      password: import.meta.env.VITE_WAREHOUSE_ADMIN_PASSWORD,
    });

    const token = response.data?.accessToken;
    
    if (token) {
      localStorage.setItem("warehouse_auth_token", token);
      console.log("✅ Autentikasi Warehouse Berhasil! Token disimpan di localStorage.");
    } else {
      console.warn("⚠️ Respon login sukses, tetapi accessToken tidak ditemukan pada struktur data.");
      console.warn("📋 Response:", response.data);
    }
  } catch (error: any) {
    console.error("❌ Gagal melakukan otomatisasi login admin Warehouse");
    console.error("📧 Email digunakan:", import.meta.env.VITE_WAREHOUSE_ADMIN_EMAIL ?? "undefined (ENV tidak terbaca!)");
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error("Detail error:", JSON.stringify(error.response.data));
    } else {
      console.error("Error:", error.message);
    }
  }
};