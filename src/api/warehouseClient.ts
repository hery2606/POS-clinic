import axios from "axios";

export const warehouseClient = axios.create({
  baseURL: import.meta.env.VITE_API_WAREHOUSE_URL,
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

// Interceptor response untuk handle 401 (token expired)
warehouseClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ Warehouse Token expired atau invalid, melakukan re-login...");
      localStorage.removeItem("warehouse_auth_token");
      
      try {
        await initializeWarehouseAuth();
        // Retry request original dengan token baru
        const originalRequest = error.config;
        const token = localStorage.getItem("warehouse_auth_token");
        if (token) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return warehouseClient(originalRequest);
        }
      } catch (loginError) {
        console.error("❌ Failed to re-authenticate warehouse:", loginError);
      }
    }
    return Promise.reject(error);
  }
);

// Fungsi Axios murni untuk menembak login (akan dipanggil oleh React Query)
export const loginWarehouseAdmin = async () => {
  console.log("Mencoba mengautentikasi sistem ke server Warehouse...");
  const response = await axios.post(`${import.meta.env.VITE_API_WAREHOUSE_URL}/api/v1/auth/login`, {
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
    
    const response = await axios.post(`${import.meta.env.VITE_API_WAREHOUSE_URL}/api/v1/auth/login`, {
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