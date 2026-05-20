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
    }
    return config;
  },
  (error) => Promise.reject(error)
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